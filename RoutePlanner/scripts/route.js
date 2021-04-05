$(document).ready(function() {
    var map;
    var start;
    var end;

    // should be fetched from back end
    var home = { lat: 43.89, lng: -78.86 };
    var mode = 'BICYCLING';
    var weight = 150; // pounds

    initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: home,
            zoom: 15,
            disableDefaultUI: true,
        });
        start = new google.maps.Marker({
            position: home,
            map: map,
            draggable: true,
            crossOnDrag: true,
        });
        end = new google.maps.Marker({
            position: null,
            map: map,
            draggable: true,
            crossOnDrag: true,
        });

        const paths = new google.maps.BicyclingLayer();
        paths.setMap(map);

        var dirService = new google.maps.DirectionsService();
        var dirRender = new google.maps.DirectionsRenderer({
            draggable: true,
            map: map,
            markerOptions: {
                visible: false,
            }
        });

        setEnd = map.addListener('click', function(e) {
            end.setPosition(e.latLng);
            changeRoute(start, end, dirService, dirRender);
            setEnd.remove();
        });

        start.addListener('dragend', function() {
            changeRoute(start, end, dirService, dirRender);
        });

        end.addListener('dragend', function() {
            changeRoute(start, end, dirService, dirRender);
        });

        dirRender.addListener('directions_changed', function() {
            updateInfo(dirRender.getDirections());
        });
    };

    function changeRoute(start, end, service, render) {
        let options = {
            origin: start.getPosition(),
            destination: end.getPosition(),
            travelMode: 'WALKING',
        }
        service.route(options, function(result, status) {
            if (status === 'OK' && result) {
                render.setDirections(result);
            } else {
                alert('Rendering the route caused an error.');
            }
        });
    }

    function updateInfo(route, mode) { 
        let distance = getDistance(route);
        document.getElementById('dist').innerHTML = `Distance: ${distance.toFixed(2)} km`;

        let speed = parseFloat(document.getElementById('speed').value) / 60.0;
        let duration = distance / speed;
        document.getElementById('duration').innerHTML = `Duration: ${~~duration} minutes and ${~~((duration - ~~duration) * 60)} seconds`;
        
        let calories = getCalories(mode, duration, speed * 60.0);
        document.getElementById('cals').innerHTML = `Calories: ${Math.round(calories)} cal`;
    }

    function getDistance(route) {
        if (!route) { return; }

        let distance = 0;
        for (let i = 0; i < route.routes[0].legs.length; i++) {
            distance += route.routes[0].legs[i].distance.value;
        }
        
        return distance / 1000;
    }

    function getCalories(mode, duration, speed) {
        let MET;
        if (document.getElementById('bicycle').checked) { MET = getBikeMET(speed); } 
        else if (document.getElementById('on-foot').checked) { MET = getFootMET(speed); }
        else { return 0; }

        return duration * MET  * weight * 0.007935;
    }

    // rough 'metabolic equivalent of task' calculators 
    // linear regression based on data from https://golf.procon.org/met-values-for-800-activities/
    function getBikeMET(speed) {
        return Math.max(0, 0.45 * speed - 0.85);
    } function getFootMET(speed) {
        return Math.max(0, 0.96 * speed + 0.042);
    }
});