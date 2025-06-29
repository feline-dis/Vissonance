const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './lib/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vissonance.dev.js',
    library: 'Vissonance',
    libraryTarget: 'umd',
    globalObject: 'this'
  },

  devtool: 'inline-source-map',

  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    compress: true,
    port: 8080,
    open: true,
    hot: true,
    historyApiFallback: true
  },

  externals: {
    'three': {
      commonjs: 'three',
      commonjs2: 'three',
      amd: 'three',
      root: 'THREE'
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: '> 1%, not dead',
                modules: false
              }]
            ]
          }
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js']
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}; 