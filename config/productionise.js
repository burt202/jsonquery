const webpack = require("webpack")
const SwigWebpackPlugin = require("swig-webpack-plugin")
const packageJson = require("../package.json")

const R = require("ramda")

const prodPlugins = [
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("production"),
    },
  }),
  new webpack.optimize.UglifyJsPlugin({
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
    },
  }),
]

module.exports = function(webpackConfig) {
  const plugins = R.concat(
    prodPlugins,
    R.slice(0, webpackConfig.plugins.length - 2, webpackConfig.plugins)
  )

  const entry = webpackConfig.entry.slice(-1)

  return R.merge(webpackConfig, {plugins, entry})
}
