window.onload = function() {
    console.log("test");
    var barData = [];

    function buildBar(title, xLabel, yLabel){
        var high = barData[0].y;

        for(i = 0; i < barData.length; i++){
            if(barData[i].y > high){
                high = barData[i].y;
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
                            .domain(barData.map((data) => data.x))
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
                .attr('y', margin)
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
            .data(barData)
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

    function createObject(arr1, arr2){
        for(i = 0; i < arr1.length; i++){
            barData[i] = new Object();
            barData[i].x = arr1[i];
            barData[i].y = arr2[i];
        }
        buildBar("title", "x", "y");

    }

    createObject(["test1", "test2", "test3"], [0.5, 0.3, 5]);
};
