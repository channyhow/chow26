import { useParams } from "react-router-dom";

import { PageRenderer } from "@/components/page/PageRenderer";
import { Seo } from "@/components/page/Seo";
import collections from "@/data/collections.json";
import projectMoodsData from "@/data/projectMoods.json";
import { deriveBrandProfile } from "@/utils/deriveBrandProfile";
import type { ProjectMood } from "@/types/branding";
import type { MetaItem, PageData, ProjectRecord } from "@/types/content";

const projects = collections.projects as ProjectRecord[];
const projectMoods = projectMoodsData as Record<string, ProjectMood>;

const notFoundPage: PageData = {
  id: "project-not-found",
  slug: "/404",
  variant: "editorial",
  seo: {
    title: "Projet introuvable | Chow Studio",
    description: "Ce projet Chow Studio est introuvable.",
    robots: { index: false, follow: false },
  },
  blocks: [
    { ref: "not-found-default" },
    { ref: "site-footer" },
  ],
};

const stripVisibleYear = (value: string) =>
  value
    .replace(/\s*·\s*(?:19|20)\d{2}\b/g, "")
    .replace(/\b(?:19|20)\d{2}\b/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*·\s*$/g, "")
    .trim();

const isDateMeta = (item: MetaItem) =>
  /^(année|annee|year|date)$/i.test(item.label.trim());

function createProjectPage(project: ProjectRecord): PageData {
  const mood = projectMoods[project.id];
  const profile = mood ? deriveBrandProfile(mood.axes) : undefined;
  const isMdk = project.id === "mois-du-ker";
  const detailLayout = (project.order ?? 0) % 2 === 0 ? "b" : "a";
  const linkedMeta: MetaItem[] = (project.links ?? []).flatMap((link) => {
    const href = link.href;
    if (!href) return [];

    return [{ label: link.label, href }];
  });
  const projectMeta = [...project.facts.filter((item) => !isDateMeta(item)), ...linkedMeta];
  const profileClasses = profile
    ? `projectProfile projectProfile--${profile.composition} projectProfile--media-${profile.mediaTreatment} projectProfile--spacing-${profile.spacing}`
    : "projectProfile projectProfile--structured";
  const detailClasses = `projectDetail projectDetail--${detailLayout} ${profileClasses}`;
  const description = project.description.map(stripVisibleYear);
  const heroEyebrow = isMdk
    ? undefined
    : Array.isArray(project.eyebrow)
      ? project.eyebrow.map(stripVisibleYear)
      : project.eyebrow
        ? stripVisibleYear(project.eyebrow)
        : undefined;

  return {
    id: `project-${project.id}`,
    slug: project.href,
    variant: profile?.variant ?? "editorial",
    seo: project.seo,
    blocks: [
      {
        id: `project-${project.id}-hero`,
        type: "Section",
        layout: "media-overlay",
        variant: profile?.variant,
        tone: profile?.tone,
        color: profile?.color,
        motion: profile?.motion,
        className: `projectHero ${detailClasses}`,
        content: {
          header: {
            eyebrow: heroEyebrow,
            title: project.title,
            subtitle: project.summary,
          },
          media: project.media,
        },
      },
      {
        id: `project-${project.id}-story`,
        type: "Section",
        layout: "text",
        variant: profile?.variant,
        motion: profile?.motion,
        className: `projectStory ${detailClasses}`,
        content: {
          header: {
            eyebrow: isMdk ? undefined : "Le projet",
            title: isMdk ? undefined : project.summary,
            text: description,
            meta: projectMeta,
          },
        },
      },
      {
        id: `project-${project.id}-gallery`,
        type: "Section",
        layout: "gallery",
        variant: profile?.variant,
        motion: profile?.motion,
        itemAppearance: profile?.cardEffect && profile.cardEffect !== "none"
          ? { effect: profile.cardEffect }
          : undefined,
        className: `projectGallery ${detailClasses}`,
        content: {
          media: project.gallery,
        },
      },
      {
        id: `project-${project.id}-cta`,
        type: "Section",
        layout: "text",
        variant: "editorial",
        motion: "reveal",
        className: "projectCta",
        content: {
          header: {
            title: "Un projet dans le même esprit ?",
          },
        },
      },
      { ref: "projects-featured" },
      { ref: "site-footer" },
    ],
  };
}

export function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <>
        <Seo seo={notFoundPage.seo} slug={`/projets/${slug ?? ""}`} />
        <PageRenderer page={notFoundPage} />
      </>
    );
  }

  const page = createProjectPage(project);

  return (
    <>
      <Seo seo={page.seo} slug={page.slug} />
      <PageRenderer page={page} />
    </>
  );
}
