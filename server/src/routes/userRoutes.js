const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticateToken } = require('../utils/jwtUtils');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User specific operations
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile data
 *                 user:
 *                   $ref: '#/components/schemas/User' # Reference to a global User schema (optional, define in swaggerConfig.js if used)
 *       401:
 *         description: Authentication token required
 *       403:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// GET /api/users/profile (Protected Route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.'});
    }

    res.json({ 
      message: 'Profile data', 
      user 
    });
  } catch (error) {
    console.error('Profile route error:', error);
    res.status(500).json({ message: 'Internal server error while fetching profile.' });
  }
});

// Add other user-specific routes here later (e.g., update profile)

module.exports = router;
