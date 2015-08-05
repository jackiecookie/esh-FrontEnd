define(['js/lib/jquery.Zclip/Zclip', 'layer'], function (require, exports, module) {
    require('js/lib/jquery.Zclip/Zclip');
    require('layer');
    $('#Yiker').addClass('cur');
    $('#copy-button').zclip({
        path: '/Static/js/lib/jquery.Zclip/ZeroClipboard.swf',
        copy: function () {
            return $('#YikerWords').val();
        },
        afterCopy: function () {
            alert('拷贝成功!给更多人分享将会获得意外的惊喜 ');
        }
    });

    $('.bdsharebuttonbox a').click(function () {
        var to = $(this).data('cmd');
        if (to != 'more') {
            var url = 'http://s.share.baidu.com/?click=1&url=' + encodeURIComponent('http://www.easysofthome.com') + '&to=' + to + '&title=' + $('#YikerWords').val();
            window.open(url);
        } else {
            $.layer({
                type: 1,
                title: false,
                shift: 'top',
                area: ['auto', 'auto'],
                border:[0],
                page: { dom: '#maorshare' }
            });
        }
    })
});