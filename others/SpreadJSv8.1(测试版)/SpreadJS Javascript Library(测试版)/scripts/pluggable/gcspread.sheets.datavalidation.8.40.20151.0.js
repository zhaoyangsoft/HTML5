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
        Sheets.feature("dataValidator", ["core.common"]);
        var keyword_null = null,
            keyword_undefined = undefined;
        var StringHelper_TrimStart = Sheets.StringHelper.TrimStart;
        function convertToDouble(val)
        {
            if (val === keyword_undefined || val === keyword_null)
            {
                return 0.0
            }
            else if (typeof(val) === "number")
            {
                return val
            }
            else if (typeof(val) === "string")
            {
                var ret = parseFloat(val);
                if (!isNaN(ret))
                {
                    if (ret.toString() === val.toString())
                    {
                        return ret
                    }
                }
            }
            return keyword_null
        }
        function convertToDateTime(val)
        {
            if (val instanceof Date)
            {
                return val
            }
            else if (typeof(val) === "string")
            {
                return new Date(val)
            }
            return keyword_null
        }
        var DefaultDataValidator = (function()
            {
                function DefaultDataValidator(condition)
                {
                    var self = this;
                    self.id = DefaultDataValidator._validatorId++;
                    self._init();
                    if (condition)
                    {
                        self.condition = condition;
                        self.condition.ignoreBlank = self.ignoreBlank
                    }
                }
                DefaultDataValidator.prototype.IgnoreBlank = function(value)
                {
                    var self = this;
                    if (arguments.length <= 0)
                    {
                        return self.ignoreBlank
                    }
                    else
                    {
                        self.ignoreBlank = value;
                        if (self.condition)
                        {
                            self.condition.ignoreBlank = value
                        }
                        return self
                    }
                };
                DefaultDataValidator.prototype._init = function()
                {
                    var self = this;
                    self.errorStyle = 0;
                    self.ignoreBlank = true;
                    self.inCellDropdown = true;
                    self.showInputMessage = true;
                    self.showErrorMessage = true;
                    self.inputTitle = "";
                    self.errorTitle = "";
                    self.inputMessage = "";
                    self.errorMessage = "";
                    self.comparisonOperator = 6;
                    self.condition = keyword_null;
                    self.type = 7
                };
                DefaultDataValidator.prototype.value1 = function()
                {
                    var self = this;
                    var cond = (self.condition && self.condition.item1) ? self.condition.item1 : self.condition;
                    if (cond)
                    {
                        if (cond.formula && cond.formula.length > 0)
                        {
                            return "=" + StringHelper_TrimStart($.trim(cond.formula.toString().toUpperCase()), "=")
                        }
                        else
                        {
                            return cond.expected
                        }
                    }
                    return keyword_null
                };
                DefaultDataValidator.prototype.value2 = function()
                {
                    var self = this;
                    var cond = (self.condition && self.condition.item2) ? self.condition.item2 : self.condition;
                    if (cond)
                    {
                        if (cond.formula && cond.formula.length > 0)
                        {
                            return "=" + StringHelper_TrimStart($.trim(cond.formula.toString().toUpperCase()), "=")
                        }
                        else
                        {
                            return cond.expected
                        }
                    }
                    return keyword_null
                };
                DefaultDataValidator.prototype.isValid = function(evaluator, baseRow, baseColumn, actual)
                {
                    var self = this;
                    if (self.condition)
                    {
                        self.IgnoreBlank(self.ignoreBlank);
                        if (self.condition.ignoreBlank && (actual === keyword_undefined || actual === keyword_null || actual === ""))
                        {
                            return true
                        }
                        var val = actual,
                            v;
                        if (actual !== keyword_undefined && actual !== keyword_null)
                        {
                            switch (self.type)
                            {
                                case 0:
                                    return true;
                                case 2:
                                case 1:
                                    v = convertToDouble(actual);
                                    if (v !== keyword_undefined && v !== keyword_null)
                                    {
                                        val = v
                                    }
                                    break;
                                case 4:
                                case 5:
                                    v = convertToDateTime(actual);
                                    if (v !== keyword_undefined && v !== keyword_null)
                                    {
                                        val = v
                                    }
                                    break;
                                case 7:
                                case 3:
                                case 6:
                                    break
                            }
                        }
                        return self.condition.evaluate(evaluator, baseRow, baseColumn, val, val)
                    }
                    return true
                };
                DefaultDataValidator.prototype.reset = function()
                {
                    this._init()
                };
                DefaultDataValidator.prototype.getValidList = function(evaluator, baseRow, baseColumn)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return keyword_null
                    }
                    var self = this;
                    if (self.condition != keyword_null && self.type === 3 && self.condition instanceof Sheets.AreaCondition)
                    {
                        return self.condition.getValidList(evaluator, baseRow, baseColumn)
                    }
                    return keyword_null
                };
                DefaultDataValidator.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"errorStyle":
                            return value === 0;
                        case"ignoreBlank":
                            return value === true;
                        case"inCellDropdown":
                            return value === true;
                        case"showInputMessage":
                            return value === true;
                        case"showErrorMessage":
                            return value === true;
                        case"inputTitle":
                            return value === "";
                        case"errorTitle":
                            return value === "";
                        case"inputMessage":
                            return value === "";
                        case"errorMessage":
                            return value === "";
                        case"comparisonOperator":
                            return value === 6;
                        case"type":
                            return value === 7;
                        case"condition":
                            return value === keyword_null;
                        default:
                            return false
                    }
                };
                DefaultDataValidator.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            errorStyle: self.errorStyle, ignoreBlank: self.ignoreBlank, inCellDropdown: self.inCellDropdown, showInputMessage: self.showInputMessage, showErrorMessage: self.showErrorMessage, inputTitle: self.inputTitle, errorTitle: self.errorTitle, inputMessage: self.inputMessage, errorMessage: self.errorMessage, comparisonOperator: self.comparisonOperator, type: self.type, condition: self.condition ? self.condition.toJSON() : self.condition
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
                DefaultDataValidator.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (Sheets.features.conditionalFormat && settings.condition !== keyword_null && settings.condition !== keyword_undefined)
                    {
                        var condition = keyword_null;
                        var dict = self._getConditionTypes();
                        var conditionClass = dict[settings.condition.conType];
                        if (conditionClass)
                        {
                            condition = new conditionClass;
                            condition.fromJSON(settings.condition, isNoneSchema)
                        }
                        self.condition = condition
                    }
                    if (settings.type !== keyword_null && settings.type !== keyword_undefined)
                    {
                        self.type = settings.type
                    }
                    if (settings.comparisonOperator !== keyword_null && settings.comparisonOperator !== keyword_undefined)
                    {
                        self.comparisonOperator = settings.comparisonOperator
                    }
                    if (settings.errorStyle !== keyword_null && settings.errorStyle !== keyword_undefined)
                    {
                        self.errorStyle = settings.errorStyle
                    }
                    if (settings.ignoreBlank !== keyword_null && settings.ignoreBlank !== keyword_undefined)
                    {
                        self.ignoreBlank = settings.ignoreBlank
                    }
                    if (settings.inCellDropdown !== keyword_null && settings.inCellDropdown !== keyword_undefined)
                    {
                        self.inCellDropdown = settings.inCellDropdown
                    }
                    if (settings.showInputMessage !== keyword_null && settings.showInputMessage !== keyword_undefined)
                    {
                        self.showInputMessage = settings.showInputMessage
                    }
                    if (settings.showErrorMessage !== keyword_null && settings.showErrorMessage !== keyword_undefined)
                    {
                        self.showErrorMessage = settings.showErrorMessage
                    }
                    if (settings.inputTitle !== keyword_null && settings.inputTitle !== keyword_undefined)
                    {
                        self.inputTitle = settings.inputTitle
                    }
                    if (settings.errorTitle !== keyword_null && settings.errorTitle !== keyword_undefined)
                    {
                        self.errorTitle = settings.errorTitle
                    }
                    if (settings.inputMessage !== keyword_null && settings.inputMessage !== keyword_undefined)
                    {
                        self.inputMessage = settings.inputMessage
                    }
                    if (settings.errorMessage !== keyword_null && settings.errorMessage !== keyword_undefined)
                    {
                        self.errorMessage = settings.errorMessage
                    }
                };
                DefaultDataValidator.prototype.clone = function()
                {
                    var validator = new GcSpread.Sheets["DefaultDataValidator"];
                    validator.fromJSON(this.toJSON());
                    return validator
                };
                DefaultDataValidator.prototype._getConditionTypes = function()
                {
                    if (!this._dict)
                    {
                        var dict = {};
                        dict[0] = Sheets.RelationCondition;
                        dict[1] = Sheets.NumberCondition;
                        dict[2] = Sheets.TextCondition;
                        dict[3] = Sheets.ColorCondition;
                        dict[4] = Sheets.FormulaCondition;
                        dict[5] = Sheets.DateCondition;
                        dict[6] = Sheets.DateExCondition;
                        dict[7] = Sheets.TextLengthCondition;
                        dict[8] = Sheets.Top10Condition;
                        dict[9] = Sheets.UniqueCondition;
                        dict[10] = Sheets.AverageCondition;
                        dict[11] = Sheets.CellValueCondition;
                        dict[12] = Sheets.AreaCondition;
                        this._dict = dict
                    }
                    return this._dict
                };
                DefaultDataValidator.getImageSrc = function()
                {
                    return "data:image/png;base64,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"
                };
                DefaultDataValidator.isFormula = function(val)
                {
                    return (val) && (val[0] === "=")
                };
                DefaultDataValidator.createNumberValidator = function(typeOperator, v1, v2, isIntegerValue)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return keyword_null
                    }
                    var formula1 = DefaultDataValidator.isFormula(v1) ? StringHelper_TrimStart(v1, "=") : keyword_null;
                    var expect1 = DefaultDataValidator.isFormula(v1) ? keyword_null : v1;
                    var formula2 = DefaultDataValidator.isFormula(v2) ? StringHelper_TrimStart(v2, "=") : keyword_null;
                    var expect2 = DefaultDataValidator.isFormula(v2) ? keyword_null : v2;
                    var conditionTemp = keyword_null,
                        c1,
                        c2;
                    var comparisonOperator = Sheets.ComparisonOperator,
                        generalCompareType = Sheets.GeneralCompareType,
                        relationCompareType = Sheets.RelationCompareType;
                    switch (typeOperator)
                    {
                        case 6:
                            c1 = new Sheets.NumberCondition(3, expect1, formula1);
                            c1.integerValue = isIntegerValue;
                            c2 = new Sheets.NumberCondition(5, expect2, formula2);
                            c2.integerValue = isIntegerValue;
                            conditionTemp = new Sheets.RelationCondition(1, c1, c2);
                            break;
                        case 7:
                            c1 = new Sheets.NumberCondition(4, expect1, formula1);
                            c1.integerValue = isIntegerValue;
                            c2 = new Sheets.NumberCondition(2, expect2, formula2);
                            c2.integerValue = isIntegerValue;
                            conditionTemp = new Sheets.RelationCondition(0, c1, c2);
                            break;
                        case 0:
                            conditionTemp = new Sheets.NumberCondition(0, expect1, formula1);
                            conditionTemp.integerValue = isIntegerValue;
                            break;
                        case 1:
                            conditionTemp = new Sheets.NumberCondition(1, expect1, formula1);
                            conditionTemp.integerValue = isIntegerValue;
                            break;
                        case 2:
                            conditionTemp = new Sheets.NumberCondition(2, expect1, formula1);
                            conditionTemp.integerValue = isIntegerValue;
                            break;
                        case 3:
                            conditionTemp = new Sheets.NumberCondition(3, expect1, formula1);
                            conditionTemp.integerValue = isIntegerValue;
                            break;
                        case 4:
                            conditionTemp = new Sheets.NumberCondition(4, expect1, formula1);
                            conditionTemp.integerValue = isIntegerValue;
                            break;
                        case 5:
                            conditionTemp = new Sheets.NumberCondition(5, expect1, formula1);
                            conditionTemp.integerValue = isIntegerValue;
                            break
                    }
                    var t = new DefaultDataValidator(conditionTemp);
                    t.type = isIntegerValue ? 1 : 2;
                    t.comparisonOperator = typeOperator;
                    return t
                };
                DefaultDataValidator.createDateValidator = function(typeOperator, v1, v2)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return keyword_null
                    }
                    var formula1 = DefaultDataValidator.isFormula(v1) ? StringHelper_TrimStart(v1, "=") : keyword_null;
                    var expect1 = DefaultDataValidator.isFormula(v1) ? keyword_null : v1;
                    var formula2 = DefaultDataValidator.isFormula(v2) ? StringHelper_TrimStart(v2, "=") : keyword_null;
                    var expect2 = DefaultDataValidator.isFormula(v2) ? keyword_null : v2;
                    var conditionTemp = keyword_null,
                        c1,
                        c2;
                    var comparisonOperator = Sheets.ComparisonOperator,
                        dateCompareType = Sheets.DateCompareType,
                        relationCompareType = Sheets.RelationCompareType;
                    switch (typeOperator)
                    {
                        case 6:
                            c1 = new Sheets.DateCondition(5, expect1, formula1);
                            c2 = new Sheets.DateCondition(3, expect2, formula2);
                            conditionTemp = new Sheets.RelationCondition(1, c1, c2);
                            break;
                        case 7:
                            c1 = new Sheets.DateCondition(2, expect1, formula1);
                            c2 = new Sheets.DateCondition(4, expect2, formula2);
                            conditionTemp = new Sheets.RelationCondition(0, c1, c2);
                            break;
                        case 0:
                            conditionTemp = new Sheets.DateCondition(0, expect1, formula1);
                            break;
                        case 1:
                            conditionTemp = new Sheets.DateCondition(1, expect1, formula1);
                            break;
                        case 2:
                            conditionTemp = new Sheets.DateCondition(4, expect1, formula1);
                            break;
                        case 3:
                            conditionTemp = new Sheets.DateCondition(5, expect1, formula1);
                            break;
                        case 4:
                            conditionTemp = new Sheets.DateCondition(2, expect1, formula1);
                            break;
                        case 5:
                            conditionTemp = new Sheets.DateCondition(3, expect1, formula1);
                            break
                    }
                    var t = new DefaultDataValidator(conditionTemp);
                    t.type = 4;
                    t.comparisonOperator = typeOperator;
                    return t
                };
                DefaultDataValidator.createTextLengthValidator = function(typeOperator, v1, v2)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return keyword_null
                    }
                    var formula1 = DefaultDataValidator.isFormula(v1) ? StringHelper_TrimStart(v1, "=") : keyword_null;
                    var expect1 = DefaultDataValidator.isFormula(v1) ? keyword_null : v1;
                    var formula2 = DefaultDataValidator.isFormula(v2) ? StringHelper_TrimStart(v2, "=") : keyword_null;
                    var expect2 = DefaultDataValidator.isFormula(v2) ? keyword_null : v2;
                    var conditionTemp = keyword_null,
                        c1,
                        c2;
                    var comparisonOperator = Sheets.ComparisonOperator,
                        generalCompareType = Sheets.GeneralCompareType,
                        relationCompareType = Sheets.RelationCompareType;
                    switch (typeOperator)
                    {
                        case 6:
                            c1 = new Sheets.TextLengthCondition(3, expect1, formula1);
                            c2 = new Sheets.TextLengthCondition(5, expect2, formula2);
                            conditionTemp = new Sheets.RelationCondition(1, c1, c2);
                            break;
                        case 7:
                            c1 = new Sheets.TextLengthCondition(4, expect1, formula1);
                            c2 = new Sheets.TextLengthCondition(2, expect2, formula2);
                            conditionTemp = new Sheets.RelationCondition(0, c1, c2);
                            break;
                        case 0:
                            conditionTemp = new Sheets.TextLengthCondition(0, expect1, formula1);
                            break;
                        case 1:
                            conditionTemp = new Sheets.TextLengthCondition(1, expect1, formula1);
                            break;
                        case 2:
                            conditionTemp = new Sheets.TextLengthCondition(2, expect1, formula1);
                            break;
                        case 3:
                            conditionTemp = new Sheets.TextLengthCondition(3, expect1, formula1);
                            break;
                        case 4:
                            conditionTemp = new Sheets.TextLengthCondition(4, expect1, formula1);
                            break;
                        case 5:
                            conditionTemp = new Sheets.TextLengthCondition(5, expect1, formula1);
                            break
                    }
                    var t = new DefaultDataValidator(conditionTemp);
                    t.type = 6;
                    t.comparisonOperator = typeOperator;
                    return t
                };
                DefaultDataValidator.createFormulaValidator = function(formula)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return keyword_null
                    }
                    var t = new DefaultDataValidator(new Sheets.FormulaCondition(4, StringHelper_TrimStart(formula, "=")));
                    t.type = 7;
                    return t
                };
                DefaultDataValidator.createFormulaListValidator = function(formula)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return keyword_null
                    }
                    var t = new DefaultDataValidator(Sheets.AreaCondition.fromFormula(formula));
                    t.type = 3;
                    return t
                };
                DefaultDataValidator.createListValidator = function(source)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return keyword_null
                    }
                    var t = new DefaultDataValidator(Sheets.AreaCondition.fromSource(source));
                    t.type = 3;
                    return t
                };
                DefaultDataValidator._validatorId = 1;
                return DefaultDataValidator
            })();
        Sheets.DefaultDataValidator = DefaultDataValidator
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

