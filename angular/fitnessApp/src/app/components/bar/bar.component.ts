import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  @Input() data: any;
  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private x: any;
  private y: any;
  private svg: any;
  private line: any;

  constructor() { }

  ngOnInit(): void {
    this.buildSvg();
    this.addXandYAxis();
    this.drawLineAndPath();
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
    this.x.domain(d3Array.extent(this.data, (d: any) => d.pressure ));
    this.y.domain(d3Array.extent(this.data, (d: any) => d.createdAt ));

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
        .x( (d: any) => this.x(d.pressure) )
        .y( (d: any) => this.y(d.createdAt) );
    // Configuring line path
    this.svg.append('path')
        .datum(this.data)
        .attr('class', 'line')
        .attr('d', this.line);
  }



}
