/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverEnvironmentVariables: [
    'VITE_GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'VITE_CONVEX_URL'
  ],
  browserEnvironmentVariables: ['VITE_GITHUB_CLIENT_ID', 'VITE_CONVEX_URL'],
  // ... rest of your config
}; 