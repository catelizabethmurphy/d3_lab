import './styles.css'
import * as d3 from 'd3'
import { annotation } from 'd3-svg-annotation'

const mdColor = "#e7ae34"
const usColor = "#2b2bb0"

// 1. ACCESS DATA *******************************
const data = await d3.csv("data/3party-data.csv")

// 2. DRAW CANVAS  *******************************
// define margins and dimensions for the chart area
 const margin = {
   top: 50,
   right: 30,
   bottom: 50,
   left: 20
 }
 // calculate the width and height of the chart area by subtracting margins from total SVG dimensions
 const width = 800 - margin.left - margin.right
 const height = 500 - margin.top - margin.bottom

 // create the SVG canvas based on the defined dimensions and margins
 const svg = d3.select("svg")
    // set the width and height of the SVG to include margins
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom)

// append a group element to the SVG and translate it to account for margins
 const chart = svg.append("g")
   // add a class to the group element for styling purposes
   .classed("chart", true)
   // translate the group element to create a margin around the chart area
   .attr("transform", `translate(${margin.left}, ${margin.top})`)

// 3. CREATE X AXIS *******************************
// create x axis scale based on election year
 const xScale = d3
    // use band scale for x axis since data is categorical (election years)
   .scaleBand()
   // set domain of x scale to be election years from data, converting them to numbers
   .domain(data.map(d => +d.election))
   // set range of the x scale to be width of chart area, add some padding between bars
   .range([0, width])
   .padding(0.4)

 // append x axis to chart and add label
 const xAxis = chart
    // append group element for x axis, translate it to bottom of chart area
   .append("g")
   .attr("transform", `translate(0, ${height})`)
   // add class to the group element for styling purposes
   .classed("x-axis", true)
   // call d3 axisBottom function to create x axis based on x scale we defined
   .call(d3.axisBottom(xScale))
     // add label for x axis
     .append("text")
       .attr("text-anchor", "center")
       .attr("fill", "black")
       .attr("font-size", "1.25em")
       .attr("x", (width / 2))
       .attr("y", 40)
       .text("Election Year")

// 4. CREATE Y AXIS *******************************
// create y axis scale based on percent of vote share for 3rd party candidates
const yScale = d3
  .scaleLinear()
   .domain([0, d3.max(data, d => +d.p_share_us)])
  .domain([0, 20])
  .range([height, 0])

// append y axis to the chart
const yAxis = chart
  .append("g")
  .attr("transform", `translate(0, 0)`)
  .classed("y-axis", true)
  .call(
    d3.axisLeft(yScale)
      .tickValues([0, 5, 10, 15, 20])
      .tickFormat(d => d % 10 === 0 ? d : "")
  )
  // add label for y axis
    .append("text")
      .attr("text-anchor", "start")
      .attr("fill", "black")
      .attr("font-size", "1.25em")
      .attr("x", -20)
      .attr("y", -10)
      .text("Percent of popular vote to 3rd Party")

// 5. DRAW DATA    *******************************
// create bars for md vote share using empty selection and join method
const mdBars = chart.selectAll(".bar")
  // bind data to rectangles, creating a rectangle for each data point
  .data(data)
  .join("rect")
  .classed("mdBar", true)
  // set x position of each bar based on election year using x scale
  .attr("x", d => xScale(+d.election))
  // set y position of each bar based on md vote share using y scale
  .attr("y", d => yScale(+d.p_share_md))
  .attr("width", xScale.bandwidth() / 2)
  .attr("height", d => height - yScale(+d.p_share_md))
  .attr("fill", mdColor)
  .attr("opacity", 0.7)
  .attr("id", d => `mdBar-${d.election}`)

const usBars = chart.selectAll(".bar2")
  .data(data)
  .join("rect")
  .classed("usBar", true)
  .attr("x", d => xScale(+d.election) + xScale.bandwidth() / 2)
  .attr("y", d => yScale(+d.p_share_us))
  .attr("width", xScale.bandwidth() / 2)
  .attr("height", d => height - yScale(+d.p_share_us))
  .attr("fill", usColor)
  .attr("opacity", 0.7)
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
        Vote Share: ${tooltipData.vote_share}%
      `)

    positionTooltip(event)

    targetBar.attr("opacity", 1)
  })
  .on("mousemove", function(event) {
    positionTooltip(event)
  })
  .on("mouseout", function(event, d) {
    d3.select(this)
      .attr("opacity", 0.7)
    tooltip.style("display", "none")
  })

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
    color: mdColor,
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
const legend = svg.append("g")
  .classed("legend", true)
  .attr("transform", `translate(0, 0)`)

legend.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 15)
  .attr("height", 15)
  .attr("fill", mdColor)

legend.append("text")
  .attr("x", 25)
  .attr("y", 12)
  .text("Maryland")

legend.append("rect")
  .attr("x", 110)
  .attr("y", 0)
  .attr("width", 15)
  .attr("height", 15)
  .attr("fill", usColor)

legend.append("text")
  .attr("x", 135)
  .attr("y", 12)
  .text("United States")