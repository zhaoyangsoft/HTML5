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
        Sheets.feature("binding", ["core.common"]);
        var keyword_null = null,
            keyword_undefined = undefined,
            const_undefined = "undefined",
            const_function = 'function',
            const_string = 'string';
        var CellBindingSource = (function()
            {
                function CellBindingSource(source)
                {
                    this._source = source;
                    this.__cellBindingSource__ = true
                }
                CellBindingSource.prototype.setValue = function(path, value)
                {
                    if (this._source && path)
                    {
                        _BindingHelper.setValueByPath(this._source, path, value)
                    }
                };
                CellBindingSource.prototype.getValue = function(path)
                {
                    if (this._source && path)
                    {
                        return _BindingHelper.getValueByPath(this._source, path)
                    }
                    return keyword_null
                };
                CellBindingSource.prototype.getSource = function()
                {
                    return this._source
                };
                return CellBindingSource
            })();
        Sheets.CellBindingSource = CellBindingSource;
        var _BindingManager = (function()
            {
                function _BindingManager(sheet)
                {
                    this._init();
                    this._sheet = sheet
                }
                _BindingManager.prototype.bind = function(ds)
                {
                    var self = this;
                    var oldDataSource = self._dataSource;
                    if (oldDataSource && $.isFunction(oldDataSource.dispose))
                    {
                        oldDataSource.dispose()
                    }
                    self._unSubscribeHandlers(self._dataSourceSubscriptions);
                    self._unSubscribeHandlers(self._dataItemSubscriptions);
                    self._init();
                    self._dataSource = ds;
                    if (ds)
                    {
                        self._dataSourceType = self._getDataSourceType(ds);
                        self._dataItemType = self.getDataItemType();
                        if (self._sheet)
                        {
                            if (ds.subscribe)
                            {
                                self._dataSourceSubscriptions.push(ds.subscribe(self._dataChangedhandler, self))
                            }
                            if (ds.currentPosition && ds.currentPosition.subscribe)
                            {
                                self._dataSourceSubscriptions.push(ds.currentPosition.subscribe(self._currentPositionChangedhandler, self))
                            }
                            self.doDataItemChanged()
                        }
                        self._fields = self._getFieldsInfo()
                    }
                };
                _BindingManager.prototype.doDataItemChanged = function()
                {
                    var self = this;
                    if (!self._sheet || !self._dataSource)
                    {
                        return
                    }
                    var sheet = self._sheet;
                    var dataItems = self._dataSource,
                        dsType = self._dataSourceType;
                    if (dataItems && $.type(window.ko) !== const_undefined)
                    {
                        self._unSubscribeHandlers(self._dataItemSubscriptions);
                        var item = keyword_null;
                        if (dsType === 3)
                        {
                            if (dataItems.currentPosition)
                            {
                                var activeIndex = sheet.getActiveRowIndex();
                                if (-1 <= activeIndex && activeIndex < dataItems.count())
                                {
                                    dataItems.currentPosition(activeIndex)
                                }
                            }
                            item = dataItems.currentItem()
                        }
                        else if (dsType === 4)
                        {}
                        else
                        {
                            item = dataItems[sheet.getActiveColumnIndex()]
                        }
                        if (item)
                        {
                            for (var x in item)
                            {
                                if (item[x] && $.isFunction(item[x].subscribe))
                                {
                                    self._dataItemSubscriptions.push(item[x].subscribe(self._activeDataItemChangedhandler, keyword_null, keyword_null))
                                }
                            }
                        }
                    }
                };
                _BindingManager.prototype._activeDataItemChangedhandler = function()
                {
                    if (this._sheet)
                    {
                        this._sheet.repaint()
                    }
                };
                _BindingManager.prototype._unSubscribeHandlers = function(subscriptions)
                {
                    if (subscriptions)
                    {
                        for (var i in subscriptions)
                        {
                            var s = subscriptions[i];
                            if (s && $.isFunction(s.dispose))
                            {
                                s.dispose()
                            }
                        }
                    }
                };
                _BindingManager.prototype.getRowCount = function()
                {
                    return this._getDataLength()
                };
                _BindingManager.prototype.getColumnCount = function()
                {
                    if (this._fields)
                    {
                        return this._fields.length
                    }
                    var ds = this._dataSource;
                    if (ds)
                    {
                        var drow = ds[0],
                            drowType = $.type(drow);
                        if (drowType === 'null' || drowType === 'string' || drowType === 'number')
                        {
                            return 1
                        }
                    }
                    return 0
                };
                _BindingManager.prototype.getSource = function()
                {
                    return this._dataSource
                };
                _BindingManager.prototype.getFields = function()
                {
                    return this._fields
                };
                _BindingManager.prototype.getDataItem = function(row)
                {
                    if (!this._dataSource)
                    {
                        return keyword_null
                    }
                    var ds = this._dataSource,
                        dsType = this._dataSourceType;
                    if (dsType === 1)
                    {
                        return ds[row]
                    }
                    else if (dsType === 4)
                    {
                        return keyword_null
                    }
                    else if (dsType === 2)
                    {
                        return ds()[row]
                    }
                    else if (dsType === 3)
                    {
                        return ds.item(row)
                    }
                    return keyword_null
                };
                _BindingManager.prototype.getDataItemType = function()
                {
                    if (!this._dataItemType)
                    {
                        var rowCount = this.getRowCount();
                        for (var i = 0; i < rowCount; i++)
                        {
                            var dataItem = this.getDataItem(i);
                            if (dataItem)
                            {
                                if (dataItem.entityAspect && dataItem.entityType)
                                {
                                    this._dataItemType = dataItem.entityType
                                }
                                this._dataItemType = dataItem.constructor;
                                break
                            }
                        }
                    }
                    return this._dataItemType
                };
                _BindingManager.prototype.getValue = function(row, col)
                {
                    var self = this,
                        noBindingValue = {
                            value: keyword_null, hasBinding: false
                        };
                    if (!self._dataSource)
                    {
                        return noBindingValue
                    }
                    var sheet = self._sheet,
                        const_function = 'function',
                        const_string = 'string';
                    var ds = self._dataSource,
                        dsType = self._dataSourceType;
                    var colInfo,
                        field;
                    if (dsType !== 4)
                    {
                        if (row < 0 || self.getRowCount() <= row)
                        {
                            return noBindingValue
                        }
                        var colCount = sheet ? sheet.getColumnCount() : self.getColumnCount();
                        if (col < 0 || colCount <= col)
                        {
                            return noBindingValue
                        }
                        if (sheet)
                        {
                            colInfo = sheet._sheetModelManager.getColInfos()._getItems()[col];
                            if (colInfo)
                            {
                                field = colInfo.name
                            }
                        }
                        else if (self._fields)
                        {
                            field = self._fields[col]
                        }
                    }
                    if (dsType === 1)
                    {
                        var drow = ds[row];
                        if (typeof(drow) === const_undefined || drow === keyword_null)
                        {
                            return noBindingValue
                        }
                        if (colInfo && typeof(colInfo.value) === const_function)
                        {
                            return {
                                    value: colInfo.value(drow), hasBinding: true
                                }
                        }
                        else if (field)
                        {
                            return {
                                    value: _BindingHelper.getValueByPath(drow, field), hasBinding: true
                                }
                        }
                        else if ($.type(drow) === const_string || $.isNumeric(drow))
                        {
                            if (col === 0)
                            {
                                return {
                                        value: drow, hasBinding: true
                                    }
                            }
                        }
                    }
                    else if (dsType === 2)
                    {
                        var drow = ds()[row];
                        if (typeof(drow) === const_undefined || drow === keyword_null)
                        {
                            return noBindingValue
                        }
                        if (colInfo && typeof(colInfo.value) === const_function)
                        {
                            return {
                                    value: colInfo.value(drow), hasBinding: true
                                }
                        }
                        else if (field)
                        {
                            return {
                                    value: _BindingHelper.getValueByPath(drow, field), hasBinding: true
                                }
                        }
                        else if ($.type(drow) === const_string || $.isNumeric(drow))
                        {
                            if (col === 0)
                            {
                                return {
                                        value: drow, hasBinding: true
                                    }
                            }
                        }
                    }
                    else if (dsType === 4)
                    {
                        var path = sheet ? sheet.getBindingPath(row, col) : keyword_null;
                        if (path)
                        {
                            return {
                                    value: ds.getValue(path), hasBinding: true
                                }
                        }
                    }
                    else if (dsType === 3)
                    {
                        var drow = ds.item(row);
                        if (typeof(drow) === const_undefined || drow === keyword_null)
                        {
                            return noBindingValue
                        }
                        if (colInfo && typeof(colInfo.value) === const_function)
                        {
                            return {
                                    value: colInfo.value(drow), hasBinding: true
                                }
                        }
                        else if (field)
                        {
                            return {
                                    value: ds.getProperty(drow, field), hasBinding: true
                                }
                        }
                    }
                    return noBindingValue
                };
                _BindingManager.prototype.setValue = function(row, col, value)
                {
                    var self = this;
                    if (!self._dataSource)
                    {
                        return false
                    }
                    var sheet = self._sheet;
                    var ds = self._dataSource,
                        dsType = self._dataSourceType,
                        DataSourceType = Sheets._DataSourceType;
                    var colInfo,
                        field;
                    if (dsType !== 4)
                    {
                        if (row < 0 || self.getRowCount() <= row)
                        {
                            return false
                        }
                        var colCount = sheet ? sheet.getColumnCount() : self.getColumnCount();
                        if (col < 0 || colCount <= col)
                        {
                            return false
                        }
                        if (sheet)
                        {
                            colInfo = sheet._sheetModelManager.getColInfos()._getItems()[col];
                            if (colInfo)
                            {
                                field = colInfo.name
                            }
                        }
                        else if (self._fields)
                        {
                            field = self._fields[col]
                        }
                    }
                    var valueSet = false;
                    if (dsType === 1)
                    {
                        var drow = ds[row];
                        if (drow !== keyword_null && typeof(drow) !== const_undefined)
                        {
                            if (colInfo && typeof(colInfo.value) === const_function)
                            {
                                colInfo.value(drow, value);
                                valueSet = true
                            }
                            else if (field)
                            {
                                _BindingHelper.setValueByPath(drow, field, value);
                                valueSet = true
                            }
                            else if ($.type(drow) === const_string || $.isNumeric(drow))
                            {
                                if (col === 0)
                                {
                                    ds[row] = value;
                                    valueSet = true
                                }
                            }
                        }
                    }
                    else if (dsType === 2)
                    {
                        var drow = ds()[row];
                        if (drow !== keyword_null && typeof(drow) !== const_undefined)
                        {
                            if (colInfo && typeof(colInfo.value) === const_function)
                            {
                                colInfo.value(drow, value);
                                valueSet = true
                            }
                            else if (field)
                            {
                                _BindingHelper.setValueByPath(drow, field, value);
                                valueSet = true
                            }
                            else if ($.type(drow) === const_string || $.isNumeric(drow))
                            {
                                if (col === 0)
                                {
                                    ds()[row] = value;
                                    valueSet = true
                                }
                            }
                        }
                    }
                    else if (dsType === 4)
                    {
                        var path = sheet ? sheet.getBindingPath(row, col) : keyword_null;
                        if (path)
                        {
                            ds.setValue(path, value);
                            valueSet = true
                        }
                    }
                    else if (dsType === 3)
                    {
                        var drow = ds.item(row);
                        if (drow !== keyword_null && typeof(drow) !== const_undefined)
                        {
                            if (colInfo && typeof(colInfo.value) === const_function)
                            {
                                colInfo.value(drow, value);
                                valueSet = true
                            }
                            else if (field)
                            {
                                ds.setProperty(drow, field, value);
                                valueSet = true
                            }
                        }
                    }
                    return valueSet
                };
                _BindingManager.prototype.addItems = function(row, count)
                {
                    var self = this;
                    if (!self._dataSource || row > self.getRowCount())
                    {
                        return
                    }
                    var ds = self._dataSource,
                        dsType = self._dataSourceType;
                    var itemType = self.getDataItemType();
                    if (dsType === 3)
                    {
                        if (!self._dataViewUpdating)
                        {
                            self._updatingDataView = true;
                            if (itemType)
                            {
                                for (var i = 0; i < count; i++)
                                {
                                    var newItem = itemType.createEntity ? itemType.createEntity() : new itemType;
                                    ds.add(newItem)
                                }
                                ds.commitEdit()
                            }
                            self._updatingDataView = false
                        }
                    }
                    else if (dsType === 4)
                    {}
                    else
                    {
                        for (var i = 0; i < count; i++)
                        {
                            if (itemType)
                            {
                                var newItem = itemType.createEntity ? itemType.createEntity() : new itemType;
                                ds.splice(row, 0, newItem)
                            }
                            else
                            {
                                ds.splice(row, 0, keyword_null)
                            }
                        }
                    }
                };
                _BindingManager.prototype.removeItems = function(row, count)
                {
                    var self = this;
                    var rowCount = self.getRowCount();
                    if (!self._dataSource || row >= rowCount)
                    {
                        return
                    }
                    var ds = self._dataSource,
                        dsType = self._dataSourceType;
                    var removeCount = Math.min(count, rowCount - row);
                    if (dsType === 3)
                    {
                        if (!self._dataViewUpdating)
                        {
                            self._updatingDataView = true;
                            for (var r = 0; r < removeCount; r++)
                            {
                                ds.remove(ds.item(row))
                            }
                            self._updatingDataView = false
                        }
                    }
                    else if (dsType === 4)
                    {}
                    else
                    {
                        if (row < rowCount)
                        {
                            ds.splice(row, removeCount)
                        }
                    }
                };
                _BindingManager.isDataViewSource = function(ds)
                {
                    var wijmoTmp = window.wijmo;
                    return (wijmoTmp && wijmoTmp.data && wijmoTmp.data.isDataView && wijmoTmp.data.isDataView(ds))
                };
                _BindingManager.isCellBindingSource = function(ds)
                {
                    return ((CellBindingSource && ds instanceof CellBindingSource) || (ds && ds.hasOwnProperty("__cellBindingSource__")))
                };
                _BindingManager.prototype._init = function()
                {
                    var self = this;
                    self._dataSource = keyword_null;
                    self._dataSourceType = 0;
                    self._dataItemType = keyword_null;
                    self._fields = keyword_null;
                    self._dataSourceSubscriptions = [];
                    self._dataItemSubscriptions = []
                };
                _BindingManager.prototype._getDataSourceType = function(ds)
                {
                    if (ds)
                    {
                        var ko = window.ko;
                        if (_BindingManager.isDataViewSource(ds))
                        {
                            return 3
                        }
                        else if (ko && ko.isObservable(ds))
                        {
                            return 2
                        }
                        else if (_BindingManager.isCellBindingSource(ds))
                        {
                            return 4
                        }
                        else if (ds && !isNaN(ds.length))
                        {
                            return 1
                        }
                    }
                    return 0
                };
                _BindingManager.prototype._getDataLength = function()
                {
                    var ds = this._dataSource,
                        dsType = this._dataSourceType;
                    if (!ds)
                    {
                        return 0
                    }
                    var rc = 0;
                    if (dsType === 1)
                    {
                        rc = ds.length
                    }
                    else if (dsType === 2)
                    {
                        rc = ds().length
                    }
                    else if (dsType === 4)
                    {}
                    else if (dsType === 3)
                    {
                        rc = ds.count()
                    }
                    return rc
                };
                _BindingManager.prototype._getFieldsInfo = function()
                {
                    var self = this;
                    var ds = self._dataSource,
                        dsType = self._dataSourceType;
                    var rc = 0,
                        cc = 0,
                        fields = keyword_null;
                    if (dsType === 1)
                    {
                        rc = ds.length;
                        if (rc > 0)
                        {
                            var ps = self._getProperties(ds[0]);
                            if (ps && ps.length > 0)
                            {
                                cc = ps.length;
                                fields = [];
                                for (var i = 0; i < cc; i++)
                                {
                                    fields.push(ps[i])
                                }
                            }
                        }
                    }
                    else if (dsType === 2)
                    {
                        rc = ds().length;
                        if (rc > 0)
                        {
                            var ps = self._getProperties(ds()[0]);
                            if (ps && ps.length > 0)
                            {
                                cc = ps.length;
                                fields = [];
                                for (var i = 0; i < cc; i++)
                                {
                                    fields.push(ps[i])
                                }
                            }
                        }
                    }
                    else if (dsType === 4)
                    {}
                    else if (dsType === 3)
                    {
                        rc = ds.count();
                        var ps = ds.getProperties();
                        if (ps && ps.length > 0)
                        {
                            cc = ps.length;
                            fields = [];
                            for (var i = 0; i < cc; i++)
                            {
                                fields.push(ps[i].name)
                            }
                        }
                    }
                    return fields
                };
                _BindingManager.prototype._getProperties = function(t)
                {
                    var ko = window.ko;
                    var r = [];
                    for (var n in t)
                    {
                        if (!$.isFunction(t[n]))
                        {
                            r.push(n)
                        }
                        else if (typeof(ko) !== const_undefined && ko.isObservable(t[n]))
                        {
                            r.push(n)
                        }
                    }
                    return r
                };
                _BindingManager.prototype._dataChangedhandler = function(context)
                {
                    var self = this;
                    if (self._updatingDataView)
                    {
                        return
                    }
                    if (!self._sheet)
                    {
                        return
                    }
                    var sheet = self._sheet;
                    sheet._bindToAutoRefresh(function(context)
                    {
                        if (context)
                        {
                            self._dataViewUpdating = true;
                            if (!isNaN(context.length))
                            {
                                sheet._setRowCountInternal(context.length);
                                if ((self._fields === keyword_null || self._fields === undefined) && sheet._sheetModelManager.getColInfos()._getItems().length === 0)
                                {
                                    self._fields = self._getFieldsInfo();
                                    sheet.setColumnCount(self.getColumnCount());
                                    var colInfos = sheet._sheetModelManager.getColInfos();
                                    var fields = self.getFields();
                                    if (fields)
                                    {
                                        for (var i = 0, fieldCount = fields.length; i < fieldCount; i++)
                                        {
                                            colInfos._setItem(i, {name: fields[i]})
                                        }
                                    }
                                }
                            }
                            self._dataViewUpdating = false
                        }
                    })(context)
                };
                _BindingManager.prototype._currentPositionChangedhandler = function(context)
                {
                    var self = this;
                    if (!self._dataSource || !self._sheet)
                    {
                        return
                    }
                    var sheet = self._sheet,
                        ds = self._dataSource;
                    sheet._bindToAutoRefresh(function(context)
                    {
                        if (ds.currentPosition)
                        {
                            var pos = ds.currentPosition();
                            if (sheet._activeRowIndex !== pos)
                            {
                                sheet._setActiveCellAndSelection(pos, sheet._activeColIndex, keyword_undefined, keyword_undefined, 2)
                            }
                        }
                    })(context)
                };
                _BindingManager.prototype.toJSON = function()
                {
                    var ds = this._dataSource;
                    if (!ds)
                    {
                        return keyword_null
                    }
                    var type = this._dataSourceType;
                    if (type === 2)
                    {
                        ds = ds()
                    }
                    else if (type === 4)
                    {
                        ds = ds.getSource()
                    }
                    else if (type === 3)
                    {
                        ds = ds.local
                    }
                    return {
                            type: type, source: ds
                        }
                };
                _BindingManager.prototype.fromJSON = function(jsData, isNoneSchema)
                {
                    var ds = (jsData && jsData.source);
                    if (!ds)
                    {
                        return
                    }
                    var type = jsData.type;
                    if (type === 2)
                    {
                        var ko = window.ko;
                        if (ko && ko.observableArray)
                        {
                            this.bind(ko.observableArray(ds))
                        }
                    }
                    else if (type === 4)
                    {
                        this.bind(new CellBindingSource(ds))
                    }
                    else
                    {
                        this.bind(ds)
                    }
                };
                return _BindingManager
            })();
        Sheets._BindingManager = _BindingManager;
        var _BindingHelper = (function()
            {
                function _BindingHelper(){}
                _BindingHelper.setValueByPath = function(obj, path, value)
                {
                    if (!obj || !path)
                    {
                        return
                    }
                    var ko = window.ko,
                        const_function = 'function';
                    var subpaths = path.split("."),
                        subpathCount = subpaths.length;
                    for (var i = 0; i < subpathCount; i++)
                    {
                        var p = subpaths[i];
                        if (!obj)
                        {
                            break
                        }
                        if (i === subpathCount - 1)
                        {
                            if (typeof(obj[p]) === const_function)
                            {
                                if (typeof(ko) === const_undefined || !ko.isObservable(obj[p]) || ko.isWriteableObservable(obj[p]))
                                {
                                    obj[p](value)
                                }
                            }
                            else
                            {
                                obj[p] = value
                            }
                        }
                        else
                        {
                            if (typeof(obj[p]) === const_function)
                            {
                                obj = obj[p]()
                            }
                            else
                            {
                                obj = obj[p]
                            }
                        }
                    }
                };
                _BindingHelper.getValueByPath = function(obj, path)
                {
                    if (!obj || !path)
                    {
                        return keyword_null
                    }
                    var subpaths = path.split("."),
                        subpathCount = subpaths.length;
                    var i = 0;
                    do
                    {
                        var p = subpaths[i];
                        if (typeof(obj[p]) === 'function')
                        {
                            obj = obj[p]()
                        }
                        else
                        {
                            obj = obj[p]
                        }
                        if (obj === keyword_null || typeof(obj) === const_undefined)
                        {
                            return keyword_null
                        }
                    } while (++i < subpathCount);
                    return obj
                };
                return _BindingHelper
            })();
        Sheets._BindingHelper = _BindingHelper
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

