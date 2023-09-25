// Sample data for the Donut Chart
const data = [
    { label: "Sales", value: 3000 },
    { label: "Marketing", value: 570 },
    { label: "Development", value: 1500 },
    { label: "CS", value: 800 },
    { label: "Finance", value: 1200 },
];


// Chart dimensions
const width = 400;
const height = 400;
const radius = Math.min(width, height) / 2;

// Colors for the chart slices
const colors = d3.scaleOrdinal(d3.schemeCategory10);

// Create an SVG element within the chart container
const svg = d3.select("#donut-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

// Create a pie generator
const pie = d3.pie()
    .sort(null) // Disable sorting
    .value(d => d.value);

// Define an arc generator for the outer and inner arcs
const outerArc = d3.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 20);

const innerArc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius - 120);

// Create a group for the pie chart slices
const g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

// Draw the outer arc slices
g.append("path")
    .attr("d", outerArc)
    .style("fill", d => colors(d.data.label))
    .style("stroke", "#fff");

// Draw the inner arc slices (donut hole)
g.append("path")
    .attr("d", innerArc)
    .style("fill", "white");

// Add labels to the slices
g.append("text")
    .attr("transform", d => `translate(${outerArc.centroid(d)})`)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .text(d => d.data.label);

// Add a title to the chart
svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "-1em")
    .text("Donut Chart");
