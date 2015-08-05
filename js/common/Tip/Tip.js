/**
提示信息
*/
define(['css/common/tip/tips.css'], function (require, exports, module) {
    function Tips(options) {
        this.content = options.content;
        this.timeout = options.timeout;
        this.icon = options.icon;
        this.width = options.width;
    }
    Tips.prototype = {
        create: function () {
            var ctml = [];
            ctml = ['<div class="ui-poptip tisp-' + this.icon + '" style="left:50%;top:50%;padding:10px 10px 10px 35px;width:auto; float:left;z-index:9002">'];
            ctml.push('<div class="ui-poptip-body"><div class="alert-img"><em class="' + this.icon + '"></em>' + this.content + '</div>');
            ctml.push('</div>');
            var objHtml = $(ctml.join(''));
            objHtml.appendTo(document.body);
            return objHtml;
        },
        resetPosition: function (obj) {
            var width = obj.width();
            var height = obj.height();
            var scroll = $(document).scrollTop();
            obj.css({
                'margin-left': -width / 2 - 45 / 2,
                'margin-top': -height / 2 + scroll + 15
            });
            obj.animate({
                marginTop: -height / 2 + scroll
            }, 400);
        },
        hideClose: function (obj) {
            obj.remove();
        }
    };
    var eshTips = function (content, timeout, icon, width) {
        if (/^\s*$/.test(content) || !content) return false;
        var tip = new Tips({
            content: content,
            icon: icon || "success",
            width: width,
            timeout: timeout
        });
        tip.hideClose($('.tisp-' + icon))
        var html = tip.create();
        tip.resetPosition(html);
        if (timeout != 0) {
            setTimeout(function () {
                tip.hideClose(html);
            }, tip.timeout);
        }
    };
    var tooltip = $("body");
    tooltip.delegate(".zbj-tooltip", "mouseover", function () {
        var _this = $(this),
            _body = $("body"),
            _post = _this.attr("tool-map"),
            _text = _this.attr("tool-text"),
            _topf = _this.attr("tool-top"),
            _leftf = _this.attr("tool-left"),
            _tip = _body.find(".tool-" + _post);
        var extraCls = _this.attr("tool-cls") || '';
        if (_tip.length >= 1) {
            _tip.remove();
        }
        $('<div align="center" class="tooltip tool-' + _post + " " + extraCls + '" ><div class="tooltip-arr"><i class=""></i></div>' + _text + '</div>').prependTo(_body);
        _tip = _body.find(".tooltip").css({
            opacity: 0
        });
        var _left = _this.offset().left - (_leftf ? _leftf : 0),
            _right = _this.offset().right,
            _top = _this.offset().top - (_topf ? _topf : 0),
            _bottom = _this.offset().bottom;
        switch (_post) {
            case 'top':
                _tip.css({
                    top: _top - _tip.innerHeight() - 10,
                    left: _left - _tip.innerWidth() / 2 + _this.innerWidth() / 2
                });
                _tip.find(".tooltip-arr").css({
                    left: _tip.width() / 2 + "px"
                });
                break;
            case 'bottom':
                _tip.css({
                    top: _top + _tip.innerHeight() + 8,
                    left: _left - _tip.innerWidth() / 2 + _this.innerWidth() / 2 - 6
                });
                _tip.find(".tooltip-arr").css({
                    left: _tip.innerWidth() / 2 + "px"
                });
                break;
            case 'left':
                _tip.css({
                    top: _top - _tip.innerHeight() / 2 + _this.innerHeight() / 2,
                    left: _left - _tip.innerWidth() - 15
                });
                break;
            case 'right':
                _tip.css({
                    top: _top - _tip.innerHeight() / 2 + _this.innerHeight() / 2,
                    left: _left + _this.innerWidth() + 15
                });
                break;
            default:
                _tip.css({
                    bottom: "25px"
                });
                break;
        }
        _tip.animate({
            opacity: 1
        }, 400)
    });
    tooltip.delegate(".zbj-tooltip", "mouseout", function () {
        $("body").find(".tool-" + $(this).attr("tool-map")).remove();
    });
    tooltip.delegate(".zbj-tooltip", "click", function () {
        $("body").find(".tool-" + $(this).attr("tool-map")).remove();
    });
    module.exports = eshTips;
});