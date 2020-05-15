const webpack = require("webpack")
const NunjucksWebpackPlugin = require("nunjucks-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const R = require("ramda")

const prodPlugins = [
  new MiniCssExtractPlugin({
    filename: "bundle.css",
  }),
  new OptimizeCssAssetsPlugin(),
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("production"),
    },
  }),
  new NunjucksWebpackPlugin({
    templates: [
      {
        from: "./src/index.html",
        to: "index.html",
        context: {
          production: true,
          lastModified: Date.now(),
        },
      },
    ],
  }),
]

const prodRules = [{
  test: /\.css$/,
  use: [
    {loader: MiniCssExtractPlugin.loader},
    {loader: "css-loader"},
  ],
}]

module.exports = function(webpackConfig) {
  const plugins = R.concat(
    prodPlugins,
    R.slice(0, webpackConfig.plugins.length - 2, webpackConfig.plugins)
  )

  const oldRules = webpackConfig.module.rules.slice(0, webpackConfig.module.rules.length - 1)
  const entry = webpackConfig.entry.slice(-1)
  const result = R.merge(webpackConfig, {plugins, entry, mode: "production"})

  result.module.rules = oldRules.concat(prodRules)

  return result
}
