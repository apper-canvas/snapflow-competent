import postData from '../mockData/post.json';

const POST_STORAGE_KEY = 'snapflow_posts';

class PostService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(POST_STORAGE_KEY)) {
      localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(postData));
    }
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(POST_STORAGE_KEY) || '[]');
        // Sort by timestamp descending (newest first)
        const sortedPosts = posts.sort((a, b) => b.timestamp - a.timestamp);
        resolve([...sortedPosts]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(POST_STORAGE_KEY) || '[]');
        const post = posts.find(p => p.Id === parseInt(id));
        resolve(post ? { ...post } : null);
      }, 200);
    });
  }

  async getByUserId(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(POST_STORAGE_KEY) || '[]');
        const userPosts = posts.filter(p => p.userId === userId);
        const sortedPosts = userPosts.sort((a, b) => b.timestamp - a.timestamp);
        resolve([...sortedPosts]);
      }, 300);
    });
  }

  async getSavedPosts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(POST_STORAGE_KEY) || '[]');
        const savedPosts = posts.filter(p => p.isSaved);
        const sortedPosts = savedPosts.sort((a, b) => b.timestamp - a.timestamp);
        resolve([...sortedPosts]);
      }, 300);
    });
  }

  async create(postData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(POST_STORAGE_KEY) || '[]');
        const newPost = {
          ...postData,
          Id: Math.max(...posts.map(p => p.Id), 0) + 1,
          timestamp: Date.now(),
          likes: 0,
          comments: [],
          isLiked: false,
          isSaved: false
        };
        posts.push(newPost);
        localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
        resolve({ ...newPost });
      }, 300);
    });
  }

  async update(id, postData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(POST_STORAGE_KEY) || '[]');
        const index = posts.findIndex(p => p.Id === parseInt(id));
        if (index !== -1) {
          posts[index] = { ...posts[index], ...postData };
          localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
          resolve({ ...posts[index] });
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(POST_STORAGE_KEY) || '[]');
        const filteredPosts = posts.filter(p => p.Id !== parseInt(id));
        localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(filteredPosts));
        resolve(true);
      }, 300);
    });
  }

  async toggleLike(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(POST_STORAGE_KEY) || '[]');
        const index = posts.findIndex(p => p.Id === parseInt(id));
        if (index !== -1) {
          posts[index].isLiked = !posts[index].isLiked;
          posts[index].likes += posts[index].isLiked ? 1 : -1;
          localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
          resolve({ ...posts[index] });
        } else {
          resolve(null);
        }
      }, 200);
    });
  }

  async toggleSave(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(POST_STORAGE_KEY) || '[]');
        const index = posts.findIndex(p => p.Id === parseInt(id));
        if (index !== -1) {
          posts[index].isSaved = !posts[index].isSaved;
          localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
          resolve({ ...posts[index] });
        } else {
          resolve(null);
        }
      }, 200);
    });
  }

  async searchPosts(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(POST_STORAGE_KEY) || '[]');
        const filtered = posts.filter(post => 
          post.caption.toLowerCase().includes(query.toLowerCase()) ||
          post.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        resolve([...filtered]);
      }, 300);
    });
  }

  async getPostsByHashtag(hashtag) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(POST_STORAGE_KEY) || '[]');
        const filtered = posts.filter(post => 
          post.hashtags.some(tag => tag.toLowerCase() === hashtag.toLowerCase())
        );
        const sortedPosts = filtered.sort((a, b) => b.timestamp - a.timestamp);
        resolve([...sortedPosts]);
      }, 300);
    });
  }
}

export default new PostService();