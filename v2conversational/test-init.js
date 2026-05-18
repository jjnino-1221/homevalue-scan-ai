const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture console
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (text.includes('DEBUG') || text.includes('AIOrchestrator') || text.includes('Initializing') || text.includes('✅') || text.includes('⏳')) {
      console.log(`[${type.toUpperCase()}]:`, text);
    }
  });

  page.on('pageerror', error => {
    console.log('[ERROR]:', error.message);
  });

  console.log('Loading page...');
  await page.goto('http://localhost:8001/chat.html');

  console.log('\nWaiting 5 seconds for initialization...\n');
  await page.waitForTimeout(5000);

  // Check if welcome message appeared
  const welcomeMessage = await page.locator('text=Welcome to Rocket Valuation').count();
  const firstButton = await page.locator('text=✓ Yes, evaluate my property').count();

  console.log('\n=== INITIALIZATION RESULTS ===');
  console.log('Welcome message visible:', welcomeMessage > 0 ? '✅ YES' : '❌ NO');
  console.log('First button visible:', firstButton > 0 ? '✅ YES' : '❌ NO');

  if (welcomeMessage > 0 && firstButton > 0) {
    console.log('\n✅✅✅ APP INITIALIZED SUCCESSFULLY! ✅✅✅\n');
  } else {
    console.log('\n❌ App did not initialize properly\n');

    // Check messages container
    const html = await page.evaluate(() => {
      return document.getElementById('messagesContainer').innerHTML;
    });
    console.log('Messages container HTML:');
    console.log(html.substring(0, 500));
  }

  await browser.close();
})();
