"use client";

import { useEffect, useState } from "react";

/** Matches the CSS intro timing in globals.css (loader starts leaving at 1.35s). */
const INTRO_MS = 1250;

/**
 * Returns true once the intro loader is out of the way, so entrance
 * animations play in view instead of behind the loader.
 */
export function useIntroDone() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const seen = document.documentElement.dataset.intro === "seen";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setDone(true), seen || reduced ? 60 : INTRO_MS);
    return () => window.clearTimeout(t);
  }, []);

  return done;
}
