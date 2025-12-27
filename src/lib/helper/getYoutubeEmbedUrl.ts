export const getYoutubeEmbedUrl = (url: string | undefined) => {
  if (!url) return "";
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsedUrl.pathname}`;
    }
    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (error) {
    return "";
  }
  return "";
};
