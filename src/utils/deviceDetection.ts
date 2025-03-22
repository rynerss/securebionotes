// Utility to detect if the user is on a mobile device
export const isMobileDevice = (): boolean => {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  // Regular expression to check for mobile devices
  const mobileRegex =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

  return mobileRegex.test(userAgent.toLowerCase());
};
