
import React, { Component } from 'react'
import styled from 'emotion/react'

import { colorSwatchHeight, mainSpacing } from '../layout'

const MainContainer = styled.div`
    clear: both;
    margin-bottom: ${mainSpacing}px;
`

const SwatchContainer = styled.div`
    margin-top: 1px;
    height: ${colorSwatchHeight}px;
`

const Swatch = styled.div`
    float: left;
    height: ${colorSwatchHeight}px;
    min-width: 2px;
`

class Swatches extends Component {

    render() {

        var { colors } = this.props
        var width = colors.length === 0 ? 0 : 100 / colors.length

        return (
            <MainContainer>
                <div><strong>Preview</strong></div>
                <SwatchContainer>
                    {colors.map((color, i) => <Swatch key={i} style={{ width: `${width}%`, backgroundColor: color.original }} title={color.original} />)}
                </SwatchContainer>
                <SwatchContainer>
                    {colors.map((color, i) => <Swatch key={i} style={{ width: `${width}%`, backgroundColor: color.new }} title={color.new} />)}
                </SwatchContainer>
            </MainContainer>
        )
    }

}

export default Swatches
