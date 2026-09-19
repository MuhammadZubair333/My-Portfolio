import { profile } from "@/data/profile";

/**
 * Short brand intro. Pure CSS (see `.intro` in globals.css) so it always
 * removes itself, plays once per session, and is skipped for reduced motion.
 */
export function IntroLoader() {
  return (
    <div className="intro" aria-hidden>
      <div className="flex flex-col items-center">
        <div className="intro__mark">
          <span>M</span>
          <span>Z</span>
        </div>
        <div className="intro__bar" />
        <p className="intro__label eyebrow">
          {profile.name} · {profile.title}
        </p>
      </div>
    </div>
  );
}
