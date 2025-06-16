import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { commentService, userService } from '@/services';

function CommentSection({ post, showComments, onToggle }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments, post.Id]);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      const postComments = await commentService.getByPostId(post.Id);
      setComments(postComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      const commentData = {
        postId: post.Id,
        userId: currentUser.username,
        text: newComment.trim()
      };
      
      const createdComment = await commentService.create(commentData);
      setComments(prev => [...prev, createdComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
  };

  return (
    <div>
      {/* View comments button */}
      {comments.length > 0 && !showComments && (
        <button
          onClick={onToggle}
          className="text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          View all {comments.length} comments
        </button>
      )}

      {/* Comments list */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 mb-3"
          >
            {loading ? (
              <div className="text-center py-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-2 text-sm"
                >
                  <span className="font-semibold text-gray-900">{comment.userId}</span>
                  <span className="text-gray-900 flex-1">{comment.text}</span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add comment */}
      <form onSubmit={handleSubmitComment} className="flex items-center space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 text-sm text-gray-900 placeholder-gray-500 border-none outline-none bg-transparent"
        />
        {newComment.trim() && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            type="submit"
            className="text-primary font-semibold text-sm hover:text-primary/80"
          >
            Post
          </motion.button>
        )}
      </form>
    </div>
  );
}

export default CommentSection;