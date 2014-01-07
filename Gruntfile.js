module.exports = function(grunt) {
  grunt.initConfig({
    mochacli: {
      options: {
        require: ['should'],
        reporter: 'nyan',
        bail: true
      },
      all: ['test/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-bump');
  grunt.registerTask('test', ['mochacli']);
};
