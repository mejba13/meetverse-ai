# MeetVerse AI Brand Guidelines

## The "Million-Dollar" Design System

---

## 1. Brand Philosophy

### Vision
MeetVerse AI represents the future of intelligent collaboration—where technology disappears and human connection flourishes. Our design language embodies **sophisticated simplicity**: every pixel serves a purpose, every interaction feels intentional, and every screen communicates premium quality.

### Design Principles

1. **Purposeful Minimalism**
   Remove everything that doesn't serve the user. White space is not empty—it's breathing room for focus.

2. **Confident Restraint**
   Bold where it matters, subtle everywhere else. One accent color. One font family. Maximum impact.

3. **Invisible Technology**
   The AI should feel like a trusted colleague, not a feature. Design for the human moment, not the technical capability.

4. **Premium by Default**
   Every detail—from micro-animations to spacing—should feel considered and intentional. Quality is cumulative.

5. **Accessibility as Excellence**
   Inclusive design isn't a constraint—it's a mark of sophistication. WCAG AAA contrast is our standard.

---

## 2. Color System

### Philosophy
Our palette is intentionally restrained. We use color sparingly to create maximum impact. The dark canvas creates focus; the cyan accent creates energy.

### Primary Palette

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `--color-ink` | `#0A0A0B` | 240 9% 4% | Primary text, darkest backgrounds |
| `--color-charcoal` | `#18181B` | 240 6% 10% | Card backgrounds, elevated surfaces |
| `--color-graphite` | `#27272A` | 240 4% 16% | Secondary backgrounds, borders |
| `--color-steel` | `#3F3F46` | 240 4% 26% | Muted elements, disabled states |
| `--color-slate` | `#71717A` | 240 4% 46% | Secondary text, placeholders |
| `--color-silver` | `#A1A1AA` | 240 4% 65% | Tertiary text, captions |
| `--color-pearl` | `#E4E4E7` | 240 5% 90% | Borders, dividers (light mode) |
| `--color-snow` | `#FAFAFA` | 0 0% 98% | Light backgrounds, primary text (dark mode) |
| `--color-white` | `#FFFFFF` | 0 0% 100% | Pure white, highlights |

### Accent Color

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `--color-cyan-50` | `#ECFEFF` | 186 100% 97% | Subtle backgrounds |
| `--color-cyan-100` | `#CFFAFE` | 185 96% 90% | Hover states |
| `--color-cyan-200` | `#A5F3FC` | 186 94% 82% | Light accents |
| `--color-cyan-300` | `#67E8F9` | 187 92% 69% | Secondary accent |
| `--color-cyan-400` | `#22D3EE` | 188 86% 53% | Interactive elements |
| `--color-cyan-500` | `#06B6D4` | 189 95% 43% | **Primary brand color** |
| `--color-cyan-600` | `#0891B2` | 192 91% 37% | Pressed states |
| `--color-cyan-700` | `#0E7490` | 193 82% 31% | Dark accent |
| `--color-cyan-800` | `#155E75` | 194 70% 27% | Very dark accent |
| `--color-cyan-900` | `#164E63` | 196 64% 24% | Darkest accent |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#10B981` | Confirmations, success states |
| `--color-warning` | `#F59E0B` | Warnings, cautions |
| `--color-error` | `#EF4444` | Errors, destructive actions |
| `--color-info` | `#3B82F6` | Informational states |

### Color Application Rules

```
Background Hierarchy (Dark Mode):
├── Level 0: --color-ink (#0A0A0B) — Page background
├── Level 1: --color-charcoal (#18181B) — Card backgrounds
├── Level 2: --color-graphite (#27272A) — Elevated elements, popovers
└── Level 3: --color-steel (#3F3F46) — Highest elevation, modals

Text Hierarchy:
├── Primary: --color-snow (#FAFAFA) — Headlines, body text
├── Secondary: --color-silver (#A1A1AA) — Descriptions, captions
├── Tertiary: --color-slate (#71717A) — Placeholders, disabled
└── Accent: --color-cyan-500 (#06B6D4) — Links, highlights
```

### Contrast Requirements

| Combination | Ratio | WCAG Level |
|-------------|-------|------------|
| Snow on Ink | 19.2:1 | AAA |
| Snow on Charcoal | 15.1:1 | AAA |
| Silver on Ink | 7.5:1 | AAA |
| Cyan-500 on Ink | 8.9:1 | AAA |

---

## 3. Typography

### Font Family

**Primary:** Inter
*The modern standard for digital interfaces. Superior readability, extensive weight range, and excellent number forms.*

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", Consolas, monospace;
```

### Type Scale

Based on a 1.25 ratio (Major Third) for harmonious scaling:

| Token | Size | Line Height | Weight | Letter Spacing | Usage |
|-------|------|-------------|--------|----------------|-------|
| `display-xl` | 72px / 4.5rem | 1.0 | 700 | -0.03em | Hero headlines |
| `display-lg` | 56px / 3.5rem | 1.1 | 700 | -0.025em | Page titles |
| `display-md` | 44px / 2.75rem | 1.15 | 600 | -0.02em | Section headlines |
| `display-sm` | 36px / 2.25rem | 1.2 | 600 | -0.015em | Subsection titles |
| `heading-lg` | 28px / 1.75rem | 1.3 | 600 | -0.01em | Card titles |
| `heading-md` | 22px / 1.375rem | 1.35 | 600 | -0.01em | Component headers |
| `heading-sm` | 18px / 1.125rem | 1.4 | 600 | 0 | Small headers |
| `body-lg` | 18px / 1.125rem | 1.6 | 400 | 0 | Lead paragraphs |
| `body-md` | 16px / 1rem | 1.6 | 400 | 0 | Body text |
| `body-sm` | 14px / 0.875rem | 1.5 | 400 | 0.01em | Secondary text |
| `caption` | 12px / 0.75rem | 1.5 | 500 | 0.02em | Labels, captions |
| `overline` | 11px / 0.6875rem | 1.4 | 600 | 0.1em | Overlines, tags |

### Typography Rules

1. **Headlines**: Always use negative letter-spacing for display sizes
2. **Body**: Standard letter-spacing, generous line-height (1.6)
3. **All-caps**: Only for overlines and labels, always with 0.1em tracking
4. **Maximum width**: Body text should never exceed 65-70 characters per line

### Responsive Typography

```css
/* Mobile-first scaling */
--display-xl: clamp(2.5rem, 5vw + 1rem, 4.5rem);
--display-lg: clamp(2rem, 4vw + 0.75rem, 3.5rem);
--display-md: clamp(1.75rem, 3vw + 0.5rem, 2.75rem);
```

---

## 4. Spacing System

### Base Unit
`4px` — All spacing values are multiples of 4.

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0 | Reset |
| `space-1` | 4px | Micro spacing, icon gaps |
| `space-2` | 8px | Tight spacing, compact UI |
| `space-3` | 12px | Small gaps |
| `space-4` | 16px | Standard component padding |
| `space-5` | 20px | Medium spacing |
| `space-6` | 24px | Card padding, section gaps |
| `space-8` | 32px | Large spacing |
| `space-10` | 40px | Section padding |
| `space-12` | 48px | Large section gaps |
| `space-16` | 64px | Page section padding |
| `space-20` | 80px | Major section breaks |
| `space-24` | 96px | Hero spacing |
| `space-32` | 128px | Maximum spacing |

### Spacing Patterns

```
Component Internal Spacing:
├── Button padding: 12px 24px (space-3 space-6)
├── Input padding: 12px 16px (space-3 space-4)
├── Card padding: 24px (space-6)
└── Modal padding: 32px (space-8)

Layout Spacing:
├── Section padding: 80px 0 (space-20)
├── Container max-width: 1280px
├── Grid gap: 24px (space-6) or 32px (space-8)
└── Stack gap: 16px (space-4) or 24px (space-6)
```

---

## 5. Layout System

### Container Widths

| Token | Width | Usage |
|-------|-------|-------|
| `container-xs` | 448px | Modals, narrow forms |
| `container-sm` | 640px | Auth pages, focused content |
| `container-md` | 768px | Content pages |
| `container-lg` | 1024px | Dashboard content |
| `container-xl` | 1280px | Full-width content |
| `container-2xl` | 1536px | Maximum width |

### Grid System

12-column grid with responsive breakpoints:

```css
/* Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;

/* Grid gaps */
--grid-gap-sm: 16px;
--grid-gap-md: 24px;
--grid-gap-lg: 32px;
```

### Layout Patterns

**Two-Column Layout (Dashboard)**
```
┌─────────────────────────────────────────────┐
│ Sidebar (280px fixed)  │  Content (fluid)   │
│                        │                     │
│ ┌──────────────────┐  │  ┌───────────────┐  │
│ │ Logo             │  │  │ Header        │  │
│ │ Navigation       │  │  ├───────────────┤  │
│ │ ...              │  │  │ Main Content  │  │
│ │ Upgrade Card     │  │  │               │  │
│ └──────────────────┘  │  └───────────────┘  │
└─────────────────────────────────────────────┘
```

**Meeting Room Layout**
```
┌─────────────────────────────────────────────┐
│ Header (56px)                               │
├───────────────────────────────┬─────────────┤
│                               │ Sidebar     │
│     Video Grid (fluid)        │ (360px)     │
│                               │             │
├───────────────────────────────┴─────────────┤
│ Control Bar (80px)                          │
└─────────────────────────────────────────────┘
```

---

## 6. Components

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0 | Sharp corners (tables, dividers) |
| `radius-sm` | 4px | Small elements (badges, chips) |
| `radius-md` | 8px | Buttons, inputs |
| `radius-lg` | 12px | Cards, containers |
| `radius-xl` | 16px | Modals, large cards |
| `radius-2xl` | 24px | Feature cards, hero elements |
| `radius-full` | 9999px | Pills, avatars |

### Shadows (Elevation)

```css
/* Subtle, layered shadows for depth */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);

/* Glow effects for accent elements */
--shadow-glow-cyan: 0 0 20px rgba(6, 182, 212, 0.3);
--shadow-glow-cyan-lg: 0 0 40px rgba(6, 182, 212, 0.4);
```

### Button Styles

**Primary Button**
```css
.btn-primary {
  background: var(--color-cyan-500);
  color: var(--color-white);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.01em;
  transition: all 200ms ease;
}

.btn-primary:hover {
  background: var(--color-cyan-400);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg), var(--shadow-glow-cyan);
}

.btn-primary:active {
  transform: translateY(0);
  background: var(--color-cyan-600);
}
```

**Secondary Button**
```css
.btn-secondary {
  background: transparent;
  color: var(--color-snow);
  border: 1px solid var(--color-graphite);
  padding: 12px 24px;
  border-radius: var(--radius-md);
}

.btn-secondary:hover {
  background: var(--color-graphite);
  border-color: var(--color-steel);
}
```

**Ghost Button**
```css
.btn-ghost {
  background: transparent;
  color: var(--color-silver);
  padding: 12px 24px;
}

.btn-ghost:hover {
  color: var(--color-snow);
  background: var(--color-charcoal);
}
```

### Button Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 32px | 8px 16px | 13px |
| `md` | 40px | 10px 20px | 14px |
| `lg` | 48px | 12px 24px | 15px |
| `xl` | 56px | 14px 32px | 16px |

### Input Fields

```css
.input {
  background: var(--color-charcoal);
  border: 1px solid var(--color-graphite);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  color: var(--color-snow);
  font-size: 14px;
  transition: all 200ms ease;
}

.input:hover {
  border-color: var(--color-steel);
}

.input:focus {
  outline: none;
  border-color: var(--color-cyan-500);
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
}

.input::placeholder {
  color: var(--color-slate);
}
```

### Cards

```css
.card {
  background: var(--color-charcoal);
  border: 1px solid var(--color-graphite);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all 300ms ease;
}

.card:hover {
  border-color: var(--color-steel);
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* Glass variant */
.card-glass {
  background: rgba(24, 24, 27, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  border-radius: var(--radius-sm);
}

.badge-default {
  background: var(--color-graphite);
  color: var(--color-silver);
}

.badge-primary {
  background: rgba(6, 182, 212, 0.15);
  color: var(--color-cyan-400);
}

.badge-success {
  background: rgba(16, 185, 129, 0.15);
  color: #34D399;
}

.badge-warning {
  background: rgba(245, 158, 11, 0.15);
  color: #FBBF24;
}

.badge-error {
  background: rgba(239, 68, 68, 0.15);
  color: #F87171;
}
```

---

## 7. Motion & Animation

### Timing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
```

### Duration Scale

| Token | Duration | Usage |
|-------|----------|-------|
| `duration-instant` | 50ms | Micro-feedback |
| `duration-fast` | 100ms | Hover states |
| `duration-normal` | 200ms | Standard transitions |
| `duration-slow` | 300ms | Complex animations |
| `duration-slower` | 500ms | Page transitions |
| `duration-slowest` | 800ms | Hero animations |

### Animation Patterns

**Fade In**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
```

**Slide Up**
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp var(--duration-slow) var(--ease-out);
}
```

**Scale In**
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

**Pulse (Live Indicator)**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

**Shimmer (Loading)**
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-charcoal) 0%,
    var(--color-graphite) 50%,
    var(--color-charcoal) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

### Interaction Feedback

```css
/* Button press effect */
.interactive:active {
  transform: scale(0.98);
}

/* Hover lift */
.hoverable:hover {
  transform: translateY(-2px);
}

/* Focus ring */
.focusable:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-ink), 0 0 0 4px var(--color-cyan-500);
}
```

### Stagger Animation (Lists)

```javascript
// Framer Motion stagger pattern
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};
```

---

## 8. Iconography

### Icon Library
**Lucide React** — Clean, consistent, customizable

### Icon Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| `xs` | 12px | Inline with small text |
| `sm` | 16px | Buttons, inputs |
| `md` | 20px | Standard icons |
| `lg` | 24px | Navigation, cards |
| `xl` | 32px | Feature highlights |
| `2xl` | 48px | Empty states, heroes |

### Icon Styling

```css
.icon {
  stroke-width: 1.5;
  color: currentColor;
}

/* Muted icons */
.icon-muted {
  color: var(--color-slate);
}

/* Interactive icons */
.icon-interactive {
  transition: color 150ms ease;
}

.icon-interactive:hover {
  color: var(--color-cyan-500);
}
```

---

## 9. Imagery & Media

### Video Tiles

```css
.video-tile {
  aspect-ratio: 16 / 9;
  background: var(--color-charcoal);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
}

.video-tile-speaking {
  box-shadow: 0 0 0 2px var(--color-cyan-500);
}

.video-tile-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    transparent 50%
  );
}
```

### Avatar Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| `xs` | 24px | Compact lists |
| `sm` | 32px | Comments, small UI |
| `md` | 40px | Standard usage |
| `lg` | 48px | Profile sections |
| `xl` | 64px | Hero profiles |
| `2xl` | 96px | Profile pages |

### Empty States

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  text-align: center;
}

.empty-state-icon {
  width: 64px;
  height: 64px;
  color: var(--color-steel);
  margin-bottom: var(--space-4);
}

.empty-state-title {
  font-size: var(--heading-md);
  font-weight: 600;
  color: var(--color-snow);
  margin-bottom: var(--space-2);
}

.empty-state-description {
  font-size: var(--body-md);
  color: var(--color-silver);
  max-width: 320px;
}
```

---

## 10. Accessibility

### Color Contrast

All text combinations must meet WCAG AAA (7:1 for normal text, 4.5:1 for large text):

| Background | Text | Ratio | Pass |
|------------|------|-------|------|
| Ink (#0A0A0B) | Snow (#FAFAFA) | 19.2:1 | AAA |
| Ink (#0A0A0B) | Cyan-400 (#22D3EE) | 10.1:1 | AAA |
| Charcoal (#18181B) | Snow (#FAFAFA) | 15.1:1 | AAA |
| Snow (#FAFAFA) | Ink (#0A0A0B) | 19.2:1 | AAA |

### Focus States

```css
/* Visible focus for keyboard navigation */
*:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--color-ink),
    0 0 0 4px var(--color-cyan-500);
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-cyan-500);
  color: var(--color-white);
  padding: 8px 16px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Touch Targets

- Minimum touch target: 44px × 44px
- Spacing between targets: 8px minimum

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Dark Mode & Theming

### Default: Dark Mode
MeetVerse AI ships in dark mode by default. This positions the product as premium and reduces eye strain during video calls.

### Theme Variables

```css
:root {
  /* Light mode */
  --bg-primary: var(--color-snow);
  --bg-secondary: var(--color-pearl);
  --bg-tertiary: var(--color-white);
  --text-primary: var(--color-ink);
  --text-secondary: var(--color-steel);
  --text-tertiary: var(--color-slate);
  --border-default: var(--color-pearl);
}

.dark {
  /* Dark mode (default) */
  --bg-primary: var(--color-ink);
  --bg-secondary: var(--color-charcoal);
  --bg-tertiary: var(--color-graphite);
  --text-primary: var(--color-snow);
  --text-secondary: var(--color-silver);
  --text-tertiary: var(--color-slate);
  --border-default: var(--color-graphite);
}
```

### Theme Switching

```javascript
// Use next-themes for seamless switching
import { ThemeProvider } from 'next-themes';

<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem={true}
>
  {children}
</ThemeProvider>
```

---

## 12. Responsive Breakpoints

### Breakpoint System

| Token | Width | Target |
|-------|-------|--------|
| `xs` | 0px | Mobile portrait |
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Mobile-First Approach

Always design mobile-first, then enhance for larger screens:

```css
/* Mobile default */
.container {
  padding: var(--space-4);
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: var(--space-8);
  }
}
```

### Responsive Patterns

**Hide/Show**
```css
.mobile-only { display: block; }
.desktop-only { display: none; }

@media (min-width: 1024px) {
  .mobile-only { display: none; }
  .desktop-only { display: block; }
}
```

**Fluid Typography**
```css
.heading {
  font-size: clamp(1.75rem, 4vw, 3.5rem);
}
```

---

## 13. Component Library

### Core Components

| Component | Description |
|-----------|-------------|
| `Button` | Primary, secondary, ghost, destructive variants |
| `Input` | Text, email, password, search inputs |
| `Textarea` | Multi-line text input |
| `Select` | Dropdown selection |
| `Checkbox` | Binary toggle |
| `Radio` | Single selection from group |
| `Switch` | Toggle switch |
| `Slider` | Range selection |
| `Badge` | Status indicators |
| `Avatar` | User images with fallback |
| `Card` | Content containers |
| `Dialog` | Modal dialogs |
| `Dropdown` | Context menus |
| `Tabs` | Tabbed navigation |
| `Toast` | Notifications |
| `Tooltip` | Contextual help |
| `Skeleton` | Loading states |

### Meeting-Specific Components

| Component | Description |
|-----------|-------------|
| `VideoTile` | Participant video container |
| `ControlBar` | Meeting controls |
| `ParticipantList` | Meeting attendees |
| `ChatPanel` | In-meeting chat |
| `TranscriptPanel` | Live transcription |
| `AICopilotPanel` | AI assistant interface |
| `RecordingIndicator` | Recording status |
| `ConnectionStatus` | Network quality |

---

## 14. Writing & Voice

### Brand Voice
- **Clear**: No jargon. Say what you mean.
- **Confident**: Assertive but not arrogant.
- **Helpful**: Guide users to success.
- **Human**: Warm but professional.

### UI Copy Guidelines

**Do:**
- Use active voice
- Lead with the verb
- Be concise
- Use sentence case

**Don't:**
- Use "please" excessively
- End with exclamation marks
- Use technical jargon
- Be vague

### Examples

| Instead of | Use |
|------------|-----|
| "Your meeting has been successfully created!" | "Meeting created" |
| "Please enter your email address" | "Email" |
| "Click here to join the meeting" | "Join meeting" |
| "An error has occurred" | "Couldn't connect. Check your internet." |

### Error Messages

1. Say what happened
2. Say why (if known)
3. Say what to do next

```
"Couldn't join meeting"
"The meeting may have ended or the link is invalid."
[Try again] [Go to dashboard]
```

---

## 15. File Organization

### Recommended Structure

```
src/
├── styles/
│   ├── tokens/
│   │   ├── colors.css
│   │   ├── typography.css
│   │   ├── spacing.css
│   │   └── shadows.css
│   ├── base/
│   │   ├── reset.css
│   │   ├── globals.css
│   │   └── animations.css
│   └── themes/
│       ├── light.css
│       └── dark.css
├── components/
│   ├── ui/           # Primitive components
│   ├── patterns/     # Composed patterns
│   └── features/     # Feature-specific
└── app/
    └── globals.css   # Tailwind imports
```

---

## 16. Implementation Checklist

### Phase 1: Foundation
- [ ] Update Tailwind config with new design tokens
- [ ] Implement new color system
- [ ] Set up typography scale
- [ ] Configure spacing system
- [ ] Set up animation utilities

### Phase 2: Components
- [ ] Update Button component
- [ ] Update Input/Form components
- [ ] Update Card component
- [ ] Update Badge component
- [ ] Update navigation components
- [ ] Update modal/dialog components

### Phase 3: Pages
- [ ] Redesign landing page
- [ ] Update auth pages
- [ ] Redesign dashboard
- [ ] Update meeting room UI
- [ ] Implement responsive refinements

### Phase 4: Polish
- [ ] Add micro-interactions
- [ ] Implement loading states
- [ ] Add empty states
- [ ] Accessibility audit
- [ ] Performance optimization

---

## 17. Quality Checklist

Before shipping any UI:

- [ ] All text meets AAA contrast requirements
- [ ] Touch targets are minimum 44px
- [ ] Focus states are visible
- [ ] Animations respect reduced-motion
- [ ] Works on mobile, tablet, desktop
- [ ] Loading states are implemented
- [ ] Error states are handled
- [ ] Empty states are designed
- [ ] Typography hierarchy is clear
- [ ] Spacing is consistent
- [ ] Colors match design tokens

---

*This document is the source of truth for MeetVerse AI's visual design. All implementations should reference these guidelines.*

**Version**: 2.0
**Last Updated**: February 2026
**Owner**: Design Team
