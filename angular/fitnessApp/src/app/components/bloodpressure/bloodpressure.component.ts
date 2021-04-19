import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';

declare var $: any;
@Component({
  selector: 'app-bloodpressure',
  templateUrl: './bloodpressure.component.html',
  styleUrls: ['./bloodpressure.component.css']
})
export class BloodpressureComponent implements OnInit {
  graphData: any = {};
  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private x: any;
  private y: any;
  private svg: any;
  private line: any;


  constructor(private authService: AuthenticateService) { }

  ngOnInit(): void {
    this.authService.bloodpressureGet().subscribe(
      data => {
        this.graphData = data.data;
        // console.log(data)
        console.log(this.graphData)
        
        this.buildSvg();
        this.addXandYAxis();
        this.drawLineAndPath();

        
      ($(document).ready(function() {
        alert('jQuery')
      }))
      }
    )
  }

  private buildSvg() {
    this.svg = d3.select('svg') // svg element from html
      .append('g')   // appends 'g' element for graph design
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private addXandYAxis() {
    // range of data configuring
    this.x = d3Scale.scaleTime().range([0, 50]);
    this.y = d3Scale.scaleLinear().range([55, 0]);
    this.x.domain(d3Array.extent(this.graphData.measure));
    this.y.domain(d3Array.extent(this.graphData.time));

    // Configure the X Axis
    this.svg.append('g')
        .attr('transform', 'translate(0,' + 55 + ')')
        .call(d3Axis.axisBottom(this.x));
    // Configure the Y Axis
    this.svg.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y));
  }

  private drawLineAndPath() {
    this.line = d3Shape.line()
        .x( (d: any) => this.x(d.measure) )
        .y( (d: any) => this.y(d.time) );
    // Configuring line path
    this.svg.append('path')
        .datum(this.graphData)
        .attr('class', 'line')
        .attr('d', this.line);
  }

}
