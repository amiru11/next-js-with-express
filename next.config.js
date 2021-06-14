module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
      use: [{
        loader: 'url-loader',
        options: {
          esModule: false,
          fallback: 'file-loader',
          publicPath: '/_next/',
          outputPath: 'static/images/',
          name: '[name].[hash:8].[ext]'
        }
      }]
    });

    return config;
  },
  trailingSlash: true,
}