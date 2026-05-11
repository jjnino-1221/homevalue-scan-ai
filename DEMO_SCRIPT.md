# Rocket Valuation V1 — Demo Script
**Audience:** Khurram Iftikhar (VP Product)  
**Duration:** ~5–7 minutes  
**Format:** Live walkthrough on phone (ideal) or laptop

---

## Before You Start

**Setup (do this before presenting):**

Option A — Netlify (recommended):
- Deploy once: drag the `mobile-valuation/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)
- Use the generated URL on your phone

Option B — Local:
```bash
cd mobile-valuation
python -m http.server 8000
# Open: http://localhost:8000/index.html
```

**Demo on mobile if possible** — the camera and LiDAR flow are far more impressive on a phone. Desktop works but the camera fallback is less visually compelling.

**Pre-load the page** before presenting — TensorFlow.js loads from CDN on first visit (~2-3 seconds). Cache it first so it's instant during the demo.

**What NOT to click:**
- "Get Full Report" — shows an `alert()` dialog explaining it's a future feature. Fine to click if you want to acknowledge it, but don't lead with it.
- "Start Another Valuation" mid-flow — will clear your session

---

## Opening Frame (30 seconds)

> "This is a prototype of a mobile-first property valuation experience. The pitch is: instead of waiting 7–10 days and paying $400–600 for a traditional appraisal, a homeowner uses their phone to walk through their property in about 15 minutes and get an instant value estimate with comparable sales and improvement recommendations. Let me show you the full flow."

---

## Step-by-Step Walkthrough

### 1. Landing Page
**URL:** `http://localhost:8000/index.html` (or Netlify URL)

Point out:
- Headline: *"Know Your Home's Value in 15 Minutes"*
- Four-step "How It Works" section: Enter Address → Capture 5 Photos → Scan with LiDAR → Get Valuation
- "Concept Demo" badge (top-right) — deliberately signals prototype
- "Free to Use • Takes 15 Minutes" trust line

> "The landing page sets the value prop immediately. The 15-minute claim is the key differentiator versus the traditional process."

**Click:** `Get Started`

---

### 2. Address Entry
A "Use My Location" button triggers a brief geolocation animation (~800ms), then displays:

> **662 Woodward Ave, Detroit, MI 48226** ✓

> "In a real integration, this would use the user's actual GPS location or a property lookup from their account. The mock gives us a consistent Detroit address to work with throughout the demo."

**Click:** `Continue →`

---

### 3. Property Verification — 4-Screen Wizard
This is a TurboTax-style "public records say..." flow. Pre-populated data appears; user confirms or updates each field.

**Screen 1 — Property Basics:**
- Property Type: Single Family
- Year Built: 1985
- Square Footage: 2,140 sq ft
- Lot Size: 0.25 acres

**Click:** `Next →`

**Screen 2 — Room Counts:**
- Bedrooms: 3, Bathrooms: 2.5, Garage: 2-car, Basement: Finished

**Click:** `Next →`

**Screen 3 — Features & Condition:**
- HVAC, Roof, Kitchen, Bathroom conditions and ages

**Click:** `Next →`

**Screen 4 — Recent Changes:**
- Checkbox list of recent improvements (Kitchen Remodel, New Roof, etc.)

> "This is the data an appraiser would collect during an in-person visit — we're gathering it conversationally up front. Users can correct any pre-filled field; the 'public record says' framing builds trust."

**Click:** `Finish →`

---

### 4. Photo Instructions
Five room cards appear with guidance (Front Exterior, Kitchen, Living Room, Master Bedroom, Master Bathroom).

> "Each room gets a tip for what to capture. This sets expectations so the photos are useful for the AI analysis."

**Click:** `Start Capturing`

---

### 5. Camera Capture ← **Most Impressive Step on Mobile**

For each of 5 rooms:
- Live camera feed activates with corner guide markers
- Real-time quality feedback overlay (green = good, orange = warning)
- TensorFlow.js + MobileNet analyzing lighting and sharpness at 2fps
- User taps the red capture button
- **LiDAR scan animation plays** (~3-4 seconds): blue scanning line sweeps the screen with AR-style overlay
- Room dimensions appear (e.g., "Kitchen: 12' × 15' × 9'")
- Auto-advances to next room

> "The quality feedback is real — TensorFlow is running in the browser analyzing each frame. The LiDAR scan is mocked, but the dimension generation is realistic per room type. On a phone with an actual LiDAR sensor, this would use real depth data."

**Repeat for all 5 rooms.**

---

### 6. Photo Review
Grid of 5 room thumbnails with dimensions. All captured, submit button activates.

> "The review step gives users a chance to retake any room before submitting. Dimensions are shown so they can sanity-check the measurements."

**Click:** `Submit for Valuation`

---

### 7. Results Page ← **Main Payoff**

Loading animation plays through 4 steps (~2.6 seconds):
1. ✓ Processing photos
2. ✓ Calculating dimensions  
3. ✓ Comparing nearby homes
4. ✓ Generating estimate

Then results reveal:

**Value Card:**
```
Estimated Value: $XXX,000 — $XXX,000
Most Likely: $XXX,000
Confidence: 90%
```

**Property Details:** Address + Total Square Footage (calculated from 5 room captures)

**Room Dimensions:** All 5 rooms with icon, name, W × D × H, and sq ft

**Comparable Properties:** 3 nearby homes with address, sale price, sold date, distance

> "The estimate is calculated from the room dimensions we just captured, combined with state-level price-per-sqft data. The comparables are generated from the same base value — in production these would be live MLS data. The 90% confidence score is surfaced so the user understands the precision."

Three CTAs at the bottom — lead with the primary one:

**Click:** `💡 See How to Increase Value`

---

### 8. Recommendations Page ← **Second Payoff**

Loading animation plays through 5 steps (~4.4 seconds), then reveals:

**Summary Banner:**
> "We found 6 recommendations | Potential value increase: $X,XXX – $X,XXX"

**6 Improvement Cards** with priority badges (Critical / High Priority / Recommended), each showing:
- Improvement area (HVAC, Roof, Kitchen, Bathroom, Exterior, Energy Efficiency)
- Description
- Estimated cost range
- Projected value increase
- Typical ROI %
- Market insight tip

> "The recommendation engine scores based on property age, stated condition from the verification wizard, and typical ROI data. A Critical badge means the improvement has the highest impact relative to cost. This is the 'so what do I do now?' answer for a homeowner."

---

## Closing Frame (1 minute)

> "What you saw is end-to-end — address entry through valuation through personalized recommendations, all in under 5 minutes on a phone. The AI runs locally in the browser, so no data leaves the device. The two areas that would need real integrations in production are: live MLS data for comparables, and actual LiDAR depth scanning on supported hardware.
>
> The bigger question I'd want your input on: does this feel like a consumer-facing tool, an internal tool for appraisers, or something in between? And where do you see this fitting in the broader appraisal workflow?"

---

## Optional: Show Both Versions Side-by-Side

If you want to contrast V1 and V2 for Khurram:

| | V1 (This App) | V2 Conversational |
|--|---------------|-------------------|
| UX | Step-by-step wizard | Chat interface |
| Camera | Live + LiDAR mock | UI only |
| Flow time | ~5 min | ~3 min |
| Output | Results + Recommendations pages | Cards in chat |
| Framing | Mobile app prototype | AI product concept |

> "V1 shows the full property capture experience. V2 explores whether a conversational AI could replace the form flow entirely — zero typing, pure chip selection."

---

## If Things Go Wrong

| Issue | Fix |
|-------|-----|
| Camera doesn't activate | Browser will show a file upload fallback — use it to upload any phone photo |
| TensorFlow quality overlay doesn't appear | Graceful degradation — camera still works, just no real-time feedback |
| Page loads slowly first time | TensorFlow CDN loading — show landing page while it caches |
| "No property data found" error | LocalStorage cleared — restart from index.html |
| LiDAR animation doesn't play | Refresh and recapture — occasional timing edge case |

---

## Key Talking Points

- **15 minutes vs. 7–10 days** — the core value prop
- **Zero external APIs** — fully self-contained prototype, runs offline after first load
- **TensorFlow in the browser** — real AI quality analysis, no backend needed
- **LiDAR-ready architecture** — mock today, real depth data when hardware supports it
- **Complete flow** — all 8 pages, 6 phases, nothing is a placeholder
- **Netlify-deployable** — can be live on a URL in under 5 minutes

---

*Rocket Valuation V1 · Demo Script · 2026-05-11*
