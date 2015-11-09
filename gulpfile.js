var gulp         = require('gulp');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minifyCSS    = require('gulp-minify-css');
var sourcemaps   = require('gulp-sourcemaps');

gulp.task('sass', function () {
    var processors = [
        autoprefixer({browsers: ['last 30 versions', 'ie 9']})
    ];
    return gulp.src('./src/**/*.scss')
        .pipe(sourcemaps.init())
          .pipe(sass().on('error', sass.logError))
          .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default',['sass'],  function() {
    gulp.src('./dist/cleanSS.css')
        .pipe(minifyCSS())
        .pipe(rename('cleanSS.min.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.scss', ['default']);
});


// Font Tasks
var cssfont64 = require('gulp-simplefont64');

var del = require('del');
var concat    = require('gulp-concat');

// Take all fonts from the ./fonts/ folder and generate a temporary folder with all base64 css
gulp.task('base64convert', function () {
    return gulp.src(['./fonts/*.woff', './fonts/*.ttf'])
        .pipe(cssfont64())
        .pipe(gulp.dest('./fonts/temp'));
});

// Concatenate all the CSS Files in the temporary folder and move it to the src folder
gulp.task('base64concat',['base64convert'], function () {
    return gulp.src('./fonts/temp/*.css')
        .pipe(concat('_fonts.scss'))
        .pipe(gulp.dest('src'));
});

// after all of it is done, remove the temporary folder!
gulp.task('base64css',['base64concat'], function () {
    del('./fonts/temp').then(function (paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

