let data1_2 = [];
d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQFydRs-6cI6WKCkypsneRn-2PmSoR3spyk7LH_w2rYdTimE1tD-0Ynp-ah7q_x4hfmiYYdnakQ8UqI/pub?gid=549668689&single=true&output=csv").then(function (csvdata1_2) {
    //console.log(csvdata1_2);
    csvdata1_2.forEach(d => {                
        d._2000_ = +d._2000_;
        d._2001_ = +d._2001_;
        d._2002_ = +d._2002_;
        d._2003_ = +d._2003_;
        d._2004_ = +d._2004_;
        d._2005_ = +d._2005_;
        d._2006_ = +d._2006_;
        d._2007_ = +d._2007_;
        d._2008_ = +d._2008_;
        d._2009_ = +d._2009_;
        d._2010_ = +d._2010_;
        d._2011_ = +d._2011_;
        d._2012_ = +d._2012_;
        d._2013_ = +d._2013_;
        d._2014_ = +d._2014_;
        d._2015_ = +d._2015_;
    });

    data1_2 = csvdata1_2;
    //console.log("👁️ Data loaded");

    d3.select("#stateDropdown2")
    .selectAll("option")
    .data([...new Set(data1_2.map(d => d.Country))])
    .enter().append("option")
    .attr("value", d => d)
    .text(d => d);

    d3.select("#stateDropdown2")
    .on("change", function () {
        updateChart1_2(this.value);
        //updateChart2(this.value, selectedYears);
        //updateChart3(this.value, selectedYears);
    })

    // modify the css class .item to add a background color, remove background image
    document.styleSheets[0].addRule(".selectize-input [data-value]", `background-color: ${currentColors[0]} !important;`);
    document.styleSheets[0].addRule(".selectize-input [data-value]", `background-image: none !important;`);
    document.styleSheets[0].addRule(".selectize-control.plugin-remove_button .item .remove", `border-left: 1px solid ${currentColors[0]} !important;`);
    document.styleSheets[0].addRule(".selectize-control.multi .selectize-input>div", `border: 1px solid ${currentColors[0]} !important;`);
    document.styleSheets[0].addRule(".selectize-control.multi .selectize-input>div", `background: ${currentColors[0]} !important;`);

    updateChart1_2(document.getElementById("stateDropdown2").value);

    //d3.select("#info_text_linearchart_2").style("display", "block");

})

let updateChart1_2;

updateChart1_2 = function (Country = data[0].Country) {

    //console.log("🔄 Chart update. State: " + Country);
    let columns = ["Country", "_2000_", "_2001_", "_2002_", "_2003_", "_2004_", "_2005_", "_2006_", "_2007_", "_2008_", "_2009_", "_2010_", "_2011_", "_2012_", "_2013_", "_2014_", "_2015_"];


    d3.select("#chart1_2").selectAll("*").remove();
    d3.select("#chart1_2").style("display", "block");

    let datafiltered_2 = data1_2.filter(d => {
        return d.Country === Country
    });

    // on x put the columns names except date, year and type
    const x = d3.scaleBand()
        .domain(columns.filter(d => d !== "Country")) //.map(item => item.replace(/_/g, ''))
        .range([0, width]);

    // on y put the temperature (min and max)
    const y = d3.scaleLinear()
        .domain([d3.min(datafiltered_2, d => d3.min([d._2000_, d._2001_, d._2002_, d._2003_, d._2004_, d._2005_, d._2006_, d._2007_, d._2008_, d._2009_, d._2010_, d._2011_, d._2012_, d._2013_, d._2014_, d._2015_]))-5, d3.max(datafiltered_2, d => d3.max([d._2000_, d._2001_, d._2002_, d._2003_, d._2004_, d._2005_, d._2006_, d._2007_, d._2008_, d._2009_, d._2010_, d._2011_, d._2012_, d._2013_, d._2014_, d._2015_]))+5])
        .range([height, 0]);

    const svg = d3.select('#chart1_2')
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
    let dataLine_2 = [];
    columns.filter(d => d !== "Country").forEach(column => {
        dataLine_2.push({ "x": column, "y": datafiltered_2[0][column] });
    });

    // add the lines
    svg.append("path")
        .datum(dataLine_2)
        .attr("fill", "none")
        .attr("stroke", "#0077b6")
        .attr("stroke-width", 1.5)
        .attr("id", `line_2`)
        .attr("opacity", 0.8)
        .attr("transform", "translate(" + x.bandwidth() / 2 + ",0)")
        .attr("d", d3.line()
            .x(function (d) { return x(d.x) })
            .y(function (d) { return y(d.y) })
        );

    // add the dots
    svg.append("g")
        .selectAll("dot")
        .data(dataLine_2)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.x) })
        .attr("cy", function (d) { return y(d.y) })
        .attr("r", 3)
        .attr("fill", "#0096c7")
        .attr("cursor", "pointer")
        .attr("class", `mindot`)
        .attr("opacity", 0.8)
        .attr("transform", "translate(" + x.bandwidth() / 2 + ",0)")

    d3.select("#chart1_2loader").style("display", "none");
}

window.updateChart1_2 = updateChart1_2;