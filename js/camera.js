/**
 * Camera Module
 * Handles MediaDevices API for camera access and photo capture
 */

const Camera = (function() {
  let stream = null;
  let videoElement = null;

  /**
   * Initialize camera with rear-facing preference
   * @param {HTMLVideoElement} video - Video element for preview
   * @returns {Promise<Object>} Success status and error message if failed
   */
  async function init(video) {
    videoElement = video;

    try {
      // Request camera with rear-facing preference (mobile)
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Rear camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      // Attach stream to video element
      videoElement.srcObject = stream;

      return {
        success: true,
        stream: stream
      };

    } catch (error) {
      console.error('Camera access failed:', error);

      return {
        success: false,
        error: error.name,
        message: getCameraErrorMessage(error)
      };
    }
  }

  /**
   * Get user-friendly error message
   */
  function getCameraErrorMessage(error) {
    switch (error.name) {
      case 'NotAllowedError':
        return 'Camera permission denied. Please allow camera access.';
      case 'NotFoundError':
        return 'No camera found on this device.';
      case 'NotReadableError':
        return 'Camera is already in use by another app.';
      default:
        return 'Unable to access camera. Please try again.';
    }
  }

  /**
   * Capture photo from video stream
   * @returns {Promise<string>} Base64-encoded image data
   */
  async function capturePhoto() {
    if (!stream || !videoElement) {
      throw new Error('Camera not initialized');
    }

    // Create canvas matching video dimensions
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw current video frame to canvas
    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert to base64 JPEG (quality 0.85)
    const imageData = canvas.toDataURL('image/jpeg', 0.85);

    return imageData;
  }

  /**
   * Stop camera stream and release resources
   */
  function stop() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }

    if (videoElement) {
      videoElement.srcObject = null;
    }

    console.log('✓ Camera stopped');
  }

  /**
   * Check if camera is currently active
   */
  function isActive() {
    return stream !== null;
  }

  // Public API
  return {
    init,
    capturePhoto,
    stop,
    isActive
  };
})();
