
var ColorShifter = Class.extend({

    initialized: false,
    hueChange: 0,
	saturationChange: 0,
	lightnessChange: 0,
	alphaChange: 0,
    outputFormat: ColorFormat.Unknown,

    matchRegExp: null,
    sourceCssString: "",
    shiftedCssString: "",

    sourceFieldId: null,
    targetFieldId: null,
    hueElementId: null,
    saturationElementId: null,
    lightnessFieldId: null,
    alphaFieldId: null,

    init: function(sourceFieldId, targetFieldId, hueElementId, saturationElementId, lightnessFieldId, alphaFieldId) {
        
        if (this.initialized)
            return;
        this.initialized = true;
        
        this.createRegExp();
        this.setupFields(sourceFieldId, targetFieldId, hueElementId, saturationElementId, lightnessFieldId, alphaFieldId);

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
            add(ColorNames[n]);
        
        this.matchRegExp = new RegExp(regexp, "igm");
        
    },
    
    setupFields: function(sourceFieldId, targetFieldId, hueElementId, saturationElementId, lightnessFieldId, alphaFieldId) {
        
        var updateFunc = this.update.bind(this);

        this.sourceFieldId = sourceFieldId;
        this.targetFieldId = targetFieldId;
        this.hueElementId = hueElementId;
        this.saturationElementId = saturationElementId;
        this.lightnessFieldId = lightnessFieldId;
        this.alphaFieldId = alphaFieldId;

        var sourceField = document.getElementById(sourceFieldId);
        var targetField = document.getElementById(targetFieldId);
        var hueElement = document.getElementById(hueElementId);
        var saturationElement = document.getElementById(saturationElementId);
        var lightnessField = document.getElementById(lightnessFieldId);
        var alphaField = document.getElementById(alphaFieldId);

        if (sourceField) {
            sourceField.addEventListener("change", updateFunc, false);
            sourceField.addEventListener("keyup", updateFunc, false);
        }

        if (targetField) targetField.readOnly = true;

        if (hueElement) hueElement.addEventListener("keyup", updateFunc, false);
        if (saturationElement) saturationElement.addEventListener("keyup", updateFunc, false);
        if (lightnessField) lightnessField.addEventListener("keyup", updateFunc, false);
        if (alphaField) alphaField.addEventListener("keyup", updateFunc, false);
        
    },

    refreshFromFields: function() {

        var hueElement = document.getElementById(this.hueElementId);
        var saturationElement = document.getElementById(this.saturationElementId);
        var lightnessField = document.getElementById(this.lightnessFieldId);
        var alphaField = document.getElementById(this.alphaFieldId);

        if (hueElement) this.hueChange = parseFloat(hueElement.value);
        if (saturationElement) this.saturationChange = parseFloat(saturationElement.value);
        if (lightnessField) this.lightnessChange = parseFloat(lightnessField.value);
        if (alphaField) this.alphaChange = parseFloat(alphaField.value);

        if (isNaN(this.hueChange)) this.hueChange = 0;
        if (isNaN(this.saturationChange)) this.saturationChange = 0;
        if (isNaN(this.lightnessChange)) this.lightnessChange = 0;
        if (isNaN(this.alphaChange)) this.alphaChange = 0;

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

        this.shiftedCssString = cssString.replace(this.matchRegExp, function(match) {

            var colorMatch = new ColorMatch(match, self.outputFormat);
            
            if (self.alphaChange != 0)
                colorMatch.isAlphaSpecified = true;

            return colorMatch.modify(self.hueChange, self.saturationChange, self.lightnessChange, self.alphaChange);
        });

        this.fillTargetField();
	},

    fillTargetField: function() {

        var targetField = document.getElementById(this.targetFieldId);

        if (!targetField)
            return;

        targetField.value = this.shiftedCssString;

	}

});