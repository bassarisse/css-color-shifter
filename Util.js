var Util = {
    
    addEvent: function(element, event, callback) {
        
        if (!element)
            return;
        
        if (element.addEventListener)
            element.addEventListener(event, callback, false);
        else if (element.attachEvent)
            element.attachEvent('on' + event, callback);
            
    },
    
    removeEvent: function(element, event, callback) {
        
        if (!element)
            return;
        
        if (element.removeEventListener)
            element.removeEventListener(event, callback, false);
        else if (element.detachEvent)
            element.detachEvent('on' + event, callback);
            
    }
    
};