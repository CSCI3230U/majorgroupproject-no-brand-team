import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import { TokenStorageService } from '../../services/token-storage.service';

declare const google: any
declare var $: any;
@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
  routeData : any = {};

  constructor(private authService: AuthenticateService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    
    this.authService.routeGet().subscribe(
      data => {
        this.routeData = data.result
      }
    );

    var token = this.tokenStorage.getToken();
    
    ($(document).ready(() => {
      setTimeout(() => {
        var map:any;
        var start:any;
        var end:any;
    
        var routes:any = this.routeData;
        for (let i = 0; i < routes.length; i++) {
            let name = routes[i].name;
            let mode = routes[i].mode;
            makeRouteBox(name, mode);
        }
    
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
        $.getJSON('assets/map.json', function(data: any) {
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
        var endInfo:any;
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
    
        var setEnd:any;
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
    
            let speedElement = document.getElementById('speed')! as HTMLInputElement;
            let speed = speedElement.value;
            if (speed == null) { return; }
            
            let nameElement = document.getElementById('route-name')! as HTMLInputElement;
            let name = nameElement.value;
            if (name == null || name == '') { return; }
    
            let route = getRouteObj(name, mode);
            $.ajax({
                type: 'POST',
                url: 'https://enigmatic-cove-71059.herokuapp.com/v1/route',
                headers: {"Authorization": 'Bearer ' + token},
                data: JSON.stringify(route),
                success: function() {
                    let found = false;
                    if (routes != null && routes != []) {
                        for (let i = 0; i < routes.length; i++) {
                            if (name == routes[i].name) {
                                routes[i].mode = mode;
                                routes[i].speed = speed;
                                found = true;
                            }
                        } 
                        if (found) {
                            let routeBoxes = $('#routes .box');
                            for (let i = 0; i < routeBoxes.length; i++) {
                                console.log(routeBoxes[i].firstChild.innerHTML, name);
                                if (name == routeBoxes[i].firstChild.innerHTML) {
                                    routeBoxes[i].lastChild.setAttribute('src', `svg/${mode}.svg`);
                                    break;
                                }
                            }
                        } else {
                            makeRouteBox(name, mode);
                            $.ajax({
                                url: 'https://enigmatic-cove-71059.herokuapp.com/v1/route/' + name,
                                type: 'GET',
                                headers: {"Authorization": 'Bearer ' + token},
                                success: function(res:any) {
                                    routes.push(res);
                                }
                            });
                        }
                    }
                }
            });
        });
    
        $('#del').click(function() {
            let nameElement = document.getElementById('route-name')! as HTMLInputElement;
            let found = false;
            for (let i = 0; i < routes.length; i++) {
                if (nameElement.value == routes[i].name) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return;
            } else {
                $.ajax({
                    url: 'https://enigmatic-cove-71059.herokuapp.com/v1/route/' + nameElement.value,
                    type: 'DELETE',
                    headers: {"Authorization": 'Bearer ' + token},
                    success: function() {
                        let routeBoxes = $('#routes .box');
                        for (let i = 0; i < routeBoxes.length; i++) {
                            if (nameElement.value == routeBoxes[i].firstChild.innerHTML) {
                                let routesElement = document.getElementById('routes')! as HTMLElement;
                                routesElement.removeChild(routesElement.childNodes[i]);
                                for (let j = 0; j < routes.length; j++) {
                                    if (routes[j].name = nameElement.value) {
                                        routes = routes.splice(j, 1);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                });
            }
        });
    
        $('#new').click(function() {
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
    
        $('#routes').on('click', '.box', function(e:any) {
            let element = $(e.target);
            let name = element.firstChild.innerHTML;
            for (let i = 0; i < routes.length; i++) {
                if (name === routes[i].name) {
                    setRouteInfo(name, routes[i].mode, parseFloat(routes[i].speed));
                    clickedNewPath(routes[i].LatLongs);
                    break;
                }
            }
        });
    
        function makeEndListener() {
            setEnd = map.addListener('click', function(e:any) {
                end.setPosition(e.latLng);
                changeRoute(start, end, dirService, dirRender);
                endInfo.open(map, end);
                startInfo.setContent('<h1><b>Start</b></h1>');
                setEnd.remove();
            });
        }
    
        $(document).keypress(function(event:any) {
            if (event.which == '13') {
                event.preventDefault();
            }
        });
    
        function clickedNewPath(waypoints:any) {
            if (setEnd) { setEnd.remove(); }
            let stops:any = [];
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
            dirService.route(options, function(result:any, status:any) {
                if (status === 'OK' && result) {
                    dirRender.setDirections(result);
                } else {
                    alert('An error was caused by rendering the route.');
                }
            });
        }
    
        function getRouteObj(name:any, mode:any) {
            let speedElement = document.getElementById('speed')! as HTMLInputElement;
            let speed = parseFloat(speedElement.value);
            let waypoints = [start.getPosition()];
            waypoints = waypoints.concat(dirRender.getDirections().routes[0].legs[0].via_waypoints);
            waypoints.push(end.getPosition());
            return {
                name: name,
                mode: mode,
                speed: speed,
                waypoints: waypoints,
            };
        }
    
        function setRouteInfo(name:any, mode:any, speed:any) {
            let nameElement = document.getElementById('route-name')! as HTMLInputElement;
            nameElement.value = name;
            let modeElement = document.getElementById(mode)! as HTMLInputElement;
            modeElement.checked = true;
            let speedElement = document.getElementById('speed')! as HTMLInputElement;
            speedElement.value = speed;
        }
    
        function emptyRouteInfo() {
            let nameElement = document.getElementById('route-name')! as HTMLInputElement;
            nameElement.value = 'New Route Name';
            let modeElement = document.getElementById('on-foot')! as HTMLInputElement;
            modeElement.checked = false;
            modeElement = document.getElementById('bicycle')! as HTMLInputElement;
            modeElement.checked = false;
            let speedElement = document.getElementById('speed')! as HTMLInputElement;
            speedElement.value = '';
            let distElement = document.getElementById('duration')! as HTMLElement;
            distElement.innerHTML = '0.00 km';
            let durElement = document.getElementById('duration')! as HTMLElement;
            durElement.innerHTML = '0 minutes and 0 seconds';
            let calElement = document.getElementById('cals')! as HTMLElement;
            calElement.innerHTML = '0 cals';
        }
    
        function makeRouteBox(name:any, mode:any) {
            let routes = document.getElementById('routes')! as HTMLElement;
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
    
        function changeRoute(start:any, end:any, service:any, render:any) {
            let options = {
                origin: start.getPosition(),
                destination: end.getPosition(),
                travelMode: 'WALKING',
            }
            service.route(options, function(result:any, status:any) {
                if (status === 'OK' && result) {
                    render.setDirections(result);
                } else {
                    alert('An error was caused by rendering the route.');
                }
            });
        }
    
        function updateInfo(route:any) { 
            if (!route) { return; }
    
            let distance = getDistance(route);
            let distElement = document.getElementById('dist')! as HTMLElement;
            distElement.innerHTML = `${distance.toFixed(2)} km`;
    
            let speedElement = document.getElementById('speed')! as HTMLInputElement; 
            let speed = parseFloat(speedElement.value) / 60.0;
            let duration = distance / speed;
            let durElement = document.getElementById('duration')! as HTMLElement;
            durElement.innerHTML = `${~~duration} minutes and ${~~((duration - ~~duration) * 60)} seconds`;
            
            let calories = getCalories(duration, speed * 60.0);
            let calElement = document.getElementById('cals')! as HTMLElement;
            calElement.innerHTML = `${Math.round(calories)} cal`;
        }
    
        function getDistance(route:any) {
            let distance = 0;
            for (let i = 0; i < route.routes[0].legs.length; i++) {
                distance += route.routes[0].legs[i].distance.value;
            }
            
            return distance / 1000;
        }
    
        function getCalories(duration:any, speed:any) {
            let MET;
            let elementBicycle = document.getElementById('bicycle')! as HTMLInputElement;
            let elementOnFoot = document.getElementById('on-foot')! as HTMLInputElement;
            if (elementBicycle.checked) { MET = getBikeMET(speed); }
            else if (elementOnFoot.checked) { MET = getFootMET(speed); }
            else { return 0; }
    
            return duration * MET  * weight * 0.007935;
        }
    
        // rough 'metabolic equivalent of task' calculators 
        // linear regression based on data from https://golf.procon.org/met-values-for-800-activities/
        function getBikeMET(speed:any) {
            return Math.max(0, 0.45 * speed - 0.85);
        } function getFootMET(speed:any) {
            return Math.max(0, 0.96 * speed + 0.042);
        }
    },2000);
     }))
  }

}
