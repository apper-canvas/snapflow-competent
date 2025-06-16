import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { storyService, userService } from '@/services';

function StoryViewer() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, [userId]);

  useEffect(() => {
    if (stories.length > 0) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + 2; // 5 seconds total (100 / 2 = 50 intervals * 100ms)
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [stories, currentIndex]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const [userStories, userData] = await Promise.all([
        storyService.getByUserId(userId),
        userService.getById(userId)
      ]);
      
      if (userStories.length === 0) {
        navigate('/');
        return;
      }
      
      setStories(userStories);
      setUser(userData);
      setProgress(0);
    } catch (error) {
      console.error('Error loading stories:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      navigate('/');
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleStoryClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    
    if (clickX < width / 2) {
      prevStory();
    } else {
      nextStory();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!stories.length || !user) {
    return null;
  }

  const currentStory = stories[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Progress bars */}
      <div className="flex space-x-1 p-4 pb-2">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-3">
          <img
            src={user.profilePic}
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <h3 className="text-white font-medium text-sm">{user.username}</h3>
            <p className="text-white/70 text-xs">
              {new Date(currentStory.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-white/70 hover:text-white"
        >
          <ApperIcon name="X" size={20} />
        </button>
      </div>

      {/* Story Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="w-full h-full max-w-md max-h-full relative cursor-pointer"
          onClick={handleStoryClick}
        >
          {currentStory.type === 'image' ? (
            <img
              src={currentStory.content}
              alt="Story"
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-lg">
              <p className="text-white text-xl font-semibold text-center p-8">
                {currentStory.content}
              </p>
            </div>
          )}
          
          {/* Navigation areas */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full" />
            <div className="w-1/2 h-full" />
          </div>
        </div>
      </div>

      {/* Bottom area for interaction */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Reply to story..."
            className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
          />
          <button className="text-white/70 hover:text-white">
            <ApperIcon name="Heart" size={24} />
          </button>
          <button className="text-white/70 hover:text-white">
            <ApperIcon name="Send" size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default StoryViewer;