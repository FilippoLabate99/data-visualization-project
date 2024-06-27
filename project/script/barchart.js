let updateChart4;

d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQFydRs-6cI6WKCkypsneRn-2PmSoR3spyk7LH_w2rYdTimE1tD-0Ynp-ah7q_x4hfmiYYdnakQ8UqI/pub?gid=47894542&single=true&output=csv").then(function (data) {
    
    data.forEach(d => {
        for (let year = 2000; year <= 2015; year++) {
            d[year] = +d[year];
        }
    });

    let statesList = [];
    let selectedStates = statesList.slice(0, 1);

    statesList = [...new Set(data.map(d => d.Country))].sort();

    let columns = ["Country", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"];

    const years = columns.filter(col => col !== 'Country');

    d3.select("#yearDropdown")
                .on("change", function () {
                    updateChart4(selectedStates);
                })
                .selectAll("option")
                .data(years)
                .enter().append("option")
                .attr("value", d => d)
                .text(d => d);

    const svgWidth = 700, svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 150 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    states_chips = document.getElementById("selected-states")
    for (let i = 0; i < statesList.length; i++) {
        states_chips.innerHTML += `<div class="chip hidden" id="chip-${i}" style="background-color: #0077b6">${statesList[i]}</div>`
    }

    updateChart4 = function (states) {
        if (!Array.isArray(states)) {
            console.error("Expected states to be an array, but got:", states);
            return;
        }
        states.sort();
        d3.select("#chart4").selectAll("*").remove();
        d3.select("#chart4loader").style("display", "block");
        
        const svg = d3.select('#chart4')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        let selectedYear = d3.select("#yearDropdown").node().value;
        let filteredData = data.filter(d => states.includes(d.Country));
        let dataWithValues = filteredData.map(d => ({ state: d.Country, value: d[selectedYear] }));
        dataWithValues.sort((a, b) => b.value - a.value);
        let sortedStates = dataWithValues.map(d => d.state);
        let datafiltered = dataWithValues.map(d => d.value);
        //datafiltered = filteredData.map(d => d[selectedYear]);

        const y = d3.scaleBand()
            .domain(sortedStates)
            //.domain(selectedStates)
            .range([0, height])
            .padding(0.1);

        const x = d3.scaleLinear()
            .domain([0, d3.max(datafiltered)])
            .range([0, width]);

        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        // Sort the data by abundance in descending order
        //datafiltered.sort((a, b) => b.Country - a.Country);

        svg.selectAll("line.grid")
            .data(x.ticks())
            .enter()
            .append("line")
            .attr("class", "grid")
            .attr("x1", d => x(d))
            .attr("x2", d => x(d))
            .attr("y1", 0)
            .attr("y2", height)
            .style("stroke-dasharray", ("3, 3"));

        colors.domain(datafiltered.map((d, i) => i));

        // Define a transition
        let t = d3.transition()
            .duration(750);

        // Bind data to the bars
        let bars = svg.selectAll('rect')
            .data(datafiltered);

        // Definisci una scala di colori sequenziale
        const colorScale = d3.scaleSequential()
            .domain([0, d3.max(datafiltered)]) // Dominio basato sui dati filtrati
            .interpolator(d3.interpolateBlues); // Interpolatore per il gradiente di blu

        bars.enter()
            .append('rect')
            //.attr('y', (d,i) => y(states[i]))
            .attr('y', (d,i) => y(sortedStates[i]))
            .attr('height', y.bandwidth())
            .attr('width', 0) 
            .merge(bars) 
            .on('mouseover', function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(`Country: ${sortedStates[datafiltered.indexOf(d)]}<br>Value: ${d}`)
                    .style('left', `${event.pageX + 5}px`)
                    .style('top', `${event.pageY - 28}px`);
            })
            .on('mouseout', function () {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .transition(t)
            .attr('width', d => x(d))
            //.attr('fill', (d,i) => colors(i));
            //.attr('fill', (d, i) => currentColors[i % currentColors.length]);
            //.attr('fill', d => colorScale(d));
            .attr('fill', '#0077b6');

        bars.exit()
            .transition(t)
            .attr('width', 0)
            .remove();

        // Generate ticks from 0 to max value, incremented by 10
        const xTicks = Array.from({ length: Math.min(x.domain()[1], 10) + 1 }, (_, i) => i * x.domain()[1] / Math.min(x.domain()[1], 10));

        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .call(d3.axisBottom(x).tickValues(xTicks).tickFormat(d3.format("d")));

        svg.append('g')
            .attr('class', 'axis')
            .call(yAxis)
            .call(d3.axisLeft(y));
        
        

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x)
                .tickValues(xTicks)
                .tickFormat(d3.format("d"))
                .tickSize(-height) // This makes the tick span the entire height of the SVG
                .tickFormat("")    // This removes the tick labels
            )
            .selectAll(".tick")
            .attr("stroke", "#e5e5e5") // Gridline color
            .attr("stroke-opacity", 0.3)
            .attr("stroke-dasharray", "2,2"); // Make the grid dashed
        
        

        // Add x-axis label
        svg.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`) // Position at the middle of the x-axis
            .style("text-anchor", "middle")
            .style("fill", "#0077b6")
            .style("font-weight", "bold")
            .text("Infant Deaths");

        // Add y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)") // Rotate the text for the y-axis
            .attr("y", 0 - margin.left) // Position to the left of the y-axis
            .attr("x", 0 - (height / 2)) // Position at the middle of the y-axis
            .attr("dy", "1em") // Shift it slightly down
            .style("text-anchor", "middle")
            .style("fill", "#0077b6")
            .style("font-weight", "bold")
            .text("Countries");

        d3.select("#chart4loader").style("display", "none");
    }

    $("#states-selector").selectize({
        delimiter: ",",
        persist: true,
        maxItems: 10,
        onChange: function (value) {
            // update selectedYears
            selectedStates = value;
            for (let i = 0; i < statesList.length; i++) {
                if (value.includes(statesList[i])) {
                    document.getElementById(`chip-${i}`).classList.remove("hidden");
                } else {
                    document.getElementById(`chip-${i}`).classList.add("hidden");
                }
            }
            updateChart4(selectedStates);

            /*
            if (!firstTryAddState && value.length === 2) {
                console.log("👁️ Show tooltip");
                // show a tooltip over the second visible chip with the message "Try hovering over the chips"
                tooltip.transition()
                    .duration(400)
                    .style('opacity', .9)
                    .attr("id", "hover-tooltip");
                tooltip.html(`👋🏻 Hello there!<br />Try hovering over the chips to isolate the year from the others.`)
                    //.style('left', `${document.getElementById(`chip-${statesList.indexOf(+value[1])}`).getBoundingClientRect().x + 5}px`)
                    // .style('top', `${document.getElementById(`chip-${statesList.indexOf(+value[1])}`).getBoundingClientRect().y + (window.pageYOffset || document.documentElement.scrollTop || 0) - document.getElementById(`chip-${statesList.indexOf(+value[1])}`).getBoundingClientRect().height * 2 - 20}px`);
                firstTryAddState = true;
            }
            */
        },
        plugins: ['remove_button']
    });

    /*
    // modify the css class .item to add a background color, remove background image
    document.styleSheets[0].addRule(".selectize-input [data-value]", `background-color: #0077b6 !important;`);
    document.styleSheets[0].addRule(".selectize-input [data-value]", `background-image: none !important;`);
    document.styleSheets[0].addRule(".selectize-control.plugin-remove_button .item .remove", `border-left: 1px solid #0077b6 !important;`);
    document.styleSheets[0].addRule(".selectize-control.multi .selectize-input>div", `border: 1px solid #0077b6 !important;`);
    document.styleSheets[0].addRule(".selectize-control.multi .selectize-input>div", `background: #0077b6 !important;`);
    */

    // add options to the selectize
    let selectize = $("#states-selector")[0].selectize;
    selectize.clearOptions();
    statesList.forEach(Country => {
        selectize.addOption({ value: Country, text: Country });
    });

    // default selected years the first state
    selectize.setValue(statesList[0]);

    // call updateChart1 and pass as list of states just the first state
    updateChart4([statesList[0]]);
    //updateChart4([selectedStates]);

    //d3.select("#info_text_barchart").style("display", "block");        

    // Populate the dropdown options

    //updateChart4(statesList);
});

window.updateChart4 = updateChart4;