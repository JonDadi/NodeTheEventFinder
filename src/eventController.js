const eventServ = require('./services/eventService');


function saveEvent( eventInfo ){
    eventServ.createEvent(eventInfo)
    .then( eventId => {
        eventServ.attendEvent(  eventInfo.creatorId, eventId.id, true);
    })
    .catch( error => {
        console.log('Error creating event'+error);
    });
}

function getAllEvents( maxDate ) {
  if(!maxDate){
    maxDate = '2020.01.01';
  }
  return eventServ.findAllUpcomingAndOngoingEvents( maxDate );
}

function getEventsAttendedByUser( userId ) {
  return eventServ.getEventsAttendedByUser( userId );
}

function getEventsCreatedByUser( userId ) {
  return eventServ.getEventsCreatedByUser( userId );
}

module.exports = {
    saveEvent,
    getAllEvents,
    getEventsAttendedByUser,
    getEventsCreatedByUser
  };
