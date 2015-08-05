define(['$.cookie', 'laytpl', 'js/lib/jquery.switchable/jquery.switchable'], function (require, exports, module) {
    require('$.cookie');var   tpl = require('laytpl'),  introduce, cookieKey,
    litmpl = [
        '<li class="{{d.itemclassName}}-0{{i+1}} pdt40" style="display: none;"><div class="hd1"><h4>{{d[i].title}}</h4>{{d[i].hdinnerhtml}} </div>',
        '<div class="bd con clearfix mt50">',
        ' <div class="pic1"><img src="{{d[i].picurl}}"></div>',
        '<div class="desc1">',
        ' <div class="action tc">',
        '{{# for(var j = 0, action_aBtnlen = d[i].action_aBtn.length; j < action_aBtnlen; j++){ }}<a class="btn btn-start" href="{{d[i].action_aBtn[j].url}}" target="_blank"><span>{{d[i].action_aBtn[j].text}}</span></a>{{# } }} ',
        '</div> ',
        '</div></div></li>'
    ].join('');
    module.exports = function (option) {
        var items = option.items; cookieKey = option.cookieKey || 'url';
        items.hidedText = option.hidedText;
        items.itemclassName = option.itemclassName;
        renderTmpl(items, option.litmpl || litmpl, function (h) {
            $('.header').after(h);
            require('js/lib/jquery.switchable/jquery.switchable');
            $(".J_slide .panel li").switchable({
                thumbObj: ".J_slide .trigger a",
                botPrev: ".J_slide .btn-prev",
                botNext: ".J_slide .btn-next"
            });
            introduce = $(".introduce"); //幕布
            //关闭开幕布
            introduce.on("click", ".close", function () {
                closeIntroduce();
            });
            introduce.on("click", ".jiantou", function () {
                openIntroduce();
            });
            option.triggercss && introduce.find('.trigger').css(option.triggercss);
            if ($.cookie(cookieKey) != '1') {
                //打开幕布
                openIntroduce();
            } else {
                closeIntroduce();
            }
            $("html, body").animate({
                scrollTop: 0
            }, 600);
        });
    };

    function renderTmpl(items,litmpl, fn) {
        var tmpl = ['<div class="introduce J_slide">',
               '<div class="hd hidedshow "><div class="s-banner">{{d.hidedText}} </div></div>',
                '<ul class="panel">{{# for(var i = 0, len = d.length; i < len; i++){ }}',
                litmpl,
                    '{{# } }}  </ul>',
                    '<div class="trigger tc mt20 none"><a href="javascript:;" class="now"></a><a href="javascript:;" ></a></div>',
                    '<a class="btn-prev none" href="javascript:;"></a><a class="btn-next none" href="javascript:;"></a><a class="close n none" href="javascript:;"></a>',
                     '</div>'].join('');
        tpl(tmpl).render(items, fn);
    }



    //关闭幕布
    function closeIntroduce() {
        $.cookie(cookieKey, '1');
        introduce.find('.hidedshow').addClass('nav-default');
        introduce.find('.s-banner').show();
        introduce.find('.block').addClass('none').removeClass('block');
        introduce.animate({
            "height": 75
        }, 600, null, function () {
            introduce.find('.panel').hide();
        });
    }
    //打开幕布
    function openIntroduce() {
        $.cookie(cookieKey, null);
        introduce.find('.panel').show();
        introduce.find('.hidedshow').removeClass('nav-default');
        introduce.animate({
            "height": 609
        }, 600, null, function () {
            introduce.find('.s-banner').hide();
            introduce.find('.none').addClass('block').removeClass('none');
        });
    }

});