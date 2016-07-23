import React, {Component, PropTypes} from 'react';

import './index.scss';

class Avatar extends Component {
    static propTypes = {
        src: PropTypes.string
    };

    render() {
        const {src} = this.props;

        return <img src={src} className='avatar'/>
    }
}

export default Avatar;
