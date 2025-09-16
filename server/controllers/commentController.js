import Comment from '../models/Comment.js';
import BlogPost from '../models/BlogPost.js';

// Get top-level comments for a blog post with pagination
export const getComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ post: req.params.blogId, parent: null })
      .populate('author', 'name avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name avatar' },
        options: { sort: { createdAt: 1 } }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ post: req.params.blogId, parent: null });

    res.status(200).json({
      success: true,
      count: comments.length,
      total,
      pagination: { page, limit, pages: Math.ceil(total / limit) },
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// Create new comment or reply
export const createComment = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.blogId);
    if (!post) return res.status(404).json({ success: false, message: 'Blog post not found' });

    if (req.body.parent) {
      const parentComment = await Comment.findById(req.body.parent);
      if (!parentComment) return res.status(404).json({ success: false, message: 'Parent comment not found' });
    }

    const comment = await Comment.create({
      content: req.body.content,
      author: req.user.id,
      post: req.params.blogId,
      parent: req.body.parent || null
    });

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name avatar');

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    next(error);
  }
};

// Update comment
export const updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this comment' });
    }

    comment = await Comment.findByIdAndUpdate(req.params.id, {
      content: req.body.content,
      isEdited: true,
      editedAt: new Date()
    }, { new: true, runValidators: true }).populate('author', 'name avatar');

    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

// Delete comment and its replies
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await Comment.deleteMany({ parent: req.params.id });
    await comment.deleteOne();

    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Like or unlike comment
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    const isLiked = comment.likes.includes(req.user.id);
    if (isLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
    } else {
      comment.likes.push(req.user.id);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      liked: !isLiked,
      likesCount: comment.likes.length
    });
  } catch (error) {
    next(error);
  }
};
