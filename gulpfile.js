var gulp = require("gulp");
var runSequence = require("run-sequence");
var clean = require("gulp-clean");
var deploy = require("gulp-gh-pages");
var webpack = require("gulp-webpack");

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
    .pipe(webpack( require("./webpack.config.js") ))
    .pipe(gulp.dest("build"));
});

gulp.task("copy-index", function () {
  return gulp.src("src/index.html")
    .pipe(gulp.dest("build"));
});

gulp.task("build", function (callback) {
  runSequence(
    "clean",
    "webpack",
    "copy-index",
    callback
  );
});

gulp.task("deploy", ["build"], function () {
  return gulp.src("./build/**/*")
    .pipe(deploy());
});
