import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';

@Component({
  selector: 'app-calories',
  templateUrl: './calories.component.html',
  styleUrls: ['./calories.component.css']
})
export class CaloriesComponent implements OnInit {
  graphData = {}


  constructor(private authService: AuthenticateService) { }

  ngOnInit(): void {
    // this.authService.calorieGet().subscribe(
    //   data => {
    //     this.graphData = data.result;
    //     console.log(this.graphData);
    //
    //     this.buildLine();
    //   }
    // )

  }

    // private buildLine(){
    //
    //   var high = this.graphData.calories[0];
    //
    //   for(var i = 0; i < this.graphData.calories.length; i++){
    //       if(this.graphData.calories[i] > high){
    //           high = this.graphData.calories[i];
    //       }
    //   }
    //
    //   var localData: any = [];
    //
    //   for(var i = 0; i < this.graphData.time.length; i++){
    //       localData[i] = new Object;
    //       localData[i].time = this.graphData.time[i];
    //       localData[i].calories = this.graphData.calories[i];
    //   }
    //
    //
    //   const margin = 50;
    //   const width = 800;
    //   const height = 500;
    //   const chartWidth = width - 2 * margin;
    //   const chartHeight = height - 2 * margin;
    //
    //   const xScale: any = d3.scaleBand()
    //                       .domain(localData.map((data: any) => data.time))
    //                       .range([0, chartWidth]);
    //
    //   // const xScale = d3.scaleBand()
    //   //     .domain(dom)
    //   //     .range([0, chartWidth]);
    //
    //   const yScale: any = d3.scaleLinear()
    //                       .domain([0, high])
    //                       .range([chartHeight, 0]);
    //
    //   // append the svg object to the body of the page
    //   let svg: any = d3.select('#chart')
    //                   .append('svg')
    //                       .attr('width', width)
    //                       .attr('height', height);
    //   // title
    //   svg.append('text')
    //           .attr('x', width / 2)
    //           .attr('y', margin - 20)
    //           .attr('text-anchor', 'middle')
    //           .style('fill', 'white')
    //           .text("Blood Pressure vs Time");
    //
    //   svg.append("text")
    //           .attr("transform", "rotate(-90)")
    //           .attr("x", -(margin + 140))
    //           .attr("y", 6)
    //           .attr("dy", ".75em")
    //           .style('fill', 'white')
    //           .style("text-anchor", "end")
    //           .text("Pressure");
    //
    //   svg.append("text")
    //           .attr("class", "x lab")
    //           .attr("x", width/2)
    //           .attr("y", height - 10)
    //           .style('fill', 'white')
    //           .style("text-anchor", "middle")
    //           .text("Time");
    //
    //   // create a group (g) for the bars
    //   let g: any = svg.append('g')
    //       .attr('transform', `translate(${margin}, ${margin})`);
    //
    //   // y-axis
    //   let yAxis: any = g.append('g')
    //       .attr("stroke","white")
    //       .attr("stroke-width","0.5")
    //       .call(d3.axisLeft(yScale));
    //
    //   // x-axis
    //   let xAxis: any = g.append('g')
    //       .attr('transform', `translate(0, ${chartHeight})`)
    //       .attr("stroke","white")
    //       .attr("stroke-width","0.5")
    //       .call(d3.axisBottom(xScale));
    //
    //
    //   xAxis.select(".domain")
    //       .attr("stroke","white")
    //       .attr("stroke-width","0.5");
    //
    //   yAxis.select(".domain")
    //       .attr("stroke","white")
    //       .attr("stroke-width","0.5");
    //
    //   g.append("path")
    //     .datum(localData)
    //     .attr("fill", "none")
    //     .attr("stroke", "steelblue")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", d3.line()
    //       .x((data: any) => xScale(data.time) + xScale.bandwidth() / 2)
    //       .y((data: any) => yScale(data.calories))
    //       )
    //
    //   g.append("g")
    //     .selectAll("dot")
    //     .data(localData)
    //     .enter()
    //     .append("circle")
    //       .attr("cx", (data: any) => xScale(data.time) + xScale.bandwidth() / 2)
    //       .attr("cy", (data: any) => yScale(data.calories))
    //       .attr("r", 5)
    //       .attr("fill", "#69b3a2")
    //
    // }
}
