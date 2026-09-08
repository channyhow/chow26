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

const mdkEditorialDescription = [
  "**Le Kèr** est d’abord né d’un manque, celui de la Réunion lorsqu’on en est loin. Home Is Where the Heart Is d’Elvis Presley accompagne cette idée d’un chez-soi que l’on continue de porter avec soi. Le cœur devient kèr, en créole réunionnais.",
  "Lorsque le projet de **prévention cardiovasculaire** de Jérôme Corré se présente, le lien fonctionne naturellement. Le Kèr prend alors un autre sens, tout aussi évident. Il parle toujours de la Réunion, mais aussi du cœur dont il faut prendre soin. C’est autour de cette double lecture que Channy How conçoit le logo et l’identité visuelle du Mois du Kèr pour Chow Studio.",
  "**Le cœur anatomique** s’impose assez vite. Il n’y a rien de vraiment discret dans cette identité. Illustratif et coloré, il puise librement dans les couleurs de la Réunion, entre ciel, mer, soleil, lave, flamboyants et letchis, sans chercher à attribuer une signification précise à chacune.",
  "Le cœur étant déjà très détaillé, la **typographie** reste volontairement simple, condensée et directe. Elle équilibre l’illustration et permet au nom d’exister aussi sans elle. **KÈR** garde une place particulière. Son écriture conserve la façon dont le mot sonne en créole réunionnais et lui donne suffisamment de présence pour pouvoir vivre seul dans une forme plus compacte de l’identité.",
  "Créée en **2025**, l’identité accompagne aujourd’hui la deuxième édition du Mois du Kèr à la Réunion. Avec le temps, elle continue d’évoluer. Le cœur peut prendre toute la place ou vivre seul, tandis que KÈR peut se détacher du nom complet. Les explorations présentées ici prolongent simplement cette identité sous de nouvelles formes.",
];

function createProjectPage(project: ProjectRecord): PageData {
  const mood = projectMoods[project.id];
  const profile = mood ? deriveBrandProfile(mood.axes) : undefined;
  const isMdk = project.id === "mois-du-ker";
  const storyLayout = isMdk ? "text" : (profile?.storyLayout ?? "text");
  const galleryLayout = isMdk ? "gallery" : (profile?.galleryLayout ?? "gallery");
  const projectGallery = isMdk
    ? ["mdk-color-palette", "mois-du-ker-textile", "mdk-heartbeat"]
    : project.gallery;
  const storyMedia = storyLayout === "split" ? projectGallery[0] : undefined;
  const galleryMedia = storyMedia ? projectGallery.slice(1) : projectGallery;
  const linkedMeta: MetaItem[] = (project.links ?? []).flatMap((link) => {
    const href = link.href;
    if (!href) return [];

    return [{ label: link.label, href }];
  });
  const projectMeta = [...project.facts, ...linkedMeta];
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
        className: `projectHero ${isMdk ? "projectHero--mdk" : ""} ${profileClasses}`,
        content: {
          header: {
            eyebrow: isMdk ? undefined : project.eyebrow,
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
        className: `projectStory ${isMdk ? "projectStory--mdk" : ""} ${profileClasses}`,
        content: {
          header: {
            eyebrow: isMdk ? undefined : "Le projet",
            title: isMdk ? undefined : project.summary,
            text: isMdk ? mdkEditorialDescription : project.description,
            meta: projectMeta,
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
        className: `projectGallery ${isMdk ? "projectGallery--mdk" : ""} ${profileClasses}`,
        content: {
          header: isMdk ? undefined : {
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
