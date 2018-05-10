// 左侧chart1
$(function () {
    //初始化echarts实例
    var myChart = echarts.init(document.querySelector('.chart1'));

    //指定图表的配置项和数据
    var option = {
        title: {
            text: '2017年注册人数'
        },
        // 图例
        legend: {
            data: ['人数'],
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name:'人数',
            data: [120, 200, 150, 80, 110, 130],
            type: 'bar'
        }],
        tooltip:{

        }
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);


    //右侧chart2
    var myChart2 =echarts.init(document.querySelector('.chart2'));

    var option2 = {
        title : {
            text: '热门品牌销售',
            subtext: '2017年6月',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['耐克','阿迪','新百伦','李宁','阿迪王']
        },
        series : [
            {
                name: '品牌',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'耐克'},
                    {value:310, name:'阿迪'},
                    {value:234, name:'新百伦'},
                    {value:135, name:'李宁'},
                    {value:1548, name:'阿迪王'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    myChart2.setOption(option2);
    

})