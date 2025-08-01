// VoIP API service for LinePlanet integration

export interface VoipInitCallRequest {
  service: string;
  orderId: string;
  calleeId: string;
}

export interface VoipInitCallResponse {
  token?: string;
  readyToCall: boolean;
  stidInfo?: {
    service: string;
    orderId: string;
    uploadToken: string;
    callId: string;
  };
}

export interface VoipStidInfo {
  service: string;
  orderId: string;
  uploadToken: string;
  callId: string;
}

/**
 * Initialize VoIP call through the server API with complete headers
 */
export async function initVoipCall(
  request: VoipInitCallRequest,
  authToken: string
): Promise<VoipInitCallResponse> {
  const serverUrl = "https://beta-man-chat.wndv.co";
  const url = `${serverUrl}/lm-chat/v1/voip/init-call`;

  // Generate unique request ID and timestamp
  const requestId = generateRequestId();
  const timestamp = Math.floor(Date.now() / 1000);
  const deviceId = generateDeviceId();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
      Accept: "*/*",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
      "X-Request-ID": requestId,
      "X-Device-ID": deviceId,
      "sec-ch-ua-platform": '"macOS"',
      "sec-ch-ua":
        '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
      "X-Timezone": "Asia/Bangkok",
      "sec-ch-ua-mobile": "?0",
      "X-OS-Version": "18.5",
      "X-Client-Timestamp": timestamp.toString(),
      "X-Platform": "iOS",
      Referer: "https://lm-extension-dev.line-website-dev.com/",
      "X-Lang": "en",
      "X-App-Version": "15.46.0.12036",
      "X-Region": "BKK",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: VoipInitCallResponse = await response.json();
  return data;
}

/**
 * Generate a unique request ID (32-character hex)
 */
function generateRequestId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    .replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .replace(/-/g, "");
}

/**
 * Generate a unique device ID (UUID format)
 */
function generateDeviceId(): string {
  return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[x]/g, function () {
    return ((Math.random() * 16) | 0).toString(16).toUpperCase();
  });
}

/**
 * Generate STID from stidInfo object
 */
export function generateStid(stidInfo: VoipStidInfo): string {
  if (!stidInfo) {
    throw new Error("stidInfo is required to generate STID");
  }

  // Convert stidInfo object to base64 encoded string
  const stidString = JSON.stringify(stidInfo);
  return btoa(stidString);
}
