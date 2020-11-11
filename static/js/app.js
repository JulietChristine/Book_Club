function wordCloud(selector) {

  let fill = d3.scale.category20();

  //Construct the word cloud's SVG element
  let svg = d3.select(selector).append("svg")
      .attr("width", 750)
      .attr("height", 750)
      .append("g")
      .attr("transform", "translate(310, 350)");


  //Draw the word cloud
  function draw(words) {
      let cloud = svg.selectAll("g text")
                      .data(words, function(d) { return d.text; })

      //Entering words
      cloud.enter()
          .append("text")
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr('font-size', 1)
          .text(function(d) { return d.text; });

      //Entering and existing words
      cloud
          .transition()
              .duration(600)
              .style("font-size", function(d) { return d.size + "px"; })
              .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .style("fill-opacity", 1);

      //Exiting words
      cloud.exit()
          .transition()
              .duration(200)
              .style('fill-opacity', 1e-6)
              .attr('font-size', 1)
              .remove();
  }


  //Use the module pattern to encapsulate the visualisation code. We'll
  // expose only the parts that need to be public.
  return {


      update: function(words) {
          d3.layout.cloud().size([600, 600])
              .words(words)
              .padding(5)
              .rotate(function() { return ~~(Math.random() * 2) * 90; })
              .font("Impact")
              .fontSize(function(d) { return d.size; })
              .on("end", draw)
              .start();
      }
  }

}

//need to make these words come from db somehow
d3.json("http://127.0.0.1:5000/api/v1.0/wordcloudvisdata", function(data) {
    let words = data;
    console.log(words);


//Prepare one of the sample sentences by removing punctuation,
// creating an array of words and computing a random size attribute.
function getWords(i) {
  return words[i]
          .replace(/[!\.,:;\?"]/g, '')
          .split(' ')
          .map(function(d) {
              return {text: d, size: 10 + Math.random() * 60};
          })
}

function showNewWords(vis, i) {
  i = i || 0;

  vis.update(getWords(i ++ % words.length))
  setTimeout(function() { showNewWords(vis, i + 1)}, 2000)
}

//Create a new instance of the word cloud visualisation.
let myWordCloud = wordCloud('#word-cloud');

//Start cycling through the demo data
showNewWords(myWordCloud);
});
