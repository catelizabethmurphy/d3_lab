# 328T628T Starter Repo

Starter template for class projects using Vite, vanilla JS, and CSS.

## What this repo is for

- Completing LAB 6: Intro to Javascript and Chart.js

## Instructions

Follow the below guide for building your first chart with JavaScript. There are questions that you will need to answer in line with the steps (Q1, Q2, etc.). Answer each of those in the text box on the ELMS assignment page. After you've done all the steps, publish your changes on GitHub Pages, and submit links to the resultant page and the source repo at the bottom of the ELMS text box, under all your answered questions. 

## 0. Prepare this repository for development

- Make a fresh fork of this repo. Make sure you include the branch `LAB7-d3js`.
- After you clone your forked repo, navigate to this branch with GitHub Desktop, or with the command line:

```bash
git checkout LAB7-d3js
```

- Follow the [setup instructions](https://github.com/JMeltzer92/328T628T-starter-repo). You can refer to them at any time by navigating back to the `main` branch.

## 1. Install D3.js

In the VSCode/CodeSpace command line:

```bash
npm add d3
```

## 2. Prepare HTML for chart.js

We need to give `chart.js` the right DOM element to target. It uses `canvas`, [a container element for many graphics libraries](https://www.w3schools.com/html/html5_canvas.asp).

Add a canvas element as a child of the `app` div.

## 3. Load the data

Data loading is not instantaneous. We need to set up an asynchronous function to handle this, and then call that function.

Use `police_shootings.csv` for now - we'll come back to its wider cousin later. *Disclaimer - this is dummy data and does not reflect reality.*

```js
async function loadAndChartData() { // function syntax
  const response = await fetch('data/police_shootings.csv') // a relative pathway to our data file. Vite is helping us out here
	const csvText = await response.text() // The "text content" of our pointed file
	const data = csvParse(csvText)
	console.log(data)
}

loadAndChartData()
```

**Q1: What does the console show? What's the data structure?**

Remember to remove your console logs after they've served their testing purposes.

## 4. Initialize a new Chart

`chart.js` exports a handy Chart that encompasses the majority of its functionality. Add the new constructor:

```js
async function loadAndChartData() { // function syntax
  const response = await fetch('data/police_shootings.csv') // the URL of our data (contained in our app, in this case, but could point elsewhere)
	const csvText = await response.text() // the text within the promised URL
	const data = csvParse(csvText) // d3's handy function for turning this data into a format ready for JS parsing
	
  new Chart()
}

loadAndChartData()
```

The `Chart` class expects two arguments:

1. The DOM element to be manipulated, and
2. An OBJECT containing the parameters of the desired chart you want to create.

Let's add one now.

```js
async function loadAndChartData() {
  const response = await fetch('data/police_shootings.csv')
	const csvText = await response.text()
	const data = csvParse(csvText)
	
  const ctx = document.querySelector('chart') // The DOM element where we want to put our chart
  new Chart(
    ctx, // the ctx constant still points to the right place
    {...} // where our chart options will go. right now, this will break our app
  )
}

loadAndChartData()
```

A line chart is always a good choice for simple temporal data. The [chart.js docs](https://www.chartjs.org/docs/latest/charts/line.html) give us what we will need to execute. Hint: look at both "Config" and "Setup".

**Q2: Describe the data structure of the object that `chart.js` expects. What is the top level data type? What data types are nested? How many levels of nesting do you see?**

Let's get the basics of our line chart set up.

```js
async function loadAndChartData() {
  const response = await fetch('data/police_shootings.csv')
	const csvText = await response.text()
	const data = csvParse(csvText)
	
  const ctx = document.getElementById('chart')
	console.log(ctx)
  new Chart(
    ctx, 
    {
      type: 'line',
      data: { // the object containing the data driving the graphic
        labels: data.map(d => d.Year), // The values of all our observations. Map is extracting all the values of each row object from the data array. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
				datasets: [{ // Array: one object per dataset plotted
					label: 'Fatal Police Shootings in the US', // The title (legend label) of the variable in question 
					data: data.map(d => d['Fatal police shootings (US)']), // The value of 'Fatal police shootings (US)' for each year, in the same order as the `labels` object above thihs in the nested hierarchy. 
					borderColor: 'red', // line color :)
					fill: false // Do not fill in the bottom of the line
				}]
      }
    } 
  )
}

loadAndChartData()
```

You should have a line chart now!

**Q3: How would you add a second line to this chart? How might you load that dataset in? Hint: look at the data structure of `datasets`.**

**Q4: What's wrong with our chart right now? Give a couple things that need fixing.**

## 5. Styling our chart

This default chart violates a lot of the basic principles of data viz we've learned so far. Let's fix some of them.

**Q5: Consult the docs. What properties of our `Chart` do we need to access to modify our axes and legend? Were you surprised by what you learned? What would you have expected instead?**

Head back over to `main.js` and let's fix some chart basics.

```js
	Chart.defaults.color = 'white' // sets default font color

  new Chart(
    ctx, 
    {
      type: 'line',
      data: {
        labels: data.map(d => d.Year),
				datasets: [{
					label: 'Fatal Police Shootings in the US',
					data: data.map(d => d['Fatal police shootings (US)']),
					borderColor: 'red',
					fill: false
				}]
      },
			options: {
				plugins: { // how we access our legend
					legend: {
						labels: {
							font: { // bigger font for legend
								size: 16,
								weight: 'bold'
							}
						}
					}
				},
				responsive: true,
				scales: { // where our axis options live
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Number of Incidents',
							font: {
								size: 16,
								weight: 'bold'
							}
						}
					},
					x: {
						title: {
							display: true,
							text: 'Year',
							font: {
								size: 16,
								weight: 'bold'
							}
						}
					}
				}
			}
    } 
  )
```

**Q6: What other things might you like to change about this chart? Can you find the requisite info in the documentation page?**

**Q7: Set `options.responive` to `false`. Then try modifying the size of the canvas element in `styles.css`. What happens? Turn responsivenss back on, and the change the size of the canvas' parent element. What happens now?**

## 6. Finishing touches

Let's add the expected chatter to our graphics. We need a header, a subhead, and a source line.

- Write your own header and subhead.
- The source is "Dummy Data".

You can usethe  HTML (h1, h2, p) elements above the canvas to do this, or you can try using the Chart class' [title](https://www.chartjs.org/docs/latest/configuration/title.html) and [subtitle](https://www.chartjs.org/docs/latest/configuration/subtitle.html) plugins. You'll need to make the source with a `<p>` tag outside the canvas.

Remember to remove any other DOM elements from the template that we aren't using to service our chart.

## 7. Adding another line

Try adding another line to your chart. You'll need to:

1. Change the fetch to `/data/police_shootings_wide.csv`. *Disclaimer - this is dummy data and does not reflect reality.*
2. Add another object in the `datasets` array. you'll need to `map` over our array for a different variable name than in the first dataset. 
3. Style and title your new line appropriately.
4. Change the header and subhead to reflect the new chart's takeaways.

**Q8: What are you noticing about chart.js? Does it remind you of another tool we've used this semester? What do you wish you had more control over?**

## 8. Make another chart

Create another chart below the finished line chart. Pick from the other [chart types](https://www.chartjs.org/docs/latest/charts/area.html) (look under the Chart Types section of the left-hand menu for all the options). Try using a real dataset that you've used earlier in the semester for this class. Try to pick something that won't need transforming in JS, or that you can transform as necessary in R, Python or Sheets/Excel. Style your second chart to match the visual language of your first, and don't forget headers, subheads and footers.

Feel free to restyle the page to your liking.

## 9. Publish your page

Publish your completed charts to GitHub pages. You'll need to modify which branch you're serving to pages in `Settings > Pages` - make sure you are pointing to the `LAB6-intro-chartjs` branch.

Submit the following to a text entry box in ELMS:

- The answers to the questions interspersed through the above vignette.
- A link to your published page.
- A link to your repository on GitHub itself.
