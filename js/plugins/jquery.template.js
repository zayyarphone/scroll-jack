;(function ($,document,window,undefined) {

    var pluginName = 'MyAwesomePlugin';

    function Plugin(element,options){

        // cache the dom element
        var settings  = $.extend({},$.fn[pluginName].defaults,options);
        var el        = element;
        var $el       = $(element);
        var $document = $(document);
        var $window   = $(window);

        // init only call the required functions to initialize the plugin
        function init(){
            bind();
            awesomer(0);
            hook('onInit');
        };

        function bind(){

            // initial DOM mantipulation
            $el
                .find(settings.frames)
                .css({
                    'background-color' :'#bada55',
                    'border-color'     : 'yellow'
                });

            // or bind the DOM events
            $el.find('.prev').on('click',toPrev);
            $el.find('.next').on('click',toNext);
        };

        function unbind(){
            // here we reverse everything we do at the bind stage
            $el
                .find(settings.frames)
                .removeAttr('style');

            $el.find('.prev').off('click',toPrev);
            $el.find('.next').off('click',toNext);
        };

        function toPrev(e){
            e.preventDefault();
            awesomer(-1);
        };

        function toNext(e){
            e.preventDefault();
            awesomer(1);
        };

        function setting(key,val){
            if (val) {
                settings[key] = val;
            } else {
                return settings[key];
            }
        };

        function destroy(){
            unbind();
            // $el.removeData('plugin_' + 'awelsome');
            hook('onDestroy');
        };

        // do your actual awesome plugin stuff happens here
        function awesomer(idx){
            settings.current =  settings.current + idx;
            alert('Current index is ' + settings.current);
        };

        function hook(hookName){
            if (typeof settings[hookName] === 'function') {
                settings[hookName].call(el);
            };
        };

        init();

        return {
            init     : init,
            destroy  : destroy,
            awesomer : awesomer,
            setting  : setting
        };
    };

    // this is the plugin binding code. For most case, do not touch
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

    // you can specify your default values here
    $.fn[pluginName].defaults = {
        current   : 0,
        frames    : '.awesome-div',
        width     : 200,
        height    : 200,
        speed     : 600,
        delay     : 1000,
        onInit    : function(){},
        onDestroy : function(){}
    };

})(jQuery,document,window);

