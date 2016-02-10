// npm packages
var util = require('util');
var stream = require('stream');
var Writable = stream.Writable || require('readable-stream').Writable;

var CustomStream = function(options) {
    this.fileContent = undefined;
    Writable.call(this, options);
};

util.inherits(CustomStream, Writable);

CustomStream.prototype._write = function(chunk, enc, callback) {
    this.fileContent = chunk.toString('base64');
    callback();
};

module.exports = CustomStream;
