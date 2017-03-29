(function($){


		  var defaultoptions={};
		  var plugname = "qcarrousel";
		  $.fn[plugname] = function() {
		    var isMethodCall = arguments.length > 0 && typeof arguments[0] === "string";
		    if (isMethodCall) {

		      var methodname = arguments[0];
		      var args = Array.prototype.slice.call(arguments, 1);
		      this.each(function() {
		        var instance = $.data(this, plugname);
		        if (instance && $.isFunction(instance[methodname])) {
		          var method = instance[methodname];
		          method.apply(instance, args);
		        }
		      });
		    } else {
		      var inputoptions = arguments;
		      $(this).each(
		        function() {
		          var optionsnew = $.extend({}, defaultoptions);
		          if (inputoptions.length > 0) {
		            optionsnew = $.extend(optionsnew, inputoptions[0]);
		          }
		          var instance = $(this).data(plugname);
		          if (instance) {
		            instance.init(optionsnew);
		          } else {
		            var target = $(this);
		            instance = new PluginObject(target);
		            instance.init(optionsnew);
		            $(this).data(plugname, instance);
		          }
		        }
		      );
		      return this;
		    };
		  }

		var startX, startY;

		function GetSlideAngle(dx, dy) {
		    return Math.atan2(dy, dx) * 180 / Math.PI;
		}
		 
		//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
		function GetSlideDirection(startX, startY, endX, endY) {
		    var dy = startY - endY;
		    var dx = endX - startX;
		    var result = 0;
		 
		    //如果滑动距离太短
		    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
		        return result;
		    }
		 
		    var angle = GetSlideAngle(dx, dy);
		    if (angle >= -45 && angle < 45) {
		        result = 4;
		    } else if (angle >= 45 && angle < 135) {
		        result = 1;
		    } else if (angle >= -135 && angle < -45) {
		        result = 2;
		    }
		    else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
		        result = 3;
		    }
		 
		    return result;
		}

/*
 *1.定时执行动画
 *2.鼠标移动到dot上，清除定时器
 *3.移动开添加定时器
 */

		  function PluginObject(target) {
		  	var self=this;
		    self.curindex = 0;
		    self.preindex = 0;
		    self.items = [];
		    self.dots =[];
		    var iterval;
		    self.showIndex=function(index)
		    {
		      var oldele=$(self.items.get(self.preindex)); 
			  var olddotele=$(self.dots.get(self.preindex));
			  olddotele.removeClass("active");
			  oldele.stop().animate({"opacity":"0"},500,function f()
			  {
			  		$(self.dots.get(index)).addClass("active");
		  	  		self.preindex=index;
			  });
			  $(self.items.get(index)).show().stop().animate({"opacity":"1"},500,function f2(){
			  		//setTimeout(self.start, 5000);
		  	  });
		    };
		    self.prev=function()
		    {
			  if (self.curindex==0) {
		        self.curindex=self.items.size()-1;
		      } else {
		        self.curindex--;
		      }
		      self.showIndex(self.curindex);
		    };
		    self.next=function()
		    {
		      if (self.curindex >= self.items.size()-1) {
		        self.curindex=0;
		      } else {
		        self.curindex++;
		      }
		      self.showIndex(self.curindex);
		    };
		    self.startAutoRun=function()
		    {
		    	iterval=setInterval(self.next,2000);	
		    };
 			self.stopAutoRun=function()
		    {
		    	clearInterval(iterval);
		    };
		    self.init = function(options) {
		      self.items = target.find(".item");
		      self.dots = target.find(".dot");
		      self.dots.on("mouseenter",function(event)
		      {
		      	 if(options.autoRun){
		     	  self.stopAutoRun();
		     	 }
		      	 self.showIndex(self.dots.get().indexOf(event.target));
		      }).on("mouseleave",function(){
		      	 if(options.autoRun){
		      		self.startAutoRun();
		      	  }
		      });
		      //self.showIndex(0);
		      if(options.autoRun){
				self.startAutoRun();
		      }
			  target.on('touchstart', function (ev) {
				    startX = ev.originalEvent.touches[0].pageX;
				    startY = ev.originalEvent.touches[0].pageY;   

				    if(options.autoRun){
				   	 self.stopAutoRun();
					}
			  });
			  target.on('touchend', function (ev) {
				    var endX, endY;
				    endX = ev.originalEvent.changedTouches[0].pageX;
				    endY = ev.originalEvent.changedTouches[0].pageY;
				    var direction = GetSlideDirection(startX, startY, endX, endY);
				    switch (direction) {
				        case 0:
				            //alert("没滑动");
				            break;
				        case 1:
				            //alert("向上");
				            break;
				        case 2:
				            //alert("向下");
				            break;
				        case 3:
				        	self.next();
				            break;
				        case 4:
				        	self.prev();
				            //alert("向右");
				            break;
				        default:            
				    }
				    if(options.autoRun){
				    	self.startAutoRun(); 
					}
			  });

		    }
		}
	

})(jQuery);
