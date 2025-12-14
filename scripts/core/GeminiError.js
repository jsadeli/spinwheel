/**
 * Custom Error class for Gemini API errors.
 * Extends the standard Error class with additional properties from the API response.
 *
 * Gemini API errors follow a structured format such as:
 *
 * {
 *   "error": {
 *     "code": 400,
 *     "message": "API key not valid. Please pass a valid API key.",
 *     "status": "INVALID_ARGUMENT",
 *     "details": [
 *       {
 *         "@type": "type.googleapis.com/google.rpc.ErrorInfo",
 *         "reason": "API_KEY_INVALID",
 *         "domain": "googleapis.com",
 *         "metadata": { "service": "generativelanguage.googleapis.com" }
 *       },
 *       {
 *         "@type": "type.googleapis.com/google.rpc.LocalizedMessage",
 *         "locale": "en-US",
 *         "message": "API key not valid. Please pass a valid API key."
 *       }
 *     ]
 *   }
 * }
 *
 * This class extracts:
 *   • error.message → becomes the Error message
 *   • error.code → numeric error code
 *   • error.status → symbolic status string
 *   • error.details[].reason → stored as `cause` when present
 *
 * Example:
 *   const err = new GeminiError(data);
 *   err.message  // "API key not valid. Please pass a valid API key."
 *   err.code     // 400
 *   err.status   // "INVALID_ARGUMENT"
 *   err.cause    // "API_KEY_INVALID"
 *
 * These additional fields allow callers to implement targeted error handling,
 * such as detecting invalid API keys, quota issues, or permission failures.
 */
export class GeminiError extends Error {
  /**
   * Creates a GeminiError instance from Gemini API error response data.
   *
   * @param {Object} data - The JSON response data from Gemini API.
   * @param {Object} data.error - The error object from the API response.
   * @param {string} data.error.message - The error message.
   * @param {number} data.error.code - The HTTP error code (e.g., 400, 403, 429).
   * @param {string} data.error.status - The error status string (e.g., "INVALID_ARGUMENT").
   * @param {Array<Object>} [data.error.details] - Optional array of error detail objects.
   * @param {string} [data.error.details[].reason] - The specific error reason (e.g., "API_KEY_INVALID").
   *
   * @property {string} name - Always "GeminiError".
   * @property {string} message - The error message from the API.
   * @property {number} code - The HTTP error code.
   * @property {string} status - The symbolic error status.
   * @property {string} [cause] - The error reason extracted from details (if available).
   *
   * @example
   * const errorData = {
   *   error: {
   *     code: 400,
   *     message: "API key not valid",
   *     status: "INVALID_ARGUMENT",
   *     details: [{ reason: "API_KEY_INVALID" }]
   *   }
   * };
   * const err = new GeminiError(errorData);
   * console.log(err.code);   // 400
   * console.log(err.status); // "INVALID_ARGUMENT"
   * console.log(err.cause);  // "API_KEY_INVALID"
   */
  constructor(data) {
    super(data.error.message);
    this.name = "GeminiError";
    this.code = data.error.code;
    this.status = data.error.status;

    // Store the error reason from details for generic error handling
    const errorDetail = data.error.details?.find((detail) => detail.reason);
    if (errorDetail) {
      this.cause = errorDetail.reason;
    }
  }
}

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.GeminiError = GeminiError;
}
