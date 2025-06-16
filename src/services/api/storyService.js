import storyData from '../mockData/story.json';

const STORY_STORAGE_KEY = 'snapflow_stories';

class StoryService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(STORY_STORAGE_KEY)) {
      localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(storyData));
    }
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stories = JSON.parse(localStorage.getItem(STORY_STORAGE_KEY) || '[]');
        // Filter out expired stories
        const activeStories = stories.filter(story => story.expiresAt > Date.now());
        resolve([...activeStories]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stories = JSON.parse(localStorage.getItem(STORY_STORAGE_KEY) || '[]');
        const story = stories.find(s => s.Id === parseInt(id));
        resolve(story ? { ...story } : null);
      }, 200);
    });
  }

  async getByUserId(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stories = JSON.parse(localStorage.getItem(STORY_STORAGE_KEY) || '[]');
        const userStories = stories.filter(s => s.userId === userId && s.expiresAt > Date.now());
        const sortedStories = userStories.sort((a, b) => a.timestamp - b.timestamp);
        resolve([...sortedStories]);
      }, 300);
    });
  }

  async create(storyData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stories = JSON.parse(localStorage.getItem(STORY_STORAGE_KEY) || '[]');
        const newStory = {
          ...storyData,
          Id: Math.max(...stories.map(s => s.Id), 0) + 1,
          timestamp: Date.now(),
          expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          viewed: false
        };
        stories.push(newStory);
        localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(stories));
        resolve({ ...newStory });
      }, 300);
    });
  }

  async update(id, storyData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stories = JSON.parse(localStorage.getItem(STORY_STORAGE_KEY) || '[]');
        const index = stories.findIndex(s => s.Id === parseInt(id));
        if (index !== -1) {
          stories[index] = { ...stories[index], ...storyData };
          localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(stories));
          resolve({ ...stories[index] });
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stories = JSON.parse(localStorage.getItem(STORY_STORAGE_KEY) || '[]');
        const filteredStories = stories.filter(s => s.Id !== parseInt(id));
        localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(filteredStories));
        resolve(true);
      }, 300);
    });
  }

  async markAsViewed(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stories = JSON.parse(localStorage.getItem(STORY_STORAGE_KEY) || '[]');
        const index = stories.findIndex(s => s.Id === parseInt(id));
        if (index !== -1) {
          stories[index].viewed = true;
          localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(stories));
          resolve({ ...stories[index] });
        } else {
          resolve(null);
        }
      }, 200);
    });
  }

  async getActiveUserStories() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stories = JSON.parse(localStorage.getItem(STORY_STORAGE_KEY) || '[]');
        const activeStories = stories.filter(story => story.expiresAt > Date.now());
        
        // Group by user
        const userStories = activeStories.reduce((acc, story) => {
          if (!acc[story.userId]) {
            acc[story.userId] = [];
          }
          acc[story.userId].push(story);
          return acc;
        }, {});
        
        // Convert to array of user story objects
        const result = Object.entries(userStories).map(([userId, stories]) => ({
          userId,
          stories: stories.sort((a, b) => a.timestamp - b.timestamp),
          hasUnviewed: stories.some(s => !s.viewed)
        }));
        
        resolve(result);
      }, 300);
    });
  }
}

export default new StoryService();