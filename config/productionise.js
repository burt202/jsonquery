const webpack = require("webpack")
const SwigWebpackPlugin = require("swig-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

const packageJson = require("../package.json")

const R = require("ramda")

const prodPlugins = [
  new ExtractTextPlugin("bundle.css"),
  new OptimizeCssAssetsPlugin(),
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("production"),
    },
  }),
  new UglifyJsPlugin({
    compress: {
      warnings: false,
    },
  }),
  new SwigWebpackPlugin({
    filename: "index.html",
    template: "./src/index.html",
    watch: "./src/index.html",
    data: {
      version: packageJson.version,
      production: true,
      lastModified: Date.now(),
    },
  }),
]

const prodRules = [{
  test: /\.css$/,
  loader: ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: "css-loader",
  }),
}]

module.exports = function(webpackConfig) {
  const plugins = R.concat(
    prodPlugins,
    R.slice(0, webpackConfig.plugins.length - 2, webpackConfig.plugins)
  )

  const oldRules = webpackConfig.module.rules.slice(0, webpackConfig.module.rules.length - 1)
  const entry = webpackConfig.entry.slice(-1)
  const result = R.merge(webpackConfig, {plugins, entry})

  result.module.rules = oldRules.concat(prodRules)

  return result
}
