module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          alias: {
            '@braynex/api': ['../../packages/api/src'],
          },
        },
      ],
    ],
  };
};
