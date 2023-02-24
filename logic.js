url = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"

// Perform a GET request to the query URL.
d3.json(url).then(function (data) {
    console.log(data);
    // selecting the dropdown menu
    let dropDown = d3.select("#selDataset")
    data.forEach((pokemon) => {
        // appending the pokemon's english name to the dropdown menu
        dropDown.append("option").text(pokemon.name.english)
    })
    buildChart(data[0].name.english)
});

// option change function (changes the charts when a new dropdown is selected)
function optionChanged(selectedID) {
    buildChart(selectedID)
    buildComparison(selectedID)
}

// building bar chart, pokemon name selector, and image
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

        // displaying type information
        let panel = d3.select("#sample-metadata")
        panel.html("")

        // adding pokemon type information
        for (key in pokemonData.type) {
            panel.append("h6").text(`${pokemonData.type[key].toUpperCase()}`)
        }

        // bar chart data
        let x = Object.keys(pokemonData.base)
        console.log(x)
        let y = x.map(stat => pokemonData.base[stat])
        console.log(y)

        // let hoverText = filteredData.otu_labels.slice(0, 10).reverse()

        // bar chart pokemon stats
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

        // displaying pokemon pictures
        let picture = d3.select("#picture")
        picture.html("")
        picture.append("img").attr("src", `./Images/pokemon/${pokemonData.id}.png`).attr("width", 165).attr("height", 165)
    })
}

d3.json("http://127.0.0.1:5000/api/v1.0/type_counts").then(function (data) {
    // building bubble chart of pokemon types using flask api
    let trace1 = {
        x: data.x,
        y: data.y,
        // text: `${data.x} and ${data.y}`,
        mode: 'markers',
        marker: {
            color: data.size,
            size: data.size,
            colorscale: "Portland"
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

// Building scatterplot(fran)
d3.json(url).then(function (data) {
    let trace1 = {
        x: data.map(row => row.base.Defense),
        y: data.map(row => row.base.Attack),
        mode: 'markers',
        type: 'scatter',
        text: data.map(row => row.name.english),
        name: 'Pokemon',
        marker: {
            size: 8,
            color: data.map(row => row.base.HP),
            colorscale: 'Portland',
            showlegend: true,
        }
    };
    // Creating Dummy plot to show Colorscal Legend (fran)
    let trace2 = {
        z: [[0], [250]],
        type: 'heatmap',
        colorscale: 'Portland',
    };

    var data = [trace1, trace2,];

    var layout1 = {
        title: 'Attack and Defense Distribution <br> (Colorscale shows HP)',
        xaxis: { title: 'Defense' },
        yaxis: { title: 'Attack' },
        showlegend: true,
        legend: { "orientation": "h" }
    };

    let config1 = {
        responsive: true
    }
    // plotting scatter chart (fran)
    Plotly.newPlot('scatter', data, layout1, config1)
})

// building the comparison chart
let buildComparison = (selectedID) => {
    // selecting pokemon csv data
    d3.csv("pokemon.csv").then((data) => {
        // positioning the chart in our comparison div tag
        var chartDom = document.getElementById('comparison');
        // filtering the data
        var pokemonData = data.filter(row => row.name == selectedID)[0]
        console.log(pokemonData)
        var myChart = echarts.init(chartDom);
        var option;

        option = {
            backgroundColor: '#FFFFFF',
            tooltip: {},
            legend: {
                textStyle: { color: '#000000' }
            },
            // x axis labels
            xAxis: [
                {
                    data: [selectedID, '', "Average Person"],
                    axisTick: { show: false },
                    axisLine: { show: false },
                    axisLabel: {
                        margin: 20,
                        color: '#000000',
                        fontSize: 14
                    }
                }
            ],
            // empty y axis
            yAxis: {
                splitLine: { show: false },
                axisTick: { show: false },
                axisLine: { show: false },
                axisLabel: { show: false }
            },
            markLine: {
                z: -1
            },
            animationEasing: 'elasticOut',
            series: [
                {
                    type: 'pictorialBar',
                    name: 'All',
                    emphasis: {
                        scale: true
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c} m',
                        fontSize: 16,
                        color: '#1976e0'
                    },
                    data: [
                        // pokemon image, positioning, and height
                        {
                            value: Number(pokemonData["height_m"]),
                            symbol: 'image://' + `Images/pokemon/${pokemonData['pokedex_number']}.png`,
                            symbolSize: ['150%', '150%'],
                            symbolOffset: [0, '-15%'],
                            symbolPosition: 'end',
                        },
                        {
                            value: '-',
                            symbol: 'none'
                        },
                        // ash ketchum image, positioning, and height
                        {
                            value: 1.7,
                            symbol:
                                'image://' + `Images/ash.png`,
                            symbolSize: ['200%', '105%'],
                            symbolPosition: 'end',
                            z: 10
                        },
                    ],
                    // dotted lines on the chart
                    markLine: {
                        symbol: ['none', 'none'],
                        label: {
                            show: false
                        },
                        lineStyle: {
                            color: '#1976e0',
                            width: 2
                        },
                        // dotted line positioning
                        data: [
                            {
                                yAxis: 1.7
                            },
                            {
                                yAxis: Number(pokemonData["height_m"])
                            }
                        ]
                    }
                },
                {
                    name: 'All',
                    type: 'pictorialBar',
                    barGap: '-100%',
                    symbol: 'none',
                    itemStyle: {
                        color: '#185491'
                    },
                    silent: true,
                    symbolOffset: [0, '50%'],
                    z: -10,
                    data: [
                        {
                            value: 1,
                            symbolSize: ['150%', 50]
                        },
                        {
                            value: '-'
                        },
                        {
                            value: 1,
                            symbolSize: ['200%', 50]
                        },
                    ]
                } 
            ]
        };

        option && myChart.setOption(option);
    })         
}
