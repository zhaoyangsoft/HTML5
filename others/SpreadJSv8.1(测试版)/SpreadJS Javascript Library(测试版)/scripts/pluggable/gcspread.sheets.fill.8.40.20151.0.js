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
var GcSpread;
(function(GcSpread)
{
    (function(Sheets)
    {
        Sheets.feature("basedialog", ["core.common"]);
        var BaseDialog = (function()
            {
                function BaseDialog(zindex)
                {
                    var self = this;
                    self._wijpopupClass = "wijspread-popup";
                    self._overlayClass = "wijspread-overlay";
                    zindex = zindex || 0;
                    self.defaultOverlayCSS = {
                        position: "fixed", width: "100%", height: "100%", margin: 0, padding: 0, top: 0, left: 0, border: "none", zIndex: zindex, backgroundColor: "rgba(0,0,0,0)"
                    };
                    self.defaultContainerCSS = {
                        position: "absolute", padding: 0, margin: 0, height: "auto", zIndex: zindex + 1, outline: "none"
                    };
                    self._init()
                }
                BaseDialog.prototype._init = function()
                {
                    var self = this;
                    if (!self._hasTargetContainer(self._name))
                    {
                        self._name = self._generateName();
                        self.container = $("<div></div>").addClass(self._wijpopupClass + " ui-widget").attr({
                            id: self._name, tabIndex: -1
                        }).css(self.defaultContainerCSS)
                    }
                    else
                    {
                        self.container = $("#" + self._name)
                    }
                };
                BaseDialog.prototype._generateName = function()
                {
                    var num = 0;
                    var prefix = "dialog";
                    while (this._hasTargetContainer(prefix + num))
                    {
                        num++
                    }
                    return prefix + num
                };
                BaseDialog.prototype.getContainer = function()
                {
                    if (this.container)
                    {
                        return this.container
                    }
                };
                BaseDialog.prototype.show = function(speed, effect, callback)
                {
                    var self = this,
                        argumentsLength = arguments.length,
                        container = self.container;
                    if (!self._hasOverlay())
                    {
                        self._createOverlay()
                    }
                    window.gcGlobal.suspendEvent();
                    if (!self._hasTargetContainer(self._name))
                    {
                        $(document.body).append(container);
                        self.resetDialogPosition();
                        container.css("display", "none")
                    }
                    if (argumentsLength === 3)
                    {
                        if (effect === "slide")
                        {
                            container.slideDown(speed, callback)
                        }
                        else if (effect === "fade")
                        {
                            container.fadeIn(speed, callback)
                        }
                        else
                        {
                            container.show(speed, callback)
                        }
                    }
                    else if (argumentsLength === 2)
                    {
                        if (effect === "slide")
                        {
                            container.slideDown(speed)
                        }
                        else if (effect === "fade")
                        {
                            container.fadeIn(speed)
                        }
                        else
                        {
                            container.show(speed)
                        }
                    }
                    else if (argumentsLength === 1)
                    {
                        container.show(speed)
                    }
                    else
                    {
                        container.show()
                    }
                };
                BaseDialog.prototype.close = function()
                {
                    var self = this;
                    if (self._hasTargetContainer(self._name))
                    {
                        self.container.remove()
                    }
                    if (!$("." + self._wijpopupClass).is(":visible"))
                    {
                        self.closeOverlay()
                    }
                    window.gcGlobal.resumeEvent()
                };
                BaseDialog.prototype.closeOverlay = function()
                {
                    $("." + this._overlayClass).remove()
                };
                BaseDialog.prototype.resetDialogPosition = function()
                {
                    var container = this.container;
                    if (container.length === 0)
                    {
                        return
                    }
                    var left = parseInt(container.css("left"));
                    var top = parseInt(container.css("top"));
                    var dialogWidth = container.width();
                    var dialogHeight = container.height();
                    if (isNaN(left) || isNaN(top) || isNaN(dialogWidth) || isNaN(dialogHeight))
                    {
                        return
                    }
                    var bottomCross = 0,
                        rightCross = 0;
                    var clientWidth = document.documentElement.clientWidth;
                    var clientHeight = document.documentElement.clientHeight;
                    var pos = container.get(0).getBoundingClientRect();
                    if (pos.left + dialogWidth > clientWidth)
                    {
                        rightCross = pos.left + dialogWidth - clientWidth
                    }
                    if (pos.top + dialogHeight > clientHeight)
                    {
                        bottomCross = pos.top + dialogHeight - clientHeight
                    }
                    if (left < 0 || top < 0 || bottomCross > 0 || rightCross > 0)
                    {
                        left -= rightCross;
                        top -= bottomCross;
                        if (left < 0)
                        {
                            left = 0
                        }
                        if (top < 0)
                        {
                            top = 0
                        }
                        container.css({
                            left: left, top: top
                        })
                    }
                };
                BaseDialog.prototype._hasTargetContainer = function(target)
                {
                    if ($("#" + target).length)
                    {
                        return true
                    }
                    return false
                };
                BaseDialog.prototype._createOverlay = function()
                {
                    var self = this;
                    var overlay = $("<div></div>").addClass(self._overlayClass);
                    overlay.css(self.defaultOverlayCSS);
                    $(document.body).append(overlay);
                    var isFirefox = $.browser && $.browser.mozilla;
                    var isQTMode = $.browser && $.browser.qtMode;
                    if (isFirefox || isQTMode)
                    {
                        var openTime = (new Date).valueOf()
                    }
                    overlay.bind('mousedown', function(e)
                    {
                        if (isFirefox || isQTMode)
                        {
                            var closeTime = (new Date).valueOf();
                            if (closeTime - openTime < 100)
                            {
                                return
                            }
                        }
                        self.close();
                        if (isFirefox || isQTMode)
                        {
                            if (self._delayCloseTimeout)
                            {
                                window.clearTimeout(self._delayCloseTimeout)
                            }
                        }
                        Sheets.util.cancelDefault(e)
                    });
                    overlay.bind('touchstart MSPointerDown pointerdown', function(e)
                    {
                        if (isFirefox || isQTMode)
                        {
                            self._delayCloseTimeout = setTimeout(function()
                            {
                                self.close()
                            }, 100)
                        }
                        else
                        {
                            self.close()
                        }
                        Sheets.util.cancelDefault(e)
                    })
                };
                BaseDialog.prototype._hasOverlay = function()
                {
                    if ($("." + this._overlayClass).length > 0)
                    {
                        return true
                    }
                    return false
                };
                return BaseDialog
            })();
        Sheets.BaseDialog = BaseDialog
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}));
var GcSpread;
(function(GcSpread)
{
    (function(Sheets)
    {
        Sheets.feature("fill", ["core.common", "core.globalize", "core.stringResource"]);
        var keyword_null = null,
            keyword_undefined = undefined,
            Math_abs = Math.abs,
            Math_min = Math.min,
            Math_floor = Math.floor;
        (function(FillType)
        {
            FillType[FillType["Direction"] = 0] = "Direction";
            FillType[FillType["Linear"] = 1] = "Linear";
            FillType[FillType["Growth"] = 2] = "Growth";
            FillType[FillType["Date"] = 3] = "Date";
            FillType[FillType["Auto"] = 4] = "Auto"
        })(Sheets.FillType || (Sheets.FillType = {}));
        var FillType = Sheets.FillType;
        (function(FillDateUnit)
        {
            FillDateUnit[FillDateUnit["Day"] = 0] = "Day";
            FillDateUnit[FillDateUnit["Weekday"] = 1] = "Weekday";
            FillDateUnit[FillDateUnit["Month"] = 2] = "Month";
            FillDateUnit[FillDateUnit["Year"] = 3] = "Year"
        })(Sheets.FillDateUnit || (Sheets.FillDateUnit = {}));
        var FillDateUnit = Sheets.FillDateUnit;
        function __createRange(row, column, rowCount, columnCount)
        {
            return new Sheets.Range(row, column, rowCount, columnCount)
        }
        function __createDateTimeHelper(date)
        {
            return new Sheets._DateTimeHelper(date)
        }
        function __isNumber(value)
        {
            if (typeof(value) === "string")
            {
                return false
            }
            return Sheets.FormatConverter.IsNumber(value)
        }
        function __fromOADate(value)
        {
            return Sheets._DateTimeHelper.fromOADate(value)
        }
        var FillCachePool = (function()
            {
                function FillCachePool(sheet)
                {
                    this._sheet = sheet
                }
                return FillCachePool
            })();
        var NumberSource = (function()
            {
                function NumberSource(startIndex)
                {
                    this._indexes = [];
                    this._innerValues = [];
                    this._type = keyword_null;
                    if (startIndex === keyword_undefined || startIndex === keyword_null)
                    {
                        this._startIndex = -1
                    }
                    else
                    {
                        this._startIndex = startIndex
                    }
                }
                NumberSource.prototype.dataCount = function()
                {
                    return this._innerValues.length
                };
                NumberSource.prototype.values = function()
                {
                    var self = this;
                    if (self._innerValues.length > 0)
                    {
                        var values = [];
                        for (var i = 0; i < self._innerValues.length; i++)
                        {
                            var value = self._innerValues[i];
                            var ret;
                            if (self._type === "object")
                            {
                                ret = self.toDateTime(value)
                            }
                            else
                            {
                                ret = value
                            }
                            values.push(ret)
                        }
                        return values
                    }
                    return []
                };
                NumberSource.prototype.indexes2 = function()
                {
                    var self = this;
                    var count = self._indexes.length;
                    if (count > 0 && Sheets.util.hasCalc())
                    {
                        var startIndex = self._startIndex;
                        if (startIndex === -1)
                        {
                            startIndex = self._indexes[0]
                        }
                        var value = new Array(1);
                        value[0] = new Array(count);
                        for (var i = 0; i < count; i++)
                        {
                            value[0][i] = self._indexes[i] - startIndex + 1
                        }
                        return new Sheets.Calc._ConcreteArray(value, count)
                    }
                    return keyword_null
                };
                NumberSource.prototype.values2 = function()
                {
                    var count = this._innerValues.length;
                    if (count > 0 && Sheets.util.hasCalc())
                    {
                        var value = [this._innerValues];
                        return new Sheets.Calc._ConcreteArray(value, count)
                    }
                    return keyword_null
                };
                NumberSource.prototype.insert = function(insertIndex, index, value)
                {
                    if (!__isNumber(value))
                    {
                        throw new Error(Sheets.SR.Exp_NumberOnly);
                    }
                    var self = this;
                    if (self._type === keyword_undefined || self._type === keyword_null)
                    {
                        if (value instanceof Date)
                        {
                            self._type = "date"
                        }
                        else
                        {
                            self._type = "number"
                        }
                    }
                    Sheets.ArrayHelper.insert(self._indexes, insertIndex, index);
                    Sheets.ArrayHelper.insert(self._innerValues, insertIndex, self.toDouble(value))
                };
                NumberSource.prototype.add = function(index, value)
                {
                    var self = this;
                    if (self._type === keyword_undefined || self._type === keyword_null)
                    {
                        if (value instanceof Date)
                        {
                            self._type = "date"
                        }
                        else
                        {
                            self._type = "number"
                        }
                    }
                    self._indexes.push(index);
                    self._innerValues.push(self.toDouble(value))
                };
                NumberSource.prototype.toActualValue = function(value)
                {
                    var ret;
                    if (this._type === "date")
                    {
                        ret = this.toDateTime(value)
                    }
                    else
                    {
                        ret = value
                    }
                    return ret
                };
                NumberSource.prototype.toDouble = function(value)
                {
                    return Sheets.FormatConverter.ToDouble(value)
                };
                NumberSource.prototype.toDateTime = function(value)
                {
                    var ret = keyword_null;
                    if (value instanceof Date)
                    {
                        ret = value
                    }
                    else if (Sheets.util.hasCalc())
                    {
                        try
                        {
                            ret = Sheets.Calc.Convert.DT(value)
                        }
                        catch(err)
                        {
                            ret = value
                        }
                    }
                    return ret
                };
                return NumberSource
            })();
        var FormulaEvaluator = (function()
            {
                function FormulaEvaluator(){}
                FormulaEvaluator.bindStandardFunction = function(e, name, evaluator, values, indexes, dest)
                {
                    return (function evalateStandardFunction(evaluator, values, indexes, dest)
                        {
                            if (!Sheets.util.hasCalc())
                            {
                                return keyword_null
                            }
                            var fn = Sheets.Calc.Functions.findGlobalFunction(name);
                            var result = fn.evaluate([values, indexes, dest]);
                            return result.getValue(0, 0)
                        })(evaluator, values, indexes, dest)
                };
                FormulaEvaluator.TREND = function(evaluator, values, indexes, dest)
                {
                    return FormulaEvaluator.bindStandardFunction(this, "Trend", evaluator, values, indexes, dest)
                };
                FormulaEvaluator.GROWTH = function(evaluator, values, indexes, dest)
                {
                    return FormulaEvaluator.bindStandardFunction(this, "Growth", evaluator, values, indexes, dest)
                };
                return FormulaEvaluator
            })();
        var FillImp = (function()
            {
                function FillImp(sheet)
                {
                    this._worksheet = sheet;
                    this._fillCache = new FillCachePool(sheet)
                }
                FillImp.prototype.fillLinear = function(range, series, step, stop)
                {
                    if ((step === keyword_undefined || step === keyword_null) && (stop === keyword_undefined || stop === keyword_null))
                    {
                        this.seriesTrendFillRange(range, series, 1)
                    }
                    else
                    {
                        this.seriesFillRange(range, series, 1, step, stop, keyword_null)
                    }
                };
                FillImp.prototype.fillGrowth = function(range, series, step, stop)
                {
                    if ((step === keyword_undefined || step === keyword_null) && (stop === keyword_undefined || stop === keyword_null))
                    {
                        this.seriesTrendFillRange(range, series, 2)
                    }
                    else
                    {
                        this.seriesFillRange(range, series, 2, step, stop, keyword_null)
                    }
                };
                FillImp.prototype.fillDate = function(range, series, unit, step, stop)
                {
                    this.seriesFillRange(range, series, 3, step, stop, unit)
                };
                FillImp.prototype.seriesTrendFillRange = function(range, fillSeries, fillType, justGetTooltipContent)
                {
                    var self = this;
                    var newRange = self.fixRange(range);
                    var row = newRange.row;
                    var column = newRange.col;
                    var rowCount = newRange.rowCount;
                    var columnCount = newRange.colCount;
                    if (self._worksheet._getSpanModel().hasSpans(row, column, rowCount, columnCount))
                    {
                        throw new Error(Sheets.SR.Exp_RangeContainsMergedCell);
                    }
                    var sourceData,
                        targetData,
                        i;
                    if (fillSeries === 1)
                    {
                        for (var r = row; r < row + rowCount; r++)
                        {
                            sourceData = self.getSeriesSource(r, column, 1, columnCount, fillSeries);
                            if (sourceData && sourceData.dataCount() > 0)
                            {
                                targetData = self.calcSeriesTrendData(sourceData, columnCount, fillType);
                                if (targetData && targetData.length > 0)
                                {
                                    for (i = 0; i < targetData.length; i++)
                                    {
                                        if (justGetTooltipContent)
                                        {
                                            return sourceData.toActualValue(targetData[i])
                                        }
                                        else
                                        {
                                            self.copyCell(self._worksheet, r, sourceData._indexes[0], r, column + i, sourceData.toActualValue(targetData[i]), fillType)
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (fillSeries === 0)
                    {
                        for (var c = column; c < column + columnCount; c++)
                        {
                            sourceData = self.getSeriesSource(row, c, rowCount, 1, fillSeries);
                            if (sourceData && sourceData.dataCount() > 0)
                            {
                                targetData = self.calcSeriesTrendData(sourceData, rowCount, fillType);
                                if (targetData && targetData.length > 0)
                                {
                                    for (i = 0; i < targetData.length; i++)
                                    {
                                        if (justGetTooltipContent)
                                        {
                                            return sourceData.toActualValue(targetData[i])
                                        }
                                        else
                                        {
                                            self.copyCell(self._worksheet, sourceData._indexes[0], c, row + i, c, sourceData.toActualValue(targetData[i]), fillType)
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                FillImp.prototype.getSeriesSource = function(row, column, rowCount, columnCount, fillSeries)
                {
                    var numberSource = keyword_null,
                        value;
                    if (fillSeries === 1)
                    {
                        var c = column + columnCount - 1;
                        while (c >= column)
                        {
                            value = this._worksheet.getValue(row, c);
                            if (__isNumber(value))
                            {
                                if (!numberSource)
                                {
                                    numberSource = new NumberSource(column)
                                }
                                numberSource.insert(0, c, value)
                            }
                            c--
                        }
                    }
                    else if (fillSeries === 0)
                    {
                        var r = row + rowCount - 1;
                        while (r >= row)
                        {
                            value = this._worksheet.getValue(r, column);
                            if (__isNumber(value))
                            {
                                if (!numberSource)
                                {
                                    numberSource = new NumberSource(row)
                                }
                                numberSource.insert(0, r, value)
                            }
                            r--
                        }
                    }
                    return numberSource
                };
                FillImp.prototype.calcSeriesTrendData = function(sourceData, count, type)
                {
                    if (sourceData && sourceData.dataCount() > 0 && Sheets.util.hasCalc())
                    {
                        if (type === 1 || type === 2)
                        {
                            var newValues = [];
                            if (sourceData.dataCount() === 1)
                            {
                                if (type === 1)
                                {
                                    sourceData.add(sourceData._indexes[0] + 1, sourceData.toActualValue(sourceData._innerValues[0] + 1))
                                }
                                else if (type === 2)
                                {
                                    sourceData.add(sourceData._indexes[0] + 1, sourceData.values()[0])
                                }
                            }
                            for (var i = 0; i < count; i++)
                            {
                                if (type === 1)
                                {
                                    newValues.push(FormulaEvaluator.TREND(this._worksheet, sourceData.values2(), sourceData.indexes2(), i + 1))
                                }
                                else if (type === 2)
                                {
                                    newValues.push(FormulaEvaluator.GROWTH(this._worksheet, sourceData.values2(), sourceData.indexes2(), i + 1))
                                }
                            }
                            return newValues
                        }
                    }
                    return keyword_null
                };
                FillImp.prototype.fillAuto = function(range, series, justGetToolTipContent)
                {
                    var self = this;
                    var sheet = self._worksheet;
                    var newRange = self.fixRange(range);
                    var row = newRange.row;
                    var column = newRange.col;
                    var rowCount = newRange.rowCount;
                    var columnCount = newRange.colCount;
                    var sourceRange = self.fixRange(sheet._eventHandler._dragFillStartRange);
                    if (sourceRange)
                    {
                        if (self._worksheet._getSpanModel().hasPartSpans(sourceRange.row, sourceRange.col, sourceRange.rowCount, sourceRange.colCount) || self._worksheet._getSpanModel().hasPartSpans(row, column, rowCount, columnCount))
                        {
                            throw new Error(Sheets.SR.Exp_ChangeMergedCell);
                        }
                        var isIncrease = true;
                        if (row < sourceRange.row || column < sourceRange.col)
                        {
                            isIncrease = false
                        }
                        return self.autoFillRange(sourceRange, rowCount, columnCount, series, justGetToolTipContent, isIncrease)
                    }
                };
                FillImp.prototype.fixRange = function(range)
                {
                    var row = range.row;
                    var column = range.col;
                    var rowCount = range.rowCount;
                    var columnCount = range.colCount;
                    if (row === -1)
                    {
                        row = 0;
                        rowCount = this._worksheet.getRowCount()
                    }
                    if (column === -1)
                    {
                        column = 0;
                        columnCount = this._worksheet.getColumnCount()
                    }
                    return __createRange(row, column, rowCount, columnCount)
                };
                FillImp.prototype.autoFillRange = function(sourceRange, rowCount, columnCount, fillSeries, justGetTooltipContent, isIncrease)
                {
                    var self = this;
                    var nWhole,
                        nPartial,
                        targetRange,
                        i;
                    var directionNum = isIncrease ? 1 : -1;
                    if (fillSeries === 1)
                    {
                        nWhole = Math_floor(columnCount / sourceRange.colCount);
                        nPartial = columnCount % sourceRange.colCount;
                        if (nWhole > 1 && !justGetTooltipContent)
                        {
                            for (i = 1; i < nWhole; i++)
                            {
                                targetRange = __createRange(sourceRange.row, sourceRange.col + i * directionNum * sourceRange.colCount, sourceRange.rowCount, sourceRange.colCount);
                                self.copyRange(sourceRange, targetRange, fillSeries, 4, justGetTooltipContent)
                            }
                        }
                        if (justGetTooltipContent && nWhole > 1 && nPartial === 0)
                        {
                            nWhole = nWhole - 1;
                            nPartial = sourceRange.colCount
                        }
                        if (nWhole > 0 && nPartial > 0)
                        {
                            if (isIncrease)
                            {
                                targetRange = __createRange(sourceRange.row, sourceRange.col + nWhole * sourceRange.colCount, sourceRange.rowCount, nPartial)
                            }
                            else
                            {
                                targetRange = __createRange(sourceRange.row, sourceRange.col - nWhole * sourceRange.colCount + sourceRange.colCount - nPartial, sourceRange.rowCount, nPartial)
                            }
                            return self.copyRange(sourceRange, targetRange, fillSeries, 4, justGetTooltipContent, isIncrease, keyword_null, isIncrease ? 0 : sourceRange.colCount - nPartial)
                        }
                    }
                    else if (fillSeries === 0)
                    {
                        nWhole = Math_floor(rowCount / sourceRange.rowCount);
                        nPartial = rowCount % sourceRange.rowCount;
                        if (nWhole > 1 && !justGetTooltipContent)
                        {
                            for (i = 1; i < nWhole; i++)
                            {
                                targetRange = __createRange(sourceRange.row + i * directionNum * sourceRange.rowCount, sourceRange.col, sourceRange.rowCount, sourceRange.colCount);
                                self.copyRange(sourceRange, targetRange, fillSeries, 4, justGetTooltipContent, keyword_null, keyword_null, keyword_null, true)
                            }
                        }
                        if (justGetTooltipContent && nWhole > 1 && nPartial === 0)
                        {
                            nWhole = nWhole - 1;
                            nPartial = sourceRange.rowCount
                        }
                        if (nWhole > 0 && nPartial > 0)
                        {
                            if (isIncrease)
                            {
                                targetRange = __createRange(sourceRange.row + nWhole * sourceRange.rowCount, sourceRange.col, nPartial, sourceRange.colCount)
                            }
                            else
                            {
                                targetRange = __createRange(sourceRange.row - nWhole * sourceRange.rowCount + sourceRange.rowCount - nPartial, sourceRange.col, nPartial, sourceRange.colCount)
                            }
                            return self.copyRange(sourceRange, targetRange, fillSeries, 4, justGetTooltipContent, isIncrease, isIncrease ? 0 : sourceRange.rowCount - nPartial, keyword_null, true)
                        }
                    }
                };
                FillImp.prototype.copyRange = function(sourceRange, targetRange, fillSeries, fillType, justGetTooltipContent, isIncrease, rowOffset, colOffset, ignoreFilteredOutRow)
                {
                    var self = this;
                    var sheet = self._worksheet;
                    var r,
                        c,
                        sourceColumn,
                        sourceRow,
                        targetRow,
                        targetColumn,
                        sourceValue,
                        formula,
                        valueType,
                        sourceSpan,
                        trendData = keyword_null,
                        trendDataType = keyword_null;
                    if (fillSeries === 1)
                    {
                        for (r = 0; r < sourceRange.rowCount; r++)
                        {
                            trendData = keyword_null;
                            trendDataType = keyword_null;
                            sourceRow = sourceRange.row + r;
                            targetRow = targetRange.row + r;
                            colOffset = colOffset ? colOffset : 0;
                            c = 0;
                            while (c < sourceRange.colCount)
                            {
                                sourceColumn = sourceRange.col + c;
                                targetColumn = targetRange.col + c - colOffset;
                                sourceValue = keyword_null;
                                formula = sheet.getFormula(sourceRow, sourceColumn);
                                if (!formula || formula === "")
                                {
                                    sourceValue = sheet.getValue(sourceRow, sourceColumn)
                                }
                                if (fillType === 4)
                                {
                                    if (__isNumber(sourceValue))
                                    {
                                        if (!trendData)
                                        {
                                            trendData = new NumberSource
                                        }
                                        valueType = keyword_null;
                                        if (sourceValue instanceof Date)
                                        {
                                            valueType = "date"
                                        }
                                        else
                                        {
                                            valueType = "number"
                                        }
                                        if (!trendDataType)
                                        {
                                            trendDataType = valueType
                                        }
                                        if (trendDataType === valueType)
                                        {
                                            trendData.add(sourceColumn, sourceValue);
                                            c++;
                                            continue
                                        }
                                    }
                                }
                                if (sourceValue && trendData && trendData.dataCount() > 0)
                                {
                                    var result = self.autoFillRowTrendValues(sourceRange, targetRange, sourceRow, targetRow, trendData, justGetTooltipContent, isIncrease, colOffset);
                                    if (justGetTooltipContent && result !== keyword_null)
                                    {
                                        return result
                                    }
                                    trendData = keyword_null;
                                    trendDataType = keyword_null;
                                    continue
                                }
                                sourceSpan = sheet._getSpanModel().find(sourceRow, sourceColumn);
                                if (sourceSpan)
                                {
                                    if (sourceSpan.row === sourceRow)
                                    {
                                        if (justGetTooltipContent)
                                        {
                                            if (targetColumn === targetRange.col + targetRange.colCount - 1)
                                            {
                                                return sourceValue
                                            }
                                        }
                                        else if (targetColumn < targetRange.col + targetRange.colCount && targetColumn >= targetRange.col)
                                        {
                                            self.copyCell(sheet, sourceRow, sourceColumn, targetRow, targetColumn, sourceValue, fillType)
                                        }
                                    }
                                    c += sourceSpan.colCount
                                }
                                else
                                {
                                    if (justGetTooltipContent)
                                    {
                                        if (isIncrease && targetColumn === targetRange.col + targetRange.colCount - 1)
                                        {
                                            return sourceValue
                                        }
                                        else if (!isIncrease && targetColumn === targetRange.col)
                                        {
                                            return sourceValue
                                        }
                                    }
                                    else if (targetColumn < targetRange.col + targetRange.colCount && targetColumn >= targetRange.col)
                                    {
                                        self.copyCell(sheet, sourceRow, sourceColumn, targetRow, targetColumn, sourceValue, fillType)
                                    }
                                    c++
                                }
                            }
                            if (trendData && trendData.dataCount() > 0)
                            {
                                var result = self.autoFillRowTrendValues(sourceRange, targetRange, sourceRow, targetRow, trendData, justGetTooltipContent, isIncrease, colOffset);
                                if (justGetTooltipContent && result !== keyword_null)
                                {
                                    return result
                                }
                            }
                        }
                    }
                    else if (fillSeries === 0)
                    {
                        for (c = 0; c < sourceRange.colCount; c++)
                        {
                            trendData = keyword_null;
                            trendDataType = keyword_null;
                            sourceColumn = sourceRange.col + c;
                            targetColumn = targetRange.col + c;
                            rowOffset = rowOffset ? rowOffset : 0;
                            r = 0;
                            while (r < sourceRange.rowCount)
                            {
                                sourceRow = sourceRange.row + r;
                                targetRow = targetRange.row + r - rowOffset;
                                sourceValue = keyword_null;
                                formula = sheet.getFormula(sourceRow, sourceColumn);
                                if (!formula || formula === "")
                                {
                                    sourceValue = sheet.getValue(sourceRow, sourceColumn)
                                }
                                if (fillType === 4)
                                {
                                    if (__isNumber(sourceValue))
                                    {
                                        if (!trendData)
                                        {
                                            trendData = new NumberSource
                                        }
                                        valueType = keyword_null;
                                        if (sourceValue instanceof Date)
                                        {
                                            valueType = "date"
                                        }
                                        else
                                        {
                                            valueType = "number"
                                        }
                                        if (!trendDataType)
                                        {
                                            trendDataType = valueType
                                        }
                                        if (trendDataType === valueType)
                                        {
                                            trendData.add(sourceRow, sourceValue);
                                            r++;
                                            continue
                                        }
                                    }
                                }
                                if (sourceValue && trendData && trendData.dataCount() > 0)
                                {
                                    var result = self.autoFillColumnTrendValues(sourceRange, targetRange, sourceColumn, targetColumn, trendData, justGetTooltipContent, isIncrease, rowOffset, ignoreFilteredOutRow);
                                    if (justGetTooltipContent && result !== keyword_null)
                                    {
                                        return result
                                    }
                                    trendData = keyword_null;
                                    trendDataType = keyword_null;
                                    continue
                                }
                                sourceSpan = sheet._getSpanModel().find(sourceRow, sourceColumn);
                                if (sourceSpan)
                                {
                                    if (sourceSpan.col === sourceColumn)
                                    {
                                        if (justGetTooltipContent)
                                        {
                                            if (targetRow === targetRange.row + targetRange.rowCount - 1)
                                            {
                                                return sourceValue
                                            }
                                        }
                                        else if (targetRow < targetRange.row + targetRange.rowCount && targetRow >= targetRange.row)
                                        {
                                            if (!(ignoreFilteredOutRow && sheet.isRowFilterOut(targetRow)))
                                            {
                                                self.copyCell(sheet, sourceRow, sourceColumn, targetRow, targetColumn, sourceValue, fillType)
                                            }
                                        }
                                    }
                                    r += sourceSpan.rowCount
                                }
                                else
                                {
                                    if (justGetTooltipContent)
                                    {
                                        if (isIncrease && targetRow === targetRange.row + targetRange.rowCount - 1)
                                        {
                                            return sourceValue
                                        }
                                        else if (!isIncrease && targetRow === targetRange.row)
                                        {
                                            return sourceValue
                                        }
                                    }
                                    else if (targetRow < targetRange.row + targetRange.rowCount && targetRow >= targetRange.row)
                                    {
                                        if (!(ignoreFilteredOutRow && sheet.isRowFilterOut(targetRow)))
                                        {
                                            self.copyCell(sheet, sourceRow, sourceColumn, targetRow, targetColumn, sourceValue, fillType)
                                        }
                                    }
                                    r++
                                }
                            }
                            if (trendData && trendData.dataCount() > 0)
                            {
                                var result = self.autoFillColumnTrendValues(sourceRange, targetRange, sourceColumn, targetColumn, trendData, justGetTooltipContent, isIncrease, rowOffset, ignoreFilteredOutRow);
                                if (justGetTooltipContent && result !== keyword_null)
                                {
                                    return result
                                }
                            }
                        }
                    }
                    return keyword_null
                };
                FillImp.prototype.autoFillRowTrendValues = function(sourceRange, targetRange, sourceRow, targetRow, trendData, justGetTooltipContent, isIncrease, colOffset)
                {
                    var self = this;
                    var sheet = self._worksheet;
                    var count,
                        i,
                        newV,
                        sourceColumn,
                        targetColumn;
                    if (trendData && trendData.dataCount() > 0 && Sheets.util.hasCalc())
                    {
                        var multiplier = (targetRange.col - sourceRange.col) / sourceRange.colCount;
                        if (self.isArithmeticProgression(trendData._indexes, trendData._innerValues))
                        {
                            var trendValues = trendData.values2();
                            var value = new Array(1);
                            count = trendData.dataCount();
                            value[0] = new Array(count);
                            for (i = 0; i < count; i++)
                            {
                                value[0][i] = i + 1
                            }
                            var trendIndexes = new Sheets.Calc._ConcreteArray(value, count);
                            for (i = 0; i < count; i++)
                            {
                                newV = FormulaEvaluator.TREND(sheet, trendValues, trendIndexes, count * multiplier + i + 1);
                                sourceColumn = trendData._indexes[i];
                                targetColumn = sourceColumn + multiplier * sourceRange.colCount;
                                if (justGetTooltipContent)
                                {
                                    if (isIncrease && targetColumn === targetRange.col + targetRange.colCount - 1)
                                    {
                                        return trendData.toActualValue(newV)
                                    }
                                    else if (!isIncrease && targetColumn === targetRange.col)
                                    {
                                        return trendData.toActualValue(newV)
                                    }
                                }
                                else if (targetColumn < targetRange.col + targetRange.colCount && targetColumn >= targetRange.col)
                                {
                                    self.copyCell(sheet, sourceRow, sourceColumn, targetRow, targetColumn, trendData.toActualValue(newV), 4)
                                }
                            }
                        }
                        else
                        {
                            var startColumn = trendData._indexes[0];
                            count = trendData._indexes[trendData.dataCount() - 1] - startColumn + 1;
                            if (trendData.dataCount() === 1)
                            {
                                trendData.add(trendData._indexes[0] + 1, trendData.toActualValue(trendData._innerValues[0] + 1))
                            }
                            for (i = 0; i < count; i++)
                            {
                                newV = FormulaEvaluator.TREND(sheet, trendData.values2(), trendData.indexes2(), count * multiplier + i + 1);
                                sourceColumn = startColumn + i;
                                targetColumn = sourceColumn + multiplier * sourceRange.colCount;
                                if (justGetTooltipContent)
                                {
                                    if (targetColumn === targetRange.col + targetRange.colCount - 1)
                                    {
                                        return trendData.toActualValue(newV)
                                    }
                                }
                                else if (targetColumn < targetRange.col + targetRange.colCount && targetColumn >= targetRange.col)
                                {
                                    self.copyCell(sheet, sourceRow, sourceColumn, targetRow, targetColumn, trendData.toActualValue(newV), 4)
                                }
                            }
                        }
                    }
                    return keyword_null
                };
                FillImp.prototype.copyCell = function(sheet, fromRow, fromColumn, toRow, toColumn, newValue, type)
                {
                    if (sheet.hasFormula(fromRow, fromColumn) || sheet.hasFormula(toRow, toColumn))
                    {
                        sheet.setFormula(toRow, toColumn, keyword_null);
                        if (type === 0 || type === 4)
                        {
                            var formula = sheet.getFormula(fromRow, fromColumn);
                            if (formula)
                            {
                                sheet._copyFormula(fromRow, fromColumn, toRow, toColumn, 1, 1)
                            }
                        }
                    }
                    sheet.setValue(toRow, toColumn, newValue);
                    var style = sheet.getCompositeStyle(fromRow, fromColumn);
                    if (!style)
                    {
                        sheet.setStyle(toRow, toColumn, keyword_null, 3)
                    }
                    else
                    {
                        var clonedStyle = new Sheets.Style;
                        clonedStyle.copyFrom(style);
                        sheet.setStyle(toRow, toColumn, clonedStyle, 3)
                    }
                    if (!sheet._getSpanModel().isEmpty())
                    {
                        sheet.removeSpan(toRow, toColumn, 3);
                        var span = sheet._getSpanModel().find(fromRow, fromColumn);
                        if (span)
                        {
                            sheet._addSpanImp(toRow, toColumn, span.rowCount, span.colCount, 3)
                        }
                    }
                };
                FillImp.prototype.autoFillColumnTrendValues = function(sourceRange, targetRange, sourceColumn, targetColumn, trendData, justGetTooltipContent, isIncrease, rowOffset, ignoreFilteredOutRow)
                {
                    var self = this;
                    var sheet = self._worksheet;
                    var count,
                        i,
                        newV,
                        sourceRow,
                        targetRow;
                    if (trendData && trendData.dataCount() > 0 && Sheets.util.hasCalc())
                    {
                        var multiplier = (targetRange.row - sourceRange.row - rowOffset) / sourceRange.rowCount;
                        if (self.isArithmeticProgression(trendData._indexes, trendData._innerValues))
                        {
                            var trendValues = trendData.values2();
                            var value = new Array(1);
                            count = trendData.dataCount();
                            value[0] = new Array(count);
                            for (i = 0; i < count; i++)
                            {
                                value[0][i] = i + 1
                            }
                            var trendIndexes = new Sheets.Calc._ConcreteArray(value, count);
                            for (i = 0; i < count; i++)
                            {
                                newV = FormulaEvaluator.TREND(sheet, trendValues, trendIndexes, count * multiplier + i + 1);
                                sourceRow = trendData._indexes[i];
                                targetRow = sourceRow + multiplier * sourceRange.rowCount;
                                if (justGetTooltipContent)
                                {
                                    if (isIncrease && targetRow === targetRange.row + targetRange.rowCount - 1)
                                    {
                                        return trendData.toActualValue(newV)
                                    }
                                    if (!isIncrease && targetRow === targetRange.row)
                                    {
                                        return trendData.toActualValue(newV)
                                    }
                                }
                                else if (targetRow < targetRange.row + targetRange.rowCount && targetRow >= targetRange.row)
                                {
                                    if (!(ignoreFilteredOutRow && sheet.isRowFilterOut(targetRow)))
                                    {
                                        self.copyCell(sheet, sourceRow, sourceColumn, targetRow, targetColumn, trendData.toActualValue(newV), 4)
                                    }
                                }
                            }
                        }
                        else
                        {
                            var startRow = trendData._indexes[0];
                            count = trendData._indexes[trendData.dataCount() - 1] - startRow + 1;
                            if (trendData.dataCount() === 1)
                            {
                                trendData.add(trendData._indexes[0] + 1, trendData.toActualValue(trendData._innerValues[0] + 1))
                            }
                            for (i = 0; i < count; i++)
                            {
                                newV = FormulaEvaluator.TREND(sheet, trendData.values2(), trendData.indexes2(), count * multiplier + i + 1);
                                sourceRow = startRow + i;
                                targetRow = sourceRow + multiplier * sourceRange.rowCount;
                                if (justGetTooltipContent)
                                {
                                    if (targetRow + rowOffset === targetRange.row + targetRange.rowCount - 1)
                                    {
                                        return trendData.toActualValue(newV)
                                    }
                                }
                                else if (targetRow < targetRange.row + targetRange.rowCount && targetRow >= targetRange.row)
                                {
                                    if (!(ignoreFilteredOutRow && sheet.isRowFilterOut(targetRow)))
                                    {
                                        self.copyCell(sheet, startRow, sourceColumn, targetRow, targetColumn, trendData.toActualValue(newV), 4)
                                    }
                                }
                            }
                        }
                    }
                    return keyword_null
                };
                FillImp.prototype.isArithmeticProgression = function(indexes, values)
                {
                    if (indexes.length !== values.length)
                    {
                        return false
                    }
                    var count = values.length;
                    if (count <= 1)
                    {
                        return false
                    }
                    else if (count === 2)
                    {
                        return true
                    }
                    else
                    {
                        var indexDiff = indexes[1] - indexes[0];
                        var valueDiff = values[1] - values[0];
                        for (var i = 2; i < count; i++)
                        {
                            if (indexes[i] - indexes[i - 1] !== indexDiff)
                            {
                                return false
                            }
                            if (values[i] - values[i - 1] !== valueDiff)
                            {
                                return false
                            }
                        }
                        return true
                    }
                };
                FillImp.prototype.fillAutobyDirection = function(range, direction)
                {
                    var newRange = this.fixRange(range);
                    var row = newRange.row;
                    var column = newRange.col;
                    var rowCount = newRange.rowCount;
                    var columnCount = newRange.colCount;
                    var sourceRange = this.getDirectionFillSourceRange(row, column, rowCount, columnCount, direction);
                    if (sourceRange)
                    {
                        this.directionFillRange(sourceRange, row, column, rowCount, columnCount, direction)
                    }
                };
                FillImp.prototype.directionFillRange = function(sourceRange, row, column, rowCount, columnCount, direction)
                {
                    var self = this;
                    var _fillRangeHasMergedCellErrorMessage = Sheets.SR.Exp_TargetContainsMergedCells;
                    var _fillRangeHaveDifferentSizeErrorMessage = Sheets.SR.Exp_MergedCellsIdentical;
                    var nWhole,
                        nPartial,
                        targetRange,
                        i;
                    if (direction === 0)
                    {
                        if (self._worksheet._getSpanModel().hasSpans(row, column, rowCount, columnCount - sourceRange.colCount))
                        {
                            throw new Error(_fillRangeHasMergedCellErrorMessage);
                        }
                        nWhole = Math_floor(columnCount / sourceRange.colCount);
                        nPartial = columnCount % sourceRange.colCount;
                        if (nPartial !== 0)
                        {
                            throw new Error(_fillRangeHaveDifferentSizeErrorMessage);
                        }
                        if (nWhole > 1)
                        {
                            for (i = 1; i < nWhole; i++)
                            {
                                targetRange = __createRange(sourceRange.row, sourceRange.col - i * sourceRange.colCount, sourceRange.rowCount, sourceRange.colCount);
                                self.copyRange(sourceRange, targetRange, 1, 0)
                            }
                        }
                    }
                    else if (direction === 1)
                    {
                        if (self._worksheet._getSpanModel().hasSpans(row, column + sourceRange.colCount, rowCount, columnCount - sourceRange.colCount))
                        {
                            throw new Error(_fillRangeHasMergedCellErrorMessage);
                        }
                        nWhole = Math_floor(columnCount / sourceRange.colCount);
                        nPartial = columnCount % sourceRange.colCount;
                        if (nPartial !== 0)
                        {
                            throw new Error(_fillRangeHaveDifferentSizeErrorMessage);
                        }
                        if (nWhole > 1)
                        {
                            for (i = 1; i < nWhole; i++)
                            {
                                targetRange = __createRange(sourceRange.row, sourceRange.col + i * sourceRange.colCount, sourceRange.rowCount, sourceRange.colCount);
                                self.copyRange(sourceRange, targetRange, 1, 0)
                            }
                        }
                    }
                    else if (direction === 2)
                    {
                        if (self._worksheet._getSpanModel().hasSpans(row, column, rowCount - sourceRange.rowCount, columnCount))
                        {
                            throw new Error(_fillRangeHasMergedCellErrorMessage);
                        }
                        nWhole = Math_floor(rowCount / sourceRange.rowCount);
                        nPartial = rowCount % sourceRange.rowCount;
                        if (nPartial !== 0)
                        {
                            throw new Error(_fillRangeHaveDifferentSizeErrorMessage);
                        }
                        if (nWhole > 1)
                        {
                            for (i = 1; i < nWhole; i++)
                            {
                                targetRange = __createRange(sourceRange.row - i * sourceRange.rowCount, sourceRange.col, sourceRange.rowCount, sourceRange.colCount);
                                self.copyRange(sourceRange, targetRange, 0, 0)
                            }
                        }
                    }
                    else if (direction === 3)
                    {
                        if (self._worksheet._getSpanModel().hasSpans(row + sourceRange.rowCount, column, rowCount - sourceRange.rowCount, columnCount))
                        {
                            throw new Error(_fillRangeHasMergedCellErrorMessage);
                        }
                        nWhole = Math_floor(rowCount / sourceRange.rowCount);
                        nPartial = rowCount % sourceRange.rowCount;
                        if (nPartial !== 0)
                        {
                            throw new Error(_fillRangeHaveDifferentSizeErrorMessage);
                        }
                        if (nWhole > 1)
                        {
                            for (i = 1; i < nWhole; i++)
                            {
                                targetRange = __createRange(sourceRange.row + i * sourceRange.rowCount, sourceRange.col, sourceRange.rowCount, sourceRange.colCount);
                                self.copyRange(sourceRange, targetRange, 0, 0)
                            }
                        }
                    }
                };
                FillImp.prototype.getDirectionFillSourceRange = function(row, column, rowCount, columnCount, direction)
                {
                    var sourceRange = keyword_null;
                    if (direction === 0)
                    {
                        sourceRange = __createRange(row, column + columnCount - 1, rowCount, 1)
                    }
                    else if (direction === 1)
                    {
                        sourceRange = __createRange(row, column, rowCount, 1)
                    }
                    else if (direction === 2)
                    {
                        sourceRange = __createRange(row + rowCount - 1, column, 1, columnCount)
                    }
                    else if (direction === 3)
                    {
                        sourceRange = __createRange(row, column, 1, columnCount)
                    }
                    return this.inflateCellRange(sourceRange)
                };
                FillImp.prototype.inflateCellRange = function(range)
                {
                    var spans = this._worksheet.getSpans();
                    if (spans && range)
                    {
                        range = this._worksheet._cellRangeInflate(spans, range)
                    }
                    return range
                };
                FillImp.prototype.seriesFillRange = function(range, fillSeries, type, stepValue, stopValue, dateUnit)
                {
                    var self = this;
                    var newRange = self.fixRange(range);
                    var row = newRange.row,
                        column = newRange.col,
                        rowCount = newRange.rowCount,
                        columnCount = newRange.colCount,
                        sourceData,
                        targetData,
                        i;
                    if (self._worksheet._getSpanModel().hasSpans(row, column, rowCount, columnCount))
                    {
                        throw new Error(Sheets.SR.Exp_RangeContainsMergedCell);
                    }
                    if (fillSeries === 1)
                    {
                        for (var r = row; r < row + rowCount; r++)
                        {
                            sourceData = self.getSeriesSource(r, column, 1, 1, fillSeries);
                            if (sourceData && sourceData.dataCount() > 0)
                            {
                                targetData = self.calcSeriesData(sourceData, columnCount, type, stepValue, stopValue, dateUnit);
                                if (targetData && targetData.length > 0)
                                {
                                    for (i = 0; i < targetData.length; i++)
                                    {
                                        self.copyCell(self._worksheet, r, sourceData._indexes[0], r, column + i, sourceData.toActualValue(targetData[i]), type)
                                    }
                                }
                            }
                        }
                    }
                    else if (fillSeries === 0)
                    {
                        for (var c = column; c < column + columnCount; c++)
                        {
                            sourceData = self.getSeriesSource(row, c, 1, 1, fillSeries);
                            if (sourceData && sourceData.dataCount() > 0)
                            {
                                targetData = self.calcSeriesData(sourceData, rowCount, type, stepValue, stopValue, dateUnit);
                                if (targetData && targetData.length > 0)
                                {
                                    for (i = 0; i < targetData.length; i++)
                                    {
                                        self.copyCell(self._worksheet, sourceData._indexes[0], c, row + i, c, sourceData.toActualValue(targetData[i]), type)
                                    }
                                }
                            }
                        }
                    }
                };
                FillImp.prototype.calcSeriesData = function(sourceData, count, type, stepValue, stopValue, dateUnit)
                {
                    if (sourceData && sourceData.dataCount() > 0)
                    {
                        var newValues = [];
                        var initValue = sourceData._innerValues[0];
                        var currentValue = initValue;
                        for (var i = 0; i < count; i++)
                        {
                            if (stopValue === keyword_undefined || stopValue === keyword_null || currentValue <= stopValue)
                            {
                                newValues.push(currentValue);
                                if (type === 1)
                                {
                                    currentValue += stepValue
                                }
                                else if (type === 2)
                                {
                                    currentValue *= stepValue
                                }
                                else if (type === 3 && dateUnit !== keyword_undefined && dateUnit !== keyword_null)
                                {
                                    currentValue = this.getNextDateValue(dateUnit, initValue, currentValue, stepValue, i + 1)
                                }
                            }
                        }
                        return newValues
                    }
                    return keyword_null
                };
                FillImp.prototype.getNextDateValue = function(dateUnit, initValue, currentValue, stepValue, nextIndex)
                {
                    var nextValue = currentValue,
                        date;
                    if (dateUnit === 0)
                    {
                        date = __fromOADate(currentValue);
                        nextValue = __createDateTimeHelper(date.setDate(date.getDate() + stepValue)).toOADate()
                    }
                    else if (dateUnit === 1)
                    {
                        date = __fromOADate(currentValue);
                        var addValue = Math_abs(stepValue);
                        while (addValue > 0)
                        {
                            if (stepValue > 0)
                            {
                                date.setDate(date.getDate() + Math_min(1, addValue))
                            }
                            else
                            {
                                date.setDate(date.getDate() - Math_min(1, addValue))
                            }
                            if (date.getDay() !== 6 && date.getDay() !== 0)
                            {
                                addValue -= 1
                            }
                        }
                        nextValue = __createDateTimeHelper(date).toOADate()
                    }
                    else if (dateUnit === 2)
                    {
                        date = __fromOADate(initValue);
                        nextValue = __createDateTimeHelper(date.setMonth(date.getMonth() + Math_floor(nextIndex * stepValue))).toOADate()
                    }
                    else if (dateUnit === 3)
                    {
                        date = __fromOADate(initValue);
                        nextValue = __createDateTimeHelper(date.setFullYear(date.getFullYear() + Math_floor(nextIndex * stepValue))).toOADate()
                    }
                    return nextValue
                };
                return FillImp
            })();
        Sheets.FillImp = FillImp
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}));
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
        Sheets.feature("fill_ui", ["core.common", "core.sheet_action", "core.stringResource"]);
        (function(_FillSmartTag)
        {
            _FillSmartTag[_FillSmartTag["Tag"] = 0] = "Tag";
            _FillSmartTag[_FillSmartTag["Down"] = 1] = "Down"
        })(Sheets._FillSmartTag || (Sheets._FillSmartTag = {}));
        var _FillSmartTag = Sheets._FillSmartTag;
        var _GcFillDialog = (function(_super)
            {
                __extends(_GcFillDialog, _super);
                function _GcFillDialog(sheet, fillInfo)
                {
                    _super.call(this, Sheets.util.getPreferredZIndex(sheet && sheet.parent && sheet.parent._host));
                    var self = this;
                    self.eventNameSpace = ".ui-fill";
                    self.fillKeyDown = "keydown" + self.eventNameSpace;
                    self.sheet = sheet;
                    self.fillInfo = fillInfo;
                    self._initTagDialog()
                }
                _GcFillDialog.prototype._initTagDialog = function()
                {
                    var self = this;
                    self.tagContainer = self.getContainer().addClass("container-default-header tag-container no-user-select ui-widget-header btn btn-default");
                    self.smartTag = $("<img>").attr("src", _GcFillDialog.getImageSrc(0)).css("float", "left").appendTo(self.tagContainer);
                    self.smartTagDown = $("<img>").attr("src", _GcFillDialog.getImageSrc(1)).css({
                        float: "left", display: "none"
                    }).appendTo(self.tagContainer)
                };
                _GcFillDialog.prototype._registerEvent = function()
                {
                    var self = this,
                        device = Sheets.util.device(),
                        isSafariOnIpad = $.browser.safari && (device.ipad || device.iphone);
                    self.tagContainer.hover(function()
                    {
                        var hoverClassName = "ui-state-hover container-default-hover",
                            isTouchMode = self.sheet._isTouchMode,
                            hoverInWidth = isTouchMode ? "38px" : "32px",
                            hoverInHeight = isTouchMode ? "24px" : "18px";
                        if (self.menuDialog)
                        {
                            var isOpen = self.menuDialog.isOpen();
                            if (isOpen)
                            {
                                return
                            }
                        }
                        $(this).addClass(hoverClassName);
                        $(this).css({
                            width: hoverInWidth, height: hoverInHeight
                        });
                        if (!isSafariOnIpad)
                        {
                            self.smartTagDown.show()
                        }
                    }, function()
                    {
                        var hoverClassName = "ui-state-hover container-default-hover",
                            isTouchMode = self.sheet._isTouchMode,
                            hoverOutWidth = isTouchMode ? "24px" : "18px",
                            hoverOutHeight = isTouchMode ? "24px" : "18px";
                        if (self.menuDialog)
                        {
                            var isOpen = self.menuDialog.isOpen();
                            if (isOpen)
                            {
                                return
                            }
                        }
                        $(this).removeClass(hoverClassName);
                        $(this).css({
                            width: hoverOutWidth, height: hoverOutHeight
                        });
                        if (!isSafariOnIpad)
                        {
                            self.smartTagDown.hide()
                        }
                    });
                    self.tagContainer.toggle(function()
                    {
                        var toggleClassName = "ui-state-active container-default-active";
                        if (isSafariOnIpad)
                        {
                            self.smartTagDown.show()
                        }
                        $(this).addClass(toggleClassName);
                        self._openMenu();
                        self._initData()
                    }, function()
                    {
                        var toggleClassName = "ui-state-active container-default-active";
                        if (isSafariOnIpad)
                        {
                            self.smartTagDown.hide()
                        }
                        $(this).removeClass(toggleClassName);
                        self._closeMenu()
                    });
                    $(document).bind(self.fillKeyDown, function(event)
                    {
                        if (event.keyCode === 27)
                        {
                            if (self.menuDialog && self.menuDialog.isOpen())
                            {
                                self._closeMenu()
                            }
                            else
                            {
                                self.close()
                            }
                            Sheets.util.cancelDefault(event)
                        }
                    })
                };
                _GcFillDialog.prototype.open = function()
                {
                    var self = this,
                        sheet = self.sheet;
                    if (self.tagContainer)
                    {
                        var t = sheet._eventHandler._getCanvasOffset();
                        var x = self.fillInfo.x;
                        var y = self.fillInfo.y;
                        x += t.left;
                        y += t.top;
                        self.tagContainer.css({
                            left: x, top: y
                        });
                        self.show();
                        self._registerEvent();
                        var isTouchMode = sheet._isTouchMode,
                            margin = isTouchMode ? "3px" : "0px",
                            height = isTouchMode ? "24px" : "18px";
                        self.smartTag.css("margin", margin);
                        self.smartTagDown.css("height", height);
                        self._reset();
                        var tempSpread = sheet.parent
                    }
                };
                _GcFillDialog.prototype._initData = function()
                {
                    var fillType = this.fillInfo.fillType;
                    if (this.menuContainer)
                    {
                        var radio = this.menuContainer.find(":radio")[fillType];
                        if (radio && radio.checked === false)
                        {
                            radio.checked = true;
                            $(radio).change()
                        }
                    }
                };
                _GcFillDialog.prototype._openMenu = function()
                {
                    var self = this;
                    if (!self.menuDialog)
                    {
                        self.menuDialog = new _GcFillMenuDialog(self.sheet);
                        self.menuContainer = self.menuDialog.getContainer()
                    }
                    self.menuDialog.fillType = this.fillInfo.fillType;
                    var $tagContainer = $(self.tagContainer);
                    var left = $tagContainer.css("left");
                    var top = $tagContainer.css("top");
                    var topNumber = parseFloat(top);
                    if (!isNaN(topNumber))
                    {
                        top = topNumber + self.tagContainer.height() + 2
                    }
                    self.menuContainer.css({
                        left: left, top: top
                    });
                    self.menuDialog.show("normal");
                    self.menuDialog._attachEvent();
                    $(self.menuDialog).unbind("fillTypeChanged");
                    $(self.menuDialog).bind("fillTypeChanged", function(e, args)
                    {
                        self.fillInfo.fillType = args
                    })
                };
                _GcFillDialog.prototype._closeMenu = function()
                {
                    if (this.menuDialog)
                    {
                        this.menuDialog.close()
                    }
                };
                _GcFillDialog.prototype._reset = function()
                {
                    var self = this;
                    if (self.menuDialog)
                    {
                        var isOpen = self.menuDialog.isOpen();
                        if (isOpen)
                        {
                            self.tagContainer.click()
                        }
                        self.tagContainer.mouseleave()
                    }
                };
                _GcFillDialog.prototype.close = function()
                {
                    var self = this;
                    self._reset();
                    $(document).unbind(self.fillKeyDown);
                    _super.prototype.close.call(this);
                    if (self.sheet)
                    {
                        self.sheet.setFocus()
                    }
                };
                _GcFillDialog.getImageSrc = function(state)
                {
                    if (state === 0)
                    {
                        return "data:image/png;base64,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"
                    }
                    else if (state === 1)
                    {
                        return "data:image/png;base64,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"
                    }
                    return ""
                };
                return _GcFillDialog
            })(Sheets.BaseDialog);
        Sheets._GcFillDialog = _GcFillDialog;
        var _GcFillMenuDialog = (function(_super)
            {
                __extends(_GcFillMenuDialog, _super);
                function _GcFillMenuDialog(sheet)
                {
                    _super.call(this, Sheets.util.getPreferredZIndex(sheet && sheet.parent && sheet.parent._host));
                    this.sheet = sheet;
                    this.init()
                }
                _GcFillMenuDialog.prototype.init = function()
                {
                    var self = this;
                    self.itemClass = "fill-type-item";
                    self.menuClass = "wijspread-fill-menu-container";
                    self.smartTagContainer = $(".tag-container");
                    self._initMenuDialog()
                };
                _GcFillMenuDialog.prototype.show = function(speed)
                {
                    if (arguments.length === 0)
                    {
                        return
                    }
                    _super.prototype.show.call(this, speed)
                };
                _GcFillMenuDialog.prototype._initMenuDialog = function()
                {
                    var self = this;
                    self.menuContainer = self.getContainer();
                    self.menuContainer.addClass(self.menuClass);
                    self.copyCells = self._createMenuItem("smartMenuCopyCells", self.itemClass, Sheets.SR.CopyCells, "0", true).appendTo(self.menuContainer);
                    self.fillSeries = self._createMenuItem("smartMenuFillSeries", self.itemClass, Sheets.SR.FillSeries, "1").appendTo(self.menuContainer);
                    self.fillFormattingOnly = self._createMenuItem("smartMenuFillFormattingOnly", self.itemClass, Sheets.SR.FillFormattingOnly, "2").appendTo(self.menuContainer);
                    self.fillWithoutFormatting = self._createMenuItem("smartMenuFillWithoutFormatting", self.itemClass, Sheets.SR.FillWithoutFormatting, "3").appendTo(self.menuContainer)
                };
                _GcFillMenuDialog.prototype._createMenuItem = function(id, itemClass, text, inputValue, checked)
                {
                    var isTouchMode = this.sheet._isTouchMode;
                    var width = isTouchMode ? "160px" : "150px";
                    var height = isTouchMode ? "25px" : "20px";
                    var outerDiv = $("<div>").css({
                            display: 'block', width: width, height: height, padding: 0, margin: 0
                        }).addClass("container-default-state " + itemClass + " ui-state-default btn btn-default");
                    var inputDiv = $("<div>").addClass("menu-item-input").appendTo(outerDiv);
                    var spanDiv = $("<div>").addClass("menu-item-text").appendTo(outerDiv);
                    var itemInput = $("<input>").attr({
                            id: id, value: inputValue, type: "radio", name: "fill-group", style: "display:none"
                        }).appendTo(inputDiv);
                    var itemSpan = $("<span>").text(text).appendTo(spanDiv);
                    if (checked)
                    {
                        inputDiv.addClass("check-image ui-icon ui-icon-check");
                        itemInput.prop("checked", "checked")
                    }
                    else
                    {
                        itemInput.prop("checked", "")
                    }
                    return outerDiv
                };
                _GcFillMenuDialog.prototype._attachEvent = function()
                {
                    var self = this;
                    var $smartMenuItem = $("." + self.itemClass);
                    $smartMenuItem.hover(function()
                    {
                        var className = "ui-state-hover container-default-hover";
                        $(this).addClass(className)
                    }, function()
                    {
                        var className = "ui-state-hover container-default-hover";
                        $(this).removeClass(className)
                    });
                    $smartMenuItem.click(function()
                    {
                        var className = "ui-state-hover container-default-hover";
                        var radioArray = $(this).find(":radio");
                        var radio = radioArray[0];
                        radio.checked = true;
                        radioArray.change();
                        self.smartTagContainer.click();
                        self.smartTagContainer.mouseleave();
                        $(this).removeClass(className);
                        var fillType = parseInt(radio.value, 10);
                        self._changeFill(fillType)
                    });
                    var smartMenuRadio = self.menuContainer.find(":radio");
                    $(smartMenuRadio).change(function()
                    {
                        var smartMenuRadioClassName = "ui-icon ui-icon-check" + " check-image";
                        $(".menu-item-input").removeClass(smartMenuRadioClassName);
                        $(this).parent().addClass(smartMenuRadioClassName)
                    })
                };
                _GcFillMenuDialog.prototype._changeFill = function(fillType)
                {
                    if (this.fillType === fillType)
                    {
                        return
                    }
                    this.fillType = fillType;
                    var sheet = this.sheet;
                    var fillUndoAction = new Sheets.UndoRedo.FillUndoAction(sheet, fillType, true, sheet._eventHandler._currentFillRange);
                    sheet._doCommand(fillUndoAction);
                    $(this).trigger("fillTypeChanged", fillType)
                };
                _GcFillMenuDialog.prototype.isOpen = function()
                {
                    if ($("." + this.menuClass).length > 0)
                    {
                        return true
                    }
                    return false
                };
                return _GcFillMenuDialog
            })(Sheets.BaseDialog)
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

