// lib/imagekit-server.js
import ImageKit from "imagekit";

/**
 * Lazily create and return an ImageKit instance for server-side use.
 * This file must NOT be imported by client-side code.
 */
let _cachedImageKit = null;

export function getImageKit() {
  if (_cachedImageKit) return _cachedImageKit;

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey) {
    throw new Error("Missing IMAGEKIT_PUBLIC_KEY (or NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY) environment variable");
  }

  if (!privateKey) {
    throw new Error("Missing IMAGEKIT_PRIVATE_KEY environment variable");
  }

  _cachedImageKit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });

  return _cachedImageKit;
}
