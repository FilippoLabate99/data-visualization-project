let updateChart6;
const data_features = topojson.feature(sus, sus.objects.countries).features;
let data6 = [];
let mapData;
//const defaultYear = '_2000_';

d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQFydRs-6cI6WKCkypsneRn-2PmSoR3spyk7LH_w2rYdTimE1tD-0Ynp-ah7q_x4hfmiYYdnakQ8UqI/pub?gid=1539498717&single=true&output=csv").then(csvdata => {
        csvdata.forEach(d => {
          for (let year = 2000; year <= 2015; year++) {
            d[`_${year}_`] = +d[`_${year}_`];
          }
        });
        data6 = csvdata;
        let columns = ["Country", "_2000_", "_2001_", "_2002_", "_2003_", "_2004_", "_2005_", "_2006_", "_2007_", "_2008_", "_2009_", "_2010_", "_2011_", "_2012_", "_2013_", "_2014_", "_2015_"];

        const years = columns.filter(col => col !== 'Country');

        d3.select("#yearDropdown6")
                    .on("change", function () {
                        updateChart6(this.value);
                    })
                    .selectAll("option")
                    .data(years)
                    .enter().append("option")
                    .attr("value", d => d)
                    .text(d => d.replace(/_/g, ''))
                    //.property("selected", d => d[0]); // Set default year
        
}); 

updateChart6 = function (selYear = '_2000_') {
    d3.select("#chart6").selectAll("*").remove();
    d3.select("#chart6").style("display", "block");
    console.log(selYear);
    const colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
        .domain([30, 90]); 
    const projection = d3.geoMercator()
        .translate([svgWidth / 2, svgHeight / 2])
        .scale([70]);
    const path = d3.geoPath().projection(projection);
    svg3 = d3.select("#chart6")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    const data_features = topojson.feature(sus, sus.objects.countries).features;
    let world = svg3.append("g")
        .selectAll("path")
        .data(data_features)
        .enter()
        .append("path")
        .attr("data-name", d => d.properties.name)
        .attr("d", path)
        .attr("fill", function (d) {
            return d.properties[selYear] !== "0" ? colorScale(d.properties[selYear]) : "gray";
        })
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        // mouseover highlight the border of the state
        .on("mouseover", function (event, d) {
            d3.select(this)
                .attr("stroke", currentColors[0])
                .attr("stroke-width", 2);
            this.parentElement.appendChild(this);
            // show the tooltip aligned to state and show the state name
            tooltip.transition()
                .duration(200)
                .style("opacity", .9)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
            tooltip.html(d.properties[selYear] + " years");
        })
    // mouseout reset the border of the state
    .on("mouseout", function (d) {
        d3.select(this)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5);
        // hide the tooltip
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });


    //const selYear = `_${d3.select("#yearDropdown6").property('value')}_`;

    // --------------------------- //

    /*
    0 - 50k
    50k - 150k
    150k - 250k
    250k - 350k
    350k - 450k
    450k - 550k
    550k - 650k
    650k - 750k
    750k - 850k
    850k
    */
    /*
    const colorScale = d3.scaleThreshold()
			.domain([30, 40, 50, 60, 70, 80, 90, 100])
			.range(d3.schemeGreens[6]);
    */

    /*
    let projection = d3.geoAlbersUsa()
        .translate([svgWidth / 2, svgHeight / 2])
        .scale([1000]);

    let path = d3.geoPath().projection(projection);
    */

    /*
    d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQFydRs-6cI6WKCkypsneRn-2PmSoR3spyk7LH_w2rYdTimE1tD-0Ynp-ah7q_x4hfmiYYdnakQ8UqI/pub?gid=0&single=true&output=csv").then(csvdata => {
        csvdata.forEach(d => {
          for (let year = 2000; year <= 2015; year++) {
            d[`_${year}_`] = +d[`_${year}_`];
          }
        });

        data6 = csvdata;

        let columns = ["Country", "_2000_", "_2001_", "_2002_", "_2003_", "_2004_", "_2005_", "_2006_", "_2007_", "_2008_", "_2009_", "_2010_", "_2011_", "_2012_", "_2013_", "_2014_", "_2015_"];

        const years = columns.filter(col => col !== 'Country');

        d3.select("#yearDropdown6")
                    .on("change", function () {
                        updateChart6();
                    })
                    .selectAll("option")
                    .data(years)
                    .enter().append("option")
                    .attr("value", d => d)
                    .text(d => d.replace(/_/g, '')); 
        
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(jsonData => {
            mapData = topojson.feature(jsonData, jsonData.objects.countries).features;
            console.log(mapData);
            //updateMap();
        });

        const selectedYear = `_${d3.select("#yearDropdown6").property('value')}_`;

        mapData.forEach(feature => {
            const countryData = data6.find(d => d.Country === feature.properties.name);
            feature.properties.lifeExpectancy = countryData ? countryData[selectedYear] : null;
          });

        svg3.selectAll("path").remove();

        svg3.selectAll("path")
            .data(mapData)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", d => d.properties.lifeExpectancy ? colorScale(d.properties.lifeExpectancy) : "gray")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .on("mouseover", function (event, d) {
              d3.select(this)
                .attr("stroke", "yellow")
                .attr("stroke-width", 2);
              d3.select("#tooltip")
                .style("opacity", .9)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px")
                .html(`${d.properties.name}: ${d.properties.lifeExpectancy}`);
            })
            .on("mouseout", function () {
              d3.select(this)
                .attr("stroke", "black")
                .attr("stroke-width", 0.5);
              d3.select("#tooltip").style("opacity", 0);
            });
    });
    */

    //const g = svg3.append("g");

    /*
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data => {

        const countries = topojson.feature(data, data.objects.countries);

        
        countries.features.forEach(feature => {
            const countryData = data6.find(d => d.Country === feature.properties.name);
            if (countryData) {
                feature.properties.data = countryData[selYear];
            } else {
                feature.properties.data = null;
            }
        });
        
        
        console.log(data);

        svg3.append("g")
            .selectAll("path")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("fill", d => d.properties.data ? colorScale(d.properties.data) : "gray")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .attr("stroke", "yellow")
                    .attr("stroke-width", 2);
                d3.select("#tooltip")
                    .style("opacity", .9)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px")
                    .html(`${d.properties.name}: ${d.properties.data}`);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .attr("stroke", "black")
                    .attr("stroke-width", 0.5);
                d3.select("#tooltip").style("opacity", 0);
            });
        
        /*
        let world = svg3.append("g")
            .selectAll("path")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("data-name", d => d.properties.name)
            .attr("d", path)
            .attr("fill", function (d) {
                return d.properties[selYear] !== "0" ? colorScale(d.properties[selYear]) : "gray";
            })
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            // mouseover highlight the border of the state
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .attr("stroke", currentColors[0])
                    .attr("stroke-width", 2);
                this.parentElement.appendChild(this);
                // show the tooltip aligned to state and show the state name
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
                tooltip.html(d.properties[selYear] + "years");
            })
            // mouseout reset the border of the state
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("stroke", "black")
                    .attr("stroke-width", 0.5);
                // hide the tooltip
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        
        //g.selectAll('path').data(countries.features).enter().append('path').attr('class', 'countrty').attr('d', path);
    });
    */
    // Create the legend
    function createLegend(colorScale) {
        const legendWidth = 120;
        const legendHeight = 50;

        let legendSvg = svg3.append("g")
        .attr("class", "legend")
        // place on right bottom corner
        .attr("transform", "translate(" + (svgWidth - 200) + "," + (svgHeight - 200) + ")")
        .attr("height", 100)
        .attr("width", 100);

        const gradient = legendSvg.append("defs")
            .append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%");

        gradient.selectAll("stop")
            .data(colorScale.ticks().map((t, i, n) => ({
                offset: `${100 * i / n.length}%`,
                color: colorScale(t)
            })))
            .enter().append("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color);

        legendSvg.append("rect")
            .attr("width", legendWidth)
            .attr("height", legendHeight - 30)
            .style("fill", "url(#gradient)");

        const xScale = d3.scaleLinear()
            .domain(colorScale.domain())
            .range([0, legendWidth]);

        const xAxis = d3.axisBottom(xScale)
            .ticks(5);

        legendSvg.append("g")
            .attr("transform", `translate(0,${legendHeight - 30})`)
            .call(xAxis);
    }

    // Call the function to create the legend
    createLegend(colorScale);
    /*
    // Add legend
    let legend = svg3.append("g")
        .attr("class", "legend")
        // place on right bottom corner
        .attr("transform", "translate(" + (svgWidth - 200) + "," + (svgHeight - 200) + ")")
        .attr("height", 100)
        .attr("width", 100);

    legend.selectAll("rect")
        .data([["0", "0"]].concat(colorScale.range().map(function (d) {
            d = colorScale.invertExtent(d);
            if (d[0] == null) d[0] = 0
            if (d[1] == null) d[1] = colorScale.domain()[1];
            return d;
        })))
        .enter()
        .append("rect")
        .attr("x", 20)
        .attr("y", function (d, i) {
            return i * 20;
        })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d) {
            if (d[0] == 0 && d[1] == 0) return "gray";
            return colorScale(d[0]);
        })
        .style("stroke", "black")
        .style("stroke-width", 0.5);

    legend.selectAll("text")
        .data([["0", null]].concat(colorScale.range().map(function (d) {
            d = colorScale.invertExtent(d);
            if (d[1] == null) d[1] = colorScale.domain()[1];
            return d;
        })))
        .enter()
        .append("text")
        .attr("x", 35)
        .attr("y", function (d, i) {
            return i * 20 + 9;
        })
        .text(function (d) {
            if (!d[0]) return "1 - " + d3.format(".2s")(d[1]); 
            return d[1] ? d3.format(".2s")(d[0]) + " - " + d3.format(".2s")(d[1]) : "0";
        })
        .style("font-size", 10);

    // --------------------------- //
    */
    d3.select("#chart6loader").style("display", "none");
}

updateChart6();
window.updateChart6 = updateChart6;