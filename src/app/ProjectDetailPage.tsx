import { useParams } from "react-router-dom";

import { PageRenderer } from "@/components/page/PageRenderer";
import { Seo } from "@/components/page/Seo";
import collections from "@/data/collections.json";
import type { PageData, ProjectRecord } from "@/types/content";

const projects = collections.projects as ProjectRecord[];

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
  return {
    id: `project-${project.id}`,
    slug: project.href,
    variant: "editorial",
    seo: project.seo,
    blocks: [
      {
        id: `project-${project.id}-hero`,
        type: "Section",
        layout: "media-overlay",
        className: "projectHero",
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
        layout: "text",
        className: "projectStory",
        content: {
          header: {
            eyebrow: "Le projet",
            title: project.summary,
            text: project.description,
            meta: project.facts,
          },
        },
      },
      {
        id: `project-${project.id}-gallery`,
        type: "Section",
        layout: "gallery",
        content: {
          header: {
            eyebrow: "Galerie",
            title: `Détails de ${project.title}.`,
          },
          media: project.gallery,
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
