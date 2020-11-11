d3.json("http://127.0.0.1:5000/api/v1.0/archvisdata", function(data) {
    let count = data.map(function(d){return d.target});

    let yticks = data.map(function(d){return d.source});
    let barPlotData = [
      {
        y: yticks,
        x: count,
        text: data.map(function(d){return `Publisher Avg Rating: ${d.avg}`}),
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
