export const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFKD") 
    .toLowerCase()
    .trim()
    .replace(/&/g, "and") 
    .replace(/\s+/g, "-") 
    .replace(/[^a-z0-9-\/]+/g, "") 
    .replace(/\-\-+/g, "-") 
    .replace(/^-+/, "") 
    .replace(/-+$/, "") 
    .substring(0, 150); 
};