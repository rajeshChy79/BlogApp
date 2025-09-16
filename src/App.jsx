import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BlogProvider, useBlog } from './context/BlogContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import BlogDetail from './components/BlogDetail';

// Protected Route (redirects unauthenticated users to login)
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

// Main content component
function AppContent() {
  const { loadPosts } = useBlog();
  const [searchQuery, setSearchQuery] = useState('');

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Search handler passed to Navbar
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />
      <main>
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post/:id" element={<BlogDetail />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

// Root App component wrapping providers and router
function App() {
  return (
    <Router>
      <AuthProvider>
        <BlogProvider>
          <AppContent />
        </BlogProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
