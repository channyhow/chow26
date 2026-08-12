import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { Form } from "@/components/forms/Form";
import { BurgerButton } from "@/components/navigation/BurgerButton";
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

    if (drawer && !dialog.open) {
      dialog.showModal();
      dialog
        .querySelector<HTMLButtonElement>(".drawer__header .burgerButton")
        ?.focus({ preventScroll: true });
      return;
    }

    if (!drawer && dialog.open) {
      dialog.close();
    }
  }, [drawer]);

  return (
    <dialog
      id="site-drawer"
      ref={dialogRef}
      className="drawer"
      aria-label={labels[renderedView]}
      data-view={renderedView}
      onClose={closeOverlay}
      onCancel={(event) => {
        event.preventDefault();
        closeOverlay();
      }}
    >
      <button
        className="drawer__dismiss"
        type="button"
        aria-label={siteData.ui.copy.navigation.closeLabel}
        onClick={closeOverlay}
      />

      <div className="drawer__panel">
        <header className="drawer__header">
          <Link
            className="drawer__logo"
            to="/"
            onClick={closeOverlay}
          >
            {siteData.site.name}
          </Link>

          <BurgerButton />
        </header>

        <div className="drawer__body" key={renderedView}>
          {/* <p className="drawer__label">{labels[renderedView]}</p> */}

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
