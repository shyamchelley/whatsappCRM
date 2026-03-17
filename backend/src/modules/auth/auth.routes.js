const express = require('express');
const router = express.Router();
const controller = require('./auth.controller');
const { auth } = require('../../middleware/auth');
const { authLimiter } = require('../../middleware/rateLimiter');

router.post('/login', authLimiter, controller.login);
router.post('/logout', controller.logout);
router.post('/refresh', controller.refreshToken);
router.get('/me', auth, controller.me);
router.patch('/me', auth, controller.updateMe);
router.patch('/me/password', auth, controller.changePassword);

module.exports = router;
