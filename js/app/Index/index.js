define(function (require, exports, module) {
    /*=====================banner引用开始======================= */
    require('js/lib/jquery.jcarousel/jcarousel.js');
    require('js/lib/jquery.jcarousel/jcarouselAutoscroll.js');
    require('js/lib/jquery.jcarousel/jcarouselControl.js');
    require('js/lib/jquery.jcarousel/jcarouselPagination.js');
    /*=====================banner引用结束======================= */
    var headjs = require('headJs');
    var isShowNguide = $('#IsShowNguide');

    $(function () {
        /*=====================banner开始======================= */
        var debounce = function (func, threshold, execAsap) {
            var timeout;
            return function debounced() {
                var obj = this, args = arguments;

                function delayed() {
                    if (!execAsap) {
                        func.apply(obj, args);
                    }
                    timeout = null;
                }
                if (timeout) {
                    clearTimeout(timeout);
                } else if (execAsap) {
                    func.apply(obj, args);
                }

                timeout = setTimeout(delayed, threshold || 100);
            };
        };
        // smartresize
        jQuery.fn.smartresize = function (fn) { return fn ? this.bind('resize', debounce(fn)) : this.trigger('smartresize'); };
        var $jcarousel = $('.jcarousel');
        $jcarousel.find("li").width($(window).width());
        $jcarousel.jcarousel({
            wrap: 'circular',
            transitions: false
        });
        $jcarousel.jcarouselAutoscroll({
            autostart: true,
            interval: 3000
        });
        $('.jcarousel-control-prev').jcarouselControl({
            target: '-=1'
        });
        $('.jcarousel-control-next').jcarouselControl({
            target: '+=1'
        });
        $('.jcarousel-pagination').on('click', 'a', function (e) {
            e.preventDefault();
        })
                    .on('jcarouselpagination:active', 'a', function () {
                        $(this).addClass('active');
            })
                    .on('jcarouselpagination:inactive', 'a', function () {
                        $(this).removeClass('active');
                    })
                  
                    .jcarouselPagination({
                        item: function (page) {
                            return '<a href="#' + page + '"></a>';
                        }
                    });
        $(window).smartresize(function () {
            $jcarousel.find("li").width($(window).width());
        });
        /*=====================banner结束======================= */

    });

    if (isShowNguide[0] && isShowNguide.val() == '1') {
        require.async(['js/common/nguide/nguide'], function (ng) {
            $(function () {
                var nguide = ng.nguide;
                headjs.bindCreateHeadElmFn(function () {
                    nguide.call(nguide, {
                        steps: [
                        {
                            target: '#mcLink',
                            content: '请进入会员中心完善基本信息和实名认证,当你完善基本资料我们会开放更多的免费花型和更多的服务,当你实名认证通过以后将会有更多的惊喜等着你',
                            placement: 'bottom',
                            width: '250',
                            offset: { x: -120 }
                        }
                    ],
                        prefix: 'NG-Hhgg-',
                        bgclass: 'indexnguidebg'
                    });
                })
            });
        });

    }

    var j = 0;
    exports.mOver = function (obj, i) {
        if (!$(obj).is(':animated')) {
            if (j != i) {
                if (i == 1) {
                    document.getElementById('001').innerHTML = "单色花型、双色花型、三色花型、四色花型、四色以上花型多种分类定期大量花型数据更新，发布最新花型流行趋势，实现在线花型购买" + '<br/>' +
                            '<a href="UIDesign/FabricMore/">' + "面料" + '</a>' + '&nbsp;&nbsp;&nbsp;' +
                            '<a href="UIDesign/FlowerMore/">' + "花型" + '</a>' + '&nbsp;&nbsp;&nbsp;' +
                            '<a href="UIDesign/QualityMore/">' + "品质样" + '</a>';
                    document.getElementById('002').innerHTML = "用户可随意选择进行设计，并可方便直观地全三维查看设计成果";
                    document.getElementById('003').innerHTML = "全球60多个国家，50多家协会和商会，以及10多家展会数据";
                    document.getElementById("001").style.fontSize = "13px";
                    document.getElementById("002").style.fontSize = "12px";
                    document.getElementById("003").style.fontSize = "12px";
                    document.getElementById("001").style.width = "60%";
                    document.getElementById("002").style.width = "100%";
                    document.getElementById("003").style.width = "100%";
                    document.getElementById("001").style.Margintop = "20px";
                    document.getElementById("002").style.Margintop = "0px";
                    document.getElementById("003").style.Margintop = "0px";
                }
                if (i == 2) {
                    document.getElementById('001').innerHTML = "专用于家纺设计的海量面料花型库";
                    document.getElementById('002').innerHTML = "拥有所有常见家纺产品的款式，用户可随意选择进行设计，并可方便直观地全三维查看设计成果。同时还有上千种辅料，包括花边、吊坠、装饰绳等，供用户挑选搭配并实时装配到产品上" + '<br/>' +
                    //'<a href="javascript:void(0);">' + "云渲染" + '</a>' + '&nbsp;&nbsp;&nbsp;' +
                            '云渲染 &nbsp;&nbsp;&nbsp;' +
                            '<a href="UIDesign/SwMore/">' + "三维成品" + '</a>';
                    document.getElementById('003').innerHTML = "全球60多个国家，50多家协会和商会，以及10多家展会数据";
                    document.getElementById("001").style.fontSize = "12px";
                    document.getElementById("002").style.fontSize = "13px";
                    document.getElementById("003").style.fontSize = "12px";
                    document.getElementById("001").style.width = "100%";
                    document.getElementById("002").style.width = "60%";
                    document.getElementById("003").style.width = "100%";
                    document.getElementById("001").style.Margintop = "0px";
                    document.getElementById("002").style.Margintop = "20px";
                    document.getElementById("003").style.Margintop = "0px";
                }
                if (i == 3) {
                    document.getElementById('001').innerHTML = "专用于家纺设计的海量面料花型库";
                    document.getElementById('002').innerHTML = "用户可随意选择进行设计，并可方便直观地全三维查看设计成果";
                    document.getElementById('003').innerHTML = "汇聚了来源于六十多个国家的进出口贸易数据、全球20多家纺织和家纺行业协会和30多家纺织和家纺商会，以及10多家国际知名展会的数据，而且所有数据都根据纺织行业的规则进行了规范和整理，确保数据的真实性、准确性、全面性和详尽性" + '<br/>' +
                            '<a href="DataPlatform/Index">' + "数据查询" + '</a>' +
                            '&nbsp;&nbsp;&nbsp;<a href="Company/CHNseller">' +
                            "中国供应商库" + '</a>&nbsp;&nbsp;&nbsp;<a href="Company/globalBuyer">' +
                            "全球买家库</a>";
                    document.getElementById("001").style.fontSize = "12px";
                    document.getElementById("002").style.fontSize = "12px";
                    document.getElementById("003").style.fontSize = "13px";
                    document.getElementById("001").style.width = "100%";
                    document.getElementById("002").style.width = "100%";
                    document.getElementById("003").style.width = "60%";
                }
                j = i;
                $(obj).animate({ width: '44.9%' }, 300).siblings().animate({ width: '20%' }, 300);
            }
            j = i;
        }
    };
});