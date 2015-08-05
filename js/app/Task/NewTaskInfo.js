define(['js/common/Eshwindow/eshwindow', 'js/common/procopy/procopy', 'js/common/UpLoad/UpLoadJs',
'js/common/Tip/Tip', 'js/common/btnLoading/btnLoading', 'js/common/verify/verify', 'js/common/pager/pager', 'alertify'], function (require, exports, module) {
    var ZDK = require('js/common/procopy/procopy');
    ZDK.upload = require('js/common/UpLoad/UpLoadJs');
    ZDK.Tips = require('js/common/Tip/Tip');
    ZDK.btnloading = require('js/common/btnLoading/btnLoading');
    ZDK.verify = require('js/common/verify/verify');
    ZDK.window = require('js/common/Eshwindow/eshwindow');
    var pager = require('js/common/pager/pager');
    var alertify = require('alertify');
    var loginInfo = require('headJs').loginInfo;
    function timer(time, onTicking, ended) {
        var time = time || {};
        var d = time.d ? parseInt(time.d) : 0;
        var h = time.h ? parseInt(time.h) : 0;
        var m = time.m ? parseInt(time.m) : 0;
        var s = time.s ? parseInt(time.s) : 0;
        s += d * 24 * 3600 + m * 60 + h * 3600;
        if (s == 0) {
            return false;
        }
        var ticker = 0;
        var isobj = time.format == "object" ? true : false;
        function convert2hms(s) {
            var d = Math.floor(s / (24 * 3600));
            s -= d * 24 * 3600;
            var h = Math.floor(s / 3600);
            s -= h * 3600;
            var m = Math.floor(s / 60);
            s -= m * 60;
            return {
                d: d,
                h: h,
                m: m,
                s: s
            };
        }
        var i = setInterval(function () {
            s--;
            var cur = (isobj == true ? convert2hms(s) : s);
            if (onTicking) {
                onTicking.call(i, cur);
            }
            if (s == 0) {
                clearInterval(i);
                if (ended) {
                    ended.call(i, cur);
                }
            }
        }, 1000);
        return i;
    }
    var timeI;
    $.fn.tasktimer = function () {
        if (timeI) clearInterval(timeI);
        var difftime = $(this).attr('data-difftime');
        if (difftime < 0) {
            timeEnd();
            return;
        }
        var timernumtag = $(this).attr('data-timernumtag') || 'em';
        if (!difftime) return;
        var obj = $(this);
        timeI = timer({ s: difftime, format: "object" }, function (time) {
            var time_html;
            time_html = time.d > 0 ? time.d + "天" : "";
            time_html += time.h > 0 ? time.h + "小时" : "";
            time_html += time.m > 0 ? time.m + "分" : "";
            time_html += time.s + "秒";
            $(timernumtag, obj).html(time_html);
        }, function (time) {
            timeEnd();
            //$('.taskmode-clock').html("已到期");
            //location.reload();
        });
    };

    var timeEnd = function () {
        $('.taskmode-clock').html("已到期");
    };

    var flag;
    var extraInfoUploadData = {};
    function uploadTradeMarkFile() {
        var trademarkUploadBtn = $('#j-trademark-file');
        var progress = $('#make-filelist');

        var uploadCache = {};



        var trademarkUpload = ZDK.upload({
            target: trademarkUploadBtn,
            no: false,
            uploadURI: '/UITask/ashx/Demand/upLoadAttachment.ashx',
            progressURI: '/UITask/ashx/Demand/progressUpLoadFile.ashx',
            tips: function (msg) {
                try {
                    ZDK.Tips(msg, 3000, "warning");
                } catch (e) {
                    alert(msg);
                }
            },
            creatProgressID: function () {
                return ZDK.uuid() + Math.random() + ZDK.uuid();
            },
            file_size_limit: true
        });

        trademarkUpload.on('onprogresreading', function (data) {
            if (!uploadCache[data.progress]) {
                var li = $('<li class="clearfix" data-pid="' + data.progress + '"><p class="file clearfix"><span class="fl">' + data.name + '</span><a href="javascript:;"   action-type="cancel">删除</a></p><div class="adding clearfix"><p class="adifile"><span style="width:0%"></span></p><p class="fl">正在上传中....</p></div></li>').appendTo(progress);
                uploadCache[data.progress] = li;
            }
            window.console && console.log('up_start', data);
            flag = false;
        });
        trademarkUpload.on('onprogresing', function (data) {

            var cac = uploadCache[data.progress];
            var c = ((data.uploaded / data.total) * 100).toFixed(2) + '%';
            cac.find('p.fl').html('上传' + c);
            cac.find('p.adifile span').css('width', c);

            flag = false;
        });
        trademarkUpload.on('onprogresed', function (data) {
            var cac = uploadCache[data.progress];

            var imgSrc = data.url;

            cac.find('p.fl').html('上传成功!');
            cac.find('p.adifile span').css('width', '100%');
            cac.find('div').hide();
            cac.addClass("tsuc");
            cac.find('p.file a').attr("del-val", data.url);

            extraInfoUploadData[data.progress] = imgSrc;
            updateInput();
            flag = true;
        });
        trademarkUpload.on('onprogresreadqueue', function (data) {
            if (!uploadCache[data.progress]) {
                var li = $('<li data-pid="' + data.progress + '"><p class="file clearfix"><span class="fl uploadfilename">' + data.name + '</span><a href="javascript:;"  style="display:none;" action-type="cancel">删除</a></p><div class="adding clearfix"><p class="adifile"><span style="width:0%"></span></p><p class="fl">正在上传中....</p></div></li>').appendTo(progress);
                // var li = $('<li class="clearfix" data-pid="' + data.progress + '"><p class="file clearfix"><span class="fl">' + data.name + '</span><a href="javascript:;" style="display:none;" action-type="del">删除</a></p><div class="adding clearfix"><p class="adifile"><span style="width:0%"></span></p><p class="fl">正在上传中....</p><a href="javascript:;" class="fr" action-type="cancel">取消</a></div></li>').appendTo(progress);
                uploadCache[data.progress] = li;
            }
            window.console && console.log('up end', data);
            flag = false;
            //上传失败，出现错误的时候回调
        });
        trademarkUpload.on('onprogresserror', function (data, cac) {
            if (cac = uploadCache[data.progress]) {
                cac.find('p.fl').html('上传失败').css('color', 'red');
            }
            flag = false;
            //取消上传的时候回调
        });
        trademarkUpload.on('oncancelupload', function () {
        });
        function delcancel(li, e) {
            var key = li.attr("data-pid");
            trademarkUpload.onCancelUpload(key);
            li.remove();
            delete extraInfoUploadData[key];
            updateInput();
            if (!e) return false;
        }
        progress.delegate("a", "click", function (e) {
            if ($(this).attr("action-type") == "cancel") {
                delcancel($(this).parents("li"), $(this));
            }
        });

        function updateInput() {
            var inputVal = [];
            $.each(extraInfoUploadData, function (key, val) {
                inputVal.push(val);
            });

            $('#extraInfoUploadInput').val(inputVal.join('-,'));
        }
    }

    var DemandTail = {
        Init: function () {
            DemandTail.initCluebar();
            DemandTail.initVcode();
            DemandTail.initTenderSubmit();
        },
        initVcode: function () {
            $("#cdimg").click(function () {
                $('#cdimg').attr('src', "/validateCode.hxl?t=4&n=" + new Date().getTime().toString()); return false;
            });
            $('#cdimg').attr('src', "/validateCode.hxl?t=4&n=" + new Date().getTime().toString());
        },
        initCluebar: function () {
            var currentState = $('#demandState').val(),
            currentState =currentState&& parseInt(currentState),
            istrusteeship = $('#demandState').attr('ISTRUSTEESHIP'),
            trusteeshipStr = '   <li class="{0}"><span class="stepno">{1}</span><p>托管赏金<br>&nbsp;&nbsp;&nbsp;</p></li>',
            currul = $('ul.ullen7'),
            changNumberLi,
            ct,
            iswc = false,
            ifgb = false;
            if (istrusteeship == '1') {
                trusteeshipStr = trusteeshipStr.replace('{0}', '').replace('{1}', '<span class="gou"></span>');
                currul.find('li:eq(0)').after($(trusteeshipStr));
                changNumberLi = currul.find('li:gt(1)');
                $('.modecont').addClass('ullen7-curstep' + (parseInt(currentState) + parseInt(1)));
            } else {
                trusteeshipStr = trusteeshipStr.replace('{0}', 'gray').replace('{1}', '4');
                currul.find('li:eq(2)').after($(trusteeshipStr));
                changNumberLi = currul.find('li:gt(0)');
                $('.modecont').addClass('ullen7-curstep' + currentState);
            }
            ct = currentState == 1 ? 0 : currentState;
            if (currentState == 4) {
                iswc = true;
            } else if (currentState > 4 && currentState <= 6) {
                if (currentState == 5) {
                    iswc = true;
                } else {
                    ct = 3;
                    ifgb = true;
                }
                $('#guanbiOrwc').html(' 交易关闭<br/>&nbsp;&nbsp;&nbsp;');
                $('#isysfk').html(' 已经申请退款<br/>&nbsp;&nbsp;&nbsp;');
            }
            for (var i = changNumberLi.length - 1, flag = 7, currIsFlag = false; i >= 0; i--, flag--) {
                if (iswc || currIsFlag) {
                    $(changNumberLi[i]).removeClass('gray');
                    $(changNumberLi[i]).find('.stepno').html('<span class="gou"></span>');
                } else {
                    if (i == ct) {
                        $(changNumberLi[i]).removeClass('gray').addClass('cur');
                        $(changNumberLi[i]).find('.stepno').text(flag);
                        currIsFlag = true;
                    } else {
                        $(changNumberLi[i]).find('.stepno').text(flag);
                    }
                }
            }
        },
        initTenderSubmit: function () {
            var submitBtn = $('#caseSubmit'),
            form = $('#j-replay-model-form');
            var forbidmask = $('.forbidmask');
            if (!forbidmask[0]) {
                this.on('beforesubmit', function (evt) {
                    return DemandTail.initVerifyForm();
                });
                this.addFormEvent(form, submitBtn);
            } else {
                submitBtn.click(function () {
                    ZDK.Tips('无法接受您的投标', 3000, 'warning');
                    return false;
                });
            }
        },
        initVerifyForm: function () {
            var context = $('#j-bidcontent').val();
            if (!context) {
                ZDK.verify.fn.errortips(
                   $('#j-bidcontent'),
                   null,
                   '请填写竞标内容',
                   'context'
               );
                return false;
            }

            var annexNum = $("#make-filelist").children("li").size();
            if (annexNum == 0) {
                if (confirm("您没有提交附件，是否继续？")) {
                } else
                    return false;
            };
            var vcode = $('#catcha').val();
            if (!vcode) {
                ZDK.verify.fn.errortips(
                 $('#catcha'),
                 null,
                 '输入验证码',
                 'vcode'
             );
                return false;
            }
        },
        startSubmit: function (btn) {
            this.submiting = 1;
            ZDK.btnloading({
                obj: btn,
                addClass: "disabled"
            });
        },
        endSubmit: function (btn) {
            this.submiting = 0;
            btn.removeClass('disabled');
            ZDK.btnloading.reset(btn);
        },
        addFormEvent: function (formObj, btnObj) {
            var self = this;
            btnObj.on('click', doSubmit);
            $(window).on('hideloginwindow', function () {
                self.endSubmit(btnObj);
            });



            function doSubmit(evt) {
                if (evt && evt.preventDefault)
                    evt.preventDefault();
                if (self.submiting == 1) {
                    return false;
                }

                self.startSubmit(btnObj);

                var rs = self.trigger('beforesubmit', [], 1);
                for (var i = 0; i < rs.length; i++) {
                    if (typeof rs[i] != 'undefined' && rs[i] === false) {
                        self.endSubmit(btnObj);
                        return false;
                    }
                }

                var callback = 'logopubcallback' + (+new Date);
                formObj.attr('action', '/UITask/ashx/Demand/SetTender.ashx?' + 'jsonpcallback=' + callback);
                window[callback] = function (json) {
                    if (json.state > 0) {
                        ZDK.Tips('保存成功', 2000, "success");
                        self.endSubmit(btnObj);
                        location.href = json.msg;
                    } else {
                        if (json.state == -1) {
                            self.endSubmit(btnObj);
                            ZDK.Tips($.trim(json.msg), 2000, "warning");
                            $('#cdimg').attr('src', "/validateCode.hxl?t=4&n=" + new Date().getTime().toString());
                            return;
                        }
                        alert(json.msg);
                        self.endSubmit(btnObj);
                    }
                };
                formObj.submit(); //提交
            }
        }
    };
    //投标详情
    var helper = {
        isZb: 0,
        yzbCount: 0,
        ZbDivAdded: false,
        filter: 0,
        order: 1,
        PAGE_SIZE: 5,
        Page_Index: 1,
        currPageIndex: 1,
        cuDemandmn: '',
        currUpLoadFilePro: 0,
        url_pay: "/UITask/ashx/Demand/GetTender.ashx",
        createParams_pay: function (pageIndex) {
            if (pageIndex)
                $('.loading').show();
            var me = helper;
            var params = {
                demand_id: $("#demandId").val(),
                order: me.order,
                filter: me.filter,
                pageSize: me.PAGE_SIZE,
                pageNum: pageIndex
            };
            return params;
        },
        init: function () {
            var me = helper;
            me.initList();
            me.RegOrderAndFilterBtn();
            me.initMorePageLink();
            me.cuDemandmn = $('#currDMemberName').text();

        },
        initList: function () {
            var me = helper;
            $("#tradeTypeDiv").hide();
            $("#paymentTypeDiv").show();
            pager.init(7, me.url_pay, me.createParams_pay, me.renderTBodyForPayment, null, me.initPage);
        },
        renderTBodyForPayment: function (data, isDel, isZb) {
            $('.loading').hide();
            var tableObj = $('#j-works-list');
            if (!isDel) {
                tableObj.html('');
                helper.yzbCount = 0;
                helper.ZbDivAdded = false;
            }
            if (data) {
                helper.isZb = isZb;
                if (isZb) {
                    $('.FilterBtn[filter=1]').text('中标(1)');
                }
                var len = data.length;

                $('#werkNum').text(len);
                for (var i = 0; i < len; i++) {
                    var obj = data[i];
                    var html = helper.GetTbodyHtml(obj);
                    $(html).appendTo(tableObj);
                }
                if (helper.yzbCount > 0) {
                    $('.FilterBtn[filter=2]').text('备选(' + helper.yzbCount + ')');
                }
                helper.RegPlBtn($('.widWork'));
                //注册评论按钮
                $('[act-type=workscomment]').click(function () {
                    var parent = $(this).parent();
                    var widWork = parent.nextAll('.widWork');
                    if (widWork[0]) {
                        if (widWork.is(":hidden"))
                            widWork.show();
                        else {
                            widWork.hide();
                        }
                    } else {
                        widWork = helper.GetCommHtml();
                        parent.parent().append(widWork);
                        widWork.show();
                        helper.RegPlBtn(widWork);
                    }
                });
                if (!isDel) {
                    helper.RegzbbxBtn();
                    if (isZb == 3)
                        helper.RegUpLoadBtn();
                }
            } else {
                var filter = this.createParams().filter, str;
                switch (filter) {
                    case "2":
                        str = '<div class="not not2 border0 mt20"><p>还没有人备选，赶快参与吧～！</p></div>';
                        break;
                    case "1":
                        str = '<div class="not not2 border0 mt20"><p>还没有人中标，赶快参与吧～！</p></div>';
                        break;
                    default:
                        str = '<div class="not not2 border0 mt20"><p>还没有人投标，赶快参与吧～！</p></div>';
                        break;
                }
                tableObj.html(str);
            }
        },
        RegPlBtn: function (widWork) {
            widWork.find('button').unbind('click');
            widWork.find('button').click(function () {
                var plk = widWork.find('.saysth');
                if (loginInfo.isLogin) {
                    if (!plk.val()) {
                        ZDK.Tips('请输入评论内容', 3000, "warning");
                        return false;
                    } else {
                        var th = $(this);
                        var currTId = th.parents('.invitetask-works').attr('currid');
                        $.ajax({
                            type: "POST",
                            url: '/UITask/ashx/Demand/SetComment.ashx',
                            data: { id: currTId, context: plk.val() },
                            success: function (data) {
                                if (data.Success) {
                                    plk.val('');
                                    ZDK.Tips('成功', 3000, "warning");
                                    var memberHeadImg, memberName;
                                    if (data.state == 1) {
                                        memberHeadImg = th.parents('.invitetask-works').find('.touxiangall').attr('src');
                                        memberName = th.parents('.invitetask-works').find('.usertitle a').text();
                                    } else if (data.state == 2) {
                                        memberName = helper.cuDemandmn;
                                        memberHeadImg = $('#currDHeadImg').attr('src');
                                    }
                                    var innHtml = helper.GetInnerHtml(data.data.CONTEXT, '1秒前', memberName, memberHeadImg);
                                    widWork.find('.user-comment').after(innHtml);
                                    // widWork.append($(innHtml));
                                    //widWork.prepend($(innHtml));
                                } else {
                                    ZDK.Tips(data.msg, 3000, "warning");
                                }
                            },
                            dataType: 'json'
                        });

                    }
                } else {
                    ZDK.Tips('请先登录以后在进行评论', 3000, "warning");
                    return false;
                }
            });
        },
        GetTbodyHtml: function (data) {

            var htmlStr = ['<dl class="js-alert invitetask-works ' + function () {
                if (data.STATE == 2) {
                    return 'zhongbiaoBg';
                }
                return '';
            } () + '" currId=' + data.TENDER_ID + '>',
                                            '<dt><a  href="#"></a><a class="user-card" href="#" >',
                                                '<img  src="' +data.MemberHeadPortrait+
                                                 '" class="touxiangall"  alt="' + data.MemberNickName + '" border="0"></a>',
                                            '</dt><dd>',
                                               '<div class="works-state ' + function () {
                                                   var className = '';
                                                   if (data.STATE == 2) {
                                                       className = 'has-select zhongbiao';
                                                   } else if (data.STATE == 3) {
                                                       helper.yzbCount++;
                                                       className = 'has-select';
                                                   }
                                                   return className;
                                               } () + '"></div>',
                                                '<div class="usertitle">',
                                                    '<a href="javascript:void(0)">' + data.MemberNickName + '</a>',
                                                    '</div>',
                                                '<br><p class="bidc">',
                                                  data.REMARK + '</p><p class="user_card">' + function () {
                                                      var html = '';
                                                      if (data.Annex && data.Annex.length > 0) {
                                                          html = '<h4>附件下载</h4>';
                                                          for (var i = 0, len = data.Annex.length; i < len; i++) {
                                                              html += '<span>' + data.Annex[i].ANNEX_NAME + '&nbsp;<a class="mr20 underline" href="/UIDesign/ashx/DowmLoadFile.ashx?file=' + data.Annex[i].FILEWEBPATH + '" target="_blank" title="' + data.Annex[i].ANNEX_NAME + '">下载</a></span><br />';

                                                          }
                                                      }
                                                      return html;
                                                  } () + '</p><p></p>',
                                                '<div class="ntos clearfix" >',
                                                    '<span class="time" >' + data.DateStr + '</span>',
                                                    '来自：<a class="likt" href="#" >易家纺</a>',
                                                    '              <a href="javascript:;" act-type="workscomment" >评论(<u>' + function () {
                                                        var len = data.Comments.length;
                                                        return len;
                                                    } () + '</u>)</a>',
                                                    '' + function () {
                                                        var isCurrent = $('#IsCurrentMember').val() == '1';
                                                        if (isCurrent && !helper.isZb) {
                                                            if (data.STATE == 3) {
                                                                return '<p class="desc-mov"><a class="butn min-butn min-butn-gray zbc min-color-butn selzb"  href="javascript:void(0)" ><i></i>中标<u></u></a></p>';
                                                            }
                                                            return '<p class="desc-mov"><a class="butn min-butn min-butn-gray zbc min-color-butn selzb"  href="javascript:void(0)" ><i></i>中标<u></u></a><a href="javascript:void(0)" class="cwh add-sel selbx">备选</a></p>';
                                                        }
                                                        return '';
                                                    } () +
                                                        '</div>' + function () {
                                                            var len = data.Comments.length, html = '';
                                                            if (len > 0) {

                                                                var baseHtml = helper.GetCommHtml(), memberName, memberHeadImg;
                                                                for (var i = 0; i < len; i++) {
                                                                    var obj = data.Comments[i];
                                                                    if (obj.MemberName || obj.MemberHeadImg) {
                                                                        memberName = obj.MemberName;
                                                                        memberHeadImg = obj.MemberHeadImg;
                                                                    } else {
                                                                        memberName = helper.cuDemandmn;
                                                                        memberHeadImg = $('#currDHeadImg').attr('src');
                                                                    }
                                                                    var html1 = helper.GetInnerHtml(obj.CONTEXT, obj.DateDiff, memberName, memberHeadImg);
                                                                    baseHtml.append($(html1));
                                                                }
                                                                html = '<div  class="widWork" style="display:none">' + baseHtml.html() + '</div>';
                                                            }
                                                            if (data.YwjAnnex && data.YwjAnnex.length > 0) {
                                                                html += helper.GetZbDiv(helper.isZb, data.MemberNickName, helper.cuDemandmn, data.YwjAnnex);
                                                            }
                                                            return html;
                                                        } () + '',
                                                    '<div ></div></dd></dl>'].join('');
            return htmlStr;
        },
        GetCommHtml: function () {
            var topDiv = $('<div  class="widWork"></div>'),
                                                                 seconDiv = $('<div class="user-comment"  ></div>');
            seconDiv.html('<p class="arrow" style="left: 183px;"><i></i></p><div class="tarea"><textarea class="saysth" placeholder="说点什么"></textarea></div><div class="tjpz clearfix"><div class="expn"><a href="#" style="display: none;" class="zbj-expn">表情</a></div><button class="butn fr butn-orange"   style="display: inline-block;"><i></i>评论</button><div class="clear"></div></div><div class="clear"></div>');
            seconDiv.appendTo(topDiv);
            return topDiv;
        },
        GetZbDiv: function (isZb, memberName, mn, YwjAnnex) {
            if (!helper.ZbDivAdded) {
                var div1 = []; if (isZb == 3) {
                    div1 = [
                    '<ul class="j-tlod" style="display: block;">',
                    '<li class="top2" index="0"><p>• <span><a href="javascript:void(0)" >' + mn + '</a>设置了您的投标中标		    </span>',
                    '</p><p class="upsrc-tips iden1">',
                    '注：该需求发起验收催款前需要您先上传源文件，源文件仅您和雇主可见。<br>　　请上传真实有效的源文件，若双方产生争议，源文件将是争议仲裁中的重要证据。',
                    '</p><p></p></li></ul>'
                ].join('');
                } else if (isZb == 2) {
                    div1 = [
                    '<ul class="j-tlod" style="display: block;">',
                    '<li class="top2" index="0"><p>• <span>您已经设置了' + memberName + '的投标中标</span>',
                    '</p><p class="upsrc-tips iden1">',
                    '注：服务商将上传源文件到易家纺,请在下载源文件7个工作日之内请确认付款',
                    '</p><p></p></li></ul>'
                ].join('');
                }
                var div2 = [
                '<div class="upload-box upsrc iden1" >',
                '<div class="upload-box-cont"><div class="upload-box-wrap"><div class="upload-box-title">文件柜</div><div class="upload-box-filelist">',
                '<table class="ui-table upload-table" id="tooltip"><tbody>' + function () {
                    if (YwjAnnex[0].ANNEX_ID) {
                        var html = '';
                        for (var i = 0, len = YwjAnnex.length; i < len; i++) {
                            var fileObj = YwjAnnex[i];
                            html += [
                                '<tr><td><div class="file-name"><em class="zbj-tooltip" tool-map="top" tool-text="已授权雇主下载查看" ></em>' + fileObj.ANNEX_NAME + '</div></td>',
                                '<td>' + (fileObj.FILESIZE / 1024 / 1024).toFixed(2) + 'MB</td>',
                                '<td>',
                                '<a href="/UIDesign/ashx/DowmLoadFile.ashx?file=' + fileObj.FILEWEBPATH + '" target="_blank" class="upsrc-download"' + function () {
                                    if (isZb == 2 && fileObj.TYPE_ID == 4) {
                                        return 'onclick="setDownLoaded(\'' + fileObj.ANNEX_ID + '\',this)"';
                                    }
                                    return '';
                                } () + '>下载</a>',
                                '</td><td>' + function () {
                                    if (fileObj.TYPE_ID == 4) {
                                        return '未下载';
                                    } else if (fileObj.TYPE_ID == 4.5) {
                                        return '已下载';
                                    }
                                } (),
                                '</td></tr>'
                            ].join('');
                        }
                        return html;
                    } else {
                        if (isZb == 3) {
                            return [
                                '<div class="upload-box-empty-msg">',
                                '<span>尚未上传任何源文件</span><br>',
                                '<a class="upload-btn upload-btn-style-link upload-btn-empty" href="javascript:;"><span>上传源文件</span></a>',
                                '</div>'
                            ].join('');
                        } else if (isZb == 2) {
                            return [
                              '<div class="upload-box-empty-msg">',
                              '<span>尚未上传任何源文件</span><br>',
                              '</div>'
                            ].join('');
                        }
                    }
                } () + '</tbody>',
                '</table></div></div><div class="upload-box-bt">',
                '' + function () {
                    if (isZb == 3) {
                        return '<a class="upload-btn upload-btn-style-link" href="javascript:;" ><span>上传源文件</span></a>';
                    }
                    return '';
                } (),
                '</div></div></div>'
            ].join('');
                var p = [
                '<p class="mt15">',
                '' + function () {
                    if (isZb == 2 && $('#demandState').val() != 4) {
                        return '<a href="javascript:;"  class="butn butn-orange" onclick="payFor(this)"><i></i>完成工作,付款给服务商</a>';
                    }
                    return '';
                } (),
                '' + function () {
                    if (isZb == 3) {
                        return '<a href="javascript:void(0)" act-type="window"  class="ml5 underline" onclick="getContact()">雇主联系方式</a></p>';
                    }
                    return '';
                } () + ''
            ].join('');
                helper.ZbDivAdded = true;
                return div1 + div2 + p;
            } else {
                return '';
            }
        },
        GetInnerHtml: function (context, dateDiff, memberName, headImg) {
            var html1 = ['<dl class="clearfix">',
    '<dt><a class="user-card"  href="javascript:void(0)"><img  src="' + headImg + '" class="touxiangall" border="0" onerror="this.onerror=null;this.src=" alt="' + memberName + '"></a></dt>',
    '<dd><p class="username"> <a href="javascript:void(0)">' + memberName + '</a>：' + context + '<span>(' + dateDiff + ')</span> </p></dd></dl>'].join('');
            return html1;
        },
        RegOrderAndFilterBtn: function () {
            $('.OrderBtn').click(function () {
                if ($(this).hasClass('cur')) {
                    $(this).removeClass('cur');
                    helper.order = 0;
                } else {
                    $(this).addClass('cur');
                    helper.order = 1;
                }
                pager.getData(1);
            });
            $('.FilterBtn').click(function () {
                if ($(this).hasClass('cur')) {
                    return false;
                } else {
                    $('.FilterBtn.cur').removeClass('cur');
                    $(this).addClass('cur');
                    helper.filter = $(this).attr('Filter');
                    helper.initList();
                }
            });
        },
        initPage: function (data) {
            helper.currPageIndex = data.pageIndex;
            if (data.totalPageCount > helper.currPageIndex) {
                $('#moreTB').show();
                helper.Page_Index = data.pageIndex + 1;
            } else {
                $('#moreTB').hide();
            }
        },
        initMorePageLink: function () {
            $('#moreTB').click(function () {
                //      pager.getData(helper.Page_Index, true);
                helper.PAGE_SIZE = helper.PAGE_SIZE + 5;
                helper.initList();
            });
        },
        //注册中标备选按钮事件
        RegzbbxBtn: function () {
            $('.selzb').click(function () {
                var th = $(this);
                var choosewindow = ZDK.window({
                    title: "确认中标",
                    content: "<div>确认中标后你的托管赏金将被冻结,我们会提示中标公司上传原件.<br/>待公司附件上传完成后您可以确认付款</div>",
                    width: 400,
                    height: 50,
                    mask: true,
                    cache: false,
                    ok: "确认中标"
                });
                choosewindow.on('onok', function () {
                    DemandTail.startSubmit(choosewindow.Ok);
                    $.getJSON('/UITask/ashx/Demand/SetTenderState.ashx', { tenderId: th.parents('.invitetask-works').attr('currid'), action: 'zb', demandId: $("#demandId").val() }, function (data) {
                        if (data.state > 0) {
                            $('.FilterBtn[filter=1]').text('中标(1)');
                            th.parents().prevAll('.works-state').addClass('has-select').addClass('zhongbiao');
                            $('.selzb').remove();
                            $('.selbx').remove();
                            choosewindow.hide();
                        } else {
                            DemandTail.endSubmit(choosewindow.Ok);
                            rechang('在为您托管赏金时,发现您的余额不足,请充值');
                        }

                    });
                    return false;
                });
            });
            $('.selbx').click(function () {
                var th = $(this);
                var choosewindow = ZDK.window({
                    title: "预中标",
                    content: "<div>点击确认之后,改项投标将被选为预中标</div>",
                    width: 400,
                    height: 50,
                    mask: true,
                    cache: false,
                    ok: "确认预中标"
                });
                choosewindow.on('onok', function () {
                    DemandTail.startSubmit(choosewindow.Ok);
                    $.getJSON('/UITask/ashx/Demand/SetTenderState.ashx', { tenderId: th.parents('.invitetask-works').attr('currid'), action: 'bx', demandId: $("#demandId").val() }, function (data) {
                        if (data.state > 0) {
                            th.parents().prevAll('.works-state').addClass('has-select');
                            var bxTxet = $('.FilterBtn[filter=2]').text();
                            var bxC = bxTxet.match(/\d+/g);
                            bxC++;
                            $('.FilterBtn[filter=2]').text('备选(' + bxC + ')');
                            th.remove();
                            choosewindow.hide();
                        } else {
                        }

                    });
                    return false;
                });
            });
        },
        //上传源文件
        RegUpLoadBtn: function () {
            var upLoadObj = null;
            $('.upload-btn').click(function () {
                var upLoadDiv = ZDK.window({
                    title: "上传源文件",
                    content: ['<p class="orange">请上传真实有效的源文件，若双方产生争议，源文件将是争议仲裁中的重要证据。</p>',
'<div id="upsrc-tender-box" class="add-file mt10">',
    '<div class="add-f" style="width: 100px; position: relative;"><a class="" id="j-browse" href="javascript:;" style="position: relative; z-index: 1;"></a></div>',
    '<input type="hidden" name="ywjfiles" id="ywjfiles"></div>',
'<ul class="add-file" id="upsrc-filelist-box"></ul>'].join(''),
                    width: 480,
                    minheight: 150,
                    mask: true,
                    cache: false,
                    ok: "确定并授权雇主查看",
                    onInited: function () {
                        upLoadObj = helper.upLoadywjFile();
                    }

                });
                upLoadDiv.on('hide', function () {
                    if (helper.currUpLoadFilePro != null) {
                        upLoadObj.onCancelUpload(helper.currUpLoadFilePro);
                    }
                });
                upLoadDiv.on('onok', function () {
                    DemandTail.startSubmit(upLoadDiv.Ok);
                    //确定上传源文件
                    $.getJSON('/UITask/ashx/Demand/upLoadYwj.ashx', { demandId: $('#demandId').val(), files: $('#ywjfiles').val(), tender: $('.zhongbiao').parents('.invitetask-works').attr('currid') }, function () {
                        helper.initList();
                    });
                });
            });
        },

        upLoadywjFile: function () {
            var upLoadData = {};
            var uploadCache = {};
            var progress = $('#upsrc-filelist-box');
            var ywjUpload = ZDK.upload({
                target: '#j-browse',
                no: false,
                uploadURI: '/UITask/ashx/Demand/upLoadAttachment.ashx?action=ywj',
                progressURI: '/UITask/ashx/Demand/progressUpLoadFile.ashx',
                tips: function (msg) {
                    try {
                        ZDK.Tips(msg, 3000, "warning");
                    } catch (e) {
                        alert(msg);
                    }
                },
                creatProgressID: function () {
                    return ZDK.uuid() + Math.random() + ZDK.uuid();
                }
            });
            ywjUpload.on('onprogresreading', function (data) {
                if (!uploadCache[data.progress]) {
                    helper.currUpLoadFilePro = data.progress;
                    var li = $('<li class="clearfix" data-pid="' + data.progress + '"><p class="file clearfix"><span class="fl">' + data.name + '</span><a href="javascript:;"   action-type="cancel">删除</a></p><div class="adding clearfix"><p class="adifile"><span style="width:0%"></span></p><p class="fl">正在上传中....</p></div></li>').appendTo(progress);
                    uploadCache[data.progress] = li;
                }
                window.console && console.log('up_start', data);
                flag = false;
            });
            ywjUpload.on('onprogresing', function (data) {

                var cac = uploadCache[data.progress];
                var c = ((data.uploaded / data.total) * 100).toFixed(2) + '%';
                cac.find('p.fl').html('上传' + c);
                cac.find('p.adifile span').css('width', c);

                flag = false;
            });
            ywjUpload.on('onprogresed', function (data) {
                var cac = uploadCache[data.progress];
                helper.currUpLoadFilePro = 0;
                var imgSrc = data.url;

                cac.find('p.fl').html('上传成功!');
                cac.find('p.adifile span').css('width', '100%');
                cac.find('div').hide();
                cac.addClass("tsuc");
                cac.find('p.file a').attr("del-val", data.url);
                upLoadData[data.progress] = imgSrc;
                updateInput();
                flag = true;
            });
            ywjUpload.on('onprogresreadqueue', function (data) {
                if (!uploadCache[data.progress]) {
                    var li = $('<li data-pid="' + data.progress + '"><p class="file clearfix"><span class="fl uploadfilename">' + data.name + '</span><a href="javascript:;"  style="display:none;" action-type="cancel">删除</a></p><div class="adding clearfix"><p class="adifile"><span style="width:0%"></span></p><p class="fl">正在上传中....</p></div></li>').appendTo(progress);
                    // var li = $('<li class="clearfix" data-pid="' + data.progress + '"><p class="file clearfix"><span class="fl">' + data.name + '</span><a href="javascript:;" style="display:none;" action-type="del">删除</a></p><div class="adding clearfix"><p class="adifile"><span style="width:0%"></span></p><p class="fl">正在上传中....</p><a href="javascript:;" class="fr" action-type="cancel">取消</a></div></li>').appendTo(progress);
                    uploadCache[data.progress] = li;
                }
                window.console && console.log('up end', data);
                flag = false;
                //上传失败，出现错误的时候回调
            });
            ywjUpload.on('onprogresserror', function (data, cac) {
                if (cac = uploadCache[data.progress]) {
                    cac.find('p.fl').html('上传失败').css('color', 'red');
                }
                flag = false;
                //取消上传的时候回调
            });
            ywjUpload.on('oncancelupload', function () {
            });
            function delcancel(li, e) {
                var key = li.attr("data-pid");
                ywjUpload.onCancelUpload(key);
                li.remove();
                delete upLoadData[key];
                updateInput();
                if (!e) return false;
            }
            progress.delegate("a", "click", function (e) {
                if ($(this).attr("action-type") == "cancel") {
                    delcancel($(this).parents("li"), $(this));
                }
            });

            function updateInput() {
                var inputVal = [];
                $.each(upLoadData, function (key, val) {
                    inputVal.push(val);
                });

                $('#ywjfiles').val(inputVal.join('-,'));
            }

            return ywjUpload;
        }
    };

    var thisPage = {
        init: function () {
            thisPage.initBtn();
        },
        initBtn: function () {
            $('#tgsj').click(function () {
                showTgSjDiv(this);
            });
        }
    };

    var showTgSjDiv = function (th) {
        var choosewindow = ZDK.window({
            title: "托管赏金",
            content: "<div>点击托管赏金按钮我们将为您托管赏金</div>",
            width: 400,
            height: 50,
            mask: true,
            cache: false,
            ok: "托管赏金"
        });
        choosewindow.on('onok', function () {
            DemandTail.startSubmit(choosewindow.Ok);
            $.getJSON('/UITask/ashx/Demand/SetSJ.ashx', { demandId: $("#demandId").val() }, function (data) {
                if (data.state > 0) {
                    ZDK.Tips('赏金托管成功', 3000);
                    $(th).parent().text('赏金已托管');
                    choosewindow.hide();
                    seajs.use('headJs', function (headJs) {
                        headJs.updateMemberPanel();
                    });
                } else {
                    DemandTail.endSubmit(choosewindow.Ok);
                    alertify.rechang();
                }

            });
            return false;
        });
    };

    module.exports.setDownLoaded = function (id, obj) {
        var th = $(obj);
        $.getJSON('/UITask/ashx/Demand/setDownLoaded.ashx', { fileId: id }, function (data) {
            th.parent().next().text('已下载');
            th.removeAttr('onclick');
        });
    };
    //付款
    module.exports.payFor = function (th) {
        var payFor = ZDK.window({
            title: "付款",
            content: "<div>点击付款我们将把您的悬赏奖金转入到服务商的账户当中</div>",
            width: 400,
            height: 50,
            mask: true,
            cache: false,
            ok: "付款"
        });

        payFor.on('onok', function () {
            DemandTail.startSubmit(payFor.Ok);
            //payFor.Ok.attr("disabled", "disabled");
            $.getJSON('/UITask/ashx/Demand/PayFor.ashx', { demandId: $("#demandId").val() }, function (data) {
                if (data.Success) {
                    ZDK.Tips('恭喜您!您的任务已经圆满结束', 3000);
                    $(th).remove();
                } else {
                    ZDK.Tips(data.Message, 3000, "warning");
                }

                payFor.hide();
            });
            return false;
        });
    };

    module.exports.getContact = function () {
        if (currDemandMemberData.QQ || currDemandMemberData.Phone) {
            showContact(currDemandMemberData.QQ, currDemandMemberData.Phone);
        } else {
            $.getJSON('/UITask/ashx/Demand/GetContact.ashx', { demandId: $("#demandId").val() }, function (data) {
                currDemandMemberData.QQ = data.QQNUMBER;
                currDemandMemberData.Phone = data.PHONENUMBER;
                showContact(data.QQNUMBER, data.PHONENUMBER);
            });
        }
    };
    //联系方式
    var showContact = function (qq, phone) {
        var html = '<p class="mt10">手机：' + phone + '</p>';
        if (qq) html += '<p class="mt10">QQ：' + qq + '</p>';
        var showcomment = ZDK.window({
            title: "联系方式",
            content: html,
            width: 400,
            height: 50,
            mask: true,
            cache: false,
            ok: "确认"
        });
    };

    var currDemandMemberData = {
        QQ: '',
        Phone: ''
    };
    //延长选稿期
    $('#delayTask').click(function () {
        var th = this;
        var thml = '<style>.tit{font-size:14px; font-family:"微软雅黑"}.max-input input{font-weight:bold; font-size:14px}</style><form><p class="tit mt15">征集期延长（最多7天）</p><div class="input-append max-input clearfix ml20 mt10"><input type="text" style="width:83px" id="day" name="day"><span class="add-on">天</span> </div></form>';
        var yctb = ZDK.window({
            title: "延长选稿期",
            content: thml,
            width: 450,
            mask: true,
            cache: false,
            ok: "确认"
        });
        yctb.on('onok', function () {
            var addDay = $('#day');
            if (!ZDK.verify.type.int(addDay.val())) {
                ZDK.verify.fn.errortips(
                   addDay,
                   addDay.parent(),
                   '请输入整数天',
                   'addday'
               );
                return false;
            }
            if (parseInt(addDay.val()) > 7) {
                ZDK.verify.fn.errortips(
                   addDay,
                   addDay.parent(),
                   '延长日期不能大于7天',
                   'addday'
               );
                return false;
            }
            DemandTail.startSubmit(yctb.Ok);
            $.getJSON('/UITask/ashx/Demand/AddDemandDays.ashx', { id: $("#demandId").val(), days: addDay.val() }, function (data) {
                if (data.Success) {
                    var taskmodeClock = $('.taskmode-clock');
                    taskmodeClock.attr('data-difftime', data.Message).tasktimer();
                    if (parseInt(data.Message) > 432000) {
                        $(th).remove();
                    }
                    ZDK.Tips('恭喜您!您的任务延期成功', 3000);
                    yctb.hide();
                } else {
                    ZDK.Tips('任务延长失败', 3000, "warning");
                }

            });


        });
    });
    $(function () {
        $('.taskmode-clock').tasktimer();
        var checkTimer;
        uploadTradeMarkFile();
        $.extend(DemandTail, ZDK.EventEmitter.prototype);

        ZDK.DemandTail = DemandTail;
        ZDK.DemandTail.Init();
        helper.init();
        thisPage.init();
    });
});


