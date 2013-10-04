// indexOf pollyfill
[].indexOf||(Array.prototype.indexOf=function(a,b,c){for(c=this.length,b=(c+~~b)%c;b<c&&(!(b in this)||this[b]!==a);b++);return b^c?b:-1;});

// Numeric formating that removes trailing zeros after decimal separator
Number.prototype.toDecimalString = function(decimalPlaces) {
    
    if (isNaN(decimalPlaces))
        decimalPlaces = 0;
    
    var returnValue = this.toFixed(decimalPlaces);
    
    if (decimalPlaces > 0)
        returnValue = returnValue.replace(/0+$/, '');
        
    returnValue = returnValue.replace(/\.$/, '');
    
    return returnValue;
};