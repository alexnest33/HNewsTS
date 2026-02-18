export const timeAgo = (unixSeconds: number) => {
  const diffMs = Date.now() - unixSeconds * 1000;
  const totalMinutes = Math.floor(diffMs / 60000);

  if (totalMinutes < 1) return "just now";
  if (totalMinutes < 60)
    return `${totalMinutes} minute${totalMinutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(totalMinutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};
