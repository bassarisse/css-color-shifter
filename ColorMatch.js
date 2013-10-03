
var ColorMatch = Class.extend({

	originalString: "",
	isValid: false,
	isAlphaSpecified: false,
	format: ColorFormat.Unknown,
	red: 0,
	green: 0,
	blue: 0,
	hue: 0,
	saturation: 0,
	lightness: 0,
	alpha: 0,
	
	_updateFromRgb: function() {
	
		var r = this.red / 255;
		var g = this.green / 255;
		var b = this.blue / 255;
		var cMax = Math.max(r, g, b);
		var cMin = Math.min(r, g, b);
		var delta = cMax - cMin;
		
		if (delta == 0) this.hue = 0;
		else if (cMax == r) this.hue = ((g - b) / delta) % 6;
		else if (cMax == g) this.hue = ((b - r) / delta) + 2;
		else this.hue = ((r - g) / delta) + 4;

		this.hue = this.hue * 60;

        if (this.hue < 0) this.hue += 360;
        if (this.hue > 360) this.hue -= 360;
		
		this.lightness = (cMax + cMin) / 2;
		
		if (delta == 0)
			this.saturation = 0;
		else
			this.saturation = delta / (1 - Math.abs(2 * this.lightness - 1));
			
		this.saturation *= 100;
		this.lightness *= 100;
		
		this._normalize();

	},
	
	_updateFromHsl: function() {
	
		var l = this.lightness / 100;
		var s = this.saturation / 100;

        if (s == 0) {
            var f = l * 255;
            this.red = f;
            this.green = f;
            this.blue = f;
            this._normalize();
            return;
        }

		var c = (1 - Math.abs(2 * l - 1)) * s;
		var h = this.hue / 60;
		var x = c * (1 - Math.abs(h % 2 - 1));
		var m = l - c / 2;
		
		var r, g, b;
		
		if (h < 0 || h >= 6) { r = 0; g = 0; b = 0; }
		else if (h < 1) { r = c; g = x; b = 0; }
		else if (h < 2) { r = x; g = c; b = 0; }
		else if (h < 3) { r = 0; g = c; b = x; }
		else if (h < 4) { r = 0; g = x; b = c; }
		else if (h < 5) { r = x; g = 0; b = c; }
		else if (h < 6) { r = c; g = 0; b = x; }
		
		r += m;
		g += m;
		b += m;
		
		this.red = r * 255;
		this.green = g * 255;
		this.blue = b * 255;
		
		this._normalize();
		
	},
    
    _applyContrast: function(contrast) {
        
        if (contrast > 255) contrast = 255;
        else if (contrast < -255) contrast = -255;
        
        var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        
        this.red = factor * (this.red - 128) + 128;
        this.green = factor * (this.green - 128) + 128;
        this.blue = factor * (this.blue - 128) + 128;
        
        this._normalize();
        this._updateFromRgb();
        
    },

    _normalize: function() {
		
        var multiplier = 10000000;
        
		this.red = Math.round(this.red);
		this.green = Math.round(this.green);
		this.blue = Math.round(this.blue);
			
		this.saturation = Math.round(this.saturation * multiplier) / multiplier;
		this.lightness = Math.round(this.lightness * multiplier) / multiplier;

        if (this.red > 255) this.red = 255;
        if (this.red < 0) this.red = 0;
        if (this.green > 255) this.green = 255;
        if (this.green < 0) this.green = 0;
        if (this.blue > 255) this.blue = 255;
        if (this.blue < 0) this.blue = 0;
        if (this.hue > 360) this.hue -= 360;
        if (this.hue < 0) this.hue += 360;
        if (this.saturation > 100) this.saturation = 100;
        if (this.saturation < 0) this.saturation = 0;
        if (this.lightness > 100) this.lightness = 100;
        if (this.lightness < 0) this.lightness = 0;
        if (this.alpha > 1) this.alpha = 1;
        if (this.alpha < 0) this.alpha = 0;

    },
	
	_setup: function(colorStr) {
	    
		if (colorStr.indexOf("#") == 0) {
		
			colorStr = colorStr.substr(1, colorStr.length - 1);
			var strLength = colorStr.length;
			
			if (strLength == 3 || strLength == 4) {
				var newStr = "";
				for (var s in colorStr) {
					newStr += colorStr[s] + colorStr[s];
				}
				colorStr = newStr;
				strLength = colorStr.length;
			}
			
			this.format = ColorFormat.Hex;
			this.isAlphaSpecified = strLength == 8;
			this.isValid = (strLength == 6 || strLength == 8);

            var startIndex = this.isAlphaSpecified ? 2 : 0;
			
			this.red = parseInt(colorStr.substr(startIndex, 2), 16);
			this.green = parseInt(colorStr.substr(startIndex + 2, 2), 16);
			this.blue = parseInt(colorStr.substr(startIndex + 4, 2), 16);
			this.alpha = this.isAlphaSpecified ? parseInt(colorStr.substr(0, 2), 16) : 1;
				
			this._updateFromRgb();
			
		} else if (colorStr.indexOf("rgb") == 0) {
		
			this.format = ColorFormat.Rgb;
			this.isAlphaSpecified = colorStr[3] == "a";
			this.isValid = true;
			
			colorStr = colorStr.replace(/[rgba \(\)]/igm, "");
			var strParts = colorStr.split(",");
			
			this.red = parseInt(strParts[0], 10);
			this.green = parseInt(strParts[1], 10);
			this.blue = parseInt(strParts[2], 10);
			this.alpha = this.isAlphaSpecified ? parseFloat(strParts[3]) : 1;
            if (isNaN(this.alpha)) this.alpha = 1;
			
			this._updateFromRgb();
			
		} else if (colorStr.indexOf("hsl") == 0) {
		
			this.format = ColorFormat.Hsl;
			this.isAlphaSpecified = colorStr[3] == "a";
			this.isValid = true;
			
			colorStr = colorStr.replace(/[hsla% \(\)]/igm, "");
			var strParts = colorStr.split(",");
			
			this.hue = parseFloat(strParts[0]);
			this.saturation = parseFloat(strParts[1]);
			this.lightness = parseFloat(strParts[2]);
			this.alpha = this.isAlphaSpecified ? parseFloat(strParts[3]) : 1;
            if (isNaN(this.alpha)) this.alpha = 1;
			
			this._updateFromHsl();
		}
		
	},

	init: function(colorStr) {

		this.originalString = colorStr;
		this._setup(colorStr);
		
	},
	
	reset: function() {
	    
	    this._setup(this.originalString);
	    
	},
	
	modify: function(options) {
		
		if (!this.isValid)
            return;

        if (options.hue) this.hue += options.hue;
        if (options.saturation) this.saturation += options.saturation;
        if (options.lightness) this.lightness += options.lightness;
        if (options.alpha) this.alpha += options.alpha;

        this._normalize();
        this._updateFromHsl();
        
        if (options.contrast) this._applyContrast(options.contrast);
            
	},
	
	convertToWebSafe: function() {
	    
	    this.isAlphaSpecified = false;
	    
	    this.red = Math.floor((this.red + 25.5) / 51) * 51;
	    this.green = Math.floor((this.green + 25.5) / 51) * 51;
	    this.blue = Math.floor((this.blue + 25.5) / 51) * 51;
	    
	    this._updateFromRgb();
	    
	},
	
	getValue: function (options) {
		
		if (!this.isValid)
            return this.originalString;
	    
        var returnStr = "";
        var format = this.format;
        
        if (typeof(options.format) != "undefined" && options.format != ColorFormat.Unknown)
            format = options.format;
        
        if (this.format == ColorFormat.Hex && this.isAlphaSpecified)
            format = ColorFormat.Rgb;
        
		switch (format) {

            case ColorFormat.Hex:
                var returnStr = "#";
                if (this.isAlphaSpecified)
                    returnStr += ((1 << 8) + Math.round(this.alpha * 255)).toString(16).slice(1);
                
                returnStr += ((1 << 24) + (this.red << 16) + (this.green << 8) + this.blue).toString(16).slice(1);
                break;

            case ColorFormat.Hsl:
                var returnStr = "hsl";
                if (this.isAlphaSpecified)
                    returnStr += "a";
                returnStr += "(" + this.hue.toDecimalString(0) + ", " + this.saturation.toDecimalString(2) + "%, " + this.lightness.toDecimalString(2) + "%";
                if (this.isAlphaSpecified)
                    returnStr +=  ", " + this.alpha.toDecimalString(4);
                returnStr += ")";
                break;

            case ColorFormat.Rgb:
            default:
                var returnStr = "rgb";
                if (this.isAlphaSpecified)
                    returnStr += "a";
                returnStr += "(" + this.red.toDecimalString(0) + ", " + this.green.toDecimalString(0) + ", " + this.blue.toDecimalString(0);
                if (this.isAlphaSpecified)
                    returnStr +=  ", " + this.alpha.toDecimalString(4);
                returnStr += ")";
                break
        }

        return returnStr;
	}
	
});