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
(function()
{
    var m = angular.module("gcspreadsheets", []);
    var oldM = angular.module("wijspread", []);
    function ColumnWrapper(index)
    {
        this.headerText = "";
        this.dataField = ""
    }
    ColumnWrapper.prototype = {
        width: function(value)
        {
            if (arguments.length === 0)
            {
                if (this.column)
                {
                    return this.column.width()
                }
                return undefined
            }
            else
            {
                this._width = value;
                if (this.column)
                {
                    this.column.width(value)
                }
                return this
            }
        }, visible: function(value)
            {
                if (arguments.length === 0)
                {
                    if (this.column)
                    {
                        return this.column.visible()
                    }
                    return undefined
                }
                else
                {
                    this._visible = value;
                    if (this.column)
                    {
                        this.column.visible(value)
                    }
                    return this
                }
            }, resizable: function(value)
            {
                if (arguments.length === 0)
                {
                    if (this.column)
                    {
                        return this.column.resizable()
                    }
                    return undefined
                }
                else
                {
                    this._resizable = value;
                    if (this.column)
                    {
                        this.column.resizable(value)
                    }
                    return this
                }
            }, defaultStyle: function(value)
            {
                if (arguments.length === 0)
                {
                    if (this.sheet)
                    {
                        return this.sheet.getStyle(-1, this.index, GcSpread.Sheets.SheetArea.viewport)
                    }
                    return null
                }
                else
                {
                    this._defaultStyle = value;
                    if (this.sheet)
                    {
                        this.sheet.setStyle(-1, this.index, value, GcSpread.Sheets.SheetArea.viewport)
                    }
                    return this
                }
            }, attach: function(sheet, column, index)
            {
                this.sheet = sheet;
                this.column = column;
                this.index = index;
                this.updata()
            }, updata: function()
            {
                this.sheet.suspendEvent();
                if (this._width !== undefined)
                {
                    this.column.width(this._width)
                }
                if (this._visible !== undefined)
                {
                    this.column.visible(this._visible)
                }
                if (this._resizable !== undefined)
                {
                    this.column.resizable(this._resizable)
                }
                if (this._defaultStyle)
                {
                    this.sheet.setStyle(-1, this.index, this._defaultStyle, GcSpread.Sheets.SheetArea.viewport)
                }
                if (this.autoFit)
                {
                    this.sheet.autoFitColumn(this.index)
                }
                this.sheet.resumeEvent()
            }
    };
    GcSpread.Sheets.ColumnWrapper = ColumnWrapper;
    function lineBorderConverter(stringValue)
    {
        if (!stringValue)
        {
            return undefined
        }
        stringValue = stringValue.trim();
        var parts;
        if (stringValue.indexOf(",") >= 0)
        {
            parts = stringValue.split(",")
        }
        else
        {
            parts = stringValue.split(" ")
        }
        var lineBorder = new GcSpread.Sheets.LineBorder;
        lineBorder.color = parts[0].trim();
        if (parts.length > 1)
        {
            lineBorder.style = GcSpread.Sheets.LineStyle[parts[1].trim()]
        }
        return lineBorder
    }
    function setValidator(style, validatorType, value)
    {
        if (!style || !validatorType)
        {
            return
        }
        validatorType = validatorType.toLowerCase();
        var validator;
        if (validatorType === "numbervalidator")
        {
            validator = GcSpread.Sheets.DefaultDataValidator.createNumberValidator(value.comparisonOperator, value.value1, value.value2, value.isIntegervalue)
        }
        else if (validatorType === "datevalidator")
        {
            validator = GcSpread.Sheets.DefaultDataValidator.createDateValidator(value.comparisonOperator, value.value1, value.value2)
        }
        else if (validatorType === "textlengthvalidator")
        {
            validator = GcSpread.Sheets.DefaultDataValidator.createTextLengthValidator(value.comparisonOperator, value.value1, value.value2)
        }
        else if (validatorType === "formulavalidator")
        {
            validator = GcSpread.Sheets.DefaultDataValidator.createFormulaValidator(value.formula)
        }
        else if (validatorType === "formulalistvalidator")
        {
            validator = GcSpread.Sheets.DefaultDataValidator.createFormulaListValidator(value.formulaList)
        }
        else if (validatorType === "listvalidator")
        {
            validator = GcSpread.Sheets.DefaultDataValidator.createListValidator(value.list)
        }
        if (validator)
        {
            if (value.ignoreBlank !== undefined)
            {
                validator.ignoreBlank = value.ignoreBlank
            }
            if (value.inCellDropdown !== undefined)
            {
                validator.inCellDropdown = value.inCellDropdown
            }
            if (value.showInputMessage !== undefined)
            {
                validator.showInputMessage = value.showInputMessage
            }
            if (value.showErrorMessage !== undefined)
            {
                validator.showErrorMessage = value.showErrorMessage
            }
            if (value.errorStyle !== undefined)
            {
                validator.errorStyle = value.errorStyle
            }
            if (value.inputMessage !== undefined)
            {
                validator.inputMessage = value.inputMessage
            }
            if (value.inputTitle !== undefined)
            {
                validator.inputTitle = value.inputTitle
            }
            if (value.errorMessage !== undefined)
            {
                validator.errorMessage = value.errorMessage
            }
            if (value.errorTitle !== undefined)
            {
                validator.errorTitle = value.errorTitle
            }
            style.validator = validator
        }
    }
    function setDataValidationResult(spread, name, value)
    {
        spread._angularDataValidationResult = value
    }
    function setComboboxItems(comboBoxCellType, itemType, value)
    {
        if (value.text === undefined && value.value === undefined)
        {
            return
        }
        if (value.text === undefined)
        {
            value.text = value.value
        }
        else if (value.value === undefined)
        {
            value.value = value.text
        }
        var items;
        if (!comboBoxCellType.items())
        {
            items = [];
            comboBoxCellType.items(items)
        }
        else
        {
            items = comboBoxCellType.items()
        }
        items.push(value)
    }
    function setSheetGroup(sheet, groupType, value)
    {
        if (groupType && value.groups)
        {
            groupType = groupType.toLowerCase().trim();
            angular.forEach(value.groups, function(groupInfo)
            {
                if (groupType === "rowrangegroup")
                {
                    sheet.rowRangeGroup.group(groupInfo.index, groupInfo.count)
                }
                else
                {
                    sheet.colRangeGroup.group(groupInfo.index, groupInfo.count)
                }
            })
        }
    }
    function addGroup(rangeGroup, groupType, value)
    {
        if (!rangeGroup.groups)
        {
            rangeGroup.groups = []
        }
        rangeGroup.groups.push(value)
    }
    function addColumns(sheet, type, value)
    {
        if (!rangeGroup.groups)
        {
            rangeGroup.groups = []
        }
        rangeGroup.groups.push(value)
    }
    function getCurrentTheme(sheet, property)
    {
        return sheet[property].call(sheet).name()
    }
    function setColumns(sheet, name, value)
    {
        sheet._columnDefs = value
    }
    function setSheets(spread, name, value)
    {
        spread._sheetDefs = value;
        value.spread = spread
    }
    function addColumn(columns, name, value)
    {
        columns.push(value)
    }
    function addSheet(sheets, name, value)
    {
        sheets.push(value);
        sheets.spread.addSheet(sheets.length - 1, value)
    }
    function setDataSource(sheet, name, value)
    {
        sheet._angularDataSource = value
    }
    function setBorder(border, name, value)
    {
        if (!border.borderLeft)
        {
            border.borderLeft = value
        }
        if (!border.borderTop)
        {
            border.borderTop = value
        }
        if (!border.borderRight)
        {
            border.borderRight = value
        }
        if (!border.borderBottom)
        {
            border.borderBottom = value
        }
    }
    var styleDef = {
            backcolor: {
                type: "string", name: "backColor"
            }, forecolor: {
                    type: "string", name: "foreColor"
                }, halign: {
                    type: "enum, HorizontalAlign", name: "hAlign"
                }, valign: {
                    type: "enum, VerticalAlign", name: "vAlign"
                }, font: {
                    type: "string", name: "font"
                }, themefont: {
                    type: "string", name: "themeFont"
                }, formatter: {
                    type: "string", name: "formatter"
                }, border: {
                    type: "LineBordeer", name: "border", getProperties: ["borderLeft", "borderTop", "borderRight", "borderBottom"], setFunction: setBorder, converter: lineBorderConverter
                }, borderleft: {
                    type: "LineBorder", name: "borderLeft", converter: lineBorderConverter
                }, bordertop: {
                    type: "LineBorder", name: "borderTop", converter: lineBorderConverter
                }, borderright: {
                    type: "LineBorder", name: "borderRight", converter: lineBorderConverter
                }, borderbottom: {
                    type: "LineBorder", name: "borderBottom", converter: lineBorderConverter
                }, locked: {
                    type: "boolean", name: "locked"
                }, wordwrap: {
                    type: "boolean", name: "wordWrap"
                }, textindent: {
                    type: "number", name: "textIndent"
                }, shrinktofit: {
                    type: "boolean", name: "shrinkToFit"
                }, backgroundimage: {
                    type: "string", name: "backgroundImage"
                }, backgroundimagelayout: {
                    type: "enum, ImageLayout", name: "backgroundImageLayout"
                }, numbervalidator: {
                    type: "object", name: "numberValidator", setFunction: setValidator, properties: {
                            comparisonoperator: {
                                type: "enum,ComparisonOperator", name: "comparisonOperator"
                            }, value1: {
                                    type: "string", name: "value1"
                                }, value2: {
                                    type: "string", name: "value2"
                                }, isintegervalue: {
                                    type: "boolean", name: "isIntegerValue"
                                }
                        }
                }, datevalidator: {
                    type: "object", name: "dateValidator", setFunction: setValidator, properties: {
                            comparisonoperator: {
                                type: "enum,ComparisonOperator", name: "comparisonOperator"
                            }, value1: {
                                    type: "string", name: "value1"
                                }, value2: {
                                    type: "string", name: "value2"
                                }
                        }
                }, textlengthvalidator: {
                    type: "object", name: "textLengthValidator", setFunction: setValidator, properties: {
                            comparisonoperator: {
                                type: "enum,ComparisonOperator", name: "comparisonOperator"
                            }, value1: {
                                    type: "string", name: "value1"
                                }, value2: {
                                    type: "string", name: "value2"
                                }
                        }
                }, formulavalidator: {
                    type: "object", name: "formulaValidator", setFunction: setValidator, properties: {formula: {
                                type: "string", name: "formula"
                            }}
                }, formulalistvalidator: {
                    type: "object", name: "formulaListValidator", setFunction: setValidator, properties: {formulalist: {
                                type: "string", name: "formulaList"
                            }}
                }, listvalidator: {
                    type: "object", name: "listValidator", setFunction: setValidator, properties: {list: {
                                type: "string", name: "list"
                            }}
                }, textcelltype: {
                    type: "TextCellType", name: "cellType", properties: {}
                }, buttoncelltype: {
                    type: "ButtonCellType", name: "cellType", properties: {
                            buttonbackcolor: {
                                type: "string", name: "buttonBackColor", setFunction: "buttonBackColor"
                            }, marginleft: {
                                    type: "number", name: "marginLeft", setFunction: "marginLeft"
                                }, margintop: {
                                    type: "number", name: "marginTop", setFunction: "marginTop"
                                }, marginright: {
                                    type: "number", name: "marginRight", setFunction: "marginRight"
                                }, marginbottom: {
                                    type: "number", name: "marginBottom", setFunction: "marginBottom"
                                }, text: {
                                    type: "string", name: "text", setFunction: "text"
                                }
                        }
                }, checkboxcelltype: {
                    type: "CheckBoxCellType", name: "cellType", properties: {
                            caption: {
                                type: "string", name: "caption", setFunction: "caption"
                            }, isthreestate: {
                                    type: "boolean", name: "isThreeState", setFunction: "isThreeState"
                                }, textalign: {
                                    type: "enum,CheckBoxTextAlign", name: "textAlign", setFunction: "textAlign"
                                }, textfalse: {
                                    type: "string", name: "textFalse", setFunction: "textFalse"
                                }, textindeterminate: {
                                    type: "string", name: "textIndeterminate", setFunction: "textIndeterminate"
                                }, texttrue: {
                                    type: "string", name: "textTrue", setFunction: "textTrue"
                                }
                        }
                }, comboboxcelltype: {
                    type: "ComboBoxCellType", name: "cellType", properties: {
                            editorvaluetype: {
                                type: "enum,EditorValueType", name: "editorValueType", setFunction: "editorValueType"
                            }, item: {
                                    type: "object", name: "items", setFunction: setComboboxItems, properties: {
                                            value: {
                                                type: "string", name: "value"
                                            }, text: {
                                                    type: "string", name: "text"
                                                }
                                        }
                                }
                        }
                }, hyperlinkcelltype: {
                    type: "HyperLinkCellType", name: "cellType", properties: {
                            linkcolor: {
                                type: "string", name: "linkColor", setFunction: "linkColor"
                            }, linktooltip: {
                                    type: "string", name: "linkToolTip", setFunction: "linkToolTip"
                                }, text: {
                                    type: "string", name: "text", setFunction: "text"
                                }, visitedlinkcolor: {
                                    type: "string", name: "visitedLinkColor", setFunction: "visitedLinkColor"
                                }
                        }
                }
        };
    var validators = ["numbervalidator", "datevalidator", "textlengthvalidator", "formulavalidator", "formulalistvalidator", "listvalidator"];
    for (var i = 0; i < validators.length; i++)
    {
        var validatorProperties = styleDef[validators[i]]["properties"];
        validatorProperties["ignoreblank"] = {
            type: "boolean", name: "ignoreBlank"
        };
        validatorProperties["incelldropdown"] = {
            type: "boolean", name: "inCellDropdown"
        };
        validatorProperties["showinputmessage"] = {
            type: "boolean", name: "showInputMessage"
        };
        validatorProperties["showerrormessage"] = {
            type: "boolean", name: "showErrorMessage"
        };
        validatorProperties["errorstyle"] = {
            type: "enum, ErrorStyle", name: "errorStyle"
        };
        validatorProperties["inputmessage"] = {
            type: "string", name: "inputMessage"
        };
        validatorProperties["inputtitle"] = {
            type: "string", name: "inputTitle"
        };
        validatorProperties["errormessage"] = {
            type: "string", name: "errorMessage"
        };
        validatorProperties["errortitle"] = {
            type: "string", name: "errorTitle"
        }
    }
    var groupDef = {group: {
                type: "object", name: "group", setFunction: addGroup, properties: {
                        index: {
                            type: "number", name: "index"
                        }, count: {
                                type: "number", name: "count"
                            }
                    }
            }};
    var columnPropertyMap = {
            datafield: {
                type: "string", name: "dataField"
            }, headertext: {
                    type: "string", name: "headerText"
                }, width: {
                    type: "number", name: "width", setFunction: "width", getFunction: "width"
                }, visible: {
                    type: "boolean", name: "visible", setFunction: "visible", getFunction: "visible"
                }, resizable: {
                    type: "boolean", name: "resizable", setFunction: "resizable", getFunction: "resizable"
                }, defaultstyle: {
                    type: "Style", name: "defaultStyle", setFunction: "defaultStyle", getFunction: "defaultStyle", properties: styleDef
                }, autofit: {
                    type: "boolean", name: "autoFit"
                }
        };
    var columnsDef = {column: {
                type: "ColumnWrapper", name: "column", setFunction: addColumn, properties: columnPropertyMap
            }};
    var sheetPropertyMap = {
            name: {
                type: "string", name: "name", setFunction: "setName", getFunction: "getName"
            }, referencestyle: {
                    type: "enum, ReferenceStyle", name: "referenceStyle", setFunction: "referenceStyle", getFunction: "referenceStyle"
                }, frozentrailingcolumncount: {
                    type: "number", name: "frozenTrailingColumnCount", setFunction: "setFrozenTrailingColumnCount", getFunction: "getFrozenTrailingColumnCount"
                }, frozentrailingrowcount: {
                    type: "number", name: "frozenTrailingRowCount", setFunction: "setFrozenTrailingRowCount", getFunction: "getFrozenTrailingRowCount"
                }, frozencolumncount: {
                    type: "number", name: "frozenColumnCount", setFunction: "setFrozenColumnCount", getFunction: "getFrozenColumnCount"
                }, frozenrowcount: {
                    type: "number", name: "frozenRowCount", setFunction: "setFrozenRowCount", getFunction: "getFrozenRowCount"
                }, defaultstyle: {
                    type: "Style", name: "defaultStyle", setFunction: {
                            name: "setDefaultStyle", args: ["$value-replace$", GcSpread.Sheets.SheetArea.viewport]
                        }, properties: styleDef
                }, rowheaderdefaultstyle: {
                    type: "Style", name: "rowHeaderDefaultStyle", setFunction: {
                            name: "setDefaultStyle", args: ["$value-replace$", GcSpread.Sheets.SheetArea.rowHeader]
                        }, properties: styleDef
                }, columnheaderdefaultstyle: {
                    type: "Style", name: "columnHeaderDefaultStyle", setFunction: {
                            name: "setDefaultStyle", args: ["$value-replace$", GcSpread.Sheets.SheetArea.colHeader]
                        }, properties: styleDef
                }, cornerheaderdefaultstyle: {
                    type: "Style", name: "cornerHeaderDefaultStyle", setFunction: {
                            name: "setDefaultStyle", args: ["$value-replace$", GcSpread.Sheets.SheetArea.corner]
                        }, properties: styleDef
                }, allowcelloverflow: {
                    type: "boolean", name: "allowCellOverflow", setFunction: "allowCellOverflow", getFunction: "allowCellOverflow"
                }, frozenlinecolor: {
                    type: "string", name: "frozenlineColor", setFunction: "frozenlineColor", getFunction: "frozenlineColor"
                }, sheettabcolor: {
                    type: "string", name: "sheetTabColor", setFunction: "sheetTabColor", getFunction: "sheetTabColor"
                }, rowcount: {
                    type: "number", name: "rowCount", setFunction: "setRowCount", getFunction: "getRowCount"
                }, selectionpolicy: {
                    type: "enum, SelectionPolicy", name: "selectionPolicy", setFunction: "selectionPolicy", getFunction: "selectionPolicy"
                }, selectionunit: {
                    type: "enum,SelectionUnit", name: "selectionUnit", setFunction: "selectionUnit", getFunction: "selectionUnit"
                }, zoom: {
                    type: "number", name: "zoom", setFunction: "zoom", getFunction: "zoom"
                }, currenttheme: {
                    type: "string", name: "currentTheme", setFunction: "currentTheme", getFunction: getCurrentTheme
                }, clipboardoptions: {
                    type: "enum,ClipboardPasteOptions", name: "clipBoardOptions", setFunction: "clipBoardOptions", getFunction: "clipBoardOptions"
                }, canuserdragfill: {
                    type: "boolean", name: "canUserDragFill", setFunction: "canUserDragFill", getFunction: "canUserDragFill"
                }, canuserdragdrop: {
                    type: "boolean", name: "canUserDragDrop", setFunction: "canUserDragDrop", getFunction: "canUserDragDrop"
                }, rowheadervisible: {
                    type: "boolean", name: "rowHeaderVisible", setFunction: "setRowHeaderVisible", getFunction: "getRowHeaderVisible"
                }, columnheadervisible: {
                    type: "boolean", name: "columnHeaderVisible", setFunction: "setColumnHeaderVisible", getFunction: "getColumnHeaderVisible"
                }, rowheaderautotext: {
                    type: "enum, HeaderAutoText", name: "rowHeaderAutoText", setFunction: "setRowHeaderAutoText", getFunction: "getRowHeaderAutoText"
                }, columnheaderautotext: {
                    type: "enum, HeaderAutoText", name: "columnHeaderAutoText", setFunction: "setColumnHeaderAutoText", getFunction: "getColumnHeaderAutoText"
                }, rowheaderautotextindex: {
                    type: "number", name: "rowHeaderAutoTextIndex", setFunction: "setRowHeaderAutoTextIndex", getFunction: "getRowHeaderAutoTextIndex"
                }, columnheaderautotextindex: {
                    type: "number", name: "columnHeaderAutoTextIndex", setFunction: "setColumnHeaderAutoTextIndex", getFunction: "getColumnHeaderAutoTextIndex"
                }, isprotected: {
                    type: "boolean", name: "isProtected", setFunction: "setIsProtected", getFunction: "getIsProtected"
                }, showrowrangegroup: {
                    type: "boolean", name: "showRowRangeGroup", setFunction: "showRowRangeGroup", getFunction: "showRowRangeGroup"
                }, showcolumnrangegroup: {
                    type: "boolean", name: "showColumnRangeGroup", setFunction: "showColumnRangeGroup", getFunction: "showColumnRangeGroup"
                }, rowrangegroup: {
                    type: "object", name: "rowRangeGroup", setFunction: setSheetGroup, properties: groupDef
                }, colrangegroup: {
                    type: "object", name: "colRangeGroup", setFunction: setSheetGroup, properties: groupDef
                }, selectionbackcolor: {
                    type: "string", name: "selectionBackColor", setFunction: "selectionBackColor", getFunction: "selectionBackColor"
                }, selectionbordercolor: {
                    type: "string", name: "selectionBorderColor", setFunction: "selectionBorderColor", getFunction: "selectionBorderColor"
                }, columns: {
                    type: "[]", name: "columns", setFunction: setColumns, properties: columnsDef
                }, datasource: {
                    type: "[]", name: "dataSource", setFunction: setDataSource
                }, datasourcedeepwatch: {
                    type: "boolean", name: "dataSourceDeepWatch"
                }
        };
    var sheetsDef = {sheet: {
                type: "Sheet", name: "sheet", setFunction: addSheet, properties: sheetPropertyMap
            }};
    var spreadPropertyMap = {
            name: {
                type: "string", name: "name"
            }, allowuserzoom: {
                    type: "boolean", name: "allowUserZoom", setFunction: "allowUserZoom", getFunction: "allowUserZoom"
                }, allowuserresize: {
                    type: "boolean", name: "allowUserResize", setFunction: "allowUserResize", getFunction: "allowUserResize"
                }, tabstripvisible: {
                    type: "boolean", name: "tabStripVisible", setFunction: "tabStripVisible", getFunction: "tabStripVisible"
                }, tabeditable: {
                    type: "boolean", name: "tabEditable", setFunction: "tabEditable", getFunction: "tabEditable"
                }, newtabvisible: {
                    type: "boolean", name: "newTabVisible", setFunction: "newTabVisible", getFunction: "newTabVisible"
                }, canusereditformula: {
                    type: "boolean", name: "canUserEditFormula", setFunction: "canUserEditFormula", getFunction: "canUserEditFormula"
                }, autofittype: {
                    type: "enum, AutoFitType", name: "autoFitType", setFunction: "autoFitType", getFunction: "autoFitType"
                }, canuserdragfill: {
                    type: "boolean", name: "canUserDragFill", setFunction: "canUserDragFill", getFunction: "canUserDragFill"
                }, canuserdragdrop: {
                    type: "boolean", name: "canUserDragDrop", setFunction: "canUserDragDrop", getFunction: "canUserDragDrop"
                }, highlightinvaliddata: {
                    type: "boolean", name: "highlightInvalidData", setFunction: "highlightInvalidData", getFunction: "highlightInvalidData"
                }, referencestyle: {
                    type: "enum, ReferenceStyle", name: "referenceStyle", setFunction: "referenceStyle", getFunction: "referenceStyle"
                }, backcolor: {
                    type: "string", name: "backColor", setFunction: "backColor", getFunction: "backColor"
                }, grayareabackcolor: {
                    type: "string", name: "grayAreaBackColor", setFunction: "grayAreaBackColor", getFunction: "grayAreaBackColor"
                }, backgroundimage: {
                    type: "string", name: "backgroundImage", setFunction: "backgroundImage", getFunction: "backgroundImage"
                }, backgroundimagelayout: {
                    type: "enum, ImageLayout", name: "backgroundImageLayout", setFunction: "backgroundImageLayout", getFunction: "backgroundImageLayout"
                }, showverticalscrollbar: {
                    type: "boolean", name: "showVerticalScrollbar", setFunction: "showVerticalScrollbar", getFunction: "showVerticalScrollbar"
                }, showhorizontalscrollbar: {
                    type: "boolean", name: "showHorizontalScrollbar", setFunction: "showHorizontalScrollbar", getFunction: "showHorizontalScrollbar"
                }, showscrolltip: {
                    type: "enum, ShowScrollTip", name: "showScrollTip", setFunction: "showScrollTip", getFunction: "showScrollTip"
                }, showresizetip: {
                    type: "enum, ShowResizeTip", name: "showResizeTip", setFunction: "showResizeTip", getFunction: "showResizeTip"
                }, showdragdroptip: {
                    type: "boolean", name: "showDragDropTip", setFunction: "showDragDropTip", getFunction: "showDragDropTip"
                }, showdragfilltip: {
                    type: "boolean", name: "showDragFillTip", setFunction: "showDragFillTip", getFunction: "showDragFillTip"
                }, datavalidationresult: {
                    type: "enum, DataValidationResult", name: "DataValidationResult", setFunction: setDataValidationResult
                }, sheets: {
                    type: "[]", name: "sheets", setFunction: setSheets, properties: sheetsDef
                }
        };
    var Node;
    (function(Node)
    {
        Node._map = [];
        Node.ELEMENT_NODE = 1;
        Node.ATTRIBUTE_NODE = 2;
        Node.TEXT_NODE = 3;
        Node.CDATA_SECTION_NODE = 4;
        Node.ENTITY_REFERENCE_NODE = 5;
        Node.ENTITY_NODE = 6;
        Node.PROCESSING_INSTRUCTION_NODE = 7;
        Node.COMMENT_NODE = 8;
        Node.DOCUMENT_NODE = 9;
        Node.DOCUMENT_TYPE_NODE = 10;
        Node.DOCUMENT_FRAGMENT_NODE = 11;
        Node.NOTATION_NODE = 12
    })(Node || (Node = {}));
    var SpreadAngularManager;
    (function(SpreadAngularManager)
    {
        var ngMgr = SpreadAngularManager;
        SpreadAngularManager.setValues = function(scope)
        {
            if (ngMgr.valueCatch)
            {
                angular.forEach(ngMgr.valueCatch, function(catchObject)
                {
                    var target = catchObject.target;
                    angular.forEach(catchObject.setting, function(propertySet)
                    {
                        var nodeDef = propertySet.nodeDef;
                        var value = propertySet.value;
                        ngMgr.setPropertyValue(target, nodeDef, value)
                    })
                })
            }
            ;
        };
        SpreadAngularManager.setBindings = function(scope)
        {
            var parentScope = scope.$parent;
            if (ngMgr.bindings)
            {
                angular.forEach(ngMgr.bindings, function(attBinding)
                {
                    if (attBinding.dynamicText)
                    {
                        var bindingPath = attBinding.dynamicText.substring(2, attBinding.dynamicText.length - 2);
                        if (!attBinding.target._angularBindingPath)
                        {
                            attBinding.target._angularBindingPath = {}
                        }
                        attBinding.target._angularBindingPath[attBinding.name] = bindingPath;
                        var bindingPathLowerCase = bindingPath;
                        if (parentScope[bindingPathLowerCase] === undefined)
                        {
                            parentScope[bindingPathLowerCase] = SpreadAngularManager.getPropertyValue(attBinding.target, attBinding.metadata)
                        }
                        else
                        {
                            ngMgr.setPropertyValue(attBinding.target, attBinding.metadata, parentScope[bindingPathLowerCase])
                        }
                        parentScope.$watch(bindingPath, function(value)
                        {
                            ngMgr.setPropertyValue(attBinding.target, attBinding.metadata, value)
                        })
                    }
                })
            }
            ;
        };
        SpreadAngularManager.initSpread = function(scope, element, attrs)
        {
            var node = element[0];
            ngMgr._readNodeWithChildren(scope, node, spreadPropertyMap, "sheets", false)
        };
        SpreadAngularManager._readNodeWithChildren = function(target, node, map, excludeChildren, setValueDirectly)
        {
            if (!setValueDirectly)
            {
                if (!ngMgr.valueCatch)
                {
                    ngMgr.valueCatch = []
                }
                var catchObject;
                angular.forEach(ngMgr.valueCatch, function(catchTmp)
                {
                    if (catchTmp.target === target)
                    {
                        catchObject = catchTmp
                    }
                });
                if (!catchObject)
                {
                    catchObject = {
                        target: target, setting: []
                    };
                    ngMgr.valueCatch.push(catchObject)
                }
            }
            angular.forEach(node.attributes, function(attNode)
            {
                ngMgr._readNode(target, attNode, map, catchObject, setValueDirectly)
            });
            if (node.childNodes.length > 0)
            {
                angular.forEach(node.childNodes, function(childNode)
                {
                    var nodeName = childNode.nodeName.toLowerCase();
                    nodeName = ngMgr.normalizeName(nodeName);
                    var nodeDef = map[nodeName];
                    if (!nodeDef || !nodeDef.type)
                    {
                        return
                    }
                    var childTarget;
                    if (nodeDef.type === "object")
                    {
                        childTarget = {}
                    }
                    else if (nodeDef.type === "[]")
                    {
                        childTarget = []
                    }
                    else
                    {
                        var type = GcSpread.Sheets[nodeDef.type];
                        if (!type)
                        {
                            return
                        }
                        childTarget = new type
                    }
                    if (nodeDef.name === "sheets" || nodeDef.name === "sheet" || nodeDef.name === "columns" || nodeDef.name === "column")
                    {
                        ngMgr._readNodeWithChildren(childTarget, childNode, nodeDef.properties, undefined, false)
                    }
                    else
                    {
                        ngMgr._readNodeWithChildren(childTarget, childNode, nodeDef.properties, undefined, true)
                    }
                    if (setValueDirectly)
                    {
                        ngMgr.setPropertyValue(target, nodeDef, childTarget)
                    }
                    else
                    {
                        catchObject.setting.push({
                            nodeDef: nodeDef, value: childTarget
                        })
                    }
                })
            }
        };
        SpreadAngularManager.convertValue = function(value, targetType, converter)
        {
            if (converter)
            {
                return converter.call(null, value)
            }
            if (value === undefined || targetType === undefined)
            {
                return value
            }
            if (typeof value === "string")
            {
                value = value.trim()
            }
            if (targetType.length > 2 && targetType[0] === "[")
            {
                var argType = targetType.substring(1, targetType.length - 2);
                if (value.length > 2)
                {
                    if (value[0] === "[" && value[value.length - 1] === "]")
                    {
                        value = value.substring(1, value.length - 2)
                    }
                    var partsValue = value.split(",");
                    var result = [];
                    for (var i = 0; i < partsValue.length; i++)
                    {
                        result.push(ngMgr.convertValue(partsValue[i], argType, converter))
                    }
                    return result
                }
            }
            switch (targetType)
            {
                case"string":
                    return value;
                case"boolean":
                    if (typeof value === "boolean")
                    {
                        return value
                    }
                    if (value.toLowerCase() === "true")
                    {
                        return true
                    }
                    else if (value.toLowerCase() === "false")
                    {
                        return false
                    }
                    return Boolean(value);
                case"number":
                    return Number(value);
                case"color":
                    return value;
                case"[]":
                    return value
            }
            if (targetType.length > 5 && targetType.substring(0, 5) === "enum,")
            {
                if (typeof value === "number" || typeof value === "string" && parseInt(value) !== undefined && !isNaN(parseInt(value)))
                {
                    result = parseInt(value)
                }
                else
                {
                    targetType = targetType.substring(5).trim();
                    var resultType = GcSpread.Sheets;
                    if (targetType.indexOf(".") > 0)
                    {
                        var parts = name.split(".");
                        for (var i = 0; i < parts.length; i++)
                        {
                            resultType = result[parts[i]]
                        }
                    }
                    else
                    {
                        resultType = resultType[targetType]
                    }
                    result = resultType[value];
                    if (result === undefined)
                    {
                        value = value[0].toUpperCase() + value.substring(1);
                        result = resultType[value]
                    }
                }
                return result
            }
            return value
        };
        SpreadAngularManager.normalizeName = function(name)
        {
            if (name.match(/-/))
            {
                var parts = name.split("-");
                name = parts.shift();
                angular.forEach(parts, function(p)
                {
                    name += p
                })
            }
            return name
        };
        SpreadAngularManager._readNode = function(target, node, map, catchObject, setValueDirectly)
        {
            var $node = $(node),
                value,
                name,
                propPath;
            switch (node.nodeType)
            {
                case Node.ATTRIBUTE_NODE:
                    value = $node.val();
                    break;
                case Node.ELEMENT_NODE:
                    value = $node.text();
                    break;
                default:
                    return
            }
            name = node.nodeName || node.name;
            name = name.toLowerCase();
            name = ngMgr.normalizeName(name);
            var metadata = map[name];
            if (metadata)
            {
                name = metadata.name
            }
            else
            {
                return
            }
            if (!ngMgr.hasChildElements(node) && value && value.length > 4 && value.substring(0, 2) === "{{" && value.substring(value.length - 2) === "}}")
            {
                if (!ngMgr.bindings)
                {
                    ngMgr.bindings = []
                }
                ngMgr.bindings.push({
                    target: target, metadata: metadata, path: name, name: name, dynamicText: value
                });
                return
            }
            if (value.match(/^[^\d]/) && node.nodeType === Node.ATTRIBUTE_NODE && (metadata.changeEvent || metadata.twoWayBinding))
            {
                if (!ngMgr.bindings)
                {
                    ngMgr.bindings = []
                }
                _ngMgr.bindings.push({
                    target: target, path: (path && path + ".") + name, name: name, expression: value
                })
            }
            else if (node.nodeType === Node.ATTRIBUTE_NODE)
            {
                if (setValueDirectly)
                {
                    ngMgr.setPropertyValue(target, metadata, value)
                }
                else
                {
                    catchObject.setting.push({
                        nodeDef: metadata, value: value
                    })
                }
            }
            else
            {}
        };
        SpreadAngularManager.setPropertyValue = function(target, metadata, value)
        {
            if (value === undefined)
            {
                return
            }
            if (target.$scopeObject)
            {
                target = target.$scopeObject
            }
            try
            {
                value = ngMgr.convertValue(value, metadata.type, metadata.converter);
                if (metadata.setFunction)
                {
                    if (typeof metadata.setFunction === "function")
                    {
                        metadata.setFunction.call(ngMgr, target, metadata.name, value)
                    }
                    else
                    {
                        ngMgr.setPropertyValueCore(target, value, undefined, metadata.setFunction)
                    }
                }
                else
                {
                    ngMgr.setPropertyValueCore(target, value, metadata.name);
                    target[metadata.name] = value
                }
            }
            catch(ex) {}
        };
        SpreadAngularManager.setPropertyValueCore = function(target, value, propertyName, setFunction)
        {
            if (propertyName)
            {
                target[propertyName] = value
            }
            else if (setFunction)
            {
                if (typeof setFunction === "string")
                {
                    target[setFunction].call(target, value)
                }
                else
                {
                    var functionName = setFunction.name;
                    var args = [];
                    for (var i = 0; i < setFunction.args.length; i++)
                    {
                        if (setFunction.args[i] === "$value-replace$")
                        {
                            args[i] = value
                        }
                        else
                        {
                            args[i] = setFunction.args[i]
                        }
                    }
                    switch (args.length)
                    {
                        case 1:
                            target[functionName].call(target, args[0]);
                            break;
                        case 2:
                            target[functionName].call(target, args[0], args[1]);
                            break;
                        case 3:
                            target[functionName].call(target, args[0], args[1], args[2]);
                            break;
                        case 4:
                            target[functionName].call(target, args[0], args[1], args[2], args[3]);
                            break;
                        case 5:
                            target[functionName].call(target, args[0], args[1], args[2], args[3], args[4]);
                            break
                    }
                }
            }
        };
        SpreadAngularManager.getPropertyValue = function(target, metadata)
        {
            if (target.$scopeObject)
            {
                target = target.$scopeObject
            }
            var value = "";
            try
            {
                if (metadata.getProperties)
                {
                    angular.forEach(metadata.getProperties, function(setProperty)
                    {
                        if (value === "")
                        {
                            value = ngMgr.setPropertyValueCore(target, value, setProperty)
                        }
                        else
                        {
                            value = value + "," + ngMgr.setPropertyValueCore(target, value, setProperty)
                        }
                    })
                }
                else if (metadata.getFunction)
                {
                    if (typeof metadata.getFunction === "function")
                    {
                        return metadata.getFunction.call(ngMgr, target, metadata.name)
                    }
                    else
                    {
                        value = ngMgr.getPropertyValueCore(target, undefined, metadata.getFunction)
                    }
                }
                else
                {
                    value = ngMgr.getPropertyValueCore(target, name)
                }
            }
            catch(ex) {}
            return value
        };
        SpreadAngularManager.getPropertyValueCore = function(target, propertyName, getFunction)
        {
            if (propertyName)
            {
                return target[propertyName]
            }
            else if (getFunction)
            {
                if (typeof getFunction === "string")
                {
                    return target[getFunction].call(target)
                }
            }
            return ""
        };
        SpreadAngularManager.hasChildElements = function(node)
        {
            if (!node || !node.childNodes)
            {
                return false
            }
            var len = node.childNodes.length;
            for (var i = 0; i < len; i++)
            {
                var child = node.childNodes[i];
                if (child.nodeType == Node.ELEMENT_NODE)
                {
                    return true
                }
            }
            return false
        };
        SpreadAngularManager.angularDerictive = function()
        {
            return {
                    restrict: "E", replace: true, transclude: true, template: "<div ng-transclude/>", scope: {}, controller: ["$scope", function($scope){}], link: function(scope, element, attrs)
                        {
                            SpreadAngularManager.initSpread(scope, element, attrs);
                            var spread = new GcSpread.Sheets.Spread(element[0], 0);
                            var ns = GcSpread.Sheets;
                            var parnetScope = scope.$parent;
                            scope.$scopeObject = spread;
                            spread.suspendCalcService(true);
                            spread.isPaintSuspended(true);
                            SpreadAngularManager.setValues(scope);
                            var sheetDefs = spread._sheetDefs;
                            var hasDataSourceBind = false;
                            if (sheetDefs && sheetDefs.length > 0)
                            {
                                for (var i = 0; i < sheetDefs.length; i++)
                                {
                                    var sheet = sheetDefs[i];
                                    sheet.suspendEvent();
                                    initSheet(sheet);
                                    if (sheet._angularDataSource)
                                    {
                                        hasDataSourceBind = true;
                                        var dataSourceDeepWatch = true;
                                        if (sheet.dataSourceDeepWatch !== undefined)
                                        {
                                            dataSourceDeepWatch = sheet.dataSourceDeepWatch
                                        }
                                        var watchSheet = function(sheet1, dataSourceDeepWatch1)
                                            {
                                                parnetScope.$watch(sheet1._angularDataSource, function(newValue, oldValue)
                                                {
                                                    bindSheet(sheet1, oldValue, newValue)
                                                }, dataSourceDeepWatch1)
                                            };
                                        watchSheet(sheet, dataSourceDeepWatch)
                                    }
                                    sheet.resumeEvent()
                                }
                            }
                            if (!hasDataSourceBind)
                            {
                                spread.isPaintSuspended(false)
                            }
                            spread.resumeCalcService(false);
                            function initSheet(sheet)
                            {
                                var hasColumns = sheet._columnDefs && sheet._columnDefs.length > 0;
                                if (hasColumns)
                                {
                                    sheet.setColumnCount(sheet._columnDefs.length);
                                    for (var cIndex = 0; cIndex < sheet._columnDefs.length; cIndex++)
                                    {
                                        sheet._columnDefs[cIndex].attach(sheet, sheet.getColumn(cIndex), cIndex)
                                    }
                                }
                                sheet.bind(ns.Events.ValidationError, function(event, data)
                                {
                                    if (spread._angularDataValidationResult !== undefined)
                                    {
                                        data.validationResult = spread._angularDataValidationResult
                                    }
                                    else
                                    {
                                        data.validationResult = ns.DataValidationResult.Discard
                                    }
                                });
                                sheet.bind(ns.Events.ColumnWidthChanged, function(event, data)
                                {
                                    var sheet = data.sheet;
                                    var colList = data.colList;
                                    for (var col = 0; col < colList.length; col++)
                                    {
                                        var columnWrapper = sheet._columnDefs[colList[col]];
                                        var bindingPath = columnWrapper._angularBindingPath && columnWrapper._angularBindingPath["width"];
                                        if (bindingPath)
                                        {
                                            parnetScope[bindingPath] = sheet.getColumnWidth(colList[col])
                                        }
                                    }
                                    parnetScope.$apply()
                                });
                                sheet.bind(ns.Events.SheetNameChanged, function(event, data)
                                {
                                    var bindingPath = sheet._angularBindingPath && sheet._angularBindingPath["name"];
                                    if (bindingPath)
                                    {
                                        parnetScope[bindingPath] = data.newValue;
                                        parnetScope.$apply()
                                    }
                                });
                                sheet.bind(ns.Events.UserZooming, function(event, data)
                                {
                                    var bindingPath = sheet._angularBindingPath && sheet._angularBindingPath["zoom"];
                                    if (bindingPath)
                                    {
                                        parnetScope[bindingPath] = data.newValue;
                                        parnetScope.$apply()
                                    }
                                });
                                SpreadAngularManager.setBindings(scope)
                            }
                            function bindSheet(sheet, oldDataSource, newDataSource)
                            {
                                if (newDataSource)
                                {
                                    if (newDataSource !== sheet.getDataSource())
                                    {
                                        sheet.isPaintSuspended(true);
                                        var hasColumns = sheet._columnDefs && sheet._columnDefs.length > 0;
                                        if (hasColumns)
                                        {
                                            sheet.autoGenerateColumns = false;
                                            sheet.setDataSource(newDataSource, false);
                                            sheet.setColumnCount(sheet._columnDefs.length);
                                            for (var col = 0; col < sheet._columnDefs.length; col++)
                                            {
                                                bindColumn(sheet, col)
                                            }
                                        }
                                        else
                                        {
                                            var colWidths = getColWidths(sheet);
                                            sheet.autoGenerateColumns = true;
                                            sheet.setDataSource(newDataSource, false);
                                            for (var col = 0; col < sheet.getColumnCount(); col++)
                                            {
                                                var header = sheet.getValue(0, col, ns.SheetArea.colHeader);
                                                header = getHeader(header);
                                                sheet.setValue(0, col, header, ns.SheetArea.colHeader);
                                                if (header.indexOf("$$") == 0)
                                                {
                                                    sheet.deleteColumns(col, 1);
                                                    col--
                                                }
                                            }
                                            setColWidths(sheet, colWidths)
                                        }
                                        if (sheet.parent.isPaintSuspended())
                                        {
                                            sheet.parent.isPaintSuspended(false)
                                        }
                                        else
                                        {
                                            sheet.isPaintSuspended(false)
                                        }
                                    }
                                    else if (newDataSource && oldDataSource && newDataSource.length != oldDataSource.length)
                                    {
                                        sheet.setRowCount(newDataSource.length);
                                        sheet.invalidateLayout();
                                        sheet.repaint()
                                    }
                                    else
                                    {
                                        sheet.invalidateLayout();
                                        sheet.repaint()
                                    }
                                }
                                else if (oldDataSource)
                                {
                                    sheet.setDataSource(null, true)
                                }
                            }
                            function bindColumn(sheet, index)
                            {
                                var column = sheet.getColumn(index);
                                var columnWraper = sheet._columnDefs[index];
                                if (columnWraper.dataField || columnWraper.headerText)
                                {
                                    sheet.bindColumn(index, {
                                        name: columnWraper.dataField, displayName: columnWraper.headerText
                                    })
                                }
                                columnWraper.updata()
                            }
                            function getHeader(name)
                            {
                                name = name.charAt(0).toUpperCase() + name.slice(1);
                                while (name.indexOf("_") > -1)
                                    name = name.replace("_", " ");
                                return name
                            }
                            function getColWidths(sheet)
                            {
                                var arr = [];
                                for (var i = 0; i < sheet.getColumnCount(); i++)
                                {
                                    arr.push(sheet.getColumn(i).width())
                                }
                                return arr
                            }
                            function setColWidths(sheet, colWidths)
                            {
                                if (sheet.getColumnCount() == colWidths.length)
                                {
                                    for (var i = 0; i < sheet.getColumnCount(); i++)
                                    {
                                        sheet.getColumn(i).width(colWidths[i])
                                    }
                                }
                            }
                        }
                }
        }
    })(SpreadAngularManager || (SpreadAngularManager = {}));
    m.directive("gcspreadSheets", function()
    {
        return SpreadAngularManager.angularDerictive()
    });
    oldM.directive("wijSpread", function()
    {
        return SpreadAngularManager.angularDerictive()
    })
})()

