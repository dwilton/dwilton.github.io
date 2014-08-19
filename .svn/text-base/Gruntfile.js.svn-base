'use strict';

module.exports = function (grunt) {

  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({

    // Lint JavaScript
    jshint: {
      files: [
        'src/scripts/*.js',
        'src/scripts/**/*.js',
        '!src/scripts/*.min.js',
        '!src/scripts/vendor/**/*.js',
        '!src/scripts/styleguide/*.min.js',
        '!src/scripts/styleguide/vendor/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Complile LESS to CSS
    less: {
      all: {
        files: {
          'src/css/styleguide.css': 'src/less/styleguide/styleguide.less',
          'src/css/reset.css': 'src/less/styles/reset.less',
          'src/css/controls.css': 'src/less/styles/controls.less',
          'src/css/styles.css': 'src/less/styles/Themes/Foxtel/styles.less',
          'src/css/ie.css': 'src/less/styles/Themes/Foxtel/ie.less',
          'src/css/hacks.css': 'src/less/styles/Themes/Foxtel/hacks.less'
        }
      }
    },

    // Minify CSS
    cssmin: {
      all: {
        files: {
          'src/css/styleguide.min.css': [
            'src/css/styleguide.css'
          ],
          'src/css/foxtel.min.css': [
            'src/css/reset.css',
            'src/css/controls.css',
            'src/css/styles.css'],
          'src/css/foxtelIE.min.css': [
            'src/css/ie.css'
          ],
          'src/css/foxtelHacks.min.css': [
            'src/css/hacks.css'
          ]
        }
      }
    },

    // Clean
    clean: {
      dist: ['dist/']
    },

    // Minify / Uglify JavaScript
    uglify: {
      options: {
        mangle: false,
        beautify: {
          beautify: false,
          ascii_only: true,
          quote_keys: true
        }
      },
      all: {
        files: {
          'src/scripts/polyfills.min.js': [
            'src/scripts/vendor/polyfills/*.js'
          ],
          'src/scripts/foxtel.min.js': [
            'src/scripts/vendor/**/*.js',
            '!src/scripts/vendor/polyfills/*.js',
            '!src/scripts/vendor/plugins/date-picker.js',
            'src/scripts/scripts.js'
          ],
          'src/scripts/styleguide/styleguide.min.js': [
            'src/scripts/styleguide/vendor/**/*.js',
            'src/scripts/styleguide/scripts.js'
          ]
        }
      }
    },

    // Copy files
    copy: {
      all: {
        files: [{
          expand: true,
          cwd: 'src',
          src: [
            'index.html',
            'template/*',
            'partials/*',
            'css/*.min.css',
            'img/*',
            'img/**/*',
            'fonts/*',
            'pages/**/*',
            'scripts/*.min.js',
            'scripts/styleguide/*.min.js'
          ],
          dest: 'dist/'
        }]
      }
    },

    // Create Server
    connect: {
      server: {
        options: {
          port: 9001,
          hostname: 'localhost',
          base: 'src',
          livereload: true
        }
      },
      dist: {
        options: {
          port: 9001,
          hostname: 'localhost',
          base: 'dist',
          keepalive: true
        }
      }
    },

    // Watch Files
    watch: {
      html: {
        files: ['src/css/*.css'],
        options: {
          livereload: true
        }
      },
      scripts: {
        files: [
          'src/scripts/*.js',
          'src/scripts/**/*.js',
          '!src/scripts/vendor/**/*.js'
        ],
        tasks: 'jshint'
      },
      less: {
        files: [
          'src/less/*.less',
          'src/less/**/*.less'
        ],
        tasks: 'less'
      }
    },

    // Replace references to non-optimized script / stylesheets
    usemin: {
      html: ['dist/index.html']
    },

  });

  // Default Task
  grunt.registerTask('default', ['jshint', 'less', 'cssmin', 'uglify']);
  grunt.registerTask('server', ['jshint', 'less', 'cssmin', 'uglify', 'connect:server', 'watch']);
  grunt.registerTask('dist', ['jshint', 'less', 'cssmin', 'uglify', 'clean', 'copy', 'usemin', 'connect:dist']);

};