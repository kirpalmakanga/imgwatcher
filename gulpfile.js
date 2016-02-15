const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const babel = require('gulp-babel');
const $ = gulpLoadPlugins();

gulp.task('lint', function() {
  return gulp.src('js/*').pipe($.eslint({
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
	return gulp.src('js/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('build', ['babel'], () => {
  return gulp.src('dist').pipe($.size({title: 'build', gzip: false}));
});

gulp.task('default', () => {
  gulp.start('build');
});