module.exports = function(grunt) {

  // global variables to search/replace in templates
  var tmplVars = grunt.file.readJSON('template-variables.json');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('grunt-aws.json'),

    premailer: {
      main: {
        options: {
          verbose: false,
          baseUrl: 'http://<%= aws.bucket %>/<%= aws.bucketdir %>',
          removeComments: true,
          warnLevel: 'poor'
        },
        files: [{
            expand: true,
            cwd: 'tmp/',
            src: '*.html',
            dest: 'dist/',
            ext: '.html'
        }]
      }
    },

    includereplace: {
      main: {
        options: {
          globals: tmplVars,
          includesDir: 'templates/partials/'
        },
        files: [{
            expand: true,
            cwd: 'templates/',
            src: '*.html',
            dest: 'tmp/',
            ext: '.html'
        }],
      }
    },

    clean: {
      main: ["tmp/*.html", "dist/*.html"]
    },

    aws_s3: {
      options: {
        accessKeyId: '<%= aws.key %>',
        secretAccessKey: '<%= aws.secret %>',
        access: 'public-read',
        region: '<%= aws.region %>',
        debug: false
      },
      main: {
        options: {
          bucket: '<%= aws.bucket %>',

          headers: {
            'Cache-Control': 'max-age=0, public',
            'Expires': new Date(0).toUTCString()
          }
        },
        files: [{
          action: 'upload',
          expand: true,
          cwd: 'templates/gfx',
          src: ['**'],
          dest: '<%= aws.bucketdir %>'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-premailer');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['clean', 'includereplace', 'premailer']);
  grunt.registerTask('upload', ['aws_s3']);
};

