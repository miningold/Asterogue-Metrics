$(function() {
  // $.ajax({
  //   dataType: "json",
  //   url: "/api/floor",
  //   success: drawFloor
  // });

  // $.ajax({
  //   dataType: "json",
  //   url: "http://metrics.asterogue.com/api/population",
  //   success: drawPopulation
  // });

  $.ajax({
    dataType: "json",
    url: "http://metrics.asterogue.com/api/session",
    success: drawSession
  });
});

function ƒ(name){
  var v,params = Array.prototype.slice.call(arguments,1);
  return function(o) {
    return (typeof (v=o[name])==='function' ? v.apply(o,params) : v );
  };
}

// Return the first argument passed in
function I(d) { return d }

var drawSession = function(data) {
  data = _.groupBy(data, 'uniqueId');

  drawPlayTimeBox(data);

  var max = drawTimeHistogram(data);
  drawAverageTimeHistogram(data, max);
};

var drawPlayTimeBox = function(data) {
  if (!data) return;

  var margin = {top: 10, right: 50, bottom: 20, left: 50},
      width = 120 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var min = Infinity,
      max = -Infinity;

  var chart = d3.box()
      .whiskers(iqr(1.5))
      .width(width)
      .height(height);

  // map from object to array
  data = _.map(data, function(value, key) {
    return value;
  });

  // filter out small data sets
  data = _.filter(data, function(sessions) {
    return sessions.length >= 2;
  });

  var allSessions = [];

  _.each(data, function(sessions, index) {

    // filter out raid and tutorial
    sessions = _.filter(sessions, function(session) {
      return !(session.raidMode || session.tutorial);
    });

    var title;

    // map sessions to time played
    data[index] = _.map(sessions, function(session) {
      var t = session.timePlayed;

      title = session.uniqueId;

      // calc global min/max
      if (t > max) max = t;
      if (t < min) min = t;

      return t;
    });

    allSessions = allSessions.concat(data[index]);

    data[index].title = title;

    data[index].average = _.reduce(sessions, function(memo, session) {
      return memo + session.timePlayed;
    }, 0) / sessions.length;

  });

  var overallAvg = _.reduce(allSessions, function(memo, time) {
    return memo + time;
  }, 0) / allSessions.length;

  data = [allSessions].concat(data);

  data[0].label = data[0].title = "overall";
  data[0].average = overallAvg;

  chart.domain([min, max]);

  var svg = d3.select('#box').selectAll('svg')
      .data(data)
    .enter().append('svg')
      .attr('class', 'box')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

  var g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  g.append('title')
      .text(ƒ('title'));

  g.call(chart);


};

var iqr = function(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
};

var drawTimeHistogram = function(data) {
  var max = 0;

  var margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var chart = d3.histogram()
      .width(width)
      .height(height);

  var values = _(data)
    .values() // convert object to array of values
    .flatten() // concat arrays
    .reduce(function(memo, session) {
      // filter raid and tutorial
      if (!(session.raidMode || session.tutorial)) {

        // map to timePlayed
        var t = session.timePlayed;

        // find max
        if (t > max) {
          max = t;
        }
        memo.push(t);
      }
      return memo;
    }, []);
    // no .value() needed because of reduce()

  // find nearest multiple of 60 greater than max
  max = Math.ceil(max / 60) * 60;

  chart.domain([0, max])
      .data(values);

  var svg = d3.select("#time-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(chart);

  // return max for use in other charts
  return max;
};

var drawAverageTimeHistogram = function(data, max) {
  var margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var chart = d3.histogram()
      .width(width)
      .height(height);

  data = _(data)
    .values() // convert object to array of values
    .map(function(sessions, index) {

      // filter out raid and tutorial
      // must be seperate from reduce because sessions.length is a factor
      sessions = _.filter(sessions, function(session) {
        return !(session.raidMode || session.tutorial);
      });

      // calculate average
      return _.reduce(sessions, function(memo, session) {
        return memo + session.timePlayed;
      }, 0) / sessions.length;
    })
    .value(); // unwrap values

  chart.domain([0, max])
      .data(data);

  var svg = d3.select("#avg-time-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(chart);
};


// function drawFloor(data) {
//   if (!data) {
//     return;
//   }

//   var total = 0,
//       totalSpecial = 0,
//       totalCombat = 0,
//       totalMiniboss = 0,
//       percentSpecial,
//       percentCombat,
//       percentMiniboss;

//   _.each(data, function(level) {
//     total += level.totalRooms;
//     totalSpecial += level.specialRooms;
//     totalCombat += level.combatRooms;
//     totalMiniboss += level.minibossRooms;
//   });

//   totalCombat -= totalMiniboss;

//   var pieData = [
//     {
//       key: "Room Distribution",
//       values: [
//         {
//           "label": "combat",
//           "value": totalCombat * 100 / total
//         },
//         {
//           "label": "special",
//           "value": totalSpecial * 100 / total
//         },
//         {
//           "label": "miniboss",
//           "value": totalMiniboss * 100 / total
//         }
//       ]
//     }
//   ];

//   nv.addGraph(function() {
//     var chart = nv.models.pieChart()
//       .x(function(d) { return d.label; })
//       .y(function(d) { return d.value; })
//       .width(600)
//       .showLabels(true);

//     d3.select('#chart svg')
//         .datum(pieData)
//       .transition().duration(1200)
//         .call(chart);

//     return chart;
//   });
// }

// function drawPopulation(data) {
//   var i, j;

//   var rooms = [];

//   var maxVal = 0;

//   var dirMap = {
//     0: 7,
//     1: 1,
//     2: 3,
//     3: 5
//   };

//   // fill arrays with zeros
//   for (i = 0; i < 4; i++) {
//     rooms[i] = {
//       maxVal: 0,
//       cells: []
//     };
//   }

//   for (i = 0; i < 4; i++) {
//     for (j = 0; j < 9; j++) {
//       rooms[i].cells[j] = {
//         count: 0,
//         entrance: false
//       };
//     }
//   }

//   // count
//   _.each(data, function(room) {
//     var cells;

//     for (i = 0; i < 9; i++) {
//       cells = rooms[room.direction].cells;
//       cells[i].count += room.closeObjects[i];
//       cells[i].count += room.farObjects[i];
//       cells[i].count += room.midObjects[i];
//       cells[i].count += room.noneObjects[i];

//       if (i == dirMap[room.direction]) {
//         cells[i].entrance = true;
//       }

//       if (cells[i].count > rooms[room.direction].maxVal)
//       {
//         rooms[room.direction].maxVal = cells[i].count;
//       }
//     }
//   });


//   // Convert rooms to matrices
//   _.each(rooms, function(room, index) {
//     rooms[index].cells = _(room.cells)
//       .groupBy(function(cell, index) {
//         return Math.floor(index / 3);
//       })
//       .values()
//       .value();
//   });

//   var w = 80;

//   var offset = d3.scale.linear()
//     .domain([0, 1])
//     .range([0, w]);

//   var colorLow = d3.rgb('white'),
//       colorHigh = d3.rgb('red');

//   var colorScale = d3.scale.linear().range([colorLow, colorHigh]);

//   var isEntrance = function(col, globalRow) {
//     var row = globalRow % 3,
//         room = Math.floor( globalRow / 3),
//         index = row * 3 + col,
//         playerIndex = dirMap[room];

//     return (index === playerIndex);
//   };

//   var roomSvg = d3.select('#rooms').selectAll('svg')
//       .data(rooms)
//     .enter().append('svg')
//       .attr('class', 'room')
//       .attr('width', (w * 3) - 1)
//       .attr('height', (w * 3) - 1);

//   var row = roomSvg.selectAll('.row')
//       .data(ƒ('cells'))
//     .enter().append('g')
//       .attr('class', 'row');



//   var cell = row.selectAll('.cell')
//       .data(I)
//     .enter().append('rect')
//       .attr('class', 'cell')
//       .attr('width', w - 1)
//       .attr('height', w - 1)
//       .attr('x', function(d, i) { return offset(i); })
//       .attr('y', function(d, i, row) { return offset(row % 3); })
//       .style('fill', function(cell, index, row) {
//         console.log(cell);
//         var room = rooms[Math.floor(row / 3)];
//         return colorScale.domain([0, room.maxVal])(cell.count);
//       })
//       .style('stroke-width', function(d, col, globalRow) {
//         if (isEntrance(col, globalRow)) {
//           return 5;
//         } else {
//           return 1;
//         }
//       })
//       .style('stroke', function(d, col, globalRow) {
//         if (isEntrance(col, globalRow)) {
//           return 'blue';
//         } else {
//           return 'white';
//         }
//       });

//   var text = row.selectAll('text')
//       .data(I)
//     .enter().append('text')
//       .text(ƒ('count'))
//       .attr('text-anchor', 'middle')
//       .attr('x', function(d, i) { return offset(i) + (w / 2); })
//       .attr('y', function(d, i, row) { return offset(row % 3) + (w / 2) + 4; });
// }

