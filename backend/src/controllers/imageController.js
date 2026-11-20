const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const optimizeImage = async (buffer) => {
  return sharp(buffer)
    .rotate()                                          // auto-rotate camera orientation based on EXIF metadata
    .resize({ width: 2400, withoutEnlargement: true }) // cap at 2400px, never upscale
    .webp({ quality: 85 })                             // convert to webp, 85% quality
    .toBuffer();
};

// Uploaded images are stored on this server and served from /uploads (server.js).
const uploadLocal = (buffer, filename) => {
  const uploadDir = path.join(__dirname, '..', '..', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  fs.writeFileSync(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const altText = String(req.body.altText || '').trim();
    if (!altText) return res.status(400).json({success:false,message:'An image description is required.'});
    const { mimetype, size, buffer, originalname } = req.file;

    if (!ALLOWED_TYPES.includes(mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only jpg, png, and webp are allowed.',
      });
    }

    if (size > MAX_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10 MB.',
      });
    }

    const optimized = await optimizeImage(buffer);
    const filename = `${uuidv4()}.webp`;
    const url = uploadLocal(optimized, filename);

    const image = await Image.create({
      url,
      filename,
      originalName: originalname,
      altText,
      mimeType: 'image/webp',
      size: optimized.length,
    });

    return res.status(201).json({ success: true, url: image.url, id: image._id, altText: image.altText });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImage };
