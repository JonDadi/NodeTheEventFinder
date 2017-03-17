const express = require('express');
const passport = require('passport');
const strategy = require('passport-facebook').Strategy;
const router = express.Router();
const db = require('./dbConnect');
const eventContr = require('./eventController');
const userContr = require('./userController');

passport.use(new strategy({
  clientID: '1173059556143995',
  clientSecret: 'e98236e4c6c585aa2829a3848ffb1a26',
  callbackURL: 'http://localhost:3000/login/facebook/return',
  profileFields: ['id', 'age_range', 'displayName', 'gender', 'emails'],
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

router.get('/', (req, res, next) => {
  if(req.user){
    userContr.findUserIdByString(req.user.id)
    .then( data => {
       if(data.length === 0){
         userContr.saveUser(req.user);
         res.render('index', {user:req.user});
       }
       else{
         console.log("user already exists");
         res.render('index', {user:req.user});
       }
    })
    .catch( error => {
        console.log(error);
    });
  }
  else{
    res.redirect('/login');
  }
});


router.get('/myEvents', (req, res, next) => {
  userContr.findUserIdByString(req.user.id)
  .then( data => {
    eventContr.getEventsCreatedByUser( data[0].id )
    .then( data2 => {
      res.render('myEvents', {events: data2, user: req.user});
    })
    .catch( error => {
      console.log('error fetching events by user ' + error);
    });
  })
  .catch( error => {
    console.log('error fetching user ID ' + error);
  });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/login/facebook/return', passport.authenticate('facebook', {failureRedirect: '/login'}), (req, res, next) => {
   res.redirect('/');
});


router.post('/createEvent', (req, res, next) => {
  const data = req.body;
  const isFromAndroid = data.isAndroid;
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
    console.log(dummyEvent);
    console.log('android:'+isFromAndroid);
    eventContr.saveEvent( dummyEvent );
    if(isFromAndroid === 'true') {
      res.json(true)
    } else {
      res.render('index');
    }

});

router.post('/check', (req, res, next) => {
  const data = req.body;
  const isFromAndroid = data.isAndroid;
  let dummyEvent = {'uid': data.uid,
					'userName': data.userName
                  }
    console.log(dummyEvent);
	console.log(dummyEvent.uid);
    console.log('android:'+isFromAndroid);
	
	
	const user = userContr.findFB_id(dummyEvent.uid);
	user.then(function(result) {
		if(isFromAndroid === 'true') {
			if(result[0].fb_id == dummyEvent.uid) {
				res.json(true);
			} else {
				res.json(false);
			}
		}
	}).catch(function(error) {
		throw new Error('fb_id not exists');
	});
	
});

router.get('/getAttendees/:eventId', (req, res, next) => {
  const eventId = req.params.eventId;
  eventContr.getAttendees( eventId )
  .then(data => {
    let attending = false;
    for(attendee in data){
      if(data[attendee].name === req.user.displayName){
        attending = true;
      }
    }
    res.json({attendees: data,
              isAttending: attending});
  })
  .catch( error => {
    console.log(error);
  });
});

router.get('/attendEvent/:eventId', (req, res, next) => {
  const eventId = req.params.eventId
  userContr.findUserIdByString(req.user.id)
  .then( data => {
    eventContr.attendEvent( data[0].id, eventId );
    res.json('true');
  })
  .catch( error => {
    console.log(error);
    res.json('false');
  })
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
    });
});

router.get('/getEventsFromTo/:from/:to', (req, res, next) => {

  const from = req.params.from;
  const to = req.params.to;

    eventContr.getEventsFromTo(from, to)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
