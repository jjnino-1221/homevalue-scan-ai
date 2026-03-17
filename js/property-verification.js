/**
 * Property Verification Wizard
 * Multi-screen property details verification
 */

(function() {
  let currentScreen = 1;
  const totalScreens = 4;
  let propertyData = {};

  /**
   * Initialize verification wizard
   */
  function init() {
    console.log('Property verification loaded');

    // Set current step
    saveCurrentStep('verification');

    // Load any saved data
    const saved = loadFromStorage('propertyData');
    if (saved) {
      propertyData = saved;
      populateFields();
    } else {
      // Initialize with mock public records data
      initializeMockData();
    }

    // Setup event handlers
    setupEventHandlers();

    // Show first screen
    showScreen(1);

    console.log('✓ Property verification initialized');
  }

  /**
   * Initialize mock public records data
   */
  function initializeMockData() {
    propertyData = {
      // Screen 1
      propertyType: 'Single Family',
      yearBuilt: '1985',
      squareFootage: '2140',
      lotSize: '0.25',
      // Screen 2
      bedrooms: '3',
      bathrooms: '2.5',
      garage: '2-car',
      basement: 'Finished',
      // Screen 3
      hvacType: 'Central AC',
      hvacAge: '',
      roofType: 'Asphalt Shingles',
      roofAge: '',
      kitchenCondition: '',
      kitchenYear: '',
      bathroomCondition: '',
      bathroomYear: '',
      flooring: '',
      // Screen 4
      changes: [],
      changesDescription: ''
    };
  }

  /**
   * Setup event handlers
   */
  function setupEventHandlers() {
    // Navigation buttons
    document.getElementById('back-button').addEventListener('click', handleBack);
    document.getElementById('prev-button').addEventListener('click', () => navigateScreen(-1));
    document.getElementById('next-button').addEventListener('click', () => navigateScreen(1));
    document.getElementById('finish-button').addEventListener('click', handleFinish);

    // Correct/Update buttons
    setupVerificationButtons();
  }

  /**
   * Setup verification button handlers
   */
  function setupVerificationButtons() {
    // Correct buttons
    document.querySelectorAll('.verify-correct').forEach(button => {
      button.addEventListener('click', handleCorrect);
    });

    // Update buttons
    document.querySelectorAll('.verify-update').forEach(button => {
      button.addEventListener('click', handleUpdate);
    });
  }

  /**
   * Handle "Correct" button click
   */
  function handleCorrect(e) {
    const field = e.target.dataset.field;
    const value = e.target.dataset.value;

    // Save value
    propertyData[field] = value;

    // Mark as verified (visual feedback)
    const item = e.target.closest('.verification-item');
    item.classList.add('verified');

    // Hide update input if visible
    const input = document.getElementById(field);
    if (input) {
      input.style.display = 'none';
    }

    console.log(`Verified ${field}: ${value}`);
  }

  /**
   * Handle "Update" button click
   */
  function handleUpdate(e) {
    const field = e.target.dataset.field;
    const input = document.getElementById(field);

    if (input) {
      // Show input field
      input.style.display = 'block';
      input.focus();

      // Save value when changed
      input.addEventListener('change', () => {
        propertyData[field] = input.value;
        console.log(`Updated ${field}: ${input.value}`);

        // Mark as verified
        const item = e.target.closest('.verification-item');
        item.classList.add('verified');
      });
    }
  }

  /**
   * Navigate between screens
   */
  function navigateScreen(direction) {
    // Save current screen data
    saveCurrentScreenData();

    // Calculate new screen
    const newScreen = currentScreen + direction;

    if (newScreen < 1 || newScreen > totalScreens) {
      return;
    }

    showScreen(newScreen);
  }

  /**
   * Show specific screen
   */
  function showScreen(screenNumber) {
    // Hide all screens
    document.querySelectorAll('.verification-screen').forEach(screen => {
      screen.style.display = 'none';
    });

    // Show target screen
    const targetScreen = document.getElementById(`screen-${screenNumber}`);
    if (targetScreen) {
      targetScreen.style.display = 'block';
    }

    // Update current screen
    currentScreen = screenNumber;

    // Update progress
    updateProgress();

    // Update navigation buttons
    updateNavigationButtons();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log(`Showing screen ${screenNumber}`);
  }

  /**
   * Update progress indicator
   */
  function updateProgress() {
    const progressPercent = (currentScreen / totalScreens) * 100;
    document.getElementById('progress-fill').style.width = progressPercent + '%';
    document.getElementById('progress-current').textContent = currentScreen;
    document.getElementById('progress-total').textContent = totalScreens;
  }

  /**
   * Update navigation buttons
   */
  function updateNavigationButtons() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const finishButton = document.getElementById('finish-button');

    // Show/hide previous button
    if (currentScreen === 1) {
      prevButton.style.display = 'none';
    } else {
      prevButton.style.display = 'inline-block';
    }

    // Show/hide next vs finish button
    if (currentScreen === totalScreens) {
      nextButton.style.display = 'none';
      finishButton.style.display = 'inline-block';
    } else {
      nextButton.style.display = 'inline-block';
      finishButton.style.display = 'none';
    }
  }

  /**
   * Save current screen data
   */
  function saveCurrentScreenData() {
    if (currentScreen === 3) {
      // Screen 3: Collect feature ages and conditions
      propertyData.hvacAge = document.getElementById('hvacAge').value;
      propertyData.roofAge = document.getElementById('roofAge').value;
      propertyData.kitchenCondition = document.getElementById('kitchenCondition').value;
      propertyData.kitchenYear = document.getElementById('kitchenYear').value;
      propertyData.bathroomCondition = document.getElementById('bathroomCondition').value;
      propertyData.bathroomYear = document.getElementById('bathroomYear').value;
      propertyData.flooring = document.getElementById('flooring').value;
    } else if (currentScreen === 4) {
      // Screen 4: Collect changes
      const checkedBoxes = document.querySelectorAll('input[name="changes"]:checked');
      propertyData.changes = Array.from(checkedBoxes).map(cb => cb.value);
      propertyData.changesDescription = document.getElementById('changesDescription').value;
    }

    // Save to localStorage
    saveToStorage('propertyData', propertyData);
  }

  /**
   * Populate fields from saved data
   */
  function populateFields() {
    // Populate all input fields
    Object.keys(propertyData).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = propertyData.changes?.includes(element.value);
        } else {
          element.value = propertyData[key];
        }
      }
    });

    // Mark verified items
    Object.keys(propertyData).forEach(key => {
      if (propertyData[key]) {
        const button = document.querySelector(`[data-field="${key}"]`);
        if (button) {
          const item = button.closest('.verification-item');
          if (item) {
            item.classList.add('verified');
          }
        }
      }
    });
  }

  /**
   * Handle back button
   */
  function handleBack() {
    if (currentScreen === 1) {
      // Go back to address page
      navigateTo('address.html');
    } else {
      navigateScreen(-1);
    }
  }

  /**
   * Handle finish button
   */
  function handleFinish() {
    // Save final screen data
    saveCurrentScreenData();

    console.log('Property verification complete:', propertyData);

    // Navigate to photo instructions
    navigateTo('instructions.html');
  }

  // Initialize when DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
