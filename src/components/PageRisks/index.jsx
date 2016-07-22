import React from 'react';
import Paper from 'material-ui/Paper';

import './index.scss';

const style = {
    height: '100%',
    width: '100%',
    // margin: 20,
    textAlign: 'center',
    display: 'inline-block'
};

const PageRisks = () => (
    <div className="risks wrapper">
        <section>
            <Paper style={style} zDepth={1}/>
        </section>
        <section>
            <Paper style={style} zDepth={1}/>
        </section>
        <section>
            <Paper style={style} zDepth={1}/>
        </section>
    </div>
);

// <Paper style={style1} zDepth={1}/>
// <Paper style={style2} zDepth={1}/>
//     <Paper style={style3} zDepth={1}/>

export default PageRisks;