// project packages
var TestfileSchema = require('../schemas/testfile_schema');

var mongoService = function() {

    var insertTestfile = function(file, callback) {
        var testfile = new TestfileSchema(file);
        testfile.save(function(err, response) {
            if (err) {
                return callback(err, null);
            }
            var r = {
                id: response._id
            };
            return callback(null, r);
        });
    };

    var getTestfileById = function(id, callback) {
        TestfileSchema.find({_id: id}, function(err, testfile) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, testfile);
        });
    };

    return {
        insertTestfile: insertTestfile,
        getTestfileById: getTestfileById
    };
};

module.exports = mongoService();
