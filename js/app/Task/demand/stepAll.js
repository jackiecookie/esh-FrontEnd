define(['jquery', 'js/common/procopy/procopy', 'btnLoading',
 'js/common/Tip/Tip', 'js/common/verify/verify', 'loginPanel', 'alertify'], function (require, exports, module) {
     var $ = require('jquery');
     var ZDK = require('js/common/procopy/procopy');
     var alertify = require('alertify');
     ZDK.btnLoading = require('btnLoading');
     ZDK.tip = require('js/common/Tip/Tip');
     ZDK.verify = require('js/common/verify/verify');
     var showLoginForm = require('loginPanel'),
        loginInfo = require('headJs').loginInfo,
        topc,
        scec,
     PubEntry = {
         industryId: -1,
         catalogId: -1,
         currentStep: 1,
         submiting: 0,
         verified: 0,
         initStep2: function (uploadObj) {
             var logoForm = $('#pub-form'),
                logoFormBtn = $('#j-gotoService');
             //    var poptip = ZDK.module.poptip({ target: $('#logo-qq-number') });
             var self = this;
             this.initFileUpload(uploadObj);
             this.initTypeClick();
             this.initType();
             //             this.on('beforesubmit', function (evt) {
             //                 return self.initVerifyForm();
             //             });
             //this.addFormEvent(logoForm, logoFormBtn, 'step2');
         },
         watchPieceInput: function () {
             $('#j-piecenum, #j-pieceamount').on('keyup', function () {
                 updatePieceMoney();
             });
             function updatePieceMoney() {
                 var num = $('#j-piecenum').val();
                 var amount = $('#j-pieceamount').val();
                 var total = parseFloat(num * amount) || 0;
                 if (total > 0) {
                     $('#j-piece-sum').css('visibility', 'visible');
                     $('#j-piece-sum span').html(total);
                 } else {
                     $('#j-piece-sum').css('visibility', 'hidden');
                 }
             }
         },
         watchAllotInput: function () {
             var self = this;
             $('#j-price-input, input[name="many_amount[0]"], input[name="many_amount[1]"], input[name="many_amount[2]"]').keyup(function () {
                 self.refreshAllotMoney();
             });
         },

         showCaptcha: function () {
             if ($('#j-captcha-wrap').size()) {
                 return;
             }
             var captchaHTML = $('#j-captcha-area').val();
             $('#j-captcha-area').replaceWith(captchaHTML);
         },

         refreshAllotMoney: function () {

             if (!$("#j-price-input").size()) {
                 return;
             }

             var totalMoney = parseFloat($("#j-price-input").val()) || 0;
             if (totalMoney > 0) {
                 updateAllotItem($('input[name="many_amount[0]"]'), totalMoney);
                 updateAllotItem($('input[name="many_amount[1]"]'), totalMoney);
                 updateAllotItem($('input[name="many_amount[2]"]'), totalMoney);
             } else {
                 $('#j-allot-multi-detail span.pub-mode-sum').css('visibility', 'hidden');
             }

             function updateAllotItem(allotInput, totalPrice) {
                 var allotPercent = parseFloat(allotInput.val()) || 0;
                 var allotWrap = allotInput.parents('li.allot-item-wrap');
                 var peopleNum = allotInput.attr('data-num');
                 var total = (totalPrice * allotPercent / 100 / peopleNum).toFixed(2);
                 if (allotPercent > 0) {
                     allotWrap.find('span.pub-mode-sum').css('visibility', 'visible');
                     allotWrap.find('span.pub-mode-sum span').html(total);
                 } else {
                     allotWrap.find('span.pub-mode-sum').css('visibility', 'hidden');
                 }
             }
         },
         initStep3: function (type) {
             type = type || 'common';
             var self = this;
             this.verified = 1;
             this.setEndDate();

             if (type == 'common') {
                 this.initPriceService();
                 //                 this.on('beforesubmit', function () {
                 //                     return self.onCommonStep3Submit();
                 //                 });
             }
             // this.addFormEvent($('#pub-form'), $('#logo-action-submit'), 'step3');
         },

         initStep4: function () {
             var self = this;
             //this.initUnloadEvent();
             $('#logo-action-submit').click(function () {
                 $('input[name="nopay"]').val(1);
                 doSubmit($(this));
             });
             $('#j-submit-nopay').click(function () {
                 $('input[name="nopay"]').val(0);
                 doSubmit($(this));
             });
             function doSubmit(btn) {
                 if ($('#tongyi').length == 0 || $('#tongyi').attr('checked')) {
                     //PubEntry.startSubmit(btn);
                     var fromObj = $('#pub-form');
                     //    $('#pub-form').submit();
                     var callback = 'logopubcallback' + (+new Date);
                     fromObj.attr('action', '/UITask/ashx/demand/ProStep.ashx?' + 'jsonpcallback=' + callback);
                     window[callback] = function (json) {
                         if (json.state > 0) {
                             document.location.href = json.msg;
                         } else {
                             if (json.state == -10) {
                                 alertify.rechang();
                                 //PubEntry.endSubmit(btn);
                                 return;
                             }
                             if (json.state == -1) {
                                 alert(json.msg);
                             }
                         };
                     };
                     fromObj.submit(); //提交
                 } else {
                     ZDK.Tips("请先同意并遵守《易上弘需求发布与处理规则》", 3000, "error");
                 }
             }
         },
         setEndDate: function () {
             if ($('#j-enddate').val()) {
                 return;
             }
             var curDate = new Date();
             var newDate = new Date(curDate.getTime() + 3600 * 24 * 7 * 1000);
             $('#j-enddate').val(newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + (newDate.getDate()));
         },
         onCommonStep3Submit: function () {
             var allotType = $('input[name="allot"]:checked').val();
             var currentModeDom = $('div.pub-mode-active');
             var currentModeData = currentModeDom.find('input[name="mode"]').val();

             //检查价格
             if (currentModeData != 2) {
                 if (!this.checkPriceInput(currentModeDom.find('input[name="reward"]'))) {
                     return false;
                 }
             }
             if (!this.checkEndDate()) {
                 return false;
             }
         },
         checkSendnumber: function () {
             var sendNumber = $('#j-sendnumber-input').val();

             if (!/\d+/.test(sendNumber) || sendNumber < 10) {
                 ZDK.verify.fn.errortips(
                    $('#j-sendnumber-input'),
                    $('#j-sendnumber-wrap'),
                    '至少需要发送10条',
                    'sendnumber'
                );
                 return false;
             }
             return 1;
         },
         checkSendTime: function () {
             var sendNumber = $('#j-senddate').val().replace(/^\s*|\s$/, '');

             if (!sendNumber.length) {
                 ZDK.verify.fn.errortips(
                    $('#j-senddate'),
                    $('#j-senddate-wrap'),
                    '请输入发送时间',
                    'senddate'
                );
                 return false;
             }
             return 1;
         },

         checkPriceInput: function (inputNode) {

             inputNode = inputNode || $('#j-price-input');
             //check input
             var price = inputNode.val();

             var msgLang = {
                 '1': '请输入正确的价格',
                 '2': '请输入价格'
             };
             var code;
             if (!/^\d+/.test(price)) {
                 code = 1;
             } else if (price <= 0) {
                 code = 2;
             }

             if (code) {
                 ZDK.verify.fn.errortips(
                    inputNode,
                    inputNode.parent(),
                    msgLang[code],
                    'price'
                );
                 return false;
             }
             return 1;
         },
         checkWeiboAllot: function () {
             var inputValid = 1;
             var errorItem;

             $('#j-allocate').find("input[type='text']").each(function (key, item) {

                 val = $(item).val();

                 if (parseFloat(val) < 0.1) {
                     inputValid = false;
                     errorItem = $(item);
                     return false;
                 }
             });
             if (!inputValid) {
                 ZDK.verify.fn.errortips(
                    errorItem,
                    errorItem.parent(),
                    '分配价格不能低于0.1元',
                    escape(errorItem.attr('name'))
                );
                 return false;
             }
             return 1;
         },

         checkEndDate: function () {
             var date = $('#j-enddate').val();
             if (date == "") {
                 ZDK.verify.fn.errortips(
                    $('#j-enddate'),
                    $('#j-enddate-wrap'),
                    '任务结束日期不能为空',
                    'enddate'
                );
                 return false;
             }
             if (Date.parse(date) < (new Date()).getTime()) {
                 ZDK.verify.fn.errortips(
                    $('#j-enddate'),
                    $('#j-enddate-wrap'),
                    '任务结束日期不能小于当前日期',
                    'enddate'
                );
                 return false;
             }
             return 1;
         },
         initVerifyForm: function () {
             var self = this;
             var logoForm = $('#pub-form'),
                nextBtn = $('#j-gotoService');
             var subjectInput = $('input[name="key"]');
             var subjectWrap = subjectInput.parents('.section');

             var introInput = $('#j-intro');
             var introInputWrap = introInput.parents('.section');

             var phoneInput = $('#logo-phone-number');
             var phoneInputWrap = phoneInput.parents('.section');

             var qqInput = $('#logo-qq-number');
             var qqInputWrap = qqInput.parents('.section');
             var taskType = $('#Tasktypel');
             var taskTypeWrap = taskType.parents('.section');
             var taskTypeThree = taskType.text();
             if (taskTypeThree == "" || taskTypeThree == "请先选择二级分类" || taskTypeThree == "请选择类别") {
                 ZDK.verify.fn.errortips(
                   $('#Tasktypel'),
                   taskTypeWrap,
                   '请选择需求类型',
                   'taskType'
               );
                 return false;
             }
             var $rangeElem = $('.j_valid_range');

             //为额外属性的checkbox计算选中个数
             $rangeElem.each(function (i, o) {
                 var $target = $(this);
                 $target.data('count', $target.parent().find('input:checked').length);
             });

             if (isSubjectError(subjectInput)) {
                 ZDK.verify.fn.errortips(
                    subjectInput,
                    subjectWrap,
                    '标题字数应该为2到30个',
                    'subject'
                );
                 return false;
             }
             var $rangeElem = $('.j_valid_range');
             for (var i = 0; i < $rangeElem.length; i++) {
                 var elem = $rangeElem[i];
                 var $elem = $(elem);
                 var errMsg = null;
                 var count = $elem.data('count') || 0;
                 if (elem.hasAttribute('data-range-min') && count < +$elem.attr('data-range-min')) { //比规定的个数少了
                     errMsg = $elem.attr('data-range-min-error') || ('此项最小值为' + $elem.attr('data-range-min'));
                 } else if (elem.hasAttribute('data-range-max') && count > +$elem.attr('data-range-max')) { //比规定的个数多了
                     errMsg = $elem.attr('data-range-max-error') || ('此项最大值为' + $elem.attr('data-range-max'));
                 }
                 if (errMsg !== null) {
                     ZDK.verify.fn.errortips(
                        $($elem.nextAll('label').find('input').get(0)),
                        $elem.parent(),
                        errMsg,
                        elem.id
                    );
                     return false;
                 }
             }
             var $requiredElem = $('.j_valid_required');
             for (i = 0; i < $requiredElem.length; i++) {
                 var elem = $requiredElem[i];
                 var $elem = $(elem);
                 if (!$elem.val()) {
                     ZDK.verify.fn.errortips(
                        $elem,
                        $elem.parent(),
                        $elem.attr('data-required-error') || '此项为必填项',
                        elem.id
                    );
                     return false;
                 }
             }
             var introInputLen = introInput.val().replace(/^\s*|\s$/, '').length;
             if (!introInputLen) {
                 ZDK.verify.fn.errortips(
                     introInput,
                     introInputWrap,
                     '请输入需求内容',
                     'intro'
                 );
                 return false;
             } else if (introInputLen > 1300) {
                 ZDK.verify.fn.errortips(
                     introInput,
                     introInputWrap,
                     '需求内容过长',
                     'intro'
                 );
             }
             var phoneVal = phoneInput.val().replace(/^\s*|\s$/, '');
             if (!ZDK.verify.type.tel(phoneVal)) {
                 ZDK.verify.fn.errortips(
                    phoneInput,
                    phoneInputWrap,
                    '请输入正确的手机号码',
                    'phone'
                );
                 return false;
             }

             var qqVal = qqInput.val().replace(/^\s*|\s$/, '');
             if (qqVal && !ZDK.verify.type.qq(qqVal)) {
                 ZDK.verify.fn.errortips(
                    qqInput,
                    qqInputWrap,
                    '请输入正确的qq号码',
                    'qq'
                );
                 return false;
             }
             return true;
             function isSubjectError(input) {
                 var len = input.val().length;
                 if (len < 2 || len > 30) {
                     return 1;
                 }
                 return 0;
             }
         },

         initPriceService: function () {
             $('#j-allot-single, #j-allot-piece, #j-allot-multi').click(function () {
                 updateAllotChoice($(this).val());
             });

             $('#j-allot-multi-label, #j-pub-mode-installment-label').click(function () {
                 if (!$(this).find('input').attr('disabled')) {
                     return;
                 }
                 showDisableTip($(this).find('input'));
             });
             function checkLowPrice() {
                 var self = $(this);
                 if (self.is('.lowpricealert')) {
                     var amount = self.val();
                     amount = parseFloat(amount) || 0;
                     if (amount < 2) {
                         showDisableTip(self);
                     } else {
                         if (disableTip) {
                             disableTip.hide();
                             disableTip = null;
                         }
                     }
                 }
             }
             $('#j-pieceamount').on('keyup', checkLowPrice);
             $('#j-pieceamount').on('focus', checkLowPrice);

             var disableTip;

             function showDisableTip(jDom) {
                 var lang = {
                     'j-pieceamount': '游戏试玩类需求，均价约为2元，过低的价格可能会影响您的需求效果。',
                     'j-allot-multi': '多人分享赏金的模式仅支持1000元以上的需求',
                     'j-pub-mode-installment': '分期托管仅支持赏金在500元以上的需求'
                 };
                 var size = {
                     'j-pieceamount': '420',
                     'j-allot-multi': '290',
                     'j-pub-mode-installment': '260'
                 };
                 var domId = jDom.attr('id');
                 if (disableTip) {
                     disableTip.hide();
                     disableTip = null;
                 }
                 disableTip = ZDK.module.poptip({
                     target: jDom,
                     theme: 'ui-verify-tips service-disable-tip',
                     content: '<p>' + lang[domId] + '</p>',
                     width: size[domId],
                     cache: false,
                     zIndex: 201
                 });
             }

             $('#j-price-input').keyup(function () {
                 var money = parseFloat($(this).val());
                 if (money >= 1000) {
                     $('#j-allot-multi').removeAttr('disabled');
                 } else {
                     $('#j-allot-multi').attr('disabled', 'disabled').removeAttr('checked');
                     $('#j-allot-single').attr('checked', 'checked');
                     $('#j-allot-multi-detail').hide();
                 }
             });
             $('#j-price-input, #j-price-input-1').blur(function () {
                 var val = parseFloat($(this).val());
                 if (isNaN(val)) {
                     return;
                 }
                 $(this).val(val.toFixed(2));
             });

             function updateAllotChoice(type) {
                 if (type == 1) {
                     $('#j-allot-piece-detail').hide();
                     $('#j-allot-multi-detail').hide();
                 } else if (type == 3) {
                     $('#j-allot-piece-detail').show();
                     $('#j-allot-multi-detail').hide();
                 } else {
                     $('#j-allot-piece-detail').hide();
                     $('#j-allot-multi-detail').show();
                 }
             }
         },
         startSubmit: function (btn) {
             this.submiting = 1;
             ZDK.btnLoading({
                 obj: btn,
                 addClass: "disabled"
             });
         },
         endSubmit: function (btn) {
             this.submiting = 0;
             btn.removeClass('disabled');
             ZDK.btnLoading.reset(btn);
         },
         addFormEvent: function (formObj, btnObj, step) {
             var hasEditRoule = $('#hasEditRoule').val();
             if (hasEditRoule == 1) {
                 ZDK.Tips('您无法修改当前任务,此任务不是您发布或者任务已经进入投标状态。<a href="/Demand/Step1/">点击这里发布新需求<a>', 5000, 'warning');
                 return false;
             }
             var self = this;
             if (step == 'step2') {
                 btnObj.on('click', function () {
                     if (!loginInfo.isLogin) {
                         showLoginForm(doSubmit, btnObj);
                     } else {
                         doSubmit();
                     }
                 });
             } else {
                 btnObj.on('click', doSubmit);
             }
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
                 formObj.attr('action', '/UITask/ashx/demand/ProStep.ashx?' + 'jsonpcallback=' + callback);
                 window[callback] = function (json) {
                     if (json.state > 0) {
                         document.location.href = json.msg;
                     } else {
                         if (json.state == -10) {
                             self.endSubmit(btnObj);
                             var popup = ZDK.product.logoguide.showPopup();
                             SetCookie("logoshowMsg", encodeURIComponent($('#j-intro').val()), null, '/', document.domain);
                             popup.cancel.click(function () {
                                 btnObj.click();
                                 SetCookie('logoshowMsg', null);
                             });
                             $('<input name="showspecial" value="1" type="hidden"/>').appendTo(formObj);

                             return;
                         } else if (json.state == -1001 && step == 'step2') {
                             self.showCaptcha();
                             $('#j-captcha-img').click();
                         }
                         alert(json.msg);
                         self.endSubmit(btnObj);
                     }
                 };
                 formObj.submit(); //提交
             }
         },

         extraInfoUploadData: {},
         updateExtraInfoUpload: function () {
             var inputVal = [];
             var displayRs = [];

             $.each(this.extraInfoUploadData, function (key, val) {
                 inputVal.push(key);
                 displayRs.push({
                     ofilename: val['fileName'],
                     file_id: val['fid']
                 });
             });

             $('#extraInfoUploadInput').val(inputVal.join('-,'));
         },
         //上传文件
         initFileUpload: function (uploadObj) {
             var self = this;
             var extraInfoUploadBtn = $('#extraInfoUploadBtn');
             var extraInfoLoading = $('#extraInfoLoading');

             var uploadCache = {};
             //ZDK.module.upload
             var extraInfoUpload = uploadObj({
                 target: extraInfoUploadBtn,
                 no: false,
                 uploadURI: '/UITask/ashx/Demand/upLoadAttachment.ashx',
                 progressURI: '/UITask/ashx/Demand/progressUpLoadFile.ashx',
                 maxNumber: 5,
                 tips: function (msg) {
                     try {
                         ZDK.Tips(msg, 3000, "warning");
                     } catch (e) {
                         alert(msg);
                     }
                 },
                 creatProgressID: function () {
                     //return eshBase.uuid() + Math.random() + eshBase.uuid();
                     return ZDK.uuid() + Math.random() + ZDK.uuid();
                 },
                 file_size_limit: true
             });


             extraInfoUpload.on('onprogresreading', function (data) {
                 if (!uploadCache[data.progress]) {
                     var li = $('<li class="clearfix" data-pid="' + data.progress + '"><p class="file clearfix"><span class="fl">' + data.name + '</span><a href="javascript:;" action-type="cancel">删除</a></p><div class="adding clearfix"><p class="adifile"><span style="width:0%"></span></p><p class="fl">正在上传中....</p><a href="javascript:;" class="fr" action-type="cancel">取消</a></div></li>').appendTo(extraInfoLoading);
                     uploadCache[data.progress] = li;
                 }
                 window.console && console.log('up_start', data);
                 flag = false;
             });
             extraInfoUpload.on('onprogresing', function (data) {

                 var cac = uploadCache[data.progress];
                 var c = ((data.uploaded / data.total) * 100).toFixed(2) + '%';
                 cac.find('p.fl').html('上传' + c);
                 cac.find('p.adifile span').css('width', c);

                 flag = false;
             });
             extraInfoUpload.on('onprogresed', function (data) {
                 var cac = uploadCache[data.progress];
                 //var imgSrcTmp = /"(task\/[^"]*)"/.exec(data.url);

                 //if (!imgSrcTmp) {
                 //    ZDK.Tips(data.url, 800, 'error');
                 //    return;
                 //}
                 var imgSrc = data.url;

                 cac.find('p.fl').html('上传成功!');
                 cac.find('p.adifile span').css('width', '100%');
                 cac.find('div').hide();
                 cac.addClass("tsuc");
                 cac.find('p.file a').attr("del-val", data.url);
                 self.extraInfoUploadData[data.progress] = imgSrc;
                 updateInput();
                 flag = true;
             });
             extraInfoUpload.on('onprogresreadqueue', function (data) {
                 if (!uploadCache[data.progress]) {
                     var li = $('<li class="clearfix" data-pid="' + data.progress + '"><p class="file clearfix"><span class="fl">' + data.name + '</span><a href="javascript:;" action-type="del">删除</a></p><div class="adding clearfix"><p class="adifile"><span style="width:0%"></span></p><p class="fl">正在上传中....</p><a href="javascript:;" class="fr" action-type="cancel">取消</a></div></li>').appendTo(extraInfoLoading);
                     uploadCache[data.progress] = li;
                 }
                 window.console && console.log('up end', data);
                 flag = false;
                 //上传失败，出现错误的时候回调
             });
             extraInfoUpload.on('onprogresserror', function (data, cac) {
                 if (cac = uploadCache[data.progress]) {
                     cac.find('p.fl').html('上传失败').css('color', 'red');
                 }
                 flag = false;
                 //取消上传的时候回调
             });
             extraInfoUpload.on('oncancelupload', function () {
             });
             function delcancel(li, e) {
                 var key = li.attr("data-pid");
                 extraInfoUpload.onCancelUpload(key);
                 li.remove();
                 if (!key) {
                     key = li.find('a').attr('del-val');
                     insertDeletInput(key);
                 }
                 delete self.extraInfoUploadData[key];
                 updateInput();
                 if (!e) return false;
             }
             extraInfoLoading.delegate("a", "click", function (e) {
                 if ($(this).attr("action-type") == "cancel") {
                     e.preventDefault();
                     e.stopPropagation();
                     delcancel($(this).parents("li"), $(this));
                 }
             });

             function updateInput() {
                 var inputVal = [];
                 $.each(self.extraInfoUploadData, function (key, val) {
                     inputVal.push(val);
                 });

                 $('#extraInfoUploadInput').val(inputVal.join('-,'));
             }

             function insertDeletInput(key) {
                 var delfilesInput = $('#delfiles');
                 var delfileVal = delfilesInput.val();
                 if (delfileVal) {
                     delfilesInput.val(delfileVal + ',' + key);
                 } else {
                     delfilesInput.val(key);
                 }
             }
         },
         //类别选项
         initTypeClick: function () {
             $('.taskType').click(function () {
                 var selctType = $(this).text();
                 $(this).parent().parent().prev('a').html(selctType + '<b></b>');
                 PubEntry.BindLevel2(selctType, true);
             });

         },
         BindLevel2: function (text, isInit) {
             var childernType = this.GetNameStr($.trim(text), true);
             //   var childernType = TaskTypeJson[$.trim(text)];
             if (childernType) {
                 childernType = childernType.split(',');
                 var level2 = $('.ui-dropdown-level2');
                 level2.find('.ui-dropdown-menu').remove();
                 if (isInit) {
                     level2.find('a').html('请选择类别<b></b>');
                     var l3 = $('.ui-dropdown-level3');
                     l3.find('a').html('请先选择二级分类<b></b>');
                     l3.find('.ui-dropdown-menu').remove();
                 }
                 var levelul = $(' <ul class="unstyled ui-dropdown-menu"> </ul>').appendTo(level2);
                 for (var i = 0, len = childernType.length; i < len; i++) {
                     var levela = $('  <li> <a>' + ($.trim(childernType[i])) + '  </a></li>').appendTo(levelul);
                     //注册2级类别按钮
                     levela.click(function () {
                         var levelaText = $(this).text();
                         $(this).parent().prev('a').html(levelaText + '<b></b>');
                         PubEntry.BindLevel3(levelaText, true);
                     });
                 }
             }
         },
         BindLevel3: function (text, isInit) {
             // var childern = TaskTypeJson[$.trim(text)];
             var childern = this.GetNameStr($.trim(text), false);
             if (childern) {
                 childern = childern.split(',');
                 var level3 = $('.ui-dropdown-level3');
                 level3.find('.ui-dropdown-menu').remove();
                 if (isInit) {
                     level3.find('a').html('请选择类别<b></b>');
                 }
                 var level3Ul = $(' <ul class="unstyled ui-dropdown-menu"> </ul>').appendTo(level3);
                 for (var j = 0, levelLen = childern.length; j < levelLen; j++) {
                     var level3A = $('  <li> <a>' + ($.trim(childern[j])) + '  </a></li>').appendTo(level3Ul);
                     //注册三级列别按钮
                     level3A.click(function () {
                         var level3AText = $(this).text();
                         level3AText = $.trim(level3AText);
                         $(this).parent().prev('a').html(level3AText + '<b></b>');
                         for (var i = 0, len = scec.length; i < len; i++) {
                             if (level3AText == scec[i].TYPE_NAME) {
                                 $('#Tasktype').val(scec[i].TYPE_ID);
                                 return false;
                             }
                         }

                     });
                 }
             }
         },
         //初始化类别
         initType: function () {
             if ($('#task_id').val()) {
                 PubEntry.BindLevel2($('.ui-dropdown-level1 a.ui-dropdown-hd').text());
                 PubEntry.BindLevel3($('.ui-dropdown-level2 a.ui-dropdown-hd').text());
             }
             var text = $('.ui-dropdown-level1 a.ui-dropdown-hd').text();
             if (text != '全部分类') {
                 PubEntry.BindLevel2(text);
             }
         },
         GetNameStr: function (text, isTop) {
             if (!text || text == '全部分类') return ' ';
             var len = TaskTypeJson.length;
             var result = new Array();
             if (isTop) {
                 for (var i = 0; i < len; i++) {
                     if (TaskTypeJson[i].TYPE_NAME == text) {
                         topc = TaskTypeJson[i].children;
                         for (var j = 0, clen = TaskTypeJson[i].children.length; j < clen; j++) {
                             result.push(TaskTypeJson[i].children[j].TYPE_NAME);
                         }
                         return result.join(',');
                     }

                 }
             } else {
                 for (var k = 0, lentc = topc.length; k < lentc; k++) {
                     if (topc[k].TYPE_NAME == text) {
                         scec = topc[k].children;
                         for (var l = 0, lencsc = scec.length; l < lencsc; l++) {
                             result.push(scec[l].TYPE_NAME);
                         }
                         return result.join(',');
                     }
                 }
             }
         }
     };
     $.extend(PubEntry, ZDK.EventEmitter.prototype);
     module.exports = PubEntry;
 });