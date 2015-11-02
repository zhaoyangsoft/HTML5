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
        Sheets.feature("formatter", ["core.common", "core.globalize", "core.migrate"]);
        var keyword_null = null,
            keyword_undefined = undefined,
            Math_abs = Math.abs,
            Math_ceil = Math.ceil,
            Math_pow = Math.pow,
            Math_floor = Math.floor,
            Math_max = Math.max,
            Math_min = Math.min,
            Math_round = Math.round;
        var stringEx = {
                Empty: "", Format: function()
                    {
                        var args = [];
                        for (var _i = 0; _i < (arguments.length - 0); _i++)
                        {
                            args[_i] = arguments[_i + 0]
                        }
                        if (arguments.length === 0)
                        {
                            return keyword_null
                        }
                        var str = args[0];
                        for (var i = 1; i < arguments.length; i++)
                        {
                            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                            str = str.replace(re, arguments[i])
                        }
                        return str
                    }, IsNullOrEmpty: function(obj)
                    {
                        return !obj || obj === stringEx.Empty
                    }
            };
        var DateTimeStyles;
        (function(DateTimeStyles)
        {
            DateTimeStyles[DateTimeStyles["None"] = 0] = "None";
            DateTimeStyles[DateTimeStyles["AllowLeadingWhite"] = 1] = "AllowLeadingWhite";
            DateTimeStyles[DateTimeStyles["AllowTrailingWhite"] = 2] = "AllowTrailingWhite";
            DateTimeStyles[DateTimeStyles["AllowInnerWhite"] = 4] = "AllowInnerWhite";
            DateTimeStyles[DateTimeStyles["AllowWhiteSpaces"] = 7] = "AllowWhiteSpaces";
            DateTimeStyles[DateTimeStyles["NoCurrentDateDefault"] = 8] = "NoCurrentDateDefault";
            DateTimeStyles[DateTimeStyles["AdjustToUniversal"] = 16] = "AdjustToUniversal";
            DateTimeStyles[DateTimeStyles["AssumeLocal"] = 32] = "AssumeLocal";
            DateTimeStyles[DateTimeStyles["AssumeUniversal"] = 64] = "AssumeUniversal";
            DateTimeStyles[DateTimeStyles["RoundtripKind"] = 128] = "RoundtripKind"
        })(DateTimeStyles || (DateTimeStyles = {}));
        var char = {
                IsDigit: function(c)
                {
                    var cc = c.charCodeAt(0);
                    return cc >= 0x30 && cc <= 0x39
                }, IsWhiteSpace: function(c)
                    {
                        var cc = c.charCodeAt(0);
                        return (cc >= 0x0009 && cc <= 0x000D) || (cc === 0x0020) || (cc === 0x0085) || (cc === 0x00A0)
                    }
            };
        (function(FormatMode)
        {
            FormatMode[FormatMode["CustomMode"] = 0] = "CustomMode";
            FormatMode[FormatMode["StandardDateTimeMode"] = 1] = "StandardDateTimeMode";
            FormatMode[FormatMode["StandardNumericMode"] = 2] = "StandardNumericMode"
        })(Sheets.FormatMode || (Sheets.FormatMode = {}));
        var FormatMode = Sheets.FormatMode;
        (function(NumberFormatType)
        {
            NumberFormatType[NumberFormatType["General"] = 0] = "General";
            NumberFormatType[NumberFormatType["Number"] = 1] = "Number";
            NumberFormatType[NumberFormatType["DateTime"] = 2] = "DateTime";
            NumberFormatType[NumberFormatType["Text"] = 3] = "Text"
        })(Sheets.NumberFormatType || (Sheets.NumberFormatType = {}));
        var NumberFormatType = Sheets.NumberFormatType;
        var TimePart;
        (function(TimePart)
        {
            TimePart[TimePart["Hour"] = 0] = "Hour";
            TimePart[TimePart["Minute"] = 1] = "Minute";
            TimePart[TimePart["Second"] = 2] = "Second"
        })(TimePart || (TimePart = {}));
        var DefaultTokens = (function()
            {
                function DefaultTokens(){}
                DefaultTokens.DateTimeFormatInfo = function()
                {
                    return Sheets._CultureInfo._currentCulture.DateTimeFormat()
                };
                DefaultTokens.NumberFormatInfo = function()
                {
                    return Sheets._CultureInfo._currentCulture.NumberFormat()
                };
                DefaultTokens.Filter = function(s, bracketsStart, bracketsEnd)
                {
                    if (s === keyword_undefined || s === keyword_null || s === "")
                    {
                        return s
                    }
                    var sb = "";
                    var refCount = 0;
                    for (var n = 0; n < s.length; n++)
                    {
                        var c = s[n];
                        if (c === bracketsStart)
                        {
                            refCount++
                        }
                        else if (c === bracketsEnd)
                        {
                            refCount--;
                            if (refCount < 0)
                            {
                                refCount = 0
                            }
                        }
                        else if (refCount === 0)
                        {
                            sb += c
                        }
                    }
                    return sb.toString()
                };
                DefaultTokens.TrimSquareBracket = function(token)
                {
                    if (!token || token === stringEx.Empty)
                    {
                        return token
                    }
                    if (token[0] === DefaultTokens.LeftSquareBracket)
                    {
                        token = Sheets.StringHelper.TrimStart(token, DefaultTokens.LeftSquareBracket)
                    }
                    if (token[token.length - 1] === DefaultTokens.RightSquareBracket)
                    {
                        token = Sheets.StringHelper.TrimEnd(token, DefaultTokens.RightSquareBracket)
                    }
                    return token
                };
                DefaultTokens.IsOperator = function(c)
                {
                    return (c === DefaultTokens.LessThanSign || c === DefaultTokens.GreaterThanSign || c === DefaultTokens.EqualsThanSign)
                };
                DefaultTokens.TrimEscape = function(token)
                {
                    var len = token.length;
                    var inEscape = false;
                    var sb = "";
                    for (var n = 0; n < len; n++)
                    {
                        var c = token.charAt(n);
                        if (c === DefaultTokens.ReverseSolidusSign)
                        {
                            inEscape = !inEscape;
                            if (!inEscape)
                            {
                                sb += c
                            }
                        }
                        else
                        {
                            inEscape = false;
                            sb += c
                        }
                    }
                    return sb
                };
                DefaultTokens.AddSquareBracket = function(token)
                {
                    if (!token)
                    {
                        throw new Error(Sheets.SR.Exp_TokenIsNull);
                    }
                    if (token.length === 0 || token[0] !== DefaultTokens.LeftSquareBracket)
                    {
                        token = Sheets.StringHelper.Insert(token, 0, DefaultTokens.LeftSquareBracket.toString())
                    }
                    if (token.length === 0 || token[token.length - 1] !== DefaultTokens.RightSquareBracket)
                    {
                        token = Sheets.StringHelper.Insert(token, token.length, DefaultTokens.RightSquareBracket.toString())
                    }
                    return token
                };
                DefaultTokens.IsEquals = function(a, b, isIgnoreCase)
                {
                    if (!a && !b)
                    {
                        return true
                    }
                    else if (!a || !b)
                    {
                        return false
                    }
                    else if (isIgnoreCase)
                    {
                        return a.toLowerCase() === b.toLowerCase()
                    }
                    else
                    {
                        return a === b
                    }
                };
                DefaultTokens.ReplaceKeyword = function(s, oldString, newString)
                {
                    if (!s || s === stringEx.Empty || this.IsEquals(oldString, newString, true))
                    {
                        return s
                    }
                    var strTemp = s;
                    var start = 0;
                    while (true)
                    {
                        var index = Sheets.StringHelper.IndexOf(strTemp, oldString, 1);
                        if (index > -1)
                        {
                            strTemp = Sheets.StringHelper.Remove(strTemp, index, oldString.length);
                            strTemp = Sheets.StringHelper.Insert(strTemp, index, newString);
                            start = index + newString.length
                        }
                        else
                        {
                            break
                        }
                    }
                    return strTemp
                };
                DefaultTokens.IsDecimal = function(s, numberFormatInfo)
                {
                    var decimalSeparator = DefaultTokens.DecimalSeparator;
                    return (s.indexOf(decimalSeparator) > -1)
                };
                DefaultTokens.DoubleQuote = '\"';
                DefaultTokens.SingleQuote = '\'';
                DefaultTokens.Tab = '\t';
                DefaultTokens.LeftSquareBracket = '[';
                DefaultTokens.RightSquareBracket = ']';
                DefaultTokens.LessThanSign = '<';
                DefaultTokens.GreaterThanSign = '>';
                DefaultTokens.EqualsThanSign = '=';
                DefaultTokens.PlusSign = '+';
                DefaultTokens.HyphenMinus = '-';
                DefaultTokens.UnderLine = '_';
                DefaultTokens.LeftParenthesis = '(';
                DefaultTokens.RightParenthesis = ')';
                DefaultTokens.Dollar = '$';
                DefaultTokens.Comma = ';';
                DefaultTokens.Space = ' ';
                DefaultTokens.SolidusSign = '/';
                DefaultTokens.ReverseSolidusSign = '\\';
                DefaultTokens.Zero = '0';
                DefaultTokens.QuestionMark = '?';
                DefaultTokens.Colon = ':';
                DefaultTokens.Semicolon = ';';
                DefaultTokens.Sharp = '#';
                DefaultTokens.CommercialAt = '@';
                DefaultTokens.NumberSign = '#';
                DefaultTokens.Asterisk = '*';
                DefaultTokens.Exponential1 = "E+";
                DefaultTokens.Exponential2 = "E-";
                DefaultTokens.DecimalSeparator = ".";
                DefaultTokens.numberGroupSeparator = ",";
                DefaultTokens.percentSymbol = "%";
                DefaultTokens.nanSymbol = "NaN";
                DefaultTokens.FormatSeparator = ";";
                DefaultTokens.negativeSign = "-";
                DefaultTokens.ReplacePlaceholder = "@";
                DefaultTokens.ExponentialSymbol = "E";
                return DefaultTokens
            })();
        Sheets.DefaultTokens = DefaultTokens;
        var NumberFormatBase = (function()
            {
                function NumberFormatBase(partLocaleID, dbNumberFormatPart, cultureName)
                {
                    this._classNames = ["NumberFormatBase", "IFormatter", "IFormatProviderSupport"];
                    this.numberFormatInfo = keyword_null;
                    this.dateTimeFormatInfo = keyword_null;
                    this.cultureName = "";
                    var self = this;
                    self._initFileds();
                    self.partLocaleID = partLocaleID;
                    self.partDbNumberFormat = dbNumberFormatPart;
                    if (!cultureName)
                    {
                        self.cultureName = Sheets._CultureInfo._currentCulture.Name()
                    }
                    else
                    {
                        self.cultureName = cultureName
                    }
                }
                NumberFormatBase.prototype._initFileds = function()
                {
                    var self = this;
                    self.numberStringConverter = keyword_null;
                    self.numberFormatInfo = keyword_null;
                    self.dateTimeFormatInfo = keyword_null;
                    self.partLocaleID = keyword_null;
                    self.partDbNumberFormat = keyword_null
                };
                NumberFormatBase.prototype.NumberStringConverter = function(value)
                {
                    if (arguments.length === 0)
                    {
                        if (this.numberStringConverter)
                        {
                            return this.numberStringConverter
                        }
                        return keyword_null
                    }
                    else
                    {
                        this.numberStringConverter = value;
                        return value
                    }
                };
                NumberFormatBase.prototype.PartLocaleID = function()
                {
                    return Sheets.util.asCustomType(this.partLocaleID, "LocaleIDFormatPart")
                };
                NumberFormatBase.prototype.PartDBNumberFormat = function()
                {
                    return Sheets.util.asCustomType(this.partDbNumberFormat, "DBNumberFormatPart")
                };
                NumberFormatBase.prototype.DateTimeFormatInfo = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this.dateTimeFormatInfo
                    }
                    else
                    {
                        this.dateTimeFormatInfo = value;
                        return value
                    }
                };
                NumberFormatBase.prototype.NumberFormatInfo = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this.numberFormatInfo
                    }
                    else
                    {
                        this.numberFormatInfo = value;
                        return value
                    }
                };
                NumberFormatBase.prototype.CultureName = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self.partLocaleID ? self.partLocaleID.CultureInfo().Name() : self.cultureName
                    }
                    else
                    {
                        self.cultureName = value;
                        return value
                    }
                };
                NumberFormatBase.prototype.numberGroupSeparator = function()
                {
                    if (this.NumberFormatInfo())
                    {
                        return this.NumberFormatInfo().numberGroupSeparator
                    }
                    return DefaultTokens.numberGroupSeparator
                };
                NumberFormatBase.prototype.PercentSymbol = function()
                {
                    if (this.NumberFormatInfo())
                    {
                        return this.NumberFormatInfo().percentSymbol
                    }
                    return DefaultTokens.percentSymbol
                };
                NumberFormatBase.prototype.PositiveSign = function()
                {
                    if (this.NumberFormatInfo())
                    {
                        return this.NumberFormatInfo().positiveSign
                    }
                    return DefaultTokens.NumberFormatInfo().positiveSign
                };
                NumberFormatBase.prototype.NegativeSign = function()
                {
                    if (this.NumberFormatInfo())
                    {
                        return this.NumberFormatInfo().negativeSign
                    }
                    return DefaultTokens.negativeSign
                };
                NumberFormatBase.prototype.DecimalSeparator = function()
                {
                    return DefaultTokens.DecimalSeparator
                };
                NumberFormatBase.prototype.NaNSymbol = function()
                {
                    if (this.NumberFormatInfo())
                    {
                        return this.NumberFormatInfo().nanSymbol
                    }
                    return DefaultTokens.nanSymbol
                };
                NumberFormatBase.TrimNotSupportSymbol = function(format, isSupportFraction)
                {
                    if (arguments.length === 1)
                    {
                        isSupportFraction = true
                    }
                    var inComments = false;
                    var sb = "";
                    for (var n = 0; n < format.length; n++)
                    {
                        var c = format[n];
                        var append = true;
                        if (c === '\"')
                        {
                            inComments = !inComments
                        }
                        else
                        {
                            if (!inComments)
                            {
                                if (!isSupportFraction)
                                {
                                    if (c === '?')
                                    {
                                        if (!NumberFormatBase.IsTransform(format, n))
                                        {
                                            append = false
                                        }
                                    }
                                    if (c === '/')
                                    {
                                        if (!NumberFormatBase.IsTransform(format, n))
                                        {
                                            append = false
                                        }
                                    }
                                }
                                if (c === '_')
                                {
                                    if (!NumberFormatBase.IsTransform(format, n))
                                    {
                                        append = false;
                                        n++
                                    }
                                }
                                else if (c === '*')
                                {
                                    if (!NumberFormatBase.IsTransform(format, n))
                                    {
                                        append = false
                                    }
                                }
                            }
                        }
                        if (append)
                        {
                            sb += c
                        }
                    }
                    return sb
                };
                NumberFormatBase.IsTransform = function(str, currentpos)
                {
                    if (str[currentpos] === '\\')
                    {
                        throw new Error(Sheets.SR.Exp_InvalidBackslash);
                    }
                    if (currentpos - 1 > 0 && currentpos - 1 < str.length)
                    {
                        if (str[currentpos - 1] === '\\')
                        {
                            if (currentpos - 2 < 0)
                            {
                                return true
                            }
                            else
                            {
                                if (currentpos - 2 > 0 && currentpos - 2 < str.length)
                                {
                                    return str[currentpos - 2] !== '\\'
                                }
                            }
                        }
                    }
                    return false
                };
                NumberFormatBase.ContainsKeywords = function(format, keywords, keywordsSet)
                {
                    if (!format || format === stringEx.Empty)
                    {
                        return false
                    }
                    if (keywordsSet[format])
                    {
                        return true
                    }
                    var stringOnlyKeywords = "";
                    var inComments = false;
                    var last = keyword_null,
                        cCode;
                    for (var n = 0; n < format.length; n++)
                    {
                        var c = format[n];
                        if (c === '\"')
                        {
                            inComments = !inComments
                        }
                        else
                        {
                            if (!inComments)
                            {
                                if (c !== DefaultTokens.UnderLine && last !== DefaultTokens.UnderLine)
                                {
                                    if (c !== 'E')
                                    {
                                        cCode = c.charCodeAt(0);
                                        if (cCode >= 65 && cCode <= 90)
                                        {
                                            cCode |= 0x20;
                                            c = String.fromCharCode(cCode)
                                        }
                                    }
                                    stringOnlyKeywords += c
                                }
                            }
                        }
                        last = c
                    }
                    var formatTemp = stringOnlyKeywords;
                    if (keywordsSet[formatTemp])
                    {
                        return true
                    }
                    for (var index = 0; index < keywords.length; index++)
                    {
                        if (formatTemp.indexOf(keywords[index]) >= 0)
                        {
                            return true
                        }
                    }
                    return false
                };
                NumberFormatBase.prototype.Format = function(obj)
                {
                    return ""
                };
                NumberFormatBase.prototype.Parse = function(str)
                {
                    return keyword_null
                };
                NumberFormatBase.prototype.FormatString = function()
                {
                    return ""
                };
                NumberFormatBase.prototype.ExcelCompatibleFormatString = function()
                {
                    return ""
                };
                NumberFormatBase.General = "General";
                NumberFormatBase.General_Lower = "general";
                NumberFormatBase._keywords = [NumberFormatBase.General_Lower];
                NumberFormatBase._keywordsSet = {general: true};
                return NumberFormatBase
            })();
        var _StandardDateTimeFormatter = (function()
            {
                function _StandardDateTimeFormatter(format)
                {
                    var self = this;
                    self.shortDatePattern = "d";
                    self.longDatePattern = "D";
                    self.FullDatePatternShortTime = "f";
                    self.FullDatePatternLongTime = "F";
                    self.GeneralDatePatternLongTimeShortTime = "g";
                    self.GeneralDatePatternLongTimeLongTime = "G";
                    self.MonthDayPattern1 = "m";
                    self.MonthDayPattern2 = "M";
                    self.RoundTripDatePattern1 = "o";
                    self.RoundTripDatePattern2 = "O";
                    self.RFC1123Pattern1 = "r";
                    self.RFC1123Pattern2 = "R";
                    self.SortableDatePattern = "s";
                    self.shortTimePattern = "t";
                    self.longTimePattern = "T";
                    self.UniversalSortableDatePattern = "u";
                    self.UniversalFullDatePattern = "U";
                    self.YearMonthPattern1 = "y";
                    self.YearMonthPattern2 = "Y";
                    self._classNames = ["StandardDateTimeFormatter", "IFormatter"];
                    self._formatString = format
                }
                _StandardDateTimeFormatter.prototype.EvaluateFormat = function(format)
                {
                    var self = this;
                    if (format === self.shortDatePattern || format === self.longDatePattern || format === self.FullDatePatternShortTime || format === self.FullDatePatternLongTime || format === self.GeneralDatePatternLongTimeShortTime || format === self.GeneralDatePatternLongTimeLongTime || format === self.MonthDayPattern1 || format === self.MonthDayPattern2 || format === self.RoundTripDatePattern1 || format === self.RoundTripDatePattern2 || format === self.RFC1123Pattern1 || format === self.RFC1123Pattern2 || format === self.SortableDatePattern || format === self.shortTimePattern || format === self.longTimePattern || format === self.UniversalSortableDatePattern || format === self.UniversalFullDatePattern || format === self.YearMonthPattern1 || format === self.YearMonthPattern2)
                    {
                        return true
                    }
                    return false
                };
                _StandardDateTimeFormatter.prototype.Format = function(obj)
                {
                    try
                    {
                        if (obj === keyword_undefined || obj === keyword_null || obj === "")
                        {
                            return ""
                        }
                        return new Sheets._DateTimeHelper(obj).localeFormat(this._formatString)
                    }
                    catch(err)
                    {
                        return obj.toString()
                    }
                };
                _StandardDateTimeFormatter.prototype.Parse = function(str)
                {
                    try
                    {
                        if (!str || str === "")
                        {
                            return keyword_null
                        }
                        return Sheets._DateTimeHelper.parseLocale(str, this._formatString)
                    }
                    catch(err)
                    {
                        return new Date(str)
                    }
                };
                _StandardDateTimeFormatter.prototype.FormatString = function()
                {
                    return this._formatString
                };
                return _StandardDateTimeFormatter
            })();
        Sheets._StandardDateTimeFormatter = _StandardDateTimeFormatter;
        var _StandardNumberFormatter = (function()
            {
                function _StandardNumberFormatter(format)
                {
                    var self = this;
                    self.CurrencyPattern1 = "c";
                    self.CurrencyPattern2 = "C";
                    self.DecimalPattern1 = "d";
                    self.DecimalPattern2 = "D";
                    self.ScientificPattern1 = "e";
                    self.ScientificPattern2 = "E";
                    self.FixedPointPattern1 = "f";
                    self.FixedPointPattern2 = "F";
                    self.GeneralPattern1 = "g";
                    self.GeneralPattern2 = "G";
                    self.NumberPattern1 = "n";
                    self.NumberPattern2 = "N";
                    self.PercentPattern1 = "p";
                    self.PercentPattern2 = "P";
                    self.RoundTripPattern1 = "r";
                    self.RoundTripPattern2 = "R";
                    self.HexadecimalPattern1 = "x";
                    self.HexadecimalPattern2 = "X";
                    self._classNames = ["StandardNumberFormatter", "IFormatter"];
                    self._formatString = format
                }
                _StandardNumberFormatter.prototype.EvaluateFormat = function(format)
                {
                    var self = this;
                    if (format && format !== stringEx.Empty && format.length > 0)
                    {
                        var key = format.substr(0, 1);
                        if (key === self.CurrencyPattern1 || key === self.CurrencyPattern2 || key === self.DecimalPattern1 || key === self.DecimalPattern2 || key === self.ScientificPattern1 || key === self.ScientificPattern2 || key === self.FixedPointPattern1 || key === self.FixedPointPattern2 || key === self.GeneralPattern1 || key === self.GeneralPattern2 || key === self.NumberPattern1 || key === self.NumberPattern2 || key === self.PercentPattern1 || key === self.PercentPattern2 || key === self.RoundTripPattern1 || key === self.RoundTripPattern2 || key === self.HexadecimalPattern1 || key === self.HexadecimalPattern2)
                        {
                            return true
                        }
                    }
                    return false
                };
                _StandardNumberFormatter.prototype.Format = function(obj)
                {
                    try
                    {
                        if (obj === keyword_null || obj === keyword_undefined || obj === "")
                        {
                            return ""
                        }
                        return new Sheets._NumberHelper(obj).localeFormat(this._formatString)
                    }
                    catch(err)
                    {
                        return obj.toString()
                    }
                };
                _StandardNumberFormatter.prototype.Parse = function(str)
                {
                    try
                    {
                        if (str === keyword_null || str === keyword_undefined || str === "")
                        {
                            return keyword_null
                        }
                        return Sheets._NumberHelper.parseLocale(str)
                    }
                    catch(err)
                    {
                        var result = parseFloat(str);
                        if (isNaN(result) || !isFinite(result))
                        {
                            return keyword_null
                        }
                        return result
                    }
                };
                _StandardNumberFormatter.prototype.FormatString = function()
                {
                    return this._formatString
                };
                return _StandardNumberFormatter
            })();
        Sheets._StandardNumberFormatter = _StandardNumberFormatter;
        var NumberFormatText = (function(_super)
            {
                __extends(NumberFormatText, _super);
                function NumberFormatText(format, partLocaleID, dbNumberFormatPart, culture)
                {
                    var self = this;
                    _super.call(this, partLocaleID, dbNumberFormatPart, culture);
                    self._classNames = ["NumberFormatText", "IFormatter"];
                    var formatTemp = NumberFormatBase.TrimNotSupportSymbol(format, false);
                    if (partLocaleID)
                    {
                        formatTemp = DefaultTokens.ReplaceKeyword(formatTemp, self.PartLocaleID().OriginalToken(), self.PartLocaleID().CurrencySymbol())
                    }
                    formatTemp = DefaultTokens.Filter(formatTemp, DefaultTokens.LeftSquareBracket, DefaultTokens.RightSquareBracket);
                    formatTemp = DefaultTokens.TrimEscape(formatTemp);
                    self._formatString = formatTemp
                }
                NumberFormatText.prototype.Format = function(obj)
                {
                    try
                    {
                        var result = Sheets.Calc.Convert.S(obj);
                        var formatStringTemp = Sheets.StringHelper.Replace(this._formatString, "\"", "");
                        if (formatStringTemp !== keyword_null && formatStringTemp !== keyword_undefined)
                        {
                            result = Sheets.StringHelper.Replace(formatStringTemp, "@", result)
                        }
                        return result
                    }
                    catch(err)
                    {
                        return ""
                    }
                };
                NumberFormatText.prototype.Parse = function(str)
                {
                    if (!str)
                    {
                        return ""
                    }
                    return str
                };
                NumberFormatText.prototype.FormatString = function()
                {
                    return this._formatString
                };
                NumberFormatText.EvaluateFormat = function(format)
                {
                    return true
                };
                NumberFormatText.prototype.DefaultDateTimeNumberStringConverter = function(){};
                return NumberFormatText
            })(NumberFormatBase);
        var AutoFormatter = (function()
            {
                function AutoFormatter(innerFormatter)
                {
                    this._innerFormatter = innerFormatter
                }
                AutoFormatter.prototype.FormatString = function()
                {
                    return this._innerFormatter ? this._innerFormatter.FormatString() : ''
                };
                AutoFormatter.prototype.innerFormatter = function(formatter)
                {
                    if (arguments.length === 0)
                    {
                        return this._innerFormatter
                    }
                    this._innerFormatter = formatter;
                    return this
                };
                AutoFormatter.prototype.Parse = function(text)
                {
                    return this._innerFormatter ? this._innerFormatter.Parse(text) : text
                };
                AutoFormatter.prototype.Format = function(obj)
                {
                    return this._innerFormatter ? this._innerFormatter.Format(obj) : ((obj === keyword_undefined || obj === keyword_null) ? "" : obj.toString())
                };
                AutoFormatter.prototype.toJSON = function()
                {
                    return keyword_undefined
                };
                return AutoFormatter
            })();
        Sheets.AutoFormatter = AutoFormatter;
        var CustomNumberFormat = (function()
            {
                function CustomNumberFormat(format, culture)
                {
                    var self = this;
                    self.conditionFormatPart = keyword_null;
                    self.colorFormatPart = keyword_null;
                    self.localeIDFormatPart = keyword_null;
                    self.dbNumberFormatPart = keyword_null;
                    self.numberFormat = keyword_null;
                    self.dateTimeFormatInfo = keyword_null;
                    self.numberFormatInfo = keyword_null;
                    self.formatCached = keyword_null;
                    self._classNames = ["CustomNumberFormat", "IFormatter", "IFormatProviderSupport"];
                    if (!culture)
                    {
                        culture = Sheets._CultureInfo._currentCulture.Name()
                    }
                    if (arguments.length === 0)
                    {
                        self.formatCached = NumberFormatBase.General;
                        self.numberFormat = new NumberFormatGeneral
                    }
                    else
                    {
                        self.Init(format, culture)
                    }
                }
                CustomNumberFormat.prototype.Init = function(format, culture)
                {
                    if (format === keyword_null || format === keyword_undefined)
                    {
                        throw new Error(Sheets.SR.Exp_FormatIllegal);
                    }
                    var self = this;
                    self.formatCached = format;
                    var contentToken = "";
                    var token = "";
                    var isInFormatPart = false;
                    var absTimePart = [];
                    for (var index = 0; index < format.length; index++)
                    {
                        var c = format[index];
                        if (c === DefaultTokens.LeftSquareBracket)
                        {
                            if (isInFormatPart)
                            {
                                throw new Error(Sheets.SR.Exp_FormatIllegal);
                            }
                            else
                            {
                                if (token)
                                {
                                    if (!contentToken)
                                    {
                                        contentToken = ""
                                    }
                                    contentToken += token;
                                    token = ""
                                }
                                token = c.toString()
                            }
                            isInFormatPart = true
                        }
                        else if (c === DefaultTokens.RightSquareBracket)
                        {
                            if (isInFormatPart)
                            {
                                if (token)
                                {
                                    token += c;
                                    var part = token.toString();
                                    var partObject = Sheets.util.asCustomType(FormatPartBase.Create(part), "FormatPartBase");
                                    if (partObject && !(Sheets.util.isCustomType(partObject, "ABSTimeFormatPart")))
                                    {
                                        self.AddPart(partObject)
                                    }
                                    else
                                    {
                                        if (Sheets.util.isCustomType(partObject, "ABSTimeFormatPart"))
                                        {
                                            absTimePart.push(Sheets.util.asCustomType(partObject, "ABSTimeFormatPart"));
                                            contentToken += token
                                        }
                                        else
                                        {
                                            throw new Error(Sheets.SR.Exp_FormatIllegal);
                                        }
                                    }
                                    token = ""
                                }
                                else
                                {
                                    throw new Error(Sheets.SR.Exp_FormatIllegal);
                                }
                            }
                            else
                            {
                                throw new Error(Sheets.SR.Exp_FormatIllegal);
                            }
                            isInFormatPart = false
                        }
                        else
                        {
                            token += c
                        }
                    }
                    if (token)
                    {
                        if (isInFormatPart)
                        {
                            throw new Error(Sheets.SR.Exp_FormatIllegal);
                        }
                        else
                        {
                            contentToken += token
                        }
                    }
                    if (self.localeIDFormatPart !== keyword_null)
                    {
                        culture = self.localeIDFormatPart.CultureInfo().Name()
                    }
                    var content = contentToken ? contentToken.toString() : stringEx.Empty;
                    if (NumberFormatGeneral.EvaluateFormat(content))
                    {
                        self.numberFormat = new NumberFormatGeneral(content, self.LocaleIDFormatPart(), self.dbNumberFormatPart, culture)
                    }
                    else if (NumberFormatDateTime.EvaluateFormat(content))
                    {
                        var absPartsArray = absTimePart.length > 0 ? absTimePart : keyword_null;
                        self.numberFormat = new NumberFormatDateTime(content, absPartsArray, self.LocaleIDFormatPart(), self.dbNumberFormatPart, culture)
                    }
                    else if (NumberFormatDigital.EvaluateFormat(content))
                    {
                        self.numberFormat = new NumberFormatDigital(format, self.LocaleIDFormatPart(), self.dbNumberFormatPart, culture)
                    }
                    else if (NumberFormatText.EvaluateFormat(content))
                    {
                        self.numberFormat = new NumberFormatText(format, self.LocaleIDFormatPart(), self.dbNumberFormatPart, culture)
                    }
                    else
                    {
                        throw new Error(Sheets.SR.Exp_FormatIllegal);
                    }
                };
                CustomNumberFormat.prototype.FormatString = function()
                {
                    var self = this;
                    var formatBuilder = "";
                    if (self.numberFormat && self.numberFormat.FormatString())
                    {
                        if (self.ColorFormatPart())
                        {
                            formatBuilder += (self.ColorFormatPart().toString())
                        }
                        if (self.ConditionFormatPart())
                        {
                            formatBuilder += (self.ConditionFormatPart().toString())
                        }
                        if (self.DBNumberFormatPart())
                        {
                            formatBuilder += (self.DBNumberFormatPart().toString())
                        }
                        if (self.LocaleIDFormatPart())
                        {
                            formatBuilder += (self.LocaleIDFormatPart().toString())
                        }
                        formatBuilder += (self.numberFormat.FormatString())
                    }
                    return formatBuilder.toString()
                };
                CustomNumberFormat.prototype.ConditionFormatPart = function()
                {
                    return this.conditionFormatPart
                };
                CustomNumberFormat.prototype.ColorFormatPart = function()
                {
                    return this.colorFormatPart
                };
                CustomNumberFormat.prototype.LocaleIDFormatPart = function()
                {
                    return this.localeIDFormatPart
                };
                CustomNumberFormat.prototype.DBNumberFormatPart = function()
                {
                    return this.dbNumberFormatPart
                };
                CustomNumberFormat.prototype.NumberStringConverter = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        if (self.numberFormat)
                        {
                            return self.numberFormat.NumberStringConverter()
                        }
                        return keyword_null
                    }
                    else
                    {
                        if (self.numberFormat)
                        {
                            self.numberFormat.NumberStringConverter(value)
                        }
                    }
                };
                CustomNumberFormat.prototype.ExcelCompatibleFormatString = function()
                {
                    var self = this;
                    var formatBuilder = "";
                    if (self.numberFormat && self.numberFormat.ExcelCompatibleFormatString())
                    {
                        if (!(Sheets.util.isCustomType(self.numberFormat, "NumberFormatDigital")))
                        {
                            if (self.DBNumberFormatPart())
                            {
                                formatBuilder += (self.DBNumberFormatPart().toString())
                            }
                            if (self.LocaleIDFormatPart())
                            {
                                formatBuilder += (self.LocaleIDFormatPart().toString())
                            }
                            if (self.ConditionFormatPart())
                            {
                                formatBuilder += (self.ConditionFormatPart().toString())
                            }
                            if (self.ColorFormatPart())
                            {
                                formatBuilder += (self.ColorFormatPart().toString())
                            }
                        }
                        formatBuilder += (self.numberFormat.ExcelCompatibleFormatString())
                    }
                    return formatBuilder.toString()
                };
                CustomNumberFormat.prototype.Formatter = function()
                {
                    return this.numberFormat
                };
                CustomNumberFormat.prototype.DateTimeFormatInfo = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this.Formatter().DateTimeFormatInfo()
                    }
                    else
                    {
                        this.Formatter().DateTimeFormatInfo(value);
                        this.dateTimeFormatInfo = value;
                        return value
                    }
                };
                CustomNumberFormat.prototype.NumberFormatInfo = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this.Formatter().NumberFormatInfo()
                    }
                    else
                    {
                        this.Formatter().NumberFormatInfo(value);
                        this.numberFormatInfo = value;
                        return value
                    }
                };
                CustomNumberFormat.prototype.AddPart = function(part)
                {
                    if (!part)
                    {
                        throw new Error(Sheets.SR.Exp_PartIsNull);
                    }
                    var self = this;
                    if (Sheets.util.isCustomType(part, "ConditionFormatPart"))
                    {
                        if (!self.conditionFormatPart)
                        {
                            self.conditionFormatPart = Sheets.util.asCustomType(part, "ConditionFormatPart");
                            ;
                        }
                        else
                        {
                            throw new Error(Sheets.SR.Exp_DuplicatedDescriptor);
                        }
                    }
                    else if (Sheets.util.isCustomType(part, "ColorFormatPart"))
                    {
                        if (!self.colorFormatPart)
                        {
                            self.colorFormatPart = Sheets.util.asCustomType(part, "ColorFormatPart")
                        }
                        else
                        {
                            throw new Error(Sheets.SR.Exp_DuplicatedDescriptor);
                        }
                    }
                    else if (Sheets.util.isCustomType(part, "LocaleIDFormatPart"))
                    {
                        if (!self.localeIDFormatPart)
                        {
                            self.localeIDFormatPart = Sheets.util.asCustomType(part, "LocaleIDFormatPart")
                        }
                        else
                        {
                            throw new Error(Sheets.SR.Exp_DuplicatedDescriptor);
                        }
                    }
                    else if (Sheets.util.isCustomType(part, "DBNumberFormatPart"))
                    {
                        if (!self.dbNumberFormatPart)
                        {
                            self.dbNumberFormatPart = Sheets.util.asCustomType(part, "DBNumberFormatPart")
                        }
                        else
                        {
                            throw new Error(Sheets.SR.Exp_DuplicatedDescriptor);
                        }
                    }
                };
                CustomNumberFormat.prototype.Format = function(obj)
                {
                    return this.numberFormat.Format(obj)
                };
                CustomNumberFormat.prototype.Parse = function(str)
                {
                    return this.numberFormat.Parse(str)
                };
                return CustomNumberFormat
            })();
        var GeneralFormatter = (function()
            {
                function GeneralFormatter(format, formatMode, cultureName)
                {
                    var self = this;
                    self.formatters = keyword_null;
                    self.formatModeType = 0;
                    self.dateTimeFormatInfo = keyword_null;
                    self.numberFormatInfo = keyword_null;
                    self.isSingleFormatterInfo = true;
                    self.isDefault = true;
                    self.isConstructed = false;
                    self.customerCultureName = keyword_null;
                    self.PropertyChanged = [];
                    self._classNames = ["GeneralFormatter", "IFormatter", "INotifyPropertyChanged", "IColorFormatter"];
                    if (stringEx.IsNullOrEmpty(format))
                    {
                        format = NumberFormatBase.General
                    }
                    if (!formatMode)
                    {
                        formatMode = 0
                    }
                    self.formatCached = format;
                    self.formatModeType = formatMode;
                    self.isDefault = self.formatCached.toLowerCase() === NumberFormatBase.General_Lower;
                    self.isConstructed = false;
                    if (cultureName)
                    {
                        self.customerCultureName = Sheets._CultureInfo.getCulture(cultureName).Name()
                    }
                    else
                    {
                        self.customerCultureName = Sheets._CultureInfo._currentCulture.Name()
                    }
                }
                GeneralFormatter._needChangeDefaultFormat = function(defaultFormat)
                {
                    if (!defaultFormat)
                    {
                        return true
                    }
                    else
                    {
                        var currentCulture = Sheets._CultureInfo._currentCulture.Name().toLowerCase();
                        var oldCulture = defaultFormat.customerCultureName.toLowerCase();
                        if (oldCulture === currentCulture)
                        {
                            return false
                        }
                        else
                        {
                            return true
                        }
                    }
                };
                GeneralFormatter.DefaultNumberFormatter = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultNumberFormatter))
                    {
                        this.defaultNumberFormatter = new GeneralFormatter("###################0.################", 0, Sheets._CultureInfo._currentCulture.Name())
                    }
                    return this.defaultNumberFormatter
                };
                GeneralFormatter.DefaultGeneralFormatter = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultGeneralFormatter))
                    {
                        this.defaultGeneralFormatter = new GeneralFormatter
                    }
                    return this.defaultGeneralFormatter
                };
                GeneralFormatter.DefaultShortDatePatternFormatter = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultShortDatePatternFormatter))
                    {
                        this.defaultShortDatePatternFormatter = new GeneralFormatter(DefaultTokens.DateTimeFormatInfo().shortDatePattern)
                    }
                    return this.defaultShortDatePatternFormatter
                };
                GeneralFormatter.DefaultSXDatetimePatternFormatter = function()
                {
                    var currentFormat = DefaultTokens.DateTimeFormatInfo().shortDatePattern + " " + "h:mm:ss";
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultSXDatetimePatternFormatter))
                    {
                        this.defaultSXDatetimePatternFormatter = new GeneralFormatter(currentFormat)
                    }
                    return this.defaultSXDatetimePatternFormatter
                };
                GeneralFormatter.DefaultLongTimePatternFormatter = function()
                {
                    var currentFormat = DefaultTokens.DateTimeFormatInfo().longTimePattern;
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultLongTimePatternFormatter))
                    {
                        this.defaultLongTimePatternFormatter = new GeneralFormatter(currentFormat)
                    }
                    return this.defaultLongTimePatternFormatter
                };
                GeneralFormatter.DefaultDMMMFormatter = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultDMMMFormatter))
                    {
                        this.defaultDMMMFormatter = new GeneralFormatter("d-mmm", 0, Sheets._CultureInfo._currentCulture.Name())
                    }
                    return this.defaultDMMMFormatter
                };
                GeneralFormatter.DefaultMMMYYFormatter = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultMMMYYFormatter))
                    {
                        this.defaultMMMYYFormatter = new GeneralFormatter("mmm-yy", 0, Sheets._CultureInfo._currentCulture.Name())
                    }
                    return this.defaultMMMYYFormatter
                };
                GeneralFormatter.DefaultHMMFormatter = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultHMMFormatter))
                    {
                        this.defaultHMMFormatter = new GeneralFormatter("h:mm", 0, Sheets._CultureInfo._currentCulture.Name())
                    }
                    return this.defaultHMMFormatter
                };
                GeneralFormatter.DefaultHMMSSFormatter = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultHMMSSFormatter))
                    {
                        this.defaultHMMSSFormatter = new GeneralFormatter("h:mm:ss", 0, Sheets._CultureInfo._currentCulture.Name())
                    }
                    return this.defaultHMMSSFormatter
                };
                GeneralFormatter.DefaultHMMSS0Formatter = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultHMMSS0Formatter))
                    {
                        this.defaultHMMSS0Formatter = new GeneralFormatter("h:mm:ss.0", 0, Sheets._CultureInfo._currentCulture.Name())
                    }
                    return this.defaultHMMSS0Formatter
                };
                GeneralFormatter.DefaultComboNumberFormatter1 = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultComboNumberFormatter1))
                    {
                        this.defaultComboNumberFormatter1 = new GeneralFormatter(stringEx.Format("{0}#,##0.00;[Red]({0}#,##0.00)", DefaultTokens.NumberFormatInfo().currencySymbol))
                    }
                    return this.defaultComboNumberFormatter1
                };
                GeneralFormatter.DefaultComboNumberFormatter2 = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultComboNumberFormatter2))
                    {
                        this.defaultComboNumberFormatter2 = new GeneralFormatter(stringEx.Format("{0}#,##0;[Red]({0}#,##0)", DefaultTokens.NumberFormatInfo().currencySymbol))
                    }
                    return this.defaultComboNumberFormatter2
                };
                GeneralFormatter.DefaultStandardNumberFormatter = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultStandardNumberFormatter))
                    {
                        this.defaultStandardNumberFormatter = new GeneralFormatter("0.00E+00", 0, Sheets._CultureInfo._currentCulture.Name())
                    }
                    return this.defaultStandardNumberFormatter
                };
                GeneralFormatter.DefaultStandardPercentFormatter1 = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultStandardPercentFormatter1))
                    {
                        this.defaultStandardPercentFormatter1 = new GeneralFormatter("0.00%", 0, Sheets._CultureInfo._currentCulture.Name())
                    }
                    return this.defaultStandardPercentFormatter1
                };
                GeneralFormatter.DefaultStandardPercentFormatter2 = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultStandardPercentFormatter2))
                    {
                        this.defaultStandardPercentFormatter2 = new GeneralFormatter("0%", 0, Sheets._CultureInfo._currentCulture.Name())
                    }
                    return this.defaultStandardPercentFormatter2
                };
                GeneralFormatter.DefaultStandardGroupNumberFormatter1 = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultStandardGroupNumberFormatter1))
                    {
                        this.defaultStandardGroupNumberFormatter1 = new GeneralFormatter("#,##0.00", 0, Sheets._CultureInfo._currentCulture.Name())
                    }
                    return this.defaultStandardGroupNumberFormatter1
                };
                GeneralFormatter.DefaultStandardGroupNumberFormatter2 = function()
                {
                    if (GeneralFormatter._needChangeDefaultFormat(this.defaultStandardGroupNumberFormatter2))
                    {
                        this.defaultStandardGroupNumberFormatter2 = new GeneralFormatter("#,##0", 0, Sheets._CultureInfo._currentCulture.Name())
                    }
                    return this.defaultStandardGroupNumberFormatter2
                };
                GeneralFormatter.prototype.findDateTimeGeneralFormatter = function(s, v, formatter, foundCallback)
                {
                    if (formatter && formatter.length > 0)
                    {
                        for (var k in formatter)
                        {
                            if (formatter.hasOwnProperty(k))
                            {
                                var f = formatter[k];
                                var dt = Sheets._DateTimeHelper.parseLocale(s, f);
                                if (dt && (dt - v === 0))
                                {
                                    return foundCallback()
                                }
                            }
                        }
                    }
                    return keyword_null
                };
                GeneralFormatter.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            formatModeType: self.formatModeType, customerCultureName: self.customerCultureName, formatCached: self.formatCached
                        };
                    var jsData = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            jsData[item] = value
                        }
                    }
                    return jsData
                };
                GeneralFormatter.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"formatModeType":
                            return value === 0;
                        case"formatCached":
                            return value === "General";
                        default:
                            return false
                    }
                };
                GeneralFormatter.prototype.HasFormatedColor = function()
                {
                    var self = this;
                    if (self.isDefault)
                    {
                        return false
                    }
                    if (self.PositiveExpression() && self.PositiveExpression().ColorFormatPart())
                    {
                        return true
                    }
                    if (self.NegativeExpression() && self.NegativeExpression().ColorFormatPart())
                    {
                        return true
                    }
                    if (self.ZeroExpression() && self.ZeroExpression().ColorFormatPart())
                    {
                        return true
                    }
                    if (self.TextExpression() && self.TextExpression().ColorFormatPart())
                    {
                        return true
                    }
                    return false
                };
                GeneralFormatter.prototype.IsDefaultFormat = function()
                {
                    return this.isDefault
                };
                GeneralFormatter.prototype.FormatString = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        self.Init();
                        var formatStringBuilder = keyword_null;
                        switch (self.FormatMode())
                        {
                            case 0:
                                if (self.formatters)
                                {
                                    for (var index = 0; index < self.formatters.length; index++)
                                    {
                                        var formatter = self.formatters[index];
                                        if (Sheets.util.isCustomType(formatter, "CustomNumberFormat"))
                                        {
                                            if (formatStringBuilder == keyword_null)
                                            {
                                                formatStringBuilder = ""
                                            }
                                            else
                                            {
                                                formatStringBuilder += (DefaultTokens.FormatSeparator)
                                            }
                                            var formatTemp = formatter.FormatString();
                                            formatStringBuilder += (formatTemp)
                                        }
                                    }
                                }
                                break;
                            case 1:
                                if (Sheets.util.isCustomType(self.formatters[0], "StandardDateTimeFormatter"))
                                {
                                    return self.formatters[0].FormatString()
                                }
                                break;
                            case 2:
                                if (Sheets.util.isCustomType(self.formatters[0], "StandardNumberFormatter"))
                                {
                                    return self.formatters[0].FormatString()
                                }
                                break
                        }
                        if (formatStringBuilder)
                        {
                            return formatStringBuilder
                        }
                        else
                        {
                            return stringEx.Empty
                        }
                    }
                    else
                    {
                        if (!value)
                        {
                            throw new Error(Sheets.SR.Exp_ValueIsNull);
                        }
                        self.formatters = keyword_null;
                        self.formatCached = value;
                        self.isDefault = self.formatCached.toLowerCase() === NumberFormatBase.General_Lower;
                        self.isConstructed = false;
                        self.Init();
                        self.RaisePropertyChanged("FormatString")
                    }
                };
                GeneralFormatter.prototype.DateTimeFormatInfo = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        self.Init();
                        if (self.dateTimeFormatInfo)
                        {
                            return self.dateTimeFormatInfo
                        }
                        return DefaultTokens.DateTimeFormatInfo()
                    }
                    else
                    {
                        self.Init();
                        self.dateTimeFormatInfo = value;
                        if (self.formatters)
                        {
                            for (var index = 0; index < self.formatters.length; index++)
                            {
                                var formatter = self.formatters[index];
                                if (Sheets.util.isCustomType(formatter, "IFormatProviderSupport"))
                                {
                                    var formaterTmp = formatter;
                                    formaterTmp.DateTimeFormatInfo(value)
                                }
                            }
                        }
                        self.RaisePropertyChanged("DateTimeFormatInfo");
                        return value
                    }
                };
                GeneralFormatter.prototype.NumberFormatInfo = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        self.Init();
                        if (self.numberFormatInfo)
                        {
                            return self.numberFormatInfo
                        }
                        return DefaultTokens.NumberFormatInfo()
                    }
                    else
                    {
                        self.Init();
                        self.numberFormatInfo = value;
                        if (self.formatters)
                        {
                            for (var index = 0; index < self.formatters.length; index++)
                            {
                                var formatter = self.formatters[index];
                                if (Sheets.util.isCustomType(formatter, "IFormatProviderSupport"))
                                {
                                    var formaterTmp = formatter;
                                    formaterTmp.NumberFormatInfo(value)
                                }
                            }
                        }
                        self.RaisePropertyChanged("NumberFormatInfo");
                        return value
                    }
                };
                GeneralFormatter.prototype.FormatMode = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this.formatModeType
                    }
                    else
                    {
                        this.formatModeType = value;
                        this.RaisePropertyChanged("FormatMode");
                        return value
                    }
                };
                GeneralFormatter.prototype.ExcelCompatibleFormatString = function()
                {
                    var self = this;
                    self.Init();
                    var formatStringBuilder = keyword_null;
                    switch (self.FormatMode())
                    {
                        case 0:
                            if (self.formatters)
                            {
                                for (var index = 0; index < self.formatters.length; index++)
                                {
                                    var formatter = self.formatters[index];
                                    if (Sheets.util.isCustomType(formatter, "CustomNumberFormat"))
                                    {
                                        if (formatStringBuilder == keyword_null)
                                        {
                                            formatStringBuilder = ""
                                        }
                                        else
                                        {
                                            formatStringBuilder += (DefaultTokens.FormatSeparator)
                                        }
                                        var formatTemp = formatter.ExcelCompatibleFormatString();
                                        formatStringBuilder += (formatTemp)
                                    }
                                }
                            }
                            break;
                        case 1:
                            if (Sheets.util.isCustomType(self.formatters[0], "StandardDateTimeFormatter"))
                            {
                                return self.formatters[0].ExcelCompatibleFormatString()
                            }
                            break;
                        case 2:
                            if (Sheets.util.isCustomType(self.formatters[0], "StandardNumberFormatter"))
                            {
                                return self.formatters[0].ExcelCompatibleFormatString()
                            }
                            break
                    }
                    if (formatStringBuilder)
                    {
                        return formatStringBuilder.toString()
                    }
                    else
                    {
                        return stringEx.Empty
                    }
                };
                GeneralFormatter.prototype.PositiveExpression = function()
                {
                    var self = this;
                    self.Init();
                    if (self.formatters && self.formatters.length > 0)
                    {
                        return Sheets.util.asCustomType(self.formatters[0], "CustomNumberFormat")
                    }
                    return keyword_null
                };
                GeneralFormatter.prototype.NegativeExpression = function()
                {
                    var self = this;
                    self.Init();
                    if (self.formatters && self.formatters.length > 1)
                    {
                        return Sheets.util.asCustomType(self.formatters[1], "CustomNumberFormat")
                    }
                    return keyword_null
                };
                GeneralFormatter.prototype.ZeroExpression = function()
                {
                    var self = this;
                    self.Init();
                    if (self.formatters && self.formatters.length > 2)
                    {
                        return Sheets.util.asCustomType(self.formatters[2], "CustomNumberFormat")
                    }
                    return keyword_null
                };
                GeneralFormatter.prototype.TextExpression = function()
                {
                    var self = this;
                    self.Init();
                    if (self.formatters && self.formatters.length > 3)
                    {
                        return Sheets.util.asCustomType(self.formatters[3], "CustomNumberFormat")
                    }
                    return keyword_null
                };
                GeneralFormatter.prototype.GetFormatType = function(obj)
                {
                    this.Init();
                    var formatInfo = this.GetFormatInfo(obj);
                    if (Sheets.util.isCustomType(formatInfo, "CustomNumberFormat"))
                    {
                        var customFormat = formatInfo.Formatter();
                        if (Sheets.util.isCustomType(customFormat, "NumberFormatDigital"))
                        {
                            return 1
                        }
                        else if (Sheets.util.isCustomType(customFormat, "NumberFormatDateTime"))
                        {
                            return 2
                        }
                        else if (Sheets.util.isCustomType(customFormat, "NumberFormatText"))
                        {
                            return 3
                        }
                    }
                    else
                    {
                        if (Sheets.util.isCustomType(formatInfo, "NumberFormatDigital") || Sheets.util.isCustomType(formatInfo, "StandardNumberFormatter"))
                        {
                            return 1
                        }
                        else if (Sheets.util.isCustomType(formatInfo, "NumberFormatDateTime") || Sheets.util.isCustomType(formatInfo, "StandardDateTimeFormatter"))
                        {
                            return 2
                        }
                        else if (Sheets.util.isCustomType(formatInfo, "NumberFormatText"))
                        {
                            return 3
                        }
                    }
                    return 0
                };
                GeneralFormatter.prototype.GetPreferredEditingFormatter = function(obj)
                {
                    this.Init();
                    if (Sheets.util.isType(obj, "DateTime"))
                    {
                        var dt = new Sheets._DateTimeHelper(obj);
                        if (dt.Hour() === 0 && dt.Minute() === 0 && dt.Second() === 0 && dt.Millisecond() === 0)
                        {
                            return GeneralFormatter.DefaultShortDatePatternFormatter()
                        }
                        else
                        {
                            return GeneralFormatter.DefaultSXDatetimePatternFormatter()
                        }
                    }
                    else if (Sheets.util.isType(obj, "TimeSpan"))
                    {
                        return GeneralFormatter.DefaultLongTimePatternFormatter()
                    }
                    else if (Sheets.FormatConverter.IsNumber(obj))
                    {
                        var value = Sheets.FormatConverter.ToDouble(obj);
                        if (value > 1E20)
                        {
                            return new GeneralFormatter("0.##E+00")
                        }
                        else
                        {
                            return GeneralFormatter.DefaultNumberFormatter()
                        }
                    }
                    else if (Sheets.util.isType(obj, "string"))
                    {
                        return GeneralFormatter.DefaultGeneralFormatter()
                    }
                    else
                    {
                        return GeneralFormatter.DefaultGeneralFormatter()
                    }
                };
                GeneralFormatter.prototype.GetPreferredDisplayFormatter = function(s, valueRef)
                {
                    var self = this;
                    if (!valueRef)
                    {
                        valueRef = {value: keyword_null}
                    }
                    valueRef.value = keyword_null;
                    self.Init();
                    if (stringEx.IsNullOrEmpty(s))
                    {
                        return new GeneralFormatter
                    }
                    var strTemp = s;
                    var v = (valueRef.value = self.Parse(strTemp));
                    if (Sheets.util.isType(v, "DateTime") || Sheets.util.isType(v, "TimeSpan"))
                    {
                        var result;
                        if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralMonthDay(), function()
                        {
                            return GeneralFormatter.DefaultDMMMFormatter()
                        })))
                        {
                            return result
                        }
                        if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralYearMonth(), function()
                        {
                            return GeneralFormatter.DefaultMMMYYFormatter()
                        })))
                        {
                            return result
                        }
                        if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralYearMonthDay(), function()
                        {
                            return GeneralFormatter.DefaultShortDatePatternFormatter()
                        })))
                        {
                            return result
                        }
                        if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralHourMinute(), function()
                        {
                            return GeneralFormatter.DefaultHMMFormatter()
                        })))
                        {
                            return result
                        }
                        if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralHourMinuteSecond(), function()
                        {
                            return GeneralFormatter.DefaultHMMSSFormatter()
                        })))
                        {
                            return result
                        }
                        if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralHourMinuteSecondSubSecond(), function()
                        {
                            return GeneralFormatter.DefaultHMMSS0Formatter()
                        })))
                        {
                            return result
                        }
                        if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralHourMinuteWithDate(), function()
                        {
                            if (GeneralFormatter._needChangeDefaultFormat(GeneralFormatter.defaultShortDatePatternHMMFormatter))
                            {
                                GeneralFormatter.defaultShortDatePatternHMMFormatter = new GeneralFormatter(self.DateTimeFormatInfo().shortDatePattern + " " + "h:mm")
                            }
                            return GeneralFormatter.defaultShortDatePatternHMMFormatter
                        })))
                        {
                            return result
                        }
                        if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralHourMinuteSecondWithDate(), function()
                        {
                            if (GeneralFormatter._needChangeDefaultFormat(GeneralFormatter.defaultShortDatePatternHMMSSFormatter))
                            {
                                GeneralFormatter.defaultShortDatePatternHMMSSFormatter = new GeneralFormatter(self.DateTimeFormatInfo().shortDatePattern + " " + "h:mm:ss")
                            }
                            return GeneralFormatter.defaultShortDatePatternHMMSSFormatter
                        })))
                        {
                            return result
                        }
                        if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralHourMinuteSecondSubSecondWithDate(), function()
                        {
                            if (GeneralFormatter._needChangeDefaultFormat(GeneralFormatter.defaultShortDatePatternHMMSS0Formatter))
                            {
                                GeneralFormatter.defaultShortDatePatternHMMSS0Formatter = new GeneralFormatter(self.DateTimeFormatInfo().shortDatePattern + " " + "h:mm:ss.0")
                            }
                            return GeneralFormatter.defaultShortDatePatternHMMSS0Formatter
                        })))
                        {
                            return result
                        }
                    }
                    else if (Sheets.FormatConverter.IsNumber(v))
                    {
                        if (strTemp[0] === DefaultTokens.NumberFormatInfo().currencySymbol[0])
                        {
                            if (Sheets.StringHelper.Contains(strTemp, DefaultTokens.DecimalSeparator))
                            {
                                return GeneralFormatter.DefaultComboNumberFormatter1()
                            }
                            else
                            {
                                return GeneralFormatter.DefaultComboNumberFormatter2()
                            }
                        }
                        else if (Sheets.StringHelper.IndexOf(strTemp, "e", 1) > -1)
                        {
                            return GeneralFormatter.DefaultStandardNumberFormatter()
                        }
                        else if (strTemp[0].toString() === DefaultTokens.percentSymbol || strTemp[strTemp.length - 1].toString() === DefaultTokens.percentSymbol)
                        {
                            if (Sheets.StringHelper.Contains(strTemp, DefaultTokens.DecimalSeparator))
                            {
                                return GeneralFormatter.DefaultStandardPercentFormatter1()
                            }
                            else
                            {
                                return GeneralFormatter.DefaultStandardPercentFormatter2()
                            }
                        }
                        else if (Sheets.StringHelper.Contains(strTemp, DefaultTokens.numberGroupSeparator))
                        {
                            if (Sheets.StringHelper.Contains(strTemp, DefaultTokens.DecimalSeparator))
                            {
                                return GeneralFormatter.DefaultStandardGroupNumberFormatter1()
                            }
                            else
                            {
                                return GeneralFormatter.DefaultStandardGroupNumberFormatter2()
                            }
                        }
                    }
                    return GeneralFormatter.DefaultGeneralFormatter()
                };
                GeneralFormatter.prototype.Format = function(obj, conditionalForeColor)
                {
                    if (Sheets.util.isType(obj, 'boolean'))
                    {
                        return obj.toString().toUpperCase()
                    }
                    if (conditionalForeColor)
                    {
                        conditionalForeColor.value = keyword_null
                    }
                    this.Init();
                    var formatInfo = this.GetFormatInfo(obj);
                    if (Sheets.util.isCustomType(formatInfo, "CustomNumberFormat"))
                    {
                        var colorPart = formatInfo.ColorFormatPart();
                        if (conditionalForeColor && colorPart)
                        {
                            conditionalForeColor.value = colorPart.ForeColor()
                        }
                    }
                    var value = 0;
                    var isNumber = Sheets.FormatConverter.IsNumber(obj);
                    if (isNumber)
                    {
                        value = Sheets.FormatConverter.ToDouble(obj)
                    }
                    if (formatInfo)
                    {
                        var result = keyword_null;
                        if (isNumber && formatInfo === this.NegativeExpression())
                        {
                            result = formatInfo.Format(Math_abs(value));
                            if (Sheets.util.isCustomType(formatInfo, "CustomNumberFormat"))
                            {
                                var cf = Sheets.util.asCustomType(formatInfo, "CustomNumberFormat");
                                if (cf && cf.ConditionFormatPart() && cf.ConditionFormatPart().Value() > 0 && value < 0)
                                {
                                    result = DefaultTokens.negativeSign + result
                                }
                            }
                        }
                        else
                        {
                            try
                            {
                                result = formatInfo.Format(obj)
                            }
                            catch(Exception)
                            {
                                if (Sheets.util.isType(obj, "string"))
                                {
                                    result = obj.toString()
                                }
                            }
                        }
                        if (result)
                        {
                            return result
                        }
                        else
                        {
                            return stringEx.Empty
                        }
                    }
                    else
                    {
                        if (isNumber && value < 0)
                        {
                            return DefaultTokens.HyphenMinus.toString()
                        }
                        else
                        {
                            if (Sheets.util.isType(obj, "string"))
                            {
                                return obj.toString()
                            }
                            else
                            {
                                return (obj === keyword_undefined || obj === keyword_null) ? stringEx.Empty : obj.toString()
                            }
                        }
                    }
                };
                GeneralFormatter.prototype.Parse = function(str)
                {
                    var self = this;
                    self.Init();
                    if (self.formatters && self.formatters.length > 0)
                    {
                        return self.formatters[0].Parse(str)
                    }
                    return keyword_null
                };
                GeneralFormatter.prototype.Init = function()
                {
                    var self = this;
                    if (!self.isConstructed)
                    {
                        self.isConstructed = true;
                        switch (self.formatModeType)
                        {
                            case 0:
                                self.InitExcelCompatibleMode(self.formatCached);
                                break;
                            case 1:
                                self.InitStandardDateTimeMode(self.formatCached);
                                break;
                            case 2:
                                self.InitStandardNumericMode(self.formatCached);
                                break
                        }
                    }
                };
                GeneralFormatter.prototype.InitStandardDateTimeMode = function(format)
                {
                    var formatter = new _StandardDateTimeFormatter(format);
                    if (formatter.EvaluateFormat(format))
                    {
                        this.formatters = [];
                        this.formatters.push(formatter)
                    }
                    else
                    {
                        throw new Error(Sheets.SR.Exp_FormatIllegal);
                    }
                };
                GeneralFormatter.prototype.InitStandardNumericMode = function(format)
                {
                    var formatter = new _StandardNumberFormatter(format);
                    if (formatter.EvaluateFormat(format))
                    {
                        this.formatters = [];
                        this.formatters.push(formatter)
                    }
                    else
                    {
                        throw new Error(Sheets.SR.Exp_FormatIllegal);
                    }
                };
                GeneralFormatter.prototype.InitExcelCompatibleMode = function(format)
                {
                    if (stringEx.IsNullOrEmpty(format))
                    {
                        throw new Error(Sheets.SR.Exp_FormatIllegal);
                    }
                    var self = this;
                    self.formatters = [];
                    if (self.isDefault)
                    {
                        self.formatters.push(new CustomNumberFormat)
                    }
                    else
                    {
                        self.isSingleFormatterInfo = !Sheets.StringHelper.Contains(format, DefaultTokens.FormatSeparator.toString());
                        var items = format.split(DefaultTokens.FormatSeparator);
                        if (!items)
                        {
                            throw new Error(Sheets.SR.Exp_FormatIllegal);
                        }
                        if (items.length < 1 || items.length > 5)
                        {
                            throw new Error(Sheets.SR.Exp_FormatIllegal);
                        }
                        var count = 0;
                        for (var index = 0; index < items.length; index++)
                        {
                            count++;
                            if (count > 4)
                            {
                                break
                            }
                            var formatItem = new CustomNumberFormat(items[index], self.customerCultureName);
                            if (formatItem)
                            {
                                self.formatters.push(formatItem)
                            }
                        }
                        if (!self.PositiveExpression())
                        {
                            throw new Error(Sheets.SR.Exp_FormatIllegal);
                        }
                    }
                };
                GeneralFormatter.prototype.GetFormatInfo = function(obj)
                {
                    var self = this;
                    if (self.FormatMode() === 0)
                    {
                        if (typeof(obj) === "string" && isNaN(obj))
                        {
                            if (self.TextExpression())
                            {
                                return self.TextExpression()
                            }
                            else
                            {
                                return self.PositiveExpression()
                            }
                        }
                        else if (Sheets.FormatConverter.IsNumber(obj) || Sheets.util.isType(obj, "boolean"))
                        {
                            var positive = self.PositiveExpression();
                            var negative = self.NegativeExpression();
                            var value = Sheets.FormatConverter.ToDouble(obj);
                            var positiveHasCondition = positive && positive.ConditionFormatPart();
                            var negativeHasCondition = negative && negative.ConditionFormatPart();
                            var resultFormatter = self.isSingleFormatterInfo ? positive : keyword_null;
                            if (positive)
                            {
                                if (positiveHasCondition)
                                {
                                    if (positive.ConditionFormatPart().IsMeetCondition(value))
                                    {
                                        resultFormatter = positive
                                    }
                                }
                                else
                                {
                                    if (value > 0 || (value === 0 && !self.ZeroExpression()))
                                    {
                                        resultFormatter = positive
                                    }
                                }
                            }
                            if (!resultFormatter && self.NegativeExpression())
                            {
                                if (negativeHasCondition)
                                {
                                    if (negative.ConditionFormatPart().IsMeetCondition(value))
                                    {
                                        resultFormatter = negative
                                    }
                                }
                                else
                                {
                                    if (value < 0)
                                    {
                                        resultFormatter = negative
                                    }
                                }
                            }
                            if (!resultFormatter && self.ZeroExpression())
                            {
                                if (value === 0)
                                {
                                    resultFormatter = self.ZeroExpression()
                                }
                            }
                            if (!resultFormatter && self.ZeroExpression())
                            {
                                resultFormatter = self.ZeroExpression()
                            }
                            if (!resultFormatter && self.NegativeExpression())
                            {
                                resultFormatter = self.NegativeExpression()
                            }
                            return resultFormatter
                        }
                    }
                    else if (self.FormatMode() === 1 || self.FormatMode() === 2)
                    {
                        if (self.formatters && self.formatters.length === 1)
                        {
                            return self.formatters[0]
                        }
                    }
                    return keyword_null
                };
                GeneralFormatter.prototype.RaisePropertyChanged = function(propertyName)
                {
                    var self = this;
                    if (self.PropertyChanged)
                    {
                        for (var index = 0; index < self.PropertyChanged.length; index++)
                        {
                            var method = self.PropertyChanged[index];
                            if (typeof(method) === "function")
                            {
                                method(self, propertyName)
                            }
                        }
                    }
                };
                GeneralFormatter.defaultNumberFormatter = keyword_null;
                GeneralFormatter.defaultGeneralFormatter = keyword_null;
                GeneralFormatter.defaultShortDatePatternFormatter = keyword_null;
                GeneralFormatter.defaultLongTimePatternFormatter = keyword_null;
                GeneralFormatter.defaultSXDatetimePatternFormatter = keyword_null;
                GeneralFormatter.defaultDMMMFormatter = keyword_null;
                GeneralFormatter.defaultMMMYYFormatter = keyword_null;
                GeneralFormatter.defaultHMMFormatter = keyword_null;
                GeneralFormatter.defaultHMMSSFormatter = keyword_null;
                GeneralFormatter.defaultHMMSS0Formatter = keyword_null;
                GeneralFormatter.defaultShortDatePatternHMMFormatter = keyword_null;
                GeneralFormatter.defaultShortDatePatternHMMSSFormatter = keyword_null;
                GeneralFormatter.defaultShortDatePatternHMMSS0Formatter = keyword_null;
                GeneralFormatter.defaultComboNumberFormatter1 = keyword_null;
                GeneralFormatter.defaultComboNumberFormatter2 = keyword_null;
                GeneralFormatter.defaultStandardNumberFormatter = keyword_null;
                GeneralFormatter.defaultStandardPercentFormatter1 = keyword_null;
                GeneralFormatter.defaultStandardPercentFormatter2 = keyword_null;
                GeneralFormatter.defaultStandardGroupNumberFormatter1 = keyword_null;
                GeneralFormatter.defaultStandardGroupNumberFormatter2 = keyword_null;
                return GeneralFormatter
            })();
        Sheets.GeneralFormatter = GeneralFormatter;
        var FormatPartBase = (function()
            {
                function FormatPartBase(token)
                {
                    this._classNames = ["FormatPartBase"];
                    this.originalToken = token
                }
                FormatPartBase.prototype.OriginalToken = function()
                {
                    return this.originalToken
                };
                FormatPartBase.prototype.SupportedPartFormat = function()
                {
                    if (!FormatPartBase._supportedPartFormat)
                    {
                        FormatPartBase._supportedPartFormat = ["ConditionFormatPart", "ColorFormatPart", "LocaleIDFormatPart"]
                    }
                    return FormatPartBase._supportedPartFormat
                };
                FormatPartBase.Create = function(token)
                {
                    if (ConditionFormatPart.EvaluateFormat(token))
                    {
                        return new ConditionFormatPart(token)
                    }
                    else if (DBNumberFormatPart.EvaluateFormat(token))
                    {
                        return new DBNumberFormatPart(token)
                    }
                    else if (LocaleIDFormatPart.EvaluateFormat(token))
                    {
                        return new LocaleIDFormatPart(token)
                    }
                    else if (ABSTimeFormatPart.EvaluateFormat(token))
                    {
                        return new ABSTimeFormatPart(token)
                    }
                    else if (ColorFormatPart.EvaluateFormat(token))
                    {
                        return new ColorFormatPart(token)
                    }
                    else
                    {
                        return keyword_null
                    }
                };
                return FormatPartBase
            })();
        var ConditionFormatPart = (function(_super)
            {
                __extends(ConditionFormatPart, _super);
                function ConditionFormatPart(token)
                {
                    _super.call(this, token);
                    var self = this;
                    FormatPartBase.call(self, token);
                    self._classNames.push("ConditionFormatPart");
                    self._initFileds();
                    var content = DefaultTokens.TrimSquareBracket(token);
                    if (stringEx.IsNullOrEmpty(content))
                    {
                        throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                    var tokenBuilder = "";
                    var index = 0;
                    var c = keyword_null;
                    for (; index < content.length; index++)
                    {
                        c = content[index];
                        if (DefaultTokens.IsOperator(c))
                        {
                            tokenBuilder += c
                        }
                        else
                        {
                            break
                        }
                    }
                    if (!tokenBuilder)
                    {
                        throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                    var strCompareOperator = tokenBuilder;
                    tokenBuilder = "";
                    switch (strCompareOperator)
                    {
                        case"<":
                            self.compareOperator = 4;
                            break;
                        case"<=":
                            self.compareOperator = 5;
                            break;
                        case"=":
                            self.compareOperator = 0;
                            break;
                        case">=":
                            self.compareOperator = 3;
                            break;
                        case">":
                            self.compareOperator = 2;
                            break;
                        case"<>":
                            self.compareOperator = 1;
                            break;
                        default:
                            throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                    for (; index < content.length; index++)
                    {
                        c = content[index];
                        if (DefaultTokens.IsOperator(c))
                        {
                            throw new Error(Sheets.SR.Exp_TokenIllegal);
                        }
                        tokenBuilder += c
                    }
                    if (!tokenBuilder)
                    {
                        throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                    var strValueNumber = tokenBuilder;
                    var tempValue = parseFloat(strValueNumber);
                    if (!isNaN(tempValue))
                    {
                        self.value = tempValue
                    }
                    else
                    {
                        throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                }
                ConditionFormatPart.prototype._initFileds = function()
                {
                    this.value = 0.0;
                    this.compareOperator = keyword_null
                };
                ConditionFormatPart.prototype.CompareOperator = function()
                {
                    return this.compareOperator
                };
                ConditionFormatPart.prototype.Value = function()
                {
                    return this.value
                };
                ConditionFormatPart.prototype.toString = function()
                {
                    var sb = "";
                    switch (this.compareOperator)
                    {
                        case 0:
                            sb += ("=");
                            break;
                        case 2:
                            sb += (">");
                            break;
                        case 3:
                            sb += (">=");
                            break;
                        case 4:
                            sb += ("<");
                            break;
                        case 5:
                            sb += ("<=");
                            break;
                        case 1:
                            sb += ("<>");
                            break;
                        default:
                            throw new Error;
                    }
                    sb += (this.value.toString());
                    var result = DefaultTokens.AddSquareBracket(sb);
                    return result
                };
                ConditionFormatPart.prototype.IsMeetCondition = function(value)
                {
                    var self = this;
                    switch (self.compareOperator)
                    {
                        case 0:
                            return value === self.value;
                        case 2:
                            return value > self.value;
                        case 3:
                            return value >= self.value;
                        case 4:
                            return value < self.value;
                        case 5:
                            return value <= self.value;
                        case 1:
                            return value !== self.value
                    }
                    return false
                };
                ConditionFormatPart.EvaluateFormat = function(token)
                {
                    if (!token || token === stringEx.Empty)
                    {
                        return false
                    }
                    var content = DefaultTokens.TrimSquareBracket(token);
                    if (!content || content === stringEx.Empty)
                    {
                        return false
                    }
                    return DefaultTokens.IsOperator(content[0])
                };
                return ConditionFormatPart
            })(FormatPartBase);
        var ColorFormatPart = (function(_super)
            {
                __extends(ColorFormatPart, _super);
                function ColorFormatPart(token)
                {
                    _super.call(this, token);
                    this.foreColor = "black";
                    this.index = -1;
                    this.colorName = keyword_null;
                    var self = this;
                    FormatPartBase.call(self, token);
                    self._classNames.push("ColorFormatPart");
                    var content = DefaultTokens.TrimSquareBracket(token);
                    if (!content || content === stringEx.Empty)
                    {
                        throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                    try
                    {
                        self.foreColor = content;
                        self.colorName = content;
                        return
                    }
                    catch(ex) {}
                    if (content.length > "Color".length)
                    {
                        content = Sheets.StringHelper.Remove(content, 0, "Color".length);
                        var index = -1;
                        var tempIndex = parseInt(content, 10);
                        if (!isNaN(tempIndex))
                        {
                            index = tempIndex;
                            if (index >= 1 && index <= 56)
                            {
                                return
                            }
                        }
                    }
                    throw new Error(Sheets.SR.Exp_TokenIllegal);
                }
                ColorFormatPart.prototype.ForeColor = function()
                {
                    return this.foreColor
                };
                ColorFormatPart.prototype.toString = function()
                {
                    var self = this;
                    if (self.index > -1)
                    {
                        return DefaultTokens.AddSquareBracket("Color" + self.index)
                    }
                    else if (self.colorName)
                    {
                        return DefaultTokens.AddSquareBracket(self.colorName)
                    }
                    throw new Error;
                };
                ColorFormatPart.EvaluateFormat = function(token)
                {
                    if (!token || token === stringEx.Empty)
                    {
                        return false
                    }
                    var content = DefaultTokens.TrimSquareBracket(token);
                    if (!content || content === stringEx.Empty)
                    {
                        return false
                    }
                    if (content.length < 3)
                    {
                        return false
                    }
                    if (!isNaN(token[token.length - 1]))
                    {
                        return Sheets.StringHelper.StartsWith(token, "Color", 1)
                    }
                    else
                    {
                        return token[0] !== token[1]
                    }
                };
                return ColorFormatPart
            })(FormatPartBase);
        var ABSTimeFormatPart = (function(_super)
            {
                __extends(ABSTimeFormatPart, _super);
                function ABSTimeFormatPart(token)
                {
                    _super.call(this, token);
                    var self = this;
                    FormatPartBase.call(self, token);
                    self._classNames.push("ABSTimeFormatPart");
                    self._initFileds();
                    if (ABSTimeFormatPart.EvaluateFormat(token))
                    {
                        self.token = token.toLowerCase();
                        if (self.token[1] === ABSTimeFormatPart.HoursABSContent)
                        {
                            self.type = 0
                        }
                        else if (self.token[1] === ABSTimeFormatPart.MinuteABSContent)
                        {
                            self.type = 1
                        }
                        else if (self.token[1] === ABSTimeFormatPart.SecondABSContent)
                        {
                            self.type = 2
                        }
                        else
                        {
                            throw new Error(Sheets.SR.Exp_TokenIllegal);
                        }
                    }
                    else
                    {
                        throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                    var sb = "";
                    for (var n = 0; n < self.token.length - 2; n++)
                    {
                        sb += ("0")
                    }
                    self.formatString = sb
                }
                ABSTimeFormatPart.prototype._initFileds = function()
                {
                    this.token = keyword_null;
                    this.type = keyword_null;
                    this.formatString = keyword_null
                };
                ABSTimeFormatPart.prototype.FormatString = function()
                {
                    return this.formatString
                };
                ABSTimeFormatPart.prototype.TimePartType = function()
                {
                    return this.type
                };
                ABSTimeFormatPart.prototype.Token = function()
                {
                    return this.token
                };
                ABSTimeFormatPart.EvaluateFormat = function(token)
                {
                    if (!token || token === stringEx.Empty)
                    {
                        return false
                    }
                    var content = DefaultTokens.TrimSquareBracket(token);
                    if (!content || content === stringEx.Empty)
                    {
                        return false
                    }
                    content = content.toLowerCase();
                    var c = keyword_null;
                    for (var n = 0; n < content.length; n++)
                    {
                        if (!c)
                        {
                            c = content[n]
                        }
                        var fp = ABSTimeFormatPart;
                        if (c !== fp.HoursABSContent && c !== fp.MinuteABSContent && c !== fp.SecondABSContent)
                        {
                            return false
                        }
                        if (c !== content[n])
                        {
                            return false
                        }
                    }
                    return true
                };
                ABSTimeFormatPart.HoursABSContent = "h";
                ABSTimeFormatPart.MinuteABSContent = "m";
                ABSTimeFormatPart.SecondABSContent = "s";
                return ABSTimeFormatPart
            })(FormatPartBase);
        var DBNumber = (function()
            {
                function DBNumber(units, numbers)
                {
                    var self = this;
                    self._classNames = ["DBNumber"];
                    var key = keyword_null,
                        u = keyword_null;
                    if (units)
                    {
                        self.units = [];
                        for (var i = 0; i < units.length; i++)
                        {
                            u = units[i];
                            if (u === 0)
                            {
                                self.units.push(stringEx.Empty)
                            }
                            else
                            {
                                self.units.push(String.fromCharCode(u))
                            }
                        }
                    }
                    if (numbers)
                    {
                        self.numbers = [];
                        for (var i = 0; i < numbers.length; i++)
                        {
                            u = numbers[i];
                            if (u === 0)
                            {
                                self.numbers.push(stringEx.Empty)
                            }
                            else
                            {
                                self.numbers.push(String.fromCharCode(u))
                            }
                        }
                    }
                }
                DBNumber.JapaneseDBNum1 = function()
                {
                    if (!DBNumber.japaneseDBNum1)
                    {
                        DBNumber.japaneseDBNum1 = new DBNumber(DBNumber.JapaneseNumberUnitLetter1, DBNumber.JapaneseNumberLetterValues1)
                    }
                    return DBNumber.japaneseDBNum1
                };
                DBNumber.JapaneseDBNum2 = function()
                {
                    if (!DBNumber.japaneseDBNum2)
                    {
                        DBNumber.japaneseDBNum2 = new DBNumber(DBNumber.JapaneseNumberUnitLetter2, DBNumber.JapaneseNumberLetterValues2)
                    }
                    return DBNumber.japaneseDBNum2
                };
                DBNumber.JapaneseDBNum3 = function()
                {
                    if (!DBNumber.japaneseDBNum3)
                    {
                        DBNumber.japaneseDBNum3 = new DBNumber(keyword_null, DBNumber.JapaneseNumberLetterValues3)
                    }
                    return DBNumber.japaneseDBNum3
                };
                DBNumber.prototype.Units = function()
                {
                    return this.units
                };
                DBNumber.prototype.Numbers = function()
                {
                    return this.numbers
                };
                DBNumber.japaneseDBNum1 = keyword_null;
                DBNumber.japaneseDBNum2 = keyword_null;
                DBNumber.japaneseDBNum3 = keyword_null;
                DBNumber.JapaneseNumberUnitLetter1 = [0x5343, 0x767e, 0x5341, 0x5146, 0x5343, 0x767e, 0x5341, 0x5104, 0x5343, 0x767e, 0x5341, 0x4e07, 0x5343, 0x767e, 0x5341, 0x0];
                DBNumber.JapaneseNumberUnitLetter2 = [0x9621, 0x767e, 0x62fe, 0x5146, 0x9621, 0x767e, 0x62fe, 0x5104, 0x9621, 0x767e, 0x62fe, 0x842c, 0x9621, 0x767e, 0x62fe, 0x0];
                DBNumber.JapaneseNumberLetterValues1 = [0x3007, 0x4e00, 0x4e8c, 0x4e09, 0x56db, 0x4e94, 0x516d, 0x4e03, 0x516b, 0x4e5d];
                DBNumber.JapaneseNumberLetterValues2 = [0x3007, 0x58f1, 0x5f10, 0x53c2, 0x56db, 0x4f0d, 0x516d, 0x4e03, 0x516b, 0x4e5d];
                DBNumber.JapaneseNumberLetterValues3 = [0xff10, 0xff11, 0xff12, 0xff13, 0xff14, 0xff15, 0xff16, 0xff17, 0xff18, 0xff19];
                return DBNumber
            })();
        var DBNumberFormatPart = (function(_super)
            {
                __extends(DBNumberFormatPart, _super);
                function DBNumberFormatPart(token)
                {
                    _super.call(this, token);
                    this.token = keyword_null;
                    this.type = 0;
                    var self = this;
                    self._classNames.push("DBNumberFormatPart");
                    if (DBNumberFormatPart.EvaluateFormat(token))
                    {
                        self.token = token;
                        var content = DefaultTokens.TrimSquareBracket(token);
                        var strType = Sheets.StringHelper.Remove(content, 0, "dbnum".length);
                        self.type = parseInt(strType, 10);
                        if (self.type < 0 || self.type > 3)
                        {
                            throw new Error(Sheets.SR.Exp_TokenIllegal);
                        }
                    }
                    else
                    {
                        throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                }
                DBNumberFormatPart.prototype.Token = function()
                {
                    if (!this.token)
                    {
                        return stringEx.Empty
                    }
                    return this.token
                };
                DBNumberFormatPart.prototype.Type = function()
                {
                    return this.type
                };
                DBNumberFormatPart.prototype.ReplaceNumberString = function(s, dbNumber, isNumber)
                {
                    if (!s || s === stringEx.Empty)
                    {
                        return s
                    }
                    var strData = s;
                    var str = s;
                    var end = -1;
                    var start = -1;
                    var hasPoint = false;
                    var token = keyword_null;
                    var ret = keyword_null;
                    var formatedNumber = keyword_null;
                    for (var n = s.length - 1; n >= 0; n--)
                    {
                        var c = str[n];
                        if (!isNaN(c) || (DefaultTokens.IsEquals(c, DefaultTokens.DecimalSeparator, false) && !hasPoint))
                        {
                            if (DefaultTokens.IsEquals(c, DefaultTokens.DecimalSeparator, false))
                            {
                                hasPoint = true
                            }
                            if (end === -1)
                            {
                                end = n
                            }
                            start = n
                        }
                        else
                        {
                            if (start > -1 && end > -1)
                            {
                                token = str.substr(start, end - start + 1);
                                ret = parseFloat(token);
                                if (!isNaN(ret))
                                {
                                    formatedNumber = this.NumberString(token, dbNumber, isNumber);
                                    strData = Sheets.StringHelper.Remove(strData, start, end - start + 1);
                                    strData = Sheets.StringHelper.Insert(strData, start, formatedNumber)
                                }
                                end = -1;
                                start = -1;
                                hasPoint = false
                            }
                        }
                    }
                    if (start > -1 && end > -1)
                    {
                        token = str.substr(start, end - start + 1);
                        ret = parseFloat(token);
                        if (!isNaN(ret))
                        {
                            formatedNumber = this.NumberString(token, dbNumber, isNumber);
                            strData = Sheets.StringHelper.Remove(strData, start, end - start + 1);
                            strData = Sheets.StringHelper.Insert(strData, start, formatedNumber)
                        }
                        end = -1;
                        start = -1;
                        hasPoint = false
                    }
                    return strData
                };
                DBNumberFormatPart.prototype.NumberString = function(value, dbNumber, isNumber)
                {
                    var partValues = value.split('.');
                    if (partValues)
                    {
                        if (partValues.length === 1)
                        {
                            return DBNumberFormatPart.FormatNumberString(partValues[0], dbNumber.Numbers(), isNumber ? dbNumber.Units() : keyword_null)
                        }
                        else if (partValues.length === 2)
                        {
                            var integerString = DBNumberFormatPart.FormatNumberString(partValues[0], dbNumber.Numbers(), isNumber ? dbNumber.Units() : keyword_null);
                            var decimalString = DBNumberFormatPart.FormatNumberString(partValues[1], dbNumber.Numbers());
                            return integerString + "." + decimalString
                        }
                    }
                    throw new Error(Sheets.SR.Exp_ValueIllegal);
                };
                DBNumberFormatPart.prototype.toString = function()
                {
                    if (this.type > -1)
                    {
                        return DefaultTokens.AddSquareBracket("DBNum" + this.type)
                    }
                    throw new Error;
                };
                DBNumberFormatPart.EvaluateFormat = function(token)
                {
                    if (!token || token === stringEx.Empty)
                    {
                        return false
                    }
                    var content = DefaultTokens.TrimSquareBracket(token);
                    if (!content || content === stringEx.Empty)
                    {
                        return false
                    }
                    if (Sheets.StringHelper.StartsWith(content, "DBNum", 1))
                    {
                        return true
                    }
                    return false
                };
                DBNumberFormatPart.FormatNumberString = function(value, numbers, units)
                {
                    var strValue = value;
                    var n = 0;
                    var c = keyword_null;
                    var nC = 0;
                    if (arguments.length === 2)
                    {
                        var sb = "";
                        for (n = 0; n < strValue.length; n++)
                        {
                            c = strValue.substr(n, 1);
                            nC = parseInt(c, 10);
                            sb += (numbers[nC])
                        }
                        return sb
                    }
                    else if (arguments.length === 3)
                    {
                        if (!units)
                        {
                            return DBNumberFormatPart.FormatNumberString(value, numbers)
                        }
                        var zeroCount = 0;
                        var result = "";
                        var maxLength = strValue.length;
                        var inZero = false;
                        var numberLetter = [];
                        for (n = 0; n < maxLength; n++)
                        {
                            var validCharIndex = units.length - 1 - n;
                            if (validCharIndex > -1)
                            {
                                numberLetter.push(units[validCharIndex].toString())
                            }
                            else
                            {
                                numberLetter.push(stringEx.Empty)
                            }
                        }
                        var tmpLetters = [];
                        for (var i = numberLetter.length - 1; i >= 0; i--)
                        {
                            tmpLetters[numberLetter.length - i - 1] = numberLetter[i]
                        }
                        numberLetter = tmpLetters;
                        var isZeroAcceptable = false;
                        for (var i = 0; i < maxLength; i++)
                        {
                            c = strValue.substr(i, 1);
                            nC = parseInt(c, 10);
                            var ch1 = stringEx.Empty;
                            var ch2 = stringEx.Empty;
                            if (maxLength - i - 16 > 0)
                            {
                                ch1 = numbers[nC];
                                ch2 = "";
                                isZeroAcceptable = true
                            }
                            else if (i !== (maxLength - 1) && i !== (maxLength - 5) && i !== (maxLength - 9) && i !== (maxLength - 13))
                            {
                                if (c === "0")
                                {
                                    ch1 = "";
                                    ch2 = "";
                                    zeroCount = zeroCount + 1
                                }
                                else
                                {
                                    if (c !== "0" && zeroCount !== 0)
                                    {
                                        ch1 = numbers[0] + numbers[nC];
                                        ch2 = numberLetter[i];
                                        zeroCount = 0
                                    }
                                    else
                                    {
                                        ch1 = numbers[nC];
                                        ch2 = numberLetter[i];
                                        zeroCount = 0
                                    }
                                }
                            }
                            else
                            {
                                if (c !== "0" && zeroCount !== 0)
                                {
                                    ch1 = numbers[0] + numbers[nC];
                                    ch2 = numberLetter[i];
                                    zeroCount = 0
                                }
                                else
                                {
                                    if ((c !== "0" && zeroCount === 0) || isZeroAcceptable)
                                    {
                                        ch1 = numbers[nC];
                                        ch2 = numberLetter[i];
                                        zeroCount = 0;
                                        isZeroAcceptable = false
                                    }
                                    else
                                    {
                                        if (c === "0" && zeroCount >= 3)
                                        {
                                            ch1 = "";
                                            ch2 = "";
                                            zeroCount = zeroCount + 1
                                        }
                                        else
                                        {
                                            if (maxLength >= 11)
                                            {
                                                ch1 = "";
                                                zeroCount = zeroCount + 1
                                            }
                                            else
                                            {
                                                ch1 = "";
                                                ch2 = numberLetter[i];
                                                zeroCount = zeroCount + 1
                                            }
                                        }
                                    }
                                }
                            }
                            var isZero = (ch1 + ch2) === stringEx.Empty;
                            if (!isZero)
                            {
                                inZero = false
                            }
                            if (i === (maxLength - 13) && !inZero)
                            {
                                ch2 = numberLetter[i];
                                inZero = true
                            }
                            if (i === (maxLength - 9) && !inZero)
                            {
                                ch2 = numberLetter[i];
                                inZero = true
                            }
                            if (i === (maxLength - 1))
                            {
                                ch2 = numberLetter[i];
                                inZero = true
                            }
                            result = result + ch1 + ch2
                        }
                        var iValue = parseInt(value, 10);
                        if (!isNaN(iValue))
                        {
                            if (iValue === 0)
                            {
                                return numbers[0]
                            }
                        }
                        return result
                    }
                };
                return DBNumberFormatPart
            })(FormatPartBase);
        var NumberHelper = (function()
            {
                function NumberHelper(){}
                NumberHelper.ParseHexString = function(str)
                {
                    if (!str || str === stringEx.Empty)
                    {
                        throw new Error(Sheets.SR.Exp_StringIllegal);
                    }
                    return parseInt(str, 16)
                };
                NumberHelper.FixJapaneseChars = function(s)
                {
                    return s
                };
                NumberHelper.GetFraction = function(value, denominatorDigits, out_integer, out_numerator, out_denominator)
                {
                    var integer = 0;
                    var numerator = 0;
                    var denominator = 0;
                    var decimalValue = 0;
                    if (value > 0)
                    {
                        decimalValue = value - Math_ceil(value) + 1.0;
                        if (decimalValue == 1.0)
                        {
                            decimalValue = 0;
                            integer = value
                        }
                        else
                            integer = Math_ceil(value) - 1.0
                    }
                    else if (value < 0)
                    {
                        integer = Math_ceil(value);
                        decimalValue = Math_ceil(value) - value
                    }
                    var min = 2;
                    var max = 9;
                    min = Math_pow(10, denominatorDigits - 1);
                    max = Math_pow(10, denominatorDigits) - 1;
                    if (min < 2)
                        min = 2;
                    if (max < 2)
                        max = 2;
                    var isValueSet = false;
                    var lastTriedValue = 0;
                    for (var n = min; n <= max; n++)
                    {
                        var valueTemp = n * decimalValue;
                        var valueIntegerTemp = Math_round(valueTemp);
                        var triedValue = valueIntegerTemp / n;
                        var deviation = Math_abs(triedValue - decimalValue);
                        if (isValueSet ? deviation < Math_abs(lastTriedValue - decimalValue) : true)
                        {
                            isValueSet = true;
                            lastTriedValue = triedValue;
                            numerator = valueIntegerTemp;
                            denominator = n;
                            if (deviation < 0.0005)
                            {
                                break
                            }
                        }
                    }
                    out_integer.value = integer;
                    out_numerator.value = numerator;
                    out_denominator.value = denominator;
                    return isValueSet
                };
                return NumberHelper
            })();
        var CultureHelper = (function()
            {
                function CultureHelper(){}
                CultureHelper.AllowScience = function(cultureName)
                {
                    if (cultureName)
                    {
                        return (!(cultureName.indexOf("ja") === 0) && !(cultureName.indexOf("zh") === 0))
                    }
                    return true
                };
                CultureHelper.CreateCultureInfo = function(cultureID)
                {
                    switch (cultureID)
                    {
                        case 0x0409:
                            return Sheets._CultureInfo.getCulture(CultureHelper.EnglishUnitedStates);
                        case 0x0411:
                            return Sheets._CultureInfo.getCulture(CultureHelper.JapanneseJapan);
                        default:
                            return Sheets._CultureInfo.currentCulture()
                    }
                };
                CultureHelper.JapanneseJapan = "ja-JP";
                CultureHelper.EnglishUnitedStates = "en-US";
                return CultureHelper
            })();
        var LocaleIDFormatPart = (function(_super)
            {
                __extends(LocaleIDFormatPart, _super);
                function LocaleIDFormatPart(token)
                {
                    _super.call(this, token);
                    this.currencySymbol = keyword_null;
                    this.locateID = -1;
                    this.cultureInfo = keyword_null;
                    this.content = keyword_null;
                    var self = this;
                    FormatPartBase.call(self, token);
                    self._classNames.push("LocaleIDFormatPart");
                    if (!token)
                    {
                        throw new Error(Sheets.SR.Exp_TokenIsNull);
                    }
                    if (token === stringEx.Empty)
                    {
                        throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                    self.content = DefaultTokens.TrimSquareBracket(token);
                    var contentTemp = self.content;
                    if (!contentTemp || contentTemp === stringEx.Empty)
                    {
                        throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                    if (DefaultTokens.IsEquals(contentTemp[0], DefaultTokens.Dollar, false))
                    {
                        contentTemp = Sheets.StringHelper.Remove(contentTemp, 0, 1)
                    }
                    else
                    {
                        throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                    var minus = contentTemp.indexOf(DefaultTokens.HyphenMinus);
                    if (minus > -1)
                    {
                        self.currencySymbol = contentTemp.substr(0, minus);
                        contentTemp = Sheets.StringHelper.Remove(contentTemp, 0, minus)
                    }
                    else
                    {
                        self.currencySymbol = contentTemp;
                        return
                    }
                    if (DefaultTokens.IsEquals(contentTemp[0], DefaultTokens.HyphenMinus, false))
                    {
                        contentTemp = Sheets.StringHelper.Remove(contentTemp, 0, 1)
                    }
                    else
                    {
                        throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                    if (contentTemp.length > 0)
                    {
                        self.locateID = NumberHelper.ParseHexString(contentTemp)
                    }
                    else
                    {
                        throw new Error(Sheets.SR.Exp_TokenIllegal);
                    }
                }
                LocaleIDFormatPart.prototype.CultureInfo = function()
                {
                    var self = this;
                    if (!self.cultureInfo)
                    {
                        self.cultureInfo = CultureHelper.CreateCultureInfo(self.locateID);
                        if (self.currencySymbol && self.currencySymbol !== stringEx.Empty)
                        {
                            if (self.cultureInfo && !self.cultureInfo.NumberFormat().isReadOnly)
                            {
                                self.cultureInfo.NumberFormat().currencySymbol = self.currencySymbol
                            }
                        }
                    }
                    return self.cultureInfo
                };
                LocaleIDFormatPart.prototype.CurrencySymbol = function()
                {
                    if (this.currencySymbol)
                    {
                        return this.EncodeSymbol(this.currencySymbol)
                    }
                    return stringEx.Empty
                };
                LocaleIDFormatPart.prototype.AllowScience = function()
                {
                    if (this.cultureInfo)
                    {
                        return CultureHelper.AllowScience(this.cultureInfo.Name())
                    }
                };
                LocaleIDFormatPart.prototype.GetDBNumber = function(type)
                {
                    var regionID = this.locateID & 0x00ff;
                    switch (regionID)
                    {
                        case 0x11:
                            switch (type)
                            {
                                case 1:
                                    return DBNumber.JapaneseDBNum1();
                                case 2:
                                    return DBNumber.JapaneseDBNum2();
                                case 3:
                                    return DBNumber.JapaneseDBNum3()
                            }
                            break;
                        default:
                            break
                    }
                    return keyword_null
                };
                LocaleIDFormatPart.prototype.toString = function()
                {
                    if (this.content)
                    {
                        return DefaultTokens.AddSquareBracket(this.content)
                    }
                    return stringEx.Empty
                };
                LocaleIDFormatPart.prototype.EncodeSymbol = function(symbol)
                {
                    return Sheets.StringHelper.Replace(symbol, "\\.", "'.'")
                };
                LocaleIDFormatPart.EvaluateFormat = function(token)
                {
                    if (!token || token === stringEx.Empty)
                    {
                        return false
                    }
                    var content = DefaultTokens.TrimSquareBracket(token);
                    if (!content || content === stringEx.Empty)
                    {
                        return false
                    }
                    return DefaultTokens.IsEquals(content[0], DefaultTokens.Dollar, false)
                };
                return LocaleIDFormatPart
            })(FormatPartBase);
        var DefaultDateTimeNumberStringConverter = (function()
            {
                function DefaultDateTimeNumberStringConverter(){}
                DefaultDateTimeNumberStringConverter.prototype.ConvertTo = function(num, value, isGeneralNumber, locale, dbNumber)
                {
                    var strTemp = num;
                    if (locale != keyword_null && dbNumber != keyword_null && value instanceof Date)
                    {
                        var dbNumberTemp = locale.GetDBNumber(dbNumber.Type());
                        strTemp = dbNumber.ReplaceNumberString(strTemp, dbNumberTemp, true);
                        strTemp = strTemp.replace(DefaultTokens.ReplacePlaceholder + NumberFormatDateTime.YearFourDigit, new Sheets._DateTimeHelper(value).localeFormat(NumberFormatDateTime.YearFourDigit));
                        strTemp = strTemp.replace(DefaultTokens.ReplacePlaceholder + NumberFormatDateTime.YearTwoDigit, new Sheets._DateTimeHelper(value).localeFormat(NumberFormatDateTime.YearTwoDigit));
                        strTemp = dbNumber.ReplaceNumberString(strTemp, dbNumberTemp, false)
                    }
                    return strTemp
                };
                return DefaultDateTimeNumberStringConverter
            })();
        var NumberFormatDateTime = (function(_super)
            {
                __extends(NumberFormatDateTime, _super);
                function NumberFormatDateTime(format, absTimeParts, partLocaleID, dbNumberFormatPart, cultureName)
                {
                    _super.call(this, partLocaleID, dbNumberFormatPart, cultureName);
                    this.baseNumberStringConverter = NumberFormatBase.prototype.NumberStringConverter;
                    this.baseDateTimeFormatInfo = NumberFormatBase.prototype.DateTimeFormatInfo;
                    this.baseCultureName = NumberFormatBase.prototype.CultureName;
                    var self = this;
                    self.validDateTimeFormatString = keyword_null;
                    self.formatString = keyword_null;
                    self.hasJD = false;
                    self.absoluteTime = keyword_null;
                    self.absTimeParts = keyword_null;
                    self.hasYearDelay = false;
                    self.exactlyMatch = false;
                    self._classNames.push("NumberFormatDateTime");
                    self.exactlyMatch = false;
                    self.formatString = self.FixFormat(NumberFormatBase.TrimNotSupportSymbol(format));
                    self.absTimeParts = absTimeParts;
                    self._init(format, absTimeParts, partLocaleID, dbNumberFormatPart)
                }
                NumberFormatDateTime.EvaluateFormat = function(format)
                {
                    return NumberFormatBase.ContainsKeywords(format, NumberFormatDateTime.keyWords, NumberFormatDateTime.keyWordsSet())
                };
                NumberFormatDateTime.prototype._init = function(format, absTimeParts, partLocaleID, dbNumberFormatPart)
                {
                    var self = this;
                    var formatTemp = {value: self.formatString};
                    var selfClass = NumberFormatDateTime;
                    if (selfClass.EvaluateFormat(formatTemp.value))
                    {
                        var hasAMPM = self.ProcessAMPM(formatTemp);
                        self.hasJD = self.Replace(formatTemp.value, selfClass.MonthJD, "\"" + selfClass.PlaceholderMonthJD + "\"", true, false, formatTemp, false, false);
                        self.Replace(formatTemp.value, selfClass.MonthUnabbreviated, selfClass.StandardMonthUnabbreviated, true, false, formatTemp, false, false);
                        self.Replace(formatTemp.value, selfClass.MonthAbbreviation, selfClass.StandardMonthAbbreviation, true, false, formatTemp, false, false);
                        self.Replace(formatTemp.value, selfClass.MonthTwoDigit, selfClass.StandardMonthTwoDigit, true, false, formatTemp, false, false);
                        self.Replace(formatTemp.value, selfClass.MonthSingleDigit, selfClass.StandardMonthSingleDigit, true, false, formatTemp, false, false);
                        self.Replace(formatTemp.value, selfClass.DayWeekDayAbbreviation, selfClass.StandardDayWeekDayAbbreviation, true, true, formatTemp, false, true);
                        self.Replace(formatTemp.value, selfClass.DayWeekDayUnabbreviated, selfClass.StandardDayWeekDayUnabbreviated, true, true, formatTemp, false, true);
                        self.Replace(formatTemp.value, selfClass.MinuteSingleDigit, selfClass.StandardMinuteSingleDigit, false, true, formatTemp, false, false);
                        if (!hasAMPM)
                        {
                            self.Replace(formatTemp.value, selfClass.HoursSingleDigit, selfClass.StandardHourSingleDigit, true, true, formatTemp, false, false);
                            self.Replace(formatTemp.value, selfClass.HoursTwoDigit, selfClass.StandardHourTwoDigit, true, true, formatTemp, false, false)
                        }
                        self.Replace(formatTemp.value, selfClass.SecondSingleDigit, selfClass.StandardSecondSingleDigit, true, true, formatTemp, false, true);
                        if (self.PartDBNumberFormat() && self.PartLocaleID())
                        {
                            self.hasYearDelay = self.hasYearDelay || self.Replace(formatTemp.value, selfClass.YearFourDigit, "\"" + DefaultTokens.ReplacePlaceholder + selfClass.YearFourDigit + "\"", true, false, formatTemp, false, true);
                            self.hasYearDelay = self.hasYearDelay || self.Replace(formatTemp.value, selfClass.YearTwoDigit, "\"" + DefaultTokens.ReplacePlaceholder + selfClass.YearTwoDigit + "\"", true, false, formatTemp, false, true)
                        }
                        if (self.absTimeParts)
                        {
                            for (var key = 0; key < self.absTimeParts.length; key++)
                            {
                                var absPart = self.absTimeParts[key];
                                self.Replace(formatTemp.value, absPart.token, DefaultTokens.ReplacePlaceholder + absPart.token, true, true, formatTemp, false, true)
                            }
                        }
                        self.validDateTimeFormatString = formatTemp.value
                    }
                    else
                    {
                        throw new Error(Sheets.SR.Exp_FormatIllegal);
                    }
                };
                NumberFormatDateTime.prototype._isJanpaneseCulture = function()
                {
                    var partLocalID = this.PartLocaleID();
                    if (partLocalID !== keyword_null && partLocalID.CultureInfo() !== keyword_null)
                    {
                        if (partLocalID.CultureInfo() === Sheets._CultureInfo.japanCulture())
                        {
                            return true
                        }
                    }
                    else if (this.CultureName() === Sheets._CultureInfo.japanCulture().Name())
                    {
                        return true
                    }
                    return false
                };
                NumberFormatDateTime.prototype.NumberStringConverter = function(value)
                {
                    if (arguments.length === 0)
                    {
                        if (this.baseNumberStringConverter())
                        {
                            return this.baseNumberStringConverter()
                        }
                        return NumberFormatDateTime.defaultDateTimeNumberStringConverter
                    }
                    else
                    {
                        this.baseNumberStringConverter(value);
                        return value
                    }
                };
                NumberFormatDateTime.prototype.AbsoluteTime = function()
                {
                    if (this.absoluteTime)
                    {
                        return this.absoluteTime
                    }
                    return NumberFormatDateTime.defaultAbsoluteTime
                };
                NumberFormatDateTime.prototype.FormatString = function()
                {
                    return this.formatString
                };
                NumberFormatDateTime.prototype.DateTimeFormatInfo = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        if (self.baseDateTimeFormatInfo())
                        {
                            return self.baseDateTimeFormatInfo()
                        }
                        if (self.PartLocaleID() && self.PartLocaleID().CultureInfo())
                        {
                            return self.PartLocaleID().CultureInfo().DateTimeFormat()
                        }
                        if (self.baseCultureName())
                        {
                            return Sheets._CultureInfo.getCulture(self.baseCultureName()).DateTimeFormat()
                        }
                        return DefaultTokens.DateTimeFormatInfo()
                    }
                    else
                    {
                        self.baseDateTimeFormatInfo(value);
                        return value
                    }
                };
                NumberFormatDateTime.prototype.ExcelCompatibleFormatString = function()
                {
                    var self = this;
                    var formatTemp = self.formatString;
                    var selfClass = NumberFormatDateTime;
                    var result = {value: formatTemp};
                    self.Replace(formatTemp, selfClass.StandardAMPMSingleDigit, self.CurrentAMPM(), true, true, result, false, true);
                    self.Replace(formatTemp, selfClass.StandardMonthUnabbreviated, selfClass.MonthUnabbreviated, true, false, result, false, true);
                    self.Replace(formatTemp, selfClass.StandardMonthAbbreviation, selfClass.MonthAbbreviation, true, false, result, false, true);
                    self.Replace(formatTemp, selfClass.StandardMonthTwoDigit, selfClass.MonthTwoDigit, true, false, result, false, true);
                    self.Replace(formatTemp, selfClass.StandardMonthSingleDigit, selfClass.MonthSingleDigit, true, false, result, false, true);
                    self.Replace(formatTemp, selfClass.StandardDayWeekDayAbbreviation, selfClass.DayWeekDayAbbreviation, true, true, result, false, true);
                    self.Replace(formatTemp, selfClass.StandardDayWeekDayUnabbreviated, selfClass.DayWeekDayUnabbreviated, true, true, result, false, true);
                    self.Replace(formatTemp, selfClass.StandardMinuteSingleDigit, selfClass.MinuteSingleDigit, false, true, result, false, true);
                    self.Replace(formatTemp, selfClass.StandardHourSingleDigit, selfClass.HoursSingleDigit, true, true, result, false, false);
                    self.Replace(formatTemp, selfClass.StandardHourTwoDigit, selfClass.HoursTwoDigit, true, true, result, false, false);
                    self.Replace(formatTemp, selfClass.StandardSecondSingleDigit, selfClass.SecondSingleDigit, true, true, result, false, true);
                    self.Replace(formatTemp, selfClass.StandardSubSecondThreeDigit, selfClass.SubSecondThreeDigit, true, true, result, false, true);
                    self.Replace(formatTemp, selfClass.StandardSubSecondTwoDigit, selfClass.SubSecondTwoDigit, true, true, result, false, true);
                    self.Replace(formatTemp, selfClass.StandardSubSecondSingleDigit, selfClass.SubSecondSingleDigit, true, true, result, false, true);
                    return result.value
                };
                NumberFormatDateTime.prototype.CurrentAMPM = function()
                {
                    var formatInfo = keyword_null;
                    if (this.DateTimeFormatInfo())
                    {
                        formatInfo = this.DateTimeFormatInfo()
                    }
                    else
                    {
                        formatInfo = DefaultTokens.DateTimeFormatInfo()
                    }
                    if (formatInfo && formatInfo.amDesignator && formatInfo.amDesignator !== stringEx.Empty && formatInfo.pmDesignator && formatInfo.pmDesignator !== stringEx.Empty)
                    {
                        var ampm = stringEx.Format("{0}/{1}", formatInfo.amDesignator, formatInfo.pmDesignator);
                        return ampm
                    }
                    return NumberFormatDateTime.AMPMTwoDigit
                };
                NumberFormatDateTime.prototype.Format = function(obj)
                {
                    if (Sheets.util.isType(obj, 'boolean'))
                    {
                        return obj.toString().toUpperCase()
                    }
                    var self = this;
                    var result = stringEx.Empty;
                    var dateTime = keyword_null;
                    try
                    {
                        try
                        {
                            dateTime = Sheets.Calc.Convert.DT(obj);
                            if (!dateTime)
                            {
                                result = obj.toString()
                            }
                        }
                        catch(err)
                        {
                            result = obj.toString()
                        }
                        if (dateTime)
                        {
                            var validDTF = self.validDateTimeFormatString;
                            var fs = self.validDateTimeFormatString.replace(/%/g, "");
                            if (fs === "H" || fs === "h" || fs === "m" || fs === "M" || fs === "d" || fs === "s" || fs === "y")
                            {
                                validDTF = "%" + fs;
                                self.validDateTimeFormatString = validDTF
                            }
                            else
                            {
                                validDTF = fs
                            }
                            if (self.PartLocaleID() && self.PartLocaleID().CultureInfo())
                            {
                                result = new Sheets._DateTimeHelper(dateTime).customCultureFormat(validDTF, self.PartLocaleID().CultureInfo())
                            }
                            else if (self.CultureName())
                            {
                                result = new Sheets._DateTimeHelper(dateTime).customCultureFormat(validDTF, Sheets._CultureInfo.getCulture(self.CultureName()))
                            }
                            else
                            {
                                result = new Sheets._DateTimeHelper(dateTime).localeFormat(validDTF)
                            }
                            if (self.hasJD)
                            {
                                var monthName = self._getMonthName(dateTime.getMonth());
                                result = Sheets.StringHelper.Replace(result, NumberFormatDateTime.PlaceholderMonthJD, monthName.substr(0, 1))
                            }
                            if (self.absTimeParts)
                            {
                                var span = (Sheets._DateTimeHelper.___toOADate(dateTime) - Sheets._DateTimeHelper.___toOADate(self.AbsoluteTime())) * 24 * 60 * 60 * 1000;
                                for (var key = 0; key < self.absTimeParts.length; key++)
                                {
                                    var absPart = self.absTimeParts[key];
                                    var absTimePartString = keyword_null;
                                    switch (absPart.TimePartType())
                                    {
                                        case 0:
                                            absTimePartString = Math_floor(span / 1000 / 3600);
                                            break;
                                        case 1:
                                            absTimePartString = Math_floor(span / 1000 / 60);
                                            break;
                                        case 2:
                                            absTimePartString = Math_floor(span / 1000);
                                            break
                                    }
                                    if (absTimePartString !== keyword_null && absTimePartString !== keyword_undefined)
                                    {
                                        var tempAbsPart = absPart.token.replace("[", "\\[").replace("]", "\\]");
                                        result = Sheets.StringHelper.Replace(result, DefaultTokens.ReplacePlaceholder + tempAbsPart, absTimePartString)
                                    }
                                }
                            }
                        }
                    }
                    catch(ex)
                    {
                        result = Sheets.FormatConverter.toString(obj)
                    }
                    if (self.NumberStringConverter())
                    {
                        if (self.NumberStringConverter() instanceof DefaultDateTimeNumberStringConverter)
                        {
                            result = self.NumberStringConverter().ConvertTo(result, obj, false, self.PartLocaleID(), self.PartDBNumberFormat())
                        }
                        else
                        {
                            if (self.hasYearDelay)
                            {
                                result = Sheets.StringHelper.Replace(result, DefaultTokens.ReplacePlaceholder + NumberFormatDateTime.YearFourDigit, new Sheets._DateTimeHelper(dateTime).localeFormat(NumberFormatDateTime.YearFourDigit));
                                result = Sheets.StringHelper.Replace(result, DefaultTokens.ReplacePlaceholder + NumberFormatDateTime.YearTwoDigit, new Sheets._DateTimeHelper(dateTime).localeFormat(NumberFormatDateTime.YearTwoDigit))
                            }
                            result = self.NumberStringConverter().ConvertTo(result, obj, true, self.PartLocaleID(), self.PartDBNumberFormat())
                        }
                    }
                    return result
                };
                NumberFormatDateTime.prototype._getMonthName = function(monthIndex)
                {
                    var array = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    return array[monthIndex]
                };
                NumberFormatDateTime.prototype.Parse = function(s)
                {
                    if (!s || s === stringEx.Empty)
                    {
                        return keyword_null
                    }
                    var self = this;
                    var strTemp = NumberHelper.FixJapaneseChars(s);
                    var boolResult = strTemp.toLowerCase();
                    if (boolResult === "true")
                    {
                        return true
                    }
                    else if (boolResult === "false")
                    {
                        return false
                    }
                    if (self.validDateTimeFormatString)
                    {
                        var dateTimeResult = Sheets._DateTimeHelper.parseExact(strTemp, self.validDateTimeFormatString, Sheets._CultureInfo.getCulture(self.CultureName()));
                        if (dateTimeResult)
                        {
                            return dateTimeResult
                        }
                    }
                    if (!self.exactlyMatch)
                    {
                        try
                        {
                            var resultDate = Sheets.Calc.Convert.DT(strTemp);
                            if (resultDate && !isNaN(resultDate))
                            {
                                return resultDate
                            }
                            else
                            {
                                return strTemp
                            }
                        }
                        catch(err)
                        {
                            return strTemp
                        }
                    }
                    return keyword_null
                };
                NumberFormatDateTime.prototype.FixFormat = function(format)
                {
                    var formatTemp = format;
                    var strBuilder = "";
                    var inComments = false;
                    var hasTime = (Sheets.StringHelper.IndexOf(formatTemp, NumberFormatDateTime.HoursSingleDigit[0], 1) > -1 || Sheets.StringHelper.IndexOf(formatTemp, NumberFormatDateTime.SecondSingleDigit[0], 1) > -1);
                    var hasDate = (Sheets.StringHelper.IndexOf(formatTemp, NumberFormatDateTime.YearTwoDigit[0], 1) > -1 || Sheets.StringHelper.IndexOf(formatTemp, NumberFormatDateTime.DaySingleDigit[0], 1) > -1);
                    for (var n = 0; n < formatTemp.length; n++)
                    {
                        var c = formatTemp[n];
                        if (c === '\"')
                        {
                            inComments = !inComments
                        }
                        else
                        {
                            if (!inComments)
                            {
                                if (c === 'Y' || c === 'D' || c === 'S' || c === 'E' || c === 'G')
                                {
                                    c = c.toLowerCase()
                                }
                                else if (c === 'M')
                                {
                                    if (n > 1)
                                    {
                                        if (!DefaultTokens.IsEquals('A', formatTemp[n - 1], true) && !DefaultTokens.IsEquals('P', formatTemp[n - 1], true))
                                        {
                                            c = c.toLowerCase()
                                        }
                                    }
                                    else
                                    {
                                        c = c.toLowerCase()
                                    }
                                }
                            }
                        }
                        strBuilder += (c)
                    }
                    return strBuilder
                };
                NumberFormatDateTime.prototype.ProcessAMPM = function(format)
                {
                    var isHandled = false;
                    if (Sheets.StringHelper.Contains(format.value, NumberFormatDateTime.AMPMTwoDigit))
                    {
                        format.value = Sheets.StringHelper.Replace(format.value, NumberFormatDateTime.AMPMTwoDigit, NumberFormatDateTime.StandardAMPMSingleDigit);
                        isHandled = true
                    }
                    var currentDateTimeFormatInfo = this.DateTimeFormatInfo();
                    if (Sheets.StringHelper.Contains(format.value, NumberFormatDateTime.AMPMSingleDigit))
                    {
                        format.value = Sheets.StringHelper.Replace(format.value, NumberFormatDateTime.AMPMSingleDigit, NumberFormatDateTime.StandardAMPMSingleDigit);
                        if (currentDateTimeFormatInfo)
                        {
                            currentDateTimeFormatInfo.amDesignator = NumberFormatDateTime.AMPMSingleDigit.substr(0, 1);
                            currentDateTimeFormatInfo.pmDesignator = NumberFormatDateTime.AMPMSingleDigit.substr(2, 1)
                        }
                        isHandled = true
                    }
                    var currentAMPM = this.CurrentAMPM();
                    if (Sheets.StringHelper.Contains(format.value, currentAMPM))
                    {
                        format.value = Sheets.StringHelper.Replace(format.value, currentAMPM, NumberFormatDateTime.StandardAMPMSingleDigit);
                        var ampm = currentAMPM.split('/');
                        if (ampm && ampm.length === 2)
                        {
                            currentDateTimeFormatInfo.amDesignator = ampm[0];
                            currentDateTimeFormatInfo.pmDesignator = ampm[1]
                        }
                        isHandled = true
                    }
                    return isHandled
                };
                NumberFormatDateTime.prototype.Replace = function(format, oldToken, newToken, isReplaceInDateFormat, isReplaceInTimeFormat, result, justSearch, isIgnoreCase)
                {
                    result.value = format;
                    if (isReplaceInDateFormat || isReplaceInTimeFormat)
                    {
                        var positions = [];
                        var isInDate = true;
                        var hasTime = (Sheets.StringHelper.IndexOf(result.value, NumberFormatDateTime.HoursSingleDigit[0], 1) > -1 || Sheets.StringHelper.IndexOf(result.value, NumberFormatDateTime.SecondSingleDigit[0], 1) > -1);
                        var hasDate = (Sheets.StringHelper.IndexOf(result.value, NumberFormatDateTime.YearTwoDigit[0], 1) > -1 || Sheets.StringHelper.IndexOf(result.value, NumberFormatDateTime.DaySingleDigit[0], 1) > -1);
                        if (!hasDate && hasTime)
                        {
                            isInDate = false
                        }
                        var isStartSpecialString = false;
                        var tokenCharIndex = 0;
                        var index = 0;
                        for (; index < result.value.length; index++)
                        {
                            var c = result.value[index];
                            if (DefaultTokens.IsEquals(c, NumberFormatDateTime.HoursSingleDigit[0], true) || DefaultTokens.IsEquals(c, NumberFormatDateTime.SecondSingleDigit[0], true))
                            {
                                isInDate = false
                            }
                            else if (DefaultTokens.IsEquals(c, NumberFormatDateTime.YearTwoDigit[0], true) || DefaultTokens.IsEquals(c, NumberFormatDateTime.DaySingleDigit[0], true))
                            {
                                isInDate = true
                            }
                            if ((isReplaceInDateFormat && DefaultTokens.IsEquals(c, oldToken[tokenCharIndex], isIgnoreCase) && isInDate) || (isReplaceInTimeFormat && DefaultTokens.IsEquals(c, oldToken[tokenCharIndex], isIgnoreCase) && !isInDate))
                            {
                                var isMatch = true;
                                for (var x = 0; x < oldToken.length; x++)
                                {
                                    if (x + index >= format.length || !DefaultTokens.IsEquals(oldToken[x], result.value[x + index], isIgnoreCase))
                                    {
                                        isMatch = false;
                                        break
                                    }
                                }
                                var indexLastMatch = index + oldToken.length - 1;
                                if (isMatch && indexLastMatch + 1 < result.value.length)
                                {
                                    var lastMatchChar = result.value[indexLastMatch];
                                    var tail = -1;
                                    for (tail = indexLastMatch + 1; tail < result.value.length; tail++)
                                    {
                                        if (!DefaultTokens.IsEquals(lastMatchChar, result.value[tail], isIgnoreCase))
                                        {
                                            break
                                        }
                                    }
                                    if (tail > indexLastMatch + 1)
                                    {
                                        index = tail;
                                        isMatch = false
                                    }
                                }
                                if (isMatch && !isStartSpecialString)
                                {
                                    Sheets.ArrayHelper.insert(positions, 0, index)
                                }
                            }
                            if (c === '\"')
                            {
                                isStartSpecialString = !isStartSpecialString
                            }
                        }
                        if (positions.length > 0)
                        {
                            if (!justSearch)
                            {
                                for (index = 0; index < positions.length; index++)
                                {
                                    var position = positions[index];
                                    result.value = Sheets.StringHelper.Remove(result.value, position, oldToken.length);
                                    result.value = Sheets.StringHelper.Insert(result.value, position, newToken)
                                }
                            }
                            return true
                        }
                        else
                        {
                            return false
                        }
                    }
                    return false
                };
                NumberFormatDateTime.keyWordsSet = function()
                {
                    var selfClass = NumberFormatDateTime;
                    if (!selfClass._keyWordsSet)
                    {
                        var obj = {};
                        for (var i = 0; i < selfClass.keyWords.length; i++)
                        {
                            obj[selfClass.keyWords[i]] = true
                        }
                        selfClass._keyWordsSet = obj
                    }
                    return selfClass._keyWordsSet
                };
                NumberFormatDateTime.defaultDateTimeNumberStringConverter = new DefaultDateTimeNumberStringConverter;
                NumberFormatDateTime.YearTwoDigit = "yy";
                NumberFormatDateTime.YearSingleDigit = "y";
                NumberFormatDateTime.YearFourDigit = "yyyy";
                NumberFormatDateTime.MonthSingleDigit = "m";
                NumberFormatDateTime.MonthTwoDigit = "mm";
                NumberFormatDateTime.MonthAbbreviation = "mmm";
                NumberFormatDateTime.MonthUnabbreviated = "mmmm";
                NumberFormatDateTime.MonthJD = "mmmmm";
                NumberFormatDateTime.DaySingleDigit = "d";
                NumberFormatDateTime.DayTwoDigit = "dd";
                NumberFormatDateTime.DayWeekDayAbbreviation = "aaa";
                NumberFormatDateTime.DayWeekDayUnabbreviated = "aaaa";
                NumberFormatDateTime.HoursSingleDigit = "h";
                NumberFormatDateTime.HoursTwoDigit = "hh";
                NumberFormatDateTime.MinuteSingleDigit = "m";
                NumberFormatDateTime.MinuteTwoDigit = "mm";
                NumberFormatDateTime.SecondSingleDigit = "s";
                NumberFormatDateTime.SecondTwoDigit = "ss";
                NumberFormatDateTime.SubSecondSingleDigit = ".0";
                NumberFormatDateTime.SubSecondTwoDigit = ".00";
                NumberFormatDateTime.SubSecondThreeDigit = ".000";
                NumberFormatDateTime.EraYear = "e";
                NumberFormatDateTime.AMPMTwoDigit = "AM/PM";
                NumberFormatDateTime.AMPMSingleDigit = "A/P";
                NumberFormatDateTime.StandardYearSingleDigit = "%y";
                NumberFormatDateTime.StandardMonthSingleDigit = "%M";
                NumberFormatDateTime.StandardMonthTwoDigit = "MM";
                NumberFormatDateTime.StandardMonthAbbreviation = "MMM";
                NumberFormatDateTime.StandardMonthUnabbreviated = "MMMM";
                NumberFormatDateTime.StandardAMPMSingleDigit = "tt";
                NumberFormatDateTime.StandardMinuteSingleDigit = "%m";
                NumberFormatDateTime.StandardHourSingleDigit = "H";
                NumberFormatDateTime.StandardHourTwoDigit = "HH";
                NumberFormatDateTime.StandardSecondSingleDigit = "%s";
                NumberFormatDateTime.StandardSubSecondSingleDigit = ".f";
                NumberFormatDateTime.StandardSubSecondTwoDigit = ".ff";
                NumberFormatDateTime.StandardSubSecondThreeDigit = ".fff";
                NumberFormatDateTime.StandardDayWeekDayAbbreviation = "ddd";
                NumberFormatDateTime.StandardDayWeekDayUnabbreviated = "dddd";
                NumberFormatDateTime.PlaceholderMonthJD = DefaultTokens.ReplacePlaceholder + "mmmmm";
                NumberFormatDateTime.defaultAbsoluteTime = new Date(1899, 11, 30, 0, 0, 0, 0);
                NumberFormatDateTime.keyWords = [NumberFormatDateTime.YearSingleDigit, NumberFormatDateTime.YearTwoDigit, NumberFormatDateTime.YearFourDigit, NumberFormatDateTime.MonthSingleDigit, NumberFormatDateTime.MonthTwoDigit, NumberFormatDateTime.MonthAbbreviation, NumberFormatDateTime.MonthUnabbreviated, NumberFormatDateTime.MonthJD, NumberFormatDateTime.DaySingleDigit, NumberFormatDateTime.DayTwoDigit, NumberFormatDateTime.DayWeekDayAbbreviation, NumberFormatDateTime.DayWeekDayUnabbreviated, NumberFormatDateTime.HoursSingleDigit, NumberFormatDateTime.HoursTwoDigit, NumberFormatDateTime.MinuteSingleDigit, NumberFormatDateTime.MinuteTwoDigit, NumberFormatDateTime.SecondSingleDigit, NumberFormatDateTime.SecondTwoDigit, "ggg", "gg", "g", "ee", "e"];
                return NumberFormatDateTime
            })(NumberFormatBase);
        var DefaultNumberStringConverter = (function()
            {
                function DefaultNumberStringConverter(){}
                DefaultNumberStringConverter.prototype.ConvertTo = function(num, value, isGeneralNumber, locale, dbNumber)
                {
                    if (locale != keyword_null && dbNumber != keyword_null)
                    {
                        var dbNumberTemp = locale.GetDBNumber(dbNumber.Type());
                        if (dbNumberTemp != keyword_null)
                            return dbNumber.ReplaceNumberString(num, dbNumberTemp, isGeneralNumber)
                    }
                    return num
                };
                return DefaultNumberStringConverter
            })();
        var NumberFormatDigital = (function(_super)
            {
                __extends(NumberFormatDigital, _super);
                function NumberFormatDigital(format, partLocaleID, dbNumberFormatPart, cultureName)
                {
                    _super.call(this, partLocaleID, dbNumberFormatPart, cultureName);
                    this.baseNumberStringConverter = NumberFormatBase.prototype.NumberStringConverter;
                    this.baseNumberFormatInfo = NumberFormatBase.prototype.NumberFormatInfo;
                    this.baseCultureName = NumberFormatBase.prototype.CultureName;
                    var self = this;
                    self.numberFormatString = keyword_null;
                    self.fullFormatString = keyword_null;
                    self.isGeneralNumber = false;
                    self.fractionIntegerFormat = keyword_null;
                    self.fractionNumeratorFormat = keyword_null;
                    self.fractionDenominatorFormat = keyword_null;
                    self.excelFormatString = stringEx.Empty;
                    self._classNames.push("NumberFormatDigital");
                    var formatTemp = NumberFormatBase.TrimNotSupportSymbol(format);
                    self.fullFormatString = DefaultTokens.Filter(format, DefaultTokens.LeftSquareBracket, DefaultTokens.RightSquareBracket);
                    self.excelFormatString = formatTemp;
                    if (partLocaleID)
                    {
                        var oldFormat = formatTemp;
                        formatTemp = DefaultTokens.ReplaceKeyword(oldFormat, self.PartLocaleID().OriginalToken(), self.PartLocaleID().CurrencySymbol())
                    }
                    if (self.PartDBNumberFormat())
                    {
                        self.excelFormatString = DefaultTokens.ReplaceKeyword(self.excelFormatString, self.PartDBNumberFormat().OriginalToken(), self.PartDBNumberFormat().toString())
                    }
                    formatTemp = DefaultTokens.Filter(formatTemp, DefaultTokens.LeftSquareBracket, DefaultTokens.RightSquareBracket);
                    var solidusIndex = formatTemp.indexOf(DefaultTokens.SolidusSign);
                    if (solidusIndex > -1)
                    {
                        formatTemp = Sheets.StringHelper.Replace(formatTemp, "\\" + DefaultTokens.QuestionMark, DefaultTokens.Zero);
                        var sp = formatTemp.split(DefaultTokens.SolidusSign);
                        if (sp && sp.length === 2)
                        {
                            self.fractionDenominatorFormat = sp[1];
                            var left = sp[0];
                            if (left)
                            {
                                var kjIndex = left.lastIndexOf(DefaultTokens.Space);
                                if (kjIndex > -1)
                                {
                                    self.fractionIntegerFormat = left.substr(0, kjIndex);
                                    self.fractionNumeratorFormat = left.substr(kjIndex + 1, left.length - kjIndex - 1)
                                }
                                else
                                {
                                    self.fractionNumeratorFormat = left
                                }
                            }
                        }
                    }
                    self.numberFormatString = formatTemp
                }
                NumberFormatDigital.prototype.NumberStringConverter = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        if (self.baseNumberStringConverter())
                        {
                            return self.baseNumberStringConverter()
                        }
                        return NumberFormatDigital.defaultNumberStringConverter
                    }
                    else
                    {
                        self.baseNumberStringConverter(value);
                        return value
                    }
                };
                NumberFormatDigital.prototype.FormatString = function()
                {
                    return this.fullFormatString
                };
                NumberFormatDigital.prototype.NumberFormatInfo = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        if (self.baseNumberFormatInfo())
                        {
                            return self.baseNumberFormatInfo()
                        }
                        if (self.PartLocaleID() && self.PartLocaleID().CultureInfo())
                        {
                            return self.PartLocaleID().CultureInfo().NumberFormat()
                        }
                        if (self.baseCultureName())
                        {
                            return Sheets._CultureInfo.getCulture(self.baseCultureName()).NumberFormat()
                        }
                        return DefaultTokens.NumberFormatInfo()
                    }
                    else
                    {
                        self.baseNumberFormatInfo(value);
                        return value
                    }
                };
                NumberFormatDigital.prototype.IsGeneralNumber = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this.isGeneralNumber
                    }
                    else
                    {
                        this.isGeneralNumber = value;
                        return value
                    }
                };
                NumberFormatDigital.prototype.ExcelCompatibleFormatString = function()
                {
                    return this.excelFormatString
                };
                NumberFormatDigital.prototype.Format = function(obj)
                {
                    if (Sheets.util.isType(obj, 'boolean'))
                    {
                        return obj.toString().toUpperCase()
                    }
                    var self = this;
                    var num = Sheets.FormatConverter.ToDouble(obj);
                    if (isNaN(num) || !isFinite(num) || isNaN(obj))
                    {
                        if (typeof obj === 'string')
                        {
                            return obj
                        }
                        return keyword_null
                    }
                    var result = self.NaNSymbol();
                    var sb = keyword_null;
                    var cultureInfo;
                    if (self.CultureName())
                    {
                        cultureInfo = Sheets._CultureInfo.getCulture(self.CultureName())
                    }
                    else
                    {
                        cultureInfo = Sheets._CultureInfo._currentCulture
                    }
                    if (self.fractionNumeratorFormat && self.fractionDenominatorFormat)
                    {
                        var out_integer = {value: 0.0};
                        var out_numerator = {value: 0.0};
                        var out_denominator = {value: 0.0};
                        var d = self.fractionDenominatorFormat.length;
                        if (NumberFormatDigital.GetFraction(num, d, out_integer, out_numerator, out_denominator))
                        {
                            var tempValue = self.GetGCD(out_numerator.value, out_denominator.value);
                            if (tempValue > 1)
                            {
                                out_numerator.value /= tempValue;
                                out_denominator.value /= tempValue
                            }
                            if (self.fractionIntegerFormat)
                            {
                                sb = "";
                                if (out_integer.value !== 0)
                                {
                                    sb += (new Sheets._NumberHelper(out_integer.value).customCultureFormat(self.fractionIntegerFormat, cultureInfo));
                                    sb += (DefaultTokens.Space)
                                }
                                if (out_integer.value === 0 && num < 0)
                                {
                                    sb += (DefaultTokens.negativeSign)
                                }
                                if (num === 0)
                                {
                                    sb += ("0")
                                }
                                var denominatorFormat = self.fractionDenominatorFormat;
                                var fixedDenominator = parseFloat(denominatorFormat);
                                if (!isNaN(fixedDenominator))
                                {
                                    if (fixedDenominator > 0)
                                    {
                                        out_numerator.value *= fixedDenominator / out_denominator.value;
                                        denominatorFormat = stringEx.Empty;
                                        out_denominator.value = fixedDenominator;
                                        var numeratorValueRoundUp = Math_ceil(out_numerator.value);
                                        var temp = numeratorValueRoundUp - out_numerator.value;
                                        if (temp <= 0.5 && temp >= 0)
                                        {
                                            out_numerator.value = parseFloat(numeratorValueRoundUp.toString())
                                        }
                                        else
                                        {
                                            out_numerator.value = parseFloat((numeratorValueRoundUp - 1).toString())
                                        }
                                    }
                                }
                                var numeratorFormat = self.fractionNumeratorFormat;
                                var fixedNumeratorForma = parseFloat(numeratorFormat);
                                if (!isNaN(fixedNumeratorForma))
                                {
                                    if (fixedNumeratorForma === 0)
                                    {
                                        var numeratorFormatLength = numeratorFormat.length;
                                        var numeratorString = out_numerator.value.toString();
                                        var numeratorLength = numeratorString.length;
                                        if (numeratorFormatLength > numeratorLength)
                                        {
                                            numeratorFormat = numeratorFormat.substr(0, numeratorFormatLength - (numeratorFormatLength - numeratorLength))
                                        }
                                        else if (numeratorFormatLength < numeratorLength)
                                        {
                                            numeratorString = numeratorString.substr(0, numeratorLength - (numeratorLength - numeratorFormatLength));
                                            out_numerator.value = parseInt(numeratorString, 10)
                                        }
                                    }
                                }
                                if (out_numerator.value !== 0)
                                {
                                    sb += (new Sheets._NumberHelper(out_numerator.value).customCultureFormat(numeratorFormat, cultureInfo).replace(/^0*/, ''));
                                    sb += (DefaultTokens.SolidusSign);
                                    sb += (new Sheets._NumberHelper(out_denominator.value).customCultureFormat(denominatorFormat, cultureInfo).replace(/^0*/, ''))
                                }
                                return sb
                            }
                            else
                            {
                                sb = "";
                                var value = out_integer.value * out_denominator.value + out_numerator.value;
                                var denominatorFormat = self.fractionDenominatorFormat;
                                var fixedDenominator = parseFloat(denominatorFormat);
                                if (fixedDenominator > 0)
                                {
                                    value *= fixedDenominator / out_denominator.value;
                                    denominatorFormat = stringEx.Empty;
                                    out_denominator.value = fixedDenominator;
                                    var numeratorValueRoundUp = Math_ceil(value);
                                    var temp = numeratorValueRoundUp - value;
                                    if (temp <= 0.5 && temp >= 0)
                                    {
                                        value = parseFloat(numeratorValueRoundUp.toString())
                                    }
                                    else
                                    {
                                        value = parseFloat((numeratorValueRoundUp - 1).toString())
                                    }
                                    sb += (value + DefaultTokens.SolidusSign + out_denominator.value)
                                }
                                else
                                {
                                    sb += (new Sheets._NumberHelper(value).customCultureFormat(self.fractionNumeratorFormat, cultureInfo).replace(/^0*/, ''));
                                    sb += (DefaultTokens.SolidusSign);
                                    sb += (new Sheets._NumberHelper(out_denominator.value).customCultureFormat(self.fractionDenominatorFormat, cultureInfo).replace(/^0*/, ''))
                                }
                                return sb
                            }
                        }
                        else
                        {
                            return num.toString()
                        }
                    }
                    else
                    {
                        result = new Sheets._NumberHelper(num).customCultureFormat(self.EncodeNumberFormat(self.numberFormatString), cultureInfo);
                        if (self.NumberStringConverter())
                        {
                            result = self.NumberStringConverter().ConvertTo(result, obj, self.isGeneralNumber, self.PartLocaleID(), self.PartDBNumberFormat())
                        }
                    }
                    return result
                };
                NumberFormatDigital.prototype.Parse = function(s)
                {
                    var self = this;
                    s = self.TrimSpecialSymbol(s);
                    s = self.TrimCurrencySymbol(s);
                    if (!s || s === stringEx.Empty)
                    {
                        return keyword_null
                    }
                    if (Sheets.StringHelper.EndsWith(s, DefaultTokens.numberGroupSeparator))
                    {
                        return s
                    }
                    var strTemp = NumberHelper.FixJapaneseChars(s);
                    if (s.toLowerCase() === "true")
                    {
                        return true
                    }
                    else if (s.toLowerCase() === "false")
                    {
                        return false
                    }
                    var isDecimal = DefaultTokens.IsDecimal(strTemp, self.NumberFormatInfo());
                    var EIndex = Sheets.StringHelper.IndexOf(strTemp, DefaultTokens.ExponentialSymbol, 1);
                    var isE = EIndex > -1;
                    if (self.numberFormatString)
                    {
                        var out_percentSignCount = {value: 0};
                        s = self.TrimPercentSign(s, out_percentSignCount);
                        var str = s;
                        if (isE)
                        {
                            str = s.substr(0, EIndex)
                        }
                        if (str[0] === DefaultTokens.NumberFormatInfo().positiveSign)
                        {
                            str = str.substr(1);
                            s = s.substr(1)
                        }
                        var tempS = Sheets.StringHelper.Replace(str, DefaultTokens.numberGroupSeparator, "");
                        var index = tempS.indexOf(DefaultTokens.DecimalSeparator);
                        if (index === tempS.lastIndexOf(DefaultTokens.DecimalSeparator))
                        {
                            var strBuilder = "#,##0";
                            if (index !== -1)
                            {
                                strBuilder += (".");
                                var decimalLength = tempS.length - index - 1;
                                for (var i = 0; i < decimalLength; i++)
                                {
                                    strBuilder += ("0")
                                }
                            }
                            var newS = new GeneralFormatter(strBuilder).Format(tempS);
                            if (newS === str)
                            {
                                if (isE)
                                {
                                    s = tempS + s.substr(EIndex)
                                }
                                else
                                {
                                    s = tempS
                                }
                            }
                        }
                        var value = parseFloat(s);
                        var nRegExp = keyword_null;
                        if (value.toString() !== s)
                        {
                            var nfi = self.NumberFormatInfo();
                            var decimalSeparator = DefaultTokens.DecimalSeparator;
                            if (!isDecimal && !isE)
                            {
                                nRegExp = new RegExp("^((\\+|-)?\\d+)$", "ig")
                            }
                            else if (isDecimal && !isE)
                            {
                                nRegExp = new RegExp("^((\\+|-)?\\d*)" + decimalSeparator + "(\\d*)$", "ig")
                            }
                            else if (!isDecimal && isE)
                            {
                                nRegExp = new RegExp("^((\\+|-)?\\d+)((E(\\+|-)?|e(\\+|-)?)\\d+)$", "ig")
                            }
                            else if (isDecimal && isE)
                            {
                                nRegExp = new RegExp("^((\\+|-)?\\d*)" + decimalSeparator + "(\\d*)((E(\\+|-)?|e(\\+|-)?)\\d+)$", "ig")
                            }
                        }
                        if (!isNaN(value) && isFinite(value) && (!nRegExp || nRegExp.test(s)))
                        {
                            if (out_percentSignCount.value > 0)
                            {
                                value = value / parseFloat((100.0 * out_percentSignCount.value).toString())
                            }
                            if (value !== 0 && Math_abs(value - Math_floor(value)) !== 0)
                            {
                                isDecimal = true
                            }
                            if (isE)
                            {
                                isDecimal = true
                            }
                            return self.ToObject(value, isDecimal)
                        }
                    }
                    return keyword_null
                };
                NumberFormatDigital.prototype.EncodeNumberFormat = function(format)
                {
                    if (format)
                    {
                        var charArray = format.split("");
                        var strBuilder = "";
                        for (var i = 0; i < charArray.length - 1; )
                        {
                            if (charArray[i] === "\\")
                            {
                                strBuilder += (charArray[i + 1]);
                                i += 2
                            }
                            else
                            {
                                strBuilder += (charArray[i]);
                                i++
                            }
                        }
                        if (i === charArray.length - 1)
                        {
                            if (charArray[i] !== "\\")
                            {
                                strBuilder += (charArray[i])
                            }
                        }
                        format = strBuilder
                    }
                    return format
                };
                NumberFormatDigital.prototype.ToObject = function(value, isDecimal)
                {
                    if (!isDecimal)
                    {
                        if (value <= 1E+22)
                        {
                            return value
                        }
                        else
                        {
                            return value
                        }
                    }
                    return value
                };
                NumberFormatDigital.prototype.TrimPercentSign = function(s, out_count)
                {
                    out_count.value = 0;
                    if (!s || s === stringEx.Empty)
                    {
                        return s
                    }
                    var strTemp = s;
                    var percentSymbol = DefaultTokens.percentSymbol;
                    var index = s.indexOf(percentSymbol);
                    if (index === s.length - 1 && index === s.lastIndexOf(percentSymbol))
                    {
                        strTemp = Sheets.StringHelper.Replace(strTemp, percentSymbol, "");
                        out_count.value += ((s.length - strTemp.length) / percentSymbol.length)
                    }
                    return strTemp
                };
                NumberFormatDigital.prototype.TrimSpecialSymbol = function(s)
                {
                    if (!s || s === stringEx.Empty)
                    {
                        return s
                    }
                    var strTemp = s;
                    var firstDigital = -1;
                    for (var fd = 0; fd < strTemp.length; fd++)
                    {
                        if (char.IsDigit(strTemp[fd]))
                        {
                            firstDigital = fd;
                            break
                        }
                    }
                    var lastDigital = -1;
                    for (var ld = strTemp.length - 1; ld > -1; ld--)
                    {
                        if (char.IsDigit(strTemp[ld]))
                        {
                            lastDigital = ld;
                            break
                        }
                    }
                    for (var n = strTemp.length - 1; n > -1; n--)
                    {
                        var c = strTemp[n];
                        if (this.IsSpecialSymbol(c))
                        {
                            if (char.IsWhiteSpace(c))
                            {
                                if (n < firstDigital || lastDigital < n)
                                {
                                    strTemp = Sheets.StringHelper.Remove(strTemp, n, 1)
                                }
                            }
                            else
                            {
                                strTemp = Sheets.StringHelper.Remove(strTemp, n, 1)
                            }
                        }
                        else
                        {
                            if (c === '-' || c === '+')
                            {
                                if (n > 0)
                                {
                                    if (strTemp[n - 1] !== 'e' && strTemp[n - 1] !== 'E' && strTemp[n - 1] !== '(' && strTemp[n - 1].toString() !== DefaultTokens.NumberFormatInfo().currencySymbol)
                                    {
                                        break
                                    }
                                }
                            }
                        }
                    }
                    return strTemp
                };
                NumberFormatDigital.prototype.IsStandardNumberSymbol = function(c)
                {
                    var formatProvider = this.NumberFormatInfo() ? this.NumberFormatInfo() : DefaultTokens.NumberFormatInfo();
                    if (formatProvider)
                    {
                        var str = c.toString();
                        if (str === formatProvider.currencyDecimalSeparator || str === formatProvider.currencyGroupSeparator || str === formatProvider.currencySymbol || str === formatProvider.nanSymbol || str === formatProvider.negativeInfinitySymbol || str === formatProvider.negativeSign || str === formatProvider.numberDecimalSeparator || str === formatProvider.numberGroupSeparator || str === formatProvider.percentDecimalSeparator || str === formatProvider.percentGroupSeparator || str === formatProvider.percentSymbol || str === formatProvider.perMilleSymbol || str === formatProvider.positiveInfinitySymbol || str === formatProvider.positiveSign)
                        {
                            return true
                        }
                    }
                    return false
                };
                NumberFormatDigital.prototype.IsSpecialSymbol = function(c)
                {
                    if (this.IsStandardNumberSymbol(c))
                    {
                        return false
                    }
                    if (char.IsWhiteSpace(c))
                    {
                        return true
                    }
                    return false
                };
                NumberFormatDigital.prototype.TrimCurrencySymbol = function(s)
                {
                    if (!s)
                    {
                        return s
                    }
                    var formatProvider = this.NumberFormatInfo() ? this.NumberFormatInfo() : DefaultTokens.NumberFormatInfo();
                    if (formatProvider)
                    {
                        var currencySymbol = formatProvider.currencySymbol;
                        var index = s.toString().indexOf(currencySymbol);
                        if (index === 0 && index === s.lastIndexOf(currencySymbol))
                        {
                            s = s.substr(1)
                        }
                    }
                    return s
                };
                NumberFormatDigital.keyWordsSet = function()
                {
                    var selfClass = NumberFormatDigital;
                    if (!selfClass._keyWordsSet)
                    {
                        var obj = {};
                        for (var i = 0; i < selfClass.keywords.length; i++)
                        {
                            obj[selfClass.keywords[i]] = true
                        }
                        selfClass._keyWordsSet = obj
                    }
                    return selfClass._keyWordsSet
                };
                NumberFormatDigital.EvaluateFormat = function(format)
                {
                    return NumberFormatBase.ContainsKeywords(format, NumberFormatDigital.keywords, NumberFormatDigital.keyWordsSet())
                };
                NumberFormatDigital.GetFraction = function(value, denominatorDigits, out_integer, out_numerator, out_denominator)
                {
                    return NumberHelper.GetFraction(value, denominatorDigits, out_integer, out_numerator, out_denominator)
                };
                NumberFormatDigital.prototype.GetGCD = function(value1, value2)
                {
                    if (value1 == 0.0)
                        return Math_abs(value2);
                    if (value2 == 0.0)
                        return Math_abs(value1);
                    var max = Math_max(value1, value2);
                    var min = Math_min(value1, value2);
                    var value3 = max % min;
                    while (value3 != 0.0)
                    {
                        max = min;
                        min = value3;
                        value3 = max % min
                    }
                    return Math_abs(min)
                };
                NumberFormatDigital.defaultNumberStringConverter = new DefaultNumberStringConverter;
                NumberFormatDigital.keywords = [DefaultTokens.Exponential1, DefaultTokens.Exponential2, DefaultTokens.NumberSign, DefaultTokens.DecimalSeparator, DefaultTokens.numberGroupSeparator, DefaultTokens.percentSymbol, DefaultTokens.Zero, DefaultTokens.SolidusSign];
                return NumberFormatDigital
            })(NumberFormatBase);
        var NumberFormatGeneral = (function(_super)
            {
                __extends(NumberFormatGeneral, _super);
                function NumberFormatGeneral(format, partLocaleID, dbNumberFormatPart, cultureName)
                {
                    _super.call(this, partLocaleID, dbNumberFormatPart, cultureName);
                    this.digitalFormat = keyword_null;
                    this.exponentialDigitalFormat = keyword_null;
                    this.fullFormatString = keyword_null;
                    this._classNames.push("NumberFormatGeneral");
                    if (arguments.length > 0)
                    {
                        if (NumberFormatGeneral.EvaluateFormat(format))
                        {
                            if (format.indexOf(DefaultTokens.Zero) >= 0 || format.indexOf(DefaultTokens.NumberSign) >= 0 || format.indexOf(DefaultTokens.DecimalSeparator) >= 0 || format.indexOf(DefaultTokens.CommercialAt) >= 0)
                            {
                                throw Sheets.SR.Exp_FormatIllegal;
                            }
                            this.fullFormatString = format
                        }
                        else
                        {
                            throw Sheets.SR.Exp_FormatIllegal;
                        }
                    }
                    else
                    {
                        this.fullFormatString = NumberFormatBase.General
                    }
                }
                NumberFormatGeneral.prototype.DigitalFormat = function()
                {
                    var self = this;
                    if (!self.digitalFormat)
                    {
                        var nfStringTmp = self.fullFormatString;
                        nfStringTmp = DefaultTokens.ReplaceKeyword(nfStringTmp, NumberFormatBase.General, NumberFormatGeneral.GeneralNumber);
                        self.digitalFormat = new NumberFormatDigital(nfStringTmp, self.PartLocaleID(), self.PartDBNumberFormat(), self.CultureName());
                        self.digitalFormat.IsGeneralNumber(true)
                    }
                    return self.digitalFormat
                };
                NumberFormatGeneral.prototype.ExponentialDigitalFormat = function()
                {
                    var self = this;
                    if (!self.exponentialDigitalFormat)
                    {
                        self.exponentialDigitalFormat = new NumberFormatDigital("0.#####E+00", self.PartLocaleID(), self.PartDBNumberFormat(), self.CultureName());
                        self.exponentialDigitalFormat.IsGeneralNumber(true)
                    }
                    return self.exponentialDigitalFormat
                };
                NumberFormatGeneral.prototype.FormatString = function()
                {
                    return Sheets.StringHelper.Replace(this.fullFormatString, NumberFormatGeneral.GeneralPlaceholder, NumberFormatBase.General)
                };
                NumberFormatGeneral.prototype.Format = function(obj)
                {
                    var self = this;
                    if (Sheets.FormatConverter.IsNumber(obj))
                    {
                        var allowS = !self.PartLocaleID() ? true : self.PartLocaleID().AllowScience();
                        var d = Sheets.FormatConverter.ToDouble(obj);
                        if (d !== keyword_undefined && d !== keyword_null)
                        {
                            if ((Math_abs(d) > 99999999999 && allowS) || (Math_abs(d) < 1E-11 && d !== 0))
                            {
                                return self.ExponentialDigitalFormat().Format(obj)
                            }
                            else
                            {
                                return self.DigitalFormat().Format(obj)
                            }
                        }
                    }
                    else if (Sheets.util.isType(obj, "string"))
                    {
                        var formatTmp = Sheets.StringHelper.Replace(self.FormatString(), '"', '');
                        formatTmp = DefaultTokens.TrimEscape(formatTmp);
                        if (formatTmp)
                        {
                            return Sheets.StringHelper.Replace(formatTmp, "General", obj)
                        }
                        return obj
                    }
                    else if (Sheets.util.isType(obj, "boolean"))
                    {
                        return obj.toString().toUpperCase()
                    }
                    return ""
                };
                NumberFormatGeneral.prototype.Parse = function(s)
                {
                    if (stringEx.IsNullOrEmpty(s))
                    {
                        return keyword_null
                    }
                    var hasMin = false;
                    var minIndex = Sheets.StringHelper.IndexOf(s, "-");
                    if (minIndex > 0)
                    {
                        if (!DefaultTokens.IsEquals(s.charAt(minIndex - 1), DefaultTokens.ExponentialSymbol, true))
                        {
                            hasMin = true
                        }
                    }
                    if (Sheets.StringHelper.Contains(s, "/") || hasMin || Sheets.StringHelper.Contains(s, ":") || Sheets.StringHelper.Contains(s, "-"))
                    {
                        var dt = Sheets._DateTimeHelper.parseLocale(s);
                        if (dt)
                        {
                            return dt
                        }
                    }
                    var tmp = s;
                    var result = keyword_null;
                    var hasSignNegative = keyword_null;
                    if (tmp.charAt(0) === DefaultTokens.negativeSign)
                    {
                        hasSignNegative = true
                    }
                    else if (tmp.charAt(0) === DefaultTokens.NumberFormatInfo().positiveSign)
                    {
                        hasSignNegative = false
                    }
                    var hasParenthesis = false;
                    if (hasSignNegative)
                    {
                        if (tmp.length > 3)
                        {
                            if (tmp.charAt(1) === DefaultTokens.LeftParenthesis && tmp.charAt(tmp.length - 1) === DefaultTokens.RightParenthesis)
                            {
                                hasParenthesis = true
                            }
                        }
                    }
                    if (hasSignNegative && hasParenthesis)
                    {
                        result = this.DigitalFormat().Parse(Sheets.StringHelper.Remove(s, 0, 1));
                        if (result)
                        {
                            if (Sheets.util.isType(result, "number"))
                            {
                                return Math_abs(result) * (hasSignNegative ? -1 : 1)
                            }
                            return result
                        }
                    }
                    else
                    {
                        result = this.DigitalFormat().Parse(s);
                        if (result !== keyword_undefined && result !== keyword_null)
                        {
                            return result
                        }
                    }
                    return s
                };
                NumberFormatGeneral.GeneralMonthDay = function()
                {
                    return ["M/d", "MMM/d", "MMMM/d", "d/M", "d/MMM", "d/MMMM", "M-d", "MMM-d", "MMMM-d", "d-M", "d-MMM", "d-MMMM"]
                };
                NumberFormatGeneral.GeneralYearMonth = function()
                {
                    return ["M/y", "MMM/y", "M/yyyy", "MMM/yyyy", "M-y", "MMM-y", "M-yyyy", "MMM-yyyy"]
                };
                NumberFormatGeneral.GeneralYearMonthDay = function()
                {
                    return ["M/d/y", "MMM/d/y", "MMMM/d/y", "M/d/yyyy", "MMM/d/yyyy", "MMMM/d/yyyy", "d/M/y", "d/MMM/y", "d/MMMM/y", "d/M/yyyy", "d/MMM/yyyy", "d/MMMM/yyyy", "yyyy/M/d", "M-d-y", "MMM-d-y", "MMMM-d-y", "M-d-yyyy", "MMM-d-yyyy", "MMMM-d-yyyy", "d-M-y", "d-MMM-y", "d-MMMM-y", "d-M-yyyy", "d-MMM-yyyy", "d-MMMM-yyyy", "yyyy-M-d"]
                };
                NumberFormatGeneral.GeneralHourMinute = function()
                {
                    return ["H:m", "h:m tt"]
                };
                NumberFormatGeneral.GeneralHourMinuteWithDate = function()
                {
                    return ["M/d H:m", "MMM/d H:m", "MMMM/d H:m", "d/M H:m", "d/MMM H:m", "d/MMMM H:m", "M/y H:m", "MMM/y H:m", "M/yyyy H:m", "MMM/yyyy H:m", "M/d/y H:m", "MMM/d/y H:m", "MMMM/d/y H:m", "M/d/yyyy H:m", "MMM/d/yyyy H:m", "MMMM/d/yyyy H:m", "M-d H:m", "MMM-d H:m", "MMMM-d H:m", "d-M H:m", "d-MMM H:m", "d-MMMM H:m", "M-y H:m", "MMM-y H:m", "M-yyyy H:m", "MMM-yyyy H:m", "M-d-y H:m", "MMM-d-y H:m", "MMMM-d-y H:m", "M-d-yyyy H:m", "MMM-d-yyyy H:m", "MMMM-d-yyyy H:m", "M/d h:m tt", "MMM/d h:m tt", "MMMM/d h:m tt", "d/M h:m tt", "d/MMM h:m tt", "d/MMMM h:m tt", "M/y h:m tt", "MMM/y h:m tt", "M/yyyy h:m tt", "MMM/yyyy h:m tt", "M/d/y h:m tt", "MMM/d/y h:m tt", "MMMM/d/y h:m tt", "M/d/yyyy h:m tt", "MMM/d/yyyy h:m tt", "MMMM/d/yyyy h:m tt", "M-d h:m tt", "MMM-d h:m tt", "MMMM-d h:m tt", "d-M h:m tt", "d-MMM h:m tt", "d-MMMM h:m tt", "M-y h:m tt", "MMM-y h:m tt", "M-yyyy h:m tt", "MMM-yyyy h:m tt", "M-d-y h:m tt", "MMM-d-y h:m tt", "MMMM-d-y h:m tt", "M-d-yyyy h:m tt", "MMM-d-yyyy h:m tt", "MMMM-d-yyyy h:m tt"]
                };
                NumberFormatGeneral.GeneralHourMinuteSecond = function()
                {
                    return ["H:m:s", "h:m:s tt", "H:m:s", "h:mm:ss tt"]
                };
                NumberFormatGeneral.GeneralHourMinuteSecondSubSecond = function()
                {
                    return ["H:m:s.FFF", "h:m:s.FFF tt"]
                };
                NumberFormatGeneral.GeneralHourMinuteSecondWithDate = function()
                {
                    return ["M/d H:m:s", "MMM/d H:m:s", "MMMM/d H:m:s", "d/M H:m:s", "d/MMM H:m:s", "d/MMMM H:m:s", "M/y H:m:s", "MMM/y H:m:s", "M/yyyy H:m:s", "MMM/yyyy H:m:s", "M/d/y H:m:s", "MMM/d/y H:m:s", "MMMM/d/y H:m:s", "M/d/yyyy H:m:s", "MMM/d/yyyy H:m:s", "MMMM/d/yyyy H:m:s", "d/M/y H:m:s", "d/MMM/y H:m:s", "d/MMMM/y H:m:s", "d/M/yyyy H:m:s", "d/MMM/yyyy H:m:s", "d/MMMM/yyyy H:m:s", "yyyy/M/d H:m:s", "M-d H:m:s", "MMM-d H:m:s", "MMMM-d H:m:s", "d-M H:m:s", "d-MMM H:m:s", "d-MMMM H:m:s", "M-y H:m:s", "MMM-y H:m:s", "M-yyyy H:m:s", "MMM-yyyy H:m:s", "M-d-y H:m:s", "MMM-d-y H:m:s", "MMMM-d-y H:m:s", "M-d-yyyy H:m:s", "MMM-d-yyyy H:m:s", "MMMM-d-yyyy H:m:s", "d-M-y H:m:s", "d-MMM-y H:m:s", "d-MMMM-y H:m:s", "d-M-yyyy H:m:s", "d-MMM-yyyy H:m:s", "d-MMMM-yyyy H:m:s", "yyyy-M-d H:m:s", "M/d h:m:s tt", "MMM/d h:m:s tt", "MMMM/d h:m:s tt", "d/M h:m:s tt", "d/MMM h:m:s tt", "d/MMMM h:m:s tt", "M/y h:m:s tt", "MMM/y h:m:s tt", "M/yyyy h:m:s tt", "MMM/yyyy h:m:s tt", "M/d/y h:m:s tt", "MMM/d/y h:m:s tt", "MMMM/d/y h:m:s tt", "M/d/yyyy h:m:s tt", "MMM/d/yyyy h:m:s tt", "MMMM/d/yyyy h:m:s tt", "d/M/y h:m:s tt", "d/MMM/y h:m:s tt", "d/MMMM/y h:m:s tt", "d/M/yyyy h:m:s tt", "d/MMM/yyyy h:m:s tt", "d/MMMM/yyyy h:m:s tt", "yyyy/M/d h:m:s tt", "M/d/yyyy h:mm:ss tt", "M-d h:m:s tt", "MMM-d h:m:s tt", "MMMM-d h:m:s tt", "d-M h:m:s tt", "d-MMM h:m:s tt", "d-MMMM h:m:s tt", "M-y h:m:s tt", "MMM-y h:m:s tt", "M-yyyy h:m:s tt", "MMM-yyyy h:m:s tt", "M-d-y h:m:s tt", "MMM-d-y h:m:s tt", "MMMM-d-y h:m:s tt", "M-d-yyyy h:m:s tt", "MMM-d-yyyy h:m:s tt", "MMMM-d-yyyy h:m:s tt", "d-M-y h:m:s tt", "d-MMM-y h:m:s tt", "d-MMMM-y h:m:s tt", "d-M-yyyy h:m:s tt", "d-MMM-yyyy h:m:s tt", "d-MMMM-yyyy h:m:s tt", "yyyy-M-d h:m:s tt"]
                };
                NumberFormatGeneral.GeneralHourMinuteSecondSubSecondWithDate = function()
                {
                    return ["M/d H:m:s.FFF", "MMM/d H:m:s.FFF", "MMMM/d H:m:s.FFF", "d/M H:m:s.FFF", "d/MMM H:m:s.FFF", "d/MMMM H:m:s.FFF", "M/y H:m:s.FFF", "MMM/y H:m:s.FFF", "M/yyyy H:m:s.FFF", "MMM/yyyy H:m:s.FFF", "d/M/y H:m", "d/MMM/y H:m", "d/MMMM/y H:m", "d/M/yyyy H:m", "d/mmm/yyyy H:m", "d/MMMM/yyyy H:m", "yyyy/M/d H:m", "M/d/y H:m:s.FFF", "MMM/d/y H:m:s.FFF", "MMMM/d/y H:m:s.FFF", "M/d/yyyy H:m:s", "MMM/d/yyyy H:m:s.FFF", "MMMM/d/yyyy H:m:s.FFF", "d/M/y H:m:s.FFF", "d/MMM/y H:m:s.FFF", "d/MMMM/y H:m:s.FFF", "d/M/yyyy H:m:s.FFF", "d/MMM/yyyy H:m:s.FFF", "d/MMMM/yyyy H:m:s.FFF", "yyyy/M/d H:m:s.FFF", "M-d H:m:s.FFF", "MMM-d H:m:s.FFF", "MMMM-d H:m:s.FFF", "d-M H:m:s.FFF", "d-MMM H:m:s.FFF", "d-MMMM H:m:s.FFF", "M-y H:m:s.FFF", "MMM-y H:m:s.FFF", "M-yyyy H:m:s.FFF", "MMM-Yyyy H:m:s.FFF", "d-M-y H:m", "d-MMM-y H:m", "d-MMMM-y H:m", "d-M-yyyy H:m", "d-MMM-yyyy H:m", "d-MMMM-yyyy H:m", "yyyy-M-d H:m", "M-d-y H:m:s.FFF", "MMM-d-y H:m:s.FFF", "MMMM-d-y H:m:s.FFF", "M-d-yyyy H:m:s", "MMM-d-yyyy H:m:s.FFF", "MMMM-d-yyyy H:m:s.FFF", "D-M-y H:m:s.FFF", "d-MMM-y H:m:s.FFF", "d-MMMM-y H:m:s.FFF", "D-M-yyyy H:m:s.FFF", "d-MMM-yyyy H:m:s.FFF", "d-MMMM-yyyy H:m:s.FFF", "yyyy-M-d H:m:s.FFF", "M/d h:m:s.FFF tt", "MMM/d h:m:s.FFF tt", "MMMM/d h:m:s.FFF tt", "d/M h:m:s.FFF tt", "d/MMM h:m:s.FFF tt", "d/MMMM h:m:s.FFF tt", "M/y h:m:s.FFF tt", "MMM/y h:m:s.FFF tt", "M/yyyy h:m:s.FFF tt", "MMM/yyyy h:m:s.FFF tt", "d/M/y h:m tt", "d/MMM/y h:m tt", "d/MMMM/y h:m tt", "d/M/yyyy h:m tt", "d/mmm/yyyy h:m tt", "d/MMMM/yyyy h:m tt", "yyyy/M/d h:m tt", "M/d/y h:m:s.FFF tt", "MMM/d/y h:m:s.FFF tt", "MMMM/d/y h:m:s.FFF tt", "M/d/yyyy h:m:s tt", "MMM/d/yyyy h:m:s.FFF tt", "MMMM/d/yyyy h:m:s.FFF tt", "d/M/y h:m:s.FFF tt", "d/MMM/y h:m:s.FFF tt", "d/MMMM/y h:m:s.FFF tt", "d/M/yyyy h:m:s.FFF tt", "d/MMM/yyyy h:m:s.FFF tt", "d/MMMM/yyyy h:m:s.FFF tt", "yyyy/M/d h:m:s.FFF tt", "M-d h:m:s.FFF tt", "MMM-d h:m:s.FFF tt", "MMMM-d h:m:s.FFF tt", "d-M h:m:s.FFF tt", "d-MMM h:m:s.FFF tt", "d-MMMM h:m:s.FFF tt", "M-y h:m:s.FFF tt", "MMM-y h:m:s.FFF tt", "M-yyyy h:m:s.FFF tt", "MMM-Yyyy h:m:s.FFF tt", "d-M-y h:m tt", "d-MMM-y h:m tt", "d-MMMM-y h:m tt", "d-M-yyyy h:m tt", "d-MMM-yyyy h:m tt", "d-MMMM-yyyy h:m tt", "yyyy-M-d h:m tt", "M-d-y h:m:s.FFF tt", "MMM-d-y h:m:s.FFF tt", "MMMM-d-y h:m:s.FFF tt", "M-d-yyyy H:m:s tt", "MMM-d-yyyy H:m:s.FFF tt", "MMMM-d-yyyy h:m:s.FFF tt", "d-M-y h:m:s.FFF tt", "d-MMM-y h:m:s.FFF tt", "d-MMMM-y h:m:s.FFF tt", "d-M-yyyy h:m:s.FFF tt", "d-MMM-yyyy h:m:s.FFF tt", "d-MMMM-yyyy h:m:s.FFF tt", "yyyy-M-d h:m:s.FFF tt"]
                };
                NumberFormatGeneral.EvaluateFormat = function(format)
                {
                    if (!format || format === stringEx.Empty)
                    {
                        return false
                    }
                    var baseClass = NumberFormatBase;
                    return baseClass.ContainsKeywords(format, baseClass._keywords, baseClass._keywordsSet)
                };
                NumberFormatGeneral.GeneralPlaceholder = "@NumberFormat";
                NumberFormatGeneral.GeneralNumber = "##################0.################";
                return NumberFormatGeneral
            })(NumberFormatBase);
        var CustomFormatterBase = (function()
            {
                function CustomFormatterBase(format, cultureName)
                {
                    this.formatCached = format;
                    this.cultureName = cultureName;
                    this.typeName = ""
                }
                CustomFormatterBase.prototype.Format = function(obj, conditionalForeColor)
                {
                    return keyword_null
                };
                CustomFormatterBase.prototype.Parse = function(str)
                {
                    return keyword_null
                };
                CustomFormatterBase.prototype.FormatString = function()
                {
                    return this.formatCached
                };
                CustomFormatterBase.prototype.toJSON = function()
                {
                    var settings = {};
                    for (var p in this)
                    {
                        if (this.hasOwnProperty(p))
                        {
                            settings[p] = this[p]
                        }
                    }
                    return settings
                };
                CustomFormatterBase.prototype.fromJSON = function(settings)
                {
                    if (!settings)
                    {
                        return
                    }
                    for (var p in settings)
                    {
                        if (settings[p] !== keyword_undefined)
                        {
                            this[p] = settings[p]
                        }
                    }
                };
                return CustomFormatterBase
            })();
        Sheets.CustomFormatterBase = CustomFormatterBase
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

