const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 800 });
  const page = await browser.newPage();

  console.log('Loading app...');
  await page.goto('http://localhost:8001/chat.html');
  await page.waitForTimeout(2000);

  console.log('1. Click Yes...');
  await page.click('text=✓ Yes, evaluate my property');
  await page.waitForTimeout(1500);

  console.log('2. Select address...');
  await page.click('text=123 Main Street');
  await page.waitForTimeout(1500);

  // Quick click through verifications
  console.log('3-8. Clicking Correct...');
  for (let i = 0; i < 6; i++) {
    await page.click('button:has-text("✓ Correct")');
    await page.waitForTimeout(1200);
  }

  console.log('9. HVAC...');
  await page.click('text=6-10 years');
  await page.waitForTimeout(1500);

  console.log('10. Roof...');
  await page.click('text=6-10 years');
  await page.waitForTimeout(1500);

  console.log('11. Kitchen...');
  await page.click('text=Fully Renovated');
  await page.waitForTimeout(1500);

  console.log('12. Clicking "None" for improvements...');
  await page.click('text=None');
  await page.waitForTimeout(2000);

  // Check result
  const photosVisible = await page.locator('text=Photos can increase accuracy').isVisible();
  const thanksVisible = await page.locator('text=Thanks for using Rocket Valuation').isVisible();

  console.log('\n=== RESULT ===');
  if (photosVisible) {
    console.log('✅✅✅ SUCCESS! Photos question appeared!');
    console.log('✅ The fix works - flow continues correctly after selecting "None"');
  } else if (thanksVisible) {
    console.log('❌ FAILED! Got "Thanks" message - flow still ends prematurely');
  } else {
    console.log('⚠️  UNKNOWN STATE - checking what appeared...');
    const html = await page.evaluate(() => {
      const messages = document.querySelectorAll('.message.assistant');
      const last = messages[messages.length - 1];
      return last ? last.textContent : 'No messages';
    });
    console.log('Last message:', html.substring(0, 200));
  }

  await page.waitForTimeout(3000);
  await browser.close();
})();
