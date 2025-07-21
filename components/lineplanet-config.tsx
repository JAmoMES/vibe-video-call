"use client";

import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface LinePlanetConfigData {
  appId: string;
  env: "eval" | "real";
  userId: string;
  accessToken: string;
}

interface LinePlanetConfigProps {
  onSave: (config: LinePlanetConfigData) => void;
  initialConfig?: Partial<LinePlanetConfigData>;
}

export function LinePlanetConfig({
  onSave,
  initialConfig,
}: LinePlanetConfigProps) {
  const { toast } = useToast();
  const [showAccessToken, setShowAccessToken] = useState(false);

  const [config, setConfig] = useState<LinePlanetConfigData>({
    appId: initialConfig?.appId || "",
    env: initialConfig?.env || "real",
    userId: initialConfig?.userId || "",
    accessToken: initialConfig?.accessToken || "",
  });

  const handleSave = () => {
    // Validate required fields
    if (!config.appId.trim()) {
      toast({
        title: "App ID Required",
        description: "Please enter your LinePlanet App ID.",
        variant: "destructive",
      });
      return;
    }

    if (!config.userId.trim()) {
      toast({
        title: "User ID Required",
        description: "Please enter a User ID.",
        variant: "destructive",
      });
      return;
    }

    if (!config.accessToken.trim()) {
      toast({
        title: "Access Token Required",
        description: "Please enter your LinePlanet Access Token.",
        variant: "destructive",
      });
      return;
    }

    onSave(config);
    toast({
      title: "Configuration Saved",
      description: "LinePlanet settings have been updated.",
    });
  };

  const generateUserId = () => {
    const randomId = "user-" + Math.random().toString(36).substring(2, 10);
    setConfig((prev) => ({ ...prev, userId: randomId }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Settings className="w-5 h-5" />
          LinePlanet Configuration
        </CardTitle>
        <CardDescription>
          Configure your LINE Planet SDK settings for video calling
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Environment Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Environment
          </label>
          <Select
            value={config.env}
            onValueChange={(value: "eval" | "real") =>
              setConfig((prev) => ({ ...prev, env: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eval">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Eval
                  </Badge>
                  <span>Evaluation (Testing)</span>
                </div>
              </SelectItem>
              <SelectItem value="real">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">
                    Real
                  </Badge>
                  <span>Production</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Use "eval" for testing, "real" for production
          </p>
        </div>

        {/* App ID */}
        <div className="space-y-2">
          <label htmlFor="appId" className="text-sm font-medium text-gray-700">
            App ID
          </label>
          <Input
            id="appId"
            placeholder="Your LinePlanet App ID"
            value={config.appId}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, appId: e.target.value }))
            }
            className="font-mono"
          />
          <p className="text-xs text-gray-500">
            Get this from your LinePlanet console
          </p>
        </div>

        {/* User ID */}
        <div className="space-y-2">
          <label htmlFor="userId" className="text-sm font-medium text-gray-700">
            User ID
          </label>
          <div className="flex gap-2">
            <Input
              id="userId"
              placeholder="Your unique user ID"
              value={config.userId}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, userId: e.target.value }))
              }
              className="font-mono"
            />
            <Button variant="outline" onClick={generateUserId} type="button">
              Generate
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Unique identifier for the user
          </p>
        </div>

        {/* Access Token */}
        <div className="space-y-2">
          <label
            htmlFor="accessToken"
            className="text-sm font-medium text-gray-700"
          >
            Access Token
          </label>
          <div className="relative">
            <Input
              id="accessToken"
              type={showAccessToken ? "text" : "password"}
              placeholder="Your LinePlanet Access Token"
              value={config.accessToken}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, accessToken: e.target.value }))
              }
              className="font-mono pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-10"
              onClick={() => setShowAccessToken(!showAccessToken)}
              type="button"
            >
              {showAccessToken ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Authentication token from LinePlanet
          </p>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>

        {/* Info */}
        <div className="text-center text-xs text-gray-500 space-y-1 pt-2 border-t">
          <p>For development, you can use demo values.</p>
          <p>
            Get production credentials from{" "}
            <a
              href="https://docs.lineplanet.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LINE Planet Console
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
