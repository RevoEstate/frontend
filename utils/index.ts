// Format error handler for consistent error handling
export function formatError(error: unknown): string {
    // Handle ZodError
    if (typeof error === 'object' && error !== null && 'errors' in error) {
      const zodError = error as { errors: Array<{ message: string }> };
      return zodError.errors.map(err => err.message).join('. ');
    }
  
    // Handle Fetch API errors
    if (error instanceof Error) {
      // Handle JSON response errors
      if (error.message.includes('Failed to fetch')) {
        return 'Network error. Please check your connection.';
      }
  
      // Handle other Error instances
      return error.message;
    }
  
    // Handle string errors
    if (typeof error === 'string') {
      return error;
    }
  
    // Fallback for unknown errors
    return 'An unknown error occurred. Please try again.';
  }