// This example creates a 2-pixel-wide red polyline showing
// the path of William Kingsford Smith's first trans-Pacific flight between
// Oakland, CA, and Brisbane, Australia.

var map;
var masPoints;

function initialize()
    {

    var startLatitude = 48.44375;
    var startLongitude = 35.02229;

    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(startLatitude, startLongitude),
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        draggable: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    masPoints = [
        new google.maps.LatLng(startLatitude, startLongitude)
    ];

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    }

function pathFromPoints(Latitude, Longitude)
    {
    var point = new google.maps.LatLng(Latitude, Longitude);
    masPoints.push(point);

    var flightPath = new google.maps.Polyline({
        path: masPoints,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 10
    });
    map.panTo(point);
    flightPath.setMap(map);
    }


function button()
    {
    var inputLatitude = document.getElementById("startLatitude").value;
    var inputLongitude = document.getElementById("startLongitude").value;

    pathFromPoints(inputLatitude, inputLongitude);

//    alert(startLatitude);
    }


google.maps.event.addDomListener(window, 'load', initialize);
