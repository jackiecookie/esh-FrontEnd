define(['js/common/AliControls/control', 'css/common/AliControls/acount.css'], function (require, exports, module) {
    
    var Alipw = require('js/common/AliControls/control');
  

    var account = new Object();
    var imgid;
    account.currentAvatar = ['/Static/Images/MemberImg/default_family.jpg'];
    account.presetAvatars = [
    '1|/Static/Images/MemberImg/default_beauty.jpg',
    '1|/Static/Images/MemberImg/default_trade.jpg',
    '1|/Static/Images/MemberImg/default_handsome.jpg',
    '1|/Static/Images/MemberImg/default_colleagues.jpg',
    '1|/Static/Images/MemberImg/default_family.jpg',
    '1|/Static/Images/MemberImg/default_friend.jpg'
];
    if (window.ComponentRenderer) {
        ComponentRenderer.renderAll();
    }


    Alipw.importClass('Alipw.Window', 'Alipw.Msg');

    account.setAvatar = function (thid) {

        imgid = thid;
        var win = new Alipw.Window({
            id: 'window_setavatar',
            width: 630,
            height: 330,
            modal: true,
            resizable: false,
            cls: 'aliyun-standard-window uitabwindow'
        });

        var header = win.el.find('.' + win.baseCls + '-header');
        var appendStr = '';
        if ($('#isgexing').val() == 1) appendStr = '<a hidefocus="true" href="#">个性头像编辑</a>';
        var layoutText = $('#layoutText1').val();
        header.append([
			'<div class="uitabwindow-tab">',
				'<a hidefocus="true" href="#" class="uitabwindow-on">' + layoutText + '</a>',
        //'<a hidefocus="true" href="#">网络头像编辑</a>',
				appendStr,
			'</div>'
        ].join(''));

        header.find('.uitabwindow-tab').bind('mousedown', function (e) {
            e.stopPropagation();
        });
        win.appendChild($([
            '<div class="uitabwindow-tabcontent">',
            '<form class="form_submitLocalImage" method="post" enctype="multipart/form-data" action="' + $('#actionUrl').val() + '" target="uploadImageIframe">',
					'<input type="hidden" name="type" value="local"/>',
                    	'<input type="hidden" name="imgid" value="' + imgid + '"/>',
					'<input name="sec_token" type="hidden" value="' + account.token + '" />',
					'<div class="setavatar-container-small">',
						'<div class="tgrey" style="padding-bottom:8px;">' + $('#layoutText').val() + '</div>',
                        '<input type="hidden" name="userId" value="' + $('#userId').val() + '"/>',
						'<input type="text" class="fm-text fm-text-tip" disabled="disabled" value="选择图片文件" readonly="readonly" style="width:325px; margin-right:5px;"/><a class="btn btn-white inlineblock setavatar-browse"><span>浏览</span><input name="localImage" type="file" size=0 hidefocus="true" /></a>',
						'<div class="tgrey" style="padding-top:5px;">支持jpg/gif/png格式图片，文件需小于' + $('#FileSize').val() + 'M</div>',
					'</div>',
					'<div class="setavatar-buttons">',
						'<a href="#" class="id_backbtn left btn btn-white mr10"><span>返回</span></a>',
						'<button class="btn btn-fmsubmit btn_submitLocalImage">提交</button>',
					'</div>',
				'</form>',
				'<iframe name="uploadImageIframe" style="position:absolute; left:-9999px; top:-9999px;"></iframe>',
			'</div>',
        /*
        '<div class="uitabwindow-tabcontent" style="display:none;">',
        '<div class="setavatar-container-small">',
        '<div class="tgrey" style="padding-bottom:8px;">将网络图片的链接地址复制到以下框内</div>',
        '<input autotip="如：http://www.aliyun.com/xxx/xxx.jpg" type="text" name="webImage" class="fm-text input_submitInternetImage" style="width:325px; margin:0"/>',
        '<div class="tgrey" style="padding-top:7px;">支持jpg/gif/png格式图片，文件需小于2M</div>',
        '</div>',
        '<div class="setavatar-buttons">',
        '<a href="#" class="id_backbtn left btn btn-white mr10"><span>返回</span></a>',
        '<button class="btn btn-fmsubmit btn_submitInternetImage">提交</button>',
        '</div>',
        '</div>',
        */
			'<div class="uitabwindow-tabcontent" style="display:none;">',
				'<div class="setavatar-container">',
					'<div style="padding-bottom:10px;">从个性头像库里选择一张图片作为头像</div>',
					'<div class="setavatar-pictures">',
						(function () {
						    if (!imgid) {
						        var html = '';
						        for (var i = 0, len = account.presetAvatars.length; i < len; i++) {
						            var arr = account.presetAvatars[i].match(/^([^\|]+)\|(.*)$/);
						            var id = arr[1];
						            var picurl = arr[2];
						            html += '<a avatarid="' + id + '" href="#"><img src="' + picurl + '" /></a>';
						        }

						        return html;
						    } else
						        return '';
						})(),
					'</div>',
					'<div class="setavatar-preview">',
						'<img src="' + account.currentAvatar + '" />',
						'<span>头像预览</span>',
					'</div>',
				'</div>',
				'<div class="setavatar-buttons">',
					'<a href="#" class="id_backbtn left btn btn-white mr10"><span>返回</span></a>',
					'<button class="btn btn-fmsubmit btn_submitPresetImage">提交</button>',
				'</div>',
			'</div>'
        ].join('')));

        var tabContents = win.getBody().find('.uitabwindow-tabcontent');
        var previewImage = win.getBody().find('.setavatar-preview img');
        var input_submitInternetImage = win.getBody().find('.input_submitInternetImage');
        account.renderAutoInputTip(input_submitInternetImage, 'autotip', 'fm-text-tip');
        win.getBody().find('.id_backbtn').click(function (e) {
            e.preventDefault();
            win.close();
        });

        var selectedAvatarId, selectedAvatarURL;

        header.find('.uitabwindow-tab a').each(function (index, el) {
            var $el = $(el);
            $el.click(function (e) {
                e.preventDefault();
                $el.addClass('uitabwindow-on').siblings().removeClass('uitabwindow-on');
                tabContents.hide();
                $(tabContents[index]).show();
            });
        });

        var browseBtn = win.el.find('.setavatar-browse');
        browseBtn.find('input').change(function (e) {
            browseBtn.prev().val(e.currentTarget.value).removeClass('fm-text-tip');
        });

        win.el.find('.btn_submitLocalImage').click(function () {
            var indicator = Alipw.Msg.tip('正在提交，请稍后...', { id: 'loadingIndicator', timeout: 0, modal: true, iconCls: 'msg-icon-loading' });
            win.el.find('.form_submitLocalImage').submit();
            //$.ajax({
            //    type: "POST",
            //        url: '/Member/ashx/UploadHeadImg.ashx',
            //    cache: false,
            //    data: {
            //        Filedata: win.el.find('.form_submitLocalImage').find('[name=localImage]').val(),
            //        type: 'web'
            //    },
            //    dataType: 'text',
            //    success: function (response) {
            //        indicator.close();
            //        if (response && response.status == 1) {
            //            Alipw.Msg.tip('提交成功！');
            //            win.close();
            //            window.location.reload();
            //        } else {
            //            if (response && response.errorMessage) {
            //                Alipw.Msg.alert('错误', response.errorMessage, null, {
            //                    iconCls: 'alipw-icon-msg-error'
            //                });
            //            }
            //        }
            //    },
            //    error: function () {
            //        indicator.close();
            //        Alipw.Msg.alert('错误', '提交失败！请重试', null, {
            //            iconCls: 'alipw-icon-msg-error'
            //        });
            //    }
            //});
        });

        win.el.find('.btn_submitInternetImage').click(function () {
            var indicator = Alipw.Msg.tip('正在提交，请稍后...', { timeout: 0, modal: true, iconCls: 'msg-icon-loading' });
            $.ajax({

                url: '/Member/ashx/UploadHeadImg.ashx',
                cache: false,
                data: {
                    imageUrl: input_submitInternetImage.val(),
                    type: 'web'
                },
                dataType: 'json',
                success: function (response) {
                    indicator.close();
                    if (response && response.status == 1) {
                        Alipw.Msg.tip('提交成功！');
                        win.close();
                        window.location.reload();
                    } else {
                        if (response && response.errorMessage) {
                            Alipw.Msg.alert('错误', response.errorMessage, null, {
                                iconCls: 'alipw-icon-msg-error'
                            });
                        }
                    }
                },
                error: function () {
                    indicator.close();
                    Alipw.Msg.alert('错误', '提交失败！请重试', null, {
                        iconCls: 'alipw-icon-msg-error'
                    });
                }
            });
        });

        win.el.find('.btn_submitPresetImage').click(function () {
            if (!Alipw.isSet(selectedAvatarId)) {
                Alipw.Msg.alert('提示', '请选择一个头像！');
                return;
            }

            var indicator = Alipw.Msg.tip('正在提交，请稍后...', { timeout: 0, modal: true, iconCls: 'msg-icon-loading' });
            $.ajax({
                url: '/Member/ashx/UploadHeadImg.ashx',
                cache: false,
                data: {
                    imageUrl: selectedAvatarURL,
                    type: 'static',
                    userId: $('[name=userId]').val()
                },
                dataType: 'json',
                success: function (response) {
                    indicator.close();
                    if (response && response.Success) {
                        Alipw.Msg.tip('提交成功！');
                        win.close();
                        document.getElementById('avatar_img').src = selectedAvatarURL;
                    } else {
                        if (response && response.errorMessage) {
                            Alipw.errorMessage.alert('错误', response.errorMessage, null, {
                                iconCls: 'alipw-icon-msg-error'
                            });
                        }
                    }
                },
                error: function () {
                    indicator.close();
                    Alipw.Msg.alert('错误', '提交失败！请重试', null, {
                        iconCls: 'alipw-icon-msg-error'
                    });
                }
            });

        });

        win.el.find('.setavatar-pictures').delegate('a', 'click', function (e) {
            e.preventDefault();
            var $el = $(e.currentTarget);
            $el.addClass('setavatar-selected').siblings().removeClass('setavatar-selected');
            previewImage.attr('src', $el.find('img').attr('src'));
            selectedAvatarId = $el.attr('avatarid');
            selectedAvatarURL = $el.find('img').attr('src');
        });
        //   });
    }


  



    

    account.submitForm = function (source) {
        var element = source;
        getFormToSubmit();
        function getFormToSubmit() {
            if (element.nodeName == 'FORM') {
                $(element).submit();
            } else if (element == document.body) {
                throw 'cannot find form';
            } else {
                element = element.parentNode;
                getFormToSubmit();
            }
        }
    };

    account.renderAutoInputTip = function (el, tipAttr, tipCls) {
        var $el = $(el);
        var tipText = $el.attr(tipAttr);
        if (!tipText) return;

        if ($el.val() == '') {
            $el.addClass(tipCls);
            $el.val(tipText);
        }

        $el.bind('focus', function (e) {
            $el.removeClass(tipCls);
            if ($el.val() == tipText) {
                $el.val('');
            }
        });

        $el.bind('blur', function (e) {
            if ($el.val() == '' || $el.val() == tipText) {
                $el.addClass(tipCls);
                $el.val(tipText);
            }
        });
    }
    module.exports = account;
});

