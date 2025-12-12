const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');
const { withNativeWind } = require('nativewind/metro');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Allow Metro to watch the entire monorepo
config.watchFolders = [workspaceRoot];

// Allow imports from shared packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Ensure each package uses its own babel.config.js
config.transformer = {
  ...config.transformer,
  enableBabelRCLookup: true,
};

config.resolver.sourceExts.push('css');

module.exports = withNativeWind(config, {
  input: './global.css',
});
