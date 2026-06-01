---
name: Lumina Consulting
description: Custom e-commerce sites for growing brands
colors:
  baby-blue: "oklch(0.84 0.09 230)"
  coastal-teal: "oklch(0.70 0.12 178)"
  midnight-slate: "oklch(0.18 0.04 240)"
  cool-fog: "oklch(0.99 0.005 240)"
  soft-ice: "oklch(0.975 0.015 230)"
  muted-steel: "oklch(0.55 0.03 240)"
  subtle-border: "oklch(0.92 0.01 240)"
typography:
  display:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "clamp(2.75rem, 6vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.04em"
  hero:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "clamp(2.625rem, 6.5vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.18em"
rounded:
  full: "9999px"
  xl: "1rem"
  2xl: "1.5rem"
spacing:
  section-y: "clamp(5rem, 10vw, 8rem)"
  container-x: "clamp(1.25rem, 4vw, 4rem)"
  prose-gap: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.baby-blue}"
    textColor: "{colors.midnight-slate}"
    rounded: "{rounded.full}"
    padding: "12px 30px"
  button-primary-hover:
    backgroundColor: "oklch(0.78 0.11 230)"
  button-dark:
    backgroundColor: "{colors.midnight-slate}"
    textColor: "{colors.cool-fog}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  button-outlined:
    textColor: "{colors.midnight-slate}"
    rounded: "{rounded.full}"
    padding: "12px 30px"
  badge:
    backgroundColor: "oklch(1 0 0 / 0.70)"
    textColor: "{colors.muted-steel}"
    rounded: "{rounded.full}"
    padding: "5px 15px"
  section-label:
    textColor: "oklch(0.7 0.13 230)"
    typography: "{typography.label}"
---

# Design System: Lumina Consulting

## 1. Overview

**Creative North Star: "The Coastal Blueprint"**

Technical precision softened by the calm of open water. The baby blue palette is a deliberate counterpoint to the rigor underneath: this is a studio that builds infrastructure-grade e-commerce sites, but presents that capability through calm, composed surfaces rather than aggressive tech aesthetics. The site should feel like a precisely engineered blueprint rendered in coastal light.

Every surface earns its space. Whitespace is structural, not decorative. Typography carries the hierarchy; color confirms it. Motion exists to guide attention, never to entertain. The result is a site that feels inevitable rather than designed.

This system explicitly rejects: gradient blobs and stock illustrations (generic SaaS energy), scroll-hijacking and parallax excess (Awwwards-bait), template DNA and clip-art icons (cheap freelancer portfolio). If someone could look at this and say "AI made that," it has failed.

**Key Characteristics:**

- Serif/sans pairing (Lora italic for authority, DM Sans for clarity)
- Single-hue OKLCH palette: baby blue at hue 230, tinted neutrals
- Pill-shaped interactive elements with tactile feedback (scale on press, glow on hover)
- Choreographed scroll entrances using a single exponential ease
- Dark sections (midnight slate) as rhythmic counterpoints, not theme switches
- Section eyebrow labels in spaced uppercase as structural markers

## 2. Colors: The Coastal Palette

A committed single-hue system. Baby blue carries identity across interactive elements, accents, and section tinting. Every neutral is tinted toward hue 230 to maintain chromatic unity. No pure black, no pure white.

### Primary

- **Baby Blue** (oklch(0.84 0.09 230)): The brand anchor. Used for primary buttons, active navigation indicators, focus rings, badge dots, hover glows, and the hero gradient. Carries roughly 15-20% of any light surface.
- **Coastal Teal** (oklch(0.70 0.12 178)): Secondary accent, shifted toward green. Used sparingly in hero gradient endpoints and decorative orbs. Never on interactive elements.

### Neutral

- **Midnight Slate** (oklch(0.18 0.04 240)): Primary text, dark section backgrounds, dark CTA buttons. The hue-tinted alternative to black.
- **Cool Fog** (oklch(0.99 0.005 240)): Page background. Near-white with a cool blue tint.
- **Soft Ice** (oklch(0.975 0.015 230)): Section tint backgrounds. The lightest blue used for alternating content rhythm.
- **Muted Steel** (oklch(0.55 0.03 240)): Secondary text, descriptions, body copy on light backgrounds.
- **Subtle Border** (oklch(0.92 0.01 240)): Hairline separators, card borders, input borders at rest.

### Named Rules

**The Single-Hue Rule.** Every color in the system lives on hue 230 (or 240 for neutrals). Coastal Teal at hue 178 is the only exception, and it appears only in decorative gradients, never on interactive surfaces. Introducing a second saturated hue would break the palette's calm.

**The Tinted Neutral Rule.** No color has zero chroma. Even the lightest surface carries `0.005` chroma toward the brand hue. This prevents the clinical feel of pure grayscale while keeping the palette restrained.

## 3. Typography

**Display Font:** Lora (with Georgia, serif)
**Body Font:** DM Sans (with system-ui, sans-serif)

**Character:** Lora in italic carries editorial weight and quiet confidence. DM Sans in regular provides clean, modern readability. The pairing creates a "refined journal" feel: authoritative headlines that slow the reader down, efficient body text that moves them forward.

### Hierarchy

- **Hero** (bold, clamp(2.625rem, 6.5vw, 5.25rem), line-height 1.05, tracking -0.04em): Homepage hero only. Two-line split: line 1 bold upright, line 2 semibold italic with gradient fill.
- **Display** (medium italic, clamp(2.75rem, 6vw, 4.5rem), line-height 1.06, tracking -0.04em): Section headings on inner pages (APropos, Contact). Always italic.
- **Section Heading** (medium, clamp(1.75rem, 3.5vw, 2.75rem), line-height 1.2, tracking -0.025em): H2 headings within slice sections.
- **Item Title** (medium italic, clamp(1.25rem, 2.5vw, 1.625rem), line-height 1.25, tracking -0.03em): Conviction titles, methodology step names, list item headings.
- **Body** (regular, 1.0625rem, line-height 1.9): All prose text. Max width capped at 50ch in centered contexts, uncapped in left-aligned containers.
- **Label** (semibold, 0.6875rem, tracking 0.18em, uppercase): Section eyebrows, navigation cues, attribute pills.

### Named Rules

**The Italic Authority Rule.** Display headings are always Lora italic. Upright Lora is reserved for hero line 1 only. This single convention unifies every page.

**The 50ch Rule.** Centered body text never exceeds 50 characters per line. Left-aligned prose in content sections can extend wider but should not exceed 65ch.

## 4. Elevation

The system is predominantly flat with tonal layering. Shadows appear as responses to state (hover, focus, floating elements), not as default resting decoration. Depth is conveyed through background color shifts (cool-fog to soft-ice to midnight-slate) rather than stacked shadow layers.

### Shadow Vocabulary

- **Ambient** (`0 10px 40px -10px oklch(0.25 0.03 240 / 0.06)`): Default card and container shadow. Barely perceptible; registers as "lifted" without drawing attention.
- **Glow** (`0 0 24px oklch(0.82 0.09 230 / 0.35)`): Brand-colored glow on primary button hover. The signature interactive feedback.
- **Card** (`0 1px 3px oklch(0.25 0.03 240 / 0.08), 0 4px 16px oklch(0.25 0.03 240 / 0.04)`): Two-layer card shadow for glassmorphic containers (Expertise cards).
- **CTA Hover** (`0 8px 40px oklch(0.25 0.04 240 / 0.22)`): Deep shadow for dark CTA buttons on hover. Creates a "pressing into surface" illusion.
- **Hero Badge** (`0 2px 14px oklch(0.84 0.09 230 / 0.10)`): Delicate blue-tinted shadow for the floating hero badge.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation change, focus). A page at rest should have zero visible shadows outside the navigation header's scroll shadow.

## 5. Components

### Buttons

- **Shape:** Fully rounded pill (border-radius: 9999px). No square or rounded-rectangle buttons anywhere.
- **Primary (Baby Blue):** Baby blue background, midnight slate text. Padding 12px 30px. Font: DM Sans 0.9375rem medium. On hover: background shifts to lumina-400, blue glow shadow appears (`0 0 28px oklch(0.84 0.09 230 / 0.42)`). On press: scale(0.97) with 300ms ease.
- **Dark (Midnight):** Midnight slate background, white text. Padding 14px 28px. Font: DM Sans 0.875rem semibold, tracking 0.04em. On hover: deep shadow appears. Used for CTA sections and inner-page closing blocks.
- **Outlined:** Transparent background, midnight slate text, 1.5px border in baby blue at 42% opacity. On hover: light blue background tint, border opacity increases to 72%.
- **Arrow pattern:** Dark and outlined buttons append a `→` character with `translate-x(0.5)` on hover. This micro-interaction is consistent across every CTA.

### Badge (Hero)

- **Style:** Frosted glass pill. White at 70% opacity, backdrop blur 14px, baby blue border at 28% opacity, delicate blue shadow.
- **Content:** Pulsing baby blue dot (scale 1 to 1.65, 2.4s loop) + uppercase label text.
- **Usage:** Hero section only. One per page maximum.

### Section Labels (Eyebrows)

- **Style:** DM Sans 0.6875rem, semibold, tracking 0.18em, uppercase, lumina-500 color.
- **Pattern:** Often preceded by an 8px horizontal accent line (baby blue at 50% opacity) with a 4-unit gap.
- **Usage:** Top of every content section. Establishes reading context before the heading.

### Cards (Expertise)

- **Corner Style:** Generously rounded (rounded-2xl, 1.5rem).
- **Background:** White at 70% opacity with backdrop blur 14px and saturate 180% (glassmorphic).
- **Border:** White at 60% opacity, 1px.
- **Shadow:** Card shadow at rest.
- **Internal Padding:** 2rem to 2.5rem (p-8 to p-10 responsive).

### Inputs (Contact Form)

- **Style:** Borderless with bottom hairline (lumina-100). Transparent background, no visible container.
- **Label:** Floating label pattern. Rests as placeholder, animates to small uppercase on focus/fill. Transition: all 300ms ease-out.
- **Focus:** Bottom border shifts to lumina-400. Label text becomes lumina-500.
- **Typography:** Input text: 0.9375rem. Label unfocused: 0.9375rem normal case. Label focused: 0.6875rem uppercase tracking 0.14em.

### Navigation

- **Style:** Horizontal menu with DM Sans, no explicit background on items.
- **Active indicator:** 2px baby blue underline via `::after` pseudo-element. Animates via `scale-x` from 0 to 1 (400ms cubic-bezier(0.16, 1, 0.3, 1)). The pseudo-element is always present in DOM for smooth transitions.
- **Scroll behavior:** Header gains a subtle shadow on scroll (`shadow-[0_1px_0_oklch(0.25_0.03_240/0.06),0_4px_24px_oklch(0.25_0.03_240/0.07)]`).
- **CTA button:** Solid primary pill in the header right slot.

### Dark Sections

- **Background:** Midnight slate (oklch(0.18 0.04 240)).
- **Decorative elements:** Breathing radial glow (baby blue, opacity oscillating 0.08 to 0.16, 6s loop). Optional grain texture overlay at 3.5% opacity.
- **Text:** White at 55% for body, white at 70% for labels, lumina-300 at 60% for eyebrows.
- **Purpose:** Rhythmic contrast. Used for story/manifesto sections and the contact left panel.

## 6. Do's and Don'ts

### Do:

- **Do** use the single exponential ease `[0.16, 1, 0.3, 1]` for all entrance animations. This is the system's signature curve.
- **Do** use `while-in-view` with `{ once: true }` for scroll-triggered entrances. Elements animate once and stay.
- **Do** stagger sibling items by 0.07s delay increments for list/grid entrances.
- **Do** tint every neutral toward hue 230/240. Check chroma is never 0.
- **Do** use symmetric gradient backgrounds for section tinting (`background 0%, soft-ice 25%, soft-ice 75%, background 100%`) to create seamless section transitions.
- **Do** use Lora italic for every display heading. Consistency in the italic convention is what makes it a system, not a choice.
- **Do** cap centered body text at 50ch. Left-aligned prose at 65ch.
- **Do** include the `→` arrow with hover translate on every CTA button.

### Don't:

- **Don't** use gradient text (`background-clip: text`). The hero's gradient second line is the single permitted exception; extending it elsewhere cheapens the effect.
- **Don't** use glassmorphism as a default surface treatment. It appears on Expertise cards and the hero badge only. Every other surface is opaque.
- **Don't** introduce a second saturated hue. No orange, no green, no purple. The Coastal Teal at hue 178 is decorative only.
- **Don't** use bounce or elastic easing. All motion is exponential ease-out.
- **Don't** use border-left or border-right greater than 1px as a colored accent stripe.
- **Don't** use identical card grids. When showing multiple items, vary the layout: vertical list, 2-column asymmetric, 4-column timeline, numbered rows. No three-up icon+heading+text grids.
- **Don't** use generic SaaS patterns: gradient blobs as hero backgrounds, stock illustration characters, "Schedule a demo" button copy, feature comparison tables with checkmarks.
- **Don't** build anything that looks template-derived. No visible Bootstrap/Tailwind UI/Shadcn default styling. Every element must be visibly custom.
- **Don't** use the words: artisan, pixel, chaleur, magie, passion, digital, bespoke, atelier, rêve, âme, écosystème.
- **Don't** animate CSS layout properties (width, height, padding, margin). Use transform and opacity exclusively.
- **Don't** use em dashes in copy. Use commas, colons, semicolons, or periods.
