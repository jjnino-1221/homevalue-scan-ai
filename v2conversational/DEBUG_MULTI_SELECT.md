# 🐛 Debug Multi-Select Issue

**Issue:** Flow getting stuck at "what recent updates have you made" (step 12)

---

## Quick Debug

### 1. Open Console (F12)

### 2. Check Current State

Paste this in console:
```javascript
console.log('=== CURRENT STATE ===');
console.log('Step:', window.AIOrchestrator.getConversationState().step);
console.log('LastValue:', window.AIOrchestrator.getConversationState().lastValue);
console.log('Messages:', window.AIOrchestrator.getConversationState().messages.length);
```

---

## Test Scenarios

### Scenario A: After Clicking Improvements

1. Click "Kitchen Remodel" and "Bathroom Remodel"
2. **Check:** Does Done button appear?
3. **Check:** Does it say "Done (2 selected)"?

Run in console:
```javascript
const doneButton = document.querySelector('[data-is-done-button="true"]');
console.log('Done button exists:', !!doneButton);
console.log('Done button visible:', doneButton?.style.display !== 'none');
console.log('Done button text:', doneButton?.textContent);
```

4. Click "Done" button
5. **Check console for:**
```
DEBUG: Multi-select Done button clicked
  selectedValues: ['imp_kitchen', 'imp_bathroom']
DEBUG: Setting lastValue to: imp_kitchen,imp_bathroom
```

---

### Scenario B: After Clicking "None"

1. Click "None"
2. **Check console for:**
```
DEBUG: "None" clicked in multi-select, acting as single-select
DEBUG: Setting lastValue to: imp_none
```

3. Should immediately advance (no Done button needed)

---

## Expected Console Output

When clicking improvements + Done:
```
DEBUG: Multi-select Done button clicked
  selectedValues: ['imp_kitchen', 'imp_bathroom']
  selectedLabels: ['Kitchen Remodel', 'Bathroom Remodel']
DEBUG: Calling callback with: imp_kitchen,imp_bathroom Kitchen Remodel, Bathroom Remodel
Mock: User selected: imp_kitchen,imp_bathroom (display: Kitchen Remodel, Bathroom Remodel)
DEBUG: Setting lastValue to: imp_kitchen,imp_bathroom
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEBUG: getNextStep called
  currentStep: 12
  lastValue: imp_kitchen,imp_bathroom
  looking for step: 13
DEBUG: Multi-select value detected: imp_kitchen,imp_bathroom
DEBUG: Found matching step number: 13
  step.trigger: [...imp_kitchen, imp_bathroom, imp_roof, imp_hvac, imp_windows...]
  step.message preview: Great! Can you tell me more about these improvemen...
DEBUG: Step has "contains" trigger type
  Checking if lastValue contains any of: [...]
✅ DEBUG: Contains trigger MATCHED! Returning step 13
```

---

## If Not Working

### Check 1: Is Done Button Created?

Run in console:
```javascript
const chipGroup = document.querySelector('.chip-group');
const doneButton = chipGroup?.querySelector('[data-is-done-button]');
console.log('Chip group found:', !!chipGroup);
console.log('Done button exists:', !!doneButton);
console.log('All chips:', chipGroup?.querySelectorAll('.chip-button').length);
```

### Check 2: Are Chips Selectable?

Run in console:
```javascript
const chips = document.querySelectorAll('.chip-button');
chips.forEach((chip, i) => {
  console.log(`Chip ${i}: ${chip.textContent.trim()}`);
  console.log(`  value: ${chip.dataset.value}`);
  console.log(`  selected: ${chip.classList.contains('selected')}`);
});
```

### Check 3: Manual Trigger Test

After selections, manually test the flow:
```javascript
// Simulate Done button click
window.AIOrchestrator.sendMessageWithDisplay('imp_kitchen,imp_bathroom', 'Kitchen Remodel, Bathroom Remodel');
```

Should advance to step 13.

### Check 4: Manual "None" Test

```javascript
window.AIOrchestrator.sendMessageWithDisplay('imp_none', 'None');
```

Should advance to step 14 (photos).

---

## Common Issues

### Issue 1: Done Button Not Appearing

**Symptom:** Chips are clickable but no Done button shows

**Fix:** Check if multiSelect flag is set
```javascript
// Should see multiSelect: true in step 12
console.log(window.AIOrchestrator.getConversationState());
```

### Issue 2: Done Button Not Clickable

**Symptom:** Done button exists but clicking does nothing

**Check:** Browser console for errors when clicking

### Issue 3: Trigger Not Matching

**Symptom:** Done button works but step doesn't advance

**Debug:**
```javascript
// Check what step is expected
const state = window.AIOrchestrator.getConversationState();
console.log('Current step:', state.step);
console.log('LastValue:', state.lastValue);

// Manually check trigger matching
const lastValue = state.lastValue;
const triggers = ['imp_kitchen', 'imp_bathroom', 'imp_roof', 'imp_hvac', 'imp_windows'];
const matched = triggers.some(t => lastValue.includes(t));
console.log('Should match step 13:', matched);
```

---

## Quick Fix Test

If stuck at step 12, manually advance:

```javascript
// Force advance to step 13
window.AIOrchestrator.sendMessageWithDisplay('imp_kitchen', 'Kitchen Remodel');
```

Then check if step 13 appears.

---

## Report Back

Please run the checks above and tell me:

1. **Does Done button appear?** (Yes/No)
2. **What console logs do you see?** (Copy/paste)
3. **What happens when you click Done?** (Describe)
4. **What is the lastValue?** (From console check)

This will help me identify the exact issue!
