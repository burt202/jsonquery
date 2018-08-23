const webpack = require("webpack")
const path = require("path")
const NunjucksWebpackPlugin = require("nunjucks-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const packageJson = require("./package.json")

module.exports = {
  mode: "development",
  entry: [
    "react-hot-loader/patch",
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server",
    "./src/js/index",
  ],
  devtool: "inline-source-map",
  output: {
    publicPath: "/",
    path: path.join(__dirname, "build"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".jsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: [
          {loader: "jsx-loader"},
        ],
      },
      {
        test: /\.css$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"},
        ],
      },
    ],
  },
  devServer: {
    contentBase: "./build",
    noInfo: true,
    hot: true,
    inline: true,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new CopyWebpackPlugin([
      {from: "src/favicon.ico", to: "favicon.ico"},
      {from: "src/gears.svg", to: "gears.svg"},
      {from: "src/test-data.json", to: "test-data.json"},
      {from: "CNAME", to: "CNAME", toType: "file"},
    ]),

    new webpack.DefinePlugin({
      "VERSION": JSON.stringify(packageJson.version),
    }),

    new webpack.HotModuleReplacementPlugin(),
    new NunjucksWebpackPlugin({
      templates: [
        {
          from: "./src/index.html",
          to: "index.html",
          context: {
            production: false,
            lastModified: Date.now(),
          },
        },
      ],
    }),
  ],
}
