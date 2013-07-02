(function() {

d3.histogram = function() {
  var width = 1,
      height = 1,
      domain = null,
      values = [],
      histogram;

  histogram = function(svg) {
    var x = d3.scale.linear()
        .domain(domain || [0, 120])
        .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(20))
        (values);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var formatCount = d3.format(",.0f"),
        formatTime = d3.time.format("%H:%M"),
        formatMinutes = function(d) { return formatTime(new Date(2012, 0, 1, 0, d)); };

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(formatMinutes);

    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(data[0].dx) - 1)
        .attr("height", function(d) { return height - y(d.y); });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
  };

  histogram.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return histogram;
  };

  histogram.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return histogram;
  };

  histogram.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x;
    return histogram;
  };

  histogram.data = function(x) {
    if (!arguments.length) return values;
    values = x;
    return histogram;
  };

  return histogram;
};

})();
