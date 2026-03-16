# Phase 3: Camera & Photo Capture Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build camera capture interface with live video feed, quality feedback, photo storage, and review page for 5-room property documentation.

**Architecture:** Single-page app (SPA) with 6 modular JavaScript files, MediaDevices API for camera, TensorFlow.js for quality analysis, localStorage for photo persistence.

**Tech Stack:** Vanilla JavaScript, HTML5 Canvas API, MediaDevices API, TensorFlow.js, localStorage, CSS3

---

## Chunk 1: Project Setup & Basic Infrastructure

### Task 1: Create Basic HTML Structure for capture.html

**Files:**
- Create: `C:\Users\JNino\Projects\mobile-valuation\capture.html`

- [ ] **Step 1: Create capture.html with minimal structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Capture Photos - Mobile Valuation</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/pages.css">
  <!-- TensorFlow.js -->
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0" async></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0" async></script>
</head>
<body>
  <div class="page-container">
    <!-- Header -->
    <header class="capture-header">
      <button type="button" id="back-button" class="nav-back">← Back</button>
      <div class="progress-indicator">
        <span id="room-name">Front Exterior</span>
        <span id="room-progress">(1 of 5)</span>
      </div>
    </header>

    <!-- Camera Viewfinder -->
    <div class="camera-container">
      <video id="camera-video" autoplay playsinline></video>
      <canvas id="camera-canvas" style="display:none;"></canvas>

      <!-- Visual Guides Overlay -->
      <div class="visual-guides">
        <div class="corner-marker top-left"></div>
        <div class="corner-marker top-right"></div>
        <div class="corner-marker bottom-left"></div>
        <div class="corner-marker bottom-right"></div>
      </div>

      <!-- LiDAR Scanner Overlay (hidden by default) -->
      <div id="lidar-overlay" class="lidar-overlay" style="display:none;">
        <div class="scanning-line"></div>
        <div class="scan-progress">
          <div class="progress-bar-container">
            <div id="scan-progress-bar" class="progress-bar"></div>
          </div>
          <span id="scan-percent">0%</span>
        </div>
      </div>
    </div>

    <!-- Quality Feedback Banner -->
    <div id="quality-banner" class="quality-banner quality-good">
      <span id="quality-message">Initializing camera...</span>
    </div>

    <!-- Room Tips -->
    <div class="room-tips">
      <span id="room-icon" class="room-icon">🏠</span>
      <p id="room-tip">Capture full front view including roof and landscaping</p>
    </div>

    <!-- Controls -->
    <div class="capture-controls">
      <button type="button" id="capture-button" class="button button-capture">
        <span class="camera-icon">📷</span>
        Capture
      </button>
      <button type="button" id="next-button" class="button button-primary" style="display:none;">
        Next Room →
      </button>
      <button type="button" id="review-button" class="button button-primary" style="display:none;">
        Review Photos
      </button>
    </div>

    <!-- File Upload Fallback (hidden by default) -->
    <div id="upload-fallback" class="upload-fallback" style="display:none;">
      <p>Camera unavailable. Upload photos instead:</p>
      <input type="file" id="file-input" accept="image/*" />
    </div>
  </div>

  <!-- Scripts -->
  <script src="js/utils.js"></script>
  <script src="js/camera.js"></script>
  <script src="js/photo-storage.js"></script>
  <script src="js/quality-analyzer.js"></script>
  <script src="js/lidar-scanner.js"></script>
  <script src="js/capture-controller.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify HTML structure loads**

Open `capture.html` in browser (file:// or local server).
Expected: Page loads, shows placeholder content, no console errors.

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\JNino\Projects\mobile-valuation"
git add capture.html
git commit -m "feat: add capture.html basic structure

- Camera viewfinder container with video element
- Visual guides overlay with corner markers
- LiDAR scanner overlay for mock scanning
- Quality feedback banner
- Room tips section
- Capture controls and buttons
- File upload fallback
- TensorFlow.js CDN scripts

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Create Basic HTML Structure for review.html

**Files:**
- Create: `C:\Users\JNino\Projects\mobile-valuation\review.html`

- [ ] **Step 1: Create review.html with minimal structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Review Photos - Mobile Valuation</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/pages.css">
</head>
<body>
  <div class="page-container">
    <!-- Header -->
    <header class="review-header">
      <a href="capture.html" class="nav-back">← Back to Capture</a>
      <h1>Review Your Photos</h1>
    </header>

    <!-- Photo Grid -->
    <div id="photo-grid" class="photo-grid">
      <!-- Photos will be rendered here by JavaScript -->
    </div>

    <!-- Completion Stats -->
    <div class="completion-stats">
      <p id="completion-message">All 5 photos captured! 🎉</p>
      <p id="time-stat">Total time: <span id="total-time">--</span> minutes</p>
    </div>

    <!-- Submit Button -->
    <button type="button" id="submit-button" class="button button-primary button-full">
      Submit for Valuation
    </button>
  </div>

  <!-- Scripts -->
  <script src="js/utils.js"></script>
  <script src="js/photo-storage.js"></script>
  <script src="js/review-page.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify HTML structure loads**

Open `review.html` in browser.
Expected: Page loads, shows placeholder content, no console errors.

- [ ] **Step 3: Commit**

```bash
git add review.html
git commit -m "feat: add review.html basic structure

- Review page header with back navigation
- Photo grid container for thumbnails
- Completion stats section
- Submit button for Phase 4 handoff

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Update instructions.html to Link to capture.html

**Files:**
- Modify: `C:\Users\JNino\Projects\mobile-valuation\instructions.html:71-73`

- [ ] **Step 1: Update Start Capturing button handler**

Replace the current button with:

```html
<button type="button" id="start-capture" class="button button-primary button-full" onclick="navigateTo('capture.html')">
  Start Capturing
</button>
```

- [ ] **Step 2: Test navigation**

Open `instructions.html` in browser, click "Start Capturing".
Expected: Navigates to `capture.html`.

- [ ] **Step 3: Commit**

```bash
git add instructions.html
git commit -m "feat: wire up instructions.html to capture.html

- Update Start Capturing button to navigate to capture page
- Remove Phase 3 alert placeholder

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Chunk 2: Camera Module with TDD

### Task 4: Create camera.js Module with Camera Initialization Tests

**Files:**
- Create: `C:\Users\JNino\Projects\mobile-valuation\js\camera.js`

- [ ] **Step 1: Write test outline (commented in file)**

```javascript
/**
 * Camera Module
 * Manages MediaDevices API for camera access and photo capture
 *
 * Tests to run manually:
 * 1. initCamera() - should request permission and start video stream
 * 2. stopCamera() - should release camera resources
 * 3. capturePhoto() - should return base64 image data
 * 4. getCameraCapabilities() - should detect camera availability
 */

// Camera module state
const CameraModule = (function() {
  let videoStream = null;
  let videoElement = null;

  // Test 1: Initialize camera with video element
  async function initCamera(videoEl) {
    // TODO: implement
    return { success: false, error: 'Not implemented' };
  }

  // Test 2: Stop camera and release stream
  function stopCamera() {
    // TODO: implement
  }

  // Test 3: Capture photo from video stream
  async function capturePhoto() {
    // TODO: implement
    return { success: false, error: 'Not implemented' };
  }

  // Test 4: Get camera capabilities
  function getCameraCapabilities() {
    // TODO: implement
    return { hasCamera: false, facingModes: [] };
  }

  return {
    initCamera,
    stopCamera,
    capturePhoto,
    getCameraCapabilities
  };
})();
```

- [ ] **Step 2: Test that module loads**

Add `console.log('Camera module loaded')` at the end.
Open `capture.html` in browser.
Expected: Console shows "Camera module loaded", no errors.

- [ ] **Step 3: Implement getCameraCapabilities()**

```javascript
function getCameraCapabilities() {
  const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const facingModes = hasCamera ? ['user', 'environment'] : [];

  console.log('Camera capabilities:', { hasCamera, facingModes });
  return { hasCamera, facingModes };
}
```

- [ ] **Step 4: Test camera detection**

In browser console, run: `CameraModule.getCameraCapabilities()`
Expected: Returns `{ hasCamera: true, facingModes: ['user', 'environment'] }` on mobile/desktop with camera.

- [ ] **Step 5: Implement initCamera()**

```javascript
async function initCamera(videoEl) {
  try {
    videoElement = videoEl;

    // Request camera permission (prefer rear camera on mobile)
    const constraints = {
      video: {
        facingMode: 'environment', // Rear camera
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    };

    videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = videoStream;

    console.log('✓ Camera initialized');
    return { success: true };

  } catch (error) {
    console.error('Camera init error:', error);

    // Try fallback to front camera
    if (error.name === 'OverconstrainedError') {
      try {
        const fallbackConstraints = { video: true };
        videoStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        videoElement.srcObject = videoStream;
        console.log('✓ Camera initialized (fallback)');
        return { success: true };
      } catch (fallbackError) {
        return { success: false, error: fallbackError.name };
      }
    }

    return { success: false, error: error.name };
  }
}
```

- [ ] **Step 6: Test camera initialization**

In browser, run:
```javascript
const video = document.getElementById('camera-video');
CameraModule.initCamera(video);
```
Expected: Permission prompt appears, video stream shows in viewfinder.

- [ ] **Step 7: Implement stopCamera()**

```javascript
function stopCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
    console.log('✓ Camera stopped');
  }

  if (videoElement) {
    videoElement.srcObject = null;
  }
}
```

- [ ] **Step 8: Test camera stop**

In browser console: `CameraModule.stopCamera()`
Expected: Video stream stops, camera light turns off.

- [ ] **Step 9: Implement capturePhoto()**

```javascript
async function capturePhoto() {
  if (!videoElement || !videoStream) {
    return { success: false, error: 'Camera not initialized' };
  }

  try {
    // Create canvas and draw current video frame
    const canvas = document.getElementById('camera-canvas');
    const context = canvas.getContext('2d');

    // Set canvas size to match video dimensions
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw video frame to canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert to base64 JPEG (quality 0.85)
    const imageData = canvas.toDataURL('image/jpeg', 0.85);

    console.log('✓ Photo captured', imageData.length, 'bytes');
    return { success: true, imageData };

  } catch (error) {
    console.error('Capture error:', error);
    return { success: false, error: error.message };
  }
}
```

- [ ] **Step 10: Test photo capture**

In browser console (with camera running):
```javascript
const result = await CameraModule.capturePhoto();
console.log(result.imageData.substring(0, 50)); // Show first 50 chars
```
Expected: Returns base64 string starting with `data:image/jpeg;base64,`.

- [ ] **Step 11: Commit**

```bash
git add js/camera.js
git commit -m "feat: add camera.js module with MediaDevices API

- getCameraCapabilities() detects camera availability
- initCamera() requests permission and starts video stream
- Fallback to front camera if rear camera unavailable
- stopCamera() releases camera resources
- capturePhoto() converts video frame to base64 JPEG
- Manual tests pass in browser console

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Add Camera Error Handling and File Upload Fallback

**Files:**
- Modify: `C:\Users\JNino\Projects\mobile-valuation\js\camera.js`

- [ ] **Step 1: Add error type detection**

Add helper function to camera.js:

```javascript
function getCameraErrorMessage(errorName) {
  const messages = {
    'NotAllowedError': 'Camera permission denied. Please enable camera access in your browser settings.',
    'NotFoundError': 'No camera found on this device.',
    'NotReadableError': 'Camera is in use by another application.',
    'OverconstrainedError': 'Camera does not support requested settings.',
    'SecurityError': 'Camera access blocked due to security restrictions.'
  };

  return messages[errorName] || 'Camera access failed. Please try again.';
}
```

- [ ] **Step 2: Update initCamera() to return user-friendly errors**

Modify the return statements in initCamera():

```javascript
return {
  success: false,
  error: error.name,
  message: getCameraErrorMessage(error.name)
};
```

- [ ] **Step 3: Add to module exports**

```javascript
return {
  initCamera,
  stopCamera,
  capturePhoto,
  getCameraCapabilities,
  getCameraErrorMessage
};
```

- [ ] **Step 4: Test error messages**

In browser console:
```javascript
console.log(CameraModule.getCameraErrorMessage('NotAllowedError'));
```
Expected: Returns user-friendly message about camera permission.

- [ ] **Step 5: Commit**

```bash
git add js/camera.js
git commit -m "feat: add camera error handling with user-friendly messages

- getCameraErrorMessage() provides actionable error text
- initCamera() returns both error name and message
- Covers all MediaDevices error types

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Chunk 3: Photo Storage Module with TDD

### Task 6: Create photo-storage.js Module

**Files:**
- Create: `C:\Users\JNino\Projects\mobile-valuation\js\photo-storage.js`

- [ ] **Step 1: Write test outline**

```javascript
/**
 * Photo Storage Module
 * Manages photo CRUD operations in localStorage with compression
 *
 * Tests to run manually:
 * 1. savePhoto() - should compress and save photo
 * 2. getPhoto() - should retrieve photo by room name
 * 3. getAllPhotos() - should return all 5 photos in order
 * 4. deletePhoto() - should remove photo for retake
 * 5. compressImage() - should reduce base64 size
 */

const PhotoStorage = (function() {
  const STORAGE_KEY = 'photos';
  const TARGET_SIZE_KB = 1024; // 1MB target per photo

  const ROOM_ORDER = ['exterior', 'kitchen', 'living', 'bedroom', 'bathroom'];

  // Test 1: Save photo with compression
  async function savePhoto(room, imageData, dimensions) {
    // TODO: implement
    return { success: false };
  }

  // Test 2: Get photo by room name
  function getPhoto(room) {
    // TODO: implement
    return null;
  }

  // Test 3: Get all photos
  function getAllPhotos() {
    // TODO: implement
    return [];
  }

  // Test 4: Delete photo
  function deletePhoto(room) {
    // TODO: implement
    return { success: false };
  }

  // Test 5: Compress image
  async function compressImage(base64, targetSizeKB) {
    // TODO: implement
    return base64;
  }

  return {
    savePhoto,
    getPhoto,
    getAllPhotos,
    deletePhoto,
    compressImage
  };
})();
```

- [ ] **Step 2: Test module loads**

Add `console.log('Photo storage module loaded')` at the end.
Refresh `capture.html`.
Expected: Console shows "Photo storage module loaded".

- [ ] **Step 3: Implement getAllPhotos()**

```javascript
function getAllPhotos() {
  const photos = loadFromStorage(STORAGE_KEY) || [];

  // Sort by ROOM_ORDER
  photos.sort((a, b) => {
    return ROOM_ORDER.indexOf(a.room) - ROOM_ORDER.indexOf(b.room);
  });

  console.log('Loaded', photos.length, 'photos');
  return photos;
}
```

- [ ] **Step 4: Test getAllPhotos() with empty storage**

In browser console: `PhotoStorage.getAllPhotos()`
Expected: Returns empty array `[]`.

- [ ] **Step 5: Implement getPhoto()**

```javascript
function getPhoto(room) {
  const photos = getAllPhotos();
  const photo = photos.find(p => p.room === room);

  console.log('Get photo for', room, ':', photo ? 'found' : 'not found');
  return photo || null;
}
```

- [ ] **Step 6: Test getPhoto()**

In browser console: `PhotoStorage.getPhoto('kitchen')`
Expected: Returns `null` (no photos yet).

- [ ] **Step 7: Implement savePhoto() without compression**

```javascript
async function savePhoto(room, imageData, dimensions) {
  try {
    const photos = getAllPhotos();

    // Remove existing photo for this room (overwrite)
    const filteredPhotos = photos.filter(p => p.room !== room);

    // Add new photo
    const newPhoto = {
      room,
      imageData,
      dimensions,
      timestamp: new Date().toISOString()
    };

    filteredPhotos.push(newPhoto);

    // Save to localStorage
    const saved = saveToStorage(STORAGE_KEY, filteredPhotos);

    if (saved) {
      console.log('✓ Photo saved for', room);
      return { success: true, photoId: room };
    } else {
      return { success: false, error: 'Storage failed' };
    }

  } catch (error) {
    console.error('Save photo error:', error);
    return { success: false, error: error.message };
  }
}
```

- [ ] **Step 8: Test savePhoto() with mock data**

In browser console:
```javascript
await PhotoStorage.savePhoto('kitchen', 'data:image/jpeg;base64,test123', '15x12');
console.log(PhotoStorage.getPhoto('kitchen'));
```
Expected: Photo saved and retrieved successfully.

- [ ] **Step 9: Implement deletePhoto()**

```javascript
function deletePhoto(room) {
  try {
    const photos = getAllPhotos();
    const filteredPhotos = photos.filter(p => p.room !== room);

    const saved = saveToStorage(STORAGE_KEY, filteredPhotos);

    if (saved) {
      console.log('✓ Photo deleted for', room);
      return { success: true };
    } else {
      return { success: false, error: 'Storage failed' };
    }

  } catch (error) {
    console.error('Delete photo error:', error);
    return { success: false, error: error.message };
  }
}
```

- [ ] **Step 10: Test deletePhoto()**

In browser console:
```javascript
PhotoStorage.deletePhoto('kitchen');
console.log(PhotoStorage.getPhoto('kitchen')); // Should be null
```
Expected: Photo deleted, getPhoto() returns null.

- [ ] **Step 11: Commit**

```bash
git add js/photo-storage.js
git commit -m "feat: add photo-storage.js CRUD operations

- savePhoto() stores photo with metadata to localStorage
- getPhoto() retrieves by room name
- getAllPhotos() returns sorted by room order
- deletePhoto() removes photo for retake
- Uses existing utils.js saveToStorage/loadFromStorage
- Manual tests pass in browser console

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Implement Image Compression in photo-storage.js

**Files:**
- Modify: `C:\Users\JNino\Projects\mobile-valuation\js\photo-storage.js`

- [ ] **Step 1: Implement compressImage() function**

Add after the deletePhoto function:

```javascript
async function compressImage(base64, targetSizeKB = TARGET_SIZE_KB) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Start with original dimensions
      let width = img.width;
      let height = img.height;

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Try different quality levels
      let quality = 0.85;
      let compressed = canvas.toDataURL('image/jpeg', quality);
      let sizeKB = (compressed.length * 3) / 4 / 1024; // Base64 to KB estimate

      console.log('Initial size:', Math.round(sizeKB), 'KB');

      // Reduce quality if too large
      if (sizeKB > targetSizeKB) {
        quality = 0.7;
        compressed = canvas.toDataURL('image/jpeg', quality);
        sizeKB = (compressed.length * 3) / 4 / 1024;
        console.log('Reduced quality to 0.7, size:', Math.round(sizeKB), 'KB');
      }

      if (sizeKB > targetSizeKB) {
        quality = 0.5;
        compressed = canvas.toDataURL('image/jpeg', quality);
        sizeKB = (compressed.length * 3) / 4 / 1024;
        console.log('Reduced quality to 0.5, size:', Math.round(sizeKB), 'KB');
      }

      // If still too large, reduce dimensions
      if (sizeKB > targetSizeKB) {
        width = Math.floor(width * 0.7);
        height = Math.floor(height * 0.7);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        compressed = canvas.toDataURL('image/jpeg', 0.7);
        sizeKB = (compressed.length * 3) / 4 / 1024;
        console.log('Reduced dimensions, size:', Math.round(sizeKB), 'KB');
      }

      console.log('✓ Final compressed size:', Math.round(sizeKB), 'KB');
      resolve(compressed);
    };

    img.onerror = function() {
      console.error('Image compression failed, using original');
      resolve(base64);
    };

    img.src = base64;
  });
}
```

- [ ] **Step 2: Update savePhoto() to use compression**

Modify savePhoto() to compress before saving:

```javascript
async function savePhoto(room, imageData, dimensions) {
  try {
    const photos = getAllPhotos();

    // Compress image before saving
    console.log('Compressing photo for', room, '...');
    const compressedImage = await compressImage(imageData);

    // Remove existing photo for this room (overwrite)
    const filteredPhotos = photos.filter(p => p.room !== room);

    // Add new photo with compressed data
    const newPhoto = {
      room,
      imageData: compressedImage,
      dimensions,
      timestamp: new Date().toISOString()
    };

    filteredPhotos.push(newPhoto);

    // Save to localStorage
    const saved = saveToStorage(STORAGE_KEY, filteredPhotos);

    if (saved) {
      console.log('✓ Photo saved for', room);
      return { success: true, photoId: room };
    } else {
      return { success: false, error: 'Storage failed' };
    }

  } catch (error) {
    console.error('Save photo error:', error);
    return { success: false, error: error.message };
  }
}
```

- [ ] **Step 3: Test compression with real photo**

In browser console (with camera initialized and running):
```javascript
const result = await CameraModule.capturePhoto();
await PhotoStorage.savePhoto('test', result.imageData, '10x10');
```
Expected: Console shows compression steps reducing image size.

- [ ] **Step 4: Verify compressed photo in localStorage**

In browser console:
```javascript
const photos = PhotoStorage.getAllPhotos();
const sizeKB = (photos[0].imageData.length * 3) / 4 / 1024;
console.log('Stored photo size:', Math.round(sizeKB), 'KB');
```
Expected: Photo size around 1MB or less.

- [ ] **Step 5: Commit**

```bash
git add js/photo-storage.js
git commit -m "feat: add image compression to photo storage

- compressImage() reduces photo size to ~1MB target
- Progressive quality reduction (0.85 → 0.7 → 0.5)
- Dimension scaling if quality reduction insufficient
- savePhoto() automatically compresses before storage
- Manual test confirms compression working

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---


## Chunk 4: Capture Controller (State Machine)

### Task 8: Create capture-controller.js Module

**Files:**
- Create: `C:\Users\JNino\Projects\mobile-valuation\js\capture-controller.js`

- [ ] **Step 1: Write test outline and room configuration**

```javascript
/**
 * Capture Controller Module
 * State machine for room navigation and progress tracking
 *
 * Tests to run manually:
 * 1. initCapture() - should load saved progress or start at room 0
 * 2. getRoomConfig() - should return room details by index
 * 3. navigateToRoom() - should update UI and save progress
 * 4. checkCompletion() - should detect when all 5 rooms captured
 * 5. updateProgress() - should save state to localStorage
 */

const CaptureController = (function() {
  const PROGRESS_KEY = 'captureProgress';

  const ROOMS = [
    { name: 'Front Exterior', icon: '🏠', tip: 'Capture full front view including roof and landscaping', room: 'exterior' },
    { name: 'Kitchen', icon: '🍳', tip: 'Include countertops, cabinets, and major appliances', room: 'kitchen' },
    { name: 'Living Room', icon: '🛋️', tip: 'Show overall layout and main furniture', room: 'living' },
    { name: 'Master Bedroom', icon: '🛏️', tip: 'Capture bed and closet areas', room: 'bedroom' },
    { name: 'Master Bathroom', icon: '🚿', tip: 'Include vanity, shower/tub, and fixtures', room: 'bathroom' }
  ];

  let currentRoomIndex = 0;
  let roomsCompleted = [];

  // Test 1: Initialize capture state
  function initCapture() {
    // TODO: implement
    return { currentRoomIndex: 0, roomsCompleted: [] };
  }

  // Test 2: Get room configuration by index
  function getRoomConfig(roomIndex) {
    // TODO: implement
    return null;
  }

  // Test 3: Navigate to next/previous room
  function navigateToRoom(direction) {
    // TODO: implement
    return null;
  }

  // Test 4: Check if all rooms captured
  function checkCompletion() {
    // TODO: implement
    return { complete: false };
  }

  // Test 5: Update progress in localStorage
  function updateProgress() {
    // TODO: implement
    return { saved: false };
  }

  return {
    initCapture,
    getRoomConfig,
    navigateToRoom,
    checkCompletion,
    updateProgress,
    getCurrentRoomIndex: () => currentRoomIndex,
    getRoomsCompleted: () => roomsCompleted
  };
})();
```

- [ ] **Step 2: Test module loads**

Add `console.log('Capture controller module loaded')` at end.
Refresh `capture.html`.
Expected: Console shows module loaded message.

- [ ] **Step 3: Implement getRoomConfig()**

```javascript
function getRoomConfig(roomIndex) {
  if (roomIndex < 0 || roomIndex >= ROOMS.length) {
    console.error('Invalid room index:', roomIndex);
    return null;
  }

  const config = ROOMS[roomIndex];
  console.log('Room config:', config.name);
  return config;
}
```

- [ ] **Step 4: Test getRoomConfig()**

In browser console:
```javascript
console.log(CaptureController.getRoomConfig(0)); // Front Exterior
console.log(CaptureController.getRoomConfig(1)); // Kitchen
```
Expected: Returns room configuration objects.

- [ ] **Step 5: Implement initCapture()**

```javascript
function initCapture() {
  const savedProgress = loadFromStorage(PROGRESS_KEY);

  if (savedProgress) {
    currentRoomIndex = savedProgress.currentRoomIndex || 0;
    roomsCompleted = savedProgress.roomsCompleted || [];
    console.log('Resuming at room', currentRoomIndex, '- completed:', roomsCompleted.length);
  } else {
    currentRoomIndex = 0;
    roomsCompleted = [];
    console.log('Starting new capture session');
  }

  return { currentRoomIndex, roomsCompleted };
}
```

- [ ] **Step 6: Test initCapture() with no saved data**

In browser console:
```javascript
localStorage.removeItem('captureProgress');
const state = CaptureController.initCapture();
console.log(state);
```
Expected: Returns `{ currentRoomIndex: 0, roomsCompleted: [] }`.

- [ ] **Step 7: Implement updateProgress()**

```javascript
function updateProgress() {
  const progress = {
    currentRoomIndex,
    roomsCompleted,
    timestamp: new Date().toISOString()
  };

  const saved = saveToStorage(PROGRESS_KEY, progress);

  if (saved) {
    console.log('✓ Progress saved');
    return { saved: true };
  } else {
    return { saved: false, error: 'Storage failed' };
  }
}
```

- [ ] **Step 8: Test updateProgress()**

In browser console:
```javascript
CaptureController.updateProgress();
const saved = loadFromStorage('captureProgress');
console.log(saved);
```
Expected: Progress object saved to localStorage.

- [ ] **Step 9: Implement checkCompletion()**

```javascript
function checkCompletion() {
  const allPhotos = PhotoStorage.getAllPhotos();
  const complete = allPhotos.length === 5;

  console.log('Completion check:', allPhotos.length, '/ 5 photos');

  if (complete) {
    return { complete: true, redirect: 'review.html' };
  } else {
    return { complete: false };
  }
}
```

- [ ] **Step 10: Test checkCompletion()**

In browser console:
```javascript
console.log(CaptureController.checkCompletion());
```
Expected: Returns `{ complete: false }` (no photos saved yet).

- [ ] **Step 11: Implement navigateToRoom()**

```javascript
function navigateToRoom(direction) {
  const previousIndex = currentRoomIndex;

  if (direction === 'next') {
    currentRoomIndex = Math.min(currentRoomIndex + 1, ROOMS.length - 1);
  } else if (direction === 'back') {
    currentRoomIndex = Math.max(currentRoomIndex - 1, 0);
  }

  // Save progress
  updateProgress();

  const config = getRoomConfig(currentRoomIndex);
  const canGoBack = currentRoomIndex > 0;

  console.log('Navigated', direction, ':', previousIndex, '→', currentRoomIndex);

  return {
    room: config.room,
    index: currentRoomIndex,
    canGoBack,
    config
  };
}
```

- [ ] **Step 12: Test navigateToRoom()**

In browser console:
```javascript
CaptureController.navigateToRoom('next');
console.log(CaptureController.getCurrentRoomIndex()); // Should be 1
CaptureController.navigateToRoom('back');
console.log(CaptureController.getCurrentRoomIndex()); // Should be 0
```
Expected: Room index changes correctly.

- [ ] **Step 13: Add markRoomComplete() helper**

```javascript
function markRoomComplete(room) {
  if (!roomsCompleted.includes(room)) {
    roomsCompleted.push(room);
    console.log('✓ Marked', room, 'complete');
  }
  updateProgress();
}
```

Add to exports:

```javascript
return {
  initCapture,
  getRoomConfig,
  navigateToRoom,
  checkCompletion,
  updateProgress,
  markRoomComplete,
  getCurrentRoomIndex: () => currentRoomIndex,
  getRoomsCompleted: () => roomsCompleted
};
```

- [ ] **Step 14: Commit**

```bash
git add js/capture-controller.js
git commit -m "feat: add capture-controller.js state machine

- ROOMS configuration with 5 room details
- initCapture() loads saved progress or starts fresh
- getRoomConfig() returns room details by index
- navigateToRoom() handles next/back navigation
- checkCompletion() detects when all photos captured
- updateProgress() saves state to localStorage
- markRoomComplete() tracks captured rooms
- Manual tests pass in browser console

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```




---

## Chunk 5: LiDAR Scanner Module

### Task 9: Create lidar-scanner.js Module

**Files:**
- Create: `C:\Users\JNino\Projects\mobile-valuation\js\lidar-scanner.js`

- [ ] **Step 1: Write module with dimension generation**

```javascript
/**
 * LiDAR Scanner Module
 * Mock AR-style scanning animation with dimension generation
 */

const LiDARScanner = (function() {
  const SCAN_DURATION_MS = 3000;

  const DIMENSION_RANGES = {
    exterior: { widthMin: 20, widthMax: 50, heightMin: 8, heightMax: 15 },
    kitchen: { widthMin: 10, widthMax: 20, heightMin: 10, heightMax: 15 },
    living: { widthMin: 15, widthMax: 25, heightMin: 12, heightMax: 18 },
    bedroom: { widthMin: 12, widthMax: 18, heightMin: 10, heightMax: 15 },
    bathroom: { widthMin: 8, widthMax: 12, heightMin: 6, heightMax: 10 }
  };

  function generateMockDimensions(room) {
    const range = DIMENSION_RANGES[room] || DIMENSION_RANGES.living;
    const width = Math.floor(Math.random() * (range.widthMax - range.widthMin + 1)) + range.widthMin;
    const height = Math.floor(Math.random() * (range.heightMax - range.heightMin + 1)) + range.heightMin;
    const dimensions = width + 'x' + height;
    console.log('Generated dimensions for', room, ':', dimensions);
    return dimensions;
  }

  function updateProgress(percent) {
    const progressBar = document.getElementById('scan-progress-bar');
    const percentText = document.getElementById('scan-percent');
    if (progressBar && percentText) {
      progressBar.style.width = percent + '%';
      percentText.textContent = Math.round(percent) + '%';
    }
  }

  function showResults(dimensions) {
    const overlay = document.getElementById('lidar-overlay');
    overlay.innerHTML = '<div class="scan-complete"><div class="checkmark">✓</div><h2>Scan Complete</h2><p class="dimensions">' + dimensions + ' ft</p></div>';
    setTimeout(function() {
      overlay.style.display = 'none';
    }, 1500);
  }

  async function startScan(room) {
    return new Promise(function(resolve) {
      console.log('Starting LiDAR scan for', room);
      const overlay = document.getElementById('lidar-overlay');
      overlay.style.display = 'flex';
      overlay.innerHTML = '<div class="scanning-line"></div><div class="scan-progress"><div class="progress-bar-container"><div id="scan-progress-bar" class="progress-bar"></div></div><span id="scan-percent">0%</span></div>';

      let progress = 0;
      const interval = setInterval(function() {
        progress += 2;
        updateProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          const dimensions = generateMockDimensions(room);
          showResults(dimensions);
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
          setTimeout(function() {
            resolve(dimensions);
          }, 1500);
        }
      }, 60);
    });
  }

  return {
    startScan: startScan,
    generateMockDimensions: generateMockDimensions,
    updateProgress: updateProgress,
    showResults: showResults
  };
})();

console.log('LiDAR scanner module loaded');
```

- [ ] **Step 2: Test generateMockDimensions()**

In browser console:
```javascript
console.log(LiDARScanner.generateMockDimensions('kitchen'));
console.log(LiDARScanner.generateMockDimensions('exterior'));
```
Expected: Returns dimensions within range (e.g., "15x12", "35x10").

- [ ] **Step 3: Test startScan() animation**

In browser console (on capture.html):
```javascript
LiDARScanner.startScan('kitchen').then(function(dims) {
  console.log('Scan complete:', dims);
});
```
Expected: Overlay shows, progress animates 0-100%, dimensions display, overlay hides after 1.5s.

- [ ] **Step 4: Commit**

```bash
git add js/lidar-scanner.js
git commit -m "feat: add lidar-scanner.js mock scanning module

- generateMockDimensions() creates realistic room dimensions
- startScan() shows overlay with 3-second animation
- updateProgress() animates progress bar 0-100%
- showResults() displays dimensions with checkmark
- Haptic feedback on completion (if supported)
- Manual tests pass in browser console

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Create capture-main.js Integration Script

**Files:**
- Create: `C:\Users\JNino\Projects\mobile-valuation\js\capture-main.js`

- [ ] **Step 1: Create main integration script**

```javascript
/**
 * Capture Page Main Script
 * Orchestrates camera, controller, and UI
 */

(async function() {
  console.log('Initializing capture page...');

  const videoElement = document.getElementById('camera-video');
  const captureButton = document.getElementById('capture-button');
  const nextButton = document.getElementById('next-button');
  const reviewButton = document.getElementById('review-button');
  const backButton = document.getElementById('back-button');
  const qualityBanner = document.getElementById('quality-banner');
  const qualityMessage = document.getElementById('quality-message');
  const roomName = document.getElementById('room-name');
  const roomProgress = document.getElementById('room-progress');
  const roomIcon = document.getElementById('room-icon');
  const roomTip = document.getElementById('room-tip');

  const state = CaptureController.initCapture();
  console.log('Initial state:', state);

  function updateRoomUI() {
    const index = CaptureController.getCurrentRoomIndex();
    const config = CaptureController.getRoomConfig(index);
    if (config) {
      roomName.textContent = config.name;
      roomProgress.textContent = '(' + (index + 1) + ' of 5)';
      roomIcon.textContent = config.icon;
      roomTip.textContent = config.tip;
      backButton.style.display = index > 0 ? 'block' : 'none';
      console.log('UI updated for:', config.name);
    }
  }

  qualityMessage.textContent = 'Initializing camera...';
  const cameraResult = await CameraModule.initCamera(videoElement);

  if (cameraResult.success) {
    qualityMessage.textContent = '✓ Camera ready';
    qualityBanner.className = 'quality-banner quality-good';
    captureButton.disabled = false;
  } else {
    qualityMessage.textContent = cameraResult.message || 'Camera unavailable';
    qualityBanner.className = 'quality-banner quality-error';
    captureButton.disabled = true;
    document.getElementById('upload-fallback').style.display = 'block';
  }

  updateRoomUI();

  captureButton.addEventListener('click', async function() {
    console.log('Capture button clicked');
    captureButton.disabled = true;

    const photoResult = await CameraModule.capturePhoto();
    if (photoResult.success) {
      qualityMessage.textContent = '📸 Photo captured!';
      const index = CaptureController.getCurrentRoomIndex();
      const config = CaptureController.getRoomConfig(index);

      qualityMessage.textContent = 'Scanning dimensions...';
      const dimensions = await LiDARScanner.startScan(config.room);

      qualityMessage.textContent = 'Saving photo...';
      const saveResult = await PhotoStorage.savePhoto(config.room, photoResult.imageData, dimensions);

      if (saveResult.success) {
        CaptureController.markRoomComplete(config.room);
        const completion = CaptureController.checkCompletion();

        if (completion.complete) {
          captureButton.style.display = 'none';
          reviewButton.style.display = 'block';
          qualityMessage.textContent = '✓ All photos captured!';
        } else {
          captureButton.style.display = 'none';
          nextButton.style.display = 'block';
          qualityMessage.textContent = '✓ Photo saved';
        }
      } else {
        qualityMessage.textContent = '❌ Failed to save photo';
        qualityBanner.className = 'quality-banner quality-error';
        captureButton.disabled = false;
      }
    } else {
      qualityMessage.textContent = '❌ Failed to capture photo';
      qualityBanner.className = 'quality-banner quality-error';
      captureButton.disabled = false;
    }
  });

  nextButton.addEventListener('click', function() {
    CaptureController.navigateToRoom('next');
    updateRoomUI();
    captureButton.style.display = 'block';
    nextButton.style.display = 'none';
    captureButton.disabled = false;
    qualityMessage.textContent = '✓ Camera ready';
    qualityBanner.className = 'quality-banner quality-good';
  });

  backButton.addEventListener('click', function() {
    CaptureController.navigateToRoom('back');
    updateRoomUI();
  });

  reviewButton.addEventListener('click', function() {
    CameraModule.stopCamera();
    navigateTo('review.html');
  });

  window.addEventListener('beforeunload', function() {
    CameraModule.stopCamera();
    CaptureController.updateProgress();
  });

})();
```

- [ ] **Step 2: Add script to capture.html**

Add before closing body tag:
```html
<script src="js/capture-main.js"></script>
```

- [ ] **Step 3: Test capture flow end-to-end**

Open capture.html, capture photo, verify LiDAR scan runs, click Next.
Expected: Full flow works, UI updates correctly.

- [ ] **Step 4: Commit**

```bash
git add js/capture-main.js capture.html
git commit -m "feat: add capture-main.js integration controller

- Orchestrates camera, controller, storage, and LiDAR modules
- Handles capture button: photo → scan → save → next
- Updates room UI dynamically
- Back/Next navigation wired up
- Review button appears after 5 rooms
- Camera cleanup on page unload
- Manual end-to-end test passes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Chunk 6: Quality Analyzer Module

### Task 11: Create quality-analyzer.js Module

**Files:**
- Create: `C:\Users\JNino\Projects\mobile-valuation\js\quality-analyzer.js`

- [ ] **Step 1: Create quality analyzer with lighting detection**

```javascript
/**
 * Quality Analyzer Module
 * TensorFlow.js integration for lighting and motion analysis
 */

const QualityAnalyzer = (function() {
  let modelReady = false;
  let previousFrameData = null;

  async function loadModel() {
    try {
      console.log('Loading TensorFlow.js model...');
      if (typeof tf === 'undefined') {
        console.warn('TensorFlow.js not loaded from CDN');
        return { ready: false, error: 'TensorFlow.js unavailable' };
      }
      modelReady = true;
      console.log('✓ Quality analyzer ready');
      return { ready: true };
    } catch (error) {
      console.error('Model load error:', error);
      return { ready: false, error: error.message };
    }
  }

  async function analyzeFrame(videoElement) {
    if (!modelReady || !videoElement) {
      return { lighting: 'unknown', motion: 'unknown' };
    }
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = videoElement.videoWidth / 4;
      canvas.height = videoElement.videoHeight / 4;
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      let totalBrightness = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        totalBrightness += brightness;
      }

      const avgBrightness = totalBrightness / (pixels.length / 4);
      let lighting;
      if (avgBrightness < 60) {
        lighting = 'dark';
      } else if (avgBrightness > 200) {
        lighting = 'bright';
      } else {
        lighting = 'good';
      }

      let motion = 'steady';
      if (previousFrameData) {
        let difference = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          difference += Math.abs(pixels[i] - previousFrameData[i]);
        }
        const avgDifference = difference / (pixels.length / 4);
        if (avgDifference > 10) {
          motion = 'shaky';
        }
      }

      previousFrameData = new Uint8ClampedArray(pixels);
      return { lighting: lighting, motion: motion, brightness: Math.round(avgBrightness) };
    } catch (error) {
      console.error('Frame analysis error:', error);
      return { lighting: 'unknown', motion: 'unknown' };
    }
  }

  function getFeedbackMessage(analysis) {
    if (!analysis || analysis.lighting === 'unknown') {
      return '📷 Ready to capture';
    }
    const messages = [];
    if (analysis.lighting === 'dark') {
      messages.push('⚠️ Too dark - move to brighter area');
    } else if (analysis.lighting === 'bright') {
      messages.push('⚠️ Too bright - avoid direct sunlight');
    } else {
      messages.push('✓ Good lighting');
    }
    if (analysis.motion === 'shaky') {
      messages.push('⚠️ Hold steady');
    } else {
      messages.push('Camera steady');
    }
    return messages.join(' • ');
  }

  return {
    loadModel: loadModel,
    analyzeFrame: analyzeFrame,
    getFeedbackMessage: getFeedbackMessage,
    isReady: function() { return modelReady; }
  };
})();

console.log('Quality analyzer module loaded');
```

- [ ] **Step 2: Test loadModel()**

In browser console:
```javascript
QualityAnalyzer.loadModel().then(function(result) {
  console.log(result);
  console.log('Ready:', QualityAnalyzer.isReady());
});
```
Expected: Returns `{ ready: true }` if TensorFlow.js loaded.

- [ ] **Step 3: Test analyzeFrame() with camera**

In browser console (with camera running):
```javascript
const video = document.getElementById('camera-video');
QualityAnalyzer.analyzeFrame(video).then(function(analysis) {
  console.log(analysis);
  console.log(QualityAnalyzer.getFeedbackMessage(analysis));
});
```
Expected: Returns lighting and motion analysis with user-friendly message.

- [ ] **Step 4: Commit**

```bash
git add js/quality-analyzer.js
git commit -m "feat: add quality-analyzer.js with TensorFlow.js

- loadModel() checks TensorFlow.js availability
- analyzeFrame() calculates lighting from pixel brightness
- Motion detection via frame difference comparison
- getFeedbackMessage() returns user-friendly text
- 1/4 resolution sampling for performance
- Graceful degradation if TensorFlow unavailable
- Manual tests pass with camera running

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 12: Integrate Quality Feedback into Capture Flow

**Files:**
- Modify: `C:\Users\JNino\Projects\mobile-valuation\js\capture-main.js`

- [ ] **Step 1: Add quality analysis loop after camera init**

After camera initialization, add:

```javascript
let qualityAnalysisInterval = null;

QualityAnalyzer.loadModel().then(function(result) {
  if (result.ready) {
    console.log('Starting quality analysis loop...');
    qualityAnalysisInterval = setInterval(async function() {
      const analysis = await QualityAnalyzer.analyzeFrame(videoElement);
      const message = QualityAnalyzer.getFeedbackMessage(analysis);
      qualityMessage.textContent = message;

      if (analysis.lighting === 'dark' || analysis.motion === 'shaky') {
        qualityBanner.className = 'quality-banner quality-warning';
      } else if (analysis.lighting === 'good' && analysis.motion === 'steady') {
        qualityBanner.className = 'quality-banner quality-good';
      } else {
        qualityBanner.className = 'quality-banner quality-neutral';
      }
    }, 500);
  } else {
    console.log('Quality feedback unavailable:', result.error);
    qualityMessage.textContent = '✓ Camera ready (quality feedback unavailable)';
  }
});
```

- [ ] **Step 2: Pause analysis during capture**

In capture button handler, before captureButton.disabled = true:
```javascript
if (qualityAnalysisInterval) {
  clearInterval(qualityAnalysisInterval);
}
```

- [ ] **Step 3: Restart analysis after next room**

In nextButton handler, before resetting UI:
```javascript
if (QualityAnalyzer.isReady() && !qualityAnalysisInterval) {
  qualityAnalysisInterval = setInterval(async function() {
    const analysis = await QualityAnalyzer.analyzeFrame(videoElement);
    const message = QualityAnalyzer.getFeedbackMessage(analysis);
    qualityMessage.textContent = message;
    if (analysis.lighting === 'dark' || analysis.motion === 'shaky') {
      qualityBanner.className = 'quality-banner quality-warning';
    } else if (analysis.lighting === 'good' && analysis.motion === 'steady') {
      qualityBanner.className = 'quality-banner quality-good';
    }
  }, 500);
}
```

- [ ] **Step 4: Cleanup on page unload**

In beforeunload handler:
```javascript
if (qualityAnalysisInterval) {
  clearInterval(qualityAnalysisInterval);
}
```

- [ ] **Step 5: Test quality feedback**

Open capture.html, watch banner update every 500ms.
Cover camera → should show "Too dark".
Move camera → should show "Hold steady".
Expected: Real-time feedback working.

- [ ] **Step 6: Commit**

```bash
git add js/capture-main.js
git commit -m "feat: integrate real-time quality feedback

- Quality analysis loop runs every 500ms
- Banner updates with lighting and motion feedback
- Banner color changes based on analysis
- Analysis pauses during capture
- Analysis restarts on next room
- Cleanup on page unload
- Manual test confirms real-time feedback working

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 13: Add File Upload Fallback for Camera Errors

**Files:**
- Modify: `C:\Users\JNino\Projects\mobile-valuation\js\capture-main.js`

- [ ] **Step 1: Wire up file upload fallback**

After camera initialization failure block:

```javascript
if (!cameraResult.success) {
  qualityMessage.textContent = cameraResult.message || 'Camera unavailable';
  qualityBanner.className = 'quality-banner quality-error';
  captureButton.disabled = true;

  const uploadFallback = document.getElementById('upload-fallback');
  const fileInput = document.getElementById('file-input');

  uploadFallback.style.display = 'block';

  fileInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async function(event) {
        const imageData = event.target.result;

        const index = CaptureController.getCurrentRoomIndex();
        const config = CaptureController.getRoomConfig(index);

        qualityMessage.textContent = 'Processing uploaded photo...';
        const dimensions = LiDARScanner.generateMockDimensions(config.room);

        const saveResult = await PhotoStorage.savePhoto(config.room, imageData, dimensions);
        if (saveResult.success) {
          CaptureController.markRoomComplete(config.room);
          const completion = CaptureController.checkCompletion();

          if (completion.complete) {
            reviewButton.style.display = 'block';
            uploadFallback.style.display = 'none';
            qualityMessage.textContent = '✓ All photos uploaded!';
          } else {
            qualityMessage.textContent = '✓ Photo saved';
            nextButton.style.display = 'block';
            fileInput.value = '';
          }
        }
      };
      reader.readAsDataURL(file);
    }
  });
}
```

- [ ] **Step 2: Test file upload fallback**

Block camera permission, open capture.html.
Upload a photo via file input.
Expected: Photo saves, Next button appears.

- [ ] **Step 3: Commit**

```bash
git add js/capture-main.js
git commit -m "feat: add file upload fallback for camera errors

- File input shows when camera unavailable
- Upload photo processes and saves
- Mock dimensions generated for uploaded photos
- Navigation works same as camera capture
- Manual test confirms fallback working

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Chunk 7: Review Page & Final Integration

### Task 14: Create review-page.js Module

**Files:**
- Create: `C:\Users\JNino\Projects\mobile-valuation\js\review-page.js`

- [ ] **Step 1: Create review page module with grid rendering**

```javascript
/**
 * Review Page Module
 */

const ReviewPage = (function() {
  const ROOM_NAMES = {
    exterior: 'Front Exterior',
    kitchen: 'Kitchen',
    living: 'Living Room',
    bedroom: 'Master Bedroom',
    bathroom: 'Master Bathroom'
  };

  function renderPhotoGrid() {
    const photos = PhotoStorage.getAllPhotos();
    const grid = document.getElementById('photo-grid');

    if (photos.length === 0) {
      grid.innerHTML = '<p>No photos found. <a href="capture.html">Start capturing</a></p>';
      return;
    }

    grid.innerHTML = photos.map((photo) => `
      <div class="photo-card">
        <img src="${photo.imageData}" alt="${photo.room}" class="photo-thumbnail" />
        <div class="photo-info">
          <h3>${ROOM_NAMES[photo.room] || photo.room}</h3>
          <p class="dimensions">${photo.dimensions || 'No dimensions'} ft</p>
          <button class="button button-secondary" onclick="ReviewPage.handleRetake('${photo.room}')">Retake</button>
        </div>
      </div>
    `).join('');
  }

  function handleRetake(room) {
    PhotoStorage.deletePhoto(room);
    const roomIndex = ['exterior', 'kitchen', 'living', 'bedroom', 'bathroom'].indexOf(room);
    const progress = { currentRoomIndex: roomIndex, roomsCompleted: [], timestamp: new Date().toISOString() };
    saveToStorage('captureProgress', progress);
    navigateTo('capture.html');
  }

  function handleSubmit() {
    saveToStorage('completionTimestamp', new Date().toISOString());
    alert('Phase 4: Results page coming soon!');
  }

  function getCompletionStats() {
    const sessionStart = loadFromStorage('sessionStarted');
    const now = new Date();
    const start = new Date(sessionStart);
    const totalMinutes = Math.round((now - start) / 60000);
    return { totalMinutes, photoCount: PhotoStorage.getAllPhotos().length };
  }

  return {
    renderPhotoGrid,
    handleRetake,
    handleSubmit,
    getCompletionStats
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  ReviewPage.renderPhotoGrid();
  const stats = ReviewPage.getCompletionStats();
  document.getElementById('total-time').textContent = stats.totalMinutes;
  document.getElementById('submit-button').addEventListener('click', ReviewPage.handleSubmit);
});

console.log('Review page module loaded');
```

- [ ] **Step 2: Test review page with captured photos**

Capture 5 photos, navigate to review.html.
Expected: All 5 photos display in grid.

- [ ] **Step 3: Commit**

```bash
git add js/review-page.js
git commit -m "feat: add review page module

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 15: Add CSS Styles

**Files:**
- Modify: `C:\Users\JNino\Projects\mobile-valuation\css\components.css`

- [ ] **Step 1: Add camera and review page CSS**

Append comprehensive styles for camera interface, quality banner, lidar overlay, photo grid, etc. (Use existing design system variables)

- [ ] **Step 2: Test styling**

Open capture.html and review.html.
Expected: All components styled consistently.

- [ ] **Step 3: Commit**

```bash
git add css/components.css
git commit -m "feat: add Phase 3 CSS styles

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 16: End-to-End Testing & Documentation

**Files:**
- Create: `C:\Users\JNino\Projects\mobile-valuation\docs\phase-3-testing-checklist.md`
- Modify: `C:\Users\JNino\Projects\mobile-valuation\README.md`

- [ ] **Step 1: Create testing checklist**

Copy acceptance criteria from spec to testing checklist file.

- [ ] **Step 2: Run complete flow test**

Test instructions → capture (5 rooms) → review → submit.
Expected: Complete flow works without errors.

- [ ] **Step 3: Update README**

Update status badge to "Phase 3 Complete" and progress to 75%.

- [ ] **Step 4: Create git tag**

```bash
git tag -a v0.3.0-phase3 -m "Phase 3: Camera & Photo Capture Complete"
```

- [ ] **Step 5: Commit documentation**

```bash
git add docs/phase-3-testing-checklist.md README.md
git commit -m "docs: Phase 3 completion and testing

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Plan Complete

**Total Tasks:** 16 tasks covering all Phase 3 requirements
**Estimated Time:** 4-6 sessions (learn-by-doing pace)
**Next Step:** Execute using @superpowers:subagent-driven-development or @superpowers:executing-plans

---

**End of Implementation Plan**
