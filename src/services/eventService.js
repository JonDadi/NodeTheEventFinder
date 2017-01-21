const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:gusti@localhost:5432/TheEventFinder');

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
    createEvent,
    getEvent,
    deleteEvent,
    findAllUpcomingAndOngoingEvents
  };
