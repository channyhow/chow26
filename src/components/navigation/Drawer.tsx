import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { Form } from "@/components/forms/Form";
import formsData from "@/data/forms.json";
import navigationData from "@/data/navigation.json";
import siteData from "@/data/site.json";
import { selectDrawerView, useUIStore } from "@/state/uiStore";
import type { FormSchema } from "@/types/forms";

const labels = siteData.ui.copy.navigation.drawerLabels;
const forms = formsData as Record<"contact" | "reservation", FormSchema>;
const navigationItems = [...navigationData.primary, ...navigationData.review].filter((item) => item.enabled);

export function Drawer() {
  const drawer = useUIStore(selectDrawerView);
  const closeOverlay = useUIStore((state) => state.closeOverlay);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const renderedView = drawer ?? "menu";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.documentElement.style.overflow;

    if (drawer && !dialog.open) {
      dialog.show();
      document.documentElement.style.overflow = "hidden";

      window.requestAnimationFrame(() => {
        dialog
          .querySelector<HTMLElement>(
            ".drawer__nav a, .drawer__content input, .drawer__content select, .drawer__content textarea, .drawer__content button, .drawer__content iframe",
          )
          ?.focus({ preventScroll: true });
      });
    } else if (!drawer && dialog.open) {
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
    }

    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [drawer]);

  return (
    <dialog
      id="site-drawer"
      ref={dialogRef}
      className="drawer"
      aria-label={labels[renderedView]}
      data-view={renderedView}
      onClose={closeOverlay}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeOverlay();
        }
      }}
    >
      <button
        className="drawer__dismiss"
        type="button"
        aria-label={siteData.ui.copy.navigation.closeLabel}
        onClick={closeOverlay}
      />

      <div className="drawer__panel">
        <div className="drawer__body" key={renderedView}>
          {renderedView === "menu" ? (
            <nav className="drawer__nav" aria-label={siteData.ui.copy.navigation.mainLabel}>
              {navigationItems.map((item) => (
                <Link key={item.id} to={item.href} onClick={closeOverlay}>
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : (
            <div className="drawer__content">
              <Form schema={forms[renderedView]} />
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
