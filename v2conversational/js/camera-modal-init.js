
let isInitialized = false;

// Initialize DOM references
function initializeDOMReferences() {
  if (isInitialized) return;

  modal = document.getElementById('cameraModal');
  video = document.getElementById('cameraPreview');
  canvas = document.getElementById('photoCanvas');
  captureButton = document.getElementById('captureButton');
  continueButton = document.getElementById('continueButton');
  skipButton = document.getElementById('skipButton');
  closeButton = document.getElementById('closeModal');
  thumbnailsContainer = document.getElementById('thumbnails');
  roomTitle = document.getElementById('roomTitle');
  guidanceText = document.getElementById('guidanceText');
  photoCount = document.getElementById('photoCount');

  if (!modal || !video || !canvas) {
    console.warn('CameraModal: Some DOM elements not found');
    return;
  }

  // Set up event listeners
  captureButton.addEventListener('click', capturePhoto);
  continueButton.addEventListener('click', handleContinue);
  skipButton.addEventListener('click', handleSkip);
  closeButton.addEventListener('click', close);

  isInitialized = true;
  console.log('CameraModal initialized');
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDOMReferences);
} else {
  initializeDOMReferences();
}
