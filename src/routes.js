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
  const event = {'ageMin': data.ageMin,
                'ageMax': data.ageMax,
                'creatorId': parseInt(data.db_id),
                'descr': data.descr,
                'endDate': data.endDate,
                'startDate': data.startDate,
                'genderRestrict': data.genderRestrict,
                'lati': data.lati,
                'long': data.long,
                'eventName': data.eventName,
                'category': data.category,
                'creatorGender': data.creatorGender
              }
    eventContr.saveEvent( event );
    if(isFromAndroid === 'true') {
      res.json(true)
    } else {
      res.render('index');
    }

});

router.post('/check', (req, res, next) => {
  const data = req.body;
  console.log(data);
  let user = {
    fbid: data.fbid,
		displayName: data.fullName,
    gender: data.gender,
    emails: [
      {value: data.email}
    ],
  }
  console.log("inní /check route");

  // if the user exists we return the user dbID to Android client.
  // if user doesn't exists, we create one in our db and return the user dbID to Android client.
	userContr.findFB_id(user.fbid)
	.then((result) => {
    if (result.length > 0) {
      console.log("User already exists");
      console.log(result[0].id);
      // result[0].id is the id of the user in the db
      res.json(result[0].id);
    } else {
      userContr.saveUser(user)
      .then(data => {
        // data.id is the id of the user in the db
        res.json(data.id);
      })
    }
	}).catch((error) => {
		console.log("Error in routes.js -> userContr.findFB_id(user.id): " + error);
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


// Attending route used by the website
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

// Attending route for android devices.  We might want to merge these two routes later on.
router.post('/attendEvent', (req, res, next) => {
  const data = req.body;
  const eventId = data.eventId;
  const userId = data.userId;
  if( userId && eventId ) {
    eventContr.attendEvent( userId, eventId );
    console.log("user " + userId + " is attending event " + eventId);
  }

});

router.post('/unAttendEvent', (req, res, next) => {
  const data = req.body;
  const eventId = data.eventId;
  const userId = data.userId;
  if( userId && eventId ) {
    eventContr.unAttendEvent( userId, eventId );
    console.log("user " + userId + "unattend " + eventId);
  }
});


router.post('/getFullEventInfo', (req, res, next) => {
  const eventId = parseInt(req.body.eventId);
  // UserId is used to check if user is attending or not.
  const userId = parseInt(req.body.userId);
  eventContr.getEvent( eventId )
  .then( eventData => {
    eventContr.getAttendees( eventId )
    .then( attendeeData => {
      let isAttending = false;
      attendeeData.map( attendee => {
        if( attendee.id === userId) isAttending = true;
      });
      eventData.attendees = attendeeData;
      eventData.isAttending = isAttending;
      res.json(eventData);
    })
    .catch( error  => {
      console.log('Error fetching attendees'+error);
    });
  }).catch( error => {
    console.log('Error fetching event data '+error);
  });
})

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
  const gender_restriction = req.query.gender_restriction;
  let tag = req.query.tag;
  if(tag === 'any') { tag = '%'; }
    eventContr.getEventsFromTo(from, to, gender_restriction, tag)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.log(error);
    });
});

router.post('/getEventsFromToPost', (req, res, next) => {

  const from = req.body.from;
  const to = req.body.to;
  const gender = req.body.gender;
  const tag = req.body.tag;

  let filteredEvents = [];

    eventContr.getEventsFromTo(from, to, tag)
    .then(data => {
      data.map( event => {
        // Add gender restricted events if the creator gender is the same
        // as the gender of user requesting the event
        if(event.gender_restriction && event.creator_gender === gender) {
          filteredEvents.push( event );
        }
        // Add non gender restricted events.
        else if( !event.gender_restriction ){
          filteredEvents.push( event );
        }
      })
      console.log(filteredEvents);
      res.json(filteredEvents);
    })
    .catch(error => {
      console.log(error);
    });
});


router.get('/getHostedEvents/:id', (req, res, next) => {

  const id = parseInt(req.params.id);
    eventContr.getEventsCreatedByUser(id)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.log(error);
    });
});

router.get('/getAttendedEvents/:id', (req, res, next) => {

  const id = parseInt(req.params.id);

    eventContr.getEventsAttendedByUser(id)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.log(error);
    });
});


router.post('/deactivateEvent', (req, res, next) => {
  const eventId = req.body.eventId;
  //const userId = req.body.userId;
  eventContr.deactivateEvent(eventId);
  res.json("deleted");
});
module.exports = router;
