Number.prototype.toDecimalString = function(decimalPlaces) {
    
    if (isNaN(decimalPlaces))
        decimalPlaces = 0;
    
    var returnValue = this.toFixed(decimalPlaces);
    
    if (decimalPlaces > 0)
        returnValue = returnValue.replace(/0+$/, '');
        
    returnValue = returnValue.replace(/\.$/, '');
    
    return returnValue;
};