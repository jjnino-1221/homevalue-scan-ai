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

