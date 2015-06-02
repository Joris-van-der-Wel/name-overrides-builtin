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

        var launchers = {
                'SL_FireFox37': {
                        base: 'SauceLabs',
                        browserName: 'firefox',
                        version: '37'
                },
                'SL_FireFox31esr': {
                        base: 'SauceLabs',
                        browserName: 'firefox',
                        version: '31'
                },
                'SL_FireFox24esr': {
                        base: 'SauceLabs',
                        browserName: 'firefox',
                        version: '24'
                },
                'SL_Chrome43': {
                        base: 'SauceLabs',
                        browserName: 'chrome',
                        version: '43'
                },
                'SL_Safari5': {
                        base: 'SauceLabs',
                        browserName: 'safari',
                        version: '5'
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
                },
                'SL_Android_Lollipop': {
                        base: 'SauceLabs',
                        browserName: 'android',
                        version: '5.1'
                },
                'SL_Android_KitKat': {
                        base: 'SauceLabs',
                        browserName: 'android',
                        version: '4.4'
                },
                'SL_Android_JellyBean': {
                        base: 'SauceLabs',
                        browserName: 'android',
                        version: '4.3'
                },
                'SL_Android_IceCreamSandwich': {
                        base: 'SauceLabs',
                        browserName: 'android',
                        version: '4.0'
                },
                'SL_iPad8.2': {
                        base: 'SauceLabs',
                        browserName: 'iPad',
                        version: '8.2'
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
