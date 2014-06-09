;(function ($,document,window,undefined) {

    var pluginName = 'scrollJack';

    function Plugin(element,options){

        var el = element;
        var $el = $(element);
        var settings = $.extend({},$.fn[pluginName].defaults,options);

        // cache the dom element
        var $document = $(document);
        var $window = $(window);
        var $body = $('body');
        var $sections = $el.find(settings.sections);
        var $navMenu = $el.find(settings.navMenu);
        var windowResizeDone;
        var lastActionAt;
        var hashStrings = {};
        var hashKeys = {};
        var looper;
        var sectionCount = $sections.length;

        function init(){
            bind();
            adjustHeight();
            generateHash();
            actHash();
            hook('onInit');
        };

        function adjustHeight(){
            $sections.height($window.height());
        };

        function generateHash(){
            var hashTag;
            $navMenu.find('a').each(function(i){
                if (hashTag = this.hash.substr(1)) {
                    hashStrings[hashTag] = i;
                    hashKeys[i] = hashTag;
                }
            });
        };

        function actHash(){
            var hashTag = window.location.hash.substr(1);
            if (hashStrings[hashTag]) {
                settings.currentFrame = hashStrings[hashTag];
            };
            scroll(0,-1);
        };

        function bind(){
            $document.on({'DOMMouseScroll mousewheel': onWindowScroll});
            $navMenu.on('click','a',onNavClick);
            $window.on('resize',onWindowResize);
        };

        function unbind(){
            $document.off({'DOMMouseScroll mousewheel': onWindowScroll});
            $navMenu.off('click','a',onNavClick);
            $body.css({'overflow-y':'auto'})
            $sections.removeAttr('style');
        };

        function onWindowResize(){
            clearTimeout(windowResizeDone);
            windowResizeDone = setTimeout(function(){
                adjustHeight();
                scroll(0,-1);
            },100);
        };

        function onWindowScroll(e){

            if (lastActionAt < settings.delay) return false;

            // when scroll up
            if (e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0 ){

                if(settings.currentFrame > 0){
                    scroll(-1);
                    return false;
                }
            }
            // when scroll down
            else {
                if (settings.currentFrame < sectionCount - 1) {
                    scroll(1);
                    return false;
                }
            }

        };

        function onNavClick(e){
            e.preventDefault();
            var hashTag = this.hash.substr(1);
            settings.currentFrame = hashStrings[hashTag];
            scroll(0,-1);
            $navMenu.find('li').removeClass('active');
            $(this)
                .parents()
                .filter('li')
                .addClass('active');
        };

        function scroll(action,delay){

            if ( lastActionAt < (delay || settings.delay) ) return false;
            if ( action === (-1) && settings.currentFrame === 0) return true;
            if ( action === 1 && settings.currentFrame === $sections.length - 1) return true;

            lastActionAt = 0;
            settings.currentFrame = settings.currentFrame + (action);
            runCounter();

            var hashTag = hashKeys[settings.currentFrame];

            // transimit the event of before changed
            $.event.trigger({
                type   : 'view_before_changed',
                action :  hashTag
            });

            var scrollAmount =( $window.height() * settings.currentFrame ) + settings.topAllowance;

            // scroll here
           $('body,html').animate({scrollTop: scrollAmount}, settings.speed, function(){

                if ( ! hashKeys[settings.currentFrame] ) return;

                var $achr = $navMenu.find('li a[href="#'+ hashTag +'"]');

                // update the window hash
                window.location.hash = hashTag;

                // remove all the active class from the menu
                $navMenu.find('li').removeClass('active');

                // only add the active class to the current achor parent and grand parent li
                $achr.parents().filter('li').addClass('active');

                // transimit the event for the other subscribers to listen
                $.event.trigger({
                    type   : 'view_after_changed',
                    action :  hashTag
                });

            });

        };

        function setting(key,val){
            if (val) {
                settings[key] = val;
            } else {
                return settings[key];
            }
        };

        function destroy(){
            $el.removeData('plugin_' + pluginName);
            hook('onDestroy');
        };

        function hook(hookName){
            if (typeof settings[hookName] === 'function') {
                settings[hookName].call(el);
            };
        };

        function runCounter(){
            clearInterval(looper);
            looper = setInterval(function(){
                if (lastActionAt === settings.delay) {
                    clearInterval(looper);
                };
                lastActionAt = lastActionAt + 100;
            },100);
        };

        init();

        return {
            setting : setting,
            destory : destroy,
            scroll  : scroll,
            actHash : actHash
        };
    };

    $.fn[pluginName] = function(options){

        if (typeof arguments[0] === 'string') {

            var methodName = arguments[0];
            var args = Array.prototype.slice.call(arguments,1);
            var returnVal;

            this.each(function(){
                if ($.data(this,'plugin_' + pluginName) && typeof $.data(this,'plugin_' + pluginName)[methodName] === 'function') {
                    returnVal = $.data(this,'plugin_' + pluginName)[methodName].apply(this,args);
                } else {
                    throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
                }
            });

            return returnVal === undefined ?  this : returnVal;

        } else if(typeof options === 'object' || ! options) {

            return this.each(function(){
                if ( ! $.data(this,'plugin_' + pluginName) ) {
                    $.data(this,'plugin_' + pluginName,new Plugin(this,options));
                };
            });
        }
    };

    $.fn[pluginName].defaults = {
        sections     : 'section.segments',
        navMenu      : '.jump-menu',
        speed        : 600,
        delay        : 1000,
        topAllowance : 0,
        currentFrame : 0,
        onInit       : function(){},
        onDestroy    : function(){}
    };

})(jQuery,document,window);