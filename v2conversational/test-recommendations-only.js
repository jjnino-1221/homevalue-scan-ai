const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 800 });
  const page = await browser.newPage();

  // Capture console
  page.on('console', msg => {
    if (msg.text().includes('Step 18') || msg.text().includes('recommendations') || msg.text().includes('Rendering')) {
      console.log('[CONSOLE]:', msg.text());
    }
  });

  console.log('Testing View Recommendations specifically...\n');

  await page.goto('http://localhost:8001/chat.html');
  await page.waitForTimeout(2000);

  // Quick navigation
  await page.click('text=✓ Yes, evaluate my property');
  await page.waitForTimeout(1000);
  await page.click('text=123 Main Street');
  await page.waitForTimeout(1000);

  for (let i = 0; i < 6; i++) {
    await page.click('button:has-text("✓ Correct")');
    await page.waitForTimeout(800);
  }

  await page.click('text=6-10 years');
  await page.waitForTimeout(1000);
  await page.click('text=6-10 years');
  await page.waitForTimeout(1000);
  await page.click('text=Fully Renovated');
  await page.waitForTimeout(1000);
  await page.click('text=None');
  await page.waitForTimeout(1000);
  await page.click('text=Skip photos');
  await page.waitForTimeout(3500);

  await page.waitForSelector('text=$285,000');
  console.log('✅ Valuation card appeared\n');

  await page.waitForTimeout(1000);

  console.log('=== Clicking View Recommendations ===\n');
  await page.click('button:has-text("View Recommendations")');

  console.log('Waiting 5 seconds for response...\n');
  await page.waitForTimeout(5000);

  // Check for the message
  const message = await page.locator('text=Based on your property analysis').count();
  console.log('"Based on your property analysis" message:', message > 0 ? '✅ FOUND' : '❌ NOT FOUND');

  // Check for recommendation titles
  const kitchen = await page.locator('text=Kitchen Update').count();
  const bathroom = await page.locator('text=Bathroom Refresh').count();
  const curb = await page.locator('text=Curb Appeal').count();

  console.log('\nRecommendation titles in DOM:');
  console.log('  Kitchen Update:', kitchen);
  console.log('  Bathroom Refresh:', bathroom);
  console.log('  Curb Appeal:', curb);

  // Check visibility
  console.log('\nVisibility:');
  console.log('  Kitchen Update visible:', await page.locator('text=Kitchen Update').isVisible());
  console.log('  Bathroom Refresh visible:', await page.locator('text=Bathroom Refresh').isVisible());

  // Get last message HTML
  const lastHTML = await page.evaluate(() => {
    const messages = document.querySelectorAll('.message.assistant');
    const last = messages[messages.length - 1];
    return last ? last.innerHTML : 'No messages';
  });

  console.log('\nLast message HTML (first 500 chars):');
  console.log(lastHTML.substring(0, 500));

  console.log('\nKeeping browser open for inspection...');
  await page.waitForTimeout(60000);
  await browser.close();
})();
