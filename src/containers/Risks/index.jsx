import React, {Component, PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import Table from '../../components/Table/Table'
import TableBody from '../../components/Table/TableBody'
import TableFooter from '../../components/Table/TableFooter'
import TableHeader from '../../components/Table/TableHeader'
import TableHeaderColumn from '../../components/Table/TableHeaderColumn'
import TableRow from '../../components/Table/TableRow'
import TableRowColumn from '../../components/Table/TableRowColumn'
import http from '../../common/http'

import List from '../../components/List/List';
import ListItem from '../../components/List/ListItem';
import Subheader from 'material-ui/Subheader';


const items = [
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    },
    {
        score: 0,
        start_time: 0,
        ip: '0.0.0.0',
        user: 0,
        page: 'http://www.bigsec.com',
        tags: 'todo',
        strategies: 'todo',
        status: 'todo'
    }
];


import './index.scss';

const style = {
    height: '100%',
    width: '100%',
    margin: 0,
    background: '#282E3C'
    // textAlign: 'center',
    // display: 'inline-block'
};

class Risks extends Component {
    componentDidMount() {
        http.get('http://localhost:5003/api/platform/risks/statistics')
            .then(function (data) {
                console.log(data);
            })
    }

    render() {
        return (
            <div className="risks container">
                <Subheader style={{color:'#fff',fontSize:18}}>风险事件管理</Subheader>
                <section>
                    <Paper id="rect" style={style} zDepth={1}>
                    </Paper>
                </section>
                <section>
                    <Paper style={style} zDepth={1}>
                        <List>
                            <Subheader style={{color:'#fff'}}>统计</Subheader>
                            <ListItem primaryText="PAGE"/>
                            <ListItem primaryText="HOST"/>
                            <ListItem
                                primaryText="USER"
                                initiallyOpen={true}
                                nestedItems={[
                                  <ListItem
                                    key={1}
                                    primaryText="Starred"
                                  />,
                                  <ListItem
                                    key={2}
                                    primaryText="Sent Mail"
                                    disabled={true}
                                    nestedItems={[
                                      <ListItem key={1} primaryText="Drafts" />
                                    ]}
                                  />
                                ]}
                            />
                            <ListItem primaryText="DeviceID"/>
                            <ListItem primaryText="触发策略"/>
                            <ListItem primaryText="峰值请求速度"/>
                            <ListItem primaryText="关联交易"/>
                        </List>
                    </Paper>
                </section>
                <section>
                    <Paper style={style} zDepth={1}>
                        <Subheader style={{color:'#fff'}}>风险事件</Subheader>
                        <Table fixedHeader={true}>
                            <TableHeader
                                displaySelectAll={false}
                                adjustForCheckbox={false}
                            >
                                <TableRow>
                                    <TableHeaderColumn>风险值(avg)</TableHeaderColumn>
                                    <TableHeaderColumn>起始时间</TableHeaderColumn>
                                    <TableHeaderColumn>IP</TableHeaderColumn>
                                    <TableHeaderColumn>关联用户</TableHeaderColumn>
                                    <TableHeaderColumn>请求最多的地址</TableHeaderColumn>
                                    <TableHeaderColumn>风险标签</TableHeaderColumn>
                                    <TableHeaderColumn>命中策略</TableHeaderColumn>
                                    <TableHeaderColumn>操作</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody
                                displayRowCheckbox={false}
                                showRowHover={true}
                            >
                                {items.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableRowColumn>{item.score}</TableRowColumn>
                                        <TableRowColumn>{item.start_time}</TableRowColumn>
                                        <TableRowColumn>{item.ip}</TableRowColumn>
                                        <TableRowColumn>{item.user}</TableRowColumn>
                                        <TableRowColumn>{item.page}</TableRowColumn>
                                        <TableRowColumn>{item.tags}</TableRowColumn>
                                        <TableRowColumn>{item.strategies}</TableRowColumn>
                                        <TableRowColumn>{item.status}</TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </section>
            </div>
        )
    }
}

export default Risks;