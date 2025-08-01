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
  PhoneIncoming,
  RefreshCw,
  Key,
  Play,
  Square,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLinePlanet } from "@/hooks/use-lineplanet";

// LinePlanet configuration for callee
const createConfig = (userId: string, accessToken: string) => ({
  appId: "your-app-id", // Replace with your actual LinePlanet App ID
  env: "eval" as const, // Use "real" for production
  userId,
  accessToken,
});

export function LinePlanetCalleeClient() {
  const { toast } = useToast();

  // User and call state
  const [userId, setUserId] = useState("U055242250734371");
  const [callId, setCallId] = useState(""); // CC parameter (call ID)
  const [accessToken] = useState("default-token"); // Default token for callee
  const [isWaitingForCall, setIsWaitingForCall] = useState(false);

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
    if (accessToken && !isInitialized) {
      initializePlanet().catch(console.error);
    }
  }, [accessToken, isInitialized, initializePlanet]);

  const handleVerifyCall = async () => {
    if (!callId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter Call ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsWaitingForCall(true);
      await verifyCall(
        "", // peerId - will be determined by the call
        "LINEMAN-eval", // peerServiceId
        callId.trim(), // ccParam (call ID)
        {
          useCloudRecording: true,
          useCloudRelaying: false,
        }
      );
      toast({
        title: "Waiting for Call",
        description: `Ready to receive call with ID: ${callId}`,
      });
    } catch (error) {
      console.error("Failed to verify call:", error);
      setIsWaitingForCall(false);
      toast({
        title: "Verification Failed",
        description: "Failed to setup call verification",
        variant: "destructive",
      });
    }
  };

  const handleStopWaiting = () => {
    setIsWaitingForCall(false);
    toast({
      title: "Stopped Waiting",
      description: "No longer waiting for incoming calls",
    });
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
      case "calling":
      case "verifying":
      case "accepting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "disconnected":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* User Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Callee Configuration
          </CardTitle>
          <CardDescription>
            Configure your user settings to receive calls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your User ID</label>
            <div className="flex gap-2">
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your user ID"
              />
              <Button variant="outline" size="icon" onClick={copyUserId}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant={isInitialized ? "default" : "secondary"}>
              {isInitialized ? "SDK Ready" : "SDK Not Initialized"}
            </Badge>
            {callStatus && (
              <Badge className={getStatusColor(callStatus)}>{callStatus}</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Call Reception Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneIncoming className="h-5 w-5" />
            Incoming Call Setup
          </CardTitle>
          <CardDescription>
            Enter the call ID and caller information to receive calls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Call ID (CC Parameter)
              </label>
              <Input
                value={callId}
                onChange={(e) => setCallId(e.target.value)}
                placeholder="Enter the call ID from caller"
                disabled={isWaitingForCall || isInCall}
              />
            </div>
          </div>

          <div className="flex gap-4">
            {!isWaitingForCall && !isInCall ? (
              <Button
                onClick={handleVerifyCall}
                disabled={!isInitialized || !callId}
                className="flex items-center gap-2"
              >
                <PhoneIncoming className="h-4 w-4" />
                Ready to Receive Call
              </Button>
            ) : isWaitingForCall && !isInCall ? (
              <Button
                onClick={handleStopWaiting}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PhoneOff className="h-4 w-4" />
                Stop Waiting
              </Button>
            ) : null}
          </div>

          {isWaitingForCall && !isInCall && (
            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
              <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-blue-700">
                Waiting for incoming call with ID: <strong>{callId}</strong>
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Media Preview & Controls
          </CardTitle>
          <CardDescription>
            Test your camera and audio before receiving calls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Camera Preview</label>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <video
                ref={previewVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            </div>
          </div>

          {/* Media controls */}
          <div className="flex gap-2">
            <Button
              variant={isPreviewActive ? "default" : "outline"}
              onClick={handleVideoPreview}
              disabled={!isInitialized}
              className="flex items-center gap-2"
            >
              {isPreviewActive ? (
                <>
                  <Square className="h-4 w-4" />
                  Stop Preview
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Preview
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Video Call Interface - Only shown when in call */}
      {(isInCall || isConnected) && (
        <Card>
          <CardHeader>
            <CardTitle>Active Call</CardTitle>
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
                <label className="text-sm font-medium">Caller Video</label>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={remoteVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                  />
                  {/* Hidden audio element for caller audio */}
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
                    className="w-full h-full object-contain"
                    autoPlay
                    playsInline
                  />
                </div>
              </div>
            )}

            {/* Call controls */}
            <div className="flex justify-center gap-4">
              <Button
                variant={isVideoEnabled ? "default" : "outline"}
                size="lg"
                onClick={toggleVideo}
                className="flex items-center gap-2"
              >
                {isVideoEnabled ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant={isAudioEnabled ? "default" : "outline"}
                size="lg"
                onClick={toggleAudio}
                className="flex items-center gap-2"
              >
                {isAudioEnabled ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant={isScreenSharing ? "default" : "outline"}
                size="lg"
                onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                className="flex items-center gap-2"
              >
                {isScreenSharing ? (
                  <MonitorOff className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
                className="flex items-center gap-2"
              >
                <PhoneOff className="h-5 w-5" />
                End Call
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
