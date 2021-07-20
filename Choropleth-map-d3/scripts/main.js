const educationUrl =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const countryDateUrl =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
const getInfoHttp = (url) => {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open('GET', url, true)
    req.onload = () => {
      resolve(JSON.parse(req.response))
    }
    req.onerror = () => reject(console.log('error'))
    req.send()
  })
}

Promise.all([getInfoHttp(countryDateUrl), getInfoHttp(educationUrl)])
  .then(printMap)
  .catch((e) => console.log('error: ', e))

const width = 950
const height = 610
const padding = 90

function printMap(data) {
  const geoData = data[0]
  const educationData = data[1]
  const countryData = topojson.feature(
    geoData,
    geoData.objects.counties
  ).features
  const stateData = topojson.feature(geoData, geoData.objects.states).features
  const path = d3.geoPath()

  // Scale color by education
  const ScaleColorRange = ['white', 'green', 'black']
  const ScaleColor = d3.scaleLinear().domain([0, 60]).range(ScaleColorRange)

  // Scale eduaction gradient
  const ScaleGradient = d3.scaleLinear().domain([10, 70]).range([0, 200])

  // Title
  d3.select('body')
    .append('div')
    .attr('id', 'title')
    .html(
      "<h2>United States Educational Attainment</h2><h4 id='description'>Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</h4>"
    )
  // Container
  const container = d3
    .select('body')
    .append('div')
    .attr('id', 'container')
    .style('width', `${width}px`)

  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // Tooltip
  const tooltip = d3
    .select('body')
    .append('div')
    .style('opacity', 0)
    .attr('id', 'tooltip')

  // Axis Color legend
  const AxisLegend = d3
    .axisBottom(ScaleGradient)
    .ticks(5)
    .tickFormat((d) => d + '%')

  const colorLegendContainer = svg
    .append('g')
    .attr('transform', `translate(${width - padding - 200},${padding})`)
    .attr('id', 'legend')

  colorLegendContainer.call(AxisLegend)
  colorLegendContainer
    .selectAll('rect')
    .data([10, 20, 30, 40, 50, 60])
    .enter()
    .append('rect')
    .attr('height', 10)
    .attr('width', 34)
    .attr('x', (d) => ScaleGradient(d))
    .attr('y', -10)
    .attr('fill', (d) => ScaleColor(d))

  // Counties
  svg
    .append('g')
    .selectAll('path')
    .data(countryData)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', ({ id }) => {
      const currentElement = educationData.find(
        (element) => element.fips === id
      )
      return ScaleColor(currentElement.bachelorsOrHigher)
    })
    .attr('class', 'county')
    .attr('data-fips', ({ id }) => id)
    .attr('data-education', ({ id }) => {
      const currentElement = educationData.find(
        (element) => element.fips === id
      )
      return currentElement.bachelorsOrHigher
    })
    .on('mouseover', (e, { id }) => {
      const { area_name, bachelorsOrHigher, state } = educationData.find(
        (element) => element.fips === id
      )
      tooltip.transition().duration(200).style('opacity', 0.9)
      tooltip
        .html(
          `<div>
           ${area_name}, ${state} ${bachelorsOrHigher}%
          </div>
          `
        )
        .style('left', `${e.x + 10}px`)
        .style('top', `${e.y - 50}px`)
        .attr('data-education', bachelorsOrHigher)
    })
    .on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0)
    })
  // States
  svg
    .append('g')
    .selectAll('path')
    .data(stateData)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'states')
}
