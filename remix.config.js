/** @type {import('@remix-run/dev').AppConfig} */
export default {
  serverBuildTarget: "cloudflare-pages",
  server: "./server.js",
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  serverDependenciesToBundle: [
    /@remix-run\/.*/,
    /^@remix-run\/node$/,
    "cookie-signature",
    "stream-slice",
    "undici"
  ],
  serverEnvironmentVariables: [
    'VITE_GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'VITE_CONVEX_URL'
  ],
  browserEnvironmentVariables: ['VITE_GITHUB_CLIENT_ID', 'VITE_CONVEX_URL']
}; 