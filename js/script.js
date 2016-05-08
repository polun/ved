document.addEventListener('DOMContentLoaded', function() {
    var nowDate = (new Date).toLocaleDateString();
    var unixEpoch = Math.floor((new Date(nowDate)).getTime() / 1000);
    initDateRange();
    $('#btnConfirm').click(selectDate).trigger('click');
}, true);

function selectDate() {
    var startDate = Date.parse($('#startDate').val()) / 1000;
    var endDate = Date.parse($('#endDate').val()) / 1000 + 25 * 60 * 60;

    // console.log(startDate, endDate);
    dao.getAll(startDate, endDate, function(data) {
        generateData(data);
    });
}

function initDateRange() {
    var date = new Date().toISOString().substring(0, 10);
    $('#startDate').val(date);
    $('#endDate').val(date);
}

function toArray(data) {
    return _.map(data, function(item, key) {
        return {
            name: key,
            times: item.times
        };
    });
}

function generateData(data) {
    var first = 10;
    var last = data.length - first;
    last = last > 0 ? last : 0;


    var mainData = _.first(data, first);
    var otherData = _.last(data, last);
    var otherDataSum = 0;
    _.each(otherData, function(item) {
        otherDataSum += item.times;
    });
    var chartData = _.map(mainData, function(item) {
        return [item.hostname, item.times];
    });
    if (otherDataSum > 0) {
        chartData.push(['其它', otherDataSum]);
    }
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
        credits: {
            enabled: false
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
