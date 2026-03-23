# RDS Design System Alignment

## Overview
This document describes how the V2 Conversational AI interface aligns with Rocket's Design System (RDS) standards.

## Color Palette
Applied RDS color standards with Rocket brand colors:

- **Primary Red**: `#DE3341` (red-500) - Primary actions, focus states
- **Dark Red**: `#590213` (red-900) - Hover states
- **Light Pink**: `#FEE8F4` (red-50) - Subtle backgrounds, hover accents
- **Putty**: `#F3EEE7` (gray-50) - Secondary backgrounds
- **White**: `#FFFFFF` - Dominant background (most prominent)
- **Black**: `#111111` (gray-900) - Primary text

## Spacing Standards
Aligned with RDS 4px increment system:
- `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`
- Utility classes: `rkt-Spacing--mb8`, `rkt-Spacing--mb12`, `rkt-Spacing--pa16`

## Elevation (Shadows)
Implemented Material Design elevation scale:
- `rkt-Elevation-1`: Subtle (chips, cards at rest)
- `rkt-Elevation-2`: Light (cards on hover, progress bars)
- `rkt-Elevation-3`: Medium (elevated cards, sliders on hover)
- `rkt-Elevation-4`: High (modals, dropdowns)
- `rkt-Elevation-5`: Very high (important overlays)

## Component Alignment

### Buttons
- **Classes**: `rkt-Button`, `rkt-Button--primary`, `rkt-Button--secondary`
- **Styling**: 4px border-radius, 12px/24px padding, 44px min-height
- **States**: Hover with elevation-2, disabled with opacity

### Chips
- **Classes**: `rkt-Chip`, `rkt-Chip--is-selected`
- **Styling**: 16px border-radius, 8px/16px padding, 1px border
- **States**: Hover with elevation-1, selected with red background

### Category Tiles (Cards)
- **Classes**: `rkt-Card`, `rkt-Card--category`, `rkt-Card--is-selected`
- **Styling**: 8px border-radius, 24px padding, elevation-1
- **Layout**: Grid with 140px minimum column width

### Slider
- **Classes**: `rkt-Slider`, `rkt-Slider--primary`, `rkt-Slider__label-container`
- **Styling**: 4px track height, 20px thumb size, elevation-2 on thumb
- **Behavior**: Smooth transitions, hover scale effect

### Progress Bar
- **Classes**: `rkt-ProgressBar`, `rkt-ProgressBar__fill`
- **Styling**: 4px height, red gradient fill, 0.5s transition
- **Layout**: Putty background container with step indicators

### Confidence Meter
- **Classes**: `rkt-ConfidenceMeter`, `rkt-ConfidenceMeter__fill`
- **Styling**: 8px bar height, animated fill, putty background
- **Display**: Percentage value + descriptive message

### Badges (Completion)
- **Classes**: `rkt-Badge`, `rkt-Badge--success`
- **Styling**: 12px border-radius, green background, popIn animation
- **Content**: Checkmark icon + text label

### Message Cards (Inline Results)
- **Classes**: `rkt-Card`, `rkt-Card--tall`, `rkt-Card__content`
- **Styling**: 8px border-radius, 24px padding, elevation-2
- **Patterns**: Header with icon, value display, subtitle, badges

## Class Naming Convention
All components support dual class names for compatibility:

```css
/* Legacy + RDS */
.chip-button.rkt-Chip { }
.category-tile.rkt-Card--category { }
.slider-container.rkt-Slider-container { }
```

## RDS Utility Classes Added
- **Spacing**: `.rkt-Spacing--mb4` through `.rkt-Spacing--mb40`, `.rkt-Spacing--pa16`, `.rkt-Spacing--pa24`
- **Elevation**: `.rkt-Elevation-1` through `.rkt-Elevation-5`
- **Background**: `.rkt-BackgroundColor--white`, `.rkt-BackgroundColor--red-500`, `.rkt-BackgroundColor--gray-50`

## Visual Hierarchy
Following RDS standards:
1. **White dominates** - Primary background (90% of screen)
2. **Red accents** - Primary actions, selected states, values
3. **Black text** - Primary content (#111111)
4. **Putty backgrounds** - AI message bubbles, input containers
5. **Gray borders** - Subtle dividers, unselected states

## Interactive Patterns
All interactive elements follow RDS interaction patterns:
- **Hover**: Subtle elevation increase + color shift
- **Active/Selected**: Solid red background with white text
- **Focus**: Red border for keyboard navigation
- **Disabled**: Reduced opacity + cursor change
- **Transitions**: 0.2s for quick feedback, 0.5s for progress animations

## Accessibility
Aligned with RDS accessibility standards:
- Minimum 44px touch targets on buttons
- ARIA labels on interactive elements
- Keyboard navigation support (Enter/Space on chips)
- Sufficient color contrast ratios
- Focus indicators on form inputs

## Testing
View changes at `http://localhost:8000/v2conversational/` after restarting servers.

The interface now follows RDS standards while maintaining the conversational AI functionality.
