import { lazy, Suspense, useLayoutEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";

import { SiteShell } from "@/app/SiteShell";
import { PageRenderer } from "@/components/page/PageRenderer";
import { ProjectDetailPage } from "@/app/ProjectDetailPage";
import { RouteLoader } from "@/components/page/RouteLoader";
import { Seo } from "@/components/page/Seo";
import pages from "@/data/pages.json";
import { motionConfig } from "@/motion/config";
import type { PageData } from "@/types/content";

const BrandingPage = lazy(() =>
  import("@/app/BrandingPage").then((module) => ({ default: module.BrandingPage })),
);
const SystemPage = lazy(() =>
  import("@/app/SystemPage").then((module) => ({ default: module.SystemPage })),
);
const SystemReference = lazy(() =>
  import("@/app/SystemReference").then((module) => ({ default: module.SystemReference })),
);

const pageData = pages as PageData[];
const internalRobots = { index: false, follow: false } as const;

function normalizePath(pathname: string) {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

function RoutedPage() {
  const location = useLocation();
  const pathname = normalizePath(location.pathname);

  const page =
    pageData.find((item) => normalizePath(item.slug) === pathname) ??
    pageData.find((item) => item.id === "not-found");

  if (!page) {
    return null;
  }

  const isNotFound = page.id === "not-found";

  return (
    <>
      <Seo
        seo={page.seo}
        slug={isNotFound ? location.pathname : page.slug}
      />
      <PageRenderer page={page} />
    </>
  );
}

export function App() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <SiteShell>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div
          className="routeTransition"
          key={location.pathname}
          initial={reduceMotion ? false : { opacity: 0.96, y: motionConfig.distance.route }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: motionConfig.duration.default,
              ease: motionConfig.easing.soft,
            },
          }}
          exit={
            reduceMotion
              ? undefined
              : {
                  opacity: 0,
                  transition: {
                    duration: motionConfig.duration.fast,
                    ease: motionConfig.easing.standard,
                  },
                }
          }
        >
          <RouteLoader disabled={Boolean(reduceMotion)} />
          <Routes location={location}>
            <Route
              path="/system"
              element={(
                <Suspense fallback={null}>
                  <Seo seo={{ title: "System", robots: internalRobots }} slug="/system" />
                  <SystemPage />
                  <SystemReference />
                </Suspense>
              )}
            />
            <Route
              path="/branding"
              element={(
                <Suspense fallback={null}>
                  <Seo seo={{ title: "Branding", robots: internalRobots }} slug="/branding" />
                  <BrandingPage />
                </Suspense>
              )}
            />
            <Route path="/projets/:slug" element={<ProjectDetailPage />} />
            <Route path="*" element={<RoutedPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </SiteShell>
  );
}
