define(['js/common/UpLoad/UpLoadJs','jquery','jQueryAjax'], function (require, exports, module) {
    var $ = require('jquery'),
    jQueryAjax=require('jQueryAjax'),
    fileUpload = require('js/common/UpLoad/UpLoadJs');
     $('.menu-box .menu-options:eq(3) .menu-items-title:eq(0)').addClass('current');
    function i(a) {
        return '<span class="row-info row-info-warning"><span class="icon"><span class="icon-no3"></span></span>' + a + "</span>";
    }
    function m(a) {
        a.parent().find(".row-info-warning").remove();
    }
    function p(a) {
        return a.replace(/\s/g, "").replace(/(.{4})/g, "$1 ");
    }
     function r() {
         $("#J_money").parents(".row").find(".y-red").html("*");
         $("#J_time").parents(".row").find(".y-red").html("*");
             $("#J_userName").parents(".row").find(".y-red").html("*");
         s();
     }
     function l(a, b) {
         a.parent().find(".row-info").remove();
         if (b) {
             a.parent().append(i(b))
         }
     }
        function s() {
            $("#J_userName,#J_money,#J_time").bind("valuechange", function() {
               "" == $(this).val().trim() ? l($(this), "此项必填") : $(this).val().trim().length > 200 ? l($(this), "字符为1-200") : m($(this)), "J_money" == $(this).attr("id") && !/^\d+(\.)?\d{0,2}$/.test($(this).val()) && $(this).val().length > 0 && l($(this), "格式不正确");
            });

        }

         function q() {
           $("#J_money").parents(".row").find(".y-red").html("");
         $("#J_time").parents(".row").find(".y-red").html("");
             $("#J_userName").parents(".row").find(".y-red").html("");
             m($("#J_money")), m($("#J_time")), m($("#J_userName")), t();
         }
        function t() {
//            $("#J_userName").detach("valuechange");
//            $("#J_money").detach("valuechange");
//            $("#J_time").detach("valuechange");
        }


    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };
    $("#J_userName,#J_money").bind("blur", function() {
        var a = parseFloat($("#J_money").val(), 10);
       "J_money" == $(this).attr("id") && $(this).val().length > 0 && (/^\d+(\.)?\d{0,2}$/.test($(this).val()) ? a && a > 5e5 ? l($(this), "金额需小于50万") : m($(this)) : l($(this), "格式不正确"), -1 == $(this).val().indexOf(".") && $(this).val($(this).val() + ".00")), "J_userName" == $(this).attr("id") && $(this).val().length > 0 && ($(this).val().length < 1 || $(this).val().length > 20 ? l($(this), "字符为1-20") : m($(this)));
    });
    $("#J_bankAccount", "valuechange", function() {
        $(this).val().trim().length > 0 && $(".box-content").html("两种方式必选其一，如果选择汇款人银行账号，汇款人姓名，汇款金额，汇款时间必填"), m($(this)), m($("#J_imgID"));
    });
    $("#J_bankAccount").bind("blur", function() {
        $(this).val().replace(" ", "");
        ($(this).val().length < 4 || $(this).val().length > 30) && $(this).val().length > 0 ? l($(this), "字符为4-30") : ($(this).val(p($(this).val().trim())), m($(this)));
    });
    $('#J_phone').on('blur', function() {
        var a = /^\d{4,20}$/;
        !a.test($(this).val()) && $(this).val().length > 0 && l($(this), "字符为4-20的数字");
    });
    $("#J_remark").bind("valuechange", function() {
        m($(this));
    });
    $("#J_remark").bind("blur", function() {
        $(this).val().trim().length > 200 ? l($(this), "字符为1-200") : m($(this));
    });

    $("#J_phone").bind("valuechange", function() {
      "" == $(this).val().trim() ? l($(this), "此项必填") : $(this).val().trim().length > 200 ? l($(this), "字符为1-200") : m($(this)), !/^\d+$/.test($(this).val()) && $(this).val().length > 0 && l($(this), "格式不正确");
    });
     $("#J_bankAccount").bind("valuechange", function() {
         $(this).val().trim().length > 0 && ($(".box-content").html("两种方式必选其一，如果选择汇款人银行账号，汇款人姓名，汇款金额，汇款时间必填"),$("#J_imgID").parents(".row").find("y-red").html(""),m($(this)), m($("#J_imgID")), "" == $("#J_imgID").val() && r(), "" == $(this).val().trim() && (q(), $("#J_imgID").parents(".row").find("y-red").html("*")));
     });

    $('#submit').click(function() {
        $("input").trigger("valuechange");
        $("input,textarea").trigger("blur");
        if("" == $("#J_imgID").val() && "" == $("#J_bankAccount").val().trim() && $(".box-content").html('<span class="row-info row-info-warning"><span class="icon"><span class="icon-no3"></span></span>两种方式必选其一，如果选择汇款人银行账号，汇款人姓名，汇款金额，汇款时间必填</span>'))return false;
        if ($("#J_time").val().length > 0 && !/^[\d]{4}-[\d]{2}-[\d]{2}$/.test($("#J_time").val())) {
            l($("#J_time"), "格式不合法");
            return false;
        } else if($("#J_time").val().length > 0){
            l($("#J_time"));
        }
        if (0 == $(".row-info-warning").length) {
             $.ajaxjson("/Member/ashx/Acount/offlinesubmission.ashx", jQueryAjax.createParam("add",null,"J_apply_form"), function(data) {
          if (data.Success) {
              window.msg.alert('您的提单已经提交成功,我们将尽快为你审核',function() {
                  location.href = '/Member/Offline/list';
              });
          } else {
              window.msg.error('系统繁忙请重试');
          }
        });
        }
    });


    var upload = function() {
        var upLoadObj = fileUpload({
            target: $('#iptFilepath'),
            uploadURI: '/Member/ashx/Acount/uploadofflineFile.ashx'
        });
         var rowinfosuccess = $('.row-info-success');
        upLoadObj.on('onprogresstart',function() {
              rowinfosuccess.text('开始上传,请耐心等待');
        });
        upLoadObj.on('onprogresed', function(data) {
            $('.upload-img-return').css({
                display: "block"
            }).find('img').attr('src', data.json.filepath);
            rowinfosuccess.text('图片上传成功');
            $(".way-wrap .way2").css({
                "margin-top": "171px"
            });
            $('.box-border').css({
                height: "200px"
            });
            $('.box-content').html("两种方式必选其一，如果选择汇款人银行账号，汇款人姓名，汇款金额，汇款时间必填").css({
                top: '85px'
            });
            $('#J_imgID').val(data.json.filepath);
            $('#J_bankAccount').parents('.row').find('.y-red').html('');
            q();
        });
    };
     upload();
})