const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('DEBUG') || text.includes('step') || text.includes('trigger')) {
      console.log('[CONSOLE]:', text);
    }
  });

  page.on('pageerror', error => {
    console.log('[ERROR]:', error.message);
  });

  console.log('\n=== Testing Improvements Flow ===\n');

  await page.goto('http://localhost:8001/chat.html');
  await page.waitForTimeout(3000);

  console.log('Step 1: Click Yes...');
  await page.click('text=✓ Yes, evaluate my property');
  await page.waitForTimeout(2000);

  console.log('Step 2: Select address...');
  await page.click('text=123 Main Street');
  await page.waitForTimeout(2000);

  // Click through verifications (steps 3-8)
  console.log('Steps 3-8: Clicking Correct 6 times...');
  for (let i = 0; i < 6; i++) {
    await page.click('button:has-text("✓ Correct")');
    await page.waitForTimeout(1500);
  }

  console.log('Step 9: HVAC age...');
  await page.click('text=6-10 years');
  await page.waitForTimeout(2000);

  console.log('Step 10: Roof age...');
  await page.click('text=6-10 years');
  await page.waitForTimeout(2000);

  console.log('Step 11: Kitchen...');
  await page.click('text=Fully Renovated');
  await page.waitForTimeout(2000);

  console.log('\nStep 12: Testing improvements selection...');

  // Test Case 1: Select "None"
  console.log('\n--- TEST CASE 1: Selecting "None" ---');
  const noneButton = await page.locator('text=None').count();
  if (noneButton > 0) {
    await page.click('text=None');
    await page.waitForTimeout(3000);

    // Check if photos question appeared
    const photosQuestion = await page.locator('text=Photos can increase accuracy').count();
    console.log('Photos question appeared after "None"?', photosQuestion > 0 ? '✅ YES' : '❌ NO');

    if (photosQuestion === 0) {
      // Check what appeared instead
      const thanksMessage = await page.locator('text=Thanks for using Rocket Valuation').count();
      if (thanksMessage > 0) {
        console.log('❌ ERROR: Got "Thanks" message - conversation ended prematurely!');
        console.log('This means getNextStep() returned null');
      } else {
        console.log('❌ ERROR: Unknown state - neither photos nor thanks message');
      }

      // Get last message
      const lastMessage = await page.evaluate(() => {
        const messages = document.querySelectorAll('.message.assistant');
        const last = messages[messages.length - 1];
        return last ? last.textContent : 'No messages';
      });
      console.log('Last assistant message:', lastMessage.substring(0, 200));
    }
  } else {
    console.log('❌ "None" button not found!');
  }

  console.log('\nKeeping browser open for inspection...');
  console.log('Press Ctrl+C to close');

  // Keep browser open
  await page.waitForTimeout(120000);
  await browser.close();
})();
