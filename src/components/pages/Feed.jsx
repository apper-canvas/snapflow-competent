import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StoryBar from '@/components/organisms/StoryBar';
import PostCard from '@/components/molecules/PostCard';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import { postService, userService } from '@/services';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = async () => {
    try {
      setLoading(true);
      const [postsData, usersData] = await Promise.all([
        postService.getAll(),
        userService.getAll()
      ]);
      setPosts(postsData);
      setUsers(usersData);
    } catch (err) {
      setError('Failed to load feed');
      console.error('Error loading feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.Id === updatedPost.Id ? updatedPost : post
      )
    );
  };

  const getUserById = (userId) => {
    return users.find(user => user.username === userId) || {
      username: userId,
      profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-4">
          <StoryBar />
        </div>
        <div className="space-y-4 px-4 mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadFeedData}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-16"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <h1 className="text-2xl font-display font-bold text-gradient">SnapFlow</h1>
      </div>

      {/* Stories */}
      <div className="pt-4">
        <StoryBar />
      </div>

      {/* Posts */}
      <div className="space-y-0 mt-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h2>
            <p className="text-gray-600">Start following people or create your first post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.Id}
              post={post}
              user={getUserById(post.userId)}
              onUpdate={handlePostUpdate}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

export default Feed;