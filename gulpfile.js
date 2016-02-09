/*jshint node:true */
'use strict';

var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  mochaRunner = require('gulp-mocha');

gulp.task('serve', function () {
  browserSync({
    server: { baseDir: '.' }
  });

  gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js'], {cwd: '.'}, reload);
});

gulp.task('tests', function () {
  return gulp.src('test/**/*.js', {read: false})
    .pipe(mochaRunner({reporter: 'nyan'}));
});
