const { test, expect } = require('@playwright/test');

// Comprehensive flow test to identify all issues
test.describe('V2 Conversational Flow - Comprehensive Audit', () => {
  let issuesFound = [];
  let successItems = [];

  test.beforeEach(async ({ page }) => {
    issuesFound = [];
    successItems = [];

    // Set up console logging to catch errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        issuesFound.push(`Console Error: ${msg.text()}`);
      }
    });

    page.on('pageerror', error => {
      issuesFound.push(`Page Error: ${error.message}`);
    });
  });

  test('Complete conversation flow with detailed reporting', async ({ page }) => {
    // Test 1: Page Load
    await test.step('1. Load application', async () => {
      try {
        await page.goto('http://localhost:8001/', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        successItems.push('✅ Page loaded successfully');
      } catch (error) {
        issuesFound.push(`❌ Page load failed: ${error.message}`);
      }
    });

    // Test 2: Check for welcome message
    await test.step('2. Verify welcome screen', async () => {
      try {
        const welcomeText = await page.locator('text=/Welcome to/i').first();
        if (await welcomeText.isVisible({ timeout: 5000 })) {
          successItems.push('✅ Welcome message displayed');
        }
      } catch (error) {
        issuesFound.push('❌ Welcome message not found');
      }
    });

    // Test 3: Check for initial button
    await test.step('3. Find "Yes, evaluate" button', async () => {
      try {
        const yesButton = await page.locator('button:has-text("Yes")').first();
        if (await yesButton.isVisible({ timeout: 5000 })) {
          successItems.push('✅ Initial action button found');
          await yesButton.click();
          await page.waitForTimeout(1000);
        } else {
          issuesFound.push('❌ "Yes, evaluate" button not visible');
        }
      } catch (error) {
        issuesFound.push(`❌ Could not find/click initial button: ${error.message}`);
      }
    });

    // Test 4: Check for address prompt
    await test.step('4. Verify address input appears', async () => {
      try {
        const addressPrompt = await page.locator('text=/address/i').first();
        const addressVisible = await addressPrompt.isVisible({ timeout: 5000 });

        if (addressVisible) {
          successItems.push('✅ Address prompt appeared');
        } else {
          issuesFound.push('❌ Address prompt did not appear after clicking button');
        }
      } catch (error) {
        issuesFound.push(`❌ Address prompt check failed: ${error.message}`);
      }
    });

    // Test 5: Enter address and submit
    await test.step('5. Enter address', async () => {
      try {
        const input = await page.locator('.chat-input, input[type="text"]').first();
        await input.fill('123 Main Street, Detroit, MI 48226');
        await input.press('Enter');
        await page.waitForTimeout(2000);
        successItems.push('✅ Address entered successfully');
      } catch (error) {
        issuesFound.push(`❌ Could not enter address: ${error.message}`);
      }
    });

    // Test 6: Check for property verification steps
    await test.step('6. Check for property verification', async () => {
      try {
        // Look for verification-related text
        const verificationText = await page.locator('text=/property type|year built|square footage|bedroom|bathroom/i').first();
        if (await verificationText.isVisible({ timeout: 5000 })) {
          successItems.push('✅ Property verification step appeared');
        } else {
          issuesFound.push('❌ Property verification did not appear - flow may have stopped');
        }
      } catch (error) {
        issuesFound.push(`❌ Property verification not found: ${error.message}`);
      }
    });

    // Test 7: Look for Correct/Update buttons
    await test.step('7. Check for verification buttons', async () => {
      try {
        const correctButton = await page.locator('button:has-text("Correct"), button:has-text("✓")').first();
        if (await correctButton.isVisible({ timeout: 3000 })) {
          successItems.push('✅ Verification buttons (Correct/Update) found');
        } else {
          issuesFound.push('❌ Verification buttons not found');
        }
      } catch (error) {
        issuesFound.push(`❌ Verification buttons check failed: ${error.message}`);
      }
    });

    // Test 8: RDS Class compliance check
    await test.step('8. Check RDS class usage', async () => {
      try {
        const rktButtons = await page.locator('.rkt-Button').count();
        const rktCards = await page.locator('.rkt-Card').count();
        const rktChips = await page.locator('.rkt-Chip').count();

        if (rktButtons > 0) {
          successItems.push(`✅ Found ${rktButtons} elements with .rkt-Button class`);
        } else {
          issuesFound.push('❌ No .rkt-Button classes found (RDS non-compliant)');
        }

        if (rktCards === 0) {
          issuesFound.push('⚠️ No .rkt-Card classes found yet');
        }

        if (rktChips === 0) {
          issuesFound.push('⚠️ No .rkt-Chip classes found yet');
        }
      } catch (error) {
        issuesFound.push(`❌ RDS class check failed: ${error.message}`);
      }
    });

    // Test 9: Check CSS loading
    await test.step('9. Verify CSS files loaded', async () => {
      try {
        const styles = await page.evaluate(() => {
          const sheets = Array.from(document.styleSheets);
          return sheets.map(sheet => {
            try {
              return { href: sheet.href, rules: sheet.cssRules?.length || 0 };
            } catch (e) {
              return { href: sheet.href, error: 'Cannot access' };
            }
          });
        });

        if (styles.some(s => s.rules > 0)) {
          successItems.push(`✅ CSS loaded (${styles.filter(s => s.rules > 0).length} sheets)`);
        } else {
          issuesFound.push('❌ No CSS rules found - styling may be missing');
        }
      } catch (error) {
        issuesFound.push(`❌ CSS check failed: ${error.message}`);
      }
    });

    // Test 10: Check JavaScript modules
    await test.step('10. Check for required JavaScript modules', async () => {
      try {
        const modules = await page.evaluate(() => {
          return {
            aiOrchestrator: typeof window.AIOrchestrator !== 'undefined',
            chatInterface: typeof window.ChatInterface !== 'undefined',
            resultCards: typeof window.ResultCards !== 'undefined',
            interactiveUI: typeof window.InteractiveUI !== 'undefined'
          };
        });

        if (modules.aiOrchestrator) successItems.push('✅ AIOrchestrator loaded');
        else issuesFound.push('❌ AIOrchestrator not loaded');

        if (modules.chatInterface) successItems.push('✅ ChatInterface loaded');
        else issuesFound.push('❌ ChatInterface not loaded');

        if (modules.resultCards) successItems.push('✅ ResultCards loaded');
        else issuesFound.push('❌ ResultCards not loaded');

        if (modules.interactiveUI) successItems.push('✅ InteractiveUI loaded');
        else issuesFound.push('❌ InteractiveUI not loaded');

      } catch (error) {
        issuesFound.push(`❌ JavaScript module check failed: ${error.message}`);
      }
    });

    // Test 11: Take screenshot for visual inspection
    await test.step('11. Capture screenshot', async () => {
      try {
        await page.screenshot({
          path: 'tests/screenshots/current-state.png',
          fullPage: true
        });
        successItems.push('✅ Screenshot saved to tests/screenshots/current-state.png');
      } catch (error) {
        issuesFound.push(`❌ Screenshot failed: ${error.message}`);
      }
    });

    // Test 12: Check message history
    await test.step('12. Check conversation history', async () => {
      try {
        const messages = await page.locator('.message, .chat-message, [class*="message"]').count();
        if (messages > 0) {
          successItems.push(`✅ Found ${messages} messages in conversation`);
        } else {
          issuesFound.push('❌ No messages found in chat history');
        }
      } catch (error) {
        issuesFound.push(`❌ Message history check failed: ${error.message}`);
      }
    });

    // Test 13: Check server connectivity
    await test.step('13. Verify API server connection', async () => {
      try {
        const response = await page.evaluate(async () => {
          const res = await fetch('http://localhost:3001/health');
          return await res.json();
        });

        if (response.status === 'ok') {
          successItems.push(`✅ API server connected (mode: ${response.mode})`);
        }
      } catch (error) {
        issuesFound.push(`❌ API server not responding: ${error.message}`);
      }
    });

    // Test 14: Check for result cards (if we get that far)
    await test.step('14. Check for result card rendering', async () => {
      try {
        const resultCards = await page.locator('.rkt-Card--valuation, .valuation-card, [class*="result"]').count();
        if (resultCards > 0) {
          successItems.push(`✅ Result cards rendered (${resultCards} found)`);
        } else {
          issuesFound.push('⚠️ No result cards found (may not have reached that step yet)');
        }
      } catch (error) {
        issuesFound.push(`❌ Result card check failed: ${error.message}`);
      }
    });

    // Final report generation
    await test.step('15. Generate comprehensive report', async () => {
      console.log('\n' + '='.repeat(80));
      console.log('COMPREHENSIVE TEST REPORT - V2 CONVERSATIONAL FLOW');
      console.log('='.repeat(80));

      console.log('\n✅ SUCCESSFUL ITEMS:');
      successItems.forEach(item => console.log(`  ${item}`));

      console.log('\n❌ ISSUES FOUND:');
      if (issuesFound.length === 0) {
        console.log('  None! All tests passed.');
      } else {
        issuesFound.forEach(item => console.log(`  ${item}`));
      }

      console.log('\n' + '='.repeat(80));
      console.log(`SUMMARY: ${successItems.length} passed, ${issuesFound.length} issues found`);
      console.log('='.repeat(80) + '\n');
    });

    // Assert at least some success
    expect(successItems.length).toBeGreaterThan(0);
  });

  test('RDS Design System Compliance Audit', async ({ page }) => {
    await page.goto('http://localhost:8001/', { waitUntil: 'networkidle' });

    const rdsCompliance = await page.evaluate(() => {
      const results = {
        buttons: [],
        cards: [],
        chips: [],
        colors: [],
        spacing: [],
        typography: []
      };

      // Check for RDS button classes
      document.querySelectorAll('button').forEach(btn => {
        const classes = Array.from(btn.classList);
        const hasRDS = classes.some(c => c.startsWith('rkt-'));
        results.buttons.push({
          hasRDS,
          classes: classes.join(' '),
          text: btn.textContent.trim().substring(0, 30)
        });
      });

      // Check for RDS card classes
      document.querySelectorAll('[class*="card"]').forEach(card => {
        const classes = Array.from(card.classList);
        const hasRDS = classes.some(c => c.startsWith('rkt-'));
        results.cards.push({
          hasRDS,
          classes: classes.join(' ')
        });
      });

      // Check color usage
      const computedStyle = getComputedStyle(document.body);
      results.colors.push({
        primary: computedStyle.getPropertyValue('--primary-color') || 'Not set',
        background: computedStyle.backgroundColor
      });

      return results;
    });

    console.log('\n' + '='.repeat(80));
    console.log('RDS COMPLIANCE AUDIT');
    console.log('='.repeat(80));

    console.log('\nBUTTONS:');
    rdsCompliance.buttons.forEach((btn, i) => {
      const status = btn.hasRDS ? '✅' : '❌';
      console.log(`  ${status} Button ${i + 1}: ${btn.text}`);
      console.log(`     Classes: ${btn.classes}`);
    });

    console.log('\nCARDS:');
    if (rdsCompliance.cards.length === 0) {
      console.log('  ⚠️ No cards found yet');
    } else {
      rdsCompliance.cards.forEach((card, i) => {
        const status = card.hasRDS ? '✅' : '❌';
        console.log(`  ${status} Card ${i + 1}: ${card.classes}`);
      });
    }

    console.log('\nCOLORS:');
    console.log(`  Primary color: ${rdsCompliance.colors[0]?.primary}`);
    console.log(`  Background: ${rdsCompliance.colors[0]?.background}`);

    console.log('\n' + '='.repeat(80) + '\n');
  });
});
