const gulp = require('gulp');
const gulpBabel= require('gulp-babel');
const sourceMaps = require('gulp-sourcemaps');

gulp.task('build', () => {
    gulp.src('src/**/*.js')
        .pipe(sourceMaps.init())
        .pipe(gulpBabel({
            "presets": [
                "env",
                "flow",
                "add-module-exports",
            ],
            "sourceMaps": true,
        }))
        .pipe(sourceMaps.write('.', {
            includeContent: false,
            sourceRoot: './src',
        }))
        .pipe(gulp.dest('lib'));
});

gulp.task('watch', () => {
    gulp.watch('src/**/*.js', ['build']);
});
