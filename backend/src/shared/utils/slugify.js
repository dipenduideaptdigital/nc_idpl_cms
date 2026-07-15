
export const generateSlug = (text) => {
  if (!text) return "";
  
  return text
    .toString()
    .normalize("NFKD") // Normalize unicode characters
    .toLowerCase()
    .trim()
    .replace(/&/g, "and") // Convert ampersands to 'and'
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-z0-9-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple dashes with a single dash
    .replace(/^-+/, "") // Trim dashes from start
    .replace(/-+$/, "") // Trim dashes from end
    .substring(0, 150); // Hard limit to prevent SEO database overflow
};