import { useParams } from "react-router-dom";

import { PageRenderer } from "@/components/page/PageRenderer";
import { Seo } from "@/components/page/Seo";
import collections from "@/data/collections.json";
import type { MetaItem, PageData, ProjectRecord, SectionBlock } from "@/types/content";

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

const stripVisibleYear = (value: string) =>
  value
    .replace(/\s*·\s*(?:19|20)\d{2}\b/g, "")
    .replace(/\b(?:19|20)\d{2}\b/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*·\s*$/g, "")
    .trim();

const isDateMeta = (item: MetaItem) =>
  /^(année|annee|year|date)$/i.test(item.label.trim());

const toDisplayMeta = (item: MetaItem): MetaItem => ({
  label: item.value ?? item.label,
  href: item.href,
});

function createProjectPage(project: ProjectRecord): PageData {
  const detailLayout = project.projectLayout ?? "a";
  const linkedMeta: MetaItem[] = (project.links ?? []).flatMap((link) => {
    if (!link.href) return [];
    return [{ label: link.label, href: link.href }];
  });
  const projectMeta = [
    ...project.facts.filter((item) => !isDateMeta(item)),
    ...linkedMeta,
  ].map(toDisplayMeta);
  const detailClasses = `projectDetail projectDetail--${detailLayout}`;
  const description = project.description.map(stripVisibleYear);
  const storyMedia = project.gallery ?? [];

  const storyBlocks: SectionBlock[] = storyMedia.length
    ? storyMedia.map((media, index) => {
        const start = Math.floor((index * description.length) / storyMedia.length);
        const end = Math.floor(((index + 1) * description.length) / storyMedia.length);
        const text = description.slice(start, Math.max(start + 1, end));
        const baseDirection = detailLayout === "b" ? 1 : 0;
        const isReverse = (index + baseDirection) % 2 === 1;

        return {
          id: `project-${project.id}-story-${index + 1}`,
          type: "Section",
          layout: "split",
          variant: "editorial",
          motion: "scene",
          motionPreset: "parallax",
          className: `projectStoryMedia ${detailClasses} projectStoryMedia--${isReverse ? "reverse" : "forward"}`,
          content: {
            header: { text },
            media,
          },
        };
      })
    : [
        {
          id: `project-${project.id}-story`,
          type: "Section",
          layout: "text",
          variant: "editorial",
          motion: "scene",
          motionPreset: "parallax",
          className: `projectStoryText ${detailClasses}`,
          content: {
            header: { text: description },
          },
        },
      ];

  return {
    id: `project-${project.id}`,
    slug: project.href,
    variant: "editorial",
    seo: project.seo,
    blocks: [
      {
        id: `project-${project.id}-hero`,
        type: "Section",
        layout: "split",
        variant: "editorial",
        color: "secondary",
        motion: "scene",
        motionPreset: "parallax",
        className: `projectHero ${detailClasses}`,
        content: {
          header: {
            title: project.title,
            subtitle: project.summary,
            meta: projectMeta,
          },
          media: project.media,
        },
      },
      ...storyBlocks,
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
