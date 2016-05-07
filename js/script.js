document.addEventListener('DOMContentLoaded', function() {
    dao.getAllSiteData(function(data) {
        data = data.site_info;
        var detailArray = toArray(data.details);
        generateData(detailArray, data.totalTimes);
    });
}, true);

function toArray(data) {
    return _.map(data, function(item, key) {
        return {
            name: key,
            times: item.times
        };
    });
}

function generateData(data, totalTimes) {
    var first = 10;
    var last = data.length - first;
    last = last > 0 ? last : 0;

    data = _.sortBy(data, 'times');

    var mainData = _.last(data, first);
    var otherData = _.first(data, last);
    var otherDataSum = 0;
    _.each(otherData, function(item) {
        otherDataSum += item.times;
    });
    var chartData = _.map(mainData, function(item) {
        return [item.name, item.times];
    });
    if (otherDataSum > 0) {
        chartData.push(['其它', otherDataSum]);
    }
    console.log(data);
    drawChart(chartData);
}

function drawChart(data) {
    $('#container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: '网站访问分布统计数据'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: '访问分布',
            data: data
        }]
    });
}
