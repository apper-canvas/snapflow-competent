import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { postService, userService } from '@/services';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('snapflow_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    } else {
      setResults({ users: [], posts: [] });
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const [users, posts] = await Promise.all([
        userService.searchUsers(query),
        postService.searchPosts(query)
      ]);
      setResults({ users, posts });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      const updatedSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('snapflow_recent_searches', JSON.stringify(updatedSearches));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('snapflow_recent_searches');
  };

  const handleHashtagClick = async (hashtag) => {
    const cleanTag = hashtag.replace('#', '');
    setQuery(`#${cleanTag}`);
    setActiveTab('posts');
    try {
      const posts = await postService.getPostsByHashtag(cleanTag);
      setResults({ users: [], posts });
    } catch (error) {
      console.error('Hashtag search error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users, posts, or hashtags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {!query ? (
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Searches</h2>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSearch(search)}
                      className="flex items-center space-x-3 w-full p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <ApperIcon name="Clock" className="text-gray-400" size={16} />
                      <span className="text-gray-700">{search}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Hashtags */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Popular Hashtags</h2>
              <div className="flex flex-wrap gap-2">
                {['#sunset', '#nature', '#photography', '#travel', '#food', '#art', '#lifestyle', '#adventure'].map((hashtag) => (
                  <motion.button
                    key={hashtag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleHashtagClick(hashtag)}
                    className="bg-primary/10 text-primary px-3 py-2 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    {hashtag}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Search Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Users ({results.users.length})
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Posts ({results.posts.length})
              </button>
            </div>

            {/* Search Results */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div>
                {activeTab === 'users' && (
                  <div className="space-y-3">
                    {results.users.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">👤</div>
                        <p className="text-gray-600">No users found</p>
                      </div>
                    ) : (
                      results.users.map((user) => (
                        <motion.div
                          key={user.Id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate('/profile')}
                        >
                          <img
                            src={user.profilePic}
                            alt={user.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{user.username}</h3>
                            <p className="text-sm text-gray-600">{user.bio}</p>
                            <p className="text-xs text-gray-500">{user.followers} followers</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'posts' && (
                  <div className="grid grid-cols-3 gap-1">
                    {results.posts.length === 0 ? (
                      <div className="col-span-3 text-center py-8">
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-gray-600">No posts found</p>
                      </div>
                    ) : (
                      results.posts.map((post) => (
                        <motion.div
                          key={post.Id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                        >
                          <img
                            src={post.imageUrl}
                            alt={post.caption}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Search;