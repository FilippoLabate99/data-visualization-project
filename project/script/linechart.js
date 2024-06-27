let updateChart1;

updateChart1 = function (Country = data[0].Country) {
    //console.log("🔄 Chart update. State: " + Country);

    let columns = ["Country", "_2000_", "_2001_", "_2002_", "_2003_", "_2004_", "_2005_", "_2006_", "_2007_", "_2008_", "_2009_", "_2010_", "_2011_", "_2012_", "_2013_", "_2014_", "_2015_"];

    d3.select("#chart1").selectAll("*").remove();
    d3.select("#chart1").style("display", "block");

    // filter data by years and state
    let datafiltered = data.filter(d => {
        return d.Country === Country
    });

    // on x put the columns names except date, year and type
    const x = d3.scaleBand()
        .domain(columns.filter(d => d !== "Country")) //.map(item => item.replace(/_/g, ''))
        .range([0, width]);

    // on y put the temperature (min and max)
    const y = d3.scaleLinear()
        .domain([d3.min(datafiltered, d => d3.min([d._2000_, d._2001_, d._2002_, d._2003_, d._2004_, d._2005_, d._2006_, d._2007_, d._2008_, d._2009_, d._2010_, d._2011_, d._2012_, d._2013_, d._2014_, d._2015_]))-5, d3.max(datafiltered, d => d3.max([d._2000_, d._2001_, d._2002_, d._2003_, d._2004_, d._2005_, d._2006_, d._2007_, d._2008_, d._2009_, d._2010_, d._2011_, d._2012_, d._2013_, d._2014_, d._2015_]))+5])
        .range([height, 0]);

    const svg = d3.select('#chart1')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "15px")
        .call(d3.axisBottom(x).tickFormat(d => d.replace(/_/g, '')));

    svg.append('g')
        .attr('class', 'axis')
        .style("font-size", "15px")
        .call(d3.axisLeft(y));
        //.call(d3.axisLeft(y).tickFormat(d => d + "°C"));

    // add a grid to the chart
    svg.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.1)
        .call(d3.axisLeft()
            .scale(y)
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

    // add the vertical grid to the chart
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .attr("opacity", 0.1)
        .call(d3.axisBottom()
            .scale(x)
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )

    // prepare data as list of lists (one per type)
    let dataLine = [];
    columns.filter(d => d !== "Country").forEach(column => {
        dataLine.push({ "x": column, "y": datafiltered[0][column] });
    });

    // add the lines
    svg.append("path")
        .datum(dataLine)
        .attr("fill", "none")
        //.attr("stroke", currentColors[10])
        .attr("stroke", "#0077b6")
        .attr("stroke-width", 1.5)
        .attr("id", `line`)
        .attr("opacity", 0.8)
        .attr("transform", "translate(" + x.bandwidth() / 2 + ",0)")
        .attr("d", d3.line()
            .x(function (d) { return x(d.x) })
            .y(function (d) { return y(d.y) })
        );

    // add the dots
    svg.append("g")
        .selectAll("dot")
        .data(dataLine)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.x) })
        .attr("cy", function (d) { return y(d.y) })
        .attr("r", 3)
        //.attr("fill", currentColors[9])
        .attr("fill", "#0096c7")
        .attr("cursor", "pointer")
        .attr("class", `mindot`)
        .attr("opacity", 0.8)
        .attr("transform", "translate(" + x.bandwidth() / 2 + ",0)")

    d3.select("#chart1loader").style("display", "none");
}

window.updateChart1 = updateChart1;

/*

x Ingrandire labels
- Un colore per ogni anno e sfumatura per min e max
x Cambiare scala per stato
x Scritta per hover sui chips
- Colori da più chiaro a più scuro

*/