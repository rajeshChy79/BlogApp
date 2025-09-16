import React, { createContext, useContext, useState, useEffect } from 'react';
import { blogAPI, commentAPI } from '../services/api';
import { useAuth } from './AuthContext';

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

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await blogAPI.getPosts();
      const postsData = response.data.data.map((post) => ({
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
          joinDate: post.author.createdAt
        },
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes: post.likes,
        bookmarks: post.bookmarks,
        commentsCount: post.commentsCount || 0
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const savePosts = (newPosts) => {
    setPosts(newPosts);
  };

  const saveComments = (newComments) => {
    setComments(newComments);
    localStorage.setItem('blogComments', JSON.stringify(newComments));
  };

  const createPost = (postData) => {
    console.log("postData:",postData);
    if (!user) return;

    blogAPI.createPost(postData)
      .then(() => {
        loadPosts();
      })
      .catch((error) => {
        console.error('Error creating post:', error);
      });
  };

  const updatePost = (id, updateData) => {
    if (!user) return;

    blogAPI.updatePost(id, updateData)
      .then(() => {
        loadPosts();
      })
      .catch((error) => {
        console.error('Error updating post:', error);
      });
  };

  const deletePost = (id) => {
    if (!user) return;

    blogAPI.deletePost(id)
      .then(() => {
        loadPosts();
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  };

  const likePost = (id) => {
    if (!user) return;

    blogAPI.likePost(id)
      .then(() => {
        loadPosts();
      })
      .catch((error) => {
        console.error('Error liking post:', error);
      });
  };

  const bookmarkPost = (id) => {
    if (!user) return;

    blogAPI.bookmarkPost(id)
      .then(() => {
        loadPosts();
      })
      .catch((error) => {
        console.error('Error bookmarking post:', error);
      });
  };

  const addComment = (commentData) => {
    if (!user) return;

    commentAPI.createComment(commentData.postId, { content: commentData.content })
      .then(() => {
        loadComments(commentData.postId);
        loadPosts();
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  const loadComments = async (postId) => {
    try {
      const response = await commentAPI.getComments(postId);
      const commentsData = response.data.data.map((comment) => ({
        id: comment._id,
        content: comment.content,
        author: {
          id: comment.author._id,
          name: comment.author.name,
          email: comment.author.email,
          bio: comment.author.bio,
          avatar: comment.author.avatar,
          joinDate: comment.author.createdAt
        },
        postId: comment.post,
        parentId: comment.parent,
        createdAt: comment.createdAt,
        likes: comment.likes
      }));
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const likeComment = (id) => {
    if (!user) return;

    commentAPI.likeComment(id)
      .then(() => {
        const comment = comments.find((c) => c.id === id);
        if (comment) {
          loadComments(comment.postId);
        }
      })
      .catch((error) => {
        console.error('Error liking comment:', error);
      });
  };

  const searchPosts = (query) => {
    if (!query.trim()) return posts;

    const lowercaseQuery = query.toLowerCase();
    return posts.filter((post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getPostById = (id) => {
    return posts.find((post) => post.id === id);
  };

  const getPostsByAuthor = (authorId) => {
    return posts.filter((post) => post.author.id === authorId);
  };

  const getCommentsByPost = (postId) => {
    loadComments(postId);
    return comments.filter((comment) => comment.postId === postId);
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
