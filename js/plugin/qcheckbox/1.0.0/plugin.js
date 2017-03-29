(function($){

		var  defaultoptions = {
			  selector      : this.selector
		};
		
		var plugname="qcheckbox";
		
		$.fn[plugname]=function()
		{
			var isMethodCall=arguments.length>0 && typeof arguments[0] === "string";
			if(isMethodCall)
			{
				
				var methodname=arguments[0];
				var args = Array.prototype.slice.call(arguments,1);
				this.each(function() {
					var instance = $.data( this,plugname);
					if(instance && $.isFunction( instance[methodname] ))
					{
						var method=instance[methodname];
						method.apply(instance,args);
					}
				});
			}else{
				var inputoptions = arguments;
				$(this).each(
						function ()
						{
							var optionsnew = $.extend( {}, defaultoptions);
							if(inputoptions.length>0)
							{
									optionsnew=$.extend(optionsnew,inputoptions[0]);
							}
							var instance=$(this).data(plugname);
							if(instance)
							{
								instance.init(optionsnew);
							}else
							{
								var target=$(this);
								instance=new PluginObject(target);
								instance.init(optionsnew);
								$(this).data(plugname,instance);
							}
						}
					);
					return this;
			};
		}

		function PluginObject(target)
		{
				var self=this;
				self.popbox;
				self.qcheckboxele;

				self.setValue=function()
				{
					var values= self.qcheckboxele.find(".qitem.active").map(function(){
						return $(this).data("qvalue").trim();
					}).get().concat();
					target.val(values);
					self.popbox.removeClass("show");
				};
				self.init=function(initoptions)
				{
					self.qcheckboxele=initoptions.qcheckboxele;
					self.qcomfirm=self.qcheckboxele.find(".qcomfirm");
					self.qcancel=self.qcheckboxele.find(".qcancel");
					self.popbox=self.qcheckboxele.closest(".popbox");
					target.on("focus",function()
						{
							self.popbox.addClass("show");
						}
					);
					var initvalues=target.val()==null?[]:target.val().split(",");
					self.qcheckboxele.find(".qitem").each(function(){
						var itemvalue=$(this).data("qvalue").trim();
						if(itemvalue!=""){
							if($.inArray(itemvalue,initvalues)>-1){
								$(this).addClass("active");
								return;
							}
						}
						$(this).removeClass("active");
					});
					self.popbox.on("click",function(ele){
						if($(ele.target).closest(".qcheckbox").get().length==0)
						{
							self.popbox.removeClass("show");
						}
						if($(ele.target).hasClass("qitem"))
						{
							self.qcheckboxele.find(".qitem.active").removeClass("active");
							$(ele.target).addClass("active");
							self.setValue();
						}
					});
					self.qcancel.on("click",function()
						{
							self.popbox.removeClass("show");
						}
					);
					self.qcomfirm.on("click",self.setValue);
				};
		}

})(jQuery);