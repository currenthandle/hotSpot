var gulp = require('gulp'),
	gls = require('gulp-live-server')
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	compression = require('compression')

gulp.task('serve', function(){
	var server = gls.new('server.js')
	server.start()
	
//	gulp.watch(['server.js', '/public', '/server'], server.start.bind(server))
})

gulp.task('browserify', function() {
	// Grab the app.js file
	return browserify('./public/js/main.js')
		// bundles it and creates a file called bundle.js
		.bundle()
		.pipe(source('bundle.js'))
		// save it the public/js/ directory
		.pipe(gulp.dest('./public/js/'))
})

gulp.task('watch', function(){
	gulp.watch('public/**/*.js', ['browserify'])
})

gulp.task('default', ['serve', 'watch'])
