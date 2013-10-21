$(document).ready(onLoad);

//map object
var map = null;

//geocoder object
var geocoder;

//markerCurrent object
var markerCurrent = null;

//coords object
var coordsPrev = null;

var isTripStarted = false;

function onLoad()
{
    geocoder = new google.maps.Geocoder();

    var latitudeAcapulko = 25.657943;
    var longitudeAcapulko = -100.200829;

    var googleLatAndLong = new google.maps.LatLng(latitudeAcapulko, longitudeAcapulko);

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

    var mapView = $("#map");

    mapView.width($(window).width());
    mapView.height($(window).height());
}

function startTrip(coords)
{
    assert(coords != null);
    assert(coords.hasOwnProperty("latitude"));
    assert(coords.hasOwnProperty("longitude"));

    assert(!isTripStarted);

    isTripStarted = true;

    //TODO: review
    coordsPrev = latlong;

    //save last coords for compute model

    addMarkerStart(coordsPrev);
}

function stopTrip()
{
    assert(isTripStarted);

    isTripStarted = false;

    //TODO: null values

}

function updateLocation(coords)
{
    assert(coords != null);
    assert(coords.hasOwnProperty("latitude"));
    assert(coords.hasOwnProperty("longitude"));

    if (isTripStarted)
    {
        drawLine(coordsPrev, coords);
    }

    scrollMapTo(coords);
    coordsPrev = coords;
}

// ===SETTING SIZE OF CONTENT AND MAP

//  ===BUTTON START/FINISH

function updateModel()
{
//    distanceTotal = computeDistance(coordsStart, coordsPrev);
//    time++;
//
//    var speed = distanceTotal - distanceLastMinute;
//    if ((speed * 6 / 100) < rateDowntimeCitySpeedLimit)
//    {
//        cost += speed * rateDowntime;
//    }
//    else
//    {
//        cost += speed * rateCity;
//    }
//
//    distanceLastMinute = distanceTotal;
}


//  ===ADDING MARKERS===


function addMarkerStart(coords)
{
    assert(coords != null);
    assert(coords.hasOwnProperty("latitude"));
    assert(coords.hasOwnProperty("longitude"));

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

function addMarkerFinish(coords)
{
    assert(coords != null);
    assert(coords.hasOwnProperty("latitude"));
    assert(coords.hasOwnProperty("longitude"));

    var latlongFinish = new google.maps.LatLng(coords.latitude, coords.longitude);

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

function drawLine(coords0Data, coords1Data)
{
    assert(coords0Data != null);
    assert(coords0Data.hasOwnProperty("latitude"));
    assert(coords0Data.hasOwnProperty("longitude"));

    assert(coords1Data != null);
    assert(coords1Data.hasOwnProperty("latitude"));
    assert(coords1Data.hasOwnProperty("longitude"));

    var coords0 = new google.maps.LatLng(coords0Data.latitude, coords0Data.longitude);
    var coords1 = new google.maps.LatLng(coords1Data.latitude, coords1Data.longitude);

    var lineData = [coords0, coords1];

    var line = new google.maps.Polyline
    ({
        path: lineData,
        strokeColor: '#000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    line.setMap(map);
}


//  ===SCROLL CURRENT POSITION TO CENTER===

function scrollMapTo(coords)
{
    assert(coords != null);
    assert(coords.hasOwnProperty("latitude"));
    assert(coords.hasOwnProperty("longitude"));

    markerCurrent.setMap(null);   //delete previous markerCurrent

    var latlong = new google.maps.LatLng(coords.latitude, coords.longitude);

    map.panTo(latlong);

    //add markerCurrent current
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

    markerCurrent = new google.maps.Marker(markerOptions);
}


//  ===COORDS TO ADRESS

function updateAddress(latlong)
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
//                    $("#reverseGeocoding").html("Adress: " + results[0].formatted_address);
                }
            }
            else
            {
                alert('Geocoder failed due to: ' + status);
            }
        });
}

//  ===DISTANCE===

//function computeDistance(startCoords, finishCoords)
//{
//    var startLatRads = degreesToRadians(startCoords.latitude);
//    var startLongRads = degreesToRadians(startCoords.longitude);
//
//    var finishLatRads = degreesToRadians(finishCoords.latitude);
//    var finishLongRads = degreesToRadians(finishCoords.longitude);
//
//    var earthRadius = 6371;
//    return Math.acos(Math.sin(startLatRads) * Math.sin(finishLatRads) +
//        Math.cos(startLatRads) * Math.cos(finishLatRads) *
//            Math.cos(startLongRads - finishLongRads)) * earthRadius;
//}
//
////  ===FUNCTIONS TO HELP===
//
//function degreesToDecimal(degrees, minutes, seconds)
//{
//    return degrees + (minutes / 60.0) + (seconds / 3600.0);
//}
//
//function degreesToRadians(degrees)
//{
//    return (degrees * Math.PI) / 180;
//}







