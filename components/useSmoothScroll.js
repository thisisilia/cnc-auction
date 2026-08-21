/**
 * Native no-op. iOS and Android already scroll with the platform's own
 * inertia, and GSAP has no DOM to work on there — the web build gets the
 * smoothing via useSmoothScroll.web.js.
 */
export function useSmoothScroll() {}
