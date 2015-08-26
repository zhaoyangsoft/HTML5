/**
 * @description eChartOptions 
 *
 * @author  mickle.zy
 * @create 
 * @function
 * @modify
 */
// ;alert(234);
define('v2/excel/chartOptions', [
        'kmd/util'
    ],
    function(require) {

        var kmd = window.kmd = require('kmd/util');
        var artTemplate = require('../template');
        var chartType = {
            line: 1,
            bar: 2,
            pie: 3
        }

        var chartOptions = {};

        chartOptions.getStrongJsonByType = function(type, typeNum) {
            type = type.toLowerCase();
            if (type == "line") {
                if (typeNum == 1) { //标准面积图
                    //itemStyle:
                    var json = {
                        normal: {
                            areaStyle: {
                                type: "default"
                            }
                        }
                    };
                    return json;
                };
                if (typeNum == 2) { //堆积面积图
                    //option 
                    var json = {
                        stack: "总量",
                    };
                    return json;
                };
                if (typeNum == 3) { //平滑曲线
                    //option 
                    var json = {
                        smooth: true,
                    };
                    return json;
                };
                return {};
            };

            if (type == "column") {
                if (typeNum == 1) { //堆积柱状图
                    var json = {
                        stack: "",
                    };
                    return json;
                };
                if (typeNum == 2) { //标准条形图
                    //option 
                    var json = {
                        stack: "",
                    };
                    return json;
                };
                if (typeNum == 3) { //堆积条形图
                    //option 
                    var json = {
                        smooth: true,
                    };
                    return json;
                };
                return {};
            };



        }
        chartOptions.getOption = function(type, data) {
            return type == chartType.line ? this.getLineOptions(data, type) :
                type == chartType.bar ? this.getLineOptions(data, type) :
                type == chartType.pie ? this.getPieOptions(data, type) :
                this.getLineOptions(data);
        };

        //判断是否发送邮件的页面. 
        chartOptions.isSendEmail = function() {
            try {
                var isSendEmail = (location.href + "").indexOf('sendEmail') != -1;
                return isSendEmail;
            } catch (e) {
                return false;
            }

        };

        chartOptions.getLineOptions = function(data, type) {
            return {

                animation: !this.isSendEmail(),
                title: {
                    text: data.title.text || '未来一周气温变化',
                    subtext: data.title.subtext || '纯属虚构',
                    x: 'center'
                },
                grid: {
                    // width:'80%'
                    x: '12%',
                    x2: '12%',
                    // y2:'18%',
                    y: '20%'
                        // x2: 220,
                        // y2: 100
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    padding: 10,
                    orient: 'vertical',
                    x: 'right',
                    y: '30',
                    data: data.legend.data || ['最高气温', '最低气温']
                },
                toolbox: {
                    show: false,
                    feature: {
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        },
                        restore: {
                            show: true
                        }
                    }
                },
                // calculable: true,
                xAxis: [{
                    type: 'category',

                    // boundaryGap: false,
                    axisLabel: data.xAxis.axisLabel || {
                        textStyle: {
                            fontSize: 7,
                            fontStyle: 'italic',
                        },
                        // rotate: -20
                    },
                    data: data.xAxis.data || ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                }],
                yAxis: data.yAxis || [{
                    type: 'value'
                }],
                series: data.series || [{
                    name: '最高气温',
                    type: (type == 2 ? 'bar' : 'line') || 'line',
                    data: [11, 11, 15, 13, 12, 13, 10, 12],

                }, {
                    name: '最低气温',
                    type: (type == 2 ? 'bar' : 'line') || 'line',
                    data: [1, -2, 2, 5, 3, 2, 0],

                }]
            };
        };
        chartOptions.getPieOptions = function(data) {
            return {
                animation: !this.isSendEmail(),
                title: {
                    text: data.title.text || '某站点用户访问来源',
                    subtext: data.title.subtext || '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    show: false,
                    orient: 'vertical',
                    x: 'right',
                    y: '30',
                    data: data.legend.data || ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                },
                // calculable: true,
                series: data.series || [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [{
                        value: 335,
                        name: '直接访问'
                    }, {
                        value: 310,
                        name: '邮件营销'
                    }, {
                        value: 234,
                        name: '联盟广告'
                    }, {
                        value: 135,
                        name: '视频广告'
                    }, {
                        value: 1548,
                        name: '搜索引擎'
                    }]
                }]
            };
        };
        chartOptions.getBarOptions = function() {};

        chartOptions.getTempO = function() {
            return {
                title: {
                    text: '未来一周气温变化',
                    subtext: '纯属虚构'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['最高气温', '最低气温']
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                // calculable: true,
                xAxis: [{
                    type: 'category',
                    // boundaryGap: false,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                }],
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        // rotate: -45,
                        formatter: '{value} °C'
                    }
                }],
                series: [{
                    name: '最高气温',
                    type: 'line',
                    data: [11, 11, 15, 13, 12, 13, 10],
                    markPoint: {
                        data: [{
                            type: 'max',
                            name: '最大值'
                        }, {
                            type: 'min',
                            name: '最小值'
                        }]
                    },
                    markLine: {
                        data: [{
                            type: 'average',
                            name: '平均值'
                        }]
                    }
                }, {
                    name: '最低气温',
                    type: 'line',
                    data: [1, -2, 2, 5, 3, 2, 0],
                    markPoint: {
                        data: [{
                            name: '周最低',
                            value: -2,
                            xAxis: 1,
                            yAxis: -1.5
                        }]
                    },
                    markLine: {
                        data: [{
                            type: 'average',
                            name: '平均值'
                        }]
                    }
                }]
            };

        };



        chartOptions = amz.Class.extend(chartOptions, {
            constructor: function() {
                var _self = this;
                _self.init();
            },
            init: function() {}




        })



        return chartOptions;
    });