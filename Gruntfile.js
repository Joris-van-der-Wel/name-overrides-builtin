'use strict';

module.exports = function(grunt)
{
        var sauceBrowsers = Object.keys(require('./sauce-browsers.js')).sort();

        var karma = {
                options: {
                        configFile: 'karma.conf-ci.js',
                        singleRun: true
                },
                dev: {
                        configFile: 'karma.conf.js',
                        singleRun: false,
                        browsers: []
                }
        };

        var sauceTasks = [];
        sauceBrowsers.forEach(function(browser)
        {
                karma[browser] = {
                        browsers: [browser]
                };

                sauceTasks.push('karma:' + browser);
        });

        grunt.initConfig({
                pkg: grunt.file.readJSON('package.json'),
                mochaTest: {
                        test: {
                                src: ['test/*.js']
                        }
                },
                karma: karma
        });

        grunt.loadNpmTasks('grunt-karma');
        grunt.loadNpmTasks('grunt-mocha-test');

        grunt.registerTask('test', ['mochaTest:test', 'karma:dev']);
        grunt.registerTask('ci', sauceTasks);

};