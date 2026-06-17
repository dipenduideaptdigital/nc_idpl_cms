
export const resolveAssetUrl = (filePathToken, fallbackPlaceholderImage) => {
  if (!filePathToken) return fallbackPlaceholderImage;
  if (filePathToken.startsWith('http://') || filePathToken.startsWith('https://')) {
    return filePathToken;
  }
  
  const serverBaseDomain = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000';
    
  return `${serverBaseDomain}${filePathToken}`;
};