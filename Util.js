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
        newColorSwatch.className = 'color-swatch';
        newColorSwatch.title = colorStr;
        
        this.applyBackgroundColor(newColorSwatch, colorStr);
        
        return newColorSwatch;   
    },
    
    applyBackgroundColor: function(element, colorStr) {
        
        try {
            element.style.backgroundColor = colorStr;
        } catch(ex) {
            
            var colorParts;
            
            if (/^rgba/i.test(colorStr)) {
                colorParts = colorStr.replace(/[rgba \(\)]/ig, '').split(',');
                colorParts.pop();
                colorStr = 'rgb(' + colorParts.join(',') + ')';
                this.applyBackgroundColor(element, colorStr);
                return;
            }
            
            if (/^hsla/i.test(colorStr)) {
                colorParts = colorStr.replace(/[hsla \(\)]/ig, '').split(',');
                colorParts.pop();
                colorStr = 'hsl(' + colorParts.join(',') + ')';
                this.applyBackgroundColor(element, colorStr);
                return;
            }
        }
        
    },
    
    appendAttribute: function (node, attribute, value) {
        
        if (node && typeof(node.nodeType) != 'undefined' && node.nodeType === node.ELEMENT_NODE) {
            var currentAttribute = node.getAttribute(attribute) || "";
            node.setAttribute(attribute, currentAttribute + value);
        }
            
    },
    
    getElementFromEvent: function(e) {
        var targetElement;
        
    	if (!e) e = window.event;
    	
    	targetElement = e.target || e.srcElement;
    	
    	if (targetElement.nodeType == 3) // defeat Safari bug
    		targetElement = targetElement.parentNode;
    		
		return targetElement;
    }
    
};