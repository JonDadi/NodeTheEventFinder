const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:dadi@localhost:5432/TheEventFinder');

function createUser(uAge, uName, uEmail, uFbId, uGender, uCreatedEvents, uAttendedEvents) {
  db.none(`INSERT INTO users(age, name, email, fb_id, gender, createdEvents, attendedEvents)
           VALUES($1, $2, $3, $4, $5, $6, $7)`,
           [uAge, uName, uEmail, uFbId, uGender, uCreatedEvents, uAttendedEvents]);
}

// Gets all the values from user table and
// returns a promise
function getAllUsers(){
  return db.any(`SELECT * FROM users`, [true]);
}

// should only return one row, if found
function findUserByString(id) {
  return db.one(`SELECT * FROM users WHERE fb_id = $1`, [id]);
}

function findUserIdByString(id) {
  return db.one(`SELECT id FROM users WHERE fb_id = $1`, [id]);
}

module.exports = {
    createUser,
    getAllUsers,
    findUserByString,
    findUserIdByString
  };
