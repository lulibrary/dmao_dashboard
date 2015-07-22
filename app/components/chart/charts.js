function reverseChronoChartData(monthData) {
    // put into labelled format for chart, with array in reverse chronological order
    // assumes chronological order as input
    // outpuut format:
    // var arr = [
    //     ['Month Label 1', value],
    //     ['Month Label 2', value],
    // ];
    var chartData = [];
    var j = monthData.length;
    for(var i = 0; i < monthData.length; ++i) {
        --j;
        chartData[i] = [monthData[j].month, monthData[j].value];
    }  

    // console.table('chartData');
    // console.table(chartData);
    return chartData;
}

