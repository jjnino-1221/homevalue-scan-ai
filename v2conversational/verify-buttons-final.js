const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();

  console.log('Testing View Comparables and View Recommendations buttons...\n');

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

  console.log('Waiting for valuation card (auto-advance takes 1.5s + 800ms processing)...');
  await page.waitForTimeout(3000);

  // Wait specifically for valuation card to appear
  console.log('Waiting for $285,000 to appear...');
  await page.waitForSelector('text=$285,000', { timeout: 5000 });

  console.log('\n=== VALUATION CARD APPEARED ===\n');

  // Now check for buttons
  await page.waitForTimeout(1000); // Give buttons time to render

  const comparablesCount = await page.locator('button:has-text("View Comparables")').count();
  const recommendationsCount = await page.locator('button:has-text("View Recommendations")').count();

  console.log('View Comparables button:', comparablesCount, comparablesCount > 0 ? '✅' : '❌');
  console.log('View Recommendations button:', recommendationsCount, recommendationsCount > 0 ? '✅' : '❌');

  if (comparablesCount > 0 && recommendationsCount > 0) {
    console.log('\n=== ✅ BUTTONS FOUND! Testing clicks... ===\n');

    // Test View Comparables
    console.log('1. Clicking "View Comparables"...');
    await page.click('button:has-text("View Comparables")');
    await page.waitForTimeout(2000);

    const comp1 = await page.locator('text=145 Oak Ave').isVisible();
    const comp2 = await page.locator('text=89 Elm Street').isVisible();
    const comp3 = await page.locator('text=210 Maple Dr').isVisible();

    console.log('   - 145 Oak Ave:', comp1 ? '✅ Visible' : '❌ Not visible');
    console.log('   - 89 Elm Street:', comp2 ? '✅ Visible' : '❌ Not visible');
    console.log('   - 210 Maple Dr:', comp3 ? '✅ Visible' : '❌ Not visible');

    if (comp1 && comp2 && comp3) {
      console.log('   ✅ View Comparables WORKS!\n');

      // Now test View Recommendations
      console.log('2. Clicking "View Recommendations"...');
      await page.click('button:has-text("View Recommendations")');
      await page.waitForTimeout(2000);

      const rec1 = await page.locator('text=Kitchen Update').isVisible();
      const rec2 = await page.locator('text=Bathroom Refresh').isVisible();

      console.log('   - Kitchen Update:', rec1 ? '✅ Visible' : '❌ Not visible');
      console.log('   - Bathroom Refresh:', rec2 ? '✅ Visible' : '❌ Not visible');

      if (rec1 && rec2) {
        console.log('   ✅ View Recommendations WORKS!\n');
        console.log('\n🎉🎉🎉 ALL BUTTONS WORK CORRECTLY! 🎉🎉🎉\n');
      } else {
        console.log('   ❌ View Recommendations did not show content\n');
      }
    } else {
      console.log('   ❌ View Comparables did not show all properties\n');
    }
  } else {
    console.log('\n❌ BUTTONS NOT FOUND\n');
    console.log('Checking page HTML...');

    const lastMessageHTML = await page.evaluate(() => {
      const messages = document.querySelectorAll('.message.assistant');
      const last = messages[messages.length - 1];
      return last ? last.innerHTML : 'No messages';
    });

    console.log('Last message HTML (first 1000 chars):');
    console.log(lastMessageHTML.substring(0, 1000));
  }

  console.log('\nBrowser will stay open for 10 seconds...');
  await page.waitForTimeout(10000);
  await browser.close();
})();
