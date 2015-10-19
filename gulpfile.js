var gulp         = require('gulp');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minifyCSS    = require('gulp-minify-css');


gulp.task('sass', function () {
    var processors = [
        autoprefixer({browsers: ['last 30 versions', 'ie 9']})
    ];
    return gulp.src('./src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
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
