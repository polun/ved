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

function baseChartInfo() {
    return {
        title: '网站访问分布统计数据'
    };
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
    var pieData = [],
        barData = {
            categories: [],
            SeriesData: []
        };
    var len = mainData.length;
    for (var i = 0; i < len; i++) {
        pieData.push([mainData[i].hostname, mainData[i].times]);
        barData.categories.push(mainData[i].hostname);
        barData.SeriesData.push(mainData[i].times);
    }

    if (otherDataSum > 0) {
        pieData.push(['其它', otherDataSum]);
        barData.categories.push('其它');
        barData.SeriesData.push(otherDataSum);
    }

    drawPie({
        title: '饼图分布',
        data: pieData
    });
    drawBar({
        title: '柱形统计',
        data: barData
    });
}

function drawPie(option) {
    $('#pie').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: option.title
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
            data: option.data
        }]
    });
}

function drawBar(option) {
    $('#bar').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: option.title
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: option.data.categories
        },
        yAxis: {
            min: 0,
            title: {
                text: '次数 (次)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} 次</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '访问次数',
            data: option.data.SeriesData
        }]
    });
}
