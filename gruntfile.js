const sass = require('node-sass');

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            options: {
                implementation: sass,
                sourceMap: true,
            },
            dist: {
                files: [
                    {
                        'public/css/main.css':
                            'public/css/main.scss'
                    },
                    {
                        expand: true,
                        cwd: '',
                        src: ['public/css/blocks/**/*.scss'],
                        dest: '.',
                        ext: '.css',
                    },
                ],
            },
        },
        watch: {
            css: {
                files: 'public/css/**/*.scss',
                tasks: ['sass', 'cssmin'],
            },
            javascripts: {
                files: ['public/js/finderscope/**/*.js'],
                tasks: ['newer:uglify:my_target'],
                options: {
                    options: {
                        spawn: true,
                        livereload: true,
                    },
                },
            },
        },
        uglify: {
            my_target: {
                options: {
                    mangle: false,
                    sourceMap: true,
                    sourceMapName: 'public/js/finderscope/sourcemap.map',
                },
                files: [
                    {
                        expand: true,
                        cwd: 'public/js/finderscope/',
                        src: ['**/*.js', '!*.min.js'],
                        dest: 'public/js/finderscope/',
                        ext: '.min.js',
                    },
                ],
            },
        },
        cssmin: {
            target: {
                files: [
                    {
                        expand: true,
                        cwd: 'public/css',
                        src: ['main.css', 'main.css'],
                        dest: 'public/css',
                        ext: '.css',
                    },
                ],
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');
    grunt.registerTask('default', ['watch']);
};
