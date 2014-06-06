$.extend($.easing,
{
    easeOutExpo: function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    }
});

;(function ($,document,window,undefined) {

    var pluginName = 'carousel';

    function Plugin(element,options){

        var el = element;
        var $el = $(element);
        options = $.extend({},$.fn[pluginName].defaults,options);

        // cache the dom element
        var $wrapper     = $el.find(options.wrapper);
        var $containers  = $el.find(options.containers);
        var $housing     = $el.find(options.housing);
        var $prev        = $el.find(options.prev);
        var $next        = $el.find(options.next);
        var $bullets     = $el.find(options.bullets);
        var slideNames   = [];
        var currentIndex = 0;
        var count        = $containers.length;
        var isActive     = '';
        var str          = [];
        var sliding      = false;

        var bulletTmpl = '<li><a href="#" class="{{active}}"></a></li>';
        var numberTmpl = '<li><a href="#" class="{{active}}"> {{number}} </a></li>';
        var tmpl = options.bulletType === 'bullets' ? bulletTmpl : numberTmpl;

        function init(){

            // bind the dom event
            for (var i = 0; i < count; i++) {
                slideNames[i] = $containers.eq(i).attr('data-article-name') || '';
                isActive = (i === 0) ? 'active' : '';
                str.push(
                    tmpl
                        .replace('{{active}}', isActive)
                        .replace('{{number}}', (i+1))
                    );
            };

            $bullets.html(str.join(''));

            // define the housing & wrapper length
            $wrapper.css({ width: (count * 100) + '%' });
            $containers.css({ width: (100 / count) + '%' });

            hook('onInit');

            bindUIEvents();
        };

        function bindUIEvents(){
            $prev.on('click',function(e){
                e.preventDefault();
                slide(-1);
            }).hide();

            $next.on('click',function(e){
                e.preventDefault();
                slide(1);
            }).attr('data-content',slideNames[currentIndex + 1] || '');

            $bullets.on('click','a',function(e){
                e.preventDefault();
                var $parentLi = $(this).parent('li');
                currentIndex =  $bullets.find('li').index($parentLi);
                slide(0);
            });
        };

        function slide(idx){
            var toIndex = currentIndex + idx;
            if (toIndex < 0 || toIndex === count) return false;
            if (sliding === true) return false;
            sliding = true;
            currentIndex = toIndex;
            $prev.hide().attr('data-content',slideNames[currentIndex - 1] || '');
            $next.hide().attr('data-content',slideNames[currentIndex + 1] || '');
            if (currentIndex > 0) {$prev.show()};
            if (currentIndex < count - 1) {$next.show()};
            $bullets
                .find('a').removeClass('active')
                .eq(currentIndex).addClass('active');
            $housing.animate(
                {scrollLeft : currentIndex * ($containers.width())},
                options.speed,
                'easeOutExpo',
                function(){
                    sliding = false;
                }
            );
        };

        function option(key,val){
            if (val) {
                options[key] = val;
            } else {
                return options[key];
            }
        };

        function destroy(){
            $el.removeData('plugin_' + pluginName);
            hook('onDestroy');
        };

        function hook(hookName){
            if (options[hookName] !== undefined) {
                options[hookName].call(el);
            };
        };

        init();

        return {
            option  : option,
            destory : destroy,
            slide   : slide
        };
    };

    $.fn[pluginName] = function(options){

        if (typeof arguments[0] === 'string') {

            var methodName = arguments[0];
            var args = Array.prototype.slice.call(arguments,1);
            var returnVal;

            this.each(function(){
                if ($.data(this,'plugin_' + pluginName) && typeof $.data(this,'plugin_' + pluginName)[methodName] === 'function') {
                    $.data(this,'plugin_' + pluginName)[methodName].apply(this,args);
                } else {
                    throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
                }
            });

        } else if(typeof options === 'object' || ! options) {

            return this.each(function(){
                if ( ! $.data(this,'plugin_' + pluginName) ) {
                    $.data(this,'plugin_' + pluginName,new Plugin(this,options));
                };
            });
        }
    };

    $.fn[pluginName].defaults = {
        housing    : '.carousel-housing',
        wrapper    : '.carousel-wrapper',
        containers : '.carousel-container',
        bullets    : '.carousel-bullets',
        bulletType : 'bullets',
        prev       : 'a.prev',
        next       : 'a.next',
        speed      : 1000,
        onInit     : function(){},
        onDestroy  : function(){}
    };

})(jQuery,document,window);