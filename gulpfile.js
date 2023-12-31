"use strict";

var gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  del = require('del'),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css'),
  rename = require("gulp-rename"),
  merge = require('merge-stream'),
  autoprefixer = require('gulp-autoprefixer');

// Clean task
gulp.task('clean', function() {
  return del(['assets/main.min.css']);
});

// Compile SCSS(SASS) files
gulp.task('scss', gulp.series(function compileScss() {
  return gulp.src(['./src/scss/*.scss'])
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./src/css'))
}));

// Minify CSS
gulp.task('css:minify', gulp.series('scss', function cssMinify() {
  return gulp.src("./src/css/*.css")
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./assets'))
}));

// Minify Js
gulp.task('js:minify', function () {
  return gulp.src([
    './src/js/main.js'
  ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./assets'))
});

// Configure watch file path for change
gulp.task('dev', function () {
  gulp.watch(['src/scss/*.scss','src/scss/**/*.scss'], gulp.series('css:minify'));
  gulp.watch('src/js/main.js', gulp.series('js:minify'));
});

// Build task
gulp.task("build", gulp.series(gulp.parallel('css:minify', 'js:minify')));

// Default task
gulp.task("default", gulp.series("clean", 'build'));
