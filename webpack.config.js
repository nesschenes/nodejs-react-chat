const path = require("path");
const webpack = require("webpack");

module.exports = {
  devtool: "eval-cheap-module-source-map",
  mode: "development",
  entry: {
    app: ["webpack-hot-middleware/client", "./src/client/client.js"],
  },
  output: {
    path: path.resolve("./src/dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: [/node_modules/, /src\/server/],
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          cacheDirectory: true,
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
