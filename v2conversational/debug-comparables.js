const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 800 });
  const page = await browser.newPage();

  console.log('Debug: Checking what happens after View Comparables click...\n');

  // Capture console
  page.on('console', msg => {
    if (msg.text().includes('comparables') || msg.text().includes('Step 17') || msg.text().includes('DEBUG')) {
      console.log('[CONSOLE]:', msg.text());
    }
  });

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
  await page.waitForTimeout(3000);

  await page.waitForSelector('text=$285,000');
  console.log('✅ Valuation card appeared');

  await page.waitForTimeout(1000);

  console.log('\n=== CLICKING VIEW COMPARABLES ===\n');
  await page.click('button:has-text("View Comparables")');
  await page.waitForTimeout(3000);

  // Check how many assistant messages we have
  const messageCount = await page.locator('.message.assistant').count();
  console.log('Total assistant messages:', messageCount);

  // Get the last 2 messages
  const lastTwoMessages = await page.evaluate(() => {
    const messages = Array.from(document.querySelectorAll('.message.assistant'));
    return messages.slice(-2).map((m, i) => ({
      index: i,
      text: m.textContent.substring(0, 100),
      html: m.innerHTML.substring(0, 500)
    }));
  });

  console.log('\n=== LAST 2 MESSAGES ===');
  lastTwoMessages.forEach(m => {
    console.log(`\nMessage ${m.index}:`);
    console.log('Text:', m.text);
    console.log('HTML preview:', m.html.substring(0, 200));
  });

  // Check if comparables message exists
  const comparablesMessage = await page.locator('text=Here are 3 comparable properties').count();
  console.log('\n"Here are 3 comparable properties" message:', comparablesMessage > 0 ? '✅ FOUND' : '❌ NOT FOUND');

  // Check if addresses are in the DOM (even if not visible)
  const oak = await page.locator('text=145 Oak Ave').count();
  const elm = await page.locator('text=89 Elm Street').count();
  const maple = await page.locator('text=210 Maple Dr').count();

  console.log('145 Oak Ave in DOM:', oak, '(visible:', await page.locator('text=145 Oak Ave').isVisible(), ')');
  console.log('89 Elm Street in DOM:', elm, '(visible:', await page.locator('text=89 Elm Street').isVisible(), ')');
  console.log('210 Maple Dr in DOM:', maple, '(visible:', await page.locator('text=210 Maple Dr').isVisible(), ')');

  console.log('\nKeeping browser open...');
  await page.waitForTimeout(60000);
  await browser.close();
})();
