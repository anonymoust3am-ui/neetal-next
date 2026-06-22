export const FB_PIXEL = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID!;

declare global {
  interface Window {
    fbq: any;
  }
}

export const pageview = () => {
  window.fbq?.("track", "PageView");
};

export const event = (name: string, options = {}) => {
  window.fbq?.("track", name, options);
};

export const customEvent = (name: string, options = {}) => {
  window.fbq?.("trackCustom", name, options);
};