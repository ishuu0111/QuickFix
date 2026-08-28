import { Platform, useWindowDimensions } from "react-native";

export const isWeb = Platform.OS === "web";
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
};

export const MAX_CONTAINER_WIDTH = 1200;
export const CONTENT_MAX_WIDTH = 1200;

export function useScreenDimensions() {
  return useWindowDimensions();
}

/**
 * Universal responsive hook providing device classification, layout metrics,
 * and adaptive container styles for Phone, Tablet, Laptop, and Desktop.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.tablet;
  const isWideDesktop = width >= BREAKPOINTS.desktop;

  const contentWidth = isWeb
    ? Math.min(width, MAX_CONTAINER_WIDTH)
    : width;

  let serviceColumns = 2;
  if (width >= 1440) serviceColumns = 6;
  else if (width >= 1024) serviceColumns = 3;
  else if (width >= 640) serviceColumns = 3;
  else serviceColumns = 2;

  let categoryColumns = 4;
  if (width >= 1024) categoryColumns = 8;
  else if (width >= 600) categoryColumns = 4;
  else categoryColumns = 4;

  const containerPadding = isMobile ? 16 : isTablet ? 24 : 32;

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isWideDesktop,
    contentWidth,
    serviceColumns,
    categoryColumns,
    containerPadding,
    webContainerStyle: isWeb
      ? {
          maxWidth: MAX_CONTAINER_WIDTH,
          width: "100%",
          alignSelf: "center",
          paddingHorizontal: containerPadding,
        }
      : {
          width: "100%",
          paddingHorizontal: containerPadding,
        },
  };
}

export function useDeviceClass() {
  const { width } = useWindowDimensions();
  if (width < 768) return "phone";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function useContentMaxWidth() {
  return MAX_CONTAINER_WIDTH;
}

export function useGridColumns(base = 2) {
  const { width } = useWindowDimensions();
  if (width >= 1440) return 6;
  if (width >= 1024) return 3;
  if (width >= 640) return 3;
  return base;
}

export function useScrollBottomPad(extra = 0) {
  return (isWeb ? 80 : 110) + extra;
}

export default {
  isWeb,
  isIOS,
  isAndroid,
  BREAKPOINTS,
  MAX_CONTAINER_WIDTH,
  CONTENT_MAX_WIDTH,
  useResponsive,
  useScreenDimensions,
  useDeviceClass,
  useContentMaxWidth,
  useGridColumns,
  useScrollBottomPad,
};