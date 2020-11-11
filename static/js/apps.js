d3.json("http://127.0.0.1:5000/api/v1.0/archvisdata", function(data) {
    let count = data.map(function(d){return d.target});

    let yticks = data.map(function(d){return d.source});
    let barPlotData = [
      {
        y: yticks,
        x: count,
        text: data.map(function(d){return `Publisher Avg weeks: ${d.avg}`}),
        type: "bar",
        orientation: "h",
        marker: {
            color: ["#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E", "#B92699", "#18C5EF", "#87ECF7", "#FAF1C1", "#FE7879", "#E85D8E" ]
          }
      }
    ];
    let barPlotLayout = {
      title: "Number of Best Sellers By Author",
      width: 1200,
      height:900,
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot("bar", barPlotData, barPlotLayout);
});

d3.json("http://127.0.0.1:5000/api/v1.0/adelavisdata", function(error,data) {

  function tabulate(data, columns) {
		var table = d3.select('#books-table').append('table-active')
		var thead = table.append('thead')
		var	tbody = table.append('tbody');

		// append the header row
		thead.append('tr')
		  .selectAll('th')
		  .data(columns).enter()
		  .append('th')
		    .text(function (column) { return column; });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr');

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return columns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
		  .append('td')
		    .text(function (d) { return d.value; });

	  return table;
	}

	// render the table(s)
	tabulate(data, ['author', 'descriptions']); // 2 column table

});

let svgWidth = 1200;
let svgHeight = 600;

let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;
//Set up scatter 
let svg = d3.select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

let chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

let chosenX = 'rating';

function xScale(chartData, chosenX) {

  let xLinearScale = d3.scaleLinear()
      .domain([d3.min(chartData, d => d[chosenX]) * 0.90 ,d3.max(chartData, d=> d[chosenX]) * 1.02])
      .range([0, width]);
  
  return xLinearScale;
}

function renderAxes(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale); 
  xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  return xAxis;
};

function renderCircles(circlesGroup, xLinearScale, chosenX) {
  circlesGroup.transition()
      .duration(1000)
      .attr('cx', d => xLinearScale(d[chosenX]))

  
  return circlesGroup;
};

 
function updateToolTip(chosenX, circlesGroup) {
  let label;

  if (chosenX === 'rating') {
      label = 'Rating'
  }
  else {
      label = 'Number of Ratings'
  }

  let toolTip = d3.tip()
      .attr('class', 'tooltip')
      .offset([80, -60])
      .html(function(d) {
          return (`Title ${d.title} <br></br> Author ${d.author}`);
      });
  
  circlesGroup.call(toolTip);

  circlesGroup.on('mouseover', function(data) {
      toolTip.show(data);
  })
  .on('mouseout', function(data) {
      toolTip.hide(data);
  });
  return circlesGroup
}

d3.json('http://127.0.0.1:5000/api/v1.0/scattervisdata', function(chartData){	
	console.log(chartData);	


    let xLinearScale = xScale(chartData, chosenX);

    let yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(chartData, d=>d.weeks)])
    .range([height, 0]);

    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    let xAxis = chartGroup.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0,${height})`)
      .call(bottomAxis);

    chartGroup.append('g')
      .call(leftAxis);

    let circlesGroup = chartGroup.selectAll('circle')
      .data(chartData)
      .enter()
      .append('circle')
      .attr('cx', d => xLinearScale(d[chosenX]))
      .attr('cy', d => yLinearScale(d.weeks))
      .attr('r', '3')
      .attr('fill', '#B92699')
      .attr('stroke', 'grey')
      .attr('stroke-width', '0.5')
      .attr('opacity', '.5')

    let labelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${width / 2}, ${height + 20})`);

    let ratingLabel = labelsGroup.append('text')
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'rating')
      .classed('active', true)
	  .text('Book Rating')
	  .attr('font-weight', 700)
	  .attr('text-anchor', 'middle')
      .attr('font-size', 22)
      .attr('fill', '#B92699');

    let countLabel = labelsGroup.append('text')
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'count')
      .classed('inactive', true)
	  .text('Number of Ratings')
	  .attr('font-weight', 700)
	  .attr('font-size', 22)
	  .attr('text-anchor', 'middle')
      .attr('fill', '#FE7879');

    chartGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .classed('axis-text', true)
	  .text('Number of Weeks on the List')
	  .attr('text-anchor', 'middle')
      .attr('font-weight', 700)
      .attr('font-size', 22)
      .attr('fill', '#FE7879');

    let text = chartGroup.selectAll()
      .data(chartData)
      .enter()
      .append('text')
      .attr('dx', d => xLinearScale(d[chosenX]))
      .attr('dy', d => yLinearScale(d.weeks));


    circlesGroup = updateToolTip(chosenX, circlesGroup)

    labelsGroup.selectAll('text')
      .on('click', function() {
        let value = d3.select(this).attr('value');
        if (value !== chosenX) {
            chosenX = value;

            console.log(chosenX);

            xLinearScale = xScale(chartData, chosenX);
            xAxis = renderAxes(xLinearScale, xAxis);
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenX);
            circlesGroup = updateToolTip(chosenX, circlesGroup);

            if (chosenX === 'count') {
              countLabel
                  .classed('active', true)
                  .classed('inactive', false);
              ratingLabel
                  .classed('active', false)
                  .classed('inactive', true);
      
          }
          else {
              countLabel
                  .classed('active', false)
                  .classed('inactive', true);
              ratingLabel
                  .classed('active', true)
                  .classed('inactive', false);
          }
      }
  })

// }).catch(function(error) {
//   console.log(error);
});