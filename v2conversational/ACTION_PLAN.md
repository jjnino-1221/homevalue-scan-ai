# V2 Conversational - Prioritized Action Plan
**Date:** 2026-03-20
**Status:** 🚨 Application Non-Functional - Requires Immediate Attention

---

## Quick Summary

**What's Wrong:**
- Chat interface loads but conversation doesn't start
- Welcome message with "Yes/No" buttons never appears
- User cannot proceed with valuation flow
- RDS compliance not fully verified

**Why:**
- Module initialization failing (AI Orchestrator, Chat Interface)
- Integration between server-enhanced-v2.js and client UI incomplete
- Export/import issues causing silent failures

**What We Need:**
1. Fix module loading (2-4 hours)
2. Complete integration (4-6 hours)
3. Verify RDS compliance (need Nova Figma access)
4. End-to-end testing (4-6 hours)

---

## Phase 1: Debug & Fix (CRITICAL - Do This First)

### Task 1.1: Identify Module Loading Failure ⏱️ 30 min
**Goal:** Find out which JavaScript module is failing to load

**Steps:**
```bash
# 1. Open browser to chat interface
# http://localhost:8001/chat.html

# 2. Open DevTools (F12) → Console tab

# 3. Look for RED errors

# 4. Type these commands to test:
window.AIOrchestrator
window.ChatInterface
window.ResultCards
window.InteractiveUI
```

**Expected Output:**
- Each should show an object or `undefined`
- If `undefined`, that module failed to load

**Document findings in:** `DEBUG_LOG.md`

---

### Task 1.2: Fix Export/Import Issues ⏱️ 1-2 hours
**Goal:** Ensure all modules export and import correctly

**Files to Check:**

1. **`js/ai-orchestrator.js`** - Check bottom of file:
   ```javascript
   // Should have:
   export default AIOrchestrator;
   // OR
   export { AIOrchestrator };
   ```

2. **`js/chat-interface.js`** - Check exports:
   ```javascript
   // Should have:
   export { ChatInterface };
   // OR
   export default ChatInterface;
   ```

3. **`js/app.js`** - Check imports match exports:
   ```javascript
   // If file has: export { ChatInterface };
   // Then use: import { ChatInterface } from './chat-interface.js';

   // If file has: export default ChatInterface;
   // Then use: import ChatInterface from './chat-interface.js';
   ```

**Action:** Make imports match exports across all 10 JS modules

---

### Task 1.3: Add Error Handling ⏱️ 30 min
**Goal:** Stop silent failures and show errors to developer

**Update `js/app.js`:**
```javascript
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Rocket Valuation V2 - Initializing...');

  try {
    // Check dependencies
    if (typeof window.AIOrchestrator === 'undefined') {
      throw new Error('AIOrchestrator module failed to load');
    }
    if (typeof ChatInterface === 'undefined') {
      throw new Error('ChatInterface module failed to load');
    }

    // Rest of initialization...
    const recentConversation = window.AIOrchestrator.checkForResumeConversation();

    if (recentConversation) {
      console.log('Found recent conversation:', recentConversation.id);
      showResumeBanner(recentConversation);
    } else {
      showWelcomeMessage();
    }

    setupEventListeners();

  } catch (error) {
    console.error('❌ INITIALIZATION FAILED:', error);
    alert(`Application failed to start: ${error.message}\n\nCheck browser console for details.`);
  }
});
```

---

### Task 1.4: Test API Endpoint Manually ⏱️ 10 min
**Goal:** Verify server is responding correctly

```bash
# Test 1: Health check
curl http://localhost:3001/health

# Expected:
# {"status":"ok","mode":"mock","timestamp":"2026-03-20T..."}

# Test 2: Chat endpoint
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":""}]}'

# Expected:
# data: {"type":"text","text":"Welcome to Rocket Valuation!"}
# data: {"type":"ui_pattern","data":{...}}
# data: [DONE]
```

**Document results in:** `DEBUG_LOG.md`

---

### Task 1.5: Enable Network Logging ⏱️ 10 min
**Goal:** See if client is calling API

**Browser DevTools:**
1. Open F12 → Network tab
2. Reload `http://localhost:8001/chat.html`
3. Look for request to `http://localhost:3001/api/chat`

**Possible Results:**
- ✅ Request made, status 200 → Server works, client handling broken
- ❌ No request → Client not calling API at all
- 🚫 Request made, status 400/500 → Server error

---

## Phase 2: Integration (HIGH PRIORITY - After Phase 1)

### Task 2.1: Complete Integration Steps ⏱️ 2-3 hours
**Goal:** Connect server-enhanced-v2.js to client UI

**Follow:** `IMPLEMENTATION_STATUS.md` Steps 1-5

**Step 1: Update `server.js`** (Already done ✅)
```javascript
const { generateComprehensiveResponse, getSession } = require('./server-enhanced-v2');
```

**Step 2: Update `js/chat-interface.js`** (Needs verification)
- Add `appendResultCard()` method
- Export `ChatInterface` object with new method

**Step 3: Update `js/ai-orchestrator.js`** (Needs verification)
- Handle `ui_pattern` with type `valuation_result_card`
- Handle `ui_pattern` with type `comparables_cards`
- Handle `ui_pattern` with type `recommendations_cards`

**Step 4: Update `index.html` or `chat.html`** (Needs verification)
- Ensure `result-cards.js` script is loaded
- Check load order (must be before `ai-orchestrator.js`)

**Verification:**
```javascript
// In browser console after fix:
window.ChatInterface.appendResultCard
// Should show: function
```

---

### Task 2.2: Test Welcome Message Flow ⏱️ 30 min
**Goal:** Get "Yes/No" buttons to appear

**Manual Test:**
1. Clear browser cache (Ctrl+Shift+R)
2. Open `http://localhost:8001/chat.html`
3. Check console for: `"Showing welcome message"`
4. **SHOULD SEE:**
   - Welcome message from AI
   - Two buttons: "✓ Yes, evaluate my property" / "No thanks"

**If Still Broken:**
- Add console.log in `showWelcomeMessage()` function
- Add console.log in `AIOrchestrator.sendMessage()`
- Add console.log in server `/api/chat` endpoint
- Follow the data flow to find break point

---

### Task 2.3: Test First 5 Steps ⏱️ 1 hour
**Goal:** Complete partial flow test

**Manual Test Flow:**
1. Click "Yes, evaluate"
2. Enter address: "123 Main St, Detroit, MI"
3. Confirm property type
4. Confirm year built
5. Confirm square footage

**Expected Result:**
- Each step should trigger new AI message
- Buttons should render for confirmations
- Progress should advance

**Document:** Number of steps completed before failure

---

## Phase 3: RDS Compliance (MEDIUM PRIORITY - After Flow Works)

### Task 3.1: Get Nova Design System Access ⏱️ 1-2 days
**Goal:** Access official Rocket design specifications

**Required Access:**
- [ ] Nova Foundations Figma (design tokens)
- [ ] Nova UI Kit Figma (component specs)
- [ ] Nova Illustration Kit Figma (optional)

**Who to Contact:**
- Rocket Design Team lead
- UX team for Figma permissions

**What to Extract:**
- Color palette (hex values for red-50 through red-900)
- Typography scale (font sizes, weights, line heights)
- Spacing scale (official token names)
- Elevation (shadow) values
- Component specifications (buttons, cards, chips)

---

### Task 3.2: Create Nova Tokens File ⏱️ 2 hours
**Goal:** Replace hardcoded values with official tokens

**Create:** `css/nova-tokens.css`

```css
/* Nova Foundations - Design Tokens */
:root {
  /* Colors - Primary */
  --nova-red-50: #FEE8F4;
  --nova-red-500: #DE3341;  /* Primary red */
  --nova-red-900: #590213;  /* Dark red */

  /* Colors - Neutral */
  --nova-gray-50: #F3EEE7;  /* Putty */
  --nova-gray-900: #111111;  /* Black */

  /* Spacing */
  --nova-spacing-xs: 4px;
  --nova-spacing-sm: 8px;
  --nova-spacing-md: 16px;
  --nova-spacing-lg: 24px;
  --nova-spacing-xl: 32px;

  /* Typography */
  --nova-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --nova-font-size-xs: 12px;
  --nova-font-size-sm: 14px;
  --nova-font-size-md: 16px;
  --nova-font-size-lg: 20px;
  --nova-font-size-xl: 24px;

  /* Elevation (Shadows) */
  --nova-elevation-1: 0 1px 2px rgba(0,0,0,0.05);
  --nova-elevation-2: 0 2px 4px rgba(0,0,0,0.06);
  --nova-elevation-3: 0 4px 8px rgba(0,0,0,0.08);

  /* Border Radius */
  --nova-radius-sm: 4px;
  --nova-radius-md: 8px;
  --nova-radius-lg: 16px;
}
```

**Load in HTML:**
```html
<link rel="stylesheet" href="css/nova-tokens.css">
<link rel="stylesheet" href="css/chat.css">
```

---

### Task 3.3: Update Components to Use Tokens ⏱️ 4-6 hours
**Goal:** Replace all hardcoded values

**Files to Update:**

1. **`index.html`** - Landing page:
   ```css
   /* BEFORE */
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

   /* AFTER */
   background: var(--nova-gray-50);  /* or white */
   ```

2. **`css/chat.css`** - All components:
   ```css
   /* BEFORE */
   .rkt-Button--primary {
     background: #DE3341;
     padding: 12px 24px;
     border-radius: 4px;
   }

   /* AFTER */
   .rkt-Button--primary {
     background: var(--nova-red-500);
     padding: var(--nova-spacing-md) var(--nova-spacing-lg);
     border-radius: var(--nova-radius-sm);
   }
   ```

3. **`js/result-cards.js`** - Inline styles:
   ```javascript
   // BEFORE
   card.style.borderRadius = '8px';

   // AFTER
   card.style.borderRadius = 'var(--nova-radius-md)';
   ```

---

### Task 3.4: Visual Comparison ⏱️ 1 hour
**Goal:** Match Nova designs exactly

**Method:**
1. Take screenshot of current implementation
2. Take screenshot of Nova Figma design
3. Overlay in Photoshop/Figma to compare
4. Identify differences (spacing, colors, sizes)
5. Fix discrepancies

**Check:**
- Button padding exact
- Card shadows exact
- Text sizes exact
- Colors exact
- Border radii exact

---

## Phase 4: Testing & Validation (LOW PRIORITY - Final Polish)

### Task 4.1: Create Full Playwright Test ⏱️ 2-3 hours
**Goal:** Automated test covering entire flow

**Update:** `tests/comprehensive-flow.spec.js`

```javascript
test('Complete 15-step valuation flow', async ({ page }) => {
  // 1. Load chat
  await page.goto('http://localhost:8001/chat.html');

  // 2. Click "Yes"
  await page.click('button:has-text("Yes")');

  // 3. Enter address
  await page.fill('.chat-input', '123 Main St');
  await page.press('.chat-input', 'Enter');

  // 4-18. Continue through all 15 steps...
  // (Verify property type, year, sqft, beds, baths, etc.)

  // 19. Verify valuation card appears
  await expect(page.locator('.rkt-Card--valuation')).toBeVisible();

  // 20. Click comparables
  await page.click('button:has-text("View Comparables")');

  // 21. Verify 3 comp cards
  const compCards = await page.locator('.rkt-Card--comparable').count();
  expect(compCards).toBe(3);

  // 22. Click recommendations
  await page.click('button:has-text("View Recommendations")');

  // 23. Verify 5 recommendation cards
  const recCards = await page.locator('.rkt-Card--recommendation').count();
  expect(recCards).toBe(5);
});
```

---

### Task 4.2: Accessibility Audit ⏱️ 2 hours
**Goal:** Ensure WCAG 2.1 AA compliance

**Tools:**
- Chrome Lighthouse (F12 → Lighthouse tab)
- axe DevTools extension
- Keyboard navigation testing

**Check:**
- [ ] All buttons have aria-labels
- [ ] Color contrast ratio >= 4.5:1
- [ ] Can tab through all interactive elements
- [ ] Screen reader announces everything correctly
- [ ] No keyboard traps

---

### Task 4.3: Mobile Responsive Testing ⏱️ 1 hour
**Goal:** Works on phones and tablets

**Test Breakpoints:**
- 375px (iPhone SE)
- 768px (iPad)
- 1024px (iPad Pro)
- 1440px (Desktop)

**Check:**
- [ ] Buttons don't overflow
- [ ] Cards stack properly
- [ ] Text is readable
- [ ] Touch targets >= 44px

---

## Phase 5: Documentation & Handoff (FINAL)

### Task 5.1: Update README ⏱️ 30 min
**Goal:** Accurate setup instructions

**Update:** `README.md`
- Correct server start commands
- Correct URLs (chat.html vs index.html)
- Troubleshooting section
- Screenshot of working app

---

### Task 5.2: Record Demo Video ⏱️ 1 hour
**Goal:** Show complete flow working

**Record:**
1. Landing page
2. Starting conversation
3. Going through all 15 steps
4. Seeing results
5. Viewing comparables
6. Viewing recommendations
7. Downloading PDF (if working)

**Tool:** OBS Studio, Loom, or Windows Game Bar

---

### Task 5.3: Create Handoff Document ⏱️ 1 hour
**Goal:** Transfer knowledge to next developer

**Document:**
- Architecture overview
- File structure explanation
- How conversation flow works
- How to add new steps
- How to modify UI patterns
- Common troubleshooting

---

## Time Estimates by Phase

| Phase | Tasks | Time Estimate | Priority |
|-------|-------|--------------|----------|
| Phase 1: Debug & Fix | 5 tasks | 3-5 hours | P0 (Critical) |
| Phase 2: Integration | 3 tasks | 4-6 hours | P1 (High) |
| Phase 3: RDS Compliance | 4 tasks | 8-12 hours | P2 (Medium) |
| Phase 4: Testing | 3 tasks | 5-7 hours | P3 (Low) |
| Phase 5: Documentation | 3 tasks | 2-3 hours | P3 (Low) |

**Total Estimated Time:** 22-33 hours

---

## Success Checkpoints

### ✅ Checkpoint 1: Basic Flow Works
- Chat loads without errors
- Welcome message appears
- Can click Yes and proceed
- **ETA:** After Phase 1 (3-5 hours)

### ✅ Checkpoint 2: Full Flow Accessible
- All 15 steps work
- Result cards display
- Comparables and recommendations show
- **ETA:** After Phase 2 (7-11 hours)

### ✅ Checkpoint 3: RDS Compliant
- All colors match Nova
- All components match specs
- No off-brand styling
- **ETA:** After Phase 3 (15-23 hours)

### ✅ Checkpoint 4: Production Ready
- Tests pass
- No console errors
- Accessible and responsive
- Documentation complete
- **ETA:** After Phases 4-5 (22-33 hours)

---

## Decision Points

### Decision 1: Single HTML File or Two?
**Options:**
- A) Keep `index.html` + `chat.html` separate
- B) Merge into single `index.html` with chat interface

**Recommendation:** Option B (merge)
**Reason:** Simpler, fewer redirects, easier to test

---

### Decision 2: Real API or Mock Mode?
**Current:** Mock mode enabled
**Options:**
- A) Keep mock mode for development
- B) Switch to real Claude API

**Recommendation:** Option A for now
**Reason:** Free, fast testing. Switch to real later.

---

### Decision 3: Full RDS Compliance or Partial?
**Options:**
- A) Match Nova 100% (requires Figma access)
- B) Use approximations (current state)

**Recommendation:** Option A (wait for Figma access)
**Reason:** Brand consistency important for Rocket

---

## Risk Mitigation

### Risk: Phase 1 Takes Longer Than Expected
**Mitigation:** Timebox to 6 hours max, then escalate for help

### Risk: Can't Get Nova Figma Access
**Mitigation:** Use approximations from `RDS-ALIGNMENT.md`, document for future

### Risk: Integration More Complex Than Expected
**Mitigation:** Consider simplifying flow (fewer steps) as MVP

---

## Next Immediate Action

**RIGHT NOW - Do This First:**

```bash
# 1. Open chat.html in browser
start http://localhost:8001/chat.html

# 2. Open DevTools Console (F12)

# 3. Look for errors (red text)

# 4. Take screenshot of console

# 5. Report back with findings
```

This will tell us exactly where to start debugging.

---

**Document Owner:** Development Team
**Last Updated:** 2026-03-20
**Status:** Ready for Execution
