/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "netlify",
  server: "./server.js",
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  serverDependenciesToBundle: "all",
  serverEnvironmentVariables: [
    'VITE_GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'VITE_CONVEX_URL'
  ],
  browserEnvironmentVariables: ['VITE_GITHUB_CLIENT_ID', 'VITE_CONVEX_URL']
}; 