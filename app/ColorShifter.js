
import beautify from 'js-beautify'
import csso from 'csso'
import CssColorNames from 'css-color-names'

import CssColor from './CssColor.js'

function ColorShifter() {

    this.hueChange = 0
    this.saturationChange = 0
    this.lightnessChange = 0
    this.alphaChange = 0
    this.contrastChange = 0
    this.outputFormat = CssColor.Format.Auto
    this.postProcessing = ColorShifter.PostProcessing.None
    this.fixHue = false
    this.useColorNames = false
    this.useContractedHexCodes = true
    this.enableHexWithAlpha = false
    this.preferHSL = false
    this.fixAlpha = false
    this.proportionalSaturation = true
    this.proportionalLightness = true
    this.enableCssCheck = true

    this._createRegExp()

}

ColorShifter.prototype._createRegExp = function() {

    var regexp = ''
    var add = function(s) {
        if (regexp !== '')
            regexp += '|'
        regexp += s
    }

    add('#[\\da-f]{3,8}')
    add('rgba?\\(\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*(,\\s*\\d(.\\d+)?\\s*)?\\)')
    add('hsla?\\(\\s*\\d+(.\\d+)?\\s*,\\s*\\d+(.\\d+)?%?\\s*,\\s*\\d+(.\\d+)?%?\\s*(,\\s*\\d(.\\d+)?\\s*)?\\)')

    for (var n in CssColorNames)
        add('\\b' + n + '\\b')

    this.colorRegExp = new RegExp(regexp, 'igm')

    regexp = '{[^{]*:[^:;{}!\\n]*(' + regexp + ')(?=[^}]*})'

    this.matchRegExp = new RegExp(regexp, 'igm')

}

ColorShifter.prototype.postProcess = function(cssString) {

    if (this.postProcessing === ColorShifter.PostProcessing.Beautify)
        return beautify.css(cssString)

    if (this.postProcessing === ColorShifter.PostProcessing.Minify)
        return csso.minify(cssString).css

    return cssString
}

ColorShifter.prototype.shiftColor = function(originalColorString) {

    var cssColor = new CssColor(originalColorString)

    var testColorString = cssColor.getValue({
        format: CssColor.Format.Rgb,
        isAlphaSpecified: true,
    })

    cssColor.modify({
        hue: this.hueChange,
        saturation: this.saturationChange,
        lightness: this.lightnessChange,
        alpha: this.alphaChange,
        contrast: this.contrastChange,
        fixHue: this.fixHue,
        fixAlpha: this.fixAlpha,
        proportionalSaturation: this.proportionalSaturation,
        proportionalLightness: this.proportionalLightness,
    })

    var newColor = cssColor.getValue({
        format: this.outputFormat,
        colorNames: this.useColorNames,
        contractedHexCodes: this.useContractedHexCodes,
        enableHexWithAlpha: this.enableHexWithAlpha,
        preferHSL: this.preferHSL,
        isAlphaSpecified: ((!this.fixAlpha && this.alphaChange !== 0) || (this.fixAlpha && this.alphaChange !== 1)),
    })

    if (this.colorsFound.indexOf(testColorString) === -1) {
        this.colorsFound.push(testColorString)

        if (typeof this.shiftCallback === 'function')
            this.shiftCallback(newColor, originalColorString)

    }

    return newColor
}

ColorShifter.prototype.shiftCss = function(cssString) {

    var matchRegExp = this.matchRegExp
    var colorRegExp = this.colorRegExp
    var shiftColorFunc = this.shiftColor.bind(this)

    if (this.enableCssCheck) {
        return cssString.replace(matchRegExp, function(match) {
            return match.replace(colorRegExp, shiftColorFunc)
        })
    }

    return cssString.replace(colorRegExp, shiftColorFunc)
}

ColorShifter.prototype.process = function(cssString) {

    if (typeof cssString !== 'string')
        return cssString

    this.colorsFound = []

    var shiftedCssString = this.shiftCss(cssString)

    return this.postProcess(shiftedCssString)
}

ColorShifter.PostProcessing = {
    None: 0,
    Beautify: 1,
    Minify: 2,
}

export default ColorShifter
