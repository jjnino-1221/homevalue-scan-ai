/**
 * Review Page
 * Display captured photos with retake functionality
 */

(function() {
  let retakeRoomId = null;

  /**
   * Initialize review page
   */
  function init() {
    console.log('Review page loaded');

    // Load and display photos
    displayPhotos();

    // Set up event handlers
    setupEventHandlers();

    console.log('✓ Review page initialized');
  }

  /**
   * Display all captured photos in grid
   */
  function displayPhotos() {
    const photos = PhotoStorage.getAllPhotos();
    const grid = document.getElementById('photo-grid');
    const submitButton = document.getElementById('submit-button');
    const progressMessage = document.getElementById('progress-message');

    // Clear existing content
    grid.innerHTML = '';

    // Get all room configs
    const rooms = PhotoStorage.getAllRoomConfigs();
    const roomOrder = ['frontExterior', 'kitchen', 'livingRoom', 'masterBedroom', 'masterBathroom'];

    // Create card for each room
    roomOrder.forEach(roomId => {
      const config = rooms[roomId];
      const photo = PhotoStorage.getPhoto(roomId);

      const card = createPhotoCard(roomId, config, photo);
      grid.appendChild(card);
    });

    // Update submit button state
    const status = PhotoStorage.getCompletionStatus();
    if (status.isComplete) {
      submitButton.disabled = false;
      progressMessage.textContent = '✓ All photos captured!';
      progressMessage.style.color = 'var(--success-green)';
    } else {
      submitButton.disabled = true;
      progressMessage.textContent = `${status.completed}/${status.total} photos captured - ${status.total - status.completed} remaining`;
    }
  }

  /**
   * Create photo card element
   */
  function createPhotoCard(roomId, config, photo) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.room = roomId;

    if (photo) {
      // Photo exists - show it
      card.innerHTML = `
        <div class="photo-card-image">
          <img src="${photo.imageData}" alt="${config.name}">
          <div class="photo-card-overlay">
            <button class="retake-button" data-room="${roomId}">
              🔄 Retake
            </button>
          </div>
        </div>
        <div class="photo-card-info">
          <span class="photo-card-icon">${config.icon}</span>
          <h3 class="photo-card-title">${config.name}</h3>
          <p class="photo-card-dimensions">
            ${photo.dimensions.width}' × ${photo.dimensions.depth}' × ${photo.dimensions.height}'
          </p>
        </div>
      `;
    } else {
      // Photo missing - show placeholder
      card.innerHTML = `
        <div class="photo-card-placeholder">
          <span class="placeholder-icon">${config.icon}</span>
          <p class="placeholder-text">Not captured</p>
        </div>
        <div class="photo-card-info">
          <span class="photo-card-icon">${config.icon}</span>
          <h3 class="photo-card-title">${config.name}</h3>
          <p class="photo-card-dimensions">—</p>
        </div>
      `;
    }

    // Add click handler for retake
    if (photo) {
      const retakeBtn = card.querySelector('.retake-button');
      retakeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showRetakeModal(roomId, config.name);
      });
    }

    return card;
  }

  /**
   * Show retake confirmation modal
   */
  function showRetakeModal(roomId, roomName) {
    retakeRoomId = roomId;

    const modal = document.getElementById('retake-modal');
    const roomNameEl = document.getElementById('retake-room-name');

    roomNameEl.textContent = roomName;

    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.querySelector('.modal-overlay').classList.add('active');
    }, 10);
  }

  /**
   * Hide retake modal
   */
  function hideRetakeModal() {
    const modal = document.getElementById('retake-modal');
    const overlay = modal.querySelector('.modal-overlay');

    overlay.classList.remove('active');

    setTimeout(() => {
      modal.style.display = 'none';
      retakeRoomId = null;
    }, 300);
  }

  /**
   * Handle retake confirmation
   */
  function handleRetake() {
    if (!retakeRoomId) return;

    console.log(`Retaking photo for: ${retakeRoomId}`);

    // Delete existing photo
    PhotoStorage.deletePhoto(retakeRoomId);

    // Navigate back to capture page
    // The capture controller will automatically resume at first incomplete room
    navigateTo('capture.html');
  }

  /**
   * Set up event handlers
   */
  function setupEventHandlers() {
    // Retake modal buttons
    document.getElementById('confirm-retake').addEventListener('click', handleRetake);
    document.getElementById('cancel-retake').addEventListener('click', hideRetakeModal);

    // Submit button
    document.getElementById('submit-button').addEventListener('click', handleSubmit);

    // Back to capture link
    const backLink = document.querySelector('.nav-back');
    if (backLink) {
      backLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('capture.html');
      });
    }
  }

  /**
   * Handle submit
   */
  function handleSubmit() {
    const status = PhotoStorage.getCompletionStatus();

    if (!status.isComplete) {
      alert('Please capture all photos before submitting.');
      return;
    }

    // Get all photos
    const photos = PhotoStorage.getAllPhotos();
    const address = loadFromStorage('propertyAddress');

    console.log('Submitting valuation request:', {
      address,
      photoCount: photos.length
    });

    // Navigate to results page
    navigateTo('results.html');
  }

  // Initialize when DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
