// Diagnostics and Performance Monitoring
// Helps diagnose UI/UX issues and performance bottlenecks

class Diagnostics {
  constructor() {
    this.logs = [];
    this.startTime = Date.now();
    this.eventTimes = new Map();
    this.errors = [];
  }

  log(category, message, data = null) {
    const entry = {
      timestamp: Date.now() - this.startTime,
      category,
      message,
      data
    };
    this.logs.push(entry);
    console.log(`[${entry.timestamp}ms] [${category}] ${message}`, data || '');
  }

  trackEvent(eventName) {
    this.eventTimes.set(eventName, Date.now());
    this.log('event', eventName);
  }

  getEventDuration(eventName) {
    const startTime = this.eventTimes.get(eventName);
    if (!startTime) return null;
    return Date.now() - startTime;
  }

  trackError(error, context = '') {
    const errorEntry = {
      timestamp: Date.now() - this.startTime,
      error: error.message || error,
      stack: error.stack,
      context
    };
    this.errors.push(errorEntry);
    console.error(`[${errorEntry.timestamp}ms] ERROR:`, context, error);
  }

  // Check for common issues
  checkHealth() {
    const health = {
      timestamp: Date.now(),
      issues: [],
      warnings: []
    };

    // Check conversation state
    try {
      const state = window.AIOrchestrator?.getConversationState();
      if (!state) {
        health.issues.push('Conversation state not initialized');
      } else {
        health.conversationLength = state.messages.length;
        health.currentStage = state.stage;
      }
    } catch (e) {
      health.issues.push(`Conversation state error: ${e.message}`);
    }

    // Check API connectivity
    try {
      const apiUrl = window.RocketConfig?.get('api.baseUrl');
      if (!apiUrl) {
        health.warnings.push('API URL not configured');
      } else {
        health.apiUrl = apiUrl;
      }
    } catch (e) {
      health.issues.push(`Config error: ${e.message}`);
    }

    // Check localStorage
    try {
      localStorage.setItem('_health_check', 'test');
      localStorage.removeItem('_health_check');
      health.localStorageWorking = true;
    } catch (e) {
      health.issues.push('localStorage not available');
      health.localStorageWorking = false;
    }

    // Check for errors in logs
    health.errorCount = this.errors.length;
    if (this.errors.length > 0) {
      health.warnings.push(`${this.errors.length} errors logged`);
    }

    return health;
  }

  // Generate report
  generateReport() {
    return {
      sessionDuration: Date.now() - this.startTime,
      totalLogs: this.logs.length,
      totalErrors: this.errors.length,
      health: this.checkHealth(),
      recentLogs: this.logs.slice(-20),
      errors: this.errors
    };
  }

  // Print report to console
  printReport() {
    console.log('===== DIAGNOSTICS REPORT =====');
    const report = this.generateReport();
    console.log('Session Duration:', report.sessionDuration + 'ms');
    console.log('Total Logs:', report.totalLogs);
    console.log('Total Errors:', report.totalErrors);
    console.log('\nHealth Check:', report.health);
    console.log('\nRecent Logs:', report.recentLogs);
    if (report.errors.length > 0) {
      console.log('\nErrors:', report.errors);
    }
    console.log('==============================');
  }

  // Export to download
  exportReport() {
    const report = this.generateReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Initialize global diagnostics
window.Diagnostics = new Diagnostics();

// Intercept console errors
const originalError = console.error;
console.error = function(...args) {
  window.Diagnostics.trackError(new Error(args.join(' ')), 'console.error');
  originalError.apply(console, args);
};

// Track page load
window.addEventListener('load', () => {
  window.Diagnostics.log('lifecycle', 'Page loaded');
});

// Track unhandled errors
window.addEventListener('error', (event) => {
  window.Diagnostics.trackError(event.error, 'unhandled error');
});

// Track promise rejections
window.addEventListener('unhandledrejection', (event) => {
  window.Diagnostics.trackError(event.reason, 'unhandled promise rejection');
});

// Expose helper commands
window.checkHealth = () => {
  const health = window.Diagnostics.checkHealth();
  console.log('Health Check:', health);
  return health;
};

window.getDiagnostics = () => {
  window.Diagnostics.printReport();
};

window.exportDiagnostics = () => {
  window.Diagnostics.exportReport();
};

console.log('Diagnostics initialized. Use checkHealth() or getDiagnostics() to inspect.');

export { Diagnostics };
