let HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: "./index.js",
  },
  output:{
    filename:"main.js",
    path:'/dist'
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devServer: {
    contentBase: "./dist",
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                { pragma: "createElement" },
              ],
            ],
          },
        },
      },
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  //   plugins: [new webpack.HotModuleReplacementPlugin()],
  plugins: [
    new HtmlWebpackPlugin({
      title: "develop",
    }),
  ],
  mode: "development",
};
