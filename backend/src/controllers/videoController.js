// The file has already been saved on this server by the videoUpload
// middleware; reply with the path the site serves it from.
const uploadVideo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No video file provided.' });
  }
  return res.json({ success: true, url: `/uploads/videos/${req.file.filename}` });
};

module.exports = { uploadVideo };
