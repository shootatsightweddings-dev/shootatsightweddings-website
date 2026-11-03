const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const dns = require('dns');

// Configure Node to use Google Public DNS to prevent local DNS SRV resolution issues (ECONNREFUSED)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Bootstrap an admin only when credentials are explicitly configured.
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const email = process.env.ADMIN_EMAIL;
      const password = process.env.ADMIN_PASSWORD;

      if (!email || !password) {
        console.warn('Admin setup skipped: configure ADMIN_EMAIL and ADMIN_PASSWORD.');
        return;
      }

      await Admin.create({ email, password });
      console.log(`Seeded default Admin: ${email}`);
    }
  } catch (error) {
    console.warn(`⚠️ MongoDB connection offline: ${error.message}`);
    console.warn(`⚙️ Backend is running in Database-Free fallback mode (Offline JSON database).`);
  }
};

module.exports = connectDB;
