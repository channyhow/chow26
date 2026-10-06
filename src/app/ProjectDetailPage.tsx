import { useParams } from "react-router-dom";

import { PageRenderer } from "@/components/page/PageRenderer";
import { Seo } from "@/components/page/Seo";
import collections from "@/data/collections.json";
import pages from "@/data/pages.json";
import projectDetailData from "@/data/projectDetail.json";
import { resolveActions } from "@/data/actionRegistry";
import type {
  MetaItem,
  PageData,
  ProjectRecord,
  SectionBlock,
  SectionContent,
  SectionGroup,
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
  related: SectionTemplate;
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


function withoutAlternate(template: StoryTemplate): SectionTemplate {
  const copy: StoryTemplate = { ...template };
  delete copy.alternate;
  return copy;
}

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
  const linkedMeta: MetaItem[] = resolveActions(project.links ?? []).flatMap((link) => {
    if (!link.href) return [];
    return [{ label: "Lien", value: link.label, href: link.href }];
  });
  const projectMeta = [
    ...project.facts.filter((item) => !isDateMeta(item)),
    ...linkedMeta,
  ];
  const detailClasses = `projectDetail projectDetail--${detailLayout} projectDetail--project-${project.id}`;
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
        const alternate = template.alternate !== false && index % 2 === 1;

        return sectionFromTemplate(
          `project-${project.id}-story-${index + 1}`,
          {
            ...withoutAlternate(template),
            className: [
              template.className,
              detailClasses,
              alternate ? "projectDetail__story--alternate" : "",
            ].filter(Boolean).join(" "),
          },
          {
            header: { text },
            media,
          },
        );
      })
    : [
        sectionFromTemplate(
          `project-${project.id}-story`,
          {
            ...withoutAlternate(projectDetail.story.withoutMedia),
            className: [projectDetail.story.withoutMedia.className, detailClasses].filter(Boolean).join(" "),
          },
          { header: { text: description } },
        ),
      ];

  const related = sectionFromTemplate(
    `project-${project.id}-related`,
    {
      ...projectDetail.related,
      className: [projectDetail.related.className, detailClasses].filter(Boolean).join(" "),
      source: {
        collection: "projects",
        query: {
          excludeIds: [project.id],
          limit: 3,
        },
      },
    },
  );

  const closingGroup: SectionGroup = {
    id: `project-${project.id}-closing`,
    type: "Group",
    layout: "scroll-panel",
    panels: [
      {
        id: `project-${project.id}-related-panel`,
        behavior: "sticky",
        frame: "content",
        size: "full",
        align: "center",
        surface: "solid",
        color: "secondary",
        blocks: [related],
      },
      {
        id: `project-${project.id}-final-panel`,
        behavior: "overlay",
        frame: "content",
        size: "full",
        align: "center",
        surface: "glass",
        color: "primary",
        blocks: [{ ref: "final-cta" }, { ref: "site-footer" }],
      },
    ],
  };

  return {
    id: `project-${project.id}`,
    slug: project.href,
    variant: projectDetail.page.variant,
    seo: project.seo,
    blocks: [hero, ...storyBlocks, closingGroup],
  };
}

export function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    const notFoundPage = pageData.find((page) => page.id === projectDetail.page.notFoundPageId);
    if (!notFoundPage) return null;
    return (
      <>
        {notFoundPage.seo ? <Seo seo={notFoundPage.seo} slug={notFoundPage.slug} /> : null}
        <PageRenderer page={notFoundPage} />
      </>
    );
  }

  const page = createProjectPage(project);

  return (
    <>
      {page.seo ? <Seo seo={page.seo} slug={page.slug} /> : null}
      <PageRenderer page={page} />
    </>
  );
}
