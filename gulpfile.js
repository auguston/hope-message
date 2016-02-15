// 引用外掛
var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	// jade
	jade = require('gulp-jade'),
	// postCss
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer')
	sass = require('gulp-sass'),
	lost = require('lost'),
	rucksack = require('rucksack-css'),
	// 整個sass資料夾import
	bulkSass = require('gulp-sass-bulk-import'),
	// markdown
	markdown = require('gulp-markdown'),
	// 偵錯工具
	plumber = require('gulp-plumber'),
	notify = require("gulp-notify"),
	sourcemaps = require('gulp-sourcemaps'),
	// webServer
	webServer = require('gulp-webserver');

// 路徑
var srcJade = 'template/**/*.jade',
	endJade = 'web/',
	srcSass = ['assets/sass/**/*.sass', 'assets/sass/**/*.scss'],
	endSass = 'assets/css/',
	srcJs = 'assets/js/*.js',
	endJs = 'assets/js/min/';
	srcMark = './*.md';
	endMark = './';

// webServer網址
var serverSite = 'admindemacbook-air.local';

// sass編譯css的排列
/*
	nested: 一般css，但尾巴在同一行
	expanded: 完整的css排列
	compact: 每一段變成一行
	compressed: 壓縮成一行
*/
var sassCompile = 'nested';

/*
	task後面帶的"scripts"，是任務名稱。
	scripts的就統一用"scripts"
	css相關的用"style"
	jade用"template"
	圖片用"images"
	壓縮檔案用"compress"
	清理用"clean"
	監聽用"watch"
*/
// jade
gulp.task('template', function(){
	return gulp.src(srcJade)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(endJade))
		.pipe(notify({
			message: 'Jade Compily'
		}));
});

// postCss
gulp.task('styles', function () {
	var processors = [
		lost,
		rucksack({fallbacks: true}),
		autoprefixer({browsers: ['last 2 version']})
	];
	return gulp.src(srcSass)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sourcemaps.init())
		.pipe(bulkSass())
		.pipe(sass({outputStyle: sassCompile}).on('error', sass.logError))
		.pipe(postcss(processors))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(endSass))
		.pipe(notify({
			message: 'Sass Compily'
		}));
});

// 壓縮js檔案
gulp.task('compress', function(){
	// 要匯入的檔案路徑
	return gulp.src(srcJs)
		// 使用偵錯外掛
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		// 使用
		.pipe(uglify())
		// 匯出的檔案路徑
		.pipe(gulp.dest(endJs))
		// 通知
		.pipe(notify({
			message: 'Js Min Success'
		}));
});

// markdown
gulp.task('markdown', function() {
	return gulp.src(srcMark)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(markdown())
		.pipe(gulp.dest(endMark))
		.pipe(notify({
			message: 'Markdown Success'
		}));
});

// 監聽
gulp.task('watch', function(){
	/* 
		要監聽的檔案路徑
		陣列中是使用的任務名稱
		也就是說，任務要先設定好，最後再來監聽
	*/
	gulp.watch(srcJade, ['template']);
	gulp.watch(srcSass, ['styles']);
	gulp.watch(srcJs, ['compress']);
	gulp.watch(srcMark, ['markdown'])
});

// server
gulp.task('webServer', function() {
	gulp.src('./')
		.pipe(webServer({
			host: serverSite,
			fallback: 'index.html',
			livereload: true
		}));
});

// cmd輸入"gulp"時，要執行的task
gulp.task('default', ['webServer', 'template', 'styles', 'markdown', 'compress', 'watch']);