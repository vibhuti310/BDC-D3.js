// Sample data
const data = [
    { fruit: 'Apple', quantity: 10 },
    { fruit: 'Banana', quantity: 15 },
    { fruit: 'Orange', quantity: 8 },
    { fruit: 'Grapes', quantity: 12 },
    { fruit: 'Strawberry', quantity: 9 }
];

// Chart dimensions
const width = 400;
const height = 300;
const margin = { top: 20, right: 30, bottom: 40, left: 40 };

// Create an SVG element within the chart container
const svg = d3.select('#scales-chart').append('svg')
    .attr('width', width)
    .attr('height', height);

// Create x and y scales
const xScale = d3.scaleBand()
    .domain(data.map(d => d.fruit))
    .range([margin.left, width - margin.right])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.quantity)])
    .nice()
    .range([height - margin.bottom, margin.top]);

// Create bars
svg.selectAll('rect')
    .data(data)
    .enter().append('rect')
    .attr('x', d => xScale(d.fruit))
    .attr('y', d => yScale(d.quantity))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - margin.bottom - yScale(d.quantity))
    .attr('fill', 'steelblue');

// Create x-axis
const xAxis = d3.axisBottom(xScale);
svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis);

// Create y-axis
const yAxis = d3.axisLeft(yScale);
svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxis);
