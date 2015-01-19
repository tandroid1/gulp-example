var gulp = require('gulp');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var watchify = require('watchify');
var livereload = require('gulp-livereload');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var compass = require('gulp-compass');
var watch;

gulp.task('browserify-nowatch', function(){
  watch = false;
  browserifyShare();
});

gulp.task('browserify-watch', function(){
  watch = true;
  browserifyShare();
});

function browserifyShare(){
  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true
  });
  
  if(watch) {
    // if watch is enable, wrap this bundle inside watchify
    b = watchify(b);
    b.on('update', function(){
      bundleShare(b);
    });
  }
  
  b.add('./js/main.js');
  bundleShare(b);
}

function bundleShare(b) {
  b.bundle()
    .pipe(source('share.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulpif(watch, livereload()));
}

gulp.task('sass', function () {
    gulp.src('./sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css/'))
        .pipe(gulpif(watch, livereload()));
});

gulp.task('compass', function() {
  gulp.src('./sass/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: 'css',
      sass: 'sass'
    }))
    .pipe(gulp.dest('app/assets/temp'))
    .pipe(gulpif(watch, livereload()));
});

// define the browserify-watch as dependencies for this task
gulp.task('watch', ['browserify-watch'], function(){
  // watch other files, for example .less file
  gulp.watch('./sass/*.scss',
             ['compass']);

  // Start live reload server
  livereload.listen();
});

gulp.task('default', function() {
	gulp.run('watch');
});