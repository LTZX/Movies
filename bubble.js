

function drawbubble(a,b){
        d3.select('.bubbles1').remove()

      var heightb = document.getElementById('bubble2').clientHeight - 20;
      var widthb = document.getElementById('bubble2').clientWidth - 20;

      var svgb1 = d3.select("#bubble1").append("svg")
          .attr('class','bubbles1')
          .attr("width", widthb* 3/5)
          .attr("height", heightb* 3/5)
          .attr("transform","translate(" + 5 + "," + 30 + ")")

      var b1 = svgb1.call(d3.liquidfillgauge, a, {
        circleThickness: 0.10,
        textVertPosition: 0.8,
        waveAnimateTime: 1000,
        waveHeight: 0.05,
        waveAnimate: true,
        waveRise: false,
        waveOffset: 0.25,
        textSize: 0.75,
        waveCount: 3
      });

      d3.select('.text1').remove()
      d3.select("#text1").append("text")
      .attr('class','text1')
      .text("Polarity")
      .style("text-align","center")
      .style('line-height', '3')
      .style("font-family", "sans-serif")

      d3.select('.bubbles2').remove()

      var svgb2 = d3.select("#bubble2").append("svg")
          .attr('class','bubbles2')
          .attr("width", widthb* 3/5)
          .attr("height", heightb* 3/5)
          .attr("transform","translate(" + 5 + "," + 30 + ")")

      var b2 = svgb2.call(d3.liquidfillgauge, b, {
        circleThickness: 0.10,
        textVertPosition: 0.8,
        waveAnimateTime: 1000,
        waveHeight: 0.05,
        waveAnimate: true,
        waveRise: false,
        waveOffset: 0.25,
        textSize: 0.75,
        waveCount: 3
      });

      d3.select('.text2').remove()
      d3.select("#text2").append("text")
      .attr('class','text2')
      .text("Subjectivity")
      .style("text-align","center")
      .style('line-height', '3')
      .style("font-family", "sans-serif")

}
