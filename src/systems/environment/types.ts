export enum eEnvironmentEvents {
  SCREEN_SIZE_CHANGE = "screenSizeChange",
  ORIENTATION_CHANGE = "orientationChange",
}

export type TOrientation = "portrait" | "landscape";
export type TDevice = "mobile" | "tablet" | "desktop";
export type TBrowser =
  | "chrome"
  | "firefox"
  | "safari"
  | "edge"
  | "opera"
  | "unknown";
export type TOperatingSystem =
  | "windows"
  | "mac"
  | "linux"
  | "android"
  | "ios"
  | "chromeos"
  | "unknown";

export interface IEnvironmentData {
  screenSize: {
    width: number;
    height: number;
  };
  viewportSize: {
    width: number;
    height: number;
  };
  maxCanvasSize: {
    width: number;
    height: number;
  };
  resolution: number;
  canvasResolution: number;
  device: TDevice;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  orientation: TOrientation;
  browser: string | undefined;
  os: string | undefined;
  integration: eEnvironmentIntegration;
}

export interface IEnvironmentConfig {
  maxCanvasResolution: number;
}

export enum eEnvironmentIntegration {
  NONE = "NoneIntegration",
  CMG = "CoolMathGamesIntegration",
}
