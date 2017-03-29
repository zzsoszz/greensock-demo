(function($){

		var  defaultoptions = {
			  selector      : this.selector
		};
		
		var plugname="qmultiselectbox";
		
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

		function InputItem(target,pluginobject)
		{
			self=this;
			self.init=function()
			{
				self.qinputvalue=target.find(".qinputvalue");
				self.qinputcomfirm=target.find(".qinputcomfirm");
				self.qinputcancel=target.find(".qinputcancel");
				self.qinputcomfirm.click(function(e){
					e.stopPropagation();
					var inputval=$(e.target).closest(".input-panel").find(".qinputvalue").val();
					$("<div>").addClass("qitem listrow").data("qvalue",inputval).text(inputval).insertBefore(pluginobject.qadd);
				});
				self.qinputcancel.click(function(e){
					e.stopPropagation();
					var inputpanel=$(e.target).closest(".input-panel");
					inputpanel.remove();
				});
			}
			self.init();
		}


		function PluginObject(target)
		{
				var self=this;
				self.popbox;
				self.qmultiselectbox;

				self.init=function(initoptions)
				{
					self.qmultiselectbox=initoptions.qmultiselectboxele;
					self.qcomfirm=initoptions.qmultiselectboxele.find(".qcomfirm");
					self.qadd=initoptions.qmultiselectboxele.find(".qadd");
					self.qcancel=initoptions.qmultiselectboxele.find(".qcancel");
					self.popbox=initoptions.qmultiselectboxele.closest(".popbox");
					self.qlistgroup=initoptions.qmultiselectboxele.find(".qlistgroup");
					target.on("focus",function()
						{
							self.popbox.addClass("show");
						}
					);
					var initvalues=target.val()==null?[]:target.val().split(",");
					self.qmultiselectbox.find(".qitem").each(function(){
						var itemvalue=$(this).data("qvalue");
						if(itemvalue!=""){
							if($.inArray(itemvalue,initvalues)>-1){
								$(this).addClass("active");
								return;
							}
						}
						$(this).removeClass("active");
					});
					self.popbox.on("click",function(ele){
						if($(ele.target).closest(".qmultiselectbox").get().length==0)
						{
							self.popbox.removeClass("show");
						}
						if($(ele.target).hasClass("qitem"))
						{
							$(ele.target).toggleClass("active");
						}
					});
					self.qcancel.on("click",function()
						{
							self.popbox.removeClass("show");
						}
					);
					self.qcomfirm.on("click",function()
						{
							var values= self.qmultiselectbox.find(".qitem.active").map(function(){
								return $(this).data("qvalue");
							}).get().concat();
							target.val(values);
							self.popbox.removeClass("show");
						}
					);
					self.qadd.on("click",function(){
						var inputitem=$("#temp1").clone().attr("id","").insertAfter(self.qlistgroup).show();
						new InputItem(inputitem,self);
					});
					
					
				};
		}

})(jQuery)


/*
模拟hashmap操作
var map = {}; // Map map = new HashMap();
map[key] = value; // map.put(key, value);
var value = map[key]; // Object value = map.get(key);
var has = key in map; // boolean has = map.containsKey(key);
delete map[key]; // map.remove(key); 
*/
