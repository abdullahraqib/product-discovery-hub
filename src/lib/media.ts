const VIDEO_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?|#|$)/i;

/** True when a media URL points at a video file rather than an image. */
export function isVideo(url: string): boolean {
  return VIDEO_EXT.test(url);
}

/** First image in a media list, ignoring videos. */
export function firstImage(media: string[]): string | undefined {
  return media.find((m) => !isVideo(m));
}
