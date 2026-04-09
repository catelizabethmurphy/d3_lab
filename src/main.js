import './styles.css'
import * as d3 from 'd3'
import { annotation } from 'd3-svg-annotation'

const mdColor = "#e7ae34"
const usColor = "#2b2bb0"

// 1. ACCESS DATA *******************************
const data = await d3.csv("data/3party-data.csv")

// 2. DRAW CANVAS  *******************************
const margin = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 20
}
const width = 800 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const svg = d3.select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

const chart = svg.append("g")
  .classed("chart", true)
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// 3. CREATE X AXIS *******************************
const xScale = d3
  .scaleBand()
  .domain(data.map(d => +d.election))
  .range([0, width])
  .padding(0.4)

const xAxis = chart
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .classed("x-axis", true)
  .call(d3.axisBottom(xScale))
xAxis.select(".domain").remove()
xAxis.append("text")
    .attr("text-anchor", "center")
    .attr("fill", "black")
    .attr("font-size", "1.25em")
    .attr("x", (width / 2))
    .attr("y", 35)
    .text("Election Year")

// 4. CREATE Y AXIS *******************************
const yScale = d3
  .scaleLinear()
  // .domain([0, d3.max(data, d => +d.p_share_us)])
  .domain([0, 20])
  .range([height, 0])
const yAxis = chart
  .append("g")
  .attr("transform", `translate(0, 0)`)
  .classed("y-axis", true)
  .call(
    d3.axisLeft(yScale)
      .tickValues([0, 5, 10, 15, 20])
      .tickFormat(d => d % 10 === 0 ? d : "")
  )
yAxis.select(".domain").remove()
yAxis.append("text")
    .attr("text-anchor", "start")
    .attr("fill", "black")
    .attr("font-size", "1.25em")
    .attr("x", -20)
    .attr("y", -15)
    .text("Percent of popular vote to 3rd Party")

// 7. ANNOTATIONS   *******************************
// Based on this custom annotations library: https://d3-annotation.susielu.com/
const annotations = [
  {
    note: {
      title: "Ross Perot",
      label: "won over 14% of the Maryland vote as an independent candidate in 1992.",
      wrap: 400,  // size

    },
    connector: {
      end: "none",        
      type: "line",       
      points: 1,           
      lineType : "horizontal"
    },
    color: "black",
    x: xScale(1992) + xScale.bandwidth() / 2,
    y: yScale(data[0].p_share_md),
    dy: 0,
    dx: 100
  }
]
  
const makeAnnotations = annotation()
  .annotations(annotations)
    
chart.append("g")
  .call(makeAnnotations)
  .attr("z-index", "-1")

// 8. LEGEND  *******************************
// const legend = svg.append("g")
//   .classed("legend", true)
//   .attr("transform", `translate(0, 0)`)

// legend.append("rect")
//   .attr("x", 0)
//   .attr("y", 0)
//   .attr("width", 15)
//   .attr("height", 15)
//   .attr("fill", mdColor)

// legend.append("text")
//   .attr("x", 25)
//   .attr("y", 12)
//   .text("Maryland")

// legend.append("rect")
//   .attr("x", 110)
//   .attr("y", 0)
//   .attr("width", 15)
//   .attr("height", 15)
//   .attr("fill", usColor)

// legend.append("text")
//   .attr("x", 135)
//   .attr("y", 12)
//   .text("United States")

const defs = svg.append("defs")

const clipPathMd = defs.append("clipPath")
  .attr("id", "mdClip")

clipPathMd.selectAll("rect")
  .data(data)
  .enter().append("rect")
  .attr("x", d => xScale(+d.election))
  .attr("y", d => yScale(+d.p_share_md))
  .attr("width", xScale.bandwidth() / 2)
  .attr("height", d => height - yScale(+d.p_share_md))

const mdFlag = chart.append("g")
  .append("image")
  .attr("xlink:href", "./images/mdflag.png")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("x", 0)
  .attr("y", 0)
  .style("fit", "cover")
  .attr("clip-path", "url(#mdClip)")

const clipPathUs = defs.append("clipPath")
  .attr("id", "usClip")

clipPathUs.selectAll("rect")
  .data(data)
  .enter().append("rect")
  .attr("x", d => xScale(+d.election) + xScale.bandwidth() / 2)
  .attr("y", d => yScale(+d.p_share_us))
  .attr("width", xScale.bandwidth() / 2)
  .attr("height", d => height - yScale(+d.p_share_us))

const usFlag = chart.append("g")
  .append("image")
  .attr("xlink:href", "./images/usflag.png")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("x", 0)
  .attr("y", 0)
  .style("fit", "cover")
  .attr("clip-path", "url(#usClip)")

  // 5. DRAW DATA    *******************************

const bars = chart.append("g")

const mdBars = bars.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .classed("mdBar", true)
  .attr("x", d => xScale(+d.election))
  .attr("y", d => yScale(+d.p_share_md))
  .attr("width", xScale.bandwidth() / 2)
  .attr("height", d => height - yScale(+d.p_share_md))
  .attr("fill", mdColor)
  // .attr("opacity", 0.7)
  .attr("opacity", 0.2)
  .attr("id", d => `mdBar-${d.election}`)
  .attr("border", "1px solid black")

const usBars = bars.selectAll(".bar2")
  .data(data)
  .enter().append("rect")
  .classed("usBar", true)
  .attr("x", d => xScale(+d.election) + xScale.bandwidth() / 2)
  .attr("y", d => yScale(+d.p_share_us))
  .attr("width", xScale.bandwidth() / 2)
  .attr("height", d => height - yScale(+d.p_share_us))
  .attr("fill", usColor)
  // .attr("fill", "#000000")
  .attr("opacity", 0.2)
  // .attr("opacity", 0.7)
  .attr("border", "1px solid black")
  .attr("id", d => `usBar-${d.election}`)

// 6. ADD INTERACTIVITY  *******************************
let tooltipData = null
function filterTooltipData(d, barType) {
  const election = +d.election
  const vote_share = barType === "mdBar" ? +d.p_share_md : +d.p_share_us
  const geography = barType === "mdBar" ? "Maryland" : "United States"
  const color = barType === "mdBar" ? mdColor : usColor
  tooltipData = {
    election: election,
    vote_share: vote_share,
    geography: geography,
    color: color
  }
}

function positionTooltip(event) {
  const [x, y] = d3.pointer(event)
  tooltip
    .style("left", `${x + margin.left}px`)
    .style("top", `${y}px`)
}

const tooltip = d3.select("#tooltip")
  .data([tooltipData])
  .style("position", "absolute")
  .style("background", "rgb(255, 255, 255)")
  .style("color", "black")
  .style("z-index", "10")
  .style("display", "none")
  .style("padding", "8px")
  .style("border", "1px solid #939393")
  .style("drop-shadow", "0 6px 24px rgba(20, 27, 59, 0.79)")

d3.selectAll([...mdBars.nodes(), ...usBars.nodes()])
  .attr("cursor", "pointer")
  .on("mouseover", function(event, d) {
    const targetBar = d3.select(this)
    const targetBarType = targetBar.attr("class")

    filterTooltipData(d, targetBarType)
    tooltip
      .style("display", "block")
      .html(`
        <strong style="color: ${tooltipData.color}; font-weight: bold;">${tooltipData.geography}</strong>
        <br>
        Election: ${tooltipData.election}
        <br>
        3rd Party Vote Share: ${tooltipData.vote_share}%
      `)

    positionTooltip(event)

    // targetBar.attr("opacity", 1)
    targetBar.attr("opacity", 0.5)
  })
  .on("mousemove", function(event) {
    positionTooltip(event)
  })
  .on("mouseout", function(event, d) {
    d3.select(this)
      // .attr("opacity", 0.7)
      .attr("opacity", 0.2)
    tooltip.style("display", "none")
  })

// Ross Perot
const rossTheBoss = chart.append("g")
	.attr("transform", "translate(540, 60)")

const bossShadow = rossTheBoss
	.append("circle")
	.attr("cx", 52)
	.attr("cy", 50)
	.attr("r", 50)
	.attr("fill", "none")
	.attr("stroke", "black")
	.attr("stroke-width", 2)

bossShadow.clone(false)
	.attr("stroke-width", 4)
	.attr("fill", "black")
	.attr("opacity", 0.5)
	.attr("transform", "translate(1, 1)")

rossTheBoss
	.append("image")
	.attr("xlink:href", "./images/ross-perot.jpg")
	.attr("width", 100)
	.attr("clip-path", "url(#rossClip)")

const clipPathRoss = defs.append("clipPath")
	.attr("id", "rossClip")

clipPathRoss
	.append("circle")
	.attr("cx", 52)
	.attr("cy", 50)
	.attr("r", 50)
	