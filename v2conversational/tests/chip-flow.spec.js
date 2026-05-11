// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Mobile Valuation - Fully Chip-Based Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8001/chat.html');

    // Wait for the app to initialize
    await page.waitForSelector('.messages-container');
  });

  test('Path A: Complete flow with improvements', async ({ page }) => {
    // Step 1: Welcome - Click "Yes, evaluate my property"
    await page.click('text=✓ Yes, evaluate my property');
    await page.waitForTimeout(1000);

    // Step 2: Address - Select an address
    await page.click('text=123 Main Street, Detroit MI 48226');
    await page.waitForTimeout(1500);

    // Step 3: Property Type
    await page.waitForSelector('text=Property Type:');
    await page.click('button:has-text("✓ Correct")');
    await page.waitForTimeout(1500);

    // Step 4: Year Built
    await page.waitForSelector('text=Year Built:');
    await page.click('button:has-text("✓ Correct")');
    await page.waitForTimeout(1500);

    // Step 5: Square Footage
    await page.waitForSelector('text=Square Footage:');
    await page.click('button:has-text("✓ Correct")');
    await page.waitForTimeout(1500);

    // Step 6: Bedrooms
    await page.waitForSelector('text=Bedrooms:');
    await page.click('button:has-text("✓ Correct")');
    await page.waitForTimeout(1500);

    // Step 7: Bathrooms
    await page.waitForSelector('text=Bathrooms:');
    await page.click('button:has-text("✓ Correct")');
    await page.waitForTimeout(1500);

    // Step 8: Garage
    await page.waitForSelector('text=Garage:');
    await page.click('button:has-text("✓ Correct")');
    await page.waitForTimeout(1500);

    // Step 9: HVAC age
    await page.waitForSelector('text=HVAC System Age:');
    await page.click('text=6-10 years');
    await page.waitForTimeout(1500);

    // Step 10: Roof age
    await page.click('text=6-10 years');
    await page.waitForTimeout(1000);

    // Step 11: Kitchen condition
    await page.click('text=Fully Renovated');
    await page.waitForTimeout(1000);

    // Step 12: Improvements - Multi-select
    await page.click('text=Kitchen Remodel');
    await page.click('text=Bathroom Remodel');
    await page.click('button:has-text("Done")');
    await page.waitForTimeout(1000);

    // Step 13: Improvement description
    await page.click('text=Complete remodel with high-end finishes');
    await page.waitForTimeout(1000);

    // Step 14: Photos
    await page.click('text=📷 Yes, take photos');

    // Step 15: Auto-advance (wait 2 seconds)
    await page.waitForTimeout(2500);

    // Step 16: Verify valuation card appears
    await expect(page.locator('text=$285,000')).toBeVisible();
    await expect(page.locator('text=Confidence')).toBeVisible();

    // Verify card data
    await expect(page.locator('text=1,800 sq ft')).toBeVisible();
    await expect(page.locator('text=3 bed')).toBeVisible();
    await expect(page.locator('text=2.5 bath')).toBeVisible();

    // Step 17: View comparables
    await page.click('text=View Comparables');
    await page.waitForTimeout(1000);

    // Verify 3 comparable properties appear
    await expect(page.locator('text=145 Oak Ave')).toBeVisible();
    await expect(page.locator('text=89 Elm Street')).toBeVisible();
    await expect(page.locator('text=210 Maple Dr')).toBeVisible();

    // Go back to valuation to access recommendations
    // (In real app, there might be navigation, but for now we'll reload or use step 16 buttons)
    // Since the flow continues, we should be able to click View Recommendations
  });

  test('Path B: Quick flow without improvements', async ({ page }) => {
    // Step 1: Welcome
    await page.click('text=✓ Yes, evaluate my property');
    await page.waitForTimeout(1000);

    // Step 2: Address
    await page.click('text=456 Oak Avenue, Ann Arbor MI 48103');
    await page.waitForTimeout(1000);

    // Steps 3-8: Click "Correct" 6 times
    for (let i = 0; i < 6; i++) {
      await page.click('text=✓ Correct');
      await page.waitForTimeout(1000);
    }

    // Step 9: HVAC age
    await page.click('text=0-5 years');
    await page.waitForTimeout(1000);

    // Step 10: Roof age
    await page.click('text=0-5 years');
    await page.waitForTimeout(1000);

    // Step 11: Kitchen condition
    await page.click('text=Original/Dated');
    await page.waitForTimeout(1000);

    // Step 12: Improvements - Click "None" (should immediately advance)
    await page.click('text=None');
    await page.waitForTimeout(1000);

    // Step 13 should be SKIPPED

    // Step 14: Photos
    await page.click('text=Skip photos');

    // Step 15: Auto-advance (wait 2 seconds)
    await page.waitForTimeout(2500);

    // Step 16: Verify valuation card appears
    await expect(page.locator('text=$285,000')).toBeVisible();
    await expect(page.locator('text=92%')).toBeVisible();
  });

  test('Visual: Chips have proper Nova styling', async ({ page }) => {
    // Click to step 1
    await page.waitForTimeout(500);

    // Check that chips have proper styling
    const chip = page.locator('.rkt-Chip').first();

    // Check chip has proper border radius (24px)
    const borderRadius = await chip.evaluate(el => {
      return window.getComputedStyle(el).borderRadius;
    });
    expect(borderRadius).toBe('24px');

    // Check chip has proper min-height (32px)
    const minHeight = await chip.evaluate(el => {
      return window.getComputedStyle(el).minHeight;
    });
    expect(minHeight).toBe('32px');

    // Check chip font size (14px)
    const fontSize = await chip.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    expect(fontSize).toBe('14px');
  });

  test('Interaction: Multi-select with Done button', async ({ page }) => {
    // Navigate to improvements step (step 12)
    await page.click('text=✓ Yes, evaluate my property');
    await page.waitForTimeout(1000);

    // Fast forward through steps
    await page.click('text=123 Main Street, Detroit MI 48226');
    await page.waitForTimeout(500);

    for (let i = 0; i < 6; i++) {
      await page.click('text=✓ Correct');
      await page.waitForTimeout(500);
    }

    await page.click('text=6-10 years'); // HVAC
    await page.waitForTimeout(500);
    await page.click('text=6-10 years'); // Roof
    await page.waitForTimeout(500);
    await page.click('text=Fully Renovated'); // Kitchen
    await page.waitForTimeout(1000);

    // Now at step 12 - multi-select improvements
    await page.click('text=Kitchen Remodel');
    await page.click('text=Bathroom Remodel');
    await page.click('text=New Roof');

    // Verify Done button shows count
    const doneButton = page.locator('button:has-text("Done")');
    await expect(doneButton).toBeVisible();
    await expect(doneButton).toContainText('3');

    // Click Done
    await doneButton.click();
    await page.waitForTimeout(1000);

    // Verify we advanced to step 13 (improvement description)
    await expect(page.locator('text=Can you tell me more about these improvements?')).toBeVisible();
  });

  test('Interaction: None option bypasses multi-select', async ({ page }) => {
    // Navigate to improvements step (step 12)
    await page.click('text=✓ Yes, evaluate my property');
    await page.waitForTimeout(500);

    await page.click('text=123 Main Street, Detroit MI 48226');
    await page.waitForTimeout(500);

    for (let i = 0; i < 6; i++) {
      await page.click('text=✓ Correct');
      await page.waitForTimeout(500);
    }

    await page.click('text=6-10 years'); // HVAC
    await page.waitForTimeout(500);
    await page.click('text=6-10 years'); // Roof
    await page.waitForTimeout(500);
    await page.click('text=Fully Renovated'); // Kitchen
    await page.waitForTimeout(1000);

    // Now at step 12 - click "None"
    await page.click('text=None');
    await page.waitForTimeout(1000);

    // Should immediately advance to step 14 (photos), skipping step 13
    await expect(page.locator('text=Would you like to take **photos**')).toBeVisible();
  });

  test('Flow: Bold text renders correctly', async ({ page }) => {
    // Click through to a step with bold text
    await page.click('text=✓ Yes, evaluate my property');
    await page.waitForTimeout(1000);

    await page.click('text=123 Main Street, Detroit MI 48226');
    await page.waitForTimeout(1000);

    // Should see bold text for "Property Type:"
    const boldText = page.locator('strong:has-text("Property Type:")');
    await expect(boldText).toBeVisible();

    // Should NOT see literal asterisks
    await expect(page.locator('text=**Property Type:**')).not.toBeVisible();
  });

  test('Flow: Auto-advance works on calculating step', async ({ page }) => {
    // Fast-forward to photos step
    await page.click('text=✓ Yes, evaluate my property');
    await page.waitForTimeout(500);

    await page.click('text=789 Maple Drive, Grand Rapids MI 49503');
    await page.waitForTimeout(500);

    for (let i = 0; i < 6; i++) {
      await page.click('text=✓ Correct');
      await page.waitForTimeout(500);
    }

    await page.click('text=11-15 years'); // HVAC
    await page.waitForTimeout(500);
    await page.click('text=11-15 years'); // Roof
    await page.waitForTimeout(500);
    await page.click('text=Partially Updated'); // Kitchen
    await page.waitForTimeout(500);

    await page.click('text=None'); // No improvements
    await page.waitForTimeout(1000);

    // Click photos option
    await page.click('text=Skip photos');
    await page.waitForTimeout(500);

    // Should see "Calculating..." message
    await expect(page.locator('text=calculating')).toBeVisible({ timeout: 1000 });

    // Should auto-advance to valuation after 1.5-2 seconds
    await expect(page.locator('text=$285,000')).toBeVisible({ timeout: 3000 });
  });

  test('Cards: Valuation card renders with all data', async ({ page }) => {
    // Fast-forward to valuation
    await page.click('text=✓ Yes, evaluate my property');
    await page.waitForTimeout(500);

    await page.click('text=123 Main Street, Detroit MI 48226');
    await page.waitForTimeout(500);

    for (let i = 0; i < 6; i++) {
      await page.click('text=✓ Correct');
      await page.waitForTimeout(500);
    }

    await page.click('text=0-5 years'); // HVAC
    await page.waitForTimeout(500);
    await page.click('text=0-5 years'); // Roof
    await page.waitForTimeout(500);
    await page.click('text=Fully Renovated'); // Kitchen
    await page.waitForTimeout(500);

    await page.click('text=None'); // No improvements
    await page.waitForTimeout(500);

    await page.click('text=Skip photos');

    // Wait for auto-advance and valuation
    await page.waitForTimeout(2500);

    // Verify all card elements
    await expect(page.locator('text=$285,000')).toBeVisible();
    await expect(page.locator('text=$270,000')).toBeVisible();
    await expect(page.locator('text=$300,000')).toBeVisible();
    await expect(page.locator('text=92%')).toBeVisible();
    await expect(page.locator('text=1,800 sq ft')).toBeVisible();
    await expect(page.locator('text=3 bed')).toBeVisible();
    await expect(page.locator('text=2.5 bath')).toBeVisible();
    await expect(page.locator('text=$158')).toBeVisible(); // Price per sq ft

    // Verify action buttons
    await expect(page.locator('text=View Comparables')).toBeVisible();
    await expect(page.locator('text=View Recommendations')).toBeVisible();
    await expect(page.locator('text=Download PDF Report')).toBeVisible();
  });

  test('Performance: Complete flow in under 30 seconds', async ({ page }) => {
    const startTime = Date.now();

    // Complete full flow as fast as possible
    await page.click('text=✓ Yes, evaluate my property');
    await page.click('text=123 Main Street, Detroit MI 48226');

    for (let i = 0; i < 6; i++) {
      await page.click('text=✓ Correct');
    }

    await page.click('text=6-10 years'); // HVAC
    await page.click('text=6-10 years'); // Roof
    await page.click('text=Fully Renovated'); // Kitchen
    await page.click('text=None'); // No improvements
    await page.click('text=Skip photos');

    // Wait for valuation
    await expect(page.locator('text=$285,000')).toBeVisible({ timeout: 5000 });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(`Flow completed in ${duration.toFixed(1)} seconds`);
    expect(duration).toBeLessThan(30);
  });

  test('Console: No JavaScript errors during flow', async ({ page }) => {
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Complete quick flow
    await page.click('text=✓ Yes, evaluate my property');
    await page.waitForTimeout(500);

    await page.click('text=456 Oak Avenue, Ann Arbor MI 48103');
    await page.waitForTimeout(500);

    for (let i = 0; i < 6; i++) {
      await page.click('text=✓ Correct');
      await page.waitForTimeout(500);
    }

    await page.click('text=0-5 years');
    await page.waitForTimeout(500);
    await page.click('text=0-5 years');
    await page.waitForTimeout(500);
    await page.click('text=Original/Dated');
    await page.waitForTimeout(500);
    await page.click('text=None');
    await page.waitForTimeout(500);
    await page.click('text=Skip photos');

    // Wait for valuation
    await expect(page.locator('text=$285,000')).toBeVisible({ timeout: 5000 });

    // Check for errors
    expect(errors).toHaveLength(0);
  });

});
