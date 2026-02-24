import BaseController from './BaseController.js';
import userService from '../services/userService.js';

/**
 * UserController - Handles HTTP requests for user operations
 * Extends BaseController for standardized error handling
 */
class UserController extends BaseController {
  constructor(service = userService) {
    super();
    this.userService = service;
  }

  /**
   * Get all users
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAllUsers(req, res) {
    try {
      const result = await this.userService.getAllUsers();
      this.handleSuccess(res, result);
    } catch (error) {
      this.handleError(error, res, 'UserController.getAllUsers');
    }
  }

  /**
   * Get user by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getUserById(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return this.handleBadRequest(res, 'Invalid user ID');
      }

      const user = await this.userService.getUserById(id);
      this.handleSuccess(res, { data: user });
    } catch (error) {
      if (error.statusCode === 404) {
        this.handleNotFound(res, error.message);
      } else {
        this.handleError(error, res, 'UserController.getUserById');
      }
    }
  }

  /**
   * Create a new user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createUser(req, res) {
    try {
      const { name, email, age } = req.body;
      
      const newUser = await this.userService.createUser({ 
        name, 
        email, 
        age: parseInt(age) 
      });
      
      this.handleCreated(res, {
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      if (error.statusCode === 400) {
        this.handleBadRequest(res, error.message);
      } else {
        this.handleError(error, res, 'UserController.createUser');
      }
    }
  }

  /**
   * Update user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return this.handleBadRequest(res, 'Invalid user ID');
      }

      const updatedUser = await this.userService.updateUser(id, req.body);
      
      this.handleSuccess(res, {
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      if (error.statusCode === 404) {
        this.handleNotFound(res, error.message);
      } else if (error.statusCode === 400) {
        this.handleBadRequest(res, error.message);
      } else {
        this.handleError(error, res, 'UserController.updateUser');
      }
    }
  }

  /**
   * Delete user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return this.handleBadRequest(res, 'Invalid user ID');
      }
       
      await this.userService.deleteUser(id);
      
      this.handleSuccess(res, {
        message: 'User deleted successfully'
      });
    } catch (error) {
      if (error.statusCode === 404) {
        this.handleNotFound(res, error.message);
      } else {
        this.handleError(error, res, 'UserController.deleteUser');
      }
    }
  }
}

// Export singleton instance
const userControllerInstance = new UserController();
export default userControllerInstance;

