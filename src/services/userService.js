import userData from '../data/data.js';

/**
 * UserService - Business logic layer for user operations
 * Framework-agnostic and testable
 */
class UserService {
  constructor(dataRepository = userData) {
    this.dataRepository = dataRepository;
  }

  /**
   * Get all users
   * @returns {Object} Users data with count
   */
  async getAllUsers() {
    try {
      const users = this.dataRepository.getAll();
      return {
        data: users,
        count: this.dataRepository.count()
      };
    } catch (error) {
      console.error('[UserService.getAllUsers] Error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Object|null} User data or null
   */
  async getUserById(id) {
    try {
      const user = this.dataRepository.getById(id);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      return user;
    } catch (error) {
      console.error('[UserService.getUserById] Error:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Object} Created user
   */
  async createUser(userData) {
    try {
      // Business validation
      if (!userData.name || !userData.email || !userData.age) {
        const error = new Error('Name, email, and age are required');
        error.statusCode = 400;
        throw error;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        const error = new Error('Invalid email format');
        error.statusCode = 400;
        throw error;
      }

      // Age validation
      if (userData.age < 1 || userData.age > 150) {
        const error = new Error('Age must be between 1 and 150');
        error.statusCode = 400;
        throw error;
      }

      const newUser = this.dataRepository.create(userData);
      return newUser;
    } catch (error) {
      console.error('[UserService.createUser] Error:', error);
      throw error;
    }
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Object} Updated user
   */
  async updateUser(id, userData) {
    try {
      const existingUser = await this.getUserById(id);
      
      // Merge existing user with updates
      const updatedUser = {
        ...existingUser,
        ...userData,
        id: existingUser.id // Preserve original ID
      };

      // Update in repository (if update method exists)
      if (this.dataRepository.update) {
        return this.dataRepository.update(id, updatedUser);
      }

      return updatedUser;
    } catch (error) {
      console.error('[UserService.updateUser] Error:', error);
      throw error;
    }
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {boolean} Success status
   */
  async deleteUser(id) {
    try {
      await this.getUserById(id); // Verify user exists
      
      if (this.dataRepository.delete) {
        return this.dataRepository.delete(id);
      }

      throw new Error('Delete operation not implemented');
    } catch (error) {
      console.error('[UserService.deleteUser] Error:', error);
      throw error;
    }
  }
}

// Export singleton instance
const userServiceInstance = new UserService();
export default userServiceInstance;
