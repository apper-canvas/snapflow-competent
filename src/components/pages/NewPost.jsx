import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { postService, userService } from '@/services';

function NewPost() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }
    
    if (!caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    setLoading(true);
    try {
      const currentUser = await userService.getCurrentUser();
      
      // Process hashtags
      const hashtagArray = hashtags
        .split(' ')
        .filter(tag => tag.startsWith('#'))
        .map(tag => tag.slice(1).toLowerCase());

      // Create post data
      const postData = {
        userId: currentUser.username,
        imageUrl: imagePreview, // In a real app, this would be uploaded to a server
        caption: caption.trim(),
        hashtags: hashtagArray
      };

      await postService.create(postData);
      
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleCaptionChange = (e) => {
    const text = e.target.value;
    setCaption(text);
    
    // Auto-extract hashtags
    const hashtagMatches = text.match(/#\w+/g) || [];
    setHashtags(hashtagMatches.join(' '));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            <span>Cancel</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">New Post</h1>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedImage || !caption.trim()}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            {loading ? 'Posting...' : 'Share'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Photo
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-3"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="Camera" size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Add Photo</p>
                    <p className="text-sm text-gray-500">Tap to select from your gallery</p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ApperIcon name="X" size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={handleCaptionChange}
              placeholder="Write a caption... Use # for hashtags"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
            <p className="text-xs text-gray-500">
              {caption.length}/500 characters
            </p>
          </div>

          {/* Hashtags Preview */}
          {hashtags && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Hashtags
              </label>
              <div className="flex flex-wrap gap-2">
                {hashtags.split(' ').filter(Boolean).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Tips for great posts:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use relevant hashtags to reach more people</li>
              <li>• Write engaging captions that tell a story</li>
              <li>• Make sure your image is clear and well-lit</li>
            </ul>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default NewPost;