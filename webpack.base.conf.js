const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/entry/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, "src/assets"),
    compress: true,
    host: "0.0.0.0",
    port: 80
  },
  module: {
    rules: []
  },
  plugins: [
    new HtmlWebpackPlugin({
      name: 'index',
      filename: "index.html",
      chunks: ['main'],
      template: path.join(__dirname, './src/index.html')
    })
  ]
}
