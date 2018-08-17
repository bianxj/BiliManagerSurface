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

        shared.showDialog = function (obj) {
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

        shared.closeDialog = function () {
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
            shared.closeDialog();
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
            shared.closeDialog();
        };

        var clearOpratorStatus = function () {
            $('.myui-dialog-oprator #minimize').removeClass('hide');
            $('.myui-dialog-oprator #maximize').removeClass('hide');
            $('.myui-dialog-oprator #resize').removeClass('hide');
        }
        return shared;
    })();
  myui['dialog'] = myuiDialog;
}())