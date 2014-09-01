var gulp    = require('gulp');
var coffee  = require('gulp-coffee');
var del     = require('del');
var nodemon = require('gulp-nodemon');

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
  nodemon({ script: 'wnp-cli.js', ext: 'coffee', ignore: ['node_modules/**/*'] })
    .on('change', ['scripts'])
    .on('restart', function() {
      console.log('restarted!');
    });
});
