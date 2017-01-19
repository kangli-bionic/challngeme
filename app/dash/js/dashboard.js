$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    },
    toggleClass: function (className, callback){
        if(!this.hasClass(className)){
            this.addClass(className);
            callback(true);
        } else {
            this.removeClass(className);
            callback(false);
        }
    }
});