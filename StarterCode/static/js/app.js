
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
        var otu_ids = person.otu_ids;
        //var otu_ids_string = otu_ids.map(toNum)
        console.log(otu_ids)
        var otu_labels = person.otu_labels;
        var sample_values = person.sample_values;
        
        //setup chart components
        var trace1 = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids
            .slice(0,10)
            // string
            .reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }

        let chart_data = [trace1];

        let layout = {
            title: "Bar Chart",
            height: 400,
        };

        Plotly.newPlot("bar", chart_data, layout)


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