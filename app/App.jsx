
import 'normalize.css'
import './App.css'

import React from 'react'

import Header from './components/Header'
import Shifter from './components/Shifter'
import Footer from './components/Footer'

const defaultText = `.class1  { background-color: #ca3c08; }
.class2  { background-color: #d94412; }
.class3  { background-color: #fbca3c; }
.class4  { background-color: #fff9c0; }
.class5  { background-color: #ea9629; }
.class6  { background-color: #21759b; }
.class7  { background-color: #d4d0ba; }
.class8  { background-color: #c3c0ab; }
.class9  { background-color: #7d7b6d; }
.class10 { background-color: #f5f5f5; }
.class11 { background-color: #dddddd; }
.class12 { background-color: #888888; }
.class13 { background-color: #333333; }
.class14 { background-color: #000000; }`

function App() {
    return (
        <div>
            <Header />
            <Shifter text={defaultText} />
            <Footer />
        </div>
    )
}

export default App
