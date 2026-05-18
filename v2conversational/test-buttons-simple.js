const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  console.log('Opening app and going to valuation card...\n');

  await page.goto('http://localhost:8001/chat.html');

  console.log('Waiting 45 seconds for you to manually click through to the valuation card...');
  console.log('When you see the $285,000 valuation, the test will check for buttons.\n');

  await page.waitForTimeout(45000);

  console.log('\n=== CHECKING FOR BUTTONS ===\n');

  // Check valuation card
  const valuationVisible = await page.locator('text=$285,000').isVisible();
  console.log('1. Valuation card ($285,000) visible:', valuationVisible ? '✅ YES' : '❌ NO');

  // Count all buttons
  const allButtons = await page.locator('button').count();
  console.log('2. Total buttons on page:', allButtons);

  // Check specific buttons
  const comparablesCount = await page.locator('button:has-text("View Comparables")').count();
  const recommendationsCount = await page.locator('button:has-text("View Recommendations")').count();
  const pdfCount = await page.locator('button:has-text("Download PDF")').count();

  console.log('3. "View Comparables" button count:', comparablesCount, comparablesCount > 0 ? '✅' : '❌');
  console.log('4. "View Recommendations" button count:', recommendationsCount, recommendationsCount > 0 ? '✅' : '❌');
  console.log('5. "Download PDF Report" button count:', pdfCount, pdfCount > 0 ? '✅' : '❌');

  // Check for chip buttons
  const chipButtons = await page.locator('.chip-button').count();
  console.log('6. Chip buttons (.chip-button) count:', chipButtons);

  // Get all button text
  const buttonTexts = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.map(b => b.textContent.trim()).slice(-10); // Last 10 buttons
  });
  console.log('7. Last 10 button texts:', buttonTexts);

  // Check messages container HTML
  const lastMessageHTML = await page.evaluate(() => {
    const messages = document.querySelectorAll('.message.assistant');
    const last = messages[messages.length - 1];
    return last ? last.innerHTML : 'No messages';
  });
  console.log('\n8. Last assistant message HTML (first 500 chars):');
  console.log(lastMessageHTML.substring(0, 500));

  console.log('\n=== TEST IF BUTTON CLICKS ===\n');

  if (comparablesCount > 0) {
    console.log('Clicking "View Comparables"...');
    await page.click('button:has-text("View Comparables")');
    await page.waitForTimeout(3000);

    const comparablesAppeared = await page.locator('text=145 Oak Ave').isVisible();
    console.log('Comparables appeared:', comparablesAppeared ? '✅ YES' : '❌ NO');
  } else {
    console.log('❌ Cannot test - View Comparables button not found');
  }

  console.log('\nBrowser will stay open for 30 more seconds...');
  await page.waitForTimeout(30000);
  await browser.close();
})();
