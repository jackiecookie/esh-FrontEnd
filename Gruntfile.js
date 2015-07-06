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
          cwd: 'images/original',
          src: ['**/*.{png,jpg,jpeg}'], // 优化 img 目录下所有 png/jpg/jpeg 图片
         dest: 'images/production' // 优化后的图片保存位置，默认覆盖
        }]
      }
    },
    eshsprity: {
      //输出任务
      sprity: {}
    },
    watch: {
      /* 监控icon合并图片,生成less */
      icon: {
        files: ['images/icon/**/*.{png,jpg,jpeg}'],
        options: {
          livereload: true
        },
        tasks: ['eshsprity']
      },
      // 监控图片文件夹压缩图片
      img: {
        files: ['images/original/**/*.{png,jpg,jpeg}'],
        options: {
          livereload: true
        },
        tasks: ['imagemin']
      },
      //less动态编译
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
  grunt.loadNpmTasks('grunt-eshsprity');
  grunt.registerTask('default', ['watch']);

};