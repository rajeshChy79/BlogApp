import User from '../models/User.js';
import BlogPost from '../models/BlogPost.js';

// Get all active users with pagination
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Get single user by ID if active
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Get user's published blog posts with pagination
export const getUserPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.id);
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const posts = await BlogPost.find({ author: req.params.id, status: 'published' })
      .populate('author', 'name email avatar bio')
      .populate('commentsCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments({ author: req.params.id, status: 'published' });

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

// Get user stats - posts count, likes, views
export const getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const postsCount = await BlogPost.countDocuments({ author: user._id, status: 'published' });

    const totalLikes = await BlogPost.aggregate([
      { $match: { author: user._id, status: 'published' } },
      { $project: { likesCount: { $size: '$likes' } } },
      { $group: { _id: null, total: { $sum: '$likesCount' } } }
    ]);

    const totalViews = await BlogPost.aggregate([
      { $match: { author: user._id, status: 'published' } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        postsCount,
        totalLikes: totalLikes[0]?.total || 0,
        totalViews: totalViews[0]?.total || 0,
        joinDate: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
