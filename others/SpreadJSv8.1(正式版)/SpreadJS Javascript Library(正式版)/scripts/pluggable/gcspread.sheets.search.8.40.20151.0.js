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
        Sheets.feature("search", ["core.common", "core.sheet_ui", "core.stringResource"]);
        var keyword_null = null,
            Math_max = Math.max,
            Math_min = Math.min;
        (function(EnumeratorOption)
        {
            EnumeratorOption[EnumeratorOption["All"] = 0] = "All";
            EnumeratorOption[EnumeratorOption["HasValue"] = 1] = "HasValue";
            EnumeratorOption[EnumeratorOption["HasStyle"] = 2] = "HasStyle"
        })(Sheets.EnumeratorOption || (Sheets.EnumeratorOption = {}));
        var EnumeratorOption = Sheets.EnumeratorOption;
        var CellsEnumerator = (function()
            {
                function CellsEnumerator(sheet, searchCondition)
                {
                    this.actualEndRow = -1;
                    this.isActualEndRowSet = false;
                    this.isBlockRange = false;
                    this.options = 1;
                    if (!sheet)
                    {
                        throw new Error(GcSpread.Sheets.SR.Exp_SheetIsNull);
                    }
                    var self = this;
                    self.worksheet = sheet;
                    self.sheetArea = searchCondition.sheetArea;
                    self.searchOrder = searchCondition.searchOrder;
                    self.rowStart = searchCondition.rowStart;
                    self.columnStart = searchCondition.columnStart;
                    self.rowEnd = searchCondition.rowEnd;
                    self.columnEnd = searchCondition.columnEnd;
                    self.findBeginRow = searchCondition.findBeginRow;
                    self.findBeginColumn = searchCondition.findBeginColumn;
                    self.init();
                    self.block = self.worksheet
                }
                CellsEnumerator.prototype.init = function()
                {
                    this.currentRow = -1;
                    this.currentColumn = -1
                };
                CellsEnumerator.prototype.moveNext = function()
                {
                    var self = this;
                    if (self.currentRow === -1 && self.currentColumn === -1)
                    {
                        if (self.rowStart <= self.rowEnd && self.columnStart <= self.columnEnd)
                        {
                            self.currentRow = self.findBeginRow;
                            self.currentColumn = self.findBeginColumn;
                            if (self.isIndexAcceptable(self.currentRow, self.currentColumn))
                            {
                                if (!self.skipCurrent())
                                {
                                    return true
                                }
                            }
                        }
                    }
                    if (self.rowStart <= self.rowEnd && self.columnStart <= self.columnEnd)
                    {
                        while (self.tryMoveNext())
                        {
                            if (!self.skipCurrent())
                            {
                                return true
                            }
                        }
                    }
                    self.currentRow = -1;
                    self.currentColumn = -1;
                    return false
                };
                CellsEnumerator.prototype.isIndexAcceptable = function(row, column)
                {
                    var self = this;
                    if ((self.options & 1) > 0)
                    {
                        if (self.block)
                        {
                            if (self.block.getValue(row, column, self.sheetArea) !== keyword_null || self.block.getFormula(row, column, self.sheetArea) !== keyword_null || self.block.getTag(row, column, self.sheetArea) !== keyword_null)
                            {
                                return true
                            }
                        }
                    }
                    return self.options === 0
                };
                CellsEnumerator.prototype.skipCurrent = function()
                {
                    return false
                };
                CellsEnumerator.prototype.tryMoveNext = function()
                {
                    var self = this;
                    var r1 = self.currentRow;
                    var c1 = self.currentColumn;
                    var isValueFound = false;
                    if ((self.options & 1) > 0)
                    {
                        var r1Temp = {value: r1};
                        var c1Temp = {value: c1};
                        if (self.nextValue(r1Temp, c1Temp))
                        {
                            r1 = r1Temp.value;
                            c1 = c1Temp.value;
                            isValueFound = true
                        }
                    }
                    if (self.options === 1)
                    {
                        if (isValueFound)
                        {
                            self.currentRow = r1;
                            self.currentColumn = c1
                        }
                        else
                        {
                            self.currentRow = -1;
                            self.currentColumn = -1
                        }
                    }
                    return !(self.currentRow === -1 && self.currentColumn === -1)
                };
                CellsEnumerator.prototype.nextValue = function(refRow, refColumn)
                {
                    while (this.next(refRow, refColumn))
                    {
                        if (this.isIndexAcceptable(refRow.value, refColumn.value))
                        {
                            return true
                        }
                    }
                    return false
                };
                CellsEnumerator.prototype.nextZOrder = function(model, refRow, refColumn)
                {
                    var self = this;
                    if (model)
                    {
                        var c0 = self.getNextNonEmptyColumnInRow(model, refRow.value, refColumn.value + 1);
                        if (c0 !== -1)
                        {
                            refColumn.value = c0;
                            if (self.isZOrderOver(refRow.value, refColumn.value))
                            {
                                return true
                            }
                        }
                        do
                        {
                            var r1 = model.nextNonNullRow(refRow.value);
                            if (r1 === -1 || r1 > self.rowEnd)
                            {
                                refRow.value = -1
                            }
                            else
                            {
                                if (r1 !== -1)
                                {
                                    refRow.value = r1
                                }
                                if (r1 !== -1 && r1 < refRow.value)
                                {
                                    refRow.value = r1
                                }
                            }
                            if (refRow.value !== -1)
                            {
                                if (refRow.value === self.rowStart || self.isBlockRange)
                                {
                                    refColumn.value = self.columnStart - 1
                                }
                                else
                                {
                                    refColumn.value = -1
                                }
                                do
                                {
                                    var c1 = self.getNextNonEmptyColumnInRow(model, refRow.value, refColumn.value + 1);
                                    if (c1 === -1 || c1 > self.columnEnd)
                                    {
                                        refColumn.value = -1
                                    }
                                    else
                                    {
                                        if (c1 !== -1)
                                        {
                                            refColumn.value = c1
                                        }
                                        if (c1 !== -1 && c1 < refColumn.value)
                                        {
                                            refColumn.value = c1
                                        }
                                    }
                                    if (refColumn.value !== -1)
                                    {
                                        return self.isZOrderOver(refRow.value, refColumn.value)
                                    }
                                } while (refColumn.value !== -1)
                            }
                        } while (refRow.value !== -1)
                    }
                    return false
                };
                CellsEnumerator.prototype.getNextNonEmptyColumnInRow = function(model, row, column)
                {
                    for (var i = column; i <= this.columnEnd; i++)
                    {
                        if (model.getValue(row, i) !== keyword_null)
                        {
                            return i
                        }
                    }
                    return -1
                };
                CellsEnumerator.prototype.isZOrderOver = function(row, column)
                {
                    var self = this;
                    if (self.isBlockRange)
                    {
                        return (row >= self.rowStart && row <= self.getActualEndRow() && column >= self.columnStart && column <= self.actualEndColumn())
                    }
                    else
                    {
                        if (row > self.getActualEndRow())
                        {
                            return false
                        }
                        if (row === self.getActualEndRow())
                        {
                            if (column < 0 || column > self.actualEndColumn())
                            {
                                return false
                            }
                        }
                        if (row < self.rowStart)
                        {
                            return false
                        }
                        if (row === self.rowStart)
                        {
                            if (column < self.columnStart)
                            {
                                return false
                            }
                        }
                    }
                    return true
                };
                CellsEnumerator.prototype.getActualEndRow = function()
                {
                    var self = this;
                    if (self.isActualEndRowSet)
                    {
                        return self.actualEndRow
                    }
                    else
                    {
                        var endRowTemp = -1;
                        var isSet = false;
                        if ((self.options & 1) > 0)
                        {
                            if (self.block)
                            {
                                var index = self.block.getRowCount(self.sheetArea) - 1;
                                endRowTemp = Math_max(endRowTemp, index);
                                isSet = true
                            }
                        }
                        endRowTemp = isSet ? Math_min(endRowTemp, self.rowEnd) : self.rowEnd;
                        self.actualEndRow = endRowTemp;
                        self.isActualEndRowSet = true;
                        return self.actualEndRow
                    }
                };
                CellsEnumerator.prototype.actualEndColumn = function()
                {
                    return this.columnEnd
                };
                CellsEnumerator.prototype.next = function(refRow, refColumn)
                {
                    var self = this;
                    if (self.searchOrder === 0)
                    {
                        var endColumnCurrenRow = self.getActualEndColumnZOrder(refRow.value);
                        if (refColumn.value + 1 <= endColumnCurrenRow)
                        {
                            refColumn.value += 1;
                            return self.isZOrderOver(refRow.value, refColumn.value)
                        }
                        else
                        {
                            if (refRow.value + 1 <= self.getActualEndRow())
                            {
                                refRow.value += 1;
                                if (self.isBlockRange)
                                {
                                    refColumn.value = self.columnStart
                                }
                                else
                                {
                                    refColumn.value = 0
                                }
                                return self.isZOrderOver(refRow.value, refColumn.value)
                            }
                            else
                            {
                                return false
                            }
                        }
                    }
                    else if (self.searchOrder === 1)
                    {
                        var endRowCurrenColumn = self.getActualEndRowNOrder(refColumn.value);
                        if (refRow.value + 1 <= endRowCurrenColumn)
                        {
                            refRow.value += 1;
                            return self.isNOrderOver(refRow.value, refColumn.value)
                        }
                        else
                        {
                            if (refColumn.value + 1 <= self.actualEndColumn())
                            {
                                refColumn.value += 1;
                                if (self.isBlockRange)
                                {
                                    refRow.value = self.rowStart
                                }
                                else
                                {
                                    refRow.value = 0
                                }
                                return self.isNOrderOver(refRow.value, refColumn.value)
                            }
                            else
                            {
                                return false
                            }
                        }
                    }
                    return false
                };
                CellsEnumerator.prototype.getActualEndColumnZOrder = function(row)
                {
                    var self = this;
                    if (row >= self.rowStart && row <= self.rowEnd)
                    {
                        var endColumnTemp = -1;
                        var isSet = false;
                        if ((self.options & 1) > 0)
                        {
                            if (self.block)
                            {
                                endColumnTemp = Math_max(endColumnTemp, self.block.getColumnCount(self.sheetArea) - 1);
                                isSet = true
                            }
                        }
                        if (row === self.rowEnd || self.isBlockRange)
                        {
                            endColumnTemp = isSet ? Math_min(endColumnTemp, self.columnEnd) : self.columnEnd
                        }
                        else
                        {
                            endColumnTemp = isSet ? Math_max(endColumnTemp, self.worksheet.getColumnCount(self.sheetArea) - 1) : self.worksheet.getColumnCount(self.sheetArea) - 1
                        }
                        return endColumnTemp
                    }
                    else
                    {
                        return -1
                    }
                };
                CellsEnumerator.prototype.getActualEndRowNOrder = function(column)
                {
                    var self = this;
                    if (column >= self.columnStart && column <= self.columnEnd)
                    {
                        var endRowTemp = -1;
                        var isSet = false;
                        if ((self.options & 1) > 0)
                        {
                            if (self.block)
                            {
                                endRowTemp = Math_max(endRowTemp, self.rowEnd);
                                isSet = true
                            }
                        }
                        if (column === self.columnEnd || self.isBlockRange)
                        {
                            endRowTemp = isSet ? Math_min(endRowTemp, self.rowEnd) : self.rowEnd
                        }
                        else
                        {
                            endRowTemp = isSet ? Math_max(endRowTemp, self.worksheet.getRowCount(self.sheetArea) - 1) : self.worksheet.getRowCount(self.sheetArea) - 1
                        }
                        return endRowTemp
                    }
                    else
                    {
                        return -1
                    }
                };
                CellsEnumerator.prototype.isNOrderOver = function(row, column)
                {
                    var self = this;
                    if (self.isBlockRange)
                    {
                        return (row >= self.rowStart && row <= self.getActualEndRow() && column >= self.columnStart && column <= self.actualEndColumn())
                    }
                    else
                    {
                        if (column > self.actualEndColumn())
                        {
                            return false
                        }
                        if (column === self.actualEndColumn())
                        {
                            if (row < 0 || row > self.getActualEndRow())
                            {
                                return false
                            }
                        }
                        if (column < self.columnStart)
                        {
                            return false
                        }
                        if (column === self.columnStart)
                        {
                            if (row < self.rowStart)
                            {
                                return false
                            }
                        }
                    }
                    return true
                };
                CellsEnumerator.prototype.current = function()
                {
                    var self = this;
                    if (0 <= self.currentRow && self.currentRow < self.worksheet.getRowCount(self.sheetArea) && 0 <= self.currentColumn && self.currentColumn < self.worksheet.getColumnCount(self.sheetArea))
                    {
                        return new Sheets.Cell(self.worksheet, self.currentRow, self.currentColumn, self.sheetArea)
                    }
                    return keyword_null
                };
                return CellsEnumerator
            })();
        Sheets.CellsEnumerator = CellsEnumerator;
        var SearchCondition = (function()
            {
                function SearchCondition()
                {
                    var self = this;
                    self.startSheetIndex = -1;
                    self.endSheetIndex = -1;
                    self.searchString = keyword_null;
                    self.searchFlags = 0;
                    self.searchOrder = 0;
                    self.searchTarget = 1;
                    self.sheetArea = 3;
                    self.rowStart = -1;
                    self.columnStart = -1;
                    self.rowEnd = -1;
                    self.columnEnd = -1;
                    self.findBeginRow = -1;
                    self.findBeginColumn = -1
                }
                return SearchCondition
            })();
        Sheets.SearchCondition = SearchCondition;
        var SearchResult = (function()
            {
                function SearchResult()
                {
                    var self = this;
                    self.searchFoundFlag = 0;
                    self.foundSheetIndex = -1;
                    self.foundRowIndex = -1;
                    self.foundColumnIndex = -1;
                    self.foundString = keyword_null
                }
                return SearchResult
            })();
        Sheets.SearchResult = SearchResult;
        (function(SearchFlags)
        {
            SearchFlags[SearchFlags["None"] = 0] = "None";
            SearchFlags[SearchFlags["IgnoreCase"] = 1] = "IgnoreCase";
            SearchFlags[SearchFlags["ExactMatch"] = 2] = "ExactMatch";
            SearchFlags[SearchFlags["UseWildCards"] = 4] = "UseWildCards";
            SearchFlags[SearchFlags["BlockRange"] = 8] = "BlockRange"
        })(Sheets.SearchFlags || (Sheets.SearchFlags = {}));
        var SearchFlags = Sheets.SearchFlags;
        (function(SearchOrder)
        {
            SearchOrder[SearchOrder["ZOrder"] = 0] = "ZOrder";
            SearchOrder[SearchOrder["NOrder"] = 1] = "NOrder"
        })(Sheets.SearchOrder || (Sheets.SearchOrder = {}));
        var SearchOrder = Sheets.SearchOrder;
        (function(SearchFoundFlags)
        {
            SearchFoundFlags[SearchFoundFlags["None"] = 0] = "None";
            SearchFoundFlags[SearchFoundFlags["CellText"] = 1] = "CellText";
            SearchFoundFlags[SearchFoundFlags["CellTag"] = 4] = "CellTag";
            SearchFoundFlags[SearchFoundFlags["CellFormula"] = 8] = "CellFormula"
        })(Sheets.SearchFoundFlags || (Sheets.SearchFoundFlags = {}));
        var SearchFoundFlags = Sheets.SearchFoundFlags
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

