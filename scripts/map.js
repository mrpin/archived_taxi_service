$(document).ready(function ()
{

    var finishCoords =
    {
        latitude: 47.624851,
        longitude: -122.52099

    };

    var map;
    var watchId = null; //for btns to start/stop watching location


//  ===LOCATION===

    function getCurrentLocation()
    {
        if (navigator.geolocation)
        {
//            navigator.geolocation.getCurrentPosition(displayLocation, displayError);
            $("#btn_start").click(watchLocation);
            $("#btn_finish").click(clearWatch);

        }
        else
        {
            alert("No geolocation support!");
        }
    }

    function displayLocation(position)
    {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        $("#mylocation").html("Your latitude = " + latitude + ", longitude = " + longitude + " with " + position.coords.accuracy + " meters accuracy");

        var km = computeDistance(position.coords, finishCoords);
        $("#distance").html("Distance = " + km + "km");

        if (map == null)
        {
            showMap(position.coords);
        }

    }

    function displayError(error)
    {
        var errorTypes =
        {
            0: "Unknown error",
            1: "Permission denied by user",
            2: "Position is not available",
        };

        var errorMessage = errorTypes[error.code];

        if (error.code == 0 || error.code == 2)
        {
            errorMessage = errorMessage + " " + error.message;
        }

        $("#mylocation").html(errorMessage);
    }

//  ===BUTTON START===

    function watchLocation()
    {
        watchId = navigator.geolocation.watchPosition(displayLocation, displayError);
    }

//  ===BUTTON FINISH==

    function clearWatch()
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
        var distance = Math.acos(Math.sin(startLatRads) * Math.sin(finishLatRads) +
            Math.cos(startLatRads) * Math.cos(finishLatRads) *
                Math.cos(startLongRads - finishLongRads)) * earthRadius;

        return distance;
    }

//  ===ADDING MAP===


    function showMap(coords)
    {

        var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);

        var mapOptions =
        {
            zoom: 15,
            center: googleLatAndLong,
            mapTypeId: google.maps.MapTypeId.ROADMAP     //or SATELLITE or HYBRID
        };

        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var title = "Your location";
        addMarker(map, googleLatAndLong, title);
    }

//  ===ADDING MARKER===

    function addMarker(map, latlong, title)
    {
        var markerOptions =
        {
            position: latlong,
            map: map,
            title: title,
            clickable: false
        };

        var marker = new google.maps.Marker(markerOptions);
    }


//  ===FUNCTIONS TO HELP===


    function degreesToDecimal(degrees, minutes, seconds)
    {
        return degrees + (minutes / 60.0) + (seconds / 3600.0);
    }

    function degreesToRadians(degrees)
    {
        var radians = (degrees * Math.PI) / 180;
        return radians;
    }


    getCurrentLocation();
});




