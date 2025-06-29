const path = require('path');
const webpack = require('webpack');

const createConfig = (target, format) => ({
  mode: process.env.NODE_ENV || 'production',
  entry: './lib/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: format === 'umd' ? 'vissonance.umd.js' : 
              format === 'cjs' ? 'vissonance.cjs.js' : 'vissonance.esm.js',
    library: format === 'umd' ? 'Vissonance' : undefined,
    libraryTarget: format === 'umd' ? 'umd' : format === 'cjs' ? 'commonjs2' : 'module',
    globalObject: format === 'umd' ? 'this' : undefined,
    environment: format === 'esm' ? { module: true } : undefined
  },

  target: target || 'web',
  
  externals: format === 'esm' ? {
    'three': 'three'
  } : {
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
                targets: format === 'umd' ? '> 1%, not dead' : { node: '14' },
                modules: format === 'esm' ? false : 'auto'
              }]
            ]
          }
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js'],
    fallback: format === 'umd' ? {
      'buffer': false,
      'crypto': false,
      'stream': false,
      'util': false,
      'path': false,
      'fs': false
    } : {}
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })
  ],

  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    sideEffects: false
  },

  experiments: format === 'esm' ? {
    outputModule: true
  } : {}
});

module.exports = [
  createConfig('web', 'esm'),
  createConfig('web', 'cjs'), 
  createConfig('web', 'umd')
]; 