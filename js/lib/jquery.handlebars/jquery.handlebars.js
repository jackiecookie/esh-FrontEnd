﻿define(["js/common/handlebars/handlebars.js"],function(a){var b=a("js/common/handlebars/handlebars.js");!function(a){var c={};a.fn.handlebars=function(d,e,f){return d instanceof jQuery&&(d=a(d).html()),c[d]=b.compile(d),this.html(c[d](e)),f&&f.call(this),this}}(jQuery)});