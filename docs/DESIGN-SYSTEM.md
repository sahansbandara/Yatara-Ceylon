# 🎨 Liquid Glass Design System

## Overview

The Yatara Ceylon **Liquid Glass Design System** is a premium glassmorphic UI framework built on Tailwind CSS. It creates a futuristic, luxury aesthetic through translucent surfaces, layered blurs, and golden accents — inspired by Apple's Liquid Glass and elevated for the world of luxury travel.

---

## Color Palette

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Deep Emerald | `#043927` | Primary brand, headings, backgrounds |
| Antique Gold | `#D4AF37` | Accents, highlights, interactive states |
| Off White | `#FAFAFA` | Backgrounds, body text contrast |

### Supporting Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Ocean 600 | `#0284C7` | Links, secondary accents |
| Forest 500 | `#22C55E` | Success states |
| Sand 400 | `#FACC15` | Warning states |

### Glass Tokens (Tailwind)
```
glass-white:        rgba(255, 255, 255, 0.12)
glass-white-medium: rgba(255, 255, 255, 0.4)
glass-white-strong: rgba(255, 255, 255, 0.7)
glass-dark:         rgba(4, 57, 39, 0.85)
glass-gold:         rgba(212, 175, 55, 0.15)
glass-border:       rgba(255, 255, 255, 0.25)
glass-border-gold:  rgba(212, 175, 55, 0.2)
```

---

## Typography

| Family | Font | Usage |
|--------|------|-------|
| `font-display` | Playfair Display | Hero headings, section titles, display text |
| `font-serif` | Cormorant Garamond | Subheadings, editorial accent text |
| `font-sans` | Montserrat | Body text, buttons, navigation, UI elements |

### Usage Examples
```html
<h1 class="font-display text-5xl">Signature Experiences</h1>
<h2 class="font-serif text-3xl italic">Our Heritage</h2>
<p class="font-sans text-sm tracking-[0.15em]">EXPLORE</p>
```

---

## Glass Component Classes

### `.liquid-glass`
Standard frosted glass panel — light background.
```css
background: linear-gradient(135deg, rgba(255,255,255,0.72), rgba(248,248,248,0.65));
backdrop-filter: blur(24px) saturate(180%);
border: 1px solid rgba(255,255,255,0.6);
```
**Use for:** General glass panels, overlays on light backgrounds.

### `.liquid-glass-dark`
Dark frosted glass — deep emerald base.
```css
background: linear-gradient(145deg, rgba(4,57,39,0.88), rgba(2,40,26,0.92));
backdrop-filter: blur(28px) saturate(200%);
border: 1px solid rgba(212,175,55,0.15);
```
**Use for:** Dark sections, mobile menus, testimonial cards.

### `.liquid-glass-gold`
Gold-accented glass — subtle golden tint.
**Use for:** Accent panels, featured badges, highlight areas.

### `.liquid-glass-card`
Glass card with hover effects (uplift + gold border glow).
**Use for:** Package cards, feature cards, grid items.

### `.liquid-glass-card-dark`
Dark glass card with gold hover halo.
**Use for:** Testimonial cards, dark-section grid items.

### `.liquid-glass-stat`
Dashboard stat card with corner glow effect.
**Use for:** KPI cards, dashboard overview sections.

### `.liquid-glass-input`
Glass-styled form input.
**Use for:** Form fields on light glass backgrounds.

### `.liquid-glass-input-dark`
Dark glass input with gold focus ring.
**Use for:** Newsletter inputs, dark section forms.

### `.liquid-glass-button`
Glass button with shine sweep effect on hover.
**Use for:** Hero CTAs, overlay buttons, glass-context actions.

---

## Navbar States

| Class | State | Description |
|-------|-------|-------------|
| `.navbar-transparent` | Homepage hero | Fully transparent, no blur |
| `.navbar-scrolled` | After scroll (60px+) | Frosted glass with gold border-bottom |
| `.navbar-dropdown` | Dropdown menus | High-blur glass dropdown panel |

---

## Animations

| Class | Effect | Duration |
|-------|--------|----------|
| `animate-fade-in-up` | Fade in from below | 0.6s |
| `animate-slide-in-left` | Slide from left | 0.6s |
| `animate-slide-in-right` | Slide from right | 0.6s |
| `animate-scale-reveal` | Scale up from 90% | 0.5s |
| `animate-text-reveal` | Fade + rise + de-blur | 0.8s |
| `animate-float-soft` | Gentle up/down float | 4s loop |
| `animate-glass-shine` | Light streak sweep | 3s loop |
| `animate-pulse-glow` | Gold glow pulse | 2s loop |
| `animate-marquee` | Marquee scroll | 30s loop |
| `animate-counter-up` | Number entrance | 0.5s |

### Delay Utilities
```html
<div class="animate-fade-in-up animate-delay-100">First</div>
<div class="animate-fade-in-up animate-delay-200">Second</div>
<div class="animate-fade-in-up animate-delay-300">Third</div>
```

---

## Section Utilities

| Class | Description |
|-------|-------------|
| `.section-container` | Max-width container with responsive padding |
| `.section-divider-glass` | Glowing gold horizontal divider line |
| `.gradient-text` | Ocean blue gradient text |
| `.gradient-text-gold` | Gold shimmer gradient text |
| `.gold-shimmer-text` | Animated gold shimmer text |
| `.glass-shine` | Glass shine sweep effect on any element |
| `.marquee-strip` | Auto-scrolling horizontal strip |
| `.hover-lift` | Hover uplift with shadow enhancement |

---

## Dashboard Utilities

| Class | Description |
|-------|-------------|
| `.dashboard-sidebar-glass` | Dark glass sidebar background |
| `.dashboard-content-glass` | Mesh gradient content area |
| `.dashboard-header-glass` | Frosted glass header bar |
| `.sidebar-link` | Sidebar navigation item |
| `.sidebar-link-active` | Active sidebar item (gold glass glow) |
| `.data-table` | Glass-themed data table |

---

## Best Practices

1. **Never use both `liquid-glass` and `bg-white`** — glass replaces solid backgrounds
2. **Use `rounded-2xl`** for glass cards, `rounded-xl` for smaller elements
3. **Gold accents are for interactive states** — hover, active, focus
4. **Keep text contrast high** — use `text-deep-emerald` on light glass, `text-off-white` on dark glass
5. **Layer decorative blurs** — Add `bg-antique-gold/5 rounded-full blur-3xl` as decorative background orbs
