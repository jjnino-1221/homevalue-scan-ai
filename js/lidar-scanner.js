/**
 * LiDAR Scanner Module
 * Mock LiDAR scanning with realistic dimension generation
 */

const LidarScanner = (function() {
  // Realistic room dimensions (in feet)
  const ROOM_DIMENSIONS = {
    frontExterior: {
      width: { min: 30, max: 60 },   // House width
      height: { min: 15, max: 25 },  // House height
      depth: { min: 40, max: 80 }    // House depth
    },
    kitchen: {
      width: { min: 10, max: 15 },
      height: { min: 8, max: 10 },
      depth: { min: 12, max: 18 }
    },
    livingRoom: {
      width: { min: 12, max: 20 },
      height: { min: 8, max: 10 },
      depth: { min: 15, max: 25 }
    },
    masterBedroom: {
      width: { min: 12, max: 16 },
      height: { min: 8, max: 10 },
      depth: { min: 14, max: 20 }
    },
    masterBathroom: {
      width: { min: 8, max: 12 },
      height: { min: 8, max: 10 },
      depth: { min: 10, max: 15 }
    }
  };

  /**
   * Generate random dimension within range
   */
  function randomDimension(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Start mock LiDAR scan
   * @param {string} roomId - Room identifier
   * @returns {Promise<Object>} Dimension data {width, height, depth}
   */
  async function scan(roomId) {
    const config = ROOM_DIMENSIONS[roomId];

    if (!config) {
      throw new Error(`Unknown room: ${roomId}`);
    }

    // Show scanning modal
    const modal = document.getElementById('lidar-modal');
    const statusText = document.getElementById('lidar-status');

    modal.style.display = 'flex';
    setTimeout(() => {
      modal.querySelector('.modal-overlay').classList.add('active');
    }, 10);

    // Simulate scanning stages
    await simulateScanning(statusText);

    // Generate realistic dimensions
    const dimensions = {
      width: randomDimension(config.width.min, config.width.max),
      height: randomDimension(config.height.min, config.height.max),
      depth: randomDimension(config.depth.min, config.depth.max)
    };

    // Calculate square footage (width × depth)
    dimensions.squareFootage = dimensions.width * dimensions.depth;

    console.log(`LiDAR scan complete:`, dimensions);

    // Show completion message
    statusText.textContent = `✓ ${dimensions.width}' × ${dimensions.depth}' × ${dimensions.height}' detected`;

    // Wait a moment to show result
    await delay(1000);

    // Hide modal
    closeModal();

    return dimensions;
  }

  /**
   * Simulate scanning stages with progress updates
   */
  async function simulateScanning(statusText) {
    const stages = [
      'Analyzing depth data...',
      'Measuring width...',
      'Measuring height...',
      'Calculating dimensions...'
    ];

    for (const stage of stages) {
      statusText.textContent = stage;
      await delay(800); // 800ms per stage = ~3.2s total
    }
  }

  /**
   * Close scanning modal
   */
  function closeModal() {
    const modal = document.getElementById('lidar-modal');
    const overlay = modal.querySelector('.modal-overlay');

    overlay.classList.remove('active');

    setTimeout(() => {
      modal.style.display = 'none';
    }, 300); // Match CSS transition
  }

  /**
   * Delay helper
   */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API
  return {
    scan
  };
})();
