$(document).ready(onLoad);

function onLoad()
{

    resize();
    updateLocation({latitude:48.4440896, longitude:35.0224676});

    //register event listener
    $("#buttonStartFinish").click(onButtonClicked);
}


//map object
var map = null;

//marker object
var marker = null;

//for button start/finish
var buttonWasClicked = false;

//coords object
var coordsPrev = null;

//geocoder object
var geocoder;

//options for getCurrentPosition
//var getCurrentPositionOptions =
//{
//    enableHighAccuracy: true,
//    maximumAge: 0
//};

var time = 0;
var cost = 0;
var distanceTotal = 0;
var distanceLastMinute = 0;

var coordsStart = null;

var rateDowntime = 0;               //price for downtime in     $/hour
var rateCity = 0;                  //price for km on city      $/km
var rateDowntimeCitySpeedLimit = 0;     //

var defaultRate =
{
    rate_downtime: 40,
    rate_city: 10
};

setRate(defaultRate);


//  ===LOCATION===
//function initialize()
//{
//    if (navigator.geolocation)
//    {
//        navigator.geolocation.getCurrentPosition(onGetCurrentPositionComplete, onGetCurrentPositionError, getCurrentPositionOptions);
//    }
//    else
//    {
//        alert("No geolocation support!");
//    }
//}

function updateLocation(coords)
{
    assert(coords != null);
    assert(coords.hasOwnProperty("latitude"));
    assert(coords.hasOwnProperty("longitude"));

    var latlong = new google.maps.LatLng(coords.latitude, coords.longitude);

    if (map == null)
    {
        geocoder = new google.maps.Geocoder();

        showMap(coords);
        coordsPrev = latlong;
    }
    else
    {
        if (buttonWasClicked)
        {
            addLine(coordsPrev, latlong);
        }
        scrollMapToPosition(latlong);
        coordsPrev = latlong;
    }
}


//function onGetCurrentPositionComplete(position)
//{
//    var latitude = position.coords.latitude;
//    var longitude = position.coords.longitude;
//
//    //register event listener
//    $("#buttonStartFinish").click(onButtonClicked);
//
//    if (map == null)
//    {
//        geocoder = new google.maps.Geocoder();
//
//        showMap(position.coords);
//        coordsPrev = position.coords;
//    }
//    else
//    {
//        var meters = computeDistance(position.coords, coordsPrev) * 1000;
//
//        if (meters > 5)
//        {
//            if (buttonWasClicked)
//            {
//                addLine(coordsPrev, position.coords);
//            }
//            scrollMapToPosition(position.coords);
//            coordsPrev = position.coords;
//        }
//    }
//
//}

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


function setRate(rateParams)
{
    assert(rateParams != null);
    assert(rateParams.hasOwnProperty("rate_downtime"), "Please add property rate_downtime");
    assert(rateParams.hasOwnProperty("rate_city"), "Please add property rate_city");

    rateDowntime = rateParams["rate_downtime"];
    rateCity = rateParams["rate_city"];

    rateDowntimeCitySpeedLimit = rateDowntime / rateCity;
}


// ===SETTING SIZE OF CONTENT AND MAP

function resize()
{
    var content = $("div.content");
    content.width($(window).width());
    content.height($(window).height());
    $("#map").height($(window).height() - 250);
}

//  ===BUTTON START/FINISH

function onButtonClicked()
{
    if (!buttonWasClicked)
    {
        //save last coords for compute model
        coordsStart = coordsPrev;

        time = 0;
        distanceTotal = 0;
        distanceLastMinute = 0;
        cost = 0;

        updateView();

        setInterval(update, 60 * 1000);

        addMarkerStart(coordsPrev);

        $("#buttonStartFinish").html("<h3><img src='assets/buttonFinishIcon.png' width='27' height='33'>Финиш</h3>");
    }
    else
    {
        addMarkerFinish(coordsPrev);
        $("#buttonStartFinish").html("<h3><img src='assets/buttonStartIcon.png' width='47' height='20'>Старт</h3>");
    }

    buttonWasClicked = !buttonWasClicked;
}

function update()
{
    updateModel();
    updateView();
}

function updateModel()
{
    distanceTotal = computeDistance(coordsStart, coordsPrev);
    time++;

    var speed = distanceTotal - distanceLastMinute;
    if ((speed * 6 / 100) < rateDowntimeCitySpeedLimit)
    {
        cost += speed * rateDowntime;
    }
    else
    {
        cost += speed * rateCity;
    }

    distanceLastMinute = distanceTotal;
}

function updateView()
{
    $("#distance").html(distanceTotal);
    $("#time").html(time);
    $("#cost").html(cost);
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

function addMarkerStart(coords)
{
    var latlongStart = new google.maps.LatLng(coords.latitude, coords.longitude);

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







