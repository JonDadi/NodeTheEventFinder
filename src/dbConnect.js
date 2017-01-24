const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:gusti@localhost:5432/TheEventFinder');

//Create the tables!
function createTables(){

  // Users table created.
  db.none(`CREATE TABLE IF NOT EXISTS users(
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

  // Events table created.
  db.none(`CREATE TABLE IF NOT EXISTS events(
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


}

module.exports = {
    createTables
  };
