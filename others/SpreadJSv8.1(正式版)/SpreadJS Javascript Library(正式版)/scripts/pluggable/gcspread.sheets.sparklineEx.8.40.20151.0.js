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
        Sheets.feature("sparklineEx", ["core.theme"]);
        var keyword_null = null,
            keyword_undefined = undefined,
            CalcConvert = Sheets.Calc.Convert,
            Math_floor = Math.floor,
            Math_PI = Math.PI,
            Math_sin = Math.sin,
            Math_cos = Math.cos,
            Math_min = Math.min,
            Math_max = Math.max,
            Math_round = Math.round,
            Math_pow = Math.pow,
            Math_sqrt = Math.sqrt,
            Math_random = Math.random,
            Math_abs = Math.abs,
            Math_ceil = Math.ceil,
            const_undefined = "undefined",
            const_string = "string";
        var SparklineExValue = (function()
            {
                function SparklineExValue(name, value)
                {
                    this.name = name;
                    this.value = value
                }
                return SparklineExValue
            })();
        Sheets.SparklineExValue = SparklineExValue;
        var SparklineEx = (function()
            {
                function SparklineEx()
                {
                    var customFunction = this.createFunction();
                    if (customFunction)
                    {
                        var name = customFunction.name;
                        var oldEvaluate = customFunction.evaluate;
                        customFunction.evaluate = function(args)
                        {
                            var value = oldEvaluate.call(this, args);
                            if (value)
                            {
                                return new SparklineExValue(name, value)
                            }
                            return keyword_null
                        };
                        this._name = name;
                        if (name && !Sheets.Calc.Functions.findGlobalFunction(name))
                        {
                            Sheets.Calc.Functions._customFunctions[name] = customFunction
                        }
                    }
                    this.typeName = ""
                }
                SparklineEx.prototype.name = function()
                {
                    return this._name
                };
                SparklineEx.prototype.createFunction = function()
                {
                    return keyword_null
                };
                SparklineEx.prototype.getAllValuesFromReference = function(reference)
                {
                    var resultArray = [];
                    if (CalcConvert.ref(reference))
                    {
                        var rangesCount = reference.getRangeCount();
                        for (var i = 0; i < rangesCount; i++)
                        {
                            var rowCount = reference.getRowCount(i),
                                colCount = reference.getColumnCount(i);
                            for (var r = 0; r < rowCount; r++)
                            {
                                for (var c = 0; c < colCount; c++)
                                {
                                    resultArray.push(reference.getValue(i, r, c))
                                }
                            }
                        }
                    }
                    return resultArray
                };
                SparklineEx.prototype.getRangeValuesFromReference = function(reference, rangeIndex)
                {
                    var resultArray = [];
                    if (CalcConvert.ref(reference))
                    {
                        var rangesCount = reference.getRangeCount();
                        if (rangesCount > rangeIndex)
                        {
                            var rowCount = reference.getRowCount(rangeIndex),
                                colCount = reference.getColumnCount(rangeIndex);
                            for (var r = 0; r < rowCount; r++)
                            {
                                resultArray[r] = [];
                                for (var c = 0; c < colCount; c++)
                                {
                                    resultArray[r].push(reference.getValue(rangeIndex, r, c))
                                }
                            }
                        }
                    }
                    return resultArray
                };
                SparklineEx.prototype.getFirstValueFromReference = function(reference)
                {
                    var result;
                    if (CalcConvert.ref(reference))
                    {
                        result = reference.getValue(0, 0, 0)
                    }
                    else if (reference !== keyword_null && typeof(reference) !== const_undefined)
                    {
                        result = reference
                    }
                    return result
                };
                SparklineEx.prototype._paintSparkline = function(context, value, x, y, width, height, sheet)
                {
                    this.paint(context, value, x, y, width, height)
                };
                SparklineEx.prototype.paint = function(context, value, x, y, width, height){};
                SparklineEx.prototype.toJSON = function()
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
                SparklineEx.prototype.fromJSON = function(settings)
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
                return SparklineEx
            })();
        Sheets.SparklineEx = SparklineEx;
        var PieSparklineValue = (function()
            {
                function PieSparklineValue(values, colors)
                {
                    this.values = values;
                    this.colors = colors
                }
                return PieSparklineValue
            })();
        Sheets.PieSparklineValue = PieSparklineValue;
        var PieSparkline = (function(_super)
            {
                __extends(PieSparkline, _super);
                function PieSparkline()
                {
                    _super.call(this)
                }
                PieSparkline.prototype._getValues = function(reference)
                {
                    var resultArray = this.getAllValuesFromReference(reference);
                    if (resultArray.length <= 0)
                    {
                        if (reference !== keyword_null && typeof(reference) !== const_undefined)
                        {
                            resultArray.push(reference)
                        }
                    }
                    return resultArray
                };
                PieSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var func = new Sheets.Calc.Functions.Function("PIESPARKLINE", 1, 255);
                    var self = this;
                    func.evaluate = function(args)
                    {
                        var values = self._getValues(args[0]),
                            colors = Array.prototype.slice.call(args, 1);
                        return new PieSparklineValue(values, colors)
                    };
                    func.acceptsReference = function(argIndex)
                    {
                        return argIndex === 0
                    };
                    return func
                };
                PieSparkline.prototype._fixValues = function(values)
                {
                    var newValues = [],
                        temp;
                    for (var i = 0, j = 0, length = values.length; i < length; i++)
                    {
                        temp = values[i];
                        if (temp !== keyword_null && typeof(temp) !== const_undefined && !isNaN(temp) && isFinite(temp))
                        {
                            if (temp < 0)
                            {
                                temp = -temp
                            }
                            newValues[j++] = temp
                        }
                        else
                        {
                            newValues[j++] = 0
                        }
                    }
                    if (values.length === 1 && newValues.length === 1)
                    {
                        newValues[1] = 1 - newValues[0]
                    }
                    return newValues
                };
                PieSparkline.prototype._fixColors = function(valueCount, colors)
                {
                    var newColors = [],
                        colorCount = colors.length;
                    if (valueCount <= colorCount)
                    {
                        newColors = colors.slice(0, valueCount)
                    }
                    else
                    {
                        if (colorCount === 0)
                        {
                            newColors.push("darkgray");
                            colorCount = 1
                        }
                        else
                        {
                            newColors = colors.slice(0)
                        }
                        var baseColors = [],
                            color,
                            r,
                            g,
                            b,
                            len = valueCount - colorCount + 1;
                        for (var i = 0; i < colorCount; i++)
                        {
                            baseColors[i] = Sheets._Color.parse(newColors[i])
                        }
                        for (var i = colorCount; i < valueCount; i++)
                        {
                            color = baseColors[i % colorCount];
                            r = color.r;
                            g = color.g;
                            b = color.b;
                            r -= (r / len) * (i / colorCount);
                            g -= (g / len) * (i / colorCount);
                            b -= (b / len) * (i / colorCount);
                            newColors[i] = new Sheets._Color(255, Math_floor(r), Math_floor(g), Math_floor(b)).toString()
                        }
                    }
                    return newColors
                };
                PieSparkline.prototype.paint = function(context, value, x, y, width, height)
                {
                    var centerX = x + width / 2,
                        centerY = y + height / 2,
                        margin = 5,
                        radius = Math_min(width, height) / 2 - margin,
                        fromAngle = -0.5 * Math_PI,
                        toAngle,
                        XOnCircle = centerX + radius * Math_cos(fromAngle),
                        YOnCircle = centerY + radius * Math_sin(fromAngle),
                        XOnCircleCacheArray = [],
                        YOnCircleCacheArray = [];
                    if (radius <= 0)
                    {
                        return
                    }
                    var values = this._fixValues(value.values),
                        length = values.length,
                        colors = this._fixColors(length, value.colors);
                    var sum = 0;
                    for (var i = 0; i < length; i++)
                    {
                        sum += values[i]
                    }
                    context.save();
                    for (var i = 0; i < length; i++)
                    {
                        toAngle = fromAngle + values[i] / sum * 2 * Math_PI;
                        context.beginPath();
                        context.moveTo(centerX, centerY);
                        context.lineTo(XOnCircle, YOnCircle);
                        context.arc(centerX, centerY, radius, fromAngle, toAngle, false);
                        context.lineTo(centerX, centerY);
                        context.fillStyle = colors[i];
                        context.fill();
                        XOnCircleCacheArray.push(XOnCircle);
                        YOnCircleCacheArray.push(YOnCircle);
                        fromAngle = toAngle;
                        XOnCircle = centerX + radius * Math_cos(fromAngle);
                        YOnCircle = centerY + radius * Math_sin(fromAngle)
                    }
                    context.strokeStyle = "white";
                    for (var i = 0; i < length; i++)
                    {
                        context.beginPath();
                        context.moveTo(centerX, centerY);
                        context.lineTo(XOnCircleCacheArray[i], YOnCircleCacheArray[i]);
                        context.stroke()
                    }
                    context.restore()
                };
                return PieSparkline
            })(SparklineEx);
        Sheets.PieSparkline = PieSparkline;
        var AreaPoint = (function()
            {
                function AreaPoint(x, y, value)
                {
                    this.x = x;
                    this.y = y;
                    this.value = value
                }
                return AreaPoint
            })();
        var AreaSparklineValue = (function()
            {
                function AreaSparklineValue(points, mini, maxi, line1, line2, colorPositive, colorNegative)
                {
                    var self = this;
                    self.points = points;
                    self.mini = mini;
                    self.maxi = maxi;
                    self.line1 = line1;
                    self.line2 = line2;
                    self.colorPositive = colorPositive;
                    self.colorNegative = colorNegative
                }
                return AreaSparklineValue
            })();
        Sheets.AreaSparklineValue = AreaSparklineValue;
        var AreaSparkline = (function(_super)
            {
                __extends(AreaSparkline, _super);
                function AreaSparkline()
                {
                    _super.call(this)
                }
                AreaSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var func = new Sheets.Calc.Functions.Function("AREASPARKLINE", 1, 7);
                    var self = this;
                    func.evaluate = function(args)
                    {
                        var points = self.getAllValuesFromReference(args[0]),
                            mini = args[1],
                            maxi = args[2],
                            line1 = args[3],
                            line2 = args[4],
                            colorPositive = args[5],
                            colorNegative = args[6];
                        return new AreaSparklineValue(points, mini, maxi, line1, line2, colorPositive, colorNegative)
                    };
                    func.acceptsReference = function(argIndex)
                    {
                        return argIndex === 0
                    };
                    return func
                };
                AreaSparkline.prototype._fixValues = function(values)
                {
                    var newValues = [],
                        temp;
                    for (var i = 0, j = 0, length = values.length; i < length; i++)
                    {
                        temp = values[i];
                        if (temp !== keyword_null && typeof(temp) !== const_undefined && !isNaN(temp) && isFinite(temp))
                        {
                            newValues[j++] = temp
                        }
                        else
                        {
                            newValues[j++] = 0
                        }
                    }
                    return newValues
                };
                AreaSparkline.prototype._rangeMin = function(array)
                {
                    var min = array[0],
                        temp;
                    for (var i = 1, length = array.length; i < length; i++)
                    {
                        temp = array[i];
                        if (min > temp)
                        {
                            min = temp
                        }
                    }
                    return min
                };
                AreaSparkline.prototype._rangeMax = function(array)
                {
                    var max = array[0],
                        temp;
                    for (var i = 1, length = array.length; i < length; i++)
                    {
                        temp = array[i];
                        if (max < temp)
                        {
                            max = temp
                        }
                    }
                    return max
                };
                AreaSparkline.prototype._getXInStraightLine = function(x1, y1, x2, y2, y)
                {
                    return ((y1 - y) * x2 + (y - y2) * x1) / (y1 - y2)
                };
                AreaSparkline.prototype.paint = function(context, value, x, y, width, height)
                {
                    context.save();
                    var self = this;
                    var points = value.points,
                        mini = value.mini,
                        maxi = value.maxi,
                        line1 = value.line1,
                        line2 = value.line2,
                        colorPositive = value.colorPositive,
                        colorNegative = value.colorNegative,
                        margin = 5,
                        line1Position,
                        line2Position,
                        minTag,
                        maxTag,
                        sngMin,
                        sngMax,
                        line1Value,
                        line2Value,
                        threshold,
                        pointsCount,
                        plotLeft,
                        plotTop,
                        plotWidth,
                        plotHeight,
                        sngIntvX,
                        sngIntvY,
                        adjustY;
                    points = self._fixValues(points);
                    if (colorPositive === keyword_null || typeof(colorPositive) === const_undefined)
                    {
                        colorPositive = "#787878"
                    }
                    if (colorNegative === keyword_null || typeof(colorNegative) == const_undefined)
                    {
                        colorNegative = "#CB0000"
                    }
                    minTag = self._rangeMin(points);
                    if (mini === keyword_null || typeof(mini) === const_undefined)
                    {
                        mini = minTag
                    }
                    sngMin = Math_min(mini, minTag);
                    maxTag = self._rangeMax(points);
                    if (maxi === keyword_null || typeof(maxi) === const_undefined)
                    {
                        maxi = maxTag
                    }
                    sngMax = Math_max(maxi, maxTag);
                    threshold = 0;
                    if (sngMin > 0)
                    {
                        sngMin = 0
                    }
                    if (sngMax < 0)
                    {
                        sngMax = 0
                    }
                    if (threshold > sngMax)
                    {
                        threshold = sngMax
                    }
                    if (threshold < sngMin)
                    {
                        threshold = sngMin - 1
                    }
                    pointsCount = points.length;
                    plotLeft = x + margin;
                    plotTop = y + margin;
                    plotWidth = width - 2 * margin;
                    plotHeight = height - 2 * margin;
                    sngIntvX = plotWidth / (pointsCount - 1);
                    sngIntvY = (sngMax - sngMin) / plotHeight;
                    var polyArray = [],
                        currentPoint,
                        poly,
                        prevPoly,
                        thresholdX,
                        thresholdY = plotTop + (sngMax - threshold) / sngIntvY,
                        currentPointX,
                        currentPointY;
                    for (var i = 0; i < pointsCount; i++)
                    {
                        currentPoint = points[i];
                        currentPointX = plotLeft + sngIntvX * i;
                        currentPointY = plotTop + (sngMax - currentPoint) / sngIntvY;
                        if (i === 0)
                        {
                            polyArray.push(new AreaPoint(currentPointX, thresholdY, threshold))
                        }
                        if (i > 0)
                        {
                            if (currentPoint * points[i - 1] < 0)
                            {
                                prevPoly = polyArray[polyArray.length - 1];
                                if (prevPoly)
                                {
                                    thresholdX = self._getXInStraightLine(prevPoly.x, prevPoly.y, currentPointX, currentPointY, thresholdY);
                                    polyArray.push(new AreaPoint(thresholdX, thresholdY, threshold))
                                }
                            }
                        }
                        polyArray.push(new AreaPoint(currentPointX, currentPointY, currentPoint));
                        if (i === pointsCount - 1)
                        {
                            polyArray.push(new AreaPoint(currentPointX, thresholdY, threshold))
                        }
                    }
                    context.beginPath();
                    for (var k = 0, polyArrayLength = polyArray.length; k < polyArrayLength; k++)
                    {
                        poly = polyArray[k];
                        if (poly)
                        {
                            context.lineTo(poly.x, poly.y);
                            prevPoly = polyArray[k - 1];
                            if (poly.value === threshold && prevPoly)
                            {
                                context.fillStyle = prevPoly.value > threshold ? colorPositive : colorNegative;
                                context.fill();
                                if (k !== polyArrayLength - 1)
                                {
                                    context.beginPath();
                                    context.lineTo(poly.x, poly.y)
                                }
                            }
                        }
                    }
                    if (line1 !== keyword_null || typeof(line1) === const_undefined)
                    {
                        line1Value = line1;
                        if (line1Value > sngMax)
                        {
                            line1Value = sngMax
                        }
                        if (line1Value < sngMin)
                        {
                            line1Value = sngMin
                        }
                        adjustY = sngIntvY !== 0 ? (sngMax - line1Value) / sngIntvY : plotHeight / 2;
                        line1Position = Math_round(plotTop + adjustY) - 0.5;
                        context.beginPath();
                        context.moveTo(plotLeft, line1Position);
                        context.lineTo(plotLeft + plotWidth, line1Position);
                        context.strokeStyle = "blue";
                        context.stroke()
                    }
                    if (line2 !== keyword_null || typeof(line2) === const_undefined)
                    {
                        line2Value = line2;
                        if (line2Value > sngMax)
                        {
                            line2Value = sngMax
                        }
                        if (line2Value < sngMin)
                        {
                            line2Value = sngMin
                        }
                        adjustY = sngIntvY !== 0 ? (sngMax - line2Value) / sngIntvY : plotHeight / 2;
                        line2Position = Math_round(plotTop + adjustY) - 0.5;
                        context.beginPath();
                        context.moveTo(plotLeft, line2Position);
                        context.lineTo(plotLeft + plotWidth, line2Position);
                        context.strokeStyle = "blue";
                        context.stroke()
                    }
                    context.restore()
                };
                return AreaSparkline
            })(SparklineEx);
        Sheets.AreaSparkline = AreaSparkline;
        var ScatterPoint = (function()
            {
                function ScatterPoint(x, y)
                {
                    this.x = x;
                    this.y = y
                }
                return ScatterPoint
            })();
        var ScatterSparklineValue = (function()
            {
                function ScatterSparklineValue(points1, points2, minX, maxX, minY, maxY, hLine, vLine, xMinZone, xMaxZone, yMinZone, yMaxZone, tags, drawSymbol, drawLines, color1, color2, dash)
                {
                    var self = this;
                    self.points1 = points1;
                    self.points2 = points2;
                    self.minX = minX;
                    self.maxX = maxX;
                    self.minY = minY;
                    self.maxY = maxY;
                    self.hLine = hLine;
                    self.vLine = vLine;
                    self.xMinZone = xMinZone;
                    self.xMaxZone = xMaxZone;
                    self.yMinZone = yMinZone;
                    self.yMaxZone = yMaxZone;
                    self.tags = tags;
                    self.drawSymbol = drawSymbol;
                    self.drawLines = drawLines;
                    self.color1 = color1;
                    self.color2 = color2;
                    self.dash = dash
                }
                return ScatterSparklineValue
            })();
        Sheets.ScatterSparklineValue = ScatterSparklineValue;
        var ScatterSparkline = (function(_super)
            {
                __extends(ScatterSparkline, _super);
                function ScatterSparkline()
                {
                    _super.call(this)
                }
                ScatterSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var func = new Sheets.Calc.Functions.Function("SCATTERSPARKLINE", 1, 18);
                    var self = this;
                    func.evaluate = function(args)
                    {
                        var points1 = self.getRangeValuesFromReference(args[0], 0),
                            points2 = self.getRangeValuesFromReference(args[1], 0),
                            minX = args[2],
                            maxX = args[3],
                            minY = args[4],
                            maxY = args[5],
                            hLine = args[6],
                            vLine = args[7],
                            xMinZone = args[8],
                            xMaxZone = args[9],
                            yMinZone = args[10],
                            yMaxZone = args[11],
                            tags = args[12],
                            drawSymbol = args[13],
                            drawLines = args[14],
                            color1 = args[15],
                            color2 = args[16],
                            dash = args[17];
                        return new ScatterSparklineValue(points1, points2, minX, maxX, minY, maxY, hLine, vLine, xMinZone, xMaxZone, yMinZone, yMaxZone, tags, drawSymbol, drawLines, color1, color2, dash)
                    };
                    func.acceptsReference = function(argIndex)
                    {
                        return argIndex === 0 || argIndex === 1
                    };
                    return func
                };
                ScatterSparkline.prototype._getScatterPoints = function(points)
                {
                    var scatterPoints = [],
                        rowCount,
                        colCount;
                    rowCount = points.length;
                    if (rowCount > 0)
                    {
                        colCount = points[0].length;
                        if (rowCount < colCount)
                        {
                            if (rowCount >= 2)
                            {
                                for (var c = 0; c < colCount; c++)
                                {
                                    scatterPoints.push(new ScatterPoint(points[0][c], points[1][c]))
                                }
                            }
                        }
                        else
                        {
                            if (colCount >= 2)
                            {
                                for (var r = 0; r < rowCount; r++)
                                {
                                    scatterPoints.push(new ScatterPoint(points[r][0], points[r][1]))
                                }
                            }
                        }
                    }
                    return scatterPoints
                };
                ScatterSparkline.prototype._getMinScatterPoint = function(scatterPoints)
                {
                    var min = new ScatterPoint(Number.MAX_VALUE, Number.MAX_VALUE),
                        length = scatterPoints.length,
                        point;
                    for (var i = 0; i < length; i++)
                    {
                        point = scatterPoints[i];
                        if (min.x > point.x)
                        {
                            min.x = point.x
                        }
                        if (min.y > point.y)
                        {
                            min.y = point.y
                        }
                    }
                    return min
                };
                ScatterSparkline.prototype._getMaxScatterPoint = function(scatterPoints)
                {
                    var max = new ScatterPoint(-Number.MAX_VALUE, -Number.MAX_VALUE),
                        length = scatterPoints.length,
                        point;
                    for (var i = 0; i < length; i++)
                    {
                        point = scatterPoints[i];
                        if (max.x < point.x)
                        {
                            max.x = point.x
                        }
                        if (max.y < point.y)
                        {
                            max.y = point.y
                        }
                    }
                    return max
                };
                ScatterSparkline.prototype._getXInStraightLine = function(x1, x2, length, totalLength)
                {
                    return length / totalLength * (x2 - x1) + x1
                };
                ScatterSparkline.prototype._paintLine = function(context, startX, startY, endX, endY, color, isDashed)
                {
                    if (isDashed)
                    {
                        var self = this;
                        var totalLength = Math_sqrt(Math_pow(endX - startX, 2) + Math_pow(endY - startY, 2)),
                            paintedLength = 0,
                            longLength = 6,
                            shortLength = 2,
                            intervalLength = 4;
                        var scatterPoints = [],
                            minX,
                            maxX,
                            x,
                            y;
                        if (startX <= endX)
                        {
                            minX = startX;
                            maxX = endX;
                            x = startX;
                            y = startY
                        }
                        else
                        {
                            minX = endX;
                            maxX = startX;
                            x = endX;
                            y = endY
                        }
                        var k = (endY - startY) / (endX - startX),
                            b = startY - k * startX;
                        scatterPoints.push(new ScatterPoint(x, y));
                        while (paintedLength < totalLength)
                        {
                            paintedLength += longLength;
                            if (paintedLength <= totalLength)
                            {
                                x = self._getXInStraightLine(minX, maxX, paintedLength, totalLength);
                                y = k * x + b;
                                scatterPoints.push(new ScatterPoint(x, y))
                            }
                            paintedLength += intervalLength;
                            if (paintedLength <= totalLength)
                            {
                                x = self._getXInStraightLine(minX, maxX, paintedLength, totalLength);
                                y = k * x + b;
                                scatterPoints.push(new ScatterPoint(x, y))
                            }
                            paintedLength += shortLength;
                            if (paintedLength <= totalLength)
                            {
                                x = self._getXInStraightLine(minX, maxX, paintedLength, totalLength);
                                y = k * x + b;
                                scatterPoints.push(new ScatterPoint(x, y))
                            }
                            paintedLength += intervalLength;
                            if (paintedLength <= totalLength)
                            {
                                x = self._getXInStraightLine(minX, maxX, paintedLength, totalLength);
                                y = k * x + b;
                                scatterPoints.push(new ScatterPoint(x, y))
                            }
                        }
                        context.strokeStyle = color;
                        for (var i = 0, point, length = scatterPoints.length; i < length - 1; i += 2)
                        {
                            context.beginPath();
                            point = scatterPoints[i];
                            context.moveTo(point.x, point.y);
                            point = scatterPoints[i + 1];
                            context.lineTo(point.x, point.y);
                            context.stroke()
                        }
                    }
                    else
                    {
                        context.beginPath();
                        context.moveTo(startX, startY);
                        context.lineTo(endX, endY);
                        context.strokeStyle = color;
                        context.stroke()
                    }
                };
                ScatterSparkline.prototype.paint = function(context, value, x, y, width, height)
                {
                    var self = this;
                    var points1 = value.points1,
                        points2 = value.points2,
                        minX = value.minX,
                        maxX = value.maxX,
                        minY = value.minY,
                        maxY = value.maxY,
                        hLine = value.hLine,
                        vLine = value.vLine,
                        xMinZone = value.xMinZone,
                        xMaxZone = value.xMaxZone,
                        yMinZone = value.yMinZone,
                        yMaxZone = value.yMaxZone,
                        tags = value.tags,
                        drawSymbol = value.drawSymbol,
                        drawLines = value.drawLines,
                        color1 = value.color1,
                        color2 = value.color2,
                        dash = value.dash,
                        symbolSize = 4,
                        margin = 5,
                        plotLeft = x + margin,
                        plotTop = y + margin,
                        plotWidth = width - 2 * margin,
                        plotHeight = height - 2 * margin,
                        scatterPoints1,
                        scatterPoints2,
                        dblMinY,
                        dblMaxY,
                        dblMinX,
                        dblMaxX,
                        i,
                        point,
                        length,
                        dblXLeft,
                        dblYLeft,
                        dblXRight,
                        dblYRight,
                        saveX,
                        saveY,
                        saveX2,
                        saveY2,
                        tagMinX,
                        tagMinY,
                        tagMaxX,
                        tagMaxY,
                        linePosition;
                    if (!points1 || points1.length <= 0)
                    {
                        return
                    }
                    scatterPoints1 = self._getScatterPoints(points1);
                    if (scatterPoints1.length <= 0)
                    {
                        return
                    }
                    if (points2 && points2.length > 0)
                    {
                        scatterPoints2 = self._getScatterPoints(points2);
                        if (scatterPoints2.length <= 0)
                        {
                            return
                        }
                    }
                    context.save();
                    context.rect(x, y, width, height);
                    context.clip();
                    context.beginPath();
                    if (drawSymbol === keyword_null || typeof(drawSymbol) === const_undefined)
                    {
                        drawSymbol = true
                    }
                    if (color1 === keyword_null || typeof(color1) === const_undefined)
                    {
                        color1 = "#969696"
                    }
                    if (color2 === keyword_null || typeof(color2) === const_undefined)
                    {
                        color2 = "#CB0000"
                    }
                    if (minY !== keyword_null && typeof(minY) !== const_undefined)
                    {
                        dblMinY = minY
                    }
                    else
                    {
                        dblMinY = self._getMinScatterPoint(scatterPoints1).y
                    }
                    if (maxY !== keyword_null && typeof(maxY) !== const_undefined)
                    {
                        dblMaxY = maxY
                    }
                    else
                    {
                        dblMaxY = self._getMaxScatterPoint(scatterPoints1).y
                    }
                    if (minX !== keyword_null && typeof(minX) !== const_undefined)
                    {
                        dblMinX = minX
                    }
                    else
                    {
                        dblMinX = self._getMinScatterPoint(scatterPoints1).x
                    }
                    if (maxX !== keyword_null && typeof(maxX) !== const_undefined)
                    {
                        dblMaxX = maxX
                    }
                    else
                    {
                        dblMaxX = self._getMaxScatterPoint(scatterPoints1).x
                    }
                    if (dblMinX >= dblMaxX)
                    {
                        dblMaxX = dblMinX + 1
                    }
                    if (dblMinY >= dblMaxY)
                    {
                        dblMaxY = dblMinY + 1
                    }
                    if (xMinZone !== keyword_null && typeof(xMinZone) !== const_undefined && xMaxZone !== keyword_null && typeof(xMaxZone) !== const_undefined && yMinZone !== keyword_null && typeof(yMinZone) !== const_undefined && yMaxZone !== keyword_null && typeof(yMaxZone) !== const_undefined && dblMinX <= xMinZone && xMinZone <= dblMaxX && dblMinX <= xMaxZone && xMaxZone <= dblMaxX && dblMinY <= yMinZone && yMinZone <= dblMaxY && dblMinY <= yMaxZone && yMaxZone <= dblMaxY)
                    {
                        var zoneLeft = Math_max(dblMinX, xMinZone),
                            zoneRight = Math_min(dblMaxX, xMaxZone),
                            zoneBottom = Math_max(dblMinY, yMinZone),
                            zoneTop = Math_min(dblMaxY, yMaxZone);
                        if (zoneLeft >= zoneRight)
                        {
                            zoneRight = zoneLeft + 1
                        }
                        if (zoneBottom >= zoneTop)
                        {
                            zoneTop = zoneBottom + 1
                        }
                        context.beginPath();
                        context.fillStyle = "#DCDCDC";
                        context.fillRect(plotLeft + (zoneLeft - dblMinX) * plotWidth / (dblMaxX - dblMinX), plotTop + (dblMaxY - zoneTop) * plotHeight / (dblMaxY - dblMinY), (zoneRight - zoneLeft) * plotWidth / (dblMaxX - dblMinX), (zoneTop - zoneBottom) * plotHeight / (dblMaxY - dblMinY))
                    }
                    tagMinX = -Number.MAX_VALUE;
                    tagMinY = -Number.MAX_VALUE;
                    tagMaxX = Number.MAX_VALUE;
                    tagMaxY = Number.MAX_VALUE;
                    for (i = 0, length = scatterPoints1.length; i < length - 1; i++)
                    {
                        point = scatterPoints1[i];
                        dblXLeft = point.x;
                        dblYLeft = point.y,
                        point = scatterPoints1[i + 1];
                        dblXRight = point.x,
                        dblYRight = point.y;
                        saveX = plotLeft + (dblXLeft - dblMinX) * plotWidth / (dblMaxX - dblMinX);
                        saveX2 = plotLeft + (dblXRight - dblMinX) * plotWidth / (dblMaxX - dblMinX);
                        saveY = plotTop + (dblMaxY - dblYLeft) * plotHeight / (dblMaxY - dblMinY);
                        saveY2 = plotTop + (dblMaxY - dblYRight) * plotHeight / (dblMaxY - dblMinY);
                        if (drawLines)
                        {
                            self._paintLine(context, saveX, saveY, saveX2, saveY2, color1, dash)
                        }
                        if (drawSymbol)
                        {
                            if (i === 0)
                            {
                                context.beginPath();
                                context.strokeStyle = color1;
                                context.arc(saveX - symbolSize / 2, saveY - symbolSize / 2, symbolSize / 2, 0, Math_PI * 2, false);
                                context.stroke()
                            }
                            context.beginPath();
                            context.strokeStyle = color1;
                            context.arc(saveX2 - symbolSize / 2, saveY2 - symbolSize / 2, symbolSize / 2, 0, Math_PI * 2, false);
                            context.stroke()
                        }
                        if (tags)
                        {
                            if (i === 0)
                            {
                                if (saveY > tagMinY)
                                {
                                    tagMinX = saveX;
                                    tagMinY = saveY
                                }
                                if (saveY < tagMaxY)
                                {
                                    tagMaxX = saveX;
                                    tagMaxY = saveY
                                }
                            }
                            if (saveY2 > tagMinY)
                            {
                                tagMinX = saveX2;
                                tagMinY = saveY2
                            }
                            if (saveY2 < tagMaxY)
                            {
                                tagMaxX = saveX2;
                                tagMaxY = saveY2
                            }
                        }
                    }
                    if (points2 && points2.length > 0)
                    {
                        if (minY === keyword_null || typeof(minY) === const_undefined)
                        {
                            dblMinY = self._getMinScatterPoint(scatterPoints2).y
                        }
                        if (maxY === keyword_null || typeof(maxY) === const_undefined)
                        {
                            dblMaxY = self._getMaxScatterPoint(scatterPoints2).y
                        }
                        if (minX === keyword_null || typeof(minX) === const_undefined)
                        {
                            dblMinX = self._getMinScatterPoint(scatterPoints2).x
                        }
                        if (maxX === keyword_null || typeof(maxX) === const_undefined)
                        {
                            dblMaxX = self._getMaxScatterPoint(scatterPoints2).x
                        }
                        if (dblMinX >= dblMaxX)
                        {
                            dblMaxX = dblMinX + 1
                        }
                        if (dblMinY >= dblMaxY)
                        {
                            dblMaxY = dblMinY + 1
                        }
                        for (i = 0, length = scatterPoints2.length; i < length - 1; i++)
                        {
                            point = scatterPoints2[i];
                            dblXLeft = point.x;
                            dblYLeft = point.y,
                            point = scatterPoints2[i + 1];
                            dblXRight = point.x,
                            dblYRight = point.y;
                            saveX = plotLeft + (dblXLeft - dblMinX) * plotWidth / (dblMaxX - dblMinX);
                            saveX2 = plotLeft + (dblXRight - dblMinX) * plotWidth / (dblMaxX - dblMinX);
                            saveY = plotTop + (dblMaxY - dblYLeft) * plotHeight / (dblMaxY - dblMinY);
                            saveY2 = plotTop + (dblMaxY - dblYRight) * plotHeight / (dblMaxY - dblMinY);
                            if (drawLines)
                            {
                                self._paintLine(context, saveX, saveY, saveX2, saveY2, color2, dash)
                            }
                            if (drawSymbol)
                            {
                                if (i === 0)
                                {
                                    context.beginPath();
                                    context.strokeStyle = color2;
                                    context.strokeRect(saveX - symbolSize / 2, saveY - symbolSize / 2, symbolSize, symbolSize)
                                }
                                context.beginPath();
                                context.strokeStyle = color2;
                                context.strokeRect(saveX2 - symbolSize / 2, saveY2 - symbolSize / 2, symbolSize, symbolSize)
                            }
                        }
                    }
                    if (tags)
                    {
                        context.beginPath();
                        context.arc(tagMinX - symbolSize / 2, tagMinY - symbolSize / 2, symbolSize / 2, 0, Math_PI * 2, false);
                        context.fillStyle = "#CB0000";
                        context.fill();
                        context.beginPath();
                        context.arc(tagMaxX - symbolSize / 2, tagMaxY - symbolSize / 2, symbolSize / 2, 0, Math_PI * 2, false);
                        context.fillStyle = "#0000FF";
                        context.fill()
                    }
                    if (hLine !== keyword_null && typeof(hLine) !== const_undefined)
                    {
                        if (dblMinY <= hLine && hLine <= dblMaxY)
                        {
                            linePosition = Math_round(plotTop + (dblMaxY - hLine) * plotHeight / (dblMaxY - dblMinY)) - 0.5;
                            self._paintLine(context, plotLeft, linePosition, plotLeft + plotWidth, linePosition, "#CB0000")
                        }
                    }
                    if (vLine !== keyword_null && typeof(vLine) !== const_undefined)
                    {
                        if (dblMinX <= vLine && vLine <= dblMaxX)
                        {
                            linePosition = Math_round(plotLeft + (vLine - dblMinX) * plotWidth / (dblMaxX - dblMinX)) - 0.5;
                            self._paintLine(context, linePosition, plotTop, linePosition, plotTop + plotHeight, "#CB0000")
                        }
                    }
                    context.restore()
                };
                return ScatterSparkline
            })(SparklineEx);
        Sheets.ScatterSparkline = ScatterSparkline;
        var CompatibleSparkline = (function(_super)
            {
                __extends(CompatibleSparkline, _super);
                function CompatibleSparkline()
                {
                    _super.call(this)
                }
                CompatibleSparkline.prototype._parseSetting = function(jsonSetting)
                {
                    var setting = {},
                        inBracket = false,
                        inProperty = true,
                        property = "",
                        value = "";
                    if (jsonSetting)
                    {
                        jsonSetting = jsonSetting.substr(1, jsonSetting.length - 2);
                        for (var i = 0, len = jsonSetting.length; i < len; i++)
                        {
                            var char = jsonSetting.charAt(i);
                            if (char === ":")
                            {
                                inProperty = false
                            }
                            else if (char === "," && !inBracket)
                            {
                                setting[property] = value;
                                property = "";
                                value = "";
                                inProperty = true
                            }
                            else if (char === "\'" || char === "\"")
                            {}
                            else
                            {
                                if (char === "(")
                                {
                                    inBracket = true
                                }
                                else if (char === ")")
                                {
                                    inBracket = false
                                }
                                if (inProperty)
                                {
                                    property += char
                                }
                                else
                                {
                                    value += char
                                }
                            }
                        }
                        if (property)
                        {
                            setting[property] = value
                        }
                        for (var p in setting)
                        {
                            var v = setting[p];
                            if (v !== keyword_null && typeof(v) !== const_undefined)
                            {
                                if (v.toUpperCase() === "TRUE")
                                {
                                    setting[p] = true
                                }
                                else if (v.toUpperCase() === "FALSE")
                                {
                                    setting[p] = false
                                }
                                else if (!isNaN(v) && isFinite(v))
                                {
                                    setting[p] = parseFloat(v)
                                }
                            }
                        }
                    }
                    return setting
                };
                CompatibleSparkline.prototype._createCustomFunction = function(name, type)
                {
                    var func = new Sheets.Calc.Functions.Function(name, 2, 5);
                    var self = this;
                    func.evaluate = function(args)
                    {
                        var args0 = args[0];
                        if (CalcConvert.ref(args0))
                        {
                            var rangesCount = args0.getRangeCount();
                            if (rangesCount > 0)
                            {
                                var dataReference = new Sheets.Range(args0.getRow(0), args0.getColumn(0), args0.getRowCount(0), args0.getColumnCount(0));
                                var dataOrientation = args[1];
                                var args2 = args[2],
                                    dateAxisRange,
                                    dateAxisOrientation;
                                if (CalcConvert.ref(args2))
                                {
                                    rangesCount = args2.getRangeCount();
                                    if (rangesCount > 0)
                                    {
                                        dateAxisRange = new Sheets.Range(args2.getRow(0), args2.getColumn(0), args2.getRowCount(0), args2.getColumnCount(0));
                                        dateAxisOrientation = args[3]
                                    }
                                }
                                var setting = new Sheets.SparklineSetting,
                                    jsonSetting = args[4];
                                if (jsonSetting)
                                {
                                    var obj = self._parseSetting(jsonSetting);
                                    var actualProp;
                                    var dict = {
                                            AXISCOLOR: "_axisColor", FIRSTMARKERCOLOR: "_firstMarkerColor", HIGHMARKERCOLOR: "_highMarkerColor", LASTMARKERCOLOR: "_lastMarkerColor", LOWMARKERCOLOR: "_lowMarkerColor", MARKERSCOLOR: "_markersColor", NEGATIVECOLOR: "_negativeColor", SERIESCOLOR: "_seriesColor", DISPLAYEMPTYCELLSAS: "displayEmptyCellsAs", RIGHTTOLEFT: "rightToLeft", DISPLAYHIDDEN: "displayHidden", DISPLAYXAXIS: "displayXAxis", SHOWFIRST: "_showFirst", SHOWHIGH: "_showHigh", SHOWLAST: "_showLast", SHOWLOW: "_showLow", SHOWNEGATIVE: "_showNegative", SHOWMARKERS: "_showMarkers", MANUALMAX: "manualMax", MANUALMIN: "manualMin", MAXAXISTYPE: "maxAxisType", MINAXISTYPE: "minAxisType", LINEWEIGHT: "lineWeight"
                                        };
                                    for (var prop in obj)
                                    {
                                        if (prop)
                                        {
                                            actualProp = dict[prop.toUpperCase()];
                                            if (actualProp)
                                            {
                                                setting[actualProp] = obj[prop]
                                            }
                                        }
                                    }
                                    var shortDict = {
                                            AC: "_axisColor", FMC: "_firstMarkerColor", HMC: "_highMarkerColor", LASTMC: "_lastMarkerColor", LOWMC: "_lowMarkerColor", MC: "_markersColor", NC: "_negativeColor", SC: "_seriesColor", DECA: "displayEmptyCellsAs", RTL: "rightToLeft", DH: "displayHidden", DXA: "displayXAxis", SF: "_showFirst", SH: "_showHigh", SLAST: "_showLast", SLOW: "_showLow", SN: "_showNegative", SM: "_showMarkers", MMAX: "manualMax", MMIN: "manualMin", MAXAT: "maxAxisType", MINAT: "minAxisType", LW: "lineWeight"
                                        };
                                    for (var prop in obj)
                                    {
                                        if (prop)
                                        {
                                            actualProp = shortDict[prop.toUpperCase()];
                                            if (actualProp)
                                            {
                                                setting[actualProp] = obj[prop]
                                            }
                                        }
                                    }
                                    if (setting.maxAxisType === 1)
                                    {
                                        setting.maxAxisType = 0
                                    }
                                    if (setting.minAxisType === 1)
                                    {
                                        setting.minAxisType = 0
                                    }
                                    setting.rightToLeft = !!setting.rightToLeft;
                                    setting.displayHidden = !!setting.displayHidden;
                                    setting.displayXAxis = !!setting.displayXAxis;
                                    setting._showFirst = !!setting._showFirst;
                                    setting._showHigh = !!setting._showHigh;
                                    setting._showLast = !!setting._showLast;
                                    setting._showLow = !!setting._showLow;
                                    setting._showNegative = !!setting._showNegative;
                                    setting._showMarkers = !!setting._showMarkers
                                }
                                var sparkline = new Sheets.SparklineValue(-1, -1, dataReference, dataOrientation, type, setting);
                                if (dateAxisRange && typeof(dateAxisOrientation) !== const_undefined && dateAxisOrientation !== keyword_null)
                                {
                                    sparkline.dateAxisData(dateAxisRange);
                                    sparkline.dateAxisOrientation(dateAxisOrientation);
                                    sparkline.group().displayDateAxis = true
                                }
                                sparkline.cachedValues = self.getRangeValuesFromReference(args0, 0);
                                sparkline.cachedDatetimes = self.getRangeValuesFromReference(args2, 0);
                                return sparkline
                            }
                        }
                    };
                    func.acceptsReference = function(argIndex)
                    {
                        return argIndex === 0 || argIndex === 2
                    };
                    return func
                };
                CompatibleSparkline.prototype._fixValues = function(values, sheet, displayHidden, range, orientation, isDatetime)
                {
                    var ret = [],
                        isHorizontal = orientation === 1;
                    if (range)
                    {
                        for (var i = 0, count = isHorizontal ? range.colCount : range.rowCount; i < count; i++)
                        {
                            var rowOffset = isHorizontal ? 0 : i,
                                colOffset = isHorizontal ? i : 0,
                                value = values[rowOffset][colOffset];
                            if (!displayHidden && (sheet.getRowHeight(range.row + rowOffset) <= 0 || sheet.getColumnWidth(range.col + colOffset) <= 0))
                            {
                                value = NaN
                            }
                            else
                            {
                                if (value !== keyword_null && typeof(value) !== const_undefined)
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
                    }
                    return ret
                };
                CompatibleSparkline.prototype._paintSparkline = function(context, value, x, y, width, height, sheet)
                {
                    if (!Sheets.features.sparkline)
                    {
                        return
                    }
                    var sparkline = value,
                        cachedValues = sparkline.cachedValues,
                        cachedDatetimes = sparkline.cachedDatetimes,
                        zoomFactor = sheet._zoomFactor,
                        render = new Sheets.SparklineRender(sparkline),
                        setting = sparkline.setting(),
                        displayHidden = setting.displayHidden;
                    cachedValues = this._fixValues(cachedValues, sheet, displayHidden, sparkline.data(), sparkline.dataOrientation());
                    cachedDatetimes = this._fixValues(cachedDatetimes, sheet, displayHidden, sparkline.dateAxisData(), sparkline.dateAxisOrientation(), true);
                    setting._setThemeContext(sheet);
                    render._paintCore(context, x, y, width, height, cachedValues, cachedDatetimes, zoomFactor)
                };
                return CompatibleSparkline
            })(SparklineEx);
        Sheets.CompatibleSparkline = CompatibleSparkline;
        var LineSparkline = (function(_super)
            {
                __extends(LineSparkline, _super);
                function LineSparkline()
                {
                    _super.apply(this, arguments)
                }
                LineSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc() || !Sheets.features.sparkline)
                    {
                        return keyword_null
                    }
                    return _super.prototype._createCustomFunction.call(this, "LINESPARKLINE", 0)
                };
                return LineSparkline
            })(CompatibleSparkline);
        Sheets.LineSparkline = LineSparkline;
        var ColumnSparkline = (function(_super)
            {
                __extends(ColumnSparkline, _super);
                function ColumnSparkline()
                {
                    _super.apply(this, arguments)
                }
                ColumnSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc() || !Sheets.features.sparkline)
                    {
                        return keyword_null
                    }
                    return _super.prototype._createCustomFunction.call(this, "COLUMNSPARKLINE", 1)
                };
                return ColumnSparkline
            })(CompatibleSparkline);
        Sheets.ColumnSparkline = ColumnSparkline;
        var WinlossSparkline = (function(_super)
            {
                __extends(WinlossSparkline, _super);
                function WinlossSparkline()
                {
                    _super.apply(this, arguments)
                }
                WinlossSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc() || !Sheets.features.sparkline)
                    {
                        return keyword_null
                    }
                    return _super.prototype._createCustomFunction.call(this, "WINLOSSSPARKLINE", 2)
                };
                return WinlossSparkline
            })(CompatibleSparkline);
        Sheets.WinlossSparkline = WinlossSparkline;
        var BulletSparklineValue = (function()
            {
                function BulletSparklineValue(measure, target, maxi, good, bad, forecast, tickUnit, colorScheme, vertical)
                {
                    var self = this;
                    self.measure = measure;
                    self.target = target;
                    self.maxi = maxi;
                    self.good = good;
                    self.bad = bad;
                    self.forecast = forecast;
                    self.tickUnit = tickUnit;
                    self.colorScheme = colorScheme;
                    self.vertical = vertical
                }
                return BulletSparklineValue
            })();
        Sheets.BulletSparklineValue = BulletSparklineValue;
        var BulletSparkline = (function(_super)
            {
                __extends(BulletSparkline, _super);
                function BulletSparkline()
                {
                    _super.call(this)
                }
                BulletSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var func = new Sheets.Calc.Functions.Function("BULLETSPARKLINE", 3, 9);
                    var self = this;
                    func.evaluate = function(args)
                    {
                        var measure = self.getFirstValueFromReference(args[0]),
                            target = self.getFirstValueFromReference(args[1]),
                            maxi = self.getFirstValueFromReference(args[2]),
                            good = self.getFirstValueFromReference(args[3]),
                            bad = self.getFirstValueFromReference(args[4]),
                            forecast = self.getFirstValueFromReference(args[5]),
                            tickUnit = self.getFirstValueFromReference(args[6]),
                            colorScheme = args[7],
                            vertical = args[8];
                        return new BulletSparklineValue(measure, target, maxi, good, bad, forecast, tickUnit, colorScheme, vertical)
                    };
                    func.acceptsReference = function(argIndex)
                    {
                        return 0 <= argIndex && argIndex <= 6
                    };
                    return func
                };
                BulletSparkline.prototype._lightenColor = function(colorString, percentLighter)
                {
                    var color = Sheets._Color.parse(colorString);
                    var hls = new Sheets.HLSColor(color);
                    var lighterColor = hls.getLighterColor(percentLighter);
                    return lighterColor.toString()
                };
                BulletSparkline.prototype.paint = function(context, value, x, y, width, height)
                {
                    var self = this,
                        measure = value.measure,
                        target = value.target,
                        maxi = value.maxi,
                        good = value.good,
                        bad = value.bad,
                        forecast = value.forecast,
                        tickUnit = value.tickUnit,
                        colorScheme = value.colorScheme,
                        vertical = value.vertical,
                        margin = 5;
                    if (maxi === keyword_null || typeof(maxi) === const_undefined || maxi < 0)
                    {
                        return
                    }
                    if (measure === keyword_null || typeof(measure) === const_undefined || measure < 0)
                    {
                        measure = 0
                    }
                    if (good === keyword_null || typeof(good) === const_undefined || good < 0)
                    {
                        good = 0
                    }
                    if (bad === keyword_null || typeof(bad) === const_undefined || bad < 0)
                    {
                        bad = 0
                    }
                    if (target === keyword_null || typeof(target) === const_undefined)
                    {
                        target = 0
                    }
                    if (forecast === keyword_null || typeof(forecast) === const_undefined)
                    {
                        forecast = 0
                    }
                    if (tickUnit === keyword_null || typeof(tickUnit) === const_undefined)
                    {
                        tickUnit = 0
                    }
                    if (colorScheme === keyword_null || typeof(colorScheme) === const_undefined)
                    {
                        colorScheme = "#A0A0A0"
                    }
                    var measureBarColor = "#252525";
                    if (measure > maxi)
                    {
                        measure = maxi;
                        measureBarColor = "#CB0000"
                    }
                    if (good > maxi)
                    {
                        good = maxi;
                        measureBarColor = "#CB0000"
                    }
                    if (bad > maxi)
                    {
                        bad = maxi;
                        measureBarColor = "#CB0000"
                    }
                    if (target > maxi)
                    {
                        target = 0;
                        measureBarColor = "#CB0000"
                    }
                    if (forecast > maxi)
                    {
                        forecast = maxi;
                        measureBarColor = "#CB0000"
                    }
                    var plotLeft,
                        plotWidth;
                    if (vertical)
                    {
                        plotLeft = y + height - margin;
                        plotWidth = height - 2 * margin
                    }
                    else
                    {
                        plotLeft = x + margin;
                        plotWidth = width - 2 * margin
                    }
                    context.save();
                    context.fillStyle = self._lightenColor(colorScheme, 1.66);
                    if (vertical)
                    {
                        context.fillRect(x + width * 0.2, plotLeft - plotWidth, width * 0.6, plotWidth)
                    }
                    else
                    {
                        context.fillRect(plotLeft, y + height * 0.2, plotWidth, height * 0.6)
                    }
                    var startGood = plotLeft,
                        endGood = plotWidth * (good / maxi);
                    if (endGood > plotWidth)
                    {
                        endGood = plotWidth
                    }
                    context.fillStyle = self._lightenColor(colorScheme, 1.33);
                    if (vertical)
                    {
                        context.fillRect(x + width * 0.2, startGood - endGood, width * 0.6, endGood)
                    }
                    else
                    {
                        context.fillRect(startGood, y + height * 0.2, endGood, height * 0.6)
                    }
                    var startBad = plotLeft,
                        endBad = plotWidth * (bad / maxi);
                    if (endBad > plotWidth)
                    {
                        endBad = plotWidth
                    }
                    context.fillStyle = colorScheme;
                    if (vertical)
                    {
                        context.fillRect(x + width * 0.2, startBad - endBad, width * 0.6, endBad)
                    }
                    else
                    {
                        context.fillRect(startBad, y + height * 0.2, endBad, height * 0.6)
                    }
                    var startMeasure = plotLeft,
                        endMeasure = plotWidth * (measure / maxi);
                    if (endMeasure > plotWidth)
                    {
                        endMeasure = plotWidth
                    }
                    context.fillStyle = measureBarColor;
                    if (vertical)
                    {
                        context.fillRect(x + width * 0.375, startMeasure - endMeasure, width * 0.25, endMeasure)
                    }
                    else
                    {
                        context.fillRect(startMeasure, y + height * 0.375, endMeasure, height * 0.25)
                    }
                    if (forecast > 0)
                    {
                        var startForecast = plotLeft,
                            endForecast = plotWidth * (forecast / maxi);
                        if (endForecast > plotWidth)
                        {
                            endForecast = plotWidth
                        }
                        context.strokeStyle = "#3690BF";
                        context.lineWidth = 3;
                        context.beginPath();
                        if (vertical)
                        {
                            context.moveTo(x + width * 0.5, startForecast);
                            context.lineTo(x + width * 0.5, startForecast - endForecast)
                        }
                        else
                        {
                            context.moveTo(startForecast, y + height * 0.5);
                            context.lineTo(startForecast + endForecast, y + height * 0.5)
                        }
                        context.stroke()
                    }
                    if (target > 0)
                    {
                        var startTarget;
                        context.strokeStyle = "#CB0000";
                        context.lineWidth = 1;
                        context.beginPath();
                        if (vertical)
                        {
                            startTarget = Math_round(plotLeft - plotWidth * (target / maxi)) - 0.5;
                            context.moveTo(x + width * 0.2, startTarget);
                            context.lineTo(x + width * 0.8, startTarget)
                        }
                        else
                        {
                            startTarget = Math_round(plotLeft + plotWidth * (target / maxi)) - 0.5;
                            context.moveTo(startTarget, y + height * 0.2);
                            context.lineTo(startTarget, y + height * 0.8)
                        }
                        context.stroke()
                    }
                    if (tickUnit > 0)
                    {
                        var numTicks = Math_floor(maxi / tickUnit),
                            xMark;
                        context.strokeStyle = "#646464";
                        context.lineWidth = 1;
                        for (var i = 0; i <= numTicks; i++)
                        {
                            context.beginPath();
                            if (vertical)
                            {
                                xMark = Math_round(plotLeft - (plotWidth / maxi * tickUnit) * i) - 0.5;
                                context.moveTo(x, xMark);
                                context.lineTo(x + width * 0.05, xMark)
                            }
                            else
                            {
                                xMark = Math_round(plotLeft + (plotWidth / maxi * tickUnit) * i) - 0.5;
                                context.moveTo(xMark, y + height);
                                context.lineTo(xMark, y + height * 0.95)
                            }
                            context.stroke()
                        }
                    }
                    context.restore()
                };
                return BulletSparkline
            })(SparklineEx);
        Sheets.BulletSparkline = BulletSparkline;
        var SpreadSparklineData = (function()
            {
                function SpreadSparklineData(key, value)
                {
                    this.key = key;
                    this.value = value
                }
                return SpreadSparklineData
            })();
        Sheets.SpreadSparklineData = SpreadSparklineData;
        (function(SpreadSparklineStyle)
        {
            SpreadSparklineStyle[SpreadSparklineStyle["Stacked"] = 1] = "Stacked";
            SpreadSparklineStyle[SpreadSparklineStyle["Spread"] = 2] = "Spread";
            SpreadSparklineStyle[SpreadSparklineStyle["Jitter"] = 3] = "Jitter";
            SpreadSparklineStyle[SpreadSparklineStyle["Poles"] = 4] = "Poles";
            SpreadSparklineStyle[SpreadSparklineStyle["StackedDots"] = 5] = "StackedDots";
            SpreadSparklineStyle[SpreadSparklineStyle["Stripe"] = 6] = "Stripe"
        })(Sheets.SpreadSparklineStyle || (Sheets.SpreadSparklineStyle = {}));
        var SpreadSparklineStyle = Sheets.SpreadSparklineStyle;
        var SpreadSparklineValue = (function()
            {
                function SpreadSparklineValue(spreadData, showAverage, scaleStart, scaleEnd, style, colorScheme, vertical)
                {
                    var self = this;
                    self.spreadData = spreadData;
                    self.showAverage = showAverage;
                    self.scaleStart = scaleStart;
                    self.scaleEnd = scaleEnd;
                    self.style = style;
                    self.colorScheme = colorScheme;
                    self.vertical = vertical
                }
                return SpreadSparklineValue
            })();
        Sheets.SpreadSparklineValue = SpreadSparklineValue;
        var SpreadSparkline = (function(_super)
            {
                __extends(SpreadSparkline, _super);
                function SpreadSparkline()
                {
                    _super.call(this)
                }
                SpreadSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var func = new Sheets.Calc.Functions.Function("SPREADSPARKLINE", 1, 7);
                    var self = this;
                    func.evaluate = function(args)
                    {
                        var points = self.getAllValuesFromReference(args[0]),
                            showAverage = args[1],
                            scaleStart = args[2],
                            scaleEnd = args[3],
                            style = args[4],
                            colorScheme = args[5],
                            vertical = args[6];
                        var spreadSparklineDataArray = [];
                        if (points !== keyword_null && typeof(points) !== const_undefined)
                        {
                            points = self._fixValues(points);
                            spreadSparklineDataArray = self._toArray(points);
                            if (style === 3)
                            {
                                for (var i = 0, pointCount = spreadSparklineDataArray.length; i < pointCount; i++)
                                {
                                    var p = spreadSparklineDataArray[i],
                                        pValue = p.value,
                                        randomNumbers = [],
                                        MAX_ATTEMPT_TIMES = Math_max(100, pValue * 10);
                                    for (var k = 0; k < MAX_ATTEMPT_TIMES + pValue - 1; k++)
                                    {
                                        randomNumbers.push(Math_random())
                                    }
                                    p.randomNumbers = randomNumbers
                                }
                            }
                        }
                        return new SpreadSparklineValue(spreadSparklineDataArray, showAverage, scaleStart, scaleEnd, style, colorScheme, vertical)
                    };
                    func.acceptsReference = function(argIndex)
                    {
                        return argIndex === 0
                    };
                    return func
                };
                SpreadSparkline.prototype._fixValues = function(values)
                {
                    var newValues = [],
                        temp;
                    for (var i = 0, j = 0, length = values.length; i < length; i++)
                    {
                        temp = parseFloat(values[i]);
                        if (!isNaN(temp) && isFinite(temp))
                        {
                            newValues[j++] = temp
                        }
                    }
                    return newValues
                };
                SpreadSparkline.prototype._getAverage = function(array)
                {
                    var sum = 0,
                        count = 0;
                    for (var i = 0, length = array.length; i < length; i++)
                    {
                        var p = array[i];
                        count += p.value;
                        sum += p.key * p.value
                    }
                    if (count === 0)
                    {
                        return 0
                    }
                    return sum / count
                };
                SpreadSparkline.prototype._getMaxValue = function(array)
                {
                    var max = -Number.MAX_VALUE,
                        t;
                    for (var i = 0, length = array.length; i < length; i++)
                    {
                        t = array[i].value;
                        if (t > max)
                        {
                            max = t
                        }
                    }
                    return max
                };
                SpreadSparkline.prototype._toArray = function(points)
                {
                    var dict = {};
                    for (var i = 0, p, pointCount = points.length; i < pointCount; i++)
                    {
                        p = points[i];
                        if (dict[p])
                        {
                            dict[p]++
                        }
                        else
                        {
                            dict[p] = 1
                        }
                    }
                    var resultArray = [];
                    for (var key in dict)
                    {
                        resultArray.push(new SpreadSparklineData(parseFloat(key), dict[key]))
                    }
                    return resultArray.sort(function(item1, item2)
                        {
                            return item1.key - item2.key
                        })
                };
                SpreadSparkline.prototype._isValid = function(offset, forbiddenRangeArray)
                {
                    for (var i = 0, length = forbiddenRangeArray.length; i < length; i++)
                    {
                        var t = forbiddenRangeArray[i];
                        if (t[0] <= offset && offset <= t[1])
                        {
                            return false
                        }
                    }
                    return true
                };
                SpreadSparkline.prototype._getRandomOffsetArray = function(count, totalOffset, minInterval, randomNumbers)
                {
                    var randomOffsetArray = [],
                        MAX_ATTEMPT_TIMES = Math_max(100, count * 10),
                        attemptedTimes = 0,
                        forbiddenRangeArray = [],
                        i = 0;
                    while (randomOffsetArray.length < count)
                    {
                        var offset = Math_floor(randomNumbers[i++] * totalOffset);
                        if (attemptedTimes > MAX_ATTEMPT_TIMES || this._isValid(offset, forbiddenRangeArray))
                        {
                            randomOffsetArray.push(offset);
                            forbiddenRangeArray.push([offset - minInterval, offset + minInterval])
                        }
                        attemptedTimes++
                    }
                    return randomOffsetArray
                };
                SpreadSparkline.prototype.paint = function(context, value, x, y, width, height)
                {
                    var self = this,
                        spreadSparklineDataArray = value.spreadData,
                        showAverage = value.showAverage,
                        scaleStart = value.scaleStart,
                        scaleEnd = value.scaleEnd,
                        style = value.style,
                        colorScheme = value.colorScheme,
                        vertical = value.vertical,
                        margin = 5;
                    var length = spreadSparklineDataArray.length;
                    if (length <= 0)
                    {
                        return
                    }
                    var minKey = spreadSparklineDataArray[0].key,
                        maxKey = spreadSparklineDataArray[length - 1].key;
                    if (scaleStart === keyword_null || typeof(scaleStart) === const_undefined)
                    {
                        scaleStart = minKey
                    }
                    if (scaleEnd === keyword_null || typeof(scaleEnd) === const_undefined)
                    {
                        scaleEnd = maxKey
                    }
                    if (style === keyword_null || typeof(style) === const_undefined)
                    {
                        style = 4
                    }
                    if (colorScheme === keyword_null || typeof(colorScheme) === const_undefined)
                    {
                        colorScheme = "#646464"
                    }
                    var plotLeft,
                        plotWidth,
                        plotTop,
                        plotHeight;
                    if (vertical)
                    {
                        plotLeft = y + height - margin;
                        plotWidth = height - 2 * margin;
                        plotTop = x + margin;
                        plotHeight = width - 2 * margin
                    }
                    else
                    {
                        plotLeft = x + margin;
                        plotWidth = width - 2 * margin;
                        plotTop = y + margin;
                        plotHeight = height - 2 * margin
                    }
                    context.save();
                    context.rect(x, y, width, height);
                    context.clip();
                    context.beginPath();
                    context.strokeStyle = colorScheme;
                    context.fillStyle = colorScheme;
                    context.lineWidth = 2;
                    var xMark,
                        yMark,
                        max = self._getMaxValue(spreadSparklineDataArray);
                    for (var i = 0, pointCount = spreadSparklineDataArray.length; i < pointCount; i++)
                    {
                        var p = spreadSparklineDataArray[i],
                            pKey = p.key,
                            pValue = p.value;
                        if (vertical)
                        {
                            xMark = plotLeft - plotWidth * (pKey - scaleStart) / (scaleEnd - scaleStart);
                            if (xMark > plotLeft)
                            {
                                xMark = plotLeft
                            }
                            if (xMark < plotLeft - plotWidth)
                            {
                                xMark = plotLeft - plotWidth
                            }
                        }
                        else
                        {
                            xMark = plotLeft + plotWidth * (pKey - scaleStart) / (scaleEnd - scaleStart);
                            if (xMark < plotLeft)
                            {
                                xMark = plotLeft
                            }
                            if (xMark > plotLeft + plotWidth)
                            {
                                xMark = plotLeft + plotWidth
                            }
                        }
                        xMark = Math_round(xMark);
                        if (style === 1)
                        {
                            var offset = pValue / 2 * plotHeight / max;
                            if (offset < 0.5)
                            {
                                offset = 0.5
                            }
                            var lineStart = plotTop + plotHeight / 2 - offset,
                                lineEnd = plotTop + plotHeight / 2 + offset;
                            context.beginPath();
                            if (vertical)
                            {
                                context.moveTo(lineStart, xMark);
                                context.lineTo(lineEnd, xMark)
                            }
                            else
                            {
                                context.moveTo(xMark, lineStart);
                                context.lineTo(xMark, lineEnd)
                            }
                            context.stroke()
                        }
                        else if (style === 4)
                        {
                            var offset = pValue * plotHeight / max;
                            if (offset < 1)
                            {
                                offset = 1
                            }
                            context.beginPath();
                            if (vertical)
                            {
                                context.moveTo(plotTop, xMark);
                                context.lineTo(plotTop + offset, xMark)
                            }
                            else
                            {
                                context.moveTo(xMark, plotTop + plotHeight);
                                context.lineTo(xMark, plotTop + plotHeight - offset)
                            }
                            context.stroke()
                        }
                        else if (style === 6)
                        {
                            context.beginPath();
                            if (vertical)
                            {
                                context.moveTo(plotTop, xMark);
                                context.lineTo(plotTop + plotHeight, xMark)
                            }
                            else
                            {
                                context.moveTo(xMark, plotTop);
                                context.lineTo(xMark, plotTop + plotHeight)
                            }
                            context.stroke()
                        }
                        else
                        {
                            var symbolSize = 2,
                                randomOffsetArray;
                            if (style === 3)
                            {
                                randomOffsetArray = self._getRandomOffsetArray(pValue, plotHeight, symbolSize + 1, p.randomNumbers)
                            }
                            for (var j = 1; j <= pValue; j++)
                            {
                                switch (style)
                                {
                                    case 2:
                                        yMark = plotTop + plotHeight / 2 - margin - (pValue / 2 - j) * plotHeight / max;
                                        break;
                                    case 3:
                                        yMark = plotTop + plotHeight - margin - randomOffsetArray[j - 1];
                                        break;
                                    case 5:
                                    default:
                                        yMark = plotTop + plotHeight - j * plotHeight / max;
                                        break
                                }
                                yMark = Math_round(yMark);
                                context.beginPath();
                                if (vertical)
                                {
                                    context.fillRect(yMark, xMark, symbolSize, symbolSize)
                                }
                                else
                                {
                                    context.fillRect(xMark, yMark, symbolSize, symbolSize)
                                }
                            }
                        }
                    }
                    if (showAverage)
                    {
                        var average = self._getAverage(spreadSparklineDataArray);
                        context.strokeStyle = "#CB0000";
                        context.beginPath();
                        if (vertical)
                        {
                            xMark = Math_round(plotLeft - plotWidth * (average - scaleStart) / (scaleEnd - scaleStart));
                            context.moveTo(plotTop - margin, xMark);
                            context.lineTo(plotTop + plotHeight + margin, xMark)
                        }
                        else
                        {
                            xMark = Math_round(plotLeft + plotWidth * (average - scaleStart) / (scaleEnd - scaleStart));
                            context.moveTo(xMark, plotTop - margin);
                            context.lineTo(xMark, plotTop + plotHeight + margin)
                        }
                        context.stroke()
                    }
                    context.restore()
                };
                return SpreadSparkline
            })(SparklineEx);
        Sheets.SpreadSparkline = SpreadSparkline;
        (function(TextOrientation)
        {
            TextOrientation[TextOrientation["Horizontal"] = 0] = "Horizontal";
            TextOrientation[TextOrientation["Vertical"] = 1] = "Vertical"
        })(Sheets.TextOrientation || (Sheets.TextOrientation = {}));
        var TextOrientation = Sheets.TextOrientation;
        var StackedSparklineValue = (function()
            {
                function StackedSparklineValue(points, colorRange, labelRange, maximum, targetRed, targetGreen, targetBlue, targetYellow, color, highlightPosition, vertical, textOrientation, textSize)
                {
                    var self = this;
                    self.points = points;
                    self.colorRange = colorRange;
                    self.labelRange = labelRange;
                    self.maximum = maximum;
                    self.targetRed = targetRed;
                    self.targetGreen = targetGreen;
                    self.targetBlue = targetBlue;
                    self.targetYellow = targetYellow;
                    self.color = color;
                    self.highlightPosition = highlightPosition;
                    self.vertical = vertical;
                    self.textOrientation = textOrientation;
                    self.textSize = textSize
                }
                return StackedSparklineValue
            })();
        Sheets.StackedSparklineValue = StackedSparklineValue;
        var StackedSparkline = (function(_super)
            {
                __extends(StackedSparkline, _super);
                function StackedSparkline()
                {
                    _super.call(this)
                }
                StackedSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var func = new Sheets.Calc.Functions.Function("STACKEDSPARKLINE", 1, 13);
                    var self = this;
                    func.evaluate = function(args)
                    {
                        var points = self.getAllValuesFromReference(args[0]),
                            colorRange = self.getAllValuesFromReference(args[1]),
                            labelRange = self.getAllValuesFromReference(args[2]),
                            maximum = args[3],
                            targetRed = args[4],
                            targetGreen = args[5],
                            targetBlue = args[6],
                            targetYellow = args[7],
                            color = args[8],
                            highlightPosition = args[9],
                            vertical = args[10],
                            textOrientation = args[11],
                            textSize = args[12];
                        return new StackedSparklineValue(points, colorRange, labelRange, maximum, targetRed, targetGreen, targetBlue, targetYellow, color, highlightPosition, vertical, textOrientation, textSize)
                    };
                    func.acceptsReference = function(argIndex)
                    {
                        return 0 <= argIndex && argIndex <= 2
                    };
                    return func
                };
                StackedSparkline.prototype._hasNullOrUndefined = function(array)
                {
                    var t;
                    for (var i = 0, length = array.length; i < length; i++)
                    {
                        t = array[i];
                        if (t === keyword_null || typeof(t) === const_undefined)
                        {
                            return true
                        }
                    }
                    return false
                };
                StackedSparkline.prototype._lightenColor = function(colorString, percentLighter)
                {
                    var color = Sheets._Color.parse(colorString);
                    var hls = new Sheets.HLSColor(color);
                    var lighterColor = hls.getLighterColor(percentLighter);
                    return lighterColor.toString()
                };
                StackedSparkline.prototype._getDefaultColorRange = function(colorString, count)
                {
                    var result = [];
                    for (var i = 0; i < count; i++)
                    {
                        result.push(this._lightenColor(colorString, 1 + i / count))
                    }
                    return result
                };
                StackedSparkline.prototype._sumPositive = function(array)
                {
                    var sum = 0,
                        t;
                    for (var i = 0, length = array.length; i < length; i++)
                    {
                        t = array[i];
                        if (t > 0)
                        {
                            sum += t
                        }
                    }
                    return sum
                };
                StackedSparkline.prototype._getTextColor = function(backColor)
                {
                    var c = Sheets._Color.parse(backColor);
                    if (c && c.getBrightness() < 255 / 2)
                    {
                        return "white"
                    }
                    return "black"
                };
                StackedSparkline.prototype._paintSparkline = function(context, value, x, y, width, height, sheet)
                {
                    var self = this,
                        points = value.points,
                        colorRange = value.colorRange,
                        labelRange = value.labelRange,
                        maximum = value.maximum,
                        targetRed = value.targetRed,
                        targetGreen = value.targetGreen,
                        targetBlue = value.targetBlue,
                        targetYellow = value.targetYellow,
                        color = value.color,
                        highlightPosition = value.highlightPosition,
                        vertical = value.vertical,
                        textOrientation = value.textOrientation,
                        textSize = value.textSize,
                        margin = 5;
                    if (points === keyword_null || typeof(points) === const_undefined)
                    {
                        return
                    }
                    var pointsCount = points.length;
                    if (pointsCount <= 0)
                    {
                        return
                    }
                    if (color === keyword_null || typeof(color) === const_undefined)
                    {
                        color = "#646464"
                    }
                    if (colorRange === keyword_null || typeof(colorRange) === const_undefined || colorRange.length !== pointsCount || self._hasNullOrUndefined(colorRange))
                    {
                        colorRange = self._getDefaultColorRange(color, pointsCount)
                    }
                    var sumPositive = self._sumPositive(points);
                    if (maximum === keyword_null || typeof(maximum) === const_undefined || maximum < sumPositive)
                    {
                        maximum = sumPositive
                    }
                    if (textOrientation === keyword_null || typeof(textOrientation) === const_undefined)
                    {
                        textOrientation = 0
                    }
                    if (textSize === keyword_null || typeof(textSize) === const_undefined || textSize <= 0)
                    {
                        textSize = 10
                    }
                    if (!isNaN(textSize))
                    {
                        textSize = textSize * sheet._zoomFactor
                    }
                    var plotLeft,
                        plotWidth,
                        plotTop,
                        plotHeight;
                    if (vertical)
                    {
                        plotLeft = y + height - margin;
                        plotWidth = height - 2 * margin;
                        plotTop = x + margin;
                        plotHeight = width - 2 * margin
                    }
                    else
                    {
                        plotLeft = x + margin;
                        plotWidth = width - 2 * margin;
                        plotTop = y + margin;
                        plotHeight = height - 2 * margin
                    }
                    context.save();
                    var startX = plotLeft,
                        sWidth,
                        rectX,
                        rectY,
                        rectWidth,
                        rectHeight,
                        p;
                    for (var i = 0, length = pointsCount; i < length; i++)
                    {
                        p = points[i];
                        if (p <= 0)
                        {
                            continue
                        }
                        sWidth = (p / maximum) * plotWidth;
                        if (vertical)
                        {
                            rectX = x + width * 0.15;
                            rectWidth = width * 0.7;
                            rectY = startX - sWidth;
                            rectHeight = sWidth
                        }
                        else
                        {
                            rectX = startX;
                            rectWidth = sWidth;
                            rectY = y + height * 0.15;
                            rectHeight = height * 0.7
                        }
                        var backColor;
                        if (i + 1 === highlightPosition)
                        {
                            backColor = "#CB0000"
                        }
                        else
                        {
                            backColor = colorRange[i]
                        }
                        context.fillStyle = backColor;
                        context.beginPath();
                        context.fillRect(rectX, rectY, rectWidth, rectHeight);
                        var text = labelRange && labelRange[i];
                        if (text)
                        {
                            context.save();
                            context.fillStyle = self._getTextColor(backColor);
                            context.textBaseline = "middle";
                            context.textAlign = "center";
                            context.font = textSize + "px Arial";
                            context.rect(rectX, rectY, rectWidth, rectHeight);
                            context.clip();
                            context.beginPath();
                            if (textOrientation === 1)
                            {
                                context.translate(rectX + rectWidth / 2, rectY);
                                context.rotate(Math.PI / 2);
                                context.fillText(text, rectHeight / 2, 0)
                            }
                            else
                            {
                                context.fillText(text, rectX + rectWidth / 2, rectY + rectHeight / 2)
                            }
                            context.restore()
                        }
                        if (vertical)
                        {
                            startX -= sWidth
                        }
                        else
                        {
                            startX += sWidth
                        }
                    }
                    var linePosition;
                    if (targetRed !== keyword_null && typeof(targetRed) !== const_undefined)
                    {
                        if (targetRed > maximum)
                        {
                            targetRed = maximum
                        }
                        if (targetRed > 0)
                        {
                            context.beginPath();
                            if (vertical)
                            {
                                linePosition = Math_round(plotLeft - targetRed / maximum * plotWidth) - 0.5;
                                context.moveTo(plotTop, linePosition);
                                context.lineTo(plotTop + plotHeight, linePosition)
                            }
                            else
                            {
                                linePosition = Math_round(plotLeft + targetRed / maximum * plotWidth) - 0.5;
                                context.moveTo(linePosition, plotTop);
                                context.lineTo(linePosition, plotTop + plotHeight)
                            }
                            context.strokeStyle = "red";
                            context.stroke()
                        }
                    }
                    if (targetGreen !== keyword_null && typeof(targetGreen) !== const_undefined)
                    {
                        if (targetGreen > maximum)
                        {
                            targetGreen = maximum
                        }
                        if (targetGreen < 0)
                        {
                            targetGreen = 0
                        }
                        context.beginPath();
                        if (vertical)
                        {
                            linePosition = Math_round(plotLeft - targetGreen / maximum * plotWidth) - 0.5;
                            context.moveTo(plotTop, linePosition);
                            context.lineTo(plotTop + plotHeight, linePosition)
                        }
                        else
                        {
                            linePosition = Math_round(plotLeft + targetGreen / maximum * plotWidth) - 0.5;
                            context.moveTo(linePosition, plotTop);
                            context.lineTo(linePosition, plotTop + plotHeight)
                        }
                        context.strokeStyle = "green";
                        context.stroke()
                    }
                    if (targetBlue !== keyword_null && typeof(targetBlue) !== const_undefined)
                    {
                        if (targetBlue > maximum)
                        {
                            targetBlue = maximum
                        }
                        if (targetBlue < 0)
                        {
                            targetBlue = 0
                        }
                        context.beginPath();
                        if (vertical)
                        {
                            linePosition = Math_round(plotLeft - targetBlue / maximum * plotWidth) - 0.5;
                            context.moveTo(plotTop, linePosition);
                            context.lineTo(plotTop + plotHeight, linePosition)
                        }
                        else
                        {
                            linePosition = Math_round(plotLeft + targetBlue / maximum * plotWidth) - 0.5;
                            context.moveTo(linePosition, plotTop);
                            context.lineTo(linePosition, plotTop + plotHeight)
                        }
                        context.strokeStyle = "blue";
                        context.stroke()
                    }
                    if (targetYellow !== keyword_null && typeof(targetYellow) !== const_undefined)
                    {
                        if (targetYellow > maximum)
                        {
                            targetYellow = maximum
                        }
                        if (targetYellow < 0)
                        {
                            targetYellow = 0
                        }
                        context.beginPath();
                        if (vertical)
                        {
                            linePosition = Math_round(plotLeft - targetYellow / maximum * plotWidth) - 0.5;
                            context.moveTo(plotTop, linePosition);
                            context.lineTo(plotTop + plotHeight, linePosition)
                        }
                        else
                        {
                            linePosition = Math_round(plotLeft + targetYellow / maximum * plotWidth) - 0.5;
                            context.moveTo(linePosition, plotTop);
                            context.lineTo(linePosition, plotTop + plotHeight)
                        }
                        context.strokeStyle = "yellow";
                        context.stroke()
                    }
                    context.restore()
                };
                return StackedSparkline
            })(SparklineEx);
        Sheets.StackedSparkline = StackedSparkline;
        (function(ArrowDirection)
        {
            ArrowDirection[ArrowDirection["Top"] = 0] = "Top";
            ArrowDirection[ArrowDirection["Right"] = 1] = "Right";
            ArrowDirection[ArrowDirection["Down"] = 2] = "Down";
            ArrowDirection[ArrowDirection["Left"] = 3] = "Left"
        })(Sheets.ArrowDirection || (Sheets.ArrowDirection = {}));
        var ArrowDirection = Sheets.ArrowDirection;
        (function(BarSparklineType)
        {
            BarSparklineType[BarSparklineType["Horizontal"] = 0] = "Horizontal";
            BarSparklineType[BarSparklineType["Vertical"] = 1] = "Vertical"
        })(Sheets.BarSparklineType || (Sheets.BarSparklineType = {}));
        var BarSparklineType = Sheets.BarSparklineType;
        var BarSparklineBaseValue = (function()
            {
                function BarSparklineBaseValue(value, colorScheme, type)
                {
                    this.value = value;
                    this.colorScheme = colorScheme;
                    this.type = type
                }
                return BarSparklineBaseValue
            })();
        Sheets.BarSparklineBaseValue = BarSparklineBaseValue;
        var BarSparklineBase = (function(_super)
            {
                __extends(BarSparklineBase, _super);
                function BarSparklineBase()
                {
                    _super.call(this)
                }
                BarSparklineBase.prototype.createCustomFunction = function(name, type)
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var func = new Sheets.Calc.Functions.Function(name, 1, 2);
                    var self = this;
                    func.evaluate = function(args)
                    {
                        var value = self.getFirstValueFromReference(args[0]),
                            color = args[1];
                        return new BarSparklineBaseValue(value, color, type)
                    };
                    func.acceptsReference = function(argIndex)
                    {
                        return argIndex === 0
                    };
                    return func
                };
                BarSparklineBase.prototype.getTextColor = function(backColor)
                {
                    var c = Sheets._Color.parse(backColor);
                    if (c && c.getBrightness() < 255 / 2)
                    {
                        return "white"
                    }
                    return "black"
                };
                BarSparklineBase.prototype._fixValue = function(value)
                {
                    value = Math.round(value);
                    return value - 0.5
                };
                BarSparklineBase.prototype.paintLine = function(context, startX, startY, endX, endY, strokeStyle)
                {
                    var self = this;
                    startX = self._fixValue(startX);
                    startY = self._fixValue(startY);
                    endX = self._fixValue(endX);
                    endY = self._fixValue(endY);
                    context.beginPath();
                    context.moveTo(startX, startY);
                    context.lineTo(endX, endY);
                    context.lineWidth = 1;
                    if (strokeStyle === keyword_null || typeof strokeStyle === const_undefined)
                    {
                        context.strokeStyle = "black"
                    }
                    else
                    {
                        context.strokeStyle = strokeStyle
                    }
                    context.stroke()
                };
                BarSparklineBase.prototype.paintArrow = function(context, topX, topY, refWidth, direction)
                {
                    var self = this;
                    var arrowSideLength = refWidth * 0.4,
                        topX = self._fixValue(topX);
                    topY = self._fixValue(topY);
                    context.beginPath();
                    context.moveTo(topX, topY);
                    switch (direction)
                    {
                        case 0:
                            context.lineTo(self._fixValue(topX - arrowSideLength / 2), self._fixValue(topY + Math_sqrt(3) * arrowSideLength / 2));
                            context.lineTo(self._fixValue(topX), self._fixValue(topY + arrowSideLength / Math_sqrt(3)));
                            context.lineTo(self._fixValue(topX + arrowSideLength / 2), self._fixValue(topY + Math_sqrt(3) * arrowSideLength / 2));
                            break;
                        case 2:
                            context.lineTo(self._fixValue(topX - arrowSideLength / 2), self._fixValue(topY - Math_sqrt(3) * arrowSideLength / 2));
                            context.lineTo(self._fixValue(topX), self._fixValue(topY - arrowSideLength / Math_sqrt(3)));
                            context.lineTo(self._fixValue(topX + arrowSideLength / 2), self._fixValue(topY - Math_sqrt(3) * arrowSideLength / 2));
                            break;
                        case 3:
                            context.lineTo(self._fixValue(topX + Math_sqrt(3) * arrowSideLength / 2), self._fixValue(topY - arrowSideLength / 2));
                            context.lineTo(self._fixValue(topX + arrowSideLength / Math_sqrt(3)), self._fixValue(topY));
                            context.lineTo(self._fixValue(topX + Math_sqrt(3) * arrowSideLength / 2), self._fixValue(topY + arrowSideLength / 2));
                            break;
                        case 1:
                            context.lineTo(self._fixValue(topX - Math_sqrt(3) * arrowSideLength / 2), self._fixValue(topY - arrowSideLength / 2));
                            context.lineTo(self._fixValue(topX - arrowSideLength / Math_sqrt(3)), self._fixValue(topY));
                            context.lineTo(self._fixValue(topX - Math_sqrt(3) * arrowSideLength / 2), self._fixValue(topY + arrowSideLength / 2));
                            break;
                        default:
                            break
                    }
                    context.lineTo(topX, topY);
                    context.closePath();
                    context.fillStyle = "white";
                    context.fill()
                };
                BarSparklineBase.prototype.paintRect = function(context, startX, startY, width, height, colorScheme)
                {
                    context.beginPath();
                    context.rect(Math_round(startX), Math_round(startY), Math_round(width), Math_round(height));
                    context.fillStyle = colorScheme;
                    context.fill()
                };
                BarSparklineBase.prototype.paint = function(context, value, x, y, width, height)
                {
                    var type = value.type,
                        ratio = value.value,
                        colorScheme = value.colorScheme;
                    var rectMargin = 5,
                        arrowMargin = 5,
                        rectRatio = 0.7,
                        needDrawArrow = false;
                    var self = this;
                    var arrow,
                        rect,
                        lineStart,
                        lineEnd,
                        arrowDirection,
                        refWidth;
                    try
                    {
                        ratio = CalcConvert.D(ratio)
                    }
                    catch(e)
                    {
                        return
                    }
                    if (ratio > 1)
                    {
                        ratio = 1;
                        needDrawArrow = true
                    }
                    else if (ratio < -1)
                    {
                        ratio = -1;
                        needDrawArrow = true
                    }
                    if (colorScheme === keyword_null || typeof colorScheme === const_undefined)
                    {
                        colorScheme = "grey"
                    }
                    context.save();
                    if (type === 0)
                    {
                        var rectHMaxWidth = width - rectMargin * 2;
                        var rectHMaxHeight = height * rectRatio;
                        if (ratio >= 0)
                        {
                            if (needDrawArrow)
                            {
                                arrow = new Sheets.Point(x + rectMargin + rectHMaxWidth - arrowMargin, y + height / 2)
                            }
                            rect = new Sheets.Rect(x + rectMargin, y + height * (1 - rectRatio) / 2, rectHMaxWidth * ratio, rectHMaxHeight);
                            lineStart = new Sheets.Point(x + rectMargin, y + 1);
                            lineEnd = new Sheets.Point(x + rectMargin, y + height);
                            arrowDirection = 1
                        }
                        else
                        {
                            var rectWidth = Math_abs(rectHMaxWidth * ratio);
                            if (needDrawArrow)
                            {
                                arrow = new Sheets.Point(x + rectMargin + arrowMargin, y + height / 2)
                            }
                            rect = new Sheets.Rect(x + width - rectMargin - rectWidth, y + height * (1 - rectRatio) / 2, rectWidth, rectHMaxHeight);
                            lineStart = new Sheets.Point(x + width - rectMargin, y + 1);
                            lineEnd = new Sheets.Point(x + width - rectMargin, y + height);
                            arrowDirection = 3
                        }
                        refWidth = height
                    }
                    else if (type === 1)
                    {
                        var rectVMaxHeight = height - rectMargin * 2;
                        var rectVMaxWidth = width * rectRatio;
                        if (ratio >= 0)
                        {
                            var rectHeight = rectVMaxHeight * ratio;
                            rect = new Sheets.Rect(x + (1 - rectRatio) / 2 * width, y + height - rectMargin - rectHeight, rectVMaxWidth, rectHeight);
                            if (needDrawArrow)
                            {
                                arrow = new Sheets.Point(x + width / 2, y + height - rectMargin - rectHeight + arrowMargin);
                                arrowDirection = 0
                            }
                            lineStart = new Sheets.Point(x + 1, y + height - rectMargin);
                            lineEnd = new Sheets.Point(x + width, y + height - rectMargin)
                        }
                        else
                        {
                            var ratio = Math_abs(ratio);
                            rect = new Sheets.Rect(x + (1 - rectRatio) / 2 * width, y + rectMargin, rectVMaxWidth, rectVMaxHeight * ratio);
                            if (needDrawArrow)
                            {
                                arrow = new Sheets.Point(x + width / 2, y + rectMargin + rectVMaxHeight - arrowMargin);
                                arrowDirection = 2
                            }
                            lineStart = new Sheets.Point(x + 1, y + rectMargin);
                            lineEnd = new Sheets.Point(x + width, y + rectMargin)
                        }
                        refWidth = width
                    }
                    context.beginPath();
                    self.paintRect(context, rect.x, rect.y, rect.width, rect.height, colorScheme);
                    context.save();
                    context.rect(rect.x, rect.y, rect.width, rect.height);
                    context.clip();
                    if (arrow)
                    {
                        self.paintArrow(context, arrow.x, arrow.y, refWidth, arrowDirection)
                    }
                    context.restore();
                    self.paintLine(context, lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
                    context.restore()
                };
                return BarSparklineBase
            })(SparklineEx);
        Sheets.BarSparklineBase = BarSparklineBase;
        var HBarSparkline = (function(_super)
            {
                __extends(HBarSparkline, _super);
                function HBarSparkline()
                {
                    _super.call(this)
                }
                HBarSparkline.prototype.createFunction = function()
                {
                    return this.createCustomFunction("HBARSPARKLINE", 0)
                };
                return HBarSparkline
            })(BarSparklineBase);
        Sheets.HBarSparkline = HBarSparkline;
        var VBarSparkline = (function(_super)
            {
                __extends(VBarSparkline, _super);
                function VBarSparkline()
                {
                    _super.call(this)
                }
                VBarSparkline.prototype.createFunction = function()
                {
                    return this.createCustomFunction("VBARSPARKLINE", 1)
                };
                return VBarSparkline
            })(BarSparklineBase);
        Sheets.VBarSparkline = VBarSparkline;
        (function(BoxPlotStyle)
        {
            BoxPlotStyle[BoxPlotStyle["Classical"] = 0] = "Classical";
            BoxPlotStyle[BoxPlotStyle["Neo"] = 1] = "Neo"
        })(Sheets.BoxPlotStyle || (Sheets.BoxPlotStyle = {}));
        var BoxPlotStyle = Sheets.BoxPlotStyle;
        var BoxPlotSparklineValue = (function()
            {
                function BoxPlotSparklineValue(points, boxPlotClass, showAverage, scaleStart, scaleEnd, acceptableStart, acceptableEnd, colorScheme, style, vertical, perc02, perc09, perc10, perc90, perc91, perc98, q1, q3, median, stDev)
                {
                    var self = this;
                    self.points = points;
                    self.boxPlotClass = boxPlotClass;
                    self.showAverage = showAverage;
                    self.scaleStart = scaleStart;
                    self.scaleEnd = scaleEnd;
                    self.acceptableStart = acceptableStart;
                    self.acceptableEnd = acceptableEnd;
                    self.colorScheme = colorScheme;
                    self.style = style;
                    self.vertical = vertical;
                    self.perc02 = perc02;
                    self.perc09 = perc09;
                    self.perc10 = perc10;
                    self.perc90 = perc90;
                    self.perc91 = perc91;
                    self.perc98 = perc98;
                    self.q1 = q1;
                    self.q3 = q3;
                    self.median = median;
                    self.stDev = stDev
                }
                return BoxPlotSparklineValue
            })();
        Sheets.BoxPlotSparklineValue = BoxPlotSparklineValue;
        var BoxPlotSparkline = (function(_super)
            {
                __extends(BoxPlotSparkline, _super);
                function BoxPlotSparkline()
                {
                    _super.call(this)
                }
                BoxPlotSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var func = new Sheets.Calc.Functions.Function("BOXPLOTSPARKLINE", 1, 10);
                    var self = this;
                    func.evaluate = function(args)
                    {
                        var reference = args[0],
                            points = self.getAllValuesFromReference(reference),
                            boxPlotClass = args[1],
                            showAverage = args[2],
                            scaleStart = self.getFirstValueFromReference(args[3]),
                            scaleEnd = self.getFirstValueFromReference(args[4]),
                            acceptableStart = self.getFirstValueFromReference(args[5]),
                            acceptableEnd = self.getFirstValueFromReference(args[6]),
                            colorScheme = args[7],
                            style = args[8],
                            vertical = args[9],
                            perc02 = self._getPercentitleValue(reference, 2),
                            perc09 = self._getPercentitleValue(reference, 9),
                            perc10 = self._getPercentitleValue(reference, 10),
                            perc90 = self._getPercentitleValue(reference, 90),
                            perc91 = self._getPercentitleValue(reference, 91),
                            perc98 = self._getPercentitleValue(reference, 98),
                            q1 = self._getPercentitleValue(reference, 25),
                            q3 = self._getPercentitleValue(reference, 75),
                            median = self._getPercentitleValue(reference, 50),
                            stDev = self._getStDevpValue(reference);
                        return new BoxPlotSparklineValue(points, boxPlotClass, showAverage, scaleStart, scaleEnd, acceptableStart, acceptableEnd, colorScheme, style, vertical, perc02, perc09, perc10, perc90, perc91, perc98, q1, q3, median, stDev)
                    };
                    func.acceptsReference = function(argIndex)
                    {
                        return argIndex === 0
                    };
                    return func
                };
                BoxPlotSparkline.prototype._fixValues = function(values)
                {
                    var newValues = [],
                        temp;
                    for (var i = 0, j = 0, length = values.length; i < length; i++)
                    {
                        temp = parseFloat(values[i]);
                        if (!isNaN(temp) && isFinite(temp))
                        {
                            newValues[j++] = temp
                        }
                    }
                    return newValues
                };
                BoxPlotSparkline.prototype._getPercentitleValue = function(reference, dValue)
                {
                    if (CalcConvert.ref(reference) && !isNaN(dValue) && 0 <= dValue && dValue <= 100)
                    {
                        var func = Sheets.Calc.Functions._builtInFunctions["PERCENTILE"];
                        return func.evaluate([reference, dValue / 100.0])
                    }
                    return NaN
                };
                BoxPlotSparkline.prototype._getStDevpValue = function(reference)
                {
                    if (CalcConvert.ref(CalcConvert.ref(reference)))
                    {
                        var func = Sheets.Calc.Functions._builtInFunctions["STDEVP"];
                        return func.evaluate([reference])
                    }
                    return NaN
                };
                BoxPlotSparkline.prototype._getAverage = function(array)
                {
                    var sum = 0;
                    for (var i = 0, length = array.length; i < length; i++)
                    {
                        sum += array[i]
                    }
                    if (length === 0)
                    {
                        return 0
                    }
                    else
                    {
                        return sum / length
                    }
                };
                BoxPlotSparkline.prototype._getMaxValue = function(array)
                {
                    var max = -Number.MAX_VALUE,
                        t;
                    for (var i = 0, length = array.length; i < length; i++)
                    {
                        t = array[i];
                        if (t > max)
                        {
                            max = t
                        }
                    }
                    return max
                };
                BoxPlotSparkline.prototype._getMinValue = function(array)
                {
                    var min = Number.MAX_VALUE,
                        t;
                    for (var i = 0, length = array.length; i < length; i++)
                    {
                        t = array[i];
                        if (t < min)
                        {
                            min = t
                        }
                    }
                    return min
                };
                BoxPlotSparkline.prototype._paintLine = function(ctx, startX, startY, endX, endY)
                {
                    ctx.moveTo(Math_round(startX), Math_round(startY));
                    ctx.lineTo(Math_round(endX), Math_round(endY))
                };
                BoxPlotSparkline.prototype._paintRect = function(ctx, x, y, width, height)
                {
                    ctx.fillRect(Math_round(x), Math_round(y), Math_round(width), Math_round(height))
                };
                BoxPlotSparkline.prototype.paint = function(context, value, x, y, width, height)
                {
                    var self = this,
                        points = value.points,
                        boxPlotClass = value.boxPlotClass,
                        showAverage = value.showAverage,
                        scaleStart = value.scaleStart,
                        scaleEnd = value.scaleEnd,
                        acceptableStart = value.acceptableStart,
                        acceptableEnd = value.acceptableEnd,
                        style = value.style,
                        colorScheme = value.colorScheme,
                        vertical = value.vertical,
                        margin = 5,
                        maximum = self._getMaxValue(points),
                        minimum = self._getMinValue(points);
                    if (points === keyword_null || typeof(points) === const_undefined)
                    {
                        return
                    }
                    points = self._fixValues(points);
                    if (points.length <= 0)
                    {
                        return
                    }
                    if (boxPlotClass === keyword_null || typeof(boxPlotClass) !== const_string)
                    {
                        boxPlotClass = "5ns"
                    }
                    else
                    {
                        boxPlotClass = boxPlotClass.toLocaleLowerCase();
                        if (boxPlotClass !== "5ns" && boxPlotClass !== "7ns" && boxPlotClass !== "tukey" && boxPlotClass !== "bowley" && boxPlotClass !== "sigma3")
                        {
                            boxPlotClass = "5ns"
                        }
                    }
                    scaleStart = parseFloat(scaleStart);
                    if (isNaN(scaleStart))
                    {
                        scaleStart = minimum
                    }
                    scaleEnd = parseFloat(scaleEnd);
                    if (isNaN(scaleEnd))
                    {
                        scaleEnd = maximum
                    }
                    acceptableStart = parseFloat(acceptableStart);
                    acceptableEnd = parseFloat(acceptableEnd);
                    if (colorScheme === keyword_null || typeof(colorScheme) !== const_string)
                    {
                        colorScheme = "#D2D2D2"
                    }
                    if (style === keyword_null || BoxPlotStyle[style] === keyword_undefined)
                    {
                        style = 0
                    }
                    var unreasonableColor = "#CB0000";
                    if (scaleStart > minimum)
                    {
                        colorScheme = unreasonableColor;
                        scaleStart = minimum
                    }
                    if (scaleEnd < maximum)
                    {
                        colorScheme = unreasonableColor;
                        scaleEnd = maximum
                    }
                    context.save();
                    context.rect(x, y, width, height);
                    context.clip();
                    context.lineWidth = 2;
                    var plotLeft,
                        plotWidth,
                        plotTop,
                        plotHeight,
                        xy;
                    if (vertical)
                    {
                        xy = -1;
                        plotTop = x + margin;
                        plotHeight = width - 2 * margin;
                        plotWidth = height - 2 * margin;
                        plotLeft = y + margin + plotWidth
                    }
                    else
                    {
                        xy = 1;
                        plotLeft = x + margin;
                        plotTop = y + margin;
                        plotWidth = width - 2 * margin;
                        plotHeight = height - 2 * margin
                    }
                    var perc02 = value.perc02,
                        perc09 = value.perc09,
                        perc10 = value.perc10,
                        perc90 = value.perc90,
                        perc91 = value.perc91,
                        perc98 = value.perc98,
                        q1 = value.q1,
                        q3 = value.q3,
                        median = value.median,
                        iQR = q3 - q1,
                        x01 = minimum,
                        x03 = maximum,
                        y01 = 1.5 * iQR,
                        y03 = 1.5 * iQR,
                        stDev = value.stDev,
                        avgMean = self._getAverage(points),
                        startAverage = 0,
                        transparency = 0,
                        topBox = plotTop + plotHeight * 0.1,
                        heightBox = plotHeight * 0.7,
                        amplitude = Math_abs(scaleEnd - scaleStart);
                    for (var i = 0, len = points.length; i < len; i++)
                    {
                        var point = points[i];
                        if (point < q1 && point >= q1 - 1.5 * iQR && point - (q1 - 1.5 * iQR) < y01)
                        {
                            y01 = point - (q1 - 1.5 * iQR);
                            x01 = point
                        }
                        if (point > q3 && point <= q3 + 1.5 * iQR && q3 + 1.5 * iQR - point < y03)
                        {
                            y03 = q3 + 1.5 * iQR - point;
                            x03 = point
                        }
                        var blOutlier = false;
                        if (boxPlotClass === "tukey" && (point <= q1 - 1.5 * iQR || point >= q3 + 1.5 * iQR))
                        {
                            blOutlier = true;
                            startAverage = plotLeft + xy * (plotWidth * ((point - scaleStart) / amplitude));
                            if (point <= q1 - 3 * iQR || point >= q3 + 3 * iQR)
                            {
                                transparency = 0
                            }
                            else
                            {
                                transparency = 1
                            }
                        }
                        if (boxPlotClass === "7ns" && (point <= perc02 || point >= perc98))
                        {
                            blOutlier = true;
                            startAverage = plotLeft + xy * (plotWidth * ((point - scaleStart) / amplitude));
                            transparency = 1
                        }
                        if (boxPlotClass === "sigma3" && (point <= (avgMean - 2 * stDev) || point >= (avgMean + 2 * stDev)))
                        {
                            blOutlier = true;
                            startAverage = plotLeft + xy * (plotWidth * ((point - scaleStart) / amplitude));
                            if (point <= avgMean - 3 * stDev || point >= avgMean + 3 * stDev)
                            {
                                transparency = 0
                            }
                            else
                            {
                                transparency = 1
                            }
                        }
                        var outlierColor = "#969696";
                        if (blOutlier)
                        {
                            if (style === 1)
                            {
                                context.beginPath();
                                context.strokeStyle = outlierColor;
                                if (transparency === 1)
                                {
                                    if (vertical)
                                    {
                                        self._paintLine(context, topBox + heightBox * 0.2, startAverage, topBox + heightBox * 0.8, startAverage)
                                    }
                                    else
                                    {
                                        self._paintLine(context, startAverage, topBox + heightBox * 0.2, startAverage, topBox + heightBox * 0.8)
                                    }
                                }
                                else
                                {
                                    if (vertical)
                                    {
                                        self._paintLine(context, topBox + heightBox * 0.3, startAverage, topBox + heightBox * 0.7, startAverage)
                                    }
                                    else
                                    {
                                        self._paintLine(context, startAverage, topBox + heightBox * 0.3, startAverage, topBox + heightBox * 0.7)
                                    }
                                }
                                context.stroke()
                            }
                            else
                            {
                                var diameter = 0.1 * plotHeight;
                                if (diameter < 2)
                                {
                                    diameter = 2
                                }
                                context.beginPath();
                                context.strokeStyle = outlierColor;
                                if (vertical)
                                {
                                    context.arc(plotTop + plotHeight * 0.45, startAverage, diameter / 2, 0, 2 * Math.PI)
                                }
                                else
                                {
                                    context.arc(startAverage, plotTop + plotHeight * 0.45, diameter / 2, 0, 2 * Math.PI)
                                }
                                context.stroke()
                            }
                        }
                    }
                    if (scaleStart > acceptableStart || scaleEnd < acceptableEnd)
                    {
                        colorScheme = "#C0FF00"
                    }
                    if (scaleStart > acceptableStart)
                    {
                        acceptableStart = scaleStart
                    }
                    if (scaleEnd < acceptableEnd)
                    {
                        acceptableEnd = scaleEnd
                    }
                    if (acceptableStart !== acceptableEnd)
                    {
                        if (acceptableStart > acceptableEnd)
                        {
                            colorScheme = unreasonableColor
                        }
                        if (acceptableStart < acceptableEnd)
                        {
                            var startAcceptable = plotLeft + xy * (plotWidth * ((acceptableStart - scaleStart) / amplitude));
                            var endAcceptable = plotLeft + xy * (plotWidth * ((acceptableEnd - scaleStart) / amplitude));
                            context.beginPath();
                            context.strokeStyle = "#646464";
                            var xyMark = plotTop + plotHeight * 0.9;
                            if (vertical)
                            {
                                self._paintLine(context, xyMark, startAcceptable, xyMark, endAcceptable)
                            }
                            else
                            {
                                self._paintLine(context, startAcceptable, xyMark, endAcceptable, xyMark)
                            }
                            context.stroke()
                        }
                    }
                    var startBox = plotLeft + xy * (plotWidth * ((q1 - scaleStart) / amplitude)),
                        endBox = Math_abs(plotLeft + xy * (plotWidth * ((q3 - scaleStart) / amplitude)) - startBox),
                        median = value.median,
                        startMedian = plotLeft + xy * (plotWidth * ((median - scaleStart) / amplitude)),
                        startWhisker,
                        endWhisker;
                    switch (boxPlotClass)
                    {
                        case"7ns":
                            startWhisker = plotLeft + xy * (plotWidth * ((perc02 - scaleStart) / amplitude));
                            endWhisker = plotLeft + xy * (plotWidth * ((perc98 - scaleStart) / amplitude));
                            break;
                        case"tukey":
                            startWhisker = plotLeft + xy * (plotWidth * ((x01 - scaleStart) / amplitude));
                            endWhisker = plotLeft + xy * (plotWidth * ((x03 - scaleStart) / amplitude));
                            break;
                        case"sigma3":
                            startBox = plotLeft + xy * (plotWidth * ((avgMean - stDev - scaleStart) / amplitude));
                            endBox = Math_abs(plotLeft + xy * (plotWidth * ((avgMean + stDev - scaleStart) / amplitude)) - startBox);
                            startMedian = plotLeft + xy * (plotWidth * ((avgMean - scaleStart) / amplitude));
                            if ((avgMean - 2 * stDev) > scaleStart)
                            {
                                startWhisker = plotLeft + xy * (plotWidth * ((avgMean - 2 * stDev - scaleStart) / amplitude))
                            }
                            else
                            {
                                startWhisker = plotLeft + xy * (plotWidth * ((minimum - scaleStart) / amplitude))
                            }
                            if ((avgMean + 2 * stDev) < scaleEnd)
                            {
                                endWhisker = plotLeft + xy * (plotWidth * ((avgMean + 2 * stDev - scaleStart) / amplitude))
                            }
                            else
                            {
                                endWhisker = plotLeft + xy * (plotWidth * ((maximum - scaleStart) / amplitude))
                            }
                            showAverage = false;
                            break;
                        case"5ns":
                        case"bowley":
                        default:
                            startWhisker = plotLeft + xy * (plotWidth * ((minimum - scaleStart) / amplitude));
                            endWhisker = plotLeft + xy * (plotWidth * ((maximum - scaleStart) / amplitude));
                            break
                    }
                    var lineColor = "#969696";
                    if (style === 1)
                    {
                        context.fillStyle = "#F2F2F2";
                        if (vertical)
                        {
                            self._paintRect(context, topBox, endWhisker, heightBox, startWhisker - endWhisker)
                        }
                        else
                        {
                            self._paintRect(context, startWhisker, topBox, endWhisker - startWhisker, heightBox)
                        }
                    }
                    else
                    {
                        var topWhiskerLine = plotTop + plotHeight * 0.45;
                        context.beginPath();
                        context.strokeStyle = lineColor;
                        if (vertical)
                        {
                            self._paintLine(context, topWhiskerLine, startWhisker, topWhiskerLine, endWhisker)
                        }
                        else
                        {
                            self._paintLine(context, startWhisker, topWhiskerLine, endWhisker, topWhiskerLine)
                        }
                        context.stroke()
                    }
                    context.fillStyle = colorScheme;
                    if (vertical)
                    {
                        self._paintRect(context, topBox, startBox - endBox, heightBox, endBox)
                    }
                    else
                    {
                        self._paintRect(context, startBox, topBox, endBox, heightBox)
                    }
                    context.beginPath();
                    context.strokeStyle = lineColor;
                    if (vertical)
                    {
                        self._paintLine(context, topBox, startMedian, topBox + heightBox, startMedian)
                    }
                    else
                    {
                        self._paintLine(context, startMedian, topBox, startMedian, topBox + heightBox)
                    }
                    context.stroke();
                    if (style === 0)
                    {
                        context.beginPath();
                        context.strokeStyle = lineColor;
                        if (vertical)
                        {
                            self._paintLine(context, topBox + heightBox * 0.3, endWhisker, topBox + heightBox * 0.7, endWhisker)
                        }
                        else
                        {
                            self._paintLine(context, endWhisker, topBox + heightBox * 0.3, endWhisker, topBox + heightBox * 0.7)
                        }
                        context.stroke();
                        context.beginPath();
                        if (vertical)
                        {
                            self._paintLine(context, topBox + heightBox * 0.3, startWhisker, topBox + heightBox * 0.7, startWhisker)
                        }
                        else
                        {
                            self._paintLine(context, startWhisker, topBox + heightBox * 0.3, startWhisker, topBox + heightBox * 0.7)
                        }
                        context.stroke()
                    }
                    if (boxPlotClass === "7ns" || boxPlotClass === "bowley")
                    {
                        var startHatch,
                            endHatch;
                        if (boxPlotClass === "7ns")
                        {
                            startHatch = plotLeft + xy * (plotWidth * ((perc09 - scaleStart) / amplitude));
                            endHatch = plotLeft + xy * (plotWidth * ((perc91 - scaleStart) / amplitude))
                        }
                        else
                        {
                            startHatch = plotLeft + xy * (plotWidth * ((perc10 - scaleStart) / amplitude));
                            endHatch = plotLeft + xy * (plotWidth * ((perc90 - scaleStart) / amplitude))
                        }
                        context.beginPath();
                        context.strokeStyle = lineColor;
                        if (vertical)
                        {
                            self._paintLine(context, topBox + heightBox * 0.3, endHatch, topBox + heightBox * 0.7, endHatch)
                        }
                        else
                        {
                            self._paintLine(context, endHatch, topBox + heightBox * 0.3, endHatch, topBox + heightBox * 0.7)
                        }
                        context.stroke();
                        context.beginPath();
                        if (vertical)
                        {
                            self._paintLine(context, topBox + heightBox * 0.3, startHatch, topBox + heightBox * 0.7, startHatch)
                        }
                        else
                        {
                            self._paintLine(context, startHatch, topBox + heightBox * 0.3, startHatch, topBox + heightBox * 0.7)
                        }
                        context.stroke()
                    }
                    if (showAverage)
                    {
                        startAverage = plotLeft + xy * (plotWidth * ((avgMean - scaleStart) / amplitude));
                        context.beginPath();
                        context.strokeStyle = unreasonableColor;
                        if (vertical)
                        {
                            self._paintLine(context, topBox + heightBox * 0.2, startAverage, topBox + heightBox * 0.8, startAverage)
                        }
                        else
                        {
                            self._paintLine(context, startAverage, topBox + heightBox * 0.2, startAverage, topBox + heightBox * 0.8)
                        }
                        context.stroke()
                    }
                    context.restore()
                };
                return BoxPlotSparkline
            })(SparklineEx);
        Sheets.BoxPlotSparkline = BoxPlotSparkline;
        var VariSparklineValue = (function()
            {
                function VariSparklineValue(variance, reference, mini, maxi, mark, tickUnit, legend, colorPositive, colorNegative, vertical)
                {
                    this.variance = variance;
                    this.reference = reference;
                    this.mini = mini;
                    this.maxi = maxi;
                    this.mark = mark;
                    this.tickUnit = tickUnit;
                    this.legend = legend;
                    this.colorPositive = colorPositive;
                    this.colorNegative = colorNegative;
                    this.vertical = vertical
                }
                return VariSparklineValue
            })();
        Sheets.VariSparklineValue = VariSparklineValue;
        var VariSparkline = (function(_super)
            {
                __extends(VariSparkline, _super);
                function VariSparkline()
                {
                    _super.call(this)
                }
                VariSparkline.prototype._getPercentage = function(value)
                {
                    var temp = parseFloat(value);
                    if (isNaN(temp))
                    {
                        return
                    }
                    var tempStr = temp.toString();
                    var len = tempStr.substr(tempStr.indexOf(".") + 1).length;
                    return len >= 2 ? (temp * 100).toFixed(len - 2) + "%" : (temp * 100).toFixed(0) + "%"
                };
                VariSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var func = new Sheets.Calc.Functions.Function("VARISPARKLINE", 1, 10);
                    var self = this;
                    func.evaluate = function(args)
                    {
                        var variance = self.getFirstValueFromReference(args[0]),
                            reference = self.getFirstValueFromReference(args[1]),
                            mini = self.getFirstValueFromReference(args[2]),
                            maxi = self.getFirstValueFromReference(args[3]),
                            mark = self.getFirstValueFromReference(args[4]),
                            tickUnit = self.getFirstValueFromReference(args[5]),
                            legend = args[6],
                            colorPositive = args[7],
                            colorNegative = args[8],
                            vertical = args[9];
                        return new VariSparklineValue(variance, reference, mini, maxi, mark, tickUnit, legend, colorPositive, colorNegative, vertical)
                    };
                    func.acceptsReference = function(argIndex)
                    {
                        return argIndex >= 0 && argIndex <= 5
                    };
                    return func
                };
                VariSparkline.prototype._paintSparkline = function(context, value, x, y, width, height, sheet)
                {
                    var self = this;
                    var variance = value.variance,
                        reference = value.reference,
                        mini = value.mini,
                        maxi = value.maxi,
                        mark = value.mark,
                        tickUnit = value.tickUnit,
                        legend = value.legend,
                        colorPositive = value.colorPositive,
                        colorNegative = value.colorNegative,
                        vertical = value.vertical;
                    var plotTop,
                        plotLeft,
                        plotWidth,
                        plotHeight;
                    var xy,
                        labelText,
                        refWidth,
                        needShowReference;
                    var rectRatio = 0.5,
                        halfRectRatio = 0.5 - rectRatio / 2,
                        needDrawArrow = false,
                        needDrawMarkline = false,
                        margin = 5,
                        defaultMarklineColor = "#CB0000",
                        defaultTickColor = "#969696",
                        fontSize = 13 * sheet._zoomFactor;
                    try
                    {
                        variance = CalcConvert.D(variance)
                    }
                    catch(e)
                    {
                        return
                    }
                    if (colorNegative === keyword_null || typeof colorNegative === const_undefined)
                    {
                        colorNegative = "red"
                    }
                    if (colorPositive === keyword_null || typeof colorPositive === const_undefined)
                    {
                        colorPositive = "green"
                    }
                    if (tickUnit === keyword_null || typeof tickUnit === const_undefined)
                    {
                        tickUnit = 0
                    }
                    if (mark === keyword_null || typeof mark === const_undefined)
                    {
                        needDrawMarkline = false
                    }
                    else
                    {
                        needDrawMarkline = true
                    }
                    if (maxi === keyword_null || typeof maxi === const_undefined)
                    {
                        maxi = 1
                    }
                    if (mini === keyword_null || typeof mini === const_undefined)
                    {
                        mini = -1
                    }
                    if (reference === keyword_null || typeof reference === const_undefined)
                    {
                        reference = 0;
                        needShowReference = false
                    }
                    else
                    {
                        needShowReference = true
                    }
                    if (vertical)
                    {
                        plotLeft = y + height - margin;
                        plotTop = x + 2 * margin;
                        plotHeight = width - 4 * margin;
                        plotWidth = height - 2 * margin;
                        xy = -1
                    }
                    else
                    {
                        plotLeft = x + margin;
                        plotTop = y + 2 * margin;
                        plotWidth = width - 2 * margin;
                        plotHeight = height - 4 * margin;
                        xy = 1
                    }
                    if (legend)
                    {
                        labelText = self._getPercentage(value.variance)
                    }
                    if (variance > maxi)
                    {
                        variance = maxi;
                        needDrawArrow = true
                    }
                    if (variance < mini)
                    {
                        variance = mini;
                        needDrawArrow = true
                    }
                    if (reference > maxi)
                    {
                        reference = maxi
                    }
                    if (reference < mini)
                    {
                        reference = mini
                    }
                    if (needDrawArrow)
                    {
                        if (plotHeight < 15)
                        {
                            refWidth = 15
                        }
                        else if (plotHeight > 60)
                        {
                            refWidth = 60
                        }
                        else
                        {
                            refWidth = plotHeight
                        }
                    }
                    var amplitude = Math_abs(maxi - mini);
                    var unit = plotWidth / amplitude;
                    var startShape = plotLeft + xy * Math_abs(mini - reference) * unit;
                    var endShape = Math_abs(variance - reference) * unit;
                    if (endShape > (Math_abs(amplitude) * unit))
                    {
                        endShape = Math_abs(amplitude + mini) * unit
                    }
                    var limitRight = plotLeft + xy * plotWidth;
                    if ((vertical && startShape < limitRight) || (!vertical && startShape > limitRight))
                    {
                        return
                    }
                    context.save();
                    context.rect(x, y, width, height);
                    context.clip();
                    var clipX,
                        clipY,
                        clipWidth,
                        clipHeight;
                    if (variance > reference)
                    {
                        if (vertical)
                        {
                            clipX = x + halfRectRatio * width;
                            clipY = startShape - endShape;
                            clipWidth = width * rectRatio;
                            clipHeight = endShape;
                            self.paintRect(context, clipX, clipY, clipWidth, clipHeight, colorPositive)
                        }
                        else
                        {
                            clipX = startShape;
                            clipY = y + halfRectRatio * height;
                            clipWidth = endShape;
                            clipHeight = height * rectRatio;
                            self.paintRect(context, clipX, clipY, clipWidth, clipHeight, colorPositive)
                        }
                        if (needDrawArrow)
                        {
                            context.save();
                            context.rect(clipX, clipY, clipWidth, clipHeight);
                            context.clip();
                            if (vertical)
                            {
                                self.paintArrow(context, x + width / 2, plotLeft - plotWidth + margin, refWidth, 0)
                            }
                            else
                            {
                                self.paintArrow(context, plotLeft + plotWidth - margin, y + height / 2, refWidth, 1)
                            }
                            context.restore()
                        }
                        if (legend)
                        {
                            var offsetFromArrow = 0;
                            var labelStartX,
                                labelStartY,
                                dValue;
                            var blank = Math_abs(maxi - variance) * unit;
                            if (needDrawArrow)
                            {
                                offsetFromArrow = 0.4 * refWidth * Math_sqrt(3) / 2 + margin + 2
                            }
                            context.save();
                            context.beginPath();
                            context.font = fontSize + "px Arial";
                            context.fillStyle = "black";
                            if (vertical)
                            {
                                context.textAlign = "center";
                                dValue = fontSize + endShape - (startShape - y);
                                if (dValue > 0)
                                {
                                    if (blank >= endShape)
                                    {
                                        context.textBaseline = "bottom"
                                    }
                                    else
                                    {
                                        context.rect(clipX, clipY, clipWidth, clipHeight);
                                        context.clip();
                                        context.textBaseline = "top";
                                        context.fillStyle = self.getTextColor(colorPositive)
                                    }
                                }
                                else
                                {
                                    context.textBaseline = "bottom"
                                }
                                labelStartY = startShape - endShape + offsetFromArrow;
                                context.fillText(labelText, x + width / 2, labelStartY)
                            }
                            else
                            {
                                context.textBaseline = "middle";
                                var metrics = context.measureText(labelText);
                                dValue = metrics.width + endShape - (x + width - startShape);
                                if (dValue > 0)
                                {
                                    if (blank >= endShape)
                                    {
                                        context.textAlign = "left"
                                    }
                                    else
                                    {
                                        context.rect(clipX, clipY, clipWidth, clipHeight);
                                        context.clip();
                                        context.textAlign = "right";
                                        context.fillStyle = self.getTextColor(colorPositive)
                                    }
                                }
                                else
                                {
                                    context.textAlign = "left"
                                }
                                labelStartX = startShape + endShape - offsetFromArrow;
                                context.fillText(labelText, labelStartX, y + height / 2)
                            }
                            context.restore()
                        }
                    }
                    else
                    {
                        if (endShape > Math_abs(amplitude) * unit)
                        {
                            endShape = Math_abs(amplitude + mini) * unit;
                            startShape = plotLeft
                        }
                        if (vertical)
                        {
                            clipX = x + width * halfRectRatio;
                            clipY = startShape;
                            clipWidth = width * rectRatio;
                            clipHeight = endShape;
                            self.paintRect(context, clipX, clipY, clipWidth, clipHeight, colorNegative)
                        }
                        else
                        {
                            clipX = startShape - endShape;
                            clipY = y + halfRectRatio * height;
                            clipWidth = endShape;
                            clipHeight = height * rectRatio;
                            self.paintRect(context, clipX, clipY, clipWidth, clipHeight, colorNegative)
                        }
                        if (needDrawArrow)
                        {
                            context.save();
                            context.rect(clipX, clipY, clipWidth, clipHeight);
                            context.clip();
                            if (vertical)
                            {
                                self.paintArrow(context, x + width / 2, plotLeft - margin, refWidth, 2)
                            }
                            else
                            {
                                self.paintArrow(context, plotLeft + margin, y + height / 2, refWidth, 3)
                            }
                            context.restore()
                        }
                        if (legend)
                        {
                            var offsetFromArrow = 0;
                            var labelStartX,
                                labelStartY,
                                dValue;
                            var blank = Math_abs(mini - variance) * unit;
                            if (needDrawArrow)
                            {
                                offsetFromArrow = 0.4 * refWidth * Math_sqrt(3) / 2 + margin + 2
                            }
                            context.save();
                            context.beginPath();
                            context.font = fontSize + "px Arial";
                            context.fillStyle = "black";
                            if (vertical)
                            {
                                context.textAlign = "center";
                                dValue = fontSize + endShape - (y + height - startShape);
                                if (dValue > 0)
                                {
                                    if (blank >= endShape)
                                    {
                                        context.textBaseline = "top"
                                    }
                                    else
                                    {
                                        context.rect(clipX, clipY, clipWidth, clipHeight);
                                        context.clip();
                                        context.textBaseline = "bottom";
                                        context.fillStyle = self.getTextColor(colorNegative)
                                    }
                                }
                                else
                                {
                                    context.textBaseline = "top"
                                }
                                labelStartY = startShape + endShape - offsetFromArrow;
                                context.fillText(labelText, x + width / 2, labelStartY)
                            }
                            else
                            {
                                context.textBaseline = "middle";
                                var metrics = context.measureText(labelText);
                                dValue = metrics.width + endShape - (startShape - x);
                                if (dValue > 0)
                                {
                                    if (blank >= endShape)
                                    {
                                        context.textAlign = "right"
                                    }
                                    else
                                    {
                                        context.rect(clipX, clipY, clipWidth, clipHeight);
                                        context.clip();
                                        context.textAlign = "left";
                                        context.fillStyle = self.getTextColor(colorNegative)
                                    }
                                }
                                else
                                {
                                    context.textAlign = "right"
                                }
                                labelStartX = startShape - endShape + offsetFromArrow;
                                context.fillText(labelText, labelStartX, y + height / 2)
                            }
                            context.restore()
                        }
                    }
                    if (needShowReference)
                    {
                        var referencePosition = plotLeft + xy * (Math.abs(mini - reference) * unit);
                        if (vertical)
                        {
                            self.paintLine(context, x, referencePosition, x + width, referencePosition)
                        }
                        else
                        {
                            self.paintLine(context, referencePosition, y, referencePosition, y + height)
                        }
                    }
                    if (tickUnit > 0)
                    {
                        context.beginPath();
                        var numTicks = amplitude / tickUnit;
                        for (var i = 0; i <= numTicks; i++)
                        {
                            var xMark = plotLeft + (plotWidth / numTicks) * i * xy;
                            if (vertical)
                            {
                                self.paintLine(context, x, xMark, x + 0.1 * width, xMark, defaultTickColor)
                            }
                            else
                            {
                                self.paintLine(context, xMark, y + 0.9 * height, xMark, y + height, defaultTickColor)
                            }
                        }
                    }
                    if (needDrawMarkline && mini <= mark && mark <= maxi)
                    {
                        context.beginPath();
                        var markPosition = 0;
                        if (vertical)
                        {
                            markPosition = plotLeft - Math_abs(mini - mark) * unit;
                            self.paintLine(context, x, markPosition, x + 0.33 * width, markPosition, defaultMarklineColor)
                        }
                        else
                        {
                            markPosition = plotLeft + Math_abs(mini - mark) * unit;
                            self.paintLine(context, markPosition, y + 0.66 * height, markPosition, y + height, defaultMarklineColor)
                        }
                        context.fill()
                    }
                    context.restore()
                };
                return VariSparkline
            })(BarSparklineBase);
        Sheets.VariSparkline = VariSparkline;
        var AccumulateSparklineBase = (function(_super)
            {
                __extends(AccumulateSparklineBase, _super);
                function AccumulateSparklineBase()
                {
                    _super.call(this)
                }
                AccumulateSparklineBase.prototype.lightenColor = function(colorString, percentLighter)
                {
                    var color = Sheets._Color.parse(colorString);
                    var hls = new Sheets.HLSColor(color);
                    var lighterColor = hls.getLighterColor(percentLighter);
                    return lighterColor.toString()
                };
                AccumulateSparklineBase.prototype.paintLine = function(ctx, startX, startY, endX, endY)
                {
                    startX = Math_round(startX);
                    startY = Math_round(startY);
                    endX = Math_round(endX);
                    endY = Math_round(endY);
                    if (startX === endX)
                    {
                        endX = endX - 0.5;
                        startX = endX
                    }
                    if (startY === endY)
                    {
                        endY = endY - 0.5;
                        startY = endY
                    }
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY)
                };
                AccumulateSparklineBase.prototype.paintRect = function(ctx, x, y, width, height)
                {
                    var endX = Math_round(x + width),
                        endY = Math_round(y + height);
                    x = Math_round(x);
                    y = Math_round(y);
                    width = Math_round(endX - x);
                    height = Math_round(endY - y);
                    ctx.fillRect(x, y, width, height)
                };
                AccumulateSparklineBase.prototype._getTextColor = function(backColor)
                {
                    var c = Sheets._Color.parse(backColor);
                    if (c && c.getBrightness() < 255 / 2)
                    {
                        return "white"
                    }
                    return "black"
                };
                AccumulateSparklineBase.prototype.paintLabel = function(context, x, y, width, height, labelOption)
                {
                    var self = this,
                        labelText = labelOption.labelText,
                        fontSize = labelOption.fontSize,
                        startBox = labelOption.startBox,
                        endBox = labelOption.endBox,
                        boxColor = labelOption.boxColor,
                        isInRightOrTopOfBox = labelOption.isInRightOrTopOfBox;
                    context.save();
                    context.beginPath();
                    context.font = fontSize + "px Arial";
                    context.fillStyle = "black";
                    var dValue,
                        labelStartX,
                        labelStartY,
                        textMargin = 1;
                    if (labelOption.vertical)
                    {
                        context.textAlign = "center";
                        if (isInRightOrTopOfBox)
                        {
                            dValue = fontSize + endBox - (startBox - y);
                            if (dValue > 0 && startBox - endBox - y < endBox)
                            {
                                context.textBaseline = "top";
                                context.fillStyle = self._getTextColor(boxColor);
                                labelStartY = startBox - endBox + textMargin;
                                context.rect(x, startBox - endBox, width, endBox);
                                context.clip()
                            }
                            else
                            {
                                context.textBaseline = "bottom";
                                labelStartY = startBox - endBox - textMargin
                            }
                        }
                        else
                        {
                            dValue = fontSize - (y + height - startBox);
                            if (dValue > 0 && y + height - startBox < endBox)
                            {
                                context.textBaseline = "bottom";
                                context.fillStyle = self._getTextColor(boxColor);
                                labelStartY = startBox - textMargin;
                                context.rect(x, startBox - endBox, width, endBox);
                                context.clip()
                            }
                            else
                            {
                                context.textBaseline = "top";
                                labelStartY = startBox + textMargin
                            }
                        }
                        context.fillText(labelText, x + width / 2, labelStartY)
                    }
                    else
                    {
                        context.textBaseline = "middle";
                        var textWidth = context.measureText(labelText);
                        if (isInRightOrTopOfBox)
                        {
                            dValue = textWidth.width + endBox - (x + width - startBox);
                            if (dValue > 0 && x + width - (startBox + endBox) < endBox)
                            {
                                context.textAlign = "right";
                                context.fillStyle = self._getTextColor(boxColor);
                                labelStartX = startBox + endBox - textMargin;
                                context.rect(startBox, y, endBox, height);
                                context.clip()
                            }
                            else
                            {
                                context.textAlign = "left";
                                labelStartX = startBox + endBox + textMargin
                            }
                        }
                        else
                        {
                            dValue = textWidth.width - (startBox - x);
                            if (dValue > 0 && startBox - x < endBox)
                            {
                                context.textAlign = "left";
                                context.fillStyle = self._getTextColor(boxColor);
                                labelStartX = startBox + textMargin;
                                context.rect(startBox, y, endBox, height);
                                context.clip()
                            }
                            else
                            {
                                context.textAlign = "right";
                                labelStartX = startBox - textMargin
                            }
                        }
                        context.fillText(labelText, labelStartX, y + height / 2)
                    }
                    context.restore()
                };
                return AccumulateSparklineBase
            })(SparklineEx);
        Sheets.AccumulateSparklineBase = AccumulateSparklineBase;
        var CascadeSparklineValue = (function()
            {
                function CascadeSparklineValue(points, pointIndex, labels, minimum, maximum, colorPositive, colorNegative, vertical)
                {
                    var self = this;
                    self.points = points;
                    self.labels = labels;
                    self.pointIndex = pointIndex;
                    self.minimum = minimum;
                    self.maximum = maximum;
                    self.colorPositive = colorPositive;
                    self.colorNegative = colorNegative;
                    self.vertical = vertical
                }
                return CascadeSparklineValue
            })();
        Sheets.CascadeSparklineValue = CascadeSparklineValue;
        var CascadeSparkline = (function(_super)
            {
                __extends(CascadeSparkline, _super);
                function CascadeSparkline()
                {
                    _super.call(this)
                }
                CascadeSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var func = new Sheets.Calc.Functions.Function("CASCADESPARKLINE", 1, 8);
                    var self = this;
                    func.evaluate = function(args)
                    {
                        var points = self.getAllValuesFromReference(args[0]),
                            pointIndex = self.getFirstValueFromReference(args[1]),
                            labels = self.getAllValuesFromReference(args[2]),
                            minimum = self.getFirstValueFromReference(args[3]),
                            maximum = self.getFirstValueFromReference(args[4]),
                            colorPositive = args[5],
                            colorNegative = args[6],
                            vertical = args[7];
                        return new CascadeSparklineValue(points, pointIndex, labels, minimum, maximum, colorPositive, colorNegative, vertical)
                    };
                    func.acceptsReference = function(argIndex)
                    {
                        return argIndex === 0 || argIndex === 2
                    };
                    func.acceptsArray = function(argIndex)
                    {
                        return argIndex === 0 || argIndex === 2
                    };
                    return func
                };
                CascadeSparkline.prototype._paintSparkline = function(context, value, x, y, width, height, sheet)
                {
                    var self = this,
                        points = value.points,
                        labels = value.labels,
                        pointIndex = value.pointIndex,
                        minimum = value.minimum,
                        maximum = value.maximum,
                        colorPositive = value.colorPositive,
                        colorNegative = value.colorNegative,
                        vertical = value.vertical,
                        margin = 5,
                        fontSize = 13 * sheet._zoomFactor;
                    if (points === keyword_null || points === keyword_undefined)
                    {
                        return
                    }
                    var pointsLength = points.length;
                    if (pointsLength <= 0)
                    {
                        return
                    }
                    if (labels === keyword_null || labels === keyword_undefined)
                    {
                        labels = []
                    }
                    pointIndex = parseInt(pointIndex);
                    if (isNaN(pointIndex) || pointIndex <= 0 || pointIndex > pointsLength)
                    {
                        return
                    }
                    if (colorPositive === keyword_null || typeof(colorPositive) !== const_string)
                    {
                        colorPositive = "#8CBF64"
                    }
                    if (colorNegative === keyword_null || typeof(colorNegative) !== const_string)
                    {
                        colorNegative = "#D6604D"
                    }
                    var positiveStartColor = colorPositive,
                        positiveMidColor = self.lightenColor(colorPositive, 1.3),
                        negativeStartColor = colorNegative,
                        negativeMidColor = self.lightenColor(colorNegative, 1.3);
                    var rank = 1,
                        totalValue = 0,
                        totalValuePrevious = 0,
                        min = 0,
                        max = 0,
                        dataArray = [],
                        zero = 0;
                    for (var i = 0, len = points.length; i < len; i++)
                    {
                        var pointValue = points[i];
                        dataArray[rank] = [];
                        var dataPoint = dataArray[rank];
                        if (isNaN(pointValue))
                        {
                            dataPoint[0] = 0;
                            dataPoint[1] = totalValue;
                            dataPoint[2] = 0;
                            dataPoint[3] = rank
                        }
                        else
                        {
                            dataPoint[0] = Math_abs(pointValue);
                            totalValue = pointValue + totalValue;
                            if (pointValue > 0)
                            {
                                dataPoint[1] = totalValuePrevious;
                                dataPoint[2] = pointValue;
                                dataPoint[3] = rank
                            }
                            else
                            {
                                dataPoint[1] = totalValue;
                                dataPoint[2] = pointValue;
                                dataPoint[3] = rank
                            }
                        }
                        if (totalValuePrevious < min)
                        {
                            min = totalValuePrevious
                        }
                        if (totalValuePrevious > max)
                        {
                            max = totalValuePrevious
                        }
                        if (rank === pointsLength)
                        {
                            if (min < 0)
                            {
                                zero = -min
                            }
                            else
                            {
                                zero = 0
                            }
                            if (pointValue > 0)
                            {
                                dataPoint[1] = 0
                            }
                            else
                            {
                                dataPoint[1] = pointValue
                            }
                        }
                        totalValuePrevious = pointValue + totalValuePrevious;
                        rank++
                    }
                    totalValue = totalValue - pointValue;
                    var scaleStart,
                        scaleEnd;
                    minimum = parseFloat(minimum);
                    if (isNaN(minimum) || minimum > 0 || minimum > min)
                    {
                        scaleStart = min;
                        minimum = min
                    }
                    else
                    {
                        scaleStart = minimum;
                        zero = -minimum
                    }
                    maximum = parseFloat(maximum);
                    if (isNaN(maximum) || maximum < 0 || maximum < max)
                    {
                        scaleEnd = max;
                        maximum = max
                    }
                    else
                    {
                        scaleEnd = maximum;
                        zero = -minimum
                    }
                    var plotLeft,
                        plotWidth,
                        plotTop,
                        plotHeight,
                        xy;
                    if (vertical)
                    {
                        xy = -1;
                        plotTop = x + margin;
                        plotHeight = width - 2 * margin;
                        plotWidth = height - 2 * margin;
                        plotLeft = y + margin + plotWidth
                    }
                    else
                    {
                        xy = 1;
                        plotLeft = x + margin;
                        plotTop = y + margin;
                        plotWidth = width - 2 * margin;
                        plotHeight = height - 2 * margin
                    }
                    var amplitude = scaleEnd - scaleStart,
                        unit = plotWidth / amplitude;
                    context.save();
                    context.rect(x, y, width, height);
                    context.clip();
                    context.beginPath();
                    context.lineWidth = 1;
                    var point = dataArray[pointIndex],
                        dataPointValue = point[2],
                        startBox = plotLeft + xy * (point[1] + zero) * unit,
                        endBox = point[0] * unit;
                    var boxColor;
                    if (dataPointValue >= 0)
                    {
                        if (pointIndex === 1 || pointIndex === pointsLength)
                        {
                            boxColor = positiveStartColor
                        }
                        else
                        {
                            boxColor = positiveMidColor
                        }
                    }
                    else
                    {
                        if (pointIndex === 1 || pointIndex === pointsLength)
                        {
                            boxColor = negativeStartColor
                        }
                        else
                        {
                            boxColor = negativeMidColor
                        }
                    }
                    context.beginPath();
                    context.fillStyle = boxColor;
                    if (vertical)
                    {
                        self.paintRect(context, plotTop, startBox - endBox, plotHeight, endBox)
                    }
                    else
                    {
                        self.paintRect(context, startBox, plotTop, endBox, plotHeight)
                    }
                    context.beginPath();
                    context.strokeStyle = "#DCDCDC";
                    if (vertical)
                    {
                        if (pointIndex !== 1)
                        {
                            if (pointIndex !== pointsLength)
                            {
                                if (dataPointValue > 0)
                                {
                                    self.paintLine(context, x, startBox, plotTop + plotHeight, startBox)
                                }
                                else
                                {
                                    self.paintLine(context, x, startBox - endBox, plotTop + plotHeight, startBox - endBox)
                                }
                            }
                            else
                            {
                                var yMark = plotLeft - (totalValue + zero) * unit;
                                self.paintLine(context, x, yMark, plotTop + plotHeight, yMark)
                            }
                            context.stroke()
                        }
                        if (pointIndex !== pointsLength)
                        {
                            if (dataPointValue > 0)
                            {
                                self.paintLine(context, plotTop, startBox - endBox, x + width, startBox - endBox)
                            }
                            else
                            {
                                self.paintLine(context, plotTop, startBox, x + width, startBox)
                            }
                            context.stroke()
                        }
                    }
                    else
                    {
                        if (pointIndex !== 1)
                        {
                            if (pointIndex !== pointsLength)
                            {
                                if (dataPointValue > 0)
                                {
                                    self.paintLine(context, startBox, y, startBox, plotTop + plotHeight)
                                }
                                else
                                {
                                    self.paintLine(context, startBox + endBox, y, startBox + endBox, plotTop + plotHeight)
                                }
                            }
                            else
                            {
                                var xMark = plotLeft + (totalValue + zero) * unit;
                                self.paintLine(context, xMark, y, xMark, plotTop + plotHeight)
                            }
                            context.stroke()
                        }
                        if (pointIndex !== pointsLength)
                        {
                            if (dataPointValue > 0)
                            {
                                self.paintLine(context, startBox + endBox, plotTop, startBox + endBox, y + height)
                            }
                            else
                            {
                                self.paintLine(context, startBox, plotTop, startBox, y + height)
                            }
                            context.stroke()
                        }
                    }
                    var labelText = labels[pointIndex - 1];
                    if (labels.length > 0 && labelText !== keyword_null && labelText !== keyword_undefined && labelText !== "")
                    {
                        var labelOption = {
                                labelText: labelText, vertical: vertical, isInRightOrTopOfBox: dataPointValue > 0, fontSize: fontSize, startBox: startBox, endBox: endBox, boxColor: boxColor
                            };
                        self.paintLabel(context, x, y, width, height, labelOption)
                    }
                    context.beginPath();
                    context.strokeStyle = "black";
                    if (vertical)
                    {
                        self.paintLine(context, x, plotLeft - zero * unit, x + width, plotLeft - zero * unit)
                    }
                    else
                    {
                        self.paintLine(context, plotLeft + zero * unit, y, plotLeft + zero * unit, y + height)
                    }
                    context.stroke();
                    context.restore()
                };
                return CascadeSparkline
            })(AccumulateSparklineBase);
        Sheets.CascadeSparkline = CascadeSparkline;
        var ParetoSparklineValue = (function()
            {
                function ParetoSparklineValue(points, pointIndex, colorRange, target, target2, highlightPosition, label, vertical)
                {
                    var self = this;
                    self.points = points;
                    self.pointIndex = pointIndex;
                    self.colorRange = colorRange;
                    self.target = target;
                    self.target2 = target2;
                    self.highlightPosition = highlightPosition;
                    self.label = label;
                    self.vertical = vertical
                }
                return ParetoSparklineValue
            })();
        Sheets.ParetoSparklineValue = ParetoSparklineValue;
        var ParetoSparkline = (function(_super)
            {
                __extends(ParetoSparkline, _super);
                function ParetoSparkline()
                {
                    _super.call(this)
                }
                ParetoSparkline.prototype.createFunction = function()
                {
                    if (!Sheets.util.hasCalc())
                    {
                        return keyword_null
                    }
                    var func = new Sheets.Calc.Functions.Function("PARETOSPARKLINE", 1, 8);
                    var self = this;
                    func.evaluate = function(args)
                    {
                        var points = self.getAllValuesFromReference(args[0]),
                            pointIndex = self.getFirstValueFromReference(args[1]),
                            colorRange = self.getAllValuesFromReference(args[2]),
                            target = self.getFirstValueFromReference(args[3]),
                            target2 = self.getFirstValueFromReference(args[4]),
                            highlightPosition = self.getFirstValueFromReference(args[5]),
                            label = args[6],
                            vertical = args[7];
                        return new ParetoSparklineValue(points, pointIndex, colorRange, target, target2, highlightPosition, label, vertical)
                    };
                    func.acceptsReference = function(argIndex)
                    {
                        return argIndex === 0 || argIndex === 2
                    };
                    func.acceptsArray = function(argIndex)
                    {
                        return argIndex === 0 || argIndex === 2
                    };
                    return func
                };
                ParetoSparkline.prototype._paintSparkline = function(context, value, x, y, width, height, sheet)
                {
                    var self = this,
                        points = value.points,
                        pointIndex = value.pointIndex,
                        colorRange = value.colorRange,
                        target = value.target,
                        target2 = value.target2,
                        highlightPosition = value.highlightPosition,
                        label = value.label,
                        vertical = value.vertical,
                        margin = 5,
                        fontSize = 13 * sheet._zoomFactor;
                    if (points === keyword_null || points === keyword_undefined)
                    {
                        return
                    }
                    var pointsLength = points.length;
                    if (pointsLength <= 0)
                    {
                        return
                    }
                    if (colorRange === keyword_null || colorRange === keyword_undefined)
                    {
                        colorRange = []
                    }
                    pointIndex = parseInt(pointIndex);
                    if (isNaN(pointIndex) || pointIndex <= 0 || pointIndex > pointsLength)
                    {
                        return
                    }
                    target = parseFloat(target);
                    if (isNaN(target))
                    {
                        target = 0
                    }
                    if (target < 0)
                    {
                        target = 0
                    }
                    if (target > 1)
                    {
                        target = 1
                    }
                    target2 = parseFloat(target2);
                    if (isNaN(target2))
                    {
                        target2 = 0
                    }
                    if (target2 < 0)
                    {
                        target2 = 0
                    }
                    if (target2 > 1)
                    {
                        target2 = 1
                    }
                    label = parseInt(label);
                    if (isNaN(label))
                    {
                        label = 0
                    }
                    var rank = 1,
                        total = 0,
                        paretoArray = [];
                    for (var i = 0, len = points.length; i < len; i++)
                    {
                        var pointValue = points[i];
                        paretoArray[rank] = [];
                        var paretoPoint = paretoArray[rank];
                        if (pointValue < 0 || isNaN(pointValue) || pointValue === keyword_null || pointValue === keyword_undefined)
                        {
                            if (rank === 1)
                            {
                                paretoPoint[0] = 0;
                                paretoPoint[1] = 0
                            }
                            else
                            {
                                paretoPoint[0] = total;
                                paretoPoint[1] = 0
                            }
                        }
                        else
                        {
                            total = total + pointValue;
                            if (rank === 1)
                            {
                                paretoPoint[0] = 0;
                                paretoPoint[1] = pointValue
                            }
                            else
                            {
                                paretoPoint[0] = total - pointValue;
                                paretoPoint[1] = pointValue
                            }
                        }
                        rank++
                    }
                    var plotLeft,
                        plotWidth,
                        plotTop,
                        plotHeight,
                        xy;
                    if (vertical)
                    {
                        xy = -1;
                        plotTop = x + margin;
                        plotHeight = width - 2 * margin;
                        plotWidth = height - 2 * margin;
                        plotLeft = y + margin + plotWidth
                    }
                    else
                    {
                        xy = 1;
                        plotLeft = x + margin;
                        plotTop = y + margin;
                        plotWidth = width - 2 * margin;
                        plotHeight = height - 2 * margin
                    }
                    var unit = plotWidth / total;
                    context.save();
                    context.rect(x, y, width, height);
                    context.clip();
                    context.beginPath();
                    context.lineWidth = 1;
                    var point = paretoArray[pointIndex],
                        dataPointValue = point[1],
                        startBox = plotLeft + xy * point[0] * unit,
                        endBox = point[1] * unit,
                        boxColor;
                    if (pointIndex === highlightPosition)
                    {
                        boxColor = "#CB0000"
                    }
                    else
                    {
                        if (colorRange.length === 0 || typeof colorRange[pointIndex - 1] !== const_string)
                        {
                            boxColor = "#969696"
                        }
                        else
                        {
                            boxColor = colorRange[pointIndex - 1]
                        }
                    }
                    context.beginPath();
                    context.fillStyle = boxColor;
                    if (vertical)
                    {
                        self.paintRect(context, plotTop, startBox - endBox, plotHeight, endBox)
                    }
                    else
                    {
                        self.paintRect(context, startBox, plotTop, endBox, plotHeight)
                    }
                    var labelPerc;
                    if (label === 1)
                    {
                        labelPerc = (point[0] + dataPointValue) / total * 1000
                    }
                    else if (label === 2)
                    {
                        labelPerc = dataPointValue / total * 1000
                    }
                    var labelText = (Math_round(labelPerc)) / 10 + "%",
                        isInRightOrTopOfBox;
                    if ((point[0] + point[1]) * unit < plotWidth / 2)
                    {
                        isInRightOrTopOfBox = true
                    }
                    else
                    {
                        isInRightOrTopOfBox = false
                    }
                    if ((label === 1 || label === 2) && labelText !== "")
                    {
                        var labelOption = {
                                labelText: labelText, vertical: vertical, isInRightOrTopOfBox: isInRightOrTopOfBox, fontSize: fontSize, startBox: startBox, endBox: endBox, boxColor: boxColor
                            };
                        self.paintLabel(context, x, y, width, height, labelOption)
                    }
                    if (target !== 0)
                    {
                        context.beginPath();
                        context.strokeStyle = "#8CBF64";
                        var targetLine = Math_ceil(plotLeft + xy * plotWidth * target);
                        if (vertical)
                        {
                            self.paintLine(context, x, targetLine, x + width, targetLine)
                        }
                        else
                        {
                            self.paintLine(context, targetLine, y, targetLine, y + height)
                        }
                        context.stroke()
                    }
                    if (target2 !== 0)
                    {
                        context.beginPath();
                        context.strokeStyle = "#EE5D5D";
                        var targetLine2 = Math_ceil(plotLeft + xy * plotWidth * target2);
                        if (vertical)
                        {
                            self.paintLine(context, x, targetLine2, x + width, targetLine2)
                        }
                        else
                        {
                            self.paintLine(context, targetLine2, y, targetLine2, y + height)
                        }
                        context.stroke()
                    }
                    context.restore()
                };
                return ParetoSparkline
            })(AccumulateSparklineBase);
        Sheets.ParetoSparkline = ParetoSparkline
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

