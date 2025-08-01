"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, PhoneIncoming, Users, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            LinePlanet Video Call
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enterprise-grade P2P video calling powered by LINE Planet SDK.
            Choose your role to get started.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Caller Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Make a Call</CardTitle>
              <CardDescription className="text-base">
                Initiate video calls to other users with VoIP integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                  Configure VoIP settings
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                  Enter callee information
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                  Start video calls
                </li>
              </ul>
              <Link href="/lineplanet-call" className="block">
                <Button className="w-full" size="lg">
                  Start as Caller
                  <Phone className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Callee Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <PhoneIncoming className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Receive Calls</CardTitle>
              <CardDescription className="text-base">
                Accept incoming video calls with call ID verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  Enter call ID (CC parameter)
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  Configure media elements
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  Accept incoming calls
                </li>
              </ul>
              <Link href="/callee" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Start as Callee
                  <PhoneIncoming className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">P2P Video Calling</h3>
              <p className="text-gray-600">
                Direct peer-to-peer video communication with high quality
                streams
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Call ID System</h3>
              <p className="text-gray-600">
                Secure call verification using CC parameters for callee
                authentication
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Media Controls</h3>
              <p className="text-gray-600">
                Full control over video, audio, and screen sharing capabilities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
