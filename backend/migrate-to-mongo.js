/**
 * One-time migration: imports all entries from shoots-db.json into MongoDB
 * Run: node migrate-to-mongo.js
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { Schema, model } = mongoose;

const shootSchema = new Schema(
  {
    title: { type: String, required: true },
    slug:  { type: String, required: true },
    category: String,
    location: String,
    date: String,
    desc: String,
    heroImage: String,
    gallery: [String],
  },
  { timestamps: true, autoIndex: false }
);

const Shoot = model('Shoot', shootSchema);

const LOCAL_DB_PATH = path.join(__dirname, 'shoots-db.json');

async function migrate() {
  console.log('\n🚀 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('✅ Connected!\n');

  const localShoots = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
  console.log(`📂 Found ${localShoots.length} entries in shoots-db.json\n`);

  let added = 0, skipped = 0;

  for (const s of localShoots) {
    const existing = await Shoot.findOne({ slug: s.slug });
    if (existing) {
      console.log(`⏭️  Skipped (already in DB): ${s.title}`);
      skipped++;
      continue;
    }
    await Shoot.create({
      title:     s.title,
      slug:      s.slug,
      category:  s.category,
      location:  s.location,
      date:      s.date,
      desc:      s.desc,
      heroImage: s.heroImage,
      gallery:   s.gallery || [],
    });
    console.log(`✅ Imported: ${s.title}`);
    added++;
  }

  console.log(`\n🎉 Done! Added: ${added}  |  Skipped: ${skipped}`);
  await mongoose.disconnect();
}

migrate().catch(e => { console.error('❌ Migration failed:', e.message); process.exit(1); });
