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
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Phone,
  Monitor,
  Settings,
  ArrowRight,
  Zap,
  Shield,
  Smartphone,
  Globe,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="p-6 text-center border-b bg-white/80 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          LinePlanet Video Call App
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience high-quality peer-to-peer video calling with
          enterprise-grade features
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="default" className="bg-blue-600">
            LINE Planet SDK
          </Badge>
          <Badge variant="secondary">P2P Calling</Badge>
          <Badge variant="outline">Open Source</Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Enterprise-Grade Video Calling
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">HD Video</h3>
              <p className="text-sm text-gray-600">
                Crystal clear video quality with adaptive bitrate
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Low Latency</h3>
              <p className="text-sm text-gray-600">
                Real-time communication with minimal delay
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-sm text-gray-600">
                End-to-end encrypted communications
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Cross-Platform
              </h3>
              <p className="text-sm text-gray-600">
                Works on desktop, tablet, and mobile
              </p>
            </div>
          </div>
        </section>

        {/* Demo Options */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Try the Video Calling Experience
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* LinePlanet Implementation */}
            <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <div className="absolute top-4 right-4">
                <Badge variant="default" className="bg-blue-600">
                  Recommended
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Globe className="w-5 h-5 text-blue-600" />
                  LinePlanet P2P Calling
                </CardTitle>
                <CardDescription>
                  Enterprise-grade video calling powered by LINE Planet SDK with
                  advanced features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-blue-600" />
                      HD video with adaptive quality
                    </li>
                    <li className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-600" />
                      Screen sharing capabilities
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      Echo cancellation & noise reduction
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-600" />
                      Advanced call management
                    </li>
                  </ul>
                </div>
                <Link href="/lineplanet-call" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start LinePlanet Call
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Original WebRTC Implementation */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Video className="w-5 h-5 text-gray-600" />
                  Basic WebRTC Demo
                </CardTitle>
                <CardDescription>
                  Simple peer-to-peer video calling using native WebRTC APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-gray-600" />
                      Basic video calling
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      Audio/video controls
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-gray-600" />
                      Room-based system
                    </li>
                  </ul>
                </div>
                <Link href="/webrtc-demo" className="block">
                  <Button variant="outline" className="w-full">
                    Try WebRTC Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Additional Demos */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Additional Demos
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/demo-incoming-call">
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Incoming Call UI
              </Button>
            </Link>
          </div>
        </section>

        {/* Getting Started */}
        <section className="bg-white rounded-xl p-8 border">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Getting Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Choose Implementation
              </h3>
              <p className="text-sm text-gray-600">
                Select LinePlanet for enterprise features or WebRTC for basic
                calling
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Configure Settings
              </h3>
              <p className="text-sm text-gray-600">
                Set up your LinePlanet credentials or use demo configuration
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Start Calling
              </h3>
              <p className="text-sm text-gray-600">
                Create or join rooms and start high-quality video calls
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 mb-4">
            Built with LINE Planet SDK • Powered by Next.js & React
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a
              href="https://docs.lineplanet.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              LinePlanet Docs
            </a>
            <a
              href="https://github.com/line/planet-kit-web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              GitHub
            </a>
            <a
              href="/demo-incoming-call"
              className="text-blue-400 hover:text-blue-300"
            >
              UI Demos
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
