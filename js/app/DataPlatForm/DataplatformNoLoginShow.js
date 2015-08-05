define(function (require, exports, module) {
    var headjs = require('headJs');
    require.async(['js/common/nguide/nguide'], function (ng) {
        var nguide = ng.nguide;
        headjs.bindCreateHeadElmFn(function () {
            if (!headjs.loginInfoisLogin) {
                nguide.call(nguide, {
                    steps: [
                        {
                            target: '.headloginbtn',
                            content: '对不起您目前没有登录,我们对数据进行了特殊的处理,当你顺利登录之后就能查看到完整的数据了',
                            placement: 'bottom',
                            width: '250',
                            offset: { x: -140 }
                        }
                    ],
                    prefix: 'NG-Hhgg-',
                    bgclass: 'indexnguidebg',
                    id: 'dataPlatform'
                });
            };
        });
    });
});