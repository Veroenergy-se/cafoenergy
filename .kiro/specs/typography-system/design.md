# Typography System Design

## Overview

This design establishes a custom brand typography system for Vero that combines energetic display fonts with clean, readable body text. The system uses a two-font approach: a bold, modern display font for headlines and impact text, paired with a clean sans-serif for body content and UI elements.

## Architecture

### Font Strategy
- **Primary Display Font**: Bold, energetic font for headlines, hero titles, and key messaging
- **Secondary Body Font**: Clean, readable sans-serif for paragraphs, navigation, and UI text
- **Fallback System**: Comprehensive fallbacks ensuring text displays on all devices
- **Performance First**: Optimized loading with font-display: swap and preloading

### Font Loading Architecture
```
1. Preload critical fonts (hero title font)
2. Load display font with font-display: swap
3. Load body font with font-display: swap
4. Apply fonts through CSS custom properties
5. Override existing inconsistent declarations
```

## Font Selection

### Option A: Energetic & Bold (Recommended)
**Display Font: "Outfit" or "Space Grotesk"**
- Bold, modern geometric sans-serif
- Excellent for headlines and impact text
- Strong personality that matches energy brand
- Good web performance and readability

**Body Font: "Inter" or "DM Sans"**
- Highly readable at all sizes
- Professional yet friendly
- Excellent for UI and body text
- Optimized for screens

### Option B: Athletic & Dynamic
**Display Font: "Poppins" (600-900 weights)**
- Rounded, friendly but strong
- Popular in fitness/health brands
- Great for energetic messaging

**Body Font: "Source Sans Pro"**
- Clean, professional
- Excellent readability
- Wide language support

### Option C: Premium & Modern
**Display Font: "Montserrat" (700-900 weights)**
- Geometric, premium feel
- Strong brand presence
- Works well for energy/fitness

**Body Font: "Open Sans"**
- Highly readable
- Neutral and professional
- Excellent cross-platform support

## Typography Scale

### Font Sizes (using rem units)
```css
/* Display Sizes */
--font-size-hero: 4.5rem;      /* Hero title */
--font-size-display: 3.5rem;   /* Section headlines */
--font-size-h1: 2.5rem;        /* Page titles */
--font-size-h2: 2rem;          /* Section titles */
--font-size-h3: 1.5rem;        /* Subsection titles */

/* Body Sizes */
--font-size-large: 1.25rem;    /* Large body text */
--font-size-base: 1rem;        /* Standard body text */
--font-size-small: 0.875rem;   /* Small text, captions */
--font-size-xs: 0.75rem;       /* Fine print */
```

### Font Weights
```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
--font-weight-black: 900;
```

### Line Heights
```css
--line-height-tight: 1.1;      /* Headlines */
--line-height-normal: 1.5;     /* Body text */
--line-height-relaxed: 1.75;   /* Long-form content */
```

## Implementation Strategy

### CSS Custom Properties System
```css
:root {
  /* Font Families */
  --font-display: 'Outfit', 'Poppins', system-ui, sans-serif;
  --font-body: 'Inter', 'DM Sans', system-ui, sans-serif;
  
  /* Font Sizes - Responsive */
  --font-size-hero: clamp(2.5rem, 8vw, 4.5rem);
  --font-size-display: clamp(2rem, 6vw, 3.5rem);
  
  /* Typography Combinations */
  --hero-typography: var(--font-weight-black) var(--font-size-hero)/var(--line-height-tight) var(--font-display);
  --heading-typography: var(--font-weight-bold) var(--font-size-h2)/var(--line-height-tight) var(--font-display);
  --body-typography: var(--font-weight-normal) var(--font-size-base)/var(--line-height-normal) var(--font-body);
}
```

### Global Font Application
```css
/* Reset and apply consistent fonts */
* {
  font-family: var(--font-body);
}

/* Display elements */
h1, h2, h3, .hero-title, .display-text {
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

/* Hero title specific */
.hero-title, .hero-headline {
  font: var(--hero-typography);
  letter-spacing: -0.02em;
}
```

## Component Specifications

### Hero Title Treatment
```css
.hero-headline {
  font-family: var(--font-display);
  font-size: var(--font-size-hero);
  font-weight: var(--font-weight-black);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.hero-headline .headline-script {
  font-style: italic;
  font-weight: var(--font-weight-extrabold);
  color: var(--accent-color);
}
```

### Section Headers
```css
.section-title {
  font-family: var(--font-display);
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin-bottom: 1.5rem;
}
```

### Body Text
```css
.body-text, p, .description {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}
```

## Font Loading Strategy

### HTML Head Implementation
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/outfit-black.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-regular.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font face declarations -->
<style>
@font-face {
  font-family: 'Outfit';
  src: url('/fonts/outfit-black.woff2') format('woff2');
  font-weight: 900;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
</style>
```

### Google Fonts Alternative (Faster Implementation)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Responsive Typography

### Mobile Scaling
```css
@media (max-width: 768px) {
  :root {
    --font-size-hero: clamp(2rem, 10vw, 3rem);
    --font-size-display: clamp(1.5rem, 8vw, 2.5rem);
    --font-size-h1: 1.75rem;
    --font-size-h2: 1.5rem;
  }
}

@media (max-width: 480px) {
  :root {
    --font-size-hero: 2rem;
    --font-size-display: 1.75rem;
  }
  
  .hero-headline {
    letter-spacing: -0.01em;
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Font Consistency
*For any* text element on the website, it should use only the defined display font or body font from the typography system
**Validates: Requirements 2.1, 2.2, 2.3**

### Property 2: Hierarchy Clarity
*For any* page with multiple heading levels, each heading level should have a visually distinct font size that creates clear information hierarchy
**Validates: Requirements 3.1, 3.2, 3.5**

### Property 3: Responsive Scaling
*For any* viewport size, text should remain readable and maintain appropriate proportions without horizontal scrolling
**Validates: Requirements 5.1, 5.2, 5.3**

### Property 4: Performance Loading
*For any* page load, fonts should display immediately with fallbacks and swap to custom fonts without layout shift
**Validates: Requirements 6.1, 6.2, 6.4**

### Property 5: Accessibility Compliance
*For any* text element, it should maintain sufficient contrast ratio and support browser zoom up to 200%
**Validates: Requirements 7.1, 7.2, 7.3**

### Property 6: Brand Consistency
*For any* display text (headlines, hero titles), it should use the energetic display font that reflects Vero's brand personality
**Validates: Requirements 1.1, 4.1, 4.2**

### Property 7: Maintenance Efficiency
*For any* typography change, it should be implementable through CSS custom property updates without touching individual selectors
**Validates: Requirements 8.1, 8.2, 8.3**

## Error Handling

### Font Loading Failures
- Comprehensive fallback fonts ensure text always displays
- System fonts provide reliable backup options
- Font-display: swap prevents invisible text during loading

### Performance Issues
- Preload critical fonts to minimize loading delays
- Use font-display: swap for immediate text rendering
- Limit font variations to essential weights only

### Accessibility Concerns
- Maintain minimum contrast ratios for all text
- Use relative units for scalable typography
- Ensure sufficient line spacing for readability

## Testing Strategy

### Visual Regression Testing
- Screenshot comparison across different devices
- Font rendering verification on various browsers
- Loading performance measurement

### Accessibility Testing
- Contrast ratio validation for all text combinations
- Screen reader compatibility verification
- Zoom functionality testing up to 200%

### Performance Testing
- Font loading speed measurement
- Layout shift detection during font swapping
- Bundle size impact assessment