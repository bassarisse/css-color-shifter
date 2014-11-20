var Util = {
    
    addEvent: function(element, events, callback) {
        
        if (!element)
            return;
            
        events.split(" ").forEach(function(aEvent) {
            if (aEvent) {
                
                if (element.addEventListener)
                    element.addEventListener(aEvent, callback, false);
                else if (element.attachEvent)
                    element.attachEvent("on" + aEvent, callback);
                
            }
        });
        
    },
    
    removeEvent: function(element, events, callback) {
        
        if (!element)
            return;
            
        events.split(" ").forEach(function(aEvent) {
            if (aEvent) {
                
                if (element.removeEventListener)
                    element.removeEventListener(aEvent, callback, false);
                else if (element.detachEvent)
                    element.detachEvent("on" + aEvent, callback);
                
            }
        });
        
    },
    
    createColorSwatch: function (colorStr) {
        
        var newColorSwatch = document.createElement("div");
        newColorSwatch.className = "color-swatch";
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
                colorParts = colorStr.replace(/[rgba \(\)]/ig, "").split(",");
                colorParts.pop();
                colorStr = "rgb(" + colorParts.join(",") + ")";
                this.applyBackgroundColor(element, colorStr);
                return;
            }
            
            if (/^hsla/i.test(colorStr)) {
                colorParts = colorStr.replace(/[hsla \(\)]/ig, "").split(",");
                colorParts.pop();
                colorStr = "hsl(" + colorParts.join(",") + ")";
                this.applyBackgroundColor(element, colorStr);
                return;
            }
        }
        
    },
    
    appendAttribute: function (node, attribute, value) {
        
        if (node && typeof node.nodeType !== "undefined" && node.nodeType === node.ELEMENT_NODE) {
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