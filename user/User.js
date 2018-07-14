var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  fbgpid: { type: String, default: "0" },
  username: String,
  password: String,
  isVip: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
  money: { type: Number, default: 0 },
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
