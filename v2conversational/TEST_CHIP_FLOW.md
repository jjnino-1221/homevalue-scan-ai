# 🧪 Test Guide - Fully Chip-Based Flow

**Date:** March 22, 2026
**Status:** Ready to test - Zero typing required

---

## 🚀 Quick Test

**URL:** http://localhost:8001/chat.html
**Reload:** Ctrl+Shift+R (hard reload)

**Open Console:** F12 → Console tab

---

## ✅ Test Paths

### Path A: Complete Flow with Improvements (~30 seconds)

1. **Step 1** - Click "✓ Yes, evaluate my property"
2. **Step 2** - Click any address (e.g., "123 Main Street, Detroit MI 48226")
3. **Steps 3-8** - Click "✓ Correct" for: Type, Year, Sqft, Beds, Baths, Garage
4. **Step 9** - Click any HVAC age (e.g., "6-10 years")
5. **Step 10** - Click any roof age (e.g., "6-10 years")
6. **Step 11** - Click any kitchen condition (e.g., "Fully Renovated")
7. **Step 12** - Click "Kitchen Remodel" + "Bathroom Remodel" → Click "Done (2 selected)"
8. **Step 13** - Click any description (e.g., "Complete remodel with high-end finishes")
9. **Step 14** - Click "📷 Yes, take photos" or "Skip photos"
10. **Step 15** - Wait 1.5s (auto-advance with "Calculating..." message)
11. **Step 16** - Verify valuation card appears with $285,000 estimate
12. **Step 17** - Click "View Comparables" → See 3 properties
13. **Step 18** - Click "View Recommendations" → See 5 improvement cards

✅ **Success:** All 18 steps complete, no errors

---

### Path B: Quick Flow without Improvements (~25 seconds)

1. **Step 1** - Click "✓ Yes, evaluate my property"
2. **Step 2** - Click any address
3. **Steps 3-8** - Click "✓ Correct" 6 times
4. **Steps 9-11** - Click age/condition chips
5. **Step 12** - Click "None" (immediate advance, no Done button)
6. **Step 13** - SKIPPED (no improvements)
7. **Step 14** - Click "Skip photos"
8. **Step 15** - Wait 1.5s (auto-advance)
9. **Step 16** - Valuation card appears
10. **Click** - "View Comparables" then "View Recommendations"

✅ **Success:** All 16 steps complete (steps 13 skipped)

---

## 🔍 What to Check

### Visual Design (Nova RDS)
- ✅ **Chips**: Perfect pill shape (24px radius), refined appearance
- ✅ **Cards**: Subtle elevation shadows (Nova levels 1-3)
- ✅ **Typography**: WNTL_Text font family, proper weights
- ✅ **Colors**: Official Rocket brand red (#DE3341)
- ✅ **Spacing**: Consistent gaps and padding

### Interactions
- ✅ **Chips hover**: Light gray background on hover
- ✅ **Selected chips**: Green background with darker green border
- ✅ **Multi-select Done button**: Appears with count "Done (X selected)"
- ✅ **None option**: Immediately advances without Done button
- ✅ **Bold text**: Field names render as **bold** not `**text**`

### Flow
- ✅ **Step progression**: Each step advances correctly
- ✅ **Triggers match**: Console shows trigger matches
- ✅ **Auto-advance**: Step 15 automatically continues after 1.5s
- ✅ **Result cards**: Valuation, comparables, recommendations all render

---

## 🐛 Console Debugging

**Good console output:**
```
Mock AIOrchestrator loaded
ChatInterface initialized successfully
Mock conversation started

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEBUG: getNextStep called
  currentStep: 1
  lastValue: yes_evaluate
  looking for step: 2
✅ DEBUG: Single trigger MATCHED! Returning step 2

DEBUG: Multi-select Done button clicked
  selectedValues: ['imp_kitchen', 'imp_bathroom']
DEBUG: Multi-select value detected: imp_kitchen,imp_bathroom
✅ DEBUG: Contains trigger MATCHED! Returning step 13

DEBUG: Auto-advance enabled, will continue in 1.5 seconds...
DEBUG: Auto-advance triggered, sending empty message to continue
```

**Bad signs:**
- ❌ JavaScript errors in console
- ❌ "❌ DEBUG: trigger did NOT match" repeatedly
- ❌ Steps don't advance
- ❌ Cards don't render

---

## 📊 Expected Results

### Step 16: Valuation Card
```
Estimated Value: $285,000
Range: $270,000 - $300,000
Confidence: 92%
1,800 sq ft | 3 bed | 2.5 bath
Price per sq ft: $158
```

### Step 17: Comparables
```
145 Oak Ave - $275,000
89 Elm Street - $292,000
210 Maple Dr - $288,000
```

### Step 18: Recommendations
```
Kitchen Update - ROI: 120%
Bathroom Refresh - ROI: 125%
Curb Appeal - ROI: 150%
HVAC Upgrade - ROI: 115%
Flooring Update - ROI: 120%
```

---

## ✅ Success Criteria

| Item | Status | Notes |
|------|--------|-------|
| All 18 steps execute | ⏳ | Test both paths |
| Zero typing required | ⏳ | Pure click-through |
| Nova design visible | ⏳ | Refined chips, shadows |
| Bold text renders | ⏳ | **Field:** format |
| Multi-select works | ⏳ | Done button + None option |
| Auto-advance works | ⏳ | Step 15 continues |
| Cards all render | ⏳ | Valuation, comps, recs |
| No console errors | ⏳ | Clean execution |
| Professional polish | ⏳ | Overall appearance |

---

## 🎬 Testing Instructions

1. **Start fresh:** Ctrl+Shift+R to clear cache
2. **Open console:** F12 → Watch for debug messages
3. **Click through:** Complete Path A (with improvements)
4. **Refresh page:** Ctrl+Shift+R again
5. **Click through:** Complete Path B (no improvements)
6. **Take notes:** Any issues, visual problems, or suggestions

---

## 📝 Report Back

After testing, note:

**What worked:**
-

**What didn't work:**
-

**Visual feedback:**
-

**Suggestions:**
-

---

## 🔧 Next Steps After Testing

Once the flow is validated:

1. **Incorporate Dialog specifications** (if adding modals)
2. **Apply Chat Window specs** (message bubble refinements)
3. **Update landing page** with Header Bar specs
4. **Polish any rough edges** found during testing
5. **Deploy to staging** for stakeholder review

---

**Status:** ⏳ **AWAITING TEST RESULTS**
**Test:** http://localhost:8001/chat.html (Ctrl+Shift+R)
**Expected Time:** 1-2 minutes for both paths
