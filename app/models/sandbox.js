var Sandbox = function(langID, assID, tempFold, currPath, langName, compComm,
    usFi, teFi, teRu, dockIm, teRuLo, usFiCon, jaRu) {
    this.languageID = langID;
    this.assignmentID = assID;
    this.tempFolder = tempFold;
    this.currentPath = currPath;
    this.languageName = langName;
    this.compileCommand = compComm;
    this.userFile = usFi;
    this.testFile = teFi;
    this.testRunner = teRu;
    this.dockerImage = dockIm;
    this.testRunnerLocation = teRuLo;
    this.userFileContent = new Buffer(usFiCon.toString(), 'base64').toString('ascii');
    this.javaRunner = jaRu;
};

Sandbox.prototype.compile = function(callback) {
    var self = this;

    this.setup(function() {
        self.execute(callback);
        // callback("hello", 20, {});
    });
};

Sandbox.prototype.setup = function(callback) {
    var exec = require('child_process').exec;
    var fs = require('fs');
    var mongoService = require('../services/mongo_service');

    var self = this;

    // hämta från mongo, skriv testfilen till mappen
    // kopiera TestRunner till mappen

    mongoService.getTestfileById(this.assignmentID, function(err, testfile) {
        if (err) {
            console.log(err);
            // kunde inte hitta testfilen, rätt id?
        }
        // console.log('-------\nTESTFILE');
        // console.log(testfile);
        // console.log('-------');
        var rawTestfileContent = new Buffer(testfile[0].code.toString(), 'base64').toString('ascii');
        console.log(self.testRunnerLocation);

        exec(self.getExec(), function(st) {
            fs.writeFile(self.currentPath + self.tempFolder + '/' + self.testFile, rawTestfileContent, function(err) {
                if (err) {
                    console.log(err);
                }
                fs.writeFile(self.currentPath + self.tempFolder + '/' + self.userFile, self.userFileContent, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    exec('cp ' + self.testRunnerLocation + ' ' + self.currentPath + self.tempFolder + '/' + self.testRunner, function(ste) {
                        // exec('cp ' + self.javaRunner + ' ' + self.currentPath + self.tempFolder + '/java_runner.sh', function(ster) {
                        console.log('DONE');
                        callback();
                        // });
                    });
                });
            });
        });

        // console.log('-------\nRAW TESTFILE');
        // console.log(rawTestfileContent);
        // console.log('-------');
    });



    // exec(this.getExec(), function(st) {
    //     fs.writeFile(self.currentPath + self.tempFolder + '/' + self.userFile, self.codeBody, function(err) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             exec('chmod 777 \'' + self.currentPath + self.tempFolder + '/' + self.fileName + '\'');
    //             callback();
    //         }
    //     });
    // });
};

Sandbox.prototype.getExec = function() {
    return 'mkdir ' + this.currentPath + this.tempFolder + '&& chmod 777 ' +
        this.currentPath + this.tempFolder;
};

Sandbox.prototype.execute = function(callback) {
    var exec = require('child_process').exec;
    var fs = require('fs');

    var self = this;

    // var executeStatement = 'docker run -v ' + this.currentPath + this.tempFolder +
    //     ':/' + this.tempFolder + ' --name ' + this.tempFolder + ' -e compiler=' +
    //     this.compilerCommand + ' -e file=./' + this.tempFolder + '/' + this.fileName +
    //     ' -e output=./' + this.tempFolder + '/output.txt ' + this.dockerImage;

    var executeStatement = 'docker run -v ' + this.currentPath + this.tempFolder +
        ':/' + this.tempFolder + ' --name ' + this.tempFolder + ' -e testfile=' +
        this.testFile + ' -e javafile=' + this.userFile + ' -e testrunner=' + this.testRunner +
        ' -e tempfolder=' + this.tempFolder + ' -e output=./output.txt' +
        ' -e go=TestRunner ' + this.dockerImage;

    console.log(executeStatement);

    exec(executeStatement, function(error, stdout, stderr) {
        console.log('ERROR');
        console.log('-------------');
        console.log(error);
        console.log('-------------');

        console.log('STDERR');
        console.log('-------------');
        console.log(stderr);
        console.log('-------------');
    });

    var intervalId = setInterval(function() {

        fs.readFile(self.currentPath + self.tempFolder + '/output.txt', 'utf8', function(err, data) {
            if (err) {
                return;
            } else {
                callback(data);
                clearInterval(intervalId);
                exec('rm -rf ' + self.tempFolder);
                exec('docker rm -v ' + self.tempFolder);
            }
        });

    }, 2000);
};

module.exports = Sandbox;
