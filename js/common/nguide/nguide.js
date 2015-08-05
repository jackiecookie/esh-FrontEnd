/*
提示层
*/
define(['jquery', 'tools', 'css/common/nguide/nguideBase.css'], function (require, exports, module) {
    var $ = require('jquery');
    var cookieHelp = require('tools').cookieHelp;
    function nguide(obj) {
        var c = this;
        c.id = obj.id || "ng-index",
      c.stateId = "ks-state-step-" + c.id,
        c.steps = obj.steps || [];
        //箭头大小,
        c.arrowSize = obj.arrowSize || 15;
        c.ng = $(".NG-Guide");
        c.ng.lenght == 0 || (c.ng = $('<div class="NG-Guide"></div>'));
        $("body").append(c.ng);
        c._createMask();
        c.defaultWidth = c.ng.width(), c.curStep = 1, c.animDist = 80, c.topDist = 100;
        c.prefix = obj.prefix || "";
        c.bgclass = obj.bgclass || "";
        c.init();
    }

    nguide.TEMPLATE = {
        overlay: function (data) {
            if (data) {
                var joinArr = '<div class="NG-Content clearfix"><span class="NG-stepNumber">' + data.step + '</span><div class="NG-body">';
                if (data.title) {
                    joinArr += '<h2 class="NG-Guide-title">' + data.title + '</h2>';
                }
                if (data.content) {
                    joinArr += '<div class="NG-Guide-content">' + data.content + '</div>';
                }
                joinArr += '</div><div class="NG-Guide-Actions">' + data.actions + '</div></div><div class="NG-Arrow"><span class="border-arrow border-arrow-down"></span><span class="border-arrow border-arrow-up"></span></div><a class="NG-Guide-Close" href="javascript:void(0);" title="关闭"></a>';
                return joinArr;
            }
        },
        prev: '<input type="button" class="NG-btn NG-btn-prev" value="上一个">',
        next: '<input type="button" class="NG-btn NG-btn-next" value="下一个">',
        done: '<input type="button" class="NG-btn NG-btn-done" value="知道了">',
        skip: '<input type="button" class="NG-btn NG-btn-skip" value="跳过">'
    };
    module.exports.nguide = $.extend(nguide, {
        _createMask: function () {
            var b = this;
            b.mask = $('<div class="NG-Guide-mask" style="background-color:#000;left:0;top:0;width:100%;height:100%;opacity:0.2;filter:alpha(opacity=20);position:absolute;z-index:99999;display:none;"></div>');
            $("body").append(b.mask);
        },
        _showMask: function () {
            var b = this.mask;
            b.css({
                height: $(document).height(),
                display: "block"
            })
        }, destory: function () {
            var a = this;
            a.ng.remove(), a.mask && a.mask.remove();
        }, _getPosition: function (b) {
            var c = this,
                d = c.steps[b - 1],
                e = $(d.target),
                f = e.offset(),
                g = {
                    width: e.outerWidth(),
                    height: e.outerHeight()
                },
                h = {
                    width: c.ng.innerWidth(),
                    height: c.ng.innerHeight()
                },
                i = {
                    left: 0,
                    top: 0
                };
                if (d.offset && d.offset.x) {
                f.left += d.offset.x;
            }
            if (e.length == 0) {
                throw new Error("请指定targe");
            }
            switch (d.offsetX = d.offsetX ? d.offsetX : 0, d.offsetY = d.offsetY ? d.offsetY : 0, d.placement) {
                case "right":
                    i.left = f.left + g.width + d.offsetX + c.arrowSize, i.top = f.top + d.offsetY;
                    break;
                case "top":
                    i.left = f.left + d.offsetX, i.top = f.top - h.height - d.offsetY - c.arrowSize;
                    break;
                case "bottom":
                    i.left = f.left + d.offsetX, i.top = f.top + g.height + d.offsetY + c.arrowSize;
                    break;
                default:
                    i.left = f.left - h.width - c.arrowSize - d.offsetX, i.top = f.top + d.offsetY
            }
            return i
        },
        _setItem: function (val) {
            var b = this;
            cookieHelp.SetCookie(b.stateId, b.id + ":" + val);
        }, _setNgWidth: function (a) {
            var b = this,
                c = b.steps[a - 1],
                d = /(^|\s+)NG\-Guide\-\w+(\s|$)/g,
                e = b.ng.attr("class");
            c.placement = c.placement ? c.placement : "left", c.width ? b.ng.css("width", c.width) : b.ng.css("width", b.defaultWidth), e.match(d) ? b.ng.attr("class", e.replace(d, "$1NG-Guide-" + c.placement + "$2")) : b.ng.addClass("NG-Guide-" + c.placement);
        }, _setArrowPosition: function (a) {
            var b = this,
                c = b.steps[a - 1],
                d = b.ng.find(".NG-Arrow");
            if (c.arrowOffset) switch (c.placement) {
                case "right":
                    d.css("top", c.arrowOffset);
                    break;
                case "top":
                    d.css("left", c.arrowOffset);
                    break;
                case "bottom":
                    d.css("left", c.arrowOffset);
                    break;
                default:
                    d.css("top", c.arrowOffset)
            }
        }, setSkin: function (a) {
            var b = this,
                c = "",
                d = null,
                e = b.ng.attr("class");
            a ? (c += "NG-Skin-" + b.steps[b.curStep - 1].placement + "-" + a, d = new RegExp("(^|\\s+)NG-Skin-(\\w+)-\\w+(\\s+|$)", "g"), d.test(e) ? (e = e.replace(d, "$1" + c + "$3"), b.ng.attr("class", e)) : b.ng.addClass(c)) : b.ng.attr("class", e.replace(new RegExp("(^|\\s+)NG-Skin-(\\w+)-\\w+(\\s+|$)", "g"), "")), b.skin = a
        },
        //绑定点击事件
        _delegateAction: function () {
            var a = this;
            a._eventHandle || (a.ng.delegate(".NG-btn-prev", "click", function (b) {
                a.gotoStep(--a.curStep), a._setItem(a.curStep), b.preventDefault()
            }), a.ng.delegate(".NG-btn-next", "click", function (b) {
                a.gotoStep(++a.curStep), a._setItem(a.curStep), b.preventDefault()
            }), a.ng.delegate(".NG-btn-skip", "click", function (b) {
                a._setItem("off"), a.destory(), b.preventDefault()
            }), a.ng.delegate(".NG-btn-done", "click", function (b) {
                a._setItem("off"), a.hide(), b.preventDefault()
            }), a.ng.delegate(".NG-Guide-Close", "click", function (b) {
                a._setItem("off"), a.hide(), b.preventDefault()
            }), a._eventHandle = !0)
        },
        _scrollWindow: function (b, c, d) {
            var e = this,
            //IE下使用body无法滚动,//谷歌下html无法滚动
                f = $('html,body'),
                g = f.scrollTop(),
                w = $(window),
                h = {
                    width: w.outerWidth(),
                    height: w.outerHeight()
                },
                i = {
                    width: e.ng.outerWidth(),
                    height: e.ng.outerHeight()
                };

            //            b.top - e.topDist < 0 ? f.scrollTop(
            //                b.top - e.topDist > 0 ? b.top : 0) : b.top + i.height + e.topDist > g + h.height ? f.scrollTop(
            //                b.top + i.height + e.topDist - h.height
            //            ) : b.top < g ? f.animate(
            //                b.top - i.height
            //            ) : d && d();
            w.outerHeight();
            b.top - e.topDist < 0 ? f.animate({
                scrollTop: b.top - e.topDist > 0 ? b.top : 0
            }, 1000, function () {
                d && d()
            }) : b.top + i.height + e.topDist > g + h.height ? f.animate({
                scrollTop: b.top + i.height + e.topDist - h.height
            }, 1000, function () {
                d && d()
            }) : b.top < g ? f.animate({
                scrollTop: b.top - i.height
            }, 1000, function () {
                d && d()
            }) : d && d()
        },
        _moveToTarget: function (a, c) {
            var d = this,
                e = d.steps[c - 1],
                f = {
                    left: a.left,
                    top: a.top
                };
            switch (e.placement) {
                case "right":
                    f.left = a.left + d.animDist;
                    break;
                case "top":
                    f.top = a.top - d.animDist;
                    break;
                case "bottom":
                    f.top = a.top + d.animDist / 2;
                    break;
                default:
                    f.left = a.left - d.animDist / 2
            }
            //false: ie<8判断 
            d.ng.css(false ? {
                top: f.top,
                left: (f.left - e.offset.x)
            } : {
                opacity: 0,
                top: f.top,
                left: f.left
            }), d.ng.show(), a.opacity = 1, d._scrollWindow(a, c, function () {
                d.ng.animate(a, 500)
            })
        },
        gotoStep: function (b) {
            var c = this,
                d = c.steps.length;
            if (1 > d || b > d) return;
            var f = nguide.TEMPLATE.prev + nguide.TEMPLATE.next + nguide.TEMPLATE.skip,
                h = {
                    data: c.steps[b - 1]
                };
            1 === b ? f = nguide.TEMPLATE.next + nguide.TEMPLATE.skip : b === d && (f = nguide.TEMPLATE.prev + nguide.TEMPLATE.done), 1 === d && (f = nguide.TEMPLATE.done), h.data.actions = f, h.data.step = b;
            var i = nguide.TEMPLATE.overlay(h.data);
            c.ng.html(i);
            var j = c.ng._stepCls,
                k = c.prefix ? c.prefix + "step-" + b : "NG-step-" + b;
            j ? (c.ng.removeClass(j), c.ng.addClass(k)) : c.ng.addClass(k), c.ng._stepCls = k, c._setNgWidth(b), c._setArrowPosition(b);
            if (c.bgclass) c.ng.addClass(c.bgclass);
            var l = c._getPosition(b),
                m = cookieHelp.GetCookie(c.stateId);
            c._moveToTarget(l, b), m && "off" !== m.split(":")[1] && (c._setItem(b), c.curStep = b), c.setSkin(c.skin)
        },
        hide: function () {
            var a = this;
            a.ng.hide(), a.mask && a.mask.hide();
        },
        init: function () {
            var a = this;
            if (a.steps.length <= 0) return void a.destory();
            var b = cookieHelp.GetCookie(a.stateId);
            if (b) {
                var c = b.split(":")[1];
                if (isNaN(parseInt(c))) return;
                a.curStep = 1, a.gotoStep(a.curStep)
            } else a.curStep = 1, a.gotoStep(a.curStep), a._setItem(a.curStep);
            a.mask && a._showMask(), a.setSkin(a.skin), a._delegateAction();
        }
    });
});