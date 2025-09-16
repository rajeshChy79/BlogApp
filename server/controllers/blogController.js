import BlogPost from '../models/BlogPost.js';
import Comment from '../models/Comment.js';

// Get published blog posts with filters and pagination
export const getBlogPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, tags, author, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    let query = { status: 'published' };

    if (search) query.$text = { $search: search };
    if (tags) query.tags = { $in: tags.split(',').map(tag => tag.trim().toLowerCase()) };
    if (author) query.author = author;

    const posts = await BlogPost.find(query)
      .populate('author', 'name email avatar bio')
      .populate('commentsCount')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pagination: { page, limit, pages: Math.ceil(total / limit) },
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

// Get single blog post by ID and increment views
export const getBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'name email avatar bio')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatar' },
        options: { sort: { createdAt: -1 } }
      });

    if (!post) return res.status(404).json({ success: false, message: 'Blog post not found' });

    post.views += 1;
    await post.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// Create blog post attributed to logged-in user
export const createBlogPost = async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    console.log(req.user.id);
    const post = await BlogPost.create(req.body);
    console.log(post);

    const populatedPost = await BlogPost.findById(post._id).populate('author', 'name email avatar bio');

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    next(error);
  }
};

// Update blog post owned by user or admin
export const updateBlogPost = async (req, res, next) => {
  try {
    let post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Blog post not found' });

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this post' });
    }

    post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('author', 'name email avatar bio');

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// Delete blog post and associated comments, only by owner or admin
export const deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Blog post not found' });

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await Comment.deleteMany({ post: req.params.id });
    await post.deleteOne();

    res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Like or unlike a blog post
export const likeBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Blog post not found' });

    const isLiked = post.likes.includes(req.user.id);
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();

    res.status(200).json({ success: true, liked: !isLiked, likesCount: post.likes.length });
  } catch (error) {
    next(error);
  }
};

// Bookmark or unbookmark a blog post
export const bookmarkBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Blog post not found' });

    const isBookmarked = post.bookmarks.includes(req.user.id);
    if (isBookmarked) {
      post.bookmarks = post.bookmarks.filter(id => id.toString() !== req.user.id);
    } else {
      post.bookmarks.push(req.user.id);
    }
    await post.save();

    res.status(200).json({ success: true, bookmarked: !isBookmarked, bookmarksCount: post.bookmarks.length });
  } catch (error) {
    next(error);
  }
};

// Get logged-in user's bookmarked posts with pagination
export const getBookmarkedPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find({ bookmarks: req.user.id, status: 'published' })
      .populate('author', 'name email avatar bio')
      .populate('commentsCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments({ bookmarks: req.user.id, status: 'published' });

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pagination: { page, limit, pages: Math.ceil(total / limit) },
      data: posts
    });
  } catch (error) {
    next(error);
  }
};
