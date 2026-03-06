# Research: 003-ui-amendments

**Date**: 2026-02-02
**Status**: Complete

## Research Tasks & Findings

### R1: Clipboard API Fallback (Item 43)

**Decision**: Use `navigator.clipboard.writeText()` with `document.execCommand('copy')` fallback.

**Rationale**: `navigator.clipboard` requires a secure context (HTTPS) and is undefined on HTTP. The development environment runs on HTTP (localhost:3002). The fallback uses a temporary textarea element with `document.execCommand('copy')`, which works on both HTTP and HTTPS.

**Alternatives considered**:
- Clipboard.js library - rejected (adds dependency for a 10-line utility)
- Only supporting HTTPS - rejected (breaks dev environment)

**Implementation pattern**:
```typescript
async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch { /* fall through */ }
  }
  // Fallback for HTTP / older browsers
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand('copy');
  document.body.removeChild(textarea);
  return success;
}
```

---

### R2: Browser Back-Button Prevention After 2FA (Item 11)

**Decision**: Use `window.history.replaceState()` after successful 2FA to replace the 2FA entry in browser history, then navigate forward with `router.replace()`.

**Rationale**: `router.replace()` in Next.js App Router replaces the current history entry rather than pushing a new one, preventing the user from navigating back to the 2FA page. Combined with `replaceState`, the 2FA page is removed from history entirely.

**Alternatives considered**:
- `popstate` event listener - rejected (fragile, browser-specific edge cases)
- Clearing history stack - rejected (not possible in browser API)

---

### R3: 2FA Page Stability (Item 10)

**Decision**: Investigate the redirect cause in `two-factor/page.tsx`. Likely a race condition where auth state check completes before 2FA state is set, causing middleware to redirect back to login.

**Rationale**: The 2FA page briefly shows then redirects. This pattern indicates the auth middleware runs and finds no auth token (user isn't fully authenticated yet during 2FA). The fix is to store a `pending_2fa` flag in sessionStorage after login returns a 2FA requirement, and check for it in the 2FA page before redirecting.

**Alternatives considered**:
- Disabling middleware for 2FA route - rejected (would allow unauthenticated access)
- Using a query parameter - rejected (visible in URL, less secure)

---

### R4: Tab Visibility Detection for Login Loading (Item 9)

**Decision**: Use the Page Visibility API (`document.visibilitychange` event) to detect when the user leaves the tab, and cancel the in-flight auth request via AbortController.

**Rationale**: Standard browser API, well-supported. AbortController cleanly cancels fetch requests.

**Alternatives considered**:
- `window.blur`/`focus` events - rejected (fires on other interactions like opening devtools)
- setTimeout-based approach - rejected (doesn't detect actual tab switch)

---

### R5: AI Smart Summary (Item 33)

**Decision**: Add a button to `ArticleDetail.tsx` that calls the existing FastAPI AI service endpoint. The endpoint pattern follows `POST /api/v1/ai/summarize` with article content in the request body. Display the summary in a collapsible section below the article title.

**Rationale**: The AI service (FastAPI on port 8001) already exists. Adding a summary endpoint follows the existing pattern of AI-powered features. The frontend calls through the Laravel backend proxy to maintain the decoupled architecture.

**Alternatives considered**:
- Client-side summarization - rejected (no suitable client-side LLM)
- Pre-generating summaries - rejected (adds storage complexity, delays publishing)
- Direct FastAPI call from frontend - rejected (breaks decoupled architecture principle)

---

### R6: Video Playback Issues (Items 19, 51)

**Decision**: Investigate video embed implementation. Likely issues: missing `allowFullScreen` attribute on iframes (Item 19), or incorrect video source URLs / CORS issues (Item 51). Fix by ensuring proper HTML5 video or iframe attributes.

**Rationale**: Video playback failures are typically caused by:
1. Missing `allowFullScreen` / `allow="fullscreen"` on iframes
2. Mixed content (HTTP video on HTTPS page)
3. Incorrect MIME types
4. CORS headers missing from video CDN

**Implementation**: Add `allowFullScreen` attribute to all video iframes. For HTML5 `<video>` elements, ensure proper `controls` attribute and source format.

---

### R7: Dark Mode Color Palette Consistency (Item 12)

**Decision**: Centralize dark mode colors in CSS variables in `globals.css` and reference them via Tailwind `dark:` utility classes. The palette is:
- Buttons/icons: dark green (`#094239` / `gov-forest`)
- Main titles: gold (`#b9a779` / `gov-gold`)
- Subtitles/text: white (`#ffffff`)
- Cards: gray (`#b3a3d3`)

**Rationale**: CSS variables are already established in `globals.css`. Adding the missing card gray color and ensuring all components reference these variables (not hardcoded colors) provides consistency.

**Alternatives considered**:
- Component-level inline styles - rejected (not maintainable)
- Separate dark mode stylesheet - rejected (Tailwind dark: mode is already configured)

---

### R8: Share Button Implementation (Items 25, 36)

**Decision**: Use the Web Share API (`navigator.share()`) with fallback to copying the URL to clipboard. The Web Share API provides native sharing on mobile devices and falls back gracefully on desktop.

**Rationale**: Mobile-first design (Constitution III) makes native sharing important. The Web Share API is well-supported on mobile browsers (iOS Safari, Chrome Android).

**Alternatives considered**:
- Social media share links (Facebook, Twitter, WhatsApp) - viable as additional option but not as primary
- Copy-to-clipboard only - rejected (doesn't leverage native mobile sharing)

**Implementation pattern**:
```typescript
async function shareContent(title: string, url: string) {
  if (navigator.share) {
    await navigator.share({ title, url });
  } else {
    await copyToClipboard(url);
    // Show "Link copied" toast
  }
}
```

---

### R9: Print Functionality (Item 36)

**Decision**: Use `window.print()` with a print-specific CSS media query (`@media print`) that hides navigation, footer, and other non-content elements.

**Rationale**: Native browser print is the simplest and most universal approach. Print CSS ensures only the announcement content is printed.

**Alternatives considered**:
- PDF generation (server-side) - rejected (over-engineering for print)
- html2canvas/jspdf - rejected (unnecessary dependency for basic printing)

---

### R10: Performance Optimization (Item 30)

**Decision**: Multi-pronged approach:
1. **Image optimization**: Use Next.js `<Image>` component with `priority` for above-the-fold images
2. **Lazy loading**: Dynamic imports for below-the-fold components (ChatBot, Footer sections)
3. **Bundle analysis**: Review and tree-shake unused dependencies
4. **Font optimization**: Use `next/font` for font loading (already partially implemented)

**Rationale**: These are standard Next.js performance patterns that don't require architectural changes.

**Alternatives considered**:
- CDN setup - out of scope (infrastructure change)
- SSR for all pages - rejected (some pages benefit from client-side rendering)
- Service worker / caching - good future improvement but higher complexity for this batch

---

### R11: Rating Submission Failure (Item 46)

**Decision**: Investigate the `POST /api/v1/complaints/{id}/rate` endpoint. The failure is likely a backend validation issue, CSRF token mismatch, or incorrect request format. Fix both frontend request and backend handler as needed.

**Rationale**: Rating always fails, indicating a systematic issue rather than an edge case. Need to check:
1. Request payload format matches backend expectations
2. CSRF/XSRF token is included
3. Backend route exists and is accessible
4. Response handling in frontend doesn't swallow success

---

### R12: Contact Address Revert Issue (Item 16)

**Decision**: The address showing correctly then reverting indicates a client-side state override. Likely the component fetches contact info from the API and overwrites the hardcoded correct address with stale/incorrect API data. Fix by either correcting the API data or ensuring the correct address is used regardless of API response.

**Rationale**: State revert on re-render is a classic React hydration or useEffect pattern issue.

---

## All NEEDS CLARIFICATION Items: Resolved

No unresolved clarifications remain. All technical decisions have been made based on existing codebase patterns and Constitution principles.
