import siteData from "@/data/site.json";
import { selectOverlayOpen, useUIStore } from "@/state/uiStore";

export function BurgerButton() {
  const isOpen = useUIStore(selectOverlayOpen);
  const openDrawer = useUIStore((state) => state.openDrawer);
  const closeOverlay = useUIStore((state) => state.closeOverlay);

  const handleClick = () => {
    if (isOpen) {
      closeOverlay();
      return;
    }

    openDrawer("menu");
  };

  const navigationCopy = siteData.ui.copy.navigation;

  return (
    <button
      className="burgerButton"
      type="button"
      onClick={handleClick}
      aria-label={isOpen ? navigationCopy.closeLabel : navigationCopy.openMenuLabel}
      aria-expanded={isOpen}
      aria-controls="site-drawer"
    >
      <span className="burgerButton__lines" aria-hidden="true">
        <span className="burgerButton__line" />
        <span className="burgerButton__line" />
      </span>
    </button>
  );
}
