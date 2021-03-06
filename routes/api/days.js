var express = require('express');
var router2 = express.Router();
var Day = require('../../models/day');
var Hotel = Day.Hotel;
var Restaurant = Day.Restaurant;
var Activity = Day.Activity;
var Promise = require('bluebird');

var getid = function(daynum) {
  Day.findOne({ "number": daynum }).exec().then(function (day) {
    return day._id;
  });

}

// get db length (# of days)
var numDays = 0;


Day.find().then(function (days) {
  numDays = days.length;
})  

// get all days --working!

router2.get('/api/days', function(req, res) {
    Day.find()
    .then(function(days) {
        res.json(days)
      });
    })

/// get a specific day --working!
router2.get('/api/days/:id', function(req, res) {
    var id = getid(req.params.id)
    Day.findById(id)
    .then(function(days) {
        res.json(days);
    });
});


/// delete a specific day --working!
router2.delete('/api/days/:id', function(req, res) {
    Day.findOne({ number: Number(req.params.id)}).exec().then(function (day, err) {
    day.remove()
  })
})

// create a new day -- working, increments correctly, handle starting on day1 ????
router2.post('/api/days', function(req, res, next) {
      Day.find()
      .then(function (days) {
      var newday = new Day({
      number: days.length + 1,
      })
      
      return newday
      }).then(function (newz) {
      return newz.save().exec()
      })
    .then(function(){
    res.json(newday);
  }).catch(next);
});

///////////////// create specifics on days ////////////////////


// // create new Hotel on day --working
 
router2.post('/api/days/:id/hotel', function(req, res, next) {

 Day.findOne({
   number: req.params.id
 }).exec(function(err, day) {
   if (err) return err
   day.hotel = req.body.hotelId;
   day.save();
 });
 res.end();
});


// // create new Restaurant on day --working

router2.post('/api/days/:id/restaurants', function(req, res) {
 Day.findOne({
   number: req.params.id
 }).exec(function(err, day) {
   if (err) return err;
   if (day.restaurants) {
     day.restaurants.push(req.body.restaurantId)
   }
   day.save();
 })
 res.end();
});


// // create new Activity on day --working

router2.post('/api/days/:id/activities', function(req, res) {
 Day.findOne({
   number: req.params.id
 }).exec(function(err, day) {
   if (err) return err;
   if (day.activities) {
     day.activities.push(req.body.activitiesId);
   }
   day.save();
 });
 res.end();
});

// //////////////////////////////////////////////////////////////

// ////////////////// delete specifics on days /////////////////


// delete hotel on day --working

router2.delete('/api/days/:id/hotel', function(req, res) {
    console.log("hit hotel delete!")
    Day.findOne({ number: Number(req.params.id)}).exec(function (err, day) {
     if (err) return err;
     var newday = day.toObject()
     day.remove()
     delete newday.hotel;
     replacementday = new Day(newday)
     replacementday.save();
 });
 res.end();
});

// delete restaurant on day

router2.delete('/api/days/:id/restaurants', function(req, res) {
    console.log("hit rest delete!")
    Day.findOne({ number: Number(req.params.id)}).exec(function (err, day) {
     if (err) return err;
      if(day) { 
      day.restaurants.forEach(function (rest) {
      if(rest._id === req.body.restaurantId) restaurants.splice(restaurants.indexOf(rest),1)
     });
     day.save();
   }
 });
 res.end();
});

// delete activity on day

router2.delete('/api/days/:id/activities', function(req, res) {
    console.log("hit rest delete!")
    Day.findOne({ number: Number(req.params.id)}).exec(function (err, day) {
     if (err) return err;
      if(day) { 
      day.restaurants.forEach(function (rest) {
      if(rest._id === req.body.activitiesId) activities.splice(activities.indexOf(rest),1)
     });
     day.save();
   }
 });
 res.end();
});


router2.use('/api',function (err, req, res, next) {
  if(err) {
    console.log(err);
    res.send(err);
  }
})


module.exports = router2;
