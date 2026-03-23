# 🧪 Test Mock Mode - Quick Guide

## Open This URL:
```
http://localhost:8001/chat.html
```

## Press Ctrl+Shift+R to force reload!

---

## ✅ What Should Happen:

### 1. Page Loads
- ✅ No console errors
- ✅ Console shows: "ChatInterface initialized successfully"
- ✅ Console shows: "Mock AIOrchestrator loaded"

### 2. Welcome Message Appears
- ✅ "Welcome to Rocket Valuation!" message
- ✅ Two buttons: "✓ Yes, evaluate my property" and "No thanks"

### 3. Click "Yes, evaluate"
- ✅ Your selection appears as user message
- ✅ AI asks: "Great! Let's start with the address..."

### 4. Type Any Address
- ✅ Example: "123 Main Street"
- ✅ Press Enter
- ✅ AI confirms: "Property Type: Single Family - Is this correct?"

### 5. Click "✓ Correct"
- ✅ AI asks: "Year Built: 1950 - Is this correct?"

### 6. Click "✓ Correct" Again
- ✅ AI asks: "Square Footage: 1,800 sq ft - Is this correct?"

### 7. Click "✓ Correct" Again
- ✅ AI says: "Perfect! Let me calculate..."
- ✅ After 1.5 seconds, valuation card appears

### 8. See Valuation Card
- ✅ Shows "$285,000" as estimate
- ✅ Shows range $270,000 - $300,000
- ✅ Shows 92% confidence meter
- ✅ Three buttons: View Comparables, View Recommendations, Download PDF

### 9. Click "View Comparables"
- ✅ Shows 3 property cards with addresses and prices

### 10. Click "View Recommendations"
- ✅ Shows 5 recommendation cards with ROI percentages

---

## 🐛 If It Doesn't Work:

### Check Console (F12 → Console):
```javascript
// Run these commands:
console.log(window.AIOrchestrator);  // Should be object
console.log(window.ChatInterface);   // Should be object

// Try manually starting:
window.AIOrchestrator.startNewConversation();
window.AIOrchestrator.sendMessage('');
```

### Common Issues:

**No welcome message?**
- Reload with Ctrl+Shift+R
- Check console for errors
- Verify mock-orchestrator.js loaded

**Buttons don't work?**
- Check if ChatInterface loaded
- Check console for click errors
- Try clicking slowly (may need time to initialize)

**Cards don't render?**
- Check if result-cards.js loaded
- Look for console errors when clicking buttons

---

## 🎉 Success!

If all 10 steps work, you now have:
- ✅ Working conversation flow
- ✅ Interactive buttons
- ✅ Result cards rendering
- ✅ Comparables displaying
- ✅ Recommendations showing

**You can now iterate on the UX without worrying about API/server complexity!**

---

**Next:** Edit `js/mock-orchestrator.js` to customize the conversation flow
