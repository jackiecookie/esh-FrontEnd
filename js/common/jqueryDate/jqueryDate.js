/*
jquery日期
*/
define(['jquery'], function (require, exports, module) {
    var datepicker = module.exports = function (date, events, options, elm) {
        var $this = $(elm),
                _pad = function (n, c) {
                    if ((n = n + '').length < c) {
                        return new Array((++c) - n.length).join('0') + n;
                    } else {
                        return n;
                    }
                },
                parseDate = function (date, format) {
                    if (date.constructor == Date) {
                        return new Date(date);
                    }
                    var parts = date.split(/\W+/);
                    var against = format.split(/\W+/), d, m, y, h, min, now = new Date();
                    for (var i = 0; i < parts.length; i++) {
                        switch (against[i]) {
                            case 'd':
                            case 'e':
                                d = parseInt(parts[i], 10);
                                break;
                            case 'm':
                                m = parseInt(parts[i], 10) - 1;
                                break;
                            case 'Y':
                            case 'y':
                                y = parseInt(parts[i], 10);
                                y += y > 100 ? 0 : (y < 29 ? 2000 : 1900);
                                break;
                            case 'H':
                            case 'I':
                            case 'k':
                            case 'l':
                                h = parseInt(parts[i], 10);
                                break;
                            case 'P':
                            case 'p':
                                if (/pm/i.test(parts[i]) && h < 12) {
                                    h += 12;
                                } else if (/am/i.test(parts[i]) && h >= 12) {
                                    h -= 12;
                                }
                                break;
                            case 'M':
                                min = parseInt(parts[i], 10);
                                break;
                        }
                    }
                    return new Date(
                        y === undefined ? now.getFullYear() : y,
                        m === undefined ? now.getMonth() : m,
                        d === undefined ? now.getDate() : d,
                        h === undefined ? now.getHours() : h,
                        min === undefined ? now.getMinutes() : min,
                        0
                    );
                },
                formatDate = function (date, format) {
                    var m = date.getMonth();
                    var d = date.getDate();
                    var y = date.getFullYear();
                    //var wn = date.getWeekNumber();
                    var w = date.getDay();
                    var s = {};
                    var hr = date.getHours();
                    var pm = (hr >= 12);
                    var ir = (pm) ? (hr - 12) : hr;
                    //var dy = date.getDayOfYear();
                    if (ir == 0) {
                        ir = 12;
                    }
                    var min = date.getMinutes();
                    var sec = date.getSeconds();
                    var parts = format.split(''), part;
                    for (var i = 0; i < parts.length; i++) {
                        part = parts[i];
                        switch (parts[i]) {
                            case 'a':
                                part = date.getDayName();
                                break;
                            case 'A':
                                part = date.getDayName(true);
                                break;
                            case 'b':
                                part = date.getMonthName();
                                break;
                            case 'B':
                                part = date.getMonthName(true);
                                break;
                            case 'C':
                                part = 1 + Math.floor(y / 100);
                                break;
                            case 'd':
                                part = (d < 10) ? ("0" + d) : d;
                                break;
                            case 'e':
                                part = d;
                                break;
                            case 'H':
                                part = (hr < 10) ? ("0" + hr) : hr;
                                break;
                            case 'I':
                                part = (ir < 10) ? ("0" + ir) : ir;
                                break;
                            case 'j':
                                part = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy;
                                break;
                            case 'k':
                                part = hr;
                                break;
                            case 'l':
                                part = ir;
                                break;
                            case 'm':
                                part = (m < 9) ? ("0" + (1 + m)) : (1 + m);
                                break;
                            case 'M':
                                part = (min < 10) ? ("0" + min) : min;
                                break;
                            case 'p':
                            case 'P':
                                part = pm ? "PM" : "AM";
                                break;
                            case 's':
                                part = Math.floor(date.getTime() / 1000);
                                break;
                            case 'S':
                                part = (sec < 10) ? ("0" + sec) : sec;
                                break;
                            case 'u':
                                part = w + 1;
                                break;
                            case 'w':
                                part = w;
                                break;
                            case 'y':
                                part = ('' + y).substr(2, 2);
                                break;
                            case 'Y':
                                part = y;
                                break;
                        }
                        parts[i] = part;
                    }
                    return parts.join('');
                },
                formatY_m_d = function (date) {
                    return formatDate(date, 'Y-m-d')
                },
                formatZhY_m_d = function (date) {
                    return formatDate(date, 'Y年m月d日')
                },
                parseY_m_d = function (date) {
                    return parseDate(date, 'Y-m-d');
                },
                date = date,
                options = options,
                events = events,
                $elms = function () { },
                datepicker = $.extend({
                    temp: {},
                    status: {},
                    selected: [],
                    text: '',
                    isEmpty: '',
                    today: new Date(),
                    __construct: function () {

                        var that = this;
                        options = jQuery.extend({
                            calendars: 3,
                            selection: 0
                        }, options);

                        that.temp.date = [];
                        that.temp.slct = [];

                        that.selected = [];
                        this.isEmpty = false;

                        var _date = [];

                        if (!date) {
                            date = '';
                        }

                        if (date && $.type(date) == 'array') {
                            _date = date;
                        }
                        else {
                            _date.push(date);
                        }

                        if (_date[0].constructor == Date) {
                            _date[0] = formatY_m_d(_date[0]);

                        }
                        else if (!/^[\d]{4}([\-][\d]{2}){2}$/.test(_date[0])) {
                            _date[0] = '';
                            this.isEmpty = true;
                        }

                        if (!this.isEmpty) {
                            that.selected[0] = that.temp.date[0] = parseY_m_d(_date[0]);
                        }

                        if (_date[1]) {

                            if (_date[1].constructor == Date) {
                                _date[1] = formatY_m_d(_date[1]);
                            }
                            else if (!/^[\d]{4}([\-][\d]{2}){2}$/.test(_date[1])) {
                                _date[1] = '';
                                this.isEmpty = true;
                            }

                            if (!this.isEmpty) {
                                that.selected[1] = that.temp.date[1] = parseY_m_d(_date[1]);
                            }
                        }

                        if (_date[0] && _date[1] && _date[0] != _date[1]) {
                            that.text = formatZhY_m_d(that.selected[0]) + ' - ' + formatZhY_m_d(that.selected[1]);

                        }
                        else if (this.isEmpty) {
                            that.text = '选择时间范围';
                        }
                        else {
                            that.text = formatZhY_m_d(that.selected[0]);
                        }

                        that.begin = new Date(that.today.getFullYear(), that.today.getMonth() - options.calendars + 1, 1);

                        if (!this.isEmpty) {
                            that.begin = new Date(that.selected[0].getFullYear(), that.selected[0].getMonth() - 1, 1);
                            if (that.selected.length > 1) {
                                that.begin = new Date(that.selected[0].getFullYear(), that.selected[0].getMonth(), 1);
                            }
                        }

                    },
                    datepicker: function () {
                        var that = this;

                        $elms = $.extend({
                            Datepicker: $('<div class="date-btn"></div>'),
                            DatepickerTextIcon: $('<div class="date-txt date-ico"></div>')
                        }, $elms);
                        $elms.Datepicker.empty();
                        $elms.Datepicker.append($elms.DatepickerTextIcon.text(that.text));

                    },
                    datepickerEvents: function () {
                        var that = this;

                        $elms.Datepicker.click(function (event) { that.datepickerHandlers.click(event); });
                        $elms.Datepicker.hover(function () {
                            if (!that.status.opening) {
                                $elms.Datepicker.addClass('date-hover-btn');
                            }
                        }, function () {
                            $elms.Datepicker.removeClass('date-hover-btn');
                        });

                        $elms.Datepicker.attr('class', 'date-btn');

                    },
                    datepickerHandlers: {
                        setWidth: function () {
                            $this.css({ width: $this.children('.date-btn').outerWidth(), height: $elms.Datepicker.outerHeight() });
                        },
                        off: function () {
                            datepicker.init();
                            datepicker.status.opening = false;
                        },
                        ok: function () {
                            if (datepicker.temp.slct.length > 0) {
                                date = datepicker.temp.slct;
                            }

                            if (events && events.constructor == Function) {
                                events(date);
                            }
                            datepicker.init();
                        },
                        reset: function () {
                            date = '';
                            if (events && events.constructor == Function) {
                                events(date);
                            }
                            datepicker.init();
                        },
                        text: function (val) {
                            $elms.DatepickerTextIcon.empty();
                            $elms.DatepickerTextIcon.text(val);

                        },
                        click: function (event) {
                            if (!datepicker.status.opening) {
                                $elms.Datepicker.addClass('date-press-btn');
                                $elms.Datepicker.removeClass('date-hover-btn');

                                $elms.Calendars.show();

                                datepicker.calendarsHandlers.setWidth();

                                datepicker.status.opening = true;
                            }
                            else {
                                datepicker.datepickerHandlers.off();
                            }
                            $elms.Calendars.css({ position: 'absolute', 'margin-top': $elms.Datepicker.outerHeight() - 1, 'z-index': 100 });
                            $('body').one('click', datepicker.datepickerHandlers.off);
                            event.stopPropagation();
                        }
                    },
                    calendars: function () {
                        var that = this;

                        $elms = $.extend({
                            Calendars: $('<div class="calendars"></div>'),
                            CalendarsFooter: $('<div class="calendars-footer"></div>'),
                            Calendar: [],
                            Prev: [],
                            Next: [],
                            Days: {},
                            OkButton: $('<button type="button" class="submit-btn">应用</button>'),
                            ClearButton: $('<a href="javascript:void(0)" class="clear-btn">清空</a>'),
                            CancelButton: $('<a href="javascript:void(0)" class="cancel-btn">取消</a>')
                        }, $elms);

                        $elms.Calendars.empty();

                        for (c = 0; c < options.calendars; c++) {
                            that.calendar(new Date(that.begin.getFullYear(), that.begin.getMonth() + c, 1), c, options.calendars);
                        }

                        $elms.CalendarsFooter.append($elms.OkButton).append($elms.ClearButton).append($elms.CancelButton);
                        $elms.Calendars.append($elms.CalendarsFooter);

                        that.calendarsHandlers.selected(datepicker.temp.date);

                        that.calendarsEvens();
                    },
                    calendar: function (date, current, calendars) {
                        var that = this,
                            blocked = function (date) {
                                var blocked = [];

                                var offset = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
                                var last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                                var moreset = Math.ceil((offset + last) / 7) * 7 - (offset + last);
                                for (o = 0; o < offset; o++) {
                                    blocked.push('');
                                }

                                for (d = 0; d < last; d++) {
                                    blocked.push(d + 1);
                                }

                                for (m = 0; m < moreset; m++) {
                                    blocked.push('');
                                }

                                return blocked;
                            },
                            $calendarTable = $('<table class="calendar-box"></table>'),
                            $calendarThead = $('<thead></thead>'),
                            $calendarTbody = $('<tbody></tbody>'),
                            $calendarCurrent = $('<th colspan="5"></th>'),
                            $calendarMenu = $('<tr class="calendar-menu"></tr>'),
                            $calendarWeeks = $('<tr class="calendar-weeks"></tr>');

                        $elms.Calendar[current] = $('<div class="calendar"></div>');

                        $elms.Calendars.append($elms.Calendar[current]);

                        $elms.Calendar[current].append($calendarTable);

                        $calendarTable.append($calendarThead);
                        $calendarTable.append($calendarTbody);

                        $calendarThead.append($calendarMenu);
                        $calendarThead.append($calendarWeeks.html('<th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th>'));

                        $elms.Prev[current] = $('<th class="calendar-change calendar-prev">◀</th>');
                        $elms.Next[current] = $('<th class="calendar-change calendar-next">▶</th>');
                        $calendarMenu.append($elms.Prev[current]);
                        $calendarMenu.append($calendarCurrent.text(formatDate(date, 'Y年m月')));
                        $calendarMenu.append($elms.Next[current]);

                        t = 0,
                        $tr = [],
                        blockedArray = blocked(date);

                        $.each(blockedArray, function (i, day) {
                            if (i % 7 == 0) {
                                $tr.push($('<tr></tr>'));
                                $calendarTbody.append($tr[t]);
                            }
                            if (day) {
                                id = formatDate(date, 'Y-m-') + _pad(day, 2);
                                $elms.Days[id] = $('<td class="calendar-day">' + _pad(day, 2) + '</td>');
                                $tr[t].append($elms.Days[id]);
                            }
                            else {
                                $tr[t].append('<td class="none-day"></td>');
                            }
                            if (i % 7 == 6) {
                                t++;
                            }
                        });

                    },
                    calendarsEvens: function () {
                        var that = this;

                        $elms.CancelButton.click(that.datepickerHandlers.off);
                        $elms.OkButton.click(that.datepickerHandlers.ok);
                        $elms.ClearButton.click(that.datepickerHandlers.reset);

                        $.each($elms.Days, function (id, $day) {
                            $day.click(function () { that.calendarsHandlers.click(id, $day) });
                        });

                        $.each($elms.Prev, function (current, $prev) {
                            $prev.click(function () { that.calendarsHandlers.prev() });
                        });

                        $.each($elms.Next, function (current, $next) {
                            $next.click(function () { that.calendarsHandlers.next() });
                        });

                        $elms.Calendars.click(function (event) { event.stopPropagation(); });

                    },
                    calendarsHandlers: {
                        setWidth: function () {
                            $elms.Calendars.width($elms.Calendar[0].outerWidth() * options.calendars);
                        },
                        selected: function (date) {
                            date0 = date[0];
                            date1 = (date[1]) ? date[1] : date[0];
                            var todayY_m_d = formatY_m_d(datepicker.today);
                            $.each($elms.Days, function (id, $day) {
                                $day.removeClass('select-day today');
                                if (id == todayY_m_d) {
                                    $day.addClass('today');
                                }

                                if (date0 && id >= formatY_m_d(date0) && id <= formatY_m_d(date1)) {
                                    $day.addClass('select-day');
                                }
                            });

                        },
                        click: function (id, $day) {
                            if (!datepicker.status.selecting) {
                                datepicker.temp.date = [];
                                datepicker.temp.date[0] = parseY_m_d(id);
                                datepicker.temp.slct[0] = id;
                                datepicker.calendarsHandlers.selected([datepicker.temp.date[0]]);

                                datepicker.status.selecting = true;

                                datepicker.text = formatZhY_m_d(datepicker.temp.date[0]);

                            }
                            else {
                                datepicker.temp.date[1] = parseY_m_d(id);
                                if (datepicker.temp.date[0] == datepicker.temp.date[1]) {
                                    datepicker.temp.date[0] = [datepicker.temp.date[1]];
                                }
                                if (datepicker.temp.date[0] > datepicker.temp.date[1]) {
                                    datepicker.calendarsHandlers.selected([
                                        datepicker.temp.date[1],
                                        datepicker.temp.date[0]
                                    ]);
                                    datepicker.temp.slct = [id, datepicker.temp.slct[0]];

                                    datepicker.text = formatZhY_m_d(datepicker.temp.date[1]) + ' - ' + formatZhY_m_d(datepicker.temp.date[0]);

                                }
                                else {
                                    datepicker.calendarsHandlers.selected([
                                        datepicker.temp.date[0],
                                        datepicker.temp.date[1]
                                    ]);
                                    datepicker.temp.slct = [datepicker.temp.slct[0], id];

                                    datepicker.text = formatZhY_m_d(datepicker.temp.date[0]) + ' - ' + formatZhY_m_d(datepicker.temp.date[1]);
                                }
                                datepicker.status.selecting = false;
                            }

                            datepicker.datepickerHandlers.text(datepicker.text);

                        },
                        prev: function () {
                            datepicker.begin = new Date(datepicker.begin.getFullYear(), datepicker.begin.getMonth() - 1, 1);
                            datepicker.calendars();
                        },
                        next: function (current) {
                            datepicker.begin = new Date(datepicker.begin.getFullYear(), datepicker.begin.getMonth() + 1, 1);
                            datepicker.calendars();
                        }
                    },
                    init: function () {
                        var that = this;

                        that.status.opening = false;
                        that.status.selecting = false;

                        that.__construct();

                        $this.empty();

                        that.datepicker();
                        that.datepickerEvents();

                        that.calendars();
                        $elms.Calendars.hide();

                        $this.append($elms.Datepicker);
                        $this.append($elms.Calendars);

                        $this.addClass('datepicker');

                        that.datepickerHandlers.setWidth();
                    }
                }, function () { });

        datepicker.init();
    }
});