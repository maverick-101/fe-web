const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const Critters = require('critters-webpack-plugin');

var postcssOption = {
  plugins: (loader) => [
    require('postcss-import')({
      path: path.join(__dirname, 'client/app/common'),
    }),
    require('postcss-cssnext')({
      browsers: ['> 1%', 'last 2 versions']
    })
  ]
};

var plugins = [
  new webpack.ProvidePlugin({
    Promise: ['es6-promise', 'Promise']
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    filename: '[name].[hash].js',
    minChunks: Infinity
  }),
  new ExtractTextPlugin('[name].css', {allChunks: true}),
  new HtmlWebpackPlugin({
    template: '../index.html',
    favicon: '../favicon.ico',
    inject: true,
    excludeChunks: ['common']
  }),
  new CompressionPlugin({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.js$|\.css$|\.html$|\.jpeg$|\.jpg$|\.png$|\.svg$/,
    threshold: 5240,
    minRatio: 0.8
  }),
  new Critters({
    // Outputs: <link rel="preload" onload="this.rel='stylesheet'">
    preload: 'swap',

    // Don't inline critical font-face rules, but preload the font URLs:
    preloadFonts: true
  })
];

if (process.env.NODE_ENV == 'production') {
  plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  )
}

module.exports = {
  context: path.join(__dirname, 'client/app'),
  entry: {
    app: ['babel-polyfill','./app.js'],
    common: './common.js',
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'public/'),
    publicPath: '/',
    chunkFilename: '[name].[hash].js',
  },
  module: {
    rules: [
      
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'exclude_glyphicons-loader',
            {loader: 'css-loader', options: {importLoaders: 1, sourceMap: true}},
            'less-loader',
          ]
        })
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'client/app/common'), /node_modules/],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader', options: {sourceMap: true}},
            {loader: 'postcss-loader', options: postcssOption},
          ]
        })
      },
      {
        test: /\.css$/,
        exclude: [path.resolve(__dirname, 'client/app/common'), /node_modules/],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader', options: {localIdentName: '[local]', modules: true, sourceMap: true}},
            {loader: 'postcss-loader', options: postcssOption},
          ]
        })
      },
      {
        test: /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)\?*.*$/,
        use: ['file-loader']
      },
    ]
  },
  resolve: {
    alias: {
      config$: path.resolve(__dirname, 'config.js'),
      helpers$: path.resolve(__dirname, 'client/app/helpers.js'),
    },
    modules: ['static', 'client/app', 'node_modules']
  },
  resolveLoader: {
    modules: [__dirname, 'node_modules']
  },
  devtool: process.env.NODE_ENV == 'production' ? '' : 'source-map',
  plugins: plugins,
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    contentBase: '/',
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/auth': {
        target: 'http://localhost:3000',
        secure: false
      }
    }
  }
}
