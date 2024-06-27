let updateChart3;
//let statesListRidge = [];
//let selectedStatesRidge = statesListRidge.slice(0, 1);

d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQFydRs-6cI6WKCkypsneRn-2PmSoR3spyk7LH_w2rYdTimE1tD-0Ynp-ah7q_x4hfmiYYdnakQ8UqI/pub?gid=1659344214&single=true&output=csv").then(function (data) {
  
  //RIDGE SENZA STATE DROPDOWN E CON STATE SELECTION INVECE CHE YEAR SELECTION (SULLE X LE DISTRIBUZIONI CALCOLATE SUGLI ANNI E TANTE COPPIE DI DISTRIBUZIONI QUANTI STATI SELEZIONATI (MAX 10))

  data.forEach(d => {
    for (let year = 2000; year <= 2015; year++) {
        d[year] = +d[year];
    }
  });
  //console.log(data);

  let statesListRidge = [];
  let selectedStatesRidge = statesListRidge.slice(0, 1);
  let firstTryAddStateRidge = false;
  let columns = ["Country", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"];

  statesListRidge = [...new Set(data.map(d => d.Country))].sort();

  const max_bars = 10;
  const svgWidth = 700, svgHeight = 400;
  const margin = { top: 90, right: 10, bottom: 30, left: 190 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  let states_chips_ridge = document.getElementById("selected-states-ridge")
  //states_chips_ridge.innerHTML = `<div class="chip-ridge" id="chip-ridge-0" style="background-color: ${currentColors[0]}">${statesListRidge[0]}</div>`
  for (let i = 0; i < statesListRidge.length; i++) {
    states_chips_ridge.innerHTML += `<div class="chip-ridge hidden" id="chip-ridge-${i}" style="background-color: ${currentColors[i % currentColors.length]}">${statesListRidge[i]}</div>`
  }

  updateChart3 = function (states = data[0].Country) {

    //console.log("🔄 Ridgechart update. State: " + states);
    d3.select("#chart3").selectAll("*").remove();
    d3.select("#chart3").style("display", "flex");
    // append the svg object to the body of the page

    // Get the different categories and count them
    var categories = states
    var n = categories.length
    var heightEff = height + 100

    var svg = d3.select("#chart3")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", heightEff + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    let datafiltered = data.filter(d => {
      return states.includes(d.Country);
    });

    //console.log(datafiltered)

    let dataBMI = datafiltered.filter(d => {
      return d.Type === "BMI"
    });
    let dataBMIDict = {}
    const years = Array.from({ length: 16 }, (v, k) => (2000 + k));
    dataBMI.forEach(element => {
      dataBMIDict[element.Country] = years.map(year => element[year])
    });
    //console.log(dataBMI)

    let dataHIV = datafiltered.filter(d => {
      return d.Type === "HIV/AIDS"
    });
    let dataHIVDict = {}
    dataHIV.forEach(element => {
      dataHIVDict[element.Country] = years.map(year => element[year])
    });
    //console.log(dataHIV)

    // Add X axis
    var x = d3.scaleLinear()
      .domain([-20, 120])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + heightEff + ")")
      .call(d3.axisBottom(x).tickFormat(d => d));

    // Create a Y scale for densities
    var y = d3.scaleLinear()
      .domain([0, 0.2])
      .range([height, 0]);

    // Create the Y axis for names
    var yName = d3.scaleBand()
      .domain(categories)
      .range([100, heightEff])
      .paddingInner(1)
    svg.append("g")
      .call(d3.axisLeft(yName));

    // add a vertical grid to the chart
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + heightEff + ")")
      .attr("opacity", 0.1)
      .call(d3.axisBottom()
        .scale(x)
        .tickSize(-height, 0, 0)
        .tickFormat("")
      )

    // Compute kernel density estimation for each column:
    var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(80)) // increase this 40 for more accurate density.
    var BMIDensity = []
    var HIVDensity = []
    for (i = 0; i < n; i++) {
      key = categories[i]
      density = kde(dataBMIDict[categories[i]])
      BMIDensity.push({ key: key, density: density })
    }
    for (i = 0; i < n; i++) {
      key = categories[i]
      density = kde(dataHIVDict[categories[i]])
      HIVDensity.push({ key: key, density: density })
    }

    // Add areas
    svg.selectAll("areas")
      .data(BMIDensity)
      .enter()
      .append("path")
      .attr("transform", function (d) { return ("translate(0," + (yName(d.key) - height) + ")") })
      .attr("id", function (d) { return ("BMI-" + d.key) })
      .attr("fill", function (d) { return (lightenColor(currentColors[selectedStatesRidge.indexOf(d.key)], 0.2)) })
      .datum(function (d) { return (d.density) })
      .attr("opacity", 0.7)
      .attr("stroke", "#00A")
      .attr("stroke-width", 1)
      .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return y(d[1]); })
      )
      // add a tooltip on mouseover
      .on("mouseover", function (d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        //console.log(d)
        tooltip.html("BMI distribution area for this country")
        //tooltip.html("BMI distribution area for country: " + d.view.key)
          .style("left", (d.pageX + 10) + "px")
          .style("top", (d.pageY - 20) + "px");
      })
      // fade out tooltip on mouse out
      .on("mouseout", function () {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
    //console.log(BMIDensity)  

    svg.selectAll("areas")
      .data(HIVDensity)
      .enter()
      .append("path")
      .attr("transform", function (d) { return ("translate(0," + (yName(d.key) - height) + ")") })
      .attr("id", function (d) { return ("HIV/AIDS-" + d.key) })
      .attr("fill", function (d) { return (darkenColor(currentColors[selectedStatesRidge.indexOf(d.key)], 0.2)) })
      .datum(function (d) { return (d.density) })
      .attr("opacity", 0.7)
      .attr("stroke", "#A00")
      .attr("stroke-width", 1)
      .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return y(d[1]); })
      )
      // add a tooltip on mouseover
      .on("mouseover", function (d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html("HIV distribution area for this country")
        //tooltip.html("HIV distribution area for country: " + d.view.key)
          .style("left", (d.pageX + 10) + "px")
          .style("top", (d.pageY - 20) + "px");
      })
      // fade out tooltip on mouse out
      .on("mouseout", function () {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    for (let i = 0; i < states.length; i++) {
      index = statesListRidge.indexOf(states[i]);
      document.getElementById(`chip-ridge-${index}`).style.backgroundColor = currentColors[i % currentColors.length];
    }

    //console.log(selectedStatesRidge);
  

    d3.select("#chart3loader").style("display", "none");
  }

  $("#states-selector-ridge").selectize({
    delimiter: ",",
    persist: true,
    maxItems: 10,
    onChange: function (value) {
        // update selectedYears
        selectedStatesRidge = value;
        for (let i = 0; i < statesListRidge.length; i++) {
            if (value.includes(statesListRidge[i])) {
                document.getElementById(`chip-ridge-${i}`).classList.remove("hidden");
            } else {
                document.getElementById(`chip-ridge-${i}`).classList.add("hidden");
            }
        }
        //console.log(selectedStatesRidge)
        updateChart3(selectedStatesRidge);
        /*
        if (!firstTryAddStateRidge && value.length === 2) {
            console.log("👁️ Show tooltip");
            // show a tooltip over the second visible chip with the message "Try hovering over the chips"
            tooltip.transition()
                .duration(400)
                .style('opacity', .9)
                .attr("id", "hover-tooltip");
            tooltip.html(`👋🏻 Hello there!<br />Try hovering over the chips to isolate the year from the others.`)
                .style('left', `${document.getElementById(`chip-${statesListRidge.indexOf(+value[1])}`).getBoundingClientRect().x + 5}px`)
                .style('top', `${document.getElementById(`chip-${statesListRidge.indexOf(+value[1])}`).getBoundingClientRect().y + (window.pageYOffset || document.documentElement.scrollTop || 0) - document.getElementById(`chip-${statesListRidge.indexOf(+value[1])}`).getBoundingClientRect().height * 2 - 20}px`);
            firstTryAddStateRidge = true;
        }
        */
    },
    plugins: ['remove_button']
  });

  for (let i = 0; i < statesListRidge.length; i++) {  
    document.getElementById(`chip-ridge-${i}`).addEventListener("mouseover", function () {
      for (let j=0; j < statesListRidge.length; j++) {
        //console.log('j: ',j);
        if (j !== i) {
          let bmiElement = document.getElementById(`BMI-${statesListRidge[j]}`);
          let hivElement = document.getElementById(`HIV/AIDS-${statesListRidge[j]}`);

          if (bmiElement) {
              bmiElement.setAttribute("opacity", 0.05);
          } 
          if (hivElement) {
              hivElement.setAttribute("opacity", 0.05);
          } 
        }
      }
    });
    document.getElementById(`chip-ridge-${i}`).addEventListener("mouseout", function () {
      for (let j=0; j < statesListRidge.length; j++) {
        let bmiElement = document.getElementById(`BMI-${statesListRidge[j]}`);
        let hivElement = document.getElementById(`HIV/AIDS-${statesListRidge[j]}`);

        if (bmiElement) {
            bmiElement.setAttribute("opacity", 0.7);
        }
        if (hivElement) {
            hivElement.setAttribute("opacity", 0.7);
        } 
      }
    });
  }

  /*
  // modify the css class .item to add a background color, remove background image
  document.styleSheets[0].addRule(".selectize-input [data-value]", `background-color: ${currentColors[0]} !important;`);
  document.styleSheets[0].addRule(".selectize-input [data-value]", `background-image: none !important;`);
  document.styleSheets[0].addRule(".selectize-control.plugin-remove_button .item .remove", `border-left: 1px solid ${currentColors[0]} !important;`);
  document.styleSheets[0].addRule(".selectize-control.multi .selectize-input>div", `border: 1px solid ${currentColors[0]} !important;`);
  document.styleSheets[0].addRule(".selectize-control.multi .selectize-input>div", `background: ${currentColors[0]} !important;`);
  */

  // add options to the selectize
  let selectize = $("#states-selector-ridge")[0].selectize;
  selectize.clearOptions();
  statesListRidge.forEach(Country => {
      selectize.addOption({ value: Country, text: Country });
  });

  // default selected years the first year
  selectize.setValue(statesListRidge[0]);

  updateChart3([statesListRidge[0]]);

  d3.select("#info_text_ridgechart").style("display", "block");

  function lightenColor(color, factor) {
    // Converte il colore da esadecimale a RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Calcola il colore più chiaro
    const newR = Math.min(255, r + (255 - r) * factor);
    const newG = Math.min(255, g + (255 - g) * factor);
    const newB = Math.min(255, b + (255 - b) * factor);

    // Converte il colore risultante in esadecimale
    const newColor = `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;

    return newColor;
  }


  function darkenColor(color, factor) {
    // Converte il colore da esadecimale a RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Calcola il colore più scuro
    const newR = Math.max(0, r - r * factor);
    const newG = Math.max(0, g - g * factor);
    const newB = Math.max(0, b - b * factor);

    // Converte il colore risultante in esadecimale
    const newColor = `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;

    return newColor;
  }

  // This is what I need to compute kernel density estimation
  function kernelDensityEstimator(kernel, X) {
    return function (V) {
      return X.map(function (x) {
        return [x, d3.mean(V, function (v) { return kernel(x - v); })];
      });
    };
  }
  function kernelEpanechnikov(k) {
    return function (v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
  }
});

window.updateChart3 = updateChart3;