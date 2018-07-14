var mongoose = require('mongoose');
var SpotSchema = new mongoose.Schema({
  location: {
          type: {type: String, default: 'Point'},
          coordinates: {type: [Number], default: [0, 0]}
      },
      expires: { type: Date, default: Date.now() + 300000},
      points: { type: Number, default: 0},
      takenBy: { type: mongoose.Schema.Types.ObjectId,ref: 'User', default:null},
      savedBy: { type: mongoose.Schema.Types.ObjectId,ref: 'User', default:null}
});
mongoose.model('Spot', SpotSchema);


module.exports = mongoose.model('Spot');
