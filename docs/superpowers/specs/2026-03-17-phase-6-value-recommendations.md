# Phase 6: Value Enhancement Recommendations - Design Specification

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan.

**Date:** 2026-03-17
**Status:** Approved
**Phase:** 6 of 6 (PoC Complete)

---

## Executive Summary

**Goal:** Build an AI-styled recommendation system that analyzes property data and generates actionable improvement suggestions to increase home value.

**User Value:** After receiving their property valuation, homeowners get personalized recommendations showing which improvements will yield the best return on investment, prioritized by urgency and impact.

**Strategic Alignment:** Positions Rocket as a trusted advisor beyond just valuation—helping homeowners maximize their property's value before refinancing or selling.

---

## Context

**Current State:**
- Phase 1-5 complete: Landing → Address → Verification → Instructions → Capture → Review → Results
- Results page shows valuation with comparable properties
- Rich data available: property details, room dimensions, HVAC/roof ages, kitchen/bathroom conditions
- User journey ends at results page with "Get Full Report" and "Start New Valuation" CTAs

**Problem:**
Users see their property value but have no guidance on how to increase it. This is a missed opportunity to provide additional value and deepen engagement.

**Solution:**
Add a recommendations page that analyzes all captured data and generates 3-6 prioritized improvement recommendations with cost estimates, value impact, and ROI calculations.

---

## Architecture Overview

### High-Level Structure

**New Components:**
1. `recommendations.html` - Dedicated recommendations page with AI-style loading animation
2. `js/recommendation-engine.js` - Core recommendation generation logic (pure functions)
3. `js/recommendations-page.js` - Page controller handling UI, animations, and events

**Integration Points:**
- Results page (`results.html`) gets new button: "💡 See How to Increase Value"
- Button navigates to `recommendations.html`
- Recommendations page loads data from localStorage (property verification, photos, valuation)
- Multi-stage loading sequence (5 steps, ~4 seconds total)
- After loading, displays prioritized recommendation cards

**Data Sources:**
1. **Property verification data** - `propertyData` from localStorage (type, year built, sqft, bedrooms, bathrooms, HVAC age, roof age, kitchen/bathroom conditions)
2. **Photo dimensions** - Via `PhotoStorage.getAllPhotos()` (room sizes from mock LiDAR)
3. **Valuation results** - Estimated value from `ValuationEngine`
4. **Mock market data** - Hardcoded regional ROI multipliers by state

**Modular Design:**
- `RecommendationEngine` module similar to `ValuationEngine` pattern (pure functions, testable)
- Page controller handles DOM manipulation, animations, event handlers
- Scoring algorithms isolated for easy tuning and testing

---

## Recommendation Generation Logic

### Multi-Factor Scoring System

**Priority Categories:**
- **Critical** (Red badge: #DC2626) - Score 80-100 - Urgent items affecting safety/value preservation
- **High** (Orange badge: #F59E0B) - Score 60-79 - Major ROI opportunities or aging systems
- **Medium** (Yellow badge: #FCD34D) - Score 40-59 - Good improvements with moderate ROI

**Scoring Formula:**
```
Priority Score = (Age Factor × 0.4) + (Condition Factor × 0.3) + (ROI Factor × 0.2) + (Market Factor × 0.1)
```

**Factor Calculations:**

1. **Age Factor (0-100):**
   - Compare item age to typical lifespan
   - HVAC: 15-20 years typical → age 20+ = 100, age 15 = 75, age 10 = 50
   - Roof: 20-30 years typical → age 25+ = 100, age 20 = 75, age 15 = 50
   - Kitchen/Bathroom: 15-25 years typical → year 2000 = 100, year 2010 = 60, year 2015 = 40

2. **Condition Factor (0-100):**
   - Based on verification condition fields
   - "Poor" = 100, "Fair" = 60, "Good" = 30, "Excellent" = 10
   - If no condition data, use age as proxy

3. **ROI Factor (0-100):**
   - Based on national averages and regional multipliers
   - Kitchen remodel: 75-85% ROI → 85 score
   - Bathroom update: 70-80% ROI → 75 score
   - HVAC replacement: 60-70% ROI → 65 score
   - Roof replacement: 50-60% ROI → 55 score

4. **Market Factor (0-100):**
   - Regional demand scores (mock data)
   - California: Kitchen/outdoor = 90, HVAC = 70
   - Michigan: Kitchen/HVAC = 80, Bathroom = 75
   - Texas: HVAC = 95, Kitchen = 80

### Improvement Areas Analyzed

**1. HVAC System**
- **Trigger:** `hvacAge > 12` years
- **Priority Logic:**
  - Age 20+ → Critical
  - Age 15-19 → High
  - Age 12-14 → Medium
- **Cost Calculation:** $5,000 base + ($200 per 100 sqft)
- **Value Increase:** Cost × 0.6-0.7 (60-70% ROI)
- **Insight:** "Energy-efficient HVAC can reduce utility costs by $800-1,200/year"

**2. Roof Replacement**
- **Trigger:** `roofAge > 18` years
- **Priority Logic:**
  - Age 25+ → Critical
  - Age 20-24 → High
  - Age 18-19 → Medium
- **Cost Calculation:** $8,000 base + ($150 per 100 sqft)
- **Value Increase:** Cost × 0.5-0.6 (50-60% ROI)
- **Insight:** "New roof protects your investment and is a top concern for buyers"

**3. Kitchen Remodel**
- **Trigger:** `kitchenYear < 2010` OR `kitchenCondition === 'Poor' OR 'Fair'`
- **Priority Logic:**
  - Condition "Poor" → High
  - Year < 2000 → High
  - Year 2000-2010 OR Condition "Fair" → Medium
- **Cost Calculation:**
  - Major remodel: $25,000-$40,000 (condition "Poor" or year < 2000)
  - Minor update: $15,000-$25,000 (condition "Fair" or year 2000-2010)
- **Value Increase:** Cost × 0.75-0.85 (75-85% ROI)
- **Insight:** "Homes in your area with updated kitchens sell 15% faster"

**4. Bathroom Update**
- **Trigger:** `bathroomYear < 2010` OR `bathroomCondition === 'Poor' OR 'Fair'`
- **Priority Logic:**
  - Condition "Poor" → High
  - Year < 2000 → High
  - Year 2000-2010 OR Condition "Fair" → Medium
- **Cost Calculation:**
  - Full remodel: $15,000-$25,000 (condition "Poor" or year < 2000)
  - Update: $8,000-$15,000 (condition "Fair" or year 2000-2010)
- **Value Increase:** Cost × 0.7-0.8 (70-80% ROI)
- **Insight:** "Modern bathroom fixtures are a top priority for buyers in [city]"

**5. Exterior Improvements**
- **Trigger:** Property year built > 30 years AND no recent exterior changes
- **Priority:** Medium
- **Cost Calculation:** $5,000-$12,000 (siding, paint, landscaping)
- **Value Increase:** Cost × 0.65-0.75 (65-75% ROI)
- **Insight:** "Curb appeal creates strong first impressions and attracts more buyers"

**6. Energy Efficiency**
- **Trigger:** HVAC age > 10 years OR year built < 2000
- **Priority:** Medium
- **Cost Calculation:** $3,000-$8,000 (windows, insulation, smart thermostat)
- **Value Increase:** Cost × 0.5-0.6 + annual utility savings
- **Insight:** "Energy-efficient homes qualify for better financing and lower insurance"

### Cost & Value Calculations

**State-Based ROI Multipliers:**
```javascript
const ROI_MULTIPLIERS = {
  'CA': { kitchen: 0.85, bathroom: 0.80, hvac: 0.65, roof: 0.60, exterior: 0.75, energy: 0.60 },
  'NY': { kitchen: 0.82, bathroom: 0.78, hvac: 0.68, roof: 0.58, exterior: 0.70, energy: 0.62 },
  'TX': { kitchen: 0.75, bathroom: 0.72, hvac: 0.70, roof: 0.55, exterior: 0.68, energy: 0.58 },
  'MI': { kitchen: 0.78, bathroom: 0.75, hvac: 0.67, roof: 0.57, exterior: 0.70, energy: 0.60 },
  'DEFAULT': { kitchen: 0.75, bathroom: 0.72, hvac: 0.65, roof: 0.55, exterior: 0.70, energy: 0.58 }
};
```

**Size-Based Adjustments:**
- Properties > 2,500 sqft: Cost +20%, Value +15%
- Properties < 1,500 sqft: Cost -15%, Value -10%
- Typical range: 1,500-2,500 sqft (base calculations)

**Mock "AI Insights":**
Each recommendation includes a generated insight based on improvement type and location:
- Market velocity insights: "...sell 15% faster"
- Financial benefits: "...reduce utility costs by $X/year"
- Buyer priorities: "...top priority for buyers in [city]"
- Investment protection: "...protects your investment"
- Financing benefits: "...qualify for better financing"

### Recommendation Object Structure

```javascript
{
  id: 'hvac-replacement',           // Unique identifier
  title: 'Replace HVAC System',     // Display title
  description: 'Your 20-year-old central AC unit is past its typical lifespan. Replacing it with an energy-efficient system will improve comfort and reduce utility costs.',
  priority: 'critical',              // critical | high | medium
  priorityScore: 85,                 // 0-100 (for sorting)
  icon: '❄️',                       // Emoji icon
  costRange: {                       // Estimated cost
    low: 5000,
    high: 8000
  },
  valueIncrease: {                   // Estimated value add
    low: 4000,
    high: 6000
  },
  roi: {                             // ROI percentage range
    low: 60,
    high: 80
  },
  insight: 'Energy-efficient HVAC can reduce utility costs by $800-1,200/year',
  confidence: 92                     // 0-100 (based on data completeness)
}
```

---

## User Interface Design

### Loading Sequence (AI-Style Animation)

**5-Stage Loading (~4 seconds total):**
1. **"🔍 Analyzing property features..."** (700ms)
2. **"📊 Comparing with market data..."** (800ms)
3. **"🤖 Evaluating improvement opportunities..."** (900ms)
4. **"💰 Calculating ROI projections..."** (700ms)
5. **"✨ Generating recommendations..."** (600ms)

**Visual Treatment:**
- Similar to results page loading pattern
- Each step shows ⏳ initially, then ✓ when complete
- Spinning loader below steps
- Smooth fade transition from loading to content
- Total loading time: ~3.7 seconds + 0.5s fade = ~4.2 seconds

### Recommendations Page Layout

**Page Structure:**
```html
<div class="page-container">
  <!-- Loading State (hidden after load) -->
  <div id="loading-state" class="loading-state">
    <!-- 5-stage animation -->
  </div>

  <!-- Recommendations Content (hidden until loaded) -->
  <div id="recommendations-content" class="recommendations-content">
    <nav class="page-nav">
      <a href="results.html">← Back to Results</a>
    </nav>

    <main>
      <h1>💡 Increase Your Property Value</h1>
      <p class="subtitle">Based on analysis of your property data and local market trends</p>

      <!-- Summary Card -->
      <div class="summary-card">
        <div class="summary-icon">📊</div>
        <div class="summary-content">
          <h3>We found <strong>X recommendations</strong></h3>
          <p>Potential value increase: <strong>$Y - $Z</strong></p>
        </div>
      </div>

      <!-- Recommendations Grid -->
      <div class="recommendations-grid">
        <!-- Dynamically populated recommendation cards -->
      </div>

      <!-- CTA Section -->
      <div class="cta-section">
        <a href="results.html" class="button button-secondary">← Back to Results</a>
        <button id="get-report" class="button button-primary">📄 Get Full Report</button>
        <button id="start-new" class="button button-secondary">🔄 Start New Valuation</button>
      </div>

      <!-- Disclaimer -->
      <p class="disclaimer">...</p>
    </main>
  </div>
</div>
```

### Recommendation Card Design

**Card Structure:**
```html
<div class="recommendation-card" data-priority="critical">
  <div class="recommendation-header">
    <span class="priority-badge critical">⚠️ Critical</span>
    <span class="recommendation-icon">❄️</span>
  </div>

  <h3 class="recommendation-title">Replace HVAC System</h3>

  <p class="recommendation-description">
    Your 20-year-old central AC unit is past its typical lifespan...
  </p>

  <div class="recommendation-stats">
    <div class="stat-item">
      <span class="stat-icon">💵</span>
      <div class="stat-content">
        <div class="stat-label">Est. Cost</div>
        <div class="stat-value">$5,000 - $8,000</div>
      </div>
    </div>

    <div class="stat-item">
      <span class="stat-icon">📈</span>
      <div class="stat-content">
        <div class="stat-label">Value Increase</div>
        <div class="stat-value">$4,000 - $6,000</div>
      </div>
    </div>

    <div class="stat-item">
      <span class="stat-icon">🎯</span>
      <div class="stat-content">
        <div class="stat-label">Typical ROI</div>
        <div class="stat-value">60-80%</div>
      </div>
    </div>
  </div>

  <div class="recommendation-insight">
    <span class="insight-icon">💡</span>
    <p>Energy-efficient HVAC can reduce utility costs by $800-1,200/year</p>
  </div>
</div>
```

**Priority Badge Colors:**
- **Critical:** Background #DC2626, Text white, Icon ⚠️
- **High:** Background #F59E0B, Text white, Icon 🔥
- **Medium:** Background #FCD34D, Text gray-800, Icon ⭐

**Card Layout:**
- **Mobile:** Stack vertically, full width
- **Tablet (768px+):** 2-column grid, gap 24px
- **Desktop (1024px+):** 2-column grid, max-width 1200px

**Card Styling:**
- White background
- Border: 2px solid based on priority (red/orange/yellow)
- Border-radius: 12px
- Padding: 24px
- Box-shadow: subtle elevation
- Hover: Slight lift animation

**Sorting:**
1. Priority level (Critical → High → Medium)
2. Within same priority, sort by priorityScore (descending)

### Summary Card

**Purpose:** Show high-level overview before diving into recommendations

**Content:**
- Number of recommendations found (e.g., "We found 5 recommendations")
- Total potential value increase range (sum of all value increases)
- Icon: 📊

**Styling:**
- Background: Light blue gradient (#EFF6FF → #DBEAFE)
- Border: 2px solid #3B82F6
- Padding: 24px
- Margin-bottom: 32px

---

## Data Flow

### User Journey

```
Results Page
  → User clicks "💡 See How to Increase Value" button
  → Navigate to recommendations.html
  → Page loads data from localStorage
  → Show 5-stage AI loading animation (~4 seconds)
  → Generate recommendations via RecommendationEngine
  → Display sorted recommendation cards
  → User can:
    - Back to Results
    - Get Full Report (same as results page behavior)
    - Start New Valuation (clears all data)
```

### Data Loading Sequence

```javascript
1. Load propertyData from localStorage
   - Property type, year built, sqft, lot size
   - Bedrooms, bathrooms, garage, basement
   - HVAC type/age, roof type/age
   - Kitchen condition/year, bathroom condition/year
   - Recent changes

2. Load photos with dimensions via PhotoStorage.getAllPhotos()
   - Room dimensions (width, depth, height, sqft)
   - Used for size-based cost adjustments

3. Load/calculate valuation via ValuationEngine
   - Property value estimate
   - Used for ROI calculations
   - State information for regional multipliers

4. Load address data (optional, for insights)
   - City, state
   - Used in insight text generation

5. Pass all data to RecommendationEngine.generateRecommendations()
   - Returns array of recommendation objects
   - Sorted by priority

6. Page controller renders recommendation cards
   - Map over recommendations array
   - Create card HTML for each
   - Append to grid container
```

### RecommendationEngine API

**Primary Function:**
```javascript
RecommendationEngine.generateRecommendations(propertyData, photos, valuation, address)
  → Returns: Array<Recommendation>
```

**Supporting Functions:**
```javascript
// Calculate priority score for a recommendation
calculatePriorityScore(ageFactor, conditionFactor, roiFactor, marketFactor)
  → Returns: number (0-100)

// Determine priority category from score
getPriorityCategory(score)
  → Returns: 'critical' | 'high' | 'medium'

// Calculate cost range based on property size and improvement type
calculateCostRange(improvementType, sqft, state)
  → Returns: { low: number, high: number }

// Calculate value increase based on cost and regional ROI
calculateValueIncrease(costRange, improvementType, state)
  → Returns: { low: number, high: number }

// Generate market insight text
generateInsight(improvementType, city, state)
  → Returns: string

// Format currency
formatCurrency(value)
  → Returns: string (e.g., "$5,000")
```

---

## Error Handling

### Missing Data Scenarios

**1. No Property Verification Data**
- **Detection:** `loadFromStorage('propertyData')` returns null/undefined
- **Behavior:** Redirect to property-verification.html
- **Message:** Store message: "Please complete property verification to see recommendations"

**2. No Photos/Dimensions**
- **Detection:** `PhotoStorage.getAllPhotos()` returns empty array
- **Behavior:** Continue with generic recommendations
- **Display:** Show note: "Limited recommendations available. For personalized suggestions, complete photo capture."
- **Impact:** Use average sqft (2000) for calculations, skip size-based adjustments

**3. Incomplete Verification Data**
- **Detection:** Missing specific fields (hvacAge, kitchenYear, etc.)
- **Behavior:** Generate recommendations from available data only
- **Impact:** Skip recommendations that require missing fields, note lower confidence scores

**4. No Valuation Data**
- **Detection:** No cached valuation results
- **Behavior:** Recalculate on-the-fly using ValuationEngine
- **Fallback:** If recalculation fails, use placeholder value based on sqft × regional multiplier

### Graceful Degradation

**Minimum Recommendations:**
- Always generate at least 2-3 recommendations
- If data is too sparse, provide generic recommendations:
  - "Consider updating kitchen and bathrooms"
  - "Energy efficiency improvements have strong ROI"
  - "Curb appeal enhancements attract buyers"

**Confidence Scoring:**
- Track data completeness: (fieldsProvided / fieldsRequested) × 100
- Display lower confidence if < 70% data available
- Adjust insight language: "Based on limited data..." vs "Based on detailed analysis..."

**Fallback Logic:**
- If scoring algorithm fails → Use simple age-based rules
- If cost calculation fails → Use median national averages
- If ROI calculation fails → Use conservative 50% default

### User-Friendly Error Messages

**No Alerts:**
- Never use `alert()` for errors
- Display inline messages within the page

**Clear Communication:**
- "We generated recommendations based on the data available"
- "For more accurate recommendations, consider completing [missing step]"
- "Results are estimates and may vary based on local market conditions"

**Always Show Value:**
- Even with errors, show something useful
- Guide user to complete missing data if needed
- Maintain positive, helpful tone

---

## Implementation Details

### Files to Create

**1. `recommendations.html`**
- Dedicated page for recommendations
- Structure: Loading state + Recommendations content
- Links: Back to results, Get Report, Start New
- Scripts: utils.js, photo-storage.js, valuation-engine.js, recommendation-engine.js, recommendations-page.js

**2. `js/recommendation-engine.js`**
- Core recommendation generation logic
- Pure functions (no DOM manipulation)
- Exports: `RecommendationEngine` object with public API
- Structure similar to `valuation-engine.js`
- ~300-400 lines

**3. `js/recommendations-page.js`**
- Page controller
- Handles: Loading animation, data fetching, rendering, event handlers
- IIFE pattern like other page controllers
- ~250-300 lines

### Files to Modify

**1. `results.html`**
- Add button in CTA section: `<button id="see-recommendations" class="button button-primary button-full">💡 See How to Increase Value</button>`
- Insert between comparables section and existing CTA buttons
- Adjust CTA button layout to accommodate new button

**2. `js/results-page.js`**
- Add event handler: `document.getElementById('see-recommendations').addEventListener('click', handleSeeRecommendations)`
- Function: `handleSeeRecommendations() { navigateTo('recommendations.html'); }`
- Add to `setupEventHandlers()`

**3. `css/components.css`**
- Add recommendation card styles (~150-200 lines)
- Add loading animation styles (reuse from results page)
- Add summary card styles
- Add priority badge styles
- Responsive grid layout

**4. `README.md`**
- Update status badge: "phase 6 complete"
- Add Phase 6 section to completed list
- Update file structure
- Update user flow diagram

### CSS Styling Requirements

**Recommendation Cards:**
```css
.recommendation-card {
  background: white;
  border: 2px solid;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.recommendation-card[data-priority="critical"] {
  border-color: #DC2626;
}

.recommendation-card[data-priority="high"] {
  border-color: #F59E0B;
}

.recommendation-card[data-priority="medium"] {
  border-color: #FCD34D;
}
```

**Priority Badges:**
```css
.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.priority-badge.critical {
  background: #DC2626;
  color: white;
}

.priority-badge.high {
  background: #F59E0B;
  color: white;
}

.priority-badge.medium {
  background: #FCD34D;
  color: #1F2937;
}
```

**Responsive Grid:**
```css
.recommendations-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 32px;
}

@media (min-width: 768px) {
  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## Testing Strategy

### Test Scenarios

**1. Complete Data Path**
- Fill all verification fields with realistic data
- Capture all 5 photos
- Navigate: Results → Recommendations
- Verify: 4-6 recommendations appear, sorted by priority
- Check: Cost/value ranges are reasonable, insights make sense

**2. Partial Data - Missing Ages**
- Leave hvacAge and roofAge empty
- Complete other verification fields
- Expected: HVAC and Roof recommendations skipped or use fallback logic
- Verify: Other recommendations still generate (kitchen, bathroom, etc.)

**3. Partial Data - Missing Conditions**
- Leave kitchen/bathroom condition fields empty
- Provide years (e.g., 2005)
- Expected: Age-based recommendations generated
- Verify: Priority calculated from year alone

**4. Edge Case - Very Old Property**
- Set year built: 1950
- Set HVAC age: 25 years
- Set roof age: 30 years
- Expected: Multiple critical recommendations
- Verify: Critical priority badges appear, urgent language used

**5. Edge Case - Recently Renovated**
- Set kitchenYear: 2023
- Set bathroomYear: 2023
- Set hvacAge: 2 years
- Expected: Minimal recommendations (exterior, energy efficiency only)
- Verify: Message shows "Your property is in excellent condition"

**6. Priority Sorting**
- Create mix of critical, high, medium priority items
- Verify: Cards appear in correct order (critical first)
- Verify: Within same priority, higher scores appear first

**7. ROI Calculations**
- Spot-check cost ranges against property size
- Verify: Value increase = cost × ROI multiplier (approximately)
- Check: ROI percentages match expectations (kitchen 75-85%, HVAC 60-70%)

**8. State-Based Variations**
- Test with different states (CA, TX, MI)
- Verify: ROI multipliers adjust appropriately
- Check: Insights reference local market (city name appears)

**9. Navigation**
- Test "Back to Results" → Returns to results.html
- Test "Get Full Report" → Shows demo alert (same as results page)
- Test "Start New Valuation" → Clears data, returns to index.html

**10. Loading Animation**
- Verify: All 5 stages complete in sequence
- Check: Timing feels natural (~4 seconds total)
- Verify: Smooth transition from loading to content
- Check: No flash of unstyled content

### Browser Compatibility

Test on:
- ✅ Chrome 90+ (Windows, Mac, Android)
- ✅ Safari 14+ (Mac, iOS)
- ✅ Edge 90+ (Windows)
- ✅ Firefox 88+ (Windows, Mac)

### Performance Targets

- **Page load:** < 2 seconds on 4G
- **Loading animation:** ~4 seconds (intentional for AI feel)
- **Recommendation generation:** < 100ms (client-side calculation)
- **Card rendering:** < 200ms for 6 cards
- **Total time to interactive:** < 5 seconds

---

## Success Criteria

**Functional Requirements:**
1. ✅ Generate 2-6 recommendations based on property data
2. ✅ Display recommendations sorted by priority (Critical → High → Medium)
3. ✅ Show cost range, value increase, and ROI for each recommendation
4. ✅ Include market insights for each recommendation
5. ✅ Handle missing data gracefully (no errors, helpful messages)
6. ✅ AI-style loading animation completes smoothly
7. ✅ Navigation works: Back to Results, Get Report, Start New

**User Experience Requirements:**
1. ✅ Loading sequence feels sophisticated (not too fast, not too slow)
2. ✅ Recommendations feel personalized to the specific property
3. ✅ Cost and value ranges feel realistic and credible
4. ✅ Priority badges clearly communicate urgency
5. ✅ Page is responsive on mobile, tablet, desktop
6. ✅ No jarring errors or alerts, even with bad data

**Technical Requirements:**
1. ✅ Code follows existing patterns (IIFE, pure functions, modular)
2. ✅ No external dependencies (pure vanilla JS)
3. ✅ Works with existing localStorage data structures
4. ✅ Performance targets met (< 5 seconds total)
5. ✅ Browser compatibility maintained
6. ✅ CSS follows existing design system

**Demo Requirements:**
1. ✅ Impressive enough to show product leadership
2. ✅ Data-driven approach is evident (not random suggestions)
3. ✅ AI presentation is believable (even though it's mock)
4. ✅ Recommendations are actionable and specific
5. ✅ Flow integrates naturally with existing journey

---

## Future Enhancements (Out of Scope for Phase 6)

**Production Features:**
- Real AI/ML recommendation engine with predictive models
- Integration with contractor databases for instant quotes
- Historical data on actual ROI in specific neighborhoods
- Photo analysis via computer vision to detect issues
- Personalized timeline planning (staged improvements)
- Financing calculator for improvement costs
- Before/after visualization tools
- Email report delivery with recommendations included

**Data Improvements:**
- Real market data APIs (Zillow, Redfin, MLS)
- Local contractor pricing data
- Neighborhood trends and buyer preferences
- Seasonal timing recommendations
- Permitting requirements and costs

**User Features:**
- Save favorite recommendations
- Share recommendations via email/SMS
- Schedule contractor consultations
- Track completed improvements
- Re-run valuation after improvements
- Compare multiple improvement scenarios

---

## Appendix

### Example Recommendation Output

**Property:** 662 Woodward Ave, Detroit MI 48226
**Year Built:** 1985
**Size:** 2,140 sqft
**HVAC Age:** 20 years
**Roof Age:** 15 years
**Kitchen:** Year 2005, Condition "Fair"
**Bathroom:** Year 2008, Condition "Good"

**Generated Recommendations:**

1. **Replace HVAC System** (Critical, Score: 87)
   - Cost: $6,200 - $9,800
   - Value: $4,300 - $6,900
   - ROI: 62-71%
   - Insight: "Energy-efficient HVAC can reduce utility costs by $800-1,200/year"

2. **Kitchen Remodel** (High, Score: 72)
   - Cost: $18,000 - $28,000
   - Value: $14,000 - $22,400
   - ROI: 75-82%
   - Insight: "Homes in Detroit with updated kitchens sell 15% faster"

3. **Bathroom Update** (Medium, Score: 58)
   - Cost: $10,000 - $16,000
   - Value: $7,500 - $12,800
   - ROI: 72-80%
   - Insight: "Modern bathroom fixtures are a top priority for buyers in Detroit"

4. **Exterior Improvements** (Medium, Score: 52)
   - Cost: $6,000 - $11,000
   - Value: $4,200 - $8,250
   - ROI: 68-75%
   - Insight: "Curb appeal creates strong first impressions and attracts more buyers"

**Summary:** 4 recommendations, Total potential value increase: $30,000 - $50,300

---

## Conclusion

Phase 6 completes the mobile valuation PoC with a sophisticated recommendation engine that demonstrates data-driven property improvement guidance. By analyzing property verification data, room dimensions, and market factors, the system provides actionable recommendations with cost estimates and ROI projections.

The AI-styled loading animation and priority-based presentation create a professional, trustworthy experience suitable for demonstrating to product leadership. The modular architecture allows for easy enhancement with real AI/ML models in future phases.

**Key Deliverables:**
- Recommendations page with AI-style loading
- Multi-factor scoring engine
- 6 improvement area analyzers
- Priority-based card layout
- Integration with existing data flow
- Complete CSS styling
- Comprehensive error handling

**Next Steps:**
- Implementation plan (via writing-plans skill)
- Development and testing
- Demo preparation
- Stakeholder presentation

---

**Prepared by:** Claude (Anthropic)
**Date:** 2026-03-17
**Version:** 1.0
