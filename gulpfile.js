var R = require("ramda");
var gulp = require("gulp");
var runSequence = require("run-sequence");
var clean = require("gulp-clean");
var deploy = require("gulp-gh-pages");
var gulpWebpack = require("gulp-webpack");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var swig = require("gulp-swig");
var data = require("gulp-data");
var packageJson = require("./package.json");

var baseData = {
  version: packageJson.version
};

gulp.task("default", ["watch"]);

gulp.task("watch", function () {
  gulp.watch("src/**", ["build"]);
});

gulp.task("clean", function () {
  return gulp.src("build")
    .pipe(clean());
});

gulp.task("webpack", function () {
  return gulp.src("src/main.jsx")
    .pipe(gulpWebpack(webpackConfig))
    .pipe(gulp.dest("build"));
});

gulp.task("webpack-prod", function () {
  var webpackConfigForProd = R.assoc("plugins", R.concat([
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: false
      }
    })
  ], webpackConfig.plugins), webpackConfig);

  return gulp.src("src/main.jsx")
    .pipe(gulpWebpack(webpackConfigForProd))
    .pipe(gulp.dest("build"));
});

gulp.task("copy-files", function () {
  return gulp.src([
      "src/favicon.ico",
      "CNAME"
    ])
    .pipe(gulp.dest("build"));
});

gulp.task("swig", function () {
  return gulp.src("src/index.html")
    .pipe(data(R.merge(baseData, {production: false})))
    .pipe(swig())
    .pipe(gulp.dest("build"));
});

gulp.task("swig-prod", function () {
  return gulp.src("src/index.html")
    .pipe(data(R.merge(baseData, {production: true})))
    .pipe(swig())
    .pipe(gulp.dest("build"));
});

gulp.task("build", function (callback) {
  runSequence(
    "clean",
    "webpack",
    "swig",
    "copy-files",
    callback
  );
});

gulp.task("build-prod", function (callback) {
  runSequence(
    "clean",
    "webpack-prod",
    "swig-prod",
    "copy-files",
    callback
  );
});

gulp.task("deploy", ["build-prod"], function () {
  return gulp.src("./build/**/*")
    .pipe(deploy());
});
