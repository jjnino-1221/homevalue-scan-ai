const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 800 });
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log('[BROWSER]:', msg.text());
  });

  page.on('pageerror', error => {
    console.log('[PAGE ERROR]:', error.message);
  });

  console.log('\n=== Testing Phase 2: Dynamic Waiver Message ===\n');

  await page.goto('http://localhost:8001/chat.html');
  await page.waitForTimeout(2000);

  console.log('Step 1: Select appraisal check...');
  await page.click('text=❓ Do I need an appraisal?');
  await page.waitForTimeout(1000);

  console.log('Step 2: Select Refinance...');
  await page.click('text=Refinance');
  await page.waitForTimeout(1000);

  console.log('Step 3: Select Under $250,000...');
  await page.click('text=Under $250,000');
  await page.waitForTimeout(1000);

  console.log('Step 4: Select None (no issues)...');
  await page.click('text=None');
  await page.waitForTimeout(3000);

  console.log('\n=== Checking results ===\n');

  // Take a screenshot to see what appeared
  await page.screenshot({ path: 'phase2-result.png', fullPage: true });
  console.log('Screenshot saved to phase2-result.png');

  // Check what text is visible
  const pageText = await page.textContent('body');
  console.log('\nVisible text includes:');
  if (pageText.includes('may qualify')) console.log('  ✅ "may qualify" found');
  if (pageText.includes('appraisal waiver')) console.log('  ✅ "appraisal waiver" found');
  if (pageText.includes('Faster closing')) console.log('  ✅ "Faster closing" found');
  if (pageText.includes('Learn more')) console.log('  ✅ "Learn more" button found');

  await page.waitForTimeout(5000);
  await browser.close();
})();
