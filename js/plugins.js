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

(
    function () {
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
    }()
);

(
    function () {
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
                    result[set[0]] = set[1];
                }
            }
            return result;
        }
    }
)

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
                };

                var onResize = function () {
                    clearOpratorStatus();
                    showCenter();
                    body.find('.resize').addClass('hide');
                };

                var clearOpratorStatus = function () {
                    dlg.find('.minimize').removeClass('hide');
                    dlg.find('.maximize').removeClass('hide');
                    dlg.find('.resize').removeClass('hide');
                }

                var onClose = function () {
                    closeDialog();
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
                    var html = '    <div>\n' +
                        '        <i class="iconfont">&#xe615;</i>\n' +
                        '        <cite class="content">' + obj.content + '</cite>\n' +
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

            shared.showFrameDialog = function (obj) {
                // frameDialog.build(obj);
                var builder = frameDialog.getBuilder(obj);
                showDialog(builder);
            }

            shared.showToastDialog = function (obj) {
                var builder = toastDialog.getBuilder(obj);
                showDialog(builder);
            }
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



        // new Table();
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
                if ( local['container'].find('.myui-table').length <= 0 ){
                    local['table'] = createTable();
                    local['container'].append(local['table']);
                }
                local['table'] = local['container'].find('.myui-table');

                if (option) {
                    $.extend(local['option'], option)
                }
                local['data'] = data;

                var operData = {};
                operData.cur = data.page;
                operData.size = Math.ceil(local['data'].lines / local['option'].pageSize);
                operData.callback = operCallback;
                if ( local['operation'] ){
                    local['operation'].rebuildTabOper(local['container'], local['data'].option);
                } else {
                    local['operation'] = new TableOper(local['container'], local['data'].option,operData);
                }

                refreshTableTitle();
                refreshTableItem(local['operation'].getCurrentPage());
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
            };
            var refreshTableTitle = function () {
                var title = local['data'].getTitle();
                local['table'].find('thead').append(title);
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


        // var tableHelper = (function (option) {
        //     var opt = {pageSize: 10};
        //     if (option) {
        //         opt = option;
        //     }
        //
        //     var obj;
        //     var shared = {};
        //     var operObj = {};
        //
        //     // var views = new Array();
        //
        //     function Table(object, option) {
        //         var opt = {pageSize: 10};
        //         if (option) {
        //             opt = option;
        //         }
        //         var obj = object;
        //         var shared = {};
        //
        //         var generateOper = function (object, option) {
        //             var oper = {};
        //             oper.cur = obj.page;
        //             oper.size = Math.ceil(obj.lines / opt.pageSize);
        //             oper.callback = operCallback;
        //             refreshTableTitle();
        //             refreshTableItem(operObj.cur);
        //         }
        //
        //         var operCallback = function (page) {
        //             obj.page = page;
        //             refreshTableItem(page);
        //         }
        //
        //         var refreshTableTitle = function () {
        //             var title = obj.getTitle();
        //             $('.myui-table thead').append(title);
        //         }
        //
        //         var refreshTableItem = function (page) {
        //             $('.myui-table tbody').empty();
        //             var index = 0;
        //             for (var i = 0; i < opt.pageSize; i++) {
        //                 index = (page - 1) * opt.pageSize + i;
        //                 if (index < obj.lines) {
        //                     var view = obj.getView(index);
        //                     $('.myui-table tbody').append(view);
        //                 }
        //             }
        //         }
        //
        //         shared.refreshTable = function (object, option) {
        //
        //         }
        //
        //         shared.getCurrentPage = function () {
        //             return obj.page;
        //         }
        //         return shared;
        //     }
        //
        //     shared.initTable = function (object, option) {
        //         // obj = object;
        //         // operObj.cur = obj.page;
        //         // operObj.size = Math.ceil(obj.lines / opt.pageSize);
        //         // operObj.callback = operCallback;
        //         // tableOper.initOper(operObj);
        //         // refreshTableTitle();
        //         // refreshTableItem(operObj.cur);
        //         return new Table(object, option);
        //     }
        //
        //     // shared.getCurrentPage = function () {
        //     //     return obj.page;
        //     // }
        //     //
        //     // var operCallback = function (page) {
        //     //     obj.page = page;
        //     //     refreshTableItem(page);
        //     // }
        //     //
        //     // var refreshTableTitle = function () {
        //     //     var title = obj.getTitle();
        //     //     $('.myui-table thead').append(title);
        //     // }
        //     //
        //     // var refreshTableItem = function (page) {
        //     //     $('.myui-table tbody').empty();
        //     //     var index = 0;
        //     //     for (var i = 0; i < opt.pageSize; i++) {
        //     //         index = (page - 1) * opt.pageSize + i;
        //     //         if (index < obj.lines) {
        //     //             var view = obj.getView(index);
        //     //             $('.myui-table tbody').append(view);
        //     //         }
        //     //     }
        //     // }
        //
        //     return shared;
        // })();
        // var tableOper = (function (option) {
        //     var opt = {count: 9, ellipsis: '...'};
        //     if (option) {
        //         opt = option;
        //     }
        //     var obj;
        //     var shared = {};
        //     var selectClass = 'selected';
        //     var ellipsisClass = 'ellipsis';
        //
        //     shared.initOper = function (object, option) {
        //         obj = object;
        //         if (option) {
        //             opt = option;
        //         }
        //         var count = obj.size < opt.count ? obj.size : opt.count;
        //         var middle = $('#middle');
        //         var size = obj.size;
        //         var cur = obj.cur;
        //
        //         middle.empty();
        //         if (size <= opt.count) {
        //             for (var i = 1; i <= count; i++)
        //                 middle.append(createTabOper(i, i == cur));
        //         } else {
        //             var contents = getOpersContent(cur, size);
        //             for (var index in contents) {
        //                 middle.append(createTabOper(contents[index], contents[index] == cur));
        //             }
        //         }
        //         $('.myui-table-operator .btn').on('click', operClick);
        //     }
        //     shared.getCurrentPage = function () {
        //         return obj.cur;
        //     }
        //
        //     var createTabOper = function (content, selected) {
        //         var html = '<button class="btn';
        //         if (opt.ellipsis == content) {
        //             html += ' ' + ellipsisClass;
        //         }
        //         if (selected) {
        //             html += ' ' + selectClass;
        //         }
        //         html += '">' + content + '</button>';
        //         return html;
        //     }
        //
        //     var operClick = function () {
        //         var btn = $(this).html();
        //         var cur = obj.cur;
        //         var page;
        //         if ("&lt;&lt;" == btn) {
        //             page = cur - 1;
        //         } else if ("&gt;&gt;" == btn) {
        //             page = cur + 1;
        //         } else {
        //             page = parseInt(btn);
        //         }
        //         if (page < 1 || page > obj.size) {
        //             return;
        //         }
        //         refreshTabOper(page);
        //         obj.callback(page);
        //     }
        //
        //     var refreshTabOper = function (page) {
        //         var opers = $('.myui-table-operator #middle .btn');
        //
        //         if (obj.size > opt.count) {
        //             var size = obj.size;
        //             var cur = page;
        //             var contents = getOpersContent(cur, size);
        //             for (var i = 0; i < opt.count; i++) {
        //                 $(opers[i]).html(contents[i]);
        //             }
        //         }
        //
        //         opers.each(function () {
        //             var content = $(this).html();
        //             if (content == page) {
        //                 $(this).addClass(selectClass);
        //                 $(this).removeClass(ellipsisClass);
        //             } else if (content == opt.ellipsis) {
        //                 $(this).removeClass(selectClass);
        //                 $(this).addClass(ellipsisClass);
        //             } else {
        //                 $(this).removeClass(selectClass);
        //                 $(this).removeClass(ellipsisClass);
        //             }
        //         })
        //
        //         obj.cur = page;
        //     }
        //
        //     var getOpersContent = function (cur, size) {
        //         var contents = new Array(opt.count);
        //         contents[0] = 1;
        //         contents[opt.count - 1] = size;
        //         var center = Math.ceil(opt.count / 2.0);
        //         if (cur <= center) {
        //             for (var i = 0; i < opt.count - 3; i++) {
        //                 contents[i + 1] = 2 + i;
        //             }
        //             contents[opt.count - 2] = opt.ellipsis;
        //         } else if ((size - cur) <= center) {
        //             contents[1] = opt.ellipsis;
        //             for (var i = 0; i < opt.count - 3; i++) {
        //                 contents[i + 2] = size - opt.count + 3 + i;
        //             }
        //         } else {
        //             contents[1] = opt.ellipsis;
        //             contents[opt.count - 2] = opt.ellipsis;
        //             for (var i = 0; i < opt.count - 4; i++) {
        //                 contents[2 + i] = cur - 2 + i;
        //             }
        //         }
        //         return contents;
        //     }
        //
        //     return shared;
        // })();


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
                    var line = $('<option></option>');
                    line.append(opt.getView(i));
                    line.attr('value', i);
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