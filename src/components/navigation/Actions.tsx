import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";

import { resolveActions } from "@/data/actionRegistry";
import type { Action, ActionRef } from "@/types/content";

export type ActionsProps = {
  links?: ActionRef[];
  className?: string;
  variant?: "default" | "nav" | "social" | "panel";
};

function isProjectStartAction(label: string) {
  return label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("fr") === "demarrer un projet";
}

function resolveVariant(action: Action, index: number, actionCount: number) {
  if (action.variant) return action.variant;
  if (actionCount === 2) return index === 0 ? "primary" : "arrow";
  if (actionCount === 1 && isProjectStartAction(action.label)) return "arrow";
  return action.priority === "primary" ? "primary" : undefined;
}

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);
const isInternalHref = (href: string) => href.startsWith("/") && !href.startsWith("//");
const getInternalPathname = (href: string) => href.split(/[?#]/, 1)[0] || "/";
const getHash = (href: string) => {
  const hashIndex = href.indexOf("#");
  return hashIndex >= 0 ? href.slice(hashIndex) : "";
};

export function Actions({ links = [], className, variant = "default" }: ActionsProps) {
  const { pathname } = useLocation();
  const isSocial = variant === "social";
  const resolvedLinks = resolveActions(links);

  if (!resolvedLinks.length) return null;

  return (
    <div className={clsx("actions", variant !== "default" && `actions--${variant}`, className)}>
      {resolvedLinks.map((action, index) => {
        const intent = action.intent ?? "navigate";
        const actionVariant = isSocial ? undefined : resolveVariant(action, index, resolvedLinks.length);
        const href = intent === "submit" ? undefined : action.href;
        const external = Boolean(href && isExternalHref(href));
        const hasArrow = isSocial || actionVariant === "arrow" || actionVariant === "cta" || actionVariant === "accent";
        const classNames = clsx("actions__link", actionVariant && `actions__link--${actionVariant}`);
        const content = <><span className="actions__label">{action.label}</span>{hasArrow ? <span className="actions__arrow" aria-hidden="true">{isSocial || external ? "↗" : "→"}</span> : null}</>;

        if (intent === "submit") {
          return <button key={`submit-${action.label}`} className={classNames} type="submit" data-intent="submit" data-priority={action.priority ?? "primary"}>{content}</button>;
        }
        if (!href) return null;

        const internal = !external && isInternalHref(href);
        const targetPathname = internal ? getInternalPathname(href) : "";
        const hash = internal ? getHash(href) : "";
        const isCurrentPage = internal && targetPathname === pathname;
        const key = `${action.label}-${href}`;
        const sharedProps = { className: classNames, "data-intent": intent, "data-priority": action.priority ?? "secondary" };

        if (internal) {
          const handleClick = hash && isCurrentPage
            ? (event: React.MouseEvent<HTMLAnchorElement>) => {
                const target = document.getElementById(decodeURIComponent(hash.slice(1)));
                if (!target) return;
                event.preventDefault();
                window.history.pushState(null, "", hash);
                target.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            : undefined;

          return <Link key={key} to={href} viewTransition onClick={handleClick} {...sharedProps}>{content}</Link>;
        }

        return <a key={key} href={href} {...sharedProps} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{content}</a>;
      })}
    </div>
  );
}
