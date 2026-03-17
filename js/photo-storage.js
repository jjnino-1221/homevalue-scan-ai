/**
 * Photo Storage Module
 * Manages photo persistence in localStorage with compression
 */

const PhotoStorage = (function() {
  const STORAGE_KEY = 'propertyPhotos';

  // Room definitions
  const ROOMS = {
    frontExterior: {
      id: 'frontExterior',
      name: 'Front Exterior',
      instruction: 'Stand across the street if possible',
      icon: '🏠'
    },
    kitchen: {
      id: 'kitchen',
      name: 'Kitchen',
      instruction: 'Capture countertops and appliances',
      icon: '🍳'
    },
    livingRoom: {
      id: 'livingRoom',
      name: 'Living Room',
      instruction: 'Show the main living space',
      icon: '🛋️'
    },
    masterBedroom: {
      id: 'masterBedroom',
      name: 'Master Bedroom',
      instruction: 'Capture the room from the doorway',
      icon: '🛏️'
    },
    masterBathroom: {
      id: 'masterBathroom',
      name: 'Master Bathroom',
      instruction: 'Show vanity and fixtures',
      icon: '🚿'
    }
  };

  /**
   * Compress image to target size
   * @param {string} imageData - Base64-encoded image
   * @param {number} quality - JPEG quality (0.0 - 1.0)
   * @returns {Promise<string>} Compressed base64 image
   */
  async function compressImage(imageData, quality = 0.85) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Convert to JPEG with specified quality
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.src = imageData;
    });
  }

  /**
   * Progressive compression until under target size
   * @param {string} imageData - Base64-encoded image
   * @param {number} targetMB - Target size in megabytes
   * @returns {Promise<string>} Compressed image data
   */
  async function progressiveCompress(imageData, targetMB = 1.0) {
    let compressed = imageData;
    let currentSize = (compressed.length * 0.75) / (1024 * 1024); // Base64 to MB

    // Try quality reduction first: 0.85 → 0.7 → 0.5
    const qualities = [0.85, 0.7, 0.5];
    for (const quality of qualities) {
      if (currentSize <= targetMB) break;

      compressed = await compressImage(imageData, quality);
      currentSize = (compressed.length * 0.75) / (1024 * 1024);

      console.log(`Compressed to ${currentSize.toFixed(2)}MB at quality ${quality}`);
    }

    // If still too large, scale dimensions down
    if (currentSize > targetMB) {
      compressed = await scaleImage(compressed, 0.8);
      currentSize = (compressed.length * 0.75) / (1024 * 1024);
      console.log(`Scaled down to ${currentSize.toFixed(2)}MB`);
    }

    return compressed;
  }

  /**
   * Scale image dimensions
   * @param {string} imageData - Base64-encoded image
   * @param {number} scale - Scale factor (0.0 - 1.0)
   * @returns {Promise<string>} Scaled image data
   */
  async function scaleImage(imageData, scale) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const scaled = canvas.toDataURL('image/jpeg', 0.85);
        resolve(scaled);
      };
      img.src = imageData;
    });
  }

  /**
   * Save photo to localStorage
   * @param {string} room - Room identifier
   * @param {string} imageData - Base64-encoded image
   * @param {Object} dimensions - LiDAR dimensions {width, height, depth}
   * @param {number} quality - Initial JPEG quality (default 0.85)
   * @returns {Promise<Object>} Success status
   */
  async function savePhoto(room, imageData, dimensions, quality = 0.85) {
    try {
      const photos = getAllPhotos();

      // Compress image before saving
      const compressed = await progressiveCompress(imageData, 1.0);
      const sizeMB = (compressed.length * 0.75) / (1024 * 1024);

      console.log(`Final compressed size: ${sizeMB.toFixed(2)}MB`);

      // Remove existing photo for this room
      const filteredPhotos = photos.filter(p => p.room !== room);

      // Add new photo
      const photo = {
        room: room,
        imageData: compressed,
        dimensions: dimensions,
        timestamp: new Date().toISOString()
      };

      filteredPhotos.push(photo);

      // Save to localStorage
      const jsonValue = JSON.stringify(filteredPhotos);
      localStorage.setItem(STORAGE_KEY, jsonValue);

      console.log(`✓ Photo saved for ${room}`);
      return { success: true, photoId: room };

    } catch (error) {
      console.error('Error saving photo:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all photos from localStorage
   * @returns {Array} Array of photo objects
   */
  function getAllPhotos() {
    try {
      const jsonValue = localStorage.getItem(STORAGE_KEY);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading photos:', error);
      return [];
    }
  }

  /**
   * Get photo for specific room
   * @param {string} room - Room identifier
   * @returns {Object|null} Photo object or null if not found
   */
  function getPhoto(room) {
    const photos = getAllPhotos();
    return photos.find(p => p.room === room) || null;
  }

  /**
   * Delete photo for specific room
   * @param {string} room - Room identifier
   */
  function deletePhoto(room) {
    const photos = getAllPhotos();
    const filteredPhotos = photos.filter(p => p.room !== room);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPhotos));
    console.log(`✓ Photo deleted for ${room}`);
  }

  /**
   * Clear all photos
   */
  function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✓ All photos cleared');
  }

  /**
   * Get completion status
   * @returns {Object} Completion status with count and percentage
   */
  function getCompletionStatus() {
    const photos = getAllPhotos();
    const totalRooms = Object.keys(ROOMS).length;
    const completedRooms = photos.length;

    return {
      completed: completedRooms,
      total: totalRooms,
      percentage: Math.round((completedRooms / totalRooms) * 100),
      isComplete: completedRooms === totalRooms
    };
  }

  /**
   * Get room configuration
   */
  function getRoomConfig(roomId) {
    return ROOMS[roomId] || null;
  }

  /**
   * Get all room configurations
   */
  function getAllRoomConfigs() {
    return ROOMS;
  }

  // Public API
  return {
    savePhoto,
    getAllPhotos,
    getPhoto,
    deletePhoto,
    clearAll,
    getCompletionStatus,
    getRoomConfig,
    getAllRoomConfigs,
    ROOMS
  };
})();
