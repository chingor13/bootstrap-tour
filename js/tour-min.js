// Generated by CoffeeScript 1.4.0
(function(){window.Tour=function(){function e(t,n){var r,i,s;this.steps=[],this.stepsById={},this.stepsByGroup={};for(i=0,s=t.length;i<s;i++)r=t[i],r instanceof TourGroup?this.addTourGroup(r):this.addStep(r);this.introStep=n,e.setCurrent(this)}return e.current=function(){return this.currentTour},e.setCurrent=function(e){return this.currentTour=e},e.prototype.start=function(){return e.setCurrent(this),this.savedState()?this.show(this.savedState()):this.startOver()},e.prototype.showIntro=function(){if(!this.introStep)return;return this.close(),this.intro=this.renderModal("tour-start",'<div id="tour-start" class="modal hide"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="icon-remove"></i></button><h3 class="title">'+this.introStep.title+'</h3></div><div class="modal-body" style="max-height:550px;">'+this.introStep.content+this.buildDropdown()+'<a href="#" class="btn btn-primary pull-right" data-tour="start">Start</a></div></div>',{modalWidth:400})},e.prototype.startOver=function(){return this.show(this.steps[0])},e.prototype.end=function(){return this.close(),this.clearState()},e.prototype.gotoPage=function(e){var t,n,r;return e.page?(r=e.page(),t=r[0],n=r[1],window.location.pathname.match(t)?!1:(window.location.href=n,!0)):!1},e.prototype.nextStep=function(){var e,t,n;return(n=(e=this.steps)[t=this.currentStep+1])!=null?n:e[t]=null},e.prototype.prevStep=function(){var e,t,n;return(n=(e=this.steps)[t=this.currentStep-1])!=null?n:e[t]=null},e.prototype.next=function(){return this.show(this.nextStep())},e.prototype.prev=function(){return this.show(this.prevStep())},e.prototype.cancel=function(){return this.close()},e.prototype.close=function(){$("body").trigger("expose:hide"),this.modal&&this.modal.modal("hide"),this.popover&&this.popover.hide();if(this.intro)return this.intro.modal("hide")},e.prototype.addStep=function(e,t){var n;return e.index=this.steps.length,this.steps.push(e),this.stepsById[e.id]=e,t||(t=null),(n=this.stepsByGroup)[t]||(n[t]=[]),this.stepsByGroup[t].push(e)},e.prototype.addTourGroup=function(e){var t,n,r,i,s;i=e.steps,s=[];for(n=0,r=i.length;n<r;n++)t=i[n],s.push(this.addStep(t,e.name));return s},e.prototype.findStep=function(e){return typeof e=="object"?e:this.stepsById[e]},e.prototype.show=function(t){var n;e.setCurrent(this),n=this.findStep(t);if(this.gotoPage(n))return;this.saveState(n);if(n.beforeShow&&n.beforeShow())return;return this.close(),this.build(n),this.expose(n)},e.prototype.saveState=function(e){return localStorage&&(localStorage.tourStep=e.id),this.currentStep=e.index},e.prototype.savedState=function(){if(localStorage)return localStorage.tourStep},e.prototype.clearState=function(){return localStorage&&localStorage.removeItem("tourStep"),this.currentStep=null},e.prototype.build=function(e){return e.type==="modal"?(this.buildModal(e),this.modal.modal("show")):(this.buildPopover(e),this.popover.show()),this.buttons(e)},e.prototype.buildModal=function(e){return this.modal?(this.modal.find(".modal-body p").html(e.content),this.modal.find(".modal-header h3").html(e.title)):this.modal=this.renderModal("tour-modal",'<div id="tour-modal" class="modal hide"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="icon-remove"></i></button><h3 class="title">'+definition.title+'</h3></div><div class="modal-body" style="max-height:550px;"><p>'+definition.content+"</p>"+this.buildActions()+"</div></div>",{modalWidth:400}),this.modal},e.prototype.buildPopover=function(e){var t,n,r;return n=$(e.anchor),r='<a class="close" data-tour="cancel"><i class="icon-remove"></i></a>'+e.title,t=e.content+"<br/><br/>"+this.buildActions(),this.popover?(this.popover.options.content=t,this.popover.options.title=r,this.popover.options.placement=e.placement,this.popover.$element=n):(this.popover=n.popover({animation:!1,placement:e.placement,trigger:"manual",content:t,title:r,html:!0}).data("popover"),this.popover.tip().width(400).addClass("tour-popover"),this.popover.show()),this.popover},e.prototype.buildDropdown=function(){var e,t,n,r,i;if(!this.dropdown){t="",i=this.stepsByGroup;for(e in i)r=i[e],e!=="null"&&(t+='<optgroup label="'+e+'">'),t+=function(){var e,t,i;i=[];for(e=0,t=r.length;e<t;e++)n=r[e],i.push('<option data-step="'+n.id+'">'+n.title+"</option>");return i}().join(""),e!=="null"&&(t+="</optgroup>");this.dropdown='<select class="tour-goto"><option>Jump to...</option>'+t+"</select>"}return this.dropdown},e.prototype.buildActions=function(){return this.actions||(this.actions=this.buildDropdown()+'<div class="tour-buttons pull-right"><a class="btn btn" data-tour="prev" href="#">Prev</a> <a class="btn btn-primary" data-tour="next" href="#">Next</a><a class="btn btn-primary" data-tour="end" href="#">Close</a><span class="button-annotation message-ue"></span></div>'),this.actions},e.prototype.expose=function(e){if(e.expose)return $(e.expose).expose({padding:e.exposePadding,"static":!0})},e.prototype.buttons=function(e){return this.prevStep()?$("*[data-tour=prev").show():$("*[data-tour=prev").hide(),this.nextStep()?($("*[data-tour=next]").show(),$("*[data-tour=end]").hide()):($("*[data-tour=next]").hide(),$("*[data-tour=end]").show())},e.prototype.renderModal=function(e,t,n){var r,i;return $(".modal").each(function(e,t){if($(t).data("modal"))return $(t).modal("hide")}),n||(n={}),i=n.modalWidth||760,$("#"+e).remove(),$("body").append(t),r=$("#"+e),i==="auto"?r.css({width:"auto"}).css({marginLeft:r.width()/-2+"px"}):r.css({width:i+"px",marginLeft:i/-2+"px"}),n.modalHeight&&r.css({height:n.modalHeight+"px"}),n.addCloseButton&&r.find(".modal-body").prepend('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="icon-remove"></i></button>'),r.modal(n).css({marginTop:r.outerHeight()/-2+"px"}).modal("show"),r},e}(),window.TourGroup=function(){function e(e,t){this.name=e,this.steps=t}return e}(),window.TourStep=function(){function e(e,t,n,r){this.id=e,this.title=t,this.content=n,this.options=r,this.options||(this.options={}),this.type=this.options.type||"popover",this.expose=this.options.expose,this.exposePadding=this.options.exposePadding,this.anchor=this.options.anchor,this.placement=this.options.placement,this.page=this.options.page,this.beforeShow=this.options.beforeShow}return e}(),$(function(){return $("body").on("click","*[data-tour]",function(e){var t;return t=Tour.current(),t&&t[$(this).attr("data-tour")].call(t),e.preventDefault(),!1}).keyup(function(e){var t;t=Tour.current();if(e.keyCode===27&&t)return t.close()}).on("change","select.tour-goto",function(e){var t,n,r;return t=Tour.current(),n=$(e.target).find("option:selected"),r=n.attr("data-step"),t&&t.show(r),e.preventDefault(),!1})})}).call(this);