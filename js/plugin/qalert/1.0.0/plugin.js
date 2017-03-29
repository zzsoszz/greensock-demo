(function($){
		var plugname="qalert";
		var box;
		function run()
		{
		    box.removeClass('hidden');
		    box.removeClass('visuallyhidden');
		    setTimeout(
		      function()
		        {
		          box.addClass('visuallyhidden');
		          box.one('transitionend', function(e) {
		                  box.addClass('hidden');
		          });
		        },200
		    );
		}
		$.fn[plugname]=function()
		{
			if(box==null)
			{
				box = $(".qalert");
			}
			run();
		};
})(jQuery);
