var gulp    = require('gulp');
var coffee  = require('gulp-coffee');
var del     = require('del');

var paths = {
  scripts: ['src/**/*.coffee']
};

gulp.task('scripts', ['clean'], function() {
  return gulp.src(paths.scripts)
      .pipe(coffee())
      .pipe(gulp.dest('build'));
});

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('serve', function() {
  gulp.watch(paths.scripts, ['scripts']);
});
