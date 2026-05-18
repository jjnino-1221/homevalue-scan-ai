const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();

  const consoleMessages = [];

  // Capture ALL console messages
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(text);
    // Only print certain messages to keep output clean
    if (text.includes('appendInteractiveUI') ||
        text.includes('appendResultCard') ||
        text.includes('Step 16') ||
        text.includes('currentMessageElement') ||
        text.includes('ERROR') ||
        text.includes('✅') ||
        text.includes('❌')) {
      console.log(`[CONSOLE]: ${text}`);
    }
  });

  console.log('Quick run to valuation card...\n');

  await page.goto('http://localhost:8001/chat.html');
  await page.waitForTimeout(2000);

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

  console.log('\n=== Waiting for valuation card (auto-advance + calculation) ===\n');
  await page.waitForTimeout(4000);

  // Check results
  console.log('\n=== CHECKING RESULTS ===\n');

  const valuationVisible = await page.locator('text=$285,000').isVisible();
  console.log('Valuation card visible:', valuationVisible ? '✅ YES' : '❌ NO');

  const comparablesButton = await page.locator('button:has-text("View Comparables")').count();
  const recommendationsButton = await page.locator('button:has-text("View Recommendations")').count();

  console.log('View Comparables button:', comparablesButton > 0 ? '✅ FOUND' : '❌ NOT FOUND');
  console.log('View Recommendations button:', recommendationsButton > 0 ? '✅ FOUND' : '❌ NOT FOUND');

  // Save all console messages to file for analysis
  const fs = require('fs');
  fs.writeFileSync('console-log-full.txt', consoleMessages.join('\n'));
  console.log('\nFull console log saved to: console-log-full.txt');

  await page.waitForTimeout(3000);
  await browser.close();
})();
