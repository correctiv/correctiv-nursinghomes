const gulp = require('gulp');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const riotify = require('riotify');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const streamify = require('gulp-streamify');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const cssmin = require('gulp-cssmin');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const less = require('gulp-less');
const livereload = require('gulp-livereload');
const argv = require('yargs').argv;

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
const dependencies = ['leaflet', 'riot'];

const options = {
  js: {
    src: './correctiv_nursinghomes/javascripts/index.js',
    dest: './correctiv_nursinghomes/static/correctiv_nursinghomes/dist/',
  },
  css: {
    src: './correctiv_nursinghomes/styles/index.less',
    watch: './correctiv_nursinghomes/styles/**/*.less',
    dest: './correctiv_nursinghomes/static/correctiv_nursinghomes/dist/'
  },
  development: false
};

if (argv._ && argv._[0] === 'deploy') {
  options.development = false
} else {
  options.development = true
}

if (options.development) {
  console.log("Building for development")
  delete process.env['NODE_ENV'];
  // Be more verbose for developers
  gulp.onAll(e => {
    console.log(e);
  })
} else {
  console.log("Building for production")
  process.env['NODE_ENV'] = 'production';
}

gulp.task('javascript', () => {

  const appBundler = browserify({
    entries: [options.js.src], // Only need initial file, browserify finds the rest
    transform: [babelify, [riotify, {'type': 'babel'}]],
    debug: options.development, // Gives us sourcemapping
    standalone: 'correctiv', // Exports the package as window.correctiv
    cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
  });

  // We set our dependencies as externals on our app bundler when developing
  (options.development ? dependencies : []).forEach(dep => {
    appBundler.external(dep);
  });

  // The rebundle process
  const rebundle = () => {
    const start = Date.now();
    console.log('Building APP bundle');
    return appBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('index.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(rename('bundle.js'))
      .pipe(gulp.dest(options.js.dest))
      .pipe(gulpif(options.development, livereload()))
      .pipe(notify(() => {
        console.log(`APP bundle built in ${Date.now() - start}ms`);
      }));
  };

  // Fire up Watchify when developing
  if (options.development) {
    const watcher = watchify(appBundler);
    watcher.on('update', rebundle);
  }

  // We create a separate bundle for our dependencies as they
  // should not rebundle on file changes. This only happens when
  // we develop. When deploying the dependencies will be included
  // in the application bundle
  if (options.development) {

    const vendorsBundler = browserify({
      debug: true,
      require: dependencies
    });

    // Run the vendor bundle
    const start = new Date();
    console.log('Building VENDOR bundle');
    vendorsBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('vendor.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.js.dest))
      .pipe(notify(() => {
        console.log(`VENDOR bundle built in ${Date.now() - start}ms`);
      }));
  }

  return rebundle();
});

gulp.task('css', () => {

  const lessOpts = {
    relativeUrls: true,
  };

  if (options.development) {
    const run = () => {
      const start = Date.now();
      console.log('Building CSS bundle');
      return gulp.src(options.css.src)
        .pipe(concat('index.less'))
        .pipe(less(lessOpts))
        .pipe(rename('bundle.css'))
        .pipe(gulp.dest(options.css.dest))
        .pipe(gulpif(options.development, livereload({reloadPage: options.css.dest})))
        .pipe(notify(() => {
          console.log(`CSS bundle built in ${Date.now() - start}ms`);
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
});

gulp.task('rebuild', ['css', 'javascript'])

gulp.task('deploy', ['rebuild']);

gulp.task('default', ['rebuild'], done => {
  livereload.listen();
  done();
});

