/**
 * jQuery Validator
 * @staff_number 45016
 * @author <rujian.morj#aliyun-inc.com>
 * @since 2012-3-29
 * @company aliyun <www.aliyun.com>
 * @nickname utom <utombox#gmail.com>
 */
define(function (require, exports, module) {
    var jQuery = require('jquery');
     (function ($) {
         var validator = function (options, setClass) {
             var defaultOptions = {
                 target: '',
                 required: true,
                 handler: null,
                 ajax: null,
                 empty: '必填',
                 normal: null,
                 error: null,
                 success: null,
                 event: 'blur'
             },
			errorDefaultOptions = {
			    message: '',
			    regexp: ''
			},
            ajaxDefaultOptions = {
                field: '',
                data: {},
                type: 'post',
                url: '',
                dataType: 'json',
                fn: function (data) {

                }
            },
			setClass = $.extend({
			    normal: 'tip-normal',
			    error: 'tip-error',
			    success: 'tip-success',
			    loading: 'loading'
			}, setClass),
			list = [],
            ajaxStatus = [],
			api = function () {
			    $('.form-tip-box').remove();
			    _add.call(this, options);
			},
			_add = function (options) {
			    var tempOptions = options,
					options = [];

			    if (tempOptions) {
			        if ($.isPlainObject(tempOptions)) {
			            options.push(tempOptions);
			        }
			        else if ($.isArray(tempOptions)) {
			            options = tempOptions;
			        }

			        if ($.isArray(options)) {

			            $.each(options, function (i, option) {
			                var _option = {},
                                _ajax = {
                                    value: null,
                                    result: false,
                                    request: false,
                                    error: false
                                };


			                _option.target = (option.target) ? option.target : defaultOptions.target;
			                _option.required = (typeof option.required == 'boolean') ? option.required : defaultOptions.required;
			                _option.handler = ($.isFunction(option.handler)) ? option.handler : defaultOptions.handler;
			                _option.empty = (option.empty) ? option.empty : defaultOptions.empty;
			                _option.normal = (option.normal) ? option.normal : defaultOptions.normal;
			                _option.success = (option.success) ? option.success : defaultOptions.success;
			                _option.event = (option.event) ? option.event : defaultOptions.event;
			                _option.tip = $('<label class="form-tip-box"></label>');
			                _option.ajax = (option.ajax) ? option.ajax : defaultOptions.ajax;

			                if ($(_option.target).length == 1) {
			                    if ($(_option.target).attr('id')) {
			                        _option.tip.attr('for', $(_option.target).attr('id'));
			                    }
			                }

			                var $parent = $(_option.target).parent();
			                if ($parent[0].nodeName == 'LABEL') {
			                    $parent = $parent.parent();
			                }

			                $parent.append(_option.tip);

			                if (option.error) {
			                    _option.error = [];

			                    if ($.isPlainObject(option.error)) {
			                        _option.error.push(option.error);
			                    }
			                    else if ($.isArray(option.error)) {
			                        _option.error = option.error
			                    }

			                    if ($.isArray(_option.error)) {
			                        var _errors = [];
			                        $.each(_option.error, function (i, error) {
			                            var _error = {};

			                            _error.message = (error.message) ? error.message : errorDefaultOptions.message;
			                            _error.regexp = (error.regexp) ? error.regexp : errorDefaultOptions.regexp;

			                            _errors.push(_error);
			                        });
			                        _option.error = _errors;

			                    }
			                }

			                if (option.ajax && $.isPlainObject(option.ajax)) {
			                    _option.ajax = $.extend(ajaxDefaultOptions, option.ajax);
			                }

			                _createValidator.call(this, _option, _ajax);
			                list.push(_option);
			                ajaxStatus.push(_ajax);

			            });

			        }
			    }
			},
			_createValidator = function (option, ajaxStatus) {
			    var option = option,
                    ajaxStatus = ajaxStatus,
					$target = $(option.target),
					$tip = option.tip.hide();

			    if (option.normal) {
			        $target.bind('focus', function () {
			            $tip
							.removeClass(setClass.error)
							.removeClass(setClass.success)
							.addClass(setClass.normal)
							.html('<span>' + option.normal + '</span>')
							.show();
			        });
			    }

			    $target.bind(option.event, function () {
			        _verify.call(this, option, ajaxStatus);
			    });

			    api.prototype.verify[option.target] = function () { _verify(option) };
			},
			_verify = function (option, ajaxStatus) {
			    var option = option,
                    ajaxStatus = ajaxStatus,
					$target = $(option.target),
					$tip = option.tip.hide(),
					serialize = $target.serializeArray(),
					valueEmpty = true,
                    tipAllClass = setClass.normal + ' ' + setClass.error + ' ' + setClass.loading + ' ' + setClass.success,
                    value = serialize[serialize.length - 1].value,
                    errorTip = function (msg) {
                        $tip
                            .removeClass(tipAllClass)
                            .addClass(setClass.error)
                            .html('<span>' + msg + '</span>')
                            .show();
                    },
                    successTip = function (msg) {
                        $tip
                            .removeClass(tipAllClass)
                            .addClass(setClass.success)
                            .html('<span>' + msg + '</span>')
                            .show();
                    },
                    loadingTip = function (msg) {
                        $tip
                            .removeClass(tipAllClass)
                            .addClass(setClass.loading)
                            .html('<span>&nbsp;</span>')
                            .show();
                        if (msg) {
                            $tip.html('<span>' + msg + '</span>');
                        }
                    },
                    errorFn = function (errorItem) {
                        if (!valueEmpty && errorItem) {
                            for (var i = 0; i < errorItem.length; i++) {
                                var result = errorItem[i].regexp.test(value);

                                if (!result) {
                                    errorTip(errorItem[i].message);
                                    return false;
                                }
                            }

                        }
                        return true;
                    },
                    handlerFn = function (handler, data) {
                        if (handler && $.isFunction(handler)) {
                            var result = handler(data);
                            if (result) {
                                if (result.constructor == String) {
                                    errorTip(result);
                                    if (option.ajax) {
                                        ajaxStatus.error = result;
                                    }
                                    return false;
                                }
                                else if (result.constructor == Boolean && result) {
                                    $tip.hide();
                                    if (option.success) {
                                        successTip(option.success);
                                    }
                                    return true;
                                }

                            }
                            errorTip('the result isn\'t boolean or string');
                            return false;
                        }
                        return true;
                    },
                    ajaxFn = function (ajax) {
                        if (!valueEmpty && ajax && !ajaxStatus.request && ajaxStatus.value != value) {
                            var data = $.isPlainObject(ajax.data) ? ajax.data : {};
                            data[ajax.field] = value;
                            ajaxStatus.value = value;

                            ajaxStatus.result = false;

                            ajaxStatus.request = true;

                            ajaxStatus.error = false;

                            loadingTip();

                            $.ajax({
                                url: ajax.url,
                                type: ajax.type,
                                data: data,
                                cache: (ajax.cache && ajax.cache.constructor != Boolean) ? true : ajax.cache,
                                dataType: ajax.dataType,
                                success: function (data, textStatus, jqXHR) {
                                    ajaxStatus.result = handlerFn(ajax.fn, data);
                                    ajaxStatus.request = false;
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    errorTip(textStatus);
                                    ajaxStatus.error = textStatus;
                                    ajaxStatus.result = false;
                                    ajaxStatus.request = false;
                                }
                            });

                        }
                        else if (ajax && ajaxStatus.error) {
                            errorTip(ajaxStatus.error);
                            ajaxStatus.result = false;
                        }
                    };

			    //                $.each(serialize, function(k, v){
			    //					var value = v.value;

			    if (option.required && !value && value === '') {
			        errorTip(option.empty);
			        return false;
			    }
			    else if (value && value !== '') {
			        valueEmpty = false;
			    }

			    if (!errorFn(option.error)) {
			        return false;
			    }

			    if (!handlerFn(option.handler, value)) {
			        return false;
			    }

			    ajaxFn(option.ajax);

			    if (!valueEmpty && option.ajax) {
			        $tip.show();

			        if ((ajaxStatus.request) || (!ajaxStatus.result) || (ajaxStatus.value != value)) {
			            return false;
			        }

			        return ajaxStatus.result;
			    }

			    $tip.hide();
			    if (!valueEmpty && option.success && !option.ajax) {
			        successTip(option.success);
			    }

			    return true;
			    //                });

			};

             $.extend(api.prototype, {
                 add: function (options) {
                     _add.call(this, options);
                 },
                 complete: function () {
                     var complete = true;

                     $.each(list, function (i, option) {
                         var result = _verify.call(this, option, ajaxStatus[i]);
                         if (!result) {

                             complete = false;
                         }
                     });
                     return complete;
                 },
                 verify: {}

             });

             return new api();
         }

         $.extend({
             validator: validator
         });

     })(jQuery);
 })
