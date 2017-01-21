const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:gusti@localhost:5432/TheEventFinder');

//Create the tables!
function createTables(){
  // Events table created.
  db.none(`CREATE TABLE IF NOT EXISTS event(
            id                  SERIAL PRIMARY KEY,
            age_max             integer,
            age_min             integer,
            creator_id          integer,
            description         varchar(65),
            end_date            timestamp,
            start_date          timestamp,
            gender_restriction  boolean,
            lat                 real,
            lgt                 real,
            name                varChar(32),
            attendees           integer[]
            )`)
  .then( () => {
    console.log("events table created!");
  })
  .catch( (error) => {
    console.log("Failed to create events table!", error)
  })

  // Users table created.
  db.none(`CREATE TABLE IF NOT EXISTS user(
            id                  SERIAL PRIMARY KEY,
            age                 integer,
            name                varchar(65),
            email               varchar(65),
            fb_id               varchar(255),
            gender              varchar(10),
            createdEvents       integer[],
            attendedEvents      integer[]
          )`)
  .then( () => {
    console.log("Users table created!");
  })
  .catch( (error) => {
    console.log("Failed to create Users table!", error)
  })

}

function createUser(uAge, uName, uEmail, uFbId, uGender, uCreatedEvents, uAttendedEvents) {
  db.none(`INSERT INTO user(age, name, email, fb_id, gender, createdEvents, attendedEvents)
           VALUES($1, $2, $3, $4, $5, $6, $7)`,
           [uAge, uName, uEmail, uFbId, uGender, uCreatedEvents, uAttendedEvents]);
}

// Gets all the values from user table and
// returns a promise
function getAllUsers(){
  return db.any(`SELECT * FROM user`, [true]);
}

// should only return one row, if found
function findUserByString(id) {
  return db.one(`SELECT * FROM user WHERE fb_id = $1`, [id]);
}

function findUserIdByString(id) {
  return db.one(`SELECT id FROM user WHERE fb_id = $1`, [id]);
}

// Might be able to do this more efficiently, by serializing param somehow,
// like Spring does it..
function createEvent(ageMax, ageMin, creatorId, descr, endDate, startDate,
                        genderRestrict, lati, long, eventName, eAttendees) {
  db.none(`INSERT INTO event(age_max, age_min, creator_id, description,
            end_date, start_date, gender_restriction, lat, lgt, name, attendees)
           VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
           [ageMax, ageMin, creatorId, descr, endDate, startDate,
            genderRestrict, lati, long, eventName, eAttendees]);
}

function getEvent(eventId) {
  return db.one(`SELECT * FROM event WHERE id = $1`, [eventId]);
}

function deleteEvent(eventId) {
  db.none(`DELETE FROM event WHERE id = $1`, [eventId]);
}

/*
* Not sure if this will work since our format for start_date and end_date is
* probably not the same as the Date() format... Then we can just format the
* current date appropriately and send it as a parameter to the function instead.
*/
function findAllUpcomingAndOngoingEvents() {
  return db.any(`SELECT * FROM event WHERE start_date >= $1
                 OR (start_date > $1 AND end_date < $1)`, [new Date()])
}

module.exports = {
    createTables,
    createUser,
    getAllUsers,
    findOneByString,
    findIdByString,
    createEvent,
    getEvent,
    deleteEvent,
    findAllUpcomingAndOngoingEvents
  };
