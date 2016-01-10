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
        Sheets.feature("conditionalFormat", ["core.common", "core.globalize", "core.stringResource", "core.theme", "core.imageLoader"]);
        var keyword_null = null,
            keyword_undefined = undefined,
            const_undefined = "undefined",
            Math_min = Math.min,
            Math_max = Math.max,
            Math_abs = Math.abs,
            Math_floor = Math.floor,
            CalcConvert = Sheets.Calc.Convert;
        var StringHelper_TrimStart = Sheets.StringHelper.TrimStart;
        (function(ConditionType)
        {
            ConditionType[ConditionType["RelationCondition"] = 0] = "RelationCondition";
            ConditionType[ConditionType["NumberCondition"] = 1] = "NumberCondition";
            ConditionType[ConditionType["TextCondition"] = 2] = "TextCondition";
            ConditionType[ConditionType["ColorCondition"] = 3] = "ColorCondition";
            ConditionType[ConditionType["FormulaCondition"] = 4] = "FormulaCondition";
            ConditionType[ConditionType["DateCondition"] = 5] = "DateCondition";
            ConditionType[ConditionType["DateExCondition"] = 6] = "DateExCondition";
            ConditionType[ConditionType["TextLengthCondition"] = 7] = "TextLengthCondition";
            ConditionType[ConditionType["Top10Condition"] = 8] = "Top10Condition";
            ConditionType[ConditionType["UniqueCondition"] = 9] = "UniqueCondition";
            ConditionType[ConditionType["AverageCondition"] = 10] = "AverageCondition";
            ConditionType[ConditionType["CellValueCondition"] = 11] = "CellValueCondition";
            ConditionType[ConditionType["AreaCondition"] = 12] = "AreaCondition"
        })(Sheets.ConditionType || (Sheets.ConditionType = {}));
        var ConditionType = Sheets.ConditionType;
        (function(RuleType)
        {
            RuleType[RuleType["ConditionRuleBase"] = 0] = "ConditionRuleBase";
            RuleType[RuleType["CellValueRule"] = 1] = "CellValueRule";
            RuleType[RuleType["SpecificTextRule"] = 2] = "SpecificTextRule";
            RuleType[RuleType["FormulaRule"] = 3] = "FormulaRule";
            RuleType[RuleType["DateOccurringRule"] = 4] = "DateOccurringRule";
            RuleType[RuleType["Top10Rule"] = 5] = "Top10Rule";
            RuleType[RuleType["UniqueRule"] = 6] = "UniqueRule";
            RuleType[RuleType["DuplicateRule"] = 7] = "DuplicateRule";
            RuleType[RuleType["AverageRule"] = 8] = "AverageRule";
            RuleType[RuleType["ScaleRule"] = 9] = "ScaleRule";
            RuleType[RuleType["TwoScaleRule"] = 10] = "TwoScaleRule";
            RuleType[RuleType["ThreeScaleRule"] = 11] = "ThreeScaleRule";
            RuleType[RuleType["DataBarRule"] = 12] = "DataBarRule";
            RuleType[RuleType["IconSetRule"] = 13] = "IconSetRule"
        })(Sheets.RuleType || (Sheets.RuleType = {}));
        var RuleType = Sheets.RuleType;
        var ConditionRuleBase = (function()
            {
                function ConditionRuleBase(style)
                {
                    var self = this;
                    self.condition = keyword_null;
                    self.ranges = keyword_null;
                    self.style = keyword_null;
                    self._priority = 1;
                    self._stopIfTrue = false;
                    self.style = style
                }
                ConditionRuleBase.prototype.hasNoReference = function()
                {
                    return !(this.ranges && this.ranges.length > 0)
                };
                ConditionRuleBase.prototype.evaluate = function(evaluator, baseRow, baseColumn, actual)
                {
                    var self = this;
                    if (self.contains(baseRow, baseColumn))
                    {
                        self.initCondition();
                        var baseCoord = {
                                baseRow: 0, baseCol: 0
                            };
                        self.getBaseCoordinate(baseCoord);
                        self.condition.adjustOffset(baseRow - baseCoord.baseRow, baseColumn - baseCoord.baseCol);
                        var result = keyword_null;
                        if (self.condition.evaluate(evaluator, baseRow, baseColumn, actual))
                        {
                            result = self.getExpected()
                        }
                        self.condition.adjustOffset(0, 0);
                        return result
                    }
                    return keyword_null
                };
                ConditionRuleBase.prototype.contains = function(row, column)
                {
                    var ranges = this.ranges;
                    if (ranges)
                    {
                        var count = ranges.length,
                            range;
                        for (var i = 0; i < count; i++)
                        {
                            range = this.ranges[i];
                            if (range.contains(row, column))
                            {
                                return true
                            }
                        }
                    }
                    return false
                };
                ConditionRuleBase.prototype.createCondition = function()
                {
                    return null
                };
                ConditionRuleBase.prototype.initCondition = function()
                {
                    if (!this.condition)
                    {
                        this.condition = this.createCondition()
                    }
                };
                ConditionRuleBase.prototype.priority = function()
                {
                    return this._priority
                };
                ConditionRuleBase.prototype.stopIfTrue = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._stopIfTrue
                    }
                    else
                    {
                        this._stopIfTrue = value;
                        return this
                    }
                };
                ConditionRuleBase.prototype.getExpected = function()
                {
                    return this.style
                };
                ConditionRuleBase.prototype.reset = function()
                {
                    var self = this;
                    self.ranges = keyword_null;
                    self.condition = keyword_null;
                    self.style = keyword_null;
                    self._stopIfTrue = false;
                    self._priority = 1
                };
                ConditionRuleBase.prototype.intersects = function(row, column, rowCount, columnCount)
                {
                    var ranges = this.ranges;
                    if (ranges)
                    {
                        var count = ranges.length,
                            cs;
                        for (var n = 0; n < count; n++)
                        {
                            cs = ranges[n];
                            if (cs.intersect(row, column, rowCount, columnCount))
                            {
                                return true
                            }
                        }
                    }
                    return false
                };
                ConditionRuleBase.prototype.isScaleRule = function()
                {
                    return false
                };
                ConditionRuleBase.prototype.getBaseCoordinate = function(baseCoord)
                {
                    baseCoord.baseRow = Number.MAX_VALUE;
                    baseCoord.baseCol = Number.MAX_VALUE;
                    var self = this;
                    if (self.ranges && self.ranges.length > 0)
                    {
                        for (var i = 0; i < self.ranges.length; i++)
                        {
                            var range = self.ranges[i];
                            baseCoord.baseRow = Math_min(range.row, baseCoord.baseRow);
                            baseCoord.baseCol = Math_min(range.col, baseCoord.baseCol)
                        }
                    }
                    else
                    {
                        baseCoord.baseRow = 0;
                        baseCoord.baseCol = 0
                    }
                };
                ConditionRuleBase.prototype._addRows = function(row, rowCount)
                {
                    var self = this;
                    if (self.ranges)
                    {
                        var length = self.ranges.length;
                        for (var i = 0; i < length; i++)
                        {
                            var range = self.ranges[i];
                            if (range.row >= row)
                            {
                                self.ranges[i] = new Sheets.Range(range.row + rowCount, range.col, range.rowCount, range.colCount)
                            }
                            else if (range.row < row && row < range.row + range.rowCount)
                            {
                                self.ranges[i] = new Sheets.Range(range.row, range.col, range.rowCount + rowCount, range.colCount)
                            }
                        }
                    }
                };
                ConditionRuleBase.prototype._addColumns = function(col, colCount)
                {
                    var self = this;
                    if (self.ranges)
                    {
                        var length = self.ranges.length;
                        for (var i = 0; i < length; i++)
                        {
                            var range = self.ranges[i];
                            if (range.col >= col)
                            {
                                self.ranges[i] = new Sheets.Range(range.row, range.col + colCount, range.rowCount, range.colCount)
                            }
                            else if (range.col < col && col < range.col + range.colCount)
                            {
                                self.ranges[i] = new Sheets.Range(range.row, range.col, range.rowCount, range.colCount + colCount)
                            }
                        }
                    }
                };
                ConditionRuleBase.prototype._removeRows = function(row, rowCount)
                {
                    var self = this;
                    if (self.ranges)
                    {
                        var delList = [];
                        var length = self.ranges.length;
                        for (var i = 0; i < length; i++)
                        {
                            var range = self.ranges[i];
                            if (range.row > row)
                            {
                                if (range.row + range.rowCount <= row + rowCount)
                                {
                                    delList.push(range)
                                }
                                else
                                {
                                    self.ranges[i] = new Sheets.Range(range.row - rowCount, range.col, range.rowCount, range.colCount)
                                }
                            }
                            else if (range.row <= row && row < range.row + range.rowCount)
                            {
                                var newRange = new Sheets.Range(range.row, range.col, range.rowCount - Math_min(range.row + range.rowCount - row, rowCount), range.colCount);
                                if (newRange.colCount === 0 || newRange.rowCount === 0)
                                {
                                    delList.push(range)
                                }
                                else
                                {
                                    self.ranges[i] = newRange
                                }
                            }
                        }
                        var len = delList.length;
                        for (var j = 0; j < len; j++)
                        {
                            var delRange = delList[j];
                            Sheets.ArrayHelper.remove(self.ranges, delRange)
                        }
                    }
                };
                ConditionRuleBase.prototype._removeColumns = function(col, colCount)
                {
                    var self = this;
                    if (self.ranges)
                    {
                        var delList = [];
                        var length = self.ranges.length;
                        for (var i = 0; i < length; i++)
                        {
                            var range = self.ranges[i];
                            if (range.col > col)
                            {
                                if (range.col + range.colCount <= col + colCount)
                                {
                                    delList.push(range)
                                }
                                else
                                {
                                    self.ranges[i] = new Sheets.Range(range.row, range.col - colCount, range.rowCount, range.colCount)
                                }
                            }
                            else if (range.col <= col && col < range.col + range.colCount)
                            {
                                var newRange = new Sheets.Range(range.row, range.col, range.rowCount, range.colCount - Math_min(range.col + range.colCount - col, colCount));
                                if (newRange.colCount === 0 || newRange.rowCount === 0)
                                {
                                    delList.push(range)
                                }
                                else
                                {
                                    self.ranges[i] = newRange
                                }
                            }
                        }
                        var len = delList.length;
                        for (var j = 0; j < len; j++)
                        {
                            var delRange = delList[j];
                            Sheets.ArrayHelper.remove(self.ranges, delRange)
                        }
                    }
                };
                ConditionRuleBase.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"ranges":
                            return value === keyword_null;
                        case"style":
                            return value === keyword_null;
                        case"priority":
                            return value === 1;
                        case"stopIfTrue":
                            return value === false;
                        default:
                            return false
                    }
                };
                ConditionRuleBase.prototype.toJSON = function(){};
                ConditionRuleBase.prototype.fromJSON = function(settings, isNoneSchema){};
                return ConditionRuleBase
            })();
        Sheets.ConditionRuleBase = ConditionRuleBase;
        var RelationCondition = (function()
            {
                function RelationCondition(compareType, item1, item2)
                {
                    var self = this;
                    self.conditionType = "RelationCondition";
                    self.compareType = 1;
                    self.item1 = keyword_null;
                    self.item2 = keyword_null;
                    self.ignoreBlank = false;
                    self._dict = keyword_null;
                    self.compareType = compareType;
                    self.item1 = item1;
                    self.item2 = item2
                }
                RelationCondition.prototype.adjustOffset = function(row, col){};
                RelationCondition.prototype.create = function(compareType, item1, item2)
                {
                    return new RelationCondition(compareType, item1, item2)
                };
                RelationCondition.prototype._getActualValue = function(evaluator, item, baseRow, baseColumn, actualValue)
                {
                    if (evaluator && item)
                    {
                        if (item.conditionType === "ColorCondition")
                        {
                            var style = evaluator.getActualStyle(baseRow, baseColumn);
                            if (style)
                            {
                                if (item.compareType === 0)
                                {
                                    actualValue = style.backColor
                                }
                                else if (item.compareType === 1)
                                {
                                    actualValue = style.foreColor
                                }
                            }
                        }
                    }
                    return actualValue
                };
                RelationCondition.prototype.evaluate = function(evaluator, baseRow, baseColumn, actualValue1, actualValue2)
                {
                    var self = this;
                    var value1,
                        value2;
                    if (self.item1)
                    {
                        self.item1.ignoreBlank = self.ignoreBlank;
                        if (arguments.length < 5)
                        {
                            value1 = self._getActualValue(evaluator, self.item1, baseRow, baseColumn, actualValue1)
                        }
                        else
                        {
                            value1 = actualValue1
                        }
                    }
                    if (self.item2)
                    {
                        self.item2.ignoreBlank = self.ignoreBlank;
                        if (arguments.length < 5)
                        {
                            value2 = self._getActualValue(evaluator, self.item2, baseRow, baseColumn, actualValue1)
                        }
                        else
                        {
                            value2 = actualValue2
                        }
                    }
                    var c1,
                        c2;
                    if (self.compareType === 1)
                    {
                        c1 = (self.item1 === keyword_undefined || self.item1 === keyword_null) ? false : self.item1.evaluate(evaluator, baseRow, baseColumn, value1);
                        if (!c1)
                        {
                            return false
                        }
                        c2 = (self.item2 === keyword_undefined || self.item2 === keyword_null) ? false : self.item2.evaluate(evaluator, baseRow, baseColumn, value2);
                        return c2
                    }
                    else if (self.compareType === 0)
                    {
                        c1 = (self.item1 === keyword_undefined || self.item1 === keyword_null) ? false : self.item1.evaluate(evaluator, baseRow, baseColumn, value1);
                        if (c1)
                        {
                            return true
                        }
                        c2 = (self.item2 === keyword_undefined || self.item2 === keyword_null) ? false : self.item2.evaluate(evaluator, baseRow, baseColumn, value2);
                        return c2
                    }
                    return false
                };
                RelationCondition.prototype.reset = function()
                {
                    var self = this;
                    self.ignoreBlank = false;
                    self.compareType = 1;
                    self.item1 = keyword_null;
                    self.item2 = keyword_null
                };
                RelationCondition.prototype._getConditionTypeDictionary = function()
                {
                    if (!this._dict)
                    {
                        var dict = {};
                        dict[0] = RelationCondition;
                        dict[1] = NumberCondition;
                        dict[2] = TextCondition;
                        dict[3] = ColorCondition;
                        dict[4] = FormulaCondition;
                        dict[5] = DateCondition;
                        dict[6] = DateExCondition;
                        dict[7] = TextLengthCondition;
                        dict[8] = Top10Condition;
                        dict[9] = UniqueCondition;
                        dict[10] = AverageCondition;
                        dict[11] = CellValueCondition;
                        dict[12] = AreaCondition;
                        this._dict = dict
                    }
                    return this._dict
                };
                RelationCondition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            compareType: self.compareType, item1: self.item1 ? self.item1.toJSON() : keyword_null, item2: self.item2 ? self.item2.toJSON() : keyword_null, conType: 0, ignoreBlank: self.ignoreBlank
                        };
                    var setting = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            setting[item] = value
                        }
                    }
                    if ($.isEmptyObject(setting))
                    {
                        return keyword_undefined
                    }
                    return setting
                };
                RelationCondition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"ignoreBlank":
                            return value === false;
                        case"item1":
                            return value === keyword_null;
                        case"item2":
                            return value === keyword_null;
                        default:
                            return false
                    }
                };
                RelationCondition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.compareType !== keyword_null && settings.compareType !== keyword_undefined)
                    {
                        self.compareType = settings.compareType
                    }
                    if (settings.item1 !== keyword_null && settings.item1 !== keyword_undefined)
                    {
                        var condition = keyword_null;
                        var dict = self._getConditionTypeDictionary();
                        var conType1 = settings.item1.conType;
                        if (typeof conType1 === const_undefined)
                        {
                            conType1 = 0
                        }
                        var conditionClass = dict[conType1];
                        if (conditionClass)
                        {
                            condition = new conditionClass;
                            condition.fromJSON(settings.item1, isNoneSchema)
                        }
                        self.item1 = condition
                    }
                    if (settings.item2 !== keyword_null && settings.item2 !== keyword_undefined)
                    {
                        var condition = keyword_null;
                        var dict = self._getConditionTypeDictionary();
                        var conType2 = settings.item2.conType;
                        if (typeof conType2 === const_undefined)
                        {
                            conType2 = 0
                        }
                        var conditionClass = dict[conType2];
                        if (conditionClass)
                        {
                            condition = new conditionClass;
                            condition.fromJSON(settings.item2, isNoneSchema)
                        }
                        self.item2 = condition
                    }
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        self.ignoreBlank = settings.ignoreBlank
                    }
                };
                RelationCondition.prototype.getFormulas = function()
                {
                    var result = [],
                        self = this;
                    if (self.item1 && self.item1.getFormulas)
                    {
                        result = this.item1.getFormulas()
                    }
                    if (self.item2 && self.item2.getFormulas)
                    {
                        if (result.length > 0)
                        {
                            result = result.concat(this.item2.getFormulas())
                        }
                        else
                        {
                            result = this.item2.getFormulas()
                        }
                    }
                    return result
                };
                RelationCondition.prototype.setFormulas = function(formulas)
                {
                    var self = this;
                    if (self.item1 && self.item1.getFormulas && self.item2 && self.item2.getFormulas)
                    {
                        var length1 = self.item1.getFormulas().length;
                        if (length1 !== 0)
                        {
                            self.item1.setFormulas(formulas.slice(0, length1))
                        }
                        self.item2.setFormulas(formulas.slice(length1))
                    }
                    else if (self.item1 && self.item1.setFormulas)
                    {
                        self.item1.setFormulas(formulas)
                    }
                    else if (self.item2 && self.item2.setFormulas)
                    {
                        self.item2.setFormulas(formulas)
                    }
                };
                return RelationCondition
            })();
        Sheets.RelationCondition = RelationCondition;
        var CellValueRule = (function(_super)
            {
                __extends(CellValueRule, _super);
                function CellValueRule(operator, value1, value2, style)
                {
                    _super.call(this, style);
                    this.operator = operator;
                    this.value1 = (typeof(value1) === "string") ? $.trim(value1) : value1;
                    this.value2 = (typeof(value2) === "string") ? $.trim(value2) : value2
                }
                CellValueRule.prototype.createCondition = function()
                {
                    var self = this;
                    var formula1 = self.isFormula(self.value1) ? StringHelper_TrimStart(self.value1, "=") : keyword_null;
                    var expect1 = self.isFormula(self.value1) ? keyword_null : self.value1;
                    var formula2 = self.isFormula(self.value2) ? StringHelper_TrimStart(self.value2, "=") : keyword_null;
                    var expect2 = self.isFormula(self.value2) ? keyword_null : self.value2;
                    var condition1,
                        condition2;
                    var op = self.operator,
                        compareType = keyword_null;
                    if (op === 6)
                    {
                        condition1 = new CellValueCondition(3, self.value1, formula1);
                        condition1.treatNullValueAsZero = true;
                        condition2 = new CellValueCondition(5, self.value2, formula2);
                        condition2.treatNullValueAsZero = true;
                        return new RelationCondition(1, condition1, condition2)
                    }
                    else if (op === 7)
                    {
                        condition1 = new CellValueCondition(4, self.value1, formula1);
                        condition1.treatNullValueAsZero = true;
                        condition2 = new CellValueCondition(2, self.value2, formula2);
                        condition2.treatNullValueAsZero = true;
                        return new RelationCondition(0, condition1, condition2)
                    }
                    else if (op === 0)
                    {
                        compareType = 0
                    }
                    else if (op === 2)
                    {
                        compareType = 2
                    }
                    else if (op === 3)
                    {
                        compareType = 3
                    }
                    else if (op === 4)
                    {
                        compareType = 4
                    }
                    else if (op === 5)
                    {
                        compareType = 5
                    }
                    else if (op === 1)
                    {
                        compareType = 1
                    }
                    if (compareType !== keyword_null)
                    {
                        var t = new CellValueCondition(compareType, self.value1, formula1);
                        t.treatNullValueAsZero = true;
                        return t
                    }
                    return keyword_null
                };
                CellValueRule.prototype.reset = function()
                {
                    var self = this;
                    self.operator = 6;
                    self.value1 = keyword_null;
                    self.value2 = keyword_null;
                    self.style = keyword_null;
                    self._stopIfTrue = false;
                    self._priority = 1
                };
                CellValueRule.prototype.isFormula = function(val)
                {
                    return (val !== keyword_undefined && val !== keyword_null) && (val[0] === "=")
                };
                CellValueRule.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ruleType: 1, ranges: self.ranges, style: self.style, operator: self.operator, value1: self.value1, value2: self.value2, priority: self._priority, stopIfTrue: self._stopIfTrue
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    if ($.isEmptyObject(settings))
                    {
                        return keyword_undefined
                    }
                    return settings
                };
                CellValueRule.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.style)
                    {
                        self.style = new Sheets.Style;
                        self.style.fromJSON(settings.style, isNoneSchema)
                    }
                    if (settings.operator !== keyword_null && settings.operator !== keyword_undefined)
                    {
                        self.operator = settings.operator
                    }
                    if (settings.value1 !== keyword_null && settings.value1 !== keyword_undefined)
                    {
                        self.value1 = settings.value1
                    }
                    if (settings.value2 !== keyword_null && settings.value2 !== keyword_undefined)
                    {
                        self.value2 = settings.value2
                    }
                    if (settings.priority !== keyword_null && settings.priority !== keyword_undefined)
                    {
                        self._priority = settings.priority
                    }
                    if (settings.stopIfTrue !== keyword_null && settings.stopIfTrue !== keyword_undefined)
                    {
                        self._stopIfTrue = settings.stopIfTrue
                    }
                };
                return CellValueRule
            })(ConditionRuleBase);
        Sheets.CellValueRule = CellValueRule;
        var CellValueCondition = (function()
            {
                function CellValueCondition(compareType, expected, formula)
                {
                    var self = this;
                    self.compareType = keyword_null;
                    self.treatNullValueAsZero = false;
                    self.compareType = compareType;
                    self.expected = expected;
                    self.formula = formula
                }
                CellValueCondition.prototype.adjustOffset = function(row, col){};
                CellValueCondition.prototype.getExpected = function(evaluator, baseRow, baseColumn, isArrayFormula)
                {
                    var self = this;
                    if (self.formula && self.formula.length > 0)
                    {
                        var calcService = evaluator.getCalcService();
                        if (!calcService)
                        {
                            return self.expected
                        }
                        var expr = calcService.parse(keyword_null, self.formula, baseRow, baseColumn);
                        return calcService.evaluateParsedFormula(evaluator._getSheetSource(), expr, baseRow, baseColumn, false)
                    }
                    else
                    {
                        return self.expected
                    }
                };
                CellValueCondition.prototype.evaluate = function(evaluator, baseRow, baseColumn, actualValue)
                {
                    var expected = this.getExpected(evaluator, baseRow, baseColumn);
                    return this.checkCondition(expected, actualValue)
                };
                CellValueCondition.prototype.isSatisfyingCondition = function(value)
                {
                    var expected = this.getExpected(keyword_null, 0, 0);
                    return this.checkCondition(expected, value)
                };
                CellValueCondition.prototype.checkCondition = function(expectedValue, actualValue)
                {
                    var self = this;
                    var dActualValue = 0;
                    var isNumber = false;
                    if (typeof expectedValue === "boolean")
                    {
                        var expectedbooleanValue = expectedValue;
                        switch (self.compareType)
                        {
                            case 0:
                                return actualValue === expectedValue;
                            case 1:
                                return actualValue !== expectedValue;
                            case 2:
                                return self._compareBool(expectedbooleanValue, actualValue) < 0;
                            case 3:
                                return self._compareBool(expectedbooleanValue, actualValue) <= 0;
                            case 4:
                                return self._compareBool(expectedbooleanValue, actualValue) > 0;
                            case 5:
                                return !!self._compareBool(expectedbooleanValue, actualValue);
                            default:
                                break
                        }
                    }
                    try
                    {
                        if (actualValue === keyword_undefined || actualValue === keyword_null)
                        {
                            if (self.treatNullValueAsZero)
                            {
                                isNumber = true;
                                dActualValue = 0
                            }
                            else
                            {
                                isNumber = false;
                                dActualValue = actualValue
                            }
                        }
                        else
                        {
                            var dValue = {value: undefined};
                            if (CalcConvert.rD(actualValue, dValue))
                            {
                                dActualValue = dValue.value;
                                isNumber = !isNaN(dActualValue)
                            }
                            else
                            {
                                isNumber = false
                            }
                        }
                    }
                    catch(err)
                    {
                        isNumber = false
                    }
                    if ((actualValue === keyword_undefined || actualValue === keyword_null) && (expectedValue === keyword_undefined || expectedValue === keyword_null))
                    {
                        switch (self.compareType)
                        {
                            case 0:
                            case 3:
                            case 5:
                                return true;
                            case 1:
                            case 2:
                            case 4:
                                return false;
                            default:
                                return false
                        }
                    }
                    if (isNumber)
                    {
                        var doubleExpectedValue = 0.0;
                        var expIsNumber = false;
                        try
                        {
                            var dValue = {value: undefined};
                            if (CalcConvert.rD(expectedValue, dValue))
                            {
                                doubleExpectedValue = dValue.value;
                                expIsNumber = true
                            }
                        }
                        catch(ex) {}
                        if (!expIsNumber)
                        {
                            switch (self.compareType)
                            {
                                case 0:
                                    return false;
                                case 1:
                                    return true
                            }
                            return false
                        }
                        switch (self.compareType)
                        {
                            case 0:
                                return dActualValue === doubleExpectedValue;
                            case 1:
                                return dActualValue !== doubleExpectedValue;
                            case 2:
                                return dActualValue > doubleExpectedValue;
                            case 3:
                                return dActualValue >= doubleExpectedValue;
                            case 4:
                                return dActualValue < doubleExpectedValue;
                            case 5:
                                return dActualValue <= doubleExpectedValue
                        }
                    }
                    else if (typeof(actualValue) === "string")
                    {
                        var stringExpectedValue = keyword_null;
                        if (typeof(expectedValue) === "string")
                        {
                            stringExpectedValue = expectedValue
                        }
                        else
                        {
                            switch (self.compareType)
                            {
                                case 0:
                                    return false;
                                case 1:
                                    return true
                            }
                            return false
                        }
                        var stringActualValue = actualValue;
                        switch (self.compareType)
                        {
                            case 0:
                                return stringActualValue === stringExpectedValue;
                            case 1:
                                return stringActualValue !== stringExpectedValue;
                            case 2:
                                return stringExpectedValue < stringActualValue;
                            case 3:
                                return stringExpectedValue <= stringActualValue;
                            case 4:
                                return stringExpectedValue > stringActualValue;
                            case 5:
                                return stringExpectedValue >= stringActualValue
                        }
                    }
                    return false
                };
                CellValueCondition.prototype._compareBool = function(value1, value2)
                {
                    if (value1 === value2)
                    {
                        return 0
                    }
                    else if (value1 === false && value2 === true)
                    {
                        return -1
                    }
                    else
                    {
                        return 1
                    }
                };
                CellValueCondition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"treatNullValueAsZero":
                            return value === false;
                        default:
                            return false
                    }
                };
                CellValueCondition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            compareType: self.compareType, expected: self.expected, formula: self.formula, conType: 11, treatNullValueAsZero: self.treatNullValueAsZero
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    if ($.isEmptyObject(settings))
                    {
                        return keyword_undefined
                    }
                    return settings
                };
                CellValueCondition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.compareType !== keyword_null && settings.compareType !== keyword_undefined)
                    {
                        self.compareType = settings.compareType
                    }
                    if (settings.expected !== keyword_null && settings.expected !== keyword_undefined)
                    {
                        self.expected = settings.expected
                    }
                    if (settings.formula !== keyword_null && settings.formula !== keyword_undefined)
                    {
                        self.formula = settings.formula
                    }
                    if (settings.treatNullValueAsZero !== keyword_null && settings.treatNullValueAsZero !== keyword_undefined)
                    {
                        self.treatNullValueAsZero = settings.treatNullValueAsZero
                    }
                };
                CellValueCondition.prototype.getFormulas = function()
                {
                    return this.formula ? [this.formula] : []
                };
                CellValueCondition.prototype.setFormulas = function(formulas)
                {
                    this.formula = formulas[0]
                };
                return CellValueCondition
            })();
        Sheets.CellValueCondition = CellValueCondition;
        var NumberCondition = (function()
            {
                function NumberCondition(compareType, expected, formula)
                {
                    var self = this;
                    self.compareType = 0;
                    self.conditionType = "NumberCondition";
                    self.ignoreBlank = false;
                    self.integerValue = false;
                    self.compareType = compareType;
                    self.expected = expected;
                    self.formula = (typeof(formula) === "string") ? StringHelper_TrimStart($.trim(formula), "=") : formula
                }
                NumberCondition.prototype.evaluate = function(evaluator, baseRow, basecol, actualValue)
                {
                    var expected = this.getExpected(evaluator, baseRow, basecol);
                    if (this.integerValue)
                    {
                        if (isNaN(expected))
                        {
                            expected = keyword_null
                        }
                        else
                        {
                            expected = parseInt(expected, 10)
                        }
                    }
                    return this.checkCondition(expected, actualValue)
                };
                NumberCondition.prototype.checkCondition = function(expectedValue, actualValue)
                {
                    var self = this;
                    if ((actualValue === keyword_undefined || actualValue === keyword_null || actualValue === "") && self.ignoreBlank)
                    {
                        return true
                    }
                    if (isNaN(actualValue))
                    {
                        return false
                    }
                    if (expectedValue === keyword_undefined || expectedValue === keyword_null)
                    {
                        if (self.ignoreBlank)
                        {
                            return true
                        }
                        else
                        {
                            expectedValue = 0
                        }
                    }
                    var doubleCellValue = 0.0;
                    try
                    {
                        doubleCellValue = parseFloat(actualValue)
                    }
                    catch(e)
                    {
                        return false
                    }
                    if (self.integerValue === true)
                    {
                        var isValueInteger = ((doubleCellValue - Math_floor(doubleCellValue)) === 0);
                        if (isValueInteger === false)
                        {
                            return false
                        }
                    }
                    switch (self.compareType)
                    {
                        case 0:
                            return doubleCellValue === expectedValue;
                        case 1:
                            return doubleCellValue !== expectedValue;
                        case 2:
                            return doubleCellValue > expectedValue;
                        case 3:
                            return doubleCellValue >= expectedValue;
                        case 4:
                            return doubleCellValue < expectedValue;
                        case 5:
                            return doubleCellValue <= expectedValue
                    }
                    return false
                };
                NumberCondition.prototype.getExpected = function(evaluator, baseRow, basecol)
                {
                    var self = this;
                    if (self.formula && self.formula.length > 0)
                    {
                        var calcService = evaluator.getCalcService();
                        if (!calcService)
                        {
                            return self.expected
                        }
                        return calcService.evaluate(evaluator._getSheetSource(), self.formula, baseRow, basecol)
                    }
                    else
                    {
                        return self.expected
                    }
                };
                NumberCondition.prototype.reset = function()
                {
                    var self = this;
                    self.expected = keyword_null;
                    self.ignoreBlank = false;
                    self.compareType = 0;
                    self.integerValue = false
                };
                NumberCondition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"ignoreBlank":
                            return value === false;
                        case"integerValue":
                            return value === false;
                        default:
                            return false
                    }
                };
                NumberCondition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            compareType: self.compareType, expected: self.expected, formula: self.formula, conType: 1, ignoreBlank: self.ignoreBlank, integerValue: self.integerValue
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    if ($.isEmptyObject(settings))
                    {
                        return keyword_undefined
                    }
                    return settings
                };
                NumberCondition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.compareType !== keyword_null && settings.compareType !== keyword_undefined)
                    {
                        self.compareType = settings.compareType
                    }
                    if (settings.expected !== keyword_null && settings.expected !== keyword_undefined)
                    {
                        self.expected = settings.expected
                    }
                    if (settings.formula !== keyword_null && settings.formula !== keyword_undefined)
                    {
                        self.formula = settings.formula
                    }
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        self.ignoreBlank = settings.ignoreBlank
                    }
                    if (settings.integerValue !== keyword_null && settings.integerValue !== keyword_undefined)
                    {
                        self.integerValue = settings.integerValue
                    }
                };
                NumberCondition.prototype.getFormulas = function()
                {
                    return this.formula ? [this.formula] : []
                };
                NumberCondition.prototype.setFormulas = function(formulas)
                {
                    this.formula = formulas[0]
                };
                return NumberCondition
            })();
        Sheets.NumberCondition = NumberCondition;
        var SpecificTextRule = (function(_super)
            {
                __extends(SpecificTextRule, _super);
                function SpecificTextRule(operator, text, style)
                {
                    _super.call(this, style);
                    this.text = text;
                    this.operator = operator
                }
                SpecificTextRule.prototype.createCondition = function()
                {
                    var type;
                    switch (this.operator)
                    {
                        case 2:
                            type = 2;
                            break;
                        case 3:
                            type = 4;
                            break;
                        case 0:
                            type = 6;
                            break;
                        case 1:
                            type = 7;
                            break;
                        default:
                            type = 0;
                            break
                    }
                    var condition = new TextCondition(type, this.text, keyword_null);
                    condition.ignoreCase = true;
                    return condition
                };
                SpecificTextRule.prototype.reset = function()
                {
                    var self = this;
                    self.operator = 0;
                    self.text = "";
                    self.style = keyword_null;
                    self._stopIfTrue = false;
                    self._priority = 1
                };
                SpecificTextRule.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ruleType: 2, ranges: self.ranges, style: self.style, operator: self.operator, text: self.text, priority: self._priority, stopIfTrue: self._stopIfTrue
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    if ($.isEmptyObject(settings))
                    {
                        return keyword_undefined
                    }
                    return settings
                };
                SpecificTextRule.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.style)
                    {
                        self.style = new Sheets.Style;
                        self.style.fromJSON(settings.style, isNoneSchema)
                    }
                    if (settings.operator !== keyword_null && settings.operator !== keyword_undefined)
                    {
                        self.operator = settings.operator
                    }
                    if (settings.text !== keyword_null && settings.text !== keyword_undefined)
                    {
                        self.text = settings.text
                    }
                    if (settings.priority !== keyword_null && settings.priority !== keyword_undefined)
                    {
                        self._priority = settings.priority
                    }
                    if (settings.stopIfTrue !== keyword_null && settings.stopIfTrue !== keyword_undefined)
                    {
                        self._stopIfTrue = settings.stopIfTrue
                    }
                };
                return SpecificTextRule
            })(ConditionRuleBase);
        Sheets.SpecificTextRule = SpecificTextRule;
        var TextCondition = (function()
            {
                function TextCondition(compareType, expected, formula)
                {
                    var self = this;
                    self.forceValue2Text = false;
                    self.useWildCards = true;
                    self.regex = keyword_null;
                    self.ignoreCase = false;
                    self.conditionType = "TextCondition";
                    self.questionMarkWildcard = "?";
                    self.questionMarkWildcardRegularExpression = ".";
                    self.asteriskWildcard = "*";
                    self.asteriskWildcardRegularExpression = "[.\n]*";
                    self.ignoreBlank = false;
                    self.compareType = compareType;
                    self.expected = expected;
                    self.formula = (typeof(formula) === "string") ? StringHelper_TrimStart($.trim(formula), "=") : formula
                }
                TextCondition.prototype.adjustOffset = function(row, col){};
                TextCondition.prototype.evaluate = function(evaluator, baseRow, baseColumn, actualObj)
                {
                    var self = this;
                    var actual = keyword_null;
                    if (self.forceValue2Text === true || typeof(actualObj) === "string" || typeof(actualObj) === "number")
                    {
                        actual = (actualObj !== keyword_undefined && actualObj !== keyword_null) ? actualObj.toString() : ""
                    }
                    else
                    {
                        if (actualObj instanceof Date)
                        {
                            if (self.compareType === 2 || self.compareType === 4 || self.compareType === 6)
                            {
                                return false
                            }
                            return self.compareType === 3 || self.compareType === 5 || self.compareType === 7
                        }
                        actual = (actualObj !== keyword_undefined && actualObj !== keyword_null) ? actualObj.toString() : ""
                    }
                    if (self.ignoreBlank && (actual === keyword_undefined || actual === keyword_null || actual === ""))
                    {
                        return true
                    }
                    var expected = self.getExpectedString(evaluator, baseRow, baseColumn);
                    if (self.hasWildcard(expected))
                    {
                        if (typeof(actualObj) === "number")
                        {
                            return self.compareType === 3 || self.compareType === 7 || self.compareType === 5 || self.compareType === 1
                        }
                    }
                    switch (self.compareType)
                    {
                        case 0:
                            return self.isEquals(expected, actual);
                        case 1:
                            return !self.isEquals(expected, actual);
                        case 2:
                            return self.isStartWith(expected, actual);
                        case 3:
                            return !self.isStartWith(expected, actual);
                        case 4:
                            return self.isEndWith(expected, actual);
                        case 5:
                            return !self.isEndWith(expected, actual);
                        case 6:
                            return self.isContains(expected, actual);
                        case 7:
                            return !self.isContains(expected, actual)
                    }
                    return false
                };
                TextCondition.prototype.getExpectedString = function(evaluator, baseRow, baseColumn)
                {
                    var obj = this.getExpected(evaluator, baseRow, baseColumn);
                    return (obj === keyword_undefined || obj === keyword_null) ? keyword_null : obj.toString()
                };
                TextCondition.prototype.getExpected = function(evaluator, baseRow, basecol)
                {
                    var self = this;
                    if (self.formula && self.formula.length > 0)
                    {
                        var calcService = evaluator.getCalcService();
                        if (!calcService)
                        {
                            return self.expected
                        }
                        var expr = calcService.parse(keyword_null, self.formula, baseRow, basecol);
                        return calcService.evaluateParsedFormula(evaluator._getSheetSource(), expr, baseRow, basecol, false)
                    }
                    else
                    {
                        return self.expected
                    }
                };
                TextCondition.prototype.hasWildcard = function(text)
                {
                    if (text === keyword_undefined || text === keyword_null || text === "")
                    {
                        return false
                    }
                    return (text.indexOf(this.asteriskWildcard) > -1 || text.indexOf(this.questionMarkWildcard) > -1)
                };
                TextCondition.prototype.isEquals = function(expected, value)
                {
                    var self = this;
                    if (self.useWildCards && self.hasWildcard(expected))
                    {
                        var regex = self.createEqualsRegex(expected);
                        if (regex)
                        {
                            var testValue = (value === keyword_undefined && value === keyword_null) ? "" : value;
                            regex.lastIndex = -1;
                            if (testValue !== keyword_undefined && testValue !== keyword_null)
                            {
                                return testValue.search(regex) > -1
                            }
                        }
                        return false
                    }
                    else
                    {
                        if (value !== keyword_undefined && value !== keyword_null && value !== "")
                        {
                            var testExpected = (expected !== keyword_undefined && expected !== keyword_null) ? expected : "";
                            if (self.ignoreCase)
                            {
                                return testExpected.toLowerCase() === value.toLowerCase()
                            }
                            else
                            {
                                return testExpected === value
                            }
                        }
                        else
                        {
                            return expected === keyword_undefined || expected === keyword_null || expected === ""
                        }
                    }
                };
                TextCondition.prototype.createEqualsRegex = function(expression)
                {
                    var self = this;
                    if (self.regex)
                    {
                        return self.regex
                    }
                    expression = self.encodeExpression(expression);
                    var sb = expression;
                    var re = new RegExp("\\" + self.questionMarkWildcard, "g");
                    sb = sb.replace(re, self.questionMarkWildcardRegularExpression);
                    re = new RegExp("\\" + self.asteriskWildcard, "g");
                    sb = sb.replace(re, self.asteriskWildcardRegularExpression);
                    var regex = keyword_null;
                    try
                    {
                        var options = self.ignoreCase ? "ig" : "g";
                        regex = new RegExp("^" + sb + "$", options)
                    }
                    catch(ex)
                    {
                        return keyword_null
                    }
                    return regex
                };
                TextCondition.prototype.encodeExpression = function(expression)
                {
                    if (!expression)
                    {
                        return keyword_null
                    }
                    var encodedExpresstion = expression;
                    encodedExpresstion = encodedExpresstion.replace(/\^/g, "\\^");
                    encodedExpresstion = encodedExpresstion.replace(/\$/g, "\\$");
                    encodedExpresstion = encodedExpresstion.replace(/\(/g, "\\(");
                    encodedExpresstion = encodedExpresstion.replace(/\)/g, "\\)");
                    encodedExpresstion = encodedExpresstion.replace(/\[/g, "\\[");
                    encodedExpresstion = encodedExpresstion.replace(/\]/g, "\\]");
                    encodedExpresstion = encodedExpresstion.replace(/\{/g, "\\{");
                    encodedExpresstion = encodedExpresstion.replace(/\}/g, "\\}");
                    encodedExpresstion = encodedExpresstion.replace(/\./g, "\\.");
                    encodedExpresstion = encodedExpresstion.replace(/\+/g, "\\+");
                    encodedExpresstion = encodedExpresstion.replace(/\|/g, "\\|");
                    return encodedExpresstion
                };
                TextCondition.prototype.isStartWith = function(expected, value)
                {
                    var self = this;
                    var testValue;
                    if (self.useWildCards && self.hasWildcard(expected))
                    {
                        var regex = self.createStartWithRegex(expected);
                        if (regex)
                        {
                            testValue = (value === keyword_undefined || value === keyword_null) ? "" : value;
                            regex.lastIndex = -1;
                            if (testValue !== keyword_undefined && testValue !== keyword_null)
                            {
                                return testValue.search(regex) > -1
                            }
                        }
                        return false
                    }
                    else
                    {
                        if (value !== keyword_undefined && value !== keyword_null && value !== "")
                        {
                            if (expected === keyword_undefined || expected === keyword_null)
                            {
                                return false
                            }
                            var testExpected = expected;
                            testValue = value;
                            if (self.ignoreCase)
                            {
                                testExpected = testExpected.toLowerCase();
                                testValue = testValue.toLowerCase()
                            }
                            var result = testValue.match("^" + testExpected);
                            if (result !== keyword_undefined && result !== keyword_null && result.length > 0)
                            {
                                return result[0] === testExpected
                            }
                            else
                            {
                                return false
                            }
                        }
                        else
                        {
                            return expected === keyword_undefined || expected === keyword_null || expected === ""
                        }
                    }
                };
                TextCondition.prototype.createStartWithRegex = function(expression)
                {
                    var self = this;
                    if (self.regex)
                    {
                        return self.regex
                    }
                    expression = self.encodeExpression(expression);
                    var sb = expression;
                    var re = new RegExp("\\" + self.questionMarkWildcard, "g");
                    sb = sb.replace(re, self.questionMarkWildcardRegularExpression);
                    re = new RegExp("\\" + self.asteriskWildcard, "g");
                    sb = sb.replace(re, self.asteriskWildcardRegularExpression);
                    var regex = keyword_null;
                    try
                    {
                        var options = self.ignoreCase ? "ig" : "g";
                        if (expression[0] === self.asteriskWildcard)
                        {
                            regex = new RegExp(sb, options)
                        }
                        else
                        {
                            regex = new RegExp("^" + sb, options)
                        }
                    }
                    catch(ex)
                    {
                        return keyword_null
                    }
                    return regex
                };
                TextCondition.prototype.isEndWith = function(expected, value)
                {
                    var self = this;
                    var testValue;
                    if (self.useWildCards && self.hasWildcard(expected))
                    {
                        var regex = self.createEndWithRegex(expected);
                        if (regex)
                        {
                            testValue = (value === keyword_undefined || value === keyword_null) ? "" : value;
                            regex.lastIndex = -1;
                            if (testValue !== keyword_undefined && testValue !== keyword_null)
                            {
                                return testValue.search(regex) > -1
                            }
                        }
                        return false
                    }
                    else
                    {
                        if (value !== keyword_undefined && value !== keyword_null && value !== "")
                        {
                            if (expected === keyword_undefined || expected === keyword_null)
                            {
                                return false
                            }
                            var testExpected = expected;
                            testValue = value;
                            if (self.ignoreCase)
                            {
                                testExpected = testExpected.toLowerCase();
                                testValue = testValue.toLowerCase()
                            }
                            var result = testValue.match(testExpected + "$");
                            if (result !== keyword_undefined && result !== keyword_null && result.length > 0)
                            {
                                return result[0] === testExpected
                            }
                            else
                            {
                                return false
                            }
                        }
                        else
                        {
                            return expected === keyword_undefined || expected === keyword_null || expected === ""
                        }
                    }
                };
                TextCondition.prototype.createEndWithRegex = function(expression)
                {
                    var self = this;
                    if (self.regex)
                    {
                        return self.regex
                    }
                    expression = self.encodeExpression(expression);
                    var sb = expression;
                    var re = new RegExp("\\" + self.questionMarkWildcard, "g");
                    sb = sb.replace(re, self.questionMarkWildcardRegularExpression);
                    re = new RegExp("\\" + self.asteriskWildcard, "g");
                    sb = sb.replace(re, self.asteriskWildcardRegularExpression);
                    var regex = keyword_null;
                    try
                    {
                        var options = self.ignoreCase ? "ig" : "g";
                        if (expression[expression.length - 1] === self.asteriskWildcard)
                        {
                            regex = new RegExp(sb, options)
                        }
                        else
                        {
                            regex = new RegExp(sb + "$", options)
                        }
                    }
                    catch(ex)
                    {
                        return keyword_null
                    }
                    return regex
                };
                TextCondition.prototype.isContains = function(expected, value)
                {
                    var self = this;
                    var testValue;
                    if (self.useWildCards && self.hasWildcard(expected))
                    {
                        var regex = self.createContainsRegex(expected);
                        if (regex)
                        {
                            testValue = (value === keyword_undefined || value === keyword_null) ? "" : value;
                            regex.lastIndex = -1;
                            if (testValue !== keyword_undefined && testValue !== keyword_null)
                            {
                                return testValue.search(regex) > -1
                            }
                        }
                        return false
                    }
                    else
                    {
                        if (value !== keyword_undefined && value !== keyword_null && value !== "")
                        {
                            if (expected === keyword_undefined || expected === keyword_null)
                            {
                                return false
                            }
                            var testExpected = expected;
                            testValue = value;
                            if (self.ignoreCase)
                            {
                                testExpected = testExpected.toLowerCase();
                                testValue = testValue.toLowerCase()
                            }
                            return testValue.indexOf(testExpected) > -1
                        }
                        else
                        {
                            return expected === keyword_undefined || expected === keyword_null || expected === ""
                        }
                    }
                };
                TextCondition.prototype.createContainsRegex = function(expression)
                {
                    var self = this;
                    if (self.regex)
                    {
                        return self.regex
                    }
                    expression = self.encodeExpression(expression);
                    var sb = expression;
                    var re = new RegExp("\\" + self.questionMarkWildcard, "g");
                    sb = sb.replace(re, self.questionMarkWildcardRegularExpression);
                    re = new RegExp("\\" + self.asteriskWildcard, "g");
                    sb = sb.replace(re, self.asteriskWildcardRegularExpression);
                    var regex = keyword_null;
                    try
                    {
                        var options = self.ignoreCase ? "ig" : "g";
                        regex = new RegExp(sb, options)
                    }
                    catch(ex)
                    {
                        return keyword_null
                    }
                    return regex
                };
                TextCondition.prototype.reset = function()
                {
                    var self = this;
                    self.expected = keyword_null;
                    self.ignoreBlank = false;
                    self.compareType = 0;
                    self.useWildCards = true;
                    self.ignoreCase = false;
                    self.forceValue2Text = false
                };
                TextCondition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"forceValue2Text":
                            return value === false;
                        case"useWildCards":
                            return value === true;
                        case"ignoreCase":
                            return value === false;
                        case"regex":
                            return value === keyword_null;
                        case"ignoreBlank":
                            return value === false;
                        default:
                            return false
                    }
                };
                TextCondition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            compareType: self.compareType, expected: self.expected, formula: self.formula, forceValue2Text: self.forceValue2Text, useWildCards: self.useWildCards, ignoreCase: self.ignoreCase, regex: self.regex, conType: 2, ignoreBlank: self.ignoreBlank
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                TextCondition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.compareType !== keyword_null && settings.compareType !== keyword_undefined)
                    {
                        self.compareType = settings.compareType
                    }
                    if (settings.expected !== keyword_null && settings.expected !== keyword_undefined)
                    {
                        self.expected = settings.expected
                    }
                    if (settings.formula !== keyword_null && settings.formula !== keyword_undefined)
                    {
                        self.formula = settings.formula
                    }
                    if (settings.forceValue2Text !== keyword_null && settings.forceValue2Text !== keyword_undefined)
                    {
                        self.forceValue2Text = settings.forceValue2Text
                    }
                    if (settings.useWildCards !== keyword_null && settings.useWildCards !== keyword_undefined)
                    {
                        self.useWildCards = settings.useWildCards
                    }
                    if (settings.ignoreCase !== keyword_null && settings.ignoreCase !== keyword_undefined)
                    {
                        self.ignoreCase = settings.ignoreCase
                    }
                    if (settings.regex !== keyword_null && settings.regex !== keyword_undefined)
                    {
                        self.regex = settings.regex
                    }
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        self.ignoreBlank = settings.ignoreBlank
                    }
                };
                TextCondition.prototype.getFormulas = function()
                {
                    return this.formula ? [this.formula] : []
                };
                TextCondition.prototype.setFormulas = function(formulas)
                {
                    this.formula = formulas[0]
                };
                return TextCondition
            })();
        Sheets.TextCondition = TextCondition;
        var ColorCondition = (function()
            {
                function ColorCondition(compareType, expected)
                {
                    this.conditionType = "ColorCondition";
                    this.ignoreBlank = false;
                    this.compareType = compareType;
                    this.expected = expected
                }
                ColorCondition.prototype.evaluate = function(evaluator, baseRow, baseColumn, actualObj)
                {
                    return this.isEqualsColor(evaluator, actualObj)
                };
                ColorCondition.prototype.isEqualsColor = function(evaluator, actualObj)
                {
                    var self = this;
                    var expectedColor = self.getColorFromString(self.expected);
                    if (expectedColor !== keyword_undefined && expectedColor !== keyword_null && expectedColor !== "")
                    {
                        var actualColor = self.getColorFromString(actualObj);
                        if (actualColor !== keyword_undefined && actualColor !== keyword_null && actualColor !== "")
                        {
                            return actualColor.a === expectedColor.a && actualColor.r === expectedColor.r && actualColor.g === expectedColor.g && actualColor.b === expectedColor.b
                        }
                        else
                        {
                            var defaultColor;
                            if (self.compareType === 0)
                            {
                                if (evaluator && evaluator.getDefaultStyle)
                                {
                                    defaultColor = evaluator.getDefaultStyle().backColor
                                }
                            }
                            else if (self.compareType === 1)
                            {
                                if (evaluator && evaluator.getDefaultStyle)
                                {
                                    defaultColor = evaluator.getDefaultStyle().foreColor
                                }
                            }
                            if (defaultColor)
                            {
                                return expectedColor.a === defaultColor.a && expectedColor.r === defaultColor.r && expectedColor.g === defaultColor.g && expectedColor.b === defaultColor.b
                            }
                        }
                    }
                    else if (self.ignoreBlank)
                    {
                        return true
                    }
                    return false
                };
                ColorCondition.prototype.getColorFromString = function(colorStr)
                {
                    return (colorStr === keyword_undefined || colorStr === keyword_null || colorStr === "") ? keyword_null : Sheets._Color.parse(colorStr)
                };
                ColorCondition.prototype.reset = function()
                {
                    this.expected = keyword_null;
                    this.ignoreBlank = false;
                    this.compareType = 0
                };
                ColorCondition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"ignoreBlank":
                            return value === false;
                        default:
                            return false
                    }
                };
                ColorCondition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            compareType: self.compareType, expected: self.expected, conType: 3, ignoreBlank: self.ignoreBlank
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                ColorCondition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    if (settings.compareType !== keyword_null && settings.compareType !== keyword_undefined)
                    {
                        this.compareType = settings.compareType
                    }
                    if (settings.expected !== keyword_null && settings.expected !== keyword_undefined)
                    {
                        this.expected = settings.expected
                    }
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        this.ignoreBlank = settings.ignoreBlank
                    }
                };
                return ColorCondition
            })();
        Sheets.ColorCondition = ColorCondition;
        var FormulaRule = (function(_super)
            {
                __extends(FormulaRule, _super);
                function FormulaRule(formula, style)
                {
                    _super.call(this, style);
                    if (formula && typeof(formula) !== "string")
                    {
                        throw new Error(Sheets.SR.Exp_InvalidArgument);
                    }
                    this.formula = formula
                }
                FormulaRule.prototype.createCondition = function()
                {
                    var self = this;
                    var condition = new FormulaCondition(4, (!self.formula || self.formula === "") ? keyword_null : self.formula);
                    if (self.ranges && self.ranges.length > 0)
                    {
                        condition._baseRow = self.ranges[0].row;
                        condition._baseCol = self.ranges[0].col
                    }
                    return condition
                };
                FormulaRule.prototype.reset = function()
                {
                    var self = this;
                    self.formula = keyword_null;
                    self.style = keyword_null;
                    self._stopIfTrue = false;
                    self._priority = 1
                };
                FormulaRule.prototype.isFormula = function(val)
                {
                    return (val) && (val[0] === "=")
                };
                FormulaRule.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ruleType: 3, ranges: self.ranges, style: self.style, formula: self.formula, priority: self._priority, stopIfTrue: self._stopIfTrue
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                FormulaRule.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.style)
                    {
                        self.style = new Sheets.Style;
                        self.style.fromJSON(settings.style, isNoneSchema)
                    }
                    if (settings.formula !== keyword_null && settings.formula !== keyword_undefined)
                    {
                        self.formula = settings.formula
                    }
                    if (settings.priority !== keyword_null && settings.priority !== keyword_undefined)
                    {
                        self._priority = settings.priority
                    }
                    if (settings.stopIfTrue !== keyword_null && settings.stopIfTrue !== keyword_undefined)
                    {
                        self._stopIfTrue = settings.stopIfTrue
                    }
                };
                return FormulaRule
            })(ConditionRuleBase);
        Sheets.FormulaRule = FormulaRule;
        var FormulaCondition = (function()
            {
                function FormulaCondition(customValueType, formula)
                {
                    var self = this;
                    self.expected = keyword_null;
                    self.ignoreBlank = false;
                    self.conditionType = "FormulaCondition";
                    self._baseRow = keyword_null;
                    self._baseCol = keyword_null;
                    self._expr = keyword_null;
                    self.customValueType = customValueType;
                    var revisedFormula = formula;
                    if (typeof(revisedFormula) === "string")
                    {
                        var temp = $.trim(revisedFormula);
                        if (temp[0] === "=")
                        {
                            revisedFormula = temp.substr(1)
                        }
                        else
                        {
                            revisedFormula = temp
                        }
                    }
                    self.formula = revisedFormula
                }
                FormulaCondition.prototype.adjustOffset = function(row, col){};
                FormulaCondition.prototype.evaluate = function(evaluator, baseRow, baseColumn, actualObj)
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return false
                    }
                    var self = this;
                    if (self.customValueType === 4)
                    {
                        var expected = self.getExpected(evaluator, baseRow, baseColumn);
                        if (self.ignoreBlank && (expected === keyword_undefined || expected === keyword_null || expected === ""))
                        {
                            return true
                        }
                        try
                        {
                            return CalcConvert.B(expected)
                        }
                        catch(err)
                        {
                            return false
                        }
                    }
                    else
                    {
                        var isError = CalcConvert.err;
                        switch (self.customValueType)
                        {
                            case 0:
                                return (actualObj === keyword_undefined || actualObj === keyword_null || actualObj === "");
                            case 1:
                                return (actualObj !== keyword_undefined && actualObj !== keyword_null && actualObj !== "");
                            case 2:
                                return isError(actualObj);
                            case 3:
                                return !isError(actualObj)
                        }
                    }
                    return false
                };
                FormulaCondition.prototype.getExpected = function(evaluator, baseRow, baseCol)
                {
                    var self = this;
                    if (self.formula && self.formula.length > 0)
                    {
                        var calcService = evaluator.getCalcService();
                        if (!calcService)
                        {
                            return self.expected
                        }
                        if (!self._expr)
                        {
                            if ((self._baseRow === keyword_undefined || self._baseRow === keyword_null) && (self._baseCol === keyword_undefined || self._baseCol === keyword_null))
                            {
                                self._baseRow = baseRow;
                                self._baseCol = baseCol
                            }
                            self._expr = calcService.parse(keyword_null, self.formula, self._baseRow, self._baseCol)
                        }
                        var v = calcService.evaluateParsedFormula(evaluator._getSheetSource(), self._expr, baseRow, baseCol, true);
                        var rowCount,
                            colCount,
                            resultArray,
                            r,
                            c;
                        if (CalcConvert.ref(v))
                        {
                            rowCount = v.getRowCount(0);
                            colCount = v.getColumnCount(0);
                            resultArray = [];
                            for (r = 0; r < rowCount; r++)
                            {
                                resultArray[r] = [];
                                for (c = 0; c < colCount; c++)
                                {
                                    resultArray[r][c] = v.getValue(0, r, c)
                                }
                            }
                            v = resultArray
                        }
                        else if (CalcConvert.arr(v))
                        {
                            rowCount = v.getRowCount();
                            colCount = v.getColumnCount();
                            resultArray = [];
                            for (r = 0; r < rowCount; r++)
                            {
                                resultArray[r] = [];
                                for (c = 0; c < colCount; c++)
                                {
                                    resultArray[r][c] = v.getValue(r, c)
                                }
                            }
                            v = resultArray
                        }
                        if (v instanceof Array)
                        {
                            rowCount = v.length;
                            colCount = v[0].length;
                            if (rowCount === 1 && colCount === 1)
                            {
                                return v[0][0]
                            }
                            var offsetRow = baseRow - self._baseRow;
                            var offsetCol = baseCol - self._baseCol;
                            if (offsetRow < rowCount && offsetCol < colCount)
                            {
                                return v[offsetRow][offsetCol]
                            }
                            else
                            {
                                return Sheets.Calc.Errors.NotAvailable
                            }
                        }
                        return v
                    }
                    else
                    {
                        return self.expected
                    }
                };
                FormulaCondition.prototype.reset = function()
                {
                    var self = this;
                    self.expected = keyword_null;
                    self.ignoreBlank = false;
                    self.customValueType = 0;
                    self._expr = keyword_null;
                    self._baseRow = keyword_null;
                    self._baseCol = keyword_null
                };
                FormulaCondition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"expected":
                            return value === keyword_null;
                        case"ignoreBlank":
                            return value === false;
                        default:
                            return false
                    }
                };
                FormulaCondition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            customValueType: self.customValueType, expected: self.expected, formula: self.formula, conType: 4, ignoreBlank: self.ignoreBlank
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                FormulaCondition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.customValueType !== keyword_null && settings.customValueType !== keyword_undefined)
                    {
                        self.customValueType = settings.customValueType
                    }
                    if (settings.expected !== keyword_null && settings.expected !== keyword_undefined)
                    {
                        self.expected = settings.expected
                    }
                    if (settings.formula !== keyword_null && settings.formula !== keyword_undefined)
                    {
                        self.formula = settings.formula
                    }
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        self.ignoreBlank = settings.ignoreBlank
                    }
                };
                FormulaCondition.prototype.getFormulas = function()
                {
                    return this.formula ? [this.formula] : []
                };
                FormulaCondition.prototype.setFormulas = function(formulas)
                {
                    this.formula = formulas[0];
                    this._expr = null
                };
                return FormulaCondition
            })();
        Sheets.FormulaCondition = FormulaCondition;
        var DateCondition = (function()
            {
                function DateCondition(compareType, expected, formula)
                {
                    var self = this;
                    self.conditionType = "DateCondition";
                    self.ignoreBlank = false;
                    self.compareType = compareType;
                    self.expected = expected;
                    self.formula = (typeof(formula) === "string") ? StringHelper_TrimStart($.trim(formula), "=") : formula
                }
                DateCondition.prototype.evaluate = function(evaluator, baseRow, baseColumn, actualObj)
                {
                    var self = this;
                    if (actualObj === keyword_undefined || actualObj === keyword_null || actualObj === "")
                    {
                        if (self.ignoreBlank)
                        {
                            return true
                        }
                    }
                    if (!(actualObj instanceof Date))
                    {
                        return false
                    }
                    var expected = self.getExpectedDateTime(evaluator, baseRow, baseColumn);
                    if (expected === keyword_undefined || expected === keyword_null)
                    {
                        return !!self.ignoreBlank
                    }
                    switch (self.compareType)
                    {
                        case 0:
                            return self.isEquals(expected, actualObj);
                        case 1:
                            return !self.isEquals(expected, actualObj);
                        case 4:
                            return self.isAfter(expected, actualObj);
                        case 5:
                            return self.isAfter(expected, actualObj) || self.isEquals(expected, actualObj);
                        case 2:
                            return self.isBefore(expected, actualObj);
                        case 3:
                            return self.isBefore(expected, actualObj) || self.isEquals(expected, actualObj)
                    }
                    return false
                };
                DateCondition.prototype.getExpectedDateTime = function(evaluator, baseRow, basecol)
                {
                    var obj = this.getExpected(evaluator, baseRow, basecol);
                    if (obj instanceof Date)
                    {
                        return obj
                    }
                    else if (typeof(obj) === "string")
                    {
                        return Sheets._DateTimeHelper.parseLocale(obj)
                    }
                    return keyword_null
                };
                DateCondition.prototype.getExpected = function(evaluator, baseRow, basecol)
                {
                    var self = this;
                    if (self.formula && self.formula.length > 0)
                    {
                        var calcService = evaluator.getCalcService();
                        if (!calcService)
                        {
                            return self.expected
                        }
                        var expr = calcService.parse(keyword_null, self.formula, baseRow, basecol);
                        return calcService.evaluateParsedFormula(evaluator._getSheetSource(), expr, baseRow, basecol, false)
                    }
                    else
                    {
                        return self.expected
                    }
                };
                DateCondition.prototype.isEquals = function(expectedValue, value)
                {
                    return (expectedValue.getYear() === value.getYear() && expectedValue.getMonth() === value.getMonth() && expectedValue.getDate() === value.getDate())
                };
                DateCondition.prototype.isAfter = function(expectedValue, value)
                {
                    var date = this.createDayEnding(expectedValue);
                    return value > date
                };
                DateCondition.prototype.createDayEnding = function(datetime)
                {
                    return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), 23, 59, 59, 999)
                };
                DateCondition.prototype.isBefore = function(expectedValue, value)
                {
                    var date = this.createDayBeginning(expectedValue);
                    return value < date
                };
                DateCondition.prototype.createDayBeginning = function(datetime)
                {
                    return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), 0, 0, 0, 0)
                };
                DateCondition.prototype.reset = function()
                {
                    this.expected = keyword_null;
                    this.ignoreBlank = false;
                    this.compareType = 0
                };
                DateCondition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"ignoreBlank":
                            return value === false;
                        default:
                            return false
                    }
                };
                DateCondition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            compareType: self.compareType, expected: self.expected, formula: self.formula, conType: 5, ignoreBlank: self.ignoreBlank
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                DateCondition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.compareType !== keyword_null && settings.compareType !== keyword_undefined)
                    {
                        self.compareType = settings.compareType
                    }
                    if (settings.expected !== keyword_null && settings.expected !== keyword_undefined)
                    {
                        if ($.type(settings.expected) === "string")
                        {
                            self.expected = new Date(settings.expected)
                        }
                        else
                        {
                            self.expected = settings.expected
                        }
                    }
                    if (settings.formula !== keyword_null && settings.formula !== keyword_undefined)
                    {
                        self.formula = settings.formula
                    }
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        self.ignoreBlank = settings.ignoreBlank
                    }
                };
                DateCondition.prototype.getFormulas = function()
                {
                    return this.formula ? [this.formula] : []
                };
                DateCondition.prototype.setFormulas = function(formulas)
                {
                    this.formula = formulas[0]
                };
                return DateCondition
            })();
        Sheets.DateCondition = DateCondition;
        var DateOccurringRule = (function(_super)
            {
                __extends(DateOccurringRule, _super);
                function DateOccurringRule(type, style)
                {
                    _super.call(this, style);
                    this.type = type
                }
                DateOccurringRule.prototype.createCondition = function()
                {
                    return new DateExCondition(this.type)
                };
                DateOccurringRule.prototype.reset = function()
                {
                    var self = this;
                    self.type = 0;
                    self.style = keyword_null;
                    self._stopIfTrue = false;
                    self._priority = 1
                };
                DateOccurringRule.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ruleType: 4, ranges: self.ranges, style: self.style, type: self.type, priority: self._priority, stopIfTrue: self._stopIfTrue
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                DateOccurringRule.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.style)
                    {
                        self.style = new Sheets.Style;
                        self.style.fromJSON(settings.style, isNoneSchema)
                    }
                    if (settings.type !== keyword_null && settings.type !== keyword_undefined)
                    {
                        self.type = settings.type
                    }
                    if (settings.priority !== keyword_null && settings.priority !== keyword_undefined)
                    {
                        self._priority = settings.priority
                    }
                    if (settings.stopIfTrue !== keyword_null && settings.stopIfTrue !== keyword_undefined)
                    {
                        self._stopIfTrue = settings.stopIfTrue
                    }
                };
                return DateOccurringRule
            })(ConditionRuleBase);
        Sheets.DateOccurringRule = DateOccurringRule;
        var DateExCondition = (function()
            {
                function DateExCondition(expected)
                {
                    var self = this;
                    self.ignoreBlank = false;
                    self.formula = keyword_null;
                    self.expectTypeId = 0;
                    self.conditionType = "DateExCondition";
                    self.expected = expected
                }
                DateExCondition.prototype.adjustOffset = function(row, col){};
                DateExCondition.prototype.evaluate = function(evaluator, baseRow, baseColumn, actualObj)
                {
                    var expected = this.getExpectedInt(evaluator, baseRow, baseColumn);
                    if (expected !== keyword_undefined && expected !== keyword_null)
                    {
                        return this.checkCondition(expected, actualObj)
                    }
                    return false
                };
                DateExCondition.prototype.getExpectedInt = function(evaluator, baseRow, baseColumn)
                {
                    var obj = this.getExpected(evaluator, baseRow, baseColumn);
                    obj = parseInt(obj, 10);
                    return isNaN(obj) ? keyword_null : obj
                };
                DateExCondition.prototype.getExpected = function(evaluator, baseRow, basecol)
                {
                    var self = this;
                    if (self.formula && self.formula.length > 0)
                    {
                        var calcService = evaluator.getCalcService();
                        if (!calcService)
                        {
                            return self.expected
                        }
                        var expr = calcService.parse(keyword_null, self.formula, baseRow, basecol);
                        return calcService.evaluateParsedFormula(evaluator._getSheetSource(), expr, baseRow, basecol, false)
                    }
                    else
                    {
                        return self.expected
                    }
                };
                DateExCondition.prototype.checkCondition = function(expected, actualValue)
                {
                    var self = this;
                    var actual = actualValue;
                    if (self.ignoreBlank && (actual === keyword_undefined || actual === keyword_null || actual === ""))
                    {
                        return true
                    }
                    try
                    {
                        actual = CalcConvert.DT(actual)
                    }
                    catch(err)
                    {
                        return false
                    }
                    var expectedNumber;
                    if (self.expectTypeId === 0)
                    {
                        var from = keyword_null;
                        var to = keyword_null;
                        var now = new Date;
                        var now2 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
                        switch (expected)
                        {
                            case 3:
                                now2.setDate(now2.getDate() - 6);
                                from = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 0, 0, 0, 0);
                                to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
                                break;
                            case 1:
                                now2.setDate(now2.getDate() - 1);
                                from = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 0, 0, 0, 0);
                                to = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 23, 59, 59, 999);
                                break;
                            case 0:
                                from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
                                to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
                                break;
                            case 2:
                                now2.setDate(now2.getDate() + 1);
                                from = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 0, 0, 0, 0);
                                to = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 23, 59, 59, 999);
                                break;
                            case 8:
                                var firstDayOfLastWeek = now;
                                firstDayOfLastWeek.setDate(now.getDate() - now.getDay() - 7);
                                var lastDayOfLastWeek = now2;
                                lastDayOfLastWeek.setDate(now2.getDate() - now2.getDay() - 1);
                                from = new Date(firstDayOfLastWeek.getFullYear(), firstDayOfLastWeek.getMonth(), firstDayOfLastWeek.getDate(), 0, 0, 0, 0);
                                to = new Date(lastDayOfLastWeek.getFullYear(), lastDayOfLastWeek.getMonth(), lastDayOfLastWeek.getDate(), 23, 59, 59, 999);
                                break;
                            case 7:
                                var firstDayOfThisWeek = now;
                                firstDayOfThisWeek.setDate(now.getDate() - now.getDay());
                                var lastDayOfThisWeek = now2;
                                lastDayOfThisWeek.setDate(now2.getDate() - now2.getDay() + 6);
                                from = new Date(firstDayOfThisWeek.getFullYear(), firstDayOfThisWeek.getMonth(), firstDayOfThisWeek.getDate(), 0, 0, 0, 0);
                                to = new Date(lastDayOfThisWeek.getFullYear(), lastDayOfThisWeek.getMonth(), lastDayOfThisWeek.getDate(), 23, 59, 59, 999);
                                break;
                            case 9:
                                var firstDayOfNextWeek = now;
                                firstDayOfNextWeek.setDate(now.getDate() - now.getDay() + 7);
                                var lastDayOfNextWeek = now2;
                                lastDayOfNextWeek.setDate(now2.getDate() - now2.getDay() + 13);
                                from = new Date(firstDayOfNextWeek.getFullYear(), firstDayOfNextWeek.getMonth(), firstDayOfNextWeek.getDate(), 0, 0, 0, 0);
                                to = new Date(lastDayOfNextWeek.getFullYear(), lastDayOfNextWeek.getMonth(), lastDayOfNextWeek.getDate(), 23, 59, 59, 999);
                                break;
                            case 5:
                                var firstDayOfLastMonth = now;
                                firstDayOfLastMonth.setDate(1);
                                firstDayOfLastMonth.setMonth(now.getMonth() - 1);
                                var lastDayOfLastMonth = now2;
                                lastDayOfLastMonth.setDate(0);
                                from = new Date(firstDayOfLastMonth.getFullYear(), firstDayOfLastMonth.getMonth(), firstDayOfLastMonth.getDate(), 0, 0, 0, 0);
                                to = new Date(lastDayOfLastMonth.getFullYear(), lastDayOfLastMonth.getMonth(), lastDayOfLastMonth.getDate(), 23, 59, 59, 999);
                                break;
                            case 4:
                                var firstDayOfThisMonth = now;
                                firstDayOfThisMonth.setDate(1);
                                var lastDayOfThisMonth = now2;
                                lastDayOfThisMonth.setDate(1);
                                lastDayOfThisMonth.setMonth(now2.getMonth() + 1);
                                lastDayOfThisMonth.setDate(0);
                                from = new Date(firstDayOfThisMonth.getFullYear(), firstDayOfThisMonth.getMonth(), firstDayOfThisMonth.getDate(), 0, 0, 0, 0);
                                to = new Date(lastDayOfThisMonth.getFullYear(), lastDayOfThisMonth.getMonth(), lastDayOfThisMonth.getDate(), 23, 59, 59, 999);
                                break;
                            case 6:
                                var firstDayOfNextMonth = now;
                                firstDayOfNextMonth.setDate(1);
                                firstDayOfNextMonth.setMonth(now.getMonth() + 1);
                                var lastDayOfNextMonth = now2;
                                lastDayOfNextMonth.setDate(1);
                                lastDayOfNextMonth.setMonth(now2.getMonth() + 2);
                                lastDayOfNextMonth.setDate(0);
                                from = new Date(firstDayOfNextMonth.getFullYear(), firstDayOfNextMonth.getMonth(), firstDayOfNextMonth.getDate(), 0, 0, 0, 0);
                                to = new Date(lastDayOfNextMonth.getFullYear(), lastDayOfNextMonth.getMonth(), lastDayOfNextMonth.getDate(), 23, 59, 59, 999);
                                break
                        }
                        if (from !== keyword_undefined && from !== keyword_null && to !== keyword_undefined && to !== keyword_null)
                        {
                            var condition1 = new DateCondition(5, from, keyword_null);
                            var condition2 = new DateCondition(3, to, keyword_null);
                            var condition = new RelationCondition(1, condition1, condition2);
                            return condition.evaluate(keyword_null, 0, 0, actual)
                        }
                    }
                    else if (self.expectTypeId === 1)
                    {
                        expectedNumber = self.getExpectedInt(keyword_null, 0, 0);
                        if (expectedNumber !== keyword_undefined && expectedNumber !== keyword_null)
                        {
                            return self.isEqualsYear(expectedNumber, actual)
                        }
                    }
                    else if (self.expectTypeId === 2)
                    {
                        expectedNumber = self.getExpectedInt(keyword_null, 0, 0);
                        if (expectedNumber !== keyword_undefined && expectedNumber !== keyword_null)
                        {
                            return self.isEqualsQuarter(expectedNumber, actual)
                        }
                    }
                    else if (self.expectTypeId === 3)
                    {
                        expectedNumber = self.getExpectedInt(keyword_null, 0, 0);
                        if (expectedNumber !== keyword_undefined && expectedNumber !== keyword_null)
                        {
                            return self.isEqualsMonth(expectedNumber, actual)
                        }
                    }
                    else if (self.expectTypeId === 4)
                    {
                        expectedNumber = self.getExpectedInt(keyword_null, 0, 0);
                        if (expectedNumber !== keyword_undefined && expectedNumber !== keyword_null)
                        {
                            return self.isEqualsWeek(expectedNumber, actual)
                        }
                    }
                    else if (self.expectTypeId === 5)
                    {
                        expectedNumber = self.getExpectedInt(keyword_null, 0, 0);
                        if (expectedNumber !== keyword_undefined && expectedNumber !== keyword_null)
                        {
                            return self.isEqualsDay(expectedNumber, actual)
                        }
                    }
                    return false
                };
                DateExCondition.prototype.isEqualsYear = function(expected, actualDateTime)
                {
                    return (expected === actualDateTime.getFullYear())
                };
                DateExCondition.prototype.isEqualsQuarter = function(expected, actualDateTime)
                {
                    switch (expected)
                    {
                        case 0:
                            return (actualDateTime.getMonth() >= 0 && actualDateTime.getMonth() <= 2);
                        case 1:
                            return (actualDateTime.getMonth() >= 3 && actualDateTime.getMonth() <= 5);
                        case 2:
                            return (actualDateTime.getMonth() >= 6 && actualDateTime.getMonth() <= 8);
                        case 3:
                            return (actualDateTime.getMonth() >= 9 && actualDateTime.getMonth() <= 11)
                    }
                    return false
                };
                DateExCondition.prototype.isEqualsMonth = function(expected, actualDateTime)
                {
                    return (expected === actualDateTime.getMonth())
                };
                DateExCondition.prototype.isEqualsWeek = function(expected, actualDateTime)
                {
                    return (expected === actualDateTime.getDay())
                };
                DateExCondition.prototype.isEqualsDay = function(expected, actualDateTime)
                {
                    return (expected === actualDateTime.getDate())
                };
                DateExCondition.prototype.reset = function()
                {
                    this.expected = keyword_null;
                    this.ignoreBlank = false;
                    this.expectTypeId = 0
                };
                DateExCondition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"ignoreBlank":
                            return value === false;
                        case"formula":
                            return value === keyword_null;
                        case"expectTypeId":
                            return value === 0;
                        default:
                            return false
                    }
                };
                DateExCondition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ignoreBlank: self.ignoreBlank, formula: self.formula, expected: self.expected, expectTypeId: self.expectTypeId, conType: 6
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                DateExCondition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        self.ignoreBlank = settings.ignoreBlank
                    }
                    if (settings.formula !== keyword_null && settings.formula !== keyword_undefined)
                    {
                        self.formula = settings.formula
                    }
                    if (settings.expected !== keyword_null && settings.expected !== keyword_undefined)
                    {
                        self.expected = settings.expected
                    }
                    if (settings.expectTypeId !== keyword_null && settings.expectTypeId !== keyword_undefined)
                    {
                        self.expectTypeId = settings.expectTypeId
                    }
                };
                DateExCondition.fromDay = function(day)
                {
                    var con = new DateExCondition(day);
                    con.expectTypeId = 5;
                    return con
                };
                DateExCondition.fromMonth = function(month)
                {
                    var con = new DateExCondition(month);
                    con.expectTypeId = 3;
                    return con
                };
                DateExCondition.fromQuarter = function(quarter)
                {
                    var con = new DateExCondition(quarter);
                    con.expectTypeId = 2;
                    return con
                };
                DateExCondition.fromWeek = function(week)
                {
                    var con = new DateExCondition(week);
                    con.expectTypeId = 4;
                    return con
                };
                DateExCondition.fromYear = function(year)
                {
                    var con = new DateExCondition(year);
                    con.expectTypeId = 1;
                    return con
                };
                DateExCondition.prototype.getFormulas = function()
                {
                    return this.formula ? [this.formula] : []
                };
                DateExCondition.prototype.setFormulas = function(formulas)
                {
                    this.formula = formulas[0]
                };
                return DateExCondition
            })();
        Sheets.DateExCondition = DateExCondition;
        var TextLengthCondition = (function()
            {
                function TextLengthCondition(compareType, expected, formula)
                {
                    var self = this;
                    self.ignoreBlank = false;
                    self.conditionType = "TextLengthCondition";
                    self.compareType = compareType;
                    self.expected = expected;
                    self.formula = (typeof(formula) === "string") ? StringHelper_TrimStart($.trim(formula), "=") : formula
                }
                TextLengthCondition.prototype.evaluate = function(evaluator, baseRow, baseColumn, actualObj)
                {
                    if (actualObj === keyword_undefined || actualObj === keyword_null || actualObj === "")
                    {
                        return this.ignoreBlank
                    }
                    var actualLen = (actualObj === keyword_undefined || actualObj === keyword_null) ? 0 : actualObj.length;
                    var expectedLen = this.getExpectedInt(evaluator, baseRow, baseColumn);
                    if (typeof(expectedLen) === "number")
                    {
                        switch (this.compareType)
                        {
                            case 0:
                                return actualLen === expectedLen;
                            case 2:
                                return actualLen > expectedLen;
                            case 3:
                                return actualLen >= expectedLen;
                            case 4:
                                return actualLen < expectedLen;
                            case 5:
                                return actualLen <= expectedLen;
                            case 1:
                                return actualLen !== expectedLen
                        }
                    }
                    return false
                };
                TextLengthCondition.prototype.getExpectedInt = function(evaluator, baseRow, basecol)
                {
                    var obj = this.getExpected(evaluator, baseRow, basecol);
                    obj = parseInt(obj, 10);
                    return isNaN(obj) ? keyword_null : obj
                };
                TextLengthCondition.prototype.getExpected = function(evaluator, baseRow, basecol)
                {
                    var self = this;
                    if (self.formula && self.formula.length > 0)
                    {
                        var calcService = evaluator.getCalcService();
                        if (!calcService)
                        {
                            return self.expected
                        }
                        var expr = calcService.parse(keyword_null, self.formula, baseRow, basecol);
                        return calcService.evaluateParsedFormula(evaluator._getSheetSource(), expr, baseRow, basecol, false)
                    }
                    else
                    {
                        return self.expected
                    }
                };
                TextLengthCondition.prototype.reset = function()
                {
                    this.expected = keyword_null;
                    this.ignoreBlank = false;
                    this.compareType = 0
                };
                TextLengthCondition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"ignoreBlank":
                            return value === false;
                        default:
                            return false
                    }
                };
                TextLengthCondition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            compareType: self.compareType, expected: self.expected, formula: self.formula, conType: 7, ignoreBlank: self.ignoreBlank
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                TextLengthCondition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.compareType !== keyword_null && settings.compareType !== keyword_undefined)
                    {
                        self.compareType = settings.compareType
                    }
                    if (settings.expected !== keyword_null && settings.expected !== keyword_undefined)
                    {
                        self.expected = settings.expected
                    }
                    if (settings.formula !== keyword_null && settings.formula !== keyword_undefined)
                    {
                        self.formula = settings.formula
                    }
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        self.ignoreBlank = settings.ignoreBlank
                    }
                };
                TextLengthCondition.prototype.getFormulas = function()
                {
                    return this.formula ? [this.formula] : []
                };
                TextLengthCondition.prototype.setFormulas = function(formulas)
                {
                    this.formula = formulas[0]
                };
                return TextLengthCondition
            })();
        Sheets.TextLengthCondition = TextLengthCondition;
        var Top10Rule = (function(_super)
            {
                __extends(Top10Rule, _super);
                function Top10Rule(type, rank, style)
                {
                    _super.call(this, style);
                    this.type = type;
                    this.rank = rank
                }
                Top10Rule.prototype.createCondition = function()
                {
                    return new Top10Condition(this.type, this.rank, this.ranges)
                };
                Top10Rule.prototype.reset = function()
                {
                    var self = this;
                    self.type = 0;
                    self.rank = 10;
                    self.style = keyword_null;
                    self._stopIfTrue = false;
                    self._priority = 1
                };
                Top10Rule.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ruleType: 5, ranges: self.ranges, style: self.style, type: self.type, rank: self.rank, priority: self._priority, stopIfTrue: self._stopIfTrue
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                Top10Rule.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.style)
                    {
                        self.style = new Sheets.Style;
                        self.style.fromJSON(settings.style, isNoneSchema)
                    }
                    if (settings.type !== keyword_null && settings.type !== keyword_undefined)
                    {
                        self.type = settings.type
                    }
                    if (settings.rank !== keyword_null && settings.rank !== keyword_undefined)
                    {
                        self.rank = settings.rank
                    }
                    if (settings.priority !== keyword_null && settings.priority !== keyword_undefined)
                    {
                        self._priority = settings.priority
                    }
                    if (settings.stopIfTrue !== keyword_null && settings.stopIfTrue !== keyword_undefined)
                    {
                        self._stopIfTrue = settings.stopIfTrue
                    }
                };
                return Top10Rule
            })(ConditionRuleBase);
        Sheets.Top10Rule = Top10Rule;
        var Top10Condition = (function()
            {
                function Top10Condition(type, rank, ranges)
                {
                    var self = this;
                    self.isPercent = false;
                    self.ignoreBlank = false;
                    self.conditionType = "Top10Condition";
                    self.formula = keyword_null;
                    self.expected = rank;
                    self.type = type;
                    self.ranges = ranges
                }
                Top10Condition.prototype.adjustOffset = function(row, col){};
                Top10Condition.prototype.evaluate = function(evaluator, baseRow, baseColumn, actualObj)
                {
                    var self = this;
                    if (actualObj === keyword_undefined || actualObj === keyword_null || actualObj === "")
                    {
                        return self.ignoreBlank
                    }
                    var expectedRank = self.getExpectedInt(evaluator, baseRow, baseColumn);
                    if (expectedRank !== keyword_undefined && expectedRank !== keyword_null)
                    {
                        var values = keyword_null;
                        if (self.type === 0)
                        {
                            values = self.getMaxValues(evaluator, expectedRank, self.ranges)
                        }
                        else if (self.type === 1)
                        {
                            values = self.getMinValues(evaluator, expectedRank, self.ranges)
                        }
                        if (values)
                        {
                            var dactual = 0;
                            try
                            {
                                dactual = self._toDouble(actualObj)
                            }
                            catch(ex)
                            {
                                return false
                            }
                            if (Sheets.ArrayHelper.contains(values, dactual))
                            {
                                return true
                            }
                        }
                    }
                    return false
                };
                Top10Condition.prototype.getExpectedInt = function(evaluator, baseRow, baseColumn)
                {
                    var obj = this.getExpected(evaluator, baseRow, baseColumn);
                    obj = parseInt(obj, 10);
                    return (isNaN(obj) || !isFinite(obj)) ? keyword_null : obj
                };
                Top10Condition.prototype.getExpected = function(evaluator, baseRow, basecol)
                {
                    var self = this;
                    if (self.formula && self.formula.length > 0)
                    {
                        var calcService = evaluator.getCalcService();
                        if (!calcService)
                        {
                            return self.expected
                        }
                        var expr = calcService.parse(keyword_null, self.formula, baseRow, basecol);
                        return calcService.evaluateParsedFormula(evaluator._getSheetSource(), expr, baseRow, basecol, false)
                    }
                    else
                    {
                        return self.expected
                    }
                };
                Top10Condition.prototype.adjustRange = function(range, sheet)
                {
                    return new Sheets.Range(range.row, range.col, Math.min(range.rowCount, sheet.getRowCount()), Math.min(range.colCount, sheet.getColumnCount()))
                };
                Top10Condition.prototype.getMaxValues = function(evaluator, rank, ranges)
                {
                    var values = [];
                    if (!ranges)
                    {
                        return values
                    }
                    var min = Number.MAX_VALUE,
                        cnt = 0,
                        rangeCount = ranges.length,
                        range,
                        rangeRowCount,
                        rangeColCount,
                        row,
                        column,
                        o,
                        doubleValue;
                    for (var i = 0; i < rangeCount; i++)
                    {
                        range = ranges[i];
                        range = this.adjustRange(range, evaluator);
                        rangeRowCount = range.rowCount;
                        rangeColCount = range.colCount;
                        for (var r = 0; r < rangeRowCount; r++)
                        {
                            row = r + range.row;
                            for (var c = 0; c < rangeColCount; c++)
                            {
                                column = c + range.col;
                                o = evaluator.getValue(row, column);
                                doubleValue = this._toDouble(o);
                                if (typeof(o) !== const_undefined && o !== keyword_null && typeof(doubleValue) !== const_undefined && doubleValue !== keyword_null)
                                {
                                    try
                                    {
                                        if (cnt < rank)
                                        {
                                            values.push(doubleValue);
                                            if (doubleValue < min)
                                            {
                                                min = doubleValue
                                            }
                                            cnt++
                                        }
                                        else
                                        {
                                            if (doubleValue > min)
                                            {
                                                Sheets.ArrayHelper.remove(values, min);
                                                values.push(doubleValue);
                                                if (Sheets.ArrayHelper.indexOf(values, min) < 0)
                                                {
                                                    min = doubleValue;
                                                    for (var n = 0, valueCount = values.length; n < valueCount; n++)
                                                    {
                                                        if (values[n] < min)
                                                        {
                                                            min = values[n]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    catch(ex) {}
                                }
                            }
                        }
                    }
                    return values
                };
                Top10Condition.prototype.getMinValues = function(evaluator, rank, ranges)
                {
                    var values = [];
                    if (!ranges)
                    {
                        return values
                    }
                    var max = -Number.MAX_VALUE,
                        cnt = 0,
                        rangeCount = ranges.length,
                        range,
                        rangeRowCount,
                        rangeColCount,
                        row,
                        column,
                        o,
                        doubleValue;
                    for (var i = 0; i < rangeCount; i++)
                    {
                        range = ranges[i];
                        range = this.adjustRange(range, evaluator);
                        rangeRowCount = range.rowCount;
                        rangeColCount = range.colCount;
                        for (var r = 0; r < rangeRowCount; r++)
                        {
                            row = r + range.row;
                            for (var c = 0; c < rangeColCount; c++)
                            {
                                column = c + range.col;
                                o = evaluator.getValue(row, column);
                                doubleValue = this._toDouble(o);
                                if (typeof(o) !== const_undefined && o !== keyword_null && typeof(doubleValue) !== const_undefined && doubleValue !== keyword_null)
                                {
                                    try
                                    {
                                        if (cnt < rank)
                                        {
                                            values.push(doubleValue);
                                            if (doubleValue > max)
                                            {
                                                max = doubleValue
                                            }
                                            cnt++
                                        }
                                        else
                                        {
                                            if (doubleValue < max)
                                            {
                                                Sheets.ArrayHelper.remove(values, max);
                                                values.push(doubleValue);
                                                if (Sheets.ArrayHelper.indexOf(values, max) < 0)
                                                {
                                                    max = doubleValue;
                                                    for (var n = 0, valueCount = values.length; n < valueCount; n++)
                                                    {
                                                        if (values[n] > max)
                                                        {
                                                            max = values[n]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    catch(ex) {}
                                }
                            }
                        }
                    }
                    return values
                };
                Top10Condition.prototype.reset = function()
                {
                    var self = this;
                    self.expected = keyword_null;
                    self.ignoreBlank = false;
                    self.type = 0;
                    self.isPercent = false;
                    self.ranges = keyword_null
                };
                Top10Condition.prototype._toDouble = function(value)
                {
                    if (((typeof value === 'number') || (value instanceof Date)) && Sheets.util.hasCalc())
                    {
                        return CalcConvert.D(value)
                    }
                    else
                    {
                        return keyword_null
                    }
                };
                Top10Condition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"formula":
                            return value === keyword_null;
                        case"isPercent":
                            return value === false;
                        case"ignoreBlank":
                            return value === false;
                        default:
                            return false
                    }
                };
                Top10Condition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            expected: self.expected, formula: self.formula, type: self.type, isPercent: self.isPercent, ignoreBlank: self.ignoreBlank, ranges: self.ranges, conType: 8
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                Top10Condition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.expected !== keyword_null && settings.expected !== keyword_undefined)
                    {
                        self.expected = settings.expected
                    }
                    if (settings.formula !== keyword_null && settings.formula !== keyword_undefined)
                    {
                        self.formula = settings.formula
                    }
                    if (settings.type !== keyword_null && settings.type !== keyword_undefined)
                    {
                        self.type = settings.type
                    }
                    if (settings.isPercent !== keyword_null && settings.isPercent !== keyword_undefined)
                    {
                        self.isPercent = settings.isPercent
                    }
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        self.ignoreBlank = settings.ignoreBlank
                    }
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                };
                Top10Condition.prototype.getFormulas = function()
                {
                    return this.formula ? [this.formula] : []
                };
                Top10Condition.prototype.setFormulas = function(formulas)
                {
                    this.formula = formulas[0]
                };
                return Top10Condition
            })();
        Sheets.Top10Condition = Top10Condition;
        var UniqueRule = (function(_super)
            {
                __extends(UniqueRule, _super);
                function UniqueRule(style)
                {
                    _super.call(this, style)
                }
                UniqueRule.prototype.createCondition = function()
                {
                    return new UniqueCondition(false, this.ranges)
                };
                UniqueRule.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ruleType: 6, ranges: self.ranges, style: self.style, priority: self._priority, stopIfTrue: self._stopIfTrue
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                UniqueRule.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.style)
                    {
                        self.style = new Sheets.Style;
                        self.style.fromJSON(settings.style, isNoneSchema)
                    }
                    if (settings.priority !== keyword_null && settings.priority !== keyword_undefined)
                    {
                        self._priority = settings.priority
                    }
                    if (settings.stopIfTrue !== keyword_null && settings.stopIfTrue !== keyword_undefined)
                    {
                        self._stopIfTrue = settings.stopIfTrue
                    }
                };
                return UniqueRule
            })(ConditionRuleBase);
        Sheets.UniqueRule = UniqueRule;
        var DuplicateRule = (function(_super)
            {
                __extends(DuplicateRule, _super);
                function DuplicateRule(style)
                {
                    _super.call(this, style)
                }
                DuplicateRule.prototype.createCondition = function()
                {
                    return new UniqueCondition(true, this.ranges)
                };
                DuplicateRule.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ruleType: 7, ranges: self.ranges, style: self.style, priority: self._priority, stopIfTrue: self._stopIfTrue
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                DuplicateRule.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.style)
                    {
                        self.style = new Sheets.Style;
                        self.style.fromJSON(settings.style, isNoneSchema)
                    }
                    if (settings.priority !== keyword_null && settings.priority !== keyword_undefined)
                    {
                        self._priority = settings.priority
                    }
                    if (settings.stopIfTrue !== keyword_null && settings.stopIfTrue !== keyword_undefined)
                    {
                        self._stopIfTrue = settings.stopIfTrue
                    }
                };
                return DuplicateRule
            })(ConditionRuleBase);
        Sheets.DuplicateRule = DuplicateRule;
        var UniqueCondition = (function()
            {
                function UniqueCondition(duplicated, ranges)
                {
                    var self = this;
                    self.conditionType = "UniqueCondition";
                    self.ignoreBlank = false;
                    self.formula = keyword_null;
                    self.expected = duplicated;
                    self.ranges = ranges
                }
                UniqueCondition.prototype.adjustOffset = function(row, col){};
                UniqueCondition.prototype.evaluate = function(evaluator, baseRow, baseColumn, actualObj)
                {
                    var self = this;
                    var value = actualObj;
                    if (value === keyword_undefined || value === keyword_null || value === "")
                    {
                        return self.ignoreBlank
                    }
                    if (Sheets.util.hasCalc())
                    {
                        if (CalcConvert.num(value))
                        {
                            value = CalcConvert.D(value)
                        }
                    }
                    var expectDuplicated = self.getExpectedBoolean(evaluator, baseRow, baseColumn);
                    if (expectDuplicated !== keyword_undefined && expectDuplicated !== keyword_null)
                    {
                        var cached = self.getDuplicated(evaluator, self.ranges);
                        if (cached !== keyword_undefined && cached !== keyword_null)
                        {
                            if (Sheets.ArrayHelper.contains(cached, value))
                            {
                                return expectDuplicated === true
                            }
                            else
                            {
                                return expectDuplicated !== true
                            }
                        }
                        return expectDuplicated !== true
                    }
                    return false
                };
                UniqueCondition.prototype.getExpectedBoolean = function(evaluator, baseRow, baseColumn)
                {
                    var obj = this.getExpected(evaluator, baseRow, baseColumn);
                    try
                    {
                        return CalcConvert.B(obj)
                    }
                    catch(err)
                    {
                        return keyword_null
                    }
                };
                UniqueCondition.prototype.getExpected = function(evaluator, baseRow, baseColumn)
                {
                    var self = this;
                    if (self.formula && self.formula.length > 0)
                    {
                        var calcService = evaluator.getCalcService();
                        if (!calcService)
                        {
                            return self.expected
                        }
                        var expr = calcService.parse(keyword_null, self.formula, baseRow, baseColumn);
                        return calcService.evaluateParsedFormula(evaluator._getSheetSource(), expr, baseRow, baseColumn, false)
                    }
                    else
                    {
                        return self.expected
                    }
                };
                UniqueCondition.prototype.adjustRange = function(range, sheet)
                {
                    return new Sheets.Range(range.row, range.col, Math.min(range.rowCount, sheet.getRowCount()), Math.min(range.colCount, sheet.getColumnCount()))
                };
                UniqueCondition.prototype.getDuplicated = function(evaluator, ranges)
                {
                    var data = [],
                        duplicated = [];
                    if (ranges)
                    {
                        var length = ranges.length;
                        for (var i = 0; i < length; i++)
                        {
                            var cellrange = ranges[i];
                            cellrange = this.adjustRange(cellrange, evaluator);
                            for (var r = 0; r < cellrange.rowCount; r++)
                            {
                                var row = r + cellrange.row;
                                for (var c = 0; c < cellrange.colCount; c++)
                                {
                                    var column = c + cellrange.col;
                                    var o = evaluator.getValue(row, column, 3);
                                    if (o !== keyword_undefined && o !== keyword_null)
                                    {
                                        if (Sheets.util.hasCalc())
                                        {
                                            if (CalcConvert.num(o))
                                            {
                                                o = CalcConvert.D(o)
                                            }
                                        }
                                    }
                                    data.push(o)
                                }
                            }
                        }
                        data.sort();
                        var begin = 0,
                            end = 0;
                        var datalength = data.length;
                        var beginData = data[begin];
                        while (end < datalength)
                        {
                            if (data[end] !== beginData)
                            {
                                if (end !== begin + 1)
                                {
                                    duplicated.push(beginData)
                                }
                                begin = end;
                                beginData = data[begin]
                            }
                            end++
                        }
                        if (begin !== datalength - 1)
                        {
                            duplicated.push(beginData)
                        }
                    }
                    data = keyword_null;
                    return duplicated
                };
                UniqueCondition.prototype._containsKey = function(map, key)
                {
                    var length = map.length;
                    for (var i = 0; i < length; i++)
                    {
                        if (map[i].key === key)
                        {
                            return true
                        }
                    }
                    return false
                };
                UniqueCondition.prototype.reset = function()
                {
                    this.expected = keyword_null;
                    this.ignoreBlank = false;
                    this.ranges = keyword_null
                };
                UniqueCondition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"formula":
                            return value === keyword_null;
                        case"ignoreBlank":
                            return value === false;
                        default:
                            return false
                    }
                };
                UniqueCondition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            expected: self.expected, formula: self.formula, ranges: self.ranges, conType: 9, ignoreBlank: self.ignoreBlank
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                UniqueCondition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.expected !== keyword_null && settings.expected !== keyword_undefined)
                    {
                        self.expected = settings.expected
                    }
                    if (settings.formula !== keyword_null && settings.formula !== keyword_undefined)
                    {
                        self.formula = settings.formula
                    }
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        self.ignoreBlank = settings.ignoreBlank
                    }
                };
                UniqueCondition.prototype.getFormulas = function()
                {
                    return this.formula ? [this.formula] : []
                };
                UniqueCondition.prototype.setFormulas = function(formulas)
                {
                    this.formula = formulas[0]
                };
                return UniqueCondition
            })();
        Sheets.UniqueCondition = UniqueCondition;
        var AverageRule = (function(_super)
            {
                __extends(AverageRule, _super);
                function AverageRule(type, style)
                {
                    _super.call(this, style);
                    this.type = type
                }
                AverageRule.prototype.createCondition = function()
                {
                    return new AverageCondition(this.type, this.ranges)
                };
                AverageRule.prototype.reset = function()
                {
                    var self = this;
                    self.type = 0;
                    self.style = keyword_null;
                    self._stopIfTrue = false;
                    self._priority = 1
                };
                AverageRule.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ruleType: 8, ranges: self.ranges, style: self.style, type: self.type, priority: self._priority, stopIfTrue: self._stopIfTrue
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                AverageRule.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.style)
                    {
                        self.style = new Sheets.Style;
                        self.style.fromJSON(settings.style, isNoneSchema)
                    }
                    if (settings.type !== keyword_null && settings.type !== keyword_undefined)
                    {
                        self.type = settings.type
                    }
                    if (settings.priority !== keyword_null && settings.priority !== keyword_undefined)
                    {
                        self._priority = settings.priority
                    }
                    if (settings.stopIfTrue !== keyword_null && settings.stopIfTrue !== keyword_undefined)
                    {
                        self._stopIfTrue = settings.stopIfTrue
                    }
                };
                return AverageRule
            })(ConditionRuleBase);
        Sheets.AverageRule = AverageRule;
        var AverageCondition = (function()
            {
                function AverageCondition(type, ranges)
                {
                    var self = this;
                    self.conditionType = "AverageCondition";
                    self.ignoreBlank = false;
                    self._expr = keyword_null;
                    self._stdevExpr = keyword_null;
                    self.type = type;
                    self.ranges = ranges
                }
                AverageCondition.prototype.adjustOffset = function(row, col){};
                AverageCondition.prototype.evaluate = function(evaluator, baseRow, baseColumn, actualObj)
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return false
                    }
                    var self = this;
                    if (self.ignoreBlank && (actualObj === keyword_undefined || actualObj === keyword_null || actualObj === ""))
                    {
                        return true
                    }
                    var toDouble = CalcConvert.D;
                    self._rebuildFormula();
                    var averageValue = self.getExpectedDouble(evaluator, baseRow, baseColumn);
                    var stddevValue = keyword_null;
                    var stddevObjValue = self._stdevExpr ? self._getExpectedByExpression(evaluator, self._stdevExpr, baseRow, baseColumn) : keyword_null;
                    if (stddevObjValue !== keyword_undefined && stddevObjValue !== keyword_null)
                    {
                        try
                        {
                            stddevValue = toDouble(stddevObjValue)
                        }
                        catch(err)
                        {
                            stddevValue = NaN
                        }
                    }
                    if (CalcConvert.num(actualObj))
                    {
                        var cellValue = toDouble(actualObj);
                        if (!isNaN(averageValue))
                        {
                            switch (self.type)
                            {
                                case 0:
                                    return cellValue > averageValue;
                                case 1:
                                    return cellValue < averageValue;
                                case 2:
                                    return cellValue >= averageValue;
                                case 3:
                                    return cellValue <= averageValue;
                                case 4:
                                    return !isNaN(stddevValue) ? cellValue > (averageValue + stddevValue) : false;
                                case 5:
                                    return !isNaN(stddevValue) ? cellValue < (averageValue - stddevValue) : false;
                                case 6:
                                    return !isNaN(stddevValue) ? cellValue > (averageValue + 2 * stddevValue) : false;
                                case 7:
                                    return !isNaN(stddevValue) ? cellValue < (averageValue - 2 * stddevValue) : false;
                                case 8:
                                    return !isNaN(stddevValue) ? cellValue > (averageValue + 3 * stddevValue) : false;
                                case 9:
                                    return !isNaN(stddevValue) ? cellValue < (averageValue - 3 * stddevValue) : false
                            }
                        }
                    }
                    return false
                };
                AverageCondition.prototype._rebuildFormula = function()
                {
                    var self = this;
                    if (self.ranges)
                    {
                        self._expr = self._createExpression("AVERAGE", self.ranges);
                        if (self.type === 4 || self.type === 5 || self.type === 6 || self.type === 7 || self.type === 8 || self.type === 9)
                        {
                            self._stdevExpr = self._createExpression("STDEV", self.ranges)
                        }
                    }
                };
                AverageCondition.prototype._createExpression = function(name, parameters)
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var expressions = Sheets.Calc.Expressions,
                        functions = Sheets.Calc.Functions;
                    var averageFunc = functions.findGlobalFunction(name);
                    if (averageFunc)
                    {
                        var args = [];
                        var length = parameters.length;
                        for (var i = 0; i < length; i++)
                        {
                            var obj = parameters[i];
                            if (obj instanceof expressions.Expression)
                            {
                                args[i] = obj
                            }
                            else if (obj instanceof Sheets.Range)
                            {
                                args[i] = new expressions.RangeExpression(obj.row, obj.col, obj.row + obj.rowCount - 1, obj.col + obj.colCount - 1)
                            }
                            else if (CalcConvert.num(obj) && !isNaN(obj = CalcConvert.D(obj)))
                            {
                                args[i] = new expressions.DoubleExpression(obj, obj.toString())
                            }
                            else
                            {
                                throw Sheets.SR.Exp_NotSupport;
                            }
                        }
                        return new expressions.FunctionExpression(averageFunc, args)
                    }
                    return keyword_null
                };
                AverageCondition.prototype.getExpectedDouble = function(evaluator, baseRow, baseColumn)
                {
                    var obj = this.getExpected(evaluator, baseRow, baseColumn);
                    try
                    {
                        return CalcConvert.D(obj)
                    }
                    catch(err)
                    {
                        return NaN
                    }
                };
                AverageCondition.prototype.getExpected = function(evaluator, baseRow, baseColumn)
                {
                    var calcService = evaluator.getCalcService();
                    if (!calcService)
                    {
                        return keyword_null
                    }
                    var formula = calcService.unparseWithoutCulture(keyword_null, this._expr, baseRow, baseColumn);
                    this._expr = calcService.parse(keyword_null, formula, baseRow, baseColumn);
                    return calcService.evaluateParsedFormula(evaluator._getSheetSource(), this._expr, baseRow, baseColumn, false)
                };
                AverageCondition.prototype._getExpectedByExpression = function(evaluator, expression, baseRow, baseColumn)
                {
                    var calcService = evaluator.getCalcService();
                    if (!calcService)
                    {
                        return keyword_null
                    }
                    var formula = calcService.unparseWithoutCulture(keyword_null, expression, baseRow, baseColumn);
                    expression = calcService.parse(keyword_null, formula, baseRow, baseColumn);
                    return calcService.evaluateParsedFormula(evaluator._getSheetSource(), expression, baseRow, baseColumn, false)
                };
                AverageCondition.prototype.reset = function()
                {
                    var self = this;
                    self.ignoreBlank = false;
                    self.type = 0;
                    self.ranges = keyword_null;
                    self._expr = keyword_null;
                    self._stdevExpr = keyword_null
                };
                AverageCondition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"ignoreBlank":
                            return value === false;
                        default:
                            return false
                    }
                };
                AverageCondition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            type: self.type, ranges: self.ranges, conType: 10, ignoreBlank: self.ignoreBlank
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                AverageCondition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.type !== keyword_null && settings.type !== keyword_undefined)
                    {
                        self.type = settings.type
                    }
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        self.ignoreBlank = settings.ignoreBlank
                    }
                };
                return AverageCondition
            })();
        Sheets.AverageCondition = AverageCondition;
        var ScaleValue = (function()
            {
                function ScaleValue(type, value)
                {
                    this.type = type;
                    this.value = value
                }
                return ScaleValue
            })();
        Sheets.ScaleValue = ScaleValue;
        var ScaleRule = (function(_super)
            {
                __extends(ScaleRule, _super);
                function ScaleRule(scaleValue1, scaleValue2, scaleValue3)
                {
                    _super.call(this, keyword_null);
                    var self = this;
                    self.expected = [];
                    self.lowestValueCached = keyword_null;
                    self.highestValueCached = keyword_null;
                    self.cached = false;
                    self._oldRanges = keyword_null;
                    self.scales = [scaleValue1, scaleValue2, scaleValue3]
                }
                ScaleRule.prototype.stopIfTrue = function()
                {
                    return this._stopIfTrue
                };
                ScaleRule.prototype.isScaleRule = function()
                {
                    return true
                };
                ScaleRule.prototype.createCondition = function()
                {
                    return keyword_null
                };
                ScaleRule.prototype._calculateLowestValueEx = function(evaluator)
                {
                    var rets = (new Top10Condition).getMinValues(evaluator, 1, this.ranges);
                    return (rets.length > 0 ? rets[0] : keyword_null)
                };
                ScaleRule.prototype._calculateHighestValueEx = function(evaluator)
                {
                    var rets = (new Top10Condition).getMaxValues(evaluator, 1, this.ranges);
                    return (rets.length > 0 ? rets[0] : keyword_null)
                };
                ScaleRule.prototype._cloneRanges = function(ranges)
                {
                    var newRanges = [],
                        length = ranges.length,
                        r;
                    for (var i = 0; i < length; i++)
                    {
                        r = ranges[i];
                        newRanges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                    }
                    return newRanges
                };
                ScaleRule.prototype._rangesChanged = function()
                {
                    var oldRanges = this._oldRanges,
                        newRanges = this.ranges;
                    if (!oldRanges)
                    {
                        return false
                    }
                    var oldCount = oldRanges.length,
                        newCount = newRanges.length;
                    if (oldCount !== newCount)
                    {
                        return true
                    }
                    for (var i = 0; i < newCount; i++)
                    {
                        if (!oldRanges[i].equals(newRanges[i]))
                        {
                            return true
                        }
                    }
                    return false
                };
                ScaleRule.prototype._tryCache = function(evaluator)
                {
                    var self = this;
                    if (self._rangesChanged())
                    {
                        self._clearCache();
                        self._oldRanges = self._cloneRanges(self.ranges)
                    }
                    if (self.cached === false)
                    {
                        self.lowestValueCached = self._calculateLowestValueEx(evaluator);
                        self.highestValueCached = self._calculateHighestValueEx(evaluator);
                        self.cached = true
                    }
                };
                ScaleRule.prototype._clearCache = function()
                {
                    this.lowestValueCached = keyword_null;
                    this.highestValueCached = keyword_null;
                    this.cached = false
                };
                ScaleRule.prototype._calculateFormula = function(evaluator, baseRow, baseColumn, formula)
                {
                    if (formula && formula.length > 0)
                    {
                        var calcService = evaluator.getCalcService();
                        if (!calcService)
                        {
                            return keyword_null
                        }
                        var expr = calcService.parse(keyword_null, formula, baseRow, baseColumn);
                        return calcService.evaluateParsedFormula(evaluator._getSheetSource(), expr, baseRow, baseColumn, false)
                    }
                    return keyword_null
                };
                ScaleRule.prototype._isFormula = function(val)
                {
                    return (val) && (val[0] === "=")
                };
                ScaleRule.prototype._trimFormula = function(val)
                {
                    return (val === keyword_undefined || val === keyword_null || val === "") ? keyword_null : ((val[0] === "=") ? val.substr(1) : val)
                };
                ScaleRule.prototype._calculateValue = function(evaluator, baseRow, baseColumn, value)
                {
                    var dValue = keyword_null;
                    if (this._isFormula(value))
                    {
                        dValue = this._calculateFormula(evaluator, baseRow, baseColumn, this._trimFormula(value.toString()))
                    }
                    else
                    {
                        try
                        {
                            dValue = CalcConvert.D(value)
                        }
                        catch(err)
                        {
                            dValue = NaN
                        }
                    }
                    return dValue
                };
                ScaleRule.prototype._getHighestValue = function(evaluator)
                {
                    this._tryCache(evaluator);
                    return this.highestValueCached
                };
                ScaleRule.prototype._getLowestValue = function(evaluator)
                {
                    this._tryCache(evaluator);
                    return this.lowestValueCached
                };
                ScaleRule.prototype._calculatePercent = function(evaluator, baseRow, baseColumn, value)
                {
                    var dValue = this._calculateValue(evaluator, baseRow, baseColumn, value);
                    if (!isNaN(dValue))
                    {
                        if (0 <= dValue && dValue <= 100)
                        {
                            var min = this._getLowestValue(evaluator);
                            var max = this._getHighestValue(evaluator);
                            if (typeof(min) !== const_undefined && min !== keyword_null && typeof(max) !== const_undefined && max !== keyword_null)
                            {
                                return min + (max - min) * dValue / 100.0
                            }
                        }
                    }
                    return keyword_null
                };
                ScaleRule.prototype._calculatePercentile = function(evaluator, baseRow, baseColumn, value)
                {
                    var dValue = this._calculateValue(evaluator, baseRow, baseColumn, value);
                    if (!isNaN(dValue))
                    {
                        if (0 <= dValue && dValue <= 100)
                        {
                            var total = 0,
                                ranges = this.ranges,
                                length = ranges.length;
                            for (var i = 0; i < length; i++)
                            {
                                var exp = this._createExpression("PERCENTILE", [ranges[i], dValue / 100.0]),
                                    calcService = evaluator.getCalcService(),
                                    formula = calcService.unparseWithoutCulture(keyword_null, exp, baseRow, baseColumn),
                                    exp = calcService.parse(keyword_null, formula, baseRow, baseColumn),
                                    val = calcService.evaluateParsedFormula(evaluator._getSheetSource(), exp, baseRow, baseColumn, false);
                                try
                                {
                                    total += CalcConvert.D(val)
                                }
                                catch(InvalidCastException) {}
                            }
                            return (total / length)
                        }
                    }
                    return keyword_null
                };
                ScaleRule.prototype._getActualValue = function(evaluator, baseRow, baseColumn, index, actual)
                {
                    var self = this;
                    var val = self.scales[index];
                    if (val)
                    {
                        switch (val.type)
                        {
                            case 6:
                                return self._calculateValue(evaluator, baseRow, baseColumn, val.value);
                            case 2:
                                return self._getHighestValue(evaluator);
                            case 1:
                                return self._getLowestValue(evaluator);
                            case 0:
                                return self._calculateValue(evaluator, baseRow, baseColumn, val.value);
                            case 3:
                                return self._calculatePercent(evaluator, baseRow, baseColumn, val.value);
                            case 4:
                                return self._calculatePercentile(evaluator, baseRow, baseColumn, val.value);
                            case 7:
                                var max = self._getHighestValue(evaluator);
                                return max < 0.0 ? 0.0 : max;
                            case 5:
                                var min = self._getLowestValue(evaluator);
                                return min > 0.0 ? 0.0 : min
                        }
                    }
                    return keyword_null
                };
                ScaleRule.prototype._evaluate2Scale = function(value, min, max)
                {
                    if (value <= min)
                    {
                        return 0.0
                    }
                    if (value >= max)
                    {
                        return 1.0
                    }
                    return (value - min) / (max - min)
                };
                ScaleRule.prototype.evaluate = function(evaluator, baseRow, baseColumn, actual)
                {
                    var self = this;
                    self._tryCache(evaluator);
                    if (self.contains(baseRow, baseColumn))
                    {
                        if (actual === keyword_undefined || actual === keyword_null)
                        {
                            return keyword_null
                        }
                        try
                        {
                            var numberValue = CalcConvert.D(actual);
                            var minValue = self._getActualValue(evaluator, baseRow, baseColumn, 0);
                            var midValue = self._getActualValue(evaluator, baseRow, baseColumn, 1);
                            var maxValue = self._getActualValue(evaluator, baseRow, baseColumn, 2);
                            if (isNaN(midValue))
                            {
                                if (!isNaN(minValue) && !isNaN(maxValue))
                                {
                                    if (minValue > maxValue)
                                    {
                                        return keyword_null
                                    }
                                    return self._evaluate2Scale(numberValue, minValue, maxValue)
                                }
                            }
                            else
                            {
                                if (!isNaN(minValue) && !isNaN(maxValue) && !isNaN(midValue))
                                {
                                    if (minValue > maxValue)
                                    {
                                        return keyword_null
                                    }
                                    if (numberValue < minValue)
                                    {
                                        return 0.0
                                    }
                                    if (numberValue >= maxValue)
                                    {
                                        return 2.0
                                    }
                                    var midScale = self._evaluate2Scale(midValue, minValue, maxValue);
                                    if (minValue <= numberValue && numberValue <= midValue)
                                    {
                                        return self._evaluate2Scale(numberValue, minValue, midValue)
                                    }
                                    else
                                    {
                                        return 1 + self._evaluate2Scale(numberValue, minValue, maxValue)
                                    }
                                }
                            }
                        }
                        catch(err)
                        {
                            return keyword_null
                        }
                    }
                    return keyword_null
                };
                ScaleRule.prototype._evaluateColor = function(value, color1, color2)
                {
                    if (0 <= value && value <= 1)
                    {
                        var minColor = Sheets._Color.parse(color1);
                        var maxColor = Sheets._Color.parse(color2);
                        var a = (minColor.a) * (1 - value) + (maxColor.a) * (value);
                        var r = (minColor.r) * (1 - value) + (maxColor.r) * (value);
                        var g = (minColor.g) * (1 - value) + (maxColor.g) * (value);
                        var b = (minColor.b) * (1 - value) + (maxColor.b) * (value);
                        return new Sheets._Color(parseFloat((a / 255)), parseInt(r, 10), parseInt(g, 10), parseInt(b, 10)).toString()
                    }
                    return keyword_null
                };
                ScaleRule.prototype._createExpression = function(name, parameters)
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var expressions = Sheets.Calc.Expressions,
                        functions = Sheets.Calc.Functions;
                    var averageFunc = functions.findGlobalFunction(name);
                    if (averageFunc)
                    {
                        var args = [];
                        var length = parameters.length;
                        for (var i = 0; i < length; i++)
                        {
                            var obj = parameters[i];
                            if (obj instanceof expressions.Expression)
                            {
                                args[i] = obj
                            }
                            else if (obj instanceof Sheets.Range)
                            {
                                args[i] = new expressions.RangeExpression(obj.row, obj.col, obj.row + obj.rowCount - 1, obj.col + obj.colCount - 1)
                            }
                            else if (CalcConvert.num(obj) && !isNaN(obj = CalcConvert.D(obj)))
                            {
                                args[i] = new expressions.DoubleExpression(obj, obj.toString())
                            }
                            else
                            {
                                throw Sheets.SR.Exp_NotSupport;
                            }
                        }
                        return new expressions.FunctionExpression(averageFunc, args)
                    }
                    return keyword_null
                };
                ScaleRule.prototype._addRows = function(row, rowCount)
                {
                    _super.prototype._addRows.call(this, row, rowCount);
                    this._clearCache()
                };
                ScaleRule.prototype._addColumns = function(col, colCount)
                {
                    _super.prototype._addColumns.call(this, col, colCount);
                    this._clearCache()
                };
                ScaleRule.prototype._removeRows = function(row, rowCount)
                {
                    _super.prototype._removeRows.call(this, row, rowCount);
                    this._clearCache()
                };
                ScaleRule.prototype._removeColumns = function(col, colCount)
                {
                    _super.prototype._removeColumns.call(this, col, colCount);
                    this._clearCache()
                };
                return ScaleRule
            })(ConditionRuleBase);
        Sheets.ScaleRule = ScaleRule;
        var TwoScaleRule = (function(_super)
            {
                __extends(TwoScaleRule, _super);
                function TwoScaleRule(minType, minValue, minColor, maxType, maxValue, maxColor)
                {
                    var _minType = minType,
                        _minValue = minValue,
                        _minColor = minColor,
                        _maxType = maxType,
                        _maxValue = maxValue,
                        _maxColor = maxColor;
                    if (arguments.length === 0)
                    {
                        _minType = 1;
                        _minValue = keyword_null;
                        _minColor = new Sheets._Color(0, 255, 255, 255).toString();
                        _maxType = 2;
                        _maxValue = keyword_null;
                        _maxColor = new Sheets._Color(255, 99, 190, 123).toString()
                    }
                    var scaleValue1 = new ScaleValue(_minType, _minValue);
                    var scaleValue2 = new ScaleValue(_maxType, _maxValue);
                    _super.call(this, scaleValue1, keyword_null, scaleValue2);
                    this.expected[0] = _minColor;
                    this.expected[2] = _maxColor
                }
                TwoScaleRule.prototype.evaluate = function(evaluator, baseRow, baseColumn, actual)
                {
                    if (actual !== keyword_undefined && actual !== keyword_null)
                    {
                        var numberValue = NaN;
                        try
                        {
                            if (CalcConvert.num(actual))
                            {
                                numberValue = CalcConvert.D(actual)
                            }
                        }
                        catch(InvalidCastException)
                        {
                            return keyword_null
                        }
                        if (isNaN(numberValue))
                        {
                            return keyword_null
                        }
                        var self = this;
                        var minValue = self._getActualValue(evaluator, baseRow, baseColumn, 0);
                        var maxValue = self._getActualValue(evaluator, baseRow, baseColumn, 2);
                        if (minValue !== keyword_undefined && minValue !== keyword_null && maxValue !== keyword_undefined && maxValue !== keyword_null)
                        {
                            var result = self._evaluate2Scale(numberValue, minValue, maxValue);
                            return self._evaluateColor(result, self.expected[0], self.expected[2])
                        }
                    }
                    return keyword_null
                };
                TwoScaleRule.prototype._init = function()
                {
                    var self = this;
                    self.scales = new Array(3);
                    self.scales[0] = new ScaleValue(1, keyword_null);
                    self.scales[2] = new ScaleValue(2, keyword_null);
                    self.expected = new Array(3);
                    self.expected[0] = new Sheets._Color(0, 255, 255, 255).toString();
                    self.expected[2] = new Sheets._Color(255, 99, 190, 123).toString()
                };
                TwoScaleRule.prototype.reset = function()
                {
                    var self = this;
                    self.ranges = keyword_null;
                    self.condition = keyword_null;
                    self.style = keyword_null;
                    self._stopIfTrue = false;
                    self._priority = 1;
                    self._init()
                };
                TwoScaleRule.prototype.getMinimumType = function()
                {
                    var scales = this.scales;
                    return scales && scales.length === 3 ? scales[0].type : keyword_null
                };
                TwoScaleRule.prototype.setMinimumType = function(type)
                {
                    var scales = this.scales;
                    if (scales && scales.length === 3)
                    {
                        scales[0].type = type
                    }
                };
                TwoScaleRule.prototype.getMinimumValue = function()
                {
                    var scales = this.scales;
                    return scales && scales.length === 3 ? scales[0].value : keyword_null
                };
                TwoScaleRule.prototype.setMinimumValue = function(value)
                {
                    var scales = this.scales;
                    if (scales && scales.length === 3)
                    {
                        scales[0].value = value
                    }
                };
                TwoScaleRule.prototype.getMinimumColor = function()
                {
                    return this.expected && this.expected.length === 3 ? this.expected[0] : keyword_null
                };
                TwoScaleRule.prototype.setMinimumColor = function(color)
                {
                    if (this.expected && this.expected.length === 3)
                    {
                        this.expected[0] = color
                    }
                };
                TwoScaleRule.prototype.getMaximumType = function()
                {
                    var scales = this.scales;
                    return scales && scales.length === 3 ? scales[2].type : keyword_null
                };
                TwoScaleRule.prototype.setMaximumType = function(type)
                {
                    var scales = this.scales;
                    if (scales && scales.length === 3)
                    {
                        scales[2].type = type
                    }
                };
                TwoScaleRule.prototype.getMaximumValue = function()
                {
                    var scales = this.scales;
                    return scales && scales.length === 3 ? scales[2].value : keyword_null
                };
                TwoScaleRule.prototype.setMaximumValue = function(value)
                {
                    var scales = this.scales;
                    if (scales && scales.length === 3)
                    {
                        scales[2].value = value
                    }
                };
                TwoScaleRule.prototype.getMaximumColor = function()
                {
                    return this.expected && this.expected.length === 3 ? this.expected[2] : keyword_null
                };
                TwoScaleRule.prototype.setMaximumColor = function(color)
                {
                    if (this.expected && this.expected.length === 3)
                    {
                        this.expected[2] = color
                    }
                };
                TwoScaleRule.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"ranges":
                            return value === keyword_null;
                        case"priority":
                            return value === 1;
                        case"stopIfTrue":
                            return value === false;
                        default:
                            return false
                    }
                };
                TwoScaleRule.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ruleType: 10, ranges: self.ranges, minType: self.getMinimumType(), minValue: self.getMinimumValue(), minColor: self.getMinimumColor(), maxType: self.getMaximumType(), maxValue: self.getMaximumValue(), maxColor: self.getMaximumColor(), priority: self._priority
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                TwoScaleRule.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.minType !== keyword_null && settings.minType !== keyword_undefined)
                    {
                        self.setMinimumType(settings.minType)
                    }
                    if (settings.minValue !== keyword_null && settings.minValue !== keyword_undefined)
                    {
                        self.setMinimumValue(settings.minValue)
                    }
                    if (settings.minColor !== keyword_null && settings.minColor !== keyword_undefined)
                    {
                        self.setMinimumColor(settings.minColor)
                    }
                    if (settings.maxType !== keyword_null && settings.maxType !== keyword_undefined)
                    {
                        self.setMaximumType(settings.maxType)
                    }
                    if (settings.maxValue !== keyword_null && settings.maxValue !== keyword_undefined)
                    {
                        self.setMaximumValue(settings.maxValue)
                    }
                    if (settings.maxColor !== keyword_null && settings.maxColor !== keyword_undefined)
                    {
                        self.setMaximumColor(settings.maxColor)
                    }
                    if (settings.priority !== keyword_null && settings.priority !== keyword_undefined)
                    {
                        self._priority = settings.priority
                    }
                    self._stopIfTrue = false
                };
                return TwoScaleRule
            })(ScaleRule);
        Sheets.TwoScaleRule = TwoScaleRule;
        var ThreeScaleRule = (function(_super)
            {
                __extends(ThreeScaleRule, _super);
                function ThreeScaleRule(minType, minValue, minColor, midType, midValue, midColor, maxType, maxValue, maxColor)
                {
                    var _minType = minType,
                        _minValue = minValue,
                        _minColor = minColor,
                        _midType = midType,
                        _midValue = midValue,
                        _midColor = midColor,
                        _maxType = maxType,
                        _maxValue = maxValue,
                        _maxColor = maxColor;
                    if (arguments.length === 0)
                    {
                        _minType = 1;
                        _minValue = keyword_null;
                        _minColor = new Sheets._Color(255, 248, 105, 107).toString();
                        _midType = 4;
                        _midValue = 50;
                        _midColor = new Sheets._Color(255, 255, 235, 132).toString();
                        _maxType = 2;
                        _maxValue = keyword_null;
                        _maxColor = new Sheets._Color(255, 99, 190, 123).toString()
                    }
                    _super.call(this, new ScaleValue(_minType, _minValue), new ScaleValue(_midType, _midValue), new ScaleValue(_maxType, _maxValue));
                    this.expected[0] = _minColor;
                    this.expected[1] = _midColor;
                    this.expected[2] = _maxColor
                }
                ThreeScaleRule.prototype.evaluate = function(evaluator, baseRow, baseColumn, actual)
                {
                    var self = this;
                    self._evaluator = evaluator;
                    if (actual !== keyword_undefined && actual !== keyword_null)
                    {
                        var numberValue = NaN;
                        try
                        {
                            if (CalcConvert.num(actual))
                            {
                                numberValue = CalcConvert.D(actual)
                            }
                        }
                        catch(InvalidCastException)
                        {
                            return keyword_null
                        }
                        if (isNaN(numberValue))
                        {
                            return keyword_null
                        }
                        var minValue = self._getActualValue(evaluator, baseRow, baseColumn, 0);
                        var midValue = self._getActualValue(evaluator, baseRow, baseColumn, 1);
                        var maxValue = self._getActualValue(evaluator, baseRow, baseColumn, 2);
                        if (minValue !== keyword_undefined && minValue !== keyword_null && maxValue !== keyword_undefined || maxValue !== keyword_null && midValue !== keyword_undefined && midValue !== keyword_null)
                        {
                            if (minValue > maxValue)
                            {
                                return keyword_null
                            }
                            if (numberValue < minValue)
                            {
                                return self.expected[0]
                            }
                            if (numberValue >= maxValue)
                            {
                                return self.expected[2]
                            }
                            var result;
                            if (minValue <= numberValue && numberValue <= midValue)
                            {
                                result = self._evaluate2Scale(numberValue, minValue, midValue);
                                return self._evaluateColor(result, self.expected[0], self.expected[1])
                            }
                            else
                            {
                                result = self._evaluate2Scale(numberValue, midValue, maxValue);
                                return self._evaluateColor(result, self.expected[1], self.expected[2])
                            }
                        }
                    }
                    return keyword_null
                };
                ThreeScaleRule.prototype._init = function()
                {
                    var self = this;
                    self.scales = new Array(3);
                    self.scales[0] = new ScaleValue(1, keyword_null);
                    self.scales[1] = new ScaleValue(4, 50);
                    self.scales[2] = new ScaleValue(2, keyword_null);
                    self.expected = new Array(3);
                    self.expected[0] = new Sheets._Color(255, 248, 105, 107).toString();
                    self.expected[1] = new Sheets._Color(255, 255, 235, 132).toString();
                    self.expected[2] = new Sheets._Color(255, 99, 190, 123).toString()
                };
                ThreeScaleRule.prototype.reset = function()
                {
                    var self = this;
                    self.ranges = keyword_null;
                    self.condition = keyword_null;
                    self.style = keyword_null;
                    self._init();
                    self._evaluator = keyword_null;
                    self._stopIfTrue = false;
                    self._priority = 1
                };
                ThreeScaleRule.prototype.getMinimumType = function()
                {
                    var scales = this.scales;
                    return scales && scales.length === 3 ? scales[0].type : keyword_null
                };
                ThreeScaleRule.prototype.setMinimumType = function(type)
                {
                    var scales = this.scales;
                    if (scales && scales.length === 3)
                    {
                        scales[0].type = type
                    }
                };
                ThreeScaleRule.prototype.getMinimumValue = function()
                {
                    var scales = this.scales;
                    return scales && scales.length === 3 ? scales[0].value : keyword_null
                };
                ThreeScaleRule.prototype.setMinimumValue = function(value)
                {
                    var scales = this.scales;
                    if (scales && scales.length === 3)
                    {
                        scales[0].value = value
                    }
                };
                ThreeScaleRule.prototype.getMinimumColor = function()
                {
                    return this.expected && this.expected.length === 3 ? this.expected[0] : keyword_null
                };
                ThreeScaleRule.prototype.setMinimumColor = function(color)
                {
                    if (this.expected && this.expected.length === 3)
                    {
                        this.expected[0] = color
                    }
                };
                ThreeScaleRule.prototype.getMidpointType = function()
                {
                    var scales = this.scales;
                    return scales && scales.length === 3 ? scales[1].type : keyword_null
                };
                ThreeScaleRule.prototype.setMidpointType = function(type)
                {
                    var scales = this.scales;
                    if (scales && scales.length === 3)
                    {
                        scales[1].type = type
                    }
                };
                ThreeScaleRule.prototype.getMidpointValue = function()
                {
                    var self = this,
                        scales = self.scales;
                    if (scales && scales.length === 3)
                    {
                        if (self._evaluator)
                        {
                            if (scales[1].type === 2)
                            {
                                return self._getHighestValue(self._evaluator)
                            }
                            else if (scales[1].type === 1)
                            {
                                return self._getLowestValue(self._evaluator)
                            }
                        }
                        return scales[1].value
                    }
                    return keyword_null
                };
                ThreeScaleRule.prototype.setMidpointValue = function(value)
                {
                    var scales = this.scales;
                    if (scales && scales.length === 3)
                    {
                        scales[1].value = value
                    }
                };
                ThreeScaleRule.prototype.getMidpointColor = function()
                {
                    return this.expected && this.expected.length === 3 ? this.expected[1] : keyword_null
                };
                ThreeScaleRule.prototype.setMidpointColor = function(color)
                {
                    if (this.expected && this.expected.length === 3)
                    {
                        this.expected[1] = color
                    }
                };
                ThreeScaleRule.prototype.getMaximumType = function()
                {
                    var scales = this.scales;
                    return scales && scales.length === 3 ? scales[2].type : keyword_null
                };
                ThreeScaleRule.prototype.setMaximumType = function(type)
                {
                    var scales = this.scales;
                    if (scales && scales.length === 3)
                    {
                        scales[2].type = type
                    }
                };
                ThreeScaleRule.prototype.getMaximumValue = function()
                {
                    var scales = this.scales;
                    return scales && scales.length === 3 ? scales[2].value : keyword_null
                };
                ThreeScaleRule.prototype.setMaximumValue = function(value)
                {
                    var scales = this.scales;
                    if (scales && scales.length === 3)
                    {
                        scales[2].value = value
                    }
                };
                ThreeScaleRule.prototype.getMaximumColor = function()
                {
                    return this.expected && this.expected.length === 3 ? this.expected[2] : keyword_null
                };
                ThreeScaleRule.prototype.setMaximumColor = function(color)
                {
                    if (this.expected && this.expected.length === 3)
                    {
                        this.expected[2] = color
                    }
                };
                ThreeScaleRule.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"ranges":
                            return value === keyword_null;
                        case"priority":
                            return value === 1;
                        case"stopIfTrue":
                            return value === false;
                        default:
                            return false
                    }
                };
                ThreeScaleRule.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ruleType: 11, ranges: self.ranges, minType: self.getMinimumType(), minValue: self.getMinimumValue(), minColor: self.getMinimumColor(), midType: self.getMidpointType(), midValue: self.getMidpointValue(), midColor: self.getMidpointColor(), maxType: self.getMaximumType(), maxValue: self.getMaximumValue(), maxColor: self.getMaximumColor(), priority: self._priority
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                ThreeScaleRule.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.minType !== keyword_null && settings.minType !== keyword_undefined)
                    {
                        self.setMinimumType(settings.minType)
                    }
                    if (settings.minValue !== keyword_null && settings.minValue !== keyword_undefined)
                    {
                        self.setMinimumValue(settings.minValue)
                    }
                    if (settings.minColor !== keyword_null && settings.minColor !== keyword_undefined)
                    {
                        self.setMinimumColor(settings.minColor)
                    }
                    if (settings.midType !== keyword_null && settings.midType !== keyword_undefined)
                    {
                        self.setMidpointType(settings.midType)
                    }
                    if (settings.midValue !== keyword_null && settings.midValue !== keyword_undefined)
                    {
                        self.setMidpointValue(settings.midValue)
                    }
                    if (settings.midColor !== keyword_null && settings.midColor !== keyword_undefined)
                    {
                        self.setMidpointColor(settings.midColor)
                    }
                    if (settings.maxType !== keyword_null && settings.maxType !== keyword_undefined)
                    {
                        self.setMaximumType(settings.maxType)
                    }
                    if (settings.maxValue !== keyword_null && settings.maxValue !== keyword_undefined)
                    {
                        self.setMaximumValue(settings.maxValue)
                    }
                    if (settings.maxColor !== keyword_null && settings.maxColor !== keyword_undefined)
                    {
                        self.setMaximumColor(settings.maxColor)
                    }
                    if (settings.priority !== keyword_null && settings.priority !== keyword_undefined)
                    {
                        self._priority = settings.priority
                    }
                    self._stopIfTrue = false
                };
                return ThreeScaleRule
            })(ScaleRule);
        Sheets.ThreeScaleRule = ThreeScaleRule;
        var DataBarRule = (function(_super)
            {
                __extends(DataBarRule, _super);
                function DataBarRule(minType, minValue, maxType, maxValue, color)
                {
                    var _minType = minType,
                        _minValue = minValue,
                        _maxType = maxType,
                        _maxValue = maxValue,
                        _color = color;
                    if (arguments.length === 0)
                    {
                        _minType = 5;
                        _minValue = keyword_null;
                        _maxType = 7;
                        _maxValue = keyword_null;
                        _color = new Sheets._Color(255, 99, 142, 198).toString()
                    }
                    var scaleValue1 = new ScaleValue(_minType, _minValue);
                    var scaleValue2 = new ScaleValue(_maxType, _maxValue);
                    _super.call(this, scaleValue1, keyword_null, scaleValue2);
                    this._init(_color)
                }
                DataBarRule.prototype._init = function(color)
                {
                    var self = this;
                    self._gradient = true;
                    self._color = color;
                    self._showBorder = false;
                    self._borderColor = "black";
                    self._dataBarDirection = 0;
                    self._negativeFillColor = "red";
                    self._useNegativeFillColor = true;
                    self._negativeBorderColor = "black";
                    self._useNegativeBorderColor = false;
                    self._axisPosition = 0;
                    self._axisColor = "black";
                    self._showBarOnly = false
                };
                DataBarRule.prototype.reset = function()
                {
                    var self = this;
                    self.ranges = keyword_null;
                    self.condition = keyword_null;
                    self.style = keyword_null;
                    self._init(new Sheets._Color(255, 99, 142, 198).toString());
                    self._stopIfTrue = false;
                    self._priority = 1;
                    self.scales = [];
                    self.scales[0] = new ScaleValue(5, keyword_null);
                    self.scales[2] = new ScaleValue(7, keyword_null);
                    self.expected = []
                };
                DataBarRule.prototype._calcuteMinValue = function(evaluator, baseRow, baseColumn, index, actual)
                {
                    var self = this;
                    var svalue = self.scales[index];
                    var tpRange = keyword_null;
                    if (svalue)
                    {
                        if (svalue.type === 6 || svalue.type === 4)
                        {
                            for (var i = 0; i < self.ranges.length; i++)
                            {
                                if (self.ranges[i].intersect(baseRow, -1, 1, -1))
                                {
                                    tpRange = self.ranges[i];
                                    break
                                }
                            }
                            if (tpRange)
                            {
                                return self._getActualValue(evaluator, tpRange.row, tpRange.col, 0, actual)
                            }
                        }
                        else
                        {
                            return self._getActualValue(evaluator, baseRow, baseColumn, 0, actual)
                        }
                    }
                    return keyword_null
                };
                DataBarRule.prototype._calcuteMaxValue = function(evaluator, baseRow, baseColumn, index, actual)
                {
                    var self = this;
                    var svalue = self.scales[index];
                    var tpRange = keyword_null;
                    if (svalue)
                    {
                        if (svalue.type === 6 || svalue.type === 4)
                        {
                            for (var i = 0; i < self.ranges.length; i++)
                            {
                                if (self.ranges[i].intersect(baseRow, -1, 1, -1))
                                {
                                    tpRange = self.ranges[i];
                                    break
                                }
                            }
                            if (tpRange)
                            {
                                return self._getActualValue(evaluator, tpRange.row, tpRange.col, 2, actual)
                            }
                        }
                        else
                        {
                            return self._getActualValue(evaluator, baseRow, baseColumn, 2, actual)
                        }
                    }
                    return keyword_null
                };
                DataBarRule.prototype._evaluateNoneScale = function(currentValue, minValue, maxValue, axisScale)
                {
                    axisScale = 0.0;
                    if (maxValue === minValue)
                    {
                        if (currentValue < minValue)
                        {
                            return [0.0, axisScale]
                        }
                        else if (currentValue > maxValue)
                        {
                            return [1.0, axisScale]
                        }
                        else
                        {
                            return [0.5, axisScale]
                        }
                    }
                    if (currentValue >= maxValue)
                    {
                        return [1.0, axisScale]
                    }
                    else if (currentValue <= minValue)
                    {
                        return [0.0, axisScale]
                    }
                    else
                    {
                        return [(currentValue - minValue) / (maxValue - minValue), axisScale]
                    }
                };
                DataBarRule.prototype._evaluateMidScale = function(currentValue, minValue, maxValue, axisScale)
                {
                    axisScale = 0.5;
                    var totalValue = Math_abs(maxValue - minValue);
                    if (maxValue > 0 && minValue >= 0)
                    {
                        if (maxValue === minValue)
                        {
                            return [0.5, axisScale]
                        }
                        if (currentValue >= maxValue)
                        {
                            return [0.5, axisScale]
                        }
                        else if (currentValue <= minValue)
                        {
                            return [minValue / maxValue * 0.5, axisScale]
                        }
                        else
                        {
                            return [Math_abs(currentValue / maxValue) * 0.5, axisScale]
                        }
                    }
                    else if (maxValue > 0 && minValue < 0)
                    {
                        var positiveMaxScale = maxValue > Math_abs(minValue) ? 0.5 : maxValue / totalValue;
                        var negativeMaxScale = maxValue > Math_abs(minValue) ? minValue / totalValue : -0.5;
                        if (currentValue > 0)
                        {
                            if (currentValue >= maxValue)
                            {
                                return [positiveMaxScale, axisScale]
                            }
                            else
                            {
                                return [(currentValue / maxValue) * positiveMaxScale, axisScale]
                            }
                        }
                        else if (currentValue < 0)
                        {
                            if (currentValue <= minValue)
                            {
                                return [negativeMaxScale, axisScale]
                            }
                            else
                            {
                                return [(currentValue / minValue) * negativeMaxScale, axisScale]
                            }
                        }
                        else
                        {
                            return [0.0, axisScale]
                        }
                    }
                    else if (maxValue <= 0 && minValue < 0)
                    {
                        if (maxValue === minValue)
                        {
                            return [-0.5, axisScale]
                        }
                        if (currentValue >= maxValue)
                        {
                            return [-maxValue / minValue * 0.5, axisScale]
                        }
                        else if (currentValue <= minValue)
                        {
                            return [-0.5, axisScale]
                        }
                        else
                        {
                            return [-currentValue / minValue * 0.5, axisScale]
                        }
                    }
                    else if (maxValue === 0 && minValue === 0)
                    {
                        return [0.0, axisScale]
                    }
                    axisScale = -1;
                    return [-1, axisScale]
                };
                DataBarRule.prototype._evaluateAutoScale = function(currentValue, minValue, maxValue, axisScale)
                {
                    var totalValue = Math_abs(maxValue - minValue);
                    if (maxValue > 0 && minValue >= 0)
                    {
                        axisScale = 0.0;
                        if (minValue === maxValue)
                        {
                            if (currentValue < minValue)
                            {
                                return [0.0, axisScale]
                            }
                            else if (currentValue > maxValue)
                            {
                                return [1.0, axisScale]
                            }
                            else
                            {
                                return [0.5, axisScale]
                            }
                        }
                        if (currentValue <= minValue)
                        {
                            return [0.0, axisScale]
                        }
                        else if (currentValue >= maxValue)
                        {
                            return [1.0, axisScale]
                        }
                        else
                        {
                            return [(currentValue - minValue) / totalValue, axisScale]
                        }
                    }
                    else if (maxValue > 0 && minValue < 0)
                    {
                        axisScale = Math_abs(minValue) / totalValue;
                        if (currentValue >= maxValue)
                        {
                            return [1 - axisScale, axisScale]
                        }
                        else if (currentValue <= minValue)
                        {
                            return [-axisScale, axisScale]
                        }
                        else
                        {
                            if (currentValue === 0)
                            {
                                return [0.0, axisScale]
                            }
                            else
                            {
                                return [(currentValue - 0.0) / totalValue, axisScale]
                            }
                        }
                    }
                    else if (maxValue <= 0 && minValue < 0)
                    {
                        axisScale = 1.0;
                        if (maxValue === minValue)
                        {
                            if (currentValue < minValue)
                            {
                                return [-1.0, axisScale]
                            }
                            else if (currentValue > maxValue)
                            {
                                return [0.0, axisScale]
                            }
                            else
                            {
                                return [-0.5, axisScale]
                            }
                        }
                        if (currentValue >= maxValue)
                        {
                            return [-0.0, axisScale]
                        }
                        else if (currentValue <= minValue)
                        {
                            return [-1.0, axisScale]
                        }
                        else
                        {
                            return [(currentValue - maxValue) / totalValue, axisScale]
                        }
                    }
                    else if (maxValue === 0 && minValue === 0)
                    {
                        axisScale = 0.5;
                        if (currentValue > 0)
                        {
                            return [0.5, axisScale]
                        }
                        else if (currentValue < 0)
                        {
                            return [-0.5, axisScale]
                        }
                        else
                        {
                            return [0.0, axisScale]
                        }
                    }
                    axisScale = -1;
                    return [-1, axisScale]
                };
                DataBarRule.prototype._evaluateScale = function(currentValue, minValue, maxValue, axisScale)
                {
                    var self = this;
                    if (self._axisPosition === 0)
                    {
                        return self._evaluateAutoScale(currentValue, minValue, maxValue, axisScale)
                    }
                    else if (self._axisPosition === 1)
                    {
                        return self._evaluateMidScale(currentValue, minValue, maxValue, axisScale)
                    }
                    else
                    {
                        return self._evaluateNoneScale(currentValue, minValue, maxValue, axisScale)
                    }
                };
                DataBarRule.paintDataBar = function(ctx, obj, x, y, w, h)
                {
                    var rc = new Sheets.Rect(x + 2, y + 2, w - 4, h - 4),
                        startX = rc.x,
                        startY = rc.y,
                        width = Math_floor(Math_abs(rc.width * obj.scale)),
                        height = rc.height;
                    if (obj.axisLocation === 0)
                    {
                        if (obj.scale <= 0)
                        {
                            width = 0
                        }
                    }
                    else if (obj.axisLocation === 1)
                    {
                        if (obj.scale < 0)
                        {
                            startX = startX + rc.width - width
                        }
                        else
                        {
                            width = 0
                        }
                    }
                    else
                    {
                        var axisX = Math_floor(rc.width * obj.axisLocation + startX) + 0.5,
                            axisY = rc.y,
                            axisWidth = 1.0,
                            axisHeight = h - 1;
                        ctx.lineWidth = axisWidth;
                        ctx.strokeStyle = obj.axisColor;
                        ctx.beginPath();
                        for (var len = 0; len <= axisHeight; len += 2)
                        {
                            if (obj.direction === 1)
                            {
                                ctx.moveTo(2 * x + w - axisX, axisY + len);
                                ctx.lineTo(2 * x + w - axisX, axisY + len + 1)
                            }
                            else
                            {
                                ctx.moveTo(axisX, axisY + len);
                                ctx.lineTo(axisX, axisY + len + 1)
                            }
                        }
                        ctx.stroke();
                        if (obj.scale > 0.0)
                        {
                            startX = axisX + axisWidth
                        }
                        else if (obj.scale < 0.0)
                        {
                            startX = axisX - width
                        }
                        else
                        {
                            width = 0.0
                        }
                    }
                    if (obj.showBorder)
                    {
                        startX = Math_floor(startX) + 0.5;
                        width -= 1;
                        startY += 0.5;
                        height -= 1
                    }
                    if (width >= 0 && height >= 0)
                    {
                        var fillStyle = obj.fillColor;
                        if (obj.isGradient)
                        {
                            var factor = 0.9;
                            if (obj.direction === 1)
                            {
                                fillStyle = ctx.createLinearGradient(2 * x + w - startX - width, startY, 2 * x + w - startX, startY + height)
                            }
                            else
                            {
                                fillStyle = ctx.createLinearGradient(startX, startY, startX + width, startY + height)
                            }
                            var tempColor = Sheets._Color.parse(obj.fillColor),
                                color1 = new Sheets._Color(tempColor.a, Math_floor(255 * factor + tempColor.r * (1 - factor)), Math_floor(255 * factor + tempColor.g * (1 - factor)), Math_floor(255 * factor + tempColor.b * (1 - factor))).toString(),
                                offset1 = obj.scale < 0 ? 1 - factor : factor,
                                color2 = obj.fillColor,
                                offset2 = obj.scale < 0 ? 1 : 0;
                            if (obj.direction === 1)
                            {
                                fillStyle.addColorStop(offset1, color2);
                                fillStyle.addColorStop(offset2, color1)
                            }
                            else
                            {
                                fillStyle.addColorStop(offset1, color1);
                                fillStyle.addColorStop(offset2, color2)
                            }
                        }
                        if (ctx.fillStyle !== fillStyle)
                        {
                            ctx.fillStyle = fillStyle
                        }
                        if (obj.direction === 1)
                        {
                            ctx.fillRect(2 * x + w - startX - width, startY, width, height)
                        }
                        else
                        {
                            ctx.fillRect(startX, startY, width, height)
                        }
                        if (obj.showBorder && width > 0 && height > 0)
                        {
                            ctx.strokeStyle = obj.borderColor;
                            if (obj.direction === 1)
                            {
                                ctx.strokeRect(2 * x + w - startX - width, startY, width, height)
                            }
                            else
                            {
                                ctx.strokeRect(startX, startY, width, height)
                            }
                        }
                    }
                };
                DataBarRule.prototype.evaluate = function(evaluator, baseRow, baseColumn, actual)
                {
                    var value = actual;
                    if (value !== keyword_null && value !== keyword_undefined)
                    {
                        var numberValue = NaN;
                        try
                        {
                            if (CalcConvert.num(value))
                            {
                                numberValue = CalcConvert.D(value)
                            }
                        }
                        catch(ex)
                        {
                            return keyword_null
                        }
                        if (isNaN(numberValue))
                        {
                            return keyword_null
                        }
                        var self = this;
                        var minValue = self._calcuteMinValue(evaluator, baseRow, baseColumn, 0, actual);
                        var maxValue = self._calcuteMaxValue(evaluator, baseRow, baseColumn, 2, actual);
                        if (minValue instanceof Date)
                        {
                            minValue = new Sheets._DateTimeHelper(minValue).toOADate()
                        }
                        if (maxValue instanceof Date)
                        {
                            maxValue = new Sheets._DateTimeHelper(maxValue).toOADate()
                        }
                        if (minValue !== keyword_null && minValue !== keyword_undefined && maxValue !== keyword_null && maxValue !== keyword_undefined)
                        {
                            if (minValue > maxValue)
                            {
                                var tpNum = maxValue;
                                maxValue = minValue;
                                minValue = tpNum
                            }
                            var axisScale;
                            var resultArray = self._evaluateScale(numberValue, minValue, maxValue, axisScale);
                            if (!resultArray || resultArray.length < 2)
                            {
                                return keyword_null
                            }
                            var barScale = resultArray[0];
                            axisScale = resultArray[1];
                            var fillColor = numberValue < 0 && self._useNegativeFillColor ? self._negativeFillColor : self._color;
                            var borderFillColor = numberValue < 0 && self._useNegativeBorderColor ? self._negativeBorderColor : self._borderColor;
                            return {
                                    fillColor: fillColor, borderColor: borderFillColor, showBorder: self._showBorder, axisColor: self._axisColor, isGradient: self._gradient, direction: self._dataBarDirection, axisLocation: axisScale, scale: barScale, showBarOnly: self._showBarOnly
                                }
                        }
                    }
                    return keyword_null
                };
                DataBarRule.prototype.minimumType = function(value)
                {
                    var self = this,
                        scales = self.scales;
                    if (arguments.length === 0)
                    {
                        return scales && scales.length === 3 ? scales[0].type : keyword_null
                    }
                    else
                    {
                        if (scales && scales.length === 3)
                        {
                            scales[0].type = value
                        }
                        return self
                    }
                };
                DataBarRule.prototype.minimumValue = function(value)
                {
                    var self = this,
                        scales = self.scales;
                    if (arguments.length === 0)
                    {
                        return scales && scales.length === 3 ? scales[0].value : keyword_null
                    }
                    else
                    {
                        if (scales && scales.length === 3)
                        {
                            scales[0].value = value
                        }
                        return self
                    }
                };
                DataBarRule.prototype.maximumType = function(value)
                {
                    var self = this,
                        scales = self.scales;
                    if (arguments.length === 0)
                    {
                        return scales && scales.length === 3 ? scales[2].type : keyword_null
                    }
                    else
                    {
                        if (scales && scales.length === 3)
                        {
                            scales[2].type = value
                        }
                        return self
                    }
                };
                DataBarRule.prototype.maximumValue = function(value)
                {
                    var self = this,
                        scales = self.scales;
                    if (arguments.length === 0)
                    {
                        return scales && scales.length === 3 ? scales[2].value : keyword_null
                    }
                    else
                    {
                        if (scales && scales.length === 3)
                        {
                            scales[2].value = value
                        }
                        return self
                    }
                };
                DataBarRule.prototype.gradient = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._gradient
                    }
                    else
                    {
                        this._gradient = value;
                        return this
                    }
                };
                DataBarRule.prototype.color = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._color
                    }
                    else
                    {
                        this._color = value;
                        return this
                    }
                };
                DataBarRule.prototype.showBorder = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._showBorder
                    }
                    else
                    {
                        this._showBorder = value;
                        return this
                    }
                };
                DataBarRule.prototype.borderColor = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._borderColor
                    }
                    else
                    {
                        this._borderColor = value;
                        return this
                    }
                };
                DataBarRule.prototype.dataBarDirection = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._dataBarDirection
                    }
                    else
                    {
                        this._dataBarDirection = value;
                        return this
                    }
                };
                DataBarRule.prototype.negativeFillColor = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._negativeFillColor
                    }
                    else
                    {
                        this._negativeFillColor = value;
                        return this
                    }
                };
                DataBarRule.prototype.useNegativeFillColor = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._useNegativeFillColor
                    }
                    else
                    {
                        this._useNegativeFillColor = value;
                        return this
                    }
                };
                DataBarRule.prototype.negativeBorderColor = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._negativeBorderColor
                    }
                    else
                    {
                        this._negativeBorderColor = value;
                        return this
                    }
                };
                DataBarRule.prototype.useNegativeBorderColor = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._useNegativeBorderColor
                    }
                    else
                    {
                        this._useNegativeBorderColor = value;
                        return this
                    }
                };
                DataBarRule.prototype.axisPosition = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._axisPosition
                    }
                    else
                    {
                        this._axisPosition = value;
                        return this
                    }
                };
                DataBarRule.prototype.axisColor = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._axisColor
                    }
                    else
                    {
                        this._axisColor = value;
                        return this
                    }
                };
                DataBarRule.prototype.showBarOnly = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._showBarOnly
                    }
                    else
                    {
                        this._showBarOnly = value;
                        return this
                    }
                };
                DataBarRule.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"ranges":
                            return value === keyword_null;
                        case"gradient":
                            return value === true;
                        case"showBorder":
                            return value === false;
                        case"borderColor":
                            return value === "black";
                        case"dataBarDirection":
                            return value === 0;
                        case"negativeFillColor":
                            return value === "red";
                        case"useNegativeFillColor":
                            return value === true;
                        case"negativeBorderColor":
                            return value === "black";
                        case"useNegativeBorderColor":
                            return value === false;
                        case"axisPosition":
                            return value === 0;
                        case"axisColor":
                            return value === "black";
                        case"showBarOnly":
                            return value === false;
                        case"priority":
                            return value === 1;
                        case"stopIfTrue":
                            return value === false
                    }
                };
                DataBarRule.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ruleType: 12, ranges: self.ranges, minType: self.minimumType(), minValue: self.minimumValue(), maxType: self.maximumType(), maxValue: self.maximumValue(), gradient: self.gradient(), color: self.color(), showBorder: self.showBorder(), borderColor: self.borderColor(), dataBarDirection: self.dataBarDirection(), negativeFillColor: self.negativeFillColor(), useNegativeFillColor: self.useNegativeFillColor(), negativeBorderColor: self.negativeBorderColor(), useNegativeBorderColor: self.useNegativeBorderColor(), axisPosition: self.axisPosition(), axisColor: self.axisColor(), showBarOnly: self.showBarOnly(), priority: self._priority
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                DataBarRule.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.minType !== keyword_null && settings.minType !== keyword_undefined)
                    {
                        self.minimumType(settings.minType)
                    }
                    if (settings.minValue !== keyword_null && settings.minValue !== keyword_undefined)
                    {
                        self.minimumValue(settings.minValue)
                    }
                    if (settings.maxType !== keyword_null && settings.maxType !== keyword_undefined)
                    {
                        self.maximumType(settings.maxType)
                    }
                    if (settings.maxValue !== keyword_null && settings.maxValue !== keyword_undefined)
                    {
                        self.maximumValue(settings.maxValue)
                    }
                    if (settings.gradient !== keyword_null && settings.gradient !== keyword_undefined)
                    {
                        self.gradient(settings.gradient)
                    }
                    if (settings.color !== keyword_null && settings.color !== keyword_undefined)
                    {
                        self.color(settings.color)
                    }
                    if (settings.showBorder !== keyword_null && settings.showBorder !== keyword_undefined)
                    {
                        self.showBorder(settings.showBorder)
                    }
                    if (settings.borderColor !== keyword_null && settings.borderColor !== keyword_undefined)
                    {
                        self.borderColor(settings.borderColor)
                    }
                    if (settings.dataBarDirection !== keyword_null && settings.dataBarDirection !== keyword_undefined)
                    {
                        self.dataBarDirection(settings.dataBarDirection)
                    }
                    if (settings.negativeFillColor !== keyword_null && settings.negativeFillColor !== keyword_undefined)
                    {
                        self.negativeFillColor(settings.negativeFillColor)
                    }
                    if (settings.useNegativeFillColor !== keyword_null && settings.useNegativeFillColor !== keyword_undefined)
                    {
                        self.useNegativeFillColor(settings.useNegativeFillColor)
                    }
                    if (settings.negativeBorderColor !== keyword_null && settings.negativeBorderColor !== keyword_undefined)
                    {
                        self.negativeBorderColor(settings.negativeBorderColor)
                    }
                    if (settings.useNegativeBorderColor !== keyword_null && settings.useNegativeBorderColor !== keyword_undefined)
                    {
                        self.useNegativeBorderColor(settings.useNegativeBorderColor)
                    }
                    if (settings.axisPosition !== keyword_null && settings.axisPosition !== keyword_undefined)
                    {
                        self.axisPosition(settings.axisPosition)
                    }
                    if (settings.axisColor !== keyword_null && settings.axisColor !== keyword_undefined)
                    {
                        self.axisColor(settings.axisColor)
                    }
                    if (settings.showBarOnly !== keyword_null && settings.showBarOnly !== keyword_undefined)
                    {
                        self.showBarOnly(settings.showBarOnly)
                    }
                    if (settings.priority !== keyword_null && settings.priority !== keyword_undefined)
                    {
                        self._priority = settings.priority
                    }
                    self._stopIfTrue = false
                };
                return DataBarRule
            })(ScaleRule);
        Sheets.DataBarRule = DataBarRule;
        var IconCriterion = (function()
            {
                function IconCriterion(isGreaterThanOrEqualTo, iconValueType, iconValue)
                {
                    this.isGreaterThanOrEqualTo = isGreaterThanOrEqualTo;
                    this.iconValueType = iconValueType;
                    this.iconValue = iconValue
                }
                return IconCriterion
            })();
        Sheets.IconCriterion = IconCriterion;
        var IconSetRule = (function(_super)
            {
                __extends(IconSetRule, _super);
                function IconSetRule(iconSetType)
                {
                    var _iconSetType = iconSetType;
                    if (arguments.length === 0)
                    {
                        _iconSetType = 0
                    }
                    _super.call(this, keyword_null, keyword_null, keyword_null);
                    this._init(_iconSetType)
                }
                IconSetRule.prototype._initIconSetType = function(iconSetType)
                {
                    var self = this;
                    self._iconSetType = iconSetType;
                    if (self._iconSetType >= 0 && self._iconSetType <= 9)
                    {
                        self._iconCriteria = new Array(2);
                        self._iconCriteria[0] = new IconCriterion(true, 4, 33);
                        self._iconCriteria[1] = new IconCriterion(true, 4, 67)
                    }
                    else if (self._iconSetType >= 10 && self._iconSetType <= 14)
                    {
                        self._iconCriteria = new Array(3);
                        self._iconCriteria[0] = new IconCriterion(true, 4, 25);
                        self._iconCriteria[1] = new IconCriterion(true, 4, 50);
                        self._iconCriteria[2] = new IconCriterion(true, 4, 75)
                    }
                    else if (self._iconSetType >= 15 && self._iconSetType <= 19)
                    {
                        self._iconCriteria = new Array(4);
                        self._iconCriteria[0] = new IconCriterion(true, 4, 20);
                        self._iconCriteria[1] = new IconCriterion(true, 4, 40);
                        self._iconCriteria[2] = new IconCriterion(true, 4, 60);
                        self._iconCriteria[3] = new IconCriterion(true, 4, 80)
                    }
                    else if (self._iconSetType > 19)
                    {
                        self._iconCriteria = new Array
                    }
                };
                IconSetRule.prototype._init = function(iconSetType)
                {
                    this._showIconOnly = false;
                    this._reverseIconOrder = false;
                    this._initIconSetType(iconSetType)
                };
                IconSetRule.prototype._modifyIconIndex = function(index)
                {
                    var iconCount = this._iconCriteria.length + 1;
                    if (this._reverseIconOrder && iconCount > 2)
                    {
                        return iconCount - 1 - index
                    }
                    return index
                };
                IconSetRule.prototype._getActualValue = function(evaluator, baseRow, baseColumn, index)
                {
                    var self = this;
                    var value = self._iconCriteria[index];
                    if (value)
                    {
                        switch (value.iconValueType)
                        {
                            case 7:
                                return self._calculateValue(evaluator, baseRow, baseColumn, value.iconValue);
                            case 1:
                                return self._calculateValue(evaluator, baseRow, baseColumn, value.iconValue);
                            case 4:
                                return self._calculatePercent(evaluator, baseRow, baseColumn, value.iconValue);
                            case 5:
                                return self._calculatePercentile(evaluator, baseRow, baseColumn, value.iconValue)
                        }
                    }
                    return keyword_null
                };
                IconSetRule.paintIconSet = function(ctx, obj, x, y, w, h, style, imageLoader)
                {
                    var startX = x + 1,
                        startY = y + 2,
                        width = 16.0,
                        height = 16.0;
                    if (obj.showIconOnly)
                    {
                        if (style.hAlign == 1)
                        {
                            startX = x + w / 2.0 - width / 2.0
                        }
                        else if (style.hAlign == 2)
                        {
                            startX = x + w - width - 2
                        }
                    }
                    if (style.vAlign == 1)
                    {
                        startY = y + h / 2.0 - height / 2.0
                    }
                    else if (style.vAlign == 2)
                    {
                        startY = y + h - height - 2
                    }
                    var icon = IconSetRule.getIcon(obj.iconSetType, obj.iconIndex);
                    try
                    {
                        if (icon && imageLoader)
                        {
                            if ($.type(icon) === "string")
                            {
                                if (imageLoader.getState(icon))
                                {
                                    ctx.drawImage(imageLoader.getImage(icon), startX, startY, width, height)
                                }
                                else
                                {
                                    imageLoader.addImage(icon)
                                }
                            }
                            else
                            {
                                if (imageLoader.getState(icon.image))
                                {
                                    ctx.drawImage(imageLoader.getImage(icon.image), icon.x, icon.y, icon.w, icon.h, startX, startY, width, height)
                                }
                                else
                                {
                                    imageLoader.addImage(icon.image)
                                }
                            }
                        }
                    }
                    catch(ex) {}
                };
                IconSetRule.prototype.evaluate = function(evaluator, baseRow, baseColumn, actual)
                {
                    var self = this;
                    var value = actual;
                    if (value === keyword_null || value === keyword_undefined)
                    {
                        return keyword_null
                    }
                    var numberValue = NaN;
                    try
                    {
                        if (CalcConvert.num(value))
                        {
                            numberValue = CalcConvert.D(value)
                        }
                    }
                    catch(ex)
                    {
                        return keyword_null
                    }
                    if (isNaN(numberValue))
                    {
                        return keyword_null
                    }
                    var iconCount = 0,
                        iconSetType = self._iconSetType,
                        iconCriteria = self._iconCriteria;
                    if (iconSetType >= 0 && iconSetType <= 9)
                    {
                        iconCount = 3
                    }
                    else if (iconSetType >= 10 && iconSetType <= 14)
                    {
                        iconCount = 4
                    }
                    else if (iconSetType >= 15 && iconSetType <= 19)
                    {
                        iconCount = 5
                    }
                    if (!iconCriteria)
                    {
                        return 0
                    }
                    var lastValue = Number.MAX_VALUE,
                        showIconOnly = self._showIconOnly,
                        criterion,
                        iconValue;
                    for (var n = iconCount - 1; n > 0; n--)
                    {
                        if (n < iconCriteria.length + 1)
                        {
                            criterion = iconCriteria[n - 1];
                            iconValue = (criterion && criterion.iconValue);
                            if (iconValue !== keyword_null && typeof(iconValue) !== const_undefined)
                            {
                                var currentValue = self._getActualValue(evaluator, baseRow, baseColumn, n - 1);
                                if (currentValue !== keyword_null && typeof(currentValue) !== const_undefined)
                                {
                                    if (criterion.isGreaterThanOrEqualTo)
                                    {
                                        if (numberValue < lastValue && numberValue >= currentValue)
                                        {
                                            return {
                                                    iconSetType: iconSetType, iconIndex: self._modifyIconIndex(n), showIconOnly: showIconOnly
                                                }
                                        }
                                    }
                                    else
                                    {
                                        if (numberValue < lastValue && numberValue > currentValue)
                                        {
                                            return {
                                                    iconSetType: iconSetType, iconIndex: self._modifyIconIndex(n), showIconOnly: showIconOnly
                                                }
                                        }
                                    }
                                }
                                else
                                {
                                    return {
                                            iconSetType: iconSetType, iconIndex: self._modifyIconIndex(0), showIconOnly: showIconOnly
                                        }
                                }
                            }
                            else
                            {
                                return {
                                        iconSetType: iconSetType, iconIndex: self._modifyIconIndex(0), showIconOnly: showIconOnly
                                    }
                            }
                        }
                        else
                        {
                            return {
                                    iconSetType: iconSetType, iconIndex: self._modifyIconIndex(0), showIconOnly: showIconOnly
                                }
                        }
                    }
                    return {
                            iconSetType: iconSetType, iconIndex: self._modifyIconIndex(0), showIconOnly: showIconOnly
                        }
                };
                IconSetRule.prototype.reset = function()
                {
                    var self = this;
                    self.ranges = keyword_null;
                    self.condition = keyword_null;
                    self.style = keyword_null;
                    self._showIconOnly = false;
                    self._reverseIconOrder = false;
                    self._iconSetType = 0;
                    self._iconCriteria = keyword_null;
                    self._stopIfTrue = false;
                    self._priority = 1;
                    self.scales = [];
                    self.expected = []
                };
                IconSetRule.prototype.iconSetType = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._iconSetType
                    }
                    else
                    {
                        this._initIconSetType(value);
                        return this
                    }
                };
                IconSetRule.prototype.reverseIconOrder = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._reverseIconOrder
                    }
                    else
                    {
                        this._reverseIconOrder = value;
                        return this
                    }
                };
                IconSetRule.prototype.showIconOnly = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._showIconOnly
                    }
                    else
                    {
                        this._showIconOnly = value;
                        return this
                    }
                };
                IconSetRule.prototype.iconCriteria = function()
                {
                    return this._iconCriteria
                };
                IconSetRule.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"showIconOnly":
                            return value === false;
                        case"reverseIconOrder":
                            return value === false;
                        case"priority":
                            return value === 1;
                        case"stopIfTrue":
                            return value === false;
                        default:
                            return false
                    }
                };
                IconSetRule.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            ruleType: 13, ranges: self.ranges, iconSetType: self.iconSetType(), iconCriteria: self.iconCriteria(), showIconOnly: self.showIconOnly(), reverseIconOrder: self.reverseIconOrder(), priority: self._priority
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                IconSetRule.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.ranges)
                    {
                        self.ranges = [];
                        for (var i = 0; i < settings.ranges.length; i++)
                        {
                            var r = settings.ranges[i];
                            self.ranges.push(new Sheets.Range(r.row, r.col, r.rowCount, r.colCount))
                        }
                    }
                    if (settings.iconSetType !== keyword_null && settings.iconSetType !== keyword_undefined)
                    {
                        self._initIconSetType(settings.iconSetType)
                    }
                    if (settings.iconCriteria !== keyword_null && settings.iconCriteria !== keyword_undefined)
                    {
                        var length = settings.iconCriteria.length;
                        for (var i = 0; i < length; i++)
                        {
                            var iconCriterion = settings.iconCriteria[i];
                            self._iconCriteria[i] = new IconCriterion(iconCriterion.isGreaterThanOrEqualTo, iconCriterion.iconValueType, iconCriterion.iconValue)
                        }
                    }
                    if (settings.showIconOnly !== keyword_null && settings.showIconOnly !== keyword_undefined)
                    {
                        self.showIconOnly(settings.showIconOnly)
                    }
                    if (settings.reverseIconOrder !== keyword_null && settings.reverseIconOrder !== keyword_undefined)
                    {
                        self.reverseIconOrder(settings.reverseIconOrder)
                    }
                    if (settings.priority !== keyword_null && settings.priority !== keyword_undefined)
                    {
                        self._priority = settings.priority
                    }
                    self._stopIfTrue = false
                };
                IconSetRule._getImageSrc = function()
                {
                    return "data:image/png;base64,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"
                };
                IconSetRule.getIcon = function(iconSetType, iconIndex)
                {
                    var iconArray = [["0,160,16,16", "0,180,16,16", "0,80,16,16", keyword_null, keyword_null], ["0,100,16,16", "0,120,16,16", "0,140,16,16", keyword_null, keyword_null], ["0,900,16,16", "0,920,16,16", "0,880,16,16", keyword_null, keyword_null], ["0,820,16,16", "0,840,16,16", "0,860,16,16", keyword_null, keyword_null], ["0,780,16,16", "0,1000,16,16", "0,420,16,16", keyword_null, keyword_null], ["0,680,16,16", "0,940,16,16", "0,400,16,16", keyword_null, keyword_null], ["0,800,16,16", "0,1020,16,16", "0,440,16,16", keyword_null, keyword_null], ["0,740,16,16", "0,1040,16,16", "0,400,16,16", keyword_null, keyword_null], ["0,720,16,16", "0,980,16,16", "0,380,16,16", keyword_null, keyword_null], ["0,700,16,16", "0,960,16,16", "0,360,16,16", keyword_null, keyword_null], ["0,160,16,16", "0,40,16,16", "0,60,16,16", "0,80,16,16", keyword_null], ["0,100,16,16", "0,0,16,16", "0,20,16,16", "0,140,16,16", keyword_null], ["0,220,16,16", "0,340,16,16", "0,460,16,16", "0,760,16,16", keyword_null], ["0,600,16,16", "0,620,16,16", "0,640,16,16", "0,660,16,16", keyword_null], ["0,200,16,16", "0,680,16,16", "0,940,16,16", "0,400,16,16", keyword_null], ["0,160,16,16", "0,40,16,16", "0,180,16,16", "0,60,16,16", "0,80,16,16"], ["0,100,16,16", "0,0,16,16", "0,120,16,16", "0,20,16,16", "0,140,16,16"], ["0,580,16,16", "0,600,16,16", "0,620,16,16", "0,640,16,16", "0,660,16,16"], ["0,480,16,16", "0,500,16,16", "0,520,16,16", "0,540,16,16", "0,560,16,16"], ["0,240,16,16", "0,260,16,16", "0,280,16,16", "0,300,16,16", "0,320,16,16"]];
                    var image = IconSetRule._getImageSrc();
                    var imageRect = iconArray[iconSetType][iconIndex];
                    if (imageRect)
                    {
                        var rect = imageRect.split(",");
                        return {
                                image: image, x: rect[0], y: rect[1], w: rect[2], h: rect[3]
                            }
                    }
                    return keyword_null
                };
                return IconSetRule
            })(ScaleRule);
        Sheets.IconSetRule = IconSetRule;
        var AreaCondition = (function()
            {
                function AreaCondition(expected, formula)
                {
                    this.ignoreBlank = false;
                    this.expected = typeof(expected) === "string" ? expected : "";
                    this.formula = (typeof(formula) === "string") ? StringHelper_TrimStart($.trim(formula), "=") : formula
                }
                AreaCondition.prototype._concatArray = function(destArray, array)
                {
                    var temp,
                        i;
                    if (array.length === 1)
                    {
                        temp = array[0];
                        if (temp instanceof Array)
                        {
                            for (i = 0; i < temp.length; i++)
                            {
                                destArray.push(temp[i])
                            }
                        }
                        else
                        {
                            destArray.push(temp)
                        }
                    }
                    else
                    {
                        for (i = 0; i < array.length; i++)
                        {
                            temp = array[i];
                            if (temp instanceof Array)
                            {
                                if (temp.length > 0)
                                {
                                    destArray.push(temp[0])
                                }
                            }
                            else
                            {
                                destArray.push(temp)
                            }
                        }
                    }
                };
                AreaCondition.prototype.getValidList = function(evaluator, baseRow, baseColumn)
                {
                    var valueList = [];
                    var list = this.getValidListImp(evaluator, baseRow, baseColumn);
                    for (var i = 0, length = list.length; i < length; i++)
                    {
                        valueList.push(list[i].value)
                    }
                    return valueList
                };
                AreaCondition.prototype.getValidListImp = function(evaluator, baseRow, baseColumn)
                {
                    var self = this;
                    var validValuesTemp = [];
                    if (self.formula && self.formula.length > 0)
                    {
                        var obj = self.getExpected(evaluator, baseRow, baseColumn);
                        if (obj instanceof Array)
                        {
                            self._concatArray(validValuesTemp, obj)
                        }
                        else
                        {
                            validValuesTemp.push(obj)
                        }
                    }
                    else if (self.expected && self.expected.length > 0)
                    {
                        var source = self.expected;
                        var datas = source.split(",");
                        if (datas)
                        {
                            for (var i = 0; i < datas.length; i++)
                            {
                                var data = datas[i];
                                if (data === keyword_undefined || data === keyword_null || data === "")
                                {
                                    continue
                                }
                                var dataTemp = $.trim(data);
                                if (dataTemp !== keyword_undefined && dataTemp !== keyword_null && dataTemp !== "")
                                {
                                    validValuesTemp.push({
                                        text: dataTemp, value: dataTemp
                                    })
                                }
                            }
                        }
                    }
                    return validValuesTemp
                };
                AreaCondition.prototype._equals = function(v1, v2)
                {
                    if (v1 instanceof Date && v2 instanceof Date)
                    {
                        return v1.valueOf() === v2.valueOf()
                    }
                    else
                    {
                        return v1 === v2
                    }
                };
                AreaCondition.prototype.evaluate = function(evaluator, baseRow, baseColumn, actualObj)
                {
                    if (actualObj === keyword_undefined || actualObj === keyword_null || actualObj === "")
                    {
                        return this.ignoreBlank === true
                    }
                    var valids = this.getValidList(evaluator, baseRow, baseColumn);
                    if (valids)
                    {
                        for (var i = 0; i < valids.length; i++)
                        {
                            var obj = valids[i];
                            if ((obj === keyword_undefined || obj === keyword_null) && (actualObj === keyword_undefined || actualObj === keyword_null))
                            {
                                return true
                            }
                            else if (obj !== keyword_undefined && obj !== keyword_null)
                            {
                                if (this.formula)
                                {
                                    if (this._equals(obj, actualObj))
                                    {
                                        return true
                                    }
                                }
                                else
                                {
                                    var style = evaluator.getActualStyle(baseRow, baseColumn);
                                    var parsedValue = Sheets.util.parseText2Value(style, obj, true);
                                    if (this._equals(parsedValue, actualObj))
                                    {
                                        return true
                                    }
                                }
                            }
                        }
                    }
                    return false
                };
                AreaCondition.prototype.getExpected = function(evaluator, baseRow, baseCol)
                {
                    var self = this;
                    var arrayValue = [];
                    if (self.formula)
                    {
                        var rowCount,
                            colCount,
                            r,
                            c,
                            value,
                            text;
                        var calcService = evaluator.getCalcService();
                        if (!calcService)
                        {
                            return arrayValue
                        }
                        var expr = calcService.parse(keyword_null, self.formula, baseRow, baseCol);
                        var v = calcService.evaluateParsedFormula(evaluator._getSheetSource(), expr, baseRow, baseCol, true);
                        if (CalcConvert.ref(v))
                        {
                            rowCount = v.getRowCount(0);
                            colCount = v.getColumnCount(0);
                            var row = v.getRow(0),
                                col = v.getColumn(0),
                                sheet = v._source && v._source._sheet && v._source._sheet._sheet;
                            for (r = 0; r < rowCount; r++)
                            {
                                arrayValue[r] = [];
                                for (c = 0; c < colCount; c++)
                                {
                                    value = v.getValue(0, r, c);
                                    text = sheet ? sheet.getText(row + r, col + c) : value;
                                    arrayValue[r][c] = {
                                        value: value, text: text
                                    }
                                }
                            }
                        }
                        else if (CalcConvert.arr(v))
                        {
                            rowCount = v.getRowCount();
                            colCount = v.getColumnCount();
                            for (r = 0; r < rowCount; r++)
                            {
                                arrayValue[r] = [];
                                for (c = 0; c < colCount; c++)
                                {
                                    value = v.getValue(r, c);
                                    arrayValue[r][c] = {
                                        value: value, text: value
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        arrayValue.push({
                            value: self.expected, text: self.expected
                        })
                    }
                    return arrayValue
                };
                AreaCondition.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"ignoreBlank":
                            return value === false;
                        default:
                            return false
                    }
                };
                AreaCondition.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            expected: self.expected, formula: self.formula, conType: 12, ignoreBlank: self.ignoreBlank
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                AreaCondition.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    if (settings.expected !== keyword_null && settings.expected !== keyword_undefined)
                    {
                        this.expected = settings.expected
                    }
                    if (settings.formula !== keyword_null && settings.formula !== keyword_undefined)
                    {
                        this.formula = settings.formula
                    }
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        this.ignoreBlank = settings.ignoreBlank
                    }
                };
                AreaCondition.fromSource = function(expected)
                {
                    return new AreaCondition(expected, keyword_null)
                };
                AreaCondition.fromFormula = function(formula)
                {
                    return new AreaCondition("", formula)
                };
                AreaCondition.prototype.getFormulas = function()
                {
                    return this.formula ? [this.formula] : []
                };
                AreaCondition.prototype.setFormulas = function(formulas)
                {
                    this.formula = formulas[0]
                };
                return AreaCondition
            })();
        Sheets.AreaCondition = AreaCondition;
        var ConditionalFormats = (function()
            {
                function ConditionalFormats(worksheet)
                {
                    this.rules = [];
                    this._ruleTypes = keyword_null;
                    this._cellRuleCache = {};
                    this.worksheet = worksheet
                }
                ConditionalFormats.prototype.getRule = function(index)
                {
                    return this.rules[index]
                };
                ConditionalFormats.prototype.count = function()
                {
                    return this.rules.length
                };
                ConditionalFormats.prototype._cloneRanges = function(ranges)
                {
                    var newRanges = [];
                    var length = ranges.length;
                    for (var i = 0; i < length; i++)
                    {
                        var actualRange = this.worksheet._getActualRange(ranges[i]);
                        newRanges.push(actualRange)
                    }
                    return newRanges
                };
                ConditionalFormats.prototype._resetCache = function()
                {
                    this._cellRuleCache = {};
                    var cellRuleCache = this._cellRuleCache;
                    if (this.rules)
                    {
                        for (var i = 0; i < this.rules.length; i++)
                        {
                            this._addCache(this.rules[i])
                        }
                    }
                };
                ConditionalFormats.prototype.clearCellRuleCache = function()
                {
                    this._cellRuleCache = keyword_undefined
                };
                ConditionalFormats.prototype._addCache = function(rule)
                {
                    var self = this,
                        cellRuleCache = self._cellRuleCache,
                        rowCache,
                        cellCache,
                        row,
                        col,
                        ranges = rule.ranges;
                    var sheet = self.worksheet,
                        sheetRowCount = sheet.getRowCount(),
                        sheetColCount = sheet.getColumnCount();
                    for (var i = 0; i < ranges.length; i++)
                    {
                        var range = ranges[i];
                        var rangeRow = range.row,
                            rangeCol = range.col,
                            rangeRowCount = range.rowCount,
                            rangeColCount = range.colCount;
                        if (rangeRow + rangeRowCount - 1 >= sheetRowCount)
                        {
                            rangeRowCount = sheetRowCount - rangeRow
                        }
                        if (rangeCol + rangeColCount - 1 >= sheetColCount)
                        {
                            rangeColCount = sheetColCount - rangeCol
                        }
                        for (var r = 0; r < rangeRowCount; r++)
                        {
                            row = r + rangeRow;
                            rowCache = cellRuleCache[row];
                            if (!rowCache)
                            {
                                cellRuleCache[row] = rowCache = {}
                            }
                            for (var c = 0; c < rangeColCount; c++)
                            {
                                col = c + rangeCol;
                                cellCache = rowCache[col];
                                if (!cellCache)
                                {
                                    rowCache[col] = cellCache = []
                                }
                                cellCache.push(rule)
                            }
                        }
                    }
                };
                ConditionalFormats.prototype._removeCache = function(rule)
                {
                    var cellRuleCache = this._cellRuleCache,
                        rowCache,
                        cellCache,
                        row,
                        col,
                        ranges = rule.ranges;
                    for (var i = 0; i < ranges.length; i++)
                    {
                        var range = ranges[i];
                        for (var r = 0; r < range.rowCount; r++)
                        {
                            row = r + range.row;
                            rowCache = cellRuleCache[row];
                            if (!rowCache)
                            {
                                continue
                            }
                            for (var c = 0; c < range.colCount; c++)
                            {
                                col = c + range.col;
                                cellCache = rowCache[col];
                                if (!cellCache)
                                {
                                    continue
                                }
                                var newCellCache = [];
                                for (var k = 0; k < cellCache.length; k++)
                                {
                                    if (cellCache[k] !== rule)
                                    {
                                        newCellCache.push(cellCache[k])
                                    }
                                }
                                if (newCellCache.length === 0)
                                {
                                    newCellCache = keyword_undefined
                                }
                                rowCache[col] = newCellCache
                            }
                        }
                    }
                };
                ConditionalFormats.prototype._removeCacheByRange = function(row, col, rowCount, colCount)
                {
                    var r,
                        c,
                        caches = this._cellRuleCache,
                        rowCache,
                        cellCache;
                    for (var i = 0; i < rowCount; i++)
                    {
                        r = i + row;
                        rowCache = caches[r];
                        if (rowCache)
                        {
                            for (var j = 0; j < colCount; j++)
                            {
                                c = j + col;
                                rowCache[c] = keyword_undefined
                            }
                        }
                    }
                };
                ConditionalFormats.prototype.addSpecificTextRule = function(comparisionOperator, text, style, ranges)
                {
                    var rule = new SpecificTextRule(comparisionOperator, text, style);
                    rule.ranges = ranges;
                    return this.addRule(rule)
                };
                ConditionalFormats.prototype.addCellValueRule = function(comparisionOperator, value1, value2, style, ranges)
                {
                    var rule = new CellValueRule(comparisionOperator, value1, value2, style);
                    rule.ranges = ranges;
                    return this.addRule(rule)
                };
                ConditionalFormats.prototype.addDateOccurringRule = function(type, style, ranges)
                {
                    var rule = new DateOccurringRule(type, style);
                    rule.ranges = ranges;
                    return this.addRule(rule)
                };
                ConditionalFormats.prototype.addFormulaRule = function(formula, style, ranges)
                {
                    var rule = new FormulaRule(formula, style);
                    rule.ranges = ranges;
                    return this.addRule(rule)
                };
                ConditionalFormats.prototype.addTop10Rule = function(type, rank, style, ranges)
                {
                    var rule = new Top10Rule(type, rank, style);
                    rule.ranges = ranges;
                    return this.addRule(rule)
                };
                ConditionalFormats.prototype.addUniqueRule = function(style, ranges)
                {
                    var rule = new UniqueRule(style);
                    rule.ranges = ranges;
                    return this.addRule(rule)
                };
                ConditionalFormats.prototype.addDuplicateRule = function(style, ranges)
                {
                    var rule = new DuplicateRule(style);
                    rule.ranges = ranges;
                    return this.addRule(rule)
                };
                ConditionalFormats.prototype.addAverageRule = function(type, style, ranges)
                {
                    var rule = new AverageRule(type, style);
                    rule.ranges = ranges;
                    return this.addRule(rule)
                };
                ConditionalFormats.prototype.add3ScaleRule = function(minType, minValue, minColor, midType, midValue, midColor, maxType, maxValue, maxColor, ranges)
                {
                    var rule = new ThreeScaleRule(minType, minValue, minColor, midType, midValue, midColor, maxType, maxValue, maxColor);
                    rule.ranges = ranges;
                    return this.addRule(rule)
                };
                ConditionalFormats.prototype.add2ScaleRule = function(minType, minValue, minColor, maxType, maxValue, maxColor, ranges)
                {
                    var rule = new TwoScaleRule(minType, minValue, minColor, maxType, maxValue, maxColor);
                    rule.ranges = ranges;
                    return this.addRule(rule)
                };
                ConditionalFormats.prototype.addDataBarRule = function(minType, minValue, maxType, maxValue, color, ranges)
                {
                    var rule = new DataBarRule(minType, minValue, maxType, maxValue, color);
                    rule.ranges = ranges;
                    return this.addRule(rule)
                };
                ConditionalFormats.prototype.addIconSetRule = function(iconSetTye, ranges)
                {
                    var rule = new IconSetRule(iconSetTye);
                    rule.ranges = ranges;
                    return this.addRule(rule)
                };
                ConditionalFormats.prototype.addRule = function(rule)
                {
                    if (this.worksheet)
                    {
                        var self = this;
                        return this.worksheet._bindToAutoRefresh(function(rule)
                            {
                                if (!rule)
                                {
                                    throw new Error(Sheets.SR.Exp_RuleIsNull);
                                }
                                for (var index = 0; index < self.rules.length; index++)
                                {
                                    self.rules[index]._priority++
                                }
                                rule._priority = 1;
                                rule.ranges = self._cloneRanges(rule.ranges);
                                self.rules.push(rule);
                                self._addCache(rule);
                                return rule
                            })(rule)
                    }
                };
                ConditionalFormats.prototype.removeRule = function(rule)
                {
                    if (this.worksheet)
                    {
                        var self = this;
                        this.worksheet._bindToAutoRefresh(function(rule)
                        {
                            if (rule)
                            {
                                self._removeCache(rule);
                                Sheets.ArrayHelper.remove(self.rules, rule)
                            }
                        })(rule)
                    }
                };
                ConditionalFormats.prototype._removeRange = function(srcRange, row, column, rowCount, columnCount)
                {
                    if (!srcRange.intersect(row, column, rowCount, columnCount))
                    {
                        return [srcRange]
                    }
                    var sourceRowTop = srcRange.row;
                    var sourceRowBottom = srcRange.row + srcRange.rowCount - 1;
                    var sourceColumnLeft = srcRange.col;
                    var sourceColumnRight = srcRange.col + srcRange.colCount - 1;
                    var removeRowTop = row;
                    var removeRowBottom = row + rowCount - 1;
                    var removeColumnLeft = column;
                    var removeColumnRight = column + columnCount - 1;
                    var newRanges = [];
                    if (sourceRowTop !== -1 && sourceColumnLeft !== -1)
                    {
                        if (removeRowTop !== -1 && removeColumnLeft !== -1)
                        {
                            if (removeColumnLeft - sourceColumnLeft > 0 && removeRowTop - sourceRowTop > 0)
                            {
                                var topLeft = new Sheets.Range(sourceRowTop, sourceColumnLeft, removeRowTop - sourceRowTop, removeColumnLeft - sourceColumnLeft);
                                newRanges.push(topLeft)
                            }
                            if (Math_min(removeColumnRight, sourceColumnRight) - Math_max(removeColumnLeft, sourceColumnLeft) >= 0 && removeRowTop - sourceRowTop > 0)
                            {
                                var topMid = new Sheets.Range(sourceRowTop, Math_max(removeColumnLeft, sourceColumnLeft), removeRowTop - sourceRowTop, Math_min(removeColumnRight, sourceColumnRight) - Math_max(removeColumnLeft, sourceColumnLeft) + 1);
                                newRanges.push(topMid)
                            }
                            if (sourceColumnRight - removeColumnRight > 0 && removeRowTop - sourceRowTop > 0)
                            {
                                var topRight = new Sheets.Range(sourceRowTop, removeColumnRight + 1, removeRowTop - sourceRowTop, sourceColumnRight - removeColumnRight);
                                newRanges.push(topRight)
                            }
                            if (removeColumnLeft - sourceColumnLeft > 0 && Math_min(removeRowBottom, sourceRowBottom) - Math_max(removeRowTop, sourceRowTop) >= 0)
                            {
                                var midLeft = new Sheets.Range(Math_max(removeRowTop, sourceRowTop), sourceColumnLeft, Math_min(removeRowBottom, sourceRowBottom) - Math_max(removeRowTop, sourceRowTop) + 1, removeColumnLeft - sourceColumnLeft);
                                newRanges.push(midLeft)
                            }
                            if (sourceColumnRight - removeColumnRight > 0 && Math_min(removeRowBottom, sourceRowBottom) - Math_max(removeRowTop, sourceRowTop) >= 0)
                            {
                                var midRight = new Sheets.Range(Math_max(removeRowTop, sourceRowTop), removeColumnRight + 1, Math_min(removeRowBottom, sourceRowBottom) - Math_max(removeRowTop, sourceRowTop) + 1, sourceColumnRight - removeColumnRight);
                                newRanges.push(midRight)
                            }
                            if (removeColumnLeft - sourceColumnLeft > 0 && sourceRowBottom - removeRowBottom > 0)
                            {
                                var bottomLeft = new Sheets.Range(removeRowBottom + 1, sourceColumnLeft, sourceRowBottom - removeRowBottom, removeColumnLeft - sourceColumnLeft);
                                newRanges.push(bottomLeft)
                            }
                            if (Math_min(removeColumnRight, sourceColumnRight) - Math_max(removeColumnLeft, sourceColumnLeft) >= 0 && sourceRowBottom - removeRowBottom > 0)
                            {
                                var bottomMid = new Sheets.Range(removeRowBottom + 1, Math_max(removeColumnLeft, sourceColumnLeft), sourceRowBottom - removeRowBottom, Math_min(removeColumnRight, sourceColumnRight) - Math_max(removeColumnLeft, sourceColumnLeft) + 1);
                                newRanges.push(bottomMid)
                            }
                            if (sourceColumnRight - removeColumnRight > 0 && sourceRowBottom - removeRowBottom > 0)
                            {
                                var bottomRight = new Sheets.Range(removeRowBottom + 1, removeColumnRight + 1, sourceRowBottom - removeRowBottom, sourceColumnRight - removeColumnRight);
                                newRanges.push(bottomRight)
                            }
                        }
                    }
                    if (newRanges.length > 0)
                    {
                        return newRanges
                    }
                    return keyword_null
                };
                ConditionalFormats.prototype.removeRuleByRange = function(row, column, rowCount, columnCount)
                {
                    if (this.worksheet)
                    {
                        var self = this;
                        this.worksheet._bindToAutoRefresh(function(row, column, rowCount, columnCount)
                        {
                            var removeRules = [];
                            if (self.rules)
                            {
                                self._removeCacheByRange(row, column, rowCount, columnCount);
                                for (var i = 0, rulesLength = self.rules.length; i < rulesLength; i++)
                                {
                                    var rule = self.rules[i];
                                    if (rule && rule.ranges && rule.intersects(row, column, rowCount, columnCount))
                                    {
                                        var newRanges = [];
                                        for (var j = 0, rangesLength = rule.ranges.length; j < rangesLength; j++)
                                        {
                                            var range = rule.ranges[j];
                                            var ranges = self._removeRange(range, row, column, rowCount, columnCount);
                                            if (ranges)
                                            {
                                                newRanges = newRanges.concat(ranges)
                                            }
                                        }
                                        if (newRanges.length > 0)
                                        {
                                            rule.ranges = newRanges
                                        }
                                        else
                                        {
                                            removeRules.push(rule)
                                        }
                                    }
                                }
                            }
                            for (var k = 0, length = removeRules.length; k < length; k++)
                            {
                                Sheets.ArrayHelper.remove(self.rules, removeRules[k])
                            }
                        })(row, column, rowCount, columnCount)
                    }
                };
                ConditionalFormats.prototype.clearRule = function()
                {
                    if (this.worksheet)
                    {
                        var self = this;
                        this.worksheet._bindToAutoRefresh(function()
                        {
                            self.rules.length = 0;
                            self._resetCache()
                        })()
                    }
                };
                ConditionalFormats.prototype.getRules = function(row, column)
                {
                    var rules = this.rules;
                    if (arguments.length === 0 || rules.length === 0)
                    {
                        return rules
                    }
                    row = row === undefined ? -1 : row;
                    column = column === undefined ? -1 : column;
                    var caches = this._cellRuleCache,
                        rulesTemp = [],
                        cellCache;
                    if (row !== -1 && column !== -1)
                    {
                        var rowCache = caches[row];
                        if (rowCache)
                        {
                            cellCache = rowCache[column];
                            if (cellCache)
                            {
                                for (var i = 0; i < cellCache.length; i++)
                                {
                                    rulesTemp.push(cellCache[i])
                                }
                            }
                        }
                    }
                    else if (row === -1)
                    {
                        for (var rowCache in caches)
                        {
                            cellCache = caches[rowCache][column];
                            if (cellCache)
                            {
                                for (var i = 0; i < cellCache.length; i++)
                                {
                                    rulesTemp.push(cellCache[i])
                                }
                            }
                        }
                    }
                    else
                    {
                        var rowCache = caches[row];
                        if (rowCache)
                        {
                            for (var cellCacheKey in rowCache)
                            {
                                var cellCache = rowCache[cellCacheKey];
                                for (var i = 0; i < cellCache.length; i++)
                                {
                                    rulesTemp.push(cellCache[i])
                                }
                            }
                        }
                    }
                    return rulesTemp
                };
                ConditionalFormats.prototype.containsRule = function(rule, row, column)
                {
                    if (rule)
                    {
                        if (Sheets.ArrayHelper.contains(this.rules, rule))
                        {
                            return rule.contains(row, column)
                        }
                    }
                    return false
                };
                ConditionalFormats.prototype._clearNullRefRules = function()
                {
                    var self = this;
                    if (self.rules)
                    {
                        for (var n = self.count() - 1; n > -1; n--)
                        {
                            var rule = self.rules[n];
                            if (rule.hasNoReference())
                            {
                                self.removeRule(rule)
                            }
                        }
                    }
                };
                ConditionalFormats.prototype._addRows = function(row, rowCount)
                {
                    var self = this;
                    if (self.rules && self.worksheet)
                    {
                        var length = self.rules.length;
                        for (var i = 0; i < length; i++)
                        {
                            var rule = self.rules[i];
                            if (rule)
                            {
                                rule._addRows(row, rowCount)
                            }
                        }
                    }
                    this._resetCache()
                };
                ConditionalFormats.prototype._addColumns = function(col, colCount)
                {
                    var self = this;
                    if (self.rules && self.worksheet)
                    {
                        var length = self.rules.length;
                        for (var i = 0; i < length; i++)
                        {
                            var rule = self.rules[i];
                            if (rule)
                            {
                                rule._addColumns(col, colCount)
                            }
                        }
                    }
                    this._resetCache()
                };
                ConditionalFormats.prototype._removeRows = function(row, rowCount)
                {
                    var self = this;
                    if (self.rules && self.worksheet)
                    {
                        var length = self.rules.length;
                        for (var i = 0; i < length; i++)
                        {
                            var rule = self.rules[i];
                            if (rule)
                            {
                                rule._removeRows(row, rowCount)
                            }
                        }
                    }
                    this._resetCache()
                };
                ConditionalFormats.prototype._removeColumns = function(col, colCount)
                {
                    var self = this;
                    if (self.rules && self.worksheet)
                    {
                        var length = self.rules.length;
                        for (var i = 0; i < length; i++)
                        {
                            var rule = self.rules[i];
                            if (rule)
                            {
                                rule._removeColumns(col, colCount)
                            }
                        }
                    }
                    this._resetCache()
                };
                ConditionalFormats.prototype._clearCache = function()
                {
                    var rules = this.rules,
                        rule;
                    if (rules != keyword_null && rules.length > 0)
                    {
                        for (var i = 0, count = rules.length; i < count; i++)
                        {
                            rule = rules[i];
                            if (rule instanceof ScaleRule)
                            {
                                rule._clearCache()
                            }
                        }
                    }
                };
                ConditionalFormats.prototype.toJSON = function()
                {
                    var rules = [];
                    for (var i = 0; i < this.rules.length; i++)
                    {
                        var rule = this.rules[i];
                        rules.push(rule ? rule.toJSON() : keyword_null)
                    }
                    if (rules.length === 0)
                    {
                        return keyword_undefined
                    }
                    return {rules: rules}
                };
                ConditionalFormats.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    if (settings.rules)
                    {
                        this.rules = [];
                        for (var i = 0; i < settings.rules.length; i++)
                        {
                            var ruleSettings = settings.rules[i];
                            var rule = keyword_null;
                            if (ruleSettings)
                            {
                                var dict = this._getRuleTypes();
                                var ruleClass = dict[ruleSettings.ruleType];
                                if (ruleClass)
                                {
                                    rule = new ruleClass;
                                    rule.fromJSON(ruleSettings, isNoneSchema)
                                }
                            }
                            if (rule)
                            {
                                this.rules.push(rule)
                            }
                        }
                        this._resetCache()
                    }
                };
                ConditionalFormats.prototype._getRuleTypes = function()
                {
                    if (!this._ruleTypes)
                    {
                        var dict = {};
                        dict[0] = ConditionRuleBase;
                        dict[1] = CellValueRule;
                        dict[2] = SpecificTextRule;
                        dict[3] = FormulaRule;
                        dict[4] = DateOccurringRule;
                        dict[5] = Top10Rule;
                        dict[6] = UniqueRule;
                        dict[7] = DuplicateRule;
                        dict[8] = AverageRule;
                        dict[9] = ScaleRule;
                        dict[10] = TwoScaleRule;
                        dict[11] = ThreeScaleRule;
                        dict[12] = DataBarRule;
                        dict[13] = IconSetRule;
                        this._ruleTypes = dict
                    }
                    return this._ruleTypes
                };
                return ConditionalFormats
            })();
        Sheets.ConditionalFormats = ConditionalFormats
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

