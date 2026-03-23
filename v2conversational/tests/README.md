# 🧪 Playwright E2E Tests - Chip-Based Flow

**Date:** March 23, 2026
**Status:** Automated tests for fully chip-based conversation flow

---

## 📋 Tests Included

### Functional Tests

1. **Path A: Complete flow with improvements**
   - Tests full 18-step flow including improvement description
   - Verifies all steps execute correctly
   - Checks valuation card renders

2. **Path B: Quick flow without improvements**
   - Tests 16-step flow (skips improvement description)
   - Verifies "None" option bypasses multi-select
   - Confirms step 13 is skipped

### Visual Tests

3. **Chips have proper Nova styling**
   - Verifies 24px border radius
   - Checks 32px min-height
   - Validates 14px font size

### Interaction Tests

4. **Multi-select with Done button**
   - Tests selecting multiple improvements
   - Verifies Done button shows count
   - Confirms advancement to description step

5. **None option bypasses multi-select**
   - Tests "None" immediately advances
   - Verifies step 13 is skipped
   - Confirms photos step appears

6. **Bold text renders correctly**
   - Checks `<strong>` tags are used
   - Verifies no literal `**` asterisks
   - Validates markdown conversion

7. **Auto-advance works on calculating step**
   - Tests 1.5s delay
   - Verifies "Calculating..." message
   - Confirms automatic progression to valuation

8. **Valuation card renders with all data**
   - Checks all data fields present
   - Verifies action buttons visible
   - Validates formatting

### Performance Tests

9. **Complete flow in under 30 seconds**
   - Times full flow execution
   - Ensures fast user experience
   - Validates no blocking delays

10. **No JavaScript errors during flow**
    - Monitors console for errors
    - Checks for page errors
    - Validates clean execution

---

## 🚀 Running Tests

### Prerequisites

Make sure the server is running:
```bash
python -m http.server 8001
```

Or the Playwright config will start it automatically.

---

### Run All Tests

```bash
npm run test:e2e
```

**Output:**
```
Running 10 tests using 1 worker

✓  1 chip-flow.spec.js:7:3 › Path A: Complete flow with improvements (8s)
✓  2 chip-flow.spec.js:53:3 › Path B: Quick flow without improvements (6s)
✓  3 chip-flow.spec.js:95:3 › Visual: Chips have proper Nova styling (2s)
...
✓ 10 chip-flow.spec.js:380:3 › Console: No JavaScript errors during flow (5s)

10 passed (45s)
```

---

### Run with UI (Interactive)

```bash
npm run test:e2e:ui
```

Opens Playwright Test UI where you can:
- Run tests individually
- Watch tests execute in real-time
- Debug failures
- View screenshots/videos

---

### Run in Headed Mode (See Browser)

```bash
npm run test:e2e:headed
```

Runs tests with visible browser window to watch execution.

---

### Debug Tests

```bash
npm run test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging:
- Step through tests
- Inspect elements
- View console output
- Check network requests

---

### View Test Report

After running tests:
```bash
npm run test:e2e:report
```

Opens HTML report with:
- Test results
- Screenshots of failures
- Videos of failures
- Detailed execution logs

---

## 📊 Test Configuration

**File:** `playwright.config.js`

**Browsers Tested:**
- ✅ Chromium (Desktop Chrome)
- ⏸️ Firefox (commented out for speed)
- ⏸️ WebKit (Safari, commented out)
- ⏸️ Mobile Chrome
- ⏸️ Mobile Safari

**Settings:**
- Base URL: `http://localhost:8001`
- Retry failed tests: 0 times
- Workers: 1 (sequential execution)
- Screenshot: Only on failure
- Video: Retained on failure
- Trace: On first retry

---

## 🐛 Debugging Failed Tests

### 1. Check Console Output

Tests will show detailed error messages:
```
Error: locator.click: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for locator('text=✓ Yes, evaluate my property')
============================================================
```

### 2. View Screenshot

Failed tests auto-capture screenshots:
```
tests/playwright-report/
  screenshots/
    chip-flow-path-a-failure.png
```

### 3. Watch Video

Failed tests auto-record video:
```
tests/playwright-report/
  videos/
    chip-flow-path-a-retry1.webm
```

### 4. Check Trace

View detailed trace:
```bash
npx playwright show-trace tests/playwright-report/traces/trace.zip
```

---

## 🔧 Test Development

### Adding New Tests

1. Open `tests/chip-flow.spec.js`
2. Add new test:
```javascript
test('My new test', async ({ page }) => {
  // Test code here
});
```

### Running Single Test

```bash
npx playwright test --grep "Path A"
```

### Running Specific File

```bash
npx playwright test tests/chip-flow.spec.js
```

---

## ✅ Success Criteria

All tests should pass with:
- ✅ No JavaScript errors
- ✅ All steps execute in correct order
- ✅ Nova styling applied correctly
- ✅ Interactive elements work as expected
- ✅ Performance under 30 seconds
- ✅ Clean console output

---

## 📝 Test Maintenance

### When to Update Tests

- ✏️ **Flow changes**: Update step counts and triggers
- 🎨 **Styling changes**: Update visual assertions
- 📊 **Data changes**: Update expected values in cards
- 🔧 **Bug fixes**: Add regression tests

### Best Practices

1. **Keep tests independent** - Each test should run standalone
2. **Use descriptive names** - Clear test purposes
3. **Add timeouts** - Wait for async operations
4. **Check console** - Monitor for errors
5. **Screenshot failures** - Debug visual issues

---

## 🚦 CI/CD Integration

Tests can be run in CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: tests/playwright-report/
```

---

## 📚 Resources

- [Playwright Docs](https://playwright.dev)
- [Test API](https://playwright.dev/docs/api/class-test)
- [Locators](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)

---

**Status:** ✅ **10 TESTS READY**
**Run:** `npm run test:e2e`
**Debug:** `npm run test:e2e:debug`
**Report:** `npm run test:e2e:report`
