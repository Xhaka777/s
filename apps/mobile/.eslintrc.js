module.exports = {
  root: true,
  extends: '@react-native',

  overrides: [
    {
      files: ['*.js'],
      parser: 'espree',
      parserOptions: {
        requireConfigFile: false,
      },
    },
  ],
};
