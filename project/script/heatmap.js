let updateChart5;

d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQFydRs-6cI6WKCkypsneRn-2PmSoR3spyk7LH_w2rYdTimE1tD-0Ynp-ah7q_x4hfmiYYdnakQ8UqI/pub?gid=1541084187&single=true&output=csv").then(function (fifthData) {

    const svgWidth = 850, svgHeight = 500;
    const margin = { top: 20, right: 20, bottom: 100, left: 150 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    //console.log(fifthData)

    fifthData.forEach(d => {
        d.Correlation = +d.Correlation;
    });

    //console.log(fifthData)

    function preprocessData(stateData, scientific_names) {
        return stateData
    }

    updateChart5 = function () {
        d3.select("#chart5").selectAll("*").remove();
        d3.select("#chart5").style("display", "block");

        let country = d3.select("#stateDropdown5").property('value');
        let countryData = fifthData.filter(d => d.Country === country);
        let var2 = [...new Set(countryData.map(d => d.Variable2))].sort();
        let data = preprocessData(countryData, var2);
        //console.log(data)

        const x = d3.scaleBand()
            .domain(data.map(d => d.Variable2))
            .range([0, width])
            .padding(0.05);

        const y = d3.scaleBand()
            .domain(data.map(d => d.Variable1))
            .range([height, 0])
            .padding(0.1);

        const svg = d3.select('#chart5')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        svg.append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(y));

        let colorScale = d3.scaleLinear()
            .range([currentColors[currentColors.length - 1], currentColors[0]])
            .domain([0, d3.max(data, d => d.Correlation)])

        // Set up a transition for the chart update
        let t = d3.transition()
            .duration(750);

        // Update the rectangles
        let rects = svg.selectAll("rect")
            .data(data, function (d) { return d.Variable1 + ':' + d.Variable2; });

        // Exit old elements not present in new data
        rects.exit()
            .attr("class", "exit")
            .transition(t)
            .style("fill-opacity", 0)
            .remove();

        // Update old elements present in new data
        rects.attr("class", "update")
            .transition(t)
            .attr("x", d => x(d.Variable2))
            .attr("y", d => y(d.Variable1))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d, i) => colorScale(d.Correlation));

        // Enter new elements present in the new data
        rects.enter().append("rect")
            .attr("class", "enter")
            .attr("x", d => x(d.Variable2))
            .attr("y", d => y(d.Variable1))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d, i) => colorScale(d.Correlation))
            .style("fill-opacity", 0)
            .on('mouseover', function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                //tooltip.html(`Variable: ${d.Variable2}<br>Correlation: ${d.Correlation}`)
                tooltip.html(`Correlation: ${d.Correlation}`)
                    .style('left', `${event.pageX + 5}px`)
                    .style('top', `${event.pageY - 28}px`);
            })
            .on('mouseout', function () {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .transition(t)
            .style("fill-opacity", 1);

        // Add x-axis label
        svg.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
            .style("text-anchor", "middle")
            .style("fill", "#6A957C")
            .style("font-weight", "bold")
            //.text("Variable 2");

        // Add y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 10)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("fill", "#6A957C")
            .style("font-weight", "bold")
            //.text("Variable 1");

        d3.select("#chart5loader").style("display", "none");
    }

    // Manage the state change
    d3.select("#stateDropdown5")
        .on("change", updateChart5);

    // Populate the dropdown options
    d3.select("#stateDropdown5")
        .selectAll("option")
        .data([...new Set(fifthData.map(d => d.Country))])
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    updateChart5();
});

window.updateChart5 = updateChart5;