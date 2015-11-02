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
        Sheets.feature("group", ["core.common", "core.stringResource"]);
        var keyword_null = null,
            keyword_undefined = undefined,
            Math_max = Math.max,
            Math_min = Math.min,
            const_undefined = "undefined",
            cssGroupForeColor = "gc-groupForeColor";
        (function(GroupState)
        {
            GroupState[GroupState["Expanded"] = 0] = "Expanded";
            GroupState[GroupState["Collapsed"] = 1] = "Collapsed"
        })(Sheets.GroupState || (Sheets.GroupState = {}));
        var GroupState = Sheets.GroupState;
        var RangeGroupInfo = (function()
            {
                function RangeGroupInfo(model, start, end, level)
                {
                    var self = this;
                    self.model = keyword_null;
                    self.children = keyword_null;
                    self.parent = keyword_null;
                    self.start = 0;
                    self.end = 0;
                    self.level = 0;
                    self.model = model;
                    self.start = start;
                    self.end = end;
                    self.level = level
                }
                RangeGroupInfo.prototype.getState = function()
                {
                    if (this.model)
                    {
                        return this.model.getState(this)
                    }
                    return 0
                };
                RangeGroupInfo.prototype.setState = function(value)
                {
                    if (this.model)
                    {
                        this.model.expand(this.level, value === 0)
                    }
                };
                RangeGroupInfo.prototype.contains = function(index)
                {
                    return (this.start <= index && index <= this.end)
                };
                RangeGroupInfo.prototype.addChild = function(child)
                {
                    var self = this;
                    if (child)
                    {
                        if (!self.children)
                        {
                            self.children = []
                        }
                        self.children.push(child);
                        child.parent = self
                    }
                };
                return RangeGroupInfo
            })();
        Sheets.RangeGroupInfo = RangeGroupInfo;
        var WorkingState = (function()
            {
                function WorkingState()
                {
                    this.count = 0
                }
                WorkingState.prototype.addRef = function()
                {
                    this.count++
                };
                WorkingState.prototype.release = function()
                {
                    this.count--
                };
                WorkingState.prototype.isWorking = function()
                {
                    return (this.count > 0)
                };
                return WorkingState
            })();
        Sheets.WorkingState = WorkingState;
        var RangeGroup = (function()
            {
                function RangeGroup(count)
                {
                    var self = this;
                    self.head = keyword_null;
                    self.tail = keyword_null;
                    self.items = keyword_null;
                    self._rootCached = keyword_null;
                    self.direction = 1;
                    self.suspendAddingGroup = new WorkingState;
                    self.items = new Array(count);
                    self._empty = true
                }
                RangeGroup.prototype.setDirection = function(direction)
                {
                    this.direction = direction
                };
                RangeGroup.prototype.getDirection = function()
                {
                    return this.direction
                };
                RangeGroup.prototype._getCount = function()
                {
                    var items = this.items;
                    if (items)
                    {
                        return items.length
                    }
                    return 0
                };
                RangeGroup.prototype.group = function(index, count)
                {
                    var self = this;
                    if (!self._isIndexValid(index))
                    {
                        throw new Error(Sheets.SR.Exp_InvalidIndex);
                    }
                    if (!self._isIndexValid(index + count - 1))
                    {
                        throw new Error(Sheets.SR.Exp_InvalidCount);
                    }
                    self._rootCached = keyword_null;
                    for (var n = 0; n < count; n++)
                    {
                        var currentN = index + n;
                        var modelCurrentN = self._getModelIndexFromViewIndex(currentN);
                        if (!self.items[modelCurrentN])
                        {
                            self.items[modelCurrentN] = new RangeGroupItemInfo
                        }
                        else
                        {
                            self.items[modelCurrentN].level++
                        }
                    }
                    self._rootCached = self.createRangeGroup();
                    self._empty = false
                };
                RangeGroup.prototype.ungroupRange = function(index, count)
                {
                    var self = this;
                    if (!self._isIndexValid(index))
                    {
                        throw new Error(Sheets.SR.Exp_InvalidIndex);
                    }
                    if (!self._isIndexValid(index + count - 1))
                    {
                        throw new Error(Sheets.SR.Exp_InvalidCount);
                    }
                    var shouldClearSummaryItemInfo = false;
                    var group = keyword_null;
                    var summaryItemIndex = -1;
                    if (self.direction === 1)
                    {
                        summaryItemIndex = index + count;
                        shouldClearSummaryItemInfo = self._isIndexValid(summaryItemIndex);
                        if (shouldClearSummaryItemInfo)
                        {
                            var si = index + count - 1;
                            var lastN = si;
                            var modelLast = keyword_null;
                            do
                            {
                                var modelLastN = self._getModelIndexFromViewIndex(si);
                                modelLast = self.items[modelLastN];
                                if (modelLast !== keyword_undefined && modelLast !== keyword_null)
                                {
                                    lastN = si
                                }
                                si--
                            } while ((modelLast === keyword_undefined || modelLast === keyword_null) && si >= index);
                            if (modelLast !== keyword_undefined && modelLast !== keyword_null)
                            {
                                group = self._findImp(self._rootCached, lastN, modelLast.level);
                                if (group)
                                {
                                    summaryItemIndex = group.end + 1
                                }
                                shouldClearSummaryItemInfo = (group && (group.end === (index + count - 1) || self.getState(group) === 1))
                            }
                        }
                    }
                    else if (self.direction === 0)
                    {
                        summaryItemIndex = index - 1;
                        shouldClearSummaryItemInfo = self._isIndexValid(summaryItemIndex);
                        if (shouldClearSummaryItemInfo)
                        {
                            var si1 = index;
                            var firstN = si1;
                            var modelFirst = keyword_null;
                            do
                            {
                                var modelFirstN = self._getModelIndexFromViewIndex(si1);
                                modelFirst = self.items[modelFirstN];
                                if (modelFirst !== keyword_undefined && modelFirst !== keyword_null)
                                {
                                    firstN = si1
                                }
                                si1++
                            } while ((modelFirst === keyword_undefined || modelFirst === keyword_null) && si1 < index + count);
                            if (modelFirst !== keyword_undefined && modelFirst !== keyword_null)
                            {
                                group = self._findImp(self._rootCached, firstN, modelFirst.level);
                                if (group)
                                {
                                    summaryItemIndex = group.start - 1
                                }
                                shouldClearSummaryItemInfo = (group && ((group.start === index) || self.getState(group) === 1))
                            }
                        }
                    }
                    self._rootCached = keyword_null;
                    for (var n = 0; n < count; n++)
                    {
                        var currentN = index + n;
                        var modelCurrentN = self._getModelIndexFromViewIndex(currentN);
                        if (self.items[modelCurrentN])
                        {
                            if (self.items[modelCurrentN].level > -1)
                            {
                                self.items[modelCurrentN].level--
                            }
                        }
                    }
                    if (shouldClearSummaryItemInfo)
                    {
                        var modelSearchN = self._getModelIndexFromViewIndex(summaryItemIndex);
                        var itemSearch = self.items[modelSearchN];
                        if (itemSearch)
                        {
                            if (itemSearch.level === group.level)
                            {
                                self.items[modelSearchN] = keyword_null
                            }
                        }
                    }
                    self._rootCached = self.createRangeGroup()
                };
                RangeGroup.prototype.ungroup = function()
                {
                    var self = this;
                    self._rootCached = keyword_null;
                    var count = self._getCount();
                    self.items = new Array(count);
                    self._rootCached = self.createRangeGroup();
                    self._empty = true
                };
                RangeGroup.prototype._expand = function(index, level, expand)
                {
                    if (!this._isIndexValid(index))
                    {
                        throw new Error(Sheets.SR.Exp_InvalidIndex);
                    }
                    if (level < -1)
                    {
                        throw new Error(Sheets.SR.Exp_InvalidLevel);
                    }
                    var group = this.find(index, level);
                    if (group)
                    {
                        this.expandGroup(group, expand)
                    }
                };
                RangeGroup.prototype.expand = function(level, expand)
                {
                    if (level < -1)
                    {
                        throw new Error(Sheets.SR.Exp_InvalidLevel);
                    }
                    var e = new GroupedItemIndexEnumerator(this);
                    while (e.moveNext())
                    {
                        this._expand(e.current, level, expand)
                    }
                };
                RangeGroup.prototype.expandGroup = function(groupInfo, expand)
                {
                    if (!groupInfo)
                    {
                        throw new Error(Sheets.SR.Exp_GroupInfoIsNull);
                    }
                    var summaryItemIndex = -1;
                    switch (this.direction)
                    {
                        case 0:
                            summaryItemIndex = groupInfo.start - 1;
                            break;
                        case 1:
                            summaryItemIndex = groupInfo.end + 1;
                            break
                    }
                    this.setCollapsed(summaryItemIndex, !expand)
                };
                RangeGroup.prototype.isCollapsed = function(index)
                {
                    var level = this.getLevel(index);
                    if (level > -1)
                    {
                        var group = this._findImp(this._rootCached, index, level);
                        while (group)
                        {
                            if (group.getState() === 1)
                            {
                                return true
                            }
                            group = group.parent
                        }
                    }
                    return false
                };
                RangeGroup.prototype.find = function(index, level)
                {
                    var rootCached = this._rootCached;
                    if (rootCached)
                    {
                        if (level === -1)
                        {
                            return rootCached
                        }
                        if (!this._isIndexValid(index))
                        {
                            throw new Error(Sheets.SR.Exp_InvalidIndex);
                        }
                        return this._findImp(rootCached, index, level)
                    }
                    return keyword_null
                };
                RangeGroup.prototype.getLevel = function(index)
                {
                    if (!this._isIndexValid(index))
                    {
                        throw new Error(Sheets.SR.Exp_InvalidIndex);
                    }
                    var modelIndex = this._getModelIndexFromViewIndex(index);
                    var item = this.items[modelIndex];
                    if (item)
                    {
                        return item.level
                    }
                    return -1
                };
                RangeGroup.prototype.getCollapsed = function(index)
                {
                    var modelIndex = this._getModelIndexFromViewIndex(index);
                    var item = this.items[modelIndex];
                    if (item)
                    {
                        return !!item.collapsed
                    }
                    return false
                };
                RangeGroup.prototype.setCollapsed = function(index, collapsed)
                {
                    var self = this;
                    var changed = false;
                    if (index < 0)
                    {
                        var head = self.head;
                        if (!head)
                        {
                            head = self.head = new RangeGroupItemInfo
                        }
                        if (head.collapsed !== collapsed)
                        {
                            head.collapsed = collapsed;
                            changed = true
                        }
                    }
                    else if (index > -1 && index < self._getCount())
                    {
                        var modelIndex = self._getModelIndexFromViewIndex(index),
                            items = self.items,
                            item = items[modelIndex];
                        if (!item)
                        {
                            item = items[modelIndex] = new RangeGroupItemInfo;
                            item.level = -1
                        }
                        if (item.collapsed !== collapsed)
                        {
                            item.collapsed = collapsed;
                            changed = true
                        }
                    }
                    else if (index >= self._getCount())
                    {
                        var tail = self.tail;
                        if (!tail)
                        {
                            tail = self.tail = new RangeGroupItemInfo
                        }
                        if (tail.collapsed !== collapsed)
                        {
                            tail.collapsed = collapsed;
                            changed = true
                        }
                    }
                    if (changed)
                    {
                        self._rootCached = keyword_null;
                        self.refresh()
                    }
                };
                RangeGroup.prototype.getMaxLevel = function()
                {
                    var maxLevel = -1,
                        items = this.items,
                        length = items.length,
                        item,
                        itemLevel;
                    for (var index = 0; index < length; index++)
                    {
                        item = items[index];
                        itemLevel = (item && item.level);
                        if (typeof(itemLevel) !== const_undefined && itemLevel > maxLevel)
                        {
                            maxLevel = itemLevel
                        }
                    }
                    return maxLevel
                };
                RangeGroup.prototype._move = function(from, to, count)
                {
                    var self = this;
                    if (count > 0)
                    {
                        if (from < 0)
                        {
                            from = 0
                        }
                        if (to < 0)
                        {
                            to = 0
                        }
                        if (from === to)
                        {
                            return
                        }
                        var copiedItems = [];
                        var index = Sheets.ArrayHelper.nextNonEmptyIndex(self.items, from - 1);
                        while (index >= 0 && index < (from + count))
                        {
                            var copied = new RangeGroupItemInfo(self.items[index]);
                            copiedItems.push({
                                index: index - from, value: copied
                            });
                            index = Sheets.ArrayHelper.nextNonEmptyIndex(self.items, index)
                        }
                        Sheets.ArrayHelper.clear(self.items, from, count);
                        Sheets.ArrayHelper.clear(self.items, to, count);
                        if (copiedItems.length > 0)
                        {
                            for (var i = 0; i < copiedItems.length; i++)
                            {
                                var item = copiedItems[i];
                                self.items[to + item.index] = item.value
                            }
                        }
                        self._rootCached = keyword_null;
                        self.refresh()
                    }
                };
                RangeGroup.prototype._copy = function(from, to, count)
                {
                    var self = this;
                    if (count > 0)
                    {
                        if (from < 0)
                        {
                            from = 0
                        }
                        if (to < 0)
                        {
                            to = 0
                        }
                        if (from === to)
                        {
                            return
                        }
                        var copiedItems = [];
                        var index = Sheets.ArrayHelper.nextNonEmptyIndex(self.items, from - 1);
                        while (index >= 0 && index < (from + count))
                        {
                            var copied = new RangeGroupItemInfo(self.items[index]);
                            copiedItems.push({
                                index: index - from, value: copied
                            });
                            index = Sheets.ArrayHelper.nextNonEmptyIndex(self.items, index)
                        }
                        Sheets.ArrayHelper.clear(self.items, to, count);
                        if (copiedItems.length > 0)
                        {
                            for (var i = 0; i < copiedItems.length; i++)
                            {
                                var item = copiedItems[i];
                                self.items[to + item.index] = item.value
                            }
                        }
                        self._rootCached = keyword_null;
                        self.refresh()
                    }
                };
                RangeGroup.prototype._add = function(index, count)
                {
                    var self = this;
                    if (count > 0)
                    {
                        var modelIndex = self._getModelIndexFromViewIndex(index);
                        var addedGroupItem = modelIndex > 1 ? self.items[modelIndex - 1] : keyword_null;
                        for (var i = 0; i < count; i++)
                        {
                            self.items.splice(modelIndex, 0, !!addedGroupItem ? new RangeGroupItemInfo(addedGroupItem) : keyword_null)
                        }
                        if (!self.suspendAddingGroup.isWorking())
                        {
                            if (index > 0)
                            {
                                var modelIndexPrevious = self._getModelIndexFromViewIndex(index - 1);
                                var groupItemInfo = keyword_null;
                                if (modelIndexPrevious < 0)
                                {
                                    groupItemInfo = self.head
                                }
                                else
                                {
                                    groupItemInfo = self.items[modelIndexPrevious]
                                }
                                if (groupItemInfo)
                                {
                                    for (var i1 = 0; i1 < count; i1++)
                                    {
                                        self.items[index + i1] = new RangeGroupItemInfo({
                                            collapsed: groupItemInfo.collapsed, level: groupItemInfo.level
                                        })
                                    }
                                }
                            }
                        }
                        self._rootCached = keyword_null;
                        self.refresh()
                    }
                };
                RangeGroup.prototype._remove = function(index, count)
                {
                    if (count > 0)
                    {
                        this.items.splice(index, count);
                        this._rootCached = keyword_null;
                        this.refresh()
                    }
                };
                RangeGroup.prototype.equals = function(obj)
                {
                    var self = this;
                    var group = obj;
                    if (group)
                    {
                        if (!self.items && group.items && group.items.length > 0)
                        {
                            return false
                        }
                        if (!group.items && self.items && self.items.length > 0)
                        {
                            return false
                        }
                        if (!self.rangeGroupItemInfoEquals(self.head, group.head))
                        {
                            return false
                        }
                        if (!self.rangeGroupItemInfoEquals(self.tail, group.tail))
                        {
                            return false
                        }
                        if (self.items && group.items)
                        {
                            if (self.direction !== group.direction)
                            {
                                return false
                            }
                            if (self.items.length !== group.items.length)
                            {
                                return false
                            }
                            for (var i = 0; i < self.items.length; i++)
                            {
                                if ((!self.items[i] && group.items[i]) || (self.items[i] && !group.items[i]))
                                {
                                    return false
                                }
                            }
                        }
                        return true
                    }
                    return false
                };
                RangeGroup.prototype._isEmpty = function()
                {
                    return this._empty
                };
                RangeGroup.prototype.refresh = function()
                {
                    if (!this._isEmpty())
                    {
                        this._rootCached = this.createRangeGroup()
                    }
                };
                RangeGroup.prototype._setCount = function(count)
                {
                    var self = this;
                    if (!self.items)
                    {
                        self.items = new Array(count)
                    }
                    self._rootCached = keyword_null;
                    var currentCount = self._getCount();
                    if (count < currentCount)
                    {
                        self.items.splice(count, currentCount - count)
                    }
                    else if (count > currentCount)
                    {
                        var lastItem = self.items[self.items.length - 1];
                        if (lastItem)
                        {
                            for (var i = 0; i < count - currentCount; i++)
                            {
                                self.items.push(new RangeGroupItemInfo(lastItem))
                            }
                        }
                        else
                        {
                            self.items = self.items.concat(new Array(count - currentCount))
                        }
                    }
                    self.refresh()
                };
                RangeGroup.prototype.getState = function(group)
                {
                    var self = this;
                    var summaryItemIndex = -1;
                    switch (self.direction)
                    {
                        case 1:
                            summaryItemIndex = group.end + 1;
                            break;
                        case 0:
                            summaryItemIndex = group.start - 1;
                            break
                    }
                    var item = keyword_null,
                        itemCount = self._getCount();
                    if (summaryItemIndex < 0)
                    {
                        item = self.head
                    }
                    if (summaryItemIndex > -1 && summaryItemIndex < itemCount)
                    {
                        var viewIndex = self._getViewIndexFromModelIndex(summaryItemIndex);
                        item = self.items[viewIndex]
                    }
                    else if (summaryItemIndex >= itemCount)
                    {
                        item = self.tail
                    }
                    if (item && item.collapsed)
                    {
                        return 1
                    }
                    else
                    {
                        return 0
                    }
                };
                RangeGroup.prototype._setLevel = function(index, level)
                {
                    var self = this;
                    if (index < 0)
                    {
                        if (!self.head)
                        {
                            self.head = new RangeGroupItemInfo
                        }
                        self.head.level = level
                    }
                    else if (index > -1 && index < self._getCount())
                    {
                        var modelIndex = self._getModelIndexFromViewIndex(index);
                        if (!self.items[modelIndex])
                        {
                            self.items[modelIndex] = new RangeGroupItemInfo;
                            self.items[modelIndex].level = -1
                        }
                        self.items[modelIndex].level = level
                    }
                    else if (index >= self._getCount())
                    {
                        if (!self.tail)
                        {
                            self.tail = new RangeGroupItemInfo
                        }
                        self.tail.level = level
                    }
                    self._rootCached = keyword_null;
                    self.refresh()
                };
                RangeGroup.prototype.suspendAdding = function()
                {
                    this.suspendAddingGroup.addRef()
                };
                RangeGroup.prototype.resumeAdding = function()
                {
                    this.suspendAddingGroup.release()
                };
                RangeGroup.prototype._getViewIndexFromModelIndex = function(index)
                {
                    return index
                };
                RangeGroup.prototype._getModelIndexFromViewIndex = function(index)
                {
                    return index
                };
                RangeGroup.prototype.rangeGroupItemInfoEquals = function(item1, item2)
                {
                    if (!item1)
                    {
                        return !item2
                    }
                    else
                    {
                        if (!item2)
                        {
                            return false
                        }
                        return item1.level === item2.level && item1.collapsed === item2.collapsed
                    }
                };
                RangeGroup.prototype.createRangeGroup = function()
                {
                    var self = this;
                    var root = new RangeGroupInfo(self, 0, self._getCount() - 1, -1);
                    var e = new GroupedItemIndexEnumerator(self);
                    while (e.moveNext())
                    {
                        var group = self._createRangeGroup(e, 0);
                        if (group && group.level > -1)
                        {
                            root.addChild(group)
                        }
                    }
                    return root
                };
                RangeGroup.prototype._createRangeGroup = function(e, level)
                {
                    var self = this;
                    var currentGroup = keyword_null;
                    do
                    {
                        var index = e.current;
                        var modelIndex = self._getModelIndexFromViewIndex(index);
                        var item = self.items[modelIndex];
                        var indexNext = e.nextToCurrent();
                        if (item.level < level)
                        {
                            continue
                        }
                        else if (item.level >= level)
                        {
                            if (!currentGroup)
                            {
                                currentGroup = new RangeGroupInfo(self, index, index, level)
                            }
                        }
                        if (item.level > level)
                        {
                            var childGroup = self._createRangeGroup(e, level + 1);
                            if (e.current > -1)
                            {
                                index = e.current;
                                indexNext = e.nextToCurrent()
                            }
                            else
                            {
                                index = childGroup.end;
                                indexNext = -1
                            }
                            currentGroup.addChild(childGroup)
                        }
                        if (index > currentGroup.end)
                        {
                            currentGroup.end = index
                        }
                        if (self.isGroupEnd(index, indexNext, level))
                        {
                            return currentGroup
                        }
                    } while (e.moveNext());
                    return currentGroup
                };
                RangeGroup.prototype.isGroupEnd = function(index, indexNext, processLevel)
                {
                    var self = this;
                    var modelIndex = self._getModelIndexFromViewIndex(index);
                    var item = self.items[modelIndex];
                    if (!self._isIndexValid(indexNext))
                    {
                        return true
                    }
                    var modelIndexNext = self._getModelIndexFromViewIndex(indexNext);
                    var itemNext = self.items[modelIndexNext];
                    if (!itemNext)
                    {
                        return true
                    }
                    if (itemNext.level < item.level)
                    {
                        var offset1 = item.level - itemNext.level;
                        var offset2 = item.level - processLevel;
                        if (offset1 === offset2)
                        {
                            return false
                        }
                        if (offset2 >= 0 && offset2 < offset1)
                        {
                            return true
                        }
                    }
                    return false
                };
                RangeGroup.prototype._isIndexValid = function(index)
                {
                    return (index >= -1 && index < this._getCount())
                };
                RangeGroup.prototype._findImp = function(group, index, level)
                {
                    if (group)
                    {
                        var queue = [];
                        queue.unshift(group);
                        while (queue.length > 0)
                        {
                            group = queue.pop();
                            if (group.level === level && group.contains(index))
                            {
                                return group
                            }
                            var children = group.children,
                                childCount = (children && children.length);
                            if (childCount > 0)
                            {
                                for (var i = 0; i < childCount; i++)
                                {
                                    queue.unshift(children[i])
                                }
                            }
                        }
                    }
                    return keyword_null
                };
                RangeGroup.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this,
                        items = self.items;
                    if (settings.itemsData)
                    {
                        var length = settings.itemsData.length;
                        for (var i = 0; i < length; i++)
                        {
                            var item = settings.itemsData[i];
                            if (item.count > 0 && item.index >= 0 && item.info)
                            {
                                for (var k = 0; k < item.count; k++)
                                {
                                    if (item.index + k >= items.length)
                                    {
                                        break
                                    }
                                    items[item.index + k] = new RangeGroupItemInfo(item.info)
                                }
                                self._empty = false
                            }
                        }
                    }
                    if (settings.direction !== keyword_null && settings.direction !== keyword_undefined)
                    {
                        self.direction = settings.direction
                    }
                    if (settings.head)
                    {
                        self.head = settings.head
                    }
                    if (settings.tail)
                    {
                        self.tail = settings.tail
                    }
                    self._rootCached = keyword_null;
                    self.refresh()
                };
                RangeGroup.prototype.toJSON = function()
                {
                    var self = this;
                    var itemsData = [];
                    var k = -1;
                    var items = self.items;
                    for (var i = 0; i < items.length; i++)
                    {
                        if (items[i])
                        {
                            if (k >= 0 && i === itemsData[k].count + itemsData[k].index && items[i].level === itemsData[k].info.level && items[i].collapsed === itemsData[k].info.collapsed)
                            {
                                itemsData[k].count++
                            }
                            else
                            {
                                k++;
                                itemsData[k] = {
                                    index: i, count: 1, info: items[i]
                                }
                            }
                        }
                    }
                    var dictData = {
                            itemsData: itemsData, direction: self.direction, head: self.head, tail: self.tail
                        };
                    var sdata = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            sdata[item] = value
                        }
                    }
                    if ($.isEmptyObject(sdata))
                    {
                        return keyword_undefined
                    }
                    return sdata
                };
                RangeGroup.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"head":
                            return value === keyword_null;
                        case"tail":
                            return value === keyword_null;
                        case"direction":
                            return value === 1;
                        case"itemsData":
                            return value.length === 0;
                        default:
                            return false
                    }
                };
                return RangeGroup
            })();
        Sheets.RangeGroup = RangeGroup;
        var RangeGroupItemInfo = (function()
            {
                function RangeGroupItemInfo(info)
                {
                    var self = this;
                    if (self !== info && info)
                    {
                        self.level = info.level;
                        self.collapsed = info.collapsed
                    }
                    if (!info)
                    {
                        self.level = 0;
                        self.collapsed = false
                    }
                }
                return RangeGroupItemInfo
            })();
        Sheets.RangeGroupItemInfo = RangeGroupItemInfo;
        var GroupedItemIndexEnumerator = (function()
            {
                function GroupedItemIndexEnumerator(rangeGroup)
                {
                    this.isEOF = false;
                    this.rangeGroup = keyword_null;
                    this.current = -1;
                    this.rangeGroup = rangeGroup
                }
                GroupedItemIndexEnumerator.prototype.nextToCurrent = function()
                {
                    return this.current + 1
                };
                GroupedItemIndexEnumerator.prototype.moveNext = function()
                {
                    var self = this;
                    if (self.isEOF || !self.rangeGroup || !self.rangeGroup.items)
                    {
                        return false
                    }
                    var found = false;
                    for (var n = self.current + 1; n < self.rangeGroup.items.length; n++)
                    {
                        var modelIndex = self.rangeGroup._getModelIndexFromViewIndex(n);
                        if (self.rangeGroup.items[modelIndex])
                        {
                            found = true;
                            self.current = n;
                            break
                        }
                    }
                    if (!found)
                    {
                        self.current = -1
                    }
                    if (self.current > -1)
                    {
                        return true
                    }
                    else
                    {
                        self.isEOF = true;
                        return false
                    }
                };
                GroupedItemIndexEnumerator.prototype.reset = function()
                {
                    this.isEOF = false;
                    this.current = -1
                };
                return GroupedItemIndexEnumerator
            })();
        Sheets.GroupedItemIndexEnumerator = GroupedItemIndexEnumerator;
        var ThemeHelper = {
                getThemeBackgroundColor: function(sheet, defaultClass)
                {
                    var themeStyle = Sheets.Global.prototype.getExternalThemeStyle(0, defaultClass);
                    return themeStyle && themeStyle.backgroundColor
                }, getThemeForeColor: function(sheet, defaultClass)
                    {
                        var themeStyle = Sheets.Global.prototype.getExternalThemeStyle(0, defaultClass);
                        return themeStyle && themeStyle.color
                    }
            };
        var _RangeGroupPresenter = (function()
            {
                function _RangeGroupPresenter(sheet, rowGroup, viewportIndex, maxLevel)
                {
                    var self = this;
                    self.PADDING = 2;
                    self.LINE_SIZE = 2;
                    self.STARTLINE_SIZE = 6;
                    self._groupLineInfos = keyword_null;
                    self._groupDotInfos = keyword_null;
                    self._groupButtonInfos = keyword_null;
                    self._sheet = sheet;
                    self._rowGroup = rowGroup;
                    self._viewportIndex = viewportIndex;
                    if (typeof(maxLevel) === const_undefined)
                    {
                        if (rowGroup)
                        {
                            self._maxLevel = sheet.rowRangeGroup.getMaxLevel()
                        }
                        else
                        {
                            self._maxLevel = sheet.colRangeGroup.getMaxLevel()
                        }
                    }
                    else
                    {
                        self._maxLevel = maxLevel
                    }
                }
                _RangeGroupPresenter.prototype.createGroupInfo = function()
                {
                    var self = this;
                    self._groupLineInfos = [];
                    self._groupDotInfos = [];
                    self._groupButtonInfos = [];
                    var rowGroup = self._rowGroup,
                        maxLevel = self._maxLevel;
                    if (maxLevel !== -1)
                    {
                        var groupLayout = self._sheet._getGroupLayout(),
                            buttonSize = self._calcMinWidthOrHeight({
                                width: groupLayout.width, height: groupLayout.height
                            }, rowGroup),
                            groups = self.getGroupsByLevel(0, rowGroup),
                            groupCount = groups.length,
                            group;
                        if (groupCount > 0)
                        {
                            for (var i = 0; i < groupCount; i++)
                            {
                                group = groups[i];
                                self._measureGroups(group, buttonSize)
                            }
                        }
                    }
                };
                _RangeGroupPresenter.prototype.paintGroups = function(ctx)
                {
                    if (this._rowGroup)
                    {
                        this._paintRowGroups(ctx)
                    }
                    else
                    {
                        this._paintColumnGroups(ctx)
                    }
                };
                _RangeGroupPresenter.prototype._calcMinWidthOrHeight = function(finalSize, rowGroup)
                {
                    var size = 0,
                        maxLevel = this._maxLevel;
                    if (rowGroup)
                    {
                        size = (finalSize.width - this.PADDING * 2) / (maxLevel + 2)
                    }
                    else
                    {
                        size = (finalSize.height - this.PADDING * 2) / (maxLevel + 2)
                    }
                    size = Math_max(0, size);
                    return size
                };
                _RangeGroupPresenter.prototype._measureGroups = function(group, buttonSize)
                {
                    var self = this;
                    var rowGroup = self._rowGroup,
                        groupDirection = self.getGroupDirection(rowGroup),
                        viewportStart = self.getViewportStartIndex(rowGroup),
                        viewportEnd = self.getViewportEndIndex(rowGroup),
                        groupStartIndex = group.start,
                        groupEndIndex = group.end,
                        button,
                        buttonRowIndex,
                        i;
                    if (group.getState() === 0)
                    {
                        var needPaintingLine = true;
                        var parent = group.parent;
                        if (parent && ((groupDirection === 0 && groupStartIndex === parent.start) || (groupDirection === 1 && groupEndIndex === parent.end)))
                        {
                            needPaintingLine = false
                        }
                        if (needPaintingLine)
                        {
                            button = {
                                isExpanded: true, level: group.level, paintLine: true
                            };
                            if (groupDirection === 1)
                            {
                                buttonRowIndex = groupEndIndex + 1;
                                if (buttonRowIndex >= viewportStart && buttonRowIndex <= viewportEnd)
                                {
                                    button.index = buttonRowIndex;
                                    button.lineDirection = 1;
                                    self._groupButtonInfos.push(button)
                                }
                            }
                            else if (groupDirection === 0)
                            {
                                buttonRowIndex = groupStartIndex - 1;
                                if (buttonRowIndex >= viewportStart && buttonRowIndex <= viewportEnd)
                                {
                                    button.index = buttonRowIndex;
                                    button.lineDirection = 0;
                                    self._groupButtonInfos.push(button)
                                }
                            }
                        }
                        if (groupStartIndex <= viewportEnd && groupEndIndex >= viewportStart)
                        {
                            var start = Math_max(viewportStart, groupStartIndex);
                            var end = Math_min(viewportEnd, groupEndIndex);
                            if (needPaintingLine)
                            {
                                var groupLineInfo = {
                                        start: start, end: end, level: group.level, startLine: keyword_null
                                    };
                                if ((groupDirection === 1 && start === groupStartIndex) || (groupDirection === 0 && end === groupEndIndex))
                                {
                                    groupLineInfo.startLine = true
                                }
                                self._groupLineInfos.push(groupLineInfo)
                            }
                            var dots = [];
                            for (i = start; i <= end; i++)
                            {
                                dots.push(i)
                            }
                            var groupChildren = group.children,
                                groupChildrenCount = (groupChildren && groupChildren.length);
                            if (groupChildrenCount > 0)
                            {
                                for (i = 0; i < groupChildrenCount; i++)
                                {
                                    var childGroup = groupChildren[i],
                                        childGroupStart = childGroup.start,
                                        childGroupEnd = childGroup.end;
                                    if (childGroup.getState() === 1)
                                    {
                                        for (var j = childGroupStart; j <= childGroupEnd; j++)
                                        {
                                            Sheets.ArrayHelper.remove(dots, j)
                                        }
                                    }
                                    if (groupDirection === 1)
                                    {
                                        Sheets.ArrayHelper.remove(dots, childGroupEnd + 1)
                                    }
                                    else if (groupDirection === 0)
                                    {
                                        Sheets.ArrayHelper.remove(dots, childGroupStart - 1)
                                    }
                                    self._measureGroups(childGroup, buttonSize)
                                }
                            }
                            var needPaintingDot = true;
                            if (groupChildrenCount > 0)
                            {
                                for (var ci = 0; ci < groupChildrenCount; ci++)
                                {
                                    var child = groupChildren[ci];
                                    if (child)
                                    {
                                        var childStart = child.start,
                                            childEnd = child.end;
                                        if (childStart === groupStartIndex && childEnd === groupEndIndex)
                                        {
                                            needPaintingDot = false;
                                            break
                                        }
                                        else if ((groupDirection === 1 && childEnd === groupEndIndex) || (groupDirection === 0 && childStart === groupStartIndex))
                                        {
                                            for (var ic = childStart; ic <= childEnd; ic++)
                                            {
                                                Sheets.ArrayHelper.remove(dots, ic)
                                            }
                                        }
                                    }
                                }
                            }
                            if (needPaintingDot && dots.length > 0)
                            {
                                for (i = 0; i < dots.length; i++)
                                {
                                    var index = dots[i];
                                    var groupDotInfo = {
                                            index: index, level: group.level + 1
                                        };
                                    self._groupDotInfos.push(groupDotInfo)
                                }
                            }
                        }
                    }
                    else if (group.getState() === 1)
                    {
                        button = {
                            isExpanded: false, level: group.level
                        };
                        if (groupDirection === 1)
                        {
                            buttonRowIndex = groupEndIndex + 1;
                            if (buttonRowIndex >= viewportStart && buttonRowIndex <= viewportEnd)
                            {
                                button.index = buttonRowIndex;
                                button.lineDirection = 1;
                                self._groupButtonInfos.push(button)
                            }
                        }
                        else if (groupDirection === 0)
                        {
                            buttonRowIndex = groupStartIndex - 1;
                            if (buttonRowIndex >= viewportStart && buttonRowIndex <= viewportEnd)
                            {
                                button.index = buttonRowIndex;
                                button.lineDirection = 0;
                                self._groupButtonInfos.push(button)
                            }
                        }
                    }
                };
                _RangeGroupPresenter.prototype._paintRowGroups = function(ctx)
                {
                    var self = this;
                    var maxLevel = self._maxLevel;
                    if (maxLevel === -1)
                    {
                        return
                    }
                    var sheet = self._sheet,
                        groupLayout = sheet._getGroupLayout(),
                        itemWidth = self._calcMinWidthOrHeight({
                            width: groupLayout.width, height: groupLayout.height
                        }, true);
                    if (itemWidth === 0)
                    {
                        return
                    }
                    ctx.save();
                    var STARTLINE_SIZE = self.STARTLINE_SIZE,
                        PADDING = self.PADDING,
                        LINE_SIZE = self.LINE_SIZE,
                        offsetX = Math_max(0, (itemWidth - STARTLINE_SIZE) / 2) + PADDING,
                        columnX,
                        rowY,
                        i,
                        rowLayout,
                        rowLayoutModel = sheet._getRowLayout(self._viewportIndex, 3);
                    var groupDotInfos = self._groupDotInfos,
                        groupDotInfosCount = (groupDotInfos && groupDotInfos.length);
                    if (groupDotInfosCount > 0)
                    {
                        for (i = 0; i < groupDotInfosCount; i++)
                        {
                            var dot = groupDotInfos[i];
                            rowLayout = rowLayoutModel.findRow(dot.index);
                            if (rowLayout && rowLayout.height >= LINE_SIZE)
                            {
                                columnX = dot.level * itemWidth + offsetX;
                                rowY = rowLayout.y + Math_max(0, (rowLayout.height - LINE_SIZE) / 2);
                                var dotWidth = LINE_SIZE;
                                var dotHeight = LINE_SIZE;
                                ctx.fillStyle = ThemeHelper.getThemeForeColor(sheet, cssGroupForeColor);
                                ctx.fillRect(groupLayout.x + columnX + 0.5, groupLayout.y + rowY, dotWidth, dotHeight)
                            }
                        }
                    }
                    var rowGroupDirection = sheet.rowRangeGroup.direction,
                        groupLineInfos = self._groupLineInfos,
                        groupLineInfosCount = (groupLineInfos && groupLineInfos.length);
                    if (groupLineInfosCount > 0)
                    {
                        for (i = 0; i < groupLineInfosCount; i++)
                        {
                            var groupLineInfo = groupLineInfos[i];
                            var start = groupLineInfo.start,
                                end = groupLineInfo.end;
                            var startRowLayout = keyword_null,
                                endRowLayout = keyword_null;
                            do
                            {
                                startRowLayout = rowLayoutModel.findRow(start);
                                start++
                            } while (!startRowLayout && start <= end);
                            do
                            {
                                endRowLayout = rowLayoutModel.findRow(end);
                                end--
                            } while (!endRowLayout && end >= start);
                            if (!startRowLayout && !endRowLayout)
                            {
                                continue
                            }
                            else if (!startRowLayout && endRowLayout)
                            {
                                startRowLayout = endRowLayout
                            }
                            else if (startRowLayout && !endRowLayout)
                            {
                                endRowLayout = startRowLayout
                            }
                            columnX = groupLineInfo.level * itemWidth + offsetX;
                            rowY = startRowLayout.y;
                            if (rowGroupDirection === 1)
                            {
                                rowY += 1
                            }
                            var lineWidth = LINE_SIZE;
                            var lineHeight = Math_max(0, endRowLayout.y + endRowLayout.height - startRowLayout.y);
                            ctx.fillStyle = ThemeHelper.getThemeForeColor(sheet, cssGroupForeColor);
                            ctx.fillRect(groupLayout.x + columnX + 0.5, groupLayout.y + rowY, lineWidth, lineHeight);
                            var startLine = groupLineInfo.startLine;
                            if (startLine)
                            {
                                var startLineWidth = Math_min(STARTLINE_SIZE, itemWidth - LINE_SIZE);
                                if (startLineWidth > 0)
                                {
                                    if (rowGroupDirection === 0)
                                    {
                                        rowY = rowY + lineHeight - LINE_SIZE
                                    }
                                    if (rowY >= startRowLayout.y && rowY < endRowLayout.y + endRowLayout.height)
                                    {
                                        ctx.fillStyle = ThemeHelper.getThemeForeColor(sheet, cssGroupForeColor);
                                        ctx.fillRect(groupLayout.x + columnX + 0.5, groupLayout.y + rowY, startLineWidth, LINE_SIZE)
                                    }
                                }
                            }
                        }
                    }
                    var groupButtonInfos = self._groupButtonInfos,
                        groupButtonInfosCount = (groupButtonInfos && groupButtonInfos.length);
                    if (groupButtonInfosCount > 0)
                    {
                        for (i = 0; i < groupButtonInfosCount; i++)
                        {
                            var groupButtonInfo = groupButtonInfos[i];
                            rowLayout = rowLayoutModel.findRow(groupButtonInfo.index);
                            if ((!rowLayout) || (rowLayout && rowLayout.height <= 0))
                            {
                                continue
                            }
                            var heightOffSet = Math_max(0, (rowLayout.height - itemWidth) / 2);
                            columnX = groupButtonInfo.level * itemWidth + PADDING;
                            rowY = rowLayout.y + heightOffSet;
                            var btnWidth = itemWidth;
                            var btnHeight = Math_min(itemWidth, rowLayout.height);
                            ctx.strokeStyle = "gray";
                            ctx.lineWidth = 1;
                            ctx.strokeRect(groupLayout.x + columnX + 0.5, groupLayout.y + rowY, btnWidth, btnHeight);
                            if (!groupButtonInfo.isExpanded)
                            {
                                ctx.fillRect(groupLayout.x + columnX + btnWidth / 2 - 1 + 0.5, groupLayout.y + rowY + 4, 2, btnHeight - 8)
                            }
                            ctx.fillRect(groupLayout.x + columnX + 4 + 0.5, groupLayout.y + rowY + btnHeight / 2 - 1, btnWidth - 8, 2);
                            var btnLine = groupButtonInfo.paintLine;
                            if (btnLine && btnHeight < rowLayout.height)
                            {
                                columnX = groupButtonInfo.level * itemWidth + offsetX;
                                rowY = rowLayout.y;
                                var btnLineWidth = LINE_SIZE;
                                var btnLineHeight = heightOffSet;
                                if (groupButtonInfo.lineDirection === 0)
                                {
                                    rowY += heightOffSet + btnHeight;
                                    btnLineHeight = rowLayout.height - btnHeight - heightOffSet
                                }
                                ctx.fillStyle = ThemeHelper.getThemeForeColor(sheet, cssGroupForeColor);
                                ctx.fillRect(groupLayout.x + columnX + 0.5, groupLayout.y + rowY, btnLineWidth, btnLineHeight)
                            }
                        }
                    }
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.restore()
                };
                _RangeGroupPresenter.prototype._paintColumnGroups = function(ctx)
                {
                    var self = this;
                    var maxLevel = self._maxLevel;
                    if (maxLevel === -1)
                    {
                        return
                    }
                    var sheet = self._sheet,
                        groupLayout = sheet._getGroupLayout(),
                        itemHeight = self._calcMinWidthOrHeight({
                            width: groupLayout.width, height: groupLayout.height
                        }, false);
                    if (itemHeight === 0)
                    {
                        return
                    }
                    var STARTLINE_SIZE = self.STARTLINE_SIZE,
                        PADDING = self.PADDING,
                        LINE_SIZE = self.LINE_SIZE,
                        offsetY = Math_max(0, (itemHeight - STARTLINE_SIZE) / 2) + PADDING,
                        columnX,
                        rowY,
                        i,
                        columnLayout,
                        columnLayoutModel = sheet._getColumnLayout(self._viewportIndex, 3);
                    ctx.save();
                    var groupDotInfos = self._groupDotInfos,
                        groupDotInfosCount = groupDotInfos.length;
                    for (i = 0; i < groupDotInfosCount; i++)
                    {
                        var dot = groupDotInfos[i];
                        columnLayout = columnLayoutModel.findCol(dot.index);
                        if (columnLayout && columnLayout.width >= LINE_SIZE)
                        {
                            columnX = columnLayout.x + Math_max(0, (columnLayout.width - LINE_SIZE) / 2);
                            rowY = dot.level * itemHeight + offsetY;
                            var dotWidth = LINE_SIZE;
                            var dotHeight = LINE_SIZE;
                            ctx.fillStyle = ThemeHelper.getThemeForeColor(sheet, cssGroupForeColor);
                            ctx.fillRect(groupLayout.x + columnX, groupLayout.y + rowY + 0.5, dotWidth, dotHeight)
                        }
                    }
                    var columnGroupDirection = sheet.colRangeGroup.direction,
                        groupLineInfos = self._groupLineInfos,
                        groupLineInfosCount = groupLineInfos.length;
                    for (i = 0; i < groupLineInfosCount; i++)
                    {
                        var groupLineInfo = groupLineInfos[i];
                        var start = groupLineInfo.start,
                            end = groupLineInfo.end;
                        var startColumnLayout = keyword_null,
                            endColumnLayout = keyword_null;
                        do
                        {
                            startColumnLayout = columnLayoutModel.findCol(start);
                            start++
                        } while (!startColumnLayout && start <= end);
                        do
                        {
                            endColumnLayout = columnLayoutModel.findCol(end);
                            end--
                        } while (!endColumnLayout && end >= start);
                        if (!startColumnLayout && !endColumnLayout)
                        {
                            continue
                        }
                        else if (!startColumnLayout && endColumnLayout)
                        {
                            startColumnLayout = endColumnLayout
                        }
                        else if (startColumnLayout && !endColumnLayout)
                        {
                            endColumnLayout = startColumnLayout
                        }
                        columnX = startColumnLayout.x;
                        if (columnGroupDirection === 1)
                        {
                            columnX += 1
                        }
                        rowY = groupLineInfo.level * itemHeight + offsetY;
                        var lineWidth = Math_max(0, endColumnLayout.x + endColumnLayout.width - startColumnLayout.x);
                        var lineHeight = LINE_SIZE;
                        ctx.fillStyle = ThemeHelper.getThemeForeColor(sheet, cssGroupForeColor);
                        ctx.fillRect(groupLayout.x + columnX, groupLayout.y + rowY + 0.5, lineWidth, lineHeight);
                        var startLine = groupLineInfo.startLine;
                        if (startLine)
                        {
                            var startLineHeight = Math_min(STARTLINE_SIZE, itemHeight - LINE_SIZE);
                            if (startLineHeight > 0)
                            {
                                if (columnGroupDirection === 0)
                                {
                                    columnX = columnX + lineWidth - LINE_SIZE
                                }
                                if (columnX >= startColumnLayout.x && columnX < endColumnLayout.x + endColumnLayout.width)
                                {
                                    ctx.fillStyle = ThemeHelper.getThemeForeColor(sheet, cssGroupForeColor);
                                    ctx.fillRect(groupLayout.x + columnX, groupLayout.y + rowY + 0.5, LINE_SIZE, startLineHeight)
                                }
                            }
                        }
                    }
                    var groupButtonInfos = self._groupButtonInfos,
                        groupButtonInfosCount = groupButtonInfos.length;
                    for (i = 0; i < groupButtonInfosCount; i++)
                    {
                        var groupButtonInfo = groupButtonInfos[i];
                        columnLayout = columnLayoutModel.findCol(groupButtonInfo.index);
                        if ((!columnLayout) || (columnLayout && columnLayout.width <= 0))
                        {
                            continue
                        }
                        var widthOffSet = Math_max(0, (columnLayout.width - itemHeight) / 2);
                        columnX = columnLayout.x + widthOffSet;
                        rowY = groupButtonInfo.level * itemHeight + PADDING;
                        var btnWidth = Math_min(itemHeight, columnLayout.width);
                        var btnHeight = itemHeight;
                        ctx.strokeStyle = "gray";
                        ctx.lineWidth = 1;
                        ctx.strokeRect(groupLayout.x + columnX, groupLayout.y + rowY + 0.5, btnWidth, btnHeight);
                        if (!groupButtonInfo.isExpanded)
                        {
                            ctx.fillRect(groupLayout.x + columnX + btnWidth / 2 - 1, groupLayout.y + rowY + 4.5, 2, btnHeight - 8)
                        }
                        ctx.fillRect(groupLayout.x + columnX + 4, groupLayout.y + rowY + btnHeight / 2 - 0.5, btnWidth - 8, 2);
                        var paintLine = groupButtonInfo.paintLine;
                        if (paintLine && btnWidth < columnLayout.width)
                        {
                            columnX = columnLayout.x;
                            rowY = groupButtonInfo.level * itemHeight + offsetY;
                            var btnLineWidth = widthOffSet;
                            var btnLineHeight = LINE_SIZE;
                            if (groupButtonInfo.lineDirection === 0)
                            {
                                columnX += widthOffSet + btnWidth;
                                btnLineWidth = columnLayout.width - btnWidth - widthOffSet
                            }
                            ctx.fillStyle = ThemeHelper.getThemeForeColor(sheet, cssGroupForeColor);
                            ctx.fillRect(groupLayout.x + columnX, groupLayout.y + rowY + 0.5, btnLineWidth, btnLineHeight)
                        }
                    }
                    ctx.beginPath();
                    ctx.restore()
                };
                _RangeGroupPresenter.prototype.getRowOrColumnStartIndex = function(rowRange)
                {
                    var sheet = this._sheet,
                        viewportIndex = this._viewportIndex;
                    if (rowRange)
                    {
                        var rowLayoutModel = sheet._getRowLayout(viewportIndex);
                        if (rowLayoutModel && rowLayoutModel.length > 0)
                        {
                            var topIndex = rowLayoutModel[0].row;
                            return Math_max(0, topIndex - 1)
                        }
                    }
                    else
                    {
                        var colLayoutModel = sheet._getColumnLayout(viewportIndex);
                        if (colLayoutModel && colLayoutModel.length > 0)
                        {
                            var leftIndex = colLayoutModel[0].col;
                            return Math_min(0, leftIndex - 1)
                        }
                    }
                    return -1
                };
                _RangeGroupPresenter.prototype.getRowOrColumnCount = function(rowRange)
                {
                    var sheet = this._sheet,
                        viewportIndex = this._viewportIndex;
                    if (rowRange)
                    {
                        var rowLayoutModel = sheet._getRowLayout(viewportIndex);
                        if (rowLayoutModel && rowLayoutModel.length > 0)
                        {
                            var bottomIndex = rowLayoutModel[rowLayoutModel.length - 1].row;
                            return Math_min(sheet.getRowCount(), bottomIndex + 2)
                        }
                    }
                    else
                    {
                        var colLayoutModel = sheet._getColumnLayout(viewportIndex);
                        if (colLayoutModel && colLayoutModel.length > 0)
                        {
                            var rightIndex = colLayoutModel[colLayoutModel.length - 1].col;
                            return Math_min(sheet.getColumnCount(), rightIndex + 2)
                        }
                    }
                    return -1
                };
                _RangeGroupPresenter.prototype.getGroupsByLevel = function(level, rowRange)
                {
                    var self = this;
                    var groups = [],
                        index = self.getRowOrColumnStartIndex(rowRange),
                        count = self.getRowOrColumnCount(rowRange),
                        rangeGroup = (rowRange ? self._sheet.rowRangeGroup : self._sheet.colRangeGroup),
                        group;
                    while (index < count)
                    {
                        group = rangeGroup.find(index, level);
                        if (group)
                        {
                            index = group.end + 1;
                            groups.push(group)
                        }
                        else
                        {
                            index++
                        }
                    }
                    return groups
                };
                _RangeGroupPresenter.prototype.getGroupDirection = function(rowGroup)
                {
                    if (rowGroup)
                    {
                        return this._sheet.rowRangeGroup.direction
                    }
                    else
                    {
                        return this._sheet.colRangeGroup.direction
                    }
                };
                _RangeGroupPresenter.prototype.getViewportStartIndex = function(rowGroup)
                {
                    var sheet = this._sheet,
                        viewportIndex = this._viewportIndex;
                    if (rowGroup)
                    {
                        var rowLayoutModel = sheet._getRowLayout(viewportIndex);
                        if (rowLayoutModel && rowLayoutModel.length > 0)
                        {
                            return rowLayoutModel[0].row
                        }
                    }
                    else
                    {
                        var colLayoutModel = sheet._getColumnLayout(viewportIndex);
                        if (colLayoutModel && colLayoutModel.length > 0)
                        {
                            return colLayoutModel[0].col
                        }
                    }
                    return -1
                };
                _RangeGroupPresenter.prototype.getViewportEndIndex = function(rowGroup)
                {
                    var sheet = this._sheet,
                        viewportIndex = this._viewportIndex;
                    if (rowGroup)
                    {
                        var rowLayoutModel = sheet._getRowLayout(viewportIndex);
                        if (rowLayoutModel && rowLayoutModel.length > 0)
                        {
                            return rowLayoutModel[rowLayoutModel.length - 1].row
                        }
                    }
                    else
                    {
                        var colLayoutModel = sheet._getColumnLayout(viewportIndex);
                        if (colLayoutModel && colLayoutModel.length > 0)
                        {
                            return colLayoutModel[colLayoutModel.length - 1].col
                        }
                    }
                    return -1
                };
                _RangeGroupPresenter.prototype._processTouch = function(rect)
                {
                    if (rect && this._sheet._isTouchMode)
                    {
                        rect.x -= 2;
                        rect.y -= 2;
                        rect.width += 4;
                        rect.height += 4
                    }
                };
                _RangeGroupPresenter.prototype.getRowGroupButton = function(x, y)
                {
                    var self = this;
                    var maxLevel = self._maxLevel;
                    if (maxLevel === -1)
                    {
                        return keyword_null
                    }
                    var sheet = self._sheet,
                        groupLayout = sheet._getGroupLayout(),
                        itemWidth = self._calcMinWidthOrHeight({
                            width: groupLayout.width, height: groupLayout.height
                        }, true);
                    if (itemWidth === 0)
                    {
                        return keyword_null
                    }
                    var columnX,
                        rowY,
                        rowLayoutModel = sheet._getRowLayout(self._viewportIndex, 3),
                        groupButtonInfos = self._groupButtonInfos,
                        groupButtonInfosCount = (groupButtonInfos && groupButtonInfos.length);
                    if (groupButtonInfosCount > 0)
                    {
                        for (var i = 0; i < groupButtonInfosCount; i++)
                        {
                            var groupButtonInfo = groupButtonInfos[i];
                            var rowLayout = rowLayoutModel.findRow(groupButtonInfo.index);
                            if ((!rowLayout) || (rowLayout && rowLayout.height <= 0))
                            {
                                continue
                            }
                            var heightOffSet = Math_max(0, (rowLayout.height - itemWidth) / 2);
                            columnX = groupButtonInfo.level * itemWidth + self.PADDING;
                            rowY = rowLayout.y + heightOffSet;
                            var rectWidth = itemWidth,
                                rectHeight = Math_min(rectWidth, rowLayout.height);
                            var btnRect = new Sheets.Rect(groupLayout.x + columnX + 0.5, groupLayout.y + rowY + 0.5, rectWidth, rectHeight);
                            self._processTouch(btnRect);
                            if (btnRect.contains(x, y))
                            {
                                return groupButtonInfo
                            }
                        }
                    }
                    return keyword_null
                };
                _RangeGroupPresenter.prototype.getColGroupButton = function(x, y)
                {
                    var self = this;
                    var maxLevel = self._maxLevel;
                    if (maxLevel === -1)
                    {
                        return keyword_null
                    }
                    var sheet = self._sheet,
                        groupLayout = sheet._getGroupLayout(),
                        itemHeight = self._calcMinWidthOrHeight({
                            width: groupLayout.width, height: groupLayout.height
                        }, false);
                    if (itemHeight === 0)
                    {
                        return keyword_null
                    }
                    var columnX,
                        rowY,
                        columnLayoutModel = sheet._getColumnLayout(self._viewportIndex, 3),
                        groupButtonInfos = self._groupButtonInfos,
                        groupButtonInfosCount = (groupButtonInfos && groupButtonInfos.length);
                    if (groupButtonInfosCount > 0)
                    {
                        for (var i = 0; i < groupButtonInfosCount; i++)
                        {
                            var groupButtonInfo = groupButtonInfos[i];
                            var columnLayout = columnLayoutModel.findCol(groupButtonInfo.index);
                            if ((!columnLayout) || (columnLayout && columnLayout.width <= 0))
                            {
                                continue
                            }
                            var widthOffSet = Math_max(0, (columnLayout.width - itemHeight) / 2);
                            columnX = columnLayout.x + widthOffSet;
                            rowY = groupButtonInfo.level * itemHeight + self.PADDING;
                            var rectHeight = itemHeight,
                                rectWidth = Math_min(rectHeight, columnLayout.width);
                            var btnRect = new Sheets.Rect(groupLayout.x + columnX + 0.5, groupLayout.y + rowY + 0.5, rectWidth, rectHeight);
                            self._processTouch(btnRect);
                            if (btnRect.contains(x, y))
                            {
                                return groupButtonInfo
                            }
                        }
                    }
                    return keyword_null
                };
                return _RangeGroupPresenter
            })();
        Sheets._RangeGroupPresenter = _RangeGroupPresenter;
        var _RangeGroupHeaderPresenter = (function()
            {
                function _RangeGroupHeaderPresenter(sheet, rowGroup, maxLevel)
                {
                    var self = this;
                    self._sheet = keyword_null;
                    self._rowGroup = keyword_null;
                    self._maxLevel = -1;
                    self.PADDING = 2;
                    self._sheet = sheet;
                    self._rowGroup = rowGroup;
                    if (typeof(maxLevel) === const_undefined)
                    {
                        if (rowGroup)
                        {
                            self._maxLevel = sheet.rowRangeGroup.getMaxLevel()
                        }
                        else
                        {
                            self._maxLevel = sheet.colRangeGroup.getMaxLevel()
                        }
                    }
                    else
                    {
                        self._maxLevel = maxLevel
                    }
                }
                _RangeGroupHeaderPresenter.prototype.paintGroupHeader = function(ctx)
                {
                    var self = this;
                    var sheet = self._sheet,
                        maxLevel = self._maxLevel;
                    if (!sheet || maxLevel < 0)
                    {
                        return
                    }
                    var rowGroup = self._rowGroup,
                        groupLayout = sheet._getGroupLayout(),
                        minSize = self._calcMinWidthOrHeight({
                            width: groupLayout.width, height: groupLayout.height
                        }, rowGroup);
                    if (minSize === 0)
                    {
                        return
                    }
                    var buttonCount = maxLevel + 2,
                        columnX,
                        rowY,
                        i,
                        rectSize,
                        rectX,
                        rectY,
                        text,
                        textWidth,
                        textHeight,
                        layout = sheet._getSheetLayout();
                    ctx.fillStyle = ThemeHelper.getThemeBackgroundColor(sheet, "gc-groupHeaderBackground");
                    ctx.strokeStyle = "gray";
                    ctx.font = "8.25pt Arial";
                    ctx.lineWidth = 1;
                    if (rowGroup)
                    {
                        ctx.fillRect(groupLayout.x, groupLayout.y, groupLayout.width, layout.height);
                        ctx.strokeRect(groupLayout.x - 0.5, groupLayout.y - 0.5, groupLayout.width, layout.height + 1);
                        ctx.strokeRect(groupLayout.x - 0.5, layout.headerY - 0.5, groupLayout.width, layout.colHeaderHeight);
                        ctx.fillStyle = ThemeHelper.getThemeForeColor(sheet, cssGroupForeColor);
                        if (sheet.colHeaderVisible && layout.colHeaderHeight >= minSize)
                        {
                            columnX = self.PADDING;
                            rowY = Math_max(0, layout.headerY + (layout.colHeaderHeight - minSize) / 2);
                            for (i = 0; i < buttonCount; i++)
                            {
                                rectSize = minSize - 1;
                                rectX = groupLayout.x + columnX + 0.5;
                                rectY = groupLayout.y + rowY;
                                ctx.strokeRect(rectX, rectY, rectSize, rectSize);
                                text = "" + (i + 1);
                                textWidth = ctx.measureText(text).width;
                                textHeight = sheet._getFontHeight(ctx.font);
                                if (rectSize >= textWidth && minSize >= textHeight)
                                {
                                    ctx.textBaseline = "middle";
                                    ctx.fillText(text, rectX + (rectSize - textWidth) / 2, rectY + rectSize / 2)
                                }
                                columnX += minSize
                            }
                        }
                    }
                    else
                    {
                        ctx.fillRect(groupLayout.x, groupLayout.y, layout.width, groupLayout.height);
                        ctx.strokeRect(groupLayout.x - 0.5, groupLayout.y - 0.5, layout.width + 1, groupLayout.height);
                        ctx.strokeRect(layout.headerX - 0.5, groupLayout.y - 0.5, layout.rowHeaderWidth, groupLayout.height);
                        ctx.fillStyle = ThemeHelper.getThemeForeColor(sheet, cssGroupForeColor);
                        if (sheet.rowHeaderVisible && layout.rowHeaderWidth >= minSize)
                        {
                            columnX = Math_max(0, layout.headerX + (layout.rowHeaderWidth - minSize) / 2);
                            rowY = self.PADDING;
                            for (i = 0; i < buttonCount; i++)
                            {
                                rectSize = minSize - 1;
                                rectX = groupLayout.x + columnX;
                                rectY = groupLayout.y + rowY + 0.5;
                                ctx.strokeRect(rectX, rectY, rectSize, rectSize);
                                text = "" + (i + 1);
                                textWidth = ctx.measureText(text).width;
                                textHeight = sheet._getFontHeight(ctx.font);
                                if (rectSize >= textWidth && minSize >= textHeight)
                                {
                                    ctx.textBaseline = "middle";
                                    ctx.fillText(text, rectX + (rectSize - textWidth) / 2, rectY + rectSize / 2)
                                }
                                rowY += minSize
                            }
                        }
                    }
                };
                _RangeGroupHeaderPresenter.prototype.getGroupButton = function(x, y)
                {
                    var self = this;
                    var sheet = self._sheet,
                        maxLevel = self._maxLevel;
                    if (!sheet || maxLevel < 0)
                    {
                        return keyword_null
                    }
                    var rowGroup = self._rowGroup,
                        groupLayout = sheet._getGroupLayout(),
                        minSize = self._calcMinWidthOrHeight({
                            width: groupLayout.width, height: groupLayout.height
                        }, rowGroup);
                    if (minSize === 0)
                    {
                        return keyword_null
                    }
                    var buttonCount = maxLevel + 2,
                        columnX,
                        rowY,
                        i,
                        btnRect,
                        layout = sheet._getSheetLayout();
                    if (rowGroup)
                    {
                        if (sheet.colHeaderVisible && layout.colHeaderHeight >= minSize)
                        {
                            columnX = self.PADDING;
                            rowY = Math_max(0, layout.headerY + (layout.colHeaderHeight - minSize) / 2);
                            for (i = 0; i < buttonCount; i++)
                            {
                                btnRect = new Sheets.Rect(groupLayout.x + columnX, groupLayout.y + rowY, minSize, minSize);
                                if (btnRect.contains(x, y))
                                {
                                    return {index: i}
                                }
                                columnX += minSize
                            }
                        }
                    }
                    else
                    {
                        if (sheet.rowHeaderVisible && layout.rowHeaderWidth >= minSize)
                        {
                            columnX = Math_max(0, layout.headerX + (layout.rowHeaderWidth - minSize) / 2);
                            rowY = self.PADDING;
                            for (i = 0; i < buttonCount; i++)
                            {
                                btnRect = new Sheets.Rect(groupLayout.x + columnX, groupLayout.y + rowY, minSize, minSize);
                                if (btnRect.contains(x, y))
                                {
                                    return {index: i}
                                }
                                rowY += minSize
                            }
                        }
                    }
                    return keyword_null
                };
                _RangeGroupHeaderPresenter.prototype._calcMinWidthOrHeight = function(finalSize, rowGroup)
                {
                    var size = 0,
                        maxLevel = this._maxLevel;
                    if (rowGroup)
                    {
                        size = (finalSize.width - this.PADDING * 2) / (maxLevel + 2)
                    }
                    else
                    {
                        size = (finalSize.height - this.PADDING * 2) / (maxLevel + 2)
                    }
                    size = Math_max(0, size);
                    return size
                };
                return _RangeGroupHeaderPresenter
            })();
        Sheets._RangeGroupHeaderPresenter = _RangeGroupHeaderPresenter
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

