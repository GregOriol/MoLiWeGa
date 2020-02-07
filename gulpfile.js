"use strict";

//////////////////////////////////////////
//
// Requires
//
//////////////////////////////////////////

const gulp = require('gulp');

const jshint		= require('gulp-jshint');
const sass			= require('gulp-ruby-sass');
const sourcemaps	= require('gulp-sourcemaps');
const uglify		= require('gulp-uglify');
const minifyCss		= require('gulp-minify-css');
const rename		= require('gulp-rename');
const merge			= require('merge-stream');

//////////////////////////////////////////
//
// Configuration
//
//////////////////////////////////////////

const distPath = './dist/MoLiWeGa.lrwebengine/';

const sassFiles = new Set();
sassFiles.add('main');

const jsFiles = new Set();
jsFiles.add('main');

//////////////////////////////////////////
//
// Tasks definitions
//
//////////////////////////////////////////

// Creating dist structure

gulp.task('base', [], function() {
	let out = merge();
	let res;

	res = gulp.src('*.*', {read: false})
		.pipe(gulp.dest(distPath));
	out.add(res);

	res = gulp.src('./src/lightroom/*')
		.pipe(gulp.dest(distPath));
	out.add(res);

	res = gulp.src('./src/images/iconicPreview.png')
		.pipe(gulp.dest(distPath));
	out.add(res);

	res = gulp.src('./src/views/*')
		.pipe(gulp.dest(distPath));
	out.add(res);

	return out;
});

// Vendors (from node modules or common)

gulp.task('vendors', [], function() {
	let out = merge();
	let res;

	// Node modules
	res = gulp.src('./node_modules/jquery/dist/jquery.min.*')
		.pipe(gulp.dest(distPath+'./resources/js'));
	out.add(res);

	res = gulp.src('./node_modules/normalize.css/normalize.css')
		.pipe(minifyCss())
		.pipe(rename('normalize.min.css'))
		.pipe(gulp.dest(distPath+'./resources/css'));
	out.add(res);

	res = gulp.src('./node_modules/vegas/dist/vegas.min.js')
		.pipe(gulp.dest(distPath+'./resources/js'));
	out.add(res);

	res = gulp.src('./node_modules/vegas/dist/vegas.min.css')
		.pipe(gulp.dest(distPath+'./resources/css'));
	out.add(res);

	res = gulp.src('./src/fonts/*.{eot,svg,ttf,woff,woff2}')
		.pipe(gulp.dest(distPath+'./resources/fonts'));
	out.add(res);

	res = gulp.src('./node_modules/hammerjs/hammer.min.js')
		.pipe(gulp.dest(distPath+'./resources/js'));
	out.add(res);

	return out;
});

// SASS tasks
for (let sassFile of sassFiles.keys()) {
	gulp.task('sass-'+sassFile, [], function() {
		return sass('./src/scss/'+sassFile+'.scss', {
			sourcemap : true,
			unixNewlines: true,
			style: 'compressed',
			lineNumbers: false,
			debugInfo : false,
			precision : 8
		})
		.on('error', function(err) {
			console.error('Error!', err.message);
		})
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(distPath+'./resources/css'));
	});
}

// JS lint task
gulp.task('js-lint', function() {
	return gulp.src(['./src/js/*.js', '!./src/js/vendor/**/*.js'])
		.pipe(jshint({
			esnext: true
		}))
		.pipe(jshint.reporter('jshint-stylish'));
});

// JS uglify+map tasks
for (let jsFile of jsFiles.keys()) {
	gulp.task('js-'+jsFile, ['js-lint'], function() {
		return gulp.src('./src/js/'+jsFile+'.js')
			.pipe(sourcemaps.init())
			//.pipe(gulp.dest('./www/js/'))
			.pipe(uglify({
			//	mangle: true,
			//	output: {
			// 	comments: 'some'
			// }
			}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(distPath+'./resources/js'));
	});
}

//////////////////////////////////////////
//
// Tasks list preparation
//
//////////////////////////////////////////

let gulpSassTasks = [];
for (let sassFile of sassFiles.keys()) {
	gulpSassTasks.push('sass-' + sassFile);
}

let gulpJsPreTasks = ['js-lint'];
let gulpJsMainTasks = [];
for (let jsFile of jsFiles.keys()) {
	gulpJsMainTasks.push('js-' + jsFile);
}
let gulpJsPostTasks = [];
let gulpJsTasks = [];
gulpJsTasks.push.apply(gulpJsTasks, gulpJsPreTasks);
gulpJsTasks.push.apply(gulpJsTasks, gulpJsMainTasks);
gulpJsTasks.push.apply(gulpJsTasks, gulpJsPostTasks);

let gulpAllTasks = ['base', 'vendors'];
gulpAllTasks.push.apply(gulpAllTasks, gulpSassTasks);
gulpAllTasks.push.apply(gulpAllTasks, gulpJsTasks);

//////////////////////////////////////////
//
// Main tasks
//
//////////////////////////////////////////

gulp.task('default', gulpAllTasks);

gulp.task('watch', ['default'], function() {
	gulp.watch('./src/scss/**/*.scss', gulpSassTasks);
	gulp.watch('./src/js/**/*.js', gulpJsTasks);
    gulp.watch(['./src/fonts/**/*', './src/images/**/*', './src/lightroom/**/*', './src/views/**/*'], gulpAllTasks);
});
