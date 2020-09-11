const path = require('path');
const webpack = require('webpack');
const paths = require('../config/paths');

const sassRegex = /\.(scss|sass|css)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const mdxRegex = /\.(.mdx)$/;

module.exports = {
  resolve: {
    modules: [paths.appBase, 'node_modules'],
  },
  module: {
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.webp$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../'),
      },
      {
        test: sassModuleRegex,
        loaders: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }),
              ],
            },
          },
          require.resolve('sass-loader'),
        ],
        include: path.resolve(__dirname, '../'),
      },
      {
        test: /.csv$/,
        loaders: [require.resolve('file-loader')],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      SUPPORTED_BROWSERS: '[]',
      TENANT_CONFIGS: '{}',
    }),
    new webpack.NormalModuleReplacementPlugin(
      /HibanaContext/,
      path.resolve(__dirname, './FakeHibanaContext.js'),
    ),
  ],
};
