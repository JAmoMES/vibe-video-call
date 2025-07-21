declare module "@line/planet-kit" {
  export interface ConferenceOptions {
    appId?: string;
    userId?: string;
    accessToken?: string;
  }

  export interface CallDelegate {
    evtConnected?: () => void;
    evtDisconnected?: (disconnectedParam?: any) => void;
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

  // Official MakeCallParams based on the documentation
  export interface MakeCallParams {
    myId: string;
    myServiceId?: string;
    peerId: string;
    peerServiceId?: string;
    accessToken: string;
    mediaType: "audio" | "video";
    mediaHtmlElement?: CallMediaHtmlElement;
    mediaStreamManager?: MediaStreamManager;
    delegate?: any; // MakeCallDelegate
    enableDataChannel?: boolean;
    userData?: string;
    useCloudRecording?: boolean;
    useCloudRelaying?: boolean;
  }

  // Official VerifyCallParams based on the documentation
  export interface VerifyCallParams {
    myId: string;
    myServiceId?: string;
    peerId: string;
    peerServiceId?: string;
    accessToken: string;
    mediaType: "audio" | "video";
    mediaHtmlElement?: CallMediaHtmlElement;
    mediaStreamManager?: MediaStreamManager;
    ccParam?: string;
    delegate?: any; // VerifyCallDelegate
    enableDataChannel?: boolean;
    userData?: string;
    useCloudRecording?: boolean;
    useCloudRelaying?: boolean;
  }

  // CallMediaHtmlElement structure from documentation
  export interface CallMediaHtmlElement {
    my?: {
      video?: HTMLVideoElement;
      audio?: HTMLAudioElement;
    };
    peer?: {
      video?: HTMLVideoElement;
      audio?: HTMLAudioElement;
    };
  }

  export interface MediaStreamParam {
    videoElement?: HTMLVideoElement;
    audioElement?: HTMLAudioElement;
  }

  export class MediaStreamManager {
    constructor();
    createMediaStream(param: MediaStreamParam): Promise<MediaStream>;
    createAudioStream(param?: MediaStreamParam): Promise<MediaStream>;
    createVideoStream(param?: MediaStreamParam): Promise<MediaStream>;
    releaseMediaStream(): Promise<void>;
    releaseAudioStream(): Promise<void>;
    releaseVideoStream(): Promise<void>;
    getMediaStream(): MediaStream | null;
    getAudioStream(): MediaStream | null;
    getVideoStream(): MediaStream | null;
    hasAudioStream(): boolean;
    hasVideoStream(): boolean;
    changeVideoView(videoElement: HTMLVideoElement): void;
    changeAudioInputDevice(deviceId: string): Promise<void>;
    changeVideoInputDevice(deviceId: string): Promise<void>;
    getDevices(): Promise<MediaDeviceInfo[]>;
    getAudioInputDevices(): Promise<MediaDeviceInfo[]>;
    getVideoInputDevices(): Promise<MediaDeviceInfo[]>;
    getAudioOutputDevices(): Promise<MediaDeviceInfo[]>;
  }

  export class Util {
    isSupported(): boolean;
    static createMediaStream(
      constraints?: MediaStreamConstraints
    ): Promise<MediaStream>;
    static cleanupMediaStream(stream: MediaStream): void;
    static setVideoMirror(
      videoElement: HTMLVideoElement,
      mirror: boolean
    ): void;
    static getScreenShareConstraints(): MediaStreamConstraints;
    static getBrowserInfo(): { browser: string; version: string };
  }

  export class Call {
    constructor(options?: ConferenceOptions);

    // Call methods
    makeCall(params: MakeCallParams): Promise<void>;
    verifyCall(params: VerifyCallParams): Promise<void>;
    acceptCall(): Promise<void>;
    endCall(): Promise<void>;

    // Media control methods
    muteMyAudio(): Promise<void>;
    unmuteMyAudio(): Promise<void>;
    pauseMyVideo(): Promise<void>;
    resumeMyVideo(): Promise<void>;
    enableVideo(options?: any): Promise<void>;
    disableVideo(): Promise<void>;

    // Device control methods
    changeAudioInputDevice(deviceId: string): Promise<void>;
    changeAudioOutputDevice(deviceId: string): Promise<void>;
    changeVideoInputDevice(deviceId: string): Promise<void>;
    changeMyView(videoElement: HTMLVideoElement): void;

    // Screen sharing methods
    startMyScreenShare(videoElement?: HTMLVideoElement): Promise<void>;
    stopMyScreenShare(): Promise<void>;
    muteMyScreenShareAudio(): Promise<void>;
    addPeerScreenShareView(videoElement: HTMLVideoElement): Promise<void>;
    removePeerScreenShareView(): Promise<void>;
    changePeerScreenShareView(videoElement: HTMLVideoElement): void;
    changeMyScreenShareView(videoElement: HTMLVideoElement): void;

    // Media stream methods
    getMyMediaStream(): MediaStream | null;
    setCustomMediaStream(stream: MediaStream): Promise<void>;
    unsetCustomMediaStream(): Promise<void>;
    hasSetCustomMediaStreamWithAudio(): boolean;
    hasSetCustomMediaStreamWithVideo(): boolean;

    // Advanced features
    setVideoMirror(mirror: boolean): void;
    sendShortData(data: Uint8Array): Promise<void>;
    changePeerView(videoElement: HTMLVideoElement): void;
    requestPeerMute(mute: boolean): Promise<void>;

    // Cloud recording
    isRecordOnCloudActivated(): boolean;

    // Virtual background
    registerVirtualBackground(imageUrl: string): Promise<void>;
    isVirtualBackgroundRegistered(): boolean;
    startVirtualBackgroundBlur(intensity?: number): Promise<void>;
    startVirtualBackgroundImage(imageUrl: string): Promise<void>;
    stopVirtualBackground(): Promise<void>;
    getVirtualBackgroundVideoStream(): MediaStream | null;
    changeVirtualBackgroundVideoElement(videoElement: HTMLVideoElement): void;
    changeVirtualBackgroundCanvasElement(
      canvasElement: HTMLCanvasElement
    ): void;
    isVirtualBackgroundActive(): boolean;

    // Utility methods
    setLogLevel?(level: string): void;
    getCallState?(): string;
    getVersion(): string;
    getCurrentStats(): Promise<any>;
    dispose?(): Promise<void>;
  }

  export class Conference {
    constructor(options?: ConferenceOptions);

    // Conference methods
    joinConference(params: any): Promise<void>;
    leaveConference(): Promise<void>;

    // Peer management
    requestPeerVideo(params: any): Promise<void>;
    removePeerVideo(userId: string): Promise<void>;
    updatePeerVideo(params: any): Promise<void>;
    isPeer(userId: string): boolean;
    getPeersUserId(): string[];
    getPeerInfo(userId: string): any;
    getPeersInfo(): any[];

    // Media control methods (same as Call)
    muteMyAudio(): Promise<void>;
    unmuteMyAudio(): Promise<void>;
    pauseMyVideo(): Promise<void>;
    resumeMyVideo(): Promise<void>;
    enableVideo(options?: any): Promise<void>;
    disableVideo(): Promise<void>;

    // ... other methods similar to Call class
  }

  // Main exports
  export { Call as default };
}

declare module "@line/planet-kit/dist/planet-kit-eval" {
  export * from "@line/planet-kit";
}
