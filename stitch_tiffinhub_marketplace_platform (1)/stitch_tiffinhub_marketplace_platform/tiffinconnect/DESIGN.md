---
name: TiffinConnect
colors:
  surface: '#fff8f6'
  surface-dim: '#e9d6ce'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#feeae1'
  surface-container-high: '#f8e4dc'
  surface-container-highest: '#f2dfd6'
  on-surface: '#231915'
  on-surface-variant: '#564339'
  inverse-surface: '#392e29'
  inverse-on-surface: '#ffede6'
  outline: '#897267'
  outline-variant: '#ddc1b4'
  surface-tint: '#9d4300'
  primary: '#783100'
  on-primary: '#ffffff'
  primary-container: '#9d4300'
  on-primary-container: '#ffceb6'
  inverse-primary: '#ffb690'
  secondary: '#785a00'
  on-secondary: '#ffffff'
  secondary-container: '#fdc425'
  on-secondary-container: '#6d5200'
  tertiary: '#004688'
  on-tertiary: '#ffffff'
  tertiary-container: '#005eb2'
  on-tertiary-container: '#c5d9ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#ffdf9a'
  secondary-fixed-dim: '#f7be1d'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4300'
  tertiary-fixed: '#d5e3ff'
  tertiary-fixed-dim: '#a7c8ff'
  on-tertiary-fixed: '#001b3c'
  on-tertiary-fixed-variant: '#004788'
  background: '#fff8f6'
  on-background: '#231915'
  surface-variant: '#f2dfd6'
  cream-bg: '#fdfcf0'
  terracotta: '#9d4300'
  mustard: '#eab308'
  leaf-success: '#006e2f'
  slate-neutral: '#334155'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 32px
  margin-desktop: 64px
  section-gap: 96px
  unit-base: 8px
---

## Brand & Style
The brand personality of the design system is "Curated Warmth." It transitions from a simple utility to a premium, high-trust desktop marketplace that connects discerning consumers with artisanal home kitchens. The target audience includes urban professionals and families who value authenticity and quality over speed.

The design style is **Corporate / Modern** with a **Tactile** overlay. It utilizes expansive whitespace and generous roundedness to create a "homely" atmosphere while maintaining the structural integrity of a professional financial and logistical platform. The aesthetic is designed to feel permanent and reliable, moving away from the ephemeral nature of mobile-first apps toward a robust, editorial-grade marketplace experience.

## Colors
The palette is a sophisticated blend of earthen tones and clean neutrals, designed to evoke the sensory experience of a kitchen.

- **Primary (Terracotta):** The seed color `#9d4300` serves as the primary brand anchor, used for key actions and navigational focus. It provides a grounded, organic energy.
- **Secondary (Mustard):** A warm yellow `#eab308` is used for accents, ratings, and promotional highlights, providing a sun-drenched contrast to the terracotta.
- **Neutral (Cream & Slate):** The primary background is a rich Cream (`#fdfcf0`), which softens the digital experience. Slate is used for high-contrast typography to ensure legibility.
- **Success (Leaf):** A deep green used specifically for health certifications, fresh-daily indicators, and "Verified" statuses.

## Typography
The typography system prioritizes the "Safe" visual identity, using **Plus Jakarta Sans** for headlines to convey a welcoming, modern friendliness. The character of this font, with its soft terminals and balanced geometry, bridges the gap between tech and home life.

**Inter** is utilized for body text and functional labels, providing world-class legibility for ingredient lists, reviews, and delivery details. On desktop, the system leans into larger scales and increased line heights (up to 1.6x for body text) to take advantage of the wide-screen real estate and create an effortless reading experience.

## Layout & Spacing
The layout philosophy is built on a **Fixed Grid** model for desktop, centered around a 1440px canvas. This allows the marketplace to feel contained and premium, rather than sprawling.

- **Grid:** A 12-column grid with generous 32px gutters ensures that content blocks remain distinct.
- **Rhythm:** A strict 8px vertical rhythm is applied. To achieve the "premium" feel requested, section spacing is expanded to 96px, and container margins on the desktop are set to 64px.
- **Responsive Reflow:** On tablet and desktop, the interface favors multi-column card layouts (3 or 4 per row), while side-panels are used for persistent filters and shopping carts to reduce navigation fatigue.

## Elevation & Depth
Hierarchy in this design system is established through **Tonal Layering** supplemented by soft, architectural shadows.

- **Surface Tiering:** The Cream background acts as the "Floor." Primary content containers (like marketplace cards) are Pure White, creating a natural elevation. 
- **Shadows:** We use "Ambient Lift"—extra-diffused shadows with very low opacity (3-5%) and a slight Terracotta tint to the shadow color to maintain warmth. Shadows should have a large blur radius (40px+) to feel soft and non-threatening.
- **Overlays:** Glassmorphism is used sparingly for sticky navigation bars, using a high-density blur (20px) to keep the focus on the vibrant food photography beneath while providing a premium, translucent feel.

## Shapes
The shape language is the cornerstone of the "homely" feel. A high level of roundedness (Level 3 / Pill-shaped) is used to eliminate sharp "industrial" corners.

- **Main Containers:** All primary marketplace cards and modal windows use a minimum of 24px (1.5rem) or 32px (2rem) corner radius.
- **Interactive Elements:** Buttons and tags use a full pill-shape (infinite radius) to create a soft, inviting touch target.
- **Images:** Food photography is always presented with rounded corners to integrate seamlessly with the soft UI elements.

## Components

### Buttons
Primary buttons are pill-shaped, using the Terracotta fill with White text. For desktop, these include a subtle 2px vertical offset shadow on hover to simulate physical press-ability. Secondary buttons use a Mustard outline with a 1.5px stroke.

### Cards
Marketplace cards are the core component. They feature a 32px corner radius, a Pure White surface, and a 1px soft Cream border. On desktop, cards utilize a horizontal layout for "Featured Kitchens" and a vertical grid for "Daily Specials."

### Input Fields
Inputs are large (min-height 56px) with a 16px corner radius. The focus state replaces the standard blue with a 2px Terracotta glow. Search bars are pill-shaped and include a subtle inner shadow to suggest depth.

### Chips & Badges
Used for cuisine types and dietary restrictions. These are small, pill-shaped elements with low-saturation backgrounds (e.g., 10% Terracotta or 10% Leaf Green) and high-saturation text.

### Navigation
The desktop header is a floating white container with a 40px roundedness, sitting 24px from the top of the viewport. It uses a heavy backdrop blur to maintain the "premium" layered aesthetic.

### Lists & Tables
Data-heavy views (like order history) use "Striped Rows" where the alternating color is a very light Mustard-Cream, ensuring the table feels part of the warm brand ecosystem rather than a cold spreadsheet.