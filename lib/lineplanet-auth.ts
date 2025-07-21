export interface LinePlanetTokenRequest {
  userId: string;
  serviceId: string;
  region: string;
  apiKey: string;
}

export interface LinePlanetTokenResponse {
  status: string;
  data: {
    accessToken: string;
  };
  timestamp: number;
}

/**
 * Generate an access token for LinePlanet using the registration API
 */
export async function generateAccessToken(
  params: LinePlanetTokenRequest
): Promise<string> {
  try {
    const response = await fetch(
      "https://voipnx-as.line-apps.com/v2/register_user",
      {
        method: "POST",
        headers: {
          Referer: "https://line-planet-call.lineplanet.me/",
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LinePlanetTokenResponse = await response.json();

    if (data.status !== "success") {
      throw new Error(`Token generation failed: ${data.status}`);
    }

    return data.data.accessToken;
  } catch (error) {
    console.error("Failed to generate access token:", error);
    throw error;
  }
}

/**
 * Generate access token with default parameters
 */
export async function generateDefaultAccessToken(
  userId: string
): Promise<string> {
  return generateAccessToken({
    userId,
    serviceId: "line-planet-call",
    region: "jp",
    apiKey:
      "e-Lx-xZxLXHpy0MlVudyjRAXJp1FOWN82eXIYyGyC7gmJh83U4IFQeTiaiKhvWxT5AVsuxVHztAdNUqQkXtGC0VsV2QgkQ-OuWyP57OChs-Ov_37NuTwS6sOD1Eb4PK5xQkiKoOd9nL2lqFBKqaxxg",
  });
}

/**
 * Validate if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error parsing token:", error);
    return true;
  }
}

/**
 * Get token expiration time
 */
export function getTokenExpirationTime(token: string): Date | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
}
