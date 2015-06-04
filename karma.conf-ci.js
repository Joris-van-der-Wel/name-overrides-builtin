'use strict';
var fs = require('fs');

module.exports = function(config)
{
        if (fs.existsSync('sauce.json'))
        {
                var sauceConfig = require('./sauce');
                process.env.SAUCE_USERNAME = sauceConfig.username;
                process.env.SAUCE_ACCESS_KEY = sauceConfig.accessKey;

                if (sauceConfig.buildNumber)
                {
                        process.env.BUILD_NUMBER = sauceConfig.buildNumber;
                }
        }

        if (!process.env.SAUCE_USERNAME)
        {
                console.log('Create a sauce.json with the keys "username" and "accessKey".');
                process.exit(1);
        }

        console.log('Build number:',
                process.env.TRAVIS_BUILD_NUMBER ||
                process.env.BUILD_NUMBER ||
                process.env.BUILD_TAG ||
                process.env.CIRCLE_BUILD_NUM
        );

        var launchers = require('./sauce-browsers.js');

        config.set({
                basePath: '',
                frameworks: ['mocha', 'browserify'],

                // stuff to send to the browser
                files: [
                        {pattern: 'lib/*' , watched: true, served: false, included: false},
                        'test/*'
                ],

                preprocessors: {
                        'test/*': [ 'browserify' ]
                },

                browserify: {
                        debug: true
                },

                port: 9876,
                colors: true,
                // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
                logLevel: config.LOG_INFO,


                // possible values: 'dots', 'progress'
                reporters: ['progress', 'saucelabs'],

                sauceLabs: {
                        testName: 'name-overrides-builtin karma'
                },
                customLaunchers: launchers,
                browsers: Object.keys(launchers),
                singleRun: true
        });
};
