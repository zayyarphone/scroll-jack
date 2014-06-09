var SCROLL_JACK = function(){

	var c ={},

	init = function(){

		// cache the DOM
		c.document = $(document);
		c.window   = $(window);
		c.jumpMenu = $('#jumpMenu');
		c.topNav   = $('#topNav');
		c.segments = $('section.segments');

		// bind the events
		bindUIEvents();
	},

	bindUIEvents = function(){
		c.document.scrollJack({
			sections     : 'section.segments',
			navMenu      : '#jumpMenu',
			topAllowance : c.topNav.height()
		});

		c.document.on('keydown',onKeyPress);
		c.segments.css({backgroundSize:'cover'});
		$('.carousel').carousel();
	},

	onKeyPress = function(e){

		var currentFrame;
		var $carousel;
		var $gallery;

		var left = function(){
			currentFrame = c.document.scrollJack('setting','currentFrame');
			$carousel =  c.segments.eq(currentFrame).find('.carousel');
			if ($carousel.length) {
				$carousel.carousel('slide',-1);
				return;
			}
		};

		var right = function(){
			currentFrame = c.document.scrollJack('setting','currentFrame');
			$carousel =  c.segments.eq(currentFrame).find('.carousel');
			if ($carousel.length) {
				$carousel.carousel('slide',1);
				return;
			}
		};

		var up = function(){
			c.document.scrollJack('scroll',-1);
		};

		var down = function(){
			c.document.scrollJack('scroll',1);
		};

		var keyActions = {
			37 : left,
			39 : right,
			38 : up,
			40 : down
		};

		var action = keyActions[e.which];
		if ( ! action ) return true;
		e.preventDefault();
		action();
	};

	return{
		init : init
	}
}();

$(document).ready(function(){
	SCROLL_JACK.init();
});
