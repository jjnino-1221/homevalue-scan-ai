# 🎭 Mock Mode Enabled - Focus on UX

**Date:** 2026-03-20
**Status:** Using simplified mock orchestrator for rapid UX iteration

---

## Why Mock Mode?

Instead of debugging complex dependencies (AIOrchestrator → V1Engines → etc), we're using a **simple mock version** that:

✅ **No external dependencies** - Pure client-side
✅ **Fast iteration** - Change flow instantly
✅ **Focus on UX** - Perfect the conversation experience first
✅ **Works immediately** - No API, no complex setup

---

## What's Different?

### File: `chat.html`
**Changed:** Uses `mock-orchestrator.js` instead of `ai-orchestrator.js`

```html
<!-- BEFORE -->
<script type="module" src="js/ai-orchestrator.js"></script>

<!-- NOW -->
<script type="module" src="js/mock-orchestrator.js"></script>
```

### File: `js/mock-orchestrator.js` (NEW)
**Simple conversation engine** with:
- 9 predefined conversation steps
- Mock property data
- Mock valuation results
- Mock comparables
- Mock recommendations
- No API calls, no server needed

---

## 🎯 Test It Now!

**Open:** `http://localhost:8001/chat.html`

**Expected Flow:**
1. ✅ Welcome message appears
2. ✅ "Yes, evaluate" button works
3. ✅ Enter address (any text)
4. ✅ Confirm property type
5. ✅ Confirm year built
6. ✅ Confirm square footage
7. ✅ See valuation card with $285,000 estimate
8. ✅ Click "View Comparables" → See 3 property cards
9. ✅ Click "View Recommendations" → See 5 recommendation cards

---

## 🔧 How to Customize the Flow

### Edit Conversation Steps

Open: `js/mock-orchestrator.js`

Find `CONVERSATION_STEPS` array (line ~15):

```javascript
const CONVERSATION_STEPS = [
  {
    step: 1,
    message: "Welcome to Rocket Valuation! ...",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '✓ Yes, evaluate', value: 'yes_evaluate' },
        { label: 'No thanks', value: 'no_evaluate' }
      ]
    }
  },
  // ... add more steps
];
```

### Add a New Step

```javascript
{
  step: 10,
  trigger: 'some_button_value',  // Optional - only show if user clicked this
  message: "Your custom message here",
  uiPattern: {
    type: 'chips',  // or 'category_tiles', 'slider', etc.
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' }
    ]
  }
}
```

### Change Mock Data

Update valuation results (step 7):
```javascript
resultCard: {
  type: 'valuation_result_card',
  data: {
    estimate: 285000,        // Change to any value
    rangeLow: 270000,
    rangeHigh: 300000,
    confidence: 92,          // 0-100
    // ... customize all values
  }
}
```

---

## 🎨 UI Patterns Available

### 1. Chips (Quick Select Buttons)
```javascript
uiPattern: {
  type: 'chips',
  options: [
    { label: 'Button Text', value: 'button_value' }
  ]
}
```

### 2. Category Tiles (Grid)
```javascript
uiPattern: {
  type: 'category_tiles',
  options: [
    { label: 'Tile Name', value: 'tile_value', icon: '🏠' }
  ]
}
```

### 3. Multi-Select
```javascript
uiPattern: {
  type: 'chips',
  multiSelect: true,
  options: [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' }
  ]
}
```

### 4. Free Text Input
```javascript
uiPattern: null  // User can type freely
```

---

## 🚀 Benefits of Mock Mode

### For Development:
- ✅ No API setup needed
- ✅ No server dependencies
- ✅ Instant feedback on changes
- ✅ Easy to test edge cases

### For UX Design:
- ✅ Perfect the conversation flow
- ✅ Test different phrasings
- ✅ Try different button labels
- ✅ Iterate on result card designs

### For Testing:
- ✅ Consistent, predictable responses
- ✅ Test all paths easily
- ✅ No rate limits or API costs
- ✅ Works offline

---

## 🔄 Switching Back to Real Mode

When ready to connect to real API:

### Step 1: Edit `chat.html`
```html
<!-- Uncomment real orchestrator -->
<script type="module" src="js/ai-orchestrator.js"></script>

<!-- Comment out mock -->
<!-- <script type="module" src="js/mock-orchestrator.js"></script> -->
```

### Step 2: Fix AIOrchestrator Dependencies
The real `ai-orchestrator.js` needs:
- Working V1Engines integration
- Proper error handling
- API connection

---

## 📝 Next Steps

### Immediate (While in Mock Mode):
1. ✅ Test the 7-step flow
2. ✅ Perfect the conversation phrasing
3. ✅ Test result card designs
4. ✅ Adjust button labels
5. ✅ Try different UI patterns

### Phase 2 (Enhance Mock):
- [ ] Add more verification steps (expand to 15)
- [ ] Add photo capture step (mock)
- [ ] Add "Update" flows (when user clicks "Update" instead of "Correct")
- [ ] Add error states
- [ ] Add "Start Over" functionality

### Phase 3 (Connect Real API):
- [ ] Fix AIOrchestrator dependencies
- [ ] Connect to server-enhanced-v2.js
- [ ] Test with real streaming responses
- [ ] Handle API errors gracefully

---

## 🐛 Troubleshooting

### Issue: "AIOrchestrator is not defined"
**Solution:** Reload page (Ctrl+Shift+R) - mock-orchestrator.js should define it

### Issue: "Buttons don't work"
**Solution:** Check console for errors. Ensure ChatInterface loaded.

### Issue: "Want to add more steps"
**Solution:** Edit `CONVERSATION_STEPS` array in `mock-orchestrator.js`

### Issue: "Want different valuation data"
**Solution:** Edit step 7's `resultCard.data` object

---

## 📊 Current Flow Map

```
Step 1: Welcome → [Yes/No buttons]
    ↓ (if Yes)
Step 2: Enter address → [Free text input]
    ↓
Step 3: Confirm property type → [Correct/Update]
    ↓ (if Correct)
Step 4: Confirm year built → [Correct/Update]
    ↓ (if Correct)
Step 5: Confirm square footage → [Correct/Update]
    ↓ (if Correct)
Step 6: "Calculating..." → [Auto-advance]
    ↓
Step 7: Valuation Result Card → [View Comparables/Recommendations/PDF]
    ↓
Step 8: Comparables (if clicked)
Step 9: Recommendations (if clicked)
```

---

## 🎯 Success Criteria

- [ ] Welcome message displays
- [ ] Buttons are clickable
- [ ] Conversation flows smoothly
- [ ] Result cards render correctly
- [ ] Comparables show 3 properties
- [ ] Recommendations show 5 items with ROI
- [ ] Overall UX feels polished

---

**Status:** ✅ MOCK MODE ACTIVE
**File:** `js/mock-orchestrator.js`
**Test:** `http://localhost:8001/chat.html`

**Ready to iterate on UX!** 🚀
