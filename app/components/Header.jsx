
import React from 'react'
import styled from 'emotion/react'

import { mainSpacing } from '../layout'

const MainContainer = styled.div`
    margin-bottom: ${mainSpacing}px;
`

const Title = styled.h1`
    padding: 4pt;
    margin: 0;
    background-color: #333;
    color: white;
`

const Version = styled.small`
    font-size: 0.5em;
`

const Credit = styled.h4`
    display: block;
    font-weight: normal;
    font-size: 9pt;
    margin: 0;
    text-align: right;
    padding-right: 4pt;
`

function Header() {
    return (
        <MainContainer>
            <Title>CSS Color Shifter <Version>v{APP_VERSION}</Version></Title>
            <Credit>by <a href='http://bassarisse.com' target='_blank'>Bruno Assarisse</a></Credit>
        </MainContainer>
    )
}

export default Header
