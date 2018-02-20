var widthl = 270
var heightl = 800;
var marginl = {top: 10, right: 10, bottom: 10, left: 10};


    var accordionItems = new Array();


    function getFirstChildWithTagName( element, tagName ) {
      for ( var i = 0; i < element.childNodes.length; i++ ) {
        if ( element.childNodes[i].nodeName == tagName ) return element.childNodes[i];
      }
    }

function list(data, blocks){
  d3.select('.list').remove()
  var listpart = document.getElementById('list');
  while(listpart.childNodes.length !== 0){
    var re = listpart.childNodes[0];
    re.remove();
  }

  var svgl = d3.select("#list").append("svg")
      .attr("width", widthl + 50)
      .attr("height", 35 * 618)
      .attr('class','list')
  var gl = svgl
    .append("g")
    .attr("transform", "translate(" + 0 + "," + 0 + ")")

  var element = gl.selectAll("g")
    .data(data).enter()
    .append("g")

  element
    .append('text')
    .attr('class','title')
    .text(function(d) { return d.title; })
    .attr("x", marginl.left)
    .attr("y", function(d,i){ return i * 35 +　20; });

  element
  .append('text')
  .attr('class','detail')
  .text(function(d) { return d.year + ' IMDb:' + d.rating + ' [' + d.genres + ']'; })
  .attr("x", marginl.left)
  .attr("y", function(d,i){ return i * 35 + 32; });

  element
  .on('click', function(d){
    var t1 = document.getElementById("t1")
    t1.innerHTML = d.title.toUpperCase();
    var t2 = document.getElementById("t2")
    t2.innerHTML = d.year + ' IMDb:' + d.rating + ' [' + d.genres + ']'
      detailview(d.pan, d.sub)
  })
}

function accord(data){

  d3.select('.list').remove()

  var listpart = document.getElementById('list');
  while(listpart.childNodes.length !== 0){
    var re = listpart.childNodes[0];
    re.remove();
  }
  var block = document.createElement("div")
  block.classList.add("mylist");

  data.forEach(function(d,i){
    var button = document.createElement("button");
    button.classList.add("accordion");
    button.innerHTML = d.name;
    var div = document.createElement("div");
    div.classList.add("panel");
    div.id = "mydiv"+i
    block.appendChild(button);
    block.appendChild(div);
  })
  listpart.appendChild(block)

  data.forEach(function(d,i){
    //==================================

        var svgl = d3.select("#mydiv"+i).append("svg")
            .attr("width", widthl + 50)
            .attr("height", 35 * (d.data.length + 1) )
            .attr('class','list')

        var gl = svgl
          .append("g")
          .attr("transform", "translate(" + 0 + "," + 0 + ")")

        var element = gl.selectAll("g")
          .data(d.data).enter()
          .append("g")

        element
          .append('text')
          .attr('class','title')
          .text(function(d) { return d.title; })
          .attr("x", marginl.left)
          .attr("y", function(d,i){ return i * 35 +　20; });

        element
        .append('text')
        .attr('class','detail')
        .text(function(d) { return d.year + ' IMDb:' + d.rating + ' [' + d.genres + ']'; })
        .attr("x", marginl.left)
        .attr("y", function(d,i){ return i * 35 + 32; });

        element
        .on('click', function(d){
          var t1 = document.getElementById("t1")
          t1.innerHTML = d.title.toUpperCase();
          var t2 = document.getElementById("t2")
          t2.innerHTML = d.year + ' IMDb:' + d.rating + ' [' + d.genres + ']'
            detailview(d.pan, d.sub)
        })
        //==================================
  })

  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight){
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
}
