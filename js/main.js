/**
 * Main JavaScript
 * Page-specific initialization and event handlers
 */

/**
 * Initialize landing page
 */
function initLandingPage() {
  console.log('Landing page loaded');

  // Add click handlers to all "Get Started" / "Start" buttons
  onClick('.hero-cta, .cta-container .button', function() {
    console.log('Get Started clicked');
    navigateTo('address.html');
  });

  // Log when page is ready
  console.log('✓ Navigation handlers attached');
}

/**
 * Detect which page we're on and initialize appropriately
 */
function initPage() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  console.log('Current page:', page);

  // Initialize based on current page
  if (page === 'index.html' || page === '') {
    initLandingPage();
  }
  // Other page initializations will go here
}

/**
 * Run initialization when page loads
 */
document.addEventListener('DOMContentLoaded', initPage);
