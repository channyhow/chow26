import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";

import { getLink } from "@/data/linkRegistry";
import type { Action } from "@/types/content";

export type ActionsProps = {
  links?: Action[];
  className?: string;
};

const CONTACT_ACTION_LABEL = "Parler d’un projet";

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

function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

function getInternalPathname(href: string) {
  return href.split(/[?#]/, 1)[0] || "/";
}

export function Actions({
  links = [],
  className,
}: ActionsProps) {
  const { pathname } = useLocation();

  if (!links.length) return null;

  return (
    <div className={clsx("actions", className)}>
      {links.map((action, index) => {
        const intent = action.intent ?? "navigate";
        const label = intent === "contact" ? CONTACT_ACTION_LABEL : action.label;
        const variant = resolveVariant(action, index, links.length);
        const hasArrow = variant === "arrow" || variant === "cta";

        const classNames = clsx(
          "actions__link",
          variant && `actions__link--${variant}`,
        );

        const content = (
          <>
            <span className="actions__label">{label}</span>
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
        const internal = !external && isInternalHref(href);
        const isCurrentPage = internal && getInternalPathname(href) === pathname;
        const key = `${action.label}-${action.linkKey ?? href}`;
        const sharedProps = {
          className: classNames,
          "data-intent": intent,
          "data-priority": action.priority ?? "secondary",
        };

        if (internal) {
          return (
            <Link
              key={key}
              to={href}
              viewTransition
              aria-current={isCurrentPage ? "page" : undefined}
              {...sharedProps}
            >
              {content}
            </Link>
          );
        }

        return (
          <a
            key={key}
            href={href}
            {...sharedProps}
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
