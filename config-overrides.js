const { override } = require("customize-cra");
const webpack = require("webpack");

function customOverride(config) {
  const scopePluginIndex = config.resolve.plugins.findIndex(
    ({ constructor }) =>
      constructor && constructor.name === "ModuleScopePlugin"
  );

  if (scopePluginIndex !== -1) {
    config.resolve.plugins.splice(scopePluginIndex, 1);
  }

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser.js",
    })
  );

  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    // http: require.resolve("stream-http"),
    // https: require.resolve("https-browserify"),
    // zlib: require.resolve("browserify-zlib"),
    stream: require.resolve("stream-browserify"),
    // process: require.resolve("process/browser.js"),
    vm: require.resolve("vm-browserify"),
    buffer: require.resolve("buffer/"),
  };

  return config;
}

module.exports = override(customOverride);