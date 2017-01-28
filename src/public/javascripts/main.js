document.addEventListener("DOMContentLoaded", event => {

});
let creatingEvent = false;
let panLoc = {lat: 64.138705, lng: -21.955501}
let map;
let circle;
let currentEventMarkers = [];
const eventInfoElements = { eventName: document.getElementById('eventName'),
                            eventDescr: document.getElementById('eventDescr'),
                            maxAge: document.getElementById('maxAge'),
                            minAge: document.getElementById('minAge'),
                            startTime: document.getElementById('startTime'),
                            genderRestrict: document.getElementById('genderRestrict')};

const createEventSideBar = document.getElementsByClassName('createEventSideBar')[0];
createEventSideBar.style.display = 'none';
const createEventBtn = document.getElementById('toggle_createEvent_sideBar_btn')
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: panLoc,
    mapTypeId: 'roadmap'
  });
  addCreateEventListener();
  $.ajax({
      'url': 'http://localhost:3000/getAllEvents/2017-04-04',
      'type': 'GET',
      'contentType': 'application/json; charset=utf-8',
      'dateType': 'json',
      'success':  data => {
          addEventsToMap(data);
      }
    });
}

// The parameter events is an array of events.
// The function displays all the events on the map.
function addEventsToMap( events ){
  $.each(events, (key,data) => {
    const eventLoc = {lat: data.lat,
                      lng: data.lgt };
    const marker = new google.maps.Marker({
      position: eventLoc,
      map: map
    });
    marker.addListener('click', () => {
      console.log(data);
      map.panTo(marker.getPosition());
      //Update and show event info bar.
      eventInfoElements.eventName.innerHTML = data.name;
      eventInfoElements.eventDescr.innerHTML = data.description;
      eventInfoElements.maxAge.innerHTML = data.age_max;
      eventInfoElements.minAge.innerHTML = data.age_min;
      eventInfoElements.startTime.innerHTML = data.start_date;
      eventInfoElements.genderRestrict.innerHTML = data.gender_restriction;
    })
    currentEventMarkers.push(marker);
  });
}

function toggleCreateEventBar(){
  if (createEventSideBar.style.display !== 'none') {
    createEventSideBar.style.display = 'none';
    if(circle) circle.setMap(null);
  }
  else {
    createEventSideBar.style.display = 'block';
  }
}
createEventBtn.addEventListener('click', event => {
  toggleCreateEventBar();
  creatingEvent = !creatingEvent;
});

function addCreateEventListener(  ){
    map.addListener('click', event => {
    if(creatingEvent){
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      fillLocationTextBox(latitude, longitude);
      if(circle){
        circle.setMap(null);
      }
      circle = new google.maps.Circle({map: map,
          radius: 20,
          center: event.latLng,
          fillColor: '#777',
          fillOpacity: 0.1,
          strokeColor: '#AA0000',
          strokeOpacity: 0.8,
          strokeWeight: 4,
          draggable: true,    // Dragable
          editable: false      // Resizable
      });
      map.panTo(new google.maps.LatLng(latitude,longitude));
    }
})
    google.maps.event.addListener(map, "mouseup", function(event){
      if(creatingEvent){
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        fillLocationTextBox(latitude, longitude);
      }
    });

    function fillLocationTextBox(lat, lgt){
        var lgtBox = document.getElementById("lgt");
        var latBox = document.getElementById("lat");
        lgtBox.value = lgt;
        latBox.value = lat;
    }
}
