# V2 Enhancement Plan - Match V1 Features

## Current Issues
1. ❌ No detailed property verification (V1 has 4 screens of verification)
2. ❌ Photo capture is skipped entirely
3. ❌ Results shown as plain text, not rich visual cards
4. ❌ No PDF report generation
5. ❌ No room dimensions display
6. ❌ Comparables shown as text list, not cards

## V1 Features to Implement

### 1. Property Verification (4 Conversational Stages)
**Stage 1: Basic Property Info**
- Property Type (Single Family/Condo/Townhouse/Multi-Family)
- Year Built
- Square Footage
- Lot Size
Each shows "Public records say: X" with ✓ Correct / Update options

**Stage 2: Room Counts**
- Bedrooms (dropdown 1-6+)
- Bathrooms (dropdown 1-5+)
- Garage (None/1-car/2-car/3+)
- Basement (None/Unfinished/Partially Finished/Finished)

**Stage 3: Features & Ages**
- HVAC: Type + Age
- Roof: Type + Age
- Kitchen: Condition + Year Updated
- Bathrooms: Condition + Year Updated
- Primary Flooring Type

**Stage 4: Recent Changes**
- Checklist: Kitchen Remodel, Bathroom Remodel, New Roof, New HVAC, New Windows, Added Room, Deck/Patio, Landscaping, Other
- Additional Details (optional text)

### 2. Photo Capture Flow
- After verification, explicitly ask: "Would you like to take photos to improve accuracy?"
- Guide through each room type:
  - Living Room
  - Kitchen
  - Bathrooms
  - Bedrooms
  - Exterior
- Show progress: "3 of 5 rooms captured"

### 3. Visual Results Display
**Value Card Component:**
```
┌─────────────────────────────┐
│   Estimated Value Range     │
│   $270,000 - $300,000       │
│                             │
│   Most Likely: $285,000     │
│   Confidence: 92%           │
└─────────────────────────────┘
```

**Property Details Card:**
- Address
- Total Square Footage
- Room-by-room dimensions

**Comparables Cards** (3 properties):
```
┌──────────────────────┐
│ 145 Oak Ave         │
│ $275,000            │
│ 1,750 sqft • 3bd/2ba│
│ 0.5 miles away      │
└──────────────────────┘
```

### 4. Recommendations Display
**Summary Card:**
```
┌─────────────────────────────────┐
│ 📊 We found 5 recommendations  │
│ Potential increase: $35k-$55k  │
└─────────────────────────────────┘
```

**Recommendation Cards:**
```
┌────────────────────────────────┐
│ 💡 Kitchen Update              │
│ Investment: $15k-$25k          │
│ Value Add: $20k-$30k           │
│ Impact Score: 95/100           │
│ ROI: 120%                      │
└────────────────────────────────┘
```

### 5. PDF Report Generation
- Include all data:
  - Property details
  - Verification data
  - Photos captured
  - Valuation with comparables
  - Recommendations with ROI
- Download button in final results

## Implementation Steps

1. **Update server.js** - Add detailed verification steps (15-20 messages instead of 6)
2. **Create result-cards.js** - Visual card components for results
3. **Update chat-interface.js** - Add methods to display cards
4. **Create pdf-generator.js** - Generate downloadable PDF reports
5. **Update ai-orchestrator.js** - Handle photo capture flow properly
6. **Test complete flow** - Ensure all V1 features work in conversational format

## New Conversation Flow (30+ steps)

1. Welcome
2. Click "Yes, evaluate"
3. Enter address
4. **Verify Basic Info (4 fields)**
5. **Verify Room Counts (4 fields)**
6. **Verify Features & Ages (8 fields)**
7. **Select Recent Changes (checklist)**
8. Ask about photos
9. **Guide through photo capture (5 room types)**
10. Calculate valuation
11. **Display rich value card**
12. **Display comparables cards**
13. **Display room dimensions**
14. Ask: "Would you like recommendations?"
15. **Display recommendation summary card**
16. **Display recommendation cards (5 items)**
17. **Offer PDF download**
18. Completion options: Save / Download PDF / Start New

## Success Criteria
✅ User can verify ALL property details like V1
✅ User is guided through photo capture
✅ Results displayed in rich visual cards
✅ Comparables shown as individual cards
✅ Recommendations shown with ROI and impact scores
✅ PDF report can be downloaded
✅ Complete flow feels guided and comprehensive (not choppy)