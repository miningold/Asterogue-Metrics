$(function() {
  $.ajax({
    dataType: "json",
    url: "/api/floor",
    success: drawFloor
  });

  $.ajax({
    dataType: "json",
    url: "http://metrics.asterogue.com/api/population",
    success: drawPopulation
  });
});

function drawFloor(data) {
  if (!data) {
    return;
  }

  var total = 0,
      totalSpecial = 0,
      totalCombat = 0,
      totalMiniboss = 0,
      percentSpecial,
      percentCombat,
      percentMiniboss;

  _.each(data, function(level) {
    total += level.totalRooms;
    totalSpecial += level.specialRooms;
    totalCombat += level.combatRooms;
    totalMiniboss += level.minibossRooms;
  });

  totalCombat -= totalMiniboss;

  var pieData = [
    {
      key: "Room Distribution",
      values: [
        {
          "label": "combat",
          "value": totalCombat * 100 / total
        },
        {
          "label": "special",
          "value": totalSpecial * 100 / total
        },
        {
          "label": "miniboss",
          "value": totalMiniboss * 100 / total
        }
      ]
    }
  ];

  nv.addGraph(function() {
    var chart = nv.models.pieChart()
      .x(function(d) { return d.label; })
      .y(function(d) { return d.value; })
      .width(600)
      .showLabels(true);

    d3.select('#chart svg')
        .datum(pieData)
      .transition().duration(1200)
        .call(chart);

    return chart;
  });
}

function drawPopulation(data) {
  var i, j;

  var cells = [];

  // fill arrays with zeros
  for (i = 0; i < 4; i++) {
    cells[i] = [];
    for (j = 0; j < 9; j++) {
      cells[i][j] = 0;
    }
  }

  // count
  _.each(data, function(room, index) {
    for (i = 0; i < 9; i++) {
      cells[room.direction][i] += room.closeObjects[i];
      cells[room.direction][i] += room.farObjects[i];
      cells[room.direction][i] += room.midObjects[i];
      cells[room.direction][i] += room.noneObjects[i];
    }
  });

  _.each(cells, function(direction, key) {

    _.each(direction, function(cell, key) {
      direction[key] = {
        label: key,
        value: cell
      };
    });

    var data = [
      {
        key: "Direction " + key,
        values: direction
      }
    ];

    console.log(data);

    nv.addGraph(function() {
      var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .staggerLabels(true)
        .tooltips(false)
        .showValues(true);

      d3.select('#population' + key + ' svg')
          .datum(data)
        .transition().duration(500)
          .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  });

  // console.log(cells);
  // nv.addGraph(function() {
  //   var chart = nv.models.discreteBarChart()
  //     .x(function(d) { return d.lable })
  //     .y(function(d) { return d.value })
  //     .staggerLabels(true)
  //     .tooltips(false)
  //     .showValues(true);

  //   // d3.select('#population svg')
  //   //     .datum()
  // });
}

