//1. functions for displaying bar, scatter, 
// 2. function for demographic table and gauge
// 3. functions init for data displayed on page load
// 4. function for passing in new data on user selection

// pass in an individual id and pull a sample and related otu_ids
function chartcreation(person_id) {
    d3.json("samples.json").then((data) => {
        var person_samples = data.samples;
        var personlist = person_samples.filter(
            personobject => personobject.id == person_id);

        var person = personlist[0];
        console.log(person);
        
        let ids = person.otu_ids;
        //first pass at formatting and sorting lables for the horizontal chart
        // let order_ids = ids.reverse().slice(-10);
        // let otu_ids = []
        // for (var i = 0; i < 10; i++) {
        //     order_ids[i]
        //     otu_ids.push("OTU "+order_ids[i])
        // }
        //console.log(otu_ids)
        let otu_labels = person.otu_labels.reverse().slice(-10);
        let sample_values = person.sample_values.reverse().slice(-10);
        
        //setup chart components for horizontal bar chart
        var trace1 = {
            x: sample_values,
            //y: otu_ids, alternative way to format bar graph
            y: ids
                .slice(0,10)
                .map((x) => `OTU ${x}`)
                .reverse(),
            text: otu_labels,
            type: "bar",
            orientation: "h"
        }

        let chart_data = [trace1];

        var layout = {
            title: "Bar Chart",
            yaxis: { type: 'category'},
            height: 400
        };

        Plotly.newPlot("bar", chart_data, layout)

        //setup chart components for bubble chart
        var trace2 = {
            x: ids,
            y: sample_values,
            text: otu_labels,
            type: "scatter",
            mode: "markers",
            text: otu_labels,
            marker: {
                color: ids,
                size: sample_values,
                colorscale: "Electric"
            },
        }

        var bub_data = [trace2];

        var bub_layout = {
            title: "Dashboard",
            paper_bgcloer:'rgba(0,0,0,0)',
            plot_bgcloer:'rgba(0,0,0,0)',
            yaxis: { title: 'sample_values'},
            yaxis: {range: [0,250]},
            xaxis: {title: 'otu_ids'},
            yaxis: {title: 'values'},
            //height: 700,
            width: window.width,
            magin: {t:0},
            
        };

        Plotly.newPlot("bubble", bub_data, bub_layout)

    });
};


//fuction to use d3 to get json file data and look for 'metadata', id, 
//and add to demographic table
//add the attributes to an object for the id passed in
function buildTable(person_id) {
    d3.json("samples.json").then((data) => {
        var meta_data = data.metadata;
        var personlist = meta_data.filter(
            personobject => personobject.id == person_id);
            
        var person = personlist[0];
        var table = d3.select("#sample-metadata");
        
        //clear existing data from table
        table.html("");
        Object.entries(person).forEach(([key,value]) => {
            table.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

        // gauge functionality here as it uses the metadata
        var gauge = [
            {
              domain: { x: [0, 5], y: [0, 1] },
              value: person.wfreq,
              text: person.wfreq,
              title: { text: "Washing Frequency <br>scrubs per week</br>" },
              type: "indicator",
              mode: "gauge+number",
              delta: { reference: 10 },
              gauge: {
                axis: { range: [null, 9] },
                steps: [
                  { range: [0, 1], color: "lightgray" },
                  { range: [1, 2], color: "gray" },
                  { range: [2, 3], color: "lightgreen" },
                  { range: [3, 4], color: "green" },
                  { range: [4, 5], color: "lightblue" },
                  { range: [5, 6], color: "blue" },
                  { range: [6, 7], color: "lightpurple" },
                  { range: [7, 8], color: "purple" },
                  { range: [8, 9], color: "red" },
                ],
              }
            }
          ];
          
          var glayout = { width: 400, height: 400, margin: { t: 75, r: 25, l: 25, b: 25 } };
          Plotly.newPlot('gauge', gauge, glayout);
          

    });
};

//default data that is passed into the functions above
function init() {
    d3.json("samples.json").then(data => {
        console.log("read samples");
        console.log(data);
        //data passed into drop down allowing user to select addtional ids
        let dropdownMenu = d3.select("#selDataset");
        data.names.forEach((name) => {
            dropdownMenu.append('option').text(name);
        })

        var first_name = data.names[0];
        chartcreation(first_name);
        buildTable(first_name);
    });
}
//once user makes a new selection in the drop down, the new ids are passed to the functions above
function optionChanged(value) {
    console.log(value);
    chartcreation(value);
    buildTable(value);
}

//run on page load
init();