
/*
js上传图片
*/
define(['js/common/procopy/procopy', 'js/common/Tip/Tip'], function (require, exports, module) {
    var ZDK = require('js/common/procopy/procopy');
    ZDK.Tips = require('js/common/Tip/Tip');
    var Upload = function (options) {
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(options);
        }
        this.entry(options);
    };
    var contNumber = 0;
    Upload.prototype = {
        entry: function (options) {
            contNumber = options.maxNumber;
            var opche = this.opche = $.extend({
                target: null,
                file: 'file',
                maxSize: 10240,
                fileExt: '.jpg,.png,.gif,.rar,.zip,.jar,.psd,.txt,.ppt,.swf,.doc,.html,.htm,.pdf,.chm',
                multiLoad: true,
                uploadURI: null,
                progressURI: null,
                creatProgressID: function () {
                    return 'progres-' + ZDK.uuid();
                },
                no: true,
                tips: function (msg) {
                    try {
                        ZDK.Tips(msg, 3000, "warning");
                    } catch (e) {
                        alert(msg)
                    }
                },
                buttonClass: 'ui-upload',
                fileinputClass: 'ui-upload-btn',
                maxNumber: true
            }, options);
            this.target = $(opche.target).addClass(opche.buttonClass);
            this.createButtonFile();
            this.uploading = false;
            this.queue = [];
            this.queueFile = {};
            this.fileCache = {};
            this.trigger('inited', {
                target: this
            });
        },
        createButtonFile: function () {
            var self = this,
                opche = self.opche;
            self.progressID = opche.creatProgressID();
            self.buttonFile && self.buttonFile.remove();
            self.buttonFile = $('<input class="' + opche.fileinputClass + '" type="file" size="100" name="' + opche.file + '" ' + 'data-progressID="' + self.progressID + '" />').appendTo(self.target);
            self.buttonFile.bind('change', function () {
                var file = $(this).val();
                if (opche.checkExt) {
                    var fileExt = file.substring(file.lastIndexOf('.'), file.length).toLowerCase();
                    if (opche.fileExt.indexOf(fileExt) == -1) {
                        return opche.tips(opche.formatErrMsg || '不允许上传此类型文件');
                    }
                }
                if (!opche.no && self.fileCache[file]) {
                    return opche.tips('当前文件已经存在！');
                }
                if (!self.opche.multiLoad && self.uploading) {
                    window.console && console.log('不容许多个文件同时上传');
                    return;
                }
                if (!self.opche.maxNumber) {
                    self.opche.target.find(".ui-upload-btn").hide();
                    ZDK.Tips("上传文件数量不能超过" + contNumber + "个", 2000, "warning");
                    self.createButtonFile();
                    return false;
                }
                self.fileCache[file] = 1;
                self.fileCache[self.progressID] = file;
                self.onProgresreading();
            });
        },
        onProgresreading: function () {
            var self = this;
            var _Mnum = this.opche.maxNumber;
            if (typeof (_Mnum) != "boolean") {
                this.opche.maxNumber = _Mnum - 1;
            }
            var progressID = this.progressID;
            if (this.queue) {
                if (this.queue.length || this.uploading) {
                    var value = this.buttonFile.val();
                    this.trigger('onprogresreadqueue', {
                        progress: this.progressID,
                        target: this,
                        name: value
                    });
                    var data = {
                        progressID: this.progressID,
                        file: this.buttonFile
                    };
                    this.queue.push(data);
                    return this.createButtonFile();
                }
            } else if (this.uploading) {
                return false;
            }
            this.queueFile[this.buttonFile.val()] = true;
            var filename = this.buttonFile.val();
            filename = filename.indexOf("\\") < 0 ? filename : filename.substring(filename.lastIndexOf("\\") + 1);
            this.trigger('onprogresreading', {
                progress: this.progressID,
                traget: this,
                name: filename
            });
            if (!this.uploading) {
                this.createFormIframe(filename);
                this.buttonFile.appendTo(this.FORM);
                this.uploading = true;
                this.nowProgressID = progressID;
                this.FORM.prepend('<input type="hidden" value="' + progressID + '" name="UPLOAD_IDENTIFIER" />');
                try {
                    self.FORM.submit();
                } catch (e) {
                    self.opche.tips('请用IE6以上浏览器传附件!');
                }
                this.opche.progressURI && this.onProgresstart(progressID) || this.trigger('onprogresstart'); ;
            }
            this.createButtonFile();
        },
        onProgresstart: function (progressID) {
            var self = this,
                startTime = +new Date;
            this.progresNumber = 0;
            this.nocancel = true;
           
            (function () {
                var callee = arguments.callee;
                var url, type, dataType;
                //if (self.opche.progressURI.indexOf(window.location.host) == -1) {
                //    url = self.opche.progressURI + '?X-Progress-ID=' + progressID + '&jsonpcallback=?';
                //    dataType = 'jsonp';
                //} else {
                url = self.opche.progressURI + '?X-Progress-ID=' + progressID + '&t=' + new Date();
                if (self.opche.file_size_limit) url += "&s=1";
                dataType = 'json';
                //  }
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: dataType,
                    success: function (json) {
                        if (json) {
                            if (typeof (json) === 'string') json = eval(json);
                            if (!self.nocancel) return;
                            if ((json.Status == 3 || json.Status == 5) && json.BytesTotal != 0) {
                                if (parseFloat(json.BytesRead) >= parseFloat(json.BytesTotal)) {
                                    self.onProgresing(99, 100, progressID);
                                    self.uploading = false;
                                } else {
                                    self.onProgresing(parseFloat(json.BytesRead), parseFloat(json.BytesTotal), progressID);
                                }
                                if (++self.progresNumber == 1) {
                                    self.progresstime = (+new Date) - startTime;
                                }
                                // self.uploading && callee();
                            } else if (json.State == 8) {
                                self.uploading = false;
                            } else if (json.State == 'error') {
                                if (json.status == 413) {
                                    self.opche.tips('上传尺寸超过最大值:' + (self.opche.maxSize / 1024) + 'M');
                                } else {
                                    self.opche.tips(json.status + '错误');
                                }
                                self.trigger('onprogresserror', {
                                    progress: progressID,
                                    target: self
                                });
                                self.uploading = false;
                                return self.onCancelUpload(progressID);
                            }
                        }
                        if (self.uploading) {
                            setTimeout(function () {
                                self.uploading && callee();
                            }, 80);
                        }
                        //  }
                    }
                });
            })();
        },
        onProgresing: function (uploaded, total, progressID, time) {
            //if (this.progresNumber == 1) {
            //    if (this.opche.maxSize * 1024 < total) {
            //        this.opche.tips('上传尺寸超过最大值:' + (this.opche.maxSize / 1024) + 'M');
            //        this.trigger('onprogresserror', {
            //            progress: progressID,
            //            target: this
            //        });
            //        this.uploading = false;
            //        return this.onCancelUpload(progressID);
            //    }
            //}
            this.trigger('onprogresing', {
                progress: progressID,
                target: this,
                uploaded: uploaded,
                total: total,
                progresstime: time || self.progresstime || 1000
            })
        },
        onCancelUpload: function (progressID) {
            for (var len = this.queue.length - 1; len >= 0; len--) {
                if (this.queue[len].progressID == progressID) {
                    this.queue.splice(len, 1);
                }
            }
            delete this.fileCache[this.fileCache[progressID]];
            var _Mnum = this.opche.maxNumber;
            if (typeof (_Mnum) != "boolean") {
                this.opche.maxNumber = _Mnum + 1;
            }
            if (this.nowProgressID == progressID) {
                this.nocancel = false;
                this.removeFormIframe();
                this.trigger('oncancelupload', {
                    progress: progressID,
                    target: this
                });
                this.uploading = false;
                this.progresNumber = 0;
                this.uploadQueue();
            }
        },
        onProgresed: function (url, json) {
            var self = this;
            this.removeFormIframe();
            if (self.progresNumber == 0) {
                var nowProgressID = self.nowProgressID;
                self.onProgresing(Math.random(), 1, self.nowProgressID, 1000);
                (function (nowProgressID, url) {
                    setTimeout(function () {
                        self.trigger('onprogresed', {
                            progress: nowProgressID,
                            target: self,
                            url: url,
                            json: json
                        });
                        self.uploading = false;
                        self.progresNumber = 0;
                    }, 1000);
                })(nowProgressID, url);
            } else {
                self.trigger('onprogresed', {
                    progress: self.nowProgressID,
                    target: self,
                    url: url,
                    json: json
                });
                self.uploading = false;
                self.progresNumber = 0;
            }
        },
        onProgressError: function (msg) {
            this.opche.tips(msg);
            this.trigger('onprogresserror', {
                progress: self.nowProgressID,
                target: this
            });
        },
        uploadQueue: function () {
            if (this.queue.length) {
                var shift = this.queue.shift(),
                    self = this;
                this.createFormIframe();
                this.FORM.attr('action', this.FORM.attr('action').replace(/(X-Progress-ID=)([0-9.]+)$/, '$1' + shift.progressID));
                shift.file.appendTo(this.FORM);
                this.trigger('onprogresreading', {
                    progress: shift.progressID,
                    traget: this,
                    name: shift.file.val()
                });
                this.FORM.prepend('<input type="hidden" value="' + shift.progressID + '" name="UPLOAD_IDENTIFIER" />');
                this.uploading = true;
                setTimeout(function () {
                    self.nowProgressID = shift.progressID;
                    self.FORM.submit();
                }, 100);
                console.log('this.opche.progressURI', this.opche.progressURI);
                this.opche.progressURI && this.onProgresstart(shift.progressID);
            }
        },
        createFormIframe: function (fileName) {
            if (!this.IFrame) {
                var name = 'uploadpRrogress_' + (+new Date),
                    self = this;
                var callback = this.callback = 'uploadSuccess' + (+new Date);

                var url = this.opche.uploadURI + (this.opche.uploadURI.indexOf('?') > -1 ? '&' : '?') + '&ifr=2&iframe=1&domain=' + document.domain + '&jsonpcallback=' + callback + "&X-Progress-ID=" + this.progressID;
                if (fileName) url += '&fileName=' + fileName;
                window[callback] = function (json) {
                    self.uploading = false;
                    self.removeFormIframe();
                    if (json.state == 1) {
                        self.onProgresed(json.msg || json.img, json);
                    } else {
                        self.onProgressError(json.msg);
                    }
                    self.uploadQueue();
                };
                this.IFrame = $('<iframe name="' + name + '" width="0" height="0" frameborder="0" style="dispaly:none;"></iframe>').appendTo(document.body);
                this.FORM = $('<form action="' + url + '" target="' + name + '" method="post" enctype="multipart/form-data" style="display:none;"></form>').appendTo(document.body);
            }
        },
        removeFormIframe: function () {
            if (this.IFrame) {
                this.IFrame.remove();
                this.FORM.remove();
                this.IFrame = this.FORM = null;
            }
        },
        refreshNum: function (num) {
            var _Mnum = this.opche.maxNumber;
            if (typeof (_Mnum) != "boolean") {
                this.opche.maxNumber = num || _Mnum + 2;
                if (this.opche.maxNumber >= 1) this.opche.target.find(".ui-upload-btn").show();
            }
        }
    };

    module.exports = ZDK.procopy(Upload, ZDK.EventEmitter);

});