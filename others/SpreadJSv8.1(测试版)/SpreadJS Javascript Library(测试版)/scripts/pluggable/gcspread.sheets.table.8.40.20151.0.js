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
        Sheets.feature("table", ["core.common", "core.stringResource"]);
        var keyword_null = null,
            keyword_undefined = undefined,
            Math_min = Math.min,
            Math_floor = Math.floor,
            const_function = "function",
            const_undefined = "undefined",
            const_column = "Column";
        var SheetTable = (function()
            {
                function SheetTable(name, row, col, rowCount, colCount, style)
                {
                    var self = this;
                    var self = this;
                    self._name = keyword_null;
                    self._row = -1;
                    self._col = -1;
                    self._rowCount = -1;
                    self._colCount = -1;
                    self._style = keyword_null;
                    self._showHeader = true;
                    self._showFooter = false;
                    self._highlightFirstColumn = false;
                    self._highlightLastColumn = false;
                    self._bandRows = true;
                    self._bandColumns = false;
                    self._bindingManager = keyword_null;
                    self._columns = keyword_null;
                    self._rowFilter = keyword_null;
                    self._owner = keyword_null;
                    if (name !== keyword_undefined)
                    {
                        self._name = name
                    }
                    if (row !== keyword_undefined)
                    {
                        self._row = row
                    }
                    if (col !== keyword_undefined)
                    {
                        self._col = col
                    }
                    if (rowCount !== keyword_undefined)
                    {
                        self._rowCount = rowCount
                    }
                    if (colCount !== keyword_undefined)
                    {
                        self._colCount = colCount
                    }
                    if (style !== keyword_undefined)
                    {
                        self._style = style
                    }
                    self._autoGenerateColumns = true;
                    self._columns = [];
                    for (var i = 0; i < self._colCount; i++)
                    {
                        var tc = new TableColumnInfo(i + 1);
                        self._columns.push(tc)
                    }
                }
                SheetTable.prototype.range = function()
                {
                    var self = this;
                    return new Sheets.Range(self._row, self._col, self._rowCount, self._colCount)
                };
                SheetTable.prototype.dataRange = function()
                {
                    var self = this;
                    var r = (self._showHeader ? self._row + 1 : self._row);
                    var rc = (self._showHeader ? self._rowCount - 1 : self._rowCount);
                    if (self._showFooter)
                    {
                        rc--
                    }
                    return new Sheets.Range(r, self._col, rc, self._colCount)
                };
                SheetTable.prototype.name = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._name
                    }
                    this._name = value;
                    return this
                };
                SheetTable.prototype.headerIndex = function()
                {
                    return (this._showHeader ? this._row : -1)
                };
                SheetTable.prototype.footerIndex = function()
                {
                    return (this._showFooter ? this._row + this._rowCount - 1 : -1)
                };
                SheetTable.prototype.showHeader = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._showHeader
                    }
                    if (self._showHeader === value)
                    {
                        return self
                    }
                    var show = self._showHeader = value;
                    if (show)
                    {
                        if (self._row > 0)
                        {
                            self._row = self._row - 1;
                            self._rowCount = self._rowCount + 1
                        }
                        self._syncHeader();
                        self._getSheet().invalidate()
                    }
                    else
                    {
                        var oldRow = self._row;
                        self._row = self._row + 1;
                        self._rowCount = self._rowCount - 1;
                        self._clearSheetRow(oldRow);
                        self._resetFilter()
                    }
                    var sheet = self._getSheet();
                    if (sheet)
                    {
                        sheet.recalcRange(self._row + (value ? 0 : -1), self._col, 1, self._colCount)
                    }
                    return self
                };
                SheetTable.prototype.showFooter = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._showFooter
                    }
                    if (self._showFooter === value)
                    {
                        return self
                    }
                    var sheet = self._getSheet();
                    var show = self._showFooter = value;
                    if (show)
                    {
                        if (!sheet || self._row + self._rowCount < sheet.getRowCount())
                        {
                            self._rowCount = self._rowCount + 1
                        }
                        self._syncFooter()
                    }
                    else
                    {
                        var oldRow = self._row + self._rowCount - 1;
                        self._rowCount = self._rowCount - 1;
                        self._clearSheetRow(oldRow)
                    }
                    if (sheet)
                    {
                        sheet.recalcRange(self._row + self._rowCount + (value ? -1 : 0), self._col, 1, self._colCount)
                    }
                    return self
                };
                SheetTable.prototype.bandRows = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._bandRows
                    }
                    this._bandRows = value;
                    return this
                };
                SheetTable.prototype.bandColumns = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._bandColumns
                    }
                    this._bandColumns = value;
                    return this
                };
                SheetTable.prototype.highlightFirstColumn = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._highlightFirstColumn
                    }
                    this._highlightFirstColumn = value;
                    return this
                };
                SheetTable.prototype.highlightLastColumn = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._highlightLastColumn
                    }
                    this._highlightLastColumn = value;
                    return this
                };
                SheetTable.prototype.style = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._style
                    }
                    this._style = value;
                    return this
                };
                SheetTable.prototype.rowFilter = function()
                {
                    var self = this;
                    if (!self._rowFilter && Sheets.features.filter)
                    {
                        self._rowFilter = new Sheets._TableFilter(self);
                        self._rowFilter._updateRange(self.dataRange())
                    }
                    return self._rowFilter
                };
                SheetTable.prototype.autoGenerateColumns = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._autoGenerateColumns
                    }
                    this._autoGenerateColumns = value;
                    return this
                };
                SheetTable.prototype.bindColumns = function(columns)
                {
                    var self = this;
                    if (columns)
                    {
                        var length = Math_min(self._colCount, columns.length);
                        for (var i = 0; i < length; i++)
                        {
                            var column = self._columns[i];
                            if (!column)
                            {
                                column = new TableColumnInfo(self._newAutoId());
                                self._columns[i] = column
                            }
                            column.name(columns[i].name());
                            column.dataField(columns[i].dataField())
                        }
                    }
                };
                SheetTable.prototype.bindingPath = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._bindingPath
                    }
                    self._bindingPath = value;
                    self._applyBindingPath();
                    return self
                };
                SheetTable.prototype.refresh = function(){};
                SheetTable.prototype.getColumnName = function(tableColumnIndex)
                {
                    var tcs = this._columns;
                    if (tcs)
                    {
                        if (0 <= tableColumnIndex && tableColumnIndex < tcs.length)
                        {
                            var tc = tcs[tableColumnIndex];
                            if (tc)
                            {
                                var name = tc.name();
                                if (name !== keyword_null)
                                {
                                    name = Sheets.util.toString(name)
                                }
                                return name
                            }
                        }
                    }
                    return keyword_null
                };
                SheetTable.prototype.setColumnName = function(tableColumnIndex, name)
                {
                    var self = this;
                    if (self._hasColumnName(name))
                    {
                        return self
                    }
                    var tcs = self._columns;
                    if (tcs && 0 <= tableColumnIndex && tableColumnIndex < tcs.length)
                    {
                        var tc = tcs[tableColumnIndex];
                        if (!tc)
                        {
                            tc = self._columns[tableColumnIndex] = new TableColumnInfo(self._newAutoId())
                        }
                        tc.name(name);
                        if (self._showHeader)
                        {
                            var sheet = self._getSheet();
                            if (sheet)
                            {
                                sheet.setText(self.headerIndex(), self._col + tableColumnIndex, name)
                            }
                        }
                    }
                    return self
                };
                SheetTable.prototype.getColumnFormula = function(tableColumnIndex)
                {
                    var tcs = this._columns;
                    if (tcs && 0 <= tableColumnIndex && tableColumnIndex < tcs.length)
                    {
                        var tc = tcs[tableColumnIndex];
                        if (tc)
                        {
                            var formula = tc.formula();
                            return (formula ? formula.toUpperCase() : formula)
                        }
                    }
                    return keyword_null
                };
                SheetTable.prototype.setColumnFormula = function(tableColumnIndex, formula)
                {
                    var self = this;
                    var tcs = self._columns;
                    if (tcs && 0 <= tableColumnIndex && tableColumnIndex < tcs.length)
                    {
                        if (formula && formula[0] === "=")
                        {
                            formula = formula.substring(1)
                        }
                        var tc = tcs[tableColumnIndex];
                        if (tc)
                        {
                            tc.formula(formula)
                        }
                        if (self._showFooter)
                        {
                            var sheet = self._getSheet();
                            if (sheet)
                            {
                                sheet.setFormula(self.footerIndex(), self._col + tableColumnIndex, formula)
                            }
                        }
                    }
                    return self
                };
                SheetTable.prototype.setColumnDataFormula = function(tableColumnIndex, formula)
                {
                    var tcs = this._columns;
                    if (tcs && 0 <= tableColumnIndex && tableColumnIndex < tcs.length)
                    {
                        if (formula && formula[0] === "=")
                        {
                            formula = formula.substring(1)
                        }
                        var tc = tcs[tableColumnIndex];
                        if (tc)
                        {
                            this._setColumnDataAreaFormulaCore(tc, formula)
                        }
                    }
                    return this
                };
                SheetTable.prototype.getColumnValue = function(tableColumnIndex)
                {
                    var self = this;
                    var tcs = self._columns;
                    if (tcs && 0 <= tableColumnIndex && tableColumnIndex < tcs.length)
                    {
                        var tc = tcs[tableColumnIndex];
                        if (tc)
                        {
                            if (self._showFooter && tc.formula())
                            {
                                var sheet = self._getSheet();
                                if (sheet)
                                {
                                    return sheet.getValue(self.footerIndex(), self._col + tableColumnIndex)
                                }
                            }
                            return tc.value()
                        }
                    }
                    return keyword_null
                };
                SheetTable.prototype.setColumnValue = function(tableColumnIndex, value)
                {
                    var self = this;
                    var tcs = self._columns;
                    if (tcs && 0 <= tableColumnIndex && tableColumnIndex < tcs.length)
                    {
                        var tc = tcs[tableColumnIndex];
                        if (tc)
                        {
                            tc.value(value)
                        }
                        if (self._showFooter)
                        {
                            var sheet = self._getSheet();
                            if (sheet)
                            {
                                sheet.setValue(self.footerIndex(), self._col + tableColumnIndex, value)
                            }
                        }
                    }
                    return self
                };
                SheetTable.prototype.filterButtonVisible = function(tableColumnIndex, value)
                {
                    var self = this,
                        sheet = self._owner.getSheet(),
                        rowFilter = self.rowFilter();
                    if (tableColumnIndex < 0 || tableColumnIndex >= self._colCount)
                    {
                        return
                    }
                    switch (arguments.length)
                    {
                        case 0:
                            return rowFilter.filterButtonVisible();
                        case 1:
                            var arg0 = arguments[0];
                            if (typeof arg0 === "number")
                            {
                                return rowFilter.filterButtonVisible(self._col + arg0)
                            }
                            else if (typeof arg0 === "boolean")
                            {
                                var oldState = sheet.isPaintSuspended();
                                sheet.isPaintSuspended(true);
                                for (var i = 0; i < self._colCount; i++)
                                {
                                    rowFilter.filterButtonVisible(self._col + i, arg0)
                                }
                                sheet.isPaintSuspended(oldState);
                                return self
                            }
                        case 2:
                            rowFilter.filterButtonVisible(self._col + tableColumnIndex, value);
                            return self
                    }
                };
                SheetTable.prototype._setColumnDataAreaFormulaCore = function(column, formula, forceUpdate)
                {
                    if (typeof forceUpdate === "undefined")
                    {
                        forceUpdate = false
                    }
                    if (!forceUpdate && column.dataAreaFormula() === formula)
                    {
                        return
                    }
                    var self = this;
                    column.dataAreaFormula(formula);
                    var sheet = self._owner.getSheet();
                    var suspendCalcServiceByThis = false;
                    sheet.suspendCalcService();
                    var columnIndexInSheet = self._getColumnIndex(column) + self._col;
                    var row = self._row;
                    var rowCount = self._rowCount;
                    if (self.showHeader())
                    {
                        row++;
                        rowCount--
                    }
                    if (self.showFooter())
                    {
                        rowCount--
                    }
                    for (var rowIndex = row; rowIndex < row + rowCount; rowIndex++)
                    {
                        sheet.setFormula(rowIndex, columnIndexInSheet, formula)
                    }
                    sheet.resumeCalcService()
                };
                SheetTable.prototype._getColumnIndex = function(column)
                {
                    for (var i = 0; i < this._columns.length; i++)
                    {
                        if (this._columns[i] === column)
                        {
                            return i
                        }
                    }
                    return -1
                };
                SheetTable.prototype._setOwner = function(value)
                {
                    this._owner = value
                };
                SheetTable.prototype._getSheet = function()
                {
                    if (this._owner)
                    {
                        return this._owner.getSheet()
                    }
                    return keyword_null
                };
                SheetTable.prototype._bind = function(bindingSource)
                {
                    var self = this,
                        autoGenerateColumns = self._autoGenerateColumns;
                    self._resetFilter();
                    var sheet = self._getSheet();
                    if (sheet)
                    {
                        var drg = self.dataRange();
                        sheet.clear(drg.row, drg.col, drg.rowCount, drg.colCount, 3, 1 | 16);
                        if (!autoGenerateColumns)
                        {
                            var columnInfos = self._columns;
                            for (var c = 0, cCount = columnInfos.length; c < cCount; c++)
                            {
                                var dataAreaFormula = columnInfos[c].dataAreaFormula();
                                if (dataAreaFormula)
                                {
                                    for (var r = 0, rCount = drg.rowCount; r < rCount; r++)
                                    {
                                        sheet.setFormula(drg.row + r, drg.col + c, dataAreaFormula)
                                    }
                                }
                            }
                        }
                    }
                    if (autoGenerateColumns)
                    {
                        var cr = self.range();
                        self._clear(cr.row, cr.col, cr.rowCount, cr.colCount)
                    }
                    self._bindingManager = bindingSource;
                    if (bindingSource)
                    {
                        var bs = self._bindingManager,
                            rc = bs.getRowCount(),
                            cc = bs.getColumnCount();
                        if (self._showHeader)
                        {
                            rc++
                        }
                        if (self._showFooter)
                        {
                            rc++
                        }
                        self._rowCount = rc;
                        if (autoGenerateColumns)
                        {
                            self._colCount = cc;
                            self._columns = [];
                            var names = bs.getFields();
                            for (var i = 0; i < self._colCount; i++)
                            {
                                var tc = new TableColumnInfo(i + 1);
                                self._columns[i] = tc;
                                if (names)
                                {
                                    tc.name(names[i]);
                                    tc.dataField(names[i])
                                }
                            }
                        }
                    }
                    if (self._rowFilter)
                    {
                        self._rowFilter._updateRange(self.dataRange())
                    }
                };
                SheetTable.prototype._getDataSourceCol = function(col)
                {
                    var self = this,
                        bindingManager = self._bindingManager;
                    if (bindingManager)
                    {
                        var fields = bindingManager.getFields();
                        if (fields)
                        {
                            var column = self._columns[col - self.startColumn()];
                            var dataField = column && column.dataField();
                            for (var i = 0, count = fields.length; i < count; i++)
                            {
                                if (fields[i] === dataField)
                                {
                                    return i
                                }
                            }
                        }
                    }
                    return -1
                };
                SheetTable.prototype.hasBinding = function()
                {
                    return !!this._bindingManager
                };
                SheetTable.prototype._getValue = function(row, col)
                {
                    var self = this,
                        bindingManager = self._bindingManager,
                        newRow = row - self.dataRange().row,
                        newCol;
                    if (bindingManager && newRow < bindingManager.getRowCount() && (newCol = self._getDataSourceCol(col)) >= 0)
                    {
                        return {
                                hasBinding: true, value: bindingManager.getValue(newRow, newCol).value
                            }
                    }
                    return {
                            hasBinding: false, value: undefined
                        }
                };
                SheetTable.prototype._setValue = function(row, col, value)
                {
                    var self = this,
                        bindingManager = self._bindingManager,
                        newRow = row - self.dataRange().row,
                        newCol;
                    if (bindingManager && (newCol = self._getDataSourceCol(col)) >= 0)
                    {
                        var sheet = self._getSheet();
                        if (sheet)
                        {
                            var m = sheet._sheetModelManager.getDataModel();
                            if (m)
                            {
                                var bdValue = bindingManager.getValue(newRow, newCol);
                                if (bdValue.hasBinding && bdValue.value !== value)
                                {
                                    m._updateDirty(row, col, {oldValue: bdValue.value})
                                }
                                m.setValue(row, col, keyword_undefined)
                            }
                        }
                        bindingManager.setValue(newRow, newCol, value);
                        return true
                    }
                    return false
                };
                SheetTable.prototype._compose = function(row, col, dest)
                {
                    var self = this,
                        style = self._style;
                    if (!style)
                    {
                        return
                    }
                    var sheet = self._getSheet();
                    if (sheet && sheet.getRowHeight(row) <= 0)
                    {
                        return
                    }
                    var headerRowIndex = self.headerIndex(),
                        footerRowIndex = self.footerIndex(),
                        isFirstRow = (self._showHeader ? (row === self._row + 1) : (row === self._row)),
                        isLastRow = (self._showFooter ? (row === self._row + self._rowCount - 2) : (row === self._row + self._rowCount - 1)),
                        isFirstCol = (col === self._col),
                        isLastCol = (col === self._col + self._colCount - 1),
                        firstTableRow = (self._showHeader ? (row === headerRowIndex) : (row === self._row)),
                        lastTableRow = (self._showFooter ? (row === footerRowIndex) : (row === self._row + self._rowCount - 1)),
                        highlightLastColumnStyle = style.highlightLastColumnStyle(),
                        highlightFirstColumnStyle = style.highlightFirstColumnStyle();
                    if (headerRowIndex === row)
                    {
                        var lastHeaderCellStyle = style.lastHeaderCellStyle();
                        if (isLastCol && self._highlightLastColumn && lastHeaderCellStyle)
                        {
                            lastHeaderCellStyle._compose(dest, true, true, true, true)
                        }
                        var firstHeaderCellStyle = style.firstHeaderCellStyle();
                        if (isFirstCol && self._highlightFirstColumn && firstHeaderCellStyle)
                        {
                            firstHeaderCellStyle._compose(dest, true, true, true, true)
                        }
                        var headerRowStyle = style.headerRowStyle();
                        if (headerRowStyle)
                        {
                            headerRowStyle._compose(dest, true, isFirstCol, true, isLastCol)
                        }
                        if (isLastCol && self._highlightLastColumn && highlightLastColumnStyle)
                        {
                            highlightLastColumnStyle._compose(dest, true, true, false, true)
                        }
                        if (isFirstCol && self._highlightFirstColumn && highlightFirstColumnStyle)
                        {
                            highlightFirstColumnStyle._compose(dest, true, true, false, true)
                        }
                    }
                    else if (footerRowIndex === row)
                    {
                        var lastFooterCellStyle = style.lastFooterCellStyle();
                        if (isLastCol && self._highlightLastColumn && lastFooterCellStyle)
                        {
                            lastFooterCellStyle._compose(dest, true, true, true, true)
                        }
                        var firstFooterCellStyle = style.firstFooterCellStyle();
                        if (isFirstCol && self._highlightFirstColumn && firstFooterCellStyle)
                        {
                            firstFooterCellStyle._compose(dest, true, true, true, true)
                        }
                        var footerRowStyle = style.footerRowStyle();
                        if (footerRowStyle)
                        {
                            footerRowStyle._compose(dest, true, isFirstCol, true, isLastCol)
                        }
                        if (isLastCol && self._highlightLastColumn && highlightLastColumnStyle)
                        {
                            highlightLastColumnStyle._compose(dest, false, true, true, true)
                        }
                        if (isFirstCol && self._highlightFirstColumn && highlightFirstColumnStyle)
                        {
                            highlightFirstColumnStyle._compose(dest, false, true, true, true)
                        }
                    }
                    else
                    {
                        if (isLastCol && self._highlightLastColumn && highlightLastColumnStyle)
                        {
                            highlightLastColumnStyle._compose(dest, firstTableRow, true, lastTableRow, true)
                        }
                        if (isFirstCol && self._highlightFirstColumn && highlightFirstColumnStyle)
                        {
                            highlightFirstColumnStyle._compose(dest, firstTableRow, true, lastTableRow, true)
                        }
                        var relativeRow = (self._showHeader ? row - self._row - 1 : row - self._row),
                            relativeCol = col - self._col;
                        if (Sheets._CacheMgr._cached && Sheets._CacheMgr._visibleRowIndexCache)
                        {
                            var relativeRowCatch = Sheets._CacheMgr._visibleRowIndexCache;
                            var r = self.dataRange().row;
                            while (relativeRowCatch[r] === -1)
                            {
                                r++
                            }
                            if (r > row)
                            {
                                return
                            }
                            relativeRow = relativeRowCatch[row] - relativeRowCatch[r]
                        }
                        else if (sheet)
                        {
                            var rCount = 0,
                                cCount = 0;
                            for (var r = self.dataRange().row; r < row; r++)
                            {
                                if (sheet.getRowHeight(r) > 0)
                                {
                                    rCount++
                                }
                            }
                            for (var c = self._col; c < col; c++)
                            {
                                if (sheet.getColumnWidth(c) > 0)
                                {
                                    cCount++
                                }
                            }
                            relativeRow = rCount;
                            relativeCol = cCount
                        }
                        if (self.bandRows())
                        {
                            var firstRowStripSize = style.firstRowStripSize(),
                                stripSize = firstRowStripSize + style.secondRowStripSize();
                            if (stripSize > 0)
                            {
                                var alter = relativeRow % stripSize,
                                    firstRowStripStyle = style.firstRowStripStyle(),
                                    secondRowStripStyle = style.secondRowStripStyle();
                                if (alter < firstRowStripSize && firstRowStripStyle)
                                {
                                    var bandFirstRow = (alter === 0);
                                    var bandLastRow = (isLastRow || alter === firstRowStripSize - 1);
                                    firstRowStripStyle._compose(dest, bandFirstRow, isFirstCol, bandLastRow, isLastCol)
                                }
                                else if (alter >= firstRowStripSize && secondRowStripStyle)
                                {
                                    var bandFirstRow = (alter === firstRowStripSize);
                                    var bandLastRow = (isLastRow || alter === stripSize - 1);
                                    secondRowStripStyle._compose(dest, bandFirstRow, isFirstCol, bandLastRow, isLastCol)
                                }
                            }
                        }
                        if (self.bandColumns())
                        {
                            var firstColumnStripSize = style.firstColumnStripSize(),
                                stripSize = firstColumnStripSize + style.secondColumnStripSize();
                            if (stripSize > 0)
                            {
                                var alter = relativeCol % stripSize,
                                    firstColumnStripStyle = style.firstColumnStripStyle(),
                                    secondColumnStripStyle = style.secondColumnStripStyle();
                                if (alter < firstColumnStripSize && firstColumnStripStyle)
                                {
                                    var bandFirstCol = (alter === 0);
                                    var bandLastCol = (isLastCol || alter === firstColumnStripSize - 1);
                                    firstColumnStripStyle._compose(dest, isFirstRow, bandFirstCol, isLastRow, bandLastCol)
                                }
                                else if (alter >= firstColumnStripSize && secondColumnStripStyle)
                                {
                                    var bandFirstCol = (alter === firstColumnStripSize);
                                    var bandLastCol = (isLastCol || alter === stripSize - 1);
                                    secondColumnStripStyle._compose(dest, isFirstRow, bandFirstCol, isLastRow, bandLastCol)
                                }
                            }
                        }
                    }
                    var wholeTableStyle = style.wholeTableStyle();
                    if (wholeTableStyle)
                    {
                        wholeTableStyle._compose(dest, firstTableRow, isFirstCol, lastTableRow, isLastCol)
                    }
                };
                SheetTable.prototype._moveTo = function(row, col)
                {
                    var self = this;
                    if (row === self._row && col === self._col)
                    {
                        return
                    }
                    var sheet = self._getSheet();
                    if (sheet)
                    {
                        if (row < 0 || sheet.getRowCount() < row + self._rowCount)
                        {
                            throw new Error(Sheets.SR.Exp_TableMoveOutOfRange);
                        }
                        if (col < 0 || sheet.getColumnCount() < col + self._colCount)
                        {
                            throw new Error(Sheets.SR.Exp_TableMoveOutOfRange);
                        }
                        var tableManager = self._owner,
                            tables,
                            i,
                            length;
                        if (tableManager)
                        {
                            tables = tableManager.getTables();
                            i = 0;
                            length = tables.length;
                            for (; i < length; i++)
                            {
                                if (tables[i] === self)
                                {
                                    tables.splice(i, 1);
                                    self._clearSheetModelFormula();
                                    break
                                }
                            }
                        }
                        sheet.moveTo(self._row, self._col, row, col, self._rowCount, self._colCount, 1 | 2);
                        if (tables && i <= length)
                        {
                            self._moveToCore(row, col);
                            tables.splice(i, 0, self);
                            self._syncSheetModelFormula()
                        }
                    }
                };
                SheetTable.prototype._moveToCore = function(row, col)
                {
                    var self = this;
                    self._row = row;
                    self._col = col;
                    self._updateFilter()
                };
                SheetTable.prototype._clearSheetModelFormula = function(colIndex, endColIndex)
                {
                    var self = this,
                        sheet = self._getSheet();
                    if (!sheet)
                    {
                        return
                    }
                    var columnInfos = self._columns,
                        footerIndex = self.footerIndex(),
                        tableRange = self.range(),
                        tableDataRange = self.dataRange();
                    if (colIndex === keyword_null || colIndex === keyword_undefined)
                    {
                        colIndex = 0;
                        endColIndex = columnInfos.length
                    }
                    for (; colIndex < endColIndex; colIndex++)
                    {
                        var info = columnInfos[colIndex],
                            col = tableRange.col + colIndex;
                        if (info && info.formula() && footerIndex >= 0)
                        {
                            sheet.setFormula(footerIndex, col, keyword_null);
                            sheet.setValue(footerIndex, col, keyword_null)
                        }
                        if (info && info.dataAreaFormula())
                        {
                            for (var rowIndex = 0, rowCount = tableDataRange.rowCount; rowIndex < rowCount; rowIndex++)
                            {
                                sheet.setFormula(tableDataRange.row + rowIndex, col, keyword_null);
                                sheet.setValue(tableDataRange.row + rowIndex, col, keyword_null)
                            }
                        }
                    }
                };
                SheetTable.prototype._syncSheetModelFormula = function()
                {
                    var self = this,
                        sheet = self._getSheet();
                    if (!sheet)
                    {
                        return
                    }
                    var columnInfos = self._columns,
                        footerIndex = self.footerIndex(),
                        tableRange = self.range(),
                        tableDataRange = self.dataRange();
                    for (var colIndex = 0, colCount = columnInfos.length; colIndex < colCount; colIndex++)
                    {
                        var info = columnInfos[colIndex],
                            col = tableRange.col + colIndex;
                        if (info.formula() && footerIndex >= 0)
                        {
                            sheet.setFormula(footerIndex, col, info.formula())
                        }
                        if (info.dataAreaFormula())
                        {
                            for (var rowIndex = 0, rowCount = tableDataRange.rowCount; rowIndex < rowCount; rowIndex++)
                            {
                                sheet.setFormula(tableDataRange.row + rowIndex, col, info.dataAreaFormula())
                            }
                        }
                    }
                };
                SheetTable.prototype._resize = function(rowCount, colCount, ignoreUpdateDataSource)
                {
                    var self = this;
                    if (rowCount === self._rowCount && colCount === self._colCount)
                    {
                        return
                    }
                    var minRowCount = 0,
                        minColCount = 1;
                    if (self._showHeader)
                    {
                        minRowCount = minRowCount + 1
                    }
                    if (self._showFooter)
                    {
                        minRowCount = minRowCount + 1
                    }
                    if (rowCount < minRowCount || colCount < minColCount)
                    {
                        throw new Error(Sheets.SR.Exp_TableResizeOutOfRange);
                    }
                    var sheet = self._getSheet();
                    if (sheet)
                    {
                        if (self._row + rowCount > sheet.getRowCount() || self._col + colCount > sheet.getColumnCount())
                        {
                            throw new Error(Sheets.SR.Exp_TableResizeOutOfRange);
                        }
                    }
                    var tcs = self._columns;
                    var oldColCount = self._colCount;
                    self._colCount = colCount;
                    if (colCount > oldColCount)
                    {
                        var addedCount = colCount - oldColCount;
                        for (var i = 0; i < addedCount; i++)
                        {
                            var tc = new TableColumnInfo(self._newAutoId());
                            tcs.push(tc)
                        }
                        if (self._showHeader)
                        {
                            self._syncHeader(oldColCount, addedCount)
                        }
                        if (self._showFooter)
                        {
                            self._syncFooter(oldColCount, addedCount)
                        }
                    }
                    else if (colCount < oldColCount)
                    {
                        var removedCount = oldColCount - colCount;
                        self._clearSheetModelFormula(colCount, oldColCount);
                        tcs.splice(colCount, removedCount)
                    }
                    if (rowCount !== self._rowCount)
                    {
                        var bm = self._bindingManager,
                            dataRange = self.dataRange();
                        if (bm)
                        {
                            if (rowCount > self._rowCount)
                            {
                                var addRowIndex = dataRange.row + dataRange.rowCount,
                                    addRowCount = rowCount - self._rowCount;
                                if (sheet)
                                {
                                    sheet.addRows(addRowIndex, addRowCount)
                                }
                                if (!self.showFooter())
                                {
                                    if (!ignoreUpdateDataSource)
                                    {
                                        self._updateDataSourceOnAddRows(addRowIndex, addRowCount)
                                    }
                                    self._rowCount = rowCount;
                                    self._updateFormulaOnAddRows(addRowIndex, addRowCount)
                                }
                            }
                            else
                            {
                                if (sheet)
                                {
                                    var deleteRowCount = self._rowCount - rowCount;
                                    sheet.deleteRows(dataRange.row + dataRange.rowCount - deleteRowCount, deleteRowCount)
                                }
                            }
                        }
                        else
                        {
                            var showFooter = self._showFooter,
                                oldFooterIndex;
                            if (showFooter)
                            {
                                self._syncFooter();
                                oldFooterIndex = self.footerIndex()
                            }
                            self._rowCount = rowCount;
                            if (showFooter)
                            {
                                self._syncSheetByFooter();
                                self._clearSheetRow(oldFooterIndex)
                            }
                        }
                    }
                    self._updateFilter()
                };
                SheetTable.prototype._updateFilter = function()
                {
                    var self = this,
                        rowFilter = self._rowFilter;
                    if (rowFilter)
                    {
                        rowFilter._updateRange(self.dataRange());
                        rowFilter.reFilter()
                    }
                };
                SheetTable.prototype._resetFilter = function()
                {
                    var rowFilter = this._rowFilter;
                    if (rowFilter)
                    {
                        rowFilter.unfilter();
                        rowFilter.reset()
                    }
                };
                SheetTable.prototype._hasColumnName = function(name)
                {
                    if (name !== keyword_null)
                    {
                        name = Sheets.util.toString(name)
                    }
                    for (var i = 0; i < this._colCount; i++)
                    {
                        var cn = this.getColumnName(i);
                        if (name === cn)
                        {
                            return true
                        }
                    }
                    return false
                };
                SheetTable.prototype._getHeaderName = function(col)
                {
                    var self = this;
                    if (!self._showHeader || !self._columns)
                    {
                        return keyword_null
                    }
                    var c = (col - self._col),
                        tcs = self._columns;
                    if (0 <= c && c < tcs.length)
                    {
                        var tc = tcs[c];
                        if (tc)
                        {
                            var name = tc.name();
                            if (name !== keyword_undefined && name !== keyword_null)
                            {
                                name = Sheets.util.toString(name)
                            }
                            return name
                        }
                    }
                    return keyword_null
                };
                SheetTable.prototype._setHeaderName = function(col, name)
                {
                    var self = this;
                    if (!self._showHeader || !self._columns)
                    {
                        return
                    }
                    var c = (col - self._col),
                        tcs = self._columns;
                    if (0 <= c && c < tcs.length)
                    {
                        var tc = tcs[c];
                        if (tc)
                        {
                            var sheet = self._getSheet();
                            if (sheet)
                            {
                                var m = sheet._sheetModelManager.getDataModel();
                                if (m)
                                {
                                    m._updateDirty(self._row, col, {oldValue: tc.name()})
                                }
                            }
                            var oldName = tc.name();
                            tc.name(name);
                            for (var i = 0, length = tcs.length; i < length; i++)
                            {
                                var column = tcs[i],
                                    dataAreaFormula = column && column.dataAreaFormula();
                                if (dataAreaFormula && dataAreaFormula.indexOf(oldName) >= 0)
                                {
                                    column.dataAreaFormula(dataAreaFormula.replace(new RegExp(oldName, "g"), tc.name()))
                                }
                            }
                        }
                    }
                };
                SheetTable.prototype._setFooterFormula = function(col, formula)
                {
                    var self = this;
                    if (!self._showFooter || !self._columns)
                    {
                        return
                    }
                    var c = (col - self._col),
                        tcs = self._columns;
                    if (0 <= c && c < tcs.length)
                    {
                        var tc = tcs[c];
                        if (tc)
                        {
                            tc.formula(formula)
                        }
                    }
                };
                SheetTable.prototype._setFooterValue = function(col, value)
                {
                    var self = this;
                    if (!self._showFooter || !self._columns)
                    {
                        return
                    }
                    var c = (col - self._col),
                        tcs = self._columns;
                    if (0 <= c && c < tcs.length)
                    {
                        var tc = tcs[c];
                        if (tc)
                        {
                            var oldValue = tc.value();
                            if (value !== oldValue)
                            {
                                var sheet = self._getSheet();
                                if (sheet)
                                {
                                    var m = sheet._sheetModelManager.getDataModel();
                                    if (m)
                                    {
                                        m._updateDirty(self._row + self._rowCount - 1, col, {oldValue: tc.value()})
                                    }
                                }
                            }
                            tc.value(value)
                        }
                    }
                };
                SheetTable.prototype._newAutoId = function()
                {
                    if (!this._columns || this._columns.length === 0)
                    {
                        return -1
                    }
                    var tcs = this._columns;
                    var ids = [],
                        tc,
                        count = tcs.length;
                    for (var i = 0; i < count; i++)
                    {
                        tc = tcs[i];
                        if (tc && tc.isAutoId())
                        {
                            ids.push(tc.id())
                        }
                    }
                    ids.sort(function(a, b)
                    {
                        return (a - b)
                    });
                    count = ids.length;
                    if (count > 0)
                    {
                        for (var i = 0; i < count; i++)
                        {
                            if (ids[i] !== i + 1)
                            {
                                return (i + 1)
                            }
                        }
                        return count + 1
                    }
                    return 1
                };
                SheetTable.prototype._syncHeader = function(start, count)
                {
                    var self = this;
                    var sheet;
                    if (!self._showHeader || !self._columns || !(sheet = self._getSheet()))
                    {
                        return
                    }
                    var row = self.headerIndex();
                    var baseCol = self._col,
                        tcs = self._columns,
                        tc;
                    if (start === keyword_undefined || start === keyword_null)
                    {
                        start = 0
                    }
                    if (count === keyword_undefined || count === keyword_null)
                    {
                        count = tcs.length
                    }
                    var end = Math_min(tcs.length, start + count);
                    var sheetArea = 3;
                    var m = sheet._getModel(sheetArea);
                    if (!m)
                    {
                        return
                    }
                    var txt;
                    for (var i = start; i < end; i++)
                    {
                        tc = tcs[i];
                        if (tc)
                        {
                            var tableList = self._owner._tableList;
                            var index = Sheets.util.inArray(self, tableList);
                            if (index > -1)
                            {
                                tableList.splice(index, 1)
                            }
                            txt = sheet.getText(row, baseCol + i);
                            if (index > -1)
                            {
                                tableList.splice(index, 0, self)
                            }
                            sheet.setFormula(row, baseCol + i, keyword_null);
                            if (txt)
                            {
                                sheet._recalcCell(m, row, baseCol + i);
                                tc.name(txt)
                            }
                            else
                            {
                                sheet.setText(row, baseCol + i, tc.name())
                            }
                        }
                    }
                };
                SheetTable.prototype._syncFooter = function(start, count)
                {
                    var self = this;
                    var sheet;
                    if (!self._showFooter || !self._columns || !(sheet = self._getSheet()))
                    {
                        return
                    }
                    var row = self.footerIndex();
                    var baseCol = self._col,
                        tcs = self._columns,
                        tc;
                    if (start === keyword_undefined || start === keyword_null)
                    {
                        start = 0
                    }
                    if (count === keyword_undefined || count === keyword_null)
                    {
                        count = tcs.length
                    }
                    var end = Math_min(tcs.length, start + count);
                    var formula,
                        value;
                    for (var i = start; i < end; i++)
                    {
                        tc = tcs[i];
                        if (tc)
                        {
                            formula = sheet.getFormula(row, baseCol + i);
                            if (formula)
                            {
                                tc.formula(formula)
                            }
                            else
                            {
                                sheet.setFormula(row, baseCol + i, tc.formula())
                            }
                            value = sheet.getValue(row, baseCol + i);
                            if (value !== keyword_undefined && value !== keyword_null)
                            {
                                tc.value(value)
                            }
                            else
                            {
                                sheet.setValue(row, baseCol + i, tc.value())
                            }
                        }
                    }
                };
                SheetTable.prototype._clearHeader = function(start, count)
                {
                    if (!this._showHeader || !this._columns)
                    {
                        return
                    }
                    var tcs = this._columns,
                        tc;
                    if (start === keyword_undefined || start === keyword_null)
                    {
                        start = 0
                    }
                    if (count === keyword_undefined || count === keyword_null)
                    {
                        count = tcs.length
                    }
                    var end = Math_min(tcs.length, start + count);
                    for (var i = start; i < end; i++)
                    {
                        tc = tcs[i];
                        if (tc)
                        {
                            tc.name(keyword_null)
                        }
                    }
                };
                SheetTable.prototype._clearDataRange = function(clearRange)
                {
                    var self = this;
                    var dataRange = self.dataRange();
                    if (dataRange.containsRange(clearRange))
                    {
                        var row = clearRange.row,
                            col = clearRange.col,
                            rowCount = clearRange.rowCount,
                            colCount = clearRange.colCount;
                        for (var r = 0; r < rowCount; r++)
                        {
                            for (var c = 0; c < colCount; c++)
                            {
                                self._setValue(row + r, col + c, keyword_null)
                            }
                        }
                    }
                };
                SheetTable.prototype._clearFooter = function(start, count)
                {
                    if (!this._showFooter || !this._columns)
                    {
                        return
                    }
                    var tcs = this._columns,
                        tc;
                    if (start === keyword_undefined || start === keyword_null)
                    {
                        start = 0
                    }
                    if (count === keyword_undefined || count === keyword_null)
                    {
                        count = tcs.length
                    }
                    var end = Math_min(tcs.length, start + count);
                    for (var i = start; i < end; i++)
                    {
                        tc = tcs[i];
                        if (tc)
                        {
                            tc.formula(keyword_null);
                            tc.value(keyword_null)
                        }
                    }
                };
                SheetTable.prototype._syncSheetByFooter = function()
                {
                    var self = this;
                    if (!self._showFooter || !self._columns)
                    {
                        return
                    }
                    var sheet = self._getSheet();
                    if (!sheet)
                    {
                        return
                    }
                    var tcs = self._columns,
                        count = tcs.length,
                        tc;
                    var baseCol = self._col,
                        col;
                    var footerIndex = self.footerIndex();
                    for (var i = 0; i < count; i++)
                    {
                        tc = tcs[i];
                        if (tc)
                        {
                            col = baseCol + i;
                            sheet.setValue(footerIndex, col, tc.value());
                            sheet.setFormula(footerIndex, col, tc.formula())
                        }
                    }
                };
                SheetTable.prototype._clearSheetRow = function(row)
                {
                    var sheet = this._getSheet();
                    if (!sheet)
                    {
                        return
                    }
                    if (row < 0 || sheet.getRowCount() <= row)
                    {
                        return
                    }
                    var baseCol = this._col,
                        count = this._colCount,
                        col;
                    for (var i = 0; i < count; i++)
                    {
                        col = baseCol + i;
                        sheet.setFormula(row, col, keyword_null);
                        sheet.setValue(row, col, keyword_null)
                    }
                };
                SheetTable.prototype._addRows = function(row, count, ignoreUpdateDataSource)
                {
                    var self = this,
                        dataSourceChanged = false;
                    if (row >= self._row + self._rowCount)
                    {
                        return dataSourceChanged
                    }
                    var columns = self._columns;
                    var firstRow = self._row,
                        lastRow = self._row + self._rowCount - 1;
                    if (row <= firstRow)
                    {
                        self._row += count
                    }
                    else if (row <= lastRow)
                    {
                        if (!ignoreUpdateDataSource)
                        {
                            dataSourceChanged = self._updateDataSourceOnAddRows(row, count)
                        }
                        self._rowCount += count;
                        self._updateFormulaOnAddRows(row, count)
                    }
                    if (self._rowFilter)
                    {
                        self._rowFilter._addRows(row, count)
                    }
                    return dataSourceChanged
                };
                SheetTable.prototype._updateDataSourceOnAddRows = function(row, count)
                {
                    var self = this,
                        firstRow = self._row,
                        bm = self._bindingManager;
                    if (bm)
                    {
                        bm.addItems(row - (self.showHeader() ? firstRow + 1 : firstRow), count);
                        return true
                    }
                    return false
                };
                SheetTable.prototype._updateFormulaOnAddRows = function(row, count)
                {
                    var self = this,
                        columns = self._columns,
                        sheet = self._owner.getSheet();
                    sheet.suspendCalcService();
                    for (var i = 0; i < columns.length; i++)
                    {
                        var column = columns[i];
                        var dataAreaFormula = column.dataAreaFormula();
                        if (dataAreaFormula)
                        {
                            var columnIndexInSheet = i + self._col;
                            for (var rowIndex = row; rowIndex < row + count; rowIndex++)
                            {
                                sheet.setFormula(rowIndex, columnIndexInSheet, dataAreaFormula)
                            }
                        }
                    }
                    sheet.resumeCalcService()
                };
                SheetTable.prototype._addColumns = function(col, count)
                {
                    var self = this;
                    if (col >= self._col + self._colCount)
                    {
                        return
                    }
                    if (col <= self._col)
                    {
                        self._col += count
                    }
                    else if (col < self._col + self._colCount)
                    {
                        self._colCount += count;
                        var tcs = self._columns;
                        if (tcs)
                        {
                            for (var i = 0; i < count; i++)
                            {
                                var tc = new TableColumnInfo(self._newAutoId());
                                tcs.splice(col + i - self._col, 0, tc)
                            }
                        }
                    }
                    if (self._rowFilter)
                    {
                        self._rowFilter._addColumns(col, count)
                    }
                };
                SheetTable.prototype._removeRows = function(row, count, ignoreUpdateDataSource)
                {
                    var self = this,
                        dataSourceChanged = false;
                    if (row >= self._row + self._rowCount)
                    {
                        return dataSourceChanged
                    }
                    var firstRow = self._row,
                        lastRow = self._row + self._rowCount - 1;
                    if (row < firstRow)
                    {
                        if (row + count > firstRow)
                        {}
                        else
                        {
                            self._row -= count
                        }
                    }
                    else if (row === firstRow)
                    {
                        if (self._showHeader)
                        {}
                        else
                        {
                            self._rowCount -= Math_min(lastRow - row + 1, count);
                            if (!ignoreUpdateDataSource)
                            {
                                var bm = self._bindingManager;
                                if (bm)
                                {
                                    bm.removeItems(row - (self.showHeader() ? firstRow + 1 : firstRow), Math_min(lastRow - row + 1, count));
                                    dataSourceChanged = true
                                }
                            }
                        }
                    }
                    else if (row <= lastRow)
                    {
                        self._rowCount -= Math_min(lastRow - row + 1, count);
                        if (!ignoreUpdateDataSource)
                        {
                            var bm = self._bindingManager;
                            if (bm)
                            {
                                bm.removeItems(row - (self.showHeader() ? firstRow + 1 : firstRow), Math_min(lastRow - row + 1, count));
                                dataSourceChanged = true
                            }
                        }
                        if (row === lastRow && self._showFooter)
                        {
                            self._showFooter = false
                        }
                    }
                    if (self._rowFilter)
                    {
                        self._rowFilter._removeRows(row, count)
                    }
                    return dataSourceChanged
                };
                SheetTable.prototype._removeColumns = function(col, count)
                {
                    var self = this;
                    if (col >= self._col + self._colCount)
                    {
                        return
                    }
                    var firstCol = self._col,
                        lastCol = self._col + self._colCount - 1;
                    if (col < firstCol)
                    {
                        if (col + count <= firstCol)
                        {
                            self._col -= count
                        }
                        else
                        {
                            self._col = col;
                            self._colCount -= (col + count - firstCol);
                            var tcs = self._columns;
                            if (tcs)
                            {
                                tcs.splice(0, col + count - firstCol)
                            }
                        }
                    }
                    else
                    {
                        self._colCount -= Math_min(lastCol - col + 1, count);
                        var tcs = self._columns;
                        if (tcs)
                        {
                            tcs.splice(col - firstCol, Math_min(lastCol - col + 1, count))
                        }
                    }
                    if (self._rowFilter)
                    {
                        self._rowFilter._removeColumns(col, count)
                    }
                };
                SheetTable.prototype._clear = function(row, col, rowCount, colCount)
                {
                    var self = this;
                    var maxRowCount = rowCount,
                        maxColCount = colCount;
                    var sheet = self._getSheet();
                    if (sheet)
                    {
                        maxRowCount = sheet.getRowCount();
                        maxColCount = sheet.getColumnCount()
                    }
                    var r = row < 0 ? 0 : row;
                    var c = col < 0 ? 0 : col;
                    var rc = row < 0 ? maxRowCount : rowCount;
                    var cc = col < 0 ? maxColCount : colCount;
                    var clearRange = new Sheets.Range(r, c, rc, cc);
                    var headerIndex = self.headerIndex();
                    if (self._showHeader && r <= headerIndex && headerIndex < r + rc)
                    {
                        var headerRange = new Sheets.Range(headerIndex, self._col, 1, self._colCount);
                        var cr = clearRange.getIntersect(headerRange, maxRowCount, maxColCount);
                        if (cr)
                        {
                            self._clearHeader(cr.col - self._col, cr.colCount)
                        }
                    }
                    var dataRange = self.dataRange();
                    var intersectRange = clearRange.getIntersect(dataRange, maxRowCount, maxColCount);
                    if (intersectRange)
                    {
                        self._clearDataRange(intersectRange)
                    }
                    var footerIndex = self.footerIndex();
                    if (self._showFooter && r <= footerIndex && footerIndex < r + rc)
                    {
                        var footerRange = new Sheets.Range(footerIndex, self._col, 1, self._colCount);
                        var cr = clearRange.getIntersect(footerRange, maxRowCount, maxColCount);
                        if (cr)
                        {
                            self._clearFooter(cr.col - self._col, cr.colCount)
                        }
                    }
                    if (self._rowFilter)
                    {
                        self._rowFilter._clear(row, col, rowCount, colCount)
                    }
                };
                SheetTable.prototype._copy = function(fromRow, fromCol, toRow, toCol, rowCount, colCount){};
                SheetTable.prototype._move = function(fromRow, fromCol, toRow, toCol, rowCount, colCount){};
                SheetTable.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"name":
                            return value === keyword_null;
                        case"row":
                            return value === -1;
                        case"col":
                            return value === -1;
                        case"rowCount":
                            return value === -1;
                        case"colCount":
                            return value === -1;
                        case"showHeader":
                            return value === true;
                        case"showFooter":
                            return value === false;
                        case"highlightFirstColumn":
                            return value === false;
                        case"highlightLastColumn":
                            return value === false;
                        case"bandRows":
                            return value === true;
                        case"bandColumns":
                            return value === false;
                        case"style":
                            return value === keyword_null;
                        case"columns":
                            return value === keyword_null;
                        case"rowFilter":
                            return value === keyword_null;
                        case"autoGenerateColumns":
                            return value === true;
                        default:
                            return false
                    }
                };
                SheetTable.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            name: self._name, row: self._row, col: self._col, rowCount: self._rowCount, colCount: self._colCount, showHeader: self._showHeader, showFooter: self._showFooter, highlightFirstColumn: self._highlightFirstColumn, highlightLastColumn: self._highlightLastColumn, bandRows: self._bandRows, bandColumns: self._bandColumns, style: (self._style ? self._style.toJSON() : keyword_null), columns: self._columns, autoGenerateColumns: self._autoGenerateColumns, bindingPath: self._bindingPath, rowFilter: (self._rowFilter ? self._rowFilter.toJSON() : keyword_null)
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
                    if ($.isEmptyObject(jsData))
                    {
                        return keyword_undefined
                    }
                    return jsData
                };
                SheetTable.prototype.fromJSON = function(jsData, isNoneSchema)
                {
                    if (!jsData)
                    {
                        return
                    }
                    var self = this;
                    if (typeof jsData.name !== const_undefined)
                    {
                        self._name = jsData.name
                    }
                    if (typeof jsData.row !== const_undefined)
                    {
                        self._row = jsData.row
                    }
                    if (typeof jsData.col !== const_undefined)
                    {
                        self._col = jsData.col
                    }
                    if (typeof jsData.rowCount !== const_undefined)
                    {
                        self._rowCount = jsData.rowCount
                    }
                    if (typeof jsData.colCount !== const_undefined)
                    {
                        self._colCount = jsData.colCount
                    }
                    if (typeof jsData.showHeader !== const_undefined)
                    {
                        self._showHeader = jsData.showHeader
                    }
                    if (typeof jsData.showFooter !== const_undefined)
                    {
                        self._showFooter = jsData.showFooter
                    }
                    if (typeof jsData.highlightFirstColumn !== const_undefined)
                    {
                        self._highlightFirstColumn = jsData.highlightFirstColumn
                    }
                    if (typeof jsData.highlightLastColumn !== const_undefined)
                    {
                        self._highlightLastColumn = jsData.highlightLastColumn
                    }
                    if (typeof jsData.bandRows !== const_undefined)
                    {
                        self._bandRows = jsData.bandRows
                    }
                    if (typeof jsData.bandColumns !== const_undefined)
                    {
                        self._bandColumns = jsData.bandColumns
                    }
                    if (jsData.style)
                    {
                        var tableStyle = new TableStyle;
                        tableStyle.fromJSON(jsData.style, isNoneSchema);
                        self._style = tableStyle
                    }
                    if (typeof jsData.autoGenerateColumns !== const_undefined)
                    {
                        self._autoGenerateColumns = jsData.autoGenerateColumns
                    }
                    if (isNoneSchema)
                    {
                        if (jsData.dataSource && Sheets.features.binding)
                        {
                            self._bindingManager = new Sheets._BindingManager;
                            self._bindingManager.bind(jsData.dataSource)
                        }
                        if (jsData.dataBinding && Sheets.features.binding)
                        {
                            self._bindingManager = new Sheets._BindingManager;
                            self._bindingManager.fromJSON(jsData.dataBinding, isNoneSchema)
                        }
                    }
                    else
                    {
                        if (jsData.bindingPath)
                        {
                            self._bindingPath = jsData.bindingPath;
                            var sheet = self._getSheet(),
                                dataSource = sheet && sheet.getDataSource();
                            if (Sheets.CellBindingSource && dataSource instanceof Sheets.CellBindingSource)
                            {
                                var actualDataSource = Sheets._BindingHelper.getValueByPath(dataSource.getSource(), jsData.bindingPath);
                                if (actualDataSource)
                                {
                                    self._bindingManager = new Sheets._BindingManager;
                                    self._bindingManager.bind(actualDataSource)
                                }
                            }
                        }
                    }
                    if (jsData.columns)
                    {
                        var columnsData = jsData.columns,
                            count = columnsData.length;
                        var tcs = [],
                            tc,
                            data;
                        for (var i = 0; i < count; i++)
                        {
                            data = columnsData[i];
                            tc = new TableColumnInfo(self._newAutoId());
                            tc.fromJSON(data, isNoneSchema);
                            tcs.push(tc)
                        }
                        self._columns = tcs;
                        for (var i = 0; i < count; i++)
                        {
                            tc = tcs[i];
                            if (!tc.isAutoId())
                            {
                                tc.id(self._newAutoId())
                            }
                        }
                    }
                    if (jsData.rowFilter && Sheets.features.filter)
                    {
                        var rowFilterData = jsData.rowFilter;
                        var filter = new Sheets._TableFilter;
                        filter.table(self);
                        filter.fromJSON(rowFilterData, isNoneSchema);
                        self._rowFilter = filter;
                        self._rowFilter.reFilter()
                    }
                };
                SheetTable.prototype.startRow = function()
                {
                    return this._row
                };
                SheetTable.prototype.startColumn = function()
                {
                    return this._col
                };
                SheetTable.prototype.endRow = function()
                {
                    return this._row + this._rowCount - 1
                };
                SheetTable.prototype.endColumn = function()
                {
                    return this._col + this._colCount - 1
                };
                SheetTable.prototype.hasHeadersRow = function()
                {
                    return this._showHeader
                };
                SheetTable.prototype.hasTotalsRow = function()
                {
                    return this._showFooter
                };
                SheetTable.prototype.tableName = function()
                {
                    return this._name
                };
                SheetTable.prototype.getColumnIndexInTable = function(columnName)
                {
                    for (var i = 0; i < this._columns.length; i++)
                    {
                        var column = this._columns[i];
                        if (column.name() === columnName || column.name().toString().toLowerCase() === columnName.toLowerCase())
                        {
                            return i
                        }
                    }
                    return -1
                };
                SheetTable.prototype.source = function()
                {
                    return this._owner.getSheet()._getSheetSource()
                };
                SheetTable.prototype._applyBindingPath = function()
                {
                    var self = this,
                        sheet = self._getSheet();
                    if (!sheet)
                    {
                        return
                    }
                    var path = self._bindingPath,
                        dataSource = sheet.getDataSource();
                    if (path && Sheets.CellBindingSource && dataSource instanceof Sheets.CellBindingSource)
                    {
                        var actualDataSource = Sheets._BindingHelper.getValueByPath(dataSource.getSource(), path);
                        if (actualDataSource)
                        {
                            var dataRange = self.dataRange(),
                                dataRangeRow = dataRange.row,
                                dataRangeCol = dataRange.col,
                                dataRangeRowCount = dataRange.rowCount,
                                dataRangeColCount = dataRange.colCount;
                            var bindingManager = new Sheets._BindingManager;
                            bindingManager.bind(actualDataSource);
                            var rowCount = bindingManager.getRowCount(),
                                colCount = bindingManager.getColumnCount();
                            try
                            {
                                var oldState = sheet.isPaintSuspended();
                                sheet.isPaintSuspended(true);
                                self._bindingManager = keyword_null;
                                if (rowCount > dataRangeRowCount)
                                {
                                    sheet.addRows(dataRangeRow + dataRangeRowCount, rowCount - dataRangeRowCount)
                                }
                                else if (rowCount < dataRangeRowCount)
                                {
                                    sheet.deleteRows(dataRangeRow + rowCount, dataRangeRowCount - rowCount)
                                }
                                self._bind(bindingManager);
                                var calcService = sheet.getCalcService();
                                if (calcService && !calcService.IsSuspended())
                                {
                                    sheet.recalcAll()
                                }
                            }
                            finally
                            {
                                sheet.isPaintSuspended(oldState)
                            }
                        }
                    }
                };
                SheetTable.prototype.clone = function()
                {
                    var table = new SheetTable;
                    var jsonStr = JSON.stringify(this.toJSON());
                    table._setOwner(this._owner);
                    table.fromJSON(JSON.parse(jsonStr));
                    return table
                };
                SheetTable.prototype.copyDataSourceImp = function(dataSource)
                {
                    var newBindingManager = new Sheets._BindingManager;
                    newBindingManager.bind(dataSource);
                    this._bindingManager = newBindingManager
                };
                SheetTable.prototype.copyDataSource = function(srcTable)
                {
                    if (!srcTable.bindingPath())
                    {
                        var bindingManager = srcTable._bindingManager;
                        if (bindingManager)
                        {
                            this.copyDataSourceImp(bindingManager.getSource())
                        }
                    }
                };
                SheetTable.prototype.resetBindingManager = function()
                {
                    this._bindingManager = keyword_null
                };
                SheetTable.prototype.getSource = function()
                {
                    var bindingManager = this._bindingManager;
                    if (bindingManager)
                    {
                        return bindingManager.getSource()
                    }
                    return keyword_null
                };
                SheetTable.prototype.getSourceRowCount = function()
                {
                    var bindingManager = this._bindingManager;
                    if (bindingManager)
                    {
                        return bindingManager.getRowCount()
                    }
                    return 0
                };
                return SheetTable
            })();
        Sheets.SheetTable = SheetTable;
        var TableColumnInfo = (function()
            {
                function TableColumnInfo(id)
                {
                    var self = this;
                    self._id = id;
                    self._name = const_column + self._id;
                    self._dataField = keyword_null;
                    self._fformula = keyword_null;
                    self._fvalue = keyword_null
                }
                TableColumnInfo.prototype.id = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._id
                    }
                    self._id = value;
                    if (!self._name)
                    {
                        self._name = const_column + self._id
                    }
                    return self
                };
                TableColumnInfo.prototype.isAutoId = function()
                {
                    if (this._id > 0)
                    {
                        return true
                    }
                    return false
                };
                TableColumnInfo.prototype.name = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._name
                    }
                    self._name = value || (const_column + self._id);
                    return self
                };
                TableColumnInfo.prototype.dataField = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._dataField
                    }
                    this._dataField = value;
                    return this
                };
                TableColumnInfo.prototype.value = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._fvalue
                    }
                    this._fvalue = value;
                    return this
                };
                TableColumnInfo.prototype.dataAreaFormula = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._dataAreaFormula
                    }
                    this._dataAreaFormula = value;
                    return this
                };
                TableColumnInfo.prototype.formula = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._fformula
                    }
                    this._fformula = value;
                    return this
                };
                TableColumnInfo.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"name":
                            return value === keyword_null;
                        case"footerFormula":
                            return value === keyword_null;
                        case"footerValue":
                            return value === keyword_null;
                        default:
                            return false
                    }
                };
                TableColumnInfo.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            id: self._id, name: self._name, dataField: self._dataField, footerFormula: self._fformula, dataAreaFormula: self._dataAreaFormula, footerValue: self._fvalue
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
                TableColumnInfo.prototype.fromJSON = function(jsonData, isNoneSchema)
                {
                    if (!jsonData)
                    {
                        return
                    }
                    var self = this;
                    var id = jsonData.id ? jsonData.id : jsonData._id;
                    if (id !== keyword_undefined)
                    {
                        self._id = id
                    }
                    var name = jsonData.name ? jsonData.name : jsonData._name;
                    if (name !== keyword_undefined)
                    {
                        self._name = name
                    }
                    if (jsonData.dataField !== keyword_undefined)
                    {
                        self._dataField = jsonData.dataField
                    }
                    var fformula = isNoneSchema ? (jsonData.fformula ? jsonData.fformula : jsonData._fformula) : jsonData.footerFormula;
                    if (fformula !== keyword_undefined)
                    {
                        self._fformula = fformula
                    }
                    var dataAreaFormula = jsonData.dataAreaFormula ? jsonData.dataAreaFormula : jsonData._dataAreaFormula;
                    if (dataAreaFormula !== keyword_undefined)
                    {
                        self._dataAreaFormula = dataAreaFormula
                    }
                    var fvalue = isNoneSchema ? (jsonData.fvalue ? jsonData.fvalue : jsonData._fvalue) : jsonData.footerValue;
                    if (fvalue !== keyword_undefined)
                    {
                        self._fvalue = fvalue
                    }
                };
                return TableColumnInfo
            })();
        Sheets.TableColumnInfo = TableColumnInfo;
        var TableStyleInfo = (function()
            {
                function TableStyleInfo(backColor, foreColor, font, borderLeft, borderTop, borderRight, borderBottom, borderHorizontal, borderVertical)
                {
                    var self = this;
                    self.backColor = backColor;
                    self.foreColor = foreColor;
                    self.font = font;
                    self.borderLeft = borderLeft;
                    self.borderTop = borderTop;
                    self.borderRight = borderRight;
                    self.borderBottom = borderBottom;
                    self.borderHorizontal = borderHorizontal;
                    self.borderVertical = borderVertical
                }
                TableStyleInfo.prototype._compose = function(dest, firstRow, firstCol, lastRow, lastCol)
                {
                    var self = this;
                    if (typeof(self.backColor) !== const_undefined && typeof(dest.backColor) === const_undefined)
                    {
                        dest.backColor = self.backColor
                    }
                    if (typeof(self.foreColor) !== const_undefined && typeof(dest.foreColor) === const_undefined)
                    {
                        dest.foreColor = self.foreColor
                    }
                    if (typeof(self.font) !== const_undefined && typeof(dest.font) === const_undefined)
                    {
                        dest.font = self.font
                    }
                    if (firstCol && typeof(self.borderLeft) !== const_undefined && typeof(dest.borderLeft) === const_undefined)
                    {
                        dest.borderLeft = self.borderLeft
                    }
                    if (firstRow && typeof(self.borderTop) !== const_undefined && typeof(dest.borderTop) === const_undefined)
                    {
                        dest.borderTop = self.borderTop
                    }
                    if (lastCol && typeof(self.borderRight) !== const_undefined && typeof(dest.borderRight) === const_undefined)
                    {
                        dest.borderRight = self.borderRight
                    }
                    if (lastRow && typeof(self.borderBottom) !== const_undefined && typeof(dest.borderBottom) === const_undefined)
                    {
                        dest.borderBottom = self.borderBottom
                    }
                    if (!lastRow && typeof(self.borderHorizontal) !== const_undefined && typeof(dest.borderBottom) === const_undefined)
                    {
                        dest.borderBottom = self.borderHorizontal
                    }
                    if (!lastCol && typeof(self.borderVertical) !== const_undefined && typeof(dest.borderRight) === const_undefined)
                    {
                        dest.borderRight = self.borderVertical
                    }
                };
                TableStyleInfo.prototype.toJSON = function()
                {
                    var self = this;
                    return {
                            backColor: self.backColor, foreColor: self.foreColor, font: self.font, borderLeft: (self.borderLeft ? self.borderLeft.toJSON() : self.borderLeft), borderTop: (self.borderTop ? self.borderTop.toJSON() : self.borderTop), borderRight: (self.borderRight ? self.borderRight.toJSON() : self.borderRight), borderBottom: (self.borderBottom ? self.borderBottom.toJSON() : self.borderBottom), borderHorizontal: (self.borderHorizontal ? self.borderHorizontal.toJSON() : self.borderHorizontal), borderVertical: (self.borderVertical ? self.borderVertical.toJSON() : self.borderVertical)
                        }
                };
                TableStyleInfo.prototype.fromJSON = function(jsData, isNoneSchema)
                {
                    if (!jsData)
                    {
                        return
                    }
                    var self = this;
                    if (typeof(jsData.backColor) !== const_undefined)
                    {
                        self.backColor = jsData.backColor
                    }
                    if (typeof(jsData.foreColor) !== const_undefined)
                    {
                        self.foreColor = jsData.foreColor
                    }
                    if (typeof(jsData.font) !== const_undefined)
                    {
                        self.font = jsData.font
                    }
                    if (typeof(jsData.borderLeft) !== const_undefined)
                    {
                        var left = new Sheets.LineBorder;
                        left.fromJSON(jsData.borderLeft, isNoneSchema);
                        self.borderLeft = left
                    }
                    if (typeof(jsData.borderTop) !== const_undefined)
                    {
                        var top = new Sheets.LineBorder;
                        top.fromJSON(jsData.borderTop, isNoneSchema);
                        self.borderTop = top
                    }
                    if (typeof(jsData.borderRight) !== const_undefined)
                    {
                        var right = new Sheets.LineBorder;
                        right.fromJSON(jsData.borderRight, isNoneSchema);
                        self.borderRight = right
                    }
                    if (typeof(jsData.borderBottom) !== const_undefined)
                    {
                        var bottom = new Sheets.LineBorder;
                        bottom.fromJSON(jsData.borderBottom, isNoneSchema);
                        self.borderBottom = bottom
                    }
                    if (typeof(jsData.borderHorizontal) !== const_undefined)
                    {
                        var horizontal = new Sheets.LineBorder;
                        horizontal.fromJSON(jsData.borderHorizontal, isNoneSchema);
                        self.borderHorizontal = horizontal
                    }
                    if (typeof(jsData.borderVertical) !== const_undefined)
                    {
                        var vertical = new Sheets.LineBorder;
                        vertical.fromJSON(jsData.borderVertical, isNoneSchema);
                        self.borderVertical = vertical
                    }
                };
                return TableStyleInfo
            })();
        Sheets.TableStyleInfo = TableStyleInfo;
        var TableStyle = (function()
            {
                function TableStyle()
                {
                    this._lastFooterCellStyle = keyword_null;
                    this._init()
                }
                TableStyle.prototype.name = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._name
                    }
                    this._name = value;
                    return this
                };
                TableStyle.prototype.wholeTableStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._wholeTableStyle
                    }
                    this._wholeTableStyle = value;
                    return this
                };
                TableStyle.prototype.headerRowStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._headerRowStyle
                    }
                    this._headerRowStyle = value;
                    return this
                };
                TableStyle.prototype.footerRowStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._footerRowStyle
                    }
                    this._footerRowStyle = value;
                    return this
                };
                TableStyle.prototype.firstRowStripStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._firstRowStripStyle
                    }
                    this._firstRowStripStyle = value;
                    return this
                };
                TableStyle.prototype.secondRowStripStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._secondRowStripStyle
                    }
                    this._secondRowStripStyle = value;
                    return this
                };
                TableStyle.prototype.firstRowStripSize = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._firstRowStripSize
                    }
                    this._firstRowStripSize = value;
                    return this
                };
                TableStyle.prototype.secondRowStripSize = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._secondRowStripSize
                    }
                    this._secondRowStripSize = value;
                    return this
                };
                TableStyle.prototype.firstColumnStripStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._firstColumnStripStyle
                    }
                    this._firstColumnStripStyle = value;
                    return this
                };
                TableStyle.prototype.secondColumnStripStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._secondColumnStripStyle
                    }
                    this._secondColumnStripStyle = value;
                    return this
                };
                TableStyle.prototype.firstColumnStripSize = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._firstColumnStripSize
                    }
                    this._firstColumnStripSize = value;
                    return this
                };
                TableStyle.prototype.secondColumnStripSize = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._secondColumnStripSize
                    }
                    this._secondColumnStripSize = value;
                    return this
                };
                TableStyle.prototype.highlightFirstColumnStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._highlightFirstColumnStyle
                    }
                    this._highlightFirstColumnStyle = value;
                    return this
                };
                TableStyle.prototype.highlightLastColumnStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._highlightLastColumnStyle
                    }
                    this._highlightLastColumnStyle = value;
                    return this
                };
                TableStyle.prototype.firstHeaderCellStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._firstHeaderCellStyle
                    }
                    this._firstHeaderCellStyle = value;
                    return this
                };
                TableStyle.prototype.lastHeaderCellStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._lastHeaderCellStyle
                    }
                    this._lastHeaderCellStyle = value;
                    return this
                };
                TableStyle.prototype.firstFooterCellStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._firstFooterCellStyle
                    }
                    this._firstFooterCellStyle = value;
                    return this
                };
                TableStyle.prototype.lastFooterCellStyle = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._lastFooterCellStyle
                    }
                    this._lastFooterCellStyle = value;
                    return this
                };
                TableStyle.prototype._init = function()
                {
                    var self = this;
                    self._name = keyword_null;
                    self._headerRowStyle = keyword_null;
                    self._footerRowStyle = keyword_null;
                    self._wholeTableStyle = keyword_null;
                    self._highlightLastColumnStyle = keyword_null;
                    self._highlightFirstColumnStyle = keyword_null;
                    self._firstRowStripStyle = keyword_null;
                    self._secondRowStripStyle = keyword_null;
                    self._firstColumnStripStyle = keyword_null;
                    self._secondColumnStripStyle = keyword_null;
                    self._firstHeaderCellStyle = keyword_null;
                    self._lastHeaderCellStyle = keyword_null;
                    self._firstFooterCellStyle = keyword_null;
                    self._lastFooterCellStyle = keyword_null;
                    self._firstRowStripSize = 1;
                    self._secondRowStripSize = 1;
                    self._firstColumnStripSize = 1;
                    self._secondColumnStripSize = 1
                };
                TableStyle.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"name":
                            return value === keyword_null;
                        case"headerRowStyle":
                            return value === keyword_null;
                        case"footerRowStyle":
                            return value === keyword_null;
                        case"wholeTableStyle":
                            return value === keyword_null;
                        case"highlightLastColumnStyle":
                            return value === keyword_null;
                        case"highlightFirstColumnStyle":
                            return value === keyword_null;
                        case"firstRowStripStyle":
                            return value === keyword_null;
                        case"secondRowStripStyle":
                            return value === keyword_null;
                        case"firstColumnStripStyle":
                            return value === keyword_null;
                        case"secondColumnStripStyle":
                            return value === keyword_null;
                        case"firstHeaderCellStyle":
                            return value === keyword_null;
                        case"lastHeaderCellStyle":
                            return value === keyword_null;
                        case"firstFooterCellStyle":
                            return value === keyword_null;
                        case"lastFooterCellStyle":
                            return value === keyword_null;
                        case"firstRowStripSize":
                            return value === 1;
                        case"secondRowStripSize":
                            return value === 1;
                        case"firstColumnStripSize":
                            return value === 1;
                        case"secondColumnStripSize":
                            return value === 1;
                        default:
                            return false
                    }
                };
                TableStyle.prototype.toJSON = function()
                {
                    var self = this;
                    var json = {
                            name: self._name, firstRowStripSize: self._firstRowStripSize, secondRowStripSize: self._secondRowStripSize, firstColumnStripSize: self._firstColumnStripSize, secondColumnStripSize: self._secondColumnStripSize
                        };
                    var style = self._headerRowStyle;
                    json.headerRowStyle = style ? style.toJSON() : style;
                    style = self._footerRowStyle;
                    json.footerRowStyle = style ? style.toJSON() : style;
                    style = self._wholeTableStyle;
                    json.wholeTableStyle = style ? style.toJSON() : style;
                    style = self._highlightLastColumnStyle;
                    json.highlightLastColumnStyle = style ? style.toJSON() : style;
                    style = self._highlightFirstColumnStyle;
                    json.highlightFirstColumnStyle = style ? style.toJSON() : style;
                    style = self._firstRowStripStyle;
                    json.firstRowStripStyle = style ? style.toJSON() : style;
                    style = self._secondRowStripStyle;
                    json.secondRowStripStyle = style ? style.toJSON() : style;
                    style = self._firstColumnStripStyle;
                    json.firstColumnStripStyle = style ? style.toJSON() : style;
                    style = self._secondColumnStripStyle;
                    json.secondColumnStripStyle = style ? style.toJSON() : style;
                    style = self._firstHeaderCellStyle;
                    json.firstHeaderCellStyle = style ? style.toJSON() : style;
                    style = self._lastHeaderCellStyle;
                    json.lastHeaderCellStyle = style ? style.toJSON() : style;
                    style = self._firstFooterCellStyle;
                    json.firstFooterCellStyle = style ? style.toJSON() : style;
                    style = self._lastFooterCellStyle;
                    json.lastFooterCellStyle = style ? style.toJSON() : style;
                    var jsData = {};
                    for (var item in json)
                    {
                        var value = json[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            jsData[item] = value
                        }
                    }
                    if ($.isEmptyObject(jsData))
                    {
                        return keyword_undefined
                    }
                    return jsData
                };
                TableStyle.prototype.fromJSON = function(jsData, isNoneSchema)
                {
                    if (!jsData)
                    {
                        return
                    }
                    var self = this;
                    var name = typeof jsData.name !== const_undefined ? jsData.name : jsData._name;
                    if (typeof name !== const_undefined)
                    {
                        self._name = name
                    }
                    var firstRowStripSize = typeof jsData.firstRowStripSize !== const_undefined ? jsData.firstRowStripSize : jsData._firstRowStripSize;
                    if (typeof firstRowStripSize !== const_undefined)
                    {
                        self._firstRowStripSize = firstRowStripSize
                    }
                    var secondRowStripSize = typeof jsData.secondRowStripSize !== const_undefined ? jsData.secondRowStripSize : jsData._secondRowStripSize;
                    if (typeof secondRowStripSize !== const_undefined)
                    {
                        self._secondRowStripSize = secondRowStripSize
                    }
                    var firstColumnStripSize = typeof jsData.firstColumnStripSize !== const_undefined ? jsData.firstColumnStripSize : jsData._firstColumnStripSize;
                    if (typeof firstColumnStripSize !== const_undefined)
                    {
                        self._firstColumnStripSize = firstColumnStripSize
                    }
                    var secondColumnStripSize = typeof jsData.secondColumnStripSize !== const_undefined ? jsData.secondColumnStripSize : jsData._secondColumnStripSize;
                    if (typeof secondColumnStripSize !== const_undefined)
                    {
                        self._secondColumnStripSize = secondColumnStripSize
                    }
                    var headerRowStyle = typeof jsData.headerRowStyle !== const_undefined ? jsData.headerRowStyle : jsData._headerRowStyle;
                    if (typeof headerRowStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(headerRowStyle, isNoneSchema);
                        self._headerRowStyle = style
                    }
                    var footerRowStyle = typeof jsData.footerRowStyle !== const_undefined ? jsData.footerRowStyle : jsData._footerRowStyle;
                    if (typeof footerRowStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(footerRowStyle, isNoneSchema);
                        self._footerRowStyle = style
                    }
                    var wholeTableStyle = typeof jsData.wholeTableStyle !== const_undefined ? jsData.wholeTableStyle : jsData._wholeTableStyle;
                    if (typeof wholeTableStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(wholeTableStyle, isNoneSchema);
                        self._wholeTableStyle = style
                    }
                    var highlightLastColumnStyle = typeof jsData.highlightLastColumnStyle !== const_undefined ? jsData.highlightLastColumnStyle : jsData._highlightLastColumnStyle;
                    if (typeof highlightLastColumnStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(highlightLastColumnStyle, isNoneSchema);
                        self._highlightLastColumnStyle = style
                    }
                    var highlightFirstColumnStyle = typeof jsData.highlightFirstColumnStyle !== const_undefined ? jsData.highlightFirstColumnStyle : jsData._highlightFirstColumnStyle;
                    if (typeof highlightFirstColumnStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(highlightFirstColumnStyle, isNoneSchema);
                        self._highlightFirstColumnStyle = style
                    }
                    var firstRowStripStyle = typeof jsData.firstRowStripStyle !== const_undefined ? jsData.firstRowStripStyle : jsData._firstRowStripStyle;
                    if (typeof firstRowStripStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(firstRowStripStyle, isNoneSchema);
                        self._firstRowStripStyle = style
                    }
                    var secondRowStripStyle = typeof jsData.secondRowStripStyle !== const_undefined ? jsData.secondRowStripStyle : jsData._secondRowStripStyle;
                    if (typeof secondRowStripStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(secondRowStripStyle, isNoneSchema);
                        self._secondRowStripStyle = style
                    }
                    var firstColumnStripStyle = typeof jsData.firstColumnStripStyle !== const_undefined ? jsData.firstColumnStripStyle : jsData._firstColumnStripStyle;
                    if (typeof firstColumnStripStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(firstColumnStripStyle, isNoneSchema);
                        self._firstColumnStripStyle = style
                    }
                    var secondColumnStripStyle = typeof jsData.secondColumnStripStyle !== const_undefined ? jsData.secondColumnStripStyle : jsData._secondColumnStripStyle;
                    if (typeof secondColumnStripStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(secondColumnStripStyle, isNoneSchema);
                        self._secondColumnStripStyle = style
                    }
                    var firstHeaderCellStyle = typeof jsData.firstHeaderCellStyle !== const_undefined ? jsData.firstHeaderCellStyle : jsData._firstHeaderCellStyle;
                    if (typeof firstHeaderCellStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(firstHeaderCellStyle, isNoneSchema);
                        self._firstHeaderCellStyle = style
                    }
                    var lastHeaderCellStyle = typeof jsData.lastHeaderCellStyle !== const_undefined ? jsData.lastHeaderCellStyle : jsData._lastHeaderCellStyle;
                    if (typeof lastHeaderCellStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(lastHeaderCellStyle, isNoneSchema);
                        self._lastHeaderCellStyle = style
                    }
                    var firstFooterCellStyle = typeof jsData.firstFooterCellStyle !== const_undefined ? jsData.firstFooterCellStyle : jsData._firstFooterCellStyle;
                    if (typeof firstFooterCellStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(firstFooterCellStyle, isNoneSchema);
                        self._firstFooterCellStyle = style
                    }
                    var lastFooterCellStyle = typeof jsData.lastFooterCellStyle !== const_undefined ? jsData.lastFooterCellStyle : jsData._lastFooterCellStyle;
                    if (typeof lastFooterCellStyle !== const_undefined)
                    {
                        var style = new TableStyleInfo;
                        style.fromJSON(lastFooterCellStyle, isNoneSchema);
                        self._lastFooterCellStyle = style
                    }
                };
                return TableStyle
            })();
        Sheets.TableStyle = TableStyle;
        var TableStyles = (function()
            {
                function TableStyles(){}
                TableStyles.light1 = function()
                {
                    return TableStyles._getLightStyle(1)
                };
                TableStyles.light2 = function()
                {
                    return TableStyles._getLightStyle(2)
                };
                TableStyles.light3 = function()
                {
                    return TableStyles._getLightStyle(3)
                };
                TableStyles.light4 = function()
                {
                    return TableStyles._getLightStyle(4)
                };
                TableStyles.light5 = function()
                {
                    return TableStyles._getLightStyle(5)
                };
                TableStyles.light6 = function()
                {
                    return TableStyles._getLightStyle(6)
                };
                TableStyles.light7 = function()
                {
                    return TableStyles._getLightStyle(7)
                };
                TableStyles.light8 = function()
                {
                    return TableStyles._getLightStyle(8)
                };
                TableStyles.light9 = function()
                {
                    return TableStyles._getLightStyle(9)
                };
                TableStyles.light10 = function()
                {
                    return TableStyles._getLightStyle(10)
                };
                TableStyles.light11 = function()
                {
                    return TableStyles._getLightStyle(11)
                };
                TableStyles.light12 = function()
                {
                    return TableStyles._getLightStyle(12)
                };
                TableStyles.light13 = function()
                {
                    return TableStyles._getLightStyle(13)
                };
                TableStyles.light14 = function()
                {
                    return TableStyles._getLightStyle(14)
                };
                TableStyles.light15 = function()
                {
                    return TableStyles._getLightStyle(15)
                };
                TableStyles.light16 = function()
                {
                    return TableStyles._getLightStyle(16)
                };
                TableStyles.light17 = function()
                {
                    return TableStyles._getLightStyle(17)
                };
                TableStyles.light18 = function()
                {
                    return TableStyles._getLightStyle(18)
                };
                TableStyles.light19 = function()
                {
                    return TableStyles._getLightStyle(19)
                };
                TableStyles.light20 = function()
                {
                    return TableStyles._getLightStyle(20)
                };
                TableStyles.light21 = function()
                {
                    return TableStyles._getLightStyle(21)
                };
                TableStyles.medium1 = function()
                {
                    return TableStyles._getMediumStyle(1)
                };
                TableStyles.medium2 = function()
                {
                    return TableStyles._getMediumStyle(2)
                };
                TableStyles.medium3 = function()
                {
                    return TableStyles._getMediumStyle(3)
                };
                TableStyles.medium4 = function()
                {
                    return TableStyles._getMediumStyle(4)
                };
                TableStyles.medium5 = function()
                {
                    return TableStyles._getMediumStyle(5)
                };
                TableStyles.medium6 = function()
                {
                    return TableStyles._getMediumStyle(6)
                };
                TableStyles.medium7 = function()
                {
                    return TableStyles._getMediumStyle(7)
                };
                TableStyles.medium8 = function()
                {
                    return TableStyles._getMediumStyle(8)
                };
                TableStyles.medium9 = function()
                {
                    return TableStyles._getMediumStyle(9)
                };
                TableStyles.medium10 = function()
                {
                    return TableStyles._getMediumStyle(10)
                };
                TableStyles.medium11 = function()
                {
                    return TableStyles._getMediumStyle(11)
                };
                TableStyles.medium12 = function()
                {
                    return TableStyles._getMediumStyle(12)
                };
                TableStyles.medium13 = function()
                {
                    return TableStyles._getMediumStyle(13)
                };
                TableStyles.medium14 = function()
                {
                    return TableStyles._getMediumStyle(14)
                };
                TableStyles.medium15 = function()
                {
                    return TableStyles._getMediumStyle(15)
                };
                TableStyles.medium16 = function()
                {
                    return TableStyles._getMediumStyle(16)
                };
                TableStyles.medium17 = function()
                {
                    return TableStyles._getMediumStyle(17)
                };
                TableStyles.medium18 = function()
                {
                    return TableStyles._getMediumStyle(18)
                };
                TableStyles.medium19 = function()
                {
                    return TableStyles._getMediumStyle(19)
                };
                TableStyles.medium20 = function()
                {
                    return TableStyles._getMediumStyle(20)
                };
                TableStyles.medium21 = function()
                {
                    return TableStyles._getMediumStyle(21)
                };
                TableStyles.medium22 = function()
                {
                    return TableStyles._getMediumStyle(22)
                };
                TableStyles.medium23 = function()
                {
                    return TableStyles._getMediumStyle(23)
                };
                TableStyles.medium24 = function()
                {
                    return TableStyles._getMediumStyle(24)
                };
                TableStyles.medium25 = function()
                {
                    return TableStyles._getMediumStyle(25)
                };
                TableStyles.medium26 = function()
                {
                    return TableStyles._getMediumStyle(26)
                };
                TableStyles.medium27 = function()
                {
                    return TableStyles._getMediumStyle(27)
                };
                TableStyles.medium28 = function()
                {
                    return TableStyles._getMediumStyle(28)
                };
                TableStyles.dark1 = function()
                {
                    return TableStyles._getDarkStyle(1)
                };
                TableStyles.dark2 = function()
                {
                    return TableStyles._getDarkStyle(2)
                };
                TableStyles.dark3 = function()
                {
                    return TableStyles._getDarkStyle(3)
                };
                TableStyles.dark4 = function()
                {
                    return TableStyles._getDarkStyle(4)
                };
                TableStyles.dark5 = function()
                {
                    return TableStyles._getDarkStyle(5)
                };
                TableStyles.dark6 = function()
                {
                    return TableStyles._getDarkStyle(6)
                };
                TableStyles.dark7 = function()
                {
                    return TableStyles._getDarkStyle(7)
                };
                TableStyles.dark8 = function()
                {
                    return TableStyles._getDarkStyle(8)
                };
                TableStyles.dark9 = function()
                {
                    return TableStyles._getDarkStyle(9)
                };
                TableStyles.dark10 = function()
                {
                    return TableStyles._getDarkStyle(10)
                };
                TableStyles.dark11 = function()
                {
                    return TableStyles._getDarkStyle(11)
                };
                TableStyles.customStyles = function()
                {
                    var styles = TableStyles._customStyles;
                    return (!!styles ? styles : keyword_null)
                };
                TableStyles.addCustomStyles = function(style)
                {
                    if (!style)
                    {
                        return
                    }
                    if (!TableStyles._customStyles)
                    {
                        TableStyles._customStyles = []
                    }
                    var styles = TableStyles._customStyles,
                        count = styles.length,
                        s;
                    for (var i = 0; i < count; i++)
                    {
                        s = styles[i];
                        if (s.name() === style.name())
                        {
                            throw new Error(Sheets.SR.Exp_TableStyleAddCustomStyleError);
                        }
                    }
                    styles.push(style)
                };
                TableStyles.removeCustomStyle = function(style)
                {
                    if (!style)
                    {
                        return false
                    }
                    var styles = TableStyles._customStyles;
                    if (styles)
                    {
                        var index = Sheets.util.inArray(style, styles);
                        if (index > -1)
                        {
                            styles.splice(index, 1);
                            return true
                        }
                    }
                    return false
                };
                TableStyles.removeCustomStyleByName = function(styleName)
                {
                    var styles = TableStyles._customStyles;
                    if (styles)
                    {
                        var count = styles.length,
                            s;
                        for (var i = 0; i < count; i++)
                        {
                            s = styles[i];
                            if (s.name() === styleName)
                            {
                                styles.splice(i, 1);
                                return true
                            }
                        }
                    }
                    return false
                };
                TableStyles._getLightStyle = function(id)
                {
                    var index = id - 1;
                    if (typeof(TableStyles._lights) === const_undefined)
                    {
                        TableStyles._lights = {}
                    }
                    if (TableStyles._lights[index])
                    {
                        return TableStyles._lights[index]
                    }
                    var result = keyword_null;
                    switch (Math_floor(index / 7))
                    {
                        case 0:
                            result = TableStyles._createLightA(index % 7);
                            break;
                        case 1:
                            result = TableStyles._createLightB(index % 7);
                            break;
                        case 2:
                            result = TableStyles._createLightC(index % 7);
                            break
                    }
                    if (result)
                    {
                        result.name("Light" + id);
                        TableStyles._lights[index] = result;
                        return result
                    }
                    return keyword_null
                };
                TableStyles._createLightA = function(factor)
                {
                    var color = TableStyles._getTheme(factor);
                    var bkStrip1 = color + " 80";
                    var themeColor = color;
                    var style = new TableStyle;
                    var headerRowStyle = new TableStyleInfo;
                    headerRowStyle.borderBottom = new Sheets.LineBorder(themeColor, 1);
                    headerRowStyle.font = "bold 10pt arial";
                    headerRowStyle.foreColor = themeColor;
                    style.headerRowStyle(headerRowStyle);
                    var wholeTableStyle = new TableStyleInfo;
                    wholeTableStyle.borderTop = new Sheets.LineBorder(themeColor, 1);
                    wholeTableStyle.borderBottom = new Sheets.LineBorder(themeColor, 1);
                    wholeTableStyle.foreColor = themeColor;
                    style.wholeTableStyle(wholeTableStyle);
                    var firstRowStripStyle = new TableStyleInfo;
                    firstRowStripStyle.backColor = bkStrip1;
                    style.firstRowStripStyle(firstRowStripStyle);
                    var highlightFirstColumnStyle = new TableStyleInfo;
                    highlightFirstColumnStyle.font = "bold 10pt arial";
                    highlightFirstColumnStyle.foreColor = themeColor;
                    style.highlightFirstColumnStyle(highlightFirstColumnStyle);
                    var highlightLastColumnStyle = new TableStyleInfo;
                    highlightLastColumnStyle.font = "bold 10pt arial";
                    highlightLastColumnStyle.foreColor = themeColor;
                    style.highlightLastColumnStyle(highlightLastColumnStyle);
                    var firstColumnStripStyle = new TableStyleInfo;
                    firstColumnStripStyle.backColor = bkStrip1;
                    style.firstColumnStripStyle(firstColumnStripStyle);
                    var footerRowStyle = new TableStyleInfo;
                    footerRowStyle.borderTop = new Sheets.LineBorder(themeColor, 1);
                    footerRowStyle.font = "bold 10pt arial";
                    footerRowStyle.foreColor = themeColor;
                    style.footerRowStyle(footerRowStyle);
                    return style
                };
                TableStyles._createLightB = function(factor)
                {
                    var color = TableStyles._getTheme(factor);
                    var themeColor = color;
                    var style = new TableStyle;
                    var headerRowStyle = new TableStyleInfo;
                    headerRowStyle.backColor = themeColor;
                    headerRowStyle.font = "bold 10pt arial";
                    headerRowStyle.foreColor = "white";
                    style.headerRowStyle(headerRowStyle);
                    var wholeTableStyle = new TableStyleInfo;
                    wholeTableStyle.borderLeft = new Sheets.LineBorder(themeColor, 1);
                    wholeTableStyle.borderTop = new Sheets.LineBorder(themeColor, 1);
                    wholeTableStyle.borderBottom = new Sheets.LineBorder(themeColor, 1);
                    wholeTableStyle.borderRight = new Sheets.LineBorder(themeColor, 1);
                    style.wholeTableStyle(wholeTableStyle);
                    var firstRowStripStyle = new TableStyleInfo;
                    firstRowStripStyle.borderTop = new Sheets.LineBorder(themeColor, 1);
                    style.firstRowStripStyle(firstRowStripStyle);
                    var secondRowStripStyle = new TableStyleInfo;
                    secondRowStripStyle.borderTop = new Sheets.LineBorder(themeColor, 1);
                    style.secondRowStripStyle(secondRowStripStyle);
                    var firstColumnStripStyle = new TableStyleInfo;
                    firstColumnStripStyle.borderLeft = new Sheets.LineBorder(themeColor, 1);
                    style.firstColumnStripStyle(firstColumnStripStyle);
                    var secondColumnStripStyle = new TableStyleInfo;
                    secondColumnStripStyle.borderLeft = new Sheets.LineBorder(themeColor, 1);
                    style.secondColumnStripStyle(secondColumnStripStyle);
                    var highlightFirstColumnStyle = new TableStyleInfo;
                    highlightFirstColumnStyle.font = "bold 10pt arial";
                    style.highlightFirstColumnStyle(highlightFirstColumnStyle);
                    var highlightLastColumnStyle = new TableStyleInfo;
                    highlightLastColumnStyle.font = "bold 10pt arial";
                    style.highlightLastColumnStyle(highlightLastColumnStyle);
                    var footerRowStyle = new TableStyleInfo;
                    footerRowStyle.borderTop = new Sheets.LineBorder(themeColor, 6);
                    footerRowStyle.font = "bold 10pt arial";
                    style.footerRowStyle(footerRowStyle);
                    return style
                };
                TableStyles._createLightC = function(factor)
                {
                    var color = TableStyles._getTheme(factor);
                    var bkStrip1 = color + " 80";
                    var themeColor = color;
                    var style = new TableStyle;
                    var headerRowStyle = new TableStyleInfo;
                    headerRowStyle.borderBottom = new Sheets.LineBorder(themeColor, 2);
                    headerRowStyle.font = "bold 10pt arial";
                    style.headerRowStyle(headerRowStyle);
                    var wholeTableStyle = new TableStyleInfo;
                    wholeTableStyle.borderLeft = new Sheets.LineBorder(themeColor, 1);
                    wholeTableStyle.borderTop = new Sheets.LineBorder(themeColor, 1);
                    wholeTableStyle.borderRight = new Sheets.LineBorder(themeColor, 1);
                    wholeTableStyle.borderBottom = new Sheets.LineBorder(themeColor, 1);
                    wholeTableStyle.borderHorizontal = new Sheets.LineBorder(themeColor, 1);
                    wholeTableStyle.borderVertical = new Sheets.LineBorder(themeColor, 1);
                    style.wholeTableStyle(wholeTableStyle);
                    var firstRowStripStyle = new TableStyleInfo;
                    firstRowStripStyle.backColor = bkStrip1;
                    style.firstRowStripStyle(firstRowStripStyle);
                    var firstColumnStripStyle = new TableStyleInfo;
                    firstColumnStripStyle.backColor = bkStrip1;
                    style.firstColumnStripStyle(firstColumnStripStyle);
                    var highlightFirstColumnStyle = new TableStyleInfo;
                    highlightFirstColumnStyle.font = "bold 10pt arial";
                    style.highlightFirstColumnStyle(highlightFirstColumnStyle);
                    var highlightLastColumnStyle = new TableStyleInfo;
                    highlightLastColumnStyle.font = "bold 10pt arial";
                    style.highlightLastColumnStyle(highlightLastColumnStyle);
                    var footerRowStyle = new TableStyleInfo;
                    footerRowStyle.borderTop = new Sheets.LineBorder(themeColor, 6);
                    footerRowStyle.font = "bold 10pt arial";
                    style.footerRowStyle(footerRowStyle);
                    return style
                };
                TableStyles._getMediumStyle = function(id)
                {
                    var index = id - 1;
                    if (typeof(TableStyles._mediums) === const_undefined)
                    {
                        TableStyles._mediums = {}
                    }
                    if (TableStyles._mediums[index])
                    {
                        return TableStyles._mediums[index]
                    }
                    var result = keyword_null;
                    switch (Math_floor(index / 7))
                    {
                        case 0:
                            result = TableStyles._createMediumA(index % 7);
                            break;
                        case 1:
                            result = TableStyles._createMediumB(index % 7);
                            break;
                        case 2:
                            result = TableStyles._createMediumC(index % 7);
                            break;
                        case 3:
                            result = TableStyles._createMediumD(index % 7);
                            break
                    }
                    if (result)
                    {
                        result.name("Medium" + id);
                        TableStyles._mediums[index] = result;
                        return result
                    }
                    return keyword_null
                };
                TableStyles._createMediumA = function(factor)
                {
                    var color = TableStyles._getTheme(factor);
                    var border = color + " 20";
                    var bkHeader = color;
                    var bkStrip1 = color + " 80";
                    var style = new TableStyle;
                    var headerRowStyle = new TableStyleInfo;
                    headerRowStyle.backColor = bkHeader;
                    headerRowStyle.font = "bold 10pt arial";
                    headerRowStyle.foreColor = "white";
                    style.headerRowStyle(headerRowStyle);
                    var wholeTableStyle = new TableStyleInfo;
                    wholeTableStyle.borderHorizontal = new Sheets.LineBorder(border, 1);
                    wholeTableStyle.borderLeft = new Sheets.LineBorder(border, 1);
                    wholeTableStyle.borderRight = new Sheets.LineBorder(border, 1);
                    wholeTableStyle.borderBottom = new Sheets.LineBorder(border, 1);
                    wholeTableStyle.borderTop = new Sheets.LineBorder(border, 1);
                    style.wholeTableStyle(wholeTableStyle);
                    var firstRowStripStyle = new TableStyleInfo;
                    firstRowStripStyle.backColor = bkStrip1;
                    style.firstRowStripStyle(firstRowStripStyle);
                    var firstColumnStripStyle = new TableStyleInfo;
                    firstColumnStripStyle.backColor = bkStrip1;
                    style.firstColumnStripStyle(firstColumnStripStyle);
                    var highlightFirstColumnStyle = new TableStyleInfo;
                    highlightFirstColumnStyle.font = "bold 10pt arial";
                    style.highlightFirstColumnStyle(highlightFirstColumnStyle);
                    var highlightLastColumnStyle = new TableStyleInfo;
                    highlightLastColumnStyle.font = "bold 10pt arial";
                    style.highlightLastColumnStyle(highlightLastColumnStyle);
                    var footerRowStyle = new TableStyleInfo;
                    footerRowStyle.borderTop = new Sheets.LineBorder(border, 6);
                    footerRowStyle.font = "bold 10pt arial";
                    footerRowStyle.foreColor = "black";
                    style.footerRowStyle(footerRowStyle);
                    return style
                };
                TableStyles._createMediumB = function(factor)
                {
                    var color = TableStyles._getTheme(factor);
                    var borderColor = "white";
                    var bkHeader = color;
                    var bkStrip1 = color + " 60";
                    var bkStrip2 = color + " 80";
                    var style = new TableStyle;
                    var headerRowStyle = new TableStyleInfo;
                    headerRowStyle.backColor = bkHeader;
                    headerRowStyle.borderBottom = new Sheets.LineBorder(borderColor, 2);
                    headerRowStyle.borderVertical = new Sheets.LineBorder(borderColor, 1);
                    headerRowStyle.font = "bold 10pt arial";
                    headerRowStyle.foreColor = "white";
                    style.headerRowStyle(headerRowStyle);
                    var wholeTableStyle = new TableStyleInfo;
                    wholeTableStyle.borderHorizontal = new Sheets.LineBorder(borderColor, 1);
                    wholeTableStyle.borderVertical = new Sheets.LineBorder(borderColor, 1);
                    wholeTableStyle.backColor = bkStrip2;
                    style.wholeTableStyle(wholeTableStyle);
                    var firstRowStripStyle = new TableStyleInfo;
                    firstRowStripStyle.backColor = bkStrip1;
                    style.firstRowStripStyle(firstRowStripStyle);
                    var firstColumnStripStyle = new TableStyleInfo;
                    firstColumnStripStyle.backColor = bkStrip1;
                    style.firstColumnStripStyle(firstColumnStripStyle);
                    var highlightFirstColumnStyle = new TableStyleInfo;
                    highlightFirstColumnStyle.backColor = bkHeader;
                    highlightFirstColumnStyle.foreColor = "white";
                    highlightFirstColumnStyle.font = "bold 10pt arial";
                    style.highlightFirstColumnStyle(highlightFirstColumnStyle);
                    var highlightLastColumnStyle = new TableStyleInfo;
                    highlightLastColumnStyle.backColor = bkHeader;
                    highlightLastColumnStyle.foreColor = "white";
                    highlightLastColumnStyle.font = "bold 10pt arial";
                    style.highlightLastColumnStyle(highlightLastColumnStyle);
                    var footerRowStyle = new TableStyleInfo;
                    footerRowStyle.borderTop = new Sheets.LineBorder(borderColor, 2);
                    footerRowStyle.borderVertical = new Sheets.LineBorder(borderColor, 1);
                    footerRowStyle.backColor = bkHeader;
                    footerRowStyle.foreColor = "white";
                    footerRowStyle.font = "bold 10pt arial";
                    style.footerRowStyle(footerRowStyle);
                    return style
                };
                TableStyles._createMediumC = function(factor)
                {
                    var color = TableStyles._getTheme(factor);
                    var bkHeader = color;
                    var bkStrip1 = "#D3D3D3";
                    var bkStrip2 = "white";
                    var border = (factor === 0 ? "black" : "#D3D3D3");
                    var style = new TableStyle;
                    var headerRowStyle = new TableStyleInfo;
                    headerRowStyle.backColor = bkHeader;
                    headerRowStyle.borderTop = new Sheets.LineBorder("black", 2);
                    headerRowStyle.borderBottom = new Sheets.LineBorder("black", 2);
                    headerRowStyle.font = "bold 10pt arial";
                    headerRowStyle.foreColor = "white";
                    style.headerRowStyle(headerRowStyle);
                    var wholeTableStyle = new TableStyleInfo;
                    wholeTableStyle.borderLeft = new Sheets.LineBorder(border, 1);
                    wholeTableStyle.borderRight = new Sheets.LineBorder(border, 1);
                    wholeTableStyle.borderTop = new Sheets.LineBorder("black", 2);
                    wholeTableStyle.borderVertical = new Sheets.LineBorder(border, 1);
                    if (factor === 0)
                    {
                        wholeTableStyle.borderHorizontal = new Sheets.LineBorder(border, 1)
                    }
                    wholeTableStyle.borderBottom = new Sheets.LineBorder("black", 2);
                    style.wholeTableStyle(wholeTableStyle);
                    var firstRowStripStyle = new TableStyleInfo;
                    firstRowStripStyle.backColor = bkStrip1;
                    style.firstRowStripStyle(firstRowStripStyle);
                    var firstColumnStripStyle = new TableStyleInfo;
                    firstColumnStripStyle.backColor = bkStrip1;
                    style.firstColumnStripStyle(firstColumnStripStyle);
                    var highlightFirstColumnStyle = new TableStyleInfo;
                    highlightFirstColumnStyle.backColor = bkHeader;
                    highlightFirstColumnStyle.foreColor = "white";
                    style.highlightFirstColumnStyle(highlightFirstColumnStyle);
                    var highlightLastColumnStyle = new TableStyleInfo;
                    highlightLastColumnStyle.backColor = bkHeader;
                    highlightLastColumnStyle.foreColor = "white";
                    style.highlightLastColumnStyle(highlightLastColumnStyle);
                    var firstFooterCellStyle = new TableStyleInfo;
                    firstFooterCellStyle.backColor = bkHeader;
                    firstFooterCellStyle.font = "bold 10pt arial";
                    firstFooterCellStyle.foreColor = "white";
                    style.firstFooterCellStyle(firstFooterCellStyle);
                    var lastFooterCellStyle = new TableStyleInfo;
                    lastFooterCellStyle.backColor = bkHeader;
                    lastFooterCellStyle.font = "bold 10pt arial";
                    lastFooterCellStyle.foreColor = "white";
                    style.lastFooterCellStyle(lastFooterCellStyle);
                    var footerRowStyle = new TableStyleInfo;
                    footerRowStyle.foreColor = "black";
                    footerRowStyle.borderTop = new Sheets.LineBorder("black", 6);
                    style.footerRowStyle(footerRowStyle);
                    return style
                };
                TableStyles._createMediumD = function(factor)
                {
                    var color = TableStyles._getTheme(factor);
                    var footerBorder = color;
                    var border = color + " 40";
                    var bkHeader = color + " 80";
                    var bkStrip1 = color + " 60";
                    var bkStrip2 = color + " 80";
                    var style = new TableStyle;
                    var headerRowStyle = new TableStyleInfo;
                    headerRowStyle.backColor = bkHeader;
                    headerRowStyle.borderVertical = new Sheets.LineBorder(border, 1);
                    headerRowStyle.borderLeft = new Sheets.LineBorder(border, 1);
                    headerRowStyle.borderTop = new Sheets.LineBorder(border, 1);
                    headerRowStyle.borderRight = new Sheets.LineBorder(border, 1);
                    headerRowStyle.borderBottom = new Sheets.LineBorder(border, 1);
                    headerRowStyle.font = "bold 10pt arial";
                    headerRowStyle.foreColor = "black";
                    style.headerRowStyle(headerRowStyle);
                    var wholeTableStyle = new TableStyleInfo;
                    wholeTableStyle.borderVertical = new Sheets.LineBorder(border, 1);
                    wholeTableStyle.borderHorizontal = new Sheets.LineBorder(border, 1);
                    wholeTableStyle.borderLeft = new Sheets.LineBorder(border, 1);
                    wholeTableStyle.borderTop = new Sheets.LineBorder(border, 1);
                    wholeTableStyle.borderRight = new Sheets.LineBorder(border, 1);
                    wholeTableStyle.borderBottom = new Sheets.LineBorder(border, 1);
                    wholeTableStyle.backColor = bkHeader;
                    style.wholeTableStyle(wholeTableStyle);
                    var firstRowStripStyle = new TableStyleInfo;
                    firstRowStripStyle.backColor = bkStrip1;
                    style.firstRowStripStyle(firstRowStripStyle);
                    var firstColumnStripStyle = new TableStyleInfo;
                    firstColumnStripStyle.backColor = bkStrip1;
                    style.firstColumnStripStyle(firstColumnStripStyle);
                    var highlightFirstColumnStyle = new TableStyleInfo;
                    highlightFirstColumnStyle.font = "bold 10pt arial";
                    style.highlightFirstColumnStyle(highlightFirstColumnStyle);
                    var highlightLastColumnStyle = new TableStyleInfo;
                    highlightLastColumnStyle.font = "bold 10pt arial";
                    style.highlightLastColumnStyle(highlightLastColumnStyle);
                    var footerRowStyle = new TableStyleInfo;
                    footerRowStyle.backColor = bkStrip2;
                    footerRowStyle.foreColor = "black";
                    footerRowStyle.font = "bold 10pt arial";
                    footerRowStyle.borderLeft = new Sheets.LineBorder(border, 1);
                    footerRowStyle.borderTop = new Sheets.LineBorder(footerBorder, 2);
                    footerRowStyle.borderRight = new Sheets.LineBorder(border, 1);
                    footerRowStyle.borderBottom = new Sheets.LineBorder(border, 1);
                    footerRowStyle.borderVertical = new Sheets.LineBorder(border, 1);
                    style.footerRowStyle(footerRowStyle);
                    return style
                };
                TableStyles._getDarkStyle = function(id)
                {
                    var index = id - 1;
                    if (typeof(TableStyles._darks) === const_undefined)
                    {
                        TableStyles._darks = {}
                    }
                    if (TableStyles._darks[index])
                    {
                        return TableStyles._darks[index]
                    }
                    var result = keyword_null;
                    switch (Math_floor(index / 7))
                    {
                        case 0:
                            result = TableStyles._createDarkA(index % 7);
                            break;
                        case 1:
                            result = TableStyles._createDarkB(index % 7);
                            break
                    }
                    if (result != keyword_null)
                    {
                        result.name("Dark" + id);
                        TableStyles._darks[index] = result;
                        return result
                    }
                    return keyword_null
                };
                TableStyles._createDarkA = function(factor)
                {
                    var color = TableStyles._getTheme(factor);
                    var headerColor = "black";
                    var bkStrip1 = (factor === 0 ? color + " 25" : color + " -25");
                    var tableBk = (factor === 0 ? color + " 50" : color);
                    var footColor = (factor === 0 ? color : color + " -50");
                    var style = new TableStyle;
                    var headerRowStyle = new TableStyleInfo;
                    headerRowStyle.backColor = headerColor;
                    headerRowStyle.font = "bold 10pt arial";
                    headerRowStyle.foreColor = "white";
                    headerRowStyle.borderBottom = new Sheets.LineBorder("white", 2);
                    style.headerRowStyle(headerRowStyle);
                    var wholeTableStyle = new TableStyleInfo;
                    wholeTableStyle.backColor = tableBk;
                    wholeTableStyle.foreColor = "white";
                    style.wholeTableStyle(wholeTableStyle);
                    var firstRowStripStyle = new TableStyleInfo;
                    firstRowStripStyle.backColor = bkStrip1;
                    style.firstRowStripStyle(firstRowStripStyle);
                    var firstColumnStripStyle = new TableStyleInfo;
                    firstColumnStripStyle.backColor = bkStrip1;
                    style.firstColumnStripStyle(firstColumnStripStyle);
                    var highlightFirstColumnStyle = new TableStyleInfo;
                    highlightFirstColumnStyle.font = "bold 10pt arial";
                    highlightFirstColumnStyle.borderRight = new Sheets.LineBorder("white", 2);
                    highlightFirstColumnStyle.backColor = bkStrip1;
                    highlightFirstColumnStyle.foreColor = "white";
                    style.highlightFirstColumnStyle(highlightFirstColumnStyle);
                    var highlightLastColumnStyle = new TableStyleInfo;
                    highlightLastColumnStyle.font = "bold 10pt arial";
                    highlightLastColumnStyle.borderLeft = new Sheets.LineBorder("white", 2);
                    highlightLastColumnStyle.backColor = bkStrip1;
                    highlightLastColumnStyle.foreColor = "white";
                    style.highlightLastColumnStyle(highlightLastColumnStyle);
                    var footerRowStyle = new TableStyleInfo;
                    footerRowStyle.backColor = footColor;
                    footerRowStyle.font = "bold 10pt arial";
                    footerRowStyle.foreColor = "white";
                    footerRowStyle.borderTop = new Sheets.LineBorder("white", 2);
                    style.footerRowStyle(footerRowStyle);
                    return style
                };
                TableStyles._createDarkB = function(factor)
                {
                    var color = TableStyles._getTheme(factor);
                    var headerColor = TableStyles._getHeaderColor(factor);
                    var bkStrip1 = TableStyles._getStripColor(factor);
                    var tableBk = TableStyles._getTableBackground(factor);
                    var footColor = tableBk;
                    var style = new TableStyle;
                    var headerRowStyle = new TableStyleInfo;
                    headerRowStyle.backColor = headerColor;
                    headerRowStyle.foreColor = "white";
                    style.headerRowStyle(headerRowStyle);
                    var wholeTableStyle = new TableStyleInfo;
                    wholeTableStyle.backColor = tableBk;
                    style.wholeTableStyle(wholeTableStyle);
                    var firstRowStripStyle = new TableStyleInfo;
                    firstRowStripStyle.backColor = bkStrip1;
                    style.firstRowStripStyle(firstRowStripStyle);
                    var firstColumnStripStyle = new TableStyleInfo;
                    firstColumnStripStyle.backColor = bkStrip1;
                    style.firstColumnStripStyle(firstColumnStripStyle);
                    var highlightFirstColumnStyle = new TableStyleInfo;
                    highlightFirstColumnStyle.font = "bold 10pt arial";
                    style.highlightFirstColumnStyle(highlightFirstColumnStyle);
                    var highlightLastColumnStyle = new TableStyleInfo;
                    highlightLastColumnStyle.font = "bold 10pt arial";
                    style.highlightLastColumnStyle(highlightLastColumnStyle);
                    var footerRowStyle = new TableStyleInfo;
                    footerRowStyle.backColor = footColor;
                    footerRowStyle.font = "bold 10pt arial";
                    footerRowStyle.borderTop = new Sheets.LineBorder("black", 6);
                    style.footerRowStyle(footerRowStyle);
                    return style
                };
                TableStyles._getTableBackground = function(index)
                {
                    if (index === 0)
                    {
                        return "Background 1 -15"
                    }
                    else if (index === 1)
                    {
                        return "Accent 1 80"
                    }
                    else if (index === 2)
                    {
                        return "Accent 3 80"
                    }
                    else if (index === 3)
                    {
                        return "Accent 5 80"
                    }
                    return ""
                };
                TableStyles._getStripColor = function(index)
                {
                    if (index === 0)
                        return "Background 1 -35";
                    else if (index === 1)
                        return "Accent 1 60";
                    else if (index === 2)
                        return "Accent 3 60";
                    else if (index === 3)
                        return "Accent 5 60";
                    return ""
                };
                TableStyles._getHeaderColor = function(index)
                {
                    if (index === 0)
                        return "Text 1";
                    else if (index === 1)
                        return "Accent 2";
                    else if (index === 2)
                        return "Accent 4";
                    else if (index === 3)
                        return "Accent 6";
                    return ""
                };
                TableStyles._getTheme = function(factor)
                {
                    if (factor === 0)
                    {
                        return "Text 1"
                    }
                    return "Accent " + factor
                };
                return TableStyles
            })();
        Sheets.TableStyles = TableStyles;
        var _SheetTableManager = (function()
            {
                function _SheetTableManager(sheet)
                {
                    this._sheet = sheet;
                    this._tableList = [];
                    this._updateDataSourceSuspended = false
                }
                _SheetTableManager.prototype.suspendUpdateDataSource = function()
                {
                    this._updateDataSourceSuspended = true
                };
                _SheetTableManager.prototype.resumeUpdateDataSource = function()
                {
                    this._updateDataSourceSuspended = false
                };
                _SheetTableManager.prototype.isUpdateDataSourceSuspended = function()
                {
                    return this._updateDataSourceSuspended
                };
                _SheetTableManager.prototype.resetTablesBindingManager = function()
                {
                    var tables = this.getTables();
                    for (var i = 0, count = tables.length; i < count; i++)
                    {
                        var table = tables[i];
                        if (table.bindingPath())
                        {
                            table.resetBindingManager()
                        }
                    }
                };
                _SheetTableManager.prototype.getSheet = function()
                {
                    return this._sheet
                };
                _SheetTableManager.prototype.getCount = function()
                {
                    return this._tableList.length
                };
                _SheetTableManager.prototype.getTables = function()
                {
                    return this._tableList
                };
                _SheetTableManager.prototype.clearTables = function()
                {
                    var tables = this._tableList,
                        sheet = this._sheet;
                    var oldState = sheet.isPaintSuspended();
                    sheet.isPaintSuspended(true);
                    try
                    {
                        for (var i = 0, length = tables.length; i < length; i++)
                        {
                            this.remove(tables[i], true)
                        }
                    }
                    finally
                    {
                        sheet.isPaintSuspended(oldState)
                    }
                };
                _SheetTableManager.prototype.add = function(table)
                {
                    if (!table)
                    {
                        return
                    }
                    var self = this;
                    var count = self._tableList.length,
                        t;
                    for (var i = 0; i < count; i++)
                    {
                        t = self._tableList[i];
                        if (t && t.name() === table.name())
                        {
                            throw new Error(Sheets.SR.Exp_TableHasSameNameError);
                        }
                    }
                    table._setOwner(self);
                    table._applyBindingPath();
                    self._tableList.push(table);
                    if (table.showHeader())
                    {
                        table._syncHeader()
                    }
                    if (table.showFooter())
                    {
                        table._syncFooter()
                    }
                    return table
                };
                _SheetTableManager.prototype.remove = function(table, clearValue)
                {
                    if (!table)
                    {
                        return
                    }
                    var index = Sheets.util.inArray(table, this._tableList);
                    if (index > -1)
                    {
                        this._tableList.splice(index, 1);
                        if (clearValue !== false)
                        {
                            var cr = table.range(),
                                sheet = this._sheet;
                            var oldState = sheet.isPaintSuspended();
                            sheet.isPaintSuspended(true);
                            try
                            {
                                var row1 = cr.row,
                                    row2 = cr.row + cr.rowCount,
                                    col1 = cr.col,
                                    col2 = cr.col + cr.colCount;
                                for (var r = row1; r < row2; r++)
                                {
                                    for (var c = col1; c < col2; c++)
                                    {
                                        sheet.setFormula(r, c, keyword_null);
                                        sheet.setValue(r, c, keyword_null)
                                    }
                                }
                            }
                            finally
                            {
                                sheet.isPaintSuspended(oldState)
                            }
                        }
                    }
                };
                _SheetTableManager.prototype.find = function(row, col)
                {
                    var count = this._tableList.length;
                    if (count === 0)
                    {
                        return keyword_null
                    }
                    var t;
                    for (var i = 0; i < count; i++)
                    {
                        t = this._tableList[i];
                        var cr = t.range();
                        if ((cr.row <= row && row < cr.row + cr.rowCount) && (cr.col <= col && col < cr.col + cr.colCount))
                        {
                            return t
                        }
                    }
                    return keyword_null
                };
                _SheetTableManager.prototype.findByRange = function(row, col, rowCount, colCount)
                {
                    var count = this._tableList.length;
                    if (count === 0)
                    {
                        return keyword_null
                    }
                    var ret = [],
                        t;
                    for (var i = 0; i < count; i++)
                    {
                        t = this._tableList[i];
                        if (t.range().intersect(row, col, rowCount, colCount))
                        {
                            ret.push(t)
                        }
                    }
                    return ret
                };
                _SheetTableManager.prototype.findByName = function(tableName)
                {
                    var count = this._tableList.length,
                        t;
                    for (var i = 0; i < count; i++)
                    {
                        t = this._tableList[i];
                        if (t.name().toLowerCase() === tableName.toLowerCase())
                        {
                            return t
                        }
                    }
                    return keyword_null
                };
                _SheetTableManager.prototype.has = function(row, col, rowCount, colCount)
                {
                    var count = this._tableList.length,
                        t;
                    for (var i = 0; i < count; i++)
                    {
                        t = this._tableList[i];
                        if (t.range().intersect(row, col, rowCount, colCount))
                        {
                            return true
                        }
                    }
                    return false
                };
                _SheetTableManager.prototype.addRows = function(row, count)
                {
                    var tables = this._tableList;
                    var handledDataSources = [];
                    for (var i = 0, tablesCount = tables.length; i < tablesCount; i++)
                    {
                        var t = tables[i],
                            dataSource = t.getSource();
                        if (Sheets.ArrayHelper.contains(handledDataSources, dataSource))
                        {
                            t._addRows(row, count, true)
                        }
                        else
                        {
                            var dataSourceChanged = t._addRows(row, count, this.isUpdateDataSourceSuspended());
                            if (dataSourceChanged)
                            {
                                handledDataSources.push(dataSource)
                            }
                        }
                    }
                    if (!this.isUpdateDataSourceSuspended())
                    {
                        try
                        {
                            var sheet = this._sheet;
                            var oldState = sheet.isPaintSuspended();
                            sheet.isPaintSuspended(true);
                            this.suspendUpdateDataSource();
                            for (var i = 0, tablesCount = tables.length; i < tablesCount; i++)
                            {
                                var t = tables[i],
                                    sourceRowCount = t.getSourceRowCount(),
                                    dataRange = t.dataRange();
                                if (sourceRowCount > 0 && sourceRowCount !== dataRange.rowCount)
                                {
                                    var newRowCount = sourceRowCount;
                                    if (t.showHeader())
                                    {
                                        newRowCount += 1
                                    }
                                    if (t.showFooter())
                                    {
                                        newRowCount += 1
                                    }
                                    t._resize(newRowCount, dataRange.colCount, this.isUpdateDataSourceSuspended())
                                }
                            }
                        }
                        finally
                        {
                            this.resumeUpdateDataSource();
                            sheet.isPaintSuspended(oldState)
                        }
                    }
                };
                _SheetTableManager.prototype.addColumns = function(col, count)
                {
                    var c = this._tableList.length,
                        t;
                    for (var i = 0; i < c; i++)
                    {
                        t = this._tableList[i];
                        t._addColumns(col, count)
                    }
                };
                _SheetTableManager.prototype.removeRows = function(row, count)
                {
                    var tables = this._tableList;
                    var handledDataSources = [];
                    var remainedList = [];
                    for (var i = 0, tablesCount = tables.length; i < tablesCount; i++)
                    {
                        var t = tables[i],
                            dataSource = t.getSource();
                        var cr = t.range(),
                            contains = (row <= cr.row && cr.row + cr.rowCount <= row + count);
                        if (!contains)
                        {
                            if (Sheets.ArrayHelper.contains(handledDataSources, dataSource))
                            {
                                t._removeRows(row, count, true)
                            }
                            else
                            {
                                var dataSourceChanged = t._removeRows(row, count, this.isUpdateDataSourceSuspended());
                                if (dataSourceChanged)
                                {
                                    handledDataSources.push(dataSource)
                                }
                            }
                            remainedList.push(t)
                        }
                    }
                    this._tableList = remainedList;
                    if (!this.isUpdateDataSourceSuspended())
                    {
                        try
                        {
                            var sheet = this._sheet;
                            var oldState = sheet.isPaintSuspended();
                            sheet.isPaintSuspended(true);
                            this.suspendUpdateDataSource();
                            tables = this._tableList;
                            for (var i = 0, tablesCount = tables.length; i < tablesCount; i++)
                            {
                                var t = tables[i],
                                    sourceRowCount = t.getSourceRowCount(),
                                    dataRange = t.dataRange();
                                if (sourceRowCount > 0 && sourceRowCount !== dataRange.rowCount)
                                {
                                    var newRowCount = sourceRowCount;
                                    if (t.showHeader())
                                    {
                                        newRowCount += 1
                                    }
                                    if (t.showFooter())
                                    {
                                        newRowCount += 1
                                    }
                                    t._resize(newRowCount, dataRange.colCount, this.isUpdateDataSourceSuspended())
                                }
                            }
                        }
                        finally
                        {
                            this.resumeUpdateDataSource();
                            sheet.isPaintSuspended(oldState)
                        }
                    }
                };
                _SheetTableManager.prototype.removeColumns = function(col, count)
                {
                    var remainedList = [];
                    var c = this._tableList.length,
                        t;
                    for (var i = 0; i < c; i++)
                    {
                        t = this._tableList[i];
                        var cr = t.range(),
                            contains = (col <= cr.col && cr.col + cr.colCount <= col + count);
                        if (!contains)
                        {
                            t._removeColumns(col, count);
                            remainedList.push(t)
                        }
                    }
                    this._tableList = remainedList
                };
                _SheetTableManager.prototype.clear = function(row, col, rowCount, colCount, type)
                {
                    var self = this;
                    var clearRange = new Sheets.Range(row, col, rowCount, colCount);
                    var count,
                        t;
                    if ((type & 1) === 1)
                    {
                        var remainedList = [];
                        count = self._tableList.length;
                        for (var i = 0; i < count; i++)
                        {
                            t = self._tableList[i];
                            if (!clearRange.containsRange(t.range()))
                            {
                                remainedList.push(t)
                            }
                        }
                        count = remainedList.length;
                        for (var i = 0; i < count; i++)
                        {
                            t = remainedList[i];
                            t._clear(row, col, rowCount, colCount)
                        }
                        self._tableList = remainedList
                    }
                    if ((type & 2) === 2)
                    {
                        count = self._tableList.length;
                        for (var i = 0; i < count; i++)
                        {
                            t = self._tableList[i];
                            if (clearRange.containsRange(t.range()))
                            {
                                t.style(keyword_null)
                            }
                        }
                    }
                };
                _SheetTableManager.prototype.copy = function(fromRow, fromCol, toRow, toCol, rowCount, colCount)
                {
                    var count = this._tableList.length,
                        t;
                    for (var i = 0; i < count; i++)
                    {
                        t = this._tableList[i];
                        t._copy(fromRow, fromCol, toRow, toCol, rowCount, colCount)
                    }
                };
                _SheetTableManager.prototype.move = function(fromRow, fromCol, toRow, toCol, rowCount, colCount)
                {
                    var count = this._tableList.length,
                        t;
                    for (var i = 0; i < count; i++)
                    {
                        t = this._tableList[i];
                        t._move(fromRow, fromCol, toRow, toCol, rowCount, colCount)
                    }
                };
                _SheetTableManager.prototype.getNoConflictTableName = function(name)
                {
                    var i = 1;
                    while (this.findByName(name))
                    {
                        name = "table" + i;
                        i++
                    }
                    return name
                };
                _SheetTableManager.prototype.toJSON = function()
                {
                    var tables = this._tableList;
                    if (!tables || tables.length === 0)
                    {
                        return keyword_undefined
                    }
                    var jsonData = [];
                    for (var i = 0; i < tables.length; i++)
                    {
                        jsonData.push(tables[i].toJSON())
                    }
                    if (jsonData.length === 0)
                    {
                        return keyword_undefined
                    }
                    return jsonData
                };
                _SheetTableManager.prototype.fromJSON = function(jsData, isNoneSchema)
                {
                    if (!jsData || jsData.length === 0)
                    {
                        return
                    }
                    for (var i = 0; i < jsData.length; i++)
                    {
                        var item = jsData[i];
                        var table = new SheetTable;
                        table._setOwner(this);
                        table.fromJSON(item, isNoneSchema);
                        this._tableList.push(table)
                    }
                };
                return _SheetTableManager
            })();
        Sheets._SheetTableManager = _SheetTableManager
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

