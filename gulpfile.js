var basePath = {
  src: './_src',
  dist: '.',
  tmp: '.tmp',
  demo: './_site',
};
var assetsPath = {
  componentsSrc: basePath.src + '/components',
  stylesSrc: basePath.src + '/scss',
  stylesDist: basePath.dist + '/css',
  stylesDemo: basePath.demo + '/css',
  scriptsSrc: basePath.src + '/js',
  scriptsDist: basePath.dist + '/js',
  scriptsDemo: basePath.demo + '/js',
  imgSrc: basePath.src + '/img',
  imgDist: basePath.dist + '/img',
  imgDemo: basePath.demo + '/img',
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
    del([
      basePath.demo,
      basePath.tmp,
      basePath.dist + '/css',
      basePath.dist + '/img',
      basePath.dist + '/js',
      ],function(err, deletedFiles) {
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
        // '--source=' + path.src,
        // '--destination=' + path.tmp + '/jekyll',
        '--config=_config.yml'
      ], { stdio: 'inherit' })
      .on('close', done);
  });

  gulp.task('html', ['jekyll'], function() {
    return browsersync.reload();
  });


// STYLES =====================================================================
  gulp.task('css', ['scss-lint'], function() {
    return gulp.src( assetsPath.stylesSrc + '/*.scss' )
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer())
      // .pipe(gulp.dest( assetsPath.stylesDist ))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest( assetsPath.stylesDemo ))
  });

  gulp.task('scss-lint', function() {
    return gulp.src([
        assetsPath.stylesSrc + '/**/*.scss',
        assetsPath.componentsSrc + '/**/*.scss',
        '!' + assetsPath.stylesSrc + '/legacy/**/*.scss',
        '!' + assetsPath.stylesSrc + '/drive/layout/_drv-grid.scss'
      ])
      .pipe(cache('scsslint'))
      .pipe(scsslint({
        'config': 'scss-lint.yml',
      }));
  });





// SCRIPTS ====================================================================
  gulp.task('js', function() {
    return gulp.src([
      assetsPath.scriptsSrc + '/BusEvents.js',
      assetsPath.scriptsSrc + '/JQueryBusEvents.js',
      assetsPath.scriptsSrc + '/mediator.js',
      assetsPath.scriptsSrc + '/helpers.js',
      assetsPath.componentsSrc + '/**/*.js'
    ])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(babel())
    .pipe(concat('drive.min.js'))
    .pipe(uglify())
    // .pipe(gulp.dest(assetsPath.scriptsDist))
    .pipe(gulp.dest(assetsPath.scriptsDemo));
  });


// IMAGES =====================================================================
  gulp.task('svg', function() {
    return gulp.src(assetsPath.imgSrc + '/**/*.svg')
    .pipe(svgmin())
    // .pipe(gulp.dest(assetsPath.imgDist))
    .pipe(gulp.dest(assetsPath.imgDemo));
  });


// BROWSER SYNC ===============================================================
  gulp.task('browsersync', function() {
    browsersync({
      server: { baseDir: basePath.demo },
      port: 8000,
      files: [
        assetsPath.stylesDemo + '/*.css',
        assetsPath.scriptsDemo + '/*.js',
      ]
    })
  });

// PUBLISH ====================================================================
  gulp.task('publish-css', function() {
    return gulp.src(basePath.demo + '/css/**/*.css')
      .pipe( gulp.dest( assetsPath.stylesDist ))
  });

  gulp.task('publish-js', function() {
    return gulp.src(basePath.demo + '/js/**/*.js')
      .pipe( gulp.dest( assetsPath.scriptsDist ))
  });

  gulp.task('publish-img', function() {
    return gulp.src(basePath.demo + '/img/*.*')
      .pipe( gulp.dest(assetsPath.imgDist ))
  });

  gulp.task('publish-copy', ['build'], function(callback) {
    runSequence(
      'publish-css',
      'publish-js',
      'publish-img',
    callback);
  });

  gulp.task('publish', function(callback) {
    runSequence(
      'clean',
      'publish-copy',
    callback);
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
    gulp.watch( ['./*.+(html|yml)', '!' + basePath.dist],         ['html'] );
    gulp.watch( basePath.src + '/**/*.+(html|yml)',   ['html'] );
    gulp.watch( assetsPath.stylesSrc + '/**/*.scss',              ['css'] );
    gulp.watch( assetsPath.componentsSrc + '/**/*.scss',          ['css'] );
    gulp.watch( assetsPath.componentsSrc + '/**/*.js',            ['js'] );
    gulp.watch( assetsPath.scriptsSrc + '/*.js',                  ['js'] );
    //gulp.watch( path.src + '/_img/**/*.+(png|jpg)',  ['images'] );
    gulp.watch( assetsPath.imgSrc + '/**/*.svg',                  ['svg'] );
  });


// BUILD ======================================================================
  gulp.task('build', function(callback) {
    runSequence(
      'clean',
      [
        'svg',
        'scss-lint',
        'css',
        'js'
      ],
      'html',
    callback);
  });

  gulp.task('default', function(callback) {
    runSequence(
      'build',
      ['watch'],
      callback);
  });

