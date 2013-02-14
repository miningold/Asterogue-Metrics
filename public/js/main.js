$(function() {
  $.ajax({
    dataType: "json",
    url: "/api/floor",
    success: function(data) {

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
  });
});

