;(function ($,document,window,undefined) {

    var pluginName = 'MyAweSomePlugin';

    function Plugin(element,options){

        // cache the dom element
        var settings = $.extend({},$.fn[pluginName].defaults,options);
        var el = element;
        var $el = $(element);
        var $document = $(document);
        var $window = $(window);

        // init only call the required functions to initialize the plugin
        function init(){
            bind();
            hook('onInit');
        };

        function bind(){
            // here we apply the custom style using jquery, For example
            // $('.some-div').css({background-color:'green'});
            // $('.some-div').height(100);
        };

        function unbind(){
            // here we remove the the custom style applied at the bind stage
            // $('.some-div').removeAttr('style');
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
            $el.removeData('plugin_' + pluginName);
            hook('onDestroy');
        };

        function hook(hookName){
            if (typeof settings[hookName] === 'function') {
                settings[hookName].call(el);
            };
        };

        init();

        return {
            init    : init,
            destory : destroy,
            scroll  : scroll,
            setting : setting
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
        currentFrame : 0,
        speed        : 600,
        delay        : 1000,
        onInit       : function(){},
        onDestroy    : function(){}
    };

})(jQuery,document,window);