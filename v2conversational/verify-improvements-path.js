const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 800 });
  const page = await browser.newPage();

  console.log('Testing improvements selection path...\n');

  await page.goto('http://localhost:8001/chat.html');
  await page.waitForTimeout(2000);

  // Quick navigation to improvements question
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
  await page.waitForTimeout(1500);

  console.log('Selecting multiple improvements...');
  await page.click('text=Kitchen Remodel');
  await page.waitForTimeout(500);
  await page.click('text=Bathroom Remodel');
  await page.waitForTimeout(500);

  console.log('Clicking Done button...');
  await page.click('button:has-text("Done")');
  await page.waitForTimeout(2000);

  // Check if description question appeared
  const descVisible = await page.locator('text=tell me more about these improvements').isVisible();

  console.log('\n=== STEP 13 CHECK ===');
  if (descVisible) {
    console.log('✅ SUCCESS! Description question appeared (Step 13)');

    // Select a description
    console.log('Selecting description...');
    await page.click('text=Complete remodel with high-end finishes');
    await page.waitForTimeout(2000);

    // Check if photos question appeared
    const photosVisible = await page.locator('text=Photos can increase accuracy').isVisible();

    console.log('\n=== STEP 14 CHECK ===');
    if (photosVisible) {
      console.log('✅✅✅ SUCCESS! Photos question appeared (Step 14)');
      console.log('✅ Full improvements path works correctly!');
    } else {
      console.log('❌ Photos question did NOT appear after description');
    }
  } else {
    console.log('❌ Description question did NOT appear after selecting improvements');
  }

  await page.waitForTimeout(3000);
  await browser.close();
})();
