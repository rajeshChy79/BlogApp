import express from 'express';
import {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
  bookmarkBlogPost,
  getBookmarkedPosts
} from '../controllers/blogController.js';
import {
  getComments,
  createComment
} from '../controllers/commentController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import {
  validateBlogPost,
  validateComment,
  handleValidationErrors
} from '../middleware/validation.js';

const router = express.Router();

// Blog main routes
router.route('/')
  .get(optionalAuth, getBlogPosts)
  .post(validateBlogPost, handleValidationErrors, createBlogPost);

router.get('/bookmarks', protect, getBookmarkedPosts);

router.route('/:id')
  .get(optionalAuth, getBlogPost)
  .put(protect, validateBlogPost, handleValidationErrors, updateBlogPost)
  .delete(protect, deleteBlogPost);

router.put('/:id/like', protect, likeBlogPost);
router.put('/:id/bookmark', protect, bookmarkBlogPost);

// Comments nested under blog
router.route('/:blogId/comments')
  .get(getComments)
  .post(protect, validateComment, handleValidationErrors, createComment);

export default router;
