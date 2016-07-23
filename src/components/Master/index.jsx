import React, {Component, PropTypes} from 'react';
import Title from 'react-title-component';
import AppBar from 'material-ui/AppBar';
import spacing from 'material-ui/styles/spacing';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {darkWhite, lightWhite, grey900} from 'material-ui/styles/colors';
import Sidebar from '../Sidebar/index.jsx';
import FullWidthSection from '../FullWidthSection';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './index.scss';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class Master extends Component {
    static propTypes = {
        children: PropTypes.node,
        location: PropTypes.object,
        width: PropTypes.number.isRequired
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    static childContextTypes = {
        muiTheme: PropTypes.object
    };

    state = {
        navDrawerOpen: true
    };

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme
        };
    }

    componentWillMount() {
        this.setState({
            muiTheme: getMuiTheme()
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
        this.setState({
            muiTheme: newMuiTheme
        });
    }

    getStyles() {
        const styles = {
            appBar: {
                position: 'fixed',
                // Needed to overlap the examples
                zIndex: this.state.muiTheme.zIndex.appBar + 1,
                top: 0
            },
            root: {
                paddingTop: spacing.desktopKeylineIncrement,
                minHeight: 400
            },
            content: {
                margin: spacing.desktopGutter
            },
            contentWhenMedium: {
                margin: `${spacing.desktopGutter * 2}px ${spacing.desktopGutter * 3}px`
            },
            footer: {
                backgroundColor: grey900,
                textAlign: 'center'
            },
            a: {
                color: darkWhite
            },
            p: {
                margin: '0 auto',
                padding: 0,
                color: lightWhite,
                maxWidth: 356
            },
            browserstack: {
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                margin: '25px 15px 0',
                padding: 0,
                color: lightWhite,
                lineHeight: '25px',
                fontSize: 12
            },
            browserstackLogo: {
                margin: '0 3px',
            },
            iconButton: {
                color: darkWhite
            },
        };

        if (this.props.width === MEDIUM || this.props.width === LARGE) {
            styles.content = Object.assign(styles.content, styles.contentWhenMedium);
        }

        return styles;
    }

    handleTouchTapLeftIconButton = () => {
        this.setState({
            navDrawerOpen: !this.state.navDrawerOpen
        });
    };

    handleChangeRequestNavDrawer = (open) => {
        this.setState({
            navDrawerOpen: open
        });
    };

    handleChangeList = (event, value) => {
        this.context.router.push(value);
    };

    render() {
        const {
            location,
            children,
        } = this.props;

        const router = this.context.router;
        const styles = this.getStyles();

        let showMenuIconButton = true;

        return (
            <div className="wrapper">
                <Title render="WARDEN"/>
                <AppBar
                    onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
                    zDepth={0}
                    style={styles.appBar}
                    showMenuIconButton={showMenuIconButton}
                />
                {children}
                <Sidebar
                    location={location}
                    onChangeList={this.handleChangeList}
                />
                <FullWidthSection>
                </FullWidthSection>
            </div>
        );
    }
}

export default withWidth()(Master);
