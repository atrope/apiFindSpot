var mongoose = require('mongoose');
var SpotSchema = new mongoose.Schema({
  location: {
          type: {type: String, default: 'Point'},
          coordinates: {type: [Number], default: [0, 0]}
      },
      creationDate: { type: Date, default: Date.now},
      takenBy: { type: mongoose.Schema.Types.ObjectId,ref: 'User', default:null},
      savedBy: { type: mongoose.Schema.Types.ObjectId,ref: 'User', default:null}
});
mongoose.model('Spot', SpotSchema);


module.exports = mongoose.model('Spot');
