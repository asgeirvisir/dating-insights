"use client";

import { useRef, useState, useEffect, type RefObject } from "react";

/**
 * Returns a ref and a boolean indicating whether the element is
 * within (or near) the viewport. Once visible, stays true so the
 * heavy content is never unmounted on scroll-back.
 *
 * Pass an existing ref to share it (e.g. for export + lazy-load on the same node).
 */
export function useInView(
  rootMargin = "200px",
  externalRef?: RefObject<HTMLDivElement | null>,
) {
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = externalRef ?? internalRef;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
  }, [rootMargin, ref]);

  return { ref, inView };
}
