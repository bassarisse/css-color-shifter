
import React from 'react'
import styled from 'emotion/react'

const Info = styled.div`
    padding-top: 1pt;
    margin-top: 10px;
    clear: both;
`

function Footer() {
    return (
        <Info>
            <h2>About</h2>
            <p>
                For many times I wanted to consistently change the colors of stylesheets, but it always ended up being a tedious and large amount of work.
                So, I decided to build a tool that would do that, and here it is!
                I think it could be useful for someone out there on this little planet of ours.
            </p>
            <p>
                Feel free to share your thoughts and inform me about some bug that you may stumble upon. You can check out <a href='http://bassarisse.com' target='_blank'>my website</a> or talk to me on <a href='http://twitter.com/bassarisse' target='_blank'>Twitter</a>.
            </p>
            <p>
                <strong>Requirements:</strong><br />
                Any browser should work fairly well, but please update yours to the latest version.
            </p>
            <p>
                <strong>Github:</strong><br />
                <a href='https://github.com/bassarisse/css-color-shifter' target='_blank'>https://github.com/bassarisse/css-color-shifter</a>
            </p>
        </Info>
    )
}

export default Footer
