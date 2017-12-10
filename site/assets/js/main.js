var bar;

$(document).ready(function(){
	var i;
	var menu = $('.main-menu');
	
	var lastElementClicked;
	var el;
	var lastURL;
	var that;
	var pageName;
	
	var Homepage = Barba.BaseView.extend({
		namespace: 'homepage',
		onEnter: function() {
			// this.backHeaderOut();
		},
		onEnterCompleted: function() {
		// The Transition has just finished.
		},
		onLeave: function() {
		// A new Transition toward a new page has just started.
		},
		onLeaveCompleted: function() {
		// The Container has just been removed from the DOM.
		}
	});

	Homepage.init();

	Barba.Pjax.start();
	Barba.Prefetch.init();

	Barba.Dispatcher.on('linkClicked', function(el) {
		lastElementClicked = el;
		lastURL = $(el).attr('href');
	});

	Barba.Dispatcher.on('newPageReady', function() {
		// console.log(Barba.HistoryManager.currentStatus().namespace);
		that = this;
		pageName = Barba.HistoryManager.currentStatus().namespace;
		// console.log(pageName);
		
	});

	var HomeTransition = Barba.BaseTransition.extend({
		start: function() {
			Promise
				.all([this.newContainerLoading, this.fadeOut(), this.menuOut()])
				.then(this.showNewPage.bind(this));
		},

		fadeOut: function() {
			this.backHeaderOut();
			return $(this.oldContainer).animate({ opacity: 0 }).promise();
		},

		menuOut: function() {
			var deferred = Barba.Utils.deferred();
			TweenMax.to(menu, 0.5, {top:"0px", ease:Quint.easeOut});
		}, 

		showNewPage: function() {
			var _this = this;
			$el = $(this.newContainer);
			$el.css({
				visibility : 'visible',
				opacity : 0
			});
			$el.animate({ opacity: 1 }, 500);
			this.done();
		},

		backHeaderOut: function() {
			TweenMax.to($('.back-title'), 1, {
				top: "-210px",
				ease:Quint.easeOut
			});
		}
	});

	var AboutTransition = Barba.BaseTransition.extend({
		start: function() {
			Promise
				.all([this.newContainerLoading, this.fadeOut(), this.menuIn()])
				.then(this.showNewPage.bind(this));
		},

		fadeOut: function() {
			this.backHeaderOut();
			return $(this.oldContainer).animate({ opacity: 0 }).promise();
		},

		menuIn: function() {
			var deferred = Barba.Utils.deferred();
			TweenMax.to(menu, 0.5, {top:"30px", ease:Quint.easeOut});
		}, 

		showNewPage: function() {
			var _this = this;
			var $el = $(this.newContainer);

			$el.css({
				visibility: 'visible',
				opacity: 0
			});
			
			this.fadeIn($el);
			this.backHeaderIn();
			this.barFill();
			this.done();
		},

		fadeIn: function(el) {

			el.animate({ opacity: 1 }, 500);
		},

		barFill: function() {

			bar = $('.bar-fill');

			$(bar).each(function(){
				var barWidth = $(this).attr('data-fill');
				TweenMax.to(this, 1, {
					width: barWidth,
					ease:Quint.easeOut
				});
			});	
		},

		backHeaderIn: function() {
			TweenMax.to($('.back-title'), 1, {
				top: "0px",
				ease:Quint.easeOut
			});
		},

		backHeaderOut: function() {
			TweenMax.to($('.back-title'), 1, {
				top: "-210px",
				ease:Quint.easeOut
			});
		}

	});

	var ContactTransition = Barba.BaseTransition.extend({
		start: function() {
			Promise
				.all([this.newContainerLoading, this.fadeOut(), this.menuIn()])
				.then(this.showNewPage.bind(this));
		},

		fadeOut: function() {
			this.backHeaderOut();
			return $(this.oldContainer).animate({ opacity: 0 }).promise();
		},

		menuIn: function() {
			var deferred = Barba.Utils.deferred();
			TweenMax.to(menu, 0.5, {top:"30px", ease:Quint.easeOut});
		}, 

		showNewPage: function() {
			var _this = this;
			var $el = $(this.newContainer);
			$el.css({
				visibility: 'visible',
				opacity: 0
			});
			$el.animate({ opacity: 1 }, 500);
			this.backHeaderIn();
			this.boxMove();
			this.done();
		},

		barFill: function() {

			bar = $('.bar-fill');

			$(bar).each(function(){
				var barWidth = $(this).attr('data-fill');
				TweenMax.to(this, 0.5, {
					width: barWidth,
					ease:Quint.easeOut
				});
			});	
		},

		backHeaderIn: function() {

			TweenMax.to($('.back-title'), 1, {
				top: "0px",
				ease:Quint.easeOut
			});
		},

		backHeaderOut: function() {

			TweenMax.to($('.back-title'), 1, {
				top: "-210px",
				ease:Quint.easeOut
			});
		},

		boxMove: function() {
			var request = null;
			var mouse = {
				x: 0,
				y: 0
			};
			var cx = window.innerWidth / 2;
			var cy = window.innerHeight / 2;

			$('body').mousemove(function(event) {
				mouse.x = event.pageX;
				mouse.y = event.pageY;

				cancelAnimationFrame(request);
				request = requestAnimationFrame(update);
			});

			function update() {

				dx = mouse.x - cx;
				dy = mouse.y - cy;

				tilty = (dy / cy) * 15;
				tiltx = -(dx / cx) * 15;
				radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2));
				degree = (radius * 20);
				TweenLite.to(".white-box", 1, {
					// transform: 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)',
					x: Math.round(tiltx) + "px",
					y: Math.round(-tilty) + "px",
					ease: Power2.easeOut
				});
				TweenLite.to(".yellow-box", 1, {
					// transform: 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)',
					x: Math.round(-tiltx) + "px",
					y: Math.round(tilty) + "px",
					ease: Power2.easeOut
				});
			}

			$(window).resize(function() {
				cx = window.innerWidth / 2;
				cy = window.innerHeight / 2;
			});
		}

	});

	

	var FadeTransition = Barba.BaseTransition.extend({
		start: function() {

			// As soon the loading is finished and the old page is faded out, let's fade the new page
			Promise
				.all([this.newContainerLoading, this.fadeOut()])
				.then(this.fadeIn.bind(this));
			},

		fadeOut: function() {
		/**
		 * this.oldContainer is the HTMLElement of the old Container
		 */

		return $(this.oldContainer).animate({ opacity: 0 }).promise();
		},

		fadeIn: function() {
		/**
		 * this.newContainer is the HTMLElement of the new Container
		 * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
		 * Please note, newContainer is available just after newContainerLoading is resolved!
		 */

		var _this = this;
		var $el = $(this.newContainer);

		$(this.oldContainer).hide();

		$el.css({
			visibility : 'visible',
			opacity : 0
		});

		$el.animate({ opacity: 1 }, 400, function() {
			/**
			* Do not forget to call .done() as soon your transition is finished!
			* .done() will automatically remove from the DOM the old Container
			*/
			
			var menuIn = TweenMax.to(menu, 0.5, {top:"30px", ease:Quint.easeOut});
			

			_this.done();
		});
		}
	});

	/**
	 * Next step, you have to tell Barba to use the new Transition
	 */

	Barba.Pjax.getTransition = function() {
	  /**
		* Here you can use your own logic!
		* For example you can use different Transition based on the current page or link...
		*/

		

		var transitionObj = FadeTransition;

			if (lastURL === 'index.html') {
				transitionObj = HomeTransition;
			}
			if (lastURL === 'about.html') {
				transitionObj = AboutTransition;
			}
			if (lastURL === 'contact.html') {
				transitionObj = ContactTransition;
			}

			if (Barba.HistoryManager.prevStatus().namespace === 'contact' && lastURL === 'index.html') {
				console.log('Contact to Homepage!');
			}
		
		console.log("get!" + pageName);  
		// console.log(transitionObj);
		return transitionObj;
	};

	












	

	var menuItem = $('.main-menu ul li');
	var siteHeader = $('.main-menu h1');

	$(menuItem).hover(
		function() {
			$(menuItem).css({"opacity": 0.5});
			$(this).css({"opacity": 1});
		},
		function() {
			$(menuItem).css({"opacity": 1});
		}
	);

	$(siteHeader).hover(
		function() {
			$(menuItem).css({"opacity": 0.5});
		},
		function() {
			$(menuItem).css({"opacity": 1});
		}
	);

	$('.main-menu a').on('click', function(){
		$('.main-menu a').removeClass('active');
		$(this).addClass('active');
	});



	


});


