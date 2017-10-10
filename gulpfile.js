var gulp = require('gulp');
var gulpNSP = require('gulp-nsp');
var sonar = require('gulp-sonar');
var argv = require('yargs').argv;


gulp.task('sonar', function () {
  var options = {
    sonar: {
      host: {
        url: 'http://si-jenkins01.dev.setl.io:8081'
      },
      jdbc: {
        url: 'jdbc:mysql://localhost:3306/sonar',
        username: 'sonarqube',
        password: '^JMHGK^7UPva'
      },
      projectKey: (argv.project),
      projectName: (argv.project),
      projectVersion: '1.0.0',
      // comma-delimited string of source directories
      sources: 'src',
      exclusions: '**/node_modules**, **/vendor**, **/gulpfile.*, **/*.conf.*',
      sourceEncoding: 'UTF-8',
      javascript: {
        lcov: {
          reportPath: 'test/sonar_report/lcov.info'
        }
      },
      exec: {
        // All these properties will be send to the child_process.exec method (see: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback )
        // Increase the amount of data allowed on stdout or stderr (if this value is exceeded then the child process is killed, and the gulp-sonar will fail).
        maxBuffer: 1024 * 1024
      }
    }
  };


//If you don't want to stop your gulp flow if some vulnerabilities have been found use the stopOnError option:
  gulp.task('nsp', function (cb) {
    gulpNSP({
      package: __dirname + '/package.json',
      stopOnError: false
    }, cb);
  });


  // gulp source doesn't matter, all files are referenced in options object above
  return gulp.src('thisFileDoesNotExist.js', {read: false})
    .pipe(sonar(options));

});

gulp.task('default', ['sonar']);
