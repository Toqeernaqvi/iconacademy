import { useLayoutEffect } from 'react';

// Progressive enhancement: nothing is hidden in CSS or left waiting for JS.
// Individual translate/scale properties preserve existing card rotations.
const revealTargets = [
  '.home-hero-copy > *', '.home-hero-visual', '.home-proof-grid > div',
  '.home-section-heading', '.home-program-card', '.home-course-banner-grid > *',
  '.home-social-grid > a', '.home-facebook-grid > div', '.home-article-grid > article',
  '.category-tabs', '.footer-invitation-copy', '.footer-contact-actions',
  '.footer-directory > *', '.footer-legal',
  '.course-hero-copy > *', '.course-hero-seal', '.course-section-heading',
  '.course-detail-card', '.course-youtube-card', '.tools-band > *',
  '.why-course-grid > div', '.course-contact-copy', '.course-contact-panel > a',
  '.team-hero-copy > *', '.team-hero-panel', '.team-page-heading', '.home-team-card', '.faculty-card',
  '.team-values-grid > div:first-child', '.team-value-list > span',
  '.team-contact-grid > div:first-child', '.team-contact-grid a',
  '.online-hero-copy > *', '.online-showcase', '.online-section-heading', '.online-course-card',
  '.online-path-band .section-wrap > *', '.online-filters', '.online-guidance',
  '.online-school > div:first-child', '.online-school-list > a',
  '.online-start > .online-eyebrow', '.online-start > h2', '.online-start li',
  '.review-card', '.review-controls',
  '.academic-hero > .academic-back', '.academic-hero-grid > div > *', '.academic-overview',
  '.academic-focus > .course-eyebrow', '.academic-focus > h2', '.academic-focus-grid > article',
  '.academic-admissions > *', '.academic-related > .course-eyebrow', '.academic-related > div > a',
].join(',');

const visualTargets = '.home-hero-visual, .course-hero-seal, .team-hero-panel, .online-showcase, .academic-overview';
const cardTargets = '.home-program-card, .course-detail-card, .home-team-card, .faculty-card, .online-course-card, .academic-focus-grid > article, .review-card';
const ambientTargets = '.home-hero-visual, .course-hero-seal, .team-hero-panel, .online-showcase, .academic-overview';

export default function useSiteMotion(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width: 700px)');
    const observed = new WeakSet();
    const animations = new Map();
    const observer = new IntersectionObserver((entries) => {
      const groups = new Map();
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        if (preference.matches || document.hidden || target.contains(document.activeElement)) return;
        const order = groups.get(target.parentElement) || 0;
        groups.set(target.parentElement, order + 1);
        const visual = target.matches(visualTargets);
        const card = target.matches(cardTargets);
        const distance = target.matches('.review-card') ? 0 : compact.matches ? 16 : visual ? 36 : 26;
        const animation = target.animate([
          { opacity: 0, translate: `0 ${distance}px`, scale: visual ? '0.96' : card ? '0.985' : '1' },
          { opacity: 1, translate: '0 0', scale: '1' },
        ], {
          duration: compact.matches ? 520 : visual ? 950 : 720,
          delay: Math.min(order * 75, compact.matches ? 120 : 225),
          easing: 'cubic-bezier(.16, 1, .3, 1)',
          fill: 'backwards',
        });
        animations.set(target, animation);
        animation.onfinish = animation.oncancel = () => {
          if (animations.get(target) === animation) animations.delete(target);
        };
      });
    }, { threshold: 0.06 });

    // Only decorative layers float; text, reading order and scroll stay stable.
    const ambientObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => target.classList.toggle('motion-in-view', isIntersecting));
    }, { threshold: 0.05 });
    const collect = (node, selector) => [
      ...(node.matches(selector) ? [node] : []), ...node.querySelectorAll(selector),
    ];
    const register = (node) => {
      if (!(node instanceof Element)) return;
      collect(node, revealTargets).forEach((target) => {
        if (observed.has(target)) return;
        observed.add(target);
        observer.observe(target);
      });
      collect(node, ambientTargets).forEach((target) => ambientObserver.observe(target));
    };
    register(root);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.removedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          collect(node, revealTargets).forEach((target) => {
            observer.unobserve(target);
            animations.get(target)?.cancel();
            observed.delete(target);
          });
          collect(node, ambientTargets).forEach((target) => ambientObserver.unobserve(target));
        });
        record.addedNodes.forEach(register);
      });
    });
    mutations.observe(root, { childList: true, subtree: true });
    const syncMotion = () => {
      root.dataset.motionPaused = String(document.hidden || preference.matches);
      if (document.hidden || preference.matches) animations.forEach((animation) => animation.cancel());
    };
    const revealFocused = (event) => {
      animations.forEach((animation, target) => {
        if (target.contains(event.target)) animation.cancel();
      });
    };
    syncMotion();
    preference.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncMotion);
    root.addEventListener('focusin', revealFocused);
    return () => {
      observer.disconnect();
      ambientObserver.disconnect();
      mutations.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncMotion);
      root.removeEventListener('focusin', revealFocused);
      delete root.dataset.motionPaused;
    };
  }, [rootRef]);
}
