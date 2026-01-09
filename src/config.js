/**
 * Configuration Constants for Flex Portal Extension
 * Last Updated: 2026-01-09 19:24:06 UTC
 */

// Extension metadata
const CONFIG = {
  // Extension identification
  EXTENSION_NAME: 'Flex Portal Extension',
  EXTENSION_VERSION: '1.0.0',
  EXTENSION_AUTHOR: 'muhammadaliafzal205',
  
  // API endpoints
  API: {
    BASE_URL: 'https://api.example.com',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
  
  // Storage configuration
  STORAGE: {
    LOCAL_STORAGE_PREFIX: 'flex_portal_',
    SESSION_STORAGE_PREFIX: 'flex_portal_session_',
    CACHE_DURATION: 3600000, // 1 hour in milliseconds
  },
  
  // UI Configuration
  UI: {
    THEME: 'light', // 'light' or 'dark'
    ANIMATION_DURATION: 300, // milliseconds
    MODAL_Z_INDEX: 10000,
    NOTIFICATION_DURATION: 5000, // milliseconds
  },
  
  // Feature flags
  FEATURES: {
    ENABLE_ANALYTICS: true,
    ENABLE_DEBUG_MODE: false,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_SYNC: true,
  },
  
  // Logging configuration
  LOGGING: {
    LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
    ENABLE_CONSOLE: true,
    ENABLE_FILE: false,
    MAX_LOG_SIZE: 10485760, // 10MB
  },
  
  // Performance configuration
  PERFORMANCE: {
    ENABLE_COMPRESSION: true,
    BATCH_REQUEST_SIZE: 50,
    DEBOUNCE_DELAY: 300, // milliseconds
    THROTTLE_DELAY: 500, // milliseconds
  },
  
  // Security configuration
  SECURITY: {
    ENABLE_CSP: true,
    ENABLE_CORS: true,
    ALLOWED_ORIGINS: ['https://example.com', 'https://localhost:3000'],
    SESSION_TIMEOUT: 1800000, // 30 minutes in milliseconds
  },
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
