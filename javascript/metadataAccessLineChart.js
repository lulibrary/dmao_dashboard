var MetadataAccessLineChart = function(data, options){

    var drawChart = true;
    // var metadataAccessResponseDataOld = App.metadataAccessResponseData;
    
    // // console.log('Data OLD', dataAccessResponseDataOld);

    // if (!angular.equals(metadataAccessResponseDataOld, data)){
    //   // console.log('Data CHANGED, should redraw graph');
    //   App.metadataAccessResponseData = data;
    //   redrawChart = true;
    // }
    // else
    // {
    //   // console.log('Checksum SAME, should NOT redraw graph');
    // }

    if (drawChart){
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = options.width - margin.left - margin.right,
            height = options.height - margin.top - margin.bottom;

        var parseDate = d3.time.format("%Y-%m-%d").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) { return x(d.access_date); })
            .y(function(d) { return y(d.counter); });

            $( "#metadataAccessChart" ).empty();

        var svg = d3.select("#metadataAccessChart").append("svg")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            .attr("width", options.width + margin.left + margin.right)
            .attr("height", options.height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          
          data.forEach(function(d) {
            d.access_date = parseDate(d.access_date);
            d.counter = +d.sum;
          });
          // //console.table(data);

          x.domain(d3.extent(data, function(d) { return d.access_date; }));
          y.domain(d3.extent(data, function(d) { return d.counter; }));

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")              
              .style("text-anchor", "end")
              .text("Downloads");

          svg.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line);
    }
};
