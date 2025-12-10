# Auto-Responsive Design System

## Overview

The SteChX platform now features a **universal responsive design system** that automatically adjusts all content for every device size - from tiny mobile phones to large desktop screens.

## Responsive Breakpoints

The system automatically adjusts at 7 key breakpoints:

| Device | Width Range | Font Size | Padding | Grid |
|--------|-------------|-----------|---------|------|
| **Extra Small Mobile** | ≤400px | 0.9rem | 12px | 1 column |
| **Small Mobile** | 401-600px | 0.95rem | 14px | 1-2 columns |
| **Tablet Portrait** | 601-768px | 0.98rem | 20px | 2 columns |
| **Tablet Landscape** | 769-1024px | 0.99rem | 24px | 2-3 columns |
| **Small Laptop** | 1025-1199px | 1rem | 28px | 2-3 columns |
| **Medium Laptop** | 1200-1439px | 1.02rem | 32px | 3 columns |
| **Large Desktop** | 1440px+ | 1.05rem | 40px | 3-4 columns |

## Heading Sizes

Headings automatically scale at each breakpoint:

```html
<!-- Desktop (1440px+) -->
<h1>3.5rem</h1>  <!-- Extra Large -->
<h2>2.5rem</h2>  <!-- Large -->
<h3>1.75rem</h3> <!-- Medium -->

<!-- Mobile (≤400px) -->
<h1>1.75rem</h1>  <!-- Compact -->
<h2>1.5rem</h2>   <!-- Compact -->
<h3>1.25rem</h3>  <!-- Compact -->
```

## Responsive Utility Classes

### Container
```html
<!-- Auto-responsive container with proper padding -->
<div class="stechx-container-responsive">
  Content automatically adjusts padding and max-width
</div>
```

### Spacing
```html
<!-- Responsive padding -->
<div class="stechx-py-responsive">
  Padding adjusts: 1.5rem (mobile) → 3.5rem (desktop)
</div>

<!-- Responsive margin -->
<div class="stechx-my-responsive">
  Margin adjusts: 1rem (mobile) → 2rem (desktop)
</div>
```

### Grid Layouts
```html
<!-- Auto-fit grid - 1 column mobile, scales to 3-4 desktop -->
<div class="stechx-grid-responsive">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- 2-column grid - scales automatically -->
<div class="stechx-grid-2">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

<!-- 3-column grid - scales automatically -->
<div class="stechx-grid-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Flexible Layouts
```html
<!-- Flexbox that wraps on mobile -->
<div class="stechx-flex-responsive">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Gap/Spacing Between Elements
```html
<div class="stechx-gap-responsive">
  Gap adjusts: 0.75rem (mobile) → 2.25rem (desktop)
</div>
```

## Text Alignment Utilities

```html
<!-- Center text on mobile, normal alignment on desktop -->
<p class="stechx-text-center-mobile">
  Centered on mobile, left-aligned on desktop
</p>
```

## Show/Hide Utilities

```html
<!-- Hide on mobile, show on tablet+ -->
<div class="stechx-hide-mobile">Desktop-only content</div>

<!-- Show on mobile, hide on tablet+ -->
<div class="stechx-show-mobile">Mobile-only content</div>
```

## How It Works

The system uses **CSS media queries** to automatically adjust:
- ✅ Font sizes
- ✅ Padding and margins
- ✅ Grid columns
- ✅ Gap spacing
- ✅ Container width
- ✅ Element visibility

All adjustments happen **without changing HTML** - just add the class!

## Example Usage

```tsx
// Hero section that auto-responds
<section className="stechx-container-responsive stechx-py-responsive">
  <h1 className="stechx-h1">Responsive Title</h1>
  <p className="stechx-p">Auto-adjusting paragraph text</p>
  
  <div className="stechx-grid-3 stechx-gap-responsive">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
  </div>
</section>
```

## Applied Pages

✅ All pages now use this responsive system:
- Home page
- About page
- Services page
- Contact page
- Portfolio page
- Talent page
- All dashboard pages

## Device Coverage

### Mobile Phones 📱
- iPhone SE, iPhone 12-15 (375px)
- Samsung Galaxy S20-S24 (360px)
- Google Pixel (360-412px)
- OnePlus (412px)

### Tablets 📱
- iPad Mini (768px)
- iPad Air/Pro (1024px)
- Samsung Galaxy Tab (600px)

### Laptops 💻
- MacBook Air (1280px, 1440px)
- MacBook Pro (1440px, 1728px, 2560px)
- Windows Laptop (1366px, 1920px)
- Desktop Monitor (2560px+)

## Custom Breakpoints

To add custom breakpoints, modify the media queries in `globals.css`:

```css
/* Custom breakpoint */
@media (min-width: 1800px) {
  h1 { font-size: 4rem !important; }
  .stechx-grid-3 { grid-template-columns: repeat(5, 1fr) !important; }
}
```

## Performance Notes

- ✅ Zero JavaScript - pure CSS responsive design
- ✅ Mobile-first approach - faster load times
- ✅ No layout shift - dimensions calculated upfront
- ✅ Automatic - no manual breakpoint management

## Testing Responsive Design

Use browser DevTools:
1. Press F12 (or Cmd+Option+I on Mac)
2. Click the device icon (📱)
3. Select different devices
4. Rotate between portrait/landscape
5. Resize manually to test all breakpoints

All content will auto-adjust smoothly!
