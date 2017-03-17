const userServ = require('./services/userService');


function findUserIdByString( fbId ){
  return userServ.findUserIdByString( fbId );
}

function findFB_id(uid) {
	return userServ.findFB_id(uid);
}

function saveUser( user ){

  userServ.createUser(18, user.displayName, user.emails[0].value, user.id, user.gender);
}
module.exports = {
    saveUser,
    findUserIdByString,
	findFB_id,
  };
