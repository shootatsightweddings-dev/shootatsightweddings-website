const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const Image = require('../models/Image');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const getR2Client = () =>
  new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

const optimizeImage = async (buffer) => {
  return sharp(buffer)
    .rotate()                                          // auto-rotate camera orientation based on EXIF metadata
    .resize({ width: 2400, withoutEnlargement: true }) // cap at 2400px, never upscale
    .webp({ quality: 85 })                             // convert to webp, 85% quality
    .toBuffer();
};

const uploadToR2 = async (buffer, filename) => {
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: 'image/webp',
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${filename}`;
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

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
    const url = await uploadToR2(optimized, filename);

    const image = await Image.create({
      url,
      filename,
      originalName: originalname,
      mimeType: 'image/webp',
      size: optimized.length,
    });

    return res.status(201).json({ success: true, url: image.url, id: image._id });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImage };
