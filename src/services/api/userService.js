import userData from '../mockData/user.json';

const USER_STORAGE_KEY = 'snapflow_users';
const CURRENT_USER_KEY = 'snapflow_current_user';

class UserService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(USER_STORAGE_KEY)) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    }
    if (!localStorage.getItem(CURRENT_USER_KEY)) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData[0]));
    }
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
        resolve([...users]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
        const user = users.find(u => u.Id === parseInt(id));
        resolve(user ? { ...user } : null);
      }, 200);
    });
  }

  async getCurrentUser() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        resolve({ ...currentUser });
      }, 200);
    });
  }

  async create(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
        const newUser = {
          ...userData,
          Id: Math.max(...users.map(u => u.Id), 0) + 1
        };
        users.push(newUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
        resolve({ ...newUser });
      }, 300);
    });
  }

  async update(id, userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
        const index = users.findIndex(u => u.Id === parseInt(id));
        if (index !== -1) {
          users[index] = { ...users[index], ...userData };
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
          
          // Update current user if it's the same user
          const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
          if (currentUser.Id === parseInt(id)) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[index]));
          }
          
          resolve({ ...users[index] });
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
        const filteredUsers = users.filter(u => u.Id !== parseInt(id));
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(filteredUsers));
        resolve(true);
      }, 300);
    });
  }

  async searchUsers(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
        const filtered = users.filter(user => 
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.bio.toLowerCase().includes(query.toLowerCase())
        );
        resolve([...filtered]);
      }, 300);
    });
  }
}

export default new UserService();