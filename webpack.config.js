module.exports = {
  module: {
    rules: [
      {
        test: /\.mjs$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          /node_modules\/@mediapipe\/tasks-vision/
        ],
      },
    ],
  },
};
