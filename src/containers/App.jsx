import React from 'react';

const App = (props) => {
    return (
        <div className="wrapper">
            {props.children}
        </div>
    );
};

export default App