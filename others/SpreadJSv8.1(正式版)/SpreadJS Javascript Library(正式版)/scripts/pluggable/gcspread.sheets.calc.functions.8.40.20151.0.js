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
        (function(Calc)
        {
            (function(Functions)
            {
                Sheets.feature("calc.functions_db", ["calc.functions"]);
                var keyword_null = null,
                    Math_max = Math.max,
                    Math_sqrt = Math.sqrt,
                    CalcConvert = Calc.Convert;
                var CalcErrors = Calc.Errors,
                    CalcErrorsNull = CalcErrors.Null,
                    CalcErrorsDivideByZero = CalcErrors.DivideByZero,
                    CalcErrorsValue = CalcErrors.Value,
                    CalcErrorsReference = CalcErrors.Reference,
                    CalcErrorsName = CalcErrors.Name,
                    CalcErrorsNotAvailable = CalcErrors.NotAvailable,
                    CalcErrorsNumber = CalcErrors.Number;
                var _CriteriaEvaluator = (function()
                    {
                        function _CriteriaEvaluator(criteriaOperator, criteriaValue)
                        {
                            this.criteriaOperator = criteriaOperator;
                            this.criteriaValue = criteriaValue
                        }
                        _CriteriaEvaluator.prototype.evaluate = function(databaseValue)
                        {
                            var result = this.criteriaOperator.evaluate(databaseValue, this.criteriaValue, keyword_null);
                            return (typeof result === "boolean") ? CalcConvert.B(result) : false
                        };
                        return _CriteriaEvaluator
                    })();
                var _DatabaseEnumerator = (function()
                    {
                        function _DatabaseEnumerator(database, field, criteria)
                        {
                            this.row = 0;
                            var self = this;
                            self.database = database;
                            self.field = field;
                            self.criteria = criteria;
                            if (arguments.length === 3)
                            {
                                self.column = self.columnIndex(database, field);
                                if (database.rowCount < 2 || database.colCount < 1)
                                {
                                    throw Sheets.SR.Exp_InvalidCast;
                                }
                                if (criteria.rowCount < 2 || criteria.colCount < 1)
                                {
                                    throw Sheets.SR.Exp_InvalidCast;
                                }
                                if (self.column < 0 || self.database.colCount <= self.column)
                                {
                                    throw Sheets.SR.Exp_InvalidCast;
                                }
                            }
                            else if (arguments.length === 2)
                            {
                                self.column = -1;
                                if (database.rowCount < 2 || database.colCount < 1)
                                {
                                    throw Sheets.SR.Exp_InvalidCast;
                                }
                                if (criteria.rowCount < 2 || criteria.colCount < 1)
                                {
                                    throw Sheets.SR.Exp_InvalidCast;
                                }
                            }
                            else
                            {
                                throw Sheets.SR.Exp_InvalidNull;
                            }
                        }
                        _DatabaseEnumerator.prototype.columnIndex = function(database, field)
                        {
                            if (typeof field === "string")
                            {
                                for (var i = 0; i < database.colCount; i++)
                                {
                                    var columnLabel = CalcConvert.S(database[0][i]);
                                    if (columnLabel && this.ignoreCaseEqual(columnLabel, field))
                                    {
                                        return i
                                    }
                                }
                                return -1
                            }
                            else
                            {
                                return CalcConvert.I(field) - 1
                            }
                        };
                        _DatabaseEnumerator.prototype.current = function()
                        {
                            var self = this;
                            if (self.row <= 0 || self.database.rowCount <= self.row)
                            {
                                throw Sheets.SR.Exp_InvalidOperation;
                            }
                            return self.database[self.row][self.column]
                        };
                        _DatabaseEnumerator.prototype.moveNext = function()
                        {
                            var self = this;
                            var found = false;
                            while (!found && self.row < self.database.rowCount)
                            {
                                self.row++;
                                if (self.row < self.database.rowCount)
                                {
                                    found = self.rowMeetsCriteria()
                                }
                            }
                            return found
                        };
                        _DatabaseEnumerator.prototype.createEvaluator = function(criteria)
                        {
                            if (typeof criteria === "string")
                            {
                                var criteriaText = CalcConvert.S(criteria);
                                var textHelper = new Sheets._StringHelper(criteriaText);
                                var criteriaDouble = 0.0;
                                for (var i = 0; i < _DatabaseEnumerator.operators.length; i++)
                                {
                                    if (textHelper.startsWith(_DatabaseEnumerator.operators[i].getName()))
                                    {
                                        criteriaText = criteriaText.substring(_DatabaseEnumerator.operators[i].getName().length);
                                        if (!isNaN(criteriaDouble = Sheets._NumberHelper.parseInvariant(criteriaText)))
                                        {
                                            criteria = criteriaDouble
                                        }
                                        else if (this.ignoreCaseEqual("true", criteriaText))
                                        {
                                            criteria = true
                                        }
                                        else if (this.ignoreCaseEqual("false", criteriaText))
                                        {
                                            criteria = false
                                        }
                                        else
                                        {
                                            criteria = criteriaText
                                        }
                                        return new _CriteriaEvaluator(_DatabaseEnumerator.operators[i], criteria)
                                    }
                                }
                                return new _CriteriaEvaluator(Calc.Operators.equal, criteria)
                            }
                            else if (criteria)
                            {
                                return new _CriteriaEvaluator(Calc.Operators.equal, criteria)
                            }
                            return keyword_null
                        };
                        _DatabaseEnumerator.prototype.rowMeetsCriteria = function()
                        {
                            var self = this;
                            var pass = false;
                            for (var i = 1; !pass && i < self.criteria.rowCount; i++)
                            {
                                pass = true;
                                for (var j = 0; pass && j < self.criteria.colCount; j++)
                                {
                                    var criteriaEva = self.createEvaluator(self.criteria[i][j]);
                                    if (criteriaEva)
                                    {
                                        var k = self.columnIndex(self.database, self.criteria[0][j]);
                                        var databaseValue = self.database[self.row][k];
                                        var wildcardCriteria;
                                        if ((criteriaEva.criteriaOperator.name === "=") && (typeof criteriaEva.criteriaValue === "string") && (typeof databaseValue === "string") && (wildcardCriteria = Sheets.RegUtil.getWildcardCriteriaFullMatch(criteriaEva.criteriaValue)))
                                        {
                                            pass = Sheets.RegUtil.getRegIgnoreCase(wildcardCriteria).test(databaseValue)
                                        }
                                        else
                                        {
                                            pass = criteriaEva.evaluate(databaseValue)
                                        }
                                    }
                                }
                            }
                            return pass
                        };
                        _DatabaseEnumerator.prototype.reset = function()
                        {
                            this.row = 0
                        };
                        _DatabaseEnumerator.prototype.ignoreCaseEqual = function(_stringOne, _stringTwo)
                        {
                            _stringOne = _stringOne.toLowerCase();
                            _stringTwo = _stringTwo.toLowerCase();
                            return (_stringOne === _stringTwo)
                        };
                        _DatabaseEnumerator.operators = [Calc.Operators.equal, Calc.Operators.notEqual, Calc.Operators.lessThanOrEqual, Calc.Operators.greaterThanOrEqual, Calc.Operators.lessThan, Calc.Operators.greaterThan];
                        return _DatabaseEnumerator
                    })();
                function db_daverage(args)
                {
                    if (!args[0] || !args[1] || !args[2])
                    {
                        throw Sheets.SR.Exp_ArgumentNull;
                    }
                    var errorObject = Calc.Convert.CalcConvertedError;
                    var database = CalcConvert.toArr(args[0], 0, false, false, false);
                    if (database.isError)
                    {
                        return database[0]
                    }
                    var field = args[1];
                    var criteria = CalcConvert.toArr(args[2], 0, false, false, false);
                    if (criteria.isError)
                    {
                        return criteria[0]
                    }
                    var sum = 0.0;
                    var n = 0.0;
                    var enumerator = new _DatabaseEnumerator(database, field, criteria);
                    while (enumerator.moveNext())
                    {
                        var obj = enumerator.current();
                        if (CalcConvert.num(obj))
                        {
                            var d = {value: 0};
                            if (!CalcConvert.rD(obj, d))
                            {
                                return CalcErrorsValue
                            }
                            sum += d.value;
                            n++
                        }
                        else if (CalcConvert.err(obj))
                        {
                            return obj
                        }
                    }
                    if (0.0 === n)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(sum / n)
                }
                function db_dcount(args)
                {
                    if (!args[0] || !args[1] || !args[2])
                    {
                        throw Sheets.SR.Exp_ArgumentNull;
                    }
                    var database = CalcConvert.toArr(args[0], 0, false, false, false);
                    if (database.isError)
                    {
                        return database[0]
                    }
                    var field = args[1];
                    var criteria = CalcConvert.toArr(args[2], 0, false, false, false);
                    if (criteria.isError)
                    {
                        return criteria[0]
                    }
                    var n = 0.0;
                    var enumerator = keyword_null;
                    if (Calc._Helper._argumentExists(args, 1))
                    {
                        enumerator = new _DatabaseEnumerator(database, field, criteria);
                        while (enumerator.moveNext())
                        {
                            var obj = enumerator.current();
                            if (CalcConvert.num(obj))
                            {
                                n++
                            }
                        }
                    }
                    else
                    {
                        enumerator = new _DatabaseEnumerator(database, criteria);
                        while (enumerator.moveNext())
                        {
                            n++
                        }
                    }
                    return CalcConvert.toResult(n)
                }
                function db_dcounta(args)
                {
                    if (!args[0] || !args[1] || !args[2])
                    {
                        throw Sheets.SR.Exp_ArgumentNull;
                    }
                    var database = CalcConvert.toArr(args[0], 0, false, false, false);
                    if (database.isError)
                    {
                        return database[0]
                    }
                    var field = args[1];
                    var criteria = CalcConvert.toArr(args[2], 0, false, false, false);
                    if (criteria.isError)
                    {
                        return criteria[0]
                    }
                    var n = 0.0;
                    var enumerator = keyword_null;
                    if (Calc._Helper._argumentExists(args, 1))
                    {
                        enumerator = new _DatabaseEnumerator(database, field, criteria);
                        while (enumerator.moveNext())
                        {
                            var obj = enumerator.current();
                            if (obj)
                            {
                                n++
                            }
                        }
                    }
                    else
                    {
                        enumerator = new _DatabaseEnumerator(database, criteria);
                        while (enumerator.moveNext())
                        {
                            n++
                        }
                    }
                    return CalcConvert.toResult(n)
                }
                function db_dget(args)
                {
                    if (!args[0] || !args[1] || !args[2])
                    {
                        throw Sheets.SR.Exp_ArgumentNull;
                    }
                    var database = CalcConvert.toArr(args[0], 0, false, false, false);
                    if (database.isError)
                    {
                        return database[0]
                    }
                    var field = args[1];
                    var criteria = CalcConvert.toArr(args[2], 0, false, false, false);
                    if (criteria.isError)
                    {
                        return criteria[0]
                    }
                    var val = keyword_null;
                    var enumerator = new _DatabaseEnumerator(database, field, criteria);
                    if (enumerator.moveNext())
                    {
                        val = enumerator.current();
                        if (enumerator.moveNext())
                        {
                            return CalcErrorsNumber
                        }
                    }
                    else
                    {
                        return CalcErrorsValue
                    }
                    return val
                }
                function db_dmax(args)
                {
                    if (!args[0] || !args[1] || !args[2])
                    {
                        throw Sheets.SR.Exp_ArgumentNull;
                    }
                    var errorObject = Calc.Convert.CalcConvertedError;
                    var database = CalcConvert.toArr(args[0], 0, false, false, false);
                    if (database.isError)
                    {
                        return database[0]
                    }
                    var field = args[1];
                    var criteria = CalcConvert.toArr(args[2], 0, false, false, false);
                    if (criteria.isError)
                    {
                        return criteria[0]
                    }
                    var isAny = false;
                    var max = -1.79769e+308;
                    var enumerator = new _DatabaseEnumerator(database, field, criteria);
                    while (enumerator.moveNext())
                    {
                        var obj = enumerator.current();
                        if (CalcConvert.num(obj))
                        {
                            var x;
                            if (isNaN(x = CalcConvert.D(obj)))
                            {
                                return CalcErrorsValue
                            }
                            if (!isAny || x > max)
                            {
                                max = x
                            }
                            isAny = true
                        }
                        else if (CalcConvert.err(obj))
                        {
                            return obj
                        }
                    }
                    if (!isAny)
                    {
                        return CalcErrorsValue
                    }
                    return CalcConvert.toResult(max)
                }
                function db_dmin(args)
                {
                    if (!args[0] || !args[1] || !args[2])
                    {
                        throw Sheets.SR.Exp_ArgumentNull;
                    }
                    var errorObject = Calc.Convert.CalcConvertedError;
                    var database = CalcConvert.toArr(args[0], 0, false, true, true);
                    if (database.isError)
                    {
                        return database[0]
                    }
                    var field = args[1];
                    var criteria = CalcConvert.toArr(args[2], 0, false, true, true);
                    if (criteria.isError)
                    {
                        return criteria[0]
                    }
                    var any = false;
                    var min = 1.79769e+308;
                    var enumerator = new _DatabaseEnumerator(database, field, criteria);
                    while (enumerator.moveNext())
                    {
                        var obj = enumerator.current();
                        if (obj !== errorObject)
                        {
                            if (!any || obj < min)
                            {
                                min = obj
                            }
                            any = true
                        }
                    }
                    if (!any)
                    {
                        return CalcErrorsValue
                    }
                    return CalcConvert.toResult(min)
                }
                function db_dproduct(args)
                {
                    if (!args[0] || !args[1] || !args[2])
                    {
                        throw Sheets.SR.Exp_ArgumentNull;
                    }
                    var errorObject = Calc.Convert.CalcConvertedError;
                    var database = CalcConvert.toArr(args[0], 0, false, false, false);
                    if (database.isError)
                    {
                        return database[0]
                    }
                    var field = args[1];
                    var criteria = CalcConvert.toArr(args[2], 0, false, false, false);
                    if (criteria.isError)
                    {
                        return criteria[0]
                    }
                    var product = 1.0;
                    var enumerator = new _DatabaseEnumerator(database, field, criteria);
                    while (enumerator.moveNext())
                    {
                        var obj = enumerator.current();
                        if (CalcConvert.num(obj))
                        {
                            var x;
                            if (isNaN(x = CalcConvert.D(obj)))
                            {
                                return CalcErrorsValue
                            }
                            product *= x
                        }
                        else if (CalcConvert.err(obj))
                        {
                            return obj
                        }
                    }
                    return CalcConvert.toResult(product)
                }
                function db_dstdev(args)
                {
                    if (!args[0] || !args[1] || !args[2])
                    {
                        throw Sheets.SR.Exp_ArgumentNull;
                    }
                    var errorObject = Calc.Convert.CalcConvertedError;
                    var database = CalcConvert.toArr(args[0], 0, false, false, false);
                    if (database.isError)
                    {
                        return database[0]
                    }
                    var field = args[1];
                    var criteria = CalcConvert.toArr(args[2], 0, false, false, false);
                    if (criteria.isError)
                    {
                        return criteria[0]
                    }
                    var sumx = 0.0;
                    var sumx2 = 0.0;
                    var n = 0.0;
                    var enumerator = new _DatabaseEnumerator(database, field, criteria);
                    while (enumerator.moveNext())
                    {
                        var obj = enumerator.current();
                        if (CalcConvert.num(obj))
                        {
                            var x;
                            if (isNaN(x = CalcConvert.D(obj)))
                            {
                                return CalcErrorsValue
                            }
                            sumx += x;
                            sumx2 += x * x;
                            n++
                        }
                        else if (CalcConvert.err(obj))
                        {
                            return obj
                        }
                    }
                    if (n <= 1.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(Math_sqrt(Math_max(0.0, (n * sumx2 - sumx * sumx) / (n * (n - 1.0)))))
                }
                function db_dstdevp(args)
                {
                    if (!args[0] || !args[1] || !args[2])
                    {
                        throw Sheets.SR.Exp_ArgumentNull;
                    }
                    var errorObject = Calc.Convert.CalcConvertedError;
                    var database = CalcConvert.toArr(args[0], 0, false, false, false);
                    if (database.isError)
                    {
                        return database[0]
                    }
                    var field = args[1];
                    var criteria = CalcConvert.toArr(args[2], 0, false, false, false);
                    if (criteria.isError)
                    {
                        return criteria[0]
                    }
                    var sumx = 0.0;
                    var sumx2 = 0.0;
                    var n = 0.0;
                    var enumerator = new _DatabaseEnumerator(database, field, criteria);
                    while (enumerator.moveNext())
                    {
                        var obj = enumerator.current();
                        if (CalcConvert.num(obj))
                        {
                            var x;
                            if (isNaN(x = CalcConvert.D(obj)))
                            {
                                return CalcErrorsValue
                            }
                            sumx += x;
                            sumx2 += x * x;
                            n++
                        }
                        else if (CalcConvert.err(obj))
                        {
                            return obj
                        }
                    }
                    if (n <= 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(Math_sqrt(Math_max(0.0, (n * sumx2 - sumx * sumx) / (n * n))))
                }
                function db_dsum(args)
                {
                    if (!args[0] || !args[1] || !args[2])
                    {
                        throw Sheets.SR.Exp_ArgumentNull;
                    }
                    var errorObject = Calc.Convert.CalcConvertedError;
                    var database = CalcConvert.toArr(args[0], 0, false, false, false);
                    if (database.isError)
                    {
                        return database[0]
                    }
                    var field = args[1];
                    var criteria = CalcConvert.toArr(args[2], 0, false, false, false);
                    if (criteria.isError)
                    {
                        return criteria[0]
                    }
                    var sum = 0.0;
                    var enumerator = new _DatabaseEnumerator(database, field, criteria);
                    while (enumerator.moveNext())
                    {
                        var obj = enumerator.current();
                        if (CalcConvert.num(obj))
                        {
                            var x;
                            if (isNaN(x = CalcConvert.D(obj)))
                            {
                                return CalcErrorsValue
                            }
                            sum += x
                        }
                        else if (CalcConvert.err(obj))
                        {
                            return obj
                        }
                    }
                    return CalcConvert.toResult(sum)
                }
                function db_dvar(args)
                {
                    if (!args[0] || !args[1] || !args[2])
                    {
                        throw Sheets.SR.Exp_ArgumentNull;
                    }
                    var errorObject = Calc.Convert.CalcConvertedError;
                    var database = CalcConvert.toArr(args[0], 0, false, false, false);
                    if (database.isError)
                    {
                        return database[0]
                    }
                    var field = args[1];
                    var criteria = CalcConvert.toArr(args[2], 0, false, false, false);
                    if (criteria.isError)
                    {
                        return criteria[0]
                    }
                    var sumx = 0.0;
                    var sumx2 = 0.0;
                    var n = 0.0;
                    var enumerator = new _DatabaseEnumerator(database, field, criteria);
                    while (enumerator.moveNext())
                    {
                        var obj = enumerator.current();
                        if (CalcConvert.num(obj))
                        {
                            var x;
                            if (isNaN(x = CalcConvert.D(obj)))
                            {
                                return CalcErrorsValue
                            }
                            sumx += x;
                            sumx2 += x * x;
                            n++
                        }
                        else if (CalcConvert.err(obj))
                        {
                            return obj
                        }
                    }
                    if (n <= 1.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(Math_max(0.0, (n * sumx2 - sumx * sumx) / (n * (n - 1.0))))
                }
                function db_dvarp(args)
                {
                    if (!args[0] || !args[1] || !args[2])
                    {
                        throw Sheets.SR.Exp_ArgumentNull;
                    }
                    var errorObject = Calc.Convert.CalcConvertedError;
                    var database = CalcConvert.toArr(args[0], 0, false, false, false);
                    if (database.isError)
                    {
                        return database[0]
                    }
                    var field = args[1];
                    var criteria = CalcConvert.toArr(args[2], 0, false, false, false);
                    if (criteria.isError)
                    {
                        return criteria[0]
                    }
                    var sumx = 0.0;
                    var sumx2 = 0.0;
                    var n = 0.0;
                    var enumerator = new _DatabaseEnumerator(database, field, criteria);
                    while (enumerator.moveNext())
                    {
                        var obj = enumerator.current();
                        if (CalcConvert.num(obj))
                        {
                            var x;
                            if (isNaN(x = CalcConvert.D(obj)))
                            {
                                return CalcErrorsValue
                            }
                            sumx += x;
                            sumx2 += x * x;
                            n++
                        }
                        else if (CalcConvert.err(obj))
                        {
                            return obj
                        }
                    }
                    if (n <= 1.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(Math_max(0.0, (n * sumx2 - sumx * sumx) / (n * n)))
                }
                Functions.def("DAVERAGE", db_daverage, {
                    minArgs: 3, maxArgs: 3, acceptsReference: Functions.acceptsNotSecond, acceptsArray: Functions.acceptsNotSecond
                });
                Functions.def("DCOUNT", db_dcount, {
                    minArgs: 3, maxArgs: 3, acceptsReference: Functions.acceptsNotSecond, acceptsArray: Functions.acceptsNotSecond
                });
                Functions.def("DCOUNTA", db_dcounta, {
                    minArgs: 3, maxArgs: 3, acceptsReference: Functions.acceptsNotSecond, acceptsArray: Functions.acceptsNotSecond
                });
                Functions.def("DGET", db_dget, {
                    minArgs: 3, maxArgs: 3, acceptsReference: Functions.acceptsNotSecond, acceptsArray: Functions.acceptsNotSecond
                });
                Functions.def("DMAX", db_dmax, {
                    minArgs: 3, maxArgs: 3, acceptsReference: Functions.acceptsNotSecond, acceptsArray: Functions.acceptsNotSecond
                });
                Functions.def("DMIN", db_dmin, {
                    minArgs: 3, maxArgs: 3, acceptsReference: Functions.acceptsNotSecond, acceptsArray: Functions.acceptsNotSecond
                });
                Functions.def("DPRODUCT", db_dproduct, {
                    minArgs: 3, maxArgs: 3, acceptsReference: Functions.acceptsNotSecond, acceptsArray: Functions.acceptsNotSecond
                });
                Functions.def("DSTDEV", db_dstdev, {
                    minArgs: 3, maxArgs: 3, acceptsReference: Functions.acceptsNotSecond, acceptsArray: Functions.acceptsNotSecond
                });
                Functions.def("DSTDEVP", db_dstdevp, {
                    minArgs: 3, maxArgs: 3, acceptsReference: Functions.acceptsNotSecond, acceptsArray: Functions.acceptsNotSecond
                });
                Functions.def("DSUM", db_dsum, {
                    minArgs: 3, maxArgs: 3, acceptsReference: Functions.acceptsNotSecond, acceptsArray: Functions.acceptsNotSecond
                });
                Functions.def("DVAR", db_dvar, {
                    minArgs: 3, maxArgs: 3, acceptsReference: Functions.acceptsNotSecond, acceptsArray: Functions.acceptsNotSecond
                });
                Functions.def("DVARP", db_dvarp, {
                    minArgs: 3, maxArgs: 3, acceptsReference: Functions.acceptsNotSecond, acceptsArray: Functions.acceptsNotSecond
                })
            })(Calc.Functions || (Calc.Functions = {}));
            var Functions = Calc.Functions
        })(Sheets.Calc || (Sheets.Calc = {}));
        var Calc = Sheets.Calc
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}));
var GcSpread;
(function(GcSpread)
{
    (function(Sheets)
    {
        (function(Calc)
        {
            (function(Functions)
            {
                Sheets.feature("calc.functions_eng", ["calc.functions"]);
                var keyword_null = null,
                    CalcConvert = Calc.Convert,
                    Math_abs = Math.abs,
                    Math_sin = Math.sin,
                    Math_cos = Math.cos,
                    Math_sqrt = Math.sqrt,
                    Math_log = Math.log,
                    Math_pow = Math.pow,
                    Math_exp = Math.exp,
                    Math_PI = Math.PI,
                    Math_E = Math.E,
                    Math_atan2 = Math.atan2,
                    Math_floor = Math.floor;
                var CalcErrors = Calc.Errors,
                    CalcErrorsNull = CalcErrors.Null,
                    CalcErrorsDivideByZero = CalcErrors.DivideByZero,
                    CalcErrorsValue = CalcErrors.Value,
                    CalcErrorsReference = CalcErrors.Reference,
                    CalcErrorsName = CalcErrors.Name,
                    CalcErrorsNotAvailable = CalcErrors.NotAvailable,
                    CalcErrorsNumber = CalcErrors.Number;
                var INFINITY = 1.79769313486231570815E308,
                    MAXNUM = 1.79769313486231570815E308,
                    SQ2OPI = 7.9788456080286535587989E-1,
                    THPIO4 = 2.35619449019234492885,
                    TWOOPI = 6.36619772367581343075535E-1,
                    PIO4 = 7.85398163397448309616E-1,
                    MACHEP = 1.11022302462515654042E-16,
                    EUL = 5.772156649015328606065e-1;
                function _getPP()
                {
                    var PP = [];
                    PP[0] = (7.96936729297347051624E-4);
                    PP[1] = (8.28352392107440799803E-2);
                    PP[2] = (1.23953371646414299388E0);
                    PP[3] = (5.44725003058768775090E0);
                    PP[4] = (8.74716500199817011941E0);
                    PP[5] = (5.30324038235394892183E0);
                    PP[6] = (9.99999999999999997821E-1);
                    return PP
                }
                function _getPP2()
                {
                    var PP = [];
                    PP[0] = (7.62125616208173112003E-4);
                    PP[1] = (7.31397056940917570436E-2);
                    PP[2] = (1.12719608129684925192E0);
                    PP[3] = (5.11207951146807644818E0);
                    PP[4] = (8.42404590141772420927E0);
                    PP[5] = (5.21451598682361504063E0);
                    PP[6] = (1.00000000000000000254E0);
                    return PP
                }
                function _getPQ()
                {
                    var PQ = [];
                    PQ[0] = (9.24408810558863637013E-4);
                    PQ[1] = (8.56288474354474431428E-2);
                    PQ[2] = (1.25352743901058953537E0);
                    PQ[3] = (5.47097740330417105182E0);
                    PQ[4] = (8.76190883237069594232E0);
                    PQ[5] = (5.30605288235394617618E0);
                    PQ[6] = (1.00000000000000000218E0);
                    return PQ
                }
                function _getPQ2()
                {
                    var PQ = [];
                    PQ[0] = (5.71323128072548699714E-4);
                    PQ[1] = (6.88455908754495404082E-2);
                    PQ[2] = (1.10514232634061696926E0);
                    PQ[3] = (5.07386386128601488557E0);
                    PQ[4] = (8.39985554327604159757E0);
                    PQ[5] = (5.20982848682361821619E0);
                    PQ[6] = (9.99999999999999997461E-1);
                    return PQ
                }
                function _getQP()
                {
                    var QP = [];
                    QP[0] = (-1.13663838898469149931E-2);
                    QP[1] = (-1.28252718670509318512E0);
                    QP[2] = (-1.95539544257735972385E1);
                    QP[3] = (-9.32060152123768231369E1);
                    QP[4] = (-1.77681167980488050595E2);
                    QP[5] = (-1.47077505154951170175E2);
                    QP[6] = (-5.14105326766599330220E1);
                    QP[7] = (-6.05014350600728481186E0);
                    return QP
                }
                function _getQP2()
                {
                    var QP = [];
                    QP[0] = (5.10862594750176621635E-2);
                    QP[1] = (4.98213872951233449420E0);
                    QP[2] = (7.58238284132545283818E1);
                    QP[3] = (3.66779609360150777800E2);
                    QP[4] = (7.10856304998926107277E2);
                    QP[5] = (5.97489612400613639965E2);
                    QP[6] = (2.11688757100572135698E2);
                    QP[7] = (2.52070205858023719784E1);
                    return QP
                }
                function _getQQ()
                {
                    var QQ = [];
                    QQ[0] = (6.43178256118178023184E1);
                    QQ[1] = (8.56430025976980587198E2);
                    QQ[2] = (3.88240183605401609683E3);
                    QQ[3] = (7.24046774195652478189E3);
                    QQ[4] = (5.93072701187316984827E3);
                    QQ[5] = (2.06209331660327847417E3);
                    QQ[6] = (2.42005740240291393179E2);
                    return QQ
                }
                function _getQQ2()
                {
                    var QQ = [];
                    QQ[0] = (7.42373277035675149943E1);
                    QQ[1] = (1.05644886038262816351E3);
                    QQ[2] = (4.98641058337653607651E3);
                    QQ[3] = (9.56231892404756170795E3);
                    QQ[4] = (7.99704160447350683650E3);
                    QQ[5] = (2.82619278517639096600E3);
                    QQ[6] = (3.36093607810698293419E2);
                    return QQ
                }
                function _getYP()
                {
                    var YP = [];
                    YP[0] = (1.55924367855235737965E4);
                    YP[1] = (-1.46639295903971606143E7);
                    YP[2] = (5.43526477051876500413E9);
                    YP[3] = (-9.82136065717911466409E11);
                    YP[4] = (8.75906394395366999549E13);
                    YP[5] = (-3.46628303384729719441E15);
                    YP[6] = (4.42733268572569800351E16);
                    YP[7] = (-1.84950800436986690637E16);
                    return YP
                }
                function _getYP2()
                {
                    var YP = [];
                    YP[0] = (1.26320474790178026440E9);
                    YP[1] = (-6.47355876379160291031E11);
                    YP[2] = (1.14509511541823727583E14);
                    YP[3] = (-8.12770255501325109621E15);
                    YP[4] = (2.02439475713594898196E17);
                    YP[5] = (-7.78877196265950026825E17);
                    return YP
                }
                function _getYQ()
                {
                    var YQ = [];
                    YQ[0] = (1.04128353664259848412E3);
                    YQ[1] = (6.26107330137134956842E5);
                    YQ[2] = (2.68919633393814121987E8);
                    YQ[3] = (8.64002487103935000337E10);
                    YQ[4] = (2.02979612750105546709E13);
                    YQ[5] = (3.17157752842975028269E15);
                    YQ[6] = (2.50596256172653059228E17);
                    return YQ
                }
                function _getYQ2()
                {
                    var YQ = [];
                    YQ[0] = (5.94301592346128195359E2);
                    YQ[1] = (2.35564092943068577943E5);
                    YQ[2] = (7.34811944459721705660E7);
                    YQ[3] = (1.87601316108706159478E10);
                    YQ[4] = (3.88231277496238566008E12);
                    YQ[5] = (6.20557727146953693363E14);
                    YQ[6] = (6.87141087355300489866E16);
                    YQ[7] = (3.97270608116560655612E18);
                    return YQ
                }
                function _getRP()
                {
                    var RP = [];
                    RP[0] = (-4.79443220978201773821E9);
                    RP[1] = (1.95617491946556577543E12);
                    RP[2] = (-2.49248344360967716204E14);
                    RP[3] = (9.70862251047306323952E15);
                    return RP
                }
                function _getRP2()
                {
                    var RP = [];
                    RP[0] = (-8.99971225705559398224E8);
                    RP[1] = (4.52228297998194034323E11);
                    RP[2] = (-7.27494245221818276015E13);
                    RP[3] = (3.68295732863852883286E15);
                    return RP
                }
                function _getRQ()
                {
                    var RQ = [];
                    RQ[0] = (4.99563147152651017219E2);
                    RQ[1] = (1.73785401676374683123E5);
                    RQ[2] = (4.84409658339962045305E7);
                    RQ[3] = (1.11855537045356834862E10);
                    RQ[4] = (2.11277520115489217587E12);
                    RQ[5] = (3.10518229857422583814E14);
                    RQ[6] = (3.18121955943204943306E16);
                    RQ[7] = (1.71086294081043136091E18);
                    return RQ
                }
                function _getRQ2()
                {
                    var RQ = [];
                    RQ[0] = (6.20836478118054335476E2);
                    RQ[1] = (2.56987256757748830383E5);
                    RQ[2] = (8.35146791431949253037E7);
                    RQ[3] = (2.21511595479792499675E10);
                    RQ[4] = (4.74914122079991414898E12);
                    RQ[5] = (7.84369607876235854894E14);
                    RQ[6] = (8.95222336184627338078E16);
                    RQ[7] = (5.32278620332680085395E18);
                    return RQ
                }
                function _gamma(x)
                {
                    var i,
                        k,
                        m;
                    var ga,
                        gr,
                        z;
                    var r = 1.0;
                    var g = [1.0, 0.5772156649015329, -0.6558780715202538, -0.420026350340952e-1, 0.1665386113822915, -0.421977345555443e-1, -0.9621971527877e-2, 0.7218943246663e-2, -0.11651675918591e-2, -0.2152416741149e-3, 0.1280502823882e-3, -0.201348547807e-4, -0.12504934821e-5, 0.1133027232e-5, -0.2056338417e-6, 0.6116095e-8, 0.50020075e-8, -0.11812746e-8, 0.1043427e-9, 0.77823e-11, -0.36968e-11, 0.51e-12, -0.206e-13, -0.54e-14, 0.14e-14];
                    if (x > 171.0)
                    {
                        return 1e308
                    }
                    if (x === parseInt(x, 10))
                    {
                        if (x > 0.0)
                        {
                            ga = 1.0;
                            for (i = 2; i < x; i++)
                            {
                                ga *= i
                            }
                        }
                        else
                        {
                            ga = 1e308
                        }
                    }
                    else
                    {
                        if (Math_abs(x) > 1.0)
                        {
                            z = Math_abs(x);
                            m = parseInt(z, 10);
                            r = 1.0;
                            for (k = 1; k <= m; k++)
                            {
                                r *= (z - k)
                            }
                            z -= m
                        }
                        else
                        {
                            z = x
                        }
                        gr = g[24];
                        for (k = 23; k >= 0; k--)
                        {
                            gr = gr * z + g[k]
                        }
                        ga = 1.0 / (gr * z);
                        if (Math_abs(x) > 1.0)
                        {
                            ga *= r;
                            if (x < 0.0)
                            {
                                ga = -Math_PI / (x * ga * Math_sin(Math_PI * x))
                            }
                        }
                    }
                    return ga
                }
                function _lgamma(x)
                {
                    var x0,
                        x2,
                        xp,
                        gl,
                        gl0;
                    var k;
                    var n = 0;
                    var a = [8.333333333333333e-02, -2.777777777777778e-03, 7.936507936507937e-04, -5.952380952380952e-04, 8.417508417508418e-04, -1.917526917526918e-03, 6.410256410256410e-03, -2.955065359477124e-02, 1.796443723688307e-01, -1.39243221690590];
                    x0 = x;
                    if (x <= 0.0)
                    {
                        return 1e308
                    }
                    else if ((x === 1.0) || (x === 2.0))
                    {
                        return 0.0
                    }
                    else if (x <= 7.0)
                    {
                        n = parseInt((7 - x).toString(), 10);
                        x0 = x + n
                    }
                    x2 = 1.0 / (x0 * x0);
                    xp = 2.0 * Math_PI;
                    gl0 = a[9];
                    for (k = 8; k >= 0; k--)
                    {
                        gl0 = gl0 * x2 + a[k]
                    }
                    gl = gl0 / x0 + 0.5 * Math_log(xp) + (x0 - 0.5) * Math_log(x0) - x0;
                    if (x <= 7.0)
                    {
                        for (k = 1; k <= n; k++)
                        {
                            gl -= Math_log(x0 - 1.0);
                            x0 -= 1.0
                        }
                    }
                    return gl
                }
                function _expx2(x, sign)
                {
                    var u,
                        u1,
                        m,
                        f;
                    x = Math_abs(x);
                    if (sign < 0)
                    {
                        x = -x
                    }
                    m = 0.0078125 * Math_floor(128 * x + 0.5);
                    f = x - m;
                    u = m * m;
                    u1 = 2 * m * f + f * f;
                    if (sign < 0)
                    {
                        u = -u;
                        u1 = -u1
                    }
                    if ((u + u1) > Math_log(MAXNUM))
                    {
                        return (INFINITY)
                    }
                    u = Math_exp(u) * Math_exp(u1);
                    return (u)
                }
                function _polevl(x, coef, N)
                {
                    var ans;
                    var i;
                    var k = 0;
                    ans = parseFloat(coef[k++]);
                    i = N;
                    do
                        ans = ans * x + parseFloat(coef[k++]);
                    while (--i !== 0);
                    return (ans)
                }
                function _p1evl(x, coef, N)
                {
                    var ans;
                    var i;
                    var k = 0;
                    ans = x + parseFloat(coef[k++]);
                    i = N - 1;
                    do
                        ans = ans * x + parseFloat(coef[k++]);
                    while (--i !== 0);
                    return (ans)
                }
                function _j0(x)
                {
                    var PP = _getPP();
                    var PQ = _getPQ();
                    var QP = _getQP();
                    var QQ = _getQQ();
                    var YP = _getYP();
                    var YQ = _getYQ();
                    var DR1 = 5.78318596294678452118E0;
                    var DR2 = 3.04712623436620863991E1;
                    var RP = _getRP();
                    var RQ = _getRQ();
                    var PIO4 = 7.85398163397448309616E-1;
                    var SQ2OPI = 7.9788456080286535587989E-1;
                    var w,
                        z,
                        p,
                        q,
                        xn;
                    if (x < 0)
                    {
                        x = -x
                    }
                    if (x <= 5.0)
                    {
                        z = x * x;
                        if (x < 1.0e-5)
                        {
                            return (1.0 - z / 4.0)
                        }
                        p = (z - DR1) * (z - DR2);
                        p = p * _polevl(z, RP, 3) / _p1evl(z, RQ, 8);
                        return (p)
                    }
                    w = 5.0 / x;
                    q = 25.0 / (x * x);
                    p = _polevl(q, PP, 6) / _polevl(q, PQ, 6);
                    q = _polevl(q, QP, 7) / _p1evl(q, QQ, 7);
                    xn = x - PIO4;
                    p = p * Math_cos(xn) - w * q * Math_sin(xn);
                    return (p * SQ2OPI / Math_sqrt(x))
                }
                function _j1(x)
                {
                    var RP = _getRP2();
                    var RQ = _getRQ2();
                    var QP = _getQP2();
                    var QQ = _getQQ2();
                    var PP = _getPP2();
                    var PQ = _getPQ2();
                    var Z1 = 1.46819706421238932572E1;
                    var Z2 = 4.92184563216946036703E1;
                    var w,
                        z,
                        p,
                        q,
                        xn;
                    var SQ2OPI = 7.9788456080286535587989E-1;
                    var THPIO4 = 2.35619449019234492885;
                    w = x;
                    if (x < 0)
                    {
                        w = -x
                    }
                    if (w <= 5.0)
                    {
                        z = x * x;
                        w = _polevl(z, RP, 3) / _p1evl(z, RQ, 8);
                        w = w * x * (z - Z1) * (z - Z2);
                        return (w)
                    }
                    w = 5.0 / x;
                    z = w * w;
                    p = _polevl(z, PP, 6) / _polevl(z, PQ, 6);
                    q = _polevl(z, QP, 7) / _p1evl(z, QQ, 7);
                    xn = x - THPIO4;
                    p = p * Math_cos(xn) - w * q * Math_sin(xn);
                    return (p * SQ2OPI / Math_sqrt(x))
                }
                function _jn(n, x)
                {
                    var pkm2,
                        pkm1,
                        pk,
                        xk,
                        r,
                        ans;
                    var k,
                        sign;
                    var MACHEP = 1.11022302462515654042E-16;
                    if (n < 0)
                    {
                        n = -n;
                        if ((n & 1) === 0)
                        {
                            sign = 1
                        }
                        else
                        {
                            sign = -1
                        }
                    }
                    else
                    {
                        sign = 1
                    }
                    if (x < 0.0)
                    {
                        if ((n & 1) !== 0)
                        {
                            sign = -sign
                        }
                        x = -x
                    }
                    if (n === 0)
                    {
                        return (sign * _j0(x))
                    }
                    if (n === 1)
                    {
                        return (sign * _j1(x))
                    }
                    if (n === 2)
                    {
                        return (sign * (2.0 * _j1(x) / x - _j0(x)))
                    }
                    if (x < MACHEP)
                    {
                        return (0.0)
                    }
                    k = 56;
                    pk = 2 * (n + k);
                    ans = pk;
                    xk = x * x;
                    do
                    {
                        pk -= 2.0;
                        ans = pk - (xk / ans)
                    } while (--k > 0);
                    ans = x / ans;
                    pk = 1.0;
                    pkm1 = 1.0 / ans;
                    k = n - 1;
                    r = 2 * k;
                    do
                    {
                        pkm2 = (pkm1 * r - pk * x) / x;
                        pk = pkm1;
                        pkm1 = pkm2;
                        r -= 2.0
                    } while (--k > 0);
                    if (Math_abs(pk) > Math_abs(pkm1))
                    {
                        ans = _j1(x) / pk
                    }
                    else
                    {
                        ans = _j0(x) / pkm1
                    }
                    return (sign * ans)
                }
                function _adoneGoto(ans, x, s)
                {
                    ans = Math_exp(-x) * Math_sqrt(Math_PI / (2.0 * x)) * s
                }
                function _asympGoto(x, n, k, pn, pk, z0, fn, t, s, nkf, i, z, ans, nk1f)
                {
                    if (x > Math_log(MAXNUM))
                    {
                        return (0.0)
                    }
                    k = n;
                    pn = 4.0 * k * k;
                    pk = 1.0;
                    z0 = 8.0 * x;
                    fn = 1.0;
                    t = 1.0;
                    s = t;
                    nkf = MAXNUM;
                    i = 0;
                    do
                    {
                        z = pn - pk * pk;
                        t = t * z / (fn * z0);
                        nk1f = Math_abs(t);
                        if ((i >= n) && (nk1f > nkf))
                        {
                            _adoneGoto(ans, x, s)
                        }
                        nkf = nk1f;
                        s += t;
                        fn += 1.0;
                        pk += 2.0;
                        i += 1
                    } while (Math_abs(t / s) > MACHEP)
                }
                function _kn(nn, x)
                {
                    var k,
                        kf,
                        nk1f,
                        nkf,
                        zn,
                        t,
                        s,
                        z0,
                        z;
                    var ans,
                        fn,
                        pn,
                        pk,
                        zmn,
                        tlg,
                        tox;
                    var i,
                        n;
                    if (nn < 0)
                    {
                        n = -nn
                    }
                    else
                    {
                        n = nn
                    }
                    if (n > 31)
                    {
                        return (MAXNUM)
                    }
                    if (x <= 0.0)
                    {
                        return (MAXNUM)
                    }
                    if (x > 9.55)
                    {
                        _asympGoto(x, n, k, pn, pk, z0, fn, t, s, nkf, i, z, ans, nk1f)
                    }
                    ans = 0.0;
                    z0 = 0.25 * x * x;
                    fn = 1.0;
                    pn = 0.0;
                    zmn = 1.0;
                    tox = 2.0 / x;
                    if (n > 0)
                    {
                        pn = -EUL;
                        k = 1.0;
                        for (i = 1; i < n; i++)
                        {
                            pn += 1.0 / k;
                            k += 1.0;
                            fn *= k
                        }
                        zmn = tox;
                        if (n === 1)
                        {
                            ans = 1.0 / x
                        }
                        else
                        {
                            nk1f = fn / n;
                            kf = 1.0;
                            s = nk1f;
                            z = -z0;
                            zn = 1.0;
                            for (i = 1; i < n; i++)
                            {
                                nk1f = nk1f / (n - i);
                                kf = kf * i;
                                zn *= z;
                                t = nk1f * zn / kf;
                                s += t;
                                if ((MAXNUM - Math_abs(t)) < Math_abs(s))
                                {
                                    return (MAXNUM)
                                }
                                if ((tox > 1.0) && ((MAXNUM / tox) < zmn))
                                {
                                    return (MAXNUM)
                                }
                                zmn *= tox
                            }
                            s *= 0.5;
                            t = Math_abs(s);
                            if ((zmn > 1.0) && ((MAXNUM / zmn) < t))
                            {
                                return (MAXNUM)
                            }
                            if ((t > 1.0) && ((MAXNUM / t) < zmn))
                            {
                                return (MAXNUM)
                            }
                            ans = s * zmn
                        }
                    }
                    tlg = 2.0 * Math_log(0.5 * x);
                    pk = -EUL;
                    if (n === 0)
                    {
                        pn = pk;
                        t = 1.0
                    }
                    else
                    {
                        pn = pn + 1.0 / n;
                        t = 1.0 / fn
                    }
                    s = (pk + pn - tlg) * t;
                    k = 1.0;
                    do
                    {
                        t *= z0 / (k * (k + n));
                        pk += 1.0 / k;
                        pn += 1.0 / (k + n);
                        s += (pk + pn - tlg) * t;
                        k += 1.0
                    } while (Math_abs(t / s) > MACHEP);
                    s = 0.5 * s / zmn;
                    if ((n & 1) !== 0)
                    {
                        s = -s
                    }
                    ans += s;
                    return (ans)
                }
                function _y1(x)
                {
                    var w,
                        z,
                        p,
                        q,
                        xn;
                    var QP = _getQP2();
                    var QQ = _getQQ2();
                    var PP = _getPP2();
                    var PQ = _getPQ2();
                    var YP = _getYP2();
                    var YQ = _getYQ2();
                    if (x <= 5.0)
                    {
                        if (x <= 0.0)
                        {
                            return (-MAXNUM)
                        }
                        z = x * x;
                        w = x * (_polevl(z, YP, 5) / _p1evl(z, YQ, 8));
                        w += TWOOPI * (_j1(x) * Math_log(x) - 1.0 / x);
                        return (w)
                    }
                    w = 5.0 / x;
                    z = w * w;
                    p = _polevl(z, PP, 6) / _polevl(z, PQ, 6);
                    q = _polevl(z, QP, 7) / _p1evl(z, QQ, 7);
                    xn = x - THPIO4;
                    p = p * Math_sin(xn) + w * q * Math_cos(xn);
                    return (p * SQ2OPI / Math_sqrt(x))
                }
                function _y0(x)
                {
                    var w,
                        z,
                        p,
                        q,
                        xn;
                    var PP = _getPP();
                    var PQ = _getPQ();
                    var QP = _getQP();
                    var QQ = _getQQ();
                    var YP = _getYP();
                    var YQ = _getYQ();
                    if (x <= 5.0)
                    {
                        if (x <= 0.0)
                        {
                            return (-MAXNUM)
                        }
                        z = x * x;
                        w = _polevl(z, YP, 7) / _p1evl(z, YQ, 7);
                        w += TWOOPI * Math_log(x) * _j0(x);
                        return (w)
                    }
                    w = 5.0 / x;
                    z = 25.0 / (x * x);
                    p = _polevl(z, PP, 6) / _polevl(z, PQ, 6);
                    q = _polevl(z, QP, 7) / _p1evl(z, QQ, 7);
                    xn = x - PIO4;
                    p = p * Math_sin(xn) + w * q * Math_cos(xn);
                    return (p * SQ2OPI / Math_sqrt(x))
                }
                function _yn(n, x)
                {
                    var an,
                        anm1,
                        anm2,
                        r;
                    var k,
                        sign;
                    if (n < 0)
                    {
                        n = -n;
                        if ((n & 1) === 0)
                        {
                            sign = 1
                        }
                        else
                        {
                            sign = -1
                        }
                    }
                    else
                    {
                        sign = 1
                    }
                    if (n === 0)
                    {
                        return (sign * _y0(x))
                    }
                    if (n === 1)
                    {
                        return (sign * _y1(x))
                    }
                    if (x <= 0.0)
                    {
                        return (-MAXNUM)
                    }
                    anm2 = _y0(x);
                    anm1 = _y1(x);
                    k = 1;
                    r = 2 * k;
                    do
                    {
                        an = r * anm1 / x - anm2;
                        anm2 = anm1;
                        anm1 = an;
                        r += 2.0;
                        ++k
                    } while (k < n);
                    return (sign * an)
                }
                function _fact(n)
                {
                    var result = 1.0;
                    for (var i = n; i > 1; i--)
                    {
                        result *= i
                    }
                    return result
                }
                function _bessel(num, order, modfied)
                {
                    if (order < 0)
                    {
                        return NaN
                    }
                    var Z,
                        Zm,
                        N1,
                        N2,
                        n1,
                        n2,
                        act,
                        old;
                    var iterMax = 100;
                    Z = num * 0.5;
                    Zm = Z * Z;
                    Z = Math_pow(Z, parseFloat(order));
                    N1 = _fact(order);
                    n1 = 0.0;
                    N2 = 1.0;
                    n2 = parseFloat(order);
                    act = Z / N1;
                    old = act * 0.9;
                    if (modfied)
                    {
                        while (act !== old && iterMax !== 0)
                        {
                            Z *= Zm;
                            n1++;
                            N1 *= n1;
                            n2++;
                            N2 *= n2;
                            old = act;
                            act += Z / N1 / N2;
                            iterMax--
                        }
                    }
                    else
                    {
                        var add = false;
                        while (act !== old && iterMax !== 0)
                        {
                            Z *= Zm;
                            n1++;
                            N1 *= n1;
                            n2++;
                            N2 *= n2;
                            old = act;
                            if (add)
                            {
                                act += Z / N1 / N2
                            }
                            else
                            {
                                act -= Z / N1 / N2
                            }
                            iterMax--;
                            add = !add
                        }
                    }
                    return act
                }
                function _stringToLong(s, radix)
                {
                    var limit = Math_pow(radix, 10.0);
                    var number = parseInt(s, radix);
                    if (isNaN(number))
                    {
                        return CalcErrorsNumber
                    }
                    if (limit / 2 <= number)
                    {
                        number -= limit
                    }
                    return number
                }
                function _longToString(number, radix, places)
                {
                    var buffer;
                    if (number < 0)
                    {
                        number += Math_pow(radix, 10.0)
                    }
                    buffer = number.toString(radix);
                    if (buffer.length < places)
                    {
                        var pos = places - buffer.length;
                        for (var i = 0; i < pos; i++)
                        {
                            buffer = "0" + buffer
                        }
                    }
                    return buffer.toUpperCase()
                }
                var Complex = (function()
                    {
                        function Complex(real, imag)
                        {
                            this._real = real;
                            this._imag = imag
                        }
                        Complex.prototype.real = function()
                        {
                            return this._real
                        };
                        Complex.prototype.imag = function()
                        {
                            return this._imag
                        };
                        Complex.prototype.toString = function(suffix)
                        {
                            if (!suffix)
                            {
                                suffix = "i"
                            }
                            var self = this;
                            var sb = "";
                            if (self._real !== 0.0 || self._imag === 0.0)
                            {
                                sb += self._real.toString()
                            }
                            if (self._imag === -1.0)
                            {
                                sb += "-"
                            }
                            else if (self._real !== 0.0 && self._imag > 0.0)
                            {
                                sb += "+"
                            }
                            if (self._imag !== -1.0 && self._imag !== 0.0 && self._imag !== 1.0)
                            {
                                sb += self._imag.toString()
                            }
                            if (self._imag !== 0.0)
                            {
                                sb += suffix
                            }
                            return sb
                        };
                        Complex._parse = function(s)
                        {
                            var real = 0.0;
                            var imag = 0.0;
                            var realDigit = false;
                            var imagDigit = false;
                            var imagSuffix = false;
                            var realLen = 0;
                            var imagLen = 0;
                            var i = 0;
                            if (!s)
                            {
                                throw Sheets.SR.Exp_ArgumentNull;
                            }
                            if (s.length === 0)
                            {
                                throw Sheets.SR.Exp_Format;
                            }
                            if (i < s.length && (s.charAt(i) === '+' || s.charAt(i) === '-'))
                            {
                                i++
                            }
                            while (i < s.length && (!isNaN(Number(s.charAt(i)))))
                            {
                                i++;
                                realDigit = true
                            }
                            if (i < s.length && s.charAt(i) === '.')
                            {
                                i++
                            }
                            while (i < s.length && (!isNaN(Number(s.charAt(i)))))
                            {
                                i++;
                                realDigit = true
                            }
                            if (i < s.length && (s.charAt(i) === 'E' || s.charAt(i) === 'e'))
                            {
                                i++;
                                realDigit = false;
                                if (i < s.length && (s.charAt(i) === '+' || s.charAt(i) === '-'))
                                {
                                    i++
                                }
                                while (i < s.length && (!isNaN(Number(s.charAt(i)))))
                                {
                                    i++;
                                    realDigit = true
                                }
                            }
                            if (i < s.length && (s.charAt(i) === '+' || s.charAt(i) === '-'))
                            {
                                realLen = i;
                                i++;
                                while (i < s.length && !isNaN(Number(s.charAt(i))))
                                {
                                    i++;
                                    imagDigit = true
                                }
                                if (i < s.length && s.charAt(i) === '.')
                                {
                                    i++
                                }
                                while (i < s.length && !isNaN(Number(s.charAt(i))))
                                {
                                    i++;
                                    imagDigit = true
                                }
                                if (i < s.length && (s.charAt(i) === 'E' || s.charAt(i) === 'e'))
                                {
                                    i++;
                                    imagDigit = false;
                                    if (i < s.length && (s.charAt(i) === '+' || s.charAt(i) === '-'))
                                    {
                                        i++
                                    }
                                    while (i < s.length && !isNaN(Number(s.charAt(i))))
                                    {
                                        i++;
                                        imagDigit = true
                                    }
                                }
                                if (i < s.length && (s.charAt(i) === 'i' || s.charAt(i) === 'j'))
                                {
                                    i++;
                                    imagSuffix = true
                                }
                                imagLen = i - realLen
                            }
                            else if (i < s.length && (s.charAt(i) === 'i' || s.charAt(i) === 'j'))
                            {
                                i++;
                                imagLen = i;
                                imagDigit = realDigit;
                                imagSuffix = true;
                                realDigit = false
                            }
                            else
                            {
                                realLen = i
                            }
                            if (i < s.length)
                            {
                                throw Sheets.SR.Exp_Format;
                            }
                            if (realLen > 0)
                            {
                                if (realDigit)
                                {
                                    real = parseInt(s.substr(0, realLen), 10)
                                }
                                else
                                {
                                    throw Sheets.SR.Exp_Format;
                                }
                            }
                            if (imagLen > 0)
                            {
                                if (!imagSuffix)
                                {
                                    throw Sheets.SR.Exp_Format;
                                }
                                if (imagLen === 1)
                                {
                                    imag = 1.0
                                }
                                else if (imagLen === 2 && s.charAt(realLen) === '+')
                                {
                                    imag = 1.0
                                }
                                else if (imagLen === 2 && s.charAt(realLen) === '-')
                                {
                                    imag = -1.0
                                }
                                else if (imagDigit)
                                {
                                    imag = parseInt(s.substr(realLen, imagLen - 1), 10)
                                }
                                else
                                {
                                    throw Sheets.SR.Exp_Format;
                                }
                            }
                            return new Complex(real, imag)
                        };
                        return Complex
                    })();
                var ComplexConvert = (function()
                    {
                        function ComplexConvert(){}
                        ComplexConvert._toComplex = function(value)
                        {
                            try
                            {
                                if (!value)
                                {
                                    return new Complex(0.0, 0.0)
                                }
                                else if (value.constructor === Number)
                                {
                                    return new Complex(parseFloat(value), 0.0)
                                }
                                else if (value.constructor === String)
                                {
                                    return Complex._parse(value)
                                }
                                else
                                {
                                    return null
                                }
                            }
                            catch(err)
                            {
                                return null
                            }
                        };
                        ComplexConvert._toResult = function(value, suffix)
                        {
                            if (isNaN(value.real()) || (value.real() === Number.POSITIVE_INFINITY) || isNaN(value.imag()) || value.imag() === Number.POSITIVE_INFINITY)
                            {
                                return CalcErrorsNumber
                            }
                            else
                            {
                                return value.toString(suffix)
                            }
                        };
                        return ComplexConvert
                    })();
                var one_g_to_sg = 0.00006852205001;
                var one_g_to_lbm = 0.002204622915;
                var one_g_to_u = 6.02217e+23;
                var one_g_to_ozm = 0.035273972;
                var one_m_to_Nmi = (1 / 1852.0);
                var one_m_to_in = (10000 / 254.0);
                var one_m_to_ft = (one_m_to_in / 12);
                var one_m_to_yd = (one_m_to_ft / 3);
                var one_m_to_mi = (one_m_to_yd / 1760.0);
                var one_m_to_ang = 1e10;
                var one_m_to_Pica = 2834.645669;
                var one_m_to_km = 0.001;
                var one_yr_to_day = 365.25;
                var one_yr_to_hr = (24 * one_yr_to_day);
                var one_yr_to_mn = (60 * one_yr_to_hr);
                var one_yr_to_sec = (60 * one_yr_to_mn);
                var one_Pa_to_atm = 0.9869233e-5;
                var one_Pa_to_mmHg = 0.00750061708;
                var one_N_to_dyn = 100000;
                var one_N_to_lbf = 0.224808924;
                var one_HP_to_W = 745.701;
                var one_J_to_e = 9999995.193;
                var one_J_to_c = 0.239006249;
                var one_J_to_cal = 0.238846191;
                var one_J_to_eV = 6.2146e+18;
                var one_J_to_HPh = (1.0 / (3600 * one_HP_to_W));
                var one_J_to_Wh = (1.0 / 3600);
                var one_J_to_flb = 23.73042222;
                var one_J_to_BTU = 0.000947815;
                var one_T_to_ga = 10000;
                var C_K_offset = 273.15;
                var one_tsp_to_tbs = (1.0 / 3);
                var one_tsp_to_oz = (1.0 / 6);
                var one_tsp_to_cup = (1.0 / 48);
                var one_tsp_to_pt = (1.0 / 96);
                var one_tsp_to_qt = (1.0 / 192);
                var one_tsp_to_gal = (1.0 / 768);
                var one_tsp_to_l = 0.004929994;
                var one_tsp_to_ukpt = 0.008675585;
                var yotta = 1e+24;
                var zetta = 1e+21;
                var exa = 1e+18;
                var peta = 1e+15;
                var tera = 1e+12;
                var giga = 1e+09;
                var mega = 1e+06;
                var kilo = 1e+03;
                var hecto = 1e+02;
                var deka = 1e+01;
                var deci = 1e-01;
                var centi = 1e-02;
                var milli = 1e-03;
                var micro = 1e-06;
                var nano = 1e-09;
                var pico = 1e-12;
                var femto = 1e-15;
                var atto = 1e-18;
                var zepto = 1e-21;
                var yocto = 1e-24;
                var Eng_convert_unit_t = (function()
                    {
                        function Eng_convert_unit_t(str, c)
                        {
                            this.str = str;
                            this.c = c
                        }
                        return Eng_convert_unit_t
                    })();
                var _weight_units = [new Eng_convert_unit_t("g", 1.0), new Eng_convert_unit_t("sg", one_g_to_sg), new Eng_convert_unit_t("lbm", one_g_to_lbm), new Eng_convert_unit_t("u", one_g_to_u), new Eng_convert_unit_t("ozm", one_g_to_ozm), new Eng_convert_unit_t(keyword_null, 0.0)];
                var _distance_units = [new Eng_convert_unit_t("m", 1.0), new Eng_convert_unit_t("mi", one_m_to_mi), new Eng_convert_unit_t("Nmi", one_m_to_Nmi), new Eng_convert_unit_t("in", one_m_to_in), new Eng_convert_unit_t("ft", one_m_to_ft), new Eng_convert_unit_t("yd", one_m_to_yd), new Eng_convert_unit_t("ang", one_m_to_ang), new Eng_convert_unit_t("Pica", one_m_to_Pica), new Eng_convert_unit_t("km", one_m_to_km), new Eng_convert_unit_t(keyword_null, 0.0)];
                var _time_units = [new Eng_convert_unit_t("yr", 1.0), new Eng_convert_unit_t("day", one_yr_to_day), new Eng_convert_unit_t("hr", one_yr_to_hr), new Eng_convert_unit_t("mn", one_yr_to_mn), new Eng_convert_unit_t("sec", one_yr_to_sec), new Eng_convert_unit_t(keyword_null, 0.0)];
                var _pressure_units = [new Eng_convert_unit_t("Pa", 1.0), new Eng_convert_unit_t("atm", one_Pa_to_atm), new Eng_convert_unit_t("mmHg", one_Pa_to_mmHg), new Eng_convert_unit_t("p", 1.0), new Eng_convert_unit_t("at", one_Pa_to_atm), new Eng_convert_unit_t(keyword_null, 0.0)];
                var _force_units = [new Eng_convert_unit_t("N", 1.0), new Eng_convert_unit_t("dyn", one_N_to_dyn), new Eng_convert_unit_t("lbf", one_N_to_lbf), new Eng_convert_unit_t("dy", one_N_to_dyn), new Eng_convert_unit_t(keyword_null, 0.0)];
                var _energy_units = [new Eng_convert_unit_t("J", 1.0), new Eng_convert_unit_t("e", one_J_to_e), new Eng_convert_unit_t("c", one_J_to_c), new Eng_convert_unit_t("cal", one_J_to_cal), new Eng_convert_unit_t("eV", one_J_to_eV), new Eng_convert_unit_t("HPh", one_J_to_HPh), new Eng_convert_unit_t("Wh", one_J_to_Wh), new Eng_convert_unit_t("flb", one_J_to_flb), new Eng_convert_unit_t("BTU", one_J_to_BTU), new Eng_convert_unit_t("ev", one_J_to_eV), new Eng_convert_unit_t("hh", one_J_to_HPh), new Eng_convert_unit_t("wh", one_J_to_Wh), new Eng_convert_unit_t("btu", one_J_to_BTU), new Eng_convert_unit_t(keyword_null, 0.0)];
                var _power_units = [new Eng_convert_unit_t("HP", 1.0), new Eng_convert_unit_t("W", one_HP_to_W), new Eng_convert_unit_t("h", 1.0), new Eng_convert_unit_t("w", one_HP_to_W), new Eng_convert_unit_t(keyword_null, 0.0)];
                var _magnetism_units = [new Eng_convert_unit_t("T", 1.0), new Eng_convert_unit_t("ga", one_T_to_ga), new Eng_convert_unit_t(keyword_null, 0.0)];
                var _liquid_units = [new Eng_convert_unit_t("tsp", 1.0), new Eng_convert_unit_t("tbs", one_tsp_to_tbs), new Eng_convert_unit_t("oz", one_tsp_to_oz), new Eng_convert_unit_t("cup", one_tsp_to_cup), new Eng_convert_unit_t("pt", one_tsp_to_pt), new Eng_convert_unit_t("qt", one_tsp_to_qt), new Eng_convert_unit_t("gal", one_tsp_to_gal), new Eng_convert_unit_t("l", one_tsp_to_l), new Eng_convert_unit_t("uk_pt", one_tsp_to_ukpt), new Eng_convert_unit_t("us_pt", one_tsp_to_pt), new Eng_convert_unit_t("lt", one_tsp_to_l), new Eng_convert_unit_t(keyword_null, 0.0)];
                var _prefixes = [new Eng_convert_unit_t("Y", yotta), new Eng_convert_unit_t("Z", zetta), new Eng_convert_unit_t("E", exa), new Eng_convert_unit_t("P", peta), new Eng_convert_unit_t("T", tera), new Eng_convert_unit_t("G", giga), new Eng_convert_unit_t("M", mega), new Eng_convert_unit_t("k", kilo), new Eng_convert_unit_t("h", hecto), new Eng_convert_unit_t("e", deka), new Eng_convert_unit_t("d", deci), new Eng_convert_unit_t("c", centi), new Eng_convert_unit_t("m", milli), new Eng_convert_unit_t("u", micro), new Eng_convert_unit_t("n", nano), new Eng_convert_unit_t("p", pico), new Eng_convert_unit_t("f", femto), new Eng_convert_unit_t("a", atto), new Eng_convert_unit_t("z", zepto), new Eng_convert_unit_t("y", yocto), new Eng_convert_unit_t(keyword_null, 0.0)];
                var _c = 0.0;
                var _prefix = 0.0;
                var _v = 0.0;
                var _fixPrefixesList = ["cup", "mmHg", "J", "sec", "cel", "kel", "hh", "Wh", "wh", "flb", "BTU"];
                function _fixPrefixes(unitName)
                {
                    for (var i = 0; _fixPrefixesList[i].str; i++)
                    {
                        if (unitName.localeCompare(_fixPrefixesList[i].str) === 0)
                        {
                            return false
                        }
                    }
                    return true
                }
                function _get_constant_of_unit(units, prefixes, unit_name)
                {
                    var i;
                    _c = 0;
                    _prefix = 1;
                    for (i = 0; units[i].str; i++)
                    {
                        if ((unit_name.localeCompare(units[i].str)) === 0)
                        {
                            _c = units[i].c;
                            return true
                        }
                    }
                    var j = 0;
                    if (prefixes)
                    {
                        for (i = 0; prefixes[i].str; i++)
                        {
                            var u = unit_name.substr(0, 1).toLowerCase();
                            var p = prefixes[i].str.substr(0, 1).toLowerCase();
                            if ((u === p) && _fixPrefixes(unit_name))
                            {
                                _prefix = prefixes[i].c;
                                j++
                            }
                        }
                    }
                    for (i = 0; units[i].str; i++)
                    {
                        var u1 = unit_name.substr(1, units[i].str.Length);
                        var u2 = units[i].str.substr(0, units[i].str.Length);
                        if ((u1 === u2) && _fixPrefixes(unit_name))
                        {
                            _c = units[i].c;
                            return true
                        }
                    }
                    return false
                }
                function _convert(units, prefixes, from_unit, to_unit, n)
                {
                    var from_c,
                        from_prefix,
                        to_c,
                        to_prefix;
                    from_c = 0.0;
                    from_prefix = 0.0;
                    to_prefix = 0.0;
                    to_c = 0.0;
                    var from_result = _get_constant_of_unit(units, prefixes, from_unit);
                    from_c = _c;
                    from_prefix = _prefix;
                    var to_result = _get_constant_of_unit(units, prefixes, to_unit);
                    to_prefix = _prefix;
                    to_c = _c;
                    if (from_result)
                    {
                        if (!to_result)
                        {
                            return false
                        }
                        if (from_c === 0 || to_prefix === 0)
                        {
                            return false
                        }
                        _v = ((n * from_prefix) / from_c) * to_c / to_prefix;
                        return true
                    }
                    return false
                }
                function eg_convert(args)
                {
                    var n = parseFloat(args[0]);
                    if (isNaN(n))
                    {
                        return CalcErrorsValue
                    }
                    var from_unit = CalcConvert.S(args[1]);
                    var to_unit = CalcConvert.S(args[2]);
                    if (!from_unit || from_unit === "" || !to_unit || to_unit === "")
                    {
                        return CalcErrorsNotAvailable
                    }
                    else if ((from_unit.localeCompare("C") === 0 || from_unit.localeCompare("cel") === 0) && (to_unit.localeCompare("C") === 0) || to_unit.localeCompare("cel") === 0)
                    {
                        return n
                    }
                    else if ((from_unit.localeCompare("F") === 0 || from_unit.localeCompare("fah") === 0) && (to_unit.localeCompare("F") === 0 || to_unit.localeCompare("fah") === 0))
                    {
                        return n
                    }
                    else if ((from_unit.localeCompare("K") === 0 || from_unit.localeCompare("kel") === 0) && (to_unit.localeCompare("K") === 0 || to_unit.localeCompare("kel") === 0))
                    {
                        return n
                    }
                    else if ((from_unit.localeCompare("C") === 0 || from_unit.localeCompare("cel") === 0) && (to_unit.localeCompare("F") === 0 || to_unit.localeCompare("fah") === 0))
                    {
                        return n * 9 / 5 + 32
                    }
                    else if ((from_unit.localeCompare("F") === 0 || from_unit.localeCompare("fah") === 0) && (to_unit.localeCompare("C") === 0 || to_unit.localeCompare("cel") === 0))
                    {
                        return (n - 32) * 5 / 9
                    }
                    else if ((from_unit.localeCompare("F") === 0 || from_unit.localeCompare("fah") === 0) && (to_unit.localeCompare("F") === 0 || to_unit.localeCompare("fah") === 0))
                    {
                        return n
                    }
                    else if ((from_unit.localeCompare("F") === 0 || from_unit.localeCompare("fah") === 0) && (to_unit.localeCompare("K") === 0 || to_unit.localeCompare("kel") === 0))
                    {
                        return (n - 32) * 5 / 9 + C_K_offset
                    }
                    else if ((from_unit.localeCompare("K") === 0 || from_unit.localeCompare("kel") === 0) && (to_unit.localeCompare("F") === 0 || to_unit.localeCompare("fah") === 0))
                    {
                        return (n - C_K_offset) * 9 / 5 + 32
                    }
                    else if ((from_unit.localeCompare("C") === 0 || from_unit.localeCompare("cel") === 0) && (to_unit.localeCompare("K") === 0 || to_unit.localeCompare("kel") === 0))
                    {
                        return n + C_K_offset
                    }
                    else if ((from_unit.localeCompare("K") === 0 || from_unit.localeCompare("kel") === 0) && (to_unit.localeCompare("C") === 0 || to_unit.localeCompare("cel") === 0))
                    {
                        return n - C_K_offset
                    }
                    if (_convert(_weight_units, _prefixes, from_unit, to_unit, n))
                    {
                        return _v
                    }
                    if (_convert(_distance_units, _prefixes, from_unit, to_unit, n))
                    {
                        return _v
                    }
                    if (_convert(_time_units, keyword_null, from_unit, to_unit, n))
                    {
                        return _v
                    }
                    if (_convert(_pressure_units, _prefixes, from_unit, to_unit, n))
                    {
                        return _v
                    }
                    if (_convert(_force_units, _prefixes, from_unit, to_unit, n))
                    {
                        return _v
                    }
                    if (_convert(_energy_units, _prefixes, from_unit, to_unit, n))
                    {
                        return _v
                    }
                    if (_convert(_power_units, _prefixes, from_unit, to_unit, n))
                    {
                        return _v
                    }
                    if (_convert(_magnetism_units, _prefixes, from_unit, to_unit, n))
                    {
                        return _v
                    }
                    if (_convert(_liquid_units, _prefixes, from_unit, to_unit, n))
                    {
                        return _v
                    }
                    if (_convert(_magnetism_units, _prefixes, from_unit, to_unit, n))
                    {
                        return _v
                    }
                    return CalcErrorsNotAvailable
                }
                function eg_besseli(args)
                {
                    var x = CalcConvert.D(args[0]);
                    if (isNaN(x))
                    {
                        return CalcErrorsValue
                    }
                    var n = CalcConvert.I(args[1]);
                    if (isNaN(n))
                    {
                        return CalcErrorsValue
                    }
                    if (n < 0)
                    {
                        return CalcErrorsNumber
                    }
                    return CalcConvert.toResult(_bessel(x, n, true))
                }
                function eg_besselj(args)
                {
                    var x = CalcConvert.D(args[0]);
                    if (isNaN(x))
                    {
                        return CalcErrorsValue
                    }
                    var n = CalcConvert.I(args[1]);
                    if (isNaN(n))
                    {
                        return CalcErrorsValue
                    }
                    if (n < 0)
                    {
                        return CalcErrorsNumber
                    }
                    return CalcConvert.toResult(_bessel(x, n, false))
                }
                function eg_besselk(args)
                {
                    var x = CalcConvert.D(args[0]);
                    if (isNaN(x))
                    {
                        return CalcErrorsValue
                    }
                    var n = CalcConvert.I(args[1]);
                    if (isNaN(n))
                    {
                        return CalcErrorsValue
                    }
                    if (x <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (n < 0)
                    {
                        return CalcErrorsNumber
                    }
                    return CalcConvert.toResult(_kn(n, x))
                }
                function eg_bessely(args)
                {
                    var x = CalcConvert.D(args[0]);
                    if (isNaN(x))
                    {
                        return CalcErrorsValue
                    }
                    var n = CalcConvert.I(args[1]);
                    if (isNaN(n))
                    {
                        return CalcErrorsValue
                    }
                    if (x <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (n < 0)
                    {
                        return CalcErrorsNumber
                    }
                    return CalcConvert.toResult(_yn(n, x))
                }
                function eg_bin2dec(args)
                {
                    var number = CalcConvert.S(args[0]);
                    var result;
                    if (number.length > 10)
                    {
                        return CalcErrorsNumber
                    }
                    result = _stringToLong(number, 2);
                    if (result.length < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    return result
                }
                function eg_bin2hex(args)
                {
                    var number = CalcConvert.S(args[0]);
                    var places = Calc._Helper._argumentExists(args, 1) ? CalcConvert.I(args[1]) : 1;
                    var temp;
                    var result;
                    if (number.length > 10)
                    {
                        return CalcErrorsNumber
                    }
                    if (places < 1 || 10 < places)
                    {
                        return CalcErrorsNumber
                    }
                    temp = _stringToLong(number, 2);
                    if (temp.length < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    result = _longToString(temp, 16, places);
                    if (places < result.length && 0 <= temp && Calc._Helper._argumentExists(args, 1))
                    {
                        return CalcErrorsNumber
                    }
                    return result
                }
                function eg_bin2oct(args)
                {
                    var number = CalcConvert.S(args[0]);
                    var places = Calc._Helper._argumentExists(args, 1) ? CalcConvert.I(args[1]) : 1;
                    var temp;
                    var result;
                    if (10 < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    if (places < 1 || 10 < places)
                    {
                        return CalcErrorsNumber
                    }
                    temp = _stringToLong(number, 2);
                    if (temp.length < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    result = _longToString(temp, 8, places);
                    if (0 <= temp && places < result.length && Calc._Helper._argumentExists(args, 1))
                    {
                        return CalcErrorsNumber
                    }
                    return result
                }
                function eg_dec2bin(args)
                {
                    var number = CalcConvert.D(args[0]);
                    var places = Calc._Helper._argumentExists(args, 1) ? CalcConvert.I(args[1]) : 1;
                    var result;
                    if (number < -512 || 511 < number)
                    {
                        return CalcErrorsNumber
                    }
                    if (places < 1 || 10 < places)
                    {
                        return CalcErrorsNumber
                    }
                    result = _longToString(number, 2, places);
                    if (0 <= result && places < result.length && Calc._Helper._argumentExists(args, 1))
                    {
                        return CalcErrorsNumber
                    }
                    return result
                }
                function eg_dec2hex(args)
                {
                    var number = CalcConvert.D(args[0]);
                    var places = Calc._Helper._argumentExists(args, 1) ? CalcConvert.I(args[1]) : 1;
                    var result;
                    if (number < -549755813888 || 549755813887 < number)
                    {
                        return CalcErrorsNumber
                    }
                    if (places < 1 || 10 < places)
                    {
                        return CalcErrorsNumber
                    }
                    result = _longToString(number, 16, places);
                    if (0 <= result && places < result.length && Calc._Helper._argumentExists(args, 1))
                    {
                        return CalcErrorsNumber
                    }
                    return result
                }
                function eg_dex2oct(args)
                {
                    var number = CalcConvert.D(args[0]);
                    var places = Calc._Helper._argumentExists(args, 1) ? CalcConvert.I(args[1]) : 1;
                    var result;
                    if (number < -536870912 || 536870911 < number)
                    {
                        return CalcErrorsNumber
                    }
                    if (places < 1 || 10 < places)
                    {
                        return CalcErrorsNumber
                    }
                    result = _longToString(number, 8, places);
                    if (0 <= result && places < result.length && Calc._Helper._argumentExists(args, 1))
                    {
                        return CalcErrorsNumber
                    }
                    return result
                }
                function eg_hex2bin(args)
                {
                    var number = CalcConvert.S(args[0]);
                    var places = Calc._Helper._argumentExists(args, 1) ? CalcConvert.I(args[1]) : 1;
                    var temp;
                    var result;
                    if (10 < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    if (places < 1 || 10 < places)
                    {
                        return CalcErrorsNumber
                    }
                    temp = _stringToLong(number.toLowerCase(), 16);
                    if (temp.length < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    if (temp < -512 || 511 < temp)
                    {
                        return CalcErrorsNumber
                    }
                    result = _longToString(temp, 2, places);
                    if (0 <= temp && places < result.length && Calc._Helper._argumentExists(args, 1))
                    {
                        return CalcErrorsNumber
                    }
                    return result
                }
                function eg_hex2dec(args)
                {
                    var number = CalcConvert.S(args[0]);
                    var result;
                    if (10 < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    result = _stringToLong(number.toLowerCase(), 16);
                    if (result.length < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    return CalcConvert.toResult(result)
                }
                function eg_hex2oct(args)
                {
                    var number = CalcConvert.S(args[0]);
                    var places = Calc._Helper._argumentExists(args, 1) ? CalcConvert.I(args[1]) : 1;
                    var temp;
                    var result;
                    if (10 < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    if (places < 1 || 10 < places)
                    {
                        return CalcErrorsNumber
                    }
                    temp = _stringToLong(number, 16);
                    if (temp.length < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    if (temp < -536870912 || 536870911 < temp)
                    {
                        return CalcErrorsNumber
                    }
                    result = _longToString(temp, 8, places);
                    if (0 <= temp && places < result.length && Calc._Helper._argumentExists(args, 1))
                    {
                        return CalcErrorsNumber
                    }
                    return result
                }
                function eg_oct2bin(args)
                {
                    var number = CalcConvert.S(args[0]);
                    var places = Calc._Helper._argumentExists(args, 1) ? CalcConvert.I(args[1]) : 1;
                    var temp;
                    var result;
                    if (10 < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    if (places < 1 || 10 < places)
                    {
                        return CalcErrorsNumber
                    }
                    temp = _stringToLong(number, 8);
                    if (temp.length < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    if (temp < -512 || 511 < temp)
                    {
                        return CalcErrorsNumber
                    }
                    result = _longToString(temp, 2, places);
                    if (0 <= temp && places < result.length && Calc._Helper._argumentExists(args, 1))
                    {
                        return CalcErrorsNumber
                    }
                    return result
                }
                function eg_oct2dec(args)
                {
                    var number = CalcConvert.S(args[0]);
                    var result;
                    if (10 < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    result = _stringToLong(number, 8);
                    if (result.length < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    return CalcConvert.toResult(result)
                }
                function eg_oct2hex(args)
                {
                    var number = CalcConvert.S(args[0]);
                    var places = Calc._Helper._argumentExists(args, 1) ? CalcConvert.I(args[1]) : 1;
                    var temp;
                    var result;
                    if (10 < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    if (places < 1 || 10 < places)
                    {
                        return CalcErrorsNumber
                    }
                    temp = _stringToLong(number, 8);
                    if (temp.length < number.length)
                    {
                        return CalcErrorsNumber
                    }
                    if (temp < -549755813888 || 549755813887 < temp)
                    {
                        return CalcErrorsNumber
                    }
                    result = _longToString(temp, 16, places);
                    if (0 <= temp && places < result.length && Calc._Helper._argumentExists(args, 1))
                    {
                        return CalcErrorsNumber
                    }
                    return result
                }
                function eg_erf(args)
                {
                    var lower = CalcConvert.D(args[0]);
                    if (isNaN(lower))
                    {
                        return CalcErrorsValue
                    }
                    var upper = 0.0;
                    if (Calc._Helper._argumentExists(args, 1))
                    {
                        upper = CalcConvert.D(args[1]);
                        if (isNaN(upper))
                        {
                            return CalcErrorsValue
                        }
                    }
                    var ans;
                    var val = Functions._StatHelper.st_normsdist([lower * Math_sqrt(2)]);
                    if (typeof val === typeof Calc.Errors)
                    {
                        return NaN
                    }
                    ans = parseFloat(val) * 2 - 1;
                    if (Calc._Helper._argumentExists(args, 1))
                    {
                        val = Functions._StatHelper.st_normsdist([upper * Math_sqrt(2)]);
                        if (typeof val === typeof Calc.Errors)
                        {
                            return NaN
                        }
                        var x = parseFloat(val) * 2 - 1;
                        ans = x - ans
                    }
                    return ans
                }
                function eg_erfc(args)
                {
                    var x = CalcConvert.D(args[0]);
                    if (isNaN(x))
                    {
                        return CalcErrorsValue
                    }
                    var val = eg_erf([x]);
                    if (typeof val === typeof Calc.Errors)
                    {
                        return NaN
                    }
                    return 1.0 - parseFloat(val)
                }
                function eg_erf_precise(args)
                {
                    var lower = CalcConvert.D(args[0]);
                    if (isNaN(lower))
                    {
                        return CalcErrorsValue
                    }
                    return eg_erf([lower])
                }
                function eg_delta(args)
                {
                    var num1 = CalcConvert.D(args[0]);
                    if (isNaN(num1))
                    {
                        return CalcErrorsValue
                    }
                    var num2 = 0.0;
                    if (Calc._Helper._argumentExists(args, 1))
                    {
                        num2 = CalcConvert.D(args[1]);
                        if (isNaN(num2))
                        {
                            return CalcErrorsValue
                        }
                    }
                    return Functions._MathHelper.approxEqual(num1, num2) ? 1 : 0
                }
                function eg_gestep(args)
                {
                    var num = CalcConvert.D(args[0]);
                    if (isNaN(num))
                    {
                        return CalcErrorsValue
                    }
                    var step = 0.0;
                    if (Calc._Helper._argumentExists(args, 1))
                    {
                        step = CalcConvert.D(args[1]);
                        if (isNaN(step))
                        {
                            return CalcErrorsValue
                        }
                    }
                    return num >= step ? 1 : 0
                }
                function eg_complex(args)
                {
                    var real = CalcConvert.D(args[0]);
                    var imag = CalcConvert.D(args[1]);
                    if (isNaN(real) || isNaN(imag))
                    {
                        return CalcErrorsValue
                    }
                    var suffix = Calc._Helper._argumentExists(args, 2) ? CalcConvert.S(args[2]) : "i";
                    if (suffix !== "i" && suffix !== "j")
                    {
                        return CalcErrorsValue
                    }
                    return ComplexConvert._toResult(new Complex(real, imag), suffix)
                }
                function eg_imabs(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    var x = num.real();
                    var y = num.imag();
                    return CalcConvert.toResult(Math_sqrt(x * x + y * y))
                }
                function eg_imaginary(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    return CalcConvert.toResult(num.imag())
                }
                function eg_imargument(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    var x = num.real();
                    var y = num.imag();
                    if (x === 0.0 && y === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(Math_atan2(y, x))
                }
                function eg_imconjugate(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    var x = num.real();
                    var y = num.imag();
                    return ComplexConvert._toResult(new Complex(x, -y))
                }
                function eg_imcos(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    var x = num.real();
                    var y = num.imag();
                    return ComplexConvert._toResult(new Complex(Math_cos(x) * Functions._MathHelper.cosh(y), -Math_sin(x) * Functions._MathHelper.sinh(y)))
                }
                function eg_imdiv(args)
                {
                    var num0 = ComplexConvert._toComplex(args[0]);
                    var num1 = ComplexConvert._toComplex(args[1]);
                    if (!num0 || !num1)
                    {
                        return CalcErrorsNumber
                    }
                    var a = num0.real();
                    var b = num0.imag();
                    var c = num1.real();
                    var d = num1.imag();
                    if (c === 0.0 && d === 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    return ComplexConvert._toResult(new Complex((a * c + b * d) / (c * c + d * d), (b * c - a * d) / (c * c + d * d)))
                }
                function eg_imexp(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    var x = num.real();
                    var y = num.imag();
                    return ComplexConvert._toResult(new Complex(Math_exp(x) * Math_cos(y), Math_exp(x) * Math_sin(y)))
                }
                function eg_imln(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    var x = num.real();
                    var y = num.imag();
                    if (x === 0.0 && y === 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    var abs = Math_sqrt(x * x + y * y);
                    var phi = Math_atan2(y, x);
                    return ComplexConvert._toResult(new Complex(Math_log(abs), phi))
                }
                function eg_imlog10(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    var x = num.real();
                    var y = num.imag();
                    if (x === 0.0 && y === 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    var abs = Math_sqrt(x * x + y * y);
                    var phi = Math_atan2(y, x);
                    var log10e = Functions._MathHelper.log10(Math_E);
                    return ComplexConvert._toResult(new Complex(log10e * Math_log(abs), log10e * phi))
                }
                function eg_imlog2(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    var x = num.real();
                    var y = num.imag();
                    if (x === 0.0 && y === 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    var abs = Math_sqrt(x * x + y * y);
                    var phi = Math_atan2(y, x);
                    var log2e = Functions._MathHelper.log(Math_E, 2);
                    return ComplexConvert._toResult(new Complex(log2e * Math_log(abs), log2e * phi))
                }
                function eg_impower(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    var pow = parseFloat(args[1]);
                    if (isNaN(pow))
                    {
                        return CalcErrorsValue
                    }
                    var x = num.real();
                    var y = num.imag();
                    if (x === 0.0 && y === 0.0)
                    {
                        if (pow > 0.0)
                        {
                            return ComplexConvert._toResult(new Complex(0.0, 0.0))
                        }
                        else
                        {
                            return CalcErrorsNumber
                        }
                    }
                    var abs = Math_sqrt(x * x + y * y);
                    var phi = Math_atan2(y, x);
                    return ComplexConvert._toResult(new Complex(Math_pow(abs, pow) * Math_cos(pow * phi), Math_pow(abs, pow) * Math_sin(pow * phi)))
                }
                function eg_improduct(args)
                {
                    var real = 1.0;
                    var imag = 0.0;
                    var num,
                        a,
                        b,
                        c,
                        d;
                    for (var i = 0; i < args.length; i++)
                    {
                        if (args[i].constructor === Calc.CalcArray)
                        {
                            var array = args[i];
                            for (var j = 0; j < array.rowCount; j++)
                            {
                                for (var k = 0; k < array.columnCount; k++)
                                {
                                    num = ComplexConvert._toComplex(array.getValue(j, k));
                                    if (!num)
                                    {
                                        return CalcErrorsNumber
                                    }
                                    a = real;
                                    b = imag;
                                    c = num.real();
                                    d = num.imag();
                                    real = a * c - b * d;
                                    imag = a * d + b * c
                                }
                            }
                        }
                        else if (CalcConvert.ref(args[i]))
                        {
                            var ref = args[i];
                            for (var area = 0; area < ref.getRangeCount(); area++)
                            {
                                for (var j = 0; j < ref.getRowCount(area); j++)
                                {
                                    for (var k = 0; k < ref.getColumnCount(area); k++)
                                    {
                                        num = ComplexConvert._toComplex(ref.getValue(area, j, k));
                                        if (!num)
                                        {
                                            return CalcErrorsNumber
                                        }
                                        a = real;
                                        b = imag;
                                        c = num.real();
                                        d = num.imag();
                                        real = a * c - b * d;
                                        imag = a * d + b * c
                                    }
                                }
                            }
                        }
                        else
                        {
                            num = ComplexConvert._toComplex(args[i]);
                            if (!num)
                            {
                                return CalcErrorsNumber
                            }
                            a = real;
                            b = imag;
                            c = num.real();
                            d = num.imag();
                            real = a * c - b * d;
                            imag = a * d + b * c
                        }
                    }
                    return ComplexConvert._toResult(new Complex(real, imag))
                }
                function eg_imreal(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    return CalcConvert.toResult(num.real())
                }
                function eg_imsin(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    var x = num.real();
                    var y = num.imag();
                    return ComplexConvert._toResult(new Complex(Math_sin(x) * Functions._MathHelper.cosh(y), Math_cos(x) * Functions._MathHelper.sinh(y)))
                }
                function eg_imsqrt(args)
                {
                    var num = ComplexConvert._toComplex(args[0]);
                    if (!num)
                    {
                        return CalcErrorsNumber
                    }
                    var x = num.real();
                    var y = num.imag();
                    if (x === 0.0 && y === 0.0)
                    {
                        return ComplexConvert._toResult(new Complex(0.0, 0.0))
                    }
                    var abs = Math_sqrt(x * x + y * y);
                    var phi = Math_atan2(y, x);
                    return ComplexConvert._toResult(new Complex(Math_sqrt(abs) * Math_cos(phi / 2.0), Math_sqrt(abs) * Math_sin(phi / 2.0)))
                }
                function eg_imsub(args)
                {
                    var num0 = ComplexConvert._toComplex(args[0]);
                    var num1 = ComplexConvert._toComplex(args[1]);
                    if (!num0 || !num1)
                    {
                        return CalcErrorsNumber
                    }
                    var a = num0.real();
                    var b = num0.imag();
                    var c = num1.real();
                    var d = num1.imag();
                    return ComplexConvert._toResult(new Complex(a - c, b - d))
                }
                function eg_imsum(args)
                {
                    var real = 0.0;
                    var imag = 0.0;
                    var num,
                        a,
                        b,
                        c,
                        d;
                    for (var i = 0; i < args.length; i++)
                    {
                        if (CalcConvert.arr(args[i]))
                        {
                            var array = args[i];
                            for (var j = 0; j < array.rowCount; j++)
                            {
                                for (var k = 0; k < array.columnCount; k++)
                                {
                                    num = ComplexConvert._toComplex(array.getValue(j, k));
                                    if (!num)
                                    {
                                        return CalcErrorsNumber
                                    }
                                    a = real;
                                    b = imag;
                                    c = num.real();
                                    d = num.imag();
                                    real = a + c;
                                    imag = b + d
                                }
                            }
                        }
                        else if (CalcConvert.ref(args[i]))
                        {
                            var ref = args[i];
                            for (var area = 0; area < ref.getRangeCount(); area++)
                            {
                                for (var j = 0; j < ref.getRowCount(area); j++)
                                {
                                    for (var k = 0; k < ref.getColumnCount(area); k++)
                                    {
                                        num = ComplexConvert._toComplex(ref.getValue(area, j, k));
                                        if (!num)
                                        {
                                            return CalcErrorsNumber
                                        }
                                        a = real;
                                        b = imag;
                                        c = num.real();
                                        d = num.imag();
                                        real = a + c;
                                        imag = b + d
                                    }
                                }
                            }
                        }
                        else
                        {
                            num = ComplexConvert._toComplex(args[i]);
                            if (!num)
                            {
                                return CalcErrorsNumber
                            }
                            a = real;
                            b = imag;
                            c = num.real();
                            d = num.imag();
                            real = a + c;
                            imag = b + d
                        }
                    }
                    return ComplexConvert._toResult(new Complex(real, imag))
                }
                Functions.def("BESSELI", eg_besseli, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("BESSELJ", eg_besselj, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("BESSELK", eg_besselk, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("BESSELY", eg_bessely, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("BIN2DEC", eg_bin2dec, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("BIN2HEX", eg_bin2hex, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne
                });
                Functions.def("BIN2OCT", eg_bin2oct, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne
                });
                Functions.def("DEC2BIN", eg_dec2bin, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne
                });
                Functions.def("DEC2HEX", eg_dec2hex, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne
                });
                Functions.def("DEC2OCT", eg_dex2oct, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne
                });
                Functions.def("HEX2BIN", eg_hex2bin, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne
                });
                Functions.def("HEX2DEC", eg_hex2dec, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("HEX2OCT", eg_hex2oct, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne
                });
                Functions.def("OCT2BIN", eg_oct2bin, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne
                });
                Functions.def("OCT2DEC", eg_oct2dec, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("OCT2HEX", eg_oct2hex, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne
                });
                Functions.def("ERF", eg_erf, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne
                });
                Functions.def("ERF.PRECISE", eg_erf_precise, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("ERFC", eg_erfc, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("ERFC.PRECISE", eg_erfc, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("DELTA", eg_delta, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne
                });
                Functions.def("GESTEP", eg_gestep, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne
                });
                Functions.def("COMPLEX", eg_complex, {
                    minArgs: 2, maxArgs: 3, acceptsMissingArgument: Functions.acceptsTwo
                });
                Functions.def("IMABS", eg_imabs, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("IMAGINARY", eg_imaginary, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("IMARGUMENT", eg_imargument, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("IMCONJUGATE", eg_imconjugate, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("IMCOS", eg_imcos, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("IMDIV", eg_imdiv, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("IMEXP", eg_imexp, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("IMLN", eg_imln, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("IMLOG10", eg_imlog10, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("IMLOG2", eg_imlog2, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("IMPOWER", eg_impower, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("IMPRODUCT", eg_improduct, {
                    minArgs: 1, maxArgs: 255, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny
                });
                Functions.def("IMREAL", eg_imreal, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("IMSIN", eg_imsin, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("IMSQRT", eg_imsqrt, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("IMSUB", eg_imsub, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("IMSUM", eg_imsum, {
                    minArgs: 1, maxArgs: 255, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny
                });
                Functions.def("CONVERT", eg_convert, {
                    minArgs: 3, maxArgs: 3
                })
            })(Calc.Functions || (Calc.Functions = {}));
            var Functions = Calc.Functions
        })(Sheets.Calc || (Sheets.Calc = {}));
        var Calc = Sheets.Calc
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}));
var GcSpread;
(function(GcSpread)
{
    (function(Sheets)
    {
        (function(Calc)
        {
            (function(Functions)
            {
                Sheets.feature("calc.functions_fin", ["calc.functions"]);
                var keyword_null = null,
                    CalcConvert = Calc.Convert,
                    Math_pow = Math.pow,
                    Math_abs = Math.abs,
                    Math_ceil = Math.ceil,
                    Math_log = Math.log,
                    Math_sqrt = Math.sqrt,
                    Math_floor = Math.floor,
                    Math_max = Math.max,
                    Math_min = Math.min;
                var CalcErrors = Calc.Errors,
                    CalcErrorsNull = CalcErrors.Null,
                    CalcErrorsDivideByZero = CalcErrors.DivideByZero,
                    CalcErrorsValue = CalcErrors.Value,
                    CalcErrorsReference = CalcErrors.Reference,
                    CalcErrorsName = CalcErrors.Name,
                    CalcErrorsNotAvailable = CalcErrors.NotAvailable,
                    CalcErrorsNumber = CalcErrors.Number;
                var __isLeapYear = Functions._FinancialHelper.__isLeapYear;
                var __compareDateTime = Functions._FinancialHelper.__compareDateTime;
                var __annual_year_basis = Functions._FinancialHelper.__annual_year_basis;
                var __getDaysInMonth = Functions._FinancialHelper.__getDaysInMonth;
                var __Days_Between_BASIS_30E_360 = Functions._FinancialHelper.__Days_Between_BASIS_30E_360;
                var __Days_Between_BASIS_30Ep_360 = Functions._FinancialHelper.__Days_Between_BASIS_30Ep_360;
                var __Days_Between_BASIS_MSRB_30_360_SYM = Functions._FinancialHelper.__Days_Between_BASIS_MSRB_30_360_SYM;
                var __Days_Between_BASIS_MSRB_30_360 = Functions._FinancialHelper.__Days_Between_BASIS_MSRB_30_360;
                var __days_between_basis = Functions._FinancialHelper.__days_between_basis;
                function __toOADate(date)
                {
                    if (date instanceof Date)
                    {
                        return Functions._FinancialHelper.__toOADate(date)
                    }
                    return date
                }
                function __days_monthly_basis(date_i, date_m, basis)
                {
                    var issue_day,
                        issue_month,
                        issue_year;
                    var maturity_day,
                        maturity_month,
                        maturity_year;
                    var months,
                        days,
                        years;
                    var leap_year;
                    var maturity,
                        issue;
                    issue_year = date_i.getFullYear();
                    issue_month = date_i.getMonth();
                    issue_day = date_i.getDate();
                    maturity_year = date_m.getFullYear();
                    maturity_month = date_m.getMonth();
                    maturity_day = date_m.getDate();
                    years = maturity_year - issue_year;
                    months = maturity_month - issue_month;
                    days = maturity_day - issue_day;
                    months = years * 12 + months;
                    leap_year = __isLeapYear(issue_year);
                    switch (basis)
                    {
                        case 0:
                            var list = [];
                            list[0] = date_i;
                            list[1] = date_m;
                            return Functions._DateHelper.days360(list);
                        case 1:
                        case 2:
                        case 3:
                            issue = __toOADate(date_i);
                            maturity = __toOADate(date_m);
                            return maturity - issue;
                        case 4:
                            return months * 30 + days;
                        default:
                            return -1
                    }
                }
                function __getRmz(fZins, fZzr, fBw, fZw, nF)
                {
                    var fRmz;
                    if (fZins === 0.0)
                    {
                        fRmz = (fBw + fZw) / fZzr
                    }
                    else
                    {
                        var fTerm = Math_pow(1.0 + fZins, fZzr);
                        if (nF > 0)
                        {
                            fRmz = (fZw * fZins / (fTerm - 1.0) + fBw * fZins / (1.0 - 1.0 / fTerm)) / (1.0 + fZins)
                        }
                        else
                        {
                            fRmz = fZw * fZins / (fTerm - 1.0) + fBw * fZins / (1.0 - 1.0 / fTerm)
                        }
                    }
                    return -fRmz
                }
                function __getZw(fZins, fZzr, fRmz, fBw, nF)
                {
                    var fZw;
                    if (fZins === 0.0)
                    {
                        fZw = fBw + fRmz * fZzr
                    }
                    else
                    {
                        var fTerm = Math_pow(1.0 + fZins, fZzr);
                        if (nF > 0)
                        {
                            fZw = fBw * fTerm + fRmz * (1.0 + fZins) * (fTerm - 1.0) / fZins
                        }
                        else
                        {
                            fZw = fBw * fTerm + fRmz * (fTerm - 1.0) / fZins
                        }
                    }
                    return -fZw
                }
                function __calculate_pvif(rate, nper)
                {
                    var ret = (Math_pow(1.0 + rate, nper));
                    if (isNaN(ret) || !isFinite(ret))
                    {
                        return CalcErrorsNumber
                    }
                    return ret
                }
                function __calculate_fvifa(rate, nper)
                {
                    if (rate === 0.0)
                    {
                        return nper
                    }
                    else
                    {
                        var x = Math_pow(1.0 + rate, nper);
                        var y = x - 1.0;
                        var ret = y / rate;
                        if (isNaN(ret) || !isFinite(ret))
                        {
                            return CalcErrorsNumber
                        }
                        return ret
                    }
                }
                function __calculate_pmt(rate, nper, pv, fv, type)
                {
                    var pvif,
                        fvifa;
                    pvif = __calculate_pvif(rate, nper);
                    fvifa = __calculate_fvifa(rate, nper);
                    var x = -pv * pvif - fv;
                    var y = 1.0 + rate * CalcConvert.D(type);
                    var z = y * fvifa;
                    var ret = x / z;
                    if (isNaN(ret) || !isFinite(ret))
                    {
                        return CalcErrorsNumber
                    }
                    return ret
                }
                function __calculate_interest_part(pv, pmt, rate, per)
                {
                    var x = Math_pow(1.0 + rate, per);
                    var y = x - 1.0;
                    var ret = -(pv * x * rate + pmt * y);
                    if (isNaN(ret) || !isFinite(ret))
                    {
                        return CalcErrorsNumber
                    }
                    return ret
                }
                function __coup_cd(settlement, maturity, freq, next)
                {
                    var months,
                        periods;
                    var is_eom_special;
                    var result = new Date(1, 0, 1);
                    result.setFullYear(1);
                    var ndays = 0;
                    is_eom_special = (maturity.getDate() === __getDaysInMonth(maturity.getFullYear(), maturity.getMonth()));
                    months = 12 / freq;
                    periods = (maturity.getFullYear() - settlement.getFullYear());
                    if (periods > 0)
                    {
                        periods = (periods - 1) * freq
                    }
                    do
                    {
                        result = new Date(maturity.getFullYear(), maturity.getMonth(), maturity.getDate());
                        periods++;
                        result.setMonth(result.getMonth() - (periods * months));
                        if (is_eom_special)
                        {
                            ndays = __getDaysInMonth(result.getFullYear(), result.getMonth());
                            result = new Date(result.getFullYear(), result.getMonth(), ndays)
                        }
                    } while (__compareDateTime(settlement, result) < 0);
                    if (next)
                    {
                        result = new Date(maturity.getFullYear(), maturity.getMonth(), maturity.getDate());
                        periods--;
                        result.setMonth(result.getMonth() - (periods * months));
                        if (is_eom_special)
                        {
                            ndays = __getDaysInMonth(result.getFullYear(), result.getMonth());
                            result = new Date(result.getFullYear(), result.getMonth(), ndays)
                        }
                    }
                    return result
                }
                function __coupdaybs(settlement, maturity, freq, basis)
                {
                    var prev_coupon = __coup_cd(settlement, maturity, freq, false);
                    return __days_between_basis(prev_coupon, settlement, basis)
                }
                function __coupdays(settlement, maturity, freq, basis)
                {
                    var prev,
                        next;
                    switch (basis)
                    {
                        case 0:
                        case 2:
                        case 4:
                        case 5:
                            return 360 / freq;
                        case 3:
                            return 365.0 / freq;
                        default:
                            next = __coup_cd(settlement, maturity, freq, true);
                            prev = __coup_cd(settlement, maturity, freq, false);
                            return __days_between_basis(prev, next, 1)
                    }
                }
                function __coupdaysnc(settlement, maturity, freq, basis)
                {
                    var next_coupon = __coup_cd(settlement, maturity, freq, true);
                    return __days_between_basis(settlement, next_coupon, basis)
                }
                function __coupncd(settlement, maturity, freq)
                {
                    var date = __coup_cd(settlement, maturity, freq, true);
                    return __toOADate(date)
                }
                function __coupnum(settlement, maturity, freq)
                {
                    var months;
                    var coupondate = new Date(maturity.getFullYear(), maturity.getMonth(), maturity.getDate());
                    months = maturity.getMonth() - settlement.getMonth() + 12 * (maturity.getFullYear() - settlement.getFullYear());
                    coupondate.setMonth(coupondate.getMonth() - months);
                    if (maturity.getDate() === __getDaysInMonth(maturity.getFullYear(), maturity.getMonth()))
                    {
                        while (coupondate.getDate() !== __getDaysInMonth(coupondate.getFullYear(), coupondate.getMonth()))
                        {
                            coupondate.setDate(coupondate.getDate() + 1.0)
                        }
                    }
                    if (settlement.getDate() >= coupondate.getDate())
                    {
                        months--
                    }
                    return parseInt((1 + months / (12 / freq)).toString(), 10)
                }
                function __couppcd(settlement, maturity, freq)
                {
                    var date = __coup_cd(settlement, maturity, freq, false);
                    return __toOADate(date)
                }
                function __duration(nSettle, nMat, fCoup, fYield, nFreq, nBase, fNumOfCoups)
                {
                    var fDur = 0.0;
                    var t,
                        p = 0.0;
                    var f100 = 100.0;
                    fCoup *= f100 / Calc.Convert.D(nFreq);
                    fYield /= nFreq;
                    fYield += 1.0;
                    for (t = 1.0; t < fNumOfCoups; t++)
                    {
                        fDur += t * (fCoup) / Math_pow(fYield, t)
                    }
                    fDur += fNumOfCoups * (fCoup + f100) / Math_pow(fYield, fNumOfCoups);
                    for (t = 1.0; t < fNumOfCoups; t++)
                    {
                        p += fCoup / Math_pow(fYield, t)
                    }
                    p += (fCoup + f100) / Math_pow(fYield, fNumOfCoups);
                    fDur /= p;
                    fDur /= Calc.Convert.D(nFreq);
                    return (fDur)
                }
                function __goal_seek_initialise(data)
                {
                    data.havexpos = data.havexneg = false;
                    data.xmin = -1.0e10;
                    data.xmax = +1.0e10;
                    data.precision = 1.0e-10;
                    return data
                }
                function __update_data(x, y, data)
                {
                    if (y > 0)
                    {
                        if (data.havexpos)
                        {
                            if (data.havexneg)
                            {
                                if (Math_abs(x - data.xneg) < Math_abs(data.xpos - data.xneg))
                                {
                                    data.xpos = x;
                                    data.ypos = y
                                }
                            }
                            else if (y < data.ypos)
                            {
                                data.xpos = x;
                                data.ypos = y
                            }
                        }
                        else
                        {
                            data.xpos = x;
                            data.ypos = y;
                            data.havexpos = true
                        }
                        return [false, data]
                    }
                    else if (y < 0)
                    {
                        if (data.havexneg)
                        {
                            if (data.havexpos)
                            {
                                if (Math_abs(x - data.xpos) < Math_abs(data.xpos - data.xneg))
                                {
                                    data.xneg = x;
                                    data.yneg = y
                                }
                            }
                            else if (-y < -data.yneg)
                            {
                                data.xneg = x;
                                data.yneg = y
                            }
                        }
                        else
                        {
                            data.xneg = x;
                            data.yneg = y;
                            data.havexneg = true
                        }
                        return [false, data]
                    }
                    else
                    {
                        data.root = x;
                        return [true, data]
                    }
                }
                function __price(settlement, maturity, rate, yieldParam, redemption, freq, basis)
                {
                    var a,
                        d,
                        e,
                        sum,
                        den,
                        based,
                        exponent,
                        first_term,
                        last_term;
                    var k,
                        n;
                    a = __coupdaybs(settlement, maturity, freq, basis);
                    d = __coupdaysnc(settlement, maturity, freq, basis);
                    e = __coupdays(settlement, maturity, freq, basis);
                    n = parseInt((__coupnum(settlement, maturity, freq)).toString(), 10);
                    sum = 0.0;
                    den = 100.0 * rate / freq;
                    based = 1.0 + yieldParam / freq;
                    exponent = d / e;
                    for (k = 0; k < n; k++)
                    {
                        sum += den / Math_pow(based, exponent + k)
                    }
                    first_term = redemption / Math_pow(based, (n - 1.0 + d / e));
                    last_term = a / e * den;
                    return (first_term + sum - last_term)
                }
                function __date_ratio(d1, d2, d3, freq, basis)
                {
                    var next_coupon,
                        prev_coupon;
                    var res;
                    next_coupon = __coup_cd(d1, d3, freq, true);
                    prev_coupon = __coup_cd(d1, d3, freq, false);
                    if (__compareDateTime(next_coupon, d2) >= 0)
                    {
                        return __days_between_basis(d1, d2, basis) / __coupdays(prev_coupon, next_coupon, freq, basis)
                    }
                    res = __days_between_basis(d1, next_coupon, basis) / __coupdays(prev_coupon, next_coupon, freq, basis);
                    while (true)
                    {
                        prev_coupon = new Date(next_coupon.getFullYear(), next_coupon.getMonth(), next_coupon.getDate());
                        next_coupon.setMonth(next_coupon.getMonth() + 12 / freq);
                        if (__compareDateTime(next_coupon, d2) >= 0)
                        {
                            res += __days_between_basis(prev_coupon, d2, basis) / __coupdays(prev_coupon, next_coupon, freq, basis);
                            return res
                        }
                        res += 1.0
                    }
                }
                function __calc_oddfprice(settlement, maturity, issue, first_coupon, rate, yieldParam, redemption, freq, basis)
                {
                    var a = __days_between_basis(issue, settlement, basis);
                    var ds = __days_between_basis(settlement, first_coupon, basis);
                    var df = __days_between_basis(issue, first_coupon, basis);
                    var e = __coupdays(settlement, maturity, freq, basis);
                    var n = parseInt((__coupnum(settlement, maturity, freq)).toString(), 10);
                    var scale = 100.0 * rate / freq;
                    var f = 1.0 + yieldParam / freq;
                    var sum,
                        term1,
                        term2;
                    if (ds > e)
                    {
                        switch (basis)
                        {
                            case 0:
                            case 4:
                                var cdays = __days_between_basis(first_coupon, maturity, basis);
                                n = 1 + parseInt((Math_ceil(cdays / e)).toString(), 10);
                                break;
                            default:
                                var d = new Date(first_coupon.getFullYear(), first_coupon.getMonth(), first_coupon.getDate());
                                var INT_MAXVALUE = 32767;
                                for (n = 0; n < INT_MAXVALUE; n++)
                                {
                                    var prev_date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                                    d.setMonth(d.getMonth() + 12 / freq);
                                    if (__compareDateTime(d, maturity) >= 0)
                                    {
                                        n += parseInt((Math_ceil(__days_between_basis(prev_date, maturity, basis)) / __coupdays(prev_date, d, freq, basis)).toString(), 10) + 1;
                                        break
                                    }
                                }
                                a = e * __date_ratio(issue, settlement, first_coupon, freq, basis);
                                ds = e * __date_ratio(settlement, first_coupon, first_coupon, freq, basis);
                                df = e * __date_ratio(issue, first_coupon, first_coupon, freq, basis);
                                break
                        }
                    }
                    term1 = redemption / Math_pow(f, n - 1.0 + ds / e);
                    term2 = (df / e) / Math_pow(f, ds / e);
                    sum = Math_pow(f, -ds / e) * (Math_pow(f, -n) - 1 / f) / (1 / f - 1);
                    return term1 + scale * (term2 + sum - a / e)
                }
                function __one_euro(str, prec)
                {
                    var subStr = str.substr(0, 3);
                    var round = Functions._MathHelper.round;
                    switch (str[0])
                    {
                        case'A':
                            if (subStr === "ATS")
                            {
                                return round(13.7603, prec)
                            }
                            break;
                        case'B':
                            if (subStr === "BEF")
                            {
                                return round(40.3399, prec)
                            }
                            break;
                        case'D':
                            if (subStr === "DEM")
                            {
                                return round(1.95583, prec)
                            }
                            break;
                        case'E':
                            if (subStr === "ESP")
                            {
                                return round((166.386), prec)
                            }
                            else if (subStr === "EUR")
                            {
                                return round((1.0), prec)
                            }
                            break;
                        case'F':
                            if (subStr === "FIM")
                            {
                                return round((5.94573), prec)
                            }
                            else if (subStr === "FRF")
                            {
                                return round((6.55957), prec)
                            }
                            break;
                        case'G':
                            if (subStr === "GRD")
                            {
                                return round((340.75), prec)
                            }
                            break;
                        case'I':
                            if (subStr === "IEP")
                            {
                                return round((0.787564), prec)
                            }
                            else if (subStr === "ITL")
                            {
                                return round((1936.27), prec)
                            }
                            break;
                        case'L':
                            if (subStr === "LUX" || subStr === "LUF")
                            {
                                return round((40.3399), prec)
                            }
                            break;
                        case'N':
                            if (subStr === "NLG")
                            {
                                return round((2.20371), prec)
                            }
                            break;
                        case'P':
                            if (subStr === "PTE")
                            {
                                return round((200.482), prec)
                            }
                            break;
                        default:
                            break
                    }
                    return -1
                }
                function __calcPrecision(str)
                {
                    var subStr = str.substr(0, 3);
                    switch (str[0])
                    {
                        case'A':
                            if (subStr === "ATS")
                            {
                                return 2
                            }
                            break;
                        case'B':
                            if (subStr === "BEF")
                            {
                                return 0
                            }
                            break;
                        case'D':
                            if (subStr === "DEM")
                            {
                                return 2
                            }
                            break;
                        case'E':
                            if (subStr === "ESP")
                            {
                                return 0
                            }
                            else if (subStr === "EUR")
                            {
                                return 2
                            }
                            break;
                        case'F':
                            if (subStr === "FIM")
                            {
                                return 2
                            }
                            else if (subStr === "FRF")
                            {
                                return 2
                            }
                            break;
                        case'G':
                            if (subStr === "GRD")
                            {
                                return 2
                            }
                            break;
                        case'I':
                            if (subStr === "IEP")
                            {
                                return 2
                            }
                            else if (subStr === "ITL")
                            {
                                return 0
                            }
                            break;
                        case'L':
                            if (subStr === "LUX" || subStr === "LUF")
                            {
                                return 0
                            }
                            break;
                        case'N':
                            if (subStr === "NLG")
                            {
                                return 2
                            }
                            break;
                        case'P':
                            if (subStr === "PTE")
                            {
                                return 1
                            }
                            break;
                        default:
                            break
                    }
                    return 2
                }
                function __displayPrecision(str)
                {
                    var subStr = str.substr(0, 3);
                    switch (str[0])
                    {
                        case'A':
                            if (subStr === "ATS")
                            {
                                return 2
                            }
                            break;
                        case'B':
                            if (subStr === "BEF")
                            {
                                return 0
                            }
                            break;
                        case'D':
                            if (subStr === "DEM")
                            {
                                return 2
                            }
                            break;
                        case'E':
                            if (subStr === "ESP")
                            {
                                return 0
                            }
                            else if (subStr === "EUR")
                            {
                                return 2
                            }
                            break;
                        case'F':
                            if (subStr === "FIM")
                            {
                                return 2
                            }
                            else if (subStr === "FRF")
                            {
                                return 2
                            }
                            break;
                        case'G':
                            if (subStr === "GRD")
                            {
                                return 2
                            }
                            break;
                        case'I':
                            if (subStr === "IEP")
                            {
                                return 2
                            }
                            else if (subStr === "ITL")
                            {
                                return 0
                            }
                            break;
                        case'L':
                            if (subStr === "LUX" || subStr === "LUF")
                            {
                                return 0
                            }
                            break;
                        case'N':
                            if (subStr === "NLG")
                            {
                                return 2
                            }
                            break;
                        case'P':
                            if (subStr === "PTE")
                            {
                                return 2
                            }
                            break;
                        default:
                            break
                    }
                    return 2
                }
                function fi_fv(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var rate = Convert.D(args[0]);
                    var nper = Convert.D(args[1]);
                    var pmt = Convert.D(args[2]);
                    var pv = _Helper._argumentExists(args, 3) ? Convert.D(args[3]) : 0.0;
                    var type = _Helper._argumentExists(args, 4) ? Convert.D(args[4]) : 0.0;
                    if (type !== 0.0)
                    {
                        type = 1.0
                    }
                    if (rate === 0.0)
                    {
                        return Convert.toResult(-(pmt * nper + pv))
                    }
                    else
                    {
                        return Convert.toResult(-(pv * Math_pow(1.0 + rate, nper) + pmt * (1.0 + rate * type) * (Math_pow(1.0 + rate, nper) - 1.0) / rate))
                    }
                }
                function fi_fvschedule(args)
                {
                    var fv = Calc.Convert.D(args[0]);
                    var schedule = Calc.Convert.toArr(args[1], 1, true, true, false);
                    if (schedule.isError)
                    {
                        return schedule[0]
                    }
                    for (var i = 0; i < schedule.length; i++)
                    {
                        var rate = schedule[i];
                        if (rate !== Calc.Convert.CalcConvertedError)
                        {
                            fv *= 1.0 + rate
                        }
                    }
                    return fv
                }
                function fi_npv(args)
                {
                    var rate = Calc.Convert.D(args[0]);
                    var npvResult = 0.0;
                    var i = 1;
                    var val = 0;
                    for (var k = 1; k < args.length; k++)
                    {
                        if (Calc.Convert.err(args[k]))
                        {
                            return args[k]
                        }
                        var valueArray = Calc.Convert.toArr(args[k], 1, true, true, false);
                        if (valueArray.isError)
                        {
                            return valueArray[0]
                        }
                        for (var j = 0; j < valueArray.length; j++)
                        {
                            var o = valueArray[j];
                            if (o !== Calc.Convert.CalcConvertedError)
                            {
                                npvResult += o / Math_pow(1.0 + rate, i);
                                i++
                            }
                        }
                    }
                    return npvResult
                }
                function fi_pv(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var rate = Convert.D(args[0]);
                    var nper = Convert.D(args[1]);
                    var pmt = Convert.D(args[2]);
                    var fv = _Helper._argumentExists(args, 3) ? Convert.D(args[3]) : 0.0;
                    var type = _Helper._argumentExists(args, 4) ? Convert.D(args[4]) : 0.0;
                    if (type !== 0.0)
                    {
                        type = 1.0
                    }
                    if (rate === 0.0)
                    {
                        return Convert.toResult(-(pmt * nper + fv))
                    }
                    else
                    {
                        if (rate === -1.0)
                        {
                            return CalcErrorsDivideByZero
                        }
                        return Convert.toResult(-(fv + pmt * (1.0 + rate * type) * (Math_pow(1.0 + rate, nper) - 1.0) / rate) / Math_pow(1.0 + rate, nper))
                    }
                }
                function fi_received(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var investment = Convert.D(args[2]);
                    var discount = Convert.D(args[3]);
                    var basis = _Helper._argumentExists(args, 4) ? Convert.I(args[4]) : 0;
                    var a,
                        d,
                        n;
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (investment <= 0.0 || discount <= 0.0 || basis < 0 || 4 < basis)
                    {
                        return CalcErrorsNumber
                    }
                    a = __days_monthly_basis(settlement, maturity, basis);
                    d = __annual_year_basis(settlement, basis);
                    if (a <= 0 || d <= 0)
                    {
                        return CalcErrorsNumber
                    }
                    n = 1.0 - (discount * a / d);
                    if (n <= 0)
                    {
                        return CalcErrorsNumber
                    }
                    return investment / n
                }
                function fi_xnpv(args)
                {
                    var rate = Calc.Convert.D(args[0]);
                    var values = Calc.Convert.toArr(args[1], 1, true, true, true);
                    var dates = Calc.Convert.toArr(args[2], 1, true, true, true);
                    var len1 = values.length;
                    var len2 = dates.length;
                    if (len1 !== len2)
                    {
                        return CalcErrorsNumber
                    }
                    if (values.isError)
                    {
                        return values[0]
                    }
                    if (dates.isError)
                    {
                        return dates[0]
                    }
                    if (values.isConvertError || dates.isConvertError)
                    {
                        return CalcErrorsValue
                    }
                    var sum = 0.0;
                    for (var i = 0; i < len1; i++)
                    {
                        sum += values[i] / Math_pow(1.0 + rate, (dates[i] - dates[0]) / 365.0)
                    }
                    return sum
                }
                function __get_cumipmt(fRate, nNumPeriods, fVal, nStart, nEnd, nPayType)
                {
                    var fRmz,
                        fZinsZ;
                    var i;
                    fRmz = __getRmz(fRate, nNumPeriods, fVal, 0.0, nPayType);
                    fZinsZ = 0.0;
                    if (nStart === 1)
                    {
                        if (nPayType <= 0)
                        {
                            fZinsZ = -fVal
                        }
                        nStart++
                    }
                    for (i = nStart; i <= nEnd; i++)
                    {
                        if (nPayType > 0)
                        {
                            fZinsZ += __getZw(fRate, (i - 2), fRmz, fVal, 1) - fRmz
                        }
                        else
                        {
                            fZinsZ += __getZw(fRate, (i - 1), fRmz, fVal, 0)
                        }
                    }
                    fZinsZ *= fRate;
                    return fZinsZ
                }
                function fi_cumipmt(args)
                {
                    var fRate = Calc.Convert.D(args[0]);
                    var nNumPeriods = Calc.Convert.I(args[1]);
                    var fVal = Calc.Convert.D(args[2]);
                    var nStartPer = Calc.Convert.I(args[3]);
                    var nEndPer = Calc.Convert.I(args[4]);
                    var nPayType = Calc.Convert.I(args[5]);
                    if (nStartPer < 1 || nEndPer < nStartPer || fRate <= 0.0 || nEndPer > nNumPeriods || nNumPeriods <= 0 || fVal <= 0.0 || (nPayType !== 0 && nPayType !== 1))
                    {
                        return CalcErrorsNumber
                    }
                    return __get_cumipmt(fRate, nNumPeriods, fVal, nStartPer, nEndPer, nPayType)
                }
                function __get_cumprinc(fRate, nNumPeriods, fVal, nStart, nEnd, nPayType)
                {
                    var fRmz,
                        fKapZ;
                    var i;
                    fRmz = __getRmz(fRate, nNumPeriods, fVal, 0.0, nPayType);
                    fKapZ = 0.0;
                    if (nStart === 1)
                    {
                        if (nPayType <= 0)
                        {
                            fKapZ = fRmz + fVal * fRate
                        }
                        else
                        {
                            fKapZ = fRmz
                        }
                        nStart++
                    }
                    for (i = nStart; i <= nEnd; i++)
                    {
                        if (nPayType > 0)
                        {
                            fKapZ += fRmz - (__getZw(fRate, (i - 2), fRmz, fVal, 1) - fRmz) * fRate
                        }
                        else
                        {
                            fKapZ += fRmz - __getZw(fRate, (i - 1), fRmz, fVal, 0) * fRate
                        }
                    }
                    return fKapZ
                }
                function fi_cumprinc(args)
                {
                    var fRate = Calc.Convert.D(args[0]);
                    var nNumPeriods = Calc.Convert.I(args[1]);
                    var fVal = Calc.Convert.D(args[2]);
                    var nStartPer = Calc.Convert.I(args[3]);
                    var nEndPer = Calc.Convert.I(args[4]);
                    var nPayType = Calc.Convert.I(args[5]);
                    if (nStartPer < 1 || nEndPer < nStartPer || fRate <= 0.0 || nEndPer > nNumPeriods || nNumPeriods <= 0 || fVal <= 0.0 || (nPayType !== 0 && nPayType !== 1))
                    {
                        return CalcErrorsNumber
                    }
                    return __get_cumprinc(fRate, nNumPeriods, fVal, nStartPer, nEndPer, nPayType)
                }
                function fi_ipmt(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var rate = Convert.D(args[0]);
                    var per = Convert.D(args[1]);
                    var nper = Convert.D(args[2]);
                    var pv = Convert.D(args[3]);
                    var fv = _Helper._argumentExists(args, 4) ? Convert.D(args[4]) : 0.0;
                    var type = _Helper._argumentExists(args, 5) ? Convert.I(args[5]) : 0;
                    if (per < 1.0 || per >= nper + 1.0 || nper < 1.0)
                    {
                        return CalcErrorsNumber
                    }
                    else
                    {
                        var pmt = __calculate_pmt(rate, nper, pv, fv, type);
                        return __calculate_interest_part(pv, pmt, rate, per - 1.0)
                    }
                }
                function fi_ispmt(args)
                {
                    var rate = Calc.Convert.D(args[0]);
                    var per = Calc.Convert.I(args[1]);
                    var nper = Calc.Convert.I(args[2]);
                    var pv = Calc.Convert.D(args[3]);
                    if (nper === 0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return Calc.Convert.toResult(pv * rate * (Calc.Convert.D(per) / Calc.Convert.D(nper) - 1.0))
                }
                function fi_pmt(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var rate = Convert.D(args[0]);
                    var nper = Convert.D(args[1]);
                    var pv = Convert.D(args[2]);
                    var fv = _Helper._argumentExists(args, 3) ? Convert.D(args[3]) : 0.0;
                    var type = _Helper._argumentExists(args, 4) ? Convert.D(args[4]) : 0.0;
                    if (type !== 0.0)
                    {
                        type = 1.0
                    }
                    if (rate === 0.0)
                    {
                        if (nper === 0.0)
                        {
                            return CalcErrorsDivideByZero
                        }
                        return Convert.toResult(-(pv + fv) / nper)
                    }
                    else
                    {
                        if (nper === 0.0)
                        {
                            return CalcErrorsDivideByZero
                        }
                        return Convert.toResult(-(pv * Math_pow(1.0 + rate, nper) + fv) / ((1.0 + rate * type) * (Math_pow(1.0 + rate, nper) - 1.0) / rate))
                    }
                }
                function fi_ppmt(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var rate = Convert.D(args[0]);
                    var per = Convert.D(args[1]);
                    var nper = Convert.D(args[2]);
                    var pv = Convert.D(args[3]);
                    var fv = _Helper._argumentExists(args, 4) ? Convert.D(args[4]) : 0;
                    var type = _Helper._argumentExists(args, 5) ? Convert.B(args[5]) : false;
                    if (per < 1.0 || per >= nper + 1.0)
                    {
                        return CalcErrorsNumber
                    }
                    else
                    {
                        var pmt = __calculate_pmt(rate, nper, pv, fv, type ? 1 : 0);
                        var ipmt = __calculate_interest_part(pv, pmt, rate, per - 1.0);
                        return pmt - ipmt
                    }
                }
                function fi_coupdaybsFunc(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var frequency = Convert.I(args[2]);
                    var basis = _Helper._argumentExists(args, 3) ? Convert.I(args[3]) : 0;
                    var numError = CalcErrorsNumber;
                    if (basis < 0 || basis > 4)
                    {
                        return numError
                    }
                    if (frequency !== 1 && frequency !== 2 && frequency !== 4)
                    {
                        return numError
                    }
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return numError
                    }
                    return __coupdaybs(settlement, maturity, frequency, basis)
                }
                function fi_coupdaysFunc(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var frequency = Convert.I(args[2]);
                    var basis = _Helper._argumentExists(args, 3) ? Convert.I(args[3]) : 0;
                    var numError = CalcErrorsNumber;
                    if (basis < 0 || basis > 4)
                    {
                        return numError
                    }
                    if (frequency !== 1 && frequency !== 2 && frequency !== 4)
                    {
                        return numError
                    }
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return numError
                    }
                    return __coupdays(settlement, maturity, frequency, basis)
                }
                function fi_coupdaysncFunc(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var frequency = Convert.I(args[2]);
                    var basis = _Helper._argumentExists(args, 3) ? Convert.I(args[3]) : 0;
                    if (basis < 0 || basis > 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (frequency !== 1 && frequency !== 2 && frequency !== 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    return __coupdaysnc(settlement, maturity, frequency, basis)
                }
                function fi_coupncdFunc(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var frequency = Convert.I(args[2]);
                    var basis = _Helper._argumentExists(args, 3) ? Convert.I(args[3]) : 0;
                    if (basis < 0 || basis > 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (frequency !== 1 && frequency !== 2 && frequency !== 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    return __coupncd(settlement, maturity, frequency)
                }
                function fi_coupnumFunc(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var frequency = Convert.I(args[2]);
                    var basis = _Helper._argumentExists(args, 3) ? Convert.I(args[3]) : 0;
                    if (basis < 0 || basis > 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (frequency !== 1 && frequency !== 2 && frequency !== 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    return __coupnum(settlement, maturity, frequency)
                }
                function fi_couppcdFunc(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var frequency = Convert.I(args[2]);
                    var basis = Calc._Helper._argumentExists(args, 3) ? Convert.I(args[3]) : 0;
                    if (basis < 0 || basis > 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (frequency !== 1 && frequency !== 2 && frequency !== 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    return __couppcd(settlement, maturity, frequency)
                }
                function fi_durationFunc(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var coup = Convert.D(args[2]);
                    var yld = Convert.D(args[3]);
                    var frequency = Convert.I(args[4]);
                    var basis = _Helper._argumentExists(args, 5) ? Convert.I(args[5]) : 0;
                    var fNumOfCoups;
                    if (basis < 0 || basis > 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (frequency !== 1 && frequency !== 2 && frequency !== 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (__compareDateTime(settlement, maturity) > 0)
                    {
                        return CalcErrorsNumber
                    }
                    fNumOfCoups = __coupnum(settlement, maturity, frequency);
                    return __duration(settlement, maturity, coup, yld, frequency, basis, fNumOfCoups)
                }
                function __get_mduration(nSettle, nMat, fCoup, fYield, nFreq, nBase, fNumOfCoups)
                {
                    var fRet = __duration(nSettle, nMat, fCoup, fYield, nFreq, nBase, fNumOfCoups);
                    fRet /= 1.0 + (fYield / CalcConvert.D(nFreq));
                    return fRet
                }
                function fi_mduration(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var coup = Convert.D(args[2]);
                    var yld = Convert.D(args[3]);
                    var frequency = Convert.I(args[4]);
                    var basis = _Helper._argumentExists(args, 5) ? Convert.I(args[5]) : 0;
                    var fNumOfCoups;
                    if (basis < 0 || basis > 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (frequency !== 1 && frequency !== 2 && frequency !== 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (__compareDateTime(settlement, maturity) > 0)
                    {
                        return CalcErrorsNumber
                    }
                    fNumOfCoups = __coupnum(settlement, maturity, frequency);
                    return __get_mduration(settlement, maturity, coup, yld, frequency, basis, fNumOfCoups)
                }
                function fi_nper(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var rate = Convert.D(args[0]);
                    var pmt = Convert.D(args[1]);
                    var pv = Convert.D(args[2]);
                    var fv = _Helper._argumentExists(args, 3) ? Convert.D(args[3]) : 0.0;
                    var type = _Helper._argumentExists(args, 4) ? Convert.D(args[4]) : 0.0;
                    if (type !== 0.0)
                    {
                        type = 1.0
                    }
                    if (rate === 0.0)
                    {
                        if (pmt === 0.0)
                        {
                            return CalcErrorsDivideByZero
                        }
                        return Convert.toResult(-(pv + fv) / pmt)
                    }
                    else
                    {
                        if (rate <= -1.0)
                        {
                            return CalcErrorsNumber
                        }
                        return Convert.toResult(Math_log((pmt * (1.0 + rate * type) - fv * rate) / (pv * rate + pmt * (1.0 + rate * type))) / Math_log(1.0 + rate))
                    }
                }
                function __yield_f(yieldParam, y, settlement, maturity, rate, par, redemption, freq, basis)
                {
                    y = __price(settlement, maturity, rate, yieldParam, redemption, freq, basis) - par;
                    return [true, y]
                }
                function __fake_df(x, dfx, xstep, data, settle, maturity, rate, price, redemption, freq, basis)
                {
                    var xl,
                        xr;
                    var status;
                    var yl = 0.0;
                    var yr = 0.0;
                    xl = x - xstep;
                    if (xl < data.xmin)
                    {
                        xl = x
                    }
                    xr = x + xstep;
                    if (xr > data.xmax)
                    {
                        xr = x
                    }
                    if (xl === xr)
                    {
                        return [false, dfx, data]
                    }
                    var resultArray = __yield_f(xl, yl, settle, maturity, rate, price, redemption, freq, basis);
                    yl = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, dfx, data]
                    }
                    resultArray = __yield_f(xr, yr, settle, maturity, rate, price, redemption, freq, basis);
                    yr = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, dfx, data]
                    }
                    dfx = (yr - yl) / (xr - xl);
                    return [true, dfx, data]
                }
                function __goal_seek_newton(data, settle, maturity, rate, price, redem, freq, basis, x0)
                {
                    var iterations;
                    var status;
                    var precision = data.precision / 2.0;
                    for (iterations = 0; iterations < 20; iterations++)
                    {
                        var x1,
                            stepsize;
                        var y0 = 0.0;
                        var df0 = 0.0;
                        if (x0 < data.xmin || x0 > data.xmax)
                        {
                            return [false, data]
                        }
                        var resultArray = __yield_f(x0, y0, settle, maturity, rate, price, redem, freq, basis);
                        y0 = resultArray[1];
                        status = resultArray[0];
                        if (!status)
                        {
                            return [status, data]
                        }
                        resultArray = __update_data(x0, y0, data);
                        data = resultArray[1];
                        if (resultArray[0])
                        {
                            return [true, data]
                        }
                        var xstep;
                        if (Math_abs(x0) < 1.0e-10)
                        {
                            if (data.havexneg && data.havexpos)
                            {
                                xstep = Math_abs(data.xpos - data.xneg) / 1.0e6
                            }
                            else
                            {
                                xstep = (data.xmax - data.xmin) / 1.0e6
                            }
                        }
                        else
                        {
                            xstep = Math_abs(x0) / 1.0e6
                        }
                        var resultArray3 = __fake_df(x0, df0, xstep, data, settle, maturity, rate, price, redem, freq, basis);
                        data = resultArray3[2];
                        df0 = resultArray3[1];
                        status = resultArray3[0];
                        if (!status)
                        {
                            return [status, data]
                        }
                        if (df0 === 0)
                        {
                            return [false, data]
                        }
                        x1 = x0 - 1.000001 * y0 / df0;
                        if (x1 === x0)
                        {
                            data.root = x0;
                            return [true, data]
                        }
                        stepsize = Math_abs(x1 - x0) / (Math_abs(x0) + Math_abs(x1));
                        x0 = x1;
                        if (stepsize < precision)
                        {
                            data.root = x0;
                            return [true, data]
                        }
                    }
                    return [false, data]
                }
                function __goal_seek_point(data, settle, maturity, rate, price, redem, freq, basis, x0)
                {
                    var status;
                    var y0 = 0.0;
                    if (x0 < data.xmin || x0 > data.xmax)
                    {
                        return [false, data]
                    }
                    var resultArray = __yield_f(x0, y0, settle, maturity, rate, price, redem, freq, basis);
                    y0 = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, data]
                    }
                    resultArray = __update_data(x0, y0, data);
                    data = resultArray[1];
                    if (resultArray[0])
                    {
                        return [true, data]
                    }
                    return [false, data]
                }
                function __replaceGoto(data, settle, maturity, rate, price, redem, freq, basis, stepsize, newton_submethod, xmid, ymid, status, method)
                {
                    switch (method)
                    {
                        case 0:
                            xmid = data.xpos - data.ypos * ((data.xneg - data.xpos) / (data.yneg - data.ypos));
                            break;
                        case 1:
                            var det;
                            xmid = (data.xpos + data.xneg) / 2.0;
                            var resultArray = __yield_f(xmid, ymid, settle, maturity, rate, price, redem, freq, basis);
                            ymid = resultArray[1];
                            status = resultArray[0];
                            if (!status)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            if (ymid === 0.0)
                            {
                                data = __update_data(xmid, ymid, data)[1];
                                return [true, data, newton_submethod, xmid, ymid, method]
                            }
                            det = Math_sqrt(ymid * ymid - data.ypos * data.yneg);
                            if (det === 0)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            xmid += (xmid - data.xpos) * ymid / det;
                            break;
                        case 3:
                            xmid = (data.xpos + data.xneg) / 2.0;
                            break;
                        case 2:
                            var x0 = 0.0;
                            var y0 = 0.0;
                            var xstep = 0.0;
                            var df0 = 0.0;
                            if (stepsize > 0.1)
                            {
                                method = 3;
                                return __replaceGoto(data, settle, maturity, rate, price, redem, freq, basis, stepsize, newton_submethod, xmid, ymid, status, method)
                            }
                            switch (newton_submethod++ % 4)
                            {
                                case 0:
                                    x0 = data.xpos;
                                    x0 = data.ypos;
                                    break;
                                case 2:
                                    x0 = data.xneg;
                                    y0 = data.yneg;
                                    break;
                                default:
                                case 3:
                                case 1:
                                    x0 = (data.xpos + data.xneg) / 2.0;
                                    var resultArray2 = __yield_f(x0, y0, settle, maturity, rate, price, redem, freq, basis);
                                    y0 = resultArray2[1];
                                    status = resultArray2[0];
                                    if (!status)
                                    {
                                        return [keyword_null, data, newton_submethod, xmid, ymid, method]
                                    }
                                    break
                            }
                            xstep = Math_abs(data.xpos - data.xneg) / 1e6;
                            var resultArray3 = __fake_df(x0, df0, xstep, data, settle, maturity, rate, price, redem, freq, basis);
                            data = resultArray3[2];
                            df0 = resultArray3[1];
                            status = resultArray3[0];
                            if (!status)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            if (df0 === 0)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            xmid = x0 - 1.01 * y0 / df0;
                            if ((xmid < data.xpos && xmid < data.xneg) || (xmid > data.xpos && xmid > data.xneg))
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            break;
                        default:
                            break
                    }
                    return [false, data, newton_submethod, xmid, ymid, method]
                }
                function __goal_seek_bisection(data, settle, maturity, rate, price, redem, freq, basis)
                {
                    var iterations;
                    var stepsize;
                    var newton_submethod = 0;
                    if (!data.havexpos || !data.havexneg)
                    {
                        return [false, data]
                    }
                    stepsize = Math_abs(data.xpos - data.xneg) / (Math_abs(data.xpos) + Math_abs(data.xneg));
                    for (iterations = 0; iterations < 100 + 2 * 4; iterations++)
                    {
                        var xmid = 0.0;
                        var ymid = 0.0;
                        var status;
                        var method;
                        method = (iterations % 4 === 0) ? 1 : ((iterations % 4 === 2) ? 2 : 3);
                        var resultOfGoto = __replaceGoto(data, settle, maturity, rate, price, redem, freq, basis, stepsize, newton_submethod, xmid, ymid, status, method);
                        data = resultOfGoto[1];
                        newton_submethod = resultOfGoto[2];
                        xmid = resultOfGoto[3];
                        ymid = resultOfGoto[4];
                        method = resultOfGoto[5];
                        if (!resultOfGoto[0])
                        {
                            continue
                        }
                        else if (resultOfGoto[0])
                        {
                            return [true, data]
                        }
                        var resultArray4 = __yield_f(xmid, ymid, settle, maturity, rate, price, redem, freq, basis);
                        ymid = resultArray4[1];
                        status = resultArray4[0];
                        if (!status)
                        {
                            continue
                        }
                        var resultArray5 = __update_data(xmid, ymid, data);
                        data = resultArray5[1];
                        if (resultArray5[0])
                        {
                            return [true, data]
                        }
                        stepsize = Math_abs(data.xpos - data.xneg) / (Math_abs(data.xpos) + Math_abs(data.xneg));
                        if (stepsize < data.precision)
                        {
                            if (data.yneg < ymid)
                            {
                                ymid = data.yneg;
                                xmid = data.xneg
                            }
                            if (data.ypos < ymid)
                            {
                                ymid = data.ypos;
                                xmid = data.xpos
                            }
                            data.root = xmid;
                            return [true, data]
                        }
                    }
                    return [false, data]
                }
                function fi_yieldFunc(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var rate = Convert.D(args[2]);
                    var par = Convert.D(args[3]);
                    var redemption = Convert.D(args[4]);
                    var freq = Convert.I(args[5]);
                    var basis = _Helper._argumentExists(args, 6) ? Convert.I(args[6]) : 0;
                    var n;
                    if (basis < 0 || basis > 4 || !(freq === 1 || freq === 2 || freq === 4) || __compareDateTime(settlement, maturity) > 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (rate < 0.0 || par < 0.0 || redemption <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    n = __coupnum(settlement, maturity, freq);
                    if (n <= 1.0)
                    {
                        var a = __coupdaybs(settlement, maturity, freq, basis);
                        var d = __coupdaysnc(settlement, maturity, freq, basis);
                        var e = __coupdays(settlement, maturity, freq, basis);
                        var coeff = freq * e / d;
                        var num = (redemption / 100.0 + rate / freq) - (par / 100.0 + (a / e * rate / freq));
                        var den = par / 100.0 + (a / e * rate / freq);
                        return num / den * coeff
                    }
                    else
                    {
                        var data = {};
                        var status;
                        var yield0 = 0.1;
                        data.xmin = 0.0;
                        data.xmax = 0.0;
                        data.precision = 0.0;
                        data.havexpos = false;
                        data.xpos = 0.0;
                        data.ypos = 0.0;
                        data.havexneg = false;
                        data.xneg = 0.0;
                        data.yneg = 0.0;
                        data.root = 0.0;
                        data = __goal_seek_initialise(data);
                        data.xmin = Math_max(data.xmin, 0);
                        data.xmax = Math_min(data.xmax, 1000);
                        var resultArray = __goal_seek_newton(data, settlement, maturity, rate, par, redemption, freq, basis, yield0);
                        data = resultArray[1];
                        status = resultArray[0];
                        if (!status)
                        {
                            for (yield0 = 1e-10; yield0 < data.xmax; yield0 *= 2)
                            {
                                data = __goal_seek_point(data, settlement, maturity, rate, par, redemption, freq, basis, yield0)[1]
                            }
                            resultArray = __goal_seek_bisection(data, settlement, maturity, rate, par, redemption, freq, basis);
                            data = resultArray[1];
                            status = resultArray[0]
                        }
                        if (!status)
                        {
                            return CalcErrorsNumber
                        }
                        return data.root
                    }
                }
                function fi_yielddisc(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var fPrice = Convert.D(args[2]);
                    var fRedemp = Convert.D(args[3]);
                    var nBase = _Helper._argumentExists(args, 4) ? Convert.I(args[4]) : 0;
                    var ret;
                    var yfrac;
                    if (nBase < 0 || nBase > 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (fRedemp <= 0.0 || fPrice <= 0.0 || __compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    ret = (fRedemp / fPrice) - 1.0;
                    yfrac = Functions._DateHelper.yearfrac([settlement, maturity, nBase]);
                    return ret / yfrac
                }
                function __get_yieldmat(nSettle, nMat, nIssue, fRate, fPrice, nBase)
                {
                    var yearfrac = Functions._DateHelper.yearfrac;
                    var fIssMat = yearfrac([nIssue, nMat, nBase]);
                    var fIssSet = yearfrac([nIssue, nSettle, nBase]);
                    var fSetMat = yearfrac([nSettle, nMat, nBase]);
                    var y = 1.0 + fIssMat * fRate;
                    y /= fPrice / 100.0 + fIssSet * fRate;
                    y--;
                    y /= fSetMat;
                    return y
                }
                function fi_yieldmat(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var nSettle = Convert.DT(args[0]);
                    var nMat = Convert.DT(args[1]);
                    var nIssue = Convert.DT(args[2]);
                    var fRate = Convert.D(args[3]);
                    var fPrice = Convert.D(args[4]);
                    var nBase = _Helper._argumentExists(args, 5) ? Convert.I(args[5]) : 0;
                    if (nBase < 0 || nBase > 4 || fRate < 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    return __get_yieldmat(nSettle, nMat, nIssue, fRate, fPrice, nBase)
                }
                function __odd_yield_f(yieldParam, y, settlement, maturity, issue, first_coupon, rate, price, redemption, freq, basis)
                {
                    y = __calc_oddfprice(settlement, maturity, issue, first_coupon, rate, yieldParam, redemption, freq, basis) - price;
                    return [true, y]
                }
                function __odd_fake_df(x, dfx, xstep, data, settle, maturity, issue, first_coupon, rate, price, redemption, freq, basis)
                {
                    var xl,
                        xr;
                    var status;
                    var yl = 0.0;
                    var yr = 0.0;
                    xl = x - xstep;
                    if (xl < data.xmin)
                    {
                        xl = x
                    }
                    xr = x + xstep;
                    if (xr > data.xmax)
                    {
                        xr = x
                    }
                    if (xl === xr)
                    {
                        return [false, dfx, data]
                    }
                    var resultArray = __odd_yield_f(xl, yl, settle, maturity, issue, first_coupon, rate, price, redemption, freq, basis);
                    yl = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, dfx, data]
                    }
                    resultArray = __odd_yield_f(xr, yr, settle, maturity, issue, first_coupon, rate, price, redemption, freq, basis);
                    yr = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, dfx, data]
                    }
                    dfx = (yr - yl) / (xr - xl);
                    return [true, dfx, data]
                }
                function __odd_goal_seek_newton(data, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis, x0)
                {
                    var iterations;
                    var status;
                    var precision = data.precision / 2.0;
                    for (iterations = 0; iterations < 20; iterations++)
                    {
                        var x1,
                            stepsize;
                        var y0 = 0.0;
                        var df0 = 0.0;
                        if (x0 < data.xmin || x0 > data.xmax)
                        {
                            return [false, data]
                        }
                        var resultArray = __odd_yield_f(x0, y0, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis);
                        y0 = resultArray[1];
                        status = resultArray[0];
                        if (!status)
                        {
                            return [status, data]
                        }
                        resultArray = __update_data(x0, y0, data);
                        data = resultArray[1];
                        if (resultArray[0])
                        {
                            return [true, data]
                        }
                        var xstep;
                        if (Math_abs(x0) < 1.0e-10)
                        {
                            if (data.havexneg && data.havexpos)
                            {
                                xstep = Math_abs(data.xpos - data.xneg) / 1.0e6
                            }
                            else
                            {
                                xstep = (data.xmax - data.xmin) / 1.0e6
                            }
                        }
                        else
                        {
                            xstep = Math_abs(x0) / 1.0e6
                        }
                        var resultArray3 = __odd_fake_df(x0, df0, xstep, data, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis);
                        data = resultArray3[2];
                        df0 = resultArray3[1];
                        status = resultArray3[0];
                        if (!status)
                        {
                            return [status, data]
                        }
                        if (df0 === 0)
                        {
                            return [false, data]
                        }
                        x1 = x0 - 1.000001 * y0 / df0;
                        if (x1 === x0)
                        {
                            data.root = x0;
                            return [true, data]
                        }
                        stepsize = Math_abs(x1 - x0) / (Math_abs(x0) + Math_abs(x1));
                        x0 = x1;
                        if (stepsize < precision)
                        {
                            data.root = x0;
                            return [true, data]
                        }
                    }
                    return [false, data]
                }
                function __odd_goal_seek_point(data, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis, x0)
                {
                    var status;
                    var y0 = 0.0;
                    if (x0 < data.xmin || x0 > data.xmax)
                    {
                        return [false, data]
                    }
                    var resultArray = __odd_yield_f(x0, y0, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis);
                    y0 = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, data]
                    }
                    resultArray = __update_data(x0, y0, data);
                    data = resultArray[1];
                    if (resultArray[0])
                    {
                        return [true, data]
                    }
                    return [false, data]
                }
                function __odd_replaceGoto(data, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis, stepsize, newton_submethod, xmid, ymid, status, method)
                {
                    switch (method)
                    {
                        case 0:
                            xmid = data.xpos - data.ypos * ((data.xneg - data.xpos) / (data.yneg - data.ypos));
                            break;
                        case 1:
                            var det;
                            xmid = (data.xpos + data.xneg) / 2.0;
                            var resultArray = __odd_yield_f(xmid, ymid, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis);
                            ymid = resultArray[1];
                            status = resultArray[0];
                            if (!status)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            if (ymid === 0.0)
                            {
                                data = __update_data(xmid, ymid, data)[1];
                                return [true, data, newton_submethod, xmid, ymid, method]
                            }
                            det = Math_sqrt(ymid * ymid - data.ypos * data.yneg);
                            if (det === 0)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            xmid += (xmid - data.xpos) * ymid / det;
                            break;
                        case 3:
                            xmid = (data.xpos + data.xneg) / 2.0;
                            break;
                        case 2:
                            var x0 = 0.0;
                            var y0 = 0.0;
                            var xstep = 0.0;
                            var df0 = 0.0;
                            if (stepsize > 0.1)
                            {
                                method = 3;
                                return __odd_replaceGoto(data, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis, stepsize, newton_submethod, xmid, ymid, status, method)
                            }
                            switch (newton_submethod++ % 4)
                            {
                                case 0:
                                    x0 = data.xpos;
                                    x0 = data.ypos;
                                    break;
                                case 2:
                                    x0 = data.xneg;
                                    y0 = data.yneg;
                                    break;
                                default:
                                case 3:
                                case 1:
                                    x0 = (data.xpos + data.xneg) / 2.0;
                                    var resultArray2 = __odd_yield_f(x0, y0, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis);
                                    y0 = resultArray2[1];
                                    status = resultArray2[0];
                                    if (!status)
                                    {
                                        return [keyword_null, data, newton_submethod, xmid, ymid, method]
                                    }
                                    break
                            }
                            xstep = Math_abs(data.xpos - data.xneg) / 1e6;
                            var resultArray3 = __odd_fake_df(x0, df0, xstep, data, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis);
                            data = resultArray3[2];
                            df0 = resultArray3[1];
                            status = resultArray3[0];
                            if (!status)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            if (df0 === 0)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            xmid = x0 - 1.01 * y0 / df0;
                            if ((xmid < data.xpos && xmid < data.xneg) || (xmid > data.xpos && xmid > data.xneg))
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            break;
                        default:
                            break
                    }
                    return [false, data, newton_submethod, xmid, ymid, method]
                }
                function __odd_goal_seek_bisection(data, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis)
                {
                    var iterations;
                    var stepsize;
                    var newton_submethod = 0;
                    if (!data.havexpos || !data.havexneg)
                    {
                        return [false, data]
                    }
                    stepsize = Math_abs(data.xpos - data.xneg) / (Math_abs(data.xpos) + Math_abs(data.xneg));
                    for (iterations = 0; iterations < 100 + 2 * 4; iterations++)
                    {
                        var xmid = 0.0;
                        var ymid = 0.0;
                        var status;
                        var method;
                        method = (iterations % 4 === 0) ? 1 : ((iterations % 4 === 2) ? 2 : 3);
                        var resultOfGoto = __odd_replaceGoto(data, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis, stepsize, newton_submethod, xmid, ymid, status, method);
                        data = resultOfGoto[1];
                        newton_submethod = resultOfGoto[2];
                        xmid = resultOfGoto[3];
                        ymid = resultOfGoto[4];
                        method = resultOfGoto[5];
                        if (resultOfGoto[0] === undefined || resultOfGoto[0] === keyword_null)
                        {
                            continue
                        }
                        else if (resultOfGoto[0])
                        {
                            return [true, data]
                        }
                        var resultArray4 = __odd_yield_f(xmid, ymid, settle, maturity, issue, first_coupon, rate, price, redem, freq, basis);
                        ymid = resultArray4[1];
                        status = resultArray4[0];
                        if (!status)
                        {
                            continue
                        }
                        var resultArray5 = __update_data(xmid, ymid, data);
                        data = resultArray5[1];
                        if (resultArray5[0])
                        {
                            return [true, data]
                        }
                        stepsize = Math_abs(data.xpos - data.xneg) / (Math_abs(data.xpos) + Math_abs(data.xneg));
                        if (stepsize < data.precision)
                        {
                            if (data.yneg < ymid)
                            {
                                ymid = data.yneg;
                                xmid = data.xneg
                            }
                            if (data.ypos < ymid)
                            {
                                ymid = data.ypos;
                                xmid = data.xpos
                            }
                            data.root = xmid;
                            return [true, data]
                        }
                    }
                    return [false, data]
                }
                function fi_oddfyield(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var issue = Convert.DT(args[2]);
                    var first_coupon = Convert.DT(args[3]);
                    var rate = Convert.D(args[4]);
                    var price = Convert.D(args[5]);
                    var redemption = Convert.D(args[6]);
                    var freq = Convert.I(args[7]);
                    var basis = _Helper._argumentExists(args, 8) ? Convert.I(args[8]) : 0;
                    var yield0 = 0.1;
                    var data = {};
                    if (basis < 0 || basis > 4 || !(freq === 1 || freq === 2 || freq === 4) || __compareDateTime(issue, settlement) > 0 || __compareDateTime(settlement, first_coupon) > 0 || __compareDateTime(first_coupon, maturity) > 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (rate < 0.0 || price <= 0.0 || redemption <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    data.xmin = 0.0;
                    data.xmax = 0.0;
                    data.precision = 0.0;
                    data.havexpos = false;
                    data.xpos = 0.0;
                    data.ypos = 0.0;
                    data.havexneg = false;
                    data.xneg = 0.0;
                    data.yneg = 0.0;
                    data.root = 0.0;
                    data = __goal_seek_initialise(data);
                    data.xmin = Math_max(data.xmin, 0);
                    data.xmax = Math_min(data.xmax, 1000);
                    var resultArray = __odd_goal_seek_newton(data, settlement, maturity, issue, first_coupon, rate, price, redemption, freq, basis, yield0);
                    data = resultArray[1];
                    var status = resultArray[0];
                    if (status)
                    {
                        for (yield0 = 1e-10; yield0 < data.xmax; yield0 *= 2)
                        {
                            data = __odd_goal_seek_point(data, settlement, maturity, issue, first_coupon, rate, price, redemption, freq, basis, yield0)[1]
                        }
                        resultArray = __odd_goal_seek_bisection(data, settlement, maturity, issue, first_coupon, rate, price, redemption, freq, basis);
                        data = resultArray[1];
                        status = resultArray[0]
                    }
                    if (!status)
                    {
                        return CalcErrorsNumber
                    }
                    return data.root
                }
                function __calc_oddlyield(settlement, maturity, last_interest, rate, price, redemption, freq, basis)
                {
                    var d = new Date(last_interest.getFullYear(), last_interest.getMonth(), last_interest.getDate());
                    var x1,
                        x2,
                        x3;
                    do
                        d.setMonth(d.getMonth() + 12 / freq);
                    while (__compareDateTime(d, maturity) < 0);
                    x1 = __date_ratio(last_interest, settlement, d, freq, basis);
                    x2 = __date_ratio(last_interest, maturity, d, freq, basis);
                    x3 = __date_ratio(settlement, maturity, d, freq, basis);
                    return (freq * (redemption - price) + 100 * rate * (x2 - x1)) / (x3 * price + 100 * rate * x1 * x3 / freq)
                }
                function fi_oddlyield(args)
                {
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var settlement = Convert.DT(args[0]);
                    var maturity = Convert.DT(args[1]);
                    var last_interest = Convert.DT(args[2]);
                    var rate = Convert.D(args[3]);
                    var pr = Convert.D(args[4]);
                    var redemption = Convert.D(args[5]);
                    var freq = Convert.I(args[6]);
                    var basis = _Helper._argumentExists(args, 7) ? Convert.I(args[7]) : 0;
                    if (basis < 0 || basis > 4 || !(freq === 1 || freq === 2 || freq === 4) || __compareDateTime(settlement, maturity) > 0 || __compareDateTime(last_interest, settlement) > 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (rate < 0.0 || pr < 0.0 || redemption <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    return __calc_oddlyield(settlement, maturity, last_interest, rate, pr, redemption, freq, basis)
                }
                function fi_tbilleq(args)
                {
                    var settlement = Calc.Convert.DT(args[0]);
                    var maturity = Calc.Convert.DT(args[1]);
                    var discount = Calc.Convert.D(args[2]);
                    var dsm;
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (discount <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    dsm = __toOADate(maturity) - __toOADate(settlement);
                    if (dsm > 365.0)
                    {
                        return CalcErrorsNumber
                    }
                    var p1 = 365.0 * discount;
                    var p2 = (360.0 - discount * dsm);
                    if (p2 === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    else if (p2 < 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    return Calc.Convert.toResult(p1 / p2)
                }
                function fi_tbillyield(args)
                {
                    var settlement = Calc.Convert.DT(args[0]);
                    var maturity = Calc.Convert.DT(args[1]);
                    var pr = Calc.Convert.D(args[2]);
                    var dsm;
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (pr <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    dsm = __toOADate(maturity) - __toOADate(settlement);
                    if (dsm > 365.0)
                    {
                        return CalcErrorsNumber
                    }
                    return ((100.0 - pr) / pr) * (360.0 / dsm)
                }
                function __irr_npv(rate, y, vals)
                {
                    var n = vals.length;
                    var sum = 0.0;
                    var f = 1.0;
                    var ff = 1.0 / (rate + 1.0);
                    var i;
                    for (i = 0; i < n; i++)
                    {
                        sum += vals[i] * f;
                        f *= ff
                    }
                    y = sum;
                    return [true, y]
                }
                function __irr_npv_df(rate, y, vals)
                {
                    var n = vals.length;
                    var sum = 0.0;
                    var f = 1.0;
                    var ff = 1.0 / (rate + 1.0);
                    var i;
                    for (i = 1; i < n; i++)
                    {
                        sum += vals[i] * (-i) * f;
                        f *= ff
                    }
                    y = sum;
                    return [true, y]
                }
                function __irr_goal_seek_newton(data, vals, x0)
                {
                    var iterations;
                    var precision = data.precision / 2.0;
                    for (iterations = 0; iterations < 20; iterations++)
                    {
                        var x1,
                            stepsize;
                        var status;
                        var y0 = 0.0;
                        var df0 = 0.0;
                        if (x0 < data.xmin || x0 > data.xmax)
                        {
                            return [false, data]
                        }
                        var resultArray = __irr_npv(x0, y0, vals);
                        y0 = resultArray[1];
                        status = resultArray[0];
                        if (!status)
                        {
                            return [status, data]
                        }
                        resultArray = __update_data(x0, y0, data);
                        data = resultArray[1];
                        if (resultArray[0])
                        {
                            return [true, data]
                        }
                        resultArray = __irr_npv_df(x0, df0, vals);
                        df0 = resultArray[1];
                        status = resultArray[0];
                        if (!status)
                        {
                            return [status, data]
                        }
                        if (df0 === 0)
                        {
                            return [false, data]
                        }
                        x1 = x0 - 1.000001 * y0 / df0;
                        if (x1 === x0)
                        {
                            data.root = x0;
                            return [true, data]
                        }
                        stepsize = Math_abs(x1 - x0) / (Math_abs(x0) + Math_abs(x1));
                        x0 = x1;
                        if (stepsize < precision)
                        {
                            data.root = x0;
                            return [true, data]
                        }
                    }
                    return [false, data]
                }
                function __irr_goal_seek_point(data, vals, x0)
                {
                    var status;
                    var y0 = 0.0;
                    if (x0 < data.xmin || x0 > data.xmax)
                    {
                        return [false, data]
                    }
                    var resultArray = __irr_npv(x0, y0, vals);
                    y0 = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, data]
                    }
                    resultArray = __update_data(x0, y0, data);
                    data = resultArray[1];
                    if (resultArray[0])
                    {
                        return [true, data]
                    }
                    return [false, data]
                }
                function _irr_fake_df(x, dfx, xstep, data, vals)
                {
                    var xl,
                        xr;
                    var status;
                    var yl = 0.0;
                    var yr = 0.0;
                    xl = x - xstep;
                    if (xl < data.xmin)
                    {
                        xl = x
                    }
                    xr = x + xstep;
                    if (xr > data.xmax)
                    {
                        xr = x
                    }
                    if (xl === xr)
                    {
                        return [false, dfx, data]
                    }
                    var resultArray = __irr_npv(xl, yl, vals);
                    yl = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, dfx, data]
                    }
                    resultArray = __irr_npv(xr, yr, vals);
                    yr = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, dfx, data]
                    }
                    dfx = (yr - yl) / (xr - xl);
                    return [true, dfx, data]
                }
                function __irr_replaceGoto(data, vals, stepsize, newton_submethod, xmid, ymid, status, method)
                {
                    switch (method)
                    {
                        case 0:
                            xmid = data.xpos - data.ypos * ((data.xneg - data.xpos) / (data.yneg - data.ypos));
                            break;
                        case 1:
                            var det;
                            xmid = (data.xpos + data.xneg) / 2.0;
                            var resultArray = __irr_npv(xmid, ymid, vals);
                            ymid = resultArray[1];
                            status = resultArray[0];
                            if (!status)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            if (ymid === 0)
                            {
                                data = __update_data(xmid, ymid, data)[1];
                                return [true, data, newton_submethod, xmid, ymid, method]
                            }
                            det = Math_sqrt(ymid * ymid - data.ypos * data.yneg);
                            if (det === 0)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            xmid += (xmid - data.xpos) * ymid / det;
                            break;
                        case 3:
                            xmid = (data.xpos + data.xneg) / 2.0;
                            break;
                        case 2:
                            var x0,
                                xstep;
                            var y0 = 0.0;
                            var df0 = 0.0;
                            if (stepsize > 0.1)
                            {
                                method = 3;
                                return __irr_replaceGoto(data, vals, stepsize, newton_submethod, xmid, ymid, status, method)
                            }
                            switch (newton_submethod++ % 4)
                            {
                                case 0:
                                    x0 = data.xpos;
                                    x0 = data.ypos;
                                    break;
                                case 2:
                                    x0 = data.xneg;
                                    y0 = data.yneg;
                                    break;
                                default:
                                case 3:
                                case 1:
                                    x0 = (data.xpos + data.xneg) / 2.0;
                                    var resultArray2 = __irr_npv(x0, y0, vals);
                                    y0 = resultArray2[1];
                                    status = resultArray2[0];
                                    if (!status)
                                    {
                                        return [keyword_null, data, newton_submethod, xmid, ymid, method]
                                    }
                                    break
                            }
                            xstep = Math_abs(data.xpos - data.xneg) / 1.0e6;
                            var resultArray3 = _irr_fake_df(x0, df0, xstep, data, vals);
                            data = resultArray3[2];
                            df0 = resultArray3[1];
                            status = resultArray3[0];
                            if (!status)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            if (df0 === 0)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            xmid = x0 - 1.01 * y0 / df0;
                            if ((xmid < data.xpos && xmid < data.xneg) || (xmid > data.xpos && xmid > data.xneg))
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            break;
                        default:
                            return [false, data, newton_submethod, xmid, ymid, method]
                    }
                    return [false, data, newton_submethod, xmid, ymid, method]
                }
                function __irr_goal_seek_bisection(data, vals)
                {
                    var iterations;
                    var stepsize;
                    var newton_submethod = 0;
                    if (!data.havexpos || !data.havexneg)
                    {
                        return [false, data]
                    }
                    stepsize = Math_abs(data.xpos - data.xneg) / (Math_abs(data.xpos) + Math_abs(data.xneg));
                    for (iterations = 0; iterations < 100 + 15 * 4; iterations++)
                    {
                        var xmid;
                        var ymid = 0.0;
                        var status;
                        var method = 0;
                        method = (iterations % 4 === 0) ? 1 : ((iterations % 4 === 2) ? 2 : 3);
                        var resultOfGoto = __irr_replaceGoto(data, vals, stepsize, newton_submethod, xmid, ymid, status, method);
                        data = resultOfGoto[1];
                        newton_submethod = resultOfGoto[2];
                        xmid = resultOfGoto[3];
                        ymid = resultOfGoto[4];
                        method = resultOfGoto[5];
                        if (resultOfGoto[0] === keyword_null)
                        {
                            continue
                        }
                        else if (resultOfGoto[0])
                        {
                            return [true, data]
                        }
                        var resultArray = __irr_npv(xmid, ymid, vals);
                        ymid = resultArray[1];
                        status = resultArray[0];
                        if (!status)
                        {
                            continue
                        }
                        resultArray = __update_data(xmid, ymid, data);
                        data = resultArray[1];
                        if (resultArray[0])
                        {
                            return [true, data]
                        }
                        stepsize = Math_abs(data.xpos - data.xneg) / (Math_abs(data.xpos) + Math_abs(data.xneg));
                        if (stepsize < data.precision)
                        {
                            if (data.yneg < ymid)
                            {
                                ymid = data.yneg;
                                xmid = data.xneg
                            }
                            if (data.ypos < ymid)
                            {
                                ymid = data.ypos;
                                xmid = data.xpos
                            }
                            data.root = xmid;
                            return [true, data]
                        }
                    }
                    return [false, data]
                }
                function fi_irr(args)
                {
                    var data = {};
                    data.xmin = 0.0;
                    data.xmax = 0.0;
                    data.precision = 0.0;
                    data.havexpos = false;
                    data.xpos = 0.0;
                    data.ypos = 0.0;
                    data.havexneg = false;
                    data.xneg = 0.0;
                    data.yneg = 0.0;
                    data.root = 0.0;
                    data = __goal_seek_initialise(data);
                    var Convert = CalcConvert,
                        _Helper = Calc._Helper;
                    var a1 = Convert.toArr(args[0], 1, true, true, false);
                    if (a1.isError)
                    {
                        return a1[0]
                    }
                    var len = a1.length;
                    if (len < 2)
                    {
                        return CalcErrorsNumber
                    }
                    var guess = _Helper._argumentExists(args, 1) ? Convert.D(args[1]) : 0.10;
                    if (Math_abs(guess) > 1)
                    {
                        guess = 0.10
                    }
                    var DOUBLE_MAXVALUE = 1.79769e+308;
                    var vals = [];
                    data.xmin = -1;
                    data.xmax = Math_min(data.xmax, Math_pow(DOUBLE_MAXVALUE / 1.0e10, 1.0 / len) - 1);
                    var posVal = false;
                    var negVal = false;
                    for (var j = 0; j < len; j++)
                    {
                        var obj = a1[j];
                        if (obj !== Convert.CalcConvertedError)
                        {
                            vals[j] = obj;
                            if (obj > 0)
                            {
                                posVal = true
                            }
                            if (obj < 0)
                            {
                                negVal = true
                            }
                        }
                    }
                    if (!posVal || !negVal)
                    {
                        return CalcErrorsNumber
                    }
                    var resultArray = __irr_goal_seek_newton(data, vals, guess);
                    data = resultArray[1];
                    var status = resultArray[0];
                    if (!status)
                    {
                        var factor;
                        for (factor = 2; !(data.havexneg && data.havexpos) && factor < 100; factor *= 2)
                        {
                            data = __irr_goal_seek_point(data, vals, guess * factor)[1];
                            data = __irr_goal_seek_point(data, vals, guess / factor)[1]
                        }
                        resultArray = __irr_goal_seek_bisection(data, vals);
                        data = resultArray[1];
                        status = resultArray[0]
                    }
                    if (status)
                    {
                        return data.root
                    }
                    else
                    {
                        return CalcErrorsNumber
                    }
                }
                function fi_mirr(args)
                {
                    var frate = Calc.Convert.D(args[1]);
                    var rrate = Calc.Convert.D(args[2]);
                    var pos = 0;
                    var neg = 0;
                    var n = 0;
                    var posnpv = 0.0;
                    var negnpv = 0.0;
                    var vals = [];
                    var array = Calc.Convert.toArr(args[0], 1, true, true, false);
                    if (array.isError)
                    {
                        return array[0]
                    }
                    if (array.length < 2)
                    {
                        return CalcErrorsDivideByZero
                    }
                    var length = array.length;
                    for (var k = 0; k < length; k++)
                    {
                        var o = array[k];
                        if (o !== Calc.Convert.CalcConvertedError)
                        {
                            vals[k] = o;
                            if (o >= 0.0)
                            {
                                pos++
                            }
                            else
                            {
                                neg++
                            }
                        }
                    }
                    n = neg + pos;
                    for (var i = 0; i < n; i++)
                    {
                        var v = vals[i];
                        if (v >= 0.0)
                        {
                            posnpv += v / Math_pow(1.0 + rrate, i)
                        }
                        else
                        {
                            negnpv += v / Math_pow(1.0 + frate, i)
                        }
                    }
                    if (negnpv === 0.0 || posnpv === 0.0 || rrate <= -1.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    var res = Math_pow((-posnpv * Math_pow(1.0 + rrate, n)) / (negnpv * (1.0 + rrate)), (1.0 / (n - 1.0))) - 1.0;
                    return res
                }
                function __xirr_f(rate, y, dates, values)
                {
                    var sum = 0.0;
                    var n = values.length;
                    for (var i = 0; i < n; i++)
                    {
                        var d = __toOADate(dates[i]) - __toOADate(dates[0]);
                        if (d < 0.0)
                        {
                            return [false, y]
                        }
                        sum += values[i] / Functions._MathHelper.pow1p(rate, d / 365.0)
                    }
                    if (!isFinite(sum))
                    {
                        if (sum === Number.POSITIVE_INFINITY)
                        {
                            y = 1.79769e+308
                        }
                        else if (sum === Number.NEGATIVE_INFINITY)
                        {
                            y = -1.79769e+308
                        }
                    }
                    else if (isNaN(sum))
                    {
                        y = 4.94066e-324
                    }
                    else
                    {
                        y = sum
                    }
                    return [true, y]
                }
                function __xirr_fake_df(x, dfx, xstep, data, dates, values)
                {
                    var xl,
                        xr;
                    var status;
                    var yl = 0.0;
                    var yr = 0.0;
                    xl = x - xstep;
                    if (xl < data.xmin)
                    {
                        xl = x
                    }
                    xr = x + xstep;
                    if (xr > data.xmax)
                    {
                        xr = x
                    }
                    if (xl === xr)
                    {
                        return [false, dfx, data]
                    }
                    var resultArray = __xirr_f(xl, yl, dates, values);
                    yl = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, dfx, data]
                    }
                    resultArray = __xirr_f(xr, yr, dates, values);
                    yr = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, dfx, data]
                    }
                    dfx = (yr - yl) / (xr - xl);
                    return [true, dfx, data]
                }
                function __xirr_goal_seek_newton(data, dates, values, x0)
                {
                    var iterations;
                    var status;
                    var precision = data.precision / 2.0;
                    for (iterations = 0; iterations < 20; iterations++)
                    {
                        var x1,
                            stepsize;
                        var y0 = 0.0;
                        var df0 = 0.0;
                        var resultArray = __xirr_f(x0, y0, dates, values);
                        y0 = resultArray[1];
                        status = resultArray[0];
                        if (!status)
                        {
                            return [status, data]
                        }
                        resultArray = __update_data(x0, y0, data);
                        data = resultArray[1];
                        if (resultArray[0])
                        {
                            return [true, data]
                        }
                        var xstep;
                        if (Math_abs(x0) < 1.0e-10)
                        {
                            if (data.havexneg && data.havexpos)
                            {
                                xstep = Math_abs(data.xpos - data.xneg) / 1.0e6
                            }
                            else
                            {
                                xstep = (data.xmax - data.xmin) / 1.0e6
                            }
                        }
                        else
                        {
                            xstep = Math_abs(x0) / 1.0e6
                        }
                        var resultArray3 = __xirr_fake_df(x0, df0, xstep, data, dates, values);
                        status = resultArray3[0];
                        df0 = resultArray3[1];
                        data = resultArray3[2];
                        if (!status)
                        {
                            return [status, data]
                        }
                        if (df0 === 0)
                        {
                            return [false, data]
                        }
                        x1 = x0 - 1.000001 * y0 / df0;
                        if (x1 === x0)
                        {
                            data.root = x0;
                            return [true, data]
                        }
                        stepsize = Math_abs(x1 - x0) / (Math_abs(x0) + Math_abs(x1));
                        x0 = x1;
                        if (stepsize < precision)
                        {
                            data.root = x0;
                            return [true, data]
                        }
                    }
                    return [false, data]
                }
                function __xirr_goal_seek_point(data, x0, y, dates, values)
                {
                    var status;
                    var y0 = 0.0;
                    if (x0 < data.xmin || x0 > data.xmax)
                    {
                        return [false, data, y]
                    }
                    var resultArray = __xirr_f(x0, y, dates, values);
                    y = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, data, y]
                    }
                    resultArray = __update_data(x0, y0, data);
                    data = resultArray[1];
                    if (resultArray[0])
                    {
                        return [true, data, y]
                    }
                    return [false, data, y]
                }
                function __xirr_replaceGoto(data, dates, values, stepsize, newton_submethod, xmid, ymid, status, method)
                {
                    switch (method)
                    {
                        case 0:
                            xmid = data.xpos - data.ypos * ((data.xneg - data.xpos) / (data.yneg - data.ypos));
                            break;
                        case 1:
                            var det;
                            xmid = (data.xpos + data.xneg) / 2.0;
                            var resultArray = __xirr_f(xmid, ymid, dates, values);
                            ymid = resultArray[1];
                            status = resultArray[0];
                            if (!status)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            if (ymid === 0.0)
                            {
                                data = __update_data(xmid, ymid, data)[1];
                                return [true, data, newton_submethod, xmid, ymid, method]
                            }
                            det = Math_sqrt(ymid * ymid - data.ypos * data.yneg);
                            if (det === 0)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            xmid += (xmid - data.xpos) * ymid / det;
                            break;
                        case 3:
                            xmid = (data.xpos + data.xneg) / 2.0;
                            break;
                        case 2:
                            var x0 = 0.0;
                            var y0 = 0.0;
                            var xstep = 0.0;
                            var df0 = 0.0;
                            if (stepsize > 0.1)
                            {
                                method = 3;
                                return __xirr_replaceGoto(data, dates, values, stepsize, newton_submethod, xmid, ymid, status, method)
                            }
                            switch (newton_submethod++ % 4)
                            {
                                case 0:
                                    x0 = data.xpos;
                                    x0 = data.ypos;
                                    break;
                                case 2:
                                    x0 = data.xneg;
                                    y0 = data.yneg;
                                    break;
                                default:
                                case 3:
                                case 1:
                                    x0 = (data.xpos + data.xneg) / 2.0;
                                    var resultArray2 = __xirr_f(x0, y0, dates, values);
                                    y0 = resultArray2[1];
                                    status = resultArray2[0];
                                    if (!status)
                                    {
                                        return [keyword_null, data, newton_submethod, xmid, ymid, method]
                                    }
                                    break
                            }
                            xstep = Math_abs(data.xpos - data.xneg) / 1e6;
                            var resultArray3 = __xirr_fake_df(x0, df0, xstep, data, dates, values);
                            data = resultArray3[2];
                            df0 = resultArray3[1];
                            status = resultArray3[0];
                            if (!status)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            if (df0 === 0)
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            xmid = x0 - 1.01 * y0 / df0;
                            if ((xmid < data.xpos && xmid < data.xneg) || (xmid > data.xpos && xmid > data.xneg))
                            {
                                return [keyword_null, data, newton_submethod, xmid, ymid, method]
                            }
                            break;
                        default:
                            break
                    }
                    return [false, data, newton_submethod, xmid, ymid, method]
                }
                function __xirr_goal_seek_bisection(data, dates, values)
                {
                    var iterations;
                    var stepsize;
                    var newton_submethod = 0;
                    if (!data.havexpos || !data.havexneg)
                    {
                        return [false, data]
                    }
                    stepsize = Math_abs(data.xpos - data.xneg) / (Math_abs(data.xpos) + Math_abs(data.xneg));
                    for (iterations = 0; iterations < 100 + 2 * 4; iterations++)
                    {
                        var xmid = 0.0;
                        var ymid = 0.0;
                        var status;
                        var method;
                        method = (iterations % 4 === 0) ? 1 : ((iterations % 4 === 2) ? 2 : 3);
                        var resultOfGoto = __xirr_replaceGoto(data, dates, values, stepsize, newton_submethod, xmid, ymid, status, method);
                        data = resultOfGoto[1];
                        newton_submethod = resultOfGoto[2];
                        xmid = resultOfGoto[3];
                        ymid = resultOfGoto[4];
                        method = resultOfGoto[5];
                        if (!resultOfGoto[0])
                        {
                            continue
                        }
                        else if (resultOfGoto[0])
                        {
                            return [true, data]
                        }
                        var resultArray = __xirr_f(xmid, ymid, dates, values);
                        ymid = resultArray[1];
                        status = resultArray[0];
                        if (!status)
                        {
                            continue
                        }
                        resultArray = __update_data(xmid, ymid, data);
                        data = resultArray[1];
                        if (resultArray[0])
                        {
                            return [true, data]
                        }
                        stepsize = Math_abs(data.xpos - data.xneg) / (Math_abs(data.xpos) + Math_abs(data.xneg));
                        if (stepsize < data.precision)
                        {
                            if (data.yneg < ymid)
                            {
                                ymid = data.yneg;
                                xmid = data.xneg
                            }
                            if (data.ypos < ymid)
                            {
                                ymid = data.ypos;
                                xmid = data.xpos
                            }
                            data.root = xmid;
                            return [true, data]
                        }
                    }
                    return [false, data]
                }
                function fi_xirr(args)
                {
                    var convert = Calc.Convert;
                    var values = convert.toArr(args[0], 1, true, true, true);
                    var dates = convert.toArr(args[1], 4, true, true, true);
                    if (values.isError)
                    {
                        return values[0]
                    }
                    if (dates.isError)
                    {
                        return dates[0]
                    }
                    if (values.isConvertError || dates.isConvertError)
                    {
                        return CalcErrorsValue
                    }
                    var length1 = values.length;
                    var length2 = dates.length;
                    if (length1 !== length2)
                    {
                        return CalcErrorsNumber
                    }
                    var guess = Calc._Helper._argumentExists(args, 2) ? CalcConvert.D(args[2]) : 0.1;
                    var data = {};
                    data.xmin = 0.0;
                    data.xmax = 0.0;
                    data.precision = 0.0;
                    data.havexpos = false;
                    data.xpos = 0.0;
                    data.ypos = 0.0;
                    data.havexneg = false;
                    data.xneg = 0.0;
                    data.yneg = 0.0;
                    data.root = 0.0;
                    data = __goal_seek_initialise(data);
                    data.xmin = -1;
                    data.xmax = Math_min(1000, data.xmax);
                    var resultArray = __xirr_goal_seek_newton(data, dates, values, guess);
                    data = resultArray[1];
                    if (resultArray[0])
                    {
                        return data.root
                    }
                    else
                    {
                        var i;
                        var status;
                        for (i = 1; i <= 1024; i += i)
                        {
                            var ii = CalcConvert.D(i);
                            var y = (-1.0 + 10.0) / (ii + 9.0);
                            var resultArray2 = __xirr_goal_seek_point(data, guess, y, dates, values);
                            data = resultArray2[1];
                            y = resultArray2[2];
                            y = ii;
                            resultArray2 = __xirr_goal_seek_point(data, guess, y, dates, values);
                            data = resultArray2[1];
                            y = resultArray2[2];
                            var resultArray3 = __xirr_goal_seek_bisection(data, dates, values);
                            data = resultArray3[1];
                            status = resultArray3[0];
                            if (status)
                            {
                                return data.root
                            }
                        }
                        return CalcErrorsNumber
                    }
                }
                function __get_amordegrc(fCost, nDate, nFirstPer, fRestVal, nPer, fRate, nBase)
                {
                    var n;
                    var fAmorCoeff,
                        fNRate,
                        fRest,
                        fUsePer;
                    fUsePer = 1.0 / fRate;
                    if (fUsePer < 3.0)
                    {
                        fAmorCoeff = 1.0
                    }
                    else if (fUsePer < 5.0)
                    {
                        fAmorCoeff = 1.5
                    }
                    else if (fUsePer <= 6.0)
                    {
                        fAmorCoeff = 2.0
                    }
                    else
                    {
                        fAmorCoeff = 2.5
                    }
                    fRate *= fAmorCoeff;
                    var o = Functions._DateHelper.yearfrac([nDate, nFirstPer, nBase]);
                    if (CalcConvert.err(o))
                    {
                        return 0.0
                    }
                    var val = o;
                    fNRate = Math_floor((val * fRate * fCost) + 0.5);
                    fCost -= fNRate;
                    fRest = fCost - fRestVal;
                    for (n = 0; n < nPer; n++)
                    {
                        fNRate = Math_floor((fRate * fCost) + 0.5);
                        fRest -= fNRate;
                        if (fRest < 0.0)
                        {
                            switch (nPer - n)
                            {
                                case 0:
                                case 1:
                                    return Math_floor((fCost * 0.5) + 0.5);
                                default:
                                    return 0.0
                            }
                        }
                        fCost -= fNRate
                    }
                    return fNRate
                }
                function fi_amordegrc(args)
                {
                    var cost = CalcConvert.D(args[0]);
                    var purchased = CalcConvert.DT(args[1]);
                    var firstPer = CalcConvert.DT(args[2]);
                    var salvage = CalcConvert.D(args[3]);
                    var per = CalcConvert.I(args[4]);
                    var rate = CalcConvert.D(args[5]);
                    var basis = Calc._Helper._argumentExists(args, 6) ? CalcConvert.I(args[6]) : 0;
                    var errCheck = 1.0 / rate;
                    if ((errCheck > 0 && errCheck < 1) || (errCheck > 1 && errCheck < 2) || (errCheck > 2 && errCheck < 3) || (errCheck > 4 && errCheck < 5))
                    {
                        return CalcErrorsNumber
                    }
                    if (__compareDateTime(purchased, firstPer) > 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (basis < 0 || basis > 4 || rate <= 0.0 || basis === 2)
                    {
                        return CalcErrorsNumber
                    }
                    return __get_amordegrc(cost, purchased, firstPer, salvage, per, rate, basis)
                }
                function __get_amorlinc(fCost, nDate, nFirstPer, fRestVal, nPer, fRate, nBase)
                {
                    var fOneRate = fCost * fRate;
                    var fCostDelta = fCost - fRestVal;
                    var o = Functions._DateHelper.yearfrac([nDate, nFirstPer, nBase]);
                    if (CalcConvert.err(o))
                    {
                        return 0.0
                    }
                    var val = o;
                    var f0Rate = val * fRate * fCost;
                    var multiplier = (fCost - fRestVal - f0Rate) / fOneRate;
                    var nNumOfFullPeriods = CalcConvert.I((fCost - fRestVal - f0Rate) / fOneRate);
                    var result;
                    if (nPer === 0)
                    {
                        result = f0Rate
                    }
                    else if (nPer <= nNumOfFullPeriods)
                    {
                        result = fOneRate * (multiplier < 1.0 ? multiplier : 1.0)
                    }
                    else if (nPer === nNumOfFullPeriods + 1)
                    {
                        result = fCostDelta - fOneRate * nNumOfFullPeriods - f0Rate
                    }
                    else
                    {
                        result = 0.0
                    }
                    return result
                }
                function fi_amorlinc(args)
                {
                    var cost = CalcConvert.D(args[0]);
                    var purchased = CalcConvert.DT(args[1]);
                    var firstPer = CalcConvert.DT(args[2]);
                    var salvage = CalcConvert.D(args[3]);
                    var per = CalcConvert.I(args[4]);
                    var rate = CalcConvert.D(args[5]);
                    var basis = Calc._Helper._argumentExists(args, 6) ? CalcConvert.I(args[6]) : 0;
                    if (__compareDateTime(purchased, firstPer) > 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (basis < 0 || basis > 4 || rate <= 0.0 || basis === 2)
                    {
                        return CalcErrorsNumber
                    }
                    return __get_amorlinc(cost, purchased, firstPer, salvage, per, rate, basis)
                }
                function fi_db(args)
                {
                    var cost = CalcConvert.D(args[0]);
                    var salvage = CalcConvert.D(args[1]);
                    var life = CalcConvert.I(args[2]);
                    var period = CalcConvert.I(args[3]);
                    var month = Calc._Helper._argumentExists(args, 4) ? CalcConvert.I(args[4]) : 12;
                    var lastPeriod = life + (month < 12 ? 1 : 0);
                    if (cost < 0.0 || life < 1 || period < 1 || lastPeriod < period || month < 1 || 12 < month)
                    {
                        return CalcErrorsNumber
                    }
                    if (cost === 0.0)
                    {
                        return 0.0
                    }
                    var rate = Functions._MathHelper.round(1.0 - Math_pow(salvage / cost, 1.0 / life), 3);
                    var total = 0.0;
                    var result = 0.0;
                    for (var i = 1; i <= period; i++)
                    {
                        if (i === 1)
                        {
                            result = cost * rate * month / 12.0
                        }
                        else if (i === life + 1)
                        {
                            result = (cost - total) * rate * (12.0 - month) / 12.0
                        }
                        else
                        {
                            result = (cost - total) * rate
                        }
                        total += result
                    }
                    return result
                }
                function fi_ddb(args)
                {
                    var cost = CalcConvert.D(args[0]);
                    var salvage = CalcConvert.D(args[1]);
                    var life = CalcConvert.I(args[2]);
                    var period = CalcConvert.I(args[3]);
                    var factor = Calc._Helper._argumentExists(args, 4) ? CalcConvert.D(args[4]) : 2.0;
                    var total = 0.0;
                    var result = 0.0;
                    if (life <= 0 || cost < 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (life < period)
                    {
                        return CalcErrorsNumber
                    }
                    if (factor <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (period <= 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (cost <= salvage)
                    {
                        return 0.0
                    }
                    for (var i = 1; i <= period; i++)
                    {
                        result = (cost - total) * (factor / life);
                        result = Math_min(result, cost - total - salvage);
                        total += result
                    }
                    return result
                }
                function fi_sln(args)
                {
                    var cost = CalcConvert.D(args[0]);
                    var salvage = CalcConvert.D(args[1]);
                    var life = CalcConvert.I(args[2]);
                    if (life === 0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return (cost - salvage) / life
                }
                function fi_syd(args)
                {
                    var cost = CalcConvert.D(args[0]);
                    var salvage = CalcConvert.D(args[1]);
                    var life = CalcConvert.I(args[2]);
                    var per = CalcConvert.I(args[3]);
                    if (salvage < 0.0 || life < 1 || per <= 0 || per > life)
                    {
                        return CalcErrorsNumber
                    }
                    return ((cost - salvage) * (life - per + 1) * 2) / (life * (life + 1))
                }
                function __ScGetGDA(fWert, fRest, fDauer, fPeriode, fFaktor)
                {
                    var fGda,
                        fZins,
                        fAlterWert,
                        fNeuerWert;
                    fZins = fFaktor / fDauer;
                    if (fZins >= 1.0)
                    {
                        fZins = 1.0;
                        if (fPeriode === 1.0)
                        {
                            fAlterWert = fWert
                        }
                        else
                        {
                            fAlterWert = 0.0
                        }
                    }
                    else
                    {
                        fAlterWert = fWert * Math_pow(1.0 - fZins, fPeriode - 1.0)
                    }
                    fNeuerWert = fWert * Math_pow(1.0 - fZins, fPeriode);
                    if (fNeuerWert < fRest)
                    {
                        fGda = fAlterWert - fRest
                    }
                    else
                    {
                        fGda = fAlterWert - fNeuerWert
                    }
                    if (fGda < 0.0)
                    {
                        fGda = 0.0
                    }
                    return fGda
                }
                function __ScInterVDB(cost, salvage, life, life1, period, factor)
                {
                    var fVdb = 0;
                    var fIntEnd = Math_ceil(period);
                    var nLoopEnd = CalcConvert.I(fIntEnd);
                    var fTerm,
                        fLia;
                    var fRestwert = cost - salvage;
                    var bNowLia = false;
                    var fGda;
                    var i;
                    fLia = 0;
                    for (i = 1; i <= nLoopEnd; i++)
                    {
                        if (!bNowLia)
                        {
                            fGda = __ScGetGDA(cost, salvage, life, i, factor);
                            fLia = fRestwert / (life1 - (i - 1));
                            if (fLia > fGda)
                            {
                                fTerm = fLia;
                                bNowLia = true
                            }
                            else
                            {
                                fTerm = fGda;
                                fRestwert -= fGda
                            }
                        }
                        else
                        {
                            fTerm = fLia
                        }
                        if (i === nLoopEnd)
                        {
                            fTerm *= (period + 1.0 - fIntEnd)
                        }
                        fVdb += fTerm
                    }
                    return fVdb
                }
                function __get_vdb(cost, salvage, life, start_period, end_period, factor, flag)
                {
                    var fVdb;
                    var fIntStart = Math_floor(start_period);
                    var fIntEnd = Math_ceil(end_period);
                    var i;
                    var nLoopStart = CalcConvert.I(fIntStart);
                    var nLoopEnd = CalcConvert.I(fIntEnd);
                    fVdb = 0.0;
                    if (flag)
                    {
                        for (i = nLoopStart + 1; i <= nLoopEnd; i++)
                        {
                            var fTerm;
                            fTerm = __ScGetGDA(cost, salvage, life, i, factor);
                            if (i === nLoopStart + 1)
                            {
                                fTerm *= (Math_min(end_period, fIntStart + 1.0) - start_period)
                            }
                            else if (i === nLoopEnd)
                            {
                                fTerm *= (end_period + 1.0 - fIntEnd)
                            }
                            fVdb += fTerm
                        }
                    }
                    else
                    {
                        var life1 = life;
                        var fPart;
                        if (start_period !== Math_floor(start_period))
                        {
                            if (factor > 1.0)
                            {
                                if (start_period >= life / 2.0)
                                {
                                    fPart = start_period - life / 2.0;
                                    start_period = life / 2.0;
                                    end_period -= fPart;
                                    life1 += 1.0
                                }
                            }
                        }
                        cost -= __ScInterVDB(cost, salvage, life, life1, start_period, factor);
                        fVdb = __ScInterVDB(cost, salvage, life, life - start_period, end_period - start_period, factor)
                    }
                    return fVdb
                }
                function fi_vdb(args)
                {
                    var cost = CalcConvert.D(args[0]);
                    var salvage = CalcConvert.D(args[1]);
                    var life = CalcConvert.I(args[2]);
                    var start = CalcConvert.D(args[3]);
                    var end = CalcConvert.D(args[4]);
                    var factor = Calc._Helper._argumentExists(args, 5) ? CalcConvert.D(args[5]) : 2.0;
                    var noswitch = Calc._Helper._argumentExists(args, 6) ? CalcConvert.B(args[6]) : false;
                    if (cost < 0.0 || salvage < 0.0 || life < 0 || start < 0 || end < 0 || end < start)
                    {
                        return CalcErrorsNumber
                    }
                    if (cost < salvage && start === 0.0 && end === 1.0)
                    {
                        return cost - salvage
                    }
                    return __get_vdb(cost, salvage, life, start, end, factor, noswitch)
                }
                function fi_accrint(args)
                {
                    var maturity = CalcConvert.DT(args[0]);
                    var first_interest = CalcConvert.DT(args[1]);
                    var settlement = CalcConvert.DT(args[2]);
                    var rate = CalcConvert.D(args[3]);
                    var par = Calc._Helper._argumentExists(args, 4) ? CalcConvert.D(args[4]) : 1000.0;
                    var freq = CalcConvert.I(args[5]);
                    var basis = Calc._Helper._argumentExists(args, 6) ? CalcConvert.I(args[6]) : 0;
                    var calc_method = Calc._Helper._argumentExists(args, 7) ? CalcConvert.B(args[7]) : true;
                    var a,
                        d,
                        coefficient,
                        x;
                    if (rate <= 0.0 || par <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (basis < 0 || 4 < basis)
                    {
                        return CalcErrorsNumber
                    }
                    if (!(freq === 1 || freq === 2 || freq === 4))
                    {
                        return CalcErrorsNumber
                    }
                    if (__compareDateTime(maturity, settlement) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    a = __days_monthly_basis(maturity, settlement, basis);
                    d = __annual_year_basis(maturity, basis);
                    if (a < 0 || d <= 0)
                    {
                        return CalcErrorsNumber
                    }
                    coefficient = par * rate / CalcConvert.D(freq);
                    x = a / d;
                    return coefficient * CalcConvert.D(freq) * x
                }
                function fi_accrintm(args)
                {
                    var issue = CalcConvert.DT(args[0]);
                    var maturity = CalcConvert.DT(args[1]);
                    var rate = CalcConvert.D(args[2]);
                    var par = Calc._Helper._argumentExists(args, 3) ? CalcConvert.D(args[3]) : 1000.0;
                    var basis = Calc._Helper._argumentExists(args, 4) ? CalcConvert.I(args[4]) : 0;
                    var a,
                        d;
                    if (rate <= 0.0 || par <= 0.0 || basis < 0 || 4 < basis)
                    {
                        return CalcErrorsNumber
                    }
                    if (__compareDateTime(issue, maturity) > 0)
                    {
                        return CalcErrorsNumber
                    }
                    a = __days_monthly_basis(issue, maturity, basis);
                    d = __annual_year_basis(issue, basis);
                    if (a < 0 || d <= 0)
                    {
                        return CalcErrorsNumber
                    }
                    return par * rate * a / d
                }
                function fi_disc(args)
                {
                    var settlement = CalcConvert.DT(args[0]);
                    var maturity = CalcConvert.DT(args[1]);
                    var par = CalcConvert.D(args[2]);
                    var redemption = CalcConvert.D(args[3]);
                    var basis = Calc._Helper._argumentExists(args, 4) ? CalcConvert.I(args[4]) : 0;
                    var dsm,
                        b;
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (par <= 0.0 || redemption <= 0.0 || basis < 0 || 4 < basis)
                    {
                        return CalcErrorsNumber
                    }
                    b = __annual_year_basis(settlement, basis);
                    dsm = __days_monthly_basis(settlement, maturity, basis);
                    if (dsm <= 0 || b <= 0)
                    {
                        return CalcErrorsNumber
                    }
                    return (redemption - par) / redemption * (b / dsm)
                }
                function fi_effect(args)
                {
                    var rate = CalcConvert.D(args[0]);
                    var nper = CalcConvert.I(args[1]);
                    if (rate <= 0.0 || nper < 1)
                    {
                        return CalcErrorsNumber
                    }
                    return Math_pow((1.0 + rate / nper), nper) - 1.0
                }
                function fi_intrate(args)
                {
                    var settlement = CalcConvert.DT(args[0]);
                    var maturity = CalcConvert.DT(args[1]);
                    var investment = CalcConvert.D(args[2]);
                    var redemption = CalcConvert.D(args[3]);
                    var basis = Calc._Helper._argumentExists(args, 4) ? CalcConvert.I(args[4]) : 0;
                    var a,
                        d;
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (investment <= 0.0 || redemption <= 0.0 || basis < 0 || 4 < basis)
                    {
                        return CalcErrorsNumber
                    }
                    a = __days_monthly_basis(settlement, maturity, basis);
                    d = __annual_year_basis(settlement, basis);
                    if (a <= 0 || d <= 0)
                    {
                        return CalcErrorsNumber
                    }
                    return (redemption - investment) / investment * (d / a)
                }
                function fi_nominal(args)
                {
                    var rate = CalcConvert.D(args[0]);
                    var nper = CalcConvert.I(args[1]);
                    if (rate <= 0.0 || nper < 1)
                    {
                        return CalcErrorsNumber
                    }
                    return nper * (Math_pow(1.0 + rate, 1.0 / nper) - 1.0)
                }
                function __rate_f(rate, y, user_data)
                {
                    if (rate > -1.0 && rate !== 0)
                    {
                        var data = user_data;
                        var x = Math_pow(1.0 + rate, data.nper);
                        var z = (Math_pow(1.0 + rate, data.nper) - 1.0) / rate;
                        y = data.pv * x + data.pmt * (1.0 + rate * data.type) * z + data.fv;
                        return [true, y, user_data]
                    }
                    else
                    {
                        return [false, y, user_data]
                    }
                }
                function __rate_df(rate, y, user_data)
                {
                    if (rate > -1.0 && rate !== 0.0)
                    {
                        var data = user_data;
                        var x = Math_pow(1.0 + rate, data.nper - 1.0);
                        var z = (Math_pow(1.0 + rate, data.nper) - 1.0) / rate;
                        y = -data.pmt * z / rate + x * data.nper * (data.pv + data.pmt * (data.type + 1.0 / rate));
                        return [true, y, user_data]
                    }
                    else
                    {
                        return [false, y, user_data]
                    }
                }
                function __rate_goal_seek_newton(data, user_data, x0)
                {
                    var iterations;
                    var precision = data.precision / 2.0;
                    for (iterations = 0; iterations < 100; iterations++)
                    {
                        var x1,
                            stepsize;
                        var status;
                        var y0 = 0.0;
                        var df0 = 0.0;
                        if (x0 < data.xmin || x0 > data.xmax)
                        {
                            return [false, data, user_data]
                        }
                        var resultArray = __rate_f(x0, y0, user_data);
                        user_data = resultArray[2];
                        y0 = resultArray[1];
                        status = resultArray[0];
                        if (!status)
                        {
                            return [status, data, user_data]
                        }
                        var resultArray2 = __update_data(x0, y0, data);
                        data = resultArray2[1];
                        if (resultArray2[0])
                        {
                            return [true, data, user_data]
                        }
                        resultArray = __rate_df(x0, df0, user_data);
                        user_data = resultArray[2];
                        df0 = resultArray[1];
                        status = resultArray[0];
                        if (!status)
                        {
                            return [status, data, user_data]
                        }
                        if (df0 === 0)
                        {
                            return [false, data, user_data]
                        }
                        x1 = x0 - 1.000001 * y0 / df0;
                        if (x1 === x0)
                        {
                            data.root = x0;
                            return [true, data, user_data]
                        }
                        stepsize = Math_abs(x1 - x0) / (Math_abs(x0) + Math_abs(x1));
                        x0 = x1;
                        if (stepsize < precision)
                        {
                            data.root = x0;
                            return [true, data, user_data]
                        }
                    }
                    return [false, data, user_data]
                }
                function __rate_goal_seek_point(data, user_data, x0)
                {
                    var status;
                    var y0 = 0.0;
                    if (x0 < data.xmin || x0 > data.xmax)
                    {
                        return [false, data, user_data]
                    }
                    var resultArray = __rate_f(x0, y0, user_data);
                    user_data = resultArray[2];
                    y0 = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, data, user_data]
                    }
                    var resultArray2 = __update_data(x0, y0, data);
                    data = resultArray2[1];
                    if (resultArray2[0])
                    {
                        return [true, data, user_data]
                    }
                    return [false, data, user_data]
                }
                function __rate_fake_df(x, dfx, xstep, data, user_data)
                {
                    var xl,
                        xr;
                    var status;
                    var yl = 0.0;
                    var yr = 0.0;
                    xl = x - xstep;
                    if (xl < data.xmin)
                    {
                        xl = x
                    }
                    xr = x + xstep;
                    if (xr > data.xmax)
                    {
                        xr = x
                    }
                    if (xl === xr)
                    {
                        return [false, dfx, data, user_data]
                    }
                    var resultArray = __rate_f(xl, yl, user_data);
                    user_data = resultArray[2];
                    yl = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, dfx, data, user_data]
                    }
                    resultArray = __rate_f(xr, yr, user_data);
                    user_data = resultArray[2];
                    yr = resultArray[1];
                    status = resultArray[0];
                    if (!status)
                    {
                        return [status, dfx, data, user_data]
                    }
                    dfx = (yr - yl) / (xr - xl);
                    return [true, dfx, data, user_data]
                }
                function __rate_replaceGoto(data, user_data, stepsize, newton_submethod, xmid, ymid, status, method)
                {
                    switch (method)
                    {
                        case 0:
                            xmid = data.xpos - data.ypos * ((data.xneg - data.xpos) / (data.yneg - data.ypos));
                            break;
                        case 1:
                            var det;
                            xmid = (data.xpos + data.xneg) / 2.0;
                            var resultArray = __rate_f(xmid, ymid, user_data);
                            user_data = resultArray[2];
                            ymid = resultArray[1];
                            status = resultArray[0];
                            if (!status)
                            {
                                return [keyword_null, data, user_data, newton_submethod, xmid, ymid, method]
                            }
                            if (ymid === 0)
                            {
                                data = __update_data(xmid, ymid, data)[1];
                                return [true, data, user_data, newton_submethod, xmid, ymid, method]
                            }
                            det = Math_sqrt(ymid * ymid - data.ypos * data.yneg);
                            if (det === 0)
                            {
                                return [keyword_null, data, user_data, newton_submethod, xmid, ymid, method]
                            }
                            xmid += (xmid - data.xpos) * ymid / det;
                            break;
                        case 3:
                            xmid = (data.xpos + data.xneg) / 2.0;
                            break;
                        case 2:
                            var x0,
                                xstep;
                            var y0 = 0.0;
                            var df0 = 0.0;
                            if (stepsize > 0.1)
                            {
                                method = 3;
                                return __rate_replaceGoto(data, user_data, stepsize, newton_submethod, xmid, ymid, status, method)
                            }
                            switch (newton_submethod++ % 4)
                            {
                                case 0:
                                    x0 = data.xpos;
                                    x0 = data.ypos;
                                    break;
                                case 2:
                                    x0 = data.xneg;
                                    y0 = data.yneg;
                                    break;
                                default:
                                case 3:
                                case 1:
                                    x0 = (data.xpos + data.xneg) / 2.0;
                                    resultArray = __rate_f(x0, y0, user_data);
                                    user_data = resultArray[2];
                                    y0 = resultArray[1];
                                    status = resultArray[0];
                                    if (!status)
                                    {
                                        return [keyword_null, data, user_data, newton_submethod, xmid, ymid, method]
                                    }
                                    break
                            }
                            xstep = Math_abs(data.xpos - data.xneg) / 1.0e6;
                            var resultArray4 = __rate_fake_df(x0, df0, xstep, data, user_data);
                            user_data = resultArray4[3];
                            data = resultArray4[2];
                            df0 = resultArray4[1];
                            status = resultArray4[0];
                            if (!status)
                            {
                                return [keyword_null, data, user_data, newton_submethod, xmid, ymid, method]
                            }
                            if (df0 === 0)
                            {
                                return [keyword_null, data, user_data, newton_submethod, xmid, ymid, method]
                            }
                            xmid = x0 - 1.01 * y0 / df0;
                            if ((xmid < data.xpos && xmid < data.xneg) || (xmid > data.xpos && xmid > data.xneg))
                            {
                                return [keyword_null, data, user_data, newton_submethod, xmid, ymid, method]
                            }
                            break;
                        default:
                            return [false, data, user_data, newton_submethod, xmid, ymid, method]
                    }
                    return [false, data, user_data, newton_submethod, xmid, ymid, method]
                }
                function __rate_goal_seek_bisection(data, user_data)
                {
                    var iterations;
                    var stepsize;
                    var newton_submethod = 0;
                    if (!data.havexpos || !data.havexneg)
                    {
                        return [false, data, user_data]
                    }
                    stepsize = Math_abs(data.xpos - data.xneg) / (Math_abs(data.xpos) + Math_abs(data.xneg));
                    for (iterations = 0; iterations < 100 + 15 * 4; iterations++)
                    {
                        var xmid;
                        var ymid = 0.0;
                        var status;
                        var method = 0;
                        method = (iterations % 4 === 0) ? 1 : ((iterations % 4 === 2) ? 2 : 3);
                        var resultOfGoto = __rate_replaceGoto(data, user_data, stepsize, newton_submethod, xmid, ymid, status, method);
                        data = resultOfGoto[1];
                        user_data = resultOfGoto[2];
                        newton_submethod = resultOfGoto[3];
                        xmid = resultOfGoto[4];
                        ymid = resultOfGoto[5];
                        method = resultOfGoto[6];
                        if (!resultOfGoto[0])
                        {
                            continue
                        }
                        else if (resultOfGoto[0])
                        {
                            return [true, data, user_data]
                        }
                        var resultArray = __rate_f(xmid, ymid, user_data);
                        user_data = resultArray[2];
                        ymid = resultArray[1];
                        status = resultArray[0];
                        if (!status)
                        {
                            continue
                        }
                        var resultArray2 = __update_data(xmid, ymid, data);
                        data = resultArray2[1];
                        if (resultArray2[0])
                        {
                            return [true, data, user_data]
                        }
                        stepsize = Math_abs(data.xpos - data.xneg) / (Math_abs(data.xpos) + Math_abs(data.xneg));
                        if (stepsize < data.precision)
                        {
                            if (data.yneg < ymid)
                            {
                                ymid = data.yneg;
                                xmid = data.xneg
                            }
                            if (data.ypos < ymid)
                            {
                                ymid = data.ypos;
                                xmid = data.xpos
                            }
                            data.root = xmid;
                            return [true, data, user_data]
                        }
                    }
                    return [false, data, user_data]
                }
                function fi_rate(args)
                {
                    var data = {};
                    var nper = CalcConvert.D(args[0]);
                    var pmt = CalcConvert.D(args[1]);
                    var pv = CalcConvert.D(args[2]);
                    var fv = Calc._Helper._argumentExists(args, 3) ? CalcConvert.D(args[3]) : 0.0;
                    var type = Calc._Helper._argumentExists(args, 4) ? CalcConvert.I(args[4]) : 0;
                    var guess = Calc._Helper._argumentExists(args, 5) ? CalcConvert.D(args[5]) : 0.1;
                    if (nper <= 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (type < 0)
                    {
                        return CalcErrorsValue
                    }
                    if (type > 1)
                    {
                        type = 1
                    }
                    data.xmin = 0.0;
                    data.xmax = 0.0;
                    data.precision = 0.0;
                    data.havexpos = false;
                    data.xpos = 0.0;
                    data.ypos = 0.0;
                    data.havexneg = false;
                    data.xneg = 0.0;
                    data.yneg = 0.0;
                    data.root = 0.0;
                    data = __goal_seek_initialise(data);
                    data.xmin = Math_max(data.xmin, -Math_pow(1.7976931348623158e+308 / 1.0e10, 1.0 / nper) + 1.0);
                    data.xmax = Math_min(data.xmax, Math_pow(1.7976931348623158e+308 / 1.0e10, 1.0 / nper) - 1.0);
                    var udata = {};
                    udata.nper = nper;
                    udata.pmt = pmt;
                    udata.pv = pv;
                    udata.fv = fv;
                    udata.type = CalcConvert.I(type);
                    var resultArray = __rate_goal_seek_newton(data, udata, guess);
                    udata = resultArray[2];
                    data = resultArray[1];
                    var status = resultArray[0];
                    if (!status)
                    {
                        var factor;
                        for (factor = 2; !(data.havexneg && data.havexpos) && factor < 100; factor *= 2)
                        {
                            resultArray = __rate_goal_seek_point(data, udata, guess * factor);
                            udata = resultArray[2];
                            data = resultArray[1];
                            resultArray = __rate_goal_seek_point(data, udata, guess / factor);
                            udata = resultArray[2];
                            data = resultArray[1]
                        }
                        resultArray = __rate_goal_seek_bisection(data, udata);
                        udata = resultArray[2];
                        data = resultArray[1];
                        status = resultArray[0]
                    }
                    if (status)
                    {
                        return data.root
                    }
                    else
                    {
                        return CalcErrorsNumber
                    }
                }
                function fi_dollarde(args)
                {
                    var fractionalDollar = CalcConvert.D(args[0]);
                    var fraction = CalcConvert.I(args[1]);
                    if (fraction === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    if (fraction < 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    var integerPart = (fractionalDollar < 0.0) ? Math_ceil(fractionalDollar) : Math_floor(fractionalDollar);
                    var decimalPart = fractionalDollar - integerPart;
                    var power10 = Math_pow(10.0, Math_ceil(Functions._MathHelper.log10(fraction)));
                    return CalcConvert.toResult(integerPart + decimalPart * power10 / fraction)
                }
                function fi_dollarfr(args)
                {
                    var decimalDollar = CalcConvert.D(args[0]);
                    var fraction = CalcConvert.I(args[1]);
                    if (fraction === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    if (fraction < 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    var integerPart = (decimalDollar < 0.0) ? Math_ceil(decimalDollar) : Math_floor(decimalDollar);
                    var decimalPart = decimalDollar - integerPart;
                    var power10 = Math_pow(10.0, Math_ceil(Functions._MathHelper.log10(fraction)));
                    return CalcConvert.toResult(integerPart + decimalPart * fraction / power10)
                }
                function fi_price(args)
                {
                    var settlement = CalcConvert.DT(args[0]);
                    var maturity = CalcConvert.DT(args[1]);
                    var rate = CalcConvert.D(args[2]);
                    var yieldVar = CalcConvert.D(args[3]);
                    var redem = CalcConvert.D(args[4]);
                    var frequency = CalcConvert.I(args[5]);
                    var basis = Calc._Helper._argumentExists(args, 6) ? CalcConvert.I(args[6]) : 0;
                    if (yieldVar < 0.0 || rate < 0.0 || redem === 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (basis < 0 || basis > 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (frequency !== 1 && frequency !== 2 && frequency !== 4)
                    {
                        return CalcErrorsNumber
                    }
                    if (__compareDateTime(settlement, maturity) > 0)
                    {
                        return CalcErrorsNumber
                    }
                    return __price(settlement, maturity, rate, yieldVar, redem, frequency, basis)
                }
                function fi_pricedisc(args)
                {
                    var settlement = CalcConvert.DT(args[0]);
                    var maturity = CalcConvert.DT(args[1]);
                    var discount = CalcConvert.D(args[2]);
                    var redemption = CalcConvert.D(args[3]);
                    var basis = Calc._Helper._argumentExists(args, 4) ? CalcConvert.I(args[4]) : 0;
                    var a,
                        d;
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (discount <= 0.0 || redemption <= 0.0 || basis < 0 || 4 < basis)
                    {
                        return CalcErrorsNumber
                    }
                    a = __days_monthly_basis(settlement, maturity, basis);
                    d = __annual_year_basis(settlement, basis);
                    if (a <= 0 || d <= 0)
                    {
                        return CalcErrorsNumber
                    }
                    return redemption - discount * redemption * a / d
                }
                function fi_pricemat(args)
                {
                    var settlement = CalcConvert.DT(args[0]);
                    var maturity = CalcConvert.DT(args[1]);
                    var issue = CalcConvert.DT(args[2]);
                    var rate = CalcConvert.D(args[3]);
                    var yld = CalcConvert.D(args[4]);
                    var basis = Calc._Helper._argumentExists(args, 5) ? CalcConvert.I(args[5]) : 0;
                    var a,
                        b,
                        dsm,
                        dim,
                        n;
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (rate < 0.0 || yld < 0.0 || basis < 0 || 4 < basis)
                    {
                        return CalcErrorsNumber
                    }
                    dsm = __days_monthly_basis(settlement, maturity, basis);
                    dim = __days_monthly_basis(issue, maturity, basis);
                    a = __days_monthly_basis(issue, settlement, basis);
                    b = __annual_year_basis(settlement, basis);
                    if (a <= 0.0 || b <= 0.0 || dsm <= 0.0 || dim <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    n = 1.0 + ((dsm / b) * yld);
                    if (n === 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    return ((100.0 + ((dim / b) * rate * 100.0)) / (n)) - ((a / b) * rate * 100.0)
                }
                function fi_oddfprice(args)
                {
                    var settlement = CalcConvert.DT(args[0]);
                    var maturity = CalcConvert.DT(args[1]);
                    var issue = CalcConvert.DT(args[2]);
                    var first_coupon = CalcConvert.DT(args[3]);
                    var rate = CalcConvert.D(args[4]);
                    var yieldVar = CalcConvert.D(args[5]);
                    var redemption = CalcConvert.D(args[6]);
                    var freq = CalcConvert.I(args[7]);
                    var basis = Calc._Helper._argumentExists(args, 8) ? CalcConvert.I(args[8]) : 0;
                    if (basis < 0 || basis > 4 || !(freq === 1 || freq === 2 || freq === 4) || __compareDateTime(issue, settlement) > 0 || __compareDateTime(settlement, first_coupon) > 0 || __compareDateTime(first_coupon, maturity) > 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (rate < 0.0 || yieldVar < 0.0 || redemption <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    return __calc_oddfprice(settlement, maturity, issue, first_coupon, rate, yieldVar, redemption, freq, basis)
                }
                function __calc_oddlprice(settlement, maturity, last_interest, rate, yieldParam, redemption, freq, basis)
                {
                    var d = new Date(last_interest.getFullYear(), last_interest.getMonth(), last_interest.getDate());
                    var x1,
                        x2,
                        x3;
                    do
                        d.setMonth(d.getMonth() + 12 / freq);
                    while (__compareDateTime(d, maturity) < 0);
                    x1 = __date_ratio(last_interest, settlement, d, freq, basis);
                    x2 = __date_ratio(last_interest, maturity, d, freq, basis);
                    x3 = __date_ratio(settlement, maturity, d, freq, basis);
                    return (redemption * freq + 100 * rate * (x2 - x1 * (1 + yieldParam * x3 / freq))) / (yieldParam * x3 + freq)
                }
                function fi_oddlprice(args)
                {
                    var settlement = CalcConvert.DT(args[0]);
                    var maturity = CalcConvert.DT(args[1]);
                    var last_interest = CalcConvert.DT(args[2]);
                    var rate = CalcConvert.D(args[3]);
                    var yieldVar = CalcConvert.D(args[4]);
                    var redemption = CalcConvert.D(args[5]);
                    var freq = CalcConvert.I(args[6]);
                    var basis = Calc._Helper._argumentExists(args, 7) ? CalcConvert.I(args[7]) : 0;
                    if (basis < 0 || basis > 4 || !(freq === 1 || freq === 2 || freq === 4) || __compareDateTime(settlement, maturity) > 0 || __compareDateTime(last_interest, settlement) > 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (rate < 0.0 || yieldVar < 0.0 || redemption <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    return __calc_oddlprice(settlement, maturity, last_interest, rate, yieldVar, redemption, freq, basis)
                }
                function fi_tbillprice(args)
                {
                    var settlement = CalcConvert.DT(args[0]);
                    var maturity = CalcConvert.DT(args[1]);
                    var discount = CalcConvert.D(args[2]);
                    var dsm;
                    if (__compareDateTime(settlement, maturity) >= 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (discount <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    dsm = __toOADate(maturity) - __toOADate(settlement);
                    if (dsm > 365.0)
                    {
                        return CalcErrorsNumber
                    }
                    return 100.0 * (1.0 - (discount * dsm) / 360.0)
                }
                function fi_euro(args)
                {
                    var val = CalcConvert.S(args[0]);
                    var v = __one_euro(val, 2);
                    if (v >= 0)
                    {
                        return v
                    }
                    else
                    {
                        return CalcErrorsNumber
                    }
                }
                function fi_euroconvert(args)
                {
                    var n = CalcConvert.D(args[0]);
                    var str1 = CalcConvert.S(args[1]);
                    var str2 = CalcConvert.S(args[2]);
                    var fullprec = Calc._Helper._argumentExists(args, 3) ? CalcConvert.B(args[3]) : false;
                    var calcPrec = Calc._Helper._argumentExists(args, 4) ? CalcConvert.I(args[4]) : 3;
                    var dispPrec = 0;
                    if (calcPrec < 3)
                    {
                        return CalcErrorsValue
                    }
                    if (!fullprec)
                    {
                        dispPrec = __displayPrecision(str2)
                    }
                    if (!Calc._Helper._argumentExists(args, 4))
                    {
                        calcPrec = __calcPrecision(str1)
                    }
                    var ret = 0.0;
                    var c1 = __one_euro(str1, calcPrec);
                    var c2 = __one_euro(str2, calcPrec);
                    if (c1 >= 0.0 && c2 >= 0.0)
                    {
                        ret = n * c2 / c1
                    }
                    else
                    {
                        return CalcErrorsValue
                    }
                    if (!fullprec)
                    {
                        ret = Functions._MathHelper.round(ret, dispPrec)
                    }
                    return ret
                }
                Functions.def("FV", fi_fv, {
                    minArgs: 3, maxArgs: 5, acceptsMissingArgument: Functions.acceptsThreeFour
                });
                Functions.def("FVSCHEDULE", fi_fvschedule, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsOne, acceptsReference: Functions.acceptsOne
                });
                Functions.def("NPV", fi_npv, {
                    minArgs: 2, acceptsArray: Functions.acceptsPositive, acceptsReference: Functions.acceptsPositive
                });
                Functions.def("PV", fi_pv, {
                    minArgs: 3, maxArgs: 5, acceptsMissingArgument: Functions.acceptsThreeFour
                });
                Functions.def("RECEIVED", fi_received, {
                    minArgs: 4, maxArgs: 5, acceptsMissingArgument: Functions.acceptsFour
                });
                Functions.def("XNPV", fi_xnpv, {
                    minArgs: 3, maxArgs: 3, acceptsArray: Functions.acceptsNotZero, acceptsReference: Functions.acceptsNotZero
                });
                Functions.def("CUMIPMT", fi_cumipmt, {
                    minArgs: 6, maxArgs: 6
                });
                Functions.def("CUMPRINC", fi_cumprinc, {
                    minArgs: 6, maxArgs: 6
                });
                Functions.def("IPMT", fi_ipmt, {
                    minArgs: 4, maxArgs: 6, acceptsMissingArgument: Functions.acceptsFourFive
                });
                Functions.def("ISPMT", fi_ispmt, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("PMT", fi_pmt, {
                    minArgs: 3, maxArgs: 5, acceptsMissingArgument: Functions.acceptsThreeFour
                });
                Functions.def("PPMT", fi_ppmt, {
                    minArgs: 4, maxArgs: 6, acceptsMissingArgument: Functions.acceptsFourFive
                });
                Functions.def("COUPDAYBS", fi_coupdaybsFunc, {
                    minArgs: 3, maxArgs: 4, acceptsMissingArgument: Functions.acceptsThree
                });
                Functions.def("COUPDAYS", fi_coupdaysFunc, {
                    minArgs: 3, maxArgs: 4, acceptsMissingArgument: Functions.acceptsThree
                });
                Functions.def("COUPDAYSNC", fi_coupdaysncFunc, {
                    minArgs: 3, maxArgs: 4, acceptsMissingArgument: Functions.acceptsThree
                });
                Functions.def("COUPNCD", fi_coupncdFunc, {
                    minArgs: 3, maxArgs: 4, acceptsMissingArgument: Functions.acceptsThree
                });
                Functions.def("COUPNUM", fi_coupnumFunc, {
                    minArgs: 3, maxArgs: 4, acceptsMissingArgument: Functions.acceptsThree
                });
                Functions.def("COUPPCD", fi_couppcdFunc, {
                    minArgs: 3, maxArgs: 4, acceptsMissingArgument: Functions.acceptsThree
                });
                Functions.def("DURATION", fi_durationFunc, {
                    minArgs: 5, maxArgs: 6, acceptsMissingArgument: Functions.acceptsFive
                });
                Functions.def("MDURATION", fi_mduration, {
                    minArgs: 5, maxArgs: 6, acceptsMissingArgument: Functions.acceptsFive
                });
                Functions.def("NPER", fi_nper, {
                    minArgs: 3, maxArgs: 5, acceptsMissingArgument: Functions.acceptsThreeFour
                });
                Functions.def("YIELD", fi_yieldFunc, {
                    minArgs: 6, maxArgs: 7, acceptsMissingArgument: Functions.acceptsSix
                });
                Functions.def("YIELDDISC", fi_yielddisc, {
                    minArgs: 4, maxArgs: 5, acceptsMissingArgument: Functions.acceptsFour
                });
                Functions.def("YIELDMAT", fi_yieldmat, {
                    minArgs: 5, maxArgs: 6, acceptsMissingArgument: Functions.acceptsFive
                });
                Functions.def("ODDFYIELD", fi_oddfyield, {
                    minArgs: 8, maxArgs: 9, acceptsMissingArgument: Functions.acceptsEight
                });
                Functions.def("ODDLYIELD", fi_oddlyield, {
                    minArgs: 7, maxArgs: 8, acceptsMissingArgument: Functions.acceptsSeven
                });
                Functions.def("TBILLEQ", fi_tbilleq, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("TBILLYIELD", fi_tbillyield, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("IRR", fi_irr, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsOne, acceptsArray: Functions.acceptsZero, acceptsReference: Functions.acceptsZero
                });
                Functions.def("MIRR", fi_mirr, {
                    minArgs: 3, maxArgs: 3, acceptsArray: Functions.acceptsZero, acceptsReference: Functions.acceptsZero
                });
                Functions.def("XIRR", fi_xirr, {
                    minArgs: 2, maxArgs: 3, acceptsMissingArgument: Functions.acceptsTwo, acceptsArray: Functions.acceptsNotTwo, acceptsReference: Functions.acceptsNotTwo
                });
                Functions.def("AMORDEGRC", fi_amordegrc, {
                    minArgs: 6, maxArgs: 7, acceptsMissingArgument: Functions.acceptsSix
                });
                Functions.def("AMORLINC", fi_amorlinc, {
                    minArgs: 6, maxArgs: 7, acceptsMissingArgument: Functions.acceptsSix
                });
                Functions.def("DB", fi_db, {
                    minArgs: 4, maxArgs: 5, acceptsMissingArgument: Functions.acceptsFour
                });
                Functions.def("DDB", fi_ddb, {
                    minArgs: 4, maxArgs: 5, acceptsMissingArgument: Functions.acceptsFour
                });
                Functions.def("SLN", fi_sln, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("SYD", fi_syd, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("VDB", fi_vdb, {
                    minArgs: 5, maxArgs: 7, acceptsMissingArgument: Functions.acceptsFiveSix
                });
                Functions.def("ACCRINT", fi_accrint, {
                    minArgs: 6, maxArgs: 8, acceptsMissingArgument: Functions.acceptsFourSixSeven
                });
                Functions.def("ACCRINTM", fi_accrintm, {
                    minArgs: 3, maxArgs: 5, acceptsMissingArgument: Functions.acceptsThreeFour
                });
                Functions.def("DISC", fi_disc, {
                    minArgs: 4, maxArgs: 5, acceptsMissingArgument: Functions.acceptsFour
                });
                Functions.def("EFFECT", fi_effect, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("INTRATE", fi_intrate, {
                    minArgs: 4, maxArgs: 5, acceptsMissingArgument: Functions.acceptsFour
                });
                Functions.def("NOMINAL", fi_nominal, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("RATE", fi_rate, {
                    minArgs: 3, maxArgs: 6, acceptsMissingArgument: Functions.acceptsThreeFourFive
                });
                Functions.def("DOLLARDE", fi_dollarde, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("DOLLARFR", fi_dollarfr, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("PRICE", fi_price, {
                    minArgs: 6, maxArgs: 7, acceptsMissingArgument: Functions.acceptsSix
                });
                Functions.def("PRICEDISC", fi_pricedisc, {
                    minArgs: 4, maxArgs: 5, acceptsMissingArgument: Functions.acceptsFour
                });
                Functions.def("PRICEMAT", fi_pricemat, {
                    minArgs: 5, maxArgs: 6, acceptsMissingArgument: Functions.acceptsFive
                });
                Functions.def("ODDFPRICE", fi_oddfprice, {
                    minArgs: 8, maxArgs: 9, acceptsMissingArgument: Functions.acceptsEight
                });
                Functions.def("ODDLPRICE", fi_oddlprice, {
                    minArgs: 7, maxArgs: 8, acceptsMissingArgument: Functions.acceptsSeven
                });
                Functions.def("TBILLPRICE", fi_tbillprice, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("EURO", fi_euro, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("EUROCONVERT", fi_euroconvert, {
                    minArgs: 3, maxArgs: 5, acceptsMissingArgument: Functions.acceptsThreeFour
                })
            })(Calc.Functions || (Calc.Functions = {}));
            var Functions = Calc.Functions
        })(Sheets.Calc || (Sheets.Calc = {}));
        var Calc = Sheets.Calc
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
        (function(Calc)
        {
            (function(Functions)
            {
                Sheets.feature("calc.functions_lookup", ["calc.functions"]);
                var $ = jQuery,
                    keyword_null = null,
                    keyword_undefined = undefined,
                    CalcConvert = Calc.Convert;
                var CalcErrors = Calc.Errors,
                    CalcErrorsNull = CalcErrors.Null,
                    CalcErrorsDivideByZero = CalcErrors.DivideByZero,
                    CalcErrorsValue = CalcErrors.Value,
                    CalcErrorsReference = CalcErrors.Reference,
                    CalcErrorsName = CalcErrors.Name,
                    CalcErrorsNotAvailable = CalcErrors.NotAvailable,
                    CalcErrorsNumber = CalcErrors.Number;
                var _mlow,
                    _mhigh,
                    _mcurrent,
                    _morig,
                    _bsup,
                    _bstarted;
                function value_area_get_x_y(v, x, y)
                {
                    if (v === keyword_undefined || v === keyword_null)
                    {
                        return keyword_null
                    }
                    if (v.isArray || v.isReference)
                    {
                        if (x > v.colCount)
                        {
                            var xx = x;
                            x = y;
                            y = xx
                        }
                        var val = (y * v.colCount) + x;
                        return v[val]
                    }
                    else
                    {
                        return v[0]
                    }
                }
                function find_compare_type_valid(find, val)
                {
                    if (val === keyword_undefined || val === keyword_null)
                    {
                        return false
                    }
                    if (CalcConvert.num(find) && CalcConvert.num(val))
                    {
                        return true
                    }
                    if (typeof find === 'boolean' && typeof val === 'boolean')
                    {
                        return true
                    }
                    if (typeof find === 'string' && typeof val === 'string')
                    {
                        return true
                    }
                    return false
                }
                function find_bound_walk(l, h, start, up, reset)
                {
                    if (l < 0)
                    {
                        return -1
                    }
                    if (h < 0)
                    {
                        return -1
                    }
                    if (h < l)
                    {
                        return -1
                    }
                    if (start < l)
                    {
                        return -1
                    }
                    if (start > h)
                    {
                        return -1
                    }
                    if (reset)
                    {
                        _mlow = l;
                        _mhigh = h;
                        _mcurrent = start;
                        _morig = start;
                        _bsup = up;
                        _bstarted = up;
                        return _mcurrent
                    }
                    if (_bsup)
                    {
                        _mcurrent++;
                        if (_mcurrent > _mhigh && _bsup === _bstarted)
                        {
                            _mcurrent = _morig - 1;
                            _bsup = false
                        }
                        else if (_mcurrent > _mhigh && _bsup !== _bstarted)
                        {
                            return -1
                        }
                    }
                    else
                    {
                        _mcurrent--;
                        if (_mcurrent < _mlow && _bsup === _bstarted)
                        {
                            _mcurrent = _morig + 1;
                            _bsup = true
                        }
                        else if (_mcurrent < _mlow && _bsup !== _bstarted)
                        {
                            return -1
                        }
                    }
                    return _mcurrent
                }
                function value_compare(a, b, case_sensitive)
                {
                    if (a === b)
                    {
                        return 0
                    }
                    var date = keyword_null;
                    if (typeof a === "string")
                    {
                        if (!b && a.toString().length === 0)
                        {
                            return 0
                        }
                        else if (CalcConvert.num(b))
                        {
                            return 1
                        }
                        else if (typeof b === 'boolean')
                        {
                            return 2
                        }
                        else if (typeof b === 'string')
                        {
                            var t;
                            if (case_sensitive)
                            {
                                t = a.toString().localeCompare(b.toString())
                            }
                            else
                            {
                                t = a.toLowerCase().localeCompare(b.toLowerCase())
                            }
                            if (t === 0)
                            {
                                return 0
                            }
                            else if (t > 0)
                            {
                                return 1
                            }
                            else
                            {
                                return 2
                            }
                        }
                        else if (b instanceof Date)
                        {
                            date = GcSpread.Sheets._DateTimeHelper._parseDate(a);
                            if (!isNaN(date))
                            {
                                if (date === b)
                                {
                                    return 0
                                }
                                else if (date > b)
                                {
                                    return 1
                                }
                                else
                                {
                                    return 2
                                }
                            }
                            return 1
                        }
                        else
                        {
                            return -1
                        }
                    }
                    else if (typeof b === 'string')
                    {
                        if (!a && b.toString().length === 0)
                        {
                            return 0
                        }
                        else if (CalcConvert.num(a))
                        {
                            return 2
                        }
                        else if (typeof a === 'boolean')
                        {
                            return 1
                        }
                        else if (a instanceof Date)
                        {
                            date = GcSpread.Sheets._DateTimeHelper._parseDate(a);
                            if (!isNaN(date))
                            {
                                if (date === b)
                                {
                                    return 0
                                }
                                else if (date > b)
                                {
                                    return 1
                                }
                                else
                                {
                                    return 2
                                }
                            }
                            return 2
                        }
                        else
                        {
                            return -1
                        }
                    }
                    if (typeof a === 'boolean' && CalcConvert.num(b))
                    {
                        return 1
                    }
                    if (typeof b === 'boolean' && CalcConvert.num(a))
                    {
                        return 2
                    }
                    var ax = CalcConvert.D(a);
                    var bx = CalcConvert.D(b);
                    if (ax === bx)
                    {
                        return 0
                    }
                    else if (ax < bx)
                    {
                        return 2
                    }
                    else
                    {
                        return 1
                    }
                }
                function value_reg_exp(regExp, value, case_sensitive)
                {
                    regExp.lastIndex = 0;
                    if (regExp.test(value))
                    {
                        return 0
                    }
                    else
                    {
                        return 1
                    }
                }
                function value_area_fetch_x_y(v, x, y)
                {
                    var res = value_area_get_x_y(v, x, y);
                    if (res === keyword_undefined || res === keyword_null)
                    {
                        return 0
                    }
                    return res
                }
                function find_index_bisection(find, data, type, height)
                {
                    var comp = -1;
                    var high,
                        low = 0,
                        prev = -1,
                        mid = -1;
                    if (height)
                    {
                        high = data.rowCount
                    }
                    else
                    {
                        high = data.colCount
                    }
                    high--;
                    if (high < low)
                    {
                        return -1
                    }
                    while (low <= high)
                    {
                        var v = keyword_null;
                        var start;
                        if ((type >= 1) !== (comp === 2))
                        {
                            prev = mid
                        }
                        mid = CalcConvert.I((low + high) / 2);
                        mid = find_bound_walk(low, high, mid, type >= 0, true);
                        start = mid;
                        var realVal = find[0];
                        while (!find_compare_type_valid(realVal, v) && mid !== -1)
                        {
                            var rev = false;
                            if (height)
                            {
                                v = value_area_get_x_y(data, 0, mid)
                            }
                            else
                            {
                                v = value_area_get_x_y(data, mid, 0)
                            }
                            if (find_compare_type_valid(realVal, v))
                            {
                                break
                            }
                            mid = find_bound_walk(0, 0, 0, false, false);
                            if (!rev && type >= 0 && mid < start)
                            {
                                high = mid;
                                rev = true
                            }
                            else if (!rev && type < 0 && mid > start)
                            {
                                low = mid;
                                rev = true
                            }
                        }
                        if (mid === -1 && ((type >= 1) !== (comp === 2)))
                        {
                            return prev
                        }
                        else if (mid === -1)
                        {
                            return -1
                        }
                        comp = value_compare(realVal, v, false);
                        if (type >= 1 && comp === 1)
                        {
                            low = mid + 1
                        }
                        else if (type >= 1 && comp === 2)
                        {
                            high = mid - 1
                        }
                        else if (type <= -1 && comp === 1)
                        {
                            high = mid - 1
                        }
                        else if (type <= -1 && comp === 2)
                        {
                            low = mid + 1
                        }
                        else if (comp === 0)
                        {
                            while ((type <= -1 && mid > low) || (type >= 0 && mid < high))
                            {
                                var adj = 0;
                                if (type >= 0)
                                {
                                    adj = mid + 1
                                }
                                else
                                {
                                    adj = mid - 1
                                }
                                if (height)
                                {
                                    v = value_area_fetch_x_y(data, 0, adj)
                                }
                                else
                                {
                                    v = value_area_fetch_x_y(data, adj, 0)
                                }
                                if (!v)
                                {
                                    return -1
                                }
                                if (!find_compare_type_valid(realVal, v))
                                {
                                    break
                                }
                                comp = value_compare(realVal, v, false);
                                if (comp !== 0)
                                {
                                    break
                                }
                                mid = adj
                            }
                            return mid
                        }
                    }
                    if ((type >= 1) !== (comp === 2))
                    {
                        return mid
                    }
                    return prev
                }
                function find_index_linear(find, data, type, height)
                {
                    var index_val = keyword_null;
                    var comp;
                    var length,
                        lp,
                        index = -1;
                    if (height)
                    {
                        length = data.rowCount
                    }
                    else
                    {
                        length = data.colCount
                    }
                    var realVal = find[0];
                    var isFindIsString = (typeof realVal === "string");
                    var regExp;
                    if (isFindIsString)
                    {
                        var wildcardCriteria = Sheets.RegUtil.getWildcardCriteriaFullMatch(realVal);
                        if (wildcardCriteria)
                        {
                            regExp = Sheets.RegUtil.getRegIgnoreCase(wildcardCriteria)
                        }
                    }
                    for (lp = 0; lp < length; lp++)
                    {
                        var v;
                        if (height)
                        {
                            v = value_area_fetch_x_y(data, 0, lp)
                        }
                        else
                        {
                            v = value_area_fetch_x_y(data, lp, 0)
                        }
                        if (v === keyword_undefined || v === keyword_null)
                        {
                            return -1
                        }
                        if (!find_compare_type_valid(realVal, v))
                        {
                            continue
                        }
                        var isValueIsString = (typeof v === "string");
                        if (isFindIsString && isValueIsString && wildcardCriteria)
                        {
                            comp = value_reg_exp(regExp, v, false)
                        }
                        else
                        {
                            comp = value_compare(realVal, v, false)
                        }
                        if (type >= 1 && comp === 1)
                        {
                            comp = -1;
                            if (index >= 0)
                            {
                                comp = value_compare(v, index_val, false)
                            }
                            if (index < 0 || (index >= 0 && comp === 1))
                            {
                                index = lp;
                                index_val = v
                            }
                        }
                        else if (type <= -1 && comp === 2)
                        {
                            comp = -1;
                            if (index >= 0)
                            {
                                comp = value_compare(v, index_val, false)
                            }
                            if (index < 0 || (index >= 0 && comp === 2))
                            {
                                index = lp;
                                index_val = v
                            }
                        }
                        else if (comp === 0)
                        {
                            return lp
                        }
                    }
                    return index
                }
                function CreateStringcomparisonRegexPattern(s)
                {
                    if (!s || s === "")
                    {
                        return s
                    }
                    var regExpKeys = [/\(/, /\[/, /\{/, /\\/, /\^/, /\$/, /\|/, /\)/, /\+/, /\./];
                    for (var i in regExpKeys)
                    {
                        if (i)
                        {
                            s = s.replace(regExpKeys[i], regExpKeys[i].source)
                        }
                    }
                    s = s.replace("~?", "{113E2532-EAF5-444c-A5CB-3D7446971C4D}");
                    s = s.replace("~*", "{E21523B3-0F1F-458f-B547-23D25713D0EC}");
                    s = s.replace("?", ".");
                    s = s.replace("*", "((.|\\n)*)");
                    s = s.replace("{113E2532-EAF5-444c-A5CB-3D7446971C4D}", "\\?");
                    s = s.replace("{E21523B3-0F1F-458f-B547-23D25713D0EC}", "\\*");
                    return s.toString()
                }
                function isContextSensitive()
                {
                    return true
                }
                function findBranchArgument(test)
                {
                    if (CalcConvert.err(test))
                    {
                        return -1
                    }
                    try
                    {
                        return CalcConvert.I(test)
                    }
                    catch(err) {}
                    return -1
                }
                function _checkArgumentsLength(args)
                {
                    if (!args)
                    {
                        throw Sheets.SR.Exp_InvalidArgument;
                    }
                    else
                    {
                        if (args.length < 1 || args.length > 1)
                        {
                            throw Sheets.SR.Exp_InvalidArgument;
                        }
                    }
                }
                var _CellInfoType;
                (function(_CellInfoType)
                {
                    _CellInfoType[_CellInfoType["row"] = 0] = "row";
                    _CellInfoType[_CellInfoType["column"] = 1] = "column"
                })(_CellInfoType || (_CellInfoType = {}));
                ;
                var _CellInfoReference = (function(_super)
                    {
                        __extends(_CellInfoReference, _super);
                        function _CellInfoReference(source, row, column, rowCount, columnCount, type)
                        {
                            _super.call(this, source, [new GcSpread.Sheets.Range(row, column, rowCount, columnCount)]);
                            var self = this;
                            self._row = row;
                            self._column = column;
                            self._rowCount = rowCount;
                            self._columnCount = columnCount;
                            self._type = type
                        }
                        _CellInfoReference.prototype.type = function()
                        {
                            return this._type
                        };
                        _CellInfoReference.prototype.getValue = function(area, rowOffset, columnOffset)
                        {
                            var self = this;
                            switch (self._type)
                            {
                                case 0:
                                    return self.getRow(0) + 1 + rowOffset;
                                case 1:
                                    return self.getColumn(0) + 1 + columnOffset;
                                default:
                                    return _super.prototype.getValue.call(this, area, rowOffset, columnOffset)
                            }
                        };
                        _CellInfoReference.prototype.toArray = function(valueType, toOneDimension, breakOnError, breakOnConvertError, ignoreBlank)
                        {
                            var self = this,
                                result = [],
                                baseRow = self._row,
                                baseCol = self._column,
                                value,
                                rangeArr,
                                rowArr,
                                rangeCount = self.getRangeCount(),
                                rowCount = self._rowCount,
                                colCount = self._columnCount;
                            for (var range = 0; range < rangeCount; range++)
                            {
                                if (!toOneDimension)
                                {
                                    rangeArr = [];
                                    result.push(rangeArr)
                                }
                                for (var r = 0; r < rowCount; r++)
                                {
                                    if (!toOneDimension)
                                    {
                                        rowArr = [];
                                        rangeArr.push(rowArr)
                                    }
                                    for (var c = 0; c < colCount; c++)
                                    {
                                        switch (self._type)
                                        {
                                            case 0:
                                                value = baseRow + 1 + r;
                                                break;
                                            case 1:
                                                value = baseCol + 1 + c;
                                                break;
                                            default:
                                                value = _super.prototype.getValue.call(this, range, baseRow + r, baseCol + c)
                                        }
                                        if (toOneDimension)
                                        {
                                            result.push(value)
                                        }
                                        else
                                        {
                                            rowArr.push(value)
                                        }
                                    }
                                }
                            }
                            if (!toOneDimension && rangeCount === 1)
                            {
                                result = result[0]
                            }
                            result.rowCount = rowCount;
                            result.colCount = colCount;
                            result.rangeCount = rangeCount;
                            return result
                        };
                        return _CellInfoReference
                    })(Calc.SheetReference);
                var _TransposedArray = (function(_super)
                    {
                        __extends(_TransposedArray, _super);
                        function _TransposedArray(array)
                        {
                            _super.call(this);
                            this._array = array
                        }
                        _TransposedArray.prototype.getRowCount = function()
                        {
                            return Calc.CalcArrayHelper.getColumnCount(this._array)
                        };
                        _TransposedArray.prototype.getColumnCount = function()
                        {
                            return Calc.CalcArrayHelper.getRowCount(this._array)
                        };
                        _TransposedArray.prototype.getValue = function(row, column)
                        {
                            return Calc.CalcArrayHelper.getValue(this._array, column, row)
                        };
                        return _TransposedArray
                    })(Calc.CalcArray);
                function eg_row(args, context)
                {
                    _checkArgumentsLength([args]);
                    if (!context)
                    {
                        return CalcErrorsValue
                    }
                    var isArrayFormula = context.arrayFormulaMode,
                        hasReference = Calc._Helper._argumentExists(args, 0);
                    var reference = hasReference ? args[0] : context.getReference(context.source, context.row, context.column, context.rowCount, context.columnCount);
                    if (!reference || reference.getRangeCount() !== 1)
                    {
                        return CalcErrorsValue
                    }
                    if (isArrayFormula && hasReference)
                    {
                        return new _CellInfoReference(reference.getSource(), reference.getRow(0), reference.getColumn(0), reference.getRowCount(0), reference.getColumnCount(0), 0)
                    }
                    return reference.getRow(0) + 1
                }
                function eg_column(args, context)
                {
                    _checkArgumentsLength([args]);
                    if (!context)
                    {
                        return CalcErrorsValue
                    }
                    var isArrayFormula = context.arrayFormulaMode,
                        hasReference = Calc._Helper._argumentExists(args, 0);
                    var reference = Calc._Helper._argumentExists(args, 0) ? args[0] : context.getReference(context.source, context.row, context.column, context.rowCount, context.columnCount);
                    if (!reference || reference.getRangeCount() !== 1)
                    {
                        return CalcErrorsValue
                    }
                    if (isArrayFormula && hasReference)
                    {
                        return new _CellInfoReference(reference.getSource(), reference.getRow(0), reference.getColumn(0), reference.getRowCount(0), reference.getColumnCount(0), 1)
                    }
                    return reference.getColumn(0) + 1
                }
                function eg_rows(args)
                {
                    _checkArgumentsLength([args]);
                    return Calc.CalcArrayHelper.getRowCount(args[0])
                }
                function eg_columns(args)
                {
                    _checkArgumentsLength([args]);
                    return Calc.CalcArrayHelper.getColumnCount(args[0])
                }
                function eg_transpose(args)
                {
                    _checkArgumentsLength([args]);
                    return new _TransposedArray(args[0])
                }
                function eg_hlookup(args)
                {
                    var convert = Calc.Convert;
                    var lookVal = convert.toArr(args[0], 0, true, false, false);
                    var array = convert.toArr(args[1], 0, true, false, false);
                    var row_index = CalcConvert.I(args[2]);
                    var approx = Calc._Helper._argumentExists(args, 3) ? CalcConvert.B(args[3]) : true;
                    var index = -1;
                    if (row_index <= 0)
                    {
                        return CalcErrorsValue
                    }
                    if (row_index > array.rowCount)
                    {
                        return CalcErrorsReference
                    }
                    if (approx)
                    {
                        index = find_index_bisection(lookVal, array, 1, false)
                    }
                    else
                    {
                        index = find_index_linear(lookVal, array, 0, false)
                    }
                    if (index >= 0)
                    {
                        var v = value_area_fetch_x_y(array, index, row_index - 1);
                        return v
                    }
                    return CalcErrorsNotAvailable
                }
                function eg_vlookup(args)
                {
                    var convert = Calc.Convert;
                    var lookVal = convert.toArr(args[0], 0, true, false, false);
                    var array = convert.toArr(args[1], 0, true, false, false);
                    var col_index = CalcConvert.I(args[2]);
                    var approx = Calc._Helper._argumentExists(args, 3) ? CalcConvert.B(args[3]) : true;
                    var index = -1;
                    if (col_index <= 0)
                    {
                        return CalcErrorsValue
                    }
                    if (col_index > array.colCount)
                    {
                        return CalcErrorsReference
                    }
                    if (approx)
                    {
                        index = find_index_bisection(lookVal, array, 1, true)
                    }
                    else
                    {
                        index = find_index_linear(lookVal, array, 0, true)
                    }
                    if (index >= 0)
                    {
                        var v = value_area_fetch_x_y(array, col_index - 1, index);
                        return v
                    }
                    return CalcErrorsNotAvailable
                }
                function eg_lookup(args)
                {
                    var convert = Calc.Convert;
                    var lookVal = convert.toArr(args[0], 0, true, false, false);
                    var array = convert.toArr(args[1], 0, true, false, false);
                    var index = -1;
                    var result;
                    var width = array.colCount;
                    var height = array.rowCount;
                    if (args.length > 2)
                    {
                        result = convert.toArr(args[2], 0, true, false, false)
                    }
                    else
                    {
                        var val = keyword_null;
                        if (width > height)
                        {
                            val = eg_hlookup([lookVal, array, height]);
                            if (CalcConvert.err(val))
                            {
                                return CalcErrorsNotAvailable
                            }
                            else
                            {
                                return val
                            }
                        }
                        else
                        {
                            val = eg_vlookup([lookVal, array, width]);
                            if (CalcConvert.err(val))
                            {
                                return CalcErrorsNotAvailable
                            }
                            else
                            {
                                return val
                            }
                        }
                    }
                    if (result)
                    {
                        var width2 = result.colCount;
                        var height2 = result.rowCount;
                        if (width2 > 1 && height2 > 1)
                        {
                            return CalcErrorsNotAvailable
                        }
                    }
                    else
                    {
                        result = array
                    }
                    index = find_index_bisection(lookVal, array, 1, width > height ? false : true);
                    if (index >= 0)
                    {
                        var v = keyword_null;
                        width = result.colCount;
                        height = result.rowCount;
                        if (width > height)
                        {
                            v = value_area_fetch_x_y(result, index, height - 1)
                        }
                        else
                        {
                            v = value_area_fetch_x_y(result, width - 1, index)
                        }
                        return v
                    }
                    return CalcErrorsNotAvailable
                }
                function eg_choose(args)
                {
                    var index = CalcConvert.I(args[0]);
                    if (index < 1 || args.length <= index)
                    {
                        return CalcErrorsValue
                    }
                    if (args[index] === keyword_undefined || args[index] === keyword_null)
                    {
                        return 0.0
                    }
                    else
                    {
                        return args[index]
                    }
                }
                function assertOrder(v, ascending)
                {
                    var length = v.length;
                    for (var i = 1; i < length; i++)
                    {
                        var a = v[i - 1];
                        var b = v[i];
                        var ret = value_compare(a, b, false);
                        if (ret === 2 && !ascending)
                        {
                            return false
                        }
                    }
                    return true
                }
                function eg_match(args)
                {
                    var convert = Calc.Convert;
                    var lookVal = convert.toArr(args[0], 0, true, false, false);
                    var array = convert.toArr(args[1], 0, true, false, false);
                    if (!array.isArray && !array.isReference)
                    {
                        return CalcErrorsNotAvailable
                    }
                    var width = array.colCount;
                    var height = array.rowCount;
                    var matchType = Calc._Helper._argumentExists(args, 2) ? CalcConvert.I(args[2]) : 0;
                    if (width > 1 && height > 1)
                    {
                        return CalcErrorsNotAvailable
                    }
                    if (matchType === 1 && !assertOrder(array, true))
                    {
                        return CalcErrorsNotAvailable
                    }
                    else if (matchType === -1 && !assertOrder(array, false))
                    {
                        return CalcErrorsNotAvailable
                    }
                    var result = -1;
                    if (matchType === 1)
                    {
                        result = find_index_bisection(lookVal, array, 1, height > 1)
                    }
                    else if (matchType === 0)
                    {
                        result = find_index_linear(lookVal, array, 0, height > 1)
                    }
                    else if (matchType === -1)
                    {
                        result = find_index_bisection(lookVal, array, -1, height > 1)
                    }
                    if (result === -1)
                    {
                        return CalcErrorsNotAvailable
                    }
                    return result + 1
                }
                function _appendR1C1Number(sb, prefix, coord, relative)
                {
                    sb.append(prefix);
                    if (relative)
                    {
                        if (coord !== 0)
                        {
                            sb.append("[");
                            sb.append(coord.toString());
                            sb.append("]")
                        }
                    }
                    else
                    {
                        sb.append(coord)
                    }
                }
                function _appendA1Number(sb, coord, relative)
                {
                    if (!relative)
                    {
                        sb.append("$")
                    }
                    sb.append(coord);
                    return sb
                }
                function _appendA1Letter(sb, coord, relative)
                {
                    if (!relative)
                    {
                        sb.append("$")
                    }
                    var position = sb.toString().length;
                    for (; coord > 0.1; coord = (coord - 1) / 26)
                    {
                        sb.insert(String.fromCharCode('A'.charCodeAt(0) + (coord - 1) % 26), position)
                    }
                    return sb
                }
                function _appendExternalName(sb, name)
                {
                    if (name && 0 < name.length)
                    {
                        var needQuotes = !Calc.Parser._isLetter(name[0]) && name[0] !== '_';
                        for (var i = 1; !needQuotes && i < name.length; i++)
                        {
                            needQuotes = !Calc.Parser._isLetterOrDigit(name[i]) && name[i] !== '_'
                        }
                        if (needQuotes)
                        {
                            sb.append("'");
                            sb.append(name.replace("'", "''"));
                            sb.append("'")
                        }
                        else
                        {
                            sb.append(name)
                        }
                        sb.append("!")
                    }
                    return sb
                }
                function eg_address(args)
                {
                    var row = CalcConvert.I(args[0]);
                    var col = CalcConvert.I(args[1]);
                    var absNum = Calc._Helper._argumentExists(args, 2) ? CalcConvert.I(args[2]) : 1;
                    var a1 = Calc._Helper._argumentExists(args, 3) ? CalcConvert.B(args[3]) : true;
                    var sheetText = Calc._Helper._argumentExists(args, 4) ? CalcConvert.S(args[4]) : "";
                    var rowRelative = (absNum === 3 || absNum === 4 || absNum === 7 || absNum === 8);
                    var colRelative = (absNum === 2 || absNum === 4 || absNum === 6 || absNum === 8);
                    var sb = new Sheets._StringBuilder;
                    if (row < 1 && (a1 || !rowRelative) || row > Calc.Parser.maxRowCount)
                    {
                        return CalcErrorsValue
                    }
                    if (col < 1 && (a1 || !colRelative) || col > Calc.Parser.maxColumnCount)
                    {
                        return CalcErrorsValue
                    }
                    if (absNum < 1 || 8 < absNum)
                    {
                        return CalcErrorsValue
                    }
                    _appendExternalName(sb, sheetText);
                    if (a1)
                    {
                        _appendA1Letter(sb, col, colRelative);
                        _appendA1Number(sb, row, rowRelative)
                    }
                    else
                    {
                        _appendR1C1Number(sb, "R", row, rowRelative);
                        _appendR1C1Number(sb, "C", col, colRelative)
                    }
                    return sb.toString()
                }
                function eg_index(args, context)
                {
                    var evaluateContext = context instanceof Calc.EvaluateContext ? context : keyword_undefined;
                    var acceptsReference = evaluateContext != keyword_null ? evaluateContext.acceptsReference : false;
                    if (args[0] instanceof Calc.Reference)
                    {
                        var reference = args[0];
                        var arrayRowCount = reference.getRowCount(0);
                        var arrayColumnCount = reference.getColumnCount(0);
                        var arrayRow = reference.getRow(0);
                        var arrayCol = reference.getColumn(0);
                        if (args.length == 2)
                        {
                            if (reference.getRangeCount() != 1 || arrayRowCount != 1 && arrayColumnCount != 1)
                                return CalcErrorsReference;
                            var index = Calc._Helper._argumentValid(args, 1) ? CalcConvert.I(args[1]) : 0;
                            if (index == 0 && !acceptsReference && evaluateContext != keyword_null)
                            {
                                index = arrayRowCount > 0 ? evaluateContext.rowOffset : evaluateContext.columnOffset
                            }
                            if (index < 0)
                                return CalcErrorsValue;
                            if (arrayRowCount * arrayColumnCount < index)
                                return CalcErrorsReference;
                            if (index == 0)
                                return reference.create([new Sheets.Range(arrayRow, arrayCol, arrayRowCount, arrayColumnCount)]);
                            else
                            {
                                var offsetRow = Math.floor((index - 1) / arrayColumnCount) + arrayRow;
                                var offsetCol = (index - 1) % arrayColumnCount + arrayCol;
                                return reference.create([new Sheets.Range(offsetRow, offsetCol, 1, 1)])
                            }
                        }
                        else
                        {
                            var row = Calc._Helper._argumentValid(args, 1) ? CalcConvert.I(args[1]) - 1 : -1;
                            var column = Calc._Helper._argumentValid(args, 2) ? CalcConvert.I(args[2]) - 1 : -1;
                            var area = Calc._Helper._argumentValid(args, 3) ? (CalcConvert.I(args[3]) - 1) : 0;
                            if (area >= reference.getRangeCount())
                            {
                                return CalcErrorsReference
                            }
                            arrayRowCount = reference.getRowCount(area);
                            arrayColumnCount = reference.getColumnCount(area);
                            var sourceRow = reference.getRow(area);
                            var sourceCol = reference.getColumn(area);
                            if (row == -1 && !acceptsReference && arrayRowCount > 1 && evaluateContext != keyword_null)
                            {
                                row = evaluateContext.rowOffset
                            }
                            if (column == -1 && !acceptsReference && arrayColumnCount > 1 && evaluateContext != keyword_null)
                            {
                                column = evaluateContext.columnOffset
                            }
                            var offsetRow = row + sourceRow;
                            var offsetCol = column + sourceCol;
                            if (row < -1 || column < -1 || area < 0)
                                return CalcErrorsValue;
                            if (arrayRowCount <= row || arrayColumnCount <= column || reference.getRangeCount() <= area)
                                return CalcErrorsReference;
                            if (row == -1 && column == -1)
                                return reference.create([new Sheets.Range(sourceRow, sourceCol, arrayRowCount, arrayColumnCount)]);
                            else if (row == -1)
                                return reference.create([new Sheets.Range(sourceRow, offsetCol, arrayRowCount, 1)]);
                            else if (column == -1)
                                return reference.create([new Sheets.Range(offsetRow, sourceCol, 1, arrayColumnCount)]);
                            else
                                return reference.create([new Sheets.Range(offsetRow, offsetCol, 1, 1)])
                        }
                    }
                    else if (CalcConvert.arr(args[0]))
                    {
                        var array = args[0];
                        arrayRowCount = array.getRowCount();
                        arrayColumnCount = array.getColumnCount();
                        var row = Calc._Helper._argumentExists(args, 1) ? CalcConvert.I(args[1]) : -1;
                        var column = Calc._Helper._argumentExists(args, 2) ? CalcConvert.I(args[2]) : -1;
                        var area = Calc._Helper._argumentExists(args, 3) ? (CalcConvert.I(args[3]) - 1) : 1;
                        if (area != 1)
                        {
                            return CalcErrorsReference
                        }
                        if (row === -1 && column === -1)
                        {
                            row = column = 0
                        }
                        else if (column === -1 && arrayRowCount === 1)
                        {
                            column = row;
                            row = 1
                        }
                        row = row === -1 ? 0 : row;
                        column = column === -1 ? 0 : column;
                        arrayRowCount = array.getRowCount();
                        arrayColumnCount = array.getColumnCount();
                        if (row < 0 || column < 0 || area < 0)
                            return CalcErrorsValue;
                        if (row > arrayRowCount && arrayRowCount === 1 && !Calc._Helper._argumentExists(args, 2))
                        {
                            column = row;
                            row = 0
                        }
                        if (arrayRowCount < row || arrayColumnCount < column)
                            return CalcErrorsReference;
                        if (row == 0 && column == 0)
                            return array.slice(0, 0, arrayRowCount, arrayColumnCount);
                        else if (row == 0)
                            return array.slice(0, column - 1, arrayRowCount, 1);
                        else if (column == 0)
                            return array.slice(row - 1, 0, 1, arrayColumnCount);
                        else
                            return array.getValue(row - 1, column - 1)
                    }
                }
                function eg_offset(args)
                {
                    var reference = args[0];
                    if (!reference || !(reference instanceof Calc.Reference) || reference.getRangeCount() !== 1)
                    {
                        return CalcErrorsValue
                    }
                    var rows = CalcConvert.I(args[1]);
                    var columns = CalcConvert.I(args[2]);
                    var height = Calc._Helper._argumentExists(args, 3) ? CalcConvert.I(args[3]) : reference.getRowCount(0);
                    var width = Calc._Helper._argumentExists(args, 4) ? CalcConvert.I(args[4]) : reference.getColumnCount(0);
                    var source = reference.getSource();
                    var offsetRow = reference.getRow(0) + rows;
                    var offsetColumn = reference.getColumn(0) + columns;
                    if (height <= 0 || width <= 0)
                    {
                        return CalcErrorsReference
                    }
                    if (offsetRow < 0 || source.getRowCount() < offsetRow + height)
                    {
                        return CalcErrorsReference
                    }
                    if (offsetColumn < 0 || source.getColumnCount() < offsetColumn + width)
                    {
                        return CalcErrorsReference
                    }
                    return reference.create([{
                                row: offsetRow, col: offsetColumn, rowCount: height, colCount: width
                            }])
                }
                function eg_indirect(args, context)
                {
                    if (!context)
                    {
                        return CalcErrors.NotAvailable
                    }
                    var reference = Calc.Convert.S(args[0]);
                    if (!reference)
                    {
                        return CalcErrors.Reference
                    }
                    var useA1 = Calc._Helper._argumentExists(args, 1) ? CalcConvert.B(args[1]) : true;
                    var baseRow = context.row,
                        baseCol = context.column;
                    var parser = new Calc.Parser;
                    var parserContext = context.source ? context.source.getParserContext(!useA1, baseRow, baseCol) : new Calc.ParserContext(context.source, !useA1, baseRow, baseCol);
                    var expression = parser.parse(reference, parserContext),
                        source;
                    source = expression.source || context.source;
                    if (expression)
                    {
                        if ((expression.t === 8) || (expression.t === 9))
                        {
                            expression = context.getName(expression.name)
                        }
                        if (!expression)
                        {
                            return CalcErrors.Reference
                        }
                        if ((expression.t === 0) || (expression.t === 1))
                        {
                            return source.getValue(expression.row + (expression.rowRelative ? baseRow : 0), expression.column + (expression.columnRelative ? baseCol : 0))
                        }
                        else if ((expression.t === 2) || (expression.t === 3))
                        {
                            var range = expression.getRange(baseRow, baseCol);
                            return source.getReference(range.row, range.column, range.rowCount, range.columnCount)
                        }
                        else if (expression.t === 17)
                        {
                            var structExpr = expression;
                            source = structExpr.source();
                            var range = structExpr.getRange(baseRow, baseCol);
                            if (range.row === 1 && range.column === 1)
                            {
                                return source.getValue(range.row, range.column)
                            }
                            else
                            {
                                return source.getReference(range.row, range.column, range.rowCount, range.columnCount)
                            }
                        }
                    }
                    return CalcErrors.Reference
                }
                Functions.def("ADDRESS", eg_address, {
                    minArgs: 2, maxArgs: 5, acceptsMissingArgument: Functions.acceptsTwoThreeFour
                });
                Functions.def("INDEX", eg_index, {
                    minArgs: 2, maxArgs: 4, acceptsReference: Functions.acceptsZero, acceptsArray: Functions.acceptsZero, acceptsMissingArgument: Functions.acceptsOneTwoThree, isContextSensitive: isContextSensitive
                });
                Functions.def("OFFSET", eg_offset, {
                    minArgs: 3, maxArgs: 5, acceptsMissingArgument: Functions.acceptsThreeFour, acceptsReference: Functions.acceptsZero, acceptsArray: Functions.acceptsZero, isVolatile: Functions.isVolatile, arrayArgumentEvaluateMode: 2, returnReference: Functions.isVolatile
                });
                Functions.def("ROW", eg_row, {
                    minArgs: 0, maxArgs: 1, acceptsReference: Functions.acceptsAny, isContextSensitive: isContextSensitive, precedentReference: Functions.acceptsNone, expandColumns: Functions.acceptsNone
                });
                Functions.def("COLUMN", eg_column, {
                    minArgs: 0, maxArgs: 1, acceptsMissingArgument: Functions.acceptsZero, acceptsReference: Functions.acceptsAny, isContextSensitive: isContextSensitive, precedentReference: Functions.acceptsNone, expandRows: Functions.acceptsNone
                });
                Functions.def("ROWS", eg_rows, {
                    minArgs: 1, maxArgs: 1, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny, precedentReference: Functions.acceptsNone, expandColumns: Functions.acceptsNone, isVolatile: Functions.isVolatile
                });
                Functions.def("COLUMNS", eg_columns, {
                    minArgs: 1, maxArgs: 1, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny, precedentReference: Functions.acceptsNone, expandRows: Functions.acceptsNone, isVolatile: Functions.isVolatile
                });
                Functions.def("TRANSPOSE", eg_transpose, {
                    minArgs: 1, maxArgs: 1, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny
                });
                Functions.def("LOOKUP", eg_lookup, {
                    minArgs: 2, maxArgs: 3, acceptsArray: Functions.acceptsNotZero, acceptsReference: Functions.acceptsNotZero
                });
                Functions.def("HLOOKUP", eg_hlookup, {
                    minArgs: 3, maxArgs: 4, acceptsMissingArgument: Functions.acceptsThree, acceptsArray: Functions.acceptsOne, acceptsReference: Functions.acceptsOne
                });
                Functions.def("VLOOKUP", eg_vlookup, {
                    minArgs: 3, maxArgs: 4, acceptsMissingArgument: Functions.acceptsThree, acceptsArray: Functions.acceptsOne, acceptsReference: Functions.acceptsOne
                });
                Functions.def("CHOOSE", eg_choose, {
                    minArgs: 2, maxArgs: 255, acceptsError: Functions.acceptsMoreThanOne, isBranch: Functions.isBranch, findTestArgument: Functions.findTestArgument, findBranchArgument: findBranchArgument, acceptsReference: Functions.acceptsMoreThanOne, acceptsArray: Functions.acceptsMoreThanOne
                });
                Functions.def("MATCH", eg_match, {
                    minArgs: 2, maxArgs: 3, acceptsMissingArgument: Functions.acceptsTwo, acceptsReference: Functions.acceptsOne, acceptsArray: Functions.acceptsOne
                });
                Functions.def("INDIRECT", eg_indirect, {
                    minArgs: 1, maxArgs: 2, acceptsMissingArgument: Functions.acceptsTwo, isVolatile: Functions.isVolatile, isContextSensitive: isContextSensitive
                })
            })(Calc.Functions || (Calc.Functions = {}));
            var Functions = Calc.Functions
        })(Sheets.Calc || (Sheets.Calc = {}));
        var Calc = Sheets.Calc
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}));
var GcSpread;
(function(GcSpread)
{
    (function(Sheets)
    {
        (function(Calc)
        {
            (function(Functions)
            {
                Sheets.feature("calc.functions_stat", ["calc.functions"]);
                var keyword_null = null,
                    Math_pow = Math.pow,
                    Math_max = Math.max,
                    Math_min = Math.min,
                    Math_floor = Math.floor,
                    Math_sin = Math.sin,
                    Math_tan = Math.tan,
                    Math_PI = Math.PI,
                    Math_atan = Math.atan,
                    Math_exp = Math.exp,
                    Math_abs = Math.abs,
                    Math_sqrt = Math.sqrt,
                    Math_log = Math.log,
                    Math_round = Math.round,
                    Math_PI = Math.PI;
                var CalcErrors = Calc.Errors,
                    CalcErrorsNull = CalcErrors.Null,
                    CalcErrorsDivideByZero = CalcErrors.DivideByZero,
                    CalcErrorsValue = CalcErrors.Value,
                    CalcErrorsReference = CalcErrors.Reference,
                    CalcErrorsName = CalcErrors.Name,
                    CalcErrorsNotAvailable = CalcErrors.NotAvailable,
                    CalcErrorsNumber = CalcErrors.Number,
                    CalcConvert = Calc.Convert;
                var const_undefined = "undefined";
                var const_boolean = "boolean";
                var const_string = "string";
                var const_number = "number";
                var __dev1 = Functions._StatHelper.__dev1;
                var st_normsdist = Functions._StatHelper.st_normsdist;
                var __countIncludeSubtotals = Functions._StatHelper.__countIncludeSubtotals;
                var __countaIncludeSubtotals = Functions._StatHelper.__countaIncludeSubtotals;
                var __maxIncludeSubtotals = Functions._StatHelper.__maxIncludeSubtotals;
                var __minIncludeSubtotals = Functions._StatHelper.__minIncludeSubtotals;
                var __stdevpIncludeSubtotals = Functions._StatHelper.__stdevpIncludeSubtotals;
                var __varrIncludeSubtotals = Functions._StatHelper.__varrIncludeSubtotals;
                var __varpIncludeSubtotals = Functions._StatHelper.__varpIncludeSubtotals;
                function st_max(args)
                {
                    return __maxIncludeSubtotals(args, true, true)
                }
                function st_maxa(args)
                {
                    var isAny = false,
                        max = 0.0,
                        val;
                    var convert = CalcConvert,
                        array;
                    for (var i = 0; i < args.length; i++)
                    {
                        array = CalcConvert.toArr(args[i], 0, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        if (array.isConvertError)
                        {
                            return CalcErrorsValue
                        }
                        for (var j = 0; j < array.length; j++)
                        {
                            var obj = array[j];
                            if (CalcConvert.num(obj) || (typeof obj === const_boolean))
                            {
                                val = CalcConvert.D(obj);
                                if (!isAny || val > max)
                                {
                                    max = val
                                }
                                isAny = true
                            }
                            else if (typeof obj === const_string)
                            {
                                val = 0.0;
                                if (!isAny || val > max)
                                {
                                    max = val
                                }
                                isAny = true
                            }
                            else if (CalcConvert.err(obj))
                            {
                                return obj
                            }
                        }
                    }
                    return max
                }
                function st_min(args)
                {
                    return __minIncludeSubtotals(args, true, true)
                }
                function st_mina(args)
                {
                    var _any = false,
                        min = 0.0,
                        val;
                    var convert = CalcConvert,
                        array;
                    for (var i = 0; i < args.length; i++)
                    {
                        array = CalcConvert.toArr(args[i], 0, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        if (array.isConvertError)
                        {
                            return CalcErrorsValue
                        }
                        for (var j = 0; j < array.length; j++)
                        {
                            var obj = array[j];
                            if (CalcConvert.num(obj) || (typeof obj === const_boolean))
                            {
                                val = CalcConvert.D(obj);
                                if (!_any || val < min)
                                {
                                    min = val
                                }
                                _any = true
                            }
                            else if (!array.isArray && !array.isReference)
                            {
                                return CalcErrorsValue
                            }
                            else if (typeof obj === const_string)
                            {
                                val = 0.0;
                                if (!_any || val < min)
                                {
                                    min = val
                                }
                                _any = true
                            }
                        }
                    }
                    return min
                }
                function st_large(args)
                {
                    if (CalcConvert.err(args[0]))
                    {
                        return args[0]
                    }
                    if (CalcConvert.err(args[1]))
                    {
                        return args[1]
                    }
                    var k;
                    if (isNaN(k = CalcConvert.I(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    var array = CalcConvert.toArr(args[0], 1, true, true, false);
                    if (array.isError)
                    {
                        return array[0]
                    }
                    if (array.isConvertError)
                    {
                        return CalcErrorsValue
                    }
                    var list = [];
                    for (var i = 0; i < array.length; i++)
                    {
                        var x = array[i];
                        if (x !== CalcConvert.CalcConvertedError)
                        {
                            list.push(x)
                        }
                    }
                    list.sort(function(x, y)
                    {
                        return x - y
                    });
                    if (k <= 0 || list.length < k)
                    {
                        return CalcErrorsNumber
                    }
                    return list[list.length - k]
                }
                function st_small(args)
                {
                    if (CalcConvert.err(args[0]))
                    {
                        return args[0]
                    }
                    if (CalcConvert.err(args[1]))
                    {
                        return args[1]
                    }
                    var k;
                    if (isNaN(k = CalcConvert.I(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    var array = CalcConvert.toArr(args[0], 1, true, true, false);
                    if (array.isError)
                    {
                        return array[0]
                    }
                    if (array.isConvertError)
                    {
                        return CalcErrorsValue
                    }
                    var list = [];
                    for (var i = 0; i < array.length; i++)
                    {
                        var x = array[i];
                        if (x !== CalcConvert.CalcConvertedError)
                        {
                            list.push(x)
                        }
                    }
                    list.sort(function(x, y)
                    {
                        return x - y
                    });
                    if (k <= 0 || list.length < k)
                    {
                        return CalcErrorsNumber
                    }
                    return list[k - 1]
                }
                function st_averagea(args)
                {
                    var sum = 0.0;
                    var n = 0.0;
                    for (var i = 0; i < args.length; i++)
                    {
                        var array = CalcConvert.toArr(args[i], 0, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        for (var j = 0; j < array.length; j++)
                        {
                            var obj = array[j];
                            if (CalcConvert.num(obj) || (typeof obj === const_boolean))
                            {
                                sum += CalcConvert.D(obj);
                                n++
                            }
                            else if (obj === keyword_null)
                            {
                                n++
                            }
                            else if (!array.isArray && !array.isReference)
                            {
                                return CalcErrorsValue
                            }
                            else if (typeof obj === const_string)
                            {
                                n++
                            }
                        }
                    }
                    if (n === 0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(sum / n)
                }
                function __averageifImp(range, criteria, sumRange)
                {
                    var sum = 0.0;
                    var n = 0.0;
                    var crit = Functions._MathHelper.parseCriteria(criteria);
                    if (range.rowCount !== sumRange.rowCount || range.colCount !== sumRange.colCount)
                    {
                        return CalcErrorsValue
                    }
                    for (var j = 0; j < range.length; j++)
                    {
                        var val = range[j];
                        if (crit && crit(val))
                        {
                            var obj = sumRange[j];
                            if (obj !== CalcConvert.CalcConvertedError)
                            {
                                sum += obj;
                                n++
                            }
                        }
                    }
                    if (n === 0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(sum / n)
                }
                function st_averageif(args)
                {
                    var hasSumRange = Calc._Helper._argumentExists(args, 2);
                    var range,
                        sumRange;
                    if (hasSumRange)
                    {
                        range = CalcConvert.toArr(args[0], 0, true, false, false);
                        sumRange = CalcConvert.toArr(args[2], 1, true, true, false);
                        if (sumRange.isError)
                        {
                            return sumRange[0]
                        }
                    }
                    else
                    {
                        range = CalcConvert.toArr(args[0], 1, true, true, false);
                        if (range.isError)
                        {
                            return range[0]
                        }
                        sumRange = range
                    }
                    var criteria = args[1];
                    var critieriaRef = args[1];
                    var rowCount,
                        colCount,
                        result,
                        r,
                        c;
                    if (CalcConvert.ref(critieriaRef))
                    {
                        rowCount = critieriaRef.getRowCount(0);
                        colCount = critieriaRef.getColumnCount(0);
                        result = [];
                        for (r = 0; r < rowCount; r++)
                        {
                            result[r] = [];
                            for (c = 0; c < colCount; c++)
                            {
                                result[r][c] = __averageifImp(range, critieriaRef.getValue(0, r, c), sumRange)
                            }
                        }
                        return new Calc._ConcreteArray(result)
                    }
                    var criteriaArray = args[1];
                    if (CalcConvert.arr(criteriaArray))
                    {
                        rowCount = criteriaArray.rowCount;
                        colCount = criteriaArray.colCount;
                        result = [];
                        for (r = 0; r < rowCount; r++)
                        {
                            result[r] = [];
                            for (c = 0; c < colCount; c++)
                            {
                                result[r][c] = __averageifImp(range, criteriaArray.getValue(r, c), sumRange)
                            }
                        }
                        return new Calc._ConcreteArray(result)
                    }
                    return __averageifImp(range, criteria, sumRange)
                }
                function st_averageifs(args)
                {
                    var sum = 0.0;
                    var n = 0.0,
                        obj,
                        num;
                    var sumRange = CalcConvert.toArr(args[0], 1, true, true, false);
                    var length = sumRange.length;
                    var argsArray = [];
                    for (var i = 0; i < length; i++)
                    {
                        num = sumRange[i];
                        if (num !== CalcConvert.CalcConvertedError)
                        {
                            var condition = true;
                            for (var j = 1; j < args.length; j = j + 2)
                            {
                                var range;
                                if (argsArray[j])
                                {
                                    range = argsArray[j]
                                }
                                else
                                {
                                    argsArray[j] = range = CalcConvert.toArr(args[j], 0, true, false, false)
                                }
                                var criteria = args[j + 1];
                                var crit = Functions._MathHelper.parseCriteria(criteria);
                                obj = range[i];
                                condition = crit(obj);
                                if (!condition)
                                {
                                    break
                                }
                            }
                            if (condition)
                            {
                                sum += num;
                                n++
                            }
                        }
                    }
                    if (n === 0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(sum / n)
                }
                function st_median(args)
                {
                    var list = [];
                    var convert = Calc.Convert;
                    for (var k = 0; k < args.length; k++)
                    {
                        var array = CalcConvert.toArr(args[k], 1, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        if (array.isConvertError)
                        {
                            return CalcErrorsValue
                        }
                        for (var i = 0; i < array.length; i++)
                        {
                            var x = array[i];
                            if (x !== CalcConvert.CalcConvertedError)
                            {
                                list.push(x)
                            }
                        }
                    }
                    list.sort(function(x, y)
                    {
                        return x - y
                    });
                    if (list.length === 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (list.length % 2 === 0)
                    {
                        return (CalcConvert.D(list[list.length / 2 - 1]) + CalcConvert.D(list[list.length / 2])) / 2.0
                    }
                    else
                    {
                        return list[parseInt((list.length / 2).toString(), 10)]
                    }
                }
                function st_mode(args)
                {
                    var mode = keyword_null;
                    var modeCount = 0;
                    var convert = Calc.Convert;
                    var list = [];
                    for (var argIndex = 0; argIndex < args.length; argIndex++)
                    {
                        var array = CalcConvert.toArr(args[argIndex], 1, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        if (array.isConvertError)
                        {
                            return CalcErrorsValue
                        }
                        for (var i = 0; i < array.length; i++)
                        {
                            var x = array[i];
                            if (x !== CalcConvert.CalcConvertedError)
                            {
                                list.push(x)
                            }
                        }
                    }
                    for (i = 0; i < list.length; i++)
                    {
                        var count = 0;
                        for (var j = 0; j < list.length; j++)
                        {
                            if (j !== i && list[j] === list[i])
                            {
                                count++
                            }
                        }
                        if (count > modeCount)
                        {
                            modeCount = count;
                            mode = list[i]
                        }
                    }
                    if (modeCount === 0)
                    {
                        return CalcErrorsNotAvailable
                    }
                    return mode
                }
                function st_geomean(args)
                {
                    var y;
                    var prod = 1.0;
                    var n = 0;
                    var convert = CalcConvert,
                        array;
                    for (var i = 0; i < args.length; i++)
                    {
                        array = CalcConvert.toArr(args[i], 1, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        if (array.isConvertError)
                        {
                            return CalcErrorsValue
                        }
                        for (var j = 0; j < array.length; j++)
                        {
                            y = array[j];
                            if (y !== CalcConvert.CalcConvertedError)
                            {
                                if (y <= 0.0)
                                {
                                    return CalcErrorsNumber
                                }
                                prod *= y;
                                n++
                            }
                        }
                    }
                    if (n <= 0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(Math_pow(prod, 1.0 / n))
                }
                function st_harmean(args)
                {
                    var y;
                    var sum = 0.0;
                    var n = 0;
                    var convert = CalcConvert,
                        array;
                    for (var i = 0; i < args.length; i++)
                    {
                        array = CalcConvert.toArr(args[i], 1, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        if (array.isConvertError)
                        {
                            return CalcErrorsValue
                        }
                        for (var j = 0; j < array.length; j++)
                        {
                            y = array[j];
                            if (y !== CalcConvert.CalcConvertedError)
                            {
                                if (y <= 0.0)
                                {
                                    return CalcErrorsNumber
                                }
                                sum += 1 / y;
                                n++
                            }
                        }
                    }
                    if (sum === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(n / sum)
                }
                function st_trimmean(args)
                {
                    var percent,
                        convert = Calc.Convert;
                    if (isNaN(percent = CalcConvert.D(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    var sum = 0.0;
                    if (percent < 0.0 || 1.0 <= percent)
                    {
                        return CalcErrorsNumber
                    }
                    var array = CalcConvert.toArr(args[0], 1, true, true, false);
                    if (array.isError)
                    {
                        return array[0]
                    }
                    if (array.isConvertError)
                    {
                        return CalcErrorsValue
                    }
                    var list = [];
                    for (var i = 0; i < array.length; i++)
                    {
                        var x = array[i];
                        if (x !== CalcConvert.CalcConvertedError)
                        {
                            list.push(x)
                        }
                    }
                    list.sort(function(x, y)
                    {
                        return x - y
                    });
                    var n = parseInt((list.length * percent / 2).toString(), 10);
                    for (i = n; i < list.length - n; i++)
                    {
                        sum += CalcConvert.D(list[i])
                    }
                    return sum / (list.length - 2 * n)
                }
                function st_frequency(args)
                {
                    var convert = CalcConvert,
                        errorObject = CalcConvert.CalcConvertedError;
                    var dataArray = CalcConvert.toArr(args[0], 1, false, true, false);
                    var binsArray = CalcConvert.toArr(args[1], 1, false, true, false);
                    var binsCount = 0,
                        i,
                        j,
                        element;
                    var rowCount1 = binsArray.rowCount;
                    var columnCount1 = binsArray.colCount;
                    for (i = 0; i < rowCount1; i++)
                    {
                        for (j = 0; j < columnCount1; j++)
                        {
                            element = binsArray[i][j];
                            if (element !== errorObject)
                            {
                                binsCount++
                            }
                        }
                    }
                    var rowCount2 = dataArray.rowCount;
                    var columnCount2 = dataArray.colCount;
                    var bins = [];
                    var results = [];
                    var resultsLength = binsCount + 1;
                    binsCount = 0;
                    for (i = 0; i < rowCount1; i++)
                    {
                        for (j = 0; j < columnCount1; j++)
                        {
                            element = binsArray[i][j];
                            if (element !== errorObject)
                            {
                                bins[binsCount++] = CalcConvert.D(element)
                            }
                        }
                    }
                    var binList = bins.slice(0);
                    bins.sort(function(x, y)
                    {
                        return x - y
                    });
                    for (i = 0; i < resultsLength; i++)
                    {
                        results[i] = [0]
                    }
                    for (i = 0; i < rowCount2; i++)
                    {
                        for (j = 0; j < columnCount2; j++)
                        {
                            element = dataArray[i][j];
                            if (CalcConvert.num(element))
                            {
                                var number = CalcConvert.D(element);
                                var found = false;
                                for (var k = 0; !found && k < binsCount; k++)
                                {
                                    if (number <= bins[k])
                                    {
                                        results[binList.indexOf(bins[k])][0]++;
                                        found = true
                                    }
                                }
                                if (!found)
                                {
                                    results[binsCount][0]++
                                }
                            }
                        }
                    }
                    return new Calc._ConcreteArray(results)
                }
                function st_rank(args)
                {
                    var convert = CalcConvert,
                        arrayHelper = Calc.CalcArrayHelper;
                    var num;
                    if (CalcConvert.ref(args[0]))
                    {
                        if (arrayHelper.getLength(args[0]) === 1)
                        {
                            num = arrayHelper.getValueByIndex(args[0], 0)
                        }
                        else
                        {
                            return CalcErrorsValue
                        }
                    }
                    else
                    {
                        num = args[0]
                    }
                    if (isNaN(num = CalcConvert.D(num)))
                    {
                        return CalcErrorsValue
                    }
                    var array = CalcConvert.toArr(args[1], 1, true, true, false);
                    if (array.isError)
                    {
                        return array[0]
                    }
                    var order = 0.0;
                    if (Calc._Helper._argumentExists(args, 2))
                    {
                        if (isNaN(order = CalcConvert.D(args[2])))
                        {
                            return CalcErrorsValue
                        }
                    }
                    var lessThanCount = 0;
                    var equalToCount = 0;
                    var greaterThanCount = 0;
                    for (var i = 0; i < array.length; i++)
                    {
                        var x = array[i];
                        if (x !== CalcConvert.CalcConvertedError)
                        {
                            if (x < num)
                            {
                                lessThanCount++
                            }
                            else if (num < x)
                            {
                                greaterThanCount++
                            }
                            else
                            {
                                equalToCount++
                            }
                        }
                    }
                    if (equalToCount === 0)
                    {
                        return CalcErrorsNotAvailable
                    }
                    return order === 0 ? greaterThanCount + 1 : lessThanCount + 1
                }
                function st_kurt(args)
                {
                    var x;
                    var sumx = 0.0;
                    var sumx2 = 0.0;
                    var sum4 = 0.0;
                    var mean;
                    var stdev;
                    var n = 0;
                    var convert = CalcConvert,
                        array,
                        argsArray = [];
                    var i,
                        j;
                    for (i = 0; i < args.length; i++)
                    {
                        array = CalcConvert.toArr(args[i], 1, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        if (array.isConvertError)
                        {
                            return CalcErrorsValue
                        }
                        argsArray.push(array);
                        for (j = 0; j < array.length; j++)
                        {
                            x = array[j];
                            if (x !== CalcConvert.CalcConvertedError)
                            {
                                sumx += x;
                                sumx2 += x * x;
                                n++
                            }
                        }
                        if (n <= 3)
                        {
                            return CalcErrorsDivideByZero
                        }
                        mean = sumx / n;
                        stdev = Math_sqrt((n * sumx2 - sumx * sumx) / (n * (n - 1)));
                        if (stdev === 0.0)
                        {
                            return CalcErrorsDivideByZero
                        }
                        for (i = 0; i < args.length; i++)
                        {
                            array = argsArray[i];
                            for (j = 0; j < array.length; j++)
                            {
                                x = array[j];
                                if (x !== CalcConvert.CalcConvertedError)
                                {
                                    sum4 += Math_pow((x - mean) / stdev, 4.0)
                                }
                            }
                        }
                        return CalcConvert.toResult((n * (n + 1) * sum4) / ((n - 1) * (n - 2) * (n - 3)) - (3 * (n - 1) * (n - 1)) / ((n - 2) * (n - 3)))
                    }
                }
                function st_percentrank(args)
                {
                    return __percentrank(args, true)
                }
                function st_percentrankexc(args)
                {
                    return __percentrank(args, false)
                }
                function __percentrank(args, bInclusive)
                {
                    var convert = Calc.Convert,
                        array = CalcConvert.toArr(args[0], 1, true, true, false, true);
                    if (array.isError)
                    {
                        return array[0]
                    }
                    var list = [];
                    for (var i = 0; i < array.length; i++)
                    {
                        var x = array[i];
                        if (x !== CalcConvert.CalcConvertedError)
                        {
                            list.push(x)
                        }
                    }
                    list.sort(function(x, y)
                    {
                        return x - y
                    });
                    var xval;
                    if (isNaN(xval = CalcConvert.D(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    var significance = 3;
                    if (Calc._Helper._argumentExists(args, 2))
                    {
                        if (isNaN(significance = CalcConvert.I(args[2])))
                        {
                            return CalcErrorsValue
                        }
                        if (significance < 1)
                        {
                            return CalcErrorsNumber
                        }
                    }
                    var len = list.length;
                    if (len == 0)
                    {
                        return CalcErrorsNotAvailable
                    }
                    else
                    {
                        if (xval < list[0] || xval > list[len - 1])
                        {
                            return CalcErrorsNotAvailable
                        }
                        else
                        {
                            var fRes;
                            if (len == 1)
                            {
                                fRes = 1.0
                            }
                            else
                            {
                                fRes = __getPercentrank(list, xval, bInclusive)
                            }
                            if (fRes != 0.0)
                            {
                                fRes = Math_round(fRes * Math_pow(10, significance)) / Math_pow(10, significance)
                            }
                            return fRes
                        }
                    }
                }
                function __getPercentrank(list, fVal, bInclusive)
                {
                    var nSize = list.length;
                    var fRes;
                    if (fVal == list[0])
                    {
                        if (bInclusive)
                        {
                            fRes = 0.0
                        }
                        else
                        {
                            fRes = 1.0 / (nSize + 1)
                        }
                    }
                    else
                    {
                        var nOldCount = 0;
                        var fOldVal = list[0];
                        var i;
                        for (i = 1; i < nSize && list[i] < fVal; i++)
                        {
                            if (list[i] != fOldVal)
                            {
                                nOldCount = i;
                                fOldVal = list[i]
                            }
                        }
                        if (list[i] != fOldVal)
                            nOldCount = i;
                        if (fVal == list[i])
                        {
                            if (bInclusive)
                            {
                                fRes = nOldCount / (nSize - 1)
                            }
                            else
                            {
                                fRes = (i + 1) / (nSize + 1)
                            }
                        }
                        else
                        {
                            if (nOldCount == 0)
                            {
                                fRes = 0.0
                            }
                            else
                            {
                                var fFract = (fVal - list[nOldCount - 1]) / (list[nOldCount] - list[nOldCount - 1]);
                                if (bInclusive)
                                {
                                    fRes = ((nOldCount - 1) + fFract) / (nSize - 1)
                                }
                                else
                                {
                                    fRes = (nOldCount + fFract) / (nSize + 1)
                                }
                            }
                        }
                    }
                    return fRes
                }
                function st_quartile(args)
                {
                    var array = args[0];
                    var quart = CalcConvert.I(args[1]);
                    var k = 0.0;
                    switch (quart)
                    {
                        case 0:
                            k = 0.00;
                            break;
                        case 1:
                            k = 0.25;
                            break;
                        case 2:
                            k = 0.50;
                            break;
                        case 3:
                            k = 0.75;
                            break;
                        case 4:
                            k = 1.00;
                            break;
                        default:
                            return CalcErrorsNumber
                    }
                    return Functions._StatHelper.st_percentile([array, k])
                }
                function st_count(args)
                {
                    return __countIncludeSubtotals(args, true, true)
                }
                function st_counta(args)
                {
                    return __countaIncludeSubtotals(args, true, true)
                }
                function st_countblank(args)
                {
                    var count = 0;
                    var array = CalcConvert.toArr(args[0], 0, true, false, false);
                    for (var i = 0; i < array.length; i++)
                    {
                        if (array[i] === keyword_null)
                        {
                            count++
                        }
                    }
                    return count
                }
                function __countifImp(range, criteria)
                {
                    var count = 0.0;
                    var isCriteriaZero = criteria === 0 || criteria === "*";
                    var crit = Functions._MathHelper.parseCriteria(criteria);
                    for (var i = 0; i < range.length; i++)
                    {
                        var obj = range[i];
                        if (isCriteriaZero && obj === keyword_null)
                        {}
                        else if (crit && crit(obj))
                        {
                            count++
                        }
                    }
                    return CalcConvert.toResult(count)
                }
                function st_countif(args)
                {
                    var range = CalcConvert.toArr(args[0], 0, true, false, false);
                    var criteria = CalcConvert.toArr(args[1], 0, true, false, false);
                    var count = 0.0;
                    if (criteria.isArray || criteria.isReference)
                    {
                        for (var i = 0; i < criteria.length; i++)
                        {
                            var val = __countifImp(range, criteria[i]);
                            if (CalcConvert.err(val))
                            {
                                return val
                            }
                            var d;
                            if (isNaN(d = CalcConvert.D(val)))
                            {
                                return CalcErrorsValue
                            }
                            count += d
                        }
                        return count
                    }
                    return __countifImp(range, criteria[0])
                }
                function st_countifs(args)
                {
                    var count = 0.0;
                    var convert = CalcConvert,
                        array;
                    var conditionArray = CalcConvert.toArr(args[0], 0, true, true, false);
                    if (conditionArray.isError)
                    {
                        return conditionArray[0]
                    }
                    var length = conditionArray.length;
                    for (var i = 0; i < length; i++)
                    {
                        var condition = true;
                        for (var j = 0; j < args.length; j = j + 2)
                        {
                            array = CalcConvert.toArr(args[j], 0, true, false, false);
                            var criteria = args[j + 1];
                            var crit = Functions._MathHelper.parseCriteria(criteria);
                            var obj = array[i];
                            condition = (crit && crit(obj));
                            if (!condition)
                            {
                                break
                            }
                        }
                        if (condition)
                        {
                            count++
                        }
                    }
                    return CalcConvert.toResult(count)
                }
                function __dev2(args, stc)
                {
                    var convert = CalcConvert,
                        array;
                    var x,
                        obj;
                    for (var i = 0; i < args.length; i++)
                    {
                        array = CalcConvert.toArr(args[i], 0, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        if (array.isConvertError)
                        {
                            return CalcErrorsValue
                        }
                        for (var j = 0; j < array.length; j++)
                        {
                            obj = array[j];
                            if (obj === keyword_null)
                            {
                                stc.n++
                            }
                            else if ((typeof obj) === const_string)
                            {
                                var nValue = {value: 0};
                                if (CalcConvert.rD(obj, nValue))
                                {
                                    x = nValue.value;
                                    stc.sumx += x;
                                    stc.sumx2 += x * x
                                }
                                else if (!array.isArray && !array.isReference)
                                {
                                    return CalcErrorsValue
                                }
                                stc.n++
                            }
                            else if (CalcConvert.err(obj))
                            {
                                return obj
                            }
                            else if (CalcConvert.num(obj))
                            {
                                x = CalcConvert.D(obj);
                                stc.sumx += x;
                                stc.sumx2 += x * x;
                                stc.n++
                            }
                        }
                    }
                }
                function st_avedev(args)
                {
                    var x;
                    var mean;
                    var sumx = 0.0;
                    var sumdev = 0.0;
                    var n = 0,
                        i,
                        j;
                    var convert = CalcConvert,
                        array,
                        argsArray = [];
                    for (i = 0; i < args.length; i++)
                    {
                        array = CalcConvert.toArr(args[i], 1, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        if (array.isConvertError)
                        {
                            return CalcErrorsValue
                        }
                        argsArray.push(array);
                        for (j = 0; j < array.length; j++)
                        {
                            x = array[j];
                            if (x !== CalcConvert.CalcConvertedError)
                            {
                                sumx += x;
                                n++
                            }
                        }
                    }
                    mean = sumx / n;
                    for (i = 0; i < args.length; i++)
                    {
                        array = argsArray[i];
                        for (j = 0; j < array.length; j++)
                        {
                            x = array[j];
                            if (x !== CalcConvert.CalcConvertedError)
                            {
                                sumdev += Math_abs(x - mean)
                            }
                        }
                    }
                    if (n === 0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(sumdev / n)
                }
                function st_stdeva(args)
                {
                    var data = {
                            sumx: 0.0, sumx2: 0.0, n: 0.0
                        };
                    var flag = __dev2(args, data);
                    if (CalcConvert.err(flag))
                    {
                        return flag
                    }
                    if (data.n <= 1.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(Math_sqrt(Math_max(0.0, (data.n * data.sumx2 - data.sumx * data.sumx) / (data.n * (data.n - 1.0)))))
                }
                function st_stdevp(args)
                {
                    return __stdevpIncludeSubtotals(args, true, true)
                }
                function st_stdevpa(args)
                {
                    var data = {
                            sumx: 0.0, sumx2: 0.0, n: 0.0
                        };
                    var flag = __dev2(args, data);
                    if (CalcConvert.err(flag))
                    {
                        return flag
                    }
                    if (data.n <= 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(Math_sqrt(Math_max(0.0, (data.n * data.sumx2 - data.sumx * data.sumx) / (data.n * data.n))))
                }
                function st_varr(args)
                {
                    return __varrIncludeSubtotals(args, true, true)
                }
                function st_vara(args)
                {
                    var data = {
                            sumx: 0.0, sumx2: 0.0, n: 0.0
                        };
                    var flag = __dev2(args, data);
                    if (CalcConvert.err(flag))
                    {
                        return flag
                    }
                    if (data.n <= 1.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(Math_max(0.0, (data.n * data.sumx2 - data.sumx * data.sumx) / (data.n * (data.n - 1.0))))
                }
                function st_varp(args)
                {
                    return __varpIncludeSubtotals(args, true, true)
                }
                function st_varpa(args)
                {
                    var data = {
                            sumx: 0.0, sumx2: 0.0, n: 0.0
                        };
                    var flag = __dev2(args, data);
                    if (CalcConvert.err(flag))
                    {
                        return flag
                    }
                    if (data.n <= 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(Math_max(0.0, (data.n * data.sumx2 - data.sumx * data.sumx) / (data.n * data.n)))
                }
                function st_covar(args)
                {
                    var x;
                    var y;
                    var meanx;
                    var meany;
                    var sumx = 0.0;
                    var sumy = 0.0;
                    var sumprod = 0.0;
                    var arrayX = CalcConvert.toArr(args[0], 1, true, true, false);
                    if (arrayX.isError)
                    {
                        return arrayX[0]
                    }
                    var arrayY = CalcConvert.toArr(args[1], 1, true, true, false);
                    if (arrayY.isError)
                    {
                        return arrayY[0]
                    }
                    if (arrayX.isConvertError || arrayY.isConvertError)
                    {
                        return CalcErrorsDivideByZero
                    }
                    var n = arrayX.length;
                    if (n === 0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    if (n !== arrayY.length)
                    {
                        return CalcErrorsNotAvailable
                    }
                    var count = 0,
                        i,
                        obj1,
                        obj2;
                    for (i = 0; i < n; i++)
                    {
                        x = arrayX[i];
                        y = arrayY[i];
                        if (x !== CalcConvert.CalcConvertedError && y !== CalcConvert.CalcConvertedError)
                        {
                            sumx += x;
                            sumy += y;
                            count++
                        }
                    }
                    meanx = sumx / count;
                    meany = sumy / count;
                    for (i = 0; i < n; i++)
                    {
                        x = arrayX[i];
                        y = arrayY[i];
                        if (x !== CalcConvert.CalcConvertedError && y !== CalcConvert.CalcConvertedError)
                        {
                            sumprod += (x - meanx) * (y - meany)
                        }
                    }
                    if (count <= 1)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult(sumprod / count)
                }
                function st_devsp(args)
                {
                    var x;
                    var mean;
                    var sumx = 0.0;
                    var sumdevsq = 0.0;
                    var n = 0,
                        i,
                        j;
                    var convert = CalcConvert,
                        array,
                        argsArray = [];
                    for (i = 0; i < args.length; i++)
                    {
                        array = CalcConvert.toArr(args[i], 1, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        argsArray.push(array);
                        for (j = 0; j < array.length; j++)
                        {
                            x = array[j];
                            if (x !== CalcConvert.CalcConvertedError)
                            {
                                sumx += x;
                                n++
                            }
                        }
                    }
                    mean = sumx / n;
                    for (i = 0; i < args.length; i++)
                    {
                        array = argsArray[i];
                        for (j = 0; j < array.length; j++)
                        {
                            x = array[j];
                            if (x !== CalcConvert.CalcConvertedError)
                            {
                                sumdevsq += (x - mean) * (x - mean)
                            }
                        }
                    }
                    return CalcConvert.toResult(sumdevsq)
                }
                function st_normdist(args)
                {
                    var x;
                    var mean;
                    var stdev;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(mean = CalcConvert.D(args[1])) || isNaN(stdev = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    var cumulative;
                    try
                    {
                        cumulative = CalcConvert.B(args[3])
                    }
                    catch(e)
                    {
                        return CalcErrorsValue
                    }
                    if (stdev <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (cumulative)
                    {
                        var list = [];
                        list[0] = (x - mean) / stdev;
                        return st_normsdist(list)
                    }
                    else
                    {
                        return CalcConvert.toResult(Math_exp(-((x - mean) * (x - mean)) / (2.0 * stdev * stdev)) / (Math_sqrt(2 * Math_PI) * stdev))
                    }
                }
                function st_norminv(args)
                {
                    var prob;
                    var mean;
                    var stdev;
                    if (isNaN(prob = CalcConvert.D(args[0])) || isNaN(mean = CalcConvert.D(args[1])) || isNaN(stdev = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    var q;
                    var r;
                    var val;
                    if (prob < 0.0 || 1.0 < prob)
                    {
                        return CalcErrorsNumber
                    }
                    if (stdev <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    q = prob - 0.5;
                    if (Math_abs(q) <= 0.42)
                    {
                        r = q * q;
                        val = q * (((-25.44106049637 * r + 41.39119773534) * r - 18.61500062529) * r + 2.50662823884) / ((((3.13082909833 * r - 21.06224101826) * r + 23.08336743743) * r + -8.47351093090) * r + 1.0)
                    }
                    else
                    {
                        r = prob;
                        if (q > 0.0)
                        {
                            r = 1.0 - prob
                        }
                        if (r > 2.2204460492503131e-016)
                        {
                            r = Math_sqrt(-Math_log(r));
                            val = (((2.32121276858 * r + 4.85014127135) * r - 2.29796479134) * r - 2.78718931138) / ((1.63706781897 * r + 3.54388924762) * r + 1.0);
                            if (q < 0.0)
                            {
                                val = -val
                            }
                        }
                        else if (r > 1e-300)
                        {
                            val = -2.0 * Math_log(prob);
                            r = Math_log(6.283185307179586476925286766552 * val);
                            r = r / val + (2.0 - r) / (val * val) + (-14.0 + 6.0 * r - r * r) / (2.0 * val * val * val);
                            val = Math_sqrt(val * (1 - r));
                            if (q < 0.0)
                            {
                                val = -val
                            }
                            return val
                        }
                        else
                        {
                            if (q < 0.0)
                            {
                                return -1.79769e+308
                            }
                            else
                            {
                                return 1.79769e+308
                            }
                        }
                    }
                    var x = (val - 0.0) / 1.0;
                    var denom = 0.398942280401432677939946059934 * Math_exp(-0.5 * x * x) / 1.0;
                    var o = st_normdist([val, 0.0, 1.0, true]);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    val = val - (o - prob) / denom;
                    return mean + stdev * val
                }
                function st_normsinv(args)
                {
                    var prob;
                    if (isNaN(prob = CalcConvert.D(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    if (prob < 0.0 || 1.0 < prob)
                    {
                        return CalcErrorsNumber
                    }
                    return st_norminv([prob, 0.0, 1.0])
                }
                function st_confidence(args)
                {
                    var x;
                    var stdev;
                    var size;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(stdev = CalcConvert.D(args[1])) || isNaN(size = CalcConvert.I(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (x <= 0.0 || x >= 1.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (stdev <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (size < 1)
                    {
                        return CalcErrorsNumber
                    }
                    var list = [];
                    list[0] = x / 2.0;
                    var o = st_normsinv(list);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    o = CalcConvert.D(o);
                    return -o * (stdev / Math_sqrt(size))
                }
                function st_confidence_t(args)
                {
                    var x;
                    var stdev;
                    var size;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(stdev = CalcConvert.D(args[1])) || isNaN(size = CalcConvert.I(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (x <= 0.0 || x >= 1.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (stdev <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (size < 1)
                    {
                        return CalcErrorsNumber
                    }
                    if (size === 1)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return (stdev * __getTInv(x, size - 1, 2) / Math_sqrt(size))
                }
                function __lanczos(p)
                {
                    var x,
                        tmp,
                        ser;
                    x = p;
                    tmp = x + 5.5;
                    tmp = tmp - (x + 0.5) * Math_log(tmp);
                    ser = 1.000000000190015 + 76.18009172947146 / (p + 1.0);
                    ser -= 86.50532032941678 / (p + 2.0);
                    ser += 24.01409824083091 / (p + 3.0);
                    ser -= 1.231739572450155 / (p + 4.0);
                    ser += 0.001208650973866179 / (p + 5.0);
                    ser -= 5.395239384953E-06 / (p + 6.0);
                    var pt1 = Math_log(2.506628274631001 * ser / x);
                    return pt1 - tmp
                }
                function __betacf(a, b, x)
                {
                    var m,
                        m2;
                    var retval,
                        aa,
                        c,
                        d,
                        del,
                        qab,
                        qam,
                        qap;
                    var ITMAX = 300;
                    var FPMIN = 1.0E-50;
                    var EPSILON = 1.0E-20;
                    qab = a + b;
                    qap = a + 1.0;
                    qam = a - 1.0;
                    c = 1.0;
                    d = 1.0 - qab * x / qap;
                    if (Math_abs(d) < FPMIN)
                    {
                        d = FPMIN
                    }
                    d = 1.0 / d;
                    retval = d;
                    for (m = 1; m <= ITMAX; m++)
                    {
                        m2 = m + m;
                        aa = (b - m) * m * x / ((qam + m2) * (a + m2));
                        d = 1.0 + aa * d;
                        if (Math_abs(d) < FPMIN)
                        {
                            d = FPMIN
                        }
                        c = 1.0 + aa / c;
                        if (Math_abs(c) < FPMIN)
                        {
                            c = FPMIN
                        }
                        d = 1.0 / d;
                        retval *= d * c;
                        aa = 0.0 - (a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
                        d = 1.0 + aa * d;
                        if (Math_abs(d) < FPMIN)
                        {
                            d = FPMIN
                        }
                        c = 1.0 + aa / c;
                        if (Math_abs(c) < FPMIN)
                        {
                            c = FPMIN
                        }
                        d = 1.0 / d;
                        del = d * c;
                        retval *= del;
                        if (Math_abs(del - 1.0) < EPSILON)
                        {
                            break
                        }
                    }
                    return (retval)
                }
                function st_betadist(args)
                {
                    var convert = CalcConvert,
                        helper = Calc._Helper;
                    for (var i = 0; i < args.length; i++)
                    {
                        if (CalcConvert.err(args[i]))
                        {
                            return args[i]
                        }
                    }
                    var prob,
                        alpha,
                        beta;
                    if (isNaN(prob = CalcConvert.D(args[0])) || isNaN(alpha = CalcConvert.D(args[1])) || isNaN(beta = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    var a = 0.0;
                    if (helper._argumentExists(args, 3))
                    {
                        if (isNaN(a = CalcConvert.D(args[3])))
                        {
                            return CalcErrorsValue
                        }
                    }
                    var b = 1.0;
                    if (helper._argumentExists(args, 4))
                    {
                        if (isNaN(b = CalcConvert.D(args[4])))
                        {
                            return CalcErrorsValue
                        }
                    }
                    if (alpha <= 0.0 || beta <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (prob < a || b < prob || a === b)
                    {
                        return CalcErrorsNumber
                    }
                    var x = (prob - a) / (b - a);
                    var badBetacf = false;
                    var retval;
                    var bt;
                    var pt1 = __lanczos(alpha + beta);
                    var pt2 = __lanczos(alpha);
                    var pt3 = __lanczos(beta);
                    var pt4 = Math_log(x);
                    var pt5 = Math_log(1.0 - x);
                    bt = Math_exp(pt1 - pt2 - pt3 + alpha * pt4 + beta * pt5);
                    if (x < (alpha + 1.0) / (alpha + beta + 2.0))
                    {
                        retval = bt * __betacf(beta, alpha, 1.0 - x) / beta
                    }
                    else
                    {
                        retval = 1.0 - bt * __betacf(beta, alpha, 1.0 - x) / beta
                    }
                    if (badBetacf)
                    {
                        retval = -1.0
                    }
                    return CalcConvert.toResult(retval)
                }
                function st_deta_dist(args)
                {
                    var convert = CalcConvert,
                        helper = Calc._Helper;
                    for (var i = 0; i < args.length; i++)
                    {
                        if (CalcConvert.err(args[i]))
                        {
                            return args[i]
                        }
                    }
                    var prob,
                        alpha,
                        beta;
                    if (isNaN(prob = CalcConvert.D(args[0])) || isNaN(alpha = CalcConvert.D(args[1])) || isNaN(beta = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    var cumulative = CalcConvert.B(args[3]);
                    var a = 0.0;
                    if (helper._argumentExists(args, 4))
                    {
                        if (isNaN(a = CalcConvert.D(args[4])))
                        {
                            return CalcErrorsValue
                        }
                    }
                    var b = 1.0;
                    if (helper._argumentExists(args, 5))
                    {
                        if (isNaN(b = CalcConvert.D(args[5])))
                        {
                            return CalcErrorsValue
                        }
                    }
                    if (alpha <= 0.0 || beta <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (prob < a || b < prob || a === b)
                    {
                        return CalcErrorsNumber
                    }
                    var x = (prob - a) / (b - a);
                    if (cumulative)
                    {
                        return __getBetaDist(x, alpha, beta)
                    }
                    else
                    {
                        return __getBetaDistPDF(x, alpha, beta) / (b - a)
                    }
                }
                function __getBetaDist(fXin, fAlpha, fBeta)
                {
                    if (fXin <= 0.0)
                    {
                        return 0.0
                    }
                    if (fXin >= 1.0)
                    {
                        return 1.0
                    }
                    if (fBeta == 1.0)
                    {
                        return Math_pow(fXin, fAlpha)
                    }
                    if (fAlpha == 1.0)
                    {
                        return Math_exp(fBeta * Math_log(1 - fXin)) - 1
                    }
                    var fResult;
                    var fY = (0.5 - fXin) + 0.5;
                    var flnY = Math_log(1 - fXin);
                    var fX = fXin;
                    var flnX = Math_log(fXin);
                    var fA = fAlpha;
                    var fB = fBeta;
                    var bReflect = fXin > fAlpha / (fAlpha + fBeta);
                    if (bReflect)
                    {
                        fA = fBeta;
                        fB = fAlpha;
                        fX = fY;
                        fY = fXin;
                        flnX = flnY;
                        flnY = Math_log(fXin)
                    }
                    fResult = __getBetaHelperContFrac(fX, fA, fB);
                    fResult = fResult / fA;
                    var fP = fA / (fA + fB);
                    var fQ = fB / (fA + fB);
                    var fTemp;
                    if (fA > 1.0 && fB > 1.0 && fP < 0.97 && fQ < 0.97)
                        fTemp = __getBetaDistPDF(fX, fA, fB) * fX * fY;
                    else
                        fTemp = Math_exp(fA * flnX + fB * flnY - __getLogBeta(fA, fB));
                    fResult *= fTemp;
                    if (bReflect)
                        fResult = 0.5 - fResult + 0.5;
                    if (fResult > 1.0)
                        fResult = 1.0;
                    if (fResult < 0.0)
                        fResult = 0.0;
                    return fResult
                }
                function __getBetaHelperContFrac(fX, fA, fB)
                {
                    var a1,
                        b1,
                        a2,
                        b2,
                        fnorm,
                        apl2m,
                        d2m,
                        d2m1,
                        cfnew,
                        cf;
                    var eps = 2.22045e-016;
                    a1 = 1.0;
                    b1 = 1.0;
                    b2 = 1.0 - (fA + fB) / (fA + 1.0) * fX;
                    if (b2 == 0.0)
                    {
                        a2 = 0.0;
                        fnorm = 1.0;
                        cf = 1.0
                    }
                    else
                    {
                        a2 = 1.0;
                        fnorm = 1.0 / b2;
                        cf = a2 * fnorm
                    }
                    cfnew = 1.0;
                    var rm = 1.0;
                    var fMaxIter = 50000.0;
                    var bfinished = false;
                    do
                    {
                        apl2m = fA + 2.0 * rm;
                        d2m = rm * (fB - rm) * fX / ((apl2m - 1.0) * apl2m);
                        d2m1 = -(fA + rm) * (fA + fB + rm) * fX / (apl2m * (apl2m + 1.0));
                        a1 = (a2 + d2m * a1) * fnorm;
                        b1 = (b2 + d2m * b1) * fnorm;
                        a2 = a1 + d2m1 * a2 * fnorm;
                        b2 = b1 + d2m1 * b2 * fnorm;
                        if (b2 != 0.0)
                        {
                            fnorm = 1.0 / b2;
                            cfnew = a2 * fnorm;
                            bfinished = (Math_abs(cf - cfnew) < Math_abs(cf) * eps)
                        }
                        cf = cfnew;
                        rm += 1.0
                    } while (rm < fMaxIter && !bfinished);
                    return cf
                }
                function __getBetaDistPDF(fX, fA, fB)
                {
                    if (fA === 1.0)
                    {
                        if (fB === 1.0)
                        {
                            return 1.0
                        }
                        if (fB === 2.0)
                        {
                            return -2.0 * fX + 2.0
                        }
                        if (fX === 1.0 && fB < 1.0)
                        {}
                        if (fX <= 0.01)
                        {
                            return fB + fB * Math_exp((fB - 1.0) * Math_log(1 - fX)) - 1
                        }
                        else
                        {
                            return fB * Math_pow(0.5 - fX + 0.5, fB - 1.0)
                        }
                    }
                    if (fB === 1.0)
                    {
                        if (fA === 2.0)
                        {
                            return fA * fX
                        }
                        if (fX === 0.0 && fA < 1.0)
                        {}
                        return fA * Math_pow(fX, fA - 1)
                    }
                    if (fX <= 0.0)
                    {
                        if (fA < 1.0 && fX === 0.0)
                        {}
                        else
                        {
                            return 0
                        }
                    }
                    if (fX >= 1.0)
                    {
                        if (fB < 1.0 && fX === 1.0)
                        {}
                        else
                        {
                            return 0
                        }
                    }
                    var fLogDblMax = Math_log(__d1mach(2));
                    var fLogDblMin = Math_log(__d1mach(1));
                    var fLogY = (fX < 0.1) ? Math_log(1 - fX) : Math_log(1 - fX);
                    var fLogX = Math_log(fX);
                    var fAm1LogX = (fA - 1.0) * fLogX;
                    var fBm1LogY = (fB - 1.0) * fLogY;
                    var fLogBeta = __getLogBeta(fA, fB);
                    if (fAm1LogX < fLogDblMax && fAm1LogX > fLogDblMin && fBm1LogY < fLogDblMax && fBm1LogY > fLogDblMin && fLogBeta < fLogDblMax && fLogBeta > fLogDblMin && fAm1LogX + fBm1LogY < fLogDblMax && fAm1LogX + fBm1LogY > fLogDblMin)
                    {
                        return Math_pow(fX, fA - 1.0) * Math_pow(0.5 - fX + 0.5, fB - 1.0) / __getBeta(fA, fB)
                    }
                    else
                    {
                        return Math_exp(fAm1LogX + fBm1LogY - fLogBeta)
                    }
                }
                function __getLogBeta(fAlpha, fBeta)
                {
                    var fA;
                    var fB;
                    if (fAlpha > fBeta)
                    {
                        fA = fAlpha;
                        fB = fBeta
                    }
                    else
                    {
                        fA = fBeta;
                        fB = fAlpha
                    }
                    var fg = 6.024680040776729583740234375;
                    var fgm = fg - 0.5;
                    var fLanczos = __getLanczosSum(fA);
                    fLanczos /= __getLanczosSum(fA + fB);
                    fLanczos *= __getLanczosSum(fB);
                    var fLogLanczos = Math_log(fLanczos);
                    var fABgm = fA + fB + fgm;
                    fLogLanczos += 0.5 * (Math_log(fABgm) - Math_log(fA + fgm) - Math_log(fB + fgm));
                    var fTempA = fB / (fA + fgm);
                    var fTempB = fA / (fB + fgm);
                    var fResult = -fA * Math_log(1 + fTempA) - fB * Math_log(1 + fTempB) - fgm;
                    fResult += fLogLanczos;
                    return fResult
                }
                function __getBeta(fAlpha, fBeta)
                {
                    var fA;
                    var fB;
                    var fMaxGammaArgument = 171.624376956302;
                    if (fAlpha > fBeta)
                    {
                        fA = fAlpha;
                        fB = fBeta
                    }
                    else
                    {
                        fA = fBeta;
                        fB = fAlpha
                    }
                    if (fA + fB < fMaxGammaArgument)
                    {
                        return __getGamma(fA) / __getGamma(fA + fB) * __getGamma(fB)
                    }
                    var fg = 6.024680040776729583740234375;
                    var fgm = fg - 0.5;
                    var fLanczos = __getLanczosSum(fA);
                    fLanczos /= __getLanczosSum(fA + fB);
                    fLanczos *= __getLanczosSum(fB);
                    var fABgm = fA + fB + fgm;
                    fLanczos *= Math_sqrt((fABgm / (fA + fgm)) / (fB + fgm));
                    var fTempA = fB / (fA + fgm);
                    var fTempB = fA / (fB + fgm);
                    var fResult = Math_exp(-fA * Math_log(1 + fTempA) - fB * Math_log(1 + fTempB) - fgm);
                    fResult *= fLanczos;
                    return fResult
                }
                function __getGammaHelper(fZ)
                {
                    var fGamma = __getLanczosSum(fZ);
                    var fg = 6.024680040776729583740234375;
                    var fZgHelp = fZ + fg - 0.5;
                    var fHalfpower = Math_pow(fZgHelp, fZ / 2 - 0.25);
                    fGamma *= fHalfpower;
                    fGamma /= Math_exp(fZgHelp);
                    fGamma *= fHalfpower;
                    if (fZ <= 20.0 && fZ == Functions._MathHelper.approxFloor(fZ))
                    {
                        fGamma = Math_round(fGamma)
                    }
                    return fGamma
                }
                function __getLogGammaHelper(fZ)
                {
                    var fGamma = __getLanczosSum(fZ);
                    var fg = 6.024680040776729583740234375;
                    var fZgHelp = fZ + fg - 0.5;
                    var fHalfpower = Math_pow(fZgHelp, fZ / 2 - 0.25);
                    fGamma *= fHalfpower;
                    fGamma /= Math_exp(fZgHelp);
                    fGamma *= fHalfpower;
                    if (fZ <= 20.0 && fZ == Functions._MathHelper.approxFloor(fZ))
                    {
                        fGamma = Math_round(fGamma)
                    }
                    return fGamma
                }
                function __getGamma(fZ)
                {
                    var fLogPi = Math_log(Math_PI);
                    var fLogDblMax = Math_log(__d1mach(2));
                    var fMaxGammaArgument = 171.624376956302;
                    if (fZ > fMaxGammaArgument)
                    {
                        return CalcErrorsNumber
                    }
                    if (fZ >= 1.0)
                    {
                        return __getGammaHelper(fZ)
                    }
                    if (fZ >= 0.5)
                    {
                        return __getGammaHelper(fZ + 1) / fZ
                    }
                    if (fZ >= -0.5)
                    {
                        var fLogTest = __getLogGammaHelper(fZ + 2) - Math_log(fZ + 1) - Math_log(Math_abs(fZ));
                        if (fLogTest >= fLogDblMax)
                        {
                            return CalcErrorsNumber
                        }
                        return __getGammaHelper(fZ + 2) / (fZ + 1) / fZ
                    }
                    var fLogDivisor = __getLogGammaHelper(1 - fZ) + Math_log(Math_abs(Math_sin(Math_PI * fZ)));
                    if (fLogDivisor - fLogPi >= fLogDblMax)
                    {
                        return 0.0
                    }
                    if (fLogDivisor < 0.0)
                    {
                        if (fLogPi - fLogDivisor > fLogDblMax)
                        {
                            return CalcErrorsNumber
                        }
                    }
                    return Math_exp(fLogPi - fLogDivisor) * ((Math_sin(Math_PI * fZ) < 0.0) ? -1.0 : 1.0)
                }
                function __getLogGamma(fZ)
                {
                    var fMaxGammaArgument = 171.624376956302;
                    if (fZ >= fMaxGammaArgument)
                        return __getLogGammaHelper(fZ);
                    if (fZ >= 1.0)
                        return Math_log(__getLogGammaHelper(fZ));
                    if (fZ >= 0.5)
                        return Math_log(__getLogGammaHelper(fZ + 1) / fZ);
                    return __getLogGammaHelper(fZ + 2) - Math_log(fZ + 1) - Math_log(fZ)
                }
                function __getLanczosSum(fZ)
                {
                    var fNum = [23531376880.41075968857200767445163675473, 42919803642.64909876895789904700198885093, 35711959237.35566804944018545154716670596, 17921034426.03720969991975575445893111267, 6039542586.35202800506429164430729792107, 1439720407.311721673663223072794912393972, 248874557.8620541565114603864132294232163, 31426415.58540019438061423162831820536287, 2876370.628935372441225409051620849613599, 186056.2653952234950402949897160456992822, 8071.672002365816210638002902272250613822, 210.8242777515793458725097339207133627117, 2.506628274631000270164908177133837338626];
                    var fDenom = [0, 39916800, 120543840, 150917976, 105258076, 45995730, 13339535, 2637558, 357423, 32670, 1925, 66, 1];
                    var fSumNum;
                    var fSumDenom;
                    var nI;
                    if (fZ <= 1.0)
                    {
                        fSumNum = fNum[12];
                        fSumDenom = fDenom[12];
                        for (nI = 11; nI >= 0; --nI)
                        {
                            fSumNum *= fZ;
                            fSumNum += fNum[nI];
                            fSumDenom *= fZ;
                            fSumDenom += fDenom[nI]
                        }
                    }
                    else
                    {
                        var fZInv = 1 / fZ;
                        fSumNum = fNum[0];
                        fSumDenom = fDenom[0];
                        for (nI = 1; nI <= 12; ++nI)
                        {
                            fSumNum *= fZInv;
                            fSumNum += fNum[nI];
                            fSumDenom *= fZInv;
                            fSumDenom += fDenom[nI]
                        }
                    }
                    return fSumNum / fSumDenom
                }
                function __d1mach(i)
                {
                    var list = [];
                    list[0] = 2.0;
                    switch (i)
                    {
                        case 1:
                            return 2.2250738585072014e-308;
                        case 2:
                            return 1.7976931348623158e+308;
                        case 3:
                            return Math_pow(2.0, -53.0);
                        case 4:
                            return Math_pow(2.0, 1.0 - 53.0);
                        case 5:
                            return Functions._MathHelper.log10(list);
                        default:
                            return 0.0
                    }
                }
                function __chebyshev_init(dos, nos, eta)
                {
                    var i,
                        ii;
                    var err;
                    if (nos < 1)
                    {
                        return 0
                    }
                    err = 0.0;
                    i = 0;
                    for (ii = 1; ii <= nos; ii++)
                    {
                        i = nos - ii;
                        err += Math_abs(CalcConvert.D(dos[i]));
                        if (err > eta)
                        {
                            return i
                        }
                    }
                    return i
                }
                function __chebyshev_eval(x, a, n)
                {
                    var b0,
                        b1,
                        b2,
                        twox,
                        i;
                    if (n < 1 || n > 1000)
                    {
                        return 0.0 / 0.0
                    }
                    if (x < -1.1 || x > 1.1)
                    {
                        return 0.0 / 0.0
                    }
                    twox = x * 2;
                    b2 = b1 = 0;
                    b0 = 0;
                    for (i = 1; i <= n; i++)
                    {
                        b2 = b1;
                        b1 = b0;
                        b0 = twox * b1 - b2 + CalcConvert.D(a[n - i])
                    }
                    return (b0 - b2) * 0.5
                }
                function __lgammacor(x)
                {
                    var algmcs = [];
                    algmcs[0] = (+0.1666389480451863247205729650822e+0);
                    algmcs[1] = (-0.1384948176067563840732986059135e-4);
                    algmcs[2] = (+0.9810825646924729426157171547487e-8);
                    algmcs[3] = (-0.1809129475572494194263306266719e-10);
                    algmcs[4] = (+0.6221098041892605227126015543416e-13);
                    algmcs[5] = (-0.3399615005417721944303330599666e-15);
                    algmcs[6] = (+0.2683181998482698748957538846666e-17);
                    algmcs[7] = (-0.2868042435334643284144622399999e-19);
                    algmcs[8] = (+0.3962837061046434803679306666666e-21);
                    algmcs[9] = (-0.6831888753985766870111999999999e-23);
                    algmcs[10] = (+0.1429227355942498147573333333333e-24);
                    algmcs[11] = (-0.3547598158101070547199999999999e-26);
                    algmcs[12] = (+0.1025680058010470912000000000000e-27);
                    algmcs[13] = (-0.3401102254316748799999999999999e-29);
                    algmcs[14] = (+0.1276642195630062933333333333333e-30);
                    var nalgm = 0,
                        xbig = 0.0,
                        xmax = 0.0,
                        tmp;
                    if (nalgm === 0)
                    {
                        nalgm = __chebyshev_init(algmcs, 15, __d1mach(3));
                        xbig = 1.0 / Math_sqrt(__d1mach(3));
                        xmax = Math_exp(Math_min(Math_log(__d1mach(2) / 12.0), -Math_log(12.0 * __d1mach(1))))
                    }
                    if (x < 10.0)
                    {
                        return 0.0 / 0.0
                    }
                    else if (x >= xmax)
                    {
                        return 2.2204460492503131e-016 * 2.2204460492503131e-016
                    }
                    else if (x < xbig)
                    {
                        tmp = 10.0 / x;
                        return __chebyshev_eval(tmp * tmp * 2.0 - 1.0, algmcs, nalgm) / x
                    }
                    else
                    {
                        return 1.0 / (x * 12.0)
                    }
                }
                function __logrelerr(x)
                {
                    var alnrcs = [];
                    alnrcs[0] = (+0.10378693562743769800686267719098e+1);
                    alnrcs[1] = (-0.13364301504908918098766041553133e+0);
                    alnrcs[2] = (+0.19408249135520563357926199374750e-1);
                    alnrcs[3] = (-0.30107551127535777690376537776592e-2);
                    alnrcs[4] = (+0.48694614797154850090456366509137e-3);
                    alnrcs[5] = (-0.81054881893175356066809943008622e-4);
                    alnrcs[6] = (+0.13778847799559524782938251496059e-4);
                    alnrcs[7] = (-0.23802210894358970251369992914935e-5);
                    alnrcs[8] = (+0.41640416213865183476391859901989e-6);
                    alnrcs[9] = (-0.73595828378075994984266837031998e-7);
                    alnrcs[10] = (+0.13117611876241674949152294345011e-7);
                    alnrcs[11] = (-0.23546709317742425136696092330175e-8);
                    alnrcs[12] = (+0.42522773276034997775638052962567e-9);
                    alnrcs[13] = (-0.77190894134840796826108107493300e-10);
                    alnrcs[14] = (+0.14075746481359069909215356472191e-10);
                    alnrcs[15] = (-0.25769072058024680627537078627584e-11);
                    alnrcs[16] = (+0.47342406666294421849154395005938e-12);
                    alnrcs[17] = (-0.87249012674742641745301263292675e-13);
                    alnrcs[18] = (+0.16124614902740551465739833119115e-13);
                    alnrcs[19] = (-0.29875652015665773006710792416815e-14);
                    alnrcs[20] = (+0.55480701209082887983041321697279e-15);
                    alnrcs[21] = (-0.10324619158271569595141333961932e-15);
                    alnrcs[22] = (+0.19250239203049851177878503244868e-16);
                    alnrcs[23] = (-0.35955073465265150011189707844266e-17);
                    alnrcs[24] = (+0.67264542537876857892194574226773e-18);
                    alnrcs[25] = (-0.12602624168735219252082425637546e-18);
                    alnrcs[26] = (+0.23644884408606210044916158955519e-19);
                    alnrcs[27] = (-0.44419377050807936898878389179733e-20);
                    alnrcs[28] = (+0.83546594464034259016241293994666e-21);
                    alnrcs[29] = (-0.15731559416479562574899253521066e-21);
                    alnrcs[30] = (+0.29653128740247422686154369706666e-22);
                    alnrcs[31] = (-0.55949583481815947292156013226666e-23);
                    alnrcs[32] = (+0.10566354268835681048187284138666e-23);
                    alnrcs[33] = (-0.19972483680670204548314999466666e-24);
                    alnrcs[34] = (+0.37782977818839361421049855999999e-25);
                    alnrcs[35] = (-0.71531586889081740345038165333333e-26);
                    alnrcs[36] = (+0.13552488463674213646502024533333e-26);
                    alnrcs[37] = (-0.25694673048487567430079829333333e-27);
                    alnrcs[38] = (+0.48747756066216949076459519999999e-28);
                    alnrcs[39] = (-0.92542112530849715321132373333333e-29);
                    alnrcs[40] = (+0.17578597841760239233269760000000e-29);
                    alnrcs[41] = (-0.33410026677731010351377066666666e-30);
                    alnrcs[42] = (+0.63533936180236187354180266666666e-31);
                    var nlnrel = 0,
                        xmin = 0.0;
                    if (nlnrel === 0)
                    {
                        nlnrel = __chebyshev_init(alnrcs, 43, 0.1 * __d1mach(3));
                        xmin = -1.0 + Math_sqrt(__d1mach(4))
                    }
                    if (x <= -1)
                    {
                        return 0.0 / 0.0
                    }
                    if (Math_abs(x) <= 0.375)
                    {
                        return x * (1.0 - x * __chebyshev_eval(x / 0.375, alnrcs, nlnrel))
                    }
                    else
                    {
                        return Math_log(x + 1.0)
                    }
                }
                function __gamma(x)
                {
                    var i,
                        k,
                        m,
                        ga,
                        gr,
                        z,
                        r = 1.0;
                    var g = [1.0, 0.5772156649015329, -0.6558780715202538, -0.420026350340952e-1, 0.1665386113822915, -0.421977345555443e-1, -0.9621971527877e-2, 0.7218943246663e-2, -0.11651675918591e-2, -0.2152416741149e-3, 0.1280502823882e-3, -0.201348547807e-4, -0.12504934821e-5, 0.1133027232e-5, -0.2056338417e-6, 0.6116095e-8, 0.50020075e-8, -0.11812746e-8, 0.1043427e-9, 0.77823e-11, -0.36968e-11, 0.51e-12, -0.206e-13, -0.54e-14, 0.14e-14];
                    if (x > 171.0)
                    {
                        return 1e308
                    }
                    if (x === CalcConvert.I(x))
                    {
                        if (x > 0.0)
                        {
                            ga = 1.0;
                            for (i = 2; i < x; i++)
                            {
                                ga *= i
                            }
                        }
                        else
                        {
                            ga = 1e308
                        }
                    }
                    else
                    {
                        if (Math_abs(x) > 1.0)
                        {
                            z = Math_abs(x);
                            m = CalcConvert.I(z);
                            r = 1.0;
                            for (k = 1; k <= m; k++)
                            {
                                r *= (z - k)
                            }
                            z -= m
                        }
                        else
                        {
                            z = x
                        }
                        gr = g[24];
                        for (k = 23; k >= 0; k--)
                        {
                            gr = gr * z + g[k]
                        }
                        ga = 1.0 / (gr * z);
                        if (Math_abs(x) > 1.0)
                        {
                            ga *= r;
                            if (x < 0.0)
                            {
                                ga = -Math_PI / (x * ga * Math_sin(Math_PI * x))
                            }
                        }
                    }
                    return ga
                }
                function __lgamma(x)
                {
                    var x0,
                        x2,
                        xp,
                        gl,
                        gl0,
                        k,
                        n = 0;
                    var a = [8.333333333333333e-02, -2.777777777777778e-03, 7.936507936507937e-04, -5.952380952380952e-04, 8.417508417508418e-04, -1.917526917526918e-03, 6.410256410256410e-03, -2.955065359477124e-02, 1.796443723688307e-01, -1.39243221690590];
                    x0 = x;
                    if (x <= 0.0)
                    {
                        return 1e308
                    }
                    else if ((x === 1.0) || (x === 2.0))
                    {
                        return 0.0
                    }
                    else if (x <= 7.0)
                    {
                        n = CalcConvert.I(7 - x);
                        x0 = x + n
                    }
                    x2 = 1.0 / (x0 * x0);
                    xp = 2.0 * Math_PI;
                    gl0 = a[9];
                    for (k = 8; k >= 0; k--)
                    {
                        gl0 = gl0 * x2 + a[k]
                    }
                    gl = gl0 / x0 + 0.5 * Math_log(xp) + (x0 - 0.5) * Math_log(x0) - x0;
                    if (x <= 7.0)
                    {
                        for (k = 1; k <= n; k++)
                        {
                            gl -= Math_log(x0 - 1.0);
                            x0 -= 1.0
                        }
                    }
                    return gl
                }
                function st_gammaln(args)
                {
                    var x;
                    if (isNaN(x = CalcConvert.D(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    if (x <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    return __lgamma(x)
                }
                function __lbeta(a, b)
                {
                    var corr,
                        p,
                        q;
                    p = q = a;
                    if (b < p)
                    {
                        p = b
                    }
                    if (b > q)
                    {
                        q = b
                    }
                    if (p < 0)
                    {
                        return 0.0 / 0.0
                    }
                    else if (p === 0)
                    {
                        return 1.79769e+308
                    }
                    if (p >= 10.0)
                    {
                        corr = __lgammacor(p) + __lgammacor(q) - __lgammacor(p + q);
                        return Math_log(q) * -0.5 + 0.918938533204672741780329736406 + corr + (p - 0.5) * Math_log(p / (p + q)) + q * __logrelerr(-p / (p + q))
                    }
                    else if (q >= 10)
                    {
                        corr = __lgammacor(q) - __lgammacor(p + q);
                        var list = [];
                        list[0] = p;
                        var val = st_gammaln(list);
                        if (CalcConvert.err(val))
                        {
                            return 0.0 / 0.0
                        }
                        return CalcConvert.D(val) + corr + p - p * Math_log(p + q) + (q - 0.5) * __logrelerr(-p / (p + q))
                    }
                    else
                    {
                        var a1 = __gamma(p);
                        var a2 = __gamma(q);
                        var a3 = __gamma(p + q);
                        return Math_log(a1 * (a2 / a3))
                    }
                }
                function __pbeta_raw(x, pin, qin)
                {
                    var ans,
                        c,
                        finsum,
                        p,
                        ps,
                        p1,
                        q,
                        term,
                        xb,
                        xi,
                        y;
                    var n,
                        i,
                        ib;
                    var eps = 0.0;
                    var alneps = 0.0;
                    var sml = 0.0;
                    var alnsml = 0.0;
                    if (eps === 0.0)
                    {
                        eps = __d1mach(3);
                        alneps = Math_log(eps);
                        sml = __d1mach(1);
                        alnsml = Math_log(sml)
                    }
                    y = x;
                    p = pin;
                    q = qin;
                    if (p / (p + q) < x)
                    {
                        y = 1.0 - y;
                        p = qin;
                        q = pin
                    }
                    if ((p + q) * y / (p + 1.0) < eps)
                    {
                        ans = 0.0;
                        xb = p * Math_log(Math_max(y, sml)) - Math_log(p) - __lbeta(p, q);
                        if (xb > alnsml && y !== 0.0)
                        {
                            ans = Math_exp(xb)
                        }
                        if (y !== x || p !== pin)
                        {
                            ans = 1.0 - ans
                        }
                    }
                    else
                    {
                        ps = q - Math_floor(q);
                        if (ps === 0.0)
                        {
                            ps = 1.0
                        }
                        xb = p * Math_log(y) - __lbeta(ps, p) - Math_log(p);
                        ans = 0.0;
                        if (xb >= alnsml)
                        {
                            ans = Math_exp(xb);
                            term = ans * p;
                            if (ps !== 1.0)
                            {
                                n = CalcConvert.I(Math_max(alneps / Math_log(y), 4.0));
                                for (i = 1; i <= n; i++)
                                {
                                    xi = i;
                                    term = term * (xi - ps) * y / xi;
                                    ans = ans + term / (p + xi)
                                }
                            }
                        }
                        if (q > 1.0)
                        {
                            xb = p * Math_log(y) + q * Math_log(1.0 - y) - __lbeta(p, q) - Math_log(q);
                            ib = CalcConvert.I(Math_max(xb / alnsml, 0.0));
                            term = Math_exp(xb - ib * alnsml);
                            c = 1.0 / (1.0 - y);
                            p1 = q * c / (p + q - 1.0);
                            finsum = 0;
                            n = CalcConvert.I(q);
                            if (q === n)
                            {
                                n = n - 1
                            }
                            for (i = 1; i <= n; i++)
                            {
                                if (p1 <= 1 && term / eps <= finsum)
                                {
                                    break
                                }
                                xi = i;
                                term = (q - xi + 1.0) * c * term / (p + q - xi);
                                if (term > 1.0)
                                {
                                    ib = ib - 1;
                                    term = term * sml
                                }
                                if (ib === 0)
                                {
                                    finsum = finsum + term
                                }
                            }
                            ans = ans + finsum
                        }
                        if (y !== x || p !== pin)
                        {
                            ans = 1.0 - ans
                        }
                        ans = Math_max(Math_min(ans, 1.0), 0.0)
                    }
                    return ans
                }
                function __pbeta(x, pin, qin)
                {
                    if (pin <= 0 || qin <= 0)
                    {
                        return 0.0 / 0.0
                    }
                    if (x <= 0)
                    {
                        return 0
                    }
                    if (x >= 1)
                    {
                        return 1
                    }
                    return __pbeta_raw(x, pin, qin)
                }
                function st_betainv(args)
                {
                    var convert = CalcConvert,
                        helper = Calc._Helper;
                    for (var i = 0; i < args.length; i++)
                    {
                        if (CalcConvert.err(args[i]))
                        {
                            return args[i]
                        }
                    }
                    var prob,
                        alpha,
                        beta;
                    if (isNaN(prob = CalcConvert.D(args[0])) || isNaN(alpha = CalcConvert.D(args[1])) || isNaN(beta = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    var aa = 0.0;
                    if (helper._argumentExists(args, 3))
                    {
                        if (isNaN(aa = CalcConvert.D(args[3])))
                        {
                            return CalcErrorsValue
                        }
                    }
                    var bb = 1.0;
                    if (helper._argumentExists(args, 4))
                    {
                        if (isNaN(bb = CalcConvert.D(args[4])))
                        {
                            return CalcErrorsValue
                        }
                    }
                    if (prob <= 0.0 || 1.0 <= prob)
                    {
                        return CalcErrorsNumber
                    }
                    if (alpha <= 0.0 || beta <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    var const1 = 2.30753,
                        const2 = 0.27061,
                        const3 = 0.99229,
                        const4 = 0.04481,
                        zero = 0.0,
                        fpu = 3.0e-308,
                        acu_min = 1.0e-300,
                        lower = fpu;
                    var upper = 1.0 - 2.22e-16,
                        five = 5.0,
                        six = 6.0,
                        two = 2.0;
                    var swap_tail,
                        i_pb,
                        i_inn,
                        a,
                        adj,
                        logbeta,
                        g,
                        h,
                        pp,
                        prev,
                        qq,
                        r,
                        s,
                        t,
                        tx,
                        w,
                        y,
                        yprev,
                        acu,
                        xinbta;
                    xinbta = prob;
                    if (alpha < zero || beta < zero || prob < zero || prob > 1.0)
                    {
                        return 0.0 / 0.0
                    }
                    if (prob === zero || prob === 1.0)
                    {
                        return prob
                    }
                    logbeta = __lbeta(alpha, beta);
                    if (prob <= 0.5)
                    {
                        a = prob;
                        pp = alpha;
                        qq = beta;
                        swap_tail = 0
                    }
                    else
                    {
                        a = 1.0 - prob;
                        pp = beta;
                        qq = alpha;
                        swap_tail = 1
                    }
                    r = Math_sqrt(-Math_log(a * a));
                    y = r - (const1 + const2 * r) / (1.0 + (const3 + const4 * r) * r);
                    if (pp > 1.0 && qq > 1.0)
                    {
                        r = (y * y - 3.0) / 6.0;
                        s = 1.0 / (pp + pp - 1.0);
                        t = 1.0 / (qq + qq - 1.0);
                        h = 2.0 / (s + t);
                        w = y * Math_sqrt(h + r) / h - (t - s) * (r + five / six - two / (3.0 * h));
                        xinbta = pp / (pp + qq * Math_exp(w + w))
                    }
                    else
                    {
                        r = qq + qq;
                        t = 1.0 / (9.0 * qq);
                        t = r * Math_pow(1.0 - t + y * Math_sqrt(t), 3.0);
                        if (t <= zero)
                        {
                            xinbta = 1.0 - Math_exp((Math_log((1.0 - a) * qq) + logbeta) / qq)
                        }
                        else
                        {
                            t = (4.0 * pp + r - two) / t;
                            if (t <= 1.0)
                            {
                                xinbta = Math_exp((Math_log(a * pp) + logbeta) / pp)
                            }
                            else
                            {
                                xinbta = 1.0 - two / (t + 1.0)
                            }
                        }
                    }
                    r = 1.0 - pp;
                    t = 1.0 - qq;
                    yprev = zero;
                    adj = 1.0;
                    if (xinbta < lower)
                    {
                        xinbta = lower
                    }
                    else if (xinbta > upper)
                    {
                        xinbta = upper
                    }
                    acu = Math_max(acu_min, Math_pow(10.0, -13.0 - 2.5 / (pp * pp) - 0.5 / (a * a)));
                    tx = prev = zero;
                    for (i_pb = 0; i_pb < 1000; i_pb++)
                    {
                        y = __pbeta_raw(xinbta, pp, qq);
                        y = (y - a) * Math_exp(logbeta + r * Math_log(xinbta) + t * Math_log(1.0 - xinbta));
                        if (y * yprev <= zero)
                        {
                            prev = Math_max(Math_abs(adj), fpu)
                        }
                        g = 1.0;
                        for (i_inn = 0; i_inn < 1000; i_inn++)
                        {
                            adj = g * y;
                            if (Math_abs(adj) < prev)
                            {
                                tx = xinbta - adj;
                                if (tx >= zero && tx <= 1.0)
                                {
                                    if (prev <= acu)
                                    {
                                        if (swap_tail !== 0)
                                        {
                                            xinbta = 1.0 - xinbta
                                        }
                                        return CalcConvert.toResult((bb - aa) * xinbta + aa)
                                    }
                                    if (Math_abs(y) <= acu)
                                    {
                                        if (swap_tail !== 0)
                                        {
                                            xinbta = 1.0 - xinbta
                                        }
                                        return CalcConvert.toResult((bb - aa) * xinbta + aa)
                                    }
                                    if (tx !== zero && tx !== 1.0)
                                    {
                                        break
                                    }
                                }
                            }
                            g /= 3.0
                        }
                        var xtrunc = tx;
                        if (xtrunc === xinbta)
                        {
                            if (swap_tail !== 0)
                            {
                                xinbta = 1.0 - xinbta
                            }
                            return CalcConvert.toResult((bb - aa) * xinbta + aa)
                        }
                        xinbta = tx;
                        yprev = y
                    }
                    if (swap_tail !== 0)
                    {
                        xinbta = 1.0 - xinbta
                    }
                    return CalcConvert.toResult((bb - aa) * xinbta + aa)
                }
                function st_binomdist(args)
                {
                    var x,
                        n;
                    if (isNaN(x = CalcConvert.I(args[0])) || isNaN(n = CalcConvert.I(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    var p;
                    if (isNaN(p = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    var cum;
                    try
                    {
                        cum = CalcConvert.B(args[3])
                    }
                    catch(e)
                    {
                        return CalcErrorsValue
                    }
                    if (x < 0 || n < 0 || n < x || p < 0.0 || 1.0 < p)
                    {
                        return CalcErrorsNumber
                    }
                    var q,
                        factor,
                        i;
                    if (!cum)
                    {
                        q = 1.0 - p;
                        factor = Math_pow(q, n);
                        if (factor === 0.0)
                        {
                            factor = Math_pow(p, n);
                            if (factor === 0.0)
                            {
                                return CalcErrorsNumber
                            }
                            else
                            {
                                for (i = 0; i < n - x && factor > 0.0; i++)
                                {
                                    factor *= CalcConvert.D(n - i) / CalcConvert.D((i + 1) * q / p)
                                }
                                return factor
                            }
                        }
                        else
                        {
                            for (i = 0; i < x && factor > 0.0; i++)
                            {
                                factor *= CalcConvert.D(n - i) / CalcConvert.D((i + 1) * p / q)
                            }
                            return factor
                        }
                    }
                    else
                    {
                        if (n === x)
                        {
                            return 1.0
                        }
                        else
                        {
                            q = 1.0 - p;
                            factor = Math_pow(q, n);
                            var sum;
                            if (factor === 0.0)
                            {
                                factor = Math_pow(p, n);
                                if (factor === 0.0)
                                {
                                    return CalcErrorsNumber
                                }
                                else
                                {
                                    sum = 1.0 - factor;
                                    for (i = 0; i < n - x && factor > 0.0; i++)
                                    {
                                        factor *= CalcConvert.D(n - i) / CalcConvert.D((i + 1) * q / p);
                                        sum -= factor
                                    }
                                    if (sum < 0.0)
                                    {
                                        return 0.0
                                    }
                                    else
                                    {
                                        return sum
                                    }
                                }
                            }
                            else
                            {
                                sum = factor;
                                for (i = 0; i < x && factor > 0.0; i++)
                                {
                                    factor *= CalcConvert.D(n - i) / CalcConvert.D((i + 1) * p / q);
                                    sum += factor
                                }
                                return sum
                            }
                        }
                    }
                }
                function st_negbinomdist(args)
                {
                    var x,
                        r;
                    if (isNaN(x = CalcConvert.I(args[0])) || isNaN(r = CalcConvert.I(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    var p;
                    if (isNaN(p = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (p < 0.0 || p >= 1.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (x + r - 1 <= 0)
                    {
                        return CalcErrorsNumber
                    }
                    var o = Functions._MathHelper.combin(x + r - 1, r - 1);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    var pt1 = CalcConvert.D(o);
                    var pt2 = Math_pow(p, r);
                    var pt3 = Math_pow(1.0 - p, x);
                    return CalcConvert.toResult(pt1 * pt2 * pt3)
                }
                function st_negbinom_dist(args)
                {
                    var x,
                        r;
                    if (isNaN(x = CalcConvert.I(args[0])) || isNaN(r = CalcConvert.I(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    if (x < 0 || r < 1)
                    {
                        return CalcErrorsNumber
                    }
                    var p;
                    if (isNaN(p = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (p < 0.0 || p >= 1.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (x + r - 1 <= 0)
                    {
                        return CalcErrorsNumber
                    }
                    var bCumulative = CalcConvert.B(args[3]);
                    if (bCumulative)
                    {
                        return 1 - __getBetaDist(1 - p, x + 1, r)
                    }
                    else
                    {
                        var fFactor = Math_pow(p, r);
                        for (var i = 0; i < x; i++)
                        {
                            fFactor *= (i + r) / (i + 1.0) * (1 - p)
                        }
                        return fFactor
                    }
                }
                function st_critbinom(args)
                {
                    var n;
                    if (isNaN(n = CalcConvert.I(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    var p,
                        alpha;
                    if (isNaN(p = CalcConvert.D(args[1])) || isNaN(alpha = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (n < 0 || p < 0.0 || 1.0 < p || alpha <= 0.0 || 1.0 <= alpha)
                    {
                        return CalcErrorsNumber
                    }
                    else
                    {
                        var q = 1.0 - p;
                        var factor = Math_pow(q, n);
                        var sum,
                            i;
                        if (factor === 0.0)
                        {
                            factor = Math_pow(p, n);
                            if (factor === 0.0)
                            {
                                return CalcErrorsNumber
                            }
                            else
                            {
                                sum = 1.0 - factor;
                                for (i = 0; i < n && sum >= alpha; i++)
                                {
                                    factor *= CalcConvert.D(n - i) / CalcConvert.D((i + 1) * q / p);
                                    sum -= factor
                                }
                                return CalcConvert.D(n - i)
                            }
                        }
                        else
                        {
                            sum = factor;
                            for (i = 0; i < n && sum < alpha; i++)
                            {
                                factor *= CalcConvert.D(n - i) / CalcConvert.D((i + 1) * p / q);
                                sum += factor
                            }
                            return CalcConvert.D(i)
                        }
                    }
                }
                function st_chidist(args)
                {
                    for (var i = 0; i < args.length; i++)
                    {
                        if (CalcConvert.err(args[i]))
                        {
                            return args[i]
                        }
                    }
                    var x,
                        df;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(df = CalcConvert.D(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    if (x < 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (df < 1.0 || df > Math_pow(10.0, 10.0))
                    {
                        return CalcErrorsNumber
                    }
                    var LOG_SQRT_PI = Math_log(Math_sqrt(Math_PI));
                    var I_SQRT_PI = 1.0 / Math_sqrt(Math_PI);
                    var e,
                        s,
                        z,
                        c,
                        a,
                        y = 0.0,
                        x1 = x;
                    a = 0.5 * x1;
                    var even = (df % 2 === 0);
                    if (df > 1.0)
                    {
                        y = Math_exp(-a)
                    }
                    var list = [];
                    list[0] = -Math_sqrt(x1);
                    var o = st_normsdist(list);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    var zz = CalcConvert.D(o);
                    s = (even ? y : (2.0 * zz));
                    if (df > 2)
                    {
                        x1 = 0.5 * (df - 1.0);
                        z = (even ? 1.0 : 0.5);
                        if (a > 20.0)
                        {
                            e = (even ? 0.0 : LOG_SQRT_PI);
                            c = Math_log(a);
                            while (z <= x1)
                            {
                                e = Math_log(z) + e;
                                s += Math_exp(c * z - a - e);
                                z += 1.0
                            }
                            return s
                        }
                        else
                        {
                            e = (even ? 1.0 : (I_SQRT_PI / Math_sqrt(a)));
                            c = 0.0;
                            while (z <= x1)
                            {
                                e = e * (a / z);
                                c = c + e;
                                z += 1.0
                            }
                            return c * y + s
                        }
                    }
                    else
                    {
                        return s
                    }
                }
                function st_chisq_dist(args)
                {
                    for (var i = 0; i < args.length; i++)
                    {
                        if (CalcConvert.err(args[i]))
                        {
                            return args[i]
                        }
                    }
                    var x,
                        df,
                        bCumulative;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(df = CalcConvert.I(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    if (x < 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (df < 1.0 || df > Math_pow(10.0, 10.0))
                    {
                        return CalcErrorsNumber
                    }
                    bCumulative = CalcConvert.B(args[2]);
                    if (bCumulative)
                    {
                        return __getChisqDistCDF(x, df)
                    }
                    else
                    {
                        return __getChisqDistPDF(x, df)
                    }
                }
                function __getChisqDistCDF(x, df)
                {
                    if (x <= 0.0)
                    {
                        return 0
                    }
                    else
                    {
                        return __getLowRegIGamma(df / 2.0, x / 2.0)
                    }
                }
                function __getLowRegIGamma(fA, fX)
                {
                    var fLnFactor = fA * Math_log(fX) - fX - __getLogGamma(fA);
                    var fFactor = Math_exp(fLnFactor);
                    if (fX > fA + 1.0)
                    {
                        return 1.0 - fFactor * __getGammaContFraction(fA, fX)
                    }
                    else
                    {
                        return fFactor * __getGammaSeries(fA, fX)
                    }
                }
                function __getGammaSeries(fA, fX)
                {
                    var fHalfMachEps = 0.5 * __d1mach(3);
                    var fDenomfactor = fA;
                    var fSummand = 1.0 / fA;
                    var fSum = fSummand;
                    var nCount = 1;
                    do
                    {
                        fDenomfactor = fDenomfactor + 1.0;
                        fSummand = fSummand * fX / fDenomfactor;
                        fSum = fSum + fSummand;
                        nCount = nCount + 1
                    } while (fSummand / fSum > fHalfMachEps && nCount <= 10000);
                    if (nCount > 10000)
                    {
                        return CalcErrorsValue
                    }
                    return fSum
                }
                function __getGammaContFraction(fA, fX)
                {
                    var fBigInv = __d1mach(3);
                    var fHalfMachEps = 0.5 * fBigInv;
                    var fBig = 1.0 / fBigInv;
                    var fCount = 0.0;
                    var fNum = 0.0;
                    var fY = 1.0 - fA;
                    var fDenom = fX + 2.0 - fA;
                    var fPk = 0.0;
                    var fPkm1 = fX + 1.0;
                    var fPkm2 = 1.0;
                    var fQk = 1.0;
                    var fQkm1 = fDenom * fX;
                    var fQkm2 = fX;
                    var fApprox = fPkm1 / fQkm1;
                    var bFinished = false;
                    var fR = 0.0;
                    do
                    {
                        fCount = fCount + 1.0;
                        fY = fY + 1.0;
                        fNum = fY * fCount;
                        fDenom = fDenom + 2.0;
                        fPk = fPkm1 * fDenom - fPkm2 * fNum;
                        fQk = fQkm1 * fDenom - fQkm2 * fNum;
                        if (fQk != 0.0)
                        {
                            fR = fPk / fQk;
                            bFinished = (Math_abs((fApprox - fR) / fR) <= fHalfMachEps);
                            fApprox = fR
                        }
                        fPkm2 = fPkm1;
                        fPkm1 = fPk;
                        fQkm2 = fQkm1;
                        fQkm1 = fQk;
                        if (Math_abs(fPk) > fBig)
                        {
                            fPkm2 = fPkm2 * fBigInv;
                            fPkm1 = fPkm1 * fBigInv;
                            fQkm2 = fQkm2 * fBigInv;
                            fQkm1 = fQkm1 * fBigInv
                        }
                    } while (!bFinished && fCount < 10000);
                    if (!bFinished)
                    {
                        return CalcErrorsValue
                    }
                    return fApprox
                }
                function __getChisqDistPDF(x, df)
                {
                    var fValue;
                    if (x <= 0.0)
                        return 0.0;
                    if (df * x > 1391000.0)
                    {
                        fValue = Math_exp((0.5 * df - 1) * Math_log(x * 0.5) - 0.5 * x - Math_log(2.0) - __getLogGamma(0.5 * df))
                    }
                    else
                    {
                        var fCount;
                        if ((df % 2.0) < 0.5)
                        {
                            fValue = 0.5;
                            fCount = 2.0
                        }
                        else
                        {
                            fValue = 1 / Math_sqrt(x * 2 * Math_PI);
                            fCount = 1.0
                        }
                        while (fCount < df)
                        {
                            fValue *= (x / fCount);
                            fCount += 2.0
                        }
                        if (x >= 1425.0)
                            fValue = Math_exp(Math_log(fValue) - x / 2);
                        else
                            fValue *= Math_exp(-x / 2)
                    }
                    return fValue
                }
                function st_gammadist(args)
                {
                    var x,
                        alpha,
                        beta;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(alpha = CalcConvert.D(args[1])) || isNaN(beta = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    var cum;
                    try
                    {
                        cum = CalcConvert.B(args[3])
                    }
                    catch(e)
                    {
                        return CalcErrorsValue
                    }
                    if (x < 0.0 || alpha <= 0.0 || beta <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (cum === false)
                    {
                        var pt1 = Math_pow(beta, alpha);
                        if (isNaN(pt1) || !isFinite(pt1))
                        {
                            return CalcErrorsDivideByZero
                        }
                        var pt2 = 1.0 / (pt1 * __gamma(alpha));
                        var pt3 = Math_pow(x, alpha - 1.0);
                        var pt4 = Math_exp(-(x / beta));
                        var pt5 = pt3 * pt4;
                        return pt2 * pt5
                    }
                    else
                    {
                        var pn1,
                            pn2,
                            pn3,
                            pn4,
                            pn5,
                            pn6,
                            arg,
                            c,
                            rn,
                            a,
                            b,
                            an;
                        var sum,
                            o;
                        var third = 1.0 / 3.0;
                        var xbig = 1.0e+8;
                        var oflo = 1.0e+37;
                        var plimit = 1000.0e0;
                        var elimit = -88.0e0;
                        x = x / beta;
                        if (x <= 0.0)
                        {
                            return CalcErrorsNumber
                        }
                        if (alpha > plimit)
                        {
                            pn1 = Math_sqrt(alpha) * 3.0 * (Math_pow((x / alpha), third) + 1.0 / (alpha * 9.0) - 1.0);
                            o = st_normdist([pn1, 0.0, 1.0, true]);
                            if (CalcConvert.err(o))
                            {
                                return o
                            }
                            return CalcConvert.D(o)
                        }
                        if (x > xbig)
                        {
                            return 1.0
                        }
                        if (x <= 1.0 || x < alpha)
                        {
                            var list = [];
                            list[0] = alpha + 1.0;
                            o = st_gammaln(list);
                            if (CalcConvert.err(o))
                            {
                                return o
                            }
                            arg = alpha * Math_log(x) - x - CalcConvert.D(o);
                            c = 1.0;
                            sum = 1.0;
                            a = alpha;
                            do
                            {
                                a = a + 1.0;
                                c = c * x / a;
                                sum = sum + c
                            } while (c > 2.2204460492503131e-016);
                            arg = arg + Math_log(sum);
                            sum = 0.0;
                            if (arg >= elimit)
                            {
                                sum = Math_exp(arg)
                            }
                        }
                        else
                        {
                            var list1 = [];
                            list1[0] = alpha;
                            o = st_gammaln(list1);
                            if (CalcConvert.err(o))
                            {
                                return o
                            }
                            arg = alpha * Math_log(x) - x - CalcConvert.D(o);
                            a = 1.0 - alpha;
                            b = a + x + 1.0;
                            c = 0.0;
                            pn1 = 1.0;
                            pn2 = x;
                            pn3 = x + 1.0;
                            pn4 = x * b;
                            sum = pn3 / pn4;
                            for (; ; )
                            {
                                a = a + 1.0;
                                b = b + 2.0;
                                c = c + 1.0;
                                an = a * c;
                                pn5 = b * pn3 - an * pn1;
                                pn6 = b * pn4 - an * pn2;
                                if (Math_abs(pn6) > 0.0)
                                {
                                    rn = pn5 / pn6;
                                    if (Math_abs(sum - rn) <= Math_min(2.2204460492503131e-016, 2.2204460492503131e-016 * rn))
                                    {
                                        break
                                    }
                                    sum = rn
                                }
                                pn1 = pn3;
                                pn2 = pn4;
                                pn3 = pn5;
                                pn4 = pn6;
                                if (Math_abs(pn5) >= oflo)
                                {
                                    pn1 = pn1 / oflo;
                                    pn2 = pn2 / oflo;
                                    pn3 = pn3 / oflo;
                                    pn4 = pn4 / oflo
                                }
                            }
                            arg = arg + Math_log(sum);
                            sum = 1.0;
                            if (arg >= elimit)
                            {
                                sum = 1.0 - Math_exp(arg)
                            }
                        }
                        return sum
                    }
                }
                function st_gammainv(args)
                {
                    var prob,
                        alpha,
                        beta;
                    if (isNaN(prob = CalcConvert.D(args[0])) || isNaN(alpha = CalcConvert.D(args[1])) || isNaN(beta = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    var C7 = 4.67,
                        C8 = 6.66,
                        C9 = 6.73,
                        C10 = 13.32,
                        C11 = 60.0,
                        C12 = 70.0,
                        C13 = 84.0,
                        C14 = 105.0;
                    var C15 = 120.0,
                        C16 = 127.0,
                        C17 = 140.0,
                        C18 = 1175.0,
                        C19 = 210.0,
                        C20 = 252.0,
                        C21 = 2264.0;
                    var C22 = 294.0,
                        C23 = 346.0,
                        C24 = 420.0,
                        C25 = 462.0,
                        C26 = 606.0,
                        C27 = 672.0,
                        C28 = 707.0;
                    var C29 = 735.0,
                        C30 = 889.0,
                        C31 = 932.0,
                        C32 = 966.0,
                        C33 = 1141.0,
                        C34 = 1182.0,
                        C35 = 1278.0;
                    var C36 = 1740.0,
                        C37 = 2520.0,
                        C38 = 5040.0,
                        EPS0 = 5.0e-7,
                        EPS1 = 1.0e-2,
                        EPS2 = 5.0e-7;
                    var MAXIT = 20.0,
                        pMIN = 0.000002,
                        pMAX = 0.999998;
                    var a,
                        b,
                        c,
                        ch,
                        g,
                        p1,
                        v;
                    var p2,
                        q,
                        s1,
                        s2,
                        s3,
                        s4,
                        s5,
                        s6,
                        t,
                        x;
                    var i;
                    if (prob < 0.0 || 1.0 < prob || alpha <= 0.0 || beta <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (prob < pMIN)
                    {
                        return 0.0
                    }
                    if (prob > pMAX)
                    {
                        return 1.79769e+308
                    }
                    v = 2.0 * alpha;
                    c = alpha - 1.0;
                    var list = [];
                    list[0] = alpha;
                    var o = st_gammaln(list);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    g = CalcConvert.D(o);
                    if (v < (-1.24) * Math_log(prob))
                    {
                        ch = Math_pow(prob * alpha * Math_exp(g + alpha * 0.69314718055994530942), 1.0 / alpha);
                        if (ch < EPS0)
                        {
                            return 0.0 / 0.0
                        }
                    }
                    else if (v > 0.32)
                    {
                        o = st_norminv([prob, 0.0, 1.0]);
                        if (CalcConvert.err(o))
                        {
                            return o
                        }
                        x = CalcConvert.D(o);
                        p1 = 0.222222 / v;
                        ch = v * Math_pow(x * Math_sqrt(p1) + 1.0 - p1, 3.0);
                        if (ch > 2.2 * v + 6)
                        {
                            ch = -2.0 * (Math_log(1.0 - prob) - c * Math_log(0.5 * ch) + g)
                        }
                    }
                    else
                    {
                        ch = 0.4;
                        a = Math_log(1.0 - prob) + g + c * 0.69314718055994530942;
                        do
                        {
                            q = ch;
                            p1 = 1.0 + ch * (C7 + ch);
                            p2 = ch * (C9 + ch * (C8 + ch));
                            t = -0.5 + (C7 + 2 * ch) / p1 - (C9 + ch * (C10 + 3.0 * ch)) / p2;
                            ch -= (1.0 - Math_exp(a + 0.5 * ch) * p2 / p1) / t
                        } while (Math_abs(q / ch - 1.0) > EPS1)
                    }
                    for (i = 1; i <= MAXIT; i++)
                    {
                        q = ch;
                        p1 = 0.5 * ch;
                        o = st_gammadist([p1, alpha, 1.0, true]);
                        if (CalcConvert.err(o))
                        {
                            return o
                        }
                        p2 = prob - CalcConvert.D(o);
                        t = p2 * Math_exp(alpha * 0.69314718055994530942 + g + p1 - c * Math_log(ch));
                        b = t / ch;
                        a = 0.5 * t - b * c;
                        s1 = (C19 + a * (C17 + a * (C14 + a * (C13 + a * (C12 + C11 * a))))) / C24;
                        s2 = (C24 + a * (C29 + a * (C32 + a * (C33 + C35 * a)))) / C37;
                        s3 = (C19 + a * (C25 + a * (C28 + C31 * a))) / C37;
                        s4 = (C20 + a * (C27 + C34 * a) + c * (C22 + a * (C30 + C36 * a))) / C38;
                        s5 = (C13 + C21 * a + c * (C18 + C26 * a)) / C37;
                        s6 = (C15 + c * (C23 + C16 * c)) / C38;
                        ch = ch + t * (1 + 0.5 * t * s1 - b * c * (s1 - b * (s2 - b * (s3 - b * (s4 - b * (s5 - b * s6))))));
                        if (Math_abs(q / ch - 1) > EPS2)
                        {
                            return 0.5 * beta * ch
                        }
                    }
                    return 0.5 * beta * ch
                }
                function st_chiinv(args)
                {
                    for (var i = 0; i < args.length; i++)
                    {
                        if (CalcConvert.err(args[i]))
                        {
                            return args[i]
                        }
                    }
                    var x;
                    if (isNaN(x = CalcConvert.D(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    var df;
                    if (isNaN(df = CalcConvert.I(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    if (x < 0.0 || x > 1.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (df < 1.0 || df > Math_pow(10.0, 10.0))
                    {
                        return CalcErrorsNumber
                    }
                    var p = 1.0 - x;
                    var o = st_gammainv([p, 0.5 * df, 2.0]);
                    return CalcConvert.D(o)
                }
                function st_chisq_inv(args)
                {
                    for (var i = 0; i < args.length; i++)
                    {
                        if (CalcConvert.err(args[i]))
                        {
                            return args[i]
                        }
                    }
                    var x;
                    if (isNaN(x = CalcConvert.D(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    var df;
                    if (isNaN(df = CalcConvert.I(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    if (x < 0.0 || x > 1.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (df < 1.0 || df > Math_pow(10.0, 10.0))
                    {
                        return CalcErrorsNumber
                    }
                    var chisqDistFunction = function(fp, fDF)
                        {
                            this.getValue = function(x)
                            {
                                return fp - __getChisqDistCDF(x, fDF)
                            };
                            return {getValue: this.getValue}
                        }(x, df);
                    var option = {bConvError: false};
                    var fVal = __iterateInverse(chisqDistFunction, df * 0.5, df, option);
                    if (option.bConvError)
                    {
                        return CalcErrorsNotAvailable
                    }
                    return fVal
                }
                function st_chitest(args)
                {
                    var sum = 0.0;
                    var df;
                    var convert = CalcConvert,
                        arrayA = CalcConvert.toArr(args[0], 1, true, true, false),
                        arrayE = CalcConvert.toArr(args[1], 1, true, true, false);
                    if (arrayA.isError)
                    {
                        return arrayA[0]
                    }
                    if (arrayE.isError)
                    {
                        return arrayE[0]
                    }
                    var r = arrayA.rowCount;
                    var c = arrayA.colCount;
                    if (r !== arrayE.rowCount || c !== arrayE.colCount)
                    {
                        return CalcErrorsNotAvailable
                    }
                    if (r > 1 && c > 1)
                    {
                        df = (r - 1) * (c - 1)
                    }
                    else if (r > 1 && c === 1)
                    {
                        df = r - 1
                    }
                    else if (r === 1 && c > 1)
                    {
                        df = c - 1
                    }
                    else
                    {
                        return CalcErrorsNotAvailable
                    }
                    for (var i = 0; i < arrayA.length; i++)
                    {
                        var a = arrayA[i],
                            e = arrayE[i];
                        if (a !== CalcConvert.CalcConvertedError && e !== CalcConvert.CalcConvertedError)
                        {
                            if (e === 0)
                            {
                                return CalcErrorsDivideByZero
                            }
                            sum += ((a - e) * (a - e)) / e
                        }
                    }
                    return st_chidist([sum, df])
                }
                function st_correl(args)
                {
                    var sumx = 0.0,
                        sumy = 0.0,
                        sumx2 = 0.0,
                        sumy2 = 0.0,
                        sumprod = 0.0,
                        meanx,
                        meany,
                        stdevx,
                        stdevy;
                    var convert = CalcConvert,
                        arrayX = CalcConvert.toArr(args[0], 1, true, true, false),
                        arrayY = CalcConvert.toArr(args[1], 1, true, true, false);
                    if (arrayX.isError)
                    {
                        return arrayX[0]
                    }
                    if (arrayY.isError)
                    {
                        return arrayY[0]
                    }
                    var n = arrayY.length;
                    if (n !== arrayX.length)
                    {
                        return CalcErrorsNotAvailable
                    }
                    var count = 0,
                        i,
                        x,
                        y;
                    for (i = 0; i < n; i++)
                    {
                        x = arrayX[i];
                        y = arrayY[i];
                        if (x !== CalcConvert.CalcConvertedError && y !== CalcConvert.CalcConvertedError)
                        {
                            sumx += x;
                            sumy += y;
                            sumx2 += x * x;
                            sumy2 += y * y;
                            count++
                        }
                    }
                    if (count <= 1)
                    {
                        return CalcErrorsDivideByZero
                    }
                    meanx = sumx / count;
                    meany = sumy / count;
                    stdevx = Math_sqrt((count * sumx2 - sumx * sumx) / (count * (count - 1)));
                    stdevy = Math_sqrt((count * sumy2 - sumy * sumy) / (count * (count - 1)));
                    if (stdevx === 0.0 || stdevy === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    for (i = 0; i < n; i++)
                    {
                        x = arrayX[i];
                        y = arrayY[i];
                        if (x !== CalcConvert.CalcConvertedError && y !== CalcConvert.CalcConvertedError)
                        {
                            sumprod += (x - meanx) * (y - meany)
                        }
                    }
                    return CalcConvert.toResult(sumprod / CalcConvert.D((count - 1) * stdevx * stdevy))
                }
                function st_expondist(args)
                {
                    for (var i = 0; i < args.length; i++)
                    {
                        if (CalcConvert.err(args[i]))
                        {
                            return args[i]
                        }
                    }
                    var x,
                        lambda;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(lambda = CalcConvert.D(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    var cum;
                    if (isNaN(cum = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (x < 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (lambda <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    var exp = Math_exp(-lambda * x);
                    return CalcConvert.toResult(cum ? 1.0 - exp : lambda * exp)
                }
                function st_fdist(args)
                {
                    var x,
                        df1,
                        df2;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(df1 = CalcConvert.D(args[1])) || isNaN(df2 = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (x < 0.0 || df1 < 1.0 || df1 >= Math_pow(10.0, 10.0) || df2 < 1.0 || df2 >= Math_pow(10.0, 10.0))
                    {
                        return CalcErrorsNumber
                    }
                    var a1 = df1 * x / (df1 * x + df2);
                    var a2 = 0.5 * df1;
                    var a3 = 0.5 * df2;
                    var o = st_betadist([a1, a2, a3]);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    return 1.0 - CalcConvert.D(o)
                }
                function st_f_dist(args)
                {
                    var x,
                        df1,
                        df2,
                        bCum;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(df1 = CalcConvert.D(args[1])) || isNaN(df2 = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (x < 0.0 || df1 < 1.0 || df1 >= Math_pow(10.0, 10.0) || df2 < 1.0 || df2 >= Math_pow(10.0, 10.0))
                    {
                        return CalcErrorsNumber
                    }
                    bCum = CalcConvert.B(args[3]);
                    if (bCum)
                    {
                        return (1.0 - __getFDist(x, df1, df2))
                    }
                    else
                    {
                        return (Math_pow(df1 / df2, df1 / 2) * Math_pow(x, (df1 / 2) - 1) / (Math_pow((1 + (x * df1 / df2)), (df1 + df2) / 2) * __getBeta(df1 / 2, df2 / 2)))
                    }
                }
                function __getFDist(x, df1, df2)
                {
                    var arg = df2 / (df2 + df1 * x);
                    var alpha = df2 / 2.0;
                    var beta = df1 / 2.0;
                    return (__getBetaDist(arg, alpha, beta))
                }
                function st_finv(args)
                {
                    var f,
                        df1,
                        df2;
                    if (isNaN(f = CalcConvert.D(args[0])) || isNaN(df1 = CalcConvert.D(args[1])) || isNaN(df2 = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (f < 0.0 || 1.0 < f || df1 < 1.0 || df1 >= Math_pow(10.0, 10.0) || df2 < 1.0 || df2 >= Math_pow(10.0, 10.0))
                    {
                        return CalcErrorsNumber
                    }
                    var x = 1.0 - f;
                    var o = st_betainv([1.0 - x, df2 / 2.0, df1 / 2.0]);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    return (1.0 / CalcConvert.D(o) - 1.0) * (df2 / df1)
                }
                function st_f_inv(args)
                {
                    var f,
                        df1,
                        df2;
                    if (isNaN(f = CalcConvert.D(args[0])) || isNaN(df1 = CalcConvert.I(args[1])) || isNaN(df2 = CalcConvert.I(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (f < 0.0 || 1.0 < f || df1 < 1.0 || df1 >= Math_pow(10.0, 10.0) || df2 < 1.0 || df2 >= Math_pow(10.0, 10.0))
                    {
                        return CalcErrorsNumber
                    }
                    var x = 1.0 - f;
                    var o = st_betainv([x, df2 / 2.0, df1 / 2.0]);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    return (1.0 / CalcConvert.D(o) - 1.0) * (df2 / df1)
                }
                function st_fisher(args)
                {
                    var x;
                    if (isNaN(x = CalcConvert.D(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    if (x <= -1.0 || 1.0 <= x)
                    {
                        return CalcErrorsNumber
                    }
                    return Math_log((1.0 + x) / (1.0 - x)) / 2.0
                }
                function st_fisherinv(args)
                {
                    var y;
                    if (isNaN(y = CalcConvert.D(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    var pt1 = Math_exp(2.0 * y) - 1.0;
                    var pt2 = Math_exp(2.0 * y) + 1.0;
                    if (!isFinite(pt1) && pt1 > 0 && !isFinite(pt2) && pt2 > 0)
                    {
                        return 1.0
                    }
                    return pt1 / pt2
                }
                function __stat(closure, array)
                {
                    var x,
                        dx,
                        dm;
                    var length = array.length;
                    for (var i = 0; i < length; i++)
                    {
                        x = array[i];
                        if (x !== CalcConvert.CalcConvertedError)
                        {
                            dx = x - closure.M;
                            dm = dx / (closure.N + 1);
                            closure.M += dm;
                            closure.Q += closure.N * dx * dm;
                            closure.N++;
                            closure.sum += x
                        }
                    }
                }
                function st_ftest(args)
                {
                    var array1 = CalcConvert.toArr(args[0], 1, true, true, false);
                    if (array1.isError)
                    {
                        return array1[0]
                    }
                    var array2 = CalcConvert.toArr(args[1], 1, true, true, false);
                    if (array2.isError)
                    {
                        return array2[0]
                    }
                    var cl = {
                            N: 0, M: 0.0, Q: 0.0, afun_flag: false, sum: 0.0
                        };
                    var var1,
                        var2,
                        p,
                        dof1,
                        dof2;
                    __stat(cl, array1);
                    dof1 = cl.N - 1;
                    if (cl.N === 1.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    var1 = cl.Q / (cl.N - 1.0);
                    if (var1 === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    cl.N = 0;
                    cl.M = 0.0;
                    cl.Q = 0.0;
                    cl.afun_flag = false;
                    cl.sum = 0.0;
                    __stat(cl, array2);
                    dof2 = cl.N - 1;
                    if (cl.N === 1.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    var2 = cl.Q / (cl.N - 1.0);
                    if (var2 === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    var o = st_fdist([var1 / var2, dof1, dof2]);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    p = (1.0 - CalcConvert.D(o)) * 2;
                    if (p > 1.0)
                    {
                        p = 2.0 - p
                    }
                    return p
                }
                function __getHypGeomDist(x, n, M, N)
                {
                    var o = Functions._MathHelper.combin(M, x);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    var pt1 = CalcConvert.D(o);
                    o = Functions._MathHelper.combin(N - M, n - x);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    var pt2 = CalcConvert.D(o);
                    o = Functions._MathHelper.combin(N, n);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    var pt3 = CalcConvert.D(o);
                    return CalcConvert.toResult((pt1 * pt2) / pt3)
                }
                function st_hypgeomdist(args)
                {
                    var a1 = CalcConvert.I(args[0]);
                    var a2 = CalcConvert.I(args[1]);
                    var a3 = CalcConvert.I(args[2]);
                    var a4 = CalcConvert.I(args[3]);
                    if (a1 < 0.0 || a1 > Math_min(a2, a3))
                    {
                        return CalcErrorsNumber
                    }
                    if (a1 < Math_max(0.0, a2 - a4 + a3))
                    {
                        return CalcErrorsNumber
                    }
                    if (a2 < 0.0 || a2 > a4)
                    {
                        return CalcErrorsNumber
                    }
                    if (a3 < 0.0 || a3 > a4)
                    {
                        return CalcErrorsNumber
                    }
                    if (a4 < 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    return __getHypGeomDist(a1, a2, a3, a4)
                }
                function st_hypgeom_dist(args)
                {
                    var a1 = CalcConvert.I(args[0]);
                    var a2 = CalcConvert.I(args[1]);
                    var a3 = CalcConvert.I(args[2]);
                    var a4 = CalcConvert.I(args[3]);
                    if (a1 < 0.0 || a1 > Math_min(a2, a3))
                    {
                        return CalcErrorsNumber
                    }
                    if (a1 < Math_max(0.0, a2 - a4 + a3))
                    {
                        return CalcErrorsNumber
                    }
                    if (a2 < 0.0 || a2 > a4)
                    {
                        return CalcErrorsNumber
                    }
                    if (a3 < 0.0 || a3 > a4)
                    {
                        return CalcErrorsNumber
                    }
                    if (a4 < 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    var bCumulative = CalcConvert.B(args[4]);
                    if (bCumulative)
                    {
                        var fVal = 0.0;
                        for (var i = 0; i <= a1; i++)
                        {
                            fVal += __getHypGeomDist(i, a2, a3, a4)
                        }
                        return fVal
                    }
                    else
                    {
                        return __getHypGeomDist(a1, a2, a3, a4)
                    }
                }
                function st_lognormdist(args)
                {
                    var x,
                        mean,
                        stdev;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(mean = CalcConvert.D(args[1])) || isNaN(stdev = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (x <= 0.0 || stdev <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    var list = [];
                    list[0] = (Math_log(x) - mean) / stdev;
                    return st_normsdist(list)
                }
                function st_lognorm_dist(args)
                {
                    var x,
                        mean,
                        stdev,
                        bCumulative;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(mean = CalcConvert.D(args[1])) || isNaN(stdev = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    bCumulative = CalcConvert.B(args[3]);
                    if (x <= 0.0 || stdev <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (bCumulative)
                    {
                        var list = [];
                        list[0] = (Math_log(x) - mean) / stdev;
                        return st_normsdist(list)
                    }
                    else
                    {
                        return __phi((Math_log(x) - mean) / stdev) / stdev / x
                    }
                }
                function __phi(x)
                {
                    return 0.39894228040143268 * Math_exp(-(x * x) / 2.0)
                }
                function __integralPhi(x)
                {
                    x = -x * 0.7071067811865475;
                    var lower = CalcConvert.D(x);
                    if (isNaN(lower))
                    {
                        return CalcErrorsValue
                    }
                    var val = st_normsdist([lower * Math_sqrt(2)]);
                    if (typeof val === typeof Calc.Errors)
                    {
                        return NaN
                    }
                    var ans = parseFloat(val) * 2 - 1;
                    return 0.5 * (1 - ans)
                }
                function st_loginv(args)
                {
                    var prob,
                        mean,
                        stdev;
                    if (isNaN(prob = CalcConvert.D(args[0])) || isNaN(mean = CalcConvert.D(args[1])) || isNaN(stdev = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (stdev <= 0.0 || prob < 0.0 || prob > 1.0)
                    {
                        return CalcErrorsNumber
                    }
                    var list = [];
                    list[0] = prob;
                    var o = st_normsinv(list);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    var p = CalcConvert.D(o);
                    return CalcConvert.toResult(Math_exp(mean + stdev * p))
                }
                function st_pearson(args)
                {
                    var sumx = 0.0,
                        sumy = 0.0,
                        sumx2 = 0.0,
                        sumy2 = 0.0,
                        sumxy = 0.0;
                    var convert = CalcConvert,
                        array1 = CalcConvert.toArr(args[0], 1, true, false, false),
                        array2 = CalcConvert.toArr(args[1], 1, true, false, false);
                    var n = array1.length;
                    if (n !== array2.length)
                    {
                        return CalcErrorsNotAvailable
                    }
                    var count = 0;
                    for (var i = 0; i < n; i++)
                    {
                        var x = array1[i];
                        var y = array2[i];
                        if (typeof x === const_number && typeof y === const_number)
                        {
                            sumx += x;
                            sumy += y;
                            sumx2 += x * x;
                            sumy2 += y * y;
                            sumxy += x * y;
                            count++
                        }
                    }
                    if ((count * sumx2 - sumx * sumx) === 0 || (count * sumy2 - sumy * sumy) === 0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return (count * sumxy - sumx * sumy) / Math_sqrt((count * sumx2 - sumx * sumx) * (count * sumy2 - sumy * sumy))
                }
                function st_rsq(args)
                {
                    var arrayY = CalcConvert.toArr(args[0], 1, true, false, false);
                    var arrayX = CalcConvert.toArr(args[1], 1, true, false, false);
                    var sumx = 0.0,
                        sumy = 0.0,
                        sumx2 = 0.0,
                        sumy2 = 0.0,
                        sumxy = 0.0,
                        n = 0;
                    var length = arrayX.length;
                    if (length !== arrayY.length)
                    {
                        return CalcErrorsNotAvailable
                    }
                    for (var i = 0; i < length; i++)
                    {
                        var x = arrayX[i];
                        var y = arrayY[i];
                        if ((typeof x === const_number) && (typeof y === const_number))
                        {
                            sumx += x;
                            sumy += y;
                            sumx2 += x * x;
                            sumy2 += y * y;
                            sumxy += x * y;
                            n++
                        }
                    }
                    var divisor = Math_sqrt((n * sumx2 - sumx * sumx) * (n * sumy2 - sumy * sumy));
                    if (divisor === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    var r = (n * sumxy - sumx * sumy) / divisor;
                    return CalcConvert.toResult(r * r)
                }
                function __fact(x)
                {
                    var result = 1.0;
                    for (var i = x; i > 1; i--)
                    {
                        result *= i
                    }
                    return result
                }
                function st_poisson(args)
                {
                    var x;
                    if (isNaN(x = CalcConvert.I(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    var mean;
                    if (isNaN(mean = CalcConvert.D(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    var cumulative;
                    try
                    {
                        cumulative = CalcConvert.B(args[2])
                    }
                    catch(e)
                    {
                        return CalcErrorsValue
                    }
                    var result = 0.0;
                    if (x <= 0 || mean <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    if (cumulative)
                    {
                        for (var i = 0; i <= x; i++)
                        {
                            result += (Math_exp(-mean) * Math_pow(mean, i)) / __fact(i)
                        }
                    }
                    else
                    {
                        result = (Math_exp(-mean) * Math_pow(mean, x)) / __fact(x)
                    }
                    return CalcConvert.toResult(result)
                }
                function st_prob(args)
                {
                    var lower;
                    if (isNaN(lower = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    var upper = lower;
                    if (Calc._Helper._argumentExists(args, 3))
                    {
                        if (isNaN(upper = CalcConvert.D(args[3])))
                        {
                            return CalcErrorsValue
                        }
                    }
                    var sum = 0.0;
                    var total_sum = 0.0;
                    var array1 = CalcConvert.toArr(args[0], 1, true, true, true);
                    if (array1.isError)
                    {
                        return array1[0]
                    }
                    else if (array1.isConvertError)
                    {
                        return CalcErrorsValue
                    }
                    var array2 = CalcConvert.toArr(args[1], 1, true, true, false);
                    if (array2.isError)
                    {
                        return array2[0]
                    }
                    var n = array1.length;
                    if (n !== array2.length)
                    {
                        return CalcErrorsNotAvailable
                    }
                    for (var i = 0; i < n; i++)
                    {
                        var x = array1[i],
                            prob = array2[i];
                        if (x !== CalcConvert.CalcConvertedError && prob !== CalcConvert.CalcConvertedError)
                        {
                            if (prob <= 0.0 || 1.0 < prob)
                            {
                                return CalcErrorsNumber
                            }
                            if (lower <= x && x <= upper)
                            {
                                sum += prob
                            }
                            total_sum += prob
                        }
                    }
                    if (total_sum !== 1.0)
                    {
                        return CalcErrorsNumber
                    }
                    return sum
                }
                function st_skew(args)
                {
                    if (typeof(args[0]) === const_undefined || args[0] === keyword_null)
                    {
                        throw Sheets.SR.Exp_InvalidArgument;
                    }
                    var sumx = 0.0,
                        sumx2 = 0.0,
                        sumskew = 0.0,
                        meanx,
                        stdev,
                        n = 0;
                    var i,
                        j,
                        x;
                    var convert = CalcConvert,
                        argArrays = [],
                        array;
                    for (i = 0; i < args.length; i++)
                    {
                        array = CalcConvert.toArr(args[i], 1, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        argArrays.push(array);
                        for (j = 0; j < array.length; j++)
                        {
                            x = array[j];
                            if (x !== CalcConvert.CalcConvertedError)
                            {
                                sumx += x;
                                sumx2 += x * x;
                                n++
                            }
                        }
                    }
                    if (n <= 2)
                    {
                        return CalcErrorsDivideByZero
                    }
                    meanx = sumx / n;
                    stdev = Math_sqrt((n * sumx2 - sumx * sumx) / (n * (n - 1)));
                    if (stdev === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    for (i = 0; i < argArrays.length; i++)
                    {
                        array = argArrays[i];
                        for (j = 0; j < array.length; j++)
                        {
                            x = array[j];
                            if (x !== CalcConvert.CalcConvertedError)
                            {
                                sumskew += Math_pow((x - meanx) / stdev, 3.0)
                            }
                        }
                    }
                    return CalcConvert.toResult((n * sumskew) / ((n - 1) * (n - 2)))
                }
                function st_standardize(args)
                {
                    var x,
                        mean,
                        stdev;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(mean = CalcConvert.D(args[1])) || isNaN(stdev = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (stdev <= 0.0)
                    {
                        return CalcErrorsNumber
                    }
                    return (x - mean) / stdev
                }
                function st_tdistrt(args)
                {
                    return st_tdist([args[0], args[1], 1])
                }
                function st_tdist2t(args)
                {
                    return st_tdist([args[0], args[1], 2])
                }
                function st_tdist(args)
                {
                    var x;
                    if (isNaN(x = CalcConvert.D(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    var df,
                        tails;
                    if (isNaN(df = CalcConvert.I(args[1])) || isNaN(tails = CalcConvert.I(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    if (df < 1 || tails !== 1 && tails !== 2 || x < 0)
                    {
                        return CalcErrorsNumber
                    }
                    var f = df;
                    var a = x / Math_sqrt(f);
                    var b = f / (f + (x * x));
                    var im2 = f - 2.0;
                    var ioe = f % 2.0;
                    var s = 1.0,
                        c = 1.0;
                    f = 1.0;
                    var ks = 2.0 + ioe;
                    var fk = ks;
                    if (im2 >= 2.0)
                    {
                        for (var i = CalcConvert.I(ks); i <= im2; i = i + 2)
                        {
                            c = c * b * (fk - 1.0) / fk;
                            s += c;
                            if (s === f)
                            {
                                break
                            }
                            f = s;
                            fk += 2
                        }
                    }
                    if (ioe !== 1.0)
                    {
                        return tails * (1.0 - (0.5 + 0.5 * a * Math_sqrt(b) * s))
                    }
                    if (df === 1.0)
                    {
                        s = 0.0
                    }
                    return tails * (1.0 - (0.5 + (a * b * s + Math_atan(a)) * 0.3183098862))
                }
                function st_t_dist(args)
                {
                    var x,
                        df,
                        bCumulative;
                    if (isNaN(x = CalcConvert.D(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    if (isNaN(df = CalcConvert.I(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    bCumulative = CalcConvert.B(args[2]);
                    if (df < 1 || x < 0)
                    {
                        return CalcErrorsNumber
                    }
                    return __getTDist(x, df, (bCumulative ? 4 : 3))
                }
                function __getTDist(t, fDF, nType)
                {
                    switch (nType)
                    {
                        case 1:
                            return 0.5 * __getBetaDist(fDF / (fDF + t * t), fDF / 2.0, 0.5);
                        case 2:
                            return __getBetaDist(fDF / (fDF + t * t), fDF / 2.0, 0.5);
                        case 3:
                            return Math_pow(1 + (t * t / fDF), -(fDF + 1) / 2) / (Math_sqrt(fDF) * __getBeta(0.5, fDF / 2.0));
                        case 4:
                            var x = fDF / (t * t + fDF);
                            var r = 0.5 * __getBetaDist(x, 0.5 * fDF, 0.5);
                            return (t < 0 ? r : 1 - r)
                    }
                    return CalcErrorsValue
                }
                function st_tinv(args)
                {
                    var val;
                    if (isNaN(val = CalcConvert.D(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    var ndf;
                    if (isNaN(ndf = CalcConvert.I(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    if (val < 0.0 || 1.0 < val || ndf < 1 || ndf > Math_pow(10, 10))
                    {
                        return CalcErrorsNumber
                    }
                    var eps = 1.0e-12;
                    var a,
                        b,
                        c,
                        d,
                        prob,
                        P,
                        q,
                        x,
                        y,
                        neg;
                    var p1 = val / 2;
                    var p2 = p1;
                    if (ndf > 1.0e20)
                    {
                        var list = [];
                        list[0] = p1;
                        return st_normsinv(list)
                    }
                    if (p2 < 0.5)
                    {
                        neg = 0;
                        P = 2.0 * p2
                    }
                    else
                    {
                        neg = 1;
                        P = 2.0 * (1.0 - p2)
                    }
                    if (Math_abs(ndf - 2.0) < eps)
                    {
                        if (P > 0.0)
                        {
                            q = Math_sqrt(2.0 / (P * (2.0 - P)) - 2.0)
                        }
                        else
                        {
                            q = 1.79769e+308
                        }
                    }
                    else if (CalcConvert.D(ndf) < 1.0 + eps)
                    {
                        if (P > 0.0)
                        {
                            prob = (P + 1.0) * 1.57079632679489661923;
                            q = -Math_tan(prob)
                        }
                        else
                        {
                            q = 1.79769e+308
                        }
                    }
                    else
                    {
                        a = 1.0 / (ndf - 0.5);
                        b = 48.0 / (a * a);
                        c = ((20700.0 * a / b - 98.0) * a - 16.0) * a + 96.36;
                        d = ((94.5 / (b + c) - 3.0) / b + 1.0) * Math_sqrt(a * 1.57079632679489661923) * ndf;
                        y = Math_pow(d * P, 2.0 / ndf);
                        if (y > 0.05 + a)
                        {
                            var list1 = [];
                            list1[0] = 0.5 * P;
                            var o = st_normsinv(list1);
                            if (CalcConvert.err(o))
                            {
                                return o
                            }
                            x = CalcConvert.D(o);
                            y = x * x;
                            if (ndf < 5.0)
                            {
                                c = c + 0.3 * (ndf - 4.5) * (x + 0.6)
                            }
                            c = (((0.05 * d * x - 5.0) * x - 7.0) * x - 2.0) * x + b + c;
                            y = (((((0.4 * y + 6.3) * y + 36) * y + 94.5) / c - y - 3.0) / b + 1.0) * x;
                            y = a * y * y;
                            if (y > 0.002)
                            {
                                y = Math_exp(y) - 1.0
                            }
                            else
                            {
                                y = 0.5 * y * y + y
                            }
                        }
                        else
                        {
                            y = ((1.0 / (((ndf + 6.0) / (ndf * y) - 0.089 * d - 0.822) * (ndf + 2.0) * 3.0) + 0.5 / (ndf + 4.0)) * y - 1.0) * (ndf + 1.0) / (ndf + 2.0) + 1.0 / y
                        }
                        q = Math_sqrt(ndf * y)
                    }
                    if (neg !== 0.0)
                    {
                        q = -q
                    }
                    return CalcConvert.toResult(q)
                }
                function st_t_inv(args)
                {
                    var val;
                    if (isNaN(val = CalcConvert.D(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    var ndf;
                    if (isNaN(ndf = CalcConvert.I(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    if (val <= 0.0 || 1.0 < val || ndf < 1 || ndf > Math_pow(10, 10))
                    {
                        return CalcErrorsNumber
                    }
                    if (val < 0.5)
                    {
                        return -(__getTInv(1 - val, ndf, 4))
                    }
                    else
                    {
                        return __getTInv(val, ndf, 4)
                    }
                }
                function __getTInv(fAlpha, fSize, nType)
                {
                    var opt = {bConvError: false};
                    var aFunc = function(fp, fDF, nType)
                        {
                            this.getValue = function(x)
                            {
                                return fp - __getTDist(x, fDF, nType)
                            };
                            return {getValue: this.getValue}
                        }(fAlpha, fSize, nType);
                    var fVal = __iterateInverse(aFunc, fSize * 0.5, fSize, opt);
                    if (opt.bConvError)
                    {
                        return CalcErrorsNotAvailable
                    }
                    return fVal
                }
                function __iterateInverse(rFunction, fAx, fBx, option)
                {
                    var fYEps = 1.0E-307;
                    var fXEps = __d1mach(3);
                    var fAy = rFunction.getValue(fAx);
                    var fBy = rFunction.getValue(fBx);
                    var fTemp;
                    var nCount;
                    for (nCount = 0; nCount < 1000 && !__hasChangeOfSign(fAy, fBy); nCount++)
                    {
                        if (Math_abs(fAy) <= Math_abs(fBy))
                        {
                            fTemp = fAx;
                            fAx += 2.0 * (fAx - fBx);
                            if (fAx < 0.0)
                                fAx = 0.0;
                            fBx = fTemp;
                            fBy = fAy;
                            fAy = rFunction.getValue(fAx)
                        }
                        else
                        {
                            fTemp = fBx;
                            fBx += 2.0 * (fBx - fAx);
                            fAx = fTemp;
                            fAy = fBy;
                            fBy = rFunction.getValue(fBx)
                        }
                    }
                    if (fAy == 0.0)
                        return fAx;
                    if (fBy == 0.0)
                        return fBx;
                    if (!__hasChangeOfSign(fAy, fBy))
                    {
                        option.bConvError = true;
                        return 0.0
                    }
                    var fPx = fAx;
                    var fPy = fAy;
                    var fQx = fBx;
                    var fQy = fBy;
                    var fRx = fAx;
                    var fRy = fAy;
                    var fSx = 0.5 * (fAx + fBx);
                    var bHasToInterpolate = true;
                    nCount = 0;
                    while (nCount < 500 && Math_abs(fRy) > fYEps && (fBx - fAx) > Math_max(Math_abs(fAx), Math_abs(fBx)) * fXEps)
                    {
                        if (bHasToInterpolate)
                        {
                            if (fPy != fQy && fQy != fRy && fRy != fPy)
                            {
                                fSx = fPx * fRy * fQy / (fRy - fPy) / (fQy - fPy) + fRx * fQy * fPy / (fQy - fRy) / (fPy - fRy) + fQx * fPy * fRy / (fPy - fQy) / (fRy - fQy);
                                bHasToInterpolate = (fAx < fSx) && (fSx < fBx)
                            }
                            else
                            {
                                bHasToInterpolate = false
                            }
                        }
                        if (!bHasToInterpolate)
                        {
                            fSx = 0.5 * (fAx + fBx);
                            fPx = fAx;
                            fPy = fAy;
                            fQx = fBx;
                            fQy = fBy;
                            bHasToInterpolate = true
                        }
                        fPx = fQx;
                        fQx = fRx;
                        fRx = fSx;
                        fPy = fQy;
                        fQy = fRy;
                        fRy = rFunction.getValue(fSx);
                        if (__hasChangeOfSign(fAy, fRy))
                        {
                            fBx = fRx;
                            fBy = fRy
                        }
                        else
                        {
                            fAx = fRx;
                            fAy = fRy
                        }
                        bHasToInterpolate = bHasToInterpolate && (Math_abs(fRy) * 2.0 <= Math_abs(fQy));
                        ++nCount
                    }
                    return fRx
                }
                function __hasChangeOfSign(u, w)
                {
                    return (u < 0.0 && w > 0.0) || (u > 0.0 && w < 0.0)
                }
                function __stat1(closure, array)
                {
                    var x,
                        dx,
                        dm;
                    var length = array.length;
                    for (var i = 0; i < length; i++)
                    {
                        x = CalcConvert.D(array[i]);
                        dx = x - closure.M;
                        dm = dx / (closure.N + 1);
                        closure.M += dm;
                        closure.Q += closure.N * dx * dm;
                        closure.N++;
                        closure.sum += x
                    }
                }
                function __gammaln(value)
                {
                    var coefficient = [76.180091729471457, -86.505320329416776, 24.014098240830911, -1.231739572450155, 1.208650973866179e-03, -5.395239384953E-06];
                    var y = value;
                    var d = value + 5.5;
                    d -= (value + 0.5) * Math_log(d);
                    var ser = 1.0000000001900149;
                    for (var i = 0; i <= 5; i++)
                    {
                        ser += coefficient[i] / ++y
                    }
                    return (-d + Math_log((2.5066282746310006 * ser) / value))
                }
                function __betaregularized(a, b, x)
                {
                    var bt = ((x === 0.0) || (x === 1.0)) ? 0.0 : Math_exp(__gammaln(a + b) - __gammaln(a) - __gammaln(b) + a * Math_log(x) + b * Math_log(1.0 - x));
                    var swap = x >= ((a + 1.0) / ((a + b) + 2.0));
                    if (swap)
                    {
                        var temp = a;
                        a = b;
                        b = temp;
                        x = 1.0 - x
                    }
                    var FP_MIN = 4.4501477170144028E-308;
                    var MAX_ITERATIONS = 100;
                    var qab = a + b;
                    var qaq = a + 1.0;
                    var qam = a - 1.0;
                    var c = 1.0;
                    var d = 1.0 - ((qab * x) / qaq);
                    if (Math_abs(d) < FP_MIN)
                    {
                        d = FP_MIN
                    }
                    d = 1.0 / d;
                    var h = d;
                    for (var i = 1, i2 = 2; i <= MAX_ITERATIONS; i++, i2 += 2)
                    {
                        var aa = (i * (b - i) * x) / ((qam + i2) * (a + i2));
                        d = 1.0 + (aa * d);
                        if (Math_abs(d) < FP_MIN)
                        {
                            d = FP_MIN
                        }
                        c = 1.0 + (aa / c);
                        if (Math_abs(c) < FP_MIN)
                        {
                            c = FP_MIN
                        }
                        d = 1.0 / d;
                        h *= d * c;
                        aa = ((-(a + i) * (qab + i)) * x) / ((a + i2) * (qaq + i2));
                        d = 1.0 + (aa * d);
                        if (Math_abs(d) < FP_MIN)
                        {
                            d = FP_MIN
                        }
                        c = 1.0 + (aa / c);
                        if (Math_abs(c) < FP_MIN)
                        {
                            c = FP_MIN
                        }
                        d = 1.0 / d;
                        var del = d * c;
                        h *= del;
                        if (Math_abs(CalcConvert.D(del - 1.0)) < 4.94066e-324)
                        {
                            var result = bt * h / a;
                            return swap ? 1.0 - result : result
                        }
                    }
                    return CalcErrorsNumber
                }
                function st_ttest(args)
                {
                    var array1 = CalcConvert.toArr(args[0], 1, true, true, true);
                    if (array1.isError)
                    {
                        return array1[0]
                    }
                    var array2 = CalcConvert.toArr(args[1], 1, true, true, true);
                    if (array2.isError)
                    {
                        return array2[0]
                    }
                    if (array1.isConvertError || array2.isConvertError)
                    {
                        return CalcErrorsValue
                    }
                    var args2 = args[2];
                    var args3 = args[3];
                    if (!CalcConvert.num(args2) || !CalcConvert.num(args3))
                    {
                        return CalcErrorsValue
                    }
                    var tails = CalcConvert.I(args2);
                    var type = CalcConvert.I(args3);
                    var mean1,
                        mean2,
                        x;
                    var s,
                        var1,
                        var2,
                        dof;
                    var cl = {
                            N: 0, M: 0, Q: 0, sum: 0, afun_flag: false
                        };
                    var n1,
                        n2;
                    if ((tails !== 1 && tails !== 2) || (type < 1 || 3 < type))
                    {
                        return CalcErrorsNumber
                    }
                    if (type === 1)
                    {
                        var sum,
                            dx,
                            dm,
                            M,
                            Q,
                            N;
                        if (array1.length !== array2.length)
                        {
                            return CalcErrorsNotAvailable
                        }
                        var length1 = array1.length;
                        for (var i = 0; i < length1; i++)
                        {
                            array1[i] = array1[i] - array2[i]
                        }
                        dx = dm = M = Q = N = sum = 0;
                        for (var i = 0; i < length1; i++)
                        {
                            var array1i = array1[i];
                            dx = array1i - M;
                            dm = dx / (N + 1.0);
                            M += dm;
                            Q += N * dx * dm;
                            N++;
                            sum += array1i
                        }
                        if (N - 1.0 === 0 || N === 0.0)
                        {
                            return CalcErrorsDivideByZero
                        }
                        s = Math_sqrt(Q / (N - 1.0));
                        if (isNaN(s) || !isFinite(s))
                        {
                            return CalcErrorsNumber
                        }
                        mean1 = sum / N;
                        x = mean1 / (s / Math_sqrt(N));
                        dof = N - 1.0
                    }
                    else
                    {
                        cl.N = 0;
                        cl.M = 0.0;
                        cl.Q = 0.0;
                        cl.afun_flag = false;
                        cl.sum = 0.0;
                        __stat1(cl, array1);
                        var1 = cl.Q / (cl.N - 1.0);
                        mean1 = cl.sum / cl.N;
                        n1 = cl.N;
                        cl.N = 0;
                        cl.M = 0.0;
                        cl.Q = 0.0;
                        cl.afun_flag = false;
                        cl.sum = 0.0;
                        __stat1(cl, array2);
                        var2 = cl.Q / (cl.N - 1.0);
                        mean2 = cl.sum / cl.N;
                        n2 = cl.N;
                        if (type !== 2)
                        {
                            var c = (var1 / n1) / (var1 / n1 + var2 / n2);
                            dof = 1.0 / ((c * c) / CalcConvert.D(n1 - 1) + ((1.0 - c) * (1.0 - c)) / CalcConvert.D(n2 - 1))
                        }
                        else
                        {
                            dof = CalcConvert.D(n1 + n2 - 2)
                        }
                        x = (mean1 - mean2) / Math_sqrt(var1 / CalcConvert.D(n1) + var2 / CalcConvert.D(n2))
                    }
                    x = Math_abs(x);
                    var value = __betaregularized(0.5 * dof, 0.5, dof / (dof + x * x));
                    if (CalcConvert.err(value))
                    {
                        return value
                    }
                    return 0.5 * tails * CalcConvert.D(value)
                }
                function st_ztest(args)
                {
                    var val;
                    var array = CalcConvert.toArr(args[0], 1, true, true, false);
                    if (array.isError)
                    {
                        return array[0]
                    }
                    if (isNaN(val = CalcConvert.D(args[1])))
                    {
                        return CalcErrorsValue
                    }
                    var sigma = 0.0;
                    if (Calc._Helper._argumentExists(args, 2))
                    {
                        if (isNaN(sigma = CalcConvert.D(args[2])))
                        {
                            return CalcErrorsValue
                        }
                    }
                    var sumx = 0.0,
                        sumx2 = 0.0,
                        meanx,
                        stdev,
                        n = 0,
                        x;
                    for (var i = 0; i < array.length; i++)
                    {
                        var obj = array[i];
                        if (obj !== CalcConvert.CalcConvertedError)
                        {
                            x = CalcConvert.D(obj);
                            sumx += x;
                            sumx2 += x * x;
                            n++
                        }
                    }
                    if (n === 0)
                    {
                        return CalcErrorsNotAvailable
                    }
                    if (n === 1)
                    {
                        return CalcErrorsDivideByZero
                    }
                    meanx = sumx / n;
                    stdev = Calc._Helper._argumentExists(args, 2) ? sigma : Math_sqrt((n * sumx2 - sumx * sumx) / (n * (n - 1)));
                    if (stdev === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    var subArgs = [];
                    subArgs[0] = (meanx - val) / (stdev / Math_sqrt(n));
                    var o = st_normsdist(subArgs);
                    if (CalcConvert.err(o))
                    {
                        return o
                    }
                    return CalcConvert.toResult(1.0 - CalcConvert.D(o))
                }
                function st_weibull(args)
                {
                    var x,
                        alpha,
                        beta;
                    if (isNaN(x = CalcConvert.D(args[0])) || isNaN(alpha = CalcConvert.D(args[1])) || isNaN(beta = CalcConvert.D(args[2])))
                    {
                        return CalcErrorsValue
                    }
                    var cum;
                    try
                    {
                        cum = CalcConvert.B(args[3])
                    }
                    catch(e)
                    {
                        return CalcErrorsValue
                    }
                    if (x < 0.0 || alpha <= 0 || beta <= 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (cum)
                    {
                        return CalcConvert.toResult(1.0 - Math_exp(-Math_pow((x / beta), alpha)))
                    }
                    else
                    {
                        return CalcConvert.toResult((alpha / Math_pow(beta, alpha)) * Math_pow(x, alpha - 1.0) * Math_exp(-Math_pow((x / beta), alpha)))
                    }
                }
                function st_permut(args)
                {
                    var n = CalcConvert.D(CalcConvert.I(args[0]));
                    var k = CalcConvert.D(CalcConvert.I(args[1]));
                    var result = 1.0;
                    if (n < 0.0 || k < 0.0 || n < k)
                    {
                        return CalcErrorsNumber
                    }
                    for (var i = n - k + 1.0; i <= n; i++)
                    {
                        result *= i
                    }
                    return CalcConvert.toResult(result)
                }
                function st_intercept(args)
                {
                    var y,
                        x,
                        sumy = 0.0,
                        sumx = 0.0,
                        sumx2 = 0.0,
                        sumxy = 0.0,
                        b;
                    var array1 = CalcConvert.toArr(args[0], 1, true, true, false);
                    var array2 = CalcConvert.toArr(args[1], 1, true, true, false);
                    var n = array1.length;
                    if (n !== array2.length)
                    {
                        return CalcErrorsNotAvailable
                    }
                    if (array1.isError)
                    {
                        return array1[0]
                    }
                    if (array2.isError)
                    {
                        return array2[0]
                    }
                    var count = 0;
                    for (var i = 0; i < n; i++)
                    {
                        var y = array1[i];
                        var x = array2[i];
                        if (x !== CalcConvert.CalcConvertedError && y !== CalcConvert.CalcConvertedError)
                        {
                            sumy += y;
                            sumx += x;
                            sumx2 += x * x;
                            sumxy += x * y;
                            count++
                        }
                    }
                    if (count === 0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    if (count * sumx2 - sumx * sumx === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    b = (count * sumxy - sumx * sumy) / (count * sumx2 - sumx * sumx);
                    return CalcConvert.toResult((sumy / count) - b * (sumx / count))
                }
                function st_linest(args)
                {
                    var convert = CalcConvert,
                        helper = Calc._Helper;
                    var knownY = CalcConvert.toArr(args[0], 1, false, true, true);
                    var knownX = [];
                    if (helper._argumentExists(args, 1))
                    {
                        knownX = CalcConvert.toArr(args[1], 1, false, true, true)
                    }
                    else
                    {
                        knownX = knownY
                    }
                    var constant = helper._argumentExists(args, 2) ? CalcConvert.B(args[2]) : true;
                    var stats = helper._argumentExists(args, 3) ? CalcConvert.B(args[3]) : false;
                    var d,
                        i,
                        j,
                        k,
                        m,
                        n,
                        x,
                        y,
                        mm,
                        nn,
                        result,
                        found,
                        temp,
                        val,
                        se2;
                    if (knownY.rowCount === knownX.rowCount && knownY.colCount === knownX.colCount && (constant || !stats))
                    {
                        n = CalcConvert.D(knownX.rowCount * knownX.colCount);
                        var sumx = 0.0,
                            sumx2 = 0.0,
                            sumy = 0.0,
                            sumy2 = 0.0,
                            sumxy = 0.0,
                            b;
                        for (i = 0; i < knownX.rowCount; i++)
                        {
                            for (j = 0; j < knownX.colCount; j++)
                            {
                                x = knownX[i][j];
                                y = knownY[i][j];
                                sumx += x;
                                sumx2 += x * x;
                                sumy += y;
                                sumy2 += y * y;
                                sumxy += x * y
                            }
                        }
                        if (constant)
                        {
                            m = (n * sumxy - sumx * sumy) / (n * sumx2 - sumx * sumx);
                            b = (sumy * sumx2 - sumx * sumxy) / (n * sumx2 - sumx * sumx)
                        }
                        else
                        {
                            m = sumxy / sumx2;
                            b = 0.0
                        }
                        result = [];
                        result[0] = [];
                        result[0][0] = m;
                        result[0][1] = b;
                        if (stats)
                        {
                            result[1] = [];
                            result[2] = [];
                            result[3] = [];
                            result[4] = [];
                            var nSumx2MinusSumxSumx = n * sumx2 - sumx * sumx;
                            var nSumy2MinusSumySumy = n * sumy2 - sumy * sumy;
                            var nSumxyMinusSumxSumy = n * sumxy - sumx * sumy;
                            var ssresid = sumy2 - b * sumy - m * sumxy;
                            var r2 = (nSumxyMinusSumxSumy * nSumxyMinusSumxSumy) / (nSumx2MinusSumxSumx * nSumy2MinusSumySumy);
                            if (n < 3)
                            {
                                result[1][0] = CalcErrorsNumber;
                                result[1][1] = CalcErrorsNumber;
                                result[2][1] = CalcErrorsNumber;
                                result[3][0] = CalcErrorsNumber
                            }
                            else
                            {
                                result[1][0] = Math_sqrt((ssresid * n) / (nSumx2MinusSumxSumx * (n - 2.0)));
                                result[1][1] = Math_sqrt((ssresid * sumx2) / (nSumx2MinusSumxSumx * (n - 2.0)));
                                result[2][1] = Math_sqrt((nSumy2MinusSumySumy - nSumxyMinusSumxSumy * nSumxyMinusSumxSumy / nSumx2MinusSumxSumx) / (n * (n - 2.0)));
                                if (r2 === 1.0)
                                {
                                    result[3][0] = CalcErrorsNumber
                                }
                                else
                                {
                                    result[3][0] = (r2 * (n - 2.0)) / (1.0 - r2)
                                }
                            }
                            result[2][0] = r2;
                            result[3][1] = n - 2.0;
                            result[4][0] = nSumy2MinusSumySumy / n - ssresid;
                            result[4][1] = ssresid
                        }
                        return new Calc._ConcreteArray(result)
                    }
                    else if ((knownY.colCount === 1 && knownY.rowCount === knownX.rowCount) || (knownY.rowCount === 1 && knownY.colCount === knownX.colCount))
                    {
                        y = [];
                        x = [];
                        if (knownY.colCount === 1)
                        {
                            n = knownX.rowCount;
                            m = knownX.colCount;
                            for (i = 0; i < n; i++)
                            {
                                y[i] = knownY[i][0]
                            }
                            for (i = 0; i < n; i++)
                            {
                                x[i] = [];
                                for (j = 0; j < m; j++)
                                {
                                    x[i][j] = knownX[i][j]
                                }
                            }
                        }
                        else
                        {
                            n = knownX.colCount;
                            m = knownX.rowCount;
                            x = [];
                            y = [];
                            for (i = 0; i < n; i++)
                            {
                                y[i] = knownY[0][i]
                            }
                            for (i = 0; i < n; i++)
                            {
                                x[i] = [];
                                for (j = 0; j < m; j++)
                                {
                                    x[i][j] = knownX[j][i]
                                }
                            }
                        }
                        var q = [];
                        for (k = 0; k < m + 1; k++)
                        {
                            q[k] = []
                        }
                        for (mm = 0; mm < m + 1; mm++)
                        {
                            for (nn = 0; nn < m + 2; nn++)
                            {
                                q[mm][nn] = 0
                            }
                        }
                        var e = [];
                        for (mm = 0; mm < m + 2; mm++)
                        {
                            e[mm] = 0
                        }
                        var v = (stats ? [] : keyword_null);
                        for (k = 0; k < n; k++)
                        {
                            e[m + 1] = e[m + 1] + y[k] * y[k];
                            q[0][m + 1] = q[0][m + 1] + y[k];
                            e[0] = q[0][m + 1];
                            for (i = 0; i < m; i++)
                            {
                                q[0][i + 1] = q[0][i + 1] + x[k][i];
                                q[i + 1][0] = q[0][i + 1];
                                q[i + 1][m + 1] = q[i + 1][m + 1] + x[k][i] * y[k];
                                e[i + 1] = q[i + 1][m + 1];
                                for (j = i; j < m; j++)
                                {
                                    q[j + 1][i + 1] = q[j + 1][i + 1] + x[k][i] * x[k][j];
                                    q[i + 1][j + 1] = q[j + 1][i + 1]
                                }
                            }
                        }
                        q[0][0] = n;
                        if (stats)
                        {
                            for (mm = 0; mm < m + 1; mm++)
                            {
                                v[mm] = [];
                                for (nn = 0; nn < m + 1; nn++)
                                {
                                    v[mm][nn] = 0
                                }
                            }
                            for (i = 0; i < m + 1; i++)
                            {
                                v[i][i] = 1.0
                            }
                        }
                        if (constant)
                        {
                            for (i = 0; i < m + 1; i++)
                            {
                                if (q[i][i] === 0.0 && i < m)
                                {
                                    found = false;
                                    for (j = i + 1; !found && j < m + 1; j++)
                                    {
                                        if (q[j][i] !== 0.0)
                                        {
                                            for (k = 0; k < m + 2; k++)
                                            {
                                                temp = q[i][k];
                                                q[i][k] = q[j][k];
                                                q[j][k] = temp
                                            }
                                            if (stats)
                                            {
                                                for (k = 0; k < m + 1; k++)
                                                {
                                                    temp = v[i][k];
                                                    v[i][k] = v[j][k];
                                                    v[j][k] = temp
                                                }
                                            }
                                            found = true
                                        }
                                    }
                                    if (!found)
                                    {
                                        return CalcErrorsNumber
                                    }
                                }
                                val = 1.0 / q[i][i];
                                for (k = 0; k < m + 2; k++)
                                {
                                    q[i][k] = q[i][k] * val
                                }
                                if (stats)
                                {
                                    for (k = 0; k < m + 1; k++)
                                    {
                                        v[i][k] = v[i][k] * val
                                    }
                                }
                                for (j = 0; j < m + 1; j++)
                                {
                                    if (j !== i)
                                    {
                                        val = -q[j][i];
                                        for (k = 0; k < m + 2; k++)
                                        {
                                            q[j][k] = q[j][k] + val * q[i][k]
                                        }
                                        if (stats)
                                        {
                                            for (k = 0; k < m + 1; k++)
                                            {
                                                v[j][k] = v[j][k] + val * v[i][k]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            for (i = 1; i < m + 1; i++)
                            {
                                if (q[i][i] === 0.0)
                                {
                                    found = false;
                                    for (j = i + 1; !found && j < m + 1; j++)
                                    {
                                        if (q[j][i] !== 0.0)
                                        {
                                            for (k = 0; k < m + 2; k++)
                                            {
                                                temp = q[i][k];
                                                q[i][k] = q[j][k];
                                                q[j][k] = temp
                                            }
                                            if (stats)
                                            {
                                                for (k = 0; k < m + 1; k++)
                                                {
                                                    temp = v[i][k];
                                                    v[i][k] = v[j][k];
                                                    v[j][k] = temp
                                                }
                                            }
                                            found = true
                                        }
                                    }
                                    if (!found)
                                    {
                                        return CalcErrorsNumber
                                    }
                                }
                                val = 1.0 / q[i][i];
                                for (k = 1; k < m + 2; k++)
                                {
                                    q[i][k] = q[i][k] * val
                                }
                                if (stats)
                                {
                                    for (k = 1; k < m + 1; k++)
                                    {
                                        v[i][k] = v[i][k] * val
                                    }
                                }
                                for (j = 1; j < m + 1; j++)
                                {
                                    if (j !== i)
                                    {
                                        val = -q[j][i];
                                        for (k = 1; k < m + 2; k++)
                                        {
                                            q[j][k] = q[j][k] + val * q[i][k]
                                        }
                                        if (stats)
                                        {
                                            for (k = 1; k < m + 1; k++)
                                            {
                                                v[j][k] = v[j][k] + val * v[i][k]
                                            }
                                        }
                                    }
                                }
                                q[0][m + 1] = 0.0
                            }
                        }
                        result = [(stats ? 5 : 1), m + 1];
                        result[0] = [];
                        for (i = 0; i < m + 1; i++)
                        {
                            result[0][i] = q[m - i][m + 1]
                        }
                        if (stats)
                        {
                            for (mm = 1; mm < 5; mm++)
                            {
                                result[mm] = [];
                                for (nn = 0; nn < m + 1; nn++)
                                {
                                    result[mm][nn] = 0
                                }
                            }
                            var sqr,
                                sqt,
                                sqe;
                            sqt = e[m + 1] - e[0] * e[0] / n;
                            sqr = e[m + 1];
                            for (i = 0; i < m + 1; i++)
                            {
                                sqr -= q[i][m + 1] * e[i]
                            }
                            sqe = sqt - sqr;
                            if (sqt === 0.0)
                            {
                                result[2][0] = CalcErrorsNumber
                            }
                            else
                            {
                                result[2][0] = sqe / sqt
                            }
                            result[4][0] = sqe;
                            result[4][1] = sqr;
                            if (constant)
                            {
                                if (n - m - 1 === 0)
                                {
                                    result[2][1] = CalcErrorsNumber;
                                    for (i = 0; i < m + 1; i++)
                                    {
                                        result[1][i] = CalcErrorsNumber
                                    }
                                }
                                else
                                {
                                    se2 = sqr / (n - m - 1);
                                    for (i = 0; i < m + 1; i++)
                                    {
                                        result[1][m - i] = Math_sqrt(se2 * v[i][i])
                                    }
                                    result[2][1] = Math_sqrt(se2)
                                }
                                if (sqr === 0.0)
                                {
                                    result[3][0] = CalcErrorsNumber
                                }
                                else
                                {
                                    result[3][0] = (CalcConvert.D(n - m - 1) * sqe) / (sqr * CalcConvert.D(m))
                                }
                                result[3][1] = CalcConvert.D(n - m - 1)
                            }
                            else
                            {
                                if (n - m === 0)
                                {
                                    for (i = 0; i < m + 1; i++)
                                    {
                                        result[1][i] = CalcErrorsNumber
                                    }
                                    result[2][1] = CalcErrorsNumber
                                }
                                else
                                {
                                    se2 = sqr / (CalcConvert.D(n - m));
                                    result[1][m] = CalcErrorsNotAvailable;
                                    for (i = 1; i < m + 1; i++)
                                    {
                                        result[1][m - i] = Math_sqrt(se2 * v[i][i])
                                    }
                                    result[2][1] = Math_sqrt(se2)
                                }
                                if (sqr === 0.0)
                                {
                                    result[3][0] = CalcErrorsNumber
                                }
                                else
                                {
                                    result[3][0] = (CalcConvert.D(n - m) * sqe) / (sqr * CalcConvert.D(m))
                                }
                                result[3][1] = CalcConvert.D(n - m)
                            }
                            for (i = 2; i < 5; i++)
                            {
                                for (j = 2; j < m + 1; j++)
                                {
                                    result[i][j] = CalcErrorsNotAvailable
                                }
                            }
                        }
                        result = [result[0]];
                        return new Calc._ConcreteArray(result)
                    }
                    return CalcErrorsNumber
                }
                function st_slope(args)
                {
                    var arrayY = CalcConvert.toArr(args[0], 1, true, false, false);
                    var arrayX = CalcConvert.toArr(args[1], 1, true, false, false);
                    var sumy = 0.0,
                        sumx = 0.0,
                        sumx2 = 0.0,
                        sumxy = 0.0,
                        n = 0;
                    var length = arrayX.length;
                    if (length !== arrayY.length)
                    {
                        return CalcErrorsNotAvailable
                    }
                    for (var i = 0; i < length; i++)
                    {
                        var valueY = arrayY[i];
                        var valueX = arrayX[i];
                        if (valueX !== CalcConvert.CalcConvertedError && valueY !== CalcConvert.CalcConvertedError && !(CalcConvert.err(valueX)) && !(CalcConvert.err(valueY)))
                        {
                            var y = CalcConvert.D(valueY);
                            var x = CalcConvert.D(valueX);
                            sumy += y;
                            sumx += x;
                            sumx2 += x * x;
                            sumxy += x * y;
                            n++
                        }
                    }
                    if (n * sumx2 - sumx * sumx === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return CalcConvert.toResult((n * sumxy - sumx * sumy) / (n * sumx2 - sumx * sumx))
                }
                function st_logest(args)
                {
                    var convert = CalcConvert,
                        helper = Calc._Helper;
                    var knownY = CalcConvert.toArr(args[0], 1, false, true, true);
                    var knownX = helper._argumentExists(args, 1) ? CalcConvert.toArr(args[1], 1, false, true, true) : knownY;
                    var constant = helper._argumentExists(args, 2) ? CalcConvert.B(args[2]) : true;
                    var stats = helper._argumentExists(args, 3) ? CalcConvert.B(args[3]) : false;
                    var i,
                        j;
                    var d,
                        k,
                        m,
                        n,
                        x,
                        y,
                        mm,
                        nn,
                        result,
                        val,
                        temp,
                        found,
                        se2;
                    if (knownY.rowCount === knownX.rowCount && knownY.colCount === knownX.colCount && (constant || !stats))
                    {
                        n = knownX.rowCount * knownX.colCount;
                        var sumx = 0.0,
                            sumx2 = 0.0,
                            sumy = 0.0,
                            sumy2 = 0.0,
                            sumxy = 0.0,
                            b;
                        for (i = 0; i < knownX.rowCount; i++)
                        {
                            for (j = 0; j < knownX.colCount; j++)
                            {
                                x = knownX[i][j];
                                y = knownY[i][j];
                                y = Math_log(y);
                                sumx += x;
                                sumx2 += x * x;
                                sumy += y;
                                sumy2 += y * y;
                                sumxy += x * y
                            }
                        }
                        if (constant)
                        {
                            m = (n * sumxy - sumx * sumy) / (n * sumx2 - sumx * sumx);
                            b = (sumy * sumx2 - sumx * sumxy) / (n * sumx2 - sumx * sumx)
                        }
                        else
                        {
                            m = sumxy / sumx2;
                            b = 0.0
                        }
                        result = [];
                        result[0] = [];
                        result[0][0] = Math_exp(m);
                        result[0][1] = Math_exp(b);
                        if (stats)
                        {
                            result[1] = [];
                            result[2] = [];
                            result[3] = [];
                            result[4] = [];
                            var nSumx2MinusSumxSumx = n * sumx2 - sumx * sumx;
                            var nSumy2MinusSumySumy = n * sumy2 - sumy * sumy;
                            var nSumxyMinusSumxSumy = n * sumxy - sumx * sumy;
                            var ssresid = sumy2 - b * sumy - m * sumxy;
                            var r2 = (nSumxyMinusSumxSumy * nSumxyMinusSumxSumy) / (nSumx2MinusSumxSumx * nSumy2MinusSumySumy);
                            if (n < 3)
                            {
                                result[1][0] = CalcErrorsNumber;
                                result[1][1] = CalcErrorsNumber;
                                result[2][1] = CalcErrorsNumber;
                                result[3][0] = CalcErrorsNumber
                            }
                            else
                            {
                                result[1][0] = Math_sqrt((ssresid * n) / (nSumx2MinusSumxSumx * (n - 2.0)));
                                result[1][1] = Math_sqrt((ssresid * sumx2) / (nSumx2MinusSumxSumx * (n - 2.0)));
                                result[2][1] = Math_sqrt((nSumy2MinusSumySumy - nSumxyMinusSumxSumy * nSumxyMinusSumxSumy / nSumx2MinusSumxSumx) / (n * (n - 2.0)));
                                if (r2 === 1.0)
                                {
                                    result[3][0] = CalcErrorsNumber
                                }
                                else
                                {
                                    result[3][0] = (r2 * (n - 2.0)) / (1.0 - r2)
                                }
                            }
                            result[2][0] = r2;
                            result[3][1] = n - 2.0;
                            result[4][0] = nSumy2MinusSumySumy / n - ssresid;
                            result[4][1] = ssresid
                        }
                        return new Calc._ConcreteArray(result)
                    }
                    else if ((knownY.colCount === 1 && knownY.rowCount === knownX.rowCount) || (knownY.rowCount === 1 && knownY.colCount === knownX.colCount))
                    {
                        y = [];
                        x = [];
                        if (knownY.colCount === 1)
                        {
                            n = knownX.rowCount;
                            m = knownX.colCount;
                            for (i = 0; i < n; i++)
                            {
                                y[i] = Math_log(knownY[i][0])
                            }
                            for (i = 0; i < n; i++)
                            {
                                x[i] = [];
                                for (j = 0; j < m; j++)
                                {
                                    x[i][j] = knownX[i][j]
                                }
                            }
                        }
                        else
                        {
                            n = knownX.colCount;
                            m = knownX.rowCount;
                            x = [];
                            y = [];
                            for (i = 0; i < n; i++)
                            {
                                y[i] = Math_log(knownY[0][i])
                            }
                            for (i = 0; i < n; i++)
                            {
                                x[i] = [];
                                for (j = 0; j < m; j++)
                                {
                                    x[i][j] = knownX[j][i]
                                }
                            }
                        }
                        var q = [];
                        for (mm = 0; mm < m + 1; mm++)
                        {
                            q[mm] = [];
                            for (nn = 0; nn < m + 2; nn++)
                            {
                                q[mm][nn] = 0
                            }
                        }
                        var e = [];
                        for (mm = 0; mm < m + 2; mm++)
                        {
                            e[mm] = 0
                        }
                        var v = (stats ? [] : keyword_null);
                        for (k = 0; k < n; k++)
                        {
                            e[m + 1] = e[m + 1] + y[k] * y[k];
                            q[0][m + 1] = q[0][m + 1] + y[k];
                            e[0] = q[0][m + 1];
                            for (i = 0; i < m; i++)
                            {
                                q[0][i + 1] = q[0][i + 1] + x[k][i];
                                q[i + 1][0] = q[0][i + 1];
                                q[i + 1][m + 1] = q[i + 1][m + 1] + x[k][i] * y[k];
                                e[i + 1] = q[i + 1][m + 1];
                                for (j = i; j < m; j++)
                                {
                                    q[j + 1][i + 1] = q[j + 1][i + 1] + x[k][i] * x[k][j];
                                    q[i + 1][j + 1] = q[j + 1][i + 1]
                                }
                            }
                        }
                        q[0][0] = n;
                        if (stats)
                        {
                            for (mm = 0; mm < m + 1; mm++)
                            {
                                v[mm] = [];
                                for (nn = 0; nn < m + 1; nn++)
                                {
                                    v[mm][nn] = 0
                                }
                            }
                            for (i = 0; i < m + 1; i++)
                            {
                                v[i][i] = 1.0
                            }
                        }
                        if (constant)
                        {
                            for (i = 0; i < m + 1; i++)
                            {
                                if (q[i][i] === 0.0)
                                {
                                    found = false;
                                    for (j = i + 1; !found && j < m + 1; j++)
                                    {
                                        if (q[j][i] !== 0.0)
                                        {
                                            for (k = 0; k < m + 2; k++)
                                            {
                                                temp = q[i][k];
                                                q[i][k] = q[j][k];
                                                q[j][k] = temp
                                            }
                                            if (stats)
                                            {
                                                for (k = 0; k < m + 1; k++)
                                                {
                                                    temp = v[i][k];
                                                    v[i][k] = v[j][k];
                                                    v[j][k] = temp
                                                }
                                            }
                                            found = true
                                        }
                                    }
                                    if (!found)
                                    {
                                        return CalcErrorsNumber
                                    }
                                }
                                val = 1.0 / q[i][i];
                                for (k = 0; k < m + 2; k++)
                                {
                                    q[i][k] = q[i][k] * val
                                }
                                if (stats)
                                {
                                    for (k = 0; k < m + 1; k++)
                                    {
                                        v[i][k] = v[i][k] * val
                                    }
                                }
                                for (j = 0; j < m + 1; j++)
                                {
                                    if (j !== i)
                                    {
                                        val = -q[j][i];
                                        for (k = 0; k < m + 2; k++)
                                        {
                                            q[j][k] = q[j][k] + val * q[i][k]
                                        }
                                        if (stats)
                                        {
                                            for (k = 0; k < m + 1; k++)
                                            {
                                                v[j][k] = v[j][k] + val * v[i][k]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            for (i = 1; i < m + 1; i++)
                            {
                                if (q[i][i] === 0.0)
                                {
                                    found = false;
                                    for (j = i + 1; !found && j < m + 1; j++)
                                    {
                                        if (q[j][i] !== 0.0)
                                        {
                                            for (k = 0; k < m + 2; k++)
                                            {
                                                temp = q[i][k];
                                                q[i][k] = q[j][k];
                                                q[j][k] = temp
                                            }
                                            if (stats)
                                            {
                                                for (k = 0; k < m + 1; k++)
                                                {
                                                    temp = v[i][k];
                                                    v[i][k] = v[j][k];
                                                    v[j][k] = temp
                                                }
                                            }
                                            found = true
                                        }
                                    }
                                    if (!found)
                                    {
                                        return CalcErrorsNumber
                                    }
                                }
                                val = 1.0 / q[i][i];
                                for (k = 1; k < m + 2; k++)
                                {
                                    q[i][k] = q[i][k] * val
                                }
                                if (stats)
                                {
                                    for (k = 1; k < m + 1; k++)
                                    {
                                        v[i][k] = v[i][k] * val
                                    }
                                }
                                for (j = 1; j < m + 1; j++)
                                {
                                    if (j !== i)
                                    {
                                        val = -q[j][i];
                                        for (k = 1; k < m + 2; k++)
                                        {
                                            q[j][k] = q[j][k] + val * q[i][k]
                                        }
                                        if (stats)
                                        {
                                            for (k = 1; k < m + 1; k++)
                                            {
                                                v[j][k] = v[j][k] + val * v[i][k]
                                            }
                                        }
                                    }
                                }
                                q[0][m + 1] = 0.0
                            }
                        }
                        result = [];
                        result[0] = [];
                        for (i = 0; i < m + 1; i++)
                        {
                            result[0][i] = Math_exp(q[m - i][m + 1])
                        }
                        if (stats)
                        {
                            result[1] = [];
                            result[2] = [];
                            result[3] = [];
                            result[4] = [];
                            var sqr,
                                sqt,
                                sqe;
                            sqt = e[m + 1] - e[0] * e[0] / n;
                            sqr = e[m + 1];
                            for (i = 0; i < m + 1; i++)
                            {
                                sqr -= q[i][m + 1] * e[i]
                            }
                            sqe = sqt - sqr;
                            if (sqt === 0.0)
                            {
                                result[2][0] = CalcErrorsNumber
                            }
                            else
                            {
                                result[2][0] = sqe / sqt
                            }
                            result[4][0] = sqe;
                            result[4][1] = sqr;
                            if (constant)
                            {
                                if (n - m - 1 === 0)
                                {
                                    result[2][1] = CalcErrorsNumber;
                                    for (i = 0; i < m + 1; i++)
                                    {
                                        result[1][i] = CalcErrorsNumber
                                    }
                                }
                                else
                                {
                                    se2 = sqr / (n - m - 1);
                                    for (i = 0; i < m + 1; i++)
                                    {
                                        result[1][m - i] = Math_sqrt(se2 * v[i][i])
                                    }
                                    result[2][1] = Math_sqrt(se2)
                                }
                                if (sqr === 0.0)
                                {
                                    result[3][0] = CalcErrorsNumber
                                }
                                else
                                {
                                    result[3][0] = (CalcConvert.D(n - m - 1) * sqe) / (sqr * CalcConvert.D(m))
                                }
                                result[3][1] = CalcConvert.D(n - m - 1)
                            }
                            else
                            {
                                if (n - m === 0)
                                {
                                    for (i = 0; i < m + 1; i++)
                                    {
                                        result[1][i] = CalcErrorsNumber
                                    }
                                    result[2][1] = CalcErrorsNumber
                                }
                                else
                                {
                                    se2 = sqr / (CalcConvert.D(n - m));
                                    result[1][m] = CalcErrorsNotAvailable;
                                    for (i = 1; i < m + 1; i++)
                                    {
                                        result[1][m - i] = Math_sqrt(se2 * v[i][i])
                                    }
                                    result[2][1] = Math_sqrt(se2)
                                }
                                if (sqr === 0.0)
                                {
                                    result[3][0] = CalcErrorsNumber
                                }
                                else
                                {
                                    result[3][0] = (CalcConvert.D(n - m) * sqe) / (sqr * CalcConvert.D(m))
                                }
                                result[3][1] = CalcConvert.D(n - m)
                            }
                            for (i = 2; i < 5; i++)
                            {
                                for (j = 2; j < m + 1; j++)
                                {
                                    result[i][j] = CalcErrorsNotAvailable
                                }
                            }
                        }
                        return new Calc._ConcreteArray(result)
                    }
                    return CalcErrorsNumber
                }
                function st_steyx(args)
                {
                    var x,
                        y,
                        sumy = 0.0,
                        sumy2 = 0.0,
                        sumx = 0.0,
                        sumx2 = 0.0,
                        sumxy = 0.0,
                        n = 0;
                    var errorObject = CalcConvert.CalcConvertedError;
                    var array1 = CalcConvert.toArr(args[0], 1, true, true, false);
                    var array2 = CalcConvert.toArr(args[1], 1, true, true, false);
                    var length = array1.length;
                    if (length !== array2.length)
                    {
                        return CalcErrorsNotAvailable
                    }
                    for (var i = 0; i < length; i++)
                    {
                        var valueY = array1[i];
                        var valueX = array2[i];
                        if (valueY !== errorObject && valueX !== errorObject)
                        {
                            y = valueY;
                            x = valueX;
                            sumy += y;
                            sumy2 += y * y;
                            sumx += x;
                            sumx2 += x * x;
                            sumxy += x * y;
                            n++
                        }
                    }
                    if (n * (n - 2) === 0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    if (n * sumx2 - sumx * sumx === 0.0)
                    {
                        return CalcErrorsDivideByZero
                    }
                    return Math_sqrt((n * sumy2 - sumy * sumy - (n * sumxy - sumx * sumy) * (n * sumxy - sumx * sumy) / (n * sumx2 - sumx * sumx)) / (n * (n - 2)))
                }
                function st_convariances(args)
                {
                    var x;
                    var y;
                    var sumx = 0.0;
                    var sumy = 0.0;
                    var sumprod = 0.0;
                    var n = 0;
                    var convert = Calc.Convert,
                        errorObject = CalcConvert.CalcConvertedError;
                    var array1 = CalcConvert.toArr(args[0], 1, true, true, false);
                    var array2 = CalcConvert.toArr(args[1], 1, true, true, false);
                    var length = array1.length;
                    if (length !== array2.length)
                    {
                        return CalcErrorsNotAvailable
                    }
                    for (var i = 0; i < length; i++)
                    {
                        x = array1[i];
                        y = array2[i];
                        if (x !== errorObject && y !== errorObject)
                        {
                            sumx += x;
                            sumy += y;
                            n++
                        }
                    }
                    if (n <= 1)
                        return CalcErrorsDivideByZero;
                    var meanx = sumx / n;
                    var meany = sumy / n;
                    for (var i = 0; i < length; i++)
                    {
                        x = array1[i];
                        y = array2[i];
                        if (x !== errorObject && y !== errorObject)
                        {
                            sumprod += (x - meanx) * (y - meany)
                        }
                    }
                    return CalcConvert.toResult(sumprod / (n - 1))
                }
                function st_modemult(args)
                {
                    var modeCount = 0;
                    var i,
                        j;
                    var modes = [];
                    var list = [];
                    for (i = 0; i < args.length; i++)
                    {
                        var array = CalcConvert.toArr(args[i], 1, true, true, false);
                        if (array.isError)
                        {
                            return array[0]
                        }
                        for (j = 0; j < array.length; j++)
                        {
                            list.push(array[j])
                        }
                    }
                    for (i = 0; i < list.length; i++)
                    {
                        var count = 0;
                        for (j = i + 1; j < list.length; j++)
                        {
                            if (list[i] == list[j])
                            {
                                count++
                            }
                        }
                        if (count > modeCount)
                        {
                            modeCount = count;
                            modes = [];
                            modes.push([list[i]])
                        }
                        else if (count == modeCount)
                        {
                            modes.push([list[i]])
                        }
                    }
                    if (modeCount == 0)
                    {
                        return CalcErrorsNotAvailable
                    }
                    return new Calc._ConcreteArray(modes)
                }
                function st_percentileexc(args)
                {
                    var k = CalcConvert.D(args[1]);
                    var list = CalcConvert.toArr(args[0], 1, true, true, false);
                    if (list.isError)
                    {
                        return list[0]
                    }
                    list.sort(function(x, y)
                    {
                        return x - y
                    });
                    if (list.length == 0)
                    {
                        return CalcErrorsNumber
                    }
                    if (k <= 0 || 1 <= k)
                    {
                        return CalcErrorsNumber
                    }
                    var index = k * (list.length + 1) - 1;
                    var rem = index % 1.0;
                    if (index < 0.0 || (list.length - 1) < index)
                    {
                        return CalcErrorsNumber
                    }
                    var tempIndex = Math_floor(index);
                    if (rem === 0.0)
                    {
                        return list[tempIndex]
                    }
                    else
                    {
                        return list[tempIndex] + rem * (list[tempIndex + 1] - list[tempIndex])
                    }
                }
                function st_quartileexc(args)
                {
                    var array = args[0];
                    var quart = CalcConvert.I(args[1]);
                    var k = 0.0;
                    switch (quart)
                    {
                        case 1:
                            k = 0.25;
                            break;
                        case 2:
                            k = 0.50;
                            break;
                        case 3:
                            k = 0.75;
                            break;
                        default:
                            return CalcErrorsNumber
                    }
                    var list = [array, k];
                    return st_percentileexc(list)
                }
                function st_rankavg(args)
                {
                    var array = CalcConvert.toArr(args[1], 1, true, false, false);
                    var nums = CalcConvert.toArr(args[0], 1, true, true, true);
                    if (nums.isError)
                    {
                        return nums[0]
                    }
                    else if (nums.isConvertError || nums.rowCount > 1 || nums.colCount > 1)
                    {
                        return CalcErrorsValue
                    }
                    var num = nums[0];
                    var order = 0.0;
                    if (Calc._Helper._argumentExists(args, 2))
                    {
                        if (isNaN(order = CalcConvert.D(args[2])))
                        {
                            return CalcErrorsValue
                        }
                    }
                    var lessThanCount = 0.0;
                    var equalToCount = 0.0;
                    var greaterThanCount = 0.0;
                    for (var i = 0; i < array.length; i++)
                    {
                        var obj = array[i];
                        if (obj !== CalcConvert.CalcConvertedError)
                        {
                            if (obj < num)
                            {
                                lessThanCount++
                            }
                            else if (num < obj)
                            {
                                greaterThanCount++
                            }
                            else
                            {
                                equalToCount++
                            }
                        }
                    }
                    if (equalToCount == 0.0)
                    {
                        return CalcErrorsNotAvailable
                    }
                    return 1.0 + (order === 0.0 ? greaterThanCount : lessThanCount) + (equalToCount - 1.0) / 2.0
                }
                function st_norm_s_dist(args)
                {
                    var z;
                    if (isNaN(z = CalcConvert.D(args[0])))
                    {
                        return CalcErrorsValue
                    }
                    var bCumulative = CalcConvert.B(args[1]);
                    if (bCumulative)
                    {
                        return __integralPhi(z)
                    }
                    else
                    {
                        return Math_exp(-Math_pow(z, 2) / 2) / Math_sqrt(2 * Math_PI)
                    }
                }
                Functions.def("MAX", st_max, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("MAXA", st_maxa, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("MIN", st_min, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("MINA", st_mina, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("LARGE", st_large, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsFirst, acceptsReference: Functions.acceptsFirst
                });
                Functions.def("SMALL", st_small, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsFirst, acceptsReference: Functions.acceptsFirst
                });
                Functions.def("AVERAGEA", st_averagea, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("AVERAGEIF", st_averageif, {
                    minArgs: 2, maxArgs: 3, acceptsMissingArgument: Functions.acceptsThird, acceptsArray: Functions.acceptsFirstOrThird, acceptsReference: Functions.acceptsFirstOrThird
                });
                Functions.def("AVERAGEIFS", st_averageifs, {
                    minArgs: 3, acceptsArray: Functions.acceptsFirstOrOdd, acceptsReference: Functions.acceptsFirstOrOdd
                });
                Functions.def("MEDIAN", st_median, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("MODE", st_mode, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("MODE.SNGL", st_mode, {
                    minArgs: 1, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny
                });
                Functions.def("GEOMEAN", st_geomean, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("HARMEAN", st_harmean, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("TRIMMEAN", st_trimmean, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsFirst, acceptsReference: Functions.acceptsFirst
                });
                Functions.def("FREQUENCY", st_frequency, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("RANK", st_rank, {
                    minArgs: 2, maxArgs: 3, acceptsMissingArgument: Functions.acceptsThird, acceptsArray: Functions.acceptsFirstOrOne, acceptsReference: Functions.acceptsFirstOrOne
                });
                Functions.def("RANK.EQ", st_rank, {
                    minArgs: 2, maxArgs: 3, acceptsReference: Functions.acceptsFirstOrOne, acceptsArray: Functions.acceptsSecond, acceptsMissingArgument: Functions.acceptsThird
                });
                Functions.def("KURT", st_kurt, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("PERCENTRANK", st_percentrank, {
                    minArgs: 2, maxArgs: 3, acceptsMissingArgument: Functions.acceptsThird, acceptsArray: Functions.acceptsFirst, acceptsReference: Functions.acceptsFirst
                });
                Functions.def("PERCENTRANK.INC", st_percentrank, {
                    minArgs: 2, maxArgs: 3, acceptsMissingArgument: Functions.acceptsThird, acceptsArray: Functions.acceptsFirst, acceptsReference: Functions.acceptsFirst
                });
                Functions.def("PERCENTRANK.EXC", st_percentrankexc, {
                    minArgs: 2, maxArgs: 3, acceptsMissingArgument: Functions.acceptsThird, acceptsArray: Functions.acceptsFirst, acceptsReference: Functions.acceptsFirst
                });
                Functions.def("QUARTILE", st_quartile, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsFirst, acceptsReference: Functions.acceptsFirst
                });
                Functions.def("QUARTILE.INC", st_quartile, {
                    minArgs: 2, maxArgs: 2, acceptsReference: Functions.acceptsFirst, acceptsArray: Functions.acceptsFirst
                });
                Functions.def("COUNT", st_count, {
                    minArgs: 1, acceptsError: Functions.acceptsAny, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("COUNTA", st_counta, {
                    minArgs: 1, acceptsError: Functions.acceptsAny, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("COUNTBLANK", st_countblank, {
                    minArgs: 1, maxArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("COUNTIF", st_countif, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsFirst, acceptsReference: Functions.acceptsFirst
                });
                Functions.def("COUNTIFS", st_countifs, {
                    minArgs: 2, acceptsArray: Functions.acceptsEven, acceptsReference: Functions.acceptsEven
                });
                Functions.def("AVEDEV", st_avedev, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("STDEVA", st_stdeva, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("STDEVP", st_stdevp, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("STDEVPA", st_stdevpa, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("VAR", st_varr, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("VAR.S", st_varr, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("VARA", st_vara, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("VARP", st_varp, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("VARPA", st_varpa, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("COVAR", st_covar, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("COVARIANCE.P", st_covar, {
                    minArgs: 2, maxArgs: 2, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny
                });
                Functions.def("DEVSQ", st_devsp, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("CONFIDENCE", st_confidence, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("CONFIDENCE.NORM", st_confidence, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("CONFIDENCE.T", st_confidence_t, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("INTERCEPT", st_intercept, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("LINEST", st_linest, {
                    minArgs: 1, maxArgs: 4, acceptsReference: Functions.acceptsFirstOrOne, acceptsArray: Functions.acceptsFirstOrOne, acceptsMissingArgument: Functions.acceptsSecondOrThirdOrFourth, arrayArgumentEvaluateMode: 1
                });
                Functions.def("SLOPE", st_slope, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny, arrayArgumentEvaluateMode: 1
                });
                Functions.def("LOGEST", st_logest, {
                    minArgs: 1, maxArgs: 4, acceptsReference: Functions.acceptsFirstOrOne, acceptsArray: Functions.acceptsFirstOrOne, acceptsMissingArgument: Functions.acceptsSecondOrThirdOrFourth
                });
                Functions.def("STEYX", st_steyx, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("BETADIST", st_betadist, {
                    minArgs: 3, maxArgs: 5, acceptsMissingArgument: Functions.acceptsFourthOrFifth
                });
                Functions.def("BETA.DIST", st_deta_dist, {
                    minArgs: 4, maxArgs: 6, acceptsMissingArgument: Functions.acceptsFiveSix
                });
                Functions.def("BETAINV", st_betainv, {
                    minArgs: 3, maxArgs: 5, acceptsMissingArgument: Functions.acceptsFourthOrFifth
                });
                Functions.def("BETA.INV", st_betainv, {
                    minArgs: 3, maxArgs: 5, acceptsMissingArgument: Functions.acceptsFourthOrFifth
                });
                Functions.def("BINOMDIST", st_binomdist, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("BINOM.DIST", st_binomdist, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("NEGBINOMDIST", st_negbinomdist, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("NEGBINOM.DIST", st_negbinom_dist, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("CRITBINOM", st_critbinom, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("BINOM.INV", st_critbinom, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("CHIDIST", st_chidist, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("CHISQ.DIST.RT", st_chidist, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("CHISQ.DIST", st_chisq_dist, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("CHIINV", st_chiinv, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("CHISQ.INV.RT", st_chiinv, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("CHISQ.INV", st_chisq_inv, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("CHITEST", st_chitest, {
                    minArgs: 2, maxArgs: 2, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny
                });
                Functions.def("CHISQ.TEST", st_chitest, {
                    minArgs: 2, maxArgs: 2, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny
                });
                Functions.def("CORREL", st_correl, {
                    minArgs: 2, maxArgs: 2, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny
                });
                Functions.def("EXPONDIST", st_expondist, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("EXPON.DIST", st_expondist, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("FDIST", st_fdist, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("F.DIST", st_f_dist, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("F.DIST.RT", st_fdist, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("FINV", st_finv, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("F.INV.RT", st_finv, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("F.INV", st_f_inv, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("FISHER", st_fisher, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("FISHERINV", st_fisherinv, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("FTEST", st_ftest, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("F.TEST", st_ftest, {
                    minArgs: 2, maxArgs: 2, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("GAMMADIST", st_gammadist, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("GAMMA.DIST", st_gammadist, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("GAMMAINV", st_gammainv, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("GAMMA.INV", st_gammainv, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("GAMMALN", st_gammaln, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("GAMMALN.PRECISE", st_gammaln, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("HYPGEOMDIST", st_hypgeomdist, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("HYPGEOM.DIST", st_hypgeom_dist, {
                    minArgs: 5, maxArgs: 5
                });
                Functions.def("LOGNORMDIST", st_lognormdist, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("LOGNORM.DIST", st_lognorm_dist, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("LOGINV", st_loginv, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("LOGNORM.INV", st_loginv, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("NORMDIST", st_normdist, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("NORM.DIST", st_normdist, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("NORMINV", st_norminv, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("NORM.INV", st_norminv, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("NORMSDIST", st_normsdist, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("NORMSINV", st_normsinv, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("NORM.S.INV", st_normsinv, {
                    minArgs: 1, maxArgs: 1
                });
                Functions.def("NORM.S.DIST", st_norm_s_dist, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("PEARSON", st_pearson, {
                    minArgs: 2, maxArgs: 2, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny
                });
                Functions.def("RSQ", st_rsq, {
                    minArgs: 2, maxArgs: 2, acceptsReference: Functions.acceptsFirstOrOne, acceptsArray: Functions.acceptsFirstOrOne
                });
                Functions.def("POISSON", st_poisson, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("POISSON.DIST", st_poisson, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("PROB", st_prob, {
                    minArgs: 3, maxArgs: 4, acceptsMissingArgument: Functions.acceptsFourth, acceptsReference: Functions.acceptsFirstOrOne, acceptsArray: Functions.acceptsFirstOrOne
                });
                Functions.def("SKEW", st_skew, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                });
                Functions.def("STANDARDIZE", st_standardize, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("TDIST", st_tdist, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("T.DIST", st_t_dist, {
                    minArgs: 3, maxArgs: 3
                });
                Functions.def("T.DIST.RT", st_tdistrt, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("T.DIST.2T", st_tdist2t, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("TINV", st_tinv, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("T.INV.2T", st_tinv, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("T.INV", st_t_inv, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("TTEST", st_ttest, {
                    minArgs: 4, maxArgs: 4, acceptsReference: Functions.acceptsFirstOrOne, acceptsArray: Functions.acceptsFirstOrOne
                });
                Functions.def("T.TEST", st_ttest, {
                    minArgs: 4, maxArgs: 4, acceptsReference: Functions.acceptsFirstOrOne, acceptsArray: Functions.acceptsFirstOrOne
                });
                Functions.def("WEIBULL", st_weibull, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("WEIBULL.DIST", st_weibull, {
                    minArgs: 4, maxArgs: 4
                });
                Functions.def("ZTEST", st_ztest, {
                    minArgs: 2, maxArgs: 3, acceptsReference: Functions.acceptsFirst, acceptsArray: Functions.acceptsFirst, acceptsMissingArgument: Functions.acceptsThird
                });
                Functions.def("Z.TEST", st_ztest, {
                    minArgs: 2, maxArgs: 3, acceptsReference: Functions.acceptsFirst, acceptsArray: Functions.acceptsFirst, acceptsMissingArgument: Functions.acceptsThird
                });
                Functions.def("PERMUT", st_permut, {
                    minArgs: 2, maxArgs: 2
                });
                Functions.def("COVARIANCE.S", st_convariances, {
                    minArgs: 2, maxArgs: 2, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny
                });
                Functions.def("MODE.MULT", st_modemult, {
                    minArgs: 1, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny
                });
                Functions.def("PERCENTILE.EXC", st_percentileexc, {
                    minArgs: 2, maxArgs: 2, acceptsReference: Functions.acceptsFirst, acceptsArray: Functions.acceptsFirst
                });
                Functions.def("QUARTILE.EXC", st_quartileexc, {
                    minArgs: 2, maxArgs: 2, acceptsReference: Functions.acceptsFirst, acceptsArray: Functions.acceptsFirst
                });
                Functions.def("RANK.AVG", st_rankavg, {
                    minArgs: 2, maxArgs: 3, acceptsReference: Functions.acceptsFirstOrOne, acceptsArray: Functions.acceptsSecond, acceptsMissingArgument: Functions.acceptsThird
                });
                Functions.def("STDEV.P", st_stdevp, {
                    minArgs: 1, acceptsReference: Functions.acceptsAny, acceptsArray: Functions.acceptsAny
                });
                Functions.def("VAR.P", st_varp, {
                    minArgs: 1, acceptsArray: Functions.acceptsAny, acceptsReference: Functions.acceptsAny
                })
            })(Calc.Functions || (Calc.Functions = {}));
            var Functions = Calc.Functions
        })(Sheets.Calc || (Sheets.Calc = {}));
        var Calc = Sheets.Calc
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

