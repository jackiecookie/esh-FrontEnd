
/*
网站验证码
*/
define(function (require, exports, module) {
    module.exports.sendVerifyCode = function (el, baseURL, paramName, value, timeLimit, extraData, showErroMsg) {
        $('.section .errortip').remove();
        var sourceEl = $(el);
        var url = baseURL;
        var resendTipEl = $(el.parentNode.parentNode.parentNode).find('.resend_tip');

        var sendCompleteMsgEl;
        timeLimit = timeLimit || 60;
        var timer = init(sourceEl, url, resendTipEl, timeLimit, showErroMsg);
        return timer;

        function init(sourceEl, url, resendTipEl, timeLimit, showErroMsg) {
            var $sourceEl = $(sourceEl);
            var $resendTipEl = $(resendTipEl);

            $sourceEl.css('visibility', 'hidden');
            $resendTipEl.show();
            var btn = $resendTipEl.find('.btn');
            btn.click(function (e) {
                e.preventDefault();
                if (btn.hasClass('btn-white-disabled')) return;
                btn.addClass('btn-white-disabled');
                sendRequest(btn, url, timeLimit);
                if (sendCompleteMsgEl) {
                    sendCompleteMsgEl.remove();
                    sendCompleteMsgEl = null;
                }
            });

            var timer = sendRequest(btn, url, timeLimit, showErroMsg);
            return timer;
        }

        function startTimer(el, template, timeLimit, callback) {
            var i = timeLimit;

            var fn = function () {
                el.text(template.replace(/\${seconds}/g, i));
                i--;
                if (i <= 0) {
                    clearInterval(timer);
                    if (callback instanceof Function) {
                        callback();
                    }
                }
            };
            fn();
            var timer = setInterval(fn, 1000);
            return timer;
        }
        function sendRequest(btn, url, timeLimit, showErroMsg) {
            var timer = startTimer(btn.find('span'), '${seconds} 秒后重新获取', timeLimit, function () {
                btn.removeClass('btn-white-disabled').find('span').text('重新获取验证码');
            });

            var data;
            if (extraData instanceof Object) {
                data = extraData;
            } else {
                data = new Object();
            }
            if (value instanceof jQuery) {
                data[paramName] = value.val();
            } else {
                data[paramName] = value;
            }

            $.ajax({
                url: url,
                cache: false,
                data: data,
                success: function (response) {
                    if (response && response.success) {
                        if (sendCompleteMsgEl) sendCompleteMsgEl.remove();
                        sendCompleteMsgEl = $('<span class="uitip-success ml10 mt5 vam">验证码已发送' + (response.mailLoginUrl ? '<a class="ml10" href="' + response.mailLoginUrl + '" target="_blank">立即登录邮箱</a>' : '') + '</span>');
                        if (resendTipEl.find('.uitip-success').length > 0) {
                            resendTipEl.find('.uitip-success').remove();
                        }
                        resendTipEl.append(sendCompleteMsgEl);
                    } else {
                        if (response.existMsg && showErroMsg) {
                            showErroMsg.showErrmsg(response, timer, showErroMsg.btn_submit, showErroMsg.btn_getEmailVerifyCode, true);
                            //    $('.section').prepend('<div class="errortip">' + response.existMsg + '</div>');
                        } else {
                            if (sendCompleteMsgEl) sendCompleteMsgEl.remove();
                            //错误处理
                            var errMsg = '发送失败，请稍后重试';
                            if (response && response.errorMessage) {
                                errMsg = response.errorMessage;
                            }
                            if (errMsg.indexOf('系统错误') > -1) {
                                errMsg = '发送验证码失败，请检查手机号码';
                            }
                            sendCompleteMsgEl = $('<span class="uitip-error mt5 ml10 vam">' + errMsg + '</span>');
                            resendTipEl.append(sendCompleteMsgEl);
                        }
                    }
                },
                error: function () {
                    if (sendCompleteMsgEl) sendCompleteMsgEl.remove();
                    sendCompleteMsgEl = $('<span class="uitip-error mt5 ml10 vam">发送失败，请稍后重试</span>');
                    resendTipEl.append(sendCompleteMsgEl);
                },
                dataType: 'json'
            });
            return timer;
        };
    }
    module.exports.switchTab = function (source, range, selector, identifier, fieldName, fieldValue) {
        $(source).addClass('on').siblings().removeClass('on');
        var $range = $(range);
        $range.find(selector).hide();
        $range.find(identifier).show();

        if (fieldName) {
            $range.find('input[name="' + fieldName + '"]').val(fieldValue);
        }
    }
});