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
    port: 8080
  },
  module: {
    rules: []
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, './src/index.html')
    })
  ]

}
