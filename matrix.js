
var widthm = document.getElementById('matrix').clientWidth;
var heightm = document.getElementById('matrix').clientHeight;

var size = (heightm-40)/3;
var padding = 15;
var xm = d3.scaleLinear()
    .range([padding / 2, size - padding / 2]);

var ym = d3.scaleLinear()
    .range([size - padding / 2, padding / 2]);

var xAxism = d3.axisBottom()
    .scale(xm)
    .ticks(6);

var yAxism = d3.axisLeft()
    .scale(ym)
    .ticks(6);

var color = d3.scaleOrdinal(d3.schemeCategory20);

var svgm = d3.select("#matrix").append("svg")
    .attr("width", widthm)
    .attr("height", heightm)

d3.csv("matrix.csv", function(error, data) {

  var gm = svgm
  .append("g")
  .attr('class','matrix')
    .attr("transform", "translate(" + 100 + "," + 10 + ")");

    d3.json("parallel.json", function(error, cars) {
      parallel(cars,1)
      d3.json("list.json", function(error, listdata) {
        console.log(listdata)
        list(listdata['Default'], 1)
  //==============================================
        var select = d3.select("#Select")
          .on("change", changed)
        var section = 'Default'
        function changed(){
           var sect = document.getElementById("Select");
           section = sect.options[sect.selectedIndex].value;


           cell.attr("fill","none")

           if(section === 'Years'){
               cell.filter(function(d) { return d.i === 2 || d.j === 2; })
              .attr("fill","red")
              .attr('style','fill-opacity:0.1')

              parallel(cars,1)
              accord(listdata[section])
            } else if(section === "Rating") {
              cell.filter(function(d) { return d.i === 0 || d.j === 0; })
             .attr("fill","red")
             .attr('style','fill-opacity:0.1')

             parallel(cars,1)
             accord(listdata[section])
            }
            else if(section === 'Genres'){
              parallel(cars,0)
              accord(listdata[section])
            } else{
              parallel(cars,1)
              list(listdata[section], 1)
            }
        }
  //=================================================
    })
  })

  if (error) throw error;

  //d3.select('.matrix').remove()


  var domainByTrait = {},
      traits = d3.keys(data[0]).filter(function(d) { return d !== "species"; }),
      n = traits.length;

  traits.forEach(function(trait) {
    domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
  });
  domainByTrait["character"] = ["2","44"]

  xAxism.tickSize(size * n);
  yAxism.tickSize(-size * n);

  var brush = d3.brush()
      .on("start", brushstart)
      .on("brush", brushmove)
      .on("end", brushend)
      .extent([[0,0],[size,size]]);

var col = data.columns
col.pop()
  gm.selectAll("text")
  .data(col).enter()
  .append("text")
  .attr('class','title')
  .text(function(d){return d})
  .attr('x',-70)
  .attr('y',function(d,i){return i * size + padding})

  var xmm = gm.selectAll(".x.axism")
      .data(traits)
    .enter().append("g")
      .attr("class", "x axism")
      .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
      .each(function(d) { xm.domain(domainByTrait[d]); d3.select(this).call(xAxism); });

  gm.selectAll(".y.axism")
      .data(traits)
    .enter().append("g")
      .attr("class", "y axism")
      .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
      .each(function(d) { ym.domain(domainByTrait[d]); d3.select(this).call(yAxism); });

  var cell = gm.selectAll(".cell")
      .data(cross(traits, traits))
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })

  cell.each(plot);

  cell.call(brush);
  function plot(p) {
    var cell = d3.select(this);

    xm.domain(domainByTrait[p.x]);
    ym.domain(domainByTrait[p.y]);

    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

    cell.selectAll("dots")
        .data(data)
      .enter().append("circle")
        .attr("class","dots")
        .attr("cx", function(d) { return xm(d[p.x]); })
        .attr("cy", function(d) { return ym(d[p.y]); })
        .attr("r", 2)
        .style("fill", function(d) { return color(d.species); });
  }

  var brushCell;

  // Clear the previously-active brush, if any.
  function brushstart(p) {
    if (brushCell !== this) {
      d3.select(brushCell).call(brush.move, null);
      brushCell = this;
    xm.domain(domainByTrait[p.x]);
    ym.domain(domainByTrait[p.y]);
    }
  }

  // Highlight the selected circles.
  function brushmove(p) {
    var e = d3.brushSelection(this);
    gm.selectAll("circle").classed("hidden", function(d) {
      return !e
        ? false
        : (
          e[0][0] > xm(+d[p.x]) || xm(+d[p.x]) > e[1][0]
          || e[0][1] > ym(+d[p.y]) || ym(+d[p.y]) > e[1][1]
        );
    });
  }

  // If the brush is empty, select all circles.
  function brushend() {
    var e = d3.brushSelection(this);
    if (e === null) gm.selectAll(".hidden").classed("hidden", false);
  }
})

function cross(a, b) {
  var c = [], n = a.length, m = b.length, i, j;
  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
  return c;
}
