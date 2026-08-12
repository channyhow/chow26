export type MediaKind = "image" | "video";

export type FocalPoint = {
  x: number;
  y: number;
};

export type MediaSource = {
  src: string;
  width: number;
  type?: string;
};

export type MediaItem = {
  id: string;
  type: MediaKind;
  src: string;
  alt?: string;
  width: number;
  height: number;
  poster?: string;
  focalPoint?: FocalPoint;
  sources?: MediaSource[];
  caption?: string;
  credit?: string;
  copyright?: string;
  license?: string;
  sourceUrl?: string;
};
