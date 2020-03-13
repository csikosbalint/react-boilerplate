const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
var Visualizer = require('webpack-visualizer-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    react: './node_modules/react',
    reactdom: './node_modules/react-dom',
    awssdkglobal: './node_modules/aws-sdk/global',
    cognitoidp: './node_modules/aws-sdk/clients/cognitoidentityserviceprovider',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    crossOriginLoading: 'anonymous',
  },
  devtool: 'inline-source-map',
  optimization: {
    splitChunks: {
      // This indicates which chunks will be selected for optimization. 
      // When a string is provided, valid values are all, async, and 
      // initial. Providing all can be particularly powerful, because it 
      // means that chunks can be shared even between async and non-async
      // chunks.
      chunks: 'all',
      minSize: 30,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '_',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: !process.env.npm_lifecycle_script.includes('production')
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|index.js)/,
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              fix: true
            }
          }
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.json$/,
        exclude: /(node_modules)/,
        use: [
          'json-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './root/index.html',
      inject: true
    }),
    new CopyWebpackPlugin([
      { from: 'root' },
      { from: 'assets', to: 'assets' }
    ]),
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: process.env.npm_lifecycle_script.includes('production'),
    }),
    new Visualizer({
      filename: './statistics.html',
      enabled: false
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
};