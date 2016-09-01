var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var less = require('gulp-less');
var livereload = require('gulp-livereload');

var argv = require('yargs').argv;

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
];

var options = {
  src: './correctiv_nursinghomes/static/correctiv_nursinghomes/js/index.js',
  dest: './correctiv_nursinghomes/static/correctiv_nursinghomes/js/',

  css: {
    src: './correctiv_nursinghomes/static/correctiv_nursinghomes/less/index.less',
    watch: './correctiv_nursinghomes/static/correctiv_nursinghomes/less/**/*.less',
    dest: './correctiv_nursinghomes/static/correctiv_nursinghomes/css/'
  },
  development: false
}

if (argv._ && argv._[0] === 'deploy') {
  options.development = false
} else {
  options.development = true
}

if (options.development) {
  console.log("Building for development")
  delete process.env['NODE_ENV'];
  // Be more verbose for developers
  gulp.onAll(function (e) {
    console.log(e);
  })
} else {
  console.log("Building for production")
  process.env['NODE_ENV'] = 'production';
}

var browserifyTask = function () {

  // Our app bundler
  var appBundler = browserify({
    entries: [options.src], // Only need initial file, browserify finds the rest
    transform: [babelify], // We want to convert JSX to normal javascript
    debug: options.development, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
  });

  // We set our dependencies as externals on our app bundler when developing
  (options.development ? dependencies : []).forEach(function (dep) {
    appBundler.external(dep);
  });

  // The rebundle process
  var rebundle = function () {
    var start = Date.now();
    console.log('Building APP bundle');
    return appBundler.bundle()
        .on('error', gutil.log)
        .pipe(source('index.js'))
        .pipe(gulpif(!options.development, streamify(uglify())))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest(options.dest))
        .pipe(gulpif(options.development, livereload()))
        .pipe(notify(function () {
          console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
        }));
  };

  // Fire up Watchify when developing
  if (options.development) {
    var watcher = watchify(appBundler);
    watcher.on('update', rebundle);
  }

  // We create a separate bundle for our dependencies as they
  // should not rebundle on file changes. This only happens when
  // we develop. When deploying the dependencies will be included
  // in the application bundle
  if (options.development) {

    var vendorsBundler = browserify({
      debug: true,
      require: dependencies
    });

    // Run the vendor bundle
    var start = new Date();
    console.log('Building VENDORS bundle');
    vendorsBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
      }));
  }

  return rebundle();
};
gulp.task('browserify', browserifyTask);

var cssTask = function () {
    var lessOpts = {
      relativeUrls: true,
    };
    if (options.development) {
      var run = function () {
        var start = Date.now();
        console.log('Building CSS bundle');
        return gulp.src(options.css.src)
          .pipe(concat('index.less'))
          .pipe(less(lessOpts))
          .pipe(rename('bundle.css'))
          .pipe(gulp.dest(options.css.dest))
          .pipe(gulpif(options.development, livereload({reloadPage: options.css.dest})))
          .pipe(notify(function () {
            console.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
          }));
      };
      gulp.watch(options.css.watch, run);
      return run();
    } else {
      return gulp.src(options.css.src)
        .pipe(concat('index.less'))
        .pipe(less(lessOpts))
        .pipe(rename('bundle.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(options.css.dest));
    }
};
gulp.task('css', cssTask);

gulp.task('rebuild', ['css', 'browserify'])

gulp.task('deploy', ['rebuild']);

gulp.task('default', ['rebuild'], function (done) {
  livereload.listen();
  done();
});
