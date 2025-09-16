import express from 'express';
import {
  updateComment,
  deleteComment,
  likeComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';
import {
  validateComment,
  handleValidationErrors
} from '../middleware/validation.js';

const router = express.Router();

router.route('/:id')
  .put(protect, validateComment, handleValidationErrors, updateComment)
  .delete(protect, deleteComment);

router.put('/:id/like', protect, likeComment);

export default router;
