/**
 * Public URL of the deployed site, used for canonical and Open Graph URLs.
 * Set NEXT_PUBLIC_SITE_URL in your hosting environment (e.g. https://your-domain.com).
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
