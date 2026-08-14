import { useParams } from "react-router-dom";

import { PageRenderer } from "@/components/page/PageRenderer";
import { Seo } from "@/components/page/Seo";
import collections from "@/data/collections.json";
import projectMoodsData from "@/data/projectMoods.json";
import { deriveBrandProfile } from "@/utils/deriveBrandProfile";
import type { ProjectMood } from "@/types/branding";
import type { PageData, ProjectRecord } from "@/types/content";

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

function createProjectPage(project: ProjectRecord): PageData {
  const mood = projectMoods[project.id];
  const profile = mood ? deriveBrandProfile(mood.axes) : undefined;
  const storyLayout = profile?.storyLayout ?? "text";
  const galleryLayout = profile?.galleryLayout ?? "gallery";
  const storyMedia = storyLayout === "split" ? project.gallery[0] : undefined;
  const galleryMedia = storyMedia ? project.gallery.slice(1) : project.gallery;
  const profileClasses = profile
    ? `projectProfile projectProfile--${profile.composition} projectProfile--media-${profile.mediaTreatment} projectProfile--spacing-${profile.spacing}`
    : "projectProfile projectProfile--structured";

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
        className: `projectHero ${profileClasses}`,
        content: {
          header: {
            eyebrow: project.eyebrow,
            title: project.title,
            subtitle: project.summary,
          },
          media: project.media,
        },
      },
      {
        id: `project-${project.id}-story`,
        type: "Section",
        layout: storyLayout,
        variant: profile?.variant,
        motion: profile?.motion,
        className: `projectStory ${profileClasses}`,
        content: {
          header: {
            eyebrow: "Le projet",
            title: project.summary,
            text: project.description,
            meta: project.facts,
          },
          media: storyMedia,
        },
      },
      {
        id: `project-${project.id}-gallery`,
        type: "Section",
        layout: galleryLayout,
        variant: profile?.variant,
        motion: profile?.motion,
        itemAppearance: profile?.cardEffect && profile.cardEffect !== "none"
          ? { effect: profile.cardEffect }
          : undefined,
        className: `projectGallery ${profileClasses}`,
        content: {
          header: {
            eyebrow: galleryLayout === "carousel" ? "Séquence" : "Galerie",
            title: `Détails de ${project.title}.`,
          },
          media: galleryMedia,
        },
      },
      { ref: "projects-featured" },
      { ref: "final-cta" },
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
