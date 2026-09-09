import type { PageData, PanelLane, SectionGroup } from "@/types/content";

const homeProjectPanels: PanelLane[] = [
  {
    id: "home-projects-carousel-panel",
    behavior: "cover",
    size: "full",
    align: "center",
    surface: "glass",
    color: "special",
    blocks: [
      {
        id: "projects-featured-carousel",
        type: "Section",
        layout: "carousel",
        source: {
          collection: "projects",
          query: { featured: true, limit: 5 },
        },
      },
    ],
  },
  {
    id: "home-projects-editorial-panel",
    behavior: "cover",
    size: "full",
    align: "center",
    surface: "solid",
    color: "secondary",
    blocks: [
      {
        id: "projects-featured-editorial",
        type: "Section",
        layout: "grid",
        className: "homeProjectsEditorial",
        source: {
          collection: "projects",
          query: { featured: true, limit: 3 },
        },
        content: {
          header: {
            title: "Trois projets, trois réponses.",
            links: [
              {
                label: "Voir tous les projets",
                href: "/projets",
                intent: "navigate",
                priority: "secondary",
                variant: "arrow",
              },
            ],
          },
        },
      },
    ],
  },
];

function prepareHomeGroup(group: SectionGroup): SectionGroup {
  if (group.id !== "home-story" || !group.panels?.length) return group;

  const panels = group.panels.flatMap((panel) =>
    panel.id === "home-projects-panel" ? homeProjectPanels : [panel],
  );

  return { ...group, panels };
}

export function preparePages(pages: PageData[]): PageData[] {
  return pages.map((page) => {
    if (page.id !== "home") return page;

    return {
      ...page,
      blocks: page.blocks.map((block) =>
        "type" in block && block.type === "Group" ? prepareHomeGroup(block) : block,
      ),
    };
  });
}
