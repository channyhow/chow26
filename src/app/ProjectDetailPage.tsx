import { useParams } from "react-router-dom";

import { PageRenderer } from "@/components/page/PageRenderer";
import { Seo } from "@/components/page/Seo";
import collections from "@/data/collections.json";
import pages from "@/data/pages.json";
import projectDetailData from "@/data/projectDetail.json";
import type {
  BlockRef,
  MetaItem,
  PageData,
  ProjectRecord,
  SectionBlock,
  SectionContent,
  StyleVariant,
} from "@/types/content";

const projects = collections.projects as ProjectRecord[];
const pageData = pages as PageData[];

type SectionTemplate = Omit<SectionBlock, "id" | "type" | "content"> & {
  content?: SectionContent;
};

type StoryTemplate = SectionTemplate & {
  alternate?: boolean;
};

type ProjectDetailConfig = {
  page: {
    variant: StyleVariant;
    notFoundPageId: string;
  };
  hero: SectionTemplate;
  story: {
    withMedia: StoryTemplate;
    withoutMedia: StoryTemplate;
  };
  cta: SectionTemplate;
  related: SectionTemplate;
  footer: BlockRef;
};

const projectDetail = projectDetailData as ProjectDetailConfig;

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

function sectionFromTemplate(
  id: string,
  template: SectionTemplate,
  content?: SectionContent,
): SectionBlock {
  const { content: templateContent, ...section } = template;

  return {
    id,
    type: "Section",
    ...section,
    ...(content ?? templateContent
      ? { content: content ?? templateContent }
      : {}),
  };
}

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

  const hero = sectionFromTemplate(
    `project-${project.id}-hero`,
    {
      ...projectDetail.hero,
      className: [projectDetail.hero.className, detailClasses].filter(Boolean).join(" "),
    },
    {
      header: {
        title: project.title,
        subtitle: project.summary,
        meta: projectMeta,
      },
      media: project.media,
    },
  );

  const storyBlocks: SectionBlock[] = storyMedia.length
    ? storyMedia.map((media, index) => {
        const start = Math.floor((index * description.length) / storyMedia.length);
        const end = Math.floor(((index + 1) * description.length) / storyMedia.length);
        const text = description.slice(start, Math.max(start + 1, end));
        const template = projectDetail.story.withMedia;
        const baseDirection = detailLayout === "b" ? 1 : 0;
        const isReverse = template.alternate
          ? (index + baseDirection) % 2 === 1
          : false;
        const { alternate: _alternate, ...sectionTemplate } = template;

        return sectionFromTemplate(
          `project-${project.id}-story-${index + 1}`,
          {
            ...sectionTemplate,
            className: [
              sectionTemplate.className,
              detailClasses,
              template.alternate
                ? `projectStoryMedia--${isReverse ? "reverse" : "forward"}`
                : undefined,
            ].filter(Boolean).join(" "),
          },
          {
            header: { text },
            media,
          },
        );
      })
    : [
        (() => {
          const { alternate: _alternate, ...template } = projectDetail.story.withoutMedia;
          return sectionFromTemplate(
            `project-${project.id}-story`,
            {
              ...template,
              className: [template.className, detailClasses].filter(Boolean).join(" "),
            },
            { header: { text: description } },
          );
        })(),
      ];

  const cta = sectionFromTemplate(
    `project-${project.id}-cta`,
    projectDetail.cta,
  );

  const related = sectionFromTemplate(
    `project-${project.id}-related`,
    {
      ...projectDetail.related,
      source: projectDetail.related.source
        ? {
            ...projectDetail.related.source,
            query: {
              ...projectDetail.related.source.query,
              excludeIds: [project.id],
            },
          }
        : undefined,
    },
  );

  return {
    id: `project-${project.id}`,
    slug: project.href,
    variant: projectDetail.page.variant,
    seo: project.seo,
    blocks: [
      hero,
      ...storyBlocks,
      cta,
      related,
      projectDetail.footer,
    ],
  };
}

export function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    const notFoundPage = pageData.find(
      (page) => page.id === projectDetail.page.notFoundPageId,
    );

    if (!notFoundPage) return null;

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
