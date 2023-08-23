const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  authCookie,
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authentication');

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout);
router.get('/', authenticateUser, authCookie);
module.exports = router;
