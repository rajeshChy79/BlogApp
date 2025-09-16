import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import BlogPost from '../models/BlogPost.js';
import Comment from '../models/Comment.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await BlogPost.deleteMany();
    await Comment.deleteMany();

    // Create users (assuming password hashing handled in User model)
    const users = await User.create([
      {
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'demo123',
        bio: 'Demo account for testing.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        bio: 'Tech enthusiast and software developer.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
      }
    ]);

    console.log('Users created');

    // Minimal example blog posts
    const blogPosts = await BlogPost.create([
      {
        title: 'Getting Started with React Hooks',
        content: 'React Hooks simplify components. Use useState and useEffect for state and lifecycle...',
        excerpt: 'Learn how React Hooks can simplify your code.',
        tags: ['react', 'javascript', 'hooks'],
        image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
        author: users[1]._id,
        likes: [users[0]._id],
        bookmarks: [users[0]._id]
      }
    ]);

    console.log('Blog posts created');

    // Sample comments
    const comments = await Comment.create([
      {
        content: 'Great article on hooks!',
        author: users[0]._id,
        post: blogPosts[0]._id,
        likes: [users[1]._id]
      }
    ]);

    console.log('Comments created');
    console.log('Seed data created successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
