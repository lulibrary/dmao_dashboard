var MetadataAccessChart = {

    init: function(params) {
        $.ajax({
            url: ApiService.uri.datasetAccess(params),
            success: function(data){
                // console.log('data');
                // console.log(data);
                var filteredData = ApiService.filter.datasetAccess(data, 'metadata');
                var numMonths = 12;
                var monthData = ApiService.filter.dataLastNMonths(filteredData, numMonths);
                var chartData = reverseChronoChartData(monthData);

                if ($('#metadata_access').size() != 0) {

                    $('#metadata_access_loading').hide();
                    $('#metadata_access_content').show();

                    var plot_statistics = $.plot($("#metadata_access"),
                        [{
                            data: chartData,
                            lines: {
                                fill: 0.2,
                                lineWidth: 0,
                            },
                            color: ['#f89f9f']
                        }, {
                            data: chartData,
                            points: {
                                show: true,
                                fill: true,
                                radius: 4,
                                fillColor: "#f89f9f",
                                lineWidth: 2
                            },
                            color: '#f89f9f',
                            shadowSize: 1
                        }, {
                            data: chartData,
                            lines: {
                                show: true,
                                fill: false,
                                lineWidth: 3
                            },
                            color: '#f89f9f',
                            shadowSize: 0
                        }],

                        {
                            xaxis: {
                                tickLength: 0,
                                tickDecimals: 0,
                                mode: "categories",
                                min: 0,
                                font: {
                                    lineHeight: 14,
                                    style: "normal",
                                    variant: "small-caps",
                                    color: "#6F7B8A"
                                }
                            },
                            yaxis: {
                                ticks: 5,
                                tickDecimals: 0,
                                tickColor: "#eee",
                                font: {
                                    lineHeight: 14,
                                    style: "normal",
                                    variant: "small-caps",
                                    color: "#6F7B8A"
                                }
                            },
                            grid: {
                                hoverable: true,
                                clickable: true,
                                tickColor: "#eee",
                                borderColor: "#eee",
                                borderWidth: 1
                            }
                        });

                    var previousPoint = null;
                    $("#metadata_access").bind("plothover", function (event, pos, item) {
                        $("#x").text(pos.x.toFixed(2));
                        $("#y").text(pos.y.toFixed(2));
                        if (item) {
                            if (previousPoint != item.dataIndex) {
                                previousPoint = item.dataIndex;

                                $("#tooltip").remove();
                                var x = item.datapoint[0].toFixed(2),
                                    y = item.datapoint[1].toFixed(2);

                                showChartTooltip(item.pageX, item.pageY, item.datapoint[0], item.datapoint[1] + ' downloads');
                            }
                        } else {
                            $("#tooltip").remove();
                            previousPoint = null;
                        }
                    });
                }


            }
        });
    }
}