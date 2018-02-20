function drawcloud(word){
var color3 = d3.scaleLinear()
        .domain([0,1,2,3,4,5,6,10,15,20,100])
        .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

d3.layout.cloud().size([230, 350])
        .words(word)
        .rotate(0)
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();

function draw(words) {

  var result = d3.extent(words.map(function(child) {
                return +child.size;
              }))
  var textsize = d3.scaleLinear()
        .domain(result)
        .range([10,80])
    d3.select('.wordcloud').remove()
    var ele = d3.select("#words").append("svg")
            .attr('class','cloud')
            .attr("width", 270)
            .attr("height", 400)
            .attr("class", "wordcloud")
            .append("g")
            // without the transform, words words would get cutoff to the left and top, they would
            // appear outside of the SVG area
            .attr("transform", "translate(120,200)")
            .selectAll("text")
            .data(words)
            .enter().append('g')

        ele.append("text")
            .style("font-size", function(d) { return textsize(d.size) + "px"; })
            .style("fill", function(d, i) { return color3(i); })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });

        ele.on("mouseover", function(d){
          d3.select(this).select("text")
          .style("font-size", "40px")
          .style("fill", "#ff4d4d")
        });
        ele.on("mouseout", function(d){
          d3.select(this).select("text")
          .style("font-size", function(d) { return textsize(d.size) + "px"; })
          .style("fill", function(d, i) { return color3(i); })
        });
}
}
