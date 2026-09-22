const authController = require("../controllers/authController");

const express = require('express');
const router = express.Router();

// fonction check verifie si jwt token localstorage (hashé = token de bdd qui est deja hashé ) 
// + verification expiraiton maxage


/**
 * @route POST /api/auth/login
 * @description Log in a user
 * @access Public
 */
router.post("/login", authController.login);

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

/**
 * @route POST /api/auth/logout
 * @description Log out a user
 * @access Private
 * @todo Implement authentication middleware
 */
router.post('/logout', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

/**
 * @route GET /api/auth/me
 * @description Get current user details
 * @access Private
 * @todo Implement authentication middleware
 */
router.get('/me', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

module.exports = router;