
import React, { Component } from 'react'
import { css } from 'emotion'
import styled from 'emotion/react'

import ColorShifter from '../lib/ColorShifter'
import CssColor from '../lib/CssColor'

import Swatches from './Swatches'
import UnstyledSliderControl from './SliderControl'
import MirrorTextAreas from './MirrorTextAreas'

import { sliderNameWidth, sliderInputWidth, sliderOptionWidth, inputSpacing } from '../layout'

const OptionBoxBase = css`
    background-color: #F0F0F0;
    border: 2px solid #fff;
    float: left;
    padding: 8px 4px;
    white-space: nowrap;
    min-width: calc(100% / 3);
`

const OptionBox = styled.div`
    composes: ${OptionBoxBase};

    @media (max-width: 500px) {
        min-width: 100%;
    }
`

const BigOptionBox = styled.div`
    composes: ${OptionBoxBase};
    min-width: calc((100% / 3) * 2);

    @media (max-width: 1000px) {
        min-width: 100%;
    }
`

const OptionLineContainer = styled.div`
    & + & {
        margin-top: ${inputSpacing}px;
    }
`

const SliderName = styled.span`
    display: inline-block;
    width: ${sliderNameWidth}px;
    text-align: right;
`

const SliderOptionLabel = styled.label`
    display: inline-block;
    width: ${sliderOptionWidth}px;
`

const SliderControl = styled(UnstyledSliderControl)`
    display: inline-block;
    width: calc(100% - ${sliderNameWidth + sliderOptionWidth}px);
    padding: 0 ${inputSpacing}px;
`

const ResetAllButton = styled.input`
    width: ${sliderInputWidth}px;
    vertical-align: middle;
    margin-left: calc(100% - ${sliderOptionWidth + sliderInputWidth + inputSpacing}px);
`

function OptionLine(props) {

    const {
        children,
        title,
        ...otherProps,
    } = props

    return (
        <OptionLineContainer {...otherProps}>
            <label title={title}>{children}</label>
        </OptionLineContainer>
    )
}

class Shifter extends Component {

    state = {
        text: this.props.text || '',
        options: {},
    }

    changeText = (e) => {
        this.setState({
            text: e.target.value,
        })
    }

    changeOptionField = (e) => {
        const { target } = e
        const value = target.type === 'checkbox' ? target.checked : parseInt(target.value, 10)

        this.changeOption(target.name, value)
    }

    changeOption = (name, value) => {
        this.setState(state => ({
            options: Object.assign({}, state.options, { [name]: value }),
        }))
    }

    resetAllChanges = () => {
        this.setState(state => {
            var { options } = state
            delete options.hueChange
            delete options.saturationChange
            delete options.lightnessChange
            delete options.alphaChange
            delete options.contrastChange
            return {
                options: Object.assign({}, options)
            }
        })
    }

    renderCheckbox(name, defaultValue = false) {

        var value = this.state.options[name]
        if (typeof value === 'undefined')
            value = defaultValue

        return <input type='checkbox' name={name} checked={!!value} onChange={this.changeOptionField} />
    }

    renderSliderControl(name, min, max, otherProps = {}) {

        const {
            defaultValue = 0,
            ...restProps,
        } = otherProps

        var value = this.state.options[name]
        if (typeof value === 'undefined')
            value = defaultValue

        return (
            <SliderControl
                onChange={this.changeOption}
                name={name}
                defaultValue={defaultValue}
                min={min}
                max={max}
                value={value}
                {...restProps}
            />
        )
    }

    render() {

        const {
            text,
            options,
        } = this.state

        var shouldSyncTextAreasScroll = typeof options.postProcessing === 'undefined' || options.postProcessing === ColorShifter.PostProcessing.None

        var colorShifter = new ColorShifter()
        colorShifter.setOptions(options)
        var shiftedCssString = colorShifter.process(text)

        return (
            <div>

                <MirrorTextAreas value={text} mirrorValue={shiftedCssString} onChange={this.changeText} shouldSyncScroll={shouldSyncTextAreasScroll} />

                <Swatches colors={colorShifter.colors} />

                <BigOptionBox>
                    <OptionLineContainer>
                        <SliderName>Hue</SliderName>
                        {this.renderSliderControl('hueChange', 0, 360)}
                        <SliderOptionLabel title='All colors will use the informed hue value'>
                            {this.renderCheckbox('fixHue')} Fixed
                        </SliderOptionLabel>
                    </OptionLineContainer>
                    <OptionLineContainer>
                        <SliderName>Saturation</SliderName>
                        {this.renderSliderControl('saturationChange', -100, 100)}
                        <SliderOptionLabel title='Modifies the saturation of all colors by the same relative value towards the minimum or maximum'>
                            {this.renderCheckbox('proportionalSaturation', true)} Proportional
                        </SliderOptionLabel>
                    </OptionLineContainer>
                    <OptionLineContainer>
                        <SliderName>Lightness</SliderName>
                        {this.renderSliderControl('lightnessChange', -100, 100)}
                        <SliderOptionLabel title='Modifies the lightness of all colors by the same relative value towards the minimum or maximum'>
                            {this.renderCheckbox('proportionalLightness', true)} Proportional
                        </SliderOptionLabel>
                    </OptionLineContainer>
                    <OptionLineContainer>
                        <SliderName>Alpha</SliderName>
                        {this.renderSliderControl('alphaChange', options.fixAlpha ? 0 : -1, 1, { sliderStep: 0.0001, fieldStep: 0.1 })}
                        <SliderOptionLabel title='Makes all colors use the specified alpha value'>
                            {this.renderCheckbox('fixAlpha')} Fixed
                        </SliderOptionLabel>
                    </OptionLineContainer>
                    <OptionLineContainer>
                        <SliderName>Constrast</SliderName>
                        {this.renderSliderControl('contrastChange', -255, 255, { sliderStep: 0.1 })}
                    </OptionLineContainer>
                    <OptionLineContainer>
                        <ResetAllButton type='button' value='Reset all' onClick={this.resetAllChanges} />
                    </OptionLineContainer>
                </BigOptionBox>

                <OptionBox>
                    <OptionLine>
                        Output color format<br />
                        <select name='outputFormat' value={options.outputFormat} onChange={this.changeOptionField}>
                            <option value={CssColor.Format.Auto}>Same as source</option>
                            <option value={CssColor.Format.Hex}>HEX</option>
                            <option value={CssColor.Format.Rgb}>RGB</option>
                            <option value={CssColor.Format.Hsl}>HSL</option>
                        </select>
                    </OptionLine>
                    <OptionLine>
                        Post processing<br />
                        <select name='postProcessing' value={options.postProcessing} onChange={this.changeOptionField}>
                            <option value={ColorShifter.PostProcessing.None}>None</option>
                            <option value={ColorShifter.PostProcessing.Beautify}>Beautify</option>
                            <option value={ColorShifter.PostProcessing.Minify}>Minify</option>
                        </select>
                    </OptionLine>
                </OptionBox>

                <OptionBox>
                    <OptionLine title='Only when possible'>
                        {this.renderCheckbox('useContractedHexCodes', true)} Use contracted hex codes (e.g. #f00)
                    </OptionLine>
                    <OptionLine title='Only when possible'>
                        {this.renderCheckbox('useColorNames')} Use color names (e.g. red, white)
                    </OptionLine>
                    <OptionLine title='Only when possible, low browser support'>
                        {this.renderCheckbox('enableHexWithAlpha')} Enable Hex with alpha channel (e.g. #40506070)
                    </OptionLine>
                    <OptionLine title='When modifying alpha, HEX format is changed to RGB by default, but you can choose HSL here'>
                        {this.renderCheckbox('preferHSL')} Prefer HSL over RGB format
                    </OptionLine>
                    <OptionLine title='Disable this if you just want to throw some colors and modify them, but when pasting a stylesheet, enabling is recommended'>
                        {this.renderCheckbox('enableCssCheck', true)} Enable basic CSS syntax detection
                    </OptionLine>
                </OptionBox>

            </div>
        )
    }

}

export default Shifter
