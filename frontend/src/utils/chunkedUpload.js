// Uploads a video to the server in pieces so large wedding films survive a
// dropped connection: a failed piece is retried, and an interrupted upload
// carries on from what the server already has. If the same file is picked
// again after closing the browser, it resumes instead of starting over.
// Server side: backend/src/services/chunkedUploads.js.

const MAX_CONSECUTIVE_FAILURES = 8;

const memoryStore = new Map();
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return memoryStore.get(k) ?? null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { memoryStore.set(k, v); } },
  remove: (k) => { try { localStorage.removeItem(k); } catch { memoryStore.delete(k); } },
};

const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class UploadError extends Error {}

/**
 * @param {File|Blob} file
 * @param {{ apiUrl: string, token: string, onProgress?: (percent:number)=>void,
 *           fetchImpl?: typeof fetch, storage?: typeof store, sleep?: (ms:number)=>Promise<void> }} options
 * @returns {Promise<{url:string, processing:boolean, playableNow?:boolean}>}
 */
export async function uploadVideoInPieces(file, { apiUrl, token, onProgress, fetchImpl = fetch, storage = store, sleep = defaultSleep }) {
  const base = `${apiUrl}/videos/uploads`;
  const auth = { Authorization: `Bearer ${token}` };
  const key = `video-upload:${file.name}:${file.size}:${file.lastModified || 0}`;

  const call = async (url, init = {}) => {
    const res = await fetchImpl(url, { ...init, headers: { ...auth, ...(init.headers || {}) } });
    let body = {};
    try { body = await res.json(); } catch { /* non-JSON (e.g. a proxy error page) */ }
    return { status: res.status, ok: res.ok, body };
  };

  const LOGIN_EXPIRED = 'Your admin login has expired. Log in again and pick the same file to resume the upload.';
  const OFFLINE = 'Could not reach the server. Check the internet connection and pick the same file again to resume.';
  const finished = (result) => { storage.remove(key); onProgress?.(100); return result; };

  // Resume an earlier attempt at this same file if the server still has it.
  // Only forget it when the server says it is gone, not on a passing network blip.
  let id = storage.get(key);
  let received = 0;
  let chunkBytes = 16 * 1024 * 1024;
  if (id) {
    const res = await call(`${base}/${id}`).catch(() => null);
    if (res?.ok && res.body.done) return finished(res.body.result); // already finished earlier
    if (res?.ok) ({ received, chunkBytes } = res.body);
    else if (res?.status === 404) { storage.remove(key); id = null; }
    else if (res?.status === 401 || res?.status === 403) throw new UploadError(LOGIN_EXPIRED);
    else throw new UploadError(OFFLINE);
  }
  if (!id) {
    const res = await call(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, size: file.size, type: file.type }),
    }).catch(() => { throw new UploadError(OFFLINE); });
    if (res.status === 401 || res.status === 403) throw new UploadError(LOGIN_EXPIRED);
    if (!res.ok) throw new UploadError(res.body.message || `Could not start the upload (HTTP ${res.status}).`);
    ({ id, received, chunkBytes } = res.body);
    storage.set(key, id);
  }

  const report = () => onProgress?.(Math.min(99, Math.floor((received / file.size) * 100)));
  report();

  let failures = 0;
  while (received < file.size) {
    const end = Math.min(received + chunkBytes, file.size);
    let res;
    try {
      res = await call(`${base}/${id}?offset=${received}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: file.slice(received, end),
      });
    } catch {
      res = null; // network error: retry below
    }

    if (res?.ok) {
      received = res.body.received;
      failures = 0;
      report();
      continue;
    }
    if (res && res.status === 409 && Number.isFinite(res.body.received) && res.body.received !== received) {
      received = res.body.received; // server tells us where to continue
      continue;
    }
    // (A 409 at the same position means the server is still busy with an
    // earlier copy of this piece: fall through, wait, and try again.)
    if (res && (res.status === 401 || res.status === 403)) throw new UploadError(LOGIN_EXPIRED);
    if (res && res.status === 404) {
      storage.remove(key);
      throw new UploadError('This upload expired on the server. Please start it again.');
    }
    if (res && res.status === 400 && !/resend|incomplete|dropped/i.test(res.body.message || '')) {
      throw new UploadError(res.body.message || 'The server rejected the upload.');
    }

    failures += 1;
    if (failures >= MAX_CONSECUTIVE_FAILURES) {
      throw new UploadError('The connection keeps dropping. Pick the same file again later to resume from where it stopped.');
    }
    // Wait a little longer after each failure (2 s, 4 s, ... up to 30 s), then
    // ask the server what it actually has before resending.
    await sleep(Math.min(30000, 2000 * 2 ** (failures - 1)));
    const check = await call(`${base}/${id}`).catch(() => null);
    if (check?.ok) received = check.body.received;
  }

  // Finish. Retried like the pieces: the server returns the same result if it
  // already finished, so a lost reply here never means uploading again.
  for (let attempt = 1; ; attempt++) {
    const done = await call(`${base}/${id}/complete`, { method: 'POST' }).catch(() => null);
    if (done?.ok) return finished(done.body);
    if (done && (done.status === 401 || done.status === 403)) throw new UploadError(LOGIN_EXPIRED);
    if (done && done.status < 500) throw new UploadError(done.body.message || `Could not finish the upload (HTTP ${done.status}).`);
    if (attempt >= MAX_CONSECUTIVE_FAILURES) {
      throw new UploadError('The video is on the server but the last step could not be confirmed. Pick the same file again to finish (it will not re-upload).');
    }
    await sleep(Math.min(30000, 2000 * 2 ** (attempt - 1)));
  }
}
