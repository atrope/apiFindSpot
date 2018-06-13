var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  isVip: { type: Boolean, default: false },
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
