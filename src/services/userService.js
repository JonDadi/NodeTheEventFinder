const db = require('../dbConnect').db;

function createUser(uAge, uName, uEmail, uFbId, uGender) {
  return db.one(`INSERT INTO users(age, name, email, fb_id, gender, regDate)
           VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP AT TIME ZONE 'UTC') RETURNING id`,
           [uAge, uName, uEmail, uFbId, uGender]);
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
  return db.any(`SELECT id FROM users WHERE fb_id = $1`, [id]);
}

function findFB_id(uid) {
	return db.any(`SELECT * FROM users WHERE fb_id = $1`, [uid]);
}

module.exports = {
    createUser,
    getAllUsers,
    findUserByString,
    findUserIdByString,
	findFB_id,
  };
