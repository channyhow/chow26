import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import siteData from "@/data/site.json";

type FloatingActionConfig = typeof siteData.ui.floatingAction & {
  hideWhileVisible?: string;
};

export function FloatingAction() {
  const { pathname } = useLocation();
  const config = siteData.ui.floatingAction as FloatingActionConfig;
  const actionRef = useRef<HTMLElement>(null);
  const [singleItem] = config.items;
  const isCurrentDestination = Boolean(
    config.items.length === 1 && singleItem && pathname === singleItem.href,
  );

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

  if (!config.enabled || isCurrentDestination) return null;

  return (
    <aside
      ref={actionRef}
      className="floatingAction"
      aria-label={config.ariaLabel}
      data-hidden="false"
    >
      {config.items.length === 1 && singleItem ? (
        <Link
          className="floatingAction__trigger"
          to={singleItem.href}
          viewTransition
          aria-label={singleItem.label}
        >
          <span className="floatingAction__label">{config.label}</span>
          <span className="floatingAction__mark" aria-hidden="true">↗</span>
        </Link>
      ) : (
        <details className="floatingAction__details">
          <summary className="floatingAction__trigger">
            <span className="floatingAction__label">{config.label}</span>
            <span className="floatingAction__mark" aria-hidden="true">↗</span>
          </summary>
          <nav className="floatingAction__menu" aria-label={config.ariaLabel}>
            {config.items.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                className="floatingAction__link"
                to={item.href}
                viewTransition
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      )}
    </aside>
  );
}
