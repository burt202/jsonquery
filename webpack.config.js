module.exports = {
  entry: [
    "./public/main.jsx"
  ],
  output: {
    filename: "bundle.js",
    path: __dirname + "/public/dist"
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loader: "jsx-loader" }
    ]
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  }
};
