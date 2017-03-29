(function($){

		 var defaultoptions={};
		 var plugname = "qphotobox";
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
		/*
		 *1.定时执行动画
		 *2.鼠标移动到dot上，清除定时器
		 *3.移动开添加定时器
		 */
		function PluginObject(target) {
			self=this;
			self.values=[];
			self.pageData=[];
			self.currentPage=1;
			self.totalPage=0;
			self.imgEles;
			self.default="images/none.png";
			self.nextBtn;
			self.prevBtn;
			self.timeline = new TimelineMax({paused:true});
			self.getPrevPage=function()
			{
				if(self.currentPage==1)
				{
					return 1;
				}else{
					self.currentPage--;
				}
			};
			self.getNextPage=function()
			{
				if(self.currentPage==self.totalPage)
				{
					return self.currentPage;
				}
				else
				{
					return self.currentPage++;
				}
			};
			self.isHead=function()
			{
				return self.currentPage==1;
			};
			self.isEnd=function()
			{
				return self.currentPage==self.totalPage;
			};
			self.getCurrentPageData=function()
			{
				return datas=self.pageData[self.currentPage-1];
			};
			self.freshUI=function(){
				if(self.isHead())
				{
					self.prevBtn.addClass("disable");
				}else{
					self.prevBtn.removeClass("disable");
				}
				if(self.isEnd()){
					self.nextBtn.addClass("disable");
				}else{
					self.nextBtn.removeClass("disable");
				}
			};
		  	self.init=function(options){
		  		self.imgEles = $(target).find(".item").find("img");
		  		self.nextBtn=target.find(".next");
		  		self.prevBtn=target.find(".prev");
		  		self.values=options.values;
		  		self.pageData=_.chunk(self.values,options.pagesize);
		  		self.totalPage=self.pageData.length;
  				$(self.imgEles).each(function(index, item) {
			        self.timeline.add(TweenLite.to(item, 1, {
			            rotationX: 360,
			            onComplete: function(data) {
			            	var datas=self.getCurrentPageData();
			                if(datas[index])
			                {
			               		$(data).attr("src", datas[index].img);
			                }else{
			                	$(data).attr("src",self.default);
			                }
			            },
			            onCompleteParams: [item]
			        }), "-=0.25");
			    });
			    //self.timeline.addCallback(function(){
			    	 // self.timeline.clear();
			    	 // self.timeline.remove();
			    //});

			    // self.timeline.addCallback(function(){
			    // 	 self.timeline.clear();
			    // 	 self.timeline.remove();
			    // });
			    //.play();
			    self.prevBtn.on("click",function(){
			    	self.getPrevPage();
			    	self.timeline.restart();
			    	self.freshUI();
			    });
			    self.nextBtn.on("click",function(){
			    	self.getNextPage();
			    	self.timeline.restart();
			    	self.freshUI();
			    });
			    self.freshUI();

		  	};
		}
})(jQuery);
