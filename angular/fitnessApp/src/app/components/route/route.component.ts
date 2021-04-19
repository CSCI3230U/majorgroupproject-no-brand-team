import { Component, OnInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    
    ($(document).ready(function() {
      alert('jQuery')
    }))
  }

}
