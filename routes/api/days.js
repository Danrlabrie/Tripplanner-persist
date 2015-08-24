var express = require('express');
var router2 = express.Router();
var Day = require('../../models/day');
var Hotel = Day.Hotel;
var Restaurant = Day.Restaurant;
var Activity = Day.Activity;
var Promise = require('bluebird');


/// get alll days


router2.get('/api/days', function(req, res) {
    Day.find()
    .then(function(days) {
        res.json(days)
      });
    })

/// get a specific day

router2.get('/api/days/:id', function(req, res) {
    Day.findById(req.params.id)
    .then(function(days) {
        res.json(day);
    });
});

/// delete a specific day

router2.delete('/api/days/:id', function(req, res) {
    Day.findById(req.params.id)
    .then(function(day) {
       Day.remove(function(err) {
        if (err) return err;
       })
      });
    })

// create a new day

router2.post('/api/days/:id', function(req, res, next) {
     var newday = new Day( {
      number: req.params.id
    })
    newday.save().exec()
    .then(function(){
    res.json(newday);
  }).catch(next);
});

///////////////// create specifics on days ////////////////////


// // create new Hotel on day

// router2.post('/api/days/:id/hotel', function(req, res) {
//    Day.findById(req.params.id)
//     .then(function(day) {
//         res.render('days', {
//         singleday: day
//       });
//     })
// })

// // create new Restaurant on day

// router2.post('/api/days/:id/restaurants', function(req, res) {
//    Day.findById(req.params.id)
//     .then(function(day) {

//         res.render('days', {
//         singleday: day
//       });
//     })
// });

// // create new Activity on day

// router2.post('/api/days/:id/activities', function(req, res) {
//    Day.findById(req.params.id)
//     .then(function(day) {

//         res.render('days', {
//         singleday: day
//       });
//     })
// });

// //////////////////////////////////////////////////////////////

// ////////////////// delete specifics on days /////////////////

router2.use('/api',function (err, req, res, next) {
  if(err) {
    console.log(err);
    res.send(err);
  }
})


module.exports = router2;
