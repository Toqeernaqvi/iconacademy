import { useEffect } from 'react';

// Animate content once when it enters view. Content stays readable if motion
// APIs are unavailable; newly mounted routes and filtered cards are discovered.
const revealTargets = [
  '.home-hero-copy > *', '.home-hero-visual', '.home-proof-grid > div',
  '.home-section-heading', '.home-program-card', '.home-course-banner-grid > *',
  '.home-social-grid > a', '.home-facebook-grid > div', '.home-article-grid > article',
  '.footer-invitation-copy', '.footer-contact-actions', '.footer-directory > *',
  '.course-hero-copy > *', '.course-hero-seal', '.course-section-heading',
  '.course-detail-card', '.course-youtube-card', '.tools-band > *',
  '.why-course-grid > div', '.course-contact-copy', '.course-contact-panel > a',
  '.team-hero-copy > *', '.team-hero-panel', '.team-page-heading', '.home-team-card', '.faculty-card',
  '.team-values-grid > div:first-child', '.team-value-list > span',
  '.team-contact-grid > div:first-child', '.team-contact-grid a',
].join(',');

export default function useSiteMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observed = new WeakSet();
    const animations = new Map();
    const observer = new IntersectionObserver((entries) => {
      let order = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (preference.matches) return;
        const animation = entry.target.animate([
          { opacity: 0, translate: '0 18px' },
          { opacity: 1, translate: '0 0' },
        ], {
          duration: 650,
          delay: Math.min(order++ * 65, 195),
          easing: 'cubic-bezier(.22, 1, .36, 1)',
          fill: 'backwards',
        });
        animations.set(entry.target, animation);
        animation.onfinish = animation.oncancel = () => animations.delete(entry.target);
      });
    }, { threshold: 0.08 });

    const register = (node) => {
      if (!(node instanceof Element)) return;
      const targets = [...node.querySelectorAll(revealTargets)];
      if (node.matches(revealTargets)) targets.unshift(node);
      targets.forEach((target) => {
        if (observed.has(target)) return;
        observed.add(target);
        observer.observe(target);
      });
    };
    register(root);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach(register);
        record.removedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          [node, ...node.querySelectorAll(revealTargets)].forEach((target) => {
            observer.unobserve(target);
            animations.get(target)?.cancel();
          });
        });
      });
    });
    mutations.observe(root, { childList: true, subtree: true });
    const stopMotion = () => {
      if (preference.matches) animations.forEach((animation) => animation.cancel());
    };
    const revealFocused = (event) => {
      animations.forEach((animation, target) => {
        if (target.contains(event.target)) animation.cancel();
      });
    };
    preference.addEventListener('change', stopMotion);
    root.addEventListener('focusin', revealFocused);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener('change', stopMotion);
      root.removeEventListener('focusin', revealFocused);
    };
  }, [rootRef]);
}
