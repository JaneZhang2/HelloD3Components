import React from 'react';
import {Router, Route, IndexRedirect} from 'react-router'

import App from './App.jsx'
import Test from './Test.jsx'

const Root = (props) => {
    let {history} = props;

    return (
        <Router history={history}>
            <Route path="/" components={App}>
                <IndexRedirect to="map" components={Test}/>
                <Route path='map' components={Test}/>
            </Route>
        </Router>
    );
};

export default Root