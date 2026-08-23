export function getYoutubeEmbedUrl(url: string): string {
  if (!url) return "";

  // Handle standard YouTube URLs
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  return url;
}
