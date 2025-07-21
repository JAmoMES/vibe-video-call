"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Copy,
  Users,
  Wifi,
  WifiOff,
  Monitor,
  MonitorOff,
  Settings,
  PhoneCall,
  PhoneIncoming,
  RefreshCw,
  Key,
  Play,
  Square,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLinePlanet } from "@/hooks/use-lineplanet";
import {
  generateDefaultAccessToken,
  isTokenExpired,
  getTokenExpirationTime,
} from "@/lib/lineplanet-auth";

// LinePlanet configuration with dynamic token generation
const createConfig = (userId: string, accessToken: string) => ({
  appId: "your-app-id", // Replace with your actual LinePlanet App ID
  env: "eval" as const, // Use "real" for production
  userId,
  serviceId: "line-planet-call",
  accessToken,
});

export default function LinePlanetCallPage() {
  const { toast } = useToast();

  // User and call state
  const [userId, setUserId] = useState(
    "user-" + Math.random().toString(36).substring(2, 8)
  );
  const [peerId, setPeerId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [tokenExpiration, setTokenExpiration] = useState<Date | null>(null);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);

  // Initialize LinePlanet hook
  const config = createConfig(userId, accessToken);
  const {
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
  } = useLinePlanet({ config });

  // Generate access token
  const generateToken = async () => {
    if (isGeneratingToken) return;

    setIsGeneratingToken(true);
    try {
      const token = await generateDefaultAccessToken(userId);
      setAccessToken(token);

      // Get expiration time
      const expTime = getTokenExpirationTime(token);
      setTokenExpiration(expTime);

      toast({
        title: "Token Generated",
        description: "Access token generated successfully!",
      });
    } catch (error) {
      console.error("Failed to generate token:", error);
      toast({
        title: "Token Generation Failed",
        description: "Failed to generate access token",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingToken(false);
    }
  };

  // Auto-generate token on mount
  useEffect(() => {
    if (!accessToken) {
      generateToken();
    }
  }, []);

  // Initialize SDK when token is available
  useEffect(() => {
    if (accessToken && !isInitialized) {
      initializePlanet().catch(console.error);
    }
  }, [accessToken, isInitialized, initializePlanet]);

  const handleMakeCall = async () => {
    if (!peerId.trim()) {
      toast({
        title: "Enter Peer ID",
        description: "Please enter a peer ID to call",
        variant: "destructive",
      });
      return;
    }

    try {
      await makeCall(peerId.trim());
    } catch (error) {
      console.error("Failed to make call:", error);
    }
  };

  const handleVerifyCall = async () => {
    if (!peerId.trim()) {
      toast({
        title: "Enter Peer ID",
        description: "Please enter the caller's peer ID",
        variant: "destructive",
      });
      return;
    }

    try {
      await verifyCall(peerId.trim());
    } catch (error) {
      console.error("Failed to verify call:", error);
    }
  };

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      toast({
        title: "Copied",
        description: "User ID copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy user ID",
        variant: "destructive",
      });
    }
  };

  const handleVideoPreview = async () => {
    try {
      if (isPreviewActive) {
        await stopVideoPreview();
      } else {
        await startVideoPreview();
      }
    } catch (error) {
      console.error("Failed to toggle video preview:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "waiting":
      case "calling":
      case "verifying":
      case "accepting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "initialized":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <Wifi className="h-4 w-4" />;
      case "waiting":
      case "calling":
      case "verifying":
      case "accepting":
        return <Users className="h-4 w-4 animate-pulse" />;
      case "error":
        return <WifiOff className="h-4 w-4" />;
      case "initialized":
        return <Settings className="h-4 w-4" />;
      default:
        return <WifiOff className="h-4 w-4" />;
    }
  };

  const isTokenExpiredCheck = accessToken ? isTokenExpired(accessToken) : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            LinePlanet P2P Video Call
          </h1>
          <p className="text-lg text-gray-600">
            Enterprise-grade video calling powered by LINE Planet SDK
          </p>

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2">
            <Badge
              variant="outline"
              className={`${getStatusColor(callStatus)} text-white border-0`}
            >
              {getStatusIcon(callStatus)}
              <span className="ml-2 capitalize">{callStatus}</span>
            </Badge>
          </div>
        </div>

        {/* Configuration Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>
              Set up your user ID and access token for LinePlanet calls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your User ID</label>
              <div className="flex gap-2">
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your user ID"
                  className="flex-1"
                />
                <Button onClick={copyUserId} variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Access Token */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Access Token</label>
                {tokenExpiration && (
                  <Badge
                    variant={isTokenExpiredCheck ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {isTokenExpiredCheck ? "Expired" : "Active"}
                    {!isTokenExpiredCheck && (
                      <span className="ml-1">
                        (expires {tokenExpiration.toLocaleTimeString()})
                      </span>
                    )}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={
                    accessToken ? `${accessToken.substring(0, 20)}...` : ""
                  }
                  placeholder="Access token will be generated automatically"
                  readOnly
                  className="flex-1 font-mono text-xs"
                />
                <Button
                  onClick={generateToken}
                  variant="outline"
                  disabled={isGeneratingToken}
                  size="icon"
                >
                  {isGeneratingToken ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Initialize Button */}
            <Button
              onClick={initializePlanet}
              disabled={!accessToken || isInitialized || isTokenExpiredCheck}
              className="w-full"
            >
              {isInitialized
                ? "SDK Initialized ✓"
                : "Initialize LinePlanet SDK"}
            </Button>
          </CardContent>
        </Card>

        {/* Video Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Video Preview
            </CardTitle>
            <CardDescription>
              Preview your camera before making a call
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
              <video
                ref={previewVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
              {!isPreviewActive && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Video preview not active</p>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={handleVideoPreview}
              disabled={!isInitialized}
              variant={isPreviewActive ? "destructive" : "default"}
              className="w-full"
            >
              {isPreviewActive ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Preview
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Preview
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Call Controls */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Outgoing Call */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Make Call (Caller)
              </CardTitle>
              <CardDescription>
                Start a new video call to another user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Peer ID to call</label>
                <Input
                  value={peerId}
                  onChange={(e) => setPeerId(e.target.value)}
                  placeholder="Enter peer user ID"
                  disabled={isInCall}
                />
              </div>

              <Button
                onClick={handleMakeCall}
                disabled={!isInitialized || isInCall || !peerId.trim()}
                className="w-full"
              >
                <Phone className="h-4 w-4 mr-2" />
                Start Call
              </Button>
            </CardContent>
          </Card>

          {/* Incoming Call */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneIncoming className="h-5 w-5" />
                Receive Call (Callee)
              </CardTitle>
              <CardDescription>
                Verify and accept an incoming call
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Caller's Peer ID</label>
                <Input
                  value={peerId}
                  onChange={(e) => setPeerId(e.target.value)}
                  placeholder="Enter caller's user ID"
                  disabled={isInCall}
                />
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleVerifyCall}
                  disabled={
                    !isInitialized ||
                    isInCall ||
                    !peerId.trim() ||
                    callStatus === "verified"
                  }
                  className="w-full"
                  variant="outline"
                >
                  <PhoneIncoming className="h-4 w-4 mr-2" />
                  Verify Call
                </Button>

                <Button
                  onClick={acceptCall}
                  disabled={callStatus !== "verified"}
                  className="w-full"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Accept Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Call Interface */}
        {(isInCall || isConnected) && (
          <Card>
            <CardHeader>
              <CardTitle>Video Call</CardTitle>
              <CardDescription>
                You are {isConnected ? "connected" : "in a call"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video streams */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Local video */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Video</label>
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      ref={localVideoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                  </div>
                </div>

                {/* Remote video */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Peer Video</label>
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      ref={remoteVideoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                    />
                    {/* Hidden audio element for peer audio */}
                    <audio
                      ref={remoteAudioRef}
                      autoPlay
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>

              {/* Screen share */}
              {isScreenSharing && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Screen Share</label>
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      ref={screenShareRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                  </div>
                </div>
              )}

              {/* Call controls */}
              <div className="flex justify-center gap-2">
                <Button
                  onClick={toggleVideo}
                  variant={isVideoEnabled ? "default" : "destructive"}
                  size="icon"
                >
                  {isVideoEnabled ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <VideoOff className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  onClick={toggleAudio}
                  variant={isAudioEnabled ? "default" : "destructive"}
                  size="icon"
                >
                  {isAudioEnabled ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                  variant={isScreenSharing ? "destructive" : "outline"}
                  size="icon"
                >
                  {isScreenSharing ? (
                    <MonitorOff className="h-4 w-4" />
                  ) : (
                    <Monitor className="h-4 w-4" />
                  )}
                </Button>

                <Button onClick={endCall} variant="destructive" size="icon">
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div>
              <strong>1. Initialize:</strong> Make sure the SDK is initialized
              with a valid access token
            </div>
            <div>
              <strong>2. Preview:</strong> Use video preview to test your camera
              before calling
            </div>
            <div>
              <strong>3. Caller:</strong> Enter peer ID and click "Start Call"
            </div>
            <div>
              <strong>4. Callee:</strong> Enter caller's ID, click "Verify
              Call", then "Accept Call"
            </div>
            <div>
              <strong>5. Controls:</strong> Use the media controls during the
              call to manage video, audio, and screen sharing
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
