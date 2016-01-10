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
        Sheets.feature("celltype", ["core.common", "core.sheet_action", "core.basecelltype"]);
        var const_undefined = "undefined",
            keyword_null = null,
            keyword_undefined = undefined,
            Math_max = Math.max,
            Math_min = Math.min,
            Math_floor = Math.floor,
            Math_round = Math.round;
        var document = window.document;
        var cssPosition = "position",
            cssAbsolute = "absolute",
            cssMargin = "margin",
            cssFont = "font",
            cssLeft = "left",
            cssRight = "right",
            cssTop = "top",
            cssBottom = "bottom",
            cssAlphabetic = "alphabetic",
            cssMiddle = "middle",
            cssCenter = "center",
            attrGcUIElement = "gcUIElement",
            attrTabIndex = "tabindex",
            cssNone = "none",
            zero = "0",
            gradientColorStop1 = "#F6FAFB",
            gradientColorStop2 = "#D2DBEB",
            buttonDownColor = "#34B4E3",
            buttonHoverColor = "#A6F4FF",
            _gcEditingInput = ".gcEditingInput",
            _keyDown_gcEditingInput = "keydown" + _gcEditingInput,
            _keyUp_gcEditingInput = "keyup" + _gcEditingInput,
            _mousedown_gcEditingInput = "mousedown" + _gcEditingInput,
            _mouseup_gcEditingInput = "mouseup" + _gcEditingInput,
            _mouseout_gcEditingInput = "mouseout" + _gcEditingInput,
            _mousemove_gcEditingInput = "mousemove" + _gcEditingInput,
            _click_gcEditingInput = "click" + _gcEditingInput,
            cssWidth = "width",
            cssHeight = "height",
            cssPadding = "padding",
            cssHidden = "hidden",
            cssVisibility = "visibility",
            cssWordWrap = "word-wrap",
            cssOverflow = "overflow",
            cssResize = "resize",
            cssBorder = "border",
            cssOutline = "outline",
            cssBoxShadow = "box-shadow",
            cssBoxSizing = "box-sizing",
            cssColor = "color",
            cssBorderWidth = "border-width",
            cssBorderStyle = "border-style",
            cssBorderColor = "border-color",
            cssWhiteSpace = "white-space",
            cssBackgroundColor = "background-color",
            cssZIndex = "z-index",
            cssMaxWidth = "max-width",
            cssMaxHeight = "max-height";
        (function(EditorValueType)
        {
            EditorValueType[EditorValueType["Text"] = 0] = "Text";
            EditorValueType[EditorValueType["Index"] = 1] = "Index";
            EditorValueType[EditorValueType["Value"] = 2] = "Value"
        })(Sheets.EditorValueType || (Sheets.EditorValueType = {}));
        var EditorValueType = Sheets.EditorValueType;
        (function(CheckBoxTextAlign)
        {
            CheckBoxTextAlign[CheckBoxTextAlign["top"] = 0] = "top";
            CheckBoxTextAlign[CheckBoxTextAlign["bottom"] = 1] = "bottom";
            CheckBoxTextAlign[CheckBoxTextAlign["left"] = 2] = "left";
            CheckBoxTextAlign[CheckBoxTextAlign["right"] = 3] = "right"
        })(Sheets.CheckBoxTextAlign || (Sheets.CheckBoxTextAlign = {}));
        var CheckBoxTextAlign = Sheets.CheckBoxTextAlign;
        (function(HyperLinkTargetType)
        {
            HyperLinkTargetType[HyperLinkTargetType["Blank"] = 0] = "Blank";
            HyperLinkTargetType[HyperLinkTargetType["Self"] = 1] = "Self";
            HyperLinkTargetType[HyperLinkTargetType["Parent"] = 2] = "Parent";
            HyperLinkTargetType[HyperLinkTargetType["Top"] = 3] = "Top"
        })(Sheets.HyperLinkTargetType || (Sheets.HyperLinkTargetType = {}));
        var HyperLinkTargetType = Sheets.HyperLinkTargetType;
        var CheckBoxCellType = (function(_super)
            {
                __extends(CheckBoxCellType, _super);
                function CheckBoxCellType()
                {
                    _super.call(this);
                    var self = this;
                    self.allowOverflow = false;
                    self.typeName = 5 + '';
                    self._checkboxSize = 12;
                    self._caption = "";
                    self._textTrue = "";
                    self._textIndeterminate = "";
                    self._textFalse = "";
                    self._textAlign = 3;
                    self._isThreeState = false
                }
                CheckBoxCellType.prototype.paintValue = function(ctx, value, x, y, w, h, style, options)
                {
                    if (!ctx)
                    {
                        return
                    }
                    ctx.save();
                    ctx.rect(x, y, w, h);
                    ctx.clip();
                    ctx.beginPath();
                    var self = this;
                    var text = this.getText(value, options);
                    var textWidth = 0,
                        textHeight = 0,
                        sheet = options.sheet;
                    if (sheet)
                    {
                        textWidth = sheet._getStringWidthByCanvas(text, style.font);
                        textHeight = sheet._getFontHeight(style.font);
                        if (text)
                        {
                            var lines = text.split(/\r\n|\r|\n/);
                            textHeight *= lines.length
                        }
                    }
                    var radius = self._checkboxSize / 2,
                        rect = new Sheets.Rect(++x, ++y, --w, --h),
                        startX = parseInt((x + self._getCheckBoxLeft(style, rect, textWidth)).toString()),
                        startY = parseInt((y + self._getCheckBoxTop(style, rect, textHeight)).toString());
                    var textAlign = cssLeft;
                    var textStartX = startX + 1;
                    if (style.hAlign === 1)
                    {
                        textAlign = cssCenter;
                        textStartX += radius
                    }
                    else if (style.hAlign === 2)
                    {
                        textAlign = cssRight;
                        textStartX += radius * 2
                    }
                    var font = style.font;
                    if (font && ctx.font !== font)
                    {
                        ctx.font = font
                    }
                    if (style.foreColor)
                    {
                        ctx.fillStyle = style.foreColor
                    }
                    var textDecoration = style.textDecoration,
                        fontSize = options.fontInfo.fontSize,
                        baselineOffset = fontSize > 8 ? Math_floor((fontSize - 8) / 5 + 2) : 1,
                        lineOffset = textHeight / 2 - fontSize / 2 + baselineOffset - 1;
                    if (ctx.textBaseline !== cssAlphabetic)
                    {
                        ctx.textBaseline = cssAlphabetic
                    }
                    if (self._textAlign === 2)
                    {
                        ctx.textAlign = cssRight;
                        ctx.fillText(text, startX + 1 - 2, startY + radius + textHeight / 2 - lineOffset);
                        if (textDecoration)
                        {
                            self._renderTextDecoration(ctx, textDecoration, startX + 1 - 2, startY + radius + textHeight / 2 - lineOffset, textWidth, fontSize, baselineOffset)
                        }
                    }
                    else if (self._textAlign === 0)
                    {
                        ctx.textAlign = textAlign;
                        ctx.fillText(text, textStartX, startY - 2 - lineOffset);
                        if (textDecoration)
                        {
                            self._renderTextDecoration(ctx, textDecoration, textStartX, startY - 2 - lineOffset, textWidth, textHeight)
                        }
                    }
                    ctx.strokeStyle = "black";
                    ctx.strokeRect(startX + 0.5, startY + 0.5, radius * 2 + 0.05, radius * 2 + 0.05);
                    ctx.fillStyle = "white";
                    ctx.fillRect(startX + 1, startY + 1, radius * 2 - 1, radius * 2 - 1);
                    if (self._isThreeState && (value === keyword_null || value === keyword_undefined))
                    {
                        ctx.beginPath();
                        ctx.fillStyle = "green";
                        ctx.rect(startX + 3, startY + 3, (radius - 2.5) * 2, (radius - 2.5) * 2);
                        ctx.fill()
                    }
                    else if (!!value === true)
                    {
                        ctx.beginPath();
                        ctx.lineWidth = 2.5;
                        ctx.moveTo(startX + 3, startY + radius);
                        ctx.lineTo(startX + radius, startY + radius * 2 - 3.5);
                        ctx.lineTo(startX + radius * 2 - 1.5, startY + 3);
                        ctx.stroke()
                    }
                    if (style.foreColor)
                    {
                        ctx.fillStyle = style.foreColor
                    }
                    if (self._textAlign === 3)
                    {
                        ctx.textAlign = cssLeft;
                        ctx.fillText(text, startX + 1 + radius * 2 + 2, startY + radius + textHeight / 2 - lineOffset);
                        if (textDecoration)
                        {
                            self._renderTextDecoration(ctx, textDecoration, startX + 1 + radius * 2 + 2, startY + radius + textHeight / 2 - lineOffset, textWidth, fontSize, baselineOffset)
                        }
                    }
                    else if (self._textAlign === 1)
                    {
                        ctx.textAlign = textAlign;
                        ctx.fillText(text, textStartX, startY + radius * 2 + 2 + textHeight - lineOffset);
                        if (textDecoration)
                        {
                            self._renderTextDecoration(ctx, textDecoration, textStartX, startY + radius * 2 + 2 + textHeight - lineOffset, textWidth, fontSize, baselineOffset)
                        }
                    }
                    ctx.restore()
                };
                CheckBoxCellType.prototype.getText = function(text, options)
                {
                    return this._getDisplayText(text)
                };
                CheckBoxCellType.prototype.focus = function(editorContext, context)
                {
                    if (editorContext)
                    {
                        editorContext.focus()
                    }
                };
                CheckBoxCellType.prototype._formatEditorValue = function(editorContext, cellStyle, value, context)
                {
                    return value
                };
                CheckBoxCellType.prototype._getCheckBoxLeft = function(cellStyle, cellRect, textWidth, isMargin)
                {
                    var x = cellRect.x - 1,
                        w = cellRect.width + 1,
                        totalWidth = 0,
                        startX = 0;
                    var self = this;
                    if (self._textAlign === 0 || self._textAlign === 1)
                    {
                        startX = x + 5;
                        if (cellStyle.hAlign === 1)
                        {
                            startX = x + (w / 2) - self._checkboxSize / 2
                        }
                        else if (cellStyle.hAlign === 2)
                        {
                            startX = x + w - 5 - self._checkboxSize
                        }
                    }
                    else if (self._textAlign === 2)
                    {
                        totalWidth = self._checkboxSize + textWidth;
                        startX = x + 5 + textWidth;
                        if (cellStyle.hAlign === 1)
                        {
                            startX = x + (w / 2) - totalWidth / 2 + textWidth
                        }
                        else if (cellStyle.hAlign === 2)
                        {
                            startX = x + w - 5 - totalWidth + textWidth
                        }
                    }
                    else
                    {
                        totalWidth = self._checkboxSize + textWidth;
                        startX = x + 5;
                        if (cellStyle.hAlign === 1)
                        {
                            startX = x + (w / 2) - totalWidth / 2
                        }
                        else if (cellStyle.hAlign === 2)
                        {
                            startX = x + w - 5 - totalWidth
                        }
                    }
                    var checkboxLeft = startX - x;
                    if (isMargin)
                    {
                        if ($.browser.msie)
                        {
                            checkboxLeft -= 3
                        }
                    }
                    return checkboxLeft
                };
                CheckBoxCellType.prototype._getCheckBoxTop = function(cellStyle, cellRect, textHeight, isMargin)
                {
                    var y = cellRect.y - 1,
                        h = cellRect.height + 1,
                        totalHeight = 0,
                        startY = 0;
                    var self = this;
                    if (self._textAlign === 0)
                    {
                        totalHeight = self._checkboxSize + textHeight;
                        startY = y + 5 + textHeight;
                        if (cellStyle.vAlign === 1)
                        {
                            startY = y + (h / 2) - totalHeight / 2 + textHeight
                        }
                        else if (cellStyle.vAlign === 2)
                        {
                            startY = y + h - 5 - totalHeight + textHeight
                        }
                    }
                    else if (self._textAlign === 1)
                    {
                        totalHeight = self._checkboxSize + textHeight;
                        startY = y + 5;
                        if (cellStyle.vAlign === 1)
                        {
                            startY = y + (h / 2) - totalHeight / 2
                        }
                        else if (cellStyle.vAlign === 2)
                        {
                            startY = y + h - 5 - totalHeight
                        }
                    }
                    else
                    {
                        startY = y + 5;
                        if (cellStyle.vAlign === 1)
                        {
                            startY = y + (h / 2) - self._checkboxSize / 2
                        }
                        else if (cellStyle.vAlign === 2)
                        {
                            startY = y + h - 5 - self._checkboxSize
                        }
                    }
                    var checkboxTop = startY - y;
                    if (isMargin)
                    {
                        if ($.browser.msie)
                        {
                            checkboxTop -= 3
                        }
                    }
                    return checkboxTop
                };
                CheckBoxCellType.prototype.createEditorElement = function(context)
                {
                    var div = document.createElement("div");
                    var host = context && context.sheet && context.sheet.parent && context.sheet.parent._host;
                    var zindex = Sheets.util.getPreferredZIndex(host) + 1000;
                    var $div = $(div);
                    $div.css(cssPosition, cssAbsolute).css(cssMargin, zero).css(cssPadding, zero).css(cssOverflow, cssHidden).css(cssResize, cssNone).css(cssBorder, "2px #5292f7 solid").css(cssOutline, cssNone).css(cssBoxShadow, "1px 2px 5px rgba(0,0,0,0.4)").css(cssBoxSizing, "content-box").css(cssZIndex, zindex).attr(attrTabIndex, 1).attr(attrGcUIElement, "gcEditingInput");
                    var $input = $("<input/>");
                    $input.attr("type", "checkbox");
                    $div.append($input);
                    var $span = $("<span></span>");
                    $span.css(cssPosition, cssAbsolute).css(cssFont, "normal 10pt Arial").css("cursor", "default").css(cssWhiteSpace, "nowrap");
                    $div.append($span);
                    var $childDiv = $("<div></div>");
                    $childDiv.css(cssPosition, cssAbsolute).css(cssBackgroundColor, "green").css(cssWidth, (this._checkboxSize / 2 - 2.5) * 2).css(cssHeight, (this._checkboxSize / 2 - 2.5) * 2);
                    $div.append($childDiv);
                    return div
                };
                CheckBoxCellType.prototype._getNextState = function(value)
                {
                    var newValue;
                    if (this._isThreeState)
                    {
                        if (value === keyword_null || value === keyword_undefined)
                        {
                            newValue = false
                        }
                        else if (!!value === true)
                        {
                            newValue = keyword_null
                        }
                        else
                        {
                            newValue = true
                        }
                    }
                    else
                    {
                        newValue = !value
                    }
                    return newValue
                };
                CheckBoxCellType.prototype.setEditorValue = function(editorContext, value, context)
                {
                    if (editorContext && editorContext.children[0] && editorContext.children[1] && editorContext.children[2])
                    {
                        var startEditNotBySpace = (context && context.sheet && context.sheet._startEditByKeydown);
                        if (!startEditNotBySpace)
                        {
                            value = this._getNextState(value)
                        }
                        if (this._isThreeState)
                        {
                            if (value === keyword_null || value === keyword_undefined)
                            {
                                editorContext.children[0].checked = false;
                                $(editorContext.children[2]).show()
                            }
                            else
                            {
                                editorContext.children[0].checked = !!value;
                                $(editorContext.children[2]).hide()
                            }
                        }
                        else
                        {
                            editorContext.children[0].checked = !!value
                        }
                        $(editorContext.children[1]).text(this._getDisplayText(value))
                    }
                };
                CheckBoxCellType.prototype.getEditorValue = function(editorContext, context)
                {
                    if (editorContext && editorContext.children[0] && editorContext.children[1] && editorContext.children[2])
                    {
                        if (this._isThreeState)
                        {
                            if ($(editorContext.children[2]).is(":visible"))
                            {
                                return keyword_null
                            }
                            else
                            {
                                return editorContext.children[0].checked
                            }
                        }
                        else
                        {
                            return editorContext.children[0].checked
                        }
                    }
                    return keyword_null
                };
                CheckBoxCellType.prototype._triggerButtonClicked = function(sheet, row, col, sheetArea)
                {
                    var parent = sheet.parent;
                    if (parent)
                    {
                        parent.triggerButtonClicked({
                            sheet: sheet, sheetName: sheet._name, row: row, col: col, sheetArea: sheetArea
                        })
                    }
                };
                CheckBoxCellType.prototype.activateEditor = function(editorContext, cellStyle, cellRect, context)
                {
                    var sheet = editorContext && context && context.sheet;
                    if (sheet)
                    {
                        var $editor = $(editorContext);
                        var offset = sheet._eventHandler._getCanvasPosition(),
                            bounds = sheet._bounds;
                        $editor.css(cssTop, offset.top + bounds.y + cellRect.y - 2).css(cssLeft, offset.left + bounds.x + cellRect.x - 2).css(cssBackgroundColor, cellStyle.backColor ? cellStyle.backColor : "white");
                        var self = this;
                        $editor.bind(_mousedown_gcEditingInput, function(e)
                        {
                            Sheets.util.cancelDefault(e)
                        });
                        $editor.bind(_mouseup_gcEditingInput, function(e)
                        {
                            var oldValue = self.getEditorValue(editorContext, context);
                            self.setEditorValue(editorContext, oldValue, context);
                            self.updateEditor(editorContext, cellStyle, cellRect, context);
                            self._triggerButtonClicked(sheet, sheet._activeRowIndex, sheet._activeColIndex, context.sheetArea)
                        });
                        $editor.bind(_keyDown_gcEditingInput, function(e)
                        {
                            if (e.keyCode === 32 && !e.ctrlKey && !e.shiftKey && !e.altKey)
                            {
                                self._isKeyDown = true;
                                Sheets.util.cancelDefault(e);
                                return false
                            }
                            else if (e.keyCode === 8 && !e.ctrlKey && !e.shiftKey && !e.altKey)
                            {
                                Sheets.util.cancelDefault(e)
                            }
                        });
                        $editor.bind(_keyUp_gcEditingInput, function(e)
                        {
                            if (self._isKeyDown && e.keyCode === 32 && !e.ctrlKey && !e.shiftKey && !e.altKey)
                            {
                                self._isKeyDown = false;
                                var oldValue = self.getEditorValue(editorContext, context);
                                self.setEditorValue(editorContext, oldValue, context);
                                self.updateEditor(editorContext, cellStyle, cellRect, context);
                                self._triggerButtonClicked(sheet, sheet._activeRowIndex, sheet._activeColIndex, context.sheetArea)
                            }
                        });
                        if (editorContext.children[0])
                        {
                            $(editorContext.children[0]).bind("click", function(e)
                            {
                                Sheets.util.cancelDefault(e)
                            })
                        }
                    }
                };
                CheckBoxCellType.prototype.updateEditor = function(editorContext, cellStyle, cellRect, context)
                {
                    var sheet = editorContext && context && context.sheet;
                    if (sheet)
                    {
                        $(editorContext).width(cellRect.width).height(cellRect.height);
                        var $editor = $(editorContext),
                            render = sheet._render;
                        var offset = sheet._eventHandler._getCanvasPosition(),
                            bounds = sheet._bounds;
                        $editor.css(cssTop, offset.top + bounds.y + cellRect.y - 2).css(cssLeft, offset.left + bounds.x + cellRect.x - 2);
                        var checkbox = editorContext.children[0],
                            span = editorContext.children[1],
                            greenDiv = editorContext.children[2];
                        if (checkbox && span && greenDiv)
                        {
                            var $span = $(span);
                            var text = $span.text();
                            if (cellStyle.foreColor)
                            {
                                $span.css(cssColor, cellStyle.foreColor)
                            }
                            var font = keyword_null;
                            if (cellStyle.font)
                            {
                                font = cellStyle.font
                            }
                            else
                            {
                                font = render._getDefaultFont()
                            }
                            if (sheet._zoomFactor > 1)
                            {
                                font = render._getZoomFont(font)
                            }
                            $span.css(cssFont, font);
                            var textWidth = sheet._getStringWidth(text, font);
                            var textHeight = sheet._getFontHeight(font);
                            if (text)
                            {
                                var lines = text.split(/\r\n|\r|\n/);
                                textHeight *= lines.length
                            }
                            var self = this;
                            var marginLeft = self._getCheckBoxLeft(cellStyle, cellRect, textWidth, true),
                                marginTop = self._getCheckBoxTop(cellStyle, cellRect, textHeight, true);
                            $(checkbox).css("margin-left", marginLeft).css("margin-top", marginTop);
                            var textLeft = 0,
                                textTop = 0;
                            if (self._textAlign === 0)
                            {
                                textLeft = checkbox.offsetLeft;
                                if (cellStyle.hAlign === 1)
                                {
                                    textLeft = checkbox.offsetLeft + self._checkboxSize / 2 - textWidth / 2
                                }
                                else if (cellStyle.hAlign === 2)
                                {
                                    textLeft = checkbox.offsetLeft + self._checkboxSize - textWidth
                                }
                                textTop = checkbox.offsetTop - textHeight
                            }
                            else if (self._textAlign === 1)
                            {
                                textLeft = checkbox.offsetLeft;
                                if (cellStyle.hAlign === 1)
                                {
                                    textLeft = checkbox.offsetLeft + self._checkboxSize / 2 - textWidth / 2
                                }
                                else if (cellStyle.hAlign === 2)
                                {
                                    textLeft = checkbox.offsetLeft + self._checkboxSize - textWidth
                                }
                                textTop = checkbox.offsetTop + checkbox.offsetHeight
                            }
                            else if (self._textAlign === 2)
                            {
                                textLeft = checkbox.offsetLeft - textWidth - 2;
                                textTop = checkbox.offsetTop + self._checkboxSize / 2 - textHeight / 2
                            }
                            else
                            {
                                textLeft = checkbox.offsetLeft + checkbox.offsetWidth + 2;
                                textTop = checkbox.offsetTop + self._checkboxSize / 2 - textHeight / 2
                            }
                            if ($.browser.msie)
                            {
                                textLeft += 3;
                                textTop += 3
                            }
                            $span.css(cssLeft, textLeft).css(cssTop, textTop);
                            if (self._isThreeState)
                            {
                                var left = checkbox.offsetLeft + (checkbox.offsetWidth - greenDiv.offsetWidth) / 2,
                                    top = checkbox.offsetTop + (checkbox.offsetHeight - greenDiv.offsetHeight) / 2;
                                $(greenDiv).css(cssLeft, left).css(cssTop, top).toggle().toggle()
                            }
                            else
                            {
                                $(greenDiv).hide()
                            }
                            if (cellStyle.textDecoration)
                            {
                                self._setEditStatusTextDecoration($span, cellStyle.textDecoration)
                            }
                        }
                    }
                };
                CheckBoxCellType.prototype.caption = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._caption
                    }
                    else
                    {
                        this._caption = value;
                        return this
                    }
                };
                CheckBoxCellType.prototype.textTrue = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._textTrue
                    }
                    else
                    {
                        this._textTrue = value;
                        return this
                    }
                };
                CheckBoxCellType.prototype.textIndeterminate = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._textIndeterminate
                    }
                    else
                    {
                        this._textIndeterminate = value;
                        return this
                    }
                };
                CheckBoxCellType.prototype.textFalse = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._textFalse
                    }
                    else
                    {
                        this._textFalse = value;
                        return this
                    }
                };
                CheckBoxCellType.prototype._getDisplayText = function(value)
                {
                    var self = this;
                    if (self._isThreeState && (value === keyword_null || value === keyword_undefined))
                    {
                        return self._textIndeterminate || self._caption
                    }
                    else if (!!value === true)
                    {
                        return self._textTrue || self._caption
                    }
                    else
                    {
                        return self._textFalse || self._caption
                    }
                };
                CheckBoxCellType.prototype.textAlign = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._textAlign
                    }
                    else
                    {
                        this._textAlign = value;
                        return this
                    }
                };
                CheckBoxCellType.prototype.isThreeState = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._isThreeState
                    }
                    else
                    {
                        this._isThreeState = value;
                        return this
                    }
                };
                CheckBoxCellType.prototype.getHitInfo = function(x, y, cellStyle, cellRect, context)
                {
                    if (context)
                    {
                        var sheetArea = context.sheetArea;
                        if (sheetArea === keyword_null || sheetArea === keyword_undefined || sheetArea === 3)
                        {
                            return {
                                    x: x, y: y, row: context.row, col: context.col, cellRect: cellRect, sheetArea: sheetArea, isReservedLocation: true, sheet: context.sheet
                                }
                        }
                    }
                    return keyword_null
                };
                CheckBoxCellType.prototype.processMouseDown = function(hitInfo)
                {
                    if (!hitInfo)
                    {
                        return false
                    }
                    if (hitInfo.isReservedLocation)
                    {
                        this._isMouseDownReservedLocation = true
                    }
                };
                CheckBoxCellType.prototype.processMouseUp = function(hitInfo)
                {
                    if (!hitInfo)
                    {
                        return false
                    }
                    var self = this;
                    var sheet = hitInfo.sheet;
                    if (self._isMouseDownReservedLocation && sheet && hitInfo.isReservedLocation)
                    {
                        self._isMouseDownReservedLocation = false;
                        var row = hitInfo.row,
                            col = hitInfo.col,
                            sheetArea = hitInfo.sheetArea;
                        var cellNode = sheet._getModel(sheetArea).getNode(row, col, true);
                        if (!cellNode._isFirstMouseUp)
                        {
                            if (sheetArea === keyword_null || sheetArea === keyword_undefined || sheetArea === 3)
                            {
                                var oldValue = sheet.getValue(row, col, sheetArea);
                                var newValue = self._getNextState(oldValue);
                                var cellEditInfo = {
                                        row: row, col: col, newValue: newValue, autoFormat: true
                                    };
                                var undoAction = new Sheets.UndoRedo.CellEditUndoAction(sheet, cellEditInfo);
                                sheet._doCommand(undoAction)
                            }
                            self._triggerButtonClicked(sheet, row, col, hitInfo.sheetArea);
                            cellNode._isFirstMouseUp = true;
                            cellNode._mouseupToken = window.setTimeout(function()
                            {
                                delete cellNode._isFirstMouseUp;
                                if (cellNode._mouseupToken)
                                {
                                    window.clearTimeout(cellNode._mouseupToken);
                                    delete cellNode._mouseupToken
                                }
                            }, 250);
                            return true
                        }
                        else
                        {
                            delete cellNode._isFirstMouseUp;
                            if (cellNode._mouseupToken)
                            {
                                window.clearTimeout(cellNode._mouseupToken);
                                delete cellNode._mouseupToken
                            }
                        }
                    }
                    return false
                };
                CheckBoxCellType.prototype.processMouseLeave = function(hitInfo)
                {
                    if (!hitInfo)
                    {
                        return false
                    }
                    this._isMouseDownReservedLocation = false
                };
                CheckBoxCellType.prototype.isReservedKey = function(e, context)
                {
                    if (e.keyCode === 32 && !e.ctrlKey && !e.shiftKey && !e.altKey)
                    {
                        return true
                    }
                    return false
                };
                CheckBoxCellType.prototype.processKeyUp = function(event, context)
                {
                    var sheet = context.sheet;
                    if (!sheet)
                    {
                        return false
                    }
                    var row = sheet.getActiveRowIndex();
                    var col = sheet.getActiveColumnIndex();
                    var sheetArea = sheet._getSheetArea(sheet.activeRowViewportIndex, sheet.activeColViewportIndex);
                    var oldValue = sheet.getValue(row, col, sheetArea);
                    var newValue = this._getNextState(oldValue);
                    var cellEditInfo = {
                            row: row, col: col, newValue: newValue, autoFormat: true
                        };
                    var undoAction = new Sheets.UndoRedo.CellEditUndoAction(sheet, cellEditInfo);
                    sheet._doCommand(undoAction);
                    this._triggerButtonClicked(sheet, row, col, context.sheetArea);
                    return true
                };
                CheckBoxCellType.prototype.getAutoFitWidth = function(value, text, cellStyle, zoomFactor, context)
                {
                    var self = this;
                    var width = Sheets.CellTypeContext.getAutoFitWidth(value, self._getDisplayText(value), cellStyle, zoomFactor, context);
                    if (self._textAlign === 0 || self._textAlign === 1)
                    {
                        width = Math_max(width, self._checkboxSize)
                    }
                    else
                    {
                        width += self._checkboxSize
                    }
                    return width + 5 + 2
                };
                CheckBoxCellType.prototype.getAutoFitHeight = function(value, text, cellStyle, zoomFactor, context)
                {
                    var self = this;
                    var height = Sheets.CellTypeContext.getAutoFitHeight(value, self._getDisplayText(value), cellStyle, zoomFactor, context);
                    if (self._textAlign === 0 || self._textAlign === 1)
                    {
                        height += self._checkboxSize
                    }
                    else
                    {
                        height = Math_max(height, self._checkboxSize)
                    }
                    return height + 5
                };
                CheckBoxCellType.prototype._cancelDefaultKeydown = function(event)
                {
                    if (event.keyCode === 32 && !event.ctrlKey && !event.shiftKey && !event.altKey)
                    {
                        Sheets.util.cancelDefault(event)
                    }
                };
                CheckBoxCellType.prototype.isImeAware = function(context)
                {
                    return false
                };
                CheckBoxCellType.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"caption":
                            return value === "";
                        case"textTrue":
                            return value === "";
                        case"textIndeterminate":
                            return value === "";
                        case"textFalse":
                            return value === "";
                        case"textAlign":
                            return value === 3;
                        case"isThreeState":
                            return value === false;
                        default:
                            return false
                    }
                };
                CheckBoxCellType.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            typeName: self.typeName, caption: self.caption(), textTrue: self.textTrue(), textIndeterminate: self.textIndeterminate(), textFalse: self.textFalse(), textAlign: self.textAlign(), isThreeState: self.isThreeState()
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                CheckBoxCellType.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.caption)
                    {
                        self.caption(settings.caption)
                    }
                    if (settings.textTrue)
                    {
                        self.textTrue(settings.textTrue)
                    }
                    if (settings.textIndeterminate)
                    {
                        self.textIndeterminate(settings.textIndeterminate)
                    }
                    if (settings.textFalse)
                    {
                        self.textFalse(settings.textFalse)
                    }
                    if (settings.textAlign !== keyword_null && settings.textAlign !== keyword_undefined)
                    {
                        self.textAlign(settings.textAlign)
                    }
                    if (settings.isThreeState !== keyword_null && settings.isThreeState !== keyword_undefined)
                    {
                        self.isThreeState(settings.isThreeState)
                    }
                };
                return CheckBoxCellType
            })(Sheets.TextCellType);
        Sheets.CheckBoxCellType = CheckBoxCellType;
        var ButtonCellType = (function(_super)
            {
                __extends(ButtonCellType, _super);
                function ButtonCellType()
                {
                    _super.call(this);
                    var self = this;
                    self.allowOverflow = false;
                    self.typeName = 6 + '';
                    self._marginTop = 2;
                    self._marginRight = 2;
                    self._marginBottom = 2;
                    self._marginLeft = 2;
                    self._text = "";
                    self._buttonBackColor = keyword_null;
                    self._buttonBorderColor = "#707070";
                    self._eventNameSpace = ".buttonCellType"
                }
                ButtonCellType.prototype.paintValue = function(ctx, value, x, y, w, h, style, options)
                {
                    if (!ctx)
                    {
                        return
                    }
                    var self = this;
                    var startX = x + self._marginLeft,
                        startY = y + self._marginTop,
                        width = w - self._marginLeft - self._marginRight,
                        height = h - self._marginTop - self._marginBottom,
                        isIntersect = (startX + width > x && startX < x + w && startY + height > y && startY < y + h);
                    if (width - 2 > 0 && height - 2 > 0 && isIntersect)
                    {
                        ctx.save();
                        if (startX < x || startX + width > x + w || startY < y || startY + height > y + h)
                        {
                            ctx.rect(x, y, w, h);
                            ctx.clip()
                        }
                        ctx.beginPath();
                        var strokeStyle = self._buttonBorderColor;
                        if (strokeStyle && ctx.strokeStyle !== strokeStyle)
                        {
                            ctx.strokeStyle = strokeStyle
                        }
                        ctx.strokeRect(startX + 0.5, startY + 0.5, width - 1, height - 1);
                        var fillStyle = self._buttonBackColor;
                        if (!fillStyle)
                        {
                            var gradient = ctx.createLinearGradient(x + w / 2, y, x + w / 2, y + h);
                            gradient.addColorStop(0.125, gradientColorStop1);
                            gradient.addColorStop(1.0, gradientColorStop2);
                            fillStyle = gradient
                        }
                        if (ctx.fillStyle !== fillStyle)
                        {
                            ctx.fillStyle = fillStyle
                        }
                        ctx.fillRect(startX + 1, startY + 1, width - 2, height - 2);
                        ctx.restore();
                        if (self._text)
                        {
                            _super.prototype.paintValue.call(this, ctx, self._text, startX, startY, width, height, style, options)
                        }
                    }
                };
                ButtonCellType.prototype.focus = function(editorContext, context)
                {
                    if (editorContext)
                    {
                        editorContext.focus()
                    }
                };
                ButtonCellType.prototype._formatEditorValue = function(editorContext, cellStyle, value, context)
                {
                    return value
                };
                ButtonCellType.prototype.createEditorElement = function(context)
                {
                    var editor = document.createElement("div");
                    var host = context && context.sheet && context.sheet.parent && context.sheet.parent._host;
                    var zindex = Sheets.util.getPreferredZIndex(host) + 1000;
                    var $editor = $(editor);
                    $editor.css(cssPosition, cssAbsolute).css(cssMargin, zero).css(cssPadding, zero).css(cssOverflow, cssHidden).css(cssResize, cssNone).css(cssBorder, "2px #5292f7 solid").css(cssOutline, cssNone).css(cssBoxShadow, "1px 2px 5px rgba(0,0,0,0.4)").css(cssBoxSizing, "content-box").css("user-select", cssNone).css(cssZIndex, zindex).attr(attrTabIndex, 1).attr(attrGcUIElement, "gcEditingInput");
                    var $div = $("<div></div>");
                    $div.css(cssPosition, cssAbsolute).css(cssOverflow, cssHidden).css(cssBorder, "1px " + this._buttonBorderColor + " solid");
                    $editor.append($div);
                    var $span = $("<span></span>");
                    $span.css(cssPosition, cssAbsolute).css(cssWhiteSpace, "nowrap").css(cssFont, "normal 10pt Arial").css("cursor", "default");
                    $div.append($span);
                    return editor
                };
                ButtonCellType.prototype.setEditorValue = function(editorContext, value, context)
                {
                    var child = editorContext && editorContext.children[0] && editorContext.children[0].children[0];
                    if (child)
                    {
                        $(child).html(this._text)
                    }
                };
                ButtonCellType.prototype.getEditorValue = function(editorContext, context)
                {
                    if (editorContext)
                    {
                        return editorContext._oldValue
                    }
                    return keyword_null
                };
                ButtonCellType.prototype._triggerButtonClicked = function(sheet, row, col, sheetArea)
                {
                    var parent = sheet.parent;
                    if (parent)
                    {
                        parent.triggerButtonClicked({
                            sheet: sheet, sheetName: sheet._name, row: row, col: col, sheetArea: sheetArea
                        })
                    }
                };
                ButtonCellType.prototype._setButtonBackgroundColor = function($button, backgroundColor)
                {
                    $button.removeClass("gradientButton");
                    if (backgroundColor)
                    {
                        $button.css(cssBackgroundColor, backgroundColor)
                    }
                    else
                    {
                        $button.addClass("gradientButton")
                    }
                };
                ButtonCellType.prototype.activateEditor = function(editorContext, cellStyle, cellRect, context)
                {
                    var sheet = editorContext && context && context.sheet;
                    if (sheet)
                    {
                        var $editor = $(editorContext);
                        var offset = sheet._eventHandler._getCanvasPosition(),
                            bounds = sheet._bounds;
                        $editor.css(cssTop, offset.top + bounds.y + cellRect.y - 2).css(cssLeft, offset.left + bounds.x + cellRect.x - 2).css(cssBackgroundColor, cellStyle.backColor ? cellStyle.backColor : "white");
                        var self = this;
                        var button = editorContext.children[0];
                        if (button)
                        {
                            var $button = $(button);
                            $editor.bind(_keyDown_gcEditingInput, function(e)
                            {
                                if (e.keyCode === 32 && !e.ctrlKey && !e.shiftKey && !e.altKey)
                                {
                                    if (!self._isKeyDown)
                                    {
                                        self._setButtonBackgroundColor($button, buttonDownColor)
                                    }
                                    self._isKeyDown = true;
                                    Sheets.util.cancelDefault(e);
                                    return false
                                }
                                else if (e.keyCode === 8 && !e.ctrlKey && !e.shiftKey && !e.altKey)
                                {
                                    Sheets.util.cancelDefault(e)
                                }
                            });
                            $editor.bind(_keyUp_gcEditingInput, function(e)
                            {
                                if (self._isKeyDown && e.keyCode === 32 && !e.ctrlKey && !e.shiftKey && !e.altKey)
                                {
                                    self._isKeyDown = false;
                                    self._setButtonBackgroundColor($button, self._buttonBackColor);
                                    self._triggerButtonClicked(sheet, sheet._activeRowIndex, sheet._activeColIndex, context.sheetArea)
                                }
                            });
                            $button.bind(_mousedown_gcEditingInput, function(e)
                            {
                                if (e.button !== 2)
                                {
                                    self._isMouseDown = true;
                                    self._setButtonBackgroundColor($button, buttonDownColor)
                                }
                            });
                            $button.bind(_mouseup_gcEditingInput, function(e)
                            {
                                if (e.button !== 2)
                                {
                                    self._isMouseDown = false;
                                    self._setButtonBackgroundColor($button, buttonHoverColor)
                                }
                            });
                            $button.bind(_click_gcEditingInput, function(e)
                            {
                                self._triggerButtonClicked(sheet, sheet._activeRowIndex, sheet._activeColIndex, context.sheetArea)
                            });
                            $button.bind(_mousemove_gcEditingInput, function(e)
                            {
                                if (!self._isMouseDown)
                                {
                                    self._setButtonBackgroundColor($button, buttonHoverColor)
                                }
                                else
                                {
                                    self._setButtonBackgroundColor($button, buttonDownColor)
                                }
                            });
                            $button.bind(_mouseout_gcEditingInput, function(e)
                            {
                                var target = e.relatedTarget;
                                if (target !== button && target !== button.children[0])
                                {
                                    self._setButtonBackgroundColor($button, self._buttonBackColor)
                                }
                            })
                        }
                    }
                };
                ButtonCellType.prototype.updateEditor = function(editorContext, cellStyle, cellRect, context)
                {
                    var sheet = editorContext && context && context.sheet;
                    if (sheet)
                    {
                        var $editor = $(editorContext),
                            render = sheet._render;
                        var offset = sheet._eventHandler._getCanvasPosition(),
                            bounds = sheet._bounds;
                        $editor.css(cssTop, offset.top + bounds.y + cellRect.y - 2).css(cssLeft, offset.left + bounds.x + cellRect.x - 2).width(cellRect.width).height(cellRect.height);
                        var button = editorContext.children[0];
                        if (button)
                        {
                            var self = this;
                            var $button = $(button);
                            $button.width(cellRect.width - self._marginLeft - self._marginRight).height(cellRect.height - self._marginTop - self._marginBottom).css("margin-top", self._marginTop - 1).css("margin-left", self._marginLeft - 1);
                            self._setButtonBackgroundColor($button, self._buttonBackColor);
                            var span = button.children[0];
                            if (span)
                            {
                                var $span = $(span);
                                if (cellStyle.foreColor)
                                {
                                    $span.css(cssColor, cellStyle.foreColor)
                                }
                                var font = keyword_null;
                                if (cellStyle.font)
                                {
                                    font = cellStyle.font
                                }
                                else
                                {
                                    font = render._getDefaultFont()
                                }
                                if (sheet._zoomFactor > 1)
                                {
                                    font = render._getZoomFont(font)
                                }
                                $span.css(cssFont, font);
                                var textWidth = sheet._getStringWidth(self._text, font);
                                var textHeight = sheet._getFontHeight(font);
                                if (self._text)
                                {
                                    var lines = self._text.split(/\r\n|\r|\n/);
                                    textHeight *= lines.length
                                }
                                var top = 0;
                                if (cellStyle.vAlign === 1)
                                {
                                    top = $button.height() / 2 - textHeight / 2
                                }
                                else if (cellStyle.vAlign === 2)
                                {
                                    top = $button.height() - textHeight
                                }
                                var left = 0;
                                if (cellStyle.hAlign === 1)
                                {
                                    left = $button.width() / 2 - textWidth / 2
                                }
                                else if (cellStyle.hAlign === 2)
                                {
                                    left = $button.width() - textWidth
                                }
                                $span.css(cssTop, top).css(cssLeft, left);
                                if (cellStyle.textDecoration)
                                {
                                    self._setEditStatusTextDecoration($span, cellStyle.textDecoration)
                                }
                            }
                        }
                    }
                };
                ButtonCellType.prototype.marginTop = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._marginTop
                    }
                    else
                    {
                        this._marginTop = value;
                        return this
                    }
                };
                ButtonCellType.prototype.marginRight = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._marginRight
                    }
                    else
                    {
                        this._marginRight = value;
                        return this
                    }
                };
                ButtonCellType.prototype.marginBottom = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._marginBottom
                    }
                    else
                    {
                        this._marginBottom = value;
                        return this
                    }
                };
                ButtonCellType.prototype.marginLeft = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._marginLeft
                    }
                    else
                    {
                        this._marginLeft = value;
                        return this
                    }
                };
                ButtonCellType.prototype.text = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._text
                    }
                    else
                    {
                        this._text = value;
                        return this
                    }
                };
                ButtonCellType.prototype.buttonBackColor = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._buttonBackColor
                    }
                    else
                    {
                        this._buttonBackColor = value;
                        return this
                    }
                };
                ButtonCellType.prototype.getHitInfo = function(x, y, cellStyle, cellRect, context)
                {
                    var self = this;
                    if (!context)
                    {
                        return keyword_null
                    }
                    var sheetArea = context.sheetArea;
                    if ((sheetArea === keyword_null || sheetArea === keyword_undefined || sheetArea === 3) && cellRect)
                    {
                        var leftX = cellRect.x + self._marginLeft,
                            rightX = cellRect.x + cellRect.width - self._marginRight,
                            topY = cellRect.y + self._marginTop,
                            bottomY = cellRect.y + cellRect.height - self._marginBottom;
                        var info = {
                                x: x, y: y, row: context.row, col: context.col, cellRect: cellRect, sheetArea: sheetArea, sheet: context.sheet
                            };
                        if (leftX <= x && x <= rightX && topY <= y && y <= bottomY)
                        {
                            info.isReservedLocation = true
                        }
                        return info
                    }
                    return keyword_null
                };
                ButtonCellType.prototype.processMouseDown = function(hitInfo)
                {
                    if (!hitInfo)
                    {
                        return false
                    }
                    var self = this;
                    var sheet = hitInfo.sheet;
                    if (sheet && hitInfo.isReservedLocation && !self._isMouseDownReservedLocation)
                    {
                        self._originButtonBackColor = self._buttonBackColor;
                        self._isMouseDownReservedLocation = true;
                        self._buttonBackColor = buttonDownColor;
                        sheet.repaint(hitInfo.cellRect);
                        return true
                    }
                    return false
                };
                ButtonCellType.prototype.processMouseUp = function(hitInfo)
                {
                    if (!hitInfo)
                    {
                        return false
                    }
                    var self = this;
                    var sheet = hitInfo.sheet;
                    if (self._isMouseDownReservedLocation && sheet && hitInfo.isReservedLocation)
                    {
                        self._buttonBackColor = self._originButtonBackColor;
                        sheet.repaint(hitInfo.cellRect);
                        self._isMouseDownReservedLocation = false;
                        var row = hitInfo.row,
                            col = hitInfo.col,
                            sheetArea = hitInfo.sheetArea;
                        var cellNode = sheet._getModel(sheetArea).getNode(row, col, true);
                        if (!cellNode._isFirstMouseUp)
                        {
                            self._triggerButtonClicked(sheet, row, col, hitInfo.sheetArea);
                            cellNode._isFirstMouseUp = true;
                            cellNode._mouseupToken = window.setTimeout(function()
                            {
                                delete cellNode._isFirstMouseUp;
                                if (cellNode._mouseupToken)
                                {
                                    window.clearTimeout(cellNode._mouseupToken);
                                    delete cellNode._mouseupToken
                                }
                            }, 250);
                            return true
                        }
                        else
                        {
                            delete cellNode._isFirstMouseUp;
                            if (cellNode._mouseupToken)
                            {
                                window.clearTimeout(cellNode._mouseupToken);
                                delete cellNode._mouseupToken
                            }
                        }
                    }
                    return false
                };
                ButtonCellType.prototype.processMouseLeave = function(hitInfo)
                {
                    if (!hitInfo)
                    {
                        return false
                    }
                    var self = this;
                    var sheet = hitInfo.sheet;
                    if (sheet)
                    {
                        if (self._isMouseDownReservedLocation)
                        {
                            self._buttonBackColor = self._originButtonBackColor;
                            sheet.repaint(hitInfo.cellRect);
                            self._isMouseDownReservedLocation = false
                        }
                    }
                };
                ButtonCellType.prototype.processKeyDown = function(event, context)
                {
                    var sheet = context && context.sheet;
                    if (!sheet)
                    {
                        return false
                    }
                    var self = this;
                    if (!self._isKeyPressed)
                    {
                        var row = sheet.getActiveRowIndex();
                        var col = sheet.getActiveColumnIndex();
                        var cellRect = sheet.getCellRect(row, col, sheet.activeRowViewportIndex, sheet.activeColViewportIndex);
                        self._originButtonBackColor = self._buttonBackColor;
                        self._buttonBackColor = buttonDownColor;
                        sheet.repaint(cellRect);
                        sheet._bind(Sheets.Events.SelectionChanged + self._eventNameSpace, function(event, args)
                        {
                            sheet._unbind(Sheets.Events.SelectionChanged + self._eventNameSpace);
                            self._isKeyPressed = false;
                            self._buttonBackColor = self._originButtonBackColor;
                            sheet.repaint(cellRect)
                        });
                        self._isKeyPressed = true;
                        return true
                    }
                    return false
                };
                ButtonCellType.prototype.processKeyUp = function(event, context)
                {
                    var sheet = context.sheet;
                    if (!sheet)
                    {
                        return false
                    }
                    var self = this;
                    if (self._isKeyPressed)
                    {
                        var row = sheet.getActiveRowIndex();
                        var col = sheet.getActiveColumnIndex();
                        var cellRect = sheet.getCellRect(row, col, sheet.activeRowViewportIndex, sheet.activeColViewportIndex);
                        self._buttonBackColor = self._originButtonBackColor;
                        sheet.repaint(cellRect);
                        sheet._unbind(Sheets.Events.SelectionChanged + self._eventNameSpace);
                        self._triggerButtonClicked(sheet, row, col, context.sheetArea);
                        self._isKeyPressed = false;
                        return true
                    }
                    return false
                };
                ButtonCellType.prototype.isReservedKey = function(e, context)
                {
                    if (e.keyCode === 32 && !e.ctrlKey && !e.shiftKey && !e.altKey)
                    {
                        return true
                    }
                    return false
                };
                ButtonCellType.prototype.getAutoFitWidth = function(value, text, cellStyle, zoomFactor, context)
                {
                    var self = this;
                    var width = Sheets.CellTypeContext.getAutoFitWidth(value, self._text, cellStyle, zoomFactor, context);
                    return width + self._marginLeft + self._marginRight
                };
                ButtonCellType.prototype.getAutoFitHeight = function(value, text, cellStyle, zoomFactor, context)
                {
                    var self = this;
                    var height = Sheets.CellTypeContext.getAutoFitHeight(value, self._text, cellStyle, zoomFactor, context);
                    return height + self._marginTop + self._marginBottom
                };
                ButtonCellType.prototype._cancelDefaultKeydown = function(event)
                {
                    if (event.keyCode === 32 && !event.ctrlKey && !event.shiftKey && !event.altKey)
                    {
                        Sheets.util.cancelDefault(event)
                    }
                };
                ButtonCellType.prototype.isImeAware = function(context)
                {
                    return false
                };
                ButtonCellType.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"marginTop":
                            return value === 2;
                        case"marginRight":
                            return value === 2;
                        case"marginBottom":
                            return value === 2;
                        case"marginLeft":
                            return value === 2;
                        case"text":
                            return value === "";
                        case"buttonBackColor":
                            return value === keyword_null;
                        default:
                            return false
                    }
                };
                ButtonCellType.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            typeName: self.typeName, marginTop: self.marginTop(), marginRight: self.marginRight(), marginBottom: self.marginBottom(), marginLeft: self.marginLeft(), text: self.text(), buttonBackColor: self.buttonBackColor()
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                ButtonCellType.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.marginTop !== keyword_null && settings.marginTop !== keyword_undefined)
                    {
                        self.marginTop(settings.marginTop)
                    }
                    if (settings.marginRight !== keyword_null && settings.marginRight !== keyword_undefined)
                    {
                        self.marginRight(settings.marginRight)
                    }
                    if (settings.marginBottom !== keyword_null && settings.marginBottom !== keyword_undefined)
                    {
                        self.marginBottom(settings.marginBottom)
                    }
                    if (settings.marginLeft !== keyword_null && settings.marginLeft !== keyword_undefined)
                    {
                        self.marginLeft(settings.marginLeft)
                    }
                    if (settings.text)
                    {
                        self.text(settings.text)
                    }
                    if (settings.buttonBackColor)
                    {
                        self.buttonBackColor(settings.buttonBackColor)
                    }
                };
                return ButtonCellType
            })(Sheets.TextCellType);
        Sheets.ButtonCellType = ButtonCellType;
        var HyperLinkCellType = (function(_super)
            {
                __extends(HyperLinkCellType, _super);
                function HyperLinkCellType()
                {
                    _super.call(this);
                    var self = this;
                    self.allowOverflow = false;
                    self.typeName = 8 + '';
                    self._link = "";
                    self._linkColor = "#0066cc";
                    self._visitedLinkColor = "#3399ff";
                    self._text = "";
                    self._linkToolTip = "";
                    self._id = HyperLinkCellType._getUniqueId();
                    self._target = 0
                }
                HyperLinkCellType.prototype.paintValue = function(ctx, value, x, y, w, h, style, options)
                {
                    var self = this;
                    if (self._actived || !ctx)
                    {
                        return
                    }
                    var text = self.getText(value, options);
                    if (!text)
                    {
                        return
                    }
                    text = text.replace(/\s+/g, " ");
                    var visited = false;
                    var node = options.sheet._getModel().getNode(options.row, options.col),
                        hyperlinkInfo = (node && node.hyperlinkInfo);
                    if (hyperlinkInfo)
                    {
                        if (self._id === hyperlinkInfo.id)
                        {
                            visited = hyperlinkInfo.visited
                        }
                        else
                        {
                            delete node.hyperlinkInfo
                        }
                    }
                    ctx.save();
                    ctx.beginPath();
                    var fillStyle;
                    if (visited)
                    {
                        fillStyle = self._visitedLinkColor
                    }
                    else
                    {
                        fillStyle = self._linkColor
                    }
                    if (fillStyle && ctx.fillStyle !== fillStyle)
                    {
                        ctx.fillStyle = fillStyle
                    }
                    var font = style.font;
                    if (font && ctx.font !== font)
                    {
                        ctx.font = font
                    }
                    var hAlign = style.hAlign,
                        vAlign = style.vAlign,
                        linkTextWidth = ctx.measureText(text).width,
                        linkTextHeight = options.lineHeight,
                        linkTextPosition = self._calcPosition(new Sheets.Rect(x, y, w, h), linkTextWidth, linkTextHeight, hAlign, vAlign);
                    var clipRect = {
                            x: x, y: y, width: w, height: h
                        };
                    if (linkTextPosition.x + linkTextWidth > clipRect.width || linkTextPosition.y + linkTextHeight > clipRect.height)
                    {
                        ctx.rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
                        ctx.clip();
                        ctx.beginPath()
                    }
                    var adjX = 2,
                        textAlign = cssLeft;
                    if (hAlign === 1)
                    {
                        if (linkTextWidth < w - 3)
                        {
                            adjX = w / 2;
                            textAlign = cssCenter
                        }
                    }
                    else if (hAlign === 2)
                    {
                        if (linkTextWidth < w - 3)
                        {
                            adjX = w - 2;
                            textAlign = cssRight
                        }
                    }
                    if (ctx.textAlign !== textAlign)
                    {
                        ctx.textAlign = textAlign
                    }
                    var adjY = ($.browser.mozilla ? 5 : 2),
                        textBaseline = cssAlphabetic,
                        fontSize = options.fontInfo.fontSize,
                        baselineOffset = fontSize > 8 ? Math_floor((fontSize - 8) / 5 + 2) : 1,
                        lineOffset = linkTextHeight / 2 - fontSize / 2 + baselineOffset - 1;
                    adjY += linkTextHeight - lineOffset;
                    if (vAlign === 1)
                    {
                        if (linkTextHeight < h)
                        {
                            if ($.browser.mozilla)
                            {
                                adjY = h / 2 + 1
                            }
                            else if ($.browser.msie)
                            {
                                adjY = h / 2 + 0.5
                            }
                            else
                            {
                                adjY = h / 2
                            }
                            if (Math_floor(adjY) !== adjY)
                            {
                                adjY = adjY + 0.5
                            }
                            adjY += linkTextHeight / 2 - lineOffset
                        }
                    }
                    else if (vAlign === 2)
                    {
                        adjY = h - 2.5 - lineOffset
                    }
                    if (ctx.textBaseline !== textBaseline)
                    {
                        ctx.textBaseline = textBaseline
                    }
                    ctx.fillText(text, x + adjX, y + adjY);
                    var textDecoration = style.textDecoration;
                    if (textDecoration)
                    {
                        self._renderTextDecoration(ctx, textDecoration, x + adjX, y + adjY, linkTextWidth, fontSize, baselineOffset)
                    }
                    var x1 = x + linkTextPosition.x;
                    var x2 = x1 + linkTextWidth;
                    if (hAlign === 2)
                    {}
                    else
                    {
                        x1 = x1 + 1;
                        x2 = x2 + 1
                    }
                    var y1 = y + linkTextPosition.y + linkTextHeight;
                    if (style.vAlign === 2)
                    {
                        y1 = y1 - 0.5
                    }
                    y1 = y1 - Math_max(0, Math_round(linkTextHeight / 9) - 1);
                    if (Math_floor(y1) === y1)
                    {
                        y1 = y1 + 0.5
                    }
                    var y2 = y1;
                    ctx.beginPath();
                    var strokeStyle = self._linkColor;
                    if (visited)
                    {
                        strokeStyle = self._visitedLinkColor
                    }
                    if (strokeStyle && ctx.strokeStyle !== strokeStyle)
                    {
                        ctx.strokeStyle = strokeStyle
                    }
                    ctx.lineWidth = 1;
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                    ctx.restore()
                };
                HyperLinkCellType.prototype.getText = function(value, options)
                {
                    return (this._text || value)
                };
                HyperLinkCellType.prototype.createEditorElement = function(context)
                {
                    var editor = document.createElement("div");
                    var host = context && context.sheet && context.sheet.parent && context.sheet.parent._host;
                    var zindex = Sheets.util.getPreferredZIndex(host) + 1000;
                    var $editor = $(editor);
                    $editor.css(cssMargin, zero).css(cssPadding, zero).css(cssBorder, cssNone).css(cssPosition, cssAbsolute).css(cssOverflow, cssHidden).css(cssBoxSizing, "content-box").css(cssWhiteSpace, "nowrap").css(cssZIndex, zindex).attr(attrGcUIElement, "gcEditor").attr(attrTabIndex, 1).css(cssOutline, cssNone);
                    var targetValue;
                    switch (this._target)
                    {
                        case 0:
                            targetValue = "_blank";
                            break;
                        case 1:
                            targetValue = "_self";
                            break;
                        case 2:
                            targetValue = "_parent";
                            break;
                        case 3:
                            targetValue = "_top";
                            break
                    }
                    var a = document.createElement("a");
                    $(a).css(cssMargin, zero).css(cssOutline, cssNone).css("display", "block").attr("target", targetValue).appendTo($editor);
                    return editor
                };
                HyperLinkCellType.prototype._triggerButtonClicked = function(sheet, row, col, sheetArea)
                {
                    var parent = sheet.parent;
                    if (parent)
                    {
                        if (!sheet._startEditByKeydown)
                        {
                            parent.triggerButtonClicked({
                                sheet: sheet, sheetName: sheet._name, row: row, col: col, sheetArea: sheetArea
                            })
                        }
                    }
                };
                HyperLinkCellType.prototype.activateEditor = function(editorContext, cellStyle, cellRect, context)
                {
                    if (!editorContext || !cellRect)
                    {
                        return
                    }
                    var sheet = context && context.sheet;
                    var $editor = $(editorContext);
                    $editor.css(cssBackgroundColor, ((cellStyle && cellStyle.backColor) || "white"));
                    if (sheet)
                    {
                        var offset = sheet._eventHandler._getCanvasPosition(),
                            bounds = sheet._bounds;
                        var top = offset.top + bounds.y + cellRect.y;
                        var left = offset.left + bounds.x + cellRect.x;
                        $editor.css(cssTop, top).css(cssLeft, left)
                    }
                    $editor.bind("keydown", function(e)
                    {
                        if (e.keyCode === 8 && !e.ctrlKey && !e.shiftKey && !e.altKey)
                        {
                            Sheets.util.cancelDefault(e)
                        }
                    });
                    var self = this;
                    var a = $editor.children()[0];
                    if (a)
                    {
                        var $a = $(a);
                        $a.bind("click", function()
                        {
                            $a.css(cssColor, self._visitedLinkColor);
                            if (sheet)
                            {
                                var row = sheet._activeRowIndex;
                                var col = sheet._activeColIndex;
                                var node = sheet._getModel().getNode(row, col, true);
                                node.hyperlinkInfo = {
                                    id: self._id, visited: true
                                };
                                self._triggerButtonClicked(sheet, row, col, context.sheetArea)
                            }
                        })
                    }
                    var clip = document.createElement("div");
                    $(clip).css(cssMargin, zero).css(cssPosition, cssAbsolute).css(cssOverflow, cssHidden).css(cssBoxSizing, "content-box").attr(attrGcUIElement, "gcEditingInput").css(cssBorderWidth, "1px").css(cssBorderStyle, "solid").css(cssBackgroundColor, "transparent");
                    var host = sheet && sheet._getHost();
                    if (host)
                    {
                        host.insertBefore(clip, keyword_null)
                    }
                    self._clip = clip;
                    self._actived = true
                };
                HyperLinkCellType.prototype.deactivateEditor = function(editorContext, context)
                {
                    var sheet = context && context.sheet;
                    if (this._clip)
                    {
                        var host = sheet && sheet._getHost();
                        if (host)
                        {
                            host.removeChild(this._clip)
                        }
                    }
                    if (editorContext)
                    {
                        $(editorContext).unbind("keydown");
                        var a = $(editorContext).children()[0];
                        if (a)
                        {
                            $(a).unbind("click")
                        }
                    }
                    _super.prototype.deactivateEditor.call(this, editorContext, context);
                    this._actived = false;
                    if (sheet)
                    {
                        sheet.repaint()
                    }
                };
                HyperLinkCellType.prototype.updateEditor = function(editorContext, cellStyle, cellRect, context)
                {
                    if (!editorContext || !cellRect)
                    {
                        return
                    }
                    var self = this;
                    var sheet = context && context.sheet,
                        render = sheet && sheet._render;
                    var editor = editorContext;
                    var $editor = $(editor);
                    var a = $editor.children()[0];
                    if (a)
                    {
                        var $a = $(a);
                        if (self._link)
                        {
                            $a.attr("href", self._link)
                        }
                        var text = self._text || self._link;
                        if (text)
                        {
                            $a.text(text)
                        }
                        $a.attr("title", self._linkToolTip);
                        var visited = false;
                        var node = (sheet ? sheet._getModel().getNode(sheet._activeRowIndex, sheet._activeColIndex) : keyword_null);
                        if (node && node.hyperlinkInfo)
                        {
                            if (self._id === node.hyperlinkInfo.id)
                            {
                                visited = node.hyperlinkInfo.visited
                            }
                            else
                            {
                                delete node.hyperlinkInfo
                            }
                        }
                        if (visited)
                        {
                            $a.css(cssColor, self._visitedLinkColor)
                        }
                        else
                        {
                            $a.css(cssColor, self._linkColor)
                        }
                        var font = (cellStyle && cellStyle.font) ? cellStyle.font : keyword_null;
                        if (!font && render)
                        {
                            font = render._getDefaultFont()
                        }
                        if (render && sheet._zoomFactor > 1)
                        {
                            font = render._getZoomFont(font)
                        }
                        if (font)
                        {
                            $a.css(cssFont, font)
                        }
                    }
                    if (cellStyle && sheet)
                    {
                        $editor.css(cssMaxWidth, cellRect.width - 2);
                        $editor.css(cssMaxHeight, cellRect.height - 2);
                        var offset = sheet._eventHandler._getCanvasPosition(),
                            bounds = sheet._bounds;
                        var top = offset.top + bounds.y + cellRect.y;
                        var left = offset.left + bounds.x + cellRect.x;
                        var editorPosition = self._calcPosition(cellRect, $editor.width(), $editor.height(), cellStyle.hAlign, cellStyle.vAlign);
                        $editor.css(cssTop, top + editorPosition.y).css(cssLeft, left + editorPosition.x);
                        if (self._clip)
                        {
                            $(self._clip).css(cssTop, top).css(cssLeft, left).height(cellRect.height - 3).width(cellRect.width - 3).css(cssBorderColor, cellStyle.backColor || "white")
                        }
                        if (cellStyle.textDecoration)
                        {
                            self._setEditStatusTextDecoration($editor, cellStyle.textDecoration)
                        }
                    }
                };
                HyperLinkCellType.prototype.getEditorValue = function(editorContext, context)
                {
                    return this._link
                };
                HyperLinkCellType.prototype.setEditorValue = function(editorContext, value, context)
                {
                    this._link = value
                };
                HyperLinkCellType.prototype._formatEditorValue = function(editorContext, cellStyle, value, context)
                {
                    return value
                };
                HyperLinkCellType.prototype.getHitInfo = function(x, y, cellStyle, cellRect, context)
                {
                    if (context)
                    {
                        var sheetArea = context.sheetArea;
                        if ((sheetArea === keyword_null || sheetArea === keyword_undefined || sheetArea === 3) && cellStyle && cellRect)
                        {
                            return {
                                    x: x, y: y, row: context.row, col: context.col, cellStyle: cellStyle, cellRect: cellRect, sheetArea: sheetArea, isFocusAware: true, sheet: context.sheet
                                }
                        }
                    }
                    return keyword_null
                };
                HyperLinkCellType.prototype.processMouseDown = function(hitInfo)
                {
                    if (!hitInfo)
                    {
                        return
                    }
                    var sheet = hitInfo.sheet;
                    if (!sheet || sheet.isEditing())
                    {
                        return
                    }
                    if (this._isHitHyperlink(hitInfo, sheet))
                    {
                        hitInfo.isReservedLocation = true
                    }
                    else
                    {
                        hitInfo.isReservedLocation = false
                    }
                    if (hitInfo.isReservedLocation)
                    {
                        this._isMouseDownLink = true
                    }
                };
                HyperLinkCellType.prototype.processMouseUp = function(hitInfo)
                {
                    if (!hitInfo)
                    {
                        return
                    }
                    var sheet = hitInfo.sheet;
                    if (!sheet || sheet.isEditing())
                    {
                        return
                    }
                    var self = this;
                    if (self._isHitHyperlink(hitInfo, sheet))
                    {
                        hitInfo.isReservedLocation = true
                    }
                    else
                    {
                        hitInfo.isReservedLocation = false
                    }
                    if (hitInfo.isReservedLocation && self._isMouseDownLink)
                    {
                        var link = sheet.getValue(hitInfo.row, hitInfo.col, hitInfo.sheetArea);
                        if (link)
                        {
                            switch (self._target)
                            {
                                case 0:
                                    window.open(link, "_blank");
                                    break;
                                case 1:
                                    window.open(link, "_self");
                                    break;
                                case 2:
                                    window.open(link, "_parent");
                                    break;
                                case 3:
                                    window.open(link, "_top");
                                    break
                            }
                        }
                        var node = sheet._getModel(hitInfo.sheetArea).getNode(hitInfo.row, hitInfo.col, true);
                        node.hyperlinkInfo = {
                            id: self._id, visited: true
                        };
                        sheet.repaint(hitInfo.cellRect);
                        self._triggerButtonClicked(sheet, hitInfo.row, hitInfo.col, hitInfo.sheetArea)
                    }
                    self._isMouseDownLink = false
                };
                HyperLinkCellType.prototype.processMouseMove = function(hitInfo)
                {
                    if (!hitInfo)
                    {
                        return
                    }
                    var sheet = hitInfo.sheet;
                    if (!sheet)
                    {
                        return
                    }
                    if (sheet.isEditing() && sheet.getActiveRowIndex() === hitInfo.row && sheet.getActiveColumnIndex() === hitInfo.col)
                    {
                        return
                    }
                    if (this._isHitHyperlink(hitInfo, sheet))
                    {
                        hitInfo.isReservedLocation = true
                    }
                    else
                    {
                        hitInfo.isReservedLocation = false
                    }
                    if (hitInfo.isReservedLocation)
                    {
                        this._showLinkToolTip(sheet, hitInfo);
                        var canvas = sheet._getCanvas();
                        if (canvas)
                        {
                            var link = sheet.getValue(hitInfo.row, hitInfo.col, hitInfo.sheetArea);
                            if (link)
                            {
                                canvas.style.cursor = "pointer"
                            }
                            else
                            {
                                canvas.style.cursor = "text"
                            }
                        }
                    }
                    else
                    {
                        this._hideLinkToolTip(sheet);
                        var canvas = sheet._getCanvas();
                        if (canvas)
                        {
                            canvas.style.cursor = "default"
                        }
                    }
                };
                HyperLinkCellType.prototype.processMouseLeave = function(hitInfo)
                {
                    this._isMouseDownLink = false;
                    var sheet = hitInfo.sheet;
                    this._hideLinkToolTip(sheet);
                    if (sheet)
                    {
                        var canvas = sheet._getCanvas();
                        if (canvas)
                        {
                            canvas.style.cursor = "default"
                        }
                    }
                };
                HyperLinkCellType.prototype._isHitHyperlink = function(hitInfo, sheet)
                {
                    var cellStyle = hitInfo.cellStyle,
                        cellRect = hitInfo.cellRect,
                        render = sheet._render;
                    var x = hitInfo.x,
                        y = hitInfo.y;
                    var text = this._text || this._link;
                    if (!text)
                    {
                        text = sheet.getValue(hitInfo.row, hitInfo.col, hitInfo.sheetArea)
                    }
                    if (!text)
                    {
                        return false
                    }
                    text = text.replace(/\s+/g, " ");
                    var font = (cellStyle && cellStyle.font) ? cellStyle.font : render._getDefaultFont();
                    if (sheet._zoomFactor > 1)
                    {
                        font = render._getZoomFont(font)
                    }
                    var linkRect = this._getLinkRect(text, cellStyle.hAlign, cellStyle.vAlign, font, cellRect, sheet);
                    var x1 = cellRect.x + linkRect.x;
                    var x2 = Math_min(cellRect.x + linkRect.x + linkRect.width, cellRect.x + cellRect.width);
                    var y1 = cellRect.y + linkRect.y;
                    var y2 = Math_min(cellRect.y + linkRect.y + linkRect.height, cellRect.y + cellRect.height);
                    if (x1 <= x && x < x2 && y1 <= y && y < y2)
                    {
                        return true
                    }
                    return false
                };
                HyperLinkCellType.prototype._showLinkToolTip = function(sheet, hitInfo)
                {
                    if (this._linkToolTip)
                    {
                        var tip = this._getLinkToolTipElement();
                        var $tip = $(tip);
                        $tip.text(this._linkToolTip);
                        var offset = sheet._eventHandler._getCanvasPosition();
                        var left = offset.left + hitInfo.x;
                        var top = offset.top + hitInfo.y + 20;
                        if ($tip.parent().length === 0)
                        {
                            var host = sheet && sheet._getHost();
                            if (host)
                            {
                                host.insertBefore(tip, keyword_null)
                            }
                            $tip.css(cssTop, top).css(cssLeft, left)
                        }
                    }
                };
                HyperLinkCellType.prototype._hideLinkToolTip = function(sheet)
                {
                    if (this._linkToolTipElement)
                    {
                        var host = sheet && sheet._getHost();
                        if (host)
                        {
                            host.removeChild(this._linkToolTipElement)
                        }
                        this._linkToolTipElement = keyword_null
                    }
                };
                HyperLinkCellType.prototype._getLinkToolTipElement = function()
                {
                    if (!this._linkToolTipElement)
                    {
                        var div = document.createElement("div");
                        div.className = "gcHyperLinkCellTypeToolTip";
                        $(div).css(cssPosition, cssAbsolute).css(cssMargin, zero).css(cssPadding, 2).css(cssBorder, "1px #c0c0c0 solid").css(cssBoxShadow, "1px 2px 5px rgba(0,0,0,0.4)").css(cssBoxSizing, "content-box").css(cssBackgroundColor, "#ffffff").css(cssFont, "9pt Arial");
                        this._linkToolTipElement = div
                    }
                    return this._linkToolTipElement
                };
                HyperLinkCellType.prototype._getLinkRect = function(text, hAlign, vAlign, font, cellRect, sheet)
                {
                    var dummy = HyperLinkCellType._getEditorElement(sheet);
                    var $dummy = $(dummy);
                    var a = $dummy.children()[0];
                    if (a)
                    {
                        var $a = $(a);
                        $a.text(text ? text : "");
                        if (font)
                        {
                            $a.css(cssFont, font)
                        }
                    }
                    var w = $dummy.width();
                    var h = $dummy.height();
                    var ret = {
                            x: 0, y: 0, width: w, height: h
                        };
                    if (cellRect)
                    {
                        var p = this._calcPosition(cellRect, w, h, hAlign, vAlign);
                        ret.x = p.x;
                        ret.y = p.y
                    }
                    return ret
                };
                HyperLinkCellType.prototype._calcPosition = function(cellRect, editorWidth, editorHeight, hAlign, vAlign)
                {
                    var x = 1;
                    var y = 1;
                    var width = cellRect.width - 3;
                    var height = cellRect.height - 3;
                    if (hAlign === 1)
                    {
                        x = x + Math_max(0, (width - editorWidth) / 2)
                    }
                    else if (hAlign === 2)
                    {
                        x = x + Math_max(0, width - editorWidth)
                    }
                    if (vAlign === 1)
                    {
                        y = y + Math_max(0, (height - editorHeight) / 2)
                    }
                    else if (vAlign === 2)
                    {
                        y = y + Math_max(0, height - editorHeight)
                    }
                    return {
                            x: x, y: y
                        }
                };
                HyperLinkCellType.prototype.isReservedKey = function(e, context)
                {
                    if (e.keyCode === 32 && !e.ctrlKey && !e.shiftKey && !e.altKey)
                    {
                        return true
                    }
                    return false
                };
                HyperLinkCellType.prototype.processKeyUp = function(event, context)
                {
                    var sheet = context.sheet;
                    if (!sheet)
                    {
                        return false
                    }
                    var row = sheet.getActiveRowIndex();
                    var col = sheet.getActiveColumnIndex();
                    var sheetArea = sheet._getSheetArea(sheet.activeRowViewportIndex, sheet.activeColViewportIndex);
                    var link = sheet.getValue(row, col, sheetArea);
                    var cellRect = sheet.getCellRect(row, col, sheet.activeRowViewportIndex, sheet.activeColViewportIndex);
                    if (link)
                    {
                        link = link.toString();
                        switch (this._target)
                        {
                            case 0:
                                window.open(link, "_blank");
                                break;
                            case 1:
                                window.open(link, "_self");
                                break;
                            case 2:
                                window.open(link, "_parent");
                                break;
                            case 3:
                                window.open(link, "_top");
                                break
                        }
                    }
                    var node = sheet._getModel(sheetArea).getNode(row, col, true);
                    node.hyperlinkInfo = {
                        id: this._id, visited: true
                    };
                    sheet.repaint(cellRect);
                    this._triggerButtonClicked(sheet, row, col, context.sheetArea);
                    return true
                };
                HyperLinkCellType.prototype.linkColor = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._linkColor
                    }
                    this._linkColor = value;
                    return this
                };
                HyperLinkCellType.prototype.visitedLinkColor = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._visitedLinkColor
                    }
                    this._visitedLinkColor = value;
                    return this
                };
                HyperLinkCellType.prototype.text = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._text
                    }
                    this._text = value;
                    return this
                };
                HyperLinkCellType.prototype.linkToolTip = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._linkToolTip
                    }
                    this._linkToolTip = value;
                    return this
                };
                HyperLinkCellType.prototype.target = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._target
                    }
                    this._target = value;
                    return this
                };
                HyperLinkCellType.prototype.getAutoFitWidth = function(value, text, cellStyle, zoomFactor, context)
                {
                    var sheet = context && context.sheet;
                    if (sheet)
                    {
                        var self = this,
                            render = sheet._render;
                        var actualText = self._text || value;
                        var font = (cellStyle && cellStyle.font) ? cellStyle.font : render._getZoomFont(render._getDefaultFont());
                        var linkRect = self._getLinkRect(actualText, cellStyle.hAlign, cellStyle.vAlign, font, null, sheet);
                        return linkRect.width
                    }
                    else
                    {
                        return 0
                    }
                };
                HyperLinkCellType.prototype.getAutoFitHeight = function(value, text, cellStyle, zoomFactor, context)
                {
                    var sheet = context && context.sheet;
                    if (sheet)
                    {
                        var actualText = this._text || value,
                            render = sheet._render;
                        var font = (cellStyle && cellStyle.font) ? cellStyle.font : render._getDefaultFont();
                        if (zoomFactor > 1)
                        {
                            font = render._getZoomFont(font)
                        }
                        var linkRect = this._getLinkRect(actualText, cellStyle.hAlign, cellStyle.vAlign, font, null, sheet);
                        return linkRect.height
                    }
                    else
                    {
                        return 0
                    }
                };
                HyperLinkCellType.prototype.isImeAware = function(context)
                {
                    return false
                };
                HyperLinkCellType.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"linkColor":
                            return value === "#0066cc";
                        case"visitedLinkColor":
                            return value === "#3399ff";
                        case"text":
                            return value === "";
                        case"linkToolTip":
                            return value === "";
                        case"target":
                            return value === 0;
                        default:
                            return false
                    }
                };
                HyperLinkCellType.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            typeName: self.typeName, linkColor: self._linkColor, visitedLinkColor: self._visitedLinkColor, text: self._text, linkToolTip: self._linkToolTip, target: self._target
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                HyperLinkCellType.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    var self = this;
                    if (settings.linkColor !== keyword_undefined && settings.linkColor !== keyword_null)
                    {
                        self._linkColor = settings.linkColor
                    }
                    if (settings.visitedLinkColor !== keyword_undefined && settings.visitedLinkColor !== keyword_null)
                    {
                        self._visitedLinkColor = settings.visitedLinkColor
                    }
                    if (settings.text !== keyword_undefined && settings.text !== keyword_null)
                    {
                        self._text = settings.text
                    }
                    if (settings.linkToolTip !== keyword_undefined && settings.linkToolTip !== keyword_null)
                    {
                        self._linkToolTip = settings.linkToolTip
                    }
                    if (settings.target !== keyword_undefined && settings.target !== keyword_null)
                    {
                        self._target = settings.target
                    }
                };
                HyperLinkCellType._getUniqueId = function()
                {
                    var self = this;
                    if (self._id === keyword_undefined || self._id === keyword_null)
                    {
                        self._id = 0
                    }
                    return "id_" + self._id++
                };
                HyperLinkCellType._getEditorElement = function(sheet)
                {
                    var self = this;
                    if (!self._editorElement)
                    {
                        var div = HyperLinkCellType.prototype.createEditorElement({sheet: sheet}),
                            divStyle = div.style;
                        var host = sheet && sheet._getHost();
                        if (host)
                        {
                            host.insertBefore(div, keyword_null)
                        }
                        divStyle.visibility = cssHidden;
                        divStyle.top = "-10000px";
                        divStyle.left = "-10000px";
                        div.className = "gcHyperLinkCellTypeEditor";
                        self._editorElement = div
                    }
                    return self._editorElement
                };
                return HyperLinkCellType
            })(Sheets.TextCellType);
        Sheets.HyperLinkCellType = HyperLinkCellType;
        var CustomCellType = (function(_super)
            {
                __extends(CustomCellType, _super);
                function CustomCellType()
                {
                    _super.call(this);
                    this.typeName = ""
                }
                CustomCellType.prototype.paint = function(ctx, value, x, y, width, height, style, context)
                {
                    if (!ctx)
                    {
                        return
                    }
                    Sheets.CellTypeContext.paintBackground(ctx, x, y, width, height, style.backColor, style.backgroundImage, style.backgroundImageLayout, context.imageLoader);
                    var showBarIconOnly = Sheets.CellTypeContext.paintConditionalFormats(ctx, value, x, y, width, height, style, context);
                    context.showBarIconOnly = showBarIconOnly;
                    Sheets.CellTypeContext.paintSparkline(ctx, x, y, width, height, context.sparkline);
                    var showSparklineEx = Sheets.CellTypeContext.paintSparklineEx(ctx, value, x, y, width, height, context.sheet);
                    if (!context.cellOverflowLayout && !showBarIconOnly && !showSparklineEx)
                    {
                        this.paintValue(ctx, value, x, y, width, height, style, context)
                    }
                };
                CustomCellType.prototype.createEditorElement = function(context){};
                CustomCellType.prototype.getEditorValue = function(editorContext, context){};
                CustomCellType.prototype.setEditorValue = function(editorContext, value, context){};
                CustomCellType.prototype.activateEditor = function(editorContext, cellStyle, cellRect, context)
                {
                    var sheet = editorContext && context && context.sheet;
                    if (sheet)
                    {
                        var eventHandler = sheet._eventHandler;
                        if (this.isImeAware(context))
                        {
                            eventHandler._resetFocusHolder()
                        }
                        var offset = eventHandler._getCanvasPosition(),
                            bounds = sheet._bounds;
                        var originalTop = offset.top + bounds.y + cellRect.y - 2;
                        var originalLeft = offset.left + bounds.x + cellRect.x - 2;
                        $(editorContext).css("top", originalTop).css("left", originalLeft)
                    }
                };
                CustomCellType.prototype.deactivateEditor = function(editorContext, context)
                {
                    if (editorContext)
                    {
                        var locator = editorContext._editingLocator;
                        if (locator)
                        {
                            var host = context && context.sheet && context.sheet._getHost();
                            if (host)
                            {
                                host.removeChild(locator)
                            }
                        }
                    }
                };
                CustomCellType.prototype.updateEditor = function(editorContext, cellStyle, cellRect, context)
                {
                    if (editorContext)
                    {
                        $(editorContext).width(cellRect.width).height(cellRect.height)
                    }
                };
                CustomCellType.prototype.updateImeMode = function(editorContext, imeMode, context)
                {
                    _super.prototype.updateImeMode.call(this, editorContext, imeMode, context)
                };
                CustomCellType.prototype.getHitInfo = function(x, y, cellStyle, cellRect, context)
                {
                    return null
                };
                CustomCellType.prototype.processMouseDown = function(hitInfo){};
                CustomCellType.prototype.processMouseMove = function(hitInfo){};
                CustomCellType.prototype.processMouseUp = function(hitInfo){};
                CustomCellType.prototype.processMouseEnter = function(hitInfo){};
                CustomCellType.prototype.processMouseLeave = function(hitInfo){};
                CustomCellType.prototype.isReservedKey = function(event, context)
                {
                    return false
                };
                CustomCellType.prototype.processKeyDown = function(event, context)
                {
                    return false
                };
                CustomCellType.prototype.processKeyUp = function(event, context)
                {
                    return false
                };
                CustomCellType.prototype.isEditingValueChanged = function(oldValue, newValue, context)
                {
                    return oldValue !== newValue
                };
                CustomCellType.prototype.getAutoFitWidth = function(value, text, cellStyle, zoomFactor, context)
                {
                    return Sheets.CellTypeContext.getAutoFitWidth(value, text, cellStyle, zoomFactor, context)
                };
                CustomCellType.prototype.getAutoFitHeight = function(value, text, cellStyle, zoomFactor, context)
                {
                    return Sheets.CellTypeContext.getAutoFitHeight(value, text, cellStyle, zoomFactor, context)
                };
                CustomCellType.prototype.isImeAware = function(context)
                {
                    return false
                };
                CustomCellType.prototype.toJSON = function()
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
                CustomCellType.prototype.fromJSON = function(settings)
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
                return CustomCellType
            })(Sheets.BaseCellType);
        Sheets.CustomCellType = CustomCellType;
        var DefaultDropDownButtonWidth = 17;
        var DefaultMaxVisibleItemCount = 20;
        var ComboBoxBorderWidth = 1,
            ComboBoxEditorLeftPadding = 4,
            ComboBoxEditorTopPadding = 2,
            DropDownItemLeftPadding = ComboBoxEditorLeftPadding;
        var ComboBoxCellType = (function(_super)
            {
                __extends(ComboBoxCellType, _super);
                function ComboBoxCellType()
                {
                    _super.call(this);
                    var self = this;
                    self.typeName = 7 + '';
                    self._editorValueType = 0;
                    self._items = [];
                    self._itemHeight = 22;
                    self._editable = false;
                    self._autoFormatValue = false;
                    self._hasInPlaceEditor = false
                }
                ComboBoxCellType.prototype.editorValueType = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._editorValueType
                    }
                    this._editorValueType = value;
                    return this
                };
                ComboBoxCellType.prototype.items = function(items)
                {
                    if (arguments.length === 0)
                    {
                        return this._items
                    }
                    this._items = items;
                    return this
                };
                ComboBoxCellType.prototype.itemHeight = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._itemHeight
                    }
                    this._itemHeight = value;
                    return this
                };
                ComboBoxCellType.prototype.editable = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._editable
                    }
                    else
                    {
                        this._editable = value;
                        return this
                    }
                };
                ComboBoxCellType.prototype.isReservedKey = function(e, context)
                {
                    if (this._hasInPlaceEditor)
                    {
                        return true
                    }
                    return false
                };
                ComboBoxCellType.prototype.paint = function(ctx, value, x, y, w, h, style, context)
                {
                    if (!ctx)
                    {
                        return
                    }
                    Sheets.CellTypeContext.paintBackground(ctx, x, y, w, h, style.backColor, style.backgroundImage, style.backgroundImageLayout, context.imageLoader);
                    var showBarIconOnly = Sheets.CellTypeContext.paintConditionalFormats(ctx, value, x, y, w, h, style, context);
                    context.showBarIconOnly = showBarIconOnly;
                    Sheets.CellTypeContext.paintSparkline(ctx, x, y, w, h, context.sparkline);
                    var showSparklineEx = Sheets.CellTypeContext.paintSparklineEx(ctx, value, x, y, w, h, context.sheet);
                    if (!context.cellOverflowLayout && !showBarIconOnly && !showSparklineEx)
                    {
                        this.paintValue(ctx, value, x, y, w, h, style, context)
                    }
                };
                ComboBoxCellType.prototype.paintValue = function(ctx, value, x, y, w, h, style, options)
                {
                    var btnWidth = DefaultDropDownButtonWidth,
                        txtWidth = Math_max(0, w - btnWidth - 1);
                    if (style.hAlign === 3 && !this._autoFormatValue)
                    {
                        style.hAlign = 0
                    }
                    if (style.wordWrap)
                    {
                        style.wordWrap = false
                    }
                    if (txtWidth > 0 && h > 0)
                    {
                        _super.prototype.paintValue.call(this, ctx, this.getText(value, options), x, y, txtWidth, h, style, options)
                    }
                    ctx.save();
                    if (btnWidth > w || btnWidth > h)
                    {
                        ctx.rect(x, y, w, h);
                        ctx.clip()
                    }
                    ctx.beginPath();
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.fillStyle = "#000000";
                    ctx.moveTo(x + w - btnWidth + 4, y + (h - 2) / 2 - 2.5);
                    ctx.lineTo(x + w - btnWidth + 7, y + (h - 2) / 2 + 3.5);
                    ctx.lineTo(x + w - btnWidth + 10, y + (h - 2) / 2 - 2.5);
                    ctx.fill();
                    ctx.restore()
                };
                ComboBoxCellType.prototype.getText = function(value, options)
                {
                    return value
                };
                ComboBoxCellType.prototype.createEditorElement = function(context)
                {
                    var host = context && context.sheet && context.sheet.parent && context.sheet.parent._host;
                    var zindex = Sheets.util.getPreferredZIndex(host) + 1000;
                    var defaults = context.sheet.defaults;
                    var comboBox = new ComboBox(0, 0, defaults.colWidth, defaults.rowHeight, zindex);
                    comboBox.editorValueType(this._editorValueType);
                    comboBox.items(this._items);
                    comboBox.itemHeight(this._itemHeight);
                    comboBox.editable(this._editable);
                    var editor = comboBox.getComboBox();
                    Object.defineProperty(editor, "comboBox", {
                        value: comboBox, writable: false
                    });
                    return editor
                };
                ComboBoxCellType.prototype.getEditorValue = function(editorContext, context)
                {
                    var comboBox = editorContext.comboBox;
                    if (comboBox)
                    {
                        this._autoFormatValue = !comboBox._isEditorValueInItems
                    }
                    return comboBox && comboBox.editorValue()
                };
                ComboBoxCellType.prototype.setEditorValue = function(editorContext, value, context)
                {
                    var comboBox = editorContext.comboBox;
                    if (comboBox)
                    {
                        comboBox.editorValue(value)
                    }
                };
                ComboBoxCellType.prototype.focus = function(editorContext, context)
                {
                    if (editorContext)
                    {
                        var comboBox = editorContext.comboBox;
                        if (comboBox)
                        {
                            comboBox.focus()
                        }
                    }
                };
                ComboBoxCellType.prototype.selectAll = function(editorContext, context)
                {
                    if (editorContext)
                    {
                        var comboBox = editorContext.comboBox;
                        if (comboBox)
                        {
                            comboBox.selectAll()
                        }
                    }
                };
                ComboBoxCellType.prototype.activateEditor = function(editorContext, cellStyle, cellRect, context)
                {
                    var sheet = context.sheet,
                        row = context.row,
                        col = context.col;
                    var comboBox = editorContext.comboBox;
                    if (comboBox)
                    {
                        comboBox.editorValueType(this._editorValueType);
                        comboBox.items(this._items);
                        comboBox.itemHeight(this._itemHeight);
                        comboBox.editable(this._editable);
                        var dropDownList = comboBox._dropDownList;
                        dropDownList.bind(EndEdit, function(event, args)
                        {
                            var keyCode = args.keyCode;
                            if (keyCode === 37)
                            {
                                sheet._editorStatus = 1;
                                Sheets.SpreadActions.navigationLeft.apply(sheet)
                            }
                            else if (keyCode === 39)
                            {
                                sheet._editorStatus = 1;
                                Sheets.SpreadActions.navigationRight.apply(sheet)
                            }
                            else if (keyCode === 9)
                            {
                                Sheets.SpreadActions.commitInputNavigationTabNext.apply(sheet)
                            }
                            else if (keyCode === 13)
                            {
                                Sheets.SpreadActions.commitInputNavigationDown.apply(sheet)
                            }
                            else if (keyCode === 27)
                            {
                                Sheets.SpreadActions.cancelInput.apply(sheet)
                            }
                            else if (args.isMouse === true && comboBox._isDisplayMode === true)
                            {
                                sheet.endEdit()
                            }
                        });
                        var comboBoxEditor = comboBox._comboBoxEditor;
                        comboBoxEditor.bind(EndEdit, function(event, args)
                        {
                            if (args.isMouse === true)
                            {
                                sheet.endEdit()
                            }
                        });
                        var dropDownButton = comboBox._dropDownButton;
                        dropDownButton.bind(EndEdit, function(event, args)
                        {
                            if (args.isMouse === true)
                            {
                                sheet.endEdit()
                            }
                        })
                    }
                    this._hasInPlaceEditor = true
                };
                ComboBoxCellType.prototype.deactivateEditor = function(editorContext, context)
                {
                    if (editorContext)
                    {
                        var comboBox = editorContext.comboBox;
                        if (comboBox)
                        {
                            var dropDownList = comboBox._dropDownList,
                                comboBoxEditor = comboBox._comboBoxEditor,
                                dropDownButton = comboBox._dropDownButton;
                            dropDownList.unbind(EndEdit);
                            comboBoxEditor.unbind(EndEdit);
                            dropDownButton.unbind(EndEdit);
                            comboBox.closeDropDownList();
                            comboBox._isDisplayMode = false;
                            var locator = editorContext._editingLocator;
                            if (locator)
                            {
                                var host = context && context.sheet && context.sheet._getHost();
                                if (host)
                                {
                                    host.removeChild(locator)
                                }
                            }
                        }
                    }
                    this._hasInPlaceEditor = false
                };
                ComboBoxCellType.prototype.updateEditor = function(editorContext, cellStyle, cellRect, context)
                {
                    var sheet = editorContext && context && context.sheet;
                    if (!sheet)
                    {
                        return
                    }
                    var comboBox = editorContext.comboBox;
                    if (cellStyle && comboBox)
                    {
                        var render = sheet._render;
                        comboBox.updateStyle(cellStyle.backColor, cellStyle.foreColor, render._getZoomFont(cellStyle.font || render._getDefaultFont()))
                    }
                    if (cellRect && comboBox)
                    {
                        var offset = sheet._eventHandler._getCanvasPosition(),
                            bounds = sheet._bounds;
                        comboBox.updateLocationAndSize(offset.left + bounds.x + cellRect.x - 1, offset.top + bounds.y + cellRect.y - 1, cellRect.width + 1, cellRect.height + 1)
                    }
                };
                ComboBoxCellType.prototype.format = function(value, format, conditionalForeColor, context)
                {
                    var self = this,
                        editorValueType = self._editorValueType,
                        items = self._items;
                    if (items)
                    {
                        var count = items.length;
                        if (editorValueType === 0)
                        {}
                        else if (editorValueType === 1)
                        {
                            var index = parseInt(value);
                            if (0 <= index && index < count)
                            {
                                var item = items[index];
                                if (item !== keyword_undefined && item !== keyword_null)
                                {
                                    value = (item.hasOwnProperty("text") ? item.text : item)
                                }
                            }
                        }
                        else if (editorValueType === 2)
                        {
                            for (var i = 0; i < count; i++)
                            {
                                var item = items[i];
                                if (item && item.hasOwnProperty("value") && item.value === value)
                                {
                                    value = item.text;
                                    break
                                }
                            }
                        }
                    }
                    return _super.prototype.format.call(this, value, format, conditionalForeColor)
                };
                ComboBoxCellType.prototype.parse = function(text, formatStr, context)
                {
                    var self = this,
                        editorValueType = self._editorValueType,
                        items = self._items;
                    var parseText = _super.prototype.parse.call(this, text, formatStr);
                    if (items)
                    {
                        var count = items.length;
                        if (editorValueType === 0)
                        {
                            return parseText
                        }
                        else if (editorValueType === 1)
                        {
                            for (var i = 0; i < count; i++)
                            {
                                var item = items[i];
                                if ((item && item.hasOwnProperty("text") && item.text === parseText) || (item === parseText))
                                {
                                    return i
                                }
                            }
                        }
                        else if (editorValueType === 2)
                        {
                            for (var i = 0; i < count; i++)
                            {
                                var item = items[i];
                                if ((item && item.hasOwnProperty("text") && item.text === parseText))
                                {
                                    return item.value
                                }
                            }
                        }
                    }
                    return parseText
                };
                ComboBoxCellType.prototype.getHitInfo = function(x, y, cellStyle, cellRect, context)
                {
                    if (!context)
                    {
                        return keyword_null
                    }
                    var sheetArea = context.sheetArea,
                        sheet = context.sheet;
                    if ((sheetArea === keyword_null || sheetArea === keyword_undefined || sheetArea === 3) && cellRect)
                    {
                        var x2 = cellRect.x + cellRect.width;
                        var info = {
                                x: x, y: y, row: context.row, col: context.col, cellStyle: cellStyle, cellRect: cellRect, sheetArea: sheetArea, sheet: sheet
                            };
                        if (x2 - DefaultDropDownButtonWidth <= x && x < x2)
                        {
                            info.isReservedLocation = true
                        }
                        return info
                    }
                    return keyword_null
                };
                ComboBoxCellType.prototype.processMouseDown = function(hitInfo)
                {
                    var sheet = hitInfo.sheet,
                        sheetArea = hitInfo.sheetArea;
                    if ((sheetArea === keyword_null || sheetArea === keyword_undefined || sheetArea === 3) && hitInfo.isReservedLocation && sheet)
                    {
                        sheet.startEdit();
                        var editor = sheet._editor;
                        var comboBox = (editor && editor.comboBox);
                        if (comboBox)
                        {
                            var isFirefox = $.browser && $.browser.mozilla;
                            if (isFirefox)
                            {
                                comboBox._dropDownButton._showTime = (new Date).valueOf()
                            }
                            comboBox.showDropDownList();
                            comboBox._isDisplayMode = true
                        }
                    }
                };
                ComboBoxCellType.prototype.getAutoFitWidth = function(value, text, cellStyle, zoomFactor, context)
                {
                    var width = Sheets.CellTypeContext.getAutoFitWidth(value, text, cellStyle, zoomFactor, context);
                    return width + DefaultDropDownButtonWidth
                };
                ComboBoxCellType.prototype.getAutoFitHeight = function(value, text, cellStyle, zoomFactor, context)
                {
                    return Sheets.CellTypeContext.getAutoFitHeight(value, text, cellStyle, zoomFactor, context)
                };
                ComboBoxCellType.prototype.isImeAware = function(context)
                {
                    return true
                };
                ComboBoxCellType.prototype._isDefaultValue = function(propertyName, value)
                {
                    switch (propertyName)
                    {
                        case"editorValueType":
                            return value === 0;
                        case"items":
                            return value === [];
                        case"itemHeight":
                            return value === 22;
                        case"editable":
                            return value === false;
                        default:
                            return false
                    }
                };
                ComboBoxCellType.prototype.toJSON = function()
                {
                    var self = this;
                    var dictData = {
                            typeName: self.typeName, editorValueType: self.editorValueType(), items: self.items(), itemHeight: self.itemHeight(), editable: self.editable()
                        };
                    var settings = {};
                    for (var item in dictData)
                    {
                        var value = dictData[item];
                        if (!self._isDefaultValue(item, value))
                        {
                            settings[item] = value
                        }
                    }
                    return settings
                };
                ComboBoxCellType.prototype.fromJSON = function(settings, isNoneSchema)
                {
                    if (!settings)
                    {
                        return
                    }
                    if (settings.editorValueType !== keyword_null && settings.editorValueType !== keyword_undefined)
                    {
                        this.editorValueType(settings.editorValueType)
                    }
                    if (settings.items !== keyword_null && settings.items !== keyword_undefined)
                    {
                        this.items(settings.items)
                    }
                    if (settings.itemHeight !== keyword_null && settings.itemHeight !== keyword_undefined)
                    {
                        this.itemHeight(settings.itemHeight)
                    }
                    if (settings.editable !== keyword_null && settings.editable !== keyword_undefined)
                    {
                        this.editable(settings.editable)
                    }
                };
                return ComboBoxCellType
            })(Sheets.BaseCellType);
        Sheets.ComboBoxCellType = ComboBoxCellType;
        var click = "click",
            mouseenter = "mouseenter",
            mouseleave = "mouseleave",
            keydown = "keydown",
            keyup = "keyup",
            EndEdit = "EndEdit" + _gcEditingInput;
        var ComboBox = (function()
            {
                function ComboBox(left, top, width, height, zindex)
                {
                    var self = this;
                    self._DOMObject = document.createElement("div");
                    self._DOMObject.className = "gcComboBox";
                    self._bindEvent();
                    self._setDefaultCSS(zindex);
                    $(self._DOMObject).css(cssLeft, left).css(cssTop, top).css(cssWidth, width).css(cssHeight, height);
                    var comboBoxEditorWidth = Math_max(0, width - DefaultDropDownButtonWidth);
                    self._comboBoxEditor = new ComboBoxEditor(this, 0, 0, comboBoxEditorWidth, height);
                    self._comboBoxEditor.appendTo(this._DOMObject);
                    self._dropDownButton = new DropDownButton(this, comboBoxEditorWidth, 0, width - comboBoxEditorWidth, height);
                    self._dropDownButton.appendTo(this._DOMObject);
                    var dropDownList = new DropDownList(0, height - 2 * ComboBoxBorderWidth, width - 2 * ComboBoxBorderWidth, height, zindex);
                    dropDownList.bind(dropDownList.CloseDropDown, function()
                    {
                        self._comboBoxEditor.focus()
                    });
                    dropDownList.bind(dropDownList.ShowDropDown, function()
                    {
                        self._comboBoxEditor.focus()
                    });
                    dropDownList.bind(dropDownList.SelectedIndexChanged, function(event)
                    {
                        self.onSelectedIndexChanged(event)
                    });
                    dropDownList.appendTo(this._DOMObject);
                    self._dropDownList = dropDownList;
                    self._editorValueType = 0;
                    self._items = []
                }
                ComboBox.prototype._bindEvent = function()
                {
                    var self = this;
                    var $comboBox = $(this._DOMObject);
                    $comboBox.bind(keydown, function(event)
                    {
                        self._onKeydown.call(self, event)
                    })
                };
                ComboBox.prototype._onKeydown = function(event)
                {
                    if (this._dropDownList)
                    {
                        this._dropDownList._onKeydown(event)
                    }
                };
                ComboBox.prototype._setDefaultCSS = function(zindex)
                {
                    $(this._DOMObject).css(cssPosition, cssAbsolute).css(cssZIndex, zindex || 0).attr(attrGcUIElement, "gcComboBox")
                };
                ComboBox.prototype.getComboBox = function()
                {
                    return this._DOMObject
                };
                ComboBox.prototype.updateLocationAndSize = function(left, top, width, height)
                {
                    $(this._DOMObject).css(cssLeft, left).css(cssTop, top).css(cssWidth, width).css(cssHeight, height);
                    var comboBoxEditorWidth = Math_max(0, width - DefaultDropDownButtonWidth);
                    this._comboBoxEditor.updateLocationAndSize(0, 0, comboBoxEditorWidth, height);
                    this._dropDownButton.updateLocationAndSize(comboBoxEditorWidth, 0, width - comboBoxEditorWidth, height);
                    var dropDownList = this._dropDownList;
                    dropDownList.updateLocation(0, height - 2 * ComboBoxBorderWidth);
                    dropDownList.width(width - 2 * ComboBoxBorderWidth);
                    dropDownList._updateItemWidth()
                };
                ComboBox.prototype.updateStyle = function(backColor, foreColor, font)
                {
                    this._comboBoxEditor.updateStyle(backColor, foreColor, font);
                    this._dropDownButton.updateStyle(backColor, foreColor, font);
                    this._dropDownList.updateStyle(backColor, foreColor, font)
                };
                ComboBox.prototype.isDropDownListShown = function()
                {
                    return this._dropDownList.isShown()
                };
                ComboBox.prototype.showDropDownList = function()
                {
                    this._dropDownList.show()
                };
                ComboBox.prototype.closeDropDownList = function()
                {
                    this._dropDownList.close()
                };
                ComboBox.prototype.toggleDropDownListShow = function()
                {
                    this._dropDownList.toggleShow()
                };
                ComboBox.prototype.items = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._items
                    }
                    else
                    {
                        this._items = value;
                        this._dropDownList.items(value);
                        return this
                    }
                };
                ComboBox.prototype.itemHeight = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._dropDownList.itemHeight()
                    }
                    else
                    {
                        this._dropDownList.itemHeight(value);
                        return this
                    }
                };
                ComboBox.prototype.editable = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._comboBoxEditor.editable()
                    }
                    else
                    {
                        this._comboBoxEditor.editable(value);
                        return this
                    }
                };
                ComboBox.prototype.editorValueType = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._editorValueType
                    }
                    else
                    {
                        this._editorValueType = value;
                        return this
                    }
                };
                ComboBox.prototype.editorValue = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._editorValue
                    }
                    else
                    {
                        if (value !== this._editorValue)
                        {
                            this._editorValue = value;
                            this._updateEditorValue(value)
                        }
                        return this
                    }
                };
                ComboBox.prototype._updateEditorValue = function(value)
                {
                    var self = this,
                        text = self.valueToText(value);
                    self._comboBoxEditor.text(text);
                    self._dropDownList.selectByText(text)
                };
                ComboBox.prototype.valueToText = function(value)
                {
                    var text,
                        self = this,
                        items = self._items,
                        itemsLength = items.length,
                        editorValueType = self._editorValueType;
                    self._isEditorValueInItems = true;
                    switch (editorValueType)
                    {
                        case 1:
                            var item = items[value];
                            text = item && item.hasOwnProperty("text") ? item.text : item;
                            if (text === keyword_undefined)
                            {
                                text = value;
                                self._isEditorValueInItems = false
                            }
                            break;
                        case 0:
                            text = value;
                            for (var j = 0; j < itemsLength; j++)
                            {
                                var item = items[j];
                                if ((item && item.hasOwnProperty("text") && item.text === value) || item === value)
                                {
                                    break
                                }
                            }
                            if (j >= itemsLength)
                            {
                                self._isEditorValueInItems = false
                            }
                            break;
                        case 2:
                            for (var i = 0; i < itemsLength; i++)
                            {
                                var item = items[i];
                                if (item && item.hasOwnProperty("value") && item.value === value)
                                {
                                    text = item.text;
                                    break
                                }
                            }
                            if (i >= itemsLength)
                            {
                                text = value;
                                self._isEditorValueInItems = false
                            }
                            break;
                        default:
                            break
                    }
                    if (value === keyword_null || value === keyword_undefined)
                    {
                        text = ""
                    }
                    return text
                };
                ComboBox.prototype.textToValue = function(text)
                {
                    var self = this,
                        items = self._items,
                        itemsLength = items.length,
                        editorValueType = self._editorValueType,
                        value = text;
                    if (editorValueType === 0)
                    {}
                    else if (editorValueType === 1)
                    {
                        for (var i = 0; i < itemsLength; i++)
                        {
                            var item = items[i];
                            if ((item && item.hasOwnProperty("text") && item.text === text) || (item === text))
                            {
                                value = i
                            }
                        }
                    }
                    else if (editorValueType === 2)
                    {
                        for (var j = 0; j < itemsLength; j++)
                        {
                            var item = items[j];
                            if (item && item.hasOwnProperty("text") && item.text === text)
                            {
                                value = item.value
                            }
                            else if (item === text)
                            {
                                value = keyword_undefined
                            }
                        }
                    }
                    return value
                };
                ComboBox.prototype.onSelectedIndexChanged = function(event)
                {
                    var self = this,
                        dropDownList = self._dropDownList,
                        selectedIndex = dropDownList.selectedIndex();
                    var value = dropDownList.getSelectedValue(selectedIndex, self._items, self._editorValueType);
                    if (value !== keyword_null && value !== keyword_undefined)
                    {
                        self.editorValue(value)
                    }
                };
                ComboBox.prototype.autoSelectByText = function(text)
                {
                    var i;
                    if (text)
                    {
                        var items = this._items,
                            length = items.length;
                        for (i = 0; i < length; i++)
                        {
                            var item = items[i];
                            if (item.hasOwnProperty("text"))
                            {
                                item = item.text
                            }
                            if (item.toString().substr(0, text.length) === text)
                            {
                                break
                            }
                        }
                        if (i >= length)
                        {
                            i = -1
                        }
                    }
                    else
                    {
                        i = -1
                    }
                    this._dropDownList.setSelectedIndexInternal(i)
                };
                ComboBox.prototype.focus = function()
                {
                    this._comboBoxEditor.focus()
                };
                ComboBox.prototype.selectAll = function()
                {
                    this._comboBoxEditor.selectAll()
                };
                return ComboBox
            })();
        var ComboBoxEditor = (function()
            {
                function ComboBoxEditor(comboBox, left, top, width, height)
                {
                    var self = this;
                    self._comboBox = comboBox;
                    self._editable = false;
                    self._divObject = document.createElement("div");
                    self._textareaObject = document.createElement("textarea");
                    self._DOMObject = self._divObject;
                    self._DOMObject.className = "gcComboBoxEditor";
                    self._setDefaultCSS();
                    self._bindEvent();
                    self.updateLocationAndSize(left, top, width, height)
                }
                ComboBoxEditor.prototype._setDefaultCSS = function()
                {
                    var border = ComboBoxBorderWidth + "px solid black";
                    $(this._DOMObject).css(cssMargin, 0).css(cssOverflow, "hidden").css(cssResize, cssNone).css(cssPosition, cssAbsolute).css("border-bottom", border).css("border-left", border).css("border-top", border).css(cssPadding, ComboBoxEditorTopPadding + "px 0px 0px " + ComboBoxEditorLeftPadding + "px").css(cssOutline, cssNone).css(cssBackgroundColor, "white").css(cssWhiteSpace, "nowrap").css(cssBoxSizing, "content-box").attr(attrGcUIElement, "gcComboBoxEditor").attr(attrTabIndex, -1)
                };
                ComboBoxEditor.prototype._bindEvent = function()
                {
                    var self = this;
                    $(this._textareaObject).bind({
                        keyup: function(event)
                        {
                            var text = self._DOMObject.value;
                            self._text = text;
                            var value = self._comboBox.textToValue(text);
                            self._comboBox.editorValue(value);
                            self._comboBox.autoSelectByText(text);
                            self._removeTip()
                        }, mouseenter: function()
                            {
                                self._updateTip()
                            }, mouseleave: function()
                            {
                                self._removeTip()
                            }
                    });
                    $(this._divObject).bind({
                        click: function(event)
                        {
                            if (self._comboBox._isDisplayMode)
                            {
                                self._trigger(EndEdit, {isMouse: true})
                            }
                            else
                            {
                                self._comboBox.toggleDropDownListShow()
                            }
                        }, mouseenter: function()
                            {
                                self._updateTip()
                            }, mouseleave: function()
                            {
                                self._removeTip()
                            }
                    })
                };
                ComboBoxEditor.prototype._removeTip = function()
                {
                    $(this._DOMObject).removeAttr("title")
                };
                ComboBoxEditor.prototype._updateTip = function()
                {
                    if (!this._comboBox || !this._comboBox._dropDownList)
                    {
                        return
                    }
                    var textWidth = this._comboBox._dropDownList.measureText(this._text);
                    var $DOMObject = $(this._DOMObject);
                    var containerWidth = $DOMObject.width();
                    if (textWidth > containerWidth + ComboBoxEditorLeftPadding)
                    {
                        $DOMObject.attr("title", this._text)
                    }
                    else
                    {
                        $DOMObject.removeAttr("title")
                    }
                };
                ComboBoxEditor.prototype.updateLocationAndSize = function(left, top, width, height)
                {
                    width -= ComboBoxBorderWidth;
                    height -= 2 * ComboBoxBorderWidth;
                    $(this._DOMObject).css(cssLeft, left).css(cssTop, top).css(cssWidth, width - ComboBoxEditorLeftPadding).css(cssHeight, height - ComboBoxEditorTopPadding)
                };
                ComboBoxEditor.prototype._getLocationAndSize = function()
                {
                    var $DOMObject = $(this._DOMObject);
                    return {
                            left: parseInt($DOMObject.css(cssLeft)), top: parseInt($DOMObject.css(cssTop)), width: parseInt($DOMObject.css(cssWidth)), height: parseInt($DOMObject.css(cssHeight))
                        }
                };
                ComboBoxEditor.prototype._getStyle = function()
                {
                    var $DOMObject = $(this._DOMObject);
                    return {
                            backColor: $DOMObject.css(cssBackgroundColor), foreColor: $DOMObject.css(cssColor), font: $DOMObject.css(cssFont)
                        }
                };
                ComboBoxEditor.prototype.updateStyle = function(backColor, foreColor, font)
                {
                    $(this._DOMObject).css(cssBackgroundColor, backColor).css(cssColor, foreColor).css(cssFont, font)
                };
                ComboBoxEditor.prototype.appendTo = function(parent)
                {
                    parent.appendChild(this._DOMObject)
                };
                ComboBoxEditor.prototype.editable = function(isEditable)
                {
                    if (arguments.length === 0)
                    {
                        return this._editable
                    }
                    else
                    {
                        if (this._editable !== isEditable)
                        {
                            this._editable = isEditable;
                            this._changeEditor(isEditable);
                            return this
                        }
                    }
                };
                ComboBoxEditor.prototype._changeEditor = function(isEditable)
                {
                    var self = this;
                    var comboxElement = self._comboBox.getComboBox();
                    var locationAndSize = self._getLocationAndSize();
                    var style = self._getStyle();
                    comboxElement.removeChild(self._DOMObject);
                    if (isEditable)
                    {
                        self._DOMObject = self._textareaObject
                    }
                    else
                    {
                        self._DOMObject = self._divObject
                    }
                    $(self._DOMObject).appendTo(comboxElement);
                    self._setDefaultCSS();
                    self.updateStyle(style.backColor, style.foreColor, style.font);
                    self.updateLocationAndSize(locationAndSize.left, locationAndSize.top, locationAndSize.width, locationAndSize.height)
                };
                ComboBoxEditor.prototype.text = function(newText)
                {
                    if (arguments.length === 0)
                    {
                        return this._text
                    }
                    else
                    {
                        if (newText !== this._text)
                        {
                            this._text = newText;
                            var tagName = this._DOMObject.tagName.toUpperCase();
                            if (tagName === "DIV")
                            {
                                this._DOMObject.textContent = newText
                            }
                            else
                            {
                                this._DOMObject.value = newText
                            }
                        }
                    }
                };
                ComboBoxEditor.prototype.focus = function()
                {
                    var element = this._DOMObject;
                    element.focus();
                    if (element.tagName.toUpperCase() === "TEXTAREA")
                    {
                        element.selectionStart = element.value.length
                    }
                };
                ComboBoxEditor.prototype.selectAll = function()
                {
                    var element = this._DOMObject;
                    if (element.tagName.toUpperCase() === "TEXTAREA")
                    {
                        element.select()
                    }
                };
                ComboBoxEditor.prototype.bind = function(type, data, fn)
                {
                    $(this._DOMObject).bind(type, data, fn)
                };
                ComboBoxEditor.prototype.unbind = function(type, fn)
                {
                    $(this._DOMObject).unbind(type, fn)
                };
                ComboBoxEditor.prototype._trigger = function(type, data)
                {
                    $(this._DOMObject).trigger(type, data)
                };
                return ComboBoxEditor
            })();
        var DropDownButton = (function()
            {
                function DropDownButton(comboBox, left, top, width, height)
                {
                    this._comboBox = comboBox;
                    this._DOMObject = document.createElement("div");
                    this._DOMObject.className = "gcDropDownButton";
                    this._setDefaultCSS();
                    this._bindEvent();
                    var canvas = document.createElement("canvas");
                    canvas.className = "gcDropDownButtonIcon";
                    this._canvas = canvas;
                    this.updateLocationAndSize(left, top, width, height);
                    this._DOMObject.appendChild(canvas)
                }
                DropDownButton.prototype._setDefaultCSS = function()
                {
                    var border = ComboBoxBorderWidth + "px solid black";
                    $(this._DOMObject).css("border-top", border).css("border-right", border).css("border-bottom", border).css(cssPosition, cssAbsolute).css(cssBackgroundColor, "white").css(cssBoxSizing, "content-box").attr(attrGcUIElement, "gcDropDownButton")
                };
                DropDownButton.prototype._bindEvent = function()
                {
                    var self = this;
                    $(this._DOMObject).bind(click, function(event)
                    {
                        if (self._showTime !== keyword_undefined)
                        {
                            var lastUpdateShowTime = self._showTime;
                            self._showTime = keyword_undefined;
                            var currentTime = (new Date).valueOf();
                            if (currentTime - lastUpdateShowTime < 100)
                            {
                                return
                            }
                        }
                        if (self._comboBox._isDisplayMode)
                        {
                            self._trigger(EndEdit, {isMouse: true})
                        }
                        else
                        {
                            self._comboBox.toggleDropDownListShow()
                        }
                    })
                };
                DropDownButton.prototype._paintIcon = function()
                {
                    var canvas = this._canvas;
                    if (!canvas)
                    {
                        return
                    }
                    var width = canvas.width,
                        height = canvas.height;
                    var context = canvas.getContext("2d");
                    context.beginPath();
                    context.lineWidth = 2;
                    context.fillStyle = "#000000";
                    context.moveTo(width - DefaultDropDownButtonWidth + 4, (height - 2) / 2 - 2.5);
                    context.lineTo(width - DefaultDropDownButtonWidth + 7, (height - 2) / 2 + 3.5);
                    context.lineTo(width - DefaultDropDownButtonWidth + 10, (height - 2) / 2 - 2.5);
                    context.fill()
                };
                DropDownButton.prototype.updateLocationAndSize = function(left, top, width, height)
                {
                    width -= ComboBoxBorderWidth;
                    height -= 2 * ComboBoxBorderWidth;
                    $(this._DOMObject).css(cssLeft, left).css(cssTop, top).css(cssWidth, width).css(cssHeight, height);
                    $(this._canvas).attr(cssWidth, width).attr(cssHeight, height);
                    this._paintIcon()
                };
                DropDownButton.prototype.updateStyle = function(backColor, foreColor, font)
                {
                    $(this._DOMObject).css(cssBackgroundColor, backColor).css(cssColor, foreColor).css(cssFont, font)
                };
                DropDownButton.prototype.appendTo = function(parent)
                {
                    parent.appendChild(this._DOMObject)
                };
                DropDownButton.prototype.bind = function(type, data, fn)
                {
                    $(this._DOMObject).bind(type, data, fn)
                };
                DropDownButton.prototype.unbind = function(type, fn)
                {
                    $(this._DOMObject).unbind(type, fn)
                };
                DropDownButton.prototype._trigger = function(type, data)
                {
                    $(this._DOMObject).trigger(type, data)
                };
                return DropDownButton
            })();
        var DropDownWindow = (function()
            {
                function DropDownWindow(left, top, width, height, zindex)
                {
                    this._DOMObject = document.createElement("div");
                    this._isShown = false;
                    this._setDefaultCSS(zindex);
                    this._width = width;
                    this._height = height;
                    $(this._DOMObject).css(cssWidth, width).css(cssHeight, height);
                    this.updateLocation(left, top)
                }
                DropDownWindow.prototype._setDefaultCSS = function(zindex)
                {
                    $(this._DOMObject).css(cssPosition, cssAbsolute).css(cssBorder, "1px solid").css(cssBackgroundColor, "white").css(cssZIndex, zindex || 0).css(cssOutline, cssNone).css("display", "none").css("cursor", "default").css(cssBoxSizing, "content-box").attr(attrGcUIElement, "gcDropDownWindow").attr(attrTabIndex, -1)
                };
                DropDownWindow.prototype.show = function()
                {
                    this.isShown(true)
                };
                DropDownWindow.prototype.close = function()
                {
                    this.isShown(false)
                };
                DropDownWindow.prototype.toggleShow = function()
                {
                    this.isShown(!this._isShown)
                };
                DropDownWindow.prototype.isShown = function(newIsShown)
                {
                    if (arguments.length === 0)
                    {
                        return this._isShown
                    }
                    else
                    {
                        if (newIsShown !== this._isShown)
                        {
                            this._isShown = newIsShown;
                            this._updateIsShown()
                        }
                        return this
                    }
                };
                DropDownWindow.prototype._updateIsShown = function()
                {
                    if (this._isShown)
                    {
                        this._show()
                    }
                    else
                    {
                        this._close()
                    }
                };
                DropDownWindow.prototype._show = function()
                {
                    $(this._DOMObject).show()
                };
                DropDownWindow.prototype._close = function()
                {
                    $(this._DOMObject).hide()
                };
                DropDownWindow.prototype.width = function(newWidth)
                {
                    if (arguments.length === 0)
                    {
                        return this._width
                    }
                    else
                    {
                        if (newWidth > 0)
                        {
                            this._width = newWidth;
                            this._updateWidth()
                        }
                    }
                };
                DropDownWindow.prototype._updateWidth = function()
                {
                    $(this._DOMObject).css(cssWidth, this._width)
                };
                DropDownWindow.prototype.height = function(newHeight)
                {
                    if (arguments.length === 0)
                    {
                        return this._height
                    }
                    else
                    {
                        if (newHeight > 0)
                        {
                            this._height = newHeight;
                            this._updateHeight()
                        }
                    }
                };
                DropDownWindow.prototype._updateHeight = function()
                {
                    $(this._DOMObject).css(cssHeight, this._height)
                };
                DropDownWindow.prototype.font = function(newFont)
                {
                    if (arguments.length === 0)
                    {
                        return this._font
                    }
                    else
                    {
                        this._font = newFont;
                        this._updateFont()
                    }
                };
                DropDownWindow.prototype._updateFont = function()
                {
                    $(this._DOMObject).css(cssFont, this._font)
                };
                DropDownWindow.prototype.updateLocation = function(left, top)
                {
                    $(this._DOMObject).css(cssLeft, left).css(cssTop, top)
                };
                DropDownWindow.prototype.updateStyle = function(backColor, foreColor, font)
                {
                    $(this._DOMObject).css(cssBackgroundColor, backColor).css(cssColor, foreColor);
                    this.font(font)
                };
                DropDownWindow.prototype.appendTo = function(parent)
                {
                    parent.appendChild(this._DOMObject)
                };
                return DropDownWindow
            })();
        var DropDownList = (function(_super)
            {
                __extends(DropDownList, _super);
                function DropDownList(left, top, width, height, zindex)
                {
                    _super.call(this, left, top, width, height, zindex);
                    this._itemCount = 0;
                    this.SCROLLBAR_SIZE = 18;
                    this.HOVER_COLOR = "lightgrey";
                    this.SELECTED_COLOR = "#1E90FF";
                    this.ShowDropDown = "ShowDropDown" + _gcEditingInput;
                    this.CloseDropDown = "CloseDropDown" + _gcEditingInput;
                    this.SelectedIndexChanged = "SelectedIndexChanged" + _gcEditingInput;
                    this._DOMObject.className = "gcDropDownList";
                    this._divList = document.createElement("div");
                    this._divList.className = "gcDivList";
                    this._DOMObject.appendChild(this._divList);
                    this._scrollablePanel = new Sheets.ScrollablePanel(this._DOMObject, this._divList);
                    this._itemHeight = 22;
                    this._itemCountPerPage = DefaultMaxVisibleItemCount;
                    this._selectedIndex = -1
                }
                DropDownList.prototype._show = function()
                {
                    _super.prototype._show.call(this);
                    this._bindEvent();
                    this._isNeedVScrollbar = false;
                    this._updateItemHeight();
                    this._updateItemWidth();
                    if (this._isNeedVScrollbar)
                    {
                        this._scrollablePanel.verticalSmallChange($(this._divList).children().height());
                        this._scrollablePanel.refreshLayout(false)
                    }
                    this._addSelectedEffect();
                    this._trigger(this.ShowDropDown, {})
                };
                DropDownList.prototype._close = function()
                {
                    this._unbindEvent();
                    this._removeSelectedEffect();
                    _super.prototype._close.call(this);
                    this._trigger(this.CloseDropDown, {})
                };
                DropDownList.prototype.items = function(newItems)
                {
                    if (arguments.length === 0)
                    {
                        return this._items
                    }
                    else
                    {
                        if (newItems)
                        {
                            this._items = newItems;
                            this._updateItems();
                            return this
                        }
                    }
                };
                DropDownList.prototype._updateItems = function()
                {
                    this._removeDivListItems();
                    this._addAllItems()
                };
                DropDownList.prototype._appendMeasureSpanToBody = function()
                {
                    this._measureSpan = document.createElement("span");
                    $(this._measureSpan).css("display", "none").css(cssFont, this.font());
                    document.body.appendChild(this._measureSpan)
                };
                DropDownList.prototype._removeMeasureSpanFromBody = function()
                {
                    document.body.removeChild(this._measureSpan)
                };
                DropDownList.prototype._measureTextWidth = function(text)
                {
                    this._measureSpan.textContent = text;
                    return $(this._measureSpan).width() + 2 + DropDownItemLeftPadding
                };
                DropDownList.prototype._measureTextHeight = function(text)
                {
                    this._measureSpan.textContent = text;
                    return $(this._measureSpan).height()
                };
                DropDownList.prototype._addAllItems = function()
                {
                    var items = this._items;
                    if (items)
                    {
                        for (var i = 0, length = items.length; i < length; i++)
                        {
                            var item = items[i];
                            this._addItem(item.hasOwnProperty("text") ? item.text : item)
                        }
                    }
                };
                DropDownList.prototype._addItem = function(item)
                {
                    var itemClassName = "gcItem" + this._itemCount;
                    var newItem = document.createElement("div");
                    newItem.className = itemClassName;
                    var spanText = document.createElement("span");
                    spanText.textContent = item.toString();
                    spanText.style.paddingLeft = DropDownItemLeftPadding + "px";
                    newItem.appendChild(spanText);
                    this._divList.appendChild(newItem);
                    this._itemCount++;
                    var self = this;
                    $(newItem).bind(click, function(event)
                    {
                        self._onMouseClickItem(this, event)
                    }).bind(mouseenter, function(event)
                    {
                        self._onMouseEnterItem(this, event)
                    }).bind(mouseleave, function(event)
                    {
                        self._onMouseLeaveItem(this, event)
                    })
                };
                DropDownList.prototype._onMouseClickItem = function(item, event)
                {
                    var index = $(item).index();
                    this.selectedIndex(index);
                    this.close();
                    this._trigger(EndEdit, {isMouse: true})
                };
                DropDownList.prototype._onMouseEnterItem = function(item, event)
                {
                    var $item = $(item);
                    item.oldBackColor = $item.css(cssBackgroundColor);
                    $item.css(cssBackgroundColor, this.HOVER_COLOR)
                };
                DropDownList.prototype._onMouseLeaveItem = function(item, event)
                {
                    $(item).css(cssBackgroundColor, item.oldBackColor || "")
                };
                DropDownList.prototype._addSelectedEffect = function()
                {
                    var index = this._selectedIndex;
                    if (0 <= index && index < this._itemCount)
                    {
                        $(this._divList).children("div:nth(" + index + ")").css(cssBackgroundColor, this.SELECTED_COLOR);
                        this.scrollToIndex(index)
                    }
                };
                DropDownList.prototype._removeSelectedEffect = function()
                {
                    var index = this._selectedIndex;
                    if (0 <= index && index < this._itemCount)
                    {
                        $(this._divList).children("div:nth(" + index + ")").css(cssBackgroundColor, "")
                    }
                };
                DropDownList.prototype._bindEvent = function()
                {
                    var self = this;
                    $(this._DOMObject).bind(keydown, function(event)
                    {
                        self._onKeydown.call(self, event)
                    })
                };
                DropDownList.prototype._unbindEvent = function()
                {
                    $(this._DOMObject).unbind(keydown)
                };
                DropDownList.prototype._onKeydown = function(event)
                {
                    this._navigation(event)
                };
                DropDownList.prototype._navigation = function(event)
                {
                    if (event.ctrlKey || event.shiftKey || event.altKey)
                    {
                        return
                    }
                    var isShown = this.isShown();
                    var step = 1;
                    var itemCount = this._itemCount;
                    var selectedIndex = this._selectedIndex;
                    var newSelectedIndex = 0;
                    switch (event.which)
                    {
                        case 38:
                            if (selectedIndex >= 0 && selectedIndex < itemCount)
                            {
                                newSelectedIndex = selectedIndex - step
                            }
                            if (newSelectedIndex >= 0 && newSelectedIndex < itemCount)
                            {
                                this.selectedIndex(newSelectedIndex)
                            }
                            if (isShown)
                            {
                                this.scrollToIndex(newSelectedIndex)
                            }
                            Sheets.util.cancelDefault(event);
                            break;
                        case 40:
                            if (selectedIndex >= 0 && selectedIndex < itemCount)
                            {
                                newSelectedIndex = selectedIndex + step
                            }
                            if (newSelectedIndex >= 0 && newSelectedIndex < itemCount)
                            {
                                this.selectedIndex(newSelectedIndex)
                            }
                            if (isShown)
                            {
                                this.scrollToIndex(newSelectedIndex)
                            }
                            Sheets.util.cancelDefault(event);
                            break;
                        case 13:
                            this.selectedIndex(this._selectedIndex);
                            this.close();
                            this._trigger(EndEdit, {keyCode: event.keyCode});
                            Sheets.util.cancelDefault(event);
                            break;
                        case 27:
                            this.close();
                            this._trigger(EndEdit, {keyCode: event.keyCode});
                            Sheets.util.cancelDefault(event);
                            break;
                        case 37:
                            this.selectedIndex(this._selectedIndex);
                            this.close();
                            this._trigger(EndEdit, {keyCode: event.keyCode});
                            Sheets.util.cancelDefault(event);
                            break;
                        case 39:
                            this.selectedIndex(this._selectedIndex);
                            this.close();
                            this._trigger(EndEdit, {keyCode: event.keyCode});
                            Sheets.util.cancelDefault(event);
                            break;
                        case 9:
                            this.selectedIndex(this._selectedIndex);
                            this.close();
                            this._trigger(EndEdit, {keyCode: event.keyCode});
                            Sheets.util.cancelDefault(event);
                            break;
                        default:
                            break
                    }
                };
                DropDownList.prototype._removeDivListItems = function()
                {
                    while (this._divList.firstChild)
                    {
                        this._divList.removeChild(this._divList.firstChild)
                    }
                    this._itemCount = 0
                };
                DropDownList.prototype.getSelectedValue = function(selectedIndex, items, editorValueType)
                {
                    var item = items[selectedIndex];
                    var value;
                    if (item !== keyword_null && item !== keyword_undefined)
                    {
                        switch (editorValueType)
                        {
                            case 1:
                                value = selectedIndex;
                                break;
                            case 0:
                                value = item.hasOwnProperty("text") ? item.text : item;
                                break;
                            case 2:
                                if (item.hasOwnProperty("value"))
                                {
                                    value = item.value
                                }
                                break;
                            default:
                                break
                        }
                    }
                    return value
                };
                DropDownList.prototype.setSelectedIndexInternal = function(value)
                {
                    this._removeSelectedEffect();
                    this._selectedIndex = value;
                    this._addSelectedEffect()
                };
                DropDownList.prototype.selectedIndex = function(index)
                {
                    if (arguments.length === 0)
                    {
                        return this._selectedIndex
                    }
                    else
                    {
                        if (0 <= index && index < this._itemCount)
                        {
                            this.setSelectedIndexInternal(index);
                            this._trigger(this.SelectedIndexChanged, {})
                        }
                    }
                };
                DropDownList.prototype.selectByText = function(text)
                {
                    var items = this._items;
                    if (!items)
                    {
                        return
                    }
                    for (var i = 0; i < items.length; i++)
                    {
                        var item = items[i];
                        if (item.hasOwnProperty("text"))
                        {
                            item = item.text
                        }
                        if (text === item)
                        {
                            break
                        }
                    }
                    this.setSelectedIndexInternal(i)
                };
                DropDownList.prototype.itemCountPerPage = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._itemCountPerPage
                    }
                    else
                    {
                        if (value > 0)
                        {
                            this._itemCountPerPage = value
                        }
                    }
                };
                DropDownList.prototype._recalcHeight = function(itemHeight, itemCountPerPage)
                {
                    var height,
                        itemCount = this._itemCount;
                    if (itemCount <= itemCountPerPage)
                    {
                        height = itemCount * itemHeight
                    }
                    else
                    {
                        height = itemCountPerPage * itemHeight;
                        this._isNeedVScrollbar = true
                    }
                    this.height(height)
                };
                DropDownList.prototype.measureText = function(text)
                {
                    this._appendMeasureSpanToBody();
                    var width = this._measureTextWidth(text);
                    this._removeMeasureSpanFromBody();
                    return width
                };
                DropDownList.prototype.getLongestItemWidth = function()
                {
                    this._appendMeasureSpanToBody();
                    var longestItemWdith = 0,
                        width;
                    var items = this._items;
                    if (items)
                    {
                        for (var i = 0, length = items.length; i < length; i++)
                        {
                            var item = items[i];
                            width = this._measureTextWidth(item.hasOwnProperty("text") ? item.text : item);
                            if (width > longestItemWdith)
                            {
                                longestItemWdith = width
                            }
                        }
                    }
                    this._removeMeasureSpanFromBody();
                    return longestItemWdith
                };
                DropDownList.prototype._updateWidth = function()
                {
                    _super.prototype._updateWidth.call(this);
                    this._scrollablePanel.refreshLayout(false)
                };
                DropDownList.prototype._updateHeight = function()
                {
                    _super.prototype._updateHeight.call(this);
                    this._scrollablePanel.refreshLayout(false)
                };
                DropDownList.prototype.itemHeight = function(newItemHeight)
                {
                    if (arguments.length === 0)
                    {
                        return this._itemHeight
                    }
                    else
                    {
                        if (newItemHeight > 0)
                        {
                            this._itemHeight = newItemHeight
                        }
                    }
                };
                DropDownList.prototype._updateItemHeight = function()
                {
                    this._appendMeasureSpanToBody();
                    var firstItem = this._items[0];
                    if (firstItem === keyword_null || firstItem === keyword_undefined)
                    {
                        firstItem = ""
                    }
                    var actualItemHeight = Math_max(this._itemHeight, this._measureTextHeight(firstItem));
                    $(this._divList).children().css(cssHeight, actualItemHeight);
                    this._recalcHeight(actualItemHeight, this._itemCountPerPage);
                    this._removeMeasureSpanFromBody()
                };
                DropDownList.prototype._updateItemWidth = function()
                {
                    var longestItemWidth = this.getLongestItemWidth(),
                        scrollbarSize = 0;
                    if (this._isNeedVScrollbar === true)
                    {
                        scrollbarSize = this.SCROLLBAR_SIZE
                    }
                    if (this.width() < longestItemWidth + scrollbarSize)
                    {
                        this.width(longestItemWidth + scrollbarSize)
                    }
                };
                DropDownList.prototype.scrollToIndex = function(index)
                {
                    if (index >= 0 && index < this._itemCount)
                    {
                        var child = this._divList.childNodes[index];
                        this._scrollablePanel.scrollChildIntoView(child)
                    }
                };
                DropDownList.prototype.bind = function(type, data, fn)
                {
                    $(this._DOMObject).bind(type, data, fn)
                };
                DropDownList.prototype.unbind = function(type, fn)
                {
                    $(this._DOMObject).unbind(type, fn)
                };
                DropDownList.prototype._trigger = function(type, data)
                {
                    $(this._DOMObject).trigger(type, data)
                };
                return DropDownList
            })(DropDownWindow)
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

