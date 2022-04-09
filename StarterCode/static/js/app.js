
function toNum(num) {
    return num.toString()
}

// pass in an individual id and pull a sample and related otu_ids
function chartcreation(person_id) {
    d3.json("samples.json").then((data) => {
        var person_samples = data.samples;
        var personlist = person_samples.filter(
            personobject => personobject.id == person_id);

        person = personlist[0];
        console.log(person);
        
        let ids = person.otu_ids;
        let order_ids = ids.reverse().slice(-10);
        let otu_ids = []
        for (var i = 0; i < 10; i++) {
            order_ids[i]
            otu_ids.push("OTU "+order_ids[i])
        }
        
        console.log(otu_ids)
        let otu_labels = person.otu_labels.reverse().slice(-10);
        let sample_values = person.sample_values.reverse().slice(-10);
        
        //setup chart components for horizontal bar chart
        var trace1 = {
            x: sample_values,
            y: otu_ids,
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
            height: 400,
            width: 1200,
            magin: {t:0},
            
        };

        Plotly.newPlot("bubble", bub_data, bub_layout)

    });
};


function init() {
    d3.json("samples.json").then(data => {
        console.log("read samples");
        console.log(data);
    
        let dropdownMenu = d3.select("#selDataset");
        data.names.forEach((name) => {
            dropdownMenu.append('option').text(name);
        })

        var first_name = data.names[0];
        chartcreation(first_name);

    });
}
function optionChanged(value) {
    console.log(value);
    chartcreation(value);
}

init();