var path = {
  src: './',
  dist: '_demo',
  tmp: '.tmp',
  stylesSrc: './_scss',
  imgSrc: './_img',
  imgDist: '_demo/img',
  zeus: '_zeus'
};

var gulp = require('gulp'),

browsersync = require('browser-sync'),

cp = require('child_process'),
runSequence = require('run-sequence'),
cache = require('gulp-cached'),
plumber = require('gulp-plumber'),

del = require('del'),

beep = require('beepbeep'),
colors = require('colors'),

sass = require('gulp-sass'),
scsslint = require('gulp-scss-lint'),
autoprefixer = require('gulp-autoprefixer'),
sourcemaps = require('gulp-sourcemaps'),

concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
babel = require('gulp-babel'),

svgmin = require('gulp-svgmin'),

yaml = require('gulp-yaml');


// ERROR HANDLER ==============================================================
  var onError = function(err) {
    beep([200, 200]);
    console.log(
      '\n*****************'.bold.gray + ' \\(°□°)/ '.bold.red + '<( ERROR! ) '.bold.blue + '*****************\n\n'.bold.gray +
      String(err) +
      '\n*******************************************************\n'.bold.gray );
    browsersync.notify(String(err), 5000);
    this.emit('end');
  };


// CLEAN ======================================================================
  gulp.task('clean', function(callback) {
    del(
      [ path.tmp, path.dist + '/*' ],
      function(err, deletedFiles) {
        console.log('Files deleted:\n'.bold.green , deletedFiles.join(',\n '));
        callback();
      });
  });


// HTML =======================================================================
  gulp.task('jekyll', function(done) {
    return cp.spawn('bundle',
      [
        'exec',
        'jekyll',
        'build',
        '-q',
        '--source=' + path.src,
        '--destination=' + path.tmp + '/jekyll',
        '--config=_config.yml'
      ], { stdio: 'inherit' })
      .on('close', done);
  });
  gulp.task('copy-html', ['jekyll'], function() {
    return gulp.src( path.tmp + '/jekyll/**/**.*')
      .pipe(gulp.dest( path.dist ));
  });
  gulp.task('html', ['copy-html'], function() {
    return browsersync.reload();
  });


// STYLES =====================================================================
  gulp.task('css', ['scss-lint'], function() {
    return gulp.src( path.src + '/_scss/*.scss' )
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest( path.dist + '/css' ))
  });

  gulp.task('scss-lint', function() {
    return gulp.src([
        path.src + '/_scss/**/*.scss',
        path.src + '/_includes/**/*.scss',
        '!' + path.src + '/_scss/legacy/**/*.scss',
        '!' + path.src + '/_scss/drive/layout/_drv-grid.scss'
      ])
      .pipe(cache('scsslint'))
      .pipe(scsslint({
        'config': 'scss-lint.yml',
      }));
  });


// SCRIPTS ====================================================================
  gulp.task('js', function() {
    return gulp.src([
      path.src + '/_js/BusEvents.js',
      path.src + '/_js/JQueryBusEvents.js',
      path.src + '/_js/mediator.js',
      path.src + '/_js/helpers.js',
      path.src + '/_includes/**/*.js'
    ])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(babel())
    .pipe(concat('drive.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.dist + '/js'));
  });


// IMAGES =====================================================================
  gulp.task('svg', function() {
    return gulp.src(path.imgSrc + '/**/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest(path.imgDist));
  });


// BROWSER SYNC ===============================================================
  gulp.task('browsersync', function() {
    browsersync({
      server: { baseDir: path.dist },
      port: 8000,
      files: [
        path.dist + '/css/*.css',
        path.dist + '/js/*.js',
      ]
    })
  });


// ZEUS  ======================================================================
  gulp.task('zeus-clean', function() {
    del(path.zeus);
  });
  gulp.task('zeus-html', function() {
    return gulp.src([
      path.src + '/_includes/**/*.html',
      '!' + path.src + '/_includes/**/drv-Card.html'

      ])
    .pipe(gulp.dest( path.zeus ))
  });
  gulp.task('zeus-scss', function() {
    return gulp.src(path.src + '/_includes/**/*.scss')
    .pipe(gulp.dest( path.zeus ))
  });
  gulp.task('zeus-json', function() {
    gulp.src(path.src + '/_includes/**/*.yml')
    .pipe(yaml({
      pretty: true
    }))
    .pipe(gulp.dest( path.zeus ))
  });
  gulp.task('zeus', function(callback) {
    runSequence(
      'zeus-clean',
      [
      'zeus-html',
      'zeus-scss',
      'zeus-json'
      ],
      callback);
  });


// WATCH ======================================================================
  gulp.task('watch', ['browsersync'], function() {
    gulp.watch( path.src + '/**/*.+(html|yml)',      ['html'] );
    gulp.watch( path.src + '/_scss/**/*.scss',       ['css'] );
    gulp.watch( path.src + '/_includes/**/*.scss',   ['css'] );
    gulp.watch( path.src + '/_includes/**/*.js',     ['js'] );
    gulp.watch( path.src + '/_js/*.js',              ['js'] );
  //gulp.watch( path.src + '/_img/**/*.+(png|jpg)',  ['images'] );
    gulp.watch( path.src + '/_img/**/*.svg',         ['svg'] );
  });


// BUILD ======================================================================
  gulp.task('build', function(callback) {
    runSequence(
      'clean',
      [
        'html',
        'svg',
        'scss-lint',
        'css',
        'js'
      ],
  callback);
  });

  gulp.task('default', function(callback) {
    runSequence(
      'build',
      ['watch'],
      callback);
  });
