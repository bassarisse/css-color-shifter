
import React, { Component } from 'react'
import styled from 'emotion/react'

import { sliderInputWidth, inputSpacing } from '../layout'

const Input = styled.input`
    width: ${sliderInputWidth}px;
    vertical-align: middle;
    margin-left: ${inputSpacing}px;
`

const Slider = styled.input`
    width: calc(100% - ${sliderInputWidth}px * 2 - ${inputSpacing}px * 2);
    vertical-align: middle;
`

class SliderControl extends Component {

    change = (e) => {

        const {
            name,
            onChange
        } = this.props

        if (typeof onChange === 'function')
            onChange(name, parseFloat(e.target.value))

    }

    reset = () => {

        const {
            name,
            defaultValue,
            onChange
        } = this.props

        if (typeof onChange === 'function')
            onChange(name, parseFloat(defaultValue))

    }

    render() {

        const {
            className,
            value,
            min,
            max,
            sliderStep = 0.01,
            fieldStep = 1,
        } = this.props

        return (
            <span className={className}>
                <Slider type='range' value={value} min={min} max={max} step={sliderStep} onChange={this.change} />
                <Input type='number' value={value} min={min} max={max} step={fieldStep} onChange={this.change} />
                <Input type='button' value='Reset' onClick={this.reset} />
            </span>
        )
    }

}

export default SliderControl
