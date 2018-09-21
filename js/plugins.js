// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () {
    };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

(function () {
   var application = (window.application = window.application || {});
   //TODO
    
    application.saveSessionId = function (sessionId) {
        storage.saveToLocal('session',sessionId);
    }
    application.loadSessionId =function () {
        return storage.loadFromLocal('session');
    }
    application.saveManager = function (manager) {
        storage.saveToLocal('manager',JSON.stringify(manager));
    }
    application.loadManager = function () {
        var str = storage.loadFromLocal('manager');
        return JSON.parse(str);
    }
}())

(function () {
   var storage = (window.storage = window.storage || {});
   storage.saveToLocal = function (key,val) {
       localStorage.setItem(key,val);
   }
   storage.saveToSession = function (key,val) {
       sessionStorage.setItem(key,val);
   }
   storage.loadFromLocal = function (key) {
       return localStorage.getItem(key);
   }
   storage.loadFromSession = function (key) {
       return sessionStorage.getItem(key);
   }
}())

(function () {
       var storage = (window.storage = window.storage || {});

       storage.saveSessionId = function (sessionId) {
           saveToLocal('session',sessionId);
       }

       storage.loadSessionId = function () {
           return loadFromLocal('session');
       }

       storage.saveManager = function (manager) {
            saveToLocal('manager',JSON.stringify(manager));
       }

       storage.loadManager = function () {
           var manager = loadFromLocal('manager');
           if ( !check.isEmpty(manager) ){
               return JSON.parse(manager);
           }
           return null;
       }
       
       var saveToLocal = function saveToLocal(key,val) {
           localStorage.setItem(key,val);
       };
       var saveToSession = function saveToSession(key,val) {
           sessionStorage.setItem(key,val);
       };
       var loadFromLocal = function loadFromLocal(key) {
           return localStorage.getItem(key);
       };
       var loadFromSession = function loadFromSession(key) {
           var session = sessionStorage;
           return sessionStorage.getItem(key);
       };
}());

(function () {
        var PATTERN_MOBILE = /^1\d{10}$/;
        var PATTERN_EMAIL = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        var PATTERN_PWD = /^[A-Za-z0-9]{6,16}$/;
        var check = (window.check = window.check || {});
        check.isEmpty = function (val) {
            if (val == "" || val == null || val == undefined)
                return true;
        }
        check.isPhone = function (phone) {
            return PATTERN_MOBILE.test(phone);
        }
        check.isEmail = function (email) {
            return PATTERN_EMAIL.test(email);
        }
        check.isPwd = function (pwd) {
            return PATTERN_PWD.test(pwd);
        }
        check.isObj = function (obj) {
            return typeof(obj) == 'object';
        }
        check.isArr = function (arr) {
            return Array.isArray(arr);
        }
}());

(function ($) {
    var passer = (window.passer = window.passer || {});
    passer.mergeToUrl = function (url,obj) {
        var result = url;
        if ( typeof obj === Object ){
            result += '?'
            var param = JSON.stringify(obj);
            result+=result+'param='+param;
        }
        return result;
    }
    passer.loadFromUrl = function (url) {
        var arr = url.split('?');
        if ( arr.length > 0 ){
            var str = arr[1].split('=')[1];
            return JSON.parse(str);
        } else {
            return {};
        }
    }
    
    passer.saveToStorage = function (key,obj) {
        storage.saveToSession(key,obj);
    }
    passer.loadFromStorage = function (key) {
        return storage.loadFromSession(key)
    }
    
    passer.saveToCookie = function (key,obj) {
        //TODO
    }
    passer.loadFromCookie = function (key) {
        //TODO
    }
}(jQuery))

(function () {
        var urlHelper = (window.urlHelper = window.urlHelper || {});
        urlHelper.mergeParam = function (url, map) {
            if (map) {
                url += '?';
                for (var key in map) {
                    url += key + '=' + JSON.stringify(map[key]) + '&';
                }
                if (url.charAt(url.length - 1) == '&') {
                    url = url.substring(0, url.length - 1);
                }
            }
            return url;
        }
        urlHelper.loadParam = function (url) {
            var result = {};
            var params = url.split('?')[1];
            if (params) {
                var array = params.split('&');
                for (var index in array) {
                    var set = array[index].split('=')
                    try {
                        result[set[0]] = JSON.parse(decodeURI(set[1]));
                    } catch (err) {
                        return {};
                    }
                }
            }
            return result;
        }
}());

(function ($) {
    var base = 'http://localhost:8080/bili/';
    var http = (window.http = window.http || {});
    
    var filter = function (data,type) {
        //TODO
        return data;
    }

    var _action404 = function () {
        window.location.href = '404.html';
    }

    var _topWindow = function (window) {
        window.parent != window ? _topWindow(window.parent) : window;
    }

    var _request = function (def,request) {
        $.extend(def,request);
        def.url = base + def.url;
        def.success = _buildSuccessBack(request.url,request.success);
        $.ajax(def);
    }

    http.upload = function (request) {
        if ( typeof request !== Object ){
            //TODO
        }
        var def = _buildDefUpload();
        _request(def,request);
    }

    http.request = function (request) {
        if ( typeof request !== Object ){
            //TODO
        }
        var def = _buildDefRequest();
        _request(def,request);
    }
    
    var _buildSuccessBack = function (url,success) {
        return function (data, textStatus, response) {
            if ( data.responseId == 101 && url != "Manager/checkLogin.do" ){
                _topWindow(window).location.href = 'login.html';
            } else {
                success(data, textStatus, response);
            }
        }
    }

    var _buildDefRequest = function () {
        return {
            type:'post',
            contentType:'application/json;charset=utf-8',
            dataType:'json',
            beforeSend:function (req) {
                req.setRequestHeader('sessionId',window.storage.loadSessionId());
            },
            timeout:60 * 1000,
            statusCode:{
                404:_action404
            },
            dataFilter:filter
        };
    }

    var _buildDefUpload = function () {
        return {
            type:'post',
            cache:false,
            processData: false,
            contentType: false,
            dataType:"json",
            beforeSend:function (req) {
                req.setRequestHeader('sessionId',window.storage.loadSessionId());
            },
            statusCode:{
                404:_action404
            }
        }
    }
    
}(jQuery))

(function ($) {
        var baseUrl = 'http://localhost:8080/bili/';
        var http = (window.http = window.http || {});

        var dataFilter = function (data,type) {
            //TODO
            return data;
        }

        var dispose404 = function () {
            //TODO
            window.location.href = '404.html';
        }

        var getTopWindow = function (window) {
            if ( window.parent != window ){
                return getTopWindow(window.parent);
            }
            return window;
        }

        http.getBaseUrl = function () {
            return baseUrl;
        }

        http.uploadFile = function (request) {
            var def = {
                type:'post',
                cache:false,
                processData: false,
                contentType: false,
                dataType:"json",
                beforeSend:function (req) {
                    req.setRequestHeader('sessionId',window.storage.loadSessionId());
                },
                statusCode:{
                    404:dispose404
                }
            };
            $.extend(def,request);
            def.url = baseUrl + def.url;

            def.success = function (data, textStatus, response) {
                if ( data.responseId == 101 && request.url != "Manager/checkLogin.do" ){
                    getTopWindow(window).location.href = 'login.html';
                } else {
                    request.success(data, textStatus, response);
                }
            }
            $.ajax(def);
        }
        
        http.request = function (request) {
            var def = {
                type:'post',
                contentType:'application/json;charset=utf-8',
                // contentType:'application/x-www-form-urlencoded',
                dataType:'json',
                beforeSend:function (req) {
                    req.setRequestHeader('sessionId',window.storage.loadSessionId());
                },
                timeout:60 * 1000,
                statusCode:{
                    404:dispose404
                }
            };
            $.extend(def,request);
            def.url = baseUrl + def.url;
            def.data = JSON.stringify(def.data);
            def.dataFilter = dataFilter;
            def.success = function (data, textStatus, response) {
                if ( data.responseId == 101 && request.url != "Manager/checkLogin.do" ){
                    getTopWindow(window).location.href = 'login.html';
                } else {
                    request.success(data, textStatus, response);
                }
            }
            $.ajax(def);
        }
}(jQuery));

(function ($) {
    var dialog = (window.dialog = window.dialog || {});

    /**
     * @Param {title:'title',url:'url',area:{width:100,height:100}} obj
     * */
    dialog.showFrameDialog = function (obj) {
        var builder = _frameDialog(obj);
        _showDialog(builder);
    }

    var _frameDialog = (function () {
        var shared = {};
        var object;
        var className = 'frame';
        //object = {title:'title',url:'url',area:{width:100,height:100}}
        var height;
        var width;
        var dlg;
        var body;

        shared.getBuilder = function (obj) {
            object = obj;
            return {
                className: className,
                buildTitle: buildTitle,
                buildContent: buildContent,
                getArea: getArea,
                addListener: addListener
            }
        }

        var buildTitle = function (title) {
            var html = '    <cite>' + object.title + '</cite>\n' +
                '    <div class="myui-dialog-oprator">\n' +
                '        <i class="iconfont ' + className + ' minimize">&#xe600;</i>\n' +
                '        <i class="iconfont ' + className + ' maximize">&#xe61b;</i>\n' +
                '        <i class="iconfont hide ' + className + ' resize">&#xe602;</i>\n' +
                '        <i class="iconfont ' + className + ' close">&#xe647;</i>\n' +
                '        </div>';
            title.append(html);
        }

        var buildContent = function (content) {
            var html = '<iframe frameborder="0" scrolling="yes"></iframe>';
            content.append(html);
        }

        var closeDialog = function () {
            dlg.remove();
            dlg = undefined;
        }

        // var showCenter = function () {
        //     var maxWidth = window.innerWidth;
        //     var maxHeight = window.innerHeight;
        //     var top = (maxHeight - height) / 2;
        //     var left = (maxWidth - width) / 2;
        //
        //     body.height(height);
        //     body.width(width);
        //     body[0].style.top = top + 'px';
        //     body[0].style.bottom = 'auto';
        //     body[0].style.left = left + 'px';
        //     body[0].style.right = 'auto';
        // }

        var getArea = function () {
            var maxWidth = window.innerWidth;
            var maxHeight = window.innerHeight;

            var area = object.area;
            if (area && area.width && area.width < maxWidth) {
                width = area.width;
            } else {
                width = maxWidth * 0.8;
            }
            if (area && area.height && area.height < maxHeight) {
                height = area.height;
            } else {
                height = maxHeight * 0.8;
            }
            return {width: width, height: height};
        }

        var addListener = function (dialog) {
            if (object.data) {
                var url = passer.mergeToUrl(object.url,object.data);
                dialog.find('iframe').attr('src', url);
            } else {
                dialog.find('iframe').attr('src', object.url);
            }
            dlg = dialog;
            body = dialog.find('.myui-dialog-body');
            dialog.on('click', onOutSide);
            dialog.find('.minimize').on('click', onMinimize);
            dialog.find('.maximize').on('click', onMaximize);
            dialog.find('.resize').on('click', onResize);
            dialog.find('.close').on('click', onClose);
            body.on('click', function () {
                return false;
            })
        }

        var onOutSide = function () {
            closeDialog();
            if (typeof object.callback === "function" ) { object.callback("outside") };
        }

        var onMinimize = function () {
            clearOpratorStatus();
            body.height(50);
            body.width('auto');

            body[0].style.top = 'auto';
            body[0].style.bottom = '0px';
            body[0].style.left = '0px';
            body[0].style.right = 'auto';
            body.find('.minimize').addClass('hide');
            if (typeof object.callback === "function" ) { object.callback("minimize") };
        };

        var onMaximize = function () {
            clearOpratorStatus();
            body.height(window.innerHeight);
            body.width(window.innerWidth);
            body[0].style.top = '0px';
            body[0].style.left = '0px';
            body.find('.maximize').addClass('hide');
            if (typeof object.callback === "function" ) { object.callback("maxmize") };
        };

        var onResize = function () {
            clearOpratorStatus();
            _showCenter(body, height, width);
            // showCenter();
            body.find('.resize').addClass('hide');
            if (typeof object.callback === "function" ) { object.callback("resize") };
        };

        var clearOpratorStatus = function () {
            dlg.find('.minimize').removeClass('hide');
            dlg.find('.maximize').removeClass('hide');
            dlg.find('.resize').removeClass('hide');
        }

        var onClose = function () {
            closeDialog();
            if (typeof object.callback === "function" ) { object.callback("close") };
        };
        return shared;
    })();


    dialog.showToastDialog = function () {

    }

    dialog.showPromptDialog = function () {

    }

    var _showDialog = function (builder) {
        var temp = _template(builder.className);
        var title = temp.find('.myui-dialog-title');
        builder.buildTitle(title);
        var content = temp.find('.myui-dialog-content');
        builder.buildContent(content);

        $('body').append(temp);
        var area = builder.getArea(temp);
        if (!area) {
            area = {width: window.innerWidth * 0.8, height: window.innerHeight * 0.8}
        } else if (!area.width) {
            area.width = window.innerWidth * 0.8;
        } else if (!area.height) {
            area.height = window.innerHeight * 0.8;
        }

        var body = temp.find('.myui-dialog-body');
        _showCenter(body, area.height, area.width);

        temp.addClass('show');
        var body = temp.find('.myui-dialog-body');
        body.addClass('myui-m-anim-scale');
        // body[0].addEventListener('transitionend',transition);
        builder.addListener(temp);
    }

    var _template = function (className) {
        var html = '        <div class="myui-dialog ${customer}">\n' +
            '            <div class="myui-dialog-body ${customer}">\n' +
            '                <div class="myui-dialog-title ${customer}"></div>\n' +
            '                <div class="myui-dialog-content ${customer}"></div>\n' +
            '            </div>\n' +
            '        </div>';
        html = html.replace(/\${customer}/g, className);

        return $(html);
    }

    var _showCenter = function (body, height, width) {
        var maxWidth = window.innerWidth;
        var maxHeight = window.innerHeight;
        var top = (maxHeight - height) / 2;
        var left = (maxWidth - width) / 2;

        body.height(height);
        body.width(width);
        body[0].style.top = top + 'px';
        body[0].style.bottom = 'auto';
        body[0].style.left = left + 'px';
        body[0].style.right = 'auto';
    }
}(jQuery))

(
// if (typeof jQuery === 'undefined') { throw new Error('DCalendar.Picker: This plugin requires jQuery'); }
// +
    function ($) {
        var myui = (window.myui = window.myui || {});
        var dialog = (function ($) {
            var shared = {};
            var frameDialog = (function () {
                var shared = {};
                var object;
                var className = 'frame';
                //object = {title:'title',url:'url',area:{width:100,height:100}}
                var height;
                var width;
                var dlg;
                var body;

                shared.getBuilder = function (obj) {
                    object = obj;
                    return {
                        className: className,
                        buildTitle: buildTitle,
                        buildContent: buildContent,
                        getArea: getArea,
                        addListener: addListener
                    }
                }

                var buildTitle = function (title) {
                    var html = '    <cite>' + object.title + '</cite>\n' +
                        '    <div class="myui-dialog-oprator">\n' +
                        '        <i class="iconfont ' + className + ' minimize">&#xe600;</i>\n' +
                        '        <i class="iconfont ' + className + ' maximize">&#xe61b;</i>\n' +
                        '        <i class="iconfont hide ' + className + ' resize">&#xe602;</i>\n' +
                        '        <i class="iconfont ' + className + ' close">&#xe647;</i>\n' +
                        '        </div>';
                    title.append(html);
                }

                var buildContent = function (content) {
                    var html = '<iframe frameborder="0" scrolling="yes"></iframe>';
                    content.append(html);
                }

                var closeDialog = function () {
                    dlg.remove();
                    dlg = undefined;
                }

                var showCenter = function () {
                    var maxWidth = window.innerWidth;
                    var maxHeight = window.innerHeight;
                    var top = (maxHeight - height) / 2;
                    var left = (maxWidth - width) / 2;

                    body.height(height);
                    body.width(width);
                    body[0].style.top = top + 'px';
                    body[0].style.bottom = 'auto';
                    body[0].style.left = left + 'px';
                    body[0].style.right = 'auto';
                }

                var getArea = function () {
                    var maxWidth = window.innerWidth;
                    var maxHeight = window.innerHeight;

                    var area = object.area;
                    if (area && area.width && area.width < maxWidth) {
                        width = area.width;
                    } else {
                        width = maxWidth * 0.8;
                    }
                    if (area && area.height && area.height < maxHeight) {
                        height = area.height;
                    } else {
                        height = maxHeight * 0.8;
                    }
                    return {width: width, height: height};
                }

                var addListener = function (dialog) {
                    if (object.data) {
                        var url = urlHelper.mergeParam(object.url, {param: object.data});
                        dialog.find('iframe').attr('src', url);
                    } else {
                        dialog.find('iframe').attr('src', object.url);
                    }
                    dlg = dialog;
                    body = dialog.find('.myui-dialog-body');
                    dialog.on('click', onOutSide);
                    dialog.find('.minimize').on('click', onMinimize);
                    dialog.find('.maximize').on('click', onMaximize);
                    dialog.find('.resize').on('click', onResize);
                    dialog.find('.close').on('click', onClose);
                    body.on('click', function () {
                        return false;
                    })
                }

                var onOutSide = function () {
                    closeDialog();
                    if (typeof object.callback === "function" ) { object.callback("outside") };
                }

                var onMinimize = function () {
                    clearOpratorStatus();
                    body.height(50);
                    body.width('auto');

                    body[0].style.top = 'auto';
                    body[0].style.bottom = '0px';
                    body[0].style.left = '0px';
                    body[0].style.right = 'auto';
                    body.find('.minimize').addClass('hide');
                    if (typeof object.callback === "function" ) { object.callback("minimize") };
                };

                var onMaximize = function () {
                    clearOpratorStatus();
                    var maxWidth = window.innerWidth;
                    var maxHeight = window.innerHeight;
                    body.height(maxHeight);
                    body.width(maxWidth);
                    body[0].style.top = '0px';
                    body[0].style.left = '0px';
                    body.find('.maximize').addClass('hide');
                    if (typeof object.callback === "function" ) { object.callback("maxmize") };
                };

                var onResize = function () {
                    clearOpratorStatus();
                    showCenter();
                    body.find('.resize').addClass('hide');
                    if (typeof object.callback === "function" ) { object.callback("resize") };
                };

                var clearOpratorStatus = function () {
                    dlg.find('.minimize').removeClass('hide');
                    dlg.find('.maximize').removeClass('hide');
                    dlg.find('.resize').removeClass('hide');
                }

                var onClose = function () {
                    closeDialog();
                    if (typeof object.callback === "function" ) { object.callback("close") };
                };
                return shared;
            })();
            var toastDialog = (function () {
                var shared = {};
                var className = 'toast';
                var obj;
                var dlg;
                shared.getBuilder = function (object) {
                    obj = object;
                    return {
                        className: className,
                        buildTitle: buildTitle,
                        buildContent: buildContent,
                        getArea: getArea,
                        addListener: addListener
                    };
                }

                var buildTitle = function (title) {

                }
                var buildContent = function (content) {
                    var html = '    <div>\n';
                    if (!obj.success) {
                        html += '        <i class="iconfont">&#xe615;</i>\n';
                    } else {
                        html += '        <i class="iconfont success">&#xe603;</i>\n';
                    }
                    html += '        <cite class="content">' + obj.content + '</cite>\n' +
                        '    </div>';
                    content.append(html);
                }

                var getArea = function (dialog) {
                    var width = 0;
                    var children = dialog.find('.myui-dialog-content div').children();
                    children.each(function () {
                        width += $(this).outerWidth(true);
                    })
                    return {width: width, height: 64};
                }
                var addListener = function (dialog) {
                    dlg = dialog;
                    setTimeout(closeDialog, 2000);
                }

                var closeDialog = function () {
                    dlg.remove();
                }
                return shared;
            })();
            var promptDialog = (function () {
                var shared = {};
                var className = 'prompt';
                var obj;
                // {
                //     title:'',
                //     content:'',
                //     sureCallback:function () {}
                //     cancelCallback:function () {}
                // }
                var dlg;
                shared.getBuilder = function (object) {
                    obj = object;
                    return {
                        className: 'prompt',
                        buildTitle: buildTitle,
                        buildContent: buildContent,
                        getArea: getArea,
                        addListener: addListener
                    }
                };

                var buildTitle = function (title) {
                    var html = '    <cite>' + obj.title + '</cite>\n' +
                        '    <div class="myui-dialog-oprator">\n' +
                        '        <i class="iconfont ' + className + ' close">&#xe647;</i>\n' +
                        '        </div>';
                    title.append(html);
                }

                var buildContent = function (content) {
                    var html = '        <cite class="content">' + obj.content + '</cite>\n' +
                        '        <div class="buttons">\n' +
                        '            <button class="btn sure">确定</button>\n' +
                        '            <button class="btn cancel">取消</button>\n' +
                        '        </div>';
                    content.append(html);
                }

                var getArea = function (dialog) {
                    return {height: 154, width: 260};
                }

                var addListener = function (dialog) {
                    dlg = dialog;
                    dialog.find('.close').on('click', closeDialog);
                    dialog.find('.sure').on('click', sureClick);
                    dialog.find('.cancel').on('click', cancelClick);
                }

                var closeDialog = function () {
                    dlg.remove();
                }

                var sureClick = function () {
                    closeDialog();
                    obj.sureCallback();
                }

                var cancelClick = function () {
                    closeDialog();
                    obj.cancelCallback()
                }
                return shared;
            })();

            /**
            * @param {title:'title',url:'url',area:{width:100,height:100}}
            * */
            shared.showFrameDialog = function (obj) {
                // frameDialog.build(obj);
                var builder = frameDialog.getBuilder(obj);
                showDialog(builder);
            }

            /**
             * @Param {content:'',success:false}
             * */
            shared.showToastDialog = function (obj) {
                var builder = toastDialog.getBuilder(obj);
                showDialog(builder);
            }

            /**
             * @Param {title:'',content:''}
             * */
            shared.showPromptDialog = function (obj) {
                var builder = promptDialog.getBuilder(obj);
                showDialog(builder);
            }

            var showDialog = function (builder) {
                var temp = getTemplate(builder.className);
                var title = temp.find('.myui-dialog-title');
                builder.buildTitle(title);
                var content = temp.find('.myui-dialog-content');
                builder.buildContent(content);

                $('body').append(temp);
                var area = builder.getArea(temp);
                if (!area) {
                    area = {width: window.innerWidth * 0.8, height: window.innerHeight * 0.8}
                } else if (!area.width) {
                    area.width = window.innerWidth * 0.8;
                } else if (!area.height) {
                    area.height = window.innerHeight * 0.8;
                }

                var body = temp.find('.myui-dialog-body');
                showCenter(body, area.height, area.width);

                temp.addClass('show');
                var body = temp.find('.myui-dialog-body');
                body.addClass('myui-m-anim-scale');
                // body[0].addEventListener('transitionend',transition);
                builder.addListener(temp);
            }

            var transition = function () {
                $(this).removeClass('myui-m-anim-scale');
            }

            var showCenter = function (body, height, width) {
                var maxWidth = window.innerWidth;
                var maxHeight = window.innerHeight;
                var top = (maxHeight - height) / 2;
                var left = (maxWidth - width) / 2;

                body.height(height);
                body.width(width);
                body[0].style.top = top + 'px';
                body[0].style.bottom = 'auto';
                body[0].style.left = left + 'px';
                body[0].style.right = 'auto';
            }

            var getTemplate = function (className) {
                var html = '        <div class="myui-dialog ${customer}">\n' +
                    '            <div class="myui-dialog-body ${customer}">\n' +
                    '                <div class="myui-dialog-title ${customer}"></div>\n' +
                    '                <div class="myui-dialog-content ${customer}"></div>\n' +
                    '            </div>\n' +
                    '        </div>';
                html = html.replace(/\${customer}/g, className);

                return $(html);
            }
            return shared;
        })(jQuery);

        /**
         * @param {jquery} container
         * @param {pageSize:一页显示条数} option
         * @param {
         *      page:当前页数，
         *      lines:数据条数,
         *      getTitle:function,
         *      getView:function,
         *      addListener:function,
         *      onPageChange:function
         * }
         * */
        var Table = function (container, option, data) {
            var local = {};
            local['container'] = container;
            local['option'] = {pageSize: 10};
            local['data'] = data;
            // this.container = container;
            // this.option = {pageSize: 10};
            // this.data = data;
            //{lines:100,curPage:1,operOption:{},getView}

            if (option) {
                $.extend(local['option'], option)
            }

            var createTable = function () {
                var html = '    <table class="myui-table">' +
                    '      <thead>' +
                    '      </thead>' +
                    '      <tbody>' +
                    '      </tbody>' +
                    '    </table>';
                return $(html);
            };

            var init = function (option, data) {
                if (local['container'].find('.myui-table').length <= 0) {
                    local['table'] = createTable();
                    local['container'].append(local['table']);
                }
                local['table'] = local['container'].find('.myui-table');

                if (option) {
                    $.extend(local['option'], option)
                }
                local['data'] = data;

                var size = Math.ceil(local['data'].lines / local['option'].pageSize);

                if (size > 1) {
                    var operData = {};
                    operData.cur = data.page;
                    operData.size = Math.ceil(local['data'].lines / local['option'].pageSize);
                    operData.callback = operCallback;
                    if (local['operation']) {
                        local['operation'].rebuildTabOper(local['container'], local['data'].option);
                    } else {
                        local['operation'] = new TableOper(local['container'], local['data'].option, operData);
                    }
                }
                refreshTableTitle();
                refreshTableItem(local['operation']?local['operation'].getCurrentPage():1);
            };

            var operCallback = function (page) {
                local['data'].page = page;
                refreshTableItem(page);
            };


            var refreshTableItem = function (page) {
                local['table'].find('tbody').empty();
                var index = 0;
                for (var i = 0; i < local['option'].pageSize; i++) {
                    index = (page - 1) * local['option'].pageSize + i;
                    if (index < local['data'].lines) {
                        var view = local['data'].getView(index);
                        local['table'].find('tbody').append(view);
                    }
                }
                if (typeof local['data'].onPageChange === "function"){local['data'].onPageChange(page)};
                if (typeof local['data'].addListener === "function"){local['data'].addListener()};
            };
            var refreshTableTitle = function () {
                var title = local['data'].getTitle();
                if (local['table'].find('thead').children().length <= 0) {
                    local['table'].find('thead').append(title);
                }
            };

            init(option, data);
            var shared = {};
            shared.rebuildTable = init;
            shared.refreshTable = refreshTableItem;
            shared.getCurrentPage = function () {
                return data.page;
            }

            return shared;
        }

        var TableOper = function (container, option, data) {
            var local = {};
            local['option'] = {count: 9, ellipsis: '...', selectClass: 'selected', ellipsisClass: 'ellipsis'};
            if (option) {
                $.extend(local['option'], option)
            }
            local['data'] = data;
            local['container'] = undefined;

            var createTableOper = function () {
                var html = '      <div class="myui-table-operator">\n' +
                    '        <button id="prev" class="btn"><<</button>\n' +
                    '        <div id="middle">\n' +
                    '        </div>\n' +
                    '        <button id="next" class="btn">>></button>\n' +
                    '      </div>';
                return html;
            }
            
            var createOperBtn = function (content, selected) {
                var html = '<button class="btn';
                if (local['option'].ellipsis == content) {
                    html += ' ' + local['option'].ellipsisClass;
                }
                if (selected) {
                    html += ' ' + local['option'].selectClass;
                }
                html += '">' + content + '</button>';
                return html;
            }

            var operClickListener = function () {
                var btn = $(this).html();
                var cur = local['data'].cur;
                var page;
                if ("&lt;&lt;" == btn) {
                    page = cur - 1;
                } else if ("&gt;&gt;" == btn) {
                    page = cur + 1;
                } else {
                    page = parseInt(btn);
                }
                if (page < 1 || page > local['data'].size) {
                    return;
                }
                refreshTabOper(page);
                local['data'].callback(page);
            }

            var refreshTabOper = function (page) {
                var opers = local['container'].find('#middle .btn');

                if (local['data'].size > local['option'].count) {
                    var size = local['data'].size;
                    var cur = page;
                    var contents = getOpersContent(cur, size);
                    for (var i = 0; i < local['option'].count; i++) {
                        $(opers[i]).html(contents[i]);
                    }
                }

                opers.each(function () {
                    var content = $(this).html();
                    if (content == page) {
                        $(this).addClass(local['option'].selectClass);
                        $(this).removeClass(local['option'].ellipsisClass);
                    } else if (content == local['option'].ellipsis) {
                        $(this).removeClass(local['option'].selectClass);
                        $(this).addClass(local['option'].ellipsisClass);
                    } else {
                        $(this).removeClass(local['option'].selectClass);
                        $(this).removeClass(local['option'].ellipsisClass);
                    }
                })

                local['data'].cur = page;
            }

            var getOpersContent = function (cur, size) {
                var contents = new Array(local['option'].count);
                contents[0] = 1;
                contents[local['option'].count - 1] = size;
                var center = Math.ceil(local['option'].count / 2.0);
                if (cur <= center) {
                    for (var i = 0; i < local['option'].count - 3; i++) {
                        contents[i + 1] = 2 + i;
                    }
                    contents[local['option'].count - 2] = local['option'].ellipsis;
                } else if ((size - cur) <= center) {
                    contents[1] = local['option'].ellipsis;
                    for (var i = 0; i < local['option'].count - 3; i++) {
                        contents[i + 2] = size - local['option'].count + 3 + i;
                    }
                } else {
                    contents[1] = local['option'].ellipsis;
                    contents[local['option'].count - 2] = local['option'].ellipsis;
                    for (var i = 0; i < local['option'].count - 4; i++) {
                        contents[2 + i] = cur - 2 + i;
                    }
                }
                return contents;
            }

            var init = function (container, option) {
                if ( container.find('.myui-table-operator').length <= 0 ){
                    container.append(createTableOper());
                }
                local['container'] = container.find('.myui-table-operator');
                if (option) {
                    local['option'] = option;
                }
                var count = local['data'].size < local['option'].count ? local['data'].size : local['option'].count;
                var middle = local['container'].find('#middle');
                var size = local['data'].size;
                var cur = local['data'].cur;

                middle.empty();
                if (size <= local['option'].count) {
                    for (var i = 1; i <= count; i++)
                        middle.append(createOperBtn(i, i == cur));
                } else {
                    var contents = getOpersContent(cur, size);
                    for (var index in contents) {
                        middle.append(createOperBtn(contents[index], contents[index] == cur));
                    }
                }
                local['container'].find('.btn').on('click', operClickListener);
            }

            init(container,option);
            var shared = {};
            shared.rebuildTabOper = init;
            shared.refreshTabOper = refreshTabOper;
            shared.getCurrentPage = function () {
                return local['data'].cur;
            }
            return shared;
        }

        var pullDownListHelper = (function () {
            var shared = {};
            var opt;
            // {
            //     length:20,
            //     hasBlank:false,
            //     getView:function (index) {},
            //
            // }
            shared.showAsDropDown = function (selecter, option) {
                opt = option;
                if (opt.hasBlank) {
                    var line = $('<option value="-1">请选择</option>');
                    selecter.append(line);
                }
                for (var i = 0; i < opt.length; i++) {
                    var value = opt.getValue(i);
                    var line = $('<option></option>');
                    line.append(opt.getContent(i));
                    line.attr('value', value);
                    if ( value == opt.selected ) {
                        line.attr('selected', 'selected');
                    }
                    selecter.append(line);
                }
            }
            return shared;
        })();

        myui['dialog'] = dialog;
        myui['Table'] = Table;
        myui['TableOper'] = TableOper;
        myui['pullDownListHelper'] = pullDownListHelper;
    }(jQuery));