module.exports = function (grunt) {
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: {
                    reserved: ['$', 'jQuery', '_']
                },
                compress: true
            },
            build: {
                files: {
                    'dist/js/main.js': 'src/js/main.js',
                    'dist/js/rainWorker.js': 'src/js/rainWorker.js'
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'src/index.html'
                }
            },
        },
        cssmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['css/*'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        copy: {
            dist: {
                files: [
                    { expand: true, src: ['assets/**'], dest: 'dist/' }
                ]
            }
        },
        'gh-pages': {
            options: {
                base: 'dist'
            },
            'gh-pages': {
                src: ['**']
            }
        }
    });

    grunt.registerTask('build', ['uglify', 'htmlmin', 'cssmin', 'copy']);
    grunt.registerTask('deploy', ['uglify', 'htmlmin', 'cssmin', 'copy', 'gh-pages'])
};