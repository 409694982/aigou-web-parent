(function(e){function i(e){var i=[];i.push(e);while(e.indexOf(",")!=-1){e=e.substring(0,e.lastIndexOf(","));i.push(e)}i=i.reverse();return i}function l(e,i){for(var l in i){if(i[l]==e){return true}}return false}var n=[];e.fn.regionselector=function(a){var t={url:null,container:r,select_class:"",separator:null,value:null,check_all:true,parent_code:null,sale_scope:false,change:null,dblclick:null,callback:null,cache:true,select_callback:null,option_callback:null,level_names:["","省","市","区/县","镇","街道"],widget_class:"render-selector",read_only:false,load:function(i,l,a){var t=this;var r=t.container;var s={};if(l==true){s.region_code=i}else{s.parent_code=i;if(n[i]!=undefined){t.render(n[i],a);return}}e.get(this.url,s,function(i){if(i.code!=0){return}var o=i.data;t.level_names=i.level_names;if(e.isFunction(t.callback)){var i=t.callback.call(t,o);if(i==false){return}}t.render(o,a);if(!l){n[s.parent_code]=o}else{e(a).data("is_last",false);e(r).find("."+t.widget_class+":last").trigger("change",[false])}},"json")},render:function(n,a){var t=this;var r=t.container;if(n==undefined&&e(r).find("."+t.widget_class+"").size()==0){var s=t.select_class+" "+t.widget_class+"-init";if(this.read_only){var o=e("<select class='"+s+"' disabled><option value=''>-请选择-</option></select>")}else{var o=e("<select class='"+s+"'><option value=''>-请选择-</option></select>")}e(r).append(o);if(e.isFunction(t.select_callback)){t.select_callback.call(t,o)}return}e(r).find("."+t.widget_class+"-init").remove();if(a!=null&&e.isFunction(t.before_change)){t.before_change.call(t,a)}if(n.length==0||n[0].length==0){e(a).data("is_last",true);e(r).find("."+t.widget_class+":last").trigger("change",[true]);return}var c=[];if(t.value!=undefined&&t.value!=null&&t.value.length>0){c=i(t.value)}for(var d=0;d<n.length;d++){if(n[d].length==0){continue}var s=t.select_class;if(e(r).find("."+t.widget_class).size()!=0){s="m-l-5 "+s}s=s+" "+t.widget_class;if(t.read_only){var o=e("<select class='"+s+"' disabled><option value=''>-请选择-</option></select>")}else{var o=e("<select class='"+s+"'><option value=''>-请选择-</option></select>")}var f=null;var u=null;for(var g=0;g<n[d].length;g++){var v=n[d][g];var h=false;if(n[d].length==1){h=true}else if(l(v.region_code,c)){h=true}var _=e("<option value='"+v.region_code+"'>"+v.region_name+"</option>");if(h){e(_).attr("selected","selected")}e(o).append(_);if(f==null){f=v.parent_code}if(u==null){u=v.region_code.split(",").length}if(e.isFunction(t.option_callback)){t.option_callback.call(t,_)}}e(o).data("parent-code",f);e(o).data("level",u);e(r).append(o);if(e.isFunction(t.dblclick)){e(o).find("option").dblclick(function(i){var l=[];e(r).find("."+t.widget_class+" option:selected").each(function(){if(e(this).val()!=""){l.push(e(this).html())}});if(!e(this).is(":disabled")){t.dblclick.call(t,e(this),l)}})}if(e.isFunction(t.select_callback)){t.select_callback.call(t,o)}e(o).on("change",function(i,l){if(l==undefined){l=false}e(o).data("is_last",l);var n=e(this).val();if(n==""){if(e.isFunction(t.before_change)){t.before_change.call(t,this)}}if(e.isFunction(t.change)){var a=[];var s=[];e(r).find("."+t.widget_class+" option:selected").each(function(){if(e(this).val()!=""){a.push(e(this).html());s.push(e(this).val())}});var c=n;if(t.check_all==false&&s.length>0){c=s[s.length-1]}var d=t.change.call(t,c,a,l);if(d==false){return}}if(n==""){return}if(l==false){t.load(n,false,this)}})}e(r).find("."+t.widget_class).last().change()},values:function(){var i=this;var l=i.container;var n=[];e(l).find("."+i.widget_class+" option:selected").each(function(){if(e(this).val()!=""){n.push({region_code:e(this).val(),region_name:e(this).html()})}});return n},before_change:function(i){e(i).nextAll("."+a.widget_class).remove()},reload:function(){var e=this;if(e.url==null){if(e.sale_scope==true){e.url="/static/js/data/sale-region-list.json"}else{e.url="/static/js/data/region-list.json"}}e.container.remove("."+this.widget_class);e.render();if(e.value!=null&&e.value!=""){e.load(e.value,true,null)}else{e.load(e.parent_code,false,null)}}};var r=e(this).first();a=e.extend(true,t,a);a.container=e(this).first();if(a.url==null){if(a.sale_scope==true){a.url="/static/js/data/sale-region-list.json"}else{a.url="/static/js/data/region-list.json"}}a.render();if(a.value!=null&&a.value!=""){a.load(a.value,true,null)}else{a.load(a.parent_code,false,null)}return a};e.fn.regionpicker=function(i){var l={widget_class:"region-picker",dblclick:null,select_callback:function(l){e(l).wrap('<div class="region-picker-list '+this.widget_class+'"></div>');if(e(l).hasClass(i.widget_class+"-init")){}else{var n=e(l).data("level");var a=this.level_names[n];e(l).before("<label>"+a+"：</label>")}e(l).attr("size",10)},before_change:function(i){e(i).parents("div").nextAll(".region-picker-list").remove()}};if(!e(this).hasClass("region-picker-list-box")){e(this).addClass("region-picker-list-box")}i=e.extend(true,l,i);return e(this).regionselector(i)};e.fn.regionchooser=function(a){var t={url:null,container:null,select_class:"",separator:null,value:null,parent_code:null,sale_scope:false,change:null,callback:null,cache:true,select_callback:null,level_names:["","省","市","区/县","镇","街道"],widget_class:"region-chooser",load:function(i,l,a){var t=this;var r=t.container;var s={};if(l==true){s.region_code=i}else{s.parent_code=i;if(n[i]!=undefined){t.render(n[i],l,a);return}}if(a!=null){if(n[i]!=undefined){t.render(n[i],l,a);return}return e.get(t.url,{parent_code:i},function(i){if(i.code!=0){return}var o=i.data;t.level_names=i.level_names;if(e.isFunction(t.callback)){var i=t.callback.call(t,o);if(i==false){return}}t.render(o,l,a);if(!l){n[s.parent_code]=o}else{e(a).data("is_last",false);e(r).find("."+t.widget_class+":last").trigger("change",[false])}},"json")}return e.get(t.url,s,function(i){if(i.code!=0){e.msg(i.message);return}if(i.level_names){t.level_names=i.level_names}t.render(i.data,l)},"json")},render:function(n,a,t){var r=this;var s=r.container;if(n==undefined){var o='<div class="region-chooser-selected">';o+='<div class="region">';o+="<font>";o+="请选择";o+="<i></i>";o+="</font>";o+="</div>";o+="</div>";o+='<div class="region-chooser-box" id="region-chooser-box" style="display: none;">';o+='<div class="region-chooser-close"></div>';o+='<div class="region-tabs">';o+="</div>";o+="</div>";o+='<div style="clear: both;"></div>';o+="</div>";e(s).html(e.parseHTML(o));e(s).mouseenter(function(){r.show()}).mouseleave(function(){if(e(s).data("should-show")){e(s).data("should-show",false);return}r.hide()});e(s).find(".region-chooser-close").click(function(){r.toggle()});e(s).on("click",".region-tab",function(){var i=e(this).data("region-code");e(s).find(".region-tab").filter(".selected").removeClass("selected");e(this).addClass("selected");e(this).nextAll(".region-tab").remove();e(s).find(".region-items").hide();e(s).find(".region-items").filter("[data-region-code='"+i+"']").show()});e(s).on("click",".region-items a",function(){if(e(this).data("loading")){return}e(this).data("loading",true);var i=e(this).data("region-code");r.load(i,false,e(this));return false});return}if(t!=undefined&&t!=null){var c=e(t).data("region-code");var d=e(t).data("parent-code");var f=e(t).data("region-level");var u=e(t).data("region-name");e(s).find(".region-tab").filter("[data-region-level='"+f+"']").html(u+"<i></i>");e(s).find(".region-tab").filter("[data-region-level='"+f+"']").data("region-name",u)}var g=[];var v=[];if(r.value!=undefined&&r.value!=null&&r.value.length>0){g=i(r.value)}for(var h=0;h<n.length;h++){if(n[h].length==0){continue}var c=n[h][0].parent_code;var f=n[h][0].level;var u=null;e(s).find(".region-items").hide();if(e(s).find(".region-items").filter("[data-region-code='"+c+"']").size()>0){e(s).find(".region-items").filter("[data-region-code='"+c+"']").show();if(n[n.length-1].length==0){u=n[h][0].region_name;v.push(u)}}else{var _=e('<div class="region-items" data-region-level="'+f+'" data-region-code="'+c+'"></div>');for(var p=0;p<n[h].length;p++){var m=n[h][p];var b=false;if(n[n.length-1].length==0){b=true}else if(l(m.region_code,g)){b=true}if(b){u=m.region_name;v.push(u)}e(_).append('<a href="javascript:void(0);" data-region-level="'+f+'" data-region-code="'+m.region_code+'" data-parent-code="'+m.parent_code+'" data-region-name="'+m.region_name+'">'+m.region_name+"</a>")}e(s).find(".region-chooser-box").append(_)}e(s).find(".region-tab").filter(".selected").removeClass("selected");var k=e('<div class="region-tab selected" data-region-level="'+f+'" data-region-code="'+c+'" style="display: block"><i></i></div>');e(s).find(".region-tabs").append(k);if(u==null){var w=c.split(",").length+1;if(c=="0"){w=1}var x=r.level_names[w];u="请选择";if(x){u+=x}e(k).html(u+"<i></i>")}else{e(k).html(u+"<i></i>");e(k).data("region-name",u)}}var C=null;if(a){C=r.value}else{C=c}var F=[];e(s).find(".region-tab").each(function(){if(e(this).data("region-name")){F.push(e(this).data("region-name"))}});var y=false;if(n.length==0||n[n.length-1].length==0){y=true;if(F.length==0){F=["请选择"]}e(s).find(".region").html("<font>"+F.join(" ")+"<i></i></font>")}if(t!=undefined||t!=null||a){e(t).data("loading",false);if((t!=undefined||t!=null)&&!y){r.show();e(s).data("should-show",true)}else{e(s).find(".region").html("<font>"+F.join(" ")+"<i></i></font>");r.hide()}if(e.isFunction(r.change)){var j=r.change.call(r,C,F,y);if(j==false){return}}}},show:function(){e(this.container).find(".region").addClass("active");e(this.container).find(".region-chooser-box").show()},hide:function(){e(this.container).find(".region").removeClass("active");e(this.container).find(".region-chooser-box").hide()},toggle:function(){var i=this.container;if(e(i).find(".region-chooser-box").is(":hidden")){e(i).find(".region-chooser-box").show()}else{e(i).find(".region-chooser-box").hide()}}};var r=e(this);if(!e(r).hasClass("region-chooser")){e(r).addClass("region-chooser")}a=e.extend(true,t,a);a.container=r;if(a.sale_scope==true){a.url="/static/js/data/sale-region-list.json"}else{a.url="/static/js/data/region-list.json"}a.render();if(a.value!=null&&a.value!=""){a.load(a.value,true,null)}else{a.load(a.parent_code,false,null)}return a}})(jQuery);