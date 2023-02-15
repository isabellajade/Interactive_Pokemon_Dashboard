url = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"

// Perform a GET request to the query URL.
d3.json(url).then(function (data) {
    console.log(data);
    let dropDown = d3.select("#selDataset")
    data.forEach((pokemon) => {
        dropDown.append("option").text(pokemon.name.english)
    })
});

// option change function
function optionChanged(selectedID) {
    buildChart(selectedID)
}

let buildChart = (selectPokemon) => {
    d3.json(url).then((data) => {
        // selecting the dropdown
        let dropDown = d3.select("#selDataset")

        if (!data) {
            return
        } console.log(selectPokemon)
        // setting variables for chart
        var pokemonData = data.filter(row => row.name.english == selectPokemon)[0]
        console.log(pokemonData)
        
        // display type information
        let panel = d3.select("#sample-metadata")
        panel.html("")
        // adding demographic data
        for (key in pokemonData.type) {
            panel.append("h6").text(`${pokemonData.type[key].toUpperCase()}`)
        }
        let x = Object.keys(pokemonData.base)
        console.log(x)
        let y = x.map(stat => pokemonData.base[stat])
        console.log(y)
        // let hoverText = filteredData.otu_labels.slice(0, 10).reverse()
        // // bar chart data
        let barData = [
            {
                x: x,
                y: y,
                // text: hoverText,
                type: "bar",
                orientation: "v"
            }
        ]
        let layout = {
            title: `${pokemonData.name.english} Stats`
        }
        let config = {
            responsive: true
        }
        // plotting bar chart data
        Plotly.newPlot("bar", barData, layout, config)

        let picture = d3.select("#picture")
        picture.html("") 
        picture.append("img").attr("src",`./Images/pokemon/${pokemonData.id}.png`).attr("width", 165).attr("height", 165)
    })
}

d3.json("http://127.0.0.1:5000/api/v1.0/type_counts").then(function (data) {
    // building bubble chart
    let trace1 = {
        x: data.x,
        y: data.y,
        // text: filteredData.otu_labels,
        mode: 'markers',
        marker: {
            color: data.size,
            size: data.size,
            colorscale: "Earth"
        }
    };

    var data = [trace1];

    var layout1 = {
        title: 'Pokemon Types',
        showlegend: false
    };

    let config1 = {
        responsive: true
    }
    // plotting bubble chart
    Plotly.newPlot('bubble', data, layout1, config1)
})