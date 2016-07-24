import React from 'react';
import {Router, Route, IndexRedirect} from 'react-router'

import Master from '../components/Master/index.jsx'
import Risks from './Risks'
import Help from '../components/Help/index.jsx'

const Root = (props) => {
    let {history} = props;

    return (
        <Router history={history}>
            <Route path="/" components={Master}>
                <IndexRedirect to="help" components={Help}/>
                <Route path='help' components={Help}/>
                <Route path='risks' components={Risks}/>
            </Route>
        </Router>
    );
};

export default Root