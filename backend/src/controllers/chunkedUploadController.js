const uploads = require('../services/chunkedUploads');

// Every reply includes `received` when known, so the browser can resume.
const reply = (handler) => async (req, res) => {
  try {
    res.json({ success: true, ...(await handler(req)) });
  } catch (err) {
    const status = err.statusCode || 500;
    if (status >= 500) console.error('Video upload error:', err);
    res.status(status).json({ success: false, message: err.message, ...(err.received !== undefined ? { received: err.received } : {}) });
  }
};

module.exports = {
  startUpload: reply((req) => uploads.start(req.body || {})),
  uploadStatus: reply((req) => uploads.status(req.params.id)),
  uploadChunk: reply((req) => uploads.receiveChunk(req.params.id, req.query.offset, req)),
  completeUpload: reply((req) => uploads.complete(req.params.id)),
};
