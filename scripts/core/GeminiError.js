/**
 * Custom Error class for Gemini API errors
 * Extends the standard Error class with additional properties from the API response
 */
class GeminiError extends Error {
  /**
   * Creates a GeminiError instance from Gemini API error response data
   * @param {Object} data - The JSON response data from Gemini API containing error details
   */
  constructor(data) {
    super(data.error.message);
    this.name = 'GeminiError';
    this.code = data.error.code;
    this.status = data.error.status;

    // Store the error reason from details for generic error handling
    const errorDetail = data.error.details?.find(detail => detail.reason);
    if (errorDetail) {
      this.cause = errorDetail.reason;
    }
  }
}

// Expose GeminiError globally for instanceof checks
window.GeminiError = GeminiError;
