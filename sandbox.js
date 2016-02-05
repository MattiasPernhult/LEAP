var Sandbox = function(cp, tf, di, cc, fn, cb, li, ln) {
    this.currentPath = cp;
    this.tempFolder = tf;
    this.dockerImage = di;
    this.compilerCommand = cc;
    this.fileName = fn;
    this.codeBody = cb;
    this.languageID = li;
    this.languageName = ln;
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

    var self = this;

    exec(this.getExec(), function(st) {
        fs.writeFile(self.currentPath + self.tempFolder + '/' + self.fileName, self.codeBody, function(err) {
            if (err) {
                console.log(err);
            } else {
                exec('chmod 777 \'' + self.currentPath + self.tempFolder + '/' + self.fileName + '\'');
                callback();
            }
        });
    });
};

Sandbox.prototype.getExec = function() {
    return 'mkdir ' + this.currentPath + this.tempFolder + '&& chmod 777 ' +
        this.currentPath + this.tempFolder;
};

Sandbox.prototype.execute = function(callback) {
    var exec = require('child_process').exec;
    var fs = require('fs');

    var self = this;

    var executeStatement = 'docker run -v ' + this.currentPath + this.tempFolder +
        ':/' + this.tempFolder + ' --name ' + this.tempFolder + ' -e compiler=' +
        this.compilerCommand + ' -e file=./' + this.tempFolder + '/' + this.fileName +
        ' -e output=./' + this.tempFolder + '/output.txt ' + this.dockerImage;

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

    }, 1000);
};

module.exports = Sandbox;
