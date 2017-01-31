var swipe = {
    touchStartListener : function(e){
        var touchobj = e.changedTouches[0];
        this.swipedir = 'none';
        this.dist = 0;
        this.startX = touchobj.pageX;
        this.startY = touchobj.pageY;
        this.startTime = new Date().getTime(); // record time when finger first makes contact with surface
        //e.preventDefault();
    },
    touchMoveListener : function(e){
       e.preventDefault(); // prevent scrolling when inside DIV
    },
    touchEndListener : function(e){
        var touchobj = e.changedTouches[0]
        this.distX = touchobj.pageX - this.startX // get horizontal dist traveled by finger while in contact with surface
        this.distY = touchobj.pageY - this.startY // get vertical dist traveled by finger while in contact with surface
        this.elapsedTime = new Date().getTime() - this.startTime // get time elapsed
        if (this.elapsedTime <= this.allowedTime){ // first condition for awipe met
            if (Math.abs(this.distX) >= this.threshold && Math.abs(this.distY) <= this.restraint){ // 2nd condition for horizontal swipe met
                this.swipedir = (this.distX < 0)? 'LEFT' : 'RIGHT' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(this.distY) >= this.threshold && Math.abs(this.distX) <= this.restraint){ // 2nd condition for vertical swipe met
                this.swipedir = (this.distY < 0)? 'UP' : 'DOWN' // if dist traveled is negative, it indicates up swipe
            }
        }
        this.handleswipe(this.swipedir);
      //  e.preventDefault()
    },
    handleswipe : function(){

    },
    addSwipeListener : function(el, threshold, allowedTime, callback){
        var touchsurface = el;
        this.threshold = threshold; //required min distance traveled to be considered swipe
        this.restraint = 100; // maximum distance allowed at the same time in perpendicular direction
        this.allowedTime = allowedTime; // maximum time allowed to travel that distance
        this.handleswipe = callback || function(swipedir){}
        touchsurface.addEventListener('touchstart', this.touchStartListener.bind(this));
        touchsurface.addEventListener('touchmove', this.touchMoveListener.bind(this));
        touchsurface.addEventListener('touchend', this.touchEndListener.bind(this));
    },
    removeSwipeListener : function(el){
        var touchsurface = el,
            ctx = this;
        touchsurface.removeEventListener('touchstart', ctx.touchStartListener);
        touchsurface.removeEventListener('touchmove', ctx.touchMoveListener);
        touchsurface.removeEventListener('touchend', ctx.touchEndListener);
    }
}