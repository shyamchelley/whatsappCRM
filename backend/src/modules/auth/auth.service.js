const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');

function signAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
}

async function login(email, password) {
  const user = await db('users').where({ email }).first();
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

async function refresh(refreshToken) {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw Object.assign(new Error('Invalid refresh token'), { status: 401 });
  }

  const user = await db('users').where({ id: decoded.id }).first();
  if (!user) throw Object.assign(new Error('User not found'), { status: 401 });

  return signAccessToken(user);
}

async function getMe(userId) {
  const user = await db('users').where({ id: userId }).select('id', 'name', 'email', 'role', 'created_at').first();
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return user;
}

async function updateMe(userId, { name, email }) {
  if (email) {
    const existing = await db('users').where({ email }).whereNot({ id: userId }).first();
    if (existing) throw Object.assign(new Error('Email already in use'), { status: 409 });
  }
  await db('users').where({ id: userId }).update({
    ...(name  && { name }),
    ...(email && { email }),
    updated_at: new Date().toISOString(),
  });
  return getMe(userId);
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await db('users').where({ id: userId }).first();
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) throw Object.assign(new Error('Current password is incorrect'), { status: 401 });
  const hashed = await bcrypt.hash(newPassword, 10);
  await db('users').where({ id: userId }).update({ password: hashed, updated_at: new Date().toISOString() });
}

module.exports = { login, refresh, getMe, updateMe, changePassword };
