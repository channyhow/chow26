import clsx from "clsx";

import { getLink } from "@/data/linkRegistry";
import type { Action } from "@/types/content";

export type ActionsProps = {
  links?: Action[];
  className?: string;
};

function isProjectStartAction(label: string) {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("fr") === "demarrer un projet";
}

function resolveVariant(action: Action, index: number, actionCount: number) {
  if (action.variant) return action.variant;

  if (actionCount === 2) {
    return index === 0 ? "primary" : "arrow";
  }

  if (actionCount === 1 && isProjectStartAction(action.label)) {
    return "arrow";
  }

  return action.priority === "primary" ? "primary" : undefined;
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function Actions({
  links = [],
  className,
}: ActionsProps) {
  if (!links.length) return null;

  return (
    <div className={clsx("actions", className)}>
      {links.map((action, index) => {
        const intent = action.intent ?? "navigate";
        const variant = resolveVariant(action, index, links.length);
        const hasArrow = variant === "arrow" || variant === "cta";

        const classNames = clsx(
          "actions__link",
          variant && `actions__link--${variant}`,
        );

        const content = (
          <>
            <span className="actions__label">{action.label}</span>
            {hasArrow ? (
              <span className="actions__arrow" aria-hidden="true">→</span>
            ) : null}
          </>
        );

        if (intent === "submit") {
          return (
            <button
              key={`submit-${action.label}`}
              className={classNames}
              type="submit"
              data-intent="submit"
              data-priority={action.priority ?? "primary"}
            >
              {content}
            </button>
          );
        }

        const href = action.href ?? getLink(action.linkKey);

        if (!href) return null;

        const external = isExternalHref(href);

        return (
          <a
            key={`${action.label}-${action.linkKey ?? href}`}
            className={classNames}
            href={href}
            data-intent={intent}
            data-priority={action.priority ?? "secondary"}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
