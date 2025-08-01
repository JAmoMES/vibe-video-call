"use client";

import { ClientOnly } from "@/components/client-only";
import { LinePlanetCalleeClient } from "@/components/lineplanet-callee-client";

export default function CalleePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            LinePlanet Call Receiver
          </h1>
          <p className="text-lg text-gray-600">
            Receive incoming video calls with call ID verification
          </p>
        </div>

        {/* Client-only LinePlanet functionality */}
        <ClientOnly
          fallback={
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading LinePlanet SDK...</p>
            </div>
          }
        >
          <LinePlanetCalleeClient />
        </ClientOnly>
      </div>
    </div>
  );
}
