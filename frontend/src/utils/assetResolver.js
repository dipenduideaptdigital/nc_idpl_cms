
export const resolveAssetUrl = (filePathToken, fallbackPlaceholderImage) => {
  if (!filePathToken) return fallbackPlaceholderImage;

  let tokenString = filePathToken;
  if (typeof filePathToken === 'object') {
    tokenString = filePathToken.url || filePathToken.src || '';
  }

  if (!tokenString || typeof tokenString !== 'string') return fallbackPlaceholderImage;

  if (tokenString.startsWith('http://') || tokenString.startsWith('https://')) {
    return tokenString;
  }
  
  const serverBaseDomain = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000';
    
  const cleanPath = tokenString.startsWith('/') ? tokenString : `/${tokenString}`;
  return `${serverBaseDomain}${cleanPath}`;
};