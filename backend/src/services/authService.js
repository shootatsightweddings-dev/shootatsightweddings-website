const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const login = async (email, password) => {
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.statusCode = 400;
    throw err;
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const token = signToken(admin._id);
    return { token, admin: { id: admin._id, email: admin.email } };
  } catch (dbErr) {
    if (dbErr.statusCode === 401) throw dbErr;
    const err = new Error('Unable to connect to database. Please try again later.');
    err.statusCode = 503;
    throw err;
  }
};

module.exports = { login, signToken };
