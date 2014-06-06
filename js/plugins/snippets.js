var shouldLabelBeVisible = function(){
    return ('placeholder' in document.createElement('input') ) ? false : true;
};

$.extend($.easing,
{
    def: 'easeOutQuad',
    easeOutExpo: function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    }
});

String.prototype.lpad = function(padString){
    return padString.substr(this.length) + this;
};