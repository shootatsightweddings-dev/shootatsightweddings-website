const { isAvailable, enqueue, getStatus } = require('../services/videoProcessing');

// The file has already been saved on this server by the videoUpload
// middleware. If ffmpeg is installed it is queued for web optimisation; the
// URL returned stays the same before and after conversion.
const uploadVideo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No video file provided.' });
  }
  if (isAvailable() && req.videoId) {
    const url = enqueue(req.videoId, req.file.filename);
    const playableNow = req.file.filename === `${req.videoId}.mp4`;
    return res.json({ success: true, url, processing: true, playableNow });
  }
  return res.json({ success: true, url: `/uploads/videos/${req.file.filename}`, processing: false });
};

// Admin can check whether a conversion has finished.
const videoStatus = (req, res) => {
  const status = getStatus(req.params.id);
  if (!status) return res.status(404).json({ success: false, message: 'Unknown video.' });
  return res.json({ success: true, ...status });
};

module.exports = { uploadVideo, videoStatus };
