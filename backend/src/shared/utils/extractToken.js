export const extractBearerToken = (
  authorizationHeader
) => {
  if (!authorizationHeader) {
    return null;
  }

  const parts = authorizationHeader.split(" ");

  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer"
  ) {
    return null;
  }

  return parts[1];
};