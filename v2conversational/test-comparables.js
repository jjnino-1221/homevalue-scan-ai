const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();

  // Capture console
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('appendResultCard') || text.includes('appendInteractiveUI') || text.includes('Step 16') || text.includes('view_')) {
      console.log('[CONSOLE]:', text);
    }
  });

  console.log('Testing View Comparables and View Recommendations...\n');

  await page.goto('http://localhost:8001/chat.html');
  await page.waitForTimeout(2000);

  // Quick navigation to valuation
  console.log('Navigating to valuation step...');
  await page.click('text=✓ Yes, evaluate my property');
  await page.waitForTimeout(1200);
  await page.click('text=123 Main Street');
  await page.waitForTimeout(1200);

  for (let i = 0; i < 6; i++) {
    await page.click('button:has-text("✓ Correct")');
    await page.waitForTimeout(1000);
  }

  await page.click('text=6-10 years'); // HVAC
  await page.waitForTimeout(1200);
  await page.click('text=6-10 years'); // Roof
  await page.waitForTimeout(1200);
  await page.click('text=Fully Renovated'); // Kitchen
  await page.waitForTimeout(1200);

  console.log('Selecting None for improvements...');
  await page.click('text=None');
  await page.waitForTimeout(1500);

  console.log('Selecting Skip photos...');
  await page.click('text=Skip photos');
  await page.waitForTimeout(3000); // Wait for auto-advance + valuation

  console.log('\n=== CHECKING VALUATION CARD ===');

  // Check if valuation card appeared
  const valuationVisible = await page.locator('text=$285,000').isVisible();
  console.log('Valuation card visible:', valuationVisible ? '✅ YES' : '❌ NO');

  // Check if buttons are visible
  const comparablesButton = await page.locator('text=View Comparables').count();
  const recommendationsButton = await page.locator('text=View Recommendations').count();

  console.log('View Comparables button count:', comparablesButton);
  console.log('View Recommendations button count:', recommendationsButton);

  if (comparablesButton > 0) {
    console.log('\n=== TESTING VIEW COMPARABLES ===');
    await page.click('text=View Comparables');
    await page.waitForTimeout(2000);

    const comparablesVisible = await page.locator('text=145 Oak Ave').isVisible();
    console.log('Comparables appeared:', comparablesVisible ? '✅ YES' : '❌ NO');

    if (!comparablesVisible) {
      const lastMessage = await page.evaluate(() => {
        const messages = document.querySelectorAll('.message.assistant');
        const last = messages[messages.length - 1];
        return last ? last.textContent.substring(0, 200) : 'No messages';
      });
      console.log('Last message:', lastMessage);
    }
  } else {
    console.log('❌ View Comparables button NOT FOUND');

    // Check what's in the page
    const html = await page.evaluate(() => {
      const container = document.getElementById('messagesContainer');
      return container ? container.innerHTML : 'No container';
    });

    console.log('\nLast 500 chars of page HTML:');
    console.log(html.substring(html.length - 500));
  }

  console.log('\nKeeping browser open for inspection...');
  await page.waitForTimeout(30000);
  await browser.close();
})();
