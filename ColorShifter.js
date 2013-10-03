
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
    hueElementId: null,
    saturationElementId: null,
    lightnessFieldId: null,
    alphaFieldId: null,
    contrastFieldId: null,

    init: function(sourceFieldId, targetFieldId, hueElementId, saturationElementId, lightnessFieldId, alphaFieldId, contrastFieldId) {
        
        if (this.initialized)
            return;
        this.initialized = true;
        
        this.createRegExp();
        this.setupFields(sourceFieldId, targetFieldId, hueElementId, saturationElementId, lightnessFieldId, alphaFieldId, contrastFieldId);

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
    
    setupFields: function(sourceFieldId, targetFieldId, hueElementId, saturationElementId, lightnessFieldId, alphaFieldId, contrastFieldId) {
        
        var updateFunc = this.update.bind(this);

        this.sourceFieldId = sourceFieldId;
        this.targetFieldId = targetFieldId;
        this.hueElementId = hueElementId;
        this.saturationElementId = saturationElementId;
        this.lightnessFieldId = lightnessFieldId;
        this.alphaFieldId = alphaFieldId;
        this.contrastFieldId = contrastFieldId;

        var sourceField = document.getElementById(sourceFieldId);
        var targetField = document.getElementById(targetFieldId);
        var hueElement = document.getElementById(hueElementId);
        var saturationElement = document.getElementById(saturationElementId);
        var lightnessField = document.getElementById(lightnessFieldId);
        var alphaField = document.getElementById(alphaFieldId);
        var contrastField = document.getElementById(contrastFieldId);

        if (sourceField) {
            sourceField.addEventListener("change", updateFunc, false);
            sourceField.addEventListener("keyup", updateFunc, false);
        }

        if (targetField) targetField.readOnly = true;

        if (hueElement) hueElement.addEventListener("change", updateFunc, false);
        if (saturationElement) saturationElement.addEventListener("change", updateFunc, false);
        if (lightnessField) lightnessField.addEventListener("change", updateFunc, false);
        if (alphaField) alphaField.addEventListener("change", updateFunc, false);
        if (contrastField) contrastField.addEventListener("change", updateFunc, false);
        
    },

    refreshFromFields: function() {

        var hueElement = document.getElementById(this.hueElementId);
        var saturationElement = document.getElementById(this.saturationElementId);
        var lightnessField = document.getElementById(this.lightnessFieldId);
        var alphaField = document.getElementById(this.alphaFieldId);
        var contrastField = document.getElementById(this.contrastFieldId);

        if (hueElement) this.hueChange = parseFloat(hueElement.value);
        if (saturationElement) this.saturationChange = parseFloat(saturationElement.value);
        if (lightnessField) this.lightnessChange = parseFloat(lightnessField.value);
        if (alphaField) this.alphaChange = parseFloat(alphaField.value);
        if (contrastField) this.contrastChange = parseFloat(contrastField.value);

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
                
                var colorMatch = new ColorMatch(colorString, self.outputFormat);
                
                if (self.alphaChange != 0)
                    colorMatch.isAlphaSpecified = true;
                    
                var newColor = colorMatch.modify(self.hueChange, self.saturationChange, self.lightnessChange, self.alphaChange, self.contrastChange);
                
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