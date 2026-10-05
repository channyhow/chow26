import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";

import { SiteShell } from "@/app/SiteShell";
import { PageRenderer } from "@/components/page/PageRenderer";
import { RouteLoader } from "@/components/page/RouteLoader";
import { Seo } from "@/components/page/Seo";
import pages from "@/data/pages.json";
import type { PageData } from "@/types/content";

const BrandingPage = lazy(() => import("@/app/BrandingPage").then((module) => ({ default: module.BrandingPage })));
const ProjectDetailPage = lazy(() => import("@/app/ProjectDetailPage").then((module) => ({ default: module.ProjectDetailPage })));
const SystemPage = lazy(() => import("@/app/SystemPage").then((module) => ({ default: module.SystemPage })));
const SystemReference = lazy(() => import("@/app/SystemReference").then((module) => ({ default: module.SystemReference })));

const pageData = pages as PageData[];
const internalRobots = { index: false, follow: false } as const;

function normalizePath(pathname: string) { if (pathname === "/") return pathname; return pathname.replace(/\/+$/, ""); }

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let frame = 0;
    let attempts = 0;

    const scrollToTarget = () => {
      const target = document.getElementById(id);
      if (!target) {
        attempts += 1;
        if (attempts < 24) frame = window.requestAnimationFrame(scrollToTarget);
        return;
      }

      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const isPanel = target.classList.contains("sectionGroup__panel");
      window.scrollTo({ top: targetTop + (isPanel ? 2 : 0), left: 0, behavior: "auto" });
    };

    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(scrollToTarget);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

function RoutedPage() {
  const location = useLocation();
  const pathname = normalizePath(location.pathname);
  const page = pageData.find((item) => normalizePath(item.slug) === pathname) ?? pageData.find((item) => item.id === "not-found");
  if (!page) return null;
  const isNotFound = page.id === "not-found";
  return <><Seo seo={page.seo} slug={isNotFound ? location.pathname : page.slug} /><PageRenderer page={page} /></>;
}

export function App() {
  const location = useLocation();
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowInitialLoader(false), 2400);
    return () => window.clearTimeout(timeout);
  }, []);

  return <SiteShell>
    <ScrollManager />
    <AnimatePresence>{showInitialLoader && <RouteLoader />}</AnimatePresence>
    <div className="routeTransition" key={location.pathname}>
      <Routes location={location}>
        <Route path="/system" element={<Suspense fallback={<RouteLoader />}><Seo seo={{ title: "System", robots: internalRobots }} slug="/system" /><SystemPage /><SystemReference /></Suspense>} />
        <Route path="/branding" element={<Suspense fallback={<RouteLoader />}><Seo seo={{ title: "Branding", robots: internalRobots }} slug="/branding" /><BrandingPage /></Suspense>} />
        <Route path="/projets/:slug" element={<Suspense fallback={<RouteLoader />}><ProjectDetailPage /></Suspense>} />
        <Route path="*" element={<RoutedPage />} />
      </Routes>
    </div>
  </SiteShell>;
}
