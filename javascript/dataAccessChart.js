var DataAccessChart = function() {
    var init = function() {
        setupChart();
    };
    return {
        init: init,
    };
}();

function monthDiff(date){
    var now = moment();
    var diff = now.diff(date, 'months');
    return diff;
}

function dataLastNMonths(json, n){
    // console.log(data);
    var data = [];
    for(var i=0;i<json.length;++i) {
        var diff = monthDiff(moment(json[i].access_date));
        data.push(diff);
    }
    return data;
}


function setupChart() {
    $.ajax({
        url: ApiService.uri.datasetAccess(),
        success: function(json){
            // console.log('Data access data...');
            // console.table(json);
            // console.table(dataLastNMonths(json, 12));

            var year = []
            for(var i=0;i<12;++i) {
                var start = moment().subtract(i, 'months').startOf('month').format('YYYY-MM-DD');
                var end = moment().subtract(i, 'months').endOf('month').format('YYYY-MM-DD');
                year.push({i: i, start: start, end: end})
            }
            console.table(year);
            // var a = moment('2015-06-30');
            // var b = moment('2015-04-31');            
            // console.log('Test diff ' + a.diff(b, 'months'));

            // console.log(moment().startOf('month').format('YYYYMMDD'));



            var visitors = [
                ['07/2014', 15],
                ['08/2014', 23],
                ['09/2014', 50],
                ['10/2014', 98],
                ['11/2014', 460],
                ['12/2014', 229],
                ['01/2015', 416],
                ['02/2015', 1000]
            ];

            if ($('#data_access').size() != 0) {

                $('#data_access_loading').hide();
                $('#data_access_content').show();

                var plot_statistics = $.plot($("#data_access"),
                    [{
                        data: visitors,
                        lines: {
                            fill: 0.6,
                            lineWidth: 0
                        },
                        color: ['#f89f9f']
                    }, {
                        data: visitors,
                        points: {
                            show: true,
                            fill: true,
                            radius: 5,
                            fillColor: "#f89f9f",
                            lineWidth: 3
                        },
                        color: '#fff',
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
                $("#data_access").bind("plothover", function (event, pos, item) {
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