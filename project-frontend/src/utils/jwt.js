export function decodeJwtPayload(token) {
  if (!token) return null;

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    let normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    while (normalized.length % 4) {
      normalized += "=";
    }
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getCurrentRoleFromToken(token) {
  return decodeJwtPayload(token)?.role || null;
}
