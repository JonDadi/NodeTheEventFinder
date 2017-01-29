const db = require('../dbConnect').db;

function createUser(uAge, uName, uEmail, uFbId, uGender) {
  db.none(`INSERT INTO users(age, name, email, fb_id, gender)
           VALUES($1, $2, $3, $4, $5)`,
           [uAge, uName, uEmail, uFbId, uGender])
  .then(() => {
    console.log("User created");
  })
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

module.exports = {
    createUser,
    getAllUsers,
    findUserByString,
    findUserIdByString
  };
