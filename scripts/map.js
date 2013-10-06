$(document).ready(onLoad);

function onLoad()
{
    getCurrentLocation();
}


var finishCoords =
{
    latitude: 47.624851,
    longitude: -122.52099
};

//map object
var map = null;
//array of { latitude: longitude: }
var points = [];
//
//for btns to start/stop watching location
var watchId = null;
var prevCoords = null;

//  ===LOCATION===
function getCurrentLocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(onWatchPositionComplete, onWatchPositionError, options);

//            $("#buttonStart").click(onButtonStartClicked);
//            $("#buttonFinish").click(onButtonFinishClicked);

    }
    else
    {
        alert("No geolocation support!");
    }
}

function onWatchPositionComplete(position)
{
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    $("#mylocation").html("Your latitude = " + latitude + ", longitude = " + longitude + " with " + position.coords.accuracy + " meters accuracy");

    var km = computeDistance(position.coords, finishCoords);
    $("#distance").html("Distance = " + km + "km");


//        if (map == null)
//        {
    showMap(position.coords);
    prevCoords = position.coords;


    points = [
        new google.maps.LatLng(latitude, longitude)
    ];


//        }
//        else
//        {
    var meters = computeDistance(position.coords, prevCoords) * 1000;

    if (meters > 5)
    {
//                scrollMapToPosition(position.coords);
        prevCoords = position.coords;
    }
//        }

}

function onWatchPositionError(error)
{
    var errorTypes =
    {
        0: "Unknown error",
        1: "Permission denied by user",
        2: "Position is not available",
        3: "Request timed out"
    };

    var errorMessage = errorTypes[error.code];

    if (error.code == 0 || error.code == 2)
    {
        errorMessage = errorMessage + " " + error.message;
    }

    $("#mylocation").html(errorMessage);
}

var options =
{
    enableHighAccuracy: true,
    maximumAge: 0
};

//  ===BUTTON START===
function onButtonStartClicked()
{

    watchId = navigator.geolocation.watchPosition(onWatchPositionComplete, onWatchPositionError, options);
}


//  ===BUTTON FINISH==
function onButtonFinishClicked()
{
    if (watchId)
    {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

//  ===DISTANCE===
function computeDistance(startCoords, finishCoords)
{
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads = degreesToRadians(startCoords.longitude);

    var finishLatRads = degreesToRadians(finishCoords.latitude);
    var finishLongRads = degreesToRadians(finishCoords.longitude);

    var earthRadius = 6371;
    return Math.acos(Math.sin(startLatRads) * Math.sin(finishLatRads) +
        Math.cos(startLatRads) * Math.cos(finishLatRads) *
            Math.cos(startLongRads - finishLongRads)) * earthRadius;
}

//  ===ADDING MAP===
function showMap(coords)
{
    var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);

    var mapOptions =
    {
        zoom: 15,
        center: googleLatAndLong,
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        draggable: false,
//            scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP     //ROADMAP or SATELLITE or HYBRID

    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

//        var title = "Your location";
    addMarker(map, googleLatAndLong);
}

//  ===ADDING MARKER===

var markerId = 0;
var markers = {};

function addMarker(map, latlong)
{
    var markerOptions =
    {
        position: latlong,
        map: map,
        clickable: false,
        icon: 'assets/markerIcon.png'
        //TODO:remove after test on android
//            icon: 'http://google-maps-icons.googlecode.com/files/factory.png'
    };

    var marker = new google.maps.Marker(markerOptions);
}

//  ===DELETE MARKER===

function removeMarker()
{
//        var marker =
//        marker.setMap(null);
}

//  ===ADDING LINE===

function pathFromPoints(Latitude, Longitude)
{
    var point = new google.maps.LatLng(Latitude, Longitude);
    points.push(point);

    var flightPath = new google.maps.Polyline({
        path: points,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 10
    });

    removeMarker();
    addMarker(map, point);
    map.panTo(point);
    flightPath.setMap(map);
}


$("#buttonTest").click(function test()
{
    var inputLatitude = document.getElementById("startLatitude").value;
    var inputLongitude = document.getElementById("startLongitude").value;

    pathFromPoints(inputLatitude, inputLongitude);
});


//  ===SCROLL CURRENT POSITION TO CENTER===

function scrollMapToPosition(coords)
{
    var latitude = coords.latitude;
    var longitude = coords.longitude;

    var latlong = new google.maps.LatLng(latitude, longitude);

    map.panTo(latlong);

    addMarker(map, latlong);
}

//  ===FUNCTIONS TO HELP===
function degreesToDecimal(degrees, minutes, seconds)
{
    return degrees + (minutes / 60.0) + (seconds / 3600.0);
}

function degreesToRadians(degrees)
{
    return (degrees * Math.PI) / 180;
}







