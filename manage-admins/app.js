var mongoose = require('mongoose');
var Admin = require('./admin');

mongoose.connect('mongodb://localhost/sandbox');

var adminEmail = process.env.EMAIL;

if (!adminEmail) {
  console.error('Must provide an email');
  process.exit(1);
}

var newAdmin = new Admin();
newAdmin.email = adminEmail;
newAdmin.courseCode = [];

Admin.findOne({
  email: adminEmail,
}, function(err, admin) {
  if (admin) {
    console.error('Admin already exists');
    process.exit(1);
  }
  newAdmin.save(function(err) {
    if (err) {
      console.error('Problem with saving admin');
      console.error(err);
      process.exit(1);
    }
    console.log('Admin successfully added');
    process.exit(0);
  });
});
