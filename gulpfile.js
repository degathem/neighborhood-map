var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    minifycss = require("gulp-minify-css"),
    util = require("gulp-util"),
    livereload = require("gulp-livereload"),
    jshint = require("gulp-jshint")
    del = require('del')
    concatenate = require('gulp-concat');


//Javascript Gulp tasks broken into two different tasks
// one for project js created specifically for this project
// and one for the vendor components i.e. libraries
gulp.task('js', function() {
    return gulp.src(['./src/components/knockout/dist/knockout.js',
                     './src/components/bootstrap/dist/js/bootstrap.min.js',
                     './src/js/*.js'])
      .pipe(uglify())
      .pipe(concatenate('app.js'))
      .pipe(gulp.dest('./build/js/'));
});     

// gulp.task('vendorjs', function() {
//     return gulp.src(['./src/components/knockout/dist/knockout.js',
//       './src/components/bootstrap/dist/js/bootstrap.min.js'])
//       .pipe(gulp.dest('build/js/'));
// });

gulp.task('css', function() {
    return gulp.src(['./src/components/bootstrap/dist/css/bootstrap.min.css',
                     './src/css/*.css'])
      .pipe(minifycss())
      .pipe(concatenate('style.css'))
      .pipe(gulp.dest('./build/css/'));
});

gulp.task('usemin', function() {
    return gulp.src('src/index.html')
      .pipe(usemin({
        css: ['css'],
        js: ['js']
      }))
      .pipe(gulp.dest('./build/'));
});

gulp.task('livereload', function() {
    livereload();
    livereload.reload('./src/index.html');
});


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['./src/js/*.js','./src/css/*.css','./src/index.html'],['livereload'])
});

gulp.task('clean', function() {
    del(['./build/*']);
});
