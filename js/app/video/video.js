define(function (require, exports, module) {
    var layer = require('layerExt');
    $(function () {
        $('.videoDiv').click(function () {
            var videoId = $(this).attr("data-type");
           $.layer({
                    type: 2,
                    title: false,
                    area: ['917px', '717px'],
                    fix: false,
                    border: [0],
                    fadeIn: 300,
                    offset: [($(window).height() - 717) / 2 + 'px', ''], //上下垂直居中
                    iframe: { src: '/Video.aspx?videoId=' + videoId }
                  
                });
          
        });

    });
});