import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, TrendingUp, Users, BookOpen } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import BlogList from './BlogList';
import CreatePost from './CreatePost';

function Home({ searchQuery }) {
  const { posts, searchPosts, updatePost, deletePost } = useBlog();
  const { user } = useAuth();
  const [editingPost, setEditingPost] = useState(null);

  // Choose posts to display based on search query
  const displayPosts = searchQuery ? searchPosts(searchQuery) : posts;

  // Edit handlers
  const handleEdit = (post) => {
    setEditingPost(post.id);
  };

  const handleSaveEdit = (postData) => {
    if (editingPost) {
      updatePost(editingPost, postData);
      setEditingPost(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleDelete = (postId) => {
    deletePost(postId);
  };

  // If editingPost is set, show CreatePost to edit
  if (editingPost) {
    const post = posts.find(p => p.id === editingPost);
    if (post) {
      return (
        <CreatePost
          existingPost={post}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      );
    }
  }

  // Statistics for display on homepage
  const stats = [
    { icon: BookOpen, label: 'Total Posts', value: posts.length },
    { icon: Users, label: 'Active Writers', value: new Set(posts.map(p => p.author.id)).size },
    { icon: TrendingUp, label: 'Total Reads', value: posts.reduce((acc, post) => acc + post.likes.length, 0) * 5 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      {!searchQuery && (
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">BlogSpace</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing stories, connect with writers, and share your own thoughts with the world.
          </p>
          {user ? (
            <Link
              to="/create"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <PenTool className="h-5 w-5" />
              <span>Start Writing</span>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Join the Community
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Search Results for "{searchQuery}"
          </h2>
          <p className="text-gray-600">
            Found {displayPosts.length} {displayPosts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      )}

      {/* Stats */}
      {!searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Posts */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {searchQuery ? 'Search Results' : 'Latest Posts'}
        </h2>
        <BlogList
          posts={displayPosts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default Home;
