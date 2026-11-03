// import.meta.env.DEV (not hostname) decides this: Vite's dev server and the
// Express API run as two separate local processes on different ports, so dev
// mode needs a hardcoded backend URL. Any built bundle — whether served by
// the real production server or a locally-run production build (as the
// prerender script does, on whatever port it picks) — has the API on the
// *same* origin the page was served from, so same-origin is always correct
// there regardless of hostname or port.
export const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : `${window.location.origin}/api`);
