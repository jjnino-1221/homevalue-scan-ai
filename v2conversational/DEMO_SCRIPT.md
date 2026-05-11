# Rocket Valuation V2 — Demo Script
**Audience:** Khurram Iftikhar (VP Product)  
**Duration:** ~10 minutes  
**Format:** Live walkthrough on laptop (or screen share)

---

## Before You Start

**Setup (do this 5 minutes before):**
```bash
cd v2conversational
npm start
# Server starts on port 3001

# In a second terminal:
python -m http.server 8001
# Open: http://localhost:8001/index.html
```

**Browser prep:**
- Use Chrome or Edge, full screen
- Open DevTools Console (F12) — glance for errors before presenting, then close it
- Zoom to 100% or simulate mobile (DevTools → Toggle Device → iPhone 14)
- Have the URL ready: `http://localhost:8001/index.html`

**What NOT to click during demo:**
- The microphone icon (top-right of chat) — not production-ready
- The camera icon (next to the text input) — UI only, no capture
- "Download PDF Report" — button exists but won't produce a file

---

## Opening Frame (30 seconds)

> "This is an early prototype of a conversational property valuation experience — the idea is to replace a long intake form with a guided chat that collects the same data, but feels fast and natural. I want to show you the full flow and get your reaction."

---

## Step-by-Step Walkthrough

### 1. Landing Page
**URL:** `http://localhost:8001/index.html`

Point out:
- Headline: *"Let's Evaluate Your Property"*
- Three value props: Conversational / Fast / Accurate
- "Takes 5–10 minutes" — sets expectation
- "V2 Conversational Demo" badge (top-right) — signals this is an intentional prototype

> "The landing page is simple by design — one CTA, one job."

**Click:** `Start Conversation`

---

### 2. Welcome — Intent Selection
Two chips appear:
- ✓ Yes, evaluate my property
- ❓ Do I need an appraisal?

> "Right away, zero typing. The whole experience is chip-based — the user never touches a keyboard."

**Click:** `✓ Yes, evaluate my property`

---

### 3. Address Selection
Three addresses appear as chips:
- 123 Main Street, Detroit MI 48226
- 456 Oak Avenue, Ann Arbor MI 48103  
- 789 Maple Drive, Grand Rapids MI 49503

> "In a real integration, this list would be pre-populated from the user's account or a property lookup. Here it's seeded data."

**Click:** `123 Main Street, Detroit MI 48226`

---

### 4. Property Verification Loop (Steps 7–12)
The AI confirms each detail in turn. Click to confirm each one:

| Prompt | Click |
|--------|-------|
| Property type | `Single Family` |
| Year built | `1950` |
| Square footage | `1,800 sq ft` |
| Bedrooms | `3` |
| Bathrooms | `2.5` |
| Garage | `2-car` |

> "This mirrors how an appraiser would verify data — but the user is in control, not filling out a form. Each confirm is one tap."

---

### 5. Condition Assessment (Steps 13–16)
Click through:

| Prompt | Click |
|--------|-------|
| HVAC age | `6–10 years` |
| Roof age | `6–10 years` |
| Kitchen condition | `Partially Updated` |
| Recent improvements (multi-select) | `Kitchen` + `Roof` → then `Done` |

> "This is the multi-select step — the Done button appears as soon as you pick two or more. 'None' acts as a single-select and skips ahead automatically."

---

### 6. Describe Improvements
Chip options appear. Click: `High-end upgrades`

---

### 7. Photos
**Click:** `Skip photos`

> "Photo capture is in the UI — the modal is built — but for this demo we're skipping it. In a future state, photos would feed into the valuation model."

---

### 8. Loading State
A brief "calculating" message auto-advances. Let it run (~1.5 seconds).

---

### 9. Valuation Card ← **Main Payoff**
The result card appears:

```
Estimated Value: $270,000 — $300,000
Most Likely: $285,000
Confidence: 92%
Price/sqft: $158
```

> "This is the main output — a value range with a confidence score. The 92% is the model's confidence level. In production this would pull from real AVM data."

Point out the three action buttons: `View Comparables` / `View Recommendations` / `Download PDF Report`

---

### 10. Comparables
**Click:** `View Comparables`

Three cards appear:
- 145 Oak Ave — $275,000 | 1,750 sqft | 0.5 mi
- 89 Elm Street — $292,000 | 1,850 sqft | 0.7 mi
- 210 Maple Dr — $288,000 | 1,800 sqft | 0.9 mi

Summary: *"Your property's estimated value of $285,000 is right in line with these comparable homes."*

> "Three nearby comps with a plain-language summary. The goal is that a homeowner can understand this without a real estate background."

---

### 11. Recommendations
**Click:** `View Recommendations`

Five cards appear with ROI estimates:
1. Kitchen Update — ROI 120%, +$20K–$30K value
2. Bathroom Refresh — ROI 125%, +$10K–$18K value
3. Curb Appeal — ROI 150%, +$5K–$12K value
4. HVAC Upgrade — ROI 115%, +$8K–$15K value
5. Flooring Update — ROI 120%, +$6K–$12K value

Banner: *"5 recommendations | Potential value increase: $35,000–$55,000"*

> "Each recommendation shows investment range, projected value add, and ROI — so a homeowner can prioritize. This is the 'what should I do next' answer."

---

### 12. Optional: Appraisal Waiver Path
If Khurram asks about the other chip from Step 2:

> "There's a second path — if someone taps 'Do I need an appraisal?', it walks them through a short eligibility check: transaction type, property value tier, known issues. It outputs a waiver assessment — may qualify, may qualify with conditions, or appraisal required."

You can demonstrate this by clicking `Start New Evaluation` and choosing the second chip.

---

## Closing Frame (1 minute)

> "What you saw is a fully functional prototype — chip-based flow, three result views, RDS design system compliant. The backend is mocked so the conversation is deterministic for demo purposes, but the real Claude API integration is already wired and ready to switch on.
>
> The big questions I'd want your input on: Does this flow feel like the right direction for self-service valuation? And where do you see this fitting — standalone tool, embedded in the Portal, something else?"

---

## If Things Go Wrong

| Issue | Fix |
|-------|-----|
| Page won't load | Confirm both `npm start` and `python -m http.server 8001` are running |
| Chips don't appear | Refresh the page — LocalStorage may have a stale session |
| Conversation seems stuck | Open DevTools Console, look for red errors; refresh usually resolves |
| Microphone prompt appears | Click Cancel — the feature is inactive, it won't block the flow |
| Camera modal opens | Close it with the X — won't affect conversation state |

---

## Key Talking Points (in your own words)

- **Zero typing** — entire flow is chip-based; mobile-first by design
- **22-step flow** — comprehensive property data collection in ~5 minutes
- **Three output views** — Valuation, Comparables, Recommendations
- **Mock mode** — deterministic for demos; real API is one config change away
- **RDS compliant** — uses official Nova design tokens; production-ready styling
- **Prototype framing** — this is a UX proof-of-concept, not a shipped feature

---

*Rocket Valuation V2 · Demo Script · 2026-05-11*
