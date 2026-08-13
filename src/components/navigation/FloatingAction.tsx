import siteData from "@/data/site.json";

export function FloatingAction() {
  const config = siteData.ui.floatingAction;

  if (!config.enabled) return null;

  return (
    <aside className="floatingAction" aria-label={config.ariaLabel}>
      <details className="floatingAction__details">
        <summary className="floatingAction__trigger">
          <span>{config.label}</span>
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
