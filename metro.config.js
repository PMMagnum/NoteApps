const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add wasm to asset extensions
config.resolver.assetExts = [...config.resolver.assetExts, 'wasm'];

// Optional: if you're using web-specific files
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

module.exports = config;