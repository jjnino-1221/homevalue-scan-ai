# Phase 3: Camera Capture - Testing Checklist

## Camera Functionality

- [ ] **Camera Permission Request**
  - Test: Open capture.html, verify permission prompt appears
  - Expected: Browser asks for camera permission

- [ ] **Camera Initialization Success**
  - Test: Grant camera permission
  - Expected: Live video feed appears in camera container

- [ ] **Camera Initialization Failure**
  - Test: Deny camera permission
  - Expected: Error message displays with upload fallback button

- [ ] **Rear Camera Selection (Mobile)**
  - Test: Open on mobile device
  - Expected: Rear-facing camera selected by default

- [ ] **Video Feed Display**
  - Test: Check video element shows camera feed
  - Expected: Live video at 16:9 aspect ratio with corner markers

- [ ] **Camera Stop on Navigation**
  - Test: Navigate away from capture page
  - Expected: Camera stream stops, indicator light turns off

## Quality Feedback

- [ ] **TensorFlow.js Model Loading**
  - Test: Check console for model load message
  - Expected: "✓ MobileNet model loaded" in console

- [ ] **Real-time Analysis Active**
  - Test: Observe quality overlay updates
  - Expected: Overlay updates every ~500ms (2fps)

- [ ] **Good Lighting Detection**
  - Test: Point camera at well-lit scene
  - Expected: Green overlay with "✓ Good lighting and focus"

- [ ] **Dark Scene Detection**
  - Test: Point camera at dark area
  - Expected: Orange overlay with "⚠️ Too dark - turn on more lights"

- [ ] **Bright Scene Detection**
  - Test: Point camera at very bright area/sunlight
  - Expected: Orange overlay with "⚠️ Too bright - avoid direct sunlight"

- [ ] **Motion Blur Detection**
  - Test: Move camera quickly
  - Expected: Orange overlay with "⚠️ Hold still - image is blurry"

## Room Navigation

- [ ] **Initial Room Display**
  - Test: Load capture page
  - Expected: Shows "Front Exterior" (1/5)

- [ ] **Progress Indicator Updates**
  - Test: Capture photos and check header
  - Expected: Progress shows "2/5", "3/5", etc.

- [ ] **Room Instructions Update**
  - Test: Move through rooms
  - Expected: Instructions change per room (e.g., "Stand across the street")

- [ ] **Back Button (First Room)**
  - Test: Click back on first room
  - Expected: Returns to instructions.html

- [ ] **Back Button (Other Rooms)**
  - Test: Click back on room 2-5
  - Expected: Goes to previous room

- [ ] **Completion Redirect**
  - Test: Capture 5th photo
  - Expected: Automatically redirects to review.html

## LiDAR Scanner

- [ ] **Scanning Modal Appears**
  - Test: Capture a photo
  - Expected: Modal with "Scanning room dimensions..." appears

- [ ] **Scanning Animation**
  - Test: Watch modal during scan
  - Expected: Blue gradient with moving scan line

- [ ] **Progress Messages**
  - Test: Observe status text
  - Expected: "Analyzing depth data...", "Measuring width...", etc.

- [ ] **Realistic Dimensions**
  - Test: Check generated dimensions
  - Expected: Front Exterior: 30-60' × 40-80' × 15-25'
  - Expected: Kitchen: 10-15' × 12-18' × 8-10'

- [ ] **Completion Message**
  - Test: Wait for scan to finish
  - Expected: "✓ [dimensions] detected" shown before modal closes

## Photo Storage

- [ ] **Photo Capture**
  - Test: Click capture button
  - Expected: Photo saved to localStorage with compression

- [ ] **Image Compression**
  - Test: Check console for compression logs
  - Expected: "Compressed to X.XX MB at quality 0.85"

- [ ] **Progressive Compression**
  - Test: Capture high-resolution photo
  - Expected: Quality reduces: 0.85 → 0.7 → 0.5 if needed

- [ ] **Storage Size Check**
  - Test: Verify total storage after 5 photos
  - Expected: Total < 5MB (target ~1MB per photo)

- [ ] **QuotaExceededError Handling**
  - Test: Fill localStorage manually, then capture
  - Expected: Prompt to delete oldest photo or skip

## Review Page

- [ ] **Photo Grid Display**
  - Test: Navigate to review.html
  - Expected: 5 cards in grid (2 columns on desktop)

- [ ] **Captured Photos Show**
  - Test: Check cards with captured photos
  - Expected: Photo thumbnail, room name, dimensions displayed

- [ ] **Missing Photos Show Placeholder**
  - Test: Skip a photo, check review page
  - Expected: Gray placeholder with "Not captured"

- [ ] **Hover Reveal Retake Button**
  - Test: Hover over photo card
  - Expected: Dark overlay with "🔄 Retake" button appears

- [ ] **Retake Confirmation Modal**
  - Test: Click retake button
  - Expected: Modal asks "Retake this photo? [Room Name]"

- [ ] **Retake Deletes and Navigates**
  - Test: Confirm retake
  - Expected: Photo deleted, redirects to capture.html

## Cross-Device Testing

- [ ] **iPhone Safari**
  - Test full flow on iPhone
  - Expected: Camera, quality feedback, navigation work

- [ ] **Android Chrome**
  - Test full flow on Android
  - Expected: All features functional

- [ ] **Desktop Chrome**
  - Test with webcam
  - Expected: Works with front-facing camera

- [ ] **Tablet (iPad/Android)**
  - Test landscape and portrait
  - Expected: Responsive layout adapts correctly

## Error Scenarios

- [ ] **No Camera Hardware**
  - Test: Device without camera
  - Expected: Error message + file upload fallback

- [ ] **Storage Full**
  - Test: Fill localStorage before capturing
  - Expected: Recovery options presented

- [ ] **Network Offline (TensorFlow.js)**
  - Test: Disconnect network, load page
  - Expected: Quality feedback disabled gracefully

- [ ] **Corrupted Photo Data**
  - Test: Manually corrupt localStorage data
  - Expected: App recovers, shows placeholders

## File Upload Fallback

- [ ] **Upload Button Appears on Error**
  - Test: Deny camera permission
  - Expected: "Upload Photo Instead" button visible

- [ ] **File Input Opens**
  - Test: Click upload button
  - Expected: Native file picker opens

- [ ] **Image File Accepted**
  - Test: Select JPG/PNG file
  - Expected: File processed and saved

- [ ] **LiDAR Scan Runs on Upload**
  - Test: Upload a file
  - Expected: Scanning modal appears, dimensions generated

## Performance Benchmarks

- [ ] **Page Load Time**
  - Test: Measure capture.html load time
  - Target: < 2 seconds on 4G

- [ ] **Video Feed Start Time**
  - Test: Time from permission to video display
  - Target: < 1 second

- [ ] **Quality Analysis Frame Rate**
  - Test: Check analysis interval in console
  - Target: Updates every ~500ms (2fps)

- [ ] **Photo Capture Latency**
  - Test: Time from button click to "Photo saved"
  - Target: < 3 seconds (including LiDAR)

- [ ] **LiDAR Scan Duration**
  - Test: Time from modal open to close
  - Target: ~3-4 seconds

## Browser Compatibility

- [ ] **Chrome 90+**
  - Test: All features in Chrome
  - Expected: Full support

- [ ] **Safari 14+**
  - Test: All features in Safari
  - Expected: Full support

- [ ] **Edge 90+**
  - Test: All features in Edge
  - Expected: Full support

- [ ] **Firefox 88+**
  - Test: MediaDevices API support
  - Expected: Camera works (TensorFlow.js optional)

## End-to-End Flow

- [ ] **Complete Happy Path**
  1. Start from instructions.html
  2. Click "Start Capturing"
  3. Grant camera permission
  4. Capture 5 photos
  5. Review photos
  6. Submit valuation request
  - Expected: All steps complete without errors

- [ ] **Resume Progress**
  1. Capture 3 photos
  2. Close browser
  3. Reopen and navigate to capture.html
  - Expected: Resumes at room 4

- [ ] **Retake Flow**
  1. Complete all 5 photos
  2. Review page
  3. Retake room 3
  4. Recapture room 3
  5. Return to review
  - Expected: Updated photo shown

## Final Verification

- [ ] All HTML files load without errors
- [ ] All JavaScript modules load in correct order
- [ ] No console errors in normal operation
- [ ] CSS styles applied correctly across all pages
- [ ] All user interactions have visual feedback
- [ ] Navigation flows work as expected
- [ ] Data persists across page reloads
- [ ] Submit button only enabled when complete
