import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import Root from './containers/Root.jsx'
import {hashHistory} from 'react-router'

render(
    <Root history={hashHistory}/>,
    document.getElementById('root')
);