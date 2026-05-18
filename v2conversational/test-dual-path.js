const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log('[CONSOLE]:', msg.text());
  });

  page.on('pageerror', error => {
    console.log('[PAGE ERROR]:', error.message);
  });

  console.log('Testing dual-path V2 experience...\n');

  await page.goto('http://localhost:8001/chat.html');
  await page.waitForTimeout(2000);

  // Check for both path options
  const evaluateButton = await page.locator('text=✓ Yes, evaluate my property').isVisible();
  const appraisalButton = await page.locator('text=❓ Do I need an appraisal?').isVisible();

  console.log('\n=== WELCOME SCREEN ===');
  console.log('✓ Yes, evaluate my property:', evaluateButton ? '✅ VISIBLE' : '❌ NOT FOUND');
  console.log('❓ Do I need an appraisal?:', appraisalButton ? '✅ VISIBLE' : '❌ NOT FOUND');

  if (!evaluateButton || !appraisalButton) {
    console.log('\n❌ FAILED: Both path options should be visible');
    await page.waitForTimeout(3000);
    await browser.close();
    return;
  }

  // Test Path B (Appraisal Check)
  console.log('\n=== TESTING PATH B: APPRAISAL CHECK ===');
  await page.click('text=❓ Do I need an appraisal?');
  await page.waitForTimeout(1000);

  // Check for property purpose question
  const purposeVisible = await page.locator('text=purpose of your property transaction').isVisible();
  console.log('Property purpose question:', purposeVisible ? '✅ VISIBLE' : '❌ NOT FOUND');

  if (purposeVisible) {
    await page.click('text=Refinance');
    await page.waitForTimeout(1000);

    // Check for property value question
    const valueVisible = await page.locator('text=estimated property value').isVisible();
    console.log('Property value question:', valueVisible ? '✅ VISIBLE' : '❌ NOT FOUND');

    await page.click('text=$250,000 - $500,000');
    await page.waitForTimeout(1000);

    // Check for issues question
    const issuesVisible = await page.locator('text=issues with the property').isVisible();
    console.log('Property issues question:', issuesVisible ? '✅ VISIBLE' : '❌ NOT FOUND');

    await page.click('text=None');
    await page.waitForTimeout(1000);

    // Check for waiver results
    const waiverVisible = await page.locator('text=appraisal waiver').isVisible();
    console.log('Appraisal waiver results:', waiverVisible ? '✅ VISIBLE' : '❌ NOT FOUND');

    // Check for transition option to Path A
    const transitionVisible = await page.locator('text=✓ Yes, evaluate my property').isVisible();
    console.log('Transition to evaluation:', transitionVisible ? '✅ VISIBLE' : '❌ NOT FOUND');
  }

  console.log('\n=== PATH B COMPLETE ===');
  await page.waitForTimeout(3000);
  await browser.close();
})();
