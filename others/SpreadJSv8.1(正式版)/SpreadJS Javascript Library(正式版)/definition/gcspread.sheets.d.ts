declare module GcSpread.Sheets{
    /**
     * Adds a culture.
     * @param {string} cultureName The culture name.
     * @param {GcSpread.Sheets.CultureInfo} culture The culture.
     */
    function addCultureInfo(cultureName: string, culture: CultureInfo): void;
    /**
     * Gets or sets the SpreadJS culture.
     * @param {string} culture The culture of the current Spread.
     * @returns If this is invoked with no parameter, the return value is the current culture string.
     */
    function Culture(culture?: string): any;
    /**
     * Gets the specified culture.
     * @param {string} cultureName The culture name.
     * @returns {GcSpread.Sheets.CultureInfo} culture The culture.
     */
    function getCultureInfo(cultureName: string): CultureInfo;
    /**
     * Gets the type from the type string. This method is used for supporting the serialization of the custom object.
     * @param {string} typeString The type string.
     * @returns {Object} The type.
     */
    function getTypeFromString(typeString: string): any;

    export interface IDirtyCellInfo{
        row: number;
        col: number;
        newValue: any;
        oldValue: any;
    }


    export interface IFormulaRangeHitInfo{
        paramRange: IParamRange; //param range info
        inTopLeft?: boolean;
        inTopRight?: boolean;
        inBottomLeft?: boolean;
        inBottomRight?: boolean;
        inBorder?: boolean;
    }


    export interface IFunctionDescription{
        name: string;
        description: string;
        parameters: IParameterDescription[];
    }


    export interface IGroupHitInfo{
        index?: number;
        isExpanded?: boolean;
        level?: number;
        lineDirection?: RangeGroupDirection;
        paintLine?: boolean;
    }


    export interface IHitTestCellTypeHitInfo{
        x?: number;
        y?: number;
        row?: number;
        col?: number;
        cellRect?: Rect;
        sheetArea?: SheetArea;
        isReservedLocation?: boolean;
        isEditting?: boolean;
    }


    export interface IHitTestCommentHitInfo{
        x?: number;
        y?: number;
        comment?: Comment;
        area?: string;
    }


    export interface IHitTestDragInfo{
        action?: string;
        side?: string;
        outside?: boolean;
    }


    export interface IHitTestFilterButtonHitInfo{
        rowFilter: any;
        row?: number;
        col?: number;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        sheetArea?: SheetArea;
    }


    export interface IHitTestFloatingObjectHitInfo{
        x?: number;
        y?: number;
        floatingObject?: FloatingObject;
    }


    export interface IHitTestGroupHitInfo{
        what?: string;
        info?: IGroupHitInfo;
    }


    export interface IHitTestInformation{
        x?: number;
        y?: number;
        rowViewportIndex?: number;
        colViewportIndex?: number;
        row?: number;
        col?: number;
        hitTestType?: SheetArea;
        resizeInfo?: IHitTestResizeInfo;
        groupHitInfo?: IHitTestGroupHitInfo;
        filterButtonHitInfo?: IHitTestFilterButtonHitInfo;
        dragInfo?: IHitTestDragInfo;
        cellTypeHitInfo?: IHitTestCellTypeHitInfo;
        floatingObjectHitInfo?: IHitTestFloatingObjectHitInfo;
        formulaRangeHitInfo?: IFormulaRangeHitInfo;
        commentHitInfo?: IHitTestCommentHitInfo;
    }


    export interface IHitTestResizeInfo{
        action?: string;
        index?: number;
        sheetArea?: SheetArea;
        startY?: number;
        movingY?: number;
        startX?: number;
        movingX?: number;
    }


    export interface IParameterDescription{
        name: string;
        repeatable?: boolean;
        optional?: boolean;
    }


    export interface IParamRange{
        textOffset: number; // range text offset in formulatextbox's value
        text: string; // range text
        index: number; // index in all ranges
    }


    export interface ISerializationOption{
        includeBindingSource: boolean;
    }


    export interface ISheetDefaultOption{
        rowHeight?: number;
        colHeaderRowHeight?: number;
        colWidth?: number;
        rowHeaderColWidth?: number;
    }


    export interface ISheetGridlineOption{
        color?: string;
        showVerticalGridline?: boolean;
        showHorizontalGridline?: boolean;
    }


    export interface IUndoManager{
        canUndo(): boolean;
        canRedo(): boolean;
        undo(): boolean;
        redo(): boolean;
    }

    /**
     * Represents the type of drag fill.
     * @enum {number}
     */
    export enum AutoFillType{
        /**
         *  Fills cells with all data objects, including values, formatting, and formulas.
         */
        CopyCells = 0,
        /**
         *   Fills cells with series.
         */
        FillSeries = 1,
        /**
         *   Fills cells only with formatting.
         */
        FillFormattingOnly = 2,
        /**
         *   Fills cells with values and not formatting.
         */
        FillWithoutFormatting = 3,
        /**
         *  Clears cell values.
         */
        ClearValues = 4,
        /**
         *  Automatically fills cells.
         */
        Auto = 5
    }

    /**
     * Represents whether the component autofits cells or headers.
     * @enum {number}
     */
    export enum AutoFitType{
        /**
         *  The component autofits cells.
         */
        Cell = 0,
        /**
         *   The component autofits cells and headers.
         */
        CellWithHeader = 1
    }

    /**
     * Specifies the average condition type.
     * @enum {number}
     */
    export enum AverageConditionType{
        /** Specifies the above average condition.
         * @type {number}
         */
        Above = 0,
        /** Specifies the below average condition.
         * @type {number}
         */
        Below = 1,
        /** Specifies the above average or equal average condition.
         * @type {number}
         */
        EqualOrAbove = 2,
        /** Specifies the below average or equal average condition.
         * @type {number}
         */
        EqualOrBelow = 3,
        /** Specifies the above standard deviation condition.
         * @type {number}
         */
        Above1StdDev = 4,
        /** Specifies the below standard deviation condition.
         * @type {number}
         */
        Below1StdDev = 5,
        /** Specifies the above the two standard deviation condition.
         * @type {number}
         */
        Above2StdDev = 6,
        /** Specifies the below the two standard deviation condition.
         * @type {number}
         */
        Below2StdDev = 7,
        /** Specifies the above the three standard deviation condition.
         * @type {number}
         */
        Above3StdDev = 8,
        /** Specifies the below the three standard deviation condition.
         * @type {number}
         */
        Below3StdDev = 9
    }

    /**
     * Specifies the data bar direction.
     * @enum {number}
     */
    export enum BarDirection{
        /** Specifies whether to display the data bar from left to right.
         * @type {number}
         */
        LeftToRight = 0,
        /** Specifies whether to display the data bar from right to left.
         * @type {number}
         */
        RightToLeft = 1
    }

    /**
     * Specifies the text alignment for check box cells.
     * @enum {number}
     */
    export enum CheckBoxTextAlign{
        /**
         * Text is on top of the check box.
         */
        top = 0,
        /**
         * Text is below the check box.
         */
        bottom = 1,
        /**
         * Text is to the left of the check box.
         */
        left = 2,
        /**
         * Text is to the right of the check box.
         */
        right = 3
    }

    /**
     * Specifies what data is pasted from the Clipboard.
     * @enum {number}
     */
    export enum ClipboardPasteOptions{
        /**
         * Pastes all data objects, including values, formatting, and formulas.
         */
        All = 0,
        /**
         * Pastes only values.
         */
        Values = 1,
        /**
         * Pastes only formatting.
         */
        Formatting = 2,
        /**
         * Pastes only formulas.
         */
        Formulas = 3
    }

    /**
     * Specifies the color compare type.
     * @enum {number}
     */
    export enum ColorCompareType{
        /** Indicates whether the cell background color is equal to a specified color.
         * @type {number}
         */
        BackgroundColor = 0,
        /** Indicates whether the cell foreground color is equal to a specified color.
         * @type {number}
         */
        ForegroundColor = 1
    }

    /**
     * Defines the state of Comment.
     * @enum {number}
     */
    export enum CommentState{
        /**
         * Specifies that the comment is in active state.
         */
        Active = 1,
        /**
         *Specifies that the comment is in editing state.
         */
        Edit = 2,
        /**
         * Specifies that the comment is in normal state.
         */
        Normal = 3
    }

    /**
     * Specifies the comparison operator.
     * @enum {number}
     */
    export enum ComparisonOperator{
        /** Determines whether a cell value is equal to the parameter value.
         * @type {number}
         */
        EqualsTo = 0,
        /** Determines whether a cell value is not equal to the parameter value.
         * @type {number}
         */
        NotEqualsTo = 1,
        /** Determines whether a cell value is greater than the parameter value.
         * @type {number}
         */
        GreaterThan = 2,
        /** Determines whether a cell value is greater than or equal to the parameter value.
         * @type {number}
         */
        GreaterThanOrEqualsTo = 3,
        /** Determines whether a cell value is less than the parameter value.
         * @type {number}
         */
        LessThan = 4,
        /** Determines whether a cell value is less than or equal to the parameter value.
         * @type {number}
         */
        LessThanOrEqualsTo = 5,
        /** Determines whether a cell value is between the two parameter values.
         * @type {number}
         */
        Between = 6,
        /** Determines whether a cell value is not between the two parameter values.
         * @type {number}
         */
        NotBetween = 7
    }

    /**
     * Specifies the condition type.
     * @enum {number}
     */
    export enum ConditionType{
        /** Specifies the relation condition.
         * @type {number}
         */
        RelationCondition = 0,
        /** Specifies the number condition.
         * @type {number}
         */
        NumberCondition = 1,
        /** Specifies the text condition.
         * @type {number}
         */
        TextCondition = 2,
        /** Specifies the color condition.
         * @type {number}
         */
        ColorCondition = 3,
        /** Specifies the formula condition.
         * @type {number}
         */
        FormulaCondition = 4,
        /** Specifies the date condition.
         * @type {number}
         */
        DateCondition = 5,
        /** Specifies the dateex condition.
         * @type {number}
         */
        DateExCondition = 6,
        /** Specifies the text length condition.
         * @type {number}
         */
        TextLengthCondition = 7,
        /** Specifies the top 10 condition.
         * @type {number}
         */
        Top10Condition = 8,
        /** Specifies the unique condition.
         * @type {number}
         */
        UniqueCondition = 9,
        /** Specifies the average condition.
         * @type {number}
         */
        AverageCondition = 10,
        /** Specifies the cell value condition.
         * @type {number}
         */
        CellValueCondition = 11,
        /** Specifies the area condition.
         * @type {number}
         */
        AreaCondition = 12
    }

    /**
     * Specifies the copy to option.
     * @enum {number}
     */
    export enum CopyToOption{
        /**
         * Indicates the type of data is pure data.
         */
        Value = 0x01,
        /**
         * Indicates the type of data is a formula.
         */
        Formula = 0x02,
        /**
         * Indicates the type of data is a comment.
         */
        Comment = 0x04,
        /**
         * Indicates to copy a range group.
         */
        RangeGroup = 0x08,
        /**
         * Indicates the type of data is a sparkline.
         */
        Sparkline = 0x10,
        /**
         * Indicates to copy a span.
         */
        Span = 0x20,
        /**
         * Indicates the type of data is a style.
         */
        Style = 0x40,
        /**
         * Indicates the type of data is a tag.
         */
        Tag = 0x80,
        /**
         * Indicates the type of data is a binding path.
         */
        BindingPath = 0x100,
        /**
         * Indicates the type of data is a conditional format.
         */
        ConditionalFormat = 0x200,
        /**
         * Indicates all types of data.
         */
        All = 0x3ff
    }

    /**
     * Indicates the data validator criteria type.
     * @enum {number}
     */
    export enum CriteriaType{
        /**
         * Specifies that the data validation allows any type of value and does not check for a type or range of values.
         */
        AnyValue = 0,
        /**
         * Specifies that the data validation checks for and allows whole number values satisfying the given condition.
         */
        WholeNumber = 0x1,
        /**
         * Specifies that the data validation checks for and allows decimal values satisfying the given condition.
         */
        DecimalValues = 0x2,
        /**
         * Specifies that the data validation checks for and allows a value that matches one in a list of values.
         */
        List = 0x3,
        /**
         * Specifies that the data validation checks for and allows date values satisfying the given condition.
         */
        Date = 0x4,
        /**
         * Specifies that the data validation checks for and allows time values satisfying the given condition.
         */
        Time = 0x5,
        /**
         * Specifies that the data validation checks for and allows text values whose length satisfies the given condition.
         */
        TextLength = 0x6,
        /**
         * Specifies that the data validation uses a custom formula to check the cell value.
         */
        Custom = 0x7
    }

    /**
     * Specifies the custom value type.
     * @enum {number}
     */
    export enum CustomValueType{
        /** Indicates whether the cell value is empty or null.
         * @type {number}
         */
        Empty = 0,
        /** Indicates whether the cell value is not empty or null.
         * @type {number}
         */
        NonEmpty = 1,
        /** Indicates whether the cell value contains a calculation error.
         * @type {number}
         */
        Error = 2,
        /** Indicates whether the cell value does not contain a calculation error.
         * @type {number}
         */
        NonError = 3,
        /** Indicates whether the cell value is a formula.
         * @type {number}
         */
        Formula = 4
    }

    /**
     * Specifies the position of the data bar's axis.
     * @enum {number}
     */
    export enum DataBarAxisPosition{
        /** Specifies whether to display at a variable position based on negative values.
         * @type {number}
         */
        Automatic = 0,
        /** Specifies whether to display at the cell midpoint.
         * @type {number}
         */
        CellMidPoint = 1,
        /** Specifies whether to display value bars in the same direction as positive values.
         * @type {number}
         */
        None = 2
    }

    /**
     * Represents the orientation of the range.
     * @enum {number}
     */
    export enum DataOrientation{
        /** Specifies the vertical orientation.
         * @type {number}
         */
        Vertical = 0,
        /** Specifies the horizontal orientation.
         * @type {number}
         */
        Horizontal = 1
    }

    /**
     * Indicates the data validation result.
     * @enum {number}
     */
    export enum DataValidationResult{
        /**
         * Indicates to apply the value to a cell for a validation error.
         */
        ForceApply = 0,
        /**
         * Indicates to discard the value and not apply it to the cell for a validation error.
         */
        Discard = 1,
        /**
         * Indicates to retry multiple times to apply the value to the cell for a validation error.
         */
        Retry = 2
    }

    /**
     * Specifies the date compare type.
     * @enum {number}
     */
    export enum DateCompareType{
        /** Indicates whether the date time is equal to a certain time.
         * @type {number}
         */
        EqualsTo = 0,
        /** Indicates whether the date time is not equal to a certain time.
         * @type {number}
         */
        NotEqualsTo = 1,
        /** Indicates whether the date time is before a certain time.
         * @type {number}
         */
        Before = 2,
        /** Indicates whether the date time is before or equal to a certain time.
         * @type {number}
         */
        BeforeEqualsTo = 3,
        /** Indicates whether the date time is after a certain time.
         * @type {number}
         */
        After = 4,
        /** Indicates whether the date time is after or equal to a certain time.
         * @type {number}
         */
        AfterEqualsTo = 5
    }

    /**
     * Specifies the date occurring type.
     * @enum {number}
     */
    export enum DateOccurringType{
        /** Specifies today.
         * @type {number}
         */
        Today = 0,
        /** Specifies yesterday.
         * @type {number}
         */
        Yesterday = 1,
        /** Specifies tomorrow.
         * @type {number}
         */
        Tomorrow = 2,
        /** Specifies the last seven days.
         * @type {number}
         */
        Last7Days = 3,
        /** Specifies this month.
         * @type {number}
         */
        ThisMonth = 4,
        /** Specifies last month.
         * @type {number}
         */
        LastMonth = 5,
        /** Specifies next month.
         * @type {number}
         */
        NextMonth = 6,
        /** Specifies this week.
         * @type {number}
         */
        ThisWeek = 7,
        /** Specifies last week.
         * @type {number}
         */
        LastWeek = 8,
        /** Specifies next week.
         * @type {number}
         */
        NextWeek = 9
    }

    /**
     * Defines the direction.
     * @enum {number}
     */
    export enum Direction{
        /**
         * Indicates the up direction.
         */
        up = 1,
        /**
         * Indicates the down direction.
         */
        down = 2,
        /**
         * Indicates the left direction.
         */
        left = 3,
        /**
         * Indicates the right direction.
         */
        right = 4
    }

    /**
     * Defines when the comment is displayed.
     * @enum {number}
     */
    export enum DisplayMode{
        /**
         *  Specifies that the comment will always be displayed.
         */
        AlwaysShown = 1,
        /**
         *  Specifies that the comment will be displayed only when the pointer hovers over the comment's owner cell.
         */
        HoverShown = 2
    }

    /**
     * Specifies the editor status.
     * @enum {number}
     */
    export enum EditorStatus{
        /**
         * Cell is in Ready mode.
         */
        Ready = 0,
        /**
         * Cell is in editing mode and can commit the input value and navigate to or select other cells when invoking navigation or selection actions.
         */
        Enter = 1,
        /**
         * Cell is in editing mode and cannot commit the input value and navigate to or select other cells.
         */
        Edit = 2
    }

    /**
     *  Specifies what is written out to the data model for a selected item from
     *  certain cell types that offer a selection of multiple values.
     * @readonly
     * @enum {number}
     */
    export enum EditorValueType{
        /**
         *  Writes to the model the text value of the selected item.
         */
        Text = 0,
        /**
         * Writes to the model the index of the selected item.
         */
        Index = 1,
        /**
         *  Writes to the model the corresponding data value of the selected item.
         */
        Value = 2
    }

    /**
     * Specifies how to show an empty value from a data series in the chart.
     * @enum {number}
     */
    export enum EmptyValueStyle{
        /** Leaves gaps for empty values in a data series, which results in a segmented line.
         * @type {number}
         */
        Gaps = 0,
        /** Handles empty values in a data series as zero values, so that the line drops to zero for zero-value data points.
         * @type {number}
         */
        Zero = 1,
        /** Fills gaps with a connecting element instead of leaving gaps for empty values in a data series.
         * @type {number}
         */
        Connect = 2
    }

    /**
     * Indicates the data validation error style.
     * @enum {number}
     */
    export enum ErrorStyle{
        /**
         * Specifies to use a stop icon in the error alert.
         */
        Stop = 0,
        /**
         * Specifies to use a warning icon in the error alert.
         */
        Warning = 1,
        /**
         * Specifies to use an information icon in the error alert.
         */
        Information = 2
    }

    /**
     * Represents the date fill unit.
     * @enum {number}
     */
    export enum FillDateUnit{
        /** Sets the date fill unit to day.
         * @type {number}
         */
        Day = 0,
        /** Sets the date fill unit to weekday.
         * @type {number}
         */
        Weekday = 1,
        /** Sets the date fill unit to month.
         * @type {number}
         */
        Month = 2,
        /** Sets the date fill unit to year.
         * @type {number}
         */
        Year = 3
    }

    /**
     * Represents the type of drag fill direction.
     * @enum {number}
     */
    export enum FillDirection{
        /**
         *  Fills from the right to the left.
         */
        Left = 0,
        /**
         *  Fills from the left to the right.
         */
        Right = 1,
        /**
         *  Fills from the bottom to the top.
         */
        Up = 2,
        /**
         *   Fills from the top to the bottom.
         */
        Down = 3
    }

    /**
     * Represents the fill series for drag fill.
     * @enum {number}
     */
    export enum FillSeries{
        /**
         *  Fills the column data.
         */
        Column = 0,
        /**
         *  Fills the row data.
         */
        Row = 1
    }

    /**
     * Represents the type of fill data.
     * @enum {number}
     */
    export enum FillType{
        /** Represents the direction fill type.
         * @type {number}
         */
        Direction = 0,
        /** Represents the linear fill type.
         * @type {number}
         */
        Linear = 1,
        /** Represents the growth fill type.
         * @type {number}
         */
        Growth = 2,
        /** Represents the date fill type.
         * @type {number}
         */
        Date = 3,
        /** Represents the auto fill type.
         * @type {number}
         */
        Auto = 4
    }

    /**
     * Defines the type of filter action.
     * @enum {number}
     */
    export enum FilterActionType{
        /** Specifies the filter action.
         */
        Filter = 0,
        /** Specifies the unfilter action.
         */
        Unfilter = 1
    }

    /**
     * Represents the format mode.
     * @enum {number}
     */
    export enum FormatMode{
        /** Indicates whether to format the value with the Excel-compatible format string.*/
        CustomMode = 0,
        /** Indicates whether to format the value with the standard date-time format.*/
        StandardDateTimeMode = 1,
        /** Indicates whether to format the value with the standard numeric format.*/
        StandardNumericMode = 2
    }

    /**
     * Specifies the general operator.
     * @enum {number}
     */
    export enum GeneralCompareType{
        /** Indicates whether the number is equal to a specified number.
         * @type {number}
         */
        EqualsTo = 0,
        /** Indicates whether the number is not equal to a specified number.
         * @type {number}
         */
        NotEqualsTo = 1,
        /** Indicates whether the number is greater than a specified number.
         * @type {number}
         */
        GreaterThan = 2,
        /** Indicates whether the number is greater than or equal to a specified number.
         * @type {number}
         */
        GreaterThanOrEqualsTo = 3,
        /** Indicates whether the number is less than a specified number.
         * @type {number}
         */
        LessThan = 4,
        /** Indicates whether the number is less than or equal to a specified number.
         * @type {number}
         */
        LessThanOrEqualsTo = 5
    }

    /**
     * Specifies the status of an outline (range group).
     * @enum {number}
     */
    export enum GroupState{
        /** [0] Indicates expanded status with the minus sign.
         * @type {number}
         */
        Expanded = 0,
        /** [1] Indicates collapsed status with the plus sign.
         * @type {number}
         */
        Collapsed = 1
    }

    /**
     * Specifies which default labels are displayed in headers.
     * @enum {number}
     */
    export enum HeaderAutoText{
        /**
         *  Displays blanks in the headers.
         */
        blank = 0,
        /**
         *  Displays numbers in the headers.
         */
        numbers = 1,
        /**
         *  Displays letters in the headers.
         */
        letters = 2
    }

    /**
     * Indicates the horizontal alignment.
     * @enum {number}
     */
    export enum HorizontalAlign{
        /**
         *  Indicates that the cell content is left-aligned.
         */
        left = 0,
        /**
         *  Indicates that the cell content is centered.
         */
        center = 1,
        /**
         *  Indicates that the cell content is right-aligned.
         */
        right = 2,
        /**
         *  Indicates that the horizontal alignment is based on the value type.
         */
        general = 3
    }

    /**
     * Specifies the horizontal position of the cell or column in the component.
     * @enum {number}
     */
    export enum HorizontalPosition{
        /**
         *  Positions the cell or column to the left.
         */
        left = 0,
        /**
         *  Positions the cell or column in the center.
         */
        center = 1,
        /**
         *  Positions the cell or column to the right.
         */
        right = 2,
        /**
         *  Positions the cell or column to the nearest edge.
         */
        nearest = 3
    }

    /**
     * Specifies the hyperlink's target type.
     * @enum {number}
     */
    export enum HyperLinkTargetType{
        /**
         * Opens the hyperlinked document in a new window or tab.
         */
        Blank = 0,
        /**
         * Opens the hyperlinked document in the same frame where the user clicked.
         */
        Self = 1,
        /**
         * Opens the hyperlinked document in the parent frame.
         */
        Parent = 2,
        /**
         * Opens the hyperlinked document in the full body of the window.
         */
        Top = 3
    }

    /**
     * Specifies the icon set.
     * @enum {number}
     */
    export enum IconSetType{
        /** Specifies three colored arrows.
         * @type {number}
         */
        ThreeArrowsColored = 0x00,
        /** Specifies three gray arrows.
         * @type {number}
         */
        ThreeArrowsGray = 0x01,
        /** Specifies three trangles.
         * @type {number}
         */
        ThreeTriangles = 0x02,
        /** Specifies three stars.
         * @type {number}
         */
        ThreeStars = 0x03,
        /** Specifies three flags.
         * @type {number}
         */
        ThreeFlags = 0x04,
        /** Specifies three traffic lights (unrimmed).
         * @type {number}
         */
        ThreeTrafficLightsUnrimmed = 0x05,
        /** Specifies three traffic lights (rimmed).
         * @type {number}
         */
        ThreeTrafficLightsRimmed = 0x06,
        /** Specifies three signs.
         * @type {number}
         */
        ThreeSigns = 0x07,
        /** Specifies three symbols (circled).
         * @type {number}
         */
        ThreeSymbolsCircled = 0x08,
        /** Specifies three symbols (uncircled).
         * @type {number}
         */
        ThreeSymbolsUncircled = 0x09,
        /** Specifies four colored arrows.
         * @type {number}
         */
        FourArrowsColored = 0x0A,
        /** Specifies four gray arrows.
         * @type {number}
         */
        FourArrowsGray = 0x0B,
        /** Specifies four red to black.
         * @type {number}
         */
        FourRedToBlack = 0x0C,
        /** Specifies four ratings.
         * @type {number}
         */
        FourRatings = 0x0D,
        /** Specifies four traffic lights.
         * @type {number}
         */
        FourTrafficLights = 0x0E,
        /** Specifies five colored arrows.
         * @type {number}
         */
        FiveArrowsColored = 0x0F,
        /** Specifies five gray arrows.
         * @type {number}
         */
        FiveArrowsGray = 0x10,
        /** Specifies five ratings.
         * @type {number}
         */
        FiveRatings = 0x11,
        /** Specifies five quarters.
         * @type {number}
         */
        FiveQuarters = 0x12,
        /** Specifies five boxes.
         * @type {number}
         */
        FiveBoxes = 0x13
    }

    /**
     * Specifies the icon value type.
     * @enum {number}
     */
    export enum IconValueType{
        /** Indicates whether to return a specified number directly.
         * @type {number}
         */
        Number = 1,
        /** Indicates whether to return the percentage of a cell value in a specified cell range.
         * @type {number}
         */
        Percent = 4,
        /** Indicates whether to return the result of a formula calculation.
         * @type {number}
         */
        Formula = 7,
        /** Indicates whether to return the percentile of a cell value in a specified cell range.
         * @type {number}
         */
        Percentile = 5
    }

    /**
     * Defines the background image layout.
     * @enum {number}
     */
    export enum ImageLayout{
        /** Specifies that the background image fills the area.
         * @type {number}
         */
        Stretch = 0,
        /** Specifies that the background image displays in the center of the area.
         * @type {number}
         */
        Center = 1,
        /** Specifies that the background image displays in the area with its original aspect ratio.
         * @type {number}
         */
        Zoom = 2,
        /** Specifies that the background image displays in the upper left corner of the area with its original size.
         * @type {number}
         */
        None = 3
    }

    /**
     * Defines the ime mode to controls the state of the Input Method Editor (IME).
     * @enum {number}
     */
    export enum ImeMode{
        /**
         * No change is made to the current input method editor state.
         */
        Auto = 0x01,
        /** All characters are entered through the IME. Users can still deactivate the IME.
         */
        Active = 0x02,
        /**
         * All characters are entered without IME. Users can still activate the IME.
         */
        Inactive = 0x04,
        /**
         * The input method editor is disabled and may not be activated by the user.
         */
        Disabled = 0x00
    }

    /**
     * Identifies which operation was invalid.
     * @enum {number}
     */
    export enum InvalidOperationType{
        /**
         * Set formula invalid.
         */
        SetFormula = 0,
        /**
         * Copy paste invalid.
         */
        CopyPaste = 1,
        /**
         * Drag fill invalid.
         */
        DragFill = 2,
        /**
         * Drag drop invalid.
         */
        DragDrop = 3,
        /**
         * Insert row invalid.
         */
        ChangePartOfArrayFormula = 4
    }

    /**
     * Represents the key code.
     * @enum {number}
     */
    export enum Key{
        /**
         * Indicates the left arrow key.
         */
        left = 37,
        /**
         * Indicates the right arrow key.
         */
        right = 39,
        /**
         * Indicates the up arrow key.
         */
        up = 38,
        /**
         * Indicates the down arrow key.
         */
        down = 40,
        /**
         * Indicates the Tab key.
         */
        tab = 9,
        /**
         * Indicates the Enter key.
         */
        enter = 13,
        /**
         * Indicates the Shift key.
         */
        shift = 16,
        /**
         * Indicates the Ctrl key.
         */
        ctrl = 17,
        /**
         * Indicates the space key.
         */
        space = 32,
        /**
         * Indicates the Alt key.
         */
        altkey = 18,
        /**
         * Indicates the Home key.
         */
        home = 36,
        /**
         * Indicates the End key.
         */
        end = 35,
        /**
         * Indicates the Page Up key.
         */
        pup = 33,
        /**
         * Indicates the Page Down key.
         */
        pdn = 34,
        /**
         * Indicates the Backspace key.
         */
        backspace = 8,
        /**
         * Indicates the Delete key.
         */
        del = 46,
        /**
         * Indicates the Esc key.
         */
        esc = 27,
        /**
         * Indicates the A key
         */
        a = 65,
        /**
         * Indicates the C key.
         */
        c = 67,
        /**
         * Indicates the V key.
         */
        v = 86,
        /**
         * Indicates the X key.
         */
        x = 88,
        /**
         * Indicates the Z key.
         */
        z = 90,
        /**
         * Indicates the Y key.
         */
        y = 89
    }

    /**
     * Specifies the line drawing style for the border.
     * @enum {number}
     */
    export enum LineStyle{
        /**
         * Indicates a border line without a style.
         */
        empty = 0,
        /**
         *  Indicates a border line with a solid thin line.
         */
        thin = 1,
        /**
         *  Indicates a medium border line with a solid line.
         */
        medium = 2,
        /**
         *  Indicates a border line with dashes.
         */
        dashed = 3,
        /**
         *  Indicates a border line with dots.
         */
        dotted = 4,
        /**
         *  Indicates a thick border line with a solid line.
         */
        thick = 5,
        /**
         *  Indicates a double border line.
         */
        double = 6,
        /**
         *  Indicates a border line with all dots.
         */
        hair = 7,
        /**
         *  Indicates a medium border line with dashes.
         */
        mediumDashed = 8,
        /**
         *  Indicates a border line with dash-dot.
         */
        dashDot = 9,
        /**
         *  Indicates a medium border line with dash-dot-dot.
         */
        mediumDashDot = 10,
        /**
         *  Indicates a border line with dash-dot-dot.
         */
        dashDotDot = 11,
        /**
         *  Indicates a medium border line with dash-dot-dot.
         */
        mediumDashDotDot = 12,
        /**
         *  Indicates a slanted border line with dash-dot.
         */
        slantedDashDot = 13
    }

    /**
     * Represents the number format type.
     * @enum {number}
     */
    export enum NumberFormatType{
        /** Formats the data using the general formatter.*/
        General = 0,
        /** Formats the data using the number formatter.*/
        Number = 1,
        /** Formats the data using the date-time formatter.*/
        DateTime = 2,
        /** Formats the data using the text formatter.*/
        Text = 3
    }

    /**
     * Specifies the quarter type.
     * @enum {number}
     */
    export enum QuarterType{
        /** Indicates the first quarter of a year.
         * @type {number}
         */
        Quarter1 = 0,
        /** Indicates the second quarter of a year.
         * @type {number}
         */
        Quarter2 = 1,
        /** Indicates the third quarter of a year.
         * @type {number}
         */
        Quarter3 = 2,
        /** Indicates the fourth quarter of a year.
         * @type {number}
         */
        Quarter4 = 3
    }

    /**
     * Defines the type of action that raised the RangeChanged event.
     * @enum {number}
     */
    export enum RangeChangedAction{
        /**
         * Indicates drag drop undo action.
         */
        DragDrop = 0,
        /**
         * Indicates drag fill undo action.
         */
        DragFill = 1,
        /**
         * Indicates clear range value undo action.
         */
        Clear = 2,
        /**
         * Indicates paste undo action.
         */
        Paste = 3,
        /**
         * Indicates sorting a range of cells.
         */
        Sort = 4,
        /**
         * Indicates setting a formula in a specified range of cells .
         */
        SetArrayFormula = 5
    }

    /**
     * Specifies the status of a range group summary row or column position.
     * @enum {number}
     */
    export enum RangeGroupDirection{
        /** [0] The summary row is above or to the left of the group detail.
         * @type {number}
         */
        Backward = 0,
        /** [1] The summary row is below or to the right of the group detail.
         * @type {number}
         */
        Forward = 1
    }

    /**
     * Specifies the formula reference style.
     * @enum {number}
     */
    export enum ReferenceStyle{
        /**
         * Indicates A1 style.
         */
        A1 = 0,
        /**
         * Indicates R1C1 style.
         */
        R1C1 = 1
    }

    /**
     * Specifies the relation operator.
     * @enum {number}
     */
    export enum RelationCompareType{
        /** Specifies the Or relation.
         * @type {number}
         */
        Or = 0,
        /** Specifies the And relation.
         * @type {number}
         */
        And = 1
    }

    /**
     * Specifies the rule type.
     * @enum {number}
     */
    export enum RuleType{
        /** Specifies the base rule of the condition.
         * @type {number}
         */
        ConditionRuleBase = 0,
        /** Specifies the cell value rule.
         * @type {number}
         */
        CellValueRule = 1,
        /** Specifies the specific text rule.
         * @type {number}
         */
        SpecificTextRule = 2,
        /** Specifies the formula rule.
         * @type {number}
         */
        FormulaRule = 3,
        /** Specifies the date occurring rule.
         * @type {number}
         */
        DateOccurringRule = 4,
        /** Specifies the top 10 rule.
         * @type {number}
         */
        Top10Rule = 5,
        /** Specifies the unique rule.
         * @type {number}
         */
        UniqueRule = 6,
        /** Specifies the duplicate rule.
         * @type {number}
         */
        DuplicateRule = 7,
        /** Specifies the average rule.
         * @type {number}
         */
        AverageRule = 8,
        /** Specifies the scale rule.
         * @type {number}
         */
        ScaleRule = 9,
        /** Specifies the two scale rule.
         * @type {number}
         */
        TwoScaleRule = 10,
        /** Specifies the three scale rule.
         * @type {number}
         */
        ThreeScaleRule = 11,
        /** Specifies the data bar rule.
         * @type {number}
         */
        DataBarRule = 12,
        /** Specifies the icon set rule.
         * @type {number}
         */
        IconSetRule = 13
    }

    /**
     * Specifies the scale value type.
     * @enum {number}
     */
    export enum ScaleValueType{
        /** Indicates whether to return a specified number directly.
         * @type {number}
         */
        Number = 0,
        /** Indicates whether to return the lowest value in a specified cell range.
         * @type {number}
         */
        LowestValue = 1,
        /** Indicates whether to return the highest value in a specified cell range.
         * @type {number}
         */
        HighestValue = 2,
        /** Indicates whether to return the percentage of a cell value in a specified cell range.
         * @type {number}
         */
        Percent = 3,
        /** Indicates whether to return the percentile of a cell value in a specified cell range.
         * @type {number}
         */
        Percentile = 4,
        /** Indicates whether to return the automatic minimum value in a specified range.
         * @type {number}
         */
        Automin = 5,
        /** Indicates whether to return the result of a formula calculation.
         * @type {number}
         */
        Formula = 6,
        /** Indicates whether to return the automatic maximum value in a specified range.
         * @type {number}
         */
        Automax = 7
    }

    /**
     * Specifies the type of search flags.
     * @enum {number}
     */
    export enum SearchFlags{
        /** None
         * @type {number}
         */
        None = 0,
        /** Determines whether the search considers the case of the letters in the search string.
         * @type {number}
         */
        IgnoreCase = 1,
        /** Determines whether the search considers only an exact match.
         * @type {number}
         */
        ExactMatch = 2,
        /** Determines whether the search considers wildcard characters (*, ?) in the search string.
         * @type {number}
         */
        UseWildCards = 4,
        /** Determines whether to search within a cell range.
         * @type {number}
         */
        BlockRange = 8
    }

    /**
     * Specifies where the search string is found.
     * @enum {number}
     */
    export enum SearchFoundFlags{
        /**
         * Indicates that no string is found.
         * @type {number}
         */
        None = 0,
        /**
         * Indicates that the string is found in the cell text.
         * @type {number}
         */
        CellText = 1,
        /**
         * Indicates that the string is found in the cell tag.
         * @type {number}
         */
        CellTag = 4,
        /**
         * Indicates that the string is found in the cell formula.
         * @type {number}
         */
        CellFormula = 8
    }

    /**
     * Specifies the type of search direction.
     * @enum {number}
     */
    export enum SearchOrder{
        /** Determines whether the search goes by column, row coordinates.
         * @type {number}
         */
        ZOrder = 0,
        /** Determines whether the search goes by row, column coordinates.
         * @type {number}
         */
        NOrder = 1
    }

    /**
     * Specifies how users can select items in the control.
     * @enum {number}
     */
    export enum SelectionPolicy{
        /**
         * Allows users to only select single items.
         */
        Single = 0,
        /**
         * Allows users to select single items and ranges of items, but not multiple ranges.
         */
        Range = 1,
        /**
         * Allows users to select single items and ranges of items, including multiple ranges.
         */
        MultiRange = 2
    }

    /**
     * Specifies the smallest unit users or the application can select.
     * @enum {number}
     */
    export enum SelectionUnit{
        /**
         * Indicates that the smallest unit that can be selected is a cell.
         */
        Cell = 0,
        /**
         * Indicates that the smallest unit that can be selected is a row.
         */
        Row = 1,
        /**
         * Indicates that the smallest unit that can be selected is a column.
         */
        Column = 2
    }

    /**
     * Specifies the sheet area.
     * @enum {number}
     */
    export enum SheetArea{
        /**
         * Indicates the sheet corner.
         */
        corner = 0,
        /**
         * Indicates the column header.
         */
        colHeader = 1,
        /**
         * Indicates the row header.
         */
        rowHeader = 2,
        /**
         * Indicates the viewport.
         */
        viewport = 3
    }

    /**
     * Defines how the resize tip is displayed.
     * @enum {number}
     */
    export enum ShowResizeTip{
        /** Specifies that no resize tip is displayed.
         * @type {number}
         */
        None = 0,
        /** Specifies that only the horizontal resize tip is displayed.
         * @type {number}
         */
        Column = 1,
        /** Specifies that only the vertical resize tip is displayed.
         * @type {number}
         */
        Row = 2,
        /** Specifies that horizontal and vertical resize tips are displayed.
         * @type {number}
         */
        Both = 3
    }

    /**
     * Specifies how the scroll tip is displayed.
     * @enum {number}
     */
    export enum ShowScrollTip{
        /** Specifies that no scroll tip is displayed.
         * @type {number}
         */
        None = 0,
        /** Specifies that only the horizontal scroll tip is displayed.
         * @type {number}
         */
        Horizontal = 1,
        /** Specifies that only the vertical scroll tip is displayed.
         * @type {number}
         */
        Vertical = 2,
        /** Specifies that horizontal and vertical scroll tips are displayed.
         * @type {number}
         */
        Both = 3
    }

    /**
     * Specifies the type of sorting to perform.
     * @enum {number}
     */
    export enum SortState{
        /** Indicates the sorting is disabled.
         * @type {number}
         */
        None = 0,
        /** Indicates the sorting is ascending.
         * @type {number}
         */
        Ascending = 1,
        /** Indicates the sorting is descending.
         * @type {number}
         */
        Descending = 2
    }

    /**
     * An enumeration that specifies information about how the vertical axis minimum or maximum is computed for this sparkline group.
     * @enum {number}
     */
    export enum SparklineAxisMinMax{
        /** Specifies that the vertical axis minimum or maximum for each sparkline in this sparkline group is calculated automatically such that the data point with the minimum or maximum value can be displayed in the plot area.
         * @type {number}
         */
        individual = 0,
        /** Specifies that the vertical axis minimum or maximum is shared across all sparklines in this sparkline group and is calculated automatically such that the data point with the minimum or maximum value can be displayed in the plot area.
         * @type {number}
         */
        group = 1,
        /** Specifies that the vertical axis minimum or maximum for each sparkline in this sparkline group is specified by the manualMin attribute or the manualMax attribute of the sparkline group.
         * @type {number}
         */
        custom = 2
    }

    /**
     * Represents the sparkline type.
     * @enum {number}
     */
    export enum SparklineType{
        /** Specifies the line sparkline.
         * @type {number}
         */
        line = 0,
        /** Specifies the column sparkline.
         * @type {number}
         */
        column = 1,
        /** Specifies the win-loss sparkline.
         * @type {number}
         */
        winloss = 2
    }

    /**
     * Represents the storage data type.
     * @enum {number}
     */
    export enum StorageType{
        /**
         *  Indicates the storage data type is pure value.
         */
        Data = 0x01,
        /**
         *  Indicates the storage data type is style.
         */
        Style = 0x02,
        /**
         *  Indicates the storage data type is comment.
         */
        Comment = 0x04,
        /**
         *  Indicates the storage data type is tag.
         */
        Tag = 0x08,
        /**
         *  Indicates the storage data type is sparkline.
         */
        Sparkline = 0x10,
        /**
         *  Indicates the storage data type is the axis information.
         */
        Axis = 0x20,
        /**
         *  Indicates the storage data type is data binding path.
         */
        BindingPath = 0x40
    }

    /**
     * Specifies the text compare type.
     * @enum {number}
     */
    export enum TextCompareType{
        /** Indicates whether the string is equal to a specified string.
         * @type {number}
         */
        EqualsTo = 0,
        /** Indicates whether the string is not equal to a specified string.
         * @type {number}
         */
        NotEqualsTo = 1,
        /** Indicates whether the string starts with a specified string.
         * @type {number}
         */
        BeginsWith = 2,
        /** Indicates whether the string does not start with a specified string.
         * @type {number}
         */
        DoesNotBeginWith = 3,
        /** Indicates whether the string ends with a specified string.
         * @type {number}
         */
        EndsWith = 4,
        /** Indicates whether the string does not end with a specified string.
         * @type {number}
         */
        DoesNotEndWith = 5,
        /** Indicates whether the string contains a specified string.
         * @type {number}
         */
        Contains = 6,
        /** Indicates whether the string does not contain a specified string.
         * @type {number}
         */
        DoesNotContain = 7
    }

    /**
     * Specifies the text comparison operator.
     * @enum {number}
     */
    export enum TextComparisonOperator{
        /** Determines whether a cell value contains the parameter value.
         * @type {number}
         */
        Contains = 0,
        /** Determines whether a cell value does not contain the parameter value.
         * @type {number}
         */
        DoesNotContain = 1,
        /** Determines whether a cell value begins with the parameter value.
         * @type {number}
         */
        BeginsWith = 2,
        /** Determines whether a cell value ends with the parameter value.
         * @type {number}
         */
        EndsWith = 3
    }

    /**
     * Defines the type of the text decoration.
     * @enum {number}
     */
    export enum TextDecorationType{
        /** Specifies to display a line below the text.
         */
        Underline = 0x01,
        /** Specifies to display a line through the text.
         */
        LineThrough = 0x02,
        /** Specifies to display a line above the text.
         */
        Overline = 0x04,
        /** Specifies normal text.
         */
        None = 0x00
    }

    /**
     * Specifies the import flags.
     * @enum {number}
     */
    export enum TextFileOpenFlags{
        /**
         * Imports with no special options.
         */
        None = 0,
        /**
         * Includes row headers.
         */
        IncludeRowHeader = 1,
        /**
         * Includes column headers.
         */
        IncludeColumnHeader = 2,
        /**
         * Leaves the data unformatted. The unformatted setting bypasses the <b>IFormatter</b> object in the <b>CellStyleInfo</b> object for the cell so the cell data is unformatted.
         */
        UnFormatted = 8,
        /**
         * Imports formulas.
         */
        ImportFormula = 16
    }

    /**
     * Specifies the top 10 condition type.
     * @enum {number}
     */
    export enum Top10ConditionType{
        /** Specifies the top condition.
         * @type {number}
         */
        Top = 0,
        /** Specifies the bottom condition.
         * @type {number}
         */
        Bottom = 1
    }

    /**
     * Indicates the vertical alignment.
     * @enum {number}
     */
    export enum VerticalAlign{
        /**
         *  Indicates that the cell content is top-aligned.
         */
        top = 0,
        /**
         *  Indicates that the cell content is centered.
         */
        center = 1,
        /**
         *  Indicates that the cell content is bottom-aligned.
         */
        bottom = 2
    }

    /**
     * Specifies the vertical position of the cell or row in the component.
     * @enum {number}
     */
    export enum VerticalPosition{
        /**
         *  Positions the cell or row at the top.
         */
        top = 0,
        /**
         *  Positions the cell or row in the center.
         */
        center = 1,
        /**
         *  Positions the cell or row at the bottom.
         */
        bottom = 2,
        /**
         *  Positions the cell or row at the nearest edge.
         */
        nearest = 3
    }

    /**
     * Specifies the visual state.
     * @enum {number}
     */
    export enum VisualState{
        /**
         * Indicates normal visual state.
         */
        Normal = 0,
        /**
         * Indicates highlight visual state.
         */
        Highlight = 1,
        /**
         * Indicates selected visual state.
         */
        Selected = 2,
        /**
         * Indicates active visual state.
         */
        Active = 3,
        /**
         * Indicates hover visual state.
         */
        Hover = 4
    }


    export class AreaCondition{
        /**
         * Represents an area condition using the expected source or formula.
         * @class
         * @param {string} expected The expected source that separates each data item with a comma (",").
         * @param {string} formula The formula that specifies a range that contains data items.
         */
        constructor(expected: string, formula: string);
        /**
         * The expected source that separates each data item with a comma (",").
         * @type {string}
         */
        expected: any;
        /**
         * The formula that specifies a range that contains data items.
         * @type {string}
         */
        formula: any;
        /**
         * Whether to ignore the blank cell.
         * @type {boolean}
         */
        ignoreBlank: boolean;
        /**
         * Evaluates the condition using the specified evaluator.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualObj The actual value object for evaluation.
         * @returns {boolean} <c>true</c> if the result is successful; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actualObj: any): boolean;
        /**
         * Creates the condition from formula data.
         * @static
         * @param {string} formula The formula that specifies a range that contains data items.
         * @returns {GcSpread.Sheets.AreaCondition} The condition.
         */
        static fromFormula(formula: string): AreaCondition;
        /**
         * Creates the condition from source data.
         * @static
         * @param {string} expected The expected source that separates each data item with a comma (",").
         * @returns {GcSpread.Sheets.AreaCondition} The condition.
         */
        static fromSource(expected: string): AreaCondition;
        /**
         * Returns the expected results.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseCol The base column index for evaluation.
         * @returns {object} The expected data items.
         */
        getExpected(evaluator: any, baseRow: number, baseCol: number): any;
        /**
         * Returns the list of valid data items.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @returns {Array} The list of valid data items.
         */
        getValidList(evaluator: any, baseRow: number, baseColumn: number): any[];
    }

    export class AreaSparkline extends SparklineEx{
        /**
         * Represents the class for the area sparkline.
         * @extends GcSpread.Sheets.SparklineEx
         * @class
         */
        constructor();
    }

    export class AutoFormatter{
        /**
         * Represents an automatic format.
         * @class
         * @param {GcSpread.Sheets.GeneralFormatter} innerFormatter The inner formatter.
         */
        constructor(innerFormatter: GeneralFormatter);
        /**
         * Formats the specified object as a string.
         * @param {Object} text The object with cell data to format.
         * @returns {string} The formatted string.
         */
        Format(obj: any): string;
        /**
         * Gets the expression that is used to format and parse.
         * @returns {string} The expression that is used to format and parse.
         */
        FormatString(): string;
        /**
         * Gets or sets the inner formatter.
         * @param {GcSpread.Sheets.GeneralFormatter} formatter The inner formatter.
         * @returns {GcSpread.Sheets.GeneralFormatter} The inner formatter.
         */
        innerFormatter(formatter: any): any;
        /**
         * Parses the specified text.
         * @param {string} text The text.
         * @returns {Object} The parsed object.
         */
        Parse(text: string): any;
    }

    export class AverageCondition{
        /**
         * Represents a new average condition of the specified type for the specified cell ranges.
         * @class
         * @param {GcSpread.Sheets.AverageConditionType} type The expected average condition type.
         * @param {Array} ranges The cell range array for the average condition whose item type is GcSpread.Sheets.Range.
         */
        constructor(type: AverageConditionType, ranges?: Range[]);
        /** Whether to ignore the blank cell.
         * @type {boolean}
         */
        ignoreBlank: boolean;
        /** The cell range array for the average condition.
         * @type {Array} The GcSpread.Sheets.Range Array.
         */
        ranges: any;
        /** The expected average condition type.
         * @type {GcSpread.Sheets.AverageConditionType}
         */
        type: any;
        /**
         * Evaluates the condition using the specified evaluator.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualObj The actual value object for evaluation.
         * @returns {boolean} <c>true</c> if the result is successful; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actualObj: any): boolean;
        /**
         * Gets the expected value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @returns {object} The expected value.
         */
        getExpected(evaluator: any, baseRow: number, baseColumn: number): any;
        /**
         * Gets the expected double value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @returns {number} The expected double value.
         */
        getExpectedDouble(evaluator: any, baseRow: number, baseColumn: number): number;
        /**
         * Resets this instance.
         */
        reset(): void;
    }

    export class AverageRule extends ConditionRuleBase{
        /**
         * Represents an average conditional rule.
         * @extends GcSpread.Sheets.ConditionRuleBase
         * @param {GcSpread.Sheets.AverageConditionType} type The expected average rule type.
         * @param {GcSpread.Sheets.Style} style The cell style.
         * @class
         */
        constructor(type: AverageConditionType, style: Style);
        /** The expected average rule type.
         * @type {GcSpread.Sheets.AverageConditionType}
         */
        type: any;
        /**
         * Creates a condition for the rule.
         * @returns {GcSpread.Sheets.AverageCondition} The condition for the rule.
         */
        createCondition(): AverageCondition;
        /**
         * Resets the rule.
         */
        reset(): void;
    }

    export class BaseCellType{
        /**
         * Represents the base class for the other cell type classes.
         * @class
         */
        constructor();
        /**
         * Represents the type name string used for supporting serialization.
         * @type {string}
         */
        typeName: string;
        /**
         * Activates the editor, including setting properties or attributes for the editor and binding events for the editor.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {GcSpread.Sheets.Style} cellStyle The cell's actual style.
         * @param {GcSpread.Sheets.Rect} cellRect The cell's layout information.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        activateEditor(editorContext: any, cellStyle: Style, cellRect: Rect, context?: any): void;
        /**
         * Creates a DOM element then returns it.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {object} Returns a DOM element.
         */
        createEditorElement(context?: any): any;
        /**
         * Deactivates the editor, such as unbinding events for editor.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        deactivateEditor(editorContext: any, context?: any): void;
        /**
         * Focuses the editor DOM element.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        focus(editorContext: any, context?: any): void;
        /**
         * Formats a value with the specified format to a string.
         * @param {object} value The object value to format.
         * @param {GcSpread.Sheets.GeneralFormatter} format The format.
         * @param {object} conditionalForeColor The conditional foreground color.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {string} Returns the formatted string.
         */
        format(value: any, format: any, conditionalForeColor?: any, context?: any): string;
        /**
         * Gets a cell's height that can be used to handle the row's auto fit.
         * @param {object} value The cell's value.
         * @param {string} text The cell's text.
         * @param {GcSpread.Sheets.Style} cellStyle The cell's actual value.
         * @param {number} zoomFactor The current sheet's zoom factor.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {number} Returns the cell's height that can be used to handle the row's auto fit.
         */
        getAutoFitHeight(value: any, text: string, cellStyle: Style, zoomFactor: number, context?: any): number;
        /**
         * Gets a cell's width that can be used to handle the column's auto fit.
         * @param {object} value The cell's value.
         * @param {string} text The cell's text.
         * @param {GcSpread.Sheets.Style} cellStyle The cell's actual value.
         * @param {number} zoomFactor The current sheet's zoom factor.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {number} Returns the cell's width that can be used to handle the column's auto fit.
         */
        getAutoFitWidth(value: any, text: string, cellStyle: Style, zoomFactor: number, context?: any): number;
        /**
         * Gets the editor's value.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {object} Returns the editor's value.
         */
        getEditorValue(editorContext: any, context?: any): any;
        /**
         * Gets the cell type's hit info.
         * @param {number} x <i>x</i>-coordinate of pointer's current location relative to the canvas.
         * @param {number} y <i>y</i>-coordinate of pointer's current location relative to the canvas.
         * @param {GcSpread.Sheets.Style} cellStyle The current cell's actual style.
         * @param {GcSpread.Sheets.Rect} cellRect The current cell's layout information.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {object} Returns an object that contains the <i>x</i>, <i>y</i>, <i>row</i>, <i>col</i>, <i>cellRect</i>, and <i>sheetArea</i> parameters, and a value to indicate <i>isReservedLocation</i>.
         * <i>isReservedLocation</i> is <c>true</c> if the hit test is in a special area that the cell type needs to handle; otherwise, <c>false</c>.
         */
        getHitInfo(x: number, y: number, cellStyle: Style, cellRect: Rect, context?: any): IHitTestCellTypeHitInfo;
        /**
         * Whether the editing value has changed.
         * @param {object} oldValue Old editing value.
         * @param {object} newValue New editing value.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {boolean} <c>true</c> if oldValue equals newValue; otherwise, <c>false</c>.
         */
        isEditingValueChanged(oldValue: any, newValue: any, context?: any): boolean;
        /**
         * Whether this cell type is aware of IME.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {boolean} <c>true</c> if the cell type is aware of IME; otherwise, <c>false</c>.
         */
        isImeAware(context?: any): boolean;
        /**
         * Whether the cell type handles the keyboard event itself.
         * @param {KeyboardEvent} e The KeyboardEvent.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {boolean} Returns <c>true</c> if the cell type handles the keyboard event itself; otherwise, <c>false</c>.
         */
        isReservedKey(e: any, context?: any): boolean;
        /**
         * Paints a cell on the canvas.
         * @param {CanvasRenderingContext2D} ctx The canvas's two-dimensional context.
         * @param {object} value The cell's value.
         * @param {number} x <i>x</i>-coordinate relative to the canvas.
         * @param {number} y <i>y</i>-coordinate relative to the canvas.
         * @param {number} w The cell's width.
         * @param {number} h The cell's height.
         * @param {GcSpread.Sheets.Style} style The cell's actual style.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        paint(ctx: CanvasRenderingContext2D, value: any, x: number, y: number, w: number, h: number, style: Style, context?: any): void;
        /**
         * Parses the text with the specified format string to an object.
         * @param {string} text The parse text string.
         * @param {object} formatStr The parse format string.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {object} The parsed object.
         */
        parse(text: string, formatStr: string, context?: any): any;
        /**
         * Processes key down in display mode.
         * @param {KeyboardEvent} event The KeyboardEvent.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {boolean} Returns <c>true</c> if the process is successful; otherwise, <c>false</c>.
         */
        processKeyDown(event: KeyboardEvent, context?: any): boolean;
        /**
         * Processes key up in display mode.
         * @param {KeyboardEvent} event The KeyboardEvent.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {boolean} Returns <c>true</c> if the process is successful; otherwise, <c>false</c>.
         */
        processKeyUp(event: KeyboardEvent, context?: any): boolean;
        /**
         * Processes mouse down in display mode.
         * @param {object} hitInfo The hit test information returned by the getHitInfo method. See the Remarks for more information.
         * @returns {boolean} Returns <c>true</c> if the process is successful; otherwise, <c>false</c>.
         */
        processMouseDown(hitInfo: IHitTestCellTypeHitInfo): any;
        /**
         * Processes mouse enter in display mode.
         * @param {object} hitInfo The hit test information returned by the getHitInfo method. See the Remarks for more information.
         * @returns {boolean} Returns <c>true</c> if the process is successful; otherwise, <c>false</c>.
         */
        processMouseEnter(hitInfo: IHitTestCellTypeHitInfo): any;
        /**
         * Processes mouse leave in display mode.
         * @param {object} hitInfo The hit test information returned by the getHitInfo method. See the Remarks for more information.
         * @returns {boolean} Returns <c>true</c> if the process is successful; otherwise, <c>false</c>.
         */
        processMouseLeave(hitInfo: IHitTestCellTypeHitInfo): any;
        /**
         * Processes mouse move in display mode.
         * @param {object} hitInfo The hit test information returned by the getHitInfo method. See the Remarks for more information.
         * @returns {boolean} Returns <c>true</c> if the process is successful; otherwise, <c>false</c>.
         */
        processMouseMove(hitInfo: IHitTestCellTypeHitInfo): any;
        /**
         * Processes mouse up in display mode.
         * @param {object} hitInfo The hit test information returned by the getHitInfo method. See the Remarks for more information.
         * @returns {boolean} Returns <c>true</c> if the process is successful; otherwise, <c>false</c>.
         */
        processMouseUp(hitInfo: IHitTestCellTypeHitInfo): any;
        /**
         * Selects all the text in the editor DOM element.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        selectAll(editorContext: any, context?: any): void;
        /**
         * Sets the editor's value.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {object} value The value returned from the active cell.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        setEditorValue(editorContext: any, value: any, context?: any): void;
        /**
         * Updates the editor's size.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {GcSpread.Sheets.Style} cellStyle The cell's actual style.
         * @param {GcSpread.Sheets.Rect} cellRect The cell's layout information.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        updateEditor(editorContext: any, cellStyle: Style, cellRect: Rect, context?: any): any;
        /**
         * Updates the editor's ime-mode.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {GcSpread.Sheets.ImeMode} imeMode The ime-mode from cell's actual style.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        updateImeMode(editorContext: any, imeMode: ImeMode, context?: any): any;
    }

    export class BoxPlotSparkline extends SparklineEx{
        /**
         * Represents the class for the box plot sparkline.
         * @extends GcSpread.Sheets.SparklineEx
         * @class
         */
        constructor();
    }

    export class BulletSparkline extends SparklineEx{
        /**
         * Represents the class for the bullet sparkline.
         * @extends GcSpread.Sheets.SparklineEx
         * @class
         */
        constructor();
    }

    export class ButtonCellType{
        /**
         * Represents a button cell.
         * @extends GcSpread.Sheets.TextCellType
         * @class
         */
        constructor();
        /**
         * Gets or sets the button's background color.
         * @param {string} value The button's background color.
         * @returns {string} The background color.
         */
        buttonBackColor(value?: string): any;
        /**
         * Gets or sets the button's bottom margin in pixels relative to the cell.
         * @param {number} value The button's bottom margin relative to the cell.
         * @returns {number} The bottom margin in pixels.
         */
        marginBottom(value?: number): any;
        /**
         * Gets or sets the button's left margin in pixels relative to the cell.
         * @param {number} value The button's left margin relative to the cell.
         * @returns {number} The left margin in pixels.
         */
        marginLeft(value?: number): any;
        /**
         * Gets or sets the button's right margin in pixels relative to the cell.
         * @param {number} value The button's right margin relative to the cell.
         * @returns {number} The right margin in pixels.
         */
        marginRight(value?: number): any;
        /**
         * Gets or sets the button's top margin in pixels relative to the cell.
         * @param {number} value The button's top margin relative to the cell.
         * @returns {number} The top margin in pixels.
         */
        marginTop(value?: number): any;
        /**
         * Gets or sets the button's content.
         * @param {string} value The button's content.
         * @returns {string} The content.
         */
        text(value?: string): any;
    }

    export class CascadeSparkline{
        /**
         * Represents the class for the cascade sparkline.
         * @extends GcSpread.Sheets.SparklineEx
         * @class
         */
        constructor();
    }

    export class Cell{
        /**
         * Represents a cell in a sheet.
         * @class
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that contains this cell.
         * @param {number} row The row index of the cell.
         * @param {number} col The column index of the cell.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If you do not provide this parameter, it will default to <b>viewport</b>.
         */
        constructor(sheet: Sheet, row: number, col: number, sheetArea: SheetArea);
        /**
         *Gets the starting column index.
         * @type {number}
         */
        col: any;
        /**
         *Gets the ending column index.
         * @type {number}
         */
        col2: any;
        /**
         *Gets the starting row index.
         *@type {number}
         */
        row: any;
        /** Gets the ending row index.
         * @type {number}
         */
        row2: any;
        /**
         * Gets the sheet that contains this cell.
         * @type {GcSpread.Sheets.Sheet}
         */
        sheet: any;
        /**
         *Gets the area that contains this cell.
         * @type {GcSpread.Sheets.SheetArea}
         */
        sheetArea: any;
        /**
         * Gets or sets the background color for the cell, such as "red", "#FFFF00", "rgb(255,0,0)", "Accent 5", and so on.
         * @param {string} value The cell background color.
         * @returns {string} The cell background color.
         */
        backColor(value?: string): any;
        /**
         * Gets or sets the background image for the cell.
         * @param {string} value The cell background image.
         * @returns {string} The cell background image.
         */
        backgroundImage(value?: string): any;
        /**
         * Gets or sets the background image layout for the cell.
         * @param {GcSpread.Sheets.ImageLayout} value The cell background image layout.
         * @returns {GcSpread.Sheets.ImageLayout} The cell background image layout.
         */
        backgroundImageLayout(layout?: ImageLayout): any;
        /**
         * Gets or sets the binding path for cell binding.
         * @param {string} value The binding path.
         * @returns {string} The binding path.
         */
        bindingPath(value?: string): any;
        /**
         * Gets or sets the bottom border of the cell.
         * @param {GcSpread.Sheets.LineBorder} value The cell bottom border line.
         * @returns {GcSpread.Sheets.LineBorder} The cell bottom border line.
         */
        borderBottom(value?: LineBorder): any;
        /**
         * Gets or sets the left border of the cell.
         * @param {GcSpread.Sheets.LineBorder} value The cell left border line.
         * @returns {GcSpread.Sheets.LineBorder} The cell left border line.
         */
        borderLeft(value?: LineBorder): any;
        /**
         * Gets or sets the right border of the cell.
         * @param {GcSpread.Sheets.LineBorder} value The cell right border line.
         * @returns {GcSpread.Sheets.LineBorder} The cell right border line.
         */
        borderRight(value?: LineBorder): any;
        /**
         * Gets or sets the top border of the cell.
         * @param {GcSpread.Sheets.LineBorder} value The cell top border line.
         * @returns {GcSpread.Sheets.LineBorder} The cell top border line.
         */
        borderTop(value?: LineBorder): any;
        /**
         * Gets or sets the cell type of the cell.
         * @param {GcSpread.Sheets.BaseCellType} value The cell type.
         * @returns {GcSpread.Sheets.BaseCellType} The cell type.
         */
        cellType(value?: any): any;
        /**
         * Clears the style setting for the specified property that is a property of GcSpread.Sheets.Style, such as "backColor", "foreColor", and so on.
         * @param {string} propertyName The property name.
         */
        clearStyleProperty(propertyName: any): void;
        /**
         * Gets or sets the comment for the cell.
         * @param {GcSpread.Sheets.Comment} value The comment.
         * @returns {GcSpread.Sheets.Comment} The comment.
         */
        comment(value?: Comment): any;
        /**
         * Gets or sets the data validator for the cell.
         * @param {GcSpread.Sheets.DefaultDataValidator} value The cell data validator.
         * @returns {GcSpread.Sheets.DefaultDataValidator} The cell data validator.
         */
        dataValidator(value?: any): any;
        /**
         * Gets or sets the font for the cell, such as "normal normal normal 20px/normal Arial".
         * @param {string} value The cell font.
         * @returns {string} The cell font.
         */
        font(value?: string): any;
        /**
         * Gets or sets the color of the text in the cell, such as "red", "#FFFF00", "rgb(255,0,0)", "Accent 5", and so on.
         * @param {string} value The color of the text.
         * @returns {string} The cell foreground color.
         */
        foreColor(value?: string): any;
        /**
         * Gets or sets the formatter for the cell.
         * @param {object} value The cell formatter string or object.
         * @returns {object} The cell formatter string or object.
         */
        formatter(value?: any): any;
        /**
         * Gets or sets the formula for the cell.
         * @param {string} value The cell formula.
         * @returns {string} The cell formula.
         */
        formula(value?: string): any;
        /**
         * Gets or sets the horizontal alignment of the contents of the cell.
         * @param {GcSpread.Sheets.HorizontalAlign} value The horizontal alignment.
         * @returns {GcSpread.Sheets.HorizontalAlign} The horizontal alignment of the contents of the cell.
         */
        hAlign(value?: HorizontalAlign): any;
        /**
         * Gets or sets the imeMode of the cell.
         * @param {GcSpread.Sheets.ImeMode} value The cell imeMode.
         * @returns {GcSpread.Sheets.ImeMode} The cell imeMode.
         */
        imeMode(value?: ImeMode): any;
        /**
         * Gets or sets whether the cell is locked. When the sheet is protected, the locked cell cannot be edited.
         * @param {boolean} value Set to <c>true</c> to lock the cell.
         * @returns {boolean} <c>true</c> if the cell is locked; otherwise, <c>false</c>.
         */
        locked(value?: boolean): any;
        /**
         * Gets or sets whether the cell shrinks the text to fit the cell size.
         * @param {boolean} value Set to <c>true</c> to have the cell shrink text to fit.
         * @returns {boolean} <c>true</c> if the cell shrinks text to fit; otherwise, <c>false</c>.
         */
        shrinkToFit(value?: boolean): any;
        /**
         * Gets or sets a value that indicates whether the user can set focus to the cell using the Tab key.
         * @param {boolean} value Set to <c>true</c> to set focus to the cell using the Tab key.
         * @returns {boolean} <c>true</c> if the user can set focus to the cell using the Tab key; otherwise, <c>false</c>.
         */
        tabStop(value?: boolean): any;
        /**
         * Gets or sets the tag for the cell.
         * @param {Object} value The tag value.
         * @returns {Object} The tag value.
         */
        tag(value?: any): any;
        /**
         * Gets or sets the formatted text for the cell.
         * @param {string} value The cell text.
         * @returns {string} The formatted text in the cell.
         */
        text(value?: string): any;
        /**
         * Gets or sets the type of the decoration added to the cell's text.
         * @param {GcSpread.Sheets.TextDecorationType} value The type of the decoration.
         * @returns {GcSpread.Sheets.TextDecorationType} The type of the decoration.
         */
        textDecoration(value?: TextDecorationType): any;
        /**
         * Gets or sets the text indent of the cell.
         * @param {number}  value The cell text indent.
         * @returns {number} The cell text indent.
         */
        textIndent(value?: number): any;
        /**
         * Gets or sets the theme font for the cell.
         * @param {string} value The cell's theme font.
         * @returns {string} The cell's theme font.
         */
        themeFont(value?: string): any;
        /**
         * Gets or sets the vertical alignment of the contents of the cell.
         * @param {GcSpread.Sheets.VerticalAlign} value The vertical alignment.
         * @returns {GcSpread.Sheets.VerticalAlign} The vertical alignment of the contents of the cell.
         */
        vAlign(value?: VerticalAlign): any;
        /**
         * Gets or sets the unformatted value of the cell.
         * @param {object} value The cell value.
         * @returns {object} The cell value.
         */
        value(value?: any): any;
        /**
         * Gets or sets the content of the cell watermark.
         * @param {string} value The content of the watermark.
         * @returns {string} The content of the watermark.
         */
        watermark(value?: string): any;
        /**
         * Gets or sets whether the cell lets text wrap.
         * @param {boolean} value Set to <c>true</c> to let text wrap within the cell.
         * @returns {boolean} <c>true</c> if the text can wrap within the cell; otherwise, <c>false</c>.
         */
        wordWrap(value?: boolean): any;
    }

    export class CellBindingSource{
        /**
         * Represents a source for cell binding.
         * @param {Object} source The data source.
         * @class
         */
        constructor(source: Object);
        /**
         * Gets the wrapped data source for cell binding.
         * @returns {Object} The original data source.
         */
        getSource(): Object;
        /**
         * Gets the value of the source by the binding path.
         * @param {string} path The binding path.
         * @returns {Object} Returns the value of the binding source at the specified path.
         */
        getValue(path: string): Object;
        /**
         * Sets the value of the source by the binding path.
         * @param {string} path The row index.
         * @param {Object} value The value to set.
         */
        setValue(path: string, value: Object): void;
    }

    export class CellPosition{
        /**
         * Represents the position of a cell.
         * @class
         * @param {number} row The row index.
         * @param {number} col The column index.
         * */
        constructor(row: number, col: number);
        /**
         * The column index.
         */
        col: any;
        /**
         * The row index.
         */
        row: any;
    }

    export class CellsEnumerator{
        /**
         * Represents a cells enumerator for any area of the sheet.
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {GcSpread.Sheets.SearchCondition} searchCondition The search condition.
         * @class
         */
        constructor(sheet: Sheet, searchCondition: SearchCondition);
        /**
         * Init this instance.
         */
        init(): void;
        /**
         * Advances the enumerator to the next element in the collection.
         * @returns {boolean} <c>true</c> if the enumerator successfully advanced to the next element; <c>false</c> if the enumerator has passed the end of the collection.
         */
        moveNext(): boolean;
        /**
         * Determines whether this instance is empty.
         * @returns {boolean} <c>true</c> if this instance is empty; otherwise, <c>false</c>.
         */
        skipCurrent(): boolean;
        /**
         * Tries to move to the next instance.
         * @returns {boolean}
         */
        tryMoveNext(): boolean;
    }

    export class CellValueCondition{
        /**
         * Represents a cell value condition with a specified compare type, expected value, and formula.
         * @param {GcSpread.Sheets.GeneralCompareType} compareType Indicates the compare type.
         * @param {object} expected Indicates the expected value.
         * @param {string} formula Indicates the formula that specifies a cell.
         * @class
         */
        constructor(compareType: GeneralCompareType, expected: any, formula: string);
        /** Indicates the type of comparison.
         * @type {GcSpread.Sheets.GeneralCompareType}
         */
        compareType: GeneralCompareType;
        /** Indicates the expected value.
         * @type {object}
         */
        expected: any;
        /** Indicates the formula that specifies a cell.
         * @type {string}
         */
        formula: any;
        /** Indicates whether to treat the null value in a cell as zero.
         * @type {boolean}
         */
        treatNullValueAsZero: boolean;
        /**
         * Evaluates the condition using the specified evaluator.
         * @constructor
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualValue The actual value object for evaluation.
         * @returns {boolean} <c>true</c> if the condition uses the specified evaluator; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actualValue: any): boolean;
        /**
         * Gets the expected value.
         * @constructor
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {boolean} isArrayFormula Indicates whether it is an array formula or not.
         * @returns {object} The expected value.
         */
        getExpected(evaluator: any, baseRow: number, baseColumn: number, isArrayFormula?: boolean): any;
        /**
         * Determines whether the specified value meets the condition.
         * @param {object} value The value.
         * @returns {boolean} <c>true</c> if the specified value meets the condition; otherwise, <c>false</c>.
         */
        isSatisfyingCondition(value: any): boolean;
    }

    export class CellValueRule extends ConditionRuleBase{
        /**
         * Represents a cell value conditional rule.
         * @class
         * @extends GcSpread.Sheets.ConditionRuleBase
         * @param {GcSpread.Sheets.ComparisonOperator} operator The comparison operator for the rule.
         * @param {object} value1 The value of the first object.
         * @param {object} value2 The value of the second object.
         * @param {GcSpread.Sheets.Style} style The style for the rule.
         */
        constructor(operator: ComparisonOperator, value1: any, value2: any, style: Style);
        /** The comparison operator for the rule.
         * @type {GcSpread.Sheets.ComparisonOperator}
         */
        operator: any;
        /** The value of the first object.
         * @type {object}
         */
        value1: any;
        /** The value of the second object.
         * @type {object}
         */
        value2: any;
        /**
         * Creates a condition for the rule.
         * @returns {object} The condition for the rule.
         */
        createCondition(): any;
        /**
         * Whether the rule is a formula.
         * @returns {boolean} <c>true</c> if the rule is a formula; otherwise, <c>false</c>.
         */
        isFormula(val: any): boolean;
        /**
         * Resets the rule.
         */
        reset(): void;
    }

    export class CheckBoxCellType{
        /**
         * Represents a check box cell.
         * @extends GcSpread.Sheets.TextCellType
         * @class
         */
        constructor();
        /**
         * Gets or sets the caption of the cell type.
         * @param {string} value The caption of the cell type.
         * @returns {string} The caption.
         */
        caption(value?: string): any;
        /**
         * Gets or sets a value that indicates whether the check box supports three states.
         * @param {boolean} value Whether the check box supports three states.
         * @returns {boolean} <c>true</c> if the check box supports three states; otherwise, <c>false</c>.
         */
        isThreeState(value?: boolean): any;
        /**
         * Gets or sets the text alignment relative to the check box.
         * @param {GcSpread.Sheets.CheckBoxTextAlign} value The text alignment relative to the check box.
         * @returns {GcSpread.Sheets.CheckBoxTextAlign} The text alignment relative to the check box.
         */
        textAlign(value?: CheckBoxTextAlign): any;
        /**
         * Gets or sets the text in the cell when the cell's value is <c>false</c>.
         * @param {string} value The text in the cell when the cell's value is <c>false</c>.
         * @returns {string} The text in the cell when the cell's value is <c>false</c>.
         */
        textFalse(value?: string): any;
        /**
         * Gets or sets the text in the cell when the cell's value is indeterminate (neither <c>true</c> nor <c>false</c>).
         * @param {string} value The text in the cell when the cell's value is indeterminate.
         * @returns {string} The text in the cell when the cell's value is indeterminate.
         */
        textIndeterminate(value?: string): any;
        /**
         * Gets or sets the text in the cell when the cell's value is <c>true</c>.
         * @param {string} value The text when the cell's value is <c>true</c>.
         * @returns {string} The text when the cell's value is <c>true</c>.
         */
        textTrue(value?: string): any;
    }

    export class ColorCondition{
        /**
         * Represents a style condition with the specified comparison type and expected color.
         * @param {GcSpread.Sheets.ColorCompareType} compareType The style comparison type.
         * @param {string} expected The expected color.
         * @class
         */
        constructor(compareType: ColorCompareType, expected: string);
        /** The style comparison type.
         * @type {GcSpread.Sheets.ColorCompareType}
         */
        compareType: any;
        /** The expected color.
         * @type {string}
         */
        expected: any;
        /** Whether to ignore the blank cell.
         * @type {boolean}
         */
        ignoreBlank: boolean;
        /**
         * Evaluates the condition using the specified evaluator.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualObj The actual value object for evaluation.
         * @returns {boolean} <c>true</c> if the result is successful; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actualObj: any): boolean;
        /**
         * Resets this instance.
         */
        reset(): void;
    }

    export class Column{
        /**
         * Represents a column in a sheet.
         * @class
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that contains this column.
         * @param {number} index The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If you do not provide this parameter, it will default to <b>viewport</b>.
         */
        constructor(sheet: Sheet, index: number, sheetArea: SheetArea);
        /**
         * Gets column index of the first column in the range.
         * @type {number}
         */
        index: any;
        /**
         * Gets column index of the last column in the range.
         * @type {number}
         */
        index2: any;
        /**
         * Gets the sheet that contains this column.
         * @type {GcSpread.Sheets.Sheet}
         */
        sheet: any;
        /**
         * Gets the area that contains this column.
         *  @type {GcSpread.Sheets.SheetArea}
         */
        sheetArea: any;
        /**
         * Gets or sets the background color for the column, such as "red", "#FFFF00", "rgb(255,0,0)", "Accent 5", and so on.
         * @param {string} value The column's background color.
         * @returns {string} The column's background color.
         */
        backColor(value?: string): any;
        /**
         * Gets or sets the background image for the column.
         * @param {string} value The column background image.
         * @returns {string} The column background image.
         */
        backgroundImage(value?: string): any;
        /**
         * Gets or sets the background image layout for the column.
         * @param {GcSpread.Sheets.ImageLayout} value The column background image layout.
         * @returns {GcSpread.Sheets.ImageLayout} The column background image layout.
         */
        backgroundImageLayout(layout?: ImageLayout): any;
        /**
         * Gets or sets the bottom border for the column.
         * @param {GcSpread.Sheets.LineBorder} value The column bottom border line.
         * @returns {GcSpread.Sheets.LineBorder} The column bottom border line.
         */
        borderBottom(value?: LineBorder): any;
        /**
         * Gets or sets the left border for the column.
         * @param {GcSpread.Sheets.LineBorder} value The column left border line.
         * @returns {GcSpread.Sheets.LineBorder} The column left border line.
         */
        borderLeft(value?: LineBorder): any;
        /**
         * Gets or sets the right border for the column.
         * @param {GcSpread.Sheets.LineBorder} value The column right border line.
         * @returns {GcSpread.Sheets.LineBorder} The column right border line.
         */
        borderRight(value?: LineBorder): any;
        /**
         * Gets or sets the top border for the column.
         * @param {GcSpread.Sheets.LineBorder} value The column top border line.
         * @returns {GcSpread.Sheets.LineBorder} The column top border line.
         */
        borderTop(value?: LineBorder): any;
        /**
         * Gets or sets the cell type for the column.
         * @param {GcSpread.Sheets.BaseCellType} value The column cell type.
         * @returns {GcSpread.Sheets.BaseCellType} The column cell type.
         */
        cellType(value?: any): any;
        /**
         * Clears the style setting for the specified property that is a property of GcSpread.Sheets.Style, such as "backColor", "foreColor", and so on.
         * @param {string} propertyName The property name.
         */
        clearStyleProperty(propertyName: string): void;
        /**
         * Gets or sets the data validator for the column.
         * @param {GcSpread.Sheets.DefaultDataValidator} value The column data validator.
         * @returns {GcSpread.Sheets.DefaultDataValidator} The column data validator.
         */
        dataValidator(value?: any): any;
        /**
         * Gets or sets the font for the column, such as "normal normal normal 20px/normal Arial".
         * @param {string} value The column font.
         * @returns {string} The column font.
         */
        font(value?: string): any;
        /**
         * Gets or sets the color of the text in the column, such as "red", "#FFFF00", "rgb(255,0,0)", "Accent 5", and so on.
         * @param {string} value The color of the text in the column.
         * @returns {string} The color of the text in the column.
         */
        foreColor(value?: string): any;
        /**
         * Gets or sets the formatter for the column.
         * @param {object} value The column formatter string or object.
         * @returns {object} The column formatter string or object.
         */
        formatter(value?: any): any;
        /**
         * Gets or sets the horizontal alignment of the contents of the cells in the column.
         * @param {GcSpread.Sheets.HorizontalAlign} value The horizontal alignment.
         * @returns {GcSpread.Sheets.HorizontalAlign} The horizontal alignment.
         */
        hAlign(value?: HorizontalAlign): any;
        /**
         * Gets or sets the imeMode of the column.
         * @param {GcSpread.Sheets.ImeMode} value The column imeMode.
         * @returns {GcSpread.Sheets.ImeMode} The column imeMode.
         */
        imeMode(value?: ImeMode): any;
        /**
         * Gets or sets whether the cells in the column are locked. When the sheet is protected, the locked cell cannot be edited.
         * @param {boolean} value Set to <c>true</c> to lock the cells in the column for editing.
         * @returns {boolean} <c>true</c> if the cells in the column are locked; otherwise, <c>false</c>.
         */
        locked(value?: boolean): any;
        /**
         * Gets or sets if the column can be resized by the user.
         * @param {boolean} value Set to <c>true</c> to let users resize the column.
         * @returns {boolean} <c>true</c> if the column can be resized; otherwise, <c>false</c>.
         */
        resizable(value?: boolean): any;
        /**
         * Gets or sets whether the contents of the cells in the column can shrink to fit.
         * @param {boolean} value Set to <c>true</c> to shrink the contents to fit within the cells.
         * @returns {boolean} <c>true</c> if the contents shrink to fit the cells; otherwise, <c>false</c>.
         */
        shrinkToFit(value?: boolean): any;
        /**
         * Gets or sets a value that indicates whether the user can set focus to the cells in the column using the Tab key.
         * @param {boolean} value Set to <c>true</c> to set focus to the cells in the column using the Tab key.
         * @returns {boolean} <c>true</c> if the user can set focus to the cells in the column using the Tab key; otherwise, <c>false</c>.
         */
        tabStop(value?: boolean): any;
        /**
         * Gets or sets the tag for the column.
         * @param {Object} value The tag value.
         * @returns {Object} The tag value.
         */
        tag(value?: any): any;
        /**
         * Gets or sets the type of the decoration added to the text of the cells in the column.
         * @param {GcSpread.Sheets.TextDecorationType} value The type of the decoration.
         * @returns {GcSpread.Sheets.TextDecorationType} The type of the decoration.
         */
        textDecoration(value?: TextDecorationType): any;
        /**
         * Gets or sets the text indent for the column.
         * @param {number} value The column text indent.
         * @returns {number} The column text indent.
         */
        textIndent(value?: number): any;
        /**
         * Gets or sets the theme font for the column.
         * @param {string} value The column theme font.
         * @returns {string} The column theme font.
         */
        themeFont(value?: string): any;
        /**
         * Gets or sets the vertical alignment of the contents of the cells in the column.
         * @param {GcSpread.Sheets.VerticalAlign} value The vertical alignment.
         * @returns {GcSpread.Sheets.VerticalAlign} The vertical alignment.
         */
        vAlign(value?: VerticalAlign): any;
        /**
         * Gets or sets whether the column is displayed.
         * @param {boolean} value Set to <c>true</c> to display the column.
         * @returns {boolean} <c>true</c> if the column is displayed; otherwise, <c>false</c>.
         */
        visible(value?: boolean): any;
        /**
         * Gets or sets the content of the column watermark.
         * @param {string} value The content of the watermark.
         * @returns {string} The content of the watermark.
         */
        watermark(value?: string): any;
        /**
         * Gets or sets the width of the column in pixels.
         * @param {number} value The column width.
         * @returns {number} The column width.
         */
        width(value?: number): any;
        /**
         * Gets or sets whether text wraps in the cells in the column.
         * @param {boolean} value Set to <c>true</c> to let text wrap in the cells.
         * @returns {boolean} <c>true</c> if the text can wrap; otherwise, <c>false</c>.
         */
        wordWrap(value?: boolean): any;
    }

    export class ColumnHeaderCellType{
        /**
         * Represents the painter of the column header cells.
         * @extends GcSpread.Sheets.BaseCellType
         * @class
         */
        constructor();
    }

    export class ComboBoxCellType{
        /**
         * Represents an editable combo box cell.
         * @extends GcSpread.Sheets.BaseCellType
         * @class
         */
        constructor();
        /**
         * Gets or sets whether the combo box is editable.
         * @param {boolean} value Whether the combo box is editable.
         * @returns {boolean} <c>true</c> if the combo box is editable; otherwise, <c>false</c>.
         */
        editable(value?: boolean): any;
        /**
         * Gets or sets the value that is written to the underlying data model.
         * @param {GcSpread.Sheets.EditorValueType} value The type of editor value.
         * @returns {GcSpread.Sheets.EditorValueType} The type of editor value.
         */
        editorValueType(value?: EditorValueType): any;
        /**
         * Gets or sets the height of each item.
         * @param {number} value The height of each item.
         * @returns {number} The height of each item.
         */
        itemHeight(value?: number): any;
        /**
         * Gets or sets the items for the drop-down list in the combo box.
         * @param {Array} items The items for the combo box.
         * @returns {Array} The items array.
         */
        items(items?: any[]): any;
    }

    export class Comment{
        /**
         * Represents a comment.
         * @class
         */
        constructor();
        /**
         * Gets or sets whether the comment automatically sizes based on its content.
         * @param {boolean} value Whether the comment automatically sizes.
         * @returns {boolean} Whether the comment automatically sizes.
         */
        autoSize(value?: boolean): any;
        /**
         * Gets or sets the background color of the comment.
         * @param {string} value The background color of the comment.
         * @returns {string} The background color of the comment.
         */
        backColor(value?: string): any;
        /**
         * Gets or sets the border color for the comment.
         * @param {string} value The border color for the comment.
         * @returns {string} The border color for the comment.
         */
        borderColor(value?: string): any;
        /**
         * Gets or sets the border style for the comment.
         * @param {string} value The border style for the comment.
         * @returns {string} The border style for the comment.
         */
        borderStyle(value?: string): any;
        /**
         * Gets or sets the border width for the comment.
         * @param {number} value The border width for the comment.
         * @returns {number} The border width for the comment.
         */
        borderWidth(value?: number): any;
        /**
         * Gets the state of the comment.
         * @returns {GcSpread.Sheets.CommentState} The state of the comment.
         */
        commentState(value?: CommentState): any;
        /**
         * Gets or sets the display mode for the comment.
         * @param {GcSpread.Sheets.DisplayMode} value The display mode for the comment.
         * @returns {GcSpread.Sheets.DisplayMode} The display mode for the comment.
         */
        displayMode(value?: DisplayMode): any;
        /**
         * Gets or sets whether the comment dynamically moves.
         * @param {boolean} value Whether the comment dynamically moves.
         * @returns {boolean} Whether the comment dynamically moves.
         */
        dynamicMove(value?: boolean): any;
        /**
         * Gets or sets whether the comment is dynamically sized.
         * @param {boolean} value Whether the comment is dynamically sized.
         * @returns {boolean} Whether the comment is dynamically sized.
         */
        dynamicSize(value?: boolean): any;
        /**
         * Gets or sets the font family for the comment.
         * @param {string} value The font family for the comment.
         * @returns {string} The font family for the comment.
         */
        fontFamily(value?: string): any;
        /**
         * Gets or sets the font size for the comment.
         * @param {string} value The font size for the comment.
         * @returns {string} The font size for the comment.
         */
        fontSize(value?: string): any;
        /**
         * Gets or sets the font style of the comment.
         * @param {string} value The font style of the comment.
         * @returns {string} The font style of the comment.
         */
        fontStyle(value?: string): any;
        /**
         * Gets or sets the font weight for the comment.
         * @param {string} value The font weight for the comment.
         * @returns {string} The font weight for the comment.
         */
        fontWeight(value?: string): any;
        /**
         * Gets or sets the text color for the comment.
         * @param {string} value The text color for the comment.
         * @returns {string} The text color for the comment.
         */
        foreColor(value?: string): any;
        /**
         * Gets or sets the height of the comment.
         * @param {number} value The height of the comment.
         * @returns {number} The height of the comment.
         */
        height(value?: number): any;
        /**
         * Gets or sets the horizontal alignment of the comment.
         * @param {GcSpread.Sheets.HorizontalAlign} value The horizontal alignment of the comment.
         * @returns {GcSpread.Sheets.HorizontalAlign} The horizontal alignment of the comment.
         */
        horizontalAlign(value?: HorizontalAlign): any;
        /**
         * Gets or sets the location of the comment.
         * @param {GcSpread.Sheets.Point} value The location of the comment.
         * @returns {GcSpread.Sheets.Point} The location of the comment.
         */
        location(value?: Point): any;
        /**
         * Gets or sets the locked setting for the comment.
         * @param {boolean} value The locked setting for the comment.
         * @returns {boolean} The locked setting for the comment.
         */
        locked(value?: boolean): any;
        /**
         * Gets or sets the locked text for the comment.
         * @param {boolean} value The locked text for the comment.
         * @returns {boolean} The locked text for the comment.
         */
        lockText(value?: boolean): any;
        /**
         * Gets or sets the opacity of the comment.
         * @param {number} value The opacity of the comment.
         * @returns {number} The opacity of the comment.
         */
        opacity(value?: number): any;
        /**
         * Gets or sets the padding for the comment.
         * @param {GcSpread.Sheets.Padding} value The padding for the comment.
         * @returns {GcSpread.Sheets.Padding} The padding for the comment.
         */
        padding(value?: Padding): any;
        /**
         * Gets or sets whether the comment displays a shadow.
         * @param {boolean} value Whether the comment displays a shadow.
         * @returns {boolean} Whether the comment displays a shadow.
         */
        showShadow(value?: boolean): any;
        /**
         * Gets or sets the text of the comment.
         * @param {string} value The text of the comment.
         * @returns {string} The text of the comment.
         */
        text(value?: string): any;
        /**
         * Gets or sets the text decoration for the comment.
         * @param {GcSpread.Sheets.TextDecorationType} value The text decoration for the comment.
         * @returns {GcSpread.Sheets.TextDecorationType} The text decoration for the comment.
         */
        textDecoration(value?: TextDecorationType): any;
        /**
         * Gets or sets the width of the comment.
         * @param {number} value The width of the comment.
         * @returns {number} The width of the comment.
         */
        width(value?: number): any;
        /**
         * Gets or sets the z-index of the comment.
         * @param {number} value The z-index of the comment.
         * @returns {number} The z-index of the comment.
         */
        zIndex(value?: number): any;
    }

    export class ConditionalFormats{
        /**
         * Represents a format condition class.
         * @class
         * @param {object} worksheet The sheet.
         */
        constructor(worksheet: Sheet);
        /**
         * Adds the two scale rule to the rule collection.
         * @param {GcSpread.Sheets.ScaleValueType} minType The minimum scale type.
         * @param {object} minValue The minimum scale value.
         * @param {string} minColor The minimum scale color.
         * @param {GcSpread.Sheets.ScaleValueType} maxType The maximum scale type.
         * @param {object} maxValue The maximum scale value.
         * @param {string} maxColor The maximum scale color.
         * @param {Array} ranges The cell ranges where the rule is applied whose item type is GcSpread.Sheets.Range.
         * @returns {object} The two scale rule added to the rule collection.
         */
        add2ScaleRule(minType: ScaleValueType, minValue: any, minColor: string, maxType: ScaleValueType, maxValue: any, maxColor: string, ranges: Range[]): any;
        /**
         * Adds the three scale rule to the rule collection.
         * @param {GcSpread.Sheets.ScaleValueType} minType The minimum scale type.
         * @param {object} minValue The minimum scale value.
         * @param {string} minColor The minimum scale color.
         * @param {GcSpread.Sheets.ScaleValueType} midType The midpoint scale type.
         * @param {object} midValue The midpoint scale value.
         * @param {string} midColor The midpoint scale color.
         * @param {GcSpread.Sheets.ScaleValueType} maxType The maximum scale type.
         * @param {object} maxValue The maximum scale value.
         * @param {string} maxColor The maximum scale color.
         * @param {Array} ranges The cell ranges where the rule is applied whose item type is GcSpread.Sheets.Range.
         * @returns {object} The three scale rule added to the rule collection.
         */
        add3ScaleRule(minType: ScaleValueType, minValue: any, minColor: string, midType: ScaleValueType, midValue: any, midColor: string, maxType: ScaleValueType, maxValue: any, maxColor: string, ranges: Range[]): any;
        /**
         * Adds an average rule to the rule collection.
         * @param {GcSpread.Sheets.AverageConditionType} type The average condition type.
         * @param {GcSpread.Sheets.Style} style The style that is applied to the cell when the condition is met.
         * @param {Array} ranges The cell ranges where the rule is applied whose item type is GcSpread.Sheets.Range.
         * @returns {object} The average rule added to the rule collection.
         */
        addAverageRule(type: AverageConditionType, style: Style, ranges: Range[]): any;
        /**
         * Adds the cell value rule to the rule collection.
         * @param {GcSpread.Sheets.ComparisonOperator} comparisonOperator The comparison operator.
         * @param {object} value1 The first value.
         * @param {object} value2 The second value.
         * @param {GcSpread.Sheets.Style} style The style that is applied to the cell when the condition is met.
         * @param {Array} ranges The cell ranges where the rule is applied whose item type is GcSpread.Sheets.Range.
         * @returns {object} The cell value rule added to the rule collection.
         */
        addCellValueRule(comparisionOperator: ComparisonOperator, value1: any, value2: any, style: Style, ranges: Range[]): any;
        /**
         * Adds a data bar rule to the rule collection.
         * @param {GcSpread.Sheets.ScaleValueType} minType The minimum scale type.
         * @param {object} minValue The minimum scale value.
         * @param {GcSpread.Sheets.ScaleValueType} maxType The maximum scale type.
         * @param {object} maxValue The maximum scale value.
         * @param {string} color The color data bar to show on the view.
         * @param {Array} ranges The cell ranges where the rule is applied whose item type is GcSpread.Sheets.Range.
         * @returns {object} The data bar rule added to the rule collection.
         */
        addDataBarRule(minType: ScaleValueType, minValue: any, maxType: ScaleValueType, maxValue: any, color: string, ranges: Range[]): any;
        /**
         * Adds the date occurring rule to the rule collection.
         * @param {GcSpread.Sheets.DateOccurringType} type The data occurring type.
         * @param {GcSpread.Sheets.Style} style The style that is applied to the cell when the condition is met.
         * @param {Array} ranges The cell ranges where the rule is applied whose item type is GcSpread.Sheets.Range.
         * @returns {object} The date occurring rule added to the rule collection.
         */
        addDateOccurringRule(type: DateOccurringType, style: Style, ranges: Range[]): any;
        /**
         * Adds a duplicate rule to the rule collection.
         * @param {GcSpread.Sheets.Style} style The style that is applied to the cell when the condition is met.
         * @param {Array} ranges The cell ranges where the rule is applied whose item type is GcSpread.Sheets.Range.
         * @returns {object} The duplicate rule added to the rule collection.
         */
        addDuplicateRule(style: Style, ranges: Range[]): any;
        /**
         * Adds the formula rule to the rule collection.
         * @param {string} formula The condition formula.
         * @param {GcSpread.Sheets.Style} style The style that is applied to the cell when the condition is met.
         * @param {Array} ranges The cell ranges where the rule is applied whose item type is GcSpread.Sheets.Range.
         * @returns {object} The formula rule added to the rule collection.
         */
        addFormulaRule(formula: string, style: Style, ranges: Range[]): any;
        /**
         * Adds an icon set rule to the rule collection.
         * @param {GcSpread.Sheets.IconSetType} iconSetTye The type of icon set.
         * @param {Array} ranges The cell ranges where the rule is applied whose item type is GcSpread.Sheets.Range.
         * @returns {object} The icon set rule added to the rule collection.
         */
        addIconSetRule(iconSetTye: IconSetType, ranges: Range[]): any;
        /**
         * Adds the rule.
         * @param {object} rule The rule to add.
         * @returns {object} The rule.
         */
        addRule(rule: ConditionRuleBase): any;
        /**
         * Adds the text rule to the rule collection.
         * @param {GcSpread.Sheets.TextComparisonOperator} comparisonOperator The comparison operator.
         * @param {string} text The text for comparison.
         * @param {GcSpread.Sheets.Style} style The style that is applied to the cell when the condition is met.
         * @param {Array} ranges The cell ranges where the rule is applied to items whose item type is GcSpread.Sheets.Range.
         * @returns {object} The text rule added to the rule collection.
         */
        addSpecificTextRule(comparisionOperator: TextComparisonOperator, text: string, style: Style, ranges: Range[]): any;
        /**
         * Adds the top 10 rule or bottom 10 rule to the collection based on the Top10CondtionType.
         * @param {GcSpread.Sheets.Top10ConditionType} type The top 10 condition.
         * @param {number} rank The number of top or bottom items to apply the style to.
         * @param {GcSpread.Sheets.Style} style The style that is applied to the cell when the condition is met.
         * @param {Array} ranges The cell ranges where the rule is applied whose item type is GcSpread.Sheets.Range.
         * @returns {object} The top 10 rule added to the rule collection.
         */
        addTop10Rule(type: Top10ConditionType, rank: number, style: Style, ranges: Range[]): any;
        /**
         * Adds a unique rule to the rule collection.
         * @param {GcSpread.Sheets.Style} style The style that is applied to the cell when the condition is met.
         * @param {Array} ranges The cell ranges where the rule is applied whose item type is GcSpread.Sheets.Range.
         * @returns {object} The unique rule added to the rule collection.
         */
        addUniqueRule(style: Style, ranges: Range[]): any;
        /**
         * Removes all rules.
         */
        clearRule(): void;
        /**
         * Determines whether the specified cell contains a specified rule.
         * @param {object} rule The rule for which to check.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @returns {boolean} <c>true</c> if the specified cell contains a specified rule; otherwise, <c>false</c>.
         */
        containsRule(rule: any, row: number, column: number): boolean;
        /**
         * Gets the number of rule objects in the collection.
         * @returns {number} The number of rule objects in the collection.
         */
        count(): number;
        /**
         * Gets the rule by index.
         * @param {number} index The index from which to get the rule.
         * @returns {object} The rule by index.
         */
        getRule(index: number): any;
        /**
         * Gets the conditional rules from the cell at the specified row and column.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @returns {Array} The conditional rules.
         */
        getRules(row?: number, column?: number): any[];
        /**
         * Removes a rule object from the ConditionalFormats object.
         * @param {object} rule The rule object to remove from the ConditionalFormats object.
         */
        removeRule(rule: ConditionRuleBase): void;
        /**
         * Removes the rules from a specified cell range.
         * @param {number} row The row index of the first cell in the range.
         * @param {number} column The column index of the first cell in the range.
         * @param {number} rowCount The number of rows in the range.
         * @param {number} columnCount The number of columns in the range.
         */
        removeRuleByRange(row: number, column: number, rowCount: number, columnCount: number): void;
    }

    export class ConditionRuleBase{
        /**
         * Represents a formatting base rule class as the specified style.
         * @param {GcSpread.Sheets.Style} style The style for the rule.
         * @class
         */
        constructor(style: Style);
        /** Indicates the base condition of the rule.
         * @type {object}
         */
        condition: Object;
        /** Gets the cell range collection for the rule.
         * @type {Array} The GcSpread.Sheets.Range Array.
         */
        ranges: Range[];
        /** Gets or sets the style for the rule.
         * @type {GcSpread.Sheets.Style}
         */
        style: Style;
        /**
         * Determines whether the range of cells contains the cell at the specified row and column.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @returns {boolean} <c>true</c> if the range of cells contains the cell at the specified row and column; otherwise, <c>false</c>.
         */
        contains(row: number, column: number): boolean;
        /**
         * Creates conditions for the rule.
         */
        createCondition(): Object;
        /**
         * Returns the cell style of the rule if the cell satisfies the condition.
         * @param {object} evaluator The object that can evaluate a condition.
         * @param {number} baseRow The row index.
         * @param {number} baseColumn The column index.
         * @param {object} actual The actual value.
         * @returns {object} The cell style of the rule.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actual: any): any;
        /**
         * Get the base coordinates.
         * @param {object} baseCoord
         */
        getBaseCoordinate(baseCoord: Object): void;
        /**
         * Gets the style of the base rule.
         * @returns {GcSpread.Sheets.Style}
         */
        getExpected(): Style;
        /**
         * Whether this rule has a reference.
         * @returns {boolean} <c>true</c> if this rule has a reference; otherwise, <c>false</c>.
         */
        hasNoReference(): boolean;
        /**
         * Initial condition for the rule.
         */
        initCondition(): void;
        /**
         * Whether the range for this rule intersects another range.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @param {number} rowCount The number of rows.
         * @param {number} columnCount The number of columns.
         * @returns {boolean} <c>true</c> if the range for this rule intersects another range; otherwise, <c>false</c>.
         */
        intersects(row: number, column: number, rowCount: number, columnCount: number): boolean;
        /**
         * Whether this rule is a scale rule.
         * @returns {boolean} <c>true</c> if this rule is a scale rule; otherwise, <c>false</c>.
         */
        isScaleRule(): boolean;
        /**
         * Gets the priority of this conditional formatting rule.
         * @returns {number} The priority of this conditional formatting rule.
         */
        priority(): number;
        /**
         * Resets the rule.
         */
        reset(): void;
        /**
         * Gets or sets whether rules with lower priority are applied before this rule.
         * @param {boolean} value Whether rules with lower priority are applied before this rule.
         * @returns {boolean} <c>true</c> if rules with lower priority are not applied before this rule; otherwise, <c>false</c>.
         */
        stopIfTrue(value?: boolean): any;
    }

    export class CornerCellType extends BaseCellType{
        /**
         * Represents the painter of the corner cell.
         * @extends GcSpread.Sheets.BaseCellType
         * @class
         */
        constructor();
    }

    export class CultureInfo{
        /**
         * The custom culture class. The member variable can be overwrite.
         * @class
         */
        constructor();
        /**
         * For the formatter "ddd".
         * @type {Array}
         */
        abbreviatedDayNames: any;
        /**
         * For the formatter "MMM".
         * @type {Array}
         */
        abbreviatedMonthGenitiveNames: any;
        /**
         * For the formatter "MMM".
         * @type {Array}
         */
        abbreviatedMonthNames: any;
        /**
         * Indicates the AM designator.
         * @type {string}
         */
        amDesignator: any;
        /**
         * Indicates the separator for an array constant in a formula.
         * @type {string}
         */
        arrayGroupSeparator: any;
        /**
         * Indicates the currency symbol.
         * @type {string}
         */
        currencySymbol: any;
        /**
         * For the formatter "dddd".
         * @type {Array}
         */
        dayNames: any;
        /**
         * For the standard date formatter "F".
         * @type {string}
         */
        fullDateTimePattern: any;
        /**
         * Indicates the separator for function arguments in a formula.
         * @type {string}
         */
        listSeparator: any;
        /**
         * For the standard date formatter "D".
         * @type {string}
         */
        longDatePattern: any;
        /**
         * For the standard date formatter "T" and "U".
         * @type {string}
         */
        longTimePattern: any;
        /**
         * For the standard date formatter "M" and "m".
         * @type {string}
         */
        monthDayPattern: any;
        /**
         * For the formatter "MMMM".
         * @type {Array}
         */
        monthGenitiveNames: any;
        /**
         * For the formatter "M" or "MM".
         * @type {Array}
         */
        monthNames: any;
        /**
         * Indicates the decimal point.
         * @type {string}
         */
        numberDecimalSeparator: any;
        /**
         * Indicates the thousand separator.
         * @type {string}
         */
        numberGroupSeparator: any;
        /**
         * Indicates the PM designator.
         * @type {string}
         */
        pmDesignator: any;
        /**
         * For the standard date formatter "R" and "r".
         * @type {string}
         */
        rfc1123Pattern: any;
        /**
         * For the standard date formatter "d".
         * @type {string}
         */
        shortDatePattern: any;
        /**
         * For the standard date formatter "t".
         * @type {string}
         */
        shortTimePattern: any;
        /**
         * For the standard date formatter "s".
         * @type {string}
         */
        sortableDateTimePattern: any;
        /**
         * For the standard date formatter "u".
         * @type {string}
         */
        universalSortableDateTimePattern: any;
        /**
         * For the standard date formatter "y" and "Y".
         * @type {string}
         */
        yearMonthPattern: any;
    }

    export class CustomCellType{
        /**
         * Represents the custom cell.
         * @extends GcSpread.Sheets.BaseCellType
         * @class
         */
        constructor();
        /**
         * Represents the type name string used for supporting serialization.
         * @type {string}
         */
        typeName: string;
        /**
         * Activates the editor, including setting properties or attributes for the editor and binding events for the editor.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {GcSpread.Sheets.Style} cellStyle The cell's actual style.
         * @param {GcSpread.Sheets.Rect} cellRect The cell's layout information.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        activateEditor(editorContext: any, cellStyle: Style, cellRect: Rect, context?: any): void;
        /**
         * Creates a DOM element then returns it.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {object} Returns a DOM element.
         */
        createEditorElement(context?: any): any;
        /**
         * Deactivates the editor, such as unbinding events for the editor.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        deactivateEditor(editorContext: any, context?: any): void;
        /**
         * Loads the object state from the specified JSON string.
         * @param {Object} settings The custom cell type data from deserialization.
         */
        fromJSON(settings: Object): void;
        /**
         * Gets a cell's height that can be used to handle the row's auto fit.
         * @param {object} value The cell's value.
         * @param {string} text The cell's text.
         * @param {GcSpread.Sheets.Style} cellStyle The cell's actual value.
         * @param {number} zoomFactor The current sheet's zoom factor.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {number} Returns the cell's height that can be used to handle the row's auto fit.
         */
        getAutoFitHeight(value: any, text: string, cellStyle: Style, zoomFactor: number, context?: any): number;
        /**
         * Gets a cell's width that can be used to handle the column's auto fit.
         * @param {object} value The cell's value.
         * @param {string} text The cell's text.
         * @param {GcSpread.Sheets.Style} cellStyle The cell's actual value.
         * @param {number} zoomFactor The current sheet's zoom factor.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {number} Returns the cell's width that can be used to handle the column's auto fit.
         */
        getAutoFitWidth(value: any, text: string, cellStyle: Style, zoomFactor: number, context?: any): number;
        /**
         * Gets the editor's value.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {object} Returns the editor's value.
         */
        getEditorValue(editorContext: any, context?: any): any;
        /**
         * Gets the cell type's hit info.
         * @param {number} x The <i>x</i>-coordinate of the mouse's current location relative to the canvas.
         * @param {number} y The <i>y</i>-coordinate of the mouse's current location relative to the canvas.
         * @param {GcSpread.Sheets.Style} cellStyle The current cell's actual style.
         * @param {GcSpread.Sheets.Rect} cellRect The current cell's layout information.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {object} Returns an object that contains the <i>x</i>, <i>y</i>, <i>row</i>, <i>col</i>, <i>cellRect</i>, and <i>sheetArea</i> parameters, and a value to indicate <i>isReservedLocation</i>.
         * <i>isReservedLocation</i> is <c>true</c> if the hit test is in a special area that the cell type needs to handle; otherwise, <c>false</c>.
         */
        getHitInfo(x: number, y: number, cellStyle: Style, cellRect: Rect, context?: any): IHitTestCellTypeHitInfo;
        /**
         * Whether the editing value changed.
         * @param {object} oldValue The old editing value.
         * @param {object} newValue The new editing value.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {boolean} <c>true</c> if oldValue equals newValue; otherwise, <c>false</c>.
         */
        isEditingValueChanged(oldValue: any, newValue: any, context?: any): boolean;
        /**
         * Whether this cell type is aware of IME.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {boolean} <c>true</c> if the cell type is aware of IME; otherwise, <c>false</c>.
         */
        isImeAware(context?: any): boolean;
        /**
         *  Whether the cell type handles the keyboard event itself.
         * @param {KeyboardEvent} event The KeyboardEvent.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {boolean} <c>true</c> if the cell type handles keyboard events itself; otherwise, <c>false</c>.
         */
        isReservedKey(event: KeyboardEvent, context?: any): boolean;
        /**
         * Paints a cell on the canvas.
         * @param {CanvasRenderingContext2D} ctx The canvas's two-dimensional context.
         * @param {object} value The cell's value.
         * @param {number} x <i>x</i>-coordinate relative to the canvas.
         * @param {number} y <i>y</i>-coordinate relative to the canvas.
         * @param {number} width The cell's width.
         * @param {number} height The cell's height.
         * @param {GcSpread.Sheets.Style} style The cell's actual style.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        paint(ctx: CanvasRenderingContext2D, value: any, x: number, y: number, width: number, height: number, style: Style, context?: any): void;
        /**
         * Processes key down in display mode.
         * @param {KeyboardEvent} event The KeyboardEvent.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {boolean} <c>true</c> if processes successfully; otherwise, <c>false</c>.
         */
        processKeyDown(event: KeyboardEvent, context?: any): boolean;
        /**
         * Processes key up in display mode.
         * @param {KeyboardEvent} event The KeyboardEvent.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         * @returns {boolean} <c>true</c> if processes successfully; otherwise, <c>false</c>.
         */
        processKeyUp(event: KeyboardEvent, context?: any): boolean;
        /**
         * Processes mouse down in display mode.
         * @param {object} hitInfo The hit test information returned by the getHitInfo method. See the Remarks for more information.
         * @returns {boolean} <c>true</c> if processes successfully; otherwise, <c>false</c>.
         */
        processMouseDown(hitInfo: IHitTestCellTypeHitInfo): any;
        /**
         * Processes mouse enter in display mode.
         * @param {object} hitInfo The hit test information returned by the getHitInfo method. See the Remarks for more information.
         * @returns {boolean} <c>true</c> if processes successfully; otherwise, <c>false</c>.
         */
        processMouseEnter(hitInfo: IHitTestCellTypeHitInfo): any;
        /**
         * Processes mouse leave in display mode.
         * @param {object} hitInfo The hit test information returned by the getHitInfo method. See the Remarks for more information.
         * @returns {boolean} <c>true</c> if processes successfully; otherwise, <c>false</c>.
         */
        processMouseLeave(hitInfo: IHitTestCellTypeHitInfo): any;
        /**
         * Processes mouse move in display mode.
         * @param {object} hitInfo The hit test information returned by the getHitInfo method. See the Remarks for more information.
         * @returns {boolean} <c>true</c> if processes successfully; otherwise, <c>false</c>.
         */
        processMouseMove(hitInfo: IHitTestCellTypeHitInfo): any;
        /**
         * Processes mouse up in display mode.
         * @param {object} hitInfo The hit test information returned by the getHitInfo method. See the Remarks for more information.
         * @returns {boolean} <c>true</c> if processes successfully; otherwise, <c>false</c>.
         */
        processMouseUp(hitInfo: IHitTestCellTypeHitInfo): any;
        /**
         *  Sets the editor's value.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {object} value The value returned from the active cell.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        setEditorValue(editorContext: any, value: any, context?: any): void;
        /**
         * Saves the object state to a JSON string.
         * @returns {Object} The custom cell type data.
         */
        toJSON(): Object;
        /**
         * Updates the editor's size.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {GcSpread.Sheets.Style} cellStyle The cell's actual style.
         * @param {GcSpread.Sheets.Rect} cellRect The cell's layout information.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        updateEditor(editorContext: any, cellStyle: Style, cellRect: Rect, context?: any): void;
        /**
         * Updates the editor's ime-mode.
         * @param {object} editorContext The DOM element that was created by the createEditorElement method.
         * @param {GcSpread.Sheets.ImeMode} imeMode The ime-mode from the cell's actual style.
         * @param {object} context The context associated with the cell type. See the Remarks for more information.
         */
        updateImeMode(editorContext: any, imeMode: ImeMode, context?: any): any;
    }

    export class CustomFloatingObject extends FloatingObject{
        /**
         * Represents a custom floating object.
         * @extends GcSpread.Sheets.FloatingObject
         * @class
         * @param {string} name The name of the custom floating object.
         * @param {number} x The <i>x</i> location of the custom floating object.
         * @param {number} y The <i>y</i> location of the custom floating object.
         * @param {number} width The width of the custom floating object.
         * @param {number} height The height of the custom floating object.
         */
        constructor(name?: string, x?: number, y?: number, width?: number, height?: number);
        /**
         * Gets a copy of the current content of the instance.
         * @returns {GcSpread.Sheets.CustomFloatingObject} A copy of the current content of the instance.
         */
        cloneContent(): HTMLElement;
        /**
         * Gets or sets the content of the custom floating object.
         * @param {HTMLElement} content The content of the custom floating object.
         * @returns {Object} The content of the custom floating object.
         */
        Content(content?: HTMLElement): any;
    }

    export class CustomFormatterBase{
        /**
         * Represents a custom formatter with the specified format string.
         * @class
         * @param {string} format The format.
         * @param {string} cultureName The culture name.
         */
        constructor(format?: string, cultureName?: string);
        /**
         * Represents the type name string used for supporting serialization.
         * @type {string}
         */
        typeName: string;
        /**
         * Formats the specified object as a string with a conditional color. This function should be overwritten.
         * @param {Object} obj The object with cell data to format.
         * @param {Object} conditionalForeColor The conditional foreground color.
         * @returns {string} The formatted string.
         */
        Format(obj: any, conditionalForeColor?: any): string;
        /**
         * Loads the object state from the specified JSON string.
         * @param {Object} settings The custom formatter data from deserialization.
         */
        fromJSON(settings: Object): void;
        /**
         * Parses the specified text. This function should be overwritten.
         * @param {string} text The text.
         * @returns {Object} The parsed object.
         */
        Parse(str: string): any;
        /**
         * Saves the object state to a JSON string.
         * @returns {Object} The custom formatter data.
         */
        toJSON(): Object;
    }

    export class DataBarRule extends ScaleRule{
        /**
         * Represents a data bar conditional rule with the specified parameters.
         * @extends GcSpread.Sheets.ScaleRule
         * @param {GcSpread.Sheets.ScaleValueType} minType The minimum scale type.
         * @param {object} minValue The minimum scale value.
         * @param {GcSpread.Sheets.ScaleValueType} maxType The maximum scale type.
         * @param {object} maxValue The maximum scale value.
         * @param {string} color The fill color of the data bar.
         * @class
         */
        constructor(minType: ScaleValueType, minValue: any, maxType: ScaleValueType, maxValue: any, color: string);
        /**
         * Gets or sets the axis color of the data bar.
         * @param {string} value The axis color of the data bar.
         * @returns {string} The axis color of the data bar.
         */
        axisColor(value?: string): any;
        /**
         * Gets or sets the axis position of the data bar.
         * @param {GcSpread.Sheets.DataBarAxisPosition} value The axis position of the data bar.
         * @returns {GcSpread.Sheets.DataBarAxisPosition} The axis position of the data bar.
         */
        axisPosition(value?: DataBarAxisPosition): any;
        /**
         * Gets or sets the color of the border.
         * @param {string} value The color of the border.
         * @returns {string} The color of the border.
         */
        borderColor(value?: string): any;
        /**
         * Gets or sets the postive fill color of the data bar.
         * @param {string} value The fill color.
         * @returns {string} The postive fill color of the data bar.
         */
        color(value?: string): any;
        /**
         * Gets or sets the data bar direction.
         * @param {GcSpread.Sheets.BarDirection} value The data bar direction.
         * @returns {GcSpread.Sheets.BarDirection} The data bar direction.
         */
        dataBarDirection(value?: BarDirection): any;
        /**
         * Returns the specified value of the rule if the cell meets the condition.
         * @param {object} evaluator The evaluator.
         * @param {number} baseRow The row index.
         * @param {number} baseColumn The column index.
         * @param {object} actual The current value.
         * @returns {object} The specified value of the rule if the cell meets the condition.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actual: any): any;
        /**
         * Gets or sets a value that indicates whether the data bar is a gradient.
         * @param {boolean} value Whether the data bar is a gradient.
         * @returns {boolean} The value that indicates whether the data bar is a gradient.
         */
        gradient(value?: boolean): any;
        /**
         * Gets or sets the maximum scale type.
         * @param {object} value The scale type.
         * @returns {object} The maximum scale type.
         */
        maximumType(value?: any): any;
        /**
         * Gets or sets the maximum scale value.
         * @param {object} value The scale value.
         * @returns {object} The maximum scale value.
         */
        maximumValue(value?: any): any;
        /**
         * Gets or sets the minimum scale type.
         * @param {object} value The scale type.
         * @returns {object} The minimum scale type.
         */
        minimumType(value?: any): any;
        /**
         * Gets or sets the minimum scale value.
         * @param {object} value The scale value.
         * @returns {object} The minimum scale value.
         */
        minimumValue(value?: any): any;
        /**
         * Gets or sets the color of the negative border.
         * @param {string} value The color of the negative boreder.
         * @returns {string} The color of the negative border.
         */
        negativeBorderColor(value?: string): any;
        /**
         * Gets or sets the color of the negative fill.
         * @param {string} value The color of the negative fill.
         * @returns {string} The color of the negative fill.
         */
        negativeFillColor(value?: string): any;
        /**
         * Gets or sets whether to display the data bar without text.
         * @param {boolean} value Whether to display the data bar without text.
         * @returns {boolean} <c>true</c> if the widget displays the data bar without text; otherwise, <c>false</c>.
         */
        showBarOnly(value?: boolean): any;
        /**
         * Gets or sets a value that indicates whether to paint the border.
         * @param {boolean} value Whether to paint the border.
         * @returns {boolean} The value that indicates whether to paint the border.
         */
        showBorder(value?: boolean): any;
        /**
         * Gets or sets a value that indicates whether the negative border color is used to paint the border for the negative value.
         * @param {boolean} value Whether the negative border color is used to paint the border for the negative value.
         * @returns {boolean} The value that indicates whether the negative border color is used to paint the border for the negative value.
         */
        useNegativeBorderColor(value?: boolean): any;
        /**
         * Gets or sets a value that indicates whether the negative fill color is used to paint the negative value.
         * @param {boolean} value Whether the negative fill color is used to paint the negative value.
         * @returns {boolean} The value that indicates whether the negative fill color is used to paint the negative value.
         */
        useNegativeFillColor(value?: boolean): any;
    }

    export class DataContext{
        /**
         * Represents the data context intersection object.
         * @class
         * @param {string} read Reads the data function.
         * @param {string} create Creates the new data function.
         * @param {string} update Updates the changed data function.
         * @param {string} remove Removes the data function.
         */
        constructor(read: string, create: string, update: string, remove: string);
        /**
         * The URL to which to create data.
         * @type {string}
         */
        create: any;
        /**
         * The URL for which to read data.
         * @type {string}
         */
        read: any;
        /**
         * The URL for which to remove data.
         * @type {string}
         */
        remove: any;
        /**
         * The URL for which to update data.
         * @type {string}
         */
        update: any;
    }

    export class DateCondition{
        /**
         * Represents a date condition with the specified comparison type, expected date condition, and formula.
         * @class
         * @param {GcSpread.Sheets.DateCompareType} compareType The date comparison type.
         * @param {object} expected The expected date condition.
         * @param {string} formula The formula.
         */
        constructor(compareType: DateCompareType, expected: any, formula?: string);
        /** Gets or sets the type of the compare.
         * @type {GcSpread.Sheets.DateCompareType}
         */
        compareType: any;
        /** Gets or sets the expected date condition.
         * @type {GcSpread.Sheets.DateCompareType}
         */
        expected: any;
        /** The formula.
         * @type {string}
         */
        formula: any;
        /** Whether to ignore the blank cell.
         * @type {boolean}
         */
        ignoreBlank: boolean;
        /**
         * Evaluates the condition using the specified evaluator.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualObj The actual value object for evaluation.
         * @returns {boolean} <c>true</c> if the result is successful; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actualObj: any): boolean;
        /**
         * Gets the expected value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} basecol The base column index for evaluation.
         * @returns {object} The expected value.
         */
        getExpected(evaluator: any, baseRow: number, basecol: number): any;
        /**
         * Gets the expected date time value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @returns {object} The expected date time value.
         */
        getExpectedDateTime(evaluator: any, baseRow: number, basecol: number): any;
    }

    export class DateExCondition{
        /**
         * Represents a date condition with the specified comparison type, expected date condition, and formula.
         * @param {GcSpread.Sheets.DateOccurringType} type The rule type.
         * @param {GcSpread.Sheets.Style} style The cell style.
         * @class
         */
        constructor(expected?: DateOccurringType);
        /** The expected date occurring type.
         * @type {GcSpread.Sheets.DateOccurringType}
         */
        expected: any;
        /** The expected formula.
         * @type {string}
         */
        formula: string;
        /** Gets or sets a value that indicates whether to ignore the null value.
         * @type {boolean}
         */
        ignoreBlank: boolean;
        /**
         * Evaluates the condition using the specified evaluator.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualObj The actual value object for evaluation.
         * @returns {boolean} <c>true</c> if the result is successful; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actualObj: any): boolean;
        /**
         * Creates a DateExCondition object from the specified day.
         * @static
         * @param {number} day The day.
         * @returns {GcSpread.Sheets.DateExCondition} A DateExCondition object.
         */
        static fromDay(day: number): DateExCondition;
        /**
         * Creates a DateExCondition object from the specified month.
         * @static
         * @param {number} month The month. The first month is 0.
         * @returns {GcSpread.Sheets.DateExCondition} A DateExCondition object.
         */
        static fromMonth(month: number): DateExCondition;
        /**
         * Creates a DateExCondition object from the specified quarter.
         * @static
         * @param {GcSpread.Sheets.QuarterType} quarter The quarter.
         * @returns {GcSpread.Sheets.DateExCondition} A DateExCondition object.
         */
        static fromQuarter(quarter: number): DateExCondition;
        /**
         * Creates a DateExCondition object from the specified week.
         * @static
         * @param {number} week The week.
         * @returns {GcSpread.Sheets.DateExCondition} A DateExCondition object.
         */
        static fromWeek(week: number): DateExCondition;
        /**
         * Creates a DateExCondition object from the specified year.
         * @static
         * @param {number} year The year.
         * @returns {GcSpread.Sheets.DateExCondition} A DateExCondition object.
         */
        static fromYear(year: number): DateExCondition;
        /**
         * Gets the expected value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} basecol The base column index for evaluation.
         * @returns {object} The expected value.
         */
        getExpected(evaluator: any, baseRow: number, basecol: number): any;
        /**
         * Gets the expected integer value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @returns {number} The expected integer value.
         */
        getExpectedInt(evaluator: any, baseRow: number, baseColumn: number): number;
        /**
         * Resets this instance.
         */
        reset(): void;
    }

    export class DateOccurringRule extends ConditionRuleBase{
        /**
         * Represents a DateOccurringRule with the specified type and style.
         * @class
         * @extends GcSpread.Sheets.ConditionRuleBase
         * @param {GcSpread.Sheets.DateOccurringType} type The rule type.
         * @param {GcSpread.Sheets.Style} style The cell style.
         */
        constructor(type: DateOccurringType, style: Style);
        /** The rule type.
         * @type {GcSpread.Sheets.DateOccurringType}
         */
        type: any;
        /**
         * Creates a condition for the rule.
         * @returns {GcSpread.Sheets.DateExCondition} The condition for the rule.
         */
        createCondition(): DateExCondition;
        /**
         * Resets the rule.
         */
        reset(): void;
    }

    export class DefaultDataValidator{
        /**
         * Represents a data validator.
         * @class
         * @param {object} condition The condition.
         */
        constructor(condition?: any);
        /**
         * Indicates the comparison operator.
         * @type {GcSpread.Sheets.ComparisonOperator}
         */
        comparisonOperator: any;
        /**
         * Indicates the condition to validate.
         * @type {object}
         */
        condition: Object;
        /**
         * Indicates the error message.
         * @type {string}
         */
        errorMessage: string;
        /**
         * Indicates the error style to display.
         * @type {GcSpread.Sheets.ErrorStyle}
         */
        errorStyle: ErrorStyle;
        /**
         * Indicates the error title.
         * @type {string}
         */
        errorTitle: string;
        /**
         * Indicates whether to ignore an empty value.
         * @type {boolean}
         */
        ignoreBlank: boolean;
        /**
         * Indicates whether to display a drop-down button.
         * @type {boolean}
         */
        inCellDropdown: boolean;
        /**
         * Indicates the input message.
         * @type {string}
         */
        inputMessage: string;
        /**
         * Indicates the input title.
         * @type {string}
         */
        inputTitle: string;
        /**
         * Indicates whether to display an error message.
         * @type {boolean}
         */
        showErrorMessage: boolean;
        /**
         * Indicates whether to display the input title and input message.
         * @type {boolean}
         */
        showInputMessage: boolean;
        /**
         * Indicates the criteria type of this data validator.
         * @type {GcSpread.Sheets.CriteriaType}
         */
        type: CriteriaType;
        /**
         * Creates a validator based on the data.
         * @static
         * @param {GcSpread.Sheets.ComparisonOperator} typeOperator The type of ComparisonOperator compare operator.
         * @param {object} v1 The first object.
         * @param {object} v2 The second object.
         * @returns {GcSpread.Sheets.DefaultDataValidator} The validator.
         */
        static createDateValidator(typeOperator: any, v1: any, v2: any): DefaultDataValidator;
        /**
         * Creates a validator based on a formula list.
         * @static
         * @param {string} formula The formula list.
         * @returns {GcSpread.Sheets.DefaultDataValidator} The validator.
         */
        static createFormulaListValidator(formula: string): DefaultDataValidator;
        /**
         * Creates a validator based on a formula.
         * @static
         * @param {string} formula The formula condition.
         * @returns {GcSpread.Sheets.DefaultDataValidator} The validator.
         */
        static createFormulaValidator(formula: string): DefaultDataValidator;
        /**
         * Creates a validator based on a list.
         * @static
         * @param {string} source The list value.
         * @returns {GcSpread.Sheets.DefaultDataValidator} The validator.
         */
        static createListValidator(source: string): DefaultDataValidator;
        /**
         * Creates a validator based on numbers.
         * @static
         * @param {GcSpread.Sheets.ComparisonOperator} typeOperator The type of ComparisonOperator compare operator.
         * @param {object} v1 The first object.
         * @param {object} v2 The second object.
         * @param {boolean} isIntegerValue Set to <c>true</c> if the validator is set to a number.
         * @returns {GcSpread.Sheets.DefaultDataValidator} The validator.
         */
        static createNumberValidator(typeOperator: any, v1: any, v2: any, isIntegerValue: boolean): DefaultDataValidator;
        /**
         * Creates a validator based on text length.
         * @static
         * @param {GcSpread.Sheets.ComparisonOperator} typeOperator The type of ComparisonOperator compare operator.
         * @param {object} v1 The first object.
         * @param {object} v2 The second object.
         * @returns {GcSpread.Sheets.DefaultDataValidator} The validator.
         */
        static createTextLengthValidator(typeOperator: any, v1: any, v2: any): DefaultDataValidator;
        /**
         * Returns the valid data lists if the Data validation type is list; otherwise, returns null.
         * @param {object} evaluator The object that can evaluate a condition.
         * @param {number} baseRow The base row.
         * @param {number} baseColumn The base column.
         * @returns {Array} The valid data lists or null.
         */
        getValidList(evaluator: any, baseRow: number, baseColumn: number): any;
        /**
         * Gets or sets whether to ignore an empty value.
         * @param {boolean} value Whether to ignore the empty value.
         * @returns {boolean} <c>true</c> if the data validator ignores the empty value; otherwise, <c>false</c>.
         */
        IgnoreBlank(value?: boolean): any;
        /**
         * Determines whether the current value is valid.
         * @param {object} evaluator The evaluator.
         * @param {number} baseRow The base row.
         * @param {number} baseColumn The base column.
         * @param {object} actual The current value.
         * @returns {boolean} <c>true</c> if the value is valid; otherwise, <c>false</c>.
         */
        isValid(evaluator: any, baseRow: number, baseColumn: number, actual: any): boolean;
        /**
         * Resets the data validator.
         */
        reset(): void;
        /**
         * Gets the first value of the data validation.
         * @returns {object} The first value.
         */
        value1(): any;
        /**
         * Gets the second value of the data validation.
         * @returns {object} The second value.
         */
        value2(): any;
    }

    export class DuplicateRule extends ConditionRuleBase{
        /**
         * Represents a duplicate conditional rule.
         * @extends GcSpread.Sheets.ConditionRuleBase
         * @param {GcSpread.Sheets.Style} style The cell style.
         * @class
         */
        constructor(style: Style);
        /**
         * Creates a condition for the rule.
         * @returns {GcSpread.Sheets.UniqueCondition} The condition for the rule.
         */
        createCondition(): UniqueCondition;
    }

    export class Events{
        /**
         * Defines the events supported in SpreadJS.
         * @class
         */
        constructor();
        /**
         * Occurs when the user has changed the active sheet.
         * @name GcSpread.Sheets.Spread#ActiveSheetChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} oldSheet The old sheet.
         * @param {GcSpread.Sheets.Sheet} newSheet The new sheet.
         */
        static ActiveSheetChanged: any;
        /**
         * Occurs when the user is changing the active sheet.
         * @name GcSpread.Sheets.Spread#ActiveSheetChanging
         * @event
         * @param {GcSpread.Sheets.Sheet} oldSheet The old sheet.
         * @param {GcSpread.Sheets.Sheet} newSheet The new sheet.
         * @param {boolean} cancel A value that indicates whether the operation should be canceled.
         */
        static ActiveSheetChanging: any;
        /**
         * Occurs when the user clicks a button, check box, or hyperlink in a cell.
         * @name GcSpread.Sheets.Spread#ButtonClicked
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The row index of the cell.
         * @param {number} col The column index of the cell.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area that contains the cell.
         */
        static ButtonClicked: any;
        /**
         * Occurs when a change is made to a cell or range of cells in this sheet that may require the cell or range of cells to be repainted.
         * @name GcSpread.Sheets.Sheet#CellChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The row index of the cell.
         * @param {number} col The column index of the cell.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheetArea of the cell.
         * @param {string} propertyName The name of the cell's property that has changed.
         */
        static CellChanged: any;
        /**
         * Occurs when the user presses down the left mouse button in a cell.
         * @name GcSpread.Sheets.Sheet#CellClick
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area the clicked cell is in.
         * @param {number} row The row index of the clicked cell.
         * @param {number} col The column index of the clicked cell.
         */
        static CellClick: any;
        /**
         * Occurs when the user presses down the left mouse button twice (double clicks) in a cell.
         * @name GcSpread.Sheets.Sheet#CellDoubleClick
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area the clicked cell is in.
         * @param {number} row The row index of the clicked cell.
         * @param {number} col The column index of the clicked cell.
         */
        static CellDoubleClick: any;
        /**
         * Occurs when a Clipboard change occurs that affects SpreadJS.
         * @name GcSpread.Sheets.Sheet#ClipboardChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {string} copyData The data from SpreadJS that has been set into the clipboard.
         */
        static ClipboardChanged: any;
        /**
         * Occurs when the Clipboard is changing due to a SpreadJS action.
         * @name GcSpread.Sheets.Sheet#ClipboardChanging
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {string} copyData The data from SpreadJS that is set into the clipboard.
         * @param {boolean} cancel A value that indicates whether the operation should be canceled.
         */
        static ClipboardChanging: any;
        /**
         * Occurs when the user pastes from the Clipboard.
         * @name GcSpread.Sheets.Sheet#ClipboardPasted
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.Range} cellRange The range that was pasted.
         * @param {GcSpread.Sheets.ClipboardPasteOptions} pasteOption The paste option that indicates what data is pasted from the Clipboard: values, formatting, or formulas.
         */
        static ClipboardPasted: any;
        /**
         * Occurs when the user is pasting from the Clipboard.
         * @name GcSpread.Sheets.Sheet#ClipboardPasting
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.Range} cellRange The range to paste.
         * @param {GcSpread.Sheets.ClipboardPasteOptions} pasteOption The paste option that indicates what data is pasted from the Clipboard: values, formatting, or formulas.
         * @param {boolean} cancel A value that indicates whether the operation should be canceled.
         */
        static ClipboardPasting: any;
        /**
         * Occurs when a change is made to a column or range of columns in this sheet that may require the column or range of columns to be repainted.
         * @name GcSpread.Sheets.Sheet#ColumnChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheetArea of the column.
         * @param {string} propertyName The name of the column's property that has changed.
         */
        static ColumnChanged: any;
        /**
         * Occurs when the column width has changed.
         * @name GcSpread.Sheets.Sheet#ColumnWidthChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {Array} colList The list of columns whose widths have changed.
         * @param {boolean} header Whether the columns are row header columns.
         */
        static ColumnWidthChanged: any;
        /**
         * Occurs when the column width is changing.
         * @name GcSpread.Sheets.Sheet#ColumnWidthChanging
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {Array} colList The list of columns whose widths are changing.
         * @param {boolean} header Whether the columns are row header columns.
         * @param {boolean} cancel A value that indicates whether the operation should be canceled.
         */
        static ColumnWidthChanging: any;
        /**
         * Occurs when any comment has changed.
         * @name GcSpread.Sheets.Sheet#CommentChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.Comment} comment The comment that triggered the event.
         * @param {string} propertyName The name of the comment's property that has changed.
         */
        static CommentChanged: any;
        /**
         * Occurs when the custom floating object content is loaded.
         * @name GcSpread.Sheets.Sheet#CustomFloatingObjectLoaded
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.CustomFloatingObject} customFloatingObject The custom floating object that triggered the event.
         * @param {HTMLElement} element The HTMLElement of the custom floating object.
         */
        static CustomFloatingObjectLoaded: any;
        /**
         * Occurs when the user is dragging and dropping a range of cells.
         * @name GcSpread.Sheets.Sheet#DragDropBlock
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} fromRow The row index of the top left cell of the source range (range being dragged).
         * @param {number} fromCol The column index of the top left cell of the source range (range being dragged).
         * @param {number} toRow The row index of the top left cell of the destination range (where selection is dropped).
         * @param {number} toCol The column index of the bottom right cell of the destination range (where selection is dropped).
         * @param {number} rowCount The row count of the cell range being dragged.
         * @param {number} colCount The column count of the cell range being dragged.
         * @param {boolean} copy Whether the source range is copied.
         * @param {boolean} insert Whether the source range is inserted.
         * @param {GcSpread.Sheets.CopyToOption} copyOption The CopyOption value for the drag and drop operation.
         * @param {boolean} cancel A value that indicates whether the operation should be canceled.
         */
        static DragDropBlock: any;
        /**
         * Occurs when the user completes dragging and dropping a range of cells.
         * @name GcSpread.Sheets.Sheet#DragDropBlockCompleted
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} fromRow The row index of the top left cell of the source range (range being dragged).
         * @param {number} fromCol The column index of the top left cell of the source range (range being dragged).
         * @param {number} toRow The row index of the top left cell of the destination range (where selection is dropped).
         * @param {number} toCol The column index of the bottom right cell of the destination range (where selection is dropped).
         * @param {number} rowCount The row count of the cell range being dragged.
         * @param {number} colCount The column count of the cell range being dragged.
         * @param {boolean} copy Whether the source range is copied.
         * @param {boolean} insert Whether the source range is inserted.
         * @param {GcSpread.Sheets.CopyToOption} copyOption The CopyOption value for the drag and drop operation.
         */
        static DragDropBlockCompleted: any;
        /**
         * Occurs when the user is dragging to fill a range of cells.
         * @name GcSpread.Sheets.Sheet#DragFillBlock
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.Range} fillRange The range used for the fill operation.
         * @param {GcSpread.Sheets.AutoFillType} autoFillType AutoFillType value used for the fill operation.
         * @param {GcSpread.Sheets.FillDirection} fillDirection The direction of the fill.
         * @param {boolean} cancel A value that indicates whether the operation should be canceled.
         */
        static DragFillBlock: any;
        /**
         * Occurs when the user completes dragging to fill a range of cells.
         * @name GcSpread.Sheets.Sheet#DragFillBlockCompleted
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.Range} fillRange The range used for the fill operation.
         * @param {GcSpread.Sheets.AutoFillType} autoFillType AutoFillType value used for the fill operation.
         * @param {GcSpread.Sheets.FillDirection} fillDirection The direction of the fill.
         */
        static DragFillBlockCompleted: any;
        /**
         * Occurs when a cell is in edit mode and the text is changed.
         * @name GcSpread.Sheets.Sheet#EditChange
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The row index of cell.
         * @param {number} col The column index of cell.
         * @param {object} editingText The value from the current editor.
         */
        static EditChange: any;
        /**
         * Occurs when a cell leaved edit mode.
         * @name GcSpread.Sheets.Sheet#EditEnded
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The row index of cell.
         * @param {number} col The column index of cell.
         * @param {object} editingText The value from the current editor.
         */
        static EditEnded: any;
        /**
         * Occurs when a cell is leaving edit mode.
         * @name GcSpread.Sheets.Sheet#EditEnding
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The row index of cell.
         * @param {number} col The column index of cell.
         * @param {object} editor The current editor.
         * @param {object} editingText The value from the current editor.
         * @param {boolean} cancel A value that indicates whether the operation should be canceled.
         */
        static EditEnding: any;
        /**
         * Occurs when editor's status has changed.
         * @name GcSpread.Sheets.Sheet#EditorStatusChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.EditorStatus} oldStatus The old status of editor.
         * @param {GcSpread.Sheets.EditorStatus} newStatus The new status of editor.
         */
        static EditorStatusChanged: any;
        /**
         * Occurs when a cell is entering edit mode.
         * @name GcSpread.Sheets.Sheet#EditStarting
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The row index of cell.
         * @param {number} col The column index of cell.
         * @param {boolean} cancel A value that indicates whether the operation should be canceled.
         */
        static EditStarting: any;
        /**
         * Occurs when the focus enters a cell.
         * @name GcSpread.Sheets.Sheet#EnterCell
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The row index of the cell being entered.
         * @param {number} col The column index of the cell being entered.
         */
        static EnterCell: any;
        /**
         * Occurs when any floating object has changed.
         * @name GcSpread.Sheets.Sheet#FloatingObjectsChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.FloatingObject} floatingObject The floating object that triggered the event.
         * @param {string} propertyName The name of the floating object's property that has changed.
         */
        static FloatingObjectChanged: any;
        /**
         * Occurs when the selections of the floating object have changed.
         * @name GcSpread.Sheets.Sheet#FloatingObjectsSelectionChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.FloatingObject} floatingObject The floating object that triggered the event.
         */
        static FloatingObjectSelectionChanged: any;
        /**
         * Occurs when an invalid operation is performed.
         * @name GcSpread.Sheets.Sheet#InvalidOperation
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.InvalidOperationType} invalidType Indicates which operation was invalid.
         * @param {string} message The description of the invalid operation.
         */
        static InvalidOperation: any;
        /**
         * Occurs when the focus leaves a cell.
         * @name GcSpread.Sheets.Sheet#LeaveCell
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The row index of the cell being left.
         * @param {number} col The column index of the cell being left.
         * @param {boolean} cancel Whether the operation should be canceled.
         */
        static LeaveCell: any;
        /**
         * Occurs when the left column changes.
         * @name GcSpread.Sheets.Sheet#LeftColumnChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} oldLeftCol The old left column index.
         * @param {number} newLeftCol The new left column index.
         */
        static LeftColumnChanged: any;
        /**
         * Occurs when any picture has changed.
         * @name GcSpread.Sheets.Sheet#PictureChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.Picture} picture The picture that triggered the event.
         * @param {string} propertyName The name of the picture's property that has changed.
         */
        static PictureChanged: any;
        /**
         * Occurs when the selections of the picture have changed.
         * @name GcSpread.Sheets.Sheet#PictureSelectionChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.Picture} picture The picture that triggered the event.
         */
        static PictureSelectionChanged: any;
        /**
         * Occurs when the cell range has changed.
         * @name GcSpread.Sheets.Sheet#RangeChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The range's row index.
         * @param {number} column The range's column index.
         * @param {number} rowCount The range's row count.
         * @param {number} columnCount The range's column count.
         * @param {Array} changedCells The positions of the cells whose data has changed.
         * @param {GcSpread.Sheets.RangeChangedAction} action The type of action that raise the RangeChanged event.
         */
        static RangeChanged: any;
        /**
         * Occurs when a column has just been automatically filtered.
         * @name GcSpread.Sheets.Sheet#RangeFiltered
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} col The index of the column that was automatically filtered.
         * @param {Array} filterValues The values by which the column was filtered.
         */
        static RangeFiltered: any;
        /**
         * Occurs when a column is about to be automatically filtered.
         * @name GcSpread.Sheets.Sheet#RangeFiltering
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} col The index of the column to be automatically filtered.
         * @param {Array} filterValues The values by which to filter the column.
         */
        static RangeFiltering: any;
        /**
         * Occurs when the user has changed the state of outline (range group) for rows or columns.
         * @name GcSpread.Sheets.Sheet#RangeGroupStateChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {boolean} isRowGroup Whether the outline (range group) is a group of rows.
         * @param {number} index The index of the RangeGroupInfo object whose state has changed.
         * @param {number} level The level of the RangeGroupInfo object whose state has changed.
         */
        static RangeGroupStateChanged: any;
        /**
         * Occurs before the user changes the state of outline (range group) for rows or columns.
         * @name GcSpread.Sheets.Sheet#RangeGroupStateChanging
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {boolean} isRowGroup Whether the outline (range group) is a group of rows.
         * @param {number} index The index of the RangeGroupInfo object whose state is changing.
         * @param {number} level The level of the RangeGroupInfo object whose state is changing.
         * @param {boolean} cancel A value that indicates whether the operation should be canceled.
         */
        static RangeGroupStateChanging: any;
        /**
         * Occurs when a column has just been automatically sorted.
         * @name GcSpread.Sheets.Sheet#RangeSorted
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} col The index of the column that was automatically sorted.
         * @param {boolean} ascending Whether the automatic sort is ascending.
         */
        static RangeSorted: any;
        /**
         * Occurs when a column is about to be automatically sorted.
         * @name GcSpread.Sheets.Sheet#RangeSorting
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} col The index of the column to be automatically sorted.
         * @param {boolean} ascending Whether the automatic sort is ascending.
         */
        static RangeSorting: any;
        /**
         * Occurs when a change is made to a row or range of rows in this sheet that may require the row or range of rows to be repainted.
         * @name GcSpread.Sheets.Sheet#RowChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The row index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheetArea of the row.
         * @param {string} propertyName The name of the row's property that has changed.
         */
        static RowChanged: any;
        /**
         * Occurs when the row height has changed.
         * @name GcSpread.Sheets.Sheet#RowHeightChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {Array} rowList The list of rows whose heights have changed.
         * @param {boolean} header Whether the columns are column header columns.
         */
        static RowHeightChanged: any;
        /**
         * Occurs when the row height is changing.
         * @name GcSpread.Sheets.Sheet#RowHeightChanging
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {Array} rowList The list of rows whose heights are changing.
         * @param {boolean} header Whether the columns are column header columns.
         * @param {boolean} cancel A value that indicates whether the operation should be canceled.
         */
        static RowHeightChanging: any;
        /**
         * Occurs when the selection of cells on the sheet has changed.
         * @name GcSpread.Sheets.Sheet#SelectionChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         */
        static SelectionChanged: any;
        /**
         * Occurs when the selection of cells on the sheet is changing.
         * @name GcSpread.Sheets.Sheet#SelectionChanging
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {Array} oldSelections The old selection ranges.
         * @param {Array} newSelections The new selection ranges.
         */
        static SelectionChanging: any;
        /**
         * Occurs when the user has changed the sheet name.
         * @name GcSpread.Sheets.Sheet#SheetNameChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} oldValue The sheet's old name.
         * @param {string} newValue The sheet's new name.
         */
        static SheetNameChanged: any;
        /**
         * Occurs when the user is changing the sheet name.
         * @name GcSpread.Sheets.Sheet#SheetNameChanging
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} oldValue The sheet's old name.
         * @param {string} newValue The sheet's new name.
         * @param {boolean} cancel A value that indicates whether the operation should be canceled.
         */
        static SheetNameChanging: any;
        /**
         * Occurs when the user clicks the sheet tab.
         * @name GcSpread.Sheets.Sheet#SheetTabClick
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} sheetTabIndex The index of the sheet tab that the user clicked.
         */
        static SheetTabClick: any;
        /**
         * Occurs when the user double-clicks the sheet tab.
         * @name GcSpread.Sheets.Sheet#SheetTabDoubleClick
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} sheetTabIndex The index of the sheet tab that the user double-clicked.
         */
        static SheetTabDoubleClick: any;
        /**
         * Occurs when the sparkline has changed.
         * @name GcSpread.Sheets.Sheet#SparklineChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.Sparkline} sparkline The sparkline whose property has changed.
         */
        static SparklineChanged: any;
        /**
         * Occurs when a table column has just been automatically filtered.
         * @name GcSpread.Sheets.Sheet#TableFiltered
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.SheetTable} table The table of the column to be automatically filtered belong to.
         * @param {number} col The index of the table column to be automatically filtered.
         * @param {Array} filterValues The values by which to filter the column.
         */
        static TableFiltered: any;
        /**
         * Occurs when a table column is about to be automatically filtered.
         * @name GcSpread.Sheets.Sheet#TableFiltering
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {GcSpread.Sheets.SheetTable} table The table of the column to be automatically filtered belong to.
         * @param {number} col The index of the table column to be automatically filtered.
         * @param {Array} filterValues The values by which to filter the column.
         */
        static TableFiltering: any;
        /**
         * Occurs when the top row changes.
         * @name GcSpread.Sheets.Sheet#TopRowChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} oldTopRow The old top row index.
         * @param {number} newTopRow The new top row index.
         */
        static TopRowChanged: any;
        /**
         * Occurs before the touch toolbar pops up.
         * @name GcSpread.Sheets.Sheet#TouchToolStripOpening
         * @event
         * @param {number} x The <i>x</i>-coordinate of the horizontal position.
         * @param {number} y The <i>y</i>-coordinate of the vertical position.
         * @param {boolean} handled If <c>true</c>, the touch toolbar is prevented from popping up; otherwise, the toolbar is displayed at the default position.
         */
        static TouchToolStripOpening: any;
        /**
         * Occurs when the user types a formula.
         * @name GcSpread.Sheets.Sheet#UserFormulaEntered
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The row index of the cell in which the user entered a formula.
         * @param {number} col The column index of the cell in which the user entered a formula.
         * @param {string} formula The formula that the user entered.
         */
        static UserFormulaEntered: any;
        /**
         * Occurs when the user zooms.
         * @name GcSpread.Sheets.Sheet#UserZooming
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} oldZoomFactor The new zoom factor.
         * @param {number} newZoomFactor The old zoom factor.
         */
        static UserZooming: any;
        /**
         * Occurs when the applied cell value is invalid.
         * @name GcSpread.Sheets.Sheet#ValidationError
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The cell's row index.
         * @param {number} col The cell's column index.
         * @param {GcSpread.Sheets.DefaultDataValidator} validator The data validator that caused the error.
         * @param {GcSpread.Sheets.DataValidationResult} validationResult The policy that the user can set to determine how to process the error.
         */
        static ValidationError: any;
        /**
         * Occurs when the value in the subeditor changes.
         * @name GcSpread.Sheets.Sheet#ValueChanged
         * @event
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that triggered the event.
         * @param {string} sheetName The sheet's name.
         * @param {number} row The row index of the cell.
         * @param {number} col The column index of the cell.
         */
        static ValueChanged: any;
    }

    export class FloatingObject{
        /**
         * Represents a floating object.
         * @class
         * @param {string} name The name of the floating object.
         * @param {number} x The <i>x</i> location of the floating object.
         * @param {number} y The <i>y</i> location of the floating object.
         * @param {number} width The width of the floating object.
         * @param {number} height The height of the floating object.
         * @remarks
         * This is a base class that is intended for internal use.
         */
        constructor(name?: string, x?: number, y?: number, width?: number, height?: number);
        /**
         * Gets or sets whether the object moves when hiding or showing, resizing, or moving rows or columns.
         * @param {boolean} isDynamicMove The value indicates whether the object moves when hiding or showing, resizing, or moving rows or columns.
         * @returns {Object} <c>true</c> if the object dynamically moves; otherwise, <c>false</c>.
         */
        dynamicMove(isDynamicMove?: boolean): any;
        /**
         * Gets or sets whether the size of the object changes when hiding or showing, resizing, or moving rows or columns.
         * @param {boolean} isDynamicSize The value indicates whether the size of the object changes when hiding or showing, resizing, or moving rows or columns.
         * @returns {Object} <c>true</c> if the object dynamically changes size; otherwise, <c>false</c>.
         */
        dynamicSize(isDynamicSize?: boolean): any;
        /**
         * Gets or sets the end column index of the floating object position.
         * @param {number} column The end column index of the floating object position.
         * @returns {Object} The end column index of the floating object position.
         */
        endColumn(column?: number): any;
        /**
         * Gets or sets the offset relative to the end column of the floating object.
         * @param {number} offset The offset relative to the end column of the floating object.
         * @returns {Object} The offset relative to the end column of the floating object.
         */
        endColumnOffset(offset?: number): any;
        /**
         * Gets or sets the end row index of the floating object position.
         * @param {number} row The end row index of the floating object position.
         * @returns {Object} The end row index of the floating object position.
         */
        endRow(row?: number): any;
        /**
         * Gets or sets the offset relative to the end row of the floating object.
         * @param {number} offset The offset relative to the end row of the floating object.
         * @returns {Object} The offset relative to the end row of the floating object.
         */
        endRowOffset(offset?: number): any;
        /**
         * Gets or sets the height of a floating object.
         * @param {number} value The height of a floating object.
         * @returns {Object} The height of a floating object.
         */
        height(value?: number): any;
        /**
         * Gets or sets a value that indicates whether this floating object is locked.
         * @param {boolean} locked The value that indicates whether this floating object is locked.
         * @returns {Object} <c>true</c> if locked; otherwise, <c>false</c>.
         */
        isLocked(locked?: boolean): any;
        /**
         * Gets or sets a value that indicates whether this floating object is selected.
         * @param {boolean} selected The value that indicates whether this floating object is selected.
         * @returns {Object} <c>true</c> if this floating object is selected; otherwise, <c>false</c>.
         */
        isSelected(selected?: boolean): any;
        /**
         * Gets or sets a value that indicates whether this floating object is visible.
         * @param {boolean} isVisible The value that indicates whether this floating object is visible.
         * @returns {Object} <c>true</c> if visible; otherwise, <c>false</c>.
         */
        isVisible(isVisible?: boolean): any;
        /**
         * Gets the name of the floating object.
         * @param {string} value The name of the floating object.
         * @returns {string} The name of the floating object.
         */
        name(value?: string): any;
        /**
         * Gets or sets the position of a floating object.
         * @param {GcSpread.Sheets.Point} position The position of a floating object.
         * @returns {Object} The position of a floating object.
         */
        position(position?: Point): any;
        /**
         * Gets or sets the starting column index of the floating object position.
         * @param {number} column The starting column index of the floating object position.
         * @returns {Object} The starting column index of the floating object position.
         */
        startColumn(column?: number): any;
        /**
         * Gets or sets the offset relative to the start column of the floating object.
         * @param {number} offset The offset relative to the start column of the floating object.
         * @returns {Object} The offset relative to the start column of the floating object.
         */
        startColumnOffset(offset?: number): any;
        /**
         * Gets or sets the starting row index of the floating object position.
         * @param {number} row The starting row index of the floating object position.
         * @returns {Object} The starting row index of the floating object position.
         */
        startRow(row?: number): any;
        /**
         * Gets or sets the offset relative to the start row of the floating object.
         * @param {number} offset The offset relative to the start row of the floating object.
         * @returns {Object} The offset relative to the start row of the floating object.
         */
        startRowOffset(offset?: number): any;
        /**
         * Gets or sets the width of a floating object.
         * @param {number} value The width of a floating object.
         * @returns {Object} The width of a floating object.
         */
        width(value?: number): any;
    }

    export class FontFactory{
        /**
         * Represents the font factory.
         * @class
         * @param {GcSpread.Sheets.Sheet} sheet The sheet for the font.
         */
        constructor(sheet: any);
        /**
         * Builds a font.
         * @param opt The option.
         * @param {string} font The font.
         * @returns {string} The font.
         */
        buildFont(opt: any, font: string): string;
    }

    export class FormatConverter{
        /**
         * Represents the converting of a value to a specified data type.
         * @class
         */
        constructor();
        /**
         * Determines whether the specified value is a number, DateTime, or TimeSpan value.
         * @param {Object} value The value for which to determine the number type.
         * @returns {boolean} <c>true</c> if the value is a number; otherwise, <c>false</c>.
         */
        static IsNumber(value: any): boolean;
        /**
         * Converts the value to a double type.
         * @param {Object} value The value to convert to the number type.
         * @returns {number} The converted number.
         */
        static ToDouble(value: any): number;
        /**
         * Converts the specified value to a string representation.
         * @param {Object} value The value to convert to string type.
         * @returns {number} The converted string.
         */
        static toString(value: Object): string;
    }

    export class FormulaCondition{
        /**
         * Represents a custom condition with a specified formula or expression.
         * @class
         * @param {GcSpread.Sheets.CustomValueType} customValueType The type of the custom value.
         * @param {string} formula The formula string or expression.
         */
        constructor(customValueType: CustomValueType, formula: string);
        /** Gets or sets the type of the custom value.
         * @type {GcSpread.Sheets.CustomValueType}
         */
        customValueType: any;
        /** The expected formula.
         * @type {string}
         */
        formula: any;
        /** Gets or sets a value that indicates whether to ignore the null value.
         * @type {boolean}
         */
        ignoreBlank: boolean;
        /**
         * Evaluates the condition using the specified evaluator.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualObj The actual value object for evaluation.
         * @returns {boolean} <c>true</c> if the result is successful; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actualObj: any): boolean;
        /**
         * Gets the expected value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseCol The base column index for evaluation.
         * @returns {object} The expected value.
         */
        getExpected(evaluator: any, baseRow: number, baseCol: number): any;
        /**
         * Resets this instance.
         */
        reset(): void;
    }

    export class FormulaInformation{
        /**
         * Represents the formula information for a cell.
         * @class
         * @param {string} name The name of the sheet.
         * */
        constructor();
        /**
         * Indicates the base range of the array formula.
         * @type {GcSpread.Sheets.Range}
         */
        baseRange: Range;
        /**
         * Indicates the formula string for the cell.
         * @type {string}
         */
        formula: string;
        /**
         * Indicates whether there is a formula in the cell.
         * @type {boolean}
         */
        hasFormula: boolean;
        /**
         * Indicates whether the formula in the cell is an array formula.
         * @type {boolean}
         */
        isArrayFormula: boolean;
    }

    export class FormulaRule extends ConditionRuleBase{
        /**
         * Represents a formula rule with the specified formula and style.
         * @extends GcSpread.Sheets.ConditionRuleBase
         * @param {string} formula The formula.
         * @param {GcSpread.Sheets.Style} style The cell style.
         * @class
         */
        constructor(formula: string, style: Style);
        /** Gets the comparison formula of the text rule.
         * @type {string}
         */
        formula: any;
        /**
         * Creates the condition for the rule.
         * @returns {GcSpread.Sheets.FormulaCondition} The condition for the rule.
         */
        createCondition(): FormulaCondition;
        /**
         * Resets the rule.
         */
        reset(): void;
    }

    export class FormulaTextBox{
        /**
         * Represents a formula text box.
         * @class
         * @param {Object} host The DOM element. It can be INPUT, TEXTAREA, or editable DIV.
         */
        constructor(host: any, spread?: Spread);
        /**
         * Adds a custom function description.
         * @param {Object} fnd The function description to add. This can be an array. See the Remarks for more information.
         */
        add(fnd: any): any;
        /**
         * Gets or sets whether the text box uses auto complete.
         * @param {boolean} value Whether to auto complete when editing.
         * @returns {Object} <c>true</c> if the text box uses auto complete; otherwise, <c>false</c>.
         */
        autoComplete(value?: boolean): any;
        /**
         * Binds an event.
         * @param {string} type The event type.
         * @param {Object} data Optional. Specifies additional data to pass along to the function.
         * @param {Function} fn Specifies the function to run when the event occurs.
         */
        bind(type: string, data?: any, fn?: Function): void;
        /**
         * Gets or sets the cursor position.
         * @param {number} value The cursor position.
         */
        caret(value?: number): any;
        /**
         *Removes host from formula text box and removes all binding events.
         */
        destroy(): void;
        /**
         * Removes a custom function description.
         * @param {string} name The custom function description name.
         */
        remove(name: string): void;
        /**
         * Gets or sets whether to display the function's help tip.
         * @param {boolean} value Whether to display the function's help tip when editing.
         * @returns {Object} <c>true</c> if the text box displays the function's help tip when editing; otherwise, <c>false</c>.
         */
        showHelp(value?: boolean): any;
        /**
         * Gets or sets the Spread widget to work with the formula text box.
         * @param {Object} value The Spread widget.
         */
        spread(value: Spread): any;
        /**
         * Gets or sets the text.
         * @param {string} value The text.
         */
        text(value?: string): any;
        /**
         * Removes the binding of an event.
         * @param {string} type The event type.
         * @param {Function} fn Specifies the function for which to remove the binding.
         */
        unbind(type: string, fn?: Function): void;
        /**
         * Removes the binding of all events.
         */
        unbindAll(): any;
    }

    export class GcSpreadSheetsOptions{
        /**
         * GcSpread.Sheets options.
         * @class
         */
        constructor();
        /**
         * Represents the active sheet index.
         * @type {number}
         */
        activeSheetIndex: any;
        /**
         * Represents whether to allow end user resizing of columns and rows.
         * @type {boolean}
         */
        allowUserResize: any;
        /**
         * Represents whether to allow end user zoom.
         * @type {boolean}
         */
        allowUserZoom: any;
        /**
         * Font used for sheet tab text.
         * @type {string}
         */
        font: any;
        /**
         * Represents the name of the Spread control.
         * @type {string}
         */
        name: any;
        /**
         * Represents whether the new tab is visible.
         * @type {boolean}
         */
        newTabVisible: any;
        /**
         * Gets the number of sheets.
         * @type {number}
         */
        sheetCount: any;
        /**
         * Represents the sheet collection.
         * @type {Array} The GcSpread.Sheets.Sheet Array.
         */
        sheets: any;
        /**
         * Represents whether to allow the end user to edit the sheet name in the tab.
         * @type {boolean}
         */
        tabEditable: any;
        /**
         * Represents the width of the tab.
         * @type {number}
         */
        tabStripRatio: any;
        /**
         * Represents whether the tab strip is visible.
         * @type {boolean}
         */
        tabStripVisible: any;
    }

    export class GeneralFormatter{
        /**
         * Represents a formatter with the specified format mode and format string.
         * @class
         * @param {string} format The format.
         * @param {GcSpread.Sheets.FormatMode} formatMode The format mode.
         * @param {string} cultureName The culture name.
         */
        constructor(format?: string, formatMode?: FormatMode, cultureName?: string);
        /** Occurs when a formatter property is changed. */
        PropertyChanged: Function[];
        /**
         * Gets the Excel-compatible format string.
         * @returns {string} The Excel-compatible format string. The default value is an empty string.
         */
        ExcelCompatibleFormatString(): string;
        /**
         * Formats the specified object as a string with a conditional color.
         * @param {Object} obj The object with cell data to format.
         * @param {Object} conditionalForeColor The conditional foreground color.
         * @returns {string} The formatted string.
         */
        Format(obj: any, conditionalForeColor?: any): string;
        /**
         * Gets the format mode for this formatter.
         * @param {GcSpread.Sheets.FormatMode} value The format mode for this formatter.
         * @returns {GcSpread.Sheets.FormatMode} The format mode for this formatter. The default value is FormatMode.CustomMode.
         */
        FormatMode(value?: FormatMode): FormatMode;
        /**
         * Gets the format string for this formatter.
         * @param {string} value The format string for this formatter.
         * @returns {string} The format string for this formatter. The default value is "General".
         */
        FormatString(value?: string): string;
        /**
         * Gets the preferred formatter type for a specified object.
         * @param {Object} obj The object value to format.
         * @returns {GcSpread.Sheets.NumberFormatType} The NumberFormatType enumeration that specifies the format type.
         */
        GetFormatType(obj: any): NumberFormatType;
        /**
         * Gets the preferred display format string.
         * @param {string} s The formatted data string.
         * @param {Object} valueRef The parsed value.
         * @returns {GcSpread.Sheets.NumberFormatType} The preferred formatter for the string.
         */
        GetPreferredDisplayFormatter(s: string, valueRef: { value: any }): GeneralFormatter;
        /**
         * Gets the preferred editing formatter.
         * @param {Object} obj The object value to format.
         * @returns {Object} The preferred editing formatter for the object.
         */
        GetPreferredEditingFormatter(obj: any): Object;
        /**
         * Gets a value that indicates whether this formatted text contains a foreground color.
         * @returns {boolean} <c>true</c> if this formatted text contains a foreground color; otherwise, <c>false</c>.
         */
        HasFormatedColor(): boolean;
        /**
         * Gets a value that indicates whether this formatter is the default formatter.
         * @returns {boolean} <c>true</c> if this formatter is the default formatter; otherwise, <c>false</c>.
         */
        IsDefaultFormat(): boolean;
        /**
         * Parses the specified text.
         * @param {string} text The text.
         * @returns {Object} The parsed object.
         */
        Parse(str: string): any;
    }

    export class GroupedItemIndexEnumerator{
        /**
         * Represents an enumerator for all items of groups from beginning to end.
         * @param {object} style The rangeGroup.
         * @class
         */
        constructor(rangeGroup: any);
    }

    export class HBarSparkline{
        /**
         * Represents the class for the Hbar sparkline.
         * @extends GcSpread.Sheets.SparklineEx
         * @class
         */
        constructor();
    }

    export class HideRowFilter extends RowFilterBase{
        /**
         * Represents a default row filter.
         * @class GcSpread.Sheets.HideRowFilter
         * @extends GcSpread.Sheets.RowFilterBase
         * @param {GcSpread.Sheets.Range} range The filter range.
         */
        constructor(range?: Range);
        /**
         * Determines whether the filter is HideRowFilter.
         * @returns {boolean} <c>true</c> if the filter is HideRowFilter; otherwise, <c>false</c>.
         */
        isHideRowFilter(): boolean;
    }

    export class HyperLinkCellType{
        /**
         * Represents the hyperlink cell.
         * @extends GcSpread.Sheets.TextCellType
         * @class
         */
        constructor();
        /**
         * Gets or sets the color of the hyperlink.
         * @param {string} value The hyperlink color.
         * @returns {string} The hyperlink color.
         */
        linkColor(value?: string): any;
        /**
         * Gets or sets the tooltip for the hyperlink.
         * @param {string} value The tooltip text.
         * @returns {string} The tooltip text.
         */
        linkToolTip(value?: string): any;
        /**
         *  Gets or sets the type for the hyperlink's target.
         * @param {GcSpread.Sheets.HyperLinkTargetType} value The hyperlink's target type.
         * @returns {GcSpread.Sheets.HyperLinkTargetType} The hyperlink's target type.
         */
        target(value?: HyperLinkTargetType): any;
        /**
         * Gets or sets the text string for the hyperlink.
         * @param {string} value The text displayed in the hyperlink.
         * @returns {string} The text in the hyperlink.
         */
        text(value?: string): any;
        /**
         * Gets or sets the color of visited links.
         * @param {string} value The visited link color.
         * @returns {string} The visited link color.
         */
        visitedLinkColor(value?: string): any;
    }

    export class IconCriterion{
        /**
         * Represents an icon criteria with the specified parameters.
         * @class
         * @param {boolean} isGreaterThanOrEqualTo If set to true, use the greater than or equal to operator to calculate the value.
         * @param {GcSpread.Sheets.IconValueType} iconValueType The type of scale value.
         * @param {object} iconValue The scale value.
         */
        constructor(isGreaterThanOrEqualTo: boolean, iconValueType: IconValueType, iconValue: any);
    }

    export class IconSetRule extends ScaleRule{
        /**
         * Represents an icon set rule with the specified parameters.
         * @class
         * @extends GcSpread.Sheets.ScaleRule
         * @param {GcSpread.Sheets.IconSetType} iconSetType The type of icon set.
         */
        constructor(iconSetType: IconSetType);
        /**
         * Returns the specified value of the rule if the cell meets the condition.
         * @param {object} evaluator The evaluator.
         * @param {number} baseRow The row index.
         * @param {number} baseColumn The column index.
         * @param {object} actual The current value.
         * @returns {object} The specified value of the rule if the cell meets the condition.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actual: any): any;
        /**
         * Gets the icon based on the specific iconSetType and iconIndex.
         * @static
         * @param {GcSpread.Sheets.IconSetType} iconSetType The icon set type.
         * @param {number} iconIndex The icon index.
         * returns {object} An object that contains the image's URL string, the offset, and width and height.
         * If the user wants to customize the icon for IconSet, it returns the image URL string.
         */
        static getIcon(iconSetType: IconSetType, iconIndex: number): any;
        /**
         * Gets the icon criteria.
         * @returns {Array} Returns the icon criterias whose item type is GcSpread.Sheets.IconCriterion.
         */
        iconCriteria(): IconCriterion[];
        /**
         * Gets or sets the type of icon set.
         * @param {GcSpread.Sheets.IconSetType} value The type of icon set.
         * @returns {GcSpread.Sheets.IconSetType} The type of icon set.
         */
        iconSetType(value?: IconSetType): any;
        /**
         * Resets the rule.
         */
        reset(): void;
        /**
         * Gets or sets whether to reverse icon order.
         * @param {boolean} value Whether to reverse icon order.
         * @returns {boolean} The value that indicates whether to reverse icon order.
         */
        reverseIconOrder(value?: boolean): any;
        /**
         * Gets or sets whether to display the icon only.
         * @param {boolean} value Whether to display the icon only.
         * @returns {boolean} The value that indicates whether to display the icon only.
         */
        showIconOnly(value?: boolean): any;
    }

    export class KeyMap{
        /**
         * Represents a key map, which maps a key event to a Spread action.
         * @class
         * @param {GcSpread.Sheets.Key} key The key code.
         * @param {boolean} ctrl Whether the Ctrl key is pressed.
         * @param {boolean} shift Whether the Shift key is pressed.
         * @param {boolean} alt Whether the Alt key is pressed.
         * @param {boolean} meta Whether the Command key on the Macintosh or the Windows key on Microsoft Windows is pressed.
         * @param {GcSpread.Sheets.Function} action The function to be invoked.
         */
        constructor(key: Key, ctrl: boolean, shift: boolean, alt: boolean, meta: boolean, action: any);
    }

    export class LineBorder{
        /**
         * Represents the line style for a border side.
         * @class
         * @param {string} color Indicates the border color and uses a format such as color name (for example, "red") or "#RGB", "#RRGGBB", "rgb(R,B,B)", "rgba(R,G,B,A)".
         * @param {GcSpread.Sheets.LineStyle} style Indicates the border line style.
         */
        constructor(color?: string, style?: LineStyle);
        /**
         * Indicates the color of the border line. Use a known color name or HEX style color value. The default value is black.
         */
        color: string;
        /**
         * Indicates the line style of the border line. The default value is empty.
         */
        style: LineStyle;
        /**
         * Gets the width of the current border line.
         * @param {GcSpread.Sheets.LineBorder} border The border line.
         * @returns {number} The width of the border line.
         */
        width(border: LineBorder): number;
    }

    export class NameInfo{
        /**
         * Represents a custom named expression that can be used by formulas.
         * @class
         * @param {string} name The custom expression name.
         * @param {Object} expr The custom named expression.
         * @param {number} row The base row of the expression.
         * @param {number} column The base column of the expression.
         */
        constructor(name: string, expr: any, row: number, column: number);
        /**
         * Gets the base column of the custom named expression.
         * @returns {number} The base column.
         */
        getColumn(): number;
        /**
         * Gets the expression.
         * @returns {Object} The expression.
         */
        getExpression(): any;
        /**
         * Gets the name of the current NameInfo object.
         * @returns {string} The name of the current NameInfo object.
         */
        getName(): string;
        /**
         * Gets the base row of the custom named expression.
         * @returns {number} The base row.
         */
        getRow(): number;
    }

    export class NumberCondition{
        /**
         * Represents a number condition of the specified type with the specified expected value.
         * @class
         * @param {GcSpread.Sheets.GeneralCompareType} compareType The number comparison type.
         * @param {number} expected The expected number.
         * @param {string} formula The expected formula.
         */
        constructor(compareType: GeneralCompareType, expected: number, formula?: string);
        /** The type of the comparison.
         * @type {GcSpread.Sheets.GeneralCompareType}
         */
        compareType: GeneralCompareType;
        /** The expected number.
         * @type {number}
         */
        expected: any;
        /** The expected formula.
         * @type {string}
         */
        formula: any;
        /** A value that indicates whether to ignore the null value.
         * @type {boolean}
         */
        ignoreBlank: boolean;
        /**
         * Evaluates the condition using the specified evaluator.
         * @constructor
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualValue The actual value object for evaluation.
         * @returns {boolean} <c>true</c> if the result is successful; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, basecol: number, actualValue: any): boolean;
        /**
         * Gets the expected value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} basecol The base column index for evaluation.
         * @returns {object} The expected value.
         */
        getExpected(evaluator: any, baseRow: number, basecol: number): any;
        /**
         * Resets this instance.
         */
        reset(): void;
    }

    export class Padding{
        /**
         * Represents the padding information.
         * @class
         * @param {number} top The top padding.
         * @param {number} right The right padding.
         * @param {number} bottom The bottom padding.
         * @param {number} left The left padding.
         */
        constructor(top: number, right?: number, bottom?: number, left?: number);
        /**
         * Indicates the bottom padding.
         */
        bottom: number;
        /**
         * Indicates the left padding.
         */
        left: number;
        /**
         * Indicates the right padding.
         */
        right: number;
        /**
         * Indicates the top padding.
         */
        top: number;
    }

    export class ParetoSparkline{
        /**
         * Represents the class for the pareto sparkline.
         * @extends GcSpread.Sheets.SparklineEx
         * @class
         */
        constructor();
    }

    export class Picture extends FloatingObject{
        /**
         * Represents a picture.
         * @extends GcSpread.Sheets.FloatingObject
         * @class
         * @param {string} name The name of the picture.
         * @param {string} src The image source of the picture.
         * @param {number} x The <i>x</i> location of the picture.
         * @param {number} y The <i>y</i> location of the picture.
         * @param {number} width The width of the picture.
         * @param {number} height The height of the picture.
         */
        constructor(name?: string, src?: string, x?: number, y?: number, width?: number, height?: number);
        /**
         * Gets or sets the back color of the picture.
         * @param {string} value The back color of the picture.
         * @returns {Object} The back color of the picture.
         */
        backColor(value?: string): any;
        /**
         * Gets or sets the border color of the picture.
         * @param {string} src The border color of the picture.
         * @returns {Object} The border color of the picture.
         */
        borderColor(value?: string): any;
        /**
         * Gets or sets the border radius of the picture.
         * @param {number} value The border radius of the picture.
         * @returns {Object} The border radius of the picture.
         */
        borderRadius(value?: number): any;
        /**
         * Gets or sets the border style of the picture.
         * @param {string} value The css border style of the picture, such as dotted, dashed, solid, and so on.
         * @returns {Object} The border style of the picture.
         */
        borderStyle(value?: string): any;
        /**
         * Gets or sets the border width of the picture.
         * @param {number} value The border width of the picture.
         * @returns {Object} The border width of the picture.
         */
        borderWidth(value?: number): any;
        /**
         * Gets the original height of the picture.
         * @returns {number} The original height of the picture.
         */
        getOriginalHeight(): number;
        /**
         * Gets the original width of the picture.
         * @returns {number} The original width of the picture.
         */
        getOriginalWidth(): number;
        /**
         * Gets or sets the stretch of the picture.
         * @param {GcSpread.Sheets.ImageLayout} value The stretch of the picture.
         * @returns {Object} The stretch of the picture.
         */
        pictureStretch(value?: ImageLayout): any;
        /**
         * Gets or sets the src of the picture.
         * @param {string} value The src of the picture.
         * @returns {Object} The src of the picture.
         */
        src(value?: string): any;
    }

    export class PieSparkline extends SparklineEx{
        /**
         * Represents the class for the pie sparkline.
         * @extends GcSpread.Sheets.SparklineEx
         * @class
         */
        constructor();
    }

    export class Point{
        /**
         * Represents an <i>x</i>- and <i>y</i>-coordinate pair in two-dimensional space.
         * @class
         * @param {number} x The <i>x</i>-coordinate.
         * @param {number} y The <i>y</i>-coordinate.
         */
        constructor(x: number, y: number);
        /**
         * Clones a new point from the current point.
         * @returns {GcSpread.Sheets.Point} The cloned object.
         */
        clone(): Point;
    }

    export class Range{
        /**
         * Represents a range, which is described by the row index, column index, row count, and column count.
         * @class
         * @param {number} r The row index.
         * @param {number} c The column index.
         * @param {number} rc The row count.
         * @param {number} cc The column count.
         */
        constructor(r: number, c: number, rc: number, cc: number);
        /**
         * The column index.
         */
        col: any;
        /**
         * The column count.
         */
        colCount: any;
        /**
         * The row index.
         */
        row: any;
        /**
         * The row count.
         */
        rowCount: any;
        /**
         * Gets whether the current range contains the specified cell.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {number} rowCount The row count.
         * @param {number} colCount The column count.
         * @returns {boolean} <c>true</c> if the range contains the cell; otherwise, <c>false</c>.
         */
        contains(row: number, col: number, rowCount?: number, colCount?: number): boolean;
        /**
         * Gets whether the current range contains the specified range.
         * @param {GcSpread.Sheets.Range} range The cell range.
         * @returns {boolean} <c>true</c> if the current range contains the specified cell range; otherwise, <c>false</c>.
         */
        containsRange(range: Range): boolean;
        /**
         * Gets whether the current range is equal to the specified range.
         * @param {GcSpread.Sheets.Range} range The range to compare.
         * @returns {boolean} <c>true</c> if the current range is equal to the specified range; otherwise, <c>false</c>.
         */
        equals(range: Range): boolean;
        /**
         * Gets the intersection of two cell ranges.
         * @param {GcSpread.Sheets.Range} range The cell range.
         * @param {number} maxRowCount The maximum row count.
         * @param {number} maxColumnCount The maximum column count.
         * @returns {GcSpread.Sheets.Range} Returns null if there is no intersection, or the cell range of the intersection.
         */
        getIntersect(range: Range, maxRowCount: number, maxColumnCount: number): Range;
        /**
         * Gets whether the current range intersects with the one specified by the row and column index and the row and column count.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {number} rowCount The row count.
         * @param {number} colCount The column count.
         * @returns {boolean} <c>true</c> if the specified range intersects with the current range; otherwise <c>false</c>.
         */
        intersect(row: number, col: number, rowCount: number, colCount: number): boolean;
        /**
         * Offsets the location of the range by the specified coordinates.
         * @param {number} x The offset along the <i>x</i>-axis.
         * @param {number} y The offset along the <i>y</i>-axis.
         * @returns {GcSpread.Sheets.Range} The new location.
         */
        offset(x: number, y: number): Range;
        /**
         * Joins this range with the specified range as a union.
         * @param {GcSpread.Sheets.Range} range The target range.
         * @returns {GcSpread.Sheets.Range} Returns the union of the ranges.
         */
        union(range: Range): Range;
    }

    export class RangeGroup{
        /**
         * Represents a range group for the worksheet.
         * @param {number} count The count of rows or columns.
         * @class
         */
        constructor(count: number);
        /**
         * Re-creates the range group.
         * @returns {GcSpread.Sheets.RangeGroupInfo} The range group info.
         */
        createRangeGroup(): RangeGroupInfo;
        /**
         * Determines whether the specified outline (range group) is equal to the current range group.
         * @param {object} obj The range group to compare with the current range group.
         * @returns {boolean} <c>true</c> if the specified range group is equal to the current range group; otherwise, <c>false</c>.
         */
        equals(obj: any): boolean;
        /**
         * Expands all outlines (range groups), using the specified level.
         * @param {number} level The level of the outline to expand or collapse.
         * @param {boolean} expand Whether to expand the groups.
         */
        expand(level: number, expand: boolean): void;
        /**
         * Expands or collapses the specified outline (range group) of rows or columns.
         * @param {GcSpread.Sheets.RangeGroupInfo} groupInfo The group information of the range group.
         * @param {boolean} expand Whether to expand the groups.
         */
        expandGroup(groupInfo: RangeGroupInfo, expand: boolean): void;
        /**
         * Gets the outline (range group) with the specified group level and row or column index.
         * @param {number} index The index of the row or column.
         * @param {number} level The level of the outline (range group).
         * @returns {GcSpread.Sheets.RangeGroupInfo} The specified range group.
         */
        find(index: number, level: number): RangeGroupInfo;
        /**
         * Gets the collapsed internal.
         * @param {boolean} index The index.
         * @returns {boolean} <c>true</c> if collapsed; otherwise, <c>false</c>.
         */
        getCollapsed(index: number): boolean;
        /**
         * Gets the range group's direction.
         * @returns {GcSpread.Sheets.RangeGroupDirection} The range group's direction.
         */
        getDirection(): RangeGroupDirection;
        /**
         * Gets the level of a specified row or column.
         * The level's index is zero-based.
         * @param {number} index The index of the row or column.
         * @returns {number} The level for the row or column.
         */
        getLevel(index: number): number;
        /**
         * Gets the number of the deepest level.
         * @remarks The level index is zero-based.
         * @returns {number} The number of the deepest level.
         */
        getMaxLevel(): number;
        /**
         * Gets the state for the specified group.
         * @param {GcSpread.Sheets.RangeGroupInfo} group The group.
         * @returns {GcSpread.Sheets.GroupState} The group state.
         */
        getState(group: RangeGroupInfo): GroupState;
        /**
         * Groups a range of rows or columns into an outline (range group) from a specified start index.
         * @param {number} index The group starting index.
         * @param {number} count The number of rows or columns to group.
         */
        group(index: number, count: number): void;
        /**
         * Determines whether the range group at the specified index is collapsed.
         * @param {number} index The index of the row or column in the range group.
         * @returns {boolean} <c>true</c> if the specified row or column is collapsed; otherwise, <c>false</c>.
         */
        isCollapsed(index: number): boolean;
        /**
         * Determines whether [is group end] [the specified index].
         * @param {number} index The index.
         * @param {number} indexNext The next index.
         * @param {number} processLevel The process level.
         * @returns {boolean} <c>true</c> if [is group end] [the specified index]; otherwise, <c>false</c>.
         */
        isGroupEnd(index: number, indexNext: number, processLevel: number): boolean;
        /**
         * Refreshes this range group.
         */
        refresh(): void;
        /**
         * Resumes the adding.
         */
        resumeAdding(): void;
        /**
         * Sets the collapsed level.
         * @param {number} index The index.
         * @param {boolean} collapsed Set to <c>true</c> to collapse the level.
         */
        setCollapsed(index: number, collapsed: boolean): void;
        /**
         * Sets the range group's direction.
         * @param {GcSpread.Sheets.RangeGroupDirection} direction The range group's direction.
         */
        setDirection(direction: RangeGroupDirection): void;
        /**
         * Suspends the adding.
         */
        suspendAdding(): void;
        /**
         * Removes all outlines (range groups).
         */
        ungroup(): void;
        /**
         * Removes a range of rows or columns from the outline (range group) at the specified start index.
         * @param {number} index The group starting index.
         * @param {number} count The number of rows or columns to remove.
         */
        ungroupRange(index: number, count: number): void;
    }

    export class RangeGroupInfo{
        /**
         * Represents the range grouping information.
         * @param {GcSpread.Sheets.RangeGroup} model The owner of the group.
         * @param {number} start The start index of the group.
         * @param {number} end The end index of the group.
         * @param {number} level The level of the group.
         * @class
         */
        constructor(model: RangeGroup, start: number, end: number, level: number);
        /** The children of the group.
         * @type {Array}
         */
        children: any[];
        /** The end index of the group.
         * @type {number}
         */
        end: number;
        /** The level of the group.
         * @type {number}
         */
        level: number;
        /** The owner of the group.
         * @type {GcSpread.Sheets.RangeGroup}
         */
        model: RangeGroup;
        /** The parent of the group.
         * @type {GcSpread.Sheets.RangeGroupInfo}
         */
        parent: RangeGroupInfo;
        /** The start index of the group.
         * @type {number}
         */
        start: number;
        /**
         * Adds the child.
         * @param {object} child The child.
         */
        addChild(child: any): void;
        /**
         * Compares this instance to a specified RangeGroupInfo object and returns an indication of their relative values.
         * @param {number} index The index of the group item.
         * @returns {boolean} <c>true</c> if the range group contains the specified index; otherwise, <c>false</c>.
         */
        contains(index: number): boolean;
        /**
         * Gets the state of this outline (range group).
         * @returns {GcSpread.Sheets.GroupState} The state of this outline (range group).
         */
        getState(): GroupState;
        /**
         * Sets the state of this outline (range group).
         * @param {GcSpread.Sheets.GroupState} value The state of this outline (range group).
         */
        setState(value: GroupState): void;
    }

    export class Rect{
        /**
         * Represents a rectangle with a special location, and its width and height in two-dimensional space.
         * @class
         * @param {number} x The <i>x</i>-coordinate of the top-left corner of the rectangle.
         * @param {number} y The <i>y</i>-coordinate of the top-left corner of the rectangle.
         * @param {number} w The width of the rectangle.
         * @param {number} h The height of the rectangle.
         */
        constructor(x?: number, y?: number, w?: number, h?: number);
        /**
         * The width of the rectangle.
         */
        height: any;
        /**
         * The height of the rectangle.
         */
        width: any;
        /**
         * The <i>x</i>-coordinate of the top-left corner of the rectangle.
         */
        x: any;
        /**
         * The <i>y</i>-coordinate of the top-left corner of the rectangle.
         */
        y: any;
        /**
         * Indicates whether the rectangle contains the specified <i>x</i>-coordinate and <i>y</i>-coordinate.
         * @param {number} x The <i>x</i>-coordinate of the point to check.
         * @param {number} y The <i>y</i>-coordinate of the point to check.
         * @returns {boolean} <c>true</c> if (x, y) is contained by the rectangle; otherwise, <c>false</c>.
         */
        contains(x: number, y: number): boolean;
        /**
         * Creates an empty rectangle with the location (0,0) and both width and height set to 0.
         * @returns {GcSpread.Sheets.Rect} The empty rectangle.
         */
        static empty(): Rect;
        /**
         * Gets the rectangle that intersects with the current rectangle.
         * @param {GcSpread.Sheets.Rect} rect The rectangle.
         * @returns {GcSpread.Sheets.Rect} The intersecting rectangle. If the two rectangles do not intersect, returns null.
         */
        getIntersectRect(rect: Rect): Rect;
        /**
         * Indicates whether the specified rectangle intersects with the current rectangle.
         * @param {number} x The <i>x</i>-coordinate of the top-left corner of the rectangle.
         * @param {number} y The <i>y</i>-coordinate of the top-left corner of the rectangle.
         * @param {number} w The width of the rectangle.
         * @param {number} h The height of the rectangle.
         * @returns {boolean} <c>true</c> if the specified rectangle intersects with the current rectangle; otherwise, <c>false</c>.
         */
        intersect(x: number, y: number, width: number, height: number): boolean;
        /**
         * Indicates whether the specified rectangle intersects with the current rectangle.
         * @param {GcSpread.Sheets.Rect} rect The specified rectangle.
         * @returns {boolean} <c>true</c> if the specified rectangle intersects with the current rectangle; otherwise, <c>false</c>.
         */
        intersectRect(rect: Rect): boolean;
    }

    export class RelationCondition{
        /**
         * Represents a relation condition with a specified relation type.
         * @class
         * @param {GcSpread.Sheets.RelationCompareType} compareType The relation between the first and second condition.
         * @param {object} item1 The first condition.
         * @param {object} item2 The second condition.
         */
        constructor(compareType: RelationCompareType, item1: any, item2: any);
        /** Gets the relation type for the first and second conditions.
         * @type {GcSpread.Sheets.RelationCompareType}
         */
        compareType: RelationCompareType;
        /** A value that indicates whether to ignore the blank condition.
         * @type {object}
         */
        ignoreBlank: boolean;
        /** The first condition.
         * @type {object}
         */
        item1: Object;
        /** The second condition.
         * @type {object}
         */
        item2: Object;
        /**
         * Creates a RelationCondition object.
         * @param {GcSpread.Sheets.RelationCompareType} compareType The type of comparison.
         * @param {object} item1 The first condition.
         * @param {object} item2 The second condition.
         * @returns {GcSpread.Sheets.RelationCondition} The RelationCondition object.
         */
        create(compareType: RelationCompareType, item1: any, item2: any): RelationCondition;
        /**
         * Evaluates the condition using the specified evaluator.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualValue1 The actual value of object1 for evaluation.
         * @param {object} actualValue2 The actual value of object2 for evaluation.
         * @returns {boolean} <c>true</c> if the result is successful; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actualValue1: any, actualValue2?: any): boolean;
        /**
         * Resets this instance.
         */
        reset(): void;
    }

    export class Row{
        /**
         * Represents a row in a sheet.
         * @class
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that contains this row.
         * @param {number} index The row index of the row.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If you do not provide this parameter, it will default to <b>viewport</b>.
         */
        constructor(sheet: Sheet, index: number, sheetArea: SheetArea);
        /** Gets row index of the first row in the range.
         * @type{number}
         */
        index: any;
        /**
         * Gets row index of the last row in the range.
         * @type {number}
         */
        index2: any;
        /**
         * Gets the sheet that contains this row.
         * @type {GcSpread.Sheets.Sheet}
         */
        sheet: any;
        /**
         * Gets the area that contains this row.
         * @type {GcSpread.Sheets.SheetArea}
         */
        sheetArea: any;
        /**
         * Gets or sets the background color for the row, such as "red", "#FFFF00", "rgb(255,0,0)", "Accent 5", and so on.
         * @param {string} value The row background color.
         * @returns {string} The row background color.
         */
        backColor(value?: string): any;
        /**
         * Gets or sets the background image for the row.
         * @param {string} value The row background image.
         * @returns {string} The row background image.
         */
        backgroundImage(value?: string): any;
        /**
         * Gets or sets the background image layout for the row.
         * @param {GcSpread.Sheets.ImageLayout} value The row background image layout.
         * @returns {GcSpread.Sheets.ImageLayout} The row background image layout.
         */
        backgroundImageLayout(layout?: ImageLayout): any;
        /**
         * Gets or sets the bottom border for the row.
         * @param {GcSpread.Sheets.LineBorder} value The row bottom border line.
         * @returns {GcSpread.Sheets.LineBorder} The row bottom border line.
         */
        borderBottom(value?: LineBorder): any;
        /**
         * Gets or sets the left border for the row.
         * @param {GcSpread.Sheets.LineBorder} value The row left border line.
         * @returns {GcSpread.Sheets.LineBorder} The row left border line.
         */
        borderLeft(value?: LineBorder): any;
        /**
         * Gets or sets the right border for the row.
         * @param {GcSpread.Sheets.LineBorder} value The row right border line.
         * @returns {GcSpread.Sheets.LineBorder} The row right border line.
         */
        borderRight(value?: LineBorder): any;
        /**
         * Gets or sets the top border for the row.
         * @param {GcSpread.Sheets.LineBorder} value The row top border line.
         * @returns {GcSpread.Sheets.LineBorder}The row top border line.
         */
        borderTop(value?: LineBorder): any;
        /**
         * Gets or sets the cell type for the row.
         * @param {GcSpread.Sheets.BaseCellType} value The row cell type.
         * @returns {GcSpread.Sheets.BaseCellType} The row cell type.
         */
        cellType(value: any): any;
        /**
         * Clears the style setting for the specified property that is a property of GcSpread.Sheets.Style, such as "backColor", "foreColor", and so on.
         * @param {string} propertyName The row property name.
         */
        clearStyleProperty(propertyName: string): void;
        /**
         * Gets or sets the data validator for the row.
         * @param {GcSpread.Sheets.DefaultDataValidator} value The row data validator.
         * @returns {GcSpread.Sheets.DefaultDataValidator} The row data validator.
         */
        dataValidator(value?: any): any;
        /**
         * Gets or sets the font for the row, such as "normal normal normal 20px/normal Arial".
         * @param {string} value The row font.
         * @returns {string} The row font.
         */
        font(value?: string): any;
        /**
         * Gets or sets the text color for the row, such as "red", "#FFFF00", "rgb(255,0,0)", "Accent 5", and so on.
         * @param {string} value The text color for the row.
         * @returns {string} The row foreground color.
         */
        foreColor(value?: string): any;
        /**
         * Gets or sets the formatter for the row.
         * @param {object} value The row formatter string or object.
         * @returns {object} The row formatter string or object.
         */
        formatter(value?: any): any;
        /**
         * Gets or sets the horizontal alignment for the contents of the row.
         * @param {GcSpread.Sheets.HorizontalAlign} value The row horizontal alignment.
         * @returns {GcSpread.Sheets.HorizontalAlign} The row horizontal alignment.
         */
        hAlign(value?: HorizontalAlign): any;
        /**
         * Gets or sets the height of the row in pixels.
         * @param {number} value The cell row height.
         * @returns {number} The row height.
         */
        height(value?: number): any;
        /**
         * Gets or sets the imeMode of the row.
         * @param {GcSpread.Sheets.ImeMode} value The row imeMode.
         * @returns {GcSpread.Sheets.ImeMode} The row imeMode.
         */
        imeMode(value?: ImeMode): any;
        /**
         * Gets or sets whether the cells in the row are locked. When the sheet is protected, the locked cell cannot be edited.
         * @param {boolean} value Set to <c>true</c> to lock the cells in the row so the user cannot edit them.
         * @returns {boolean} <c>true</c> if the cells in the row are locked; otherwise, <c>false</c>.
         */
        locked(value?: boolean): any;
        /**
         * Gets or sets whether the row can be resized by the user.
         * @param {boolean} value Set to <c>true</c> to make the row resizable.
         * @returns {boolean} <c>true</c> if the user can resize the row; otherwise, <c>false</c>.
         */
        resizable(value?: boolean): any;
        /**
         * Gets or sets whether the content of the cells in the row shrinks to fit.
         * @param {boolean} value Set to <c>true</c> to let the contents in the cells in the row shrink to fit within the cell.
         * @returns {boolean} <c>true</c> if the contents can shrink to fit; otherwise, <c>false</c>.
         */
        shrinkToFit(value?: boolean): any;
        /**
         * Gets or sets a value that indicates whether the user can set focus to the cells in the row using the Tab key.
         * @param {boolean} value Set to <c>true</c> to set focus to the cells in the row using the Tab key.
         * @returns {boolean} <c>true</c> if the user can set focus to the cells in the row using the Tab key; otherwise, <c>false</c>.
         */
        tabStop(value?: boolean): any;
        /**
         * Gets or sets the tag for the row.
         * @param {Object} value The tag value.
         * @returns {Object} The tag value.
         */
        tag(value?: any): any;
        /**
         * Gets or sets the type of the decoration added to the text of the cells in the row.
         * @param {GcSpread.Sheets.TextDecorationType} value The type of the decoration.
         * @returns {GcSpread.Sheets.TextDecorationType} The type of the decoration.
         */
        textDecoration(value?: TextDecorationType): any;
        /**
         * Gets or sets the text indent for the row.
         * @param {number} value The row text indent.
         * @returns {number} The row text indent.
         */
        textIndent(value?: number): any;
        /**
         * Gets or sets the theme font for the row.
         * @param {string} value The row theme font.
         * @returns {string} The row theme font.
         */
        themeFont(value?: string): any;
        /**
         * Gets or sets the vertical alignment for the contents of the row.
         * @param {GcSpread.Sheets.VerticalAlign} value The row vertical alignment.
         * @returns {GcSpread.Sheets.VerticalAlign} The row vertical alignment.
         */
        vAlign(value?: VerticalAlign): any;
        /**
         * Gets or set whether the row is displayed.
         * @param {boolean} value Set to <c>true</c> to make the row visible.
         * @returns {boolean} <c>true</c> if the row is displayed; otherwise, <c>false</c>.
         */
        visible(value?: boolean): any;
        /**
         * Gets or sets the content of the row watermark.
         * @param {string} value The content of the watermark.
         * @returns {string} The content of the watermark.
         */
        watermark(value?: string): any;
        /**
         * Gets or sets whether text can wrap in the cells in the row.
         * @param {boolean} value Set to <c>true</c> to let text wrap in the cells in the row.
         * @returns {boolean} <c>true</c> if the text can wrap; otherwise, <c>false</c>.
         */
        wordWrap(value?: boolean): any;
    }

    export class RowFilterBase{
        /**
         * Represents a row filter base that supports row filters for filtering rows in a sheet.
         * @class GcSpread.Sheets.RowFilterBase
         * @param {GcSpread.Sheets.Range} range The filter range.
         */
        constructor(range?: Range);
        /**
         * Gets or sets the range for the row filter.
         * @type {GcSpread.Sheets.Range}
         */
        range: any;
        /**
         * Represents the type name string used for supporting serialization.
         * @type {string}
         */
        typeName: any;
        /**
         * Adds the average filter for the row filter.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.AverageConditionType} compareType The comparison type.
         */
        addAverageFilter(col: number, compareType: AverageConditionType): void;
        /**
         * Adds the background filter for the row filter.
         * @param {number} col The column index.
         * @param {string} color The background color for comparison.
         */
        addBackgroundFilter(col: number, color: string): void;
        /**
         * Adds the date filter for the row filter.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.DateCompareType} compareType The date comparison type.
         * @param {Object} date The date for comparison.
         */
        addDateFilter(col: number, compareType: DateCompareType, date: Object): void;
        /**
         * Adds a specified filter to the row filter.
         * @param {number} col The column index.
         * @param {Object} filterItem The condition to filter.
         */
        addFilterItem(col: number, filterItem: Object): void;
        /**
         * Adds the foreground filter for the row filter.
         * @param {number} col The column index.
         * @param {string} color The foreground color for comparison.
         */
        addForegroundFilter(col: number, color: string): void;
        /**
         * Adds the number filter for the row filter.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.GeneralCompareType} compareType The comparison type.
         * @param {number} num The number for comparison.
         */
        addNumberFilter(col: number, compareType: GeneralCompareType, num: number): void;
        /**
         * Adds the text filter for the row filter.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.TextCompareType} compareType The text comparison type.
         * @param {string} text The text for comparison.
         */
        addTextFilter(col: number, compareType: TextCompareType, text: string): void;
        /**
         * Adds the top 10 filter for the row filter.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.Top10ConditionType} compareType The comparison type.
         * @param {number} rank The item count of the top 10 condition.
         */
        addTop10Filter(col: number, compareType: Top10ConditionType, rank: number): void;
        /**
         * Filters the specified column.
         * @param {number} col The index of the column to be filtered; if it is omitted, all the columns in the range will be filtered.
         */
        filter(col?: number): void;
        /**
         * Gets or sets whether the sheet column's filter button is displayed.
         * @param {number} col The column index of the filter button.
         * @param {boolean} value Whether the filter button is displayed.
         * @returns {boolean} Whether the sheet column's filter button is displayed.
         */
        filterButtonVisible(col?: number, value?: boolean): any;
        /**
         * Loads the object state from the specified JSON string.
         * @param {Object} settings The row filter data from deserialization.
         */
        fromJSON(settings: any, isNoneSchema?: boolean): void;
        /**
         * Gets all the filtered conditions.
         * @returns {Array} Returns a collection that contains all the filtered conditions.
         */
        getFilteredItems(): any[];
        /**
         * Gets the filters for the specified column.
         * @returns {Array} Returns a collection that contains filters that belong to a specified column.
         */
        getFilterItems(col: number): any[];
        /**
         * Gets the current sort state.
         * @returns {GcSpread.Sheets.SortState} The sort state of the current filter.
         */
        getSortState(col: number): SortState;
        /**
         * Determines whether the specified column is filtered.
         * @param {number} col The column index.
         * @returns {boolean} <c>true</c> if the column is filtered; otherwise, <c>false</c>.
         */
        isColumnFiltered(col: number): boolean;
        /**
         * Gets a value that indicates whether any row is filtered.
         * @returns {boolean} <c>true</c> if some rows are filtered; otherwise, <c>false</c>.
         */
        isFiltered(): boolean;
        /**
         * Determines whether the filter is HideRowFilter.
         * @returns {boolean} <c>true</c> if the filter is HideRowFilter; otherwise, <c>false</c>;
         */
        isHideRowFilter(): boolean;
        /**
         * Determines whether the specified row is filtered out.
         * @param {number} row The row index.
         * @returns {boolean} <c>true</c> if the row is filtered out; otherwise, <c>false</c>.
         */
        isRowFilteredOut(row: number): boolean;
        /**
         * Performs the action when some columns have just been filtered or unfiltered.
         * @param {object} args An object that contains the <i>action</i>, <i>sheet</i>, <i>range</i>, <i>filteredRows</i>, and <i>filteredOutRows</i>. See the Remarks for additional information.
         */
        onFilter(args: any): void;
        /**
         * Opens the filter dialog when the user clicks the filter button.
         * @param {Object} filterButtonHitInfo The hit test information about the filter button.
         */
        openFilterDialog(filterButtonHitInfo: IHitTestFilterButtonHitInfo): void;
        /**
         * Refreshes all the filters.
         */
        reFilter(): void;
        /**
         * Removes the specified filter.
         * @param {number} col The column index.
         */
        removeFilterItems(col: number): void;
        /**
         * Clears all filters.
         */
        reset(): void;
        /**
         * Sorts the specified column in the specified order.
         * @param {number} col The column index.
         * @param {boolean} ascending Set to <c>true</c> to sort as ascending.
         * @returns {boolean} <c>true</c> if sorted successfully; otherwise, <c>false</c>.
         */
        sortColumn(col: number, ascending: boolean): void;
        /**
         * Saves the object state to a JSON string.
         * @returns {Object} The row filter data.
         */
        toJSON(): Object;
        /**
         * Removes the filter from the specified column.
         * @param {number} col The index of column for which to remove the filter; if it is omitted, removes the filter for all columns in the range.
         */
        unfilter(col?: number): void;
    }

    export class RowHeaderCellType{
        /**
         * Represents the painter of the row header cells.
         * @extends GcSpread.Sheets.BaseCellType
         * @class
         */
        constructor();
    }

    export class ScaleRule extends ConditionRuleBase{
        /**
         * Represents a scale conditional rule.
         * @extends GcSpread.Sheets.ConditionRuleBase
         * @param {object} scaleValue1 The first scale value.
         * @param {object} scaleValue2 The second scale value.
         * @param {object} scaleValue3 The third scale value.
         * @class
         */
        constructor(scaleValue1: any, scaleValue2: any, scaleValue3: any);
        /**
         * Creates a condition for the rule.
         * @returns {object} The condition for the rule.
         */
        createCondition(): any;
        /**
         * Gets whether evaluation should stop if the condition evaluates to <c>true</c>.
         */
        stopIfTrue(): boolean;
    }

    export class ScaleValue{
        /**
         * Represents a scale value with the specified type and value.
         * @class
         * @param {object} type The scale value type.
         * @param {object} value The scale value.
         */
        constructor(type: any, value: any);
        /** Gets the scale value type.
         * @type {object}
         */
        type: any;
        /** Gets the scale value.
         * @type {object}
         */
        value: any;
    }

    export class ScatterSparkline extends SparklineEx{
        /**
         * Represents the class for the scatter sparkline.
         * @extends GcSpread.Sheets.SparklineEx
         * @class
         */
        constructor();
    }

    export class SearchCondition{
        /**
         * Defines the search condition.
         * @class
         */
        constructor();
        /** The index of the column at which to end.
         * @type {number}
         */
        columnEnd: number;
        /** The index of the column at which to start.
         * @type {number}
         */
        columnStart: number;
        /** Index of the sheet on which to end searching.
         * @type {number}
         */
        endSheetIndex: number;
        /** The index of the row at which to end.
         * @type {number}
         */
        rowEnd: number;
        /** The index of the row at which to start.
         * @type {number}
         */
        rowStart: number;
        /** The enumeration that specifies the options of the search.
         * @type {GcSpread.Sheets.SearchFlags}
         */
        searchFlags: SearchFlags;
        /** The enumeration that specifies whether the search goes by coordinates of (column, row) or (row, column).
         * @type {GcSpread.Sheets.SearchOrder}
         */
        searchOrder: SearchOrder;
        /** The string for which to search.
         * @type {string}
         */
        searchString: string;
        /** The enumeration that indicates whether the search includes the content in the cell notes, tags, or text.
         * @type {GcSpread.Sheets.SearchFoundFlags}
         */
        searchTarget: SearchFoundFlags;
        /** The area of the sheet for search.
         * @type {GcSpread.Sheets.SheetArea}
         */
        sheetArea: SheetArea;
        /** Index of the sheet on which to start searching.
         * @type {number}
         */
        startSheetIndex: number;
    }

    export class SearchResult{
        /**
         * Defines the search result.
         * @class
         */
        constructor();
        /** The index of the column at which a match is found.
         * @type {number}
         */
        foundColumnIndex: number;
        /** The index of the row at which a match is found.
         * @type {number}
         */
        foundRowIndex: number;
        /** The index of the sheet in which a match is found.
         * @type {number}
         */
        foundSheetIndex: number;
        /** The found string.
         * @type {object}
         */
        foundString: any;
        /** An enumeration that specifies what is matched.
         * @type {GcSpread.Sheets.SearchFoundFlags}
         */
        searchFoundFlag: SearchFoundFlags;
    }

    export class Sheet{
        /**
         * Represents a sheet.
         * @class
         * @param {string} name The name of the sheet.
         * */
        constructor(name: string, delayInit?: boolean);
        /**
         * Indicates the index of the active viewport column.
         * @type {number}
         */
        activeColViewportIndex: number;
        /**
         * Indicates the index of the active viewport row.
         * @type {number}
         */
        activeRowViewportIndex: number;
        /**
         * Indicates whether to generate columns automatically while binding data context.
         * @type {boolean}
         */
        autoGenerateColumns: boolean;
        /**
         * Indicates whether changes to the sheet are checked.
         * @type {boolean}
         */
        checkingChanges: boolean;
        /**
         * Indicates the column range group.
         * @type {GcSpread.Sheets.RangeGroup}
         */
        colRangeGroup: RangeGroup;
        /**
         * Indicates the default row height and column width of the sheet.
         * @type {Object}
         */
        defaults: ISheetDefaultOption;
        /**
         * Indicates shortcut keys for default behaviours, such as navigating left after pressing the left arrow key.
         * @type {Array} The GcSpread.Sheets.KeyMap Array.
         */
        keyMap: KeyMap[];
        /**
         * Indicates the row range group.
         * @type {GcSpread.Sheets.RangeGroup}
         */
        rowRangeGroup: RangeGroup;
        /**
         * Adds the column or columns to the data model at the specified index.
         * @param {number} col Column index at which to add the new columns.
         * @param {number} count The number of columns to add.
         */
        addColumns(col: number, count: number): void;
        /**
         * Adds the specified user-defined custom function to the collection.
         * @param {Object} fn The function to add.
         */
        addCustomFunction(fn: any): void;
        /**
         * Adds a custom function description.
         * @param {Object} fnd The function description to add.
         */
        addCustomFunctionDescription(fnd: IFunctionDescription): void;
        /**
         * Adds a custom name for the specified area.
         * @param {string} name The custom name.
         * @param {string} formula The formula to set.
         * @param {number} baseRow The base row of the custom name.
         * @param {number} baseCol The base column of the custom name.
         */
        addCustomName(name: string, formula: string, baseRow: number, baseCol: number): void;
        /**
         * Add a custom floating object to the sheet.
         * @param {GcSpread.Sheets.CustomFloatingObject} item The custom floating object.
         */
        addFloatingObject(item: CustomFloatingObject): void;
        /**
         * Adds the shortcut key for the specified action to the sheet.
         * @param {number} keyCode The unicode for the key.
         * @param {boolean} ctrl <c>true</c> if the action uses the Ctrl key; otherwise, <c>false</c>.
         * @param {boolean} shift <c>true</c> if the action uses the Shift key; otherwise, <c>false</c>.
         * @param {boolean} alt <c>true</c> if the action uses the Alt key; otherwise, <c>false</c>.
         * @param {boolean} meta <c>true</c> if the action uses the Command key on the Macintosh or the Windows key on Microsoft Windows; otherwise, <c>false</c>.
         * @param {Object} action The action defined in GcSpread.Sheets.SpreadActions to add.
         */
        addKeyMap(keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, meta: boolean, action: any): void;
        /**
         * Adds a style to the sheet named styles collection
         * @param {GcSpread.Sheets.Style} style The style to be added.
         */
        addNamedStyle(style: Style): void;
        /**
         * Add a picture to the sheet.
         * @param {string} name The name of the picture.
         * @param {string} src The image source of the picture.
         * @param {number} startRow The start row of the picture.
         * @param {number} startColumn The start column of the picture.
         * @param {number} endRow The end row of the picture.
         * @param {number} endColumn The end column of the picture.
         * @param {number} startRowOffset The offset relative to the start row of the picture.
         * @param {number} startColumnOffset The offset relative to the start column of the picture.
         * @param {number} endRowOffset The offset relative to the end row of the picture.
         * @param {number} endColumnOffset The offset relative to the end column of the picture.
         * @returns {GcSpread.Sheets.Picture} Returns the added picture.
         */
        addPicture(name: string, src: string, startRow: number, startColumn: number, endRow?: number, endColumn?: number, startRowOffset?: number, startColumnOffset?: number, endRowOffset?: number, endColumnOffset?: number): Picture;
        /**
         * Adds rows in this sheet.
         * @param {number} row The index of the starting row.
         * @param {number} count The number of rows to add.
         */
        addRows(row: number, count: number): void;
        /**
         * Adds a cell or cells to the selection.
         * @param {number} row The row index of the first cell to add.
         * @param {number} column The column index of the first cell to add.
         * @param {number} rowCount The number of rows to add.
         * @param {number} columnCount The number of columns to add.
         */
        addSelection(row: number, column: number, rowCount: number, columnCount: number): void;
        /**
         * Adds a span of cells to this sheet in the specified sheet area.
         * @param {number} row The row index of the cell at which to start the span.
         * @param {number} column The column index of the cell at which to start the span.
         * @param {number} rowCount The number of rows to span.
         * @param {number} colCount The number of columns to span.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         */
        addSpan(row: number, col: number, rowCount: number, colCount: number, sheetArea?: SheetArea): void;
        /**
         * Adds a range table with a specified size to the sheet.
         * @param {string} name The table name.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @param {number} rowCount The row count of the table.
         * @param {number} columnCount The column count of the table.
         * @param {GcSpread.Sheets.TableStyle} tableStyle The style of the table.
         * @returns {GcSpread.Sheets.SheetTable} The new table instance.
         */
        addTable(name: string, row: number, column: number, rowCount: number, columnCount: number, style?: TableStyle): SheetTable;
        /**
         * Adds a range table with a specified data source to the sheet.
         * @param {string} name The table name.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @param {object} datasource The data source for the table.
         * @param {GcSpread.Sheets.TableStyle} style The style of the table.
         * @returns {GcSpread.Sheets.SheetTable} The new table instance.
         */
        addTableByDataSource(name: string, row: number, column: number, dataSource: any, style?: TableStyle): SheetTable;
        /**
         * Gets or sets a value that indicates whether data can overflow into adjacent empty cells.
         * @param {boolean} value Whether data can overflow.
         * @returns {Object} <c>true</c> if data can overflow; otherwise, <c>false</c>.
         */
        allowCellOverflow(value?: boolean): any;
        /**
         * Gets or sets whether cell editor reserved mouse locations are allowed.
         * @param {boolean} name Whether cell editor reserved mouse locations are allowed.
         * @returns {Object} <c>true</c> if cell editor reserved mouse locations are allowed; otherwise, <c>false</c>.
         */
        allowEditorReservedLocations(value?: boolean): any;
        /**
         * Gets or sets a value that indicates whether to allow undo actions.
         * @param {boolean} value Whether to allow undo actions.
         * @returns {Object} <c>true</c> if undo actions are allowed; otherwise, <c>false</c>.
         */
        allowUndo(value?: boolean): any;
        /**
         * Automatically fits the viewport column.
         * @param {number} column The column index.
         */
        autoFitColumn(column: number): void;
        /**
         * Automatically fits the viewport row.
         * @param {number} row The row index.
         */
        autoFitRow(row: number): void;
        /**
         * Binds an event to the sheet.
         * @param {string} type The event type.
         * @param {Object} data Optional. Specifies additional data to pass along to the function.
         * @param {Function} fn Specifies the function to run when the event occurs.
         */
        bind(type: string, data?: any, fn?: Function): void;
        /**
         * Binds the column using the specified data field.
         * @param {number} index The column index.
         * @param {string|Object} column Column info with data field. If its type is string, it will be regarded as name.
         */
        bindColumn(index: number, column: any): void;
        /**
         * Binds the columns using the specified data fields.
         * @param {Array} columns The array of column info with data fields. If an item's type is string, the item will be regarded as name.
         */
        bindColumns(columns: any[]): void;
        /**
         * Clears the specified area.
         * @param {number} row The start row index.
         * @param {number} column The start column index.
         * @param {number} rowCount The number of rows to clear.
         * @param {number} columnCount The number of columns to clear.
         * @param {GcSpread.Sheets.SheetArea} area The area to clear.
         * @param {GcSpread.Sheets.StorageType} type The clear type.
         */
        clear(row: number, column: number, rowCount: number, columnCount: number, area: SheetArea, type: StorageType): void;
        /**
         * Clears all custom function descriptions.
         */
        clearCustomFunctionDescriptions(): void;
        /**
         * Removes all user-defined custom functions (FunctionInfo object) on this sheet.
         */
        clearCustomFunctions(): void;
        /**
         * Clears the custom name collection.
         */
        clearCustomNames(): void;
        /**
         * Clears the dirty, insert, and delete status from the current sheet.
         */
        clearPendingChanges(): void;
        /**
         * Clears the selection.
         */
        clearSelection(): void;
        /**
         * Gets or sets the clipboard options.
         * @param {GcSpread.Sheets.ClipboardPasteOptions} value The clipboard option.
         * @returns {GcSpread.Sheets.ClipboardPasteOptions} The clipboard option.
         */
        clipBoardOptions(value?: ClipboardPasteOptions): any;
        /**
         * Copies data from one range to another.
         * @param {number} fromRow The source row.
         * @param {number} fromColumn The source column.
         * @param {number} toRow The target row.
         * @param {number} toColumn The target column.
         * @param {number} rowCount The row count.
         * @param {number} columnCount The column count.
         * @param {GcSpread.Sheets.CopyToOption} option The copy option.
         */
        copyTo(fromRow: number, fromColumn: number, toRow: number, toColumn: number, rowCount: number, columnCount: number, option: CopyToOption): void;
        /**
         * Gets or sets the current theme for the sheet.
         * @param {string|GcSpread.Sheets.SpreadTheme} value The theme name or the theme.
         * @returns {GcSpread.Sheets.SpreadTheme} The current theme.
         */
        currentTheme(value?: any): any;
        /**
         * Deletes the columns in this sheet at the specified index.
         * @param {number} col The index of the first column to delete.
         * @param {number} count The number of columns to delete.
         */
        deleteColumns(col: number, count: number): void;
        /**
         * Deletes the rows in this sheet at the specified index.
         * @param {number} row The index of the first row to delete.
         * @param {number} count The number of rows to delete.
         */
        deleteRows(row: number, count: number): void;
        /**
         * Performs an action and adds it to the undo list if the action can be undone.
         * @param {GcSpread.Sheets.UndoRedo.ActionBase} action The action to perform.
         */
        doCommand(action: UndoRedo.ActionBase): void;
        /**
         * Returns the editor's status.
         * @returns {GcSpread.Sheets.EditorStatus} The editor status.
         */
        editorStatus(): EditorStatus;
        /**
         * Stops editing the active cell.
         * @param {boolean} ignoreValueChange If set to <c>true</c>, does not apply the edited text to the cell.
         * @returns {boolean} <c>true</c> when able to stop cell editing successfully; otherwise, <c>false</c>.
         */
        endEdit(ignoreValueChange?: boolean): boolean;
        /**
         * Fills the specified range automatically.
         * When the value is a string, the value is copied to other cells. When the value is a number, the new value is generated by the TREND formula.
         * @param {GcSpread.Sheets.Range} startRange The fill start range.
         * @param {GcSpread.Sheets.Range} wholeRange The fill whole range.
         * @param {GcSpread.Sheets.FillSeries} series The fill series.
         */
        fillAuto(startRange: Range, wholeRange: Range, series: FillSeries): void;
        /**
         * Fills the specified range in the specified direction.
         * @param {GcSpread.Sheets.Range} startRange The fill start range.
         * @param {GcSpread.Sheets.Range} wholeRange The fill whole range.
         * @param {GcSpread.Sheets.FillDirection} direction The fill direction.
         */
        fillAutobyDirection(startRange: Range, wholeRange: Range, direction: FillDirection): void;
        /**
         * Fills the specified range when the source value type is date.
         * The next value is generated by adding the step value to the current value. The step value is affected by the fill date unit.
         * @param {GcSpread.Sheets.Range} startRange The fill start range.
         * @param {GcSpread.Sheets.Range} wholeRange The fill whole range.
         * @param {GcSpread.Sheets.FillSeries} series The fill series.
         * @param {GcSpread.Sheets.FillDateUnit} unit The fill date unit.
         * @param {number} step The fill date step value.
         * @param {Date} stop Stops when the fill value exceeds the stop value.
         */
        fillDate(startRange: Range, wholeRange: Range, series: FillSeries, unit: FillDateUnit, step: number, stop?: Date): void;
        /**
         * Fills the specified range growth trend when the source value type is number.
         * The next value is generated by the step and stop values. The next value is computed by multiplying the step value with the current cell.
         * @param {GcSpread.Sheets.Range} startRange The fill start range.
         * @param {GcSpread.Sheets.Range} wholeRange The fill whole range.
         * @param {GcSpread.Sheets.FillSeries} series The fill series.
         * @param {number} step The fill step value.
         * @param {number} stop The fill stop value
         */
        fillGrowth(startRange: Range, wholeRange: Range, series: FillSeries, step: number, stop: number): void;
        /**
         * Fills the specified range linear trend when the source value type is number.
         * The next value is generated by the step and stop values. The next value is computed by adding the step value to the current cell value.
         * @param {GcSpread.Sheets.Range} startRange The fill start range.
         * @param {GcSpread.Sheets.Range} wholeRange The fill whole range.
         * @param {GcSpread.Sheets.FillSeries} series The fill series.
         * @param {number} step The fill step value.
         * @param {number} stop The fill stop value
         */
        fillLinear(startRange: Range, wholeRange: Range, series: FillSeries, step: number, stop: number): void;
        /**
         * Finds the custom floating object with specified name.
         * @param {string} name The name of the custom floating object to find.
         * @returns {GcSpread.Sheets.CustomFloatingObject} Returns the custom floating object.
         */
        findFloatingObject(name: string): CustomFloatingObject;
        /**
         * Finds the picture with specified name.
         * @param {string} name The name of the picture to find.
         * @returns {GcSpread.Sheets.Picture} Returns the picture.
         */
        findPicture(name: string): Picture;
        /**
         * Gets the table of the specified cell.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @returns {GcSpread.Sheets.SheetTable} The table instance if the cell belongs to a table; otherwise, <c>null</c>.
         */
        findTable(row: number, column: number): SheetTable;
        /**
         * Gets the table with a specified name.
         * @param {string} name The table name.
         * @returns {GcSpread.Sheets.SheetTable} The table instance if the cell belongs to a table; otherwise, <c>null</c>.
         */
        findTableByName(name: string): SheetTable;
        /**
         * Loads the object state from the specified JSON string.
         * @param {Object} sheetSettings The sheet data from deserialization.
         */
        fromJSON(sheetSettings: any, setFormulaDirectly?: boolean, isNoneSchema?: boolean): any;
        /**
         * Gets or sets a color string used to represent the frozen line color, such as "red", "#FFFF00", "rgb(255,0,0)", "Accent 5", and so on.
         * @param {string} value The color string.
         * @returns {Object} The color string used to represent the frozen line color.
         */
        frozenlineColor(value?: string): any;
        /**
         * Gets the active column index for this sheet.
         * @returns {number} The column index of the active cell.
         */
        getActiveColumnIndex(): number;
        /**
         * Gets the active row index for this sheet.
         * @returns {number} The row index of the active cell.
         */
        getActiveRowIndex(): number;
        /**
         * Gets the actual style information for a specified cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         * @param {boolean} sheetStyleOnly If <c>true</c>, the row filter and the conditional format style are not applied to the return style;
         * otherwise, the return style only contains the cell's inherited style.
         * @returns {GcSpread.Sheets.Style} Returns the cell style of the specified cell.
         */
        getActualStyle(row: number, column: number, sheetArea?: SheetArea, sheetStyleOnly?: boolean, notClone?: boolean): Style;
        /**
         * Gets an object array from a specified range of cells.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @param {number} rowCount The row count.
         * @param {number} colCount The column count.
         * @param {boolean} getFormula If <c>true</c>, return formulas; otherwise, return values.
         * @returns {Array} The object array from the specified range of cells.
         */
        getArray(row: number, column: number, rowCount: number, columnCount: number, getFormula?: boolean): any[];
        /**
         * Gets the binding path of cell-level binding from the specified cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @returns {string} Returns the binding path of the cell for cell-level binding.
         */
        getBindingPath(row: number, col: number): string;
        /**
         * Gets the specified cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {GcSpread.Sheets.Cell} The cell.
         */
        getCell(row: number, col: number, sheetArea?: SheetArea): Cell;
        /**
         * Gets the rectangle of the cell.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {number} rowViewportIndex Index of the row of the viewport: -1 represents column header area, 0 represents frozen row area, 1 represents viewport area, 2 represents trailing frozen row area.
         * @param {number} colViewportIndex Index of the column of the viewport: -1 represents row header area, 0 represents frozen column area, 1 represents viewport area, 2 represents trailing frozen column area.
         * @returns {GcSpread.Sheets.Rect} Object containing the size and location of the rectangle of the cell.
         */
        getCellRect(row: number, col: number, rowViewportIndex?: number, colViewportIndex?: number): Rect;
        /**
         * Gets a range of cells in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {number} row2 The second row index.
         * @param {number} col2 The second column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {GcSpread.Sheets.Cell} The cells.
         */
        getCells(row: number, col: number, row2: number, col2: number, sheetArea?: SheetArea): Cell;
        /**
         * Gets the cell type.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         * @returns {GcSpread.Sheets.BaseCellType} Returns the cell type for the specified cell.
         */
        getCellType(row: number, col: number, sheetArea?: SheetArea): any;
        /**
         * Gets the specified column in the specified sheet area.
         * @param {number} index The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {GcSpread.Sheets.Column} The column.
         */
        getColumn(index: number, sheetArea?: SheetArea): Column;
        /**
         * Gets the column count in the specified sheet area.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {number} The number of columns.
         */
        getColumnCount(sheetArea?: SheetArea): number;
        /**
         * Gets a value that indicates whether the column header displays letters or numbers or is blank.
         * @returns {GcSpread.Sheets.HeaderAutoText} A value that indicates what the column header displays.
         */
        getColumnHeaderAutoText(): HeaderAutoText;
        /**
         * Gets which column header row displays the automatic text when there are multiple column header rows.
         * @returns {number} The row index of the column header that displays the automatic text.
         */
        getColumnHeaderAutoTextIndex(): number;
        /**
         * Gets a value that indicates whether the column header is visible.
         * @returns {boolean} <c>true</c> if the column header is visible; otherwise, <c>false</c>.
         */
        getColumnHeaderVisible(): boolean;
        /**
         * Gets a value that indicates whether the user can resize a specified column in the specified sheet area.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {boolean} <c>true</c> if the user can resize the specified column; otherwise, <c>false</c>.
         */
        getColumnResizable(col: number, sheetArea?: SheetArea): boolean;
        /**
         * Gets a range of columns in the specified sheet area.
         * @param {number} index The column index.
         * @param {number} index2 The second column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {GcSpread.Sheets.Column} The columns.
         */
        getColumns(index: number, index2: number, sheetArea?: SheetArea): Column;
        /**
         * Gets whether a column in the specified sheet area is displayed.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {boolean} <c>true</c> if the column is visible in the sheet area; otherwise, <c>false</c>.
         */
        getColumnVisible(col: number, sheetArea?: SheetArea): boolean;
        /**
         * Gets the width in pixels for the specified column in the specified sheet area.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to viewport.
         * @returns {number} The column width in pixels.
         */
        getColumnWidth(col: number, sheetArea?: SheetArea): number;
        /**
         * Gets the comment for the specified cell.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @returns {GcSpread.Sheets.Comment} The comment in the cell.
         */
        getComment(row: number, col: number): Comment;
        /**
         * Gets all the comments on the sheet.
         * @returns {Array} The GcSpread.Sheets.Comment array of comment instances.
         */
        getComments(): Comment[];
        /**
         * Gets the conditional format for the sheet.
         * @returns {GcSpread.Sheets.ConditionalFormats} The conditional format for the sheet.
         */
        getConditionalFormats(): ConditionalFormats;
        /**
         * Gets delimited text from a range.
         * @param {number} row The start row.
         * @param {number} column The start column.
         * @param {number} rowCount The row count.
         * @param {number} columnCount The column count.
         * @param {string} rowDelimiter The row delimiter that is appended to the end of the row.
         * @param {string} columnDelimiter The column delimiter that is appended to the end of the column.
         * @returns {string} The text from the range with the specified delimiters.
         */
        getCsv(row: number, column: number, rowCount: number, columnCount: number, rowDelimiter: string, columnDelimiter: string): string;
        /**
         * Gets the specified user-defined custom function.
         * @param {string} name The name of the user-defined custom function.
         * @returns {Object} Returns the function with the specified name.
         */
        getCustomFunction(name: string): any;
        /**
         * Gets a custom function description.
         * @param {string} name The custom function description name.
         * @returns {Object} The custom function description. See Remarks for additional information.
         */
        getCustomFunctionDescription(name: string): IFunctionDescription;
        /**
         * Finds the specified custom name.
         * @param {string} name The custom name.
         * @returns {GcSpread.Sheets.NameInfo} Returns the formula with the specified name.
         */
        getCustomName(name: string): NameInfo;
        /**
         * Gets all custom name information.
         * @returns {Array} The type GcSpread.Sheets.NameInfo is stored in Array.
         */
        getCustomNames(): NameInfo[];
        /**
         * Gets the column name at the specified position.
         * @param {number} column The column index for which the name is requested.
         * @returns {string} The column name for data binding.
         */
        getDataColumnName(column: number): string;
        /**
         * Gets the data context to bind.
         * @returns {Object}
         */
        getDataContext(): any;
        /**
         * Gets the data item.
         * @param {number} row The row index.
         * @returns {Object} The row data.
         */
        getDataItem(row: number): any;
        /**
         * Gets the data source that populates the sheet.
         * @function
         * @returns {Object} Returns the data source.
         */
        getDataSource(): any;
        /**
         * Gets the cell data validator.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         * @returns {GcSpread.Sheets.DefaultDataValidator} Returns the cell data validator for the specified cell.
         */
        getDataValidator(row: number, col: number, sheetArea?: SheetArea): DefaultDataValidator;
        /**
         * Gets the default style information for the sheet.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         * @returns {GcSpread.Sheets.Style} Returns the sheet's default style.
         */
        getDefaultStyle(sheetArea?: SheetArea): Style;
        /**
         * Gets the deleted row collection.
         * @return {Array} The deleted rows.
         */
        getDeleteRows(): any[];
        /**
         * Gets the dirty cell collection.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {number} rowCount The number of rows in the range of dirty cells.
         * @param {number} colCount The number of columns in the range of dirty cells.
         * @return {Array} The dirty cells.
         */
        getDirtyCells(row?: number, col?: number, rowCount?: number, colCount?: number): IDirtyCellInfo[];
        /**
         * Gets the dirty row collection.
         * @returns {Array} The dirty rows.
         */
        getDirtyRows(): any[];
        /**
         * Gets the custom floatingObjects.
         * @returns {Array} The GcSpread.Sheets.CustomFloatingObject array of custom floating object instances.
         */
        getFloatingObjects(): CustomFloatingObject[];
        /**
         * Gets the <i>z</i>-index of the floating object.
         * @param {string} name The name of the floating object.
         * @returns {number} The <i>z</i>-index of the floating object.
         */
        getFloatingObjectZIndex(name: string): number;
        /**
         * Gets the cell formatter.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         * @returns {Object} Returns the cell formatter string or object for the specified cell.
         */
        getFormatter(row: number, col: number, sheetArea?: SheetArea): any;
        /**
         * Gets the formula in the specified cell in this sheet.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @returns {string} Returns the formula string.
         */
        getFormula(row: number, col: number): string;
        /**
         * Gets the formula in the specified cell in this sheet.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @returns {GcSpread.Sheets.FormulaInformation} Returns the formula information about the cell.
         */
        getFormulaInformation(row: number, col: number): FormulaInformation;
        /**
         * Gets the number of frozen columns.
         * @returns {number} The number of frozen columns.
         */
        getFrozenColumnCount(): number;
        /**
         * Gets the number of frozen rows.
         * @returns {number} The number of frozen rows.
         */
        getFrozenRowCount(): number;
        /**
         * Gets the number of trailing frozen columns.
         * @returns {number} The number of trailing frozen columns.
         */
        getFrozenTrailingColumnCount(): number;
        /**
         * Gets the number of trailing frozen rows.
         * @returns {number} The number of trailing frozen rows.
         */
        getFrozenTrailingRowCount(): number;
        /**
         * Gets the grid line's options.
         * @returns {Object} The grid line options.
         */
        getGridlineOptions(): ISheetGridlineOption;
        /**
         * Gets the inserted row collection.
         * @returns {Array} The inserted rows.
         */
        getInsertRows(): any[];
        /**
         * Gets a value that indicates whether cells on this sheet that are marked as protected cannot be edited.
         * @returns {boolean} A value that indicates whether cells on this sheet that are marked as protected cannot be edited.
         */
        getIsProtected(): boolean;
        /**
         * Gets the name of this sheet.
         * @returns {string} The sheet name.
         */
        getName(): string;
        /**
         * Gets a style from the sheet named styles collection which has the specified name.
         * @param {string} name The name of the style to return.
         * @returns {GcSpread.Sheets.Style} Returns the specified named style.
         */
        getNamedStyle(name: string): Style;
        /**
         * Get named styles from the sheet.
         * @returns {Array} The GcSpread.Sheets.Style array of named styles.
         */
        getNamedStyles(): Style[];
        /**
         * Gets the parent Spread object of the current sheet.
         * @returns {GcSpread.Sheets.Spread} Returns the parent Spread object of the current sheet.
         */
        getParent(): Spread;
        /**
         * Gets the pictures.
         * @returns {Array} The GcSpread.Sheets.Picture array of picture instances.
         */
        getPictures(): Picture[];
        /**
         * Gets the specified row in the specified sheet area.
         * @param {number} index The row index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {GcSpread.Sheets.Row} The row.
         */
        getRow(index: number, sheetArea?: SheetArea): Row;
        /**
         * Gets the row count in the specified sheet area.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {number} The number of rows.
         */
        getRowCount(sheetArea?: SheetArea): number;
        /**
         * Gets a value that indicates whether the row header displays letters or numbers or is blank.
         * @returns {GcSpread.Sheets.HeaderAutoText} A value that indicates what the row header displays.
         */
        getRowHeaderAutoText(): HeaderAutoText;
        /**
         * Gets which row header column displays the automatic text when there are multiple row header columns.
         * @returns {number} The column index of the row header that displays the automatic text.
         */
        getRowHeaderAutoTextIndex(): number;
        /**
         * Gets a value that indicates whether the row header is visible.
         * @returns {boolean} <c>true</c> if the row header is visible; otherwise, <c>false</c>.
         */
        getRowHeaderVisible(): boolean;
        /**
         * Gets the height in pixels for the specified row in the specified sheet area.
         * @param {number} row The row index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {number} The row height in pixels.
         */
        getRowHeight(row: number, sheetArea?: SheetArea): number;
        /**
         * Gets a value that indicates whether users can resize the specified row in the specified sheet area.
         * @param {number} row The row index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {boolean} <c>true</c> if the users can resize the specified row; otherwise, <c>false</c>.
         */
        getRowResizable(row: number, sheetArea?: SheetArea): boolean;
        /**
         * Gets a range of rows in the specified sheet area.
         * @param {number} index The row index.
         * @param {number} index2 The second row index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {GcSpread.Sheets.Row} The rows.
         */
        getRows(index: number, index2: number, sheetArea?: SheetArea): Row;
        /**
         * Gets whether the control displays the specified row.
         * @param {number} row The row index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {boolean} <c>true</c> if the row is visible in the sheet area; otherwise, <c>false</c>.
         */
        getRowVisible(row: number, sheetArea?: SheetArea): boolean;
        /**
         * Gets the selections in the current sheet.
         * @returns {Array} The type GcSpread.Sheets.Range is stored in Array.
         */
        getSelections(): Range[];
        /**
         * Gets the spans in the specified range in the specified sheet area.
         * @param {GcSpread.Sheets.Range} range The cell range.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         * @returns {Array} An array that contains span information whose item type is GcSpread.Sheets.Range.
         */
        getSpans(range?: Range, sheetArea?: SheetArea): Range[];
        /**
         *  Gets the sparkline for the specified cell.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @returns {GcSpread.Sheets.Sparkline} The sparkline for the cell.
         */
        getSparkline(row: number, col: number): Sparkline;
        /**
         * Gets the style information for a specified cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         * @returns {GcSpread.Sheets.Style} Returns the cell style of the specified cell.
         */
        getStyle(row: number, col: number, sheetArea?: SheetArea): Style;
        /**
         * Gets the name of the style for a specified cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         * @returns {string} Returns the name string for the style.
         */
        getStyleName(row: number, col: number, sheetArea?: SheetArea): string;
        /**
         * Gets the sheet tables.
         * @returns {Array} The GcSpread.Sheets.SheetTable array of table instances. The array is never null.
         */
        getTables(): SheetTable[];
        /**
         * Gets the tag value from the specified cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         * @returns {Object} Returns the tag value of the cell.
         */
        getTag(row: number, col: number, sheetArea?: SheetArea): any;
        /**
         * Gets the formatted text in the cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         * @returns {string} Returns the formatted text of the cell.
         */
        getText(row: number, col: number, sheetArea?: SheetArea): string;
        /**
         * Gets the unformatted data from the specified cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         * @returns {Object} Returns the value of the cell.
         */
        getValue(row: number, col: number, sheetArea?: SheetArea): Object;
        /**
         * Gets the index of the bottom row in the viewport.
         * @param {number} rowViewportIndex The index of the viewport.
         * @returns {number} The index of the bottom row in the viewport.
         */
        getViewportBottomRow(rowViewportIndex: number): number;
        /**
         * Gets the height of the specified viewport row for the active sheet.
         * @param {number} rowViewportIndex The index of the row viewport.
         * @returns {number} The height of the viewport.
         */
        getViewportHeight(rowViewportIndex: number): number;
        /**
         * Gets the index of the left column in the viewport.
         * @param {number} columnViewportIndex The index of the viewport.
         * @returns {number} The index of the left column in the viewport.
         */
        getViewportLeftColumn(columnViewportIndex: number): number;
        /**
         * Gets the index of the right column in the viewport.
         * @param {number} columnViewportIndex The index of the viewport.
         * @returns {number} The index of the right column in the viewport.
         */
        getViewportRightColumn(columnViewportIndex: number): number;
        /**
         * Gets the index of the top row in the viewport.
         * @param {number} rowViewportIndex The index of the viewport.
         * @returns {number} The index of the top row in the viewport.
         */
        getViewportTopRow(rowViewportIndex: number): number;
        /**
         * Gets the width of the specified viewport column for the active sheet.
         * @param {number} columnViewportIndex The index of the column viewport.
         * @returns {number} The width of the viewport
         */
        getViewportWidth(columnViewportIndex: number): number;
        /**
         * Groups the sparklines.
         * @param {Array} sparklines The sparklines to group.
         * @returns {GcSpread.Sheets.SparklineGroup} The sparkline group.
         */
        groupSparkline(sparklines: any[]): SparklineGroup;
        /**
         * Gets whether there is a formula in the specified cell in this sheet.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @returns {boolean} <c>true</c> if the cell contains a formula; otherwise, <c>false</c>.
         */
        hasFormula(row: number, col: number): boolean;
        /**
         * Gets whether there is a dirty, insert, or delete status for the specified range.
         * @returns {boolean} <c>true</c> if any of the rows or cells in the range are dirty, or have been inserted or deleted; otherwise, <c>false</c>.
         */
        hasPendingChanges(): boolean;
        /**
         * Performs a hit test.
         * @param {number} x The <i>x</i>-coordinate.
         * @param {number} y The <i>y</i>-coordinate.
         * @returns {Object} The hit test information.
         */
        hitTest(x: number, y: number, forMove?: boolean): IHitTestInformation;
        /**
         * Invalidates the sheet layout.
         */
        invalidateLayout(): void;
        /**
         * Gets whether the specified column is bound to a data source.
         * @param {number} column The column index.
         * @returns {boolean} <c>true</c> if the column is bound; otherwise, <c>false</c>.
         */
        isColumnBound(column: number): boolean;
        /**
         * Gets whether the sheet is in edit mode.
         * @returns {boolean} <c>true</c> if the sheet is in edit mode; otherwise, <c>false</c>.
         */
        isEditing(): boolean;
        /**
         * Gets or sets a property that indicates whether to refresh manually or automatically
         * after changing Spread settings.
         * @param {boolean} value Whether to refresh automatically.
         * @returns {Object} If you call this function without a parameter, it returns a boolean indicating whether to refresh automatically.
         * Otherwise, it returns the current Spread object.
         */
        isPaintSuspended(value?: boolean): any;
        /**
         * Determines whether the cell value is valid.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @param {Object} value The cell value.
         * @returns {boolean} <c>true</c> if the value is valid; otherwise, <c>false</c>.
         */
        isValid(row: number, column: number, value: Object): boolean;
        /**
         * Changes the table location.
         * @param {GcSpread.Sheets.SheetTable} table The table instance to move.
         * @param {number} row The new row index.
         * @param {number} column The new column index.
         * @returns {GcSpread.Sheets.Sheet} The sheet that contains the table that was moved.
         */
        moveTable(table: SheetTable, row: number, column: number): Sheet;
        /**
         * Changes the table location.
         * @param {string} name The name of the table to move.
         * @param {number} row The new row index.
         * @param {number} column The new column index.
         * @returns {GcSpread.Sheets.Sheet} The sheet in which the table was moved.
         */
        moveTableByName(name: string, row: number, column: number): Sheet;
        /**
         * Moves data from one range to another.
         * @param {number} fromRow The source row.
         * @param {number} fromColumn The source column.
         * @param {number} toRow The target row.
         * @param {number} toColumn The target column.
         * @param {number} rowCount The row count.
         * @param {number} columnCount The column count.
         * @param {GcSpread.Sheets.CopyToOption} option The copy option.
         */
        moveTo(fromRow: number, fromColumn: number, toRow: number, toColumn: number, rowCount: number, columnCount: number, option: CopyToOption): void;
        /**
         * Recalculates all the formulas in the sheet.
         */
        recalcAll(): void;
        /**
         * Gets or sets the style for cell and range references in cell formulas on this sheet.
         * @param {GcSpread.Sheets.ReferenceStyle} value The reference style.
         * @returns {GcSpread.Sheets.ReferenceStyle} The reference style.
         */
        referenceStyle(value?: ReferenceStyle): any;
        /**
         * Removes the specified user-defined custom function.
         * @param {string} name The name of the custom function to remove.
         */
        removeCustomFunction(name: string): void;
        /**
         * Removes a custom function description.
         * @param {string} name The custom function description name.
         */
        removeCustomFunctionDescription(name: string): void;
        /**
         * Removes a custom name from the custom name collection.
         * @param {string} name The custom name.
         */
        removeCustomName(name: string): void;
        /**
         * Removes the custom floating object with the specified name.
         * @param {string} name The name of the custom floating object to remove.
         */
        removeFloatingObject(name: string): void;
        /**
         * Removes the shortcut key for the specified action.
         * @param {number} keyCode The unicode for the key.
         * @param {boolean} ctrl <c>true</c> if the action uses the Ctrl key; otherwise, <c>false</c>.
         * @param {boolean} shift <c>true</c> if the action uses the Shift key; otherwise, <c>false</c>.
         * @param {boolean} alt <c>true</c> if the action uses the Alt key; otherwise, <c>false</c>.
         * @param {boolean} meta <c>true</c> if the action uses the Command key on the Macintosh or the Windows key on Microsoft Windows; otherwise, <c>false</c>.
         */
        removeKeyMap(keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, meta: boolean): void;
        /**
         * Removes a style from the sheet named styles collection which has the specified name.
         * @param {string} name The name of the style to remove.
         */
        removeNamedStyle(name: string): void;
        /**
         * Removes the picture with the specified name.
         * @param {string} name The name of the picture to remove.
         */
        removePicture(name: string): void;
        /**
         * Removes the span that contains a specified anchor cell in the specified sheet area.
         * @param {number} row The row index of the anchor cell for the span (at which spanned cells start).
         * @param {number} col The column index of the anchor cell for the span (at which spanned cells start).
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         */
        removeSpan(row: number, col: number, sheetArea?: SheetArea): void;
        /**
         * Removes the sparkline for the specified cell.
         * @param {number} row The row index.
         * @param {number} col The column index.
         */
        removeSparkline(row: number, col: number): void;
        /**
         * Removes a specified table.
         * @param {GcSpread.Sheets.SheetTable} table The table instance to remove.
         * @returns {GcSpread.Sheets.Sheet} The sheet from which the table was removed.
         */
        removeTable(table: SheetTable): Sheet;
        /**
         * Removes the table with the specified name.
         * @param {string" name="name"> name The name of the table to remove.
         * @returns {GcSpread.Sheets.Sheet} The sheet from which the table was removed.
         */
        removeTableByName(name: string): Sheet;
        /**
         * Repaints the specified rectangle.
         * @param {any} clipRect The rectangle to repaint.
         */
        repaint(clipRect?: any): void;
        /**
         * Resets the sheet.
         */
        reset(): void;
        /**
         * Changes the table size.
         * @param {GcSpread.Sheets.SheetTable} table The table to resize.
         * @param {number} rowCount The new table row count.
         * @param {number} ColumnCount The new table column count.
         * @returns {GcSpread.Sheets.Sheet} The sheet that contains the table.
         */
        resizeTable(table: SheetTable, rowCount: number, columnCount: number): Sheet;
        /**
         * Changes the table size.
         * @param {string} name The name of the table to resize.
         * @param {number} rowCount The new table row count.
         * @param {number} ColumnCount The new table column count.
         * @returns {GcSpread.Sheets.Sheet} The sheet that contains the table.
         */
        resizeTableByName(name: string, rowCount: number, columnCount: number): Sheet;
        /**
         * Resumes the calculation service.
         * @param {boolean} recalcAll Specifies whether to recalculate all formulas.
         */
        resumeCalcService(recalcAll?: boolean): void;
        /**
         * Resumes the event.
         */
        resumeEvent(): void;
        /**
         * Gets or sets the row filter for the sheet.
         * @param {GcSpread.Sheets.HideRowFilter} value The row filter for the sheet.
         * @returns {GcSpread.Sheets.HideRowFilter} The row filter for the sheet.
         */
        rowFilter(value?: RowFilterBase): any;
        /**
         * Searches the specified content.
         * @param {GcSpread.Sheets.SearchCondition} searchCondition The search condition.
         * @returns {GcSpread.Sheets.SearchResult} The search result.
         */
        search(searchCondition: SearchCondition): SearchResult;
        /**
         * Gets or sets the selection's background color for the sheet.
         * @param {string} value The selection's background color for the sheet.
         * @returns {Object} The selection's background color for the sheet.
         */
        selectionBackColor(value?: string): any;
        /**
         * Gets or sets the selection's border color for the sheet.
         * @param {string} value The selection's border color for the sheet.
         * @returns {Object} The selection's border color for the sheet.
         */
        selectionBorderColor(value?: string): any;
        /**
         * Gets or sets whether users can select ranges of items.
         * @param {GcSpread.Sheets.SelectionPolicy} value Whether users can select single items, ranges, or a combination of both.
         * @returns {Object} The selection policy setting.
         */
        selectionPolicy(value?: SelectionPolicy): any;
        /**
         * Gets or sets whether users can select cells, rows, or columns.
         * @param {GcSpread.Sheets.SelectionUnit} value Whether users can select cells, rows, or columns.
         * @returns {Object} The selection unit setting.
         */
        selectionUnit(value?: SelectionUnit): any;
        /**
         * Sets the active cell for this sheet.
         * @param {number} row The row index of the cell.
         * @param {number} col The column index of the cell.
         * @param {number} rowViewportIndex The row viewport index of the cell.
         * @param {number} colViewportIndex The column viewport index of the cell.
         */
        setActiveCell(row: number, col: number, rowViewportIndex?: number, colViewportIndex?: number): void;
        /**
         * Sets the values in the specified two-dimensional array of objects into the specified range of cells on this sheet.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @param {Array} array The array from which to set values.
         * @param {boolean} setFormula If <c>true</c>, set formulas; otherwise, set values.
         */
        setArray(row: number, column: number, array: any[], setFormula?: boolean): void;
        /**
         * Sets a formula in a specified cell in the specified sheet area.
         * @param {number} row The start row index.
         * @param {number} col The start column index.
         * @param {number} rowCount The number of rows in range.
         * @param {number} colCount The number of columns in range.
         * @param {string} value The array formula to place in the specified range.
         */
        setArrayFormula(row: number, col: number, rowCount: number, colCount: number, value: string): void;
        /**
         * Sets the binding path for cell-level binding in a specified cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {string} path The binding path for the cell binding source.
         */
        setBindingPath(row: number, col: number, path: string): Sheet;
        /**
         * Sets the border for the specified area.
         * @param {GcSpread.Sheets.Range} cellRange The cell range.
         * @param {GcSpread.Sheets.LineBorder} border The border line.
         * @param {Object} option Determines which part of the cell range to set.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area.
         */
        setBorder(cellRange: Range, border: LineBorder, option: any, sheetArea?: SheetArea): void;
        /**
         * Sets the cell type.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.BaseCellType} value The cell type.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         */
        setCellType(row: number, col: number, value: BaseCellType, sheetArea?: SheetArea): void;
        /**
         * Sets the column count in the specified sheet area.
         * @param {number} colCount The column count.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         */
        setColumnCount(colCount: number, sheetArea?: SheetArea): void;
        /**
         * Sets a value that indicates whether the column header displays letters or numbers or is blank.
         * @param {GcSpread.Sheets.HeaderAutoText} autoText A value that indicates what the column header displays.
         */
        setColumnHeaderAutoText(autoText: HeaderAutoText): void;
        /**
         * Sets which column header row displays the automatic text when there are multiple column header rows.
         * @param {number} autoTextIndex The row index of the column header that displays the automatic text.
         */
        setColumnHeaderAutoTextIndex(autoTextIndex: number): void;
        /**
         * Sets a value that indicates whether the column header is visible.
         * @param {boolean} visible Whether the column header is visible.
         */
        setColumnHeaderVisible(visible: boolean): void;
        /**
         * Sets whether users can resize the specified column in the specified sheet area.
         * @param {number} col The column index.
         * @param {boolean} value Set to <c>true</c> to allow users to resize the column.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         */
        setColumnResizable(col: number, value: boolean, sheetArea?: SheetArea): void;
        /**
         * Sets whether a column in the specified sheet area is displayed.
         * @param {number} col The column index.
         * @param {boolean} value Whether to display the column.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         */
        setColumnVisible(col: number, value: boolean, sheetArea?: SheetArea): void;
        /**
         * Sets the width in pixels for the specified column in the specified sheet area.
         * @param {number} col The column index.
         * @param {number} value The width in pixels.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to viewport.
         */
        setColumnWidth(col: number, value: number, sheetArea?: SheetArea): void;
        /**
         * Sets a comment for the specified cell.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.Comment} comment The comment.
         */
        setComment(row: number, col: number, value: Comment): void;
        /**
         * Sets delimited text (CSV) in the sheet.
         * @param {number} row The start row.
         * @param {number} column The start column.
         * @param {string} text The delimited text.
         * @param {string} rowDelimiter The row delimiter.
         * @param {string} columnDelimiter The column delimiter.
         * @param {GcSpread.Sheets.TextFileOpenFlags} flags The import flags.
         */
        setCsv(row: number, column: number, text: string, rowDelimiter: string, columnDelimiter: string, flags: TextFileOpenFlags): void;
        /**
         * Sets the data context to bind.
         * @param {Object} dataContext The data context.
         */
        setDataContext(dataContext: any): void;
        /**
         * Sets the data source that populates the sheet.
         * @param {Object} data The data source.
         * @param {boolean} reset <c>true</c> if the sheet is reset; otherwise, <c>false</c>.
         */
        setDataSource(data: any, reset?: boolean): void;
        /**
         * Sets the cell data validator.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.DefaultDataValidator} value The data validator.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         */
        setDataValidator(row: number, col: number, value: DefaultDataValidator, sheetArea?: SheetArea): void;
        /**
         * Sets the default style information for the sheet.
         * @param {GcSpread.Sheets.Style} style The style to set.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         */
        setDefaultStyle(style: Style, sheetArea?: SheetArea): void;
        /**
         * Sets the <i>z</i>-index of the floating object.
         * @param {string} name The name of the floating object.
         * @param {number} zIndex The <i>z</i>-index.
         */
        setFloatingObjectZIndex(name: string, zIndex: number): void;
        /**
         * Sets the cell formatter.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {Object} value The formatter string or object.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         */
        setFormatter(row: number, col: number, value: any, sheetArea?: SheetArea): void;
        /**
         * Sets a formula in a specified cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {string} value The formula to place in the specified cell.
         */
        setFormula(row: number, col: number, value: string): void;
        /**
         * Sets the number of frozen columns.
         * @param {number} colCount The number of columns to freeze.
         */
        setFrozenColumnCount(colCount: number): void;
        /**
         * Set the number of frozen rows.
         * @param {number} rowCount The number of rows to freeze.
         */
        setFrozenRowCount(rowCount: number): void;
        /**
         * Sets the number of trailing frozen columns.
         * @param {number} colCount The number of columns to freeze at the right side of the sheet.
         */
        setFrozenTrailingColumnCount(colCount: number): void;
        /**
         * Sets the number of trailing frozen rows.
         * @param {number} rowCount The number of rows to freeze at the bottom of the sheet.
         */
        setFrozenTrailingRowCount(rowCount: number): void;
        /**
         * Sets the grid line's options.
         * @param {Object} options The grid line options.
         */
        setGridlineOptions(options: ISheetGridlineOption): void;
        /**
         * Sets a value that indicates whether cells on this sheet that are marked as protected cannot be edited.
         * @param {boolean} isProtected Whether cells on this sheet that are marked as protected cannot be edited.
         */
        setIsProtected(isProtected: boolean): void;
        /**
         * Sets the name of this sheet.
         * @param {string} name The sheet name.
         */
        setName(name: string): void;
        /**
         * Sets the row count in the specified sheet area.
         * @param {number} rowCount The row count.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         */
        setRowCount(rowCount: number, sheetArea?: SheetArea): void;
        /**
         * Sets a value that indicates whether the row header displays letters or numbers or is blank.
         * @param {GcSpread.Sheets.HeaderAutoText} autoText A value that indicates what the row header displays.
         */
        setRowHeaderAutoText(autoText: HeaderAutoText): void;
        /**
         * Sets which row header column displays the automatic text when there are multiple row header columns.
         * @param {number} autoTextIndex The column index of the row header that displays the automatic text.
         */
        setRowHeaderAutoTextIndex(autoTextIndex: number): void;
        /**
         * Sets a value that indicates whether the row header is visible.
         * @param {boolean} visible Whether the row header is visible.
         */
        setRowHeaderVisible(visible: boolean): void;
        /**
         * Sets the height in pixels for the specified row in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} value The height in pixels.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         */
        setRowHeight(row: number, value: number, sheetArea?: SheetArea): void;
        /**
         * Sets whether users can resize the specified row in the specified sheet area.
         * @param {number} row The row index.
         * @param {boolean} value Set to <c>true</c> to let the users resize the specified row.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         */
        setRowResizable(row: number, value: boolean, sheetArea?: SheetArea): void;
        /**
         * Sets whether the control displays the specified row in the specified sheet area.
         * @param {number} row The row index.
         * @param {boolean} value Set to <c>true</c> to display the specified row.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not given, it will default to <b>viewport</b>.
         */
        setRowVisible(row: number, value: boolean, sheetArea?: SheetArea): void;
        /**
         * Sets the selection to a cell or a range and sets the active cell to the first cell.
         * @param {number} row The row index of the first cell to add.
         * @param {number} column The column index of the first cell to add.
         * @param {number} rowCount The number of rows to add.
         * @param {number} columnCount The number of columns to add.
         */
        setSelection(row: number, column: number, rowCount: number, columnCount: number): void;
        /**
         * Sets the sparkline for a cell.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.Range} dataRange The data range.
         * @param {GcSpread.Sheets.DataOrientation} dataOrientation The data orientation.
         * @param {GcSpread.Sheets.SparklineType} sparklineType The sparkline type.
         * @param {GcSpread.Sheets.SparklineSetting} sparklineSetting The sparkline setting.
         * @param {GcSpread.Sheets.Range} dateAxisRange The date axis range.
         * @param {GcSpread.Sheets.DataOrientation} dateAxisOrientation The date axis range orientation.
         * @returns {GcSpread.Sheets.Sparkline} The sparkline.
         */
        setSparkline(row: number, col: number, dataRange: Range, dataOrientation: DataOrientation, sparklineType: SparklineType, sparklineSetting: SparklineSetting, dateAxisRange?: Range, dateAxisOrientation?: DataOrientation): Sparkline;
        /**
         * Sets the style information for a specified cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @param {GcSpread.Sheets.Style} value The cell style.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         */
        setStyle(row: number, col: number, value: Style, sheetArea?: SheetArea): void;
        /**
         * Sets the specified style name for a specified cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @param {string} value The name of the style to set.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         */
        setStyleName(row: number, col: number, value: string, sheetArea?: SheetArea): void;
        /**
         * Sets the tag value for the specified cell in the specified sheet area.
         * @param {nubmer} row The row index.
         * @param {number} col The column index.
         * @param {Object} tag The tag value to set for the specified cell.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         */
        setTag(row: number, col: number, tag: any, sheetArea?: SheetArea): void;
        /**
         * Sets the formatted text in the cell in the specified sheet area.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {string} value The text for the specified cell.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         */
        setText(row: number, col: number, value: string, sheetArea?: SheetArea): void;
        /**
         * Sets the value for the specified cell in the specified sheet area.
         * @param {nubmer} row The row index.
         * @param {number} col The column index.
         * @param {Object} value The value to set for the specified cell.
         * @param {GcSpread.Sheets.SheetArea} sheetArea The sheet area. If this parameter is not provided, it will default to <b>viewport</b>.
         * @param {boolean} ignoreRecalc Whether to ignore recalculate or not.
         */
        setValue(row: number, col: number, value: Object, sheetArea?: SheetArea, ignoreRecalc?: boolean): void;
        /**
         * Gets or sets a color string used to represent the sheet tab color, such as "red", "#FFFF00", "rgb(255,0,0)", "Accent 5", and so on.
         * @param {string} value The color string.
         * @returns {Object} The color string used to represent the sheet tab color.
         */
        sheetTabColor(value?: string): any;
        /**
         * Moves the view of a cell to the specified position in the viewport.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.VerticalPosition} verticalPosition The vertical position in which to display the cell.
         * @param {GcSpread.Sheets.HorizontalPosition} horizontalPosition The horizontal position in which to display the cell.
         */
        showCell(row: number, col: number, verticalPosition: VerticalPosition, horizontalPosition: HorizontalPosition): void;
        /**
         * Moves the view of a column to the specified position in the viewport.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.HorizontalPosition} horizontalPosition The horizontal position in which to display the column.
         */
        showColumn(col: number, horizontalPosition: HorizontalPosition): void;
        /**
         * Gets or sets whether the column range group is visible.
         * @param {boolean} value Whether to display the column range group.
         * @returns {boolean} A value that indicates whether the column range group is displayed on this sheet.
         */
        showColumnRangeGroup(value?: boolean): any;
        /**
         * Moves the view of a row to the specified position in the viewport.
         * @param {number} row The row index.
         * @param {GcSpread.Sheets.VerticalPosition} verticalPosition The vertical position in which to display the row.
         */
        showRow(row: number, verticalPosition: VerticalPosition): void;
        /**
         * Gets or sets whether the row range group is visible.
         * @param {boolean} value Whether to display the row range group.
         * @returns {boolean} A value that indicates whether the row range group is displayed on this sheet.
         */
        showRowRangeGroup(value?: boolean): any;
        /**
         * Sorts a range of cells in this sheet in the data model.
         * @param {number} row The index of the starting row of the block of cells to sort.
         * @param {number} column The index of the starting column of the block of cells to sort.
         * @param {number} rowCount The number of rows in the block of cells.
         * @param {number} columnCount The number of columns in the block of cells.
         * @param {boolean} byRows Set to <c>true</c> to sort by rows, and <c>false</c> to sort by columns.
         * @param {Object} sortInfo The SortInfo object with sort criteria and information about how to perform the sort. For example, [{index:0,ascending:true}]
         * @returns {boolean} <c>true</c> if the data is sorted successfully; otherwise, <c>false</c>.
         */
        sortRange(row: number, column: number, rowCount: number, columnCount: number, byRows: boolean, sortInfo: any): boolean;
        /**
         * Starts to edit the cell.
         * @param {boolean} selectAll Set to <c>true</c> to select all the text in the cell.
         * @param {string} defaultText The default text to display while editing the cell.
         */
        startEdit(selectAll?: boolean, defaultText?: string): void;
        /**
         * Suspends the calculation service.
         * @param {boolean} ignoreDirty Specifies whether to invalidate the dependency cells.
         */
        suspendCalcService(ignoreDirty?: boolean): void;
        /**
         * Suspends the event.
         */
        suspendEvent(): void;
        /**
         * Gets or sets the tag value for the current sheet.
         * @param {Object} value The tag value to set for the current sheet.
         * @returns {Object} Returns the tag value of the current sheet.
         */
        tag(value?: any): any;
        /**
         * Saves the object state to a JSON string.
         * @param {Object} serializationOption Serialization option that contains the <i>includeBindingSource</i> argument. See the Remarks for more information.
         * @returns {Object} The sheet data.
         */
        toJSON(serializationOption: ISerializationOption): Object;
        /**
         * Removes the binding of an event to the sheet.
         * @param {string} type The event type.
         * @param {Function} fn Specifies the function for which to remove the binding.
         */
        unbind(type: string, fn?: Function): void;
        /**
         * Removes the binding of all events to the sheet.
         */
        unbindAll(): void;
        /**
         * Gets the undo manager.
         */
        undoManager(): IUndoManager;
        /**
         * Ungroups the sparklines in the specified group.
         * @param {GcSpread.Sheets.SparklineGroup} group The sparkline group.
         */
        ungroupSparkline(group: SparklineGroup): void;
        /**
         * Sets whether the sheet is displayed.
         * @param {boolean} value Whether the sheet is displayed.
         * @returns {Object} If you call this function without a parameter, it returns a boolean indicating whether the sheet is visible or not.
         * Otherwise, it returns the current sheet object.
         */
        visible(value?: boolean): any;
        /**
         * Gets or sets the zoom factor for the sheet.
         * @param {number} factor The zoom factor.
         * @returns {number} The zoom factor.
         */
        zoom(factor: number): any;
    }

    export class SheetTable{
        /**
         * Represents a table that can be added in a sheet.
         * @class
         * @param {string} name The table name.
         * @param {number} row The table row index.
         * @param {number} col The table column index.
         * @param {number} rowCount The table row count.
         * @param {number} colCount The table column count.
         * @param {GcSpread.Sheets.TableStyle} style The table style.
         */
        constructor(name?: string, row?: number, col?: number, rowCount?: number, colCount?: number, style?: TableStyle);
        /**
         * Gets or sets a value that indicates whether to generate columns automatically while binding to a data source.
         * @returns {boolean | GcSpread.Sheets.SheetTable} If a value is set, returns <c>true</c> if the table generates columns automatically while binding to a data source; otherwise, <c>false</c>. If the value is not set, it returns the table itself.
         */
        autoGenerateColumns(value?: boolean): any;
        /**
         * Gets or sets a value that indicates whether to display an alternating column style.
         * @returns {boolean | GcSpread.Sheets.SheetTable} If a value is set, returns <c>true</c> if the table displays an alternating column style; otherwise, <c>false</c>. If the value is not set, it returns the table itself.
         */
        bandColumns(value?: boolean): any;
        /**
         * Gets or sets a value that indicates whether to display an alternating row style.
         * @returns {boolean | GcSpread.Sheets.SheetTable} If a value is set, returns <c>true</c> if the table displays an alternating row style; otherwise, <c>false</c>. If the value is not set, it returns the table itself.
         */
        bandRows(value?: boolean): any;
        /**
         * Binds the columns using the specified data fields.
         * @param {TableColumnInfo} columns The array of table column information with data fields and names.
         */
        bindColumns(columns: TableColumnInfo[]): any;
        /**
         * Gets or sets a value that indicates the binding path for cell-level binding in the table.
         * @returns {string | GcSpread.Sheets.SheetTable} If a value is set, returns the binding path for cell-level binding in the table. If the value is not set, it returns the table itself.
         */
        bindingPath(value?: string): any;
        /**
         * Gets the cell range for the table data area.
         * @returns {GcSpread.Sheets.Range} The table data range.
         */
        dataRange(): Range;
        /**
         * Gets or sets whether the table column's filter button is displayed.
         * @param {number} tableColumnIndex The table column index of the filter button.
         * @param {boolean} value Whether the table column's filter button is displayed.
         * @returns {boolean} The table column's filter button display state.
         */
        filterButtonVisible(tableColumnIndex?: number, value?: boolean): any;
        /**
         * Gets the footer index in the sheet.
         * @returns {number} The footer index.
         */
        footerIndex(): number;
        /**
         * Gets the table footer formula with the specified index.
         * @param {number} tableColumnIndex The column index of the table footer. The index is zero-based.
         * @returns {string} The table footer formula.
         */
        getColumnFormula(tableColumnIndex: number): string;
        /**
         * Gets the table header text with the specified table index.
         * @param {number}  tableColumnIndex The column index of the table header. The index is zero-based.
         * @returns {string} The text of the specified header cell.
         */
        getColumnName(tableColumnIndex: number): string;
        /**
         * Gets the table footer value with the specified index.
         * @param {number} tableColumnIndex The column index of the table footer. The index is zero-based.
         * @returns {string} The table footer value.
         */
        getColumnValue(tableColumnIndex: number): any;
        /**
         * Gets the header index in the sheet.
         * @returns {number} The header index.
         */
        headerIndex(): number;
        /**
         * Gets or sets a value that indicates whether to highlight the first column.
         * @returns {boolean | GcSpread.Sheets.SheetTable} If a value is set, returns <c>true</c> if the table highlights the first column; otherwise, <c>false</c>. If the value is not set, it returns the table itself.
         */
        highlightFirstColumn(value?: boolean): any;
        /**
         * Gets or sets a value that indicates whether to highlight the last column.
         * @returns {boolean | GcSpread.Sheets.SheetTable} If a value is set, returns <c>true</c> if the table highlights the last column; otherwise, <c>false</c>. If the value is not set, it returns the table itself.
         */
        highlightLastColumn(value?: boolean): any;
        /**
         * Gets or sets the table name.
         * @returns {string | GcSpread.Sheets.SheetTable} Returns the table name; if it does not have a name, it returns the table itself.
         */
        name(value?: string): any;
        /**
         * Gets the range for the whole table.
         * @returns {GcSpread.Sheets.Range} The whole table range.
         */
        range(): Range;
        /**
         * Reloads the data from a data source.
         */
        refresh(): void;
        /**
         * Gets the row filter for the table.
         * @returns {GcSpread.Sheets.HideRowFilter} The row filter.
         */
        rowFilter(): HideRowFilter;
        /**
         * Sets a formula to the table's data range with the specified index.
         * @param {number} tableColumnIndex The column index of the table. The index is zero-based.
         * @param {string} formula The data range formula.
         * @returns {GcSpread.Sheets.SheetTable} The table.
         */
        setColumnDataFormula(tableColumnIndex: number, formula: string): SheetTable;
        /**
         * Sets the table footer formula with the specified index.
         * @param {number} tableColumnIndex The column index of the table footer. The index is zero-based.
         * @param {string} formula The table footer formula.
         * @returns {GcSpread.Sheets.SheetTable} The table.
         */
        setColumnFormula(tableColumnIndex: number, formula: string): SheetTable;
        /**
         * Sets the table header text with the specified table index.
         * @param {string} tableColumnIndex The column index of the table header. The index is zero-based.
         * @param {string} name The header text.
         * @returns {GcSpread.Sheets.SheetTable} The table.
         */
        setColumnName(tableColumnIndex: number, name: string): SheetTable;
        /**
         * Sets the table footer value with the specified index.
         * @param {number} tableColumnIndex The column index of the table footer. The index is zero-based.
         * @param {Object} value The table footer value.
         * @returns {GcSpread.Sheets.SheetTable} The table.
         */
        setColumnValue(tableColumnIndex: number, value: Object): SheetTable;
        /**
         * Gets or sets a value that indicates whether to display a footer.
         * @returns {boolean | GcSpread.Sheets.SheetTable} If a value is set, returns <c>true</c> if the table displays a footer; otherwise, <c>false</c>. If the value is not set, it returns the table itself.
         */
        showFooter(value?: boolean): any;
        /**
         * Gets or sets a value that indicates whether to display a header.
         * @returns {boolean | GcSpread.Sheets.SheetTable} If a value is set, returns <c>true</c> if the table displays a header; otherwise, <c>false</c>. If the value is not set, it returns the table itself.
         */
        showHeader(value?: boolean): any;
        /**
         * Gets or sets a style for the table.
         * @returns {GcSpread.Sheets.TableStyle | GcSpread.Sheets.SheetTable} Returns the style for the table. If the style is not set, it returns the table itself.
         */
        style(value?: TableStyle): any;
    }

    export class Sparkline{
        /**
         * Represents a Sparkline class.
         * @param {number} row The row index.
         * @param {number} column The column index.
         * @param {GcSpread.Sheets.Range} dataReference The data range to which the sparkline refers.
         * @param {GcSpread.Sheets.DataOrientation} dataOrientation The orientation of the data range.
         * @param {GcSpread.Sheets.SparklineType} type The type of sparkline.
         * @param {GcSpread.Sheets.SparklineSetting} setting The setting of the sparkline.
         * @class
         */
        constructor(row?: number, column?: number, dataReference?: Range, dataOrientation?: DataOrientation, type?: SparklineType, setting?: SparklineSetting);
        /** Gets the column index.
         * @type {number>}
         */
        column: any;
        /** Gets the row index.
         * @type {number>}
         */
        row: any;
        /**
         * Clones a sparkline.
         * @returns {GcSpread.Sheets.Sparkline} The new sparkline.
         */
        clone(): Sparkline;
        /**
         * Gets or sets the data object.
         * @param {GcSpread.Sheets.Range} value The sparkline data.
         * @returns {GcSpread.Sheets.Range} The sparkline data.
         */
        data(value?: Range): any;
        /**
         * Gets or sets the data orientation.
         * @param {GcSpread.Sheets.DataOrientation} value The sparkline data orientation.
         * @returns {GcSpread.Sheets.DataOrientation} The sparkline data orientation.
         */
        dataOrientation(value?: DataOrientation): any;
        /**
         * Gets or sets the date axis data object.
         * @param {GcSpread.Sheets.Range} value The sparkline date axis data.
         * @returns {GcSpread.Sheets.Range} The sparkline date axis data.
         */
        dateAxisData(value?: Range): any;
        /**
         * Gets or sets the date axis orientation.
         * @param {GcSpread.Sheets.DataOrientation} value The sparkline date axis orientation.
         * @returns {GcSpread.Sheets.DataOrientation} The sparkline date axis orientation.
         */
        dateAxisOrientation(value?: DataOrientation): any;
        /**
         * Gets or sets a value that indicates whether to display the date axis.
         * @param {boolean} value Whether to display the date axis.
         * @returns {boolean} <c>true</c> if the date axis is displayed; otherwise, <c>false</c>.
         */
        displayDateAxis(value?: boolean): any;
        /**
         * Gets or sets the sparkline group.
         * @param {GcSpread.Sheets.SparklineGroup} value The sparkline group.
         * @returns {GcSpread.Sheets.SparklineGroup} The sparkline group.
         */
        group(value?: SparklineGroup): any;
        /**
         * Processes the sparkline changed event.
         * @param {GcSpread.Sheets.SparklineType} value The sparkline type.
         * @returns {GcSpread.Sheets.SparklineType} The sparkline type.
         */
        onSparklineChanged(): void;
        /**
         * Paints the sparkline in the specified area.
         * @param {CanvasRenderingContext2D} ctx The canvas's two-dimensional context.
         * @param {number} x <i>x</i>-coordinate relative to the canvas.
         * @param {number} y <i>y</i>-coordinate relative to the canvas.
         * @param {number} w The width of the cell that contains the sparkline.
         * @param {number} h The height of the cell that contains the sparkline.
         */
        paintSparkline(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void;
        /**
         * Gets or sets the sparkline setting of the cell.
         * @param {GcSpread.Sheets.SparklineSetting} value The sparkline setting.
         * @returns {GcSpread.Sheets.SparklineSetting} The sparkline setting.
         */
        setting(value?: SparklineSetting): any;
        /**
         * Gets or sets the type of the sparkline.
         * @param {GcSpread.Sheets.SparklineType} value The sparkline type.
         * @returns {GcSpread.Sheets.SparklineType} The sparkline type.
         */
        sparklineType(value?: SparklineType): any;
    }

    export class SparklineEx{
        /**
         * Represents the base class for the other SparklineEx classes.
         * @class
         */
        constructor();
        /**
         * Represents the type name string used for supporting serialization.
         * @type {string}
         */
        typeName: string;
        /**
         * Creates a custom function used to provide data and settings for SparklineEx.
         * @returns {GcSpread.Sheets.Calc.Functions.Function} The created custom function.
         */
        createFunction(): Calc.Functions.Function;
        /**
         * Loads the object state from the specified JSON string.
         * @param {Object} settings The sparklineEx data from deserialization.
         */
        fromJSON(settings: Object): void;
        /**
         * Gets the name of SparklineEx.
         * @returns {string} The SparklineEx's name.
         */
        name(): string;
        /**
         * Paints the SparklineEx on the canvas.
         * @param {CanvasRenderingContext2D} context The canvas's two-dimensional context.
         * @param {object} value The value evaluated by the custom function.
         * @param {number} x <i>x</i>-coordinate relative to the canvas.
         * @param {number} y <i>y</i>-coordinate relative to the canvas.
         * @param {number} width The cell's width.
         * @param {number} height The cell's height.
         */
        paint(context: CanvasRenderingContext2D, value: any, x: number, y: number, width: number, height: number): void;
        /**
         * Saves the object state to a JSON string.
         * @returns {Object} The sparklineEx data.
         */
        toJSON(): Object;
    }

    export class SparklineGroup{
        /**
         * Represents a sparkline group.
         * @param {GcSpread.Sheets.SparklineType} type The type of sparkline.
         * @param {SparklineSetting} setting The setting of the sparkline group.
         * @class
         */
        constructor(type?: SparklineType, setting?: SparklineSetting);
        /** Indicates the sparkline settings.
         * @type {GcSpread.Sheets.SparklineSetting}
         */
        setting: any;
        /** Indicates the sparkline type.
         * @type {GcSpread.Sheets.SparklineType}
         */
        sparklineType: any;
        /**
         * Adds a sparkline to the group.
         * @param {GcSpread.Sheets.Sparkline} item The sparkline item.
         */
        add(item: Sparkline): void;
        /**
         * Clones the current sparkline group.
         */
        clone(): SparklineGroup;
        /**
         * Determines whether the group contains a specific value.
         * @param {GcSpread.Sheets.Sparkline} item The object to locate in the group.
         * @returns {boolean} <c>true</c> if the item is found in the group; otherwise, <c>false</c>.
         */
        contains(item: Sparkline): boolean;
        /**
         * Represents the count of the sparkline group innerlist.
         * @returns {number} The sparkline count in the group.
         */
        count(): number;
        /**
         * Represents the date axis data.
         * @param {GcSpread.Sheets.Range} value The date axis data.
         * @returns {GcSpread.Sheets.Range} The date axis data.
         */
        dateAxisData(value?: Range): Range;
        /**
         * Represents the date axis orientation.
         * @param {GcSpread.Sheets.DataOrientation} value The date axis orientation.
         * @returns {GcSpread.Sheets.DataOrientation} The date axis orientation.
         */
        dateAxisOrientation(value: DataOrientation): DataOrientation;
        /**
         * Processes group changed event.
         */
        onGroupChanged(): void;
        /**
         * Removes the first occurrence of a specific object from the group.
         * @param {GcSpread.Sheets.Sparkline} item The sparkline item.
         * @returns {Array} The GcSpread.Sheets.Sparkline array.
         */
        remove(item: Sparkline): Sparkline[];
    }

    export class SparklineSetting{
        /**
         * Creates the sparkline settings.
         * @param {object} setting The settings.
         * @class
         */
        constructor(setting?: any);
        /** Indicates how to display the empty cells.
         * @type {GcSpread.Sheets.EmptyValueStyle}
         */
        displayEmptyCellsAs: any;
        /** Indicates whether data in hidden cells is plotted for the sparklines in this sparkline group.
         * @type {boolean}
         */
        displayHidden: any;
        /** Indicates whether the horizontal axis is displayed for each sparkline in this sparkline group.
         * @type {boolean}
         */
        displayXAxis: any;
        /** Gets the maximum value of the sparkline group.
         * @type {number}
         */
        groupMaxValue: any;
        /** Gets the minimum value of the sparkline group.
         * @type {number}
         */
        groupMinValue: any;
        /** Indicates the line weight for each sparkline in the sparkline group, where the line weight is measured in points. The weight must be greater than or equal to zero, and must be less than or equal to 3 (LineSeries only supports line weight values in the range of 0.0-3.0).
         * @type {number}
         */
        lineWeight: any;
        /** Indicates the maximum for the vertical axis that is shared across all sparklines in this sparkline group. The axis is zero if maxAxisType does not equal custom.
         * @type {number}
         */
        manualMax: any;
        /** Indicates the minimum for the vertical axis that is shared across all sparklines in this sparkline group. The axis is zero if minAxisType does not equal custom.
         * @type {number}
         */
        manualMin: any;
        /** Indicates how the vertical axis maximum is calculated for the sparklines in this sparkline group.
         * @type {GcSpread.Sheets.SparklineAxisMinMax}
         */
        maxAxisType: any;
        /** Indicates how the vertical axis minimum is calculated for the sparklines in this sparkline group.
         * @type {GcSpread.Sheets.SparklineAxisMinMax}
         */
        minAxisType: any;
        /** Indicates whether each sparkline in the sparkline group is displayed in a right-to-left manner.
         * @type {boolean}
         */
        rightToLeft: any;
        /**
         * Gets or sets the color of the axis.
         * @param {string} value The axis color.
         * @returns {string} The axis color.
         */
        axisColor(value?: string): any;
        /**
         * Clones sparkline settings.
         */
        clone(): SparklineSetting;
        /**
         * Gets or sets the color of the first data point for each sparkline in this sparkline group.
         * @param {string} value The first marker color.
         * @returns {string} The first marker color.
         */
        firstMarkerColor(value?: string): any;
        /**
         * Gets or sets the color of the highest data point for each sparkline in this sparkline group.
         * @param {string} value The highest marker color.
         * @returns {string} The highest marker color.
         */
        highMarkerColor(value?: string): any;
        /**
         * Gets or sets the color of the last data point for each sparkline in this sparkline group.
         * @param {string} value The last marker color.
         * @returns {string} The last marker color.
         */
        lastMarkerColor(value?: string): any;
        /**
         * Gets or sets the color of the lowest data point for each sparkline in this sparkline group.
         * @param {string} value The lowest marker color.
         * @returns {string} The lowest marker color.
         */
        lowMarkerColor(value?: string): any;
        /**
         * Gets or sets a value that specifies the color of the data markers for each sparkline in this sparkline group.
         * @param {string} value The marker color.
         * @returns {string} The marker color.
         */
        markersColor(value?: string): any;
        /**
         * Gets or sets a value that specifies the color of the negative data points for each sparkline in this sparkline group.
         * @param {string} value The negative marker color.
         * @returns {string} The negative marker color.
         */
        negativeColor(value?: string): any;
        /**
         * Gets or sets a value that specifies the color for each sparkline in this sparkline group.
         * @param {string} value The marker color.
         * @returns {string} The marker color.
         */
        seriesColor(value?: string): any;
        /**
         * Gets or sets a value that indicates whether the first data point is formatted differently for each sparkline in this sparkline group.
         * @param {boolean} value Whether to display the first data point with a different format.
         * @returns {boolean} <c>true</c> if the first data point is formatted differently; otherwise, <c>false</c>.
         */
        showFirst(value?: boolean): any;
        /**
         * Gets or sets a value that specifies whether the data points with the highest value are formatted differently for each sparkline in this sparkline group.
         * @param {boolean} value Whether to display the highest data point with a different format.
         * @returns {boolean} <c>true</c> if the highest data point is formatted differently; otherwise, <c>false</c>.
         */
        showHigh(value?: boolean): any;
        /**
         * Gets or sets a value that indicates whether the last data point is formatted differently for each sparkline in this sparkline group.
         * @param {boolean} value Whether to display the last data point with a different format.
         * @returns {boolean} <c>true</c> if the highest data point is formatted differently; otherwise, <c>false</c>.
         */
        showLast(value?: boolean): any;
        /**
         * Gets or sets a value that specifies whether the data points with the lowest value are formatted differently for each sparkline in this sparkline group.
         * @param {boolean} value Whether to display the lowest data point with a different format.
         * @returns {boolean} <c>true</c> if the lowest data point is formatted differently; otherwise, <c>false</c>.
         */
        showLow(value?: boolean): any;
        /**
         * Gets or sets a value that specifies whether data markers are displayed for each sparkline in this sparkline group
         * @param {boolean} value Whether to display data markers.
         * @returns {boolean} <c>true</c> if the data markers are displayed; otherwise, <c>false</c>.
         */
        showMarkers(value?: boolean): any;
        /**
         * Gets or sets a value that specifies whether the negative data points are formatted differently for each sparkline in this sparkline group.
         * @param {boolean} value Whether to display the negative data points with a different format.
         * @returns {boolean} <c>true</c> if the negative data points are formatted differently; otherwise, <c>false</c>.
         */
        showNegative(value?: boolean): any;
    }

    export class SpecificTextRule extends ConditionRuleBase{
        /**
         * Represents a specific text rule based on the specified cell.
         * @extends GcSpread.Sheets.ConditionRuleBase
         * @class
         * @param {GcSpread.Sheets.TextComparisonOperator} operator The operator.
         * @param {string} text The text.
         * @param {GcSpread.Sheets.Style} style The style for the rule.
         */
        constructor(operator: TextComparisonOperator, text: string, style: Style);
        /** The operator.
         * @type {GcSpread.Sheets.TextComparisonOperator}
         */
        operator: any;
        /** The text.
         * @type {string}
         */
        text: any;
        /**
         * Creates a condition for the current rule.
         * @returns {GcSpread.Sheets.TextCondition} The condition for the current rule.
         */
        createCondition(): TextCondition;
        /**
         * Resets the rule.
         */
        reset(): void;
    }

    export class Spread{
        /**
         * Represents a spreadsheet with the specified hosted DOM element and options setting.
         * @class
         * @param {Object} host The host DOM element.
         * @param {GcSpread.Sheets.GcSpreadSheetsOptions} options The initialization options.
         */
        constructor(host?: any, options?: any);
        /** Represents the name of the Spread control.
         * @type {string}
         */
        name: string;
        /** Represents the sheet collection.
         * @type {Array} The GcSpread.Sheets.Sheet Array.
         */
        sheets: Sheet[];
        /**
         * Represents the touch toolstrip.
         * @type {TouchToolStrip}
         */
        touchToolStrip: any;
        /**
         * Adds a custom function.
         * @param {GcSpread.Sheets.Calc.Functions.Function} fn The function to add.
         */
        addCustomFunction(fn: Calc.Functions.Function): void;
        /**
         * Adds a custom function description.
         * @param {Object} fnd The function description to add.
         */
        addCustomFunctionDescription(fnd: IFunctionDescription): void;
        /**
         * Adds a custom name.
         * @param {string} name The custom name.
         * @param {string} formula The formula.
         * @param {number} baseRow The row index.
         * @param {number} baseCol The column index.
         */
        addCustomName(name: string, formula: string, baseRow: number, baseCol: number): void;
        /**
         * Add a style to the Spread named styles collection.
         * @param {GcSpread.Sheets.Style} style The style to be added.
         */
        addNamedStyle(style: Style): void;
        /**
         * Inserts a sheet at the specific index.
         * @param {number} value The index at which to add a sheet.
         * @param {number} sheet The sheet to be added.
         */
        addSheet(index: number, sheet?: Sheet): void;
        /**
         * Adds a SparklineEx to the SparklineEx collection.
         * @param {GcSpread.Sheets.SparklineEx} sparklineEx The SparklineEx to be added.
         */
        addSparklineEx(sparklineEx: SparklineEx): void;
        /**
         * Gets or sets whether the user can change the order of the sheets by dragging their sheet tabs.
         * @param {boolean} value Whether the user can reorder the sheets in the Spread widget.
         * @returns {Object} <c>true</c> if the user can reorder the sheets; otherwise, <c>false</c>.
         */
        allowSheetReorder(value?: boolean): any;
        /**
         * Gets or sets whether to allow the user to undo edit operations.
         * @param {boolean} value Whether to allow the user to undo edits.
         * @returns {Object} <c>true</c> if the user can undo edits; otherwise, <c>false</c>.
         */
        allowUndo(value?: boolean): any;
        /**
         * Gets or sets whether to allow the user to resize columns and rows.
         * @param {boolean} value Whether to allow the user to resize columns and rows.
         * @returns {Object} <c>true</c> if the user is allowed to resize columns and rows; otherwise, <c>false</c>.
         */
        allowUserResize(value?: boolean): any;
        /**
         * Gets or sets whether the user can scale the display of the component using the Ctrl key and the mouse wheel.
         * @param {boolean} value Whether to zoom the display by scrolling the mouse wheel while pressing the Ctrl key.
         * @returns {Object} <c>true</c> if the user can zoom the display by scrolling the mouse wheel while pressing the Ctrl key; otherwise, <c>false</c>.
         */
        allowUserZoom(value?: boolean): any;
        /**
         * Gets or sets whether the content will be automatically formatted to fit within a cell.
         * @param {GcSpread.Sheets.AutoFitType} value Whether content will be formatted to fit in cells or in cells and headers.
         * @returns {GcSpread.Sheets.AutoFitType} A value that indicates whether content will be formatted to fit in cells or in cells and headers.
         */
        autoFitType(value?: AutoFitType): any;
        /**
         * Gets or sets a color string used to represent the background color of the Spread widget, such as "red", "#FFFF00", "rgb(255,0,0)", "Accent 5", and so on.
         * @param {string} value The color string.
         * @returns {Object} The color string used to represent the background color of the spread component.
         */
        backColor(value?: string): any;
        /**
         * Gets or sets an image used to represent the background image of the Spread widget.
         * @param {string} value The image src.
         * @returns {Object} The image src used to represent the background image of the Spread widget.
         */
        backgroundImage(value?: string): any;
        /**
         * Gets or sets the background image layout for the Spread widget.
         * @param {GcSpread.Sheets.ImageLayout} value The background image layout.
         * @returns {Object} The background image layout for the Spread.
         */
        backgroundImageLayout(value?: ImageLayout): any;
        /**
         * Binds an event to the Spread.
         * @param {string} type The event type.
         * @param {Object} data Specifies additional data to pass along to the function.
         * @param {Function} fn Specifies the function to run when the event occurs.
         */
        bind(type: any, data?: any, fn?: any): void;
        /**
         * Gets or sets whether to allow the user to drag and drop cell range data to another range.
         * @param {boolean} value Whether to allow the user to drag and drop range data.
         * @returns {Object} <c>true</c> if the user is allowed to drag and drop range data; otherwise, <c>false</c>.
         */
        canUserDragDrop(value?: boolean): any;
        /**
         * Gets or sets whether to allow the user to drag fill a range of cells.
         * @param {boolean} value Whether to allow the user to drag fill a range.
         * @returns {Object} <c>true</c> if the user is allowed to drag fill; otherwise, <c>false</c>.
         */
        canUserDragFill(value?: boolean): any;
        /**
         * Gets or sets whether to allow the user to edit formulas in a cell in the spreadsheet.
         * @param {boolean} value Whether the user can edit formulas in a cell in the spreadsheet.
         * @returns {Object} <c>true</c> if the user can edit formulas in a cell in the spreadsheet; otherwise, <c>false</c>.
         */
        canUserEditFormula(value?: boolean): any;
        /**
         * Clears all custom function descriptions.
         */
        clearCustomFunctionDescriptions(): void;
        /**
         * Clears all custom functions.
         */
        clearCustomFunctions(): void;
        /**
         * Clears custom names.
         */
        clearCustomNames(): void;
        /**
         * Clears all sheets in the control.
         */
        clearSheets(): void;
        /**
         * Gets or sets the border color for the indicator displayed when the user cuts or copies the selection.
         * @param {string} value The indicator's border color.
         * @returns {Object} The border color for the indicator displayed when the user cuts or copies the selection.
         */
        cutCopyIndicatorBorderColor(value?: string): any;
        /**
         * Gets or sets whether to display an indicator when copying or cutting the selected item.
         * @param {boolean} value Whether to display an indicator when copying or cutting the selected item.
         * @returns {Object} <c>true</c> to display an indicator when the user is copying or cutting the selected item; otherwise, <c>false</c>.
         */
        cutCopyIndicatorVisible(value?: boolean): any;
        /**
         * Gets or sets the default fill type.
         * @param {GcSpread.Sheets.AutoFillType} value The default fill type.
         * @returns {GcSpread.Sheets.AutoFillType} The default fill type.
         */
        defaultDragFillType(value?: AutoFillType): any;
        /**
         * Repaints the Spread control.
         */
        destroy(): void;
        /**
         * Performs a command.
         * @param {GcSpread.Sheets.UndoRedo.ActionBase} action The command to perform.
         */
        doCommand(action: UndoRedo.ActionBase): void;
        /**
         * Gets or sets whether to enable the formula text box in the spreadsheet.
         * @param {boolean} value Whether to enable the formula text box in the spreadsheet.
         * @returns {Object} <c>true</c> if the formula text box is enabled in the spreadsheet; otherwise, <c>false</c>.
         */
        enableFormulaTextbox(value?: boolean): any;
        /**
         * Gets or sets whether the Spread widget has the focus.
         * @param {boolean} focusIn Whether the Spread widget has the focus. The default value is <c>true</c>.
         */
        focus(focusIn?: boolean): void;
        /**
         * Loads the object state from the specified JSON string.
         * @param {Object} spreadData The spreadsheet data from deserialization.
         */
        fromJSON(spreadData: any): void;
        /**
         * Gets the active sheet.
         * @returns {GcSpread.Sheets.Sheet} The active sheet instance.
         */
        getActiveSheet(): Sheet;
        /**
         * Gets the active sheet index of the control.
         * @returns {number} The active sheet index.
         */
        getActiveSheetIndex(): number;
        /**
         * Gets a custom function.
         * @param {string} name The custom function name.
         * @returns {GcSpread.Sheets.Calc.Functions.Function} The custom function.
         */
        getCustomFunction(name: string): Calc.Functions.Function;
        /**
         * Gets a custom function description.
         * @param {string} name The custom function description name.
         * @returns {Object} The custom function description. See Remarks for additional information.
         */
        getCustomFunctionDescription(name: string): IFunctionDescription;
        /**
         * Gets the specified custom name information.
         * @param {string} name The custom name.
         * @returns {GcSpread.Sheets.NameInfo} The information for the specified custom name.
         */
        getCustomName(name: string): NameInfo;
        /**
         * Gets all custom name information.
         * @returns {Array} The type GcSpread.Sheets.NameInfo stored in an array.
         */
        getCustomNames(): NameInfo[];
        /**
         * Gets the host element of the current Spread instance.
         * @returns {HTMLElement} host The host element of the current Spread instance.
         */
        getHost(): HTMLElement;
        /**
         * Get a style from the Spread named styles collection that has the same name as the specified name.
         * @param {string} name The name for which to search.
         * @returns {GcSpread.Sheets.Style} Returns the specified named style.
         */
        getNamedStyle(name: string): Style;
        /**
         * Get named styles from the Spread.
         * @returns {Array} The GcSpread.Sheets.Style array of named styles.
         */
        getNamedStyles(): Style[];
        /**
         * Gets the specified sheet.
         * @param {number} index The index of the sheet to return.
         * @returns {GcSpread.Sheets.Sheet} The specified sheet.
         */
        getSheet(index: number): Sheet;
        /**
         * Gets the number of sheets.
         * @returns {number} The number of sheets.
         */
        getSheetCount(): number;
        /**
         * Gets the sheet with the specified name.
         * @param {string} name The sheet name.
         * @returns {GcSpread.Sheets.Sheet} The sheet with the specified name.
         */
        getSheetFromName(name: string): Sheet;
        /**
         * Gets the sheet index with the specified name.
         * @param {sting} name The sheet name.
         * @returns {number} The sheet index.
         */
        getSheetIndex(name: string): number;
        /**
         * Gets the width of the tab strip for this component expressed as a percentage of the overall horizontal scroll bar width.
         * @returns {number} The width of the tab strip for this component expressed as a percentage of the overall horizontal scroll bar width.
         */
        getTabStripRatio(): number;
        /**
         * Gets or sets a color string used to represent the background color of the gray area , such as "red", "#FFFF00", "rgb(255,0,0)", "Accent 5", and so on.
         * @param {string} value The color string.
         * @returns {Object} The color string used to represent the background color of the gray area.
         */
        grayAreaBackColor(value?: string): any;
        /**
         * Gets or sets whether to display the selection highlighting when the Spread widget does not have the focus.
         * @param {boolean} value Whether to display the selection highlighting when the Spread widget does not have the focus.
         * @returns {Object} <c>true</c> if the selection highlighting is not displayed the Spread widget does not have the focus; otherwise, <c>false</c>.
         */
        hideSelection(value?: boolean): any;
        /**
         * Gets or sets whether to highlight invalid data.
         * @param {boolean} value Whether to highlight invalid data.
         * @returns {Object} <c>true</c> if invalid data is highlighted; otherwise, <c>false</c>.
         */
        highlightInvalidData(value?: boolean): any;
        /**
         * Updates the control layout information.
         */
        invalidateLayout(): void;
        /**
         * Gets or sets a property that indicates whether to refresh automatically or manually after changing Spread user interface settings.
         * @param {boolean} value Whether to refresh the display automatically.
         * @returns {Object} <c>true</c> if the component refreshes the display automatically after changing settings; otherwise, <c>false</c>.
         */
        isPaintSuspended(value?: boolean): any;
        /**
         * Gets or sets whether the spreadsheet displays a special tab that allows users to insert new sheets.
         * @param {boolean} value Whether the spreadsheet displays the special tab to let users insert new sheets.
         * @returns {Object} <c>true</c> if the control displays a special tab that allows users to insert new sheets; otherwise, <c>false</c>.
         */
        newTabVisible(value?: boolean): any;
        /**
         * Gets or sets the next control used by GcSpread.Sheets.SpreadActions.selectNextControl and GcSpread.Sheets.SpreadActions.moveToNextCellThenControl.
         * @param {Object} value The next control. The control must have a focus method.
         * @returns {Object} The next control.
         */
        nextControl(value?: Object): any;
        /**
         * Gets or sets the previous control used by GcSpread.Sheets.SpreadActions.selectPreviousControl and GcSpread.Sheets.SpreadActions.moveToPreviousCellThenControl.
         * @param {Object} value The previous control. The control must have a focus method.
         * @returns {Object} The previous control.
         */
        previousControl(value?: Object): any;
        /**
         * Gets or sets the style for cell and range references in cell formulas.
         * @param {GcSpread.Sheets.ReferenceStyle:} value The reference style.
         * @returns {Object} The reference style.
         */
        referenceStyle(value?: ReferenceStyle): any;
        /**
         * Manually refreshes the layout and rendering of the Spread object.
         */
        refresh(): void;
        /**
         * Removes a custom function.
         * @param {string} name The custom function name.
         */
        removeCustomFunction(name: string): void;
        /**
         * Removes a custom function description.
         * @param {string} name The custom function description name.
         */
        removeCustomFunctionDescription(name: string): void;
        /**
         * Removes the specified custom name.
         * @param {string} name The custom name.
         */
        removeCustomName(name: string): void;
        /**
         * Removes a style from the Spread named styles collection that has the same name as the specified name.
         * @param {string} name The name for which to search.
         */
        removeNamedStyle(name: string): void;
        /**
         * Removes the specified sheet.
         * @param {number} value The index of the sheet to remove.
         */
        removeSheet(index: number): void;
        /**
         * Removes a SparklineEx from the SparklineEx collection.
         * @param {string} name The name of the SparklineEx to remove.
         */
        removeSparklineEx(name: string): void;
        /**
         * Repaints the Spread control.
         */
        repaint(): void;
        /**
         * Resumes the calculation service.
         * @param {boolean} recalcAll Specifies whether to recalculate all formulas.
         */
        resumeCalcService(recalcAll?: boolean): void;
        /**
         * Resumes the event
         */
        resumeEvent(): void;
        /**
         * Gets or sets whether the scroll bar aligns with the last row and column of the active sheet.
         * @param {boolean} value Whether the scroll bar aligns with the last row and column of the active sheet.
         * @returns {Object} <c>true</c> if the scroll bar aligns with the last row and column of the active sheet; otherwise, <c>false</c>.
         */
        scrollbarMaxAlign(value?: boolean): any;
        /**
         * Gets or sets whether the displayed scroll bars are based on the entire number of columns and rows in the sheet.
         * @param {boolean} value Whether the displayed scroll bars are based on the entire number of columns and rows in the sheet.
         * @returns {Object} <c>true</c> if the displayed scroll bars are based on the entire number of columns and rows in the sheet; otherwise, <c>false</c>.
         */
        scrollbarShowMax(value?: boolean): any;
        /**
         * Searches the text in the cells in the specified sheet for the specified string with the specified criteria.
         * @param {GcSpread.Sheets.SearchCondition} searchCondition The search conditions.
         * @returns {GcSpread.Sheets.SearchResult} The search result.
         */
        search(searchCondition: SearchCondition): SearchResult;
        /**
         * Sets the active sheet by name.
         * @param {string} name The name of the sheet to make the active sheet.
         */
        setActiveSheet(name: string): void;
        /**
         * Sets the active sheet index for the control.
         * @param {number} value The active sheet index.
         */
        setActiveSheetIndex(value: number): void;
        /**
         * Sets the number of sheets.
         * @param {number} count The number of sheets.
         */
        setSheetCount(count: number): void;
        /**
         * Sets the width of the tab strip expressed as a percentage of the overall horizontal scroll bar width.
         * @param {number} tabStripRatio The width of the tab strip expressed as a percentage of the overall horizontal scroll bar width.
         * @param {boolean} skipRefreshScrollbar Whether to skip refreshing the scroll bar. Set to <c>true</c> to not refresh the scroll bar.
         */
        setTabStripRatio(tabStripRatio: number, skipRefreshScrollbar?: boolean): void;
        /**
         * Moves the active cell to the specified position.
         * @param {GcSpread.Sheets.VerticalPosition} verticalPosition The vertical position for the cell.
         * @param {GcSpread.Sheets.HorizontalPosition} horizontalPosition The horizontal position for the cell.
         */
        showActiveCell(verticalPosition: VerticalPosition, horizontalPosition: HorizontalPosition): void;
        /**
         * Moves a cell to the specified position.
         * @param {number} row The row index.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.VerticalPosition} verticalPosition The vertical position for the cell.
         * @param {GcSpread.Sheets.HorizontalPosition} horizontalPosition The horizontal position for the cell.
         */
        showCell(row: number, col: number, verticalPosition: VerticalPosition, horizontalPosition: HorizontalPosition): void;
        /**
         * Moves a column to the specified position.
         * @param {number} col The column index.
         * @param {GcSpread.Sheets.HorizontalPosition} horizontalPosition The horizontal position for the column.
         */
        showColumn(col: number, horizontalPosition: HorizontalPosition): void;
        /**
         * Gets or sets a value indicating whether to display the drag-drop tip.
         * @param {boolean} value Whether to display the drag-drop tip.
         * @returns {boolean} The setting that represents whether to display the drag-drop tip.
         */
        showDragDropTip(value?: boolean): any;
        /**
         * Gets or sets whether to display the drag fill dialog after ending a drag fill.
         * @param {boolean} value Whether to display the drag fill dialog.
         * @returns {boolean} <c>true</c> if the drag fill dialog is displayed; otherwise, <c>false</c>.
         */
        showDragFillSmartTag(value?: boolean): any;
        /**
         * Gets or sets a value indicating whether to display the drag-fill tip.
         * @param {boolean} value Whether to display the drag-fill tip.
         * @returns {boolean} The setting that represents whether to display the drag-fill tip.
         */
        showDragFillTip(value?: boolean): any;
        /**
         * Gets or sets whether to display the horizontal scroll bar.
         * @param {boolean} value Whether to display the horizontal scroll bar.
         * @returns {Object} <c>true</c> if the spreadsheet displays the horizontal scroll bar; otherwise, <c>false</c>.
         */
        showHorizontalScrollbar(value?: boolean): any;
        /**
         * Gets or sets how to display the resize tip.
         * @param {GcSpread.Sheets.ShowResizeTip} value How to display the resize tip.
         * @returns {GcSpread.Sheets.ShowResizeTip} The setting that represents how to display the resize tip.
         */
        showResizeTip(value?: ShowResizeTip): any;
        /**
         * Moves a row to the specified position.
         * @param {number} row The row index.
         * @param {GcSpread.Sheets.VerticalPosition} verticalPosition The vertical position for the row.
         */
        showRow(row: number, verticalPosition: VerticalPosition): void;
        /**
         * Gets or sets how to display the scroll tip.
         * @param {GcSpread.Sheets.ShowScrollTip} value How to display the scroll tip.
         * @returns {GcSpread.Sheets.ShowScrollTip} The setting that represents how to display the scroll tip.
         */
        showScrollTip(value?: ShowScrollTip): any;
        /**
         * Gets or sets whether to display the vertical scroll bar.
         * @param {boolean} value Whether to display the vertical scroll bar.
         * @returns {Object} <c>true</c> if the spreadsheet displays the vertical scroll bar; otherwise, <c>false</c>.
         */
        showVerticalScrollbar(value?: boolean): any;
        /**
         * Gets or sets the index of the first sheet to display in the spreadsheet.
         * @param {number} value The index of the first sheet to display in the spreadsheet.
         * @returns {Object} The index of the first sheet displayed in the spreadsheet.
         */
        startSheetIndex(value?: number): any;
        /**
         * Suspends the calculation service.
         * @param {boolean} ignoreDirty Specifies whether to invalidate the dependency cells.
         */
        suspendCalcService(ignoreDirty?: boolean): void;
        /**
         * Suspends the event.
         */
        suspendEvent(): void;
        /**
         * Gets or sets whether the user can edit the sheet tab strip.
         * @param {boolean} value Whether to allow the user to edit the sheet tab strip.
         * @returns {Object} <c>true</c> if the user is allowed to edit the sheet tab strip; otherwise, <c>false</c>.
         */
        tabEditable(value?: boolean): any;
        /**
         * Gets or sets the display policy for the sheet tab strip.
         * @param {boolean} value Whether to display the sheet tab strip.
         * @returns {Object} <c>true</c> if the sheet tab strip is displayed; otherwise, <c>false</c>.
         */
        tabStripVisible(value?: boolean): any;
        /**
         * Saves the object state to a JSON string.
         * @param {Object} serializationOption Serialization option that contains the <i>includeBindingSource</i> argument. See the Remarks for more information.
         * @returns {Object} The spreadsheet data.
         */
        toJSON(serializationOption?: ISerializationOption): any;
        /**
         * Removes the binding of an event to Spread.
         * @param {string} type The event type.
         * @param {Function} fn Specifies the function to run when the event occurs.
         */
        unbind(type: any, fn?: any): void;
        /**
         * Removes the binding of all events to Spread.
         */
        unbindAll(): void;
        /**
         * Gets or sets whether to use touch layout to present the Spread widget.
         * @param {boolean} value Whether to use touch layout to present the Spread widget.
         * @returns {Object} <c>true</c> if using touch layout to present the Spread widget; otherwise, <c>false</c>.
         */
        useTouchLayout(value?: boolean): any;
    }

    export class SpreadActions{
        /**
         * Represents all the SpreadJS undo and redo actions.
         * @class
         */
        constructor();
        /**
         * Stops cell editing and cancels input.
         * @static
         */
        static cancelInput(): any;
        /**
         *  Switches the formula reference between relative, absolute, and mixed when editing formulas.
         *  @static
         */
        static changeFormulaReference(): void;
        /**
         * Clears the cell value.
         * @static
         */
        static clear(): void;
        /**
         * Clears the active cell value and enters edit mode.
         * @static
         */
        static clearAndEditing(): boolean;
        /**
         * Commits the cell editing and set array formula to the active range.
         * @static
         */
        static commitArrayFormula(): boolean;
        /**
         * Stops cell editing and moves the active cell to the next row.
         * @static
         */
        static commitInputNavigationDown(): boolean;
        /**
         * Stops cell editing and moves the active cell to the previous row.
         * @static
         */
        static commitInputNavigationUp(): boolean;
        /**
         * Copies the selected item text to the Clipboard.
         * @static
         */
        static copy(): void;
        /**
         * Cuts the selected item text to the Clipboard.
         * @static
         */
        static cut(): void;
        /**
         * Moves the active cell to the next cell.
         * @static
         */
        static moveToNextCell(): boolean;
        /**
         * If the active cell is the last visible cell, selects the next control; otherwise, moves the active cell to the next cell.
         * @static
         */
        static moveToNextCellThenControl(): boolean;
        /**
         * Moves the active cell to the previous cell.
         * @static
         */
        static moveToPreviousCell(): boolean;
        /**
         * If the active cell is the first visible cell, selects the previous control; otherwise, moves the active cell to the previous cell.
         * @static
         */
        static moveToPreviousCellThenControl(): boolean;
        /**
         * Moves the active cell to the last row.
         * @static
         */
        static navigationBottom(): boolean;
        /**
         * Moves the active cell to the next row.
         * @static
         */
        static navigationDown(): boolean;
        /**
         * Moves the active cell to the last column.
         * @static
         */
        static navigationEnd(): boolean;
        /**
         * Moves the active cell to the last column without regard to frozen trailing columns.
         * @static
         */
        static navigationEnd2(): boolean;
        /**
         * Moves the active cell to the first cell in the sheetview.
         * @static
         */
        static navigationFirst(): boolean;
        /**
         * Moves the active cell to the first column.
         * @static
         */
        static navigationHome(): boolean;
        /**
         * Moves the active cell to the first column without regard to frozen columns.
         * @static
         */
        static navigationHome2(): boolean;
        /**
         * Moves the active cell to the last cell in the sheetview.
         * @static
         */
        static navigationLast(): boolean;
        /**
         * Moves the active cell to the previous column.
         * @static
         */
        static navigationLeft(): boolean;
        /**
         * Moves the active sheet to the next sheet.
         * @static
         */
        static navigationNextSheet(): void;
        /**
         * Moves the active cell down one page of rows.
         * @static
         */
        static navigationPageDown(): boolean;
        /**
         * Moves the active cell up one page of rows.
         * @static
         */
        static navigationPageUp(): boolean;
        /**
         * Makes the active sheet to the previous sheet.
         * @static
         */
        static navigationPreviousSheet(): void;
        /**
         * Moves the active cell to the next column.
         * @static
         */
        static navigationRight(): boolean;
        /**
         * Moves the active cell to the first row.
         * @static
         */
        static navigationTop(): boolean;
        /**
         * Moves the active cell to the previous row.
         * @static
         */
        static navigationUp(): boolean;
        /**
         *  Pastes the selected items from the Clipboard to the current sheet.
         *  @static
         */
        static paste(): void;
        /**
         * Performs a redo of the most recently undone edit or action.
         * @static
         */
        static redo(): void;
        /**
         *  Extends the selection to the last row.
         *  @static
         */
        static selectionBottom(): boolean;
        /**
         *  Extends the selection down one row.
         *  @static
         */
        static selectionDown(): boolean;
        /**
         *  Extends the selection to the last column.
         *  @static
         */
        static selectionEnd(): boolean;
        /**
         *  Extends the selection to the first cell.
         
         */
        static selectionFirst(): boolean;
        /**
         *  Extends the selection to the first column.
         *  @static
         */
        static selectionHome(): boolean;
        /**
         *  Extends the selection to the last cell.
         *  @static
         */
        static selectionLast(): boolean;
        /**
         *  Extends the selection one column to the left.
         *  @static
         */
        static selectionLeft(): boolean;
        /**
         *  Extends the selection down to include one page of rows.
         *  @static
         */
        static selectionPageDown(): boolean;
        /**
         *  Extends the selection up to include one page of rows.
         *  @static
         */
        static selectionPageUp(): boolean;
        /**
         * Extends the selection one column to the right.
         * @static
         */
        static selectionRight(): boolean;
        /**
         *  Extends the selection to the first row.
         *  @static
         */
        static selectionTop(): boolean;
        /**
         *  Extends the selection up one row.
         *  @static
         */
        static selectionUp(): boolean;
        /**
         * Selects the next control.
         * @static
         */
        static selectNextControl(): boolean;
        /**
         * Selects the previous control.
         * @static
         */
        static selectPreviousControl(): boolean;
        /**
         *  Performs an undo of the most recent edit or action.
         *  @static
         */
        static undo(): void;
    }

    export class SpreadSparkline extends SparklineEx{
        /**
         * Represents the class for the Spread sparkline.
         * @extends GcSpread.Sheets.SparklineEx
         * @class
         */
        constructor();
    }

    export class SpreadTheme{
        /**
         * Represents an expression with a named variable as the expression.
         * @class
         * @param {string} name The name of the theme.
         * @param {GcSpread.Sheets.ThemeColor} themeColor The base colors of the theme color.
         * @param {string} headingFont The name of the heading font.
         * @param {string} bodyFont The name of the body font.
         */
        constructor(name: any, themeColor?: ThemeColor, headingFont?: string, bodyFont?: string);
        /**
         * Gets or sets the body font.
         * @param {string} value The body font.
         * @returns {Object} The body font.
         */
        bodyFont(value?: any): any;
        /**
         * Gets or sets the base colors of the theme.
         * @param {GcSpread.Sheets.ThemeColor} value The base colors of the theme.
         * @returns {Object} The base colors of the theme.
         */
        colors(value?: ThemeColor): any;
        /**
         * Gets or sets the heading font.
         * @param {string} value The heading font.
         * @returns {Object} The heading font.
         */
        headerFont(value?: any): any;
        /**
         * Gets or sets the name of the current theme.
         * @param {string} value The theme name.
         * @returns {Object} The theme name.
         */
        name(value?: string): any;
    }

    export class SpreadThemes{
        /**
         * Represents all built-in themes.
         * @class
         */
        constructor();
        /** Indicates the Apex theme.*/
        static Apex: any;
        /** Indicates the Aspect theme.*/
        static Aspect: any;
        /** Indicates the Civic theme.*/
        static Civic: any;
        /** Indicates the Concourse theme.*/
        static Concourse: any;
        /** Indicates the Default theme.*/
        static Default: any;
        /** Indicates the Equity theme.*/
        static Equity: any;
        /** Indicates the Flow theme.*/
        static Flow: any;
        /** Indicates the Foundry theme.*/
        static Foundry: any;
        /** Indicates the Median theme.*/
        static Median: any;
        /** Indicates the Metro theme.*/
        static Metro: any;
        /** Indicates the Module theme.*/
        static Module: any;
        /** Indicates the Office theme.*/
        static Office: any;
        /** Indicates the Opulent theme.*/
        static Opulent: any;
        /** Indicates the Oriel theme.*/
        static Oriel: any;
        /** Indicates the Origin theme.*/
        static Origin: any;
        /** Indicates the Paper theme.*/
        static Paper: any;
        /** Indicates the Solstice theme.*/
        static Solstice: any;
        /** Indicates the Technic theme.*/
        static Technic: any;
        /** Indicates the Trek theme.*/
        static Trek: any;
        /** Indicates the Urban theme.*/
        static Urban: any;
        /** Indicates the Verve theme.*/
        static Verve: any;
    }

    export class StackedSparkline extends SparklineEx{
        /**
         * Represents the class for the stacked sparkline.
         * @extends GcSpread.Sheets.SparklineEx
         * @class
         */
        constructor();
    }

    export class Style{
        /**
         * Represents the style for a cell, row, and column.
         * @param {string} backColor The background color.
         * @param {string} foreColor The foreground color.
         * @param {GcSpread.Sheets.HorizontalAlign} hAlign The horizontal alignment.
         * @param {GcSpread.Sheets.VerticalAlign} vAlign The vertical alignment.
         * @param {string} font The font.
         * @param {string} themeFont The font theme.
         * @param {string|object} formatter The formatting object.
         * @param {GcSpread.Sheets.LineBorder} borderLeft The left border.
         * @param {GcSpread.Sheets.LineBorder} borderTop The top border.
         * @param {GcSpread.Sheets.LineBorder} borderRight The right border.
         * @param {GcSpread.Sheets.LineBorder} borderBottom The bottom border.
         * @param {boolean} locked Whether the cell, row, or column is locked.
         * @param {number} textIndent The text indent amount.
         * @param {boolean} wordWrap Whether words wrap within the cell or cells.
         * @param {boolean} shrinkToFit Whether content shrinks to fit the cell or cells.
         * @param {string} backgroundImage The background image to display.
         * @param {GcSpread.Sheets.BaseCellType} cellType The cell type.
         * @param {GcSpread.Sheets.ImageLayout} backgroundImageLayout The layout for the background image.
         * @param {boolean} tabStop Whether the user can set focus to the cell using the Tab key.
         * @param {GcSpread.Sheets.TextDecorationType} textDecoration Specifies the decoration added to text.
         * @param {GcSpread.Sheets.ImeMode} imeMode Specifies the  input method editor mode.
         * @param {string} name Specifies the name.
         * @param {string} parentName Specifies the name of the parent style.
         * @param {string} watermark Specifies the watermark content.
         */
        constructor(backColor?: string, foreColor?: string, hAlign?: HorizontalAlign, vAlign?: VerticalAlign, font?: any, themeFont?: string, formatter?: any, borderLeft?: LineBorder, borderTop?: LineBorder, borderRight?: LineBorder, borderBottom?: LineBorder, locked?: boolean, textIndent?: number, wordWrap?: boolean, shrinkToFit?: boolean, backgroundImage?: any, cellType?: any, backgroundImageLayout?: ImageLayout, tabStop?: boolean, textDecoration?: TextDecorationType, imeMode?: ImeMode, name?: string, parentName?: string, watermark?: string);
        /**
         * Indicates the background color.
         * @type {string}
         */
        backColor: any;
        /**
         * Indicates the background image.
         * @type {string}
         */
        backgroundImage: any;
        /**
         * Indicates the background image layout.
         * @type {GcSpread.Sheets.BackgroundImageLayout}
         */
        backgroundImageLayout: any;
        /**
         * Indicates the bottom border line.
         * @type {GcSpread.Sheets.LineBorder}
         */
        borderBottom: any;
        /**
         * Indicates the left border line.
         * @type {GcSpread.Sheets.LineBorder}
         */
        borderLeft: any;
        /**
         * Indicates the right border line.
         * @type {GcSpread.Sheets.LineBorder}
         */
        borderRight: any;
        /**
         * Indicates the top border line.
         * @type {GcSpread.Sheets.LineBorder}
         */
        borderTop: any;
        /**
         * Indicates the cell type.
         * @type {GcSpread.Sheets.BaseCellType}
         */
        cellType: any;
        /**
         * Indicates the font.
         * @type {string}
         */
        font: any;
        /**
         * Indicates the foreground color.
         * @type {string}
         */
        foreColor: any;
        /**
         * Indicates the formatter.
         * @type {string|object}
         */
        formatter: any;
        /**
         * Indicates the horizontal alignment.
         * @type {GcSpread.Sheets.HorizontalAlign}
         */
        hAlign: any;
        /**
         * Indicates the Input Method Editor (IME) mode.
         * @type {GcSpread.Sheets.ImeMode}
         */
        imeMode: any;
        /**
         * Indicates whether a cell is marked as locked from editing.
         * @type {boolean}
         */
        locked: any;
        /**
         * Indicates the name.
         * @type {string}
         */
        name: any;
        /**
         * Indicates the name of the parent style.
         * @type {string}
         */
        parentName: any;
        /**
         * Indicates whether to shrink to fit.
         * @type {boolean}
         */
        shrinkToFit: any;
        /**
         * Indicates whether the user can set focus to the cell using the Tab key.
         * @type {boolean}
         */
        tabStop: any;
        /**
         * Indicates the decoration added to text.
         * @type {GcSpread.Sheets.TextDecorationType}
         */
        textDecoration: any;
        /**
         * Indicates the number of units of indentation for text in a cell, an integer value, where an increment of 1 represents 8 pixels.
         * @type {number}
         */
        textIndent: any;
        /**
         * Indicates the font theme.
         * @type {string}
         */
        themeFont: any;
        /**
         * Indicates the data validator.
         * @type {GcSpread.Sheets.DefaultDataValidator}
         */
        validator: any;
        /**
         * Indicates the vertical alignment.
         * @type {GcSpread.Sheets.VerticalAlign}
         */
        vAlign: any;
        /**
         * Indicates the watermark content.
         * @type {string}
         */
        watermark: any;
        /**
         * Indicates whether to wrap text.
         * @type {boolean}
         */
        wordWrap: any;
        /**
         * Clears the specified property value based on the property name.
         * @param {string} propertyName The name of the property to be cleared; if no property name is specified, clears all properties.
         */
        clear(propertyName?: string): void;
        /**
         * Composes settings from another style for the current style.
         * @param {GcSpread.Sheets.Style} style The source style.
         * @param {boolean} force Whether to force composing.
         */
        compose(style: Style, force?: boolean): void;
        /**
         * Copies settings from another style to the current style.
         * @param {GcSpread.Sheets.Style} style The source style.
         */
        copyFrom(style: Style): void;
    }

    export class TableColumnInfo{
        /**
         * Represents the table column information.
         * @class
         * @param {string} id The table column ID.
         */
        constructor(id: number);
        /**
         * Gets or sets the table column data field for accessing the table's data source.
         * @returns {string | GcSpread.Sheets.TableColumnInfo} If a value is set, returns the table column data field. If the value is not set, it returns the table column information itself.
         */
        dataField(value?: string): any;
        /**
         * Gets or sets the table column ID.
         * @returns {number | GcSpread.Sheets.TableColumnInfo} If a value is set, returns the table column ID. If the value is not set, it returns the table column information itself.
         */
        id(value?: number): any;
        /**
         * Gets or sets the table column name for display.
         * @returns {string | GcSpread.Sheets.TableColumnInfo} If a value is set, returns the table column name. If the value is not set, it returns the table column information itself.
         */
        name(value?: string): any;
    }

    export class TableStyle{
        /**
         * Represents the table style settings.
         * @class
         */
        constructor();
        /**
         * The size of the first alternating column.
         * @returns {number| GcSpread.Sheets.TableStyle} Returns the size of the first alternating column. If the size is not set, it returns the table style.
         */
        firstColumnStripSize(value?: number): any;
        /**
         * The style of the first alternating column.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the style of the first alternating column. If the style is not set, it returns the table style.
         */
        firstColumnStripStyle(value?: TableStyleInfo): any;
        /**
         * The style of the first footer cell.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the style of the first footer cell. If the style is not set, it returns the table style.
         */
        firstFooterCellStyle(value?: TableStyleInfo): any;
        /**
         * The style of the first header cell.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the style of the first header cell. If the style is not set, it returns the table style.
         */
        firstHeaderCellStyle(value?: TableStyleInfo): any;
        /**
         * The size of the first alternating row.
         * @returns {number| GcSpread.Sheets.TableStyle} Returns the size of the first alternating row. If the size is not set, it returns the table style.
         */
        firstRowStripSize(value?: number): any;
        /**
         * The first alternating row style.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the first alternating row style. If the style is not set, it returns the table style.
         */
        firstRowStripStyle(value?: TableStyleInfo): any;
        /**
         * The default style of the footer area.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the default style of the footer area. If the style is not set, it returns the table style.
         */
        footerRowStyle(value?: TableStyleInfo): any;
        /**
         * The default style of the header area.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the default style of the header area. If the style is not set, it returns the table style.
         */
        headerRowStyle(value?: TableStyleInfo): any;
        /**
         * The style of the first column.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the style of the first column. If the style is not set, it returns the table style.
         */
        highlightFirstColumnStyle(value?: TableStyleInfo): any;
        /**
         * The style of the last column.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the style of the last column. If the style is not set, it returns the table style.
         */
        highlightLastColumnStyle(value?: TableStyleInfo): any;
        /**
         * The style of the last footer cell.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the style of the last footer cell. If the style is not set, it returns the table style.
         */
        lastFooterCellStyle(value?: TableStyleInfo): any;
        /**
         * The style of the last header cell.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the style of the last header cell. If the style is not set, it returns the table style.
         */
        lastHeaderCellStyle(value?: TableStyleInfo): any;
        /**
         * Gets or sets the name of the style.
         * @returns {string| GcSpread.Sheets.TableStyle} Returns the style name. If the name is not set, it returns the table style.
         */
        name(value?: string): any;
        /**
         * The size of the second alternating column.
         * @returns {number| GcSpread.Sheets.TableStyle} Returns the size of the second alternating column. If the size is not set, it returns the table style.
         */
        secondColumnStripSize(value?: number): any;
        /**
         * The style of the second alternating column.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the style of the second alternating column. If the style is not set, it returns the table style.
         */
        secondColumnStripStyle(value?: TableStyleInfo): any;
        /**
         * The size of the second alternating row.
         * @returns {number| GcSpread.Sheets.TableStyle} Returns the size of the second alternating row. If the size is not set, it returns the table style.
         */
        secondRowStripSize(value?: number): any;
        /**
         * The second alternating row style.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the second alternating row style. If the style is not set, it returns the table style.
         */
        secondRowStripStyle(value?: TableStyleInfo): any;
        /**
         * The default style of the data area.
         * @returns {GcSpread.Sheets.TableStyleInfo| GcSpread.Sheets.TableStyle} Returns the default style of the data area. If the style is not set, it returns the table style.
         */
        wholeTableStyle(value?: TableStyleInfo): any;
    }

    export class TableStyleInfo{
        /**
         * Represents table style information.
         * @class
         * @param {string} backColor The background color of the table.
         * @param {string} foreColor The foreground color of the table.
         * @param {string} font The font.
         * @param {GcSpread.Sheets.LineBorder} borderLeft The left border line of the table.
         * @param {GcSpread.Sheets.LineBorder} borderTop The top border line of the table.
         * @param {GcSpread.Sheets.LineBorder} borderRight The right border line of the table.
         * @param {GcSpread.Sheets.LineBorder} borderBottom The bottom border line of the table.
         * @param {GcSpread.Sheets.LineBorder} borderHorizontal The horizontal border line of the table.
         * @param {GcSpread.Sheets.LineBorder} borderVertical The vertical border line of the table.
         */
        constructor(backColor?: string, foreColor?: string, font?: string, borderLeft?: LineBorder, borderTop?: LineBorder, borderRight?: LineBorder, borderBottom?: LineBorder, borderHorizontal?: LineBorder, borderVertical?: LineBorder);
        /**
         * Indicates the background color.
         * @type {string}
         */
        backColor: any;
        /**
         * Indicates the bottom border line of the table.
         * @type {GcSpread.Sheets.LineBorder}
         */
        borderBottom: any;
        /**
         * Indicates the horizontal border line of the table.
         * @type {GcSpread.Sheets.LineBorder}
         */
        borderHorizontal: any;
        /**
         * Indicates the left border line of the table.
         * @type {GcSpread.Sheets.LineBorder}
         */
        borderLeft: any;
        /**
         * Indicates the right border line of the table.
         * @type {GcSpread.Sheets.LineBorder}
         */
        borderRight: any;
        /**
         * Indicates the top border line of the table.
         * @type {GcSpread.Sheets.LineBorder}
         */
        borderTop: any;
        /**
         * Indicates the vertical border line of the table.
         * @type {GcSpread.Sheets.LineBorder}
         */
        borderVertical: any;
        /**
         * Indicates the font.
         * @type {string}
         */
        font: any;
        /**
         * Indicates the foreground color.
         * @type {string}
         */
        foreColor: any;
    }

    export class TableStyles{
        /**
         * Represents a built-in table style collection.
         * @class
         */
        constructor();
        /**
         * Adds the specified custom style.
         * @param {GcSpread.Sheets.TableStyle} style The table style.
         */
        static addCustomStyles(style: TableStyle): void;
        /**
         * Gets the custom styles.
         * @returns {Array} The GcSpread.Sheets.TableStyle Array.
         */
        static customStyles(): TableStyle[];
        /**
         * Gets the dark1 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static dark1(): TableStyle;
        /**
         * Gets the dark10 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static dark10(): TableStyle;
        /**
         * Gets the dark11 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static dark11(): TableStyle;
        /**
         * Gets the dark2 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static dark2(): TableStyle;
        /**
         * Gets the dark3 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static dark3(): TableStyle;
        /**
         * Gets the dark4 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static dark4(): TableStyle;
        /**
         * Gets the dark5 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static dark5(): TableStyle;
        /**
         * Gets the dark6 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static dark6(): TableStyle;
        /**
         * Gets the dark7 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static dark7(): TableStyle;
        /**
         * Gets the dark8 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static dark8(): TableStyle;
        /**
         * Gets the dark9 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static dark9(): TableStyle;
        /**
         * Gets the light1 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light1(): TableStyle;
        /**
         * Gets the light10 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light10(): TableStyle;
        /**
         * Gets the light11 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light11(): TableStyle;
        /**
         * Gets the light12 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light12(): TableStyle;
        /**
         * Gets the light13 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light13(): TableStyle;
        /**
         * Gets the light14 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light14(): TableStyle;
        /**
         * Gets the light15 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light15(): TableStyle;
        /**
         * Gets the light16 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light16(): TableStyle;
        /**
         * Gets the light17 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light17(): TableStyle;
        /**
         * Gets the light18 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light18(): TableStyle;
        /**
         * Gets the light19 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light19(): TableStyle;
        /**
         * Gets the light2 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light2(): TableStyle;
        /**
         * Gets the light20 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light20(): TableStyle;
        /**
         * Gets the light21 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light21(): TableStyle;
        /**
         * Gets the light3 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light3(): TableStyle;
        /**
         * Gets the light4 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light4(): TableStyle;
        /**
         * Gets the light5 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light5(): TableStyle;
        /**
         * Gets the light6 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light6(): TableStyle;
        /**
         * Gets the light7 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light7(): TableStyle;
        /**
         * Gets the light8 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light8(): TableStyle;
        /**
         * Gets the light9 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static light9(): TableStyle;
        /**
         * Gets the medium1 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium1(): TableStyle;
        /**
         * Gets the medium10 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium10(): TableStyle;
        /**
         * Gets the medium11 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium11(): TableStyle;
        /**
         * Gets the medium12 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium12(): TableStyle;
        /**
         * Gets the medium13 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium13(): TableStyle;
        /**
         * Gets the medium14 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium14(): TableStyle;
        /**
         * Gets the medium15 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium15(): TableStyle;
        /**
         * Gets the medium16 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium16(): TableStyle;
        /**
         * Gets the medium17 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium17(): TableStyle;
        /**
         * Gets the medium18 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium18(): TableStyle;
        /**
         * Gets the medium19 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium19(): TableStyle;
        /**
         * Gets the medium2 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium2(): TableStyle;
        /**
         * Gets the medium20 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium20(): TableStyle;
        /**
         * Gets the medium21 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium21(): TableStyle;
        /**
         * Gets the medium22 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium22(): TableStyle;
        /**
         * Gets the medium23 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium23(): TableStyle;
        /**
         * Gets the medium24 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium24(): TableStyle;
        /**
         * Gets the medium25 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium25(): TableStyle;
        /**
         * Gets the medium26 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium26(): TableStyle;
        /**
         * Gets the medium27 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium27(): TableStyle;
        /**
         * Gets the medium28 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium28(): TableStyle;
        /**
         * Gets the medium3 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium3(): TableStyle;
        /**
         * Gets the medium4 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium4(): TableStyle;
        /**
         * Gets the medium5 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium5(): TableStyle;
        /**
         * Gets the medium6 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium6(): TableStyle;
        /**
         * Gets the medium7 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium7(): TableStyle;
        /**
         * Gets the medium8 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium8(): TableStyle;
        /**
         * Gets the medium9 style.
         * @returns {GcSpread.Sheets.TableStyle}
         */
        static medium9(): TableStyle;
        /**
         * Removes the specified custom style.
         * @param {GcSpread.Sheets.TableStyle} style The table style to be removed.
         * @returns {boolean} <c>true</c> if the remove action succeeds; otherwise, <c>false</c>.
         */
        static removeCustomStyle(style: TableStyle): boolean;
        /**
         * Removes the specified custom style by its name.
         * @param {string} styleName The name of the table style to be removed.
         * @returns {boolean} <c>true</c> if the remove action succeeds; otherwise, <c>false</c>.
         */
        static removeCustomStyleByName(styleName: string): boolean;
    }

    export class TextCellType extends BaseCellType{
        /**
         * Represents a text cell type.
         * @extends GcSpread.Sheets.BaseCellType
         * @class
         */
        constructor();
    }

    export class TextCondition{
        /**
         * Represents a text condition with the specified text comparison type based on the specified cell.
         * @constructor
         * @param {GcSpread.Sheets.TextCompareType} compareType The type of comparison.
         * @param {string} expected The expected text.
         * @param {string} formula The expected formula.
         * @class
         */
        constructor(compareType: TextCompareType, expected: string, formula?: string);
        /** Gets the type of comparison to perform.
         * @type {GcSpread.Sheets.TextCompareType}
         */
        compareType: any;
        /** The expected text.
         * @type {string}
         */
        expected: any;
        /** The expected formula.
         * @type {string}
         */
        formula: any;
        /** Whether to ignore the blank cell.
         * @type {boolean}
         */
        ignoreBlank: boolean;
        /** Gets or sets whether to ignore case when performing the comparison.
         * @type {boolean}
         */
        ignoreCase: boolean;
        /** Gets or sets whether to compare strings using wildcards.
         * @type {boolean}
         */
        useWildCards: boolean;
        /**
         * Evaluates the condition using the specified evaluator.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualObj The actual value object for evaluation.
         * @returns {boolean} <c>true</c> if the result is successful; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actualObj: any): boolean;
        /**
         * Gets the expected value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @returns {string} The expected value.
         */
        getExpected(evaluator: any, baseRow: number, basecol: number): any;
        /**
         * Gets the expected string value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @returns {string} The expected string value.
         */
        getExpectedString(evaluator: any, baseRow: number, baseColumn: number): string;
    }

    export class TextLengthCondition{
        /**
         * Represents a text length condition with the specified comparison type, expected number, and formula.
         * @param {GcSpread.Sheets.GeneralCompareType} compareType The number comparison type.
         * @param {object} expected The expected number.
         * @param {string} formula The expected formula.
         * @class
         */
        constructor(compareType: GeneralCompareType, expected: any, formula: string);
        /** The number comparison type.
         * @type {GcSpread.Sheets.GeneralCompareType}
         */
        compareType: any;
        /** The expected number.
         * @type {object}
         */
        expected: any;
        /** The expected formula.
         * @type {string}
         */
        formula: any;
        /** Gets or sets a value that indicates whether to ignore the null value.
         * @type {boolean}
         */
        ignoreBlank: boolean;
        /**
         * Evaluates the condition using the specified evaluator.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualObj The actual value object for evaluation.
         * @returns {boolean} <c>true</c> if the result is successful; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actualObj: any): boolean;
        /**
         * Gets the expected value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} basecol The base column index for evaluation.
         * @returns {object} The expected value.
         */
        getExpected(evaluator: any, baseRow: number, basecol: number): any;
        /**
         * Gets the expected integer value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} basecol The base column index for evaluation.
         * @returns {number} The expected integer value.
         */
        getExpectedInt(evaluator: any, baseRow: number, basecol: number): number;
        /**
         * Resets this instance.
         */
        reset(): void;
    }

    export class ThemeColor{
        /**
         * Creates a ThemeColor instance.
         * @constructor
         * @class
         * @classdesc Represents the theme color.
         * @param {string} name The owner that contains the named variable.
         * @param {object} text1 The theme color for text1.
         * @param {object} text2 The theme color for text2.
         * @param {object} background1 The theme color for background1.
         * @param {object} background2 The theme color for background2.
         * @param {object} accent1 The theme color for accent1.
         * @param {object} accent2 The theme color for accent2.
         * @param {object} accent3 The theme color for accent3.
         * @param {object} accent4 The theme color for accent4.
         * @param {object} accent5 The theme color for accent5.
         * @param {object} accent6 The theme color for accent6.
         * @param {object} link The color of the link.
         * @param {object} followedLink The color of the followedLink.
         */
        constructor(name: string, text1?: any, text2?: any, background1?: any, background2?: any, accent1?: any, accent2?: any, accent3?: any, accent4?: any, accent5?: any, accent6?: any, link?: any, followedLink?: any);
        /**
         * Gets or sets the accent1 theme color.
         * @param {string} value The accent1 theme color string.
         * @returns {Object} The accent1 theme color.
         */
        accent1(value?: Object): any;
        /**
         * Gets or sets the accent2 theme color.
         * @param {string} value The accent2 theme color string.
         * @returns {Object} The accent2 theme color string.
         */
        accent2(value?: Object): any;
        /**
         * Gets or sets the accent3 theme color.
         * @param {string} value The accent3 theme color string.
         * @returns {Object} The accent3 theme color.
         */
        accent3(value?: Object): any;
        /**
         * Gets or sets the accent4 theme color.
         * @param {string} value The accent4 theme color string.
         * @returns {Object} The accent4 theme color.
         */
        accent4(value?: Object): any;
        /**
         * Gets or sets the accent5 theme color.
         * @param {string} value The accent5 theme color string.
         * @returns {Object} The accent5 theme color.
         */
        accent5(value?: Object): any;
        /**
         * Gets or sets the accent6 theme color.
         * @param {string} value The accent6 theme color string.
         * @returns {Object} The accent6 theme color.
         */
        accent6(value?: Object): any;
        /**
         * Gets or sets the background1 theme color.
         * @param {string} value The background1 theme color string.
         * @returns {Object} The background1 theme color.
         */
        background1(value?: Object): any;
        /**
         *  Gets or sets the background2 theme color.
         * @param {string} value The background2 theme color string.
         * @returns {Object} The background2 theme color.
         */
        background2(value?: Object): any;
        /**
         * Gets or sets the followed hyperlink theme color.
         * @param {string} value The followed hyperlink theme color string.
         * @returns {Object} The followed hyperlink theme color.
         */
        followedHyperline(value?: Object): any;
        /**
         * Gets the color based on the theme color.
         * @param {string} name The theme color name.
         * @returns {string} The theme color.
         */
        getColor(name: string): string;
        /**
         * Gets or sets the hyperlink theme color.
         * @param {string} value The hyperlink theme color string.
         * @returns {Object} The hyperlink theme color.
         */
        hyperline(value?: Object): any;
        /**
         * Gets or sets the theme color based on the theme name.
         * @param {string} value The theme name.
         * @returns {Object} The theme color.
         */
        name(value?: string): any;
        /**
         * Gets or sets the textcolor1 theme color.
         * @param {string} value The textcolor1 theme color string.
         * @returns {Object} The textcolor1 theme color.
         */
        textColor1(value?: Object): any;
        /**
         * Gets or sets the textcolor2 theme color.
         * @param {string} value The textcolor2 theme color string.
         * @returns {Object} The textcolor2 theme color.
         */
        textColor2(value?: Object): any;
    }

    export class ThemeColors{
        /**
         * Represents the theme color of built-in themes.
         * @class
         */
        constructor();
        /** The theme color of the Apex theme.*/
        static Apex: any;
        /** The theme color of the Aspect theme.*/
        static Aspect: any;
        /** The theme color of the Civic theme.*/
        static Civic: any;
        /** The theme color of the Concourse theme.*/
        static Concourse: any;
        /** The theme color of the Default theme.*/
        static Default: any;
        /** The theme color of the Equity theme.*/
        static Equity: any;
        /** The theme color of the Flow theme.*/
        static Flow: any;
        /** The theme color of the Foundry theme.*/
        static Foundry: any;
        /** The theme color of the Median theme.*/
        static Median: any;
        /** The theme color of the Metro theme.*/
        static Metro: any;
        /** The theme color of the Module theme.*/
        static Module: any;
        /** The theme color of the Office theme.*/
        static Office: any;
        /** The theme color of the Opulent theme.*/
        static Opulent: any;
        /** The theme color of the Oriel theme.*/
        static Oriel: any;
        /** The theme color of the Origin theme.*/
        static Origin: any;
        /** The theme color of the Paper theme.*/
        static Paper: any;
        /** The theme color of the Solstice theme.*/
        static Solstice: any;
        /** The theme color of the Technic theme.*/
        static Technic: any;
        /** The theme color of the Trek theme.*/
        static Trek: any;
        /** The theme color of the Urban theme.*/
        static Urban: any;
        /** The theme color of the Verve theme.*/
        static Verve: any;
    }

    export class ThreeScaleRule extends ScaleRule{
        /**
         * Represents a three-color scale conditional rule with the specified parameters.
         * @extends GcSpread.Sheets.ScaleRule
         * @param {GcSpread.Sheets.ScaleValueType} minType The minimum scale type.
         * @param {object} minValue The minimum scale value.
         * @param {string} minColor The minimum scale color.
         * @param {GcSpread.Sheets.ScaleValueType} midType The midpoint scale type.
         * @param {object} midValue The midpoint scale value.
         * @param {string} midColor The midpoint scale color.
         * @param {GcSpread.Sheets.ScaleValueType} maxType The maximum scale type.
         * @param {object} maxValue The maximum scale value.
         * @param {string} maxColor The maximum scale color.
         * @class
         */
        constructor(minType: ScaleValueType, minValue: any, minColor: string, midType: ScaleValueType, midValue: any, midColor: string, maxType: ScaleValueType, maxValue: any, maxColor: string);
        /**
         * Returns the specified value of the rule if the cell meets the condition.
         * @param {object} evaluator The evaluator.
         * @param {number} baseRow The row index.
         * @param {number} baseColumn The column index.
         * @param {object} actual The current value.
         * @returns {string} The specified value of the rule if the cell meets the condition.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actual: any): string;
        /**
         * Gets the maximum scale color.
         * @returns {string} The maximum scale color.
         */
        getMaximumColor(): string;
        /**
         * Gets the maximum scale type.
         * @returns {object} The maximum scale type.
         */
        getMaximumType(): any;
        /**
         * Gets the maximum scale value.
         * @returns {object} The maximum scale value.
         */
        getMaximumValue(): any;
        /**
         * Gets the midpoint scale color.
         * @returns {string} The midpoint scale color.
         */
        getMidpointColor(): string;
        /**
         * Gets the midpoint scale type.
         * @returns {object} The midpoint scale type.
         */
        getMidpointType(): any;
        /**
         * Gets the midpoint scale value.
         * @returns {object} The midpoint scale value.
         */
        getMidpointValue(): any;
        /**
         * Gets the minimum scale color.
         * @returns {string} The minimum scale color.
         */
        getMinimumColor(): string;
        /**
         * Gets the minimum scale type.
         * @returns {object} The minimum scale type.
         */
        getMinimumType(): any;
        /**
         * Gets the minimum scale value.
         * @returns {object} The minimum scale value.
         */
        getMinimumValue(): any;
        /**
         * Resets the rule.
         */
        reset(): void;
        /**
         * Sets the maximum scale color.
         * @param {string} color The maximum scale color.
         */
        setMaximumColor(color: string): void;
        /**
         * Sets the maximum scale type.
         * @param {object} type The maximum scale type.
         */
        setMaximumType(type: any): void;
        /**
         * Sets the maximum scale value.
         * @param {object} value The maximum scale value.
         */
        setMaximumValue(value: any): void;
        /**
         * Sets the midpoint scale color.
         * @param {string} color The midpoint scale color.
         */
        setMidpointColor(color: string): void;
        /**
         * Sets the midpoint scale type.
         * @param {object} type The midpoint scale type.
         */
        setMidpointType(type: any): void;
        /**
         * Sets the midpoint scale value.
         * @param {object} value The midpoint scale value.
         */
        setMidpointValue(value: any): void;
        /**
         * Sets the minimum scale color.
         * @param {string} color The minimum scale color.
         */
        setMinimumColor(color: string): void;
        /**
         * Sets the minimum scale type.
         * @param {object} type The scale type.
         */
        setMinimumType(type: any): void;
        /**
         * Sets the minimum scale value.
         * @param {object} value The scale value.
         */
        setMinimumValue(value: any): void;
    }

    export class Top10Condition{
        /**
         * Represents a top 10 condition with the specified type and rank, for the specified cell ranges.
         * @class
         * @param {GcSpread.Sheets.Top10ConditionTypetype} type The condition type for the rule.
         * @param {number} rank The rank of the rule.
         * @param {Array} ranges The cell ranges for the condition. The array item type is GcSpread.Sheets.Range.
         */
        constructor(type?: Top10ConditionType, rank?: number, ranges?: Range[]);
        /** The expected rank.
         * @type {number}
         */
        expected: any;
        /** Gets or sets a value that indicates whether to ignore the null value.
         * @type {boolean}
         */
        ignoreBlank: boolean;
        /** Gets or sets the range array.
         * @type {Array} The cell ranges for the condition. The array item type is GcSpread.Sheets.Range.
         */
        ranges: any;
        /** Gets or sets the top 10 condition type.
         * @type {GcSpread.Sheets.Top10ConditionType}
         */
        type: any;
        /**
         * Evaluates the condition using the specified evaluator.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualObj The actual value object for evaluation.
         * @returns {boolean} <c>true</c> if the result is successful; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actualObj: any): boolean;
        /**
         * Gets the expected value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} basecol The base column index for evaluation.
         * @returns {number} The expected value.
         */
        getExpected(evaluator: any, baseRow: number, basecol: number): any;
        /**
         * Gets the expected integer value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @returns {number} The expected integer value.
         */
        getExpectedInt(evaluator: any, baseRow: number, baseColumn: number): number;
        /**
         * Resets this instance.
         */
        reset(): void;
    }

    export class Top10Rule extends ConditionRuleBase{
        /**
         * Represents a top 10 condition rule.
         * @extends GcSpread.Sheets.ConditionRuleBase
         * @param {GcSpread.Sheets.Top10ConditionType} type The comparison operator for the text rule.
         * @param {number} rank Gets the rank of the Top10Rule.
         * @param {GcSpread.Sheets.Style} style The cell style for the rule.
         * @class
         */
        constructor(type: Top10ConditionType, rank: number, style: Style);
        /** Gets the rank of the Top10Rule.
         * @type {number}
         */
        rank: any;
        /** The comparison operator for the text rule.
         * @type {GcSpread.Sheets.Top10ConditionType}
         */
        type: any;
        /**
         * Creates a condition for the rule.
         * @returns {GcSpread.Sheets.Top10Condition} The condition for the rule.
         */
        createCondition(): Top10Condition;
        /**
         * Resets this instance.
         */
        reset(): void;
    }

    export class TouchToolStrip{
        /**
         * Represents a toolbar.
         * @class
         * @param {any} spread The Spread object.
         */
        constructor(spread: any);
        /**
         * Adds an item to the touch toolbar.
         * @param {any} item The item to be added.
         * @remarks The item to be added can be a toolbar item or a line separator.
         */
        add(item: any): any;
        /**
         * Clears all items in the toolbar.
         */
        clear(): any;
        /**
         * Closes the toolbar.
         */
        close(): any;
        /**
         * Gets the item with the specified name.
         * @param {string} name The item name.
         * @returns If the item exists in the toolbar, the item is returned; otherwise, returns undefined.
         */
        getItem(name: string): any;
        /**
         * Gets all the items that belong to the toolbar.
         * @returns An array that contains all the items in the toolbar.
         */
        getItems(): any;
        /**
         * Sets the image area height.
         * @param {number} height The image area height.
         * @returns {any} If called without a parameter, returns the current image area height; otherwise, returns the current toolbar object.
         */
        imageAreaHeight(height?: number): any;
        /**
         * Sets the toolbar item height.
         * @param {number} height The toolbar item height.
         * @returns {any} If called without a parameter, returns the current item height; otherwise, returns the current toolbar object.
         */
        itemHeight(height?: number): any;
        /**
         * Set the toolbar item width.
         * @param {number} width The toolbar item width.
         * @returns {any} If called without a parameter, returns the current item width; otherwise, returns the current toolbar object.
         */
        itemWidth(width?: number): any;
        /**
         * Opens a toolbar in a specific position relative to the touch point.
         * @param {number} x The <i>x</i>-coordinate.
         * @param {number} y The <i>y</i>-coordinate.
         */
        open(x: number, y: number): any;
        /**
         * Removes the toolbar item with the specified name.
         * @param {string} name The name of the item to be removed.
         * @returns {GcSpread.Sheets.TouchToolStripItem} The removed item.
         */
        remove(name: string): TouchToolStripItem;
        /**
         * Sets the toolbar separator height.
         * @param {number} height The toolbar separator height.
         * @returns {any} If called without a parameter, returns the current separator height; otherwise, returns the current toolbar object.
         */
        separatorHeight(height?: number): any;
    }

    export class TouchToolStripItem{
        /**
         * Represents an item in the toolbar.
         * @class
         * @param {string} name The name of the item.
         * @param {string} text The item text.
         * @param {string} image The item image source.
         * @param {any} command Defines the executive function that occurs when the user taps the item.
         * @param {any} canExecute Defines when to show the item by a function. If returns <c>true</c>, display the item; otherwise, hide the item.
         */
        constructor(name: string, text: string, image: string, command?: any, canExecute?: any);
        /**
         * The font of the item text.
         * @param {string} value The font of the toolbar item text.
         * @returns {any} If called without a parameter, returns the current item text font; otherwise, returns the current item object.
         */
        font(value?: string): any;
        /**
         * The color of the item text.
         * @param {string} value The color of the toolbar item text.
         * @returns {any} If called without a parameter, returns the current item text font color; otherwise, returns the current item object.
         */
        foreColor(value?: string): any;
        /**
         * The source of the item image.
         * @param {string} value The path and filename for the item image source.
         * @returns {any} If called without a parameter, returns the current item image source; otherwise, returns the current item object.
         */
        image(value?: string): any;
        /**
         * The name of the item.
         * @param {string} value The name of the toolbar item.
         * @returns {any} If called without a parameter, returns the current item name; otherwise, returns the current item object.
         */
        name(value?: string): any;
        /**
         * The text of the item.
         * @param {string} value The text of the toolbar item.
         * @returns {any} If called without a parameter, returns the current item text; otherwise, returns the current item object.
         */
        text(value?: string): any;
    }

    export class TouchToolStripSeparator{
        /**
         * Represents a separator in the toolbar.
         * @class
         * @param {string} canExecute Defines when to display the separator by a function. If returns <c>true</c>, display the separator; otherwise, hide the separator.
         */
        constructor(canExecute?: any);
        /**
         * Gets the name of the separator.
         * @returns {string} Returns the current separator name.
         */
        name(): string;
    }

    export class TwoScaleRule extends ScaleRule{
        /**
         * Represents a two-color conditional scale rule with the specified parameters.
         * @extends GcSpread.Sheets.ScaleRule
         * @param {ScaleValueType} minType The minimum scale type.
         * @param minValue The minimum scale value.
         * @param {string} minColor The minimum scale color.
         * @param {ScaleValueType} maxType The maximum scale type.
         * @param maxValue The maximum scale value.
         * @param {string} maxColor The maximum scale color.
         * @class
         */
        constructor(minType: ScaleValueType, minValue: any, minColor: string, maxType: ScaleValueType, maxValue: any, maxColor: string);
        /**
         * Returns a specified value of the rule if the cell satisfies the condition.
         * @param {object} evaluator The evaluator.
         * @param {number} baseRow The row index.
         * @param {number} baseColumn The column index.
         * @param {object} actual The actual value object for evaluation.
         * @returns {string} A specified value of the rule if the cell satisfies the condition.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actual: any): string;
        /**
         * Gets the maximum color scale.
         * @returns {string} The maximum color scale.
         */
        getMaximumColor(): string;
        /**
         * Gets the maximum scale type.
         * @returns {object} The maximum scale type.
         */
        getMaximumType(): any;
        /**
         * Gets the maximum scale value.
         * @returns {object} The maximum scale value.
         */
        getMaximumValue(): any;
        /**
         * Gets the minimum scale color.
         * @returns {string} The minimum scale color.
         */
        getMinimumColor(): string;
        /**
         * Gets the type of minimum scale.
         * @returns {object} The type of minimum scale.
         */
        getMinimumType(): any;
        /**
         * Gets the minimum scale value.
         * @returns {object} The minimum scale value.
         */
        getMinimumValue(): any;
        /**
         * Resets the rule.
         */
        reset(): void;
        /**
         * Sets the maximum color scale.
         * @param {string} color The maximum scale color.
         */
        setMaximumColor(color: string): void;
        /**
         * Sets the maximum scale type.
         * @param {object} type The maximum scale type.
         */
        setMaximumType(type: any): void;
        /**
         * Sets the maximum scale value.
         * @param {object} value The maximum scale value.
         */
        setMaximumValue(value: any): void;
        /**
         * Sets the minimum scale color.
         * @param {string} color The minimum scale color.
         */
        setMinimumColor(color: string): void;
        /**
         * Sets the type of minimum scale.
         * @param {object} type The type of minimum scale.
         */
        setMinimumType(type: any): void;
        /**
         * Sets the minimum scale value.
         * @param {object} value The minimum scale value.
         */
        setMinimumValue(value: any): void;
    }

    export class UniqueCondition{
        /**
         * Represents a unique condition and sets whether to check for duplicate data.
         * @param {boolean} duplicated Whether to check for duplicate data.
         * @param {Array} ranges The cell ranges whose item type is GcSpread.Sheets.Range.
         * @class
         */
        constructor(duplicated: boolean, ranges: Range[]);
        /** Whether the expected value is duplicated or not.
         * @type {boolean}
         */
        expected: any;
        /** Whether to ignore the blank cell.
         * @type {boolean}
         */
        ignoreBlank: boolean;
        /** The cell range array for the condition.
         * @type {Array} The GcSpread.Sheets.Range Array.
         */
        ranges: any;
        /**
         * Evaluates the condition using the specified evaluator.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @param {object} actualObj The actual value object for evaluation.
         * @returns {boolean} <c>true</c> if the result is successful; otherwise, <c>false</c>.
         */
        evaluate(evaluator: any, baseRow: number, baseColumn: number, actualObj: any): boolean;
        /**
         * Gets the expected value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @returns {object} The expected value.
         */
        getExpected(evaluator: any, baseRow: number, baseColumn: number): any;
        /**
         * Gets the expected boolean value.
         * @param {object} evaluator The evaluator that can evaluate an expression or a function.
         * @param {number} baseRow The base row index for evaluation.
         * @param {number} baseColumn The base column index for evaluation.
         * @returns {boolean} The expected boolean value.
         */
        getExpectedBoolean(evaluator: any, baseRow: number, baseColumn: number): boolean;
        /**
         * Resets this instance.
         */
        reset(): void;
    }

    export class UniqueRule extends ConditionRuleBase{
        /**
         * Represents a unique condition rule.
         * @extends GcSpread.Sheets.ConditionRuleBase
         * @param {GcSpread.Sheets.Style} style The cell style.
         * @class
         */
        constructor(style: Style);
        /**
         * Creates a condition for the rule.
         * @returns {GcSpread.Sheets.UniqueCondition} The condition for the rule.
         */
        createCondition(): UniqueCondition;
    }

    export class VariSparkline{
        /**
         * Represents the class for the variance sparkline.
         * @extends GcSpread.Sheets.SparklineEx
         * @class
         */
        constructor();
    }

    export class VBarSparkline{
        /**
         * Represents the class for the Vbar sparkline.
         * @extends GcSpread.Sheets.SparklineEx
         * @class
         */
        constructor();
    }
}
declare module GcSpread.Sheets.Calc{
    /**
     * Represents the missing argument constant.
     */
    var missingArgument: any;
    /**
     * Evaluates the specified formula.
     * @param {object} context The evaluation context; in general, you should use the active sheet object.
     * @param {string} formula The formula string.
     * @param {number} baseRow The base row index of the formula.
     * @param {number} baseColumn The base column index of the formula.
     * @param {boolean} useR1C1 Whether to use the R1C1 reference style.
     * @returns {object} The evaluated formula result.
     */
    function evaluateFormula(context: any, formula: string, baseRow?: number, baseColumn?: number, useR1C1?: boolean): any;
    /**
     * Converts the specified cell range to a formula string.
     * @param {GcSpread.Sheets.Range} ranges The cell range in the sheet.
     * @param {number} baseRow The base row index of the formula.
     * @param {number} baseCol The base column index of the formula.
     * @param {GcSpread.Sheets.Calc.RangeReferenceRelative} rangeReferenceRelative Whether the range reference is relative or absolute.
     * @param {boolean} useR1C1 Whether to use the R1C1 reference style.
     * @returns {string} The formula string that refers to the specified cell range.
     */
    function rangesToFormula(ranges: Range[], baseRow?: number, baseCol?: number, rangeReferenceRelative?: RangeReferenceRelative, useR1C1?: boolean): string;
    /**
     * Converts the specified cell range to a formula string.
     * @param {GcSpread.Sheets.Range} range The cell range in the sheet.
     * @returns {string} The formula string that refers to the specified cell range.
     */
    function rangeToFormula(range: Range, baseRow?: number, baseCol?: number, rangeReferenceRelative?: RangeReferenceRelative, useR1C1?: boolean): string;

    export interface IParserOption{
        listSeparator?: string;
        numberDecimalSeparator?: string;
        arrayGroupSeparator?: string;
    }

    /**
     * Represents the value type that the CalcEngine needed.
     * @enum {number}
     */
    export enum CalcValueType{
        /**
         *  The any type.
         */
        anyType = 0,
        /**
         *  The number type.
         */
        numberType = 1,
        /**
         *  The string type.
         */
        stringType = 2,
        /**
         *  The boolean type.
         */
        booleanType = 3,
        /**
         *  The date type.
         */
        dateType = 4
    }

    /**
     * Specifies whether the range reference is relative or absolute.
     * @enum {number}
     */
    export enum RangeReferenceRelative{
        /** Specifies all indexes are absolute.
         * @type {number}
         */
        allAbsolute = 0,
        /** Specifies the start row is relative.
         * @type {number}
         */
        startRowRelative = 1,
        /** Specifies the start column is relative.
         * @type {number}
         */
        startColRelative = 2,
        /** Specifies the end row is relative.
         * @type {number}
         */
        endRowRelative = 4,
        /** Specifies the end column is relative.
         * @type {number}
         */
        endColRelative = 8,
        /** Specifies the start row and end row are relative.
         * @type {number}
         */
        rowRelative = 5,
        /** Specifies the start column and end column are relative.
         * @type {number}
         */
        colRelative = 10,
        /** Specifies all indexes are relative.
         * @type {number}
         */
        allRelative = 15
    }


    export class AsyncEvaluateContext{
        /**
         * Represents an evaluate context for async functions.
         * @class
         * @param {GcSpread.Sheets.Calc.EvaluateContext} context The common evaluate context.
         */
        constructor(context: EvaluateContext);
        /**
         * Set the async function evaluate result to CalcEngine, CalcEngine will use this value to recalculate the cell that contains this async function and all dependents cells.
         * @param {object} value The async function evaluate result.
         */
        SetAsyncResult(value: any): any;
    }

    export class CalcArray{
        /**
         * Represents a Calc Array that wraps a source object to be a two-dimensional array.
         * @class GcSpread.Sheets.Calc.Array
         */
        constructor();
        /**
         * Gets the number of columns in the array.
         * @returns {number}
         */
        getColumnCount(): number;
        /**
         * Gets the number of rows in the array.
         * @returns {number}
         */
        getRowCount(): number;
        /**
         * Gets the value at the specified position in the array.
         * @param {number} row The row index for which to return the value.
         * @param {number} column The column index for which to return the value.
         * @returns {object} The value at the specified position.
         */
        getValue(row: number, column: number): any;
        /**
         * Gets the value at the specified position in the array.
         * @param {number} index The index for which to return the value.
         * @returns {object} The value at the specified position.
         */
        getValueByIndex(index: number): any;
        /**
         * Gets the length of this array.
         * @returns {number}
         */
        length(): number;
    }

    export class CalcError{
        /**
         * Represents an error in calculation.
         * @class
         * @param {string} error The description of the error.
         * @param {number} errorCode The error code.
         */
        constructor(error?: string, errorCode?: number);
        /**
         * Parses the specified error from the string.
         * @param {string} value The error string.
         * @returns {GcSpread.Sheets.Calc.Error} The calculation error.
         */
        static parse(value: string): Error;
        /**
         * Returns a string that represents this instance.
         * @returns {string} The error string.
         */
        toString(): string;
    }

    export class Errors{
        /**
         * Represents an Errors object that lists all the supported errors.
         * @class GcSpread.Sheets.Calc.Errors
         */
        constructor();
        /**
         * Indicates a divide by zero error.
         * @type {GcSpread.Sheets.Calc.Error}
         */
        static DivideByZero: any;
        /**
         * Indicates a name error.
         * @type {GcSpread.Sheets.Calc.Error}
         */
        static Name: any;
        /**
         * Indicates a not available error.
         * @type {GcSpread.Sheets.Calc.Error}
         */
        static NotAvailable: any;
        /**
         * Indicates a null error.
         * @type {GcSpread.Sheets.Calc.Error}
         */
        static Null: any;
        /**
         * Indicates a number error.
         * @type {GcSpread.Sheets.Calc.Error}
         */
        static Number: any;
        /**
         * Indicates a reference error.
         * @type {GcSpread.Sheets.Calc.Error}
         */
        static Reference: any;
        /**
         * Indicates a value error.
         * @type {GcSpread.Sheets.Calc.Error}
         */
        static Value: any;
    }

    export class EvaluateContext{
        /**
         * Represents the context for CalcEvaluator, which provides variant queries to get needed data.
         * @class
         * @param {object} source The source.
         * @param {boolean} arrayFormula If set to true, [array formula mode].
         * @param {number} baseRow The row index of the cell which you want to evaluate or the top left row index of array formula.
         * @param {number} baseColumn The column index of the cell which you want to evaluate or the top left column index of array formula.
         * @param {number} rowCount The row count of array formula.
         * @param {number} columnCount The column count of array formula.
         * @param {number} activeRow The row index of the cell which you want to evaluate.
         * @param {number} activeColumn The column index of the cell which you want to evaluate.
         */
        constructor(source: Object, arrayFormula?: boolean, baseRow?: number, baseColumn?: number, rowCount?: number, columnCount?: number, activeRow?: number, activeColumn?: number);
        /**
         * Gets the CalcFunction that has the specified name.
         * @param {string} name The name.
         * @returns {GcSpread.Sheets.Calc.Functions.Function} The CalcFunction with the specified name. If the name is not recognized, returns null.
         */
        getFunction(name: string): Functions.Function;
        /**
         * Gets a CalcExpression that has the specified name.
         * @param {string} name The name.
         * @returns {GcSpread.Sheets.Calc.Expressions.Expression} The CalcExpression with the specified name.
         */
        getName(name: string): Expressions.Expression;
        /**
         * Gets the reference at the specified position.
         * @param {object} source The source.
         * @param {number} row The base row.
         * @param {number} column The base column.
         * @param {number} rowCount The row count.
         * @param {number} columnCount The column count.
         * @returns {object} An object that indicates the reference. If the source is null, returns a Reference.
         */
        getReference(source: Object, row: number, column: number, rowCount: number, columnCount: number): any;
        /**
         * Gets the value at the specified position.
         * @param {object} source The source.
         * @param {number} row The row.
         * @param {number} column The column.
         * @returns {number} An object that indicates the value. If the source is null, returns a Reference.
         */
        getValue(source: any, row: number, column: number): any;
    }

    export class Evaluator{
        /**
         * Represents an evaluator that is used for evaluating an expression with the specified context.
         * @class
         */
        constructor();
        /**
         * Evaluates an expression with the specified context.
         * @param {GcSpread.Sheets.Calc.Expressions.Expression} expression The expression to be evaluated.
         * @param {GcSpread.Sheets.Calc.EvaluateContext} evaluatorContext The context for the evaluator to query data.
         * @returns {object} The result of the evaluation.
         */
        evaluateExpression(expression: Expressions.Expression, evaluatorContext?: EvaluateContext, convertNullToZero?:boolean): any;
    }

    export class Parser{
        /**
         * Represents a parser that is used for parsing a string formula to a CalcExpression and unparsing a CalcExpression to a string.
         * @class
         * @param {Object} option The options.
         */
        constructor(option?: IParserOption);
        /**
         * Parses a string formula to the expression using the specified ParserContext.
         * @param {string} formula A string formula.
         * @param {GcSpread.Sheets.Calc.ParserContext} context The parser context setting.
         * @returns {GcSpread.Sheets.Calc.Expressions.Expression} The expression for the parsed string formula.
         */
        parse(formula: string, context?: ParserContext): Expressions.Expression;
        /**
         * Unparses a CalcExpression to a string using the specified ParserContext.
         * @param {GcSpread.Sheets.Calc.Expressions.Expression} expr An expression that indicates the expression tree.
         * @param {GcSpread.Sheets.Calc.ParserContext} context The parser context setting.
         * @returns {string} The specified CalcExpression as a string.
         */
        unparse(expr: Expressions.Expression, context?: ParserContext): string;
    }

    export class ParserContext{
        /**
         * Represents a parser context, which is used for the CalcParser processes.
         * @class
         * @param {boolean} useR1C1 If set to true, use R1C1 notation.
         * @param {number} baseRow The base row.
         * @param {number} baseColumn The base column.
         * @param {Object} option The culture option.
         */
        constructor(source: Object, useR1C1: boolean, baseRow: number, baseColumn: number, option?: IParserOption);
        /**
         * Gets the external source.
         * @param {string} bookName The name of the workbook.
         * @param {string} sheetName The name of the worksheet.
         * @returns {GcSpread.Sheets.Calc.CalcSource} the external source.
         */
        getExternalSource(bookName: string, sheetName: string): Object;
        /**
         * Gets the external source token.
         * @param {GcSpread.Sheets.Calc.CalcSource} source The source.
         * @returns {string} The external source token.
         */
        getExternalSourceToken(source: Object): string;
    }

    export class Reference{
        /**
         * Represents an area referenced in a spread sheet.
         * @class GcSpread.Sheets.Calc.Reference
         */
        constructor();
        /**
         * Gets the base column index for the specified range.
         * @param {number} range The range index.
         * @returns {number} The base column index.
         */
        getColumn(range: number): number;
        /**
         * Gets the column count for the specified range.
         * @param {number} range The range index.
         * @returns {number} The column count.
         */
        getColumnCount(range: number): number;
        /**
         * Gets the count of the ranges in the current area.
         * @returns {number} The number of ranges in the current area.
         */
        getRangeCount(): number;
        /**
         * Gets the base row index for the specified range.
         * @param {number} range The range index.
         * @returns {number} The base row index.
         */
        getRow(range: number): number;
        /**
         * Gets the row count for the specified range.
         * @param {number} range The range index.
         * @returns {number} The row count.
         */
        getRowCount(range: number): number;
        /**
         * Gets the source area.
         * @returns {GcSpread.Sheets.Calc.Reference} The source area.
         */
        getSource(): Object;
        /**
         * Gets the value at the specified position.
         * @param {number} range The range index.
         * @param {number} rowOffset The row offset.
         * @param {number} columnOffset The column offset.
         * @returns {object}
         */
        getValue(range: number, rowOffset: number, columnOffset: number): any;
        /**
         * Determines whether the specified row is a hidden.
         * @param {number} range The range index.
         * @param {number} rowOffset The row offset.
         * @param {boolean} onlyFiltered Only consider the filtered hidden row.
         * @returns {boolean} Returns <c>true</c> if the range is hidden; otherwise, <c>false</c>.
         */
        isHiddenRow(range: number, rowOffset: number, onlyFiltered?: boolean): boolean;
        /**
         * Determines whether the specified range is a subtotal.
         * @param {number} range The range index.
         * @param {number} rowOffset The row offset.
         * @param {number} columnOffset The column offset.
         * @returns {boolean} Returns <c>true</c> if the range is a subtotal; otherwise, <c>false</c>.
         */
        isSubtotal(range: number, rowOffset: number, columnOffset: number): boolean;
    }
    module Expressions{

        export class ArrayExpression extends ConstantExpression{
            /**
             * Represents an array constant value.
             * @extends GcSpread.Sheets.Calc.Expressions.ConstantExpression
             * @class
             * @param {any[]} value The array values.
             */
            constructor(value: any[]);
        }

        export class BangCellExpression extends CellExpression{
            /**
             * Represents a cell reference on the current sheet.
             * @extends GcSpread.Sheets.Calc.Expressions.CellExpression
             * @class
             * @param {number} row The row coordinate of the cell.
             * @param {number} column The column coordinate of the cell.
             * @param {boolean} rowRelative Whether the row coordinate is relative.
             * @param {boolean} columnRelative Whether the column coordinate is relative.
             */
            constructor(row: number, column: number, rowRelative?: boolean, columnRelative?: boolean);
        }

        export class BangErrorExpression extends ErrorExpression{
            /**
             * Represents an error value on the current sheet.
             * @extends GcSpread.Sheets.Calc.Expressions.ErrorExpression
             * @class
             * @param {GcSpread.Sheets.Calc.Error} value The error value.
             */
            constructor(value: Error);
        }

        export class BangNameExpression extends NameExpression{
            /**
             * Represents an expression with a named variable on the current sheet as the expression.
             * @extends GcSpread.Sheets.Calc.Expressions.NameExpression
             * @class
             * @param {string} name The named variable.
             */
            constructor(name: string);
        }

        export class BangRangeExpression extends RangeExpression{
            /**
             * Represents a cell range reference on the current sheet.
             * @extends GcSpread.Sheets.Calc.Expressions.RangeExpression
             * @class
             * @param {number} startRow The starting row coordinate of the range.
             * @param {number} startColumn The starting column coordinate of the range.
             * @param {number} endRow The ending row coordinate of the range.
             * @param {number} endColumn The ending column coordinate of the range.
             * @param {boolean} startRowRelative Whether the starting row coordinate is relative or absolute.
             * @param {boolean} startColumnRelative Whether the starting column coordinate is relative or absolute.
             * @param {boolean} endRowRelative Whether the ending row coordinate is relative or absolute.
             * @param {boolean} endColumnRelative Whether the ending column coordinate is relative or absolute.
             */
            constructor(startRow?: number, startColumn?: number, endRow?: number, endColumn?: number, startRowRelative?: boolean, startColumnRelative?: boolean, endRowRelative?: boolean, endColumnRelative?: boolean);
        }

        export class BinaryOperatorExpression extends OperatorExpression{
            /**
             * Represents an expression that has a binary operator.
             * @extends GcSpread.Sheets.Calc.Expressions.OperatorExpression
             * @class
             * @param {object} operator The binary operator.
             * @param {object} left The left operand.
             * @param {object} right The right operand.
             */
            constructor(operator?: any, left?: Expression, right?: Expression);
        }

        export class BooleanExpression extends ConstantExpression{
            /**
             * Represents a boolean constant value.
             * @extends GcSpread.Sheets.Calc.Expressions.ConstantExpression
             * @class
             * @param {boolean} boolValue The boolean value.
             */
            constructor(value: boolean);
        }

        export class CellExpression{
            /**
             * Represents a cell reference expression.
             * @extends GcSpread.Sheets.Calc.Expressions.ReferenceExpression
             * @class
             * @param {number} row The row coordinate of the cell.
             * @param {number} column The column coordinate of the cell.
             * @param {boolean} rowRelative Whether the row coordinate is relative.
             * @param {boolean} columnRelative Whether the column coordinate is relative.
             */
            constructor(row?: number, column?: number, rowRelative?: boolean, columnRelative?: boolean);
            /**
             * Gets the identity of the current expressions based on <paramref name="baseRow"/> and <paramref name="baseColumn"/>.
             * @param {number} baseRow The base row.
             * @param {number} baseColumn The base column.
             * @returns {Object} The current expressions.
             */
            getRange(baseRow: number, baseColumn: number): Object;
        }

        export class ConstantExpression extends Expression{
            /**
             * Represents an expression that has a constant value.
             * @extends GcSpread.Sheets.Calc.Expressions.Expression
             * @class
             * @param {object} value The constant value.
             */
            constructor(value: any);
        }

        export class DoubleExpression extends ConstantExpression{
            /**
             * Represents a double constant value.
             * @extends GcSpread.Sheets.Calc.Expressions.ConstantExpression
             * @class
             * @param {number} value The double value.
             * @param {string} originalNumAsString The original string of the number.
             */
            constructor(value: number, originalNumAsString?: string);
        }

        export class ErrorExpression extends ConstantExpression{
            /**
             * Represents an error constant value.
             * @extends GcSpread.Sheets.Calc.Expressions.ConstantExpression
             * @class
             * @param {GcSpread.Sheets.Calc.Error} value The error value.
             */
            constructor(value: Error);
        }

        export class Expression{
            /**
             * Provides the base class from which the classes that represent expression tree nodes are derived. This is an abstract class.
             * @class
             */
            constructor();
        }

        export class ExternalCellExpression{
            /**
             * Represents a cell reference expression.
             * @extends GcSpread.Sheets.Calc.Expressions.ExternalReferenceExpression
             * @class
             * @param {number} source The owner of the cell.
             * @param {number} row The row coordinate of the cell.
             * @param {number} column The column coordinate of the cell.
             * @param {boolean} rowRelative Whether the row coordinate is relative.
             * @param {boolean} columnRelative Whether the column coordinate is relative.
             */
            constructor(source?: any, row?: number, column?: number, rowRelative?: boolean, columnRelative?: boolean);
            /**
             * Gets the identity of current expressions based on <paramref name="baseRow"/> and <paramref name="baseColumn"/>.
             * @param {number} baseRow The base row.
             * @param {number} baseColumn The base column.
             * @returns {Object} The current expressions.
             */
            getRange(baseRow: number, baseColumn: number): Object;
        }

        export class ExternalErrorExpression extends ErrorExpression{
            /**
             * Represents an external error value.
             * @extends GcSpread.Sheets.Calc.Expressions.ErrorExpression
             * @class
             * @param {object} source The owner of the error.
             * @param {GcSpread.Sheets.Calc.Error} value The error value.
             */
            constructor(source: any, value: Error);
        }

        export class ExternalNameExpression{
            /**
             * Represents an expression with a named variable as the expression.
             * @extends GcSpread.Sheets.Calc.Expressions.NameExpression
             * @class
             * @param {object} source The owner that contains the named variable.
             * @param {string} name The named variable.
             */
            constructor(source: any, name: string);
        }

        export class ExternalRangeExpression{
            /**
             * Represents a cell range reference expression.
             * @extends GcSpread.Sheets.Calc.Expressions.ExternalReferenceExpression
             * @class
             * @param {object} source The owner of the cell range.
             * @param {number} startRow The starting row coordinate of the range.
             * @param {number} startColumn The starting column coordinate of the range.
             * @param {number} endRow The ending row coordinate of the range.
             * @param {number} endColumn The ending column coordinate of the range.
             * @param {boolean} startRowRelative Whether the starting row coordinate is relative or absolute.
             * @param {boolean} startColumnRelative Whether the starting column coordinate is relative or absolute.
             * @param {boolean} endRowRelative Whether the ending row coordinate is relative or absolute.
             * @param {boolean} endColumnRelative Whether the ending column coordinate is relative or absolute.
             */
            constructor(source?: any, startRow?: number, startColumn?: number, endRow?: number, endColumn?: number, startRowRelative?: boolean, startColumnRelative?: boolean, endRowRelative?: boolean, endColumnRelative?: boolean);
            /**
             * Gets the identity of the current expressions based on <paramref name="baseRow"/> and <paramref name="baseColumn"/>.
             * @param {number} baseRow The base row.
             * @param {number} baseColumn The base column.
             * @returns {object} The current expressions.
             */
            getRange(baseRow: number, baseColumn: number): Object;
        }

        export class ExternalReferenceExpression extends ReferenceExpression{
            /**
             * Represents an external reference expression.
             * @extends GcSpread.Sheets.Calc.Expressions.ReferenceExpression
             * @class
             * @param {object} source The owner of the cell.
             */
            constructor(source: Object);
        }

        export class FunctionExpression extends Expression{
            /**
             * Represents an expression with a function applied to a list of parameters as the expression.
             * @extends GcSpread.Sheets.Calc.Expressions.Expression
             * @class
             * @param {object} fn The name of the function.
             * @param {object[]} args The list of parameters.
             */
            constructor(fn: any, args?: Expression[]);
            /**
             * Gets the number of parameters being passed to the function.
             * @returns {number} The number of parameters.
             */
            argCount(): number;
            /**
             * Returns the specified parameter being passed to the function.
             * @param {number} index The index of the parameter (or argument).
             * @returns {object} The specified parameter.
             */
            getArg(index: number): any;
            /**
             * Gets the name of the function.
             * @returns {string} The name of the function.
             */
            getFunctionName(): string;
        }

        export class MissingArgumentExpression extends ConstantExpression{
            /**
             * Represents a missing argument constant value.
             * @extends GcSpread.Sheets.Calc.Expressions.ConstantExpression
             * @class
             */
            constructor();
        }

        export class NameExpression{
            /**
             * Represents an expression with a named variable on the current sheet as the expression.
             * @extends GcSpread.Sheets.Calc.Expressions.Expression
             * @class
             * @param {string} name The named variable.
             */
            constructor(name: string);
        }

        export class OperatorExpression extends Expression{
            /**
             * Represents an operator expression. This is an abstract class.
             * @extends GcSpread.Sheets.Calc.Expressions.Expression
             * @class
             * @param {object} operator The operator.
             */
            constructor(operator: any);
        }

        export class ParenthesesExpression extends Expression{
            /**
             * Represents an expression type for parentheses surrounding a specified expression.
             * @extends GcSpread.Sheets.Calc.Expressions.Expression
             * @class
             * @param {object} arg The expression inside the parentheses.
             */
            constructor(arg?: Expression);
        }

        export class RangeExpression{
            /**
             * Represents a cell range reference expression.
             * @extends GcSpread.Sheets.Calc.Expressions.ReferenceExpression
             * @class
             * @param {number} startRow The starting row coordinate of the range.
             * @param {number} startColumn The starting column coordinate of the range.
             * @param {number} endRow The ending row coordinate of the range.
             * @param {number} endColumn The ending column coordinate of the range.
             * @param {boolean} startRowRelative Whether the starting row coordinate is relative or absolute.
             * @param {boolean} startColumnRelative Whether the starting column coordinate is relative or absolute.
             * @param {boolean} endRowRelative Whether the ending row coordinate is relative or absolute.
             * @param {boolean} endColumnRelative Whether the ending column coordinate is relative or absolute.
             */
            constructor(startRow?: number, startColumn?: number, endRow?: number, endColumn?: number, startRowRelative?: boolean, startColumnRelative?: boolean, endRowRelative?: boolean, endColumnRelative?: boolean);
            /**
             * Gets the identity of the current expressions based on <paramref name="baseRow"/> and <paramref name="baseColumn"/>.
             * @param {number} baseRow The base row.
             * @param {number} baseColumn The base column.
             * @returns {Object} The current expressions.
             */
            getRange(baseRow: number, baseColumn: number): Object;
        }

        export class ReferenceExpression extends Expression{
            /**
             * Represents a reference expression. This is an abstract class.
             * @extends GcSpread.Sheets.Calc.Expressions.Expression
             * @class
             */
            constructor();
            /**
             * Gets the identity of current expressions based on <paramref name="baseRow"/> and <paramref name="baseColumn"/>.
             * @param {number} baseRow The base row.
             * @param {number} baseColumn The base column.
             * @returns {Object} The current expressions.
             */
            getRange(baseRow: number, baseColumn: number): Object;
        }

        export class SheetRangeErrorExpression extends ErrorExpression{
            /**
             * Represents an external error value.
             * @extends GcSpread.Sheets.Calc.Expressions.ErrorExpression
             * @class
             * @param {object} startSource Starting owner of error.
             * @param {object} endSource Ending owner of error.
             * @param {GcSpread.Sheets.Calc.Error} value The error value.
             */
            constructor(startSource: any, endSource: any, value: Error);
        }

        export class SheetRangeExpression{
            /**
             * Represents a sheet range reference expression.
             * @extends GcSpread.Sheets.Calc.Expressions.ReferenceExpression
             * @class
             * @param {object} startSource The starting owner of the cell range.
             * @param {object} endSource The ending owner of the cell range.
             * @param {number} startRow The starting row coordinate of the range.
             * @param {number} startColumn The starting column coordinate of the range.
             * @param {number} endRow The ending row coordinate of the range.
             * @param {number} endColumn The ending column coordinate of the range.
             * @param {boolean} startRowRelative Whether the starting row coordinate is relative or absolute.
             * @param {boolean} startColumnRelative Whether the starting column coordinate is relative or absolute.
             * @param {boolean} endRowRelative Whether the ending row coordinate is relative or absolute.
             * @param {boolean} endColumnRelative Whether the ending column coordinate is relative or absolute.
             */
            constructor(startSource: any, endSource: any, startRow?: number, startColumn?: number, endRow?: number, endColumn?: number, startRowRelative?: boolean, startColumnRelative?: boolean, endRowRelative?: boolean, endColumnRelative?: boolean);
            /**
             * Gets the identity of the current expressions based on <paramref name="baseRow"/> and <paramref name="baseColumn"/>.
             * @param {number} baseRow The base row.
             * @param {number} baseColumn The base column.
             * @returns {Object} The current expressions.
             */
            getRange(baseRow: number, baseColumn: number): Object;
        }

        export class StringExpression extends ConstantExpression{
            /**
             * Represents a string constant value.
             * @extends GcSpread.Sheets.Calc.Expressions.ConstantExpression
             * @class
             * @param {string} value The string value.
             */
            constructor(value: string);
        }

        export class StructReferenceExpression extends ReferenceExpression{
            /**
             * Represents a struct reference expression.
             * @extends GcSpread.Sheets.Calc.Expressions.ReferenceExpression
             * @class
             * @param {string} structRef The struct reference string.
             */
            constructor(structRef: string, context: Calc.ParserContext);
        }

        export class UnaryOperatorExpression extends OperatorExpression{
            /**
             * Represents an expression that has a unary operator.
             * @extends GcSpread.Sheets.Calc.Expressions.OperatorExpression
             * @class
             * @param {object} operator The unary operator.
             * @param {object} operand The operand.
             */
            constructor(operator?: any, operand?: Expression);
        }
    }

    module Functions{
        /**
         * Defines a global custom function.
         * @param {string} name The name of the function.
         * @param {object} fnEvaluate The function to evaluate.
         * @param {Object} options The options.
         * @returns {GcSpread.Sheets.Calc.Functions.Function} The created custom function.
         */
        function defineGlobalCustomFunction(name: string, fnEvaluate: (args: any) => any, options?: FunctionOption): Functions.Function;
        /**
         * Finds a function by name.
         * @param {string} name The name of the function.
         * @returns {GcSpread.Sheets.Functions.Function} The function with the specified name.
         */
        function findGlobalFunction(name: string): Functions.Function;

        export interface FunctionOption{
            override?: boolean;
            minArgs?: number;
            maxArgs?: number;
            acceptsArray?: (argIndex: number) => boolean;
            acceptsReference?: (argIndex: number) => boolean;
            acceptsError?: (argIndex: number) => boolean;
            acceptsMissingArgument?: (argIndex: number) => boolean;
            isVolatile?: () => boolean;
            isContextSensitive?: () => boolean;
            isBranch?: () => boolean;
            findTestArgument?: () => number;
        }

        /**
         * Indicates how to process the array or range arguments of a function.
         * @enum {number}
         */
        export enum ArrayArgumentEvaluateMode{
            /**
             *  Expand the array or range arguments normally.
             */
            normal = 0,
            /**
             *  Always expand the range arguments as array formula.
             */
            allwaysExpand = 1,
            /**
             *  Never expand the array or range arguments.
             */
            neverExpand = 2
        }


        export class AsyncFunction extends Function{
            /**
             * Represents an abstract base class for defining asynchronization functions.
             * @class
             * @param {string} name The name of the function.
             * @param {number} minArgs The minimum number of arguments for the function.
             * @param {number} maxArgs The maximum number of arguments for the function.
             */
            constructor(name?: string, minArgs?: number, maxArgs?: number);
            /**
             * Returns the default value of the function evaluate result before get the really async result.
             * @returns {object} The default value of the function evaluate result before get the really async result.
             */
            defaultValue(): any;
            /**
             * Returns the result of the function applied to the arguments.
             * @param {object} args Arguments for the function evaluation
             * @param {GcSpread.Sheets.Calc.AsyncEvaluateContext} context The evaluate context
             * @returns {object} The result of the function applied to the arguments.
             */
            evaluateAsync(args: any, context: AsyncEvaluateContext): any;
        }

        export class Function{
            /**
             * Represents an abstract base class for defining functions.
             * @class
             * @param {string} name The name of the function.
             * @param {number} minArgs The minimum number of arguments for the function.
             * @param {number} maxArgs The maximum number of arguments for the function.
             */
            constructor(name?: string, minArgs?: number, maxArgs?: number);
            /**
             * Represents the type name string used for supporting serialization.
             * @type {string}
             */
            typeName: string;
            /**
             * Determines whether the function accepts array values for the specified argument.
             * @param {number} argIndex Index of the argument.
             * @function
             * @returns {boolean} <c>true</c> if the function accepts array values for the specified argument; otherwise, <c>false</c>.
             */
            acceptsArray(argIndex: number): boolean;
            /**
             * Indicates whether the function can process Error values.
             * @param {number} argIndex Index of the argument.
             * @returns {boolean} <c>true</c> if the function can process Error values for the specified argument; otherwise, <c>false</c>.
             * @function
             */
            acceptsError(argIndex: number): boolean;
            /**
             * Indicates whether the Evaluate method can process missing arguments.
             * @param {number} argIndex Index of the argument
             * @returns {boolean} <c>true</c> if the Evaluate method can process missing arguments; otherwise, <c>false</c>.
             */
            acceptsMissingArgument(argIndex: number): boolean;
            /**
             * Determines whether the function accepts Reference values for the specified argument.
             * @param {number} argIndex Index of the argument.
             * @returns {boolean} <c>true</c> if the function accepts Reference values for the specified argument; otherwise, <c>false</c>.
             * @function
             */
            acceptsReference(argIndex: number): boolean;
            /**
             * Returns the result of the function applied to the arguments.
             * @param {object} args Arguments for the function evaluation
             * @returns {object} The result of the function applied to the arguments.
             */
            evaluate(args: any, context?:EvaluateContext): any;
            /**
             * Finds the branch argument.
             * @param {object} test The test.
             * @returns {number} Indicates the index of the argument that would be treated as the branch condition.
             */
            findBranchArgument(test: any): number;
            /**
             * Finds the test argument when this function is branched.
             * @returns {number} Indicates the index of the argument that would be treated as the test condition.
             */
            findTestArgument(): number;
            /**
             * Loads the object state from the specified JSON string.
             * @param {Object} settings The function data from deserialization.
             */
            fromJSON(settings: Object): void;
            /**
             * Gets a value indicating whether this function is branched by arguments as conditional.
             * @returns {boolean} <c>true</c> if this instance is branched; otherwise, <c>false</c>.
             */
            isBranch(): boolean;
            /**
             * Determines whether the evaluation of the function is dependent on the context in which the evaluation occurs.
             * @returns {boolean} <c>true</c> if the evaluation of the function is dependent on the context; otherwise, <c>false</c>.
             */
            isContextSensitive(): boolean;
            /**
             * Determines whether the function is volatile while it is being evaluated.
             * @returns {boolean} <c>true</c> if the function is volatile; otherwise, <c>false</c>.
             */
            isVolatile(): boolean;
            /**
             * Saves the object state to a JSON string.
             * @returns {Object} The function data.
             */
            toJSON(): Object;
            /**
             * Returns the string representation of the function.
             * @returns {string} The string representation of the function.
             */
            toString(): string;
        }
    }

    module Operators{

        export class BinaryOperator extends Operator{
            /**
             * Represents a binary operator.
             * @class
             * @param {string} name The name of the operator.
             * @param {boolean} acceptsReference Determines whether the operator accepts reference values for the specified operand.
             */
            constructor(name: string, acceptsReference?: boolean);
            /**
             * Returns the result of the operator applied to the operands.
             * @param {object} left The left operand.
             * @param {object} right The right operand.
             * @param {object} context The context associated with the operator evaluation.
             * @returns {object} Result of the operator applied to the operands.
             */
            evaluate(left: any, right: any, context?: any): any;
        }

        export class Operator{
            /**
             * Represents an operator. This is a base class.
             * @class
             * @param {string} name The name of the operator.
             */
            constructor(name: any);
            /**
             * Tests whether two operator structures are different.
             * @returns {boolean} <c>true</c> if the operators are the same; otherwise, <c>false</c>.
             */
            compareTo(other: Operator): boolean;
            /**
             * Gets the name of the operator.
             * @returns {string} The name of the operator.
             */
            getName(): string;
        }

        export class UnaryOperator extends Operator{
            /**
             * Returns the result of the operator applied to the operand.
             * @class
             * @param {string} name Represents the operator name.
             */
            constructor(name: string);
            /**
             * Returns the result of the operator applied to the operand.
             * @param {object} operand The operand for the operator evaluation.
             * @param {object} context The context associated with the operator evaluation.
             * @returns {object} The result of the operator applied to the operand.
             */
            evaluate(operand: any, context?: any): any;
        }
    }

}
declare module GcSpread.Sheets.UndoRedo{

    export class ActionBase{
        /**
         * Represents the actions in the component for which the user can perform an undo or redo.
         * @class
         */
        constructor();
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves the state for undoing the command or operation.
         */
        saveState(): void;
        /**
         * Undoes the command or operation.
         * @param {object} arg The parameter to undo the command or operation.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class CellEditUndoAction extends ActionBase{
        /**
         * Represents a cell edit undo action that applies a new value to a cell on the sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The edit cell sheet.
         * @param {object} cellEditInfo The edit cell extent information.
         */
        constructor(sheet: Sheet, cellEditInfo: Object);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         *  Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the command or operation.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class ClearRangeValueUndoAction extends ActionBase{
        /**
         * Represents a clear range value undo action on the sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet on which to clear values.
         * @param {GcSpread.Sheets.Range} clearRange The clear value cell range.
         */
        constructor(sheet: Sheet, clearRange: Range);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action using the saved state information.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class ClearValueUndoAction extends ActionBase{
        /**
         * Represents a clear cells value undo action on the sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet on which to clear values.
         * @param {Array} ranges The clear value cell ranges whose item type is GcSpread.Sheets.Range.
         */
        constructor(sheet: Sheet, ranges: Range[]);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action using the saved state information.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class ClipboardPasteFloatingObjectUndoAction extends ActionBase{
        /**
         * Represents the Clipboard paste undo action for pasting the floating objects on the sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet invoking the action.
         * @param {GcSpread.Sheets.FloatingObjectExtent} floatingObjectExtent The extent.
         * @param {GcSpread.Sheets.Sheet} fromSheet The sheet that provided the contents to paste.
         */
        constructor(sheet: Sheet, floatingObjectExtent: FloatingObjectExtent, fromSheet: Sheet);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(sender: any): boolean;
        /**
         * Gets a value that indicates whether the command or operation can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(sender: any): void;
        /**
         * Undoes the command or operation.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(sender: any): boolean;
    }

    export class ClipboardPasteRangeUndoAction extends ActionBase{
        /**
         * Represents a paste undo action to paste a range on the sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that is invoking the action.
         * @param {GcSpread.Sheets.Sheet} srcSheet The source worksheet for the copy or cut.
         * @param {GcSpread.Sheets.Sheet} destSheet The target sheet of the paste.
         * @param {object} pasteExtent The paste extent information.
         * @param {GcSpread.Sheets.ClipboardPasteOptions} option The Clipboard pasting option that indicates which content to paste.
         */
        constructor(sheet: Sheet, srcSheet: any, destSheet: any, pasteExtent: PasteRangeExtent, option: ClipboardPasteOptions);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the command or operation can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(sender: any): void;
        /**
         * Gets the pasteOption of ClipboardPasteRangeUndoAction.
         * @returns {GcSpread.Sheets.ClipboardPasteOptions} The paste option of current clipboard paste action.
         *
         */
        pasteOption(): ClipboardPasteOptions;
        /**
         * Gets the target paste range of ClipboardPasteRangeUndoAction.
         * @returns {GcSpread.Sheets.Range} The target paste range of current clipboard paste action.
         *
         */
        pasteRange(): Range;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action on the worksheet.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(sender: any): boolean;
    }

    export class ClipboardPasteUndoAction extends ActionBase{
        /**
         * Represents the Clipboard paste undo action for pasting on the sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet that is invoking the action.
         * @param {GcSpread.Sheets.Sheet} srcSheet The source sheet for the copy or cut.
         * @param {GcSpread.Sheets.Sheet} destSheet The target sheet for pasting.
         * @param {object} pasteExtent The paste extent information.
         * @param {GcSpread.Sheets.ClipboardPasteOptions} option The Clipboard pasting option that indicates which content to paste.
         */
        constructor(sheet: Sheet, srcSheet: any, destSheet: any, pasteExtent: PasteExtent, option: ClipboardPasteOptions);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(sender: any): boolean;
        /**
         * Gets a value that indicates whether the command or operation can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(sender: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action on the worksheet.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(sender: any): boolean;
    }

    export class ColumnAutoFitUndoAction extends ActionBase{
        /**
         * Represents the undo actions for automatically resizing a column in a sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {Array} columns The resized columns; each item is an object.
         * @param {boolean} rowHeader Determines whether the resized columns are in the row header area.
         * @param {GcSpread.Sheets.AutoFitType} autoFitType Determines whether the auto-fit action includes the header text.
         */
        constructor(sheet: Sheet, columns: any, rowHeader: boolean, autoFitType?: AutoFitType);
        /**
         *  Defines the method that determines whether the action can be performed in its current state.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         *  Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the column automatic fit action.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class ColumnGroupExpandUndoAction extends ActionBase{
        /**
         * Represents an undo action to expand or collapse a column range group.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {object} columnExpandExtent The column expand extent information.
         */
        constructor(sheet: Sheet, columnExpandExtent: GroupExpandExtent);
        /**
         *  Defines the method that determines whether the action can be performed in its current state.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action on the specified sender.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class ColumnGroupHeaderExpandUndoAction extends ActionBase{
        /**
         * Represents a column range group action used to expand or collapse column range groups on the same level.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {object} columnGroupHeaderExpandExtent The column group header expand extent information.
         */
        constructor(sheet: Sheet, columnGroupHeaderExpandExtent: GroupHeaderExpandExtent);
        /**
         *  Defines the method that determines whether the action can be performed in its current state.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         *  Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action on the specified sender.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class ColumnGroupUndoAction extends ActionBase{
        /**
         * Represents the undo action for column range grouping on a sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {GcSpread.Sheets.UndoRedo.GroupExtent} groupExtent The column group extent information.
         */
        constructor(sheet: Sheet, groupExtent: GroupExtent);
        /**
         *  Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         *  Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class ColumnResizeUndoAction extends ActionBase{
        /**
         * Represents the undo actions for resizing a column on a sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {Array} columns The resize columns; each item is an object.
         * @param {number} size The resized column's size.
         * @param {boolean} rowHeader Whether the column being resized is in the row header area.
         */
        constructor(sheet: Sheet, columns: any, size: number, rowHeader: boolean);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean}  <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the column resizing action.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class ColumnUngroupUndoAction extends ActionBase{
        /**
         * Represents the undo action for ungrouping a column range group on a sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {GcSpread.Sheets.UndoRedo.GroupExtent} groupExtent The column ungroup extent information.
         */
        constructor(sheet: Sheet, groupExtent: GroupExtent);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action on the specified sender.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class DeleteFloatingObjectUndoAction extends FloatingObjectUndoActionBase{
        /**
         * Represents the undo action for deleting the floating objects.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.FloatingObjectUndoActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet invoking the action.
         * @param {GcSpread.Sheets.FloatingObjectExtent} deleteExtent The extent.
         */
        constructor(sheet: Sheet, deleteExtent: FloatingObjectExtent);
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(sender: any): void;
        /**
         * Undoes the command or operation.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(sender: any): boolean;
    }

    export class DragCopyFloatingObjectUndoAction extends ActionBase{
        /**
         * Represents the dragCopy undo action to move the floating objects on the sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet invoking the action.
         * @param {GcSpread.Sheets.FloatingObjectExtent} floatingObjectExtent The extent.
         * @param {GcSpread.Sheets.MovingFloatingObjectExtent} movingInfo The moving information.
         */
        constructor(sheet: Sheet, floatingObjectExtent: FloatingObjectExtent, movingInfo: MovingFloatingObjectExtent);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(sender: any): boolean;
        /**
         * Gets a value that indicates whether the command or operation can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(sender: any): void;
        /**
         * Undoes the command or operation.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(sender: any): boolean;
    }

    export class DragDropExtent{
        /**
         * Represents a drag drop action extent that supports drag and drop on the sheet.
         * @class
         * @param {number} fromRow The source row index for the drag drop.
         * @param {number} fromColumn The source column index for the drag drop.
         * @param {number} toRow The destination row index for the drag drop.
         * @param {number} toColumn The destination column index for the drag drop.
         * @param {number} rowCount The row count for the drag drop.
         * @param {number} columnCount The column count for the drag drop.
         */
        constructor(fromRow: number, fromColumn: number, toRow: number, toColumn: number, rowCount: number, columnCount: number);
        /** The column count for the drag drop.
         * @type {number}
         */
        columnCount: any;
        /** The source column index for the drag drop.
         * @type {number}
         */
        fromColumn: any;
        /** The source row index for the drag drop.
         * @type {number}
         */
        fromRow: any;
        /** The row count for the drag drop.
         * @type {number}
         */
        rowCount: any;
        /** The destination column index for the drag drop.
         * @type {number}
         */
        toColumn: any;
        /** The destination row index for the drag drop.
         * @type {number}
         */
        toRow: any;
    }

    export class DragDropUndoAction extends ActionBase{
        /**
         * Represents a drag drop undo action used to drag a range and drop it onto another range on the sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet to drag and drop.
         * @param {GcSpread.Sheets.UndoRedo.DragDropExtent} dragMoveExtent The drag drop extent information.
         * @param {boolean} copy If set to <c>true</c> copy; otherwise, <c>false</c> means to cut.
         * @param {boolean} insert If set to <c>true</c> inserts the drag data in the drop row or column.
         * @param {GcSpread.Sheets.CopyToOption} option Indicates the content type to drag and drop.
         */
        constructor(sheet: Sheet, dragMoveExtent: DragDropExtent, copy: boolean, insert: boolean, option: CopyToOption);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(arg: any): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action of the saved information.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class DragFillExtent{
        /**
         * Represents the extend information for drag fill actions.
         * @class
         * @param {GcSpread.Sheets.Range} startRange The start range.
         * @param {GcSpread.Sheets.Range} fillRange The fill range.
         * @param {GcSpread.Sheets.AutoFillType} autoFillType The auto fill type.
         * @param {GcSpread.Sheets.FillDirection} fillDirection The fill direction.
         */
        constructor(startRange: Range, fillRange: Range, autoFillType: AutoFillType, fillDirection: FillDirection);
    }

    export class DragFillUndoAction extends ActionBase{
        /**
         * Represents a drag fill undo action to drag and fill a range on the sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The drag fill sheet.
         * @param {object} dragFillExtent The drag fill extent information.
         */
        constructor(sheet: Sheet, dragFillExtent: Object);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(arg: any): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action on the worksheet.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class FloatingObjectExtent{
        /**
         * Represents the extend for floating object actions.
         * @class
         * @param {Array} names The names of floating objects.
         */
        constructor(names: string[]);
    }

    export class FloatingObjectUndoActionBase extends ActionBase{
        /**
         * Represents the undo action for the floating object.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         */
        constructor();
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(sender: any): boolean;
        /**
         * Gets a value that indicates whether the command or operation can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Saves undo information.
         */
        saveState(): void;
    }

    export class GroupExpandExtent{
        /**
         * Represents the information for a group expand.
         * @class
         * @param {number} index The index.
         * @param {number} level The group level.
         * @param {boolean} collapsed Whether the group is collapsed.
         */
        constructor(index: number, level: number, collapsed:boolean);
    }

    export class GroupExtent{
        /**
         * Represents a range group extent that supports the range group undo action.
         * @class
         * @param {number} index The group starting index.
         * @param {number} count The number of rows or columns to group or ungroup.
         */
        constructor(index: number, count: number);
        /** The number of rows or columns to group or ungroup.
         * @type {number}
         */
        count: any;
        /** The group starting index.
         * @type {number}
         */
        index: any;
    }

    export class GroupHeaderExpandExtent{
        /**
         * Represents the information for a group header expand.
         * @class
         * @param {number} level The group level.
         */
        constructor(level: number);
    }

    export class MovingFloatingObjectExtent{
        /**
         * Represents the extend for floating object actions.
         * @class
         * @param {number} offsetX The horizontal offset.
         * @param {number} offsetY The vertical offset.
         */
        constructor(offsetX: number, offsetY: number);
    }

    export class MovingFloatingObjectUndoAction extends FloatingObjectUndoActionBase{
        /**
         * Represents the undo action for moving the floating objects.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.FloatingObjectUndoActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet invoking the action.
         * @param {GcSpread.Sheets.FloatingObjectExtent} floatingObjectExtent The extent.
         * @param {GcSpread.Sheets.MovingFloatingObjectExtent} movingSettings The moving settings.
         */
        constructor(sheet: Sheet, floatingObjectExtent: FloatingObjectExtent, movingSettings: MovingFloatingObjectExtent);
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(sender: any): void;
        /**
         * Undoes the command or operation.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(sender: any): boolean;
    }

    export class PasteExtent{
        /**
         * Represents the information for a paste expand.
         * @class
         * @param {GcSpread.Sheets.Range} fromRange The source range.
         * @param {Array} pastedRanges The target ranges.
         * @param {boolean} isCutting Whether the operation is cutting or copying.
         * @param {string} clipboardText The text on the clipboard.
         */
        constructor(fromRange: Range, pastedRanges: Range[], isCutting: boolean, clipboardText: string);
    }

    export class PasteRangeExtent{
        /**
         * Represents the information for a paste range expand.
         * @class
         * @param {GcSpread.Sheets.Range} sourceRange The source range.
         * @param {GcSpread.Sheets.Range} targetRange The target range.
         * @param {boolean} isCutting Whether the operation is cutting or copying.
         * @param {string} clipboardText The text on the clipboard.
         */
        constructor(sourceRange: Range, targetRange: Range, isCutting:boolean, clipboardText:string);
    }

    export class ResizingFloatingObjectUndoAction extends FloatingObjectUndoActionBase{
        /**
         * Represents the undo action for resizing the floating objects.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.FloatingObjectUndoActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet invoking the action.
         * @param {GcSpread.Sheets.FloatingObjectExtent} floatingObjectExtent The extent.
         * @param {GcSpread.Sheets.ReszingFloatingObjectExtent} resizingSettings The resizing settings.
         */
        constructor(sheet: Sheet, floatingObjectExtent: FloatingObjectExtent, resizingSettings: ReszingFloatingObjectExtent);
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(sender: any): void;
        /**
         * Undoes the command or operation.
         * @param {object} sender Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(sender: any): boolean;
    }

    export class ReszingFloatingObjectExtent{
        /**
         * Represents the information for a resize floating object.
         * @class
         * @param {number} offsetX The left offset.
         * @param {number} offsetY The top offset.
         * @param {number} offsetWidth The width offset.
         * @param {number} offsetHeight The height offset.
         */
        constructor(offsetX: number, offsetY: number, offsetWidth: number, offsetHeight: number);
    }

    export class RowAutoFitUndoAction extends ActionBase{
        /**
         * Represents the undo actions for automatically resizing a row in a sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {Array} rows The automatically resized rows; each item is an object.
         * @param {boolean} rowHeader Determines whether the resized columns are in the column header area.
         * @param {GcSpread.Sheets.AutoFitType} autoFitType Determines whether the auto-fit action includes the header text.
         */
        constructor(sheet: Sheet, rows: any, columnHeader: boolean, autoFitType?: AutoFitType);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         *  Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the row automatic fit action.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class RowGroupExpandUndoAction extends ActionBase{
        /**
         * Represents an undo action to expand or collapse a row range group.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {object} rowExpandExtent The row expand extent information.
         */
        constructor(sheet: Sheet, rowExpandExtent: GroupExpandExtent);
        /**
         *  Defines the method that determines whether the action can be performed in its current state.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action on the specified sender.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class RowGroupHeaderExpandUndoAction extends ActionBase{
        /**
         * Represents a row range group action used to expand or collapse row range groups on the same level.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {object} rowGroupHeaderExpandExtent The row group header expand extent information.
         */
        constructor(sheet: Sheet, rowGroupHeaderExpandExtent: GroupHeaderExpandExtent);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the specified sender.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class RowGroupUndoAction extends ActionBase{
        /**
         * Represents the undo action for grouping a row range group on a sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {GcSpread.Sheets.UndoRedo.GroupExtent} groupExtent The row group extent information.
         */
        constructor(sheet: Sheet, groupExtent: GroupExtent);
        /**
         *  Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action on the specified sender.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class RowResizeUndoAction extends ActionBase{
        /**
         * Represents the undo actions for resizing a row on a sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {Array} rows The resize rows; each item is an object.
         * @param {number} size The size of the row that is being resized.
         * @param {boolean} columnHeader Whether the row being resized is in the column header area.
         */
        constructor(sheet: any, rows: any, size: any, columnHeader: any);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         *  Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the row resizing action.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class RowUngroupUndoAction extends ActionBase{
        /**
         * Represents the undo action for ungrouping row range groups on a sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet.
         * @param {GcSpread.Sheets.UndoRedo.GroupExtent} groupExtent The row ungroup extent information.
         */
        constructor(sheet: Sheet, groupExtent: GroupExtent);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the action on the specified sender.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class SheetRenameUndoAction extends ActionBase{
        /**
         * Represents a rename sheet undo action on the sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The renamed sheet.
         * @param {string} newName The sheet's new name.
         */
        constructor(sheet: Sheet, newName: string);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the command or operation.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }

    export class ZoomUndoAction extends ActionBase{
        /**
         * Represents a zoom undo action on the sheet.
         * @class
         * @extends GcSpread.Sheets.UndoRedo.ActionBase
         * @param {GcSpread.Sheets.Sheet} sheet The sheet to zoom.
         * @param {number} newZoomFactor The new zoom factor on the sheet.
         */
        constructor(sheet: Sheet, newZoomFactor: number);
        /**
         * Defines the method that determines whether the action can be performed in its current state.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if this action can be performed; otherwise, <c>false</c>.
         *
         */
        canExecute(arg: any): boolean;
        /**
         * Gets a value that indicates whether the action can be undone.
         * @returns {boolean} <c>true</c> if this action can be undone; otherwise, <c>false</c>.
         */
        canUndo(): boolean;
        /**
         * Defines the method to be called when the action is invoked.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         */
        execute(arg: any): void;
        /**
         * Saves undo information.
         */
        saveState(): void;
        /**
         * Undoes the zoom action on the worksheet.
         * @param {object} arg Data used by the action. If the action does not require data to be passed, this object can be set to null.
         * @returns {boolean} <c>true</c> if an undo operation on the command or operation succeeds; otherwise, <c>false</c>.
         */
        undo(arg: any): boolean;
    }
}
declare var SpreadModule: typeof GcSpread.Sheets;
declare module wijmo {
   var spread: typeof SpreadModule;
}
interface JQueryStatic {
    wijmo:{
        wijspread : typeof SpreadModule;
    }
}
interface JQuery {
    wijspread(command: 'spread'): GcSpread.Sheets.Spread;
    wijspread(command: 'repaint'): void;
    wijspread(command: 'refresh'): void;
    wijspread(command: 'destroy'): void;
    wijspread(command: string, ...p: any[]): any;
    wijspread(param?: GcSpread.Sheets.GcSpreadSheetsOptions): JQuery;
}
