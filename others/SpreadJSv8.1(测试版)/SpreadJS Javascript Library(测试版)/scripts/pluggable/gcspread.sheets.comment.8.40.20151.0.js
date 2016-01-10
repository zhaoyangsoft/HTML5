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
        Sheets.feature("comment", ["core.common", "core.sheet_action"]);
        var keyword_null = null,
            keyword_undefined = undefined,
            Math_max = Math.max,
            Math_min = Math.min,
            Math_floor = Math.floor,
            Math_atan2 = Math.atan2,
            Math_abs = Math.abs;
        (function(DisplayMode)
        {
            DisplayMode[DisplayMode["AlwaysShown"] = 1] = "AlwaysShown";
            DisplayMode[DisplayMode["HoverShown"] = 2] = "HoverShown"
        })(Sheets.DisplayMode || (Sheets.DisplayMode = {}));
        var DisplayMode = Sheets.DisplayMode;
        var Padding = (function()
            {
                function Padding(top, right, bottom, left)
                {
                    this.left = 0;
                    this.top = 0;
                    this.right = 0;
                    this.bottom = 0;
                    var self = this;
                    if (arguments.length === 1)
                    {
                        self.top = self.right = self.bottom = self.left = top;
                        ;
                    }
                    else if (arguments.length === 4)
                    {
                        self.top = top;
                        self.right = right;
                        self.bottom = bottom;
                        self.left = left
                    }
                }
                Padding.prototype.toString = function()
                {
                    var self = this;
                    return self.top + "px " + self.right + "px " + self.bottom + "px " + self.left + "px"
                };
                return Padding
            })();
        Sheets.Padding = Padding;
        (function(ResizeDirection)
        {
            ResizeDirection[ResizeDirection["TopLeft"] = 0] = "TopLeft";
            ResizeDirection[ResizeDirection["TopRight"] = 1] = "TopRight";
            ResizeDirection[ResizeDirection["BottomLeft"] = 2] = "BottomLeft";
            ResizeDirection[ResizeDirection["BottomRight"] = 3] = "BottomRight";
            ResizeDirection[ResizeDirection["MiddleLeft"] = 4] = "MiddleLeft";
            ResizeDirection[ResizeDirection["MiddleRight"] = 5] = "MiddleRight";
            ResizeDirection[ResizeDirection["TopCenter"] = 6] = "TopCenter";
            ResizeDirection[ResizeDirection["BottomCenter"] = 7] = "BottomCenter"
        })(Sheets.ResizeDirection || (Sheets.ResizeDirection = {}));
        var ResizeDirection = Sheets.ResizeDirection;
        var Comment = (function()
            {
                function Comment()
                {
                    var self = this;
                    self._defaultLocation = new Sheets.Point(9, -18);
                    self._text = "";
                    self._location = self._defaultLocation;
                    self._displayMode = 2;
                    self._commentState = 3;
                    self._width = 160;
                    self._height = 100;
                    self._fontFamily = "Arial";
                    self._fontStyle = "normal";
                    self._fontSize = "9pt";
                    self._fontWeight = "normal";
                    self._textDecoration = 0;
                    self._foreColor = "black";
                    self._backColor = "#FFFFE1";
                    self._opacity = 1;
                    self._locked = true;
                    self._lockText = true;
                    self._dynamicMove = true;
                    self._dynamicSize = true;
                    self._horizontalAlign = 0;
                    self._autoSize = false;
                    self._borderWidth = 1;
                    self._borderStyle = "solid";
                    self._borderColor = "black";
                    self._padding = keyword_null;
                    self._zIndex = -1;
                    self._showShadow = false;
                    self._timeout = keyword_null;
                    self._rowIndex = -1;
                    self._colIndex = -1;
                    self._sheet = keyword_null
                }
                Comment.prototype.text = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._text
                    }
                    else
                    {
                        if (typeof value === "string" && self._text !== value)
                        {
                            self._changeProperty("text", value)
                        }
                        return self
                    }
                };
                Comment.prototype.location = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._location
                    }
                    else
                    {
                        if (value instanceof Sheets.Point && self._location !== value)
                        {
                            self._changeProperty("location", value)
                        }
                        return self
                    }
                };
                Comment.prototype.width = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._width
                    }
                    else
                    {
                        if (typeof value === "number" && value > 0 && self._width !== value)
                        {
                            self._autoSize = false;
                            self._changeProperty("width", value)
                        }
                        return self
                    }
                };
                Comment.prototype.height = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._height
                    }
                    else
                    {
                        if (typeof value === "number" && value > 0 && self._height !== value)
                        {
                            self._autoSize = false;
                            self._changeProperty("height", value)
                        }
                        return self
                    }
                };
                Comment.prototype.fontFamily = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._fontFamily
                    }
                    else
                    {
                        if (typeof value === 'string' && self._fontFamily !== value)
                        {
                            self._changeProperty("fontFamily", value)
                        }
                        return self
                    }
                };
                Comment.prototype.fontStyle = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._fontStyle
                    }
                    else
                    {
                        if (typeof value === 'string' && self._fontStyle !== value)
                        {
                            self._changeProperty("fontStyle", value)
                        }
                        return self
                    }
                };
                Comment.prototype.fontSize = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._fontSize
                    }
                    else
                    {
                        if (typeof value === 'string' && self._fontSize !== value)
                        {
                            self._changeProperty("fontSize", value)
                        }
                        return self
                    }
                };
                Comment.prototype.fontWeight = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._fontWeight
                    }
                    else
                    {
                        if (typeof value === 'string' && self._fontWeight !== value)
                        {
                            self._changeProperty("fontWeight", value)
                        }
                        return self
                    }
                };
                Comment.prototype.textDecoration = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._textDecoration
                    }
                    else
                    {
                        if (Sheets.TextDecorationType[value] !== keyword_undefined && self._textDecoration !== value)
                        {
                            self._changeProperty("textDecoration", value)
                        }
                        return self
                    }
                };
                Comment.prototype.foreColor = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._foreColor
                    }
                    else
                    {
                        if (typeof value === "string" && self._foreColor !== value)
                        {
                            self._changeProperty("foreColor", value)
                        }
                        return self
                    }
                };
                Comment.prototype.locked = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._locked
                    }
                    else
                    {
                        if (typeof value === 'boolean' && self._locked !== value)
                        {
                            self._changeProperty("locked", value)
                        }
                        return self
                    }
                };
                Comment.prototype.lockText = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._lockText
                    }
                    else
                    {
                        if (typeof value === 'boolean' && self._lockText !== value)
                        {
                            self._changeProperty("lockText", value)
                        }
                        return self
                    }
                };
                Comment.prototype.horizontalAlign = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._horizontalAlign
                    }
                    else
                    {
                        if (Sheets.HorizontalAlign[value] !== keyword_undefined && self._horizontalAlign !== value)
                        {
                            self._changeProperty("horizontalAlign", value)
                        }
                        return self
                    }
                };
                Comment.prototype.autoSize = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._autoSize
                    }
                    else
                    {
                        if (typeof value === 'boolean' && self._autoSize !== value)
                        {
                            self._changeProperty("autoSize", value)
                        }
                        return self
                    }
                };
                Comment.prototype.dynamicSize = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._dynamicSize
                    }
                    else
                    {
                        if (typeof value === 'boolean' && self._dynamicSize !== value)
                        {
                            if (value === true && self._dynamicMove === false)
                            {
                                return self
                            }
                            self._changeProperty("dynamicSize", value)
                        }
                        return self
                    }
                };
                Comment.prototype.dynamicMove = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._dynamicMove
                    }
                    else
                    {
                        if (typeof value === 'boolean' && self._dynamicMove !== value)
                        {
                            if (value === false && self._dynamicSize === true)
                            {
                                self._dynamicSize = false
                            }
                            self._changeProperty("dynamicMove", value)
                        }
                        return self
                    }
                };
                Comment.prototype.backColor = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._backColor
                    }
                    else
                    {
                        if (typeof value === "string" && self._backColor !== value)
                        {
                            self._changeProperty("backColor", value)
                        }
                        return self
                    }
                };
                Comment.prototype.opacity = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._opacity
                    }
                    else
                    {
                        if (typeof value === 'number' && value >= 0 && value <= 1 && self._opacity !== value)
                        {
                            self._changeProperty("opacity", value)
                        }
                        return self
                    }
                };
                Comment.prototype.borderWidth = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._borderWidth
                    }
                    else
                    {
                        if (typeof value === "number" && value > 0 && self._borderWidth !== value)
                        {
                            self._changeProperty("borderWidth", value)
                        }
                        return self
                    }
                };
                Comment.prototype.borderStyle = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._borderStyle
                    }
                    else
                    {
                        if (typeof value === "string" && self._borderStyle !== value)
                        {
                            self._changeProperty("borderStyle", value)
                        }
                        return self
                    }
                };
                Comment.prototype.borderColor = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._borderColor
                    }
                    else
                    {
                        if (typeof value === "string" && self._borderColor !== value)
                        {
                            self._changeProperty("borderColor", value)
                        }
                        return self
                    }
                };
                Comment.prototype.padding = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._padding
                    }
                    else
                    {
                        if ((value === keyword_null || value instanceof Padding) && self._padding !== value)
                        {
                            self._changeProperty("padding", value)
                        }
                        return self
                    }
                };
                Comment.prototype.showShadow = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._showShadow
                    }
                    else
                    {
                        if (typeof value === 'boolean' && self._showShadow !== value)
                        {
                            self._changeProperty("showShadow", value)
                        }
                        return self
                    }
                };
                Comment.prototype.displayMode = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._displayMode
                    }
                    else
                    {
                        if (DisplayMode[value] !== keyword_undefined && self._displayMode !== value)
                        {
                            self._changeProperty("displayMode", value)
                        }
                        return self
                    }
                };
                Comment.prototype.commentState = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._commentState
                    }
                    else
                    {
                        if (Sheets.CommentState[value] !== keyword_undefined && self._commentState !== value)
                        {
                            self._changeProperty("commentState", value)
                        }
                        return self
                    }
                };
                Comment.prototype.zIndex = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._zIndex
                    }
                    else
                    {
                        if (typeof value === 'number' && self._zIndex !== value)
                        {
                            self._changeProperty("zIndex", value)
                        }
                        return self
                    }
                };
                Comment.prototype._changeProperty = function(propertyName, value)
                {
                    var self = this,
                        sheet = self._sheet;
                    var actualPropertyName = "_" + propertyName;
                    if (sheet)
                    {
                        sheet._bindToAutoRefresh(function(propertyValue)
                        {
                            if (self.hasOwnProperty(actualPropertyName))
                            {
                                self[actualPropertyName] = propertyValue
                            }
                        })(value)
                    }
                    else
                    {
                        if (self.hasOwnProperty(actualPropertyName))
                        {
                            self[actualPropertyName] = value
                        }
                    }
                    if (this._sheet)
                    {
                        this._sheet.triggerCommentChanged({
                            sheet: sheet, sheetName: sheet ? sheet._name : "", comment: self, propertyName: propertyName
                        })
                    }
                };
                Comment.prototype.clone = function()
                {
                    var self = this;
                    var comment = new Comment;
                    comment._text = self._text;
                    comment._location = new Sheets.Point(self._location.x, self._location.y);
                    if (self._defaultLocation)
                    {
                        comment._defaultLocation = new Sheets.Point(self._defaultLocation.x, self._defaultLocation.y)
                    }
                    comment._width = self._width;
                    comment._height = self._height;
                    comment._fontFamily = self._fontFamily;
                    comment._fontStyle = self._fontStyle;
                    comment._fontSize = self._fontSize;
                    comment._fontWeight = self._fontWeight;
                    comment._textDecoration = self._textDecoration;
                    comment._foreColor = self._foreColor;
                    comment._locked = self._locked;
                    comment._lockText = self._lockText;
                    comment._horizontalAlign = self._horizontalAlign;
                    comment._autoSize = self._autoSize;
                    comment._dynamicMove = self._dynamicMove;
                    comment._dynamicSize = self._dynamicSize;
                    comment._backColor = self._backColor;
                    comment._opacity = self._opacity;
                    comment._borderWidth = self._borderWidth;
                    comment._borderStyle = self._borderStyle;
                    comment._borderColor = self._borderColor;
                    if (self._padding)
                    {
                        comment._padding = new Padding(self._padding.top, self._padding.right, self._padding.bottom, self._padding.left)
                    }
                    comment._showShadow = self._showShadow;
                    comment._displayMode = self._displayMode;
                    comment._commentState = self._commentState;
                    comment._sheet = self._sheet;
                    comment._rowIndex = self._rowIndex;
                    comment._colIndex = self._colIndex;
                    comment._zIndex = self._zIndex;
                    return comment
                };
                Comment.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            text: self._text, location: self._location, displayMode: self._displayMode, commentState: self._commentState, width: self._width, height: self._height, fontFamily: self._fontFamily, fontStyle: self._fontStyle, fontSize: self._fontSize, fontWeight: self._fontWeight, textDecoration: self._textDecoration, foreColor: self._foreColor, backColor: self._backColor, opacity: self._opacity, locked: self._locked, lockText: self._lockText, dynamicMove: self._dynamicMove, dynamicSize: self._dynamicSize, horizontalAlign: self._horizontalAlign, autoSize: self._autoSize, borderWidth: self._borderWidth, borderStyle: self._borderStyle, borderColor: self._borderColor, padding: self._padding, zIndex: self._zIndex, showShadow: self._showShadow, rowIndex: self._rowIndex, colIndex: self._colIndex
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
                    return jsonData
                };
                Comment.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"text":
                            return value === "";
                        case"location":
                            return value.x === 9 && value.y === -18;
                        case"displayMode":
                            return value === 2;
                        case"commentState":
                            return value === 3;
                        case"width":
                            return value === 160;
                        case"height":
                            return value === 100;
                        case"fontFamily":
                            return value === "Arial";
                        case"fontStyle":
                            return value === "normal";
                        case"fontSize":
                            return value === "9pt";
                        case"fontWeight":
                            return value === "normal";
                        case"textDecoration":
                            return value === 0;
                        case"foreColor":
                            return value === "black";
                        case"backColor":
                            return value === "#FFFFE1";
                        case"opacity":
                            return value === 1;
                        case"locked":
                            return value === true;
                        case"lockText":
                            return value === true;
                        case"dynamicMove":
                            return value === true;
                        case"dynamicSize":
                            return value === true;
                        case"horizontalAlign":
                            return value === 0;
                        case"autoSize":
                            return value === false;
                        case"borderWidth":
                            return value === 1;
                        case"borderStyle":
                            return value === "solid";
                        case"borderColor":
                            return value === "black";
                        case"padding":
                            return value === null;
                        case"zIndex":
                            return value === -1;
                        case"showShadow":
                            return value === false;
                        case"rowIndex":
                            return value === -1;
                        case"colIndex":
                            return value === -1;
                        default:
                            return false
                    }
                };
                Comment.prototype.fromJSON = function(jsonData, isNoneSchema)
                {
                    if (!jsonData)
                    {
                        return
                    }
                    var self = this;
                    if (jsonData.text !== keyword_undefined)
                    {
                        self._text = jsonData.text
                    }
                    var location = jsonData.location;
                    if (location !== keyword_undefined)
                    {
                        self._location = new Sheets.Point(location.x, location.y)
                    }
                    if (jsonData.displayMode !== keyword_undefined)
                    {
                        self._displayMode = jsonData.displayMode
                    }
                    if (jsonData.commentState !== keyword_undefined)
                    {
                        self._commentState = jsonData.commentState
                    }
                    if (jsonData.width !== keyword_undefined)
                    {
                        self._width = jsonData.width
                    }
                    if (jsonData.height !== keyword_undefined)
                    {
                        self._height = jsonData.height
                    }
                    if (jsonData.fontFamily !== keyword_undefined)
                    {
                        self._fontFamily = jsonData.fontFamily
                    }
                    if (jsonData.fontStyle !== keyword_undefined)
                    {
                        self._fontStyle = jsonData.fontStyle
                    }
                    if (jsonData.fontSize !== keyword_undefined)
                    {
                        self._fontSize = jsonData.fontSize
                    }
                    if (jsonData.fontWeight !== keyword_undefined)
                    {
                        self._fontWeight = jsonData.fontWeight
                    }
                    if (jsonData.textDecoration !== keyword_undefined)
                    {
                        self._textDecoration = jsonData.textDecoration
                    }
                    if (jsonData.foreColor !== keyword_undefined)
                    {
                        self._foreColor = jsonData.foreColor
                    }
                    if (jsonData.backColor !== keyword_undefined)
                    {
                        self._backColor = jsonData.backColor
                    }
                    if (jsonData.opacity !== keyword_undefined)
                    {
                        self._opacity = jsonData.opacity
                    }
                    if (jsonData.locked !== keyword_undefined)
                    {
                        self._locked = jsonData.locked
                    }
                    if (jsonData.lockText !== keyword_undefined)
                    {
                        self._lockText = jsonData.lockText
                    }
                    if (jsonData.dynamicMove !== keyword_undefined)
                    {
                        self._dynamicMove = jsonData.dynamicMove
                    }
                    if (jsonData.dynamicSize !== keyword_undefined)
                    {
                        self._dynamicSize = jsonData.dynamicSize
                    }
                    if (jsonData.horizontalAlign !== keyword_undefined)
                    {
                        self._horizontalAlign = jsonData.horizontalAlign
                    }
                    if (jsonData.autoSize !== keyword_undefined)
                    {
                        self._autoSize = jsonData.autoSize
                    }
                    if (jsonData.borderWidth !== keyword_undefined)
                    {
                        self._borderWidth = jsonData.borderWidth
                    }
                    if (jsonData.borderStyle !== keyword_undefined)
                    {
                        self._borderStyle = jsonData.borderStyle
                    }
                    if (jsonData.borderColor !== keyword_undefined)
                    {
                        self._borderColor = jsonData.borderColor
                    }
                    var padding = jsonData.padding;
                    if (padding !== keyword_undefined)
                    {
                        self._padding = new Padding(padding.top, padding.right, padding.bottom, padding.left)
                    }
                    if (jsonData.zIndex !== keyword_undefined)
                    {
                        self._zIndex = jsonData.zIndex
                    }
                    if (jsonData.showShadow !== keyword_undefined)
                    {
                        self._showShadow = jsonData.showShadow
                    }
                    if (jsonData.rowIndex !== keyword_undefined)
                    {
                        self._rowIndex = jsonData.rowIndex
                    }
                    if (jsonData.colIndex !== keyword_undefined)
                    {
                        self._colIndex = jsonData.colIndex
                    }
                };
                return Comment
            })();
        Sheets.Comment = Comment;
        var CommentView = (function()
            {
                function CommentView(comment, commentManager)
                {
                    this._rowViewportIndex = 1;
                    this._columnViewportIndex = 1;
                    var self = this,
                        sheet = comment && comment._sheet;
                    self._comment = comment;
                    self._updateCommentViewportIndex();
                    self._zoomFactor = sheet._zoomFactor;
                    self._commentManager = commentManager;
                    self._editor = commentManager._editorDom;
                    self._init();
                    self._absLocation = self._getAbsLocation();
                    self._updateStartCoordinate();
                    self._updateEndCoordinate()
                }
                CommentView.prototype._init = function()
                {
                    var self = this;
                    self._commentLayoutPanel = keyword_null;
                    self._floatBlockCanvasContainer = keyword_null;
                    self._floatBlockCanvas = keyword_null;
                    self._hostContainer = keyword_null;
                    self._host = keyword_null;
                    self._lineCanvasContainer = keyword_null;
                    self._lineCanvas = keyword_null;
                    self._floatBlockCanvasContainerClassName = "gc-spread-floatBlockCanvas-container";
                    self._floatBlockCanvasClassName = "gc-spread-floatBlockCanvas";
                    self._hostContainerClassName = "gc-spread-host-container";
                    self._hostClassName = "gc-spread-host";
                    self._lineCanvasContainerClassName = "gc-spread-lineCanvas-container";
                    self._lineCanvasClassName = "gc-spread-lineCanvas";
                    self._floatBlockCanvasContainer = document.createElement("div");
                    $(self._floatBlockCanvasContainer).addClass(self._floatBlockCanvasContainerClassName).css("position", "absolute").css("overflow", "hidden");
                    self._floatBlockCanvas = document.createElement("canvas");
                    Sheets.DPIHelper.adjustDevicePixel(self._floatBlockCanvas, null, self._commentManager._sheet);
                    $(self._floatBlockCanvas).addClass(self._floatBlockCanvasClassName).css("left", 0).css("top", 0).css("position", "absolute");
                    self._hostContainer = document.createElement("div");
                    $(self._hostContainer).addClass(self._hostContainerClassName).css("position", "absolute").css("box-sizing", "content-box");
                    self._host = document.createElement("div");
                    $(self._host).addClass(self._hostClassName).css("left", 0).css("top", 0).css('width', '100%').css('height', '100%').css("position", "absolute").css("word-wrap", "break-word").css("word-break", "normal").css("white-space", "pre-wrap").css("overflow", "hidden");
                    $(self._hostContainer).append(self._host);
                    $(self._floatBlockCanvasContainer).append(self._floatBlockCanvas, self._hostContainer);
                    self._lineCanvasContainer = document.createElement("div");
                    $(self._lineCanvasContainer).addClass(self._lineCanvasContainerClassName).css("position", "absolute").css("overflow", "hidden");
                    self._lineCanvas = document.createElement("canvas");
                    Sheets.DPIHelper.adjustDevicePixel(self._lineCanvas, null, self._commentManager._sheet);
                    $(self._lineCanvas).addClass(self._lineCanvasClassName).css("left", 0).css("right", 0).css("position", "absolute");
                    $(self._lineCanvasContainer).append(self._lineCanvas);
                    self._adornerDrawState = keyword_null;
                    self._resizeHitRects = [];
                    self._hostMargin = 7;
                    self._isMoving = false;
                    self._isResizing = false;
                    var sheet = self._comment._sheet;
                    if (Sheets.features.touch)
                    {
                        self._touchManager = new Sheets.CommentTouchManager(self._floatBlockCanvas, self, sheet.parent._touchEventProvider);
                        self._touchManager.attach();
                        self._touchContentManager = new Sheets.CommentContentTouchManager(self._host, self, sheet.parent._touchEventProvider);
                        self._touchContentManager.attach()
                    }
                };
                CommentView.prototype.open = function()
                {
                    var self = this,
                        sheet = self._comment._sheet;
                    if (!self._commentLayoutPanel)
                    {
                        if (sheet)
                        {
                            self._commentLayoutPanel = sheet._commentRender._commentLayoutPanel
                        }
                        if (!self._commentLayoutPanel)
                        {
                            return
                        }
                    }
                    self._commentLayoutPanel.appendChild(self._lineCanvasContainer);
                    self._attachLineCanvasEventHandler();
                    self._commentLayoutPanel.appendChild(self._floatBlockCanvasContainer);
                    self._attachFloatBlockCanvasEventHandler();
                    self._attachHostContainerEventHandler();
                    if (self.isEditing())
                    {
                        self._attachEditorEventHandler()
                    }
                    else
                    {
                        self._attachHostEventHandler()
                    }
                    self._absLocation = self._getAbsLocation();
                    self.updateLayout()
                };
                CommentView.prototype.close = function()
                {
                    var self = this;
                    if (self._floatBlockCanvasContainer && self._lineCanvasContainer && self._commentLayoutPanel)
                    {
                        self._detachFloatBlockCanvasEventHandler();
                        self._detachHostContainerEventHandler();
                        self._detachHostEventHandler();
                        self._detachLineCanvasEventHandler();
                        self._detachEditorEventHandler();
                        $(self._floatBlockCanvasContainer).remove();
                        $(self._lineCanvasContainer).remove()
                    }
                };
                CommentView.prototype.getComment = function()
                {
                    return this._comment
                };
                CommentView.prototype._getActualWidth = function()
                {
                    return this._comment.width() * this._zoomFactor
                };
                CommentView.prototype._getActualHeight = function()
                {
                    return this._comment.height() * this._zoomFactor
                };
                CommentView.prototype._getAbsLocation = function()
                {
                    var self = this,
                        comment = self._comment;
                    if (comment === self._commentManager.getHoverShownComment() && comment.commentState() === 3)
                    {
                        return self._convertRelLocationToAbsLocation(comment._defaultLocation)
                    }
                    else
                    {
                        return self._convertRelLocationToAbsLocation(comment.location())
                    }
                };
                CommentView.prototype._convertRelLocationToAbsLocation = function(relLocation)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        zoomFactor = self._zoomFactor;
                    var absLocation = keyword_null;
                    if (sheet)
                    {
                        var cellRect = self._getCellRect(sheet, comment._rowIndex, comment._colIndex, self._rowViewportIndex, self._columnViewportIndex);
                        if (cellRect.x !== null && cellRect.x !== undefined && cellRect.y !== null && cellRect.y !== undefined && cellRect.width && cellRect.height)
                        {
                            var sheetLayout = sheet._getSheetLayout();
                            absLocation = new Sheets.Point(cellRect.x + cellRect.width + relLocation.x * zoomFactor - sheetLayout.rowHeaderWidth, cellRect.y + relLocation.y * zoomFactor - sheetLayout.colHeaderHeight)
                        }
                    }
                    return absLocation
                };
                CommentView.prototype._getCellRect = function(sheet, row, col, rowViewportIndex, columnViewportIndex)
                {
                    var self = this,
                        rect = new Sheets.Rect(0, 0, 0, 0),
                        layout = sheet._getSheetLayout(),
                        scrollTopRow = sheet.getViewportTopRow(rowViewportIndex),
                        scrollLeftColumn = sheet.getViewportLeftColumn(columnViewportIndex);
                    var smallRow = Math_min(scrollTopRow, row),
                        bigRow = Math_max(scrollTopRow, row),
                        smallCol = Math_min(scrollLeftColumn, col),
                        bigCol = Math_max(scrollLeftColumn, col),
                        x = 0,
                        y = 0,
                        zoomFactor = self._zoomFactor;
                    ;
                    for (var i = smallRow; i < bigRow; i++)
                    {
                        y += sheet.getRowHeight(i, 3) * zoomFactor
                    }
                    for (var j = smallCol; j < bigCol; j++)
                    {
                        x += sheet.getColumnWidth(j, 3) * zoomFactor
                    }
                    if (row >= scrollTopRow)
                    {
                        rect.y = y
                    }
                    else
                    {
                        rect.y = -y
                    }
                    if (col >= scrollLeftColumn)
                    {
                        rect.x = x
                    }
                    else
                    {
                        rect.x = -x
                    }
                    var range = sheet.getSpan(row, col);
                    if (range != keyword_undefined && range != keyword_null)
                    {
                        for (var i = 0; i < range.rowCount; i++)
                        {
                            rect.height += sheet.getRowHeight(row + i) * zoomFactor
                        }
                        for (var j = 0; j < range.colCount; j++)
                        {
                            rect.width += sheet.getColumnWidth(col + j) * zoomFactor
                        }
                    }
                    else
                    {
                        rect.height = sheet.getRowHeight(row) * zoomFactor;
                        rect.width = sheet.getColumnWidth(col) * zoomFactor
                    }
                    rect.x += layout.rowHeaderWidth;
                    rect.y += layout.colHeaderHeight;
                    if (rowViewportIndex === 1)
                    {
                        rect.y += layout.frozenHeight
                    }
                    else if (rowViewportIndex === 2)
                    {
                        rect.y += layout.frozenHeight + layout.viewportHeight
                    }
                    if (columnViewportIndex === 1)
                    {
                        rect.x += layout.frozenWidth
                    }
                    else if (columnViewportIndex === 2)
                    {
                        rect.x += layout.frozenWidth + layout.viewportWidth
                    }
                    return rect
                };
                CommentView.prototype._convertAbsLocationToRelLocation = function(absLocation)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        zoomFactor = self._zoomFactor;
                    var relLocation = keyword_null;
                    if (sheet)
                    {
                        var cellRect = self._getCellRect(sheet, comment._rowIndex, comment._colIndex, self._rowViewportIndex, self._columnViewportIndex);
                        if (cellRect.x !== null && cellRect.x !== undefined && cellRect.y !== null && cellRect.y !== undefined && cellRect.width && cellRect.height)
                        {
                            var sheetLayout = sheet._getSheetLayout();
                            var x = (absLocation.x - (cellRect.x + cellRect.width - sheetLayout.rowHeaderWidth)) / zoomFactor;
                            var y = (absLocation.y - (cellRect.y - sheetLayout.colHeaderHeight)) / zoomFactor;
                            relLocation = new Sheets.Point(x, y)
                        }
                    }
                    return relLocation
                };
                CommentView.prototype.updateLayoutWhenLocationChanged = function()
                {
                    var self = this;
                    self._absLocation = self._getAbsLocation();
                    self._updateStartCoordinate();
                    self._updateEndCoordinate();
                    self.updateLayout()
                };
                CommentView.prototype.updateLayoutWhenWidthHeightChanged = function()
                {
                    var self = this;
                    self._absLocation = self._getAbsLocation();
                    self._updateEndCoordinate()
                };
                CommentView.prototype.updateLayoutWhenRowColumnChanged = function()
                {
                    var self = this,
                        comment = self._comment;
                    if (comment.dynamicMove())
                    {
                        if (comment.dynamicSize())
                        {
                            self._updateSizeByCoordinate();
                            self._updateLocationByCoordinate()
                        }
                        else
                        {
                            self._updateLocationByCoordinate();
                            self._updateEndCoordinate()
                        }
                    }
                    else
                    {
                        self._updateStartCoordinate();
                        self._updateEndCoordinate();
                        var relativeLocation = self._convertAbsLocationToRelLocation(self._absLocation);
                        comment.location(relativeLocation)
                    }
                };
                CommentView.prototype.updateLayoutWhenCellSpanChanged = function()
                {
                    var self = this;
                    self._absLocation = self._getAbsLocation();
                    self.updateLayout()
                };
                CommentView.prototype.updateLayoutWhenSheetScroll = function()
                {
                    var self = this;
                    self._absLocation = self._getAbsLocation();
                    self.updateLayout()
                };
                CommentView.prototype._updateLocationByCoordinate = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet;
                    var absoluteLocation = self._getLocationByCoordinate();
                    self._absLocation = absoluteLocation;
                    comment._location = self._convertAbsLocationToRelLocation(absoluteLocation);
                    self.updateLayout()
                };
                CommentView.prototype._getLocationByCoordinate = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        zoomFactor = self._zoomFactor;
                    var viewportLeftColumn = sheet.getViewportLeftColumn(self._columnViewportIndex),
                        viewportTopRow = sheet.getViewportTopRow(self._rowViewportIndex);
                    var viewportRect = self._getViewportRect(self._rowViewportIndex, self._columnViewportIndex);
                    var x;
                    if (self._columnViewportIndex === 0)
                    {
                        x = 0
                    }
                    else if (self._columnViewportIndex === 1)
                    {
                        x = sheet.getViewportWidth(0)
                    }
                    else if (self._columnViewportIndex === 2)
                    {
                        x = sheet.getViewportWidth(0) + sheet.getViewportWidth(1)
                    }
                    for (var col = viewportLeftColumn; col < self._startColumn; col++)
                    {
                        x += sheet.getColumnWidth(col, 3) * zoomFactor
                    }
                    var startColumnWidth = sheet.getColumnWidth(self._startColumn, 3);
                    if (startColumnWidth < self._startColumnOffset)
                    {
                        self._startColumnOffset = startColumnWidth
                    }
                    x = x + self._startColumnOffset * zoomFactor;
                    var y;
                    if (self._rowViewportIndex === 0)
                    {
                        y = 0
                    }
                    else if (self._rowViewportIndex === 1)
                    {
                        y = sheet.getViewportHeight(0)
                    }
                    else if (self._rowViewportIndex === 2)
                    {
                        y = sheet.getViewportHeight(0) + sheet.getViewportHeight(1)
                    }
                    for (var row = viewportTopRow; row < self._startRow; row++)
                    {
                        y += sheet.getRowHeight(row, 3) * zoomFactor
                    }
                    var startRowHeight = sheet.getRowHeight(self._startRow, 3);
                    if (startRowHeight < self._startRowOffset)
                    {
                        self._startRowOffset = startRowHeight
                    }
                    y = y + self._startRowOffset * zoomFactor;
                    return new Sheets.Point(x, y)
                };
                CommentView.prototype._updateSizeByCoordinate = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        zoomFactor = self._zoomFactor;
                    var width = 0;
                    for (var j = self._startColumn; j < self._endColumn; j++)
                    {
                        width += sheet.getColumnWidth(j, 3)
                    }
                    var startColumnWidth = sheet.getColumnWidth(self._startColumn, 3);
                    if (startColumnWidth < self._startColumnOffset)
                    {
                        self._startColumnOffset = startColumnWidth
                    }
                    var endColumnWidth = sheet.getColumnWidth(self._endColumn, 3);
                    if (endColumnWidth < self._endColumnOffset)
                    {
                        self._endColumnOffset = endColumnWidth
                    }
                    width = width - self._startColumnOffset + self._endColumnOffset;
                    var height = 0;
                    for (var i = self._startRow; i < self._endRow; i++)
                    {
                        height += sheet.getRowHeight(i, 3)
                    }
                    var actualStartRowWidth = sheet.getRowHeight(self._startRow, 3);
                    if (actualStartRowWidth < self._startRowOffset)
                    {
                        self._startRowOffset = actualStartRowWidth
                    }
                    var actualEndRowWidth = sheet.getRowHeight(self._endRow, 3);
                    if (actualEndRowWidth < self._endRowOffset)
                    {
                        self._endRowOffset = actualEndRowWidth
                    }
                    height = height - self._startRowOffset + self._endRowOffset;
                    comment.width(width);
                    comment.height(height)
                };
                CommentView.prototype._updateStartCoordinate = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        zoomFactor = self._zoomFactor;
                    if (!self._absLocation)
                    {
                        return
                    }
                    var viewportRect = self._getViewportRect(self._rowViewportIndex, self._columnViewportIndex);
                    var viewportLeftColumn = sheet.getViewportLeftColumn(self._columnViewportIndex),
                        viewportTopRow = sheet.getViewportTopRow(self._rowViewportIndex);
                    var startX;
                    if (self._columnViewportIndex === 0)
                    {
                        startX = self._absLocation.x
                    }
                    else if (self._columnViewportIndex === 1)
                    {
                        startX = self._absLocation.x - sheet.getViewportWidth(0)
                    }
                    else if (self._columnViewportIndex === 2)
                    {
                        startX = self._absLocation.x - (sheet.getViewportWidth(0) + sheet.getViewportWidth(1))
                    }
                    var startY;
                    if (self._rowViewportIndex === 0)
                    {
                        startY = self._absLocation.y
                    }
                    else if (self._rowViewportIndex === 1)
                    {
                        startY = self._absLocation.y - sheet.getViewportHeight(0)
                    }
                    else if (self._rowViewportIndex === 2)
                    {
                        startY = self._absLocation.y - (sheet.getViewportHeight(0) + sheet.getViewportHeight(1))
                    }
                    var startLocation = new Sheets.Point(startX, startY);
                    var x = 0,
                        y = 0;
                    for (var col = viewportLeftColumn; col < sheet.getColumnCount(); col++)
                    {
                        var actualColWidth = sheet.getColumnWidth(col, 3) * zoomFactor;
                        if (x + actualColWidth < startLocation.x)
                        {
                            x += actualColWidth
                        }
                        else
                        {
                            self._startColumn = col;
                            self._startColumnOffset = (startLocation.x - x) / zoomFactor;
                            break
                        }
                    }
                    for (var row = viewportTopRow; row < sheet.getRowCount(); row++)
                    {
                        var actualRowHeight = sheet.getRowHeight(row, 3) * zoomFactor;
                        if (y + actualRowHeight < startLocation.y)
                        {
                            y += actualRowHeight
                        }
                        else
                        {
                            self._startRow = row;
                            self._startRowOffset = (startLocation.y - y) / zoomFactor;
                            break
                        }
                    }
                };
                CommentView.prototype._updateEndCoordinate = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        zoomFactor = self._zoomFactor;
                    if (!self._absLocation)
                    {
                        return
                    }
                    var viewportRect = self._getViewportRect(self._rowViewportIndex, self._columnViewportIndex);
                    var viewportLeftColumn = sheet.getViewportLeftColumn(self._columnViewportIndex),
                        viewportTopRow = sheet.getViewportTopRow(self._rowViewportIndex);
                    var endX;
                    if (self._columnViewportIndex === 0)
                    {
                        endX = self._absLocation.x + self._getActualWidth()
                    }
                    else if (self._columnViewportIndex === 1)
                    {
                        endX = self._absLocation.x + self._getActualWidth() - sheet.getViewportWidth(0)
                    }
                    else if (self._columnViewportIndex === 2)
                    {
                        endX = self._absLocation.x + self._getActualWidth() - (sheet.getViewportWidth(0) + sheet.getViewportWidth(1))
                    }
                    var endY;
                    if (self._rowViewportIndex === 0)
                    {
                        endY = self._absLocation.y + self._getActualHeight()
                    }
                    else if (self._rowViewportIndex === 1)
                    {
                        endY = self._absLocation.y + self._getActualHeight() - sheet.getViewportHeight(0)
                    }
                    else if (self._rowViewportIndex === 2)
                    {
                        endY = self._absLocation.y + self._getActualHeight() - (sheet.getViewportHeight(0) + sheet.getViewportHeight(1))
                    }
                    var endLocation = new Sheets.Point(endX, endY);
                    var x = 0,
                        y = 0;
                    for (var col = viewportLeftColumn; col < sheet.getColumnCount(); col++)
                    {
                        var actualColWidth = sheet.getColumnWidth(col, 3) * zoomFactor;
                        if (x + actualColWidth < endLocation.x)
                        {
                            x += actualColWidth
                        }
                        else
                        {
                            self._endColumn = col;
                            self._endColumnOffset = (endLocation.x - x) / zoomFactor;
                            break
                        }
                    }
                    for (var row = viewportTopRow; row < sheet.getRowCount(); row++)
                    {
                        var actualRowHeight = sheet.getRowHeight(row, 3) * zoomFactor;
                        if (y + actualRowHeight < endLocation.y)
                        {
                            y += actualRowHeight
                        }
                        else
                        {
                            self._endRow = row;
                            self._endRowOffset = (endLocation.y - y) / zoomFactor;
                            break
                        }
                    }
                };
                CommentView.prototype.addRows = function(row, rowCount)
                {
                    var self = this,
                        comment = self._comment;
                    if (row <= self._startRow)
                    {
                        if (comment.dynamicMove())
                        {
                            self._startRow += rowCount;
                            self._endRow += rowCount
                        }
                    }
                    else if (row > self._startRow && row <= self._endRow)
                    {
                        if (comment.dynamicSize())
                        {
                            self._endRow += rowCount
                        }
                    }
                    self._updateSizeByCoordinate();
                    self._updateLocationByCoordinate()
                };
                CommentView.prototype.addColumns = function(column, columnCount)
                {
                    var self = this,
                        comment = self._comment;
                    if (column <= self._startColumn)
                    {
                        if (comment.dynamicMove())
                        {
                            self._startColumn += columnCount;
                            self._endColumn += columnCount
                        }
                    }
                    else if (column > self._startColumn && column <= self._endColumn)
                    {
                        if (comment.dynamicSize())
                        {
                            self._endColumn += columnCount
                        }
                    }
                    self._updateSizeByCoordinate();
                    self._updateLocationByCoordinate()
                };
                CommentView.prototype.removeRows = function(row, rowCount)
                {
                    var self = this,
                        comment = self._comment;
                    var endRemovedRow = row + rowCount - 1;
                    if (row < self._startRow)
                    {
                        if (endRemovedRow < self._startRow)
                        {
                            if (comment.dynamicMove())
                            {
                                self._startRow -= rowCount;
                                self._endRow -= rowCount
                            }
                        }
                        else if (endRemovedRow < self._endRow)
                        {
                            if (comment.dynamicMove())
                            {
                                if (comment.dynamicSize())
                                {
                                    self._endRow -= rowCount
                                }
                                else
                                {
                                    self._endRow -= self._startRow - row + 1
                                }
                                self._startRow = row;
                                self._startRowOffset = 0
                            }
                        }
                    }
                    else if (row <= self._endRow)
                    {
                        if (endRemovedRow < self._endRow)
                        {
                            if (comment.dynamicSize())
                            {
                                self._endRow -= rowCount
                            }
                        }
                        else
                        {
                            if (comment.dynamicSize())
                            {
                                self._endRow = row;
                                self._endRowOffset = 0
                            }
                        }
                    }
                    self._updateSizeByCoordinate();
                    self._updateLocationByCoordinate()
                };
                CommentView.prototype.removeColumns = function(column, columnCount)
                {
                    var self = this,
                        comment = self._comment;
                    var endRemovedColumn = column + columnCount - 1;
                    if (column < self._startColumn)
                    {
                        if (endRemovedColumn < self._startColumn)
                        {
                            if (comment.dynamicMove())
                            {
                                self._startColumn -= columnCount;
                                self._endColumn -= columnCount
                            }
                        }
                        else if (endRemovedColumn < self._endColumn)
                        {
                            if (comment.dynamicMove())
                            {
                                if (comment.dynamicSize())
                                {
                                    self._endColumn -= columnCount
                                }
                                else
                                {
                                    self._endColumn -= self._startColumn - column + 1
                                }
                                self._startColumn = column;
                                self._startColumnOffset = 0
                            }
                        }
                    }
                    else if (column <= self._endColumn)
                    {
                        if (endRemovedColumn < self._endColumn)
                        {
                            if (comment.dynamicSize())
                            {
                                self._endColumn -= columnCount
                            }
                        }
                        else
                        {
                            if (comment.dynamicSize())
                            {
                                self._endColumn = column;
                                self._endColumnOffset = 0
                            }
                        }
                    }
                    self._updateSizeByCoordinate();
                    self._updateLocationByCoordinate()
                };
                CommentView.prototype.updateLayout = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment._sheet;
                    if (self.isOpen())
                    {
                        if (self._zoomFactor !== sheet._zoomFactor)
                        {
                            self._zoomFactor = sheet._zoomFactor;
                            self._absLocation = self._getLocationByCoordinate()
                        }
                        else
                        {
                            self._zoomFactor = sheet._zoomFactor
                        }
                        self._updateCommentViewportIndex();
                        self._updateIndicatorSize();
                        self._formatComment();
                        self._updateLineContainerLayout();
                        self._updateAdornerLayout();
                        if ($.browser.chrome)
                        {
                            self._offsetCommentLayoutInChrome()
                        }
                        if (comment.autoSize() && !self._isAutosizing)
                        {
                            self._doAutosize()
                        }
                    }
                };
                CommentView.prototype._updateIndicatorSize = function()
                {
                    var self = this,
                        sheet = self._comment._sheet;
                    var useTouchLayout = sheet.parent && sheet.parent.useTouchLayout();
                    if (useTouchLayout)
                    {
                        self._hostMargin = 11
                    }
                    else
                    {
                        self._hostMargin = 7
                    }
                };
                CommentView.prototype._updateCommentViewportIndex = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet;
                    var row = comment._rowIndex,
                        col = comment._colIndex;
                    var rowViewportIndex = 1,
                        colViewportIndex = 1;
                    var frozenRowCount = sheet.frozenRowCount,
                        frozenColCount = sheet.frozenColCount,
                        frozenTrailingRowCount = sheet._frozenTrailingRowCount,
                        frozenTrailingColCount = sheet._frozenTrailingColCount,
                        rowCount = sheet.getRowCount(),
                        colCount = sheet.getColumnCount();
                    if (row < frozenRowCount)
                    {
                        rowViewportIndex = 0
                    }
                    else if (row >= frozenRowCount && row <= rowCount - frozenTrailingRowCount - 1)
                    {
                        rowViewportIndex = 1
                    }
                    else if (row > rowCount - frozenTrailingRowCount - 1)
                    {
                        rowViewportIndex = 2
                    }
                    if (col < frozenColCount)
                    {
                        colViewportIndex = 0
                    }
                    else if (col >= frozenColCount && col <= colCount - frozenTrailingColCount - 1)
                    {
                        colViewportIndex = 1
                    }
                    else if (col > colCount - frozenTrailingColCount - 1)
                    {
                        colViewportIndex = 2
                    }
                    self._rowViewportIndex = rowViewportIndex;
                    self._columnViewportIndex = colViewportIndex
                };
                CommentView.prototype._formatComment = function()
                {
                    var self = this,
                        comment = self._comment;
                    var targetDom = comment.commentState() === 2 ? self._editor : self._host;
                    self._formatCommentState();
                    self._formatCommentStyle(targetDom);
                    self._formatCommentText(targetDom);
                    self._formatCommentRect(targetDom);
                    self._formatCommentProtection()
                };
                CommentView.prototype._formatCommentText = function(targetDom)
                {
                    var self = this,
                        comment = self._comment;
                    if (targetDom === self._host)
                    {
                        targetDom.innerHTML = comment.text().replace(/\r\n|\n|\r/g, '<br/>')
                    }
                };
                CommentView.prototype._formatCommentRect = function(targetDom)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        absoluteLocation = self._absLocation,
                        zoomFactor = self._zoomFactor;
                    if (!absoluteLocation)
                    {
                        return
                    }
                    var adjustedRect;
                    if (self._isResizing)
                    {
                        adjustedRect = self._getAdjustedCommentRect(absoluteLocation, comment.width(), comment.height())
                    }
                    else
                    {
                        adjustedRect = self._getAdjustedCommentRect(absoluteLocation)
                    }
                    self._adjustCommentRect(adjustedRect);
                    var adjustedWidth = adjustedRect.width * zoomFactor,
                        adjustedHeight = adjustedRect.height * zoomFactor,
                        left = adjustedRect.x,
                        top = adjustedRect.y,
                        right = left + adjustedWidth,
                        bottom = top + adjustedHeight,
                        margin = self._hostMargin,
                        rect = self._getViewportRect(self._rowViewportIndex, self._columnViewportIndex);
                    if (left < rect.x)
                    {
                        $(self._floatBlockCanvas).css("left", left - rect.x);
                        $(self._hostContainer).css("left", left + margin - rect.x);
                        adjustedWidth += left - rect.x;
                        left = rect.x
                    }
                    else
                    {
                        $(self._floatBlockCanvas).css("left", 0);
                        $(self._hostContainer).css("left", margin);
                        if (right > rect.x + rect.width)
                        {
                            adjustedWidth += ((rect.x + rect.width - 1) - right)
                        }
                    }
                    adjustedWidth = Math_min(rect.width - 1, adjustedWidth);
                    if (top < rect.y)
                    {
                        $(self._floatBlockCanvas).css("top", top - rect.y);
                        $(self._hostContainer).css("top", top + margin - rect.y);
                        adjustedHeight += top - rect.y;
                        top = rect.y
                    }
                    else
                    {
                        $(self._floatBlockCanvas).css("top", 0);
                        $(self._hostContainer).css("top", margin);
                        if (bottom > rect.y + rect.height)
                        {
                            adjustedHeight += ((rect.y + rect.height - 1) - bottom)
                        }
                    }
                    adjustedHeight = Math_min(rect.height - 1, adjustedHeight);
                    $(self._floatBlockCanvasContainer).css({
                        left: left, top: top, width: adjustedWidth, height: adjustedHeight
                    });
                    var width = comment.width() * zoomFactor,
                        height = comment.height() * zoomFactor;
                    Sheets.DPIHelper.setSize(self._floatBlockCanvas, width, height);
                    var hostContainerWidth = Math_max(0, width - 2 * (margin + comment.borderWidth())),
                        hostContainerHeight = Math_max(0, height - 2 * (margin + comment.borderWidth()));
                    $(self._hostContainer).css({
                        width: hostContainerWidth, height: hostContainerHeight
                    });
                    var targetDomWidth = hostContainerWidth,
                        targetDomHeight = hostContainerHeight;
                    if (comment.padding())
                    {
                        targetDomWidth -= parseInt(comment.padding().left) + parseInt(comment.padding().right);
                        targetDomHeight -= parseInt(comment.padding().top) + parseInt(comment.padding().bottom)
                    }
                    $(targetDom).css({
                        width: Math_max(0, targetDomWidth), height: Math_max(0, targetDomHeight)
                    })
                };
                CommentView.prototype._adjustCommentRect = function(adjustedRect)
                {
                    var self = this,
                        comment = self._comment,
                        absoluteLocation = self._absLocation;
                    if (adjustedRect.x !== absoluteLocation.x || adjustedRect.y !== absoluteLocation.y || adjustedRect.width !== comment.width() || adjustedRect.height !== comment.height())
                    {
                        var location = self._convertAbsLocationToRelLocation(new Sheets.Point(adjustedRect.x, adjustedRect.y)),
                            width = adjustedRect.width,
                            height = adjustedRect.height;
                        if (location.x !== comment.location().x || location.y !== comment.location().y)
                        {
                            comment._location = location
                        }
                        if (width !== comment.width())
                        {
                            comment._width = width
                        }
                        if (height !== comment.height())
                        {
                            comment._height = height
                        }
                    }
                };
                CommentView.prototype._formatCommentProtection = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet;
                    if (sheet.isProtected)
                    {
                        if (comment.locked())
                        {
                            self._detachFloatBlockCanvasEventHandler();
                            self._attachMouseWheelEvent(self._floatBlockCanvas);
                            self._detachHostContainerEventHandler();
                            self._attachMouseWheelEvent(self._hostContainer);
                            self._floatBlockCanvas.style.cursor = "default";
                            self._hostContainer.style.cursor = "default"
                        }
                        else
                        {
                            self._attachFloatBlockCanvasEventHandler();
                            self._attachHostContainerEventHandler()
                        }
                        if (comment.lockText())
                        {
                            self._detachHostEventHandler();
                            self._attachMouseWheelEvent(self._host);
                            self._detachEditorEventHandler();
                            self._attachMouseWheelEvent(self._editor);
                            if (comment.locked() || comment.commentState() !== 1)
                            {
                                comment.commentState(3)
                            }
                            self._host.style.cursor = comment.locked() ? "default" : "move"
                        }
                        else
                        {
                            self._attachHostEventHandler();
                            self._attachEditorEventHandler()
                        }
                        self._attachLineCanvasEventHandler()
                    }
                    else
                    {
                        self._attachFloatBlockCanvasEventHandler();
                        self._attachHostContainerEventHandler();
                        self._attachLineCanvasEventHandler();
                        self._attachHostEventHandler();
                        self._attachEditorEventHandler()
                    }
                };
                CommentView.prototype._formatCommentState = function()
                {
                    var self = this,
                        comment = self._comment,
                        commentManager = self._commentManager,
                        sheet = comment && comment._sheet;
                    switch (comment.commentState())
                    {
                        case 1:
                            commentManager.activateComment(comment);
                            if (self.isEditing())
                            {
                                self.detachEditor()
                            }
                            if (sheet.getSelections().length > 0)
                            {
                                sheet._saveAndClearSheetSelections()
                            }
                            Sheets.FocusHelper.setActiveElement(sheet);
                            break;
                        case 2:
                            commentManager.activateComment(comment);
                            if (!self.isEditing())
                            {
                                self._attachEditor()
                            }
                            if (sheet.getSelections().length > 0)
                            {
                                sheet._saveAndClearSheetSelections()
                            }
                            Sheets.FocusHelper.setActiveElement(keyword_null);
                            break;
                        case 3:
                            if (comment === commentManager.getActiveComment())
                            {
                                commentManager.deactivateComment();
                                if (sheet.getSelections().length === 0)
                                {
                                    sheet._loadAndSetSheetSelections()
                                }
                            }
                            break
                    }
                };
                CommentView.prototype._formatCommentStyle = function(targetDom)
                {
                    var self = this,
                        comment = self._comment;
                    var $targetDom = $(targetDom);
                    $targetDom.css("font-family", comment.fontFamily()).css("font-style", comment.fontStyle()).css("font-size", parseInt(comment.fontSize()) * self._zoomFactor + "pt").css("font-weight", comment.fontWeight());
                    $targetDom.css("text-decoration", self._getTextDecorationString(comment.textDecoration()));
                    $targetDom.css("text-align", Sheets.HorizontalAlign[comment.horizontalAlign()]);
                    if (comment.padding())
                    {
                        $targetDom.css("padding", comment.padding().toString())
                    }
                    else
                    {
                        $targetDom.css("padding", "0px")
                    }
                    $targetDom.css("background-color", comment.backColor()).css("color", comment.foreColor()).css("opacity", comment.opacity());
                    $(self._hostContainer).css("border-width", comment.borderWidth()).css("border-style", comment.borderStyle()).css("border-color", comment.borderColor());
                    var actualZIndex = self._commentManager.getCommentActualZIndex(comment);
                    $(self._lineCanvasContainer).css("z-index", actualZIndex);
                    $(self._floatBlockCanvasContainer).css("z-index", actualZIndex)
                };
                CommentView.prototype._getTextDecorationString = function(textDecoration)
                {
                    var tdString = "";
                    if (textDecoration !== 0)
                    {
                        if ((textDecoration | 1) === textDecoration)
                        {
                            tdString += " underline"
                        }
                        if ((textDecoration | 2) === textDecoration)
                        {
                            tdString += " line-through"
                        }
                        if ((textDecoration | 4) === textDecoration)
                        {
                            tdString += " overline"
                        }
                    }
                    else
                    {
                        tdString += "none"
                    }
                    return tdString
                };
                CommentView.prototype._offsetCommentLayoutInChrome = function()
                {
                    var self = this,
                        sheet = this._comment._sheet;
                    var $hostContainer = $(self._hostContainer);
                    if (!sheet || !$hostContainer)
                    {
                        return
                    }
                    var canvasOffset = sheet._eventHandler._getCanvasOffset();
                    var xOffset = canvasOffset.left - Math.floor(canvasOffset.left) >= 0.5 ? 0.5 : 0;
                    var yOffset = canvasOffset.top - Math.floor(canvasOffset.top) >= 0.5 ? 0.5 : 0;
                    $hostContainer.css("left", parseFloat($hostContainer.css("left")) + xOffset);
                    $hostContainer.css("top", parseFloat($hostContainer.css("top")) + yOffset)
                };
                CommentView.prototype._updateLineContainerLayout = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment._sheet;
                    var cellRect = self._getCellRect(sheet, comment._rowIndex, comment._colIndex, self._rowViewportIndex, self._columnViewportIndex);
                    var sheetLayout = sheet._getSheetLayout();
                    var startPoint = keyword_null;
                    var startX = cellRect.x + cellRect.width - sheetLayout.rowHeaderWidth;
                    var startY = cellRect.y - sheetLayout.colHeaderHeight;
                    startPoint = new Sheets.Point(startX, startY);
                    var endPoint = keyword_null;
                    var floatBlockCanvasContainerPosition = $(self._floatBlockCanvasContainer).position();
                    var hostContainerPosition = $(self._hostContainer).position();
                    var $hostContainer = $(self._hostContainer);
                    if (floatBlockCanvasContainerPosition.left + hostContainerPosition.left > startPoint.x)
                    {
                        endPoint = new Sheets.Point(floatBlockCanvasContainerPosition.left + hostContainerPosition.left, floatBlockCanvasContainerPosition.top + hostContainerPosition.top)
                    }
                    else
                    {
                        if (floatBlockCanvasContainerPosition.top + hostContainerPosition.top + $hostContainer.height() < startPoint.y)
                        {
                            endPoint = new Sheets.Point(floatBlockCanvasContainerPosition.left + hostContainerPosition.left + $hostContainer.width(), floatBlockCanvasContainerPosition.top + hostContainerPosition.top + $hostContainer.height())
                        }
                        else
                        {
                            endPoint = new Sheets.Point(floatBlockCanvasContainerPosition.left + hostContainerPosition.left + $hostContainer.width(), floatBlockCanvasContainerPosition.top + hostContainerPosition.top)
                        }
                    }
                    var margin = self._hostMargin;
                    var width = Math_abs(startPoint.x - endPoint.x) + 2 * margin,
                        height = Math_abs(startPoint.y - endPoint.y) + 2 * margin;
                    var left = Math_min(startPoint.x, endPoint.x) - margin,
                        top = Math_min(startPoint.y, endPoint.y) - margin,
                        right = left + width,
                        bottom = top + height;
                    var rect = self._getViewportRect(self._rowViewportIndex, self._columnViewportIndex);
                    if (left < rect.x)
                    {
                        width -= rect.x - left;
                        left = rect.x
                    }
                    if (right > rect.x + rect.width)
                    {
                        width -= right - (rect.x + rect.width)
                    }
                    width = Math_min(rect.width, width);
                    if (top < rect.y)
                    {
                        height -= rect.y - top;
                        top = rect.y
                    }
                    if (bottom > rect.y + rect.height)
                    {
                        height -= bottom - (rect.y + rect.height)
                    }
                    height = Math_min(rect.height, height);
                    $(self._lineCanvasContainer).css("left", left).css("top", top).css("width", width).css("height", height);
                    Sheets.DPIHelper.setSize(self._lineCanvas, width, height);
                    startPoint.x = startPoint.x - left;
                    startPoint.y = startPoint.y - top;
                    endPoint.x = endPoint.x - left;
                    endPoint.y = endPoint.y - top;
                    self._drawLine(startPoint, endPoint)
                };
                CommentView.prototype._drawLine = function(start, end)
                {
                    var self = this;
                    if (!self._lineCtx)
                    {
                        self._lineCtx = self._lineCanvas.getContext("2d")
                    }
                    var ctx = self._lineCtx;
                    var color = self._comment.borderColor();
                    ctx.strokeStyle = color;
                    ctx.clearRect(0, 0, Sheets.DPIHelper.getLogicWidth(self._lineCanvas), Sheets.DPIHelper.getLogicHeight(self._lineCanvas));
                    ctx.beginPath();
                    ctx.moveTo(start.x, start.y);
                    ctx.lineTo(end.x, end.y);
                    ctx.stroke();
                    ctx.save();
                    ctx.translate(start.x, start.y);
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    var rotation = Math_atan2(end.y - start.y, end.x - start.x);
                    ctx.rotate(rotation);
                    ctx.moveTo(0, 0);
                    ctx.lineTo(7, -4);
                    ctx.lineTo(7, 4);
                    ctx.lineTo(0, 0);
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore()
                };
                CommentView.prototype._updateAdornerLayout = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment._sheet;
                    self._adornerDrawState = self._comment.commentState();
                    if (!self._adornerCtx)
                    {
                        self._adornerCtx = self._floatBlockCanvas.getContext("2d")
                    }
                    var ctx = self._adornerCtx;
                    var width = Sheets.DPIHelper.getLogicWidth(self._floatBlockCanvas),
                        height = Sheets.DPIHelper.getLogicHeight(self._floatBlockCanvas),
                        hostWidth = $(self._hostContainer).outerWidth(),
                        hostHeight = $(self._hostContainer).outerHeight(),
                        hostMargin = self._hostMargin;
                    ctx.clearRect(0, 0, width, height);
                    if (self._comment.showShadow())
                    {
                        self._drawShadowAdorner(ctx, hostMargin, hostWidth, hostHeight);
                        self._drawStateAdorner(ctx, width, height)
                    }
                    if (!(sheet.isProtected && comment.locked()))
                    {
                        self._drawResizeAdorner(ctx, hostMargin, width, height, hostWidth, hostHeight)
                    }
                    ctx.restore()
                };
                CommentView.prototype._drawShadowAdorner = function(ctx, hostMargin, hostWidth, hostHeight)
                {
                    ctx.fillRect(hostMargin + 2, hostMargin + 2, hostWidth, hostHeight)
                };
                CommentView.prototype._drawStateAdorner = function(ctx, width, height)
                {
                    switch (this._adornerDrawState)
                    {
                        case 1:
                            ctx.beginPath();
                            for (var y = 0; y < height; y++)
                            {
                                var x = y % 2 == 0 ? 1 : 3;
                                while (x < width)
                                {
                                    ctx.moveTo(x, y);
                                    ctx.lineTo(x + 1, y + 1);
                                    x = x + 4
                                }
                            }
                            ctx.stroke();
                            ctx.closePath();
                            break;
                        case 2:
                            ctx.beginPath();
                            var x = 0,
                                y = 0,
                                lineSpace = 4;
                            while (x < (width + height))
                            {
                                ctx.moveTo(x + lineSpace, 0);
                                ctx.lineTo(0, y + lineSpace);
                                x = x + lineSpace;
                                y = y + lineSpace
                            }
                            ctx.stroke();
                            ctx.closePath();
                            break;
                        default:
                    }
                };
                CommentView.prototype._drawResizeAdorner = function(ctx, hostMargin, width, height, hostWidth, hostHeight)
                {
                    var self = this;
                    if (self._adornerDrawState === 1 || self._adornerDrawState === 2)
                    {
                        self._resizeHitRects.splice(0, self._resizeHitRects.length);
                        var topLeft = new Sheets.Rect(0, 0, hostMargin, hostMargin);
                        self._resizeHitRects.push(topLeft);
                        var topRight = new Sheets.Rect(width - hostMargin, 0, hostMargin, hostMargin);
                        self._resizeHitRects.push(topRight);
                        var bottomLeft = new Sheets.Rect(0, height - hostMargin, hostMargin, hostMargin);
                        self._resizeHitRects.push(bottomLeft);
                        var bottomRight = new Sheets.Rect(width - hostMargin, height - hostMargin, hostMargin, hostMargin);
                        self._resizeHitRects.push(bottomRight);
                        if (hostHeight >= 3 * hostMargin)
                        {
                            var middleLeft = new Sheets.Rect(0, Math_floor(height / 2 - hostMargin / 2), hostMargin, hostMargin);
                            self._resizeHitRects.push(middleLeft);
                            var middleRight = new Sheets.Rect(width - hostMargin, Math_floor(height / 2 - hostMargin / 2), hostMargin, hostMargin);
                            self._resizeHitRects.push(middleRight)
                        }
                        else
                        {
                            self._resizeHitRects.push(keyword_null);
                            self._resizeHitRects.push(keyword_null)
                        }
                        if (hostWidth >= 3 * hostMargin)
                        {
                            var topCenter = new Sheets.Rect(Math_floor(width / 2 - hostMargin / 2), 0, hostMargin, hostMargin);
                            self._resizeHitRects.push(topCenter);
                            var bottomCenter = new Sheets.Rect(Math_floor(width / 2 - hostMargin / 2), height - hostMargin, hostMargin, hostMargin);
                            self._resizeHitRects.push(bottomCenter)
                        }
                        else
                        {
                            self._resizeHitRects.push(keyword_null);
                            self._resizeHitRects.push(keyword_null)
                        }
                        ctx.save();
                        ctx.fillStyle = "white";
                        ctx.strokeStyle = "#939393";
                        ctx.linewidth = 1;
                        ctx.translate(0.5, 0.5);
                        $(self._resizeHitRects).each(function()
                        {
                            if (self)
                            {
                                var owner = this,
                                    x = owner.x,
                                    y = owner.y,
                                    w = owner.width,
                                    h = owner.height;
                                ctx.beginPath();
                                ctx.fillRect(x, y, w - 1, h - 1);
                                ctx.strokeRect(x, y, w - 1, h - 1);
                                ctx.stroke();
                                ctx.closePath()
                            }
                        })
                    }
                };
                CommentView.prototype._drawMoveResizeContainer = function()
                {
                    var self = this,
                        commentManager = self._commentManager;
                    if (self._moveResizeContainerDom)
                    {
                        $(self._moveResizeContainerDom).remove()
                    }
                    else
                    {
                        self._moveResizeContainerDom = document.createElement("div")
                    }
                    if (self._moveResizePanelDom)
                    {
                        $(self._moveResizePanelDom).remove()
                    }
                    else
                    {
                        self._moveResizePanelDom = document.createElement("div")
                    }
                    var $moveResizePanelDom = $(self._moveResizePanelDom);
                    var $moveResizeContainerDom = $(self._moveResizeContainerDom);
                    var mouseCapture = commentManager._mouseCapture;
                    var $hostContainer = $(self._hostContainer);
                    var viewportRect = self._getViewportRect(self._rowViewportIndex, self._columnViewportIndex);
                    $moveResizePanelDom.css({
                        position: 'absolute', overflow: 'hidden', top: viewportRect.y, left: viewportRect.x, width: viewportRect.width, height: viewportRect.height
                    }).css('z-index', 901).bind('mousemove', function(e)
                    {
                        self._doMouseMove(e)
                    }).bind('mouseup', function(e)
                    {
                        self._doMouseUp(e)
                    });
                    $moveResizeContainerDom.addClass("gc-spread-moveResizeContainer").css('position', 'absolute').css('left', self._absLocation.x + self._hostMargin - viewportRect.x).css('top', self._absLocation.y + self._hostMargin - viewportRect.y).css('width', $hostContainer.outerWidth() - 2).css('height', $hostContainer.outerHeight() - 2).css("border", "gray solid thin");
                    $moveResizePanelDom.append(self._moveResizeContainerDom);
                    if (self._commentLayoutPanel)
                    {
                        self._commentLayoutPanel.appendChild(self._moveResizePanelDom)
                    }
                };
                CommentView.prototype._doMoveResizeContainer = function(event)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        absLocation = self._absLocation,
                        margin = self._hostMargin,
                        zoomFactor = self._zoomFactor;
                    var commentManager = sheet._commentManager,
                        mouseCapture = commentManager._mouseCapture;
                    if (mouseCapture.capture)
                    {
                        var scrollOffset = self._getViewportScrollOffset(),
                            offsetX = event.pageX / zoomFactor - mouseCapture.x + scrollOffset.x,
                            offsetY = event.pageY / zoomFactor - mouseCapture.y + scrollOffset.y;
                        if (offsetX === 0 && offsetY === 0)
                        {
                            return
                        }
                        var viewportRect = self._getViewportRect(self._rowViewportIndex, self._columnViewportIndex);
                        var $moveResizeContainerDom = $(self._moveResizeContainerDom);
                        if (mouseCapture.resizeDirct == -100)
                        {
                            var newX = mouseCapture.cachedRect.x + offsetX,
                                newY = mouseCapture.cachedRect.y + offsetY;
                            var location = self._convertRelLocationToAbsLocation(new Sheets.Point(newX, newY));
                            $moveResizeContainerDom.css('left', location.x + margin - viewportRect.x).css('top', location.y + margin - viewportRect.y)
                        }
                        else
                        {
                            var commentResizeRect;
                            switch (mouseCapture.resizeDirct)
                            {
                                case 0:
                                    commentResizeRect = self._getCommentTopLeftResizeRect(offsetX, offsetY);
                                    break;
                                case 1:
                                    commentResizeRect = self._getCommentTopRightResizeRect(offsetX, offsetY);
                                    break;
                                case 2:
                                    commentResizeRect = self._getCommentBottomLeftResizeRect(offsetX, offsetY);
                                    break;
                                case 3:
                                    commentResizeRect = self._getCommentBottomRightResizeRect(offsetX, offsetY);
                                    break;
                                case 4:
                                    commentResizeRect = self._getCommentMiddleLeftResizeRect(offsetX);
                                    break;
                                case 5:
                                    commentResizeRect = self._getCommentMiddleRightResizeRect(offsetX);
                                    break;
                                case 6:
                                    commentResizeRect = self._getCommentTopCenterResizeRect(offsetY);
                                    break;
                                case 7:
                                    commentResizeRect = self._getCommentBottomCenterResizeRect(offsetY);
                                    break
                            }
                            var location = self._convertRelLocationToAbsLocation(new Sheets.Point(commentResizeRect.x, commentResizeRect.y));
                            $moveResizeContainerDom.css('left', location.x + margin - viewportRect.x).css('top', location.y + margin - viewportRect.y).css('width', commentResizeRect.width * zoomFactor - 2 * margin - 2).css('height', commentResizeRect.height * zoomFactor - 2 * margin - 2)
                        }
                    }
                };
                CommentView.prototype._attachEditor = function()
                {
                    var self = this,
                        comment = self._comment;
                    if (!self.isEditing())
                    {
                        var editor = self._commentManager._editorDom;
                        $(self._host).remove();
                        self._detachHostEventHandler();
                        $(editor).remove();
                        $(self._hostContainer).append(editor);
                        self._setDomStyle(editor);
                        self._formatCommentRect(editor);
                        $(editor).focus();
                        editor.selectionStart = editor.value.length;
                        self._attachEditorEventHandler();
                        if (comment.commentState() !== 2)
                        {
                            comment.commentState(2)
                        }
                    }
                };
                CommentView.prototype.detachEditor = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment._sheet;
                    if (self.isEditing())
                    {
                        var editor = self._commentManager._editorDom;
                        $(editor).remove();
                        self._detachEditorEventHandler();
                        $(self._hostContainer).append(self._host);
                        self._setDomStyle(self._host);
                        self._attachHostEventHandler();
                        if (Sheets.features.touch)
                        {
                            self._touchContentManager = new Sheets.CommentContentTouchManager(self._host, self, sheet.parent._touchEventProvider);
                            self._touchContentManager.attach()
                        }
                        if (comment.commentState() === 2)
                        {
                            comment.commentState(3)
                        }
                        if ($(editor).val() !== comment.text())
                        {
                            var action = new Sheets.UndoRedo.CommentPropertyUndoAction(sheet, comment, comment.text(), $(editor).val(), "text");
                            sheet._doCommand(action)
                        }
                    }
                };
                CommentView.prototype._getSheetHeight = function(sheet)
                {
                    if (sheet === keyword_null || sheet === keyword_undefined)
                    {
                        return -1
                    }
                    var height = 0;
                    var rowCount = sheet.getRowCount();
                    for (var row = 0; row < rowCount; row++)
                    {
                        height += sheet.getRowHeight(row, 3) * this._zoomFactor
                    }
                    return height
                };
                CommentView.prototype._getSheetWidth = function(sheet)
                {
                    if (sheet === keyword_null || sheet === keyword_undefined)
                    {
                        return -1
                    }
                    var width = 0;
                    var columnCount = sheet.getColumnCount();
                    for (var column = 0; column < columnCount; column++)
                    {
                        width += sheet.getColumnWidth(column, 3) * this._zoomFactor
                    }
                    return width
                };
                CommentView.prototype._getViewportHeight = function(rowViewportIndex)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet;
                    if (rowViewportIndex === 0 || rowViewportIndex === 2)
                    {
                        return sheet.getViewportHeight(rowViewportIndex)
                    }
                    else if (rowViewportIndex === 1)
                    {
                        var firstRow = sheet.getViewportBottomRow(0) + 1;
                        var lastRow = sheet.getViewportTopRow(2);
                        var viewportHeight = 0;
                        for (var i = firstRow; i <= lastRow; i++)
                        {
                            viewportHeight += sheet.getRowHeight(i, 3) * self._zoomFactor
                        }
                        return viewportHeight
                    }
                    return -1
                };
                CommentView.prototype._getViewportWidth = function(columnViewportIndex)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet;
                    if (columnViewportIndex === 0 || columnViewportIndex === 2)
                    {
                        return sheet.getViewportWidth(columnViewportIndex)
                    }
                    else if (columnViewportIndex === 1)
                    {
                        var firstColumn = sheet.getViewportRightColumn(0) + 1;
                        var lastColumn = sheet.getViewportLeftColumn(2);
                        var viewportWidth = 0;
                        for (var i = firstColumn; i <= lastColumn; i++)
                        {
                            viewportWidth += sheet.getColumnWidth(i, 3) * self._zoomFactor
                        }
                        return viewportWidth
                    }
                    return -1
                };
                CommentView.prototype._getTwoColumnDistance = function(sheet, column1, column2)
                {
                    var startColumn = Math_min(column1, column2);
                    var endColumn = Math_max(column1, column2);
                    var totalWidth = 0;
                    for (var c = startColumn; c < endColumn; c++)
                    {
                        totalWidth += sheet.getColumnWidth(c, 3) * this._zoomFactor
                    }
                    return totalWidth
                };
                CommentView.prototype._getTwoRowDistance = function(sheet, row1, row2)
                {
                    var startRow = Math_min(row1, row2);
                    var endRow = Math_max(row1, row2);
                    var totalHeight = 0;
                    for (var i = startRow; i < endRow; i++)
                    {
                        totalHeight += sheet.getRowHeight(i, 3) * this._zoomFactor
                    }
                    return totalHeight
                };
                CommentView.prototype._getViewportRect = function(rowViewportIndex, columnViewportIndex)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment._sheet,
                        commentManager = self._commentManager,
                        commentView = commentManager.getCommentView(comment);
                    ;
                    var layout = sheet._getSheetLayout(),
                        rect = new Sheets.Rect(0, 0, 0, 0);
                    rect = layout.viewportRect(rowViewportIndex, columnViewportIndex);
                    if (rowViewportIndex === 0 && columnViewportIndex === 0 || rowViewportIndex === 0 && columnViewportIndex === 2 || rowViewportIndex === 2 && columnViewportIndex === 0 || rowViewportIndex === 2 && columnViewportIndex === 2)
                    {
                        rect.x = 0;
                        rect.y = 0;
                        rect.width = layout.frozenWidth + layout.viewportWidth + layout.frozenTrailingWidth;
                        rect.height = layout.frozenHeight + layout.viewportHeight + layout.frozenTrailingHeight
                    }
                    else if (rowViewportIndex === 0 && columnViewportIndex === 1 || rowViewportIndex === 2 && columnViewportIndex === 1)
                    {
                        rect.x = layout.frozenWidth;
                        rect.y = 0;
                        rect.width = layout.viewportWidth;
                        rect.height = layout.frozenHeight + layout.viewportHeight + layout.frozenTrailingHeight
                    }
                    else if (rowViewportIndex === 1 && columnViewportIndex === 0 || rowViewportIndex === 1 && columnViewportIndex === 2)
                    {
                        rect.x = 0;
                        rect.y = layout.frozenHeight;
                        rect.width = layout.frozenWidth + layout.viewportWidth + layout.frozenTrailingWidth;
                        rect.height = layout.viewportHeight
                    }
                    else if (rowViewportIndex === 1 && columnViewportIndex === 1)
                    {
                        rect.x = layout.frozenWidth;
                        ;
                        rect.y = layout.frozenHeight;
                        rect.width = layout.viewportWidth;
                        rect.height = layout.viewportHeight
                    }
                    return rect
                };
                CommentView.prototype._setDomStyle = function(targetDOM)
                {
                    var self = this,
                        comment = self._comment,
                        $targetDOM = $(targetDOM);
                    if (targetDOM !== self._editor && targetDOM !== self._host)
                    {
                        return
                    }
                    if (targetDOM === self._editor)
                    {
                        targetDOM.value = comment.text()
                    }
                    else
                    {
                        targetDOM.innerHTML = comment.text().replace(/\r\n|\n|\r/g, '<br/>')
                    }
                    $targetDOM.css("font-family", comment.fontFamily()).css("font-style", comment.fontStyle()).css("font-size", comment.fontSize()).css("font-weight", comment.fontWeight()).css("color", comment.foreColor()).css("background-color", comment.backColor()).css("text-align", comment.horizontalAlign()).css("text-decoration", comment.textDecoration());
                    if (comment.padding())
                    {
                        $targetDOM.css("padding", comment.padding().toString())
                    }
                    else
                    {
                        $targetDOM.css("padding", "0px")
                    }
                };
                CommentView.prototype.isOpen = function()
                {
                    var self = this;
                    if (self._floatBlockCanvasContainer && self._floatBlockCanvasContainer.parentNode)
                    {
                        return true
                    }
                    return false
                };
                CommentView.prototype.isActive = function()
                {
                    var self = this;
                    if (self.isOpen() && self._comment === self._commentManager.getActiveComment())
                    {
                        return true
                    }
                    return false
                };
                CommentView.prototype.isEditing = function()
                {
                    var self = this;
                    if (self.isActive())
                    {
                        return $(self._hostContainer).find("textarea").length > 0
                    }
                    return false
                };
                CommentView.prototype.getCommentRect = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        zoomFactor = self._zoomFactor,
                        commentRect = keyword_null;
                    if (self.isOpen())
                    {
                        var sheetLayout = self._comment._sheet._getSheetLayout();
                        commentRect = new Sheets.Rect(self._absLocation.x + sheetLayout.headerX + sheetLayout.rowHeaderWidth, self._absLocation.y + sheetLayout.headerY + sheetLayout.colHeaderHeight, self._getActualWidth(), self._getActualHeight())
                    }
                    return commentRect
                };
                CommentView.prototype.getCommentEditAreaRect = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        zoomFactor = self._zoomFactor;
                    if (self.isOpen())
                    {
                        var commentRect = self.getCommentRect();
                        if (commentRect)
                        {
                            var x,
                                y,
                                width,
                                height;
                            var editAreaXOffset = (self._hostMargin + comment.borderWidth()) * zoomFactor;
                            var editAreaYOffset = (self._hostMargin + comment.borderWidth()) * zoomFactor;
                            x = commentRect.x + editAreaXOffset;
                            y = commentRect.y + editAreaYOffset;
                            width = commentRect.width - 2 * editAreaXOffset;
                            height = commentRect.height - 2 * editAreaYOffset;
                            return new Sheets.Rect(x, y, width, height)
                        }
                    }
                    return keyword_null
                };
                CommentView.prototype._setCursorState = function(event)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment._sheet;
                    var target = event.target,
                        mouseCapture = self._commentManager._mouseCapture;
                    if (mouseCapture.capture)
                    {
                        if (target.className === self._hostClassName || target.className === self._floatBlockCanvasClassName || target.className === self._lineCanvasClassName || target.className === "gc-spread-floatPanel")
                        {
                            target.style.cursor = mouseCapture.resizeDirct >= 0 ? "crosshair" : "move"
                        }
                        return
                    }
                    else
                    {
                        if (target.className === self._hostClassName)
                        {
                            if (sheet.isProtected && comment.lockText())
                            {
                                if (comment.locked())
                                {
                                    target.style.cursor = "default"
                                }
                                else
                                {
                                    target.style.cursor = "move"
                                }
                                return
                            }
                            else
                            {
                                target.style.cursor = "text";
                                return
                            }
                        }
                        if (target.className === self._floatBlockCanvasClassName || target.className === self._hostContainerClassName)
                        {
                            if (sheet.isProtected && comment.locked())
                            {
                                target.style.cursor = "default";
                                return
                            }
                            else
                            {
                                var resizeDirct = self._getResizeDirection(event);
                                switch (resizeDirct)
                                {
                                    case 0:
                                        target.style.cursor = "nw-resize";
                                        return;
                                    case 1:
                                        target.style.cursor = "ne-resize";
                                        return;
                                    case 2:
                                        target.style.cursor = "sw-resize";
                                        return;
                                    case 3:
                                        target.style.cursor = "se-resize";
                                        return;
                                    case 4:
                                        target.style.cursor = "w-resize";
                                        return;
                                    case 5:
                                        target.style.cursor = "e-resize";
                                        return;
                                    case 6:
                                        target.style.cursor = "n-resize";
                                        return;
                                    case 7:
                                        target.style.cursor = "s-resize";
                                        return;
                                    default:
                                        {
                                            target.style.cursor = "move";
                                            return
                                        }
                                }
                            }
                        }
                    }
                    target.style.cursor = "default"
                };
                CommentView.prototype._doMouseDownToEdit = function(event)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet;
                    sheet.endEdit();
                    sheet.unSelectAllFloatingObjects();
                    if (self._touchContentManager && !event.isTouch && self._touchContentManager.preProcessMouseDown(event))
                    {
                        Sheets.util.cancelDefault(event);
                        return
                    }
                    self._commentManager.activateComment(comment);
                    comment.commentState(2);
                    self._doMouseUp(event);
                    return Sheets.util.cancelDefault(event)
                };
                CommentView.prototype._doMouseDownToDragOrResize = function(event)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        zoomFactor = self._zoomFactor;
                    var commentManager = self._commentManager,
                        mouseCapture = commentManager._mouseCapture;
                    sheet.endEdit();
                    sheet.unSelectAllFloatingObjects();
                    if (self._touchManager && !event.isTouch && self._touchManager.preProcessMouseDown(event))
                    {
                        Sheets.util.cancelDefault(event);
                        return
                    }
                    mouseCapture.x = event.pageX / zoomFactor;
                    mouseCapture.y = event.pageY / zoomFactor;
                    mouseCapture.cachedRect = new Sheets.Rect(comment.location().x, comment.location().y, comment.width(), comment.height());
                    mouseCapture.resizeDirct = self._getResizeDirection(event);
                    self._handleDocumentMouseMove();
                    mouseCapture.capture = true;
                    self._setCursorState(event);
                    commentManager.activateComment(comment);
                    comment.commentState(1);
                    if (!(sheet.isProtected && comment.locked()))
                    {
                        self._moveInfo = {};
                        self._moveInfo.startTopRow = sheet.getViewportTopRow(self._rowViewportIndex);
                        self._moveInfo.startLeftColumn = sheet.getViewportLeftColumn(self._columnViewportIndex);
                        self._drawMoveResizeContainer();
                        if (mouseCapture.resizeDirct === -100)
                        {
                            self._isMoving = true
                        }
                        else
                        {
                            self._isResizing = true
                        }
                    }
                    var eventHandler = sheet._eventHandler,
                        canvasOffset = eventHandler._getCanvasOffset(),
                        mousePosition = new Sheets.Point(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top),
                        sheetHitTestInfo = sheet.hitTest(mousePosition.x, mousePosition.y);
                    eventHandler.startHitInfo = {
                        scrollRowViewportIndex: sheetHitTestInfo.rowViewportIndex, scrollColViewportIndex: sheetHitTestInfo.colViewportIndex, hitTestType: sheetHitTestInfo.hitTestType
                    };
                    eventHandler.mousePosition = mousePosition;
                    eventHandler.startScroll();
                    eventHandler.isCommentWorking = true;
                    event.stopPropagation()
                };
                CommentView.prototype._getAdjustedCommentRect = function(location, width, height)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        margin = self._hostMargin,
                        zoomFactor = self._zoomFactor;
                    var sheetWidth = self._getSheetWidth(sheet),
                        sheetHeight = self._getSheetHeight(sheet),
                        viewportRect = self._getViewportRect(self._rowViewportIndex, self._columnViewportIndex);
                    var actualWidth,
                        actualHeight,
                        isResizing;
                    if (arguments.length === 1)
                    {
                        actualWidth = self._getActualWidth();
                        actualHeight = self._getActualHeight();
                        isResizing = false
                    }
                    else if (arguments.length === 3)
                    {
                        actualWidth = width * zoomFactor;
                        actualHeight = height * zoomFactor;
                        isResizing = true
                    }
                    var left = location.x,
                        top = location.y,
                        layout = sheet._getSheetLayout(),
                        cellRect = self._getCellRect(sheet, 0, 0, self._rowViewportIndex, self._columnViewportIndex),
                        right = location.x + (0 - (cellRect.x - layout.rowHeaderWidth)) + actualWidth - margin,
                        bottom = location.y + (0 - (cellRect.y - layout.colHeaderHeight)) + actualHeight - margin,
                        leftBoundry,
                        topBoundry,
                        rightBoundry,
                        bottomBoundry;
                    if (self._columnViewportIndex === 0)
                    {
                        leftBoundry = 0 - margin;
                        rightBoundry = layout.width - layout.rowHeaderWidth
                    }
                    else if (self._columnViewportIndex === 1)
                    {
                        var scrollLeftColumnOffset = self._getTwoColumnDistance(sheet, sheet.getViewportRightColumn(0) + 1, sheet.getViewportLeftColumn(1));
                        leftBoundry = viewportRect.x - margin - scrollLeftColumnOffset;
                        var trailingFrozenViewportWidth = self._getViewportWidth(2);
                        rightBoundry = sheetWidth - trailingFrozenViewportWidth
                    }
                    else if (self._columnViewportIndex === 2)
                    {
                        leftBoundry = 0 - margin;
                        rightBoundry = sheetWidth
                    }
                    if (left < leftBoundry)
                    {
                        if (isResizing)
                        {
                            actualWidth -= leftBoundry - left
                        }
                        left = leftBoundry
                    }
                    if (right > rightBoundry)
                    {
                        if (isResizing)
                        {
                            actualWidth -= right - rightBoundry
                        }
                        else
                        {
                            left -= right - rightBoundry
                        }
                    }
                    if (self._rowViewportIndex === 0)
                    {
                        topBoundry = 0 - margin;
                        bottomBoundry = layout.height - layout.colHeaderHeight
                    }
                    else if (self._rowViewportIndex === 1)
                    {
                        var scrollTopRowOffset = self._getTwoRowDistance(sheet, sheet.getViewportBottomRow(0) + 1, sheet.getViewportTopRow(1));
                        topBoundry = viewportRect.y - margin - scrollTopRowOffset;
                        var trailingFrozenViewportHeight = self._getViewportHeight(2);
                        bottomBoundry = sheetHeight - trailingFrozenViewportHeight
                    }
                    else if (self._rowViewportIndex === 2)
                    {
                        topBoundry = 0 - margin;
                        bottomBoundry = sheetHeight
                    }
                    if (top < topBoundry)
                    {
                        if (isResizing)
                        {
                            actualHeight -= topBoundry - top
                        }
                        top = topBoundry
                    }
                    if (bottom > bottomBoundry)
                    {
                        if (isResizing)
                        {
                            actualHeight -= bottom - bottomBoundry
                        }
                        else
                        {
                            top -= bottom - bottomBoundry
                        }
                    }
                    return new Sheets.Rect(left, top, actualWidth / zoomFactor, actualHeight / zoomFactor)
                };
                CommentView.prototype._getViewportScrollOffset = function()
                {
                    var self = this,
                        sheet = self._comment._sheet,
                        x,
                        y;
                    var oldStartTopRow = self._moveInfo.startTopRow,
                        oldStartLeftColumn = self._moveInfo.startLeftColumn,
                        newStartTopRow = sheet.getViewportTopRow(self._rowViewportIndex),
                        newStartLeftColumn = sheet.getViewportLeftColumn(self._columnViewportIndex);
                    var viewportOffsetHeight = self._getTwoRowDistance(sheet, oldStartTopRow, newStartTopRow),
                        viewportOffsetWidth = self._getTwoColumnDistance(sheet, oldStartLeftColumn, newStartLeftColumn);
                    x = oldStartLeftColumn < newStartLeftColumn ? viewportOffsetWidth : -viewportOffsetWidth;
                    y = oldStartTopRow < newStartTopRow ? viewportOffsetHeight : -viewportOffsetHeight;
                    return new Sheets.Point(x, y)
                };
                CommentView.prototype._doMoveResizeComment = function(event)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        zoomFactor = self._zoomFactor;
                    var commentManager = sheet._commentManager,
                        mouseCapture = commentManager._mouseCapture;
                    if (mouseCapture.capture)
                    {
                        var scrollOffset = self._getViewportScrollOffset(),
                            offsetX = event.pageX / zoomFactor - mouseCapture.x + scrollOffset.x,
                            offsetY = event.pageY / zoomFactor - mouseCapture.y + scrollOffset.y;
                        if (offsetX === 0 && offsetY === 0)
                        {
                            return
                        }
                        if (mouseCapture.resizeDirct == -100)
                        {
                            var newX = mouseCapture.cachedRect.x + offsetX,
                                newY = mouseCapture.cachedRect.y + offsetY;
                            var absoluteLocation = self._convertRelLocationToAbsLocation(new Sheets.Point(newX, newY));
                            var adjustedRect = self._getAdjustedCommentRect(absoluteLocation);
                            var location = self._convertAbsLocationToRelLocation(new Sheets.Point(adjustedRect.x, adjustedRect.y));
                            if (location.x !== comment.location().x || location.x !== comment.location().y)
                            {
                                sheet._doCommand(new Sheets.UndoRedo.CommentPropertyUndoAction(sheet, comment, comment.location().clone(), location, "location"))
                            }
                        }
                        else
                        {
                            comment._autoSize = false;
                            var resizeRect;
                            switch (mouseCapture.resizeDirct)
                            {
                                case 0:
                                    resizeRect = self._getCommentTopLeftResizeRect(offsetX, offsetY);
                                    break;
                                case 1:
                                    resizeRect = self._getCommentTopRightResizeRect(offsetX, offsetY);
                                    break;
                                case 2:
                                    resizeRect = self._getCommentBottomLeftResizeRect(offsetX, offsetY);
                                    break;
                                case 3:
                                    resizeRect = self._getCommentBottomRightResizeRect(offsetX, offsetY);
                                    break;
                                case 4:
                                    resizeRect = self._getCommentMiddleLeftResizeRect(offsetX);
                                    break;
                                case 5:
                                    resizeRect = self._getCommentMiddleRightResizeRect(offsetX);
                                    break;
                                case 6:
                                    resizeRect = self._getCommentTopCenterResizeRect(offsetY);
                                    break;
                                case 7:
                                    resizeRect = self._getCommentBottomCenterResizeRect(offsetY);
                                    break
                            }
                            var absoluteLocation = self._convertRelLocationToAbsLocation(new Sheets.Point(resizeRect.x, resizeRect.y));
                            var adjustedRect = self._getAdjustedCommentRect(absoluteLocation, resizeRect.width, resizeRect.height);
                            var location = self._convertAbsLocationToRelLocation(new Sheets.Point(adjustedRect.x, adjustedRect.y));
                            var transaction = new Sheets.UndoRedo.CommentUndoTransaction;
                            if (location.x !== comment.location().x || location.y !== comment.location().y)
                            {
                                transaction.add(new Sheets.UndoRedo.CommentPropertyUndoAction(sheet, comment, comment.location().clone(), location, "location"))
                            }
                            if (adjustedRect.width !== comment.width())
                            {
                                transaction.add(new Sheets.UndoRedo.CommentPropertyUndoAction(sheet, comment, comment.width(), adjustedRect.width, "width"))
                            }
                            if (adjustedRect.height !== comment.height())
                            {
                                transaction.add(new Sheets.UndoRedo.CommentPropertyUndoAction(sheet, comment, comment.height(), adjustedRect.height, "height"))
                            }
                            sheet._doCommand(transaction)
                        }
                    }
                };
                CommentView.prototype._doMouseMove = function(event)
                {
                    var self = this,
                        sheet = self._comment._sheet;
                    this._setCursorState(event);
                    if (sheet.getSelections() && sheet.getSelections().length > 0)
                    {
                        return
                    }
                    if (self._touchManager && !event.isTouch && self._touchManager.preProcessMouseMove(event))
                    {
                        Sheets.util.cancelDefault(event);
                        return
                    }
                    if (self._touchContentManager && !event.isTouch && self._touchContentManager.preProcessMouseMove(event))
                    {
                        Sheets.util.cancelDefault(event);
                        return
                    }
                    var commentManager = self._commentManager,
                        target = event.target;
                    var eventHandler = sheet._eventHandler,
                        canvasOffset = eventHandler._getCanvasOffset();
                    var point = new Sheets.Point(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top);
                    if (target)
                    {
                        if (commentManager._mouseCapture.capture)
                        {
                            if (self._moveResizeContainerDom)
                            {
                                self._doMoveResizeContainer(event)
                            }
                            if (self._rowViewportIndex === 1)
                            {
                                eventHandler.mousePosition.y = point.y
                            }
                            if (self._columnViewportIndex === 1)
                            {
                                eventHandler.mousePosition.x = point.x
                            }
                            eventHandler.continueScroll()
                        }
                    }
                    return Sheets.util.cancelDefault(event)
                };
                CommentView.prototype._doMouseUp = function(event)
                {
                    var self = this,
                        sheet = self._comment._sheet;
                    if (sheet.getSelections() && sheet.getSelections().length > 0)
                    {
                        return
                    }
                    if (self._touchManager && !event.isTouch && self._touchManager.preProcessMouseUp(event))
                    {
                        Sheets.util.cancelDefault(event);
                        return
                    }
                    if (self._touchContentManager && !event.isTouch && self._touchContentManager.preProcessMouseUp(event))
                    {
                        Sheets.util.cancelDefault(event);
                        return
                    }
                    var target = event.target,
                        commentManager = self._commentManager;
                    var eventHandler = sheet._eventHandler;
                    eventHandler.isCommentWorking = false;
                    eventHandler.stopScroll();
                    if (target)
                    {
                        self._doMoveResizeComment(event);
                        if (self._moveResizePanelDom)
                        {
                            $(self._moveResizePanelDom).remove();
                            self._moveResizePanelDom = null;
                            self._isMoving = false;
                            self._isResizing = false
                        }
                        self._unhandleDocumentMouseMove();
                        commentManager._mouseCapture.capture = false;
                        self._setCursorState(event)
                    }
                    return Sheets.util.cancelDefault(event)
                };
                CommentView.prototype._getResizeDirection = function(event)
                {
                    var self = this;
                    if (self._resizeHitRects.length > 0 && (self._adornerDrawState === 1 || self._adornerDrawState === 2))
                    {
                        var target = event.target,
                            x = event.pageX - $(target).offset().left,
                            y = event.pageY - $(target).offset().top;
                        var resizeHitRect = self._resizeHitRects[0];
                        if (resizeHitRect && resizeHitRect.contains(x, y))
                        {
                            return 0
                        }
                        resizeHitRect = self._resizeHitRects[1];
                        if (resizeHitRect && resizeHitRect.contains(x, y))
                        {
                            return 1
                        }
                        resizeHitRect = self._resizeHitRects[2];
                        if (resizeHitRect && resizeHitRect.contains(x, y))
                        {
                            return 2
                        }
                        resizeHitRect = self._resizeHitRects[3];
                        if (resizeHitRect && resizeHitRect.contains(x, y))
                        {
                            return 3
                        }
                        resizeHitRect = self._resizeHitRects[4];
                        if (resizeHitRect && resizeHitRect.contains(x, y))
                        {
                            return 4
                        }
                        resizeHitRect = self._resizeHitRects[5];
                        if (resizeHitRect && resizeHitRect.contains(x, y))
                        {
                            return 5
                        }
                        resizeHitRect = self._resizeHitRects[6];
                        if (resizeHitRect && resizeHitRect.contains(x, y))
                        {
                            return 6
                        }
                        resizeHitRect = self._resizeHitRects[7];
                        if (resizeHitRect && resizeHitRect.contains(x, y))
                        {
                            return 7
                        }
                    }
                    return -100
                };
                CommentView.prototype._getCommentTopLeftResizeRect = function(offsetX, offsetY)
                {
                    var self = this;
                    var x,
                        y,
                        width,
                        height;
                    var mouseCapture = self._commentManager._mouseCapture;
                    var resizeHostWidth = (mouseCapture.cachedRect.width - 2 * self._hostMargin) - offsetX,
                        resizeHostHeight = (mouseCapture.cachedRect.height - 2 * self._hostMargin) - offsetY;
                    if (resizeHostWidth >= 0)
                    {
                        x = mouseCapture.cachedRect.x + offsetX;
                        width = resizeHostWidth + 2 * self._hostMargin
                    }
                    else
                    {
                        x = mouseCapture.cachedRect.x + mouseCapture.cachedRect.width - 2 * self._hostMargin;
                        width = -resizeHostWidth + 2 * self._hostMargin
                    }
                    if (resizeHostHeight >= 0)
                    {
                        y = mouseCapture.cachedRect.y + offsetY;
                        height = resizeHostHeight + 2 * self._hostMargin
                    }
                    else
                    {
                        y = mouseCapture.cachedRect.y + mouseCapture.cachedRect.height - 2 * self._hostMargin;
                        height = -resizeHostHeight + 2 * self._hostMargin
                    }
                    return new Sheets.Rect(x, y, width, height)
                };
                CommentView.prototype._getCommentTopRightResizeRect = function(offsetX, offsetY)
                {
                    var self = this;
                    var x,
                        y,
                        width,
                        height;
                    var mouseCapture = self._commentManager._mouseCapture;
                    var resizeHostWidth = (mouseCapture.cachedRect.width - 2 * self._hostMargin) + offsetX,
                        resizeHostHeight = (mouseCapture.cachedRect.height - 2 * self._hostMargin) - offsetY;
                    if (resizeHostWidth >= 0)
                    {
                        x = mouseCapture.cachedRect.x;
                        width = resizeHostWidth + 2 * self._hostMargin
                    }
                    else
                    {
                        x = mouseCapture.cachedRect.x + resizeHostWidth;
                        width = -resizeHostWidth + 2 * self._hostMargin
                    }
                    if (resizeHostHeight >= 0)
                    {
                        y = mouseCapture.cachedRect.y + offsetY;
                        height = resizeHostHeight + 2 * self._hostMargin
                    }
                    else
                    {
                        y = mouseCapture.cachedRect.y + mouseCapture.cachedRect.height - 2 * self._hostMargin;
                        height = -resizeHostHeight + 2 * self._hostMargin
                    }
                    return new Sheets.Rect(x, y, width, height)
                };
                CommentView.prototype._getCommentBottomLeftResizeRect = function(offsetX, offsetY)
                {
                    var self = this;
                    var x,
                        y,
                        width,
                        height;
                    var mouseCapture = self._commentManager._mouseCapture;
                    var resizeHostWidth = (mouseCapture.cachedRect.width - 2 * self._hostMargin) - offsetX,
                        resizeHostHeight = (mouseCapture.cachedRect.height - 2 * self._hostMargin) + offsetY;
                    if (resizeHostWidth >= 0)
                    {
                        x = mouseCapture.cachedRect.x + offsetX;
                        width = resizeHostWidth + 2 * self._hostMargin
                    }
                    else
                    {
                        x = mouseCapture.cachedRect.x + mouseCapture.cachedRect.width - 2 * self._hostMargin;
                        width = -resizeHostWidth + 2 * self._hostMargin
                    }
                    if (resizeHostHeight >= 0)
                    {
                        y = mouseCapture.cachedRect.y;
                        height = resizeHostHeight + 2 * self._hostMargin
                    }
                    else
                    {
                        y = mouseCapture.cachedRect.y + resizeHostHeight;
                        height = -resizeHostHeight + 2 * self._hostMargin
                    }
                    return new Sheets.Rect(x, y, width, height)
                };
                CommentView.prototype._getCommentBottomRightResizeRect = function(offsetX, offsetY)
                {
                    var self = this;
                    var x,
                        y,
                        width,
                        height;
                    var mouseCapture = self._commentManager._mouseCapture;
                    var resizeHostWidth = (mouseCapture.cachedRect.width - 2 * self._hostMargin) + offsetX,
                        resizeHostHeight = (mouseCapture.cachedRect.height - 2 * self._hostMargin) + offsetY;
                    if (resizeHostWidth >= 0)
                    {
                        x = mouseCapture.cachedRect.x;
                        width = resizeHostWidth + 2 * self._hostMargin
                    }
                    else
                    {
                        x = mouseCapture.cachedRect.x + resizeHostWidth;
                        width = -resizeHostWidth + 2 * self._hostMargin
                    }
                    if (resizeHostHeight >= 0)
                    {
                        y = mouseCapture.cachedRect.y;
                        height = resizeHostHeight + 2 * self._hostMargin
                    }
                    else
                    {
                        y = mouseCapture.cachedRect.y + resizeHostHeight;
                        height = -resizeHostHeight + 2 * self._hostMargin
                    }
                    return new Sheets.Rect(x, y, width, height)
                };
                CommentView.prototype._getCommentMiddleLeftResizeRect = function(offsetX)
                {
                    var self = this;
                    var x,
                        y,
                        width,
                        height;
                    var mouseCapture = self._commentManager._mouseCapture;
                    var resizeHostWidth = (mouseCapture.cachedRect.width - 2 * self._hostMargin) - offsetX;
                    if (resizeHostWidth >= 0)
                    {
                        x = mouseCapture.cachedRect.x + offsetX;
                        width = resizeHostWidth + 2 * self._hostMargin
                    }
                    else
                    {
                        x = mouseCapture.cachedRect.x + mouseCapture.cachedRect.width - 2 * self._hostMargin;
                        width = -resizeHostWidth + 2 * self._hostMargin
                    }
                    y = mouseCapture.cachedRect.y;
                    height = mouseCapture.cachedRect.height;
                    return new Sheets.Rect(x, y, width, height)
                };
                CommentView.prototype._getCommentMiddleRightResizeRect = function(offsetX)
                {
                    var self = this;
                    var x,
                        y,
                        width,
                        height;
                    var mouseCapture = self._commentManager._mouseCapture;
                    var resizeHostWidth = (mouseCapture.cachedRect.width - 2 * self._hostMargin) + offsetX;
                    if (resizeHostWidth >= 0)
                    {
                        x = mouseCapture.cachedRect.x;
                        width = resizeHostWidth + 2 * self._hostMargin
                    }
                    else
                    {
                        x = mouseCapture.cachedRect.x + resizeHostWidth;
                        width = -resizeHostWidth + 2 * self._hostMargin
                    }
                    y = mouseCapture.cachedRect.y;
                    height = mouseCapture.cachedRect.height;
                    return new Sheets.Rect(x, y, width, height)
                };
                CommentView.prototype._getCommentTopCenterResizeRect = function(offsetY)
                {
                    var self = this;
                    var x,
                        y,
                        width,
                        height;
                    var mouseCapture = self._commentManager._mouseCapture;
                    var resizeHostHeight = (mouseCapture.cachedRect.height - 2 * self._hostMargin) - offsetY;
                    x = mouseCapture.cachedRect.x;
                    width = mouseCapture.cachedRect.width;
                    if (resizeHostHeight >= 0)
                    {
                        y = mouseCapture.cachedRect.y + offsetY;
                        height = resizeHostHeight + 2 * self._hostMargin
                    }
                    else
                    {
                        y = mouseCapture.cachedRect.y + mouseCapture.cachedRect.height - 2 * self._hostMargin;
                        height = -resizeHostHeight + 2 * self._hostMargin
                    }
                    return new Sheets.Rect(x, y, width, height)
                };
                CommentView.prototype._getCommentBottomCenterResizeRect = function(offsetY)
                {
                    var self = this;
                    var x,
                        y,
                        width,
                        height;
                    var mouseCapture = self._commentManager._mouseCapture;
                    var resizeHostHeight = (mouseCapture.cachedRect.height - 2 * self._hostMargin) + offsetY;
                    x = mouseCapture.cachedRect.x;
                    width = mouseCapture.cachedRect.width;
                    if (resizeHostHeight >= 0)
                    {
                        y = mouseCapture.cachedRect.y;
                        height = resizeHostHeight + 2 * self._hostMargin
                    }
                    else
                    {
                        y = mouseCapture.cachedRect.y + resizeHostHeight;
                        height = -resizeHostHeight + 2 * self._hostMargin
                    }
                    return new Sheets.Rect(x, y, width, height)
                };
                CommentView.prototype._attachMouseWheelEvent = function(targetDom)
                {
                    var self = this,
                        sheet = this._comment._sheet;
                    if (targetDom)
                    {
                        var ns = "";
                        switch (targetDom)
                        {
                            case self._floatBlockCanvas:
                                ns = ".floatBlockCanvas";
                            case self._hostContainer:
                                ns = ".hostContainer";
                            case self._lineCanvasContainer:
                                ns = ".lineCanvasContainer";
                            case self._host:
                                ns = ".host";
                            case self._editor:
                                ns = ".editor"
                        }
                        if (ns)
                        {
                            $(targetDom).unbind("gcmousewheel" + ns);
                            $(targetDom).bind("gcmousewheel" + ns, function(event)
                            {
                                sheet._mouseWheelDelegate(event.originalEvent);
                                Sheets.util.cancelDefault(event)
                            })
                        }
                    }
                };
                CommentView.prototype._attachFloatBlockCanvasEventHandler = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment && comment._sheet;
                    self._detachFloatBlockCanvasEventHandler();
                    var ns = ".floatBlockCanvas";
                    $(self._floatBlockCanvas).bind("mousedown" + ns, function(event)
                    {
                        self._doMouseDownToDragOrResize(event)
                    }).bind("mousemove" + ns, function(event)
                    {
                        self._doMouseMove(event)
                    }).bind("mouseup" + ns, function(event)
                    {
                        self._doMouseUp(event)
                    }).bind("gcmousewheel" + ns, function(event)
                    {
                        if (sheet)
                        {
                            sheet._mouseWheelDelegate(event.originalEvent)
                        }
                    })
                };
                CommentView.prototype._detachFloatBlockCanvasEventHandler = function()
                {
                    var self = this;
                    $(self._floatBlockCanvas).unbind(".floatBlockCanvas")
                };
                CommentView.prototype._attachHostContainerEventHandler = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet;
                    self._detachHostContainerEventHandler();
                    var ns = ".hostContainer";
                    $(self._hostContainer).bind("mousedown" + ns, function(event)
                    {
                        self._doMouseDownToDragOrResize(event)
                    }).bind("mousemove" + ns, function(event)
                    {
                        self._doMouseMove(event)
                    }).bind("mouseup" + ns, function(event)
                    {
                        self._doMouseUp(event)
                    }).bind("gcmousewheel" + ns, function(event)
                    {
                        if (sheet)
                        {
                            sheet._mouseWheelDelegate(event.originalEvent)
                        }
                    })
                };
                CommentView.prototype._detachHostContainerEventHandler = function()
                {
                    var self = this;
                    $(self._hostContainer).unbind(".hostContainer")
                };
                CommentView.prototype._attachLineCanvasEventHandler = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet,
                        commentManager = sheet._commentManager;
                    self._detachLineCanvasEventHandler();
                    if (!sheet)
                    {
                        return
                    }
                    var canvasOffset = sheet._eventHandler._getCanvasOffset();
                    var ns = ".lineCanvas";
                    $(self._lineCanvas).bind("mousedown" + ns, function(event)
                    {
                        var hitTestInfo = sheet.hitTest(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top);
                        var commentHitInfo = hitTestInfo.commentHitInfo;
                        if (commentHitInfo)
                        {
                            var hitTestComment = commentHitInfo.comment;
                            var hitTestCommentView = commentManager.getCommentView(hitTestComment);
                            if (commentHitInfo.area === "editArea")
                            {
                                hitTestCommentView._doMouseDownToEdit(event)
                            }
                            else if (commentHitInfo.area === "moveResizeArea")
                            {
                                hitTestCommentView._doMouseDownToDragOrResize(event)
                            }
                            $(hitTestCommentView._floatBlockCanvasContainer).css("z-index", parseInt($(self._lineCanvasContainer).css("z-index") + 1))
                        }
                        else
                        {
                            sheet._mouseDownDelegate(event)
                        }
                    }).bind("mousemove" + ns, function(event)
                    {
                        var hitTestInfo = sheet.hitTest(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top);
                        var commentHitInfo = hitTestInfo.commentHitInfo;
                        if (commentHitInfo)
                        {
                            var hitTestComment = commentHitInfo.comment;
                            var hitTestCommentView = commentManager.getCommentView(hitTestComment);
                            hitTestCommentView._doMouseMove(event);
                            if (commentHitInfo.area === "editArea")
                            {
                                self._lineCanvas.style.cursor = "text"
                            }
                            else if (commentHitInfo.area === "moveResizeArea")
                            {
                                self._lineCanvas.style.cursor = "move"
                            }
                        }
                        else
                        {
                            sheet._mouseMoveDelegate(event);
                            var canvas = sheet._getCanvas();
                            if (canvas)
                            {
                                self._lineCanvas.style.cursor = canvas.style.cursor
                            }
                        }
                    }).bind("mouseup" + ns, function(event)
                    {
                        var hitTestInfo = sheet.hitTest(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top);
                        var commentHitInfo = hitTestInfo.commentHitInfo;
                        if (commentHitInfo)
                        {
                            var hitTestComment = commentHitInfo.comment;
                            var hitTestCommentView = commentManager.getCommentView(hitTestComment);
                            hitTestCommentView._doMouseUp(event)
                        }
                        else
                        {
                            sheet._mouseUpDelegate(event)
                        }
                    }).bind("dblclick" + ns, function(event)
                    {
                        sheet._dblClickDelegate(event)
                    }).bind("gcmousewheel" + ns, function(event)
                    {
                        sheet._mouseWheelDelegate(event.originalEvent)
                    })
                };
                CommentView.prototype._detachLineCanvasEventHandler = function()
                {
                    var self = this;
                    $(self._lineCanvas).unbind(".lineCanvas")
                };
                CommentView.prototype._attachHostEventHandler = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet;
                    if (comment.commentState() !== 2 && self._host)
                    {
                        self._detachHostEventHandler();
                        var ns = ".host";
                        $(self._host).bind("mousedown" + ns, function(event)
                        {
                            self._doMouseDownToEdit(event)
                        }).bind("mousemove" + ns, function(event)
                        {
                            self._doMouseMove(event)
                        }).bind("mouseup" + ns, function(event)
                        {
                            self._doMouseUp(event)
                        }).bind("gcmousewheel" + ns, function(event)
                        {
                            if (sheet)
                            {
                                sheet._mouseWheelDelegate(event.originalEvent)
                            }
                        })
                    }
                };
                CommentView.prototype._detachHostEventHandler = function()
                {
                    var self = this,
                        comment = self._comment;
                    if (comment.commentState() !== 2 && self._host)
                    {
                        $(self._host).unbind(".host")
                    }
                };
                CommentView.prototype._attachEditorEventHandler = function()
                {
                    var self = this,
                        comment = self._comment,
                        sheet = comment && comment._sheet;
                    var editor = self._editor;
                    if (comment.commentState() === 2 && editor)
                    {
                        this._detachEditorEventHandler();
                        var ns = ".editor";
                        $(editor).bind("mousedown" + ns, function(event)
                        {
                            event.stopPropagation()
                        }).bind("mousemove" + ns, function(event)
                        {
                            event.stopPropagation()
                        }).bind("mouseup" + ns, function(event)
                        {
                            event.stopPropagation()
                        }).bind("gcmousewheel" + ns, function(event)
                        {
                            if (sheet)
                            {
                                sheet._mouseWheelDelegate(event.originalEvent)
                            }
                        }).bind("input" + ns, function(event)
                        {
                            if (comment.autoSize())
                            {
                                self._doAutosize()
                            }
                        }).bind("keydown" + ns, function(event)
                        {
                            if (event.keyCode === 27 || event.keyCode === 9)
                            {
                                comment.commentState(1);
                                Sheets.util.cancelDefault(event);
                                Sheets.FocusHelper.setActiveElement(sheet)
                            }
                        })
                    }
                };
                CommentView.prototype._doAutosize = function()
                {
                    var self = this;
                    var comment = self._comment,
                        sheet = comment && comment._sheet;
                    var targetDOM,
                        lines;
                    if (comment.commentState() === 2)
                    {
                        targetDOM = self._editor;
                        lines = targetDOM.value.split('\n')
                    }
                    else
                    {
                        targetDOM = self._host;
                        lines = targetDOM.innerHTML.split('<br>')
                    }
                    var oldHeight = $(targetDOM).height(),
                        oldWidth = $(targetDOM).width(),
                        newHeight,
                        newWidth;
                    var lineHeight = 0;
                    var style = targetDOM.style;
                    var font = "";
                    if (style.font)
                    {
                        lineHeight = sheet._getFontHeight(style.font);
                        font += style.font
                    }
                    else
                    {
                        if (comment.fontStyle())
                        {
                            font += " " + comment.fontStyle()
                        }
                        if (comment.fontWeight())
                        {
                            font += " " + comment.fontWeight()
                        }
                        if (comment.fontSize())
                        {
                            font += " " + comment.fontSize()
                        }
                        if (comment.fontFamily())
                        {
                            font += " " + comment.fontFamily()
                        }
                        lineHeight = sheet._getFontHeight(font)
                    }
                    var minHeight = lineHeight,
                        minWidth = 5;
                    if (lines && lines.length > 0)
                    {
                        newHeight = Math_max(lines.length * lineHeight, minHeight);
                        var maxLineWidth = 0;
                        for (var i = 0; i < lines.length; i++)
                        {
                            var lineWidth = sheet._getStringWidth(lines[i], font);
                            if (maxLineWidth < lineWidth)
                            {
                                maxLineWidth = lineWidth
                            }
                        }
                        newWidth = Math_max(maxLineWidth, minWidth)
                    }
                    else
                    {
                        newHeight = minHeight;
                        newWidth = minWidth
                    }
                    $(targetDOM).css("height", newHeight).css("width", newWidth);
                    if (comment.commentState() === 2)
                    {
                        comment._text = targetDOM.value
                    }
                    self._isAutosizing = true;
                    var heightOffset = newHeight - oldHeight;
                    if (heightOffset !== 0)
                    {
                        comment._changeProperty("height", comment.height() + heightOffset)
                    }
                    var widthOffset = newWidth - oldWidth;
                    if (widthOffset !== 0)
                    {
                        comment._changeProperty("width", comment.width() + widthOffset)
                    }
                    self._isAutosizing = false
                };
                CommentView.prototype._detachEditorEventHandler = function()
                {
                    var self = this,
                        comment = self._comment,
                        editor = self._editor;
                    if (comment.commentState() === 2 && editor)
                    {
                        $(editor).unbind(".editor")
                    }
                };
                CommentView.prototype._handleDocumentMouseMove = function()
                {
                    var self = this,
                        mouseCapture = this._commentManager._mouseCapture;
                    if (!mouseCapture.capture)
                    {
                        var ns = ".gcComment";
                        $(document).bind("mousemove" + ns, function(e)
                        {
                            self._doMouseMove(e)
                        }).bind("mouseup" + ns, function(e)
                        {
                            self._doMouseUp(e)
                        });
                        mouseCapture.capture = true
                    }
                };
                CommentView.prototype._unhandleDocumentMouseMove = function()
                {
                    var mouseCapture = this._commentManager._mouseCapture;
                    if (mouseCapture.capture)
                    {
                        mouseCapture.capture = false;
                        $(document).unbind(".gcComment")
                    }
                };
                return CommentView
            })();
        Sheets.CommentView = CommentView;
        var CommentManager = (function()
            {
                function CommentManager(sheet)
                {
                    var self = this;
                    self._sheet = sheet;
                    self._mouseCapture = {
                        capture: false, x: 0, y: 0, cachedRect: keyword_null, resizeDirct: -100
                    };
                    self._editorDom = keyword_null;
                    self._hoverShowComment = keyword_null;
                    self._activeComment = keyword_null;
                    self._commentList = [];
                    self._commentViewList = [];
                    self.createEditDom();
                    self._bindEventsOnSheet()
                }
                CommentManager.prototype.createEditDom = function()
                {
                    var textArea = document.createElement("textarea");
                    $(textArea).addClass("gc-comment-editor").css("left", 0).css("top", 0).css("position", "absolute").css("margin", 0).css("padding", 0).css("word-wrap", "break-word").css("word-break", "normal").css("overflow", "hidden").css("resize", "none").css("outline", "none").css("border", "0px").attr("autocomplete", "off").attr("gcUIElement", "gcEditingInput");
                    this._editorDom = textArea
                };
                CommentManager.prototype.getCommentList = function()
                {
                    var self = this,
                        commentList = [];
                    for (var i = 0; i < self._commentList.length; i++)
                    {
                        commentList.push(self._commentList[i])
                    }
                    return commentList
                };
                CommentManager.prototype.getHoverShownComment = function()
                {
                    return this._hoverShowComment
                };
                CommentManager.prototype._bindEventsOnSheet = function()
                {
                    var self = this,
                        sheet = self._sheet;
                    if (!sheet)
                    {
                        return
                    }
                    sheet._bind(Sheets.Events.ColumnChanged, function(event, data)
                    {
                        var propertyName = data.propertyName;
                        if (propertyName === 'width' || propertyName === 'isVisible')
                        {
                            self._updateCommentsLayoutWhenRowColumnChanged()
                        }
                    });
                    sheet._bind(Sheets.Events.RowChanged, function(event, data)
                    {
                        var propertyName = data.propertyName;
                        if (propertyName === 'height' || propertyName === 'isVisible')
                        {
                            self._updateCommentsLayoutWhenRowColumnChanged()
                        }
                    });
                    sheet._bind(Sheets.Events.ColumnWidthChanged, function(event, data)
                    {
                        self._updateCommentsLayoutWhenRowColumnChanged()
                    });
                    sheet._bind(Sheets.Events.RowHeightChanged, function(event, data)
                    {
                        self._updateCommentsLayoutWhenRowColumnChanged()
                    });
                    sheet._bind(Sheets.Events.CommentChanged, function(event, data)
                    {
                        var propertyName = data && data.propertyName;
                        var commentView = self.getCommentView(data.comment);
                        if (!commentView)
                        {
                            return
                        }
                        if (propertyName === "location")
                        {
                            commentView.updateLayoutWhenLocationChanged()
                        }
                        else if (propertyName === "width" || propertyName === "height")
                        {
                            commentView.updateLayoutWhenWidthHeightChanged()
                        }
                    })
                };
                CommentManager.prototype._addCommentView = function(commentView)
                {
                    var self = this;
                    if (commentView && Sheets.ArrayHelper.indexOf(self._commentViewList, commentView) === -1)
                    {
                        this._commentViewList.push(commentView)
                    }
                };
                CommentManager.prototype._removeCommentView = function(commentView)
                {
                    this._commentViewList.splice(Sheets.ArrayHelper.indexOf(this._commentViewList, commentView), 1)
                };
                CommentManager.prototype.getCommentView = function(comment)
                {
                    if (!comment)
                    {
                        return keyword_null
                    }
                    for (var i = 0; i < this._commentViewList.length; i++)
                    {
                        var commentView = this._commentViewList[i];
                        if (commentView.getComment() === comment)
                        {
                            return commentView
                        }
                    }
                    return keyword_null
                };
                CommentManager.prototype.hasComment = function()
                {
                    return this._commentList.length > 0
                };
                CommentManager.prototype.addComment = function(row, col, comment)
                {
                    var self = this;
                    if (comment && !self.containsComment(comment))
                    {
                        comment._sheet = self._sheet;
                        comment._rowIndex = row;
                        comment._colIndex = col;
                        comment._zIndex = 898;
                        self._updateCommentZIndex();
                        self._commentList.push(comment);
                        self._sheet.invalidate()
                    }
                };
                CommentManager.prototype._updateCommentZIndex = function()
                {
                    var self = this,
                        commentList = self._commentList;
                    for (var i = 0; i < commentList.length; i++)
                    {
                        commentList[i]._zIndex--
                    }
                };
                CommentManager.prototype._getTopCommentZIndex = function()
                {
                    var self = this;
                    if (self._commentList.length > 0)
                    {
                        var topCommentZindex = self._commentList[0].zIndex();
                        for (var i = 1; i < self._commentList.length; i++)
                        {
                            var comment = self._commentList[i];
                            if (topCommentZindex < comment.zIndex())
                            {
                                topCommentZindex = comment.zIndex()
                            }
                        }
                        return topCommentZindex
                    }
                    return 0
                };
                CommentManager.prototype.removeComment = function(comment)
                {
                    var self = this,
                        commentList = self._commentList;
                    if (comment)
                    {
                        self.hideComment(comment);
                        commentList.splice(Sheets.ArrayHelper.indexOf(commentList, comment), 1);
                        var commentView = self.getCommentView(comment);
                        if (commentView)
                        {
                            self._removeCommentView(commentView)
                        }
                    }
                };
                CommentManager.prototype.containsComment = function(comment)
                {
                    var self = this;
                    if (Sheets.ArrayHelper.indexOf(self._commentList, comment) !== -1)
                    {
                        return true
                    }
                    return false
                };
                CommentManager.prototype.clear = function(row, column, rowCount, columnCount)
                {
                    var self = this,
                        sheet = self._sheet;
                    var oldState = sheet.isPaintSuspended();
                    sheet.isPaintSuspended(true);
                    for (var i = 0; i < rowCount; i++)
                    {
                        for (var j = 0; j < columnCount; j++)
                        {
                            var comment = sheet.getComment(i + row, j + column);
                            if (comment)
                            {
                                self.removeComment(comment);
                                sheet.setComment(i + row, j + column, keyword_null)
                            }
                        }
                    }
                    sheet.isPaintSuspended(oldState)
                };
                CommentManager.prototype.addRows = function(row, rowCount)
                {
                    var self = this,
                        commentList = self._commentList,
                        commentViewList = self._commentViewList;
                    for (var i = 0; i < commentList.length; i++)
                    {
                        var comment = commentList[i];
                        if (row <= comment._rowIndex)
                        {
                            comment._rowIndex += rowCount
                        }
                    }
                    for (var i = 0; i < commentViewList.length; i++)
                    {
                        var commentView = commentViewList[i];
                        if (commentView.isOpen())
                        {
                            commentView.addRows(row, rowCount)
                        }
                    }
                };
                CommentManager.prototype.addColumns = function(column, columnCount)
                {
                    var self = this,
                        commentList = self._commentList,
                        commentViewList = self._commentViewList;
                    for (var i = 0; i < commentList.length; i++)
                    {
                        var comment = commentList[i];
                        if (column <= comment._colIndex)
                        {
                            comment._colIndex += columnCount
                        }
                    }
                    for (var i = 0; i < commentViewList.length; i++)
                    {
                        var commentView = commentViewList[i];
                        if (commentView.isOpen())
                        {
                            commentView.addColumns(column, columnCount)
                        }
                    }
                };
                CommentManager.prototype.removeRows = function(row, rowCount)
                {
                    var self = this,
                        commentList = self._commentList,
                        commentViewList = self._commentViewList;
                    for (var i = 0; i < commentList.length; i++)
                    {
                        var comment = commentList[i];
                        if (comment._rowIndex >= row && comment._rowIndex < row + rowCount)
                        {
                            self.removeComment(comment);
                            i--
                        }
                    }
                    for (var i = 0; i < commentList.length; i++)
                    {
                        var comment = commentList[i];
                        if (row < comment._rowIndex)
                        {
                            comment._rowIndex -= rowCount
                        }
                    }
                    for (var i = 0; i < commentViewList.length; i++)
                    {
                        var commentView = commentViewList[i];
                        if (commentView.isOpen())
                        {
                            commentView.removeRows(row, rowCount)
                        }
                    }
                };
                CommentManager.prototype.removeColumns = function(column, columnCount)
                {
                    var self = this,
                        commentList = self._commentList,
                        commentViewList = self._commentViewList;
                    for (var i = 0; i < commentList.length; i++)
                    {
                        var comment = commentList[i];
                        if (comment._colIndex >= column && comment._colIndex < column + columnCount)
                        {
                            self.removeComment(comment);
                            i--
                        }
                    }
                    for (var i = 0; i < commentList.length; i++)
                    {
                        var comment = commentList[i];
                        if (column < comment._colIndex)
                        {
                            comment._colIndex -= columnCount
                        }
                    }
                    for (var i = 0; i < commentViewList.length; i++)
                    {
                        var commentView = commentViewList[i];
                        if (commentView.isOpen())
                        {
                            commentView.removeColumns(column, columnCount)
                        }
                    }
                };
                CommentManager.prototype.getActiveComment = function()
                {
                    return this._activeComment
                };
                CommentManager.prototype.activateComment = function(comment)
                {
                    var self = this;
                    if (comment && comment !== self._activeComment)
                    {
                        self.deactivateComment();
                        self._activeComment = comment
                    }
                };
                CommentManager.prototype.deactivateComment = function()
                {
                    var self = this,
                        activeComment = self._activeComment;
                    if (activeComment)
                    {
                        var commentView = self.getCommentView(activeComment);
                        if (commentView && !commentView._isMoving && !commentView._isResizing)
                        {
                            if (commentView.isEditing())
                            {
                                commentView.detachEditor()
                            }
                            activeComment.commentState(3);
                            self._activeComment = keyword_null
                        }
                    }
                };
                CommentManager.prototype.showComment = function(comment)
                {
                    var self = this;
                    if (comment)
                    {
                        var commentView = self.getCommentView(comment);
                        if (!commentView)
                        {
                            commentView = new CommentView(comment, self);
                            self._addCommentView(commentView)
                        }
                        commentView.open()
                    }
                };
                CommentManager.prototype.showAllComments = function()
                {
                    for (var i = 0; i < this._commentList.length; i++)
                    {
                        this.showComment(this._commentList[i])
                    }
                };
                CommentManager.prototype.showCommentLayoutPanel = function()
                {
                    var sheet = this._sheet;
                    $(sheet._commentRender._commentLayoutPanel).show()
                };
                CommentManager.prototype.hideComment = function(comment)
                {
                    var self = this,
                        commentView = self.getCommentView(comment);
                    if (commentView && commentView.isOpen())
                    {
                        commentView.close();
                        if (comment === self._activeComment)
                        {
                            self._sheet._loadAndSetSheetSelections()
                        }
                    }
                    clearTimeout(comment._timeout);
                    comment._timeout = keyword_null
                };
                CommentManager.prototype.hideAllComments = function()
                {
                    for (var i = 0; i < this._commentList.length; i++)
                    {
                        this.hideComment(this._commentList[i])
                    }
                };
                CommentManager.prototype.hideCommentLayoutPanel = function()
                {
                    var sheet = this._sheet;
                    $(sheet._commentRender._commentLayoutPanel).hide()
                };
                CommentManager.prototype.hoverShowComment = function(comment)
                {
                    var self = this,
                        activeComment = self._activeComment;
                    if (activeComment)
                    {
                        if (activeComment.displayMode() === 1)
                        {
                            if (activeComment.commentState() === 2)
                            {
                                return
                            }
                        }
                        else
                        {
                            if (activeComment.commentState() === 2 || activeComment.commentState() === 1)
                            {
                                return
                            }
                        }
                    }
                    if (comment !== self._hoverShowComment)
                    {
                        if (self._hoverShowComment)
                        {
                            self.hideComment(self._hoverShowComment)
                        }
                        if (comment && comment.displayMode() == 2)
                        {
                            if (!self._mouseCapture.capture && !comment._timeout)
                            {
                                self._hoverShowComment = comment;
                                comment._timeout = setTimeout(function()
                                {
                                    self.showComment(comment)
                                }, 200)
                            }
                        }
                        else
                        {
                            self._hoverShowComment = keyword_null
                        }
                    }
                };
                CommentManager.prototype._isHitTestComment = function(comment, x, y)
                {
                    var commentView = this.getCommentView(comment);
                    if (commentView)
                    {
                        var commentRect = commentView.getCommentRect();
                        if (commentRect)
                        {
                            return commentRect.contains(x, y)
                        }
                    }
                    return false
                };
                CommentManager.prototype._isHitTestCommentEditArea = function(comment, x, y)
                {
                    var commentView = this.getCommentView(comment);
                    if (commentView)
                    {
                        var commentEditAreaRect = commentView.getCommentEditAreaRect();
                        if (commentEditAreaRect)
                        {
                            return commentEditAreaRect.contains(x, y)
                        }
                    }
                    return false
                };
                CommentManager.prototype.getCommentHitInfo = function(x, y)
                {
                    var self = this;
                    var topComment = keyword_null;
                    for (var i = 0; i < self._commentList.length; i++)
                    {
                        var comment = self._commentList[i];
                        if (self._isHitTestComment(comment, x, y))
                        {
                            if (topComment)
                            {
                                if (comment.zIndex() > topComment.zIndex())
                                {
                                    topComment = comment
                                }
                            }
                            else
                            {
                                topComment = comment
                            }
                        }
                    }
                    if (topComment)
                    {
                        if (self._isHitTestCommentEditArea(topComment, x, y))
                        {
                            return {
                                    x: x, y: y, comment: topComment, area: "editArea"
                                }
                        }
                        else
                        {
                            return {
                                    x: x, y: y, comment: topComment, area: "moveResizeArea"
                                }
                        }
                    }
                    return keyword_null
                };
                CommentManager.prototype.getCommentActualZIndex = function(comment)
                {
                    var self = this,
                        sheet = self._sheet;
                    var topCommentZIndex = self._getTopCommentZIndex();
                    if (comment === self._hoverShowComment)
                    {
                        return topCommentZIndex + 2
                    }
                    else if (comment === self._activeComment)
                    {
                        return topCommentZIndex + 1
                    }
                    return comment.zIndex()
                };
                CommentManager.prototype._updateCommentsLayoutWhenRowColumnChanged = function()
                {
                    var commentViewList = this._commentViewList;
                    for (var i = 0; i < commentViewList.length; i++)
                    {
                        var commentView = commentViewList[i];
                        commentView.updateLayoutWhenRowColumnChanged()
                    }
                };
                CommentManager.prototype.updateCommentsLayoutWhenSheetScroll = function()
                {
                    var commentViewList = this._commentViewList;
                    for (var i = 0; i < commentViewList.length; i++)
                    {
                        var commentView = commentViewList[i];
                        commentView.updateLayoutWhenSheetScroll()
                    }
                };
                CommentManager.prototype.fromJSON = function(jsonData, isNoneSchema)
                {
                    if (!jsonData || jsonData.length === 0)
                    {
                        return
                    }
                    for (var i = 0; i < jsonData.length; i++)
                    {
                        var item = jsonData[i];
                        var comment = new Comment;
                        comment.fromJSON(item, isNoneSchema);
                        if (comment.commentState() !== 3)
                        {
                            this._activeComment = comment
                        }
                        this._sheet.setComment(comment._rowIndex, comment._colIndex, comment)
                    }
                };
                CommentManager.prototype.toJSON = function()
                {
                    var comments = this._commentList;
                    if (!comments || comments.length === 0)
                    {
                        return keyword_undefined
                    }
                    var jsonData = [];
                    for (var i = 0; i < comments.length; i++)
                    {
                        jsonData.push(comments[i].toJSON())
                    }
                    if (jsonData.length === 0)
                    {
                        return keyword_undefined
                    }
                    return jsonData
                };
                return CommentManager
            })();
        Sheets.CommentManager = CommentManager;
        var CommentRender = (function()
            {
                function CommentRender(containerDiv)
                {
                    this._sheet = keyword_null;
                    this.showWhenTouchMoveOrScroll = true;
                    var self = this;
                    self._commentLayoutPanel = self._createCommentLayoutPanel();
                    containerDiv.appendChild(self._commentLayoutPanel)
                }
                CommentRender.prototype._createCommentLayoutPanel = function()
                {
                    var self = this;
                    var commentLayoutPanel = document.createElement('div');
                    $(commentLayoutPanel).addClass("comment-layoutPanel").css("position", "absolute").css("left", 0).css("top", 0).css("height", 0).css("width", 0).css("overflow", "visible").css("z-index", 701);
                    return commentLayoutPanel
                };
                CommentRender.prototype.renderCommentFloatPanel = function(sheet)
                {
                    var self = this;
                    var st = self._sheet || sheet;
                    if (!st._commentManager.hasComment())
                    {
                        return
                    }
                    var sheetLayout = sheet._getSheetLayout();
                    $(self._commentLayoutPanel).css("left", sheetLayout.x + sheetLayout.rowHeaderWidth).css("top", sheetLayout.y + sheetLayout.colHeaderHeight);
                    if (self._sheet !== sheet)
                    {
                        var commentManager;
                        if (self._sheet)
                        {
                            commentManager = self._sheet._commentManager
                        }
                        if (commentManager)
                        {
                            var activeComment = commentManager.getActiveComment();
                            if (activeComment && activeComment.commentState() === 2)
                            {
                                activeComment._changeProperty("commentState", 1)
                            }
                        }
                        self._sheet = sheet
                    }
                };
                CommentRender.prototype.renderCommentCellAdorner = function(ctx, sheetArea, cell)
                {
                    var row = cell.row,
                        col = cell.col,
                        x = cell.x,
                        y = cell.y,
                        width = cell.width,
                        height = cell.height;
                    var self = this;
                    if (sheetArea === 3 && self._sheet)
                    {
                        var comment = self._sheet.getComment(row, col);
                        if (comment)
                        {
                            var redAngleSize = 6;
                            if (ctx && width > 0 && height > 0)
                            {
                                ctx.save();
                                ctx.rect(x, y, width, height);
                                ctx.clip();
                                ctx.fillStyle = "red";
                                ctx.beginPath();
                                ctx.moveTo(x + width - redAngleSize, y);
                                ctx.lineTo(x + width, y);
                                ctx.lineTo(x + width, y + redAngleSize);
                                ctx.lineTo(x + width - redAngleSize, y);
                                ctx.fill();
                                ctx.restore()
                            }
                        }
                    }
                };
                CommentRender.prototype.renderComment = function(commentManager)
                {
                    if (!this.showWhenTouchMoveOrScroll)
                    {
                        commentManager.hideCommentLayoutPanel();
                        return
                    }
                    else
                    {
                        commentManager.showCommentLayoutPanel()
                    }
                    var sheet = this._sheet,
                        comments = commentManager.getCommentList();
                    for (var i = 0; i < comments.length; i++)
                    {
                        var comment = comments[i];
                        var commentView = commentManager.getCommentView(comment);
                        if (this._canShowComment(commentManager, comment))
                        {
                            if (comment.displayMode() === 1 && comment === commentManager.getHoverShownComment())
                            {
                                commentManager._hoverShowComment = keyword_null
                            }
                            if (commentView && commentView.isOpen())
                            {
                                commentView.updateLayout()
                            }
                            else
                            {
                                commentManager.showComment(comment)
                            }
                        }
                        else
                        {
                            if (commentView && commentView.isOpen())
                            {
                                commentManager.hideComment(comment)
                            }
                        }
                    }
                    var activeComment = commentManager.getActiveComment();
                    if (activeComment)
                    {
                        var activeCommentView = commentManager.getCommentView(activeComment);
                        if (activeCommentView && activeCommentView.isOpen())
                        {
                            if (sheet.getSelections().length > 0)
                            {
                                sheet._selectionModel.clear()
                            }
                        }
                    }
                };
                CommentRender.prototype._canShowComment = function(commentManager, comment)
                {
                    var sheet = this._sheet;
                    if (sheet.getColumnWidth(comment._colIndex) && sheet.getRowHeight(comment._rowIndex))
                    {
                        switch (comment.displayMode())
                        {
                            case 1:
                                return true;
                            case 2:
                                if (comment.commentState() === 3)
                                {
                                    if (comment === commentManager.getHoverShownComment())
                                    {
                                        return true
                                    }
                                }
                                else
                                {
                                    if (commentManager && comment !== commentManager.getHoverShownComment())
                                    {
                                        commentManager._hoverShowComment = comment
                                    }
                                    return true
                                }
                        }
                    }
                    return false
                };
                return CommentRender
            })();
        Sheets.CommentRender = CommentRender
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

