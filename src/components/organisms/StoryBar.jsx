import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { storyService, userService } from '@/services';

function StoryBar() {
  const [userStories, setUserStories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      const [stories, user] = await Promise.all([
        storyService.getActiveUserStories(),
        userService.getCurrentUser()
      ]);
      setUserStories(stories);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (userId) => {
    navigate(`/story/${userId}`);
  };

  const handleAddStory = () => {
    // For demo purposes, create a simple text story
    const createStory = async () => {
      try {
        await storyService.create({
          userId: currentUser.username,
          content: "Having a great day! ✨",
          type: "text"
        });
        loadStories(); // Refresh stories
      } catch (error) {
        console.error('Error creating story:', error);
      }
    };
    createStory();
  };

  if (loading) {
    return (
      <div className="px-4 py-2">
        <div className="flex space-x-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 bg-white border-b border-gray-100">
      <div className="flex space-x-4 overflow-x-auto hide-scrollbar">
        {/* Add Story Button */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center space-y-2 flex-shrink-0"
        >
          <button
            onClick={handleAddStory}
            className="relative w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary transition-colors"
          >
            <ApperIcon name="Plus" size={24} className="text-gray-500" />
          </button>
          <span className="text-xs text-gray-600 font-medium">Your Story</span>
        </motion.div>

        {/* User Stories */}
        {userStories.map((userStory) => (
          <motion.div
            key={userStory.userId}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center space-y-2 flex-shrink-0"
          >
            <button
              onClick={() => handleStoryClick(userStory.userId)}
              className={`relative w-16 h-16 rounded-full p-0.5 ${
                userStory.hasUnviewed ? 'gradient-border' : 'border-2 border-gray-300'
              }`}
            >
              <div className="gradient-border-inner">
                <img
                  src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
                  alt={userStory.userId}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {userStory.hasUnviewed && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
              )}
            </button>
            <span className="text-xs text-gray-600 font-medium max-w-16 truncate">
              {userStory.userId}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default StoryBar;