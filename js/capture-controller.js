/**
 * Capture Controller Module
 * State machine for room navigation and progress tracking
 */

const CaptureController = (function() {
  // Room sequence
  const ROOM_SEQUENCE = [
    'frontExterior',
    'kitchen',
    'livingRoom',
    'masterBedroom',
    'masterBathroom'
  ];

  let currentRoomIndex = 0;
  let currentRoom = null;

  /**
   * Initialize controller
   * Loads saved progress or starts from beginning
   */
  function init() {
    // Check for existing photos to determine progress
    const photos = PhotoStorage.getAllPhotos();
    const photoRooms = photos.map(p => p.room);

    // Find first incomplete room
    currentRoomIndex = ROOM_SEQUENCE.findIndex(room => !photoRooms.includes(room));

    // If all complete, start from beginning
    if (currentRoomIndex === -1) {
      currentRoomIndex = 0;
    }

    currentRoom = ROOM_SEQUENCE[currentRoomIndex];

    console.log(`✓ Starting at room ${currentRoomIndex + 1}: ${currentRoom}`);

    return {
      room: currentRoom,
      index: currentRoomIndex,
      total: ROOM_SEQUENCE.length
    };
  }

  /**
   * Get current room info
   */
  function getCurrentRoom() {
    const config = PhotoStorage.getRoomConfig(currentRoom);
    return {
      id: currentRoom,
      name: config.name,
      instruction: config.instruction,
      icon: config.icon,
      index: currentRoomIndex,
      total: ROOM_SEQUENCE.length
    };
  }

  /**
   * Move to next room
   * @returns {Object|null} Next room info, or null if complete
   */
  function nextRoom() {
    currentRoomIndex++;

    if (currentRoomIndex >= ROOM_SEQUENCE.length) {
      console.log('✓ All rooms complete');
      return null; // All done
    }

    currentRoom = ROOM_SEQUENCE[currentRoomIndex];
    console.log(`Moving to room ${currentRoomIndex + 1}: ${currentRoom}`);

    return getCurrentRoom();
  }

  /**
   * Move to previous room
   * @returns {Object|null} Previous room info, or null if at start
   */
  function previousRoom() {
    if (currentRoomIndex === 0) {
      console.log('Already at first room');
      return null;
    }

    currentRoomIndex--;
    currentRoom = ROOM_SEQUENCE[currentRoomIndex];

    console.log(`Moving back to room ${currentRoomIndex + 1}: ${currentRoom}`);

    return getCurrentRoom();
  }

  /**
   * Jump to specific room
   * @param {string} roomId - Room identifier
   * @returns {Object|null} Room info, or null if invalid
   */
  function goToRoom(roomId) {
    const index = ROOM_SEQUENCE.indexOf(roomId);

    if (index === -1) {
      console.error('Invalid room:', roomId);
      return null;
    }

    currentRoomIndex = index;
    currentRoom = roomId;

    console.log(`Jumped to room ${currentRoomIndex + 1}: ${currentRoom}`);

    return getCurrentRoom();
  }

  /**
   * Check if this is the last room
   */
  function isLastRoom() {
    return currentRoomIndex === ROOM_SEQUENCE.length - 1;
  }

  /**
   * Check if this is the first room
   */
  function isFirstRoom() {
    return currentRoomIndex === 0;
  }

  /**
   * Get overall progress
   */
  function getProgress() {
    const photos = PhotoStorage.getAllPhotos();
    return {
      completed: photos.length,
      total: ROOM_SEQUENCE.length,
      percentage: Math.round((photos.length / ROOM_SEQUENCE.length) * 100),
      currentRoom: currentRoomIndex + 1
    };
  }

  // Public API
  return {
    init,
    getCurrentRoom,
    nextRoom,
    previousRoom,
    goToRoom,
    isLastRoom,
    isFirstRoom,
    getProgress
  };
})();
