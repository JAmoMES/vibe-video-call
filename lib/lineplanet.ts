import * as PlanetKit from "@line/planet-kit";

export interface LinePlanetConfig {
  appId: string;
  env: "eval" | "real";
  userId: string;
  serviceId?: string;
  accessToken: string;
}

export interface CallDelegate {
  evtConnected?: () => void;
  evtDisconnected?: (reason: string) => void;
  evtVerified?: () => void;
  evtWaitConnected?: () => void;
  evtPeerConnected?: (peerId: string) => void;
  evtPeerDisconnected?: (peerId: string, reason: string) => void;
  evtPeerMicMuted?: (peerId: string, muted: boolean) => void;
  evtPeerCameraMuted?: (peerId: string, muted: boolean) => void;
  evtPeerScreenShareStarted?: (peerId: string) => void;
  evtPeerScreenShareStopped?: (peerId: string) => void;
  evtError?: (error: any) => void;
}

export interface Util {
  isSupported(): boolean;
}

// Updated MakeCallParams to match official API documentation
export interface MakeCallParams {
  myId: string;
  myServiceId?: string;
  peerId: string;
  peerServiceId?: string;
  accessToken: string;
  mediaType: "audio" | "video";
  mediaHtmlElement?: {
    my?: {
      video?: HTMLVideoElement;
      audio?: HTMLAudioElement;
    };
    peer?: {
      video?: HTMLVideoElement;
      audio?: HTMLAudioElement;
    };
  };
  mediaStreamManager?: any; // MediaStreamManager instance
  delegate?: CallDelegate;
  // Additional parameters from official API
  enableDataChannel?: boolean;
  userData?: string;
  useCloudRecording?: boolean;
  useCloudRelaying?: boolean;
}

// Updated VerifyCallParams to match official API documentation
export interface VerifyCallParams {
  myId: string;
  myServiceId?: string;
  peerId: string;
  peerServiceId?: string;
  accessToken: string;
  mediaType: "audio" | "video";
  mediaHtmlElement?: {
    my?: {
      video?: HTMLVideoElement;
      audio?: HTMLAudioElement;
    };
    peer?: {
      video?: HTMLVideoElement;
      audio?: HTMLAudioElement;
    };
  };
  mediaStreamManager?: any; // MediaStreamManager instance
  ccParam?: string;
  delegate?: CallDelegate;
  // Additional parameters from official API
  enableDataChannel?: boolean;
  userData?: string;
  useCloudRecording?: boolean;
  useCloudRelaying?: boolean;
}

export class LinePlanetService {
  private planetKit: any = null;
  private mediaStreamManager: any = null;
  private initialized = false;
  private currentConfig: LinePlanetConfig | null = null;

  /**
   * Initialize LinePlanet SDK
   */
  async initialize(config: LinePlanetConfig): Promise<void> {
    console.log("initialize");

    try {
      const planetKitUtil = new PlanetKit.Util();

      console.log(planetKitUtil.isSupported());

      this.currentConfig = config;

      // Initialize PlanetKit based on environment
      // const sdkModule =
      //   config.env === "eval"
      //     ? await import("@line/planet-kit/dist/planet-kit-eval")
      //     : PlanetKit;

      // Initialize PlanetKit with proper configuration
      this.planetKit = new PlanetKit.Call({
        userId: config.userId,
        accessToken: config.accessToken,
      });

      // Set up logging if needed
      if (this.planetKit.setLogLevel) {
        this.planetKit.setLogLevel("INFO");
      }

      this.initialized = true;
      console.log("LinePlanet SDK initialized successfully");
    } catch (error) {
      console.error("Failed to initialize LinePlanet SDK:", error);
      throw error;
    }
  }

  /**
   * Create MediaStreamManager for video preview
   */
  async createMediaStreamManager(): Promise<any> {
    try {
      // Import MediaStreamManager from the SDK
      const { MediaStreamManager } = await import("@line/planet-kit");
      this.mediaStreamManager = new MediaStreamManager();
      return this.mediaStreamManager;
    } catch (error) {
      console.error("Failed to create MediaStreamManager:", error);
      throw error;
    }
  }

  /**
   * Start video preview using MediaStreamManager
   */
  async startVideoPreview(videoElement: HTMLVideoElement): Promise<any> {
    try {
      if (!this.mediaStreamManager) {
        await this.createMediaStreamManager();
      }

      const mediaStreamParam = {
        videoElement: videoElement,
      };

      const mediaStream = await this.mediaStreamManager.createMediaStream(
        mediaStreamParam
      );
      console.log("Video preview started");
      return mediaStream;
    } catch (error) {
      console.error("Failed to start video preview:", error);
      throw error;
    }
  }

  /**
   * Stop video preview and release MediaStream
   */
  async stopVideoPreview(): Promise<void> {
    try {
      if (this.mediaStreamManager) {
        await this.mediaStreamManager.releaseMediaStream();
        console.log("Video preview stopped");
      }
    } catch (error) {
      console.error("Failed to stop video preview:", error);
      throw error;
    }
  }

  /**
   * Make a new call (caller side) - Updated with all API parameters
   */
  async makeCall(params: MakeCallParams): Promise<void> {
    if (!this.initialized || !this.planetKit) {
      throw new Error("LinePlanet SDK not initialized");
    }

    try {
      // Prepare the complete makeCallParams according to official API
      const makeCallParams: MakeCallParams = {
        myId: params.myId,
        myServiceId:
          params.myServiceId || this.currentConfig?.serviceId || "default",
        peerId: params.peerId,
        peerServiceId:
          params.peerServiceId || this.currentConfig?.serviceId || "default",
        accessToken:
          params.accessToken || this.currentConfig?.accessToken || "",
        mediaType: params.mediaType || "video",
        mediaHtmlElement: params.mediaHtmlElement,
        mediaStreamManager:
          params.mediaStreamManager || this.mediaStreamManager,

        // Additional parameters from official API
        enableDataChannel: params.enableDataChannel ?? false,
        userData: params.userData,
        useCloudRecording: params.useCloudRecording ?? false,
        useCloudRelaying: params.useCloudRelaying ?? false,

        delegate: {
          evtWaitConnected: () => {
            console.log("Waiting for connection");
            params.delegate?.evtWaitConnected?.();
          },
          evtConnected: () => {
            console.log("Connected to call");
            params.delegate?.evtConnected?.();
          },
          evtDisconnected: (disconnectedParam: any) => {
            console.log("Disconnected from call:", disconnectedParam);
            params.delegate?.evtDisconnected?.(
              disconnectedParam?.reason || "Unknown"
            );
          },
          evtError: (error: any) => {
            console.error("Call error:", error);
            params.delegate?.evtError?.(error);
          },
        },
      };

      console.log("Making call with params:", makeCallParams);
      await this.planetKit.makeCall(makeCallParams);
      console.log("Call initiated successfully");
    } catch (error) {
      console.error("Failed to make call:", error);
      throw error;
    }
  }

  /**
   * Verify and accept an incoming call (callee side) - Updated with all API parameters
   */
  async verifyCall(params: VerifyCallParams): Promise<void> {
    if (!this.initialized || !this.planetKit) {
      throw new Error("LinePlanet SDK not initialized");
    }

    try {
      // Prepare the complete verifyCallParams according to official API
      const verifyCallParams: VerifyCallParams = {
        myId: params.myId,
        myServiceId:
          params.myServiceId || this.currentConfig?.serviceId || "default",
        peerId: params.peerId,
        peerServiceId:
          params.peerServiceId || this.currentConfig?.serviceId || "default",
        accessToken:
          params.accessToken || this.currentConfig?.accessToken || "",
        mediaType: params.mediaType || "video",
        mediaHtmlElement: params.mediaHtmlElement,
        mediaStreamManager:
          params.mediaStreamManager || this.mediaStreamManager,
        ccParam: params.ccParam,

        // Additional parameters from official API
        enableDataChannel: params.enableDataChannel ?? false,
        userData: params.userData,
        useCloudRecording: params.useCloudRecording ?? false,
        useCloudRelaying: params.useCloudRelaying ?? false,

        delegate: {
          evtVerified: () => {
            console.log("Call verified, ready to accept");
            params.delegate?.evtVerified?.();
            // Automatically accept the call after verification
            this.acceptCall();
          },
          evtConnected: () => {
            console.log("Connected to call");
            params.delegate?.evtConnected?.();
          },
          evtDisconnected: (disconnectedParam: any) => {
            console.log("Disconnected from call:", disconnectedParam);
            params.delegate?.evtDisconnected?.(
              disconnectedParam?.reason || "Unknown"
            );
          },
          evtError: (error: any) => {
            console.error("Call error:", error);
            params.delegate?.evtError?.(error);
          },
        },
      };

      console.log("Verifying call with params:", verifyCallParams);
      await this.planetKit.verifyCall(verifyCallParams);
      console.log("Call verification initiated successfully");
    } catch (error) {
      console.error("Failed to verify call:", error);
      throw error;
    }
  }

  /**
   * Accept an incoming call (called after evtVerified)
   */
  async acceptCall(): Promise<void> {
    if (!this.planetKit) {
      throw new Error("LinePlanet SDK not initialized");
    }

    try {
      await this.planetKit.acceptCall();
      console.log("Call accepted successfully");
    } catch (error) {
      console.error("Failed to accept call:", error);
      throw error;
    }
  }

  /**
   * End the current call
   */
  async endCall(): Promise<void> {
    if (!this.planetKit) {
      return;
    }

    try {
      await this.planetKit.endCall();
      console.log("Call ended successfully");
    } catch (error) {
      console.error("Failed to end call:", error);
      throw error;
    }
  }

  /**
   * Mute/unmute microphone
   */
  async muteMic(mute: boolean): Promise<void> {
    if (!this.planetKit) {
      throw new Error("LinePlanet SDK not initialized");
    }

    try {
      if (mute) {
        await this.planetKit.muteMyAudio();
      } else {
        await this.planetKit.unmuteMyAudio();
      }
    } catch (error) {
      console.error("Failed to mute/unmute mic:", error);
      throw error;
    }
  }

  /**
   * Mute/unmute camera
   */
  async muteCamera(mute: boolean): Promise<void> {
    if (!this.planetKit) {
      throw new Error("LinePlanet SDK not initialized");
    }

    try {
      if (mute) {
        await this.planetKit.pauseMyVideo();
      } else {
        await this.planetKit.resumeMyVideo();
      }
    } catch (error) {
      console.error("Failed to mute/unmute camera:", error);
      throw error;
    }
  }

  /**
   * Start screen sharing
   */
  async startMyScreenShare(videoElement?: HTMLVideoElement): Promise<void> {
    if (!this.planetKit) {
      throw new Error("LinePlanet SDK not initialized");
    }

    try {
      await this.planetKit.startMyScreenShare(videoElement);
    } catch (error) {
      console.error("Failed to start screen share:", error);
      throw error;
    }
  }

  /**
   * Stop screen sharing
   */
  async stopMyScreenShare(): Promise<void> {
    if (!this.planetKit) {
      return;
    }

    try {
      await this.planetKit.stopMyScreenShare();
    } catch (error) {
      console.error("Failed to stop screen share:", error);
      throw error;
    }
  }

  /**
   * Add peer screen share view
   */
  async addPeerScreenShareView(videoElement: HTMLVideoElement): Promise<void> {
    if (!this.planetKit) {
      throw new Error("LinePlanet SDK not initialized");
    }

    try {
      await this.planetKit.addPeerScreenShareView(videoElement);
    } catch (error) {
      console.error("Failed to add peer screen share view:", error);
      throw error;
    }
  }

  /**
   * Remove peer screen share view
   */
  async removePeerScreenShareView(): Promise<void> {
    if (!this.planetKit) {
      return;
    }

    try {
      await this.planetKit.removePeerScreenShareView();
    } catch (error) {
      console.error("Failed to remove peer screen share view:", error);
      throw error;
    }
  }

  /**
   * Get current call status
   */
  getCallStatus(): string {
    if (!this.planetKit) {
      return "disconnected";
    }

    // Return the current call state
    return this.planetKit.getCallState?.() || "disconnected";
  }

  /**
   * Check if SDK is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get current configuration
   */
  getConfig(): LinePlanetConfig | null {
    return this.currentConfig;
  }

  /**
   * Get MediaStreamManager instance
   */
  getMediaStreamManager(): any {
    return this.mediaStreamManager;
  }
}

// Create a singleton instance
export const linePlanetService = new LinePlanetService();
