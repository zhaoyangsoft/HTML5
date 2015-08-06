//
/// // //console.info()
/*@description excelChart
 *用来控制 excel 上的图形报表的生成.*
 * @author mickle.zy 
 */
define('v2/excel/excelChart', [
        'kmd/util',
        'v2/excel/chartOptions',
        'ct/echarts/echarts-all',
        // 'ct/echarts/echarts',
        // 'ct/echarts/chart/bar',
        // 'ct/echarts/chart/line',
        // 'ct/echarts/chart/pie',
        'bui/menu',
        'bui/overlay'
    ],
    function(require) {
        var kmd = window.kmd = require('kmd/util');
        var artTemplate = require('../template');
        var Overlay = require('bui/overlay');
        var Menu = require('bui/menu');
        var chartOptions_ = require('v2/excel/chartOptions');
        var artTemplate = require('../template');
        var chartOptions = new chartOptions_();
        var chartTypeConstant = {
            line: 1,
            bar: 2,
            pie: 3,
            combi: 4, //组合图. （line bar 组合）
            scatter: 5, //散点图
            bubble: 6, //气泡图
            radar: 7, //雷达图
            funnel: 8, //漏斗图
            gauge: 9, //仪表盘
            zuhe: 4 //组合图
        };
        var ec_constant = {
                zhu: '主: ',
                ci: '次: ',
                legendImgUrl: 'image://http://g.tbcdn.cn/sjzn/system/v2/images/excel/bg-white.png'
            }
            //监控 哪些 已有的 sheet 没有被打开过. 
        var sheetOpened = {};

        var excelChart = amz.Class.extend({
            constructor: function(options) {
                //console.info('version 2..');
                var _self = this;
                _self.options = amz.extend({}, options);
                var spread = options.alisheet.get('spread')
                _self.set('alisheet', options.alisheet);
                _self.set('spread', spread);
                if (!window.excelFun) {
                    window.excelFun = window.sp;
                };
                if (options) {
                    window.excelFun = window.excelFun || options.alisheet;
                };
                _self.init();

            },
            init: function() {
                var _self = this;
                _self.initTemplateRender();
                _self.initChartMenu();
                _self.initDialog();
                _self.initSpreadCustomerFloatObjectEvent();
                // _self.backShowChart();
                _self.initsheetOpened();
                _self.initLoadCss();
                _self.initEvent();
            },
            initLoadChartEditorDiv: function() {

            },
            initLoadCss: function() {
                amz.createStyleSheet('http://g.tbcdn.cn/sjzn/system/v2/css/tab.css');

                //TODO 随后放到 vm 中. 
                $('#pEditor-x1').parents('table:first').find('tr:first').find('td:first').css('width', '44%');
            },
            initsheetOpened: function() {
                var _self = this;
                var spread = _self.get('spread');
                //console.info(spread)
                var count = spread.getSheetCount();
                var sheet;
                for (var i = 0; i < count; i++) {
                    sheetOpened[spread.getSheet(i)._name] = '0';
                };
            },

            /**
             * 初始化 模板render
             */
            initTemplateRender: function() {
                var _self = this;
                //显示列的render
                var combiTplRender = artTemplate.compile(getCombiDialogTemplate());
                _self.set('combiTplRender', combiTplRender);

            },
            initDialog: function() {
                var _self = this;
                _self.initChangeNameDialog();
                _self.initCombiDialog();
                _self.initCRDialog();
                _self.initChartTypeDialog();
            },

            /**
             * 初始化 chartType dialog 
             */
            initChartTypeDialog: function() {
                var _self = this;
                var dialog = new Overlay.Dialog({
                    title: '请选择图表类型',
                    width: 750,
                    height: 550,
                    mask: true,
                    autoRender: true,
                    buttons: [{
                        text: '确定',
                        elCls: 'button button-primary',
                        handler: function() {
                            var activeItem = $('#div_edit_chart_container .dtm-con-item.active');

                            var tabType = activeItem.attr('data-tab-key');
                            tabType = (tabType + '').toLowerCase();

                            var subIndex = activeItem.attr('data-mold-index');
                            _self.__chartTypeClick(tabType, subIndex);

                            this.close();
                        }
                    }, {
                        text: '取消',
                        elCls: 'button button-primary',
                        handler: function() {
                            // _self.editChartType_type = null;
                            var newType;
                            if (_self.editChartType && _self.editChartType['newType'] != undefined) {
                                newType = _self.editChartType['newType'];
                            };
                            //如果不是组合图.
                            if (newType != 4) {
                                _self.editChartType = null;
                            };
                            this.close();
                        }
                    }],
                    bodyContent: $('.chart-type-conatiner').html()
                });
                dialog.on('closed', function(e) {
                    _self.set('chartTypeDialog_display', 'hidden');
                })
                dialog.on('show', function(e) {
                    _self.set('chartTypeDialog_display', 'show');
                })
                $('.chart-type-conatiner').remove();

                $('.chart-setting .dtm-tab0-li').bind('click', function() {
                    $('.chart-setting .dtm-tab0-li').removeClass('active');
                    $(this).addClass('active');
                    var tabClass = $(this).attr('tab');
                    $('.chart-setting .dtm-tab0-coni').hide();
                    $('.chart-setting div[data-cpt-con0="' + tabClass + '"]').addClass('active').show();
                });
                _self.set('chartTypeDialog', dialog);
            },

            /**
             * 初始化 选择数据源的 dialog 
             */
            initCRDialog: function() {
                var _self = this;
                var dialog = new Overlay.Dialog({
                    title: '         选择数据源',
                    width: 500,
                    height: 80,
                    mask: false,
                    autoRender: true,
                    buttons: [],
                    bodyContent: '<div class="div-sel-datasource-cr-container"><div class="divTableCol" title="选择单元格范围或输入单元格地址"> <input type = "text"  class = "textField" name = "dataRange" id = "pEditor-ds-cr-selecter-v" style = "width:88%;float:left;padding-right:22px;height16px;" > <span class = "rangeSelectOut"  style="top:12px;"> </span> </div > </div > '
                });
                dialog.on('closed', function(e) {
                    _self.set('CRDialog_display', 'hidden');

                    if (_self.CRDialog_trigger == undefined || _self.CRDialog_trigger == true) {
                        _self._pEditorDivToggle(true);
                        $('#pEditor-ds-cr').val($('#pEditor-ds-cr-selecter-v').val()).trigger('change');
                    };
                    _self.CRDialog_trigger = true;
                })
                dialog.on('show', function(e) {
                    _self.set('CRDialog_display', 'show');
                })
                $('#pEditor-ds-cr-selecter-v').unbind('keydown').bind('keydown', function(e) {
                    if (e.keyCode == 13) {
                        _self._crSelecterTrigger();
                    };
                });

                $('.div-sel-datasource-cr-container .rangeSelectOut').unbind('click').bind('click', function(e) {
                    _self._crSelecterTrigger();
                });
                $('#pEditor-ds-cr-selecter-v').unbind('keydown').bind('keydown', function(e) {
                    if (e.keyCode == 13) {
                        _self._crSelecterTrigger();
                    };
                });
                _self.set('CRDialog', dialog);

            },
            _crSelecterTrigger: function() {
                var _self = this;
                var CRDialog = _self.get('CRDialog');
                CRDialog.close();
            },
            /**
             * 初始化 合并的 dialog 
             */
            initCombiDialog: function() {
                var _self = this;
                var dialog = new Overlay.Dialog({
                    title: '设置组合信息',
                    width: 750,
                    height: 550,
                    // mask: true,
                    autoRender: true,
                    buttons: [{
                        text: '确定',
                        elCls: 'button button-primary',
                        handler: function() {

                            var editChartType = _self.editChartType;
                            var divId = null,
                                newSetting = null;
                            if (editChartType) {
                                divId = editChartType['oldId'];
                                newSetting = editChartType['newSetting']
                            };


                            _self.doRenderChart(chartTypeConstant.combi, null, null, null, divId, {
                                'doRender': true,
                                settingOption: _self.get('cur_oper_setting_option'),
                                // 'settings': newSetting
                            });
                            _self.editChartType = null;
                            this.close();
                        }
                    }, {
                        text: '取消',
                        elCls: 'button button-primary',
                        handler: function() {
                            _self.editChartType = null;
                            this.close();
                        }
                    }],
                    bodyContent: '<div class="div-combi-container"></div>'
                });
                dialog.on('closed', function(e) {
                    _self.set('combiDiaglog_display', 'hidden');
                })
                dialog.on('show', function(e) {
                    _self.set('combiDiaglog_display', 'show');
                })
                _self.set('combiDiaglog', dialog);

            },
            //判断是否是发送邮件页面. 
            isSendEmail: function() {
                try {
                    var isSendEmail = (location.href + "").indexOf('sendEmail') != -1;
                    return isSendEmail;
                } catch (e) {
                    //console.error(e)
                    return false;
                }
            },
            /**
             * 初始化 修改名字 dialog 
             */
            initChangeNameDialog: function() {
                var _self = this;
                var dialog = new Overlay.Dialog({
                    title: '修改名字',
                    width: 350,
                    height: 150,
                    // mask: true,
                    autoRender: true,
                    buttons: [{
                        text: '确定',
                        elCls: 'button button-primary',
                        handler: function() {
                            // 0. getTitleName 
                            var mainTitle = $('#chart-main-title').val();
                            var subTitle = $('#chart-sub-title').val();

                            var activeChartId = _self.get('activeChartId');
                            var charts = _self.get('charts');
                            var c = charts[activeChartId];
                            var option = c.chart.getOption();
                            var title = {};
                            title.text = mainTitle;
                            title.subtext = subTitle;
                            option.title = title;
                            if (c.option) {
                                c.option.title = title;
                            }

                            c.chart.setOption(option);
                            this.close();
                        }
                    }, {
                        text: '取消',
                        elCls: 'button button-primary',
                        handler: function() {
                            this.close();
                        }
                    }],
                    bodyContent: '<table style="margin-top:7px;margin-left:8px;"> <tr> <td> 主标题: </td><td><input type="text" id="chart-main-title" /> </td></tr>  <tr style="line-height:4"> <td> 副标题: </td><td><input type="text" id="chart-sub-title" /> </td></tr> </table>'
                });
                dialog.on('closed', function(e) {
                    // _self.copyProData2Tr();
                })
                _self.set('chartNameDialog', dialog);
            },
            //回显 数据. 
            backShowChart: function(chartOption) {

                var _self = this;
                var spread = _self.get('spread');
                // 1.  charts . 
                var c;

                if (chartOption == undefined) {
                    c = localStorage['tempCharts'];
                    if (c == undefined) {
                        return;
                    }
                    c = JSON.parse(c);
                } else {
                    c = chartOption;
                    _self.set('oldChartOption', chartOption)
                    localStorage['tempCharts'] = JSON.stringify(c);
                }

                for (var i = 0; i < c.length; i++) {
                    var s = c[i];

                    var sheet = spread.getSheetFromName(s.name);
                    var fobjs = s.fobjs;
                    for (var j = 0; j < fobjs.length; j++) {
                        var fobj = fobjs[j];
                        //判断是否 已经渲染过. 

                        var c_ = _self._getChartByKey(fobj.divName);
                        if (c_ == null) {
                            _self.doRenderChart(fobj.type, fobj);
                        }
                    };
                };

                // 2.  
            },
            //保存 chart 
            doSaveChart: function() {
                var _self = this;
                //1. chart json , cr 值 , sheet chart
                //1. 获取所有 sheet 

                var spread = _self.get('spread');
                sheetOpened[spread.getActiveSheet()._name] = '1';

                var count = spread.getSheetCount();
                var result = [],
                    option;
                for (var i = 0; i < count; i++) {
                    var s = spread.getSheet(i);
                    var so = { //sheet object
                        name: s.getName(),
                        fobjs: [] //float objects 
                    };
                    var objs = s.getFloatingObjects();
                    var o, fobjs = [];
                    for (var j = 0; j < objs.length; j++) {
                        o = objs[j];
                        var c = _self._getChartByKey(o._name.replace('f2_', ''));
                        if (c == null) {
                            continue;
                        }
                        option = c.chart.getOption();
                        if (option.series == undefined) {
                            option = c.option;
                        };

                        var fo = {
                            location: {
                                x: o._location.x,
                                y: o._location.y,
                                width: o._location.width,
                                height: o._location.height
                            },
                            divName: o._name.replace('f2_', ''),
                            type: c.chartType,
                            cr: c.baseData.cr,
                            isXYChange: c.isXYChange,
                            chartName: option.title.text,
                            chartSubName: option.title.subtext,
                            settings: c.settings
                        }
                        fobjs.push(fo);
                    };

                    so.fobjs = fobjs;
                    result.push(so);
                };

                // 判断哪些 sheet 没打开过，把没打开过的 sheet 的 信息 重新放到结果集里边 
                var oldchartOption = _self.get('oldChartOption');
                var noOpenedSheet = []
                for (var i in sheetOpened) {
                    if (sheetOpened[i] == 0) {
                        noOpenedSheet.push(i);
                    };
                };
                var sheetTemp;
                if (oldchartOption != null)
                    for (var i = 0; i < oldchartOption.length; i++) {
                        sheetTemp = oldchartOption[i];
                        if (amz.contains(noOpenedSheet, sheetTemp.name)) {
                            result.push(sheetTemp);
                        };
                    };

                //2. sheet 上获取ObjectFloat  
                localStorage['tempCharts'] = JSON.stringify(result);

                return result;
            },
            _getChartByKey: function(key) {
                var _self = this;
                var charts = _self.get('charts') || {};
                return charts[key];
            },
            initEvent: function() {
                var _self = this;
                //_self.initIconChartClick();
                _self.initCellChangedEvent();
                _self.initSelectionChangedEvent();
                _self.initSheetChangeEvent();
                _self.initFloatingObjectChanged();
                _self.initTabEvent();
                $('canvas').live('click', function(e) {
                    _self.get('chartMenu').hide();
                });
                $('.dtm-close-cross').live('click', function(e) {
                    _self._closeAddChart();
                });
                _self.initBindAddChartEvent();
                _self.initEditerJsonsRelatedEvent();
                _self.initSheetRefreshed();
            },
            initSheetRefreshed: function() {
                var _self = this;
                excelFun.on('sheetRefreshed', function() {
                    _self.doRefreshChart_curSheet();
                })
            },
            initCRChangeEvent: function() {
                var _self = this;
                $('#pEditor-ds-cr').unbind('change').bind('change', function() {
                    var newCr = _self._getCRByStr($(this).val());
                    var activeChartId = _self.get('activeChartId');
                    if (newCr && newCr.col != undefined) {
                        _self.setSelectionByChartCR(newCr);
                        _self.reLoadChartByDivID(activeChartId, null, null, null, {
                            newCr: newCr
                        });
                    } else {
                        var charts = _self.get('charts');
                        var c = charts[activeChartId];
                        $(this).val(_self._getStrByCR(c.baseData.cr));
                    }
                })
            },

            //编辑图表参数 相关事件
            initEditerJsonsRelatedEvent: function() {
                var _self = this;
                // _self._initChartEditorChangeEvent();
                _self.initCRSelecterEvent();


                $('#div-legend-item .pEditor-item-body').unbind('click').bind('click', function(e) {
                    if (e.target.type != 'checkbox') {
                        var cb = $(this).find('input[type="checkbox"]').eq(0);
                        if (cb.attr('checked') != 'checked') {
                            cb.attr('checked', 'checked').trigger('change');
                        };
                    };
                });


                // pEditor-lineStyle-color
                $('.chart-pEditor-cont').unbind('dblclick').bind('dblclick', function(e) {
                    if (arguments[0].target.type != 'text') {
                        var chart_id = $(this).attr('chart_id');
                        $('#' + chart_id).trigger('click');
                    };
                });

                $('#div_edit_chart_container .dtm-con-item').unbind('click').bind('click', function(e) {
                    $('#div_edit_chart_container .dtm-con-item').removeClass('active');
                    $(this).addClass('active');
                });

                // 
                $('#pEditor-cb-xychange').unbind('click').bind('click', function(e) {
                    var curChecked = $(this).attr('checked');
                    var activeChartId = _self.get('activeChartId');
                    var charts = _self.get('charts');
                    var c = charts[activeChartId];
                    if (c.chartType == 3 || c.chartType == 4) {
                        BUI.Message.Alert(c.chartType == 3 ? '饼图' : '组合图' + '的行列转换 敬请期待 下个版本 :) ~ ', 'warning');
                        return false;
                    };
                    if (c.chartType > 4) {
                        BUI.Message.Alert('行列转换暂支持基本的line bar，其他类型的转换 敬请期待下个版本 ', 'warning');
                        return false;
                    };
                    var isXYChange = c.isXYChange;
                    if (curChecked) {
                        isXYChange = 1;
                    } else {
                        isXYChange = 0;
                    }
                    _self.reLoadChartByDivID(activeChartId, null, null, isXYChange);
                    _self._backSetEditorJson();
                });

                $('#pEditor-cb-multititle').unbind('click').bind('click', function(e) {
                    var curChecked = $(this).attr('checked');
                    var activeChartId = _self.get('activeChartId');
                    var charts = _self.get('charts');
                    var c = charts[activeChartId];
                    if (curChecked == 'checked') {
                        c.settings.editorJson.useMT = '1';
                    } else {
                        c.settings.editorJson.useMT = '0';
                    }
                    charts[activeChartId] = c;
                    _self.reLoadChartByDivID(activeChartId);
                    _self._backSetEditorJson();
                });


                $('#pEditor-cb-xreverse').unbind('click').bind('click', function(e) {
                    var curChecked = $(this).attr('checked');

                    var activeChartId = _self.get('activeChartId');
                    var charts = _self.get('charts');
                    var c = charts[activeChartId];
                    c.settings = c.settings || {};

                    if (curChecked) {
                        c.settings.xReverse = true;
                    } else {
                        c.settings.xReverse = false;
                    }

                    charts[activeChartId] = c;
                    _self.reLoadChartByDivID(activeChartId);
                });

                $('.chart-pEditor-cont .pEditor-dialog-header a').unbind('click').bind('click', function(e) {
                    _self._pEditorDivToggle(false);
                });

                $('.chart-pEditor-cont .editor-tab .tab').unbind('click').bind('click', function() {
                    $('.chart-pEditor-cont .editor-tab .tab').removeClass('active');
                    var curTab = $(this).addClass('active').attr('tab');
                    $('.pEditor-tab-cont').removeClass('active');
                    $('.pEditor-tab-cont[_id="' + curTab + '"]').addClass('active');
                });
                $('.chart-pEditor-cont .toggle-3').unbind('click').bind('click', function() {
                    $(this).toggleClass('down-3').toggleClass('right-3');
                    $(this).parents('div').eq(0).find('.pEditor-item-body').toggle();
                });
                // $('.chart-pEditor-cont .range').unbind('change').bind('change', function() {
                //     $(this).parents('div').eq(0).find('.range-text').val($(this).val());
                // });
                $('.chart-pEditor-cont .tabs-nav li').unbind('click').bind('click', function() {
                    $(this).parents('div').eq(0).find('.tabs-nav li').removeClass('active');
                    $(this).addClass('active');

                });

                $(document).ready(
                    function() {

                        try {
                            if ($('.chart-pEditor-cont .color-oper').length != 0) {
                                $('.chart-pEditor-cont .color-oper').jPicker({}, function(color, context) {
                                    $('.chart-pEditor-cont .color-oper').trigger('change');
                                });
                                $('.chart-pEditor-cont  #pEditor-dataflag-color').jPicker({}, function(color, context) {
                                    $('.chart-pEditor-cont #pEditor-dataflag-color').trigger('change');
                                });
                            };
                        } catch (e) {

                        }

                    }
                );
            },

            initCRSelecterEvent: function() {
                var _self = this;
                $('.pEditor-ds-cr-selecter').unbind('click').bind('click', function() {
                    _self._pEditorDivToggle(false);
                    var CRDialog = _self.get('CRDialog');
                    $('#pEditor-ds-cr-selecter-v').val($('#pEditor-ds-cr').val());
                    CRDialog.show();
                });
            },
            //初始化 图表 变更编辑器. 
            _initChartEditorChangeEvent: function() {
                var _self = this;

                //TODO 有一种 写法可以 合起来写.   忘了具体的写法
                $('.chart-pEditor-cont input[type="text"]').unbind('change').bind('change', function() {
                    warpEditorJson($(this).attr('pathstr'), $(this).val(), $(this));
                });
                $('.chart-pEditor-cont input[type="range"]').unbind('change').bind('change', function() {
                    // $(this).parents('div').eq(0).find('.range-text').val($(this).val());
                    if ($(this).parents('td').length > 0) {
                        $(this).parents('td').eq(0).find('.range-text').val($(this).val());
                    } else {
                        $(this).parents('div').eq(0).find('.range-text').val($(this).val());
                    }

                    warpEditorJson($(this).attr('pathstr'), $(this).val(), $(this));
                });
                $('.chart-pEditor-cont input[type="checkbox"]').unbind('change').bind('change', function() {
                    warpEditorJson($(this).attr('pathstr'), $(this).val(), $(this));
                });
                $('.chart-pEditor-cont input[type="radio"]').unbind('change').bind('change', function() {
                    warpEditorJson($(this).attr('pathstr'), $(this).val(), $(this));
                });
                $('.chart-pEditor-cont select').unbind('change').bind('change', function() {
                    warpEditorJson($(this).attr('pathstr'), $(this).val(), $(this));
                });

                //
                function warpEditorJson(pathstr, value, curEle) {
                    if (!pathstr) {
                        return;
                    };
                    if (_self.warpEditorJsonTimer) {
                        clearTimeout(_self.warpEditorJsonTimer);
                    };
                    _self.warpEditorJsonTimer = setTimeout(function() {
                        //暂存原始 pathstr; 
                        var oldPathstr = pathstr;
                        var activeChartId = _self.get('activeChartId');
                        var charts = _self.get('charts');
                        var c = charts[activeChartId];
                        var isPie = c.chartType == 3;
                        var editorJson = c.settings.editorJson || {};

                        if (curEle.attr('plink') != undefined) {
                            //判断是否是pie 并且是 扇区专有的. 
                            if (isPie && curEle.attr('sector') != 'true') {
                                pathstr = 'series[0].' + pathstr;
                            } else {
                                pathstr = $('#' + curEle.attr('plink')).find('li[class="active"]').attr('plinkV') + '.' + pathstr;
                            }
                        };

                        //处理 id: 的情况
                        var tempIndex = value.indexOf('id:');
                        if (tempIndex != -1) {
                            var subEle = $("#" + value.substr(3));
                            value = subEle.val();

                            if (subEle.attr('beforeV') != undefined) {
                                value = subEle.attr('beforeV') + value;
                            };
                            if (subEle.attr('afterV') != undefined) {
                                value = value + subEle.attr('afterV');
                            };

                            if (curEle.attr('checked') != 'checked') {
                                $(subEle).val('').attr('readonly', 'readonly').css('background-color', '#f0f0f0');
                            } else {
                                $(subEle).removeAttr('readonly').css('background-color', 'white').val(_self.getValueByPathStr(pathstr, editorJson));
                            }
                        };

                        //处理 radio: 的情况
                        var tempIndex = value.indexOf('radio:');
                        if (tempIndex != -1) {
                            var radioName = value.substr(6);
                            var subEle = $("input[name^='" + radioName + "']");
                            var subEle_checked = $("input[name^='" + radioName + "']:checked");

                            if (curEle.attr('checked') != 'checked') {
                                curEle.parents('div').eq(0).addClass('pEditor-item-body-disable');
                                curEle.parents('div').eq(0).find('input[type="radio"]').attr('readonly', 'readonly').removeAttr('checked').attr('disabled', 'true');
                            } else {
                                curEle.parents('div').eq(0).removeClass('pEditor-item-body-disable');
                                curEle.parents('div').eq(0).find('input[type="radio"]').removeAttr('readonly').removeAttr('disabled');
                            }

                            if (subEle_checked.length == 0) {
                                subEle_checked = $("input[name^='" + radioName + "']:first");
                            };
                            value = subEle_checked.val() || "";

                            if (subEle_checked.attr('beforeV') != undefined) {
                                value = subEle_checked.attr('beforeV') + value;
                            };
                            if (subEle_checked.attr('afterV') != undefined) {
                                value = value + subEle_checked.attr('afterV');
                            };


                        };


                        //处理 特殊值 添加前缀的.  如 : {value} 单位
                        if (curEle.attr('beforeV') != undefined) {
                            value = curEle.attr('beforeV') + value;
                        };
                        if (curEle.attr('afterV') != undefined) {
                            value = value + curEle.attr('afterV');
                        };

                        //处理 text 空option 没有做出反应的情况
                        if (pathstr.indexOf('text') != -1 && value == "") {
                            value = ' ';
                        };

                        if (value == null) {
                            return;
                        };
                        //处理值为 json 的 如: markpoint 
                        if (value.indexOf('json-') != -1) {
                            value = value.replace('json-', '');
                            value = JSON.parse(value);
                        };

                        //处理 checkbox 取消勾选框的
                        if (curEle.attr('type') == 'checkbox' && curEle.attr('checked') == undefined) {
                            var nocheckV = curEle.attr('nocheckv');
                            if (nocheckV != undefined) {
                                if (nocheckV == 'false') {
                                    value = false;
                                } else {
                                    value = nocheckV;
                                }
                            } else {
                                value = null;
                            }
                        };

                        //处理 值为 true 和 false .
                        if (value == "false") {
                            value = false;
                        };
                        if (value == "true") {
                            value = true;
                        };


                        _self.setValueByPathStr(editorJson, pathstr, value);

                        var pathstr2 = curEle.attr('pathstr2');
                        if (pathstr2 != undefined) {
                            var index = pathstr2.indexOf('=');
                            if (index != -1) {
                                var tempPath = pathstr2.substr(0, index);
                                tempPath = pathstr.replace(oldPathstr, tempPath);
                                _self.setValueByPathStr(editorJson, tempPath, pathstr2.substr(index + 1));
                            } else {
                                pathstr2 = pathstr.replace(oldPathstr, pathstr2);
                                _self.setValueByPathStr(editorJson, pathstr2, value);
                            }
                        };

                        // 判断如果有放到次坐标轴上的标记, 并且 yAxis.length是1 则 添加一个 yAxis 
                        var option = c.chart.getOption();
                        if (_self._checkHasYSubAxis(editorJson)) {
                            //生成次坐标轴用.  不能直接clone option 的 yAxis 
                            if (option && option.yAxis && option.yAxis.length == 1) {
                                editorJson.yAxis = editorJson.yAxis || [];
                                //TODO 注意 自动从 echart copy 过来的. 
                                editorJson.yAxis[0] = amz.clone(option.yAxis[0]);
                                // editorJson.yAxis[1] = amz.clone(option.yAxis[0]);

                                //如果使用之前的 clone 则会2个y指向同一个对象. (clone方法 还待优化)
                                editorJson.yAxis[1] = {
                                    type: 'value'
                                };

                                //防止 自动获取到 类型
                                _self.setValueByPathStr(editorJson.yAxis[0], 'type', null);
                                _self.setValueByPathStr(editorJson.yAxis[1], 'type', null);
                            };
                        } else {
                            //如果没有 次坐标轴 则把 yaxis[1] 删除掉
                            _self.setValueByPathStr(editorJson, 'yAxis[1]', null);

                        }


                        _self._cleanOldRubbish(editorJson);
                        delete editorJson.divId;
                        c.settings.editorJson = editorJson;
                        charts[activeChartId] = c;

                        _self.reLoadChartByDivID(activeChartId);
                        _self._backSetEditorJson();
                    }, 100);
                }
            },
            //清除 editorJson 中，老的数据.
            _cleanOldRubbish: function(editorJson) {
                try {
                    var yAxis = editorJson.yAxis;
                    if (yAxis != undefined) {
                        //清除 yaxis 的 type 
                        for (var i = 0; i < yAxis.length; i++) {
                            delete yAxis[i].type;
                        };
                    };
                } catch (e) {}
            },
            // 检查json是否有次坐标轴
            _checkHasYSubAxis: function(editorJson) {
                try {
                    //在 双轴 切换成 条形bar 的时候, 会有 yaxis[1]  , 造成不能生成图形.
                    if (editorJson.yAxis && editorJson.yAxis.length == 2) {
                        return true;
                    };
                    var series = editorJson.series;
                    if (!series) {
                        return false;
                    };
                    var res = false,
                        tt;

                    //检查 series 上是否有 设置在次坐标轴上的 ( 值为1 则为设置在  次坐标轴上. )
                    for (var i = 0; i < series.length; i++) {
                        tt = series[i].yAxisIndex;
                        if (tt != undefined && tt == 1) {
                            return true;
                        }
                    };
                    return res;
                } catch (e) {
                    return false;
                }
            },

            //设置 editorJson   (待整理 和分拆)
            _backSetEditorJson: function() {
                var _self = this;

                _self._showAllItem();

                var CRDialog_display = _self.get('CRDialog_display') || '';
                if (CRDialog_display == 'show') {
                    return;
                };

                var activeChartId = _self.get('activeChartId');
                var charts = _self.get('charts');
                if (charts == undefined) {
                    return;
                };
                var c = charts[activeChartId];
                var editorJson = c.settings.editorJson || {};
                $('.chart-pEditor-cont input[type="text"]').val('');
                $('.chart-pEditor-cont').data('editorJson', editorJson).attr('chart_id', activeChartId);

                $('#pEditor-ds-cr').val(_self._getStrByCR(c.baseData.cr));
                //图表 tab

                $('#pEditor-mTitle').val(_self.getValueByPathStr('title.text', editorJson));
                $('#pEditor-subTitle').val(_self.getValueByPathStr('title.subtext', editorJson));

                $('#pEditor-link').val(_self.getValueByPathStr('title.link', editorJson));
                $('#pEditor-sublink').val(_self.getValueByPathStr('title.sublink', editorJson));


                var x1 = _self.getValueByPathStr('grid.x', editorJson);
                var x2 = _self.getValueByPathStr('grid.x2', editorJson);
                var y1 = _self.getValueByPathStr('grid.y', editorJson);
                var y2 = _self.getValueByPathStr('grid.y2', editorJson);
                var borderWidth = _self.getValueByPathStr('grid.borderWidth', editorJson);

                if (x1 != '') {
                    $('#pEditor-x1').val(x1);
                    $('#pEditor-x1-v').val(x1);
                };
                if (x2 != '') {
                    $('#pEditor-x2').val(x2);
                    $('#pEditor-x2-v').val(x2);
                };
                if (y1 != '') {
                    $('#pEditor-y1').val(y1);
                    $('#pEditor-y1-v').val(y1);
                };
                if (y2 != '') {
                    $('#pEditor-y2').val(y2);
                    $('#pEditor-y2-v').val(y2);
                };
                if (borderWidth != '') {
                    $('#pEditor-borderWidth').val(borderWidth);
                    $('#pEditor-borderWidth-v').val(borderWidth);
                };

                // 坐标轴 tab 
                var option = c.chart.getOption() || {};
                if (!option.series) {
                    option = c.option;
                };
                var yAxis = option.yAxis;
                var xAxis = option.xAxis;

                //4 和10 也暂时不放进来
                var isNotLineBar = !amz.contains([1, 2], c.chartType);
                var isHideLegendType = amz.contains([3, 9], c.chartType);


                if (isHideLegendType) {
                    $('.editor-tab td[tab="pEditor-tab-legend"]').hide().removeClass('active');
                } else {
                    $('.editor-tab td[tab="pEditor-tab-legend"]').show();
                };

                //如果是饼图 ,雷达图 漏斗图 仪表盘
                if (amz.contains([3, 7, 8, 9], c.chartType)) {
                    $('.editor-tab td[tab="pEditor-tab-axis"]').hide().removeClass('active');;
                } else {
                    $('.editor-tab td[tab="pEditor-tab-axis"]').show();
                }

                if (yAxis) {
                    for (var i = 0; i < yAxis.length; i++) {
                        $('#pEditor-axis-ul li[tab="y' + (i + 1) + '"]').data('axisData', yAxis[i]);
                    };
                    if (yAxis.length == 2) {
                        $('#pEditor-axis-ul li[tab="y2"]').show();
                    } else {
                        $('#pEditor-axis-ul li[tab="y2"]').hide().removeClass('active');;
                    }
                }

                if (xAxis) {
                    for (var i = 0; i < xAxis.length; i++) {
                        $('#pEditor-axis-ul li[tab="x"]').data('axisData', xAxis[i]);
                    };
                    if (xAxis.length > 0) {
                        $('#pEditor-axis-ul li[tab="x"]').show();
                    } else {
                        $('#pEditor-axis-ul li[tab="x"]').hide();
                    }
                };


                $('#pEditor-axis-ul li').unbind('click').bind('click', function(e) {
                    _self.editorJson = _self.editorJson || {};
                    _self.editorJson.lastAxisLiIndex = $(this).attr('index');

                    $(this).parents('div').eq(0).find('.tabs-nav li').removeClass('active');
                    $(this).addClass('active');
                    var axisData = $(this).data('axisData');
                    var curTab = $(this).attr('tab');
                    if (curTab == 'x') {
                        $('.no-Xaxis-item').hide();
                    } else {
                        $('.no-Xaxis-item').show();
                    }
                    if (axisData) {
                        $('#pEditor-maxAxis').val(axisData.max);
                        $('#pEditor-minAxis').val(axisData.min);
                        var tempV = ((axisData.axisLabel.formatter || '') + '');

                        //如果是 1个空格，则表示不显示. 
                        if (tempV == ' ') {
                            $('input[type="radio"][name="chart_radio_formattershow"]').eq(1).attr('checked', 'checked');
                        } else {
                            $('input[type="radio"][name="chart_radio_formattershow"]').eq(0).attr('checked', 'checked');
                        }

                        tempV = tempV.replace('{value}', '');
                        $('#pEditor-unitAxis').val(tempV);

                        $('#pEditor-angleAxis').val(axisData.axisLabel.rotate);

                        var splitLine_show = _self.getValueByPathStr('splitLine.show', axisData);
                        $('input[type="radio"][name="chart_radio_splitLine"][value="' + (splitLine_show === '' ? true : splitLine_show) + '"]').attr('checked', 'checked');

                        var axisLine_show = _self.getValueByPathStr('axisLine.show', axisData);
                        var axisLine_width = _self.getValueByPathStr('axisLine.lineStyle.width', axisData);
                        var axisLine_color = _self.getValueByPathStr('axisLine.lineStyle.color', axisData);
                        var axisLine_name = _self.getValueByPathStr('name', axisData);

                        $('input[type="radio"][name="chart_radio_axisLine"][value="' + (axisLine_show === '' ? true : axisLine_show) + '"]').attr('checked', 'checked');
                        $('#pEditor-lineStyle-width').val(axisLine_width);
                        $('#pEditor-lineStyle-width-v').val(axisLine_width);
                        $('#pEditor-axisName').val(axisLine_name);
                        $('#pEditor-lineStyle-color').val(axisLine_color);


                        var axisTick_show = _self.getValueByPathStr('axisTick.show', axisData);
                        $('input[type="radio"][name="chart_radio_axisTick"][value="' + (axisTick_show === '' ? true : axisTick_show) + '"]').attr('checked', 'checked');
                    };

                    //如果是点击的是 x 轴. 
                    if ($(this).attr('tab') == 'x') {
                        $('.chart-pEditor-cont .x-item').show();
                    } else {
                        $('.chart-pEditor-cont .x-item').hide();
                    }

                });

                var lastAxisLiIndex = 0;
                if (_self.editorJson && _self.editorJson.lastAxisLiIndex != undefined) {
                    lastAxisLiIndex = _self.parse2Int(_self.editorJson.lastAxisLiIndex);
                };
                $('#pEditor-axis-ul li').eq(lastAxisLiIndex).trigger('click');

                // x坐标轴上的 逆序 
                if (c.settings && c.settings.xReverse == 1) {
                    $('#pEditor-cb-xreverse').attr('checked', 'checked');
                };

                // 行列切换.
                if (c.isXYChange == 1) {
                    $('#pEditor-cb-xychange').attr('checked', 'checked');
                };



                //系列
                //1 生成 系列 tab 
                var series = option.series;
                $('#pEditor-series-tab ul li').remove();
                var tName = '';
                tName = '系列', plinkV = '';
                var arrays = [];
                var isPie = amz.contains([3], c.chartType);
                //如果是9 
                if (c.chartType == 9 || c.chartType == 8) {
                    $('.editor-tab td[tab="pEditor-tab-series"]').hide();
                    $('.chart-pEditor-cont .editor-tab .tab').eq(0).trigger('click');
                } else {
                    $('.editor-tab td[tab="pEditor-tab-series"]').show();
                }


                function __setSeriesData(sData) {
                    var yAxisIndex = sData.yAxisIndex || 0;
                    var type = sData.type;
                    var markPoint = sData.markPoint || false;

                    //数据值标签是否显示
                    var dataflag = _self.getValueByPathStr('itemStyle.normal.label.show', sData) || false;
                    var dataflag_color = _self.getValueByPathStr('itemStyle.normal.label.textStyle.color', sData) || '';
                    var dataflag_line = _self.getValueByPathStr('itemStyle.normal.labelLine.show', sData) || false;
                    var position = _self.getValueByPathStr('itemStyle.normal.label.position', sData);
                    var color = _self.getValueByPathStr('itemStyle.normal.color', sData);
                    var label_color = _self.getValueByPathStr('itemStyle.normal.label.textStyle.color', sData);

                    if (sData && sData.name != "") {
                        $('#series-name-i').text("" + sData.name + "  ");
                    } else {
                        $('#series-name-i').text(" ");
                    }

                    $('input[type="radio"][name="chart_radio_axis"][value="' + yAxisIndex + '"]').attr('checked', 'checked');
                    $('input[type="radio"][name="chart_radio_type"][value="' + type + '"]').attr('checked', 'checked');
                    if (markPoint) {
                        $('#pEditor-cb-comment').attr('checked', 'checked');
                    } else {
                        $('#pEditor-cb-comment').removeAttr('checked', 'checked');
                    }
                    if (dataflag) {
                        $('#pEditor-cb-dataflag').attr('checked', 'checked');
                    } else {
                        $('#pEditor-cb-dataflag').removeAttr('checked', 'checked');
                    }
                    if (dataflag_line) {
                        $('#pEditor-cb-dataflag-line').attr('checked', 'checked');
                    } else {
                        $('#pEditor-cb-dataflag-line').removeAttr('checked', 'checked');
                    }

                    if (dataflag_color != '') {
                        $('#pEditor-cb-dataflag-color').attr('checked', 'checked');
                        $('#pEditor-dataflag-color').val(dataflag_color);
                    };
                    $('#pEditor-cb-position').val(position);
                    $('#pEditor-color-oper').val(color).css('background-color', color);
                    $('#pEditor-color-oper').parents('div').eq(0).find('.jPicker').find('.Color').css('background-color', color);
                    $('#pEditor-color-oper').parents('div').eq(0).find('.jPicker').find('.Alpha').css('background-image', '');
                    $('#pEditor-dataflag-color').val(label_color).css('background-color', label_color);
                    $('#pEditor-dataflag-color').parents('div').eq(0).find('.jPicker').find('.Color').css('background-color', label_color);
                    $('#pEditor-dataflag-color').parents('div').eq(0).find('.jPicker').find('.Alpha').css('background-image', '');

                }

                if (isPie) {
                    tName = '扇区';
                    $('.editor-tab td[tab="pEditor-tab-series"]').text('扇区');
                    arrays = series[0].data;
                    $('.no-pie-item').hide();
                    $('.pie-item').show();
                    if (editorJson && editorJson.series && editorJson.series[0]) {
                        __setSeriesData(editorJson.series[0]);
                    };

                    var radius = _self.getValueByPathStr('series[0].radius', editorJson);
                    if (radius != undefined) {
                        radius = radius.replace('%', '');
                        $('#pEditor-radius').val(radius);
                        $('#pEditor-radius').parents('div').eq(0).find('.range-text').val(radius);
                    };

                } else {
                    $('.editor-tab td[tab="pEditor-tab-series"]').text('系列');
                    arrays = series;
                    $('.pie-item').hide();
                    $('.no-pie-item').show();
                }

                //
                if (isNotLineBar) {
                    $('.line-bar-item').hide();
                } else {
                    $('.line-bar-item').show();
                }
                for (var i = 0; i < arrays.length; i++) {
                    if (isPie) {
                        plinkV = 'series[0].data[' + i + ']';
                    } else {
                        plinkV = 'series[' + i + ']';
                    }
                    $('#pEditor-series-tab ul ').append('<li index="' + i + '" title="' + arrays[i].name + '" plinkV="' + plinkV + '"><a>' + (tName + i) + '</a></li>');
                    $('#pEditor-series-tab ul li:last').data('sData', arrays[i]);
                };

                if (!isPie) {
                    $('#pEditor-series-tab ul li').unbind('click').bind('click', function(e) {

                        _self.editorJson = _self.editorJson || {};
                        _self.editorJson.lastSeriesLiIndex = $(this).attr('index');

                        $(this).parents('div').eq(0).find('.tabs-nav li').removeClass('active');
                        $(this).addClass('active');
                        var sData = $(this).data('sData');
                        if (!sData) {
                            return;
                        };
                        __setSeriesData(sData);
                    });


                    var lastSeriesLiIndex = 0;
                    if (_self.editorJson && _self.editorJson.lastSeriesLiIndex != undefined) {
                        lastSeriesLiIndex = _self.parse2Int(_self.editorJson.lastSeriesLiIndex);
                    };
                    $('#pEditor-series-tab ul li').eq(lastSeriesLiIndex).trigger('click');
                }

                //图例
                var legend = editorJson.legend || {};
                if (legend) {
                    var orient = _self.getValueByPathStr('legend.orient', editorJson);
                    var legend_x = _self.getValueByPathStr('legend.x', editorJson);
                    var legend_y = _self.getValueByPathStr('legend.y', editorJson);

                    if (orient) {
                        $('#pEditor-cb-orient').attr('checked', 'checked').parents('div').eq(0).removeClass('pEditor-item-body-disable');
                        $('.chart_peditor_radio[name="chart_radio_legend_orient"][value="' + orient + '"]').attr('checked', 'checked');
                    } else {
                        $('#pEditor-cb-orient').removeAttr('checked').parents('div').eq(0).addClass('pEditor-item-body-disable');
                    }

                    if (legend_x) {
                        $('#pEditor-cb-x').attr('checked', 'checked').parents('div').eq(0).removeClass('pEditor-item-body-disable');
                        $('.chart_peditor_radio[name="chart_radio_legend_x"][value="' + legend_x + '"]').attr('checked', 'checked');
                    } else {
                        $('#pEditor-cb-x').removeAttr('checked').parents('div').eq(0).addClass('pEditor-item-body-disable');
                    }

                    if (legend_y) {
                        $('#pEditor-cb-y').attr('checked', 'checked').parents('div').eq(0).removeClass('pEditor-item-body-disable');
                        $('.chart_peditor_radio[name="chart_radio_legend_y"][value="' + legend_y + '"]').attr('checked', 'checked');
                    } else {
                        $('#pEditor-cb-y').removeAttr('checked').parents('div').eq(0).addClass('pEditor-item-body-disable');
                    }

                };

                if ($('.chart-pEditor-cont .editor-tab .tab.active').length == 0) {
                    $('.chart-pEditor-cont .editor-tab .tab').eq(0).trigger('click');
                };


                var keyType = _self.getValueByPathStr('json.key', c.settings);
                var subIndex = _self.getValueByPathStr('json.subIndex', c.settings);
                //是否是条形图
                var isBar_h = (keyType == 'bar' && (subIndex == 3 || subIndex == 4));
                var isScatter_bubble = (keyType == 'scatter' || keyType == 'bubble');
                var y1 = $('#pEditor-axis-ul li[tab="y1"]');
                var x = $('#pEditor-axis-ul li[tab="x"]');

                if (isBar_h || isScatter_bubble) {
                    if (isBar_h) {
                        //条形图 不显示该项
                        $('.no-barH-item').hide();
                        //坐标轴的名字变一下. 
                        y1.find('a').text('类别(Y1)');
                        x.find('a').text('值(X)');
                    };
                    if (isScatter_bubble) {
                        //坐标轴的名字变一下. 
                        y1.find('a').text('值(Y1)');
                        x.find('a').text('值(X)');
                    };
                } else {
                    y1.find('a').text('值(Y1)');
                    x.find('a').text('类别(X)');
                }

            },
            //显示所有隐藏项
            _showAllItem: function() {
                $('.no-barH-item').hide();
            },

            _closeAddChart: function() {
                var _self = this;
                _self.get('chartTypeDialog').close();
                // $('#div_edit_chart_container').removeClass('slideInDown').addClass('slideOutUp');
                // setTimeout(function() {
                //     $('#div_edit_chart_container').hide().removeClass('slideOutUp').addClass('slideInDown');
                //     _self.editChartType_type = null;
                // }, 400)
            },

            initBindAddChartEvent: function() {
                var _self = this;
                $('.dtm-con-item').unbind('dblclick').bind('dblclick', function() {
                    var tabType = $(this).attr('data-tab-key');
                    tabType = (tabType + '').toLowerCase();

                    var subIndex = $(this).attr('data-mold-index');
                    _self.__chartTypeClick(tabType, subIndex);
                })
            },

            //切换图表类型.
            __chartTypeClick: function(newType, subIndex) {
                var _self = this;
                var json = chartOptions.getStrongJsonByType(newType, subIndex);
                var chartTypeCode = chartTypeConstant[newType];

                //从切换的图形过来的 值
                if (_self.editChartType) {
                    _self.editChartType['newType'] == newType;
                    var lastEditChartSettings = _self.editChartType['oldSettings'];
                    if (newType == 'zuhe') {
                        if (lastEditChartSettings) {
                            lastEditChartSettings.editorJson.series = _self.editChartType_series;
                        };
                    };
                    _self._closeAddChart();

                    var st = _self.clone(lastEditChartSettings);
                    if (st) {
                        st.json = st.json || {};
                        $.extend(st.json, {
                            key: newType,
                            subIndex: subIndex,
                            value: json
                        })
                    } else {
                        st = {};
                    };

                    //切换的时候  只需要下边2个 配置项. 
                    var newSt = {};
                    newSt.editorJson = st.editorJson;
                    newSt.json = st.json;


                    _self.editChartType['newSetting'] = newSt;
                    //TODO 判断切换成为的图形的类型， 如果是饼图或者 雷达图 或者 仪表盘，则抛弃掉坐标轴的设置
                    // var isNoAxisType = amz.contains([3, 7, 8, 9], chartTypeCode);

                    _self.doRenderChart(chartTypeCode, null, null, null, _self.editChartType['oldId'], {
                        // 'settings': {}
                        'settings': newSt
                    });

                    //如果不是切换到组合图 (组合图在 弹出框结束后 置为null)
                    if (chartTypeConstant[newType] != 4) {
                        _self.editChartType = null;
                    } else {
                        _self.editChartType['newType'] = 4;
                    }

                } else {
                    _self.doRenderChart(chartTypeConstant[newType], null, null, null, null, {
                        'json': {
                            key: newType, //图表类型
                            subIndex: subIndex, //第几种子类型
                            value: json //强化的 json 
                        }
                    });
                    //关闭 addChart 。 
                    _self._closeAddChart();
                }

                setTimeout(function() {
                    var activeChartId = _self.get('activeChartId');
                    $('#' + activeChartId).trigger('click');
                }, 400)
            },


            initTabEvent: function() {
                // alert(234)
                $('#tabContainer #ul-tab-title li').unbind('click').bind('click', function() {
                    $('#tabContainer #ul-tab-title li').removeClass('active')
                    $('#tabContainer .tab-item-con').removeClass('active')
                    $(this).addClass('active');
                    var tabClass = $(this).attr('tab');
                    $(this).addClass('active');
                    $("." + tabClass).addClass('active');
                })
            },
            initSheetChangeEvent: function() {
                var _self = this;
                var spread = _self.get('spread');
                spread.bind($.alisheet.Events.ActiveSheetChanged, function(sender, editinfo) {

                    // _self.mockSheetChanged(editinfo);
                    sheetOpened[editinfo.newSheet._name] = '1';
                    sheetOpened[editinfo.oldSheet._name] = '1';
                    setTimeout(function() {
                        //判断 是否有弹出层， 如果有则关闭 弹出层. 
                        _self.CRDialog_trigger = false;
                        var CRDialog = _self.get('CRDialog');
                        CRDialog.close();

                        _self.backShowChart();
                        //TODO  判断是否有 选中的 customerFloatObject , 
                        var s = _self.get('spread')
                        var curSheet = s.getActiveSheet();  
                        var objs = curSheet.getFloatingObjects();
                        var objName = "";
                        for (var i = 0; i < objs.length; i++) {
                            if (objs[i]._isSelected) {
                                objName = objs[i]._name
                            };
                        };

                        // 如果有， 则 重置 editorJson,
                        // 如果没，则隐藏 eidtorJsonDiv 
                        var divId = objName.replace('f2_', '');
                        if (divId != "") {
                            _self.set('activeChartId', divId);
                            _self._backSetEditorJson();
                            // $('.chart-pEditor-cont').show();
                            $('#' + divId).trigger('click')
                        } else {
                            $('.chart-pEditor-cont').hide();
                        }

                        _self.doRefreshChart_curSheet(null, {
                            animation: false
                        });
                    }, 300)
                })
            },

            // initDelKeyEvent: function() {
            //     window.addEventListener('keydown', function(event) {
            //         var activeElement = gcGlobal.activeElement;
            //         //console.info('event....')
            //         //console.info(activeElement);
            //         //console.info(event.keyCode);
            //     }, true);
            // },
            initCellChangedEvent: function() {
                var _self = this;
                var spread = _self.get('spread');
                spread.bind($.alisheet.Events.CellChanged, function(sender, editinfo) {
                    if (typeof excelChartCellChangedTimer != 'undefined')
                        clearTimeout(excelChartCellChangedTimer);
                    excelChartCellChangedTimer = setTimeout(function() {
                        _self.doRefreshChart_curSheet(editinfo);
                    }, 500)
                })

                // spread.bind($.alisheet.Events.EnterCell, function(sender, editinfo) {
                //     var CRDialog_display = _self.get('CRDialog_display');
                //     if (CRDialog_display == 'show') {
                //         _self._crSelecterTrigger();
                //     };
                // })
            },



            //初始化 改变选择区域事件
            initSelectionChangedEvent: function() {
                var _self = this;
                var spread = _self.get('spread');
                spread.bind($.alisheet.Events.SelectionChanged, function(sender, editinfo) {
                    var CRDialog_display = _self.get('CRDialog_display');
                    if (!CRDialog_display || CRDialog_display != 'show') {
                        return;
                    };
                    if (typeof excelChartSelectionChangedTimer != 'undefined')
                        clearTimeout(excelChartSelectionChangedTimer);
                    excelChartSelectionChangedTimer = setTimeout(function() {
                        var curCR = _self.getSelectedCr();
                        _self.set('newSelectedCR', curCR);
                        var temp = _self._getStrByCR(curCR);
                        $('#pEditor-ds-cr-selecter-v').val(temp);
                        var cc = _self._getCRByStr(temp)
                    }, 500)
                })
            },

            //根据CR值获取字符串
            _getStrByCR: function(cr) {
                var _self = this;
                //如: $C$41:$E$83
                if (!cr) {
                    return;
                };
                var res = "";
                var c_1 = String.fromCharCode(97 + cr.col).toUpperCase();
                var c_2 = String.fromCharCode(97 + cr.col + cr.colCount - 1).toUpperCase();
                var r_1 = cr.row + 1;
                var r_2 = cr.row + cr.rowCount;
                res = "$" + c_1 + "$" + r_1 + ":" + "$" + c_2 + "$" + r_2;
                return res;
            },

            //根据 $字符串获取 cr 值
            _getCRByStr: function(str) {
                try {
                    var _self = this;
                    //如: $C$41:$E$83
                    var res = {};
                    var tt = str.split(':');
                    var _1 = tt[0].split('$');;
                    var _2 = tt[1].split('$');;
                    _1.shift();
                    _2.shift();

                    var c_1 = (_1[0] + '').toLowerCase().charCodeAt() - 97; //2
                    var c_2 = (_2[0] + '').toLowerCase().charCodeAt() - 97; //4
                    var r_1 = (_1[1] + ''); //41
                    var r_2 = (_2[1] + ''); //83

                    res = {
                        col: c_1,
                        colCount: (c_2 - c_1 + 1),
                        row: r_1 - 1,
                        rowCount: (r_2 - r_1 + 1),
                    };
                    return res;
                } catch (e) {

                    return null;
                }
            },

            initFloatingObjectChanged: function() {
                var _self = this;
                var spread = _self.get('spread');
                spread.bind($.alisheet.Events.FloatingObjectSelectionChanged, function(sender, obj) {
                    //1.  获取当前sheet objs 的 zIndex 最大值，

                    var divId = obj.floatingObject._name;
                    divId = divId.replace('f2_', '');

                    var fobj_container = $('#' + divId).parents('.floatingobject-container');
                    var tempZindex = fobj_container.css('z-index');

                    if (typeof floatObjectChangeTimer != 'undefined')
                        clearTimeout(floatObjectChangeTimer);
                    floatObjectChangeTimer = setTimeout(function() {
                            var maxZIndex = _self.get('maxZIndex');
                            if (maxZIndex == undefined) {
                                maxZIndex = tempZindex;
                                _self.set('maxZIndex', maxZIndex);
                            };
                            if (tempZindex > maxZIndex) {
                                maxZIndex = tempZindex;
                                _self.set('maxZIndex', maxZIndex);
                            }
                            fobj_container.css('z-index', (parseInt(maxZIndex)) + 2);
                        }, 300)
                        // 2. 设置当前 sheet objs 的最大值+1 


                });
                spread.bind($.alisheet.Events.FloatingObjectChanged, function(sender, obj) {
                    var divId = obj.floatingObject._name;
                    divId = divId.replace('f2_', '');
                    var c = _self._getChartByKey(divId);
                    //比较 width height  有没有变化 ， 如果有则 改变. 
                    if (c && c._location)
                        if (!(obj.floatingObject._location.width == c._location.width && obj.floatingObject._location.height == c._location.height)) {
                            setTimeout(function() {
                                _self.reLoadChartByDivID(divId, obj.floatingObject._location);
                                //console.info(arguments);
                            }, 100)
                        }
                })
            },


            initChartMenu: function() {
                var _self = this;


                var subMenu = new Menu.ContextMenu({
                        children: [{
                            iconCls: 'icon-cog',
                            text: 'Line'

                        }, {
                            iconCls: 'icon-cog',
                            text: 'bar'
                        }, {
                            iconCls: 'icon-cog',
                            text: 'Pie'
                        }, {
                            xclass: 'menu-item-sparator'
                        }, {
                            iconCls: 'icon-random',
                            text: 'x-y change',
                            listeners: {
                                'click': xyChangeClick
                            }
                        }]
                    }),
                    menu = new Menu.ContextMenu({
                        children: [{
                                iconCls: 'icon-refresh',
                                text: '刷新',
                                listeners: {
                                    'click': refreshClick
                                }
                            }
                            // , {
                            //     iconCls: 'icon-edit',
                            //     text: '修改名字',
                            //     listeners: {
                            //         'click': changeNameClick
                            //     }
                            // }
                            // , {
                            //     iconCls: 'icon-random',
                            //     text: '行列转换',
                            //     // subMenu: subMenu
                            //     listeners: {
                            //         'click': xyChangeClick
                            //     }
                            // }, {
                            //     iconCls: 'auicon xReverse',
                            //     text: '行轴逆序',
                            //     // subMenu: subMenu
                            //     listeners: {
                            //         'click': xReverse
                            //     }
                            // }
                            , {
                                xclass: 'menu-item-sparator'
                            }
                            // , {
                            //     iconCls: 'auicon setting',
                            //     text: '设置',
                            //     // subMenu: subMenu
                            //     listeners: {
                            //         'click': settingClick
                            //     }
                            // }
                            , {
                                iconCls: 'auicon setting',
                                text: '图表设置',
                                // subMenu: subMenu
                                listeners: {
                                    'click': editClick
                                }
                            },
                            // {
                            //     iconCls: 'auicon check',
                            //     text: '查看代码',
                            //     // subMenu: subMenu
                            //     listeners: {
                            //         'click': checkClick
                            //     }
                            // },
                            {
                                iconCls: 'icon-edit',
                                text: '更改图表类型',
                                // subMenu: subMenu
                                listeners: {
                                    'click': chartChange
                                }
                            }, {
                                xclass: 'menu-item-sparator'
                            }, {
                                iconCls: 'icon-remove-sign',
                                text: '删除',
                                listeners: {
                                    'click': delChartClick
                                }
                            }
                        ]
                    });

                function chartChange() {
                    var activeChartId = _self.get('activeChartId'),
                        charts = _self.get('charts'),
                        c = charts[activeChartId];
                    var curChartType = c.chartType;


                    var editorJson = c.settings.editorJson;

                    _self.editChartType = _self.editChartType || {};

                    _self.editChartType['oldType'] = curChartType;
                    _self.editChartType['oldId'] = activeChartId;

                    // _self.editChartType_type = curChartType;
                    // _self.editChartType_id = activeChartId;

                    var tempSetting = _self.clone(c.settings);
                    _self.setValueByPathStr(tempSetting, 'editorJson.series', null);
                    _self.editChartType['oldSettings'] = tempSetting;

                    //如果series 不为空 
                    if (editorJson && editorJson.series) {
                        _self.editChartType_series = editorJson.series;
                    };

                    // $('#div_edit_chart_container').show();
                    _self.get('chartTypeDialog').show();
                    _self.setSelectionByChartCR(c.baseData.cr);
                }


                function checkClick() {
                    var activeChartId = _self.get('activeChartId'),
                        charts = _self.get('charts'),
                        c = charts[activeChartId];
                    console.info(JSON.stringify(c.chart.getOption()));
                };
                //设置 
                function settingClick() {
                    var activeChartId = _self.get('activeChartId'),
                        charts = _self.get('charts'),
                        c = charts[activeChartId];

                    if (c != null) {
                        var cr = c.baseData.cr;
                        _self.setSelectionByChartCR(cr);
                    }

                    if (c.chartType == 4) {

                        c.settings.divId = c.divId || '';
                        _self.set('curEditChartSetting', c.settings);

                        _self.showCombiDialog({
                            curEditChartSetting: c.settings
                        });

                    } else {
                        BUI.Message.Alert('敬请期待 下个版本 :) ~ ', 'warning');
                        return false;
                    }
                }

                function editClick() {
                    _self._pEditorDivToggle(true);

                }

                function xyChangeClick() {
                    var activeChartId = _self.get('activeChartId');
                    var charts = _self.get('charts');
                    var c = charts[activeChartId];
                    // var oldOption = c.chart.getOption();
                    if (c.chartType == 3 || c.chartType == 4) {

                        BUI.Message.Alert(c.chartType == 3 ? '饼图' : '组合图' + '的行列转换 敬请期待 下个版本 :) ~ ', 'warning');
                        return false;
                    };
                    if (c.chartType > 4) {
                        BUI.Message.Alert('行列转换暂支持基本的line bar，其他类型的转换 敬请期待下个版本 ', 'warning');
                        return false;
                    };
                    var isXYChange = c.isXYChange;
                    if (isXYChange == undefined || isXYChange == 0) {
                        isXYChange = 1;
                    } else {
                        isXYChange = 0;
                    }
                    _self.reLoadChartByDivID(activeChartId, null, null, isXYChange);

                }

                function refreshClick() {
                    var activeChartId = _self.get('activeChartId');
                    _self.reLoadChartByDivID(activeChartId);
                }

                function xReverse() {
                    var activeChartId = _self.get('activeChartId');
                    var charts = _self.get('charts');
                    var c = charts[activeChartId];
                    c.settings = c.settings || {};
                    if (c.settings.xReverse) {
                        c.settings.xReverse = false;
                    } else {
                        c.settings.xReverse = true;
                    }
                    charts[activeChartId] = c;

                    _self.reLoadChartByDivID(activeChartId);
                }

                function changeNameClick() {
                    //console.info('change name.');

                    var chartNameDialog = _self.get('chartNameDialog');

                    var activeChartId = _self.get('activeChartId');
                    var charts = _self.get('charts');
                    var c = charts[activeChartId];
                    var option = c.chart.getOption();
                    if (option.title == undefined) {
                        option = c.option;
                    };
                    var mainTitle = option.title.text;
                    var subTitle = option.title.subtext;

                    $('#chart-main-title').val(mainTitle);
                    $('#chart-sub-title').val(subTitle);

                    chartNameDialog.show();
                }

                function delChartClick(e) {
                    var activeChartId = _self.get('activeChartId');
                    var spread = _self.get('spread')
                    var sheet = spread.getActiveSheet();  
                    //1. 删除 floatObject 
                    sheet.removeFloatingObject('f2_' + activeChartId); 
                    //2. 删除  内存记录 (_self.get('charts')) 
                    var charts = _self.get('charts');
                    delete charts[activeChartId];
                    //3. 删除 div
                    $('#' + activeChartId).parents('.floatingobject-container').remove();

                    _self._pEditorDivToggle(false);
                }
                subMenu.on('itemclick', function() {
                    // //console.info(subMenu.getSelectedText());
                });

                _self.set('chartMenu', menu);
            },
            //@mickle.zy 深度Clone  , amz.clone 深度clone 不成功  //TODO 考虑 循环拷贝的问题
            clone: function(obj) {
                var me = this;
                var o;
                if (typeof obj == "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(me.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var j in obj) {
                                o[j] = me.clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
            //初始化 右键菜单 . 
            initChartMenuEvent: function() {
                var _self = this;
                var menu = _self.get('chartMenu');
                $('.chart-oper').unbind('click').bind('click', function(e) {
                    var curChartDivId = $(this).parents('div:first').find('.div-chart-auto').attr('id');
                    _self.showChartMenu(e, curChartDivId);
                    // var tempId = $(this).parents('.floatingobject-background-cover').eq(0).find('.div-chart-auto').attr('id');
                    // _self.set('activeChartId', tempId);
                    // menu.set('xy', [e.pageX, e.pageY]);
                    // menu.show();
                });
            },

            showChartMenu: function(e, curChartDivId) {
                var _self = this;
                //TODO 冻结表格的时候 这个length 会>1 要解决一下.

                if (curChartDivId != undefined) {
                    var curObj = $('#' + curChartDivId);
                    var tempId = curChartDivId;
                    var objOffset = curObj.offset();
                    if ((curObj.width() + objOffset.left) < e.pageX || (curObj.height() + objOffset.top) < e.pageY || e.pageX < objOffset.left || e.pageY < objOffset.top) {
                        return false;
                    };
                    _self.set('activeChartId', tempId);
                    var menu = _self.get('chartMenu');

                    menu.set('xy', [e.pageX, e.pageY]);
                    menu.show();
                };
            },

            // 初始化 icon chart 点击事件
            // 废弃  按钮点击放到 fun 中控制. 
            initIconChartClick: function() {
                var _self = this;
                $('.div-incon-chart .excel-button-group').unbind('click').bind('click', function() {
                    var isBar = $(this).find('.chart-bar').length == 1;
                    var isPie = $(this).find('.chart-pie').length == 1;
                    var isLine = $(this).find('.chart-line').length == 1;
                    var type = isBar ? chartTypeConstant.bar : isPie ? chartTypeConstant.pie : isLine ? chartTypeConstant.line : chartTypeConstant.line;
                    if (isPie) {
                        BUI.Message.Alert('敬请期待 下个版本 :) ~ ', 'warning');
                        return;
                    }
                    _self.doRenderChart(type);
                })
            },

            /**
                 * @function doGetOptionByCR()
                 * @description  根据选中区域的 cr 或者 已生成的chart 的divId 信息 获取 option 信息. 
              
                 * @param {Object} cr 选中的区域的cr 
                 * @param {int} chartType 
                 * @param {String} divId 已生成的chart的 divId  
                 * @return {Object}  option  返回chart 所需要的option 
                 */
            doGetOptionByCR: function(cr, chartType, divId, sheet) {
                var _self = this;
                var time1 = new Date();
                //console.info(time1)
                //1 getBaseDatabyCr
                var baseData = _self.getBaseDatabyCr(cr, chartType, sheet);
                baseData = _self.doStrongData4Chart(baseData, chartType);

                //2. getOptionByBaseData
                var option = chartOptions.getOption(chartType, baseData);
                time1 = new Date();
                //console.info(time1)
                return option;
            },
            //检查是否是第一次 render ,  (根据是否存在 divId 来判断)， 如果是，则根据其 行列的数量的多少 判断是否要  行列翻转一下. 
            switchXYByLegendNum: function(divId, option) {
                var _self = this;
                var legendNum = option.legend.data.length;
                if (option.xAxis == undefined) {
                    return;
                }
                var xAxisNum = option.xAxis[0].data.length;
                if (legendNum > xAxisNum) {
                    option = _self.doGetXYChangeOption(option);
                    return {
                        xyChange: 1,
                        option: option
                    };
                }

                return {
                    xyChange: 0,
                    option: option
                };
            },
            //开始渲染之前. 
            beforeRenderChart: function(chartType, fobj, sheet, textName) {
                var _self = this;
                //如果是混合图. 
                if (chartType == chartTypeConstant.combi) {
                    _self.showCombiDialog({
                        fobj: fobj
                    });
                    return false;
                };
                //其他 
                if (chartType == 9999) {
                    // $('#div_edit_chart_container').show();

                    var cr = _self.getSelectedCr();
                    if (cr.rowCount < 2 && cr.colCount < 2) {
                        BUI.Message.Alert('请选择要生成图表的数据区域 ', 'warning');
                        return false;
                    };
                    _self.get('chartTypeDialog').show();
                    _self.editChartType = null;

                    return false;
                };
                return true;
            },

            //清除组合图的 临时 legend 。 
            _cleanTempLegend: function(option) {

                var _self = this;
                var legendData = option.legend.data;
                var tempData;
                var isTemp = false;
                var legendLengh = legendData.length;

                for (var i = legendLengh - 1; i >= 0; i--) {
                    tempData = legendData[i];
                    if (amz.isObject(tempData)) {
                        isTemp = (tempData.name == ec_constant.zhu || tempData.name == ec_constant.ci);
                        if (isTemp) {
                            option.legend.data = amz.without(option.legend.data, tempData);
                        };
                    }
                };

                return option;
            },

            //回显组合图的 设置信息 (逐步废弃 由 editorJson 代替 )
            backShowCombiSettingOption: function(settings) {
                var _self = this;

                // var km = {
                //     'y_unit_0': 'option.yAxis[0].axisLabel.formatter',
                //     'y_unit_1': 'option.yAxis[1].axisLabel.formatter',
                //     'min_0': 'option.yAxis[0].min',
                //     'max_0': 'option.yAxis[0].max',
                //     'min_1': 'option.yAxis[1].min',
                //     'max_1': 'option.yAxis[1].max',
                // };

                var ids = ['y_unit_0', 'y_unit_1', 'min_0', 'max_0', 'min_1', 'max_1'];

                for (var i = 0; i < ids.length; i++) {
                    $('.tab-chart-setting-option #' + ids[i]).val((settings[ids[i]] || '').replace('{value}', ''));
                };

            },
            //显示组合图的 dialog 
            showCombiDialog: function(obj) {
                var _self = this;

                obj = obj || {};
                var curEditChartSetting = obj && obj.curEditChartSetting;
                var fobj = obj.fobj;

                var baseOption = null;
                var charts = _self.get('charts');
                var c;
                if (curEditChartSetting) {
                    c = charts[curEditChartSetting.divId];
                    baseOption = c;
                } else {
                    var activeChartId = _self.get('activeChartId');
                    c = charts[activeChartId]
                }

                var combiDiaglog = _self.get('combiDiaglog');

                baseOption = baseOption || _self.doRenderChart_mergeOption(chartTypeConstant.combi, fobj, null, null, "combi_chart_demo");

                baseOption.option = _self._cleanTempLegend(baseOption.option);

                var combiTplRender = _self.get('combiTplRender');
                var resultHtml = combiTplRender(baseOption.option);
                $('.div-combi-container').html(resultHtml);
                if (baseOption.settings && baseOption.settings.yAxis) {
                    _self.backShowCombiSettingOption(baseOption.settings.yAxis);
                };
                combiDiaglog.show();
                _self.initTabEvent();


                baseOption.option = _self.strongOptionBySetting(baseOption.option, curEditChartSetting, c);
                var demoChart = echarts.init($("#combi_chart_demo").eq(0)[0]);

                baseOption.option.animation = false;
                demoChart.setOption(baseOption.option);

                _self.doAfterShowCombiDialog();

                // 如果是修改的. 
                if (curEditChartSetting != null) {
                    var seriesTypes = curEditChartSetting.seriesTypes;
                    var subAxisIndex = curEditChartSetting.subAxisIndex;
                    $('.combi_chart_table tbody tr').each(function(i) {
                        var typeIndex = seriesTypes[i] == 'bar' ? 0 : 1;
                        $(this).find('.chart_combi_radio').eq(typeIndex).attr('checked', 'checked');
                        if (amz.contains(subAxisIndex, i)) {
                            $(this).find('.subAxis').attr('checked', 'checked');
                        };
                    })


                } else {
                    //如果是新增的 自动选中
                    var trLengh = $('.combi_chart_table tbody tr').length;
                    $('.combi_chart_table tbody tr').each(function(i) {
                        if (i != trLengh - 1) { //如果不是最后一个. 选中 柱状图. （即初始化的时 最后一个是 line ）
                            $(this).find('.chart_combi_radio').eq(0).attr('checked', 'checked').trigger('change');
                        };
                    })
                }
            },


            doAfterShowCombiDialog: function() {
                var _self = this;
                $('.chart_combi_radio').unbind('change').bind('change', function() {
                    _self.reShowCombiDemoChart_onChange();
                })
                $('.subAxis').unbind('change').bind('change', function() {

                    _self.reShowCombiDemoChart_onChange();
                })
                $('.tab-chart-setting-option input[type="text"]').unbind('blur').bind('blur', function() {
                    _self.reShowCombiDemoChart_onChange();
                })

            },

            //重新显示 组合图demo. (点击了 radio 或者 checkbox 之后. )
            reShowCombiDemoChart_onChange: function(curEditChartSetting) {
                var _self = this;

                var curEditChartSetting = curEditChartSetting || _self.get('curEditChartSetting') || {};
                var baseOption = _self.doGetCurCombiOption();

                var combiTplRender = _self.get('combiTplRender');

                var combiDiaglog = _self.get('combiDiaglog');

                combiDiaglog.show();
                _self.initTabEvent();


                var demoChart = echarts.init($("#combi_chart_demo").eq(0)[0]);
                var option = baseOption.option;
                option.legend.data = amz.without(option.legend.data, ec_constant.zhu);
                option.legend.data = amz.without(option.legend.data, ec_constant.ci);
                option.animation = false;

                // option = _self.strongOptionBySetting(option, curEditChartSetting);

                demoChart.setOption(option);

                _self.set('cur_oper_setting_option', baseOption);
                // _self.set('curEditChartSetting', {c
                //     divId: curEditChartSetting.divId || '',
                //     seriesTypes: baseOption.seriesTypes,
                //     subAxisIndex: baseOption.subAxisIndex,
                //     additionalWidth: baseOption.additionalWidth
                // });

                _self.doAfterShowCombiDialog();

            },

            //获取配置信息  (逐步废弃 有 editorJson 代替)
            doGetSettingOption: function() {
                var _self = this;
                var status = _self.get('combiDiaglog_display');
                if (!(status && status == "show")) {
                    return false;
                };
                var res = {};
                res.y_unit_0 = $('.tab-chart-setting-option #y_unit_0').val();
                res.y_unit_1 = $('.tab-chart-setting-option #y_unit_1').val();
                res.min_0 = $('.tab-chart-setting-option #min_0').val();
                res.max_0 = $('.tab-chart-setting-option #max_0').val();
                res.min_1 = $('.tab-chart-setting-option #min_1').val();
                res.max_1 = $('.tab-chart-setting-option #max_1').val();
                return res;
            },
            //获取当前选中区域的组合图的 option 
            doGetCurCombiOption: function(obj) {

                var _self = this;
                try {
                    obj = obj || {};
                    var curEditChartSetting = obj && obj.curEditChartSetting || {};
                    var fobj = obj.fobj;
                    var baseOption = _self.doRenderChart_mergeOption(chartTypeConstant.combi, fobj, null, null, curEditChartSetting.divId || "combi_chart_demo");

                    var additionalWidth = 0, // x2 额外增加的 像素宽度（以每个字母7个像素计算.） 
                        seriesTypes = [], //用户选择后的 图表类型.
                        subAxisIndex = [];


                    var activeChartId = baseOption.divId;
                    var charts = _self.get('charts');

                    var c = {
                        divId: activeChartId,
                        chartType: chartTypeConstant.combi
                    };
                    if (charts != undefined) {
                        c = charts[activeChartId] || {
                            divId: activeChartId,
                            chartType: chartTypeConstant.combi
                        };
                    };

                    //TODO 如果返回 {} , 则 老的 combi 图形就出不来了. 
                    if (c == undefined) {
                        return {};
                    };

                    baseOption.option = _self.strongOptionBySetting(baseOption.option, curEditChartSetting, c, {
                        'replaceDataInfo': false
                    });

                    //如果没有 组合 图数据
                    if (fobj == undefined && (curEditChartSetting == undefined || curEditChartSetting.seriesTypes == undefined)) {

                        var legend = baseOption.option.legend.data;
                        // var subAxisLegend = $('.subAxis:checked').eq(0).parents('tr').eq(0).find('.combi_legend_temp').text();
                        var subAxisLegend = [];
                        $('.subAxis:checked').each(function() {
                            subAxisLegend.push($(this).parents('tr').eq(0).find('.combi_legend_temp').text());

                        });

                        var subAxisName = "";
                        for (var i = 0; i < legend.length; i++) {
                            if (amz.contains(subAxisLegend, legend[i])) {
                                subAxisIndex.push(i);
                                //TODO 自定义 要用户自定义 名字. 
                            };

                            seriesTypes.push($('.chart_combi_radio[name="chart_radio_' + i + '"]:checked').val());
                        };
                        // subAxisName = subAxisIndex.length + " 组.";
                        subAxisName = " ";

                        //TODO 更改 yAxis 
                        var yAxis = baseOption.option.yAxis;

                        if (yAxis.length == 1) {
                            //双轴线 . 
                            yAxis.push({
                                name: subAxisName,
                                type: 'value'
                            })
                            additionalWidth = subAxisName.length / 2;
                        };

                        //更改 series 中的type
                        var series = baseOption.option.series;
                        var hasZW = false,
                            maxYNum = 0;

                        for (var i = 0; i < series.length; i++) {
                            series[i].type = seriesTypes[i];

                            if (amz.contains(subAxisIndex, i)) {
                                series[i].yAxisIndex = 1;
                                var tempData = series[i].data;
                                // 计算 次坐标轴上长度最大的数字. 
                                for (var j = 0; j < tempData.length; j++) {
                                    if ((tempData[j] + "").length > additionalWidth) {
                                        if (_self.hasZhongWen(tempData[j])) {
                                            hasZW = true;
                                        }
                                        if (_self.parse2Int(tempData[j]) > maxYNum) {
                                            maxYNum = _self.parse2Int(tempData[j]);
                                        };
                                        additionalWidth = (tempData[j] + "").length;
                                    };;
                                };
                            };
                            if (seriesTypes[i] == 'line') {
                                series[i].z = 10;
                            } else {
                                series[i].z = 8;
                            }
                        };

                        additionalWidth = additionalWidth * hasZW ? 16 : 8 + (maxYNum + "").length * 8; //以每个字母7个像素计算. 
                    } else {
                        if ((fobj != undefined)) {
                            curEditChartSetting = fobj.settings;
                        };
                        additionalWidth = curEditChartSetting.additionalWidth;
                        seriesTypes = curEditChartSetting.seriesTypes;
                        subAxisIndex = curEditChartSetting.subAxisIndex;
                        subAxisName = curEditChartSetting.subAxisName;
                    }

                    baseOption.option = _self.computeX2(baseOption.option, {
                        'additionalWidth': additionalWidth
                    });


                    baseOption.seriesTypes = seriesTypes;
                    baseOption.subAxisIndex = subAxisIndex;
                    baseOption.additionalWidth = additionalWidth;
                    baseOption.subAxisName = subAxisName;

                    baseOption.option = _self.strongOptionBySetting(baseOption.option, {
                        seriesTypes: seriesTypes,
                        subAxisIndex: subAxisIndex,
                        additionalWidth: additionalWidth,
                        subAxisName: subAxisName,
                    })

                    return baseOption;

                } catch (e) {
                    return {};
                }
            },

            doRenderChart_mergeOption: function(chartType, fobj, sheet, textName, divId_, others) {
                var _self = this;

                var others = others || {};


                var time1 = new Date();
                //console.info(time1)
                // 1  获取到选择的值  
                var baseData = _self.getSelectedBaseData(chartType, sheet, fobj && fobj.cr); //TODO 优化 性能. 
                time1 = new Date();
                //console.info(time1)

                baseData = _self.doStrongData4Chart(baseData, chartType);

                time1 = new Date();
                //console.info(time1)

                // 2. 生成一个 floatDiv  或者 使用现有的 div . 
                var divId = (fobj && fobj.divName.replace('f2_', '')) || divId_ || _self.generateFloatDiv4chart(baseData.cr);
                time1 = new Date();


                // 3. 获取要 render 对应的类型的 的chart 组件 option 
                var option = chartOptions.getOption(chartType, baseData);

                var isFirstRenderXYChange = 0; //监控第一次渲染的时候 是否xyChange, 0: 没有change , 1: change 过了. 
                if (fobj != undefined && fobj.chartName) {
                    option.title.text = fobj.chartName;
                    option.title.subtext = fobj.chartSubName;
                    if (fobj.isXYChange == 1) {
                        option = _self.doGetXYChangeOption(option);
                    };
                } else {
                    //默认走 doRenderChart 的是  divId 第一次 渲染的时候. 
                    // 判断是否 是第一次 这个divId 渲染 并且legend的数量大于 xAxis ，如果是 则xyChange.
                    var tempCR = _self.switchXYByLegendNum(divId, option);
                    if (tempCR != undefined) {

                        isFirstRenderXYChange = tempCR.xyChange;
                        option = tempCR.option;
                    }
                }

                //自动计算 X2(legend区域的空白width) 的长度值. 
                if (chartType != 3) {
                    option = _self.computeX2(option, others);
                }

                return {
                    option: option,
                    divId: divId,
                    baseData: baseData,
                    isFirstRenderXYChange: isFirstRenderXYChange,
                }

            },

            _getChartTypeNameByCode: function(chartCode) {
                var _self = this;
                var chartTypes = chartTypeConstant;
                for (var i in chartTypes) {
                    if (chartTypes[i] == chartCode) {
                        return i;
                    };
                };
                return "";
            },
            /**
               * @function doRenderChart()
               * @description  渲染 chart 
               
               * @param {String} chartType 图的类型. 
               * @return {Object}  fobj  floatObject 
               * @return {Object}  sheet  哪个sheet  
               * @return {String}  textName  标题名字  
               * @return {others}  others  其他属性. k v   
               */
            doRenderChart: function(chartType, fobj, sheet, textName, divId_, others) {
                var _self = this;
                var others = others || {};

                // fobj !=undefined 时候 是从 backShow 回显的时候
                if (!others.doRender && fobj == undefined && !_self.beforeRenderChart(chartType, fobj, sheet, textName)) {
                    return;
                };

                var baseOption;
                //如果是组合图的. 
                if (chartType == chartTypeConstant.combi) {

                    var isSendEmail = _self.isSendEmail();
                    var mtip = localStorage['combiMessageTip'];
                    if (!isSendEmail && mtip == undefined) {
                        excelFun.showMessage('本sheet 存在老版本的组合图， 如果没正常显示，请重做该图. ');
                        localStorage['combiMessageTip'] = true;
                    };

                    var divId;
                    //如果是从菜单上 添加的. 
                    if (others.from == "menu") {
                        _self.set('curEditChartSetting', null);
                    } else {
                        var curEditChartSetting = _self.get('curEditChartSetting');
                        divId = curEditChartSetting && curEditChartSetting.divId;
                    }

                    baseOption = others.settingOption || _self.doGetCurCombiOption({
                        fobj: fobj
                    });;
                    divId = divId || (fobj && fobj.divName.replace('f2_', '')) || divId_ || _self.generateFloatDiv4chart(baseOption.baseData.cr);
                    baseOption.divId = divId;
                } else {
                    baseOption = _self.doRenderChart_mergeOption(chartType, fobj, sheet, textName, divId_, others);
                }

                var option = baseOption.option,
                    divId = baseOption.divId,
                    baseData = baseOption.baseData,
                    isFirstRenderXYChange = baseOption.isFirstRenderXYChange;


                // 4. echart 使用格式化好的数据进行渲染.   
                var charts = _self.get('charts') || {};
                var chart = charts[divId];
                var myChart = chart && chart.chart;
                //TODO 
                // if ($("." + divId).length == 0) {
                //     return;
                // }
                //length 是 非当前 sheet 的div 
                if ($("." + divId).length == 0) {
                    //生成一个 div 
                    return;
                }
                // myChart = myChart || echarts.init($("." + divId).eq(0)[0]);
                myChart = myChart || _self.reInitChart(divId);

                if (option == null) {
                    _self.doAfterRenderChart();
                    return;
                }

                if (chartType == chartTypeConstant.combi) {
                    option = _self._cleanTempLegend(option);
                };


                // try {
                //     myChart.setOption({});
                // } catch (e) {
                //     myChart = _self.reInitChart(divId);
                //     myChart.setOption(option);
                // }

                // //组合图 记忆功能 (如果是组合图 并且 id 和 历史保存的id 相同 ，则 setting 重置一下. )
                // if (_self.editChartType_id == divId && chartType == chartTypeConstant.zuhe) {
                //     others.settings = _self.editChartType_settings;
                // };

                charts[divId] = {
                    chart: myChart,
                    divId: divId,
                    chartType: chartType,
                    baseData: baseData,
                    option: option,
                    _location: {},
                    isXYChange: isFirstRenderXYChange || (fobj && fobj.isXYChange) || 0, // 当 isXYChange 为1 的时候， 则变幻xy . 
                    settings: (fobj && fobj.settings) || others.settings || {
                        seriesTypes: baseOption.seriesTypes, //组合模式  每个series 对应的类型. 
                        subAxisIndex: baseOption.subAxisIndex, // 组合模式中 次坐标轴 在legend 中的 索引. 
                        additionalWidth: baseOption.additionalWidth, // 组合模式中 次坐标轴 在legend 中的 索引. 
                        subAxisName: baseOption.subAxisName, // 组合模式中 次坐标轴 在legend 中的 索引. 
                        yAxis: {
                            y_unit_0: _self.getValueByPathStr('option.yAxis[0].axisLabel.formatter', baseOption),
                            y_unit_1: _self.getValueByPathStr('option.yAxis[1].axisLabel.formatter', baseOption),
                            min_0: _self.getValueByPathStr('option.yAxis[0].min', baseOption),
                            max_0: _self.getValueByPathStr('option.yAxis[0].max', baseOption),
                            min_1: _self.getValueByPathStr('option.yAxis[1].min', baseOption),
                            max_1: _self.getValueByPathStr('option.yAxis[1].max', baseOption),
                        },

                        //在混合图的编辑面板上的json 
                        json: others.json || {
                            key: _self._getChartTypeNameByCode(chartType), //图表类型
                            subIndex: 0, //第几种子类型
                        },
                        // 在编辑框中的json 
                        editorJson: {
                            divId: divId
                        }
                    }
                };
                _self.set('charts', charts);
                time1 = new Date();

                //console.info(time1)
                setTimeout(function() {
                    _self.reLoadChartByDivID(divId);
                }, 50)
                _self.doAfterRenderChart();
            },

            /**
             * @function setValueByPathStr()
             * @description  根据 path 路径设置json 
             * @param {Object} baseJson  如：  
             * @param {String} pathstr  如：  
             * @param {Object} value  如：  
             * @return {Object}  返回值. 
             * @example 
                var baseJson ={grid:{x1:1,x2:3,y1:4},yAxis:[{legend:33}]}
                setValueByPathStr(baseJson,'grid.y1',88);
             */
            setValueByPathStr: function(baseJson, pathstr, value) {
                try {
                    var keys = pathstr.split('.'),
                        tempK, beginIndex = 0,
                        endIndex = 0;
                    var arrayIndex = [];
                    for (var i = 0; i < keys.length; i++) {
                        tempK = keys[i];
                        beginIndex = tempK.indexOf("[");
                        endIndex = tempK.indexOf("]");
                        if (beginIndex != -1) {
                            keys[i] = tempK.substring(0, beginIndex)
                            arrayIndex.push({
                                key: i, //第几个片段
                                value: tempK.substring(beginIndex + 1, endIndex) //数组值(中括号内) 第几个
                            });
                        };
                    };
                    if (!baseJson) {
                        baseJson = {};
                    };
                    var tempObj = baseJson;
                    var lastObj = tempObj;
                    var ttindex = {};
                    for (var i = 0; i < keys.length - 1; i++) {
                        lastObj = tempObj;
                        if (arrayIndex[0] && arrayIndex[0]['key'] == i) {
                            if (!lastObj[keys[i]]) {
                                (lastObj[keys[i]] = []);
                            };
                        } else {
                            if (!lastObj[keys[i]]) {
                                (lastObj[keys[i]] = {});
                            };
                        }

                        tempObj = lastObj[keys[i]];
                        if (Object.prototype.toString.call(tempObj) == "[object Array]") {
                            ttindex = arrayIndex.shift();
                            if (arrayIndex && arrayIndex[0] && arrayIndex[0]['key'] == i + 1) {
                                tempObj = tempObj[ttindex['value']] || [];
                            } else {
                                if (!tempObj[ttindex['value']]) {
                                    tempObj[ttindex['value']] = {};
                                }
                                //准备迭代 内部的下一个
                                tempObj = tempObj[ttindex['value']];
                            }

                        };
                        if (tempObj == undefined) {
                            return baseJson;
                        };
                    };
                    var valueType = typeof value;
                    var isobj_str = valueType == 'object' || valueType == 'string';

                    //最后一个索引
                    var lastIndex_ = (keys.length - 1);
                    if (isobj_str && (value == null || value == "")) {
                        if (arrayIndex.length > 0 && amz.keys(arrayIndex)[0] == lastIndex_) {
                            var lasIndexV = arrayIndex[0]['value'];
                            //删除数组
                            tempObj[keys[lastIndex_]].remove(tempObj[keys[lastIndex_]][lasIndexV]);
                        } else {
                            delete tempObj[keys[lastIndex_]];
                        }
                    } else {
                        //一下子 改变了2个
                        tempObj[keys[lastIndex_]] = value;
                    };

                    return baseJson;
                } catch (e) {
                    return baseJson;
                }
            },
            /**
                 * @function getValueByPathStr()
                 * @description  根据字符串获取值
              
                 * @param {String} pathstr  如：  
                 * @return {Object}  返回值. 
                 * @example getValueByPathStr('yAxis[0].axisLabel.formatter',aa) 
                 */

            getValueByPathStr: function(pathstr, baseObj) {
                try {
                    if (baseObj == null) {
                        return null;
                    };
                    var keys = pathstr.split('.'),
                        tempK, beginIndex = 0,
                        endIndex = 0;
                    var arrayIndex = [];
                    for (var i = 0; i < keys.length; i++) {
                        tempK = keys[i];
                        beginIndex = tempK.indexOf("[");
                        endIndex = tempK.indexOf("]");
                        if (beginIndex != -1) {
                            keys[i] = tempK.substring(0, beginIndex)
                            arrayIndex.push(tempK.substring(beginIndex + 1, endIndex))
                        };
                    };
                    var tempObj = baseObj;
                    for (var i = 0; i < keys.length; i++) {
                        tempObj = tempObj[keys[i]];
                        if (Object.prototype.toString.call(tempObj) == "[object Array]") {
                            tempObj = tempObj[arrayIndex.shift()];
                        };
                        if (tempObj == undefined) {
                            return "";
                        };
                    };
                    return tempObj;
                } catch (e) {
                    //console.error(e)
                    return "";
                }
            },

            getAxisLabelStyle: function() {
                return {
                    textStyle: {
                        fontSize: 7,
                        fontStyle: 'italic',
                    },
                    // rotate: -20
                }
            },
            //使 XY 轴 变幻一下. 
            doGetXYChangeOption: function(option) {
                var _self = this;
                try {
                    var oldLegend = option.legend;
                    var newX = [],
                        newY, newLegend = {
                            padding: oldLegend.padding || 10,
                            orient: oldLegend.orient || 'vertical',
                            x: oldLegend.x || 'right',
                            y: oldLegend.y || '30',
                            data: []
                        },
                        newSeries = [];
                    newX[0] = {};
                    if (option.legend && option.legend.data) {
                        newX[0].data = option.legend.data;
                        newX[0].axisLabel = _self.getAxisLabelStyle();
                    };

                    if (option.xAxis && option.xAxis[0] && option.xAxis[0].data) {
                        newLegend.data = option.xAxis[0].data;
                    }

                    var oldSeries = option.series,
                        s, tempNewS = {};
                    for (var i = 0; i < oldSeries.length; i++) {
                        s = oldSeries[i];
                        var tempData = s.data,
                            tdata;
                        for (var j = 0; j < tempData.length; j++) {
                            tdata = tempData[j];

                            //第一行 cols 的内容  作为 row 的开始.
                            if (i == 0) {
                                var ns = {
                                    name: newLegend.data[j],
                                    type: s.type,
                                    data: [tdata]
                                };
                                tempNewS["key_" + j] = ns;
                                newSeries.push(ns);
                            } else {
                                var ns = tempNewS["key_" + j];
                                ns.data[ns.data.length] = tdata;
                            }
                        };
                    };
                    var newOption = kmd.clone(option);
                    newOption.xAxis = newX;
                    newOption.legend = newLegend;
                    newOption.series = newSeries;


                    return newOption;
                } catch (e) {
                    //console.error(e)
                    return option;
                }

            },

            doAfterRenderChart: function() {
                var _self = this;
                _self.initChartMenuEvent();
                _self.initChartClickEvent();
            },
            //初始化 chart click 事件
            initChartClickEvent: function() {
                var _self = this;
                $('.div-chart-auto').unbind('click').bind('click', function() {
                    var tempId = $(this).attr('id');
                    _self.set('activeChartId', tempId);
                    var charts = _self.get('charts');
                    if (charts == undefined) {
                        return;
                    };
                    var c = charts[tempId];
                    if (c != null) {
                        var cr = c.baseData.cr;
                        _self.setSelectionByChartCR(cr);
                        _self._backSetEditorJson();
                        _self._doAfterShowPEditor(_self);
                    }
                });
                $('.div-chart-auto').unbind('dblclick').bind('dblclick', function() {
                    _self._pEditorDivToggle(true);
                });

            },

            //切换图表配置框  divStatus true 时显示 false 隐藏，否则 toggle
            _pEditorDivToggle: function(divStatus) {
                var _self = this;
                var display = $('.chart-pEditor-cont').css('display');

                var isShow = false;

                if (display == 'none') {
                    isShow = true;
                };
                if ((divStatus != undefined && divStatus === true)) {
                    isShow = true;
                } else if ((divStatus != undefined && divStatus === false)) {
                    isShow = false;
                }

                if (isShow) {
                    $('.chart-pEditor-cont').removeClass('slideOutRight').addClass('slideInRight').show();
                    var CRDialog = _self.get('CRDialog');
                    CRDialog.hide();
                    _self._initChartEditorChangeEvent();
                    _self.initCRChangeEvent();
                } else {
                    $('.chart-pEditor-cont').removeClass('slideInRight').addClass('slideOutRight');
                    setTimeout(function() {
                        $('.chart-pEditor-cont').hide()
                    }, 300);
                }
            },
            _doAfterShowPEditor: function(_self) {},
            //根据 chart 的CR 选中 单元格. 
            setSelectionByChartCR: function(cr) {
                var _self = this;
                var activeSheet = _self.get('spread').getActiveSheet();  
                // {row: 6, rowCount: 1, col: 1, colCount: 4},
                activeSheet.setSelection(cr.row, cr.col, cr.rowCount, cr.colCount);
            },
            //刷新报表.   废弃 由 doRefreshChart_curSheet 代替
            doRefreshChart: function() {
                var _self = this;
                //console.info('doRefresh... ')
                _self.doRefreshChart_curSheet();
                return;
                var charts = _self.get('charts');
                if (charts == null) {
                    return;
                }
                var c;
                for (var i in charts) {
                    c = charts[i];
                    if ($('#' + i).length < 1) {
                        continue;
                    }
                    _self.reLoadChartByDivID(c.divId, null, null, c.isXYChange);
                }

                _self.doAfterRenderChart();
            },

            //刷新  当前 sheet 报表.  
            doRefreshChart_curSheet: function(editinfo, others) {

                var _self = this;
                //设置 刷新状态.  ,  1 为正在刷新，0为 刷新结束
                _self.refreshChartStatus = '1';

                var charts = _self.get('charts'),
                    c, cr;
                var s = _self.get('spread')
                var curSheet = s.getActiveSheet();  
                var objs = curSheet.getFloatingObjects();
                var objName = "",
                    divId, isColZoomIn = false,
                    isRowZoomIn = false;
                for (var i = 0; i < objs.length; i++) {
                    isColZoomIn = false;
                    isRowZoomIn = false;
                    objName = objs[i]._name
                    divId = objName.replace('f2_', '');
                    c = charts[divId];
                    if (c == undefined) {
                        continue;
                    };
                    //如果没有 editinfo (如触发 sheetChange) 时全部刷新. 
                    if (editinfo == undefined) {
                        _self.reLoadChartByDivID(c.divId, null, null, c.isXYChange, others);
                    } else {
                        cr = c.baseData.cr;
                        isColZoomIn = editinfo.col >= cr.col && editinfo.row >= cr.row;
                        isRowZoomIn = editinfo.col <= (cr.col + cr.colCount - 1) && editinfo.row <= (cr.row + cr.rowCount - 1);
                        if (isColZoomIn && isRowZoomIn) {
                            _self.reLoadChartByDivID(c.divId, null, null, c.isXYChange, others);
                        };
                    }
                };

                _self.doAfterRenderChart();
                _self.refreshChartStatus = '0';

            },
            //floatObject Reload Event 
            initSpreadCustomerFloatObjectEvent: function(spread) {
                var _self = this;
                var alisheet = _self.get('alisheet');
                var spread = alisheet.get('spread')
                spread.bind("CustomFloatingObjectLoaded", function(event, args) {
                    var fo = args.customFloatingObject;
                    var foName = fo.name() || '';
                    if (foName.indexOf('f2_') == -1) {
                        return;
                    }
                    var divId = foName.replace('f2_', '');
                    _self.reLoadChartByDivID(divId, fo._location);
                })
            },
            //刷新chart 的时候 要 重置 它的name .     废弃
            resetChartNameOnRefresh: function(oldOption, newOption) {

                // try {

                //     var text = oldOption.title.text;
                //     var subtext = oldOption.title.subtext;

                //     newOption.title.text = text;
                //     newOption.title.subtext = subtext;

                // } catch (e) {
                //     //console.error(e);
                // }
            },

            getPieItemStyle: function() {
                return {
                    normal: {
                        label: {
                            position: "outer",
                            // formatter: function(params) {
                            //     console.info(234);
                            //     console.info(params)
                            //     return params.name + (params.percent - 0).toFixed(0) + '%'
                            // }
                            formatter: "{b} ({d}%)"
                        },
                        labelLine: {
                            show: true
                        }
                    }
                }
            },
            reloadPieChartByDivId: function(c) {
                var _self = this;
                if (c.chartType != 3) {
                    return;
                }


                //事实开始的坐标. 
                var _cr = c.baseData._cr,
                    cr = c.baseData.cr, //选择区域的坐标
                    cIndex = c.baseData.cIndex, //leftTitle data开始查找的坐标
                    rIndex = c.baseData.rIndex, // topTitle data开始查找的坐标
                    isXyChange = false;

                var spread = _self.get('spread')
                var sheet = spread.getActiveSheet();  
                var baseData = _self.getBaseDatabyCr(cr, chartType, sheet);

                var topData = baseData.data[rIndex];
                var rowData = baseData.data[rIndex + 1];

                var result = [];

                var data = baseData.data;
                var tempData = {
                    name: rowData[0],
                    type: 'pie',
                    radius: '55%',
                    itemStyle: _self.getPieItemStyle(),
                    data: {}
                }
                var datas = [];

                for (var i = cIndex + 1, i_ = 0; i < rowData.length; i++, i_++) {

                    var rData = rowData[i];
                    datas.push({
                        value: rData,
                        name: topData[i_],
                    })

                };
                tempData.data = datas;
                result.push(tempData);

                console.info(topData);

                return {
                    legend: topData,
                    series: result
                }
            },
            hasZhongWen: function(obj) {
                if ((/[\u4e00-\u9fa5]+/).test(obj)) {
                    return true;
                }
                return false;
            },

            parse2Int: function(obj, defV) {
                try {
                    if (obj == "" || obj == null) {
                        return defV || 0;
                    }
                    return parseInt(obj);
                } catch (e) {
                    return defV || 0;
                }
            },

            //根据最长文字的长度 计算 legend x2 的长度
            computeX2: function(option, others) {
                var _self = this;
                var others = others || {};
                var additionalWidth = others.additionalWidth || 0;
                var maxLegendLength = 0;
                var maxYNum = 0;
                var hasZW = false;
                if (!(option.legend && option.legend.data)) {
                    return option;
                };
                var legendData = option.legend.data;
                var seriesData = option.series,
                    sData;
                for (var i = 0; i < legendData.length; i++) {
                    if ((legendData[i] + '').length > maxLegendLength) {
                        if (_self.hasZhongWen(legendData[i])) {
                            hasZW = true;
                        }
                        maxLegendLength = (legendData[i] + '').length;
                    }
                };

                for (var i = 0; i < seriesData.length; i++) {
                    sData = seriesData[i] && seriesData[i].data;
                    for (var j = 0; j < sData.length; j++) {
                        if (_self.parse2Int(sData[j]) > maxYNum) {
                            maxYNum = _self.parse2Int(sData[j]);
                        };
                    };
                };

                if (option.grid == undefined) {
                    option.grid = {};
                }
                //最大长度 乘以一个系数 作为 x2 的长度 中文按照长度 12px 英文 按照 7px 
                option.grid.x2 = maxLegendLength * (hasZW ? 12 : 7) + 60 + additionalWidth;
                option.grid.x = (maxYNum + "").length * 7 + 50;
                return option;
            },
            //开始触发 chart 编辑 
            _beginTriggerChartEditor: function() {
                var _self = this;
                //step1 bind editor json

            },
            //根据 图表 属性编辑器 强化 json 
            strongOptionByEditorJson: function(option, settings, c) {
                try {
                    var _self = this;
                    if (option == null) {
                        return option;
                    };
                    if (settings == undefined) {
                        return option;
                    };
                    var editorJson = c.settings.editorJson;
                    // console.info("copy前:" + JSON.stringify(option));
                    _self._cleanNull4EditorJson(editorJson);
                    // option = _self._proCopy(true, option, editorJson);
                    var aa = _self.clone(option);
                    option = $.extend(true, aa, editorJson);
                    // console.info("copy后:" + JSON.stringify(option));
                    return option;
                } catch (e) {
                    return option;
                }

            },
            //清理 editorJson 中 null 的占位 (如: series 不要有 null)
            _cleanNull4EditorJson: function(editorJson) {
                try {
                    var series = editorJson.series;
                    for (var i = series.length - 1; i >= 0; i--) {
                        if (series[i] == null) {
                            series[i] = {};
                        };
                    };
                    return editorJson;
                } catch (e) {
                    return editorJson;
                }
            },
            /**
                * @function _proCopy()   废弃 由 clone 代替
                * @description  对象属性的 copy  (把 sourceObj 的属性 copy 到 targetObj上)  可以用这个方法 代替 amz.extend  
             
                * @param {Object} targetObj  目标对象
                * @return {Object}  sourceObj  源对象
                */
            _proCopy: function(target, source) {

                try {
                    var _self = this;
                    var pro, src, tar, clone,
                        i = 1,
                        deep = false,
                        n = arguments.length,
                        toString = Object.prototype.toString;
                    if (typeof target === 'boolean') {
                        i = 2;
                        deep = target;
                        target = source || {};
                    }

                    if (typeof target !== 'object' && !amz.isPlainObject(target)) {
                        target = {};
                    }

                    for (; i < n; i++) {
                        if ((source = arguments[i]) != null) {
                            for (pro in source) {
                                tar = target[pro];
                                src = source[pro];
                                // prevent no-ending loop
                                if (target === tar) continue;
                                if (deep && src && (amz.isPlainObject(src) ||
                                        toString.call(src) === '[object Array]')) {
                                    if (amz.isPlainObject(src)) {
                                        clone = tar && amz.isPlainObject(tar) ? tar : {};
                                    } else {
                                        clone = tar && toString.call(tar) === '[object Array]' ? tar : [];
                                    }
                                    target[pro] = _self._proCopy(deep, clone, src);
                                } else if (toString.call(src) === '[object Object]') {
                                    clone = tar;
                                    target[pro] = _self._proCopy(deep, clone, src);
                                } else {
                                    target[pro] = src;
                                }
                            }
                        }
                    }

                    return target;
                } catch (e) {
                    return target
                }
            },

            /**
                * @function strongOptionBySetting()
                * @description  重新加载的时候 要根据配置信息强化 option 对象. 
             
                * @param {Object} option chart 自身的 option 
                * @return {Object}  settings  在页面上配置的 信息， (在 dorenderChart 方法内)
                */

            strongOptionBySetting: function(option, settings, c, others) {
                var _self = this;
                if (settings == undefined) {
                    return option;
                };

                if (c == null) {
                    var activeChartId = _self.get('activeChartId');
                    var charts = _self.get('charts');
                    if (charts != undefined) {
                        c = charts[activeChartId]
                    };
                };


                settings = settings || {};

                // option = _self.yAxisUnitFormatAspect(option, settings);



                option = _self.reverseXAspect(option, settings);
                option = _self.multiLegendAspect(option, settings);
                option = _self.strongOptionByJsonAspect(option, settings, c);

                option = _self.strongOptionByYaxis(option, settings, c);

                //editorJson 放在后边， 
                option = _self.strongOptionByEditorJson(option, settings, c);

                option = _self.strongOptionByMultiTitle(option, settings, c, others);

                option = _self._cleanOptionByType(option, settings, c);

                option = _self.addDefaultTextStyle(option, settings, c);


                return option;
            },

            //检查 series type 是否都有， (如果没有 则 echart 会报错, 没有咱就不进行渲染chart)
            checkSeriesTypeRight: function(option) {
                var _self = this;
                if (option == null) {
                    return false;
                };

                var series = option.series;
                for (var i = 0; i < series.length; i++) {
                    if (series[i].type == undefined) {
                        return false;
                    }
                };
                return true;
            },

            addDefaultTextStyle: function(option, settings, c) {
                try {
                    var _self = this;
                    var xAxis = option.xAxis;
                    var yAxis = option.yAxis;
                    var fontSize;

                    for (var i = 0; i < xAxis.length; i++) {
                        _self.setValueByPathStr(xAxis[i], 'axisLabel.textStyle.fontSize', '12');
                        _self.setValueByPathStr(xAxis[i], 'axisLabel.textStyle.fontFamily', 'Microsoft YaHei,Arial, Verdana, sans-serif');
                    };

                    for (var i = 0; i < yAxis.length; i++) {
                        _self.setValueByPathStr(yAxis[i], 'axisLabel.textStyle.fontSize', '12');
                        _self.setValueByPathStr(yAxis[i], 'axisLabel.textStyle.fontFamily', 'Microsoft YaHei,Arial, Verdana, sans-serif');
                    };

                    return option;
                } catch (e) {
                    return option;
                }
            },

            strongOptionByMultiTitle: function(option, settings, c, others) {
                try {
                    var _self = this;

                    //强化 多行 title&类别  （目前 2015-07-12 15:33:22  仅作用于 line bar combi 图形上）
                    var isReplaceDataInfo = true;
                    if (others && others.replaceDataInfo == false) {
                        isReplaceDataInfo = false;
                    };

                    //bar 的堆积 ， 也不走该逻辑. 
                    var jsonKey = _self.getValueByPathStr('settings.json.key', c);
                    var jsonSubIndex = _self.getValueByPathStr('settings.json.subIndex', c);
                    if (jsonKey == 'bar' && (jsonSubIndex == 1 || jsonSubIndex == 3)) {
                        isReplaceDataInfo = false;
                    };

                    if (c && isReplaceDataInfo) {
                        // if (c.settings && (c.settings.editorJson.useMT != undefined) && c.settings.editorJson.useMT == '1') {
                        {
                            var isOKType = amz.contains([1, 2], c.chartType);
                            if (isOKType) {
                                if (c.baseData.__cr.col >= 2 || c.baseData.__cr.row >= 2) {
                                    option = _self.doStrongOptionByMultiTitle(option, settings, c);
                                };
                            };
                        };
                    };

                    return option;
                } catch (e) {
                    console.error(e)
                    return option;
                }
            },


            /**
                 * @function doStrongOptionByMultiTitle()
                 * @description  强化 多行 title&类别 
                 * @param {Object} option  原始 option 信息
                 * @param {Object} settings 设置项 
                 * @param {Object} c  chart 相关信息 
                 
                 */

            doStrongOptionByMultiTitle: function(option, settings, c) {
                var _self = this;
                try {
                    // 1. getLeftTopData
                    var ltData = _self.getLeftTopDataByCR_multi(c.baseData.cr);

                    if (ltData['t'].length < 2 && ltData['l'].length < 2) {
                        return option;
                    };

                    // 2.  concat title 名字
                    var newLTData = _self._generateConcatTitle(ltData);
                    //3  循环替换 option 中的  x y  series legend 等名字
                    option = _self._replaceByNewLTData(option, newLTData, c);

                    return option;
                } catch (e) {
                    console.error(e);
                    return option;
                }
            },

            // 把 option 中的 xAxis yAxis legend 的 data 和  series 的 name 替换掉. 
            //TODO 注意 挨个替换的时候 要对比一下，是否和 old 相等， 如果相等， 则替换，(兼容 有‘主’ ‘次’ legend 生成的时候)
            _replaceByNewLTData: function(option, newLTData, c) {
                var _self = this;
                try {

                    var legend = option.legend;
                    var xAxis = option.xAxis;
                    var yAxis = option.yAxis;
                    var series = option.series;
                    var legend_fromT = false;



                    //替换 x y axis 和 legend 的 data 信息
                    function replaceDataInfo(c, target, isLegend, isSeries, others) {
                        // var chartSplit = '__||__';
                        var chartSplit = new RegExp(/__\|\|__/g);
                        if (target == null) {
                            return null;
                        };

                        //是否转行
                        var isTurn = (others && others.turn) || false;
                        var tData = newLTData['t'];
                        var lData = newLTData['l'];

                        tData = _self.clone(tData);
                        lData = _self.clone(lData);

                        var data = target;
                        //todo 判断一下 data 是从 t 还是 l 数据来的.  然后 挨个进行替换
                        var isT;
                        if (isSeries) {
                            isT = legend_fromT;
                        } else {
                            isT = isFromT(target, newLTData['t']);
                        }
                        if (isT == null) {
                            return null;
                        };
                        if (isLegend) {
                            legend_fromT = isT;
                        };
                        var beginIndex = 0;
                        var tempName = '';
                        //如果是 从 T 来的数据

                        var ltDataTemp;
                        var beginIndex2 = 0;

                        if (isT === true) {
                            ltDataTemp = tData;
                            beginIndex2 = c.baseData.__cr.col;
                        } else {
                            ltDataTemp = lData;
                            beginIndex2 = c.baseData.__cr.row;
                        }

                        // //判断开始的 索引  (比如 左边)
                        // for (var i = 0; i < ltDataTemp.length; i++) {
                        //     if (isSeries) {
                        //         tempName = target[0]['name'];
                        //         if (amz.isObject(tempName)) { //object 默认为是 主 次. 
                        //             tempName = target[1]['name'];
                        //         }
                        //     } else {
                        //         tempName = target[0];
                        //         if (amz.isObject(tempName)) {
                        //             tempName = target[1];
                        //         }
                        //     }
                        //     if (ltDataTemp[i]['old_'] == tempName) {
                        //         // 使用 beginIndex + 可以防止 主次 作为legend 时候的混淆 
                        //         beginIndex = beginIndex + i;
                        //         break
                        //     } else if (amz.isObject(tempName) && (tempName['name'] == ec_constant.zhu || tempName['name'] == ec_constant.ci)) {
                        //         beginIndex--;
                        //     };
                        // };

                        // if (beginIndex != beginIndex2) {
                        //     alert('index not same');
                        // };

                        beginIndex = beginIndex2;


                        //主次 分开. 
                        var ltDataTemp2 = [
                            [],
                            []
                        ];
                        if (isLegend) {
                            //获取 主次坐标轴的 位置. 
                            var yAxisIndex = []; // 0 , 1  
                            var editorJson_series = c.settings.editorJson.series;
                            var targetSum = (ltDataTemp.length - beginIndex2);
                            for (var i = 0; i < targetSum; i++) {
                                if (editorJson_series && editorJson_series[i] && editorJson_series[i].yAxisIndex == 1) {
                                    yAxisIndex.push(1);
                                } else {
                                    yAxisIndex.push(0);
                                }
                            };

                            //根据主次坐标轴 拆分 ltTitle（ltDataTemp2） 信息
                            for (var i = beginIndex2, lt2Index = 0; i < ltDataTemp.length; i++, lt2Index++) {
                                if (yAxisIndex[lt2Index] == 1) {
                                    ltDataTemp2[1].push(ltDataTemp[i]);
                                } else {
                                    ltDataTemp2[0].push(ltDataTemp[i]);
                                }
                            };
                            console.info(ltDataTemp2);
                        } else {
                            ltDataTemp2[0] = ltDataTemp;
                        }


                        var tempNewName = '';
                        // beginIndex  的值 仅在没有次坐标轴的时候管用. 
                        //考虑 有次坐标轴的时候 的替换方法.  
                        //把 使用top 中的 值 挨个替换   target 为 option 中的legend （包含 主 次） 信息 或者 series 信息

                        for (var i = 0; i < target.length; i++) {
                            if (!isSeries) {
                                if (amz.isObject(target[i])) {
                                    if (target[i]['name'] == ec_constant.zhu || target[i]['name'] == ec_constant.ci) {
                                        //如果是legend 的话. 
                                        if (isLegend) {
                                            ltDataTemp = ltDataTemp2.shift();
                                            beginIndex = 0;
                                        };
                                        continue;
                                    };
                                };
                            }
                            //ltDataTemp 为 自动计算出来的 top left 列头 
                            tempNewName = ltDataTemp[beginIndex++]['new_'];
                            if (isTurn) {
                                tempNewName = tempNewName.replace(chartSplit, '\n');
                            } else {
                                tempNewName = tempNewName.replace(chartSplit, '_');
                            }
                            if (isSeries) {
                                target[i]['name'] = tempNewName;
                            } else {
                                target[i] = tempNewName;
                            }
                        };

                        return target;
                    };

                    //判断是否从 top 上来  (target data 都在 tData中)   //要特殊处理 主次 legend 的情况. 
                    function isFromT(targetData, tData) {
                        var result = true;
                        var beginIndex = 0;
                        var checkNums = 0; //成功检查的数量

                        for (var i = 0; i < targetData.length; i++) {
                            for (var j = 0; j < tData.length; j++) {
                                if (targetData[i] == tData[j]['old_']) {
                                    if (checkNums == 0) {
                                        beginIndex = j;
                                    };
                                    checkNums++;
                                    break;
                                };
                            };
                        };

                        var targetLegendNum = targetData.length;
                        //检查 targetData 中是否包含 主次 的临时 legend   如果包含 则需要减掉
                        for (var i = 0; i < targetData.length; i++) {
                            if (amz.isObject(targetData[i])) {
                                targetLegendNum--;
                            }
                        };

                        if (checkNums == targetLegendNum) {
                            return true
                        } else {
                            return false;
                        }
                    };


                    if (legend && legend.data) {
                        legend.data = replaceDataInfo(c, legend.data, true);
                    };
                    // if (xAxis && xAxis[0] && xAxis[0].data) {
                    //     xAxis[0].data = replaceDataInfo(xAxis[0].data);
                    // };
                    if (xAxis) {
                        for (var i = 0; i < xAxis.length; i++) {
                            if (xAxis[i] && xAxis[i].data) {
                                xAxis[i].data = replaceDataInfo(c, xAxis[i].data, null, null, {
                                    'turn': true
                                });
                            };
                        };
                    };

                    if (yAxis) {
                        for (var i = 0; i < yAxis.length; i++) {
                            if (yAxis[i] && yAxis[i].data) {
                                yAxis[i].data = replaceDataInfo(c, yAxis[i].data);
                            };
                        };
                    };

                    if (series) {
                        series = replaceDataInfo(c, series, null, true);
                    };



                    return option;
                } catch (e) {
                    //console.error(e);
                    return option;
                }
            },
            _generateConcatTitle: function(ltData) {
                var _self = this;
                var chartSplit = '__||__';
                try {
                    // 形如：  
                    // [{   // 'old':'new'}]
                    var lResult = [],
                        tResult = [];
                    var leftData = ltData.l;
                    var topData = ltData.t;
                    var newName = '',
                        tempArray = [];
                    for (var i = 0; i < leftData.length; i++) {
                        newName = '';
                        tempArray = leftData[i];
                        for (var j = 0; j < tempArray.length; j++) {
                            if (j != 0) {
                                newName += (newName == "" ? "" : chartSplit) + tempArray[j];
                            } else {
                                newName = tempArray[j];
                            }
                        };
                        lResult.push({
                            old_: tempArray[tempArray.length - 1],
                            new_: newName
                        })
                    };
                    //第一行长度
                    var top1Length = topData[0].length;
                    for (var j = 0; j < top1Length; j++) {
                        newName = '';
                        for (var i = 0; i < topData.length; i++) {
                            tempArray = topData[i];
                            if (i != 0) {
                                // newName += chartSplit + tempArray[j];
                                newName += (newName == "" ? "" : chartSplit) + tempArray[j];
                            } else {
                                newName = tempArray[j];
                            }
                        };
                        tResult.push({
                            old_: topData[topData.length - 1][j],
                            new_: newName
                        })
                    };

                    return {
                        l: lResult,
                        t: tResult
                    };
                } catch (e) {
                    //console.error(e);
                    return null;
                }
            },

            //根据图表类型 清除一些属性. 
            _cleanOptionByType: function(option, settings, c) {
                var _self = this;
                try {
                    if (option == null) {
                        return option;
                    };

                    // 重新计算 右边距
                    var rightP = _self.getValueByPathStr('editorJson.grid.x2', settings);
                    if (rightP == "" || rightP == undefined) {
                        option = _self.computeX2(option);
                    };

                    // 去除 饼图 等 grid 信息
                    var chartType = _self.getValueByPathStr('json.key', settings);
                    var chartTypeCode = chartTypeConstant[chartType];
                    var isNoGrid = amz.contains([3, 7, 8, 9], chartTypeCode);
                    if (isNoGrid) {
                        _self.setValueByPathStr(option, 'grid', null);
                        _self.setValueByPathStr(option, 'yAxis', null);
                        _self.setValueByPathStr(option, 'xAxis', null);

                    };

                    //更新 line bar 的 z index 

                    var series = option.series;

                    for (var i = 0; i < series.length; i++) {
                        if (series[i].type == 'line') {
                            series[i].z = 10;
                        } else if (series[i].type == 'bar') {
                            series[i].z = 8;
                        }
                    };


                    //y 轴 name 要和 轴线的显示保持一致. 如果轴线不显示 则name 也不显示. 
                    var yAxis = option.yAxis;
                    var tempShowLine = false,
                        tempLabeFormatter = '';

                    if (yAxis) {
                        for (var i = 0; i < yAxis.length; i++) {
                            tempShowLine = _self.getValueByPathStr('axisLine.show', yAxis[i]);
                            tempLabeFormatter = _self.getValueByPathStr('axisLabel.formatter', yAxis[i]);
                            if (tempShowLine === false) {
                                _self.setValueByPathStr(yAxis[i], 'name', null);
                            };
                            // formater 为 {value} 的时候 数字就没 了逗号分隔， 所以当这个的时候 格式化掉
                            if (tempLabeFormatter == '{value}') {
                                _self.setValueByPathStr(yAxis[i], 'axisLabel.formatter', function(v) {
                                    var result = (v + "").replace(/\d+?(?=(?:\d{3})+$)/img, "$&,");
                                    return result;
                                });
                            };
                        };
                    };


                    return option;
                } catch (e) {
                    console.error(e);
                    return option;
                }
            },

            //兼容老的 setting 
            getOldSettingByDivID: function(divId) {
                var _self = this;
                try {
                    var c = localStorage['tempCharts'];
                    c = JSON.parse(c);
                    for (var i = 0; i < c.length; i++) {
                        var s = c[i];
                        var fobjs = s.fobjs;
                        for (var j = 0; j < fobjs.length; j++) {
                            var fobj = fobjs[j];
                            if (fobj.divName == divId) {
                                return fobj.settings;
                            }
                        };
                    };
                    return null;
                } catch (e) {
                    return null;
                }
            },
            //根据坐标轴 强化json 主要用户 生成主次 legend  (会逐渐废弃，由strongByEditorJson 代替)
            strongOptionByYaxis: function(option, settings, c) {
                var _self = this;
                try {
                    if (option == null) {
                        return option;
                    };

                    //兼容老的 combi 
                    if (c && c.divId && c.chartType == chartTypeConstant.combi) {
                        settings = _self.getOldSettingByDivID(c.divId);
                    };
                    var seriesTypes = settings.seriesTypes,
                        subAxisIndex = settings.subAxisIndex, // 在次坐标轴上的 series(legend) 的索引. 
                        additionalWidth = settings.additionalWidth;
                    var series = option.series;

                    option = _self._cleanTempLegend(option);

                    //兼容新的 editorJson 调成的 combi 模式 （seriesTypes 有 表示老的 combi ,没则用 editorJson 中的）
                    if (seriesTypes == undefined && settings.editorJson) {
                        var editorJson_series = settings.editorJson.series;
                        if (!subAxisIndex || subAxisIndex.length == 0) {
                            subAxisIndex = [];
                            for (var i = 0; i < editorJson_series.length; i++) {
                                if (editorJson_series[i] && editorJson_series[i].yAxisIndex != undefined && editorJson_series[i].yAxisIndex == 1) {
                                    subAxisIndex.push(i);
                                };
                            }
                        };
                    };

                    var legend1 = [],
                        legend2 = [];
                    var sType; //serise type 

                    // 兼容 老的 combi 模式， 和新的 editorJson 调成的 combi 模式 
                    if ((seriesTypes && series.length == seriesTypes.length) || subAxisIndex.length > 0) {
                        for (var i = 0; i < series.length; i++) {
                            if (seriesTypes && seriesTypes[i] != undefined) {
                                series[i].type = seriesTypes[i];
                            };
                            sType = series[i].type;
                            if (amz.contains(subAxisIndex, i)) {
                                legend2.push(option.legend.data[i]);
                                series[i].yAxisIndex = 1;
                                if (option.yAxis.length == 1) {
                                    // if (settings.subAxisName) {   // 2015-07-23 14:19:47  去掉判断 ， 解决第一次 生成次坐标轴没显示的问题.
                                    option.yAxis.push({
                                            // name: settings.subAxisName,
                                            type: 'value'
                                        })
                                        // };
                                };
                            } else {
                                legend1.push(option.legend.data[i]);
                            }

                            if ((seriesTypes && seriesTypes[i] == 'line') || sType == 'line') {
                                series[i].z = 10;
                            } else {
                                series[i].z = 8;
                            }

                        };
                    };
                    if (additionalWidth != undefined) {
                        option = _self.computeX2(option, {
                            'additionalWidth': additionalWidth
                        });
                    };

                    if (legend1.length > 0 && legend2.length > 0) {

                        var legendData = [];
                        legendData.push({
                            name: ec_constant.zhu,
                            icon: ec_constant.legendImgUrl
                        });
                        // legendData = amz.union(legendData, legend1);
                        legendData = legendData.concat(legend1);
                        legendData.push({
                            name: ec_constant.ci,
                            icon: ec_constant.legendImgUrl
                        });
                        legendData = legendData.concat(legend2);
                        option.legend.data = legendData;
                    };

                    var isSendEmail = _self.isSendEmail();
                    if (isSendEmail) {
                        option.animation = false;
                    };
                    return option;
                } catch (e) {
                    return option
                }

            },
            //根据添加的类型（更多的时候 增强类型） 强化 option 
            strongOptionByJsonAspect: function(option, settings, c) {
                try {

                    var _self = this;
                    var json = {};
                    if (!(settings || settings.json)) {
                        return option
                    } else {
                        json = settings.json || {};
                    }

                    option = _self._strongJson_line(option, settings, c, json);
                    option = _self._strongJson_bar(option, settings, c, json);
                    option = _self._strongJson_funnel(option, settings, c, json); //漏斗
                    option = _self._strongJson_gauge(option, settings, c, json); //仪表盘
                    option = _self._strongJson_radar(option, settings, c, json); // 雷达区 
                    option = _self._strongJson_scatter(option, settings, c, json); // 散点图 
                    option = _self._strongJson_bubble(option, settings, c, json); // 气泡图
                    option = _self._strongJson_pie(option, settings, c, json); // 饼图

                    return option;

                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },

            //把 data xy 调换一下. 
            _autoXyChangeData: function(c) {

            },

            //处理普通饼图 cols > rows 的选择的数据. 
            _getPieSeriesByBaseData: function(option, c) {
                try {
                    var _self = this;
                    //选择数据的行数
                    var rows = c.baseData.data.length;
                    //选择数据的列数 
                    var cols = c.baseData.data[0].length;
                    var data_0 = c.baseData.data[0],
                        data_1 = c.baseData.data[1];
                    var newData = [];
                    if (rows < cols) {
                        var tempArray = [];
                        for (var i = 0; i < data_1.length; i++) {
                            tempArray = [];
                            tempArray[0] = data_1[i];
                            if (i != 0) {
                                tempArray[1] = data_0[i];
                            };
                            newData.push(tempArray);
                        };
                    } else {
                        for (var i = 0; i < c.baseData.data.length; i++) {
                            newData.push([c.baseData.data[i][1], c.baseData.data[i][0]])
                        };
                    }

                    if (Math.max(rows, cols) < 2) {
                        BUI.Message.Alert('饼图的数据系列数不正确，请重新选择数据 ~', 'warning');
                        return false;
                    };
                    var tempnewData = [];
                    var tempV, tempN;
                    for (var j = 1; j < newData.length; j++) {
                        tempV = newData[j][0];
                        tempN = newData[j][1];

                        // 兼容 只选择了一列数据的情况. 
                        if (tempV == undefined) {
                            tempV = newData[j][1];
                            tempN = j;
                        };
                        tempnewData.push({
                            value: tempV,
                            name: tempN
                        })
                    };

                    var series = [];
                    series[0] = {
                        name: newData[0][0],
                        type: 'pie',
                        radius: '55%',
                        center: ["50%", "60%"],
                        data: tempnewData
                    }
                    option.series = series;
                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },

            //饼图
            _strongJson_pie: function(option, settings, c, json) {
                try {
                    var _self = this;
                    var key = json.key;
                    if (option == null) {
                        return null;
                    };
                    var subIndex = json.subIndex;
                    var value = json.value;
                    if (key && key == "pie") {
                        //去掉 0 的. （不显示标注）
                        if (subIndex == 0) {
                            subIndex = 1;
                        };
                        if (subIndex == 0) { // 
                            option = _self._getPieSeriesByBaseData(option, c);
                            option = _self._strongSeriesByType(option, {
                                key: 'itemStyle',
                                value: {}
                            });
                        };
                        if (subIndex == 1) { // 
                            option = _self._getPieSeriesByBaseData(option, c);
                            option = _self._strongSeriesByType(option, {
                                key: 'itemStyle',
                                value: {
                                    normal: {
                                        label: {
                                            show: true,
                                            formatter: "{b}: {c} ({d}%)"
                                        }
                                    }
                                }
                            });
                        };
                        if (subIndex == 2) { // 
                            option = _self._strongSeriesByType(option, {
                                key: 'radius',
                                value: ["45%", "70%"]
                            });

                            option = _self._strongSeriesByType(option, {
                                key: 'itemStyle',
                                value: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    },
                                    emphasis: {
                                        label: {
                                            show: true,
                                            position: "center",
                                            textStyle: {
                                                fontSize: "30",
                                                fontWeight: "bold"
                                            }
                                        }
                                    }
                                }
                            });
                        };
                        if (subIndex == 3) {
                            option = _self._strongSeries4doublePie(option, c.settings, c, json);
                        };
                        delete option.grid;
                    };

                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },

            //气泡图
            _strongJson_bubble: function(option, settings, c, json) {
                try {
                    var _self = this;
                    if (option == null) {
                        return null;
                    };
                    var key = json.key;
                    var subIndex = json.subIndex;
                    var value = json.value;
                    if (key && key == "bubble") {
                        if (subIndex == 0) { // 
                            option = _self._strongSeries4scatter(option, c, json);
                            option = _self._strongSeriesByType(option, {
                                key: 'symbol',
                                value: 'circle'
                            });
                            option = _self._strongSeriesByType(option, {
                                key: 'symbolSize',
                                value: function anonymous(value) {
                                    var radius = (value[2] - 0) * 16 / 100 + 4;
                                    return Math.max(Math.round(radius), 1) || 1;
                                }
                            });
                            option = _self._strongSeriesByType(option, {
                                key: 'tooltip',
                                value: {
                                    trigger: "axis",
                                    showDelay: 0,
                                    axisPointer: {
                                        type: "cross",
                                        lineStyle: {
                                            type: "dashed",
                                            width: 1
                                        }
                                    }
                                }
                            });
                        };
                    };
                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },
            //散点图
            _strongJson_scatter: function(option, settings, c, json) {
                try {
                    var _self = this;
                    if (option == null) {
                        return null;
                    };
                    var key = json.key;
                    var subIndex = json.subIndex;
                    var value = json.value;
                    if (key && key == "scatter") {
                        if (subIndex == 0) { // 
                            option = _self._strongSeries4scatter(option, c, json);
                        };
                    };
                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },

            //雷达图
            _strongJson_radar: function(option, settings, c, json) {
                try {
                    var _self = this;
                    if (option == null) {
                        return null;
                    };

                    var key = json.key;
                    var subIndex = json.subIndex;
                    var value = json.value;
                    if (key && key == "radar") {
                        if (subIndex == 0) { // 雷达图
                            option = _self._strongSeries4radar(option, c, json);
                        };
                        if (option && option.grid && option.grid.borderWidth) {
                            option.grid.borderWidth = 0;
                        };
                    };

                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },

            _strongJson_funnel: function(option, settings, c, json) {
                try {
                    var _self = this;
                    if (option == null) {
                        return null;
                    };
                    var key = json.key;
                    var subIndex = json.subIndex;
                    var value = json.value;
                    if (key && key == "funnel") {
                        if (subIndex == 0) { // 漏斗图
                            option = _self._strongSeries4funnel(option, c, json);
                        };
                        if (subIndex == 1) { // 漏斗图
                            BUI.Message.Alert('该组件正在开发中，待发布 ~', 'warning');
                            return null;
                        };
                    };
                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },

            //强化 仪表盘 json 
            _strongJson_gauge: function(option, settings, c, json) {
                try {
                    var _self = this;
                    if (option == null) {
                        return null;
                    };
                    var key = json.key;
                    var subIndex = json.subIndex;
                    var value = json.value;
                    if (key && key == "gauge") {
                        if (subIndex == 0) { // 漏斗图
                            option = _self._strongSeries4guage(option, c, json);
                        };
                    };
                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },

            _strongJson_line: function(option, settings, c, json) {
                try {
                    var _self = this;
                    if (option == null) {
                        return null;
                    };
                    var key = json.key;
                    var subIndex = json.subIndex;
                    var value = json.value;
                    if (key && key == "line") {
                        if (subIndex == 1) { // 标准面积图
                            option = _self._strongSeriesByType(option, {
                                key: 'itemStyle',
                                value: value
                            });
                        };
                        if (subIndex == 2) { // 堆积面积图
                            option = _self._strongSeriesByType(option, {
                                key: 'stack',
                                value: '总量'
                            });
                            option = _self._strongSeriesByType(option, {
                                key: 'itemStyle',
                                value: chartOptions.getStrongJsonByType('line', 1)
                            });
                        };
                        if (subIndex == 3) { // 堆积面积图
                            option = _self._strongSeriesByType(option, {
                                key: 'smooth',
                                value: true
                            });
                        };
                    };
                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },

            //暂未启用
            _strongSeries4doublePie: function(option, settings, c, json, tempOption) {

                try {

                    var rowNum = c.baseData.__cr.row;
                    if (rowNum - 2 < 0) {

                        //excelFun.showMessage('请选择要生成图表的正确数据区域 ');
                        $('#' + c.divId).html("<div style='text-align:center;height:100%;width:100%;background-color:#f0f0f0;padding:20px'><span style='color:red'>提示 :  </span> <span >请选择要生成图表的正确数据区域</span> </div>");
                        return null;
                        // return option;
                    };
                    var _self = this;

                    var tempOption = tempOption;

                    if (tempOption == undefined) {
                        var baseData = _self.getBaseData(c.baseData.cr, chartTypeConstant.line, c.baseData.sheet);
                        baseData = _self.doStrongData4Chart(baseData, chartTypeConstant.line);
                        tempOption = chartOptions.getOption(chartTypeConstant.line, baseData);
                    };

                    var seriesData = option.series[0].data;
                    var seriesLength = option.series.length;
                    if (seriesLength != 1) {
                        BUI.Message.Alert('嵌套饼图的数据系列数不正确，请重新选择数据 ~', 'warning');
                        return false;
                    };
                    var categoryIndex = rowNum - 2;
                    var category = c.baseData.data[categoryIndex];
                    var subCategory = c.baseData.data[categoryIndex + 1];

                    //TODO 判断 xy 的位置是否正确.  (有 category 的放在y 轴上. )
                    //TODO 防止 死循环
                    if (category.length - 1 == tempOption.xAxis[0].data.length) {
                        _self.autoSetNum = (_self.autoSetNum || 0) + 1;
                        if (_self.autoSetNum == 10) {
                            return option;
                        };
                        tempOption = _self.doGetXYChangeOption(tempOption);
                        return _self._strongSeries4doublePie(tempOption, settings, c, json);
                    };

                    var categorys_ = [],
                        categoryindexs_ = [];
                    for (var i = 0; i < category.length; i++) {
                        if (category[i] != "") {
                            categorys_.push(category[i]);
                            categoryindexs_.push(i);
                        };
                    };

                    _self.autoSetNum = 0;

                    var tempLegendData = [],
                        tempSum, ttData, subObj;
                    var sd2 = [];;
                    for (var i = 0; i < categorys_.length; i++) {
                        tempSum = 0;
                        subObj = {
                            name: categorys_[i],
                        }
                        for (var j = 0; j < seriesData.length; j++) {
                            ttData = seriesData[j]
                            if (j >= categoryindexs_[i] && (j < categoryindexs_[i + 1] || (i == categoryindexs_.length - 1))) {
                                tempSum += _self._parseFloat(ttData[j]);
                            };
                            if (j == 0) {
                                sd2.push({
                                    name: subCategory[j],
                                    value: ttData[j]
                                })
                            };
                        };
                        subObj.value = tempSum;
                        tempLegendData.push(subObj);
                    };

                    var newSeries = [];
                    newSeries[0] = {
                        name: '',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, 70],
                        itemStyle: {
                            normal: {
                                label: {
                                    position: "inside"
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        },
                        data: tempLegendData
                    };
                    newSeries[1] = {
                        name: '',
                        type: 'pie',
                        radius: [100, 140],
                        data: sd2
                    }
                    option.series = newSeries;

                    delete option.grid;
                    delete option.xAxis;
                    delete option.yAxis;
                    return option;
                } catch (e) {
                    return option;
                }

            },
            _parseFloat: function(obj, defV) {
                try {
                    return parseFloat(obj);
                } catch (e) {
                    return defV || 0;
                }
            },
            _strongJson_bar: function(option, settings, c, json) {
                try {
                    var _self = this;
                    if (option == null) {
                        return null;
                    };
                    var key = json.key;
                    var subIndex = json.subIndex;
                    var value = json.value;
                    if (key && key == "bar") {
                        if (subIndex == 1) { // 堆积柱状图
                            option = _self._strongSeries4bar(option, c, {});
                        };
                        if (subIndex == 2) { // 标准条形图
                            var tempXAxis = option.xAxis;
                            option.xAxis = option.yAxis;
                            option.yAxis = tempXAxis;
                            option.yAxis[0].type = 'category';
                            // if (option.yAxis[1]) {
                            //     option.yAxis[1].type = 'category';
                            // };
                        };
                        if (subIndex == 3) { // 堆积条形图
                            option = _self._strongSeries4bar(option, c, {});
                            if (option) {
                                var tempXAxis = option.xAxis;
                                option.xAxis = option.yAxis;
                                option.yAxis = tempXAxis;
                                option.yAxis[0].type = 'category';
                            };
                            //  if (option.yAxis[1]) {
                            //     option.yAxis[1].type = 'category';
                            // };
                        };
                    };
                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },
            // 堆积柱状图
            /**
             *  c.cr  是选择区数据的 信息 
             *如 ： 
             *{
             *    col: 2, //数据开始于第2列
             *    colCount: 10,  总共有10列
             *    row: 3,  //数据开始于第三行
             *    rowCount: 9 //总共有9行
             * }
             */
            _strongSeries4bar: function(option, c, json) {
                try {
                    var _self = this;
                    var rowNum = c.baseData.__cr.row;

                    //如果是左右排着的级别 (左边是大级别右边是小级别的再右边是数字的排列方式)
                    var baseData = c.baseData.data;
                    if (c.baseData.__cr.col > c.baseData.__cr.row) {
                        rowNum = c.baseData.__cr.col;
                        baseData = _self._baseDataXYChange(baseData);
                        // option = _self.doGetXYChangeOption(option);
                    };

                    if (rowNum - 2 < 0) {
                        //excelFun.showMessage('请选择要生成图表的正确数据区域 ');
                        $('#' + c.divId).html("<div style='text-align:center;height:100%;width:100%;background-color:#f0f0f0;padding:20px'><span style='color:red'>提示 :  </span> <span >请选择要生成图表的正确数据区域</span> </div>");
                        return null;
                        // return option;
                    };

                    var categoryIndex = rowNum - 2;
                    var category = baseData[categoryIndex];

                    //TODO 判断 xy 的位置是否正确.  (有 category 的放在y 轴上. )
                    if (category.length - 1 == option.xAxis[0].data.length) {
                        _self.autoSetNum = (_self.autoSetNum || 0) + 1;
                        if (_self.autoSetNum == 10) {
                            return option;
                        };
                        option = _self.doGetXYChangeOption(option);
                    };
                    _self.autoSetNum = 0;

                    var series = option.series;


                    for (var i = 0; i < series.length; i++) {
                        if (category[i + 1] != '') {
                            series[i]['stack'] = category[i + 1];
                        };
                    };

                    option.legend.x = 'center';
                    option.legend.y = 'bottom';
                    option.legend.orient = "horizontal";
                    // delete option.legend;
                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },

            // 给 漏斗图强化 json 
            _strongSeries4funnel: function(option, c, json) {
                try {

                    var _self = this;

                    var series = option.series;
                    delete option.xAxis;
                    delete option.yAxis;
                    delete option.grid;

                    if (c.baseData.leftTopData.leftData.length == 1) {
                        option.legend.data = c.baseData.leftTopData.topData;
                    } else {
                        option.legend.data = c.baseData.leftTopData.leftData;
                    }

                    var tempData = [],
                        newTempData = [];
                    for (var i = 0; i < series.length; i++) {
                        series[i].type = 'funnel';
                        tempData = series[i].data;
                        for (var j = 0; j < tempData.length; j++) {
                            newTempData.push({
                                value: tempData[j],
                                name: option.legend.data[j]
                            })
                        };
                        series[i].data = newTempData;
                    };
                    option.title = option.title || {
                        text: '漏斗图'
                    };
                    option.legend.x = 'center';
                    option.legend.y = 'bottom';
                    option.legend.orient = "horizontal";
                    option.tooltip = {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    }

                    delete option.xAxis;
                    delete option.yAxis;
                    delete option.grid;

                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },
            // 给 雷达图强化 json 
            _strongSeries4radar: function(option, c, json) {
                try {
                    var _self = this;
                    var series = option.series;

                    //step1 去掉 最大值 legend 
                    var legendData = option.legend.data;
                    var maxMinIndex = [],
                        legendNum = legendData.length;
                    for (var i = legendNum - 1; i >= 0; i--) {
                        if (legendData[i] == '最大值') {
                            maxMinIndex.push(i);
                            legendData.remove(legendData[i]);
                        };
                    };
                    if (maxMinIndex.length == 0) {
                        if (_self.radarCounter != undefined) {
                            _self.radarCounter++;
                        } else {
                            _self.radarCounter = 0;
                        }
                        if (_self.radarCounter > 5) {
                            // if (_self.refreshChartStatus != '1') {
                            BUI.Message.Alert('雷达图数据区域数据格式不正确 (需要包含名字为【最大值】的一列) ~', 'warning');
                            // };
                            _self.radarCounter = 0;
                            return null;
                        };
                        option = _self.doGetXYChangeOption(option);
                        return _self._strongSeries4radar(option, c, json);
                    };

                    _self.radarCounter = 0;
                    //step2 添加 polar max min 
                    //拿到和 legend 数量不一样的 left 或者 top data 
                    var polars = []
                    var indicators = [],
                        tempDatas = [],
                        maxNums = [];

                    if (c.baseData.leftTopData.leftData.length == legendNum) {
                        tempDatas = c.baseData.leftTopData.rightData;
                    } else {
                        tempDatas = c.baseData.leftTopData.leftData;
                    }
                    maxNums = option.series[maxMinIndex[0]].data;

                    for (var i = 0; i < tempDatas.length; i++) {
                        indicators.push({
                            text: tempDatas[i],
                            min: 0,
                            max: _self.parse2Int(maxNums[i])
                        });
                    };
                    polars.push({
                        indicator: indicators
                    })

                    var tempData = [];

                    //step3 处理 series 
                    for (var i = series.length - 1; i >= 0; i--) {
                        if (series[i].name == "最大值") {
                            series.remove(series[i]);
                            continue;
                        };
                    }
                    for (var i = 0; i < series.length; i++) {
                        tempData = series[i].data;
                        var newTempData = [];
                        newTempData.push({
                            value: tempData,
                            name: option.legend.data[i]
                        })

                        series[i].data = newTempData;
                        series[i].type = 'radar';

                    };

                    option.legend.x = 'right';
                    option.legend.y = 'bottom';
                    // option.legend.orient = "horizontal";
                    option.tooltip = {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    }
                    option.polar = polars;


                    delete option.xAxis;
                    delete option.yAxis;
                    delete option.grid;

                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },

            //基础数据的 xy change 
            _seriesXYChange: function(series) {
                var _self = this;
                var newSeries = [],
                    ttRow;
                for (var i = 0; i < series.length; i++) {
                    ttRow = baseData[i].data;
                    for (var j = 0; j < ttRow.length; j++) {
                        // newBaseData[j][i] = ttRow[j];
                        _self._setArrayData(newSeries, j, i, ttRow[j]);
                    };
                };
                return newSeries;
            },

            //基础数据的 xy change 
            _baseDataXYChange: function(baseData) {
                var _self = this;
                var newBaseData = [],
                    ttRow;
                for (var i = 0; i < baseData.length; i++) {
                    ttRow = baseData[i];
                    for (var j = 0; j < ttRow.length; j++) {
                        // newBaseData[j][i] = ttRow[j];
                        _self._setArrayData(newBaseData, j, i, ttRow[j]);
                    };
                };
                return newBaseData;
            },
            //设置数组的值，
            _setArrayData: function(array, j, i, value) {
                try {
                    var _self = this;
                    if (array[j] == undefined) {
                        array[j] = [];
                    };
                    array[j][i] = value;
                    return array;
                } catch (e) {
                    //console.error(e);
                }
            },

            // 给 散点图强化 json 
            _strongSeries4scatter: function(option, c, json) {
                try {
                    var _self = this;

                    // var rowNum = c.baseData._cr.row;
                    var rowNum = c.baseData.__cr.row;
                    //如果是左右排着的级别 (左边是大级别右边是小级别的再右边是数字的排列方式)
                    var baseData = c.baseData.data;
                    if (c.baseData.__cr.col > c.baseData.__cr.row) {
                        rowNum = c.baseData.__cr.col;
                        baseData = _self._baseDataXYChange(baseData);
                        // option = _self.doGetXYChangeOption(option);
                    };

                    if (rowNum - 2 < 0) {
                        //excelFun.showMessage('请选择要生成图表的正确数据区域 ');

                        $('#' + c.divId).html("<div style='text-align:center;height:100%;width:100%;background-color:#f0f0f0;padding:20px'><span style='color:red'>提示 :  </span> <span >请选择要生成图表的正确数据区域</span> </div>");
                        return null;
                        // return option;
                    };

                    var categoryIndex = rowNum - 2;
                    var category = baseData[categoryIndex];
                    var categorys_ = [],
                        categoryindexs_ = [];
                    for (var i = 0; i < category.length; i++) {
                        if (category[i] != "") {
                            categorys_.push(category[i]);
                            categoryindexs_.push(i);
                        };
                    };
                    //step1 legend 
                    option.legend.data = categorys_;

                    var series = option.series;

                    var tempData = [],
                        ttData = [],
                        newTempData = [],
                        newSeries = [],
                        tempS, tempData, subArr = [],
                        series_1;
                    //step2 处理 series 
                    var maxSLengh = 0; //原始系列中的最大length 
                    for (var j = 0; j < series.length; j++) {
                        if (series[j].data.length > maxSLengh) {
                            maxSLengh = series[j].data.length;
                        };
                    }

                    for (var i = 0; i < categorys_.length; i++) {
                        tempS = {
                            type: 'scatter',
                            name: categorys_[i],
                        }
                        tempData = [];
                        for (var m = 0; m < maxSLengh; m++) {
                            subArr = [];
                            for (var j = 0; j < series.length; j++) {
                                ttData = series[j].data;
                                if (j >= categoryindexs_[i] && (j < categoryindexs_[i + 1] || (i == categoryindexs_.length - 1))) {
                                    subArr.push(ttData[m]);
                                };
                            }
                            tempData.push(subArr)
                        };

                        tempS.data = tempData;
                        newSeries.push(tempS);
                    };
                    option.series = newSeries;
                    option.legend.x = 'center';
                    option.legend.y = 'bottom';
                    option.legend.orient = "horizontal";


                    var axis = [{
                        type: "value",
                        power: 1,
                        precision: 2,
                        scale: true
                    }]
                    option.xAxis = option.yAxis = axis;

                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },

            // 给 仪表盘 强化 json 
            _strongSeries4guage: function(option, c, json) {
                try {

                    var _self = this;
                    var series = option.series;

                    var tempData = [],
                        newTempData = [];
                    for (var i = 0; i < series.length; i++) {
                        series[i].type = 'gauge';
                        series[i].name = option.xAxis[0].data[0];
                        tempData = series[i].data;
                        for (var j = 0; j < tempData.length; j++) {
                            newTempData.push({
                                value: tempData[j],
                                name: option.legend.data[j]
                            })
                        };
                        series[i].data = newTempData;
                    };

                    delete option.xAxis;
                    delete option.yAxis;
                    delete option.grid;
                    delete option.legend;

                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },

            //根据json 值类型 格式化. if
            _strongSeriesByType: function(option, json) {
                try {
                    if (option == null) {
                        return option;
                    };
                    json = json || {};
                    var _self = this;
                    var series = option.series;
                    for (var i = 0; i < series.length; i++) {
                        series[i][json.key] = json.value;
                    };
                    return option;
                } catch (e) {
                    //console.error(e)
                    return option;
                }
            },


            //已废弃 由 strongbyEditorJson 代替
            yAxisMaxMinAspect: function(option, settings) {
                var _self = this;
                var so = _self.doGetSettingOption();
                //如果编辑窗口没打开. 则返回. 
                if (!so) {
                    so = settings.yAxis;
                };

                if (!so || !(settings)) {
                    return option
                };


            },
            //逆转x轴. 
            reverseXAspect: function(option, settings) {
                if (!(settings && settings.xReverse)) {
                    return option;
                };
                try {
                    var _self = this;
                    var oldX, oldSeries;
                    //step.1 获取x 轴数组 (x 轴的第一轴数据[默认为x轴只有这一个轴数据])
                    var oldX = option.xAxis[0].data;
                    //s.2 reverse x轴数组
                    option.xAxis[0].data = amz.clone(oldX).reverse();
                    //s.3 获取 series 数组
                    oldSeries = option.series;
                    //s.4 reverse series 数组. 
                    var ss = amz.clone(oldSeries),
                        s;
                    for (var i = 0; i < ss.length; i++) {
                        s = ss[i].data;
                        s.reverse();
                    };
                    option.series = ss;
                    return option;
                } catch (e) {
                    //console.error(e);
                    return option;
                }
            },

            // 对于很多 legend 折行遮挡住数据区域的处理.
            multiLegendAspect: function(option, settings) {
                try {
                    var _self = this;
                    var oldX, oldSeries;
                    //step1. 判断legend 数量;   默认超过 6 算多的.
                    var lLength = option.legend.data.length;
                    if (lLength > 6) {
                        option.grid = option.grid || {};
                        option.grid.x2 = 30;
                        option.grid.y2 = "90";
                        option.legend.x = "center";
                        option.legend.y = "bottom";
                        option.legend.orient = "horizontal";

                    } else {
                        return option;
                    }

                    return option;
                } catch (e) {
                    //console.error(e);
                    return option;
                }
            },

            //y轴 单位 已废弃
            yAxisUnitFormatAspect: function(option, settings) {
                var _self = this;
                var so = _self.doGetSettingOption();
                //如果编辑窗口没打开. 则返回. 
                if (!so) {
                    so = settings.yAxis;
                };

                if (!so || !(settings)) {
                    return option
                };

                try {
                    //step1 获取 yAxis 
                    var yAxis = option.yAxis;
                    var tempFormatter = "",
                        axisLabel;
                    for (var i = 0; i < yAxis.length; i++) {
                        axisLabel = yAxis[i].axisLabel || {};
                        if (i == 0) {

                            axisLabel.formatter = "{value}" + (so.y_unit_0 || '').replace('{value}', '')
                            if (!amz.isUndefined(so.min_0) && so.max_0 > 0) {
                                yAxis[i].min = so.min_0;
                            }
                            if (!amz.isUndefined(so.max_0) && so.max_0 > 0) {
                                yAxis[i].max = so.max_0;
                            }

                        } else if (i == 1) {
                            axisLabel.formatter = "{value}" + (so.y_unit_1 + '').replace('{value}', '')
                            if (!amz.isUndefined(so.min_1) && so.min_1 > 0) {
                                yAxis[i].min = so.min_1;
                            }
                            if (!amz.isUndefined(so.max_1) && so.max_1 > 0) {
                                yAxis[i].max = so.max_1;
                            }
                        }
                        yAxis[i].axisLabel = axisLabel;
                    };

                    // option.yAxis = yAxis;
                    return option;
                } catch (e) {
                    return option;
                }
            },

            reInitChart: function(divId) {
                var _self = this;
                var myChart;
                try {
                    $("." + divId).empty();
                    var w = $("." + divId).width();
                    var h = $("." + divId).height();
                    if (w < 1) {
                        $("." + divId).width(100);
                    };
                    if (h < 1) {
                        $("." + divId).height(100);
                    };
                    myChart = echarts.init($("." + divId).eq(0)[0]);

                } catch (e) {
                    myChart = echarts.init($("." + divId).eq(0)[0]);
                }
                return myChart;
            },
            //根据Div ID 重新加载 Chart 
            reLoadChartByDivID: function(divId, _location, _option, isXYChange, others) {
                var _self = this;
                var charts = _self.get('charts');
                if (charts == null) {
                    return;
                }
                others = others || {};
                var newCr = others.newCr;
                var _c = charts[divId];
                //是否是 pie 的 行列转换
                var isXYChange_pie = _c && _c.chartType && _c.chartType == 3 && isXYChange == 1;

                if (_c != null) {

                    // var oldOption = _c.chart.getOption();
                    var oldOption = _c.option;
                    var oldisXYChange = _c.isXYChange;

                    var myChart = _self.reInitChart(divId);
                    //var myChart = chart.chart; 
                    //TODO  chart 的option 要重新获取一次.

                    _c.baseData.cr = newCr || _c.baseData.cr;
                    var option = _option || _self.doGetOptionByCR(_c.baseData.cr, _c.chartType);

                    // _self.resetChartNameOnRefresh(oldOption, option);

                    //如果是曲线图 或者柱状图 则可以xychange  (后续把这个功能放到所有图标上2015-06-09 18:57:35)
                    // if ((isXYChange == 1 || (isXYChange == undefined && oldisXYChange == 1)) && !isXYChange_pie) {
                    if ((isXYChange == 1 || (isXYChange == undefined && oldisXYChange == 1))) {
                        option = _self.doGetXYChangeOption(option);
                    }


                    if (_c.chartType != 3) {
                        //TODO 计算双轴线的 width .  
                        option = _self.computeX2(option);
                    }

                    //根据 配置信息 强化 option 
                    option = _self.strongOptionBySetting(option, _c.settings, _c);
                    if (option == null) {
                        return false;
                    };

                    var isSeriesRight = _self.checkSeriesTypeRight(option);
                    if (!isSeriesRight) {
                        return false;
                    };

                    try {
                        if (others && others.animation != undefined) {
                            option.animation = others.animation;
                        };

                        myChart.setOption(option);
                    } catch (e) {
                        try {
                            myChart = _self.reInitChart(divId);
                            myChart.setOption(option);
                        } catch (e) {}
                    }
                    console.info(option);

                    _c.chart = myChart;
                    if (_location != undefined) {
                        _c._location = {
                            width: _location.width,
                            height: _location.height
                        };

                    }
                    _c.option = myChart.getOption();
                    if (isXYChange != undefined) {
                        _c.isXYChange = isXYChange;
                    };

                    charts[divId] = _c;
                }
                _self.doAfterRenderChart();
            },

            //根据baseData 强化成 echart 使用的数据

            doStrongData4Chart: function(baseData, chartType) {
                var _self = this;
                // 第一个版本 使用 左边的数据作为 x 轴 的数据. 
                // TODO 随后使用比较多少 自动转化， 也可以让用户进行 调整

                //如果 leftData 作为 x 轴 则，topData 作为 legend 数据. 

                var legend = {
                    data: []
                };
                var ld = baseData.leftTopData.leftData;
                for (var i = 0; i < ld.length; i++) {
                    legend.data[i] = ld[i];
                };
                var series = _self.doMergeSeiriesData(baseData, legend.data, chartType);
                var resultJson = amz.extend(baseData, {
                    animation: !_self.isSendEmail(),
                    title: {
                        text: ' ', //333333333333 
                        subtext: ' '
                    },
                    legend: {
                        // data: ['ss', 'dd']
                        padding: 10,
                        orient: 'vertical',
                        x: 'right',
                        y: '30',
                        data: legend.data,


                    },
                    xAxis: {
                        // 2015-06-18 11:32:46  添加 category 
                        type: 'category',
                        data: baseData.leftTopData.topData,
                        axisLabel: {
                            textStyle: {
                                fontSize: 7,
                                fontStyle: 'italic',
                            },
                            // rotate: -20
                        }
                    },
                    yAxis: [{
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                fontSize: 8
                            }
                            // ,rotate: -45
                            // formatter: '{value}'
                        }
                    }],
                    series: series
                });
                // if (chartType == 1) { //如果是line 则 x轴 不要 category 
                //     delete resultJson.xAxis.type;
                // };
                return resultJson;
            },
            /**
                 * @function doMergeSeiriesData()
                 * @description  根据 度量值 信息
              
                 * @param {Object} data 选中的区域的事实结果 
                 * @return {Object}  echart  series 数组
                 */
            doMergeSeiriesData: function(data, legendData, ctype) {
                var _self = this;

                if (ctype == chartTypeConstant.pie) {
                    //pieName..
                    return _self.doMergePieSeiriesData(data, legendData, ctype, ' ');
                }
                var result = [];
                var _cr = data._cr; //事实相对于 excel区块的坐标
                var __cr = data.__cr; //事实相对于 选择的区块的坐标
                var cIndex = data.cIndex,
                    rIndex = data.rIndex,
                    data = data.data;

                //判断是否有 leftTitle
                var noLT = false;
                if (legendData && legendData[0] != undefined) {
                    noLT = (legendData[0] + "").indexOf('   ') != -1;
                };
                //TODO 注意 没有列头 的情况 rIndex 
                //如果 事实行开始于第一行(没有 topTitle )
                var leftDataIndex = 0;
                if (__cr.row != 0) {
                    leftDataIndex = rIndex + 1;
                } else {
                    leftDataIndex = rIndex;
                }

                for (var i = leftDataIndex, i_ = 0; i < data.length; i++, i_++) {
                    var tempData = {
                        name: _self.null2string(legendData[i_]),
                        type: ctype == 2 ? 'bar' : 'line',
                        data: {}
                    }
                    var rData = data[i],
                        sData = [];
                    for (var j = noLT ? cIndex : cIndex + 1; j < rData.length; j++) {
                        sData[sData.length] = _self.null2string(rData[j]);
                        // sData[sData.length] = rData[j];
                    };
                    tempData.data = sData;
                    result.push(tempData);
                    tempData = null;
                };
                return result;
            },

            doMergePieSeiriesData: function(data, legendData, ctype, pieName) {
                var _self = this;
                var result = [];
                var _cr = data._cr;
                var cIndex = data.cIndex,
                    rIndex = data.rIndex,
                    data = data.data;

                var tempData = {
                    name: pieName || 'pieName',
                    type: 'pie',
                    radius: '55%',
                    itemStyle: _self.getPieItemStyle(),
                    data: {}
                }
                var datas = [];

                for (var i = rIndex + 1, i_ = 0; i < data.length; i++, i_++) {

                    var rData = data[i],
                        sData = [];
                    datas.push({
                        value: rData[1],
                        name: legendData[i_],
                    })

                };
                tempData.data = datas;
                result.push(tempData);
                return result;
            },

            //把null 转为 string 
            null2string: function(obj) {
                if (obj == null || obj == undefined) {
                    return '';
                } else {
                    return obj;
                }
            },

            getScrollHeightByRow: function(sheet, rowNum) {
                var result = 300;
                for (var i = 0; i < rowNum; i++) {
                    result += sheet.getRowHeight(i);
                };
                return result;
            },
            /**
                 * @function generateFloatDiv4chart()
                 * @description  为 chart 生成一个div 
              
                 * @param {Object} cr 选中的区域的坐标. 
                 * @return {Object}  返回生成的div id.
                 */
            generateFloatDiv4chart: function(cr, divId) {

                var _self = this;
                var alisheet = _self.get('alisheet');
                var spread = alisheet.get('spread')
                var sheet = spread.getActiveSheet();  
                var cr_row = cr.row;
                var cr_rowCount = cr.rowCount;
                var cr_col = cr.col;
                var cr_colCount = cr.colCount;

                var tempId = '';
                if (divId == undefined) {
                    tempId = 'div_chart' +
                        '_' + cr_row +
                        "_" + cr_rowCount +
                        "_" + cr_col +
                        "_" + cr_colCount +
                        "_" + Math.floor(Math.random() * 1000000);
                };


                var rect = sheet.getCellRect(cr_row, cr_col);
                var scrollHeight = _self.getScrollHeightByRow(sheet, cr_row);
                scrollHeight = scrollHeight - 240;

                var customFloatingObject = new window.alisheet.CustomFloatingObject("f2_" + tempId, rect.x || 100, scrollHeight || 40, 700, 260);
                customFloatingObject.Content("<div><div class='chart-oper'> <span class='icon-list'></span> </div><div id='" + tempId + "'  class='div-chart-auto  " + tempId + "'> <span style='margin-left:10px;margin-top:10px;'>loading..</span> </div> </div>");            
                sheet.addFloatingObject(customFloatingObject); 

                var maxZIndex = _self.get('maxZIndex');
                var fobj_container = $('#' + tempId).parents('.floatingobject-container');
                if (maxZIndex == undefined) {
                    maxZIndex = fobj_container.css('z-index');
                };
                maxZIndex++;
                fobj_container.css('z-index', maxZIndex);
                _self.set('maxZIndex', maxZIndex);
                return tempId;
            },

            /**
             * @function getSelectedBaseData()
             * @description 获取选中区域的 BaseData. 
             * @param {int} chartType  line , column pie 
             * @return {Object}  返回转换后的值.
             */
            getSelectedBaseData: function(chartType, sheet, cr) {
                var _self = this;
                var cr = cr || _self.getSelectedCr(sheet);
                if (cr.rowCount < 2 && cr.colCount < 2) {
                    BUI.Message.Alert('请选择要生成图表的数据区域 ', 'warning');
                    return false;
                };
                return _self.getBaseDatabyCr(cr, chartType, sheet);
            },

            /**
             * @function getBaseDatabyCr()
             * @description 根据 cr 获取 BaseData. 
             * @param {Object} cr 
             * @param {int} chartType  line , column pie 
             * @return {Object}  返回转换后的值.
             */
            getBaseDatabyCr: function(cr, chartType, sheet) {
                var _self = this;
                var activeSheet = sheet || _self.get('spread').getActiveSheet();
                return _self.transoformSelectedValue(cr, chartType, activeSheet);
            },


            getSelectedCr: function(sheet) {
                var _self = this;
                var activeSheet = sheet || _self.get('spread').getActiveSheet();  
                var cr = activeSheet.getSelections()[0];
                return cr;
            },


            /**
             * @function transoformSelectedValue()
             * @description 根据策略 转换 选中的 值. 
               * 一些策略： 
               * x y轴 根据项的多少进行 展现 (可以弹出提示， 设置 x , y )
               * 目前只展现离 度量值最近的一个维度 
               * 对于 % 百分号的策略  因为要转化为数字 所以 把% 去掉了.
               * 对于饼图  目前只展现一个维度 和一个 事实. 

             * @param {Object} cr 选中的区域的坐标. 如 {row: 6, rowCount: 1, col: 1, colCount: 4}, 其中 row , col 为下表 count 为数量.
             * @return {Object}  返回转换后的值.
             */

            transoformSelectedValue: function(cr, chartType, sheet) {
                var _self = this;
                var result = {};
                //1 获取选中区域的值. baseData
                //2  根据策略进行清洗数据 
                //TODO 根据策略 过滤值

                return _self.getBaseData(cr, chartType, sheet);
            },


            /**
                 * @function getBaseData()
                 * @description  根据 坐标获取基础数据  
              
                 * @param {Object} cr 选中的区域的坐标. 
                 * @param {Object} sheet 当前sheet. 
                 * @return {Object}  返回转换后的值.
                    {
                        data: 选中区域的值
                        cr: 选中区域的坐标 
                        _cr:  事实 开始的坐标 第几列 第几行
                        leftTopData: 左边 和 上边的 头信息
                    }
                 */
            getBaseData: function(cr, chartType, sheet) {
                var _self = this;
                var numTest = new RegExp('^(-)?[0-9]+(\\.[0-9]{0,})?(%)?$');
                //定义一个二维数组 来保存 行列的值. 
                var tempData = [];
                var tempData_f = []; //公式
                for (var i = cr.row, i_ = 0; i < cr.row + cr.rowCount; i++, i_++) {
                    var rowData = [];
                    var rowData_f = [];
                    for (var j = cr.col, j_ = 0; j < cr.col + cr.colCount; j++, j_++) {
                        //TODO 获取值. 
                        //获取底层显示的值.  (使用场景)
                        // var tempV = sheet.getValue(i, j, 3);

                        //和显示的值保持一致 用 get Text  (使用场景： 底层value 小数点 非常多，显示值 格式化成为 2个小数点， 图表的数字应该也这样. )
                        var tempV = sheet.getText(i, j, 3);
                        if (numTest.test(tempV)) {
                            tempV = (tempV + '').replace('%', '');
                        }
                        if (amz.isDate(tempV)) {
                            tempV = _self._formatDate(tempV, 'yyyy-MM-dd');
                        }

                        //如果是隐藏了列 则 不作为基础数据. 
                        if (sheet.getColumnWidth(j) < 2) {
                            continue;
                        }
                        rowData[rowData.length] = _self.null2string(tempV);
                        rowData_f[rowData_f.length] = sheet.getFormula(i, j, 3);;
                    };
                    //如果是隐藏了行 则 不作为基础数据. 
                    if (sheet.getRowHeight(i) < 2) {
                        continue;
                    }
                    tempData[tempData.length] = rowData;
                    tempData_f[tempData_f.length] = rowData_f;
                };

                // 判断 事实(数字) 的开始坐标. 
                var _cr = _self.getNumcr(tempData, cr, tempData_f);

                //TODO 考虑 直接选中的是 事实的情况
                var cIndex = _cr.col - cr.col - 1; // 差值 -1 作为 leftTitle data开始查找的坐标
                var rIndex = _cr.row - cr.row - 1; // 差值 -1 作为 TopTitle data开始查找的坐标
                cIndex = cIndex < 0 ? 0 : cIndex;
                rIndex = rIndex < 0 ? 0 : rIndex;

                var __cr = { // 数字在选择区块的数据区内的索引
                    col: _cr.col - cr.col,
                    row: _cr.row - cr.row
                };
                var leftTopData = _self.getLeftTopDataByCR(_cr, tempData, cr, cIndex, rIndex, __cr);

                return {
                    data: tempData,
                    cr: cr,
                    _cr: _cr, // 数字在excel 区块的数据区内的索引
                    __cr: __cr, // 数字在选择区块的数据区内的索引
                    cIndex: cIndex,
                    rIndex: rIndex,
                    leftTopData: leftTopData,
                    sheet: sheet
                }
            },

            /**
             * @function getLeftTopDataByCR()
             * @description  根据 事实 的开始坐标获取 left 和 top 的数据
             * @param {Object} _cr 事实(数字) 相对于excel 的开始坐标. 
             * @param {Object} data 
             * @param {Object} cr 选择区域相对于excel 的开始坐标. 
             * @param {int} cIndex  leftTitle 相对于选择区域的开始坐标
             * @return {int}  rIndex  topTitle 相对于选择区域的开始坐标
             */

            getLeftTopDataByCR: function(_cr, data, cr, cIndex, rIndex, __cr) {
                var _self = this;
                var c = _cr.c - 1,
                    r = _cr.r - 1,
                    leftData = [],
                    topData = [];
                var rData, cData;

                //获取 topData   , 要使用 clone  否则会删除掉原本的基础数据. 
                var rData_ = amz.clone(data[rIndex]);
                var tcl = _cr.col - cr.col; // tcl 为度量值 和 开始值的差距.  //TODO 注意 选择空的时候. 
                for (var i = 0; i < tcl; i++) {
                    rData_.shift();
                };

                topData = rData_;

                //获取 leftData  (+1 是从 top的index 往下偏移一行开始)
                //2015-06-18 20:11:19 

                //如果 事实行开始于选择区域的第一行(没有 topTitle )
                var leftDataIndex = 0;
                if (__cr.row != 0) {
                    leftDataIndex = rIndex + 1;
                } else {
                    leftDataIndex = rIndex;
                }
                if (_cr.col - cr.col > 0) {
                    for (var i = leftDataIndex; i < data.length; i++) {
                        rData = data[i];
                        leftData[leftData.length] = _self.null2string(rData[cIndex]);
                    };
                }

                var lcl = _cr.row - cr.row;
                // for (var rIndex = 0; rIndex < lcl && leftData.length > 0; rIndex++) {
                //     leftData.shift();
                // };
                {
                    //如果没有 left 和 top Data 则给一些默认的值. 
                    var dataColLength = (data && data[0] && data[0].length) || 0;
                    var dataRowLength = (data && data.length) || 0;
                    var colDataCount = dataColLength - (_cr.col - cr.col);
                    var rowDataCount = dataRowLength - (_cr.row - cr.row);

                    if (leftData.length == 0) {
                        for (var k = 0; k < rowDataCount; k++) {
                            //使用 三个空格代替. ld_
                            leftData[k] = '   ' + (k + 1);
                        };
                    }
                    if (topData.length == 0) {
                        for (var k = 0; k < colDataCount; k++) {
                            topData[k] = 'td_' + (k + 1);
                        };
                    }
                }

                return {
                    leftData: leftData,
                    topData: topData
                }
            },


            getLeftTopDataByCR_multi: function(cr) {

                var _self = this;
                var baseData = _self.getBaseDatabyCr(cr);
                var topArray = [],
                    leftArray = [];
                for (var i = 0; i < baseData.__cr.row; i++) {
                    topArray[i] = baseData.data[i];
                };

                var tempArray;
                for (var j = 0; j < baseData.data.length; j++) {
                    tempArray = [];
                    for (var i = 0; i < baseData.__cr.col; i++) {
                        tempArray[i] = baseData.data[j][i];
                    };
                    leftArray.push(tempArray);
                };
                return {
                    l: leftArray,
                    t: topArray
                }
            },


            //获取 事实的开始坐标   crData_f 是单元格的公式 

            getNumcr: function(crData, CR, crData_f) {
                //数字正则
                var numTest = new RegExp('^(-)?[0-9]+(\\.[0-9]{0,})?(%)?$');


                var _self = this;
                var cr = {
                    row: 0,
                    col: 0
                }
                var rData, rData_f, t, t_f, isBreak = false,
                    isCC;
                // var isEname = false;
                for (var i = 0; i < crData.length && !isBreak; i++) {
                    rData = crData[i];
                    rData_f = crData_f[i];
                    for (var j = 0; j < rData.length && !isBreak; j++) {
                        t = rData[j];
                        t_f = rData_f[j];
                        //TODO  要格式化 % null 字符串 
                        //判断是否是 ename 公式的， 如果是 则不能作为数字
                        if ((t + "").indexOf('#') != -1) {
                            isCC = _self._isCellCompute(t_f);
                            if (isCC) {
                                t = 0;
                            };
                        };
                        if (numTest.test(t) && !((t_f + "").indexOf('ENAME') != -1)) {
                            cr.row = i;
                            cr.col = j;
                            isBreak = true;
                        } else {
                            continue;
                        }
                    };
                };
                cr.row = CR.row + cr.row;
                cr.col = CR.col + cr.col;
                return cr;
            },
            // 验证是否是单元格计算
            _isCellCompute: function(text) {
                var _self = this;
                //excel 单元格运算 正则
                var reg = new RegExp('^[A-Z]{1}([0-9]{1,})(\\+|\\-|\\*|\\/)[A-Z]{1}([0-9]{1,})$');
                try {
                    var preFix = text.substring(0, text.indexOf('!'));
                    text = text.replace(preFix, '');
                    return reg.test(text);
                } catch (e) {
                    //console.error(e);
                    return false
                }

            },

            set: function(key, value) {
                var _self = this;
                _self[key] = value;
            },
            get: function(key) {
                var _self = this;
                return _self[key];
            },


            //格式化日期
            _formatDate: function(value, fmt) {
                var date = new Date(value);
                if (isNaN(date.getFullYear())) {
                    return value;
                }
                var  o  =   {   
                    "M+" : date.getMonth()  +  1,
                      // 月份   
                    "d+" : date.getDate(),
                      // 日  
                    "h+" : date.getHours(),
                      // 小时  
                    "m+" : date.getMinutes(),
                      // 分  
                    "s+" : date.getSeconds(),
                      // 秒 
                      "q+" :  Math.floor((date.getMonth()  +  3)  /  3),
                      // 季度 
                      "S" : date.getMilliseconds()  // 毫秒 
                };
                if  (/(y+)/.test(fmt)) {
                    fmt  =  fmt.replace(RegExp.$1, (date.getFullYear()  +  "").substr(4  -  RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    }
                }
                return fmt;
            }

        })




        /**
         * 获取 组合Dialog 的模板
         */
        var getCombiDialogTemplate = function() {
            var tpl = [
                ' <div style="margin-left:10px;"></div><div id="combi_chart_demo"></div> ',

                '<div id="tabContainer" style="margin-top:20px;margin-bottom:10px;">',
                '<div class="center">',
                '<div class="div-tab-title center">',
                '<ul id="ul-tab-title">',
                '<li tab="tab-chart-setting-type" class="active"><a>类型</a></li>',
                '<li tab="tab-chart-setting-option"><a>选项</a></li>',
                '</ul>',
                '</div>',

                '<div class="combi_chart_table tab-item-con tab-chart-setting-type active"><table><thead><tr><td>系列名称</td><td>图表类型</td><td>次坐标轴</td></tr></thead>',
                '<tbody>{{each legend.data as value i}}',
                '<tr ><td class="combi_legend_temp">{{value}}</td><td><label for="bar_radio_{{i}}">柱形图: </label>  <input type="radio" class="chart_combi_radio" name="chart_radio_{{i}}" id="bar_radio_{{i}}" value="bar"/><label for="line_radio_{{i}}" style="margin-left:10px;">    曲线图: </label>  <input type="radio" class="chart_combi_radio" name="chart_radio_{{i}}" id="line_radio_{{i}}" checked="checked" value="line"/> </td><td><input type="checkbox" class="subAxis"/></td></tr>',
                ' {{/each}}</tbody>',
                '</table></div>',
                '<div class="tab-item-con tab-chart-setting-option" style="line-height: 2;margin-left:10px;"><div>',
                '<table><tr><td style="width: 80px;">主轴单位:</td><td><input type="text" id="y_unit_0"/></td></tr>',
                '<tr><td>次轴单位:</td><td><input type="text" id="y_unit_1" /></td></tr>',
                '<tr><td>主轴最小值:</td><td><input type="text" id="min_0"  /></td></tr>',
                '<tr><td>主轴最大值:</td><td><input type="text" id="max_0"  /></td></tr>',
                '<tr><td>次轴最小值:</td><td><input type="text" id="min_1"  /></td></tr>',
                '<tr><td>次轴最大值:</td><td><input type="text" id="max_1"  /></td></tr>',
                '</table>',
                '</div></div>',

                '</div>',
                '</div>'

            ].join('');
            return tpl;
        }



        return excelChart;
    });

/**
 *  备注 
 ------------------------------------------------
 *   charts[divId] = {
                     chart: myChart,
                     divId: divId,
                     chartType: chartType,
                     baseData: baseData,
                     option: option,
                     _location: {},
                     isXYChange: isFirstRenderXYChange || (fobj && fobj.isXYChange) || 0, // 当 isXYChange 为1 的时候， 则变幻xy . 
                     setting: {
                         seriesTypes: baseOption.seriesTypes, //组合模式  每个series 对应的类型. 
                         subAxisIndex: baseOption.subAxisIndex // 组合模式中 次坐标轴 在legend 中的 索引. 
                         additionalWidth: baseOption.additionalWidth // 组合模式中 次坐标轴 在legend 中的 索引. 
                     }
                 };
        
        把所有的渲染过的 chart 放到 charts 中 key value 形式存储 key 为 divId 

        _self.set('charts', charts)

         当前活动的(编辑的|点击的) chartDivId 
        _self.set('activeChartId', chartdivId);
  ------------------------------------------------  
        保存起来的 floatObject 的对象结构. 
        var fo = {
                             location: {
                                 x: o._location.x,
                                 y: o._location.y,
                                 width: o._location.width,
                                 height: o._location.height
                             },
                             divName: o._name.replace('f2_', ''),
                             type: c.chartType,
                             cr: c.baseData.cr,
                             isXYChange: c.isXYChange,
                             chartName: c.chart.getOption().title.text,
                             chartSubName: c.chart.getOption().title.subtext
                         }
------------------------------------------------

------- editorJson 相关  约定大于配置.  ---------------------------
-- 1. html 属性相关 -----
pathstr:  是用来标记 该值放在 option 的路径 位置 
plink : 如果 该标签 是有 级联的(对应上一层的数组 如: yAxis[0] 、 series[1] 等)，则指向 tab-ul 的id 
plinkV : 和 plink 联合使用 ,  值为具体的哪个数组值 如: yAxis[0] ;   [这个值和 pathstr 拼接起来作为新的 pathstr ]
beforeV: 在 值前添加前缀
afterV: 在 值前添加后缀
nocheckV: 是给 checkbox 没有选中的时候的值. 
【id:】     如: checkbox 的值为这个， 则选中后使用  value 中id 所对应dom元素的值. 
line-bar-item  :  class 名字标记 line bar  相关的 item 选项
-- 2. js 相关 方法：  -----
0.  editorChangeEvent
1.  editorJson 
2.  reloadChart
3. strongOptionByEditorJson
4. backSetEditorJson 
5. setValueByPathStr 
6. proCopy 





 */
//////
//console.info();