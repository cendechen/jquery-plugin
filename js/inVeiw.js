/**
 * Created by cjl on 2016-01-13.
 * 预加载插件
 * 当元素出现可见文档中的时候
 * 执行回掉并给成功的元素添加successClass
 */
(function($){
    function contain(view,bound){
        if(view.left > bound.left ||
            view.right < bound.right||
            view.top > bound.top ||
            view.bottom < bound.bottom
        ){
            return false;
        }else{
            return true;
        }
    }
    $.fn.inView = function(setting,fn){
        var setoption,_fn;
        if(arguments.length ==1){
            $.isPlainObject(arguments[0]) ? setoption = setting :setoption = {};
            $.isFunction(arguments[0]) ? _fn = arguments[0] : _fn = undefined;
        }else if(arguments.length == 0){
            setoption = {};
        }else if(arguments.length == 2){
            setoption = setting
            _fn = fn;
        }
        var options = $.extend({}, $.fn.inView.defaults,setoption);
        var _that = this;
        function init() {
            $(_that).each(function (i, d) {
                var win = $(window);
                var viewport = {
                    top: win.scrollTop(),
                    left: win.scrollLeft()
                };
                viewport.right = viewport.left + win.width();
                viewport.bottom = viewport.top + win.height();
                var bounds = $(d).offset();
                bounds.right = bounds.left + $(d).outerWidth();
                bounds.bottom = bounds.top + $(d).outerHeight();
                if (contain(viewport, bounds)) {
                    if(!$(d).is("."+options.successClass)){
                        $(d).addClass(options.successClass);
                        if($.isFunction(_fn)){
                            _fn.call(d)
                        }
                    }
                }
            })
        }
        init();
        $(window).on("scroll",function(){
            init();
        })
    }
    $.fn.inView.defaults = {
        successClass:"viewSuccess",
        contain:"all" //all(全包含) top(上部保护)
    }
})(jQuery)