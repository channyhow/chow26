import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import siteData from "@/data/site.json";

type FloatingActionConfig = typeof siteData.ui.floatingAction & {
  hideWhileVisible?: string;
};

export function FloatingAction() {
  const { pathname } = useLocation();
  const config = siteData.ui.floatingAction as FloatingActionConfig;
  const actionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const action = actionRef.current;
    if (!action) return;

    action.dataset.hidden = "false";

    if (!config.hideWhileVisible) return;

    const target = document.querySelector(config.hideWhileVisible);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        action.dataset.hidden = entry.isIntersecting ? "true" : "false";
      },
      { threshold: 0.12 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [config.hideWhileVisible, pathname]);

  if (!config.enabled) return null;

  return (
    <aside
      ref={actionRef}
      className="floatingAction"
      aria-label={config.ariaLabel}
      data-hidden="false"
    >
      <details className="floatingAction__details">
        <summary className="floatingAction__trigger">
          <span className="floatingAction__label">{config.label}</span>
          <span className="floatingAction__mark" aria-hidden="true">↗</span>
        </summary>
        <nav className="floatingAction__menu" aria-label={config.ariaLabel}>
          {config.items.map((item) => (
            <a key={`${item.label}-${item.href}`} className="floatingAction__link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </details>
    </aside>
  );
}
