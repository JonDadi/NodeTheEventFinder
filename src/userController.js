const userServ = require('./services/userService');


function findUserIdByString( fbId ){
  return userServ.findUserIdByString( fbId );
}

function saveUser( user ){

  userServ.createUser(18, user.displayName, user.emails[0].value, user.id, user.gender);
}
module.exports = {
    saveUser,
    findUserIdByString,
  };
