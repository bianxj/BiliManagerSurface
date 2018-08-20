// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function () {};
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
  var myui = (window.myui = window.myui ||{});
  var myuiDialog = (function () {
        var shared = {};
        var object;
        var content;
        var width;
        var height;

        shared.showPromptDialog = function (obj) {
            
        }
        
        shared.closePromptDialog = function () {
            
        }
        
        shared.showPageDialog = function (obj) {
            object = obj;
            if ($('.myui-dialog-bg').length == 0){
                var tmpl = $('#template-myui-dialog');
                if ( tmpl.length == 0 ){
                  $('body').append('<script id="template-myui-dialog" type="text/x-jquery-tmpl"></script>');
                    $('#template-myui-dialog').load('/Surface/template/tmpl_myui_dialog.html',function () {
                        $('#template-myui-dialog').tmpl(object).appendTo('body');
                        show();
                    });
                    return;
                }
                $('#template-myui-dialog').tmpl(object).appendTo('body');
            }
            show();
        };

        shared.closePageDialog = function () {
            $('.myui-dialog-bg').remove();
        };

        var show = function () {
            var maxWidth = window.innerWidth;
            var maxHeight = window.innerHeight;

            var area = object.area;
            if ( area && area.width && area.width < maxWidth ){
                width = area.width;
            } else {
                width = maxWidth*0.8;
            }
            if ( area && area.height && area.height < maxHeight ){
                height = area.height;
            } else {
                height = maxHeight*0.8;
            }

            onResize();

            $('.myui-dialog-bg iframe').attr('src',object.url);
            setListener();
        }

        var setListener = function () {
            $('.myui-dialog-oprator .iconfont').off();
            $('.myui-dialog-bg #minimize').on('click',onMinimize);
            $('.myui-dialog-bg #maximize').on('click',onMaximize);
            $('.myui-dialog-bg #resize').on('click',onResize);
            $('.myui-dialog-bg #close').on('click',onClose);
            $('.myui-dialog-bg').on('click',onOutSide);
            $('.myui-dialog-bg .myui-dialog-content').on('click',function () {
                return false;
            })
        }

        var onOutSide = function () {
            shared.closePageDialog();
        }

        var onMinimize = function () {
            clearOpratorStatus();
            content.height(50);
            content.width('auto');

            content[0].style.top='auto';
            content[0].style.bottom='0px';
            content[0].style.left='0px';
            content[0].style.right='auto';
            // content.offset({top:'auto',bottom:'0px',left:'0px',right:'auto'});
            $('.myui-dialog-oprator #minimize').addClass('hide');
        };

        var onMaximize = function () {
            clearOpratorStatus();
            var maxWidth = window.innerWidth;
            var maxHeight = window.innerHeight;
            content.height(maxHeight);
            content.width(maxWidth);
            content[0].style.top='0px';
            content[0].style.left='0px';
            // content.offset({top:0,left:0});
            $('.myui-dialog-oprator #maximize').addClass('hide');
        };

        var onResize = function () {
            clearOpratorStatus();
            var maxWidth = window.innerWidth;
            var maxHeight = window.innerHeight;
            var top = (maxHeight-height)/2;
            var left = (maxWidth-width)/2;

            content = $('.myui-dialog-content');
            content.height(height);
            content.width(width);
            content[0].style.top=top+'px';
            content[0].style.bottom='auto';
            content[0].style.left=left+'px';
            content[0].style.right='auto';
            // content.offset({ top: top, left: left , bottom:'auto',right:'auto'});
            $('.myui-dialog-oprator #resize').addClass('hide');
        };

        var onClose = function () {
            shared.closePageDialog();
        };

        var clearOpratorStatus = function () {
            $('.myui-dialog-oprator #minimize').removeClass('hide');
            $('.myui-dialog-oprator #maximize').removeClass('hide');
            $('.myui-dialog-oprator #resize').removeClass('hide');
        }
        return shared;
    })();
  var tableHelper = (function (option) {
        var opt = {pageSize:10};
        if ( option ){
            opt = option;
        }

        var obj;
        var shared = {};
        var operObj = {};
        // var views = new Array();

        shared.initTable = function (object,option) {
            obj = object;
            operObj.cur = obj.page;
            operObj.size = Math.ceil(obj.lines/opt.pageSize);
            operObj.callback = operCallback;
            tableOper.initOper(operObj);
            refreshTableTitle();
            refreshTableItem(operObj.cur);
        }

        shared.getCurrentPage = function () {
            return obj.page;
        }

        var operCallback = function (page) {
            obj.page = page;
            refreshTableItem(page);
        }

        var refreshTableTitle = function () {
            var title = obj.getTitle();
            $('.myui-table thead').append(title);
        }

        var refreshTableItem = function (page) {
            $('.myui-table tbody').empty();
            var index = 0;
            for (var i=0;i<opt.pageSize;i++ ){
                index = (page-1)*opt.pageSize+i;
                if ( index < obj.lines  ) {
                    var view = obj.getView(index);
                    $('.myui-table tbody').append(view);
                }
            }
        }

        return shared;
    })();
  var tableOper = (function (option) {
        var opt = {count:9,ellipsis:'...'};
        if ( option ){
            opt = option;
        }
        var obj;
        var shared = {};
        var selectClass = 'selected';
        var ellipsisClass = 'ellipsis';

        shared.initOper = function (object,option) {
            obj = object;
            if ( option ){
                opt = option;
            }
            var count = obj.size < opt.count?obj.size:opt.count;
            var middle = $('#middle');
            var size = obj.size;
            var cur = obj.cur;

            middle.empty();
            if ( size <= opt.count ){
                for(var i=1;i<=count;i++)
                    middle.append(createTabOper(i,i==cur));
            } else {
                var contents = getOpersContent(cur,size);
                for(var index in contents){
                    middle.append(createTabOper(contents[index],contents[index]==cur));
                }
            }
            $('.myui-table-operator .btn').on('click',operClick);
        }
        shared.getCurrentPage = function () {
            return obj.cur;
        }

        var createTabOper = function (content,selected) {
            var html = '<button class="btn';
            if ( opt.ellipsis == content ){
                html+=' '+ellipsisClass;
            }
            if ( selected ) {
                html+=' '+selectClass;
            }
            html+='">'+content+'</button>';
            return html;
        }

        var operClick = function () {
            var btn = $(this).html();
            var cur = obj.cur;
            var page;
            if ( "&lt;&lt;" == btn ){
                page = cur-1;
            } else if ( "&gt;&gt;" == btn ){
                page = cur+1;
            } else {
                page = parseInt(btn);
            }
            if ( page < 1 || page > obj.size ){
                return;
            }
            refreshTabOper(page);
            obj.callback(page);
        }

        var refreshTabOper = function(page){
            var opers = $('.myui-table-operator #middle .btn');

            if ( obj.size > opt.count ){
                var size = obj.size;
                var cur = page;
                var contents = getOpersContent(cur,size);
                for (var i=0;i<opt.count;i++){
                    $(opers[i]).html(contents[i]);
                }
            }

            opers.each(function () {
                var content = $(this).html();
                if ( content == page ) {
                    $(this).addClass(selectClass);
                    $(this).removeClass(ellipsisClass);
                } else if ( content == opt.ellipsis ) {
                    $(this).removeClass(selectClass);
                    $(this).addClass(ellipsisClass);
                } else {
                    $(this).removeClass(selectClass);
                    $(this).removeClass(ellipsisClass);
                }
            })

            obj.cur = page;
        }

        var getOpersContent = function (cur,size) {
            var contents = new Array(opt.count);
            contents[0] = 1;
            contents[opt.count-1] = size;
            var center = Math.ceil(opt.count/2.0);
            if ( cur <= center ){
                for(var i=0;i<opt.count-3;i++){
                    contents[i+1] = 2+i;
                }
                contents[opt.count-2] = opt.ellipsis;
            } else if ( (size-cur) <= center ) {
                contents[1] = opt.ellipsis;
                for(var i=0;i<opt.count-3;i++){
                    contents[i+2] = size-opt.count+3+i;
                }
            } else {
                contents[1] = opt.ellipsis;
                contents[opt.count-2] = opt.ellipsis;
                for(var i=0;i<opt.count-4;i++){
                    contents[2+i] = cur-2+i;
                }
            }
            return contents;
        }

        return shared;
    })();

  myui['dialog'] = myuiDialog;
  myui['tableHelper'] = tableHelper;
}())