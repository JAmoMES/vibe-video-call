import { useState, useRef, useCallback, useEffect } from "react";
import {
  linePlanetService,
  type LinePlanetConfig,
  type CallDelegate,
} from "@/lib/lineplanet";
import { useToast } from "@/hooks/use-toast";

export interface UseLinePlanetProps {
  config: LinePlanetConfig;
}

export interface CallOptions {
  enableDataChannel?: boolean;
  userData?: string;
  useCloudRecording?: boolean;
  useCloudRelaying?: boolean;
}

export interface UseLinePlanetReturn {
  // State
  isInitialized: boolean;
  isInCall: boolean;
  isConnected: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isPreviewActive: boolean;
  callStatus: string;

  // Video refs
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  remoteAudioRef: React.RefObject<HTMLAudioElement>;
  previewVideoRef: React.RefObject<HTMLVideoElement>;
  screenShareRef: React.RefObject<HTMLVideoElement>;

  // Actions
  initializePlanet: () => Promise<void>;
  startVideoPreview: () => Promise<void>;
  stopVideoPreview: () => Promise<void>;
  makeCall: (
    peerId: string,
    peerServiceId?: string,
    options?: CallOptions,
    voipParams?: {
      service: string;
      orderId: string;
      authToken: string;
    }
  ) => Promise<void>;
  verifyCall: (
    peerId: string,
    peerServiceId?: string,
    ccParam?: string,
    options?: CallOptions
  ) => Promise<void>;
  acceptCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  toggleAudio: () => Promise<void>;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => Promise<void>;
}

export function useLinePlanet({
  config,
}: UseLinePlanetProps): UseLinePlanetReturn {
  const { toast } = useToast();

  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [callStatus, setCallStatus] = useState("disconnected");

  // Video element refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);

  // Create delegate for call events
  const createDelegate = useCallback(
    (): CallDelegate => ({
      evtWaitConnected: () => {
        console.log("Waiting for peer connection...");
        setCallStatus("waiting");
        toast({
          title: "Waiting for connection",
          description: "Waiting for the other person to join...",
        });
      },
      evtConnected: () => {
        console.log("Call connected!");
        setIsConnected(true);
        setIsInCall(true);
        setCallStatus("connected");
        toast({
          title: "Connected",
          description: "Call connected successfully!",
        });
      },
      evtDisconnected: (disconnectedParam) => {
        console.log("Call disconnected:", disconnectedParam);
        setIsConnected(false);
        setIsInCall(false);
        setCallStatus("disconnected");
        toast({
          title: "Call Ended",
          description:
            typeof disconnectedParam === "string"
              ? disconnectedParam
              : "Call has been disconnected",
          variant: "destructive",
        });
      },
      evtVerified: () => {
        console.log("Call verified, ready to accept");
        setCallStatus("verified");
        toast({
          title: "Incoming Call",
          description: "Call verified, ready to accept",
        });
      },
      evtPeerConnected: (peerId) => {
        console.log("Peer connected:", peerId);
        toast({
          title: "Peer Joined",
          description: `${peerId} has joined the call`,
        });
      },
      evtPeerDisconnected: (peerId, reason) => {
        console.log("Peer disconnected:", peerId, reason);
        toast({
          title: "Peer Left",
          description: `${peerId} has left the call`,
          variant: "destructive",
        });
      },
      evtPeerMicMuted: (peerId, muted) => {
        console.log(`Peer ${peerId} ${muted ? "muted" : "unmuted"} microphone`);
      },
      evtPeerCameraMuted: (peerId, muted) => {
        console.log(`Peer ${peerId} ${muted ? "disabled" : "enabled"} camera`);
      },
      evtPeerScreenShareStarted: (peerId) => {
        console.log("Peer started screen sharing:", peerId);
        if (screenShareRef.current) {
          linePlanetService
            .addPeerScreenShareView(screenShareRef.current)
            .catch(console.error);
        }
        toast({
          title: "Screen Share",
          description: "Peer started screen sharing",
        });
      },
      evtPeerScreenShareStopped: (peerId) => {
        console.log("Peer stopped screen sharing:", peerId);
        linePlanetService.removePeerScreenShareView().catch(console.error);
        toast({
          title: "Screen Share Ended",
          description: "Peer stopped screen sharing",
        });
      },
      evtError: (error) => {
        console.error("Call error:", error);
        setCallStatus("error");
        toast({
          title: "Call Error",
          description: error?.message || "An error occurred during the call",
          variant: "destructive",
        });
      },
    }),
    [toast]
  );

  // Initialize the SDK
  const initializePlanet = useCallback(async () => {
    try {
      await linePlanetService.initialize(config);
      setIsInitialized(true);
      setCallStatus("initialized");
      toast({
        title: "SDK Initialized",
        description: "LinePlanet SDK is ready to use",
      });
    } catch (error) {
      console.error("Failed to initialize LinePlanet:", error);
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize LinePlanet SDK",
        variant: "destructive",
      });
      throw error;
    }
  }, [config, toast]);

  // Start video preview using MediaStreamManager
  const startVideoPreview = useCallback(async () => {
    if (!isInitialized) {
      throw new Error("SDK not initialized");
    }

    if (!previewVideoRef.current) {
      throw new Error("Preview video element not available");
    }

    try {
      await linePlanetService.startVideoPreview(previewVideoRef.current);
      setIsPreviewActive(true);
      toast({
        title: "Video Preview Started",
        description: "You can now see your video preview",
      });
    } catch (error) {
      console.error("Failed to start video preview:", error);
      toast({
        title: "Preview Failed",
        description: "Failed to start video preview",
        variant: "destructive",
      });
      throw error;
    }
  }, [isInitialized, toast]);

  // Stop video preview
  const stopVideoPreview = useCallback(async () => {
    try {
      await linePlanetService.stopVideoPreview();
      setIsPreviewActive(false);
      toast({
        title: "Video Preview Stopped",
        description: "Video preview has been stopped",
      });
    } catch (error) {
      console.error("Failed to stop video preview:", error);
      toast({
        title: "Stop Preview Failed",
        description: "Failed to stop video preview",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Make a call (caller side) - Updated with manual VoIP data input
  const makeCall = useCallback(
    async (
      peerId: string,
      peerServiceId?: string,
      options?: CallOptions,
      voipParams?: {
        service: string;
        orderId: string;
        authToken: string;
      }
    ) => {
      if (!isInitialized) {
        throw new Error("SDK not initialized");
      }

      try {
        setCallStatus("calling");
        toast({
          title: "Starting Call",
          description: "Setting up call parameters...",
        });

        await linePlanetService.makeCall({
          myId: config.userId,
          myServiceId: "LINEMAN-eval",
          peerId,
          peerServiceId: "LINEMAN-eval",
          accessToken: config.accessToken,
          mediaType: "audio",
          mediaHtmlElement: {
            my: {
              video: localVideoRef.current || undefined,
            },
            peer: {
              audio: remoteAudioRef.current || undefined,
              video: remoteVideoRef.current || undefined,
            },
          },
          mediaStreamManager: linePlanetService.getMediaStreamManager(),
          delegate: {
            evtVerified: () => {
              console.log("Call verified, ready to accept");
              // params.delegate?.evtVerified?.();
              // Automatically accept the call after verification
              acceptCall();
            },
            evtConnected: () => {
              console.log("Connected to call");
              // params.delegate?.evtConnected?.();
            },
            evtDisconnected: (disconnectedParam: any) => {
              console.log("Disconnected from call:", disconnectedParam);
              // params.delegate?.evtDisconnected?.(
              //   disconnectedParam?.reason || "Unknown"
              // );
            },
            evtError: (error: any) => {
              console.error("Call error:", error);
              // params.delegate?.evtError?.(error);
            },
          },

          // Additional API parameters
          enableDataChannel: options?.enableDataChannel ?? false,
          userData: options?.userData,
          useCloudRecording: options?.useCloudRecording ?? true,
          useCloudRelaying: options?.useCloudRelaying ?? false,

          // VoIP parameters
          service: voipParams?.service || "mart",
          orderId: voipParams?.orderId || "",
          calleeId: peerId,
          authToken: voipParams?.authToken || config.accessToken,
        });

        toast({
          title: "Call Started",
          description: `Calling ${peerId}...`,
        });
      } catch (error) {
        console.error("Failed to make call:", error);
        setCallStatus("error");
        toast({
          title: "Call Failed",
          description: "Failed to initiate call",
          variant: "destructive",
        });
        throw error;
      }
    },
    [isInitialized, config, createDelegate, toast]
  );

  // Verify incoming call (callee side) - Updated with additional API parameters
  const verifyCall = useCallback(
    async (
      peerId: string,
      peerServiceId?: string,
      ccParam?: string,
      options?: CallOptions
    ) => {
      if (!isInitialized) {
        throw new Error("SDK not initialized");
      }

      try {
        setCallStatus("verifying");
        toast({
          title: "Getting Access Token",
          description: "Fetching gateway access token for verification...",
        });

        // Following the official documentation structure for verifyCallParams with all parameters
        // Note: The gateway access token will be fetched internally in the verifyCall method
        await linePlanetService.verifyCall({
          myId: config.userId,
          myServiceId: "LINEMAN-eval",
          peerServiceId: "LINEMAN-eval",
          mediaType: "audio",
          mediaHtmlElement: {
            my: {
              video: localVideoRef.current || undefined,
            },
            peer: {
              audio: remoteAudioRef.current || undefined,
              video: remoteVideoRef.current || undefined,
            },
          },
          mediaStreamManager: linePlanetService.getMediaStreamManager(),
          ccParam,
          delegate: createDelegate(),

          // Additional API parameters
          enableDataChannel: options?.enableDataChannel ?? false,
          userData: options?.userData,
          useCloudRecording: options?.useCloudRecording ?? false,
          useCloudRelaying: options?.useCloudRelaying ?? false,
        });

        toast({
          title: "Verifying Call",
          description: `Verifying call from ${peerId}...`,
        });
      } catch (error) {
        console.error("Failed to verify call:", error);
        setCallStatus("error");
        toast({
          title: "Verification Failed",
          description: "Failed to verify incoming call",
          variant: "destructive",
        });
        throw error;
      }
    },
    [isInitialized, config, createDelegate, toast]
  );

  // Accept call - following the official documentation
  const acceptCall = useCallback(async () => {
    try {
      await linePlanetService.acceptCall();
      setCallStatus("accepting");
      toast({
        title: "Accepting Call",
        description: "Accepting incoming call...",
      });
    } catch (error) {
      console.error("Failed to accept call:", error);
      toast({
        title: "Accept Failed",
        description: "Failed to accept call",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // End call
  const endCall = useCallback(async () => {
    try {
      await linePlanetService.endCall();
      setIsInCall(false);
      setIsConnected(false);
      setCallStatus("disconnected");
      toast({
        title: "Call Ended",
        description: "Call has been ended",
      });
    } catch (error) {
      console.error("Failed to end call:", error);
      toast({
        title: "End Call Failed",
        description: "Failed to end call",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Toggle video (using the camera mute/unmute methods)
  const toggleVideo = useCallback(async () => {
    try {
      const newState = !isVideoEnabled;
      await linePlanetService.muteCamera(!newState);
      setIsVideoEnabled(newState);
      toast({
        title: newState ? "Video Enabled" : "Video Disabled",
        description: `Camera has been ${newState ? "turned on" : "turned off"}`,
      });
    } catch (error) {
      console.error("Failed to toggle video:", error);
      toast({
        title: "Video Toggle Failed",
        description: "Failed to toggle video",
        variant: "destructive",
      });
      throw error;
    }
  }, [isVideoEnabled, toast]);

  // Toggle audio (using the mic mute/unmute methods)
  const toggleAudio = useCallback(async () => {
    try {
      const newState = !isAudioEnabled;
      await linePlanetService.muteMic(!newState);
      setIsAudioEnabled(newState);
      toast({
        title: newState ? "Audio Enabled" : "Audio Disabled",
        description: `Microphone has been ${
          newState ? "turned on" : "turned off"
        }`,
      });
    } catch (error) {
      console.error("Failed to toggle audio:", error);
      toast({
        title: "Audio Toggle Failed",
        description: "Failed to toggle audio",
        variant: "destructive",
      });
      throw error;
    }
  }, [isAudioEnabled, toast]);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      await linePlanetService.startMyScreenShare(
        screenShareRef.current || undefined
      );
      setIsScreenSharing(true);
      toast({
        title: "Screen Sharing Started",
        description: "You are now sharing your screen",
      });
    } catch (error) {
      console.error("Failed to start screen sharing:", error);
      toast({
        title: "Screen Share Failed",
        description: "Failed to start screen sharing",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    try {
      await linePlanetService.stopMyScreenShare();
      setIsScreenSharing(false);
      toast({
        title: "Screen Sharing Stopped",
        description: "Screen sharing has been stopped",
      });
    } catch (error) {
      console.error("Failed to stop screen sharing:", error);
      toast({
        title: "Stop Screen Share Failed",
        description: "Failed to stop screen sharing",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isInCall) {
        endCall().catch(console.error);
      }
      if (isPreviewActive) {
        stopVideoPreview().catch(console.error);
      }
    };
  }, [isInCall, isPreviewActive, endCall, stopVideoPreview]);

  return {
    // State
    isInitialized,
    isInCall,
    isConnected,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    isPreviewActive,
    callStatus,

    // Video refs
    localVideoRef,
    remoteVideoRef,
    remoteAudioRef,
    previewVideoRef,
    screenShareRef,

    // Actions
    initializePlanet,
    startVideoPreview,
    stopVideoPreview,
    makeCall,
    verifyCall,
    acceptCall,
    endCall,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
  };
}
