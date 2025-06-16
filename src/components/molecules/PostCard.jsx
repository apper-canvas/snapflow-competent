import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import CommentSection from './CommentSection';
import { postService } from '@/services';

function PostCard({ post, user, onUpdate }) {
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const updatedPost = await postService.toggleLike(post.Id);
      onUpdate(updatedPost);
      
      if (updatedPost.isLiked) {
        // Trigger heart animation
        const heartButton = document.getElementById(`heart-${post.Id}`);
        if (heartButton) {
          heartButton.classList.add('heart-burst');
          setTimeout(() => {
            heartButton.classList.remove('heart-burst');
          }, 300);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedPost = await postService.toggleSave(post.Id);
      onUpdate(updatedPost);
      toast.success(updatedPost.isSaved ? 'Post saved!' : 'Post unsaved');
    } catch (error) {
      console.error('Error toggling save:', error);
      toast.error('Failed to save post');
    }
  };

  const handleDoubleClick = () => {
    if (!post.isLiked) {
      handleLike();
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'now';
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3">
          <img
            src={user.profilePic}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{user.username}</h3>
            <p className="text-xs text-gray-500">{formatTimeAgo(post.timestamp)}</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <ApperIcon name="MoreHorizontal" size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="w-full aspect-square object-cover cursor-pointer"
          onDoubleClick={handleDoubleClick}
        />
        
        {/* Double-tap heart animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 0, opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-16 h-16 text-white">
            <ApperIcon name="Heart" size={64} className="fill-current drop-shadow-lg" />
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <motion.button
              id={`heart-${post.Id}`}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              disabled={isLiking}
              className={`transition-colors ${
                post.isLiked ? 'text-red-500' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <ApperIcon 
                name="Heart" 
                size={24} 
                className={post.isLiked ? 'fill-current' : ''} 
              />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowComments(!showComments)}
              className="text-gray-700 hover:text-gray-900"
            >
              <ApperIcon name="MessageCircle" size={24} />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-gray-700 hover:text-gray-900"
            >
              <ApperIcon name="Send" size={24} />
            </motion.button>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            className={`transition-colors ${
              post.isSaved ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <ApperIcon 
              name="Bookmark" 
              size={24} 
              className={post.isSaved ? 'fill-current' : ''} 
            />
          </motion.button>
        </div>

        {/* Likes */}
        {post.likes > 0 && (
          <p className="font-semibold text-gray-900 text-sm mb-2">
            {post.likes} {post.likes === 1 ? 'like' : 'likes'}
          </p>
        )}

        {/* Caption */}
        <div className="text-sm text-gray-900 mb-2">
          <span className="font-semibold mr-2">{user.username}</span>
          <span>{post.caption}</span>
        </div>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.hashtags.map((tag, index) => (
              <button
                key={index}
                className="text-sm text-primary hover:text-primary/80"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Comments */}
        <CommentSection
          post={post}
          showComments={showComments}
          onToggle={() => setShowComments(!showComments)}
        />
      </div>
    </motion.article>
  );
}

export default PostCard;