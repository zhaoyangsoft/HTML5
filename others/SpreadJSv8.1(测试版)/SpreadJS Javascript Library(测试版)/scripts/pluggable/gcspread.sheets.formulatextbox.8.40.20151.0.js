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
        Sheets.feature("formulatextbox", ["core.common"]);
        var keyword_null = null,
            keyword_undefined = undefined,
            Math_max = Math.max,
            Math_min = Math.min;
        var ns_formulatextbox_internal = ".gcFormulaTextBoxInternal",
            ns_formulatextbox = ".gcFormulaTextBox",
            EVENT_TEXTCHANGED = "TextChanged",
            EVENT_CARETCHANGED = "CaretChanged",
            EVENT_APPENDSTARTED = "AppendStarted",
            EVENT_APPENDENDED = "AppendEnded";
        var Keys = {
                left: 37, right: 39, up: 38, down: 40, tab: 9, enter: 13, pup: 33, pdn: 34, end: 35, home: 36, esc: 27
            };
        var FormulaTextBox = (function()
            {
                function FormulaTextBox(host, spread)
                {
                    var self = this;
                    self._init(spread && spread.getHost() || document.body);
                    if (host)
                    {
                        self._attachHost(host)
                    }
                    if (spread)
                    {
                        self._isInSpread = true;
                        self.setSpread(spread);
                        self._spread._unbind(Sheets.Events.ActiveSheetChanging, FormulatextboxAcrossSheetSingleton.handleFormulatextboxAcrossSheetBeforeTabChange);
                        self._spread._bind(Sheets.Events.ActiveSheetChanging, FormulatextboxAcrossSheetSingleton.handleFormulatextboxAcrossSheetBeforeTabChange);
                        self._spread._unbind(Sheets.Events.ActiveSheetChanged, FormulatextboxAcrossSheetSingleton.handleFormulatextboxAcrossSheetAfterTabChange);
                        self._spread._bind(Sheets.Events.ActiveSheetChanged, FormulatextboxAcrossSheetSingleton.handleFormulatextboxAcrossSheetAfterTabChange)
                    }
                    self._tokens = self._parse(self.text());
                    var editableHost = self._isEditableElement(host);
                    if (editableHost)
                    {
                        self._colorText(self._tokens)
                    }
                }
                FormulaTextBox.prototype.destroy = function()
                {
                    var self = this;
                    self._isAppending = false;
                    self._appendingStart = -1;
                    self._detachHost();
                    self._detachSpread();
                    $(self._funcsPopup).remove();
                    $(self._funcHelpPopup).remove()
                };
                FormulaTextBox.prototype.bind = function(type, data, fn)
                {
                    var host = this._host;
                    if (host && type)
                    {
                        type = type.split(/\s+/).join(ns_formulatextbox + " ");
                        $(host).bind(type + ns_formulatextbox, data, fn)
                    }
                };
                FormulaTextBox.prototype.unbind = function(type, fn)
                {
                    var host = this._host;
                    if (host && type)
                    {
                        type = type.split(/\s+/).join(ns_formulatextbox + " ");
                        $(host).unbind(type + ns_formulatextbox, fn)
                    }
                };
                FormulaTextBox.prototype.unbindAll = function()
                {
                    var host = this._host;
                    if (host)
                    {
                        $(host).unbind(ns_formulatextbox)
                    }
                };
                FormulaTextBox.prototype.caret = function(value)
                {
                    var self = this,
                        host = self._host;
                    if (!host)
                    {
                        return
                    }
                    var focusElement = document.activeElement,
                        hostFocused = (document.activeElement === host);
                    var $host = $(host);
                    if (arguments.length === 0)
                    {
                        if (hostFocused)
                        {
                            return self._getCaret(host).end
                        }
                        return $host.data("caret-before")
                    }
                    if (value !== self.caret())
                    {
                        if (hostFocused)
                        {
                            self._setCaret(host, value);
                            $host.data("caret-before", self._getCaret(host).end)
                        }
                        else
                        {
                            $host.data("caret-before", value)
                        }
                        self._trigger(EVENT_CARETCHANGED, {})
                    }
                };
                FormulaTextBox.prototype._getCaret = function(element)
                {
                    var start = -1,
                        end = -1;
                    var input = this._isInputElement(element),
                        editable = this._isEditableElement(element);
                    if (input)
                    {
                        start = element.selectionStart;
                        end = element.selectionEnd
                    }
                    else if (editable)
                    {
                        var selection = window.getSelection();
                        if (selection.rangeCount > 0)
                        {
                            var range = selection.getRangeAt(0);
                            var clonedRange = range.cloneRange();
                            clonedRange.selectNodeContents(element);
                            clonedRange.setEnd(range.endContainer, range.endOffset);
                            end = clonedRange.toString().length;
                            clonedRange = range.cloneRange();
                            clonedRange.selectNodeContents(element);
                            clonedRange.setEnd(range.startContainer, range.startOffset);
                            start = clonedRange.toString().length;
                            clonedRange.detach()
                        }
                    }
                    return {
                            start: start, end: end
                        }
                };
                FormulaTextBox.prototype._setCaret = function(element, pos)
                {
                    var input = this._isInputElement(element),
                        editable = this._isEditableElement(element);
                    if (input)
                    {
                        element.setSelectionRange(pos, pos)
                    }
                    else if (editable)
                    {
                        var caretNode = this._getColorNode(element, pos);
                        if (caretNode)
                        {
                            var selection = window.getSelection();
                            var range = document.createRange();
                            range.setStart(caretNode.node.firstChild, caretNode.offset);
                            range.collapse(true);
                            selection.removeAllRanges();
                            selection.addRange(range)
                        }
                    }
                };
                FormulaTextBox.prototype.text = function(value)
                {
                    var self = this,
                        host = self._host;
                    if (!host)
                    {
                        return
                    }
                    var input = self._isInputElement(host),
                        editable = self._isEditableElement(host);
                    if (arguments.length === 0)
                    {
                        var txt = "";
                        if (input)
                        {
                            txt = host.value
                        }
                        else if (editable)
                        {
                            txt = host.textContent
                        }
                        return txt
                    }
                    if (value === null || typeof(value) === 'undefined')
                    {
                        value = ""
                    }
                    if (value !== self.text())
                    {
                        self._tokens = self._parse(value);
                        if (input)
                        {
                            host.value = value
                        }
                        else if (editable)
                        {
                            self._colorText(self._tokens)
                        }
                        var parameter = {};
                        var ftbAcrossSheet = Sheets.IFormulatextboxAcrossSheetSingleton.formulatextboxAcrossSheetInstance;
                        if (ftbAcrossSheet && ftbAcrossSheet.text)
                        {
                            parameter = {
                                sheet: ftbAcrossSheet.sheet, editor: ftbAcrossSheet.dom, canvasOffset: ftbAcrossSheet.canvasOffset
                            }
                        }
                        self._trigger(EVENT_TEXTCHANGED, parameter)
                    }
                };
                FormulaTextBox.prototype.autoComplete = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._autoComplete
                    }
                    this._autoComplete = value
                };
                FormulaTextBox.prototype.showHelp = function(value)
                {
                    if (arguments.length === 0)
                    {
                        return this._showHelp
                    }
                    this._showHelp = value
                };
                FormulaTextBox.prototype.add = function(fnd)
                {
                    if (!fnd)
                    {
                        return
                    }
                    if ($.isArray(fnd))
                    {
                        var count = fnd.length;
                        for (var i = 0; i < count; i++)
                        {
                            this._add(fnd[i])
                        }
                    }
                    else
                    {
                        this._add(fnd)
                    }
                };
                FormulaTextBox.prototype._add = function(func)
                {
                    var addName = (func && func.name && func.name.toUpperCase());
                    if (!addName)
                    {
                        return
                    }
                    var funcs = this._funcs,
                        count = funcs.length,
                        index,
                        fName;
                    for (index = 0; index < count; index++)
                    {
                        fName = funcs[index].name.toUpperCase();
                        if (fName === addName)
                        {
                            return
                        }
                        else if (fName > addName)
                        {
                            break
                        }
                    }
                    funcs.splice(index, 0, func)
                };
                FormulaTextBox.prototype.remove = function(name)
                {
                    if (!name)
                    {
                        return
                    }
                    name = name.toUpperCase();
                    var funcs = this._funcs,
                        count = funcs.length;
                    for (var i = 0; i < count; i++)
                    {
                        if (funcs[i].name.toUpperCase() === name)
                        {
                            funcs.splice(i, 1);
                            break
                        }
                    }
                };
                FormulaTextBox.prototype.spread = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._spread
                    }
                    self.setSpread(value);
                    self._attachSpread()
                };
                FormulaTextBox.prototype.setSpread = function(spread)
                {
                    if (!spread)
                    {
                        return
                    }
                    var self = this;
                    if (self._spread)
                    {
                        self._detachSpread()
                    }
                    var host = self._host;
                    if (spread && host)
                    {
                        self._spread = spread
                    }
                    self._parse = self.parseByCalc
                };
                FormulaTextBox.prototype.getRanges = function()
                {
                    var ranges = [];
                    var tokens = this._tokens,
                        tokenCount = (tokens && tokens.length),
                        token,
                        tokenText,
                        tmpLength = 0,
                        index = 0;
                    if (tokenCount > 0)
                    {
                        for (var i = 0; i < tokenCount; i++)
                        {
                            token = tokens[i];
                            tokenText = token.text;
                            if (token.type === 11)
                            {
                                ranges.push({
                                    textOffset: tmpLength, text: tokenText, ranges: token.ranges, index: index++, allowDrag: token.allowDrag
                                })
                            }
                            tmpLength += tokenText.length
                        }
                    }
                    return ranges
                };
                FormulaTextBox.prototype.getActiveRange = function()
                {
                    var host = this._host,
                        ranges = this.getRanges();
                    if (host && ranges && ranges.length > 0)
                    {
                        var caretPosition = this.caret(),
                            count = ranges.length,
                            range,
                            textOffset;
                        for (var i = 0; i < count; i++)
                        {
                            range = ranges[i];
                            textOffset = range.textOffset;
                            if (textOffset < caretPosition && caretPosition <= textOffset + range.text.length)
                            {
                                return range
                            }
                            else if (textOffset >= caretPosition)
                            {
                                break
                            }
                        }
                    }
                    return keyword_null
                };
                FormulaTextBox.prototype.isActiveRange = function(paramRange)
                {
                    if (!paramRange)
                    {
                        return false
                    }
                    var caretPosition = this.caret();
                    var rangeString = paramRange.text,
                        rangeStringOffset = paramRange.textOffset;
                    if (rangeStringOffset < caretPosition && caretPosition <= rangeStringOffset + rangeString.length)
                    {
                        return true
                    }
                    return false
                };
                FormulaTextBox.prototype.getRangeColor = function(index)
                {
                    var ranges = this.getRanges(),
                        count = ranges.length;
                    if (index < 0 || count <= index)
                    {
                        return ""
                    }
                    var tmpRanges = [],
                        range,
                        colorIndex = 0;
                    for (var i = 0; i < count; i++)
                    {
                        range = ranges[i];
                        var duplicated = false,
                            j = 0;
                        for (; j < tmpRanges.length; j++)
                        {
                            if (tmpRanges[j].text.replace(/\s+/g, "").toUpperCase() === range.text.replace(/\s+/g, "").toUpperCase())
                            {
                                duplicated = true;
                                break
                            }
                        }
                        if (duplicated)
                        {
                            if (index === i)
                            {
                                colorIndex = j;
                                break
                            }
                        }
                        else
                        {
                            tmpRanges.push(range);
                            if (index === i)
                            {
                                colorIndex = tmpRanges.length - 1;
                                break
                            }
                        }
                    }
                    var colors = FormulaTextBox.DEFAULT_RANGE_COLORS;
                    return colors[colorIndex % colors.length]
                };
                FormulaTextBox.prototype.canAppendRange = function()
                {
                    if (this._isAppending)
                    {
                        return true
                    }
                    var activeToken = this._getToken(this.caret());
                    if (activeToken)
                    {
                        var tokenType = activeToken.type,
                            tokenText = activeToken.text;
                        return (tokenType === 1 || tokenType === 8 || (tokenType === 7 && tokenText !== "%") || tokenType === 5 || tokenType === 9 || tokenType === 15)
                    }
                    return false
                };
                FormulaTextBox.prototype.isAppending = function()
                {
                    return this._isAppending
                };
                FormulaTextBox.prototype.isAppendingRange = function(paramRange)
                {
                    if (!paramRange || !this._isAppending)
                    {
                        return false
                    }
                    var appendingStart = this._appendingStart,
                        appendingEnd = this.caret(),
                        rangeStringOffset = paramRange.textOffset;
                    if (appendingStart <= rangeStringOffset && rangeStringOffset < appendingEnd)
                    {
                        return true
                    }
                    return false
                };
                FormulaTextBox.prototype.getAppendingRanges = function()
                {
                    var ret = [];
                    var ranges = this.getRanges(),
                        count = ranges.length,
                        range;
                    if (count > 0)
                    {
                        for (var i = 0; i < count; i++)
                        {
                            range = ranges[i];
                            if (this.isAppendingRange(range))
                            {
                                ret.push(range)
                            }
                        }
                    }
                    return ret
                };
                FormulaTextBox.prototype.appendRange = function(rangeString, replacing, clearPrevAppending)
                {
                    var self = this,
                        host = self._host;
                    if (!rangeString || !host)
                    {
                        return
                    }
                    if (!self._isAppending)
                    {
                        if (!self.canAppendRange())
                        {
                            return
                        }
                        replacing = false;
                        self._isAppending = true;
                        self._appendingStart = self.caret();
                        self._trigger(EVENT_APPENDSTARTED, {})
                    }
                    var appendingStart = self._appendingStart,
                        text = self.text(),
                        caretPosition = self.caret();
                    var caretNewPosition = caretPosition;
                    if (clearPrevAppending)
                    {
                        replacing = false;
                        text = text.substr(0, appendingStart) + text.substr(caretPosition);
                        self._tokens = self._parse(text);
                        caretPosition = appendingStart;
                        caretNewPosition = caretPosition
                    }
                    var activeToken = self._getToken(caretPosition);
                    if (replacing)
                    {
                        var prevText = text.substr(0, caretPosition);
                        prevText = prevText.substr(0, prevText.length - activeToken.text.length);
                        if (prevText.length >= appendingStart)
                        {
                            activeToken.text = rangeString;
                            caretNewPosition = prevText.length + rangeString.length
                        }
                    }
                    else
                    {
                        var tokens = self._tokens,
                            activeTokenIndex = Sheets.ArrayHelper.indexOf(tokens, activeToken);
                        if (caretPosition > appendingStart)
                        {
                            tokens.splice(activeTokenIndex + 1, 0, {
                                text: GcSpread.Sheets.CR.listSeparator, type: 8
                            });
                            tokens.splice(activeTokenIndex + 2, 0, {
                                text: rangeString, type: 11
                            });
                            rangeString = "," + rangeString
                        }
                        else
                        {
                            tokens.splice(activeTokenIndex + 1, 0, {
                                text: rangeString, type: 11
                            })
                        }
                        caretNewPosition = caretPosition + rangeString.length
                    }
                    self._updateHostValue();
                    var parameter = {};
                    var ftbAcrossSheet = Sheets.IFormulatextboxAcrossSheetSingleton.formulatextboxAcrossSheetInstance;
                    if (ftbAcrossSheet && ftbAcrossSheet.text)
                    {
                        parameter = {
                            sheet: ftbAcrossSheet.sheet, editor: ftbAcrossSheet.dom, canvasOffset: ftbAcrossSheet.canvasOffset
                        }
                    }
                    self._trigger(EVENT_TEXTCHANGED, parameter);
                    self.caret(caretNewPosition)
                };
                FormulaTextBox.prototype.stopAppending = function()
                {
                    var self = this;
                    if (self._isAppending)
                    {
                        self._isAppending = false;
                        self._appendingStart = -1;
                        self._trigger(EVENT_APPENDENDED, {})
                    }
                };
                FormulaTextBox.prototype.startAppending = function()
                {
                    this._isAppending = true;
                    this._appendingStart = this.caret()
                };
                FormulaTextBox.prototype.appendingStartIndex = function(index)
                {
                    return arguments.length == 0 ? this._appendingStart : (this._appendingStart = index)
                };
                FormulaTextBox.prototype.repalceRange = function(rangeIndex, rangeString)
                {
                    var self = this,
                        host = self._host;
                    if (!host || rangeIndex < 0 || !rangeString)
                    {
                        return
                    }
                    var replaced = false,
                        tmpText = "";
                    var tokens = self._tokens,
                        tokenCount = (tokens && tokens.length),
                        token,
                        index = 0;
                    for (var i = 0; i < tokenCount; i++)
                    {
                        token = tokens[i];
                        if (token.type === 11)
                        {
                            if (index++ === rangeIndex)
                            {
                                tokens[i] = {
                                    text: rangeString, type: 11
                                };
                                replaced = true;
                                break
                            }
                        }
                        tmpText += token.text
                    }
                    if (replaced)
                    {
                        self._updateHostValue();
                        self._trigger(EVENT_TEXTCHANGED, {});
                        self.caret(self.text().length)
                    }
                };
                FormulaTextBox.prototype._attachSpread = function()
                {
                    var self = this;
                    if (!self._spread)
                    {
                        return
                    }
                    var host = self._host;
                    if (self._spread && host)
                    {
                        var Events = GcSpread.Sheets.Events;
                        host.setAttribute("gcUIElement", "gcAttachedFormulaTextBox");
                        self._spread._attachedFormulaTextBox = self;
                        self._spread._bind(Events.EditStarted, self, self._onSpreadEditStarted);
                        self._spread._bind(Events.EnterCell, self, self._onSpreadEnterCell);
                        self._spread._bind(Events.EditEnded, self, self._onSpreadEditEnded);
                        self._spread._bind(Events.ActiveSheetChanged, self, self._onSpreadActiveSheetChanged);
                        self._spread._bind(Events.RangeChanged, self, self._onSpreadRangeChanged);
                        self._spread._bind("FormulaTextBoxTextChanged", self, self._onSpreadFormulaTextBoxTextChanged);
                        self._spread._bind("FormulaTextBoxCaretChanged", self, self._onSpreadFormulaTextBoxCaretChanged);
                        var sheet = self._spread.getActiveSheet();
                        if (sheet)
                        {
                            self.text(self._getEditText(sheet, sheet._activeRowIndex, sheet._activeColIndex))
                        }
                        self._bind(EVENT_TEXTCHANGED, self, self._onFormulaTextBoxTextChanged);
                        self._bind(EVENT_CARETCHANGED, self, self._onFormulaTextBoxCaretChanged)
                    }
                };
                FormulaTextBox.prototype._detachSpread = function()
                {
                    var self = this,
                        spreadTmp = self._spread;
                    if (!self._isInSpread && spreadTmp)
                    {
                        var Events = GcSpread.Sheets.Events;
                        spreadTmp._attachedFormulaTextBox = null;
                        spreadTmp._unbind(Events.EditStarted, self._onSpreadEditStarted);
                        spreadTmp._unbind(Events.EnterCell, self._onSpreadEnterCell);
                        spreadTmp._unbind(Events.EditEnded, self._onSpreadEditEnded);
                        spreadTmp._unbind(Events.ActiveSheetChanged, self._onSpreadActiveSheetChanged);
                        spreadTmp._unbind(Events.RangeChanged, self._onSpreadRangeChanged);
                        spreadTmp._unbind("FormulaTextBoxTextChanged", self._onSpreadFormulaTextBoxTextChanged);
                        spreadTmp._unbind("FormulaTextBoxCaretChanged", self._onSpreadFormulaTextBoxCaretChanged);
                        self._unbind(EVENT_TEXTCHANGED, self._onFormulaTextBoxTextChanged);
                        self._unbind(EVENT_CARETCHANGED, self._onFormulaTextBoxCaretChanged);
                        self.text("")
                    }
                    self._spread = null
                };
                FormulaTextBox.prototype._startingSpreadEdit = function()
                {
                    var self = this;
                    if (self._isWorking)
                    {
                        return
                    }
                    self._isWorking = true;
                    var spreadTmp = this._spread;
                    var sheet = (spreadTmp && spreadTmp.getActiveSheet());
                    if (sheet && !sheet.isEditing())
                    {
                        sheet._startEditImp(null, sheet._activeRowIndex, sheet._activeColIndex, null, null, false, null);
                        self._spreadEditStarting = true
                    }
                    else
                    {
                        self._spreadEditStarting = false
                    }
                    self._isWorking = false;
                    if (!self._isFuncsShown)
                    {
                        self._openFuncHelp()
                    }
                };
                FormulaTextBox.prototype._startSpreadEdit = function()
                {
                    var self = this;
                    var spreadTmp = self._spread;
                    var sheet = (spreadTmp && spreadTmp.getActiveSheet());
                    if (!sheet)
                    {
                        return
                    }
                    if (self._spreadEditStarting)
                    {
                        var fbx = sheet._formulaTextBox,
                            fbxText = fbx.text(),
                            selfText = self.text();
                        if (selfText !== fbxText)
                        {
                            var caret = self.caret();
                            var formulaInfo = sheet.getFormulaInformation(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex());
                            self.text(fbxText);
                            if (formulaInfo.isArrayFormula)
                            {
                                if (caret >= selfText.length)
                                {
                                    caret = caret - 1
                                }
                                caret = Math_max(0, caret - 1)
                            }
                            self.caret(caret)
                        }
                    }
                    var EditorStatus = GcSpread.Sheets.EditorStatus,
                        oldStatus = sheet._editorStatus;
                    if (oldStatus !== 2)
                    {
                        sheet._editorStatus = 2;
                        sheet.triggerEditorStatusChanged({
                            sheet: sheet, sheetName: sheet._name, oldStatus: oldStatus, newStatus: 2
                        })
                    }
                };
                FormulaTextBox.prototype._getEditText = function(sheet, row, col)
                {
                    var text = "";
                    if (sheet)
                    {
                        var formulaInfo = sheet.getFormulaInformation(row, col);
                        if (formulaInfo && formulaInfo.hasFormula)
                        {
                            text = "=" + formulaInfo.formula;
                            if (formulaInfo.isArrayFormula)
                            {
                                text = "{" + text + "}"
                            }
                        }
                        else
                        {
                            text = sheet.getText(row, col);
                            var canUserEditFormula = sheet.parent ? sheet.parent.canUserEditFormula() : true;
                            if (text[0] === "=" && canUserEditFormula)
                            {
                                text = "'" + text
                            }
                        }
                    }
                    return text
                };
                FormulaTextBox.prototype._onSpreadActiveSheetChanged = function(e, eData)
                {
                    var self = e.data;
                    if (self._isWorking)
                    {
                        return
                    }
                    self._isWorking = true;
                    self.close();
                    if (eData)
                    {
                        var sheet = eData.newSheet;
                        self.text(self._getEditText(sheet, sheet._activeRowIndex, sheet._activeColIndex))
                    }
                    self._isWorking = false
                };
                FormulaTextBox.prototype._onSpreadEditStarted = function(e, eData)
                {
                    var self = e.data;
                    if (self._isWorking)
                    {
                        return
                    }
                    var spreadTmp = self._spread;
                    var sheet = (spreadTmp && spreadTmp.getActiveSheet());
                    var fbx = (sheet && sheet._formulaTextBox);
                    if (!fbx)
                    {
                        return
                    }
                    self._isWorking = true;
                    self.text(fbx.text());
                    self._isWorking = false
                };
                FormulaTextBox.prototype._onSpreadEnterCell = function(e, eData)
                {
                    var self = e.data;
                    if (self._isWorking)
                    {
                        return
                    }
                    self._isWorking = true;
                    if (eData)
                    {
                        self.text(self._getEditText(eData.sheet, eData.row, eData.col))
                    }
                    self._isWorking = false
                };
                FormulaTextBox.prototype._onSpreadRangeChanged = function(e, eData)
                {
                    var self = e.data;
                    if (self._isWorking)
                    {
                        return
                    }
                    self._isWorking = true;
                    if (eData)
                    {
                        var sheet = eData.sheet,
                            row = eData.row,
                            col = eData.column,
                            rowCount = eData.rowCount,
                            colCount = eData.columnCount;
                        if (new GcSpread.Sheets.Range(row, col, rowCount, colCount).contains(sheet._activeRowIndex, sheet._activeColIndex))
                        {
                            self.text(self._getEditText(sheet, row, col))
                        }
                    }
                    self._isWorking = false
                };
                FormulaTextBox.prototype._onSpreadEditEnded = function(e, eData)
                {
                    var self = e.data;
                    if (self._isWorking)
                    {
                        return
                    }
                    self._isWorking = true;
                    self.close();
                    if (eData)
                    {
                        self.text(self._getEditText(eData.sheet, eData.row, eData.col))
                    }
                    self._isWorking = false
                };
                FormulaTextBox.prototype._onSpreadFormulaTextBoxTextChanged = function(e, eData)
                {
                    var self = e.data;
                    if (self._isWorking)
                    {
                        return
                    }
                    self._isWorking = true;
                    if (eData)
                    {
                        var caret = self.caret();
                        self.text(eData.text);
                        self.caret(caret)
                    }
                    self._isWorking = false
                };
                FormulaTextBox.prototype._onSpreadFormulaTextBoxCaretChanged = function(e, eData)
                {
                    var self = e.data;
                    if (self._isWorking)
                    {
                        return
                    }
                    self._isWorking = true;
                    if (eData)
                    {
                        self.caret(eData.caret)
                    }
                    self._isWorking = false
                };
                FormulaTextBox.prototype._onFormulaTextBoxTextChanged = function(e)
                {
                    var self = e.data;
                    if (self._isWorking)
                    {
                        return
                    }
                    var spreadTmp = self._spread,
                        sheet = (spreadTmp && spreadTmp.getActiveSheet());
                    if (!sheet)
                    {
                        return
                    }
                    self._isWorking = true;
                    var fbx = sheet._formulaTextBox;
                    if (fbx)
                    {
                        var caret = fbx.caret();
                        fbx.text(self.text());
                        fbx.caret(caret)
                    }
                    self._isWorking = false
                };
                FormulaTextBox.prototype._onFormulaTextBoxCaretChanged = function(e)
                {
                    var self = e.data;
                    if (self._isWorking)
                    {
                        return
                    }
                    var spreadTmp = self._spread,
                        sheet = (spreadTmp && spreadTmp.getActiveSheet());
                    if (!sheet || !sheet.isEditing())
                    {
                        return
                    }
                    self._isWorking = true;
                    var fbx = sheet._formulaTextBox;
                    if (fbx)
                    {
                        fbx.caret(self.caret());
                        self._openFuncHelp()
                    }
                    self._isWorking = false
                };
                FormulaTextBox.prototype._init = function(parentElement)
                {
                    var self = this;
                    self._isImeInputting = false;
                    self._isInputKey = false;
                    self._isAppending = false;
                    self._appendingStart = -1;
                    self._funcs = [];
                    self._autoComplete = true;
                    self._showHelp = true;
                    self._autoClose = true;
                    var funcsPopup = document.createElement("div");
                    funcsPopup.className = "gcsj-func-ac-popup";
                    funcsPopup.style.display = "none";
                    funcsPopup.setAttribute("gcUIElement", "gcFuncACPopup");
                    parentElement.insertBefore(funcsPopup, keyword_null);
                    self._funcsPopup = funcsPopup;
                    self._isFuncsShown = false;
                    var funcHelpPopup = document.createElement("div");
                    funcHelpPopup.className = "gcsj-func-help-popup";
                    funcHelpPopup.style.display = "none";
                    funcHelpPopup.setAttribute("gcUIElement", "gcFuncHelpPopup");
                    parentElement.insertBefore(funcHelpPopup, keyword_null);
                    self._funcHelpPopup = funcHelpPopup;
                    self._isFuncHelpShown = false;
                    $(funcsPopup).mouseenter(function()
                    {
                        self._autoClose = false
                    }).mouseleave(function()
                    {
                        self._autoClose = true
                    });
                    $(funcHelpPopup).mouseenter(function()
                    {
                        self._autoClose = false
                    }).mouseleave(function()
                    {
                        self._autoClose = true
                    });
                    $(funcsPopup).scroll(function()
                    {
                        if (self._funcsScrollingTimer)
                        {
                            window.clearTimeout(self._funcsScrollingTimer)
                        }
                        self._funcsScrollingTimer = window.setTimeout(function()
                        {
                            if (self._host)
                            {
                                self._host.focus()
                            }
                        }, 100)
                    });
                    self._spread = null;
                    self._isWorking = false;
                    self._spreadEditStarting = false;
                    self._isInSpread = false;
                    self._parse = self.parseDefault
                };
                FormulaTextBox.prototype._attachHost = function(host)
                {
                    if (!host)
                    {
                        return
                    }
                    var self = this;
                    if (!self._isInputElement(host) && !self._isEditableElement(host))
                    {
                        return
                    }
                    var $host = $(host);
                    if (self._host)
                    {
                        self._detachHost()
                    }
                    self._host = host;
                    if ($.browser && $.browser.msie)
                    {
                        var lessIE10 = (parseInt($.browser.version, 10) < 10);
                        if (self._isEditableElement(host) || lessIE10)
                        {
                            self._bind("focus", function()
                            {
                                $host.data("text-before", self.text())
                            });
                            self._bind("input keydown keyup cut paste", function()
                            {
                                self._checkInput()
                            })
                        }
                        else
                        {
                            self._bind("input", function()
                            {
                                self._onInput()
                            })
                        }
                    }
                    else
                    {
                        self._bind("input", function()
                        {
                            self._onInput()
                        })
                    }
                    self._bind("keydown", function(e)
                    {
                        var ctrlKey = e.ctrlKey,
                            shiftKey = e.shiftKey,
                            altKey = e.altKey,
                            metaKey = e.metaKey,
                            modifyKey = ctrlKey || shiftKey || altKey || metaKey,
                            keyCode = e.keyCode;
                        self._isInputKey = false;
                        if (!modifyKey && self._isFuncsShown)
                        {
                            if (keyCode === Keys.down)
                            {
                                self._selectFunc(1);
                                e.preventDefault();
                                e.stopPropagation()
                            }
                            else if (keyCode === Keys.up)
                            {
                                self._selectFunc(-1);
                                e.preventDefault();
                                e.stopPropagation()
                            }
                            else if (keyCode === Keys.tab)
                            {
                                self._completeFunc();
                                e.preventDefault();
                                e.stopPropagation()
                            }
                        }
                        if (keyCode === Keys.esc)
                        {
                            self.close()
                        }
                        self._checkCaret(e)
                    });
                    self._bind("keyup", function(e)
                    {
                        if (self._isInputKey && $.browser && $.browser.qtMode)
                        {
                            var caretPosition = self.caret();
                            if ($host.data("caret-before") !== caretPosition)
                            {
                                $host.data("caret-before", caretPosition);
                                self._trigger(EVENT_CARETCHANGED, {});
                                self._openFuncs();
                                if (!self._isFuncsShown)
                                {
                                    self._openFuncHelp()
                                }
                            }
                        }
                        self._checkCaret(e)
                    });
                    self._bind("focus", function(e)
                    {
                        self._checkCaret(e)
                    });
                    self._bind("blur", function(e)
                    {
                        if (self._autoClose)
                        {
                            self.close()
                        }
                    });
                    self._bind("mousedown", function(e)
                    {
                        self._startingSpreadEdit()
                    });
                    self._bind("mouseup", function(e)
                    {
                        self._startSpreadEdit()
                    });
                    self._bind("click", function(e)
                    {
                        if (self._isAppending)
                        {
                            self.stopAppending()
                        }
                        var spreadTmp = self._spread,
                            sheet = (spreadTmp && spreadTmp.getActiveSheet());
                        var fbx = (sheet && sheet._formulaTextBox);
                        if (fbx && fbx.isAppending())
                        {
                            fbx.stopAppending()
                        }
                        self._checkCaret(e)
                    });
                    self._bind("compositionstart", function(e)
                    {
                        self._isImeInputting = true
                    });
                    self._bind("compositionend", function(e)
                    {
                        self._isImeInputting = false
                    })
                };
                FormulaTextBox.prototype._detachHost = function()
                {
                    var self = this,
                        host = self._host;
                    if (host)
                    {
                        var $host = $(host);
                        $host.removeData("text-before");
                        $host.removeData("caret-before");
                        self._unbindAll();
                        self.unbindAll();
                        self._host = keyword_null
                    }
                };
                FormulaTextBox.prototype._checkInput = function()
                {
                    var self = this,
                        $host = $(self._host),
                        text = self.text();
                    if ($host.data("text-before") !== text)
                    {
                        $host.data("text-before", text);
                        self._onInput()
                    }
                };
                FormulaTextBox.prototype._checkCaret = function(e)
                {
                    if ($.browser && $.browser.msie)
                    {
                        var checkCaretObj = function(self, e)
                            {
                                return function()
                                    {
                                        self._checkCaretCore(self, e)
                                    }
                            };
                        setTimeout(checkCaretObj(this, e), 10)
                    }
                    else
                    {
                        this._checkCaretCore(this, e)
                    }
                };
                FormulaTextBox.prototype._checkCaretCore = function(self, e)
                {
                    var keyCode = e.keyCode;
                    var navKey = (keyCode === Keys.left || keyCode === Keys.right || keyCode === Keys.home || keyCode === Keys.end || keyCode === Keys.pdn || keyCode === Keys.pup || keyCode === Keys.tab || keyCode === Keys.enter);
                    if (!self._autoComplete)
                    {
                        navKey = (navKey || keyCode === Keys.up || keyCode === Keys.down)
                    }
                    var mouseClick = (typeof(e.button) !== 'undefined');
                    if (navKey || mouseClick)
                    {
                        var host = self._host,
                            $host = $(host),
                            caretPosition = self._getCaret(host);
                        if (caretPosition.start !== caretPosition.end)
                        {
                            return
                        }
                        var caret = caretPosition.end;
                        if ($host.data("caret-before") !== caret)
                        {
                            $host.data("caret-before", caret);
                            self._trigger(EVENT_CARETCHANGED, {});
                            self._openFuncHelp()
                        }
                    }
                };
                FormulaTextBox.prototype._activeRow = function()
                {
                    if (this._spread)
                    {
                        return this._spread.getActiveSheet()._activeRowIndex
                    }
                    return keyword_undefined
                };
                FormulaTextBox.prototype._activeCol = function()
                {
                    if (this._spread)
                    {
                        return this._spread.getActiveSheet()._activeColIndex
                    }
                    return keyword_undefined
                };
                FormulaTextBox.prototype._activeSheet = function()
                {
                    if (this._spread)
                    {
                        return this._spread.getActiveSheet()
                    }
                };
                FormulaTextBox.prototype.parseDefault = function(text)
                {
                    return Tokenizer.parse(text)
                };
                FormulaTextBox.prototype.parseByCalc = function(text)
                {
                    if (Sheets.Calc)
                    {
                        var self = this;
                        var newToken = [];
                        if (!text || text[0] !== '=')
                        {
                            newToken.push({
                                text: text, type: 17
                            });
                            return newToken
                        }
                        var oldOption = GcSpread.Sheets.Calc.Parser.getParserOption();
                        var option = {
                                numberDecimalSeparator: Sheets.CR.numberDecimalSeparator, arrayGroupSeparator: Sheets.CR.arrayGroupSeparator, listSeparator: Sheets.CR.listSeparator
                            };
                        Sheets.Calc.Parser.setParserOption(option);
                        var parser = new Sheets.Calc.Parser;
                        var tokens2 = parser.parseReferenceExpressionInfos(text, self._activeSheet(), self._activeRow(), self._activeCol());
                        GcSpread.Sheets.Calc.Parser.setParserOption(oldOption);
                        newToken = self._convertToTextboxToken(tokens2);
                        return newToken
                    }
                    else
                    {
                        this.parseDefault(text)
                    }
                    return keyword_undefined
                };
                FormulaTextBox.prototype._onInput = function()
                {
                    var self = this,
                        host = self._host,
                        $host = $(host);
                    self._isInputKey = true;
                    self._tokens = self._parse(self.text());
                    if (self._isEditableElement(host))
                    {
                        if (!self._isImeInputting)
                        {
                            var caretPosition = self.caret();
                            self._colorText(self._tokens);
                            self._trigger(EVENT_TEXTCHANGED, {type: 'input'});
                            self.caret(caretPosition)
                        }
                    }
                    else
                    {
                        self._trigger(EVENT_TEXTCHANGED, {type: 'input'})
                    }
                    var caretPosition = self.caret();
                    if ($host.data("caret-before") !== caretPosition)
                    {
                        $host.data("caret-before", caretPosition);
                        self._trigger(EVENT_CARETCHANGED, {})
                    }
                    self._openFuncs();
                    if (!self._isFuncsShown)
                    {
                        self._openFuncHelp()
                    }
                };
                FormulaTextBox.prototype.trigerTextChanged = function()
                {
                    this._trigger(EVENT_TEXTCHANGED, {type: 'input'})
                };
                FormulaTextBox.prototype._convertToTextboxToken = function(tokenList)
                {
                    var newTokens = [];
                    var bracketStack = [];
                    var arrayGroupSeperator = ";";
                    if (GcSpread.Sheets.CR && GcSpread.Sheets.CR.arrayGroupSeparator)
                    {
                        arrayGroupSeperator = GcSpread.Sheets.CR.arrayGroupSeparator
                    }
                    var isInArray = false;
                    var isInArrayRow = false;
                    var arrayRowCount = 0;
                    for (var i = 0; i < tokenList.length; i++)
                    {
                        if (i > 0 && i < tokenList.length - 1 && tokenList[i - 1].text === ";" && tokenList[i].text === "," && tokenList[i + 1].text === "ARRAYROW")
                        {
                            continue
                        }
                        var calcToken = tokenList[i];
                        var tokenType = this._getCalcType(calcToken, bracketStack);
                        var text = calcToken.text;
                        if (tokenType === 2)
                        {
                            newTokens.push({
                                text: text, type: tokenType
                            })
                        }
                        else if (tokenType === 3)
                        {
                            if (text === "ARRAYROW")
                            {
                                arrayRowCount++;
                                isInArrayRow = true;
                                continue
                            }
                            if (text === "ARRAY")
                            {
                                isInArray = true
                            }
                            newTokens.push({
                                text: '{', type: 3
                            })
                        }
                        else if (tokenType === 4)
                        {
                            if (text === "ARRAYROW")
                            {
                                isInArrayRow = false;
                                newTokens.push({
                                    text: '}', type: 4
                                });
                                continue
                            }
                            else if (text === "ARRAY")
                            {
                                isInArray = false;
                                arrayRowCount = 0;
                                newTokens.push({
                                    text: '}', type: 4
                                })
                            }
                            else
                            {
                                newTokens.push({
                                    text: text, type: 4
                                })
                            }
                        }
                        else if (tokenType === 6)
                        {
                            newTokens.push({
                                text: ')', type: tokenType
                            })
                        }
                        else if (isInArray && !isInArrayRow && text == ',')
                        {
                            newTokens.push({
                                text: arrayGroupSeperator, type: 10
                            })
                        }
                        else if (tokenType !== null)
                        {
                            newTokens.push({
                                text: text, type: tokenType, ranges: calcToken.ranges, allowDrag: calcToken.canDrag
                            })
                        }
                    }
                    return newTokens
                };
                FormulaTextBox.prototype._getCalcType = function(token, bracketStack)
                {
                    var excelFormulaTokenType = Sheets.Calc.ExcelFormulaTokenType;
                    var excelFormulaTokenSubtype = Sheets.Calc.ExcelFormulaTokenSubtype;
                    var type = token.type;
                    var subType = token.subType;
                    var text = token.text;
                    var value = token.value;
                    if (type === 1)
                    {
                        if (subType === 1)
                        {
                            if (text === "ARRAY" || text === "ARRAYROW")
                            {
                                bracketStack.push(3);
                                return 3
                            }
                            bracketStack.push(5);
                            if (value.trim() === '(')
                            {
                                return 5
                            }
                            return 2
                        }
                        if (subType === 2)
                        {
                            if (value.trim() === ')')
                            {
                                return 6
                            }
                            if (bracketStack.length > 0)
                            {
                                var lastBracket = bracketStack[bracketStack.length - 1];
                                if (lastBracket === 3)
                                {
                                    bracketStack.pop();
                                    return 4
                                }
                                else if (lastBracket === 5)
                                {
                                    bracketStack.pop();
                                    return 6
                                }
                            }
                        }
                        if (value.trim() === '=')
                        {
                            return 1
                        }
                    }
                    else if (type === 3)
                    {
                        if (subType === 0)
                        {
                            return 8
                        }
                    }
                    else if ((type === 5) || (type === 6) || (type === 4))
                    {
                        return 7
                    }
                    else if (type === 0)
                    {
                        if (subType === 7)
                        {
                            return 11
                        }
                        else if (subType === 5)
                        {
                            return 12
                        }
                        else if (subType === 4)
                        {
                            return 13
                        }
                        else if (subType === 3)
                        {
                            return 14
                        }
                        else if (subType === 6)
                        {
                            return 16
                        }
                        return 14
                    }
                    else if (type === 7)
                    {
                        return 15
                    }
                    else if (type === 8)
                    {
                        return 17
                    }
                    return 17
                };
                FormulaTextBox.prototype._updateHostValue = function()
                {
                    var self = this,
                        host = self._host,
                        tokens = self._tokens;
                    if (self._isInputElement(host))
                    {
                        var text = "",
                            tokenCount = (tokens && tokens.length);
                        for (var i = 0; i < tokenCount; i++)
                        {
                            text += tokens[i].text
                        }
                        host.value = text
                    }
                    else if (self._isEditableElement(host))
                    {
                        self._colorText(tokens)
                    }
                };
                FormulaTextBox.prototype._isInputElement = function(element)
                {
                    var tagName = (element && element.tagName);
                    return (tagName === "TEXTAREA" || tagName === "INPUT")
                };
                FormulaTextBox.prototype._isEditableElement = function(element)
                {
                    return (element && element.tagName === "DIV" && element.contentEditable === "true")
                };
                FormulaTextBox.prototype._isFormula = function(text)
                {
                    if (text && text[0] === '=')
                    {
                        return true
                    }
                    return false
                };
                FormulaTextBox.prototype._bind = function(type, data, fn)
                {
                    var host = this._host;
                    if (host && type)
                    {
                        type = type.split(/\s+/).join(ns_formulatextbox_internal + " ");
                        $(host).bind(type + ns_formulatextbox_internal, data, fn)
                    }
                };
                FormulaTextBox.prototype._unbind = function(type, fn)
                {
                    var host = this._host;
                    if (host && type)
                    {
                        type = type.split(/\s+/).join(ns_formulatextbox_internal + " ");
                        $(host).unbind(type + ns_formulatextbox_internal, fn)
                    }
                };
                FormulaTextBox.prototype._unbindAll = function()
                {
                    var host = this._host;
                    if (host)
                    {
                        $(host).unbind(ns_formulatextbox_internal)
                    }
                };
                FormulaTextBox.prototype._trigger = function(type, data)
                {
                    var host = this._host;
                    if (host)
                    {
                        $(host).trigger(type, data)
                    }
                };
                FormulaTextBox.prototype._getToken = function(caretPosition)
                {
                    if (caretPosition <= 0)
                    {
                        return keyword_null
                    }
                    var tokens = this._tokens,
                        tokenCount = (tokens && tokens.length);
                    if (tokenCount > 0)
                    {
                        var textIndex = 0,
                            token;
                        for (var i = 0; i < tokenCount; i++)
                        {
                            token = tokens[i];
                            textIndex += token.text.length;
                            if (textIndex >= caretPosition)
                            {
                                return token
                            }
                        }
                    }
                    return keyword_null
                };
                FormulaTextBox.prototype._getFuncs = function()
                {
                    var spreadTmp = this._spread;
                    var sheet = (spreadTmp && spreadTmp.getActiveSheet());
                    var fbx = (sheet && sheet._formulaTextBox);
                    if (fbx)
                    {
                        var all = fbx._funcs;
                        for (var i = 0; i < all.length; i++)
                        {
                            all[i].isFunc = true
                        }
                        return all.concat(this._getCustomNames(spreadTmp, sheet)).concat(this._getTableNames(sheet))
                    }
                    else
                    {
                        return this._funcs
                    }
                };
                FormulaTextBox.prototype._getCustomNames = function(spread, sheet)
                {
                    var names = [];
                    var customNames = sheet.getCustomNames().concat(spread.getCustomNames());
                    for (var i = 0; i < customNames.length; i++)
                    {
                        names.push({
                            name: customNames[i].getName(), description: Sheets.SR.Fbx_CustomName_Description + customNames[i].getName()
                        })
                    }
                    return names
                };
                FormulaTextBox.prototype._getTableNames = function(sheet)
                {
                    var names = [];
                    var tables = sheet.getTables();
                    if (tables)
                    {
                        for (var i = 0; i < tables.length; i++)
                        {
                            names.push({
                                name: tables[i].name(), description: Sheets.SR.Fbx_TableName_Description + tables[i].name()
                            })
                        }
                    }
                    return names
                };
                FormulaTextBox.prototype._getFuncsStartWith = function(startName, funcs)
                {
                    startName = startName.toUpperCase();
                    if (Sheets.StringUtil.contains(startName, '['))
                    {
                        startName = startName.substr(startName.lastIndexOf('[') + 1);
                        startName = Sheets.StringUtil.replace(startName, '@', '')
                    }
                    var results = [];
                    var count = (funcs && funcs.length),
                        find = false,
                        f;
                    for (var i = 0; i < count; i++)
                    {
                        f = funcs[i];
                        if (f.name.toUpperCase().indexOf(startName) === 0)
                        {
                            results.push(f);
                            find = true
                        }
                    }
                    return results
                };
                FormulaTextBox.prototype._getTextInTokenBeforeCaret = function()
                {
                    var caretPosition = this.caret();
                    if (caretPosition <= 0)
                    {
                        return ""
                    }
                    var tokens = this._tokens,
                        tokenCount = (tokens && tokens.length);
                    if (tokenCount > 0)
                    {
                        var textIndex = 0,
                            token;
                        for (var i = 0; i < tokenCount; i++)
                        {
                            token = tokens[i];
                            if (textIndex + token.text.length >= caretPosition)
                            {
                                return token.text.substring(0, caretPosition - textIndex)
                            }
                            textIndex += token.text.length
                        }
                    }
                    return ""
                };
                FormulaTextBox.prototype._getActiveFuncInfo = function()
                {
                    var caretPosition = this.caret(),
                        tokens = this._tokens,
                        tokenCount = (tokens && tokens.length);
                    var tmpTokens = [],
                        textIndex = 0,
                        token;
                    for (var i = 0; i < tokenCount; i++)
                    {
                        token = tokens[i];
                        tmpTokens.push(token);
                        if (token.type === 6)
                        {
                            var parenMatchCount = 0;
                            while (tmpTokens.length > 0)
                            {
                                var popToken = tmpTokens.pop();
                                if (popToken.type === 6)
                                {
                                    parenMatchCount++
                                }
                                if (popToken.type === 5)
                                {
                                    parenMatchCount--
                                }
                                if (parenMatchCount === 0)
                                {
                                    if (tmpTokens.length > 0 && (popToken = tmpTokens[tmpTokens.length - 1]) && (popToken.type === 2))
                                    {
                                        tmpTokens.pop()
                                    }
                                    break
                                }
                            }
                        }
                        textIndex += token.text.length;
                        if (textIndex >= caretPosition)
                        {
                            break
                        }
                    }
                    if (tmpTokens.length > 0)
                    {
                        var activeParamterIndex = 0;
                        while (tmpTokens.length > 0)
                        {
                            token = tmpTokens.pop();
                            if (token.type === 8)
                            {
                                activeParamterIndex++
                            }
                            else if (token.type === 2)
                            {
                                break
                            }
                        }
                        if (token.type === 2)
                        {
                            var funcName = token.text.toUpperCase();
                            var funcs = this._getFuncs(),
                                funcCount = (funcs && funcs.length),
                                func;
                            for (var i = 0; i < funcCount; i++)
                            {
                                func = funcs[i];
                                if (func.name.toUpperCase() === funcName)
                                {
                                    return {
                                            func: func, activeParamterIndex: activeParamterIndex, isFunc: func.isFunc
                                        }
                                }
                            }
                        }
                    }
                    return keyword_null
                };
                FormulaTextBox.prototype._openFuncs = function()
                {
                    var self = this;
                    var funcs = self._getFuncsForInput();
                    var show = (self._autoComplete && self._isFormula(self.text()) && funcs && funcs.length > 0 && !self._isAppending && !self._isImeInputting);
                    if (show)
                    {
                        self._closeFuncHelp();
                        var funcsPopup = self._funcsPopup;
                        if (funcs.length > 8)
                        {
                            funcsPopup.style.height = "204px";
                            funcsPopup.style.overflowY = "scroll"
                        }
                        else
                        {
                            funcsPopup.style.height = "auto";
                            funcsPopup.style.overflowY = ""
                        }
                        var popupContent = "";
                        var count = funcs.length,
                            func;
                        for (var i = 0; i < count; i++)
                        {
                            func = funcs[i];
                            popupContent += "<div class='gcsj-func-ac-row'>" + "<div class='gcsj-func-ac-row-name' isFunc=" + func.isFunc + ">" + func.name + "</div>" + "<div class='gcsj-func-ac-row-description'>" + (func.shortDescription || func.description) + "</div>" + "</div>"
                        }
                        var $funcsPopup = $(self._funcsPopup);
                        $funcsPopup.html(popupContent).show();
                        self._isFuncsShown = true;
                        var $items = $funcsPopup.find(".gcsj-func-ac-row");
                        if ($items.length > 0)
                        {
                            var activeClassName = 'gcsj-ac-row-active';
                            $($items[0]).addClass(activeClassName);
                            $items.hover(function()
                            {
                                $items.removeClass(activeClassName);
                                $(this).addClass(activeClassName)
                            });
                            $items.click(function()
                            {
                                self._completeFunc()
                            })
                        }
                        self.position()
                    }
                    else
                    {
                        self._closeFuncs()
                    }
                };
                FormulaTextBox.prototype._getFuncsForInput = function()
                {
                    var self = this;
                    var token = self._getToken(self.caret()),
                        tokenText = (token && token.text),
                        funcs = [];
                    var tokenIndex = self._tokens.indexOf(token);
                    if (token && token.type === 14)
                    {
                        return funcs
                    }
                    var tableColumnNames = self._getTableColumnNames(tokenIndex);
                    if (tableColumnNames.length > 0)
                    {
                        funcs = funcs.concat(tableColumnNames).concat(Sheets.SR.getHelpTableFuncs());
                        if (Sheets.StringUtil.endsWith(tokenText, '[') || Sheets.StringUtil.endsWith(tokenText, '[@'))
                        {
                            return funcs
                        }
                    }
                    else
                    {
                        funcs = this._getFuncs()
                    }
                    tokenText = self._getTextInTokenBeforeCaret();
                    var result = [];
                    if (tokenText)
                    {
                        result = self._getFuncsStartWith(tokenText, funcs)
                    }
                    return result
                };
                FormulaTextBox.prototype._getTableColumnNames = function(tokenIndex)
                {
                    var columnNames = [];
                    var tokens = this._tokens,
                        tokenCount = (tokens && tokens.length);
                    if (tokenIndex < 0 || tokenIndex >= tokens.length)
                    {
                        return columnNames
                    }
                    var spreadTmp = this._spread;
                    var sheet = (spreadTmp && spreadTmp.getActiveSheet());
                    var dealedTable = {};
                    if (typeof tokenIndex === "undefined" || tokenIndex === keyword_null)
                    {
                        tokenIndex = tokenCount
                    }
                    if (sheet)
                    {
                        var token = tokens[tokenIndex];
                        var table = sheet.findTableByName(Sheets.StringUtil.leftBefore(token.text, '['));
                        if (table !== keyword_null && !dealedTable[table])
                        {
                            dealedTable[table] = true;
                            var index = 0;
                            var tableName = "";
                            while (tableName !== keyword_null)
                            {
                                tableName = table.getColumnName(index++);
                                if (tableName !== keyword_null)
                                {
                                    columnNames.push({
                                        name: tableName, description: ''
                                    })
                                }
                            }
                            if (columnNames.length > 0)
                            {
                                return columnNames
                            }
                        }
                    }
                    return columnNames
                };
                FormulaTextBox.prototype._closeFuncs = function()
                {
                    $(this._funcsPopup).hide();
                    this._isFuncsShown = false
                };
                FormulaTextBox.prototype._selectFunc = function(step)
                {
                    var $items = $(this._funcsPopup).find(".gcsj-func-ac-row"),
                        count = $items.length;
                    if (count === 0)
                    {
                        return
                    }
                    var activeClassName = 'gcsj-ac-row-active';
                    var newIndex = 0;
                    if (step)
                    {
                        for (var i = 0; i < count; i++)
                        {
                            if ($($items[i]).hasClass(activeClassName))
                            {
                                newIndex = i + step;
                                break
                            }
                        }
                    }
                    var scrollTopTmp = $(this._funcsPopup).scrollTop();
                    $items.removeClass(activeClassName);
                    var offsetHeight = 0;
                    if (count > 0)
                    {
                        offsetHeight = $items[0].offsetHeight
                    }
                    newIndex = Math_max(newIndex, 0);
                    newIndex = Math_min(newIndex, count - 1);
                    $($items[newIndex]).addClass(activeClassName);
                    if ($items[newIndex].offsetTop + $items[newIndex].offsetHeight > $(this._funcsPopup).scrollTop() + $(this._funcsPopup).height())
                    {
                        $(this._funcsPopup).scrollTop($(this._funcsPopup).scrollTop() + offsetHeight)
                    }
                    else if ($items[newIndex].offsetTop < $(this._funcsPopup).scrollTop())
                    {
                        $(this._funcsPopup).scrollTop($items[newIndex].offsetTop)
                    }
                    else
                    {
                        $(this._funcsPopup).scrollTop(scrollTopTmp)
                    }
                };
                FormulaTextBox.prototype._completeFunc = function()
                {
                    var self = this;
                    var active = $(self._funcsPopup).find(".gcsj-ac-row-active .gcsj-func-ac-row-name");
                    var funcName = active.text();
                    var isFunc = active.attr('isFunc') === 'true';
                    if (!funcName)
                    {
                        return
                    }
                    var caretPosition = self.caret(),
                        tokens = self._tokens,
                        tokenCount = (tokens && tokens.length);
                    var tokenTextIndex = 0,
                        tokenTextLength = 0,
                        tokenIndex = 0,
                        token = keyword_null;
                    while (tokenIndex < tokenCount)
                    {
                        token = tokens[tokenIndex];
                        tokenTextLength = token.text.length;
                        if (tokenTextIndex + tokenTextLength >= caretPosition)
                        {
                            break
                        }
                        tokenIndex++;
                        tokenTextIndex += tokenTextLength
                    }
                    var offset = caretPosition - tokenTextIndex;
                    var curTokenText = token.text;
                    var begin = 0,
                        end = 0;
                    if (Sheets.StringUtil.contains(curTokenText, '['))
                    {
                        begin = curTokenText.lastIndexOf('[', offset - 1);
                        if (begin === -1)
                        {
                            begin = curTokenText.indexOf('[');
                            if (begin === -1)
                            {
                                token.text = funcName
                            }
                            else
                            {
                                token.text = funcName + curTokenText.substr(begin)
                            }
                            begin = 0
                        }
                        else
                        {
                            begin++;
                            if (curTokenText.charAt(begin) === '@')
                            {
                                begin = begin + 1
                            }
                            end = curTokenText.indexOf(']', offset);
                            if (end === -1)
                            {
                                end = curTokenText.length
                            }
                            token.text = curTokenText.substring(0, begin) + funcName + curTokenText.substr(end)
                        }
                    }
                    else
                    {
                        token.text = funcName
                    }
                    if (isFunc)
                    {
                        token.type = 2
                    }
                    else
                    {
                        token.type = 11
                    }
                    var nextTokenIndex = tokenIndex + 1,
                        nextToken = tokens[nextTokenIndex],
                        curToken = tokens[tokenIndex];
                    if (isFunc && (!nextToken || nextToken.type !== 5))
                    {
                        tokens.splice(nextTokenIndex, 0, {
                            text: '(', type: 5
                        })
                    }
                    self._closeFuncs();
                    self._host.focus();
                    self._updateHostValue();
                    self.caret(tokenTextIndex + funcName.length + begin + (isFunc ? 1 : 0));
                    self._openFuncHelp();
                    self._tokens = self._parse(self.text());
                    self._trigger(EVENT_TEXTCHANGED, {})
                };
                FormulaTextBox.prototype._openFuncHelp = function()
                {
                    var self = this;
                    if (self._isFuncsShown)
                    {
                        self._closeFuncs()
                    }
                    var activeFuncInfo = self._getActiveFuncInfo();
                    if (activeFuncInfo === keyword_null || activeFuncInfo.isFunc !== true)
                    {
                        self._closeFuncHelp();
                        return
                    }
                    var show = (self._showHelp && self._isFormula(self.text()) && activeFuncInfo && !self._isAppending && !self._isImeInputting);
                    if (show)
                    {
                        var func = activeFuncInfo.func;
                        var paramters = func.parameters,
                            paramterCount = (paramters && paramters.length),
                            activeParamterIndex = Math_min(paramterCount - 1, activeFuncInfo.activeParamterIndex),
                            paramter;
                        var helpParamters = "";
                        for (var i = 0; i < paramterCount; i++)
                        {
                            paramter = paramters[i];
                            var p = paramter.name;
                            if (paramter.repeatable)
                            {
                                p += ",..."
                            }
                            if (paramter.optional)
                            {
                                p = "[" + p + "]"
                            }
                            var paramterSeparator = (i === paramterCount - 1 ? "" : ", ");
                            if (i === activeParamterIndex)
                            {
                                p = "<span class='gcsj-func-help-paramter gcsj-func-help-paramter-active'>" + p + "</span>" + paramterSeparator
                            }
                            else
                            {
                                p = "<span class='gcsj-func-help-paramter'>" + p + "</span>" + paramterSeparator
                            }
                            helpParamters += p
                        }
                        var helpTitle = "<div class='gcsj-func-help-title'>" + "<div class='gcsj-func-help-formula'>" + "<span class='gcsj-func-help-formula-name'>" + func.name + "</span>" + "<span class='gcsj-func-help-paramter-paren'>(</span>" + helpParamters + "<span class='gcsj-func-help-paramter-paren'>)</span>" + "</div>" + "</div>";
                        var helpSummary = "<div class='gcsj-func-help-section'>" + "<div class='gcsj-func-help-section-title'>" + Sheets.SR.Fbx_Summary + "</div>" + "<div class='gcsj-func-help-section-content'>" + func.description + "</div>" + "</div>";
                        var helpContent = "<div class='gcsj-func-help-section-content'>" + helpSummary + "</div>";
                        var helpBody = "<div class='gcsj-func-help-body'>" + helpContent + "</div>";
                        var popupContent = helpTitle + helpBody;
                        $(self._funcHelpPopup).html(popupContent).show();
                        self._isFuncHelpShown = true;
                        self.position()
                    }
                    else
                    {
                        self._closeFuncHelp()
                    }
                };
                FormulaTextBox.prototype._closeFuncHelp = function()
                {
                    $(this._funcHelpPopup).hide();
                    this._isFuncHelpShown = false
                };
                FormulaTextBox.prototype.close = function()
                {
                    this._closeFuncs();
                    this._closeFuncHelp()
                };
                FormulaTextBox.prototype.isReservedKey = function(e)
                {
                    if (this._isAppending)
                    {
                        return false
                    }
                    var modifyKey = e.ctrlKey || e.shiftKey || e.altKey || e.metaKey,
                        keyCode = e.keyCode;
                    if (this._isFuncsShown && !modifyKey && (keyCode === Keys.down || keyCode === Keys.up || keyCode === Keys.tab))
                    {
                        return true
                    }
                    return false
                };
                FormulaTextBox.prototype.position = function()
                {
                    var self = this;
                    var popup = keyword_null;
                    if (self._isFuncsShown)
                    {
                        popup = self._funcsPopup
                    }
                    else if (self._isFuncHelpShown)
                    {
                        popup = self._funcHelpPopup
                    }
                    if (!popup)
                    {
                        return
                    }
                    var $host = $(self._host),
                        $popup = $(popup);
                    var ftbAcrossSheet = Sheets.IFormulatextboxAcrossSheetSingleton.formulatextboxAcrossSheetInstance;
                    if (ftbAcrossSheet && ftbAcrossSheet.sheet)
                    {
                        var rect = ftbAcrossSheet.sheet.getCellRect(ftbAcrossSheet.rowIndex, ftbAcrossSheet.columnIndex);
                        var evenHandler = ftbAcrossSheet.sheet._eventHandler;
                        var canvasOffset = ftbAcrossSheet.canvasOffset;
                        $popup.css("top", rect.y + rect.height + canvasOffset.top).css("left", rect.x + canvasOffset.left);
                        return
                    }
                    var top = $host.parent().css("top");
                    var topNumber = parseFloat(top);
                    if (!isNaN(topNumber))
                    {
                        top = topNumber
                    }
                    var left = $host.parent().css("left");
                    if (top === 'auto')
                    {
                        top = $host.offset().top;
                        left = $host.offset().left
                    }
                    var inputBottom = top + $host.outerHeight();
                    var totalHeight = $(window).outerHeight();
                    var popupHeight = $popup.outerHeight();
                    var bottomIfDown = inputBottom + popupHeight;
                    if (bottomIfDown > totalHeight)
                    {
                        var topIfUp = top - popupHeight;
                        if (topIfUp >= 0)
                        {
                            inputBottom = topIfUp
                        }
                    }
                    $popup.css("top", inputBottom).css("left", left)
                };
                FormulaTextBox.prototype.focus = function()
                {
                    $(this._host).focus()
                };
                FormulaTextBox.prototype._colorText = function(tokens)
                {
                    var self = this;
                    var htmlContent = "",
                        tokensText = "";
                    var tokenCount = (tokens && tokens.length),
                        rangeIndex = 0,
                        token;
                    for (var i = 0; i < tokenCount; i++)
                    {
                        token = tokens[i];
                        var style = "";
                        if (token.type === 11)
                        {
                            style = " style='color: " + self.getRangeColor(rangeIndex++) + "'"
                        }
                        htmlContent += "<span" + style + " class='gcsj-func-color-text'>" + token.text + "</span>";
                        tokensText += token.text
                    }
                    if (!tokensText && !self.text())
                    {
                        return
                    }
                    var host = self._host;
                    if (htmlContent)
                    {
                        host.innerHTML = "<span class='gcsj-func-color-content'>" + htmlContent + "</span>"
                    }
                    else
                    {
                        while (host.firstChild)
                        {
                            host.removeChild(host.firstChild)
                        }
                    }
                };
                FormulaTextBox.prototype._getColorNode = function(element, position)
                {
                    var $nodes = $(element).find('.gcsj-func-color-content .gcsj-func-color-text'),
                        nodeCount = $nodes.length;
                    if (nodeCount > 0)
                    {
                        position = Math_max(0, position);
                        var node,
                            text;
                        for (var i = 0; i < nodeCount; i++)
                        {
                            node = $nodes[i];
                            text = node.textContent;
                            position -= text.length;
                            if (position <= 0)
                            {
                                return {
                                        node: node, offset: text.length + position
                                    }
                            }
                        }
                        return {
                                node: node, offset: text.length
                            }
                    }
                    return keyword_null
                };
                FormulaTextBox.DEFAULT_RANGE_COLORS = ["#0000ff", "#008000", "#9900cc", "#800000", "#00cc33", "#cc6600", "#cc0099"];
                return FormulaTextBox
            })();
        Sheets.FormulaTextBox = FormulaTextBox;
        var TokenType;
        (function(TokenType)
        {
            TokenType[TokenType["FormulaStart"] = 1] = "FormulaStart";
            TokenType[TokenType["FunctionName"] = 2] = "FunctionName";
            TokenType[TokenType["BraceOpen"] = 3] = "BraceOpen";
            TokenType[TokenType["BraceClose"] = 4] = "BraceClose";
            TokenType[TokenType["ParenOpen"] = 5] = "ParenOpen";
            TokenType[TokenType["ParenClose"] = 6] = "ParenClose";
            TokenType[TokenType["Operator"] = 7] = "Operator";
            TokenType[TokenType["ArgumentSeparator"] = 8] = "ArgumentSeparator";
            TokenType[TokenType["ArrayArgumentSeparator"] = 9] = "ArrayArgumentSeparator";
            TokenType[TokenType["ArrayGroupSeparator"] = 10] = "ArrayGroupSeparator";
            TokenType[TokenType["Range"] = 11] = "Range";
            TokenType[TokenType["Boolean"] = 12] = "Boolean";
            TokenType[TokenType["Number"] = 13] = "Number";
            TokenType[TokenType["String"] = 14] = "String";
            TokenType[TokenType["Whitespace"] = 15] = "Whitespace";
            TokenType[TokenType["Error"] = 16] = "Error";
            TokenType[TokenType["Literal"] = 17] = "Literal"
        })(TokenType || (TokenType = {}));
        ;
        var Tokenizer = (function()
            {
                function Tokenizer(){}
                Tokenizer.parse = function(formula)
                {
                    var tokens = [],
                        self = this;
                    if (formula && formula[0] !== '=')
                    {
                        self.addToken(tokens, formula, 17);
                        return tokens
                    }
                    var fLength = (formula && formula.length),
                        inBraceRef = 0,
                        ch,
                        tokenTxt = "";
                    var arrayArgumentSepatator = (GcSpread.Sheets.CR.listSeparator === GcSpread.Sheets.CR.arrayGroupSeparator) ? '\\' : GcSpread.Sheets.CR.listSeparator;
                    var listSeparator = GcSpread.Sheets.CR.listSeparator;
                    var arrayGroupSeparator = GcSpread.Sheets.CR.arrayGroupSeparator;
                    for (var index = 0; index < fLength; index++)
                    {
                        ch = formula[index];
                        switch (ch)
                        {
                            case"'":
                                tokenTxt = self.addToken(tokens, tokenTxt);
                                var inQuote = true;
                                do
                                {
                                    tokenTxt += ch;
                                    ch = formula[++index];
                                    if (ch === "'" && formula[index + 1] === "'")
                                    {
                                        tokenTxt += ch;
                                        ch = formula[++index]
                                    }
                                    else
                                    {
                                        inQuote = (ch !== "'")
                                    }
                                } while (inQuote && index < fLength - 1);
                                if (ch !== keyword_undefined)
                                {
                                    tokenTxt += ch
                                }
                                break;
                            case'"':
                                tokenTxt = self.addToken(tokens, tokenTxt);
                                var inQuote = true;
                                do
                                {
                                    tokenTxt += ch;
                                    ch = formula[++index];
                                    if (ch === '"' && formula[index + 1] === '"')
                                    {
                                        tokenTxt += ch;
                                        ch = formula[++index]
                                    }
                                    else
                                    {
                                        inQuote = (ch !== '"')
                                    }
                                } while (inQuote && index < fLength - 1);
                                if (ch !== keyword_undefined)
                                {
                                    tokenTxt += ch
                                }
                                tokenTxt = self.addToken(tokens, tokenTxt, 14);
                                break;
                            case"\\":
                                self.addToken(tokens, tokenTxt);
                                tokenTxt = self.addToken(tokens, ch, 9);
                                break;
                            case arrayArgumentSepatator:
                                self.addToken(tokens, tokenTxt);
                                tokenTxt = self.addToken(tokens, ch, (inBraceRef > 0 ? 9 : 8));
                                break;
                            case listSeparator:
                                self.addToken(tokens, tokenTxt);
                                tokenTxt = self.addToken(tokens, ch, (inBraceRef > 0 ? 9 : 8));
                                break;
                            case arrayGroupSeparator:
                                self.addToken(tokens, tokenTxt);
                                tokenTxt = self.addToken(tokens, ch, 10);
                                break;
                            case"{":
                                self.addToken(tokens, tokenTxt);
                                tokenTxt = self.addToken(tokens, ch, 3);
                                inBraceRef++;
                                break;
                            case"}":
                                self.addToken(tokens, tokenTxt);
                                tokenTxt = self.addToken(tokens, ch, 4);
                                inBraceRef--;
                                break;
                            case"(":
                                self.addToken(tokens, tokenTxt, 2);
                                tokenTxt = self.addToken(tokens, ch, 5);
                                break;
                            case")":
                                self.addToken(tokens, tokenTxt);
                                tokenTxt = self.addToken(tokens, ch, 6);
                                break;
                            case"=":
                                self.addToken(tokens, tokenTxt);
                                if (index === 0)
                                {
                                    tokenTxt = self.addToken(tokens, ch, 1)
                                }
                                else
                                {
                                    tokenTxt = self.addToken(tokens, ch, 7)
                                }
                                break;
                            case"/":
                                var val = tokenTxt.toUpperCase(),
                                    nextCh = (index + 1 < fLength ? formula[index + 1] : ""),
                                    nextNextCh = (index + 2 < fLength ? formula[index + 2] : "");
                                if ((val === "#DIV" && nextCh === "0" && nextNextCh === "!") || (val === "#N" && nextCh.toUpperCase() === "A"))
                                {
                                    tokenTxt += ch + nextCh;
                                    index++;
                                    if ("#DIV" === tokenTxt)
                                    {
                                        tokenTxt += nextNextCh;
                                        index++
                                    }
                                    tokenTxt = self.addToken(tokens, tokenTxt)
                                }
                                else
                                {
                                    self.addToken(tokens, tokenTxt);
                                    tokenTxt = self.addToken(tokens, ch, 7)
                                }
                                break;
                            case"+":
                            case"-":
                                var nowText = tokenTxt.replace(/\s/g, "").toUpperCase(),
                                    findIndex = Math_max(0, nowText.length - 2);
                                if (nowText.lastIndexOf("R[") >= findIndex || nowText.lastIndexOf("C[") >= findIndex)
                                {
                                    tokenTxt += ch
                                }
                                else
                                {
                                    self.addToken(tokens, tokenTxt);
                                    tokenTxt = self.addToken(tokens, ch, 7)
                                }
                                break;
                            case"&":
                            case"^":
                            case"*":
                            case"%":
                                self.addToken(tokens, tokenTxt);
                                tokenTxt = self.addToken(tokens, ch, 7);
                                break;
                            case"<":
                            case">":
                                tokenTxt = self.addToken(tokens, tokenTxt);
                                tokenTxt += ch;
                                var nextCh = (index + 1 < fLength ? formula[index + 1] : "");
                                if (nextCh === "=" || (ch === "<" && nextCh === ">"))
                                {
                                    tokenTxt += nextCh;
                                    index++
                                }
                                tokenTxt = self.addToken(tokens, tokenTxt, 7);
                                break;
                            case" ":
                            case"\u00a0":
                            case"\r":
                            case"\n":
                            case"\t":
                                tokenTxt = self.addToken(tokens, tokenTxt);
                                tokenTxt += ch;
                                while (index < fLength - 1 && /^[\s]*$/.test(formula[index + 1]))
                                {
                                    tokenTxt += formula[++index]
                                }
                                tokenTxt = self.addToken(tokens, tokenTxt, 15);
                                break;
                            default:
                                tokenTxt += ch;
                                break
                        }
                    }
                    self.addToken(tokens, tokenTxt);
                    return tokens
                };
                Tokenizer.addToken = function(tokens, tokenText, tokenType)
                {
                    var self = this;
                    if (tokenText)
                    {
                        if (typeof(tokenType) === 'undefined')
                        {
                            if (self.calcErrors.indexOf(tokenText.toUpperCase()) > -1)
                            {
                                tokenType = 16
                            }
                            else if (self.rNumber.test(tokenText))
                            {
                                tokenType = 13
                            }
                            else if (self.rBoolean.test(tokenText))
                            {
                                tokenType = 12
                            }
                            else if (self.rRangeA1.test(tokenText) || self.rRangeR1C1.test(tokenText))
                            {
                                tokenType = 11
                            }
                            else
                            {
                                tokenType = 17
                            }
                        }
                        var isJoinType = function(t)
                            {
                                return (t === 11 || t === 17 || t === 13)
                            };
                        if (isJoinType(tokenType))
                        {
                            var tokenCount = tokens.length,
                                tk,
                                tkType,
                                tkText,
                                index,
                                joinText = "";
                            for (index = tokenCount - 1; index >= 0; index--)
                            {
                                tk = tokens[index];
                                tkType = tk.type;
                                tkText = tk.text;
                                joinText = tkText + joinText;
                                if (tkType !== 15 && tkText !== ":")
                                {
                                    break
                                }
                            }
                            var rangeText;
                            if (isJoinType(tkType))
                            {
                                joinText += tokenText;
                                rangeText = joinText[joinText.length - 1] === ":" ? joinText.substr(0, joinText.length - 1) : joinText;
                                rangeText = rangeText.trim();
                                if (self.rRangeA1.test(rangeText) || self.rRangeR1C1.test(rangeText))
                                {
                                    tokens.splice(index);
                                    tokenText = joinText;
                                    tokenType = 11
                                }
                            }
                            else if (tokenText[tokenText.length - 1] === ":")
                            {
                                rangeText = tokenText.substr(0, tokenText.length - 1);
                                if (self.rRangeA1.test(rangeText) || self.rRangeR1C1.test(rangeText))
                                {
                                    tokenType = 11
                                }
                            }
                        }
                        tokens.push({
                            text: tokenText, type: tokenType
                        })
                    }
                    return ""
                };
                Tokenizer.rNumber = /^(\+|-)?((\d\d*\,?\d*)|(\d*\,?\d\d*))$/;
                Tokenizer.rBoolean = /^(TRUE|FALSE)$/i;
                Tokenizer.rRangeA1 = /^(.*!)?((\$?[a-z]+\$?\d+(\s*:\s*\$?[a-z]+\$?\d+)?)|(\$?[a-z]+\s*:\s*\$?[a-z]+)|(\$?\d+\s*:\s*\$?\d+)|(\$?[a-z]+\$?\d+\s*:\s*\$?\d+)|(\$?\d+\s*:\s*\$?[a-z]+\$?\d+)|(\$?[a-z]+\$?\d+\s*:\s*\$?[a-z]+)|(\$?[a-z]+\s*:\s*\$?[a-z]+\$?\d+))$/i;
                Tokenizer.rRangeR1C1 = /^(.*!)?((R\[?[-+]?\d*\]?C\[?[-+]?\d*\]?\s*(:\s*R\[?[-+]?\d*\]?C\[?[-+]?\d*\]?)?)|(R\[?[-+]?\d*\]?\s*(:\s*R\[?[-+]?\d*\]?)?)|(C\[?[-+]?\d*\]?\s*(:\s*C\[?[-+]?\d*\]?)?)|(R\[?[-+]?\d*\]?C\[?[-+]?\d*\]?\s*(:\s*C\[?[-+]?\d*\]?)?)|(C\[?[-+]?\d*\]?\s*(:\s*R\[?[-+]?\d*\]?C\[?[-+]?\d*\]?))?|(R\[?[-+]?\d*\]?C\[?\[-+]?d*\]?\s*(:\s*R\[?[-+]?\d*\]?))?|(R\[?[-+]?\d*\]?\s*(:\s*R\[?[-+]?\d*\]?C\[?[-+]?\d*\]?))?)$/i;
                Tokenizer.calcErrors = "#DIV/0! #N/A #NAME? #NULL! #NUM! #REF! #VALUE!".split(" ");
                return Tokenizer
            })();
        ;
        var FormulatextboxAcrossSheet = (function()
            {
                function FormulatextboxAcrossSheet()
                {
                    var self = this;
                    self.rowIndex = -1;
                    self.columnIndex = -1;
                    self.text = "";
                    self.caret = -1;
                    self.sheet = null;
                    self.isAppending = false;
                    self.appendingIndex = -1;
                    self.dom = null;
                    self.spread = null;
                    self.canvasOffset = null
                }
                FormulatextboxAcrossSheet.prototype.clear = function()
                {
                    var self = this;
                    self.removeDom();
                    self.rowIndex = -1;
                    self.columnIndex = -1;
                    self.text = "";
                    self.caret = -1;
                    self.isAppending = false;
                    self.appendingIndex = -1;
                    self.sheet = null;
                    self.spread = null;
                    self.canvasOffset = null
                };
                FormulatextboxAcrossSheet.prototype.removeDom = function()
                {
                    var self = this;
                    var cellType = self.sheet.getCellType(self.rowIndex, self.columnIndex);
                    var context = {
                            sheet: self.sheet, row: self.rowIndex, col: self.columnIndex, sheetArea: 3
                        };
                    cellType.deactivateEditor(self.dom, context);
                    $(self.dom).remove();
                    self.dom = null
                };
                FormulatextboxAcrossSheet.prototype.save = function(sheet)
                {
                    var self = this;
                    if (sheet._formulaTextBox)
                    {
                        self.text = sheet._formulaTextBox.text();
                        self.rowIndex = sheet.getActiveRowIndex();
                        self.columnIndex = sheet.getActiveColumnIndex();
                        self.caret = sheet._formulaTextBox.caret();
                        self.isAppending = sheet._formulaTextBox.isAppending();
                        self.appendingIndex = sheet._formulaTextBox.appendingStartIndex();
                        self.sheet = sheet;
                        self.spread = sheet.parent;
                        self.canvasOffset = sheet._eventHandler._getCanvasPosition()
                    }
                };
                FormulatextboxAcrossSheet.prototype.update = function(sheet)
                {
                    var self = this;
                    if (sheet._formulaTextBox)
                    {
                        self.text = sheet._formulaTextBox.text();
                        self.caret = sheet._formulaTextBox.caret();
                        self.isAppending = sheet._formulaTextBox.isAppending();
                        self.appendingIndex = sheet._formulaTextBox.appendingStartIndex()
                    }
                };
                FormulatextboxAcrossSheet.prototype.exportInfo = function(sheet)
                {
                    var self = this;
                    if (sheet._formulaTextBox)
                    {
                        sheet._formulaTextBox.text(self.text);
                        sheet._formulaTextBox.caret(self.caret);
                        if (self.isAppending)
                        {
                            sheet._formulaTextBox.startAppending();
                            sheet._formulaTextBox.appendingStartIndex(self.appendingIndex)
                        }
                    }
                };
                FormulatextboxAcrossSheet.prototype.handleFormulatextboxBeforeChange = function(oldSheet, newSheet)
                {
                    var self = this;
                    if (oldSheet._formulaTextBox)
                    {
                        oldSheet._formulaTextBox.close()
                    }
                    if (!self.text && (!self.sheet) && oldSheet._formulaTextBox && oldSheet._formulaTextBox.canAppendRange())
                    {
                        self.save(oldSheet);
                        var cacheValue = oldSheet.getValue(oldSheet._activeRowIndex, oldSheet._activeColIndex, 3);
                        oldSheet.suspendEvent();
                        oldSheet.endEdit(true);
                        oldSheet.resumeEvent();
                        oldSheet.setValue(oldSheet._activeRowIndex, oldSheet._activeColIndex, cacheValue, 3, true);
                        oldSheet._editorStatus = 1;
                        return
                    }
                    if (self.text && self.sheet === newSheet && oldSheet._formulaTextBox)
                    {
                        self.update(oldSheet);
                        oldSheet._formulaTextBox.destroy();
                        oldSheet._formulaTextBox = keyword_null;
                        return
                    }
                    if (self.text && self.sheet !== newSheet && oldSheet._formulaTextBox)
                    {
                        self.update(oldSheet);
                        oldSheet._formulaTextBox.destroy();
                        oldSheet._formulaTextBox = keyword_null
                    }
                };
                FormulatextboxAcrossSheet.prototype.handleFormulatextboxAfterChange = function(oldSheet, newSheet, saveValue)
                {
                    if (typeof saveValue === "undefined")
                    {
                        saveValue = true
                    }
                    var self = this;
                    if (self.dom && self.text === "")
                    {
                        oldSheet._loadAndSetSheetSelections();
                        self.clear()
                    }
                    if (self.text && self.sheet === newSheet)
                    {
                        newSheet._editorStatus = 0;
                        newSheet._setActiveCellAndSelection(self.rowIndex, self.columnIndex, keyword_undefined, keyword_undefined, 1);
                        if (saveValue)
                        {
                            newSheet.suspendEvent();
                            newSheet.startEdit(false);
                            self.exportInfo(newSheet);
                            self.updateEditor(newSheet, self.rowIndex, self.columnIndex);
                            newSheet.resumeEvent();
                            oldSheet._loadAndSetSheetSelections()
                        }
                        self.clear();
                        return
                    }
                    if (self.text && !self.dom)
                    {
                        newSheet._editorStatus = 1;
                        oldSheet._editorStatus = 1;
                        self.createHiddenDomForFormulaAcrossSheet(newSheet);
                        newSheet._saveAndClearSheetSelections();
                        return
                    }
                    if (self.text && self.sheet !== newSheet)
                    {
                        newSheet._editorStatus = 1;
                        oldSheet._editorStatus = 1;
                        self.createHiddenDomForFormulaAcrossSheet(newSheet);
                        oldSheet._loadAndSetSheetSelections();
                        newSheet._saveAndClearSheetSelections();
                        return
                    }
                };
                FormulatextboxAcrossSheet.prototype.createHiddenDomForFormulaAcrossSheet = function(newSheet)
                {
                    var self = this;
                    var sheet = self.sheet;
                    var row = self.rowIndex;
                    var col = self.columnIndex;
                    var cellType = sheet.getCellType(row, col);
                    var context = {
                            sheet: sheet, row: row, col: col, sheetArea: 3, canvasOffset: this.canvasOffset
                        };
                    var isImeAware = cellType.isImeAware(context);
                    var focusHolder;
                    if (isImeAware)
                    {
                        newSheet._editorStatus = 1;
                        focusHolder = cellType.createEditorElement(context);
                        if (self.dom)
                        {
                            self.removeDom()
                        }
                        self.dom = focusHolder;
                        $(focusHolder).css("position", "absolute");
                        var rect = sheet.getCellRect(row, col);
                        $(focusHolder).attr("id", "across");
                        var style = sheet.getActualStyle(row, col);
                        cellType.activateEditor(focusHolder, style, rect, context);
                        var parentElement = self.spread && self.spread.getHost() || document.body;
                        parentElement.insertBefore(focusHolder, keyword_null);
                        var editingElement = cellType.getEditingElement();
                        newSheet._attachFormulaTextBox(editingElement);
                        cellType.focus(focusHolder);
                        self.exportInfo(newSheet);
                        cellType.updateEditor(focusHolder, style, rect, context)
                    }
                };
                FormulatextboxAcrossSheet.prototype.updateEditor = function(sheet, activeRow, activeCol)
                {
                    var ct = sheet.getCellType(activeRow, activeCol),
                        editor = sheet._editor,
                        sheetLayout = sheet._getSheetLayout(),
                        cellStyle = sheet.getActualStyle(activeRow, activeCol),
                        cellRect = sheet.getCellRect(activeRow, activeCol);
                    if (cellRect && cellRect.width > 0 && cellRect.height > 0 && cellRect.x >= sheetLayout.frozenX && cellRect.y >= sheetLayout.frozenY && cellRect.x + cellRect.width <= sheetLayout.frozenTrailingX + sheetLayout.frozenTrailingWidth && cellRect.y + cellRect.height <= sheetLayout.frozenTrailingY + sheetLayout.frozenTrailingHeight)
                    {
                        var context = {
                                sheet: sheet, row: activeRow, col: activeCol, sheetArea: 3
                            };
                        ct.updateEditor(editor, cellStyle, cellRect, context)
                    }
                };
                return FormulatextboxAcrossSheet
            })();
        Sheets.FormulatextboxAcrossSheet = FormulatextboxAcrossSheet;
        var FormulatextboxAcrossSheetSingleton = (function(_super)
            {
                __extends(FormulatextboxAcrossSheetSingleton, _super);
                function FormulatextboxAcrossSheetSingleton()
                {
                    _super.apply(this, arguments)
                }
                FormulatextboxAcrossSheetSingleton.handleFormulatextboxAcrossSheetBeforeTabChange = function(e, eData)
                {
                    var oldSheet = eData.oldSheet;
                    var newSheet = eData.newSheet;
                    if (oldSheet === newSheet)
                    {
                        return
                    }
                    if (!Sheets.IFormulatextboxAcrossSheetSingleton.formulatextboxAcrossSheetInstance)
                    {
                        Sheets.IFormulatextboxAcrossSheetSingleton.formulatextboxAcrossSheetInstance = new FormulatextboxAcrossSheet
                    }
                    Sheets.IFormulatextboxAcrossSheetSingleton.formulatextboxAcrossSheetInstance.handleFormulatextboxBeforeChange(oldSheet, newSheet)
                };
                FormulatextboxAcrossSheetSingleton.handleFormulatextboxAcrossSheetAfterTabChange = function(e, eData)
                {
                    var oldSheet = eData.oldSheet;
                    var newSheet = eData.newSheet;
                    if (oldSheet === newSheet)
                    {
                        return
                    }
                    Sheets.IFormulatextboxAcrossSheetSingleton.formulatextboxAcrossSheetInstance.handleFormulatextboxAfterChange(oldSheet, newSheet)
                };
                return FormulatextboxAcrossSheetSingleton
            })(Sheets.IFormulatextboxAcrossSheetSingleton);
        Sheets.FormulatextboxAcrossSheetSingleton = FormulatextboxAcrossSheetSingleton
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}));
var GcSpread;
(function(GcSpread)
{
    (function(Sheets)
    {
        Sheets.feature("formulatextbox_resource");
        var Table_FunctionDescription = (function()
            {
                function Table_FunctionDescription(name, description)
                {
                    this.name = name;
                    this.description = description
                }
                return Table_FunctionDescription
            })();
        var ParameterDescription = (function()
            {
                function ParameterDescription(name, repeatable)
                {
                    this.name = name;
                    this.repeatable = repeatable
                }
                return ParameterDescription
            })();
        var FunctionDescription = (function()
            {
                function FunctionDescription(name, description, parameters)
                {
                    this.name = name;
                    this.description = description;
                    this.parameters = parameters
                }
                return FunctionDescription
            })();
        var FormulaTextBoxResource_EN = (function()
            {
                function FormulaTextBoxResource_EN(){}
                FormulaTextBoxResource_EN.Table_Functions = [new Table_FunctionDescription("#All", "Returns the entire contents of the table, or specified table columns including column headers, data and total rows."), new Table_FunctionDescription("#Data", "Returns the data cells of the table or specified table columns."), new Table_FunctionDescription("#Headers", "Returns the columns headers for the table, or specified table columns."), new Table_FunctionDescription("#Totals", "Returns the total rows for the table or specified table columns."), new Table_FunctionDescription("@", "This row.")];
                FormulaTextBoxResource_EN.Functions = [new FunctionDescription("ABS", "This function calculates the absolute value of the specified value.", [new ParameterDescription("value")]), new FunctionDescription("ACCRINT", "This function calculates the accrued interest for a security that pays periodic interest.", [new ParameterDescription("issue"), new ParameterDescription("first"), new ParameterDescription("settle"), new ParameterDescription("rate"), new ParameterDescription("par"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("ACCRINTM", "This function calculates the accrued interest at maturity for a security that pays periodic interest.", [new ParameterDescription("issue"), new ParameterDescription("maturity"), new ParameterDescription("rate"), new ParameterDescription("par"), new ParameterDescription("basis")]), new FunctionDescription("ACOS", "This function calculates the arccosine, that is, the angle whose cosine is the specified value.", [new ParameterDescription("value")]), new FunctionDescription("ACOSH", "This function calculates the inverse hyperbolic cosine of the specified value.", [new ParameterDescription("value")]), new FunctionDescription("ADDRESS", "This function uses the row and column numbers to create a cell address in text.", [new ParameterDescription("row"), new ParameterDescription("column"), new ParameterDescription("absnum"), new ParameterDescription("a1style"), new ParameterDescription("sheettext")]), new FunctionDescription("AMORDEGRC", "This function returns the depreciation for an accounting period, taking into consideration prorated depreciation, and applies a depreciation coefficient in the calculation based on the life of the assets.", [new ParameterDescription("cost"), new ParameterDescription("datepurchased"), new ParameterDescription("firstperiod"), new ParameterDescription("salvage"), new ParameterDescription("period"), new ParameterDescription("drate"), new ParameterDescription("basis")]), new FunctionDescription("AMORLINC", "This function calculates the depreciation for an accounting period, taking into account prorated depreciation.", [new ParameterDescription("cost"), new ParameterDescription("datepurchased"), new ParameterDescription("firstperiod"), new ParameterDescription("salvage"), new ParameterDescription("period"), new ParameterDescription("drate"), new ParameterDescription("basis")]), new FunctionDescription("AND", "Check whether all argumengts are True,and returns True if all argements are True.", [new ParameterDescription("logical1"), new ParameterDescription("logical2")]), new FunctionDescription("ASIN", "This function calculates the arcsine, that is, the angle whose sine is the specified value.", [new ParameterDescription("value")]), new FunctionDescription("ASINH", "This function calculates the inverse hyperbolic sine of a number.", [new ParameterDescription("value")]), new FunctionDescription("ATAN", "This function calculates the arctangent, that is, the angle whose tangent is the specified value.", [new ParameterDescription("value")]), new FunctionDescription("ATAN2", "This function calculates the arctangent of the specified x- and y-coordinates.", [new ParameterDescription("x"), new ParameterDescription("y")]), new FunctionDescription("ATANH", "This function calculates the inverse hyperbolic tangent of a number.", [new ParameterDescription("value")]), new FunctionDescription("AVEDEV", "This function calculates the average of the absolute deviations of the specified values from their mean.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("AVERAGE", "This function calculates the average of the specified numeric values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("AVERAGEA", "This function calculates the average of the specified values, including text or logical values as well as numeric values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("AVERAGEIF", "This function calculates the average of the specified numeric values provided that they meet the specified criteria.", [new ParameterDescription("value1"), new ParameterDescription("value2", true), new ParameterDescription("condition")]), new FunctionDescription("AVERAGEIFS", "This function calculates the average of all cells that meet multiple specified criteria.", [new ParameterDescription("value1"), new ParameterDescription("condition1"), new ParameterDescription("value2", true), new ParameterDescription("condition2...")]), new FunctionDescription("BESSELI", "This function calculates the modified Bessel function of the first kind evaluated for purely imaginary arguments.", [new ParameterDescription("value"), new ParameterDescription("order")]), new FunctionDescription("BESSELJ", "This function calculates the Bessel function of the first kind.", [new ParameterDescription("value"), new ParameterDescription("order")]), new FunctionDescription("BESSELK", "This function calculates the modified Bessel function of the second kind evaluated for purely imaginary arguments.", [new ParameterDescription("value"), new ParameterDescription("order")]), new FunctionDescription("BESSELY", "This function calculates the Bessel function of the second kind.", [new ParameterDescription("value"), new ParameterDescription("order")]), new FunctionDescription("BETADIST", "This function calculates the cumulative beta distribution function.", [new ParameterDescription("x"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("lower"), new ParameterDescription("upper")]), new FunctionDescription("BETAINV", "This function calculates the inverse of the cumulative beta distribution function.", [new ParameterDescription("prob"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("lower"), new ParameterDescription("upper")]), new FunctionDescription("BIN2DEC", "This function converts a binary number to a decimal number", [new ParameterDescription("number")]), new FunctionDescription("BIN2HEX", "This function converts a binary number to a hexadecimal number.", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("BIN2OCT", "This function converts a binary number to an octal number.", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("BINOMDIST", "This function calculates the individual term binomial distribution probability.", [new ParameterDescription("x"), new ParameterDescription("n"), new ParameterDescription("p"), new ParameterDescription("cumulative")]), new FunctionDescription("CEILING", "This function rounds a number up to the nearest multiple of a specified value.", [new ParameterDescription("value"), new ParameterDescription("signif")]), new FunctionDescription("CHAR", "This function returns the character specified by a number.", [new ParameterDescription("value")]), new FunctionDescription("CHIDIST", "This function calculates the one-tailed probability of the chi-squared distribution.", [new ParameterDescription("value"), new ParameterDescription("deg")]), new FunctionDescription("CHIINV", "This function calculates the inverse of the one-tailed probability of the chi-squared distribution", [new ParameterDescription("prob"), new ParameterDescription("deg")]), new FunctionDescription("CHITEST", "This function calculates the test for independence from the chi-squared distribution.", [new ParameterDescription("obs_array"), new ParameterDescription("exp_array")]), new FunctionDescription("CHOOSE", "This function returns a value from a list of values.", [new ParameterDescription("index"), new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("CLEAN", "This function removes all non-printable characters from text.", [new ParameterDescription("text")]), new FunctionDescription("CODE", "This function returns a numeric code to represent the first character in a text string. The returned code corresponds to the Windows character set (ANSI).", [new ParameterDescription("text")]), new FunctionDescription("COLUMN", "This function returns the column number of a reference.", [new ParameterDescription("reference")]), new FunctionDescription("COLUMNS", "This function returns the number of columns in an array.", [new ParameterDescription("array")]), new FunctionDescription("COMBIN", "This function calculates the number of possible combinations for a specified number of items.", [new ParameterDescription("k"), new ParameterDescription("n")]), new FunctionDescription("COMPLEX", "This function converts real and imaginary coefficients into a complex number.", [new ParameterDescription("realcoeff"), new ParameterDescription("imagcoeff"), new ParameterDescription("suffix")]), new FunctionDescription("CONCATENATE", "This function combines multiple text strings or numbers into one text string.", [new ParameterDescription("text1"), new ParameterDescription("text2"), new ParameterDescription("....")]), new FunctionDescription("CONFIDENCE", "This function returns confidence interval for a population mean.", [new ParameterDescription("alpha"), new ParameterDescription("stdev"), new ParameterDescription("size")]), new FunctionDescription("CONVERT", "This function converts a number from one measurement system to its equivalent in another measurement system.", [new ParameterDescription("number"), new ParameterDescription("from-unit"), new ParameterDescription("to-unit")]), new FunctionDescription("CORREL", "This function returns the correlation coefficient of the two sets of data.", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("COS", "This function returns the cosine of the specified angle.", [new ParameterDescription("angle")]), new FunctionDescription("COSH", "This function returns the hyperbolic cosine of the specified value.", [new ParameterDescription("value")]), new FunctionDescription("COUNT", "This function returns the number of cells that contain numbers.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("COUNTA", "This function returns the number of number of cells that contain numbers, text, or logical values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("COUNTBLANK", "This function returns the number of empty (or blank) cells in a range of cells on a sheet.", [new ParameterDescription("cellrange")]), new FunctionDescription("COUNTIF", "This function returns the number of cells that meet a certain condition", [new ParameterDescription("cellrange"), new ParameterDescription("condition")]), new FunctionDescription("COUNTIFS", "This function returns the number of cells that meet multiple conditions.", [new ParameterDescription("cellrange"), new ParameterDescription("condition")]), new FunctionDescription("COUPDAYBS", "This function calculates the number of days from the beginning of the coupon period to the settlement date.", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("COUPDAYS", "This function returns the number of days in the coupon period that contains the settlement date.", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("COUPDAYSNC", "This function calculates the number of days from the settlement date to the next coupon date.", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("COUPNCD", "This function returns a date number of the next coupon date after the settlement date.", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("frequency"), new ParameterDescription("basi")]), new FunctionDescription("COUPNUM", "This function returns the number of coupons due between the settlement date and maturity date.", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("COUPPCD", "This function returns a date number of the previous coupon date before the settlement date.", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("COVAR", "This function returns the covariance, which is the average of the products of deviations for each data point pair in two sets of numbers.", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("CRITBINOM", "This function returns the criterion binomial, the smallest value for which the cumulative binomial distribution is greater than or equal to a criterion value.", [new ParameterDescription("n"), new ParameterDescription("p"), new ParameterDescription("alpha")]), new FunctionDescription("CUMIPMT", "This function returns the cumulative interest paid on a loan between the starting and ending periods.", [new ParameterDescription("rate"), new ParameterDescription("nper"), new ParameterDescription("pval"), new ParameterDescription("startperiod"), new ParameterDescription("endperiod"), new ParameterDescription("paytype")]), new FunctionDescription("CUMPRINC", "This function returns the cumulative principal paid on a loan between the start and end periods.", [new ParameterDescription("rate"), new ParameterDescription("nper"), new ParameterDescription("pval"), new ParameterDescription("startperiod"), new ParameterDescription("endperiod"), new ParameterDescription("paytype")]), new FunctionDescription("DATE", "This function returns the DateTime object for a particular date, specified by the year, month, and day.", [new ParameterDescription("year"), new ParameterDescription("month"), new ParameterDescription("day")]), new FunctionDescription("DATEDIF", "This function returns the number of days, months, or years between two dates.", [new ParameterDescription("date1"), new ParameterDescription("date2"), new ParameterDescription("outputcode")]), new FunctionDescription("DATEVALUE", "This function returns a DateTime object of the specified date.", [new ParameterDescription("date_string")]), new FunctionDescription("DAVERAGE", "This function calculates the average of values in a column of a list or database that match the specified conditions.", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DAY", "This function returns the day number of the month (integer 1 to 31) that corresponds to the specified date.", [new ParameterDescription("date")]), new FunctionDescription("DAYS360", "This function returns the number of days between two dates based on a 360-day year.", [new ParameterDescription("startdate"), new ParameterDescription("enddate"), new ParameterDescription("method")]), new FunctionDescription("DB", "This function calculates the depreciation of an asset for a specified period using the fixed\u2011declining balance method", [new ParameterDescription("cost"), new ParameterDescription("salvage"), new ParameterDescription("life"), new ParameterDescription("period"), new ParameterDescription("month")]), new FunctionDescription("DCOUNT", "This function counts the cells that contain numbers in a column of a list or database that match the specified conditions", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DCOUNTA", "This function counts the non-blank cells in a column of a list or database that match the specified conditions", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DDB", "This function calculates the depreciation of an asset for a specified period using the double-declining balance method or another method you specify.", [new ParameterDescription("cost"), new ParameterDescription("salvage"), new ParameterDescription("life"), new ParameterDescription("period"), new ParameterDescription("factor")]), new FunctionDescription("DEC2BIN", "This function converts a decimal number to a binary number.", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("DEC2HEX", "This function converts a decimal number to a hexadecimal number", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("DEC2OCT", "This function converts a decimal number to an octal number", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("DEGREES", "This function converts the specified value from radians to degrees", [new ParameterDescription("angle")]), new FunctionDescription("DELTA", "This function identifies whether two values are equal. Returns 1 if they are equal; returns 0 otherwise.", [new ParameterDescription("value1"), new ParameterDescription("value2")]), new FunctionDescription("DEVSQ", "This function calculates the sum of the squares of deviations of data points (or of an array of data points) from their sample mean.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("DGET", "This function extracts a single value from a column of a list or database that matches the specified conditions.", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DISC", "This function calculates the discount rate for a security.", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("pricep"), new ParameterDescription("redeem"), new ParameterDescription("basis")]), new FunctionDescription("DMAX", "This function returns the largest number in a column of a list or database that matches the specified conditions.", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DMIN", "This function returns the smallest number in a column of a list or database that matches the specified conditions.", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DOLLAR", "This function converts a number to text using currency format, with the decimals rounded to the specified place.", [new ParameterDescription("value"), new ParameterDescription("digits")]), new FunctionDescription("DOLLARDE", "This function converts a fraction dollar price to a decimal dollar price.", [new ParameterDescription("fractionaldollar"), new ParameterDescription("fraction")]), new FunctionDescription("DOLLARFR", "This function converts a decimal number dollar price to a fraction dollar price.", [new ParameterDescription("decimaldollar"), new ParameterDescription("fraction")]), new FunctionDescription("DPRODUCT", "This function multiplies the values in a column of a list or database that match the specified conditions.", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DSTDEV", "This function estimates the standard deviation of a population based on a sample by using the numbers in a column of a list or database that match the specified conditions.", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DSTDEVP", "This function calculates the standard deviation of a population based on the entire population using the numbers in a column of a list or database that match the specified conditions.", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DSUM", "This function adds the numbers in a column of a list or database that match the specified conditions.", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DURATION", "This function returns the Macauley duration for an assumed par value of $100.", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("coupon"), new ParameterDescription("yield"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("DVAR", "This function estimates the variance of a population based on a sample by using the numbers in a column of a list or database that match the specified conditions.", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DVARP", "This function calculates the variance of a population based on the entire population by using the numbers in a column of a list or database that match the specified conditions.", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("EDATE", "This function calculates the date that is the indicated number of months before or after a specified date.", [new ParameterDescription("startdate"), new ParameterDescription("months")]), new FunctionDescription("EFFECT", "This function calculates the effective annual interest rate for a given nominal annual interest rate and the number of compounding periods per year.", [new ParameterDescription("nomrate"), new ParameterDescription("comper")]), new FunctionDescription("EOMONTH", "This function calculates the date for the last day of the month (end of month) that is the indicated number of months before or after the starting date.", [new ParameterDescription("startdate"), new ParameterDescription("months")]), new FunctionDescription("ERF", "This function calculates the error function integrated between a lower and an upper limit.", [new ParameterDescription("limit"), new ParameterDescription("upperlimit")]), new FunctionDescription("ERFC", "This function calculates the complementary error function integrated between a lower limit and infinity.", [new ParameterDescription("lowerlimit")]), new FunctionDescription("ERROR.TYPE", "This function returns a number corresponding to one of the error values.", [new ParameterDescription("errorvalue")]), new FunctionDescription("EURO", "This function returns the equivalent of one Euro based on the ISO currency code.", [new ParameterDescription("code")]), new FunctionDescription("EUROCONVERT", "This function converts currency from a Euro member currency (including Euros) to another Euro member currency (including Euros).", [new ParameterDescription("currency"), new ParameterDescription("source"), new ParameterDescription("target"), new ParameterDescription("fullprecision"), new ParameterDescription("triangulation")]), new FunctionDescription("EVEN", "This function rounds the specified value up to the nearest even integer.", [new ParameterDescription("value")]), new FunctionDescription("EXACT", "This function returns true if two strings are the same; otherwise, false.", [new ParameterDescription("text1"), new ParameterDescription("text2")]), new FunctionDescription("EXP", "This function returns e raised to the power of the specified value.", [new ParameterDescription("value")]), new FunctionDescription("EXPONDIST", "This function returns the exponential distribution or the probability density", [new ParameterDescription("value"), new ParameterDescription("lambda"), new ParameterDescription("cumulative")]), new FunctionDescription("FACT", "This function calculates the factorial of the specified number.", [new ParameterDescription("number")]), new FunctionDescription("FACTDOUBLE", "This function calculates the double factorial of the specified number.", [new ParameterDescription("number")]), new FunctionDescription("FALSE", "This function returns the value for logical FALSE.", []), new FunctionDescription("FDIST", "This function calculates the F probability distribution, to see degrees of diversity between two sets of data.", [new ParameterDescription("value"), new ParameterDescription("degnum"), new ParameterDescription("degden")]), new FunctionDescription("FIND", "This function finds one text value within another and returns the text value\u2019s position in the text you searched.", [new ParameterDescription("findtext"), new ParameterDescription("intext"), new ParameterDescription("start")]), new FunctionDescription("FINV", "This function returns the inverse of the F probability distribution.", [new ParameterDescription("p"), new ParameterDescription("degnum"), new ParameterDescription("degden")]), new FunctionDescription("FISHER", "This function returns the Fisher transformation for a specified value", [new ParameterDescription("value")]), new FunctionDescription("FISHERINV", "This function returns the inverse of the Fisher transformation for a specified value.", [new ParameterDescription("value")]), new FunctionDescription("FIXED", "This function rounds a number to the specified number of decimal places, formats the number in decimal format using a period and commas (if so specified), and returns the result as text.", [new ParameterDescription("num"), new ParameterDescription("digits"), new ParameterDescription("notcomma")]), new FunctionDescription("FLOOR", "This function rounds a number down to the nearest multiple of a specified value.", [new ParameterDescription("value"), new ParameterDescription("signif")]), new FunctionDescription("FORECAST", "This function calculates a future value using existing values.", [new ParameterDescription("value"), new ParameterDescription("Yarray"), new ParameterDescription("Xarray")]), new FunctionDescription("FREQUENCY", "This function calculates how often values occur within a range of values. This function returns a vertical array of numbers", [new ParameterDescription("dataarray"), new ParameterDescription("binarray")]), new FunctionDescription("FTEST", "This function returns the result of an F-test, which returns the one-tailed probability that the variances in two arrays are not significantly different.", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("FV", "This function returns the future value of an investment based on a present value, periodic payments, and a specified interest rate.", [new ParameterDescription("rate"), new ParameterDescription("numper"), new ParameterDescription("paymt"), new ParameterDescription("pval"), new ParameterDescription("type")]), new FunctionDescription("FVSCHEDULE", "This function returns the future value of an initial principal after applying a series of compound interest rates. Calculate future value of an investment with a variable or adjustable rate.", [new ParameterDescription("principal"), new ParameterDescription("schedule")]), new FunctionDescription("GAMMADIST", "This function returns the gamma distribution.", [new ParameterDescription("x"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("cumulative")]), new FunctionDescription("GAMMAINV", "This function returns the inverse of the gamma cumulative distribution.", [new ParameterDescription("p"), new ParameterDescription("alpha"), new ParameterDescription("beta")]), new FunctionDescription("GAMMALN", "This function returns the natural logarithm of the Gamma function, G(x).", [new ParameterDescription("value")]), new FunctionDescription("GCD", "This function returns the greatest common divisor of two numbers.", [new ParameterDescription("number1"), new ParameterDescription("number2")]), new FunctionDescription("GEOMEAN", "This function returns the geometric mean of a set of positive data.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("GESTEP", "This function, greater than or equal to step, returns an indication of whether a number is equal to a threshold.", [new ParameterDescription("number"), new ParameterDescription("step")]), new FunctionDescription("GROWTH", "This function calculates predicted exponential growth. This function returns the y values for a series of new x values that are specified by using existing x and y values.", [new ParameterDescription("y"), new ParameterDescription("x"), new ParameterDescription("newx"), new ParameterDescription("constant")]), new FunctionDescription("HARMEAN", "This function returns the harmonic mean of a data set.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("HEX2BIN", "This function converts a hexadecimal number to a binary number.", [new ParameterDescription("number"), new ParameterDescription(" places")]), new FunctionDescription("HEX2DEC", "This function converts a hexadecimal number to a decimal number.", [new ParameterDescription("number")]), new FunctionDescription("HEX2OCT", "This function converts a hexadecimal number to an octal number.", [new ParameterDescription("number"), new ParameterDescription(" places")]), new FunctionDescription("HLOOKUP", "This function searches for a value in the top row and then returns a value in the same column from a specified row.", [new ParameterDescription("value"), new ParameterDescription("array"), new ParameterDescription("row"), new ParameterDescription("approx")]), new FunctionDescription("HOUR", "This function returns the hour that corresponds to a specified time.", [new ParameterDescription("time")]), new FunctionDescription("HYPGEOMDIST", "This function returns the hypergeometric distribution.", [new ParameterDescription("x"), new ParameterDescription("n"), new ParameterDescription("M"), new ParameterDescription("N")]), new FunctionDescription("IF", "This function performs a comparison and returns one of two provided values based on that comparison.", [new ParameterDescription("valueTest"), new ParameterDescription("valueTrue"), new ParameterDescription("valueFalse")]), new FunctionDescription("IFERROR", "This function evaluates a formula and returns a value you provide if there is an error or the formula result.", [new ParameterDescription("value"), new ParameterDescription("error")]), new FunctionDescription("IMABS", "This function returns the absolute value or modulus of a complex number.", [new ParameterDescription("complexnum")]), new FunctionDescription("IMAGINARY", "This function returns the imaginary coefficient of a complex number.", [new ParameterDescription("complexnum")]), new FunctionDescription("IMARGUMENT", "This function returns the argument theta, which is an angle expressed in radians.", [new ParameterDescription("complexnum")]), new FunctionDescription("IMCONJUGATE", "This function returns the complex conjugate of a complex number.", [new ParameterDescription("complexnum")]), new FunctionDescription("IMCOS", "This function returns the cosine of a complex number.", [new ParameterDescription("complexnum")]), new FunctionDescription("IMDIV", "This function returns the quotient of two complex numbers.", [new ParameterDescription("complexnum"), new ParameterDescription("complexdenom")]), new FunctionDescription("IMEXP", "This function returns the exponential of a complex number.", [new ParameterDescription("complexnum")]), new FunctionDescription("IMLN", "This function returns the natural logarithm of a complex number.", [new ParameterDescription("complexnum")]), new FunctionDescription("IMLOG2", "This function returns the base-2 logarithm of a complex number.", [new ParameterDescription("complexnum")]), new FunctionDescription("IMLOG10", "This function returns the common logarithm of a complex number.", [new ParameterDescription("complexnum")]), new FunctionDescription("IMPOWER", "This function returns a complex number raised to a power.", [new ParameterDescription("complexnum"), new ParameterDescription("powernum")]), new FunctionDescription("IMPRODUCT", "This function returns the product of up to 29 complex numbers in the x+yi or x+yj text format", [new ParameterDescription("complexnum1"), new ParameterDescription("complexnum2", true)]), new FunctionDescription("IMREAL", "This function returns the real coefficient of a complex number in the x+yi or x+yj text format.", [new ParameterDescription("complexnum")]), new FunctionDescription("IMSIN", "This function returns the sine of a complex number in the x+yi or x+yj text format.", [new ParameterDescription("complexnum")]), new FunctionDescription("IMSQRT", "This function returns the square root of a complex number in the x+yi or x+yj text format.", [new ParameterDescription("complexnum")]), new FunctionDescription("IMSUB", "This function returns the difference of two complex numbers in the x+yi or x+yj text format.", [new ParameterDescription("complexnum1"), new ParameterDescription("complexnum2")]), new FunctionDescription("IMSUM", "This function returns the sum of two or more complex numbers in the x+yi or x+yj text format.", [new ParameterDescription("complexnum1"), new ParameterDescription("complexnum2", true)]), new FunctionDescription("INDEX", "This function returns a value or the reference to a value from within an array or range.", [new ParameterDescription("return"), new ParameterDescription("row"), new ParameterDescription("col"), new ParameterDescription("area")]), new FunctionDescription("INDIRECT", "This function returns the reference specified by a text string. References are immediately evaluated to display their contents.", [new ParameterDescription("ref_text"), new ParameterDescription("a1_style")]), new FunctionDescription("INT", "This function rounds a specified number down to the nearest integer.", [new ParameterDescription("value")]), new FunctionDescription("INTERCEPT", "This function returns the coordinates of a point at which a line intersects the y-axis, by using existing x values and y values.", [new ParameterDescription("dependent"), new ParameterDescription("independent")]), new FunctionDescription("INTRATE", "This function calculates the interest rate for a fully invested security.", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("invest"), new ParameterDescription("redeem"), new ParameterDescription("basis")]), new FunctionDescription("IPMT", "This function calculates the payment of interest on a loan.", [new ParameterDescription("rate"), new ParameterDescription("per"), new ParameterDescription("nper"), new ParameterDescription("pval"), new ParameterDescription("fval"), new ParameterDescription("type")]), new FunctionDescription("IRR", "This function returns the internal rate of return for a series of cash flows represented by the numbers in an array.", [new ParameterDescription("arrayvals"), new ParameterDescription("estimate")]), new FunctionDescription("ISBLANK", "This function tests whether a value, an expression, or contents of a referenced cell is empty.", [new ParameterDescription("cellreference")]), new FunctionDescription("ISERR", "This function, Is Error Other Than Not Available, tests whether a value, an expression, or contents of a referenced cell has an error other than not available (#N/A).", [new ParameterDescription("cellreference")]), new FunctionDescription("ISERROR", "This function, Is Error of Any Kind, tests whether a value, an expression, or contents of a referenced cell has an error of any kind.", [new ParameterDescription("cellreference")]), new FunctionDescription("ISEVEN", "This function, Is Number Even, tests whether a value, an expression, or contents of a referenced cell is even.", [new ParameterDescription("cellreference")]), new FunctionDescription("ISLOGICAL", "This function tests whether a value, an expression, or contents of a referenced cell is a logical (Boolean) value.", [new ParameterDescription("cellreference")]), new FunctionDescription("ISNA", "This function, Is Not Available, tests whether a value, an expression, or contents of a referenced cell has the not available (#N/A) error value.", [new ParameterDescription("cellreference")]), new FunctionDescription("ISNONTEXT", "This function tests whether a value, an expression, or contents of a referenced cell has any data type other than text.", [new ParameterDescription("cellreference")]), new FunctionDescription("ISNUMBER", "This function tests whether a value, an expression, or contents of a referenced cell has numeric data.", [new ParameterDescription("cellreference")]), new FunctionDescription("ISODD", "This function, Is Number Odd, tests whether a value, an expression, or contents of a referenced cell has numeric data.", [new ParameterDescription("cellreference")]), new FunctionDescription("ISPMT", "This function calculates the interest paid during a specific period of an investment.", [new ParameterDescription("rate"), new ParameterDescription("per"), new ParameterDescription("nper"), new ParameterDescription("pv")]), new FunctionDescription("ISREF", "This function, Is Reference, tests whether a value, an expression, or contents of a referenced cell is a reference to another cell.", [new ParameterDescription("cellreference")]), new FunctionDescription("ISTEXT", "This function tests whether a value, an expression, or contents of a referenced cell has text data.", [new ParameterDescription("cellreference")]), new FunctionDescription("KURT", "This function returns the kurtosis of a data set.", [new ParameterDescription("value1"), new ParameterDescription("value2"), new ParameterDescription("value3"), new ParameterDescription("value4", true)]), new FunctionDescription("LARGE", "This function returns the nth largest value in a data set, where n is specified.", [new ParameterDescription("array"), new ParameterDescription("n")]), new FunctionDescription("LCM", "This function returns the least common multiple of two numbers.", [new ParameterDescription("number1"), new ParameterDescription("number2")]), new FunctionDescription("LEFT", "This function returns the specified leftmost characters from a text value.", [new ParameterDescription("mytext"), new ParameterDescription("num_chars")]), new FunctionDescription("LEN", "This function returns the length of, the number of characters in, a text string.", [new ParameterDescription("value")]), new FunctionDescription("LINEST", "This function calculates the statistics for a line.", [new ParameterDescription("y"), new ParameterDescription("x"), new ParameterDescription("constant"), new ParameterDescription("stats")]), new FunctionDescription("LN", "This function returns the natural logarithm of the specified number.", [new ParameterDescription("value")]), new FunctionDescription("LOG", "This function returns the logarithm base Y of a number X.", [new ParameterDescription("number"), new ParameterDescription("base")]), new FunctionDescription("LOG10", "This function returns the logarithm base 10 of the number given.", [new ParameterDescription("value")]), new FunctionDescription("LOGEST", "This function calculates an exponential curve that fits the data and returns an array of values that describes the curve.", [new ParameterDescription("y"), new ParameterDescription("x"), new ParameterDescription("constant"), new ParameterDescription("stats")]), new FunctionDescription("LOGINV", "This function returns the inverse of the lognormal cumulative distribution function of x, where LN(x) is normally distributed with the specified mean and standard deviation.", [new ParameterDescription("prob"), new ParameterDescription("mean"), new ParameterDescription("stdev")]), new FunctionDescription("LOGNORMDIST", "This function returns the cumulative natural log normal distribution of x, where LN(x) is normally distributed with the specified mean and standard deviation. Analyze data that has been logarithmically transformed with this function.", [new ParameterDescription("x"), new ParameterDescription("mean"), new ParameterDescription("stdev")]), new FunctionDescription("LOOKUP", "This function searches for a value and returns a value from the same location in a second area.", [new ParameterDescription("lookupvalue"), new ParameterDescription("lookupvector"), new ParameterDescription("resultvector")]), new FunctionDescription("LOWER", "This function converts text to lower case letters.", [new ParameterDescription("string")]), new FunctionDescription("MATCH", "This function returns the relative position of a specified item in a range.", [new ParameterDescription("value1"), new ParameterDescription("array"), new ParameterDescription("type")]), new FunctionDescription("MAX", "This function returns the maximum value, the greatest value, of all the values in the arguments.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("MAXA", "This function returns the largest value in a list of arguments, including text and logical values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("MDETERM", "This function returns the matrix determinant of an array.", [new ParameterDescription("array")]), new FunctionDescription("MDURATION", "This function calculates the modified Macauley duration of a security with an assumed par value of $100.", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("coupon"), new ParameterDescription("yield"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("MEDIAN", "This function returns the median, the number in the middle of the provided set of numbers; that is, half the numbers have values that are greater than the median, and half have values that are less than the median.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("MID", "This function returns the requested number of characters from a text string starting at the position you specify.", [new ParameterDescription("text"), new ParameterDescription("start_num"), new ParameterDescription("num_chars")]), new FunctionDescription("MIN", "This function returns the minimum value, the least value, of all the values in the arguments", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("MINA", "This function returns the minimum value in a list of arguments, including text and logical values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("MINUTE", "This function returns the minute corresponding to a specified time.", [new ParameterDescription("time")]), new FunctionDescription("MINVERSE", "This function returns the inverse matrix for the matrix stored in an array.", [new ParameterDescription("array")]), new FunctionDescription("MIRR", "This function returns the modified internal rate of return for a series of periodic cash flows.", [new ParameterDescription("arrayvals"), new ParameterDescription("payment_int"), new ParameterDescription("income_int")]), new FunctionDescription("MMULT", "This function returns the matrix product for two arrays.", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("MOD", "This function returns the remainder of a division operation.", [new ParameterDescription("dividend"), new ParameterDescription("divisor")]), new FunctionDescription("MODE", "This function returns the most frequently occurring value in a set of data.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("MONTH", "This function returns the month corresponding to the specified date value.", [new ParameterDescription("date")]), new FunctionDescription("MROUND", "This function returns a number rounded to the desired multiple.", [new ParameterDescription("number"), new ParameterDescription("multiple")]), new FunctionDescription("MULTINOMIAL", "This function calculates the ratio of the factorial of a sum of values to the product of factorials.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("N", "This function returns a value converted to a number.", [new ParameterDescription("value")]), new FunctionDescription("NA", "This function returns the error value #N/A that means not available.", []), new FunctionDescription("NEGBINOMDIST", "This function returns the negative binomial distribution.", [new ParameterDescription("x"), new ParameterDescription("r"), new ParameterDescription("p")]), new FunctionDescription("NETWORKDAYS", "This function returns the total number of complete working days between the start and end dates.", [new ParameterDescription("startdate"), new ParameterDescription("enddate"), new ParameterDescription("holidays")]), new FunctionDescription("NOMINAL", "This function returns the nominal annual interest rate for a given effective rate and number of compounding periods per year.", [new ParameterDescription("effrate"), new ParameterDescription("comper")]), new FunctionDescription("NORMDIST", "This function returns the normal cumulative distribution for the specified mean and standard deviation.", [new ParameterDescription("x"), new ParameterDescription("mean"), new ParameterDescription("stdev"), new ParameterDescription("cumulative")]), new FunctionDescription("NORMINV", "This function returns the inverse of the normal cumulative distribution for the given mean and standard deviation.", [new ParameterDescription("prob"), new ParameterDescription("mean"), new ParameterDescription("stdev")]), new FunctionDescription("NORMSDIST", "This function returns the standard normal cumulative distribution function.", [new ParameterDescription("value")]), new FunctionDescription("NORMSINV", "This function returns the inverse of the standard normal cumulative distribution. The distribution has a mean of zero and a standard deviation of one.", [new ParameterDescription("prob")]), new FunctionDescription("NOT", "This function reverses the logical value of its argument.", [new ParameterDescription("value")]), new FunctionDescription("NOW", "This function returns the current date and time.", []), new FunctionDescription("NPER", "This function returns the number of periods for an investment based on a present value, future value, periodic payments, and a specified interest rate.", [new ParameterDescription("rate"), new ParameterDescription("paymt"), new ParameterDescription("pval"), new ParameterDescription("fval"), new ParameterDescription("type")]), new FunctionDescription("NPV", "This function calculates the net present value of an investment by using a discount rate and a series of future payments and income.", [new ParameterDescription("discount"), new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("OCT2BIN", "This function converts an octal number to a binary number.", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("OCT2DEC", "This function converts an octal number to a decimal number.", [new ParameterDescription("number")]), new FunctionDescription("OCT2HEX", "This function converts an octal number to a hexadecimal number.", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("ODD", "This function rounds the specified value up to the nearest odd integer.", [new ParameterDescription("value")]), new FunctionDescription("ODDFPRICE", "This function calculates the price per $100 face value of a security with an odd first period.", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("issue"), new ParameterDescription("first"), new ParameterDescription("rate"), new ParameterDescription("yield"), new ParameterDescription("redeem"), new ParameterDescription("freq"), new ParameterDescription("basis")]), new FunctionDescription("ODDFYIELD", "This function calculates the yield of a security with an odd first period.", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("issue"), new ParameterDescription("first"), new ParameterDescription("rate"), new ParameterDescription("price"), new ParameterDescription("redeem"), new ParameterDescription("freq"), new ParameterDescription("basis")]), new FunctionDescription("ODDLPRICE", "This function calculates the price per $100 face value of a security with an odd last coupon period.", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("last"), new ParameterDescription("rate"), new ParameterDescription("yield"), new ParameterDescription("redeem"), new ParameterDescription("freq"), new ParameterDescription("basis")]), new FunctionDescription("ODDLYIELD", "This function calculates the yield of a security with an odd last period.", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("last"), new ParameterDescription("rate"), new ParameterDescription("price"), new ParameterDescription("redeem"), new ParameterDescription("freq"), new ParameterDescription("basis")]), new FunctionDescription("OFFSET", "This function returns a reference to a range. The range is a specified number of rows and columns from a cell or range of cells. The function returns a single cell or a range of cells.", [new ParameterDescription("reference"), new ParameterDescription("rows"), new ParameterDescription("cols"), new ParameterDescription("height"), new ParameterDescription("width")]), new FunctionDescription("OR", "This function calculates logical OR. It returns TRUE if any of its arguments are true; otherwise, returns FALSE if all arguments are false.", [new ParameterDescription("argument1"), new ParameterDescription("argument2...")]), new FunctionDescription("PEARSON", "This function returns the Pearson product moment correlation coefficient, a dimensionless index between -1.0 to 1.0 inclusive indicative of the linear relationship of two data sets.", [new ParameterDescription("array_ind"), new ParameterDescription("array_dep")]), new FunctionDescription("PERCENTILE", "This function returns the nth percentile of values in a range.", [new ParameterDescription("array"), new ParameterDescription("n")]), new FunctionDescription("PERCENTRANK", "This function returns the rank of a value in a data set as a percentage of the data set.", [new ParameterDescription("array"), new ParameterDescription("n"), new ParameterDescription("sigdig")]), new FunctionDescription("PERMUT", "This function returns the number of possible permutations for a specified number of items.", [new ParameterDescription("k"), new ParameterDescription("n")]), new FunctionDescription("PI", "This function returns PI as 3.1415926536.", []), new FunctionDescription("PMT", "This function returns the payment amount for a loan given the present value, specified interest rate, and number of terms.", [new ParameterDescription("rate"), new ParameterDescription("nper"), new ParameterDescription("pval"), new ParameterDescription("fval"), new ParameterDescription("type")]), new FunctionDescription("POISSON", "This function returns the Poisson distribution.", [new ParameterDescription("nevents"), new ParameterDescription("mean"), new ParameterDescription("cumulative")]), new FunctionDescription("POWER", "This function raises the specified number to the specified power.", [new ParameterDescription("number"), new ParameterDescription("power")]), new FunctionDescription("PPMT", "This function returns the amount of payment of principal for a loan given the present value, specified interest rate, and number of terms.", [new ParameterDescription("rate"), new ParameterDescription("per"), new ParameterDescription("nper"), new ParameterDescription("pval"), new ParameterDescription("fval"), new ParameterDescription("type")]), new FunctionDescription("PRICE", "This function calculates the price per $100 face value of a periodic interest security", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("rate"), new ParameterDescription("yield"), new ParameterDescription("redeem"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("PRICEDISC", "This function returns the price per $100 face value of a discounted security.", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("discount"), new ParameterDescription("redeem"), new ParameterDescription("basis")]), new FunctionDescription("PRICEMAT", "This function returns the price at maturity per $100 face value of a security that pays interest.", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("issue"), new ParameterDescription("rate"), new ParameterDescription("yield"), new ParameterDescription("basis")]), new FunctionDescription("PROB", "This function returns the probability that values in a range are between two limits.", [new ParameterDescription("array"), new ParameterDescription("probs"), new ParameterDescription("lower"), new ParameterDescription("upper")]), new FunctionDescription("PRODUCT", "This function multiplies all the arguments and returns the product.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("PV", "This function returns the present value of an investment based on the interest rate, number and amount of periodic payments, and future value. The present value is the total amount that a series of future payments is worth now.", [new ParameterDescription("rate"), new ParameterDescription("numper"), new ParameterDescription("paymt"), new ParameterDescription("fval"), new ParameterDescription("type")]), new FunctionDescription("QUARTILE", "This function returns which quartile (which quarter or 25 percent) of a data set a value is.", [new ParameterDescription("array"), new ParameterDescription("quart")]), new FunctionDescription("QUOTIENT", "This function returns the integer portion of a division. Use this to ignore the remainder of a division.", [new ParameterDescription("numerator"), new ParameterDescription("denominator")]), new FunctionDescription("RADIANS", "This function converts the specified number from degrees to radians.", [new ParameterDescription("value")]), new FunctionDescription("RADIANS", "This function converts the specified number from degrees to radians.", [new ParameterDescription("value")]), new FunctionDescription("RAND", "This function returns an evenly distributed random number between 0 and 1.", []), new FunctionDescription("RANDBETWEEN", "This function returns a random number between the numbers you specify.", [new ParameterDescription("lower"), new ParameterDescription("upper")]), new FunctionDescription("RANK", "This function returns the rank of a number in a set of numbers. If you were to sort the set, the rank of the number would be its position in the list.", [new ParameterDescription("number"), new ParameterDescription("array"), new ParameterDescription("order")]), new FunctionDescription("RATE", "This function returns the interest rate per period of an annuity.", [new ParameterDescription("nper"), new ParameterDescription("pmt"), new ParameterDescription("pval"), new ParameterDescription("fval"), new ParameterDescription("type"), new ParameterDescription("guess")]), new FunctionDescription("RECEIVED", "This function returns the amount received at maturity for a fully invested security.", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("invest"), new ParameterDescription("discount"), new ParameterDescription("basis")]), new FunctionDescription("REPLACE", "This function replaces part of a text string with a different text string.", [new ParameterDescription("old_text"), new ParameterDescription("start_char"), new ParameterDescription("num_chars"), new ParameterDescription("new_text")]), new FunctionDescription("REPT", "This function repeats text a specified number of times.", [new ParameterDescription("text"), new ParameterDescription("number")]), new FunctionDescription("RIGHT", "This function returns the specified rightmost characters from a text value.", [new ParameterDescription("text"), new ParameterDescription("num_chars")]), new FunctionDescription("ROMAN", "This function converts an arabic numeral to a roman numeral text equivalent.", [new ParameterDescription("number"), new ParameterDescription("style")]), new FunctionDescription("ROUND", "This function rounds the specified value to the nearest number, using the specified number of decimal places.", [new ParameterDescription("value"), new ParameterDescription("places")]), new FunctionDescription("ROUNDDOWN", "This function rounds the specified number down to the nearest number, using the specified number of decimal places.", [new ParameterDescription("value"), new ParameterDescription("places")]), new FunctionDescription("ROUNDUP", "This function rounds the specified number up to the nearest number, using the specified number of decimal places.", [new ParameterDescription("value"), new ParameterDescription("places")]), new FunctionDescription("ROW", "This function returns the number of a row from a reference.", [new ParameterDescription("reference")]), new FunctionDescription("ROWS", "This function returns the number of rows in an array.", [new ParameterDescription("array")]), new FunctionDescription("RSQ", "This function returns the square of the Pearson product moment correlation coefficient (R\u2011squared) through data points in known y\u2019s and known x\u2019s.", [new ParameterDescription("array_dep"), new ParameterDescription("array_ind")]), new FunctionDescription("SEARCH", "This function finds one text string in another text string and returns the index of the starting position of the found text.", [new ParameterDescription("string1"), new ParameterDescription("string2")]), new FunctionDescription("SECOND", "This function returns the seconds (0 to 59) value for a specified time.", [new ParameterDescription("time")]), new FunctionDescription("SERIESSUM", "This function returns the sum of a power series.", [new ParameterDescription("x"), new ParameterDescription("n"), new ParameterDescription("m"), new ParameterDescription("coeff")]), new FunctionDescription("SIGN", "This function returns the sign of a number or expression.", [new ParameterDescription("cellreference")]), new FunctionDescription("SIN", "This function returns the sine of the specified angle.", [new ParameterDescription("angle")]), new FunctionDescription("SINH", "This function returns the hyperbolic sine of the specified number.", [new ParameterDescription("value")]), new FunctionDescription("SKEW", "This function returns the skewness of a distribution.", [new ParameterDescription("number1"), new ParameterDescription("number2", true)]), new FunctionDescription("SLN", "This function returns the straight-line depreciation of an asset for one period.", [new ParameterDescription("cost"), new ParameterDescription("salvage"), new ParameterDescription("life")]), new FunctionDescription("SLOPE", "This function calculates the slope of a linear regression.", [new ParameterDescription("array_dep"), new ParameterDescription("array_ind")]), new FunctionDescription("SMALL", "This function returns the nth smallest value in a data set, where n is specified.", [new ParameterDescription("array"), new ParameterDescription("n")]), new FunctionDescription("SQRT", "This function returns the positive square root of the specified number.", [new ParameterDescription("value")]), new FunctionDescription("SQRTPI", "This function returns the positive square root of a multiple of pi (p).", [new ParameterDescription("multiple")]), new FunctionDescription("STANDARDIZE", "This function returns a normalized value from a distribution characterized by mean and standard deviation.", [new ParameterDescription("x"), new ParameterDescription("mean"), new ParameterDescription("stdev")]), new FunctionDescription("STDEVA", "This function returns the standard deviation for a set of numbers, text, or logical values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("STDEVP", "This function returns the standard deviation for an entire specified population (of numeric values).", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("STDEVPA", "This function returns the standard deviation for an entire specified population, including text or logical values as well as numeric values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("STEYX", "This function returns the standard error of the predicted y value for each x. The standard error is a measure of the amount of error in the prediction of y for a value of x.", [new ParameterDescription("array_dep"), new ParameterDescription("array_ind")]), new FunctionDescription("SUBSTITUTE", "This function substitutes a new string for specified characters in an existing string.", [new ParameterDescription("text"), new ParameterDescription("old_piece"), new ParameterDescription("new_piece"), new ParameterDescription("instance")]), new FunctionDescription("SUBTOTAL", "This function calculates a subtotal of a list of numbers using a specified built-in function.", [new ParameterDescription("functioncode"), new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("SUM", "This function returns the sum of cells or range of cells.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("SUMIF", "This function adds the cells using a given criteria.", [new ParameterDescription("array"), new ParameterDescription("condition"), new ParameterDescription("sumrange")]), new FunctionDescription("SUMIFS", "This function adds the cells in a range using multiple criteria.", [new ParameterDescription("array"), new ParameterDescription("conditionarray"), new ParameterDescription("condition", true)]), new FunctionDescription("SUMPRODUCT", "This function returns the sum of products of cells. Multiplies corresponding components in the given arrays, and returns the sum of those products.", [new ParameterDescription("array1"), new ParameterDescription("array2", true)]), new FunctionDescription("SUMSQ", "This function returns the sum of the squares of the arguments.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("SUMX2MY2", "This function returns the sum of the difference of the squares of corresponding values in two arrays.", [new ParameterDescription("array_x"), new ParameterDescription("array_y")]), new FunctionDescription("SUMX2PY2", "This function returns the sum of the sum of squares of corresponding values in two arrays.", [new ParameterDescription("array_x"), new ParameterDescription("array_y")]), new FunctionDescription("SUMXMY2", "This function returns the sum of the square of the differences of corresponding values in two arrays.", [new ParameterDescription("array_x"), new ParameterDescription("array_y")]), new FunctionDescription("SYD", "This function returns the sum-of-years\u2019 digits depreciation of an asset for a specified period.", [new ParameterDescription("cost"), new ParameterDescription("salvage"), new ParameterDescription("life"), new ParameterDescription("period")]), new FunctionDescription("T", "This function returns the text in a specified cell.", [new ParameterDescription("value")]), new FunctionDescription("TAN", "This function returns the tangent of the specified angle.", [new ParameterDescription("angle")]), new FunctionDescription("TANH", "This function returns the hyperbolic tangent of the specified number.", [new ParameterDescription("value")]), new FunctionDescription("TBILLEQ", "This function returns the equivalent yield for a Treasury bill (or T-bill)", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("discount")]), new FunctionDescription("TBILLPRICE", "This function returns the price per $100 face value for a Treasury bill (or T-bill).", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("discount")]), new FunctionDescription("TBILLYIELD", "This function returns the yield for a Treasury bill (or T-bill).", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("priceper")]), new FunctionDescription("TDIST", "This function returns the probability for the t-distribution.", [new ParameterDescription("x"), new ParameterDescription("deg"), new ParameterDescription("tails")]), new FunctionDescription("TEXT", "This function formats a number and converts it to text.", [new ParameterDescription("value"), new ParameterDescription("text")]), new FunctionDescription("TIME", "This function returns the TimeSpan object for a specified time.", [new ParameterDescription("hour"), new ParameterDescription("minutes"), new ParameterDescription("seconds")]), new FunctionDescription("TIMEVALUE", "This function returns the TimeSpan object of the time represented by a text string.", [new ParameterDescription("time_string")]), new FunctionDescription("TINV", "This function returns the t-value of the student's t-distribution as a function of the probability and the degrees of freedom.", [new ParameterDescription("prog"), new ParameterDescription("deg")]), new FunctionDescription("TODAY", "This function returns the date and time of the current date.", []), new FunctionDescription("TRANSPOSE", "This function returns a vertical range of cells as a horizontal range or a horizontal range of cells as a vertical range.", [new ParameterDescription("array")]), new FunctionDescription("TREND", "This function returns values along a linear trend. This function fits a straight line to the arrays known x and y values. Trend returns the y values along that line for the array of specified new x values.", [new ParameterDescription("y"), new ParameterDescription("x"), new ParameterDescription("newx"), new ParameterDescription("constant")]), new FunctionDescription("TRIM", "This function removes extra spaces from a string and leaves single spaces between words.", [new ParameterDescription("text")]), new FunctionDescription("TRIMMEAN", "This function returns the mean of a subset of data excluding the top and bottom data.", [new ParameterDescription("array"), new ParameterDescription("percent")]), new FunctionDescription("TRUE", "This function returns the value for logical TRUE.", []), new FunctionDescription("TRUNC", "This function removes the specified fractional part of the specified number.", [new ParameterDescription("value"), new ParameterDescription("precision")]), new FunctionDescription("TTEST", "This function returns the probability associated with a t-test.", [new ParameterDescription("array1"), new ParameterDescription("array2"), new ParameterDescription("tails"), new ParameterDescription("type")]), new FunctionDescription("TYPE", "This function returns the type of value.", [new ParameterDescription("value")]), new FunctionDescription("UPPER", "This function converts text to uppercase letters.", [new ParameterDescription("string")]), new FunctionDescription("VALUE", "This function converts a text string that is a number to a numeric value.", [new ParameterDescription("text")]), new FunctionDescription("VAR", "This function returns the variance based on a sample of a population, which uses only numeric values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("VARA", "This function returns the variance based on a sample of a population, which includes numeric, logical, or text values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("VARP", "This function returns variance based on the entire population, which uses only numeric values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("VARPA", "This function returns variance based on the entire population, which includes numeric, logical, or text values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("VDB", "This function returns the depreciation of an asset for any period you specify using the variable declining balance method.", [new ParameterDescription("cost"), new ParameterDescription("salvage"), new ParameterDescription("life"), new ParameterDescription("start"), new ParameterDescription("end"), new ParameterDescription("factor"), new ParameterDescription("switchnot")]), new FunctionDescription("VLOOKUP", "This function searches for a value in the leftmost column and returns a value in the same row from a column you specify.", [new ParameterDescription("value"), new ParameterDescription("array"), new ParameterDescription("colindex"), new ParameterDescription("approx")]), new FunctionDescription("WEEKDAY", "This function returns the number corresponding to the day of the week for a specified date.", [new ParameterDescription("date"), new ParameterDescription("type")]), new FunctionDescription("WEEKNUM", "This function returns a number that indicates the week of the year numerically.", [new ParameterDescription("date"), new ParameterDescription("weektype")]), new FunctionDescription("WEIBULL", "This function returns the two-parameter Weibull distribution, often used in reliability analysis.", [new ParameterDescription("x"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("cumulative")]), new FunctionDescription("WORKDAY", "This function returns the number of working days before or after the starting date.", [new ParameterDescription("startdate"), new ParameterDescription("numdays"), new ParameterDescription("holidays")]), new FunctionDescription("XIRR", "This function calculates the internal rate of return for a schedule of cash flows that may not be periodic.", [new ParameterDescription("values"), new ParameterDescription("dates"), new ParameterDescription("guess")]), new FunctionDescription("XNPV", "This function calculates the net present value for a schedule of cash flows that may not be periodic.", [new ParameterDescription("rate"), new ParameterDescription("values"), new ParameterDescription("dates")]), new FunctionDescription("YEAR", "This function returns the year as an integer for a specified date.", [new ParameterDescription("date")]), new FunctionDescription("YEARFRAC", "This function returns the fraction of the year represented by the number of whole days between the start and end dates.", [new ParameterDescription("startdate"), new ParameterDescription("enddate"), new ParameterDescription("basis")]), new FunctionDescription("YIELD", "This function calculates the yield on a security that pays periodic interest.", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("rate"), new ParameterDescription("price"), new ParameterDescription("redeem"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("YIELDDISC", "This function calculates the annual yield for a discounted security.", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("price"), new ParameterDescription("redeem"), new ParameterDescription("basis")]), new FunctionDescription("YIELDMAT", "This function calculates the annual yield of a security that pays interest at maturity.", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("issue"), new ParameterDescription("issrate"), new ParameterDescription("price"), new ParameterDescription("basis")]), new FunctionDescription("ZTEST", "This function returns the significance value of a z-test. The z-test generates a standard score for x with respect to the set of data and returns the two-tailed probability for the normal distribution.", [new ParameterDescription("array"), new ParameterDescription("x"), new ParameterDescription("sigma")]), new FunctionDescription("HBARSPARKLINE", "This function returns a data set used for representing a Hbar sparkline", [new ParameterDescription("value"), new ParameterDescription("colorScheme")]), new FunctionDescription("VBARSPARKLINE", "This function returns a data set used for representing a Vbar sparkline", [new ParameterDescription("value"), new ParameterDescription("colorScheme")]), new FunctionDescription("VARISPARKLINE", "This function returns a data set used for representing a variance sparkline", [new ParameterDescription("variance"), new ParameterDescription("reference"), new ParameterDescription("mini"), new ParameterDescription("maxi"), new ParameterDescription("mark"), new ParameterDescription("tickunit"), new ParameterDescription("legend"), new ParameterDescription("colorPositive"), new ParameterDescription("colorNegative"), new ParameterDescription("vertical")]), new FunctionDescription("PIESPARKLINE", "This function returns a data set used for representing a pie sparkline", [new ParameterDescription("range|percentage"), new ParameterDescription("color", true)]), new FunctionDescription("AREASPARKLINE", "This function returns a data set used for representing a area sparkline", [new ParameterDescription("points"), new ParameterDescription("mini"), new ParameterDescription("maxi"), new ParameterDescription("line1"), new ParameterDescription("line2"), new ParameterDescription("colorPositive"), new ParameterDescription("colorNegative")]), new FunctionDescription("SCATTERSPARKLINE", "This function returns a data set used for representing a scatter sparkline", [new ParameterDescription("points1"), new ParameterDescription("points2"), new ParameterDescription("minX"), new ParameterDescription("maxX"), new ParameterDescription("minY"), new ParameterDescription("maxY"), new ParameterDescription("hLine"), new ParameterDescription("vLine"), new ParameterDescription("xMinZone"), new ParameterDescription("xMaxZone"), new ParameterDescription("yMinZone"), new ParameterDescription("yMaxZone"), new ParameterDescription("tags"), new ParameterDescription("drawSymbol"), new ParameterDescription("drawLines"), new ParameterDescription("color1"), new ParameterDescription("color2"), new ParameterDescription("dash")]), new FunctionDescription("LINESPARKLINE", "This function returns a data set used for representing a line sparkline", [new ParameterDescription("data"), new ParameterDescription("dataOrientation"), new ParameterDescription("dateAxisData"), new ParameterDescription("dateAxisOrientation"), new ParameterDescription("setting")]), new FunctionDescription("COLUMNSPARKLINE", "This function returns a data set used for representing a column sparkline", [new ParameterDescription("data"), new ParameterDescription("dataOrientation"), new ParameterDescription("dateAxisData"), new ParameterDescription("dateAxisOrientation"), new ParameterDescription("setting")]), new FunctionDescription("WINLOSSSPARKLINE", "This function returns a data set used for representing a win/loss sparkline", [new ParameterDescription("data"), new ParameterDescription("dataOrientation"), new ParameterDescription("dateAxisData"), new ParameterDescription("dateAxisOrientation"), new ParameterDescription("setting")]), new FunctionDescription("BULLETSPARKLINE", "This function returns a data set used for representing a bullet sparkline", [new ParameterDescription("measure"), new ParameterDescription("target"), new ParameterDescription("maxi"), new ParameterDescription("good"), new ParameterDescription("bad"), new ParameterDescription("forecast"), new ParameterDescription("tickunit"), new ParameterDescription("colorScheme"), new ParameterDescription("vertical")]), new FunctionDescription("SPREADSPARKLINE", "This function returns a data set used for representing a spread sparkline", [new ParameterDescription("points"), new ParameterDescription("showAverage"), new ParameterDescription("scaleStart"), new ParameterDescription("scaleEnd"), new ParameterDescription("style"), new ParameterDescription("colorScheme"), new ParameterDescription("vertical")]), new FunctionDescription("STACKEDSPARKLINE", "This function returns a data set used for representing a stacked sparkline", [new ParameterDescription("points"), new ParameterDescription("colorRange"), new ParameterDescription("labelRange"), new ParameterDescription("maximum"), new ParameterDescription("targetRed"), new ParameterDescription("targetGreen"), new ParameterDescription("targetBlue"), new ParameterDescription("tragetYellow"), new ParameterDescription("color"), new ParameterDescription("highlightPosition"), new ParameterDescription("vertical"), new ParameterDescription("textOrientation"), new ParameterDescription("textSize")]), new FunctionDescription("BOXPLOTSPARKLINE", "This function returns a data set used for representing a boxplot sparkline", [new ParameterDescription("points"), new ParameterDescription("boxPlotClass"), new ParameterDescription("showAverage"), new ParameterDescription("scaleStart"), new ParameterDescription("scaleEnd"), new ParameterDescription("acceptableStart"), new ParameterDescription("acceptableEnd"), new ParameterDescription("colorScheme"), new ParameterDescription("style"), new ParameterDescription("vertical")]), new FunctionDescription("CASCADESPARKLINE", "This function returns a data set used for representing a cascade sparkline", [new ParameterDescription("pointsRange"), new ParameterDescription("pointIndex"), new ParameterDescription("labelsRange"), new ParameterDescription("minimum"), new ParameterDescription("maximum"), new ParameterDescription("colorPositive"), new ParameterDescription("colorNegative"), new ParameterDescription("vertical")]), new FunctionDescription("PARETOSPARKLINE", "This function returns a data set used for representing a pareto sparkline", [new ParameterDescription("points"), new ParameterDescription("pointIndex"), new ParameterDescription("colorRange"), new ParameterDescription("target"), new ParameterDescription("target2"), new ParameterDescription("highlightPosition"), new ParameterDescription("label"), new ParameterDescription("vertical")]), new FunctionDescription("CEILING.PRECISE", "This function rounds a number up to the nearest integer or to the nearest multiple of a specified value.", [new ParameterDescription("number"), new ParameterDescription("signif")]), new FunctionDescription("COVARIANCE.S", "This function returns the sample covariance, which is the average of the products of deviations for each data point pair in two sets of numbers.", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("FLOOR.PRECISE", "This function rounds a number down to the nearest integer or to the nearest multiple of a specified value.", [new ParameterDescription("number"), new ParameterDescription("signif")]), new FunctionDescription("PERCENTILE.EXC", "This function returns the nth percentile of values in a range.", [new ParameterDescription("array"), new ParameterDescription("n")]), new FunctionDescription("QUARTILE.EXC", "This function returns which quartile (which quarter or 25 percent) of a data set a value is.", [new ParameterDescription("array"), new ParameterDescription("quart")]), new FunctionDescription("RANK.AVG", "This function returns the rank of a number in a set of numbers. If some values have the same rank, it will return the average rank.", [new ParameterDescription("number"), new ParameterDescription("array"), new ParameterDescription("order")]), new FunctionDescription("MODE.MULT", "This function returns the most frequently occuring vertical array or the most frequently occurring value in a set of data.", [new ParameterDescription("number1"), new ParameterDescription("number2", true)]), new FunctionDescription("STDEV.P", "This function returns the standard deviation for an entire specified population (of numeric values).", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("VAR.P", "This function returns variance based on the entire population, which uses only numeric values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("COVARIANCE.P", "This function returns the covariance, which is the average of the products of deviations for each data point pair in two sets of numbers.", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("MODE.SNGL", "This function returns the most frequently occurring value in a set of data.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("PERCENTILE.INC", "This function returns the nth percentile of values in a range.", [new ParameterDescription("array"), new ParameterDescription("n")]), new FunctionDescription("QUARTILE.INC", "This function returns which quartile (which quarter or 25 percent) of a data set a value is.", [new ParameterDescription("array"), new ParameterDescription("quart")]), new FunctionDescription("RANK.EQ", "This function returns the rank of a number in a set of numbers. If you were to sort the set, the rank of the number would be its position in the list.", [new ParameterDescription("number"), new ParameterDescription("array"), new ParameterDescription("order")]), new FunctionDescription("STDEV", "This function returns standard deviation is estimated based on a sample.", [new ParameterDescription("number1"), new ParameterDescription("number2", true)]), new FunctionDescription("STDEV.S", "This function returns standard deviation is estimated based on a sample.", [new ParameterDescription("number1"), new ParameterDescription("number2", true)]), new FunctionDescription("VAR.S", "This function returns the variance based on a sample of a population, which uses only numeric values.", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("BETA.INV", "This function calculates the inverse of the cumulative beta distribution function.", [new ParameterDescription("prob"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("lower"), new ParameterDescription("upper")]), new FunctionDescription("BINOM.DIST", "This function calculates the individual term binomial distribution probability.", [new ParameterDescription("x"), new ParameterDescription("n"), new ParameterDescription("p"), new ParameterDescription("cumulative")]), new FunctionDescription("BINOM.INV", "This function returns the criterion binomial, the smallest value for which the cumulative binomial distribution is greater than or equal to a criterion value.", [new ParameterDescription("n"), new ParameterDescription("p"), new ParameterDescription("alpha")]), new FunctionDescription("CHISQ.DIST.RT", "This function calculates the one-tailed probability of the chi-squared distribution.", [new ParameterDescription("value"), new ParameterDescription("deg")]), new FunctionDescription("CHISQ.INV.RT", "This function calculates the inverse of the one-tailed probability of the chi-squared distribution", [new ParameterDescription("prob"), new ParameterDescription("deg")]), new FunctionDescription("CHISQ.TEST", "This function calculates the test for independence from the chi-squared distribution.", [new ParameterDescription("obs_array"), new ParameterDescription("exp_array")]), new FunctionDescription("CONFIDENCE.NORM", "This function returns confidence interval for a population mean.", [new ParameterDescription("alpha"), new ParameterDescription("stdev"), new ParameterDescription("size")]), new FunctionDescription("EXPON.DIST", "This function returns the exponential distribution or the probability density", [new ParameterDescription("value"), new ParameterDescription("lambda"), new ParameterDescription("cumulative")]), new FunctionDescription("F.DIST.RT", "This function calculates the F probability distribution, to see degrees of diversity between two sets of data.", [new ParameterDescription("value"), new ParameterDescription("degnum"), new ParameterDescription("degden")]), new FunctionDescription("F.INV.RT", "This function returns the inverse of the F probability distribution.", [new ParameterDescription("p"), new ParameterDescription("degnum"), new ParameterDescription("degden")]), new FunctionDescription("F.TEST", "This function returns the result of an F-test, which returns the one-tailed probability that the variances in two arrays are not significantly different.", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("GAMMA.DIST", "This function returns the gamma distribution.", [new ParameterDescription("x"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("cumulative")]), new FunctionDescription("GAMMA.INV", "This function returns the inverse of the gamma cumulative distribution.", [new ParameterDescription("p"), new ParameterDescription("alpha"), new ParameterDescription("beta")]), new FunctionDescription("LOGNORM.INV", "This function returns the inverse of the lognormal cumulative distribution function of x, where LN(x) is normally distributed with the specified mean and standard deviation.", [new ParameterDescription("prob"), new ParameterDescription("mean"), new ParameterDescription("stdev")]), new FunctionDescription("NORM.DIST", "This function returns the normal cumulative distribution for the specified mean and standard deviation.", [new ParameterDescription("x"), new ParameterDescription("mean"), new ParameterDescription("stdev"), new ParameterDescription("cumulative")]), new FunctionDescription("NORM.INV", "This function returns the inverse of the normal cumulative distribution for the given mean and standard deviation.", [new ParameterDescription("prob"), new ParameterDescription("mean"), new ParameterDescription("stdev")]), new FunctionDescription("NORM.S.INV", "This function returns the inverse of the standard normal cumulative distribution. The distribution has a mean of zero and a standard deviation of one.", [new ParameterDescription("prob")]), new FunctionDescription("PERCENTRANK.INC", "This function returns the rank of a value in a data set as a percentage of the data set.", [new ParameterDescription("array"), new ParameterDescription("n"), new ParameterDescription("signif")]), new FunctionDescription("POISSON.DIST", "This function returns the Poisson distribution.", [new ParameterDescription("nevents"), new ParameterDescription("mean"), new ParameterDescription("cumulative")]), new FunctionDescription("T.INV.2T", "This function returns the t-value of the student's t-distribution as a function of the probability and the degrees of freedom.", [new ParameterDescription("prog"), new ParameterDescription("deg")]), new FunctionDescription("T.TEST", "This function returns the probability associated with a t-test.", [new ParameterDescription("array1"), new ParameterDescription("array2"), new ParameterDescription("tails"), new ParameterDescription("type")]), new FunctionDescription("WEIBULL.DIST", "This function returns the two-parameter Weibull distribution, often used in reliability analysis.", [new ParameterDescription("x"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("cumulative")]), new FunctionDescription("Z.TEST", "This function returns the significance value of a z-test. The z-test generates a standard score for x with respect to the set of data and returns the two-tailed probability for the normal distribution.", [new ParameterDescription("array"), new ParameterDescription("x"), new ParameterDescription("sigma")]), new FunctionDescription("T.DIST.RT", "This function returns the right-tailed t-distribution.", [new ParameterDescription("x"), new ParameterDescription("deg")]), new FunctionDescription("T.DIST.2T", "This function returns the two-tailed t-distribution.", [new ParameterDescription("x"), new ParameterDescription("deg")]), new FunctionDescription("ISO.CEILING", "This function returns a number up to the nearest integer or to the nearest multiple of significance, regardless of sign of significance.", [new ParameterDescription("number"), new ParameterDescription("signif")]), new FunctionDescription("BETA.DIST", "This function returns the beta distribution.", [new ParameterDescription("x"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("cumulative"), new ParameterDescription("lower"), new ParameterDescription("upper")]), new FunctionDescription("GAMMALN.PRECISE", "This function returns the natural logarithm of the gamma function.", [new ParameterDescription("value")]), new FunctionDescription("ERF.PRECISE", "This function returns the error function.", [new ParameterDescription("lowerlimit")]), new FunctionDescription("ERFC.PRECISE", "This function returns the complementary ERF function.", [new ParameterDescription("lowerlimit")]), new FunctionDescription("PERCENTRANK.EXC", "This function returns the percentage rank(0..1, exclusive) of a value in a data set.", [new ParameterDescription("array"), new ParameterDescription("n"), new ParameterDescription("signif")]), new FunctionDescription("HYPGEOM.DIST", "This function returns the hypergeometric distribution.", [new ParameterDescription("x"), new ParameterDescription("n"), new ParameterDescription("M"), new ParameterDescription("N"), new ParameterDescription("cumulative")]), new FunctionDescription("LOGNORM.DIST", "This function returns the log normal distribution of x.", [new ParameterDescription("x"), new ParameterDescription("mean"), new ParameterDescription("stdev"), new ParameterDescription("cumulative")]), new FunctionDescription("NEGBINOM.DIST", "This function returns the negative binomial distribution.", [new ParameterDescription("x"), new ParameterDescription("r"), new ParameterDescription("p"), new ParameterDescription("cumulative")]), new FunctionDescription("NORM.S.DIST", "This function returns the standard normal distribution.", [new ParameterDescription("z"), new ParameterDescription("cumulative")]), new FunctionDescription("T.DIST", "This function returns the t-distribution.", [new ParameterDescription("x"), new ParameterDescription("deg"), new ParameterDescription("cumulative")]), new FunctionDescription("F.DIST", "This function returns the F probability distribution.", [new ParameterDescription("x"), new ParameterDescription("degnum"), new ParameterDescription("degden"), new ParameterDescription("cumulative")]), new FunctionDescription("CHISQ.DIST", "This function returns the chi-squared distribution.", [new ParameterDescription("x"), new ParameterDescription("deg"), new ParameterDescription("cumulative")]), new FunctionDescription("F.INV", "This function returns the inverse of the F probability distribution.", [new ParameterDescription("probability"), new ParameterDescription("degnum"), new ParameterDescription("degden")]), new FunctionDescription("T.INV", "This function returns the left-tailed inverse of the t-distribution.", [new ParameterDescription("probability"), new ParameterDescription("deg")]), new FunctionDescription("CHISQ.INV", "This function returns the inverse of left-tailed probability of the chi-squared distribution.", [new ParameterDescription("probability"), new ParameterDescription("deg")]), new FunctionDescription("CONFIDENCE.T", "This function returns the confidence interval for a Student's t distribution.", [new ParameterDescription("alpha"), new ParameterDescription("stdev"), new ParameterDescription("size")]), new FunctionDescription("NETWORKDAYS.INTL", "This function returns the number of workdays between two dates using arguments to indicate holidays and weekend days.", [new ParameterDescription("startdate"), new ParameterDescription("enddate"), new ParameterDescription("weekend"), new ParameterDescription("holidays")]), new FunctionDescription("WORKDAY.INTL", "This function returns the serial number of the date before or after a number of workdays with custom weekend parameters. These parameters indicate weekend days and holidays.", [new ParameterDescription("startdate"), new ParameterDescription("numdays"), new ParameterDescription("weekend"), new ParameterDescription("holidays")])];
                return FormulaTextBoxResource_EN
            })();
        Sheets.FormulaTextBoxResource_EN = FormulaTextBoxResource_EN;
        var FormulaTextBoxResource_JP = (function()
            {
                function FormulaTextBoxResource_JP(){}
                FormulaTextBoxResource_JP.Table_Functions = [new Table_FunctionDescription("#All", "\u30c6\u30fc\u30d6\u30eb\u306e\u3059\u3079\u3066\u306e\u5024\u3001\u307e\u305f\u306f\u3001\u6307\u5b9a\u3057\u305f\u30c6\u30fc\u30d6\u30eb\u5217\u3068\u5217\u756a\u53f7\u3001\u30c7\u30fc\u30bf\u304a\u3088\u3073\u96c6\u8a08\u884c\u3092\u8fd4\u3057\u307e\u3059\u3002"), new Table_FunctionDescription("#Data", "\u30c6\u30fc\u30d6\u30eb\u307e\u305f\u306f\u6307\u5b9a\u3057\u305f\u30c6\u30fc\u30d6\u30eb\u5217\u306e\u30c7\u30fc\u30bf \u30bb\u30eb\u3092\u8fd4\u3057\u307e\u3059\u3002"), new Table_FunctionDescription("#Headers", "\u30c6\u30fc\u30d6\u30eb\u307e\u305f\u306f\u6307\u5b9a\u3057\u305f\u30c6\u30fc\u30d6\u30eb\u5217\u306e\u5217\u756a\u53f7\u3092\u8fd4\u3057\u307e\u3059\u3002"), new Table_FunctionDescription("#Totals", "\u30c6\u30fc\u30d6\u30eb\u307e\u305f\u306f\u6307\u5b9a\u3057\u305f\u30c6\u30fc\u30d6\u30eb\u5217\u306e\u96c6\u8a08\u884c\u3092\u8fd4\u3057\u307e\u3059\u3002"), new Table_FunctionDescription("@", "\u3053\u306e\u884c\u3002")];
                FormulaTextBoxResource_JP.Functions = [new FunctionDescription("ABS", "\u6307\u5b9a\u3057\u305f\u5024\u306e\u7d76\u5bfe\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("ACCRINT", "\u5b9a\u671f\u7684\u306b\u5229\u606f\u304c\u652f\u6255\u308f\u308c\u308b\u8a3c\u5238\u306e\u672a\u53ce\u5229\u606f\u984d\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("issue"), new ParameterDescription("first"), new ParameterDescription("settle"), new ParameterDescription("rate"), new ParameterDescription("par"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("ACCRINTM", "\u6e80\u671f\u306b\u5229\u606f\u304c\u652f\u6255\u308f\u308c\u308b\u8a3c\u5238\u306e\u672a\u53ce\u5229\u606f\u984d\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("issue"), new ParameterDescription("maturity"), new ParameterDescription("rate"), new ParameterDescription("par"), new ParameterDescription("basis")]), new FunctionDescription("ACOS", "\u6307\u5b9a\u306e\u5024\u304c\u30b3\u30b5\u30a4\u30f3\u3068\u306a\u308b\u89d2\u5ea6\u3092\u8fd4\u3057\u307e\u3059\u3002\u623b\u308a\u5024\u306e\u89d2\u5ea6\u306f 0\uff5e\u03c0\uff08\u30e9\u30b8\u30a2\u30f3\u5358\u4f4d\uff09\u3067\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("ACOSH", "\u6307\u5b9a\u3057\u305f\u89d2\u5ea6\u306e\u30cf\u30a4\u30d1\u30fc\u30dc\u30ea\u30c3\u30af\u30b3\u30b5\u30a4\u30f3\u306e\u9006\u95a2\u6570\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("ADDRESS", "\u6307\u5b9a\u306e\u884c\u756a\u53f7\u304a\u3088\u3073\u5217\u756a\u53f7\u306b\u57fa\u3065\u304d\u3001\u30bb\u30eb \u30a2\u30c9\u30ec\u30b9\u3092\u8868\u3059\u30c6\u30ad\u30b9\u30c8\u3092\u751f\u6210\u3057\u307e\u3059\u3002", [new ParameterDescription("row"), new ParameterDescription("column"), new ParameterDescription("absnum"), new ParameterDescription("a1style"), new ParameterDescription("sheettext")]), new FunctionDescription("AMORDEGRC", "\u65e5\u5272\u308a\u8a08\u7b97\u306b\u3088\u308b\u6e1b\u4fa1\u511f\u5374\u3092\u8003\u616e\u3057\u3001\u8cc7\u7523\u8010\u7528\u5e74\u6570\u306b\u57fa\u3065\u304f\u6e1b\u4fa1\u511f\u5374\u4fc2\u6570\u3092\u8a08\u7b97\u306b\u9069\u7528\u3057\u3066\u3001\u4f1a\u8a08\u671f\u3054\u3068\u306e\u6e1b\u4fa1\u511f\u5374\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("cost"), new ParameterDescription("datepurchased"), new ParameterDescription("firstperiod"), new ParameterDescription("salvage"), new ParameterDescription("period"), new ParameterDescription("drate"), new ParameterDescription("basis")]), new FunctionDescription("AMORLINC", "\u65e5\u5272\u308a\u8a08\u7b97\u306b\u3088\u308b\u6e1b\u4fa1\u6d88\u5374\u3092\u8003\u616e\u3057\u3001\u6307\u5b9a\u306e\u4f1a\u8a08\u671f\u306e\u6e1b\u4fa1\u511f\u5374\u8cbb\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("cost"), new ParameterDescription("datepurchased"), new ParameterDescription("firstperiod"), new ParameterDescription("salvage"), new ParameterDescription("period"), new ParameterDescription("drate"), new ParameterDescription("basis")]), new FunctionDescription("AND", "\u3059\u3079\u3066\u306e\u5f15\u6570\u304c\u771f\u3067\u3042\u308c\u3070 True \u3092\u3001\uff11\u3064\u4ee5\u4e0a\u306e\u5f15\u6570\u304c\u507d\u3067\u3042\u308c\u3070 False \u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("logical1"), new ParameterDescription("logical2")]), new FunctionDescription("ASIN", "\u6307\u5b9a\u306e\u5024\u304c\u30b5\u30a4\u30f3\u3068\u306a\u308b\u89d2\u5ea6\u3092\u8fd4\u3057\u307e\u3059\u3002\u623b\u308a\u5024\u306e\u89d2\u5ea6\u306f -\u03c0/2\uff5e\u03c0/2\uff08\u30e9\u30b8\u30a2\u30f3\u5358\u4f4d\uff09\u3067\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("ASINH", "\u6307\u5b9a\u3057\u305f\u6570\u5024\u306e\u30cf\u30a4\u30d1\u30fc\u30dc\u30ea\u30c3\u30af\u30b5\u30a4\u30f3\u306e\u9006\u95a2\u6570\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("ATAN", "\u6307\u5b9a\u306e\u5024\u304c\u30bf\u30f3\u30b8\u30a7\u30f3\u30c8\u3068\u306a\u308b\u89d2\u5ea6\u3092\u8fd4\u3057\u307e\u3059\u3002\u623b\u308a\u5024\u306e\u89d2\u5ea6\u306f -\u03c0/2\uff5e\u03c0/2\uff08\u30e9\u30b8\u30a2\u30f3\u5358\u4f4d\uff09\u3067\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("ATAN2", "\u6307\u5b9a\u306e x \u5ea7\u6a19\u304a\u3088\u3073 y \u5ea7\u6a19\u306e\u30a2\u30fc\u30af\u30bf\u30f3\u30b8\u30a7\u30f3\u30c8\u3092\u8fd4\u3057\u307e\u3059\u3002\u623b\u308a\u5024\u306e\u89d2\u5ea6\u306f -\u03c0\uff5e\u03c0\uff08\u30e9\u30b8\u30a2\u30f3\u5358\u4f4d\u3001\u305f\u3060\u3057 -\u03c0 \u3092\u9664\u304f\uff09\u3067\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("y")]), new FunctionDescription("ATANH", "\u6307\u5b9a\u3057\u305f\u6570\u5024\u306e\u30cf\u30a4\u30d1\u30fc\u30dc\u30ea\u30c3\u30af\u30bf\u30f3\u30b8\u30a7\u30f3\u30c8\u306e\u9006\u95a2\u6570\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("AVEDEV", "\u6307\u5b9a\u306e\u30c7\u30fc\u30bf\u5168\u4f53\u306e\u5e73\u5747\u5024\u306b\u5bfe\u3059\u308b\u3001\u500b\u3005\u306e\u5024\u306e\u7d76\u5bfe\u504f\u5dee\u306e\u5e73\u5747\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("AVERAGE", "\u6307\u5b9a\u3057\u305f\u6570\u5024\u306e\u5e73\u5747\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("AVERAGEA", "\u6307\u5b9a\u3057\u305f\u6570\u5024\u306e\u5e73\u5747\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("AVERAGEIF", "\u6307\u5b9a\u3057\u305f\u57fa\u6e96\u3092\u6e80\u305f\u3059\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u306e\u5e73\u5747\u5024\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true), new ParameterDescription("condition")]), new FunctionDescription("AVERAGEIFS", "\u6307\u5b9a\u3057\u305f\u8907\u6570\u306e\u57fa\u6e96\u3092\u6e80\u305f\u3059\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u306e\u5e73\u5747\u5024\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("condition1"), new ParameterDescription("value2", true), new ParameterDescription("condition2...")]), new FunctionDescription("BESSELI", "\u7d14\u865a\u6570\u3092\u5f15\u6570\u3068\u3057\u305f\u3068\u304d\u306e\u7b2c\uff11\u7a2e\u5909\u5f62\u30d9\u30c3\u30bb\u30eb\u95a2\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("order")]), new FunctionDescription("BESSELJ", "\u7b2c\uff11\u7a2e\u30d9\u30c3\u30bb\u30eb\u95a2\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("order")]), new FunctionDescription("BESSELK", "\u7d14\u865a\u6570\u3092\u5f15\u6570\u3068\u3057\u305f\u3068\u304d\u306e\u7b2c\uff12\u7a2e\u5909\u5f62\u30d9\u30c3\u30bb\u30eb\u95a2\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("order")]), new FunctionDescription("BESSELY", "\u7b2c\uff12\u7a2e\u30d9\u30c3\u30bb\u30eb\u95a2\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("order")]), new FunctionDescription("BETADIST", "\u7d2f\u7a4d\u03b2\u78ba\u7387\u5bc6\u5ea6\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("lower"), new ParameterDescription("upper")]), new FunctionDescription("BETAINV", "\u7d2f\u7a4d\u03b2\u78ba\u7387\u5bc6\u5ea6\u95a2\u6570\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("prob"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("lower"), new ParameterDescription("upper")]), new FunctionDescription("BIN2DEC", "\uff12\u9032\u6570\u5024\u3092 10 \u9032\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number")]), new FunctionDescription("BIN2HEX", "\uff12\u9032\u6570\u5024\u3092 16 \u9032\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("BIN2OCT", "\uff12\u9032\u6570\u5024\u3092\uff18\u9032\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("BINOMDIST", "\u500b\u5225\u9805\u306e\u4e8c\u9805\u5206\u5e03\u306e\u78ba\u7387\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("n"), new ParameterDescription("p"), new ParameterDescription("cumulative")]), new FunctionDescription("CEILING", "\u6307\u5b9a\u3057\u305f\u57fa\u6e96\u5024\u306e\u500d\u6570\u306b\u306a\u308b\u3088\u3046\u306b\u6570\u5024\u3092\u4e38\u3081\u3001\u5143\u306e\u5024\u306b\u6700\u3082\u8fd1\u3044\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("signif")]), new FunctionDescription("CHAR", "\u6307\u5b9a\u3057\u305f\u6570\u5024\u306b\u5bfe\u5fdc\u3059\u308b\u6587\u5b57\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("CHIDIST", "\u7247\u5074\u30ab\u30a4\uff12\u4e57\u5206\u5e03\u306e\u78ba\u7387\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("deg")]), new FunctionDescription("CHIINV", "\u7247\u5074\u30ab\u30a4\uff12\u4e57\u5206\u5e03\u78ba\u7387\u306e\u9006\u95a2\u6570\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("prob"), new ParameterDescription("deg")]), new FunctionDescription("CHITEST", "\u30ab\u30a4\uff12\u4e57\u5206\u5e03\u304b\u3089\u306e\u72ec\u7acb\u6027\u3092\u691c\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("obs_array"), new ParameterDescription("exp_array")]), new FunctionDescription("CHOOSE", "\u5024\u30ea\u30b9\u30c8\u306e\u4e2d\u304b\u3089\u7279\u5b9a\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("index"), new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("CLEAN", "\u6307\u5b9a\u306e\u30c6\u30ad\u30b9\u30c8\u304b\u3089\u3001\u5370\u5237\u3067\u304d\u306a\u3044\u3059\u3079\u3066\u306e\u6587\u5b57\u3092\u524a\u9664\u3057\u307e\u3059\u3002", [new ParameterDescription("text")]), new FunctionDescription("CODE", "\u30c6\u30ad\u30b9\u30c8\u5185\u306e\u5148\u982d\u6587\u5b57\u306b\u5bfe\u5fdc\u3059\u308b\u6570\u5024\u30b3\u30fc\u30c9\u3092\u8fd4\u3057\u307e\u3059\u3002\u8fd4\u3055\u308c\u308b\u30b3\u30fc\u30c9\u306f\u3001Unicode\u3067\u3059\u3002", [new ParameterDescription("text")]), new FunctionDescription("COLUMN", "\u53c2\u7167\u306e\u5217\u756a\u53f7\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("reference")]), new FunctionDescription("COLUMNS", "\u914d\u5217\u5185\u306e\u5217\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array")]), new FunctionDescription("COMBIN", "\u7dcf\u6570\u304b\u3089\u6307\u5b9a\u306e\u500b\u6570\u3092\u629c\u304d\u53d6\u308b\u5834\u5408\u3001\u9078\u629e\u53ef\u80fd\u306a\u7d44\u307f\u5408\u308f\u305b\u306e\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("k"), new ParameterDescription("n")]), new FunctionDescription("COMPLEX", "\u5b9f\u6570\u4fc2\u6570\u304a\u3088\u3073\u865a\u6570\u4fc2\u6570\u3092\u8907\u7d20\u6570\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("realcoeff"), new ParameterDescription("imagcoeff"), new ParameterDescription("suffix")]), new FunctionDescription("CONCATENATE", "\u6307\u5b9a\u306e\u6587\u5b57\u5217\u307e\u305f\u306f\u6570\u5024\u3092\uff11\u3064\u306e\u6587\u5b57\u5217\u306b\u7d71\u5408\u3057\u307e\u3059\u3002", [new ParameterDescription("text1"), new ParameterDescription("text2"), new ParameterDescription("....")]), new FunctionDescription("CONFIDENCE", "\u6bcd\u96c6\u56e3\u306e\u5e73\u5747\u5024\u306b\u5bfe\u3059\u308b\u4fe1\u983c\u533a\u9593\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("alpha"), new ParameterDescription("stdev"), new ParameterDescription("size")]), new FunctionDescription("CONVERT", "\u3042\u308b\u8a08\u6e2c\u5358\u4f4d\u306e\u5024\u3092\u3001\u5225\u306e\u8a08\u6e2c\u5358\u4f4d\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("from-unit"), new ParameterDescription("to-unit")]), new FunctionDescription("CORREL", "\uff12\u7d44\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u9593\u306e\u76f8\u95a2\u4fc2\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("COS", "\u6307\u5b9a\u3057\u305f\u89d2\u5ea6\u306e\u30b3\u30b5\u30a4\u30f3\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("angle")]), new FunctionDescription("COSH", "\u6307\u5b9a\u3057\u305f\u89d2\u5ea6\u306e\u30cf\u30a4\u30d1\u30fc\u30dc\u30ea\u30c3\u30af\u30b3\u30b5\u30a4\u30f3\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("COUNT", "\u6307\u5b9a\u3057\u305f\u8907\u6570\u306e\u5024\u306b\u6570\u5024\u304c\u4f55\u500b\u542b\u307e\u308c\u3066\u3044\u308b\u304b\u500b\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("COUNTA", "\u6307\u5b9a\u3057\u305f\u8907\u6570\u306e\u5024\u306b\u6570\u5024\u304c\u4f55\u500b\u542b\u307e\u308c\u3066\u3044\u308b\u304b\u500b\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("COUNTBLANK", "\u30b7\u30fc\u30c8\u4e0a\u306e\u6307\u5b9a\u306e\u30bb\u30eb\u7bc4\u56f2\u304b\u3089\u3001\u7a7a\u767d\u30bb\u30eb\u306e\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("cellrange")]), new FunctionDescription("COUNTIF", "\u7279\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u30bb\u30eb\u306e\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("cellrange"), new ParameterDescription("condition")]), new FunctionDescription("COUNTIFS", "\u8907\u6570\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u30bb\u30eb\u306e\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("cellrange"), new ParameterDescription("condition")]), new FunctionDescription("COUPDAYBS", "\u8a3c\u5238\u306e\u5229\u6255\u671f\u9593\u306e\uff11\u65e5\u76ee\u304b\u3089\u53d7\u6e21\u65e5\u307e\u3067\u306e\u65e5\u6570\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("COUPDAYS", "\u8a3c\u5238\u306e\u5229\u6255\u671f\u9593\uff08\u53d7\u6e21\u65e5\u3092\u542b\u3080\uff09\u3092\u8868\u3059\u65e5\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("COUPDAYSNC", "\u8a3c\u5238\u306e\u53d7\u6e21\u65e5\u304b\u3089\u6b21\u306e\u5229\u6255\u65e5\u307e\u3067\u306e\u65e5\u6570\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("COUPNCD", "\u8a3c\u5238\u306e\u53d7\u6e21\u5f8c\u306e\u6b21\u56de\u306e\u5229\u6255\u65e5\u3092\u65e5\u4ed8\u5024\u3067\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("frequency"), new ParameterDescription("basi")]), new FunctionDescription("COUPNUM", "\u8a3c\u5238\u306e\u53d7\u6e21\u65e5\u304b\u3089\u6e80\u671f\u65e5\u307e\u3067\u306e\u671f\u9593\u4e2d\u306e\u5229\u6255\u56de\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("COUPPCD", "\u8a3c\u5238\u306e\u53d7\u6e21\u65e5\u76f4\u524d\u306e\u5229\u6255\u65e5\u3092\u65e5\u4ed8\u5024\u3067\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("COVAR", "\uff12\u7d44\u306e\u5bfe\u5fdc\u3059\u308b\u30c7\u30fc\u30bf\u306e\u6a19\u6e96\u504f\u5dee\u306e\u7a4d\u306e\u5e73\u5747\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("CRITBINOM", "\u7d2f\u7a4d\u4e8c\u9805\u5206\u5e03\u306e\u5024\u304c\u57fa\u6e96\u5024\u4ee5\u4e0a\u3068\u306a\u308b\u6700\u5c0f\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("n"), new ParameterDescription("p"), new ParameterDescription("alpha")]), new FunctionDescription("CUMIPMT", "\u958b\u59cb\u671f\u304b\u3089\u7d42\u4e86\u671f\u307e\u3067\u306e\u671f\u9593\u5185\u3067\u3001\u8cb8\u4ed8\u91d1\u306b\u5bfe\u3057\u3066\u652f\u6255\u308f\u308c\u308b\u5229\u606f\u306e\u7d2f\u8a08\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("rate"), new ParameterDescription("nper"), new ParameterDescription("pval"), new ParameterDescription("startperiod"), new ParameterDescription("endperiod"), new ParameterDescription("paytype")]), new FunctionDescription("CUMPRINC", "\u958b\u59cb\u671f\u304b\u3089\u7d42\u4e86\u671f\u307e\u3067\u306e\u671f\u9593\u5185\u3067\u3001\u8cb8\u4ed8\u91d1\u306b\u5bfe\u3057\u3066\u652f\u6255\u308f\u308c\u308b\u5143\u91d1\u306e\u7d2f\u8a08\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("rate"), new ParameterDescription("nper"), new ParameterDescription("pval"), new ParameterDescription("startperiod"), new ParameterDescription("endperiod"), new ParameterDescription("paytype")]), new FunctionDescription("DATE", "\u5e74\u3001\u6708\u3001\u65e5\u3067\u6307\u5b9a\u3057\u305f\u65e5\u4ed8\u306b\u5bfe\u3059\u308b\u65e5\u4ed8\u30aa\u30d6\u30b8\u30a7\u30af\u30c8\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("year"), new ParameterDescription("month"), new ParameterDescription("day")]), new FunctionDescription("DATEDIF", "\uff12\u3064\u306e\u65e5\u4ed8\u9593\u306e\u65e5\u6570\u3001\u6708\u6570\u3001\u307e\u305f\u306f\u5e74\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("date1"), new ParameterDescription("date2"), new ParameterDescription("outputcode")]), new FunctionDescription("DATEVALUE", "\u6307\u5b9a\u306e\u65e5\u4ed8\u306b\u5bfe\u3059\u308b\u65e5\u6642\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("date_string")]), new FunctionDescription("DAVERAGE", "\u30ea\u30b9\u30c8\u307e\u305f\u306f\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u5185\u306e\u6307\u5b9a\u306e\uff11\u5217\u306b\u304a\u3044\u3066\u3001\u6307\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u5024\u306e\u5e73\u5747\u5024\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DAY", "\u7279\u5b9a\u306e\u65e5\u4ed8\u306b\u5bfe\u5fdc\u3059\u308b\u3001\u6708\u5185\u306e\u65e5\uff081\uff5e31\uff09\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("date")]), new FunctionDescription("DAYS360", "\uff11\u5e74\u3092 360 \u65e5\uff08\uff11\u6708\u304c 30 \u65e5\uff09\u3068\u307f\u306a\u3057\u3001\uff12\u3064\u306e\u65e5\u4ed8\u9593\u306e\u65e5\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("startdate"), new ParameterDescription("enddate"), new ParameterDescription("method")]), new FunctionDescription("DB", "\u5b9a\u7387\u6cd5\u3092\u4f7f\u7528\u3057\u3066\u3001\u7279\u5b9a\u306e\u671f\u306e\u8cc7\u7523\u306e\u6e1b\u4fa1\u511f\u5374\u8cbb\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("cost"), new ParameterDescription("salvage"), new ParameterDescription("life"), new ParameterDescription("period"), new ParameterDescription("month")]), new FunctionDescription("DCOUNT", "\u30ea\u30b9\u30c8\u307e\u305f\u306f\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u5185\u306e\u6307\u5b9a\u306e\uff11\u5217\u306b\u304a\u3044\u3066\u3001\u6307\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u6570\u5024\u3092\u4fdd\u6301\u3059\u308b\u30bb\u30eb\u6570\u3092\u30ab\u30a6\u30f3\u30c8\u3057\u307e\u3059\u3002", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DCOUNTA", "\u30ea\u30b9\u30c8\u307e\u305f\u306f\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u5185\u306e\u6307\u5b9a\u306e\uff11\u5217\u306b\u304a\u3044\u3066\u3001\u6307\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u3001\u7a7a\u767d\u4ee5\u5916\u306e\u30bb\u30eb\u6570\u3092\u30ab\u30a6\u30f3\u30c8\u3057\u307e\u3059\u3002", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DDB", "\u500d\u7387\u6cd5\u3001\u307e\u305f\u306f\u305d\u306e\u4ed6\u306e\u6307\u5b9a\u306e\u8a08\u7b97\u65b9\u6cd5\u3092\u4f7f\u7528\u3057\u3066\u3001\u7279\u5b9a\u306e\u671f\u306e\u8cc7\u7523\u306e\u6e1b\u4fa1\u511f\u5374\u8cbb\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("cost"), new ParameterDescription("salvage"), new ParameterDescription("life"), new ParameterDescription("period"), new ParameterDescription("factor")]), new FunctionDescription("DEC2BIN", "10 \u9032\u6570\u5024\u3092\uff12\u9032\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("DEC2HEX", "10 \u9032\u6570\u5024\u3092 16 \u9032\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("DEC2OCT", "10 \u9032\u6570\u5024\u3092\uff18\u9032\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("DEGREES", "\u6307\u5b9a\u3057\u305f\u30e9\u30b8\u30a2\u30f3\u5358\u4f4d\u306e\u89d2\u5ea6\u306e\u5024\u3092\u5ea6\u5358\u4f4d\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("angle")]), new FunctionDescription("DELTA", "\uff12\u3064\u306e\u5024\u304c\u7b49\u3057\u3044\u304b\u3069\u3046\u304b\u3092\u8abf\u3079\u307e\u3059\u3002\uff12\u3064\u306e\u5024\u304c\u7b49\u3057\u3051\u308c\u3070\uff11\u3001\u305d\u3046\u3067\u306a\u3051\u308c\u3070\uff10\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2")]), new FunctionDescription("DEVSQ", "\u5e73\u5747\u5024\u306b\u5bfe\u3059\u308b\u500b\u3005\u306e\u30c7\u30fc\u30bf\u70b9\u306e\u504f\u5dee\u306e\u5e73\u65b9\u548c\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("DGET", "\u30ea\u30b9\u30c8\u307e\u305f\u306f\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u5185\u306e\u6307\u5b9a\u306e\uff11\u5217\u306b\u304a\u3044\u3066\u3001\u6307\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\uff11\u3064\u306e\u5024\u3092\u62bd\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DISC", "\u8a3c\u5238\u306e\u5272\u5f15\u7387\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("pricep"), new ParameterDescription("redeem"), new ParameterDescription("basis")]), new FunctionDescription("DMAX", "\u30ea\u30b9\u30c8\u307e\u305f\u306f\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u5185\u306e\u6307\u5b9a\u306e\uff11\u5217\u306b\u304a\u3044\u3066\u3001\u6307\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u6700\u5927\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DMIN", "\u30ea\u30b9\u30c8\u307e\u305f\u306f\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u5185\u306e\u6307\u5b9a\u306e\uff11\u5217\u306b\u304a\u3044\u3066\u3001\u6307\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u6700\u5c0f\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DOLLAR", "\u6570\u5024\u3092\u6307\u5b9a\u306e\u5c0f\u6570\u4f4d\u306b\u306a\u308b\u3088\u3046\u306b\u56db\u6368\u4e94\u5165\u3057\u3001\u901a\u8ca8\u66f8\u5f0f\u3092\u65bd\u3057\u305f\u6587\u5b57\u5217\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("digits")]), new FunctionDescription("DOLLARDE", "\u5206\u6570\u8868\u8a18\u3055\u308c\u305f\u30c9\u30eb\u5024\u3092\u3001\u5c0f\u6570\u8868\u8a18\u306e\u30c9\u30eb\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("fractionaldollar"), new ParameterDescription("fraction")]), new FunctionDescription("DOLLARFR", "\u5c0f\u6570\u8868\u8a18\u3055\u308c\u305f\u30c9\u30eb\u5024\u3092\u3001\u5206\u6570\u8868\u8a18\u306e\u30c9\u30eb\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("decimaldollar"), new ParameterDescription("fraction")]), new FunctionDescription("DPRODUCT", "\u30ea\u30b9\u30c8\u307e\u305f\u306f\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u5185\u306e\u6307\u5b9a\u306e\uff11\u5217\u306b\u304a\u3044\u3066\u3001\u6307\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u5024\u3092\u4e57\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DSTDEV", "\u30ea\u30b9\u30c8\u307e\u305f\u306f\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u5185\u306e\u6307\u5b9a\u306e\uff11\u5217\u306b\u304a\u3051\u308b\u3001\u6307\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u6570\u5024\u3092\u6a19\u672c\u3068\u3057\u3066\u4f7f\u7528\u3057\u3066\u3001\u6bcd\u96c6\u56e3\u306e\u6a19\u6e96\u504f\u5dee\u3092\u8a55\u4fa1\u3057\u307e\u3059", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DSTDEVP", "\u30ea\u30b9\u30c8\u307e\u305f\u306f\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u5185\u306e\u6307\u5b9a\u306e\uff11\u5217\u306b\u304a\u3051\u308b\u3001\u6307\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u6570\u5024\u3092\u4f7f\u7528\u3057\u3066\u3001\u6bcd\u96c6\u56e3\u5168\u4f53\u306b\u57fa\u3065\u304f\u6a19\u6e96\u504f\u5dee\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DSUM", "\u30ea\u30b9\u30c8\u307e\u305f\u306f\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u5185\u306e\u6307\u5b9a\u306e\uff11\u5217\u306b\u304a\u3044\u3066\u3001\u6307\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u6570\u5024\u3092\u52a0\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DURATION", "\u984d\u9762\u3092 $100 \u3068\u307f\u306a\u3057\u305f\u8a3c\u5238\u306e\u30de\u30b3\u30fc\u30ec\u30fc \u30c7\u30e5\u30ec\u30fc\u30b7\u30e7\u30f3\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("coupon"), new ParameterDescription("yield"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("DVAR", "\u30ea\u30b9\u30c8\u307e\u305f\u306f\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u5185\u306e\u6307\u5b9a\u306e\uff11\u5217\u306b\u304a\u3051\u308b\u3001\u6307\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u6570\u5024\u3092\u6a19\u672c\u3068\u3057\u3066\u4f7f\u7528\u3057\u3066\u3001\u6bcd\u96c6\u56e3\u306e\u5206\u6563\u3092\u8a55\u4fa1\u3057\u307e\u3059\u3002", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("DVARP", "\u30ea\u30b9\u30c8\u307e\u305f\u306f\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u5185\u306e\u6307\u5b9a\u306e\uff11\u5217\u306b\u304a\u3051\u308b\u3001\u6307\u5b9a\u306e\u6761\u4ef6\u3092\u6e80\u305f\u3059\u6570\u5024\u3092\u4f7f\u7528\u3057\u3066\u3001\u6bcd\u96c6\u56e3\u5168\u4f53\u306b\u57fa\u3065\u304f\u5206\u6563\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("database"), new ParameterDescription(" field"), new ParameterDescription(" criteria")]), new FunctionDescription("EDATE", "\u6307\u5b9a\u306e\u65e5\u4ed8\u304b\u3089\u3001\u6307\u5b9a\u306e\u6708\u6570\u3060\u3051\u524d\u307e\u305f\u306f\u5f8c\u306e\u65e5\u6642\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("startdate"), new ParameterDescription("months")]), new FunctionDescription("EFFECT", "\u6307\u5b9a\u306e\u540d\u76ee\u5e74\u5229\u7387\u3068\uff11\u5e74\u3042\u305f\u308a\u306e\u8907\u5229\u8a08\u7b97\u671f\u9593\u306b\u57fa\u3065\u304d\u3001\u5b9f\u52b9\u5e74\u5229\u7387\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("nomrate"), new ParameterDescription("comper")]), new FunctionDescription("EOMONTH", "\u6307\u5b9a\u306e\u65e5\u4ed8\u304b\u3089\u3001\u6307\u5b9a\u306e\u6708\u6570\u3060\u3051\u524d\u307e\u305f\u306f\u5f8c\u306e\u6708\u306e\u6700\u7d42\u65e5\uff08\u6708\u672b\u65e5\uff09\u3068\u306a\u308b\u65e5\u6642\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("startdate"), new ParameterDescription("months")]), new FunctionDescription("ERF", "\u4e0a\u9650\u304b\u3089\u4e0b\u9650\u306e\u7bc4\u56f2\u3067\u3001\u8aa4\u5dee\u95a2\u6570\u306e\u7a4d\u5206\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("limit"), new ParameterDescription("upperlimit")]), new FunctionDescription("ERFC", "\u4e0b\u9650\u304b\u3089\u7121\u9650\u5927\u306e\u7bc4\u56f2\u3067\u3001\u76f8\u88dc\u8aa4\u5dee\u95a2\u6570\u306e\u7a4d\u5206\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("lowerlimit")]), new FunctionDescription("ERROR.TYPE", "\u30a8\u30e9\u30fc\u5024\u306b\u5bfe\u5fdc\u3059\u308b\u6570\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002\u30a8\u30e9\u30fc\u304c\u306a\u3044\u5834\u5408\u306f\u3001#N/A \u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("errorvalue")]), new FunctionDescription("EURO", "ISO \u901a\u8ca8\u30b3\u30fc\u30c9\u306b\u57fa\u3065\u304d\u3001\uff11\u30e6\u30fc\u30ed\u306b\u76f8\u5f53\u3059\u308b\u901a\u8ca8\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("code")]), new FunctionDescription("EUROCONVERT", "\u30e6\u30fc\u30ed\u52a0\u76df\u56fd\u901a\u8ca8\uff08\u30e6\u30fc\u30ed\u3092\u542b\u3080\uff09\u9593\u3067\u3001\u3042\u308b\u901a\u8ca8\u5024\u3092\u5225\u306e\u901a\u8ca8\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("currency"), new ParameterDescription("source"), new ParameterDescription("target"), new ParameterDescription("fullprecision"), new ParameterDescription("triangulation")]), new FunctionDescription("EVEN", "\u6307\u5b9a\u3057\u305f\u5024\u3092\u5207\u308a\u4e0a\u3052\u3001\u6700\u3082\u8fd1\u3044\u5076\u6570\u306e\u6574\u6570\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("EXACT", "\uff12\u3064\u306e\u6587\u5b57\u5217\u304c\u7b49\u3057\u3051\u308c\u3070 True \u3092\u3001\u305d\u3046\u3067\u306a\u3051\u308c\u3070 False \u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("text1"), new ParameterDescription("text2")]), new FunctionDescription("EXP", "e\uff08\u81ea\u7136\u5bfe\u6570\u306e\u5e95\uff09\u3092\u5e95\u3068\u3059\u308b\u3001\u6307\u5b9a\u306e\u6570\u306e\u3079\u304d\u4e57 (ex) \u3092\u8fd4\u3057\u307e\u3059\u3002EXP \u95a2\u6570\u306f LN \u306e\u9006\u95a2\u6570\u3067\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("EXPONDIST", "\u6307\u6570\u5206\u5e03\u95a2\u6570\u307e\u305f\u306f\u78ba\u7387\u5bc6\u5ea6\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("lambda"), new ParameterDescription("cumulative")]), new FunctionDescription("FACT", "\u6307\u5b9a\u3057\u305f\u5024\u306e\u968e\u4e57\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("number")]), new FunctionDescription("FACTDOUBLE", "\u6570\u5024\u306e\uff12\u4e57\u968e\u4e57\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("number")]), new FunctionDescription("FALSE", "\u8ad6\u7406\u5024\uff10\uff08False\uff09\u3092\u8fd4\u3057\u307e\u3059\u3002", []), new FunctionDescription("FDIST", "\uff12\u7d44\u306e\u30c7\u30fc\u30bf\u9593\u306e\u5206\u6563\u5ea6\u3092\u6bd4\u8f03\u3059\u308b F \u78ba\u7387\u5206\u5e03\u95a2\u6570\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("degnum"), new ParameterDescription("degden")]), new FunctionDescription("FIND", "\u30c6\u30ad\u30b9\u30c8\u5185\u304b\u3089\u6307\u5b9a\u306e\u6587\u5b57\u3092\u691c\u7d22\u3057\u3001\u3053\u306e\u6587\u5b57\u306e\u4f4d\u7f6e\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("findtext"), new ParameterDescription("intext"), new ParameterDescription("start")]), new FunctionDescription("FINV", "F \u78ba\u7387\u5206\u5e03\u95a2\u6570\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002p = FDIST(x,...) \u3067\u3042\u308b\u3068\u304d\u3001FINV(p,...) = x \u3068\u306a\u308a\u307e\u3059\u3002", [new ParameterDescription("p"), new ParameterDescription("degnum"), new ParameterDescription("degden")]), new FunctionDescription("FISHER", "\u6307\u5b9a\u306e\u5024\u306b\u5bfe\u3059\u308b\u30d5\u30a3\u30c3\u30b7\u30e3\u30fc\u5909\u63db\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("FISHERINV", "\u30d5\u30a3\u30c3\u30b7\u30e3\u30fc\u5909\u63db\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("FIXED", "\u6570\u5024\u3092\u6307\u5b9a\u306e\u5c0f\u6570\u4f4d\u306b\u306a\u308b\u3088\u3046\u306b\u56db\u6368\u4e94\u5165\u3057\u3001\u30d4\u30ea\u30aa\u30c9\u3068\u30b3\u30f3\u30de\uff08\u6307\u5b9a\u3057\u305f\u5834\u5408\uff09\u306b\u3088\u308b\u5c0f\u6570\u66f8\u5f0f\u3092\u9069\u7528\u3057\u305f\u7d50\u679c\u3092\u30c6\u30ad\u30b9\u30c8\u3068\u3057\u3066\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("num"), new ParameterDescription("digits"), new ParameterDescription("notcomma")]), new FunctionDescription("FLOOR", "\u6307\u5b9a\u3057\u305f\u57fa\u6e96\u5024\u306e\u500d\u6570\u306b\u306a\u308b\u3088\u3046\u306b\u6570\u5024\u3092\u5207\u308a\u6368\u3066\u3001\u5143\u306e\u5024\u306b\u6700\u3082\u8fd1\u3044\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("signif")]), new FunctionDescription("FORECAST", "\u65e2\u77e5\u306e\u5024\u3092\u4f7f\u7528\u3057\u3066\u4e88\u6e2c\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("Yarray"), new ParameterDescription("Xarray")]), new FunctionDescription("FREQUENCY", "\u6307\u5b9a\u306e\u5024\u7bc4\u56f2\u5185\u3067\u5024\u304c\u51fa\u73fe\u3059\u308b\u983b\u5ea6\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002 \u3053\u306e\u95a2\u6570\u306f\u3001\u6570\u5024\u306e\u5782\u76f4\u914d\u5217\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("dataarray"), new ParameterDescription("binarray")]), new FunctionDescription("FTEST", "F \u691c\u5b9a\u306e\u7d50\u679c\u3092\u8fd4\u3057\u307e\u3059\u3002\u3053\u308c\u306f\u3001\uff12\u3064\u306e\u914d\u5217\u5185\u306e\u30c7\u30fc\u30bf\u306e\u5206\u6563\u306b\u6709\u610f\u306a\u5dee\u304c\u8a8d\u3081\u3089\u308c\u306a\u3044\u7247\u5074\u78ba\u7387\u306e\u7b97\u51fa\u7d50\u679c\u3067\u3059\u3002", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("FV", "\u73fe\u5728\u4fa1\u5024\u3001\u5b9a\u671f\u6255\u3044\u3001\u304a\u3088\u3073\u7279\u5b9a\u306e\u5229\u7387\u3092\u6761\u4ef6\u3068\u3057\u3001\u6295\u8cc7\u306e\u5c06\u6765\u4fa1\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("rate"), new ParameterDescription("numper"), new ParameterDescription("paymt"), new ParameterDescription("pval"), new ParameterDescription("type")]), new FunctionDescription("FVSCHEDULE", "\u6295\u8cc7\u671f\u9593\u5185\u306e\u4e00\u9023\u306e\u91d1\u5229\u3092\u8907\u5408\u8a08\u7b97\u3059\u308b\u3053\u3068\u306b\u3088\u308a\u3001\u521d\u671f\u6295\u8cc7\uff08\u5143\u91d1\uff09\u306e\u5c06\u6765\u4fa1\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("principal"), new ParameterDescription("schedule")]), new FunctionDescription("GAMMADIST", "\u30ac\u30f3\u30de\u5206\u5e03\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("cumulative")]), new FunctionDescription("GAMMAINV", "\u30ac\u30f3\u30de\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002p = GAMMADIST(x,...) \u3067\u3042\u308b\u3068\u304d\u3001GAMMAINV(p,...) = x \u3068\u306a\u308a\u307e\u3059\u3002", [new ParameterDescription("p"), new ParameterDescription("alpha"), new ParameterDescription("beta")]), new FunctionDescription("GAMMALN", "\u30ac\u30f3\u30de\u95a2\u6570\u306e\u5024\u306e\u81ea\u7136\u5bfe\u6570 (x) \u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("GCD", "\uff12\u3064\u306e\u6570\u5024\u9593\u306e\u6700\u5927\u516c\u7d04\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002\u6700\u5927\u516c\u7d04\u6570\u3068\u306f\u3001\u5bfe\u8c61\u3068\u306a\u308b\u3059\u3079\u3066\u306e\u5024\u3092\u4f59\u308a\u3092\u51fa\u3055\u305a\u306b\u5272\u308a\u5207\u308b\u3053\u3068\u306e\u3067\u304d\u308b\u6700\u5927\u306e\u6574\u6570\u3067\u3059\u3002", [new ParameterDescription("number1"), new ParameterDescription("number2")]), new FunctionDescription("GEOMEAN", "\u4e00\u7fa4\u306e\u6b63\u6570\u306e\u76f8\u4e57\u5e73\u5747\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("GESTEP", "\u6570\u5024\u304c\u3057\u304d\u3044\u5024\u306b\u7b49\u3057\u3044\u304b\u3069\u3046\u304b\u3092\u5224\u5b9a\u3057\u307e\u3059\u3002\u6307\u5b9a\u3057\u305f\u6570\u5024\u304c\u3057\u304d\u3044\u5024\u3068\u7b49\u3057\u3044\u304b\u3001\u305d\u308c\u4ee5\u4e0a\u3067\u3042\u308c\u3070\uff11\u3001\u305d\u3046\u3067\u306a\u3044\u5834\u5408\u306f\uff10\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("step")]), new FunctionDescription("GROWTH", "\u4e88\u6e2c\u3055\u308c\u308b\u6307\u6570\u66f2\u7dda\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("y"), new ParameterDescription("x"), new ParameterDescription("newx"), new ParameterDescription("constant")]), new FunctionDescription("HARMEAN", "\u4e00\u7fa4\u306e\u6570\u5024\u306e\u8abf\u548c\u5e73\u5747\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("HEX2BIN", "16 \u9032\u6570\u5024\u3092\uff12\u9032\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription(" places")]), new FunctionDescription("HEX2DEC", "16 \u9032\u6570\u5024\u3092 10 \u9032\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number")]), new FunctionDescription("HEX2OCT", "16 \u9032\u6570\u5024\u3092\uff18\u9032\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription(" places")]), new FunctionDescription("HLOOKUP", "\u6307\u5b9a\u7bc4\u56f2\u306e\u6700\u4e0a\u884c\u304b\u3089\u5024\u3092\u691c\u7d22\u3057\u3001\u6307\u5b9a\u306e\u884c\u304b\u3089\u3001\u3053\u306e\u5024\u3068\u540c\u3058\u5217\u5185\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("array"), new ParameterDescription("row"), new ParameterDescription("approx")]), new FunctionDescription("HOUR", "\u6307\u5b9a\u306e\u6642\u523b\u5024\u306b\u5bfe\u5fdc\u3059\u308b\u6642\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("time")]), new FunctionDescription("HYPGEOMDIST", "\u8d85\u5e7e\u4f55\u5206\u5e03\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("n"), new ParameterDescription("M"), new ParameterDescription("N")]), new FunctionDescription("IF", "\u8ad6\u7406\u5f0f\u306e\u7d50\u679c\u3092\u8868\u3059\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("valueTest"), new ParameterDescription("valueTrue"), new ParameterDescription("valueFalse")]), new FunctionDescription("IFERROR", "\u6570\u5f0f\u3092\u8a55\u4fa1\u3057\u3001\u30a8\u30e9\u30fc\u306e\u5834\u5408\u306b\u306f\u6307\u5b9a\u3057\u305f\u5024\u3001\u305d\u306e\u4ed6\u306e\u5834\u5408\u306b\u306f\u6570\u5f0f\u306e\u7d50\u679c\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("error")]), new FunctionDescription("IMABS", "\u8907\u7d20\u6570\u306e\u7d76\u5bfe\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum")]), new FunctionDescription("IMAGINARY", "\u8907\u7d20\u6570\u306e\u865a\u6570\u4fc2\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum")]), new FunctionDescription("IMARGUMENT", "\u30e9\u30b8\u30a2\u30f3\u5358\u4f4d\u306e\u89d2\u5ea6\u3067\u3042\u308b\u5f15\u6570\u03b8\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum")]), new FunctionDescription("IMCONJUGATE", "\u8907\u7d20\u6570\u306e\u8907\u7d20\u5171\u5f79\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum")]), new FunctionDescription("IMCOS", "\u8907\u7d20\u6570\u306e\u30b3\u30b5\u30a4\u30f3\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum")]), new FunctionDescription("IMDIV", "\uff12\u3064\u306e\u8907\u7d20\u6570\u306e\u5546\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum"), new ParameterDescription("complexdenom")]), new FunctionDescription("IMEXP", "\u8907\u7d20\u6570\u306e\u6307\u6570\u95a2\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum")]), new FunctionDescription("IMLN", "\u8907\u7d20\u6570\u306e\u81ea\u7136\u5bfe\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum")]), new FunctionDescription("IMLOG2", "\u8907\u7d20\u6570\u306e\uff12\u3092\u5e95\u3068\u3059\u308b\u5bfe\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum")]), new FunctionDescription("IMLOG10", "\u8907\u7d20\u6570\u306e\u5e38\u7528\u5bfe\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum")]), new FunctionDescription("IMPOWER", "\u8907\u7d20\u6570\u306e\u6574\u6570\u4e57\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum"), new ParameterDescription("powernum")]), new FunctionDescription("IMPRODUCT", "\"x+yi\" \u307e\u305f\u306f \"x+yj\" \u5f62\u5f0f\u306e\u30c6\u30ad\u30b9\u30c8\u3067\u6307\u5b9a\u3057\u305f\u3001\u6700\u5927 29 \u500b\u306e\u8907\u7d20\u6570\u306e\u7a4d\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum1"), new ParameterDescription("complexnum2", true)]), new FunctionDescription("IMREAL", "\"x+yi\" \u307e\u305f\u306f \"x+yj\" \u5f62\u5f0f\u306e\u30c6\u30ad\u30b9\u30c8\u3067\u6307\u5b9a\u3057\u305f\u8907\u7d20\u6570\u306e\u5b9f\u6570\u4fc2\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum")]), new FunctionDescription("IMSIN", "\"x+yi\" \u307e\u305f\u306f \"x+yj\" \u5f62\u5f0f\u306e\u30c6\u30ad\u30b9\u30c8\u3067\u6307\u5b9a\u3057\u305f\u8907\u7d20\u6570\u306e\u30b5\u30a4\u30f3\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum")]), new FunctionDescription("IMSQRT", "\"x+yi\" \u307e\u305f\u306f \"x+yj\" \u5f62\u5f0f\u306e\u30c6\u30ad\u30b9\u30c8\u3067\u6307\u5b9a\u3057\u305f\u8907\u7d20\u6570\u306e\u5e73\u65b9\u6839\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum")]), new FunctionDescription("IMSUB", "\"x+yi\" \u307e\u305f\u306f \"x+yj\" \u5f62\u5f0f\u306e\u30c6\u30ad\u30b9\u30c8\u3067\u6307\u5b9a\u3057\u305f\uff12\u3064\u306e\u8907\u7d20\u6570\u306e\u5dee\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum1"), new ParameterDescription("complexnum2")]), new FunctionDescription("IMSUM", "\"x+yi\" \u307e\u305f\u306f \"x+yj\" \u5f62\u5f0f\u306e\u30c6\u30ad\u30b9\u30c8\u3067\u6307\u5b9a\u3057\u305f\uff12\u3064\u4ee5\u4e0a\u306e\u8907\u7d20\u6570\u306e\u5408\u8a08\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("complexnum1"), new ParameterDescription("complexnum2", true)]), new FunctionDescription("INDEX", "\u914d\u5217\u307e\u305f\u306f\u30bb\u30eb\u7bc4\u56f2\u306e\u4e2d\u304b\u3089\u3001\u7279\u5b9a\u306e\u5024\u307e\u305f\u306f\u5024\u3078\u306e\u53c2\u7167\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("return"), new ParameterDescription("row"), new ParameterDescription("col"), new ParameterDescription("area")]), new FunctionDescription("INDIRECT", "This function returns the reference specified by a text string. References are immediately evaluated to display their contents.", [new ParameterDescription("ref_text"), new ParameterDescription("a1_style")]), new FunctionDescription("INT", "\u6307\u5b9a\u3057\u305f\u5024\u306e\u5c0f\u6570\u90e8\u5206\u3092\u5207\u308a\u6368\u3066\u3001\u6700\u3082\u8fd1\u3044\u6574\u6570\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("INTERCEPT", "\u6307\u5b9a\u306e x \u5024\u3068 y \u5024\u3092\u4f7f\u7528\u3057\u3066\u5f97\u305f\u56de\u5e30\u76f4\u7dda\u304c y \u8ef8\u3068\u4ea4\u308f\u308b\u70b9\u3092\u6c42\u3081\u307e\u3059\u3002", [new ParameterDescription("dependent"), new ParameterDescription("independent")]), new FunctionDescription("INTRATE", "\u5168\u984d\u6295\u8cc7\u3055\u308c\u305f\u8a3c\u5238\u306e\u5229\u7387\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("invest"), new ParameterDescription("redeem"), new ParameterDescription("basis")]), new FunctionDescription("IPMT", "\u501f\u5165\u91d1\u8fd4\u6e08\u306b\u304a\u3044\u3066\u3001\u652f\u6255\u3046\u3079\u304d\u91d1\u5229\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("rate"), new ParameterDescription("per"), new ParameterDescription("nper"), new ParameterDescription("pval"), new ParameterDescription("fval"), new ParameterDescription("type")]), new FunctionDescription("IRR", "\u4e00\u9023\u306e\u5b9a\u671f\u7684\u306a\u30ad\u30e3\u30c3\u30b7\u30e5\u30d5\u30ed\u30fc\uff08values \u5f15\u6570\u306e\u914d\u5217\u5024\u3067\u6307\u5b9a\uff09\u306b\u57fa\u3065\u304d\u3001\u5185\u90e8\u5229\u76ca\u7387\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("arrayvals"), new ParameterDescription("estimate")]), new FunctionDescription("ISBLANK", "\u30bb\u30eb\u306a\u3069\u306e\u5024\u304c\u7a7a\u767d\u304b\u3069\u3046\u304b\u3092\u5224\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("cellreference")]), new FunctionDescription("ISERR", "\u30bb\u30eb\u306a\u3069\u306e\u5024\u304c\u3001#N/A\uff08\u5229\u7528\u4e0d\u53ef\uff09\u4ee5\u5916\u306e\u30a8\u30e9\u30fc\u5024\u3092\u53c2\u7167\u3059\u308b\u304b\u3069\u3046\u304b\u3092\u5224\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("cellreference")]), new FunctionDescription("ISERROR", "\u30bb\u30eb\u306a\u3069\u306e\u5024\u304c\u3001\u4efb\u610f\u306e\u30a8\u30e9\u30fc\u5024\u3092\u53c2\u7167\u3059\u308b\u304b\u3069\u3046\u304b\u3092\u5224\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("cellreference")]), new FunctionDescription("ISEVEN", "\u30bb\u30eb\u306a\u3069\u306e\u5024\u304c\u5076\u6570\u304b\u3069\u3046\u304b\u3092\u5224\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("cellreference")]), new FunctionDescription("ISLOGICAL", "\u30bb\u30eb\u306a\u3069\u306e\u5024\u304c\u8ad6\u7406\u5024\u304b\u3069\u3046\u304b\u3092\u5224\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("cellreference")]), new FunctionDescription("ISNA", "\u30bb\u30eb\u306a\u3069\u306e\u5024\u304c\u3001\u30a8\u30e9\u30fc\u5024 #N/A\uff08\u5229\u7528\u4e0d\u53ef\uff09\u3092\u53c2\u7167\u3059\u308b\u304b\u3069\u3046\u304b\u3092\u5224\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("cellreference")]), new FunctionDescription("ISNONTEXT", "\u30bb\u30eb\u306a\u3069\u306e\u5024\u304c\u3001\u30c6\u30ad\u30b9\u30c8\u4ee5\u5916\u306e\u30c7\u30fc\u30bf\u304b\u3069\u3046\u304b\u3092\u5224\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("cellreference")]), new FunctionDescription("ISNUMBER", "\u30bb\u30eb\u306a\u3069\u306e\u5024\u304c\u6570\u5024\u304b\u3069\u3046\u304b\u3092\u5224\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("cellreference")]), new FunctionDescription("ISODD", "\u30bb\u30eb\u306a\u3069\u306e\u5024\u304c\u5947\u6570\u304b\u3069\u3046\u304b\u3092\u5224\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("cellreference")]), new FunctionDescription("ISPMT", "\u6307\u5b9a\u306e\u6295\u8cc7\u671f\u9593\u306b\u652f\u6255\u308f\u308c\u308b\u91d1\u5229\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("rate"), new ParameterDescription("per"), new ParameterDescription("nper"), new ParameterDescription("pv")]), new FunctionDescription("ISREF", "\u30bb\u30eb\u306a\u3069\u306e\u5024\u304c\u3001\u4ed6\u306e\u30bb\u30eb\u3078\u306e\u53c2\u7167\u304b\u3069\u3046\u304b\u3092\u5224\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("cellreference")]), new FunctionDescription("ISTEXT", "\u30bb\u30eb\u306a\u3069\u306e\u5024\u304c\u6587\u5b57\u5217\u304b\u3069\u3046\u304b\u3092\u5224\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("cellreference")]), new FunctionDescription("KURT", "\u30c7\u30fc\u30bf\u96c6\u5408\u306e\u5c16\u5ea6\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2"), new ParameterDescription("value3"), new ParameterDescription("value4", true)]), new FunctionDescription("LARGE", "\u30c7\u30fc\u30bf\u96c6\u5408\u5185\u3067 n \u756a\u76ee\u306b\u5927\u304d\u3044\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("n")]), new FunctionDescription("LCM", "\u6307\u5b9a\u3057\u305f\u6574\u6570\u306e\u6700\u5c0f\u516c\u500d\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("number1"), new ParameterDescription("number2")]), new FunctionDescription("LEFT", "\u30c6\u30ad\u30b9\u30c8\u5024\u304b\u3089\u5148\u982d\uff08\u5de6\u7aef\uff09\u306e\u6587\u5b57\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("mytext"), new ParameterDescription("num_chars")]), new FunctionDescription("LEN", "\u30c6\u30ad\u30b9\u30c8\u306e\u6587\u5b57\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("LINEST", "\u76f4\u7dda\u306b\u57fa\u3065\u304f\u7d71\u8a08\u5024\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("y"), new ParameterDescription("x"), new ParameterDescription("constant"), new ParameterDescription("stats")]), new FunctionDescription("LN", "\u6307\u5b9a\u3057\u305f\u6570\u306e\u81ea\u7136\u5bfe\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002LN \u306f EXP \u306e\u9006\u95a2\u6570\u3067\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("LOG", "Y \u3092\u5e95\u3068\u3059\u308b\u6570\u5024 X \u306e\u5bfe\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("base")]), new FunctionDescription("LOG10", "10 \u3092\u5e95\u3068\u3059\u308b\u6570\u5024 X \u306e\u5bfe\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("LOGEST", "\u30c7\u30fc\u30bf\u306b\u9069\u5408\u3059\u308b\u6307\u6570\u66f2\u7dda\u3092\u8a08\u7b97\u3057\u3001\u3053\u306e\u66f2\u7dda\u3092\u8868\u3059\u5024\u306e\u914d\u5217\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("y"), new ParameterDescription("x"), new ParameterDescription("constant"), new ParameterDescription("stats")]), new FunctionDescription("LOGINV", "x \u306e\u5bfe\u6570\u6b63\u898f\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("prob"), new ParameterDescription("mean"), new ParameterDescription("stdev")]), new FunctionDescription("LOGNORMDIST", "x \u306e\u5bfe\u6570\u6b63\u898f\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("mean"), new ParameterDescription("stdev")]), new FunctionDescription("LOOKUP", "\uff11\u884c\u307e\u305f\u306f\uff11\u5217\u5185\u306e\u30bb\u30eb\u7bc4\u56f2\u3001\u307e\u305f\u306f\u914d\u5217\u304b\u3089\u5024\u3092\u691c\u7d22\u3057\u307e\u3059\u3002", [new ParameterDescription("lookupvalue"), new ParameterDescription("lookupvector"), new ParameterDescription("resultvector")]), new FunctionDescription("LOWER", "\u30c6\u30ad\u30b9\u30c8\u3092\u5c0f\u6587\u5b57\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("string")]), new FunctionDescription("MATCH", "\u6307\u5b9a\u3055\u308c\u305f\u9805\u76ee\u306e\u7bc4\u56f2\u5185\u306b\u304a\u3051\u308b\u76f8\u5bfe\u4f4d\u7f6e\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("array"), new ParameterDescription("type")]), new FunctionDescription("MAX", "\u5f15\u6570\u30ea\u30b9\u30c8\u306e\u4e2d\u304b\u3089\u6700\u5927\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("MAXA", "\u5f15\u6570\u30ea\u30b9\u30c8\u306e\u4e2d\u304b\u3089\u6700\u5927\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("MDETERM", "\u914d\u5217\u306e\u884c\u5217\u5f0f\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array")]), new FunctionDescription("MDURATION", "\u984d\u9762\u3092 $100 \u3068\u307f\u306a\u3057\u305f\u8a3c\u5238\u306e\u4fee\u6b63\u30de\u30b3\u30fc\u30ec\u30fc \u30c7\u30e5\u30ec\u30fc\u30b7\u30e7\u30f3\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("coupon"), new ParameterDescription("yield"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("MEDIAN", "\u6307\u5b9a\u3057\u305f\u4e00\u7fa4\u306e\u6570\u5024\u306e\u4e2d\u304b\u3089\u30e1\u30b8\u30a2\u30f3\uff08\u4e2d\u592e\u5024\uff09\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("MID", "\u30c6\u30ad\u30b9\u30c8\u5185\u306e\u6307\u5b9a\u4f4d\u7f6e\u304b\u3089\u3001\u6307\u5b9a\u3057\u305f\u6570\u306e\u6587\u5b57\u3092\u53d6\u308a\u51fa\u3057\u3066\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("text"), new ParameterDescription("start_num"), new ParameterDescription("num_chars")]), new FunctionDescription("MIN", "\u5f15\u6570\u30ea\u30b9\u30c8\u306e\u4e2d\u304b\u3089\u6700\u5c0f\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("MINA", "\u5f15\u6570\u30ea\u30b9\u30c8\u306e\u4e2d\u304b\u3089\u6700\u5c0f\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("MINUTE", "\u5f15\u6570\u30ea\u30b9\u30c8\u306e\u4e2d\u304b\u3089\u6700\u5c0f\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("time")]), new FunctionDescription("MINVERSE", "\u914d\u5217\u306b\u6307\u5b9a\u3057\u305f\u884c\u5217\u306e\u9006\u884c\u5217\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array")]), new FunctionDescription("MIRR", "\u4e00\u9023\u306e\u5b9a\u671f\u7684\u306a\u30ad\u30e3\u30c3\u30b7\u30e5\u30d5\u30ed\u30fc\u306b\u57fa\u3065\u304d\u3001\u4fee\u6b63\u5185\u90e8\u5229\u76ca\u7387\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("arrayvals"), new ParameterDescription("payment_int"), new ParameterDescription("income_int")]), new FunctionDescription("MMULT", "\uff12\u3064\u306e\u914d\u5217\u306b\u6307\u5b9a\u3057\u305f\u884c\u5217\u306e\u7a4d\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("MOD", "number \u5f15\u6570\uff08\u88ab\u9664\u6570\uff09\u3092 divisor \u5f15\u6570\uff08\u9664\u6570\uff09\u3067\u5272\u3063\u305f\u3068\u304d\u306e\u5270\u4f59\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("dividend"), new ParameterDescription("divisor")]), new FunctionDescription("MODE", "\u6307\u5b9a\u306e\u5f15\u6570\u30ea\u30b9\u30c8\u306e\u4e2d\u3067\u3001\u6700\u3082\u983b\u7e41\u306b\u51fa\u73fe\u3059\u308b\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("MONTH", "\u6307\u5b9a\u306e\u65e5\u4ed8\u5024\u306b\u5bfe\u5fdc\u3059\u308b\u6708\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("date")]), new FunctionDescription("MROUND", "\u6307\u5b9a\u306e\u500d\u6570\u3068\u306a\u308b\u3088\u3046\u306b\u4e38\u3081\u305f\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("multiple")]), new FunctionDescription("MULTINOMIAL", "\u6307\u5b9a\u3055\u308c\u305f\u5f15\u6570\u30ea\u30b9\u30c8\u306e\u591a\u9805\u4fc2\u6570\uff08\u30ea\u30b9\u30c8\u5185\u306e\u5024\u306e\u548c\u306e\u968e\u4e57\u3068\u3001\u5404\u5024\u306e\u968e\u4e57\u306e\u7a4d\u3068\u306e\u6bd4\uff09\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("N", "\u6570\u5024\u306b\u5909\u63db\u3057\u305f\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("NA", "\u300c\u5229\u7528\u4e0d\u53ef\u300d\u3092\u610f\u5473\u3059\u308b\u30a8\u30e9\u30fc\u5024 #N/A \u3092\u8fd4\u3057\u307e\u3059\u3002", []), new FunctionDescription("NEGBINOMDIST", "\u8ca0\u306e\u4e8c\u9805\u5206\u5e03\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("r"), new ParameterDescription("p")]), new FunctionDescription("NETWORKDAYS", "\u958b\u59cb\u65e5\u304b\u3089\u7d42\u4e86\u65e5\u307e\u3067\u306e\u671f\u9593\u5185\u3067\u3001\u5b8c\u5168\u306a\u7a3c\u50cd\u65e5\u306e\u5408\u8a08\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("startdate"), new ParameterDescription("enddate"), new ParameterDescription("holidays")]), new FunctionDescription("NOMINAL", "\u6307\u5b9a\u306e\u5b9f\u52b9\u5229\u7387\u3068\uff11\u5e74\u3042\u305f\u308a\u306e\u8907\u5229\u8a08\u7b97\u671f\u9593\u306b\u57fa\u3065\u304d\u3001\u540d\u76ee\u4e0a\u306e\u5e74\u5229\u7387\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("effrate"), new ParameterDescription("comper")]), new FunctionDescription("NORMDIST", "\u6307\u5b9a\u306e\u5e73\u5747\u3068\u6a19\u6e96\u504f\u5dee\u306b\u5bfe\u3059\u308b\u6b63\u898f\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("mean"), new ParameterDescription("stdev"), new ParameterDescription("cumulative")]), new FunctionDescription("NORMINV", "\u6307\u5b9a\u306e\u5e73\u5747\u3068\u6a19\u6e96\u504f\u5dee\u306b\u5bfe\u3059\u308b\u6b63\u898f\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("prob"), new ParameterDescription("mean"), new ParameterDescription("stdev")]), new FunctionDescription("NORMSDIST", "\u6a19\u6e96\u6b63\u898f\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("NORMSINV", "\u6a19\u6e96\u6b63\u898f\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002\u3053\u306e\u5206\u5e03\u3067\u306f\u3001\u5e73\u5747\u304c\uff10\u3001\u6a19\u6e96\u504f\u5dee\u304c\uff11\u3068\u306a\u308a\u307e\u3059\u3002", [new ParameterDescription("prob")]), new FunctionDescription("NOT", "\u5f15\u6570\u306e\u8ad6\u7406\u5024\u3092\u9006\u306b\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("NOW", "\u73fe\u5728\u306e\u65e5\u4ed8\u3068\u6642\u523b\u3092\u8868\u3059\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", []), new FunctionDescription("NPER", "\u73fe\u884c\u4fa1\u5024\u3001\u5c06\u6765\u4fa1\u5024\u3001\u5b9a\u671f\u6255\u3044\u3001\u304a\u3088\u3073\u7279\u5b9a\u306e\u5229\u7387\u3092\u6761\u4ef6\u3068\u3057\u3001\u6295\u8cc7\u306b\u5fc5\u8981\u306a\u671f\u9593\uff08\u652f\u6255\u56de\u6570\uff09\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("rate"), new ParameterDescription("paymt"), new ParameterDescription("pval"), new ParameterDescription("fval"), new ParameterDescription("type")]), new FunctionDescription("NPV", "\u5272\u5f15\u7387\u3068\u3001\u5c06\u6765\u884c\u308f\u308c\u308b\u4e00\u9023\u306e\u652f\u6255\u3044\u304a\u3088\u3073\u305d\u306e\u53ce\u76ca\u306b\u57fa\u3065\u3044\u3066\u3001\u6295\u8cc7\u306e\u6b63\u5473\u73fe\u5728\u4fa1\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("discount"), new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("OCT2BIN", "\uff18\u9032\u6570\u5024\u3092\uff12\u9032\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("OCT2DEC", "\uff18\u9032\u6570\u5024\u3092 10 \u9032\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number")]), new FunctionDescription("OCT2HEX", "\uff18\u9032\u6570\u5024\u3092 16 \u9032\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("places")]), new FunctionDescription("ODD", "\u6307\u5b9a\u3057\u305f\u5024\u3092\u5207\u308a\u4e0a\u3052\u3001\u6700\u3082\u8fd1\u3044\u5947\u6570\u306e\u6574\u6570\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("ODDFPRICE", "\uff11\u671f\u76ee\u306e\u65e5\u6570\u304c\u534a\u7aef\u306a\u8a3c\u5238\u306b\u5bfe\u3057\u3001\u984d\u9762 $100 \u3042\u305f\u308a\u306e\u4fa1\u683c\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("issue"), new ParameterDescription("first"), new ParameterDescription("rate"), new ParameterDescription("yield"), new ParameterDescription("redeem"), new ParameterDescription("freq"), new ParameterDescription("basis")]), new FunctionDescription("ODDFYIELD", "\uff11\u671f\u76ee\u306e\u65e5\u6570\u304c\u534a\u7aef\u306a\u8a3c\u5238\u306e\u5229\u56de\u308a\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("issue"), new ParameterDescription("first"), new ParameterDescription("rate"), new ParameterDescription("price"), new ParameterDescription("redeem"), new ParameterDescription("freq"), new ParameterDescription("basis")]), new FunctionDescription("ODDLPRICE", "\u6700\u7d42\u671f\u306e\u65e5\u6570\u304c\u534a\u7aef\u306a\u8a3c\u5238\u306b\u5bfe\u3057\u3001\u984d\u9762 $100 \u3042\u305f\u308a\u306e\u4fa1\u683c\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("last"), new ParameterDescription("rate"), new ParameterDescription("yield"), new ParameterDescription("redeem"), new ParameterDescription("freq"), new ParameterDescription("basis")]), new FunctionDescription("ODDLYIELD", "\u6700\u7d42\u671f\u306e\u65e5\u6570\u304c\u534a\u7aef\u306a\u8a3c\u5238\u306e\u5229\u56de\u308a\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("last"), new ParameterDescription("rate"), new ParameterDescription("price"), new ParameterDescription("redeem"), new ParameterDescription("freq"), new ParameterDescription("basis")]), new FunctionDescription("OFFSET", "\u3053\u306e\u95a2\u6570\u306f\u3001\u30bb\u30eb\u7bc4\u56f2\u3078\u306e\u53c2\u7167\u3092\u8fd4\u3057\u307e\u3059\u3002 \u8fd4\u3055\u308c\u308b\u30bb\u30eb\u7bc4\u56f2\u306f\u3001\u5358\u4e00\u306e\u30bb\u30eb\u307e\u305f\u306f\u30bb\u30eb\u7bc4\u56f2\u304b\u3089\u306e\u884c\u6570\u3068\u5217\u6570\u3067\u6307\u5b9a\u3057\u307e\u3059\u3002 \u3053\u308c\u306b\u3088\u308a\u3001\u5358\u4e00\u306e\u30bb\u30eb\u307e\u305f\u306f\u30bb\u30eb\u7bc4\u56f2\u304c\u8fd4\u3055\u308c\u307e\u3059\u3002", [new ParameterDescription("reference"), new ParameterDescription("rows"), new ParameterDescription("cols"), new ParameterDescription("height"), new ParameterDescription("width")]), new FunctionDescription("OR", "\u3044\u305a\u308c\u304b\u306e\u5f15\u6570\u304c\u771f\u3067\u3042\u308c\u3070\uff11\uff08True\uff09\u3092\u3001\u3059\u3079\u3066\u306e\u5f15\u6570\u304c\u507d\u3067\u3042\u308c\u3070\uff10\uff08False\uff09\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("argument1"), new ParameterDescription("argument2...")]), new FunctionDescription("PEARSON", "\u30d4\u30a2\u30bd\u30f3\u306e\u7a4d\u7387\u76f8\u95a2\u4fc2\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002\u3053\u308c\u306f -1.0\uff5e1.0 \u306e\u7bc4\u56f2\u306e\u6570\u5024\u3067\u3042\u308a\u3001\uff12\u7d44\u306e\u30c7\u30fc\u30bf\u9593\u3067\u306e\u7dda\u5f62\u76f8\u95a2\u306e\u7a0b\u5ea6\u3092\u793a\u3057\u307e\u3059\u3002", [new ParameterDescription("array_ind"), new ParameterDescription("array_dep")]), new FunctionDescription("PERCENTILE", "\u3042\u308b\u7bc4\u56f2\u5185\u306e\u5024\u306e\u4e2d\u3067 n \u756a\u76ee\u306e\u767e\u5206\u4f4d\u3092\u6301\u3064\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("n")]), new FunctionDescription("PERCENTRANK", "\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u5185\u306e\u5024\u306e\u9806\u4f4d\u3092\u3001\u3053\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u5185\u306e\u767e\u5206\u7387\u3068\u3057\u3066\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("n"), new ParameterDescription("sigdig")]), new FunctionDescription("PERMUT", "\u6307\u5b9a\u3057\u305f\u6570\u306e\u6a19\u672c\u3092\u629c\u304d\u53d6\u308b\u969b\u306e\u3001\u6709\u52b9\u306a\u9806\u5217\u306e\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("k"), new ParameterDescription("n")]), new FunctionDescription("PI", "\u5186\u5468\u7387\uff08\u03c0\uff09\u3092 3.1415926536 \u3068\u3057\u3066\u8fd4\u3057\u307e\u3059\u3002", []), new FunctionDescription("PMT", "\u73fe\u5728\u4fa1\u5024\u3001\u6307\u5b9a\u306e\u5229\u7387\u3001\u304a\u3088\u3073\u652f\u6255\u56de\u6570\u306b\u57fa\u3065\u304d\u3001\u501f\u5165\u91d1\u8fd4\u6e08\u3067\u306e\u5b9a\u671f\u652f\u6255\u984d\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("rate"), new ParameterDescription("nper"), new ParameterDescription("pval"), new ParameterDescription("fval"), new ParameterDescription("type")]), new FunctionDescription("POISSON", "\u30dd\u30a2\u30bd\u30f3\u78ba\u7387\u5206\u5e03\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("nevents"), new ParameterDescription("mean"), new ParameterDescription("cumulative")]), new FunctionDescription("POWER", "\u6307\u5b9a\u306e\u6570\uff08X\uff09\u3092\u5e95\u3068\u3059\u308b\u6307\u6570\uff08Y\uff09\u306e\u3079\u304d\u4e57\u3092\u6c42\u3081\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("power")]), new FunctionDescription("PPMT", "\u5143\u91d1\u306e\u8fd4\u6e08\u984d\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("rate"), new ParameterDescription("per"), new ParameterDescription("nper"), new ParameterDescription("pval"), new ParameterDescription("fval"), new ParameterDescription("type")]), new FunctionDescription("PRICE", "\u5b9a\u671f\u7684\u306b\u5229\u606f\u304c\u652f\u6255\u308f\u308c\u308b\u8a3c\u5238\u306b\u5bfe\u3057\u3001\u984d\u9762 $100 \u3042\u305f\u308a\u306e\u4fa1\u683c\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("settlement"), new ParameterDescription("maturity"), new ParameterDescription("rate"), new ParameterDescription("yield"), new ParameterDescription("redeem"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("PRICEDISC", "\u5272\u5f15\u50b5\u306e\u984d\u9762 $100 \u3042\u305f\u308a\u306e\u4fa1\u683c\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("discount"), new ParameterDescription("redeem"), new ParameterDescription("basis")]), new FunctionDescription("PRICEMAT", "\u6e80\u671f\u65e5\u306b\u5229\u606f\u304c\u6255\u308f\u308c\u308b\u8a3c\u5238\u306b\u5bfe\u3057\u3001\u984d\u9762 $100 \u3042\u305f\u308a\u306e\u4fa1\u683c\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("issue"), new ParameterDescription("rate"), new ParameterDescription("yield"), new ParameterDescription("basis")]), new FunctionDescription("PROB", "\u7279\u5b9a\u7bc4\u56f2\u5185\u306e\u5024\u304c\u4e0a\u9650\u3068\u4e0b\u9650\u306e\u9593\u306b\u53ce\u307e\u308b\u78ba\u7387\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("probs"), new ParameterDescription("lower"), new ParameterDescription("upper")]), new FunctionDescription("PRODUCT", "\u3059\u3079\u3066\u306e\u5f15\u6570\u5024\u3092\u4e57\u7b97\u3057\u3066\u5f97\u305f\u7a4d\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("PV", "\u7279\u5b9a\u306e\u5229\u7387\u3001\u5b9a\u671f\u6255\u3044\u306e\u56de\u6570\u3068\u652f\u6255\u984d\u3001\u304a\u3088\u3073\u5c06\u6765\u4fa1\u5024\u3092\u6761\u4ef6\u3068\u3057\u3066\u3001\u6295\u8cc7\u306e\u73fe\u5728\u4fa1\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("rate"), new ParameterDescription("numper"), new ParameterDescription("paymt"), new ParameterDescription("fval"), new ParameterDescription("type")]), new FunctionDescription("QUARTILE", "\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u304b\u3089\u3001\u6307\u5b9a\u3057\u305f\u56db\u5206\u4f4d\u6570\uff08\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u306e 1/4\uff3b25%\uff3d\uff09\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("quart")]), new FunctionDescription("QUOTIENT", "\u9664\u7b97\u3067\u5f97\u305f\u5546\u306e\u6574\u6570\u90e8\u5206\u3092\u8fd4\u3057\u307e\u3059\u3002QUOTIENT \u95a2\u6570\u306f\u3001\u5546\u306e\u4f59\u308a\uff08\u5270\u4f59\uff09\u3092\u7121\u8996\u3057\u305f\u3044\u5834\u5408\u306b\u4f7f\u7528\u3057\u307e\u3059\u3002", [new ParameterDescription("numerator"), new ParameterDescription("denominator")]), new FunctionDescription("RADIANS", "\u5ea6\u5358\u4f4d\u306e\u89d2\u5ea6\u306e\u5024\u3092\u30e9\u30b8\u30a2\u30f3\u5358\u4f4d\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("RADIANS", "\u5ea6\u5358\u4f4d\u306e\u89d2\u5ea6\u306e\u5024\u3092\u30e9\u30b8\u30a2\u30f3\u5358\u4f4d\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("RAND", "\u5206\u5e03\u304c\u4e00\u69d8\u306a\u30010\u4ee5\u4e0a1\u672a\u6e80\u306e\u4e71\u6570\u3092\u767a\u751f\u3055\u305b\u307e\u3059\u3002RAND \u95a2\u6570\u306f\u3001\u30b9\u30d7\u30ec\u30c3\u30c9\u30b7\u30fc\u30c8\u304c\u518d\u8a08\u7b97\u3055\u308c\u308b\u305f\u3073\u306b\u65b0\u305f\u306a\u4e71\u6570\u3092\u767a\u751f\u3055\u305b\u307e\u3059\u3002", []), new FunctionDescription("RANDBETWEEN", "\u6307\u5b9a\u3057\u305f\uff12\u3064\u306e\u6570\u5024\u9593\u306e\u7bc4\u56f2\u3067\u4e71\u6570\u3092\u767a\u751f\u3055\u305b\u307e\u3059\u3002RANDBETWEEN \u95a2\u6570\u306f\u3001\u30b7\u30fc\u30c8\u304c\u518d\u8a08\u7b97\u3055\u308c\u308b\u305f\u3073\u306b\u65b0\u305f\u306b\u4e71\u6570\u3092\u767a\u751f\u3055\u305b\u307e\u3059\u3002", [new ParameterDescription("lower"), new ParameterDescription("upper")]), new FunctionDescription("RANK", "\u6570\u5024\u30ea\u30b9\u30c8\u306e\u4e2d\u304b\u3089\u3001\u6307\u5b9a\u306e\u6570\u5024\u304c\u4f55\u756a\u76ee\u306b\u4f4d\u7f6e\u3059\u308b\u304b\u3092\u8fd4\u3057\u307e\u3059\u3002RANK \u95a2\u6570\u306e\u8fd4\u3059\u9806\u4f4d\u306f\u3001\u30ea\u30b9\u30c8\u5185\u306e\u6570\u5024\u3092\u4e26\u3079\u66ff\u3048\u305f\u5834\u5408\u306e\u6570\u5024\u306e\u9806\u4f4d\u3068\u306a\u308a\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("array"), new ParameterDescription("order")]), new FunctionDescription("RATE", "\u6295\u8cc7\u671f\u9593\u3092\u901a\u3058\u305f\u5229\u7387\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("nper"), new ParameterDescription("pmt"), new ParameterDescription("pval"), new ParameterDescription("fval"), new ParameterDescription("type"), new ParameterDescription("guess")]), new FunctionDescription("RECEIVED", "\u5168\u984d\u6295\u8cc7\u3055\u308c\u305f\u8a3c\u5238\u306b\u5bfe\u3057\u3066\u3001\u6e80\u671f\u306b\u652f\u6255\u308f\u308c\u308b\u91d1\u984d\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("invest"), new ParameterDescription("discount"), new ParameterDescription("basis")]), new FunctionDescription("REPLACE", "\u6587\u5b57\u5217\u306e\u4e00\u90e8\u3092\u5225\u306e\u6587\u5b57\u5217\u306b\u7f6e\u304d\u63db\u3048\u307e\u3059\u3002", [new ParameterDescription("old_text"), new ParameterDescription("start_char"), new ParameterDescription("num_chars"), new ParameterDescription("new_text")]), new FunctionDescription("REPT", "\u6587\u5b57\u5217\u3092\u6307\u5b9a\u306e\u56de\u6570\u5206\u3001\u7e70\u308a\u8fd4\u3057\u8868\u793a\u3057\u307e\u3059\u3002", [new ParameterDescription("text"), new ParameterDescription("number")]), new FunctionDescription("RIGHT", "\u30c6\u30ad\u30b9\u30c8\u5024\u304b\u3089\u53f3\u7aef\u306e\u6587\u5b57\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("text"), new ParameterDescription("num_chars")]), new FunctionDescription("ROMAN", "\u30a2\u30e9\u30d3\u30a2\u6570\u5b57\u3092\u3001\u30ed\u30fc\u30de\u6570\u5b57\u3092\u8868\u3059\u30c6\u30ad\u30b9\u30c8\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("style")]), new FunctionDescription("ROUND", "\u6307\u5b9a\u306e\u6570\u5024\u3092\u3001\u6307\u5b9a\u306e\u6841\u6570\u306b\u306a\u308b\u3088\u3046\u306b\u56db\u6368\u4e94\u5165\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("places")]), new FunctionDescription("ROUNDDOWN", "\u6307\u5b9a\u306e\u6570\u5024\u3092\u3001\u6307\u5b9a\u306e\u6841\u6570\u306b\u306a\u308b\u3088\u3046\u306b\u5207\u308a\u6368\u3066\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("places")]), new FunctionDescription("ROUNDUP", "\u6307\u5b9a\u306e\u6570\u5024\u3092\u3001\u6307\u5b9a\u306e\u6841\u6570\u306b\u306a\u308b\u3088\u3046\u306b\u5207\u308a\u4e0a\u3052\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("places")]), new FunctionDescription("ROW", "\u53c2\u7167\u306e\u884c\u756a\u53f7\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("reference")]), new FunctionDescription("ROWS", "\u914d\u5217\u5185\u306e\u884c\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array")]), new FunctionDescription("RSQ", "\u65e2\u77e5\u306e x \u3068\u65e2\u77e5\u306e Y \u3092\u901a\u904e\u3059\u308b\u56de\u5e30\u76f4\u7dda\u306e\u30c7\u30fc\u30bf\u70b9\u3092\u4f7f\u7528\u3057\u3066\u3001\u30d4\u30a2\u30bd\u30f3\u7a4d\u7387\u76f8\u95a2\u4fc2\u6570\u306e\u4e8c\u4e57\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array_dep"), new ParameterDescription("array_ind")]), new FunctionDescription("SEARCH", "\u30c6\u30ad\u30b9\u30c8\u5185\u304b\u3089\u6307\u5b9a\u306e\u6587\u5b57\u3092\u691c\u7d22\u3057\u3001\u30c6\u30ad\u30b9\u30c8\u5185\u306b\u304a\u3051\u308b\u3053\u306e\u6587\u5b57\u306e\u958b\u59cb\u4f4d\u7f6e\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("string1"), new ParameterDescription("string2")]), new FunctionDescription("SECOND", "\u6307\u5b9a\u306e\u6642\u523b\u5024\u306b\u5bfe\u5fdc\u3059\u308b\u79d2\u306e\u5024\uff080\uff5e59\uff09\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("time")]), new FunctionDescription("SERIESSUM", "\u3079\u304d\u7d1a\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("n"), new ParameterDescription("m"), new ParameterDescription("coeff")]), new FunctionDescription("SIGN", "\u6570\u5024\u306e\u7b26\u53f7\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("cellreference")]), new FunctionDescription("SIN", "\u6307\u5b9a\u3057\u305f\u89d2\u5ea6\u306e\u30b5\u30a4\u30f3\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("angle")]), new FunctionDescription("SINH", "\u6307\u5b9a\u3057\u305f\u6570\u5024\u306e\u30cf\u30a4\u30d1\u30fc\u30dc\u30ea\u30c3\u30af\u30b5\u30a4\u30f3\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("SKEW", "\u5206\u5e03\u306e\u6b6a\u5ea6\uff08\u5e73\u5747\u5024\u304b\u3089\u306e\u30c7\u30fc\u30bf\u306e\u504f\u308a\uff09\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("number1"), new ParameterDescription("number2", true)]), new FunctionDescription("SLN", "\u5b9a\u984d\u6cd5\u3092\u4f7f\u7528\u3057\u3066\u3001\uff11\u671f\u3042\u305f\u308a\u306e\u8cc7\u7523\u306e\u6e1b\u4fa1\u511f\u5374\u8cbb\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("cost"), new ParameterDescription("salvage"), new ParameterDescription("life")]), new FunctionDescription("SLOPE", "\u56de\u5e30\u76f4\u7dda\u306e\u50be\u304d\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("array_dep"), new ParameterDescription("array_ind")]), new FunctionDescription("SMALL", "\u30c7\u30fc\u30bf\u96c6\u5408\u5185\u3067 n \u756a\u76ee\u306b\u5c0f\u3055\u3044\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("n")]), new FunctionDescription("SQRT", "\u6307\u5b9a\u3057\u305f\u6570\u5024\u306e\u6b63\u306e\u5e73\u65b9\u6839\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("SQRTPI", "\u6307\u5b9a\u306e\u6570\u5024\u3092\u5186\u5468\u7387\u306b\u639b\u3051\u305f\u5024\u306e\u6b63\u306e\u5e73\u65b9\u6839\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("multiple")]), new FunctionDescription("STANDARDIZE", "\u7279\u5b9a\u306e\u5e73\u5747\u5024\u3068\u6a19\u6e96\u504f\u5dee\u3067\u6c7a\u5b9a\u3055\u308c\u308b\u5206\u5e03\u3092\u6a19\u6e96\u5316\u3059\u308b\u305f\u3081\u306e\u5909\u91cf\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("mean"), new ParameterDescription("stdev")]), new FunctionDescription("STDEVA", "\u6307\u5b9a\u3057\u305f\u6570\u5024\u306e\u96c6\u5408\u304b\u3089\u6a19\u6e96\u504f\u5dee\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("STDEVP", "\u5f15\u6570\u3068\u3057\u3066\u6307\u5b9a\u3057\u305f\u6bcd\u96c6\u56e3\u5168\u4f53\u306e\u6a19\u6e96\u504f\u5dee\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("STDEVPA", "\u5f15\u6570\u3068\u3057\u3066\u6307\u5b9a\u3057\u305f\u6bcd\u96c6\u56e3\u5168\u4f53\u306e\u6a19\u6e96\u504f\u5dee\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("STEYX", "\u500b\u5225\u306e x \u306b\u5bfe\u3059\u308b y \u306e\u4e88\u6e2c\u5024\u306e\u6a19\u6e96\u8aa4\u5dee\u3092\u8fd4\u3057\u307e\u3059\u3002\u6a19\u6e96\u8aa4\u5dee\u3068\u306f\u3001x \u5024\u306b\u5bfe\u3057\u3066\u4e88\u6e2c\u3055\u308c\u308b y \u5024\u306e\u8aa4\u5dee\u306e\u91cf\u3092\u8868\u3059\u6307\u6a19\u3067\u3059\u3002", [new ParameterDescription("array_dep"), new ParameterDescription("array_ind")]), new FunctionDescription("SUBSTITUTE", "\u65e2\u5b58\u6587\u5b57\u5217\u5185\u306e\u6307\u5b9a\u306e\u6587\u5b57\u3092\u3001\u65b0\u898f\u6587\u5b57\u5217\u306b\u7f6e\u304d\u63db\u3048\u307e\u3059\u3002", [new ParameterDescription("text"), new ParameterDescription("old_piece"), new ParameterDescription("new_piece"), new ParameterDescription("instance")]), new FunctionDescription("SUBTOTAL", "\u5c0f\u8a08\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("functioncode"), new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("SUM", "\u30bb\u30eb\u307e\u305f\u306f\u30bb\u30eb\u30d6\u30ed\u30c3\u30af\u306e\u548c\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("SUMIF", "\u6307\u5b9a\u306e\u57fa\u6e96\u306b\u57fa\u3065\u304d\u3001\u30bb\u30eb\u5024\u3092\u5408\u8a08\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("condition"), new ParameterDescription("sumrange")]), new FunctionDescription("SUMIFS", "\u8907\u6570\u306e\u57fa\u6e96\u306b\u57fa\u3065\u304d\u3001\u30bb\u30eb\u5024\u3092\u5408\u8a08\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("conditionarray"), new ParameterDescription("condition", true)]), new FunctionDescription("SUMPRODUCT", "\u6307\u5b9a\u306e\u914d\u5217\u5185\u306e\u5bfe\u5fdc\u3059\u308b\u8981\u7d20\u306e\u7a4d\u3092\u7b97\u51fa\u3057\u3001\u3053\u308c\u3089\u306e\u7a4d\u306e\u5408\u8a08\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array1"), new ParameterDescription("array2", true)]), new FunctionDescription("SUMSQ", "\u5f15\u6570\u306b\u6307\u5b9a\u3057\u305f\u5024\u306e\uff12\u4e57\u306e\u5408\u8a08\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("SUMX2MY2", "\uff12\u3064\u306e\u914d\u5217\u5185\u306e\u5bfe\u5fdc\u3059\u308b\u8981\u7d20\u306e\u5e73\u65b9\u5dee\u3092\u5408\u8a08\u3057\u3066\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array_x"), new ParameterDescription("array_y")]), new FunctionDescription("SUMX2PY2", "\uff12\u3064\u306e\u914d\u5217\u5185\u306e\u5bfe\u5fdc\u3059\u308b\u8981\u7d20\u306e\u5e73\u65b9\u548c\u3092\u5408\u8a08\u3057\u3066\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array_x"), new ParameterDescription("array_y")]), new FunctionDescription("SUMXMY2", "\uff12\u3064\u306e\u914d\u5217\u5185\u306e\u5bfe\u5fdc\u3059\u308b\u8981\u7d20\u306e\u5dee\u3092\uff12\u4e57\u3057\u3066\u5408\u8a08\u3057\u307e\u3059\u3002", [new ParameterDescription("array_x"), new ParameterDescription("array_y")]), new FunctionDescription("SYD", "\u5b9a\u984d\u9013\u6e1b\u6cd5\u3092\u4f7f\u7528\u3057\u3066\u3001\u7279\u5b9a\u671f\u9593\u306e\u8cc7\u7523\u306e\u6e1b\u4fa1\u511f\u5374\u8cbb\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("cost"), new ParameterDescription("salvage"), new ParameterDescription("life"), new ParameterDescription("period")]), new FunctionDescription("T", "\u30bb\u30eb\u5185\u306b\u30c6\u30ad\u30b9\u30c8\u304c\u4fdd\u6301\u3055\u308c\u3066\u3044\u308b\u5834\u5408\u306b\u3053\u306e\u30c6\u30ad\u30b9\u30c8\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("TAN", "\u6307\u5b9a\u3057\u305f\u89d2\u5ea6\u306e\u30bf\u30f3\u30b8\u30a7\u30f3\u30c8\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("angle")]), new FunctionDescription("TANH", "\u6307\u5b9a\u3057\u305f\u6570\u5024\u306e\u30cf\u30a4\u30d1\u30fc\u30dc\u30ea\u30c3\u30af\u30bf\u30f3\u30b8\u30a7\u30f3\u30c8\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("TBILLEQ", "\u7c73\u56fd\u8ca1\u52d9\u7701\u77ed\u671f\u8a3c\u5238\uff08TB\uff09\u306e\u50b5\u5238\u306b\u76f8\u5f53\u3059\u308b\u5229\u56de\u308a\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("discount")]), new FunctionDescription("TBILLPRICE", "\u7c73\u56fd\u8ca1\u52d9\u7701\u77ed\u671f\u8a3c\u5238\uff08TB\uff09\u306e\u984d\u9762 $100 \u3042\u305f\u308a\u306e\u4fa1\u683c\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("discount")]), new FunctionDescription("TBILLYIELD", "\u7c73\u56fd\u8ca1\u52d9\u7701\u77ed\u671f\u8a3c\u5238\uff08TB\uff09\u306e\u5229\u56de\u308a\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("mature"), new ParameterDescription("priceper")]), new FunctionDescription("TDIST", "t \u5206\u5e03\u306e\u78ba\u7387\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("deg"), new ParameterDescription("tails")]), new FunctionDescription("TEXT", "\u6570\u5024\u3092\u66f8\u5f0f\u8a2d\u5b9a\u3057\u3001\u30c6\u30ad\u30b9\u30c8\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("text")]), new FunctionDescription("TIME", "\u6307\u5b9a\u306e\u6642\u9593\u306b\u5bfe\u3059\u308b DateTime \u30aa\u30d6\u30b8\u30a7\u30af\u30c8\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("hour"), new ParameterDescription("minutes"), new ParameterDescription("seconds")]), new FunctionDescription("TIMEVALUE", "\u6587\u5b57\u5217\u3067\u8868\u3055\u308c\u308b\u6642\u523b\u306b\u5bfe\u5fdc\u3059\u308b\u6642\u9593\u9593\u9694\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("time_string")]), new FunctionDescription("TINV", "\u30b9\u30c1\u30e5\u30fc\u30c7\u30f3\u30c8\u306e t \u5206\u5e03\u306e\u5024\u3092\u3001\u78ba\u7387\u3068\u81ea\u7531\u5ea6\u3092\u4f7f\u7528\u3057\u305f\u95a2\u6570\u3068\u3057\u3066\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("prog"), new ParameterDescription("deg")]), new FunctionDescription("TODAY", "\u73fe\u5728\u306e\u65e5\u4ed8\u3092\u8868\u3059\u9023\u7d9a\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", []), new FunctionDescription("TRANSPOSE", "\u6c34\u5e73\u30bb\u30eb\u7bc4\u56f2\u3092\u5782\u76f4\u30bb\u30eb\u7bc4\u56f2\u3068\u3057\u3066\u8fd4\u3057\u3001\u5782\u76f4\u30bb\u30eb\u7bc4\u56f2\u3092\u6c34\u5e73\u30bb\u30eb\u7bc4\u56f2\u3068\u3057\u3066\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array")]), new FunctionDescription("TREND", "\u56de\u5e30\u76f4\u7dda\u306b\u5bfe\u3057\u3066\u4e88\u6e2c\u3055\u308c\u308b\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("y"), new ParameterDescription("x"), new ParameterDescription("newx"), new ParameterDescription("constant")]), new FunctionDescription("TRIM", "\u6587\u5b57\u5217\u304b\u3089\u4f59\u5206\u306a\u30b9\u30da\u30fc\u30b9\u3092\u524a\u9664\u3057\u3001\u5358\u8a9e\u9593\u306b\uff11\u6587\u5b57\u5206\u306e\u30b9\u30da\u30fc\u30b9\u3092\u4fdd\u3061\u307e\u3059\u3002", [new ParameterDescription("text")]), new FunctionDescription("TRIMMEAN", "\u4e0a\u4f4d\u304a\u3088\u3073\u4e0b\u4f4d\u306e\u30c7\u30fc\u30bf\u3092\u9664\u5916\u3057\u305f\u3001\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u5185\u306e\u4e2d\u9593\u30c7\u30fc\u30bf\u306e\u5e73\u5747\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("percent")]), new FunctionDescription("TRUE", "\u8ad6\u7406\u5024\uff11\uff08True\uff09\u3092\u8fd4\u3057\u307e\u3059\u3002", []), new FunctionDescription("TRUNC", "\u30b9\u30c1\u30e5\u30fc\u30c7\u30f3\u30c8\u306e t \u691c\u5b9a\u306b\u95a2\u9023\u3059\u308b\u78ba\u7387\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("precision")]), new FunctionDescription("TTEST", "\u30b9\u30c1\u30e5\u30fc\u30c7\u30f3\u30c8\u306e t \u691c\u5b9a\u306b\u95a2\u9023\u3059\u308b\u78ba\u7387\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array1"), new ParameterDescription("array2"), new ParameterDescription("tails"), new ParameterDescription("type")]), new FunctionDescription("TYPE", "\u5024\u306e\u30c7\u30fc\u30bf\u578b\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("UPPER", "\u30c6\u30ad\u30b9\u30c8\u3092\u5927\u6587\u5b57\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("string")]), new FunctionDescription("VALUE", "\u6570\u5024\u3092\u8868\u3059\u6587\u5b57\u5217\u3092\u6570\u5024\u306b\u5909\u63db\u3057\u307e\u3059\u3002", [new ParameterDescription("text")]), new FunctionDescription("VAR", "\u5f15\u6570\u5024\u3092\u6bcd\u96c6\u56e3\u306e\u6a19\u672c\u3068\u307f\u306a\u3057\u3001\u6bcd\u96c6\u56e3\u306e\u5206\u6563\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("VARA", "\u5f15\u6570\u5024\u3092\u6bcd\u96c6\u56e3\u306e\u6a19\u672c\u3068\u307f\u306a\u3057\u3001\u6bcd\u96c6\u56e3\u306e\u5206\u6563\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("VARP", "\u6bcd\u96c6\u56e3\u5168\u4f53\u306e\u5206\u6563\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("VARPA", "\u6bcd\u96c6\u56e3\u5168\u4f53\u306e\u5206\u6563\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("VDB", "\u500d\u7387\u6cd5\u3092\u4f7f\u7528\u3057\u3066\u3001\u6307\u5b9a\u3057\u305f\u4efb\u610f\u306e\u671f\u9593\u306b\u304a\u3051\u308b\u8cc7\u7523\u306e\u6e1b\u4fa1\u511f\u5374\u8cbb\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("cost"), new ParameterDescription("salvage"), new ParameterDescription("life"), new ParameterDescription("start"), new ParameterDescription("end"), new ParameterDescription("factor"), new ParameterDescription("switchnot")]), new FunctionDescription("VLOOKUP", "\u6307\u5b9a\u7bc4\u56f2\u306e\u6700\u5de6\u5217\u304b\u3089\u5024\u3092\u691c\u7d22\u3057\u3001\u6307\u5b9a\u306e\u5217\u304b\u3089\u3001\u3053\u306e\u5024\u3068\u540c\u3058\u884c\u5185\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("array"), new ParameterDescription("colindex"), new ParameterDescription("approx")]), new FunctionDescription("WEEKDAY", "\u6307\u5b9a\u306e\u65e5\u4ed8\u306b\u5bfe\u5fdc\u3059\u308b\u66dc\u65e5\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("date"), new ParameterDescription("type")]), new FunctionDescription("WEEKNUM", "\u6307\u5b9a\u306e\u65e5\u4ed8\u304c\u305d\u306e\u5e74\u306e\u4f55\u9031\u76ee\u306b\u5f53\u305f\u308b\u304b\u3092\u8868\u3059\u6570\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("date"), new ParameterDescription("weektype")]), new FunctionDescription("WEIBULL", "\uff12\u3064\u306e\u30d1\u30e9\u30e1\u30fc\u30bf\u306b\u3088\u308b\u30ef\u30a4\u30d6\u30eb\u5206\u5e03\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002\u3053\u308c\u306f\u3001\u4fe1\u983c\u6027\u306e\u5206\u6790\u306a\u3069\u306b\u3088\u304f\u4f7f\u7528\u3055\u308c\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("cumulative")]), new FunctionDescription("WORKDAY", "\u958b\u59cb\u65e5\u3088\u308a\u6307\u5b9a\u306e\u65e5\u6570\u5206\u4ee5\u524d\u307e\u305f\u306f\u4ee5\u964d\u306e\u7a3c\u50cd\u65e5\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("startdate"), new ParameterDescription("numdays"), new ParameterDescription("holidays")]), new FunctionDescription("XIRR", "\u4e88\u5b9a\u3055\u308c\u3066\u3044\u308b\u30ad\u30e3\u30c3\u30b7\u30e5\u30d5\u30ed\u30fc\uff08\u5b9a\u671f\u7684\u3001\u307e\u305f\u306f\u4e0d\u5b9a\u671f\uff09\u306b\u57fa\u3065\u304d\u3001\u5185\u90e8\u5229\u76ca\u7387\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("values"), new ParameterDescription("dates"), new ParameterDescription("guess")]), new FunctionDescription("XNPV", "\u4e88\u5b9a\u3055\u308c\u3066\u3044\u308b\u30ad\u30e3\u30c3\u30b7\u30e5\u30d5\u30ed\u30fc\uff08\u5b9a\u671f\u7684\u3001\u307e\u305f\u306f\u4e0d\u5b9a\u671f\uff09\u306b\u57fa\u3065\u304d\u3001\u6b63\u5473\u73fe\u5728\u4fa1\u5024\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("rate"), new ParameterDescription("values"), new ParameterDescription("dates")]), new FunctionDescription("YEAR", "\u6307\u5b9a\u306e\u65e5\u4ed8\u306b\u5bfe\u5fdc\u3059\u308b\u5e74\u3092\u8868\u3059\u6574\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("date")]), new FunctionDescription("YEARFRAC", "\u958b\u59cb\u65e5\u304b\u3089\u7d42\u4e86\u65e5\u307e\u3067\u306e\u671f\u9593\u5185\u306e\u5b8c\u5168\u306a\u65e5\u6570\u304c\u3001\uff11\u5e74\u306e\u3069\u308c\u3060\u3051\u3092\u5360\u3081\u308b\u304b\u3092\u8868\u3059\u5272\u5408\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("startdate"), new ParameterDescription("enddate"), new ParameterDescription("basis")]), new FunctionDescription("YIELD", "\u5b9a\u671f\u7684\u306b\u5229\u606f\u304c\u652f\u6255\u308f\u308c\u308b\u8a3c\u5238\u306e\u5229\u56de\u308a\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("rate"), new ParameterDescription("price"), new ParameterDescription("redeem"), new ParameterDescription("frequency"), new ParameterDescription("basis")]), new FunctionDescription("YIELDDISC", "\u5272\u5f15\u50b5\u306e\u5e74\u5229\u56de\u308a\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("price"), new ParameterDescription("redeem"), new ParameterDescription("basis")]), new FunctionDescription("YIELDMAT", "\u6e80\u671f\u306b\u5229\u606f\u304c\u652f\u6255\u308f\u308c\u308b\u8a3c\u5238\u306e\u5e74\u5229\u56de\u308a\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002", [new ParameterDescription("settle"), new ParameterDescription("maturity"), new ParameterDescription("issue"), new ParameterDescription("issrate"), new ParameterDescription("price"), new ParameterDescription("basis")]), new FunctionDescription("ZTEST", "z \u691c\u5b9a\u306e\u6709\u610f\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002z \u691c\u5b9a\u3067\u306f\u3001\u4e00\u7fa4\u306e\u30c7\u30fc\u30bf\u306b\u5bfe\u3059\u308b\u691c\u5b9a\u5024 x \u306e\u6a19\u6e96\u30b9\u30b3\u30a2\u3092\u751f\u6210\u3057\u3001\u6b63\u898f\u5206\u5e03\u306e\u4e21\u5074\u306e\u78ba\u7387\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("x"), new ParameterDescription("sigma")]), new FunctionDescription("PIESPARKLINE", "\u5186\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("range|percentage"), new ParameterDescription("color", true)]), new FunctionDescription("AREASPARKLINE", "\u9762\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("points"), new ParameterDescription("mini"), new ParameterDescription("maxi"), new ParameterDescription("line1"), new ParameterDescription("line2"), new ParameterDescription("colorPositive"), new ParameterDescription("colorNegative")]), new FunctionDescription("SCATTERSPARKLINE", "\u6563\u5e03\u56f3\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("points1"), new ParameterDescription("points2"), new ParameterDescription("minX"), new ParameterDescription("maxX"), new ParameterDescription("minY"), new ParameterDescription("maxY"), new ParameterDescription("hLine"), new ParameterDescription("vLine"), new ParameterDescription("xMinZone"), new ParameterDescription("xMaxZone"), new ParameterDescription("yMinZone"), new ParameterDescription("yMaxZone"), new ParameterDescription("tags"), new ParameterDescription("drawSymbol"), new ParameterDescription("drawLines"), new ParameterDescription("color1"), new ParameterDescription("color2"), new ParameterDescription("dash")]), new FunctionDescription("LINESPARKLINE", "\u6298\u308c\u7dda\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("data"), new ParameterDescription("dataOrientation"), new ParameterDescription("dateAxisData"), new ParameterDescription("dateAxisOrientation"), new ParameterDescription("setting")]), new FunctionDescription("COLUMNSPARKLINE", "\u7e26\u68d2\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("data"), new ParameterDescription("dataOrientation"), new ParameterDescription("dateAxisData"), new ParameterDescription("dateAxisOrientation"), new ParameterDescription("setting")]), new FunctionDescription("WINLOSSSPARKLINE", "\u52dd\u6557\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("data"), new ParameterDescription("dataOrientation"), new ParameterDescription("dateAxisData"), new ParameterDescription("dateAxisOrientation"), new ParameterDescription("setting")]), new FunctionDescription("BULLETSPARKLINE", "\u30d6\u30ec\u30c3\u30c8\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("measure"), new ParameterDescription("target"), new ParameterDescription("maxi"), new ParameterDescription("good"), new ParameterDescription("bad"), new ParameterDescription("forecast"), new ParameterDescription("tickunit"), new ParameterDescription("colorScheme"), new ParameterDescription("vertical")]), new FunctionDescription("SPREADSPARKLINE", "\u30b9\u30d7\u30ec\u30c3\u30c9\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("points"), new ParameterDescription("showAverage"), new ParameterDescription("scaleStart"), new ParameterDescription("scaleEnd"), new ParameterDescription("style"), new ParameterDescription("colorScheme"), new ParameterDescription("vertical")]), new FunctionDescription("STACKEDSPARKLINE", "\u7a4d\u307f\u4e0a\u3052\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("points"), new ParameterDescription("colorRange"), new ParameterDescription("labelRange"), new ParameterDescription("maximum"), new ParameterDescription("targetRed"), new ParameterDescription("targetGreen"), new ParameterDescription("targetBlue"), new ParameterDescription("tragetYellow"), new ParameterDescription("color"), new ParameterDescription("highlightPosition"), new ParameterDescription("vertical"), new ParameterDescription("textOrientation"), new ParameterDescription("textSize")]), new FunctionDescription("BOXPLOTSPARKLINE", "\u30dc\u30c3\u30af\u30b9\u30d7\u30ed\u30c3\u30c8\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("points"), new ParameterDescription("boxPlotClass"), new ParameterDescription("showAverage"), new ParameterDescription("scaleStart"), new ParameterDescription("scaleEnd"), new ParameterDescription("acceptableStart"), new ParameterDescription("acceptableEnd"), new ParameterDescription("colorScheme"), new ParameterDescription("style"), new ParameterDescription("vertical")]), new FunctionDescription("CASCADESPARKLINE", "\u30ab\u30b9\u30b1\u30fc\u30c9\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("pointsRange"), new ParameterDescription("pointIndex"), new ParameterDescription("labelsRange"), new ParameterDescription("minimum"), new ParameterDescription("maximum"), new ParameterDescription("colorPositive"), new ParameterDescription("colorNegative"), new ParameterDescription("vertical")]), new FunctionDescription("PARETOSPARKLINE", "\u30d1\u30ec\u30fc\u30c8\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("points"), new ParameterDescription("pointIndex"), new ParameterDescription("colorRange"), new ParameterDescription("target"), new ParameterDescription("target2"), new ParameterDescription("highlightPosition"), new ParameterDescription("label"), new ParameterDescription("vertical")]), new FunctionDescription("HBARSPARKLINE", "\u6c34\u5e73\u30d0\u30fc\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("value"), new ParameterDescription("colorScheme")]), new FunctionDescription("VBARSPARKLINE", "\u5782\u76f4\u30d0\u30fc\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("value"), new ParameterDescription("colorScheme")]), new FunctionDescription("VARISPARKLINE", "\u30d0\u30ea\u30b9\u30d1\u30fc\u30af\u30e9\u30a4\u30f3\u3092\u8868\u793a\u3059\u308b\u70ba\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u8fd4\u3057\u307e\u3059", [new ParameterDescription("variance"), new ParameterDescription("reference"), new ParameterDescription("mini"), new ParameterDescription("maxi"), new ParameterDescription("mark"), new ParameterDescription("tickunit"), new ParameterDescription("legend"), new ParameterDescription("colorPositive"), new ParameterDescription("colorNegative"), new ParameterDescription("vertical")]), new FunctionDescription("STDEV.P", "\u5f15\u6570\u3068\u3057\u3066\u6307\u5b9a\u3057\u305f\u6bcd\u96c6\u56e3\u5168\u4f53\u306e\u6a19\u6e96\u504f\u5dee\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("VAR.P", "\u6bcd\u96c6\u56e3\u5168\u4f53\u306e\u5206\u6563\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("COVARIANCE.P", "\uff12\u7d44\u306e\u5bfe\u5fdc\u3059\u308b\u30c7\u30fc\u30bf\u306e\u6a19\u6e96\u504f\u5dee\u306e\u7a4d\u306e\u5e73\u5747\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("MODE.SNGL", "\u6307\u5b9a\u306e\u5f15\u6570\u30ea\u30b9\u30c8\u306e\u4e2d\u3067\u3001\u6700\u3082\u983b\u7e41\u306b\u51fa\u73fe\u3059\u308b\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("PERCENTILE.INC", "\u3042\u308b\u7bc4\u56f2\u5185\u306e\u5024\u306e\u4e2d\u3067 n \u756a\u76ee\u306e\u767e\u5206\u4f4d\u3092\u6301\u3064\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("n")]), new FunctionDescription("QUARTILE.INC", "\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u304b\u3089\u3001\u6307\u5b9a\u3057\u305f\u56db\u5206\u4f4d\u6570\uff08\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u306e 1/4\uff3b25%\uff3d\uff09\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("quart")]), new FunctionDescription("RANK.EQ", "\u6570\u5024\u30ea\u30b9\u30c8\u306e\u4e2d\u304b\u3089\u3001\u6307\u5b9a\u306e\u6570\u5024\u304c\u4f55\u756a\u76ee\u306b\u4f4d\u7f6e\u3059\u308b\u304b\u3092\u8fd4\u3057\u307e\u3059\u3002RANK \u95a2\u6570\u306e\u8fd4\u3059\u9806\u4f4d\u306f\u3001\u30ea\u30b9\u30c8\u5185\u306e\u6570\u5024\u3092\u4e26\u3079\u66ff\u3048\u305f\u5834\u5408\u306e\u6570\u5024\u306e\u9806\u4f4d\u3068\u306a\u308a\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("array"), new ParameterDescription("order")]), new FunctionDescription("VAR.S", "\u5f15\u6570\u5024\u3092\u6bcd\u96c6\u56e3\u306e\u6a19\u672c\u3068\u307f\u306a\u3057\u3001\u6bcd\u96c6\u56e3\u306e\u5206\u6563\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value1"), new ParameterDescription("value2", true)]), new FunctionDescription("BETA.INV", "\u7d2f\u7a4d\u03b2\u78ba\u7387\u5bc6\u5ea6\u95a2\u6570\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("prob"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("lower"), new ParameterDescription("upper")]), new FunctionDescription("BINOM.DIST", "\u500b\u5225\u9805\u306e\u4e8c\u9805\u5206\u5e03\u306e\u78ba\u7387\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("n"), new ParameterDescription("p"), new ParameterDescription("cumulative")]), new FunctionDescription("BINOM.INV", "\u7d2f\u7a4d\u4e8c\u9805\u5206\u5e03\u306e\u5024\u304c\u57fa\u6e96\u5024\u4ee5\u4e0a\u3068\u306a\u308b\u6700\u5c0f\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("n"), new ParameterDescription("p"), new ParameterDescription("alpha")]), new FunctionDescription("CHISQ.DIST.RT", "\u7247\u5074\u30ab\u30a4\uff12\u4e57\u5206\u5e03\u306e\u78ba\u7387\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("deg")]), new FunctionDescription("CHISQ.INV.RT", "\u7247\u5074\u30ab\u30a4\uff12\u4e57\u5206\u5e03\u78ba\u7387\u306e\u9006\u95a2\u6570\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("prob"), new ParameterDescription("deg")]), new FunctionDescription("CHISQ.TEST", "\u30ab\u30a4\uff12\u4e57\u5206\u5e03\u304b\u3089\u306e\u72ec\u7acb\u6027\u3092\u691c\u5b9a\u3057\u307e\u3059\u3002", [new ParameterDescription("obs_array"), new ParameterDescription("exp_array")]), new FunctionDescription("CONFIDENCE.NORM", "\u6bcd\u96c6\u56e3\u306e\u5e73\u5747\u5024\u306b\u5bfe\u3059\u308b\u4fe1\u983c\u533a\u9593\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("alpha"), new ParameterDescription("stdev"), new ParameterDescription("size")]), new FunctionDescription("EXPON.DIST", "\u6307\u6570\u5206\u5e03\u95a2\u6570\u307e\u305f\u306f\u78ba\u7387\u5bc6\u5ea6\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("lambda"), new ParameterDescription("cumulative")]), new FunctionDescription("F.DIST.RT", "\uff12\u7d44\u306e\u30c7\u30fc\u30bf\u9593\u306e\u5206\u6563\u5ea6\u3092\u6bd4\u8f03\u3059\u308b F \u78ba\u7387\u5206\u5e03\u95a2\u6570\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("value"), new ParameterDescription("degnum"), new ParameterDescription("degden")]), new FunctionDescription("F.INV.RT", "F \u78ba\u7387\u5206\u5e03\u95a2\u6570\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002p = FDIST(x,...) \u3067\u3042\u308b\u3068\u304d\u3001FINV(p,...) = x \u3068\u306a\u308a\u307e\u3059\u3002", [new ParameterDescription("p"), new ParameterDescription("degnum"), new ParameterDescription("degden")]), new FunctionDescription("F.TEST", "F \u691c\u5b9a\u306e\u7d50\u679c\u3092\u8fd4\u3057\u307e\u3059\u3002\u3053\u308c\u306f\u3001\uff12\u3064\u306e\u914d\u5217\u5185\u306e\u30c7\u30fc\u30bf\u306e\u5206\u6563\u306b\u6709\u610f\u306a\u5dee\u304c\u8a8d\u3081\u3089\u308c\u306a\u3044\u7247\u5074\u78ba\u7387\u306e\u7b97\u51fa\u7d50\u679c\u3067\u3059\u3002", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("GAMMA.DIST", "\u30ac\u30f3\u30de\u5206\u5e03\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("cumulative")]), new FunctionDescription("GAMMA.INV", "\u30ac\u30f3\u30de\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002p = GAMMADIST(x,...) \u3067\u3042\u308b\u3068\u304d\u3001GAMMAINV(p,...) = x \u3068\u306a\u308a\u307e\u3059\u3002", [new ParameterDescription("p"), new ParameterDescription("alpha"), new ParameterDescription("beta")]), new FunctionDescription("LOGNORM.INV", "x \u306e\u5bfe\u6570\u6b63\u898f\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("prob"), new ParameterDescription("mean"), new ParameterDescription("stdev")]), new FunctionDescription("NORM.DIST", "\u6307\u5b9a\u306e\u5e73\u5747\u3068\u6a19\u6e96\u504f\u5dee\u306b\u5bfe\u3059\u308b\u6b63\u898f\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("mean"), new ParameterDescription("stdev"), new ParameterDescription("cumulative")]), new FunctionDescription("NORM.INV", "\u6307\u5b9a\u306e\u5e73\u5747\u3068\u6a19\u6e96\u504f\u5dee\u306b\u5bfe\u3059\u308b\u6b63\u898f\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("prob"), new ParameterDescription("mean"), new ParameterDescription("stdev")]), new FunctionDescription("NORM.S.INV", "\u6a19\u6e96\u6b63\u898f\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u9006\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002\u3053\u306e\u5206\u5e03\u3067\u306f\u3001\u5e73\u5747\u304c\uff10\u3001\u6a19\u6e96\u504f\u5dee\u304c\uff11\u3068\u306a\u308a\u307e\u3059\u3002", [new ParameterDescription("prob")]), new FunctionDescription("PERCENTRANK.INC", "\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u5185\u306e\u5024\u306e\u9806\u4f4d\u3092\u3001\u3053\u306e\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u5185\u306e\u767e\u5206\u7387\u3068\u3057\u3066\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("n"), new ParameterDescription("signif")]), new FunctionDescription("POISSON.DIST", "\u30dd\u30a2\u30bd\u30f3\u78ba\u7387\u5206\u5e03\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("nevents"), new ParameterDescription("mean"), new ParameterDescription("cumulative")]), new FunctionDescription("T.INV.2T", "\u30b9\u30c1\u30e5\u30fc\u30c7\u30f3\u30c8\u306e t \u5206\u5e03\u306e\u5024\u3092\u3001\u78ba\u7387\u3068\u81ea\u7531\u5ea6\u3092\u4f7f\u7528\u3057\u305f\u95a2\u6570\u3068\u3057\u3066\u7b97\u51fa\u3057\u307e\u3059\u3002", [new ParameterDescription("prog"), new ParameterDescription("deg")]), new FunctionDescription("T.TEST", "\u30b9\u30c1\u30e5\u30fc\u30c7\u30f3\u30c8\u306e t \u691c\u5b9a\u306b\u95a2\u9023\u3059\u308b\u78ba\u7387\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array1"), new ParameterDescription("array2"), new ParameterDescription("tails"), new ParameterDescription("type")]), new FunctionDescription("WEIBULL.DIST", "\uff12\u3064\u306e\u30d1\u30e9\u30e1\u30fc\u30bf\u306b\u3088\u308b\u30ef\u30a4\u30d6\u30eb\u5206\u5e03\u306e\u5024\u3092\u7b97\u51fa\u3057\u307e\u3059\u3002\u3053\u308c\u306f\u3001\u4fe1\u983c\u6027\u306e\u5206\u6790\u306a\u3069\u306b\u3088\u304f\u4f7f\u7528\u3055\u308c\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("cumulative")]), new FunctionDescription("Z.TEST", "z \u691c\u5b9a\u306e\u6709\u610f\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002z \u691c\u5b9a\u3067\u306f\u3001\u4e00\u7fa4\u306e\u30c7\u30fc\u30bf\u306b\u5bfe\u3059\u308b\u691c\u5b9a\u5024 x \u306e\u6a19\u6e96\u30b9\u30b3\u30a2\u3092\u751f\u6210\u3057\u3001\u6b63\u898f\u5206\u5e03\u306e\u4e21\u5074\u306e\u78ba\u7387\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("x"), new ParameterDescription("sigma")]), new FunctionDescription("T.DIST.RT", "\u30b9\u30c1\u30e5\u30fc\u30c7\u30f3\u30c8\u306e\u53f3\u5074 t \u5206\u5e03\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("deg")]), new FunctionDescription("T.DIST.2T", "\u30b9\u30c1\u30e5\u30fc\u30c7\u30f3\u30c8\u306e\u4e21\u5074 t \u5206\u5e03\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("deg")]), new FunctionDescription("STDEV", "\u5f15\u6570\u3092\u6a19\u672c\u3068\u898b\u306a\u3057\u3001\u6a19\u672c\u306b\u57fa\u3065\u3044\u3066\u6bcd\u96c6\u56e3\u306e\u6a19\u6e96\u504f\u5dee\u306e\u63a8\u5b9a\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("number1"), new ParameterDescription("number2", true)]), new FunctionDescription("STDEV.S", "\u5f15\u6570\u3092\u6a19\u672c\u3068\u898b\u306a\u3057\u3001\u6a19\u672c\u306b\u57fa\u3065\u3044\u3066\u6bcd\u96c6\u56e3\u306e\u6a19\u6e96\u504f\u5dee\u306e\u63a8\u5b9a\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("number1"), new ParameterDescription("number2", true)]), new FunctionDescription("CEILING.PRECISE", "\u6307\u5b9a\u3055\u308c\u305f\u57fa\u6e96\u5024\u306e\u500d\u6570\u306e\u3046\u3061\u3001\u6700\u3082\u8fd1\u3044\u5024\u306b\u6570\u5024\u3092\u5207\u308a\u4e0a\u3052\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("signif")]), new FunctionDescription("COVARIANCE.S", "\u6a19\u672c\u306e\u5171\u5206\u6563\u3092\u8fd4\u3057\u307e\u3059\u3002\u5171\u5206\u6563\u3068\u306f\u30012 \u7d44\u306e\u5bfe\u5fdc\u3059\u308b\u30c7\u30fc\u30bf\u9593\u3067\u306e\u6a19\u6e96\u504f\u5dee\u306e\u7a4d\u306e\u5e73\u5747\u5024\u3067\u3059\u3002", [new ParameterDescription("array1"), new ParameterDescription("array2")]), new FunctionDescription("FLOOR.PRECISE", "\u6307\u5b9a\u3055\u308c\u305f\u57fa\u6e96\u5024\u306e\u500d\u6570\u306e\u3046\u3061\u3001\u6700\u3082\u8fd1\u3044\u5024\u306b\u6570\u5024\u3092\u5207\u308a\u4e0a\u3052\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("signif")]), new FunctionDescription("PERCENTILE.EXC", "\u7279\u5b9a\u306e\u7bc4\u56f2\u306b\u542b\u307e\u308c\u308b\u30c7\u30fc\u30bf\u306e\u7b2c n \u767e\u5206\u4f4d\u6570\u306b\u5f53\u305f\u308b\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("n")]), new FunctionDescription("QUARTILE.EXC", "0 \u3088\u308a\u5927\u304d\u304f 1 \u3088\u308a\u5c0f\u3055\u3044\u767e\u5206\u4f4d\u5024\u306b\u57fa\u3065\u3044\u3066\u3001\u914d\u5217\u306b\u542b\u307e\u308c\u308b\u30c7\u30fc\u30bf\u304b\u3089\u56db\u5206\u4f4d\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("quart")]), new FunctionDescription("RANK.AVG", "\u6570\u5024\u306e\u30ea\u30b9\u30c8\u306e\u4e2d\u3067\u3001\u6307\u5b9a\u3057\u305f\u6570\u5024\u306e\u5e8f\u5217\u3092\u8fd4\u3057\u307e\u3059\u3002\u30ea\u30b9\u30c8\u306e\u4e2d\u306b\u540c\u3058\u6570\u5024\u304c\u5b58\u5728\u3059\u308b\u5834\u5408\u3001\u5e73\u5747\u306e\u9806\u4f4d\u304c\u8fd4\u3055\u308c\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("array"), new ParameterDescription("order")]), new FunctionDescription("MODE.MULT", "\u914d\u5217\u307e\u305f\u306f\u30bb\u30eb\u7bc4\u56f2\u3068\u3057\u3066\u6307\u5b9a\u3055\u308c\u305f\u30c7\u30fc\u30bf\u306e\u4e2d\u3067\u3001\u6700\u3082\u983b\u7e41\u306b\u51fa\u73fe\u3059\u308b\u5024 (\u6700\u983b\u5024) \u3092\u7e26\u65b9\u5411\u306e\u914d\u5217\u3068\u3057\u3066\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("number1"), new ParameterDescription("number2", true)]), new FunctionDescription("ISO.CEILING", "\u6700\u3082\u8fd1\u3044\u6574\u6570\u306b\u5207\u308a\u4e0a\u3052\u305f\u5024\u3001\u307e\u305f\u306f\u3001\u6307\u5b9a\u3055\u308c\u305f\u57fa\u6e96\u5024\u306e\u500d\u6570\u306e\u3046\u3061\u6700\u3082\u8fd1\u3044\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("number"), new ParameterDescription("signif")]), new FunctionDescription("BETA.DIST", "\u03b2 \u5206\u5e03\u306e\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("alpha"), new ParameterDescription("beta"), new ParameterDescription("cumulative"), new ParameterDescription("lower"), new ParameterDescription("upper")]), new FunctionDescription("GAMMALN.PRECISE", "\u30ac\u30f3\u30de\u95a2\u6570\u306e\u5024\u306e\u81ea\u7136\u5bfe\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("value")]), new FunctionDescription("ERF.PRECISE", "\u8aa4\u5dee\u95a2\u6570\u306e\u7a4d\u5206\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("lowerlimit")]), new FunctionDescription("ERFC.PRECISE", "x \uff5e\u7121\u9650\u5927\u306e\u7bc4\u56f2\u3067\u3001\u76f8\u88dc\u8aa4\u5dee\u95a2\u6570\u306e\u7a4d\u5206\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("lowerlimit")]), new FunctionDescription("PERCENTRANK.EXC", "\u914d\u5217\u5185\u3067\u306e\u5024\u306e\u9806\u4f4d\u3092\u767e\u5206\u7387 (0 \u3088\u308a\u5927\u304d\u304f 1 \u3088\u308a\u5c0f\u3055\u3044) \u3067\u8868\u3057\u305f\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("array"), new ParameterDescription("n"), new ParameterDescription("signif")]), new FunctionDescription("HYPGEOM.DIST", "\u8d85\u5e7e\u4f55\u5206\u5e03\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("n"), new ParameterDescription("M"), new ParameterDescription("N"), new ParameterDescription("cumulative")]), new FunctionDescription("LOGNORM.DIST", "\u5bfe\u6570\u6b63\u898f\u5206\u5e03\u306e\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("mean"), new ParameterDescription("stdev"), new ParameterDescription("cumulative")]), new FunctionDescription("NEGBINOM.DIST", "\u8ca0\u306e\u4e8c\u9805\u5206\u5e03\u306e\u78ba\u7387\u95a2\u6570\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("r"), new ParameterDescription("p"), new ParameterDescription("cumulative")]), new FunctionDescription("NORM.S.DIST", "\u6a19\u6e96\u6b63\u898f\u5206\u5e03\u306e\u7d2f\u7a4d\u5206\u5e03\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("z"), new ParameterDescription("cumulative")]), new FunctionDescription("T.DIST", "\u30b9\u30c1\u30e5\u30fc\u30c7\u30f3\u30c8\u306e t \u5206\u5e03\u306e\u30d1\u30fc\u30bb\u30f3\u30c6\u30fc\u30b8 (\u78ba\u7387) \u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("deg"), new ParameterDescription("cumulative")]), new FunctionDescription("F.DIST", "F \u5206\u5e03\u306e\u78ba\u7387\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("degnum"), new ParameterDescription("degden"), new ParameterDescription("cumulative")]), new FunctionDescription("CHISQ.DIST", "\u7d2f\u7a4d \u03b2 \u78ba\u7387\u5bc6\u5ea6\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("x"), new ParameterDescription("deg"), new ParameterDescription("cumulative")]), new FunctionDescription("F.INV", "F \u5206\u5e03\u306e\u78ba\u7387\u95a2\u6570\u306e\u9006\u95a2\u6570\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("probability"), new ParameterDescription("degnum"), new ParameterDescription("degden")]), new FunctionDescription("T.INV", "\u30b9\u30c1\u30e5\u30fc\u30c7\u30f3\u30c8\u306e t \u5206\u5e03\u306e t \u5024\u3092\u3001\u78ba\u7387\u3068\u81ea\u7531\u5ea6\u306e\u95a2\u6570\u3068\u3057\u3066\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("probability"), new ParameterDescription("deg")]), new FunctionDescription("CHISQ.INV", "\u7d2f\u7a4d \u03b2 \u78ba\u7387\u5bc6\u5ea6\u95a2\u6570\u306e\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("probability"), new ParameterDescription("deg")]), new FunctionDescription("CONFIDENCE.T", "\u30b9\u30c1\u30e5\u30fc\u30c7\u30f3\u30c8\u306e t \u5206\u5e03\u3092\u4f7f\u7528\u3057\u3066\u3001\u6bcd\u96c6\u56e3\u306b\u5bfe\u3059\u308b\u4fe1\u983c\u533a\u9593\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("alpha"), new ParameterDescription("stdev"), new ParameterDescription("size")]), new FunctionDescription("NETWORKDAYS.INTL", "\u9031\u672b\u304c\u3069\u306e\u66dc\u65e5\u3067\u4f55\u65e5\u9593\u3042\u308b\u304b\u3092\u793a\u3059\u30d1\u30e9\u30e1\u30fc\u30bf\u30fc\u3092\u4f7f\u7528\u3057\u3066\u3001\u958b\u59cb\u65e5\u3068\u7d42\u4e86\u65e5\u306e\u9593\u306b\u3042\u308b\u7a3c\u50cd\u65e5\u306e\u65e5\u6570\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("startdate"), new ParameterDescription("enddate"), new ParameterDescription("weekend"), new ParameterDescription("holidays")]), new FunctionDescription("WORKDAY.INTL", "\u9031\u672b\u304c\u3069\u306e\u66dc\u65e5\u3067\u4f55\u65e5\u9593\u3042\u308b\u304b\u3092\u793a\u3059\u30d1\u30e9\u30e1\u30fc\u30bf\u30fc\u3092\u4f7f\u7528\u3057\u3066\u3001\u958b\u59cb\u65e5\u304b\u3089\u8d77\u7b97\u3057\u3066\u6307\u5b9a\u3057\u305f\u7a3c\u50cd\u65e5\u6570\u3060\u3051\u524d\u307e\u305f\u306f\u5f8c\u306e\u65e5\u4ed8\u306b\u5bfe\u5fdc\u3059\u308b\u30b7\u30ea\u30a2\u30eb\u5024\u3092\u8fd4\u3057\u307e\u3059\u3002", [new ParameterDescription("startdate"), new ParameterDescription("numdays"), new ParameterDescription("weekend"), new ParameterDescription("holidays")])];
                return FormulaTextBoxResource_JP
            })();
        Sheets.FormulaTextBoxResource_JP = FormulaTextBoxResource_JP
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

