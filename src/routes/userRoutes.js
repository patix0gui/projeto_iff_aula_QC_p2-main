import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

/**
 * User Routes
 * Only route definitions - no business logic
 */

// GET /api/users - Get all users
router.get('/', async (req, res) => 
  userController.getAllUsers(req, res)
);

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => 
  userController.getUserById(req, res)
);

// POST /api/users - Create new user
router.post('/', async (req, res) => 
  userController.createUser(req, res)
);

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => 
  userController.updateUser(req, res)
);

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => 
  userController.deleteUser(req, res)
);

export default router;
