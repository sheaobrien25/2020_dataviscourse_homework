/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */

function staircase() {
    var barchart = document.getElementsByTagName("rect");
    let width_nodes = [];
    for (i of barchart) {
        width_nodes.push(parseInt(i.attributes.width.nodeValue));
    }
    width_nodes.sort((a, b) => a - b);
    let b = 0;
    for (i of barchart) {
        i.attributes.width.nodeValue = width_nodes[b]
        b = b + 1;
    }

    console.log(width_nodes);
}

// function staircase() {
//     var barchart = document.getElementById("aBarChart");
//     var i;
//     var width = 30;
//     for (i = 0; i < barchart.children.length; i++) {
//         barchart.children[i].setAttribute("width", width);
//         width += 10;
//     }

// }

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
    /**
     * D3 loads all CSV data as strings. While Javascript is pretty smart
     * about interpreting strings as numbers when you do things like
     * multiplication, it will still treat them as strings where it makes
     * sense (e.g. adding strings will concatenate them, not add the values
     * together, or comparing strings will do string comparison, not numeric
     * comparison).
     *
     * We need to explicitly convert values to numbers so that comparisons work
     * when we call d3.max()
     **/

    // console.log(data);
    for (let d of data) {
        d.cases = +d.cases; //unary operator converts string to number
        d.deaths = +d.deaths; //unary operator converts string to number
        //console.log(d.cases);
        //console.log(d.deaths);
    }

    // Set up the scales
    let barChart_width = 345;
    let areaChart_width = 295;
    let maxBar_width = 240;
    let data_length = 15;
    let aScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.cases)])
        .range([0, maxBar_width]);
    let bScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.deaths)])
        .range([0, maxBar_width]);
    let iScale_line = d3
        .scaleLinear()
        .domain([0, data.length])
        .range([10, 500]);
    let iScale_area = d3
        .scaleLinear()
        .domain([0, data_length])
        .range([0, 260]);

    // Draw axis for Bar Charts, Line Charts and Area Charts (You don't need to change this part.)
    d3.select("#aBarChart-axis").attr("transform", "translate(0,210)").call(d3.axisBottom(d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([barChart_width, barChart_width - maxBar_width])).ticks(5));

    d3.select("#aAreaChart-axis").attr("transform", "translate(0,245)").call(d3.axisBottom(d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([areaChart_width, areaChart_width - maxBar_width])).ticks(5));

    d3.select("#bBarChart-axis").attr("transform", "translate(5,210)").call(d3.axisBottom(bScale).ticks(5));
    d3.select("#bAreaChart-axis").attr("transform", "translate(5,245)").call(d3.axisBottom(bScale).ticks(5));

    let aAxis_line = d3.axisLeft(aScale).ticks(5);
    d3.select("#aLineChart-axis").attr("transform", "translate(50,15)").call(aAxis_line);
    d3.select("#aLineChart-axis").append("text").text("New Cases").attr("transform", "translate(50, -3)")

    let bAxis_line = d3.axisRight(bScale).ticks(5);
    d3.select("#bLineChart-axis").attr("transform", "translate(550,15)").call(bAxis_line);
    d3.select("#bLineChart-axis").append("text").text("New Deaths").attr("transform", "translate(-50, -3)")

    let aAxis_scatter = d3.axisBottom(aScale).ticks(5);
    d3.select("#x-axis").attr("transform", "translate(50,250)").call(aAxis_scatter);

    let bAxis_scatter = d3.axisLeft(bScale).ticks(5);
    d3.select("#y-axis").attr("transform", "translate(50,15)").call(bAxis_scatter);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
    d3.select("#aBarChart")
        .selectAll("rect")
        .data(data)
        .join("rect")
        //.attr("width", d => aScale(d.cases))
        .attr("y", (d, i) => i * 13)
        .attr("height", "12")
        .attr("transform", "translate(0, 0) scale(-1, 1)")
        .on("mouseover", function() {
            d3.select(this)
                .classed("hovered", true)
        })
        .on("mouseout", function() {
            d3.select(this)
                .classed("hovered", false)
        })
        .append("title")
        .text(function(d) {
            return "Value = " + d.cases
        });

    d3.select("#aBarChart")
        .selectAll("rect")
        .data(data)
        .transition()
        .duration(2000)
        .attr("width", d => aScale(d.cases));

    //body = d3.select("#bBarChart");
    var testing = d3.select("#bBarChart")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("fill", "steelblue")
        .attr("height", "12")
        //telling attributes there is a function, inputs are d and i (index)
        .attr("y", (d, i) => i * 13)
        .attr("transform", "translate(0, 0)")
        .on("mouseover", function() {
            d3.select(this)
                .classed("hovered", true)
        })
        .on("mouseout", function() {
            d3.select(this)
                .classed("hovered", false)
        });

    d3.select("#bBarChart")
        .selectAll("rect")
        .data(data)
        .transition()
        .duration(2000)
        .attr("width", d => bScale(d.deaths));

    // console.log(testing)
    // TODO: Select and update the 'a' line chart path using this line generator
    let aLineGenerator = d3
        .line()
        .x((d, i) => iScale_line(i))
        .y(d => aScale(d.cases));

    d3.select("#aLineChart")
        .datum(data)
        .attr("class", "line")
        .attr("d", aLineGenerator);

    // TODO: Select and update the 'b' line chart path (create your own generator)
    let bLineGenerator = d3
        .line()
        .x((d, i) => iScale_line(i))
        .y(d => bScale(d.deaths));

    d3.select("#bLineChart")
        .datum(data)
        .attr("class", "line")
        .attr("d", bLineGenerator)

    // TODO: Select and update the 'a' area chart path using this area generator
    let aAreaGenerator = d3
        .area()
        .x((d, i) => iScale_area(i))
        .y0(0)
        .y1(d => aScale(d.cases));

    d3.select("#aAreaChart")
        .datum(data)
        .attr("class", "area")
        .transition()
        .duration(2000)
        .attr("d", aAreaGenerator);

    // TODO: Select and update the 'b' area chart path (create your own generator)
    let bAreaGenerator = d3
        .area()
        .x((d, i) => iScale_area(i))
        .y0(0)
        .y1(d => bScale(d.deaths));

    d3.select("#bAreaChart")
        .datum(data)
        .attr("class", "area")
        .transition()
        .duration(2000)
        .attr("d", bAreaGenerator);

    // TODO: Select and update the scatterplot points
    d3.select("#scatterplot")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => aScale(d.cases))
        .attr("cy", d => bScale(d.deaths))
        .attr("r", 5)
        .on("mouseover", function() {
            d3.select(this)
                .classed("hovered", true);
        })
        .on("mouseout", function() {
            d3.select(this)
                .classed("hovered", false);
        })
        .on("click", function() {
            //d3.select(this)
            console.log("X: " + this.getAttribute("cx"));
            console.log("Y: " + this.getAttribute("cy"));
        });

    d3.select("#scatterplot")
        .selectAll("circle")
        .data(data)
        .selectAll("title")
        .data(d => [d])
        .join("title")
        .text((d) => {
                aScale(d.cases)
                bScale(d.deaths)
                let text_content = `${aScale(d.cases)}, ${bScale(d.deaths)}`
                return text_content;
            }
            // ****** TODO: PART IV ******
        )
}
d3.select("#aBarChart")
    .transition()
    .delay(2000)
    .duration(3000)
    .ease(d3.easeLinear)


/**
 * Update the data according to document settings
 */
async function changeData() {
    //  Load the file indicated by the select menu
    let dataFile = document.getElementById("dataset").value;
    try {
        const data = await d3.csv("data/" + dataFile + ".csv");
        if (document.getElementById("random").checked) {
            // if random
            update(randomSubset(data)); // update w/ random subset of data
        } else {
            // else
            update(data); // update w/ full data
        }
    } catch (error) {
        console.log(error)
        alert("Could not load the dataset!");
    }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
    return data.filter(d => Math.random() > 0.5);
}