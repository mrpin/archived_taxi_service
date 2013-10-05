function initialize()
    {

    var startLatitude = 48.44375;
    var startLongitude = 35.02229;

    var points = [
        new GLatLng(48.44375, 35.02229),
        new GLatLng(48.44721, 35.02308),
        new GLatLng(48.44764, 35.02532)
    ];

    if (GBrowserIsCompatible())
        {
        var map = new GMap2(document.getElementById("map_canvas"));
        map.setCenter(new GLatLng(startLatitude, startLongitude), 16);

        //Запрещает менять масштаб по двойному клику
        map.disableDoubleClickZoom();

            //Запрещает перетаскивание карты
        map.disableDragging();

        // Координаты для брекпоинтов
        for (var i = 0; i < points.length; i++)
            {
            var marker1 = new GMarker(points[i]);
            map.addOverlay(marker1);
            }
//                var point = new GLatLng(startLatitude, startLongitude);
//                var marker = new GMarker(point);
//                map.addOverlay(marker);
        }

    }


