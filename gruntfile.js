/* jshint camelcase: false */
module.exports = function (grunt) {
    var lintFiles = [
        'gruntfile.js',
        'src/**/*.js',
        'tests/**/*.js'
    ];

    grunt.initConfig({
        connect: {
            uses_defaults: {}
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                commitFiles: ['-a'],
                push: false
            }
        },
        jasmine: {
            main: {
                options: {
                    specs: ['tests/spec/Spec*.js'],
                    vendor: [
                        'node_modules/dojo/loader.js',
                        'tests/testBootstrap.js'
                    ],
                    host: 'http://localhost:8000',
                    keepRunner: true
                }
            }
        },
        jshint: {
            files: lintFiles,
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            files: lintFiles,
            options: {
                livereload: true
            },
            tasks: ['jshint', 'jasmine:main:build']
        }
    });

    // Register tasks.
    for (var key in grunt.file.readJSON('package.json').devDependencies) {
        if (key !== 'grunt' && key.indexOf('grunt') === 0) {
            grunt.loadNpmTasks(key);
        }
    }

    // Default task.
    grunt.registerTask('default', [
        'jasmine:main:build',
        'jshint',
        'connect',
        'watch'
    ]);

    grunt.registerTask('travis', [
        'jshint',
        'connect',
        'jasmine:main'
    ]);
};
