define(function (require, exports, module) {
    var portSource = require('js/app/Pricing/Port/PortSource').portSource;
    require('js/app/Pricing/Port/PortPostionEx.css');
    (function ($) {
        $.extend($.fn, {
            positionEx: function (options) {

                if (!options) {
                    options = {};
                    //默认列表数据源
                    options.suggesttype = "startPort_suggest";
                    //查找数据源
                    options.sourcetype = "port_source";
                }

                var p = new $.positionor(options, this);
            }

        });


        $.positionor = function (options, inputs, lists) {


            this.currentInput = null;

            this.render = '<div class=\"portlist\" id=\"Postion\" style=\"position:absolute;z-index:120;overflow:hidden;display:none;\">' +
                '<div class=\"port_warpperjzx\">' +
                '<div class=\"port_msg\" id=\"port_message\">&nbsp;<\/div>' +
                '<div class=\"port_contxt\" id=\"port_list\">' +
                '<a class=\"a1\"><span>&nbsp;<\/span><\/a>' +
                '<a class=\"a1\"><span>&nbsp;<\/span><\/a>' +
                '<a class=\"a1\"><span>&nbsp;<\/span>&nbsp;<\/a>' +
                '<a class=\"a1\"><span>&nbsp;<\/span>&nbsp;<\/a>' +
                '<a class=\"a1\"><span>&nbsp;<\/span>&nbsp;<\/a>' +
                '<a class=\"a1\"><span>&nbsp;<\/span>&nbsp;<\/a>' +
                '<a class=\"a1\"><span>&nbsp;<\/span>&nbsp;<\/a>' +
                '<a class=\"a1\"><span>&nbsp;<\/span>&nbsp;<\/a>' +
            //                '<a class=\"a1\"><span>&nbsp;<\/span>&nbsp;<\/a>' +
            //                '<a class=\"a1\"><span>&nbsp;<\/span>&nbsp;<\/a>' +
            //                '<a class=\"a1\"><span>&nbsp;<\/span>&nbsp;<\/a>' +
            //                '<a class=\"a1\"><span>&nbsp;<\/span>&nbsp;<\/a>' +
                '<\/div>' +
                '<\/div>' +
                '<\/div>';

            if ($("#Postion").length == 0) {
                $(this.render).prependTo('body');
            }

            $.fullSearch(this.currentInput, options);

            inputs.each(function (i, e) {

                var $e = $(e);
                if (i == 0)
                    this.currentInput = e;

                this.currentItem = -1;

                $e.focus(function (event) {
                    var p = $.getPostion(event.target);
                    $("#Postion").css({ top: p.bottom, left: p.left });
                    $("#Postion").fadeIn('slow');
                    $("#Postion").show();
                    this.currentInput = event.target;
                    $.fullSearch(this.currentInput, options, event.target.value);
                });

                $e.blur(function (event) {

                    if ($("#Postion").css("display") != "none") {


                        $("#Postion").hide();

                        if (event.target.value != "") {

                            var v = $("#port_list> a:first >span").attr("data-port"); //.replace(/@/g, "").split("|");
                            event.target.value = v; //v[3].trim();


                        }
                    }

                    this.currentInput = null;
                });

                $e.change(function (event) {

                });
                $e.keyup(function (event) {


                    //                                if (event.keyCode == 40) {

                    //                                   $("#port_list a:eq(" + this.currentItem + ")").removeClass("port_selected");
                    //                                   
                    //                                    this.currentItem += 1;
                    //                                    this.currentItem %= 12;

                    //                                   $("#port_list a:eq(" + this.currentItem + ")").addClass("port_selected");
                    //                                    
                    //                               }
                    //                                else if (event.keyCode == 38) {

                    //                                    $("#port_list a:eq(" + this.currentItem + ")").removeClass("port_selected");
                    //                                
                    //                                    if (this.currentItem == 0)
                    //                                       this.currentItem = 11;
                    //                                    else
                    //                                        this.currentItem -= 1;

                    //                                    $("#port_list a:eq(" + this.currentItem + ")").addClass("port_selected");

                    //                                }
                    //                                else {
                    $.fullSearch(this.currentInput, options, event.target.value);
                    //                                }
                });

                $e.click(function (event) {

                    var p = $.getPostion(event.target);
                    $("#Postion").css({ top: p.bottom, left: p.left });

                    $("#Postion").show();

                    $.fullSearch(this.currentInput, options, event.target.value);


                })


            });


        };

        $.sortSearch = function (a, b) {

            var c = a.match(/^[^\|]+/), d = b.match(/^[^\|]+/);

            return c > d ? 1 : (c == d ? 0 : -1);
        };


        $.fullSearch = function (input, options, value) {


            var $Suggest = $.positionor.defaults[options.suggesttype];
            var $Source = $.positionor.defaults[options.sourcetype];
            //  var $Source = $.positionor.defaults[options.suggesttype];

            if (value)
                value = value.replace(/\([^(]*\)/gi, "");


            var data = new Array();


            var l = 0;


            if (value && value.length > l) {

                $('#port_message').text("查找:" + value.replace(/\\/gi, ""));


                var rgSource = new RegExp("@[^@]*" + value + "[^@]*", "gi");
                data = $Source.match(rgSource);

                if (data) {
                    data.sort($.sortSearch);

                    for (i = 0; i < Math.min(data.length, 12); i++) {

                        var ct = data[i].match(/^[^\|]+/);

                        if (ct && (ct[0] == '@' + value.toUpperCase())) {

                            var temp = data[0];
                            data[0] = data[i];
                            data[i] = temp;
                        }
                    }
                } else {
                    var rgSuggest = new RegExp("[^@]+@", "gi");
                    $('#port_message').text("默认列表");
                    data = $Suggest.toString().match(rgSuggest);
                }


            } else {

                var rgSuggest = new RegExp("[^@]+@", "gi");


                $('#port_message').text("默认列表");

                data = $Suggest.toString().match(rgSuggest);
            }

            if (data) {


                $("#port_list a").each(function (i, e) {

                    var $e = $(e);

                    if (data[i]) {


                        var item = data[i].replace(/@/g, "").split("|");

                        if (i == 0)
                            $(input).attr("vid", item[2]);

                        //                        $e.html("<span>" + (options.sourcetype == 'port_source' ? item[3] + "(" + item[0] + ")" : item[3] || item[0]) + "</span>" + item[1]);
                        $e.html("<span data-port='" + item[3] + "'>" + item[3] + "(" + item[0] + ")" + "</span>" + item[1]);
                        $e.removeClass("anone");
                        $e.unbind("mousedown");

                        $e.bind("mousedown", function (event) {


                            if (input) {

                                $input = $(input);
                                //                            if ($("#Postion"))
                                //                                var v = $("span", $e).text(); //.replace(/@/g, "").split("|");

                                //$input.val(item[3] || item[0]);
                                //                                $input.val(options.sourcetype == 'port_source' ? item[3] + "(" + item[0] + ")" : item[3] || item[0]);
                                $input.val(item[3]);
                                $input.attr("vid", item[2]);

                                $AppendValue = $("#" + $input.attr("appendvalue"));

                                if ($AppendValue.length > 0)
                                    $AppendValue.val(item[1]);

                                $input.attr("vCountry", item[1]);

                                $("#Postion").hide();


                            }


                        });
                    } else {
                        $e.unbind("mousedown");
                        $e.empty();

                        $e.addClass("anone");
                    }


                });

                // input.value = data[0].replace(/@/g, "").split("|")[3];

            } else {

                $('#port_message').text("对不起, 找不到: " + value);


            }


        }


        //验证数字
        $.IsDigits = function (value) {

            if (value)
                return (!isNaN(value)) && (value > 0);


            return true;
        };

        //定位
        $.getPostion = function (obj) {

            var actualTop = obj.offsetTop;
            var actualLeft = obj.offsetLeft;

            var current = obj.offsetParent;

            while (current !== null) {
                actualTop += current.offsetTop;
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }

            return { left: actualLeft, right: actualLeft + obj.offsetWidth, top: actualTop, bottom: actualTop + obj.offsetHeight };

        };
        $.extend(Array.prototype, {
            remove: function (eqfunction) {
                var $tempA = [];
                if (!eqfunction) {
                    eqfunction = function () { return true };
                }
                while (pitem = this.pop()) {

                    if (eqfunction(pitem))
                        break
                    $tempA.push(pitem)
                }
                while (ptemp = $tempA.pop()) {
                    this.push(ptemp);
                }
                //            for (var q = 0; q < this.length; q++) {
                //                alert(this[q].Name);
                //            }


            },

            isExist: function (eqfunction) {

                var isExist = false;

                if (!eqfunction)
                    eqfunction = function () { return false };

                for (var i = 0; i < this.length; i++) {

                    if (eqfunction(this[i])) {
                        var isExist = true;
                        break;
                    }

                }

                return isExist;

            }
        });


        $.extend($.positionor, {
            defaults: {
                startPort_suggest: portSource.startPort_suggest,
                startPort_All: portSource.startPort_All,
                endPort_suggest: portSource.endPort_suggest,
                shiper_suggest: portSource.shiper_suggest,
                port_source: portSource.port_source,
                coutry_suggest: portSource.coutry_suggest,
                city_suggest: portSource.city_suggest,
                shiper_source: portSource.shiper_source,
                coutry_source: portSource.coutry_source,
                city_source: portSource.city_source,
                land_city_source: portSource.land_city_source

            }
        });

    } (jQuery));
});








