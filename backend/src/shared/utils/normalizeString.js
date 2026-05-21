export const normalizeString = (value) => {
  return value?.trim()?.normalize("NFKC");
};