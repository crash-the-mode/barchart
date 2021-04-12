async function barChart() {

	const dataset = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");
	console.log(dataset);
	const dateParser = d3.timeParse("%Y-%m-%d");
	const xAccessor = d => dateParser(d[0]);
	const yAccessor = d => d[1];

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
		.domain(d3.extent(dataset, xAccessor))
		.range([0, dimensions.boundedWidth]);

	const yScale = d3.scaleLinear()
		.domain(d3.extent(dataset, yAccessor))
		.range([dimensions.boundedHeight, 0]);


}

barChart();
