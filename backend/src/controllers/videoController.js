const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const getR2Client = () =>
  new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

const uploadVideo = async (req, res, next) => {
  let tempFilePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file provided.' });
    }

    tempFilePath = req.file.path;
    const originalExt = path.extname(req.file.originalname) || '.mp4';
    const filename = `videos/${uuidv4()}${originalExt}`;
    const client = getR2Client();

    const fileStream = fs.createReadStream(tempFilePath);

    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
        Body: fileStream,
        ContentType: req.file.mimetype || 'video/mp4',
        ContentLength: req.file.size,
      })
    );

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;
    return res.json({ success: true, url: publicUrl });
  } catch (err) {
    next(err);
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        console.warn('Could not clean up temp video file:', e.message);
      }
    }
  }
};

module.exports = { uploadVideo };
