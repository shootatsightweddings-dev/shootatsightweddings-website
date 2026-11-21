const cloudflareBaseUrl = () => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_API_TOKEN;
  if (!accountId || !token) {
    const error = new Error('Cloudflare Stream is not configured yet. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_STREAM_API_TOKEN on the server.');
    error.statusCode = 503;
    throw error;
  }
  return { accountId, token, url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream` };
};

const cfRequest = async (url, token, options = {}) => {
  const response = await fetch(url, {
    redirect: 'manual',
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
  return response;
};

// The browser starts a TUS upload at this protected endpoint. We create the
// Cloudflare upload session server-side, so the Cloudflare API token never
// reaches the browser. The browser then uploads bytes directly to the one-time
// Cloudflare URL, which avoids routing multi-GB wedding films through our API.
const createTusUpload = async (req, res, next) => {
  try {
    const { token, url } = cloudflareBaseUrl();
    const uploadLength = Number(req.get('upload-length'));
    if (!Number.isFinite(uploadLength) || uploadLength <= 0) {
      const error = new Error('A valid video file size is required.');
      error.statusCode = 400;
      throw error;
    }

    const maxBytes = 20 * 1024 * 1024 * 1024; // 20 GB safety ceiling
    if (uploadLength > maxBytes) {
      const error = new Error('Videos larger than 20 GB cannot be uploaded from this dashboard.');
      error.statusCode = 413;
      throw error;
    }

    const metadata = req.get('upload-metadata') || '';
    const response = await cfRequest(`${url}?direct_user=true`, token, {
      method: 'POST',
      headers: {
        'Tus-Resumable': '1.0.0',
        'Upload-Length': String(uploadLength),
        ...(metadata ? { 'Upload-Metadata': metadata } : {}),
      },
    });

    if (!response.ok && response.status !== 201) {
      const body = await response.text();
      const error = new Error(`Cloudflare Stream could not create the upload: ${body || response.statusText}`);
      error.statusCode = 502;
      throw error;
    }

    const uploadUrl = response.headers.get('location');
    if (!uploadUrl) {
      const error = new Error('Cloudflare Stream did not return an upload location.');
      error.statusCode = 502;
      throw error;
    }
    const streamUid = response.headers.get('stream-media-id') || uploadUrl.split('?')[0].split('/').filter(Boolean).pop();
    res.status(201)
      .set('Tus-Resumable', '1.0.0')
      .set('Location', uploadUrl)
      .set('Stream-Media-Id', streamUid)
      .set('Access-Control-Expose-Headers', 'Location, Stream-Media-Id, Tus-Resumable')
      .end();
  } catch (error) {
    next(error);
  }
};

const getStreamVideo = async (req, res, next) => {
  try {
    const { token, url } = cloudflareBaseUrl();
    const response = await cfRequest(`${url}/${encodeURIComponent(req.params.uid)}`, token);
    const payload = await response.json();
    if (!response.ok || !payload.success) {
      const error = new Error(payload.errors?.[0]?.message || 'Cloudflare Stream could not find this video.');
      error.statusCode = response.status || 502;
      throw error;
    }
    const video = payload.result;
    res.json({
      success: true,
      video: {
        uid: video.uid,
        readyToStream: Boolean(video.readyToStream),
        status: video.status,
        duration: video.duration,
        thumbnail: video.thumbnail,
        preview: video.preview,
        playback: video.playback,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteStreamVideo = async (req, res, next) => {
  try {
    const { token, url } = cloudflareBaseUrl();
    const response = await cfRequest(`${url}/${encodeURIComponent(req.params.uid)}`, token, { method: 'DELETE' });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const error = new Error(payload.errors?.[0]?.message || 'Cloudflare Stream could not delete this video.');
      error.statusCode = response.status || 502;
      throw error;
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTusUpload, getStreamVideo, deleteStreamVideo };
