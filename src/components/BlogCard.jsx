import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, Bookmark, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';

function BlogCard({ post, onEdit, onDelete }) {
  const { user } = useAuth();
  const { likePost, bookmarkPost } = useBlog();

  const isAuthor = user?.id === post.author.id;
  const isLiked = user ? post.likes.includes(user.id) : false;
  const isBookmarked = user ? post.bookmarks.includes(user.id) : false;

  const handleLike = (e) => {
    e.preventDefault();
    if (user) {
      likePost(post.id);
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    if (user) {
      bookmarkPost(post.id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    onEdit?.(post);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete?.(post.id);
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
      <Link to={`/post/${post.id}`} className="block">
        {post.image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-6">
          {/* Author Info */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={
                post.author.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.author.name)}`
              }
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
              loading="lazy"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
              <p className="text-xs text-gray-500">{format(new Date(post.createdAt), 'MMM dd, yyyy')}</p>
            </div>

            {/* Author-only Edit/Delete Buttons */}
            {isAuthor && (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                  title="Edit post"
                  aria-label="Edit post"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                  title="Delete post"
                  aria-label="Delete post"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>

          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium select-none"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500 select-none">+{post.tags.length - 3} more</span>
            )}
          </div>
        </div>
      </Link>

      {/* Actions Footer */}
      <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={!user}
            className={`flex items-center space-x-1 text-sm transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-pressed={isLiked}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes.length}</span>
          </button>

          <Link
            to={`/post/${post.id}#comments`}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            aria-label="View comments"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentsCount}</span>
          </Link>
        </div>

        <button
          onClick={handleBookmark}
          disabled={!user}
          className={`text-sm transition-colors ${
            isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </article>
  );
}

export default BlogCard;
