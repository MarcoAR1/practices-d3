const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const req = new XMLHttpRequest()
req.open('GET', url, true)
req.onload = () => {
  insertData(JSON.parse(req.response))
}
req.send()

const insertData = ({ data }) => {
  const width = data.length * 3
  const height = 550
  const padding = 60
  const xScale = d3
    .scaleTime()
    .domain([
      new Date(d3.min(data, (d) => d[0])),
      new Date(d3.max(data, (d) => d[0])),
    ])
    .range([padding, width - padding])

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([height - padding, padding])

  const xAxis = d3
    .axisBottom(xScale)
    .ticks(d3.timeYear.every(1))
    .tickFormat((d) => (d.getMonth() === 0 ? d.getFullYear() : null))

  const yAxis = d3.axisLeft(yScale).ticks(20)

  const divContainer = d3
    .select('body')
    .append('div')
    .attr('id', 'container')
    .style('width', `${width}px`)
    .style('height', `${height}px`)

  divContainer.append('div').attr('id', 'title').text('United States GDP')
  divContainer
    .append('div')
    .text('Unit in billons 1 = 1 Billion')
    .attr('id', 'x-axis-label')
    .style('left', `-${20}px`)

  const svg = divContainer
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const divTooltip = divContainer
    .append('div')
    .style('opacity', 0)
    .attr('id', 'tooltip')

  svg
    .append('g')
    .attr('transform', `translate(0,${height - padding})`)
    .call(xAxis)
    .attr('id', 'x-axis')
    .selectAll('text')
    .attr('dx', '-20')
    .attr('dy', '0')
    .attr('transform', 'rotate(-65)')
  svg
    .append('g')
    .attr('transform', `translate(${padding - 2},0)`)
    .call(yAxis)
    .attr('id', 'y-axis')
    .selectAll('text')
    .text((e) => e)

  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('x', (d) => xScale(new Date(d[0])) - 1)
    .attr('y', (d) => yScale(d[1]))
    .attr('width', 2)
    .attr('height', (d) => height - padding - yScale(d[1]))
    .attr('fill', 'cyan')
    .attr('class', 'bar')
    .on('mouseover', (_, d) => {
      divTooltip
        .attr('data-date', d[0])
        .transition()
        .duration(200)
        .style('opacity', 0.9)
      divTooltip
        .html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`)
        .style('left', `${xScale(new Date(d[0])) + 20}px`)
        .style('top', `${height / 2}px`)
    })
    .on('mouseout', () => {
      divTooltip.transition().duration(500).style('opacity', 0)
    })
}
