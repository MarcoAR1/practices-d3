const url =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'

const req = new XMLHttpRequest()
req.open('GET', url, true)
req.onload = () => {
  TreemapDiagram(JSON.parse(req.response))
}
req.onerror = () => reject(console.log('error'))
req.send()

const treemap = (data) =>
  d3.treemap().size([width, height]).padding(1).round(true)(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  )

const width = 1300
const height = 800
const padding = 50
const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

function TreemapDiagram(topSaleVideoGame) {
  const root = treemap(topSaleVideoGame)

  // Title
  d3.select('body')
    .append('div')
    .attr('id', 'title')
    .html(
      "<h2>Video Game Sales</h2><h4 id='description'>Top 100 Most Sold Video Games Grouped by Platform</h4>"
    )

  const tooltip = d3
    .select('body')
    .append('div')
    .style('opacity', 0)
    .attr('id', 'tooltip')

  //Container

  const container = d3
    .select('body')
    .append('div')
    .attr('id', 'container')
    .style('width', width + padding + 'px')
    .style('height', height + 1 + 'px')

  // svg
  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('font', '10px sans-serif')

  const leaf = svg
    .selectAll('g')
    .data(root.leaves())
    .enter()
    .append('g')
    .attr('transform', ({ x0, y0 }) => `translate(${x0},${y0})`)

  leaf
    .append('rect')
    .attr('fill', (d) => {
      while (d.depth > 1) d = d.parent
      return colorScale(d.data.name)
    })
    .attr('fill-opacity', 0.6)
    .attr('width', ({ x1, x0 }) => x1 - x0)
    .attr('height', ({ y1, y0 }) => y1 - y0)
    .attr('class', 'tile')
    .attr('data-name', ({ data }) => data.name)
    .attr('data-category', ({ data }) => data.category)
    .attr('data-value', ({ data }) => data.value)
    .on('mouseover', (e, { data }) => {
      tooltip.transition().duration(200).style('opacity', 0.9)
      tooltip
        .html(
          `<div>  
           Name: ${data.name}<br>Category: ${data.category}<br>Value: ${data.value}$
          </div>
          `
        )
        .style('left', `${e.x + 10}px`)
        .style('top', `${e.y - 50}px`)
        .attr('data-value', data.value)
    })
    .on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0)
    })

  leaf
    .append('text')
    .selectAll('tspan')
    .data((d) => {
      const text = d.data.name.split(/\.|:|\//)
      const textCorrect = []

      for (let x in text) {
        const currentText = text[x].split(' ')
        if (currentText.length < 3) {
          textCorrect.push(text[x])
          continue
        }
        const joinMid = currentText
          .splice(0, Math.ceil(currentText.length / 2))
          .join(' ')
        const finish = currentText.join(' ')
        textCorrect.push(joinMid, finish)
      }
      return [...textCorrect, `${d.data.value}$`]
    })
    .join('tspan')
    .attr('x', 3)
    .attr(
      'y',
      (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
    )
    .text((d) => d)
  const widthLegend = 200
  const heightLegend = 400

  const legend = container
    .append('svg')
    .attr('width', widthLegend)
    .attr('height', heightLegend)
    .style('margin', 'auto')

  const legendName = legend
    .append('g')
    .attr('id', 'legend')
    .attr('transform', `translate(${5},${10})`)

  legendName
    .selectAll('ract')
    .data(topSaleVideoGame.children)
    .enter()
    .append('rect')
    .attr('class', 'legend-item')
    .attr('width', 10)
    .attr('height', 10)
    .attr('x', (_, i) => (i % 2 == 0 ? 25 : 125))
    .attr('y', (_, i) => {
      if (i % 2 == 0) {
        return i * 14
      }
      return (i - 1) * 14
    })
    .attr('fill', ({ name }) => colorScale(name))

  legendName
    .selectAll('text')
    .data(topSaleVideoGame.children)
    .enter()
    .append('text')
    .style('font', '10px sans-serif')
    .text(({ name }) => name)
    .attr('y', (_, i) => {
      if (i % 2 == 0) {
        return i * 14 + 8
      }
      return (i - 1) * 14 + 8
    })
    .attr('x', (_, i) => (i % 2 == 0 ? 37 : 137))
}
