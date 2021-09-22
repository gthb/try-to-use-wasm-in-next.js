module.exports = {
  webpack: (config, options) => {
    config.experiments = {
      asyncWebAssembly: true,
    }
    return config;
  },
  reactStrictMode: true,
}
