// SpotController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());
var Spot = require('./Spot');
var User = require('../user/User');


// CREATES A NEW SPOT
router.post('/', (req, res) => {
    if (req.body.lat && req.body.long && req.body.savedBy && req.body.points){
    Spot.find({savedBy:req.params.savedBy}, (err, spots) => {
        spots.forEach((sp)=>sp.remove());
    });
    var expires = (req.body.ttl)? parseInt(req.body.ttl,10):300000;
    let spotcreate = {
      location: {coordinates : [req.body.long,req.body.lat]},
      savedBy:req.body.savedBy,
      points:req.body.points,
      expires : new Date().getTime() + expires
    };
    Spot.create(spotcreate,(err, spot) => {
      console.log(err);
      if (err) return res.status(500).send({"message":"There was a problem creating the spot."});
      res.status(200).send(spot);
    });
  }
    else res.status(400).send({"message":"All fields are required for this endpoint"});
});
// RETURNS ALL THE SPOTS IN THE DATABASE
router.get('/', (req, res) => {
    Spot.find({}, (err, spots) => {
        if (err) return res.status(500).send({"message":"There was a problem finding the spots."});
        res.status(200).send(spots);
    });
});
// GETS A SINGLE SPOT FROM THE DATABASE
router.get('/:id', (req, res) => {
    Spot.findById(req.params.id, (err, spot) => {
        if (err) return res.status(500).send({"message":"There was a problem finding the spot."});
        if (!spot) return res.status(404).send({"message":"No spot found."});
        res.status(200).send(spot);
    });
});

// DELETES A SPOT FROM THE DATABASE
router.delete('/:id', (req, res) => {
    Spot.findById(req.params.id, (err, spot) => { //findByIdAndRemove not fires post middleware
        if (err) return res.status(500).send({"message":"There was a problem deleting the spot."});
        if(!spot) return res.status(404).send({"message":"No spot found."});
        spot.remove();
        res.status(204).send();
    });
});

// UPDATES A SINGLE SPOT IN THE DATABASE
router.put('/:id', (req, res) => {
    if (req.body.lat && req.body.long)
    Spot.findByIdAndUpdate(req.params.id, { location:{ coordinates: [req.body.long,req.body.lat]} }, {new: true}, (err, spot) => {
        if (err) return res.status(500).send({"message":"There was a problem updating the spot."});
        res.status(200).send(spot);
    });
    else res.status(400).send({"message":"All fields are required for this endpoint"});
});




router.post('/search', (req, res) => {
  if (req.body.lat && req.body.long){
    var dist = 1000;
    if (req.body.distance) dist = req.body.distance;
    let loc = { location: { $nearSphere: { $geometry: { type: "Point", coordinates: [req.body.long,req.body.lat] }, $maxDistance: dist } } };
    Spot.find({ $and: [ loc , { takenBy:null } ] },function(err,spots) {
              console.log(err);
              if (err) return res.status(500).send({"message":"There was a problem searching"});
              res.status(200).send(spots);
    });
  }
    else res.status(400).send({"message":"All fields are required for this endpoint"});
});

router.post('/search/:userid', (req, res) => {
  Spot.find({savedBy:req.params.userid}, (err, spots) => {
      if (err) return res.status(500).send({"message":"There was a problem finding the spots."});
      res.status(200).send(spots);
  });
});


router.post('/goingto/:spotid/:userid', (req, res) => {
  Spot.findById(req.params.spotid, (err, spot) => {
    if (!err){
      User.findById(req.params.userid, (err, user) => {
        if (!err){
          User.findById(spot.savedBy, (err, savedUser) => {
            if (!err){
              let json = {spot:spot,taken:user,saved:savedUser};
              io.emit(req.params.spotid,JSON.parse(json));
              res.status(200).send(json);
            }
        })
      }})
    }})
  });

router.put('/park/:spotid/:userid', (req, res) => {
  User.findById(req.params.userid, (err, user) => {
      if (err) return res.status(500).send({"message":"There was a problem finding the User."});
      if (!user) return res.status(404).send({"message":"No user found."});
      else
      Spot.findByIdAndUpdate(req.params.spotid,{ takenBy:user._id}, {new: true}, (err, spot) => {
        if (err) return res.status(500).send({"message":"There was a problem updating the spot."});
        res.status(200).send(spot);
    });
});
});

router.delete('/park/:spotid', (req, res) => {
  Spot.findByIdAndUpdate(req.params.spotid,{ takenBy:null}, {new: true}, (err, spot) => {
        if (err) return res.status(500).send({"message":"There was a problem updating the spot."});
        res.status(200).send(spot);
    });
});




module.exports = router;
