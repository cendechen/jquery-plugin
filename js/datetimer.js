/**
 * Created by cjl on 2015-12-13.
 */
(function($){
    var options = {
        timerRange : [0,23],
        interval:15,
        isnow:false, //从现在开始
        layoutclass:"timelayout",
        rowSpans:5,
        width:200,
        height:200,

    }
    $.fn.datetime = function(option){
        var op = $.extend({},options,option || {});
        var input = $(this);
        var divlayout;
        var table;
        var timelist = [];
        function times(min,sec){
            if(String(min).length == 1){
               min =  "0x".replace("x",min);
            }
            if(String(sec).length == 1){
                sec = "0x".replace("x",sec);
            }
            return min+":"+sec;
        }
        function lists(s,e,bm){
            var i  = s * 60 + bm;
            var j =  e * 60 + 59;
            var k;
            var min;
            var sec;
            var list ;
            for( k = i ; k <= j ;k = k + op.interval ){
                min = Math.floor(k / 60);
                sec = k % 60;
                list = times(min,sec);
                timelist.push(list);
            }
        }
        function createTime(){
            (op.interval > 60) && (op.interval = 59);
            (op.interval < 0) && (op.interval = 0 );
            if(op.isnow){
                //说明是从现在开始生成时间
                var d = new Date();
                var min = d.getHours();
                var sec= d.getMinutes();
                op.timerRange[0] = min;
                lists(op.timerRange[0],op.timerRange[1],sec);
            }else {
                //从0点开始生成
                if (op.timerRange[0] < 0) {
                    op.timerRange = 0;
                }
                if(op.timerRange[1] > 23){
                    op.timerRange = 23
                }
                lists(op.timerRange[0],op.timerRange[1],0);
            }
        }
        //创建表格
        function createLayout(){
            divlayout = $("<div>").css({position:"absolute",left:0,top:"100%",height:op.height+"px",overflowY:"auto",display:"none"});
            input.parent().css({position:"relative"}).append(divlayout.addClass(op.layoutclass));
            table = $("<table>").addClass("datetime-containter");
            divlayout.append($("<div>").addClass("datetime-content").append(table));
            createTime();
            var rows = [];
            var rs = Math.ceil(timelist.length / op.rowSpans);
            var cs = op.rowSpans;
            var trw;
            for(var i = 0;i<rs;i++){
                var htmltpl = "<tr class='row'>"
                for(var j = 0;j < cs ;j++){
                    var k = i * op.rowSpans + j;
                    if( k > timelist.length - 1) {
                        htmltpl +="<td></td>"
                    }else{
                        htmltpl += "<td data-time='"+timelist[k]+"'>"+timelist[k]+"</td>"
                    }
                }
                htmltpl += "</tr>"
                rows.push(htmltpl);
            }
            for(var i = 0; i < op.rowSpans ; i++ ){

            }
            table.html(rows.join(""));
            trw = table.width();
            if(trw > op.width){
                divlayout.css({width:trw+"px"})
            }

        }
        createLayout();
        var timeinput = $(this);
        $(this).on("focus",function(){
            divlayout.show();
        })
        $(this).parent().on("click","td",function(){
            var time = $(this).data("time");
            timeinput.val(time);
            divlayout.hide();
        }).on("mouseenter","td",function(){
            $(this).parent().parent().find("td").removeClass("hover");
            $(this).addClass("hover");
        })
    }
})(jQuery)