const gulp = require('gulp'); 
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));

// Define the Sass compilation task
gulp.task('sass', function () {
    return gulp
        .src('./src/styles/main.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename('main.css'))
        .pipe(gulp.dest('./src/styles/'));
});

// Define the default task
gulp.task('default', gulp.series('sass'));
