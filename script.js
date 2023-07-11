import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

let data;	

let xScale;
let yScale;
let xAxisScale;
let yAxisScale;	

const width = 800;
const height = 600;
const padding = 60;

const drawCanvas = () => {
	d3.select("svg")
		.style("width", width)
		.style("height", height)
}

const generateScales = () => {
	const timeArray = data.map((item) => {
		const time = parseInt(item.Time)
		return time
	});

	xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
    .range([padding, width - padding]);

  yScale = d3
    .scaleLinear()
    .domain([d3.max(timeArray) + 0.5, d3.min(timeArray)])
    .range([height - padding, padding]);
	
	xAxisScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
		.range([padding, width - padding]);	
	

	yAxisScale = d3
    .scaleLinear()
    .domain([d3.max(timeArray) + 0.5, d3.min(timeArray)])
    .range([height - padding, padding])
}

const generateAxes = () => {
	const xAxis = d3.axisBottom(xAxisScale).tickFormat((d) => d);
	d3.select("svg")
    .append("g")
    .attr("transform", "translate(0, " + (height - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis);

	const yAxis = d3.axisLeft(yAxisScale).tickFormat((d) => {
    // Convert the number to a string
    const numString = d.toString();

    // Split the string into two parts: the integer part and the decimal part
    const [integerPart, decimalPart] = numString.split(".");

    // Pad the decimal part with zeros if necessary
    const paddedDecimalPart = decimalPart ? decimalPart.padEnd(2, "0") : "00";

    // Return the formatted string
    return `${integerPart}:${paddedDecimalPart}`;
  });
	d3.select("svg")
		.append("g")
		.attr("transform", "translate(" + (padding) + ", 0)")	
		.attr("id", "y-axis")
		.call(yAxis)							 	
}

const generateCircles = () => {
	d3.select("svg")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (item) => xScale(item.Year))
    .attr("cy", (item) => {
      //comes as string
      const time = parseFloat(item.Time.replace(":", ""));
      return yScale(time / 100);
    })
    .attr("r", 5)
    .style("fill", (item) => {
      if (
        item.Place === 27 ||
        item.Place === 28 ||
        item.Place === 16 ||
        item.Place === 26 ||
        item.Place === 35 ||
        item.Place === 22
      ) {
        return "green";
      } else {
        return "orange";
      }
    })
    .attr("class", "dot")
    .attr("data-xvalue", (item) => item.Year)
    .attr("data-yvalue", (item) => {
      return new Date(item.Seconds * 1000);
    })
    .append("title")
    .attr("id", "tooltip")
		.attr("data-year", (item) => item.Year)
    .text((item) => {
      if (
        item.Place === 27 ||
        item.Place === 28 ||
        item.Place === 16 ||
        item.Place === 26 ||
        item.Place === 35 ||
        item.Place === 22
      ) {
        return (
          item.Name +
          ": " +
          item.Nationality +
          "\nYear: " +
          item.Year +
          ", Time: " +
          item.Time
        );
      } else {
        return (
          item.Name +
          ": " +
          item.Nationality +
          "\nYear: " +
          item.Year +
          ", Time: " +
          item.Time +
          "\n\n" +
          item.Doping
        );
      }
    });
}

const generateTexts = () => {
	d3.select("svg")
    .append("g")
    .attr("id", "legend")
		.append("text")
    .text("No doping allegations")
    .attr("x", 622)
    .attr("y", 320)

	d3.select("svg")	
    .append("rect")
    .attr("x", 712)
    .attr("y", 311)
    .attr("height", 12)
    .attr("width", 12)
    .style("fill", "green");

	d3.select("svg")
    .append("g")
    .attr("id", "legend")
		.append("text")
    .text("Riders with doping allegations")
    .attr("x", 589)
    .attr("y", 334)

	d3.select("svg")	
    .append("rect")
    .attr("x", 712)
    .attr("y", 325)
    .attr("height", 12)
    .attr("width", 12)
    .style("fill", "orange");

	d3.select("svg")
    .append("g")
    .attr("id", "year-text")
    .append("text")
    .text("Year")
    .attr("x", 759)
    .attr("y", 546);

	d3.select("svg")
    .append("g")
    .attr("id", "minutes-text")
    .append("text")
    .text("Minutes")
    .attr("x", 24)
    .attr("y", 40);

}

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    data = response;
		console.log(data[0]);
		drawCanvas();
		generateScales();
		generateAxes();
		generateCircles();
		generateTexts()	
  })
  .catch((error) => {
    console.log("An error occurred:", error);
  });

						
