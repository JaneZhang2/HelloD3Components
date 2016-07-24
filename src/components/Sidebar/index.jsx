import React, {Component, PropTypes} from 'react';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import Avatar from '../Avatar/index.jsx';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import './index.css';

const SelectableList = MakeSelectable(List);

class Sidebar extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        onChangeList: PropTypes.func.isRequired
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentDidMount() {
    }

    render() {
        const {
            location,
            onChangeList
        } = this.props;

        return (
            <Drawer className="sidebar" docked={true} open={true}>
                <div className="logo">
                    WARDEN
                </div>
                <figure>
                    <Avatar/>
                    <figcaption>
                        Administrator
                        <IconMenu
                            style={{verticalAlign:'middle'}}
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        >
                            <MenuItem primaryText="修改密码"/>
                            <MenuItem primaryText="用户管理"/>
                            <MenuItem primaryText="退出"/>
                        </IconMenu>
                    </figcaption>
                </figure>
                <SelectableList
                    value={location.pathname}
                    onChange={onChangeList}
                >
                    <ListItem primaryText="风险事件管理" value="/risks"/>
                </SelectableList>
            </Drawer>
        );
    }
}

export default Sidebar;
