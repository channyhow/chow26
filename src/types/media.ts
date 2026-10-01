export type MediaKind = "image" | "video" | "mux";
export type MediaFit = "cover" | "contain";
export type MediaRatio = "square" | "landscape" | "portrait" | "wide";

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
  /** Semantic display framing. Media is the sole owner of presentation ratio. */
  ratio?: MediaRatio;
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
