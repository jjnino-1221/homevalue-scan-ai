/**
 * Capture Main
 * Orchestrates camera capture workflow
 */

(function() {
  let cameraInitialized = false;

  /**
   * Initialize capture page
   */
  async function init() {
    console.log('Capture page loaded');

    // Initialize controller and get current room
    const roomInfo = CaptureController.init();
    updateUI(roomInfo);

    // Initialize camera
    const videoElement = document.getElementById('camera-feed');
    const result = await Camera.init(videoElement);

    if (result.success) {
      cameraInitialized = true;
      console.log('✓ Camera initialized');
      hideError();

      // Initialize quality analyzer
      const qualityReady = await QualityAnalyzer.init();
      if (qualityReady) {
        // Start real-time quality analysis
        QualityAnalyzer.startAnalysis(videoElement, updateQualityFeedback);
      } else {
        console.warn('Quality analysis not available');
      }
    } else {
      cameraInitialized = false;
      console.error('Camera failed:', result.message);
      showError(result.message);
    }

    // Set up event handlers
    setupEventHandlers();

    console.log('✓ Capture page initialized');
  }

  /**
   * Update UI with current room info
   */
  function updateUI(roomInfo) {
    document.getElementById('room-title').textContent = roomInfo.name;
    document.getElementById('progress-indicator').textContent =
      `${roomInfo.index + 1}/${roomInfo.total}`;
    document.getElementById('capture-instructions').textContent = roomInfo.instruction;
  }

  /**
   * Set up event handlers
   */
  function setupEventHandlers() {
    // Capture button
    document.getElementById('capture-button').addEventListener('click', handleCapture);

    // Back button
    document.getElementById('back-button').addEventListener('click', handleBack);

    // Upload fallback button
    document.getElementById('upload-fallback').addEventListener('click', () => {
      document.getElementById('file-input').click();
    });

    // File input change
    document.getElementById('file-input').addEventListener('change', handleFileUpload);
  }

  /**
   * Handle photo capture
   */
  async function handleCapture() {
    if (!cameraInitialized) {
      alert('Camera not available');
      return;
    }

    try {
      const captureButton = document.getElementById('capture-button');
      captureButton.disabled = true;

      // Capture photo
      const imageData = await Camera.capturePhoto();
      console.log('✓ Photo captured');

      // Run LiDAR scan
      const roomInfo = CaptureController.getCurrentRoom();
      const dimensions = await LidarScanner.scan(roomInfo.id);

      // Save photo with dimensions
      const saveResult = await PhotoStorage.savePhoto(
        roomInfo.id,
        imageData,
        dimensions
      );

      if (saveResult.success) {
        console.log('✓ Photo saved successfully');
        moveToNextRoom();
      } else {
        handleSaveError(saveResult, roomInfo.id, imageData, dimensions);
      }

      captureButton.disabled = false;

    } catch (error) {
      console.error('Capture failed:', error);
      alert('Failed to capture photo. Please try again.');
      document.getElementById('capture-button').disabled = false;
    }
  }

  /**
   * Handle save errors (including QuotaExceededError)
   */
  function handleSaveError(result, roomId, imageData, dimensions) {
    if (result.error === 'QuotaExceededError') {
      // Show recovery options
      const action = confirm(
        result.message + '\n\nDelete oldest photo to free space?\n\n' +
        'OK = Delete oldest\nCancel = Skip this photo'
      );

      if (action) {
        // Delete oldest and retry
        const deleteResult = PhotoStorage.deleteOldestPhoto();
        if (deleteResult.success) {
          console.log(`Deleted oldest photo: ${deleteResult.roomName}`);
          // Retry save
          PhotoStorage.savePhoto(roomId, imageData, dimensions)
            .then(retryResult => {
              if (retryResult.success) {
                moveToNextRoom();
              } else {
                alert('Still unable to save. Please free up storage space.');
              }
            });
        }
      } else {
        // Skip this photo
        console.log('User skipped photo due to storage issue');
        moveToNextRoom();
      }
    } else {
      alert('Failed to save photo: ' + result.error);
    }
  }

  /**
   * Move to next room or complete
   */
  function moveToNextRoom() {
    const nextRoom = CaptureController.nextRoom();

    if (nextRoom) {
      // Update UI for next room
      updateUI(nextRoom);
    } else {
      // All rooms complete, go to review page
      console.log('✓ All photos captured');
      Camera.stop();
      navigateTo('review.html');
    }
  }

  /**
   * Handle back button
   */
  function handleBack() {
    const prevRoom = CaptureController.previousRoom();

    if (prevRoom) {
      updateUI(prevRoom);
    } else {
      // At first room, go back to instructions
      Camera.stop();
      navigateTo('instructions.html');
    }
  }

  /**
   * Handle file upload (fallback)
   */
  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Convert file to base64
      const imageData = await fileToBase64(file);

      // Run LiDAR scan
      const roomInfo = CaptureController.getCurrentRoom();
      const dimensions = await LidarScanner.scan(roomInfo.id);

      // Save photo
      const saveResult = await PhotoStorage.savePhoto(
        roomInfo.id,
        imageData,
        dimensions
      );

      if (saveResult.success) {
        console.log('✓ Photo uploaded successfully');
        moveToNextRoom();
      } else {
        handleSaveError(saveResult, roomInfo.id, imageData, dimensions);
      }

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload photo. Please try again.');
    }
  }

  /**
   * Convert File to base64
   */
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Show camera error
   */
  function showError(message) {
    const errorDiv = document.getElementById('camera-error');
    errorDiv.querySelector('p').textContent = message;
    errorDiv.style.display = 'block';

    // Hide camera container
    document.querySelector('.camera-container').style.display = 'none';
    document.getElementById('capture-button').style.display = 'none';
  }

  /**
   * Hide camera error
   */
  function hideError() {
    document.getElementById('camera-error').style.display = 'none';
  }

  /**
   * Clean up on page unload
   */
  window.addEventListener('beforeunload', () => {
    if (cameraInitialized) {
      Camera.stop();
    }
  });

  // Initialize when DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
