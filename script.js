async function barChart() {

	const dataset = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");
	console.log(dataset);
	const dateParser = d3.timeParse("%Y-%m-%d");
	const xAccessor = d => dateParser(d[0]);
	const yAccessor = d => d[1];
	const barPadding = 1;

	const width = 1200;
	const height = 800;

	let dimensions = {
		width: width,
		height: height,
		margins: {
			top: 100,
			right: 15,
			bottom: 50,
			left: 75,
		},
	};
	dimensions.boundedWidth = dimensions.width - dimensions.margins.left - dimensions.margins.right;
	dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom;
//	console.log(dimensions.boundedWidth, dimensions.boundedHeight);
	
	const entireChart = d3.select("main")
		.append("svg")
		.attr("width", dimensions.width)
		.attr("height", dimensions.height);
//	console.log(entireChart);
	
	const graph = entireChart.append("g")
		.style("transform", `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`);

	const dates = [];
	for( let i = 0; i < dataset.data.length; i++ ) {
		dates.push(xAccessor(dataset.data[i]));
	}
	const years = [];
	for( let i = 0; i < dataset.data.length; i++ ) {
		let formatYear = d3.timeFormat("%Y");
		let formatMonth = d3.timeFormat("%m");
//		console.log(typeof(formatYear(dateParser(dataset.data[i][0]))));
		if( parseInt(formatYear(dateParser(dataset.data[i][0])), 10) % 5 === 0 && parseInt(formatMonth(dateParser(dataset.data[i][0])), 10) === 1) {
			years.push(dateParser(dataset.data[i][0]));
		}

	}
	console.log(years);

	const xScale = d3.scaleBand()
		.domain([...dates])
		.range([0, dimensions.boundedWidth]);

	const yScale = d3.scaleLinear()
		.domain(d3.extent(dataset.data, yAccessor))
		.range([dimensions.boundedHeight, 0])
		.nice();

	graph.selectAll("rect")
		.data(dataset.data)
		.enter()
		.append("rect")
		.attr("x", d => xScale(xAccessor(d)))
		.attr("y", d => yScale(yAccessor(d)))
		.attr("width", dimensions.boundedWidth / dataset.data.length - barPadding / 2)
		.attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
		.attr("class", "bar")
		.attr("data-date", d => d[0])
		.attr("data-gdp", d => d[1]);

	const title = graph.append("text")
		.attr("x", dimensions.boundedWidth / 2)
		.attr("y", -10)
		.text("United States Gross Domestic Product (GDP)")
		.style("fill", "black")
		.style("text-anchor", "middle")
		.style("font-size", "2em")
		.attr("id", "title");

	const xAxisGenerator = d3.axisBottom()
		.scale(xScale)
		.tickValues([...years])
		.tickFormat(d3.timeFormat("%Y"));

	const xAxis = graph.append("g")
		.call(xAxisGenerator)
		.style("transform", `translateY(${dimensions.boundedHeight}px)`)
		.attr("id", "x-axis");

	const xAxisLabel = xAxis.append("text")
		.attr("x", dimensions.boundedWidth / 2)
		.attr("y", dimensions.margins.bottom - 5)
		.attr("fill", "black")
		.style("font-size", "2em")
		.html("Year");

	const yAxisGenerator = d3.axisLeft()
		.scale(yScale);

	const yAxis = graph.append("g")
		.call(yAxisGenerator)
		.attr("id", "y-axis");

	const yAxisLabel = yAxis.append("text")
		.attr("x", -dimensions.boundedHeight / 2)
		.attr("y", -dimensions.margins.left + 15)
		.attr("fill", "black")
		.style("font-size", "2em")
		.text("Billions of Dollars")
		.style("transform", "rotate(-90deg)")
		.style("text-anchor", "middle");

	graph.selectAll("rect")
		.on("mouseenter", onMouseEnter)
		.on("mouseleave", onMouseLeave)
	const tooltip = d3.select("#tooltip");
	function onMouseEnter(e, datum) {
		tooltip.select("#year")
			.text(getQuarter(datum[0]));
		tooltip.attr("data-date", datum[0]);
		tooltip.select("#gdp")
			.text(`$${datum[1]}`);
		tooltip.style("transform", `translate(calc(-25% + ${dimensions.boundedWidth / 2}px), calc(-25% + ${dimensions.boundedHeight / 2}px)`);
		tooltip.style("opacity", 1);
	}
	function onMouseLeave(e, datum) {
		tooltip.style("opacity", 0);
	}
}
function getQuarter(datum) {
	const formatYear = d3.timeFormat("%Y");
	const formatMonth = d3.timeFormat("%m");
	const dateParser = d3.timeParse("%Y-%m-%d");
	let quarter = "Q0";
	let dataDate = formatMonth(dateParser(datum));
//	console.log(dataDate);
	switch(dataDate) {
		case("01") :
			quarter = "Q1";
			break;
		case("04") :
			quarter = "Q2";
			break;
		case("07") :
			quarter = "Q3";
			break;
		case("10"):
			quarter = "Q4";
			break;
		default:
			quarter = "Q-1";
			break;
	}
	return `${formatYear(dateParser(datum))} ${quarter}`;
}
barChart();
