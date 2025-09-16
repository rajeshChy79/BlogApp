import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Heart, 
  Bookmark, 
  MessageCircle, 
  Share2, 
  ArrowLeft,
  Edit,
  Trash2,
  Send
} from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getPostById, 
    likePost, 
    bookmarkPost, 
    deletePost,
    getCommentsByPost,
    addComment,
    likeComment
  } = useBlog();

  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const post = id ? getPostById(id) : null;
  const comments = id ? getCommentsByPost(id) : [];

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === post.author.id;
  const isLiked = user ? post.likes.includes(user.id) : false;
  const isBookmarked = user ? post.bookmarks.includes(user.id) : false;

  const handleLike = () => {
    if (user && id) {
      likePost(id);
    }
  };

  const handleBookmark = () => {
    if (user && id) {
      bookmarkPost(id);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      navigate('/');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !id) return;

    setIsSubmittingComment(true);
    addComment({
      content: newComment.trim(),
      postId: id
    });
    setNewComment('');
    setIsSubmittingComment(false);
  };

  const handleLikeComment = (commentId) => {
    if (user) {
      likeComment(commentId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to posts</span>
        </Link>
      </div>

      {/* Article */}
      <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Featured Image */}
        {post.image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3 flex-1">
              <img
                src={post.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.name}`}
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900">{post.author.name}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(post.createdAt), 'MMMM dd, yyyy')} • 
                  {Math.ceil(post.content.length / 1000)} min read
                </p>
              </div>
            </div>

            {/* Author actions */}
            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/edit/${post.id}`}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                  title="Edit post"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                  title="Delete post"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                disabled={!user}
                className={`flex items-center space-x-2 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{post.likes.length}</span>
              </button>

              <a
                href="#comments"
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{post.commentsCount}</span>
              </a>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>

            <button
              onClick={handleBookmark}
              disabled={!user}
              className={`flex items-center space-x-2 transition-colors ${
                isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section id="comments" className="mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex space-x-3">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isSubmittingComment ? 'Posting...' : 'Post Comment'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-3">Please log in to leave a comment</p>
              <Link
                to="/login"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Log In
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.name}`}
                  alt={comment.author.name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{comment.author.name}</h4>
                      <span className="text-xs text-gray-500">
                        {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      disabled={!user}
                      className={`flex items-center space-x-1 text-xs transition-colors ${
                        user && comment.likes.includes(user.id)
                          ? 'text-red-500'
                          : 'text-gray-500 hover:text-red-500'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Heart className={`h-3 w-3 ${
                        user && comment.likes.includes(user.id) ? 'fill-current' : ''
                      }`} />
                      <span>{comment.likes.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default BlogDetail;
