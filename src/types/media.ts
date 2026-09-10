export type MediaKind = "image" | "video" | "mux";
export type MediaFit = "cover" | "contain";

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
  width?: number;
  height?: number;
  fit?: MediaFit;
  focalPoint?: FocalPoint;
  caption?: string;
  credit?: string;
  copyright?: string;
  license?: string;
  sourceUrl?: string;
};

type IntrinsicDimensions = {
  width: number;
  height: number;
};

export type ImageMediaItem = MediaBase & IntrinsicDimensions & {
  type: "image";
  src: string;
  sources?: MediaSource[];
};

export type VideoMediaItem = MediaBase & IntrinsicDimensions & {
  type: "video";
  src: string;
  poster?: string;
};

export type MuxMediaItem = MediaBase & {
  type: "mux";
  playbackId: string;
};

export type MediaItem = ImageMediaItem | VideoMediaItem | MuxMediaItem;
