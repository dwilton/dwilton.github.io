/// <reference path="~/Content/Scripts/Shared/Reference.js" />

/// <summary>
/// A datepicker control that displays a calendar to let a user select a date. Allows selection of a range of dates with two textboxes.
/// </summary>
/// <example>
/// Example of a single textbox:
///     HTML:
///          <input id="SingleDate" />
///     Javascript:
///         $("#SingleDate").datePicker();
///
/// Example of multiple textboxes:
///     HTML:
///         <input id="FromDate" data-to="ToDate" data-month-count="3" data-min-date="2/12/2011" data-max-date="27/2/2012" />
///         <input id="ToDate" />
///     Javascript:
///         $("#FromDate").datePicker();
/// </example>

(function ($) {
    $.fn.datePicker = function (options) {
        /// <summary>
        /// Creates a datepicker control for an input element.
        /// </summary>
        /// <param name="options" type="object">
        /// Contains options for the datepicker.
        /// &#10;"to" (jQuery) - the jQuery element for the 'to' textbox.
        /// &#10;"monthCount" (int) - the number of months to display in the calendar.
        /// &#10;"minDate" (Date) - the minimum date allowed in the datepicker.
        /// &#10;"maxDate" (Date) - the maximum date allowed in the datepicker.
        /// </param>

        var datePicker = {
            elements: {
                fromDateTextBox: $(this),
                toDateTextBox: $(),
                calendar: undefined,
                activeTextBox: undefined
            },

            /// <summary>
            /// The number of months to display in the calendar.
            /// </summary>
            monthCount: 1,

            /// <summary>
            /// The minimum date allowed in the datepicker.
            /// </summary>
            minDate: new Date(1900, 0, 1),

            /// <summary>
            /// The minimum date allowed in the datepicker.
            /// </summary>
            maxDate: new Date(2099, 11, 31),

            /// <summary>
            /// The element that is being dragged.
            /// </summary>
            draggedElement: undefined,

            /// <summary>
            /// The month names to display in the calendar.
            /// </summary>
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

            /// <summary>
            /// A value indicating whether to prevent showing the calendar before it is about to be focused.
            /// </summary>
            preventShowCalendar: false,

            init: function () {
                /// <summary>
                /// Initializes the datepicker.
                /// </summary>

                this.initOptions();

                this.buildCalendar();

                this.initEvents();

                this.setDate(this.getDate(this.elements.fromDateTextBox), this.elements.fromDateTextBox);
                this.setDate(this.getDate(this.elements.toDateTextBox), this.elements.toDateTextBox);
            },

            initOptions: function () {
                /// <summary>
                /// Initializes any options for the datepicker.
                /// </summary>

                if (!options) {
                    options = {};
                }

                // Load in any attributes from the HTML.
                if (this.elements.fromDateTextBox.attr("data-to") && !options.to) {
                    options.to = $("#" + this.elements.fromDateTextBox.attr("data-to"));
                }

                if (this.elements.fromDateTextBox.attr("data-month-count") && !options.monthCount) {
                    options.monthCount = this.elements.fromDateTextBox.attr("data-month-count");
                }

                if (this.elements.fromDateTextBox.attr("data-min-date") && !options.minDate) {
                    this.minDate = this.parseDate(this.elements.fromDateTextBox.attr("data-min-date"));
                }

                if (this.elements.fromDateTextBox.attr("data-max-date") && !options.maxDate) {
                    this.maxDate = this.parseDate(this.elements.fromDateTextBox.attr("data-max-date"));
                }

                // Load in the options.
                if (options.to) {
                    this.elements.toDateTextBox = options.to;
                }

                if (options.monthCount) {
                    this.monthCount = options.monthCount;
                }
            },

            initEvents: function () {
                /// <summary>
                /// Initializes any events for the datepicker.
                /// </summary>

                // Show the calendar when focus is given to a textbox.
                this.elements.fromDateTextBox.add(this.elements.toDateTextBox).focus(function () {
                    datePicker.elements.activeTextBox = $(this);

                    if (datePicker.preventShowCalendar) {
                        datePicker.preventShowCalendar = false;
                    }
                    else {
                        datePicker.showCalendar($(this));
                    }
                });

                // Handle the previous and next button clicks.
                this.elements.calendar.children(".Previous").click(function (event) {
                    var monthDate = datePicker.getFirstCalendarMonthDate();

                    monthDate.setMonth(monthDate.getMonth() - 1);

                    datePicker.buildCalendarMonths(monthDate);

                    datePicker.showSelectedDates();

                    datePicker.preventShowCalendar = true;
                    datePicker.elements.activeTextBox.focus();

                    event.stopPropagation();
                });

                this.elements.calendar.children(".Next").click(function (event) {
                    var monthDate = datePicker.getFirstCalendarMonthDate();

                    monthDate.setMonth(monthDate.getMonth() + 1);

                    datePicker.buildCalendarMonths(monthDate);

                    datePicker.showSelectedDates();

                    datePicker.preventShowCalendar = true;
                    datePicker.elements.activeTextBox.focus();

                    event.stopPropagation();
                });

                // Handle keypresses in the textboxes.
                this.elements.fromDateTextBox.add(this.elements.toDateTextBox).keydown(function (event) {
                    switch (event.keyCode) {
                        case 9:
                            // Hide on tab.
                            datePicker.hideCalendar();

                            break;

                        case 27:
                            // Hide on ESC.
                            datePicker.hideCalendar();
                            break;
                    }
                });

                // Handle a blur of the textboxes to make sure the date is formatted correctly.
                this.elements.fromDateTextBox.add(this.elements.toDateTextBox).blur(function () {
                    var date = datePicker.getDate($(this));

                    if ($(this)[0] === datePicker.elements.fromDateTextBox[0]) {
                        var toDate = datePicker.getDate(datePicker.elements.toDateTextBox);

                        if (date > toDate || toDate === undefined) {
                            datePicker.setDate(date, datePicker.elements.toDateTextBox);
                        }
                    }
                    else {
                        var fromDate = datePicker.getDate(datePicker.elements.fromDateTextBox);

                        if (date < fromDate || fromDate === undefined) {
                            datePicker.setDate(date, datePicker.elements.fromDateTextBox);
                        }
                    }

                    datePicker.setDate(date, $(this));
                });

                // Hide the calendar if a click occurs outside any date picker item, otherwise set focus to the textbox.
                $(document).mousedown(function (event) {
                    if (event.target !== datePicker.elements.fromDateTextBox[0] && event.target !== datePicker.elements.toDateTextBox[0] && !$(event.target).closest(".Calendar").length) {
                        // The click occurred outside the datepicker. Hide the calendar.
                        datePicker.hideCalendar();
                    }
                });

                // Handle the mouse click events when selecting a date in the calendar.
                this.elements.calendar.on("mousedown", "td:not(.OutsideMonth,.OutsideRange)", function (event) {
                    datePicker.draggedElement = $(this);

                    if (datePicker.elements.toDateTextBox.length) {
                        // There is a to date textbox.
                        if ($(this).hasClass("Selected")) {
                        }
                        else {
                            datePicker.elements.calendar.find("td.Selected").removeClass("Selected");
                            $(this).addClass("Selected");

                            var date = $(this)[0].date;
                            datePicker.setDate(date, datePicker.elements.fromDateTextBox);
                            datePicker.setDate(date, datePicker.elements.toDateTextBox);
                        }
                    }
                    else {
                        // There is only a single textbox.
                        datePicker.elements.calendar.find("td.Selected").removeClass("Selected");
                        $(this).addClass("Selected");
                        datePicker.setDate($(this)[0].date);
                    }

                    event.stopPropagation();
                });

                this.elements.calendar.on("mouseup", "td:not(.OutsideMonth,.OutsideRange)", function (event) {
                    if (datePicker.elements.toDateTextBox.length) {
                        // There is a to date textbox.
                        var firstDate = datePicker.draggedElement[0].date;
                        var secondDate = $(this)[0].date;

                        var fromDate = firstDate;
                        var toDate = secondDate;

                        if (secondDate < firstDate) {
                            fromDate = secondDate;
                            toDate = firstDate;
                        }

                        datePicker.setDate(fromDate, datePicker.elements.fromDateTextBox);
                        datePicker.setDate(toDate, datePicker.elements.toDateTextBox);

                        datePicker.hideCalendar();
                    }
                    else {
                        // There is only a single textbox.
                        var date = $(this)[0].date;

                        datePicker.setDate(date);

                        datePicker.hideCalendar();
                    }

                    datePicker.draggedElement = undefined;
                    event.stopPropagation();
                });

                $(document).mouseup(function (event) {
                    if (event.target !== datePicker.elements.fromDateTextBox[0] && event.target !== datePicker.elements.toDateTextBox[0] && !$(event.target).closest(".Calendar").length) {
                        // The mouseup is outside the datepicker.
                        if (datePicker.draggedElement) {
                            var date = datePicker.elements.activeTextBox[0].date;

                            datePicker.selectDates(date);
                        }
                    }

                    if (datePicker.draggedElement) {
                        datePicker.draggedElement = undefined;
                        datePicker.hideCalendar();
                    }
                });

                this.elements.calendar.on("mousemove", "td:not(.OutsideMonth,.OutsideRange)", function (event) {
                    datePicker.elements.calendar.find("td.Hover").removeClass("Hover");
                    $(this).addClass("Hover");

                    if (datePicker.draggedElement) {
                        if (datePicker.elements.toDateTextBox.length) {
                            // There is a to date textbox.
                            var firstDate = datePicker.draggedElement[0].date;
                            var secondDate = $(this)[0].date;

                            var fromDate = firstDate;
                            var toDate = secondDate;

                            if (secondDate < firstDate) {
                                fromDate = secondDate;
                                toDate = firstDate;
                            }

                            datePicker.selectDates(fromDate, toDate);
                            datePicker.setDate(fromDate, datePicker.elements.fromDateTextBox);
                            datePicker.setDate(toDate, datePicker.elements.toDateTextBox);
                        }
                        else {
                            // There is only a single textbox.
                            datePicker.elements.calendar.find("td.Selected").removeClass("Selected");
                            $(this).addClass("Selected");
                            datePicker.showDate($(this)[0].date);
                        }
                    }

                    event.stopPropagation();
                });

                $(document).mousemove(function () {
                    datePicker.elements.calendar.find("td.Hover").removeClass("Hover");

                    if (datePicker.draggedElement) {
                        if (datePicker.elements.toDateTextBox.length) {
                            // There is a to date textbox.

                        }
                        else {
                            // There is only a single textbox.
                            datePicker.selectDates(datePicker.elements.activeTextBox[0].date);
                            datePicker.showDate(datePicker.elements.activeTextBox[0].date);
                        }
                    }
                });
            },

            showCalendar: function () {
                /// <summary>
                /// Shows the calendar.
                /// </summary>

                var date = this.getDate(this.elements.fromDateTextBox);

                if (!date) {
                    date = new Date();
                }

                this.buildCalendarMonths(date);

                this.showSelectedDates();

                this.elements.calendar.addClass("Show");
            },

            hideCalendar: function () {
                /// <summary>
                /// Hides the calendar.
                /// </summary>

                this.elements.calendar.removeClass("Show");
            },

            showSelectedDates: function () {
                /// <summary>
                /// Shows the selected dates in the calendar.
                /// </summary>

                var firstDate = this.getDate(this.elements.fromDateTextBox);
                var secondDate = this.getDate(this.elements.toDateTextBox);

                this.selectDates(firstDate, secondDate);
            },

            selectDates: function (firstDate, secondDate) {
                /// <summary>
                /// Selects dates and any dates between them.
                /// </summary>
                /// <param name="firstDate" type="Date">The first date.</param>
                /// <param name="secondDate" type="Date">The second date.</param>

                this.elements.calendar.find("td.Selected").removeClass("Selected");

                // Get the from date and the to date in order.
                var fromDate = firstDate;
                var toDate = secondDate;

                if (secondDate < firstDate) {
                    fromDate = secondDate;
                    toDate = firstDate;
                }

                if (fromDate !== undefined) {
                    this.elements.calendar.find("td:not(.OutsideMonth,.OutsideRange)").each(function () {
                        var date = $(this)[0].date;

                        if (toDate === undefined) {
                            if (datePicker.datesAreEqual(date, fromDate)) {
                                $(this).addClass("Selected");

                                return false;
                            }
                        }
                        else if (date >= fromDate && date <= toDate) {
                            $(this).addClass("Selected");
                        }
                    });
                }
            },

            getDate: function (textBox) {
                /// <summary>
                /// Gets the date from a textbox.
                /// </summary>
                /// <returns type="Date">The date in the textbox, or undefined if no Date is in the textbox.</returns>

                if (!textBox.length) {
                    return undefined;
                }

                var date = this.parseDate(textBox.val());

                if (date < this.minDate || date > this.maxDate) {
                    date = undefined;
                }

                return date;
            },

            setDate: function (date, textBox) {
                /// <summary>
                /// Sets a Date in a textBox.
                /// </summary>
                /// <param name="date" type="Date">The Date to set.</param>
                /// <param name="textBox" type="jQuery">The textbox to set the Date for.</param>

                if (!textBox) {
                    textBox = this.elements.activeTextBox;
                }

                if (textBox[0]) {
                    textBox[0].date = date;
                }

                this.showDate(date, textBox);
            },

            showDate: function (date, textBox) {
                /// <summary>
                /// Shows a Date in a textBox.
                /// </summary>
                /// <param name="date" type="Date">The Date to show.</param>
                /// <param name="textBox" type="jQuery">The textbox to show the Date for.</param>

                if (!textBox) {
                    textBox = this.elements.activeTextBox;
                }

                var text = "";

                if (date !== undefined) {
                    text = this.zeroPad(date.getDate(), 2) + "/" + this.zeroPad(date.getMonth() + 1, 2) + "/" + date.getFullYear();
                }

                textBox.val(text);
            },

            getFirstCalendarMonthDate: function () {
                /// <summary>
                /// Gets the date of the first calendar month displayed.
                /// </summary>
                /// <returns type="Date">The date of the first calendar month displayed.</returns>

                var calendarMonth = this.elements.calendar.children(".CalendarMonth:first");
                var year = parseInt(calendarMonth.attr("data-year"), 10);
                var month = parseInt(calendarMonth.attr("data-month"), 10) - 1;

                return new Date(year, month, 1);
            },

            buildCalendar: function () {
                /// <summary>
                /// Builds the calendar used in the datepicker.
                /// </summary>

                this.elements.calendar = $("<div class=\"Calendar\"><button class=\"Previous\" type=\"button\" tabindex=\"-1\"><</button><button class=\"Next\" type=\"button\" tabindex=\"-1\">></button></div>");
                this.elements.fromDateTextBox.after(this.elements.calendar);
            },

            buildCalendarMonths: function (monthDate) {
                /// <summary>
                /// Builds the calendar months shown in the calendar.
                /// </summary>
                /// <param name="monthDate" type="Date">The starting month of the calendar.</param>

                this.elements.calendar.children(".CalendarMonth").remove();

                monthDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);

                for (var i = 0; i < this.monthCount; i++) {
                    this.elements.calendar.append(this.buildCalendarMonth(monthDate));

                    monthDate.setMonth(monthDate.getMonth() + 1);
                }
            },

            buildCalendarMonth: function (monthDate) {
                /// <summary>
                /// Builds a calendar month.
                /// </summary>
                /// <param name="monthDate" type="Date">The starting month of the calendar.</param>

                var calendarMonth = $("<div class=\"CalendarMonth\" data-month=\"" + (monthDate.getMonth() + 1) + "\" data-year=\"" + monthDate.getFullYear() + "\" />");

                // Create the calendar header.
                var monthName = this.monthNames[monthDate.getMonth()];
                calendarMonth.append($("<header>" + monthName + " " + monthDate.getFullYear() + "</header><hr />"));

                // Create the calendar content.
                calendarMonth.append($("<table class=\"Days\"><thead><tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr></thead><tbody></tbody></table>"));
                calendarMonth.find("tbody").append(this.buildCalendarRows(monthDate));

                return calendarMonth;
            },

            buildCalendarRows: function (monthDate) {
                /// <summary>
                /// Builds the calendar rows for a calendar month.
                /// </summary>
                /// <param name="monthDate" type="Date">The starting month of the calendar.</param>
                /// <returns type="jQuery">The calendar rows.</returns>

                var startingDay = monthDate.getDay();
                var dayCount = this.getDaysInMonth(monthDate);

                var rows = $();
                var date = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);

                for (var i = 0; i <= 5; i++) {
                    var tr = $("<tr />");

                    for (var j = 0; j <= 6; j++) {
                        var td = $("<td />");

                        if (date.getMonth() === monthDate.getMonth() && date.getDate() <= dayCount && (i > 0 || j >= startingDay)) {
                            // The td element is inside the current calendar month.
                            if (this.datesAreEqual(date, new Date())) {
                                td.addClass("Today");
                            }

                            if (date < this.minDate || date > this.maxDate) {
                                td.addClass("OutsideRange");
                            }

                            td.html($("<a>" + date.getDate() + "</a>"));
                            td[0].date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                            date.setDate(date.getDate() + 1);
                        }
                        else {
                            // The td element is not inside the current calendar month.
                            td.addClass("OutsideMonth");
                        }

                        tr.append(td);
                    }

                    rows = rows.add(tr);

                    if (date.getMonth() !== monthDate.getMonth()) {
                        break;
                    }
                }

                return rows;
            },

            getDaysInMonth: function (monthDate) {
                /// <summary>
                /// Gets the number of days in a month.
                /// </summary>
                /// <param name="monthDate" type="Date">The month to get the number of days from.</param>
                /// <returns type="int">The number of days in the month.</returns>

                return new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
            },

            datesAreEqual: function (firstDate, secondDate) {
                /// <summary>
                /// Gets a value indicating whether two dates are equal.
                /// </summary>
                /// <param name="firstDate" type="Date">The first date to compare.</param>
                /// <param name="secondDate" type="Date">The second date to compare.</param>
                /// <returns type="bool">A value indicating whether two dates are equal.</returns>

                return firstDate.getFullYear() === secondDate.getFullYear() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getDate() === secondDate.getDate();
            },

            zeroPad: function (number, width) {
                /// <summary>
                /// Pads a number out with zeros (e.g. 1 -> 0001)
                /// </summary>
                /// <param name="number" type="int">The number to zero pad.</param>
                /// <param name="width" type="int">The number of zeros to pad.</param>

                width -= number.toString().length;

                if (width > 0) {
                    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
                }

                return number;
            },

            parseDate: function (dateString) {
                /// <summary>
                /// Parses a string for a Date.
                /// </summary>
                /// <param name="dateString">The string to parse.</param>
                /// <returns type="Date">The parsed Date, or undefined if the string could not be parsed.</returns>

                // Split the string by '.' and '/' characters.
                var splitText = dateString.split(/[\/.]+/);

                var day = "";
                var month = new Date().getMonth();
                var year = new Date().getFullYear();

                if (dateString === ".") {
                    day = new Date().getDate();
                    month = new Date().getMonth();
                    year = new Date().getFullYear();
                }
                else if (splitText.length === 1) {
                    day = parseInt(splitText[0], 10);
                    month = new Date().getMonth();
                    year = new Date().getFullYear();
                }
                else if (splitText.length === 2) {
                    day = parseInt(splitText[0], 10);
                    month = parseInt(splitText[1], 10) - 1;
                    year = new Date().getFullYear();
                }
                else if (splitText.length === 3) {
                    day = parseInt(splitText[0], 10);
                    month = parseInt(splitText[1], 10) - 1;
                    year = parseInt(splitText[2], 10);

                    if (year < 1000) {
                        year += 2000;
                    }
                }

                var date = undefined;

                if (!(isNaN(day) || isNaN(month) || isNaN(year))) {
                    date = new Date(year, month, day);

                    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
                        date = undefined;
                    }
                }

                return date;
            }
        };

        datePicker.init();
        $(this)[0].datePicker = datePicker;

        return $(this);
    };
})(jQuery);