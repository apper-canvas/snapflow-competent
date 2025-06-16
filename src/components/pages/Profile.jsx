import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { userService, postService } from '@/services';
import { toast } from 'react-toastify';

function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    profilePic: ''
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [userData, userPosts] = await Promise.all([
        userService.getCurrentUser(),
        postService.getByUserId('john_doe') // Using default user
      ]);
      setUser(userData);
      setPosts(userPosts);
      setEditForm({
        username: userData.username,
        bio: userData.bio,
        profilePic: userData.profilePic
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await userService.update(user.Id, editForm);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      toast.success('All data cleared successfully!');
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
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
          <h1 className="text-lg font-semibold text-gray-900">{user?.username}</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-600 hover:text-gray-800"
            >
              <ApperIcon name={isEditing ? "X" : "Settings"} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-4">
        {/* Profile Header */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative">
            <img
              src={user?.profilePic}
              alt={user?.username}
              className="w-20 h-20 rounded-full object-cover"
            />
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full">
                <ApperIcon name="Camera" size={12} />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Username"
                />
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  rows={3}
                  placeholder="Bio"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{user?.username}</h2>
                <p className="text-gray-600 text-sm mb-3">{user?.bio}</p>
                
                {/* Stats */}
                <div className="flex space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{posts.length}</div>
                    <div className="text-xs text-gray-600">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{user?.followers || 0}</div>
                    <div className="text-xs text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{user?.following || 0}</div>
                    <div className="text-xs text-gray-600">Following</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Theme</h4>
                  <p className="text-sm text-gray-600">Switch between light and dark mode</p>
                </div>
                <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm">
                  Light
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Notifications</h4>
                  <p className="text-sm text-gray-600">Manage your notification preferences</p>
                </div>
                <button className="bg-primary text-white px-3 py-1 rounded-lg text-sm">
                  On
                </button>
              </div>
              
              <div className="border-t pt-4">
                <button
                  onClick={clearAllData}
                  className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  Clear All Data
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  This will remove all posts, stories, and user data
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Posts Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Posts</h3>
            <ApperIcon name="Grid3x3" className="text-gray-400" size={20} />
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📸</div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">No posts yet</h4>
              <p className="text-gray-600">Share your first photo to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <motion.div
                  key={post.Id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="flex items-center justify-center space-x-4">
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
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;