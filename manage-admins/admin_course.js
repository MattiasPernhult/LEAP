var mongoose = require('mongoose');
var Admin = require('./admin');

mongoose.connect('mongodb://localhost/sandbox');

var code = process.env.COURSECODE;
var adminEmail = process.env.EMAIL;

if (!code) {
  console.error('Must provide a course code');
  process.exit(1);
}

if (!adminEmail) {
  console.error('Must provide an email');
  process.exit(1);
}

Admin.findOne({
  email: adminEmail,
}, function(err, admin) {
  if (!admin) {
    console.error('Admin doesn\'t exists');
    process.exit(1);
  }
  for (var i = 0; i < admin.courseCodes.length; i++) {
    if (admin.courseCodes[i] === code) {
      console.error('Course code already exists');
      process.exit(1);
    }
  }
  Admin.findOneAndUpdate({
      email: adminEmail,
    }, {
      $push: {
        courseCodes: code,
      },
    },
    function(err, result) {
      if (err) {
        console.error('Problems with adding the course code');
      } else {
        console.log('Course code added for the specified admin');
      }
      process.exit(0);
    });
});
