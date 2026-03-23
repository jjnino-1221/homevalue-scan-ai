// Camera Modal - Photo capture overlay with AI guidance
// Phase 3 Implementation - Camera access, photo capture, and storage

let modal = document.getElementById('cameraModal');
let video = document.getElementById('cameraPreview');
let canvas = document.getElementById('photoCanvas');
let captureButton = document.getElementById('captureButton');
let continueButton = document.getElementById('continueButton');
let skipButton = document.getElementById('skipButton');
let closeButton = document.getElementById('closeModal');
let thumbnailsContainer = document.getElementById('thumbnails');
let roomTitle = document.getElementById('roomTitle');
let guidanceText = document.getElementById('guidanceText');
let photoCount = document.getElementById('photoCount');

let mediaStream = null;
let capturedPhotos = [];
let currentRoomType = null;
let currentInstruction = null;
let photosCallback = null;
const MAX_PHOTOS = 5;

// Room-specific guidance content
const ROOM_GUIDANCE = {
  kitchen: {
    title: '🍳 Kitchen Photos',
    instruction: 'Capture your kitchen from multiple angles, including countertops, appliances, and cabinets.',
    tips: [
      '✓ Show all major appliances',
      '✓ Capture countertop condition',
      '✓ Include cabinet details'
    ]
  },
  bathroom: {
    title: '🚿 Bathroom Photos',
    instruction: 'Capture the bathroom showing fixtures, tiles, and overall condition.',
    tips: [
      '✓ Show vanity and sink',
      '✓ Capture shower/tub',
      '✓ Include tile condition'
    ]
  },
  living_room: {
    title: '🛋️ Living Room Photos',
    instruction: 'Capture the living space from different corners to show the full room.',
    tips: [
      '✓ Show flooring type',
      '✓ Capture windows',
      '✓ Include ceiling details'
    ]
  },
  bedroom: {
    title: '🛏️ Bedroom Photos',
    instruction: 'Capture the bedroom showing size, layout, and condition.',
    tips: [
      '✓ Show full room layout',
      '✓ Capture closet space',
      '✓ Include window placement'
    ]
  },
  exterior: {
    title: '🏡 Exterior Photos',
    instruction: 'Capture front, back, and sides of the property.',
    tips: [
      '✓ Show curb appeal',
      '✓ Capture roof condition',
      '✓ Include landscaping'
    ]
  }
};

// Open camera modal
async function open(roomType, instruction) {
  currentRoomType = roomType;
  currentInstruction = instruction;
  capturedPhotos = [];

  // Set room-specific content
  const guidance = ROOM_GUIDANCE[roomType] || ROOM_GUIDANCE.living_room;
  roomTitle.textContent = guidance.title;
  guidanceText.innerHTML = `<p>${instruction || guidance.instruction}</p>`;

  const tipsDiv = guidanceText.nextElementSibling;
  if (tipsDiv && tipsDiv.classList.contains('tips')) {
    const tipsList = tipsDiv.querySelector('ul');
    tipsList.innerHTML = guidance.tips.map(tip => `<li>${tip}</li>`).join('');
  }

  // Reset UI
  thumbnailsContainer.innerHTML = '';
  updatePhotoCount();
  continueButton.disabled = true;

  // Show modal
  modal.style.display = 'flex';

  // Request camera access
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Use back camera on mobile
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    });

    video.srcObject = mediaStream;
    video.play();

  } catch (error) {
    console.error('Camera access error:', error);
    handleCameraError(error);
  }
}

// Close camera modal
function close() {
  // Stop camera stream
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }

  // Reset video
  video.srcObject = null;

  // Hide modal
  modal.style.display = 'none';

  // Clear state
  capturedPhotos = [];
  currentRoomType = null;
  currentInstruction = null;
}

// Capture photo from video stream
function capturePhoto() {
  if (!mediaStream) {
    console.error('No camera stream available');
    return;
  }

  // Set canvas size to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw video frame to canvas
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert to blob
  canvas.toBlob((blob) => {
    if (!blob) {
      console.error('Failed to capture photo');
      return;
    }

    // Create photo object
    const photo = {
      id: generatePhotoId(),
      blob: blob,
      dataUrl: canvas.toDataURL('image/jpeg', 0.85),
      timestamp: new Date().toISOString(),
      roomType: currentRoomType
    };

    // Add to captured photos
    capturedPhotos.push(photo);

    // Update UI
    addThumbnail(photo);
    updatePhotoCount();

    // Enable continue button if at least 1 photo
    if (capturedPhotos.length >= 1) {
      continueButton.disabled = false;
    }

    // Auto-advance if max photos reached
    if (capturedPhotos.length >= MAX_PHOTOS) {
      setTimeout(() => {
        handleContinue();
      }, 500);
    }

    // Add capture animation
    captureButton.classList.add('capturing');
    setTimeout(() => {
      captureButton.classList.remove('capturing');
    }, 300);
  }, 'image/jpeg', 0.85);
}

// Add thumbnail to container
function addThumbnail(photo) {
  const thumbnail = document.createElement('div');
  thumbnail.className = 'thumbnail rkt-Card';
  thumbnail.dataset.photoId = photo.id;

  const img = document.createElement('img');
  img.src = photo.dataUrl;
  img.alt = `Photo ${capturedPhotos.length}`;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'thumbnail-delete';
  deleteBtn.innerHTML = '✕';
  deleteBtn.setAttribute('aria-label', 'Delete photo');
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    deletePhoto(photo.id);
  };

  thumbnail.appendChild(img);
  thumbnail.appendChild(deleteBtn);
  thumbnailsContainer.appendChild(thumbnail);

  // Add pop-in animation
  setTimeout(() => {
    thumbnail.classList.add('thumbnail-appear');
  }, 10);
}

// Delete photo
function deletePhoto(photoId) {
  // Remove from array
  capturedPhotos = capturedPhotos.filter(p => p.id !== photoId);

  // Remove thumbnail
  const thumbnail = thumbnailsContainer.querySelector(`[data-photo-id="${photoId}"]`);
  if (thumbnail) {
    thumbnail.classList.add('thumbnail-removing');
    setTimeout(() => {
      thumbnail.remove();
    }, 300);
  }

  // Update UI
  updatePhotoCount();

  // Disable continue if no photos
  if (capturedPhotos.length === 0) {
    continueButton.disabled = true;
  }
}

// Update photo count display
function updatePhotoCount() {
  photoCount.textContent = `${capturedPhotos.length}/${MAX_PHOTOS} Photos`;
}

// Handle continue button
function handleContinue() {
  if (capturedPhotos.length === 0) return;

  // Call callback with captured photos
  if (photosCallback) {
    photosCallback(capturedPhotos, currentRoomType);
  }

  // Close modal
  close();
}

// Handle skip button
function handleSkip() {
  // Call callback with empty array
  if (photosCallback) {
    photosCallback([], currentRoomType);
  }

  // Close modal
  close();
}

// Handle camera errors
function handleCameraError(error) {
  let errorMessage = 'Unable to access camera. ';

  if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
    errorMessage += 'Please allow camera access in your browser settings.';
  } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
    errorMessage += 'No camera device found.';
  } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
    errorMessage += 'Camera is already in use by another application.';
  } else {
    errorMessage += 'Please check your camera settings and try again.';
  }

  // Show error in guidance area
  guidanceText.innerHTML = `<p style="color: var(--error-color);">⚠️ ${errorMessage}</p>`;

  // Disable capture button
  captureButton.disabled = true;
  captureButton.textContent = '○ Camera Unavailable';
}

// Set callback for when photos are captured
function onPhotosCaptured(callback) {
  photosCallback = callback;
}

// Generate unique photo ID
function generatePhotoId() {
  return `photo_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Event listeners
captureButton.addEventListener('click', capturePhoto);
continueButton.addEventListener('click', handleContinue);
skipButton.addEventListener('click', handleSkip);
closeButton.addEventListener('click', close);

// Export camera modal interface
export const CameraModal = {
  open,
  close,
  onPhotosCaptured
};

window.CameraModal = CameraModal;
