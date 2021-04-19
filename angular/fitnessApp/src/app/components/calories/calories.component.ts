import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-calories',
  templateUrl: './calories.component.html',
  styleUrls: ['./calories.component.css']
})
export class CaloriesComponent implements OnInit {
  graphData = {}


  constructor(private authService: AuthenticateService) { }

  ngOnInit(): void {
    this.authService.calorieGet().subscribe(
      data => {
        this.graphData = data.result; 
      }
    )

  }

}
