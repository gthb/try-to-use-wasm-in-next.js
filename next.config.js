module.exports = {
  experimental: { esmExternals: true },
  webpack: (config, options) => {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
  reactStrictMode: true,
}
