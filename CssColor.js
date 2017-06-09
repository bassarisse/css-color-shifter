
// Numeric formating that removes trailing zeros after decimal separator
function toDecimalString(str, decimalPlaces) {

    if (isNaN(decimalPlaces))
        decimalPlaces = 0;

    var returnValue = str.toFixed(decimalPlaces);

    if (decimalPlaces > 0)
        returnValue = returnValue.replace(/0+$/, '');

    returnValue = returnValue.replace(/\.$/, '');

    return returnValue;
};

function CssColor(colorStr) {

    this.originalString = "";
    this.isValid = false;
    this.isAlphaSpecified = false;
    this.format = 0;
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.hue = 0;
    this.saturation = 0;
    this.lightness = 0;
    this.alpha = 0;

    if (colorStr)
        this.setup(colorStr);

}

CssColor.prototype._updateFromRgb = function() {

    var r = this.red / 255;
    var g = this.green / 255;
    var b = this.blue / 255;
    var cMax = Math.max(r, g, b);
    var cMin = Math.min(r, g, b);
    var delta = cMax - cMin;

    if (delta === 0) this.hue = 0;
    else if (cMax === r) this.hue = ((g - b) / delta) % 6;
    else if (cMax === g) this.hue = ((b - r) / delta) + 2;
    else this.hue = ((r - g) / delta) + 4;

    this.hue = this.hue * 60;

    if (this.hue < 0) this.hue += 360;
    if (this.hue > 360) this.hue -= 360;

    this.lightness = (cMax + cMin) / 2;

    if (delta === 0)
        this.saturation = 0;
    else
        this.saturation = delta / (1 - Math.abs(2 * this.lightness - 1));

    this.saturation *= 100;
    this.lightness *= 100;

    this._normalize();

};

CssColor.prototype._updateFromHsl = function() {

    var l = this.lightness / 100;
    var s = this.saturation / 100;

    if (s === 0) {
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

};

CssColor.prototype._normalize = function() {

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
    if (this.hue >= 360) this.hue -= 360;
    if (this.hue < 0) this.hue += 360;
    if (this.saturation > 100) this.saturation = 100;
    if (this.saturation < 0) this.saturation = 0;
    if (this.lightness > 100) this.lightness = 100;
    if (this.lightness < 0) this.lightness = 0;
    if (this.alpha > 1) this.alpha = 1;
    if (this.alpha < 0) this.alpha = 0;

};

CssColor.prototype._proportialValue = function(theValue, modifyValue) {

    if (modifyValue < 0)
        return theValue + (theValue / 100 * modifyValue);

    else if (modifyValue > 0)
        return theValue + ((100 - theValue) / 100 * modifyValue);

    return theValue;
};

CssColor.prototype.setup = function(colorStr) {

    colorStr = CssColor.Names[colorStr.toLowerCase()] || colorStr;

    this.originalString = colorStr;
    this.isValid = false;

    var strParts;

    if (colorStr.indexOf("#") === 0) {

        colorStr = colorStr.substr(1, colorStr.length - 1);
        var strLength = colorStr.length;

        if (strLength === 3 || strLength === 4) {
            var newStr = "";
            for (var s = 0, sl = colorStr.length; s < sl; s++) {
                newStr += colorStr[s] + colorStr[s];
            }
            colorStr = newStr;
            strLength = colorStr.length;
        }

        this.format = CssColor.Format.Hex;
        this.isAlphaSpecified = strLength === 8;
        this.isValid = (strLength === 6 || strLength === 8);

        var startIndex = this.isAlphaSpecified ? 2 : 0;

        this.red = parseInt(colorStr.substr(startIndex, 2), 16);
        this.green = parseInt(colorStr.substr(startIndex + 2, 2), 16);
        this.blue = parseInt(colorStr.substr(startIndex + 4, 2), 16);
        this.alpha = this.isAlphaSpecified ? parseInt(colorStr.substr(0, 2), 16) / 255 : 1;

        this._updateFromRgb();

    } else if (colorStr.indexOf("rgb") === 0) {

        this.format = CssColor.Format.Rgb;
        this.isAlphaSpecified = colorStr[3] === "a";
        this.isValid = true;

        colorStr = colorStr.replace(/[rgba \(\)]/igm, "");
        strParts = colorStr.split(",");

        this.red = parseInt(strParts[0], 10);
        this.green = parseInt(strParts[1], 10);
        this.blue = parseInt(strParts[2], 10);
        this.alpha = this.isAlphaSpecified ? parseFloat(strParts[3]) : 1;
        if (isNaN(this.alpha)) this.alpha = 1;

        this._updateFromRgb();

    } else if (colorStr.indexOf("hsl") === 0) {

        this.format = CssColor.Format.Hsl;
        this.isAlphaSpecified = colorStr[3] === "a";
        this.isValid = true;

        colorStr = colorStr.replace(/[hsla% \(\)]/igm, "");
        strParts = colorStr.split(",");

        this.hue = parseFloat(strParts[0]);
        this.saturation = parseFloat(strParts[1]);
        this.lightness = parseFloat(strParts[2]);
        this.alpha = this.isAlphaSpecified ? parseFloat(strParts[3]) : 1;
        if (isNaN(this.alpha)) this.alpha = 1;

        this._updateFromHsl();
    }

};

CssColor.prototype.reset = function() {

    this.setup(this.originalString);

};

CssColor.prototype.applyContrast = function(contrast) {

    if (contrast > 255) contrast = 255;
    else if (contrast < -255) contrast = -255;

    var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    this.red = factor * (this.red - 128) + 128;
    this.green = factor * (this.green - 128) + 128;
    this.blue = factor * (this.blue - 128) + 128;

    this._normalize();
    this._updateFromRgb();

};

CssColor.prototype.convertToWebSafe = function() {

    this.isAlphaSpecified = false;

    this.red += (255 - this.red) * (1 - this.alpha);
    this.green += (255 - this.green) * (1 - this.alpha);
    this.blue += (255 - this.blue) * (1 - this.alpha);
    this.alpha = 1;

    this.red = Math.floor((this.red + 25.5) / 51) * 51;
    this.green = Math.floor((this.green + 25.5) / 51) * 51;
    this.blue = Math.floor((this.blue + 25.5) / 51) * 51;

    this._normalize();
    this._updateFromRgb();

};

CssColor.prototype.modify = function(options) {

    if (!this.isValid)
        return;

    if (!isNaN(options.hue)) {
        if (options.colorize)
            this.hue = options.hue;
        else
            this.hue += options.hue;
    }

    if (!isNaN(options.saturation)) {
        if (options.proportionalSaturation)
            this.saturation = this._proportialValue(this.saturation, options.saturation);
        else
            this.saturation += options.saturation;
    }

    if (!isNaN(options.lightness)) {
        if (options.proportionalLightness)
            this.lightness = this._proportialValue(this.lightness, options.lightness);
        else
            this.lightness += options.lightness;
    }

    if (!isNaN(options.alpha)) {
        if (options.fixAlpha)
            this.alpha = options.alpha;
        else
            this.alpha += options.alpha;
    }

    this._normalize();
    this._updateFromHsl();

    if (!isNaN(options.contrast)) this.applyContrast(options.contrast);
    if (options.webSafe) this.convertToWebSafe();

};

CssColor.prototype.getValue = function(data) {

    if (!this.isValid)
        return this.originalString;

    var options = data || {};
    var returnStr = "";
    var format = this.format;
    var alphaSpecified = (this.isAlphaSpecified || options.isAlphaSpecified);

    if (typeof options.format !== "undefined" && options.format !== CssColor.Format.Unknown)
        format = options.format;

    if (format === CssColor.Format.Hex && alphaSpecified && !options.useARGB)
        format = options.preferHSL ? CssColor.Format.Hsl : CssColor.Format.Rgb;

    var hexColorStr = "#";
    if (alphaSpecified)
        hexColorStr += ((1 << 8) + Math.round(this.alpha * 255)).toString(16).slice(1);

    hexColorStr += ((1 << 24) + (this.red << 16) + (this.green << 8) + this.blue).toString(16).slice(1);

    switch (format) {

        case CssColor.Format.Hex:
            returnStr = hexColorStr;
            if (options.contractedHexCodes && /#([\da-f])\1([\da-f])\2([\da-f])\3/i.test(returnStr))
                returnStr = "#" + returnStr[1] + returnStr[3] + returnStr[5];
            break;

        case CssColor.Format.Hsl:
            returnStr = "hsl";
            if (alphaSpecified)
                returnStr += "a";
            returnStr += "(" + toDecimalString(this.hue, 0) + ", " + toDecimalString(this.saturation, 2) + "%, " + toDecimalString(this.lightness, 2) + "%";
            if (alphaSpecified)
                returnStr +=  ", " + toDecimalString(this.alpha, 4);
            returnStr += ")";
            break;

        //case CssColor.Format.Rgb:
        default:
            returnStr = "rgb";
            if (alphaSpecified)
                returnStr += "a";
            returnStr += "(" + toDecimalString(this.red, 0) + ", " + toDecimalString(this.green, 0) + ", " + toDecimalString(this.blue, 0);
            if (alphaSpecified)
                returnStr +=  ", " + toDecimalString(this.alpha, 4);
            returnStr += ")";
            break;
    }

    if (options.colorNames) {
        var colorName = hexColorStr.toLowerCase();
        for (var n in CssColor.Names) {
            if (colorName === CssColor.Names[n].toLowerCase()) {
                returnStr = n;
                break;
            }
        }
    }

    return returnStr;
};

CssColor.prototype.getYIQ = function() {
    return (this.red * 299 + this.green * 587 + this.blue * 114) / 1000;
};

CssColor.Format = {
    Unknown: 0,
    Hex: 1,
    Rgb: 2,
    Hsl: 3,
};

CssColor.Names = {
    aliceblue: "#F0F8FF",
    antiquewhite: "#FAEBD7",
    aqua: "#00FFFF",
    aquamarine: "#7FFFD4",
    azure: "#F0FFFF",
    beige: "#F5F5DC",
    bisque: "#FFE4C4",
    black: "#000000",
    blanchedalmond: "#FFEBCD",
    blue: "#0000FF",
    blueviolet: "#8A2BE2",
    brown: "#A52A2A",
    burlywood: "#DEB887",
    cadetblue: "#5F9EA0",
    chartreuse: "#7FFF00",
    chocolate: "#D2691E",
    coral: "#FF7F50",
    cornflowerblue: "#6495ED",
    cornsilk: "#FFF8DC",
    crimson: "#DC143C",
    cyan: "#00FFFF",
    darkblue: "#00008B",
    darkcyan: "#008B8B",
    darkgoldenrod: "#B8860B",
    darkgray: "#A9A9A9",
    darkgreen: "#006400",
    darkkhaki: "#BDB76B",
    darkmagenta: "#8B008B",
    darkolivegreen: "#556B2F",
    darkorange: "#FF8C00",
    darkorchid: "#9932CC",
    darkred: "#8B0000",
    darksalmon: "#E9967A",
    darkseagreen: "#8FBC8F",
    darkslateblue: "#483D8B",
    darkslategray: "#2F4F4F",
    darkturquoise: "#00CED1",
    darkviolet: "#9400D3",
    deeppink: "#FF1493",
    deepskyblue: "#00BFFF",
    dimgray: "#696969",
    dodgerblue: "#1E90FF",
    firebrick: "#B22222",
    floralwhite: "#FFFAF0",
    forestgreen: "#228B22",
    fuchsia: "#FF00FF",
    gainsboro: "#DCDCDC",
    ghostwhite: "#F8F8FF",
    gold: "#FFD700",
    goldenrod: "#DAA520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#ADFF2F",
    honeydew: "#F0FFF0",
    hotpink: "#FF69B4",
    indianred: "#CD5C5C",
    indigo: "#4B0082",
    ivory: "#FFFFF0",
    khaki: "#F0E68C",
    lavender: "#E6E6FA",
    lavenderblush: "#FFF0F5",
    lawngreen: "#7CFC00",
    lemonchiffon: "#FFFACD",
    lightblue: "#ADD8E6",
    lightcoral: "#F08080",
    lightcyan: "#E0FFFF",
    lightgoldenrodyellow: "#FAFAD2",
    lightgray: "#D3D3D3",
    lightgreen: "#90EE90",
    lightpink: "#FFB6C1",
    lightsalmon: "#FFA07A",
    lightseagreen: "#20B2AA",
    lightskyblue: "#87CEFA",
    lightslategray: "#778899",
    lightsteelblue: "#B0C4DE",
    lightyellow: "#FFFFE0",
    lime: "#00FF00",
    limegreen: "#32CD32",
    linen: "#FAF0E6",
    magenta: "#FF00FF",
    maroon: "#800000",
    mediumaquamarine: "#66CDAA",
    mediumblue: "#0000CD",
    mediumorchid: "#BA55D3",
    mediumpurple: "#9370DB",
    mediumseagreen: "#3CB371",
    mediumslateblue: "#7B68EE",
    mediumspringgreen: "#00FA9A",
    mediumturquoise: "#48D1CC",
    mediumvioletred: "#C71585",
    midnightblue: "#191970",
    mintcream: "#F5FFFA",
    mistyrose: "#FFE4E1",
    moccasin: "#FFE4B5",
    navajowhite: "#FFDEAD",
    navy: "#000080",
    oldlace: "#FDF5E6",
    olive: "#808000",
    olivedrab: "#6B8E23",
    orange: "#FFA500",
    orangered: "#FF4500",
    orchid: "#DA70D6",
    palegoldenrod: "#EEE8AA",
    palegreen: "#98FB98",
    paleturquoise: "#AFEEEE",
    palevioletred: "#DB7093",
    papayawhip: "#FFEFD5",
    peachpuff: "#FFDAB9",
    peru: "#CD853F",
    pink: "#FFC0CB",
    plum: "#DDA0DD",
    powderblue: "#B0E0E6",
    purple: "#800080",
    red: "#FF0000",
    rosybrown: "#BC8F8F",
    royalblue: "#4169E1",
    saddlebrown: "#8B4513",
    salmon: "#FA8072",
    sandybrown: "#F4A460",
    seagreen: "#2E8B57",
    seashell: "#FFF5EE",
    sienna: "#A0522D",
    silver: "#C0C0C0",
    skyblue: "#87CEEB",
    slateblue: "#6A5ACD",
    slategray: "#708090",
    snow: "#FFFAFA",
    springgreen: "#00FF7F",
    steelblue: "#4682B4",
    tan: "#D2B48C",
    teal: "#008080",
    thistle: "#D8BFD8",
    tomato: "#FF6347",
    turquoise: "#40E0D0",
    violet: "#EE82EE",
    wheat: "#F5DEB3",
    white: "#FFFFFF",
    whitesmoke: "#F5F5F5",
    yellow: "#FFFF00",
    yellowgreen: "#9ACD32",
};
