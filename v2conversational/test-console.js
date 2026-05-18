const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture all console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[BROWSER ${type.toUpperCase()}]:`, text);
  });

  // Capture errors
  page.on('pageerror', error => {
    console.log('[BROWSER ERROR]:', error.message);
  });

  // Navigate to the app
  console.log('Navigating to app...');
  await page.goto('http://localhost:8001/chat.html');

  // Wait a bit to see what happens
  console.log('Waiting 10 seconds to observe initialization...');
  await page.waitForTimeout(10000);

  // Check what's in the messages container
  const messagesHTML = await page.evaluate(() => {
    const container = document.getElementById('messagesContainer');
    return container ? container.innerHTML : 'Container not found';
  });

  console.log('\n=== MESSAGES CONTAINER CONTENT ===');
  console.log(messagesHTML);
  console.log('=== END ===\n');

  await browser.close();
})();
