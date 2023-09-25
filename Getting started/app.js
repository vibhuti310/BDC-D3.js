// Sample data
const data = [
    { fruit: 'Apple', quantity: 10 },
    { fruit: 'Banana', quantity: 15 },
    { fruit: 'Orange', quantity: 8 }
  ];
  
  // Select the chart container
  const chartContainer = d3.select('#chart-container');
  
  // Define the dimensions of the chart
  const width = 400;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  
  // Calculate the inner dimensions of the chart (excluding margins)
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Create an SVG element within the chart container
  const svg = chartContainer
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Create a group (g) element for the bars, translate it to account for margins
  const barsGroup = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Define the scale for the x-axis (horizontal)
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.fruit))
    .range([0, innerWidth])
    .padding(0.1);
  
  // Define the scale for the y-axis (vertical)
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.quantity)])
    .nice()
    .range([innerHeight, 0]);
  
  // Create and append the bars to the chart
  barsGroup
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d.fruit))
    .attr('y', (d) => yScale(d.quantity))
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => innerHeight - yScale(d.quantity))
    .attr('fill', 'steelblue');
  
  // Create and append x-axis
  const xAxis = d3.axisBottom(xScale);
  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(${margin.left},${height - margin.bottom})`)
    .call(xAxis);
  
  // Create and append y-axis
  const yAxis = d3.axisLeft(yScale).ticks(5);
  svg
    .append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .call(yAxis);
  