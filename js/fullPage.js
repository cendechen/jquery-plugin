/**
 * Created by cjl on 2015-12-19.
 * 全屏滑动插件 支持垂直和水平滑动
 * 选中父元素
 */
(function($){
    var _prefix = (function(ele){
        var pre = ["webkit","ms","o","Moz"];
        for(var i = 0; i<pre.length ;i++){
            var pro = pre[i]+"Transition";
            if(typeof  ele.style.pro != "undifined"){
                return pre[i];
            }
            return false;
        }
    })(document.createElement("div"));
    var PageSwitch = (function(){
        var PageSwitch = function(element,options){
            this.settings = $.extend(true, $.fn.PageSwitch.defaults,options||{});
            this.element = element;
            this.init();
        }
        PageSwitch.prototype = {
            init:function(){
                var me = this;
                me.selectors = me.settings.selectors;
                me.sections = $(me.selectors.sections);
                me.section = $(me.selectors.section);

                me.direction = me.settings.direction == "vertical" ? true : false;
                me.pageCount = me.pageCount();
                me.index = (me.settings.index >= 0 && me.settings.index < me.pagesCount) ? me.settings.index :0;
                me.canScoll = false;
                if(!me.direction){
                    me._initLayout();
                }
                if(me.settings.pagination){
                    me._initPaging();
                }
                me._initEvent();
            },
            pageCount:function(){
                return this.section.length;
            },
            switchLength:function(){
                return this.direction == "vertical" ?  this.section.height() : this.section.width();
            },
            _initLayout:function(){
                var me = this;
                var width = (me.pageCount * 100) +"%",
                    cellwidth=(100 / me.pageCount).toFixed(2) +"%";
                me.sections.width(width);
                me.section.width(cellwidth).css("float","left");
            },
            _initPaging:function(){
                var me = this,
                    pageClass = me.settings.selectors.page.substring(1);
                me.activeClass = me.settings.selectors.active.substring(1);
                var wh = 12;
                 var pagehtml = "<ul class='"+pageClass+"'>",i;
                    for(i = 0; i < me.pageCount ; i++){
                        pagehtml += "<li></li>"
                    }
                    pagehtml +="</ul>";
                    me.element.append(pagehtml);
                    var pages  = me.element.find(me.settings.selectors.page);
                    me.pageItem = pages.find("li");
                    me.pageItem.eq(me.index).addClass(me.activeClass);
                 var postion = wh * me.pageCount;
                if(me.direction){
                    pages.addClass("vertical").css("marginTop","-"+postion+"px");
                }else{
                    pages.addClass("horizontal").css("marginLeft","-"+postion+"px");
                }
            },
            _initEvent:function(){
                var me = this;
                $(document).on("click",me.selectors.page + " li",function(){
                    me.index = $(this).index();
                    me._scrollPage();
                })
                me.element.on("mousewheel DOMMouseScroll",function(e){
                    console.log("1"+me.canScoll)
                    if(!me.canScoll) {
                        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                        if (delta > 0 && (me.index && !me.settings.loop || me.settings.loop )) {
                            me.prev();
                        } else if (delta < 0 && (me.index < me.pageCount && !me.settings.loop || me.settings.loop)) {
                            me.next();
                        }
                    }
                });
                if(me.settings.keyboard) {
                    $(window).on("keydown", function (e) {
                        var keyCode = e.which;
                        if (keyCode == 37 || keyCode == 38) {
                            me.prev();
                        } else if (keyCode == 39 || keyCode == 40) {
                            me.next();
                        }
                    })
                }
                $(window).on("resize",function(){
                    var currentLength = me.switchLength(),
                        offset = me.direction ? me.section.eq(me.index).offset().top:me.section.eq(me.index).offset().left;
                    if(Math.abs(offset) > currentLength / 2 && me.index < (me.pageCount-1) ){
                            me.index ++;
                    }
                    if(me.index){
                        me._scrollPage();
                    }
                })
                me.sections.on("transitionend  webkitTransitionEnd  oTransitionEnd  otransitionend",function(){
                    if(me.settings.callback && $.isFunction(me.settings.callback)){
                        me.settings.callback();
                    }
                    me.canScoll = false;
                    console.log("2"+me.canScoll)
                })
            },
            prev:function(){
                var me = this;
                if(me.index > 0){
                    me.index --;
                }else if(me.settings.loop){
                    me.index  = me.pageCount - 1;
                }
                me._scrollPage();
            },
            next:function(){
                var me=this;
                if(me.index < me.pageCount - 1){
                    me.index ++;
                }else if(me.settings.loop){
                    me.index = 0;
                }
                me._scrollPage();
            },
            _scrollPage:function(){
                var me = this,
                    dest = me.direction ? me.section.eq(me.index).height() : me.section.eq(me.index).width();
                if(!dest) return;
                me.canScoll = true;
                if(_prefix){
                    me.sections.css("-"+_prefix+"-transition","all "+ me.settings.duration+"ms "+me.settings.easing);
                    var translate = me.direction ? "translateY("+ (-dest * me.index)+"px)" : "translateX("+ (-dest * me.index)+"px)";
                    me.sections.css("-"+_prefix+"-transform",translate);
                }else{
                    var animateCss = me.direction ? {top:-dest.top}:{left:-dest.left};
                    me.sections.animate(animateCss,me.settings.duration,function(){
                        if(!me.settings.callback && $.isFunction(me.settings.callback)){
                            me.settings.callback();
                        }
                        me.canScoll = false;
                    })
                }
                if(me.settings.pagination){
                    me.pageItem.eq(me.index).addClass("active").siblings("li").removeClass("active");
                }
            }
        }
        return PageSwitch;
    })()
    $.fn.PageSwitch = function(options){
        return this.each(function(){
            var me = $(this),
                instance = me.data("PageSwitch");
            if(!instance){
                instance = new PageSwitch(me,options);
                me.data("PageSwitch",instance);
            }
        })
    }
    $.fn.PageSwitch.defaults = {
        selectors:{
            sections:".sections",
            section:".section",
            page:".pages",
            active:".active"
        },
        index:0,
        easing:"ease",
        duration:500,
        loop:false,
        pagination:true,
        keyboard:true,
        direction:"vertical",
        callback:""
    }
})(jQuery);

$(function(){
    $("[data-pageSwitch]").PageSwitch({
        direction:"horizontal",
        loop:true
    });
})