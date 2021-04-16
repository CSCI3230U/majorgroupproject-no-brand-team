var weight = [100, 120, 130];
var time = ["01-01-2021", "01-02-2021", "01-03-2021"];

var calories = [1000, 1500, 900];

var activities = ["swimming", "running", "walking"];

var heartRate = [120, 150, 90];

var blood = [150, 200, 120];

var chartData = [];

$(document).ready(function() {

    createObject(time, weight);
    buildLine("Weight vs Time", "Time", "Weight");

    $('#submit').click(function() {
        console.log("test");
        type = $('#chartType').val();
        if(type == "weightTime"){
            d3.select("svg").remove();
            createObject(time, weight);
            buildLine("Weight vs Time", "Time", "Weight");
        }
        else if(type == "caloriesTime"){
            d3.select("svg").remove();
            createObject(time, calories);
            buildLine("Calories vs Time", "Time", "Calories");
        }
        else if(type == "caloriesAct"){
            d3.select("svg").remove();
            createObject(activities, calories);
            buildBar("Calories vs Activity", "Activity", "Calories");
        }
        else if(type == "heartTime"){
            d3.select("svg").remove();
            createObject(time, heartRate);
            buildLine("Heartrate vs Time", "Time", "Heartrate");
        }
        else if(type == "bloodTime"){
            d3.select("svg").remove();
            createObject(time, blood);
            buildLine("Calories vs Time", "Time", "Calories");
        }
     });
 });

 function createObject(arr1, arr2){
     for(i = 0; i < arr1.length; i++){
         chartData[i] = new Object();
         chartData[i].x = arr1[i];
         chartData[i].y = arr2[i];
     }
 }

function buildBar(title, xLabel, yLabel){
    console.log("test");
    var high = chartData[0].y;

    for(i = 0; i < chartData.length; i++){
        if(chartData[i].y > high){
            high = chartData[i].y;
        }
    }

    const margin = 50;
    const width = 800;
    const height = 500;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    const colourScale = d3.scaleLinear()
                            .domain([0, high])
                            .range(['red', 'blue']);

    const xScale = d3.scaleBand() // discrete, bucket
                        .domain(chartData.map((data) => data.x))
                        .range([0, chartWidth])
                        .padding(0.3);

    const yScale = d3.scaleLinear()
                        .domain([0, high])
                        .range([chartHeight, 0]);

    let svg = d3.select('#chart')
                    .append('svg')
                        .attr('width', width)
                        .attr('height', height);

    // title
    svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin - 20)
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .text(title);

    svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(margin + 140))
            .attr("y", 6)
            .attr("dy", ".75em")
            .style('fill', 'white')
            .style("text-anchor", "end")
            .text(yLabel);

    svg.append("text")
            .attr("class", "x lab")
            .attr("x", width/2)
            .attr("y", height - 10)
            .style('fill', 'white')
            .style("text-anchor", "middle")
            .text(xLabel);


    // create a group (g) for the bars
    let g = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    // y-axis
    yAxis = g.append('g')
    .attr("stroke","white")
    .attr("stroke-width","0.5")
        .call(d3.axisLeft(yScale));

    // x-axis
    xAxis = g.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .attr("stroke","white")
        .attr("stroke-width","0.5")
        .call(d3.axisBottom(xScale));


    xAxis.select(".domain")
        .attr("stroke","white")
        .attr("stroke-width","0.5");

    yAxis.select(".domain")
        .attr("stroke","white")
        .attr("stroke-width","0.5");



    let rectangles = g.selectAll('rect')
        .data(chartData)
        .enter()
            .append('rect')
                .attr('x', (data) => xScale(data.x))
                .attr('y', (data) => chartHeight)
                .attr('width', xScale.bandwidth())
                .attr('height', (data) => 0)
                .attr('fill', (data) => colourScale(data.y))
                .on('mouseenter', function(source, index) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('opacity', 0.5);
                })
                .on('mouseleave', function(source, index) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('opacity', 1.0);
                });

    rectangles.transition()
        .ease(d3.easeElastic)
        .attr('height', (data) => chartHeight - yScale(data.y))
        .attr('y', (data) => yScale(data.y))
        .duration(1000)
        .delay((data, index) => index * 50);
}

function buildLine(title, xLabel, yLabel){

    var high = chartData[0].y;

    for(i = 0; i < chartData.length; i++){
        if(chartData[i].y > high){
            high = chartData[i].y;
        }
    }


    const margin = 50;
    const width = 800;
    const height = 500;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    const xScale = d3.scaleBand() // discrete, bucket
                        .domain(chartData.map((data) => data.x))
                        .range([0, chartWidth])
                        .padding(0.3);

    const yScale = d3.scaleLinear()
                        .domain([0, high])
                        .range([chartHeight, 0]);

    // append the svg object to the body of the page
    let svg = d3.select('#chart')
                    .append('svg')
                        .attr('width', width)
                        .attr('height', height);
    // title
    svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin - 20)
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .text(title);

    svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(margin + 140))
            .attr("y", 6)
            .attr("dy", ".75em")
            .style('fill', 'white')
            .style("text-anchor", "end")
            .text(yLabel);

    svg.append("text")
            .attr("class", "x lab")
            .attr("x", width/2)
            .attr("y", height - 10)
            .style('fill', 'white')
            .style("text-anchor", "middle")
            .text(xLabel);

    // create a group (g) for the bars
    let g = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    // y-axis
    yAxis = g.append('g')
        .attr("stroke","white")
        .attr("stroke-width","0.5")
        .call(d3.axisLeft(yScale));

    // x-axis
    xAxis = g.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .attr("stroke","white")
        .attr("stroke-width","0.5")
        .call(d3.axisBottom(xScale));


    xAxis.select(".domain")
        .attr("stroke","white")
        .attr("stroke-width","0.5");

    yAxis.select(".domain")
        .attr("stroke","white")
        .attr("stroke-width","0.5");

    g.append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x((data) => xScale(data.x) + xScale.bandwidth() / 2)
        .y((data) => yScale(data.y))
        )

    g.append("g")
      .selectAll("dot")
      .data(chartData)
      .enter()
      .append("circle")
        .attr("cx", (data) => xScale(data.x) + xScale.bandwidth() / 2)
        .attr("cy", (data) => yScale(data.y))
        .attr("r", 5)
        .attr("fill", "#69b3a2")

}
