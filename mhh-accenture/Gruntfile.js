var LIVERELOAD_PORT = 36999;

var CONNECT_CONFIG = (function () {
    return {
        liveReloadPort: LIVERELOAD_PORT,
        lrSnippet: require('connect-livereload')({port: LIVERELOAD_PORT}),
        proxySnippet: require('grunt-connect-proxy/lib/utils').proxyRequest,
        mountFolder: function (connect, dir) {
            return require('serve-static')(require('path').resolve(dir));
        }
    }
})();

var DIRECTORIES = require('./directories');

var webpackConfig = require('./webpack.config');

module.exports = function (grunt) {
    grunt.file.defaultEncoding = 'utf8';
    var npmConfig = grunt.file.readJSON('package.json');
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: npmConfig,
        dir: DIRECTORIES,
        clean: {
            dist: [DIRECTORIES.dist.root]
        },
        copy: {
            images: {
                files: [
                    {
                        cwd: '<%= dir.src.images.main %>',
                        src: '**',
                        dest:'<%= dir.dist.images %>/',
                        expand: true
                    }
                ]
            },
            fonts: {
                files: [
                    {
                    cwd: '<%= dir.src.less.main %>/components/fonts',
                    src: '**',
                    dest: '<%= dir.dist.fonts %>',
                    expand: true
                    },
                    {
                        cwd: 'node_modules/slick-carousel/slick/fonts',
                        src: '**',
                        dest: '<%= dir.dist.fonts %>',
                        expand: true
                    }
                ]
            },
            css: {
                files:[
                    {
                        cwd: 'node_modules/bootstrap/dist/css/',
                        src: '**',
                        dest:'<%= dir.dist.less %>/',
                        expand: true
                    },
                    {
                        cwd: 'node_modules/slick-carousel/slick/',
                        src: 'ajax-loader.gif',
                        dest:'<%= dir.dist.less %>/',
                        expand: true
                    }
                ]
            }
        },
        pug: {
            build: {
                options: {
                    pretty: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= dir.src.pug.main %>',
                    src: ['**/*.pug', '!{,includes/**/*}', '!node_modules/**'],
                    dest: '<%= dir.dist.root %>/',
                    ext: '.html'
                }]
            }
        },
        less: {
            options: {
                paths: [DIRECTORIES.npm.root]
            },
            build: {
                files: [{
                    expand: "true",
                    cwd: "<%= dir.src.less.main %>",
                    src: ["**/*.less", "!includes/**"],
                    dest: "<%= dir.dist.less %>/",
                    ext: ".css"
                }]
            }
        },
        webpack: {
            build: webpackConfig
        },
        connect: {
            options: {
                port: '9000',
                hostname: 'localhost'
            },
            proxies: [
                {
                    context: '/api',
                    host: 'localhost',
                    port: 7050
                }
            ],
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            CONNECT_CONFIG.lrSnippet,
                            CONNECT_CONFIG.proxySnippet,
                            CONNECT_CONFIG.mountFolder(connect, DIRECTORIES.dist.root)
                        ];
                    }
                }
            }
        },
        watch: {
            options: {
                interval: 1000
            },
            pug: {
                files: ['<%= dir.src.pug.main %>/**/*.pug'],
                tasks: ['pug']
            },
            less: {
                files: ['<%= dir.src.less.main %>/**/*.less'],
                tasks: ['less']
            },
            webpack: {
                files: ['<%= dir.src.javascript.main %>/**/*.js'],
                tasks: ['webpack']
            },
            images: {
                files: ['<%= dir.src.images.main %>/images/{,*/}*.{png,jpg,jpeg,gif}'],
                tasks: ['images']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= dir.dist.root %>/**/*.*'
                ],
                tasks: []
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= dir.dist.less %>/',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= dir.dist.less %>/',
                    ext: '.min.css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('rebuild', [
        'clean',
        'build'
    ]);

    grunt.registerTask('build', [
        'copy:images',
        'copy:fonts',
        'copy:css',
        'less',
        'cssmin',
        'pug',
        'webpack'
    ]);

    grunt.registerTask('build-d', [
        'copy:images',
        'copy:fonts',
        'copy:css',
        'less',
        'pug',
        'webpack'
    ]);

    grunt.registerTask('serve', [
        'build',
        'configureProxies',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('serve-d', [
        'build-d',
        'configureProxies',
        'connect:livereload',
        'watch'
    ]);

};
