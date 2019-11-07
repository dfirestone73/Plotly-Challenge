function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var urlMeta = `/metadata/${sample}`;

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(urlMeta).then(function (Bdata) {

    var panel = d3.select("#sample-metadata")
    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(Bdata).forEach((key, value) => {
      panel.append("h6").text(`${key}:${value}`);
    })

    // var Gdata = [
    //   {
    //     type: "indicator",
    //     mode: "gauge+number+delta",
    //     value: 420,
    //     title: { text: "Speed", font: { size: 24 } },
    //     delta: { reference: 400, increasing: { color: "green" } },
    //     gauge: {
    //       axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" },
    //       bar: { color: "darkblue" },
    //       bgcolor: "white",
    //       borderwidth: 2,
    //       bordercolor: "gray",
    //       steps: [
    //         { range: [0, 250], color: "white" },
    //         { range: [250, 400], color: "darkgreen" }
    //       ],
    //       threshold: {
    //         line: { color: "red", width: 4 },
    //         thickness: 0.75,
    //         value: 490
    //       }
    //     }
    //   }
    // ];

    // var layoutG = {
    //   width: 500,
    //   height: 400,
    //   margin: { t: 25, r: 25, l: 25, b: 25 },
    //   paper_bgcolor: "green",
    //   font: { color: "black", family: "Arial" }
    // };

    // Plotly.newPlot('buildGuage', Gdata, layoutG);

  });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);


};

function buildCharts(sample) {
  var urlChart = `/samples/${sample}`;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(urlChart).then(function (response) {

    // @TODO: Build a Bubble Chart using the sample data
    var desired_maximum_marker_size = 40;
    var size = response.sample_values;
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: ['A</br>size: 40</br>sixeref: 1.25', 'B</br>size: 60</br>sixeref: 1.25', 'C</br>size: 80</br>sixeref: 1.25', 'D</br>size: 100</br>sixeref: 1.25'],
      mode: 'markers',
      marker: {
        color: response.sample_values,
        size: size,
        //set 'sizeref' to an 'ideal' size given by the formula sizeref = 2. * max(array_of_size_values) / (desired_maximum_marker_size ** 2)
        sizeref: 2.0 * Math.max(...size) / (desired_maximum_marker_size ** 2),
        sizemode: 'area'
      }
    };

    var dataB = [trace1];

    var layoutB = {
      title: 'Belly Button Samples',
      showlegend: false,
      height: 600,
      width: 1000,
      xaxis: { title: 'Sample ID' },
      yaxis: { title: 'Sample Volume' }
    };

    Plotly.newPlot('bubble', dataB, layoutB);

    // @TODO: Build a Pie Chart
    var Pvalues = response.sample_values.slice(0, 9);
    var Plabels = response.otu_ids.slice(0, 9);

    var pchart = [{
      values: Pvalues,
      labels: Plabels,
      type: 'pie'
    }];

    var layoutP = {
      title: 'Top 10 Samples by Volume',
      showlegend: true,
      height: 400,
      width: 700,
      legend: { title: 'ID Number' }
    };

    Plotly.newPlot('pie', pchart, layoutP);

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).



  });

};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
