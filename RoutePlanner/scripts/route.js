$(document).ready(function() {
    var map;
    var start;
    var end;

    var routes;
    var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE4ODYyMzQ1LCJleHAiOjE2MTg5NDg3NDV9.EhTogN_cG8CS2-GSTO6spt1HDz75pvulYZ4Gf7GDkGc';
    $.ajax({
        url: 'https://enigmatic-cove-71059.herokuapp.com/v1/route/',
        type: 'GET',
        headers: {"Authorization": 'Bearer ' + token},
        success: function(res) {
            routes = res.result;
            for (let i = 0; i < routes.length; i++) {
                let name = routes[i].name;
                let mode = routes[i].mode;
                makeRouteBox(name, mode);
            }
        }
    });

    // should be fetched from back end
    var home = { lat: 43.89, lng: -78.86 };
    var weight = 150;

    map = new google.maps.Map(document.getElementById('map'), {
        center: home,
        zoom: 15,
        disableDefaultUI: true,
        mapTypeControlOptions: {
            mapTypeIds: ['style'],
        },
    });
    $.getJSON('styles/map.JSON', function(data) {
        map.mapTypes.set('style', new google.maps.StyledMapType(data));
        map.setMapTypeId('style');
    });

    start = new google.maps.Marker({
        position: home,
        map: map,
        draggable: true,
        crossOnDrag: true,
    });
    var startInfo = new google.maps.InfoWindow({
        content: '<h1><b>Start</b></h1><br>' +
                '<p>This is the start of the route, it defaults to your home. ' +
                'Click a location on the map to set your destination. After doing so ' +
                'you can drag the path and markers to alter the route.</p>'
    });
    startInfo.open(map, start);

    end = new google.maps.Marker({
        position: null,
        map: map,
        draggable: true,
        crossOnDrag: true,
    });
    var endInfo;
    endInfo = new google.maps.InfoWindow({
        content: '<h1><b>Destination<b></h1>',
    })

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

    var setEnd;
    makeEndListener();

    start.addListener('dragend', function() {
        changeRoute(start, end, dirService, dirRender);
    });

    start.addListener('click', function() {
        startInfo.open(map, start);
    });

    end.addListener('dragend', function() {
        changeRoute(start, end, dirService, dirRender);
    });

    end.addListener('click', function() {
        endInfo.open(map, end);
    });

    $('input[type=radio]').change(function() {
        updateInfo(dirRender.getDirections());
    });

    $('input[type=text]').change(function() {
        updateInfo(dirRender.getDirections());
    });

    dirRender.addListener('directions_changed', function() {
        updateInfo(dirRender.getDirections());
    });

    $('#save').click(function() {
        if (!dirRender.getDirections()) { return; }

        let mode = $('input[name="mode"]:checked').attr('id');
        if (mode == null) { return; }

        let speed = document.getElementById('speed').value;
        if (speed == null) { return; }
        
        let name = document.getElementById('route-name').value;
        if (name == null || name == '') { return; }

        let found = false;
        if (routes != null && routes != []) {
            for (let i = 0; i < routes.length; i++) {
                if (name == routes[i].name) {
                    routes[i].mode = mode;
                    routes[i].speed = speed;
                    found = true;
                }
            } if (found) {
                let routeBoxes = $('#routes .box')
                for (let i = 0; i < routeBoxes.length; i++) {
                    console.log(routeBoxes[i].firstChild.innerHTML, name);
                    if (name === routeBoxes[i].firstChild.innerHTML) {
                        routeBoxes[i].lastChild.setAttribute('src', `svg/${mode}.svg`);
                        break;
                    }
                }
            } else {
                makeRouteBox(name, mode);
            }
        }

        let route = getRouteObj(name, mode);
        // save route to database after stringify
        // get route from database given name
        // push route to routes array
    });

    $('#del').click(function() {

    });

    $('#new').click(function() {
        //deselectBoxes();
        emptyRouteInfo();
        start.setPosition(home);
        startInfo.setContent('<h1><b>Start</b></h1><br>' +
        '<p>This is the start of the route, it defaults to your home. ' +
        'Click a location on the map to set your destination. After doing so ' +
        'you can drag the path and markers to alter the route.</p>');
        end.setPosition(null);
        endInfo.close();
        makeEndListener();
        dirRender.set('directions', null);
        map.panTo(home);
    });

    $('#routes').on('click', '.box', function() {
        let name = this.firstChild.innerHTML;
        for (let i = 0; i < routes.length; i++) {
            if (name === routes[i].name) {
                setRouteInfo(name, routes[i].mode, parseFloat(routes[i].speed));
                clickedNewPath(routes[i].LatLongs);
                break;
            }
        }
    });

    function makeEndListener() {
        setEnd = map.addListener('click', function(e) {
            end.setPosition(e.latLng);
            changeRoute(start, end, dirService, dirRender);
            endInfo.open(map, end);
            startInfo.setContent('<h1><b>Start</b></h1>');
            setEnd.remove();
        });
    }

    $(document).keypress(function(event) {
        if (event.which == '13') {
            event.preventDefault();
        }
    });

    function clickedNewPath(waypoints) {
        if (setEnd) { setEnd.remove(); }
        let stops = [];
        let current;
        for (let i = 0; i < waypoints.length; i++) {
            current = new google.maps.LatLng(waypoints[i].lat, waypoints[i].long);
            stops.push({location: current, stopover: false});
        }
        let origin = stops.shift().location;
        start.setPosition(origin);
        startInfo.setContent('<h1><b>Start</b></h1>');
        let destination = stops.pop().location;
        end.setPosition(destination);
        endInfo.open(map, end);
        let options = {
            origin: origin,
            destination: destination,
            travelMode: 'WALKING',
            waypoints: stops
        }
        dirService.route(options, function(result, status) {
            if (status === 'OK' && result) {
                dirRender.setDirections(result);
            } else {
                alert('An error was caused by rendering the route.');
            }
        });
    }

    function getRouteObj(name, mode) {
        let speed = parseFloat(document.getElementById('speed').value);
        let waypoints = [start.getPosition()];
        wapoints = waypoints.concat(dirRender.getDirections().routes[0].legs[0].via_waypoints);
        waypoints.push(end.getPosition());
        return {
            name: name,
            mode: mode,
            speed: speed,
            LatLongs: waypoints,
        };
    }

    function setRouteInfo(name, mode, speed) {
        document.getElementById('route-name').value = name;
        document.getElementById(mode).checked = true;
        document.getElementById('speed').value = speed;
    }

    function emptyRouteInfo() {
        document.getElementById('route-name').value = 'New Route Name';
        document.getElementById('on-foot').checked = false;
        document.getElementById('bicycle').checked = false;
        document.getElementById('speed').value = '';
        document.getElementById('dist').innerHTML = '0.00 km';
        document.getElementById('duration').innerHTML = '0 minutes and 0 seconds';
        document.getElementById('cals').innerHTML = '0 cals';
    }

    function makeRouteBox(name, mode) {
        let routes = document.getElementById('routes');
        let div = document.createElement('div');
        div.setAttribute('class', 'box');
        let strong = document.createElement('b');
        strong.setAttribute('class', 'route-name');
        strong.appendChild(document.createTextNode(`${name}`));
        div.appendChild(strong);
        let icon = document.createElement('img');
        icon.setAttribute('src', `svg/${mode}.svg`);
        icon.setAttribute('class', `route-icon`);
        div.appendChild(icon);
        routes.appendChild(div);
    }

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
                alert('An error was caused by rendering the route.');
            }
        });
    }

    function updateInfo(route) { 
        if (!route) { return; }

        let distance = getDistance(route);
        document.getElementById('dist').innerHTML = `${distance.toFixed(2)} km`;

        let speed = parseFloat(document.getElementById('speed').value) / 60.0;
        let duration = distance / speed;
        document.getElementById('duration').innerHTML = `${~~duration} minutes and ${~~((duration - ~~duration) * 60)} seconds`;
        
        let calories = getCalories(duration, speed * 60.0);
        document.getElementById('cals').innerHTML = `${Math.round(calories)} cal`;
    }

    function getDistance(route) {
        let distance = 0;
        for (let i = 0; i < route.routes[0].legs.length; i++) {
            distance += route.routes[0].legs[i].distance.value;
        }
        
        return distance / 1000;
    }

    function getCalories(duration, speed) {
        let MET;
        if (document.getElementById('bicycle').checked) { MET = getBikeMET(speed); } 
        else if (document.getElementById('on-foot').checked) { MET = getFootMET(speed); }
        else { return 0; }

        return duration * MET * weight * 0.007935;
    }

    // rough 'metabolic equivalent of task' calculators 
    // linear regression based on data from https://golf.procon.org/met-values-for-800-activities/
    function getBikeMET(speed) {
        return Math.max(0, 0.45 * speed - 0.85);
    } function getFootMET(speed) {
        return Math.max(0, 0.96 * speed + 0.042);
    }
});