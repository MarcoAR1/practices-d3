const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

const req = new XMLHttpRequest()
req.open('GET', url, true)
req.onload = () => {
  insertData(JSON.parse(req.response))
}
req.send()

const insertData = ({ monthlyVariance, baseTemperature }) => {
  const widthRect = 6
  const heightRect = 30
  const width = (monthlyVariance.length / 12) * widthRect
  const height = 14 * (heightRect + 5)
  const padding = 80
  let indexColor = {}
  const colors = {
    '2.8-3.9': 'rgb(69, 117, 180)',
    '4-5': 'rgb(116, 173, 209)',
    '5.1-6.1': 'rgb(171, 217, 233)',
    '6.2-7.2': 'rgb(224, 243, 248)',
    '7.3-8.3': 'rgb(255, 255, 191)',
    '8.4-9.4': 'rgb(254, 224, 144)',
    '9.5-10.5': 'rgb(253, 174, 97)',
    '10.6-11.6': 'rgb(244, 109, 67)',
    '11.7-12.8': 'rgb(215, 48, 39)',
  }

  if (!window.localStorage.getItem('colors')) {
    for (let x in colors) {
      const rangeStart = +x.split('-')[0]
      const rangeEnd = +x.split('-')[1]
      const range = ((rangeEnd - rangeStart) * 10).toFixed(0)
      for (let i = 0; i < range + 1; i += 1) {
        if ((rangeStart + i / 10).toFixed(1) > 12.8) {
          break
        }
        indexColor[(rangeStart + i / 10).toFixed(1)] = colors[x]
      }
    }
    window.localStorage.setItem('colors', JSON.stringify(index))
  }
  indexColor = JSON.parse(window.localStorage.getItem('colors'))

  const getColorForRange = (temperature) => indexColor[temperature]

  const fixedDates = (month, year) => {
    const currentDate = new Date()
    currentDate.setHours(0)
    currentDate.setMinutes(0)
    currentDate.setSeconds(0)
    currentDate.setMilliseconds(0)

    if (year) {
      currentDate.setFullYear(year)
    }
    if (month) {
      currentDate.setMonth(month - 1)
    }
    return currentDate
  }
  // Scales
  const xScale = d3
    .scaleLinear()
    .domain([
      monthlyVariance[0].year,
      monthlyVariance[monthlyVariance.length - 1].year,
    ])
    .range([padding, width])

  const yScale = d3
    .scaleLinear()
    .domain([0, 11])
    .range([padding, height - padding])

  // X And Y Axes

  const xAxis = d3.axisBottom(xScale).tickFormat((e) => parseInt(e))
  const yAxis = d3
    .axisLeft(yScale)
    .ticks(12)
    .tickFormat((e) => d3.timeFormat('%B')(fixedDates(e + 1)))

  // Elements

  const container = d3
    .select('body')
    .append('div')
    .attr('id', 'container')
    .style('width', `${width + 50}px`)

  container.append('heading')
    .html(`<h2 id='title'>Monthly Global Land-Surface Temperature
</h2><h4 id='description'>1753 - 2015: base temperature 8.66℃</h4>`)

  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  svg
    .append('g')
    .attr('transform', `translate(0,${height - padding + heightRect})`)
    .call(xAxis)
    .attr('id', 'x-axis')
  svg
    .append('g')
    .attr('transform', `translate(${padding},${heightRect / 2})`)
    .call(yAxis)
    .attr('id', 'y-axis')

  const divTooltip = container
    .append('div')
    .style('opacity', 0)
    .attr('id', 'tooltip')

  svg
    .append('g')
    .attr('class', 'map')
    .selectAll('rect')
    .data(monthlyVariance)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('data-month', ({ month }) => month - 1)
    .attr('data-year', ({ year }) => year)
    .attr('data-temp', ({ variance }) =>
      (baseTemperature + variance).toFixed(1)
    )
    .attr('fill', ({ variance }) => {
      const currentTemperature = (baseTemperature + variance).toFixed(1)
      if (currentTemperature < 2.8) {
        return getColorForRange(2.8)
      }
      if (currentTemperature > 12.8) {
        return getColorForRange(12.8)
      }
      return getColorForRange(currentTemperature)
    })
    .attr('width', widthRect)
    .attr('height', heightRect)
    .attr('x', ({ year }) => xScale(year))
    .attr('y', ({ month }) => yScale(month - 1))
    .on('mouseover', (e, { year, month, variance }) => {
      divTooltip
        .transition()
        .duration(200)
        .style('opacity', 0.9)
        .attr('data-year', year)

      divTooltip
        .html(
          `<div>
          <p> ${year} ${d3.timeFormat('%B')(fixedDates(month))}
          <br>
          ${(baseTemperature + variance).toFixed(1)}℃
          <br>
          ${variance}℃
          </p>
          </div>
          `
        )
        .style('left', `${xScale(year)}px`)
        .style('top', `${yScale(month - 1)}px`)
    })
    .on('mouseout', () => {
      divTooltip.transition().duration(500).style('opacity', 0)
      divTooltip.html('')
    })

  // legend
  const ColorsLegend = Object.entries(colors)
  const widthLegend = ColorsLegend.length * 45
  const heightLegend = 100
  const paddingLegend = 25

  const indexRange = {}

  for (let x in colors) {
    const startRange = +x.split('-')[0]
    const endRange = +x.split('-')[1]
    indexRange[startRange] = startRange
    indexRange[endRange] = endRange
  }

  const xScaleLegend = d3
    .scaleLinear()
    .domain([2.8, 12.8])
    .range([padding, widthLegend])

  const xAxisLegend = d3
    .axisBottom(xScaleLegend)
    .ticks(40)
    .tickFormat((e) => {
      if (indexRange[e]) {
        return e
      }
      return null
    })
    .tickSize(0)

  const svgLegend = container
    .append('svg')
    .attr('id', 'legend')
    .attr('width', widthLegend)
    .attr('height', heightLegend)

  svgLegend
    .append('g')
    .call(xAxisLegend)
    .attr('transform', `translate(${-paddingLegend}, ${heightLegend / 2})`)

  svgLegend
    .selectAll('rect')
    .data(ColorsLegend)
    .enter()
    .append('rect')
    .attr('width', 43)
    .attr('height', 25)
    .attr('x', (x) => {
      const startRange = +x[0].split('-')[0]
      const endRange = +x[0].split('-')[1]
      indexRange[startRange] = startRange
      indexRange[endRange] = endRange
      const dif = (endRange - startRange) / 2
      return xScaleLegend(+(startRange - dif).toFixed(1)) - 7
    })
    .attr('y', (e) => 25)
    .attr('fill', (e) => colors[e[0]])
}
