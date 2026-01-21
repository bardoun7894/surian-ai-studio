# Task: Design Alignment and Visual Identity Fixes

## Problem Statement
The user has reported several visual issues:
1. **Dark/Light Mode Colors**: The current theme transitions do not fully align with the official visual identity (`gov-forest`, `gov-gold`, `gov-beige`).
2. **Missing Images**: Some images on the main page are not appearing (likely 404s or path issues).
3. **Icon Consistency**: Need to improve and standardize icons across the application.
4. **Visual Identity**: Ensure fonts and branding elements feel "official" and "premium".

## Proposed Changes

### 1. Global Styles and Tokens (`index.html`)
- Update the Tailwind configuration to ensure all components use the `gov-` color palette.
- Add specific CSS variables for easier theming.
- Fix body backgrounds and scrollbar colors for Dark Mode.

### 2. Hero Section and Branding (`HeroSection.tsx`, `Navbar.tsx`)
- Verify and fix image paths for the official emblem and logos.
- Optimize the logo animation (GSAP) to ensure items appear correctly and stay visible.
- Ensure the "Eagle" composition is centered and works on all screen sizes.

### 3. News and Grid (`HeroGrid.tsx`, `NewsSection.tsx`, `ArticleCard.tsx`)
- Audit all image sources (Unsplash) and add local fallbacks or reliable placeholders.
- Convert hardcoded `zinc` and `gray` colors to the `gov-` palette in dark mode.
- Improve card aesthetics (glassmorphism in dark mode).

### 4. Icon Audit
- Use consistent `lucide-react` icons.
- Ensure icons have appropriate sizing and colors (gold for accents, forest for primary).

### 5. Alignment with "Qomra" Font
- Ensure the `Qomra` font is correctly applied to all headings and display elements.

## Execution Steps

### Step 1: Design Tokens and Variables
- [ ] Update `index.html` tailwind config.
- [ ] Ensure `gov-forest` and `gov-beige` are the primary backgrounds for dark/light modes.

### Step 2: Hero Section Fixes
- [ ] Fix image paths in `HeroSection.tsx`.
- [ ] Adjust z-index and spacing for the logo animation.
- [ ] Verify image presence in `/public/assets/logo`.

### Step 3: Global Component Color Audit
- [ ] Update `Navbar` and `Footer` colors.
- [ ] Update `HeroGrid` for better dark mode readability.
- [ ] Update `ComplaintPortal` for consistent design.

### Step 4: Final Polish
- [ ] Test toggling themes.
- [ ] Check RTL/LTR alignment again.
- [ ] Final check on image loading.
