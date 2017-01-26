document.addEventListener("DOMContentLoaded", event => {

});
let creatingEvent = false;
let panLoc = {lat: 64.138705, lng: -21.955501}
let map;
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
}

function toggleCreateEventBar(){
  if (createEventSideBar.style.display !== 'none') {
    createEventSideBar.style.display = 'none';
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
    var radius;
    if(creatingEvent){
      var latitude = event.latLng.lat();
      var longitude = event.latLng.lng();
      fillLocationTextBox(latitude, longitude);
      if(radius) radius.setMap(null);
      radius = new google.maps.Circle({map: map,
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
    else{
      // Clear the old marker.
      console.log('crash?');
      if(radius) radius.setMap(null);
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
