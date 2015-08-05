var path = {
    src: 'src',
    dist: 'demo',
    tmp: '.tmp',
    stylesSrc: 'src/_scss',
    zeus: 'zeus'
};

var gulp = require('gulp'),
    browsersync = require('browser-sync'),
    beep = require('beepbeep'),
    colors = require('colors'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    //merge       = require('merge-stream'),
    del = require('del'),
    //changed     = require('gulp-changed'),
    cp = require('child_process'),
    runSequence = require('run-sequence'),
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
    gulp.task('css', function() {
        return gulp.src( path.src + '/_scss/*.scss' )
            .pipe(plumber({
                errorHandler: onError
            }))
            .pipe(sass())
            .pipe(autoprefixer())
            .pipe(gulp.dest( path.dist + '/css' ))
    });


// SCRIPTS ====================================================================
    gulp.task('js', function() {
        return gulp.src([
                path.src + '/_js/BusEvents.js',
                path.src + '/_js/JQueryBusEvents.js',
                path.src + '/_js/mediator.js',
                path.src + '/_includes/**/*.js'
            ])
            .pipe(concat('drive.min.js'))
            .pipe(babel())
            // .pipe(uglify())
            .pipe(gulp.dest(path.dist + '/js'));
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
        //gulp.watch( path.src + '/_img/**/*.svg',         ['svg'] );
    });


// BUILD ======================================================================
    gulp.task('build', function(callback) {
        runSequence(
            'clean',
            [
                'html',
                //'images',
                //'files',
                //'svg',
                'css',
                //'fonts',
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
