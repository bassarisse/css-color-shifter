
import React, { PureComponent } from 'react'
import { css } from 'emotion'
import styled from 'emotion/react'

import { mainSpacing } from '../layout'

const MainContainer = styled.div`
    margin-bottom: ${mainSpacing}px;

    &::after {
        content: "";
        display: block;
        clear: both;
    }
`

const FieldContainer = styled.div`
    width: 50%;
    float: left;

    &:last-child {
        width: calc(50% + 1px);
        margin-left: -1px;
    }
`

const TextareaStyle = css`
    width: 100%;
    padding: 4px;
    min-height: 80px;
    line-height: 1.5;
    font-size: 11px;
    font-family: "Lucida Console", Monaco, "Courier New", Courier, monospace;
    border: 1px solid #999;
    resize: none;
`

const MirrorTextareaStyle = css`
    composes: ${TextareaStyle};
    resize: vertical;
`

class MirrorTextAreas extends PureComponent {

    state = {
        height: 80,
    }

    componentDidMount() {

        document.body.addEventListener('mouseup', this.handleResize)
        document.body.addEventListener('mousemove', this.handleResize)
        document.body.addEventListener('mouseout', this.handleResize)

        this.valueField.addEventListener('scroll', this.handleValueFieldScroll)
        this.mirrorValueField.addEventListener('scroll', this.handleMirrorValueFieldScroll)

    }

    componentWillUnmount() {

        document.body.removeEventListener('mouseup', this.handleResize)
        document.body.removeEventListener('mousemove', this.handleResize)
        document.body.removeEventListener('mouseout', this.handleResize)

        this.valueField.removeEventListener('scroll', this.handleValueFieldScroll)
        this.mirrorValueField.removeEventListener('scroll', this.handleMirrorValueFieldScroll)

    }

    handleResize = () => {
        this.updateHeight()
    }

    handleValueFieldScroll = () => {
        if (this.props.shouldSyncScroll)
            this.mirrorValueField.scrollTop = this.valueField.scrollTop
    }

    handleMirrorValueFieldScroll = () => {
        if (this.props.shouldSyncScroll)
            this.valueField.scrollTop = this.mirrorValueField.scrollTop
    }

    updateHeight() {
        if (this.mirrorValueField.style.height === this.valueField.style.height)
            return
        this.setState({
            height: parseFloat((this.mirrorValueField.style.height || '').replace('px', ''))
        })
    }

    receiveValueField = (el) => {
        this.valueField = el
    }

    receiveMirrorValueField = (el) => {
        this.mirrorValueField = el
    }

    componentDidUpdate

    render() {

        const {
            value,
            mirrorValue,
            onChange,
        } = this.props

        const {
            height,
        } = this.state

        const fieldStyle = {
            height: `${height}px`,
        }

        return (
            <MainContainer>
                <FieldContainer>
                    <label>
                        <strong>Source</strong> (paste your CSS here)
                        <textarea
                            className={TextareaStyle}
                            style={fieldStyle}
                            value={value}
                            ref={this.receiveValueField}
                            onChange={onChange}
                        />
                    </label>
                </FieldContainer>
                <FieldContainer>
                    <label>
                        <strong>Output</strong> (this is the modified CSS)
                        <textarea
                            className={MirrorTextareaStyle}
                            style={fieldStyle}
                            value={mirrorValue}
                            ref={this.receiveMirrorValueField}
                            readOnly
                        />
                    </label>
                </FieldContainer>
            </MainContainer>
        )
    }

}

export default MirrorTextAreas
