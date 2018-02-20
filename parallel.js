var marginp = {top: 30, right: -30, bottom: 10, left: 0};
//    width = 620 - margin.left - margin.right;
//    height = 270 - margin.top - margin.bottom;
var heightp = document.getElementById('parallel').clientHeight - marginp.top - marginp.bottom;
var widthp = document.getElementById('parallel').clientWidth - marginp.left - marginp.right;

var xp = d3.scaleBand().rangeRound([0, widthp]).padding(1),
    yp = {},
    dragging = {};

var line = d3.line(),
    axisp = d3.axisLeft(xp),
    background,
    foreground;

var svgp = d3.select("#parallel").append("svg")
    .attr("width", widthp + marginp.left + marginp.right)
    .attr("height", heightp + marginp.top + marginp.bottom)


var quant_p = function(v){return (parseFloat(v) == v) || (v == "")};

function parallel(cars, condition){
  d3.select('.parallel').remove()
  var gp = svgp
    .append("g")
    .attr("class","parallel")
    .attr("transform", "translate(" + marginp.left + "," + marginp.top + ")");

	dimensions = d3.keys(cars[0]);
	xp.domain(dimensions);
  var result = []
	dimensions.forEach(function(d) {
		var vals = cars.map(function(p) {return p[d];});
		if (vals.every(quant_p)){
		 yp[d] = d3.scaleLinear()
				.domain(d3.extent(cars, function(p) {
						return +p[d]; }))
				.range([heightp, 0])
			}
		else{
			var m = d3.nest().key(function(d) { return d; }).entries(vals)
			tmp = []
			m.forEach(function(d){
					tmp.push(d.key)
			})
      result = tmp;
			yp[d] = d3.scalePoint()
					.domain(tmp)
					.range([heightp, 0])}
	})

  // Add grey background lines for context.
  background = gp.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(cars)
    .enter().append("path")
      .attr("d", path);


  // Add blue foreground lines for focus.
  if(condition == 0){
    foreground = gp.append("g")
        .attr("class", "foreground")
      .selectAll("path")
        .data(cars)
      .enter().append("path")
        .attr("d", path)
        .attr("stroke", function(d) {
          return color(d.genres); });
  } else {
    foreground = gp.append("g")
        .attr("class", "foreground")
      .selectAll("path")
        .data(cars)
      .enter().append("path")
        .attr("d", path)
        .attr('stroke', '#ffbf80')
  }

  // Add a group element for each dimension.
  var gpp = gp.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + xp(d) + ")"; })
      .call(d3.drag()
        .subject(function(d) { return {x: xp(d)}; })
        .on("start", function(d) {
          dragging[d] = xp(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(widthp, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          xp.domain(dimensions);
          gpp.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("end", function(d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + xp(d) + ")");
          transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));
extents = dimensions.map(function(p) { return [0,0]; });

  // Add an axis and title.
  gpp.append("g")
      .attr("class", "axisp")
      .each(function(d) { d3.select(this).call(axisp.scale(yp[d])); });

  gpp.append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })

  // Add and store a brush for each axis.
  gpp.append("g")
      .attr("class", "brushp")
      .each(function(d) {
        d3.select(this).call(yp[d].brush = d3.brushY().extent([[-8, 0], [8,heightp]]).on("brush start", brushstart).on("brush", brush));
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
  return result;
}

function position(d) {
  var v = dragging[d];
  return v == null ? xp(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), yp[p](d[p])]; }));
}

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  for(var i=0;i<dimensions.length;++i){
      if(d3.event.target==yp[dimensions[i]].brush) {
          extents[i]=d3.event.selection.map(yp[dimensions[i]].invert,yp[dimensions[i]]);

      }
  }

    foreground.style("display", function(d) {
      return dimensions.every(function(p, i) {
          if(extents[i][0]==0 && extents[i][0]==0) {
              return true;
          }
        return extents[i][1] <= d[p] && d[p] <= extents[i][0];
      }) ? null : "none";
    });
}
