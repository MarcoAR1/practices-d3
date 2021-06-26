const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
const req = new XMLHttpRequest()
req.open('GET', url, true)
req.onload = () => {
  insertScatterPlot(JSON.parse(req.response))
}
req.send()

const insertScatterPlot = (data) => {
  //Settings
  const Doping = ['red', 'green']
  const width = 500
  const height = 500
  const padding = 50
  const radius = 5
  const timeFormat = '%M:%S'
  const timeParseFormat = (time) => d3.timeParse(timeFormat)(time)

  //Scales
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, ({ Year }) => Year) - 1,
      d3.max(data, ({ Year }) => Year),
    ])
    .range([padding, width - padding])

  const yScale = d3
    .scaleTime()
    .domain([
      d3.max(data, ({ Seconds }) => new Date(Seconds * 1000)),
      d3.min(data, ({ Seconds }) => new Date(Seconds * 1000)),
    ])
    .range([height - padding, padding])
  // Axes
  const xAxis = d3.axisBottom(xScale).tickFormat((e) => e)
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat((e) => d3.timeFormat(timeFormat)(e))

  // Elements
  const container = d3
    .select('body')
    .append('div')
    .style('width', `${width + 30}px`)
    .style('height', `${height}px`)
    .attr('id', 'container')

  container
    .append('div')
    .html(
      `Doping in Professional Bicycle Racing <br> 35 Fastest times up Alpe d'Huez`
    )
    .attr('id', 'title')
    .attr(
      'transform',
      `translate(${(width - padding) / 2},${(height - padding) / 3.5})`
    )

  const divTooltip = container
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)

  const svg = container
    .append('svg')
    .attr('id', 'scatterplot')
    .attr('width', width)
    .attr('height', height)
    .attr('overflow', 'visible')

  svg
    .append('g')
    .attr('transform', `translate(0,${height - padding})`)
    .call(xAxis)
    .attr('id', 'x-axis')

  svg
    .append('g')
    .attr('transform', `translate(${padding},0)`)
    .call(yAxis)
    .attr('id', 'y-axis')

  svg
    .append('text')
    .attr('id', 'y-axis-label')
    .attr(
      'transform',
      `translate(${padding - 60},${(height - padding) / 2})rotate(90)`
    )
    .text('Time in Minutes')

  svg
    .selectAll('rect')
    .data(Doping)
    .enter()
    .append('rect')
    .attr('x', width / 1.1)
    .attr('y', (e) => (e === 'red' ? height / 3.8 : height / 3.2))
    .attr('width', radius * 4)
    .attr('height', radius * 4)
    .attr('fill', (e) => e)

  svg
    .selectAll()
    .data(Doping)
    .enter()
    .append('text')
    .attr('id', 'legend')
    .text((e) =>
      e === 'red' ? 'Riders with doping allegations' : 'No doping allegations'
    )
    .attr('x', (e) => (e === 'red' ? width / 1.66 : width / 1.46))
    .attr('y', (e) => (e === 'red' ? height / 3.4 : height / 3))
    .style('font-size', 12)

  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', ({ Year }) => xScale(Year))
    .attr('cy', ({ Seconds }) => yScale(new Date(Seconds * 1000)))
    .attr('r', radius)
    .attr('fill', (e) => (e.Doping ? 'red' : 'green'))
    .attr('stroke', 'black')
    .attr('stroke-width', '1')
    .attr('class', 'dot')
    .attr('data-xvalue', ({ Year }) => Year)
    .attr('data-yvalue', ({ Seconds }) => new Date(Seconds * 1000))
    .on(
      'mouseover',
      (_, { Year, Time, Name, Nationality, Doping, Seconds }) => {
        divTooltip
          .transition()
          .duration(200)
          .style('opacity', 0.9)
          .attr('data-year', Year)
        divTooltip
          .html(
            `<div>
          <p>${Name}:${Nationality}</p>
          <p>Year:${Year},Time:${Time}</p>
          ${Doping && `<p>${Doping}</p>`}<div>`
          )
          .style('left', `${xScale(Year) + width * 0.07}px`)
          .style('top', `${yScale(new Date(Seconds * 1000)) - height * 0.02}px`)
      }
    )
    .on('mouseout', () => {
      divTooltip.transition().duration(500).style('opacity', 0)
    })
}
