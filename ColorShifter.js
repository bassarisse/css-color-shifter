
var ColorShifter = Class.extend({

    initialized: false,
    hueChange: 0,
	saturationChange: 0,
	lightnessChange: 0,
	alphaChange: 0,
	contrastChange: 0,
    outputFormat: ColorFormat.Unknown,
	colorize: false,
    useOnlyWebSafeColors: false,
    useColorNames: false,
    useARGB: false,
    preferHSL: false,
    fixAlpha: false,
    proportionalSaturation: false,
    proportionalLightness: false,

    matchRegExp: null,
    colorRegExp: null,
    sourceCssString: "",
    shiftedCssString: "",
    updateCallback: null,
    syncFieldsCallback: null,
    
    containerId: null,
    sourceFieldId: null,
    targetFieldId: null,
    hueFieldId: null,
    saturationFieldId: null,
    lightnessFieldId: null,
    alphaFieldId: null,
    contrastFieldId: null,
    formatFieldId: null,
    colorizeFieldId: null,
    webSafeFieldId: null,
    colorNamesFieldId: null,
    aRGBFieldId: null,
    preferHSLFieldId: null,
    fixAlphaFieldId: null,
    proportionalSaturationFieldId: null,
    proportionalLightnessFieldId: null,
    originalColorsContainerId: null,
    newColorsContainerId: null,
    
    _setupFields: function(enable, options) {
        
        if (options) {
            this.containerId = options.containerId;
            this.sourceFieldId = options.sourceFieldId;
            this.targetFieldId = options.targetFieldId;
            this.hueFieldId = options.hueFieldId;
            this.saturationFieldId = options.saturationFieldId;
            this.lightnessFieldId = options.lightnessFieldId;
            this.alphaFieldId = options.alphaFieldId;
            this.contrastFieldId = options.contrastFieldId;
            this.formatFieldId = options.formatFieldId;
            this.colorizeFieldId = options.colorizeFieldId;
            this.webSafeFieldId = options.webSafeFieldId;
            this.colorNamesFieldId = options.colorNamesFieldId;
            this.aRGBFieldId = options.aRGBFieldId;
            this.preferHSLFieldId = options.preferHSLFieldId;
            this.fixAlphaFieldId = options.fixAlphaFieldId;
            this.proportionalSaturationFieldId = options.proportionalSaturationFieldId;
            this.proportionalLightnessFieldId = options.proportionalLightnessFieldId;
            this.originalColorsContainerId = options.originalColorsContainerId;
            this.newColorsContainerId = options.newColorsContainerId;
        }
        
        if (typeof(enable) === 'undefined')
            return;
        
        var eventFunc = enable ? Util.addEvent : Util.removeEvent;
        var updateFunc = this.updateCallback;
        var syncFieldsFunc = this.syncFieldsCallback;

        var sourceField = document.getElementById(this.sourceFieldId);
        var targetField = document.getElementById(this.targetFieldId);
        var hueField = document.getElementById(this.hueFieldId);
        var saturationField = document.getElementById(this.saturationFieldId);
        var lightnessField = document.getElementById(this.lightnessFieldId);
        var alphaField = document.getElementById(this.alphaFieldId);
        var contrastField = document.getElementById(this.contrastFieldId);
        var formatField = document.getElementById(this.formatFieldId);
        var colorizeField = document.getElementById(this.colorizeFieldId);
        var webSafeField = document.getElementById(this.webSafeFieldId);
        var colorNamesField = document.getElementById(this.colorNamesFieldId);
        var aRGBField = document.getElementById(this.aRGBFieldId);
        var preferHSLField = document.getElementById(this.preferHSLFieldId);
        var fixAlphaField = document.getElementById(this.fixAlphaFieldId);
        var proportionalSaturationField = document.getElementById(this.proportionalSaturationFieldId);
        var proportionalLightnessField = document.getElementById(this.proportionalLightnessFieldId);

        if (sourceField) {
            eventFunc(sourceField, "change", updateFunc);
            eventFunc(sourceField, "keyup", updateFunc);
            if (enable && sourceField.value !== '')
                this.update(sourceField.value);
        }

        if (targetField) {
            targetField.readOnly = enable;
        }
        
        if (sourceField && targetField) {
            eventFunc(sourceField, "scroll", syncFieldsFunc);
            eventFunc(targetField, "scroll", syncFieldsFunc);
            eventFunc(sourceField, "resize", syncFieldsFunc);
            eventFunc(targetField, "resize", syncFieldsFunc);
            eventFunc(sourceField, "mouseout", syncFieldsFunc);
            eventFunc(targetField, "mouseout", syncFieldsFunc);
            eventFunc(sourceField, "mousemove", syncFieldsFunc);
            eventFunc(targetField, "mousemove", syncFieldsFunc);
            eventFunc(document.body, "mouseup", syncFieldsFunc);
            eventFunc(document.body, "mouseout", syncFieldsFunc);
        }

        eventFunc(hueField, "change", updateFunc);
        eventFunc(saturationField, "change", updateFunc);
        eventFunc(lightnessField, "change", updateFunc);
        eventFunc(alphaField, "change", updateFunc);
        eventFunc(contrastField, "change", updateFunc);
        eventFunc(formatField, "change", updateFunc);
        eventFunc(colorizeField, "change", updateFunc);
        eventFunc(webSafeField, "change", updateFunc);
        eventFunc(colorNamesField, "change", updateFunc);
        eventFunc(aRGBField, "change", updateFunc);
        eventFunc(preferHSLField, "change", updateFunc);
        eventFunc(fixAlphaField, "change", updateFunc);
        eventFunc(proportionalSaturationField, "change", updateFunc);
        eventFunc(proportionalLightnessField, "change", updateFunc);
        eventFunc(window, "resize", updateFunc);
        
    },

    init: function(options) {
        
        if (this.initialized)
            return;
        this.initialized = true;
        
        this.createRegExp();
        this.updateCallback = this.update.bind(this);
        this.syncFieldsCallback = this.fieldSync.bind(this);
        this._setupFields(true, options);

    },
    
    createRegExp: function() {
        
        var regexp = "", add = function(s) {
            if (regexp != "")
                regexp += "|";
            regexp += s;
        };
        
        add('#[\\da-f]{3,8}');
        add('rgba?\\(\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*(,\\s*\\d(.\\d+)?\\s*)?\\)');
        add('hsla?\\(\\s*\\d+(.\\d+)?\\s*,\\s*\\d+(.\\d+)?%?\\s*,\\s*\\d+(.\\d+)?%?\\s*(,\\s*\\d(.\\d+)?\\s*)?\\)');
        
        for (var n in ColorNames)
            add('\\b' + n + '\\b');
        
        this.colorRegExp = new RegExp(regexp, "igm");
            
        regexp = ':[^:;{}!\\n]*(' + regexp + ')';
        
        this.matchRegExp = new RegExp(regexp, "igm");
        
    },
    
    enableFields: function() {
        this._setupFields(true);
    },
    
    disableFields: function() {
        this._setupFields(false);
    },
    
    fieldSync: function(event) {
        
        var changedField = event.srcElement || event.target;
        
        var fieldToSyncId = this.targetFieldId;
        if (changedField.id == this.targetFieldId)
            fieldToSyncId = this.sourceFieldId;
        else if (changedField.id != this.sourceFieldId)
            changedField = document.getElementById(this.sourceFieldId);
            
        var fieldToSync = document.getElementById(fieldToSyncId);
        
        fieldToSync.scrollTop = changedField.scrollTop;
        if (changedField.style.margin)
            fieldToSync.style.margin = changedField.style.margin;
        if (changedField.style.width)
            fieldToSync.style.width = changedField.style.width;
        if (changedField.style.height)
            fieldToSync.style.height = changedField.style.height;
        
    },

    refreshFromFields: function() {

        var hueElement = document.getElementById(this.hueFieldId);
        var saturationElement = document.getElementById(this.saturationFieldId);
        var lightnessField = document.getElementById(this.lightnessFieldId);
        var alphaField = document.getElementById(this.alphaFieldId);
        var contrastField = document.getElementById(this.contrastFieldId);
        var formatField = document.getElementById(this.formatFieldId);
        var colorizeField = document.getElementById(this.colorizeFieldId);
        var webSafeField = document.getElementById(this.webSafeFieldId);
        var colorNamesField = document.getElementById(this.colorNamesFieldId);
        var aRGBField = document.getElementById(this.aRGBFieldId);
        var preferHSLField = document.getElementById(this.preferHSLFieldId);
        var fixAlphaField = document.getElementById(this.fixAlphaFieldId);
        var proportionalSaturationField = document.getElementById(this.proportionalSaturationFieldId);
        var proportionalLightnessField = document.getElementById(this.proportionalLightnessFieldId);

        if (hueElement) this.hueChange = parseFloat(hueElement.value);
        if (saturationElement) this.saturationChange = parseFloat(saturationElement.value);
        if (lightnessField) this.lightnessChange = parseFloat(lightnessField.value);
        if (alphaField) this.alphaChange = parseFloat(alphaField.value);
        if (contrastField) this.contrastChange = parseFloat(contrastField.value);
        if (formatField) this.outputFormat = parseInt(formatField.value, 10);
        if (colorizeField) this.colorize = colorizeField.checked ? true : false;
        if (webSafeField) this.useOnlyWebSafeColors = webSafeField.checked ? true : false;
        if (colorNamesField) this.useColorNames = colorNamesField.checked ? true : false;
        if (aRGBField) this.useARGB = aRGBField.checked ? true : false;
        if (preferHSLField) this.preferHSL = preferHSLField.checked ? true : false;
        if (fixAlphaField) this.fixAlpha = fixAlphaField.checked ? true : false;
        if (proportionalSaturationField) this.proportionalSaturation = proportionalSaturationField.checked ? true : false;
        if (proportionalLightnessField) this.proportionalLightness = proportionalLightnessField.checked ? true : false;

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
        
        this.sourceCssString = cssString;
        this.refreshFromFields();
        
        var self = this;
        var colorsShown = [];
        var container = document.getElementById(this.containerId);
        var originalColorsContainer = document.getElementById(this.originalColorsContainerId);
        var newColorsContainer = document.getElementById(this.newColorsContainerId);
        
        if (originalColorsContainer) {
            while (originalColorsContainer.hasChildNodes())
                originalColorsContainer.removeChild(originalColorsContainer.lastChild);
        }
        
        if (newColorsContainer) {
            while (newColorsContainer.hasChildNodes())
                newColorsContainer.removeChild(newColorsContainer.lastChild);
        }

        this.shiftedCssString = cssString.replace(this.matchRegExp, function(match) {
            
            var modifiedStringPart = match.replace(self.colorRegExp, function(originalColorString) {
                
                var colorString = ColorNames[originalColorString.toLowerCase()] || originalColorString;
                var colorMatch = new ColorMatch(colorString);
                
                var testColorString = colorMatch.getValue({
                    format: ColorFormat.Rgb,
                    isAlphaSpecified: true
                });
                    
                colorMatch.modify({
                    hue: self.hueChange,
                    saturation: self.saturationChange,
                    lightness: self.lightnessChange,
                    alpha: self.alphaChange,
                    contrast: self.contrastChange,
                    colorize: self.colorize,
                    webSafe: self.useOnlyWebSafeColors,
                    fixAlpha: self.fixAlpha,
                    proportionalSaturation: self.proportionalSaturation,
                    proportionalLightness: self.proportionalLightness
                });
                
                var newColor = colorMatch.getValue({
                    format: self.outputFormat,
                    colorNames: self.useColorNames,
                    useARGB: self.useARGB,
                    preferHSL: self.preferHSL,
                    isAlphaSpecified: ((!self.fixAlpha && self.alphaChange != 0) || (self.fixAlpha && self.alphaChange != 1))
                });
                
                if (colorsShown.indexOf(testColorString) == -1) {
                    colorsShown.push(testColorString);
                    
                    if (originalColorsContainer)
                        originalColorsContainer.appendChild(Util.createColorSwatch(originalColorString));
                    if (newColorsContainer)
                        newColorsContainer.appendChild(Util.createColorSwatch(newColor));
                    
                }
                
                return newColor;
            });
        
            return modifiedStringPart;
        });
        
        var c, width, node;
        
        if (originalColorsContainer) {
            width = originalColorsContainer.offsetWidth / colorsShown.length;
            for (c in originalColorsContainer.childNodes) {
                node = originalColorsContainer.childNodes[c];
                if (node && typeof(node.nodeType) != 'undefined' && node.nodeType === node.ELEMENT_NODE)
                    node.style.width = width + "px";
            }
        }
        
        if (newColorsContainer) {
            width = newColorsContainer.offsetWidth / colorsShown.length;
            for (c in newColorsContainer.childNodes) {
                node = newColorsContainer.childNodes[c];
                if (node && typeof(node.nodeType) != 'undefined' && node.nodeType === node.ELEMENT_NODE)
                    node.style.width = width + "px";
            }
        }

        this.fillTargetField();
	},

    fillTargetField: function() {

        var targetField = document.getElementById(this.targetFieldId);

        if (!targetField)
            return;

        targetField.value = this.shiftedCssString;

	}

});