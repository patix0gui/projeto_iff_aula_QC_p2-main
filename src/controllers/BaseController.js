/**
 * BaseController - Base class for all controllers
 * Provides standardized error handling and response formatting
 */
class BaseController {
  /**
   * Send success response
   * @param {Object} res - Express response object
   * @param {*} data - Data to send
   * @param {number} statusCode - HTTP status code
   */
  handleSuccess(res, data, statusCode = 200) {
    res.status(statusCode).json(data);
  }

  /**
   * Send error response
   * @param {Error} error - Error object
   * @param {Object} res - Express response object
   * @param {string} context - Error context (method name)
   */
  handleError(error, res, context = 'Unknown') {
    console.error(`[${context}] Error:`, error);
    
    // In production, integrate with Sentry here
    // Sentry.captureException(error);
    
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    
    res.status(statusCode).json({
      error: true,
      message,
      context
    });
  }

  /**
   * Send not found response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  handleNotFound(res, message = 'Resource not found') {
    res.status(404).json({
      error: true,
      message
    });
  }

  /**
   * Send bad request response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  handleBadRequest(res, message = 'Bad request') {
    res.status(400).json({
      error: true,
      message
    });
  }

  /**
   * Send created response
   * @param {Object} res - Express response object
   * @param {*} data - Created resource data
   */
  handleCreated(res, data) {
    this.handleSuccess(res, data, 201);
  }
}

export default BaseController;
