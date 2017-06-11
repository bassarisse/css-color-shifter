
function ColorShifterUI(options) {

    options = options || {};

    this.sourceFieldId = options.sourceFieldId || null;
    this.targetFieldId = options.targetFieldId || null;
    this.hueFieldId = options.hueFieldId || null;
    this.hueNumericFieldId = options.hueNumericFieldId || null;
    this.hueResetButtonId = options.hueResetButtonId || null;
    this.saturationFieldId = options.saturationFieldId || null;
    this.saturationNumericFieldId = options.saturationNumericFieldId || null;
    this.saturationResetButtonId = options.saturationResetButtonId || null;
    this.lightnessFieldId = options.lightnessFieldId || null;
    this.lightnessNumericFieldId = options.lightnessNumericFieldId || null;
    this.lightnessResetButtonId = options.lightnessResetButtonId || null;
    this.alphaFieldId = options.alphaFieldId || null;
    this.alphaNumericFieldId = options.alphaNumericFieldId || null;
    this.alphaResetButtonId = options.alphaResetButtonId || null;
    this.contrastFieldId = options.contrastFieldId || null;
    this.contrastNumericFieldId = options.contrastNumericFieldId || null;
    this.contrastResetButtonId = options.contrastResetButtonId || null;
    this.allResetButtonId = options.allResetButtonId || null;
    this.formatFieldId = options.formatFieldId || null;
    this.postProcessingFieldId = options.postProcessingFieldId || null;
    this.colorizeFieldId = options.colorizeFieldId || null;
    this.webSafeFieldId = options.webSafeFieldId || null;
    this.colorNamesFieldId = options.colorNamesFieldId || null;
    this.contractedHexCodesFieldId = options.contractedHexCodesFieldId || null;
    this.hexWithAlphaFieldId = options.hexWithAlphaFieldId || null;
    this.preferHSLFieldId = options.preferHSLFieldId || null;
    this.fixAlphaFieldId = options.fixAlphaFieldId || null;
    this.proportionalSaturationFieldId = options.proportionalSaturationFieldId || null;
    this.proportionalLightnessFieldId = options.proportionalLightnessFieldId || null;
    this.enableCssCheckFieldId = options.enableCssCheckFieldId || null;
    this.originalColorsContainerId = options.originalColorsContainerId || null;
    this.newColorsContainerId = options.newColorsContainerId || null;

    this.sourceCssString = "";
    this.shiftedCssString = "";

    this.hueChange = 0;
    this.saturationChange = 0;
    this.lightnessChange = 0;
    this.alphaChange = 0;
    this.contrastChange = 0;
    this.outputFormat = CssColor.Format.Unknown;
    this.postProcessing = ColorShifter.PostProcessing.None;
    this.colorize = false;
    this.useOnlyWebSafeColors = false;
    this.useColorNames = false;
    this.useContractedHexCodes = false;
    this.enableHexWithAlpha = false;
    this.preferHSL = false;
    this.fixAlpha = false;
    this.proportionalSaturation = false;
    this.proportionalLightness = false;
    this.enableCssCheck = false;

    var self = this;

    this.scrollSyncFieldsCallback = this.fieldScrollSync.bind(this);
    this.sizeSyncFieldsCallback = this.fieldSizeSync.bind(this);

    this.updateCallback = function(e) {
        clearTimeout(self.updateTimer);
        self.updateTimer = setTimeout(function() {
            self.update();
        }, 100);
    };

    this.syncedFieldChangeCallback = function(e) {
        self.syncedFieldChanged(Util.getElementFromEvent(e));
    };

    this.resetCallback = function(e) {
        self.reset(Util.getElementFromEvent(e));
    };

    this._setupFields(true);

}

ColorShifterUI.prototype._setupFields = function(enable) {

    if (typeof enable === "undefined")
        return;

    var eventFunc = enable ? Util.addEvent : Util.removeEvent;
    var updateEvents = "change input";
    var syncFieldsEvents = "change input";

    var sourceField = document.getElementById(this.sourceFieldId);
    var targetField = document.getElementById(this.targetFieldId);
    var hueField = document.getElementById(this.hueFieldId);
    var hueNumericField = document.getElementById(this.hueNumericFieldId);
    var hueResetButton = document.getElementById(this.hueResetButtonId);
    var saturationField = document.getElementById(this.saturationFieldId);
    var saturationNumericField = document.getElementById(this.saturationNumericFieldId);
    var saturationResetButton = document.getElementById(this.saturationResetButtonId);
    var lightnessField = document.getElementById(this.lightnessFieldId);
    var lightnessNumericField = document.getElementById(this.lightnessNumericFieldId);
    var lightnessResetButton = document.getElementById(this.lightnessResetButtonId);
    var alphaField = document.getElementById(this.alphaFieldId);
    var alphaNumericField = document.getElementById(this.alphaNumericFieldId);
    var alphaResetButton = document.getElementById(this.alphaResetButtonId);
    var contrastField = document.getElementById(this.contrastFieldId);
    var contrastNumericField = document.getElementById(this.contrastNumericFieldId);
    var contrastResetButton = document.getElementById(this.contrastResetButtonId);
    var allResetButton = document.getElementById(this.allResetButtonId);
    var formatField = document.getElementById(this.formatFieldId);
    var postProcessingField = document.getElementById(this.postProcessingFieldId);
    var colorizeField = document.getElementById(this.colorizeFieldId);
    var webSafeField = document.getElementById(this.webSafeFieldId);
    var colorNamesField = document.getElementById(this.colorNamesFieldId);
    var contractedHexCodesField = document.getElementById(this.contractedHexCodesFieldId);
    var hexWithAlphaField = document.getElementById(this.hexWithAlphaFieldId);
    var preferHSLField = document.getElementById(this.preferHSLFieldId);
    var fixAlphaField = document.getElementById(this.fixAlphaFieldId);
    var proportionalSaturationField = document.getElementById(this.proportionalSaturationFieldId);
    var proportionalLightnessField = document.getElementById(this.proportionalLightnessFieldId);
    var enableCssCheckField = document.getElementById(this.enableCssCheckFieldId);

    if (sourceField) {
        eventFunc(sourceField, "change", this.updateCallback);
        eventFunc(sourceField, "keyup", this.updateCallback);
        if (enable && sourceField.value !== "")
            this.update(sourceField.value);
    }

    if (targetField) {
        targetField.readOnly = enable;
    }

    if (sourceField && targetField) {
        eventFunc(sourceField, "scroll resize", this.scrollSyncFieldsCallback);
        eventFunc(targetField, "scroll resize", this.scrollSyncFieldsCallback);
        eventFunc(sourceField, "mouseout mousemove", this.sizeSyncFieldsCallback);
        eventFunc(document.body, "mouseup mouseout", this.sizeSyncFieldsCallback);
    }

    if (hueField && hueNumericField) {
        eventFunc(hueField, syncFieldsEvents, this.syncedFieldChangeCallback);
        eventFunc(hueNumericField, syncFieldsEvents, this.syncedFieldChangeCallback);
    }

    if (saturationField && saturationNumericField) {
        eventFunc(saturationField, syncFieldsEvents, this.syncedFieldChangeCallback);
        eventFunc(saturationNumericField, syncFieldsEvents, this.syncedFieldChangeCallback);
    }

    if (lightnessField && lightnessNumericField) {
        eventFunc(lightnessField, syncFieldsEvents, this.syncedFieldChangeCallback);
        eventFunc(lightnessNumericField, syncFieldsEvents, this.syncedFieldChangeCallback);
    }

    if (alphaField && alphaNumericField) {
        eventFunc(alphaField, syncFieldsEvents, this.syncedFieldChangeCallback);
        eventFunc(alphaNumericField, syncFieldsEvents, this.syncedFieldChangeCallback);
    }

    if (contrastField && contrastNumericField) {
        eventFunc(contrastField, syncFieldsEvents, this.syncedFieldChangeCallback);
        eventFunc(contrastNumericField, syncFieldsEvents, this.syncedFieldChangeCallback);
    }

    eventFunc(hueField, updateEvents, this.updateCallback);
    eventFunc(hueNumericField, updateEvents, this.updateCallback);
    eventFunc(saturationField, updateEvents, this.updateCallback);
    eventFunc(saturationNumericField, updateEvents, this.updateCallback);
    eventFunc(lightnessField, updateEvents, this.updateCallback);
    eventFunc(lightnessNumericField, updateEvents, this.updateCallback);
    eventFunc(alphaField, updateEvents, this.updateCallback);
    eventFunc(alphaNumericField, updateEvents, this.updateCallback);
    eventFunc(contrastField, updateEvents, this.updateCallback);
    eventFunc(contrastNumericField, updateEvents, this.updateCallback);
    eventFunc(formatField, updateEvents, this.updateCallback);
    eventFunc(postProcessingField, updateEvents, this.updateCallback);
    eventFunc(colorizeField, updateEvents, this.updateCallback);
    eventFunc(webSafeField, updateEvents, this.updateCallback);
    eventFunc(colorNamesField, updateEvents, this.updateCallback);
    eventFunc(contractedHexCodesField, updateEvents, this.updateCallback);
    eventFunc(hexWithAlphaField, updateEvents, this.updateCallback);
    eventFunc(preferHSLField, updateEvents, this.updateCallback);
    eventFunc(fixAlphaField, updateEvents, this.updateCallback);
    eventFunc(proportionalSaturationField, updateEvents, this.updateCallback);
    eventFunc(proportionalLightnessField, updateEvents, this.updateCallback);
    eventFunc(enableCssCheckField, updateEvents, this.updateCallback);
    eventFunc(window, "resize", this.updateCallback);

    eventFunc(hueNumericField, "keypress", this.keypressField);
    eventFunc(saturationNumericField, "keypress", this.keypressField);
    eventFunc(lightnessNumericField, "keypress", this.keypressField);
    eventFunc(alphaNumericField, "keypress", this.keypressField);
    eventFunc(contrastNumericField, "keypress", this.keypressField);

    eventFunc(hueResetButton, "click", this.resetCallback);
    eventFunc(saturationResetButton, "click", this.resetCallback);
    eventFunc(lightnessResetButton, "click", this.resetCallback);
    eventFunc(alphaResetButton, "click", this.resetCallback);
    eventFunc(contrastResetButton, "click", this.resetCallback);
    eventFunc(allResetButton, "click", this.resetCallback);

};

ColorShifterUI.prototype.syncedFieldChanged = function(element) {

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

    this.validateFieldValue(element);

    var elementToChange = document.getElementById(idToFind);
    if (elementToChange)
        elementToChange.value = element.value;

};

ColorShifterUI.prototype.reset = function(element) {

    var elementId = element.id;
    var resetAll = elementId === this.allResetButtonId;

    if (resetAll || elementId === this.hueResetButtonId) {
        this.resetField(this.hueFieldId);
        this.resetField(this.hueNumericFieldId);
    }

    if (resetAll || elementId === this.saturationResetButtonId) {
        this.resetField(this.saturationFieldId);
        this.resetField(this.saturationNumericFieldId);
    }

    if (resetAll || elementId === this.lightnessResetButtonId) {
        this.resetField(this.lightnessFieldId);
        this.resetField(this.lightnessNumericFieldId);
    }

    if (resetAll || elementId === this.alphaResetButtonId) {
        this.resetField(this.alphaFieldId);
        this.resetField(this.alphaNumericFieldId);
    }

    if (resetAll || elementId === this.contrastResetButtonId) {
        this.resetField(this.contrastFieldId);
        this.resetField(this.contrastNumericFieldId);
    }

    this.update();

};

ColorShifterUI.prototype.resetField = function(fieldId) {

    var element = document.getElementById(fieldId);
    if (element)
        element.value = 0;

};

ColorShifterUI.prototype.enableFields = function() {
    this._setupFields(true);
};

ColorShifterUI.prototype.disableFields = function() {
    this._setupFields(false);
};

ColorShifterUI.prototype.fieldScrollSync = function(aEvent) {
    aEvent || (aEvent = window.event);

    var changedField = aEvent.srcElement || aEvent.target;
    var changedFieldId = changedField.id;

    var syncFieldId =
    changedFieldId === this.sourceFieldId ? this.targetFieldId :
    changedFieldId === this.targetFieldId ? this.sourceFieldId :
    null;

    var fieldToSync = document.getElementById(syncFieldId);

    if (fieldToSync && changedField && this.postProcessing === ColorShifter.PostProcessing.None)
        fieldToSync.scrollTop = changedField.scrollTop;

};

ColorShifterUI.prototype.fieldSizeSync = function(aEvent) {

    var changedFieldId = this.sourceFieldId;

    var syncFieldId =
    changedFieldId === this.sourceFieldId ? this.targetFieldId :
    changedFieldId === this.targetFieldId ? this.sourceFieldId :
    null;

    var changedField = document.getElementById(changedFieldId);
    var fieldToSync = document.getElementById(syncFieldId);

    if (fieldToSync && changedField && changedField.style.height)
        fieldToSync.style.height = changedField.style.height;

};

ColorShifterUI.prototype.keypressField = function(aEvent) {
    aEvent || (aEvent = window.event);

    var charCode = aEvent.which || aEvent.keyCode || aEvent.charCode;
    var changedField = aEvent.srcElement || aEvent.target;
    var validated = true;
    var inputStr = String.fromCharCode(charCode);

    if (/[a-z ]/igm.test(inputStr))
        validated = false;
    if (inputStr === "." && changedField.value.toString().indexOf(".") !== -1)
        validated = false;
    if (inputStr === "," && changedField.value.toString().indexOf(",") !== -1)
        validated = false;

    if (!validated && aEvent.preventDefault) {
        aEvent.preventDefault();
        return false;
    }

    return true;
};

ColorShifterUI.prototype.refreshFromFields = function() {

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
    var hexWithAlphaField = document.getElementById(this.hexWithAlphaFieldId);
    var preferHSLField = document.getElementById(this.preferHSLFieldId);
    var fixAlphaField = document.getElementById(this.fixAlphaFieldId);
    var proportionalSaturationField = document.getElementById(this.proportionalSaturationFieldId);
    var proportionalLightnessField = document.getElementById(this.proportionalLightnessFieldId);
    var enableCssCheckField = document.getElementById(this.enableCssCheckFieldId);

    this.validateFieldValue(hueNumericField);
    this.validateFieldValue(saturationNumericField);
    this.validateFieldValue(lightnessNumericField);
    this.validateFieldValue(alphaNumericField);
    this.validateFieldValue(contrastNumericField);

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
    if (hexWithAlphaField) this.enableHexWithAlpha = hexWithAlphaField.checked ? true : false;
    if (preferHSLField) this.preferHSL = preferHSLField.checked ? true : false;
    if (fixAlphaField) this.fixAlpha = fixAlphaField.checked ? true : false;
    if (proportionalSaturationField) this.proportionalSaturation = proportionalSaturationField.checked ? true : false;
    if (proportionalLightnessField) this.proportionalLightness = proportionalLightnessField.checked ? true : false;
    if (enableCssCheckField) this.enableCssCheck = enableCssCheckField.checked ? true : false;

    if (isNaN(this.hueChange)) this.hueChange = 0;
    if (isNaN(this.saturationChange)) this.saturationChange = 0;
    if (isNaN(this.lightnessChange)) this.lightnessChange = 0;
    if (isNaN(this.alphaChange)) this.alphaChange = 0;
    if (isNaN(this.contrastChange)) this.contrastChange = 0;

};

ColorShifterUI.prototype.validateFieldValue = function(field) {

    if (!field)
        return;

    var validationRegExp = /[a-z ]/igm;

    var valueStr = field.value.toString();
    if (validationRegExp.test(valueStr))
        field.value = valueStr.replace(validationRegExp, "");

};

ColorShifterUI.prototype.update = function(cssString) {

    if (typeof cssString !== "string") {
        var sourceField = document.getElementById(this.sourceFieldId);
        if (sourceField)
            cssString = sourceField.value;

        if (typeof cssString !== "string")
            return;
    }

    this.refreshFromFields();

    var originalColorsContainer = document.getElementById(this.originalColorsContainerId);
    var newColorsContainer = document.getElementById(this.newColorsContainerId);

    this.clearColorSwatches(originalColorsContainer);
    this.clearColorSwatches(newColorsContainer);

    var colorShifter = new ColorShifter();

    colorShifter.hueChange = this.hueChange;
    colorShifter.saturationChange = this.saturationChange;
    colorShifter.lightnessChange = this.lightnessChange;
    colorShifter.alphaChange = this.alphaChange;
    colorShifter.contrastChange = this.contrastChange;
    colorShifter.outputFormat = this.outputFormat;
    colorShifter.postProcessing = this.postProcessing;
    colorShifter.colorize = this.colorize;
    colorShifter.useOnlyWebSafeColors = this.useOnlyWebSafeColors;
    colorShifter.useColorNames = this.useColorNames;
    colorShifter.useContractedHexCodes = this.useContractedHexCodes;
    colorShifter.enableHexWithAlpha = this.enableHexWithAlpha;
    colorShifter.preferHSL = this.preferHSL;
    colorShifter.fixAlpha = this.fixAlpha;
    colorShifter.proportionalSaturation = this.proportionalSaturation;
    colorShifter.proportionalLightness = this.proportionalLightness;
    colorShifter.enableCssCheck = this.enableCssCheck;

    colorShifter.shiftCallback = (function(newColor, originalColor) {
        this.addColorSwatch(originalColorsContainer, originalColor);
        this.addColorSwatch(newColorsContainer, newColor);
    }).bind(this);

    this.sourceCssString = cssString;
    this.shiftedCssString = colorShifter.process(cssString);

    this.setupColorSwatches(originalColorsContainer, colorShifter.colorsFound.length);
    this.setupColorSwatches(newColorsContainer, colorShifter.colorsFound.length);
    this.fillTargetField();

};

ColorShifterUI.prototype.clearColorSwatches = function(container) {
    if (!container)
        return;
    while (container.hasChildNodes())
        container.removeChild(container.lastChild);
};

ColorShifterUI.prototype.addColorSwatch = function(container, color) {
    if (!container)
        return;
    container.appendChild(Util.createColorSwatch(color));
};

ColorShifterUI.prototype.setupColorSwatches = function(container, count) {
    if (!container)
        return;

    var width = (container.offsetWidth - 4) / count;
    for (var c in container.childNodes) {
        var node = container.childNodes[c];
        if (node && node.nodeType === 1)
            node.style.width = width + "px";
    }

};

ColorShifterUI.prototype.fillTargetField = function() {

    var targetField = document.getElementById(this.targetFieldId);

    if (!targetField)
        return;

    targetField.value = this.shiftedCssString;

};
