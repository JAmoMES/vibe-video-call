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

// LinePlanet configuration with manual token input
const createConfig = (userId: string, accessToken: string) => ({
  appId: "your-app-id", // Replace with your actual LinePlanet App ID
  env: "eval" as const, // Use "real" for production
  userId,
  serviceId: "LINEMAN-eval",
  accessToken,
});

export function LinePlanetCallClient() {
  const { toast } = useToast();

  // User and call state
  const [userId, setUserId] = useState("U055242250734371");
  const [peerId, setPeerId] = useState("LMDKI3FUP");
  const [accessToken, setAccessToken] = useState("");
  const [tokenExpiration, setTokenExpiration] = useState<Date | null>(null);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);

  // VoIP configuration state
  const [service, setService] = useState("mart");
  const [calleeId, setCalleeId] = useState("LMDKI3FUP");
  const [manualAccessToken, setManualAccessToken] = useState("");

  // VoIP request parameters
  const [orderId, setOrderId] = useState("LME-250722-578463140");

  // Initialize LinePlanet hook
  const config = createConfig(userId, manualAccessToken || accessToken);
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

  // Initialize SDK when token is available
  useEffect(() => {
    if ((manualAccessToken || accessToken) && !isInitialized) {
      initializePlanet().catch(console.error);
    }
  }, [manualAccessToken, accessToken, isInitialized, initializePlanet]);

  const handleMakeCall = async () => {
    if (
      !calleeId.trim() ||
      !orderId.trim() ||
      !(manualAccessToken || accessToken)
    ) {
      toast({
        title: "Missing Information",
        description: "Please enter Callee ID, Order ID, and Access Token",
        variant: "destructive",
      });
      return;
    }

    try {
      await makeCall(
        peerId.trim(),
        service,
        {
          useCloudRecording: true,
        },
        {
          service,
          orderId: orderId.trim(),
          authToken: manualAccessToken || accessToken,
        }
      );
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

  return (
    <>
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

      {/* VoIP Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            VoIP Configuration
          </CardTitle>
          <CardDescription>
            Configure VoIP API parameters. Access token will be used for
            beta-man-chat.wndv.co API call.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Service</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mart">MART</option>
              <option value="FOOD">FOOD</option>
              <option value="DELIVERY">DELIVERY</option>
              <option value="TAXI">TAXI</option>
            </select>
          </div>

          {/* Order ID */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Order ID</label>
            <Input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g., LME-250722-578463140"
            />
          </div>

          {/* Callee ID */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Callee ID</label>
            <Input
              value={calleeId}
              onChange={(e) => setCalleeId(e.target.value)}
              placeholder="e.g., LMDKI3FUP"
            />
          </div>

          {/* Access Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium">VoIP API Access Token</label>
            <Input
              type="password"
              value={manualAccessToken}
              onChange={(e) => setManualAccessToken(e.target.value)}
              placeholder="Bearer token for beta-man-chat.wndv.co VoIP API"
              className="font-mono text-xs"
            />
            <p className="text-xs text-gray-500">
              Token for https://beta-man-chat.wndv.co/lm-chat/v1/voip/init-call
              API
            </p>
          </div>
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
            <strong>1. Configure:</strong> Fill in service, order ID, callee ID,
            and VoIP API access token
          </div>
          <div>
            <strong>2. Preview:</strong> Use video preview to test your camera
            before calling
          </div>
          <div>
            <strong>3. Start Call:</strong> App calls beta-man-chat.wndv.co VoIP
            API to get stidInfo, then base64 encodes entire stidInfo object for
            LinePlanet
          </div>
          <div>
            <strong>4. Callee:</strong> Enter caller's ID, click "Verify Call",
            then "Accept Call"
          </div>
          <div>
            <strong>5. Controls:</strong> Use the media controls during the call
            to manage video, audio, and screen sharing
          </div>
        </CardContent>
      </Card>
    </>
  );
}
