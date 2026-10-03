import actions from "@/data/actions.json";
import approach from "@/data/approach.json";
import collections from "@/data/collections.json";
import forms from "@/data/forms.json";
import globalBlocks from "@/data/globalBlocks.json";
import media from "@/data/media.json";
import navigation from "@/data/navigation.json";
import basePages from "@/data/pages.json";
import services from "@/data/services.json";
import site from "@/data/site.json";
import studioPage from "@/data/studioPage.json";

const pages = basePages.map((page) => (page.id === "studio" ? studioPage : page));

export {
  actions,
  approach,
  collections,
  forms,
  globalBlocks,
  media,
  navigation,
  pages,
  services,
  site,
};
