import React from "react";
import { AlertCircle, Smartphone } from "lucide-react";
import { Button } from "./ui/button";

interface DeviceWarningProps {
  onContinueAnyway?: () => void;
}

const DeviceWarning = ({ onContinueAnyway = () => {} }: DeviceWarningProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-amber-100 rounded-full">
            <Smartphone className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Mobile Device Recommended
          </h1>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">
                  This application is designed for mobile devices with biometric
                  capabilities.
                </p>
                <p>
                  For the best experience, please access this app from a
                  smartphone or tablet with fingerprint or face recognition.
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600">
            Using this app on a desktop or device without biometrics will result
            in a simulated authentication experience for demonstration purposes
            only.
          </p>

          <div className="flex flex-col space-y-3">
            <Button onClick={onContinueAnyway} className="w-full">
              Continue Anyway
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            Note: Your notes will not be secured by actual biometric
            authentication in simulation mode.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeviceWarning;
