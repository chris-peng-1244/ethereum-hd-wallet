const gulp = require('gulp');
const gulpBabel= require('gulp-babel');
const sourceMaps = require('gulp-sourcemaps');

gulp.task('build', () => {
    gulp.src('src/**/*.js')
        .pipe(sourceMaps.init())
        .pipe(gulpBabel({
            "plugins": [
                "transform-object-rest-spread",
            ],
            "presets": [
                "env",
                "flow",
            ],
            "sourceMaps": true,
        }))
        .pipe(sourceMaps.write('.', {
            includeContent: false,
            sourceRoot: './src',
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    gulp.watch('src/**/*.js', ['build']);
});
