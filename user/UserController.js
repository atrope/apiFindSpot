// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');

router.use(bodyParser.json());
var User = require('./User');
var Spot = require('../spot/Spot');

// CREATES A NEW USER
router.post('/', (req, res) => {
    if (req.body.name && ((req.body.username && req.body.password) || req.body.fbgpid)){
    let payload = {name:req.body.name}
    if (req.body.fbgpid) { payload.fbgpid = req.body.fbgpid; payload.username = req.body.name.replace(" ",""); }
    else { payload.username = req.body.username;  payload.password = passwordHash.generate(req.body.password); }
    if (req.body.picture) payload.picture = req.body.picture;
    User.create(payload,(err, user) => {
      if (err) return res.status(500).send({"message":"There was a problem creating the user."});
      res.status(200).send(user);
    });
    }
    else res.status(400).send({"message":"All fields are required for this endpoint"});
});
// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.status(500).send({"message":"There was a problem finding the users."});
        res.status(200).send(users);
    });
});
// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) return res.status(500).send({"message":"There was a problem finding the user."});
        if (!user) return res.status(404).send({"message":"No user found."});
        res.status(200).send(user);
    });
});

router.get('/:id/spots', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) return res.status(500).send({"message":"There was a problem finding the user."});
        if (!user) return res.status(404).send({"message":"No user found."});
        else Spot.findOne({ takenBy:user._id },function(err,spots) {
            if (err) return res.status(500).send({"message":"There was a problem searching"});
            else if (!spots) res.status(204).send();
            else res.status(200).send(spots);
        });
    });
});

//LOGIN USER
router.post('/login', (req, res) => {
  if (req.body.username && req.body.password)
  User.findOne({username: new RegExp(`^${req.body.username}$`, "i")}
  , function(err, user) {
      if (err) return res.status(500).send({"message":"There was a problem finding the user."});
      if (!user) return res.status(404).send({"message":"No user found."});
      if (!passwordHash.verify(req.body.password, user.password)) return res.status(403).send({"message":"Password doesnt match."});
      res.status(200).send(user);
});
else if (req.body.fbgpid)
User.findOne({fbgpid: req.body.fbgpid}, function(err, user) {
    if (err) return res.status(500).send({"message":"There was a problem finding the user."});
    if (!user) return res.status(404).send({"message":"No user found."});
    res.status(200).send(user);
});
else res.status(400).send({"message":"All fields are required for this endpoint"});

});


// DELETES A USER FROM THE DATABASE
router.delete('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => { //findByIdAndRemove not fires post middleware
        if (err) return res.status(500).send({"message":"There was a problem deleting the user."});
        if(!user) return res.status(404).send({"message":"No user found."});
        user.remove();
        res.status(204).send();
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', (req, res) => {
    if (req.body.password && !passwordHash.isHashed(req.body.password))
      req.body.password = passwordHash.generate(req.body.password);
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
        if (err) return res.status(500).send({"message":"There was a problem updating the user."});
        res.status(200).send(user);
    });
});

//Add points to user
router.put('/points/:id', (req, res) => {
  if (!req.body.points) req.body.points = 1;
  User.findOneAndUpdate({ _id: req.params.id },{ $inc: { "points": req.body.points } } ,    { new: true },
 (err, user) => {
    if (err) return res.status(500).send({"message":"There was a problem updating the user."});
    res.status(200).send(user);

  });
});

//Add money to user
router.put('/points/:id', (req, res) => {
  if (!req.body.money) req.body.money = 1;
  User.findOneAndUpdate({ _id: req.params.id },{ $inc: { "money": req.body.money } } ,    { new: true },
 (err, user) => {
    if (err) return res.status(500).send({"message":"There was a problem updating the user."});
    res.status(200).send(user);

  });
});


// MAKES A SINGLE USER VIP
router.put('/makeVip/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, {isVip:true}, {new: true}, (err, user) => {
        if (err) return res.status(500).send({"message":"There was a problem updating the user."});
        res.status(200).send(user);
    });
});
// REMOVE A SINGLE USER VIP
router.put('/removeVip/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, {isVip:false}, {new: true}, (err, user) => {
        if (err) return res.status(500).send({"message":"There was a problem updating the user."});
        res.status(200).send(user);
    });
});

router.post('/message/:id',(req,res)=>{
  io.emit(req.params.id,req.body);
})
module.exports = router;
