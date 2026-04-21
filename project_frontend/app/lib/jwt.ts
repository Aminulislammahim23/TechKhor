// Utility to decode JWT token (for client-side and server-side usage)
export function decodeJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Use atob for browser, Buffer for Node.js
    let decodedPayload: string;
    if (typeof window !== 'undefined') {
      // Browser environment
      decodedPayload = atob(payload);
    } else {
      // Node.js environment
      decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
    }
    
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Get user type from token
export function getUserTypeFromToken(token: string) {
  const decoded = decodeJWT(token);
  if (decoded && decoded.userType) {
    return decoded.userType;
  }
  if (decoded && decoded.role) {
    return decoded.role;
  }
  return null;
}
