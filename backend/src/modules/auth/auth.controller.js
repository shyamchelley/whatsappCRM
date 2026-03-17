const authService = require('./auth.service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken, user });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
}

async function refreshToken(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: 'No refresh token' });

    const accessToken = await authService.refresh(token);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const user = await authService.updateMe(req.user.id, req.body);
    res.json(user);
  } catch (err) { next(err); }
}

async function changePassword(req, res, next) {
  try {
    await authService.changePassword(req.user.id, req.body.current, req.body.next);
    res.json({ message: 'Password changed successfully' });
  } catch (err) { next(err); }
}

module.exports = { login, logout, refreshToken, me, updateMe, changePassword };
