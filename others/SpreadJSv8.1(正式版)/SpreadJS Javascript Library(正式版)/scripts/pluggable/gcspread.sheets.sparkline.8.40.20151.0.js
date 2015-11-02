/*
 *
 * SpreadJS Library 8.40.20151.0
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 *
 * Licensed under the SpreadJS Commercial License. 
 * spread.sales@grapecity.com
 * http://spread.grapecity.com/Pages/Spread-JS-License/
 *
 *
 **/
var __extends = this.__extends || function(d, b)
    {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __()
        {
            this.constructor = d
        }
        __.prototype = b.prototype;
        d.prototype = new __
    };
var GcSpread;
(function(GcSpread)
{
    (function(Sheets)
    {
        Sheets.feature("sparkline", ["core.common", "core.theme", "core.sheet_model"]);
        var keyword_null = null,
            keyword_undefined = undefined,
            Math_min = Math.min,
            Math_floor = Math.floor,
            Math_max = Math.max,
            Math_abs = Math.abs,
            Math_PI = Math.PI,
            const_undefined = "undefined";
        var Colors = {
                Black: "black", Blue: 'Blue', Brown: 'Brown'
            };
        var Color = {FromArgb: function(a, r, g, b)
                {
                    return new Sheets._Color(a, r, g, b).toString()
                }};
        Sheets.__invalidValuePlaceHolder = {};
        function prop(readonly, obj, p, val, extra)
        {
            if (readonly)
            {
                return !extra ? obj[p] : extra.call(obj, obj[p])
            }
            var old = obj[p];
            obj[p] = val;
            if (extra)
            {
                extra.call(obj, old !== val)
            }
            return obj
        }
        function normalizeColor(color, owner)
        {
            if (owner && color)
            {
                var c = Sheets._ThemeContext.getColor(owner, color);
                if (c)
                {
                    return c
                }
            }
            return color
        }
        (function(EmptyValueStyle)
        {
            EmptyValueStyle[EmptyValueStyle["Gaps"] = 0] = "Gaps";
            EmptyValueStyle[EmptyValueStyle["Zero"] = 1] = "Zero";
            EmptyValueStyle[EmptyValueStyle["Connect"] = 2] = "Connect"
        })(Sheets.EmptyValueStyle || (Sheets.EmptyValueStyle = {}));
        var EmptyValueStyle = Sheets.EmptyValueStyle;
        (function(SparklineAxisMinMax)
        {
            SparklineAxisMinMax[SparklineAxisMinMax["individual"] = 0] = "individual";
            SparklineAxisMinMax[SparklineAxisMinMax["group"] = 1] = "group";
            SparklineAxisMinMax[SparklineAxisMinMax["custom"] = 2] = "custom"
        })(Sheets.SparklineAxisMinMax || (Sheets.SparklineAxisMinMax = {}));
        var SparklineAxisMinMax = Sheets.SparklineAxisMinMax;
        var SparklineSetting = (function()
            {
                function SparklineSetting(setting)
                {
                    var self = this;
                    if (!setting)
                    {
                        self._axisColor = Colors.Black;
                        self._firstMarkerColor = Color.FromArgb(255, 149, 179, 215);
                        self._highMarkerColor = Colors.Blue;
                        self._lastMarkerColor = Color.FromArgb(255, 149, 179, 215);
                        self._lowMarkerColor = Colors.Blue;
                        self._markersColor = Color.FromArgb(255, 36, 64, 98);
                        self._negativeColor = Colors.Brown;
                        self._seriesColor = Color.FromArgb(255, 36, 64, 98);
                        self.displayEmptyCellsAs = 0;
                        self.rightToLeft = false;
                        self.displayHidden = false;
                        self.displayXAxis = false;
                        self._showFirst = false;
                        self._showHigh = false;
                        self._showLast = false;
                        self._showLow = false;
                        self._showNegative = false;
                        self._showMarkers = false;
                        self.manualMax = 0.0;
                        self.manualMin = 0.0;
                        self.maxAxisType = 0;
                        self.minAxisType = 0;
                        self.groupMaxValue = 0;
                        self.groupMinValue = 0;
                        self.lineWeight = 1.0
                    }
                    else
                    {
                        for (var x in setting)
                        {
                            if (x)
                            {
                                self[x] = setting[x]
                            }
                        }
                    }
                    self._worksheet = keyword_null
                }
                SparklineSetting.prototype.axisColor = function(value)
                {
                    return prop(arguments.length === 0, this, '_axisColor', value)
                };
                SparklineSetting.prototype.firstMarkerColor = function(value)
                {
                    return prop(arguments.length === 0, this, '_firstMarkerColor', value)
                };
                SparklineSetting.prototype.highMarkerColor = function(value)
                {
                    return prop(arguments.length === 0, this, '_highMarkerColor', value)
                };
                SparklineSetting.prototype.lastMarkerColor = function(value)
                {
                    return prop(arguments.length === 0, this, '_lastMarkerColor', value)
                };
                SparklineSetting.prototype.lowMarkerColor = function(value)
                {
                    return prop(arguments.length === 0, this, '_lowMarkerColor', value)
                };
                SparklineSetting.prototype.markersColor = function(value)
                {
                    return prop(arguments.length === 0, this, '_markersColor', value)
                };
                SparklineSetting.prototype.negativeColor = function(value)
                {
                    return prop(arguments.length === 0, this, '_negativeColor', value)
                };
                SparklineSetting.prototype.seriesColor = function(value)
                {
                    return prop(arguments.length === 0, this, '_seriesColor', value)
                };
                SparklineSetting.prototype.showFirst = function(value)
                {
                    return prop(arguments.length === 0, this, '_showFirst', value)
                };
                SparklineSetting.prototype.showHigh = function(value)
                {
                    return prop(arguments.length === 0, this, '_showHigh', value)
                };
                SparklineSetting.prototype.showLast = function(value)
                {
                    return prop(arguments.length === 0, this, '_showLast', value)
                };
                SparklineSetting.prototype.showLow = function(value)
                {
                    return prop(arguments.length === 0, this, '_showLow', value)
                };
                SparklineSetting.prototype.showNegative = function(value)
                {
                    return prop(arguments.length === 0, this, '_showNegative', value)
                };
                SparklineSetting.prototype.showMarkers = function(value)
                {
                    return prop(arguments.length === 0, this, '_showMarkers', value)
                };
                SparklineSetting.prototype.clone = function()
                {
                    var self = this;
                    var s = new SparklineSetting;
                    s._axisColor = self._axisColor;
                    s._firstMarkerColor = self._firstMarkerColor;
                    s._highMarkerColor = self._highMarkerColor;
                    s._lastMarkerColor = self._lastMarkerColor;
                    s._lowMarkerColor = self._lowMarkerColor;
                    s._markersColor = self._markersColor;
                    s._negativeColor = self._negativeColor;
                    s._seriesColor = self._seriesColor;
                    s.displayEmptyCellsAs = self.displayEmptyCellsAs;
                    s.rightToLeft = self.rightToLeft;
                    s.displayHidden = self.displayHidden;
                    s.displayXAxis = self.displayXAxis;
                    s._showFirst = self._showFirst;
                    s._showHigh = self._showHigh;
                    s._showLast = self._showLast;
                    s._showLow = self._showLow;
                    s._showNegative = self._showNegative;
                    s._showMarkers = self._showMarkers;
                    s.manualMax = self.manualMax;
                    s.manualMin = self.manualMin;
                    s.maxAxisType = self.maxAxisType;
                    s.minAxisType = self.minAxisType;
                    s.groupMaxValue = self.groupMaxValue;
                    s.groupMinValue = self.groupMinValue;
                    s.lineWeight = self.lineWeight;
                    return s
                };
                SparklineSetting.prototype._setThemeContext = function(worksheet)
                {
                    this._worksheet = worksheet
                };
                SparklineSetting.prototype._getActualColor = function(colorType)
                {
                    var sheet = this._worksheet;
                    if (sheet)
                    {
                        return normalizeColor(this[colorType](), sheet)
                    }
                    return keyword_null
                };
                SparklineSetting.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"axisColor":
                            return value === Colors.Black;
                        case"firstMarkerColor":
                            return value === Color.FromArgb(255, 149, 179, 215);
                        case"highMarkerColor":
                            return value === Colors.Blue;
                        case"lastMarkerColor":
                            return value === Color.FromArgb(255, 149, 179, 215);
                        case"lowMarkerColor":
                            return value === Colors.Blue;
                        case"markersColor":
                            return value === Color.FromArgb(255, 36, 64, 98);
                        case"negativeColor":
                            return value === Colors.Brown;
                        case"seriesColor":
                            return value === Color.FromArgb(255, 36, 64, 98);
                        case"displayEmptyCellsAs":
                            return value === 0;
                        case"rightToLeft":
                            return value === false;
                        case"displayHidden":
                            return value === false;
                        case"displayXAxis":
                            return value === false;
                        case"showFirst":
                            return value === false;
                        case"showHigh":
                            return value === false;
                        case"showLast":
                            return value === false;
                        case"showLow":
                            return value === false;
                        case"showNegative":
                            return value === false;
                        case"showMarkers":
                            return value === false;
                        case"manualMax":
                            return value === 0.0;
                        case"manualMin":
                            return value === 0.0;
                        case"maxAxisType":
                            return value === 0;
                        case"minAxisType":
                            return value === 0;
                        case"lineWeight":
                            return value === 1;
                        default:
                            return false
                    }
                };
                SparklineSetting.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            axisColor: self._axisColor, firstMarkerColor: self._firstMarkerColor, highMarkerColor: self._highMarkerColor, lastMarkerColor: self._lastMarkerColor, lowMarkerColor: self._lowMarkerColor, markersColor: self._markersColor, negativeColor: self._negativeColor, seriesColor: self._seriesColor, displayEmptyCellsAs: self.displayEmptyCellsAs, rightToLeft: self.rightToLeft, displayHidden: self.displayHidden, displayXAxis: self.displayXAxis, showFirst: self._showFirst, showHigh: self._showHigh, showLast: self._showLast, showLow: self._showLow, showNegative: self._showNegative, showMarkers: self._showMarkers, manualMax: self.manualMax, manualMin: self.manualMin, maxAxisType: self.maxAxisType, minAxisType: self.minAxisType, lineWeight: self.lineWeight
                        };
                    var sdata = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            sdata[item] = value
                        }
                    }
                    if ($.isEmptyObject(sdata))
                    {
                        return keyword_undefined
                    }
                    return sdata
                };
                return SparklineSetting
            })();
        Sheets.SparklineSetting = SparklineSetting;
        (function(SparklineType)
        {
            SparklineType[SparklineType["line"] = 0] = "line";
            SparklineType[SparklineType["column"] = 1] = "column";
            SparklineType[SparklineType["winloss"] = 2] = "winloss"
        })(Sheets.SparklineType || (Sheets.SparklineType = {}));
        var SparklineType = Sheets.SparklineType;
        (function(DataOrientation)
        {
            DataOrientation[DataOrientation["Vertical"] = 0] = "Vertical";
            DataOrientation[DataOrientation["Horizontal"] = 1] = "Horizontal"
        })(Sheets.DataOrientation || (Sheets.DataOrientation = {}));
        var DataOrientation = Sheets.DataOrientation;
        var SparklineGroup = (function()
            {
                function SparklineGroup(type, setting)
                {
                    var self = this;
                    self.displayDateAxis = false;
                    self._sparklineGroupManager = keyword_null;
                    self._innerList = [];
                    self._axisReference = keyword_null;
                    self._axisOrientation = 1;
                    self.setting = setting;
                    self.sparklineType = type
                }
                SparklineGroup.prototype.add = function(item)
                {
                    var self = this;
                    if (item)
                    {
                        self._innerList.push(item);
                        item.group(self);
                        self._adjustGroupMaxMinValue();
                        self.onGroupChanged()
                    }
                };
                SparklineGroup.prototype.clear = function()
                {
                    var self = this;
                    if (self._innerList && self._innerList.length !== 0)
                    {
                        self._innerList = []
                    }
                };
                SparklineGroup.prototype.remove = function(item)
                {
                    var self = this;
                    Sheets.ArrayHelper.remove(self._innerList, item);
                    item.onSparklineChanged();
                    item._group = self.clone();
                    self._adjustGroupMaxMinValue();
                    self.onGroupChanged();
                    return self._innerList
                };
                SparklineGroup.prototype.contains = function(item)
                {
                    return Sheets.ArrayHelper.contains(this._innerList, item)
                };
                SparklineGroup.prototype.onGroupChanged = function()
                {
                    if (this._innerList)
                    {
                        for (var i = 0; i < this._innerList.length; i++)
                        {
                            var item = this._innerList[i];
                            if (item)
                            {
                                item.onSparklineChanged()
                            }
                        }
                    }
                };
                SparklineGroup.prototype.clone = function()
                {
                    var self = this;
                    var setting = !self.setting ? keyword_null : self.setting.clone();
                    var g = new SparklineGroup(self.sparklineType, setting);
                    g.displayDateAxis = self.displayDateAxis;
                    g._axisReference = self._axisReference;
                    g._axisOrientation = self._axisOrientation;
                    return g
                };
                SparklineGroup.prototype.dateAxisData = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return prop(true, this, '_axisReference', value)
                    }
                    else
                    {
                        return prop(false, this, '_axisReference', value, function(changed)
                            {
                                if (changed)
                                {
                                    this.onGroupChanged()
                                }
                            })
                    }
                };
                SparklineGroup.prototype.dateAxisOrientation = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return prop(true, this, '_axisOrientation', value)
                    }
                    else
                    {
                        return prop(false, this, '_axisOrientation', value, function(changed)
                            {
                                if (changed)
                                {
                                    this.onGroupChanged()
                                }
                            })
                    }
                };
                SparklineGroup.prototype.count = function()
                {
                    return this._innerList.length
                };
                SparklineGroup.prototype._adjustGroupMaxMinValue = function()
                {
                    var self = this;
                    if (!self.setting)
                    {
                        return
                    }
                    self.setting.groupMaxValue = -Number.MAX_VALUE;
                    self.setting.groupMinValue = Number.MAX_VALUE;
                    var useGroupMax = (self.setting.maxAxisType === 1);
                    var useGroupMin = (self.setting.minAxisType === 1);
                    var isNeedUpdateGroup = false;
                    if (useGroupMax || useGroupMin)
                    {
                        for (var i = 0; i < self._innerList.length; i++)
                        {
                            var sparkline = self._innerList[i];
                            var res = self._getMaxMinValues(sparkline);
                            var min = res.min;
                            var max = res.max;
                            if (useGroupMax && self.setting.groupMaxValue < max)
                            {
                                self.setting.groupMaxValue = max;
                                isNeedUpdateGroup = true
                            }
                            if (useGroupMin && self.setting.groupMinValue > min)
                            {
                                self.setting.groupMinValue = min;
                                isNeedUpdateGroup = true
                            }
                        }
                    }
                    return isNeedUpdateGroup
                };
                SparklineGroup.prototype._getMaxMinValues = function(sparkline)
                {
                    var max = -Number.MAX_VALUE;
                    var min = Number.MAX_VALUE;
                    var data = sparkline.data();
                    if (data)
                    {
                        var values = sparkline._provideValues(data, sparkline.dataOrientation(), false);
                        for (var i = 0; i < values.length; i++)
                        {
                            var val = values[i];
                            if (val === Sheets.__invalidValuePlaceHolder)
                            {
                                val = 0
                            }
                            if (typeof val === 'number')
                            {
                                var check = val;
                                max = max < check ? check : max;
                                min = min > check ? check : min
                            }
                        }
                    }
                    return {
                            min: min, max: max
                        }
                };
                SparklineGroup.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"setting":
                            return value === keyword_null;
                        case"displayDateAxis":
                            return value === false;
                        case"axisReference":
                            return value === keyword_null;
                        case"axisOrientation":
                            return value === 1;
                        case"sparklines":
                            return value.length === 0;
                        default:
                            return false
                    }
                };
                SparklineGroup.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            setting: self.setting ? self.setting.toJSON() : keyword_null, displayDateAxis: self.displayDateAxis, sparklineType: self.sparklineType, axisReference: self._axisReference, axisOrientation: self._axisOrientation, sparklines: self._innerList
                        };
                    var jsonData = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            jsonData[item] = value
                        }
                    }
                    if ($.isEmptyObject(jsonData))
                    {
                        return keyword_undefined
                    }
                    return jsonData
                };
                SparklineGroup.prototype.fromJSON = function(jsonData, isNoneSchema)
                {
                    if (!jsonData)
                    {
                        return
                    }
                    var self = this;
                    if (jsonData.setting)
                    {
                        self.setting = new SparklineSetting;
                        var jsonSetting = jsonData.setting;
                        for (var item in self.setting)
                        {
                            if (self.setting.hasOwnProperty(item))
                            {
                                if (jsonSetting.hasOwnProperty(item))
                                {
                                    self.setting[item] = jsonSetting[item]
                                }
                                else
                                {
                                    if (item.substr(0, 1) === "_")
                                    {
                                        var aliasItem = item.substr(1);
                                        if (jsonSetting.hasOwnProperty(aliasItem))
                                        {
                                            self.setting[item] = jsonSetting[aliasItem]
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (jsonData.displayDateAxis !== keyword_undefined && jsonData.displayDateAxis !== keyword_null)
                    {
                        self.displayDateAxis = jsonData.displayDateAxis
                    }
                    if (jsonData.sparklineType !== keyword_undefined && jsonData.sparklineType !== keyword_null)
                    {
                        self.sparklineType = jsonData.sparklineType
                    }
                    if (jsonData.axisReference !== keyword_undefined && jsonData.axisReference !== keyword_null)
                    {
                        self._axisReference = jsonData.axisReference
                    }
                    if (jsonData.axisOrientation !== keyword_undefined && jsonData.axisOrientation !== keyword_null)
                    {
                        self._axisOrientation = jsonData.axisOrientation
                    }
                    if (jsonData.sparklines)
                    {
                        self._innerList = [];
                        var sparklinesData = jsonData.sparklines,
                            count = sparklinesData.length;
                        for (var i = 0; i < count; i++)
                        {
                            var sp = new Sparkline;
                            sp.fromJSON(sparklinesData[i], isNoneSchema);
                            self.add(sp)
                        }
                    }
                };
                return SparklineGroup
            })();
        Sheets.SparklineGroup = SparklineGroup;
        var _PositionRect = (function()
            {
                function _PositionRect(x, y, w, h)
                {
                    var self = this;
                    self.X = x;
                    self.Y = y;
                    self.Width = w;
                    self.Height = h;
                    self.Left = self.X;
                    self.Right = self.Left + self.Width;
                    self.Top = self.Y;
                    self.Bottom = self.Y + self.Height
                }
                return _PositionRect
            })();
        Sheets._PositionRect = _PositionRect;
        var SparklineRender = (function()
            {
                function SparklineRender(sparkline)
                {
                    this._minItemHeight = 2;
                    this.info = sparkline;
                    this._clearCache()
                }
                SparklineRender.prototype.sparklineInfo = function(value)
                {
                    return prop(arguments.length === 0, this, 'info')
                };
                SparklineRender.prototype.paint = function(ctx, x, y, w, h)
                {
                    var self = this;
                    self._clearCache();
                    var sheet = self._getWorksheet(),
                        sparkline = self.info,
                        cachedValues = self._getCachedValues(),
                        cachedDatetimes = sparkline.dateAxisData() ? self._getCachedDatetimes() : [],
                        zoomFactor = sheet._zoomFactor;
                    sparkline.setting()._setThemeContext(sheet);
                    self._paintCore(ctx, x, y, w, h, cachedValues, cachedDatetimes, zoomFactor)
                };
                SparklineRender.prototype._paintCore = function(ctx, x, y, w, h, cachedValues, cachedDatetimes, zoomFactor)
                {
                    ctx.save();
                    ctx.rect(x, y, w, h);
                    ctx.clip();
                    ctx.beginPath();
                    var self = this;
                    if (self.info.sparklineType() === 0)
                    {
                        self._paintLines(ctx, x, y, w, h, cachedValues, cachedDatetimes, zoomFactor)
                    }
                    self._paintDataPoints(ctx, x, y, w, h, cachedValues, cachedDatetimes, zoomFactor);
                    self._paintAxis(ctx, x, y, w, h, cachedValues, cachedDatetimes, zoomFactor);
                    ctx.restore()
                };
                SparklineRender.prototype._clearCache = function()
                {
                    var self = this;
                    self._cachedMinDatetime = Number.MAX_VALUE;
                    self._cachedMaxDatetime = -Number.MAX_VALUE;
                    self._cachedMinValue = Number.MAX_VALUE;
                    self._cachedMaxValue = -Number.MAX_VALUE;
                    self._cachedIndexMapping = keyword_null;
                    self._cachedValues = keyword_null;
                    self._cachedDatetimes = keyword_null
                };
                SparklineRender.prototype._getWorksheet = function()
                {
                    var info = this.info,
                        group = (info && info.group()),
                        groupManager = (group && group._sparklineGroupManager);
                    if (groupManager)
                    {
                        return groupManager._sheet
                    }
                };
                SparklineRender.prototype._getSpace = function(anchor, zoomFactor)
                {
                    if (this.info.sparklineType() === 0)
                    {
                        return 3 + this._getLineWeight(zoomFactor) + 1
                    }
                    return 3
                };
                SparklineRender.prototype._leftSpace = function(zoomFactor)
                {
                    return this._getSpace('left', zoomFactor)
                };
                SparklineRender.prototype._rightSpace = function(zoomFactor)
                {
                    return this._getSpace('right', zoomFactor)
                };
                SparklineRender.prototype._topSpace = function(zoomFactor)
                {
                    return this._getSpace('top', zoomFactor)
                };
                SparklineRender.prototype._bottomSpace = function(zoomFactor)
                {
                    return this._getSpace('bottom', zoomFactor)
                };
                SparklineRender.prototype._getCachedValues = function()
                {
                    var cachedValues = this._cachedValues;
                    if (!cachedValues)
                    {
                        var info = this.info,
                            range = info.data(),
                            orientation = info.dataOrientation();
                        cachedValues = this._cachedValues = info._provideValues(range, orientation)
                    }
                    return cachedValues
                };
                SparklineRender.prototype._getCachedDatetimes = function()
                {
                    var cachedDatetimes = this._cachedDatetimes;
                    if (!cachedDatetimes)
                    {
                        var info = this.info,
                            group = info.group(),
                            range = group.dateAxisData(),
                            orientation = group.dateAxisOrientation();
                        cachedDatetimes = this._cachedDatetimes = info._provideValues(range, orientation, true)
                    }
                    return cachedDatetimes
                };
                SparklineRender.prototype._getCachedIndexMaping = function(cachedValues, cachedDatetimes)
                {
                    var cachedIndexMapping = this._cachedIndexMapping;
                    if (cachedIndexMapping)
                    {
                        return cachedIndexMapping
                    }
                    cachedIndexMapping = this._cachedIndexMapping = [];
                    var invalidValuePlaceHolder = Sheets.__invalidValuePlaceHolder,
                        valueCount = cachedValues.length,
                        i,
                        v;
                    if (this.sparklineInfo().displayDateAxis())
                    {
                        var dateAxisCount = cachedDatetimes.length,
                            count = Math_min(valueCount, dateAxisCount),
                            sorted = [];
                        if (count > 0)
                        {
                            sorted = cachedDatetimes.slice(0, count)
                        }
                        sorted.sort(function(a, b)
                        {
                            if (a === b)
                            {
                                return 0
                            }
                            if (a === invalidValuePlaceHolder)
                            {
                                a = 0
                            }
                            if (b === invalidValuePlaceHolder)
                            {
                                b = 0
                            }
                            return a - b
                        });
                        var sortedCount = sorted.length,
                            datetime,
                            valueIndex;
                        for (i = 0; i < sortedCount; i++)
                        {
                            datetime = sorted[i];
                            if (typeof(datetime) === const_undefined || datetime === keyword_null)
                            {
                                continue
                            }
                            valueIndex = Sheets.ArrayHelper.indexOf(cachedDatetimes, datetime);
                            while (Sheets.ArrayHelper.contains(cachedIndexMapping, valueIndex))
                            {
                                valueIndex = Sheets.ArrayHelper.indexOf(cachedDatetimes, datetime, valueIndex + 1)
                            }
                            if (!isNaN(datetime))
                            {
                                v = cachedValues[valueIndex];
                                if (!(v !== keyword_undefined && v !== keyword_null && isNaN(v) && v !== invalidValuePlaceHolder))
                                {
                                    cachedIndexMapping.push(valueIndex)
                                }
                            }
                        }
                    }
                    else
                    {
                        for (i = 0; i < valueCount; i++)
                        {
                            v = cachedValues[i];
                            if (!(typeof(v) !== const_undefined && v !== keyword_null && isNaN(v) && v !== invalidValuePlaceHolder))
                            {
                                cachedIndexMapping.push(i)
                            }
                        }
                    }
                    return cachedIndexMapping
                };
                SparklineRender.prototype._getValue = function(valueIndex, cachedValues)
                {
                    var item = cachedValues[valueIndex];
                    if (typeof(item) === const_undefined || item === keyword_null)
                    {
                        if (this.sparklineInfo().setting().displayEmptyCellsAs === 1)
                        {
                            item = 0
                        }
                    }
                    else if (item === Sheets.__invalidValuePlaceHolder)
                    {
                        item = 0
                    }
                    return item
                };
                SparklineRender.prototype._paintLines = function(ctx, x, y, w, h, cachedValues, cachedDatetimes, zoomFactor)
                {
                    var self = this;
                    var cachedIndexMaping = self._getCachedIndexMaping(cachedValues, cachedDatetimes),
                        i,
                        p1,
                        p2,
                        count = cachedIndexMaping.length - 1;
                    if (count < 0)
                    {
                        count = 0
                    }
                    var linePos = self.linePos = [],
                        start,
                        end,
                        endIndex,
                        startRec,
                        endRec,
                        displayEmptyCellsAs = self.sparklineInfo().setting().displayEmptyCellsAs,
                        temp,
                        d;
                    for (i = 0; i < count; i++)
                    {
                        start = self._getValue(cachedIndexMaping[i], cachedValues);
                        if (typeof(start) !== const_undefined && start !== keyword_null)
                        {
                            endIndex = i + 1;
                            end = self._getValue(cachedIndexMaping[endIndex], cachedValues);
                            if (typeof(end) === const_undefined || end === keyword_null)
                            {
                                if (displayEmptyCellsAs === 1)
                                {
                                    end = 0
                                }
                                else if (displayEmptyCellsAs === 2)
                                {
                                    for (endIndex = i + 2; endIndex <= count; endIndex++)
                                    {
                                        temp = cachedValues[cachedIndexMaping[endIndex]];
                                        if (typeof(temp) !== const_undefined && temp !== keyword_null)
                                        {
                                            end = temp;
                                            break
                                        }
                                    }
                                }
                            }
                            if (typeof(end) !== const_undefined && end !== keyword_null)
                            {
                                startRec = self._getDataPointPosition(cachedIndexMaping[i], {
                                    Width: w, Height: h
                                }, cachedValues, cachedDatetimes, zoomFactor);
                                endRec = self._getDataPointPosition(cachedIndexMaping[endIndex], {
                                    Width: w, Height: h
                                }, cachedValues, cachedDatetimes, zoomFactor);
                                d = startRec.Width / 2;
                                p1 = {
                                    X: startRec.X + d, Y: startRec.Y + d
                                };
                                p2 = {
                                    X: endRec.X + d, Y: endRec.Y + d
                                };
                                linePos[i] = {
                                    P1: p1, P2: p2
                                }
                            }
                            else
                            {
                                i++
                            }
                        }
                    }
                    var linePosCount = linePos.length,
                        line;
                    if (linePosCount > 0)
                    {
                        ctx.strokeStyle = self.info.setting()._getActualColor("seriesColor");
                        ctx.lineCap = 'round';
                        ctx.lineWidth = self._getLineWeight(zoomFactor);
                        for (i = 0; i < linePosCount; i++)
                        {
                            line = linePos[i];
                            if (!line)
                            {
                                continue
                            }
                            ctx.beginPath();
                            p1 = line.P1;
                            p2 = line.P2;
                            ctx.moveTo(x + p1.X, y + p1.Y);
                            ctx.lineTo(x + p2.X, y + p2.Y);
                            ctx.stroke();
                            ctx.closePath()
                        }
                    }
                };
                SparklineRender.prototype._getDataPointColor = function(indexInValueCache, cachedValues, cachedDatetimes)
                {
                    var self = this;
                    var ret = keyword_null,
                        MAX_VALUE = Number.MAX_VALUE,
                        MIN_VALUE = -Number.MAX_VALUE,
                        value = self._getValue(indexInValueCache, cachedValues),
                        setting = self.info.setting(),
                        cachedMinValue = self._cachedMinValue,
                        cachedMaxValue = self._cachedMaxValue,
                        cachedIndexMaping = self._getCachedIndexMaping(cachedValues, cachedDatetimes),
                        cachedIndexMapingCount = cachedIndexMaping.length,
                        info = self.info,
                        group = info.group();
                    if (typeof(value) !== const_undefined && value !== keyword_null)
                    {
                        if (cachedMinValue === Number.MAX_VALUE || cachedMaxValue === -Number.MAX_VALUE)
                        {
                            self._getMaxMinValue(cachedValues)
                        }
                        var min = cachedMinValue;
                        if (value === min && setting.showLow())
                        {
                            ret = setting._getActualColor("lowMarkerColor")
                        }
                        if (typeof(ret) === const_undefined || ret === keyword_null)
                        {
                            var max = cachedMaxValue;
                            if (value === max && setting.showHigh())
                            {
                                ret = setting._getActualColor("highMarkerColor")
                            }
                        }
                        if (typeof(ret) === const_undefined || ret === keyword_null)
                        {
                            if (group.displayDateAxis)
                            {
                                var dateIndex1 = Sheets.ArrayHelper.indexOf(cachedIndexMaping, indexInValueCache);
                                if (dateIndex1 === 0 && setting.showFirst())
                                {
                                    ret = setting._getActualColor("firstMarkerColor")
                                }
                            }
                            else
                            {
                                if (indexInValueCache === 0 && setting.showFirst())
                                {
                                    ret = setting._getActualColor("firstMarkerColor")
                                }
                            }
                        }
                        if (typeof(ret) === const_undefined || ret === keyword_null)
                        {
                            if (group.displayDateAxis)
                            {
                                var dateIndex2 = Sheets.ArrayHelper.indexOf(cachedIndexMaping, indexInValueCache);
                                if (dateIndex2 === cachedIndexMapingCount - 1 && setting.showLast())
                                {
                                    ret = setting._getActualColor("lastMarkerColor")
                                }
                            }
                            else
                            {
                                if (indexInValueCache === cachedIndexMapingCount - 1 && setting.showLast())
                                {
                                    ret = setting._getActualColor("lastMarkerColor")
                                }
                            }
                        }
                        if (typeof(ret) === const_undefined || ret === keyword_null)
                        {
                            if (value < 0 && setting.showNegative())
                            {
                                ret = setting._getActualColor("negativeColor")
                            }
                        }
                        if (typeof(ret) === const_undefined || ret === keyword_null)
                        {
                            var sparklineType = info.sparklineType();
                            if (sparklineType === 0)
                            {
                                if (setting.showMarkers())
                                {
                                    ret = setting._getActualColor("markersColor")
                                }
                            }
                            else if (sparklineType === 1)
                            {
                                ret = setting._getActualColor("seriesColor")
                            }
                            else if (sparklineType === 2)
                            {
                                ret = setting._getActualColor("seriesColor")
                            }
                        }
                    }
                    if (ret === keyword_undefined || ret === keyword_null)
                    {
                        return 'Transparent'
                    }
                    else
                    {
                        return ret
                    }
                };
                SparklineRender.prototype._paintDataPoints = function(ctx, x, y, w, h, cachedValues, cachedDatetimes, zoomFactor)
                {
                    var self = this;
                    var finalSize = {
                            Width: w, Height: h
                        },
                        cachedIndexMaping = self._getCachedIndexMaping(cachedValues, cachedDatetimes),
                        cachedIndexMapingCount = cachedIndexMaping.length,
                        spType = self.info.sparklineType(),
                        index,
                        color,
                        rec,
                        centerX,
                        centerY,
                        newX,
                        newY,
                        newWidth,
                        newHeight;
                    for (var i = 0; i < cachedIndexMapingCount; i++)
                    {
                        index = cachedIndexMaping[i];
                        color = self._getDataPointColor(index, cachedValues, cachedDatetimes);
                        rec = self._getDataPointPosition(index, finalSize, cachedValues, cachedDatetimes, zoomFactor);
                        if (ctx.fillStyle !== color)
                        {
                            ctx.fillStyle = color
                        }
                        if (spType === 0)
                        {
                            ctx.save();
                            centerX = x + rec.X + rec.Width / 2;
                            centerY = y + rec.Y + rec.Height / 2;
                            ctx.translate(centerX, centerY);
                            ctx.rotate(45 * Math_PI / 180);
                            ctx.fillRect(0 - rec.Width / 2, 0 - rec.Height / 2, rec.Width, rec.Height);
                            ctx.restore()
                        }
                        else
                        {
                            newX = x + rec.X + rec.Width / 4;
                            newX = Math_floor(newX);
                            newY = y + rec.Y;
                            newWidth = rec.Width / 2;
                            newHeight = rec.Height;
                            ctx.fillRect(newX, newY, newWidth, newHeight)
                        }
                    }
                };
                SparklineRender.prototype._paintAxis = function(ctx, x, y, w, h, cachedValues, cachedDatetimes, zoomFactor)
                {
                    var self = this;
                    var setting = self.info.setting();
                    if (!setting.displayXAxis || !self._hasAxis(cachedValues, cachedDatetimes))
                    {
                        return
                    }
                    var avalibleSize = {
                            Width: w, Height: h
                        },
                        x1 = self._leftSpace(zoomFactor),
                        x2 = avalibleSize.Width - self._rightSpace(zoomFactor),
                        y1 = Math_floor(self._getAxisY(avalibleSize, cachedValues, zoomFactor)) + 0.5,
                        y2 = y1,
                        color = setting._getActualColor('axisColor'),
                        lineWidth = zoomFactor;
                    if (lineWidth < 1)
                    {
                        lineWidth = 1
                    }
                    if (ctx.strokeStyle !== color)
                    {
                        ctx.strokeStyle = color
                    }
                    if (ctx.lineWidth !== lineWidth)
                    {
                        ctx.lineWidth = lineWidth
                    }
                    ctx.beginPath();
                    ctx.moveTo(x + x1, y + y1);
                    ctx.lineTo(x + x2, y + y2);
                    ctx.stroke()
                };
                SparklineRender.prototype._hasAxisNormal = function(cachedValues)
                {
                    var max = this._getActualMaxValue(cachedValues);
                    if (max !== -Number.MAX_VALUE)
                    {
                        var min = this._getActualMinValue(cachedValues);
                        if (min !== Number.MAX_VALUE)
                        {
                            return max === min || (max * min <= 0)
                        }
                    }
                    return true
                };
                SparklineRender.prototype._hasAxis = function(cachedValues, cachedDatetimes)
                {
                    var b = this._hasAxisNormal(cachedValues);
                    if (this.info.sparklineType() !== 2)
                    {
                        return b
                    }
                    var cachedIndexMaping = this._getCachedIndexMaping(cachedValues, cachedDatetimes),
                        cachedIndexMapingCount = cachedIndexMaping.length,
                        index,
                        item;
                    if (!b && cachedIndexMapingCount > 0)
                    {
                        for (var i = 0; i < cachedIndexMapingCount; i++)
                        {
                            index = cachedIndexMaping[i];
                            item = cachedValues[index];
                            if (typeof(item) !== const_undefined && item !== keyword_null)
                            {
                                return true
                            }
                        }
                    }
                    return b
                };
                SparklineRender.prototype._getMinDatetime = function(cachedValues, cachedDatetimes)
                {
                    var oldCachedMinDatetime = this._cachedMinDatetime;
                    if (isNaN(oldCachedMinDatetime) || oldCachedMinDatetime === Number.MAX_VALUE)
                    {
                        this._getMaxMindatetimes(cachedValues, cachedDatetimes)
                    }
                    return this._cachedMinDatetime
                };
                SparklineRender.prototype._getMaxDatetime = function(cachedValues, cachedDatetimes)
                {
                    var oldCachedMaxDatetime = this._cachedMaxDatetime;
                    if (isNaN(oldCachedMaxDatetime) || oldCachedMaxDatetime === -Number.MAX_VALUE)
                    {
                        this._getMaxMindatetimes(cachedValues, cachedDatetimes)
                    }
                    return this._cachedMaxDatetime
                };
                SparklineRender.prototype._getMaxMindatetimes = function(cachedValues, cachedDatetimes)
                {
                    var self = this;
                    var maxDatetime = new Date(0, 0, 0),
                        minDatetime = Number.MAX_VALUE,
                        cachedIndexMaping = self._getCachedIndexMaping(cachedValues, cachedDatetimes),
                        cachedIndexMapingCount = cachedIndexMaping.length,
                        index,
                        datetime,
                        v;
                    for (var i = 0; i < cachedIndexMapingCount; i++)
                    {
                        index = cachedIndexMaping[i];
                        datetime = cachedDatetimes[index];
                        if (isNaN(datetime))
                        {
                            continue
                        }
                        v = self._getValue(index, cachedValues);
                        if (v !== keyword_null && typeof(v) === const_undefined || isNaN(v))
                        {
                            continue
                        }
                        if (typeof(datetime) === const_undefined || datetime === keyword_null)
                        {
                            continue
                        }
                        if (datetime > maxDatetime)
                        {
                            maxDatetime = datetime
                        }
                        if (datetime < minDatetime)
                        {
                            minDatetime = datetime
                        }
                    }
                    self._cachedMaxDatetime = maxDatetime;
                    self._cachedMinDatetime = minDatetime
                };
                SparklineRender.prototype._calcItemWidth = function(availableSize, cachedValues, cachedDatetimes, zoomFactor)
                {
                    var self = this;
                    var min = self._getMinDatetime(cachedValues, cachedDatetimes),
                        max = self._getMaxDatetime(cachedValues, cachedDatetimes),
                        datetimeValues = [],
                        i,
                        d,
                        index,
                        cachedIndexMaping = self._getCachedIndexMaping(cachedValues, cachedDatetimes),
                        cachedIndexMapingCount = cachedIndexMaping.length;
                    for (i = 0; i < cachedIndexMapingCount; i++)
                    {
                        index = cachedIndexMaping[i];
                        d = cachedDatetimes[index];
                        if (typeof(d) === const_undefined || d === keyword_null || isNaN(d))
                        {
                            continue
                        }
                        if (!d)
                        {
                            continue
                        }
                        datetimeValues.push(d)
                    }
                    datetimeValues.sort(function(x, y)
                    {
                        return x - y
                    });
                    var valueCount = datetimeValues.length;
                    if (valueCount > 1 && min !== max)
                    {
                        var minDValue = Number.MAX_VALUE,
                            sumD = 0,
                            oa;
                        for (i = 1; i < valueCount; i++)
                        {
                            oa = datetimeValues[i];
                            d = oa - datetimeValues[i - 1];
                            if (d < minDValue && d > 0)
                            {
                                minDValue = d
                            }
                            sumD += d
                        }
                        var width = (availableSize.Width - self._leftSpace(zoomFactor) - self._rightSpace(zoomFactor)) * minDValue / sumD / 2;
                        if (width < 2)
                        {
                            width = 2
                        }
                        return width
                    }
                    else
                    {
                        return (availableSize.Width - self._leftSpace(zoomFactor) - self._rightSpace(zoomFactor)) / 2
                    }
                };
                SparklineRender.prototype._getItemWidth = function(availableSize, cachedValues, cachedDatetimes, zoomFactor)
                {
                    var self = this;
                    if (self.info.displayDateAxis())
                    {
                        return self._calcItemWidth(availableSize, cachedValues, cachedDatetimes, zoomFactor)
                    }
                    else
                    {
                        var count = self._getCachedIndexMaping(cachedValues, cachedDatetimes).length;
                        return ((availableSize.Width - self._leftSpace(zoomFactor) - self._rightSpace(zoomFactor)) / count)
                    }
                };
                SparklineRender.prototype._getItemX = function(availableSize, index, cachedValues, cachedDatetimes, zoomFactor)
                {
                    var self = this;
                    var itemWidth,
                        leftSpace = self._leftSpace(zoomFactor);
                    if (self.sparklineInfo().displayDateAxis())
                    {
                        itemWidth = self._getItemWidth(availableSize, cachedValues, cachedDatetimes, zoomFactor);
                        var max = self._getMaxDatetime(cachedValues, cachedDatetimes),
                            min = self._getMinDatetime(cachedValues, cachedDatetimes);
                        if (max === min)
                        {
                            return leftSpace + itemWidth / 2
                        }
                        var datetime = cachedDatetimes[index];
                        if (!datetime)
                        {
                            return 0
                        }
                        var canvasWidth = availableSize.Width - leftSpace - self._rightSpace(zoomFactor);
                        canvasWidth -= itemWidth;
                        var range = (max - min);
                        return leftSpace + Math_floor(((datetime - min) / range) * canvasWidth)
                    }
                    else
                    {
                        itemWidth = self._getItemWidth(availableSize, cachedValues, cachedDatetimes, zoomFactor);
                        var valueIndex = Sheets.ArrayHelper.indexOf(self._getCachedIndexMaping(cachedValues, cachedDatetimes), index),
                            x = leftSpace + itemWidth * valueIndex;
                        return Math_floor(x)
                    }
                };
                SparklineRender.prototype._getCanvasSize = function(availableSize, zoomFactor)
                {
                    var self = this;
                    var w = availableSize.Width - self._leftSpace(zoomFactor) - self._rightSpace(zoomFactor);
                    w = Math_max(w, 0);
                    var h = availableSize.Height - self._topSpace(zoomFactor) - self._bottomSpace(zoomFactor);
                    h = Math_max(h, 0);
                    return {
                            Width: w, Height: h
                        }
                };
                SparklineRender.prototype._getMaxMinValue = function(cachedValues)
                {
                    var self = this;
                    var valueCount = cachedValues.length,
                        item;
                    for (var i = 0; i < valueCount; i++)
                    {
                        item = cachedValues[i];
                        if (typeof(item) !== const_undefined && item !== keyword_null)
                        {
                            if (typeof item !== 'number')
                            {
                                item = 0
                            }
                            if (item < self._cachedMinValue)
                            {
                                self._cachedMinValue = item
                            }
                            if (item > self._cachedMaxValue)
                            {
                                self._cachedMaxValue = item
                            }
                        }
                    }
                };
                SparklineRender.prototype._getActualMaxValue = function(cachedValues)
                {
                    var self = this;
                    if (self._cachedMaxValue === -Number.MAX_VALUE || !self._cachedMaxValue)
                    {
                        self._getMaxMinValue(cachedValues)
                    }
                    var setting = self.info.setting(),
                        maxAxisType = setting.maxAxisType;
                    if (maxAxisType === 0)
                    {
                        return self._cachedMaxValue
                    }
                    else if (maxAxisType === 1)
                    {
                        return setting.groupMaxValue
                    }
                    else if (maxAxisType === 2)
                    {
                        return setting.manualMax
                    }
                    return self._cachedMaxValue
                };
                SparklineRender.prototype._getActualMinValue = function(cachedValues)
                {
                    var self = this;
                    if (self._cachedMinValue === Number.MAX_VALUE || !self._cachedMinValue)
                    {
                        self._getMaxMinValue(cachedValues)
                    }
                    var setting = self.info.setting(),
                        maxAxisType = setting.minAxisType;
                    if (maxAxisType === 0)
                    {
                        return self._cachedMinValue
                    }
                    else if (maxAxisType === 1)
                    {
                        return setting.groupMinValue
                    }
                    else if (maxAxisType === 2)
                    {
                        return setting.manualMin
                    }
                };
                SparklineRender.prototype._getItemHeightNormal = function(availableSize, index, cachedValues, zoomFactor)
                {
                    var size = this._getCanvasSize(availableSize, zoomFactor),
                        max = this._getActualMaxValue(cachedValues),
                        min = this._getActualMinValue(cachedValues),
                        range = max - min,
                        value,
                        d;
                    if (max === min)
                    {
                        if (max === 0)
                        {
                            return 0
                        }
                        range = Math_abs(max)
                    }
                    value = cachedValues[index];
                    if (!value)
                    {
                        value = 0
                    }
                    d = size.Height / range;
                    return (value) * d
                };
                SparklineRender.prototype._getItemHeight = function(availableSize, index, cachedValues, zoomFactor)
                {
                    var self = this;
                    var info = self.info,
                        sparklineType = info.sparklineType(),
                        value;
                    if (sparklineType === 0)
                    {
                        return self._getItemHeightNormal(availableSize, index, cachedValues, zoomFactor)
                    }
                    else if (sparklineType === 1)
                    {
                        value = cachedValues[index];
                        if (typeof(value) === const_undefined || value === keyword_null)
                        {
                            if (info.setting().displayEmptyCellsAs === 1)
                            {
                                return 0
                            }
                        }
                        var h = self._getItemHeightNormal(availableSize, index, cachedValues, zoomFactor);
                        if (h > -self._minItemHeight && h < self._minItemHeight)
                        {
                            if (value > 0)
                            {
                                return h + self._minItemHeight
                            }
                            else if (value < 0)
                            {
                                return h - self._minItemHeight
                            }
                        }
                        return h
                    }
                    else if (sparklineType === 2)
                    {
                        value = cachedValues[index];
                        if (typeof(value) === const_undefined || value === keyword_null || value === 0 || isNaN(value))
                        {
                            return 0
                        }
                        var size = self._getCanvasSize(availableSize, zoomFactor);
                        if (value >= 0)
                        {
                            return size.Height / 2
                        }
                        else
                        {
                            return -size.Height / 2
                        }
                    }
                };
                SparklineRender.prototype._getAxisYNormal = function(availableSize, cachedValues, zoomFactor)
                {
                    var self = this;
                    var size = self._getCanvasSize(availableSize, zoomFactor),
                        max = self._getActualMaxValue(cachedValues),
                        min = self._getActualMinValue(cachedValues);
                    if (max === -Number.MAX_VALUE || min === Number.MAX_VALUE)
                    {
                        return availableSize.Height / 2
                    }
                    var range = max - min;
                    if (max === min)
                    {
                        if (max === 0)
                        {
                            return availableSize.Height / 2
                        }
                        range = max;
                        if (max < 0)
                        {
                            max = 0
                        }
                    }
                    var d = size.Height / range;
                    return self._topSpace(zoomFactor) + max * d
                };
                SparklineRender.prototype._getAxisY = function(availableSize, cachedValues, zoomFactor)
                {
                    if (this.info.sparklineType() === 2)
                    {
                        return availableSize.Height / 2
                    }
                    return this._getAxisYNormal(availableSize, cachedValues, zoomFactor)
                };
                SparklineRender.prototype._getItemVisibleHeightNormal = function(availableSize, index, cachedValues, zoomFactor)
                {
                    var self = this;
                    var size = self._getCanvasSize(availableSize, zoomFactor),
                        max = self._getActualMaxValue(cachedValues),
                        min = self._getActualMinValue(cachedValues),
                        range = max - min,
                        d,
                        value;
                    if (max === min)
                    {
                        if (max === 0)
                        {
                            return 0
                        }
                        range = max
                    }
                    d = size.Height / range;
                    value = self._getValue(index, cachedValues);
                    if (typeof(value) === const_undefined || value === keyword_null)
                    {
                        value = 0
                    }
                    if (max !== min && max * min > 0)
                    {
                        var visibleHeight = 0;
                        if (value >= 0)
                        {
                            visibleHeight = (value - min) * d
                        }
                        else
                        {
                            visibleHeight = (value - max) * d
                        }
                        return visibleHeight
                    }
                    else
                    {
                        return (value) * d
                    }
                };
                SparklineRender.prototype._getItemVisibleHeight = function(availableSize, index, cachedValues, zoomFactor)
                {
                    var self = this;
                    var sparklineType = self.info.sparklineType();
                    if (sparklineType === 0)
                    {
                        return self._getItemVisibleHeightNormal(availableSize, index, cachedValues, zoomFactor)
                    }
                    else if (sparklineType === 1)
                    {
                        var h = self._getItemVisibleHeightNormal(availableSize, index, cachedValues, zoomFactor),
                            minItemHeight = self._minItemHeight;
                        if (h > -minItemHeight && h < minItemHeight)
                        {
                            var value = self._getValue(index, cachedValues);
                            if (typeof(value) === const_undefined || value === keyword_null)
                            {
                                value = 0
                            }
                            if (value !== 0)
                            {
                                if (value > 0)
                                {
                                    return h + minItemHeight
                                }
                                else
                                {
                                    return h - minItemHeight
                                }
                            }
                        }
                        return h
                    }
                    else if (sparklineType === 2)
                    {
                        return self._getItemHeight(availableSize, index, cachedValues, zoomFactor)
                    }
                };
                SparklineRender.prototype._getDataPointPositionNormal = function(index, availableSize, cachedValues, cachedDatetimes, zoomFactor)
                {
                    var self = this;
                    var itemWidth = self._getItemWidth(availableSize, cachedValues, cachedDatetimes, zoomFactor),
                        x = self._getItemX(availableSize, index, cachedValues, cachedDatetimes, zoomFactor);
                    if (itemWidth < 0)
                    {
                        itemWidth = 0
                    }
                    itemWidth = Math_floor(itemWidth);
                    if (itemWidth % 2 === 1)
                    {
                        itemWidth += 1
                    }
                    var height = self._getItemHeight(availableSize, index, cachedValues, zoomFactor),
                        axis = self._getAxisY(availableSize, cachedValues, zoomFactor),
                        max = self._getActualMaxValue(cachedValues),
                        min = self._getActualMinValue(cachedValues),
                        y = 0;
                    if (max < 0 && min < 0)
                    {
                        y = Math_max(self._topSpace(zoomFactor), axis)
                    }
                    else
                    {
                        y = axis;
                        if (height >= 0)
                        {
                            y = axis - height
                        }
                    }
                    var visibleHeight = self._getItemVisibleHeight(availableSize, index, cachedValues, zoomFactor),
                        rect = new _PositionRect(x, y, itemWidth, Math_abs(visibleHeight));
                    if (height !== 0)
                    {
                        var topSpace = self._topSpace(zoomFactor);
                        if (rect.Y < topSpace && rect.Bottom < topSpace + 1)
                        {
                            rect.Height = Math_floor(rect.Height + 1)
                        }
                        else
                        {
                            var bottomLine = availableSize.Height - self._bottomSpace(zoomFactor);
                            if (rect.Bottom > bottomLine && rect.Y > bottomLine - 1)
                            {
                                rect.Y = bottomLine - visibleHeight;
                                rect.Height = visibleHeight
                            }
                        }
                    }
                    return rect
                };
                SparklineRender.prototype._getLineWeight = function(zoomFactor)
                {
                    var lineWeight = this.info.setting().lineWeight * zoomFactor;
                    if (lineWeight < 1)
                    {
                        lineWeight = 1
                    }
                    return lineWeight
                };
                SparklineRender.prototype._getDataPointPosition = function(index, availableSize, cachedValues, cachedDatetimes, zoomFactor)
                {
                    var self = this;
                    var lineWeight = self._getLineWeight(zoomFactor);
                    lineWeight++;
                    if (lineWeight < 2)
                    {
                        lineWeight = 2
                    }
                    var rec = self._getDataPointPositionNormal(index, availableSize, cachedValues, cachedDatetimes, zoomFactor);
                    if (self.info.sparklineType() === 0)
                    {
                        rec.X = rec.X + (rec.Width - lineWeight) / 2;
                        var value = self._getValue(index, cachedValues);
                        if (typeof(value) !== const_undefined && value !== keyword_null)
                        {
                            if (value >= 0)
                            {
                                rec.Y -= lineWeight / 2
                            }
                            else
                            {
                                rec.Y = rec.Bottom - lineWeight / 2
                            }
                            rec.Width = lineWeight;
                            rec.Height = lineWeight
                        }
                        else
                        {
                            rec.Width = 0;
                            rec.Height = 0
                        }
                    }
                    if (self.info.group().setting.rightToLeft)
                    {
                        var left = rec.X,
                            reverseLeft = availableSize.Width - left,
                            newLeft = reverseLeft - rec.Width;
                        rec = new _PositionRect(newLeft, rec.Y, rec.Width, rec.Height)
                    }
                    return rec
                };
                return SparklineRender
            })();
        Sheets.SparklineRender = SparklineRender;
        function _getCount(range, orientation)
        {
            if (orientation === 1)
            {
                return range.colCount
            }
            else
            {
                return range.rowCount
            }
        }
        function _getValue(worksheet, i, range, orientation)
        {
            if (orientation === 1)
            {
                return worksheet.getValue(range.row, range.col + i)
            }
            else
            {
                return worksheet.getValue(range.row + i, range.col)
            }
        }
        function _isHidden(worksheet, i, range, orientation)
        {
            if (orientation === 1)
            {
                return worksheet.getColumnWidth(range.col + i) <= 0 || worksheet.getRowHeight(range.row) <= 0
            }
            else
            {
                return worksheet.getRowHeight(range.row + i) <= 0 || worksheet.getColumnWidth(range.col) <= 0
            }
        }
        var Sparkline = (function()
            {
                function Sparkline(row, column, dataReference, dataOrientation, type, setting)
                {
                    var self = this;
                    self.row = row;
                    self.column = column;
                    self._dataOrientation = dataOrientation;
                    self._data = dataReference;
                    self._group = new SparklineGroup(type, setting);
                    self._group.add(self);
                    self._renderer = new SparklineRender(self)
                }
                Sparkline.prototype.group = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        var g = self._group;
                        if (!g)
                        {
                            g = new SparklineGroup;
                            g.add(self);
                            self._group = g
                        }
                        return g
                    }
                    else
                    {
                        if (value !== self._group)
                        {
                            if (self._group)
                            {
                                self._group.remove(self)
                            }
                            self._group = value;
                            if (self._group)
                            {
                                if (!self._group.contains(self))
                                {
                                    self._group.add(self)
                                }
                            }
                            self.onSparklineChanged()
                        }
                        return self
                    }
                };
                Sparkline.prototype.sparklineType = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self.group().sparklineType
                    }
                    else
                    {
                        if (self.group().sparklineType !== value)
                        {
                            self.group().sparklineType = value;
                            self.onSparklineChanged()
                        }
                        return self
                    }
                };
                Sparkline.prototype.onSparklineChanged = function()
                {
                    var sheet = this._getWorksheet();
                    if (sheet)
                    {
                        var self = this;
                        sheet.triggerSparklineChanged({
                            sheet: sheet, sheetName: sheet._name, sparkline: self
                        })
                    }
                };
                Sparkline.prototype.setting = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this.group().setting
                    }
                    else
                    {
                        this.group().setting = value;
                        return this
                    }
                };
                Sparkline.prototype.data = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._data
                    }
                    else
                    {
                        if (self._data !== value)
                        {
                            self._data = value;
                            self.onSparklineChanged()
                        }
                        return self
                    }
                };
                Sparkline.prototype.dataOrientation = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._dataOrientation
                    }
                    else
                    {
                        if (self._dataOrientation !== value)
                        {
                            self._dataOrientation = value;
                            self.onSparklineChanged()
                        }
                        return self
                    }
                };
                Sparkline.prototype.dateAxisData = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this.group().dateAxisData()
                    }
                    else
                    {
                        this.group().dateAxisData(value);
                        return this
                    }
                };
                Sparkline.prototype.dateAxisOrientation = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this.group().dateAxisOrientation()
                    }
                    else
                    {
                        this.group().dateAxisOrientation(value);
                        return this
                    }
                };
                Sparkline.prototype.displayDateAxis = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this.group().displayDateAxis
                    }
                    else
                    {
                        this.group().displayDateAxis = value;
                        return this
                    }
                };
                Sparkline.prototype.clone = function()
                {
                    var self = this;
                    var s = new Sparkline;
                    s.row = self.row;
                    s.column = self.column;
                    s.data(self.data());
                    s.dataOrientation(self.dataOrientation());
                    s.group(self.group().clone());
                    return s
                };
                Sparkline.prototype.paintSparkline = function(ctx, x, y, w, h)
                {
                    this._renderer.paint(ctx, x, y, w, h)
                };
                Sparkline.prototype._provideValues = function(range, orientation, isDatetime)
                {
                    var worksheet = this._getWorksheet();
                    var ret = [];
                    if (!worksheet)
                    {
                        return ret
                    }
                    var count = _getCount(range, orientation);
                    for (var i = 0; i < count; i++)
                    {
                        var value = _getValue(worksheet, i, range, orientation);
                        if (!this.setting().displayHidden && _isHidden(worksheet, i, range, orientation))
                        {
                            value = NaN
                        }
                        else
                        {
                            if (value !== keyword_null && value !== keyword_undefined)
                            {
                                if (isDatetime)
                                {
                                    if (typeof value === 'number')
                                    {
                                        value = Sheets._DateTimeHelper.fromOADate(value)
                                    }
                                    else
                                    {
                                        value = Date.parse(value)
                                    }
                                }
                                else if (typeof value !== 'number')
                                {
                                    value = Sheets.__invalidValuePlaceHolder
                                }
                            }
                        }
                        ret.push(value)
                    }
                    return ret
                };
                Sparkline.prototype._getWorksheet = function()
                {
                    return (this.group() && this.group()._sparklineGroupManager) ? this.group()._sparklineGroupManager._sheet : keyword_null
                };
                Sparkline.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"axisReference":
                            return value === keyword_null;
                        case"axisOrientation":
                            return value === 1;
                        default:
                            return false
                    }
                };
                Sparkline.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            row: self.row, col: self.column, orientation: self._dataOrientation, data: self._data, type: self._group.sparklineType, setting: self._group.setting, axisReference: self._group._axisReference, axisOrientation: self._group._axisOrientation
                        };
                    var sdata = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            sdata[item] = value
                        }
                    }
                    return sdata
                };
                Sparkline.prototype.fromJSON = function(jsonData, isNoneSchema)
                {
                    if (!jsonData)
                    {
                        return
                    }
                    var self = this;
                    if (jsonData.row !== keyword_undefined && jsonData.row !== keyword_null)
                    {
                        self.row = jsonData.row
                    }
                    if (jsonData.col !== keyword_undefined && jsonData.col !== keyword_null)
                    {
                        self.column = jsonData.col
                    }
                    if (jsonData.orientation !== keyword_undefined && jsonData.orientation !== keyword_null)
                    {
                        self._dataOrientation = jsonData.orientation
                    }
                    if (jsonData.data)
                    {
                        var cr = jsonData.data;
                        self._data = new Sheets.Range(cr.row, cr.col, cr.rowCount, cr.colCount)
                    }
                };
                return Sparkline
            })();
        Sheets.Sparkline = Sparkline;
        var WorksheetSparklineGroupManager = (function()
            {
                function WorksheetSparklineGroupManager(sheet, calcEvaluator)
                {
                    this._groups = [];
                    this._sheet = sheet;
                    this.evaluator = calcEvaluator
                }
                WorksheetSparklineGroupManager.prototype.groups = function(value)
                {
                    return prop(arguments.length === 0, this, '_groups')
                };
                WorksheetSparklineGroupManager.prototype.add = function(group)
                {
                    this.groups().push(group);
                    group._sparklineGroupManager = this;
                    group._adjustGroupMaxMinValue()
                };
                WorksheetSparklineGroupManager.prototype.remove = function(group)
                {
                    Sheets.ArrayHelper.remove(this.groups(), group)
                };
                WorksheetSparklineGroupManager.prototype.contains = function(group)
                {
                    return Sheets.ArrayHelper.contains(this.groups(), group)
                };
                WorksheetSparklineGroupManager.prototype.count = function()
                {
                    return this.groups().length
                };
                WorksheetSparklineGroupManager.prototype._addRows = function(row, count)
                {
                    var self = this;
                    for (var i = 0; i < self._groups.length; i++)
                    {
                        var g = self._groups[i];
                        if (g.displayDateAxis)
                        {
                            var dateAxis = self._addRowRange(row, count, g.dateAxisData());
                            g.dateAxisData(dateAxis)
                        }
                        for (var j = 0; j < g._innerList.length; j++)
                        {
                            var sparkline = g._innerList[j];
                            if (row <= sparkline.row)
                            {
                                sparkline.row += count
                            }
                            var data = self._addRowRange(row, count, sparkline.data());
                            sparkline.data(data)
                        }
                    }
                };
                WorksheetSparklineGroupManager.prototype._addColumns = function(column, count)
                {
                    var self = this;
                    for (var i = 0; i < self._groups.length; i++)
                    {
                        var g = self._groups[i];
                        if (g.displayDateAxis)
                        {
                            var dateAxis = self._addColumnRange(column, count, g.dateAxisData());
                            g.dateAxisData(dateAxis)
                        }
                        for (var j = 0; j < g._innerList.length; j++)
                        {
                            var sparkline = g._innerList[j];
                            if (column <= sparkline.column)
                            {
                                sparkline.column += count
                            }
                            var data = self._addColumnRange(column, count, sparkline.data());
                            sparkline.data(data)
                        }
                    }
                };
                WorksheetSparklineGroupManager.prototype._removeRows = function(row, count)
                {
                    var self = this;
                    for (var i = 0; i < self._groups.length; i++)
                    {
                        var g = self._groups[i];
                        if (g.displayDateAxis)
                        {
                            var dateAxis = self._removeRowRange(row, count, g.dateAxisData());
                            if (dateAxis !== keyword_null && dateAxis !== keyword_undefined)
                            {
                                g.dateAxisData(dateAxis)
                            }
                            else
                            {
                                g.clear();
                                self.remove(g);
                                continue
                            }
                        }
                        var lines = [];
                        lines = lines.concat(g._innerList);
                        for (var j = 0; j < lines.length; j++)
                        {
                            var sparkline = lines[j];
                            if (sparkline.row >= row && sparkline.row < row + count)
                            {
                                g.remove(sparkline)
                            }
                            else
                            {
                                if (row <= sparkline.row)
                                {
                                    sparkline.row -= count
                                }
                                var data = self._removeRowRange(row, count, sparkline.data());
                                if (data !== keyword_null && data !== keyword_undefined)
                                {
                                    sparkline.data(data)
                                }
                                else
                                {
                                    g.remove(sparkline)
                                }
                            }
                        }
                        if (g.count() <= 0)
                        {
                            self.remove(g)
                        }
                    }
                };
                WorksheetSparklineGroupManager.prototype._removeColumns = function(column, count)
                {
                    var self = this;
                    for (var i = 0; i < self._groups.length; i++)
                    {
                        var g = self._groups[i];
                        if (g.displayDateAxis)
                        {
                            var dateAxis = self._removeColumnRange(column, count, g.dateAxisData());
                            if (dateAxis !== keyword_null && dateAxis !== keyword_undefined)
                            {
                                g.dateAxisData(dateAxis)
                            }
                            else
                            {
                                g.clear();
                                self.remove(g);
                                continue
                            }
                        }
                        var lines = [];
                        lines = lines.concat(g._innerList);
                        for (var j = 0; j < lines.length; j++)
                        {
                            var sparkline = lines[j];
                            if (sparkline.column >= column && sparkline.column < column + count)
                            {
                                g.remove(sparkline)
                            }
                            else
                            {
                                if (column <= sparkline.column)
                                {
                                    sparkline.column -= count
                                }
                                var data = self._removeColumnRange(column, count, sparkline.data());
                                if (data !== keyword_null && data !== keyword_undefined)
                                {
                                    sparkline.data(data)
                                }
                                else
                                {
                                    g.remove(sparkline)
                                }
                            }
                        }
                        if (g.count() <= 0)
                        {
                            self.remove(g)
                        }
                    }
                };
                WorksheetSparklineGroupManager.prototype.clear = function(row, column, rowCount, columnCount)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        for (var i = 0; i < self._groups.length; i++)
                        {
                            var item = self._groups[i];
                            if (item)
                            {
                                item.SparklineGroupManager = keyword_null
                            }
                        }
                        self._groups = [];
                        return
                    }
                    for (var r = row; r < row + rowCount; r++)
                    {
                        for (var c = column; c < column + columnCount; c++)
                        {
                            var sparkline = self._find(r, c);
                            if (sparkline)
                            {
                                var g = sparkline.group();
                                g.remove(sparkline);
                                if (g.count() === 0)
                                {
                                    self.remove(g)
                                }
                            }
                        }
                    }
                };
                WorksheetSparklineGroupManager.prototype._find = function(row, column)
                {
                    for (var i = 0; i < this._groups.length; i++)
                    {
                        var g = this._groups[i];
                        for (var j = 0; j < g.count(); j++)
                        {
                            var si = g[j];
                            if (si && si.row === row && si.column === column)
                            {
                                return si
                            }
                        }
                    }
                    return keyword_null
                };
                WorksheetSparklineGroupManager.prototype._copy = function(fromRow, fromColumn, toRow, toColumn, rowCount, columnCount, ignoreFilteredOutRow)
                {
                    var self = this;
                    var sheet = self._sheet;
                    if (!sheet)
                    {
                        return
                    }
                    var savedSparkline = new Sheets._GcSheetModel(rowCount, columnCount, keyword_null);
                    var offsetRow = toRow - fromRow;
                    var offsetColumn = toColumn - fromColumn;
                    var m = sheet._getModel(),
                        i,
                        j,
                        sheetRowCount = sheet.getRowCount(),
                        sheetColumnCount = sheet.getColumnCount();
                    for (i = 0; i < rowCount; i++)
                    {
                        if (ignoreFilteredOutRow && sheet.isRowFilterOut(toRow + i))
                        {
                            continue
                        }
                        for (j = 0; j < columnCount; j++)
                        {
                            var sparkline = m.getSparkline(fromRow + i, fromColumn + j);
                            if (sparkline)
                            {
                                var newSparkline = sparkline.clone();
                                newSparkline.row = toRow + i;
                                newSparkline.column = toColumn + j;
                                var dateAxisRef = newSparkline.dateAxisData();
                                if (dateAxisRef !== keyword_null && dateAxisRef !== keyword_undefined)
                                {
                                    if (self._canOffset(dateAxisRef, offsetRow, offsetColumn, sheetRowCount, sheetColumnCount))
                                    {
                                        newSparkline.dateAxisData(dateAxisRef.offset(offsetColumn, offsetRow))
                                    }
                                }
                                var dataRef = newSparkline.data();
                                if (dataRef !== keyword_undefined && dataRef !== keyword_null)
                                {
                                    if (self._canOffset(dataRef, offsetRow, offsetColumn, sheetRowCount, sheetColumnCount))
                                    {
                                        newSparkline.data(dataRef.offset(offsetColumn, offsetRow))
                                    }
                                }
                                self.add(newSparkline.group());
                                savedSparkline.setValue(i, j, newSparkline)
                            }
                        }
                    }
                    for (i = 0; i < rowCount; i++)
                    {
                        if (ignoreFilteredOutRow && sheet.isRowFilterOut(toRow + i))
                        {
                            continue
                        }
                        for (j = 0; j < columnCount; j++)
                        {
                            m.setSparkline(toRow + i, toColumn + j, savedSparkline.getValue(i, j))
                        }
                    }
                };
                WorksheetSparklineGroupManager.prototype._canOffset = function(exp, offsetRow, offsetColumn, MAX_ROW_COUNT, MAX_COLUMN_COUNT)
                {
                    var dataRange = this._getExpressionRange(exp);
                    if (dataRange)
                    {
                        var row = dataRange.row < 0 ? 0 : dataRange.row;
                        var column = dataRange.col < 0 ? 0 : dataRange.col;
                        var rowCount = dataRange.row < 0 ? MAX_ROW_COUNT : dataRange.rowCount;
                        var columnCount = dataRange.col < 0 ? MAX_COLUMN_COUNT : dataRange.colCount;
                        return !(row + offsetRow < 0 || column + offsetColumn < 0 || row + rowCount + offsetRow > MAX_ROW_COUNT || column + columnCount + offsetColumn > MAX_COLUMN_COUNT)
                    }
                    return false
                };
                WorksheetSparklineGroupManager.prototype._move = function(fromRow, fromColumn, toRow, toColumn, rowCount, columnCount)
                {
                    var sheet = this._sheet;
                    if (!sheet)
                    {
                        return
                    }
                    this._moveDataRange(fromRow, fromColumn, toRow, toColumn, rowCount, columnCount);
                    var m = sheet._getModel();
                    var savedSparkline = new Sheets._GcSheetModel(rowCount, columnCount, keyword_null);
                    var i,
                        j;
                    for (i = 0; i < rowCount; i++)
                    {
                        for (j = 0; j < columnCount; j++)
                        {
                            var sparkline = m.getSparkline(fromRow + i, fromColumn + j);
                            if (sparkline)
                            {
                                sparkline.row = toRow + i;
                                sparkline.column = toColumn + j;
                                savedSparkline.setValue(i, j, sparkline)
                            }
                            m.setSparkline(fromRow + i, fromColumn + j, keyword_null)
                        }
                    }
                    for (i = 0; i < rowCount; i++)
                    {
                        for (j = 0; j < columnCount; j++)
                        {
                            m.setSparkline(toRow + i, toColumn + j, savedSparkline.getValue(i, j))
                        }
                    }
                };
                WorksheetSparklineGroupManager.prototype._moveDataRange = function(fromRow, fromColumn, toRow, toColumn, rowCount, columnCount)
                {
                    var self = this;
                    var moveRange = new Sheets.Range(fromRow, fromColumn, rowCount, columnCount);
                    var offsetRow = toRow - fromRow;
                    fromRow;
                    var offsetColumn = toColumn - fromColumn;
                    for (var i = 0; i < self._groups.length; i++)
                    {
                        var g = self._groups[i];
                        for (var j = 0; j < g._innerList.length; j++)
                        {
                            var sparkline = g._innerList[j];
                            if (!sparkline)
                            {
                                continue
                            }
                            var dateAxisRef = sparkline.dateAxisData();
                            var dateAxisRange = self._getExpressionRange(dateAxisRef);
                            if (dateAxisRange)
                            {
                                if (moveRange.containsRange(dateAxisRange) && moveRange.contains(sparkline.row, sparkline.column))
                                {
                                    sparkline.dateAxisData(dateAxisRef.offset(offsetColumn, offsetRow))
                                }
                            }
                            var dataRef = sparkline.data();
                            var dataRange = self._getExpressionRange(dataRef);
                            if (dataRange)
                            {
                                if (moveRange.containsRange(dataRange) && moveRange.contains(sparkline.row, sparkline.column))
                                {
                                    sparkline.data(dataRef.offset(offsetColumn, offsetRow))
                                }
                            }
                        }
                    }
                };
                WorksheetSparklineGroupManager.prototype._getExpressionRange = function(exp)
                {
                    return exp
                };
                WorksheetSparklineGroupManager.prototype._swap = function(fromRow, fromColumn, toRow, toColumn, rowCount, columnCount){};
                WorksheetSparklineGroupManager.prototype._exCopy = function(src, fromRow, fromColumn, toRow, toColumn, rowCount, columnCount, ignoreFilteredOutRow)
                {
                    var self = this;
                    var sheet = self._sheet;
                    if (!sheet)
                    {
                        return
                    }
                    if (src === sheet)
                    {
                        self._copy(fromRow, fromColumn, toRow, toColumn, rowCount, columnCount);
                        return
                    }
                    var offsetRow = toRow - fromRow;
                    var offsetColumn = toColumn - fromColumn;
                    var srcModel = src._getModel();
                    var destModel = sheet._getModel();
                    var sheetRowCount = sheet.getRowCount(),
                        sheetColumnCount = sheet.getColumnCount();
                    for (var i = 0; i < rowCount; i++)
                    {
                        if (ignoreFilteredOutRow && sheet.isRowFilterOut(toRow + i))
                        {
                            continue
                        }
                        for (var j = 0; j < columnCount; j++)
                        {
                            var sparkline = srcModel.getSparkline(fromRow + i, fromColumn + j);
                            if (sparkline)
                            {
                                var newSparkline = sparkline.clone();
                                newSparkline.row = toRow + i;
                                newSparkline.column = toColumn + j;
                                var dateAxisRef = newSparkline.dateAxisData();
                                if (dateAxisRef !== keyword_undefined && dateAxisRef !== keyword_null)
                                {
                                    if (self._canOffset(dateAxisRef, offsetRow, offsetColumn, sheetRowCount, sheetColumnCount))
                                    {
                                        newSparkline.dateAxisData(dateAxisRef.offset(offsetColumn, offsetRow))
                                    }
                                }
                                var dataRef = newSparkline.data();
                                if (dataRef !== keyword_undefined && dataRef !== keyword_null)
                                {
                                    if (self._canOffset(dataRef, offsetRow, offsetColumn, sheetRowCount, sheetColumnCount))
                                    {
                                        newSparkline.data(dataRef.offset(offsetColumn, offsetRow))
                                    }
                                }
                                self.add(newSparkline.group());
                                destModel.setSparkline(toRow + i, toColumn + j, newSparkline)
                            }
                            else
                            {
                                destModel.setSparkline(toRow + i, toColumn + j, keyword_null)
                            }
                        }
                    }
                };
                WorksheetSparklineGroupManager.prototype._exMove = function(src, fromRow, fromColumn, toRow, toColumn, rowCount, columnCount)
                {
                    var self = this;
                    var sheet = self._sheet;
                    if (!sheet)
                    {
                        return
                    }
                    if (src === sheet)
                    {
                        self._move(fromRow, fromColumn, toRow, toColumn, rowCount, columnCount);
                        return
                    }
                    var srcModel = src._getModel();
                    var destModel = sheet._getModel();
                    self._exMoveDataRange(src, fromRow, fromColumn, toRow, toColumn, rowCount, columnCount);
                    for (var i = 0; i < rowCount; i++)
                    {
                        for (var j = 0; j < columnCount; j++)
                        {
                            var sparkline = srcModel.getSparkline(fromRow + i, fromColumn + j);
                            if (sparkline)
                            {
                                sparkline.row = toRow + i;
                                sparkline.column = toColumn + j;
                                var oldGroup = sparkline.group();
                                var newGroup = oldGroup.clone();
                                oldGroup.remove(sparkline);
                                if (oldGroup.count() <= 0)
                                {
                                    src._sparklineGroupManager.remove(oldGroup)
                                }
                                newGroup.add(sparkline);
                                self.add(newGroup);
                                destModel.setSparkline(toRow + i, toColumn + j, sparkline)
                            }
                            else
                            {
                                destModel.setSparkline(toRow + i, toColumn + j, keyword_null)
                            }
                            srcModel.setSparkline(fromRow + i, fromColumn + j, keyword_null)
                        }
                    }
                };
                WorksheetSparklineGroupManager.prototype._exMoveDataRange = function(src, fromRow, fromColumn, toRow, toColumn, rowCount, columnCount)
                {
                    var self = this;
                    var sheet = self._sheet;
                    if (!src || !sheet)
                    {
                        return
                    }
                    if (src === sheet)
                    {
                        self._moveDataRange(fromRow, fromColumn, toRow, toColumn, rowCount, columnCount);
                        return
                    }
                    var moveRange = new Sheets.Range(fromRow, fromColumn, rowCount, columnCount);
                    var offsetRow = toRow - fromRow;
                    var offsetColumn = toColumn - fromColumn;
                    for (var i = 0; i < src._sparklineGroupManager._groups.length; i++)
                    {
                        var g = src._sparklineGroupManager._groups[i];
                        for (var j = 0; j < g._innerList.length; j++)
                        {
                            var sparkline = g._innerList[j];
                            if (!sparkline)
                            {
                                continue
                            }
                            var dateAxisRef = sparkline.dateAxisData();
                            var dateAxisRange = self._getExpressionRange(dateAxisRef);
                            if (dateAxisRange && self._sameSource(src, dateAxisRef))
                            {
                                if (moveRange.containsRange(dateAxisRange) && moveRange.contains(sparkline.row, sparkline.column))
                                {
                                    sparkline.dateAxisData(dateAxisRef.offset(offsetColumn, offsetRow))
                                }
                            }
                            var dataRef = sparkline.data();
                            var dataRange = self._getExpressionRange(dataRef);
                            if (dataRange && self._sameSource(src, dataRef))
                            {
                                if (moveRange.containsRange(dataRange) && moveRange.contains(sparkline.row, sparkline.column))
                                {
                                    sparkline.data(dataRef.offset(offsetColumn, offsetRow))
                                }
                            }
                        }
                    }
                };
                WorksheetSparklineGroupManager.prototype._sameSource = function(source, exp)
                {
                    return true
                };
                WorksheetSparklineGroupManager.prototype._addRowRange = function(row, rowCount, range)
                {
                    if (range)
                    {
                        if (row > range.row + range.rowCount - 1)
                        {
                            return range
                        }
                        else if (row > range.row)
                        {
                            return new Sheets.Range(range.row, range.col, range.rowCount + rowCount, range.colCount)
                        }
                        else
                        {
                            return new Sheets.Range(range.row + rowCount, range.col, range.rowCount, range.colCount)
                        }
                    }
                    return keyword_null
                };
                WorksheetSparklineGroupManager.prototype._addColumnRange = function(column, columnCount, range)
                {
                    if (range)
                    {
                        if (column > range.col + range.colCount - 1)
                        {
                            return range
                        }
                        else if (column > range.col)
                        {
                            return new Sheets.Range(range.row, range.col, range.rowCount, range.colCount + columnCount)
                        }
                        else
                        {
                            return new Sheets.Range(range.row, range.col + columnCount, range.rowCount, range.colCount)
                        }
                    }
                    return keyword_null
                };
                WorksheetSparklineGroupManager.prototype._removeColumnRange = function(column, columnCount, range)
                {
                    var ret = this._rangeSubCat(range.col, range.col + range.colCount - 1, column, column + columnCount - 1);
                    if (!ret)
                    {
                        return keyword_null
                    }
                    return new Sheets.Range(range.row, ret.start, range.rowCount, ret.end - ret.start + 1)
                };
                WorksheetSparklineGroupManager.prototype._removeRowRange = function(row, rowCount, range)
                {
                    var ret = this._rangeSubCat(range.row, range.row + range.rowCount - 1, row, row + rowCount - 1);
                    if (!ret)
                    {
                        return keyword_null
                    }
                    return new Sheets.Range(ret.start, range.col, ret.end - ret.start + 1, range.colCount)
                };
                WorksheetSparklineGroupManager.prototype._rangeSubCat = function(sourceStart, sourceEnd, targetStart, targetEnd)
                {
                    var resultStart = -1;
                    var resultEnd,
                        i;
                    if (targetEnd < sourceStart)
                    {
                        var removeCount = targetEnd - targetStart + 1;
                        resultStart = sourceStart - removeCount;
                        resultEnd = sourceEnd - removeCount;
                        return {
                                start: resultStart, end: resultEnd
                            }
                    }
                    if (targetStart > sourceEnd)
                    {
                        resultStart = sourceStart;
                        resultEnd = sourceEnd;
                        return {
                                start: resultStart, end: resultEnd
                            }
                    }
                    if (targetStart <= sourceStart)
                    {
                        var sourceCount = sourceEnd - sourceStart + 1;
                        var removedCount = 0;
                        for (i = sourceStart; i <= targetEnd; i++)
                        {
                            if (i <= sourceEnd)
                            {
                                removedCount++
                            }
                            else
                            {
                                break
                            }
                        }
                        resultStart = targetStart;
                        resultEnd = resultStart + sourceCount - removedCount - 1;
                        return {
                                start: resultStart, end: resultEnd
                            }
                    }
                    var remainedCount = 0;
                    for (i = sourceStart; i <= sourceEnd; i++)
                    {
                        if (resultStart === -1)
                        {
                            if (i < targetStart || i > targetEnd)
                            {
                                resultStart = i
                            }
                        }
                        if (i < targetStart || i > targetEnd)
                        {
                            remainedCount++
                        }
                    }
                    if (resultStart !== -1 && remainedCount > 0)
                    {
                        resultEnd = resultStart + remainedCount - 1;
                        return {
                                start: resultStart, end: resultEnd
                            }
                    }
                    return keyword_null
                };
                WorksheetSparklineGroupManager.prototype.toJSON = function()
                {
                    var groups = this._groups;
                    if (!groups || groups.length === 0)
                    {
                        return keyword_undefined
                    }
                    var jsonData = [];
                    for (var i = 0; i < groups.length; i++)
                    {
                        jsonData.push(groups[i].toJSON())
                    }
                    if (jsonData.length === 0)
                    {
                        return keyword_undefined
                    }
                    return jsonData
                };
                WorksheetSparklineGroupManager.prototype.fromJSON = function(jsonData, isNoneSchema)
                {
                    if (!jsonData || jsonData.length === 0)
                    {
                        return
                    }
                    for (var i = 0; i < jsonData.length; i++)
                    {
                        var item = jsonData[i];
                        var sparklineGroup = new SparklineGroup;
                        sparklineGroup.fromJSON(item, isNoneSchema);
                        this.add(sparklineGroup)
                    }
                };
                return WorksheetSparklineGroupManager
            })();
        Sheets.WorksheetSparklineGroupManager = WorksheetSparklineGroupManager;
        var SparklineValue = (function(_super)
            {
                __extends(SparklineValue, _super);
                function SparklineValue()
                {
                    _super.apply(this, arguments)
                }
                return SparklineValue
            })(Sparkline);
        Sheets.SparklineValue = SparklineValue
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

