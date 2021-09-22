module.exports = {
  experimental: { esmExternals: true },
  webpack: (config, options) => {
    config.experiments = {
      asyncWebAssembly: true,
    }
    return config;
  },
  reactStrictMode: true,
}
