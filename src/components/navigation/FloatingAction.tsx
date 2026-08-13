import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import siteData from "@/data/site.json";

type FloatingActionConfig = typeof siteData.ui.floatingAction & {
  hideWhileVisible?: string;
};

export function FloatingAction() {
  const { pathname } = useLocation();
  const config = siteData.ui.floatingAction as FloatingActionConfig;
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!config.hideWhileVisible) {
      setHidden(false);
      return;
    }

    const target = document.querySelector(config.hideWhileVisible);
    if (!target) {
      setHidden(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.12 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [config.hideWhileVisible, pathname]);

  if (!config.enabled) return null;

  return (
    <aside
      className="floatingAction"
      aria-label={config.ariaLabel}
      data-hidden={hidden ? "true" : "false"}
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
