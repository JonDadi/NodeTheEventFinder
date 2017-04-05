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

function getEventsFromTo( from, to, tag) {
  return eventServ.getEventsFromTo( from, to, tag );
}

function getEventsAttendedByUser( userId ) {
  return eventServ.getEventsAttendedByUser( userId );
}

function getAttendees( eventId ){
  return eventServ.getAllAttendees(eventId);
}

function getEventsCreatedByUser( userId ) {
  return eventServ.getEventsCreatedByUser( userId );
}

function attendEvent( userId, eventId ) {
   eventServ.attendEvent( userId, eventId, false);
}

function unAttendEvent( userId, eventId ) {
   eventServ.unAttendEvent( userId, eventId );
}

function getEvent( eventId ) {
  return eventServ.getEvent( eventId );
}

function deactivateEvent( eventId ) {
  eventServ.deactivateEvent( eventId );
}

module.exports = {
    deactivateEvent,
    getEvent,
    saveEvent,
    getAllEvents,
    getEventsFromTo,
    getEventsAttendedByUser,
    getEventsCreatedByUser,
    getAttendees,
    attendEvent,
    unAttendEvent
  };
