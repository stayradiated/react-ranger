var gulp = require('gulp');
var react = require('gulp-react');

var source = require('vinyl-source-stream');
var connect = require('gulp-connect');
var reactify = require('reactify');
var browserify = require('browserify');

gulp.task('default', ['package']); 

gulp.task('package', function () {
  return gulp.src('lib/**/*.js*')
  .pipe(react())
  .pipe(gulp.dest('pkg'));
});

gulp.task('watch', ['default'], function () {
  gulp.watch('./lib/**/*', ['package']);
});

gulp.task('example', ['example/app']);

gulp.task('example/watch', ['example'], function () {
  gulp.watch('./lib/**/*', ['example/app']);
  gulp.watch('./example/app.jsx', ['example/app']);
});

gulp.task('example/app', function (cb) {
  var browser = browserify({ extensions: '.jsx' })
    .add('./example/app.jsx')
    .transform(reactify)
    .bundle()
    .on('error', function (err) {
      console.log(err); cb();
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('./example/dist/js'))
    .pipe(connect.reload())
    .on('end', cb);
});

gulp.task('example/connect', ['example/watch'], function () {
  return connect.server({
    root: ['example/dist'],
    port: 8000,
    livereload: true
  });
});
