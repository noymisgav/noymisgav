var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync');

gulp.task('less', function(){
	return gulp.src('site/assets/less/style.less')
	.pipe(sourcemaps.init())
	// .pipe(sourcemaps.identityMap())
	.pipe(plumber())
	.pipe(less())
	.pipe(autoprefixer())
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('site/assets/css'))
	.pipe(browserSync.stream());
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'site'
        },
    });
});

gulp.task('watch', ['browser-sync', 'less'], function(){
	 gulp.watch('site/assets/less/*.less', ['less']);
	 gulp.watch('site/**/*.html', browserSync.reload);
	 gulp.watch('site/**/*.less', browserSync.reload);
	 gulp.watch('site/**/*.js', browserSync.reload);
});


gulp.task('default', [ 'watch' ]);