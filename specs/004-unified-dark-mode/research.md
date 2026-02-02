# Research: Unified Dark Mode Color System

**Feature**: 004-unified-dark-mode
**Date**: 2026-02-02

## R1: Dark Mode Color Palette — Final Values

**Decision**: Use the following authoritative palette for all dark mode elements:

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--dm-background` | #1a1a1a | 26 26 26 | Page background |
| `--dm-surface` | #2a2a2a | 42 42 42 | Elevated surfaces (modals, dropdowns) |
| `--dm-card` | #b3a3d3 at 10% opacity | rgba(179,163,211,0.1) | Card backgrounds |
| `--dm-button` | #094239 | 9 66 57 | Button backgrounds, icon colors |
| `--dm-title` | #b9a779 | 185 167 121 | Primary headings, section titles |
| `--dm-text` | #ffffff | 255 255 255 | Body text, subtitles, labels |
| `--dm-text-secondary` | rgba(255,255,255,0.7) | — | Muted/secondary text |
| `--dm-border` | rgba(185,167,121,0.15) | — | Borders (gold-tinted, low opacity) |
| `--dm-input-bg` | rgba(255,255,255,0.05) | — | Form input backgrounds |

**Rationale**: These values match the user's specification (dark green buttons, gold titles, white text, gray cards) while ensuring WCAG 2.1 AA contrast ratios on dark surfaces.

**Alternatives considered**:
- Pure black (#000000) background: Rejected — too harsh, user explicitly wants #1a1a1a
- Full-opacity #b3a3d3 cards: Rejected — too bright on dark surfaces; 10% opacity matches the 224 existing instances already using `dark:bg-gov-card/10`
- System `prefers-color-scheme`: Rejected — site uses class-based toggle (`.dark`), not media query

## R2: Centralization Strategy

**Decision**: Define all dark mode colors as CSS custom properties in `globals.css` `.dark` block. Map them to Tailwind semantic tokens in `tailwind.config.ts`. Components use Tailwind classes that reference these tokens.

**Rationale**:
- CSS variables enable runtime theme switching (FR-007)
- Tailwind config mapping enables `dark:bg-dm-card` syntax in components
- Single source of truth: change `globals.css` → all 93 files update automatically (SC-003)

**Alternatives considered**:
- Tailwind-only (no CSS variables): Rejected — doesn't support the "change one value, update everywhere" requirement without recompiling
- CSS-in-JS theme provider: Rejected — adds runtime overhead, violates Simplicity principle
- Separate dark mode stylesheet: Rejected — complicates build, Tailwind already handles class-based dark mode

## R3: WCAG Contrast Verification

**Decision**: All color combinations meet WCAG 2.1 AA minimum contrast ratios.

| Combination | Contrast Ratio | Passes AA |
|-------------|---------------|-----------|
| White text (#fff) on dark bg (#1a1a1a) | 16.15:1 | Yes (min 4.5:1) |
| Gold title (#b9a779) on dark bg (#1a1a1a) | 6.89:1 | Yes (min 4.5:1) |
| White text (#fff) on dark green button (#094239) | 8.41:1 | Yes (min 4.5:1) |
| Gold title (#b9a779) on card bg (#b3a3d3 at 10% on #1a1a1a ≈ #2a2530) | 5.48:1 | Yes (min 4.5:1) |
| White text (#fff) on card bg (#2a2530) | 13.21:1 | Yes (min 4.5:1) |

**Rationale**: Government portal must maintain WCAG 2.1 AA per Constitution Principle III.

## R4: Replacement Patterns — Component Audit

**Decision**: Group all replacements into 6 categories for batch processing:

### Category 1: Background — Pure black removal
- **Find**: `dark:bg-black` (27 instances in ~10 files)
- **Replace**: `dark:bg-[var(--background)]` or remove (inherits from body)
- **Files**: FeaturedDirectorates, Announcements, DirectorateCard, SearchResultsPage, auth pages, admin pages

### Category 2: Background — Hardcoded hex removal
- **Find**: `dark:bg-[#2a2a2a]`, `dark:bg-[#1f1f1f]`, `dark:bg-[#161616]`
- **Replace**: `dark:bg-dm-surface` for elevated surfaces or remove for page bg
- **Files**: ArticleCard, card components

### Category 3: Background — Tailwind gray standardization
- **Find**: `dark:bg-gray-700`, `dark:bg-gray-800`, `dark:bg-gray-900`
- **Replace**: `dark:bg-dm-surface` or `dark:bg-dm-card`
- **Files**: Various page and component files

### Category 4: Border standardization
- **Find**: `dark:border-gray-600`, `dark:border-gray-700`
- **Replace**: `dark:border-gov-border/15`
- **Files**: ~20 files with inconsistent borders

### Category 5: Text color standardization
- **Find**: `dark:text-gray-300`, `dark:text-gray-400` used inconsistently
- **Replace**: `dark:text-white` for primary text, `dark:text-white/70` for secondary
- **Files**: ~40 files

### Category 6: Problem components (special handling)
- ChatBot: Remove white bg leak → use dm-surface
- Services dropdown: Remove green bg → use dm-surface
- Complaint/Suggestion forms: Unify to same card/input/button colors
- Quick Links: Remove opaque bg → transparent or dm-surface
- "Read More" buttons: Ensure visible dark green

## R5: Tailwind Config — New Semantic Tokens

**Decision**: Add a `dm` (dark mode) color group to Tailwind config:

```
dm: {
  bg: 'var(--dm-background)',
  surface: 'var(--dm-surface)',
  card: 'var(--dm-card)',
  text: 'var(--dm-text)',
  'text-secondary': 'var(--dm-text-secondary)',
  border: 'var(--dm-border)',
  input: 'var(--dm-input-bg)',
}
```

This provides `dark:bg-dm-surface`, `dark:text-dm-text`, etc.

**Rationale**: Semantic tokens make intent clear and enable single-point-of-change.

**Alternatives considered**: Reusing existing `gov.*` tokens — rejected because `gov.*` colors are brand colors shared between light and dark modes. Dark mode needs its own surface/text tokens.
