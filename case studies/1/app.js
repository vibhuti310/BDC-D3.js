const dimensions = {
	width: 600,
	height: 200,
	marginTop: 8
}

const xAccessor = (d) => d.date
const yAccessor = (d) => d.downloads

const formatDate = d3.timeFormat('%Y-%m-%d')

const getText = (data, d) => {
	const to = xAccessor(d)
	const from = d3.timeDay.offset(to, -7)
	
	return `${formatDate(from)} to ${formatDate(to)}`
}

const draw = (data) => {
	const wrapper = d3.select('[data-wrapper]')
	
	const svg = wrapper
		.select('[data-chart]')
		.append('svg')
		.attr('width', dimensions.width)
		.attr('height', dimensions.height)
		.attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)
	
	const xDomain = d3.extent(data, xAccessor)
	const yDomain = [0, d3.max(data, yAccessor)]
	
	const xScale = d3.scaleTime()
		.domain(xDomain)
		.range([0, dimensions.width])
	
	const yScale = d3.scaleLinear()
		.domain(yDomain)
		.range([dimensions.height, dimensions.marginTop])
	
	/* Area */
	const areaGenerator = d3.area()
		.x((d) => xScale(xAccessor(d)))
		.y1((d) => yScale(yAccessor(d)))
		.y0(dimensions.height)
		.curve(d3.curveBumpX)
	
	const area = svg
		.append('path')
		.datum(data)
		.attr('d', areaGenerator)
		.attr('fill', 'var(--fill)')
	
	/* Line */
	const lineGenerator = d3.line()
		.x((d) => xScale(xAccessor(d)))
		.y((d) => yScale(yAccessor(d)))
		.curve(d3.curveBumpX)
	
	const line = svg
		.append('path')
		.datum(data)
		.attr('d', lineGenerator)
		.attr('stroke', 'var(--stroke)')
		.attr('stroke-width', 5)
		.attr('stroke-linejoin', 'round')
		.attr('fill', 'none')
	
	/* Markers */
	const markerLine = svg
		.append('line')
		.attr('x1', 0)
		.attr('x2', 0)
		.attr('y1', 0)
		.attr('y2', dimensions.height)
		.attr('stroke-width', 3)
		.attr('stroke', 'var(--marker, var(--stroke))')
		.attr('opacity', 0)
	
	const markerDot = svg
		.append('circle')
		.attr('cx', 0)
		.attr('cy', 0)
		.attr('r', 8)
		.attr('fill', 'var(--marker, var(--stroke))')
		.attr('opacity', 0)
	
	/* Bisector */
	const bisect = d3.bisector(xAccessor)
	
	/* Events */
	svg.on('mousemove', (e) => {
		const [posX, posY] = d3.pointer(e)
		const date = xScale.invert(posX)

		const index = bisect.center(data, date)
		const d = data[index]
		
		const x = xScale(xAccessor(d))
		const y = yScale(yAccessor(d))
		
		markerLine
			.attr('x1', x)
			.attr('x2', x)
			.attr('opacity', 1)
		
		markerDot
			.attr('cx', x)
			.attr('cy', y)
			.attr('opacity', 1)
		
		d3.select('[data-heading]').text(getText(data, d))
		d3.select('[data-total]').text(yAccessor(d))
	})
	
	svg.on('mouseleave', () => {
		const lastDatum = data[data.length - 1]
		
		markerLine.attr('opacity', 0)
		markerDot.attr('opacity', 0)
		
		d3.select('[data-heading]').text('Weekly downloads')
		d3.select('[data-total]').text(yAccessor(lastDatum))
	})
}

const sortData = (data) => {
	return data.map((d) => {
		return {
			...d,
			date: new Date(d.date)
		}
	}).sort((a, b) => d3.ascending(a.date, b.date))
}

d3.json('https://api.npoint.io/9f3edee2d00c8ade835c')
	.then(data => {
		const sortedData = sortData(data)
		draw(sortedData)
	})
	.catch(error => console.log(error))

/* Toggle color scheme */
const inputs = d3.selectAll('input[type="radio"]')

const colors = inputs.nodes().map((input) => {
	return input.value
})

d3.select('.controls-list')
	.on('click', (e) => {
		const { value, checked } = e.target
		
		if (!value || !checked) return
	
		document.body.classList.remove(...colors)
		document.body.classList.add(value)
	})