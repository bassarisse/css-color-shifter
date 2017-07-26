
import React, { Component } from 'react'

import ColorShifter from '../lib/ColorShifter'

import MirrorTextAreas from './MirrorTextAreas'
import Swatches from './Swatches'
import Options from './Options'

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

                <Options onChange={this.changeOption} onResetAll={this.resetAllChanges} {...options} />

            </div>
        )
    }

}

export default Shifter
