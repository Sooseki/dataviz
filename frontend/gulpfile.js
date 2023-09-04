const gulp = require("gulp");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));

// Define the Sass compilation task
function compileSass() {
    return gulp
        .src("./src/styles/main.scss")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(rename("main.css"))
        .pipe(gulp.dest("./src/styles/"));
}

gulp.task("default", gulp.series(compileSass));
gulp.task('watch', function () {
    gulp.watch("./src/styles/**/*.scss", compileSass);
});