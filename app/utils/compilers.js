var path = require('path');

var compilers = [{
  name: 'Java',
  compileCommand: 'javac',
  testCommand: 'java',
  userFile: 'Main.java',
  testFile: 'MainTest.java',
  testRunner: 'TestRunner.java',
  dockerImage: 'compile_sandbox_java',
  testRunnerLocation: path.join(__dirname, '../runners/', 'TestRunner.java'),
  javaRunner: path.join(__dirname, '../dockerfiles/java/', 'run.sh'),
},];

module.exports = compilers;
