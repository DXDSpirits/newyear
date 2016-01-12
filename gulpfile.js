'use strict';


var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var browserify = require('browserify');
var watchify = require('watchify');
var stringify = require('stringify');
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');

var watch = false;


var browserifyBundle = function(b, name) {
    gutil.log('Build scripts: ' + name);
    return b.bundle()
        .on('error', function(err) {
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(source(name + '-built.js'))
        .pipe(gulp.dest('assets/javascripts'));
};


var buildScripts = function(name) {
    var b = browserify({
        cache: {},
        packageCache: {},
        fullPaths: true,
        insertGlobals: true,
        debug: true,
        transform: stringify({
            extensions: ['.tpl'],
            minify: false
        })
    });
    if (watch) {
        b = watchify(b);
        b.on('update', function() {
            browserifyBundle(b, name);
        });
    }
    b.add('assets/javascripts/' + name + '/main.js');
    return browserifyBundle(b, name);
};


var buildAllScripts = function() {
    buildScripts('greeting');
};


gulp.task('scripts-watch', function() {
    watch = true;
    buildAllScripts();
});


gulp.task('scripts', function() {
    buildAllScripts();
});


gulp.task('serve', ['scripts-watch'], function() {
    var app = require('./app');
    var settings = require('./settings/settings');
    var port = process.env.PORT || settings.PORT || 4000;
    var hostname = settings.HOSTNAME || 'localhost';
    app.set('port', port);
    app.set('hostname', hostname);
    var server = app.listen(port, hostname, function() {
        gutil.log('Express server listening on port ' + server.address().port);
    });
});


gulp.task('dev', ['scripts-watch'], function() {
    nodemon({
        script: './bin/www'
    });
});


gulp.task('default', ['scripts']);
