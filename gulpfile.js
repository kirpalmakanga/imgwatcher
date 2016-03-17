/*jshint esversion: 6*/
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();
const strip = require('gulp-strip-comments');

gulp.task('lint', () => {
  return gulp.src('js/*').pipe($.eslint({
    'parserOptions': {
        'ecmaVersion': 6
    },
    'rules':{
        'quotes': [1, 'single'],
        'semi': [1, 'always']
    }
  }))
  .pipe($.eslint.format())
  // Brick on failure to be super strict
  .pipe($.eslint.failOnError());
});

gulp.task('babel', () => {
	return gulp.src([
      'bower_components/es6-promise/es6-promise.js',
      'bower_components/fetch/fetch.js',
      'js/imgwatcher.js'
    ])
    .pipe($.concat('imgwatcher.js'))
    .pipe(strip())
		.pipe($.babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('build', ['babel', 'lint'], () => {
  return gulp.src('dist').pipe($.size({title: 'build', gzip: false}));
});

gulp.task('webserver-dev', ['build'] ,() => {
  return gulp.src('.')
    .pipe($.webserver({
      fallback: 'index.html', // defalt page to serve as root
      open: true
    }));
});

gulp.task('watch', ['build', 'lint'], () => {
  browserSync.init({
    files: ['js/*.js', '*.html'],
    proxy: 'http://localhost/imgwatcher/',
  });
  gulp.watch(['js/*.js', '*.html'], ['build']);
})

gulp.task('default', () => {
  gulp.start('build');
});
