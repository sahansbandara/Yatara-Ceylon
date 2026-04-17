# Yatara Ceylon — Style Contract

## Typography Scale

| Level | Font | Size (desktop) | Size (mobile) | Weight | Tracking |
|-------|------|----------------|---------------|--------|----------|
| H1 | Playfair Display | `text-6xl` / `text-7xl` | `text-4xl` / `text-5xl` | Regular + italic accent | `tracking-tight` |
| H2 | Playfair Display | `text-4xl` / `text-5xl` | `text-3xl` | Regular | `tracking-tight` |
| H3 | Playfair Display | `text-lg` / `text-xl` | `text-lg` | Regular | `tracking-wide` |
| Body | Montserrat | `text-base` / `text-lg` | `text-sm` / `text-base` | Light (300) | `tracking-wide` |
| Label | Montserrat | `text-xs` | `text-xs` | Medium (500) | `tracking-[0.3em]` uppercase |
| Watermark | Playfair Display | `text-[10rem]` / `text-[14rem]` | `text-[6rem]` | Bold | `tracking-wider` |

## Spacing Rules

| Context | Value |
|---------|-------|
| Section padding | `py-24` → `py-28` |
| Container max | `max-w-7xl` (1280px) |
| Container padding | `px-4 md:px-8` |
| Card gap (slider) | `gap-5` → `gap-6` |
| Section heading mb | `mb-14` |
| Inter-section spacing | Handled by section `py` |

## Card Rules

| Property | Value |
|----------|-------|
| Border radius | `rounded-2xl` (16px) |
| Shadow | `shadow-lg` |
| Image overlay | `bg-gradient-to-t from-black/70 via-black/10 to-transparent` |
| Hover transform | `group-hover:scale-110` (image), `translateY(-4px)` (card) |
| Card width (slider) | `280px` → `360px` responsive |

## Image Rules

| Context | Aspect Ratio | Treatment |
|---------|-------------|-----------|
| Hero side images | `4:5` portrait | `rounded-2xl`, subtle shadow |
| Category cards | `3:4` portrait | Gradient overlay from bottom, `rounded-2xl` |
| Section backgrounds | Full-bleed cover | Dark overlay 85-92% opacity |
| All images | — | `next/image`, `sizes` prop, `priority` on hero only |

## Button Rules

| Type | Style |
|------|-------|
| Icon-circle CTA | `w-10 h-10 rounded-full border-2 border-deep-emerald` + icon + label |
| Icon-circle hover | `border-antique-gold`, slight translate, shadow |
| Primary CTA | `h-14 px-12`, border, uppercase, `tracking-[0.2em]`, `text-xs` |
| Glass CTA | `liquid-glass-button` or `btn-glass-cta` class |

## Color Tokens (existing)

| Token | Value | Usage |
|-------|-------|-------|
| `deep-emerald` | `#043927` | Primary dark, text, nav |
| `antique-gold` | `#D4AF37` | Accents, CTAs, highlights |
| `off-white` | `#FAFAFA` | Backgrounds, light text |
| `ocean-50` | `#F0F9FF` | Section tint backgrounds |
| `glass-*` | Various rgba | Glassmorphism effects |
