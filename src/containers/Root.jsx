import React from 'react';
import {Router, Route, IndexRedirect} from 'react-router'

import Master from '../components/Master/index.jsx'
import Test from '../components/PageRisks/index.jsx'

const Root = (props) => {
    let {history} = props;

    return (
        <Router history={history}>
            <Route path="/" components={Master}>
                <IndexRedirect to="map" components={Test}/>
                <Route path='map' components={Test}/>
            </Route>
        </Router>
    );
};

export default Root