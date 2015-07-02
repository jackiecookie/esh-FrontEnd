module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
        /* 压缩优化图片大小 */
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: 'images/',
          src: ['**/*.{png,jpg,jpeg}'], // 优化 img 目录下所有 png/jpg/jpeg 图片
          dest: 'img/' // 优化后的图片保存位置，默认覆盖
        }]
      }
    },
    watch: {
      /* 监控文件变化并执行相应任务 */
      img: {
        files: ['images/**/*.{png,jpg,jpeg}'],
        options: {
          livereload: true
        }
      },
      less: {
        files: ['less/**/*.less'],
        options: {
          livereload: false
        },
        tasks: ['less']
      },
      css: {
        options: {
          event: ['changed', 'added'],
          livereload: true
        },
        files: ['css/**/*.css']
      },
      //监控js文件运行jshint任务
      js: {
        options: {
          livereload: true
        },
        files: ['js/**/*.js'],
        tasks: ['jshint']
      },
      //监控html文件
      html: {
        options: {
          livereload: true
        },
        files: ['*.html']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    },
    less: {
      compileCore: {
        options: {
          strictMath: true,
          outputSourceFiles: true
        },
        expand: true,
        cwd: './less/',
        src: ['production/*.less'],
        dest: './css/',
        ext: '.css'
      },
    }
  });
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
 grunt.loadNpmTasks('grunt-contrib-imagemin');

 
  grunt.registerTask('default', ['watch']);

};