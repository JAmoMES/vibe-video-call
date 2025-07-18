"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IncomingCall } from "@/components/incoming-call"

export default function DemoIncomingCall() {
  const [showIncomingCall, setShowIncomingCall] = useState(false)
  const [callType, setCallType] = useState<"video" | "audio">("video")

  const handleAccept = () => {
    console.log("Call accepted")
    setShowIncomingCall(false)
    // Here you would typically navigate to the call screen
  }

  const handleDecline = () => {
    console.log("Call declined")
    setShowIncomingCall(false)
  }

  const handleAcceptAudioOnly = () => {
    console.log("Call accepted (audio only)")
    setShowIncomingCall(false)
    // Here you would typically start an audio-only call
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      {showIncomingCall && (
        <IncomingCall
          callerName="Sarah Johnson"
          callerAvatar="/placeholder.svg?height=128&width=128"
          roomId="ABC123"
          isVideoCall={callType === "video"}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onAcceptAudioOnly={callType === "video" ? handleAcceptAudioOnly : undefined}
        />
      )}

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Incoming Call Demo</CardTitle>
          <CardDescription>Test the incoming call UI with different scenarios</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Call Type</label>
            <div className="flex gap-2">
              <Button
                variant={callType === "video" ? "default" : "outline"}
                onClick={() => setCallType("video")}
                className="flex-1"
              >
                Video Call
              </Button>
              <Button
                variant={callType === "audio" ? "default" : "outline"}
                onClick={() => setCallType("audio")}
                className="flex-1"
              >
                Audio Call
              </Button>
            </div>
          </div>

          <Button className="w-full h-12 text-lg" onClick={() => setShowIncomingCall(true)}>
            Simulate Incoming Call
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>This will show a full-screen incoming call interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
