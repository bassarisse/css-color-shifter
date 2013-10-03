
var ColorShifter = Class.extend({

    initialized: false,
    hueChange: 0,
	saturationChange: 0,
	lightnessChange: 0,
	alphaChange: 0,
	contrastChange: 0,
    outputFormat: ColorFormat.Unknown,

    matchRegExp: null,
    colorRegExp: null,
    sourceCssString: "",
    shiftedCssString: "",

    sourceFieldId: null,
    targetFieldId: null,
    hueFieldId: null,
    saturationFieldId: null,
    lightnessFieldId: null,
    alphaFieldId: null,
    contrastFieldId: null,
    useOnlyWebSafeColors: false,

    init: function(options) {
        
        if (this.initialized)
            return;
        this.initialized = true;
        
        this.createRegExp();
        this.setupFields(options);

    },
    
    createRegExp: function() {
        
        var regexp = "", add = function(s) {
            if (regexp != "")
                regexp += "|";
            regexp += s;
        };
        
        add('#[\\da-f]{3,8}');
        add('rgb(a)?\\(( )*\\d+( )*,( )*\\d+( )*,( )*\\d+( )*(,( )*\\d(.\\d+)?( )*)?\\)');
        add('hsl(a)?\\(( )*\\d+(.\\d+)?( )*,( )*\\d+(.\\d+)?%?( )*,( )*\\d+(.\\d+)?%?( )*(,( )*\\d(.\\d+)?( )*)?\\)');
        
        for (var n in ColorNames)
            add(n);
        
        this.colorRegExp = new RegExp(regexp, "igm");
            
        regexp = ":[^:;{}!]*(" + regexp + ")";
        
        this.matchRegExp = new RegExp(regexp, "igm");
        
    },
    
    setupFields: function(options) {
        
        var updateFunc = this.update.bind(this);

        this.sourceFieldId = options.sourceFieldId;
        this.targetFieldId = options.targetFieldId;
        this.hueFieldId = options.hueFieldId;
        this.saturationFieldId = options.saturationFieldId;
        this.lightnessFieldId = options.lightnessFieldId;
        this.alphaFieldId = options.alphaFieldId;
        this.contrastFieldId = options.contrastFieldId;
        this.webSafeFieldId = options.webSafeFieldId;

        var sourceField = document.getElementById(this.sourceFieldId);
        var targetField = document.getElementById(this.targetFieldId);
        var hueField = document.getElementById(this.hueFieldId);
        var saturationField = document.getElementById(this.saturationFieldId);
        var lightnessField = document.getElementById(this.lightnessFieldId);
        var alphaField = document.getElementById(this.alphaFieldId);
        var contrastField = document.getElementById(this.contrastFieldId);
        var webSafeField = document.getElementById(this.webSafeFieldId);

        if (sourceField) {
            sourceField.addEventListener("change", updateFunc, false);
            sourceField.addEventListener("keyup", updateFunc, false);
        }

        if (targetField) targetField.readOnly = true;

        if (hueField) hueField.addEventListener("change", updateFunc, false);
        if (saturationField) saturationField.addEventListener("change", updateFunc, false);
        if (lightnessField) lightnessField.addEventListener("change", updateFunc, false);
        if (alphaField) alphaField.addEventListener("change", updateFunc, false);
        if (contrastField) contrastField.addEventListener("change", updateFunc, false);
        if (webSafeField) webSafeField.addEventListener("change", updateFunc, false);
        
    },

    refreshFromFields: function() {

        var hueElement = document.getElementById(this.hueFieldId);
        var saturationElement = document.getElementById(this.saturationFieldId);
        var lightnessField = document.getElementById(this.lightnessFieldId);
        var alphaField = document.getElementById(this.alphaFieldId);
        var contrastField = document.getElementById(this.contrastFieldId);
        var webSafeField = document.getElementById(this.webSafeFieldId);

        if (hueElement) this.hueChange = parseFloat(hueElement.value);
        if (saturationElement) this.saturationChange = parseFloat(saturationElement.value);
        if (lightnessField) this.lightnessChange = parseFloat(lightnessField.value);
        if (alphaField) this.alphaChange = parseFloat(alphaField.value);
        if (contrastField) this.contrastChange = parseFloat(contrastField.value);
        if (webSafeField) this.useOnlyWebSafeColors = webSafeField.checked ? true : false;

        if (isNaN(this.hueChange)) this.hueChange = 0;
        if (isNaN(this.saturationChange)) this.saturationChange = 0;
        if (isNaN(this.lightnessChange)) this.lightnessChange = 0;
        if (isNaN(this.alphaChange)) this.alphaChange = 0;
        if (isNaN(this.contrastChange)) this.contrastChange = 0;

    },

	update: function(cssString) {

        if (typeof(cssString) != "string") {
            var sourceField = document.getElementById(this.sourceFieldId);
            if (sourceField)
                cssString = sourceField.value;
    
            if (typeof(cssString) != "string")
                return;
        }
        
        this.refreshFromFields();

        var self = this;
        this.sourceCssString = cssString;
        
        //TODO: jQuery should NOT be used on the final version
        
        var originalColorsContainer = $("#originalColors");
        var changedColorsContainer = $("#changedColors");
        
        originalColorsContainer.empty();
        changedColorsContainer.empty();

        this.shiftedCssString = cssString.replace(this.matchRegExp, function(match) {
            
            var modifiedStringPart = match.replace(self.colorRegExp, function(colorString) {
                
                colorString = ColorNames[colorString.toLowerCase()] || colorString;
                
                var colorMatch = new ColorMatch(colorString);
                
                if (self.alphaChange != 0)
                    colorMatch.isAlphaSpecified = true;
                    
                colorMatch.modify({
                    hue: self.hueChange,
                    saturation: self.saturationChange,
                    lightness: self.lightnessChange,
                    alpha: self.alphaChange,
                    contrast: self.contrastChange
                });
                
                if (self.useOnlyWebSafeColors)
                    colorMatch.convertToWebSafe();
                
                var newColor = colorMatch.getValue({
                    format: self.outputFormat
                });
                
                originalColorsContainer.append('<div class="color-swatch" style="background-color:' + colorString + ';"></div>');
                changedColorsContainer.append('<div class="color-swatch" style="background-color:' + newColor + ';"></div>');
                
                for (var n in ColorNames) {
                    if (newColor.toLowerCase() == ColorNames[n].toLowerCase()) {
                        newColor = n;
                        break;
                    }
                }
                
                return newColor;
            });
        
            return modifiedStringPart;
        });
        
        originalColorsContainer.append('<br clear="all">');

        this.fillTargetField();
	},

    fillTargetField: function() {

        var targetField = document.getElementById(this.targetFieldId);

        if (!targetField)
            return;

        targetField.value = this.shiftedCssString;

	}

});