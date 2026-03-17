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
   * Save photo to localStorage
   * @param {string} room - Room identifier
   * @param {string} imageData - Base64-encoded image
   * @param {Object} dimensions - LiDAR dimensions {width, height, depth}
   * @returns {Object} Success status
   */
  function savePhoto(room, imageData, dimensions) {
    try {
      const photos = getAllPhotos();

      // Remove existing photo for this room
      const filteredPhotos = photos.filter(p => p.room !== room);

      // Add new photo
      const photo = {
        room: room,
        imageData: imageData,
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
