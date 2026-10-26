export const FALLBACK_PRODUCT_IMAGE = '/images/products/quilted-sandwich-pocket.jpg';

/**
 * Extracts the real image URL from Google Images links (or other redirect/preview URLs)
 * and trims/cleans the input.
 */
export function extractDirectImageUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();
  if (!url) return '';

  // Extract real direct image URL from Google Images preview/search URLs
  // e.g. https://www.google.com/imgres?q=cars&imgurl=https%3A%2F%2F...
  if (url.includes('google.') && (url.includes('imgurl=') || url.includes('/imgres') || url.includes('/url?'))) {
    try {
      const parsed = new URL(url);
      const extracted = parsed.searchParams.get('imgurl') || parsed.searchParams.get('url') || parsed.searchParams.get('q');
      if (extracted && (extracted.startsWith('http://') || extracted.startsWith('https://') || extracted.startsWith('/'))) {
        url = extracted;
      }
    } catch {
      const match = url.match(/[?&](?:imgurl|url|q)=([^&]+)/i);
      if (match && match[1]) {
        try {
          url = decodeURIComponent(match[1]);
        } catch {
          url = match[1];
        }
      }
    }
  }

  // Handle URL-encoded addresses
  if (url.startsWith('http%3A') || url.startsWith('https%3A')) {
    try {
      url = decodeURIComponent(url);
    } catch {
      // keep as is
    }
  }

  return url;
}

/**
 * Resolves an image URL for display:
 * - If empty/falsy, returns the fallback image
 * - Cleans Google Images wrapper links
 */
export function resolveImageUrl(url, fallback = FALLBACK_PRODUCT_IMAGE) {
  const cleaned = extractDirectImageUrl(url);
  return cleaned || fallback;
}

