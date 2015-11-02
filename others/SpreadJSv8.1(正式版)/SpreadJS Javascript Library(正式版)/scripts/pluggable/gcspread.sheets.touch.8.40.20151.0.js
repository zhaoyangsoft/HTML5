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
        Sheets.feature("touch", ["core.common", "core.sheet_action", "core.sheet_model", "core.sheet_border"]);
        var keyword_null = null,
            keyword_undefined = undefined,
            Math_abs = Math.abs,
            Math_min = Math.min,
            Math_max = Math.max,
            Math_pow = Math.pow,
            Math_atan2 = Math.atan2,
            Math_PI = Math.PI,
            Math_round = Math.round,
            Math_sqrt = Math.sqrt,
            Math_atan = Math.atan,
            Math_log = Math.log,
            Math_floor = Math.floor,
            const_undefined = "undefined",
            const_toolbar_offset = 100;
        var TouchEventProvider = (function()
            {
                function TouchEventProvider()
                {
                    var self = this;
                    self._elements = [];
                    self._pressedPointers = {length: 0};
                    self._checkPointerIntervalId = -1;
                    self._manipulationProcessor = new ManipulationProcessor;
                    self._tapEventProcesser = new TapEventProcesser
                }
                TouchEventProvider.prototype.ManipulationStarting = function(handler)
                {
                    var manipulationProcessor = this._manipulationProcessor;
                    if (manipulationProcessor)
                    {
                        manipulationProcessor.ManipulationStarting = handler
                    }
                };
                TouchEventProvider.prototype.ManipulationStarted = function(handler)
                {
                    var manipulationProcessor = this._manipulationProcessor;
                    if (manipulationProcessor)
                    {
                        manipulationProcessor.ManipulationStarted = handler
                    }
                };
                TouchEventProvider.prototype.ManipulationCompleted = function(handler)
                {
                    var self = this,
                        manipulationProcessor = self._manipulationProcessor;
                    if (manipulationProcessor)
                    {
                        manipulationProcessor.ManipulationCompleted = function(e)
                        {
                            if (handler)
                            {
                                handler(e);
                                var touchMouseMessageFilter = self._touchMouseMessageFilter;
                                if (touchMouseMessageFilter)
                                {
                                    touchMouseMessageFilter.postProcessManipulationComplete()
                                }
                            }
                        }
                    }
                };
                TouchEventProvider.prototype.ManipulationInertiaStarting = function(handler)
                {
                    var manipulationProcessor = this._manipulationProcessor;
                    if (manipulationProcessor)
                    {
                        manipulationProcessor.ManipulationInertiaStarting = handler
                    }
                };
                TouchEventProvider.prototype.ManipulationDelta = function(handler)
                {
                    var manipulationProcessor = this._manipulationProcessor;
                    if (manipulationProcessor)
                    {
                        manipulationProcessor.ManipulationDelta = handler
                    }
                };
                TouchEventProvider.prototype.Tapped = function(handler)
                {
                    var tapEventProcesser = this._tapEventProcesser;
                    if (tapEventProcesser)
                    {
                        tapEventProcesser.Tapped = handler
                    }
                };
                TouchEventProvider.prototype.DoubleTapped = function(handler)
                {
                    var tapEventProcesser = this._tapEventProcesser;
                    if (tapEventProcesser)
                    {
                        tapEventProcesser.DoubleTapped = handler
                    }
                };
                TouchEventProvider.prototype.RightTapped = function(handler)
                {
                    var tapEventProcesser = this._tapEventProcesser;
                    if (tapEventProcesser)
                    {
                        tapEventProcesser.RightTapped = handler
                    }
                };
                TouchEventProvider.prototype.TouchOperatorStart = function(handler)
                {
                    this.touchOperatorStart = handler
                };
                TouchEventProvider.prototype.TouchOperatorEnd = function(handler)
                {
                    this.touchOperatorEnd = handler
                };
                TouchEventProvider.prototype._getOffsetRelativeToDownElement = function(target, targetElement)
                {
                    var offset = {
                            left: 0, top: 0
                        };
                    var element;
                    if (targetElement)
                    {
                        element = targetElement.element
                    }
                    else
                    {
                        element = this._downElement.element
                    }
                    if (target !== element)
                    {
                        var targetOffset = $(target).offset(),
                            canvasOffset = $(element).offset();
                        offset.left = targetOffset.left - canvasOffset.left;
                        offset.top = targetOffset.top - canvasOffset.top
                    }
                    return offset
                };
                TouchEventProvider.prototype.msPointerDown = function(element, e)
                {
                    if (e.pointerType === e.MSPOINTER_TYPE_TOUCH || e.pointerType === "touch")
                    {
                        var offset = this._getOffsetRelativeToDownElement(e.target, element);
                        var needHandle = this._down(element, e.target, e.pointerId, new TouchPoint(e.offsetX + offset.left, e.offsetY + offset.top), e.timeStamp);
                        if (needHandle)
                        {
                            Sheets.util.cancelDefault(e)
                        }
                        if (this._downElement.eventFlag === "sheet")
                        {
                            var canvasOffsetLeft = e.pageX - (e.offsetX + offset.left),
                                canvasOffsetTop = e.pageY - (e.offsetY + offset.top);
                            window.gcGlobal.canvasOffset = {
                                top: canvasOffsetTop, left: canvasOffsetLeft
                            }
                        }
                    }
                };
                TouchEventProvider.prototype.msPointerMove = function(e)
                {
                    if (e.pointerType === e.MSPOINTER_TYPE_TOUCH || e.pointerType === "touch")
                    {
                        if (this._pressedPointers[e.pointerId] === keyword_undefined)
                        {
                            return false
                        }
                        var offset = this._getOffsetRelativeToDownElement(e.target);
                        var needHandle = this._move(e.pointerId, new TouchPoint(e.offsetX + offset.left, e.offsetY + offset.top), e.timeStamp);
                        if (needHandle)
                        {
                            Sheets.util.cancelDefault(e)
                        }
                    }
                };
                TouchEventProvider.prototype.msPointerUp = function(e)
                {
                    if (e.pointerType === e.MSPOINTER_TYPE_TOUCH || e.pointerType === "touch")
                    {
                        if (this._pressedPointers[e.pointerId] === keyword_undefined)
                        {
                            return false
                        }
                        var offset = this._getOffsetRelativeToDownElement(e.target);
                        var needHandle = this._up(e.pointerId, new TouchPoint(e.offsetX + offset.left, e.offsetY + offset.top));
                        if (needHandle)
                        {
                            Sheets.util.cancelDefault(e)
                        }
                    }
                };
                TouchEventProvider.prototype.msPointerCancel = function(e)
                {
                    if (e.pointerType === e.MSPOINTER_TYPE_TOUCH || e.pointerType === "touch")
                    {
                        if (this._pressedPointers[e.pointerId] === keyword_undefined)
                        {
                            return false
                        }
                        var offset = this._getOffsetRelativeToDownElement(e.target);
                        var needHandle = this._cancel(e.pointerId, new TouchPoint(e.offsetX + offset.left, e.offsetY + offset.top));
                        if (needHandle)
                        {
                            Sheets.util.cancelDefault(e)
                        }
                    }
                };
                TouchEventProvider.prototype._getElementOffset = function(element)
                {
                    var t = $(element).offset();
                    if (t)
                    {
                        if (!isNaN(document.body.clientTop))
                        {
                            t.top += document.body.clientTop
                        }
                        if (!isNaN(document.body.clientLeft))
                        {
                            t.left += document.body.clientLeft
                        }
                    }
                    else
                    {
                        t = {
                            top: 0, left: 0
                        }
                    }
                    return t
                };
                TouchEventProvider.prototype.touchStart = function(element, e)
                {
                    var canvasOffset = this._getElementOffset(element.element);
                    var needHandle = false;
                    for (var i = 0; i < e.changedTouches.length; i++)
                    {
                        var touch = e.changedTouches[i];
                        var timeStamp = $.browser.mozilla ? (new Date).valueOf() : e.timeStamp;
                        needHandle = this._down(element, e.target, touch.identifier, new TouchPoint(touch.pageX - canvasOffset.left, touch.pageY - canvasOffset.top), timeStamp) || needHandle
                    }
                    if (needHandle)
                    {
                        Sheets.util.cancelDefault(e)
                    }
                };
                TouchEventProvider.prototype.touchMove = function(e)
                {
                    var canvasOffset = this._getElementOffset(this._downElement.element);
                    var needHandle = false;
                    for (var i = 0; i < e.changedTouches.length; i++)
                    {
                        var touch = e.changedTouches[i];
                        var timeStamp = $.browser.mozilla ? (new Date).valueOf() : e.timeStamp;
                        needHandle = this._move(touch.identifier, new TouchPoint(touch.pageX - canvasOffset.left, touch.pageY - canvasOffset.top), timeStamp) || needHandle
                    }
                    if (needHandle)
                    {
                        Sheets.util.cancelDefault(e)
                    }
                };
                TouchEventProvider.prototype.touchEnd = function(e)
                {
                    var canvasOffset = this._getElementOffset(this._downElement.element);
                    var needHandle = false;
                    for (var i = 0; i < e.changedTouches.length; i++)
                    {
                        var touch = e.changedTouches[i];
                        needHandle = this._up(touch.identifier, new TouchPoint(touch.pageX - canvasOffset.left, touch.pageY - canvasOffset.top)) || needHandle
                    }
                    if (needHandle)
                    {
                        Sheets.util.cancelDefault(e)
                    }
                };
                TouchEventProvider.prototype.touchCancel = function(e)
                {
                    var canvasOffset = this._getElementOffset(this._downElement.element);
                    var needHandle = false;
                    for (var i = 0; i < e.changedTouches.length; i++)
                    {
                        var touch = e.changedTouches[i];
                        needHandle = this._cancel(touch.identifier, new TouchPoint(touch.pageX - canvasOffset.left, touch.pageY - canvasOffset.top)) || needHandle
                    }
                    if (needHandle)
                    {
                        Sheets.util.cancelDefault(e)
                    }
                };
                TouchEventProvider.prototype._startCheckPointer = function()
                {
                    if (this._checkPointerIntervalId !== -1)
                    {
                        return
                    }
                    this._checkPointerIntervalId = setInterval(this._checkCancelPointer, 200)
                };
                TouchEventProvider.prototype._endCheckPointer = function()
                {
                    if (this._checkPointerIntervalId !== -1)
                    {
                        clearInterval(this._checkPointerIntervalId);
                        this._checkPointerIntervalId = -1
                    }
                };
                TouchEventProvider.prototype._checkCancelPointer = function()
                {
                    var self = this;
                    if (self._manipulationProcessor && self._manipulationProcessor._process === 3)
                    {
                        return
                    }
                    var currentTime = (new Date).valueOf();
                    var needRemoveIds = [];
                    var pointers = self._pressedPointers;
                    var length = 0;
                    for (var id in pointers)
                    {
                        if (currentTime - pointers[id].time > 200)
                        {
                            needRemoveIds.push(pointers[id])
                        }
                        length++
                    }
                    for (var i = 0; i < needRemoveIds.length; i++)
                    {
                        self._cancel(needRemoveIds[i].id, needRemoveIds[i].position);
                        delete pointers[needRemoveIds[i].id]
                    }
                    if (length === needRemoveIds.length)
                    {
                        self._endCheckPointer()
                    }
                };
                TouchEventProvider.prototype._fixPosition = function(position)
                {
                    var self = this;
                    if (self._downElement === self._manipulationElement)
                    {
                        return position
                    }
                    var downElementOffset = $(self._downElement.element).offset();
                    var manipulationElementOffset = $(self._manipulationElement.element).offset();
                    position.X += (downElementOffset.left - manipulationElementOffset.left);
                    position.Y += (downElementOffset.top - manipulationElementOffset.top)
                };
                TouchEventProvider.prototype._setCaptureElement = function(element, sourceElement)
                {
                    var self = this,
                        elements = self._elements;
                    self._manipulationElement = keyword_null;
                    self._touchMouseMessageFilter = keyword_null;
                    for (var i = 0; i < elements.length; i++)
                    {
                        if (elements[i] === element)
                        {
                            var downElement = elements[i];
                            var manipulationElement = keyword_null;
                            var tapElement = keyword_null;
                            if (downElement.canDoManipulation && !downElement.canDoManipulation())
                            {
                                for (var i = 0; i < elements.length; i++)
                                {
                                    var tmpElement = elements[i];
                                    if (tmpElement !== downElement && tmpElement.level >= 0 && tmpElement.level < downElement.level && (!tmpElement.canDoManipulation || tmpElement.canDoManipulation()))
                                    {
                                        manipulationElement = tmpElement;
                                        break
                                    }
                                }
                                if (manipulationElement === keyword_null)
                                {
                                    return false
                                }
                            }
                            if (downElement.canDoTap && !downElement.canDoTap())
                            {
                                for (var i = 0; i < elements.length; i++)
                                {
                                    var tmpElement = elements[i];
                                    if (tmpElement !== downElement && tmpElement.level >= 0 && tmpElement.level < downElement.level && (!tmpElement.canDoTap || tmpElement.canDoTap()))
                                    {
                                        tapElement = tmpElement;
                                        break
                                    }
                                }
                                if (tapElement === keyword_null)
                                {
                                    return false
                                }
                            }
                            if (manipulationElement === keyword_null)
                            {
                                manipulationElement = downElement
                            }
                            if (tapElement === keyword_null)
                            {
                                tapElement = downElement
                            }
                            self._downElement = downElement;
                            self._manipulationElement = manipulationElement;
                            self._tapElement = tapElement;
                            self.ManipulationStarting(manipulationElement.manipulationStarting || keyword_null);
                            self.ManipulationStarted(manipulationElement.manipulationStarted || keyword_null);
                            self.ManipulationDelta(manipulationElement.manipulationDelta || keyword_null);
                            self.ManipulationInertiaStarting(manipulationElement.manipulationInertiaStarting || keyword_null);
                            self.ManipulationCompleted(manipulationElement.manipulationCompleted || keyword_null);
                            self.Tapped(tapElement.tapped || keyword_null);
                            self.DoubleTapped(tapElement.doubleTapped || keyword_null);
                            self.RightTapped(tapElement.rightTapped || keyword_null);
                            self.TouchOperatorStart(manipulationElement.touchOperatorStart || keyword_null);
                            self.TouchOperatorEnd(manipulationElement.touchOperatorEnd || keyword_null);
                            if (manipulationElement.messageFilter)
                            {
                                self._touchMouseMessageFilter = downElement.messageFilter
                            }
                            break
                        }
                    }
                    return true
                };
                TouchEventProvider.prototype._down = function(element, sourceElement, id, position, timeStamp)
                {
                    var self = this;
                    if (self._pressedPointers[id] !== keyword_undefined)
                    {
                        return false
                    }
                    if (self._pressedPointers.length === 0)
                    {
                        if (!self._setCaptureElement(element, sourceElement))
                        {
                            return false
                        }
                    }
                    if (self._manipulationElement === keyword_null || typeof(self._manipulationElement) === const_undefined)
                    {
                        return false
                    }
                    if (self._pressedPointers.length >= self._manipulationElement.maxPointer)
                    {
                        return true
                    }
                    if (self._touchMouseMessageFilter && self._touchMouseMessageFilter.preProcessPointerDown())
                    {
                        return false
                    }
                    self._fixPosition(position);
                    if (self._touchMouseMessageFilter && self._pressedPointers.length === 0)
                    {
                        self._touchMouseMessageFilter.preProcessManipulationStarting()
                    }
                    self._pressedPointers[id] = {
                        id: id, time: (new Date).valueOf(), position: position
                    };
                    self._pressedPointers.length++;
                    if (self._manipulationProcessor)
                    {
                        self._manipulationProcessor.PreviewPointerDown(sourceElement, id, position, timeStamp);
                        self._manipulationProcessor.PointerDown(id, position, self._pressedPointers.length, timeStamp)
                    }
                    if (self._pressedPointers.length === 1 && self._tapEventProcesser)
                    {
                        self._tapEventProcesser.PointerDown(position)
                    }
                    if (self._pressedPointers.length === 1 && self.touchOperatorStart)
                    {
                        self.touchOperatorStart({Position: position})
                    }
                    return true
                };
                TouchEventProvider.prototype._move = function(id, position, timeStamp)
                {
                    var self = this;
                    if (self._pressedPointers[id] === keyword_undefined)
                    {
                        return false
                    }
                    if (self._touchMouseMessageFilter && self._touchMouseMessageFilter.preProcessPointerMove())
                    {
                        return false
                    }
                    self._fixPosition(position);
                    self._pressedPointers[id] = {
                        id: id, time: (new Date).valueOf(), position: position
                    };
                    if (self._manipulationProcessor)
                    {
                        self._manipulationProcessor.PointerMove(id, position, timeStamp)
                    }
                    return true
                };
                TouchEventProvider.prototype._up = function(id, position)
                {
                    var self = this;
                    if (self._pressedPointers[id] === keyword_undefined)
                    {
                        return false
                    }
                    delete self._pressedPointers[id];
                    self._pressedPointers.length--;
                    if (self._touchMouseMessageFilter && self._touchMouseMessageFilter.preProcessPointerUp())
                    {
                        return false
                    }
                    self._fixPosition(position);
                    if (self._manipulationProcessor)
                    {
                        self._manipulationProcessor.PreviewPointerUp(id);
                        self._manipulationProcessor.PointerUp(id)
                    }
                    if (self._pressedPointers.length === 0 && self._tapEventProcesser)
                    {
                        self._tapEventProcesser.PreviewPointerUp(position);
                        self._tapEventProcesser.PointerUp(position)
                    }
                    if (self._pressedPointers.length === 0 && self.touchOperatorEnd)
                    {
                        self.touchOperatorEnd({Position: position})
                    }
                    if (self._touchMouseMessageFilter && self._pressedPointers.length === 0 && self._manipulationProcessor._process === 0)
                    {
                        self._touchMouseMessageFilter.postProcessManipulationComplete()
                    }
                    return true
                };
                TouchEventProvider.prototype._cancel = function(id, position)
                {
                    return this._up(id, position)
                };
                TouchEventProvider.prototype.attachDettach = function(targetElement, isAttach)
                {
                    var self = this;
                    var element = targetElement.element,
                        elements = self._elements;
                    var elementIndex = Sheets.ArrayHelper.indexOf(elements, targetElement);
                    if (elementIndex >= 0 && isAttach || elementIndex < 0 && !isAttach)
                    {
                        return
                    }
                    var eventFlag = "." + targetElement.eventFlag;
                    var _gcSheet = ".gcSheet",
                        _msPointerDown_gcSheet = "MSPointerDown" + _gcSheet,
                        _msPointerMove_gcSheet = "MSPointerMove" + _gcSheet + eventFlag,
                        _msPointerUp_gcSheet = "MSPointerUp" + _gcSheet + eventFlag,
                        _msPointerCancel_gcSheet = "MSPointerCancel" + _gcSheet + eventFlag,
                        _msLostPointerCapture_gcSheet = "MSLostPointerCapture" + _gcSheet + eventFlag,
                        _pointerdown_gcSheet = "pointerdown" + _gcSheet,
                        _pointermove_gcSheet = "pointermove" + _gcSheet + eventFlag,
                        _pointerup_gcSheet = "pointerup" + _gcSheet + eventFlag,
                        _lostPointerCapture_gcSheet = "LostPointerCapture" + _gcSheet + eventFlag,
                        _pointercancel_gcSheet = "pointercancel" + _gcSheet + eventFlag,
                        _touchStart_gcSheet = "touchstart" + _gcSheet,
                        _touchMove_gcSheet = "touchmove" + _gcSheet,
                        _touchEnd_gcSheet = "touchend" + _gcSheet,
                        _touchCancel_gcSheet = "touchcancel" + _gcSheet;
                    if (isAttach)
                    {
                        if (window.navigator.msPointerEnabled)
                        {
                            if (element.style.msTouchAction !== keyword_null && typeof(element.style.msTouchAction) !== const_undefined)
                            {
                                element.style.msTouchAction = "none"
                            }
                            (function(elm, eventStr)
                            {
                                $(element).bind(_msPointerDown_gcSheet, function(e)
                                {
                                    self.msPointerDown(elm, e.originalEvent)
                                }).bind(_pointerdown_gcSheet, function(e)
                                {
                                    self.msPointerDown(elm, e.originalEvent)
                                })
                            }).call(self, targetElement);
                            $(document).bind(_msPointerMove_gcSheet, function(e)
                            {
                                self.msPointerMove(e.originalEvent)
                            }).bind(_msPointerUp_gcSheet, function(e)
                            {
                                self.msPointerUp(e.originalEvent)
                            }).bind(_pointermove_gcSheet, function(e)
                            {
                                self.msPointerMove(e.originalEvent)
                            }).bind(_pointerup_gcSheet, function(e)
                            {
                                self.msPointerUp(e.originalEvent)
                            }).bind(_msPointerCancel_gcSheet, function(e)
                            {
                                self.msPointerCancel(e.originalEvent)
                            }).bind(_msLostPointerCapture_gcSheet, function(e)
                            {
                                self.msPointerCancel(e.originalEvent)
                            }).bind(_lostPointerCapture_gcSheet, function(e)
                            {
                                self.msPointerCancel(e.originalEvent)
                            }).bind(_pointercancel_gcSheet, function(e)
                            {
                                self.msPointerCancel(e.originalEvent)
                            })
                        }
                        else
                        {
                            (function(elm, eventStr)
                            {
                                $(element).bind(_touchStart_gcSheet, function(e)
                                {
                                    self.touchStart(elm, e.originalEvent)
                                })
                            }).call(self, targetElement);
                            $(element).bind(_touchMove_gcSheet, function(e)
                            {
                                self.touchMove(e.originalEvent)
                            }).bind(_touchEnd_gcSheet, function(e)
                            {
                                self.touchEnd(e.originalEvent)
                            }).bind(_touchCancel_gcSheet, function(e)
                            {
                                self.touchCancel(e.originalEvent)
                            })
                        }
                    }
                    else
                    {
                        if (window.navigator.msPointerEnabled)
                        {
                            $(element).unbind(_msPointerDown_gcSheet).unbind(_pointerdown_gcSheet);
                            $(document).unbind(_msPointerMove_gcSheet).unbind(_pointermove_gcSheet).unbind(_msPointerUp_gcSheet).unbind(_pointerup_gcSheet).unbind(_msPointerCancel_gcSheet).unbind(_pointercancel_gcSheet).unbind(_msLostPointerCapture_gcSheet).unbind(_lostPointerCapture_gcSheet)
                        }
                        else
                        {
                            $(element).unbind(_touchStart_gcSheet).unbind(_touchMove_gcSheet).unbind(_touchEnd_gcSheet).unbind(_touchCancel_gcSheet)
                        }
                    }
                    if (isAttach)
                    {
                        elements.push(targetElement)
                    }
                    else
                    {
                        elements.splice(elementIndex, 1)
                    }
                };
                TouchEventProvider.prototype.dispose = function()
                {
                    var elements = this._elements;
                    for (var i = elements.length - 1; i >= 0; i--)
                    {
                        this.attachDettach(elements[i], false)
                    }
                };
                return TouchEventProvider
            })();
        Sheets.TouchEventProvider = TouchEventProvider;
        var ManipulationProcessor = (function()
            {
                function ManipulationProcessor()
                {
                    var self = this;
                    self._totalTranslateX = 0;
                    self._totalTranslateY = 0;
                    self._totalScale = 1;
                    self._totalRotation = 0;
                    self._totalExpansion = 0;
                    self._process = 0;
                    self._workingModes = 511;
                    self._manipulatorPointers = new ManipulatorCollection;
                    self._minimumScaleRotateRadius = 20;
                    self._deltaHistory = new DeltaHistory
                }
                ManipulationProcessor.prototype.PreviewPointerDown = function(originalSource, id, position, timeStamp)
                {
                    var self = this;
                    if (self._process === 3)
                    {
                        self.Complete(true)
                    }
                    if (self._process === 2)
                    {
                        self._isScroll = self._manipulatorPointers.Count() === 1
                    }
                    else
                    {
                        self._isScroll = false
                    }
                    self._originalSource = originalSource;
                    var manipulatorState = new ManipulatorState(id);
                    manipulatorState.PreviousPoint = position;
                    manipulatorState.InitialPoint = position;
                    self._manipulatorPointers.Add(manipulatorState);
                    self._lastTime = timeStamp;
                    if (self._manipulatorPointers.Count() > 1)
                    {
                        self.TranslateXLocked = false;
                        self.TranslateYLocked = false;
                        if (self._process === 1)
                        {
                            self.StartManipulation()
                        }
                    }
                };
                ManipulationProcessor.prototype.PointerDown = function(id, position, pointerCount, timeStamp)
                {
                    if (this._process === 0 && pointerCount === 1)
                    {
                        this.Starting(this._manipulatorPointers.ItemAt(0).InitialPoint)
                    }
                };
                ManipulationProcessor.prototype.PointerMove = function(id, position, timeStamp)
                {
                    var self = this;
                    if (self._workingModes === 0)
                    {
                        return
                    }
                    if (!self._manipulatorPointers.Contains(id))
                    {
                        return
                    }
                    if (self._process === 1)
                    {
                        if (self._manipulatorPointers.Count() === 1)
                        {
                            var isPinned = self.IsPinned();
                            if (!self.SupportsMode(1) && !self.SupportsMode(2) && !isPinned)
                            {
                                return
                            }
                            if (!TouchHelper.AreClose(position, self._manipulatorPointers.Find(id).InitialPoint))
                            {
                                var offsetX = Math_abs(position.X - self._manipulatorPointers.Find(id).InitialPoint.X);
                                var offsetY = Math_abs(position.Y - self._manipulatorPointers.Find(id).InitialPoint.Y);
                                self.SetTranslateRails(offsetX, offsetY)
                            }
                            else
                            {
                                return
                            }
                        }
                    }
                    if (timeStamp - self._lastTime < TouchHelper.ManipulationDeltaInterval)
                    {
                        return
                    }
                    self._manipulatorPointers.Find(id).CurrentPoint = position;
                    var count = self._manipulatorPointers.Count();
                    if (count > 1)
                    {
                        for (var i = 0; i < count; i++)
                        {
                            var item = self._manipulatorPointers.ItemAt(i);
                            if (!item.CurrentPoint)
                            {
                                return
                            }
                        }
                    }
                    self.PointerMoveCore(timeStamp);
                    self._lastTime = timeStamp;
                    var count = self._manipulatorPointers.Count();
                    for (var i = 0; i < count; i++)
                    {
                        var item = self._manipulatorPointers.ItemAt(i);
                        item.PreviousPoint = item.CurrentPoint;
                        item.CurrentPoint = keyword_null
                    }
                };
                ManipulationProcessor.prototype.PointerUp = function(id)
                {
                    var self = this;
                    if (self._needFireEvents)
                    {
                        self.OnManipulationCompleted(self._needFireEvents);
                        self._needFireEvents = keyword_null
                    }
                };
                ManipulationProcessor.prototype.PreviewPointerUp = function(id)
                {
                    var self = this;
                    if (!self._manipulatorPointers.Contains(id))
                    {
                        return
                    }
                    self._manipulatorPointers.Remove(id);
                    if (self._process === 2)
                    {
                        if (self._manipulatorPointers.Count() === 0)
                        {
                            if (self.SupportsMode(64) || self.SupportsMode(256) || self.SupportsMode(128))
                            {
                                self.StartInertia()
                            }
                            else
                            {
                                self.Complete(true)
                            }
                        }
                    }
                    else if (self._process === 2 || self._process === 3)
                    {
                        self.Complete(true)
                    }
                    else if (self._process === 1)
                    {
                        self.Complete(false)
                    }
                };
                ManipulationProcessor.prototype.PointerMoveCore = function(timeStamp)
                {
                    var self = this;
                    var translateX;
                    var translateY;
                    var expansion;
                    var scale;
                    var rotation;
                    var position;
                    var retureValue = self.CalculateTranslate();
                    translateX = retureValue.translateX;
                    translateY = retureValue.translateY;
                    position = retureValue.position;
                    var retureValue2 = self.CalculateRotationAndScale();
                    rotation = retureValue2.rotation;
                    scale = retureValue2.scale;
                    expansion = retureValue2.expansion;
                    self._totalTranslateX += translateX;
                    self._totalTranslateY += translateY;
                    self._totalScale *= scale;
                    self._totalRotation += rotation;
                    self._totalExpansion += expansion;
                    var deltaSnap = new DeltaSnap;
                    deltaSnap.expansion = expansion;
                    deltaSnap.rotation = rotation;
                    deltaSnap.timeStamp = timeStamp - self._lastTime;
                    deltaSnap.translateX = translateX;
                    deltaSnap.translateY = translateY;
                    self._deltaHistory.Enqueue(deltaSnap);
                    self._lastPosition = position;
                    if (self._process === 1 || self._process === 2)
                    {
                        if (self._process === 1)
                        {
                            var complete = self.StartManipulation();
                            if (complete)
                            {
                                return
                            }
                        }
                        var delta = new ManipulationDelta;
                        delta.Expansion = expansion;
                        delta.Rotation = rotation;
                        delta.Scale = scale;
                        delta.Translation = new TouchPoint(translateX, translateY);
                        var velocities = new ManipulationVelocities(self._deltaHistory);
                        var args = new ManipulationDeltaEventArgs(self._originalSource, self.GetCumulative(), delta, false, position, velocities);
                        self.OnManipulationDelta(args);
                        if (args.IsComplete)
                        {
                            self.Complete(true);
                            return
                        }
                    }
                };
                ManipulationProcessor.prototype.StartManipulation = function()
                {
                    var self = this;
                    self._process = 2;
                    var args = new ManipulationStartedEventArgs(self._originalSource, self._manipulatorPointers.Count(), self.GetCumulative(), self._manipulatorPointers.ItemAt(0).InitialPoint);
                    self.OnManipulationStarted(args);
                    if (args.IsComplete)
                    {
                        self.Complete(true);
                        return true
                    }
                    return false
                };
                ManipulationProcessor.prototype.SetTranslateRails = function(offsetX, offsetY)
                {
                    var returnValue = ManipulationHelper.GetTranslateLocked(offsetX, offsetY);
                    this.TranslateXLocked = returnValue.translateXLocked;
                    this.TranslateYLocked = returnValue.translateYLocked
                };
                ManipulationProcessor.prototype.CalculateTranslate = function()
                {
                    var translateX = 0;
                    var translateY = 0;
                    var temp = this.GetAveragePoint();
                    var currentAveragePoint = temp.currentAveragePoint;
                    var previousAveragePoint = temp.previousAveragePoint;
                    var position = new TouchPoint(currentAveragePoint.X, currentAveragePoint.Y);
                    translateX = currentAveragePoint.X - previousAveragePoint.X;
                    translateY = currentAveragePoint.Y - previousAveragePoint.Y;
                    return {
                            translateX: translateX, translateY: translateY, position: position
                        }
                };
                ManipulationProcessor.prototype.CalculateRotationAndScale = function()
                {
                    var self = this;
                    var rotation = 0;
                    var scale = 1;
                    var expansion = 0;
                    if (self.SupportsMode(16) && self._manipulatorPointers.Count() === 1 && self.IsPinned())
                    {
                        rotation = self.CalculateSingleManipulatorRotation(self._manipulatorPointers.ItemAt(0).CurrentPoint, self._manipulatorPointers.ItemAt(0).PreviousPoint, self._pivot)
                    }
                    if (self._manipulatorPointers.Count() > 1)
                    {
                        var temp = self.CalculateMultiManipulatorRotationAndScale();
                        rotation = temp.rotation;
                        scale = temp.scale;
                        expansion = temp.expansion
                    }
                    rotation = rotation / Math_PI * 180;
                    return {
                            rotation: rotation, scale: scale, expansion: expansion
                        }
                };
                ManipulationProcessor.prototype.CalculateMultiManipulatorRotationAndScale = function()
                {
                    var self = this;
                    var temp = self.GetAveragePoint();
                    var currentAveragePoint = temp.currentAveragePoint;
                    var previousAveragePoint = temp.previousAveragePoint;
                    var isPinned = self.IsPinned();
                    var pivotCenter = isPinned ? self._pivot.Center : new TouchPoint(0, 0);
                    var rotation = 0;
                    var scale = 1;
                    var expansion = 0;
                    var rotationCount = 0;
                    var scaleCount = 0;
                    var currentDistanseTotal = 0;
                    var previousDistanseTotal = 0;
                    var count = self._manipulatorPointers.Count();
                    for (var i = 0; i < count; i++)
                    {
                        var current = self._manipulatorPointers.ItemAt(i).CurrentPoint;
                        var previous = self._manipulatorPointers.ItemAt(i).PreviousPoint;
                        var currentDistanse = self.GetLength(current, currentAveragePoint);
                        var previousDistanse = self.GetLength(previous, previousAveragePoint);
                        var previousVector = isPinned ? new TouchPoint(previous.X - pivotCenter.X, previous.Y - pivotCenter.Y) : new TouchPoint(previous.X - previousAveragePoint.X, previous.Y - previousAveragePoint.Y);
                        var currentVector = isPinned ? new TouchPoint(current.X - pivotCenter.X, current.Y - pivotCenter.Y) : new TouchPoint(current.X - currentAveragePoint.X, current.Y - currentAveragePoint.Y);
                        var previousLength = self.GetLength(previous, pivotCenter);
                        var currentLength = self.GetLength(current, pivotCenter);
                        if (previousDistanse >= self._minimumScaleRotateRadius && currentDistanse >= self._minimumScaleRotateRadius)
                        {
                            scaleCount++;
                            currentDistanseTotal += currentDistanse;
                            previousDistanseTotal += previousDistanse;
                            if ((!isPinned || previousLength >= self._minimumScaleRotateRadius) && currentLength >= self._minimumScaleRotateRadius)
                            {
                                var angleTmp = self.AngleBetween(previousVector, currentVector);
                                rotation += angleTmp;
                                rotationCount++
                            }
                        }
                    }
                    if (rotationCount > 0 && self.SupportsMode(16))
                    {
                        rotation = rotation / rotationCount
                    }
                    else
                    {
                        rotation = 0
                    }
                    if (scaleCount > 0 && self.SupportsMode(32))
                    {
                        if (!self._isScroll)
                        {
                            scale = currentDistanseTotal / previousDistanseTotal
                        }
                        expansion = (currentDistanseTotal - previousDistanseTotal) / scaleCount;
                        self._lastDistance = currentDistanseTotal / scaleCount
                    }
                    else
                    {
                        self._lastDistance = 0
                    }
                    return {
                            rotation: rotation, scale: scale, expansion: expansion
                        }
                };
                ManipulationProcessor.prototype.CalculateSingleManipulatorRotation = function(currentPosition, previousPosition, pivot)
                {
                    var center = new TouchPoint(pivot.Center.X, pivot.Center.Y);
                    var rf = new TouchPoint(previousPosition.X - center.X, previousPosition.Y - center.Y);
                    var rf2 = new TouchPoint(currentPosition.X - center.X, currentPosition.Y - center.Y);
                    var num = Math_min(1.0, Math_pow((this.GetLength(previousPosition, center) / pivot.Radius), 4.0));
                    var f = this.AngleBetween(rf, rf2);
                    if (isNaN(f))
                    {
                        return 0
                    }
                    return (f * num)
                };
                ManipulationProcessor.prototype.AngleBetween = function(vector1, vector2)
                {
                    var num = Math_atan2(vector2.Y, vector2.X) - Math_atan2(vector1.Y, vector1.X);
                    if (num > Math_PI)
                    {
                        num -= Math_PI * 2
                    }
                    else if (num < -Math_PI)
                    {
                        num += Math_PI * 2
                    }
                    return num
                };
                ManipulationProcessor.prototype.SupportsMode = function(mode)
                {
                    return (this._workingModes & mode) !== 0
                };
                ManipulationProcessor.prototype.GetLength = function(p1, p2)
                {
                    return Math_sqrt((p2.X - p1.X) * (p2.X - p1.X) + (p2.Y - p1.Y) * (p2.Y - p1.Y))
                };
                ManipulationProcessor.prototype.GetAveragePoint = function()
                {
                    var xPrevious = 0;
                    var yPrevious = 0;
                    var xCurrent = 0;
                    var yCurrent = 0;
                    var count = this._manipulatorPointers.Count();
                    for (var i = 0; i < count; i++)
                    {
                        var point = this._manipulatorPointers.ItemAt(i);
                        xPrevious += point.PreviousPoint.X;
                        yPrevious += point.PreviousPoint.Y;
                        xCurrent += point.CurrentPoint.X;
                        yCurrent += point.CurrentPoint.Y
                    }
                    var previousAveragePoint = new TouchPoint(xPrevious / count, yPrevious / count);
                    var currentAveragePoint = new TouchPoint(xCurrent / count, yCurrent / count);
                    return {
                            currentAveragePoint: currentAveragePoint, previousAveragePoint: previousAveragePoint
                        }
                };
                ManipulationProcessor.prototype.IsPinned = function()
                {
                    return this._pivot && !isNaN(this._pivot.Radius)
                };
                ManipulationProcessor.prototype.Starting = function(position)
                {
                    var self = this;
                    var args = new ManipulationStartingEventArgs(self._originalSource, self._workingModes, keyword_null, position);
                    args.Mode = 511;
                    self.OnManipulationStarting(args);
                    self.ManipulationMode = args.Mode;
                    if (args.Mode === 0)
                    {
                        self.Complete(false);
                        return false
                    }
                    else
                    {
                        self._workingModes = args.Mode;
                        self._pivot = args.Pivot;
                        self._process = 1;
                        return true
                    }
                };
                ManipulationProcessor.prototype.Complete = function(raisEvent)
                {
                    var self = this;
                    var isInertia = (self._process === 3);
                    self._process = 0;
                    if (self._inertiaTimer)
                    {
                        clearInterval(self._inertiaTimer);
                        self._inertiaTimer = keyword_null
                    }
                    if (raisEvent)
                    {
                        var args = new ManipulationCompletedEventArgs(self._originalSource, self.GetCumulative(), isInertia, TouchPoint.Round(self._lastPosition), new ManipulationVelocities(self._deltaHistory));
                        if (self._process === 3)
                        {
                            self._needFireEvents = args
                        }
                        else
                        {
                            self.OnManipulationCompleted(args)
                        }
                    }
                    self._deltaHistory.Clear();
                    self._manipulatorPointers.Clear();
                    self._pivot = keyword_null;
                    self._totalTranslateX = 0;
                    self._totalTranslateY = 0;
                    self._totalScale = 1;
                    self._totalRotation = 0;
                    self._totalExpansion = 0;
                    self.TranslateXLocked = false;
                    self.TranslateYLocked = false;
                    self._workingModes = 0
                };
                ManipulationProcessor.prototype.StartInertia = function()
                {
                    var self = this;
                    var inertiaData = new InertiaData;
                    var velocities = new ManipulationVelocities(self._deltaHistory);
                    inertiaData.CurrentTranslateXVelocity = self.SupportsMode(64) ? velocities.Linear().X : 0;
                    inertiaData.CurrentTranslateYVelocity = self.SupportsMode(64) ? velocities.Linear().Y : 0;
                    inertiaData.CurrentExpansionVelocity = self.SupportsMode(256) ? velocities.Expansion() : 0;
                    inertiaData.CurrentRotationVelocity = self.SupportsMode(128) ? velocities.Angular() : 0;
                    if (inertiaData.CurrentTranslateXVelocity === 0 && inertiaData.CurrentTranslateYVelocity === 0 && inertiaData.CurrentExpansionVelocity === 0 && inertiaData.CurrentRotationVelocity === 0)
                    {
                        self.Complete(true);
                        return
                    }
                    inertiaData.TranslateBehavior = new InertiaTranslationBehavior(inertiaData.CurrentTranslateXVelocity, inertiaData.CurrentTranslateYVelocity);
                    inertiaData.ExpansionBehavior = new InertiaExpansionBehavior(inertiaData.CurrentExpansionVelocity);
                    inertiaData.RotationBehavior = new InertiaRotationBehavior(inertiaData.CurrentRotationVelocity);
                    velocities = new ManipulationVelocities(keyword_null, inertiaData.CurrentTranslateXVelocity, inertiaData.CurrentTranslateYVelocity, inertiaData.CurrentRotationVelocity, inertiaData.CurrentExpansionVelocity);
                    var args = new ManipulationInertiaStartingEventArgs(self._originalSource, self.GetCumulative(), new ManipulationDelta, velocities, inertiaData.ExpansionBehavior, inertiaData.RotationBehavior, inertiaData.TranslateBehavior);
                    self.OnManipulationInertiaStarting(args);
                    inertiaData.TranslateBehavior = args.TranslationBehavior;
                    inertiaData.ExpansionBehavior = args.ExpansionBehavior;
                    inertiaData.RotationBehavior = args.RotationBehavior;
                    if (inertiaData.TranslateBehavior.XDeceleration <= 0 && inertiaData.TranslateBehavior.YDeceleration <= 0)
                    {
                        inertiaData.TranslateBehavior.SetDecelerationInternal(0.003)
                    }
                    if (inertiaData.ExpansionBehavior.DecelerationInternal() <= 0)
                    {
                        inertiaData.ExpansionBehavior.SetDecelerationInternal(0.002)
                    }
                    if (inertiaData.RotationBehavior.DecelerationInternal() <= 0)
                    {
                        inertiaData.RotationBehavior.SetDecelerationInternal(0.003)
                    }
                    var startTime = (new Date).valueOf();
                    inertiaData.StartTime = startTime;
                    inertiaData.LastTime = startTime;
                    inertiaData.DeltaXRemainder = 0;
                    inertiaData.DeltaYRemainder = 0;
                    self._process = 3;
                    self._inertiaTimer = setInterval(function()
                    {
                        try
                        {
                            self.InertiaTick(inertiaData)
                        }
                        catch(e) {}
                    }, 20)
                };
                ManipulationProcessor.prototype.InertiaTick = function(inertiaData)
                {
                    var self = this;
                    var currentTime = (new Date).valueOf();
                    var totalTime = currentTime - inertiaData.StartTime;
                    var timeDuriing = currentTime - inertiaData.LastTime;
                    if (timeDuriing === 0)
                    {
                        return
                    }
                    var averageTranslateXVelocity = inertiaData.CurrentTranslateXVelocity;
                    var averageTranslateYVelocity = inertiaData.CurrentTranslateYVelocity;
                    var averageExpansionVelocity = inertiaData.CurrentExpansionVelocity;
                    var RotationVelocity = inertiaData.CurrentRotationVelocity;
                    inertiaData.CurrentTranslateXVelocity = self.GetInertiaCurrentVelocity(timeDuriing, inertiaData.TranslateBehavior.XDeceleration, inertiaData.CurrentTranslateXVelocity);
                    inertiaData.CurrentTranslateYVelocity = self.GetInertiaCurrentVelocity(timeDuriing, inertiaData.TranslateBehavior.YDeceleration, inertiaData.CurrentTranslateYVelocity);
                    inertiaData.CurrentExpansionVelocity = self.GetInertiaCurrentVelocity(timeDuriing, inertiaData.ExpansionBehavior.DecelerationInternal(), inertiaData.CurrentExpansionVelocity);
                    inertiaData.CurrentRotationVelocity = self.GetInertiaCurrentVelocity(timeDuriing, inertiaData.RotationBehavior.DecelerationInternal(), inertiaData.CurrentRotationVelocity);
                    averageTranslateXVelocity = (averageTranslateXVelocity + inertiaData.CurrentTranslateXVelocity) / 2;
                    averageTranslateYVelocity = (averageTranslateYVelocity + inertiaData.CurrentTranslateYVelocity) / 2;
                    averageExpansionVelocity = (averageExpansionVelocity + inertiaData.CurrentExpansionVelocity) / 2;
                    RotationVelocity = (RotationVelocity + inertiaData.CurrentRotationVelocity) / 2;
                    inertiaData.LastTime = currentTime;
                    var complete = false;
                    if (self.IsZero(averageTranslateXVelocity) && self.IsZero(averageTranslateYVelocity) && self.IsZero(averageExpansionVelocity) && self.IsZero(RotationVelocity))
                    {
                        complete = true
                    }
                    var deltaX = timeDuriing * averageTranslateXVelocity;
                    var deltaY = timeDuriing * averageTranslateYVelocity;
                    var deltaExpansion = timeDuriing * averageExpansionVelocity;
                    var deltaRotation = timeDuriing * RotationVelocity;
                    var deltaScale = 1;
                    if (self._lastDistance > 0)
                    {
                        if (self._lastDistance + deltaExpansion * 2 < 0)
                        {
                            deltaExpansion = -self._lastDistance / 2 + 1
                        }
                        if (self._lastDistance !== 0)
                        {
                            deltaScale = (self._lastDistance + deltaExpansion * 2) / self._lastDistance
                        }
                    }
                    self._totalExpansion += deltaExpansion;
                    self._totalRotation += deltaRotation;
                    self._totalTranslateX += deltaX;
                    self._totalTranslateY += deltaY;
                    self._totalScale *= deltaScale;
                    self._lastDistance += deltaExpansion;
                    self._lastPosition = new TouchPoint((self._lastPosition.X + deltaX), (self._lastPosition.Y + deltaY));
                    inertiaData.DeltaXRemainder += deltaX;
                    inertiaData.DeltaYRemainder += deltaY;
                    if (complete)
                    {
                        deltaX = Math_round(inertiaData.DeltaXRemainder);
                        deltaY = Math_round(inertiaData.DeltaYRemainder);
                        if (self.IsZero(deltaX) && self.IsZero(deltaY))
                        {
                            self.Complete(true);
                            return
                        }
                    }
                    else
                    {
                        if (Math_abs(inertiaData.DeltaXRemainder) >= 1)
                        {
                            deltaX = inertiaData.DeltaXRemainder;
                            inertiaData.DeltaXRemainder -= deltaX
                        }
                        if (Math_abs(inertiaData.DeltaYRemainder) >= 1)
                        {
                            deltaY = inertiaData.DeltaYRemainder;
                            inertiaData.DeltaYRemainder -= deltaY
                        }
                    }
                    var delta = new ManipulationDelta;
                    delta.Translation = new TouchPoint(deltaX, deltaY);
                    delta.Scale = deltaScale;
                    delta.Expansion = deltaExpansion;
                    delta.Rotation = deltaRotation;
                    var deltaVelocities = new ManipulationVelocities(keyword_null, inertiaData.CurrentTranslateXVelocity, inertiaData.CurrentTranslateYVelocity, inertiaData.CurrentRotationVelocity, inertiaData.CurrentExpansionVelocity);
                    var deltaArgs = new ManipulationDeltaEventArgs(self._originalSource, self.GetCumulative(), delta, true, TouchPoint.Round(self._lastPosition), deltaVelocities);
                    self.OnManipulationDelta(deltaArgs);
                    if (deltaArgs.IsComplete)
                    {
                        self.Complete(true);
                        return
                    }
                    if (complete)
                    {
                        self.Complete(true)
                    }
                };
                ManipulationProcessor.prototype.GetInertiaCurrentVelocity = function(time, desiredDeceleration, velocity)
                {
                    if (this.IsZero(velocity))
                    {
                        return 0
                    }
                    var newVelocity;
                    if (velocity < 0)
                    {
                        newVelocity = velocity + desiredDeceleration * time
                    }
                    else
                    {
                        newVelocity = velocity - desiredDeceleration * time
                    }
                    if ((newVelocity < 0 && velocity > 0) || (newVelocity > 0 && velocity < 0))
                    {
                        newVelocity = 0
                    }
                    return newVelocity
                };
                ManipulationProcessor.prototype.GetCumulative = function()
                {
                    var self = this;
                    var cumulative = new ManipulationDelta;
                    cumulative.Expansion = self._totalExpansion;
                    cumulative.Rotation = self._totalRotation;
                    cumulative.Scale = self._totalScale;
                    cumulative.Translation = new TouchPoint(self._totalTranslateX, self._totalTranslateY);
                    return cumulative
                };
                ManipulationProcessor.prototype.IsZero = function(d)
                {
                    return (Math_abs(d) <= 2.2204460492503131E-16)
                };
                ManipulationProcessor.prototype.GetManipulationData = function(isInertial, oldCumulative, oldDelta, oldVelocities)
                {
                    var self = this;
                    var cumulative = new ManipulationDelta;
                    var delta = new ManipulationDelta;
                    var vTranslationX = 0;
                    var vTranslationY = 0;
                    var vAngular = 0;
                    var vExpansion = 0;
                    var translateXLocaked = self.SupportsMode(4) && self.TranslateXLocked;
                    var translateYLocaked = self.SupportsMode(8) && self.TranslateYLocked;
                    if (self.SupportsMode(1) && !translateYLocaked && (!isInertial || self.SupportsMode(64)))
                    {
                        cumulative.Translation.X = oldCumulative.Translation.X;
                        delta.Translation.X = oldDelta.Translation.X;
                        vTranslationX = oldVelocities.Linear().X
                    }
                    if (self.SupportsMode(2) && !translateXLocaked && (!isInertial || self.SupportsMode(64)))
                    {
                        cumulative.Translation.Y = oldCumulative.Translation.Y;
                        delta.Translation.Y = oldDelta.Translation.Y;
                        vTranslationY = oldVelocities.Linear().Y
                    }
                    if (self.SupportsMode(32) && (!isInertial || self.SupportsMode(256)))
                    {
                        cumulative.Scale = oldCumulative.Scale;
                        cumulative.Expansion = oldCumulative.Expansion;
                        delta.Scale = oldDelta.Scale;
                        delta.Expansion = oldDelta.Expansion;
                        vExpansion = oldVelocities.Expansion()
                    }
                    else
                    {
                        cumulative.Scale = oldCumulative.Scale;
                        delta.Scale = 1.0
                    }
                    if (self.SupportsMode(16) && (!isInertial || self.SupportsMode(128)))
                    {
                        cumulative.Rotation = oldCumulative.Rotation;
                        delta.Rotation = oldDelta.Rotation;
                        vAngular = oldVelocities.Angular()
                    }
                    var velocities = new ManipulationVelocities(keyword_null, vTranslationX, vTranslationY, vAngular, vExpansion);
                    return new ManipulationData(cumulative, delta, velocities)
                };
                ManipulationProcessor.prototype.OnManipulationStarting = function(e)
                {
                    if (this.ManipulationStarting && e)
                    {
                        this.ManipulationStarting(e)
                    }
                };
                ManipulationProcessor.prototype.OnManipulationStarted = function(e)
                {
                    if (this.ManipulationStarted && e)
                    {
                        this.ManipulationStarted(e)
                    }
                };
                ManipulationProcessor.prototype.OnManipulationCompleted = function(e)
                {
                    if (this.ManipulationCompleted && e)
                    {
                        var manipulationData = this.GetManipulationData(false, e.Cumulative, e.Cumulative, e.Velocities);
                        e.Cumulative = manipulationData.Cumulative;
                        e.Velocities = manipulationData.Velocities;
                        this.ManipulationCompleted(e)
                    }
                };
                ManipulationProcessor.prototype.OnManipulationInertiaStarting = function(e)
                {
                    if (this.ManipulationInertiaStarting && e)
                    {
                        var manipulationData = this.GetManipulationData(false, e.Cumulative, e.Delta, e.Velocities);
                        e.Cumulative = manipulationData.Cumulative;
                        e.Delta = manipulationData.Delta;
                        e.Velocities = manipulationData.Velocities;
                        this.ManipulationInertiaStarting(e)
                    }
                };
                ManipulationProcessor.prototype.OnManipulationDelta = function(e)
                {
                    if (this.ManipulationDelta && e)
                    {
                        var manipulationData = this.GetManipulationData(e.IsInertia, e.Cumulative, e.Delta, e.Velocities);
                        e.Cumulative = manipulationData.Cumulative;
                        e.Delta = manipulationData.Delta;
                        e.Velocities = manipulationData.Velocities;
                        this.ManipulationDelta(e)
                    }
                };
                return ManipulationProcessor
            })();
        var TapEventProcesser = (function()
            {
                function TapEventProcesser(){}
                TapEventProcesser.prototype.PointerDown = function(point)
                {
                    var self = this;
                    self._pointerCount++;
                    if (self._pointerCount > 1)
                        return;
                    var currentTimestamp = (new Date).valueOf();
                    if (self._firstDownPosition && TouchHelper.DoubleTappedAreClose(point, self._firstDownPosition) && currentTimestamp - self._lastDownTimestamp < TouchHelper.DoubleTappedTimeOffset)
                    {
                        self._count++
                    }
                    else
                    {
                        self._firstDownPosition = point;
                        self._count = 1
                    }
                    self._lastDownPosition = point;
                    self._lastDownTimestamp = currentTimestamp
                };
                TapEventProcesser.prototype.PointerUp = function(point)
                {
                    var self = this;
                    if (self._needFireEvents)
                    {
                        if (self._needFireEvents instanceof TappedEventArgs)
                        {
                            self.OnTapped(self._needFireEvents)
                        }
                        else if (self._needFireEvents instanceof RightTappedEventArgs)
                        {
                            self.OnRightTapped(self._needFireEvents)
                        }
                        self._needFireEvents = keyword_null
                    }
                };
                TapEventProcesser.prototype.PreviewPointerUp = function(point)
                {
                    var self = this;
                    self._pointerCount--;
                    if (self._pointerCount > 0)
                        return;
                    var currentTimestamp = (new Date).valueOf();
                    if (TouchHelper.AreClose(point, self._lastDownPosition))
                    {
                        if ((currentTimestamp - self._lastDownTimestamp > TouchHelper.RightTappedTimeOffset))
                        {
                            self._needFireEvents = new RightTappedEventArgs(self._lastDownPosition)
                        }
                        else if (self._count > 1)
                        {
                            self._count = 0;
                            self.OnDoubleTapped(new DoubleTappedEventArgs(self._firstDownPosition));
                            self._firstDownPosition = keyword_null
                        }
                        else
                        {
                            self._needFireEvents = new TappedEventArgs(self._lastDownPosition)
                        }
                    }
                    else
                    {
                        self._firstDownPosition = keyword_null
                    }
                };
                TapEventProcesser.prototype.PointerCancel = function()
                {
                    this._firstDownPosition = keyword_null
                };
                TapEventProcesser.prototype.OnTapped = function(e)
                {
                    if (this.Tapped && e)
                    {
                        this.Tapped(e)
                    }
                };
                TapEventProcesser.prototype.OnDoubleTapped = function(e)
                {
                    if (this.DoubleTapped && e)
                    {
                        this.DoubleTapped(e)
                    }
                };
                TapEventProcesser.prototype.OnRightTapped = function(e)
                {
                    if (this.RightTapped && e)
                    {
                        this.RightTapped(e)
                    }
                };
                return TapEventProcesser
            })();
        var ManipulationHelper = (function()
            {
                function ManipulationHelper(){}
                ManipulationHelper.GetTranslateLocked = function(offsetX, offsetY)
                {
                    var translateXLocked = false;
                    var translateYLocked = false;
                    if (offsetX !== 0)
                    {
                        var angle = Math_atan(offsetY / offsetX) / Math_PI * 180;
                        if (angle < 20)
                        {
                            translateXLocked = true
                        }
                    }
                    if (offsetX === 0)
                    {
                        translateYLocked = true
                    }
                    else
                    {
                        var angle = Math_atan(offsetY / offsetX) / Math_PI * 180;
                        if (angle > 75 && angle < 105)
                        {
                            translateYLocked = true
                        }
                    }
                    return {
                            translateXLocked: translateXLocked, translateYLocked: translateYLocked
                        }
                };
                return ManipulationHelper
            })();
        var TouchHelper = (function()
            {
                function TouchHelper(){}
                TouchHelper.AreClose = function(p1, p2)
                {
                    if (!p1 || !p2)
                    {
                        return false
                    }
                    var tappedMaxOffsetXByDPI = TouchHelper.TappedMaxOffset;
                    var tappedMaxOffsetYByDPI = TouchHelper.TappedMaxOffset;
                    var tappedMaxDistanceXByDPI = TouchHelper.TappedMaxDistance;
                    var tappedMaxDistanceYByDPI = TouchHelper.TappedMaxDistance;
                    var dx = p1.X - p2.X;
                    var dy = p1.Y - p2.Y;
                    return Math_abs(dx) < tappedMaxOffsetXByDPI && Math_abs(dy) < tappedMaxOffsetYByDPI && (Math_sqrt(dx * dx + dy * dy)) < Math_min(tappedMaxDistanceXByDPI, tappedMaxDistanceYByDPI)
                };
                TouchHelper.DoubleTappedAreClose = function(p1, p2)
                {
                    if (!p1 || !p2)
                    {
                        return false
                    }
                    var tappedMaxOffsetXByDPI = TouchHelper.DoubleTappedMaxOffset;
                    var tappedMaxOffsetYByDPI = TouchHelper.DoubleTappedMaxOffset;
                    var tappedMaxDistanceXByDPI = TouchHelper.DoubleTappedMaxDistance;
                    var tappedMaxDistanceYByDPI = TouchHelper.DoubleTappedMaxDistance;
                    var dx = p1.X - p2.X;
                    var dy = p1.Y - p2.Y;
                    return Math_abs(dx) < tappedMaxOffsetXByDPI && Math_abs(dy) < tappedMaxOffsetYByDPI && (Math_sqrt(dx * dx + dy * dy)) < Math_min(tappedMaxDistanceXByDPI, tappedMaxDistanceYByDPI)
                };
                TouchHelper.TouchScrollOnRails = function(value)
                {
                    if (value)
                    {
                        TouchHelper.TappedMaxOffset = 13;
                        TouchHelper.TappedMaxDistance = 15
                    }
                    else
                    {
                        TouchHelper.TappedMaxOffset = 3;
                        TouchHelper.TappedMaxDistance = 4
                    }
                };
                TouchHelper.TappedMaxOffset = 13;
                TouchHelper.TappedMaxDistance = 15;
                TouchHelper.DoubleTappedMaxOffset = 13;
                TouchHelper.DoubleTappedMaxDistance = 15;
                TouchHelper.DoubleTappedTimeOffset = 400;
                TouchHelper.RightTappedTimeOffset = 1000;
                TouchHelper.ManipulationDeltaInterval = 20;
                return TouchHelper
            })();
        Sheets.TouchHelper = TouchHelper;
        var TouchPoint = (function()
            {
                function TouchPoint(x, y)
                {
                    this.X = x;
                    this.Y = y
                }
                TouchPoint.Round = function(point)
                {
                    if (point)
                    {
                        return new TouchPoint(Math_round(point.X), Math_round(point.Y))
                    }
                    else
                    {
                        return new TouchPoint(-1, -1)
                    }
                };
                return TouchPoint
            })();
        Sheets.TouchPoint = TouchPoint;
        var DeltaSnap = (function()
            {
                function DeltaSnap(){}
                return DeltaSnap
            })();
        var DeltaHistory = (function()
            {
                function DeltaHistory()
                {
                    var self = this;
                    self._count = 0;
                    self._start = 0;
                    self._maxCount = 10;
                    self._history = new Array(self._maxCount)
                }
                DeltaHistory.prototype.GetVelocity = function(mode)
                {
                    var self = this;
                    if (self._count === 0)
                    {
                        return 0
                    }
                    var startTime = self.Item(self._count - 1).timeStamp;
                    var total = 0;
                    var totalCount = (1 + self._count) * self._count / 2;
                    for (var i = self._count - 1; i >= 0; i--)
                    {
                        var value = 0;
                        if (mode === 0)
                        {
                            value = self.Item(i).translateX
                        }
                        else if (mode === 1)
                        {
                            value = self.Item(i).translateY
                        }
                        else if (mode === 2)
                        {
                            value = self.Item(i).expansion
                        }
                        else if (mode === 3)
                        {
                            value = self.Item(i).rotation
                        }
                        var velocity = self.GetSingleVelocity(value, self.Item(i).timeStamp);
                        velocity *= i + 1;
                        total += velocity
                    }
                    return total / totalCount
                };
                DeltaHistory.prototype.GetSingleVelocity = function(value, time)
                {
                    return value / time
                };
                DeltaHistory.prototype.Item = function(index)
                {
                    return this._history[this.GetInnerListIndex(index)]
                };
                DeltaHistory.prototype.Last = function()
                {
                    return this._history[this._count - 1]
                };
                DeltaHistory.prototype.Enqueue = function(snap)
                {
                    var self = this;
                    if (self._count === 10)
                    {
                        self.Dequeue()
                    }
                    self._count++;
                    self._history[self.GetInnerListIndex(self._count - 1)] = snap;
                    var interval = TouchHelper.ManipulationDeltaInterval * self._maxCount;
                    for (var i = 0; i < self._count; i++)
                    {
                        if (snap.timeStamp - self._history[i].timeStamp > interval)
                        {
                            self.Dequeue();
                            i--
                        }
                    }
                };
                DeltaHistory.prototype.Dequeue = function()
                {
                    var self = this;
                    self._start++;
                    if (self._start === self._maxCount)
                    {
                        self._start = 0
                    }
                    self._count--
                };
                DeltaHistory.prototype.Clear = function()
                {
                    this._count = 0
                };
                DeltaHistory.prototype.GetInnerListIndex = function(index)
                {
                    return (this._start + index) % this._maxCount
                };
                return DeltaHistory
            })();
        var ManipulationVelocities = (function()
            {
                function ManipulationVelocities(history, translateX, translateY, angular, expansion)
                {
                    var self = this;
                    if (history)
                    {
                        self._history = history
                    }
                    else
                    {
                        self._linear = new TouchPoint(translateX, translateY);
                        self._angular = angular;
                        self._expansion = expansion
                    }
                }
                ManipulationVelocities.prototype.Linear = function()
                {
                    var self = this;
                    if (!self._linear)
                    {
                        self._linear = new TouchPoint(self._history.GetVelocity(0), self._history.GetVelocity(1))
                    }
                    return self._linear
                };
                ManipulationVelocities.prototype.Angular = function()
                {
                    var self = this;
                    if (self._angular === keyword_null || typeof(self._angular) === const_undefined)
                    {
                        self._angular = self._history.GetVelocity(3)
                    }
                    return self._angular
                };
                ManipulationVelocities.prototype.Expansion = function()
                {
                    var self = this;
                    if (self._expansion === keyword_null || typeof(self._expansion) === const_undefined)
                    {
                        self._expansion = self._history.GetVelocity(2)
                    }
                    return self._expansion
                };
                return ManipulationVelocities
            })();
        var InertiaExpansionBehavior = (function()
            {
                function InertiaExpansionBehavior(initialVelocity)
                {
                    this._initialVelocity = initialVelocity;
                    this._decelerationInternal = 0
                }
                InertiaExpansionBehavior.prototype.DecelerationInternal = function()
                {
                    var self = this;
                    if (!isNaN(self.DesiredExpansion) && self.DesiredExpansion !== 0)
                    {
                        return 0.5 * self._initialVelocity * self._initialVelocity / self.DesiredExpansion
                    }
                    else if (!isNaN(self.DesiredDeceleration))
                    {
                        return self.DesiredDeceleration
                    }
                    else
                    {
                        return self._decelerationInternal
                    }
                };
                InertiaExpansionBehavior.prototype.SetDecelerationInternal = function(value)
                {
                    this._decelerationInternal = value
                };
                return InertiaExpansionBehavior
            })();
        var InertiaRotationBehavior = (function()
            {
                function InertiaRotationBehavior(initialVelocity)
                {
                    this._initialVelocity = initialVelocity;
                    this._decelerationInternal = 0
                }
                InertiaRotationBehavior.prototype.DecelerationInternal = function()
                {
                    var self = this;
                    if (!isNaN(self.DesiredRotation) && self.DesiredRotation !== 0)
                    {
                        return 0.5 * self._initialVelocity * self._initialVelocity / self.DesiredRotation
                    }
                    else if (!isNaN(self.DesiredDeceleration))
                    {
                        return self.DesiredDeceleration
                    }
                    else
                    {
                        return self._decelerationInternal
                    }
                };
                InertiaRotationBehavior.prototype.SetDecelerationInternal = function(value)
                {
                    this._decelerationInternal = value
                };
                return InertiaRotationBehavior
            })();
        var InertiaTranslationBehavior = (function()
            {
                function InertiaTranslationBehavior(initialXVelocity, initialYVelocity)
                {
                    var self = this;
                    self._initialXVelocity = initialXVelocity;
                    self._initialYVelocity = initialYVelocity;
                    self.XDeceleration = 0;
                    self.YDeceleration = 0;
                    self._decelerationInternal = 0;
                    self._velocity = Math_sqrt((self._initialXVelocity * self._initialXVelocity + self._initialYVelocity * self._initialYVelocity))
                }
                InertiaTranslationBehavior.prototype.UpdateXYDecelerations = function()
                {
                    var self = this;
                    if (!isNaN(self.DesiredDisplacement) && self.DesiredDisplacement !== 0)
                    {
                        self.XDeceleration = 0.5 * self._velocity * Math_abs(self._initialXVelocity) / self.DesiredDisplacement;
                        self.YDeceleration = 0.5 * self._velocity * Math_abs(self._initialYVelocity) / self.DesiredDisplacement
                    }
                    else if (!isNaN(self.DecelerationInternal()) && self.DecelerationInternal() !== 0)
                    {
                        self.XDeceleration = self.DecelerationInternal() * Math_abs(self._initialXVelocity) / self._velocity;
                        self.YDeceleration = self.DecelerationInternal() * Math_abs(self._initialYVelocity) / self._velocity
                    }
                    else
                    {
                        self.XDeceleration = 0;
                        self.YDeceleration = 0
                    }
                };
                InertiaTranslationBehavior.prototype.SetDesiredDeceleration = function(value)
                {
                    this.DesiredDeceleration = value;
                    this.UpdateXYDecelerations()
                };
                InertiaTranslationBehavior.prototype.SetDesiredDisplacement = function(value)
                {
                    this.DesiredDisplacement = value;
                    this.UpdateXYDecelerations()
                };
                InertiaTranslationBehavior.prototype.DecelerationInternal = function()
                {
                    if (this.IsDefault())
                    {
                        return this._decelerationInternal
                    }
                    else
                    {
                        return this.DesiredDeceleration
                    }
                };
                InertiaTranslationBehavior.prototype.SetDecelerationInternal = function(value)
                {
                    this._decelerationInternal = value;
                    this.UpdateXYDecelerations()
                };
                InertiaTranslationBehavior.prototype.IsDefault = function()
                {
                    return isNaN(this.DesiredDeceleration) && isNaN(this.DesiredDisplacement)
                };
                return InertiaTranslationBehavior
            })();
        var InertiaData = (function()
            {
                function InertiaData(){}
                return InertiaData
            })();
        var ManipulationDelta = (function()
            {
                function ManipulationDelta()
                {
                    var self = this;
                    self.Translation = new TouchPoint(0, 0);
                    self.Scale = 0;
                    self.Rotation = 0;
                    self.Expansion = 0
                }
                return ManipulationDelta
            })();
        var ManipulationPivot = (function()
            {
                function ManipulationPivot(center, radius)
                {
                    this.Center = center;
                    this.Radius = radius
                }
                return ManipulationPivot
            })();
        var ManipulatorState = (function()
            {
                function ManipulatorState(id)
                {
                    this.ID = id
                }
                return ManipulatorState
            })();
        var ManipulatorCollection = (function()
            {
                function ManipulatorCollection()
                {
                    this._list = new Array
                }
                ManipulatorCollection.prototype.Contains = function(id)
                {
                    for (var i = 0; i < this._list.length; i++)
                    {
                        var item = this._list[i];
                        if (item.ID === id)
                        {
                            return true
                        }
                    }
                    return false
                };
                ManipulatorCollection.prototype.Add = function(state)
                {
                    this._list.push(state)
                };
                ManipulatorCollection.prototype.Remove = function(id)
                {
                    for (var i = 0; i < this._list.length; i++)
                    {
                        if (this._list[i].ID === id)
                        {
                            this._list.splice(i, 1);
                            break
                        }
                    }
                };
                ManipulatorCollection.prototype.Count = function()
                {
                    return this._list.length
                };
                ManipulatorCollection.prototype.ItemAt = function(index)
                {
                    return this._list[index]
                };
                ManipulatorCollection.prototype.Find = function(id)
                {
                    for (var i = 0; i < this._list.length; i++)
                    {
                        var item = this._list[i];
                        if (item.ID === id)
                        {
                            return item
                        }
                    }
                    return keyword_null
                };
                ManipulatorCollection.prototype.Clear = function()
                {
                    this._list.splice(0, this._list.length)
                };
                return ManipulatorCollection
            })();
        var ManipulationData = (function()
            {
                function ManipulationData(cumulative, delta, velocities)
                {
                    this.Cumulative = cumulative;
                    this.Delta = delta;
                    this.Velocities = velocities
                }
                return ManipulationData
            })();
        var ManipulationEventArgsBase = (function()
            {
                function ManipulationEventArgsBase(originalSource)
                {
                    this.OriginalSource = originalSource
                }
                return ManipulationEventArgsBase
            })();
        var ManipulationCompletedEventArgs = (function(_super)
            {
                __extends(ManipulationCompletedEventArgs, _super);
                function ManipulationCompletedEventArgs(originalSource, cumulative, isInertia, position, velocities)
                {
                    _super.call(this, originalSource);
                    var self = this;
                    self.Cumulative = cumulative;
                    self.IsInertia = isInertia;
                    self.Position = position;
                    self.Velocities = velocities
                }
                return ManipulationCompletedEventArgs
            })(ManipulationEventArgsBase);
        var ManipulationDeltaEventArgs = (function(_super)
            {
                __extends(ManipulationDeltaEventArgs, _super);
                function ManipulationDeltaEventArgs(originalSource, cumulative, delta, isInertia, position, velocities)
                {
                    _super.call(this, originalSource);
                    var self = this;
                    self.Cumulative = cumulative;
                    self.Delta = delta;
                    self.IsInertia = isInertia;
                    self.Position = position;
                    self.Velocities = velocities
                }
                return ManipulationDeltaEventArgs
            })(ManipulationEventArgsBase);
        var ManipulationInertiaStartingEventArgs = (function(_super)
            {
                __extends(ManipulationInertiaStartingEventArgs, _super);
                function ManipulationInertiaStartingEventArgs(originalSource, cumulative, delta, velocities, expansionBehavior, rotationBehavior, translationBehavior)
                {
                    _super.call(this, originalSource);
                    var self = this;
                    self.Cumulative = cumulative;
                    self.Delta = delta;
                    self.Velocities = velocities;
                    self.ExpansionBehavior = expansionBehavior;
                    self.RotationBehavior = rotationBehavior;
                    self.TranslationBehavior = translationBehavior
                }
                return ManipulationInertiaStartingEventArgs
            })(ManipulationEventArgsBase);
        var ManipulationStartedEventArgs = (function(_super)
            {
                __extends(ManipulationStartedEventArgs, _super);
                function ManipulationStartedEventArgs(originalSource, pointerCount, cumulative, position)
                {
                    _super.call(this, originalSource);
                    this.PointerCount = pointerCount;
                    this.Cumulative = cumulative;
                    this.Position = position
                }
                return ManipulationStartedEventArgs
            })(ManipulationEventArgsBase);
        var ManipulationStartingEventArgs = (function(_super)
            {
                __extends(ManipulationStartingEventArgs, _super);
                function ManipulationStartingEventArgs(originalSource, mode, pivot, position)
                {
                    _super.call(this, originalSource);
                    this.Mode = mode;
                    this.Pivot = pivot;
                    this.Position = position
                }
                return ManipulationStartingEventArgs
            })(ManipulationEventArgsBase);
        var TappedEventArgs = (function()
            {
                function TappedEventArgs(location)
                {
                    this.Position = location
                }
                return TappedEventArgs
            })();
        var RightTappedEventArgs = (function()
            {
                function RightTappedEventArgs(location)
                {
                    this.Position = location
                }
                return RightTappedEventArgs
            })();
        var DoubleTappedEventArgs = (function()
            {
                function DoubleTappedEventArgs(location)
                {
                    this.Position = location
                }
                return DoubleTappedEventArgs
            })();
        var ManipulationModes;
        (function(ManipulationModes)
        {
            ManipulationModes[ManipulationModes["All"] = 0x1ff] = "All";
            ManipulationModes[ManipulationModes["None"] = 0] = "None";
            ManipulationModes[ManipulationModes["TranslateX"] = 1] = "TranslateX";
            ManipulationModes[ManipulationModes["TranslateY"] = 0x2] = "TranslateY";
            ManipulationModes[ManipulationModes["TranslateRailsX"] = 0x4] = "TranslateRailsX";
            ManipulationModes[ManipulationModes["TranslateRailsY"] = 0x8] = "TranslateRailsY";
            ManipulationModes[ManipulationModes["Rotate"] = 0x10] = "Rotate";
            ManipulationModes[ManipulationModes["Scale"] = 0x20] = "Scale";
            ManipulationModes[ManipulationModes["TranslateInertia"] = 0x40] = "TranslateInertia";
            ManipulationModes[ManipulationModes["RotateInertia"] = 0x80] = "RotateInertia";
            ManipulationModes[ManipulationModes["ScaleInertia"] = 0x100] = "ScaleInertia"
        })(ManipulationModes || (ManipulationModes = {}));
        var Process;
        (function(Process)
        {
            Process[Process["NotStart"] = 0] = "NotStart";
            Process[Process["Starting"] = 1] = "Starting";
            Process[Process["Started"] = 2] = "Started";
            Process[Process["InertiaStarted"] = 3] = "InertiaStarted"
        })(Process || (Process = {}));
        var DeltaMode;
        (function(DeltaMode)
        {
            DeltaMode[DeltaMode["TranslateX"] = 0] = "TranslateX";
            DeltaMode[DeltaMode["TranslateY"] = 1] = "TranslateY";
            DeltaMode[DeltaMode["Expansion"] = 2] = "Expansion";
            DeltaMode[DeltaMode["Rotation"] = 3] = "Rotation"
        })(DeltaMode || (DeltaMode = {}));
        var SelectionType;
        (function(SelectionType)
        {
            SelectionType[SelectionType["column"] = 1] = "column";
            SelectionType[SelectionType["row"] = 2] = "row";
            SelectionType[SelectionType["range"] = 3] = "range"
        })(SelectionType || (SelectionType = {}));
        var TouchZoomManager = (function()
            {
                function TouchZoomManager(sheet)
                {
                    this._sheet = sheet
                }
                TouchZoomManager.prototype._getTouchCanvas = function(width, height)
                {
                    var canvas = this._canvas;
                    if (!canvas)
                    {
                        canvas = document.createElement("canvas");
                        Sheets.DPIHelper.adjustDevicePixel(canvas, null, this._sheet);
                        Sheets.DPIHelper.setSize(canvas, width, height)
                    }
                    else if (width !== Sheets.DPIHelper.getLogicWidth(canvas) || height !== Sheets.DPIHelper.getLogicHeight(canvas))
                    {
                        Sheets.DPIHelper.setSize(canvas, width, height)
                    }
                    return canvas
                };
                TouchZoomManager.prototype._getNewZoomFactor = function(scale, oldZoomFactor)
                {
                    var newZoomFactor = scale * oldZoomFactor;
                    if (newZoomFactor > 4)
                    {
                        newZoomFactor = 4
                    }
                    else if (newZoomFactor < 0.5)
                    {
                        newZoomFactor = 0.5
                    }
                    return newZoomFactor
                };
                TouchZoomManager.prototype._saveCanvas = function(srcCanvas, oldSheetLayout, oldGroupLayout, oldZoomFactor)
                {
                    var self = this;
                    var canvasWidth = Sheets.DPIHelper.getLogicWidth(srcCanvas),
                        canvasHeight = Sheets.DPIHelper.getLogicHeight(srcCanvas);
                    var canvas = self._getTouchCanvas(canvasWidth, canvasHeight);
                    var ctx = canvas.getContext("2d"),
                        ratioX = Sheets.DPIHelper.getScaleX(canvas),
                        ratioY = Sheets.DPIHelper.getScaleY(canvas);
                    ctx.scale(1 / ratioX, 1 / ratioY);
                    ctx.drawImage(srcCanvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                    ctx.scale(ratioX, ratioY);
                    self._canvas = canvas;
                    self._oldSheetLayout = oldSheetLayout;
                    self._oldGroupLayout = oldGroupLayout;
                    self._oldZoomFactor = oldZoomFactor
                };
                TouchZoomManager.prototype._restoreCanvas = function(destCanvas, newZoomFactor, grayAreaBackColor)
                {
                    var self = this,
                        sheet = self._sheet,
                        x,
                        y,
                        w,
                        h,
                        destX,
                        destY,
                        destW,
                        destH,
                        canvasWidth = Sheets.DPIHelper.getLogicWidth(destCanvas),
                        canvasHeight = Sheets.DPIHelper.getLogicHeight(destCanvas),
                        frozenTrailingColumnCount = sheet.getFrozenTrailingColumnCount(),
                        frozenTrailingRowCount = sheet.getFrozenTrailingRowCount(),
                        TRAILIN_GFREEZELINE_WIDTH = frozenTrailingColumnCount > 0 ? 1 : 0,
                        TRAILING_FREEZELINE_HEIGHT = frozenTrailingRowCount > 0 ? 1 : 0,
                        oldGroupLayout = self._oldGroupLayout,
                        newGroupLayout = sheet._getGroupLayout(),
                        oldSheetLayout = self._oldSheetLayout,
                        newSheetLayout = sheet._getSheetLayout();
                    var cumulativeScale = newZoomFactor / self._oldZoomFactor;
                    var ctx = destCanvas.getContext("2d"),
                        ratioX = Sheets.DPIHelper.getScaleX(destCanvas),
                        ratioY = Sheets.DPIHelper.getScaleY(destCanvas);
                    var canvas = self._canvas;
                    ctx.save();
                    ctx.fillStyle = grayAreaBackColor;
                    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                    sheet._render.paintGroup(ctx, null);
                    x = oldGroupLayout.x + oldGroupLayout.width;
                    y = oldGroupLayout.y + oldGroupLayout.height;
                    w = oldSheetLayout.frozenTrailingX - x - TRAILIN_GFREEZELINE_WIDTH;
                    h = oldSheetLayout.frozenTrailingY - y - TRAILING_FREEZELINE_HEIGHT;
                    destX = newGroupLayout.x + newGroupLayout.width;
                    destY = newGroupLayout.y + newGroupLayout.height;
                    destW = w * cumulativeScale;
                    destH = h * cumulativeScale;
                    x *= ratioX;
                    y *= ratioY;
                    w *= ratioX;
                    h *= ratioY;
                    destX *= ratioX;
                    destY *= ratioY;
                    destW *= ratioX;
                    destH *= ratioY;
                    ctx.scale(1 / ratioX, 1 / ratioY);
                    ctx.drawImage(canvas, x, y, w, h, destX, destY, destW, destH);
                    if (frozenTrailingColumnCount > 0)
                    {
                        x = oldSheetLayout.frozenTrailingX - TRAILIN_GFREEZELINE_WIDTH;
                        y = oldGroupLayout.y + oldGroupLayout.height;
                        w = oldSheetLayout.frozenTrailingWidth + TRAILIN_GFREEZELINE_WIDTH;
                        h = oldSheetLayout.frozenTrailingY - y - TRAILING_FREEZELINE_HEIGHT;
                        destX = newSheetLayout.frozenTrailingX - TRAILIN_GFREEZELINE_WIDTH;
                        destY = newGroupLayout.y + newGroupLayout.height;
                        destW = newSheetLayout.frozenTrailingWidth + TRAILIN_GFREEZELINE_WIDTH;
                        destH = h * cumulativeScale;
                        x *= ratioX;
                        y *= ratioY;
                        w *= ratioX;
                        h *= ratioY;
                        destX *= ratioX;
                        destY *= ratioY;
                        destW *= ratioX;
                        destH *= ratioY;
                        ctx.drawImage(canvas, x, y, w, h, destX, destY, destW, destH)
                    }
                    if (frozenTrailingRowCount > 0)
                    {
                        x = oldGroupLayout.x + oldGroupLayout.width;
                        y = oldSheetLayout.frozenTrailingY - TRAILING_FREEZELINE_HEIGHT;
                        w = oldSheetLayout.frozenTrailingX - x - TRAILIN_GFREEZELINE_WIDTH;
                        h = oldSheetLayout.frozenTrailingHeight + TRAILING_FREEZELINE_HEIGHT;
                        destX = newGroupLayout.x + newGroupLayout.width;
                        destY = newSheetLayout.frozenTrailingY - TRAILING_FREEZELINE_HEIGHT;
                        destW = w * cumulativeScale;
                        destH = newSheetLayout.frozenTrailingHeight + TRAILING_FREEZELINE_HEIGHT;
                        x *= ratioX;
                        y *= ratioY;
                        w *= ratioX;
                        h *= ratioY;
                        destX *= ratioX;
                        destY *= ratioY;
                        destW *= ratioX;
                        destH *= ratioY;
                        ctx.drawImage(canvas, x, y, w, h, destX, destY, destW, destH)
                    }
                    if (frozenTrailingColumnCount > 0 && frozenTrailingRowCount > 0)
                    {
                        x = oldSheetLayout.frozenTrailingX - TRAILIN_GFREEZELINE_WIDTH;
                        y = oldSheetLayout.frozenTrailingY - TRAILING_FREEZELINE_HEIGHT;
                        w = oldSheetLayout.frozenTrailingWidth + TRAILIN_GFREEZELINE_WIDTH;
                        h = oldSheetLayout.frozenTrailingHeight + TRAILING_FREEZELINE_HEIGHT;
                        destX = newSheetLayout.frozenTrailingX - TRAILIN_GFREEZELINE_WIDTH;
                        destY = newSheetLayout.frozenTrailingY - TRAILING_FREEZELINE_HEIGHT;
                        destW = newSheetLayout.frozenTrailingWidth + TRAILIN_GFREEZELINE_WIDTH;
                        destH = newSheetLayout.frozenTrailingHeight + TRAILING_FREEZELINE_HEIGHT;
                        x *= ratioX;
                        y *= ratioY;
                        w *= ratioX;
                        h *= ratioY;
                        destX *= ratioX;
                        destY *= ratioY;
                        destW *= ratioX;
                        destH *= ratioY;
                        ctx.drawImage(canvas, x, y, w, h, destX, destY, destW, destH)
                    }
                    ctx.scale(ratioX, ratioY);
                    ctx.restore()
                };
                TouchZoomManager.prototype.startZoom = function()
                {
                    var self = this,
                        sheet = self._sheet,
                        zoomFactor = sheet._zoomFactor;
                    var ctx = sheet._render._getBufferCtx();
                    if (ctx)
                    {
                        self._saveCanvas(ctx.canvas, sheet._getSheetLayout(), sheet._getGroupLayout(), zoomFactor)
                    }
                };
                TouchZoomManager.prototype.continueZoom = function(cumulativeScale)
                {
                    var self = this,
                        sheet = self._sheet;
                    if (!sheet.endEdit())
                    {
                        return
                    }
                    var newZoomFactor = self._getNewZoomFactor(cumulativeScale, self._oldZoomFactor);
                    if (sheet._zoomFactor !== newZoomFactor)
                    {
                        sheet.triggerUserZooming({
                            sheet: sheet, sheetName: sheet._name, oldZoomFactor: sheet._zoomFactor, newZoomFactor: newZoomFactor
                        });
                        sheet._zoomFactor = newZoomFactor;
                        sheet.invalidateLayout();
                        var render = sheet._render,
                            ctx = render._getCtx();
                        if (ctx)
                        {
                            self._restoreCanvas(ctx.canvas, newZoomFactor, render._getGrayAreaBackColor(false))
                        }
                        render._paintFloatingObject(keyword_null, newZoomFactor);
                        render._paintComment(keyword_null)
                    }
                };
                TouchZoomManager.prototype.endZoom = function(cumulativeScale)
                {
                    var self = this,
                        sheet = self._sheet;
                    sheet._zoomFactor = self._getNewZoomFactor(cumulativeScale, self._oldZoomFactor);
                    sheet._needSyncHScrollbarSize = true;
                    sheet._needSyncVScrollbarSize = true;
                    sheet.invalidateLayout();
                    sheet.repaint()
                };
                return TouchZoomManager
            })();
        var ManipulationScrollDirection;
        (function(ManipulationScrollDirection)
        {
            ManipulationScrollDirection[ManipulationScrollDirection["NotStarted"] = 0] = "NotStarted";
            ManipulationScrollDirection[ManipulationScrollDirection["HorizontalOnly"] = 1] = "HorizontalOnly";
            ManipulationScrollDirection[ManipulationScrollDirection["VecticalOnly"] = 2] = "VecticalOnly";
            ManipulationScrollDirection[ManipulationScrollDirection["Free"] = 3] = "Free"
        })(ManipulationScrollDirection || (ManipulationScrollDirection = {}));
        var TouchScrollManager = (function()
            {
                function TouchScrollManager(sheet)
                {
                    this.BOUNDARY_SCOPE = 200;
                    this.INERTIA_BOUNDARY_SCOPE = 20;
                    this.sheet = sheet
                }
                TouchScrollManager.prototype._getNewTopRowInfo = function(translationY, oldTopRow)
                {
                    var r = oldTopRow,
                        height = 0,
                        offset = 0,
                        sheet = this.sheet,
                        cachePool = sheet._cachePool,
                        minRow,
                        maxRow,
                        viewportY = sheet._getSheetLayout().viewportY,
                        rowLayout = sheet._getViewportRowLayout(1).findRow(r);
                    if (rowLayout)
                    {
                        if (translationY > 0)
                        {
                            minRow = sheet._getScrollableRow(-1);
                            height = viewportY - rowLayout.y;
                            while (r > minRow && height < translationY)
                            {
                                r--;
                                height += cachePool.getZoomRowHeight(r)
                            }
                            offset = translationY - height
                        }
                        else if (translationY < 0)
                        {
                            maxRow = sheet._getLastVisualScrollRow();
                            height = -(rowLayout.y + rowLayout.height - viewportY);
                            while (r < maxRow && height > translationY)
                            {
                                r++;
                                height -= cachePool.getZoomRowHeight(r)
                            }
                            offset = translationY - height
                        }
                    }
                    return {
                            row: r, offset: offset
                        }
                };
                TouchScrollManager.prototype._getNewLeftColumnInfo = function(translationX, oldLeftColumn)
                {
                    var c = oldLeftColumn,
                        width = 0,
                        offset = 0,
                        sheet = this.sheet,
                        minColumn,
                        maxColumn,
                        cachePool = sheet._cachePool,
                        viewportX = sheet._getSheetLayout().viewportX,
                        columnLayout = sheet._getViewportColumnLayout(1).findCol(c);
                    if (columnLayout)
                    {
                        if (translationX > 0)
                        {
                            minColumn = sheet._getScrollableColumn(-1);
                            width = viewportX - columnLayout.x;
                            while (c > minColumn && width < translationX)
                            {
                                c--;
                                width += cachePool.getZoomColWidth(c)
                            }
                            offset = translationX - width
                        }
                        else if (translationX < 0)
                        {
                            maxColumn = sheet._getLastVisualScrollColumn();
                            width = -(columnLayout.x + columnLayout.width - viewportX);
                            while (c < maxColumn && width > translationX)
                            {
                                c++;
                                width -= cachePool.getZoomColWidth(c)
                            }
                            offset = translationX - width
                        }
                    }
                    return {
                            col: c, offset: offset
                        }
                };
                TouchScrollManager.prototype._createTouchViewportColumnLayout = function(offset)
                {
                    var colLayouts = new Sheets._LayoutModel;
                    var sheet = this.sheet,
                        cachePool = sheet._cachePool,
                        layout = sheet._getSheetLayout(),
                        col = Math_max(sheet.frozenColCount, sheet._scrollLeftCol),
                        colCount = sheet.getColumnCount() - sheet._frozenTrailingColCount,
                        colX = layout.viewportX + offset,
                        colWidth,
                        viewportWidth = layout.viewportWidth - offset;
                    for (; viewportWidth > 0 && col < colCount; col++)
                    {
                        colWidth = cachePool.getZoomColWidth(col);
                        colLayouts.push(new Sheets._Layout(-1, col, colX, -1, colWidth, -1));
                        colX += colWidth;
                        viewportWidth -= colWidth
                    }
                    return colLayouts
                };
                TouchScrollManager.prototype._updateTouchViewportColumnLayout = function(offset)
                {
                    var colLayoutCache = this.sheet._colLayoutCache;
                    if (!colLayoutCache.viewport)
                    {
                        colLayoutCache.viewport = {}
                    }
                    colLayoutCache.viewport[1] = this._createTouchViewportColumnLayout(offset)
                };
                TouchScrollManager.prototype._createTouchViewportRowLayout = function(offset)
                {
                    var rowLayouts = new Sheets._LayoutModel;
                    var sheet = this.sheet,
                        cachePool = sheet._cachePool,
                        layout = sheet._getSheetLayout(),
                        row = Math_max(sheet.frozenRowCount, sheet._scrollTopRow),
                        rowCount = sheet.getRowCount() - sheet._frozenTrailingRowCount,
                        rowY = layout.viewportY + offset,
                        rowHeight,
                        viewportHeight = layout.viewportHeight - offset;
                    for (; viewportHeight > 0 && row < rowCount; row++)
                    {
                        rowHeight = cachePool.getZoomRowHeight(row);
                        rowLayouts.push(new Sheets._Layout(row, -1, -1, rowY, -1, rowHeight));
                        rowY += rowHeight;
                        viewportHeight -= rowHeight
                    }
                    return rowLayouts
                };
                TouchScrollManager.prototype._updateTouchViewportRowLayout = function(offset)
                {
                    var rowLayoutCache = this.sheet._rowLayoutCache;
                    if (!rowLayoutCache.viewport)
                    {
                        rowLayoutCache.viewport = {}
                    }
                    rowLayoutCache.viewport[1] = this._createTouchViewportRowLayout(offset)
                };
                TouchScrollManager.prototype._invalidateLayout = function()
                {
                    var sheet = this.sheet,
                        oldViewportColumnLayout = sheet._colLayoutCache.viewport,
                        oldViewportRowLayout = sheet._rowLayoutCache.viewport;
                    sheet.invalidateLayout();
                    sheet._colLayoutCache.viewport = oldViewportColumnLayout;
                    sheet._rowLayoutCache.viewport = oldViewportRowLayout
                };
                TouchScrollManager.prototype._paintAdornment = function(ctx, clipRect)
                {
                    var self = this,
                        sheet = self.sheet,
                        render = sheet._render;
                    if (!ctx || sheet._paintSuspended || sheet._layoutSuspended > 0)
                    {
                        return
                    }
                    var layout = sheet._getSheetLayout(),
                        rect,
                        r,
                        c;
                    if (!sheet._hoverCell)
                    {
                        for (r = 0; r <= 2; r++)
                        {
                            for (c = 0; c <= 2; c++)
                            {
                                rect = layout.viewportRect(r, c);
                                if (!rect || rect.width === 0 || rect.height === 0)
                                {
                                    continue
                                }
                                if (!clipRect || rect.intersectRect(clipRect))
                                {
                                    render.paintSelection(ctx, r, c, clipRect)
                                }
                            }
                        }
                    }
                };
                TouchScrollManager.prototype._getBoundaryFactor = function(distance, scope)
                {
                    return parseInt((-scope / (distance / scope + 1.0) + scope))
                };
                TouchScrollManager.prototype._getDistance = function(boundaryFactor, scope)
                {
                    return parseInt((scope * (-scope / (boundaryFactor - scope) - 1)))
                };
                TouchScrollManager.prototype._triggerTopRowChanged = function(sheet, oldTopRow, newTopRow)
                {
                    sheet.triggerTopRowChanged({
                        sheet: sheet, sheetName: sheet._name, oldTopRow: oldTopRow, newTopRow: newTopRow
                    })
                };
                TouchScrollManager.prototype._triggerLeftColChanged = function(sheet, oldLeftCol, newLeftCol)
                {
                    sheet.triggerLeftColumnChanged({
                        sheet: sheet, sheetName: sheet._name, oldLeftCol: oldLeftCol, newLeftCol: newLeftCol
                    })
                };
                TouchScrollManager.prototype._vScrollTo = function(translationY, isInertia, bufferRect, clipRect)
                {
                    var self = this,
                        sheet = self.sheet,
                        oldTopRow = sheet._scrollTopRow,
                        topRowInfo = self._getNewTopRowInfo(translationY, oldTopRow),
                        newTopRow = topRowInfo.row,
                        offset = topRowInfo.offset;
                    sheet._scrollTopRow = newTopRow;
                    if (sheet._paintSuspended || sheet._layoutSuspended > 0)
                    {
                        return false
                    }
                    if (Sheets.util._useDoubleBuffer())
                    {
                        var bounds = sheet._bounds,
                            layout = sheet._getSheetLayout(),
                            viewportY = layout.viewportY,
                            viewportHeight = layout.viewportHeight,
                            x = (bounds ? bounds.x : layout.x),
                            width = layout.width;
                        var render = sheet._render,
                            ctx = render._getCtx();
                        if (translationY < 0)
                        {
                            self.cachedOffsetY = 0;
                            self.cachedAvailableOffsetY = 0;
                            var rl1,
                                rl2;
                            var rowLayouts = sheet._getViewportRowLayout(1);
                            if (rowLayouts && rowLayouts.length > 0)
                            {
                                rl1 = rowLayouts.findRow(newTopRow)
                            }
                            if (rl1)
                            {
                                rl2 = rowLayouts[rowLayouts.length - 1];
                                if (rl2.row >= newTopRow)
                                {
                                    var adj = 2;
                                    var y = viewportY + Math_abs(translationY);
                                    var height = Math_min(viewportY + viewportHeight, rl2.y + rl2.height) - y;
                                    if (height >= 0)
                                    {
                                        height -= adj;
                                        self._updateTouchViewportRowLayout(offset - rl1.height);
                                        bufferRect.x = x;
                                        bufferRect.y = y;
                                        bufferRect.width = width;
                                        bufferRect.height = height;
                                        bufferRect.tx = x;
                                        bufferRect.ty = viewportY;
                                        clipRect.x = x;
                                        clipRect.y = viewportY + height;
                                        clipRect.width = width;
                                        clipRect.height = viewportHeight - height
                                    }
                                }
                            }
                        }
                        else if (translationY > 0)
                        {
                            var minRow = sheet._getScrollableRow(-1);
                            if (newTopRow === minRow && offset > 0)
                            {
                                if (self.cachedOffsetY > 0 && self.cachedAvailableOffsetY > 0)
                                {
                                    var offsetY = self.cachedOffsetY + translationY,
                                        availableOffsetY = self._getBoundaryFactor(offsetY, self.BOUNDARY_SCOPE);
                                    translationY = availableOffsetY - self.cachedAvailableOffsetY;
                                    offset = availableOffsetY;
                                    if (translationY <= 0)
                                    {
                                        return isInertia
                                    }
                                    if (isInertia && availableOffsetY >= self.INERTIA_BOUNDARY_SCOPE)
                                    {
                                        return true
                                    }
                                    self.cachedOffsetY = offsetY;
                                    self.cachedAvailableOffsetY = availableOffsetY
                                }
                                else
                                {
                                    if (offset >= self.BOUNDARY_SCOPE)
                                    {
                                        translationY -= offset - (self.BOUNDARY_SCOPE - 1);
                                        offset = self.BOUNDARY_SCOPE - 1;
                                        if (translationY <= 0)
                                        {
                                            return isInertia
                                        }
                                    }
                                    var offsetY = self._getDistance(offset, self.BOUNDARY_SCOPE),
                                        availableOffsetY = offset;
                                    if (isInertia && availableOffsetY >= self.INERTIA_BOUNDARY_SCOPE)
                                    {
                                        return true
                                    }
                                    self.cachedOffsetY = offsetY;
                                    self.cachedAvailableOffsetY = availableOffsetY
                                }
                            }
                            else
                            {
                                self.cachedOffsetY = 0;
                                self.cachedAvailableOffsetY = 0
                            }
                            if (translationY < viewportHeight)
                            {
                                var adj = 2;
                                var y = viewportY;
                                var height = viewportHeight - translationY;
                                if (sheet.getFrozenTrailingRowCount() > 0)
                                {
                                    height -= 1
                                }
                                self._updateTouchViewportRowLayout(offset);
                                bufferRect.x = x;
                                bufferRect.y = y;
                                bufferRect.width = width;
                                bufferRect.height = height;
                                bufferRect.tx = x;
                                bufferRect.ty = y + translationY;
                                clipRect.x = x;
                                clipRect.y = y;
                                clipRect.width = width;
                                clipRect.height = translationY + adj
                            }
                        }
                    }
                    return false
                };
                TouchScrollManager.prototype._hScrollTo = function(translationX, isInertia, bufferRect, clipRect)
                {
                    var self = this,
                        sheet = self.sheet,
                        oldLeftCol = sheet._scrollLeftCol,
                        leftColumnInfo = self._getNewLeftColumnInfo(translationX, oldLeftCol),
                        newLeftCol = leftColumnInfo.col,
                        offset = leftColumnInfo.offset;
                    sheet._scrollLeftCol = newLeftCol;
                    if (sheet._paintSuspended || sheet._layoutSuspended > 0)
                    {
                        return false
                    }
                    if (Sheets.util._useDoubleBuffer())
                    {
                        var bounds = sheet._bounds,
                            layout = sheet._getSheetLayout(),
                            viewportX = layout.viewportX,
                            viewportWidth = layout.viewportWidth,
                            y = (bounds ? bounds.y : layout.y),
                            height = layout.height;
                        var render = sheet._render,
                            ctx = render._getCtx();
                        if (translationX < 0)
                        {
                            self.cachedOffsetX = 0;
                            self.cachedAvailableOffsetX = 0;
                            var cl1,
                                cl2;
                            var colLayouts = sheet._getViewportColumnLayout(1);
                            if (colLayouts && colLayouts.length > 0)
                            {
                                cl1 = colLayouts.findCol(newLeftCol)
                            }
                            if (cl1)
                            {
                                cl2 = colLayouts[colLayouts.length - 1];
                                if (cl2.col >= newLeftCol)
                                {
                                    var adj = 2;
                                    var x = viewportX + Math_abs(translationX);
                                    var width = Math_min(viewportX + viewportWidth, cl2.x + cl2.width) - x;
                                    if (width >= 0)
                                    {
                                        width -= adj;
                                        self._updateTouchViewportColumnLayout(offset - cl1.width);
                                        bufferRect.x = x;
                                        bufferRect.y = y;
                                        bufferRect.width = width;
                                        bufferRect.height = height;
                                        bufferRect.tx = viewportX;
                                        bufferRect.ty = y;
                                        clipRect.x = viewportX + width;
                                        clipRect.y = y;
                                        clipRect.width = viewportWidth - width;
                                        clipRect.height = height
                                    }
                                }
                            }
                        }
                        else if (translationX > 0)
                        {
                            var minColumn = sheet._getScrollableColumn(-1);
                            if (newLeftCol === minColumn && offset > 0)
                            {
                                if (self.cachedOffsetX > 0 && self.cachedAvailableOffsetX > 0)
                                {
                                    var offsetX = self.cachedOffsetX + translationX,
                                        availableOffsetX = self._getBoundaryFactor(offsetX, self.BOUNDARY_SCOPE);
                                    translationX = availableOffsetX - self.cachedAvailableOffsetX;
                                    offset = availableOffsetX;
                                    if (translationX <= 0)
                                    {
                                        return isInertia
                                    }
                                    if (isInertia && availableOffsetX >= self.INERTIA_BOUNDARY_SCOPE)
                                    {
                                        return true
                                    }
                                    self.cachedOffsetX = offsetX;
                                    self.cachedAvailableOffsetX = availableOffsetX
                                }
                                else
                                {
                                    if (offset >= self.BOUNDARY_SCOPE)
                                    {
                                        translationX -= offset - (self.BOUNDARY_SCOPE - 1);
                                        offset = self.BOUNDARY_SCOPE - 1;
                                        if (translationX <= 0)
                                        {
                                            return isInertia
                                        }
                                    }
                                    var offsetX = self._getDistance(offset, self.BOUNDARY_SCOPE),
                                        availableOffsetX = offset;
                                    if (isInertia && availableOffsetX >= self.INERTIA_BOUNDARY_SCOPE)
                                    {
                                        return true
                                    }
                                    self.cachedOffsetX = offsetX;
                                    self.cachedAvailableOffsetX = availableOffsetX
                                }
                            }
                            else
                            {
                                self.cachedOffsetX = 0;
                                self.cachedAvailableOffsetX = 0
                            }
                            if (translationX < viewportWidth)
                            {
                                var adj = 2;
                                var x = viewportX;
                                var width = viewportWidth - translationX;
                                if (sheet.getFrozenTrailingColumnCount() > 0)
                                {
                                    width -= 1
                                }
                                self._updateTouchViewportColumnLayout(offset);
                                bufferRect.x = x;
                                bufferRect.y = y;
                                bufferRect.width = width;
                                bufferRect.height = height;
                                bufferRect.tx = x + translationX;
                                bufferRect.ty = y;
                                clipRect.x = x;
                                clipRect.y = y;
                                clipRect.width = translationX + adj;
                                clipRect.height = height
                            }
                        }
                    }
                    return false
                };
                TouchScrollManager.prototype._fillRect = function(ctx, fillStyle, x, y, width, height)
                {
                    ctx.fillStyle = fillStyle;
                    ctx.fillRect(x, y, width, height)
                };
                TouchScrollManager.prototype._getColHeaderFillStyle = function(ctx, x, y, w, h)
                {
                    var fillStyle,
                        themeStyle = Sheets.Global.prototype.getExternalThemeStyle(0, "gc-colHeaderFill"),
                        backgroundImg = themeStyle && themeStyle.backgroundImage,
                        backgroundColor = themeStyle && themeStyle.backgroundColor;
                    if (backgroundImg && backgroundImg.indexOf("linear-gradient") !== -1)
                    {
                        var colors = Sheets.util.getLinearGradientColors(backgroundImg);
                        fillStyle = ctx.createLinearGradient(x + w / 2, y, x + w / 2, y + h);
                        for (var i = 0, len = colors.length; i < len; i++)
                        {
                            var color = colors[i];
                            fillStyle.addColorStop(color.point, color.color)
                        }
                    }
                    else if (backgroundColor)
                    {
                        fillStyle = backgroundColor
                    }
                    return fillStyle
                };
                TouchScrollManager.prototype._getRowHeaderFillStyle = function(ctx, x, y, w, h)
                {
                    var themeStyle = Sheets.Global.prototype.getExternalThemeStyle(0, "gc-rowHeaderFill");
                    return themeStyle && themeStyle.backgroundColor
                };
                TouchScrollManager.prototype._fillGrayArea = function(considerHeader)
                {
                    var self = this,
                        sheet = self.sheet,
                        bounds = sheet._bounds,
                        layout = sheet._getSheetLayout(),
                        render = sheet._render,
                        grayAreaBackColor = render._getGrayAreaBackColor(false),
                        ctx = render._getCtx(),
                        bufferCtx = render._getBufferCtx(),
                        x,
                        y,
                        width,
                        height;
                    var viewportRowLayout = sheet._getViewportRowLayout(1);
                    x = layout.headerX;
                    width = layout.width;
                    var firstRow = sheet._getScrollableRow(-1);
                    var firstRowLayout = viewportRowLayout.findRow(firstRow);
                    if (firstRowLayout)
                    {
                        y = layout.viewportY;
                        height = firstRowLayout.y - y - 1;
                        if (height > 0)
                        {
                            if (considerHeader)
                            {
                                var rowHeaderWidth = layout.rowHeaderWidth,
                                    rowHeaderFillStyle = self._getRowHeaderFillStyle(ctx, x, y, rowHeaderWidth - 1, height + 1);
                                self._fillRect(ctx, rowHeaderFillStyle, x, y, rowHeaderWidth - 1, height + 1);
                                self._fillRect(bufferCtx, rowHeaderFillStyle, x, y, rowHeaderWidth - 1, height + 1);
                                self._fillRect(ctx, grayAreaBackColor, x + rowHeaderWidth, y, width - rowHeaderWidth, height);
                                self._fillRect(bufferCtx, grayAreaBackColor, x + rowHeaderWidth, y, width - rowHeaderWidth, height)
                            }
                            else
                            {
                                self._fillRect(ctx, grayAreaBackColor, x, y, width, height);
                                self._fillRect(bufferCtx, grayAreaBackColor, x, y, width, height)
                            }
                        }
                    }
                    var lastRow = sheet._getScrollableRow(sheet.getRowCount(), true);
                    var lastRowLayout = viewportRowLayout.findRow(lastRow);
                    if (lastRowLayout)
                    {
                        y = lastRowLayout.y + lastRowLayout.height;
                        height = layout.frozenTrailingY - y - 1;
                        if (height > 0)
                        {
                            self._fillRect(ctx, grayAreaBackColor, x, y, width, height);
                            self._fillRect(bufferCtx, grayAreaBackColor, x, y, width, height)
                        }
                    }
                    var viewportColLayout = sheet._getViewportColumnLayout(1);
                    y = layout.headerY;
                    height = layout.height;
                    var firstCol = sheet._getScrollableColumn(-1);
                    var firstColLayout = viewportColLayout.findCol(firstCol);
                    if (firstColLayout)
                    {
                        x = layout.viewportX;
                        width = firstColLayout.x - x - 1;
                        if (width > 0)
                        {
                            if (considerHeader)
                            {
                                var colHeaderHeight = layout.colHeaderHeight,
                                    colHeaderFillStyle = self._getColHeaderFillStyle(ctx, x, y, width + 1, colHeaderHeight - 1);
                                self._fillRect(ctx, colHeaderFillStyle, x, y, width + 1, colHeaderHeight - 1);
                                self._fillRect(bufferCtx, colHeaderFillStyle, x, y, width + 1, colHeaderHeight - 1);
                                self._fillRect(ctx, grayAreaBackColor, x, y + colHeaderHeight, width, height - colHeaderHeight);
                                self._fillRect(bufferCtx, grayAreaBackColor, x, y + colHeaderHeight, width, height - colHeaderHeight)
                            }
                            else
                            {
                                self._fillRect(ctx, grayAreaBackColor, x, y, width, height);
                                self._fillRect(bufferCtx, grayAreaBackColor, x, y, width, height)
                            }
                        }
                    }
                    var lastCol = sheet._getScrollableColumn(sheet.getColumnCount(), true);
                    var lastColLayout = viewportColLayout.findCol(lastCol);
                    if (lastColLayout)
                    {
                        x = lastColLayout.x + lastColLayout.width;
                        width = layout.frozenTrailingX - x - 1;
                        if (width > 0)
                        {
                            self._fillRect(ctx, grayAreaBackColor, x, y, width, height);
                            self._fillRect(bufferCtx, grayAreaBackColor, x, y, width, height)
                        }
                    }
                };
                TouchScrollManager.prototype._strokeLine = function(ctx, strokeStyle, x1, y1, x2, y2)
                {
                    ctx.beginPath();
                    ctx.strokeStyle = strokeStyle;
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke()
                };
                TouchScrollManager.prototype._makeUpGridline = function(considerHeader)
                {
                    var self = this,
                        sheet = self.sheet,
                        bounds = sheet._bounds,
                        layout = sheet._getSheetLayout(),
                        render = sheet._render,
                        viewportGridlineColor = sheet.gridline.color,
                        headerGridlineColor = "#9eb6ce",
                        ctx = render._getCtx(),
                        x,
                        y,
                        width,
                        height;
                    var viewportRowLayout = sheet._getViewportRowLayout(1);
                    x = layout.headerX;
                    width = layout.width;
                    var firstRow = sheet._getScrollableRow(-1);
                    var firstRowLayout = viewportRowLayout.findRow(firstRow);
                    if (firstRowLayout)
                    {
                        y = layout.viewportY;
                        height = firstRowLayout.y - y;
                        if (height > 0)
                        {
                            self._strokeLine(ctx, viewportGridlineColor, x, firstRowLayout.y - 0.5, x + width, firstRowLayout.y - 0.5);
                            if (considerHeader)
                            {
                                self._strokeLine(ctx, headerGridlineColor, layout.frozenX - 0.5, y, layout.frozenX - 0.5, firstRowLayout.y)
                            }
                        }
                    }
                    var viewportColLayout = sheet._getViewportColumnLayout(1);
                    y = layout.headerY;
                    height = layout.height;
                    var firstCol = sheet._getScrollableColumn(-1);
                    var firstColLayout = viewportColLayout.findCol(firstCol);
                    if (firstColLayout)
                    {
                        x = layout.viewportX;
                        width = firstColLayout.x - x;
                        if (width > 0)
                        {
                            self._strokeLine(ctx, viewportGridlineColor, firstColLayout.x - 0.5, y, firstColLayout.x - 0.5, y + height);
                            if (considerHeader)
                            {
                                self._strokeLine(ctx, headerGridlineColor, x, layout.frozenY - 0.5, firstColLayout.x, layout.frozenY - 0.5)
                            }
                        }
                    }
                };
                TouchScrollManager.prototype._getScrollDirection = function(deltaTranslationX, deltaTranslationY)
                {
                    var dir = 0;
                    if (this.sheet.parent && this.sheet.parent.touchScrollOnRails())
                    {
                        dir |= deltaTranslationX !== 0 ? 1 : 0;
                        dir |= deltaTranslationY !== 0 ? 2 : 0
                    }
                    else
                    {
                        dir = 3
                    }
                    return dir
                };
                TouchScrollManager.prototype._continueScrollCore = function(deltaTranslationX, deltaTranslationY, dir, isInertia)
                {
                    var self = this,
                        sheet = self.sheet,
                        isVerticalCompleted = true,
                        isHorizontalCompleted = true,
                        render = sheet._render,
                        ctx = render._getCtx();
                    var bufferRect,
                        clipRect,
                        bufferRect2,
                        clipRect2,
                        paintV = (dir & 2) !== 0,
                        paintH = (dir & 1) !== 0;
                    if (!paintH && !paintV)
                    {
                        return
                    }
                    var bounds = sheet._bounds,
                        layout = sheet._getSheetLayout(),
                        y = (bounds ? bounds.y : layout.y),
                        height = layout.height,
                        x = (bounds ? bounds.x : layout.x),
                        width = layout.width;
                    if (paintV)
                    {
                        clipRect = {};
                        bufferRect = {};
                        isVerticalCompleted = self._vScrollTo(deltaTranslationY, isInertia, bufferRect, clipRect);
                        render.copyScreen(bufferRect.x, bufferRect.y, bufferRect.width, bufferRect.height, bufferRect.tx, bufferRect.ty)
                    }
                    if (paintH)
                    {
                        bufferRect2 = {};
                        clipRect2 = {};
                        isHorizontalCompleted = self._hScrollTo(deltaTranslationX, isInertia, bufferRect2, clipRect2);
                        render.copyScreen(bufferRect2.x, bufferRect2.y, bufferRect2.width, bufferRect2.height, bufferRect2.tx, bufferRect2.ty);
                        if (paintV)
                        {}
                        else
                        {
                            bufferRect = bufferRect2;
                            clipRect = clipRect2
                        }
                    }
                    var sp = sheet.parent;
                    if (sp && !sp._scrollbarShowMax)
                    {
                        if (paintH)
                        {
                            sheet._needSyncHScrollbarSize = true
                        }
                        if (paintV)
                        {
                            sheet._needSyncVScrollbarSize = true
                        }
                    }
                    self._invalidateLayout();
                    if (paintH && paintV)
                    {
                        render.paintBody(ctx, new Sheets.Rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height), new Sheets.Rect(clipRect2.x, clipRect2.y, clipRect2.width, clipRect2.height))
                    }
                    else
                    {
                        render.paintBody(ctx, new Sheets.Rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height))
                    }
                    self._paintAdornment(ctx, new Sheets.Rect(x, y, width, height));
                    self._makeUpGridline(true);
                    self._fillGrayArea(true);
                    this.onSheetScroll(paintH, paintV);
                    return isVerticalCompleted && isHorizontalCompleted
                };
                TouchScrollManager.prototype.onSheetScroll = function(hScroll, vScroll)
                {
                    var sheet = this.sheet;
                    if (vScroll)
                    {
                        sheet._syncVScrollbarPosition()
                    }
                    if (hScroll)
                    {
                        sheet._syncHScollbarPosition()
                    }
                    sheet._eventHandler.updateEditingEditor();
                    var commentManager = sheet._commentManager;
                    if (commentManager)
                    {
                        commentManager.updateCommentsLayoutWhenSheetScroll()
                    }
                };
                TouchScrollManager.prototype._getCurrentPositionByTime = function(time, isPositive, timeUnit, positionUnit)
                {
                    time /= timeUnit;
                    return Math_pow(0.75, time) * positionUnit * (isPositive ? 1 : -1)
                };
                TouchScrollManager.prototype._getCurrentTimeByPosition = function(position, timeUnit, positionUnit)
                {
                    position = Math_abs(position);
                    position /= positionUnit;
                    return Math_log(position) / Math_log(0.75) * timeUnit
                };
                TouchScrollManager.prototype._buildScrollDirection = function(isTranslationXFinished, isTranslationYFinished)
                {
                    var dir = 0;
                    if (!isTranslationXFinished)
                    {
                        dir |= 1
                    }
                    if (!isTranslationYFinished)
                    {
                        dir |= 2
                    }
                    return dir
                };
                TouchScrollManager.prototype._endScrollWithAnimation = function(translationX, translationY, isInertia)
                {
                    var self = this,
                        sheet = self.sheet,
                        POSITION_UNIT = self.BOUNDARY_SCOPE,
                        TIME_UNIT = 10,
                        TIME_INTERVAL = 20,
                        TOTAL_TIME = 100,
                        currentTimeX = self._getCurrentTimeByPosition(translationX, TIME_UNIT, POSITION_UNIT),
                        currentTimeY = self._getCurrentTimeByPosition(translationY, TIME_UNIT, POSITION_UNIT),
                        lastPositionX = translationX,
                        lastPositionY = translationY,
                        cumulativeTranslationX = 0,
                        cumulativeTranslationY = 0,
                        isTranslationXFinished = false,
                        isTranslationYFinished = false;
                    self.interval = setInterval(function()
                    {
                        if (isTranslationXFinished && isTranslationYFinished)
                        {
                            sheet._cachePool.endCache();
                            var sp = sheet.parent;
                            if (sp && !sp._scrollbarShowMax)
                            {
                                sheet._needSyncHScrollbarSize = true;
                                sheet._needSyncVScrollbarSize = true
                            }
                            sheet._cachePool.clearCacheEndPan();
                            sheet.invalidateLayout();
                            sheet.repaint();
                            sheet._syncHScollbarPosition();
                            sheet._syncVScrollbarPosition();
                            clearInterval(self.interval);
                            self.interval = keyword_null;
                            return
                        }
                        currentTimeX += TIME_INTERVAL;
                        currentTimeY += TIME_INTERVAL;
                        if (currentTimeX > TOTAL_TIME && currentTimeY > TOTAL_TIME)
                        {
                            self._continueScrollCore(translationX - cumulativeTranslationX, translationY - cumulativeTranslationY, self._buildScrollDirection(isTranslationXFinished, isTranslationYFinished), isInertia);
                            isTranslationXFinished = true;
                            isTranslationYFinished = true
                        }
                        else
                        {
                            if (currentTimeX > TOTAL_TIME && !isTranslationXFinished)
                            {
                                self._continueScrollCore(translationX - cumulativeTranslationX, 0, 1, isInertia);
                                isTranslationXFinished = true
                            }
                            if (currentTimeY > TOTAL_TIME && !isTranslationYFinished)
                            {
                                self._continueScrollCore(0, translationY - cumulativeTranslationY, 2, isInertia);
                                isTranslationYFinished = true
                            }
                            var currentPositionX = self._getCurrentPositionByTime(currentTimeX, translationX > 0, TIME_UNIT, POSITION_UNIT),
                                currentPositionY = self._getCurrentPositionByTime(currentTimeY, translationY > 0, TIME_UNIT, POSITION_UNIT),
                                deltaTranslationX = Math_floor(lastPositionX - currentPositionX),
                                deltaTranslationY = Math_floor(lastPositionY - currentPositionY);
                            self._continueScrollCore(deltaTranslationX, deltaTranslationY, self._buildScrollDirection(isTranslationXFinished, isTranslationYFinished), isInertia);
                            lastPositionX = currentPositionX;
                            lastPositionY = currentPositionY;
                            cumulativeTranslationX += deltaTranslationX;
                            cumulativeTranslationY += deltaTranslationY
                        }
                    }, TIME_INTERVAL)
                };
                TouchScrollManager.prototype.startScroll = function(isPan)
                {
                    var self = this;
                    if (self.interval)
                    {
                        self.sheet._cachePool.clearCacheEndPan();
                        clearInterval(this.interval);
                        self.interval = keyword_null
                    }
                    self.cachedOffsetX = 0;
                    self.cachedAvailableOffsetX = 0;
                    self.cachedOffsetY = 0;
                    self.cachedAvailableOffsetY = 0;
                    self.oldScrollTopRow = self.sheet._scrollTopRow;
                    self.oldScrollLeftCol = self.sheet._scrollLeftCol;
                    if (isPan)
                    {
                        self.sheet._cachePool.startCacheBeforPan()
                    }
                };
                TouchScrollManager.prototype.continueScroll = function(deltaTranslation, isInertia)
                {
                    var deltaTranslationX = parseInt(deltaTranslation.X),
                        deltaTranslationY = parseInt(deltaTranslation.Y);
                    var dir = this._getScrollDirection(deltaTranslationX, deltaTranslationY);
                    return this._continueScrollCore(deltaTranslationX, deltaTranslationY, dir, isInertia)
                };
                TouchScrollManager.prototype.endScroll = function(isInertia)
                {
                    var self = this,
                        sheet = self.sheet;
                    var sheetLayout = sheet._getSheetLayout(),
                        viewportX = sheetLayout.viewportX,
                        viewportY = sheetLayout.viewportY;
                    var colLayouts = sheet._getViewportColumnLayout(1),
                        cl,
                        maxColumn = sheet._getLastVisualScrollColumn();
                    if (colLayouts && colLayouts.length > 0)
                    {
                        var scrollLeftCol = sheet._scrollLeftCol;
                        cl = colLayouts.findCol(scrollLeftCol);
                        if (scrollLeftCol < maxColumn && cl && cl.x + cl.width - viewportX < cl.width / 2)
                        {
                            sheet._scrollLeftCol++
                        }
                    }
                    var rowLayouts = sheet._getViewportRowLayout(1),
                        rl,
                        maxRow = sheet._getLastVisualScrollRow();
                    if (rowLayouts && rowLayouts.length > 0)
                    {
                        var scrollTopRow = sheet._scrollTopRow;
                        rl = rowLayouts.findRow(scrollTopRow);
                        if (scrollTopRow < maxRow && rl && rl.y + rl.height - viewportY < rl.height / 2)
                        {
                            sheet._scrollTopRow++
                        }
                    }
                    var translationX = 0,
                        translationY = 0;
                    if (colLayouts && colLayouts.length > 0)
                    {
                        cl = colLayouts.findCol(sheet._scrollLeftCol);
                        translationX = viewportX - cl.x
                    }
                    if (rowLayouts && rowLayouts.length > 0)
                    {
                        rl = rowLayouts.findRow(sheet._scrollTopRow);
                        translationY = viewportY - rl.y
                    }
                    var newTopRow = sheet._scrollTopRow,
                        oldTopRow = self.oldScrollTopRow;
                    if (newTopRow !== oldTopRow)
                    {
                        self._triggerTopRowChanged(sheet, oldTopRow, newTopRow)
                    }
                    var newLeftCol = sheet._scrollLeftCol,
                        oldLeftCol = self.oldScrollLeftCol;
                    if (newLeftCol !== oldLeftCol)
                    {
                        self._triggerLeftColChanged(sheet, oldLeftCol, newLeftCol)
                    }
                    self._endScrollWithAnimation(translationX, translationY, isInertia)
                };
                return TouchScrollManager
            })();
        var TouchEventHandler = (function()
            {
                function TouchEventHandler(sheet)
                {
                    this._touchZoomManager = new TouchZoomManager(sheet);
                    this._touchScrollManager = new TouchScrollManager(sheet);
                    this.sheet = sheet
                }
                TouchEventHandler.prototype.doManipulationStarting = function(e)
                {
                    var sheet = this.sheet,
                        sheetLayout = sheet._getSheetLayout();
                    e.Mode = 0;
                    var target = this._touchHitTest(e.Position.X, e.Position.Y);
                    if (target && (target.resizeInfo || (target.dragInfo && target.dragInfo.side === "corner") || target.selectionHitInfo))
                    {
                        if (sheetLayout.viewportY <= target.y && target.y < sheetLayout.frozenTrailingY)
                        {
                            e.Mode |= 2
                        }
                        if (sheetLayout.viewportX <= target.x && target.x < sheetLayout.frozenTrailingX)
                        {
                            e.Mode |= 1
                        }
                    }
                    else
                    {
                        if (sheetLayout.viewportY <= target.y && target.y < sheetLayout.frozenTrailingY)
                        {
                            e.Mode |= 2
                        }
                        if (sheetLayout.viewportX <= target.x && target.x < sheetLayout.frozenTrailingX)
                        {
                            e.Mode |= 1
                        }
                        e.Mode |= 64 | 32;
                        if (this.sheet.parent && this.sheet.parent.touchScrollOnRails())
                        {
                            e.Mode |= 4 | 8
                        }
                    }
                };
                TouchEventHandler.prototype.doManipulationStarted = function(e)
                {
                    var self = this;
                    var sheet = self.sheet;
                    var eventHandler = sheet._eventHandler;
                    var render = sheet._render;
                    var target = self._touchHitTest(e.Position.X, e.Position.Y);
                    sheet._currentTarget = target;
                    if (target.resizeInfo)
                    {
                        if (!sheet.endEdit())
                        {
                            return
                        }
                        eventHandler.startResizing(target)
                    }
                    else if (target.dragInfo && target.dragInfo.side === "corner")
                    {
                        eventHandler.startDragFill(target)
                    }
                    else if (target.selectionHitInfo)
                    {
                        if (!sheet.endEdit())
                        {
                            return
                        }
                        var selectionHitInfo = target.selectionHitInfo;
                        var isHeader = selectionHitInfo.isHeader,
                            isFirstIndicator = selectionHitInfo.isFirstIndicator,
                            selectionType = selectionHitInfo.type;
                        if (isHeader)
                        {
                            eventHandler._startSelectingCore(target, true)
                        }
                        var hitTestType = target.hitTestType;
                        target.hitTestType = target.selectionHitInfo.type;
                        eventHandler._startSelectingScroll(target);
                        target.hitTestType = hitTestType;
                        self._changeActiveCellBeforeSelect(isHeader, isFirstIndicator, selectionType);
                        render._showTouchSelectionIndicator = false;
                        render.refreshTouchSelectionIndicator()
                    }
                    else
                    {
                        var commentRender = sheet._commentRender;
                        if (commentRender)
                        {
                            commentRender.showWhenTouchMoveOrScroll = false
                        }
                        render._showTouchSelectionIndicator = false;
                        render.refreshTouchSelectionIndicator();
                        self._touchZoomManager.startZoom();
                        self._touchScrollManager.startScroll(e.PointerCount === 1)
                    }
                };
                TouchEventHandler.prototype.doManipulationDelta = function(e)
                {
                    var self = this;
                    var sheet = self.sheet;
                    var eventHandler = sheet._eventHandler;
                    var positionX = e.Position.X,
                        positionY = e.Position.Y;
                    if (sheet._currentTarget)
                    {
                        var currentTarget = sheet._currentTarget;
                        if (currentTarget.resizeInfo)
                        {
                            eventHandler.mousePosition = {
                                e: e, x: positionX, y: positionY
                            };
                            eventHandler.continueResizing()
                        }
                        else if (currentTarget.dragInfo && currentTarget.dragInfo.side === "corner")
                        {
                            eventHandler.mousePosition = {
                                e: e, x: positionX, y: positionY
                            };
                            eventHandler.continueDragFill()
                        }
                        else if (currentTarget.selectionHitInfo || eventHandler.isSelecting)
                        {
                            var selectionHitInfo = currentTarget.selectionHitInfo;
                            if (selectionHitInfo)
                            {
                                if (!eventHandler.startHitInfo || !eventHandler.isWorking)
                                {
                                    return
                                }
                                if (eventHandler._forceCancelSelectiong === true)
                                {
                                    return
                                }
                                var selectionType = selectionHitInfo.type;
                                eventHandler.mousePosition = {
                                    e: e, x: positionX, y: positionY
                                };
                                if (selectionType === 3)
                                {
                                    eventHandler.continueCellSelecting()
                                }
                                else if (selectionType === 2)
                                {
                                    eventHandler.continueRowSelecting()
                                }
                                else if (selectionType === 1)
                                {
                                    eventHandler.continueColumnSelecting()
                                }
                            }
                        }
                        else
                        {
                            var scale = e.Cumulative.Scale;
                            if (scale !== 1 && sheet.parent && sheet.parent._allowUserZoom)
                            {
                                self._touchZoomManager.continueZoom(scale)
                            }
                            else
                            {
                                e.IsComplete = self._touchScrollManager.continueScroll(e.Delta.Translation, e.IsInertia)
                            }
                        }
                    }
                };
                TouchEventHandler.prototype.doManipulationInertiaStarting = function(e){};
                TouchEventHandler.prototype.doManipulationCompleted = function(e)
                {
                    var self = this;
                    var sheet = self.sheet;
                    var eventHandler = sheet._eventHandler;
                    var render = sheet._render;
                    render._showTouchSelectionIndicator = true;
                    var currentTarget = sheet._currentTarget;
                    if (currentTarget.resizeInfo)
                    {
                        eventHandler.stopResizing()
                    }
                    else if (currentTarget.dragInfo && eventHandler.isDraggingFill)
                    {
                        eventHandler.endDragFill();
                        sheet.parent.touchToolStrip._closeAutoFillIndicator()
                    }
                    else if (currentTarget.selectionHitInfo || eventHandler.isSelecting)
                    {
                        eventHandler.stopSelecting();
                        var selectionHitInfo = currentTarget.selectionHitInfo;
                        if (selectionHitInfo)
                        {
                            var isHeader = selectionHitInfo.isHeader,
                                isFirstIndicator = selectionHitInfo.isFirstIndicator,
                                selectionType = selectionHitInfo.type;
                            self._changeActiveCellAfterSelect(isHeader, isFirstIndicator, selectionType)
                        }
                        render.repaintSelection()
                    }
                    else
                    {
                        var scale = e.Cumulative.Scale;
                        var commentRender = sheet._commentRender;
                        if (commentRender)
                        {
                            commentRender.showWhenTouchMoveOrScroll = true
                        }
                        if (scale !== 1 && sheet.parent && sheet.parent._allowUserZoom)
                        {
                            self._touchZoomManager.endZoom(scale)
                        }
                        else
                        {
                            self._touchScrollManager.endScroll(e.IsInertia)
                        }
                    }
                };
                TouchEventHandler.prototype.doTapped = function(e)
                {
                    var self = this;
                    var sheet = self.sheet;
                    var cellTypeCauseSelectionChanged = false;
                    self._clearTouchToolStripTimeout();
                    if (typeof sheet.unSelectAllFloatingObjects === 'function')
                    {
                        sheet.unSelectAllFloatingObjects()
                    }
                    var commentManager = sheet._commentManager;
                    if (commentManager)
                    {
                        commentManager.deactivateComment()
                    }
                    var eventHandler = sheet._eventHandler;
                    var target = self._touchHitTest(e.Position.X, e.Position.Y, true);
                    var row = target.row,
                        col = target.col;
                    var hitInfo = target.groupHitInfo;
                    if (hitInfo)
                    {
                        if (!sheet.isEditing())
                        {
                            eventHandler._doClickRangeGroup(hitInfo)
                        }
                    }
                    else
                    {
                        sheet._currentTarget = target;
                        if (target.filterButtonHitInfo)
                        {
                            if (!sheet.endEdit())
                            {
                                return
                            }
                            var filterButtonHitInfo = target.filterButtonHitInfo;
                            if (filterButtonHitInfo.rowFilter)
                            {
                                filterButtonHitInfo.rowFilter.openFilterDialog(filterButtonHitInfo)
                            }
                        }
                        else if (target.resizeInfo)
                        {}
                        else
                        {
                            var render = sheet._render;
                            if (render._existTouchDragFillIndicator && !eventHandler.isDraggingFill)
                            {
                                sheet.parent.touchToolStrip._closeAutoFillIndicator()
                            }
                            var oldActiveRow = sheet.getActiveRowIndex();
                            var oldActiveCol = sheet.getActiveColumnIndex();
                            var cellTypeHitInfo = target.cellTypeHitInfo;
                            if (cellTypeHitInfo)
                            {
                                var sheetArea = cellTypeHitInfo.sheetArea;
                                if ((sheetArea === keyword_null || sheetArea === keyword_undefined || sheetArea === 3) && (row !== oldActiveRow || col !== oldActiveCol))
                                {
                                    var oldState = sheet.isPaintSuspended();
                                    sheet.isPaintSuspended(true);
                                    if (!sheet.endEdit())
                                    {
                                        return
                                    }
                                    var args = {
                                            sheet: sheet, sheetName: sheet._name, row: oldActiveRow, col: oldActiveCol, cancel: false
                                        };
                                    sheet.triggerLeaveCell(args);
                                    if (args && args.cancel === true)
                                    {
                                        return
                                    }
                                    var oldSels = sheet._selectionModel.toArray();
                                    var newSels = keyword_null;
                                    var span = sheet._getSpanModel().find(row, col);
                                    if (span)
                                    {
                                        newSels = [new Sheets.Range(span.row, span.col, span.rowCount, span.colCount)]
                                    }
                                    else
                                    {
                                        newSels = [new Sheets.Range(row, col, 1, 1)]
                                    }
                                    sheet.triggerSelectionChanging({
                                        sheet: sheet, sheetName: sheet._name, oldSelections: oldSels, newSelections: newSels
                                    });
                                    var isFocusAware = cellTypeHitInfo.isReservedLocation && cellTypeHitInfo.isFocusAware;
                                    sheet._setActiveCellAndSelection(row, col, keyword_undefined, keyword_undefined, isFocusAware ? 0 : 1);
                                    sheet.triggerEnterCell({
                                        sheet: sheet, sheetName: sheet._name, row: row, col: col
                                    });
                                    sheet.triggerSelectionChanged({
                                        sheet: sheet, sheetName: sheet._name
                                    });
                                    eventHandler._updateValidationUI(row, col);
                                    sheet.isPaintSuspended(oldState);
                                    cellTypeCauseSelectionChanged = true
                                }
                                else
                                {
                                    render.refreshTouchSelectionIndicator()
                                }
                                var ct = sheet.getCellType(row, col, target.hitTestType);
                                if (!cellTypeHitInfo.sheet)
                                {
                                    cellTypeHitInfo.sheet = sheet
                                }
                                ct.processMouseDown(cellTypeHitInfo);
                                ct.processMouseUp(cellTypeHitInfo)
                            }
                            if (cellTypeHitInfo && cellTypeHitInfo.isReservedLocation)
                            {
                                return true
                            }
                            else
                            {
                                sheet.triggerCellClick({
                                    sheet: sheet, sheetName: sheet._name, sheetArea: target.hitTestType, row: target.row, col: target.col
                                });
                                try
                                {
                                    eventHandler._hitTestResult = target;
                                    if (sheet.isEditing() && oldActiveRow === sheet.getActiveRowIndex() && oldActiveCol === sheet.getActiveColumnIndex() && !sheet.endEdit())
                                    {
                                        return
                                    }
                                }
                                finally
                                {
                                    eventHandler._hitTestResult = keyword_null
                                }
                                if (row === keyword_undefined || row === keyword_null || col === keyword_undefined || col === keyword_null)
                                {
                                    return
                                }
                                if (target.hitTestType === 3)
                                {
                                    eventHandler._updateValidationUI(row, col)
                                }
                                if (self._isTouchSelected(row, col, target.hitTestType) && !cellTypeCauseSelectionChanged)
                                {
                                    self._touchToolStripTimeout = setTimeout(function()
                                    {
                                        var args = {
                                                x: target.x, y: target.y, handled: false
                                            };
                                        var touchToolStrip = sheet.parent.touchToolStrip;
                                        sheet.triggerTouchToolStripOpening(args);
                                        if (!args.handled)
                                        {
                                            touchToolStrip.open(target.x, target.y - const_toolbar_offset)
                                        }
                                        self._clearTouchToolStripTimeout()
                                    }, TouchHelper.DoubleTappedTimeOffset + 20)
                                }
                                else
                                {
                                    var oldSelections = sheet._selectionModel.toArray();
                                    eventHandler._startSelectingCore(target);
                                    var newSelections = sheet._selectionModel.toArray();
                                    if (eventHandler._notEqualSelecions(oldSelections, newSelections))
                                    {
                                        sheet.triggerSelectionChanging({
                                            sheet: sheet, sheetName: sheet._name, oldSelections: oldSelections, newSelections: newSelections
                                        })
                                    }
                                    eventHandler.stopSelecting()
                                }
                            }
                        }
                    }
                };
                TouchEventHandler.prototype.doDoubleTapped = function(e)
                {
                    var sheet = this.sheet;
                    this._clearTouchToolStripTimeout();
                    var i,
                        selectedRange,
                        action;
                    var currentTarget = sheet._currentTarget;
                    if (currentTarget)
                    {
                        sheet.triggerCellDoubleClick({
                            sheet: sheet, sheetName: sheet._name, sheetArea: currentTarget.hitTestType, row: currentTarget.row, col: currentTarget.col
                        });
                        var resizeInfo = currentTarget.resizeInfo;
                        if (resizeInfo)
                        {
                            if (resizeInfo.action === "sizeRow")
                            {
                                var rowList = [];
                                if (sheet._isRowSelected(resizeInfo.index))
                                {
                                    for (i = 0; i < sheet._selectionModel.length; i++)
                                    {
                                        selectedRange = sheet._selectionModel[i];
                                        if (selectedRange.col === -1)
                                        {
                                            selectedRange = sheet._getActualRange(selectedRange);
                                            for (var r = 0; r < selectedRange.rowCount; r++)
                                            {
                                                rowList.push({row: selectedRange.row + r})
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    rowList.push({row: resizeInfo.index})
                                }
                                action = new Sheets.UndoRedo.RowAutoFitUndoAction(sheet, rowList, resizeInfo.sheetArea === 1);
                                sheet._doCommand(action)
                            }
                            else
                            {
                                var columnList = [];
                                if (sheet._isColumnSelected(resizeInfo.index))
                                {
                                    for (i = 0; i < sheet._selectionModel.length; i++)
                                    {
                                        selectedRange = sheet._selectionModel[i];
                                        if (selectedRange.row === -1)
                                        {
                                            selectedRange = sheet._getActualRange(selectedRange);
                                            for (var c = 0; c < selectedRange.colCount; c++)
                                            {
                                                columnList.push({col: selectedRange.col + c})
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    columnList.push({col: resizeInfo.index})
                                }
                                action = new Sheets.UndoRedo.ColumnAutoFitUndoAction(sheet, columnList, resizeInfo.sheetArea === 2);
                                sheet._doCommand(action)
                            }
                            return
                        }
                    }
                    var target = this._touchHitTest(e.Position.X, e.Position.Y, true);
                    if (target && target.row >= 0 && target.col >= 0 && target.rowViewportIndex >= 0 && target.colViewportIndex >= 0 && !target.resizeInfo && (!sheet.isProtected || !sheet.getStyleProperty(target.row, target.col, "locked")))
                    {
                        sheet._clearSelectionImp();
                        sheet.addSelection(target.row, target.col, 1, 1);
                        sheet._eventHandler.resumeFocus(false);
                        sheet._startEditImp(sheet._getCanvas(), target.row, target.col)
                    }
                };
                TouchEventHandler.prototype.doRightTapped = function(e){};
                TouchEventHandler.prototype.doTouchOperatorStart = function(e)
                {
                    var sheet = this.sheet;
                    var target = this._touchHitTest(e.Position.X, e.Position.Y);
                    if (!sheet.isEditing())
                    {
                        this._target = target;
                        var targetWithoutSelection = this._touchHitTest(e.Position.X, e.Position.Y, true);
                        if (targetWithoutSelection && (targetWithoutSelection.cellTypeHitInfo && targetWithoutSelection.cellTypeHitInfo.isEditting))
                        {}
                        else
                        {
                            sheet._eventHandler.releaseFocus(targetWithoutSelection)
                        }
                    }
                    else if (target.row !== sheet._activeRowIndex || target.col !== sheet._activeColIndex)
                    {
                        sheet._eventHandler.releaseFocus(target)
                    }
                };
                TouchEventHandler.prototype.doTouchOperatorEnd = function(e)
                {
                    var sheet = this.sheet;
                    if (!sheet.isEditing())
                    {
                        var target = this._target;
                        var resumeFocus = true;
                        if (target)
                        {
                            if (target.cellTypeHitInfo && target.cellTypeHitInfo.isReservedLocation)
                            {
                                resumeFocus = false
                            }
                            else
                            {
                                var ct = sheet.getCellType(target.row, target.col);
                                if (ct && ct.isEditting())
                                {
                                    resumeFocus = false
                                }
                            }
                        }
                        if (resumeFocus)
                        {
                            sheet._eventHandler.resumeFocus()
                        }
                    }
                };
                TouchEventHandler.prototype._touchHitTest = function(x, y, ignoreSelection)
                {
                    var self = this;
                    var sheet = self.sheet,
                        render = sheet._render;
                    sheet._getSheetLayout();
                    var target = {
                            x: x, y: y, rowViewportIndex: keyword_null, colViewportIndex: keyword_null, row: -1, col: -1, resizeInfo: keyword_null, hitTestType: keyword_null, groupHitInfo: keyword_null, filterButtonHitInfo: keyword_null, dragInfo: keyword_null, cellTypeHitInfo: keyword_null, selectionHitInfo: keyword_null, formulaRangeHitInfo: keyword_null
                        };
                    var hitInfo = render.groupHitTest(x, y),
                        rowViewportIndex,
                        colViewportIndex;
                    if (hitInfo)
                    {
                        target.groupHitInfo = hitInfo
                    }
                    else
                    {
                        rowViewportIndex = sheet._getRowViewportIndexFromY(y);
                        colViewportIndex = sheet._getColumnViewportIndexFromX(x);
                        target.rowViewportIndex = rowViewportIndex;
                        target.colViewportIndex = colViewportIndex;
                        target.row = sheet._getRowIndexFromY(y, rowViewportIndex);
                        target.col = sheet._getColumnIndexFromX(x, colViewportIndex);
                        if (rowViewportIndex >= 0 && rowViewportIndex <= 2 && colViewportIndex >= 0)
                        {
                            var cellLayout = sheet._getCellLayoutByCell(rowViewportIndex, colViewportIndex, keyword_undefined, target.row, target.col);
                            if (cellLayout)
                            {
                                target.row = cellLayout.row;
                                target.col = cellLayout.col
                            }
                        }
                        target.hitTestType = sheet._getSheetArea(rowViewportIndex, colViewportIndex);
                        var resizeInfo,
                            dragInfo,
                            filterButtonHitInfo,
                            selectionHitInfo,
                            formulaRangeInfo;
                        if (resizeInfo = self._getTouchResizeInfo(target, x, y, 10))
                        {
                            target.resizeInfo = resizeInfo
                        }
                        else if (render._existTouchDragFillIndicator && (dragInfo = self._getDragFillInfo(target, x, y)))
                        {
                            target.dragInfo = dragInfo
                        }
                        else if (filterButtonHitInfo = sheet._getFilterButtonHitInfo(target, x, y))
                        {
                            target.filterButtonHitInfo = filterButtonHitInfo
                        }
                        else if (!ignoreSelection && (selectionHitInfo = self._getSelectionHitInfo(target, x, y)))
                        {
                            target.selectionHitInfo = selectionHitInfo
                        }
                        else
                        {
                            target.cellTypeHitInfo = sheet._getCellTypeHitInfo(target, x, y)
                        }
                    }
                    return target
                };
                TouchEventHandler.prototype._getTouchResizeInfo = function(target, x, y, resizeArea)
                {
                    var sheet = this.sheet,
                        eventHandler = sheet._eventHandler;
                    var selections = sheet.getSelections();
                    var op = keyword_null;
                    if (sheet._isTouchMode && selections.length > 0)
                    {
                        var selection = selections[selections.length - 1];
                        var row = selection.row,
                            lastRow = selection.row + selection.rowCount - 1,
                            col = selection.col,
                            lastCol = selection.col + selection.colCount - 1;
                        if (!sheet.parent || sheet.parent._allowUserResize)
                        {
                            if (row !== -1 && col === -1 && target.rowViewportIndex >= 0 && target.colViewportIndex < 0 && sheet.rowHeaderVisible)
                            {
                                op = eventHandler._getResizeRowInfo(sheet, target, resizeArea, 2, y);
                                if (op && op.action === "sizeRow" && op.sheetArea === 2 && op.index !== lastRow)
                                {
                                    op = keyword_null
                                }
                            }
                            else if (row === -1 && col !== -1 && target.rowViewportIndex < 0 && target.colViewportIndex >= 0 && sheet.colHeaderVisible)
                            {
                                op = eventHandler._getResizeColInfo(sheet, target, resizeArea, 1, x);
                                if (op && op.action === "sizeCol" && op.sheetArea === 1 && op.index !== lastCol)
                                {
                                    op = keyword_null
                                }
                            }
                        }
                    }
                    return op
                };
                TouchEventHandler.prototype._getSelectionHitInfo = function(target, x, y)
                {
                    var sheet = this.sheet;
                    var selectionIndicatorRects = sheet._render.getSelectionIndicatorRects();
                    var selections = sheet.getSelections();
                    var type = 3;
                    if (sheet._isTouchMode && selections.length > 0)
                    {
                        var selection = selections[selections.length - 1];
                        if (selection.row !== -1 && selection.col !== -1)
                        {
                            type = 3
                        }
                        else if (selection.row !== -1)
                        {
                            type = 2
                        }
                        else if (selection.col !== -1)
                        {
                            type = 1
                        }
                    }
                    for (var i = 0; i < selectionIndicatorRects.length; i++)
                    {
                        var rect = selectionIndicatorRects[i];
                        rect.x -= rect.width;
                        rect.y -= rect.height;
                        rect.width *= 3;
                        rect.height *= 3;
                        if (rect.contains(x, y))
                        {
                            return {
                                    x: x, y: y, type: type, isHeader: false, isFirstIndicator: i === 0
                                }
                        }
                    }
                    if (target.hitTestType === 1)
                    {
                        return {
                                x: x, y: y, type: 1, isHeader: true
                            }
                    }
                    else if (target.hitTestType === 2)
                    {
                        return {
                                x: x, y: y, type: 2, isHeader: true
                            }
                    }
                    return keyword_null
                };
                TouchEventHandler.prototype._getDragFillInfo = function(target, x, y)
                {
                    var op = keyword_null;
                    var rowViewportIndex = target.rowViewportIndex,
                        colViewportIndex = target.colViewportIndex;
                    if (typeof(rowViewportIndex) === const_undefined || rowViewportIndex === keyword_null || typeof(colViewportIndex) === const_undefined || colViewportIndex === keyword_null)
                    {
                        return op
                    }
                    var sheet = this.sheet;
                    var activeSelRange = sheet._getActiveSelectedRange();
                    if (rowViewportIndex >= 0 && colViewportIndex >= 0 && sheet._selectionModel.length === 1)
                    {
                        var actualRange = sheet._getActualRange(activeSelRange);
                        var frozenTrailingColCount = sheet._frozenTrailingColCount,
                            frozenTrailingRowCount = sheet._frozenTrailingRowCount;
                        var endCol = sheet.getColumnCount() - frozenTrailingColCount,
                            endRow = sheet.getRowCount() - frozenTrailingRowCount;
                        if (colViewportIndex === 1 && frozenTrailingColCount > 0 && actualRange.col < endCol && actualRange.col + actualRange.colCount > endCol)
                        {
                            var colLayoutModel = sheet._getColumnLayout(colViewportIndex);
                            if (colLayoutModel && colLayoutModel.length > 0)
                            {
                                var colLayout = colLayoutModel[colLayoutModel.length - 1];
                                if (x > colLayout.x + colLayout.width)
                                {
                                    return op
                                }
                            }
                        }
                        if (rowViewportIndex === 1 && frozenTrailingRowCount > 0 && actualRange.row < endRow && actualRange.row + actualRange.rowCount > endRow)
                        {
                            var rowLayoutModel = sheet._getRowLayout(rowViewportIndex);
                            if (rowLayoutModel && rowLayoutModel.length > 0)
                            {
                                var rowLayout = rowLayoutModel[rowLayoutModel.length - 1];
                                if (y > rowLayout.y + rowLayout.height)
                                {
                                    return op
                                }
                            }
                        }
                    }
                    var rect = sheet._render.getTouchDragFillIndicatorRect();
                    if (rect)
                    {
                        if (!op)
                        {
                            rect.x -= rect.width;
                            rect.y -= rect.height;
                            rect.width *= 3;
                            rect.height *= 3;
                            if (rect.contains(x, y))
                            {
                                op = {
                                    action: "drag", side: "corner"
                                }
                            }
                        }
                        if (!sheet.canUserDragFill())
                        {
                            if (op && op.side === "corner")
                            {
                                op.side = keyword_null
                            }
                        }
                    }
                    return op
                };
                TouchEventHandler.prototype._clearTouchToolStripTimeout = function()
                {
                    if (this._touchToolStripTimeout)
                    {
                        clearTimeout(this._touchToolStripTimeout);
                        this._touchToolStripTimeout = keyword_null
                    }
                };
                TouchEventHandler.prototype._isTouchSelected = function(r, c, sheetArea)
                {
                    var selected = false;
                    var sheet = this.sheet;
                    var selectionModel = sheet._selectionModel;
                    for (var i = 0, count = selectionModel.length; i < count; i++)
                    {
                        var sel = selectionModel[i];
                        if (sheetArea === 3 || typeof(sheetArea) === keyword_undefined || sheetArea === keyword_null)
                        {
                            sel = sheet._getActualRange(sel);
                            selected = (sel.row <= r && r < sel.row + sel.rowCount && sel.col <= c && c < sel.col + sel.colCount)
                        }
                        else if (sheetArea === 2)
                        {
                            selected = (sel.col === -1 && sel.row <= r && r < sel.row + sel.rowCount)
                        }
                        else if (sheetArea === 1)
                        {
                            selected = (sel.row === -1 && sel.col <= c && c < sel.col + sel.colCount)
                        }
                        else if (sheetArea === 0)
                        {
                            return selected
                        }
                        if (selected)
                        {
                            return selected
                        }
                    }
                    return selected
                };
                TouchEventHandler.prototype._changeActiveCellBeforeSelect = function(isHeader, isFirstIndicator, selectionType)
                {
                    if (isHeader)
                    {
                        return
                    }
                    var sheet = this.sheet,
                        selections = sheet.getSelections(),
                        selection = selections[selections.length - 1];
                    if (isFirstIndicator)
                    {
                        if (selectionType === 3)
                        {
                            sheet._activeRowIndex = selection.row + selection.rowCount - 1;
                            sheet._activeColIndex = selection.col + selection.colCount - 1
                        }
                        else if (selectionType === 2)
                        {
                            sheet._activeRowIndex = selection.row + selection.rowCount - 1;
                            sheet._activeColIndex = 0
                        }
                        else if (selectionType === 1)
                        {
                            sheet._activeRowIndex = 0;
                            sheet._activeColIndex = selection.col + selection.colCount - 1
                        }
                    }
                    else
                    {
                        if (selectionType === 3)
                        {
                            sheet._activeRowIndex = selection.row;
                            sheet._activeColIndex = selection.col
                        }
                        else if (selectionType === 2)
                        {
                            sheet._activeRowIndex = selection.row;
                            sheet._activeColIndex = 0
                        }
                        else if (selectionType === 1)
                        {
                            sheet._activeRowIndex = 0;
                            sheet._activeColIndex = selection.col
                        }
                    }
                };
                TouchEventHandler.prototype._changeActiveCellAfterSelect = function(isHeader, isFirstIndicator, selectionType)
                {
                    var sheet = this.sheet,
                        selections = sheet.getSelections(),
                        selection = selections[selections.length - 1];
                    if (isHeader || isFirstIndicator)
                    {
                        if (selectionType === 3)
                        {
                            sheet._activeRowIndex = selection.row;
                            sheet._activeColIndex = selection.col
                        }
                        else if (selectionType === 2)
                        {
                            sheet._activeRowIndex = selection.row;
                            sheet._activeColIndex = 0
                        }
                        else if (selectionType === 1)
                        {
                            sheet._activeRowIndex = 0;
                            sheet._activeColIndex = selection.col
                        }
                    }
                };
                return TouchEventHandler
            })();
        var TouchManager = (function()
            {
                function TouchManager(element, sheet, touchEventProvider)
                {
                    var self = this;
                    self._touchEventProvider = touchEventProvider;
                    self._touchMouseMessageFilter = new TouchMouseMessageFilter(sheet);
                    self._touchEventHandler = new TouchEventHandler(sheet);
                    self._touchTarget = new TouchTargetElement(element, "sheet", self._touchMouseMessageFilter, 100, 100);
                    self._touchTarget.level = 10;
                    self._touchEventProvider.attachDettach(self._touchTarget, true)
                }
                TouchManager.prototype.attach = function()
                {
                    var touchEventProvider = this._touchEventProvider;
                    var touchEventHandler = this._touchEventHandler;
                    var touchTarget = this._touchTarget;
                    touchTarget.manipulationStarting = function(e)
                    {
                        return touchEventHandler.doManipulationStarting(e)
                    };
                    touchTarget.manipulationStarted = function(e)
                    {
                        return touchEventHandler.doManipulationStarted(e)
                    };
                    touchTarget.manipulationDelta = function(e)
                    {
                        return touchEventHandler.doManipulationDelta(e)
                    };
                    touchTarget.manipulationInertiaStarting = function(e)
                    {
                        return touchEventHandler.doManipulationInertiaStarting(e)
                    };
                    touchTarget.manipulationCompleted = function(e)
                    {
                        return touchEventHandler.doManipulationCompleted(e)
                    };
                    touchTarget.tapped = function(e)
                    {
                        return touchEventHandler.doTapped(e)
                    };
                    touchTarget.doubleTapped = function(e)
                    {
                        return touchEventHandler.doDoubleTapped(e)
                    };
                    touchTarget.rightTapped = function(e)
                    {
                        return touchEventHandler.doRightTapped(e)
                    };
                    touchTarget.touchOperatorStart = function(e)
                    {
                        return touchEventHandler.doTouchOperatorStart(e)
                    };
                    touchTarget.touchOperatorEnd = function(e)
                    {
                        return touchEventHandler.doTouchOperatorEnd(e)
                    }
                };
                TouchManager.prototype.detach = function()
                {
                    this._touchEventProvider.attachDettach(this._touchTarget, false)
                };
                TouchManager.prototype.preProcessMouseDown = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseDown(event)
                };
                TouchManager.prototype.preProcessMouseUp = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseUp(event)
                };
                TouchManager.prototype.preProcessMouseMove = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseMove(event)
                };
                return TouchManager
            })();
        Sheets.TouchManager = TouchManager;
        var BuildInToolStripItem;
        (function(BuildInToolStripItem)
        {
            BuildInToolStripItem[BuildInToolStripItem["paste"] = 0] = "paste";
            BuildInToolStripItem[BuildInToolStripItem["cut"] = 1] = "cut";
            BuildInToolStripItem[BuildInToolStripItem["copy"] = 2] = "copy";
            BuildInToolStripItem[BuildInToolStripItem["autoFill"] = 3] = "autoFill"
        })(BuildInToolStripItem || (BuildInToolStripItem = {}));
        var TouchToolStrip = (function(_super)
            {
                __extends(TouchToolStrip, _super);
                function TouchToolStrip(spread)
                {
                    _super.call(this, Sheets.util.getPreferredZIndex(spread._host));
                    var self = this;
                    self._touchEventNamespace = ".touchToolStrip";
                    self._domButton = "button";
                    self._buttonClass = "toolstrip-button";
                    self._buttonStyleClass = "toolstrip-button-style";
                    self._textClass = "toolstrip-text";
                    self._imageClass = "wijspread-toolstrip-image";
                    self._itemClass = "toolstrip-item";
                    self._domSpan = "span";
                    self._seprateLineClass = "touch-sperate-line";
                    self._defaultSeprateLineColor = "rgb(30, 57, 91)";
                    self._domDiv = "div";
                    self._imageAreaHeight = 32;
                    self._separatorHeight = 45;
                    self._itemMinWidth = 60;
                    self.menuItems = {};
                    self.pasteName = "wijspread_toolstrip_paste";
                    self.copyName = "wijspread_toolstrip_copy";
                    self.cutName = "wijspread_toolstrip_cut";
                    self.autoFillName = "wijspread_toolstrip_autofill";
                    self._isOpen = false;
                    self.spreadHost = spread;
                    self._initDialog()
                }
                TouchToolStrip.prototype.open = function(x, y)
                {
                    var self = this;
                    var sheet = self.spreadHost.getActiveSheet();
                    if (!sheet)
                    {
                        return
                    }
                    Sheets.FocusHelper.setActiveElement(keyword_null);
                    var t = sheet._eventHandler._getCanvasOffset();
                    x += t.left;
                    y += t.top;
                    self._toolStripDialog.css({
                        left: x, top: y
                    });
                    self.show();
                    self._isOpen = true;
                    self.resetDialogPosition();
                    if (!$.isEmptyObject(self.menuItems))
                    {
                        var items = self.menuItems;
                        for (var name in items)
                        {
                            var item = items[name];
                            var display = item.canExecute ? item.canExecute.call(self) : true;
                            if (display)
                            {
                                $("#" + name).show()
                            }
                            else
                            {
                                $("#" + name).hide()
                            }
                        }
                    }
                };
                TouchToolStrip.prototype.add = function(item)
                {
                    if (!item)
                    {
                        return
                    }
                    var self = this;
                    var menuItems = self.menuItems;
                    if (item instanceof TouchToolStripSeparator)
                    {
                        var separatorName = item.name();
                        if (separatorName)
                        {
                            menuItems[separatorName] = item;
                            var content = self._getMenuItemString(item, separatorName);
                            if (content)
                            {
                                self._addDom(content)
                            }
                        }
                    }
                    else if (item instanceof TouchToolStripItem)
                    {
                        var name = item.name();
                        if (!self.getItem(name))
                        {
                            menuItems[name] = item;
                            var content = self._getMenuItemString(item);
                            if (content)
                            {
                                self._addDom(content)
                            }
                        }
                    }
                };
                TouchToolStrip.prototype.getItem = function(name)
                {
                    return this.menuItems[name]
                };
                TouchToolStrip.prototype.getItems = function()
                {
                    var self = this;
                    var items = [];
                    if (!$.isEmptyObject(self.menuItems))
                    {
                        for (var name in self.menuItems)
                        {
                            items.push(self.menuItems[name])
                        }
                        return items
                    }
                    return keyword_null
                };
                TouchToolStrip.prototype.remove = function(name)
                {
                    if (this.getItem(name))
                    {
                        $("#" + name).parent().remove();
                        var item = this.menuItems[name];
                        delete this.menuItems[name];
                        return item
                    }
                    return keyword_null
                };
                TouchToolStrip.prototype.clear = function()
                {
                    if (this._toolStripDialog)
                    {
                        this._toolStripDialog.find("td." + this._itemClass).remove();
                        this.menuItems = {}
                    }
                };
                TouchToolStrip.prototype.close = function()
                {
                    var self = this;
                    window.gcGlobal.resumeEvent();
                    if (self._toolStripDialog)
                    {
                        self._toolStripDialog.hide()
                    }
                    self._isOpen = false;
                    self.closeOverlay();
                    var sheet = self.spreadHost.getActiveSheet();
                    if (!sheet)
                    {
                        return
                    }
                    var render = sheet._render;
                    sheet.setFocus();
                    var sels = sheet.getSelections();
                    if (render && !render._existTouchDragFillIndicator)
                    {
                        if (sels[0].row === -1 && sels[0].col === -1)
                        {
                            sheet._clearSelectionImp()
                        }
                    }
                };
                TouchToolStrip.prototype.imageAreaHeight = function(height)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._imageAreaHeight
                    }
                    if (height <= 0)
                    {
                        return
                    }
                    self._imageAreaHeight = height;
                    self._toolStripDialog.find("span." + self._imageClass).css("height", height + "px");
                    return self
                };
                TouchToolStrip.prototype.itemHeight = function(height)
                {
                    var items = this._toolStripDialog.find("button." + this._buttonClass);
                    if (arguments.length === 0)
                    {
                        return parseFloat(items.css("height"))
                    }
                    if (height <= 0)
                    {
                        return
                    }
                    items.css("height", height + "px");
                    return this
                };
                TouchToolStrip.prototype.itemWidth = function(width)
                {
                    var items = this._toolStripDialog.find("button." + this._buttonClass);
                    if (arguments.length === 0)
                    {
                        return parseFloat(items.css("width"))
                    }
                    if (width < 0)
                    {
                        return
                    }
                    var minWidth = parseFloat(items.css("min-width"));
                    if (minWidth > width)
                    {
                        items.css("min-width", width)
                    }
                    items.css("width", width + "px");
                    return this
                };
                TouchToolStrip.prototype.separatorHeight = function(height)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._separatorHeight
                    }
                    if (height <= 0)
                    {
                        return
                    }
                    self._separatorHeight = height;
                    self._toolStripDialog.find("div." + self._seprateLineClass).css("height", height + "px");
                    return self
                };
                TouchToolStrip.prototype._createLayoutTable = function()
                {
                    var table = $("<table>").css({
                            padding: 0, display: "table"
                        }).attr({
                            cellspacing: 0, cellpadding: 0
                        });
                    this._tableRow = $("<tr>").appendTo(table);
                    table.appendTo(this._toolStripDialog)
                };
                TouchToolStrip.prototype._dispose = function()
                {
                    var self = this,
                        toolStripDialog = self._toolStripDialog;
                    if (toolStripDialog)
                    {
                        if (self._isOpen)
                        {
                            window.gcGlobal.resumeEvent()
                        }
                        toolStripDialog.remove();
                        self.closeOverlay();
                        toolStripDialog = keyword_null
                    }
                };
                TouchToolStrip.prototype._initDialog = function()
                {
                    var self = this;
                    if (!self._toolStripDialog)
                    {
                        (self._toolStripDialog = self.getContainer()).addClass("toolstrip-default ui-state-default well").appendTo(document.body).hide();
                        self._createLayoutTable();
                        self._setDefaultCellDomString();
                        self._attachEvent()
                    }
                };
                TouchToolStrip.prototype._attachEvent = function()
                {
                    var self = this;
                    this._toolStripDialog.bind("click", function(e)
                    {
                        var item = e.target;
                        var tagName = $(item).get(0).tagName.toLowerCase();
                        var name;
                        if (tagName === "button")
                        {
                            name = $(item).attr("id")
                        }
                        else
                        {
                            name = $(item).parents("button").attr("id")
                        }
                        var menuItem = self.menuItems[name];
                        if (name && menuItem)
                        {
                            menuItem.command.call(self)
                        }
                    })
                };
                TouchToolStrip.prototype._addDom = function(domStr)
                {
                    if (!this._toolStripDialog || !domStr)
                    {
                        return
                    }
                    $("<td>").append($(domStr)).appendTo(this._tableRow).addClass(this._itemClass)
                };
                TouchToolStrip.prototype._setDefaultCellDomString = function()
                {
                    var self = this;
                    var pasteRes = TouchToolStrip._getImageSrc(0);
                    var cutRes = TouchToolStrip._getImageSrc(1);
                    var copyRes = TouchToolStrip._getImageSrc(2);
                    var autoFillRes = TouchToolStrip._getImageSrc(3);
                    self._pasteItem = new TouchToolStripItem(self._getItemName(self.pasteName), Sheets.SR.ToolStrip_PasteText, pasteRes, self._doTapPaste);
                    self._cutItem = new TouchToolStripItem(self._getItemName(self.cutName), Sheets.SR.ToolStrip_CutText, cutRes, self._doTapCut);
                    self._copyItem = new TouchToolStripItem(self._getItemName(self.copyName), Sheets.SR.ToolStrip_CopyText, copyRes, self._doTapCopy);
                    self._autoFillItem = new TouchToolStripItem(self._getItemName(self.autoFillName), Sheets.SR.ToolStrip_AutoFillText, autoFillRes, self._showAutoFillIndicator, self._hideAutoFill);
                    self.add(self._pasteItem);
                    self.add(self._cutItem);
                    self.add(self._copyItem);
                    self.add(new TouchToolStripSeparator(self._hideAutoFill));
                    self.add(self._autoFillItem)
                };
                TouchToolStrip.prototype._hideAutoFill = function()
                {
                    var sheet = this.spreadHost.getActiveSheet();
                    if (!sheet)
                    {
                        return false
                    }
                    var selections = sheet.getSelections();
                    for (var i = 0; i < selections.length; i++)
                    {
                        var sel = selections[i];
                        if (sel.row === -1 && sel.col === -1)
                        {
                            return false
                        }
                    }
                    return true
                };
                TouchToolStrip.prototype._showAutoFillIndicator = function()
                {
                    this.close();
                    var activeSheet = this.spreadHost.getActiveSheet();
                    if (!activeSheet)
                    {
                        return
                    }
                    var length = activeSheet.getSelections().length;
                    if (length > 1)
                    {
                        return
                    }
                    var render = activeSheet._render;
                    render._existTouchDragFillIndicator = true;
                    render.repaintSelection()
                };
                TouchToolStrip.prototype._closeAutoFillIndicator = function()
                {
                    var activeSheet = this.spreadHost.getActiveSheet();
                    if (!activeSheet)
                    {
                        return
                    }
                    var render = activeSheet._render;
                    render._existTouchDragFillIndicator = false;
                    render.repaintSelection()
                };
                TouchToolStrip.prototype._doTapCopy = function()
                {
                    var sheet = this.spreadHost.getActiveSheet();
                    if (sheet)
                    {
                        this._clipboardTouchData = sheet._doCopy(true)
                    }
                    this.close()
                };
                TouchToolStrip.prototype._doTapCut = function()
                {
                    var sheet = this.spreadHost.getActiveSheet();
                    if (sheet)
                    {
                        this._clipboardTouchData = sheet._doCut(true)
                    }
                    this.close()
                };
                TouchToolStrip.prototype._doTapPaste = function()
                {
                    var self = this;
                    var sheet = self.spreadHost.getActiveSheet();
                    if (sheet)
                    {
                        if (typeof self._clipboardTouchData !== const_undefined)
                        {
                            sheet._doPaste(self._clipboardTouchData)
                        }
                    }
                    self.close()
                };
                TouchToolStrip.prototype._getMenuItemString = function(item, name)
                {
                    var self = this;
                    var imgSpan = "";
                    var textSpan = "";
                    var fontStyle = "";
                    var foreColorStyle = "";
                    if (item.name)
                    {
                        name = item.name()
                    }
                    if (item.image)
                    {
                        imgSpan = self._getDomElementString(self._domSpan, name + "Image", keyword_null, {
                            "class": self._imageClass, style: "background-image: url(\"" + item.image() + "\");" + "background-repeat: no-repeat;" + "display: block;" + "height:" + self._imageAreaHeight + "px;" + "background-position-x:50%"
                        })
                    }
                    if (item._font)
                    {
                        fontStyle += "font:" + item._font + ";"
                    }
                    if (item.text && name)
                    {
                        textSpan = self._getDomElementString(self._domSpan, name + "Text", item.text(), {
                            "class": self._textClass, style: fontStyle
                        })
                    }
                    if (imgSpan && name)
                    {
                        var buttonDom = self._getDomElementString(self._domButton, name, imgSpan + textSpan, {
                                "class": self._buttonClass + " " + self._buttonStyleClass + " ui-state-default ui-widget btn btn-default", style: "border: 0px;" + "padding:4px;" + "margin:3px;" + "min-width:" + self._itemMinWidth + "px;"
                            });
                        return buttonDom
                    }
                    else
                    {
                        if (item instanceof TouchToolStripSeparator)
                        {
                            return self._getDomElementString(self._domDiv, name, keyword_null, {
                                    "class": self._seprateLineClass, style: "width:1px;" + "height:" + self._separatorHeight + "px;" + "display:inline-block;" + "background-color:" + self._defaultSeprateLineColor + ";" + "margin-left:5px;" + "margin-right:5px;" + "opacity:0.6"
                                })
                        }
                    }
                };
                TouchToolStrip.prototype._getDomElementString = function(name, id, content, attrPairs, noCloseTag)
                {
                    var tag = "<" + name + " ";
                    if (id)
                    {
                        tag += "id='" + id + "' "
                    }
                    if (attrPairs)
                    {
                        $.each(attrPairs, function(i, v)
                        {
                            tag += i + "='" + v + "' "
                        })
                    }
                    if (content)
                    {
                        tag += ">" + content + "</" + name + ">"
                    }
                    else
                    {
                        if (noCloseTag === keyword_undefined)
                        {
                            tag += ">" + "</" + name + ">"
                        }
                        else
                        {
                            tag += (noCloseTag === true) ? ">" : "/>"
                        }
                    }
                    return tag
                };
                TouchToolStrip.prototype._getItemName = function(name)
                {
                    var num = 0;
                    var itemName = name + num;
                    while (document.getElementById(itemName))
                    {
                        num++;
                        itemName = name + num
                    }
                    return itemName
                };
                TouchToolStrip.prototype._updateResource = function()
                {
                    var self = this,
                        textClass = self._textClass;
                    $("#" + self._pasteItem._name).find("span." + textClass).text(Sheets.SR.ToolStrip_PasteText);
                    $("#" + self._cutItem._name).find("span." + textClass).text(Sheets.SR.ToolStrip_CutText);
                    $("#" + self._copyItem._name).find("span." + textClass).text(Sheets.SR.ToolStrip_CopyText);
                    $("#" + self._autoFillItem._name).find("span." + textClass).text(Sheets.SR.ToolStrip_AutoFillText)
                };
                TouchToolStrip._getImageSrc = function(state)
                {
                    switch (state)
                    {
                        case 0:
                            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c' + '6QAAAARnQU1BAACxjwv8YQUAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAA8ElEQV' + 'RIS92VwQ3CMAxFe + qZERiHY8dgDI4cYYNOhDhwY4ayQviW4q / Eddu0KRe + 9CQ72P8rEpAmhPBT3ENLd' + '76EiPv5HO5hSmK + KYTFsz + 04A4G9NZ0hAizn7jTos2MFRYYugFZQlscoFzRZsYKCwwNulAqnZddtJmxwi' + 'IZ3oT6WFh4S2tQHwsLb2kN6mNh4S2tQX0sLLwly4IyY4WFZ2gReV / ZhBOQH2ddgKcYwBAc7R / weL0ZgqO6g' + 'GPXE1E0JlBdwJx2CUhvkCL63xvw33QKUc0N + B5MIaq5gb5o8kotBszJDShFlkvQ + ZHBvoTmC + fiVfoq / m86AAAAAElFTkSuQmCC';
                        case 1:
                            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8' + 'YQUAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAABkklEQVRIS7WTUXECQRBEcYCF' + 'OIiESAAH / OYPCcQBEogDJCABCUhAwqXf1QzVM0cojko + Xt3ObG / 33t7eYhiGf6UU68 + vneD5Mu4HpZDg' + 'Kja + YCYH94NSSHAUg3glZC9k8zgAYwLmhuS6o / tBKUJ8CTGsoveIsin3g1LEAkxzAd / kXbihwxwatGys' + '+ EEpEAT5LR6FuDmMb + t + UAoEwVL44h7CvB8lGxrn3A9KkaLAj8pDMD9HL / v0ZgfAQfSAk / WgXAT3g1K4' + 'MPCj2AoPhNvRJO4HpejigF1jxtjNy9Ek7gel6GIjfzoP + Ihewf2gFPcWNNL817 / c / aAUKXpbfy / FXlzF' + 'IM6gOYy3Gp + iz / xBPHeLQGLAMI2PNmYOw1uojZfdCyYNCXexiGcGpiljdp9hsBGjvnvBpCHhRbgBZChj' + 'Agj0eXrX7gWThoR992lAMGOOLMfJuIHuBZMGQuE75KN66Cpq14xH2L1g0kixyLNm3I8sNbwJulHfvWDS' + 'kJArmou4hlxXeh4AvBEBuZnnbtHfMix + AHqkr6wgQ4Q7AAAAAElFTkSuQmCC';
                        case 2:
                            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8' + 'YQUAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAA3UlEQVRIS72PwQ3CMAxFOwrj' + 'cOyZCTgyAjfWYCJO3JiCCVL / iFSO9W0MDTzpqYob + ztTKeWn0uJIadE6H8 / ljXsR96q6tzt4YogH / olP' + 'cQ2R8mp3CHRBwO3 + 6EKkvNodcDkSgyyoAx0iRz / AA / 8Op0sdtJuv1Va3Ct8FYHgL8dgUAGxIe41 + kRAH' + '6CbdaGW86nFAhnaXLSLEAbqJCbxlUgEZ2DIgFaCbmMBbJhWQgS0DUgG6iQm8ZVIBGTYFsK21oN3F1yrE' + 'ARnsIM / u8JeAT9S9nrQ4UlocKS2Os0wLtkPMdu9POt0AAAAASUVORK5CYII =';
                        case 3:
                            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAXCAIAAABrvZPKAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAO' + 'wwAADsMBx2 + oZAAAAIdJREFUOE / tzEEKgCAQheEOWLdx351adYc8Qgs3rbuAUC9nkkF0BKNN9CMy0Xx2' + '5llf8Edr7d57j / tlP4wTHf4W / b7gsT0vLs7Sz9bFWfM9nrDXE9ITphlVPO512wkkM++FNF86vBfKeKR4' + '3rjLe5QwOvxPVPSoipHmkY5RxSMFo7rXY9 + eMSdet07b6c / bnwAAAABJRU5ErkJggg =='
                    }
                };
                return TouchToolStrip
            })(Sheets.BaseDialog);
        Sheets.TouchToolStrip = TouchToolStrip;
        var TouchToolStripItem = (function()
            {
                function TouchToolStripItem(name, text, image, command, canExecute)
                {
                    this._font = "normal 12px Arial";
                    var self = this;
                    self._name = name;
                    self._text = text;
                    self._image = image;
                    if (command)
                    {
                        self.command = command
                    }
                    if (canExecute)
                    {
                        self.canExecute = canExecute
                    }
                }
                TouchToolStripItem.prototype.name = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._name
                    }
                    $("#" + self._name).attr("id", value);
                    $("#" + self._name + "Text").attr("id", value + "Text");
                    $("#" + self._name + "Image").attr("id", value + "Image");
                    self._name = value;
                    return self
                };
                TouchToolStripItem.prototype.text = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._text
                    }
                    self._text = value;
                    $("#" + self.name() + "Text").text(value);
                    return self
                };
                TouchToolStripItem.prototype.font = function(value)
                {
                    var self = this;
                    var text = $("#" + self.name() + "Text");
                    if (arguments.length === 0)
                    {
                        return self._font
                    }
                    self._font = value;
                    text.css("font", value);
                    return self
                };
                TouchToolStripItem.prototype.foreColor = function(value)
                {
                    var self = this;
                    var text = $("#" + self.name() + "Text");
                    if (arguments.length === 0)
                    {
                        if (self._foreColor)
                        {
                            return self._foreColor
                        }
                        else
                        {
                            return text.css("color")
                        }
                    }
                    text.css("color", value);
                    return self
                };
                TouchToolStripItem.prototype.image = function(value)
                {
                    var self = this;
                    if (arguments.length === 0)
                    {
                        return self._image
                    }
                    self._image = value;
                    $("#" + self.name() + "Image").css("background-image", "url(" + value + ")");
                    return self
                };
                return TouchToolStripItem
            })();
        Sheets.TouchToolStripItem = TouchToolStripItem;
        var TouchToolStripSeparator = (function()
            {
                function TouchToolStripSeparator(canExecute)
                {
                    this._name = this._getSeparatorName();
                    if (canExecute)
                    {
                        this.canExecute = canExecute
                    }
                }
                TouchToolStripSeparator.prototype.name = function()
                {
                    return this._name
                };
                TouchToolStripSeparator.prototype._getSeparatorName = function()
                {
                    var num = 0;
                    var separatorName = "separator" + num;
                    while (document.getElementById(separatorName))
                    {
                        num++;
                        separatorName = "separator" + num
                    }
                    return separatorName
                };
                return TouchToolStripSeparator
            })();
        Sheets.TouchToolStripSeparator = TouchToolStripSeparator;
        var TouchMouseMessageFilter = (function()
            {
                function TouchMouseMessageFilter(owner)
                {
                    this.owner = owner
                }
                TouchMouseMessageFilter.prototype.preProcessManipulationStarting = function()
                {
                    this.eventMode = 2;
                    this.owner._isTouchMode = true
                };
                TouchMouseMessageFilter.prototype.postProcessManipulationComplete = function()
                {
                    this.eventMode = 0;
                    this.touchCompleteTimestamp = (new Date).valueOf()
                };
                TouchMouseMessageFilter.prototype.preProcessPointerDown = function()
                {
                    return this.eventMode === 1
                };
                TouchMouseMessageFilter.prototype.preProcessPointerUp = function()
                {
                    return this.eventMode === 1
                };
                TouchMouseMessageFilter.prototype.preProcessPointerMove = function()
                {
                    return this.eventMode === 1
                };
                TouchMouseMessageFilter.prototype.preProcessMouseDown = function(event)
                {
                    var self = this;
                    if (self.eventMode === 2)
                    {
                        return true
                    }
                    else if (self.touchCompleteTimestamp)
                    {
                        if ((new Date).valueOf() - self.touchCompleteTimestamp <= 200)
                        {
                            self.mouseDownHandled++;
                            return true
                        }
                        else
                        {
                            self.touchCompleteTimestamp = 0;
                            self.mouseDownHandled = 0;
                            self.eventMode = 1
                        }
                    }
                    else
                    {
                        self.eventMode = 1
                    }
                    self.owner._isTouchMode = false;
                    return false
                };
                TouchMouseMessageFilter.prototype.preProcessMouseUp = function(event)
                {
                    var self = this;
                    if (self.mouseDownHandled)
                    {
                        self.mouseDownHandled--;
                        return true
                    }
                    if (self.eventMode === 2)
                    {
                        return true
                    }
                    self.eventMode = 0;
                    return false
                };
                TouchMouseMessageFilter.prototype.preProcessMouseMove = function(event)
                {
                    return this.eventMode === 2
                };
                return TouchMouseMessageFilter
            })();
        Sheets.TouchMouseMessageFilter = TouchMouseMessageFilter;
        var EventMode;
        (function(EventMode)
        {
            EventMode[EventMode["None"] = 0] = "None";
            EventMode[EventMode["MouseMode"] = 1] = "MouseMode";
            EventMode[EventMode["TouchMode"] = 2] = "TouchMode"
        })(EventMode || (EventMode = {}));
        var TabStripTouchEventHandler = (function()
            {
                function TabStripTouchEventHandler(tab)
                {
                    this._tab = tab
                }
                TabStripTouchEventHandler.prototype.doManipulationStarting = function(e){};
                TabStripTouchEventHandler.prototype.doManipulationStarted = function(e)
                {
                    var self = this;
                    var tab = self._tab;
                    var activeSheet = tab._spread.getActiveSheet();
                    if (tab._tabNameEditor)
                    {
                        tab.endSheetTabEditing(activeSheet, false)
                    }
                    var hit_element_resizebar = "resizeBar",
                        hit_element_tab = "tab",
                        hit_element_newTab = "newTab";
                    var hitTestInfo = tab._hitTest(e.Position.X, e.Position.Y);
                    if (hitTestInfo.element === hit_element_resizebar)
                    {
                        tab.resizeTab = true;
                        tab.activeX = e.Position.X
                    }
                    else if (hitTestInfo.element === hit_element_tab || hitTestInfo.element === hit_element_newTab || hitTestInfo.element === "")
                    {
                        var srcCanvas = tab.canvas,
                            canvasWidth = Sheets.DPIHelper.getLogicWidth(srcCanvas),
                            canvasHeight = Sheets.DPIHelper.getLogicHeight(srcCanvas);
                        var canvas = self._getTouchCanvas(canvasWidth, canvasHeight);
                        var ctx = canvas.getContext("2d"),
                            ratioX = Sheets.DPIHelper.getScaleX(canvas),
                            ratioY = Sheets.DPIHelper.getScaleY(canvas);
                        ctx.scale(1 / ratioX, 1 / ratioY);
                        ctx.drawImage(srcCanvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                        ctx.scale(ratioX, ratioY);
                        self._canvas = canvas;
                        self._oldFirstTab = tab._firstTab
                    }
                    self._minFirstTabIndex = tab._getNextVisibleIndex(-1);
                    self._maxFirstTabIndex = tab._reCalculateFirstTabIndex(tab._getVisibleTabs())
                };
                TabStripTouchEventHandler.prototype.doManipulationDelta = function(e)
                {
                    var self = this;
                    var tab = self._tab;
                    if (tab.resizeTab)
                    {
                        var d = e.Position.X - tab.activeX;
                        var ss = tab._spread;
                        var totalWidth = ss._vp.clientWidth;
                        ss.setTabStripRatio(ss._getActualTabStripRatio() + d / totalWidth, true);
                        var minRatio = tab._resizeBarWidth / totalWidth;
                        var maxRatio = 1;
                        if (ss._getActualTabStripRatio() < minRatio)
                        {
                            ss.setTabStripRatio(minRatio, true);
                            tab.activeX = tab._resizeBarWidth
                        }
                        else if (ss._getActualTabStripRatio() >= maxRatio)
                        {
                            ss.setTabStripRatio(maxRatio, true);
                            tab.activeX = totalWidth
                        }
                        else
                        {
                            tab.activeX = e.Position.X
                        }
                    }
                    else
                    {
                        var srcCanvas = self._canvas,
                            oldFirstTab = self._oldFirstTab;
                        if (!srcCanvas || typeof(oldFirstTab) === const_undefined || oldFirstTab === keyword_null)
                        {
                            return
                        }
                        var minFirstTabIndex = self._minFirstTabIndex,
                            maxFirstTabIndex = self._maxFirstTabIndex,
                            newTabSize = tab._newTabSize,
                            tabStartPosition = tab._getTabStartPosition(),
                            translationX = e.Cumulative.Translation.X;
                        var firstTabInfo = self._getNewFirstTabInfo(translationX, oldFirstTab);
                        tab._firstTab = firstTabInfo.firstTab;
                        var availableWidth = firstTabInfo.width;
                        if (translationX > 0 && oldFirstTab === minFirstTabIndex && tab._firstTab === minFirstTabIndex)
                        {
                            availableWidth = 0
                        }
                        else if (translationX < 0 && oldFirstTab === maxFirstTabIndex && tab._firstTab === maxFirstTabIndex)
                        {
                            availableWidth = 0
                        }
                        if (translationX > 0 && translationX > availableWidth + newTabSize)
                        {
                            translationX = availableWidth + newTabSize
                        }
                        else if (translationX < 0 && translationX < availableWidth - newTabSize)
                        {
                            translationX = availableWidth - newTabSize
                        }
                        if (translationX !== 0)
                        {
                            var destCanvas = tab.canvas,
                                ctx = destCanvas.getContext("2d"),
                                ratioX = Sheets.DPIHelper.getScaleX(destCanvas),
                                ratioY = Sheets.DPIHelper.getScaleY(destCanvas);
                            ctx.save();
                            ctx.clearRect(0, 0, Sheets.DPIHelper.getLogicWidth(destCanvas), Sheets.DPIHelper.getLogicHeight(destCanvas));
                            var rect = tab.getBounds();
                            ctx.fillStyle = tab._getTabStripBackColor(ctx, rect);
                            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
                            var x,
                                y = 0,
                                width,
                                height = rect.height,
                                x2,
                                xOffset;
                            if (translationX > 0)
                            {
                                x = tabStartPosition;
                                x2 = x + translationX;
                                width = rect.x + rect.width - tab._resizeBarWidth - x2;
                                if (width > 0)
                                {
                                    ctx.scale(1 / ratioX, 1 / ratioY);
                                    ctx.drawImage(srcCanvas, x * ratioX, y, width * ratioX, height * ratioY, x2 * ratioX, y, width * ratioX, height * ratioY);
                                    ctx.scale(ratioX, ratioY)
                                }
                                xOffset = translationX - availableWidth;
                                if (rect.x + rect.width - tab._resizeBarWidth - tabStartPosition <= translationX)
                                {
                                    xOffset = 0
                                }
                                width = availableWidth;
                                x = tabStartPosition;
                                if (width > 0)
                                {
                                    ctx.translate(xOffset, 0);
                                    tab.paintTabs(ctx, new Sheets.Rect(x, y, width, height));
                                    ctx.translate(-xOffset, 0)
                                }
                            }
                            else if (translationX < 0)
                            {
                                x2 = tabStartPosition;
                                x = x2 + Math_abs(translationX);
                                width = rect.x + rect.width - tab._resizeBarWidth - x;
                                if (width > 0)
                                {
                                    ctx.scale(1 / ratioX, 1 / ratioY);
                                    ctx.drawImage(srcCanvas, x * ratioX, y, width * ratioX, height * ratioY, x2 * ratioX, y, width * ratioX, height * ratioY);
                                    ctx.scale(ratioX, ratioY)
                                }
                                xOffset = translationX - availableWidth;
                                if (rect.x + rect.width - tab._resizeBarWidth - tabStartPosition <= Math_abs(translationX))
                                {
                                    xOffset = 0
                                }
                                width = Math_abs(availableWidth);
                                x = rect.x + rect.width - tab._resizeBarWidth - width;
                                if (width > 0)
                                {
                                    ctx.translate(xOffset, 0);
                                    tab.paintTabs(ctx, new Sheets.Rect(x, y, width, height));
                                    ctx.translate(-xOffset, 0)
                                }
                            }
                            ctx.scale(1 / ratioX, 1 / ratioY);
                            x = 0;
                            width = tabStartPosition;
                            ctx.drawImage(srcCanvas, x * ratioX, y, width * ratioX, height * ratioY, x * ratioX, y, width * ratioX, height * ratioY);
                            x = rect.width - tab._resizeBarWidth;
                            width = tab._resizeBarWidth;
                            ctx.drawImage(srcCanvas, x * ratioX, y, width * ratioX, height * ratioY, x * ratioX, y, width * ratioX, height * ratioY);
                            ctx.scale(ratioX, ratioY);
                            ctx.restore()
                        }
                    }
                };
                TabStripTouchEventHandler.prototype.doManipulationInertiaStarting = function(e){};
                TabStripTouchEventHandler.prototype.doManipulationCompleted = function(e)
                {
                    var tab = this._tab;
                    if (tab.resizeTab)
                    {
                        tab.resizeTab = false;
                        tab._spread._doTabHSResize()
                    }
                    else
                    {
                        tab.repaint()
                    }
                };
                TabStripTouchEventHandler.prototype.doTapped = function(e)
                {
                    var tab = this._tab,
                        sp = tab._spread;
                    var activeSheet = sp.getActiveSheet();
                    if (tab._tabNameEditor)
                    {
                        tab.endSheetTabEditing(activeSheet, false)
                    }
                    var hit_element_navbutton = "navButton",
                        hit_element_tab = "tab",
                        hit_element_newTab = "newTab";
                    var hitTestInfo = tab._hitTest(e.Position.X, e.Position.Y);
                    sp._suspendSetFocus = true;
                    try
                    {
                        if (hitTestInfo.element === hit_element_navbutton)
                        {
                            tab.doNavButtonClick(hitTestInfo.index, true)
                        }
                        else if (hitTestInfo.element === hit_element_tab)
                        {
                            tab.doSheetTabClick(hitTestInfo.index, hitTestInfo.position)
                        }
                        else if (hitTestInfo.element === hit_element_newTab)
                        {
                            tab.doNewTabClick(hitTestInfo.position)
                        }
                    }
                    finally
                    {
                        sp._suspendSetFocus = false;
                        var newActiveSheet = sp.getActiveSheet();
                        if (newActiveSheet !== activeSheet)
                        {
                            newActiveSheet._isTouchMode = true;
                            newActiveSheet.setFocus()
                        }
                    }
                };
                TabStripTouchEventHandler.prototype.doDoubleTapped = function(e)
                {
                    return this._tab._doMouseDbClickImp(e.Position.X, e.Position.Y)
                };
                TabStripTouchEventHandler.prototype.doRightTapped = function(e){};
                TabStripTouchEventHandler.prototype._getTouchCanvas = function(width, height)
                {
                    var canvas = this._canvas;
                    if (!canvas)
                    {
                        canvas = document.createElement("canvas");
                        Sheets.DPIHelper.adjustDevicePixel(canvas, this._tab._spread);
                        Sheets.DPIHelper.setSize(canvas, width, height)
                    }
                    else if (width !== Sheets.DPIHelper.getLogicWidth(canvas) || height !== Sheets.DPIHelper.getLogicHeight(canvas))
                    {
                        Sheets.DPIHelper.setSize(canvas, width, height)
                    }
                    return canvas
                };
                TabStripTouchEventHandler.prototype._getNewFirstTabInfo = function(translationX, oldFirstTab)
                {
                    var tab = this._tab,
                        tabSizes = tab._tabSizes,
                        min = this._minFirstTabIndex,
                        max = this._maxFirstTabIndex;
                    var c = oldFirstTab,
                        width = 0;
                    if (translationX > 0)
                    {
                        while (c >= min)
                        {
                            if (width > translationX)
                            {
                                break
                            }
                            width += tabSizes[c];
                            c--
                        }
                        if (c < min)
                        {
                            c = min
                        }
                    }
                    else if (translationX < 0 && max !== -1)
                    {
                        while (c <= max)
                        {
                            if (width < translationX)
                            {
                                break
                            }
                            width -= tabSizes[c];
                            c++
                        }
                        if (c > max)
                        {
                            c = max
                        }
                    }
                    return {
                            firstTab: c, width: width
                        }
                };
                return TabStripTouchEventHandler
            })();
        var TabStripTouchManager = (function()
            {
                function TabStripTouchManager(element, tab, touchEventProvider)
                {
                    var self = this;
                    self._touchMouseMessageFilter = new TouchMouseMessageFilter(self);
                    self._touchTarget = new TouchTargetElement(element, "tabStrip", self._touchMouseMessageFilter, 1, -1);
                    self._touchEventProvider = touchEventProvider;
                    self._touchEventHandler = new TabStripTouchEventHandler(tab);
                    var touchEventHandler = self._touchEventHandler;
                    var touchTarget = self._touchTarget;
                    touchTarget.manipulationStarting = function(e)
                    {
                        return touchEventHandler.doManipulationStarting(e)
                    };
                    touchTarget.manipulationStarted = function(e)
                    {
                        return touchEventHandler.doManipulationStarted(e)
                    };
                    touchTarget.manipulationDelta = function(e)
                    {
                        return touchEventHandler.doManipulationDelta(e)
                    };
                    touchTarget.manipulationInertiaStarting = function(e)
                    {
                        return touchEventHandler.doManipulationInertiaStarting(e)
                    };
                    touchTarget.manipulationCompleted = function(e)
                    {
                        return touchEventHandler.doManipulationCompleted(e)
                    };
                    touchTarget.tapped = function(e)
                    {
                        return touchEventHandler.doTapped(e)
                    };
                    touchTarget.doubleTapped = function(e)
                    {
                        return touchEventHandler.doDoubleTapped(e)
                    };
                    touchTarget.rightTapped = function(e)
                    {
                        return touchEventHandler.doRightTapped(e)
                    }
                }
                TabStripTouchManager.prototype.bindTouchEvents = function()
                {
                    if (this._touchEventProvider)
                    {
                        this._touchEventProvider.attachDettach(this._touchTarget, true)
                    }
                };
                TabStripTouchManager.prototype.unbindTouchEvents = function()
                {
                    if (this._touchEventProvider)
                    {
                        this._touchEventProvider.attachDettach(this._touchTarget, false)
                    }
                };
                TabStripTouchManager.prototype.preProcessMouseDown = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseDown(event)
                };
                TabStripTouchManager.prototype.preProcessMouseUp = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseUp(event)
                };
                TabStripTouchManager.prototype.preProcessMouseMove = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseMove(event)
                };
                return TabStripTouchManager
            })();
        Sheets.TabStripTouchManager = TabStripTouchManager;
        var FloatingObjectTouchManager = (function()
            {
                function FloatingObjectTouchManager(element, floatingObjectRender, touchEventProvider)
                {
                    var self = this;
                    self._touchMouseMessageFilter = new TouchMouseMessageFilter(self);
                    self._touchTarget = new TouchTargetElement(element, "FL_" + floatingObjectRender.name, self._touchMouseMessageFilter, 2, 200);
                    self._touchEventProvider = touchEventProvider;
                    self._touchEventHandler = new FloatingObjectTouchEventHandler(element, floatingObjectRender);
                    var touchEventHandler = self._touchEventHandler;
                    var touchTarget = self._touchTarget;
                    touchTarget.canDoManipulation = function()
                    {
                        return floatingObjectRender.floatingObject().isSelected()
                    };
                    touchTarget.canDoTap = function()
                    {
                        return true
                    };
                    touchTarget.manipulationStarting = function(e)
                    {
                        return touchEventHandler.doManipulationStarting(e)
                    };
                    touchTarget.manipulationStarted = function(e)
                    {
                        return touchEventHandler.doManipulationStarted(e)
                    };
                    touchTarget.manipulationDelta = function(e)
                    {
                        return touchEventHandler.doManipulationDelta(e)
                    };
                    touchTarget.manipulationInertiaStarting = function(e)
                    {
                        return touchEventHandler.doManipulationInertiaStarting(e)
                    };
                    touchTarget.manipulationCompleted = function(e)
                    {
                        return touchEventHandler.doManipulationCompleted(e)
                    };
                    touchTarget.tapped = function(e)
                    {
                        return touchEventHandler.doTapped(e)
                    };
                    touchTarget.doubleTapped = function(e)
                    {
                        return touchEventHandler.doDoubleTapped(e)
                    };
                    touchTarget.rightTapped = function(e)
                    {
                        return touchEventHandler.doRightTapped(e)
                    }
                }
                FloatingObjectTouchManager.prototype.attach = function()
                {
                    if (this._touchEventProvider)
                    {
                        this._touchEventProvider.attachDettach(this._touchTarget, true)
                    }
                };
                FloatingObjectTouchManager.prototype.detach = function()
                {
                    if (this._touchEventProvider)
                    {
                        this._touchEventProvider.attachDettach(this._touchTarget, false)
                    }
                };
                FloatingObjectTouchManager.prototype.preProcessMouseDown = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseDown(event)
                };
                FloatingObjectTouchManager.prototype.preProcessMouseUp = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseUp(event)
                };
                FloatingObjectTouchManager.prototype.preProcessMouseMove = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseMove(event)
                };
                return FloatingObjectTouchManager
            })();
        Sheets.FloatingObjectTouchManager = FloatingObjectTouchManager;
        var FloatingObjectTouchEventHandler = (function()
            {
                function FloatingObjectTouchEventHandler(element, floatingObjectRender)
                {
                    this._floatingObjectRender = floatingObjectRender;
                    this._floatingObject = floatingObjectRender.floatingObject();
                    this._containerElement = element;
                    this._touchZoomManager = new TouchZoomManager(floatingObjectRender._sheet)
                }
                FloatingObjectTouchEventHandler.prototype._positionToPage = function(originalSource, position)
                {
                    var newPosition = new TouchPoint(position.X, position.Y);
                    var t = $(this._containerElement).offset();
                    if (t)
                    {
                        if (!isNaN(document.body.clientTop))
                        {
                            t.top += document.body.clientTop
                        }
                        if (!isNaN(document.body.clientLeft))
                        {
                            t.left += document.body.clientLeft
                        }
                        newPosition.X += t.left;
                        newPosition.Y += t.top
                    }
                    return newPosition
                };
                FloatingObjectTouchEventHandler.prototype.doManipulationStarting = function(e)
                {
                    e.Mode = 1 | 2 | 32
                };
                FloatingObjectTouchEventHandler.prototype.doManipulationStarted = function(e)
                {
                    var self = this;
                    var pagePosition = self._positionToPage(e.OriginalSource, e.Position);
                    self._floatingObjectRender._doMouseDown({
                        isTouch: true, button: 0, pageX: pagePosition.X, pageY: pagePosition.Y, stopPropagation: function(){}
                    });
                    self._touchZoomManager.startZoom()
                };
                FloatingObjectTouchEventHandler.prototype.doManipulationDelta = function(e)
                {
                    var self = this,
                        scale = e.Cumulative.Scale,
                        sheet = self._floatingObjectRender._sheet;
                    if (scale !== 1 && sheet.parent && sheet.parent._allowUserZoom)
                    {
                        sheet._eventHandler.isFloatingObjectWorking = false;
                        self._floatingObjectRender._resetStatusOnMouseUp();
                        self._touchZoomManager.continueZoom(scale)
                    }
                    else
                    {
                        var pagePosition = self._positionToPage(e.OriginalSource, e.Position);
                        self._floatingObjectRender._doMouseMove({
                            isTouch: true, button: 0, pageX: pagePosition.X, pageY: pagePosition.Y, stopPropagation: function(){}
                        })
                    }
                };
                FloatingObjectTouchEventHandler.prototype.doManipulationInertiaStarting = function(e){};
                FloatingObjectTouchEventHandler.prototype.doManipulationCompleted = function(e)
                {
                    var self = this,
                        scale = e.Cumulative.Scale,
                        sheet = self._floatingObjectRender._sheet;
                    if (scale !== 1 && sheet.parent && sheet.parent._allowUserZoom)
                    {
                        self._touchZoomManager.endZoom(scale)
                    }
                    else
                    {
                        var pagePosition = self._positionToPage(e.OriginalSource, e.Position);
                        this._floatingObjectRender._doMouseUp({
                            isTouch: true, button: 0, pageX: pagePosition.X, pageY: pagePosition.Y, stopPropagation: function(){}
                        })
                    }
                };
                FloatingObjectTouchEventHandler.prototype.doTapped = function(e)
                {
                    try
                    {
                        var sheet = this._floatingObjectRender._sheet;
                        var oldState = sheet.isPaintSuspended();
                        sheet.isPaintSuspended(true);
                        if (!this._floatingObject.isSelected())
                        {
                            sheet.unSelectAllFloatingObjects();
                            this._floatingObject.isSelected(true);
                            Sheets.FocusHelper.setActiveElement(sheet)
                        }
                        sheet.clearSelection()
                    }
                    finally
                    {
                        sheet.isPaintSuspended(oldState)
                    }
                };
                FloatingObjectTouchEventHandler.prototype.doDoubleTapped = function(e){};
                FloatingObjectTouchEventHandler.prototype.doRightTapped = function(e){};
                return FloatingObjectTouchEventHandler
            })();
        var TouchTargetElement = (function()
            {
                function TouchTargetElement(element, eventFlag, messageFilter, maxPointer, level)
                {
                    var self = this;
                    self.element = element;
                    self.messageFilter = messageFilter;
                    self.eventFlag = eventFlag;
                    self.maxPointer = maxPointer;
                    self.level = level
                }
                return TouchTargetElement
            })();
        Sheets.TouchTargetElement = TouchTargetElement;
        var _SimulateMouseEvents = (function()
            {
                function _SimulateMouseEvents(){}
                _SimulateMouseEvents.prototype.simulateMouseEvent = function(event, simulatedType)
                {
                    var originalEvent = event.originalEvent;
                    if (originalEvent.isPrimary === false)
                    {
                        return
                    }
                    if (originalEvent.touches && originalEvent.touches.length >= 1 && originalEvent.targetTouches && originalEvent.targetTouches.length >= 1)
                    {
                        if (originalEvent.touches[0].clientX !== originalEvent.targetTouches[0].clientX || originalEvent.touches[0].clientY !== originalEvent.targetTouches[0].clientY)
                        {
                            return
                        }
                    }
                    Sheets.util.cancelDefault(event);
                    var touchPoint = typeof originalEvent.changedTouches !== const_undefined ? originalEvent.changedTouches[0] : originalEvent,
                        simulatedEvent = document.createEvent('MouseEvents');
                    simulatedEvent.initMouseEvent(simulatedType, true, true, window, 1, touchPoint.screenX, touchPoint.screenY, touchPoint.clientX, touchPoint.clientY, false, false, false, false, 0, keyword_null);
                    event.target.dispatchEvent(simulatedEvent)
                };
                _SimulateMouseEvents.prototype.down = function(event)
                {
                    if (!event.pointerType || (event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch"))
                    {
                        var self = event.data;
                        if (self.touchHandled)
                        {
                            return
                        }
                        self.touchHandled = true;
                        self._touchMoved = false;
                        self.simulateMouseEvent(event, 'mouseover');
                        self.simulateMouseEvent(event, 'mousemove');
                        self.simulateMouseEvent(event, 'mousedown')
                    }
                };
                _SimulateMouseEvents.prototype.move = function(event)
                {
                    if (!event.pointerType || (event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch"))
                    {
                        var self = event.data;
                        if (!self.touchHandled)
                        {
                            return
                        }
                        self._touchMoved = true;
                        self.simulateMouseEvent(event, 'mousemove')
                    }
                };
                _SimulateMouseEvents.prototype.up = function(event)
                {
                    if (!event.pointerType || (event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch"))
                    {
                        var self = event.data;
                        if (!self.touchHandled)
                        {
                            return
                        }
                        self.simulateMouseEvent(event, 'mouseup');
                        self.simulateMouseEvent(event, 'mouseout');
                        if (!self._touchMoved)
                        {
                            self.simulateMouseEvent(event, 'click')
                        }
                        self.touchHandled = false
                    }
                };
                _SimulateMouseEvents.prototype.bindUnBindTouchEvents = function(element, isBind, eventNamespace)
                {
                    var self = this;
                    var firstChar = eventNamespace.charAt(0);
                    if (firstChar !== '.')
                    {
                        eventNamespace = '.' + eventNamespace
                    }
                    var _msPointerDown = "MSPointerDown" + eventNamespace,
                        _msPointerMove = "MSPointerMove" + eventNamespace,
                        _msPointerUp = "MSPointerUp" + eventNamespace,
                        _pointerdown = "pointerdown" + eventNamespace,
                        _pointermove = "pointermove" + eventNamespace,
                        _pointerup = "pointerup" + eventNamespace,
                        _touchStart = "touchstart" + eventNamespace,
                        _touchMove = "touchmove" + eventNamespace,
                        _touchEnd = "touchend" + eventNamespace;
                    if (isBind)
                    {
                        if (window.navigator.msPointerEnabled)
                        {
                            if (element.style.msTouchAction !== keyword_null && typeof(element.style.msTouchAction) !== const_undefined)
                            {
                                element.style.msTouchAction = "none"
                            }
                            $(element).bind(_msPointerDown, self, self.down).bind(_pointerdown, self, self.down);
                            $(document).bind(_msPointerMove, self, self.move).bind(_pointermove, self, self.move).bind(_msPointerUp, self, self.up).bind(_pointerup, self, self.up)
                        }
                        else
                        {
                            $(element).bind(_touchStart, self, self.down).bind(_touchMove, self, self.move).bind(_touchEnd, self, self.up)
                        }
                    }
                    else
                    {
                        if (window.navigator.msPointerEnabled)
                        {
                            $(element).unbind(_msPointerDown).unbind(_pointerdown);
                            $(document).unbind(_msPointerMove).unbind(_pointermove).unbind(_msPointerUp).unbind(_pointerup)
                        }
                        else
                        {
                            $(element).unbind(_touchStart).unbind(_touchMove).unbind(_touchEnd)
                        }
                    }
                };
                return _SimulateMouseEvents
            })();
        Sheets._SimulateMouseEvents = _SimulateMouseEvents;
        var CommentTouchManager = (function()
            {
                function CommentTouchManager(element, commentView, touchEventProvider)
                {
                    var self = this;
                    var comment = self._comment = commentView._comment;
                    self._touchMouseMessageFilter = new TouchMouseMessageFilter(self);
                    self._touchTarget = new TouchTargetElement(element, "Comment" + comment._rowIndex + comment._colIndex, self._touchMouseMessageFilter, 2, 200);
                    self._touchEventProvider = touchEventProvider;
                    self._touchEventHandler = new CommentTouchEventHandler(element, commentView);
                    var touchEventHandler = self._touchEventHandler;
                    var touchTarget = self._touchTarget;
                    touchTarget.canDoManipulation = function()
                    {
                        return self._comment.commentState() !== 3
                    };
                    touchTarget.canDoTap = function()
                    {
                        return true
                    };
                    touchTarget.manipulationStarting = function(e)
                    {
                        return touchEventHandler.doManipulationStarting(e)
                    };
                    touchTarget.manipulationStarted = function(e)
                    {
                        return touchEventHandler.doManipulationStarted(e)
                    };
                    touchTarget.manipulationDelta = function(e)
                    {
                        return touchEventHandler.doManipulationDelta(e)
                    };
                    touchTarget.manipulationInertiaStarting = function(e)
                    {
                        return touchEventHandler.doManipulationInertiaStarting(e)
                    };
                    touchTarget.manipulationCompleted = function(e)
                    {
                        return touchEventHandler.doManipulationCompleted(e)
                    };
                    touchTarget.tapped = function(e)
                    {
                        return touchEventHandler.doTapped(e)
                    };
                    touchTarget.doubleTapped = function(e)
                    {
                        return touchEventHandler.doDoubleTapped(e)
                    };
                    touchTarget.rightTapped = function(e)
                    {
                        return touchEventHandler.doRightTapped(e)
                    }
                }
                CommentTouchManager.prototype.attach = function()
                {
                    if (this._touchEventProvider)
                    {
                        this._touchEventProvider.attachDettach(this._touchTarget, true)
                    }
                };
                CommentTouchManager.prototype.detach = function()
                {
                    if (this._touchEventProvider)
                    {
                        this._touchEventProvider.attachDettach(this._touchTarget, false)
                    }
                };
                CommentTouchManager.prototype.preProcessMouseDown = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseDown(event)
                };
                CommentTouchManager.prototype.preProcessMouseUp = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseUp(event)
                };
                CommentTouchManager.prototype.preProcessMouseMove = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseMove(event)
                };
                return CommentTouchManager
            })();
        Sheets.CommentTouchManager = CommentTouchManager;
        var CommentTouchEventHandler = (function()
            {
                function CommentTouchEventHandler(element, commentView)
                {
                    var self = this;
                    self._containerElement = element;
                    self._commentView = commentView;
                    self._comment = commentView._comment;
                    self._sheet = self._comment._sheet;
                    self._touchZoomManager = new TouchZoomManager(self._sheet)
                }
                CommentTouchEventHandler.prototype._positionToPage = function(position)
                {
                    var newPosition = new TouchPoint(position.X, position.Y);
                    var t = $(this._containerElement).offset();
                    if (t)
                    {
                        if (!isNaN(document.body.clientTop))
                        {
                            t.top += document.body.clientTop
                        }
                        if (!isNaN(document.body.clientLeft))
                        {
                            t.left += document.body.clientLeft
                        }
                        newPosition.X += t.left;
                        newPosition.Y += t.top
                    }
                    return newPosition
                };
                CommentTouchEventHandler.prototype.doManipulationStarting = function(e)
                {
                    e.Mode = 1 | 2 | 32
                };
                CommentTouchEventHandler.prototype.doManipulationStarted = function(e)
                {
                    var self = this;
                    var pagePosition = self._positionToPage(e.Position);
                    self._commentView._doMouseDownToDragOrResize({
                        target: e.OriginalSource, isTouch: true, button: 0, pageX: pagePosition.X, pageY: pagePosition.Y, stopPropagation: function(){}
                    });
                    self._touchZoomManager.startZoom()
                };
                CommentTouchEventHandler.prototype.doManipulationDelta = function(e)
                {
                    var self = this,
                        scale = e.Cumulative.Scale,
                        sheet = self._sheet;
                    if (scale != 1 && sheet.parent && sheet.parent._allowUserZoom)
                    {
                        sheet._eventHandler.isCommentWorking = false;
                        var commentView = self._commentView;
                        $(commentView._moveResizeContainerDom).remove();
                        self._touchZoomManager.continueZoom(scale)
                    }
                    else
                    {
                        var pagePosition = self._positionToPage(e.Position);
                        self._commentView._doMouseMove({
                            target: e.OriginalSource, isTouch: true, button: 0, pageX: pagePosition.X, pageY: pagePosition.Y, stopPropagation: function(){}
                        })
                    }
                };
                CommentTouchEventHandler.prototype.doManipulationInertiaStarting = function(e){};
                CommentTouchEventHandler.prototype.doManipulationCompleted = function(e)
                {
                    var self = this,
                        scale = e.Cumulative.Scale,
                        sheet = self._sheet;
                    if (scale !== 1 && sheet.parent && sheet.parent._allowuserZoom)
                    {
                        self._touchZoomManager.endZoom(scale)
                    }
                    else
                    {
                        var pagePosition = self._positionToPage(e.Position);
                        this._commentView._doMouseUp({
                            target: e.OriginalSource, isTouch: true, button: 0, pageX: pagePosition.X, pageY: pagePosition.Y, stopPropagation: function(){}
                        })
                    }
                };
                CommentTouchEventHandler.prototype.doTapped = function(e)
                {
                    var self = this,
                        comment = self._comment,
                        sheet = self._sheet;
                    try
                    {
                        var oldState = sheet.isPaintSuspended();
                        sheet.isPaintSuspended(true);
                        if (comment.commentState() === 3)
                        {
                            comment.commentState(1)
                        }
                        else if (comment.commentState() === 1)
                        {
                            comment.commentState(2)
                        }
                    }
                    finally
                    {
                        sheet.isPaintSuspended(oldState)
                    }
                };
                CommentTouchEventHandler.prototype.doDoubleTapped = function(e){};
                CommentTouchEventHandler.prototype.doRightTapped = function(e){};
                return CommentTouchEventHandler
            })();
        var CommentContentTouchManager = (function()
            {
                function CommentContentTouchManager(element, commentView, touchEventProvider)
                {
                    var self = this;
                    var comment = self._comment = commentView._comment;
                    self._touchMouseMessageFilter = new TouchMouseMessageFilter(self);
                    self._touchTarget = new TouchTargetElement(element, "Comment" + comment._rowIndex + comment._colIndex, self._touchMouseMessageFilter, 2, 200);
                    self._touchEventProvider = touchEventProvider;
                    self._touchEventHandler = new CommentContentTouchEventHandler(element, commentView);
                    var touchEventHandler = self._touchEventHandler;
                    var touchTarget = self._touchTarget;
                    touchTarget.canDoManipulation = function()
                    {
                        return self._comment.commentState() !== 3
                    };
                    touchTarget.canDoTap = function()
                    {
                        return true
                    };
                    touchTarget.manipulationStarting = function(e)
                    {
                        return touchEventHandler.doManipulationStarting(e)
                    };
                    touchTarget.manipulationStarted = function(e)
                    {
                        return touchEventHandler.doManipulationStarted(e)
                    };
                    touchTarget.manipulationDelta = function(e)
                    {
                        return touchEventHandler.doManipulationDelta(e)
                    };
                    touchTarget.manipulationInertiaStarting = function(e)
                    {
                        return touchEventHandler.doManipulationInertiaStarting(e)
                    };
                    touchTarget.manipulationCompleted = function(e)
                    {
                        return touchEventHandler.doManipulationCompleted(e)
                    };
                    touchTarget.tapped = function(e)
                    {
                        return touchEventHandler.doTapped(e)
                    };
                    touchTarget.doubleTapped = function(e)
                    {
                        return touchEventHandler.doDoubleTapped(e)
                    };
                    touchTarget.rightTapped = function(e)
                    {
                        return touchEventHandler.doRightTapped(e)
                    }
                }
                CommentContentTouchManager.prototype.attach = function()
                {
                    if (this._touchEventProvider)
                    {
                        this._touchEventProvider.attachDettach(this._touchTarget, true)
                    }
                };
                CommentContentTouchManager.prototype.detach = function()
                {
                    if (this._touchEventProvider)
                    {
                        this._touchEventProvider.attachDettach(this._touchTarget, false)
                    }
                };
                CommentContentTouchManager.prototype.preProcessMouseDown = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseDown(event)
                };
                CommentContentTouchManager.prototype.preProcessMouseUp = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseUp(event)
                };
                CommentContentTouchManager.prototype.preProcessMouseMove = function(event)
                {
                    return this._touchMouseMessageFilter.preProcessMouseMove(event)
                };
                return CommentContentTouchManager
            })();
        Sheets.CommentContentTouchManager = CommentContentTouchManager;
        var CommentContentTouchEventHandler = (function(_super)
            {
                __extends(CommentContentTouchEventHandler, _super);
                function CommentContentTouchEventHandler(element, commentView)
                {
                    _super.call(this, element, commentView)
                }
                CommentContentTouchEventHandler.prototype.doManipulationStarted = function(e)
                {
                    var self = this;
                    var pagePosition = self._positionToPage(e.Position);
                    self._commentView._doMouseDownToEdit({
                        target: e.OriginalSource, isTouch: true, button: 0, pageX: pagePosition.X, pageY: pagePosition.Y, stopPropagation: function(){}
                    });
                    self._touchZoomManager.startZoom()
                };
                return CommentContentTouchEventHandler
            })(CommentTouchEventHandler)
    })(GcSpread.Sheets || (GcSpread.Sheets = {}));
    var Sheets = GcSpread.Sheets
})(GcSpread || (GcSpread = {}))

