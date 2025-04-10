import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Fingerprint,
  Shield,
  AlertCircle,
  RefreshCw,
  User,
  Lock,
  UserPlus,
} from "lucide-react";
import BiometricUnavailableDialog from "./BiometricUnavailableDialog";
import {
  authenticateWithBiometrics,
  checkBiometricAvailability,
  simulateAuthentication,
} from "../utils/biometrics";
import { authenticateUser, registerUser, getCurrentUser } from "../utils/auth";

interface LockScreenProps {
  onAuthenticate?: () => void;
  appName?: string;
  logoUrl?: string;
}

const LockScreen = ({
  onAuthenticate = () => console.log("Authentication successful"),
  appName = "Biometric Notes",
  logoUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=biometricnotes",
}: LockScreenProps) => {
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricsAvailable, setBiometricsAvailable] = useState<
    boolean | null
  >(null);
  const [biometryType, setBiometryType] = useState<string | null>(null);
  const [showBiometricDialog, setShowBiometricDialog] = useState(false);
  const [authAttempts, setAuthAttempts] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [lastLoggedInUser, setLastLoggedInUser] = useState<string | null>(null);

  // Check if biometrics are available on component mount and get last logged in user
  useEffect(() => {
    const checkAvailability = async () => {
      const {
        available,
        biometryType,
        error: availabilityError,
      } = await checkBiometricAvailability();
      setBiometricsAvailable(available);
      setBiometryType(biometryType);

      // Show dialog if biometrics are not available
      if (!available) {
        setShowBiometricDialog(true);
      }

      if (availabilityError) {
        console.error("Biometric availability error:", availabilityError);
      }
    };

    checkAvailability();

    // Check for last logged in user
    const currentUser = getCurrentUser();
    if (currentUser) {
      setLastLoggedInUser(currentUser);
      setUsername(currentUser);
    }
  }, []);

  const handleBiometricAuth = async () => {
    if (!lastLoggedInUser) {
      setError("Please log in with username and password first");
      return;
    }

    setAuthenticating(true);
    setError(null);

    try {
      // Use real biometrics if available, otherwise fall back to simulation
      const result = biometricsAvailable
        ? await authenticateWithBiometrics("Authenticate to access your notes")
        : await simulateAuthentication();

      setAuthenticating(false);

      if (result.success) {
        onAuthenticate();
      } else {
        setAuthAttempts((prev) => prev + 1);
        setError(result.error || "Authentication failed. Please try again.");
      }
    } catch (err) {
      setAuthenticating(false);
      setAuthAttempts((prev) => prev + 1);
      setError("An unexpected error occurred. Please try again.");
      console.error("Authentication error:", err);
    }
  };

  const handleCredentialAuth = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setAuthenticating(true);
    setError(null);

    try {
      let result;

      if (isRegistering) {
        result = registerUser(username, password);
      } else {
        result = authenticateUser(username, password);
      }

      setAuthenticating(false);

      if (result.success) {
        setLastLoggedInUser(username);
        onAuthenticate();
      } else {
        setAuthAttempts((prev) => prev + 1);
        setError(
          result.error ||
            `${isRegistering ? "Registration" : "Authentication"} failed. Please try again.`,
        );
      }
    } catch (err) {
      setAuthenticating(false);
      setAuthAttempts((prev) => prev + 1);
      setError("An unexpected error occurred. Please try again.");
      console.error("Authentication error:", err);
    }
  };

  const handleRetryAvailabilityCheck = async () => {
    setError(null);
    const { available, biometryType } = await checkBiometricAvailability();
    setBiometricsAvailable(available);
    setBiometryType(biometryType);

    if (available) {
      setShowBiometricDialog(false);
    } else {
      setShowBiometricDialog(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <BiometricUnavailableDialog
        open={showBiometricDialog}
        onClose={() => setShowBiometricDialog(false)}
      />
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <img
              src={logoUrl}
              alt="App Logo"
              className="w-24 h-24 rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900">
            {appName}
          </h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield size={16} />
            <span>Secure Note Taking</span>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-center text-gray-600">
            Your notes are protected. Please authenticate to continue.
          </p>

          {biometricsAvailable === false && (
            <div className="p-3 mb-3 text-sm text-amber-600 bg-amber-50 rounded-md flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">
                  Biometric authentication is not available.
                </p>
                <p className="mt-1">This could be because:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Your device doesn't support biometrics</li>
                  <li>
                    Biometrics haven't been set up in your device settings
                  </li>
                  <li>
                    Your browser doesn't support the Web Authentication API
                  </li>
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetryAvailabilityCheck}
                  className="mt-2 flex items-center gap-1"
                >
                  <RefreshCw size={14} />
                  <span>Check Again</span>
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Authentication failed</p>
                <p>{error}</p>
                {authAttempts > 1 && (
                  <p className="mt-1">
                    If you're having trouble, make sure your credentials are
                    correct.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsRegistering(false);
                  handleCredentialAuth();
                }}
                disabled={authenticating}
                className="flex-1 py-2"
                variant="outline"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Login</span>
              </Button>

              <Button
                onClick={() => {
                  setIsRegistering(true);
                  handleCredentialAuth();
                }}
                disabled={authenticating}
                className="flex-1 py-2"
                variant="outline"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Register</span>
              </Button>
            </div>

            {lastLoggedInUser && (
              <Button
                onClick={handleBiometricAuth}
                disabled={authenticating}
                className="w-full py-6 text-base flex items-center justify-center space-x-2"
              >
                <Fingerprint
                  className={authenticating ? "animate-pulse" : ""}
                />
                <span>
                  {authenticating
                    ? "Authenticating..."
                    : biometryType === "FaceID"
                      ? "Authenticate with Face Recognition"
                      : biometryType === "TouchID" ||
                          biometryType === "Fingerprint"
                        ? "Authenticate with Fingerprint"
                        : "Authenticate with Biometrics"}
                </span>
              </Button>
            )}
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            {lastLoggedInUser ? (
              <>
                Logged in as <strong>{lastLoggedInUser}</strong>. Your notes are
                private to your account.
                <br />
              </>
            ) : null}
            Your biometric data never leaves your device.
            <br />
            We use secure authentication methods to protect your privacy.
            {biometricsAvailable === false && (
              <>
                <br />
                <span className="text-amber-600 font-medium">
                  Note: Using simulation mode since biometrics are not
                  available.
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
