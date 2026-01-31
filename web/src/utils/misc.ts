// Will return whether the current environment is in a regular browser
// and not CEF
export const isEnvBrowser = (): boolean => !(window as any).invokeNative;

// Basic no operation function
export const noop = () => {};

// Returns the correct image URL based on environment
export const getItemImageUrl = (itemName: string): string => {
  if (isEnvBrowser()) {
    return `https://raw.githubusercontent.com/CommunityOx/ox_inventory/main/web/images/${itemName}.png`;
  }
  return `https://cfx-nui-ox_inventory/web/images/${itemName}.png`;
};
