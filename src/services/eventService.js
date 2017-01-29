const db = require('../dbConnect').db;

// Might be able to do this more efficiently, by serializing param somehow,
// like Spring does it..
function createEvent(ageMax, ageMin, creatorId, descr, endDate, startDate,
                        genderRestrict, lati, long, eventName, eAttendees) {
  return db.one(`INSERT INTO events(age_max, age_min, creator_id, description,
            end_date, start_date, gender_restriction, lat, lgt, name)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [ageMax, ageMin, creatorId, descr, endDate, startDate,
            genderRestrict, lati, long, eventName]);
}

// Might be able to do this more efficiently, by serializing param somehow,
// like Spring does it..
function attendEvent(userId, eventId, isCreator) {
  db.none(`INSERT INTO userAttendingEvent(userId, eventId, isCreator)
           VALUES($1, $2, $3)`,
           [userId, eventId, isCreator]);
}

function getEvent(eventId) {
  return db.one(`SELECT * FROM events WHERE id = $1`, [eventId]);
}

function deleteEvent(eventId) {
  db.none(`DELETE FROM events WHERE id = $1`, [eventId]);
}

function getEventsAttendedByUser( userId ){
  return db.any(`SELECT * FROM userAttendingEvent, events WHERE
                userAttendingEvent.userId = $1`, [userId]);
}

function getAllEventsByUser( userId ){


}

function getAllAttendees( eventId ){


}

/*
* Not sure if this will work since our format for start_date and end_date is
* probably not the same as the Date() format... Then we can just format the
* current date appropriately and send it as a parameter to the function instead.
*/
function findAllUpcomingAndOngoingEvents( maxDate ) {
  return db.any(`SELECT * FROM events WHERE end_date >= CURRENT_TIMESTAMP
                 AND start_date <= $1`, [maxDate]);
}

module.exports = {
    createEvent,
    getEvent,
    deleteEvent,
    findAllUpcomingAndOngoingEvents,
    attendEvent,
    getAllEventsByUser,
    getAllAttendees,
    getEventsAttendedByUser,
  };
