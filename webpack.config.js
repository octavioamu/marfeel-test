const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module:{
    rules:  [
      
              {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader'
                ]
              },
              { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
              {
                type: 'javascript/auto',
                test: /\.json$/,
                use: [
                    {
                      loader: 'file-loader',
                      options: {
                          name: "./plugin-config/[name].[ext]"
                      }
                    }
                ]
              }
            ]
  }
};