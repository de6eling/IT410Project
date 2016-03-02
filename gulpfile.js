/**
 * Created by debeling on 2/17/16.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var useref = require('gulp-useref');
const changed = require('gulp-changed');

/*
* SASS to CSS
*
*/

gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(changed('./dist'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

/*
 * Autoprefixer
 *
 */

gulp.task('autoprefixer', function () {
    return gulp.src('./src/app.css')
        .pipe(changed('dist'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'));
});

/*
 *  Minify CSS
 *
 */

gulp.task('default', function () {
    return gulp.src('./src/css/main.css')
        .pipe(changed('./dist'))
        .pipe(csso())
        .pipe(gulp.dest('./out'));
});

/*
 *  Minify HTML
 *
 */

gulp.task('minify', function() {
    return gulp.src('./src/*.html')
        .pipe(changed('dist'))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
});

/*
 *  Minify image
 *
 */

gulp.task('default', function () {
    return gulp.src('./src/images/*')
        .pipe(changed('dist'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});


/*
 *  Minify JS file
 *
 */

gulp.task('compress', function() {
    return gulp.src('./src/js/*.js')
        .pipe(changed('dist'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

/*
 *  Unminify stuff
 *
 */

gulp.task('default', ['compress'], function () {
    return gulp.src('./src/*.html')
        .pipe(changed('dist'))
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});
