"use client";

import { useRef, useState, useEffect } from "react";

/**
 * Returns a ref and a boolean indicating whether the element is
 * within (or near) the viewport. Once visible, stays true so the
 * heavy content is never unmounted on scroll-back.
 */
export function useInView(rootMargin = "200px") {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Synchronous check: if already in/near viewport, skip the observer
    const margin = parseInt(rootMargin, 10) || 0;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + margin && rect.bottom > -margin) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
