var gulp = require('gulp');
var react = require('gulp-react');

var source = require('vinyl-source-stream');
var connect = require('gulp-connect');
var reactify = require('reactify');
var browserify = require('browserify');
var watchify = require('watchify');

gulp.task('default', ['package']); 

gulp.task('package', function () {
  return gulp.src('lib/**/*.js*')
  .pipe(react())
  .pipe(gulp.dest('pkg'));
});

gulp.task('watch', ['default'], function () {
  var bundler = watchify({ extensions: '.jsx' }).add('./example/app.jsx');
  bundler.transform(reactify);
  bundler.on('update', rebundle);

  function rebundle () {
    return bundler.bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest('./example/dist/js'))
      .pipe(connect.reload());
  }

  return rebundle();
});

gulp.task('connect', ['watch'], function () {
  return connect.server({
    root: ['example/dist'],
    port: 8000,
    livereload: true
  });
});
