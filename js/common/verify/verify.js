/*
表单验证提示信息
*/
define(function (require, exports, module) {
    ZDK = require('js/common/procopy/procopy'),
    ZDK.poptip = require('js/common/popTip/popTip'),
    Lang = {
        required: '该字段为必选项！',
        min: '该字段最小长度不能低于{min}位！',
        max: '该字段最大长度不能高于{max}位！',
        pattern: '该字段不满足模式条件！',
        'int': '请输入正确的整型！',
        email: '请输入正确的邮件(email)地址！',
        url: '请输入正确的URL地址！',
        date: '请输入正确的日期格式!',
        time: '请输入正确的时间格式!',
        qq: '请输入正确的QQ号码',
        tel: '请输入正确的手机号码',
        phone: '请输入正确的座机号码',
        contact: '不能包含联系方式！'
    };
    var Verify = function (options) {
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(options);
        }
        this.entry(options);
    },
        regForm = /form/i;
    Verify.prototype = {
        entry: function (options) {
            this.opche = $.extend({
                target: null,
                button: null,
                item: '.ui-form-item',
                focusClass: 'ui-form-focus',
                successClass: 'ui-form-success',
                errorClass: 'ui-form-error',
                hoverClass: 'ui-form-hover',
                asynClass: 'ui-form-asyn',
                warningClass: 'ui-form-warning',
                oninited: null,
                holderLeft: 5,
                holderTop: 5,
                alertType: true
            }, options);
            this.target = $(this.opche.target);
            this.button = $(this.opche.button);
            if (this.target.length == 0) {
                return;
            }
            if (!regForm.test(this.target[0].nodeName)) {
                throw new Error("The target must is a form element!");
            }
            for (var data = "focus,hover,error,success,asyn,warning".split(','), len = data.length - 1, key; len >= 0; len--) {
                this['i' + (key = data[len])] = (typeof this.opche[key += 'Class'] == 'string') ? this.opche[key].replace('.', '') : false;
            }
            this.asyning = false;
            this.asynCache = {};
            this.asynQueue = [];
            this.asynResult = {};
            this.asynError = {};
            this.asynSuccess = {};
            this.result = {};
            this.errorTips = [];
            this.bind();
            this.opche.oninited && this.opche.oninited(this);
        },
        forceSubmit: function () {
            this.foSubmit = true;
            this.target.submit();
            this.foSubmit = false;
        },
        bind: function () {
            var self = this,
                tabindex = 1;
            this.target.unbind('submit');
            this.button.unbind('click').bind('click', function () {
                self.target.submit();
                return false;
            });
            this.target.submit(function () {
                if (true === self.submit()) {
                    if (self.foSubmit || false !== self.trigger('submitBefore')) {
                        return true;
                    }
                }
                return false;
            });
            (this.items = this.target.find(this.opche.item)).each(function (i, item) {
                var item = $(item),
                    input = item.find(':input').not('[type=hidden]') || item.find(':textarea'),
                    name = input.attr('name');
                item.attr('data-index', i);
                self.bindItem(input, item, name);
                input.attr('tabIndex', 1 + i);
            });
            this.trigger('bind', {
                verify: this
            });
        },
        bindItem: function (input, item, name) {
            var self = this,
                asynURI = Verify.fn.ajaxurl(item),
                jsonp = asynURI.indexOf('http') > -1,
                autoFocus = item.attr('autofocus'),
                placeHolder = item.attr('placeholder'),
                focusTips = item.attr('focustips');
            self.trigger('bindItem', {
                input: input,
                item: item,
                name: name
            });
            input.focus(function () {
                self.ifocus && self.changeState(input, item, 'focus');
                focusTips && Verify.fn.focustips(input, item, focusTips, name, true);
                self.trigger('itemfocus', {
                    input: input,
                    item: item
                });
            }).blur(function () {
                if (!item.attr('noblur')) {
                    if (self.checkItem(input, item, name) && asynURI) {
                        self.asyn(input, item, asynURI, name, jsonp);
                    }
                    self.ifocus && self.changeState(input, item, 'focus', true);
                    focusTips && Verify.fn.focustips(input, item, name);
                    self.trigger('itemblur', {
                        input: input,
                        item: item
                    });
                }
            });
            if (self.ihover) {
                item.hover(function () {
                    self.changeState(input, item, 'hover');
                }, function () {
                    self.changeState(input, item, 'hover', true);
                });
            }
            placeHolder && Verify.fn.placeholder(input, item, placeHolder, self);
            autoFocus && Verify.fn.autofocus(item);
        },
        asyn: function (input, item, asyn, name, jsonp, force) {
            var self = this,
                val, Data = name + '=' + (val = input.val()),
                param;
            var key = ZDK.hash(asyn);
            if (!force && (self.asynCache[key + val] || self.asynCache[key])) { }
            if (!force && self.asyning) {
                return (self.asynCache[key] = true) && self.asynQueue.push([input, item, asyn, name, jsonp]);
            }
            self.trigger('asyning', {
                input: input,
                item: item,
                asyn: asyn,
                jsonp: jsonp
            });
            self.iasyn && self.changeState(input, item, 'asyning')(input, item, 'success', true, self);
            (param = Verify.fn.parameter(item)) && (Data += '&' + param);
            if ((self.asyning = true) && jsonp) {
                $.ajax({
                    url: asyn,
                    dataType: 'jsonp',
                    jsonp: "jsonpcallback",
                    data: Data,
                    success: function (json) {
                        self.asynCallback(json, input, item, asyn, name, val);
                    }
                });
            } else {
                $.ajax({
                    url: asyn,
                    dataType: 'html',
                    data: Data,
                    type: 'post',
                    success: function (json) {
                        json = (new Function('return ' + json))();
                        self.asynCallback(json, input, item, asyn, name, val);
                    },
                    error: function () { }
                });
            }
        },
        asynCallback: function (json, input, item, asyn, name, val) {
            var self = this,
                pop;
            (pop = self.asynQueue.pop()) && pop.push(true) ? self.asyn.apply(self, pop) : (self.asyning = false);
            var key = ZDK.hash(asyn);
            self.iasyn && self.changeState(input, item, 'asyning', true);
            self.asynCache[key] = false;
            if (json.state == 1) {
                self.asynCache[key + val] = true;
                if (false != self.trigger('asynSuccess', {
                    json: json,
                    input: input,
                    item: item,
                    name: name,
                    val: val
                })) {
                    self.changeState(input, item, 'error', true)(input, item, 'success', false, self)(input, item, 'asyning', true, self);
                    self.asynResult[name] = true;
                    delete self.asynError[name];
                    self.asynSuccess[name] = json.msg;
                }
            } else {
                self.asynResult[name] = false;
                self.trigger('asynError', {
                    json: json,
                    input: input,
                    item: item,
                    name: name,
                    val: val
                });
                self.asynError[name] = json.msg;
                self.changeState(input, item, 'error');
                delete self.asynSuccess[name];
            }
        },
        checkItem: function (input, item, name) {
            var val = input.val(),
                key, res, self = this,
                type, iret = true;
            if (input.attr('type') == 'checkbox') {
                val = input.attr('checked');
            }
            self.result[name] = false;
            for (var p in Verify.property) {
                if ((key = item.attr(p)) !== undefined) {
                    if (key && (typeof (res = Verify.property[p](key, val, item)) == 'string')) {
                        iret = false;
                        res = item.attr(key + 'tips') || res;
                        break;
                    }
                }
            }
            if (iret && !val) {
                return true;
            }
            if (iret && (type = item.attr('type')) && (type in Verify.type)) {
                if (val && !Verify.type[type](val, item)) {
                    iret = false;
                    res = Lang(type);
                }
            }
            if ((type = item.attr('notype')) && val) {
                var notype = {
                    email: function (val) {
                        return /[a-zA-Z0-9_+.-]+\@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/.test(val);
                    },
                    qq: function (val) {
                        return /[0-9]{5,10}$/.test(val);
                    },
                    tel: function (val) {
                        return /1[34586]\d{9}$/.test(val);
                    },
                    phone: function (val) {
                        return /(?:\d{3,4})\d{6-8}$/.test(val);
                    }
                };
                if (type == "contact") {
                    if (notype["phone"](val, item) || notype["tel"](val, item) || notype["email"](val, item) || notype["qq"](val, item)) {
                        iret = false;
                        res = Lang(type);
                    }
                } else if (type == Verify.type) {
                    if (notype[type](val, item)) {
                        iret = false;
                        res = Lang(type);
                    }
                }
            }
            if (self.isubmit && false === self.asynResult[name]) {
                res = self.asynError[name];
                iret = false;
            }
            res = !iret ? res : self.asynSuccess[name] || res;
            if (false == iret) {
                if (!item.attr('noblur') && this.opche.alertType != "pop") {
                    self.trigger('checkerror', {
                        input: input,
                        item: item,
                        name: name,
                        res: res
                    });
                    self.ierror && self.changeState(input, item, 'error')(input, item, 'success', true, self)(input, item, 'warning', true, self);
                    try {
                        var hlpeInlie = item.find(".help-inline");
                        if (hlpeInlie.get(0).defText) {
                            hlpeInlie.html(hlpeInlie.get(0).defText);
                        }
                        if (item.attr('notype')) {
                            hlpeInlie.html(res);
                        }
                    } catch (e) { };
                }
                self.isubmit && this.opche.alertType != "text" && Verify.fn.errortips && Verify.fn.errortips(input, item, self.errorTips.push(res) && res, name, false, this);
                return iret;
            } else {
                if (false !== self.trigger('checksuccess', {
                    input: input,
                    item: item,
                    name: name,
                    res: res
                })) {
                    if (!item.attr('noblur') && this.opche.alertType != "pop") {
                        self.isuccess && self.changeState(input, item, 'success');
                        self.changeState(input, item, 'error', true);
                        try {
                            var hlpeInlie = item.find(".help-inline");
                            if (!hlpeInlie.get(0).defText) hlpeInlie.get(0).defText = hlpeInlie.html();
                            hlpeInlie.html("");
                        } catch (e) { };
                    }
                } else {
                    return false;
                }
            }
            return self.result[name] = true;
        },
        changeState: function (input, item, state, isrm, self) {
            var chstate = [],
                stateClass = '',
                asyn;
            if (typeof isrm !== 'boolean') {
                self = isrm;
                isrm = false;
            }
            self = self || this;
            if (isrm && asyn) {
                return arguments.callee;
            }
            switch (state) {
                case 'success':
                    stateClass = asyn ? self.ierror : self.isuccess;
                    break;
                case 'error':
                    stateClass = self.ierror;
                    break;
                case 'warning':
                    stateClass = self.iwarning;
                    break;
                case 'asyning':
                    stateClass = self.iasyn;
                    break;
                case 'focus':
                    stateClass = self.ifocus;
                    break;
                default:
                    return arguments.callee;
            }
            if (stateClass) {
                item[isrm ? 'removeClass' : 'addClass'](stateClass);
                input[isrm ? 'removeClass' : 'addClass'](stateClass);
            }
            return arguments.callee;
        },
        submit: function () {
            var length = this.items.length,
                sucidx = 0,
                self = this;
            this.errorTips = [];
            this.isubmit = true;
            if (false !== self.trigger('scheckBefore', {
                target: self
            })) {
                self.items.each(function (i, item) {
                    var item = $(item);
                    var input = item.find(':input').not('[type=hidden]');
                    if (input.length == 0 || self.checkItem(input, item, input.attr('name'))) {
                        ++sucidx;
                    } else {
                        return false;
                    }
                });
            }
            this.isubmit = false;
            return length === sucidx;
        }
    };
    Verify.tips = function () {
        var tips, ctips, timer;
        var hide = function (tips) {
            timer && clearTimeout(timer);
            return timer = setTimeout(function () {
                tips && tips.hide();
                timer = null;
            }, 3000);
        };
        return function (input, item, title, name, focus, verify) {
//            var offset = input.offset();
//            var left = offset.left;
//            var top = offset.top + input.outerHeight() + 15;

//            var obj = $('.ui-poptip.ui-verify-tips');
//            if (obj[0]) {
//                obj.css({
//                    top: top,
//                    left: left
//                }).find('.ui-poptip-body p').text(title);
//                obj.show();
//                obj.isshow = true;
//                return false;
//            }
            var callee = arguments.callee;
            callee[ctips] && callee[ctips].hide();
            if (arguments.length == 3) {
                return callee[name] && callee[name].hide();
            }
            tips = ZDK.poptip({
                target: input,
                content: '<p class="ui-warning-min">' + title + '</p>',
                align: true,
                theme: 'ui-verify-tips',
                width: 50 + title.length * 16,
                height: 32,
                id: 'verify-tips-' + name,
                rebody: true,
                zIndex: 10000000000,
                datatitle: title,
                hasIframe: true,
                datafocus: focus
            });
            verify && verify.trigger('ontips', {
                title: title,
                input: input,
                item: item
            });
            if (!callee[ctips = name]) {
                tips.on('cache', function (data) {
                    var tips = data.target;
                    tips.resetWidth(50 + tips.opche.datatitle.length * 16);
                    tips.resetBody('<p class="ui-warning-min">' + tips.opche.datatitle + '</p>');
                    tips.reset();
                    !tips.opche.datafocus && hide(tips);
                });
                callee[name] = tips;
            } !focus && hide(tips) && input.focus();
        };
    } ();
    Verify.type = {
        'int': function (val) {
            return /^[0-9]+$/.test(val);
        },
       //正整型 不算0
        'positiveInt': function (val) {
              return /^[1-9]\d*$/.test(val);
        },
       
        'double': function (val) {
            return /^\d+[.]*\d*$/i.test(val);
        },
        userid: function (val) {
            return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val);
        },
        email: function (val) {
            return /^[a-zA-Z0-9_+.-]+\@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/.test(val);
        },
        url: function (val) {
            return /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(val);
        },
        date: function (val, item) {
            var format = ((item&&item.attr('dateformat')) || 'YYYY-MM-DD').toUpperCase();
            format = format.replace('YYYY', '[12][09][0-9][0-9]').replace('YY', '[7-9][0-9]').replace('MM', '[10][0-9]').replace('M', '[10]?[0-9]').replace('DD', '[0-3][0-9]').replace('D', '[0-3]?[0-9]');
            try {
                format = new RegExp('^' + format + '$');
            } catch (e) {
                throw "DataFormat is error:" + format;
            }
            return format.test(val);
        },
        time: function (val) {
            return /^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/.test(val);
        },
        qq: function (val) {
            return /^[0-9]{5,10}$/.test(val);
        },
        tel: function (val) {
            return /^1[34586]\d{9}$/.test(val);
        },
        phone: function (val) {
            return /^(?:\d{3,4})\d{6-8}$/.test(val);
        }
    };
    Verify.property = {
        required: function (required, val) {
            return required !== undefined ? !!val ? true : Lang('required') : true;
        },
        min: function (min, val) {
            var len = val.replace(/[\u4e00-\u9fa5]/g, "**").length;
            return val ? len >= min ^ 0 ? true : Lang('min').replace('{min}', min) : true;
        },
        max: function (max, val) {
            var len = val.replace(/[\u4e00-\u9fa5]/g, "**").length;
            return val ? len <= max ^ 0 ? true : Lang('max').replace('{max}', max) : true;
        },
        pattern: function (pattern, val, item) {
            if (pattern) {
                try {
                    pattern = eval(pattern);
                } catch (e) {
                    throw "The pattern error:" + pattern;
                }
                return pattern.test(val) ? true : item.attr('patterntips') || Lang('pattern');
            }
            return true;
        }
    }, Verify.fn = {
        placeholder: function (input, item, title, self) {
            var pos = input.eq(0).position(),
                place;
            if (!pos) {
                return;
            }
            place = $('<em class="ui-form-placeholder">' + title + '</em>').css({
                left: pos.left + self.opche.holderLeft,
                top: pos.top + self.opche.holderTop
            }).appendTo(item);
            place.click(function () {
                input.focus();
            });
            input.eq(0).bind('focus', function () {
                place[input.val() ? 'hide' : 'show']();
            }).bind('keyup', function () {
                place[input.val() ? 'hide' : 'show']();
            }).bind('blur', function () {
                if (!input.val()) {
                    place.show();
                }
            });
            setTimeout(function () {
                input.val() && place.hide();
            }, 100);
        },
        autofocus: function (item) {
            item.find(':input').focus();
        },
        ajaxurl: function (item) {
            return item.attr('ajaxurl') || '';
        },
        parameter: function (item) {
            return item.attr('parameter') || '';
        },
        focustips: function () {
            Verify.tips.apply(Verify, arguments);
        },
        errortips: function () {
            Verify.tips.apply(Verify, arguments);
        },
        successtips: false
    };
    module.exports = ZDK.procopy(Verify, ZDK.EventEmitter);
    module.exports.showErroTip = function (jqeml, msg) {
        $('.ui-poptip.ui-verify-tips').remove();
        module.exports.fn.errortips(
            jqeml,
            jqeml.parent(),
            msg, 'errName'
        );
    };


});