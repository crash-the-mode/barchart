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
			top: 30,
			right: 15,
			bottom: 50,
			left: 50,
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

	const xScale = d3.scaleTime()
		.domain(d3.extent(dataset.data, xAccessor))
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
		.attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)));
}

barChart();
