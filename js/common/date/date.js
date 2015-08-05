/*
日期显示
*/
define(['js/common/procopy/procopy', 'css/common/date/EshDataPick.css'], function (require, exports, module) {
  var  ZDK = require('js/common/procopy/procopy'),
     lang = {
        'prev.title': '向前翻页',
        'next.title': '向后翻页',
        'today.title': '选择今天',
        today: '今天',
        week: ['日', '一', '二', '三', '四', '五', '六'],
        month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        close: '关闭'
    },
    Lang = function (key) {
        return lang[key] || '';
    },
    CDate = function (config) {
        if (config && config.nodeType && config.nodeType == 1) {
            CDate.open(config);
            return false;
        }
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(config);
        }
        this.entry(config);
    },
        rdate = /^(?:[12][90][0-9][0-9][01]?[0-9][0-3]?[0-9]|[12][90][0-9][0-9]-[01]?[0-9]-[0-3]?[0-9]|[12][90][0-9][0-9]\/[01]?[0-9]\/[0-3]?[0-9])$/,
        Cache = {};
    CDate.prototype = {
        entry: function (config) {
            var opche = this.opche = $.extend({
                target: null,
                input: null,
                format: 'YYYY-MM-DD',
                start: null,
                end: null,
                columns: 1
            }, config),
                val;
            this.target = $(opche.target);
            this.input = $(opche.input || opche.target);
            this.resetDate();
            if (opche.start && opche.start.match(rdate)) {
                this.start = this.getYMD(new Date(opche.start.replace(/-/g, '/')));
            }
            if (opche.end && opche.end.match(rdate)) {
                this.end = this.getYMD(new Date(opche.end.replace(/-/g, '/')));
            }
            this.init();
            this.bind();
        },
        CT: function (html) {
            ! -[1, ] && html.replace(/<\/(\w+)>/g, function (_, $1) {
                document.createElement($1.toUpperCase());
            });
            document.createElement('WebDateDayItem');
            document.createElement('webdateyearlistitem');
            return html;
        },
        init: function () {
            var html = ['<WebDate style="display:none;">'],
                self = this;
            html.push('<iframe border="0" scrolling="no" fameBorder="0" style="height:100%;background:red;"></iframe>');
            html.push('<WebDateMain>');
            for (var lens = tlen = self.opche.columns - 1; lens >= 0; lens--) {
                html.push('<WebDatePanel><WebDateHead>');
                lens == tlen && html.push('<WebDatePrev title="', Lang('prev.title'), '">«</WebDatePrev>');
                html.push('<WebDateYear>', self.nowYear, '</WebDateYear><WebDateMonth>.', self.nowMonth, '</WebDateMonth>')
                if (lens == 0) {
                    html.push('<WebDateNext title="', Lang('next.title'), '">»</WebDateNext>')
                    html.push('<WebDateToday title="', Lang('today.title'), '">', Lang('today'), '</WebDateToday>');
                }
                html.push('</WebDateHead><WebDateBody><WebDateWeeks>');
                for (var data = Lang('week'), idx = 0, len = data.length; idx < len; idx++) {
                    html.push('<WebDateWeek>', data[idx], '</WebDateWeek>');
                }
                html.push('</WebDateWeeks><WebDateDays style="height:120px;"></WebDateDays>');
                html.push('<WebDateYearList style="display:none;"><WebDateListClose>×</WebDateListClose><WebDateYearBody></WebDateYearBody><WebDateYearToolbar><WebDateListPrev>< ' + Lang('prev.title') + '</WebDateListPrev><WebDateListNext>' + Lang('next.title') + '></WebDateListNext></WebDateYearToolbar></WebDateYearList>');
                html.push('<WebDateMonthList style="display:none;"><WebDateListClose>×</WebDateListClose>');
                for (var data = Lang('month'), idx = 0, len = data.length; idx < len; idx++) {
                    html.push('<WebDateMonthListItem data-index="' + idx + '">' + data[idx] + '</WebDateMonthListItem>');
                }
                html.push('</WebDateMonthList></WebDateBody></WebDatePanel>');
            }
            html.push('</WebDateMain></WebDate>');
            ZDK.assert(function (div, item) {
                div.innerHTML = self.CT(html.join(''));
                while (item = div.firstChild) {
                    if (item.nodeType == 1) {
                        document.body.appendChild(item);
                        self.Window = $(item);
                    } else {
                        div.removeChild(item);
                    }
                }
            });
            self.Year = self.Window.find('WebDateYear');
            self.Month = self.Window.find('WebDateMonth');
            self.Days = self.Window.find('webdatedays');
            self.YearList = self.Window.find('WebDateYearList');
            self.YearListBody = self.YearList.find('WebDateYearBody');
            self.MonthList = self.Window.find('WebDateMonthList');
            self.resetYearList();
            self.resetDayList();
        },
        resetYearList: function (year) {
            year = year || this.scYear;
            for (var html = [], b = year - 8, e = year + 7; b <= e; b++) {
                html.push('<WebDateYearListItem data-index="' + b + '">' + b + '</WebDateYearListItem>');
            }
            this.YearListBody.html(html.join(''));
        },
        resetDayList: function () {
            var year = this.nowYear,
                month = this.nowMonth,
                day = this.nowDay;
            for (var lens = this.Days.length, idx = 0; idx < lens; idx++) {
                var m = month + idx,
                    html = [],
                    _y, _m, _d;
                var begin = this.getPNMonthNumber(year, m, -1);
                var now = this.getPNMonthNumber(year, m);
                var end = this.getPNMonthNumber(year, m, 1);
                var bcw = (new Date(year + '/' + m + '/1')).getDay(),
                    bcwt;
                bcw = bcwt = bcw == 0 ? 6 : bcw - 1;
                for (; bcw >= 0; bcw--) {
                    html.push(this.resetDayListHelper(begin[1], begin[2], begin[0] - bcw, 'ui-date-gray'));
                }
                for (var len = now[0]; len > 0; len--) {
                    html.push(this.resetDayListHelper(now[1], now[2], now[0] - len + 1));
                }
                if ((bcw = 41 - (bcwt + now[0])) > 0) {
                    for (var idxx = 1; idxx <= bcw; idxx++) {
                        html.push(this.resetDayListHelper(end[1], end[2], idxx, 'ui-date-gray'));
                    }
                }
                this.Days.eq(idx).html(html.join(''));
                this.setYearMonth(idx, now[1], now[2]);
            }
            this.Window.css('width', lens * 230);
        },
        resetDayListHelper: function (y, m, d, cn) {
            var html = ['<WebDateDayItem class="'],
                date = y * 10000 + m * 100 + d;
            if (!this.isTimeRange(date, cn && html.push(cn))) {
                html.push(' ui-date-disabled');
            }
            if (date == this.toDay) {
                html.push(' ui-date-today');
            }
            html.push('" data-year="', y, '" data-month="', m, '" data-day="', d, '">', d);
            html.push('</WebDateDayItem>');
            return html.join('');
        },
        isTimeRange: function (date) {
            if (this.start && this.start > date) {
                return false;
            }
            if (this.end && this.end < date) {
                return false;
            }
            return true;
        },
        getPNMonthNumber: function (year, month, path) {
            if ((month += (path || 0)) < 1) {
                month = 12;
                year--;
            } else if (month > 12) {
                month = 1;
                year++;
            }
            return [(new Date(year, month, 0)).getDate(), year, month];
        },
        resetDate: function () {
            this.nowDate = (val = this.input.val()) && val.match(rdate) ? new Date(val.replace(/-/g, '/')) : new Date();
            this.nowYear = this.scYear = this.nowDate.getFullYear();
            this.nowMonth = this.nowDate.getMonth() + 1;
            this.nowDay = this.nowDate.getDate();
            this.toDay = this.getYMD(new Date());
        },
        getYMD: function (date) {
            return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        },
        resetPostion: function () {
            var input = this.input,
                offset = input.offset();
            this.resetDate();
            this.Window.css({
                left: offset.left,
                top: offset.top + input.outerHeight()
            });
        },
        setYearMonth: function (idx, year, month) {
            this.Year.eq(idx).html(year);
            this.Month.eq(idx).html(this.formatDB(month));
        },
        setYear: function (target) {
            var year = target.attr('data-index') ^ 0;
            this.nowYear = year;
            this.resetDayList();
            this.hideList(this.YearList, true);
        },
        setMonth: function (target) {
            var month = target.attr('data-index') ^ 0;
            this.nowMonth = month + 1;
            this.resetDayList();
            this.hideList(this.MonthList, true);
        },
        setDay: function (val) {
            if (val) {
                this.input.val(val);
                this.input.blur();
                this.hide();
                this.trigger('aftersetday')
            }
        },
        bind: function () {
            var self = this;
            self.Window.bind('click', function (e) {
                var target = e.target;
                switch (target.nodeName.toUpperCase()) {
                    case 'WEBDATELISTCLOSE':
                        self.hideList($(target));
                        break;
                    case 'WEBDATEYEAR':
                        self.showList('year');
                        break;
                    case 'WEBDATEMONTH':
                        self.showList();
                        break;
                    case 'WEBDATEPREV':
                        self.prevNext(-1);
                        break;
                    case 'WEBDATENEXT':
                        self.prevNext(1);
                        break;
                    case 'WEBDATETODAY':
                        self.today();
                        break;
                    case 'WEBDATELISTPREV':
                        self.prevNextList(-1);
                        break;
                    case 'WEBDATELISTNEXT':
                        self.prevNextList(1);
                        break;
                    case 'WEBDATEYEARLISTITEM':
                        self.setYear($(target));
                        break;
                    case 'WEBDATEMONTHLISTITEM':
                        self.setMonth($(target));
                        break;
                    case 'WEBDATEDAYITEM':
                        if (!(target = $(target)).hasClass('ui-date-disabled')) {
                            self.nowYear = target.attr('data-year') ^ 0;
                            self.nowMonth = target.attr('data-month') ^ 0;
                            self.nowDay = target.attr('data-day') ^ 0;
                            self.setDay(self.format());
                        }
                        try {
                            subForm([self.nowYear, self.nowMonth, self.nowDay])
                        } catch (e) { };
                        break;
                }
                return false;
            }).bind('mouseover', function (e) {
                $(e.target).addClass('ui-date-hover');
            }).bind('mouseout', function (e) {
                $(e.target).removeClass('ui-date-hover');
            });
            !self.opche.nobind && self.input.click(function (e) {
                self.show();
                return false;
            });
        },
        showList: function (year) {
            if (year) {
                var target = this.YearList;
                this.MonthList.hide();
            } else {
                var target = this.MonthList;
                this.YearList.hide();
            }
            target.css('top', -target.outerHeight(true)).show();
            target.animate({
                top: 0
            }, 200);
        },
        hideList: function (target, no) {
            var parent = no ? target : target.parent();
            parent.animate({
                top: -parent.outerHeight(true)
            }, 200, function () {
                parent.hide();
            })
        },
        prevNextList: function (path) {
            this.scYear += (path * 14)
            if (this.scYear < 1971) {
                return this.scYear = 1971;
            }
            this.resetYearList(this.scYear);
        },
        prevNext: function (path) {
            this.nowMonth += path;
            this.YearList.hide();
            this.MonthList.hide();
            if (this.nowMonth < 1) {
                this.nowMonth = 12;
                this.nowYear--;
            } else if (this.nowMonth > 12) {
                this.nowMonth = 1;
                this.nowYear++;
            }
            this.resetDayList();
        },
        show: function () {
            var self = this;
            setTimeout(function () {
                $(document).bind('click', {
                    self: self
                }, self.hide);
            }, 0);
            if (!self.isshow) {
                self.Window.css('display', 'block');
                self.resetPostion();
                self.isshow = true;
            }
        },
        hide: function (e) {
            var self = e && e.data ? e.data.self : e || this;
            $(document).unbind('click', self.hide);
            if (self.isshow) {
                self.Window.hide();
                self.isshow = false;
                self.YearList.hide();
                self.MonthList.hide();
            }
        },
        format: function () {
            return this.opche.format.replace('YYYY', this.nowYear).replace('YY', ('' + this.nowYear).substr(2)).replace('MM', this.formatDB(this.nowMonth)).replace('M', this.nowMonth).replace('DD', this.formatDB(this.nowDay)).replace('D', this.nowDay);
        },
        formatDB: function (val) {
            return val < 10 ? '0' + val : val;
        },
        today: function () {
            var date = new Date();
            this.nowYear = this.scYear = date.getFullYear();
            this.nowMonth = date.getMonth() + 1;
            this.nowDay = date.getDate();
            this.setDay(this.format());
        }
    };
    CDate.open = function (target, dtime, GUID) {
//        $(target).blur(function () {
//            alert('a');
//        });
        if ((GUID = target['Dateguid'] || (target['Dateguid'] = ZDK.uuid())) && (dtime = Cache[GUID])) {
            return dtime.show();
        }
        (Cache[GUID] = CDate({
            target: target,
            format: (target = $(target)).attr('date-format'),
            start: target.attr('date-start'),
            end: target.attr('date-end'),
            columns: target.attr('date-columns'),
            nobind: true
        })).show();
    };
    module.exports = ZDK.procopy(CDate, ZDK.EventEmitter);
});