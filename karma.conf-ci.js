'use strict';
var fs = require('fs');

module.exports = function(config)
{
        if (!process.env.SAUCE_USERNAME)
        {
                if (!fs.existsSync('sauce.json'))
                {
                        console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
                        process.exit(1);
                }
                else
                {
                        process.env.SAUCE_USERNAME = require('./sauce').username;
                        process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
                }
        }

        var launchers = {
                'SL_FireFox': {
                        base: 'SauceLabs',
                        browserName: 'firefox'
                },
                'SL_Chrome': {
                        base: 'SauceLabs',
                        browserName: 'chrome'
                },
                'SL_Safari': {
                        base: 'SauceLabs',
                        browserName: 'safari'
                },
                'SL_IE11': {
                        base: 'SauceLabs',
                        browserName: 'internet explorer',
                        version: '11'
                },
                'SL_IE10': {
                        base: 'SauceLabs',
                        browserName: 'internet explorer',
                        version: '10'
                },
                'SL_IE9': {
                        base: 'SauceLabs',
                        browserName: 'internet explorer',
                        version: '9'
                }
        };

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
