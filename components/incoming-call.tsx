"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Phone, PhoneOff, Video, Mic, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface IncomingCallProps {
  callerName: string
  callerAvatar?: string
  roomId: string
  isVideoCall?: boolean
  onAccept: () => void
  onDecline: () => void
  onAcceptAudioOnly?: () => void
}

export function IncomingCall({
  callerName,
  callerAvatar,
  roomId,
  isVideoCall = true,
  onAccept,
  onDecline,
  onAcceptAudioOnly,
}: IncomingCallProps) {
  const [isRinging, setIsRinging] = useState(true)
  const [ringCount, setRingCount] = useState(0)

  // Simulate ringing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRingCount((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Auto-decline after 30 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      onDecline()
    }, 30000)

    return () => clearTimeout(timeout)
  }, [onDecline])

  const getCallerInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.05),transparent)]" />
      </div>

      {/* Status Bar */}
      <div className="relative z-10 flex items-center justify-between p-4 pt-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/80 text-sm">Incoming Call</span>
        </div>
        <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
          {isVideoCall ? "Video Call" : "Voice Call"}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Caller Avatar with Pulse Animation */}
        <div className="relative mb-8">
          <div
            className={cn("absolute inset-0 rounded-full bg-white/20 animate-ping", isRinging && "animate-pulse")}
            style={{
              animationDuration: "2s",
              animationDelay: `${(ringCount % 3) * 0.5}s`,
            }}
          />
          <div className="absolute inset-2 rounded-full bg-white/10 animate-ping" />
          <Avatar className="w-32 h-32 border-4 border-white/30 relative z-10">
            <AvatarImage src={callerAvatar || "/placeholder.svg"} alt={callerName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
              {getCallerInitials(callerName)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Caller Info */}
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-white mb-2">{callerName}</h1>
          <p className="text-white/70 text-lg">{isVideoCall ? "Incoming video call" : "Incoming voice call"}</p>
          <p className="text-white/50 text-sm mt-1">Room: {roomId}</p>
        </div>

        {/* Ring Counter */}
        <div className="flex items-center gap-1 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full bg-white/30 transition-all duration-300",
                ringCount % 3 === i && "bg-white scale-125",
              )}
            />
          ))}
        </div>

        {/* Quick Actions */}
        {isVideoCall && (
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-14 h-14 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <MessageSquare className="w-6 h-6" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-14 h-14 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Mic className="w-6 h-6" />
            </Button>
          </div>
        )}
      </div>

      {/* Call Actions */}
      <div className="relative z-10 p-8 pb-12">
        {/* Primary Actions */}
        <div className="flex items-center justify-center gap-8 mb-6">
          {/* Decline Button */}
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full w-20 h-20 bg-red-500 hover:bg-red-600 border-4 border-red-400/30 shadow-lg shadow-red-500/25"
            onClick={onDecline}
          >
            <PhoneOff className="w-8 h-8" />
          </Button>

          {/* Accept Button */}
          <Button
            size="lg"
            className="rounded-full w-20 h-20 bg-green-500 hover:bg-green-600 border-4 border-green-400/30 shadow-lg shadow-green-500/25"
            onClick={onAccept}
          >
            {isVideoCall ? <Video className="w-8 h-8" /> : <Phone className="w-8 h-8" />}
          </Button>
        </div>

        {/* Secondary Actions */}
        {isVideoCall && onAcceptAudioOnly && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full px-6"
              onClick={onAcceptAudioOnly}
            >
              <Phone className="w-4 h-4 mr-2" />
              Accept Audio Only
            </Button>
          </div>
        )}

        {/* Action Labels */}
        <div className="flex items-center justify-center gap-8 mt-4">
          <span className="text-white/60 text-sm w-20 text-center">Decline</span>
          <span className="text-white/60 text-sm w-20 text-center">{isVideoCall ? "Accept" : "Accept"}</span>
        </div>
      </div>

      {/* Swipe Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <div className="w-8 h-1 bg-white/30 rounded-full" />
        <div className="w-4 h-1 bg-white/50 rounded-full" />
        <div className="w-8 h-1 bg-white/30 rounded-full" />
      </div>
    </div>
  )
}
