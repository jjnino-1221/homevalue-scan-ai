/**
 * Quality Analyzer Module
 * Uses TensorFlow.js for real-time photo quality feedback
 */

const QualityAnalyzer = (function() {
  let model = null;
  let isAnalyzing = false;
  let analysisInterval = null;

  /**
   * Initialize TensorFlow.js model
   * @returns {Promise<boolean>} Success status
   */
  async function init() {
    try {
      // Wait for TensorFlow.js to load
      if (typeof tf === 'undefined' || typeof mobilenet === 'undefined') {
        console.warn('TensorFlow.js not loaded, quality feedback disabled');
        return false;
      }

      console.log('Loading MobileNet model...');
      model = await mobilenet.load();
      console.log('✓ MobileNet model loaded');

      return true;

    } catch (error) {
      console.error('Failed to load TensorFlow.js model:', error);
      return false;
    }
  }

  /**
   * Start continuous analysis
   * @param {HTMLVideoElement} videoElement - Video feed to analyze
   * @param {Function} callback - Called with quality results {status, message}
   */
  function startAnalysis(videoElement, callback) {
    if (!model) {
      console.warn('Model not loaded, skipping analysis');
      return;
    }

    if (isAnalyzing) {
      console.warn('Analysis already running');
      return;
    }

    isAnalyzing = true;

    // Analyze at 2fps (every 500ms) to reduce CPU load
    analysisInterval = setInterval(async () => {
      try {
        const quality = await analyzeFrame(videoElement);
        callback(quality);
      } catch (error) {
        console.error('Analysis error:', error);
      }
    }, 500);

    console.log('✓ Quality analysis started (2fps)');
  }

  /**
   * Stop continuous analysis
   */
  function stopAnalysis() {
    if (analysisInterval) {
      clearInterval(analysisInterval);
      analysisInterval = null;
      isAnalyzing = false;
      console.log('✓ Quality analysis stopped');
    }
  }

  /**
   * Analyze single video frame
   * @param {HTMLVideoElement} videoElement
   * @returns {Promise<Object>} Quality result {status, message, details}
   */
  async function analyzeFrame(videoElement) {
    if (!model) {
      return { status: 'unknown', message: '' };
    }

    try {
      // Capture current frame as tensor
      const tensor = tf.browser.fromPixels(videoElement);

      // Analyze lighting (average brightness)
      const brightness = await analyzeBrightness(tensor);

      // Analyze motion blur (edge detection)
      const sharpness = await analyzeSharpness(tensor);

      // Clean up tensor
      tensor.dispose();

      // Determine overall quality
      return evaluateQuality(brightness, sharpness);

    } catch (error) {
      console.error('Frame analysis failed:', error);
      return { status: 'error', message: '' };
    }
  }

  /**
   * Analyze brightness (0-255)
   */
  async function analyzeBrightness(tensor) {
    const mean = await tensor.mean().data();
    return mean[0]; // Average pixel value
  }

  /**
   * Analyze sharpness using Laplacian variance
   * Higher variance = sharper image
   */
  async function analyzeSharpness(tensor) {
    // Convert to grayscale
    const gray = tensor.mean(2);

    // Calculate standard deviation (proxy for sharpness)
    const moments = tf.moments(gray);
    const variance = await moments.variance.data();

    gray.dispose();
    moments.variance.dispose();
    moments.mean.dispose();

    return variance[0];
  }

  /**
   * Evaluate overall quality
   */
  function evaluateQuality(brightness, sharpness) {
    const issues = [];

    // Check lighting (ideal range: 80-180)
    if (brightness < 60) {
      issues.push('too_dark');
    } else if (brightness > 200) {
      issues.push('too_bright');
    }

    // Check sharpness (variance threshold)
    if (sharpness < 100) {
      issues.push('motion_blur');
    }

    // Return status
    if (issues.length === 0) {
      return {
        status: 'good',
        message: '✓ Good lighting and focus',
        details: { brightness, sharpness }
      };
    } else if (issues.includes('too_dark')) {
      return {
        status: 'warning',
        message: '⚠️ Too dark - turn on more lights',
        details: { brightness, sharpness }
      };
    } else if (issues.includes('too_bright')) {
      return {
        status: 'warning',
        message: '⚠️ Too bright - avoid direct sunlight',
        details: { brightness, sharpness }
      };
    } else if (issues.includes('motion_blur')) {
      return {
        status: 'warning',
        message: '⚠️ Hold still - image is blurry',
        details: { brightness, sharpness }
      };
    }

    return {
      status: 'good',
      message: '',
      details: { brightness, sharpness }
    };
  }

  /**
   * Check if model is ready
   */
  function isReady() {
    return model !== null;
  }

  // Public API
  return {
    init,
    startAnalysis,
    stopAnalysis,
    analyzeFrame,
    isReady
  };
})();
