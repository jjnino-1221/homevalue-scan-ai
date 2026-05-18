const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  // Capture ALL console messages
  page.on('console', msg => {
    console.log('[CONSOLE]:', msg.text());
  });

  page.on('pageerror', error => {
    console.log('[PAGE ERROR]:', error.message);
  });

  console.log('Quick test to recommendations...\n');

  await page.goto('http://localhost:8001/chat.html');
  await page.waitForTimeout(2000);

  await page.click('text=✓ Yes, evaluate my property');
  await page.waitForTimeout(800);
  await page.click('text=123 Main Street');
  await page.waitForTimeout(800);

  for (let i = 0; i < 6; i++) {
    await page.click('button:has-text("✓ Correct")');
    await page.waitForTimeout(600);
  }

  await page.click('text=6-10 years');
  await page.waitForTimeout(800);
  await page.click('text=6-10 years');
  await page.waitForTimeout(800);
  await page.click('text=Fully Renovated');
  await page.waitForTimeout(800);
  await page.click('text=None');
  await page.waitForTimeout(800);
  await page.click('text=Skip photos');
  await page.waitForTimeout(3000);

  await page.waitForSelector('text=$285,000');
  console.log('\n✅ Valuation appeared\n');
  await page.waitForTimeout(1000);

  console.log('=== CLICKING VIEW RECOMMENDATIONS ===\n');
  await page.click('button:has-text("View Recommendations")');

  console.log('Waiting 3 seconds...\n');
  await page.waitForTimeout(3000);

  // Check if it worked
  const kitchen = await page.locator('text=Kitchen Update').isVisible();
  console.log('\nKitchen Update visible:', kitchen ? '✅ YES' : '❌ NO');

  await page.waitForTimeout(5000);
  await browser.close();
})();
