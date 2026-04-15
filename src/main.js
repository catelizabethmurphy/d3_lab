import './styles.css'
import * as d3 from 'd3'
import { annotation } from 'd3-svg-annotation'

const mdColor = "#e7ae34"
const usColor = "#2b2bb0"

// 1. ACCESS DATA *******************************
// step 1 is to access the data, which we do using d3.csv to read in the CSV file and then we can use the data in our code to create the visualization
const data = await d3.csv("data/3party-data.csv")

// 2. DRAW CANVAS  *******************************
// step 2 does three main things: 
  // it defines the margins and dimensions for the chart area
  // it uses creates the SVG canvas based on those dimensions and margins
  // and it appends a group element to the SVG that will hold all the parts of the chart together and translates it to account for the margins 
  // we use these tools: 
    // .select to select elements
    // .attr to set attributes on the SVG and group elements using "width", "height" and "transform"
    // .append to create new elements and add them to the SVG
    // .classed to add classes to the elements for styling purposes

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
// a group element is like a container that holds all the parts of the axis together, so we can style and position it as a single unit
 const chart = svg.append("g")
   // .classed literally just means "add this class to the element", so we can style it with CSS later if we want
   // you would call it by using .chart in the CSS file
   .classed("chart", true)
   // translate the group element to create a margin around the chart area
   .attr("transform", `translate(${margin.left}, ${margin.top})`)

// 3. CREATE X AXIS *******************************
// step 3 has two main parts: 
  // we create the x axis scale based on the election year 
  // and then we append the x axis to the chart and add a label for it
  // we use these tools: 
    // .scaleBand to create a band scale for the x axis since our data is categorical (election years)
    // .domain to set the domain of the x scale based on the election years from our data
    // .range to set the range of the x scale to be the width of the chart area
    // .padding to add some padding between the bars
    // .append to create a group element for the x axis and add it to the chart
    // .attr to set attributes on the group element for positioning and styling using "transform", "text", "fill", "font-size", "x" and "y"
    // .classed to add a class to the group element for styling purposes
    // .call with d3.axisBottom to create the x axis based on the x scale we defined

// create x axis scale based on election year
 const xScale = d3
    // use band scale for x axis since data is categorical (election years)
   .scaleBand()
   // set domain of x scale to be election years from data, converting them to numbers
   // +d is just a quick way to convert the election year from a string to a number, since it was read in from the CSV as a string but we want to use it as a number for the x scale
   .domain(data.map(d => +d.election))
   // set range of the x scale to be width of chart area, add some padding between bars
   .range([0, width])
   .padding(0.4)

 // append x axis to chart and add label
 const xAxis = chart
    // append group element for x axis, translate it to bottom of chart area
   .append("g")
   // translate here just means move the whole group element down by the height of the chart area, so it lines up with the bottom edge of the chart area
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
// step 4 is similar to step 3 but for the y axis: 
  // we create the y axis scale based on the percent of vote share for 3rd party candidates
  // and then we append the y axis to the chart and add a label for it
  // we use these tools: 
    // .scaleLinear to create a linear scale for the y axis since our data is numerical (percentages)
    // .domain and d3.max to set the domain of the y scale from 0 to the maximum percent of vote share for 3rd party candidates (with some padding, which we can do by just setting the max to 20 since the maximum is around 15)
    // .range to set the range of the y scale to be the height of the chart area with 0 at the bottom and max value at the top
    // .append to create a group element for the y axis and add it to the chart
    // .attr to set attributes on the group element for positioning and styling using "transform", "text", "fill", "font-size", "x" and "y"
    // .classed to add a class to the group element for styling purposes
    // .call with d3.axisLeft to create the y axis based on the y scale we defined and customize it with tick values and tick format

// create y axis scale based on percent of vote share for 3rd party candidates
const yScale = d3
  // use linear scale for y axis since data is numerical (percentages)
  .scaleLinear()
   .domain([0, d3.max(data, d => +d.p_share_us)])
  // set domain of y scale to be from 0 to maximum percent of vote share for 3rd party candidates, with some padding
  .domain([0, 20])
  // set range of y scale to be height of chart area, with 0 at the bottom and max value at the top
  // the 0 comes last for range because in SVG coordinate system, y values increase as you go down, so we want the maximum value to be at the top of the chart area
  .range([height, 0])

// append y axis to the chart
const yAxis = chart
  // append group element for y axis, translate it to left of chart area
  .append("g")
  // translate works the same as with x axis, but in this case we don't need to move it down since we want it to start at the top of the chart area, so we just set x translation to 0 and y translation to 0
  .attr("transform", `translate(0, 0)`)
  // add class to the group element for styling purposes
  // you'd call it in CSS with .y-axis
  .classed("y-axis", true)
  .call(
    // calling d3.axisLeft with the y scale we defined 
    // this just creates the y axis based on that scale and we can customize it by chaining additional methods
    d3.axisLeft(yScale)
      // set tick values
      .tickValues([0, 5, 10, 15, 20])
      // format tick labels to only show values that are multiples of 10 and hide the rest by returning an empty string
      .tickFormat(d => d % 10 === 0 ? d : "")
  )
  // add label for y axis
    .append("text")
      // set text anchor to start so the label is left-aligned
      .attr("text-anchor", "start")
      // set fill color for label
      .attr("fill", "black")
      // set font size for label
      .attr("font-size", "1.25em")
      // position label to the left of the y axis and slightly above the top of the chart area
      .attr("x", -20)
      .attr("y", -10)
      // set the text of the label
      .text("Percent of popular vote to 3rd Party")

// 5. DRAW DATA    *******************************
// step 5 has two main parts: 
  // we create bars for the Maryland vote share 
  // and then we create bars for the U.S. vote share
  // we use these tools: .selectAll to select elements (in this case we start with an empty selection since we haven't created any bars yet)
  // .data to bind the data to the selection
  // .join to create new rectangle elements for each data point and bind the data to those elements
  // .classed to add classes to the bars for styling purposes
  // .attr to set attributes on the bars for positioning, sizing and coloring based on the data and scales using "x", "y", "width", "height", "fill"
  // .opacity to set the opacity of the bars

// create bars for md vote share using empty selection and join method
const mdBars = chart.selectAll(".bar")
  // .data binds the data to the selection
  // the selection is empty at this point, but when we call .join it will create a rectangle element for each data point and bind the data to those elements
  .data(data)
  // bind the data to rectangle elements and create a new rectangle for each data point that doesn't have a corresponding element in the selection (which is all of them since the selection is empty)
  .join("rect")
  // add class to each rectangle for styling purposes
  // you'd call it in CSS with .mdBar
  .classed("mdBar", true)
  // set x position of each bar based on election year using x scale
  .attr("x", d => xScale(+d.election))
  // set y position of each bar based on md vote share using y scale
  .attr("y", d => yScale(+d.p_share_md))
  // set width of each bar to be half the bandwidth of the x scale, so the md and us bars can sit side by side
  .attr("width", xScale.bandwidth() / 2)
  // set height of each bar based on md vote share, which you calculate by taking the difference between the height of the chart area and the y position of the bar 
  // this is because y position is based on the top of the bar and we want the height to extend down to the bottom of the chart area
  .attr("height", d => height - yScale(+d.p_share_md))
  // set fill color for md bars
  .attr("fill", mdColor)
  // set opacity for md bars so we can see both sets of bars when they overlap
  .attr("opacity", 0.7)
  // add id to each bar based on election year, which we will use for interactivity later
  .attr("id", d => `mdBar-${d.election}`)

// same process for us vote share bars, but we position them to the right of the md bars by adding half the bandwidth of the x scale to the x position
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
// step 6 has two main parts: 
  // we create a tooltip element that will show information about the bar when you hover over it 
  // and we add event listeners to the bars to create the interactivity for the tooltip. 
  // we use these tools: 
    // let to define null variable for the tooltip data that we will use to populate the tooltip when we hover over a bar
    // functions to filter the data for the tooltip and to position the tooltip based on the mouse event
      // defining a function works like this: you give the function a name and then you define the parameters that it takes in (which are like the variables that you use inside the function) and then you write the code for what the function does inside curly braces
    // ? operator to conditionally set values based on the type of bar that is hovered over (md or us)
    // === operator to compare values (like checking if the bar type is "mdBar" or "usBar")
    // ... spread operator to combine the selections for the md and us bars so we can add event listeners to all of them at once
    // .select to select the tooltip element
    // .style to set styles on the tooltip for positioning and appearance using "position", "background", "color", "z-index", "display", "padding", "border" and "drop-shadow"
    // .html to set the content of the tooltip based on the data for the bar that was hovered over
    // .on to add event listeners for mouseover, mousemove and mouseout to show, position and hide the tooltip when you interact with the bars
    // .attr to change the opacity of the bars when you hover over them to highlight them using "opacity"
    
// create tooltip element and set its initial styles
// tooltip is a div that will show information about the bar when you hover over it and we style it to look like a little info box that appears next to the cursor
let tooltipData = null
// this function takes in the data for the bar that was hovered over and the type of bar (md or us) and filters it to create an object with the specific pieces of information we want to show in the tooltip 
function filterTooltipData(d, barType) {
  // we use the barType to determine which vote share to show in the tooltip
  const election = +d.election
  // we also use the barType to determine which geography to show in the tooltip and which color to use for the text
  // this just tells it to print "Maryland" and use the mdColor for the tooltip if it's an mdBar and to print "United States" and use the usColor if it's a usBar
  // the ? is just a shorthand for an if statement, so it's saying "if barType is mdBar, then use the md vote share and md color, otherwise use the us vote share and us color"
  const vote_share = barType === "mdBar" ? +d.p_share_md : +d.p_share_us
  const geography = barType === "mdBar" ? "Maryland" : "United States"
  const color = barType === "mdBar" ? mdColor : usColor
  // we create an object called tooltipData that contains the election year, vote share, geography and color for the bar that was hovered over, which we will use to populate the tooltip
  tooltipData = {
    election: election,
    vote_share: vote_share,
    geography: geography,
    color: color
  }
}

// this function positions the tooltip based on the mouse event, so it follows the cursor as you move it around
function positionTooltip(event) {
  const [x, y] = d3.pointer(event)
  tooltip
    .style("left", `${x + margin.left}px`)
    .style("top", `${y}px`)
}

// we select all the bars (both md and us) and add event listeners for mouseover, mousemove and mouseout to create the interactivity for the tooltip
// event listeners are just functions that run when a specific event happens, like when you hover over a bar or move your mouse or something
// all of this code is just saying "when you hover over a bar, run this function that shows the tooltip with the right information and when you move your mouse, update the position of the tooltip and when you stop hovering over the bar, hide the tooltip"
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

// this is where we add the event listeners to the bars for the tooltip interactivity
// we are selecting all the bars (both md and us) by combining their selections with the spread operator and then we add the event listeners for mouseover, mousemove and mouseout
// the spread operator is the ... in front of the selections and it just takes all the elements from both selections and combines them into one array that we can then select with d3 and add event listeners to
// the .nodes() just lets us get the actual DOM elements from the d3 selection, so we can combine them with the spread operator and select them all together
d3.selectAll([...mdBars.nodes(), ...usBars.nodes()])
  // set cursor to pointer when hovering over the bars to indicate they are interactive
  .attr("cursor", "pointer")
  // add event listener for mouseover to show tooltip with the right information based on which bar is hovered over
  .on("mouseover", function(event, d) {
    // we use the "this" keyword to refer to the specific bar that was hovered over, so we can get its class and determine whether it's an mdBar or a usBar
    // this lets us know which vote share to show in the tooltip and which color and geography to use for the tooltip text
    const targetBar = d3.select(this)
    // we get the class of the target bar (aka "this" bar) to determine whether it's an mdBar or a usBar, which we will use in the filterTooltipData function 
    const targetBarType = targetBar.attr("class")

    // we call the filterTooltipData function with the data for the bar that was hovered over and the type of bar
    // this creates the tooltipData object with the specific information we want to show in the tooltip
    filterTooltipData(d, targetBarType)
    tooltip
      .style("display", "block")
      // we set the HTML content of the tooltip based on the tooltipData object that was created by the filterTooltipData function
      // contains the election year, vote share, geography and color for the bar that was hovered over
      // the $ is how we insert the values from the tooltipData object into the HTML string for the tooltip content
      .html(`
        <strong style="color: ${tooltipData.color}; font-weight: bold;">${tooltipData.geography}</strong>
        <br>
        Election: ${tooltipData.election}
        <br>
        Vote Share: ${tooltipData.vote_share}%
      `)

    // we call the positionTooltip function to position the tooltip based on the mouse event, so it appears next to the cursor when you hover over a bar
    positionTooltip(event)

    // we also set the opacity of the target bar to 1 when you hover over it, so it's clearly highlighted and stands out from the other stuff
    targetBar.attr("opacity", 1)
  })
    // add event listener for mousemove to update the position of the tooltip as you move your mouse around while hovering over a bar
  .on("mousemove", function(event) {
    positionTooltip(event)
  })
  // add event listener for mouseout to hide the tooltip when you stop hovering over a bar and reset the opacity of the bar back to 0.7
  .on("mouseout", function(event, d) {
    d3.select(this)
      .attr("opacity", 0.7)
    tooltip.style("display", "none")
  })

// 7. ANNOTATIONS   *******************************
// Based on this custom annotations library: https://d3-annotation.susielu.com/
// step 7 is to add an annotation to highlight Ross Perot's performance in Maryland in 1992 by:
  // defining the annotation with the text we want to show and the coordinates for where we want to point to on the chart
  // creating the annotation generator using the d3-svg-annotation library and passing in our annotation definition
  // appending a group element to the chart for the annotations and calling the annotation generator to create the annotation
  // we use these tools: 
    // an array we've called annotations to define the annotation with:
      // "note" for the text box that appears with the annotation, where we can set the title, label and wrap for the text
      // "connector" for the line that connects the note to the specific point on the chart that it's referring to, where we can set the type of line and how it points to the chart
      // "color" to set the color of the annotation elements (like the connector line and the text)
      // "x" and "y" for the coordinates of the point on the chart that the annotation is referring to
      // "dx" and "dy" for the offsets of the note (text box) from the point on the chart, so we can position it nicely without overlapping with the bar or other elements
    // .append to create a group element for the annotations and add it to the chart
    // .call to call the annotation generator and create the annotation based on our definition
    // .attr to set attributes on the group element for styling purposes, like "z-index" to make sure it appears above or below other elements as needed
    
// annotation to highlight Ross Perot's performance in Maryland in 1992
const annotations = [
  // "note" is the text box that appears with the annotation 
  {
    note: {
      title: "Ross Perot",
      label: "won over 14% of the Maryland vote as an independent candidate in 1992.",
      wrap: 400,  // size

  // "connector" is the line that connects the note to the specific point on the chart that it's referring to
  // in this case we want a horizontal line that points to the bar for Maryland in 1992, so we set the type to "line" and the lineType to "horizontal"
    },
    connector: {
      end: "none",        
      type: "line",       
      points: 1,           
      lineType : "horizontal"
    },
    color: mdColor,
    // "x" and "y" are the coordinates for the point on the chart that the annotation is referring to, which in this case is the top of the bar for Maryland in 1992
    x: xScale(1992) + xScale.bandwidth() / 2,
    // data[0] corresponds to the first row of our data, which is the election year 1992
    // this gives us the top of the bar for Maryland in 1992
    y: yScale(data[0].p_share_md),
    // "dx" and "dy" are the offsets for the note, which is the text box that appears with the annotation
    dy: 0,
    dx: 100
  }
]

// create the annotation generator using the d3-svg-annotation library and pass in our annotations array that we just defined, which contains the information for the annotation we want to create
const makeAnnotations = annotation()
  .annotations(annotations)

// we append a group element to the chart for the annotations and call the annotation generator to create the annotation
// we need a group element to hold the annotation because the annotation generator creates multiple elements (like the note and the connector) and we want to group them together so we can style and position them as a single unit
chart.append("g")
  .call(makeAnnotations)
  .attr("z-index", "-1")

// 8. LEGEND  *******************************
// step 8 is to create a legend to indicate which color corresponds to Maryland and which color corresponds to the U.S. by:
  // appending a group element to the SVG for the legend and positioning it in the top left corner
  // adding a rectangle and text for each item in the legend, using the same colors as the bars in the chart to indicate which color corresponds to which geography
  // we use these tools: 
    // .append to create a group element for the legend and add it to the SVG and to create rectangles and text elements for each item in the legend
    // .classed to add a class to the legend group element for styling purposes
    // .attr to set attributes on the legend group element for positioning and on the rectangles and text for styling and layout using "transform", "x", "y", "width", "height", "fill" and "text"

// create a legend by first appending a group element to the SVG 
const legend = svg.append("g")
  .classed("legend", true)
  // we position the legend in the top left corner of the SVG by translating it to (0, 0)
  .attr("transform", `translate(0, 0)`)

// we add a rectangle and text for each item in the legend, using the same colors as the bars in the chart to indicate which color corresponds to which geography
legend.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 15)
  .attr("height", 15)
  .attr("fill", mdColor)

// we position the text for the Maryland item in the legend to the right of the rectangle, with a small gap in between
legend.append("text")
  .attr("x", 25)
  .attr("y", 12)
  .text("Maryland")

// we then add a rectangle (well, a square) and text for the U.S. item in the legend, positioning it to the right of the Maryland item with some space in between
// we figure out the values for the x position of the U.S. item in the legend by looking at the width of the Maryland rectangle (15) and the gap between the rectangle and text (10) and the width of the Maryland text (which we can estimate to be around 80 based on how it looks), so we add those together to get the x position for the U.S. rectangle, which is 110
legend.append("rect")
  .attr("x", 110)
  .attr("y", 0)
  .attr("width", 15)
  .attr("height", 15)
  .attr("fill", usColor)

// we position the text for the U.S. item in the legend to the right of the rectangle, with a small gap in between
legend.append("text")
  .attr("x", 135)
  .attr("y", 12)
  .text("United States")