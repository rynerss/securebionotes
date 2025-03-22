import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { AlertCircle, Smartphone } from "lucide-react";

interface BiometricUnavailableDialogProps {
  open: boolean;
  onClose: () => void;
}

const BiometricUnavailableDialog = ({
  open,
  onClose,
}: BiometricUnavailableDialogProps) => {
  const isAndroid = /android/i.test(navigator.userAgent);

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span>Biometric Authentication Unavailable</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Your device doesn't support biometric authentication or it hasn't
              been set up.
            </p>

            {isAndroid ? (
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <h3 className="font-medium flex items-center gap-2 text-amber-800">
                  <Smartphone className="h-4 w-4" />
                  <span>Android Setup Instructions:</span>
                </h3>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-amber-700">
                  <li>
                    Open your device <strong>Settings</strong>
                  </li>
                  <li>
                    Go to <strong>Security</strong> or{" "}
                    <strong>Biometrics and Security</strong>
                  </li>
                  <li>
                    Select <strong>Fingerprint</strong> or{" "}
                    <strong>Face Recognition</strong>
                  </li>
                  <li>
                    Follow the on-screen instructions to register your
                    biometrics
                  </li>
                  <li>Return to this app and try again</li>
                </ol>
              </div>
            ) : (
              <p>
                For the best security experience, we recommend setting up
                fingerprint or face recognition in your device settings.
              </p>
            )}

            <p>
              For now, we'll use a simulated authentication mode for
              demonstration purposes.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BiometricUnavailableDialog;
