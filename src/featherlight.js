/**
* Featherlight – ultra slim jQuery lightbox
* https://github.com/noelboss/featherlight
*
* Copyright 2012, Noel Bossart
* MIT Licensed.
*/
(function($) {
	"use strict";

	var setupFeatherlight = function(c, $content){
		var t = this,
			$t = $(this),
			variant = $t.attr('data-'+c.namespace+'-variant'),
			$bg = $(c.bg || '<div class="'+c.namespace+'"><div class="'+c.namespace+'-content"><span class="'+c.namespace+'-close">X</span></div></div>');

		if($content.length < 1){
			t.$content = $($t.attr(c.targetAttr), c.context);
		} else {
			t.$content = $content;
		}

		if(t.$content.length > 0){
			// clone DOM for the background, wrapper and the closebutton
			t.$fl = $bg.clone();

			// add css class to override styles
			if(variant){
				t.$fl.addClass(variant);
			}

			// bind close function on close button
			t.$fl.find('.'+c.namespace+'-close')
				.on(c.closeTrigger+'.'+c.namespace, $.proxy(c.close, t))
				.after(t.$content.show()); // add content after closebutton

			// close when click on background
			if(c.clickBgClose){
				t.$fl.on(c.closeTrigger+'.'+c.namespace, $.proxy(c.close, t));
			}

			// bind open function
			if(t.hasOwnProperty('nodeName')){
				$t.on(c.openTrigger+'.'+c.namespace, $.proxy(c.open, t));
			} else {
				$.proxy(c.open, t)();
			}
		}
	};

	var fl = {
		featherlight: function($content, config) {
			var c = $.extend({}, $.fn.featherlight.defaults, config),
				$content = $content || $();

			if(typeof $content === 'string'){
				$content = $($content);
			}
			if($content.length > 0){
				$.proxy(setupFeatherlight, {}, c, $content)();
			}
		}
	};

	$.extend($, fl);

	// extend jQuery
	$.fn.featherlight = function(config, $content) {
		var c = $.extend({}, $.fn.featherlight.defaults, config),
				$content = $content || $();
		$(this).each(function(){
			$.proxy(setupFeatherlight, this, c, $content)();
		});
	}

	// featherlight defaults
	$.fn.featherlight.defaults = {
		selector:     '[data-featherlight]',  // elements that trigger the lightbox
		targetAttr:   'data-featherlight',    // attribut of the triggered element that contains the selector to the lightbox content
		openTrigger:  'click',                // event that triggers the lightbox
		closeTrigger: 'click',                // event that triggers the closing of the lightbox
		context:      'body',                 // context used to search for the lightbox content and triggers
		namespace:    'featherlight',         // name of the events and css class prefix
		clickBgClose: true,                   // close lightbox on click on the background
		bg: null,                             // custom DOM for the background, wrapper and the closebutton
		autostart:    true,                   // initialize all links with that match "selector" on document ready
		open: function(e){                    // opens the lightbox "this" contains $fl with the lightbox, and c with the configuration
			var t = this;
			t.$fl.prependTo('body').fadeIn();
			if(e) e.preventDefault();
		},
		close: function(e){                    // closes the lightbox "this" contains $fl with the lightbox, and c with the configuration
			var t = this;
			t.$fl.fadeOut(function(){
				t.$fl.detach();
			});
			if (e) e.preventDefault();
		}
	};

	// bind featherlight on ready if config autostart is true
	$(document).ready(function(){
		var c = $.fn.featherlight.defaults;
		if(c.autostart){
			$(c.selector, c.context).featherlight();
		}
	});
}(jQuery));