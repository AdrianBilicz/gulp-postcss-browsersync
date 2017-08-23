/* gulp dependencies */
const gulp = require('gulp');  
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const minifycss = require('gulp-minify-css');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');


gulp.task('serve',function(){
	browserSync.init({
		server: {
			baseDir: './dist'
		}
	})
})


/* scripts task */
gulp.task('scripts', function() {
	return gulp.src([
		'node_modules/jquery/dist/jquery.js',
		'src/js/*.js'
	])
	.pipe(concat())
	.pipe(gulp.dest('dist/assets/js'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('dist/assets/js'))
	.pipe(browserSync.reload({stream:true}));
});

/* sass task */
gulp.task('sass', function() {  
	gulp.src('src/sass/*.sass')
		.pipe(plumber())
		.pipe(sass({
			includePaths: ['sass']
		}))
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(browserSync.reload({stream:true}));
});

/* postcss/cssnano task */
gulp.task('css', function() {
    var processors = [
        autoprefixer({browsers: ['last 4 versions']}),
        cssnano(),
    ];
    return gulp.src('dist/assets/css/styles.css')
        .pipe(postcss(processors))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/assets/css'));
});

/* reload task */
gulp.task('bs-reload', function() {
	browserSync.reload();
});


gulp.task('html', function(){
	gulp.src('src/*.html')
	.pipe(gulp.dest('dist'))
	.pipe(browserSync.reload({stream:true}))
})

/* watch sass, js and html files, doing different things with each. */
gulp.task('default', ['html','sass', 'css', 'serve'], function() {
	/* watch sass, run the sass task on change. */
	gulp.watch(['src/sass/*.sass', 'src/sass/**/*.sass'], ['sass', 'css']);
	/* watch app.js file, run the scripts task on change. */
	gulp.watch(['src/js/*.js'], ['scripts']);
	/* watch .html files, run the bs-reload task on change. */
	gulp.watch(['*.html'], ['bs-reload']);
});