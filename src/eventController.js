const eventServ = require('./services/eventService');


function saveEvent( eventInfo ){
    eventServ.createEvent(eventInfo.ageMax, eventInfo.ageMin, eventInfo.creatorId, eventInfo.descr,
                          eventInfo.endDate, eventInfo.startDate, eventInfo.genderRestrict,
                          eventInfo.lati, eventInfo.long, eventInfo.eventName)
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



module.exports = {
    saveEvent,
    getAllEvents,
    getEventsAttendedByUser,
  };
