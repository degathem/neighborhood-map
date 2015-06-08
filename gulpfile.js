var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    minifycss = require("gulp-minify-css"),
    util = require("gulp-util"),
    livereload = require("gulp-livereload"),
    del = require('del')
    concatenate = require('gulp-concat'),
    usemin = require('gulp-usemin');


gulp.task('usemin', function() {
  return gulp.src('./src/index.html')
    .pipe(usemin({
      css: [minifycss()],
      js: [uglify()]
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(['./src/js/*.js','./src/css/*.css','./src/index.html'],['livereload'])
});

gulp.task('clean', function() {
  del(['./build/*']);
});
