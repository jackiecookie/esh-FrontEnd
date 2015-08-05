define(function (require, exports, module) {
    //这里有一个可以优化的点 并不是在所有的页面都需要加载全部的点击事件,考虑用require获取对象是实例化加载点击事件
    var url = location.href;
    var alertify = require('alertify');
    var countryObj = $('#country');
    var layer = require('layerExt');
    require('js/app/DataPlatForm/DataplatformNoLoginShow');
    var saveseacher = function () {
        $('.saveseacher').click(function () {
            var str = location.href;
            var num = str.indexOf("?");
            if (num == -1) {
                alertify.alert('请先搜索之后在保存搜索条件');
                return false;
            }
            var para = str.substr(num + 1);
            if (!para) {
                alertify.alert('请先搜索之后在保存搜索条件');
                return false;
            }
            var index = layer.prompt({ title: '本次搜索条件名称?' }, function (name) {
                if (name.length > 50) {
                    alert('长度超过最大限制');
                    return false;
                }
                $.post('/UIData/ashx/SaveSearchPara.ashx', { para: para, country: countryObj.val(), key: countryObj.attr('area'), name: name }, function () {
                    alertify.alert('保存数据成功你可以在会员中心查看已经保存的搜索条件');
                });
                layer.close(index);
            });
            $('#xubox_prompt').attr('placeholder', '例:中国出口美国毛巾100万以上公司');
        });
    };

    var clearSeacher = function () {
        var oriUrl = url.substring(0, url.indexOf("?"));
        $('#clearSeacher').click(function () {
            location.href = oriUrl;
        });
    };
    var Dingyue = function () {
        var isSupplier = $('#IsSupplier').val() == "True";
        var isGys = $('#IsGys').val() == "True";
        var showThreeBtn = !isSupplier && isGys;
        $('.dyfw').click(function () {
            var fnCallBack = function (index, aObj) {

                var self = $(aObj);
                var selfText = self.text();
                var type = !isGys && isSupplier ? 4 : 0;
                switch (selfText) { case '新客户': type = 1; break; case '老客户': type = 2; break; case '已流失的客户': type = 3; break; }
                $.post('/UIData/ashx/SaveSubscrib.ashx', { country: countryObj.val(), key: countryObj.attr('area'), companyName: companyName, type: type, parameter: extPara }, function (d) {
                    if (d == "exist") {
                        alertify.alert(companyName + '公司已经被您订阅了');
                    } else {
                        alertify.alert('您已经订阅了' + companyName + '公司,当有新数据添加是时候我们会通过站内信的方式通知您');
                    }
                });
                layer.close(index);
            };
            var th = $(this);
            var perA = th.parent().prevAll('.td_flag').find('a');
            var companyName = perA.attr('title');
            var extPara = perA.attr('country') || '';
            if (companyName) {
                $.layer({
                    area: ['auto', 'auto'],
                    css: { 'min-width': '250px' },
                    dialog: {
                        msg: showThreeBtn ? companyName + '是您的' : '确定要关注' + companyName + '么',
                        btns: showThreeBtn ? 3 : 2,
                        type: 4,
                        btn: showThreeBtn ? ['新客户', '老客户', '已流失的客户'] : ['确定', '取消'],
                        btnCallBack: fnCallBack,
                        yes: fnCallBack
                    }
                });
            }
        });
    };
    var initgsrange = function () {
        $('.gs-range').on('mouseover', function () {
            $(this).find('p').addClass('show-button');
        }).on('mouseout', function () {
            $(this).find('p').removeClass('show-button');
        });
    };


    function request(paras) {
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {};
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof (returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    }
    function initCurrentChoies() {
        var spanLength = $('#addList a').length;
        if (spanLength == 0) {
            $('.classify .SubCategoryBox:eq(0)').remove();
        }
    };
    $(function () {
        saveseacher();
        initgsrange();
        Dingyue();
        initCurrentChoies();
        clearSeacher();
        (function () {
            var o = request('order');
            if (!o) o = $('#order').val();
            var t = $('[t1=' + o + ']');
            if (o.indexOf('d') != -1) {
                t.removeClass('release_a').addClass('release_b');
            }
        })();
        var searfilterobj = $('#starlist2');
        var height = searfilterobj.height();
        if (height > 30) {
            var activeObj = searfilterobj.find('.active');
            if (activeObj.hasClass('scontent_a')) {
                searfilterobj.css({
                    height: 'auto'
                });
                $('#zk').text('收缩').removeClass().addClass('span1');

            } else {
                searfilterobj.css({
                    height: '30px'
                });
            }
            $('.showmore').click(function () {
                if ($('#zk').hasClass('span1')) {
                    $(this).find('span').text('展开').removeClass().addClass('span');
                    searfilterobj.css({
                        height: '30px'
                    });
                } else {
                    $(this).find('span').text('收缩').removeClass().addClass('span1');
                    searfilterobj.css({
                        height: 'auto'
                    });
                }
            });
        } else {
            $('.showmore').remove();
        }
        $('.boult_a').toggle(function () {
            $(this).html('<i></i>展开').removeClass().addClass('boult_b');
            $('.classify').hide();
        }, function () {
            $(this).html('<i></i>收起').removeClass().addClass('boult_a');
            $('.classify').show();
        });
    });

    var orderFun = function (ckvalue) {
        $('.order').click(function () {
            if (!ckvalue || ckvalue()) {
                var o1 = request('order');
                var o = $(this).attr('t1');
                var t1 = $(this).attr('t');
                if (!o1 && $('#order').val() == o) o = t1;
                var index = url.indexOf('order');
                var hasOrder = o != o1;
                //包含order
                if (index > -1) {
                    if (hasOrder) {
                        var sub1 = url.indexOf('&', index) != -1 ? url.substring(index, url.indexOf('&', index)) : url.substring(index);
                        var newUrl = url.replace(sub1, 'order=' + o);
                    } else {
                        sub1 = url.indexOf('&', index) != -1 ? url.substring(index, url.indexOf('&', index)) : url.substring(index);
                        newUrl = url.replace(sub1, 'order=' + t1);
                    }
                }
                //没包含order
                else
                    newUrl = url.indexOf('?') > -1 ? url + '&order=' + encodeURIComponent(o) : url + '?order=' + encodeURIComponent(o);
                location.href = newUrl;
            }
        });
    };

    module.exports.request = request;
    module.exports.orderFun = orderFun;
});
