"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Copy, Users, Wifi, WifiOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "failed"

export default function VideoCallApp() {
  const [roomId, setRoomId] = useState("")
  const [isInCall, setIsInCall] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")
  const [remoteConnected, setRemoteConnected] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  const { toast } = useToast()

  // Initialize WebRTC
  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    }

    const peerConnection = new RTCPeerConnection(configuration)

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.send(
          JSON.stringify({
            type: "ice-candidate",
            candidate: event.candidate,
            roomId,
          }),
        )
      }
    }

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
        setRemoteConnected(true)
      }
    }

    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState
      if (state === "connected") {
        setConnectionStatus("connected")
      } else if (state === "failed" || state === "disconnected") {
        setConnectionStatus("failed")
        setRemoteConnected(false)
      } else if (state === "connecting") {
        setConnectionStatus("connecting")
      }
    }

    return peerConnection
  }

  // Get user media
  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      })

      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      return stream
    } catch (error) {
      console.error("Error accessing media devices:", error)
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera and microphone access to make video calls.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Initialize WebSocket connection
  const initializeWebSocket = () => {
    // In a real app, you'd connect to your signaling server
    // For demo purposes, we'll simulate the signaling
    const ws = new WebSocket("wss://echo.websocket.org")

    ws.onopen = () => {
      console.log("WebSocket connected")
    }

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data)

      if (data.roomId !== roomId) return

      switch (data.type) {
        case "offer":
          await handleOffer(data.offer)
          break
        case "answer":
          await handleAnswer(data.answer)
          break
        case "ice-candidate":
          await handleIceCandidate(data.candidate)
          break
      }
    }

    return ws
  }

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return

    await peerConnectionRef.current.setRemoteDescription(offer)
    const answer = await peerConnectionRef.current.createAnswer()
    await peerConnectionRef.current.setLocalDescription(answer)

    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "answer",
          answer,
          roomId,
        }),
      )
    }
  }

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return
    await peerConnectionRef.current.setRemoteDescription(answer)
  }

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return
    await peerConnectionRef.current.addIceCandidate(candidate)
  }

  // Start call
  const startCall = async () => {
    if (!roomId.trim()) {
      toast({
        title: "Room ID Required",
        description: "Please enter a room ID to start the call.",
        variant: "destructive",
      })
      return
    }

    try {
      setConnectionStatus("connecting")

      // Get user media
      const stream = await getUserMedia()

      // Initialize peer connection
      peerConnectionRef.current = initializePeerConnection()

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addTrack(track, stream)
        }
      })

      // Initialize WebSocket
      socketRef.current = initializeWebSocket()

      // Create offer
      const offer = await peerConnectionRef.current.createOffer()
      await peerConnectionRef.current.setLocalDescription(offer)

      // Send offer through signaling server
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({
            type: "offer",
            offer,
            roomId,
          }),
        )
      }

      setIsInCall(true)

      toast({
        title: "Call Started",
        description: "Waiting for other participant to join...",
      })
    } catch (error) {
      console.error("Error starting call:", error)
      setConnectionStatus("failed")
    }
  }

  // End call
  const endCall = () => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    // Close WebSocket
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }

    // Reset state
    setIsInCall(false)
    setConnectionStatus("disconnected")
    setRemoteConnected(false)

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }

    toast({
      title: "Call Ended",
      description: "The video call has been terminated.",
    })
  }

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  // Generate random room ID
  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomId(id)
  }

  // Copy room ID to clipboard
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId)
      toast({
        title: "Room ID Copied",
        description: "Share this ID with others to join the call.",
      })
    } catch (error) {
      console.error("Failed to copy room ID:", error)
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500"
      case "connecting":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="w-4 h-4" />
      case "connecting":
        return <Wifi className="w-4 h-4 animate-pulse" />
      case "failed":
        return <WifiOff className="w-4 h-4" />
      default:
        return <WifiOff className="w-4 h-4" />
    }
  }

  if (isInCall) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Status Bar */}
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <span className="text-white text-sm font-medium">Room: {roomId}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            {getStatusIcon()}
            <Users className="w-4 h-4" />
            <span className="text-sm">{remoteConnected ? "2" : "1"}</span>
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 relative">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{ display: remoteConnected ? "block" : "none" }}
          />

          {/* Waiting Message */}
          {!remoteConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Waiting for others to join</h3>
                <p className="text-gray-400">
                  Share room ID: <span className="font-mono">{roomId}</span>
                </p>
              </div>
            </div>
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ display: isVideoEnabled ? "block" : "none" }}
            />
            {!isVideoEnabled && (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <VideoOff className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-900">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isAudioEnabled ? "secondary" : "destructive"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={toggleAudio}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>

            <Button variant="destructive" size="lg" className="rounded-full w-16 h-16" onClick={endCall}>
              <PhoneOff className="w-8 h-8" />
            </Button>

            <Button
              variant={isVideoEnabled ? "secondary" : "destructive"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={toggleVideo}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Video Call</CardTitle>
          <CardDescription>Start a peer-to-peer video call by entering or creating a room ID</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Room ID Input */}
          <div className="space-y-2">
            <label htmlFor="roomId" className="text-sm font-medium text-gray-700">
              Room ID
            </label>
            <div className="flex gap-2">
              <Input
                id="roomId"
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="font-mono"
              />
              {roomId && (
                <Button variant="outline" size="icon" onClick={copyRoomId}>
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Generate Room ID */}
          <Button variant="outline" className="w-full bg-transparent" onClick={generateRoomId}>
            Generate New Room ID
          </Button>

          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              {getStatusIcon()}
              {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
            </Badge>
          </div>

          {/* Start Call Button */}
          <Button
            className="w-full h-12 text-lg"
            onClick={startCall}
            disabled={!roomId.trim() || connectionStatus === "connecting"}
          >
            <Phone className="w-5 h-5 mr-2" />
            {connectionStatus === "connecting" ? "Connecting..." : "Start Video Call"}
          </Button>

          {/* Info */}
          <div className="text-center text-sm text-gray-500">
            <p>Share the room ID with others to join the same call</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
