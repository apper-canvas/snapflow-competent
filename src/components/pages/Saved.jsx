import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { postService } from '@/services';

function Saved() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    try {
      setLoading(true);
      const posts = await postService.getSavedPosts();
      setSavedPosts(posts);
    } catch (err) {
      setError('Failed to load saved posts');
      console.error('Error loading saved posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (postId) => {
    try {
      await postService.toggleSave(postId);
      setSavedPosts(prevPosts => prevPosts.filter(post => post.Id !== postId));
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900">Saved Posts</h1>
        </div>
        <div className="grid grid-cols-3 gap-1 p-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Saved Posts</h1>
          <ApperIcon name="Bookmark" className="text-gray-400" size={20} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadSavedPosts}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📌</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No saved posts yet</h2>
            <p className="text-gray-600 mb-6">
              Save posts you love by tapping the bookmark icon
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Explore Feed
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {savedPosts.length} saved {savedPosts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-1">
              {savedPosts.map((post) => (
                <motion.div
                  key={post.Id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="flex items-center justify-center space-x-4 mb-2">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Heart" size={16} className="fill-current" />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="MessageCircle" size={16} />
                          <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Unsave button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnsave(post.Id);
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ApperIcon name="BookmarkX" size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Saved;