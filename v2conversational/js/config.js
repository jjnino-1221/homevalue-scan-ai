// Environment Configuration
// Manages environment-specific settings for development, staging, and production

/**
 * Detect current environment
 * Priority: URL parameter > localStorage > hostname detection
 */
function detectEnvironment() {
  // Check URL parameter (?env=production)
  const urlParams = new URLSearchParams(window.location.search);
  const urlEnv = urlParams.get('env');
  if (urlEnv && ['development', 'staging', 'production'].includes(urlEnv)) {
    localStorage.setItem('rocket_v2_env', urlEnv);
    return urlEnv;
  }

  // Check localStorage override
  const storedEnv = localStorage.getItem('rocket_v2_env');
  if (storedEnv && ['development', 'staging', 'production'].includes(storedEnv)) {
    return storedEnv;
  }

  // Detect from hostname
  const hostname = window.location.hostname;

  if (hostname.includes('localhost') || hostname === '127.0.0.1') {
    return 'development';
  }

  if (hostname.includes('staging') || hostname.includes('-stage.') || hostname.includes('stg.')) {
    return 'staging';
  }

  // Default to production
  return 'production';
}

const ENVIRONMENT = detectEnvironment();

/**
 * Environment-specific configuration
 */
const CONFIG = {
  development: {
    // Development settings
    environment: 'development',
    debug: true,
    logging: {
      enabled: true,
      level: 'debug', // debug, info, warn, error
      console: true
    },

    // API endpoints
    api: {
      baseUrl: 'http://localhost:3001',
      chatEndpoint: '/api/chat',
      timeout: 60000 // 60 seconds
    },

    // Claude AI settings
    claude: {
      model: 'us.anthropic.claude-sonnet-4-5-20250929-v1:0',
      streaming: true,
      temperature: 0.7,
      maxTokens: 4096
    },

    // Feature flags
    features: {
      voice: true,
      camera: true,
      photoAnalysis: true,
      offlineMode: false,
      mockMode: true, // Use mock responses when server unavailable
      analytics: false,
      errorTracking: false
    },

    // Storage settings
    storage: {
      enabled: true,
      prefix: 'rocket_valuation_v2_dev_',
      maxConversations: 10,
      ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
    },

    // Performance monitoring
    performance: {
      enabled: false,
      sampleRate: 1.0 // 100% sampling in dev
    }
  },

  staging: {
    // Staging settings
    environment: 'staging',
    debug: true,
    logging: {
      enabled: true,
      level: 'info',
      console: true
    },

    // API endpoints
    api: {
      baseUrl: 'https://staging-api.rocketmortgage.com',
      chatEndpoint: '/api/v2/chat',
      timeout: 45000 // 45 seconds
    },

    // Claude AI settings
    claude: {
      model: 'us.anthropic.claude-sonnet-4-5-20250929-v1:0',
      streaming: true,
      temperature: 0.7,
      maxTokens: 4096
    },

    // Feature flags
    features: {
      voice: true,
      camera: true,
      photoAnalysis: true,
      offlineMode: false,
      mockMode: false,
      analytics: true,
      errorTracking: true
    },

    // Storage settings
    storage: {
      enabled: true,
      prefix: 'rocket_valuation_v2_',
      maxConversations: 10,
      ttl: 30 * 24 * 60 * 60 * 1000 // 30 days
    },

    // Performance monitoring
    performance: {
      enabled: true,
      sampleRate: 0.5 // 50% sampling in staging
    }
  },

  production: {
    // Production settings
    environment: 'production',
    debug: false,
    logging: {
      enabled: true,
      level: 'error', // Only log errors in production
      console: false
    },

    // API endpoints
    api: {
      baseUrl: 'https://api.rocketmortgage.com',
      chatEndpoint: '/api/v2/chat',
      timeout: 30000 // 30 seconds
    },

    // Claude AI settings
    claude: {
      model: 'us.anthropic.claude-sonnet-4-5-20250929-v1:0',
      streaming: true,
      temperature: 0.7,
      maxTokens: 4096
    },

    // Feature flags
    features: {
      voice: true,
      camera: true,
      photoAnalysis: true,
      offlineMode: false,
      mockMode: false,
      analytics: true,
      errorTracking: true
    },

    // Storage settings
    storage: {
      enabled: true,
      prefix: 'rocket_valuation_v2_',
      maxConversations: 5,
      ttl: 90 * 24 * 60 * 60 * 1000 // 90 days
    },

    // Performance monitoring
    performance: {
      enabled: true,
      sampleRate: 0.1 // 10% sampling in production
    }
  }
};

// Get current configuration
const currentConfig = CONFIG[ENVIRONMENT];

/**
 * Get configuration value
 * @param {string} path - Dot notation path (e.g., 'api.baseUrl')
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} Configuration value
 */
function get(path, defaultValue = null) {
  const keys = path.split('.');
  let value = currentConfig;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  return value;
}

/**
 * Check if feature is enabled
 * @param {string} featureName - Name of feature
 * @returns {boolean} True if feature is enabled
 */
function isFeatureEnabled(featureName) {
  return get(`features.${featureName}`, false);
}

/**
 * Get full API URL
 * @param {string} endpoint - Endpoint path
 * @returns {string} Full URL
 */
function getApiUrl(endpoint) {
  const baseUrl = get('api.baseUrl');
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  return `${cleanBase}/${cleanEndpoint}`;
}

/**
 * Log message based on environment log level
 * @param {string} level - Log level (debug, info, warn, error)
 * @param {string} message - Log message
 * @param {*} data - Optional data to log
 */
function log(level, message, data = null) {
  if (!get('logging.enabled')) return;

  const configLevel = get('logging.level', 'error');
  const levels = { debug: 0, info: 1, warn: 2, error: 3 };

  // Only log if level is high enough
  if (levels[level] < levels[configLevel]) return;

  // Only log to console if enabled
  if (!get('logging.console') && !get('debug')) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${ENVIRONMENT}] [${level.toUpperCase()}]`;

  switch (level) {
    case 'debug':
      console.log(prefix, message, data || '');
      break;
    case 'info':
      console.info(prefix, message, data || '');
      break;
    case 'warn':
      console.warn(prefix, message, data || '');
      break;
    case 'error':
      console.error(prefix, message, data || '');
      break;
  }
}

/**
 * Set environment override (for testing)
 * @param {string} env - Environment name
 */
function setEnvironment(env) {
  if (['development', 'staging', 'production'].includes(env)) {
    localStorage.setItem('rocket_v2_env', env);
    window.location.reload();
  } else {
    console.error('Invalid environment:', env);
  }
}

/**
 * Clear environment override
 */
function clearEnvironment() {
  localStorage.removeItem('rocket_v2_env');
  window.location.reload();
}

/**
 * Get environment info for display
 * @returns {Object} Environment information
 */
function getInfo() {
  return {
    environment: ENVIRONMENT,
    debug: currentConfig.debug,
    apiBaseUrl: currentConfig.api.baseUrl,
    features: currentConfig.features,
    version: '2.0.0'
  };
}

// Log startup
log('info', 'Application starting', {
  environment: ENVIRONMENT,
  debug: currentConfig.debug,
  features: currentConfig.features
});

// Export configuration interface
export const Config = {
  ENVIRONMENT,
  get,
  isFeatureEnabled,
  getApiUrl,
  log,
  setEnvironment,
  clearEnvironment,
  getInfo,

  // Convenience accessors
  isDevelopment: ENVIRONMENT === 'development',
  isStaging: ENVIRONMENT === 'staging',
  isProduction: ENVIRONMENT === 'production',
  debug: currentConfig.debug
};

// Make available globally for debugging
window.RocketConfig = Config;

// Log config to console in development
if (Config.debug) {
  console.log('Configuration loaded:', currentConfig);
}
