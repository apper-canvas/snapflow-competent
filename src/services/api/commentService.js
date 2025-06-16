import commentData from '../mockData/comment.json';

const COMMENT_STORAGE_KEY = 'snapflow_comments';

class CommentService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(COMMENT_STORAGE_KEY)) {
      localStorage.setItem(COMMENT_STORAGE_KEY, JSON.stringify(commentData));
    }
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comments = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || '[]');
        resolve([...comments]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comments = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || '[]');
        const comment = comments.find(c => c.Id === parseInt(id));
        resolve(comment ? { ...comment } : null);
      }, 200);
    });
  }

  async getByPostId(postId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comments = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || '[]');
        const postComments = comments.filter(c => c.postId === postId);
        const sortedComments = postComments.sort((a, b) => a.timestamp - b.timestamp);
        resolve([...sortedComments]);
      }, 300);
    });
  }

  async create(commentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comments = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || '[]');
        const newComment = {
          ...commentData,
          Id: Math.max(...comments.map(c => c.Id), 0) + 1,
          timestamp: Date.now()
        };
        comments.push(newComment);
        localStorage.setItem(COMMENT_STORAGE_KEY, JSON.stringify(comments));
        resolve({ ...newComment });
      }, 300);
    });
  }

  async update(id, commentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comments = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || '[]');
        const index = comments.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          comments[index] = { ...comments[index], ...commentData };
          localStorage.setItem(COMMENT_STORAGE_KEY, JSON.stringify(comments));
          resolve({ ...comments[index] });
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comments = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || '[]');
        const filteredComments = comments.filter(c => c.Id !== parseInt(id));
        localStorage.setItem(COMMENT_STORAGE_KEY, JSON.stringify(filteredComments));
        resolve(true);
      }, 300);
    });
  }
}

export default new CommentService();