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

  save(): void{

  }
  newRoute(): void{

  }
  delete(): void{

  }
  ngOnInit(): void {
    
    this.authService.routeGet().subscribe(
      data => {
        this.routeData = data.result
      }
    );
    
    ($(document).ready(() => {
      setTimeout(() => {
        var map: any;
        var start: any;
        var end: any;
    
        // should be fetched from back end
        var routes = this.routeData ;
        console.log(routes)
        var home = { lat: 43.89, lng: -78.86 };
        var weight = 150;
  
    
        let initMap = function() {
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
            var endInfo: any;
    
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
    
            let setEnd = map.addListener('click', function(e:any) {
                end.setPosition(e.latLng);
                changeRoute(start, end, dirService, dirRender);
                endInfo = new google.maps.InfoWindow({
                  content: '<h1><b>Destination<b></h1>',
                })
                endInfo.open(map, end);
                startInfo.setContent('<h1><b>Start</b></h1>');
                setEnd.remove();
            });
    
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
                if (!dirRender.getDirections()) {
                    window.alert("Please select an end point.");
                    return;
                }
    
                let name = $('#name').val();
                if (name == null || name == '') {
                    window.alert("Please enter a route name.");
                    return;
                }
    
                let mode = $('input[name="mode"]:checked').attr('id');
                if (mode == null) {
                    window.alert("Please select a method of transportation.");
                    return;
                }
    
                makeRouteBox(name, mode);
                let route = getRouteJSON(name, mode, dirRender);
                // save route to database
            });
    
            $('#left .box').click(function() {
                console.log('123');
            })
        };
    
        $(document).keypress(function(event:any) {
            if (event.which == '13') {
                event.preventDefault();
            }
        });
  
        
        initMap()
    
        function setSelectedRoute(route:any) {
    
        }
    
        function getRouteJSON(name:any, mode:any, render:any) {
            let elementSpeed = document.getElementById('speed')! as HTMLInputElement;
            let speed = parseFloat(elementSpeed.value);
            if (!(speed>0)) {
                window.alert("Please enter a speed.");
                return;
            }
            let waypoints = [start.getPosition()];
            let wapoints = waypoints.concat(render.getDirections().routes[0].legs[0].via_waypoints);
            waypoints.push(end.getPosition());
            let route = {
                name: name,
                mode: mode,
                speed: speed,
                waypoints: waypoints,
            };
            return JSON.stringify(route);
        }
    
        function makeRouteBox(name:any, mode:any) {
            let routes = document.getElementById('routes')!;
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
            let elementDist = document.getElementById('dist')!
            elementDist.innerHTML = `${distance.toFixed(2)} km`;
    
            let elementSpeed = document.getElementById('speed')! as HTMLInputElement;
            let speed = parseFloat(elementSpeed.value) / 60.0;
            let duration = distance / speed;
            let elementDuration = document.getElementById('duration')!
            elementDuration.innerHTML = `${~~duration} minutes and ${~~((duration - ~~duration) * 60)} seconds`;
    
            let calories = getCalories(duration, speed * 60.0);
            let elementCals = document.getElementById('cals')!;
            elementCals.innerHTML = `${Math.round(calories)} cal`;
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
            let elementOnFoot = document.getElementById('foot')! as HTMLInputElement;
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
