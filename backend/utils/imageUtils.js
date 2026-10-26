/**
 * Utilities for cleaning and normalizing image URLs.
 * Handles extracting direct image URLs from search engine wrapper links (like Google Images),
 * decoding URI components, and trimming unwanted whitespace.
 */

function extractDirectImageUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();
  if (!url) return '';

  // Extract real direct image URL from Google Images redirect / preview links
  // e.g. https://www.google.com/imgres?q=cars&imgurl=https%3A%2F%2Fdomain.com%2Fphoto.jpg&...
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

function sanitizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images.map((item) => {
    if (!item) return null;
    if (typeof item === 'string') {
      const cleanUrl = extractDirectImageUrl(item);
      return cleanUrl ? { url: cleanUrl } : null;
    }
    if (typeof item === 'object') {
      const cleanUrl = extractDirectImageUrl(item.url);
      return {
        ...item,
        url: cleanUrl || item.url || '',
      };
    }
    return item;
  }).filter(Boolean);
}

module.exports = {
  extractDirectImageUrl,
  sanitizeImages,
};

