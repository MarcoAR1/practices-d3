const category = [
  'Travel',
  'Transport',
  'Food',
  'Services',
  'Restaurants',
  'Health and self-care',
  'Wardrobe',
  'Education',
  'Entertainment and fun',
  'Other',
]
const dataColor = [
  'red',
  'green',
  'blue',
  'violet',
  'orange',
  'pink',
  'gray',
  'black',
  'white',
  'yellow',
]
const index = {}
for (let x in category) {
  index[category[x]] = {
    value: Math.floor(Math.random() * 500) + 1,
    color: dataColor[x],
  }
}
const width = 500
const height = 500
const padding = 50
const radius = 500 / 2 - padding
const container = d3.select('body').append('div').attr('id', 'container')

const svg = container
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('id', 'svg-container')
  .append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2})`)

const pie = d3.pie().value((d) => d[1].value)
const dataRedy = pie(Object.entries(index))

svg
  .selectAll()
  .data(dataRedy)
  .enter()
  .append('path')
  .attr('d', d3.arc().innerRadius(0).outerRadius(radius))
  .attr('fill', ({ data }) => data[1].color)
  .attr('stroke', 'black')
  .style('stroke-width', '2px')
  .style('opacity', 0.7)
  .on('mouseover', () => {
    console.log('hola estoy ensima')
  })
  .on('mouseout', () => {
    console.log('me sali crack')
  })
