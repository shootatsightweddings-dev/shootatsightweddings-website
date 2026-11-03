const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Shoot = require('../models/Shoot');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// Helper to determine if R2 is configured
const isR2Configured = () => {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    process.env.R2_PUBLIC_URL
  );
};

// Get Cloudflare R2 S3 Client
const getR2Client = () =>
  new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

// Optimize image to next-gen .webp format
const optimizeImage = async (buffer) => {
  return sharp(buffer)
    .rotate()                                          // auto-rotate camera orientation based on EXIF metadata
    .resize({ width: 2400, withoutEnlargement: true }) // cap at 2400px width
    .webp({ quality: 85 })                             // webp high-performance compression
    .toBuffer();
};

// Handle generic upload (R2 or Local Folder fallback)
const processAndStoreImage = async (buffer, filename, req) => {
  const optimized = await optimizeImage(buffer);

  if (isR2Configured()) {
    // Cloudflare R2 Upload
    const client = getR2Client();
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
        Body: optimized,
        ContentType: 'image/webp',
      })
    );
    return `${process.env.R2_PUBLIC_URL}/${filename}`;
  } else {
    // Local Folder Fallback
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, optimized);

    // Build local server URL
    const protocol = req.secure ? 'https' : 'http';
    const host = req.get('host');
    return `${protocol}://${host}/uploads/${filename}`;
  }
};

// Helper to delete an image file (R2 or Local)
const deleteStoredImage = async (url) => {
  if (!url) return;

  if (isR2Configured() && url.includes(process.env.R2_PUBLIC_URL)) {
    try {
      const filename = url.replace(`${process.env.R2_PUBLIC_URL}/`, '');
      const client = getR2Client();
      await client.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: filename,
        })
      );
    } catch (err) {
      console.error(`Failed to delete ${url} from R2:`, err.message);
    }
  } else if (url.includes('/uploads/')) {
    try {
      const filename = url.substring(url.lastIndexOf('/') + 1);
      const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(`Failed to delete local file ${url}:`, err.message);
    }
  }
};

// --- LOCAL OFFLINE JSON DATABASE FALLBACK HELPERS ---
const LOCAL_DB_PATH = path.join(__dirname, '..', '..', 'shoots-db.json');

const readLocalShoots = () => {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeLocalShoots = (data) => {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// 1. GET ALL SHOOTS
const getAllShoots = async (req, res, next) => {
  try {
    // Use Promise.race so a slow/pending MongoDB connection doesn't hang the request
    const dbShoots = await Promise.race([
      Shoot.find().sort({ createdAt: 1 }).lean(),  // oldest first = correct left-to-right scroll order
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('MongoDB timeout')), 2000)
      )
    ]);

    // Merge MongoDB results with local JSON — deduplicated by slug
    const localShoots = readLocalShoots();
    const dbSlugs = new Set(dbShoots.map(s => s.slug));
    const localOnly = localShoots.filter(s => !dbSlugs.has(s.slug));
    const merged = [...dbShoots, ...localOnly];

    return res.json({ success: true, count: merged.length, data: merged });
  } catch (err) {
    console.warn('⚠️ MongoDB unavailable or timed out — serving shoots-db.json fallback');
    const localShoots = readLocalShoots();
    return res.json({ success: true, count: localShoots.length, data: localShoots });
  }
};

// 2. GET SINGLE SHOOT BY ID OR SLUG
const getShootByIdOrSlug = async (req, res, next) => {
  const { idOrSlug } = req.params;
  try {
    let shoot = await Shoot.findOne({ slug: idOrSlug });

    if (!shoot && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      shoot = await Shoot.findById(idOrSlug);
    }

    if (!shoot) {
      const localShoots = readLocalShoots();
      shoot = localShoots.find(s => s.slug === idOrSlug || s._id === idOrSlug);
    }

    if (!shoot) {
      return res.status(404).json({ success: false, message: 'Shoot not found' });
    }

    return res.json({ success: true, data: shoot });
  } catch (err) {
    console.warn('⚠️ MongoDB connection offline. Searching local shoots-db.json fallback...');
    const localShoots = readLocalShoots();
    const shoot = localShoots.find(s => s.slug === idOrSlug || s._id === idOrSlug);
    if (!shoot) {
      return res.status(404).json({ success: false, message: 'Shoot not found' });
    }
    return res.json({ success: true, data: shoot });
  }
};

// 3. CREATE SHOOT
const createShoot = async (req, res, next) => {
  try {
    const { title, category, location, date, desc } = req.body;

    if (!title || !category || !location || !date || !desc) {
      return res.status(400).json({ success: false, message: 'Please provide all required text fields.' });
    }

    if (!req.files || !req.files['heroImage'] || req.files['heroImage'].length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload a Hero Cover Image.' });
    }

    // Generate unique slug
    const slug = title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-'); // Replace multiple - with single -

    // Check if slug is already used in DB or local fallback
    let slugExists = false;
    try {
      const existingShoot = await Shoot.findOne({ slug });
      if (existingShoot) slugExists = true;
    } catch (e) {
      const localShoots = readLocalShoots();
      slugExists = localShoots.some(s => s.slug === slug);
    }

    if (slugExists) {
      return res.status(400).json({ success: false, message: 'A shoot with this title or similar slug already exists.' });
    }

    // Process Hero Image
    const heroFile = req.files['heroImage'][0];
    const heroFilename = `${uuidv4()}.webp`;
    const heroImageUrl = await processAndStoreImage(heroFile.buffer, heroFilename, req);

    // Process Gallery Images
    const galleryUrls = [];
    if (req.files['gallery'] && req.files['gallery'].length > 0) {
      const galleryUploadPromises = req.files['gallery'].map(async (file) => {
        const fileFilename = `${uuidv4()}.webp`;
        const fileUrl = await processAndStoreImage(file.buffer, fileFilename, req);
        return fileUrl;
      });
      const resolvedUrls = await Promise.all(galleryUploadPromises);
      galleryUrls.push(...resolvedUrls);
    }

    // Save Shoot to DB or Local fallback
    try {
      const shoot = await Shoot.create({
        title,
        slug,
        category,
        location,
        date,
        desc,
        heroImage: heroImageUrl,
        gallery: galleryUrls,
      });

      return res.status(201).json({ success: true, data: shoot });
    } catch (dbErr) {
      console.warn('⚠️ MongoDB connection offline. Saving shoot details to local shoots-db.json fallback...');
      const localShoots = readLocalShoots();
      const newShoot = {
        _id: uuidv4(),
        title,
        slug,
        category,
        location,
        date,
        desc,
        heroImage: heroImageUrl,
        gallery: galleryUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localShoots.unshift(newShoot); // prepend
      writeLocalShoots(localShoots);
      return res.status(201).json({ success: true, data: newShoot });
    }
  } catch (err) {
    next(err);
  }
};

// 4. DELETE SHOOT
const deleteShoot = async (req, res, next) => {
  const { id } = req.params;
  try {
    const shoot = await Shoot.findById(id);

    if (!shoot) {
      // Check local fallback
      const localShoots = readLocalShoots();
      const shootIndex = localShoots.findIndex(s => s._id === id);
      if (shootIndex !== -1) {
        const localShoot = localShoots[shootIndex];
        await deleteStoredImage(localShoot.heroImage);
        if (localShoot.gallery && localShoot.gallery.length > 0) {
          await Promise.all(localShoot.gallery.map(deleteStoredImage));
        }
        localShoots.splice(shootIndex, 1);
        writeLocalShoots(localShoots);
        return res.json({ success: true, message: 'Shoot and associated images deleted successfully from local database.' });
      }
      return res.status(404).json({ success: false, message: 'Shoot not found' });
    }

    // Delete Hero image
    await deleteStoredImage(shoot.heroImage);

    // Delete all gallery images
    if (shoot.gallery && shoot.gallery.length > 0) {
      const deletePromises = shoot.gallery.map(async (url) => {
        await deleteStoredImage(url);
      });
      await Promise.all(deletePromises);
    }

    // Delete shoot from DB
    await Shoot.findByIdAndDelete(id);

    return res.json({ success: true, message: 'Shoot and associated images deleted successfully.' });
  } catch (err) {
    console.warn('⚠️ MongoDB connection offline. Deleting shoot from local shoots-db.json fallback...');
    const localShoots = readLocalShoots();
    const shootIndex = localShoots.findIndex(s => s._id === id);
    if (shootIndex === -1) {
      return res.status(404).json({ success: false, message: 'Shoot not found' });
    }

    const shoot = localShoots[shootIndex];
    await deleteStoredImage(shoot.heroImage);
    if (shoot.gallery && shoot.gallery.length > 0) {
      await Promise.all(shoot.gallery.map(deleteStoredImage));
    }

    localShoots.splice(shootIndex, 1);
    writeLocalShoots(localShoots);
    return res.json({ success: true, message: 'Shoot deleted from offline fallback database.' });
  }
};

module.exports = {
  getAllShoots,
  getShootByIdOrSlug,
  createShoot,
  deleteShoot,
  addGalleryImages,
  removeGalleryImage,
  updateHeroImage,
};

// ─── HELPERS: find & persist shoots (mongo + local JSON fallback) ────────────
function findLocalShootIndex(idOrSlug, localShoots) {
  return localShoots.findIndex((s) => s._id === idOrSlug || s.slug === idOrSlug);
}

async function findShoot(idOrSlug) {
  try {
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      const byId = await Shoot.findById(idOrSlug);
      if (byId) return { shoot: byId, storage: 'mongo' };
    }
    const bySlug = await Shoot.findOne({ slug: idOrSlug });
    if (bySlug) return { shoot: bySlug, storage: 'mongo' };
  } catch (err) {
    console.warn('⚠️ MongoDB lookup failed, checking local shoots-db.json fallback...');
  }

  const localShoots = readLocalShoots();
  const localIndex = findLocalShootIndex(idOrSlug, localShoots);
  if (localIndex !== -1) {
    return { shoot: localShoots[localIndex], storage: 'local', localIndex };
  }

  return null;
}

async function persistShoot(found, updates) {
  if (found.storage === 'mongo') {
    Object.assign(found.shoot, updates);
    await found.shoot.save();
    return found.shoot;
  }

  const localShoots = readLocalShoots();
  const localIndex = findLocalShootIndex(found.shoot._id || found.shoot.slug, localShoots);
  if (localIndex === -1) {
    throw new Error('Shoot not found in local database');
  }

  localShoots[localIndex] = {
    ...localShoots[localIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeLocalShoots(localShoots);
  return localShoots[localIndex];
}

// 5. ADD IMAGES TO GALLERY
async function addGalleryImages(req, res, next) {
  try {
    const found = await findShoot(req.params.id);
    if (!found) return res.status(404).json({ success: false, message: 'Shoot not found' });

    const files = req.files?.['gallery'] || [];
    if (files.length === 0)
      return res.status(400).json({ success: false, message: 'No images provided' });

    const newUrls = await Promise.all(
      files.map(async (file) => {
        const filename = `${uuidv4()}.webp`;
        return processAndStoreImage(file.buffer, filename, req);
      })
    );

    const gallery = [...(found.shoot.gallery || []), ...newUrls];
    const updated = await persistShoot(found, { gallery });
    return res.json({ success: true, gallery: updated.gallery });
  } catch (err) { next(err); }
}

// 6. REMOVE ONE IMAGE FROM GALLERY
async function removeGalleryImage(req, res, next) {
  try {
    const found = await findShoot(req.params.id);
    if (!found) return res.status(404).json({ success: false, message: 'Shoot not found' });

    const { imageUrl } = req.body;
    const gallery = [...(found.shoot.gallery || [])];
    const idx = gallery.indexOf(imageUrl);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Image not in gallery' });

    gallery.splice(idx, 1);
    const updated = await persistShoot(found, { gallery });

    // Delete from R2/local storage (non-blocking)
    deleteStoredImage(imageUrl).catch(() => {});

    return res.json({ success: true, gallery: updated.gallery });
  } catch (err) { next(err); }
}

// 7. UPDATE HERO / COVER IMAGE
async function updateHeroImage(req, res, next) {
  try {
    const found = await findShoot(req.params.id);
    if (!found) return res.status(404).json({ success: false, message: 'Shoot not found' });

    const heroFile = req.files?.['heroImage']?.[0];
    if (!heroFile) return res.status(400).json({ success: false, message: 'No hero image provided' });

    const oldHero = found.shoot.heroImage;
    const filename = `${uuidv4()}.webp`;
    const heroImageUrl = await processAndStoreImage(heroFile.buffer, filename, req);
    const updated = await persistShoot(found, { heroImage: heroImageUrl });

    // Delete old hero from R2 (non-blocking)
    if (oldHero) deleteStoredImage(oldHero).catch(() => {});

    return res.json({ success: true, heroImage: updated.heroImage });
  } catch (err) { next(err); }
}
