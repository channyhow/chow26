import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

type Item = { content: ReactNode; href?: string; label: string };

export function StudioIntroMedia({ items }: { items: Item[] }) {
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const viewport = window.matchMedia("(max-width: 63.99rem)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setMobile(viewport.matches); setReducedMotion(motion.matches); };
    update();
    viewport.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => { viewport.removeEventListener("change", update); motion.removeEventListener("change", update); };
  }, []);

  useEffect(() => {
    if (!mobile || reducedMotion || paused || items.length < 2) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % items.length), 4500);
    return () => window.clearInterval(timer);
  }, [mobile, reducedMotion, paused, items.length]);

  return (
    <div className="studioIntro__mediaGrid" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
      {items.map((item, index) => {
        const visible = !mobile || index === (reducedMotion ? 0 : active);
        const className = "studioIntro__media";
        return item.href
          ? <Link className={className} to={item.href} key={index} aria-label={item.label} tabIndex={visible ? undefined : -1} aria-hidden={!visible || undefined} data-active={visible ? "true" : "false"}>{item.content}</Link>
          : <div className={className} key={index} aria-hidden={!visible || undefined} data-active={visible ? "true" : "false"}>{item.content}</div>;
      })}
    </div>
  );
}
