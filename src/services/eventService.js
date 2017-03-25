const db = require('../dbConnect').db;

function createEvent(eventInfo) {
  return db.one(`INSERT INTO events(age_max, age_min, creator_id, description,
            end_date, start_date, gender_restriction, lat, lgt, name)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [eventInfo.ageMax, eventInfo.ageMin, eventInfo.creatorId,
              eventInfo.descr, eventInfo.endDate, eventInfo.startDate,
              eventInfo.genderRestrict, eventInfo.lati, eventInfo.long,
              eventInfo.eventName]);
}

function attendEvent(userId, eventId, isCreator) {
  db.none(`INSERT INTO userAttendingEvent(userId, eventId, isCreator)
           SELECT $1, $2, $3 WHERE
           NOT EXISTS(
             SELECT userId, eventId FROM userAttendingEvent
             WHERE userId = $1 AND eventId = $2
           )`,
           [userId, eventId, isCreator]);
}

function getEvent(eventId) {
  return db.one(`SELECT * FROM events WHERE id = $1`, [eventId]);
}

function deleteEvent(eventId) {
  db.none(`DELETE FROM events WHERE id = $1`, [eventId]);
}

function getEventsAttendedByUser( userId ){
  return db.any(`SELECT *
                 FROM events, (SELECT eventId
                               FROM userAttendingEvent
                               WHERE userid = $1) as u
                 WHERE events.id = u.eventId`, [userId]);
}

function getEventsCreatedByUser( userId ){
  return db.any(`SELECT *
                  FROM events
                  WHERE creator_id = $1`, [userId]);
}

function getAllAttendees( eventId ){
  return db.any(`SELECT users.name, users.id
                 FROM users, (SELECT userid
                              FROM userAttendingEvent
                              WHERE eventid = $1) as u
                 WHERE users.id = u.userid`, [eventId]);
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


function getEventsFromTo( from, to ) {
  return db.any(`SELECT * FROM events WHERE end_date >= $1
                 AND start_date <= $2`, [from, to]);
}

module.exports = {
    createEvent,
    getEvent,
    deleteEvent,
    findAllUpcomingAndOngoingEvents,
    getEventsFromTo,
    attendEvent,
    getEventsCreatedByUser,
    getAllAttendees,
    getEventsAttendedByUser,
  };
