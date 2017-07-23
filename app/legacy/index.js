
import './css-color-shifter.css'

import ColorShifterUI from './ColorShifterUI.js'

document.getElementById('color-shifter-container').style.visibility = ''

new ColorShifterUI({
    sourceFieldId: 'source',
    targetFieldId: 'target',
    hueFieldId: 'hueChange',
    hueNumericFieldId: 'hueChangeNumeric',
    hueResetButtonId: 'hueReset',
    saturationFieldId: 'saturationChange',
    saturationNumericFieldId: 'saturationChangeNumeric',
    saturationResetButtonId: 'saturationReset',
    lightnessFieldId: 'lightnessChange',
    lightnessNumericFieldId: 'lightnessChangeNumeric',
    lightnessResetButtonId: 'lightnessReset',
    alphaFieldId: 'alphaChange',
    alphaNumericFieldId: 'alphaChangeNumeric',
    alphaResetButtonId: 'alphaReset',
    contrastFieldId: 'contrastChange',
    contrastNumericFieldId: 'contrastChangeNumeric',
    contrastResetButtonId: 'contrastReset',
    allResetButtonId: 'allReset',
    formatFieldId: 'colorformat',
    postProcessingFieldId: 'postprocessing',
    fixHueFieldId: 'fixHue',
    colorNamesFieldId: 'colorNames',
    contractedHexCodesFieldId: 'contractedhexcodes',
    hexWithAlphaFieldId: 'hexwithalpha',
    preferHSLFieldId: 'preferhsl',
    fixAlphaFieldId: 'fixAlpha',
    proportionalSaturationFieldId: 'proportionalsaturation',
    proportionalLightnessFieldId: 'proportionallightness',
    enableCssCheckFieldId: 'enablecsssyntax',
    originalColorsContainerId: 'originalColors',
    newColorsContainerId: 'newColors'
})
