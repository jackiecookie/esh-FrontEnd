define(['js/common/jqueryvalidate/jqueryvalidate', 'btnLoading', 'jQueryAjax', 'js/common/DataMapping/DataMapping', 'js/common/verify/verify', 'alertify'], function (require, exports, module) {
    require('js/common/cssSelect/cssSelect');
    var ZDK = require('js/common/procopy/procopy');
    ZDK.btnLoading = require('btnLoading');
    ZDK.verify = require('js/common/verify/verify');
    require('js/common/jqueryvalidate/jqueryvalidate');
    var dataMapping = require('js/common/DataMapping/DataMapping').DataBindings,
    createParam = require('jQueryAjax').createParam,
      alertify = require('alertify'),
    MemberSw = {
        submiting: 0,
        //保存三维信息方法
        InitFlower: function () {
            var self = this;
            this.initDetail();
            //注册验证信息
            this.on('beforesubmit', function (evt) {
                return self.VerificationSaveMemberSw();
            });
            //通过验证，提交数据 
            this.addFormEvent($('#memberSwInfoForm'), $('#savebtn'));
            //保存并发布
            this.addFormEventSaveAndPub($('#memberSwInfoForm'), $('#submitform1'));
            //keyUP每输入一个数字判断一下
            keyUpVerify();
            //alert('aaa');
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
        addFormEvent: function (formObj, btnObj, evt) {
            var self = this;
            btnObj.on('click', doSubmit);
            function doSubmit(evt) {
                if (evt && evt.preventDefault)
                    evt.preventDefault();
                if (self.submiting == 1) {
                    return false;
                };

                $('#IS_CHECK').val('3');
                $('.fc-0 span.mtip-error').remove();
                $('.fc-0 span.mtip-right').remove();
                var rs = self.trigger('beforesubmit', [], 1);
                for (var i = 0; i < rs.length; i++) {
                    if (typeof rs[i] != 'undefined' && rs[i] === false) {
                        self.endSubmit(btnObj);
                        return false;
                    };
                };
                var keyid = $('#sysnumber').val();
                self.startSubmit(btnObj);
                $.ajaxjson("/Member/ashx/MemberDesign/MemberSw.ashx", createParam("edit", keyid, 'memberSwInfoForm'), function (d) {

                    self.endSubmit(btnObj);
                    if (d.Success) {
                        msg.ok("保存成功");
                    } else {
                        msg.error("保存出错");
                    }
                }, { Message: "正在保存,请稍后...", LoadingType: 2 });
            };
        },
        addFormEventSaveAndPub: function (formObj, btnObj, evt) {
            var self = this;
            btnObj.on('click', doSubmit);
            function doSubmit(evt) {
                if (evt && evt.preventDefault)
                    evt.preventDefault();
                if (self.submiting == 1) {
                    return false;
                };
                //判断是否有款式核价
                $.ajaxjson("/Member/ashx/MemberDesign/MemberSw.ashx", createParam("ispricing", $('#sysnumber').val(), 'memberSwInfoForm'), function (d) {
                    self.endSubmit(btnObj);
                    if (!d.Success) {
                        msg.ok("保存成功");
                        return false;
                    }
                });
                alertify.confirm("一旦保存并发布,将进入审核状态,该产品将无法修改,是否确认提交", function (e) {
                    if (!e) return false;
                    self.startSubmit(btnObj);
                    $('#IS_CHECK').val('0');
                    $('.fc-0 span.mtip-error').remove();
                    $('.fc-0 span.mtip-right').remove();
                    var rs = self.trigger('beforesubmit', [], 1);
                    for (var i = 0; i < rs.length; i++) {
                        if (typeof rs[i] != 'undefined' && rs[i] === false) {
                            self.endSubmit(btnObj);
                            return false;
                        };
                    };
                    var keyid = $('#sysnumber').val();
                    $.ajaxjson("/Member/ashx/MemberDesign/MemberSw.ashx", createParam("edit", keyid, 'memberSwInfoForm'), function (d) {
                        self.endSubmit(btnObj);
                        if (d.Success) {
                            msg.ok("保存成功");
                        } else {
                            msg.error("保存出错");
                        }
                    }, { Message: "正在保存,请稍后...", LoadingType: 2 });
                });
            };
        },
        VerificationSaveMemberSw: function () {
            var self = this;
            var vaildate = $('.nEmpty').validate({
                errorClass: "mtip-error",
                errorElement: "span"
            });
            var nEmpty = $('.nEmpty');
            for (var i = 0; i < nEmpty.length; i++) {
                var len = $(nEmpty[i]);
                if (!len.val()) {
                    vaildate.errorList.push({
                        message: '此项不能为空',
                        element: len
                    });
                }
            }
            //如果有错误显示错误
            if (vaildate.errorList.length > 0) {
                vaildate.defaultShowErrors();
                vaildate.errorList = [];
                return false;
            }
        },
        //编辑三维详情信息
        initDetail: function () {
            var sys = $('#sysnumber').val();
            if (sys) {
                $.getJSON('/Member/ashx/MemberDesign/MemberSw.ashx', createParam('detail', sys, 'form1'), function (data) {
                    if (data) {

                        if (data.RENDER_TYPE) {
                            var typeName = "";  //渲染类型(1:草图,2:小图,3:中图,4:大图,5:全景图)
                            switch (data.RENDER_TYPE) {
                                case 1:
                                    typeName = "草图";
                                    break;
                                case 2:
                                    typeName = "小图";
                                    break;
                                case 3:
                                    typeName = "中图";
                                    break;
                                case 4:
                                    typeName = "大图";
                                    break;
                                case 5:
                                    typeName = "全景图";
                                    break;
                            }
                            $("#txtRenderType").val(typeName);
                            var gradeName = ""; //渲染质量（1:低，2:中，3:高）
                            switch (data.RENDER_GRADE) {
                                case 1:
                                    gradeName = "低";
                                    break;
                                case 2:
                                    gradeName = "中";
                                    break;
                                case 3:
                                    gradeName = "高";
                                    break;
                            }
                            $("#txtRenderGrade").val(gradeName);
                            $("#imgPath").attr('src', "http://www.easysofthome.com/" + data.OVERALL_PIC);
                            dataMapping(data, '#memberSwInfoForm');
                            var appndMsg = function (appendMsg) {
                                $('.aliyun-form-wrap').prepend('<p class="toptips" style="padding-left: 45px;">' + appendMsg + '</p>');
                            }
                            if (data.IS_CHECK == 1 || data.IS_CHECK == 0 || data.IS_CHECK == 4) {
                                var msg = data.IS_CHECK == 0 ? '进入审核状态的三维无法修改' : '已经审核通过的三维无法修改';
                                appndMsg(msg);
                                $('#btnUpload .ui-upload-btn').remove();
                                $('#savebtn').remove();
                                $('#submitform1').remove();
                                $(".kssize").hide();
                            } else {
                                if (data.IS_CHECK == 2)
                                    appndMsg('抱歉,您没审核通过的理由为:' + data.REASON);
                                $('#savebtn').removeClass('hide');
                                $('#submitform1').removeClass('hide');
                                $(".kssize").show();
                            }
                        }
                    }
                });
            }
        }

    };
    //keyUp验证事件
    var keyUpVerify = function () {
        //交易价格验证
        $('input:text[name="PRICE"]').live('keyup', function () {
            if (!ZDK.verify.type.positiveInt($(this).val())) {
                ZDK.verify.showErroTip($(this), '请输入正确的价格，只能输入正整数');
                var a = $(this).val();
                //数字开头不能为0。
                for (var i = 0; i < $(this).val().length; i++) {
                    if (a.length > 0 && a.substring(0, 1) == "0") {
                        a = a.substring(1, a.length);
                    } else {
                        break;
                    }
                }
                $(this).val(a.replace(/[\D]/g, ""));
                return false;
            }
            (this).focus();
            $(this).val($(this).val().replace(/[\D]/g, ""));
        });
    }
    $.extend(MemberSw, ZDK.EventEmitter.prototype);
    $(function () {
        MemberSw.InitFlower();
    });
})


