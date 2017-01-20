const express = require('express');

const router = express.Router();
const db = require('./dbConnect');

/* GET home page. Returns arrivals in English by default */
router.get('/', (req, res, next) => {
  res.render('index');
  db.createTables();
});


router.post('/createEvent', (req, res, next) => {

  res.render('index');
});

module.exports = router;
