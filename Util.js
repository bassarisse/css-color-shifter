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
            
    },
    
    createColorSwatch: function (colorStr) {
        
        var newColorSwatch = document.createElement('div');
        newColorSwatch.setAttribute('class', "color-swatch");
        newColorSwatch.style.backgroundColor = colorStr;
        newColorSwatch.title = colorStr;
        
        return newColorSwatch;   
    }
    
};