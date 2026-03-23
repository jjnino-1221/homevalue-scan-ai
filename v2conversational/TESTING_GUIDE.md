# V2 Conversational - Testing Guide

## ✅ All Systems Running

Both servers have been restarted with the latest code:

- **Backend API**: http://localhost:3001 (Node.js server with updated server-enhanced.js)
- **Frontend**: http://localhost:8001 (Python HTTP server serving updated files)

## 🔧 What Was Fixed

### 1. Server-Side Fixes
- **Fixed flow control logic**: Each verification step now checks for correct response values
- **Replaced markdown formatting**: Changed `**text**` to `<strong>text</strong>` HTML tags
- **Session persistence**: Verified sessions persist correctly between API calls
- **Step progression**: Flow progresses smoothly through all 15 steps

### 2. Frontend Fixes
- **Result cards redesigned**: Complete rewrite using RDS (Rocket Design System) classes
- **Removed custom CSS**: All styling now uses rkt-* classes from css/chat.css
- **Syntax error fixed**: Corrected template string in renderValuationCard function

### 3. Server Restarts
- **Backend restarted**: New code loaded, session state cleared
- **Frontend restarted**: Killed duplicate processes, started fresh server
- **Cache cleared**: Node.js module cache refreshed

## 🧪 How to Test (IMPORTANT)

### Step 1: Hard Refresh the Browser

**You MUST clear your browser cache completely**:

1. Open browser at http://localhost:8001/
2. Press **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
3. If that doesn't work, do a full cache clear:
   - Press **F12** to open Developer Tools
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"
4. Alternatively, open in **Incognito/Private mode** to bypass cache entirely

### Step 2: Complete the Full Flow

1. **Welcome Screen**
   - Should see: "Welcome to Rocket Valuation!"
   - Should have 2 chips: "✓ Yes, evaluate my property" and "Tell me more"
   - Click: "✓ Yes, evaluate my property"

2. **Address Entry**
   - Should ask: "What's the address of the home you'd like to value?"
   - Type any address, e.g., "123 Main Street Detroit"
   - Press Enter

3. **Property Verification (8 steps)**
   - Should show: **"Property Type: Single Family"** (with HTML bold, no ** symbols)
   - Click "✓ Correct" for each:
     - Property Type
     - Year Built (1950)
     - Square Footage (1,800 sq ft)
     - Bedrooms (3 bedrooms)
     - Bathrooms (2.5 bathrooms)
     - Garage (2-car garage)

4. **Feature Questions (3 steps)**
   - HVAC Age: Select any option (e.g., "6-10 years")
   - Roof Age: Select any option (e.g., "11-15 years")
   - Kitchen Condition: Select any option (e.g., "Partially Updated")

5. **Recent Improvements**
   - Multi-select chips for renovations
   - Select one or more, or click "None"

6. **Photo Capture**
   - Should offer: "Would you like to take photos?"
   - Options: "📷 Yes, take photos" or "Skip photos"
   - For now, click "Skip photos" (camera flow needs debugging)

7. **Calculation**
   - Should show: "Let me calculate your property's estimated value..."
   - May see a brief loading indicator

8. **Results Display**
   - Should show rich card with:
     - 🏡 Icon and "Your Property Valuation" header
     - Estimated Value Range
     - Most Likely Value (large, bold)
     - Confidence meter (animated bar)
     - Property details grid
     - Three action buttons:
       - "View Comparables"
       - "View Recommendations"
       - "Download PDF Report"

9. **Test Action Buttons**
   - Click "View Comparables":
     - Should display 3 property cards in a grid
     - Each card shows: address, price, sqft, beds/baths, distance
     - Summary card at bottom with average price

   - Click "View Recommendations":
     - Should display purple gradient summary card at top
     - Shows 5 recommendation cards below
     - Each card has: title, description, investment, ROI, impact score
     - Impact score should show as a colored progress bar
     - Yellow disclaimer box at bottom

   - Click "Download PDF Report":
     - Should show green notification box
     - Has download button

## ✅ What to Check For

### Formatting
- [ ] **No `**` symbols in text** - Bold text should use proper HTML styling
- [ ] **Clean, professional appearance** - All text should look polished
- [ ] **Proper spacing** - Cards should have consistent margins/padding

### RDS Design Compliance
- [ ] **Rocket brand colors** - Red (#DE3341) for primary actions
- [ ] **White backgrounds** - Cards should have white backgrounds
- [ ] **Subtle shadows** - Cards should have light elevation shadows
- [ ] **Consistent spacing** - 4px increment spacing system (8px, 12px, 16px, 24px)
- [ ] **Rocket typography** - Clean, readable fonts

### Functionality
- [ ] **Flow progresses smoothly** - No jumps or skipped steps
- [ ] **Chips are clickable** - All button responses work
- [ ] **Progress bar updates** - Shows current step out of 15
- [ ] **Cards display correctly** - Comparables and recommendations show data
- [ ] **No console errors** - Check browser console (F12) for red errors

## 🐛 Known Issues (Still Being Addressed)

### 1. Update Functionality
- **Status**: Not yet implemented
- **Symptom**: Clicking "Update" button does nothing
- **Workaround**: For now, just click "✓ Correct" to continue
- **Fix Required**: Add input prompts when user clicks "Update"

### 2. Photo Capture Process
- **Status**: Not tested/verified
- **Symptom**: May not trigger camera modal
- **Workaround**: Click "Skip photos" for now
- **Fix Required**: Debug camera modal integration

### 3. Manual Prompt to Complete
- **Status**: Under investigation
- **Symptom**: May require manual prompt after calculation
- **Workaround**: If stuck, type "continue" or "complete"
- **Fix Required**: Debug async tool call response handling

## 📝 Debugging Tips

### If You See Old Content:

1. **Check the URL**: Make sure you're on http://localhost:8001/ (not 8000 or another port)
2. **Force refresh**: Ctrl + Shift + R (or Cmd + Shift + R on Mac)
3. **Clear browser cache**:
   - Chrome: Settings → Privacy → Clear browsing data
   - Edge: Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
4. **Try incognito mode**: This completely bypasses cache
5. **Check browser console**: F12 → Console tab, look for errors

### If Flow Gets Stuck:

1. **Check console for errors**: F12 → Console tab
2. **Refresh the page**: This starts a new session
3. **Check server logs**: Look at server-debug.log for "[ENHANCED]" messages
4. **Verify servers are running**:
   - Backend: http://localhost:3001/health should return `{"status":"ok"}`
   - Frontend: http://localhost:8001/ should load the page

### If Cards Don't Display:

1. **Open browser console**: F12 → Console tab
2. **Look for JavaScript errors**: Red error messages
3. **Check Network tab**: F12 → Network, filter by "JS", refresh page
4. **Verify files loaded**: Look for result-cards.js in the network list
5. **Check file content**: Click on result-cards.js, verify it shows RDS classes

## 🔍 Server Status Verification

To verify servers are running correctly:

```bash
# Check backend health
curl http://localhost:3001/health

# Expected output:
# {"status":"ok","mode":"mock","timestamp":"2026-03-20T..."}

# Check frontend is serving files
curl http://localhost:8001/ | head -20

# Expected output:
# <!DOCTYPE html>
# <html lang="en">
# ...
```

## 📊 Session Debugging

The backend logs show session state. Check `server-debug.log`:

```
[SESSION] Key: test_123456, Has session: false, Total sessions: 0
[SESSION] Creating new session for key: test_123456
[ENHANCED] Msg #1: Step 0 | ""
[SESSION] Key: test_123456, Has session: true, Total sessions: 1
[SESSION] Retrieved existing session, currentStep: 0
[ENHANCED] Msg #3: Step 1 | "start_valuation"
```

Each message should show:
- Session key (unique per conversation)
- Whether session was found or created
- Current step number
- User message content

## ✨ Success Criteria

You'll know everything is working when:

1. ✅ Text displays clean without ** symbols
2. ✅ Flow progresses through all 15 steps smoothly
3. ✅ Result card displays with professional styling
4. ✅ Comparables show 3 property cards
5. ✅ Recommendations show summary + 5 cards with ROI data
6. ✅ All cards use Rocket brand colors (red accents, white backgrounds)
7. ✅ No console errors (check F12 → Console)
8. ✅ Cards have subtle shadows and proper spacing

## 🚀 Next Steps After Testing

Once you've verified the core flow works:

1. **Report test results**: Let me know which parts work and which don't
2. **Implement Update functionality**: Add input prompts for editing property details
3. **Fix photo capture**: Debug camera modal integration
4. **Test on mobile**: Verify responsive design works
5. **Add error handling**: Improve error messages and recovery

---

## Quick Troubleshooting Checklist

- [ ] Both servers running (3001 and 8001)
- [ ] Browser cache cleared (Ctrl + Shift + R)
- [ ] Using correct URL (http://localhost:8001/)
- [ ] Browser console shows no errors (F12)
- [ ] result-cards.js loaded successfully (Network tab)
- [ ] Session persisting correctly (check server-debug.log)

If all else fails:
1. Close browser completely
2. Restart both servers
3. Open browser in incognito mode
4. Navigate to http://localhost:8001/

The changes ARE there - it's just a matter of forcing your browser to load the new code instead of cached versions!
