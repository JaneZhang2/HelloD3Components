import React from 'react';

export default class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            radiusDomain: [1, 100],
            fillDomain: [1, 100],
            x: 1,
            y: 1,
            value: 50
        }
    }

    componentDidMount() {
      
    }

    render() {
        return (
            <div id="test">
            </div>
        );
    }
}

export default Test