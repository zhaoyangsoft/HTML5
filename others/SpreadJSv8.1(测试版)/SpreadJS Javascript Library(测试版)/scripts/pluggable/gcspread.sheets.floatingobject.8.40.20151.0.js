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
        Sheets.feature("floatingObject", ["core.common", "core.stringResource", "core.sheet_action", "core.imageLoader"]);
        var keyword_null = null,
            keyword_undefined = undefined,
            keyword_string = "string",
            keyword_number = "number",
            Math_ceil = Math.ceil,
            Math_floor = Math.floor,
            Math_max = Math.max,
            Math_min = Math.min,
            Math_abs = Math.abs;
        var BACKGROUND_COLOR = '#044062',
            FROZEN_VIEWPORTINDEX = 0,
            VIEWPORTINDEX = 1,
            TRAIL_VIEWPORTINDEX = 2,
            MAX_NUMBER = 9007199254740992,
            CSS_ZINDEXDEFAULTVALUE = 700,
            CSS_CONTAINERZINDEXVALUE = 701,
            CSS_POSITION = 'position',
            CSS_POSITION_ABSOLUTE = 'absolute',
            CSS_PERCENT_100 = '100%',
            CSS_BACKGROUND_COLOR = 'background',
            CSS_BACKGROUND_IMAGE = 'background-image',
            CSS_CLASS_FLOATINGOBJECT_SELECTED = 'floatingobject-selected',
            CSS_CLASS_FLOATINGOBJECT_UNSELECTED = 'floatingobject-unselected',
            CSS_CLASS_RESIZE_INDICATOR_SELECT = 'floatingobject-resize-indicator-select',
            CSS_CLASS_RESIZE_INDICATOR_UNSELECT = 'floatingobject-resize-indicator-unSelect',
            CSS_CLASS_NONE_USER_SELECT = 'floatingobject-none-user-select',
            CSS_CLASS_FLOATINGOBJECT_CONTENT_CONTAINER = 'floatingobject-content-container',
            CSS_CLASS_FLOATINGOBJECT_CONTAINER = 'floatingobject-container',
            CSS_CLASS_FLOATINGOBJECT_MOVING_CONTAINER = 'floatingobject-moving-container',
            CSS_CLASS_FLOATINGOBJECT_MOVING_DIV = 'floatingobject-moving-div',
            CSS_CLASS_FLOATINGOBJECT_BACKGROUND_COVER = 'floatingobject-background-cover',
            CSS_SELECTOR_RESIZE_INDICATOR = '.floatingobject-resize-indicator',
            CSS_SELECTOR_TOP_LEFT_RESIZE_INDICATOR = 'div.floatingobject-resize-indicator.floatingobject-top.floatingobject-left',
            CSS_SELECTOR_MIDDLE_LEFT_RESIZE_INDICATOR = 'div.floatingobject-resize-indicator.floatingobject-middle.floatingobject-left',
            CSS_SELECTOR_BOTTOM_LEFT_RESIZE_INDICATOR = 'div.floatingobject-resize-indicator.floatingobject-bottom.floatingobject-left',
            CSS_SELECTOR_TOP_CENTER_RESIZE_INDICATOR = 'div.floatingobject-resize-indicator.floatingobject-top.floatingobject-center',
            CSS_SELECTOR_BOTTOM_CENTER_RESIZE_INDICATOR = 'div.floatingobject-resize-indicator.floatingobject-bottom.floatingobject-center',
            CSS_SELECTOR_TOP_RIGHT_RESIZE_INDICATOR = 'div.floatingobject-resize-indicator.floatingobject-top.floatingobject-right',
            CSS_SELECTOR_MIDDLE_RIGHT_RESIZE_INDICATOR = 'div.floatingobject-resize-indicator.floatingobject-middle.floatingobject-right',
            CSS_SELECTOR_BOTTOM_RIGHT_RESIZE_INDICATOR = 'div.floatingobject-resize-indicator.floatingobject-bottom.floatingobject-right',
            HTML_RESIZE_INDICATOR = '<div class="floatingobject-resize-indicator floatingobject-top floatingobject-left floatingobject-absolute"></div><div class="floatingobject-resize-indicator floatingobject-top floatingobject-center floatingobject-absolute"></div><div class="floatingobject-resize-indicator floatingobject-top floatingobject-right floatingobject-absolute"></div><div class="floatingobject-resize-indicator floatingobject-middle floatingobject-left floatingobject-absolute"></div><div class="floatingobject-resize-indicator floatingobject-middle floatingobject-right floatingobject-absolute"></div><div class="floatingobject-resize-indicator floatingobject-bottom floatingobject-left floatingobject-absolute"></div><div class="floatingobject-resize-indicator floatingobject-bottom floatingobject-center floatingobject-absolute"></div><div class="floatingobject-resize-indicator floatingobject-bottom floatingobject-right floatingobject-absolute"></div>',
            tag_input = "input",
            _gcFloatingObject = ".gcFloatingObject";
        (function(FloatingObjectType)
        {
            FloatingObjectType[FloatingObjectType["CustomFloatingObject"] = 0] = "CustomFloatingObject";
            FloatingObjectType[FloatingObjectType["Picture"] = 1] = "Picture"
        })(Sheets.FloatingObjectType || (Sheets.FloatingObjectType = {}));
        var FloatingObjectType = Sheets.FloatingObjectType;
        var _FloatingObjectArray = (function(_super)
            {
                __extends(_FloatingObjectArray, _super);
                function _FloatingObjectArray(sheet)
                {
                    _super.call(this);
                    this._floatingObjectType = keyword_null;
                    var self = this;
                    self._sheet = sheet;
                    self._bindEventsOnSheet()
                }
                _FloatingObjectArray.prototype.ownerSheet = function(sheet)
                {
                    if (arguments.length === 0)
                    {
                        return this._sheet
                    }
                    this._sheet = sheet;
                    return this
                };
                _FloatingObjectArray.prototype.find = function(name)
                {
                    var index = this._findItemIndex(name);
                    if (index >= 0)
                    {
                        return this[index]
                    }
                    return keyword_null
                };
                _FloatingObjectArray.prototype.replace = function(name, value)
                {
                    if (value === keyword_null || value === keyword_undefined)
                    {
                        throw new Error(Sheets.SR.Exp_ValueIsNull);
                    }
                    var index = this._findItemIndex(name);
                    if (index >= 0)
                    {
                        this.splice(index, 1, value)
                    }
                };
                _FloatingObjectArray.prototype.add = function(item)
                {
                    var name = item.name();
                    if (name === keyword_null || name === keyword_undefined)
                    {
                        throw new Error(Sheets.SR.Exp_FloatingObjectNameEmptyError);
                    }
                    this._checkObjectExists(name);
                    item.owner(this._sheet);
                    this.push(item)
                };
                _FloatingObjectArray.prototype.remove = function(item)
                {
                    if (item !== keyword_null && item !== keyword_undefined)
                    {
                        var index = this._findItemIndex(item.name());
                        if (index >= 0)
                        {
                            item.owner(keyword_null)
                        }
                        this.splice(index, 1);
                        return true
                    }
                    return false
                };
                _FloatingObjectArray.prototype.addRows = function(row, rowCount)
                {
                    var i,
                        len;
                    for (i = 0, len = this.length; i < len; i++)
                    {
                        this[i].addRows(row, rowCount)
                    }
                };
                _FloatingObjectArray.prototype.removeRows = function(row, rowCount)
                {
                    var self = this;
                    var i,
                        len;
                    var removeItem = [];
                    for (i = 0, len = self.length; i < len; i++)
                    {
                        var floatingObject = self[i];
                        if (!self._isCoverRange(row, -1, row + rowCount - 1, self._sheet.getColumnCount(), floatingObject) || (!floatingObject.dynamicMove() && !floatingObject.dynamicSize()))
                        {
                            floatingObject.removeRows(row, rowCount)
                        }
                        else
                        {
                            removeItem.push(floatingObject)
                        }
                    }
                    for (i = 0, len = removeItem.length; i < len; i++)
                    {
                        self.remove(removeItem[i])
                    }
                };
                _FloatingObjectArray.prototype.addColumns = function(column, columnCount)
                {
                    var i,
                        len;
                    for (i = 0, len = this.length; i < len; i++)
                    {
                        this[i].addColumns(column, columnCount)
                    }
                };
                _FloatingObjectArray.prototype.removeColumns = function(column, columnCount)
                {
                    var self = this;
                    var i,
                        len;
                    var removeItem = [];
                    for (i = 0, len = self.length; i < len; i++)
                    {
                        var floatingObject = self[i];
                        if (!self._isCoverRange(-1, column, self._sheet.getRowCount(), column + columnCount - 1, floatingObject) || (!floatingObject.dynamicMove() && !floatingObject.dynamicSize()))
                        {
                            floatingObject.removeColumns(column, columnCount)
                        }
                        else
                        {
                            removeItem.push(floatingObject)
                        }
                    }
                    for (i = 0, len = removeItem.length; i < len; i++)
                    {
                        self.remove(removeItem[i])
                    }
                };
                _FloatingObjectArray.prototype._isCoverRange = function(row, column, endRow, endColumn, floatingObject)
                {
                    var fStartRow = floatingObject.startRow();
                    var fStartColumn = floatingObject.startColumn();
                    var fEndRow = floatingObject.endRow();
                    var fEndColumn = floatingObject.endColumn();
                    return row <= fStartRow && column <= fStartColumn && endRow >= fEndRow && endColumn >= fEndColumn
                };
                _FloatingObjectArray.prototype._checkObjectExists = function(name)
                {
                    if (this._sheet._findFloatingObjectInternal(name))
                    {
                        throw new Error(Sheets.SR.Exp_FloatingObjectHasSameNameError);
                    }
                };
                _FloatingObjectArray.prototype._findItemIndex = function(name)
                {
                    var len = this.length;
                    for (var i = 0; i < len; i++)
                    {
                        if (this[i].name() === name)
                        {
                            return i
                        }
                    }
                    return -1
                };
                _FloatingObjectArray.prototype._updateFloatingsObjectlayoutOnColumnRowChanged = function()
                {
                    for (var i = 0, len = this.length; i < len; i++)
                    {
                        var item = this[i];
                        if (item.dynamicMove())
                        {
                            item._updateFloatingObjectLocation()
                        }
                        else
                        {
                            item._updateStartPosition()
                        }
                        if (item.dynamicSize())
                        {
                            item._updateFloatingObjectSize()
                        }
                        else
                        {
                            item._updateEndPosition()
                        }
                    }
                };
                _FloatingObjectArray.prototype._bindEventsOnSheet = function()
                {
                    var self = this,
                        sheet = self._sheet;
                    if (!sheet)
                    {
                        return
                    }
                    $(window.document.body).scroll(function()
                    {
                        var activeSheet = sheet.parent.getActiveSheet(),
                            render = activeSheet._render,
                            floatingObjectArray = activeSheet._floatingObjectArray;
                        if (floatingObjectArray && floatingObjectArray.length > 0 && render)
                        {
                            render._paintFloatingObject(activeSheet._bounds)
                        }
                    });
                    sheet._bind(Sheets.Events.ColumnChanged, function(event, data)
                    {
                        var propertyName = data.propertyName;
                        if (propertyName === 'width' || propertyName === 'isVisible')
                        {
                            self._updateFloatingObjectsLayout()
                        }
                    });
                    sheet._bind(Sheets.Events.RowChanged, function(event, data)
                    {
                        var propertyName = data.propertyName;
                        if (propertyName === 'height' || propertyName === 'isVisible')
                        {
                            self._updateFloatingObjectsLayout()
                        }
                    });
                    sheet._bind(Sheets.Events.ColumnWidthChanged, function(event, data)
                    {
                        self._updateFloatingObjectsLayout()
                    });
                    sheet._bind(Sheets.Events.RowHeightChanged, function(event, data)
                    {
                        self._updateFloatingObjectsLayout()
                    })
                };
                _FloatingObjectArray.prototype._updateFloatingObjectsLayout = function()
                {
                    var self = this,
                        sheet = self._sheet,
                        render = sheet._render;
                    if (self.length > 0)
                    {
                        self.isNeedToUpdateLayout = true;
                        if (render)
                        {
                            render._paintFloatingObject(sheet._bounds)
                        }
                    }
                };
                _FloatingObjectArray.prototype.toJSON = function()
                {
                    var floatingObjects = this;
                    if (!floatingObjects || floatingObjects.length === 0)
                    {
                        return keyword_undefined
                    }
                    var jsonData = [];
                    for (var i = 0; i < floatingObjects.length; i++)
                    {
                        jsonData.push(floatingObjects[i].toJSON())
                    }
                    if (jsonData.length === 0)
                    {
                        return keyword_undefined
                    }
                    return jsonData
                };
                _FloatingObjectArray.prototype.fromJSON = function(jsData, isNoneSchema)
                {
                    var self = this;
                    if (!jsData || jsData.length === 0)
                    {
                        return
                    }
                    for (var i = 0; i < jsData.length; i++)
                    {
                        var item = jsData[i];
                        var floatingObject = keyword_null;
                        if (item)
                        {
                            var dict = self._getFloatingObjectTypes();
                            var floatingObjectClass = dict[item.floatingObjectType];
                            if (floatingObjectClass)
                            {
                                floatingObject = new floatingObjectClass;
                                floatingObject.owner(self._sheet);
                                floatingObject.fromJSON(item, isNoneSchema);
                                self.push(floatingObject)
                            }
                        }
                    }
                };
                _FloatingObjectArray.prototype._getFloatingObjectTypes = function()
                {
                    if (!this._floatingObjectType)
                    {
                        var dict = {};
                        dict[0] = CustomFloatingObject;
                        dict[1] = Picture;
                        this._floatingObjectType = dict
                    }
                    return this._floatingObjectType
                };
                return _FloatingObjectArray
            })(Sheets._XArray);
        Sheets._FloatingObjectArray = _FloatingObjectArray;
        var FloatingObject = (function()
            {
                function FloatingObject(name, x, y, width, height)
                {
                    this._cacheOffset = {
                        startRowOffset: keyword_undefined, startColumnOffset: keyword_undefined, endRowOffset: keyword_undefined, endColumnOffset: keyword_undefined
                    };
                    this._isFOColumnsOrRowsVisible = true;
                    var self = this;
                    self._name = name;
                    self._location = new Sheets.Rect((typeof x === 'number') ? x : 0, (typeof y === 'number') ? y : 0, (typeof width === 'number') ? width : 0, (typeof height === 'number') ? height : 0);
                    self._canPrint = true;
                    self._isLocked = true;
                    self._isVisible = true;
                    self._isSelected = false;
                    self._dynamicMove = true;
                    self._dynamicSize = true
                }
                FloatingObject.prototype.name = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._name
                    }
                    if (typeof value !== 'string' || value === '')
                    {
                        throw new Error(Sheets.SR.Exp_FloatingObjectNameEmptyError);
                    }
                    if (self._name !== value)
                    {
                        self._name = value;
                        self._trigger({
                            sheet: self._sheet, sheetName: self._sheet ? self._sheet._name : "", floatingObject: self, propertyName: "name"
                        })
                    }
                    return self
                };
                FloatingObject.prototype.owner = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._sheet
                    }
                    self._sheet = value;
                    self._updateFloatingObjectCoorinates();
                    return self
                };
                FloatingObject.prototype.isSelected = function(selected)
                {
                    var self = this,
                        sheet = self._sheet;
                    if (arguments.length === 0)
                    {
                        return self._isSelected
                    }
                    if (typeof selected === 'boolean' && self._isSelected !== selected)
                    {
                        if (sheet)
                        {
                            sheet._bindToAutoRefresh(function(value)
                            {
                                self._isSelected = value
                            })(selected)
                        }
                        else
                        {
                            self._isSelected = selected
                        }
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", floatingObject: self, propertyName: "isSelected"
                        })
                    }
                    return self
                };
                FloatingObject.prototype.isLocked = function(locked)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._isLocked
                    }
                    if (typeof locked === 'boolean' && self._isLocked !== locked)
                    {
                        self._isLocked = locked;
                        self._trigger({
                            sheet: self._sheet, sheetName: self._sheet ? self._sheet._name : "", floatingObject: self, propertyName: "islocked"
                        })
                    }
                    return self
                };
                FloatingObject.prototype.canPrint = function(canPrint)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._canPrint
                    }
                    if (typeof canPrint === 'boolean' && self._canPrint !== canPrint)
                    {
                        self._canPrint = canPrint;
                        self._trigger({
                            sheet: self._sheet, sheetName: self._sheet ? self._sheet._name : "", floatingObject: self, propertyName: "canPrint"
                        })
                    }
                    return self
                };
                FloatingObject.prototype.isVisible = function(isVisible)
                {
                    var self = this,
                        sheet = self._sheet;
                    if (arguments.length === 0)
                    {
                        return self._isVisible
                    }
                    if (typeof isVisible === 'boolean' && self._isVisible !== isVisible)
                    {
                        if (sheet)
                        {
                            sheet._bindToAutoRefresh(function(value)
                            {
                                self._isVisible = isVisible
                            })(isVisible)
                        }
                        else
                        {
                            self._isVisible = isVisible
                        }
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", floatingObject: self, propertyName: "visible"
                        })
                    }
                    return self
                };
                FloatingObject.prototype.position = function(position)
                {
                    var self = this,
                        sheet = self._sheet;
                    if (arguments.length === 0)
                    {
                        return new Sheets.Point(self._location.x, self._location.y)
                    }
                    if (position instanceof Sheets.Point)
                    {
                        if (self._location.x !== position.x || self._location.y !== position.y)
                        {
                            if (sheet)
                            {
                                sheet._bindToAutoRefresh(function(value)
                                {
                                    self._location.x = value.x;
                                    self._location.y = value.y;
                                    self._adjustPosition();
                                    self._updateCoverRange()
                                })(position)
                            }
                            else
                            {
                                self._location.x = position.x;
                                self._location.y = position.y
                            }
                            self._trigger({
                                sheet: sheet, sheetName: sheet ? sheet._name : "", floatingObject: self, propertyName: "position"
                            })
                        }
                    }
                    return self
                };
                FloatingObject.prototype.height = function(value)
                {
                    var self = this,
                        sheet = self._sheet;
                    if (arguments.length === 0)
                    {
                        return self._location.height
                    }
                    if (typeof value === 'number' && self._location.height !== value)
                    {
                        if (sheet)
                        {
                            sheet._bindToAutoRefresh(function(value)
                            {
                                self._location.height = value;
                                self._adjustSize();
                                self._adjustPosition();
                                self._updateCoverRange()
                            })(value)
                        }
                        else
                        {
                            self._location.height = value
                        }
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", floatingObject: self, propertyName: "height"
                        })
                    }
                    return self
                };
                FloatingObject.prototype.width = function(value)
                {
                    var self = this,
                        sheet = self._sheet;
                    if (arguments.length === 0)
                    {
                        return self._location.width
                    }
                    if (typeof value === 'number' && self._location.width !== value)
                    {
                        if (sheet)
                        {
                            sheet._bindToAutoRefresh(function(value)
                            {
                                self._location.width = value;
                                self._adjustSize();
                                self._adjustPosition();
                                self._updateCoverRange()
                            })(value)
                        }
                        else
                        {
                            self._location.width = value
                        }
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", floatingObject: self, propertyName: "width"
                        })
                    }
                    return self
                };
                FloatingObject.prototype.startRow = function(row)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._startRow
                    }
                    if (typeof row === 'number' && self._startRow !== row)
                    {
                        row = Math_ceil(row);
                        if (self._sheet)
                        {
                            self._sheet._bindToAutoRefresh(function(value)
                            {
                                self._startRow = value;
                                self._updateFloatingObjectLocation()
                            })(row)
                        }
                        else
                        {
                            self._startRow = row
                        }
                    }
                    return self
                };
                FloatingObject.prototype.startRowOffset = function(offset)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._startRowOffset
                    }
                    if (typeof offset === 'number' && self._startRowOffset !== offset)
                    {
                        if (self._sheet)
                        {
                            self._sheet._bindToAutoRefresh(function(value)
                            {
                                self._startRowOffset = value;
                                self._updateFloatingObjectLocation()
                            })(offset)
                        }
                        else
                        {
                            self._startRowOffset = offset
                        }
                    }
                    return self
                };
                FloatingObject.prototype.startColumn = function(column)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._startColumn
                    }
                    if (typeof column === 'number' && self._startColumn !== column)
                    {
                        column = Math_ceil(column);
                        if (self._sheet)
                        {
                            self._sheet._bindToAutoRefresh(function(value)
                            {
                                self._startColumn = value;
                                self._updateFloatingObjectLocation()
                            })(column)
                        }
                        else
                        {
                            self._startColumn = column
                        }
                    }
                    return self
                };
                FloatingObject.prototype.startColumnOffset = function(offset)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._startColumnOffset
                    }
                    if (typeof offset === 'number' && self._startColumnOffset !== offset)
                    {
                        if (self._sheet)
                        {
                            self._sheet._bindToAutoRefresh(function(value)
                            {
                                self._startColumnOffset = value;
                                self._updateFloatingObjectLocation()
                            })(offset)
                        }
                        else
                        {
                            self._startColumnOffset = offset
                        }
                    }
                    return self
                };
                FloatingObject.prototype.endRow = function(row)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._endRow
                    }
                    if (typeof row === 'number' && self._endRow !== row)
                    {
                        if (self._sheet)
                        {
                            self._sheet._bindToAutoRefresh(function(value)
                            {
                                self._endRow = value;
                                self._updateFloatingObjectSize()
                            })(row)
                        }
                        else
                        {
                            self._endRow = row
                        }
                    }
                    return self
                };
                FloatingObject.prototype.endRowOffset = function(offset)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._endRowOffset
                    }
                    if (typeof offset === 'number' && self._endRowOffset !== offset)
                    {
                        if (self._sheet)
                        {
                            self._sheet._bindToAutoRefresh(function(value)
                            {
                                self._endRowOffset = value;
                                self._updateFloatingObjectSize()
                            })(offset)
                        }
                        else
                        {
                            self._endRowOffset = offset
                        }
                    }
                    return self
                };
                FloatingObject.prototype.endColumn = function(column)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._endColumn
                    }
                    if (typeof column === 'number' && self._endColumn !== column)
                    {
                        column = Math_ceil(column);
                        if (self._sheet)
                        {
                            self._sheet._bindToAutoRefresh(function(value)
                            {
                                self._endColumn = value;
                                self._updateFloatingObjectSize()
                            })(column)
                        }
                        else
                        {
                            self._endColumn = column
                        }
                    }
                    return self
                };
                FloatingObject.prototype.endColumnOffset = function(offset)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._endColumnOffset
                    }
                    if (typeof offset === 'number' && self._endColumnOffset !== offset)
                    {
                        if (self._sheet)
                        {
                            self._sheet._bindToAutoRefresh(function(value)
                            {
                                self._endColumnOffset = value;
                                self._updateFloatingObjectSize()
                            })(offset)
                        }
                        else
                        {
                            self._endColumnOffset = offset
                        }
                    }
                    return self
                };
                FloatingObject.prototype.dynamicMove = function(isDynamicMove)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._dynamicMove
                    }
                    if (typeof isDynamicMove === 'boolean' && self._dynamicMove !== isDynamicMove)
                    {
                        self._dynamicMove = isDynamicMove;
                        if (!isDynamicMove)
                        {
                            self._dynamicSize = false
                        }
                        self._trigger({
                            sheet: self._sheet, sheetName: self._sheet ? self._sheet._name : "", floatingObject: self, propertyName: "dynamicMove"
                        })
                    }
                    return self
                };
                FloatingObject.prototype.dynamicSize = function(isDynamicSize)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._dynamicSize
                    }
                    if (typeof isDynamicSize === 'boolean' && self._dynamicSize !== isDynamicSize)
                    {
                        if (isDynamicSize && !self._dynamicMove)
                        {
                            isDynamicSize = false
                        }
                        self._dynamicSize = isDynamicSize;
                        self._trigger({
                            sheet: self._sheet, sheetName: self._sheet ? self._sheet._name : "", floatingObject: self, propertyName: "dynamicSize"
                        })
                    }
                    return self
                };
                FloatingObject.prototype.addRows = function(row, rowCount)
                {
                    var self = this;
                    row = Math_ceil(row);
                    rowCount = Math_ceil(rowCount);
                    if (row <= self.startRow())
                    {
                        if (self.dynamicMove())
                        {
                            self.startRow(self.startRow() + rowCount);
                            self.endRow(self.endRow() + rowCount)
                        }
                    }
                    else if (row > self.startRow() && row < self.endRow())
                    {
                        if (self.dynamicSize())
                        {
                            self.endRow(self.endRow() + rowCount)
                        }
                    }
                };
                FloatingObject.prototype.removeRows = function(row, rowCount)
                {
                    var self = this;
                    var bottomRemoveRow = row + rowCount - 1;
                    if (row <= self.startRow())
                    {
                        if (bottomRemoveRow < self.startRow())
                        {
                            if (self.dynamicMove())
                            {
                                self.startRow(self.startRow() - rowCount);
                                self.endRow(self.endRow() - rowCount)
                            }
                        }
                        else if (bottomRemoveRow < self.endRow())
                        {
                            var removeRowCount = bottomRemoveRow - self.startRow() + 1;
                            var newRowCount = (self.endRow() - self.startRow() + 1) - removeRowCount;
                            if (self.dynamicMove())
                            {
                                self.startRow(row);
                                self.startRowOffset(0)
                            }
                            if (self.dynamicSize())
                            {
                                self.endRow(row + newRowCount - 1)
                            }
                        }
                        else
                        {}
                    }
                    else if (row <= self.endRow())
                    {
                        if (bottomRemoveRow < self.endRow())
                        {
                            if (self.dynamicSize())
                            {
                                self.endRow(self.endRow() - rowCount)
                            }
                        }
                        else
                        {
                            if (self.dynamicSize())
                            {
                                self.endRow(row);
                                self.endRowOffset(0)
                            }
                        }
                    }
                };
                FloatingObject.prototype.addColumns = function(column, columnCount)
                {
                    var self = this;
                    column = Math_ceil(column);
                    columnCount = Math_ceil(columnCount);
                    if (column <= self.startColumn())
                    {
                        if (self.dynamicMove())
                        {
                            self.startColumn(self.startColumn() + columnCount);
                            self.endColumn(self.endColumn() + columnCount)
                        }
                    }
                    else if (column > self.startColumn() && column < self.endColumn())
                    {
                        if (self.dynamicSize())
                        {
                            self.endColumn(self.endColumn() + columnCount)
                        }
                    }
                };
                FloatingObject.prototype.removeColumns = function(column, columnCount)
                {
                    var self = this;
                    column = Math_ceil(column);
                    columnCount = Math_ceil(columnCount);
                    var rightRemovedColumn = column + columnCount - 1;
                    if (column <= self.startColumn())
                    {
                        if (rightRemovedColumn < self.startColumn())
                        {
                            if (self.dynamicMove())
                            {
                                self.startColumn(self.startColumn() - columnCount);
                                self.endColumn(self.endColumn() - columnCount)
                            }
                        }
                        else if (rightRemovedColumn < self.endColumn())
                        {
                            var removedColumnCount = rightRemovedColumn - self.startColumn() + 1;
                            var newColumnCount = (self.endColumn() - self.startColumn() + 1) - removedColumnCount;
                            if (self.dynamicMove())
                            {
                                self.startColumn(column);
                                self.startColumnOffset(0)
                            }
                            if (self.dynamicSize())
                            {
                                self.endColumn(column + newColumnCount - 1)
                            }
                        }
                        else
                        {}
                    }
                    else if (column <= self.endColumn())
                    {
                        if (rightRemovedColumn < self.endColumn())
                        {
                            if (self.dynamicSize())
                            {
                                self.endColumn(self.endColumn() - columnCount)
                            }
                        }
                        else
                        {
                            if (self.dynamicSize())
                            {
                                self.endColumn(column);
                                self.endColumnOffset(0)
                            }
                        }
                    }
                };
                FloatingObject.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"x":
                            return value === 0;
                        case"y":
                            return value === 0;
                        case"width":
                            return value === 0;
                        case"height":
                            return value === 0;
                        case"canPrint":
                            return value === true;
                        case"isSelected":
                            return value === false;
                        case"isLocked":
                            return value == true;
                        case"isVisible":
                            return value === true;
                        case"dynamicMove":
                            return value === true;
                        case"dynamicSize":
                            return value === true;
                        default:
                            return false
                    }
                };
                FloatingObject.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            name: self._name, x: self._location.x, y: self._location.y, width: self._location.width, height: self._location.height, canPrint: self._canPrint, isSelected: self._isSelected, isLocked: self._isLocked, isVisible: self._isVisible, dynamicMove: self._dynamicMove, dynamicSize: self._dynamicSize
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
                FloatingObject.prototype.fromJSON = function(jsData, isNoneSchema)
                {
                    if (!jsData)
                    {
                        return
                    }
                    var self = this;
                    self._name = jsData.name;
                    var jsonX = jsData.x !== keyword_undefined ? jsData.x : 0;
                    var jsonY = jsData.y !== keyword_undefined ? jsData.y : 0;
                    var jsonWidth = jsData.width !== keyword_undefined ? jsData.width : 0;
                    var jsonHeight = jsData.height !== keyword_undefined ? jsData.height : 0;
                    self._location = new Sheets.Rect(jsonX, jsonY, jsonWidth, jsonHeight);
                    if (jsData.canPrint !== keyword_undefined)
                    {
                        self._canPrint = jsData.canPrint
                    }
                    if (jsData.isSelected !== keyword_undefined)
                    {
                        self._isSelected = jsData.isSelected
                    }
                    if (jsData.isLocked !== keyword_undefined)
                    {
                        self._isLocked = jsData.isLocked
                    }
                    if (jsData.isVisible !== keyword_undefined)
                    {
                        self._isVisible = jsData.isVisible
                    }
                    if (jsData.dynamicMove !== keyword_undefined)
                    {
                        self._dynamicMove = jsData.dynamicMove
                    }
                    if (jsData.dynamicSize !== keyword_undefined)
                    {
                        self._dynamicSize = jsData.dynamicSize
                    }
                    self._updateCoverRange()
                };
                FloatingObject.prototype.clone = function()
                {
                    var floatingObject = new FloatingObject;
                    var jsonString = JSON.stringify(this.toJSON());
                    floatingObject.fromJSON(JSON.parse(jsonString));
                    return floatingObject
                };
                FloatingObject.prototype._adjustSize = function()
                {
                    var self = this;
                    var sheetHeight = self._getSheetHeight();
                    var sheetWidth = self._getSheetWidth();
                    if (self._location.width > sheetWidth)
                    {
                        self._location.width = sheetWidth
                    }
                    if (self._location.height > sheetHeight)
                    {
                        self._location.height = sheetHeight
                    }
                };
                FloatingObject.prototype._adjustPosition = function()
                {
                    var self = this;
                    var sheetHeight = self._getSheetHeight();
                    var sheetWidth = self._getSheetWidth();
                    var right = self._location.x + self._location.width;
                    if (right > sheetWidth)
                    {
                        self._location.x = sheetWidth - self._location.width
                    }
                    if (self._location.x < 0)
                    {
                        self._location.x = 0
                    }
                    var bottom = self._location.y + self._location.height;
                    if (bottom > sheetHeight)
                    {
                        self._location.y = sheetHeight - self._location.height
                    }
                    if (self._location.y < 0)
                    {
                        self._location.y = 0
                    }
                };
                FloatingObject.prototype._updateFloatingObjectCoorinates = function()
                {
                    var self = this;
                    self._adjustSize();
                    self._adjustPosition();
                    if (self._startRow !== keyword_null && self._startRow !== keyword_undefined && self._startColumn !== keyword_null && self._startColumn !== keyword_undefined)
                    {
                        if (!self._startRowOffset)
                        {
                            self._startRowOffset = 0
                        }
                        if (!self._startColumnOffset)
                        {
                            self._startColumnOffset = 0
                        }
                        self._updateFloatingObjectLocation()
                    }
                    else
                    {
                        self._updateStartPosition()
                    }
                    if (self._endColumn !== keyword_null && self._endColumn !== keyword_undefined && self._endRow !== keyword_null && self._endRow !== keyword_undefined)
                    {
                        if (!self._endRowOffset)
                        {
                            self._endRowOffset = 0
                        }
                        if (!self._endColumnOffset)
                        {
                            self._endColumnOffset = 0
                        }
                        self._updateFloatingObjectSize()
                    }
                    else
                    {
                        self._updateEndPosition()
                    }
                };
                FloatingObject.prototype._getSheetHeight = function()
                {
                    var self = this,
                        sheet = self._sheet;
                    if (sheet === keyword_null || sheet === keyword_undefined)
                    {
                        return MAX_NUMBER
                    }
                    var height = 0;
                    var rowCount = sheet.getRowCount();
                    for (var row = 0; row < rowCount; row++)
                    {
                        height += sheet.getRowHeight(row, 3)
                    }
                    return height
                };
                FloatingObject.prototype._getSheetWidth = function()
                {
                    var self = this,
                        sheet = self._sheet;
                    if (sheet === keyword_null || sheet === keyword_undefined)
                    {
                        return MAX_NUMBER
                    }
                    var width = 0;
                    var columnCount = sheet.getColumnCount();
                    for (var column = 0; column < columnCount; column++)
                    {
                        width += sheet.getColumnWidth(column, 3)
                    }
                    return width
                };
                FloatingObject.prototype._updateStartRowOffset = function()
                {
                    var self = this;
                    var startRowOffset = self._startRowOffset,
                        startRowHeight = self._sheet.getRowHeight(self.startRow(), 3),
                        cacheOffset = self._cacheOffset;
                    if (startRowHeight > 0)
                    {
                        startRowHeight--
                    }
                    if (startRowOffset > startRowHeight)
                    {
                        if (!cacheOffset.startRowOffset)
                        {
                            cacheOffset.startRowOffset = startRowOffset
                        }
                        self._startRowOffset = startRowHeight
                    }
                    else if (cacheOffset.startRowOffset)
                    {
                        if (cacheOffset.startRowOffset < startRowHeight)
                        {
                            self._startRowOffset = cacheOffset.startRowOffset;
                            cacheOffset.startRowOffset = keyword_undefined
                        }
                        else if (startRowHeight < cacheOffset.startRowOffset)
                        {
                            self._startRowOffset = startRowHeight
                        }
                    }
                };
                FloatingObject.prototype._updateStartColumnOffset = function()
                {
                    var self = this;
                    var startColumnOffset = self._startColumnOffset,
                        startColumnWidth = self._sheet.getColumnWidth(self.startColumn(), 3),
                        cacheOffset = self._cacheOffset;
                    if (startColumnWidth > 0)
                    {
                        startColumnWidth--
                    }
                    if (startColumnOffset > startColumnWidth)
                    {
                        if (!cacheOffset.startColumnOffset)
                        {
                            cacheOffset.startColumnOffset = startColumnOffset
                        }
                        self._startColumnOffset = startColumnWidth
                    }
                    else if (cacheOffset.startColumnOffset)
                    {
                        if (cacheOffset.startColumnOffset < startColumnWidth)
                        {
                            self._startColumnOffset = cacheOffset.startColumnOffset;
                            cacheOffset.startColumnOffset = keyword_undefined
                        }
                        else if (startColumnOffset < cacheOffset.startColumnOffset)
                        {
                            self._startColumnOffset = startColumnWidth
                        }
                    }
                };
                FloatingObject.prototype._updateEndRowOffset = function()
                {
                    var self = this;
                    var endRowOffset = self._endRowOffset,
                        endRowHeight = self._sheet.getRowHeight(self.endRow(), 3),
                        cacheOffset = self._cacheOffset;
                    if (endRowHeight > 0)
                    {
                        endRowHeight--
                    }
                    if (endRowOffset > endRowHeight)
                    {
                        if (!cacheOffset.endRowOffset)
                        {
                            cacheOffset.endRowOffset = endRowOffset
                        }
                        self._endRowOffset = endRowHeight
                    }
                    else if (cacheOffset.endRowOffset)
                    {
                        if (cacheOffset.endRowOffset < endRowHeight)
                        {
                            self._endRowOffset = cacheOffset.endRowOffset;
                            cacheOffset.endRowOffset = keyword_undefined
                        }
                        else if (endRowOffset < cacheOffset.endRowOffset)
                        {
                            self._endRowOffset = endRowHeight
                        }
                    }
                };
                FloatingObject.prototype._updateEndColumnOffset = function()
                {
                    var self = this;
                    var endColumnOffset = self._endColumnOffset,
                        endColumnWidth = self._sheet.getColumnWidth(self.endColumn(), 3),
                        cacheOffset = self._cacheOffset;
                    if (endColumnWidth > 0)
                    {
                        endColumnWidth--
                    }
                    if (endColumnOffset > endColumnWidth)
                    {
                        if (!cacheOffset.endColumnOffset)
                        {
                            cacheOffset.endColumnOffset = endColumnOffset
                        }
                        self._endColumnOffset = endColumnWidth
                    }
                    else if (cacheOffset.endColumnOffset)
                    {
                        if (cacheOffset.endColumnOffset < endColumnWidth)
                        {
                            self._endColumnOffset = cacheOffset.endColumnOffset;
                            cacheOffset.endColumnOffset = keyword_undefined
                        }
                        else if (endColumnOffset < cacheOffset.endColumnOffset)
                        {
                            self._endColumnOffset = endColumnWidth
                        }
                    }
                };
                FloatingObject.prototype._updateFloatingObjectLocation = function()
                {
                    var self = this,
                        sheet = self._sheet;
                    if (sheet === keyword_null || sheet === keyword_undefined)
                    {
                        return
                    }
                    var newY = 0,
                        startRow = self.startRow();
                    for (var row = 0; row < startRow; row++)
                    {
                        newY += sheet.getRowHeight(row, 3)
                    }
                    self._updateStartRowOffset();
                    newY += self._startRowOffset;
                    var newX = 0,
                        startColumn = self.startColumn();
                    for (var column = 0; column < startColumn; column++)
                    {
                        newX += sheet.getColumnWidth(column, 3)
                    }
                    self._updateStartColumnOffset();
                    newX += self._startColumnOffset;
                    if (self._location.x !== newX || self._location.y !== newY)
                    {
                        self._location.x = newX;
                        self._location.y = newY;
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", floatingObject: self, propertyName: "location"
                        })
                    }
                };
                FloatingObject.prototype._updateFloatingObjectSize = function()
                {
                    var self = this,
                        sheet = self._sheet;
                    if (sheet === keyword_null || sheet === keyword_undefined)
                    {
                        return
                    }
                    if (self._isFOColumnsOrRowsVisible === false)
                    {
                        self._isVisible = true;
                        self._isFOColumnsOrRowsVisible = true
                    }
                    var newHeight = 0,
                        startRow = self.startRow(),
                        endRow = self.endRow();
                    for (var row = startRow; row < endRow; row++)
                    {
                        newHeight += sheet.getRowHeight(row, 3)
                    }
                    var totalRowHeight = newHeight + sheet.getRowHeight(endRow, 3);
                    if (totalRowHeight === 0 && self._isVisible === true)
                    {
                        self._isVisible = false;
                        self._isFOColumnsOrRowsVisible = false
                    }
                    if (startRow === endRow)
                    {
                        self._updateEndRowOffset();
                        newHeight = self.endRowOffset() - self.startRowOffset()
                    }
                    else
                    {
                        var startRowHeight = sheet.getRowHeight(startRow, 3);
                        if (startRowHeight > 0)
                        {
                            newHeight -= self._startRowOffset
                        }
                        self._updateEndRowOffset();
                        newHeight += self._endRowOffset
                    }
                    var newWidth = 0,
                        startColumn = self.startColumn(),
                        endColumn = self.endColumn();
                    for (var column = startColumn; column < endColumn; column++)
                    {
                        newWidth += sheet.getColumnWidth(column, 3)
                    }
                    var totalColumnWidth = newWidth + sheet.getColumnWidth(endColumn, 3);
                    if (totalColumnWidth === 0 && self._isVisible === true)
                    {
                        self._isVisible = false;
                        self._isFOColumnsOrRowsVisible = false
                    }
                    if (startColumn === endColumn)
                    {
                        self._updateEndColumnOffset();
                        newWidth = self.endColumnOffset() - self.startColumnOffset()
                    }
                    else
                    {
                        var startColumnWidth = sheet.getColumnWidth(startColumn, 3);
                        if (startColumnWidth > 0)
                        {
                            newWidth -= self._startColumnOffset
                        }
                        self._updateEndColumnOffset();
                        newWidth += self._endColumnOffset
                    }
                    if (newWidth < 0)
                    {
                        newWidth = 0
                    }
                    if (newHeight < 0)
                    {
                        newHeight = 0
                    }
                    if (self._location.width !== newWidth)
                    {
                        self._location.width = newWidth;
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", floatingObject: self, propertyName: "width"
                        })
                    }
                    if (self._location.height !== newHeight)
                    {
                        self._location.height = newHeight;
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", floatingObject: self, propertyName: "height"
                        })
                    }
                };
                FloatingObject.prototype._updateStartPosition = function()
                {
                    var self = this,
                        sheet = self._sheet;
                    if (sheet === keyword_null || sheet === keyword_undefined)
                    {
                        return
                    }
                    var rowInfo = self._calcAnchorRow(self._location.y);
                    self._startRow = rowInfo.row;
                    self._startRowOffset = rowInfo.offsetY;
                    if (self._startRowOffset === -1)
                    {
                        self._startRow += 1;
                        self._startRowOffset = 0;
                        var rowCount = sheet.getRowCount();
                        if (self._startRow === rowCount)
                        {
                            self._startRow = rowCount - 1
                        }
                    }
                    var colInfo = self._calcAnchorColumn(self._location.x);
                    self._startColumn = colInfo.column;
                    self._startColumnOffset = colInfo.offsetX;
                    if (self._startColumnOffset === -1)
                    {
                        self._startColumn += 1;
                        self._startColumnOffset = 0;
                        var columnCount = sheet.getColumnCount();
                        if (self._startColumn === columnCount)
                        {
                            self._startColumn = columnCount - 1
                        }
                    }
                };
                FloatingObject.prototype._updateEndPosition = function()
                {
                    var self = this;
                    if (self._sheet === keyword_null || self._sheet === keyword_undefined)
                    {
                        return
                    }
                    var rowInfo = self._calcAnchorRow(self._location.y + self._location.height);
                    self._endRow = rowInfo.row;
                    self._endRowOffset = rowInfo.offsetY;
                    var colInfo = self._calcAnchorColumn(self._location.x + self._location.width);
                    self._endColumn = colInfo.column;
                    self._endColumnOffset = colInfo.offsetX
                };
                FloatingObject.prototype._updateCoverRange = function()
                {
                    this._updateStartPosition();
                    this._updateEndPosition()
                };
                FloatingObject.prototype._calcAnchorRow = function(y)
                {
                    var totalHeight = 0;
                    var offsetY = 0;
                    var rowCount = this._sheet.getRowCount();
                    for (var row = 0; row < rowCount; row++)
                    {
                        var rowHeight = this._sheet.getRowHeight(row, 3);
                        totalHeight += rowHeight;
                        var offset = totalHeight - y;
                        if (offset > 0)
                        {
                            offsetY = offset > 0 ? rowHeight - offset : -1;
                            return {
                                    row: row, offsetY: offsetY
                                }
                        }
                        else if (offset === 0)
                        {
                            offsetY = 0;
                            return {
                                    row: row + 1, offsetY: 0
                                }
                        }
                    }
                    return {
                            row: rowCount - 1, offsetY: 0
                        }
                };
                FloatingObject.prototype._calcAnchorColumn = function(x)
                {
                    var totalWidth = 0;
                    var offsetX = 0;
                    var columnCount = this._sheet.getColumnCount();
                    for (var column = 0; column < columnCount; column++)
                    {
                        var columnWidth = this._sheet.getColumnWidth(column, 3);
                        totalWidth += columnWidth;
                        var offset = totalWidth - x;
                        if (offset > 0)
                        {
                            offsetX = offset > 0 ? columnWidth - offset : -1;
                            return {
                                    column: column, offsetX: offsetX
                                }
                        }
                        else if (offset === 0)
                        {
                            offsetX = 0;
                            return {
                                    column: column + 1, offsetX: 0
                                }
                        }
                    }
                    return {
                            column: columnCount - 1, offsetX: 0
                        }
                };
                FloatingObject.prototype._trigger = function(args)
                {
                    if (this._sheet)
                    {
                        this._sheet.triggerFloatingObjectChanged(args);
                        if (args.propertyName === "isSelected")
                        {
                            var selectionArgs = {
                                    sheet: args.sheet, sheetName: args.sheetName, floatingObject: args.floatingObject
                                };
                            this._sheet.triggerFloatingObjectSelectionChanged(selectionArgs)
                        }
                    }
                };
                FloatingObject.prototype._createContentContainer = function()
                {
                    var content = document.createElement("div");
                    var $content = $(content).addClass(CSS_CLASS_FLOATINGOBJECT_CONTENT_CONTAINER).addClass(CSS_CLASS_NONE_USER_SELECT).css(CSS_POSITION, CSS_POSITION_ABSOLUTE);
                    $content.css(CSS_BACKGROUND_COLOR, BACKGROUND_COLOR);
                    return content
                };
                return FloatingObject
            })();
        Sheets.FloatingObject = FloatingObject;
        var CustomFloatingObject = (function(_super)
            {
                __extends(CustomFloatingObject, _super);
                function CustomFloatingObject(name, x, y, width, height)
                {
                    _super.call(this, name, x, y, width, height);
                    this._content = keyword_null
                }
                CustomFloatingObject.prototype.Content = function(content)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._content
                    }
                    if (self.owner())
                    {
                        self.owner()._bindToAutoRefresh(function(value)
                        {
                            self._content = value
                        })(content)
                    }
                    else
                    {
                        self._content = content
                    }
                    self._trigger({
                        sheet: self.owner(), sheetName: self.owner() ? self.owner()._name : "", customFloatingObject: self, propertyName: "content"
                    })
                };
                CustomFloatingObject.prototype.toJSON = function()
                {
                    var result = _super.prototype.toJSON.call(this);
                    result["floatingObjectType"] = 0;
                    var html = $("<div></div>").append(this.cloneContent()).html();
                    result["content"] = html;
                    return result
                };
                CustomFloatingObject.prototype.fromJSON = function(jsData, isNoneSchema)
                {
                    if (!jsData)
                    {
                        return
                    }
                    _super.prototype.fromJSON.call(this, jsData, isNoneSchema);
                    if (jsData.content)
                    {
                        this._content = $(jsData.content).get(0)
                    }
                };
                CustomFloatingObject.prototype.clone = function()
                {
                    var customFloatingObject = new CustomFloatingObject;
                    var jsonString = JSON.stringify(this.toJSON());
                    customFloatingObject.fromJSON(JSON.parse(jsonString));
                    customFloatingObject._content = this.cloneContent();
                    return customFloatingObject
                };
                CustomFloatingObject.prototype.cloneContent = function()
                {
                    if (this._content)
                    {
                        return $(this._content).clone().filter('*').removeAttr('id').get(0)
                    }
                    return keyword_null
                };
                CustomFloatingObject.prototype._createContentContainer = function()
                {
                    var content = document.createElement("div");
                    var $content = $(content).addClass(CSS_CLASS_FLOATINGOBJECT_CONTENT_CONTAINER).addClass(CSS_CLASS_NONE_USER_SELECT).css(CSS_POSITION, CSS_POSITION_ABSOLUTE);
                    var child = this.cloneContent(),
                        cssWidth = CSS_PERCENT_100,
                        cssHeight = CSS_PERCENT_100,
                        styleWidth = '',
                        styleHeight = '';
                    if (child && child.style)
                    {
                        styleWidth = child.style.width,
                        styleHeight = child.style.height
                    }
                    if (styleWidth !== '')
                    {
                        cssWidth = styleWidth
                    }
                    if (styleHeight !== '')
                    {
                        cssHeight = styleHeight
                    }
                    if (child !== keyword_null)
                    {
                        var $child = $(child).css({
                                width: cssWidth, height: cssHeight
                            }).addClass(CSS_CLASS_FLOATINGOBJECT_BACKGROUND_COVER).addClass(CSS_CLASS_NONE_USER_SELECT).appendTo(content)
                    }
                    else
                    {
                        $content.css(CSS_BACKGROUND_COLOR, BACKGROUND_COLOR)
                    }
                    return content
                };
                return CustomFloatingObject
            })(FloatingObject);
        Sheets.CustomFloatingObject = CustomFloatingObject;
        var Picture = (function(_super)
            {
                __extends(Picture, _super);
                function Picture(name, src, x, y, width, height)
                {
                    _super.call(this, name, x, y, width, height);
                    var self = this;
                    self._pictureStretch = 0;
                    self._borderWidth = 1;
                    self._borderStyle = "none";
                    self._borderColor = keyword_null;
                    self._borderRadius = -1;
                    self._backColor = keyword_null;
                    self._imageLoader = keyword_null;
                    self._isImageLoaded = false;
                    self._isTakeOriginalSize = false;
                    if (typeof src === 'string')
                    {
                        self.src(src)
                    }
                }
                Picture.prototype._trigger = function(args)
                {
                    if (this.owner())
                    {
                        if (args && args.floatingObject)
                        {
                            args.picture = args.floatingObject;
                            delete args.floatingObject
                        }
                        this.owner().triggerPictureChanged(args);
                        if (args.propertyName === "isSelected")
                        {
                            var selectionArgs = {
                                    sheet: args.sheet, sheetName: args.sheetName, picture: args.picture
                                };
                            this.owner().triggerPictureSelectionChanged(selectionArgs)
                        }
                    }
                };
                Picture.prototype.backColor = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._backColor
                    }
                    if (typeof value === 'string' && self._backColor !== value)
                    {
                        var sheet = self.owner();
                        if (sheet)
                        {
                            sheet._bindToAutoRefresh(function(color)
                            {
                                self._backColor = color
                            })(value)
                        }
                        else
                        {
                            self._backColor = value
                        }
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", picture: self, propertyName: "backColor"
                        })
                    }
                    return self
                };
                Picture.prototype.borderRadius = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._borderRadius
                    }
                    if (typeof value === 'number' && !isNaN(value) && self._borderRadius !== value)
                    {
                        var sheet = self.owner();
                        if (sheet)
                        {
                            sheet._bindToAutoRefresh(function(radius)
                            {
                                self._borderRadius = radius
                            })(value)
                        }
                        else
                        {
                            self._borderRadius = value
                        }
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", picture: self, propertyName: "borderRadius"
                        })
                    }
                    return self
                };
                Picture.prototype.borderWidth = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._borderWidth
                    }
                    if (typeof value === 'number' && !isNaN(value) && self._borderWidth !== value)
                    {
                        var sheet = self.owner();
                        if (sheet)
                        {
                            sheet._bindToAutoRefresh(function(width)
                            {
                                self._borderWidth = width
                            })(value)
                        }
                        else
                        {
                            self._borderWidth = value
                        }
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", picture: self, propertyName: "borderWidth"
                        })
                    }
                    return self
                };
                Picture.prototype.borderStyle = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._borderStyle
                    }
                    if (typeof value === 'string' && self._borderStyle !== value)
                    {
                        var sheet = self.owner();
                        if (sheet)
                        {
                            sheet._bindToAutoRefresh(function(style)
                            {
                                self._borderStyle = style
                            })(value)
                        }
                        else
                        {
                            self._borderStyle = value
                        }
                        if (!self._isBorderStyleWork(value))
                        {
                            self._borderWidth = 0
                        }
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", picture: self, propertyName: "borderStyle"
                        })
                    }
                    return self
                };
                Picture.prototype.borderColor = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._borderColor
                    }
                    if (typeof value === 'string' && self._borderColor !== value)
                    {
                        var sheet = self.owner();
                        if (sheet)
                        {
                            sheet._bindToAutoRefresh(function(color)
                            {
                                self._borderColor = color
                            })(value)
                        }
                        else
                        {
                            self._borderColor = value
                        }
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", picture: self, propertyName: "borderColor"
                        })
                    }
                    return self
                };
                Picture.prototype.pictureStretch = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._pictureStretch
                    }
                    if (self._pictureStretch !== value && Sheets.ImageLayout[value] !== keyword_undefined)
                    {
                        var sheet = self.owner();
                        if (sheet)
                        {
                            sheet._bindToAutoRefresh(function(stretch)
                            {
                                self._pictureStretch = stretch
                            })(value)
                        }
                        else
                        {
                            self._pictureStretch = value
                        }
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", picture: self, propertyName: "pictureStretch"
                        })
                    }
                    return self
                };
                Picture.prototype.getOriginalWidth = function()
                {
                    return this._originalWidth
                };
                Picture.prototype.getOriginalHeight = function()
                {
                    return this._originalHeight
                };
                Picture.prototype.src = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._src
                    }
                    if (typeof value === 'string' && self._src !== value)
                    {
                        var sheet = self.owner();
                        if (sheet)
                        {
                            sheet._bindToAutoRefresh(function(src)
                            {
                                self._src = src
                            })(value)
                        }
                        else
                        {
                            self._src = value
                        }
                        self._trigger({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", picture: self, propertyName: "src"
                        });
                        self._isImageLoaded = false;
                        self._loadImage()
                    }
                    return self
                };
                Picture.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"backColor":
                            return value === keyword_null;
                        case"borderRadius":
                            return value === -1;
                        case"borderWidth":
                            return value === 1;
                        case"borderStyle":
                            return value === "none";
                        case"borderColor":
                            return value === keyword_null;
                        case"pictureStretch":
                            return value === 0
                    }
                    return _super.prototype._isDefaultValue.call(this, propertyName, value)
                };
                Picture.prototype.toJSON = function()
                {
                    var self = this;
                    var result = _super.prototype.toJSON.call(this);
                    result["src"] = self._src;
                    result["floatingObjectType"] = 1;
                    result["backColor"] = self._backColor;
                    result["borderRadius"] = self._borderRadius;
                    result["borderWidth"] = self._borderWidth;
                    result["borderStyle"] = self._borderStyle;
                    result["borderColor"] = self._borderColor;
                    result["pictureStretch"] = self._pictureStretch;
                    var settings = {};
                    for (var item in result)
                    {
                        var value = result[item];
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
                Picture.prototype.fromJSON = function(jsData, isNoneSchema)
                {
                    if (!jsData)
                    {
                        return
                    }
                    var self = this;
                    _super.prototype.fromJSON.call(this, jsData, isNoneSchema);
                    if (jsData.src)
                    {
                        self._src = jsData.src;
                        self._isImageLoaded = false;
                        self._loadImage();
                        if (jsData.backColor !== keyword_undefined)
                        {
                            self._backColor = jsData.backColor
                        }
                        if (jsData.borderRadius !== keyword_undefined)
                        {
                            self._borderRadius = jsData.borderRadius
                        }
                        if (jsData.borderWidth !== keyword_undefined)
                        {
                            self._borderWidth = jsData.borderWidth
                        }
                        if (jsData.borderStyle !== keyword_undefined)
                        {
                            self._borderStyle = jsData.borderStyle
                        }
                        if (jsData.borderColor !== keyword_undefined)
                        {
                            self._borderColor = jsData.borderColor
                        }
                        if (jsData.pictureStretch !== keyword_undefined)
                        {
                            self._pictureStretch = jsData.pictureStretch
                        }
                    }
                };
                Picture.prototype.clone = function()
                {
                    var picture = new Picture;
                    var jsonString = JSON.stringify(this.toJSON());
                    picture.fromJSON(JSON.parse(jsonString));
                    return picture
                };
                Picture.prototype._isBorderStyleWork = function(style)
                {
                    switch (style)
                    {
                        case'dotted':
                        case'dashed':
                        case'solid':
                        case'double':
                        case'groove':
                        case'ridge':
                        case'inset':
                        case'outset':
                            return true;
                        default:
                            return false
                    }
                };
                Picture.prototype._loadImage = function()
                {
                    var self = this;
                    var src = self._src;
                    if (!self._imageLoader)
                    {
                        self._imageLoader = new Sheets._GcImageLoader(function()
                        {
                            self._loadImage()
                        })
                    }
                    try
                    {
                        if (self._imageLoader.getState(src))
                        {
                            self._isImageLoaded = true;
                            var img = self._imageLoader.getImage(src);
                            self._originalWidth = img.width;
                            self._originalHeight = img.height;
                            if (self._isTakeOriginalSize)
                            {
                                self.width(self._originalWidth);
                                self.height(self._originalHeight);
                                self._isTakeOriginalSize = false
                            }
                            var sheet = self.owner();
                            if (sheet)
                            {
                                sheet.repaint()
                            }
                        }
                        else
                        {
                            self._imageLoader.addImage(src)
                        }
                    }
                    catch(ex) {}
                };
                Picture.prototype._createContentContainer = function()
                {
                    var content = document.createElement("div");
                    var $content = $(content).addClass(CSS_CLASS_FLOATINGOBJECT_CONTENT_CONTAINER).addClass(CSS_CLASS_NONE_USER_SELECT).css(CSS_POSITION, CSS_POSITION_ABSOLUTE);
                    return content
                };
                return Picture
            })(FloatingObject);
        Sheets.Picture = Picture;
        var _FloatingObjectRender = (function()
            {
                function _FloatingObjectRender(floatingObject, sheet)
                {
                    this._srcCache = "";
                    var self = this;
                    self._floatingObject = floatingObject;
                    self.name = self._floatingObject.name();
                    self._sheet = sheet;
                    self._isMouseCapture = false
                }
                _FloatingObjectRender.prototype.floatingObject = function()
                {
                    return this._floatingObject
                };
                _FloatingObjectRender.prototype.render = function(containerRect, contentRect)
                {
                    var self = this;
                    var isCustomFloatingObjectCreate = false;
                    self._rect = containerRect;
                    if (!self._floatingObjectContainerDiv)
                    {
                        self._floatingObjectContainerDiv = self._createFloatingObjectContainer(self._floatingObject.name());
                        var tempSpread = self._sheet.parent;
                        if (tempSpread)
                        {
                            self._containerDiv = tempSpread._getContainerDiv();
                            if (self._containerDiv)
                            {
                                $(self._containerDiv).append(self._floatingObjectContainerDiv)
                            }
                        }
                    }
                    if (!self._floatingObjectContentDiv)
                    {
                        self._floatingObjectContentDiv = self._floatingObject._createContentContainer();
                        if (typeof self._floatingObject.borderWidth === 'function')
                        {
                            self._borderDiv = document.createElement("div");
                            $(self._borderDiv).addClass(CSS_CLASS_NONE_USER_SELECT + " " + CSS_CLASS_FLOATINGOBJECT_CONTENT_CONTAINER);
                            self._floatingObjectContainerDiv.appendChild(self._borderDiv);
                            self._borderDiv.appendChild(self._floatingObjectContentDiv)
                        }
                        else
                        {
                            self._floatingObjectContainerDiv.appendChild(self._floatingObjectContentDiv);
                            isCustomFloatingObjectCreate = true
                        }
                    }
                    if (self._borderDiv)
                    {
                        self._applyBorderStyle(contentRect, containerRect);
                        contentRect.x = 0;
                        contentRect.y = 0
                    }
                    var $container = $(self._floatingObjectContainerDiv);
                    var $content = $(self._floatingObjectContentDiv);
                    $container.css({
                        top: containerRect.y, left: containerRect.x, width: containerRect.width, height: containerRect.height
                    });
                    $content.css({
                        top: contentRect.y, left: contentRect.x, width: contentRect.width, height: contentRect.height
                    });
                    if (self._borderDiv)
                    {
                        self._paintImage()
                    }
                    if (self._floatingObject.isSelected())
                    {
                        $content.removeClass(CSS_CLASS_FLOATINGOBJECT_UNSELECTED).addClass(CSS_CLASS_FLOATINGOBJECT_SELECTED);
                        self._showResizeIndicator($container)
                    }
                    else
                    {
                        $content.removeClass(CSS_CLASS_FLOATINGOBJECT_SELECTED).addClass(CSS_CLASS_FLOATINGOBJECT_UNSELECTED);
                        self._hideResizeIndicator($container)
                    }
                    if (isCustomFloatingObjectCreate)
                    {
                        var sheet = self._sheet,
                            element = $(self._floatingObjectContentDiv).children()[0];
                        sheet.triggerCustomFloatingObjectLoaded({
                            sheet: sheet, sheetName: sheet._name, customFloatingObject: self._floatingObject, element: element
                        })
                    }
                };
                _FloatingObjectRender.prototype.setFloatingObjectZIndex = function(zIndex)
                {
                    $(this._floatingObjectContainerDiv).css('z-index', zIndex)
                };
                _FloatingObjectRender.prototype.getFloatingObjectZIndex = function()
                {
                    var zIndex = parseInt($(this._floatingObjectContainerDiv).css('z-index'));
                    if (isNaN(zIndex))
                    {
                        return -1
                    }
                    else
                    {
                        return zIndex
                    }
                };
                _FloatingObjectRender.prototype._paintImage = function()
                {
                    var self = this;
                    var floatingObject = self._floatingObject;
                    var src = floatingObject.src();
                    var stretch = floatingObject.pictureStretch();
                    var backColor = Sheets._ThemeContext.getColor(floatingObject.owner(), floatingObject.backColor());
                    if (!src || !self._floatingObjectContentDiv)
                    {
                        return
                    }
                    var content = $(self._floatingObjectContentDiv);
                    if (self._srcCache !== src)
                    {
                        self._srcCache = src;
                        content.css("background-image", "url('" + src + "')").css("background-repeat", "no-repeat")
                    }
                    content.css("background-color", backColor);
                    if (stretch === keyword_null || stretch === keyword_undefined)
                    {
                        return
                    }
                    if (floatingObject._isImageLoaded)
                    {
                        var imgWidth = floatingObject.getOriginalWidth(),
                            imgHeight = floatingObject.getOriginalHeight(),
                            contentWidth = content.width(),
                            contentHeight = content.height();
                        Sheets.util._applyBackgroundImageLayout(self._floatingObjectContentDiv, contentWidth, contentHeight, imgWidth, imgHeight, stretch)
                    }
                };
                _FloatingObjectRender.prototype._applyBorderStyle = function(contentRect, containerRect)
                {
                    var borderDiv = this._borderDiv,
                        floatingObject = this._floatingObject,
                        borderWidth = floatingObject.borderWidth(),
                        borderStyle = floatingObject.borderStyle(),
                        borderColor = Sheets._ThemeContext.getColor(floatingObject.owner(), floatingObject.borderColor()),
                        borderRadius = floatingObject.borderRadius(),
                        gapSize = 0,
                        gapStripSize = Math_floor(_FloatingObjectRender._resizeIndicatorSize / 2 + 1);
                    if (!floatingObject._isBorderStyleWork(borderStyle))
                    {
                        borderWidth = 0
                    }
                    if (borderWidth < gapStripSize)
                    {
                        gapSize = gapStripSize - borderWidth
                    }
                    var left = gapSize,
                        top = gapSize,
                        bottom = gapSize,
                        right = gapSize;
                    gapStripSize = Math_max(borderWidth, gapStripSize);
                    if (contentRect.x < 0)
                    {
                        left += contentRect.x - gapStripSize
                    }
                    else
                    {
                        if (contentRect.x < gapStripSize)
                        {
                            left += contentRect.x - gapStripSize
                        }
                        else
                        {
                            left += 0
                        }
                        right = containerRect.width - left - contentRect.width - 2 - 2 * borderWidth
                    }
                    if (contentRect.y < 0)
                    {
                        top += contentRect.y - gapStripSize
                    }
                    else
                    {
                        if (contentRect.y < gapStripSize)
                        {
                            top += contentRect.y - gapStripSize
                        }
                        else
                        {
                            top += 0
                        }
                        bottom = containerRect.height - top - contentRect.height - 2 - 2 * borderWidth
                    }
                    $(borderDiv).css({
                        position: "absolute", left: left, top: top, bottom: bottom, right: right, "border-width": borderWidth, "border-style": borderStyle, "border-color": borderColor, "border-radius": borderRadius
                    })
                };
                _FloatingObjectRender.prototype._dispose = function()
                {
                    var self = this;
                    if (self._touchManager)
                    {
                        self._touchManager.detach()
                    }
                    if (self._floatingObjectContainerDiv)
                    {
                        $(self._floatingObjectContainerDiv).remove();
                        self._floatingObjectContainerDiv = keyword_null
                    }
                    if (self._moveResizeContainerDiv)
                    {
                        $(self._moveResizeContainerDiv).remove();
                        self._moveResizeContainerDiv = keyword_null
                    }
                };
                _FloatingObjectRender.prototype._showResizeIndicator = function(container)
                {
                    var $indicators = $(CSS_SELECTOR_RESIZE_INDICATOR, container);
                    $indicators.removeClass(CSS_CLASS_RESIZE_INDICATOR_UNSELECT);
                    var self = this,
                        containerBounds = self._getHTMLElementBounds(self._floatingObjectContainerDiv),
                        contentDiv = self._floatingObjectContentDiv,
                        floatingObject = self._floatingObject;
                    if (self._borderDiv)
                    {
                        contentDiv = self._borderDiv
                    }
                    var contentBounds = self._getHTMLElementBounds(contentDiv),
                        leftOffset = contentBounds.x,
                        topOffset = contentBounds.y,
                        bottomOffset = containerBounds.height - contentBounds.y - contentBounds.height,
                        rightOffset = containerBounds.width - contentBounds.x - contentBounds.width,
                        position = 0,
                        resizeIndicatorSize = _FloatingObjectRender._resizeIndicatorSize,
                        resizeIndicatorSizeWithBorder = resizeIndicatorSize + 2,
                        gapStripSize = Math_floor(resizeIndicatorSize / 2 + 1);
                    if (typeof floatingObject.borderWidth === 'function')
                    {
                        var borderWidth = floatingObject.borderWidth(),
                            borderStyle = floatingObject.borderStyle();
                        if (!floatingObject._isBorderStyleWork(borderStyle))
                        {
                            borderWidth = 0
                        }
                        if (borderWidth >= gapStripSize)
                        {
                            position = borderWidth - gapStripSize
                        }
                        bottomOffset = containerBounds.height - topOffset - contentBounds.height - borderWidth;
                        rightOffset = containerBounds.width - leftOffset - contentBounds.width - borderWidth;
                        leftOffset += borderWidth;
                        topOffset += borderWidth
                    }
                    if (leftOffset > 0)
                    {
                        if (topOffset > 0)
                        {
                            $(CSS_SELECTOR_TOP_LEFT_RESIZE_INDICATOR, self._floatingObjectContainerDiv).css({
                                top: position, left: position, width: resizeIndicatorSize, height: resizeIndicatorSize
                            }).addClass(CSS_CLASS_RESIZE_INDICATOR_SELECT)
                        }
                        else
                        {
                            self._resizeIndicatorUnselect(CSS_SELECTOR_TOP_LEFT_RESIZE_INDICATOR)
                        }
                        if (containerBounds.height > 0)
                        {
                            $(CSS_SELECTOR_MIDDLE_LEFT_RESIZE_INDICATOR, self._floatingObjectContainerDiv).css({
                                left: position, top: (contentBounds.height - resizeIndicatorSizeWithBorder) / 2 + topOffset, width: resizeIndicatorSize, height: resizeIndicatorSize
                            }).addClass(CSS_CLASS_RESIZE_INDICATOR_SELECT)
                        }
                        else
                        {
                            self._resizeIndicatorUnselect(CSS_SELECTOR_MIDDLE_LEFT_RESIZE_INDICATOR)
                        }
                        if (bottomOffset > 0)
                        {
                            $(CSS_SELECTOR_BOTTOM_LEFT_RESIZE_INDICATOR, self._floatingObjectContainerDiv).css({
                                left: position, bottom: position, width: resizeIndicatorSize, height: resizeIndicatorSize
                            }).addClass(CSS_CLASS_RESIZE_INDICATOR_SELECT)
                        }
                        else
                        {
                            self._resizeIndicatorUnselect(CSS_SELECTOR_BOTTOM_LEFT_RESIZE_INDICATOR)
                        }
                    }
                    else
                    {
                        self._resizeIndicatorUnselect(CSS_SELECTOR_TOP_LEFT_RESIZE_INDICATOR);
                        self._resizeIndicatorUnselect(CSS_SELECTOR_MIDDLE_LEFT_RESIZE_INDICATOR);
                        self._resizeIndicatorUnselect(CSS_SELECTOR_BOTTOM_LEFT_RESIZE_INDICATOR)
                    }
                    if (topOffset > 0)
                    {
                        $(CSS_SELECTOR_TOP_CENTER_RESIZE_INDICATOR, self._floatingObjectContainerDiv).css({
                            top: position, left: (contentBounds.width - resizeIndicatorSizeWithBorder) / 2 + leftOffset, width: resizeIndicatorSize, height: resizeIndicatorSize
                        }).addClass(CSS_CLASS_RESIZE_INDICATOR_SELECT)
                    }
                    else
                    {
                        self._resizeIndicatorUnselect(CSS_SELECTOR_TOP_CENTER_RESIZE_INDICATOR)
                    }
                    if (bottomOffset > 0)
                    {
                        $(CSS_SELECTOR_BOTTOM_CENTER_RESIZE_INDICATOR, self._floatingObjectContainerDiv).css({
                            left: (contentBounds.width - resizeIndicatorSizeWithBorder) / 2 + leftOffset, bottom: position, width: resizeIndicatorSize, height: resizeIndicatorSize
                        }).addClass(CSS_CLASS_RESIZE_INDICATOR_SELECT)
                    }
                    else
                    {
                        self._resizeIndicatorUnselect(CSS_SELECTOR_BOTTOM_CENTER_RESIZE_INDICATOR)
                    }
                    if (rightOffset > 0)
                    {
                        if (topOffset > 0)
                        {
                            $(CSS_SELECTOR_TOP_RIGHT_RESIZE_INDICATOR, self._floatingObjectContainerDiv).css({
                                right: position, top: position, width: resizeIndicatorSize, height: resizeIndicatorSize
                            }).addClass(CSS_CLASS_RESIZE_INDICATOR_SELECT)
                        }
                        else
                        {
                            self._resizeIndicatorUnselect(CSS_SELECTOR_TOP_RIGHT_RESIZE_INDICATOR)
                        }
                        if (containerBounds.height > 0)
                        {
                            $(CSS_SELECTOR_MIDDLE_RIGHT_RESIZE_INDICATOR, self._floatingObjectContainerDiv).css({
                                top: (contentBounds.height - resizeIndicatorSizeWithBorder) / 2 + topOffset, right: position, width: resizeIndicatorSize, height: resizeIndicatorSize
                            }).addClass(CSS_CLASS_RESIZE_INDICATOR_SELECT)
                        }
                        else
                        {
                            self._resizeIndicatorUnselect(CSS_SELECTOR_MIDDLE_RIGHT_RESIZE_INDICATOR)
                        }
                        if (bottomOffset > 0)
                        {
                            $(CSS_SELECTOR_BOTTOM_RIGHT_RESIZE_INDICATOR, self._floatingObjectContainerDiv).css({
                                right: position, bottom: position, width: resizeIndicatorSize, height: resizeIndicatorSize
                            }).addClass(CSS_CLASS_RESIZE_INDICATOR_SELECT)
                        }
                        else
                        {
                            self._resizeIndicatorUnselect(CSS_SELECTOR_BOTTOM_RIGHT_RESIZE_INDICATOR)
                        }
                    }
                    else
                    {
                        self._resizeIndicatorUnselect(CSS_SELECTOR_TOP_RIGHT_RESIZE_INDICATOR);
                        self._resizeIndicatorUnselect(CSS_SELECTOR_MIDDLE_RIGHT_RESIZE_INDICATOR);
                        self._resizeIndicatorUnselect(CSS_SELECTOR_BOTTOM_RIGHT_RESIZE_INDICATOR)
                    }
                };
                _FloatingObjectRender.prototype._resizeIndicatorUnselect = function(selector)
                {
                    $(selector, this._floatingObjectContainerDiv).removeClass(CSS_CLASS_RESIZE_INDICATOR_SELECT).addClass(CSS_CLASS_RESIZE_INDICATOR_UNSELECT)
                };
                _FloatingObjectRender.prototype._hideResizeIndicator = function(container)
                {
                    $(CSS_SELECTOR_RESIZE_INDICATOR, container).removeClass(CSS_CLASS_RESIZE_INDICATOR_SELECT).addClass(CSS_CLASS_RESIZE_INDICATOR_UNSELECT)
                };
                _FloatingObjectRender.prototype._createFloatingObjectContainer = function(floatingObjectName)
                {
                    var outer = document.createElement("div");
                    var $outer = $(outer);
                    var self = this;
                    self._renderManager.reduceZIndex();
                    $outer.addClass(CSS_CLASS_FLOATINGOBJECT_CONTAINER).addClass(CSS_CLASS_NONE_USER_SELECT).css('z-index', CSS_ZINDEXDEFAULTVALUE).bind('mousedown', function(event)
                    {
                        self._doMouseDown(event)
                    }).bind('mousemove', function(event)
                    {
                        self._doMouseMove(event)
                    }).bind('mouseup', function(event)
                    {
                        self._doMouseUp(event)
                    });
                    outer.addEventListener('mousewheel', function(event)
                    {
                        self._doMouseWheel(event)
                    }, false);
                    outer.addEventListener('DOMMouseScroll', function(event)
                    {
                        self._doMouseWheel(event)
                    }, false);
                    $outer.append($(HTML_RESIZE_INDICATOR));
                    if (Sheets.features.touch)
                    {
                        self._touchManager = new Sheets.FloatingObjectTouchManager(outer, self, self._sheet.parent._touchEventProvider);
                        self._touchManager.attach()
                    }
                    return outer
                };
                _FloatingObjectRender.prototype._createMoveResizeContainer = function()
                {
                    var self = this;
                    if (self._floatingObjectContainerDiv && self._layout)
                    {
                        if (!self._moveResizeDiv)
                        {
                            self._moveResizeContainerDiv = document.createElement('div');
                            self._moveResizeDiv = document.createElement("div");
                            self._attachedMoveResizeDivDict = {};
                            var len = self._renderManager._containerArray.length;
                            for (var i = 0; i < len; i++)
                            {
                                var foContainer = self._renderManager._containerArray[i];
                                var fo = foContainer._floatingObject;
                                if (fo && fo.name() !== self._floatingObject.name() && fo.isSelected() && !self._attachedMoveResizeDivDict[fo.name()])
                                {
                                    self._attachedMoveResizeDivDict[fo.name()] = {
                                        offsetX: foContainer._layout.x - self._layout.x, offsetY: foContainer._layout.y - self._layout.y, height: foContainer._layout.height, width: foContainer._layout.width, moveResizeDiv: document.createElement("div")
                                    }
                                }
                            }
                            var viewportRect = self._getViewportRect(self._rowViewportIndex, self._columnViewportIndex);
                            var $movingContainer = $(self._moveResizeContainerDiv);
                            $movingContainer.addClass(CSS_CLASS_FLOATINGOBJECT_MOVING_CONTAINER).css('z-index', CSS_CONTAINERZINDEXVALUE).css({
                                top: viewportRect.y, left: viewportRect.x, width: viewportRect.width, height: viewportRect.height
                            }).bind('mousemove', function(e)
                            {
                                self._doMouseMove(e)
                            }).bind('mouseup', function(e)
                            {
                                self._doMouseUp(e)
                            });
                            var top = self._layout.y - viewportRect.y;
                            var left = self._layout.x - viewportRect.x;
                            self._attachMoveResizeDivToContainer(self._moveResizeDiv, self._moveResizeContainerDiv, left, top, self._layout.width, self._layout.height);
                            for (var item in self._attachedMoveResizeDivDict)
                            {
                                var value = self._attachedMoveResizeDivDict[item];
                                self._attachMoveResizeDivToContainer(value.moveResizeDiv, self._moveResizeContainerDiv, left + value.offsetX, top + value.offsetY, value.width, value.height)
                            }
                            if (self._containerDiv)
                            {
                                $(self._containerDiv).append(self._moveResizeContainerDiv)
                            }
                        }
                    }
                };
                _FloatingObjectRender.prototype._handleDocumentMouseMove = function()
                {
                    var self = this;
                    if (!self._isMouseCapture)
                    {
                        $(document).bind("mousemove.gcSheet", function(e)
                        {
                            self._doMouseMove(e)
                        });
                        $(document).bind("mouseup.gcSheet", function(e)
                        {
                            self._doMouseUp(e)
                        });
                        self._isMouseCapture = true
                    }
                };
                _FloatingObjectRender.prototype._unhandleDocumentMouseMove = function()
                {
                    if (this._isMouseCapture)
                    {
                        this._isMouseCapture = false;
                        $(document).unbind("mousemove.gcSheet");
                        $(document).unbind("mouseup.gcSheet")
                    }
                };
                _FloatingObjectRender.prototype._doMouseDown = function(event)
                {
                    var self = this,
                        sheet = self._sheet;
                    if (sheet.isProtected && self._floatingObject.isLocked())
                    {
                        return
                    }
                    if (!sheet.endEdit())
                    {
                        return
                    }
                    if (self._touchManager && !event.isTouch && self._touchManager.preProcessMouseDown(event))
                    {
                        Sheets.util.cancelDefault(event);
                        return
                    }
                    if (event.button === 0 || event.button === 2)
                    {
                        if (event.ctrlKey || event.shiftKey)
                        {
                            if (self._floatingObject.isSelected())
                            {
                                self._floatingObject.isSelected(false)
                            }
                            else
                            {
                                self._floatingObject.isSelected(true);
                                Sheets.FocusHelper.setActiveElement(sheet)
                            }
                        }
                        else
                        {
                            if (!self._floatingObject.isSelected())
                            {
                                sheet.unSelectAllFloatingObjects();
                                self._floatingObject.isSelected(true);
                                Sheets.FocusHelper.setActiveElement(sheet)
                            }
                        }
                        if (sheet._commentManager)
                        {
                            sheet._commentManager.deactivateComment()
                        }
                        sheet._saveAndClearSheetSelections();
                        if (event.button === 2)
                        {
                            return
                        }
                        var eventHandler = sheet._eventHandler,
                            canvasOffset = eventHandler._getCanvasOffset();
                        self._mouseLeftButtonDownPosition = new Sheets.Point(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top);
                        self._mousePosition = self._mouseLeftButtonDownPosition;
                        self._isMouseLeftButtonDown = true;
                        self._mouseDownHittestInfo = self._hitTest(self._mousePosition.x, self._mousePosition.y);
                        if (self._mouseDownHittestInfo.inMoving)
                        {
                            self._moveInfo = {};
                            self._moveInfo.startTopRow = sheet.getViewportTopRow(self._rowViewportIndex);
                            self._moveInfo.startLeftColumn = sheet.getViewportLeftColumn(self._columnViewportIndex)
                        }
                        else
                        {
                            self._createMoveResizeContainer();
                            var $movingContainer = $(self._moveResizeDiv);
                            self._resizeInfo = {};
                            var elementBounds = self._getHTMLElementBounds(self._moveResizeDiv);
                            self._resizeInfo.startX = elementBounds.x;
                            self._resizeInfo.startY = elementBounds.y;
                            self._resizeInfo.startWidth = elementBounds.width;
                            self._resizeInfo.startHeight = elementBounds.height;
                            self._resizeInfo.startTopRow = sheet.getViewportTopRow(self._rowViewportIndex);
                            self._resizeInfo.startLeftColumn = sheet.getViewportLeftColumn(self._columnViewportIndex)
                        }
                        self._handleDocumentMouseMove();
                        var sheetHitTestInfo = sheet.hitTest(self._mousePosition.x, self._mousePosition.y);
                        eventHandler.startHitInfo = {
                            scrollRowViewportIndex: sheetHitTestInfo.rowViewportIndex, scrollColViewportIndex: sheetHitTestInfo.colViewportIndex, hitTestType: sheetHitTestInfo.hitTestType
                        };
                        eventHandler.mousePosition = self._mousePosition;
                        eventHandler.startScroll();
                        eventHandler.isFloatingObjectWorking = true
                    }
                    event.stopPropagation();
                    return false
                };
                _FloatingObjectRender.prototype._doMouseMove = function(event)
                {
                    var self = this,
                        sheet = self._sheet;
                    if (sheet.isProtected && self._floatingObject.isLocked())
                    {
                        return
                    }
                    if (self._touchManager && !event.isTouch && self._touchManager.preProcessMouseMove(event))
                    {
                        Sheets.util.cancelDefault(event);
                        return
                    }
                    if (sheet._isMouseDownInSheet)
                    {
                        if (self._floatingObjectContainerDiv)
                        {
                            var $container = $(self._floatingObjectContainerDiv);
                            $container.css('cursor', 'default')
                        }
                        return true
                    }
                    var eventHandler = sheet._eventHandler,
                        canvasOffset = eventHandler._getCanvasOffset();
                    var point = new Sheets.Point(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top);
                    if (self._isMouseLeftButtonDown)
                    {
                        $(self._moveResizeContainerDiv).css("cursor", $(self._floatingObjectContainerDiv).css('cursor'));
                        if (self._mouseDownHittestInfo.inMoving)
                        {
                            self._isMoving = true;
                            self._createMoveResizeContainer();
                            self._doMoveContainer(self._mousePosition, point)
                        }
                        else
                        {
                            self._isResizing = true;
                            self._doResizeContainer(self._mousePosition, self._mouseDownHittestInfo)
                        }
                        self._mousePosition = point;
                        eventHandler.mousePosition = point;
                        eventHandler.continueScroll();
                        $(document.body).addClass(CSS_CLASS_NONE_USER_SELECT)
                    }
                    else
                    {
                        self._updateCursor(point)
                    }
                    event.stopPropagation();
                    return false
                };
                _FloatingObjectRender.prototype._doMouseUp = function(event)
                {
                    var self = this,
                        sheet = self._sheet,
                        eventHandler = sheet._eventHandler;
                    if (sheet.isProtected && self._floatingObject.isLocked())
                    {
                        return
                    }
                    if (self._touchManager && !event.isTouch && self._touchManager.preProcessMouseUp(event))
                    {
                        Sheets.util.cancelDefault(event);
                        return
                    }
                    if (sheet._isMouseDownInSheet)
                    {
                        if (self._floatingObjectContainerDiv)
                        {
                            var $container = $(self._floatingObjectContainerDiv);
                            $container.css('cursor', 'move')
                        }
                        return true
                    }
                    eventHandler.isFloatingObjectWorking = false;
                    eventHandler.stopScroll();
                    var canvasOffset = eventHandler._getCanvasOffset();
                    var point = new Sheets.Point(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top);
                    if (self._mouseDownHittestInfo)
                    {
                        if (self._mouseDownHittestInfo.inMoving && self._isMoving)
                        {
                            if (event.ctrlKey)
                            {
                                self._doCopyFloatingObject(self._mouseLeftButtonDownPosition, point)
                            }
                            else
                            {
                                self._doMoveFloatingObject(self._mouseLeftButtonDownPosition, point)
                            }
                        }
                        else if (self._isResizing)
                        {
                            self._doResizeFloatingObject()
                        }
                        $(document.body).removeClass(CSS_CLASS_NONE_USER_SELECT)
                    }
                    self._resetStatusOnMouseUp();
                    event.stopPropagation();
                    return false
                };
                _FloatingObjectRender.prototype._resetStatusOnMouseUp = function()
                {
                    var self = this;
                    self._resizeInfo = keyword_null;
                    self._moveInfo = keyword_null;
                    self._attachedMoveResizeDivDict = keyword_null;
                    $(self._moveResizeContainerDiv).remove();
                    self._moveResizeDiv = keyword_null;
                    self._isMouseLeftButtonDown = false;
                    self._unhandleDocumentMouseMove();
                    self._isMoving = false;
                    self._isResizing = false
                };
                _FloatingObjectRender.prototype._doMouseWheel = function(e)
                {
                    var sheet = this._sheet;
                    if (sheet)
                    {
                        e = e ? e : window.event;
                        var wheelData = e.detail ? e.detail : e.wheelDelta / -40;
                        sheet._eventHandler.doMouseWheel(e, parseInt(wheelData, 10));
                        Sheets.util.cancelDefault(e);
                        return false
                    }
                };
                _FloatingObjectRender.prototype._doCopyFloatingObject = function(startPoint, endPoint)
                {
                    var self = this,
                        sheet = self._sheet;
                    if (self._moveInfo)
                    {
                        var viewportOffsetHeight = self._getTwoRowDistance(self._moveInfo.startTopRow, sheet.getViewportTopRow(self._rowViewportIndex));
                        var viewportOffsetWidth = self._getTwoColumnDistance(self._moveInfo.startLeftColumn, sheet.getViewportLeftColumn(self._columnViewportIndex));
                        var offsetX = endPoint.x - startPoint.x + (endPoint.x > startPoint.x ? viewportOffsetWidth : -1 * viewportOffsetWidth);
                        var offsetY = endPoint.y - startPoint.y + (endPoint.y > startPoint.y ? viewportOffsetHeight : -1 * viewportOffsetHeight);
                        var names = [];
                        names.push(self._floatingObject.name());
                        for (var item in self._attachedMoveResizeDivDict)
                        {
                            names.push(item)
                        }
                        var dragCopyFloatingObjectUndoAction = new Sheets.UndoRedo.DragCopyFloatingObjectUndoAction(sheet, {names: names}, {
                                offsetX: offsetX, offsetY: offsetY
                            });
                        sheet._doCommand(dragCopyFloatingObjectUndoAction)
                    }
                };
                _FloatingObjectRender.prototype._doMoveFloatingObject = function(startPoint, endPoint)
                {
                    var self = this,
                        sheet = self._sheet;
                    if (self._moveInfo)
                    {
                        var viewportOffsetHeight = self._getTwoRowDistance(self._moveInfo.startTopRow, sheet.getViewportTopRow(self._rowViewportIndex));
                        var viewportOffsetWidth = self._getTwoColumnDistance(self._moveInfo.startLeftColumn, sheet.getViewportLeftColumn(self._columnViewportIndex));
                        var offsetX = endPoint.x - startPoint.x + (endPoint.x > startPoint.x ? viewportOffsetWidth : -1 * viewportOffsetWidth);
                        var offsetY = endPoint.y - startPoint.y + (endPoint.y > startPoint.y ? viewportOffsetHeight : -1 * viewportOffsetHeight);
                        offsetX = offsetX / sheet._zoomFactor;
                        offsetY = offsetY / sheet._zoomFactor;
                        var names = [];
                        names.push(self._floatingObject.name());
                        for (var item in self._attachedMoveResizeDivDict)
                        {
                            names.push(item)
                        }
                        var movingFloatingObjectUndoAction = new Sheets.UndoRedo.MovingFloatingObjectUndoAction(sheet, {names: names}, {
                                offsetX: offsetX, offsetY: offsetY
                            });
                        sheet._doCommand(movingFloatingObjectUndoAction)
                    }
                };
                _FloatingObjectRender.prototype._doResizeFloatingObject = function()
                {
                    var self = this,
                        sheet = self._sheet,
                        zoomFactor = sheet._zoomFactor;
                    if (self._resizeInfo)
                    {
                        var viewportOffsetHeight = self._getTwoRowDistance(self._resizeInfo.startTopRow, sheet.getViewportTopRow(self._rowViewportIndex));
                        var viewportOffsetWidth = self._getTwoColumnDistance(self._resizeInfo.startLeftColumn, sheet.getViewportLeftColumn(self._columnViewportIndex));
                        var offsetX = self._resizeInfo.endX - self._resizeInfo.startX + (self._resizeInfo.endX > self._resizeInfo.startX ? viewportOffsetWidth : -1 * viewportOffsetWidth);
                        offsetX = offsetX / zoomFactor;
                        var offsetY = self._resizeInfo.endY - self._resizeInfo.startY + (self._resizeInfo.endY > self._resizeInfo.startY ? viewportOffsetHeight : -1 * viewportOffsetHeight);
                        offsetY = offsetY / zoomFactor;
                        var offsetWidth = (self._resizeInfo.endWidth + viewportOffsetWidth) / zoomFactor - self._floatingObject.width();
                        var offsetHeight = (self._resizeInfo.endHeight + viewportOffsetHeight) / zoomFactor - self._floatingObject.height();
                        var names = [];
                        names.push(self._floatingObject.name());
                        for (var item in self._attachedMoveResizeDivDict)
                        {
                            names.push(item)
                        }
                        var resizingFloatingObjectUndoAction = new Sheets.UndoRedo.ResizingFloatingObjectUndoAction(sheet, {names: names}, {
                                offsetX: offsetX, offsetY: offsetY, offsetWidth: offsetWidth, offsetHeight: offsetHeight
                            });
                        sheet._doCommand(resizingFloatingObjectUndoAction)
                    }
                };
                _FloatingObjectRender.prototype._doMoveContainer = function(startPoint, endPoint)
                {
                    var self = this;
                    if (self._moveResizeDiv)
                    {
                        var $movingContainer = $(self._moveResizeDiv);
                        var x = endPoint.x - startPoint.x;
                        var y = endPoint.y - startPoint.y;
                        self._doMoveContainerImp(self._moveResizeDiv, x, y);
                        for (var item in self._attachedMoveResizeDivDict)
                        {
                            var value = self._attachedMoveResizeDivDict[item];
                            self._doMoveContainerImp(value.moveResizeDiv, x, y)
                        }
                    }
                };
                _FloatingObjectRender.prototype._doMoveContainerImp = function(div, x, y)
                {
                    var $movingContainer = $(div);
                    var position = $movingContainer.position();
                    $movingContainer.css({
                        top: position.top + y, left: position.left + x
                    })
                };
                _FloatingObjectRender.prototype._doResizeContainer = function(point, hitInfo)
                {
                    if (hitInfo)
                    {
                        var self = this;
                        var rect;
                        var layout = self._getViewportRect(self._rowViewportIndex, self._columnViewportIndex);
                        point = new Sheets.Point(point.x - layout.x, point.y - layout.y);
                        if (hitInfo.inTopNWSEResizing)
                        {
                            rect = self._getFloatingObjectTopLeftResizingRect(point)
                        }
                        else if (hitInfo.inTopNSResizing)
                        {
                            rect = self._getFloatingObjectTopCenterResizingRect(point)
                        }
                        else if (hitInfo.inTopNESWResizing)
                        {
                            rect = self._getFloatingObjectTopRightResizingRect(point)
                        }
                        else if (hitInfo.inLeftWEResizing)
                        {
                            rect = self._getFloatingObjectMiddleLeftResizingRect(point)
                        }
                        else if (hitInfo.inRightWEResizing)
                        {
                            rect = self._getFloatingObjectMiddleRightResizingRect(point)
                        }
                        else if (hitInfo.inBottomNESWResizing)
                        {
                            rect = self._getFloatingObjectBottomLeftResizingRect(point)
                        }
                        else if (hitInfo.inBottomNSReszing)
                        {
                            rect = self._getFloatingObjectBottomCenterResizingRect(point)
                        }
                        else if (hitInfo.inBottomNWSEReszing)
                        {
                            rect = self._getFloatingObjectBottomRightResizingRect(point)
                        }
                        self._resizeInfo.endX = rect.x;
                        self._resizeInfo.endY = rect.y;
                        self._resizeInfo.endWidth = rect.width;
                        self._resizeInfo.endHeight = rect.height;
                        var $movingContainer = $(self._moveResizeDiv);
                        var bounds = self._getHTMLElementBounds(self._moveResizeDiv);
                        var offsetTop = rect.y - bounds.y;
                        var offsetLeft = rect.x - bounds.x;
                        var offsetWidth = rect.width - bounds.width;
                        var offsetHeight = rect.height - bounds.height;
                        self._doResizeContainerImp(self._moveResizeDiv, offsetLeft, offsetTop, offsetWidth, offsetHeight);
                        for (var item in self._attachedMoveResizeDivDict)
                        {
                            var value = self._attachedMoveResizeDivDict[item];
                            self._doResizeContainerImp(value.moveResizeDiv, offsetLeft, offsetTop, offsetWidth, offsetHeight)
                        }
                    }
                };
                _FloatingObjectRender.prototype._doResizeContainerImp = function(div, offsetLeft, offsetTop, offsetWidth, offsetHeight)
                {
                    var $movingContainer = $(div);
                    var bounds = this._getHTMLElementBounds(div);
                    $movingContainer.css({
                        top: bounds.y + offsetTop, left: bounds.x + offsetLeft, width: bounds.width + offsetWidth, height: bounds.height + offsetHeight
                    })
                };
                _FloatingObjectRender.prototype._attachMoveResizeDivToContainer = function(moveResizeDiv, container, x, y, width, height)
                {
                    $(moveResizeDiv).addClass(CSS_CLASS_FLOATINGOBJECT_MOVING_DIV).css({
                        top: y - 1, left: x - 1, width: width, height: height
                    }).appendTo(container)
                };
                _FloatingObjectRender.prototype._getHTMLElementBounds = function(element)
                {
                    var $element = $(element);
                    var position = $element.position();
                    return new Sheets.Rect(position.left, position.top, $element.width(), $element.height())
                };
                _FloatingObjectRender.prototype._updateCursor = function(point)
                {
                    var self = this;
                    if (self._floatingObjectContainerDiv)
                    {
                        var $container = $(self._floatingObjectContainerDiv),
                            info = self._hitTest(point.x, point.y),
                            cursor;
                        if (info !== keyword_null)
                        {
                            if (info.inTopNWSEResizing)
                            {
                                cursor = 'nw-resize'
                            }
                            else if (info.inTopNSResizing)
                            {
                                cursor = 'n-resize'
                            }
                            else if (info.inTopNESWResizing)
                            {
                                cursor = 'ne-resize'
                            }
                            else if (info.inLeftWEResizing)
                            {
                                cursor = 'w-resize'
                            }
                            else if (info.inRightWEResizing)
                            {
                                cursor = 'w-resize'
                            }
                            else if (info.inBottomNESWResizing)
                            {
                                cursor = 'sw-resize'
                            }
                            else if (info.inBottomNSReszing)
                            {
                                cursor = 'n-resize'
                            }
                            else if (info.inBottomNWSEReszing)
                            {
                                cursor = 'se-resize'
                            }
                            else
                            {
                                cursor = 'move'
                            }
                            $container.css('cursor', cursor)
                        }
                    }
                };
                _FloatingObjectRender.prototype._getFloatingObjectTopLeftResizingRect = function(point)
                {
                    var self = this;
                    var x = Math_min(self._resizeInfo.startX + self._resizeInfo.startWidth, point.x);
                    var y = Math_min(self._resizeInfo.startY + self._resizeInfo.startHeight, point.y);
                    var width = Math_abs(point.x - self._resizeInfo.startX - self._resizeInfo.startWidth);
                    var height = Math_abs(point.y - self._resizeInfo.startY - self._resizeInfo.startHeight);
                    return new Sheets.Rect(x, y, width, height)
                };
                _FloatingObjectRender.prototype._getFloatingObjectTopCenterResizingRect = function(point)
                {
                    var self = this;
                    var x = self._resizeInfo.startX;
                    var y = Math_min(self._resizeInfo.startY + self._resizeInfo.startHeight, point.y);
                    var height = Math_abs(point.y - self._resizeInfo.startY - self._resizeInfo.startHeight);
                    var width = self._resizeInfo.startWidth;
                    return new Sheets.Rect(x, y, width, height)
                };
                _FloatingObjectRender.prototype._getFloatingObjectTopRightResizingRect = function(point)
                {
                    var self = this;
                    var x = Math_min(self._resizeInfo.startX, point.x);
                    var y = Math_min(self._resizeInfo.startY + self._resizeInfo.startHeight, point.y);
                    var width = Math_abs(point.x - self._resizeInfo.startX);
                    var height = Math_abs(point.y - self._resizeInfo.startY - self._resizeInfo.startHeight);
                    return new Sheets.Rect(x, y, width, height)
                };
                _FloatingObjectRender.prototype._getFloatingObjectMiddleLeftResizingRect = function(point)
                {
                    var self = this;
                    var x = Math_min(self._resizeInfo.startX + self._resizeInfo.startWidth, point.x);
                    var y = self._resizeInfo.startY;
                    var width = Math_abs(point.x - self._resizeInfo.startX - self._resizeInfo.startWidth);
                    var height = self._resizeInfo.startHeight;
                    return new Sheets.Rect(x, y, width, height)
                };
                _FloatingObjectRender.prototype._getFloatingObjectMiddleRightResizingRect = function(point)
                {
                    var self = this;
                    var x = Math_min(self._resizeInfo.startX, point.x);
                    var y = self._resizeInfo.startY;
                    var width = Math_abs(point.x - self._resizeInfo.startX);
                    var height = self._resizeInfo.startHeight;
                    return new Sheets.Rect(x, y, width, height)
                };
                _FloatingObjectRender.prototype._getFloatingObjectBottomLeftResizingRect = function(point)
                {
                    var self = this;
                    var x = Math_min(self._resizeInfo.startX + self._resizeInfo.startWidth, point.x);
                    var y = Math_min(self._resizeInfo.startY, point.y);
                    var width = Math_abs(point.x - self._resizeInfo.startX - self._resizeInfo.startWidth);
                    var height = Math_abs(point.y - self._resizeInfo.startY);
                    return new Sheets.Rect(x, y, width, height)
                };
                _FloatingObjectRender.prototype._getFloatingObjectBottomCenterResizingRect = function(point)
                {
                    var self = this;
                    var x = self._resizeInfo.startX;
                    var y = Math_min(self._resizeInfo.startY, point.y);
                    var height = Math_abs(point.y - self._resizeInfo.startY);
                    var width = self._resizeInfo.startWidth;
                    return new Sheets.Rect(x, y, width, height)
                };
                _FloatingObjectRender.prototype._getFloatingObjectBottomRightResizingRect = function(point)
                {
                    var self = this;
                    var x = Math_min(self._resizeInfo.startX, point.x);
                    var y = Math_min(self._resizeInfo.startY, point.y);
                    var width = Math_abs(point.x - self._resizeInfo.startX);
                    var height = Math_abs(point.y - self._resizeInfo.startY);
                    return new Sheets.Rect(x, y, width, height)
                };
                _FloatingObjectRender.prototype._getViewportRect = function(rowViewportIndex, columnViewportIndex)
                {
                    var self = this,
                        sheet = self._sheet;
                    var layout = sheet._getSheetLayout(),
                        rect = layout.viewportRect(rowViewportIndex, columnViewportIndex),
                        topRow,
                        bottomRow,
                        leftColumn,
                        rightColumn,
                        tempRect,
                        floatingObject = self._floatingObject,
                        startRow = floatingObject.startRow(),
                        startColumn = floatingObject.startColumn(),
                        endRow = floatingObject.endRow(),
                        endColumn = floatingObject.endColumn(),
                        frozenRowCount = sheet.frozenRowCount,
                        frozenColCount = sheet.frozenColCount,
                        frozenTrailingRow = sheet.getRowCount(3) - sheet.getFrozenTrailingRowCount() - 1,
                        frozenTrailingColumn = sheet.getColumnCount(3) - sheet.getFrozenTrailingColumnCount() - 1;
                    if (rowViewportIndex === VIEWPORTINDEX)
                    {
                        if (frozenRowCount > 0)
                        {
                            topRow = sheet.getViewportTopRow(rowViewportIndex);
                            if (startRow < frozenRowCount || topRow === frozenRowCount)
                            {
                                rect.y -= layout.frozenHeight;
                                rect.height += layout.frozenHeight
                            }
                        }
                        if (sheet._frozenTrailingRowCount > 0)
                        {
                            bottomRow = sheet.getViewportBottomRow(rowViewportIndex);
                            if (endRow > frozenTrailingRow && bottomRow === frozenTrailingRow)
                            {
                                rect.height += layout.frozenTrailingHeight
                            }
                        }
                    }
                    else if (rowViewportIndex === VIEWPORTINDEX - 1)
                    {
                        topRow = sheet.getViewportTopRow(rowViewportIndex + 1);
                        if (endRow >= topRow || topRow === frozenRowCount)
                        {
                            tempRect = layout.viewportRect(rowViewportIndex + 1, columnViewportIndex);
                            rect.height += tempRect.height
                        }
                    }
                    else if (rowViewportIndex === VIEWPORTINDEX + 1)
                    {
                        bottomRow = sheet.getViewportBottomRow(rowViewportIndex - 1);
                        if (startRow <= bottomRow || bottomRow === frozenTrailingRow)
                        {
                            tempRect = layout.viewportRect(rowViewportIndex - 1, columnViewportIndex);
                            rect.y = tempRect.y;
                            rect.height += tempRect.height
                        }
                    }
                    if (columnViewportIndex === VIEWPORTINDEX)
                    {
                        if (frozenColCount > 0)
                        {
                            leftColumn = sheet.getViewportLeftColumn(columnViewportIndex);
                            if (startColumn < frozenColCount || leftColumn === frozenColCount)
                            {
                                rect.x -= layout.frozenWidth;
                                rect.width += layout.frozenWidth
                            }
                        }
                        if (sheet._frozenTrailingColCount > 0)
                        {
                            rightColumn = sheet.getViewportRightColumn(columnViewportIndex);
                            if (endColumn > frozenTrailingColumn || rightColumn === frozenTrailingColumn)
                            {
                                rect.width += layout.frozenTrailingWidth
                            }
                        }
                    }
                    else if (columnViewportIndex === VIEWPORTINDEX - 1)
                    {
                        leftColumn = sheet.getViewportLeftColumn(columnViewportIndex + 1);
                        if (endColumn >= leftColumn || leftColumn === frozenColCount)
                        {
                            tempRect = layout.viewportRect(rowViewportIndex, columnViewportIndex + 1);
                            rect.width += tempRect.width
                        }
                    }
                    else if (columnViewportIndex === VIEWPORTINDEX + 1)
                    {
                        rightColumn = sheet.getViewportRightColumn(columnViewportIndex - 1);
                        if (startColumn <= rightColumn || rightColumn === frozenTrailingColumn)
                        {
                            tempRect = layout.viewportRect(rowViewportIndex, columnViewportIndex - 1);
                            rect.x = tempRect.x;
                            rect.width += tempRect.width
                        }
                    }
                    return rect
                };
                _FloatingObjectRender.prototype._getTwoColumnDistance = function(column1, column2)
                {
                    var startColumn = Math_min(column1, column2);
                    var endColumn = Math_max(column1, column2);
                    var totalWidth = 0;
                    for (var c = startColumn; c < endColumn; c++)
                    {
                        totalWidth += this._sheet.getColumnWidth(c, 3)
                    }
                    return totalWidth
                };
                _FloatingObjectRender.prototype._getTwoRowDistance = function(row1, row2)
                {
                    var startRow = Math_min(row1, row2);
                    var endRow = Math_max(row1, row2);
                    var totalHeight = 0;
                    for (var i = startRow; i < endRow; i++)
                    {
                        totalHeight += this._sheet.getRowHeight(i, 3)
                    }
                    return totalHeight
                };
                _FloatingObjectRender.prototype._hitTest = function(mouseX, mouseY)
                {
                    var self = this;
                    if (!self._layout)
                    {
                        return keyword_null
                    }
                    var info = {
                            inMoving: false, inTopNWSEResizing: false, inTopNSResizing: false, inTopNESWResizing: false, inLeftWEResizing: false, inRightWEResizing: false, inBottomNESWResizing: false, inBottomNSReszing: false, inBottomNWSEReszing: false
                        };
                    if (!self._floatingObject.isSelected())
                    {
                        info.inMoving = true;
                        return info
                    }
                    var visibleGapSize = Math_floor(_FloatingObjectRender._resizeIndicatorSize / 2 + 1),
                        inflateSize = 10,
                        x = self._layout.x,
                        y = self._layout.y,
                        width = self._layout.width,
                        height = self._layout.height;
                    if (self._floatingObject && self._floatingObject.isSelected())
                    {
                        x -= visibleGapSize;
                        y -= visibleGapSize;
                        width += 2 * visibleGapSize;
                        height += 2 * visibleGapSize
                    }
                    var topLeftRect = self._inflateRect(new Sheets.Rect(x, y, visibleGapSize, visibleGapSize), inflateSize);
                    if (topLeftRect.contains(mouseX, mouseY))
                    {
                        info.inTopNWSEResizing = true;
                        return info
                    }
                    var topCenterRect = self._inflateRect(new Sheets.Rect(x + width / 2 - visibleGapSize, y, 2 * visibleGapSize, visibleGapSize), inflateSize);
                    if (topCenterRect.contains(mouseX, mouseY))
                    {
                        info.inTopNSResizing = true;
                        return info
                    }
                    var topRightRect = self._inflateRect(new Sheets.Rect(x + width - visibleGapSize, y, visibleGapSize, visibleGapSize), inflateSize);
                    if (topRightRect.contains(mouseX, mouseY))
                    {
                        info.inTopNESWResizing = true;
                        return info
                    }
                    var middleLeftRect = self._inflateRect(new Sheets.Rect(x, y + height / 2 - visibleGapSize, visibleGapSize, 2 * visibleGapSize), inflateSize);
                    if (middleLeftRect.contains(mouseX, mouseY))
                    {
                        info.inLeftWEResizing = true;
                        return info
                    }
                    var middleRightRect = self._inflateRect(new Sheets.Rect(x + width - visibleGapSize, y + height / 2 - visibleGapSize, visibleGapSize, 2 * visibleGapSize), inflateSize);
                    if (middleRightRect.contains(mouseX, mouseY))
                    {
                        info.inRightWEResizing = true;
                        return info
                    }
                    var bottomLeftRect = self._inflateRect(new Sheets.Rect(x, y + height - visibleGapSize, visibleGapSize, visibleGapSize), inflateSize);
                    if (bottomLeftRect.contains(mouseX, mouseY))
                    {
                        info.inBottomNESWResizing = true;
                        return info
                    }
                    var bottomCenterRect = self._inflateRect(new Sheets.Rect(x + width / 2 - visibleGapSize, y + height - visibleGapSize, 2 * visibleGapSize, visibleGapSize), inflateSize);
                    if (bottomCenterRect.contains(mouseX, mouseY))
                    {
                        info.inBottomNSReszing = true;
                        return info
                    }
                    var bottomRightRect = self._inflateRect(new Sheets.Rect(x + width - visibleGapSize, y + height - visibleGapSize, visibleGapSize, visibleGapSize), inflateSize);
                    if (bottomRightRect.contains(mouseX, mouseY))
                    {
                        info.inBottomNWSEReszing = true;
                        return info
                    }
                    info.inMoving = true;
                    return info
                };
                _FloatingObjectRender.prototype._inflateRect = function(rect, size)
                {
                    var x = rect.x - size;
                    var y = rect.y - size;
                    var width = rect.width + 2 * size;
                    var height = rect.height + 2 * size;
                    return new Sheets.Rect(x, y, width >= 0 ? width : 0, height >= 0 ? height : 0)
                };
                _FloatingObjectRender._resizeIndicatorSize = 7;
                return _FloatingObjectRender
            })();
        Sheets._FloatingObjectRender = _FloatingObjectRender;
        var _FloatingObjectRenderManager = (function()
            {
                function _FloatingObjectRenderManager(sheet)
                {
                    this._sheet = sheet;
                    this._containerArray = new NamedObjectArray
                }
                _FloatingObjectRenderManager.prototype.getFloatingObjectRenderCount = function()
                {
                    return this._containerArray.length
                };
                _FloatingObjectRenderManager.prototype._dispose = function()
                {
                    var count = this._containerArray.length;
                    for (var i = 0; i < count; i++)
                    {
                        this._containerArray[i]._dispose()
                    }
                    this._containerArray.length = 0
                };
                _FloatingObjectRenderManager.prototype._render = function(rowViewportIndex, columnViewportIndex, zoomFactor)
                {
                    if (rowViewportIndex < 0 || columnViewportIndex < 0)
                    {
                        return
                    }
                    var self = this,
                        sheet = self._sheet;
                    var floatingObjectLayoutModel = self._createViewportFloatingObjectLayoutModel(rowViewportIndex, columnViewportIndex, zoomFactor);
                    var removedContainer = [];
                    var i,
                        len;
                    for (i = 0, len = self._containerArray.length; i < len; i++)
                    {
                        if (!floatingObjectLayoutModel.find(self._containerArray[i].name))
                        {
                            removedContainer.push(self._containerArray[i])
                        }
                    }
                    for (i = 0, len = removedContainer.length; i < len; i++)
                    {
                        var item = removedContainer[i];
                        item._renderManager = keyword_null;
                        self._containerArray.remove(item.name);
                        item._dispose()
                    }
                    var fOLayoutModelLength = floatingObjectLayoutModel.length;
                    if (fOLayoutModelLength <= 0)
                    {
                        return
                    }
                    var useTouchLayout = sheet.parent && sheet.parent.useTouchLayout();
                    if (useTouchLayout)
                    {
                        _FloatingObjectRender._resizeIndicatorSize = 11
                    }
                    else
                    {
                        _FloatingObjectRender._resizeIndicatorSize = 7
                    }
                    for (i = 0; i < fOLayoutModelLength; i++)
                    {
                        var layout = floatingObjectLayoutModel[i],
                            floatingObject = sheet._findFloatingObjectInternal(layout.name),
                            visibleGapSize = Math_floor(_FloatingObjectRender._resizeIndicatorSize / 2 + 1);
                        if (floatingObject && typeof floatingObject.borderWidth === 'function')
                        {
                            var borderWidth = floatingObject.borderWidth(),
                                borderStyle = floatingObject.borderStyle();
                            if (!floatingObject._isBorderStyleWork(borderStyle))
                            {
                                borderWidth = 0
                            }
                            if (borderWidth > visibleGapSize)
                            {
                                visibleGapSize = borderWidth
                            }
                        }
                        var viewportRect = self._getViewportRect(rowViewportIndex, columnViewportIndex);
                        var contentDivBorderWidth = 1;
                        var left = layout.x - visibleGapSize - contentDivBorderWidth;
                        var top = layout.y - visibleGapSize - contentDivBorderWidth;
                        var width = layout.width + 2 * visibleGapSize + 2 * contentDivBorderWidth;
                        var height = layout.height + 2 * visibleGapSize + 2 * contentDivBorderWidth;
                        var outContainerTop = Math_max(viewportRect.y, top);
                        var outContainerLeft = Math_max(viewportRect.x, left);
                        var outContainerHeight = height;
                        var outContainerWidth = width;
                        var topOffset = visibleGapSize + contentDivBorderWidth;
                        var leftOffset = visibleGapSize + contentDivBorderWidth;
                        var minusGapSize = -1 * visibleGapSize - contentDivBorderWidth;
                        if (top <= 0)
                        {
                            topOffset += (top < minusGapSize ? minusGapSize : top)
                        }
                        if (left <= 0)
                        {
                            leftOffset += (left < minusGapSize ? minusGapSize : left)
                        }
                        topOffset = top - outContainerTop + topOffset;
                        leftOffset = left - outContainerLeft + leftOffset;
                        if (topOffset <= 0)
                        {
                            outContainerHeight += topOffset;
                            outContainerHeight += minusGapSize
                        }
                        else if (topOffset < visibleGapSize && topOffset > 0)
                        {
                            outContainerHeight -= (visibleGapSize - topOffset)
                        }
                        if (leftOffset <= 0)
                        {
                            outContainerWidth += leftOffset;
                            outContainerWidth += minusGapSize
                        }
                        else if (leftOffset < visibleGapSize && leftOffset > 0)
                        {
                            outContainerWidth -= (visibleGapSize - leftOffset)
                        }
                        var container = self._containerArray.find(layout.name);
                        if (!container)
                        {
                            container = new _FloatingObjectRender(sheet._findFloatingObjectInternal(layout.name), sheet);
                            container._renderManager = self;
                            self._containerArray.push(container)
                        }
                        container._layout = layout;
                        container._rowViewportIndex = rowViewportIndex;
                        container._columnViewportIndex = columnViewportIndex;
                        var clipRect = new Sheets.Rect(viewportRect.x, viewportRect.y, viewportRect.width, viewportRect.height);
                        container.render(new Sheets.Rect(outContainerLeft, outContainerTop, outContainerWidth, outContainerHeight).getIntersectRect(clipRect) || new Sheets.Rect(outContainerLeft, outContainerTop, 0, 0), new Sheets.Rect(leftOffset, topOffset, layout.width, layout.height))
                    }
                };
                _FloatingObjectRenderManager.prototype.setFloatingObjectZIndex = function(name, zIndex)
                {
                    var contaniner = this._containerArray.find(name);
                    if (contaniner)
                    {
                        contaniner.setFloatingObjectZIndex(zIndex)
                    }
                };
                _FloatingObjectRenderManager.prototype.getFloatingObjectZIndex = function(name)
                {
                    var contaniner = this._containerArray.find(name);
                    if (contaniner)
                    {
                        return contaniner.getFloatingObjectZIndex()
                    }
                    return -1
                };
                _FloatingObjectRenderManager.prototype.reduceZIndex = function()
                {
                    var containerArray = this._containerArray;
                    for (var index = 0, length = containerArray.length; index < length; index++)
                    {
                        var container = containerArray[index],
                            zIndex = container.getFloatingObjectZIndex();
                        if (zIndex !== -1)
                        {
                            container.setFloatingObjectZIndex(zIndex - 1)
                        }
                    }
                };
                _FloatingObjectRenderManager.prototype._getViewportRect = function(rowViewportIndex, columnViewportIndex)
                {
                    var sheet = this._sheet,
                        columnLayout = sheet._getViewportColumnLayout(columnViewportIndex),
                        x = 0,
                        y = 0,
                        width = 0,
                        height = 0;
                    if (columnLayout && columnLayout.length > 0)
                    {
                        var firstColumnLayout = columnLayout[0],
                            lastColumnLayout = columnLayout[columnLayout.length - 1];
                        x = firstColumnLayout.x;
                        width = lastColumnLayout.x + lastColumnLayout.width - x
                    }
                    var rowLayout = sheet._getViewportRowLayout(rowViewportIndex);
                    if (rowLayout && rowLayout.length > 0)
                    {
                        var firstRowLayout = rowLayout[0],
                            lastRowLayout = rowLayout[rowLayout.length - 1];
                        y = firstRowLayout.y;
                        height = lastRowLayout.y + lastRowLayout.height - y
                    }
                    var layout = sheet._getSheetLayout();
                    var rect = layout.viewportRect(rowViewportIndex, columnViewportIndex);
                    return rect.getIntersect(x, y, width, height) || new Sheets.Rect(0, 0, 0, 0)
                };
                _FloatingObjectRenderManager.prototype._createViewportFloatingObjectLayoutModel = function(rowViewportIndex, columnViewportIndex, zoomFactor)
                {
                    var self = this,
                        sheet = self._sheet;
                    var model = new NamedObjectArray;
                    var floatingObjectArray = sheet._floatingObjectArray,
                        len = floatingObjectArray.length;
                    if (floatingObjectArray.length === 0)
                    {
                        return model
                    }
                    if (floatingObjectArray.isNeedToUpdateLayout)
                    {
                        floatingObjectArray._updateFloatingsObjectlayoutOnColumnRowChanged();
                        floatingObjectArray.isNeedToUpdateLayout = false
                    }
                    var sheetLayout = sheet._getSheetLayout(),
                        cachePool = sheet._cachePool,
                        colLayouts = sheet._getViewportColumnLayout(columnViewportIndex),
                        rowLayouts = sheet._getViewportRowLayout(rowViewportIndex);
                    if (colLayouts.length <= 0 || rowLayouts.length <= 0)
                    {
                        return model
                    }
                    var viewportLeftColLayout = colLayouts[0],
                        viewportRightColLayout = colLayouts[colLayouts.length - 1],
                        viewportTopRowLayout = rowLayouts[0],
                        viewportBottomRowLayout = rowLayouts[rowLayouts.length - 1];
                    for (var i = 0; i < len; i++)
                    {
                        var item = floatingObjectArray[i];
                        if (item.isVisible())
                        {
                            var x = 0,
                                startColumn = item.startColumn(),
                                startColumnLayout = colLayouts.findCol(startColumn);
                            if (startColumnLayout)
                            {
                                x = startColumnLayout.x
                            }
                            else if (startColumn < viewportLeftColLayout.col)
                            {
                                x = viewportLeftColLayout.x;
                                for (var c = viewportLeftColLayout.col - 1; c >= startColumn; c--)
                                {
                                    x -= cachePool.getZoomColWidth(c)
                                }
                            }
                            else
                            {
                                x = viewportRightColLayout.x;
                                for (var col = viewportRightColLayout.col + 1; col <= startColumn; col++)
                                {
                                    x += cachePool.getZoomColWidth(col)
                                }
                            }
                            x += item.startColumnOffset() * zoomFactor;
                            var y = 0,
                                startRow = item.startRow(),
                                startRowLayout = rowLayouts.findRow(startRow);
                            if (startRowLayout)
                            {
                                y = startRowLayout.y
                            }
                            else if (startRow < viewportTopRowLayout.row)
                            {
                                y = viewportTopRowLayout.y;
                                for (var r = viewportTopRowLayout.row - 1; r >= startRow; r--)
                                {
                                    y -= cachePool.getZoomRowHeight(r)
                                }
                            }
                            else
                            {
                                y = viewportBottomRowLayout.y;
                                for (var row = viewportBottomRowLayout.row + 1; row <= startRow; row++)
                                {
                                    y += cachePool.getZoomRowHeight(row)
                                }
                            }
                            y += item.startRowOffset() * zoomFactor;
                            var width = Math_floor(item.width() * zoomFactor);
                            var height = Math_floor(item.height() * zoomFactor);
                            model.push(new _FloatingObjectLayout(item.name(), x, y, width, height))
                        }
                    }
                    return model
                };
                return _FloatingObjectRenderManager
            })();
        Sheets._FloatingObjectRenderManager = _FloatingObjectRenderManager;
        var _FloatingObjectLayout = (function()
            {
                function _FloatingObjectLayout(name, x, y, width, height)
                {
                    var self = this;
                    self.name = name;
                    self.x = x;
                    self.y = y;
                    self.height = height;
                    self.width = width
                }
                return _FloatingObjectLayout
            })();
        Sheets._FloatingObjectLayout = _FloatingObjectLayout;
        var NamedObjectArray = (function(_super)
            {
                __extends(NamedObjectArray, _super);
                function NamedObjectArray()
                {
                    _super.call(this)
                }
                NamedObjectArray.prototype.remove = function(name)
                {
                    for (var i = 0; i < this.length; i++)
                    {
                        if (this[i].name === name)
                        {
                            this.splice(i, 1);
                            return
                        }
                    }
                };
                NamedObjectArray.prototype.find = function(name)
                {
                    for (var i = 0; i < this.length; i++)
                    {
                        if (this[i].name === name)
                        {
                            return this[i]
                        }
                    }
                    return keyword_null
                };
                NamedObjectArray.prototype.findByPropertyName = function(name)
                {
                    for (var i = 0; i < this.length; i++)
                    {
                        if (this[i]._name === name)
                        {
                            return this[i]
                        }
                    }
                    return keyword_null
                };
                return NamedObjectArray
            })(Sheets._XArray);
        Sheets.NamedObjectArray = NamedObjectArray
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

