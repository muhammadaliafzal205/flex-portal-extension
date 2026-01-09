/**
 * Utility functions for storage, comparison, and data processing
 * Created: 2026-01-09 19:24:11 UTC
 */

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

/**
 * Save data to Chrome storage (local)
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be serialized to JSON)
 * @returns {Promise<void>}
 */
export const saveToStorage = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Retrieve data from Chrome storage (local)
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {Promise<*>}
 */
export const getFromStorage = (key, defaultValue = null) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(key in result ? result[key] : defaultValue);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Remove data from Chrome storage (local)
 * @param {string|string[]} keys - Storage key(s) to remove
 * @returns {Promise<void>}
 */
export const removeFromStorage = (keys) => {
  const keyArray = Array.isArray(keys) ? keys : [keys];
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.remove(keyArray, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Clear all data from Chrome storage (local)
 * @returns {Promise<void>}
 */
export const clearStorage = () => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Save data to Chrome sync storage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {Promise<void>}
 */
export const saveToSyncStorage = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Retrieve data from Chrome sync storage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {Promise<*>}
 */
export const getFromSyncStorage = (key, defaultValue = null) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(key in result ? result[key] : defaultValue);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// ============================================================================
// COMPARISON UTILITIES
// ============================================================================

/**
 * Deep equality check for two values
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean}
 */
export const deepEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => deepEqual(a[key], b[key]));
};

/**
 * Shallow equality check for two objects
 * @param {object} a - First object
 * @param {object} b - Second object
 * @returns {boolean}
 */
export const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => a[key] === b[key]);
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Compare two arrays for deep equality
 * @param {array} a - First array
 * @param {array} b - Second array
 * @returns {boolean}
 */
export const arraysEqual = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((item, index) => deepEqual(item, b[index]));
};

/**
 * Check if two values are semantically equal (handles various types)
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean}
 */
export const valuesEqual = (a, b) => {
  // Handle numbers
  if (typeof a === 'number' && typeof b === 'number') {
    return Number.isNaN(a) && Number.isNaN(b) ? true : a === b;
  }
  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    return arraysEqual(a, b);
  }
  // Handle objects
  if (typeof a === 'object' && typeof b === 'object') {
    return deepEqual(a, b);
  }
  return a === b;
};

// ============================================================================
// DATA PROCESSING UTILITIES
// ============================================================================

/**
 * Deep clone an object or array
 * @param {*} obj - Object to clone
 * @returns {*}
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
};

/**
 * Merge multiple objects (shallow merge)
 * @param {...object} objects - Objects to merge
 * @returns {object}
 */
export const mergeObjects = (...objects) => {
  return objects.reduce((acc, obj) => {
    if (typeof obj === 'object' && obj !== null) {
      Object.assign(acc, obj);
    }
    return acc;
  }, {});
};

/**
 * Deep merge multiple objects
 * @param {...object} objects - Objects to merge
 * @returns {object}
 */
export const deepMerge = (...objects) => {
  return objects.reduce((acc, obj) => {
    if (typeof obj !== 'object' || obj === null) return acc;
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof acc[key] === 'object' && typeof obj[key] === 'object' && !Array.isArray(acc[key]) && !Array.isArray(obj[key])) {
          acc[key] = deepMerge(acc[key], obj[key]);
        } else {
          acc[key] = deepClone(obj[key]);
        }
      }
    }
    return acc;
  }, {});
};

/**
 * Filter object by keys
 * @param {object} obj - Object to filter
 * @param {string[]} keys - Keys to keep
 * @returns {object}
 */
export const filterObjectByKeys = (obj, keys) => {
  const filtered = {};
  keys.forEach(key => {
    if (key in obj) {
      filtered[key] = obj[key];
    }
  });
  return filtered;
};

/**
 * Omit keys from object
 * @param {object} obj - Object to filter
 * @param {string[]} keysToOmit - Keys to remove
 * @returns {object}
 */
export const omitObjectKeys = (obj, keysToOmit) => {
  const filtered = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !keysToOmit.includes(key)) {
      filtered[key] = obj[key];
    }
  }
  return filtered;
};

/**
 * Transform object keys (rename keys based on mapping)
 * @param {object} obj - Object to transform
 * @param {object} keyMap - Map of old key to new key
 * @returns {object}
 */
export const transformObjectKeys = (obj, keyMap) => {
  const transformed = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = keyMap[key] || key;
      transformed[newKey] = obj[key];
    }
  }
  return transformed;
};

/**
 * Flatten a nested object
 * @param {object} obj - Object to flatten
 * @param {string} prefix - Prefix for keys
 * @returns {object}
 */
export const flattenObject = (obj, prefix = '') => {
  const flattened = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(flattened, flattenObject(value, newKey));
      } else {
        flattened[newKey] = value;
      }
    }
  }
  return flattened;
};

/**
 * Group array items by a key or function
 * @param {array} array - Array to group
 * @param {string|function} keyOrFn - Key name or function to group by
 * @returns {object}
 */
export const groupBy = (array, keyOrFn) => {
  return array.reduce((acc, item) => {
    const key = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn];
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * Sort array of objects by key or function
 * @param {array} array - Array to sort
 * @param {string|function} keyOrFn - Key name or function to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {array}
 */
export const sortBy = (array, keyOrFn, order = 'asc') => {
  const sorted = [...array];
  sorted.sort((a, b) => {
    const valueA = typeof keyOrFn === 'function' ? keyOrFn(a) : a[keyOrFn];
    const valueB = typeof keyOrFn === 'function' ? keyOrFn(b) : b[keyOrFn];
    
    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
};

/**
 * Remove duplicates from array
 * @param {array} array - Array with potential duplicates
 * @param {string|function} keyOrFn - Key to check for uniqueness (optional)
 * @returns {array}
 */
export const removeDuplicates = (array, keyOrFn = null) => {
  if (!keyOrFn) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const key = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/**
 * Chunk an array into smaller arrays
 * @param {array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {array<array>}
 */
export const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Find differences between two objects
 * @param {object} obj1 - First object
 * @param {object} obj2 - Second object
 * @returns {object} - Differences
 */
export const findObjectDifferences = (obj1, obj2) => {
  const differences = {};
  
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  
  allKeys.forEach(key => {
    if (!deepEqual(obj1[key], obj2[key])) {
      differences[key] = {
        old: obj1[key],
        new: obj2[key]
      };
    }
  });
  
  return differences;
};

/**
 * Validate object against schema
 * @param {object} obj - Object to validate
 * @param {object} schema - Schema with type definitions
 * @returns {object} - Validation result {isValid: boolean, errors: array}
 */
export const validateSchema = (obj, schema) => {
  const errors = [];
  
  for (const key in schema) {
    if (schema.hasOwnProperty(key)) {
      const expectedType = schema[key];
      const value = obj[key];
      const actualType = value === null ? 'null' : typeof value;
      
      if (actualType !== expectedType && !(expectedType === 'array' && Array.isArray(value))) {
        errors.push(`Field '${key}' should be of type '${expectedType}' but got '${actualType}'`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string}
 */
export const capitalize = (str) => {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert string to camelCase
 * @param {string} str - String to convert
 * @returns {string}
 */
export const toCamelCase = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return '';
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

/**
 * Convert string to kebab-case
 * @param {string} str - String to convert
 * @returns {string}
 */
export const toKebabCase = (str) => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} length - Max length
 * @param {string} suffix - Suffix to append
 * @returns {string}
 */
export const truncateString = (str, length, suffix = '...') => {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique ID
 * @returns {string}
 */
export const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce a function
 * @param {function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {function}
 */
export const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

/**
 * Throttle a function
 * @param {function} fn - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function}
 */
export const throttle = (fn, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Get nested property value safely
 * @param {object} obj - Object to access
 * @param {string} path - Path to property (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*}
 */
export const getNestedValue = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value != null && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }
  
  return value;
};

/**
 * Set nested property value safely
 * @param {object} obj - Object to modify
 * @param {string} path - Path to property (e.g., 'user.profile.name')
 * @param {*} value - Value to set
 * @returns {object}
 */
export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
};

/**
 * Retry a function with exponential backoff
 * @param {function} fn - Async function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise}
 */
export const retryWithBackoff = async (fn, maxAttempts = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

export default {
  // Storage
  saveToStorage,
  getFromStorage,
  removeFromStorage,
  clearStorage,
  saveToSyncStorage,
  getFromSyncStorage,
  
  // Comparison
  deepEqual,
  shallowEqual,
  isEmpty,
  arraysEqual,
  valuesEqual,
  
  // Data Processing
  deepClone,
  mergeObjects,
  deepMerge,
  filterObjectByKeys,
  omitObjectKeys,
  transformObjectKeys,
  flattenObject,
  groupBy,
  sortBy,
  removeDuplicates,
  chunkArray,
  findObjectDifferences,
  validateSchema,
  
  // String
  capitalize,
  toCamelCase,
  toKebabCase,
  truncateString,
  
  // Utilities
  generateUniqueId,
  debounce,
  throttle,
  getNestedValue,
  setNestedValue,
  retryWithBackoff
};
