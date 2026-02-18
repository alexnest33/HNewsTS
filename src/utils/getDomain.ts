export const getDomain = (url?: string) => {
  try {
    if (!url) return "";
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};
