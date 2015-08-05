/*
Ajax 三级省市联动
http://code.ciaoca.cn/
日期：2012-7-18

settings 参数说明
-----
url:省市数据josn文件路径
prov:默认省份
city:默认城市
dist:默认地区（县）
nodata:无数据状态
required:必选项
------------------------------ */

define(['jquery'], function (require, exports, module) {
    (function ($) {
        $.fn.citySelect = function (settings) {
            if (this.length < 1) { return; };

            // 默认值
            settings = $.extend({
                url: "/Static/js/lib/jquery.cityselect/city.min.js",
                prov: null,
                city: null,
                dist: null,
                nodata: null,
                required: true
            }, settings);

            var box_obj = this;
            var prov_obj = box_obj.find(".prov");
            var city_obj = box_obj.find(".city");
            var dist_obj = box_obj.find(".dist");
            var prov_val = settings.prov;
            var city_val = settings.city;
            var dist_val = settings.dist;
            var cityId = settings.cityId;
            var select_prehtml = ( settings.required) ? "" : "<option value=''>请选择</option>";
            var city_json;

            // 赋值市级函数
            var cityStart = function () {
                var prov_id = prov_obj.val();
                if (prov_id) {
                    city_obj.empty().attr("disabled", true);
                    dist_obj.empty().attr("disabled", true);
                    $.getJSON(settings.url, { action: 'city', prov_id: prov_id }, function (city_json) {
                        // 遍历赋值市级下拉列表
                        temp_html = city_val ? "" : (dist_obj.hide() && select_prehtml); 
                        $.each(city_json, function (i, city) {
                            if (city_val == city.Name) {
                                temp_html = "<option value='" + city.RegionId + "'>" + city.Name + "</option>" + temp_html;
                                city_val = null;
                            } else
                                temp_html += "<option value='" + city.RegionId + "'>" + city.Name + "</option>";
                        });
                        city_obj.html(temp_html).attr("disabled", false).css({ "display": "", "visibility": "" });
                     
                    })
                } else {
                    city_obj.hide();
                   
                }
            };

            // 赋值地区（县）函数
            var distStart = function () {
                var city_id = cityId || city_obj.val();
                cityId = null;
                if (city_id) {
                    dist_obj.empty().attr("disabled", true);
                    $.getJSON(settings.url, { action: 'dist', city_id: city_id }, function (distjson) {
                        // 遍历赋值市级下拉列表
                        temp_html = dist_val ? "" : select_prehtml;
                        $.each(distjson, function (i, dist) {
                            if (dist_val == dist.Name) {
                                temp_html = "<option value='" + dist.RegionId + "'>" + dist.Name + "</option>" + temp_html;
                                dist_val = null;
                            } else
                                temp_html += "<option value='" + dist.RegionId + "'>" + dist.Name + "</option>";
                        });
                        dist_obj.html(temp_html).attr("disabled", false).css({ "display": "", "visibility": "" });
                    });
                } else {
                    dist_obj.hide();
                }
            };

            var init = function () {
                // 遍历赋值省份下拉列表
                temp_html = prov_val ? "" : select_prehtml;
                $.each(city_json, function (i, prov) {
                    if (prov.Name == prov_val) {
                        temp_html = "<option value='" + prov.RegionId + "'>" + prov.Name + "</option>" + temp_html;
                        prov_val = null;
                    } else {
                        temp_html += "<option value='" + prov.RegionId + "'>" + prov.Name + "</option>";
                    }
                });
                prov_obj.html(temp_html);

                // 若有传入省份与市级的值，则选中。（setTimeout为兼容IE6而设置）
                setTimeout(function () {
                    //                    if (settings.prov != null) {
                    //                        prov_obj.val(settings.prov);
                    cityStart();
                    distStart();
                    //                        setTimeout(function () {
                    //                            if (settings.city != null) {
                    //                                city_obj.val(settings.city);
                    //                                distStart();
                    //                                setTimeout(function () {
                    //                                    if (settings.dist != null) {
                    //                                        dist_obj.val(settings.dist);
                    //                                    };
                    //                                }, 1);
                    //                            };
                    //                        }, 1);
                    // };
                }, 1);

                // 选择省份时发生事件
                prov_obj.bind("change", function () {
                    cityStart();
                });

                city_obj.bind("change", function () {
                    distStart();
                });
            };

            // 设置省市json数据
            if (typeof (settings.url) == "string") {
                $.getJSON(settings.url, { action: 'province' }, function (json) {
                    city_json = json;
                    init();
                });
            } else {
                city_json = settings.url;
                init();
            };
        };
    })(jQuery);
});