/*
树形结构下拉框js
*/
define([], function (require, exports, module) {
    var jQuery = require('jquery'),
        createUiId = function (el, prefix) {
            var prefix = (!prefix && typeof prefix != 'string') ? 'form' : prefix;
            if (el.attr('id')) {
                return prefix + '_ui_id_' + el.attr('id');
            } else if (el.attr('name')) {
                return prefix + '_ui_name_' + el.attr('name')
                    .replace('[]', '')
                    .replace('[', '_')
                    .replace('\']', '')
                    .replace(']', '')
                    .replace('\'', '')
                    .replace('"', '');
            } else {
                return prefix + '_ui_the_' + 'n';
            }
        };
    (function ($) {
        var $View = function (str) {
            return $(eval('\'' + str.replace(/<%=([\w]+)\%>/g, '\' + $1 + \'') + '\''));
        },
            MultiCssSelect = function (config) {
                var url = config.url,
                    SelectDiv = config.DivElment.addClass('cssSelect'),
                    optsPosition,
                    optionsPosition,
                    optionsLimit,
                    nodeElmentClick = config.nodeElmentClick,
                    elmText = config.ElmText,
                    initName = config.initName ? config.initName : "全部",
                //8月18添加
                    onLoadSuccess = config.onLoadSuccess,
                    onClick = config.onClick,
                    hideClass = config.hideClass ? config.hideClass : "hideselect",
                    tpl = {
                        wrapper: '<div class="cssSelect"></div>',
                        select: '<div class="selectBox sNormal"></div>',
                        selectLt: '<div class="selectLt"></div>',
                        selectRt: '<div class="selectRt"></div>',
                        options: '<div class="optionsBox"></div>',
                        optionsInner: '<div class="optionsInnerBox"></div>',
                        option: '<div class="optionBox oNormal"></div>',
                        optionInner: '<span></span>',
                        optionBg: '<div class="optionBox optionBoxBg"></div>',
                        optionL: '<div class="optionBoxBg1 smallbg"></div>'
                    },
                    thisEvs = jQuery.data(SelectDiv[0], 'events'),

                /* Select box */
                    $selectEl = $View(tpl.select),
                    $sLtEl = $View(tpl.selectLt),
                    $sRtEl = $View(tpl.selectRt),

                /* Options box */
                    $optionsEl = $View(tpl.options),
                    $optionsInnerEl = $View(tpl.optionsInner),
                    $optionBg = $View(tpl.optionBg),
                    events = $.extend({
                        selectNormal: function () {
                            $(this).removeClass('sHover');
                        },
                        selectHover: function () {
                            $(this).addClass('sHover');
                        },
                        _selectClick: function () {

                            if ($optionsEl.css('display') != 'none') {
                                handlers.selectOff();
                                //                            $("." + hideClass).show();
                            } else {
                                $("." + hideClass).hide();
                                handlers.selectOn();
                                $selectEl.setOptions();
                            }
                        },
                        optionNormal: function () {
                            $(this).removeClass('oHover');
                        },
                        optionHover: function () {
                            $(this).addClass('oHover');
                        },
                        optionClick: function () {
                            if (onClick) onClick(this);
                            handlers.selected(this);
                        },
                        optionBoxClick: function () {
                            handlers.bgSelect(this);
                        },
                        documentClick: function () {
                            handlers.selectOff();
                        }
                    }, function () { }),
                    handlers = $.extend({
                        selectOn: function () {
                            this.selectOff();

                            $selectEl.addClass('sPressDown');
                            $optionsEl.show();
                            $("." + hideClass).hide();
                            $(document).one('click', events.documentClick);
                        },
                        selectOff: function () {
                            $("." + hideClass).show();
                            //     $selectEl.unbind('click');
                            $('.selectBox').removeClass('sPressDown');
                            $('.optionsBox').hide();
                        },
                        selected: function (el) {
                            var i = $optionsInnerEl.children('.optionBox').index(el);
                            $optionsInnerEl.children('.optionBox').removeClass('selected');
                            if ($(el)[0].tagName != 'SPAN')
                                $(el).addClass('selected');
                            else
                                $(el).parent().addClass('selected');
                            $sLtEl.text($(el).text());

                            if (
                                thisEvs
                                    && thisEvs.change
                                    && thisEvs.change.length > 0
                            ) {

                                SelectDiv[0].selectedIndex = i;
                                $.each(thisEvs.change, function () {
                                    SelectDiv.one('click', this.handler);
                                    SelectDiv.click();
                                });
                            }
                            SelectDiv[0].selectedIndex = i;

                            this.selectOff();

                        },
                        bgSelect: function (el) {
                            var _this = $(el);
                            var text = _this.text();
                            if (!text) text = _this.next('span').text();
                            var childernel = $('[for=\'' + text + '\']');
                            var cbg1 = childernel.find('.optionBoxBg2');
                            if (cbg1) {
                                cbg1.click();
                            }
                            if (childernel.hasClass('block')) {
                                childernel.removeClass('block').addClass('none');
                                _this.removeClass('optionBoxBg2').addClass('optionBoxBg1');
                            } else {
                                childernel.removeClass('none').addClass('block');
                                _this.removeClass('optionBoxBg1').addClass('optionBoxBg2');
                            }
                            $selectEl.setOptions();
                        }
                    }, function () { });
                /* Options position */
                $.getJSON(url, '', function (d) {
                    if (d) {
                        //初始化div
                        if (onLoadSuccess) onLoadSuccess(d);
                        SelectDiv.append($selectEl.append($sLtEl.text(initName)).append($sRtEl)).append($optionsEl.append($optionsInnerEl));
                        SelectDiv.click(function (event) {
                            event.stopPropagation();
                        });
                        $selectEl.click(events._selectClick);
                        $selectEl.hover(events.selectHover, events.selectNormal);
                        var hasAll = false;
                        //绑定下拉框
                        for (var i = 0, len = d.length; i < len; i++) {
                            var obj = d[i], $optionElbg;
                            if (elmText) obj.text = obj[elmText];
                            if (!nodeElmentClick) {
                                $optionElbg = $View(tpl.optionBg).append().append($View(tpl.optionInner).text(obj.text).attr('node-id', obj.id));
                            } else {
                                $optionElbg = $View(tpl.optionBg).append($View(tpl.optionL)).append($View(tpl.optionInner).text(obj.text).attr('node-id', obj.id)); ;
                                $optionElbg.find('span').click(events.optionClick);
                                $optionElbg.find('.smallbg').click(events.optionBoxClick);
                            }

                            /* Option event */
                            $optionElbg.css({ float: 'left' });
                            //      $optionEl.hover(events.optionHover, events.optionNormal);

                            $optionsInnerEl.append($optionElbg);
                            if (obj.text == initName) {
                                if (nodeElmentClick) {
                                    $optionElbg.find('.smallbg').remove();
                                }
                                hasAll = true;
                                $optionElbg.addClass('selected');
                                $optionElbg.click(events.optionClick);
                            }
                            //else {
                            //    $optionElbg.click(events.optionBoxClick);
                            //    $optionElbg.addClass('optionBoxBg1');
                            //}
                            if (obj.children.length && obj.children.length > 0) {
                                if (!nodeElmentClick) {
                                    $optionElbg.click(events.optionBoxClick);
                                    $optionElbg.addClass('optionBoxBg1');
                                }
                                for (var j = 0, clen = obj.children.length; j < clen; j++) {
                                    var cclen = obj.children[j].children && obj.children[j].children.length, $optionEl
                                    if (elmText) obj.children[j].text = obj.children[j][elmText];
                                    if (cclen && cclen > 0) {
                                        //         $View(tpl.optionL)
                                        $optionEl = $View(tpl.option).append($View(tpl.optionL).css('margin-left', '0px')).append($View(tpl.optionInner).text(obj.children[j].text).attr('node-id', obj.children[j].id));
                                    } else {
                                        $optionEl = $View(tpl.option).append($View(tpl.optionInner).text(obj.children[j].text).attr('node-id', obj.children[j].id));
                                        $optionEl.hover(events.optionHover, events.optionNormal);
                                    }
                                    $optionEl.attr('for', obj.text);
                                    $optionEl.css({ float: 'left' });
                                    $optionEl.addClass('none');
                                    $optionsInnerEl.append($optionEl);

                                    //5/27协作平台分类添加三级时添加,修改
                                    if (cclen && cclen > 0) {
                                        $optionEl.find('span').click(events.optionClick);
                                        $optionEl.find('.smallbg').click(events.optionBoxClick);
                                        //  $optionEl.click(events.optionBoxClick);
                                        for (var k = 0; k < cclen; k++) {
                                            if (elmText) obj.children[j].children[k].text = obj.children[j].children[k][elmText];
                                            var ccobj = obj.children[j].children[k];
                                            var $ccoptionEl = $View(tpl.option).append($View(tpl.optionInner).text(obj.children[j].children[k].text));
                                            $ccoptionEl.attr('for', obj.children[j].text);
                                            $ccoptionEl.css({ float: 'left' });
                                            $ccoptionEl.addClass('none');
                                            $ccoptionEl.hover(events.optionHover, events.optionNormal);
                                            $ccoptionEl.click(events.optionClick);
                                            $optionsInnerEl.append($ccoptionEl);
                                        }
                                    } else {
                                        $optionEl.click(events.optionClick);
                                    }
                                }
                            } else {
                                if (!nodeElmentClick) {
                                    $optionElbg.click(events.optionClick);
                                    $optionElbg.removeClass('optionBoxBg');
                                    $optionElbg.hover(events.optionHover, events.optionNormal);
                                } else {
                                    $optionElbg.find('.smallbg').remove();
                                }
                            }
                        }
                        if (!hasAll) {
                            $optionElbg = $View(tpl.optionBg).append($View(tpl.optionInner).text(initName));
                            $optionElbg.css({ float: 'left' });
                            $optionElbg.click(events.optionClick);
                            $optionElbg.removeClass('optionBoxBg');
                            $optionElbg.addClass('selected');
                            $optionElbg.hover(events.optionHover, events.optionNormal);
                            $optionsInnerEl.prepend($optionElbg);
                        }
                        /* Options position */
                        $selectEl.setOptions = function () {
                            if (config && config.position) {
                                optionsPosition = config.position;
                            }

                            if (config && config.limit) {
                                optionsLimit = config.limit;
                            }

                            $optionsInnerEl.children('.optionBox').css({ float: 'none' });

                            var top,
                                sltPosition = $selectEl.position(),
                                len = $optionsInnerEl.find(' div:not(.smallbg):not(.none) span').length,
                                sltedPosition = $optionsInnerEl.children('.selected').position(),
                                eachOptHeight = $optionsInnerEl.outerHeight() / len,
                                optsHeight = 'auto';

                            if (optionsLimit) {
                                if (optionsLimit != 'auto' && len > optionsLimit) {
                                    optsHeight = Math.round(eachOptHeight) * optionsLimit;
                                } else {
                                    optsHeight = 'auto';
                                }
                            } else {
                                if (len > 7) {
                                    optsHeight = Math.round(eachOptHeight) * 7;
                                } else {
                                    optsHeight = 'auto';
                                }
                            }

                            sltPosition.top = sltPosition.top + $selectEl.outerHeight();

                            $optionsEl.css({ height: Math.round(optsHeight), top: sltPosition.top + 1 });

                            if (
                                optsPosition &&
                                (
                                    $(window).height() + $(document).scrollTop()
                                        <
                                        $optionsEl.offset().top + $optionsEl.outerHeight()
                                )
                            ) {
                                top = sltPosition.top - $optionsEl.outerHeight() - $selectEl.outerHeight() - 3;
                            } else {
                                top = sltPosition.top;
                            }
                            //控制滚动条的位置
                            //  $optionsEl.scrollTop(100);
                            $optionsEl.css({ 'top': top, 'left': sltPosition.left, 'overflow-y': 'auto', 'overflow-x': 'hidden' });

                            if (!optsPosition) {
                                optsPosition = $optionsEl.position();
                            }
                        };
                        /* Render $uiEl */
                        $selectEl.setOptions();
                        $optionsEl.hide();
                        MultiCssSelect.trigger();
                    }
                });
            };
        //12-2添加下拉框渲染完成之后的回调
        MultiCssSelect.susses = function (fn) {
          this.callBack=  this.callBack || [];
             this.callBack.push(fn);
        };
        MultiCssSelect.trigger = function () {
            var c = this.callBack;
            if (c) for (var i = 0, len = c.length; i < len; i++) {
                c[i]();
            }
        }
        var cssSelect = function (config) {
            var optionsPosition;
            if (config) {
                optionsPosition = config.position;
            }

            if ($(this).length <= 0) {
                return false;
            }
            return $(this).each(function () {
                var $thisEl = $(this),
                    $optsEl = $thisEl.children('option'),
                    $uiEl,
                    thisEvs = jQuery.data($thisEl[0], 'events'),
                    uiId = createUiId($thisEl, 'select'),
                    optsWidth = 0,
                    optsPosition,
                    optionsPosition,
                    optionsLimit,

                /* Ui */
                    tpl = {
                        wrapper: '<div class="cssSelect"></div>',
                        select: '<div class="selectBox sNormal"></div>',
                        selectLt: '<div class="selectLt"></div>',
                        selectRt: '<div class="selectRt"></div>',
                        options: '<div class="optionsBox"></div>',
                        optionsInner: '<div class="optionsInnerBox"></div>',
                        option: '<div class="optionBox oNormal"></div>',
                        optionInner: '<span></span>'
                    },

                /* Select box */
                    $selectEl = $View(tpl.select),
                    $sLtEl = $View(tpl.selectLt),
                    $sRtEl = $View(tpl.selectRt),

                /* Options box */
                    $optionsEl = $View(tpl.options),
                    $optionsInnerEl = $View(tpl.optionsInner),

                    init = function () {

                        if (
                            $thisEl.length <= 1
                                && $thisEl.get(0).tagName === 'SELECT'
                                && !$thisEl.attr('multiple')
                                && $thisEl.children('optgroup').length <= 0
                        ) {

                            $uiEl = $View(tpl.wrapper).attr('id', uiId);
                            $('#' + uiId).remove();
                            $thisEl.show();
                            $thisEl.hide();

                            $uiEl.append($selectEl).append($optionsEl.append($optionsInnerEl));
                            $uiEl.click(function (event) {
                                event.stopPropagation();
                            });

                            /* Render select*/
                            $selectEl.append($sLtEl).append($sRtEl);
                            if ($thisEl.attr('disabled')) {
                                $selectEl.addClass('sDisabled');

                                return;
                            }

                            $selectEl.click(events.selectClick);
                            $selectEl.hover(events.selectHover, events.selectNormal);

                            /* Render options*/
                            $optsEl.each(function (i) {
                                var optEl = $(this),
                                    optionTxt = optEl.text(),

                                /* Render option */
                                    $optionEl = $View(tpl.option).append($View(tpl.optionInner).text(optionTxt));

                                /* Option event */
                                $optionEl.css({ float: 'left' });
                                $optionEl.hover(events.optionHover, events.optionNormal);
                                $optionEl.click(events.optionClick);

                                /* Render all options*/
                                $optionsInnerEl.append($optionEl);

                                /* Set selected */
                                if (optEl.val() == $thisEl.val()) {
                                    $sLtEl.text(optionTxt);

                                    /* Set select option */
                                    $optionEl.addClass('selected');
                                }

                            });

                            /* Options position */
                            $thisEl.setOptions = function () {
                                if (config && config.position) {
                                    optionsPosition = config.position;
                                }

                                if (config && config.limit) {
                                    optionsLimit = config.limit;
                                }

                                $optionsInnerEl.children('.optionBox').css({ float: 'none' });

                                var top,
                                    sltPosition = $selectEl.position(),
                                    sltedPosition = $optionsInnerEl.children('.selected').position(),
                                    eachOptHeight = $optionsInnerEl.outerHeight() / $optsEl.length,
                                    optsHeight = 'auto';

                                if (optionsLimit) {
                                    if (optionsLimit != 'auto' && $optsEl.length > optionsLimit) {
                                        optsHeight = Math.round(eachOptHeight) * optionsLimit;
                                    } else {
                                        optsHeight = 'auto';
                                    }
                                } else {
                                    if ($optsEl.length > 5) {
                                        optsHeight = Math.round(eachOptHeight) * 5;
                                    } else {
                                        optsHeight = 'auto';
                                    }
                                }

                                sltPosition.top = sltPosition.top + $selectEl.outerHeight();

                                $optionsEl.css({ height: Math.round(optsHeight), top: sltPosition.top + 1 });

                                if (
                                    optsPosition &&
                                    (
                                        $(window).height() + $(document).scrollTop()
                                            <
                                            $optionsEl.offset().top + $optionsEl.outerHeight()
                                    )
                                ) {
                                    top = sltPosition.top - $optionsEl.outerHeight() - $selectEl.outerHeight() - 3;
                                } else {
                                    top = sltPosition.top;
                                }

                                $optionsEl.scrollTop(Math.round(sltedPosition.top - eachOptHeight));
                                $optionsEl.css({ 'top': top, 'left': sltPosition.left, 'overflow-y': 'auto', 'overflow-x': 'hidden' });

                                if (!optsPosition) {
                                    optsPosition = $optionsEl.position();
                                }
                            };

                            /* Render $uiEl */
                            $thisEl.before($uiEl);
                            $thisEl.setOptions();
                            $optionsEl.hide();
                        }
                    },
                    events = $.extend({
                        selectNormal: function () {
                            $(this).removeClass('sHover');
                        },
                        selectHover: function () {
                            $(this).addClass('sHover');
                        },
                        selectClick: function () {
                            if ($optionsEl.css('display') != 'none') {
                                handlers.selectOff();
                            } else {
                                handlers.selectOn();
                                $thisEl.setOptions();
                            }
                        },
                        optionNormal: function () {
                            $(this).removeClass('oHover');
                        },
                        optionHover: function () {
                            $(this).addClass('oHover');
                        },
                        optionClick: function () {
                            handlers.selected(this);
                        },
                        documentClick: function () {
                            handlers.selectOff();
                        }
                    }, function () { }),
                    handlers = $.extend({
                        selectOn: function () {
                            this.selectOff();

                            $selectEl.addClass('sPressDown');
                            $optionsEl.show();

                            $(document).one('click', events.documentClick);
                        },
                        selectOff: function () {
                            $thisEl.unbind('click');
                            $('.selectBox').removeClass('sPressDown');
                            $('.optionsBox').hide();
                        },
                        selected: function (el) {
                            var i = $optionsInnerEl.children('.optionBox').index(el);
                            $optionsInnerEl.children('.optionBox').removeClass('selected');
                            $(el).addClass('selected');
                            $sLtEl.text($(el).text());

                            if (
                                thisEvs
                                    && thisEvs.change
                                    && thisEvs.change.length > 0
                            ) {

                                $thisEl[0].selectedIndex = i;
                                $.each(thisEvs.change, function () {
                                    $thisEl.one('click', this.handler);
                                    $thisEl.click();
                                });
                            }
                            $thisEl[0].selectedIndex = i;

                            this.selectOff();

                        }
                    }, function () { });

                return init();
            });
        };
        $.fn.extend({
            MultiCssSelect: MultiCssSelect,
            cssSelect: cssSelect
        });
    } (jQuery))
});