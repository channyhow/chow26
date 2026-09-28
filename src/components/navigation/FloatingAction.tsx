import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import { resolveActions } from "@/data/actionRegistry";
import siteData from "@/data/site.json";
import type { ActionRef } from "@/types/content";

type FloatingActionConfig = Omit<typeof siteData.ui.floatingAction, "items"> & {
  hideWhileVisible?: string;
  items: ActionRef[];
};

export function FloatingAction() {
  const { pathname } = useLocation();
  const config = siteData.ui.floatingAction as FloatingActionConfig;
  const items = resolveActions(config.items);
  const actionRef = useRef<HTMLElement>(null);
  const [singleItem] = items;
  const isCurrentDestination = Boolean(items.length === 1 && singleItem?.href && pathname === singleItem.href);

  useEffect(() => {
    const action = actionRef.current;
    if (!action) return;
    action.dataset.hidden = "false";
    const selectors = [config.hideWhileVisible, ".siteFooter"].filter(Boolean) as string[];
    const targets = selectors.flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector)));
    if (!targets.length) return;
    const visibleTargets = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? visibleTargets.add(entry.target) : visibleTargets.delete(entry.target));
      action.dataset.hidden = visibleTargets.size ? "true" : "false";
    }, { threshold: 0.12 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [config.hideWhileVisible, pathname]);

  if (!config.enabled || isCurrentDestination || !items.length) return null;

  return (
    <aside ref={actionRef} className="floatingAction" aria-label={config.ariaLabel} data-hidden="false">
      {items.length === 1 && singleItem?.href ? (
        <Link className="floatingAction__trigger" to={singleItem.href} viewTransition aria-label={singleItem.label}>
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
            {items.map((item) => item.href ? (
              <Link key={`${item.label}-${item.href}`} className="floatingAction__link" to={item.href} viewTransition>{item.label}</Link>
            ) : null)}
          </nav>
        </details>
      )}
    </aside>
  );
}
