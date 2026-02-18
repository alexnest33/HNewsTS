export const formatDate = (unixSeconds: number) => {
  return new Date(unixSeconds * 1000).toLocaleString();
};
