var gulp = require(gulp);

module.exports = {
  preBuild: function() {
    console.log('Function to be wrapped as gulp task');
  },
  postBuild: function() {
    console.log('Function to be wrapped as gulp task');
  },
  preWatch: function() {
    console.log('Function to be wrapped as gulp task');
  },
  postWatch: function() {
    console.log('Function to be wrapped as gulp task');
  },
  preDeploy: function() {
    console.log('Function to be wrapped as gulp task');
  },
  postDeploy: function() {
    console.log('Function to be wrapped as gulp task');
  }
};
