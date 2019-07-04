// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
const isDocker = require('is-docker')();

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular-devkit/build-angular/plugins/karma'),
            require('karma-junit-reporter'),
            require('karma-mocha-reporter')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, 'coverage'), reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        
        reporters: ['progress', 'kjhtml', 'dots', 'junit', 'mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: true,
        customLaunchers: {
            ChromeHeadless: {
                base: 'Chrome',
                flags: isDocker ? [
                    '--headless',
                    '--disable-gpu',
                    // Without a remote debugging port, Google Chrome exits immediately.
                    '--remote-debugging-port=9222',
                    '--no-sandbox',
                ] : [
                    '--headless',
                    '--disable-gpu',
                    // Without a remote debugging port, Google Chrome exits immediately.
                    '--remote-debugging-port=9222',
                ],
            }
        },
        webpack: {node: {fs: 'empty',}},
        captureTimeout: 210000,
        browserDisconnectTolerance: 3,
        browserDisconnectTimeout: 210000,
        browserNoActivityTimeout: 210000,
        mochaReporter: {
            colors: {
                success: 'green',
                info: 'grey',
                warning: 'yellow',
                error: 'red'
            },
            symbols: {
                success: '+',
                info: '#',
                warning: '!',
                error: 'x'
            },
            output: 'full'
        }
    });
    junitReporter = {
        outputFile: 'test-results.xml'
    };
};
