import express from 'express';
import {
  getUsers,
  getUser,
  getUserPosts,
  getUserStats
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/:id/posts', getUserPosts);
router.get('/:id/stats', getUserStats);

export default router;
