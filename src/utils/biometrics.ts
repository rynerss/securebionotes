import { isMobileDevice } from "./deviceDetection";

// Interface for authentication results
interface AuthResult {
  success: boolean;
  error: string | null;
}

// Check if biometric authentication is available on the device
export const checkBiometricAvailability = async () => {
  try {
    const isMobile = isMobileDevice();

    // Check if Web Authentication API is available
    const webAuthnAvailable =
      window.PublicKeyCredential !== undefined &&
      typeof window.PublicKeyCredential
        .isUserVerifyingPlatformAuthenticatorAvailable === "function";

    let available = false;
    let biometryType = null;

    if (webAuthnAvailable) {
      // Check if platform authenticator is available (which uses biometrics on Android)
      const platformAuthAvailable =
        await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

      available = platformAuthAvailable;

      if (platformAuthAvailable) {
        // On Android, this is typically fingerprint
        // We can't precisely determine if it's face or fingerprint from the web
        biometryType =
          isMobile && /android/i.test(navigator.userAgent)
            ? "Fingerprint"
            : "Biometrics";
      }
    }

    return {
      available,
      biometryType,
      error: null,
    };
  } catch (error) {
    console.error("Error checking biometric availability:", error);
    return {
      available: false,
      biometryType: null,
      error,
    };
  }
};

// Convert string to ArrayBuffer for WebAuthn
function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Generate a random challenge for WebAuthn
function generateRandomChallenge(): ArrayBuffer {
  const arr = new Uint8Array(32);
  window.crypto.getRandomValues(arr);
  return arr.buffer;
}

// Authenticate using WebAuthn (real biometric authentication)
export const authenticateWithBiometrics = async (
  promptMessage: string = "Authenticate to access your notes",
): Promise<AuthResult> => {
  try {
    // First check if biometrics are available
    const { available } = await checkBiometricAvailability();

    if (!available) {
      return {
        success: false,
        error: "Biometric authentication is not available on this device",
      };
    }

    // Create the WebAuthn credential request options
    const challenge = generateRandomChallenge();

    // Create a unique user ID for this app
    // In a real app, this would be tied to the user's account
    const userId =
      localStorage.getItem("bioNotesUserId") ||
      Math.random().toString(36).substring(2, 15);

    // Store the user ID if it's new
    if (!localStorage.getItem("bioNotesUserId")) {
      localStorage.setItem("bioNotesUserId", userId);
    }

    // Check if we have a credential ID stored from previous authentication
    const credentialId = localStorage.getItem("bioNotesCredentialId");

    // If we don't have a credential ID, we need to create one first
    if (!credentialId) {
      // Create a new credential
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
        {
          challenge,
          rp: {
            name: "Biometric Notes",
            id: window.location.hostname,
          },
          user: {
            id: str2ab(userId),
            name: "user@example.com",
            displayName: "Notes User",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
            { type: "public-key", alg: -257 }, // RS256
          ],
          timeout: 60000,
          attestation: "none",
          authenticatorSelection: {
            authenticatorAttachment: "platform", // Use built-in authenticator (like fingerprint)
            userVerification: "required", // Require biometric verification
            requireResidentKey: false,
          },
        };

      try {
        const credential = (await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions,
        })) as PublicKeyCredential;

        // Store the credential ID for future authentications
        const credentialIdBase64 = btoa(
          String.fromCharCode(
            ...new Uint8Array(credential.rawId as ArrayBuffer),
          ),
        );
        localStorage.setItem("bioNotesCredentialId", credentialIdBase64);

        return { success: true, error: null };
      } catch (error) {
        console.error("Error creating credential:", error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to create credential",
        };
      }
    } else {
      // We have a credential ID, so we can use it to authenticate
      const credentialIdArrayBuffer = str2ab(atob(credentialId));

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions =
        {
          challenge,
          timeout: 60000,
          rpId: window.location.hostname,
          allowCredentials: [
            {
              id: credentialIdArrayBuffer,
              type: "public-key",
              transports: ["internal"],
            },
          ],
          userVerification: "required",
        };

      try {
        await navigator.credentials.get({
          publicKey: publicKeyCredentialRequestOptions,
        });

        return { success: true, error: null };
      } catch (error) {
        console.error("Error during authentication:", error);

        // If the error is because the credential is no longer valid,
        // remove it so we can create a new one next time
        if (
          error instanceof DOMException &&
          (error.name === "NotAllowedError" ||
            error.name === "InvalidStateError")
        ) {
          localStorage.removeItem("bioNotesCredentialId");
        }

        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Authentication failed",
        };
      }
    }
  } catch (error) {
    console.error("Error during biometric authentication:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error during authentication",
    };
  }
};

export const getBiometricType = async () => {
  const { biometryType } = await checkBiometricAvailability();
  return biometryType;
};

// Fallback authentication for when biometrics are not available
export const simulateAuthentication = () => {
  return new Promise<AuthResult>((resolve) => {
    setTimeout(() => {
      resolve({ success: true, error: null });
    }, 1500);
  });
};
