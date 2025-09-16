import React, { useState } from 'react';
import { User, Calendar, MapPin, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import BlogList from './BlogList';
import CreatePost from './CreatePost';

function Profile() {
  const { user } = useAuth();
  const { getPostsByAuthor, updatePost, deletePost } = useBlog();
  const [activeTab, setActiveTab] = useState('posts');
  const [editingPost, setEditingPost] = useState(null);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  const userPosts = getPostsByAuthor(user.id);

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

  if (editingPost) {
    const post = userPosts.find(p => p.id === editingPost);
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="px-6 py-6">
          <div className="flex items-start space-x-4">
            <div className="relative -mt-16">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white"
              />
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
              {user.bio && (
                <p className="text-gray-700 mt-3">{user.bio}</p>
              )}
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {format(new Date(user.joinDate), 'MMMM yyyy')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Edit3 className="h-4 w-4" />
                  <span>{userPosts.length} posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'posts'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Posts ({userPosts.length})
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'posts' && (
          <div>
            {userPosts.length > 0 ? (
              <BlogList
                posts={userPosts}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="text-center py-12">
                <Edit3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">You haven't written any posts. Start sharing your thoughts!</p>
                <a
                  href="/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Write your first post
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
