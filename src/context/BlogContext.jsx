import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { blogAPI, commentAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const { user } = useAuth();

  const loadPosts = useCallback(async () => {
    try {
      const response = await blogAPI.getPosts();
      const postsData = response.data.data.map(post => ({
        id: post._id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        tags: post.tags,
        image: post.image,
        author: {
          id: post.author._id,
          name: post.author.name,
          email: post.author.email,
          bio: post.author.bio,
          avatar: post.author.avatar,
          joinDate: post.author.createdAt,
        },
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes: post.likes,
        bookmarks: post.bookmarks,
        commentsCount: post.commentsCount || 0,
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts. Please try again later.');
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const createPost = async (postData) => {
    if (!user) return;
    try {
      await blogAPI.createPost(postData);
      await loadPosts();
      toast.success('Post created successfully.');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post.');
    }
  };

  const updatePost = async (id, updateData) => {
    if (!user) return;
    try {
      await blogAPI.updatePost(id, updateData);
      await loadPosts();
      toast.success('Post updated successfully.');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post.');
    }
  };

  const deletePost = async (id) => {
    if (!user) return;
    try {
      await blogAPI.deletePost(id);
      await loadPosts();
      toast.success('Post deleted successfully.');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post.');
    }
  };

  const likePost = async (id) => {
    if (!user) return;
    try {
      await blogAPI.likePost(id);
      await loadPosts();
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post.');
    }
  };

  const bookmarkPost = async (id) => {
    if (!user) return;
    try {
      await blogAPI.bookmarkPost(id);
      await loadPosts();
    } catch (error) {
      console.error('Error bookmarking post:', error);
      toast.error('Failed to bookmark post.');
    }
  };

  const addComment = async (commentData) => {
    if (!user) return;
    try {
      console.log(commentData);
      await commentAPI.createComment(commentData.postId, { content: commentData.content });
      console.log("api call");
      await loadComments(commentData.postId);
      console.log("api call2");
      await loadPosts();
      toast.success('Comment added successfully.');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment.');
    }
  };

  const loadComments = useCallback(async (postId) => {
    try {
      const response = await commentAPI.getComments(postId);
      const commentsData = response.data.data.map(comment => ({
        id: comment._id,
        content: comment.content,
        author: {
          id: comment.author._id,
          name: comment.author.name,
          email: comment.author.email,
          bio: comment.author.bio,
          avatar: comment.author.avatar,
          joinDate: comment.author.createdAt,
        },
        postId: comment.post,
        parentId: comment.parent,
        createdAt: comment.createdAt,
        likes: comment.likes,
      }));
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments.');
    }
  }, []);

  const likeComment = async (id) => {
    if (!user) return;
    try {
      await commentAPI.likeComment(id);
      const comment = comments.find(c => c.id === id);
      if (comment) {
        await loadComments(comment.postId);
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to like comment.');
    }
  };

  const searchPosts = (query) => {
    if (!query.trim()) return posts;
    const lowercaseQuery = query.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getPostById = (id) => posts.find(post => post.id === id);

  const getPostsByAuthor = (authorId) => posts.filter(post => post.author.id === authorId);

  const getCommentsByPost = (postId) => {
    loadComments(postId);
    return comments.filter(comment => comment.postId === postId);
  };

  return (
    <BlogContext.Provider value={{
      posts,
      comments,
      loadPosts,
      createPost,
      updatePost,
      deletePost,
      likePost,
      bookmarkPost,
      addComment,
      likeComment,
      searchPosts,
      getPostById,
      getPostsByAuthor,
      getCommentsByPost
    }}>
      {children}
    </BlogContext.Provider>
  );
};
