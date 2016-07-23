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
        let {value} = this.state;

        const dataset = [
            {
                "id": 1,
                "value": 10
            },
            {
                "id": 2,
                "value": 20
            },
            {
                "id": 3,
                "value": 30
            },
            {
                "id": 4,
                "value": 40
            },
            {
                "id": 5,
                "value": 50
            }, {
                "id": 6,
                "value": 55
            },
            {
                "id": 7,
                "value": 45
            },
            {
                "id": 8,
                "value": 33
            },
            {
                "id": 9,
                "value": 65
            },
            {
                "id": 10,
                "value": 10
            }
        ];

        //1、半径比例尺
        var radiusScale = d3.scale.linear()
            .domain([0, d3.max(dataset, d => d.value)])
            .range([0, 30]);//TODO:考虑响应式

        //console.log(_.sortBy(dataset, 'value'));

        //2、颜色比例尺(TODO:分量比例尺?序列比例尺?)
        var fillScale = d3.scale.quantile()//最大三个才红色
            .domain([0, d3.max(dataset, d => d.value)])
            .range(['rgba(34,195,247,.5)', 'rgba(249,120,105,.8)']);

        //3、发散圈
        var svg = d3.select("#test").append("svg");

        svg.append("circle")
            .attr("cx", 100)
            .attr("cy", 100)
            .attr("r", radiusScale(value))
            .attr("fill", fillScale(value));

        //#22C3F7 (34,195,247) 50%
        //#F97869 (249,120,105) 80% 60% 40% 20%
    }

    render() {
        return (
            <div id="test">
            </div>
        );
    }
}

export default Test