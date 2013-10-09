
var ColorShifter = Class.extend({

    initialized: false,
    matchRegExp: null,
    colorRegExp: null,
    sourceCssString: "",
    shiftedCssString: "",
    syncFieldsCallback: null,
    updateCallback: null,
    tiedFieldChangeCallback: null,
    updateTimer: 0,
    
    hueChange: 0,
	saturationChange: 0,
	lightnessChange: 0,
	alphaChange: 0,
	contrastChange: 0,
    outputFormat: ColorFormat.Unknown,
    postProcessing: PostProcessing.None,
	colorize: false,
    useOnlyWebSafeColors: false,
    useColorNames: false,
    useContractedHexCodes: false,
    useARGB: false,
    preferHSL: false,
    fixAlpha: false,
    proportionalSaturation: false,
    proportionalLightness: false,
    disablecCSSCheck: false,

    containerId: null,
    sourceFieldId: null,
    targetFieldId: null,
    hueFieldId: null,
    hueNumericFieldId: null,
    saturationFieldId: null,
    saturationNumericFieldId: null,
    lightnessFieldId: null,
    lightnessNumericFieldId: null,
    alphaFieldId: null,
    alphaNumericFieldId: null,
    contrastFieldId: null,
    contrastNumericFieldId: null,
    formatFieldId: null,
    postProcessingFieldId: null,
    colorizeFieldId: null,
    webSafeFieldId: null,
    colorNamesFieldId: null,
    contractedHexCodesFieldId: null,
    aRGBFieldId: null,
    preferHSLFieldId: null,
    fixAlphaFieldId: null,
    proportionalSaturationFieldId: null,
    proportionalLightnessFieldId: null,
    disablecCSSCheckFieldId: null,
    originalColorsContainerId: null,
    newColorsContainerId: null,
    
    _setupFields: function(enable, options) {
        
        if (options) {
            this.containerId = options.containerId;
            this.sourceFieldId = options.sourceFieldId;
            this.targetFieldId = options.targetFieldId;
            this.hueFieldId = options.hueFieldId;
            this.hueNumericFieldId = options.hueNumericFieldId;
            this.saturationFieldId = options.saturationFieldId;
            this.saturationNumericFieldId = options.saturationNumericFieldId;
            this.lightnessFieldId = options.lightnessFieldId;
            this.lightnessNumericFieldId = options.lightnessNumericFieldId;
            this.alphaFieldId = options.alphaFieldId;
            this.alphaNumericFieldId = options.alphaNumericFieldId;
            this.contrastFieldId = options.contrastFieldId;
            this.contrastNumericFieldId = options.contrastNumericFieldId;
            this.formatFieldId = options.formatFieldId;
            this.colorizeFieldId = options.colorizeFieldId;
            this.postProcessingFieldId = options.postProcessingFieldId;
            this.webSafeFieldId = options.webSafeFieldId;
            this.colorNamesFieldId = options.colorNamesFieldId;
            this.contractedHexCodesFieldId = options.contractedHexCodesFieldId;
            this.aRGBFieldId = options.aRGBFieldId;
            this.preferHSLFieldId = options.preferHSLFieldId;
            this.fixAlphaFieldId = options.fixAlphaFieldId;
            this.proportionalSaturationFieldId = options.proportionalSaturationFieldId;
            this.proportionalLightnessFieldId = options.proportionalLightnessFieldId;
            this.disablecCSSCheckFieldId = options.disablecCSSCheckFieldId;
            this.originalColorsContainerId = options.originalColorsContainerId;
            this.newColorsContainerId = options.newColorsContainerId;
        }
        
        if (typeof(enable) === 'undefined')
            return;
        
        var eventFunc = enable ? Util.addEvent : Util.removeEvent;
        var updateEvents = "change input";
        var updateFunc = this.updateCallback;
        var syncFieldsFunc = this.syncFieldsCallback;

        var sourceField = document.getElementById(this.sourceFieldId);
        var targetField = document.getElementById(this.targetFieldId);
        var hueField = document.getElementById(this.hueFieldId);
        var hueNumericField = document.getElementById(this.hueNumericFieldId);
        var saturationField = document.getElementById(this.saturationFieldId);
        var saturationNumericField = document.getElementById(this.saturationNumericFieldId);
        var lightnessField = document.getElementById(this.lightnessFieldId);
        var lightnessNumericField = document.getElementById(this.lightnessNumericFieldId);
        var alphaField = document.getElementById(this.alphaFieldId);
        var alphaNumericField = document.getElementById(this.alphaNumericFieldId);
        var contrastField = document.getElementById(this.contrastFieldId);
        var contrastNumericField = document.getElementById(this.contrastNumericFieldId);
        var formatField = document.getElementById(this.formatFieldId);
        var postProcessingField = document.getElementById(this.postProcessingFieldId);
        var colorizeField = document.getElementById(this.colorizeFieldId);
        var webSafeField = document.getElementById(this.webSafeFieldId);
        var colorNamesField = document.getElementById(this.colorNamesFieldId);
        var contractedHexCodesField = document.getElementById(this.contractedHexCodesFieldId);
        var aRGBField = document.getElementById(this.aRGBFieldId);
        var preferHSLField = document.getElementById(this.preferHSLFieldId);
        var fixAlphaField = document.getElementById(this.fixAlphaFieldId);
        var proportionalSaturationField = document.getElementById(this.proportionalSaturationFieldId);
        var proportionalLightnessField = document.getElementById(this.proportionalLightnessFieldId);
        var disablecCSSCheckField = document.getElementById(this.disablecCSSCheckFieldId);

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
            eventFunc(sourceField, "scroll resize mouseout mousemove", syncFieldsFunc);
            eventFunc(targetField, "scroll resize mouseout mousemove", syncFieldsFunc);
            eventFunc(document.body, "mouseup", syncFieldsFunc);
            eventFunc(document.body, "mouseout", syncFieldsFunc);
        }
        
        if (hueField && hueNumericField) {
            eventFunc(hueField, "change", this.tiedFieldChangeCallback);
            eventFunc(hueNumericField, "change", this.tiedFieldChangeCallback);
        }
        
        if (saturationField && saturationNumericField) {
            eventFunc(saturationField, "change", this.tiedFieldChangeCallback);
            eventFunc(saturationNumericField, "change", this.tiedFieldChangeCallback);
        }
        
        if (lightnessField && lightnessNumericField) {
            eventFunc(lightnessField, "change", this.tiedFieldChangeCallback);
            eventFunc(lightnessNumericField, "change", this.tiedFieldChangeCallback);
        }
        
        if (alphaField && alphaNumericField) {
            eventFunc(alphaField, "change", this.tiedFieldChangeCallback);
            eventFunc(alphaNumericField, "change", this.tiedFieldChangeCallback);
        }
        
        if (contrastField && contrastNumericField) {
            eventFunc(contrastField, "change", this.tiedFieldChangeCallback);
            eventFunc(contrastNumericField, "change", this.tiedFieldChangeCallback);
        }

        eventFunc(hueField, updateEvents, updateFunc);
        eventFunc(hueNumericField, updateEvents, updateFunc);
        eventFunc(saturationField, updateEvents, updateFunc);
        eventFunc(saturationNumericField, updateEvents, updateFunc);
        eventFunc(lightnessField, updateEvents, updateFunc);
        eventFunc(lightnessNumericField, updateEvents, updateFunc);
        eventFunc(alphaField, updateEvents, updateFunc);
        eventFunc(alphaNumericField, updateEvents, updateFunc);
        eventFunc(contrastField, updateEvents, updateFunc);
        eventFunc(contrastNumericField, updateEvents, updateFunc);
        eventFunc(formatField, updateEvents, updateFunc);
        eventFunc(postProcessingField, updateEvents, updateFunc);
        eventFunc(colorizeField, updateEvents, updateFunc);
        eventFunc(webSafeField, updateEvents, updateFunc);
        eventFunc(colorNamesField, updateEvents, updateFunc);
        eventFunc(contractedHexCodesField, updateEvents, updateFunc);
        eventFunc(aRGBField, updateEvents, updateFunc);
        eventFunc(preferHSLField, updateEvents, updateFunc);
        eventFunc(fixAlphaField, updateEvents, updateFunc);
        eventFunc(proportionalSaturationField, updateEvents, updateFunc);
        eventFunc(proportionalLightnessField, updateEvents, updateFunc);
        eventFunc(disablecCSSCheckField, updateEvents, updateFunc);
        eventFunc(window, "resize", updateFunc);
        
    },
    
    tiedFieldChanged: function(element) {
        
        var idToFind = 
        element.id === this.hueFieldId ? this.hueNumericFieldId :
        element.id === this.hueNumericFieldId ? this.hueFieldId :
        element.id === this.saturationFieldId ? this.saturationNumericFieldId :
        element.id === this.saturationNumericFieldId ? this.saturationFieldId :
        element.id === this.lightnessFieldId ? this.lightnessNumericFieldId :
        element.id === this.lightnessNumericFieldId ? this.lightnessFieldId :
        element.id === this.alphaFieldId ? this.alphaNumericFieldId :
        element.id === this.alphaNumericFieldId ? this.alphaFieldId :
        element.id === this.contrastFieldId ? this.contrastNumericFieldId :
        element.id === this.contrastNumericFieldId ? this.contrastFieldId :
        null;
        
        var elementToChange = document.getElementById(idToFind);
        if (elementToChange)
            elementToChange.value = element.value;
        
    },

    init: function(options) {
        
        if (this.initialized)
            return;
        this.initialized = true;
        
        var self = this;
        
        this.createRegExp();
        
        this.syncFieldsCallback = this.fieldSync.bind(this);
        
        this.updateCallback = function(e) {
            if (self.updateTimer)
                clearTimeout(self.updateTimer);
            self.updateTimer = setTimeout(function() {
                self.update();
            }, 250);
        };
        
        this.tiedFieldChangeCallback = function(e) {
            self.tiedFieldChanged(Util.getElementFromEvent(e));
        };
        
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
            
        regexp = '{[^{]*:[^:;{}!\\n]*(' + regexp + ')(?=[^}]*})';
        
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

        var hueField = document.getElementById(this.hueFieldId);
        var hueNumericField = document.getElementById(this.hueNumericFieldId);
        var saturationField = document.getElementById(this.saturationFieldId);
        var saturationNumericField = document.getElementById(this.saturationNumericFieldId);
        var lightnessField = document.getElementById(this.lightnessFieldId);
        var lightnessNumericField = document.getElementById(this.lightnessNumericFieldId);
        var alphaField = document.getElementById(this.alphaFieldId);
        var alphaNumericField = document.getElementById(this.alphaNumericFieldId);
        var contrastField = document.getElementById(this.contrastFieldId);
        var contrastNumericField = document.getElementById(this.contrastNumericFieldId);
        var formatField = document.getElementById(this.formatFieldId);
        var postProcessingField = document.getElementById(this.postProcessingFieldId);
        var colorizeField = document.getElementById(this.colorizeFieldId);
        var webSafeField = document.getElementById(this.webSafeFieldId);
        var colorNamesField = document.getElementById(this.colorNamesFieldId);
        var contractedHexCodesField = document.getElementById(this.contractedHexCodesFieldId);
        var aRGBField = document.getElementById(this.aRGBFieldId);
        var preferHSLField = document.getElementById(this.preferHSLFieldId);
        var fixAlphaField = document.getElementById(this.fixAlphaFieldId);
        var proportionalSaturationField = document.getElementById(this.proportionalSaturationFieldId);
        var proportionalLightnessField = document.getElementById(this.proportionalLightnessFieldId);
        var disablecCSSCheckField = document.getElementById(this.disablecCSSCheckFieldId);

        if (hueField) this.hueChange = parseFloat(hueField.value);
        else if (hueNumericField) this.hueChange = parseFloat(hueNumericField.value);
        if (saturationField) this.saturationChange = parseFloat(saturationField.value);
        else if (saturationNumericField) this.saturationChange = parseFloat(saturationNumericField.value);
        if (lightnessField) this.lightnessChange = parseFloat(lightnessField.value);
        else if (lightnessNumericField) this.lightnessChange = parseFloat(lightnessNumericField.value);
        if (alphaField) this.alphaChange = parseFloat(alphaField.value);
        else if (alphaNumericField) this.alphaChange = parseFloat(alphaNumericField.value);
        if (contrastField) this.contrastChange = parseFloat(contrastField.value);
        else if (contrastNumericField) this.contrastChange = parseFloat(contrastNumericField.value);
        
        if (formatField) this.outputFormat = parseInt(formatField.value, 10);
        if (postProcessingField) this.postProcessing = parseInt(postProcessingField.value, 10);
        if (colorizeField) this.colorize = colorizeField.checked ? true : false;
        if (webSafeField) this.useOnlyWebSafeColors = webSafeField.checked ? true : false;
        if (colorNamesField) this.useColorNames = colorNamesField.checked ? true : false;
        if (contractedHexCodesField) this.useContractedHexCodes = contractedHexCodesField.checked ? true : false;
        if (aRGBField) this.useARGB = aRGBField.checked ? true : false;
        if (preferHSLField) this.preferHSL = preferHSLField.checked ? true : false;
        if (fixAlphaField) this.fixAlpha = fixAlphaField.checked ? true : false;
        if (proportionalSaturationField) this.proportionalSaturation = proportionalSaturationField.checked ? true : false;
        if (proportionalLightnessField) this.proportionalLightness = proportionalLightnessField.checked ? true : false;
        if (disablecCSSCheckField) this.disablecCSSCheck = disablecCSSCheckField.checked ? true : false;

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
        
        var shiftColorFunc = function(originalColorString) {
                
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
                contractedHexCodes: self.useContractedHexCodes,
                useARGB: self.useARGB,
                preferHSL: self.preferHSL,
                isAlphaSpecified: ((!self.fixAlpha && self.alphaChange !== 0) || (self.fixAlpha && self.alphaChange !== 1))
            });
            
            if (colorsShown.indexOf(testColorString) == -1) {
                colorsShown.push(testColorString);
                
                if (originalColorsContainer)
                    originalColorsContainer.appendChild(Util.createColorSwatch(originalColorString));
                if (newColorsContainer)
                    newColorsContainer.appendChild(Util.createColorSwatch(newColor));
                
            }
            
            return newColor;
        };
        
        if (this.disablecCSSCheck) {
            
            this.shiftedCssString = cssString.replace(this.colorRegExp, shiftColorFunc);
            
        } else {

            this.shiftedCssString = cssString.replace(this.matchRegExp, function(match) {
                return match.replace(self.colorRegExp, shiftColorFunc);
            });
            
        }
        
        if (this.postProcessing === PostProcessing.Beautify && css_beautify) {
            
            this.shiftedCssString = css_beautify(this.shiftedCssString);
            
        } else if (this.postProcessing === PostProcessing.Minify && CSSOCompressor) {
            
            var compressor = new CSSOCompressor(),
                translator = new CSSOTranslator(),
                minifyFunc = function(cssStr) {
                    return translator.translate(cleanInfo(compressor.compress(srcToCSSP(cssStr, 'stylesheet', true))));
                };
                
            this.shiftedCssString = minifyFunc(this.shiftedCssString);
            
        }
        
        var c, width, node;
        
        if (originalColorsContainer) {
            width = originalColorsContainer.offsetWidth / colorsShown.length;
            for (c in originalColorsContainer.childNodes) {
                node = originalColorsContainer.childNodes[c];
                if (node && node.nodeType === 1)
                    node.style.width = width + "px";
            }
        }
        
        if (newColorsContainer) {
            width = newColorsContainer.offsetWidth / colorsShown.length;
            for (c in newColorsContainer.childNodes) {
                node = newColorsContainer.childNodes[c];
                if (node && node.nodeType === 1)
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