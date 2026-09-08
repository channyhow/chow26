export type MediaKind = "image" | "video" | "mux";

export type FocalPoint = {
  x: number;
  y: number;
};

export type MediaSource = {
  src: string;
  width: number;
  type?: string;
};

type MediaBase = {
  id: string;
  type: MediaKind;
  alt?: string;
  width: number;
  height: number;
  focalPoint?: FocalPoint;
  caption?: string;
  credit?: string;
  copyright?: string;
  license?: string;
  sourceUrl?: string;
};

export type ImageMediaItem = MediaBase & {
  type: "image";
  src: string;
  sources?: MediaSource[];
};

export type VideoMediaItem = MediaBase & {
  type: "video";
  src: string;
  poster?: string;
};

export type MuxMediaItem = MediaBase & {
  type: "mux";
  playbackKey: string;
};

export type MediaItem = ImageMediaItem | VideoMediaItem | MuxMediaItem;
