const eventServ = require('./services/eventService');


function saveEvent( eventInfo ){
    // Add make the creator attend the event.
    let attendees = [eventInfo.creatorId];

    eventServ.createEvent(eventInfo.ageMax, eventInfo.ageMin, eventInfo.creatorId, eventInfo.descr,
                          eventInfo.endDate, eventInfo.startDate, eventInfo.genderRestrict,
                          eventInfo.lati, eventInfo.long, eventInfo.eventName, attendees);
}

function getAllEvents( maxDate ) {
  if(!maxDate){
    maxDate = '2020.01.01';
  }
  return eventServ.findAllUpcomingAndOngoingEvents( maxDate );
}


module.exports = {
    saveEvent,
    getAllEvents,
  };
