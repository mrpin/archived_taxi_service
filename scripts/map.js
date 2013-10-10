$(document).ready(onLoad);

function onLoad()
{
    resize();
    initialize();
}


//map object
var map = null;

//marker object
var marker = null;

//line object
//var line = null;
var lineId = false;

//coords object
var prevCoords = null;

var geocoder;

//options for getCurrentPosition
var getCurrentPositionOptions =
{
    enableHighAccuracy: true,
    maximumAge: 0
};


//array of { latitude: longitude: }
var i = 0;
var pointsCoords =
    [
        {latitude: 48.44381, longitude: 35.02231},
        {latitude: 48.44361, longitude: 35.02401},
        {latitude: 48.44322, longitude: 35.02507},
        {latitude: 48.44539, longitude: 35.02701},
        {latitude: 48.44792, longitude: 35.02935},
        {latitude: 48.44746, longitude: 35.03157},
        {latitude: 48.4497, longitude: 35.03389},
        {latitude: 48.45193, longitude: 35.03667},
        {latitude: 48.456, longitude: 35.04167},
        {latitude: 48.45847, longitude: 35.04442},
        {latitude: 48.46001, longitude: 35.04631},
        {latitude: 48.46133, longitude: 35.04797},
        {latitude: 48.46251, longitude: 35.04925}
    ];


//  ===LOCATION===
function initialize()
{
//    if (navigator.geolocation)
//    {
//        navigator.geolocation.getCurrentPosition(onGetCurrentPositionComplete, onGetCurrentPositionError, getCurrentPositionOptions);
//    }
    $("#buttonStart").click(onButtonStartClicked);
    $("#buttonFinish").click(onButtonFinishClicked);
//
//    }
//    else
//    {
//        alert("No geolocation support!");
//    }

    geocoder = new google.maps.Geocoder();
    showMap(pointsCoords[i]);
    prevCoords = pointsCoords[0];

    $("#buttonTest").click(function ()
    {
        i++;

        if (i < pointsCoords.length)
        {
            if (lineId)
            {
                addLine(prevCoords, pointsCoords[i]);
            }

            scrollMapToPosition(pointsCoords[i]);
//            reverseGeocoding(pointsCoords[i]);
            prevCoords = pointsCoords[i];
        }
    });
}

//function onGetCurrentPositionComplete(position)
//{
//    var latitude = position.coords.latitude;
//    var longitude = position.coords.longitude;
//
//    $("#mylocation").html("Your latitude = " + latitude + ", longitude = " + longitude + " with " + position.coords.accuracy + " meters accuracy");
//
////    var km = computeDistance(prevCoords, position.coords);
////    $("#distance").html("Distance = " + km + "km");
//
//
//    if (map == null)
//    {
//        showMap(position.coords);
//        prevCoords = position.coords;
//    }
//    else
//    {
//        var meters = computeDistance(position.coords, prevCoords) * 1000;
//
//        if (meters > 5)
//        {
//            scrollMapToPosition(position.coords);
//            prevCoords = position.coords;
//        }
//    }
//
//}
//
//function onGetCurrentPositionError(error)
//{
//    var errorTypes =
//    {
//        0: "Unknown error",
//        1: "Permission denied by user",
//        2: "Position is not available",
//        3: "Request timed out"
//    };
//
//    var errorMessage = errorTypes[error.code];
//
//    if (error.code == 0 || error.code == 2)
//    {
//        errorMessage = errorMessage + " " + error.message;
//    }
//
//    $("#error").html(errorMessage);
//}


// ===SETTING SIZE OF CONTENT AND MAP

function resize()
{
    var content = $("div.content");
    content.width($(window).width());
    content.height($(window).height());
    $("#map").height($(window).height() - 250);
    $("#buttonStart").width($(window).width() / 2 - 1);
    $("#buttonFinish").width($(window).width() / 2 - 1);

}

//  ===BUTTON START===

function onButtonStartClicked()
{
    addMarkerStart(pointsCoords[i]);
    lineId = true;
}


//  ===BUTTON FINISH==

function onButtonFinishClicked()
{
    addMarkerFinish(pointsCoords[i]);
    lineId = false;
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
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP     //ROADMAP or SATELLITE or HYBRID
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    addMarker(googleLatAndLong);
    reverseGeocoding(googleLatAndLong);
}

//  ===ADDING MARKERS===

function addMarker(latlong)
{
    var markerIcon = new google.maps.MarkerImage
        (
            'assets/markerIconWithShadow.png',
            new google.maps.Size(54, 82),
            new google.maps.Point(0, 0),
            new google.maps.Point(26, 72)
        );

    var markerOptions =
    {
        position: latlong,
        map: map,
        clickable: false,
        icon: markerIcon
    };

    marker = new google.maps.Marker(markerOptions);
}

function addMarkerStart(latlong)
{
    var latlongStart = new google.maps.LatLng(latlong.latitude, latlong.longitude);

    var markerIcon = new google.maps.MarkerImage
        (
            'assets/markerIconStart.png',
            new google.maps.Size(11, 11),
            new google.maps.Point(0, 0),
            new google.maps.Point(6, 6)
        );

    var markerOptions =
    {
        position: latlongStart,
        map: map,
        clickable: false,
        icon: markerIcon
    };

    var markerStart = new google.maps.Marker(markerOptions);
}

function addMarkerFinish(latlong)
{
    var latlongFinish = new google.maps.LatLng(latlong.latitude, latlong.longitude);

    var markerIcon = new google.maps.MarkerImage
        (
            'assets/markerIconFinish.png',
            new google.maps.Size(11, 11),
            new google.maps.Point(0, 0),
            new google.maps.Point(6, 6)
        );

    var markerOptions =
    {
        position: latlongFinish,
        map: map,
        clickable: false,
        icon: markerIcon
    };

    var markerFinish = new google.maps.Marker(markerOptions);
}

//  ===ADDING LINE===

function addLine(prevCoords, currentCoords)
{
    var prev = new google.maps.LatLng(prevCoords.latitude, prevCoords.longitude);
    var cur = new google.maps.LatLng(currentCoords.latitude, currentCoords.longitude);

    var lineCoords = [prev, cur];

    var line = new google.maps.Polyline
    ({
        path: lineCoords,
        strokeColor: '#000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    line.setMap(map);
}


//  ===SCROLL CURRENT POSITION TO CENTER===

function scrollMapToPosition(coords)
{
    marker.setMap(null);   //delete previous marker

    var latitude = coords.latitude;
    var longitude = coords.longitude;

    var latlong = new google.maps.LatLng(latitude, longitude);

    map.panTo(latlong);

    addMarker(latlong);
    reverseGeocoding(latlong);
}


//  ===COORDS TO ADRESS

function reverseGeocoding(latlong)
{

//    var latlong = new google.maps.LatLng(coords.latitude, coords.longitude);

    geocoder.geocode(
        {
            'latLng': latlong
        },

        function (results, status)
        {
            if (status == google.maps.GeocoderStatus.OK)
            {
                if (results[0])
                {
                    $("#reverseGeocoding").html("Adress: " + results[0].formatted_address);
                }
                else
                {
                    alert('No results found');
                }
            }
            else
            {
                alert('Geocoder failed due to: ' + status);
            }
        });
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

//  ===FUNCTIONS TO HELP===

function degreesToDecimal(degrees, minutes, seconds)
{
    return degrees + (minutes / 60.0) + (seconds / 3600.0);
}

function degreesToRadians(degrees)
{
    return (degrees * Math.PI) / 180;
}







