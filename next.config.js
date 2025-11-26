/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Completely disable file watching to work around macOS file descriptor limit
      config.watchOptions = {
        poll: 3000,
        aggregateTimeout: 600,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      }
      // Reduce the number of modules webpack tracks
      config.snapshot = {
        managedPaths: [],
        immutablePaths: [],
        buildDependencies: {
          hash: false,
          timestamp: true,
        },
        module: {
          timestamp: true,
        },
        resolve: {
          timestamp: true,
        },
        resolveBuildDependencies: {
          timestamp: true,
        },
      }
    }
    return config
  },
}

module.exports = nextConfig

