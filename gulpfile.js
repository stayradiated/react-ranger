var gulp = require('gulp');
var react = require('gulp-react');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var source = require('vinyl-source-stream');
var connect = require('gulp-connect');
var reactify = require('reactify');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');

gulp.task('default', ['package']); 

gulp.task('package', function () {
  return gulp.src('lib/**/*.js*')
  .pipe(react())
  .pipe(gulp.dest('pkg'));
});

gulp.task('example', ['example/lib', 'example/style'], function () {
  gulp.watch('example/*.scss', ['example/style']);

  return connect.server({
    root: ['example/dist'],
    port: 8000,
    livereload: true
  });
});

gulp.task('example/lib', ['default'], function () {
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

gulp.task('example/style', function () {
  return gulp.src('example/main.scss')
    .pipe(sass({errLogToConsole: true, outputStyle: 'compressed'}))
    .pipe(autoprefixer())
    .pipe(gulp.dest('example/dist/css'))
    .pipe(connect.reload());
});

gulp.task('example/minify', function () {
  return gulp.src('example/dist/js/*')
    .pipe(uglify())
    .pipe(gulp.dest('example/dist/js'));
});
