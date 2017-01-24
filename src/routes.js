const express = require('express');

const router = express.Router();
const db = require('./dbConnect');
const eventContr = require('./eventController');


/* GET home page. Returns arrivals in English by default */
router.get('/', (req, res, next) => {
  res.render('index');
  db.createTables();
});


router.post('/createEvent', (req, res, next) => {
  const data = req.body;
  let dummyEvent = {'ageMin': data.ageMin,
                    'ageMax': data.ageMax,
                    'creatorId': 1,
                    'descr': data.descr,
                    'endDate': data.endDate,
                    'startDate': data.startDate,
                    'genderRestrict': data.genderRestrict,
                    'lati': data.lati,
                    'long': data.long,
                    'eventName': data.eventName
                    }
  eventContr.saveEvent( dummyEvent );
  res.render('index');
});

router.get('/getAllEvents/:maxDate', (req, res, next) => {
  // How many days in the future do we want to see?

  const maxDate = req.params.maxDate;
  eventContr.getAllEvents(maxDate)
  .then(data => {
    res.json(data);
  })
  .catch(error => {
    console.log(error);
  })
})

module.exports = router;
