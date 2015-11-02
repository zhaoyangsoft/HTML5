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
        Sheets.feature("basedialog", ["core.common"]);
        var BaseDialog = (function()
            {
                function BaseDialog(zindex)
                {
                    var self = this;
                    self._wijpopupClass = "wijspread-popup";
                    self._overlayClass = "wijspread-overlay";
                    zindex = zindex || 0;
                    self.defaultOverlayCSS = {
                        position: "fixed", width: "100%", height: "100%", margin: 0, padding: 0, top: 0, left: 0, border: "none", zIndex: zindex, backgroundColor: "rgba(0,0,0,0)"
                    };
                    self.defaultContainerCSS = {
                        position: "absolute", padding: 0, margin: 0, height: "auto", zIndex: zindex + 1, outline: "none"
                    };
                    self._init()
                }
                BaseDialog.prototype._init = function()
                {
                    var self = this;
                    if (!self._hasTargetContainer(self._name))
                    {
                        self._name = self._generateName();
                        self.container = $("<div></div>").addClass(self._wijpopupClass + " ui-widget").attr({
                            id: self._name, tabIndex: -1
                        }).css(self.defaultContainerCSS)
                    }
                    else
                    {
                        self.container = $("#" + self._name)
                    }
                };
                BaseDialog.prototype._generateName = function()
                {
                    var num = 0;
                    var prefix = "dialog";
                    while (this._hasTargetContainer(prefix + num))
                    {
                        num++
                    }
                    return prefix + num
                };
                BaseDialog.prototype.getContainer = function()
                {
                    if (this.container)
                    {
                        return this.container
                    }
                };
                BaseDialog.prototype.show = function(speed, effect, callback)
                {
                    var self = this,
                        argumentsLength = arguments.length,
                        container = self.container;
                    if (!self._hasOverlay())
                    {
                        self._createOverlay()
                    }
                    window.gcGlobal.suspendEvent();
                    if (!self._hasTargetContainer(self._name))
                    {
                        $(document.body).append(container);
                        self.resetDialogPosition();
                        container.css("display", "none")
                    }
                    if (argumentsLength === 3)
                    {
                        if (effect === "slide")
                        {
                            container.slideDown(speed, callback)
                        }
                        else if (effect === "fade")
                        {
                            container.fadeIn(speed, callback)
                        }
                        else
                        {
                            container.show(speed, callback)
                        }
                    }
                    else if (argumentsLength === 2)
                    {
                        if (effect === "slide")
                        {
                            container.slideDown(speed)
                        }
                        else if (effect === "fade")
                        {
                            container.fadeIn(speed)
                        }
                        else
                        {
                            container.show(speed)
                        }
                    }
                    else if (argumentsLength === 1)
                    {
                        container.show(speed)
                    }
                    else
                    {
                        container.show()
                    }
                };
                BaseDialog.prototype.close = function()
                {
                    var self = this;
                    if (self._hasTargetContainer(self._name))
                    {
                        self.container.remove()
                    }
                    if (!$("." + self._wijpopupClass).is(":visible"))
                    {
                        self.closeOverlay()
                    }
                    window.gcGlobal.resumeEvent()
                };
                BaseDialog.prototype.closeOverlay = function()
                {
                    $("." + this._overlayClass).remove()
                };
                BaseDialog.prototype.resetDialogPosition = function()
                {
                    var container = this.container;
                    if (container.length === 0)
                    {
                        return
                    }
                    var left = parseInt(container.css("left"));
                    var top = parseInt(container.css("top"));
                    var dialogWidth = container.width();
                    var dialogHeight = container.height();
                    if (isNaN(left) || isNaN(top) || isNaN(dialogWidth) || isNaN(dialogHeight))
                    {
                        return
                    }
                    var bottomCross = 0,
                        rightCross = 0;
                    var clientWidth = document.documentElement.clientWidth;
                    var clientHeight = document.documentElement.clientHeight;
                    var pos = container.get(0).getBoundingClientRect();
                    if (pos.left + dialogWidth > clientWidth)
                    {
                        rightCross = pos.left + dialogWidth - clientWidth
                    }
                    if (pos.top + dialogHeight > clientHeight)
                    {
                        bottomCross = pos.top + dialogHeight - clientHeight
                    }
                    if (left < 0 || top < 0 || bottomCross > 0 || rightCross > 0)
                    {
                        left -= rightCross;
                        top -= bottomCross;
                        if (left < 0)
                        {
                            left = 0
                        }
                        if (top < 0)
                        {
                            top = 0
                        }
                        container.css({
                            left: left, top: top
                        })
                    }
                };
                BaseDialog.prototype._hasTargetContainer = function(target)
                {
                    if ($("#" + target).length)
                    {
                        return true
                    }
                    return false
                };
                BaseDialog.prototype._createOverlay = function()
                {
                    var self = this;
                    var overlay = $("<div></div>").addClass(self._overlayClass);
                    overlay.css(self.defaultOverlayCSS);
                    $(document.body).append(overlay);
                    var isFirefox = $.browser && $.browser.mozilla;
                    var isQTMode = $.browser && $.browser.qtMode;
                    if (isFirefox || isQTMode)
                    {
                        var openTime = (new Date).valueOf()
                    }
                    overlay.bind('mousedown', function(e)
                    {
                        if (isFirefox || isQTMode)
                        {
                            var closeTime = (new Date).valueOf();
                            if (closeTime - openTime < 100)
                            {
                                return
                            }
                        }
                        self.close();
                        if (isFirefox || isQTMode)
                        {
                            if (self._delayCloseTimeout)
                            {
                                window.clearTimeout(self._delayCloseTimeout)
                            }
                        }
                        Sheets.util.cancelDefault(e)
                    });
                    overlay.bind('touchstart MSPointerDown pointerdown', function(e)
                    {
                        if (isFirefox || isQTMode)
                        {
                            self._delayCloseTimeout = setTimeout(function()
                            {
                                self.close()
                            }, 100)
                        }
                        else
                        {
                            self.close()
                        }
                        Sheets.util.cancelDefault(e)
                    })
                };
                BaseDialog.prototype._hasOverlay = function()
                {
                    if ($("." + this._overlayClass).length > 0)
                    {
                        return true
                    }
                    return false
                };
                return BaseDialog
            })();
        Sheets.BaseDialog = BaseDialog
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
        Sheets.feature("filter_ui", ["core.common", "core.stringResource", "core.spreadpanelex"]);
        var keyword_null = null,
            const_undefined = "undefined",
            sortAscID = "sortASC",
            sortDesID = "sortDES",
            okID = "filterOK",
            cancelID = "filterCancel",
            searchID = "filterSearch",
            checkAllID = "filterCheckAll",
            unCheckAllID = "filterUnCheckAll",
            filterItemClass = "filter-item",
            itemContainerClass = "filter-item-container",
            itemsWrapperClass = "filter-item-wrapper",
            itemInputClass = "filter-item-input",
            itemSpanClass = "filter-item-text",
            filterButtonClass = "filter-button",
            filterSortClass = "filter-sort",
            filterCheckClass = "filter-check",
            filterCheckStyleClass = "filter-check-style",
            filterCheckContainerClass = "filter-check-outerDiv",
            eventNamespace = ".ui-filter-dialog",
            filterKeyDown = "keydown" + eventNamespace,
            filterKeyUp = "keyup" + eventNamespace,
            layoutTableClass = "layout-table",
            filterDialogStyleClass = "filter-dialog-style",
            externalHoverClass = "ui-state-hover",
            notExternalHoverClass = "container-default-hover",
            noUserSelectClass = "no-user-select",
            cmd_scroll = "scroll",
            ns_scrollbar = '.gcScrollbar',
            Math_floor = Math.floor,
            Math_max = Math.max,
            Math_round = Math.round;
        (function(_FilterButtonState)
        {
            _FilterButtonState[_FilterButtonState["noSortFilter"] = 0] = "noSortFilter";
            _FilterButtonState[_FilterButtonState["ascend"] = 1] = "ascend";
            _FilterButtonState[_FilterButtonState["descend"] = 2] = "descend";
            _FilterButtonState[_FilterButtonState["filter"] = 3] = "filter";
            _FilterButtonState[_FilterButtonState["filterAscend"] = 4] = "filterAscend";
            _FilterButtonState[_FilterButtonState["filterDescend"] = 5] = "filterDescend";
            _FilterButtonState[_FilterButtonState["sortAscending"] = 6] = "sortAscending";
            _FilterButtonState[_FilterButtonState["sortDescending"] = 7] = "sortDescending";
            _FilterButtonState[_FilterButtonState["checkAll"] = 8] = "checkAll";
            _FilterButtonState[_FilterButtonState["unCheckAll"] = 9] = "unCheckAll"
        })(Sheets._FilterButtonState || (Sheets._FilterButtonState = {}));
        var _FilterButtonState = Sheets._FilterButtonState;
        var _FilterButtonInfo = (function()
            {
                function _FilterButtonInfo(rowFilter, row, col, sheetArea, x, y, width, height)
                {
                    var self = this;
                    self.rowFilter = rowFilter;
                    self.row = row;
                    self.col = col;
                    self.sheetArea = sheetArea;
                    self.x = x;
                    self.y = y;
                    self.width = width;
                    self.height = height
                }
                _FilterButtonInfo.prototype.getState = function()
                {
                    var filterButtonState = 0;
                    var filter = this.rowFilter;
                    if (!filter)
                    {
                        return filterButtonState
                    }
                    var state = filter.getSortState(this.col);
                    if (filter.isColumnFiltered(this.col))
                    {
                        if (state === 0)
                        {
                            filterButtonState = 3
                        }
                        else if (state === 1)
                        {
                            filterButtonState = 4
                        }
                        else if (state === 2)
                        {
                            filterButtonState = 5
                        }
                    }
                    else
                    {
                        if (state === 0)
                        {
                            filterButtonState = 0
                        }
                        else if (state === 1)
                        {
                            filterButtonState = 1
                        }
                        else if (state === 2)
                        {
                            filterButtonState = 2
                        }
                    }
                    return filterButtonState
                };
                return _FilterButtonInfo
            })();
        Sheets._FilterButtonInfo = _FilterButtonInfo;
        var _FilterButtonInfoModel = (function(_super)
            {
                __extends(_FilterButtonInfoModel, _super);
                function _FilterButtonInfoModel()
                {
                    _super.call(this)
                }
                _FilterButtonInfoModel.prototype.find = function(row, col, sheetArea)
                {
                    var count = this.length,
                        btnInfo;
                    for (var i = 0; i < count; i++)
                    {
                        btnInfo = this[i];
                        if (btnInfo && btnInfo.row === row && btnInfo.col === col && btnInfo.sheetArea === sheetArea)
                        {
                            return btnInfo
                        }
                    }
                    return keyword_null
                };
                return _FilterButtonInfoModel
            })(Sheets._XArray);
        Sheets._FilterButtonInfoModel = _FilterButtonInfoModel;
        var _GcFilterDialog = (function(_super)
            {
                __extends(_GcFilterDialog, _super);
                function _GcFilterDialog(sheet, filterButtonInfo)
                {
                    _super.call(this, Sheets.util.getPreferredZIndex(sheet && sheet.parent && sheet.parent._host));
                    this._allValues = [];
                    this._searchedValues = [];
                    this._allCheckedValues = [];
                    this._inputElements = [];
                    this._spanElements = [];
                    this._itemOuterDivs = [];
                    var self = this;
                    self.sheet = sheet;
                    self.filterButtonInfo = filterButtonInfo;
                    self.init()
                }
                _GcFilterDialog.prototype.init = function()
                {
                    var self = this;
                    self._containerWidth = 237;
                    self._containerHeight = 318;
                    self._itemContainerWidth = 191;
                    self._itemContainerHeight = 150;
                    self._itemDivMargin = 2;
                    self._itemDivBorder = 1;
                    self._itemDivHeight = 20;
                    self._itemHeight = self._itemDivHeight + self._itemDivBorder * 2 + self._itemDivMargin;
                    self._touchContainerWidth = 257;
                    self._touchContainerHeight = 355;
                    self._defaultScrollbarSize = 18;
                    self.rEscape = "/[\-\[\]{}()*+?.,\\\^$|#\s]/g";
                    self._itemValueCache = [];
                    self._firstOpenCache = [];
                    self.elementList = [];
                    self.activeItemIndex = 0;
                    self.container = self.getContainer();
                    self._createTableLayout();
                    self._initFilterPanel()
                };
                _GcFilterDialog.prototype.open = function()
                {
                    var self = this;
                    var sheet = self.sheet,
                        tempSpread = sheet.parent;
                    if (!sheet)
                    {
                        return
                    }
                    var useTouchLayout = (tempSpread && tempSpread.useTouchLayout) ? tempSpread.useTouchLayout() : false;
                    self._useTouchLayout = useTouchLayout;
                    self._initData(self.filterButtonInfo.col);
                    self._initLayout();
                    self._updateItemCache();
                    self._attachEvent()
                };
                _GcFilterDialog.prototype._initLayout = function()
                {
                    var self = this,
                        sheet = self.sheet;
                    self._initFilterItemsLayout();
                    self.container.appendTo(document.body);
                    self.container.hide();
                    self.show("normal", "fade", function()
                    {
                        $("#" + sortAscID).focus()
                    });
                    if (self._useTouchLayout)
                    {
                        self._updateFilterPanel(self._touchContainerWidth, self._touchContainerHeight)
                    }
                    var t = sheet._eventHandler._getCanvasOffset();
                    var dialogWidth = self.container.width();
                    var dialogHeight = self.container.height();
                    var x = self.filterButtonInfo.x + self.filterButtonInfo.width - dialogWidth;
                    var y = self.filterButtonInfo.y + self.filterButtonInfo.height;
                    x += t.left - 6;
                    y += t.top;
                    self.container.css({
                        left: x, top: y
                    });
                    self.resetDialogPosition();
                    self._initFirstOpenCache()
                };
                _GcFilterDialog.prototype._updateFilterPanel = function(width, height)
                {
                    var self = this,
                        widthInc = width - self._containerWidth,
                        heightInc = height - self._containerHeight;
                    if (widthInc <= 0 || heightInc <= 0)
                    {
                        return
                    }
                    self.container.css({
                        width: width + "px", height: height + "px"
                    });
                    var newSortPaddingV = parseFloat($("." + filterSortClass).css("padding-top")) + heightInc / 30;
                    $("." + filterSortClass).css("padding", newSortPaddingV + "px" + " 6px");
                    var filterButtons = $("." + filterButtonClass);
                    var newButtonWidth = parseFloat(filterButtons.css("width")) + widthInc / 4;
                    var newButtonHeight = parseFloat(filterButtons.css("height")) + heightInc / 8;
                    filterButtons.css({
                        width: newButtonWidth + "px", height: newButtonHeight + "px"
                    });
                    var okButton = $("#" + okID);
                    var newButtonMarginLeft = parseFloat(okButton.css("margin-left")) + widthInc / 2;
                    okButton.css("margin-left", newButtonMarginLeft + "px");
                    var searchBox = $("#" + searchID);
                    var newSearchWidth = parseFloat(searchBox.css("width")) + widthInc;
                    var newSearchHeight = parseFloat(searchBox.css("height")) + heightInc / 8;
                    searchBox.css({
                        height: newSearchHeight + "px", width: newSearchWidth + "px"
                    });
                    var filterCheck = $("." + filterCheckContainerClass);
                    var newCheckMarginTop = parseFloat(filterCheck.css("margin-top")) + heightInc / 10;
                    filterCheck.css("margin-top", newCheckMarginTop + "px");
                    var unCheckAll = $("#" + unCheckAllID);
                    var newCheckMarginLeft = parseFloat(unCheckAll.css("margin-left")) + widthInc;
                    $("#" + unCheckAllID).css("margin-left", newCheckMarginLeft + "px")
                };
                _GcFilterDialog.prototype.close = function()
                {
                    _super.prototype.close.call(this);
                    var self = this;
                    $(self._itemSpanElement).remove();
                    $(self._itemInputElement).remove();
                    if (self.sheet)
                    {
                        self.sheet.setFocus()
                    }
                };
                _GcFilterDialog.prototype._initFilterPanel = function()
                {
                    var self = this;
                    var ascLink = self._getSortLink(sortAscID, Sheets.SR.SortAscending).css("margin-top", "6px");
                    var desLink = self._getSortLink(sortDesID, Sheets.SR.SortDescending);
                    self.table.find("tr:eq(0) td:eq(0)").append($("<img>").attr("src", _GcFilterDialog.getImageSrc(6)));
                    self.table.find("tr:eq(1) td:eq(0)").append($("<img>").attr("src", _GcFilterDialog.getImageSrc(7)));
                    self.table.find("tr:eq(0) td:eq(1)").append(ascLink);
                    self.table.find("tr:eq(1) td:eq(1)").append(desLink);
                    self.elementList.push(ascLink[0]);
                    self.elementList.push(desLink[0]);
                    self.searchOuterDiv = $("<div>").css({
                        margin: 0, padding: 0
                    }).addClass("search-outer-div container-default-header ui-widget-header ui-corner-all ui-multiselect-header ui-helper-clearfix");
                    var searchDiv = $("<div>").appendTo(self.searchOuterDiv);
                    var searchInput = $("<input>").attr({
                            type: "search", placeholder: Sheets.SR.Search, id: searchID
                        }).appendTo(searchDiv);
                    self.elementList.push(searchInput[0]);
                    var checkDiv = $("<div>").appendTo(self.searchOuterDiv).addClass("filter-check-outerDiv");
                    var checkAllLink = self._getCheckLink(checkAllID, Sheets.SR.CheckAll, "check-image ui-icon ui-icon-check");
                    var unCheckAllLink = self._getCheckLink(unCheckAllID, Sheets.SR.UncheckAll, "uncheck-image ui-icon ui-icon-closethick");
                    checkDiv.append(checkAllLink).append(unCheckAllLink);
                    self.table.find("tr:eq(2) td:eq(1)").append(self.searchOuterDiv);
                    self.itemList = $("<div>").addClass(itemContainerClass).css({
                        width: self._itemContainerWidth, height: self._itemContainerHeight, "box-sizing": "content-box"
                    });
                    self.table.find("tr:eq(3) td:eq(1)").append(self.itemList);
                    var okButton = $("<button>").text(Sheets.SR.OK).css({"font-size": "1em"}).addClass(filterButtonClass + " container-default-state ui-button ui-state-default ui-corner-all btn btn-default").attr({id: okID});
                    var cancelButton = $("<button>").text(Sheets.SR.Cancel).css({"font-size": "1em"}).addClass(filterButtonClass + " container-default-state ui-button ui-state-default ui-corner-all btn btn-default").attr({id: cancelID});
                    self.table.find("tr:eq(4) td:eq(1)").append(okButton);
                    self.table.find("tr:eq(4) td:eq(1)").append(cancelButton);
                    self.elementList.push(okButton[0]);
                    self.elementList.push(cancelButton[0])
                };
                _GcFilterDialog.prototype._createTableLayout = function()
                {
                    var self = this;
                    var rowCount = 5;
                    var colCount = 3;
                    self.table = $("<table>").css({
                        padding: 0, display: "table"
                    }).attr({
                        cellspacing: 0, cellpadding: 0
                    }).addClass(layoutTableClass + " ui-menu");
                    for (var row = 0; row < rowCount; row++)
                    {
                        var tr = $("<tr style='border:0;margin:0;padding:0;'>");
                        for (var col = 0; col < colCount; col++)
                        {
                            var td = $("<td style='border:0;margin:0;padding:0;'>").appendTo(tr)
                        }
                        tr.appendTo(self.table)
                    }
                    self.table.appendTo(self.container);
                    $(self.table).find("tr").each(function()
                    {
                        $("td:eq(0)", this).addClass("layout-table-first-column");
                        $("td:eq(2)", this).addClass("layout-table-last-column")
                    });
                    $(self.table).find("tr:eq(1) td:eq(1)").addClass("filter-sort-desc-container sort-container ui-menu-item");
                    $(self.table).find("tr:eq(0) td:eq(1)").addClass("filter-sort-asc-container sort-container ui-menu-item");
                    self.container.css({
                        "box-shadow": "rgba(0, 0, 0, 0.4) 2px 4px 5px", padding: "2px", width: self._containerWidth + "px", height: self._containerHeight + "px", "box-sizing": "content-box"
                    }).addClass(filterDialogStyleClass + " " + noUserSelectClass)
                };
                _GcFilterDialog.prototype._updateItemCache = function()
                {
                    var self = this,
                        allValues = self._allValues;
                    for (var i = 0, len = allValues.length; i < len; i++)
                    {
                        self._itemValueCache.push(allValues[i])
                    }
                };
                _GcFilterDialog.prototype._stopBubble = function(e)
                {
                    if (e && e.stopPropagation)
                    {
                        e.stopPropagation()
                    }
                    else
                    {
                        window.event.cancelBubble = true
                    }
                    return false
                };
                _GcFilterDialog.prototype._itemsWrapMouseWheel = function(e)
                {
                    var self = this;
                    if ((typeof e.wheelDelta === const_undefined || e.wheelDelta === keyword_null) && (typeof e.detail === const_undefined || e.detail === keyword_null))
                    {
                        e.wheelDelta = e.originalEvent.wheelDelta;
                        e.detail = e.originalEvent.detail
                    }
                    var wheelData = e.detail ? e.detail : e.wheelDelta / -40;
                    var spanElements = self._spanElements,
                        spanElementsCount = spanElements.length,
                        searchedValues = self._searchedValues,
                        searchedValuesCount = searchedValues.length,
                        topIndex = 0;
                    if (spanElements && spanElementsCount > 0)
                    {
                        var topSpanText = $(spanElements[0]).text();
                        topIndex = $.inArray(topSpanText, searchedValues)
                    }
                    var topItemIndex = topIndex + wheelData;
                    if (topItemIndex > searchedValuesCount - spanElementsCount)
                    {
                        topItemIndex = searchedValuesCount - spanElementsCount
                    }
                    if (topItemIndex < 0)
                    {
                        topItemIndex = 0
                    }
                    self._updateItemsLayout(topItemIndex);
                    Sheets.util.cancelDefault(e)
                };
                _GcFilterDialog.prototype._attachEvent = function()
                {
                    var self = this;
                    if (self._itemsWrap)
                    {
                        self._itemsWrap.addEventListener("mousewheel", function(event)
                        {
                            self._itemsWrapMouseWheel(event)
                        }, false);
                        self._itemsWrap.addEventListener("DOMMouseScroll", function(event)
                        {
                            self._itemsWrapMouseWheel(event)
                        }, false)
                    }
                    $("#" + sortAscID).bind({
                        mouseup: function(event)
                        {
                            self._sortByUser(true);
                            self.close();
                            Sheets.util.cancelDefault(event)
                        }, mousedown: function(event)
                            {
                                Sheets.util.cancelDefault(event)
                            }
                    });
                    $("#" + sortDesID).bind({
                        mouseup: function(event)
                        {
                            self._sortByUser(false);
                            self.close();
                            Sheets.util.cancelDefault(event)
                        }, mousedown: function(event)
                            {
                                Sheets.util.cancelDefault(event)
                            }
                    });
                    $("." + filterSortClass).hover(function()
                    {
                        var hoverClassName = "filter-hover " + externalHoverClass + " form-control well " + notExternalHoverClass;
                        var hoverItem = $(".filter-hover");
                        hoverItem.removeClass(externalHoverClass + " " + notExternalHoverClass);
                        $(this).addClass(hoverClassName)
                    }, function()
                    {
                        var hoverClassName = "filter-hover " + externalHoverClass + " form-control well " + notExternalHoverClass;
                        $(this).removeClass(hoverClassName)
                    });
                    $("#" + checkAllID).bind({
                        mousedown: function(event)
                        {
                            Sheets.util.cancelDefault(event)
                        }, mouseup: function(event)
                            {
                                var visibleItems = $("." + filterItemClass).find("input:visible");
                                visibleItems.prop("checked", true);
                                self._allCheckedValues = self._searchedValues.concat([]);
                                self._setButtonState();
                                Sheets.util.cancelDefault(event)
                            }
                    });
                    $("#" + unCheckAllID).bind({
                        mousedown: function(event)
                        {
                            Sheets.util.cancelDefault(event)
                        }, mouseup: function(event)
                            {
                                var visibleItems = $("." + filterItemClass).find("input:visible");
                                visibleItems.prop("checked", false);
                                self._allCheckedValues.length = 0;
                                self._setButtonState();
                                Sheets.util.cancelDefault(event)
                            }
                    });
                    $("." + filterItemClass).bind({
                        mouseenter: function()
                        {
                            var hoverClassName = "filter-hover " + externalHoverClass + " form-control well " + notExternalHoverClass;
                            var hoverItem = $(".filter-hover");
                            hoverItem.removeClass(externalHoverClass + " " + notExternalHoverClass);
                            $(this).addClass(hoverClassName)
                        }, mouseleave: function()
                            {
                                var hoverClassName = "filter-hover " + externalHoverClass + " form-control well " + notExternalHoverClass;
                                $(this).removeClass(hoverClassName)
                            }, click: function(e)
                            {
                                $(this).find("input").trigger("click")
                            }
                    });
                    $("." + filterItemClass).find("input").bind("click", function(e)
                    {
                        self._stopBubble(e);
                        var item = $(this).parents("div." + filterItemClass).get(0);
                        self._updateActiveItemIndex(item);
                        self._setButtonState()
                    });
                    var Key = GcSpread.Sheets.Key;
                    $("#" + searchID).bind({
                        keydown: function(e)
                        {
                            var key = e.which || e.keyCode;
                            if (key === 13)
                            {
                                e.preventDefault()
                            }
                        }, keyup: function(e)
                            {
                                switch (e.keyCode)
                                {
                                    case 9:
                                    case 37:
                                    case 38:
                                    case 39:
                                    case 40:
                                        return;
                                    default:
                                        self._searchHandler(e);
                                        self._setButtonState()
                                }
                            }, search: function(e)
                            {
                                self._searchHandler(e);
                                self._setButtonState()
                            }
                    });
                    $("." + filterButtonClass).hover(function()
                    {
                        var hoverItem = $(".filter-button-hover");
                        var filterButtonHoverClassName = "filter-button-hover " + externalHoverClass + " " + notExternalHoverClass;
                        hoverItem.removeClass(externalHoverClass + " " + notExternalHoverClass);
                        $(this).addClass(filterButtonHoverClassName)
                    }, function()
                    {
                        var filterButtonHoverClassName = "filter-button-hover " + externalHoverClass + " " + notExternalHoverClass;
                        $(this).removeClass(filterButtonHoverClassName)
                    });
                    $("#" + okID).bind("click", function()
                    {
                        var checkedValues = self._allCheckedValues;
                        self._updateData(checkedValues);
                        self._filter(checkedValues);
                        self.close()
                    });
                    $("#" + cancelID).bind("click", function()
                    {
                        self.close()
                    });
                    $(self.container).bind("mousewheel", function(event)
                    {
                        Sheets.util.cancelDefault(event)
                    });
                    $(self.container).bind(filterKeyDown, function(event)
                    {
                        self._filterKeyDown(event)
                    });
                    $(self.container).bind(filterKeyUp, function(event)
                    {
                        Sheets.util.cancelDefault(event)
                    })
                };
                _GcFilterDialog.prototype._filterKeyDown = function(event)
                {
                    var self = this;
                    var key = event.which || event.keyCode;
                    if (key !== 27 && key !== 13 && key !== 38 && key !== 40 && key !== 9)
                    {
                        return
                    }
                    var hoverItem = $(".container-default-hover");
                    if (key === 27)
                    {
                        self.close();
                        Sheets.util.cancelDefault(event)
                    }
                    else if (key === 13)
                    {
                        if (hoverItem.length !== 1)
                        {
                            return
                        }
                        var itemID = hoverItem.attr("id");
                        if (itemID === sortAscID)
                        {
                            self._sortByUser(true);
                            self.close()
                        }
                        else if (itemID === sortDesID)
                        {
                            self._sortByUser(false);
                            self.close()
                        }
                        else if (itemID === okID)
                        {
                            var checkedValues = self._allCheckedValues;
                            self._updateData(checkedValues);
                            self._filter(checkedValues);
                            self.close()
                        }
                        else if (itemID === cancelID)
                        {
                            self.close()
                        }
                        else
                        {
                            var inputList = $(hoverItem).find("input");
                            if (inputList.length > 0)
                            {
                                inputList.trigger("click")
                            }
                            self._updateActiveItemIndex(hoverItem[0])
                        }
                    }
                    else if (key === 38 || key === 40 || key === 9)
                    {
                        var targetItem,
                            filterItemList = self._searchedValues;
                        if (hoverItem.length === 0)
                        {
                            targetItem = self.elementList[0]
                        }
                        else
                        {
                            hoverItem.removeClass(externalHoverClass + " " + notExternalHoverClass);
                            var navList = self.elementList.concat([]);
                            for (var i = 0; i < filterItemList.length; i++)
                            {
                                navList.splice(-2, 0, filterItemList[i])
                            }
                            if (key === 9)
                            {
                                var tabList = self.elementList.concat([]);
                                if (filterItemList[self.activeItemIndex])
                                {
                                    tabList.splice(-2, 0, filterItemList[self.activeItemIndex])
                                }
                                var tabItemIndex = $.inArray(hoverItem[0], self._itemOuterDivs);
                                if (!event.shiftKey)
                                {
                                    if (tabItemIndex >= 0)
                                    {
                                        var okButton = self.elementList[3];
                                        if (!self._isElementDisabled(okButton))
                                        {
                                            targetItem = self.elementList[3]
                                        }
                                        else
                                        {
                                            targetItem = self.elementList[4]
                                        }
                                    }
                                    else
                                    {
                                        tabItemIndex = $.inArray(hoverItem[0], tabList);
                                        if (tabItemIndex >= 0)
                                        {
                                            var len = tabList.length;
                                            targetItem = tabList[tabItemIndex + 1];
                                            while (self._isElementDisabled(targetItem) && tabItemIndex < len)
                                            {
                                                targetItem = tabList[tabItemIndex + 1];
                                                tabItemIndex++
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    if (tabItemIndex >= 0)
                                    {
                                        targetItem = self.elementList[2]
                                    }
                                    else
                                    {
                                        tabItemIndex = $.inArray(hoverItem[0], tabList);
                                        if (tabItemIndex >= 0)
                                        {
                                            targetItem = tabList[tabItemIndex - 1];
                                            while (tabItemIndex > 0 && self._isElementDisabled(targetItem))
                                            {
                                                targetItem = tabList[tabItemIndex - 1];
                                                tabItemIndex--
                                            }
                                        }
                                    }
                                    if (typeof targetItem === const_undefined)
                                    {
                                        targetItem = tabList[tabList.length - 1]
                                    }
                                }
                                if (typeof targetItem === const_undefined)
                                {
                                    targetItem = tabList[0]
                                }
                            }
                            else
                            {
                                var hover = hoverItem[0];
                                if ($.inArray(hover, self._itemOuterDivs) >= 0)
                                {
                                    hover = $(hover).children('span').text()
                                }
                                var downItemIndex = $.inArray(hover, navList);
                                var navLen = navList.length;
                                if (downItemIndex >= 0)
                                {
                                    if (key === 40)
                                    {
                                        targetItem = navList[downItemIndex + 1];
                                        if ($.inArray(targetItem, filterItemList) !== -1 && $.inArray(hover, filterItemList) === -1)
                                        {
                                            downItemIndex = downItemIndex + self.activeItemIndex;
                                            targetItem = navList[downItemIndex + 1]
                                        }
                                        while (downItemIndex < navLen && self._isElementDisabled(targetItem))
                                        {
                                            targetItem = navList[downItemIndex + 1];
                                            downItemIndex++
                                        }
                                    }
                                    else
                                    {
                                        targetItem = navList[downItemIndex - 1];
                                        if ($.inArray(targetItem, filterItemList) !== -1 && $.inArray(hover, filterItemList) === -1)
                                        {
                                            downItemIndex = self.activeItemIndex + 3;
                                            targetItem = navList[downItemIndex]
                                        }
                                        while (downItemIndex > 0 && self._isElementDisabled(targetItem))
                                        {
                                            targetItem = navList[downItemIndex - 1];
                                            downItemIndex--
                                        }
                                        if (typeof targetItem === const_undefined)
                                        {
                                            targetItem = navList[navList.length - 1]
                                        }
                                    }
                                    if (typeof targetItem === const_undefined)
                                    {
                                        targetItem = navList[0]
                                    }
                                }
                            }
                        }
                        if (typeof targetItem === 'string')
                        {
                            var targetItem = self._hoverToTargetFilterItem(targetItem, filterItemList);
                            if (targetItem)
                            {
                                hoverItem = targetItem
                            }
                        }
                        else
                        {
                            hoverItem = $(targetItem);
                            hoverItem.focus()
                        }
                        hoverItem.addClass("filter-hover " + externalHoverClass + " " + notExternalHoverClass);
                        Sheets.util.cancelDefault(event)
                    }
                };
                _GcFilterDialog.prototype._hoverToTargetFilterItem = function(targetItem, filterItemList)
                {
                    var self = this,
                        targetIndex = $.inArray(targetItem, filterItemList),
                        hoverItem = null;
                    if (targetIndex >= 0)
                    {
                        self.activeItemIndex = targetIndex;
                        var spanElements = self._spanElements,
                            topItemText = $(spanElements[0]).text(),
                            topItemIndex = $.inArray(topItemText, filterItemList),
                            newTopItemIndex = topItemIndex;
                        if (targetIndex < topItemIndex)
                        {
                            self._updateItemsLayout(targetIndex);
                            hoverItem = $(spanElements[0]).parent()
                        }
                        else if (self._indexOfCurrentItemList(targetItem, spanElements) >= 0)
                        {
                            hoverItem = self._getVisibleHoverItem(targetItem, topItemIndex + 1)
                        }
                        else
                        {
                            hoverItem = self._getVisibleHoverItem(targetItem, targetIndex - spanElements.length + 1)
                        }
                        hoverItem.find("input").focus()
                    }
                    return hoverItem
                };
                _GcFilterDialog.prototype._indexOfCurrentItemList = function(value, spanElements)
                {
                    for (var i = 0, len = spanElements.length; i < len; i++)
                    {
                        if ($(spanElements[i]).text() === value)
                        {
                            return i
                        }
                    }
                    return -1
                };
                _GcFilterDialog.prototype._getVisibleHoverItem = function(targetItem, newTopItemIndex)
                {
                    var self = this,
                        hoverItem = null,
                        spanElements = self._spanElements,
                        searchValuesCount = self._searchedValues.length;
                    while (true)
                    {
                        var targetItemIndex = self._indexOfCurrentItemList(targetItem, spanElements);
                        if (targetItemIndex >= 0)
                        {
                            hoverItem = $(spanElements[targetItemIndex]).parent();
                            var scrollbarH = self._scrollbarH,
                                isVisibleHoverItem = true;
                            if (self._showHorizontalScrollbar && scrollbarH && hoverItem.length > 0 && hoverItem.css('display') !== 'none')
                            {
                                var hoverInputTopOffset = hoverItem.offset().top + self._itemHeight,
                                    scrollbarEle = scrollbarH.getScrollbar(),
                                    scrollbarHTopOffset = $(scrollbarEle).offset().top;
                                if (hoverInputTopOffset > scrollbarHTopOffset)
                                {
                                    isVisibleHoverItem = false;
                                    ;
                                }
                            }
                            if (isVisibleHoverItem)
                            {
                                break
                            }
                        }
                        self._updateItemsLayout(newTopItemIndex);
                        newTopItemIndex++;
                        if (newTopItemIndex > searchValuesCount - 1)
                        {
                            break
                        }
                    }
                    return hoverItem
                };
                _GcFilterDialog.prototype._updateActiveItemIndex = function(item)
                {
                    var self = this,
                        searchedValues = self._searchedValues,
                        allCheckedValues = self._allCheckedValues,
                        $input = $(item).children(".filter-item-text");
                    if ($input)
                    {
                        var value = $input.text();
                        var checkedIndex = $.inArray(value, allCheckedValues);
                        if (checkedIndex >= 0)
                        {
                            allCheckedValues.splice(checkedIndex, 1)
                        }
                        else
                        {
                            allCheckedValues.push(value)
                        }
                        var activeIndex = $.inArray(value, searchedValues);
                        if (activeIndex >= 0)
                        {
                            self.activeItemIndex = activeIndex
                        }
                    }
                };
                _GcFilterDialog.prototype._isElementDisabled = function(ele)
                {
                    if (typeof ele === 'string')
                    {
                        return false
                    }
                    ele = $(ele);
                    if (ele.length === 0)
                    {
                        return false
                    }
                    if (ele.hasClass("ui-button-disabled") || ele.hasClass(" ui-state-disabled") || ele.hasClass("filter-button-disable"))
                    {
                        return true
                    }
                    return false
                };
                _GcFilterDialog.prototype._filter = function(filterValues)
                {
                    var self = this;
                    var sheet = self.sheet;
                    if (!sheet)
                    {
                        return
                    }
                    var supended = sheet.isPaintSuspended();
                    try
                    {
                        sheet.isPaintSuspended(true);
                        var drf = self.filterButtonInfo.rowFilter;
                        if (!drf)
                        {
                            return
                        }
                        var column = self.filterButtonInfo.col;
                        var table = drf.table && drf.table();
                        var tableColumn = table ? column - table.range().col : -1;
                        if (filterValues)
                        {
                            if (table)
                            {
                                sheet.triggerTableFiltering({
                                    sheet: sheet, sheetName: sheet._name, table: table, tableCol: tableColumn, filterValues: filterValues
                                })
                            }
                            else
                            {
                                sheet.triggerRangeFiltering({
                                    sheet: sheet, sheetName: sheet._name, col: column, filterValues: filterValues
                                })
                            }
                        }
                        drf.filter(column);
                        if (filterValues)
                        {
                            if (table)
                            {
                                sheet.triggerTableFiltered({
                                    sheet: sheet, sheetName: sheet._name, table: table, tableCol: tableColumn, filterValues: filterValues
                                })
                            }
                            else
                            {
                                sheet.triggerRangeFiltered({
                                    sheet: sheet, sheetName: sheet._name, col: column, filterValues: filterValues
                                })
                            }
                        }
                    }
                    finally
                    {
                        sheet.isPaintSuspended(supended)
                    }
                };
                _GcFilterDialog.prototype._updateData = function(checkedValues)
                {
                    var colIndex = this.filterButtonInfo.col;
                    var drf = this.filterButtonInfo.rowFilter;
                    if (!drf || !Sheets.features.conditionalFormat)
                    {
                        return
                    }
                    drf.removeFilterItems(colIndex);
                    if (checkedValues.length === this._allValues.length)
                    {
                        return
                    }
                    for (var i = 0; i < checkedValues.length; i++)
                    {
                        var value = checkedValues[i];
                        if (value === Sheets.SR.Blanks)
                        {
                            value = ""
                        }
                        var tc = new Sheets.TextCondition(0, value, keyword_null);
                        drf.addFilterItem(colIndex, tc)
                    }
                };
                _GcFilterDialog.prototype._searchHandler = function(e)
                {
                    var self = this,
                        searchInput = $("#" + searchID),
                        value = $.trim(searchInput.val().toLowerCase()),
                        itemContainer = $("." + itemContainerClass),
                        inputs = itemContainer.find("input"),
                        items = inputs.parent();
                    if (!value)
                    {
                        items.show();
                        if (!this._firstOpenCache || this._firstOpenCache.length === 0)
                        {
                            this._initFirstOpenCache()
                        }
                        else
                        {
                            inputs.prop("checked", false);
                            self._searchedValues = self._allValues.concat([]);
                            self._allCheckedValues = self._firstOpenCache.concat([]);
                            self._updateItemsLayout(0)
                        }
                    }
                    else
                    {
                        items.hide();
                        inputs.prop("checked", false);
                        var regex = new RegExp(value.replace(this.rEscape, "\\$&"), 'gi');
                        var searchedValues = [];
                        $.map(this._itemValueCache, function(v, i)
                        {
                            if (v.search(regex) !== -1)
                            {
                                searchedValues.push(v)
                            }
                        });
                        self._searchedValues = searchedValues.concat([]);
                        self._allCheckedValues = searchedValues.concat([]);
                        self.activeItemIndex = 0;
                        self._updateItemsLayout(0)
                    }
                };
                _GcFilterDialog.prototype._getSortLink = function(id, text, callback)
                {
                    var link = $("<a>");
                    link.attr({
                        id: id, href: "javascript:void(0)"
                    }).text(text).addClass(filterSortClass + " ui-corner-all").css({
                        display: "block", padding: "5px 6px", cursor: "default", margin: "2px 0px 1px 2px", "text-decoration": "none", "text-align": "left", "font-size": "12px", outline: "none", height: "inherit"
                    });
                    if (callback)
                    {
                        link.click = callback
                    }
                    return link
                };
                _GcFilterDialog.prototype._getCheckLink = function(id, text, imageClass, callback)
                {
                    var imgSpan = $("<span>").addClass("check-uncheck-all " + imageClass);
                    var textSpan = $("<span>").text(text);
                    var link = $("<a>");
                    link.attr({
                        href: "javascript:void(0)", id: id
                    }).css({
                        float: "left", "margin-left": "7px", padding: "0", "font-size": "12px", height: "16px"
                    }).addClass(filterCheckClass + " " + filterCheckStyleClass).append(imgSpan).append(textSpan);
                    if (callback)
                    {
                        link.click = callback
                    }
                    return link
                };
                _GcFilterDialog.prototype._initData = function(colIndex)
                {
                    var self = this;
                    var drf = self.filterButtonInfo.rowFilter;
                    if (!drf)
                    {
                        return
                    }
                    self._getItemsData(drf, colIndex);
                    var allValues = self._allValues;
                    allValues.sort(function(a, b)
                    {
                        if (a > b)
                        {
                            return 1
                        }
                        else if (a < b)
                        {
                            return -1
                        }
                        else
                        {
                            return 0
                        }
                    });
                    self._allValues = allValues;
                    self._searchedValues = allValues.concat([]);
                    if (!drf.isColumnFiltered(colIndex))
                    {
                        self._allCheckedValues = allValues.concat([])
                    }
                };
                _GcFilterDialog.prototype._getItemsData = function(filter, col)
                {
                    var self = this,
                        sheet = self.sheet,
                        items = [],
                        checkedItems = [];
                    var itemsDic = {};
                    var range = sheet._getActualRange(filter.range);
                    if (col < range.col || col > range.col + range.colCount - 1)
                    {
                        self._allValues = items;
                        self._allCheckedValues = checkedItems;
                        return
                    }
                    var hasBlank = false;
                    for (var row = range.row; row < range.row + range.rowCount; row++)
                    {
                        var text = sheet.getText(row, col);
                        if (text === "")
                        {
                            if (!hasBlank)
                            {
                                hasBlank = true;
                                items.push(Sheets.SR.Blanks);
                                if (sheet.getRowHeight(row, 3) > 0)
                                {
                                    checkedItems.push(Sheets.SR.Blanks)
                                }
                            }
                            continue
                        }
                        if (!itemsDic[text])
                        {
                            if (sheet.getRowHeight(row, 3) > 0)
                            {
                                items.push(text);
                                itemsDic[text] = true;
                                checkedItems.push(text)
                            }
                            else if (!filter.isFiltered() || (filter.isLastFilteredColumn(col) && filter._isRowfilteredOutByColumn(row, col)))
                            {
                                items.push(text);
                                itemsDic[text] = true
                            }
                        }
                    }
                    self._allValues = items;
                    self._allCheckedValues = checkedItems
                };
                _GcFilterDialog.prototype._initFilterItemsLayout = function()
                {
                    var self = this,
                        filterItemPadding = 0,
                        itemContainerWidth = self._itemContainerWidth,
                        itemContainerHeight = self._itemContainerHeight;
                    if (self._useTouchLayout)
                    {
                        var widthInc = self._touchContainerWidth - self._containerWidth,
                            heightInc = self._touchContainerHeight - self._containerHeight;
                        filterItemPadding = heightInc / 4;
                        itemContainerWidth = itemContainerWidth + widthInc;
                        itemContainerHeight = itemContainerHeight + heightInc / 2;
                        self._itemContainerHeight = itemContainerHeight;
                        self._itemContainerWidth = itemContainerWidth;
                        $(self.itemList).css({
                            width: itemContainerWidth + "px", height: itemContainerHeight + "px"
                        });
                        self._itemHeight += filterItemPadding
                    }
                    self.defaultItemWidth = itemContainerWidth - self._itemDivMargin * 2 - self._itemDivBorder * 2;
                    var itemsWrap = document.createElement("div");
                    self._itemsWrap = itemsWrap;
                    itemsWrap.className = itemsWrapperClass;
                    var allValues = self._allValues,
                        itemHeight = self._itemHeight,
                        pageCount = Math_round(itemContainerHeight / itemHeight),
                        totalItemsHeight = 0,
                        maxItemWidth = 0;
                    for (var i = 0, len = allValues.length; i < len; i++)
                    {
                        var text = allValues[i];
                        totalItemsHeight += itemHeight;
                        if (i >= pageCount)
                        {
                            continue
                        }
                        maxItemWidth = Math_max(self._getItemWidthByText(text), maxItemWidth);
                        var itemOuterDiv = document.createElement("div");
                        itemOuterDiv.className = filterItemClass + " ui-corner-all";
                        $(itemOuterDiv).css({
                            display: "block", padding: filterItemPadding / 2, "border-width": self._itemDivBorder + "px", margin: self._itemDivMargin + "px", height: self._itemDivHeight + "px", "box-sizing": "content-box"
                        });
                        itemsWrap.appendChild(itemOuterDiv);
                        self._itemOuterDivs.push(itemOuterDiv);
                        var inputEle = document.createElement("input");
                        inputEle.className = itemInputClass;
                        inputEle.setAttribute("type", "checkbox");
                        inputEle.setAttribute("value", text);
                        inputEle.style.margin = "3px";
                        inputEle.style.padding = "0";
                        itemOuterDiv.appendChild(inputEle);
                        self._inputElements.push(inputEle);
                        var spanEle = document.createElement("span");
                        spanEle.className = itemSpanClass;
                        spanEle.innerHTML = text;
                        self._spanElements.push(spanEle);
                        itemOuterDiv.appendChild(spanEle)
                    }
                    self._maxItemWidth = maxItemWidth;
                    self._totalItemsHeight = totalItemsHeight;
                    self.itemList.empty();
                    var table = document.createElement('table'),
                        tr1 = document.createElement('tr'),
                        tr2 = document.createElement('tr'),
                        itemsTd = document.createElement('td'),
                        cornerTd = document.createElement('td'),
                        vScrollbarTd = document.createElement('td'),
                        hScrollbarTd = document.createElement('td');
                    self._hScrollbarTd = hScrollbarTd;
                    self._vScrollbarTd = vScrollbarTd;
                    $(tr1).css({
                        border: 0, margin: 0, padding: 0
                    });
                    $(tr2).css({
                        border: 0, margin: 0, padding: 0
                    });
                    $(itemsTd).css({
                        border: 0, margin: 0, padding: 0
                    });
                    $(vScrollbarTd).css({
                        border: 0, margin: 0, padding: 0
                    });
                    $(hScrollbarTd).css({
                        border: 0, margin: 0, padding: 0
                    });
                    $(cornerTd).css({
                        border: 0, margin: 0, padding: 0
                    });
                    tr1.appendChild(itemsTd);
                    tr1.appendChild(vScrollbarTd);
                    tr2.appendChild(hScrollbarTd);
                    tr2.appendChild(cornerTd);
                    table.appendChild(tr1);
                    table.appendChild(tr2);
                    itemsTd.appendChild(itemsWrap);
                    $(table).css({
                        width: itemContainerWidth, height: itemContainerHeight, border: 0, margin: 0, padding: 0
                    }).attr({
                        cellspacing: 0, cellpadding: 0, border: 0
                    });
                    self._refreshScrollbar();
                    $(self.itemList).append(table);
                    self._setItemWidth();
                    self._setCheckedValues()
                };
                _GcFilterDialog.prototype._updateItemsLayout = function(itemIndex)
                {
                    var self = this,
                        searchedValues = self._searchedValues,
                        spanElements = self._spanElements,
                        inputElements = self._inputElements,
                        maxItemWidth = 0,
                        itemHeight = self._itemHeight,
                        topItemIndex = itemIndex;
                    for (var i = 0, len = spanElements.length; i < len; i++)
                    {
                        var spanEle = spanElements[i],
                            inputEle = inputElements[i],
                            value = searchedValues[itemIndex++];
                        if (spanEle && value && value !== '')
                        {
                            $(spanEle).parent().show();
                            spanEle.innerHTML = value;
                            inputEle.setAttribute("value", value);
                            maxItemWidth = Math_max(self._getItemWidthByText(value), maxItemWidth)
                        }
                        else
                        {
                            spanEle.innerHTML = '';
                            inputEle.setAttribute("value", '');
                            $(spanEle).parent().hide()
                        }
                    }
                    self._maxItemWidth = maxItemWidth;
                    self._totalItemsHeight = searchedValues.length * itemHeight;
                    self._refreshScrollbar();
                    var scrollbarV = self._scrollbarV;
                    if (scrollbarV)
                    {
                        scrollbarV.value(topItemIndex)
                    }
                    self._setItemWidth();
                    self._setCheckedValues()
                };
                _GcFilterDialog.prototype._refreshScrollbar = function()
                {
                    var self = this,
                        maxItemWidth = self._maxItemWidth,
                        totalItemsHeight = self._totalItemsHeight,
                        itemContainerWidth = self._itemContainerWidth,
                        itemContainerHeight = self._itemContainerHeight,
                        itemHeight = self._itemHeight,
                        scrollbarSize = self._defaultScrollbarSize,
                        pageWidth = itemContainerWidth - scrollbarSize,
                        pageHeight = itemContainerHeight - scrollbarSize,
                        searchedValues = self._searchedValues;
                    var result = self._isNeedScrollbars(maxItemWidth, totalItemsHeight, itemContainerWidth, itemContainerHeight),
                        isNeedVScroll = result.isNeedVScroll,
                        isNeedHScroll = result.isNeedHScroll;
                    if (isNeedVScroll)
                    {
                        if (!isNeedHScroll)
                        {
                            pageHeight += scrollbarSize
                        }
                        if (!self._scrollbarV)
                        {
                            self._createVerticalScrollbar()
                        }
                        var pageValue = Math_floor(pageHeight / itemHeight);
                        var scrollbarV = self._scrollbarV;
                        scrollbarV.width(scrollbarSize);
                        scrollbarV.height(pageHeight);
                        scrollbarV.minimum(0);
                        scrollbarV.maximum(searchedValues.length - pageValue);
                        scrollbarV.pageValue(pageValue);
                        scrollbarV.smallChange(1);
                        scrollbarV.largeChange(pageValue - 1);
                        scrollbarV.refreshLayout();
                        $(self._vScrollbarTd).show();
                        self._showVerticalScrollbar = true
                    }
                    else
                    {
                        $(self._vScrollbarTd).hide();
                        self._showVerticalScrollbar = false
                    }
                    if (isNeedHScroll)
                    {
                        if (!isNeedVScroll)
                        {
                            pageWidth += scrollbarSize
                        }
                        if (!self._scrollbarH)
                        {
                            self._createHorizontalScrollbar()
                        }
                        var scrollbarH = self._scrollbarH;
                        scrollbarH.width(pageWidth);
                        scrollbarH.height(scrollbarSize);
                        scrollbarH.minimum(0);
                        scrollbarH.maximum(maxItemWidth - pageWidth);
                        scrollbarH.pageValue(pageWidth);
                        scrollbarH.smallChange(itemHeight);
                        scrollbarH.largeChange(pageWidth);
                        scrollbarH.refreshLayout();
                        $(self._hScrollbarTd).show();
                        self._showHorizontalScrollbar = true
                    }
                    else
                    {
                        $(self._hScrollbarTd).hide();
                        self._showHorizontalScrollbar = false
                    }
                    if (!isNeedHScroll && !isNeedVScroll)
                    {
                        pageHeight = itemContainerHeight;
                        pageWidth = itemContainerWidth
                    }
                    $(self._itemsWrap).css({
                        width: pageWidth, height: pageHeight, overflow: 'hidden'
                    })
                };
                _GcFilterDialog.prototype._vscrollDelegate = function(newValue)
                {
                    this._updateItemsLayout(newValue)
                };
                _GcFilterDialog.prototype._hscrollDelegate = function(newValue)
                {
                    $("." + filterItemClass).css('left', 0 - newValue)
                };
                _GcFilterDialog.prototype._createVerticalScrollbar = function()
                {
                    var self = this;
                    self._scrollbarV = new Sheets.Scrollbar(false);
                    var vScrollbar = self._scrollbarV.getScrollbar();
                    self._vScrollbarTd.appendChild(vScrollbar);
                    $(vScrollbar).bind(cmd_scroll + ns_scrollbar, function(e, args)
                    {
                        var scrollEventType = args.scrollEventType,
                            scrollOrientation = args.scrollOrientation;
                        e.data = self;
                        if (scrollOrientation === 1)
                        {
                            var newValue = args.newValue;
                            switch (args.scrollEventType)
                            {
                                case 0:
                                case 1:
                                case 2:
                                case 3:
                                case 5:
                                    self._vscrollDelegate(newValue);
                                    break;
                                default:
                                    break
                            }
                        }
                    })
                };
                _GcFilterDialog.prototype._createHorizontalScrollbar = function()
                {
                    var self = this;
                    self._scrollbarH = new Sheets.Scrollbar(true);
                    var hScrollbar = self._scrollbarH.getScrollbar();
                    self._hScrollbarTd.appendChild(hScrollbar);
                    $(hScrollbar).bind(cmd_scroll + ns_scrollbar, function(e, args)
                    {
                        var scrollEventType = args.scrollEventType,
                            scrollOrientation = args.scrollOrientation;
                        e.data = self;
                        if (scrollOrientation === 0)
                        {
                            var newValue = args.newValue;
                            switch (args.scrollEventType)
                            {
                                case 0:
                                case 1:
                                case 2:
                                case 3:
                                case 5:
                                    self._hscrollDelegate(newValue);
                                    break;
                                default:
                                    break
                            }
                        }
                    })
                };
                _GcFilterDialog.prototype._isNeedScrollbars = function(contentWidth, contentHeight, containerWidth, containerHeight)
                {
                    var scrollbarSize = this._defaultScrollbarSize,
                        pageWidth = containerWidth - scrollbarSize,
                        pageHeight = containerHeight - scrollbarSize,
                        result = {
                            isNeedHScroll: false, isNeedVScroll: false
                        };
                    if (contentWidth > containerWidth)
                    {
                        result.isNeedHScroll = true;
                        if (contentHeight > pageHeight)
                        {
                            result.isNeedVScroll = true
                        }
                        else
                        {
                            result.isNeedVScroll = false
                        }
                    }
                    if (contentHeight > containerHeight)
                    {
                        result.isNeedVScroll = true;
                        if (contentWidth > pageWidth)
                        {
                            result.isNeedHScroll = true
                        }
                        else
                        {
                            result.isNeedHScroll = false
                        }
                    }
                    return result
                };
                _GcFilterDialog.prototype._getItemWidthByText = function(text)
                {
                    var self = this;
                    if (!self._itemSpanElement)
                    {
                        var inputEle = document.createElement("input");
                        inputEle.className = itemInputClass;
                        inputEle.setAttribute("type", "checkbox");
                        inputEle.style.display = "none";
                        self._itemInputElement = inputEle;
                        var spanEle = document.createElement("span");
                        spanEle.className = itemSpanClass;
                        spanEle.style.display = "none";
                        self._itemSpanElement = spanEle;
                        document.body.insertBefore(inputEle, keyword_null);
                        document.body.insertBefore(spanEle, keyword_null);
                        var inputMargin = parseFloat($(inputEle).css('margin-left')) + parseFloat($(inputEle).css('margin-right'));
                        if (isNaN(inputMargin))
                        {
                            inputMargin = 0
                        }
                        var inputPadding = parseFloat($(inputEle).css('padding-left')) + parseFloat($(inputEle).css('padding-right'));
                        if (isNaN(inputPadding))
                        {
                            inputPadding = 0
                        }
                        var spanMargin = parseFloat($(spanEle).css('margin-left')) + parseFloat($(spanEle).css('margin-right'));
                        if (isNaN(spanMargin))
                        {
                            spanMargin = 0
                        }
                        var spanPadding = parseFloat($(spanEle).css('spanPadding-left')) + parseFloat($(spanEle).css('spanPadding-right'));
                        if (isNaN(spanPadding))
                        {
                            spanPadding = 0
                        }
                        self._itemInputWidth = $(inputEle).width() + inputMargin + inputPadding;
                        self._itemSpanPartWidth = spanMargin + spanPadding
                    }
                    self._itemSpanElement.innerHTML = text;
                    var spanWidth = $(self._itemSpanElement).width();
                    return spanWidth + self._itemInputWidth + self._itemSpanPartWidth + 1 + self._itemDivMargin * 2 + self._itemDivBorder * 2
                };
                _GcFilterDialog.prototype._setItemWidth = function()
                {
                    var self = this,
                        filterItems = $(self._itemOuterDivs),
                        showVertical = self._showVerticalScrollbar,
                        showHorizontal = self._showHorizontalScrollbar,
                        width;
                    if (showHorizontal)
                    {
                        width = self._maxItemWidth
                    }
                    else
                    {
                        if (showVertical)
                        {
                            width = self.defaultItemWidth - self._defaultScrollbarSize
                        }
                        else
                        {
                            width = self.defaultItemWidth
                        }
                    }
                    filterItems.css("width", width)
                };
                _GcFilterDialog.prototype._ArrayToDic = function(array)
                {
                    var dic = {};
                    $.each(array, function(i, v)
                    {
                        dic[v] = v
                    });
                    return dic
                };
                _GcFilterDialog.prototype._setCheckedValues = function()
                {
                    var checkedActualValues = this._allCheckedValues,
                        dic = this._ArrayToDic(checkedActualValues);
                    $(this._inputElements).each(function()
                    {
                        var $element = $(this);
                        var value = $element.val();
                        if (dic[value] !== keyword_null && typeof(dic[value]) != const_undefined)
                        {
                            $element.prop("checked", true)
                        }
                        else
                        {
                            $element.prop("checked", false)
                        }
                    })
                };
                _GcFilterDialog.prototype._sortByUser = function(isAsc)
                {
                    var drf = this.filterButtonInfo.rowFilter;
                    if (!drf)
                    {
                        return
                    }
                    var sheet = this.sheet,
                        sheetName = sheet._name;
                    if (!sheet)
                    {
                        return
                    }
                    var colIndex = this.filterButtonInfo.col;
                    sheet.triggerRangeSorting({
                        sheet: sheet, sheetName: sheetName, col: colIndex, ascending: isAsc
                    });
                    var oldStatus = sheet.isPaintSuspended();
                    sheet.isPaintSuspended(true);
                    drf.sortColumn(colIndex, isAsc);
                    sheet.isPaintSuspended(oldStatus);
                    sheet.triggerRangeSorted({
                        sheet: sheet, sheetName: sheetName, col: colIndex, ascending: isAsc
                    })
                };
                _GcFilterDialog.prototype._setButtonState = function()
                {
                    var checkedLength = this._allCheckedValues.length;
                    var okButton = $("#" + okID);
                    var externalDiabledClassName = "ui-button-disabled ui-state-disabled",
                        notExternalDiabledClassName = "filter-button-disable";
                    if (checkedLength > 0)
                    {
                        okButton.attr("disabled", false).removeClass(externalDiabledClassName + " " + notExternalDiabledClassName)
                    }
                    else
                    {
                        okButton.attr("disabled", true).addClass(externalDiabledClassName + " " + notExternalDiabledClassName)
                    }
                };
                _GcFilterDialog.prototype._initFirstOpenCache = function()
                {
                    this._firstOpenCache = this._allCheckedValues.concat([])
                };
                _GcFilterDialog.getImageSrc = function(state)
                {
                    if (state === 0)
                    {
                        return "data:image/png;base64,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"
                    }
                    else if (state === 1)
                    {
                        return "data:image/png;base64,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"
                    }
                    else if (state === 2)
                    {
                        return "data:image/png;base64,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"
                    }
                    else if (state === 3)
                    {
                        return "data:image/png;base64,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"
                    }
                    else if (state === 4)
                    {
                        return "data:image/png;base64,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" + "FTkSuQmCC"
                    }
                    else if (state === 5)
                    {
                        return "data:image/png;base64,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"
                    }
                    else if (state === 6)
                    {
                        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAABy0lEQVR42pyST2gTQ" + "RTGv9nEpCnqTasHES8VLCioiFDIYYum+I/ebFXQm1BbsdSDhKgoXhS8tLQSqAhexIInETwJIqJiexJEZXupwRJNbRsy2Z3dzHxesjGEChs/eMx7A+837817giQAYCD3cZuScqG8Wtj19tG5n/iHhBAkKcLYCh3fdSd04HXCq5xHG2oAdOAdNIG3qAJ5tW1A/9hrm8Z" + "sV+7vDLTe2nsmP9AWwATuXe27330lLwvLkloHY5EBR0dexkB0xxKp9Ieno8MbOjYP1ZRMHz77YE8kAMk35V/fkpWSc6L3dL7Tl6uPAaAm155EAYhwjFHVOsY4AEwPXXkG7W+0EqmCodlRW17oCkrO5Pjc55lon7i2mBqenc7ETTmLFWdvaenLpijJDUBcywsAYFRwu" + "/jja1dMWNfWKf2WEOJ43T8ihLgHACAJkpgZvNQ3kTnJG/u6Z8O7ZgNwAACbzCb5dxNVLPnQW3aKyY7EKABM2XZPcwUk5wG8qIfvSL5qtJAfHLnvF+Z2GsPr2fefipPH0luq5aXsOi3frJ+5xhSm+k/1VErOxRWlqgkrfujO/t191ZqxLeB5azbJeSFELnz9v/agVX8" + "GAIjG5r9I9yjkAAAAAElFTkSuQmCC"
                    }
                    else if (state === 7)
                    {
                        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZ" + "QBQYWludC5ORVQgVjMuNS41Tib51gAAAXlJREFUOE9jYACCqRH5a6eGZu6cHl00d2pUwa6J7r4Xe4w1U0ByWMB/DLHJnoHbQIKzI1PEp3r6vKjVU72HQzNIGNOA6W5uYiCZmUHxM+v0Vf836KuHkWQASPGciGznSe6+/+v01Vbh0YzdBeBwiC560GWi+aLVXEccxJ/" + "i6KhNdBjMCM/u7be3+99hpJEK0jTJ01a0y1hjKVEGTHH31e4w1vxSrqP0tVZPbXazodqKSl2VV9W6KnOJMoCAf4mLRpAq/+pTEh4F+79aJSwGxwjJseBZdHCVa/b2/1YR00vJMsAtd+c957T1D42De17iMKARKO4NTUiuQLoLrs694IAT0PbvNrFzNYwDOv9bRc4Iw" + "GKIMVQzKCWCsBNcDVDzaafUdbfMwiZNMwnq/mIeNvkgDldsgWo+hqyZ2TVr+0egIRIgQcuomb7G/h3/zaOmaeFxBcJ2l6xtx8xDJ/6wDJ+cYhU2g8vYv/M9yABj//aLOFxRTUbU49YCALt6h216b0oVAAAAAElFTkSuQmCC"
                    }
                    else if (state === 8)
                    {
                        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAKBJREFUOE+l0cENwjAMBdCM0BEYhZG6AjdvwQhMUvXQI0KcKo6IY2/9v0qQnVilFoenJF+2q6RJRP7ihhFuGOGGO851Zg4/9PCGi8oOD+iAzQM8c7bRRTX9pStMmbnGd1Nhwz2vbOD+ATcwteagjPBSZuAVTmBqzUHhnTnkA2wkPmJT2wRKGbLk1avZHUAcwldv/n/hhhFuGOGGEW54nKQVV2qyDejeW7YAAAAASUVORK5CYII="
                    }
                    else if (state === 9)
                    {
                        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAHpJREFUOE+lz8ENgDAMA8COxEiMkxWYgkmYhCGgllpkUz8aeJyQrVQJJSJ+sWWGLTNsmWHLaq22amkZX2T0MiuB7ASPOMusBIKNh9Evekh4weaTDOfDUDTYdBnTF/AjbOYssxJIf9Q39ouG35DwhS0zbJlhywxbzotyAztMtZGgPPrJAAAAAElFTkSuQmCC"
                    }
                    return ""
                };
                return _GcFilterDialog
            })(Sheets.BaseDialog);
        Sheets._GcFilterDialog = _GcFilterDialog
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
        Sheets.feature("filter", ["core.common", "core.stringResource", "filter_ui"]);
        var keyword_null = null,
            keyword_undefined = undefined;
        var RowFilterBase = (function()
            {
                function RowFilterBase(range)
                {
                    this.range = range;
                    this.reset();
                    this.typeName = ""
                }
                RowFilterBase.prototype.filterButtonVisible = function(col, value)
                {
                    var self = this,
                        range = self.range,
                        sheet = self.sheet;
                    var c,
                        endC;
                    if (self.range.row < 0)
                    {
                        c = 0;
                        endC = sheet.getColumnCount()
                    }
                    else
                    {
                        c = range.col;
                        endC = range.col + range.colCount
                    }
                    switch (arguments.length)
                    {
                        case 0:
                            for (var i = c; i < endC; i++)
                            {
                                var showFilterButton = self.filterButtonVisibleInfo[i];
                                if (showFilterButton === true || showFilterButton === undefined)
                                {
                                    return true
                                }
                            }
                            return false;
                        case 1:
                            var arg0 = arguments[0];
                            if (typeof arg0 === "number")
                            {
                                if (col >= c && col < endC && self.filterButtonVisibleInfo[col] === keyword_undefined)
                                {
                                    self.filterButtonVisibleInfo[col] = true
                                }
                                return self.filterButtonVisibleInfo[col]
                            }
                            else if (typeof arg0 === "boolean")
                            {
                                for (var i = c; i < endC; i++)
                                {
                                    self.filterButtonVisibleInfo[i] = arg0
                                }
                                if (sheet)
                                {
                                    sheet.invalidate()
                                }
                                return self
                            }
                        case 2:
                            if (col >= c && col < endC && self.filterButtonVisibleInfo[col] !== value)
                            {
                                self.filterButtonVisibleInfo[col] = value
                            }
                            if (sheet)
                            {
                                sheet.invalidate()
                            }
                            return self
                    }
                };
                RowFilterBase.prototype.getShowFilterButton = function()
                {
                    return this.filterButtonVisible()
                };
                RowFilterBase.prototype.setShowFilterButton = function(value)
                {
                    this.filterButtonVisible(value)
                };
                RowFilterBase.prototype.addFilterItem = function(col, filterItem)
                {
                    var self = this;
                    if (filterItem === keyword_undefined || filterItem === keyword_null)
                    {
                        throw new Error(Sheets.SR.Exp_FilterItemIsNull);
                    }
                    if (col < -1 || col >= self.sheet.getColumnCount())
                    {
                        throw new Error(Sheets.SR.Exp_InvalidColumnIndex);
                    }
                    if (!self.range)
                    {
                        return
                    }
                    var range = self.sheet._getActualRange(self.range);
                    if (col < range.col || col >= range.col + range.colCount)
                    {
                        return
                    }
                    var filterItems = self.filterItemMap[col];
                    if (!filterItems)
                    {
                        filterItems = []
                    }
                    filterItems.push(filterItem);
                    self.filterItemMap[col] = filterItems
                };
                RowFilterBase.prototype.addAverageFilter = function(col, compareType)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return
                    }
                    var con = new Sheets.AverageCondition(compareType);
                    this.addFilterItem(col, con)
                };
                RowFilterBase.prototype.addBackgroundFilter = function(col, color)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return
                    }
                    var con = new Sheets.ColorCondition(0, color);
                    this.addFilterItem(col, con)
                };
                RowFilterBase.prototype.addDateFilter = function(col, compareType, date)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return
                    }
                    var con = new Sheets.DateCondition(compareType, date);
                    this.addFilterItem(col, con)
                };
                RowFilterBase.prototype.addForegroundFilter = function(col, color)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return
                    }
                    var con = new Sheets.ColorCondition(1, color);
                    this.addFilterItem(col, con)
                };
                RowFilterBase.prototype.addNumberFilter = function(col, compareType, num)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return
                    }
                    var con = new Sheets.NumberCondition(compareType, num);
                    this.addFilterItem(col, con)
                };
                RowFilterBase.prototype.addTextFilter = function(col, compareType, text)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return
                    }
                    var con = new Sheets.TextCondition(compareType, text);
                    this.addFilterItem(col, con)
                };
                RowFilterBase.prototype.addTop10Filter = function(col, compareType, rank)
                {
                    if (!Sheets.features.conditionalFormat)
                    {
                        return
                    }
                    var con = new Sheets.Top10Condition(compareType, rank);
                    this.addFilterItem(col, con)
                };
                RowFilterBase.prototype.removeFilterItems = function(col)
                {
                    var self = this;
                    self._removeFilteredItems(col);
                    if (self.filterItemMap[col])
                    {
                        self.filterItemMap.splice(col, 1, keyword_null)
                    }
                    self.unfilter(col)
                };
                RowFilterBase.prototype.unfilter = function(col)
                {
                    var self = this;
                    if (self.sheet)
                    {
                        self.sheet._bindToAutoRefresh(function(col)
                        {
                            if (col !== keyword_null && col !== keyword_undefined)
                            {
                                self._unfilterColumn(col);
                                self.reFilter()
                            }
                            else
                            {
                                var filteredColumns = self.filteredColumns;
                                if (filteredColumns)
                                {
                                    for (var i = filteredColumns.length - 1; i >= 0; i--)
                                    {
                                        self._unfilterColumn(filteredColumns[i])
                                    }
                                }
                            }
                            self.sheet.refreshObjectsAboveSheet();
                            self.onFilter(self.getFilterArgs(1))
                        })(col)
                    }
                };
                RowFilterBase.prototype._filterColumn = function(col)
                {
                    var self = this;
                    self._unfilterColumn(col);
                    var startRow,
                        rowCount;
                    if (self.filterItemMap[col])
                    {
                        if (!self.range)
                        {
                            return
                        }
                        if (self.range && self.range.col !== -1 && (col < self.range.col || col > self.range.col + self.range.colCount - 1))
                        {
                            return
                        }
                        startRow = self.range.row;
                        rowCount = self.range.rowCount;
                        if (startRow === -1)
                        {
                            startRow = 0;
                            rowCount = self.sheet.getRowCount()
                        }
                        var dataCache = {};
                        dataCache = self._getRowDataCache(col, startRow, rowCount);
                        for (var row = startRow; row < startRow + rowCount; row++)
                        {
                            if (!self.isRowFilteredOut(row))
                            {
                                self._filterRowByCell(row, col, dataCache)
                            }
                        }
                        self._setColumnFilteredState(col, true)
                    }
                };
                RowFilterBase.prototype._getRowDataCache = function(col, rBegin, rCount)
                {
                    var dataCache = {};
                    var itemTypeArray = [];
                    itemTypeArray = this._getItemType(col);
                    var itemKey;
                    var itemTypeLen = itemTypeArray.length;
                    for (var r = rBegin; r < rBegin + rCount; r++)
                    {
                        var cellCache = {};
                        for (var i = 0; i < itemTypeLen; i++)
                        {
                            itemKey = itemTypeArray[i];
                            var style;
                            switch (itemKey)
                            {
                                case"T":
                                    cellCache[itemKey] = this.sheet.getText(r, col);
                                    break;
                                case"BC":
                                    style = this.sheet.getActualStyle(r, col);
                                    if (style)
                                    {
                                        cellCache[itemKey] = style.backColor
                                    }
                                    break;
                                case"FC":
                                    style = this.sheet.getActualStyle(r, col);
                                    if (style)
                                    {
                                        cellCache[itemKey] = style.foreColor
                                    }
                                    break;
                                case"V":
                                    cellCache[itemKey] = this.sheet.getValue(r, col);
                                    break
                            }
                        }
                        dataCache[r] = cellCache
                    }
                    return dataCache
                };
                RowFilterBase.prototype._getItemType = function(col)
                {
                    var itemtypeArray = [];
                    var filterItems = this.filterItemMap[col];
                    var len = filterItems.length;
                    for (var i = 0; i < len; i++)
                    {
                        var filterItem = filterItems[i];
                        if (filterItem.conditionType === "RelationCondition" || filterItem instanceof Sheets.RelationCondition)
                        {
                            if (filterItem.item1)
                            {
                                if (filterItem.item1.conditionType === "TextCondition" || filterItem.item1.conditionType === "TextLengthCondition")
                                {
                                    if (Sheets.ArrayHelper.indexOf(itemtypeArray, "T") === -1)
                                    {
                                        itemtypeArray.push("T")
                                    }
                                }
                                else if (filterItem.item1.conditionType === "ColorCondition")
                                {
                                    if (filterItem.item1.compareType === 0)
                                    {
                                        if (Sheets.ArrayHelper.indexOf(itemtypeArray, "BC") === -1)
                                        {
                                            itemtypeArray.push("BC")
                                        }
                                    }
                                    else if (filterItem.item1.compareType === 1)
                                    {
                                        if (Sheets.ArrayHelper.indexOf(itemtypeArray, "FC") === -1)
                                        {
                                            itemtypeArray.push("FC")
                                        }
                                    }
                                }
                                else
                                {
                                    if (Sheets.ArrayHelper.indexOf(itemtypeArray, "V") === -1)
                                    {
                                        itemtypeArray.push("V")
                                    }
                                }
                            }
                            if (filterItem.item2)
                            {
                                if (filterItem.item2.conditionType === "TextCondition" || filterItem.item2.conditionType === "TextLengthCondition")
                                {
                                    if (Sheets.ArrayHelper.indexOf(itemtypeArray, "T") === -1)
                                    {
                                        itemtypeArray.push("T")
                                    }
                                }
                                else if (filterItem.item2.conditionType === "ColorCondition")
                                {
                                    if (filterItem.item2.compareType === 0)
                                    {
                                        if (Sheets.ArrayHelper.indexOf(itemtypeArray, "BC") === -1)
                                        {
                                            itemtypeArray.push("BC")
                                        }
                                    }
                                    else if (filterItem.item2.compareType === 1)
                                    {
                                        if (Sheets.ArrayHelper.indexOf(itemtypeArray, "FC") === -1)
                                        {
                                            itemtypeArray.push("FC")
                                        }
                                    }
                                }
                                else
                                {
                                    if (Sheets.ArrayHelper.indexOf(itemtypeArray, "V") === -1)
                                    {
                                        itemtypeArray.push("V")
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (filterItem.conditionType === "TextCondition" || filterItem.conditionType === "TextLengthCondition")
                            {
                                if (Sheets.ArrayHelper.indexOf(itemtypeArray, "T") === -1)
                                {
                                    itemtypeArray.push("T")
                                }
                            }
                            else if (filterItem.conditionType === "ColorCondition")
                            {
                                if (filterItem.compareType === 0)
                                {
                                    if (Sheets.ArrayHelper.indexOf(itemtypeArray, "BC") === -1)
                                    {
                                        itemtypeArray.push("BC")
                                    }
                                }
                                else if (filterItem.compareType === 1)
                                {
                                    if (Sheets.ArrayHelper.indexOf(itemtypeArray, "FC") === -1)
                                    {
                                        itemtypeArray.push("FC")
                                    }
                                }
                            }
                            else
                            {
                                if (Sheets.ArrayHelper.indexOf(itemtypeArray, "V") === -1)
                                {
                                    itemtypeArray.push("V")
                                }
                            }
                        }
                    }
                    return itemtypeArray
                };
                RowFilterBase.prototype.filter = function(col)
                {
                    var self = this,
                        sheet = self.sheet;
                    if (sheet)
                    {
                        sheet._bindToAutoRefresh(function(col)
                        {
                            if (col !== keyword_null && col !== keyword_undefined && self.filterItemMap[col])
                            {
                                self._filterColumn(col)
                            }
                            else
                            {
                                var filterItemMap = self.filterItemMap;
                                if (filterItemMap)
                                {
                                    for (var i = 0; i < filterItemMap.length; i++)
                                    {
                                        if (filterItemMap[i] && filterItemMap[i].length > 0)
                                        {
                                            self._filterColumn(i)
                                        }
                                    }
                                }
                            }
                            sheet.refreshObjectsAboveSheet();
                            self.onFilter(self.getFilterArgs(0))
                        })(col)
                    }
                };
                RowFilterBase.prototype.getFilterArgs = function(filterActionType)
                {
                    var self = this,
                        sheet = self.sheet,
                        range = self.range,
                        filteredRows = [],
                        filteredOutRows = [];
                    if (range)
                    {
                        var startRow = range.row,
                            rowCount = range.rowCount;
                        if (startRow === -1)
                        {
                            startRow = 0;
                            rowCount = sheet.getRowCount()
                        }
                        for (var r = startRow, len = startRow + rowCount; r < len; r++)
                        {
                            if (self.isRowFilteredOut(r))
                            {
                                filteredOutRows.push(r)
                            }
                            else
                            {
                                filteredRows.push(r)
                            }
                        }
                    }
                    var filterArgs = {
                            action: filterActionType, sheet: sheet, range: range, filteredRows: filteredRows, filteredOutRows: filteredOutRows
                        };
                    return filterArgs
                };
                RowFilterBase.prototype.onFilter = function(args){};
                RowFilterBase.prototype.isHideRowFilter = function()
                {
                    return false
                };
                RowFilterBase.prototype.isFiltered = function()
                {
                    return this.filteredColumns.length > 0
                };
                RowFilterBase.prototype.isColumnFiltered = function(col)
                {
                    return Sheets.ArrayHelper.contains(this.filteredColumns, col)
                };
                RowFilterBase.prototype.isRowFilteredOut = function(row)
                {
                    var self = this;
                    if (self.isFiltered())
                    {
                        var range = self.range;
                        if (!range)
                        {
                            return false
                        }
                        if (range && range.row !== -1 && (row < range.row || row > range.row + range.rowCount - 1))
                        {
                            return false
                        }
                        if (self.filteredInRowsWithColIndexs)
                        {
                            var filteredColumnIndexs = self.filteredInRowsWithColIndexs[row];
                            if (filteredColumnIndexs && filteredColumnIndexs.length >= self.filteredColumns.length)
                            {
                                return false
                            }
                        }
                        return true
                    }
                    return false
                };
                RowFilterBase.prototype.reset = function()
                {
                    var self = this;
                    self.unfilter();
                    self.filterItemMap = [];
                    self.filteredColumns = [];
                    self.filteredItems = [];
                    self.filteredInRowsWithColIndexs = {};
                    self.filterButtonVisibleInfo = {};
                    self.sortInfo = keyword_null
                };
                RowFilterBase.prototype.isFilterHeader = function(row, col, sheetArea)
                {
                    var self = this;
                    var result = false;
                    if (self.range)
                    {
                        var range = self.sheet._getActualRange(self.range, sheetArea);
                        if (sheetArea === 1 && row === self.sheet.getRowCount(sheetArea) - 1 && range.row - 1 < 0)
                        {
                            if (col >= range.col && col < range.col + range.colCount)
                            {
                                result = true
                            }
                        }
                        else if (sheetArea === 3 && row === range.row - 1)
                        {
                            if (col >= range.col && col < range.col + range.colCount)
                            {
                                result = true
                            }
                        }
                    }
                    return result
                };
                RowFilterBase.prototype.isLastFilteredColumn = function(col)
                {
                    var count = this.filteredColumns.length;
                    if (count > 0)
                    {
                        return this.filteredColumns[count - 1] === col
                    }
                    return false
                };
                RowFilterBase.prototype.getFilterItems = function(col)
                {
                    var itemList = this.filterItemMap[col];
                    if (!itemList)
                    {
                        itemList = []
                    }
                    return itemList
                };
                RowFilterBase.prototype.getFilteredItems = function()
                {
                    return this.filteredItems
                };
                RowFilterBase.prototype.sortColumn = function(col, ascending)
                {
                    var self = this,
                        sheet = self.sheet;
                    if (sheet)
                    {
                        sheet._bindToAutoRefresh(function(col, ascending)
                        {
                            var range = sheet._getActualRange(self.range);
                            var oldState = sheet.isPaintSuspended();
                            sheet.isPaintSuspended(true);
                            var ret = sheet.sortRange(range.row, range.col, range.rowCount, range.colCount, true, [{
                                        index: col, ascending: ascending
                                    }]);
                            sheet.isPaintSuspended(oldState);
                            if (ret)
                            {
                                self.sortInfo = {
                                    index: col, ascending: ascending
                                };
                                if (self.isColumnFiltered(col))
                                {
                                    self.reFilter()
                                }
                            }
                        })(col, ascending)
                    }
                };
                RowFilterBase.prototype.getSortState = function(col)
                {
                    var state = 0;
                    if (this.sortInfo)
                    {
                        if (this.sortInfo.index === col)
                        {
                            if (this.sortInfo.ascending)
                            {
                                state = 1
                            }
                            else
                            {
                                state = 2
                            }
                        }
                    }
                    return state
                };
                RowFilterBase.prototype.reFilter = function()
                {
                    var self = this;
                    self.filteredInRowsWithColIndexs = {};
                    if (self.filteredItems || self.filteredItems.length > 0)
                    {
                        self.filteredItems.length = 0
                    }
                    if (self.filteredColumns || self.filteredColumns.length > 0)
                    {
                        var tempIndex = [];
                        tempIndex = tempIndex.concat(self.filteredColumns);
                        self.filteredColumns.length = 0;
                        for (var i = 0; i < tempIndex.length; i++)
                        {
                            self.filter(tempIndex[i])
                        }
                    }
                };
                RowFilterBase.prototype.openFilterDialog = function(filterButtonHitInfo){};
                RowFilterBase.prototype._addFilteredInRowsWithColumnIndex = function(row, col)
                {
                    var colIndexs = this.filteredInRowsWithColIndexs[row];
                    if (colIndexs === keyword_undefined || colIndexs === keyword_null)
                    {
                        colIndexs = [col]
                    }
                    else
                    {
                        var arrayHelper = Sheets.ArrayHelper;
                        if (arrayHelper.contains(colIndexs, col))
                        {
                            arrayHelper.remove(colIndexs, col)
                        }
                        colIndexs.push(col)
                    }
                    this.filteredInRowsWithColIndexs[row] = colIndexs
                };
                RowFilterBase.prototype._addFilteredItem = function(filterItem)
                {
                    if (!Sheets.ArrayHelper.contains(this.filteredItems, filterItem))
                    {
                        this.filteredItems.push(filterItem)
                    }
                };
                RowFilterBase.prototype._unfilterColumn = function(col)
                {
                    var self = this,
                        sheet = self.sheet;
                    if (!self.range)
                    {
                        return
                    }
                    var range = sheet._getActualRange(self.range),
                        row;
                    if (self.isColumnFiltered(col))
                    {
                        self._setColumnFilteredState(col, false);
                        self._removeFilteredInRowsWithColumnIndex(col);
                        self._removeFilteredItems(col)
                    }
                };
                RowFilterBase.prototype._setColumnFilteredState = function(col, isFiltered)
                {
                    var self = this;
                    if (isFiltered)
                    {
                        if (self.filteredColumns.length > 0)
                        {
                            if (self.filteredColumns[self.filteredColumns.length - 1] === col)
                            {
                                return
                            }
                            else
                            {
                                Sheets.ArrayHelper.remove(self.filteredColumns, col)
                            }
                        }
                        self.filteredColumns.push(col)
                    }
                    else
                    {
                        Sheets.ArrayHelper.remove(self.filteredColumns, col)
                    }
                };
                RowFilterBase.prototype._removeFilteredItems = function(col)
                {
                    var self = this;
                    if (!self.filterItemMap[col])
                    {
                        return
                    }
                    var removeItems = [];
                    var otherItems = [];
                    for (var i = 0; i < self.filterItemMap.length; i++)
                    {
                        if (i === col)
                        {
                            removeItems = removeItems.concat(self.filterItemMap[i])
                        }
                        else
                        {
                            otherItems = otherItems.concat(self.filterItemMap[i])
                        }
                    }
                    for (var i = 0; i < removeItems.length; i++)
                    {
                        var item = removeItems[i];
                        if (!Sheets.ArrayHelper.contains(otherItems, item))
                        {
                            Sheets.ArrayHelper.remove(self.filteredItems, item)
                        }
                    }
                };
                RowFilterBase.prototype._removeFilteredInRowsWithColumnIndex = function(col)
                {
                    for (var key in this.filteredInRowsWithColIndexs)
                    {
                        if (key)
                        {
                            var colIndexs = this.filteredInRowsWithColIndexs[key];
                            if (colIndexs && Sheets.ArrayHelper.contains(colIndexs, col))
                            {
                                Sheets.ArrayHelper.remove(colIndexs, col);
                                if (colIndexs.length === 0)
                                {
                                    this.filteredInRowsWithColIndexs[key] = keyword_undefined
                                }
                            }
                        }
                    }
                };
                RowFilterBase.prototype._filterRowByCell = function(row, col, dataCache)
                {
                    var self = this;
                    var filterItems = self.filterItemMap[col];
                    for (var i = 0; i < filterItems.length; i++)
                    {
                        var filterItem = filterItems[i];
                        var value1,
                            value2;
                        if (filterItem.conditionType === "RelationCondition" || filterItem instanceof Sheets.RelationCondition)
                        {
                            if (filterItem.item1)
                            {
                                value1 = self._getActualValueFromCache(filterItem.item1, row, col, dataCache);
                                if (filterItem.item1.conditionType === "Top10Condition" || filterItem.item1 instanceof Sheets.Top10Condition)
                                {
                                    filterItem.item1.ranges = self._getReviseRanges(col, self.range)
                                }
                                else if (filterItem.item1.conditionType === "AverageCondition" || filterItem.item1 instanceof Sheets.AverageCondition)
                                {
                                    filterItem.item1.ranges = self._getReviseRanges(col, self.range)
                                }
                            }
                            if (filterItem.item2)
                            {
                                value2 = self._getActualValueFromCache(filterItem.item2, row, col, dataCache);
                                if (filterItem.item2.conditionType === "Top10Condition" || filterItem.item2 instanceof Sheets.Top10Condition)
                                {
                                    filterItem.item2.ranges = self._getReviseRanges(col, self.range)
                                }
                                else if (filterItem.item2.conditionType === "AverageCondition" || filterItem.item2 instanceof Sheets.AverageCondition)
                                {
                                    filterItem.item2.ranges = self._getReviseRanges(col, self.range)
                                }
                            }
                        }
                        else
                        {
                            value1 = self._getActualValueFromCache(filterItem, row, col, dataCache);
                            if (filterItem.conditionType === "Top10Condition" || filterItem instanceof Sheets.Top10Condition)
                            {
                                filterItem.ranges = self._getReviseRanges(col, self.range)
                            }
                            else if (filterItem.conditionType === "AverageCondition" || filterItem instanceof Sheets.AverageCondition)
                            {
                                filterItem.ranges = self._getReviseRanges(col, self.range)
                            }
                        }
                        if (filterItem.evaluate(self.sheet, row, col, value1, value2))
                        {
                            self._addFilteredInRowsWithColumnIndex(row, col);
                            self._addFilteredItem(filterItem);
                            break
                        }
                    }
                };
                RowFilterBase.prototype._getActualValueFromCache = function(filterItem, row, col, dataCache)
                {
                    var value = keyword_null;
                    if (filterItem.conditionType === "TextCondition" || filterItem.conditionType === "TextLengthCondition")
                    {
                        value = dataCache[row]["T"]
                    }
                    else if (filterItem.conditionType === "ColorCondition")
                    {
                        if (filterItem.compareType === 0)
                        {
                            value = dataCache[row]["BC"]
                        }
                        else if (filterItem.compareType === 1)
                        {
                            value = dataCache[row]["FC"]
                        }
                    }
                    else
                    {
                        value = dataCache[row]["V"]
                    }
                    return value
                };
                RowFilterBase.prototype._getReviseRanges = function(col, range)
                {
                    var reviseRange = [];
                    if (range)
                    {
                        var actualRange = this.sheet._getActualRange(range);
                        if (actualRange.col <= col && col < actualRange.col + actualRange.colCount)
                        {
                            reviseRange.push(new Sheets.Range(actualRange.row, col, actualRange.rowCount, 1))
                        }
                    }
                    return reviseRange
                };
                RowFilterBase.prototype._getCandindateDataItems = function(col, outHasBlank)
                {
                    var self = this,
                        sheet = self.sheet;
                    var items = [];
                    var itemsDic = {};
                    var range = sheet._getActualRange(self.range);
                    if (col < range.col || col > range.col + range.colCount - 1)
                    {
                        return items
                    }
                    var hasBlank = false;
                    for (var row = range.row; row < range.row + range.rowCount; row++)
                    {
                        var text = sheet.getText(row, col);
                        if (text === "")
                        {
                            hasBlank = true;
                            continue
                        }
                        if (!itemsDic[text])
                        {
                            if (!self.isRowFilteredOut(row))
                            {
                                if (sheet.getRowHeight(row, 3) > 0)
                                {
                                    items.push(text);
                                    itemsDic[text] = true
                                }
                            }
                            else if (!self.isFiltered() || (self.isLastFilteredColumn(col) && self._isRowfilteredOutByColumn(row, col)))
                            {
                                items.push(text);
                                itemsDic[text] = true
                            }
                            else if (sheet.getRowHeight(row, 3) > 0)
                            {
                                items.push(text);
                                itemsDic[text] = true
                            }
                        }
                    }
                    if (hasBlank && outHasBlank)
                    {
                        outHasBlank.hasBlank = true
                    }
                    return items
                };
                RowFilterBase.prototype._isRowfilteredOutByColumn = function(row, col)
                {
                    var self = this;
                    if (self.filteredColumns.length === 0)
                    {
                        return false
                    }
                    if (self.filteredInRowsWithColIndexs)
                    {
                        var previousColumn = -1;
                        var currentIndex = Sheets.ArrayHelper.indexOf(self.filteredColumns, col);
                        if (currentIndex > 0)
                        {
                            previousColumn = self.filteredColumns[currentIndex - 1]
                        }
                        var colIndexs = self.filteredInRowsWithColIndexs[row];
                        if (previousColumn > -1)
                        {
                            if (!colIndexs || colIndexs.length === 0)
                            {
                                return false
                            }
                            else
                            {
                                return previousColumn === colIndexs[colIndexs.length - 1]
                            }
                        }
                        else
                        {
                            if (!colIndexs || colIndexs.length === 0)
                            {
                                return true
                            }
                            else
                            {
                                return false
                            }
                        }
                    }
                    return false
                };
                RowFilterBase.prototype._addRows = function(row, count)
                {
                    var self = this;
                    if (!self.range)
                    {
                        return
                    }
                    var endRow = self.sheet.getRowCount() - count - 1;
                    if (self.range.row > -1)
                    {
                        var cs = self.range;
                        endRow = cs.row + cs.rowCount - 1;
                        if (cs.row >= row)
                        {
                            self._setRangeInternal(new Sheets.Range(cs.row + count, cs.col, cs.rowCount, cs.colCount))
                        }
                        else if (cs.row < row && row < cs.row + cs.rowCount)
                        {
                            self._setRangeInternal(new Sheets.Range(cs.row, cs.col, cs.rowCount + count, cs.colCount))
                        }
                    }
                    var filteredInRowsWithColIndexs = self.filteredInRowsWithColIndexs;
                    if (self.isFiltered() && filteredInRowsWithColIndexs)
                    {
                        var rowKeys = [];
                        for (var rowKey in filteredInRowsWithColIndexs)
                        {
                            if (filteredInRowsWithColIndexs.hasOwnProperty(rowKey))
                            {
                                rowKeys.push(parseInt(rowKey))
                            }
                        }
                        rowKeys.sort();
                        for (var i = 0, len = rowKeys.length; i < len; i++)
                        {
                            var oldKey = rowKeys[i];
                            if (oldKey >= row && oldKey <= endRow)
                            {
                                var oldValue = filteredInRowsWithColIndexs[oldKey];
                                var newKey = oldKey + count;
                                filteredInRowsWithColIndexs[newKey] = oldValue;
                                filteredInRowsWithColIndexs[oldKey] = keyword_undefined
                            }
                        }
                    }
                    self.reFilter()
                };
                RowFilterBase.prototype._addColumns = function(column, count)
                {
                    var self = this;
                    if (!self.range)
                    {
                        return
                    }
                    var c;
                    if (column >= 0 && self._isSortted())
                    {
                        var addCount = 0;
                        for (var i = 0; i < count; i++)
                        {
                            c = i + column;
                            if (c <= self._sorttedColumn())
                            {
                                addCount++
                            }
                        }
                        self._sorttedColumn(self._sorttedColumn() + addCount)
                    }
                    var startColumn = -1;
                    var columnCount = 0;
                    var cs = self.range;
                    if (cs.col > -1)
                    {
                        if (cs.col >= column)
                        {
                            startColumn = self.range.col;
                            self._setRangeInternal(new Sheets.Range(cs.row, cs.col + count, cs.rowCount, cs.colCount));
                            columnCount = self.range.colCount
                        }
                        else if (cs.col < column && column < cs.col + cs.colCount)
                        {
                            startColumn = column;
                            columnCount = cs.colCount - (column - cs.col);
                            self._setRangeInternal(new Sheets.Range(cs.row, cs.col, cs.rowCount, cs.colCount + count))
                        }
                    }
                    if (startColumn < 0)
                    {
                        startColumn = 0;
                        columnCount = self.sheet.getColumnCount() - count
                    }
                    for (c = startColumn + columnCount - 1; c >= startColumn; c--)
                    {
                        if (c >= column)
                        {
                            var newColumn = c + count;
                            var index = Sheets.ArrayHelper.indexOf(self.filteredColumns, c);
                            if (index >= 0)
                            {
                                self.filteredColumns[index] = newColumn
                            }
                            var conditions = self.filterItemMap[c];
                            if (conditions && conditions.length > 0)
                            {
                                Sheets.ArrayHelper.remove(self.filterItemMap, c);
                                self.filterItemMap[newColumn] = conditions
                            }
                        }
                    }
                    self.reFilter()
                };
                RowFilterBase.prototype._removeRows = function(row, count)
                {
                    var self = this;
                    if (!self.range)
                    {
                        return
                    }
                    var startRow = 0;
                    var endRow = self.sheet.getRowCount() + count - 1;
                    if (self.range.row > -1)
                    {
                        var cs = self.range;
                        startRow = cs.row;
                        endRow = cs.row + cs.rowCount - 1;
                        if (cs.row >= row)
                        {
                            if (cs.row === row + 1)
                            {
                                self._setRangeInternal(keyword_null)
                            }
                            else if (cs.row + cs.rowCount <= row + count)
                            {
                                self._setRangeInternal(keyword_null)
                            }
                            else if (cs.row < row + count)
                            {
                                self._setRangeInternal(new Sheets.Range(row, cs.col, (cs.row + cs.rowCount) - (row + count), cs.colCount))
                            }
                            else
                            {
                                self._setRangeInternal(new Sheets.Range(cs.row - count, cs.col, cs.rowCount, cs.colCount))
                            }
                        }
                        else if (cs.row < row && row < cs.row + cs.rowCount)
                        {
                            self._setRangeInternal(new Sheets.Range(cs.row, cs.col, cs.rowCount - Math.min(cs.row + cs.rowCount - row, count), cs.colCount))
                        }
                    }
                    var filteredInRowsWithColIndexs = self.filteredInRowsWithColIndexs;
                    if (self.isFiltered() && filteredInRowsWithColIndexs)
                    {
                        for (var i = startRow; i <= endRow; i++)
                        {
                            if (i < row)
                            {
                                continue
                            }
                            else if (i < row + count)
                            {
                                filteredInRowsWithColIndexs[i] = keyword_undefined
                            }
                            else
                            {
                                var oldKey = i,
                                    oldValue = filteredInRowsWithColIndexs[oldKey];
                                if (oldValue)
                                {
                                    var newKey = oldKey - count;
                                    filteredInRowsWithColIndexs[newKey] = oldValue;
                                    filteredInRowsWithColIndexs[oldKey] = keyword_undefined
                                }
                            }
                        }
                    }
                    self.reFilter()
                };
                RowFilterBase.prototype._setRangeInternal = function(newRange)
                {
                    this.range = newRange
                };
                RowFilterBase.prototype._updateRange = function(newRange)
                {
                    var self = this,
                        sheet = self.sheet;
                    var oldRange = self.range;
                    if (!oldRange)
                    {}
                    else if (!newRange)
                    {
                        self.reset()
                    }
                    else if (newRange.equals(oldRange))
                    {}
                    else
                    {
                        var oldCol = oldRange.col,
                            oldColCount = oldRange.colCount;
                        var newCol = newRange.col,
                            newColCount = newRange.colCount;
                        if (oldCol < 0 && newCol < 0)
                        {}
                        else if (self.isFiltered())
                        {
                            if (oldCol < 0)
                            {
                                oldCol = 0;
                                oldColCount = sheet.getColumnCount()
                            }
                            if (newCol < 0)
                            {
                                newCol = 0;
                                newColCount = sheet.getColumnCount()
                            }
                            for (var i = 0; i < oldColCount; i++)
                            {
                                var c = oldCol + i;
                                if (newCol <= c && c < newCol + newColCount)
                                {}
                                else
                                {
                                    self.removeFilterItems(c)
                                }
                            }
                        }
                        var oldRow = oldRange.row,
                            oldRowCount = oldRange.rowCount;
                        var newRow = newRange.row,
                            newRowCount = newRange.rowCount;
                        if (oldRow < 0 && newRow < 0)
                        {}
                        else if (self.isFiltered() && self.filteredInRowsWithColIndexs)
                        {
                            if (oldRow < 0)
                            {
                                oldRow = 0;
                                oldRowCount = sheet.getRowCount()
                            }
                            if (newRow < 0)
                            {
                                newRow = 0;
                                newRowCount = sheet.getRowCount()
                            }
                            for (var i = 0; i < oldRowCount; i++)
                            {
                                var r = oldRow + i;
                                if (newRow <= r && r < newRow + newRowCount)
                                {}
                                else
                                {
                                    self.filteredInRowsWithColIndexs[r] = keyword_undefined
                                }
                            }
                        }
                    }
                    if (self._isSortted())
                    {
                        if (newRange && newRange.contains(-1, self._sorttedColumn()))
                        {}
                        else
                        {
                            self.sortInfo = keyword_null
                        }
                    }
                    self._setRangeInternal(newRange)
                };
                RowFilterBase.prototype._removeColumns = function(column, count)
                {
                    var self = this;
                    if (!self.range)
                    {
                        return
                    }
                    if (column >= 0 && self._isSortted())
                    {
                        if (!(column <= self._sorttedColumn() && self._sorttedColumn() < column + count))
                        {
                            if (self._sorttedColumn() >= column)
                            {
                                self._sorttedColumn(self._sorttedColumn() - count)
                            }
                        }
                        else
                        {
                            self._sorttedColumn(-1)
                        }
                    }
                    var cs = self.range;
                    var startColumn = cs.col;
                    var columnCount = cs.colCount;
                    if (startColumn < 0)
                    {
                        startColumn = 0;
                        columnCount = self.sheet.getColumnCount() + count
                    }
                    else
                    {
                        columnCount = self.range.colCount
                    }
                    var removeEnd = column + count;
                    for (var c = startColumn; c < startColumn + columnCount; c++)
                    {
                        if (c >= column)
                        {
                            if (c < removeEnd)
                            {
                                self.removeFilterItems(c)
                            }
                            else
                            {
                                var newColumn = c - count;
                                var index = Sheets.ArrayHelper.indexOf(self.filteredColumns, c);
                                if (index >= 0)
                                {
                                    self.filteredColumns[index] = newColumn
                                }
                                var conditions = self.filterItemMap[c];
                                if (conditions && conditions.length > 0)
                                {
                                    Sheets.ArrayHelper.remove(self.filterItemMap, c);
                                    self.filterItemMap[newColumn] = conditions
                                }
                            }
                        }
                    }
                    if (cs.col >= 0)
                    {
                        if (column < cs.col)
                        {
                            if (removeEnd <= cs.col)
                            {
                                self._setRangeInternal(new Sheets.Range(cs.row, cs.col - count, cs.rowCount, cs.colCount))
                            }
                            else if (removeEnd <= cs.col + cs.colCount)
                            {
                                self._setRangeInternal(new Sheets.Range(cs.row, column, cs.rowCount, (cs.col + cs.colCount) - removeEnd))
                            }
                            else
                            {
                                self._setRangeInternal(keyword_null)
                            }
                        }
                        else if (column < cs.col + cs.colCount)
                        {
                            if (removeEnd <= cs.col + cs.colCount)
                            {
                                self._setRangeInternal(new Sheets.Range(cs.row, cs.col, cs.rowCount, cs.colCount - count))
                            }
                            else
                            {
                                self._setRangeInternal(new Sheets.Range(cs.row, cs.col, cs.rowCount, column - cs.col))
                            }
                        }
                    }
                    self.reFilter()
                };
                RowFilterBase.prototype._isSortted = function()
                {
                    var self = this;
                    if (self.sortInfo)
                    {
                        return self.sortInfo.index > -1 && self.getSortState(self.sortInfo.index) !== 0
                    }
                    return false
                };
                RowFilterBase.prototype._sorttedColumn = function(col)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        if (self.sortInfo)
                        {
                            return self.sortInfo.index
                        }
                        else
                        {
                            return -1
                        }
                    }
                    else
                    {
                        if (!self.sortInfo)
                        {
                            self.sortInfo = {
                                index: col, ascending: false
                            }
                        }
                        else
                        {
                            self.sortInfo.index = col
                        }
                        return self
                    }
                };
                RowFilterBase.prototype._clear = function(row, column, rowCount, columnCount)
                {
                    var self = this;
                    if (!self.range)
                    {
                        return
                    }
                    var clearRange = new Sheets.Range(row, column, rowCount, columnCount);
                    if (self.filterButtonVisible())
                    {
                        var newRow = self.range.row - 1;
                        var newRowCount = self.range.rowCount + 1;
                        if (newRow < 0)
                        {
                            newRow = -1;
                            newRowCount = -1
                        }
                        if (clearRange.containsRange(new Sheets.Range(newRow, self.range.col, newRowCount, self.range.colCount)))
                        {
                            self.unfilter()
                        }
                    }
                    else
                    {
                        if (clearRange.containsRange(self.range))
                        {
                            self.unfilter()
                        }
                    }
                };
                RowFilterBase.prototype._getConditionTypeDictionary = function()
                {
                    if (!this._ruleTypeDictionary)
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
                        this._ruleTypeDictionary = dict
                    }
                    return this._ruleTypeDictionary
                };
                RowFilterBase.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    var jsonRange = settings.range;
                    if (jsonRange)
                    {
                        self.range = new Sheets.Range(jsonRange.row, jsonRange.col, jsonRange.rowCount, jsonRange.colCount)
                    }
                    var jsonFilterItemMap = settings.filterItemMap,
                        selfFilterItemMap = self.filterItemMap;
                    if (Sheets.features.conditionalFormat && jsonFilterItemMap)
                    {
                        for (var i = 0; i < jsonFilterItemMap.length; i++)
                        {
                            var jsonConditions = jsonFilterItemMap[i].conditions;
                            if (!jsonConditions || jsonConditions.length === 0)
                            {
                                continue
                            }
                            for (var k = 0; k < jsonConditions.length; k++)
                            {
                                var jsonCondition = jsonConditions[k];
                                if (!jsonCondition)
                                {
                                    continue
                                }
                                var dict = self._getConditionTypeDictionary();
                                var conditionClass = dict[jsonCondition.conType];
                                if (conditionClass)
                                {
                                    var condition = new conditionClass;
                                    condition.fromJSON(jsonCondition, isNoneSchema);
                                    var column = jsonFilterItemMap[i].index;
                                    var filterItems = selfFilterItemMap[column];
                                    if (!filterItems)
                                    {
                                        filterItems = selfFilterItemMap[column] = []
                                    }
                                    filterItems.push(condition)
                                }
                            }
                        }
                    }
                    var jsonFilteredColumns;
                    if (settings.filteredColumns)
                    {
                        jsonFilteredColumns = settings.filteredColumns
                    }
                    else if (settings.filteredColMap)
                    {
                        jsonFilteredColumns = settings.filteredColMap
                    }
                    if (jsonFilteredColumns)
                    {
                        for (var i = 0; i < jsonFilteredColumns.length; i++)
                        {
                            var filteredCol = jsonFilteredColumns[i];
                            if (filteredCol !== keyword_undefined && filteredCol !== keyword_null)
                            {
                                self.filteredColumns.push(filteredCol)
                            }
                        }
                    }
                    var jsonSortInfo = settings.sortInfo;
                    if (jsonSortInfo)
                    {
                        self.sortInfo = {
                            index: jsonSortInfo.index, ascending: jsonSortInfo.ascending
                        }
                    }
                    var showFilterButton = settings.showFilterButton;
                    if (showFilterButton !== keyword_undefined)
                    {
                        var filterButtonVisibleInfo = settings.filterButtonVisibleInfo;
                        if (filterButtonVisibleInfo !== keyword_undefined)
                        {
                            self.filterButtonVisibleInfo = filterButtonVisibleInfo
                        }
                        else
                        {
                            var range = self.range;
                            if (range)
                            {
                                for (var i = 0; i < range.colCount; i++)
                                {
                                    self.filterButtonVisibleInfo[range.col + i] = showFilterButton
                                }
                            }
                        }
                    }
                };
                RowFilterBase.prototype.toJSON = function()
                {
                    var self = this;
                    var jsonData = {};
                    var range = self.range;
                    if (range)
                    {
                        jsonData["range"] = range
                    }
                    var typeName = self.typeName;
                    if (typeName)
                    {
                        jsonData["typeName"] = typeName
                    }
                    var filterItemMapData = [];
                    for (var i = 0, k = 0; i < self.filterItemMap.length; i++)
                    {
                        var filterItem = self.filterItemMap[i];
                        if (filterItem)
                        {
                            var conditions = [];
                            for (var c = 0; c < filterItem.length; c++)
                            {
                                var condition = filterItem[c];
                                conditions.push(condition ? condition.toJSON() : keyword_null)
                            }
                            filterItemMapData[k++] = {
                                index: i, conditions: conditions
                            }
                        }
                    }
                    if (filterItemMapData.length > 0)
                    {
                        jsonData["filterItemMap"] = filterItemMapData
                    }
                    var filteredColumns = self.filteredColumns;
                    if (filteredColumns.length > 0)
                    {
                        jsonData["filteredColumns"] = filteredColumns
                    }
                    var sortInfo = self.sortInfo;
                    if (sortInfo)
                    {
                        jsonData["sortInfo"] = sortInfo
                    }
                    var filterButtonVisibleInfo = self.filterButtonVisibleInfo;
                    if (filterButtonVisibleInfo)
                    {
                        jsonData["filterButtonVisibleInfo"] = filterButtonVisibleInfo;
                        var showFilterButton = false;
                        for (var key in filterButtonVisibleInfo)
                        {
                            if (filterButtonVisibleInfo[key])
                            {
                                showFilterButton = true;
                                break
                            }
                        }
                        jsonData["showFilterButton"] = showFilterButton
                    }
                    return jsonData
                };
                return RowFilterBase
            })();
        Sheets.RowFilterBase = RowFilterBase;
        var HideRowFilter = (function(_super)
            {
                __extends(HideRowFilter, _super);
                function HideRowFilter(range)
                {
                    _super.call(this, range)
                }
                HideRowFilter.prototype.isHideRowFilter = function()
                {
                    return true
                };
                HideRowFilter.prototype.updateRowVisibleInfo = function(filteredRows, filteredOutRows)
                {
                    var sheet = this.sheet;
                    if (sheet && sheet.filterRowsVisibleInfo)
                    {
                        var filterRowsVisibleInfo = sheet.filterRowsVisibleInfo;
                        for (var i = 0, len = filteredRows.length; i < len; i++)
                        {
                            filterRowsVisibleInfo.setRowVisible(filteredRows[i], true)
                        }
                        for (var j = 0, len1 = filteredOutRows.length; j < len1; j++)
                        {
                            filterRowsVisibleInfo.setRowVisible(filteredOutRows[j], false)
                        }
                        sheet.recalcRows(filteredRows.concat(filteredOutRows))
                    }
                };
                HideRowFilter.prototype.onFilter = function(args)
                {
                    this.updateRowVisibleInfo(args.filteredRows, args.filteredOutRows)
                };
                HideRowFilter.prototype.openFilterDialog = function(filterButtonHitInfo)
                {
                    var filterDialog = new Sheets._GcFilterDialog(this.sheet, filterButtonHitInfo);
                    this.sheet._filterDialiog = filterDialog;
                    filterDialog.open()
                };
                return HideRowFilter
            })(RowFilterBase);
        Sheets.HideRowFilter = HideRowFilter;
        var FilterRowsVisibleInfo = (function()
            {
                function FilterRowsVisibleInfo()
                {
                    this.reset()
                }
                FilterRowsVisibleInfo.prototype.getRowVisible = function(row)
                {
                    var v = true,
                        info = this.rowsVisibleInfo[row];
                    if (info !== keyword_undefined && info !== keyword_null)
                    {
                        v = info
                    }
                    return v
                };
                FilterRowsVisibleInfo.prototype.setRowVisible = function(index, visible)
                {
                    var oldInfo = this.rowsVisibleInfo[index];
                    if (oldInfo !== keyword_undefined && oldInfo !== keyword_null && visible)
                    {
                        delete this.rowsVisibleInfo[index]
                    }
                    else
                    {
                        this.rowsVisibleInfo[index] = visible
                    }
                };
                FilterRowsVisibleInfo.prototype.reset = function()
                {
                    this.rowsVisibleInfo = {}
                };
                FilterRowsVisibleInfo.prototype.hasFilterOut = function()
                {
                    for (var tmp in this.rowsVisibleInfo)
                    {
                        return true
                    }
                    return false
                };
                return FilterRowsVisibleInfo
            })();
        Sheets.FilterRowsVisibleInfo = FilterRowsVisibleInfo;
        var _TableFilter = (function(_super)
            {
                __extends(_TableFilter, _super);
                function _TableFilter(table)
                {
                    _super.call(this);
                    this._table = table;
                    if (table)
                    {
                        this.sheet = table._getSheet()
                    }
                }
                _TableFilter.prototype.table = function(table)
                {
                    if (arguments.length === 0)
                    {
                        return this._table
                    }
                    this._table = table;
                    if (table)
                    {
                        this.sheet = table._getSheet()
                    }
                };
                _TableFilter.prototype._addRows = function(row, count)
                {
                    _super.prototype._addRows.call(this, row, count);
                    if (this._table)
                    {
                        this._setRangeInternal(this._table.dataRange())
                    }
                };
                _TableFilter.prototype._removeRows = function(row, count)
                {
                    _super.prototype._removeRows.call(this, row, count);
                    if (this._table)
                    {
                        this._setRangeInternal(this._table.dataRange())
                    }
                };
                return _TableFilter
            })(HideRowFilter);
        Sheets._TableFilter = _TableFilter
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

