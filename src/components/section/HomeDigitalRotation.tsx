import { MediaRotation } from "@/components/content/MediaRotation";
import { resolveMediaList } from "@/data/resolveMedia";

export function HomeDigitalRotation() {
  const items = resolveMediaList(["flo-laptop", "flo-mobile"]);
  return <MediaRotation items={items} className="homeServicesStory__digitalMedia" sizes="(min-width: 64rem) 52vw, 100vw" />;
}
