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
  var bundler = watchify(browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    extensions: '.jsx'
  }));

  bundler.add('./example/app.jsx');
  bundler.transform(reactify);
  bundler.on('update', rebundle);

  function rebundle () {
    console.log('rebundling');
    return bundler.bundle()
      .on('error', function (err) {
        console.log(err.message);
      })
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
