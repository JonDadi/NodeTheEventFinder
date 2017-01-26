const userServ = require('./services/userService');


function findUserIdByString( fbId ){
  return userServ.findUserIdByString( fbId );
}

function saveUser( user ){
  
  userServ.createUser(18, user.displayName, user.email, user.id, 'redda gend', null, null);
}
module.exports = {
    saveUser,
    findUserIdByString,
  };
