//窗口重置事件触发函数集
var windowResize = [];
//注册窗口重置事件
window.onresize = () => {
    for (let value of windowResize.values()) {
        //执行窗口重置事件
        if (typeof(value) == "function") {
            value();
        }
    }
};

//图表类
function BCharts(id) {
    return {
        //画布绘制的位置
        element: id,
        //画布
        svg: undefined,
        //画布边距
        padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        //悬浮游标类型
        hoverCursorType: "line",
        //图表数据和配置
        config: [],
        //资源路径
        resourcePath: "resources/",
        //地图geojson文件位置
        geoJson: "",
        //x轴属性
        xAxis: [{
            type: "category",
            gridLine: true,
            boundaryGap: true,
            position: "bottom",
            lineType: "solid",
            show: true
        }],
        //Y轴属性
        yAxis: [{
            type: "value",
            gridLine: true,
            boundaryGap: true,
            position: "left",
            lineType: "solid",
            markCount: 5,
            show: true
        }],
        //数据区域控件
        dataZoom: undefined,
        //鼠标悬浮游标
        hoverCursor: undefined,
        //鼠标悬浮提示
        hoverText: undefined,
        //标尺
        clickCursor: undefined,
        //散点图阈值控制颜色
        scatterThreshold: undefined,
        //地图阈值控制颜色
        mapThreshold: undefined,
        //设置图表数据和配置
        setConfig: function (config) {
            let me = this;
            let configs = [];
            let configOrg = false;
            if (me.config.length > 0) {
                configOrg = me.config;
            }
            if (config instanceof Array) {
                //设置默认属性
                for (let [i, item] of config.entries()) {
                    configs.push(this._defaultConfig(item, configOrg ? configOrg[i] : configOrg));
                }
            } else {
                configs.push(this._defaultConfig(config, configOrg ? configOrg[i] : configOrg));
            }
            this.config = configs;
            return this;
        },
        //添加默认配置
        _defaultConfig: function (item, configOrg) {
            let config = {};
            if (configOrg) {
                config = configOrg;
            } else {
                config = item;
            }
            config.dataAll = item.dataAll ? item.dataAll : config.data;
            config.data = item.data ? item.data : config.data;
            config.name = item.name ? item.name : (config.name ? config.name : "");
            config.xAxis = item.xAxis ? item.xAxis : (config.xAxis ? config.xAxis : 0);
            config.yAxis = item.yAxis ? item.yAxis : (config.yAxis ? config.yAxis : 0);
            config.color = item.color ? item.color : (config.color ? config.color : "#22C3F7");
            return config;
        },
        //设置地图geojson文件位置
        setGeoJson: function (path) {
            this.geoJson = path;
            return this;
        },
        //x轴属性
        setXAxis: function (xAxis) {
            let axis = [];
            if (xAxis instanceof Array) {
                //设置默认属性
                for (let item of xAxis.values()) {
                    axis.push(this._defaultAxis(item, "X"));
                }
            } else {
                axis.push(this._defaultAxis(xAxis, "X"));
            }
            this.xAxis = axis;
            return this;
        },
        //y轴属性
        setYAxis: function (yAxis) {
            let axis = [];
            if (yAxis instanceof Array) {
                //设置默认属性
                for (let item of yAxis.values()) {
                    axis.push(this._defaultAxis(item, "Y"));
                }
            } else {
                axis.push(this._defaultAxis(yAxis, "Y"));
            }
            this.yAxis = axis;
            return this;
        },
        //坐标轴默认属性设置
        _defaultAxis: function (item, type) {
            if (type == "X") {
                item.type = item.type === undefined ? "category" : item.type;
                item.position = item.position === undefined ? "bottom" : item.position;
            } else {
                item.type = item.type === undefined ? "value" : item.type;
                item.position = item.position === undefined ? "left" : item.position;
            }
            item.gridLine = item.gridLine === undefined ? true : item.gridLine;
            item.boundaryGap = item.boundaryGap === undefined ? true : item.boundaryGap;
            item.show = item.show === undefined ? true : item.show;
            item.lineType = item.lineType === undefined ? "solid" : item.lineType;
            item.markCount = item.markCount === undefined ? 5 : item.markCount;
            return item;
        },
        //设置数据区域控件
        setDataZoom: function (dataZoom) {
            this.dataZoom = dataZoom;
            return this;
        },
        //设置鼠标悬浮游标
        setHoverCursor: function (hoverCursor) {
            this.hoverCursor = hoverCursor;
            return this;
        },
        //设置鼠标悬浮提示
        setHoverText: function (hoverText) {
            this.hoverText = hoverText;
            return this;
        },
        //设置标尺
        setClickCursor: function (clickCursor) {
            this.clickCursor = clickCursor;
            return this;
        },
        //设置散点图阈值控制颜色
        setScatterThreshold: function (scatterThreshold) {
            this.scatterThreshold = scatterThreshold;
            return this;
        },
        //地图阈值控制颜色
        setMapThreshold: function (mapThreshold) {
            this.mapThreshold = mapThreshold;
            return this;
        },
        //根据配置绘制图表
        build: function () {
            let me = this;
            //try {
            //绘制画布
            me._svgInit();
            //地图不绘制坐标轴
            if (!(me.config[0].type == "map-scatter")) {
                //获取坐标轴数据
                me._getAxisData();
                //绘制坐标轴
                me._initAxis();
            }
            let forbidCursor = false;
            me.hoverCursorType = "bar";
            //绘制图表
            for (let [index, value] of me.config.entries()) {
                if (value.type == "bar") {
                    //绘制柱形图图表
                    me._showBarCharts(index, value);
                } else if (value.type == "line") {
                    me.hoverCursorType = "line";
                    //绘制折线图图表
                    me._showLineCharts(index, value);
                } else if (value.type == "scatter") {
                    forbidCursor = true;
                    //绘制散点图图表
                    me._showScatterCharts(index, value);
                } else if (value.type == "map-scatter") {
                    forbidCursor = true;
                    //绘制地图散点图图表
                    me._showMapScatterCharts(index, value);
                }
            }

            if (!forbidCursor) {
                let config = me.config;
                //具体数据集
                let xAxis = me.xAxis[config[0].xAxis];
                let dataset = [];
                //图表数据
                let fullData = config[0].data;
                for (let item of fullData.values()) {
                    if (xAxis.type == "value") {
                        dataset.push(item.x);
                    } else {
                        dataset.push(item.y);
                    }
                }

                let scale = 100 / dataset.length;
                //标尺控制
                me._cursorCtrl(config, scale, dataset);
            }
            //} catch (e) {
            //    //获取异常
            //    console.error(e);
            //}

        },
        //根据配置更新图表
        update: function () {
            let me = this;
            //图表容器
            me.build();
        },
        //绘制画布
        _svgInit: function () {
            let me = this;
            //图表容器
            let element = me.element;
            let chartContainer = d3.select(element);
            //检查元素是否合法
            if (!chartContainer.node()) {
                me._exception(`没有找到${element}元素`);
            }

            //绘制画布前，如果有画布则清空画布容器
            try {
                chartContainer.select(".svg-container").remove();
            } catch (e) {
            }

            //添加SVG画布
            me.svg = d3.select(element)
                .append("div")
                .attr("class", "svg-container")
                .append("svg")
                .attr({
                    "class": "svg-view",
                    "width": "100%",
                    "height": (me.dataZoom && me.config.length == 1) ? "80%" : "100%"
                });

            //添加数据区域组件
            if (me.dataZoom && me.config.length == 1) {
                //数据格式化
                me.dataZoom.start = parseFloat(me.dataZoom.start);
                if (isNaN(me.dataZoom.start)) {
                    me._exception("起始值数据类型错误");
                    return;
                }
                me.dataZoom.end = parseFloat(me.dataZoom.end);
                if (isNaN(me.dataZoom.end)) {
                    me._exception("结束值数据类型错误");
                    return;
                }
                //数据错误
                if (me.dataZoom.start > me.dataZoom.end) {
                    me._exception("数据区域初始化，起始值不能大于结束值");
                    return;
                }
                //添加SVG画布
                me.zoomSvg = d3.select(element)
                    .select(".svg-container")
                    .append("svg")
                    .attr({
                        "class": "data-zoom-view",
                        "width": "100%",
                        "height": "20%"
                    });
                //存入当前数据范围
                me.dataZoom.minIndex = Math.trunc(me.config[0].dataAll.length * (me.dataZoom.start / 100));
                me.dataZoom.maxIndex = Math.trunc(me.config[0].dataAll.length * (me.dataZoom.end / 100));
                let configData = me.config[0].dataAll;
                let limitData = [];
                for (let [i, v] of configData.entries()) {
                    if (i >= me.dataZoom.minIndex && i <= me.dataZoom.maxIndex) {
                        limitData.push(v);
                    }
                }
                me.config[0].data = limitData;

                me._showDataZoom();
            }
            return {};
        },
        //获取坐标轴数据
        _getAxisData: function () {
            let me = this;
            let xAxis = me.xAxis;
            let yAxis = me.yAxis;
            for (let config of me.config) {
                let orgData = config.data;
                //图表类型
                let type = config.type;
                if (type == "bar" || type == "line") {
                    let xData = [];
                    let yData = [];
                    //取当前配置对应的xy轴数据
                    if (xAxis[config.xAxis].data) {
                        xData = xAxis[config.xAxis].data;
                    }
                    if (yAxis[config.yAxis].data) {
                        yData = yAxis[config.yAxis].data;
                    }
                    //折线图数据
                    for (let item of orgData.values()) {
                        //category不叠加
                        if (xAxis[config.xAxis].type == "category") {
                            if (!xData.includes(item.x)) {
                                xData.push(item.x);
                            }
                        } else {
                            //value取最大值和最小值，需要将所有数据添加进去
                            xData.push(item.x);
                        }
                        if (yAxis[config.yAxis].type == "category") {
                            if (!yData.includes(item.y)) {
                                yData.push(item.y);
                            }
                        } else {
                            yData.push(item.y);
                        }
                    }
                    //设置当前配置对应的xy轴数据
                    xAxis[config.xAxis].data = xData;
                    yAxis[config.yAxis].data = yData;
                } else if (type == "scatter") {
                    let xData = [];
                    let yData = [];
                    //取当前配置对应的xy轴数据
                    if (xAxis[config.xAxis].data) {
                        xData = xAxis[config.xAxis].data;
                    }
                    if (yAxis[config.yAxis].data) {
                        yData = yAxis[config.yAxis].data;
                    }
                    //散点图数据
                    for (let item in orgData) {
                        if (yAxis[config.yAxis].type == "category") {
                            if (!yData.includes(item)) {
                                yData.push(item);
                            }
                        } else {
                            yData.push(item);
                        }
                        //拼装xy轴数据与数据数值
                        for (let v of orgData[item].values()) {
                            //category不叠加
                            if (xAxis[config.xAxis].type == "category") {
                                if (!xData.includes(v.mark)) {
                                    xData.push(v.mark);
                                }
                            } else {
                                //value取最大值和最小值，需要将所有数据添加进去
                                xData.push(v.mark);
                            }
                        }
                    }
                    //设置当前配置对应的xy轴数据
                    xAxis[config.xAxis].data = xData;
                    yAxis[config.yAxis].data = yData;
                } else {
                    me._exception(`不存在${type}类型的图表`);
                }
            }
            me.xAxis = xAxis;
            me.yAxis = yAxis;
        },
        //绘制坐标轴
        _initAxis: function () {
            let me = this;
            //处理x轴
            me._xAxisDeal();
            //处理y轴
            me._yAxisDeal();

        },
        //处理x轴
        _xAxisDeal: function () {
            let me = this;
            let axisConfig = me.xAxis;

            //绘制图表边框
            me.svg.append("line")
                .attr({
                    "class": "axis-line" + (axisConfig[0].lineType == "dash" ? " dash" : ""),
                    "x1": "0",
                    "y1": "0",
                    "x2": "100%",
                    "y2": "0"
                });
            me.svg.append("line")
                .attr({
                    "class": "axis-line" + (axisConfig[0].lineType == "dash" ? " dash" : ""),
                    "x1": "0",
                    "y1": "100%",
                    "x2": "100%",
                    "y2": "100%"
                });
            //绘制坐标轴和刻度
            for (let axis of axisConfig.values()) {
                if (axis.position != "top" && axis.position != "bottom") {
                    me._exception("x轴位置只能为top和bottom");
                }
                //添加x轴数据
                let x = me.svg.append("g")
                    .attr("class", "x-axis")
                    .selectAll("g")
                    .data(axis.data)
                    .enter();
                //x轴、刻度与网格
                let scale = me._axisLine(axis, x, "X");
                if (scale) {
                    axis.scale = scale;
                }
            }
        },
        //处理Y轴
        _yAxisDeal: function () {
            let me = this;
            let axisConfig = me.yAxis;
            //绘制图表边框
            me.svg.append("line")
                .attr({
                    "class": "axis-line" + (axisConfig[0].lineType == "dash" ? " dash" : ""),
                    "x1": "0",
                    "y1": "0",
                    "x2": "0",
                    "y2": "100%"
                });
            me.svg.append("line")
                .attr({
                    "class": "axis-line" + (axisConfig[0].lineType == "dash" ? " dash" : ""),
                    "x1": "100%",
                    "y1": "0",
                    "x2": "100%",
                    "y2": "100%"
                });
            //绘制坐标轴和刻度
            for (let axis of axisConfig.values()) {
                if (axis.position != "left" && axis.position != "right") {
                    me._exception("y轴位置只能为left和right");
                }
                //添加y轴数据
                let y = me.svg.append("g")
                    .attr("class", "y-axis")
                    .selectAll("g")
                    .data(axis.data)
                    .enter();
                //y轴、刻度与网格
                let scale = me._axisLine(axis, y, "Y");
                if (scale) {
                    axis.scale = scale;
                }
            }
        },
        //坐标轴、刻度与网格
        _axisLine: function (axis, axisGroup, type) {
            let me = this;
            let scale = "";

            if (axis.type == "category") {
                //类别坐标轴
                me._axisCategory(axis, axisGroup, type);
            } else if (axis.type == "value") {
                //数值坐标轴
                scale = me._axisValue(axis, axisGroup, type);
            }
            return scale;
            //绘制坐标轴线
            //me.svg.append("line")
            //    .attr({
            //        "class": "axis-line" + (axis.lineType == "dash" ? " dash" : ""),
            //        "x1": ()=> {
            //            if (type == "X") {
            //                return 0;
            //            }
            //            if (axis.position == "left") {
            //                return 0
            //            }
            //            return "100%";
            //        },
            //        "y1": ()=> {
            //            if (type == "X") {
            //                if (axis.position == "bottom") {
            //                    return "100%"
            //                }
            //                return 0;
            //            }
            //            return 0;
            //        },
            //        "x2": ()=> {
            //            if (type == "X") {
            //                return "100%";
            //            }
            //            if (axis.position == "left") {
            //                return 0
            //            }
            //            return "100%";
            //        },
            //        "y2": ()=> {
            //            if (type == "X") {
            //                if (axis.position == "bottom") {
            //                    return "100%"
            //                }
            //                return 0;
            //            }
            //            return "100%";
            //        }
            //    });

        },
        //类坐标轴
        _axisCategory: function (axis, axisGroup, type) {
            let me = this;
            //一共多少项
            let count = axis.data.length;
            //缩放
            let scale = 100 / count;
            //坐标轴网格
            if (axis.gridLine) {
                //绘制坐标轴网格
                axisGroup.append('line')
                    .attr({
                        "class": "grid-line" + (axis.lineType == "dash" ? " dash" : ""),
                        "x1": (d, i) => {
                            //去掉第一条网格
                            if (i === 0) {
                                return 0;
                            }
                            if (type == "X") {
                                return scale * i + "%";
                            }
                            return 0;
                        },
                        "y1": (d, i) => {
                            //去掉第一条网格
                            if (i === 0) {
                                return 0;
                            }
                            if (type == "X") {
                                return 0;
                            }
                            return (100 - scale * i) + "%";
                        },
                        "x2": (d, i) => {
                            //去掉第一条网格
                            if (i === 0) {
                                return 0;
                            }
                            if (type == "X") {
                                return scale * i + "%";
                            }
                            return "100%";
                        },
                        "y2": (d, i) => {
                            //去掉第一条网格
                            if (i === 0) {
                                return 0;
                            }
                            if (type == "X") {
                                return "100%";
                            }
                            return (100 - scale * i) + "%";
                        }
                    });
            }
            //是否显示坐标轴
            if (axis.show) {
                //坐标轴刻度
                axisGroup.append("text")
                    .attr({
                        "class": ()=> {
                            if (type == "X") {
                                return "x-axis-text";
                            }
                            if (axis.position == "left") {
                                return "y-left-axis-text"
                            } else {
                                return "y-right-axis-text"
                            }
                        },
                        "x": (d, i) => {
                            if (type == "X") {
                                let pos = 0;
                                if (axis.boundaryGap) {
                                    pos = scale * i + scale / 2;
                                } else {
                                    pos = scale * i;
                                }
                                if (axis.flip) {
                                    return 100 - pos + "%";
                                }
                                return pos + "%";
                            }
                            if (axis.position == "left") {
                                return "0";
                            }
                            return "100%";
                        },
                        "y": (d, i) => {
                            if (type == "X") {
                                if (axis.position == "bottom") {
                                    return "100%";
                                }
                                return 0;
                            }
                            let pos = 0;
                            if (axis.boundaryGap) {
                                pos = (100 - scale * i - scale / 2);
                            } else {
                                pos = (100 - scale * i);
                            }
                            if (axis.flip) {
                                return 100 - pos + "%";
                            }
                            return pos + "%"
                        },
                        "transform": ()=> {
                            if (type == "X") {
                                if (axis.position == "bottom") {
                                    return "translate(0, 15)";
                                }
                                return "translate(0, -5)";
                            }
                            if (axis.position == "left") {
                                return "translate(-5, 5)";
                            }
                            return "translate(5, 5)";
                        }
                    })
                    .text((b) => b);
                //设置画布边距
                me._setSvgPadding(type, axis);
            }
        },
        //数值坐标轴
        _axisValue: function (axis, axisGroup, type) {
            let me = this;
            let markCount = axis.markCount;
            let maxValue = Math.max(...axis.data);
            if (maxValue < 5) {
                maxValue = 5;
            } else {
                let v = maxValue % markCount;
                maxValue = maxValue + markCount - (v === 0 ? markCount : v);
            }
            //坐标轴的比例尺
            let scale = d3.scale.linear()
                .domain([0, maxValue]);
            if (axis.flip) {
                scale.range([100, 0])
            } else {
                scale.range([0, 100])
            }
            //绘制坐标轴轴网格
            let axisLine = (type == "X" ? me.svg.select(".x-axis") : me.svg.select(".y-axis"));
            let scaleNum = maxValue / (markCount - 1);
            //坐标轴网格
            if (axis.gridLine) {
                for (let i = 0; i < markCount - 1; i++) {
                    if (i === 0) {
                        //去掉第一条网格
                        continue;
                    }
                    axisLine.append('line')
                        .attr({
                            "class": "grid-line" + (axis.lineType == "dash" ? " dash" : ""),
                            "x1": () => {
                                if (type == "X") {
                                    return scale(i * scaleNum) + "%";
                                }
                                return 0;
                            },
                            "y1": ()=> {
                                if (type == "X") {
                                    return 0;
                                }
                                return scale(i * scaleNum) + "%";
                            },
                            "x2": () => {
                                if (type == "X") {
                                    return scale(i * scaleNum) + "%";
                                }
                                return "100%";
                            },
                            "y2": ()=> {
                                if (type == "X") {
                                    return "100%";
                                }
                                return scale(i * scaleNum) + "%";
                            }
                        });
                }
            }
            //是否显示坐标轴
            if (axis.show) {
                for (let i = 0; i < markCount; i++) {
                    axisLine.append('text')
                        .attr({
                            "class": ()=> {
                                if (type == "X") {
                                    return "x-axis-text";
                                }
                                if (axis.position == "left") {
                                    return "y-left-axis-text"
                                } else {
                                    return "y-right-axis-text"
                                }
                            },
                            "x": () => {
                                let pos = 0;
                                if (type == "X") {
                                    pos = scale(i * scaleNum);
                                } else {
                                    if (axis.position == "left") {
                                        pos = 0;
                                    } else {
                                        pos = 100;
                                    }
                                }
                                return pos + "%";
                            },
                            "y": () => {
                                let pos = 0;
                                if (type == "X") {
                                    if (axis.position == "bottom") {
                                        pos = 100;
                                    } else {
                                        pos = 0;
                                    }
                                } else {
                                    pos = 100 - scale(i * scaleNum);
                                }
                                return pos + "%";
                            },
                            "transform": ()=> {
                                if (type == "X") {
                                    if (axis.position == "bottom") {
                                        return "translate(0, 15)";
                                    }
                                    return "translate(0, -5)";
                                }
                                if (axis.position == "left") {
                                    return "translate(-5, 5)";
                                }
                                return "translate(5, 5)";
                            }
                        })
                        .text(scaleNum * i);
                    //设置画布边距
                    me._setSvgPadding(type, axis);
                }
            }
            return scale;
        },
        //设置画布边距
        _setSvgPadding: function (type, axis) {
            let me = this;
            //获取文字最大高宽
            let textList = {};
            if (type == "X") {
                textList = me.svg.selectAll(".x-axis text")[0];
            } else {
                textList = me.svg.selectAll(".y-axis text")[0];
            }
            let maxWidth = 0;
            let maxHeight = 0;
            for (let item of textList.values()) {
                let width = item.clientWidth;
                let height = item.clientHeight;
                if (maxWidth < width) {
                    maxWidth = width;
                }
                if (maxHeight < height) {
                    maxHeight = height;
                }
            }
            if (axis.position == "top") {
                //画布边距
                me.svg.style("padding-top", maxHeight + 10);
                me.padding.top = maxHeight + 10;
            } else if (axis.position == "left") {
                //画布边距
                me.svg.style("padding-left", maxWidth + 10);
                me.padding.left = maxWidth + 10;
            } else if (axis.position == "bottom") {
                //画布边距
                me.svg.style("padding-bottom", maxHeight + 10);
                me.padding.bottom = maxHeight + 10;
            } else if (axis.position == "right") {
                //画布边距
                me.svg.style("padding-right", maxWidth + 10);
                me.padding.right = maxWidth + 10;
            }
        },
        //绘制柱形图图表
        _showBarCharts: function (index, config) {
            let me = this;
            //具体数据集
            let xAxis = me.xAxis[config.xAxis];
            let yAxis = me.yAxis[config.yAxis];
            //图表数据
            let fullData = config.data;
            //柱形图数据
            let dataset = [];
            //具体数据集
            let dataAll = [];
            //重新组装数据
            for (let item of fullData.values()) {
                dataAll.push({
                    x: item.x,
                    y: item.y,
                    dataName: config.name
                });
                if (xAxis.type == "value") {
                    dataset.push(item.x);
                } else {
                    dataset.push(item.y);
                }
            }

            let scale = 100 / dataset.length;
            //添加矩形元素
            let barContainer = me.svg.append("g")
                .attr("class", "rect-container_" + index);
            let barCount = 0;
            for (let item of me.config.values()) {
                if (item.type == "bar") {
                    barCount++;
                }
            }
            let wide = (scale - 0.5) / barCount - 0.5;
            //矩形
            let rects = barContainer.selectAll("rect")
                .data(dataAll)
                .enter()
                .append("rect")
                .style({
                    "fill": config.color ? config.color : ""
                })
                .attr({
                    "class": "data-bar",
                    "x": (d, i) => {
                        if (xAxis.type == "category") {
                            let pos = scale * i + 0.5 + ((wide + 0.5) * index);
                            if (xAxis.flip) {
                                return 100 - pos + "%";
                            }
                            return pos + "%";
                        }
                        if (xAxis.flip) {
                            return 100 - xAxis.scale(dataset[i]) + "%";
                        }
                        return 0;
                    },
                    "y": (d, i) => {
                        let pos = 0;
                        if (yAxis.type == "category") {
                            pos = 100 - scale * i - scale + 0.5 + ((wide + 0.5) * index);
                            if (yAxis.flip) {
                                return 100 - pos + "%";
                            }
                            return pos + "%";
                        }
                        pos = 100 - yAxis.scale(dataset[i]);
                        if (yAxis.flip) {
                            pos = 0;
                        }
                        return pos + "%"
                    },
                    "width": (d, i) => {
                        if (xAxis.type == "category") {
                            //两边0.5%的间隔
                            return wide + "%";
                        }
                        return xAxis.scale(dataset[i]) + "%";
                    },
                    "height": (d, i) => {
                        if (xAxis.type == "category") {
                            return Math.abs(yAxis.scale(dataset[i]) - yAxis.scale(0)) + "%";
                        }
                        return wide + "%";
                    }
                });
            //柱形无缩放事件
            config.pinch = false;
            //注册事件
            me._eventRegister(rects, config, "");
        },
        //绘制折线图图表
        _showLineCharts: function (index, config) {
            let me = this;
            let xAxis = me.xAxis[config.xAxis];
            let yAxis = me.yAxis[config.yAxis];
            let fullData = config.data;
            //曲线图数据
            let dataset = [];
            //具体数据集
            let dataAll = [];
            //重新组装数据
            for (let item of fullData.values()) {
                dataAll.push({
                    x: item.x,
                    y: item.y,
                    dataName: config.name
                });
                if (xAxis.type == "value") {
                    dataset.push(item.x);
                } else {
                    dataset.push(item.y);
                }
            }

            //曲线生成器
            let lineFunction = d3.svg.line()
                .x((d, i) => me._lineChartGetX(xAxis, dataset, i))
                .y((d, i) => me._lineChartGetY(yAxis, dataset, i))
                .interpolate("");

            let dataColor = config.color ? config.color : "";
            //把path扔到容器中，并给d赋属性
            let lineContainer = me.svg.append("g").attr("class", "line-container_" + index);
            lineContainer.append("path")
                .style({
                    "stroke": dataColor
                })
                .attr({
                    "class": "data-line line_" + index,
                    "d": lineFunction(dataset)
                });
            let point = lineContainer.selectAll('circle')
                .data(dataAll)
                .enter()
                .append('circle')
                .style({
                    "stroke": dataColor
                })
                .attr({
                    "class": "line-circle",
                    "r": 2.5,
                    "cx": (d, i) => me._lineChartGetX(xAxis, dataset, i),
                    "cy": (d, i) => me._lineChartGetY(yAxis, dataset, i)
                });
            //默认添加动画
            config.pinch = config.pinch === undefined ? true : config.pinch;
            //注册事件
            me._eventRegister(point, config, "circle");
            //窗口变化时重绘曲线
            windowResize.push(() => {
                me.svg.select(".data-line.line_" + index).attr("d", lineFunction(dataset));
                lineContainer.selectAll('circle')
                    .attr({
                        "cx": (d, i) => me._lineChartGetX(xAxis, dataset, i),
                        "cy": (d, i) => me._lineChartGetY(yAxis, dataset, i)
                    })
            });
        },
        //获取x数值
        _lineChartGetX: function (xAxis, dataset, i) {
            let me = this;
            //获取画布容器宽度
            let width = me.svg.node().clientWidth - (me.padding.left + me.padding.right);
            if (xAxis.scale) {
                return width * (xAxis.scale(dataset[i]) / 100);
            }
            let count = dataset.length;
            let scale = 100 / count;
            let pos = 0;
            if (xAxis.boundaryGap) {
                pos = width * (scale * i / 100 + scale / 100 / 2);
            } else {
                pos = width * scale * i / 100;
            }
            if (xAxis.flip) {
                pos = width - pos;
            }
            return pos;
        },
        //获取y数值
        _lineChartGetY: function (yAxis, dataset, i) {
            let me = this;
            //获取画布容器宽度
            let height = me.svg.node().clientHeight - (me.padding.top + me.padding.bottom);
            if (yAxis.scale) {
                return height * (1 - yAxis.scale(dataset[i]) / 100);
            }
            let count = dataset.length;
            let scale = 100 / count;
            let pos = 0;
            if (yAxis.boundaryGap) {
                pos = height * (1 - scale * i / 100 - scale / 100 / 2);
            } else {
                pos = height * scale * i / 100;
            }
            if (yAxis.flip) {
                pos = height - pos;
            }
            return pos;
        },

        //显示散点图
        _showScatterCharts: function (index, config) {

            let me = this;

            //图表数据
            let fullData = config.data;
            //Y轴坐标数据
            let yAxisData = me.yAxis[0].data;
            //x轴坐标数据
            let xAxisData = me.xAxis[0].data;
            //散点数据
            let pointData = [];
            //数据大小集合，用于限制散点大小
            let datas = [];
            //重新组装数据
            let count = 0;
            for (let item in fullData) {
                let partData = fullData[item];
                //拼装xy轴数据与数据数值
                for (let [i, value] of partData.entries()) {
                    pointData.push({
                        name: config.name,
                        xIndex: count,
                        x: xAxisData[count],
                        yIndex: i,
                        y: yAxisData[i],
                        value: value.value
                    });
                    datas.push(value.value);
                }
                count++;
            }

            //散点图大小比例尺
            let pointSize = config.pointSize === undefined ? 15 : config.pointSize;
            let pointScale = d3.scale.linear()
                .domain([0, Math.max(...datas)])
                .range([0, pointSize]);
            //数据容器
            let point = me.svg.append("g")
                .attr("class", "scatter-container_" + index)
                .selectAll(".scatter-container" + index)
                .data(pointData)
                .enter()
                .append('circle')
                .style({
                    fill: (d, i)=> {
                        if (me.scatterThreshold) {
                            for (let item of me.scatterThreshold.values()) {
                                let range = item.range;
                                let min = range[0];
                                let max = range[1];
                                if ((min === "" || d.value >= min) && (max === "" || d.value <= max)) {
                                    return item.color;
                                }
                            }
                        }
                        return config.color ? config.color : "";
                    }
                })
                .attr({
                    "class": "data-scatter",
                    "cx": d => {
                        //一共多少项
                        let count = xAxisData.length;
                        //缩放
                        let scale = 100 / count;
                        return d.xIndex * scale + "%";
                    },
                    "cy": d => {
                        //一共多少项
                        let count = yAxisData.length;
                        //缩放
                        let scale = 100 / count;
                        return (100 - d.yIndex * scale) + "%";
                    },
                    "r": d => pointScale(d.value)
                });

            //默认添加动画
            config.pinch = config.pinch === undefined ? true : config.pinch;
            //注册事件
            me._eventRegister(point, config, "circle");

        },
        //地图散点图图表
        _showMapScatterCharts: function (index, config) {

            let me = this;
            //画布边距
            me.svg.style("padding", 0);
            let height = me.svg.node().clientHeight;
            let width = me.svg.node().clientWidth;
            let map = me.svg.append("g")
                .attr("class", "map-container");

            d3.json(me.resourcePath + me.geoJson, function (error, root) {
                if (error) {
                    me._exception(error);
                    return;
                }

                //1、地理投影
                var projection = d3.geo.mercator();
                //2、地理路径生成器
                var path = d3.geo.path()
                    .projection(projection);

                var bounds = path.bounds(root);
                //设置投影中心、缩放比例、位移
                projection.center(d3.geo.centroid(root))
                    .scale(height / (bounds[1][1] - bounds[0][1]) * 150)
                    .translate([width / 2, height / 2]);

                d3.json(me.resourcePath + "map-json/world_605kb.json", function (error, root2) {

                    if (error) {
                        me._exception(error);
                        return;
                    }

                    let zoom = {};
                    if (config.zoom) {
                        //缩放背景
                        zoom = me._zoomEvent(path, config, projection);
                        //注册缩放事件
                        map.append("rect")
                            .attr({
                                "class": "map-bg",
                                "x": 0,
                                "y": 0
                            })
                            .call(zoom);
                    }

                    let mapBg = map.append("g").selectAll("path")
                        .data(root2.features)
                        .enter()
                        .append("path")
                        .attr("class", "map-background")
                        .attr("d", path);

                    let mainMap = map.append("g").selectAll("path")
                        .data(root.features)
                        .enter()
                        .append("path")
                        .attr("class", "main-map")
                        .attr("d", path);

                    //注册缩放事件
                    if (config.zoom) {
                        mapBg.call(zoom);
                        mainMap.call(zoom);
                    }
                    //绘制散点
                    me._mapPointDeal(config, projection);
                });
            });


        },
        //绘制修改地图散点
        _mapPointDeal: function (config, projection) {
            let me = this;
            let data = config.data;
            let maxValue = 0;
            //获取散点最大值，用于制作比例尺
            for (let value of data.values()) {
                if (value[2] > maxValue) {
                    maxValue = value[2];
                }
            }
            //散点图大小比例尺
            let pointSize = config.pointSize === undefined ? 10 : config.pointSize;
            let pointScale = d3.scale.linear()
                .domain([0, maxValue])
                .range([0, pointSize]);
            let mapPoint = me.svg.selectAll(".map-point");
            //判断是否已绘制散点数据
            if (mapPoint[0].length > 0) {
                //修改散点位置
                let solidPoint = mapPoint.selectAll(".solid-point");
                solidPoint
                    .attr("cx", (d) => {
                        let proPeking = projection([d.lng, d.lat]);
                        return proPeking[0];
                    })
                    .attr("cy", (d) => {
                        let proPeking = projection([d.lng, d.lat]);
                        return proPeking[1];
                    });
                //同步修改动画位置
                let hollowCircle = mapPoint.selectAll(".hollow-circle");
                hollowCircle
                    .attr("cx", (d, i) => {
                        let proPeking = projection([d.lng, d.lat]);
                        return proPeking[0];
                    })
                    .attr("cy", (d, i) => {
                        let proPeking = projection([d.lng, d.lat]);
                        return proPeking[1];
                    });
            } else {
                let circleContainer = me.svg.append("g").attr("class", "map-point");
                //阈值
                let safeLine = undefined;
                if (me.mapThreshold) {
                    if (me.mapThreshold.type == "range") {
                        //排名类型则计算出前几的最小数值作为阈值
                        let range = [];
                        //取最大的N个数字
                        for (let value of data.values()) {
                            let curValue = value[2];
                            if (range.length < me.mapThreshold.value) {
                                range.push(curValue);
                                continue;
                            }
                            let rangeMin = Math.min(...range);
                            if (rangeMin < curValue) {
                                let i = range.findIndex((value)=> {
                                    return value == rangeMin;
                                });
                                range.splice(i);
                                range.push(curValue);
                            }
                        }
                        safeLine = Math.min(...range);
                    } else {
                        safeLine = me.mapThreshold.value;
                    }
                }
                //初次绘制散点数据
                for (let value of data.values()) {
                    let proPeking = projection([value[0], value[1]]);
                    //如果有安全值则显示动画
                    if (me.mapThreshold.animation && safeLine !== undefined && value[2] >= safeLine) {
                        me._createCircleAnimate(circleContainer, proPeking, pointScale, value);
                    }
                    //绘制数据圆点
                    circleContainer.append("circle")
                        .datum({
                            lng: value[0],
                            lat: value[1],
                            value: value[2]
                        })
                        .style({
                            "fill": (d)=> d.value >= safeLine ? me.mapThreshold.color : ""
                        })
                        .attr({
                            "class": "solid-point",
                            "cx": proPeking[0],
                            "cy": proPeking[1],
                            "r": pointScale(value[2])
                        });
                }
                //默认添加动画
                config.pinch = config.pinch === undefined ? true : config.pinch;
                let point = circleContainer.selectAll(".solid-point");
                //注册事件
                me._eventRegister(point, config, "circle");
            }
        },
        //缩放事件
        _zoomEvent: function (path, config, projection) {
            let me = this;

            let map = me.svg.select(".map-container");

            let initTran = projection.translate();
            let initScale = projection.scale();

            //缩放拖动事件
            return d3.behavior.zoom()
                .scaleExtent([1, 10])
                .on("zoom", () => {
                    let x = d3.event.translate[0];
                    let y = d3.event.translate[1];
                    if (d3.event.translate[0] > (initTran[0] * d3.event.scale)) {
                        x = initTran[0] * d3.event.scale;
                    } else if (d3.event.translate[0] < -(initTran[0] * d3.event.scale)) {
                        x = -initTran[0] * d3.event.scale;
                    }
                    if (d3.event.translate[1] > (initTran[1] * d3.event.scale)) {
                        y = initTran[1] * d3.event.scale;
                    } else if (d3.event.translate[1] < -(initTran[1] * d3.event.scale)) {
                        y = -initTran[1] * d3.event.scale;
                    }
                    projection.translate([
                        initTran[0] + x,
                        initTran[1] + y
                    ]);
                    projection.scale(initScale * d3.event.scale);
                    map.selectAll("path")
                        .attr("d", path);
                    //绘制散点
                    me._mapPointDeal(config, projection);
                });
        },
        //动画
        _createCircleAnimate: function (circleContainer, proPeking, pointScale, item) {
            let me = this;
            for (let i = 0; i < 3; i++) {
                //添加动画
                let circle = circleContainer.append("circle")
                    .datum({
                        lng: item[0],
                        lat: item[1],
                        value: item[2]
                    })
                    .style({
                        "stroke": ()=> me.mapThreshold.color
                    })
                    .attr({
                        "class": "hollow-circle",
                        "cx": proPeking[0],
                        "cy": proPeking[1],
                        "r": pointScale(item[2])
                    });
                //半径变化
                circle.append("animate")
                    .attr({
                        "attributeName": "r",
                        "from": pointScale(item[2]),
                        "to": pointScale(item[2]) + 12,
                        "begin": i + "s",
                        "dur": "3s",
                        "repeatCount": "indefinite"
                    });
                //渐变消失
                circle.append("animate")
                    .attr({
                        "attributeName": "opacity",
                        "from": 0.6,
                        "to": 0,
                        "begin": i + "s",
                        "dur": "3s",
                        "repeatCount": "indefinite"
                    });
            }
        },
        //显示数据区域内容
        _showDataZoom: function () {
            let me = this;
            let config = me.config[0];
            //绘制边框
            me._dataZoomBorder();

            let yData = [];
            //折线图数据
            for (let item of config.dataAll.values()) {
                yData.push(item.y);
            }
            //坐标轴的比例尺
            let scale = d3.scale.linear()
                .domain([0, Math.max(...yData) + 5])
                .range([0, 100]);
            //绘制数据区域
            me._showDataZoomCharts(config, scale);

            //绘制操作控件
            me._showZoomBar();

        },
        //绘制边框
        _dataZoomBorder: function () {
            let me = this;
            //绘制边框
            me.zoomSvg.append("line")
                .attr({
                    "class": "data-zoom-border",
                    "x1": "0",
                    "y1": "0",
                    "x2": "100%",
                    "y2": "0"
                });
            me.zoomSvg.append("line")
                .attr({
                    "class": "data-zoom-border",
                    "x1": "0",
                    "y1": "100%",
                    "x2": "100%",
                    "y2": "100%"
                });
            me.zoomSvg.append("line")
                .attr({
                    "class": "data-zoom-border",
                    "x1": "0",
                    "y1": "0",
                    "x2": "0",
                    "y2": "100%"
                });
            me.zoomSvg.append("line")
                .attr({
                    "class": "data-zoom-border",
                    "x1": "100%",
                    "y1": "0",
                    "x2": "100%",
                    "y2": "100%"
                });
        },
        //绘制数据区域
        _showDataZoomCharts: function (config, scale) {
            let me = this;
            let fullData = config.dataAll;
            //曲线图数据
            let dataset = [];
            //具体数据集
            let dataAll = [];
            //重新组装数据
            for (let item of fullData.values()) {
                dataAll.push({
                    x: item.x,
                    y: item.y,
                    dataName: config.name
                });
                dataset.push(item.y);
            }

            //曲线生成器
            let lineFunction = d3.svg.area()
                .x((d, i) => {
                    //获取画布容器宽度
                    let width = me.zoomSvg.node().clientWidth - 20;
                    let count = dataset.length - 1;
                    let scale = 100 / count;
                    return width * scale * i / 100;
                })
                .y0(me.zoomSvg.node().clientHeight - 20)
                .y1((d, i) => {
                    //获取画布容器宽度
                    let height = me.zoomSvg.node().clientHeight - 20;
                    return height * (1 - scale(dataset[i]) / 100);
                })
                .interpolate("monotone");

            //把path扔到容器中，并给d赋属性
            let lineContainer = me.zoomSvg.append("g").attr("class", "zoom-line-container");
            lineContainer.append("path")
                .attr({
                    "class": "data-zoom-area",
                    "d": lineFunction(dataset)
                });
            //窗口变化时重绘曲线
            windowResize.push(() => {
                me.zoomSvg.select(".data-zoom-area").attr("d", lineFunction(dataset));
            });
        },
        //绘制数据区域操作控件
        _showZoomBar: function () {
            let me = this;

            //拖动事件
            let drag = d3.behavior.drag()
                .on("drag", function (d) {
                    let xPos = d3.event.x;
                    let width = me.zoomSvg.node().clientWidth - 20;
                    let posScale = xPos / width * 100;
                    if (d.type == "start") {
                        if (xPos > 0) {
                            xPos = xPos - 5;
                        } else {
                            xPos = -5;
                        }
                        if (posScale > me.dataZoom.end) {
                            xPos = me.dataZoom.end / 100 * width;
                        }
                        me.dataZoom.start = xPos / width * 100;
                    } else if (d.type == "end") {
                        if (xPos < width) {
                            xPos = xPos - 5;
                        } else {
                            xPos = width - 5;
                        }
                        if (posScale < me.dataZoom.start) {
                            xPos = me.dataZoom.start / 100 * width;
                        }
                        me.dataZoom.end = xPos / width * 100;
                    }
                    //当前控件
                    d3.select(this)
                        .attr({
                            "x": xPos
                        });
                    //调整数据区域
                    d3.select(me.element)
                        .select(".data-zoom")
                        .attr({
                            "width": ()=> {
                                if (d.type == "start") {
                                    return width * (me.dataZoom.end - xPos / width * 100) / 100;
                                } else if (d.type == "end") {
                                    return width * (xPos / width * 100 - me.dataZoom.start) / 100;
                                }
                            },
                            "x": d.type == "start" ? xPos : width * me.dataZoom.start / 100
                        });

                    me._updateDataZoom();
                });

            let width = me.zoomSvg.node().clientWidth - 20;
            //数据区域控件
            me.zoomSvg.append("rect")
                .attr({
                    "class": "data-zoom",
                    "width": width * (me.dataZoom.end - me.dataZoom.start) / 100,
                    "x": width * me.dataZoom.start / 100 + 5,
                    "y": 0
                });

            //数据起始控件
            me.zoomSvg.append("rect")
                .datum({
                    type: "start"
                })
                .attr({
                    "class": "data-zoom-bar",
                    "x": width * me.dataZoom.start / 100 + 5,
                    "y": 0
                })
                .call(drag);
            //数据结束控件
            me.zoomSvg.append("rect")
                .datum({
                    type: "end"
                })
                .attr({
                    "class": "data-zoom-bar",
                    "x": width * me.dataZoom.end / 100 - 5,
                    "y": 0
                })
                .call(drag);
        },
        //更新数据区域
        _updateDataZoom: function () {
            let me = this;

            //存入当前数据范围
            let min = Math.trunc(me.config[0].dataAll.length * (me.dataZoom.start / 100));
            let max = Math.trunc(me.config[0].dataAll.length * (me.dataZoom.end / 100));
            if (me.dataZoom.minIndex == min && me.dataZoom.maxIndex == max) {
                //数据没有更新
                return;
            }

            //图表容器
            let element = me.element;
            let chartContainer = d3.select(element);
            //检查元素是否合法
            if (!chartContainer.node()) {
                me._exception(`没有找到${element}元素`);
            }
            //绘制画布前，如果有画布则清空画布容器
            try {
                chartContainer.select(".svg-container").select(".svg-view").remove();
            } catch (e) {
            }

            //添加SVG画布
            me.svg = d3.select(element)
                .select(".svg-container")
                .insert("svg", ".data-zoom-view")
                .attr({
                    "class": "svg-view",
                    "width": "100%",
                    "height": "80%"
                });
            me.dataZoom.minIndex = min;
            me.dataZoom.maxIndex = max;
            let configData = me.config[0].dataAll;
            let limitData = [];
            for (let [i, v] of configData.entries()) {
                if (i >= min && i <= max) {
                    limitData.push(v);
                }
            }
            me.config[0].data = limitData;
            //数据初始化
            me.xAxis[0].data = undefined;
            me.yAxis[0].data = undefined;

            //获取坐标轴数据
            me._getAxisData();
            //绘制坐标轴
            me._initAxis();
            //绘制图表
            for (let [index, config] of me.config.entries()) {
                if (config.type == "bar") {
                    me.hoverCursorType = "bar";
                    //绘制柱形图图表
                    me._showBarCharts(index, config);
                } else if (config.type == "line") {
                    //绘制折线图图表
                    me._showLineCharts(index, config);
                } else if (config.type == "scatter") {
                    //绘制散点图图表
                    me._showScatterCharts(index, config);
                }
            }
        },

        //标尺控制
        _cursorCtrl: function (config, scale, dataset) {
            let me = this;
            let type = me.hoverCursorType;
            let yAxis = me.yAxis;
            let xAxis = me.xAxis;
            let bottom = "X";
            for (let item of yAxis.values()) {
                if (item.type == "category") {
                    bottom = "Y";
                    break;
                }
            }
            //是否显示鼠标悬浮时的效果
            if (me.hoverCursor || me.hoverText) {
                let index = 0;
                let cursorClass = type == "line" ? "line-hover-cursor" : "hover-cursor";
                me.svg.on("mousemove", ()=> {
                    //获取鼠标位置和容器宽度
                    let pointerConf = me._getPointerConf();
                    //已移出容器
                    if (pointerConf.x < 0 || pointerConf.x > pointerConf.w) {
                        me._makeCursor(scale, index, "hidden", cursorClass, false, bottom);
                        if (me.hoverText) {
                            me._hideHoverText();
                        }
                        return;
                    }
                    let pos = 0;
                    if (bottom == "X") {
                        pos = pointerConf.x / pointerConf.w * 100;
                    } else {
                        pos = pointerConf.y / pointerConf.h * 100;
                    }
                    //第几条数据
                    index = Math.trunc(Math.abs(pos) / scale);
                    //index数值限制
                    index = index >= dataset.length ? dataset.length - 1 : index;
                    if (me.hoverText) {
                        let params = [];
                        for (let item of config.values()) {
                            let hoverIndex = index;
                            if (bottom == "Y") {
                                hoverIndex = (dataset.length - 1) - index;
                                if (yAxis[item.yAxis].flip) {
                                    hoverIndex = index;
                                }
                            } else {
                                if (xAxis[item.xAxis].flip) {
                                    hoverIndex = (dataset.length - 1) - index;
                                }
                            }
                            //原始数据
                            let orgData = item.data;
                            let key = orgData[hoverIndex].x;
                            let value = orgData[hoverIndex].y;
                            params.push({
                                name: item.name,
                                x: key,
                                y: value,
                                index: index,
                                color: item.color
                            });
                        }
                        me._showHoverText(params);
                    }

                    me._makeCursor(scale, index, "visible", cursorClass, false, bottom);
                });
                me.svg.on("mouseout", ()=> {
                    //获取鼠标位置和容器宽度
                    let pointerConf = me._getPointerConf();
                    //已移出容器
                    if (pointerConf.x < 0 || pointerConf.x > pointerConf.w || pointerConf.y < 0 || pointerConf.y > pointerConf.h) {
                        me._makeCursor(scale, index, "hidden", cursorClass, false, bottom);
                        if (me.hoverText) {
                            me._hideHoverText();
                        }
                    }
                });
            }
            //点击显示标尺
            if (me.clickCursor) {
                me.svg.on("click", ()=> {
                    //获取鼠标位置和容器宽度
                    let pointerConf = me._getPointerConf();
                    //已移出容器
                    if (pointerConf.x < 0 || pointerConf.x > pointerConf.w) {
                        return;
                    }
                    let pos = 0;
                    if (bottom == "X") {
                        pos = pointerConf.x / pointerConf.w * 100;
                    } else {
                        pos = pointerConf.y / pointerConf.h * 100;
                    }
                    let index = Math.trunc(pos / scale);
                    //index数值限制
                    index = index >= dataset.length ? dataset.length - 1 : index;
                    let bind = (me.clickCursor && me.clickCursor.length > 0) ? me.clickCursor : false;
                    me._makeCursor(scale, index, "visible", "chart-cursor", bind, bottom, dataset.length - 1);
                })
            }
        },
        //获取鼠标位置和容器宽度
        _getPointerConf: function () {
            let me = this;
            //获取鼠标相对于container的位置
            let x = d3.mouse(me.svg.node())[0];
            let y = d3.mouse(me.svg.node())[1];
            //取container容器宽度
            let w = me.svg.node().clientWidth - me.padding.left - me.padding.right;
            let h = me.svg.node().clientHeight - me.padding.top - me.padding.bottom;

            return {x, y, w, h};
        },

        //创建标尺
        _makeCursor: function (scale, i, visibility, className, isBind, bottom, dataLength) {

            let me = this;
            let ele = me.svg;

            //标尺对象
            let cursor = {};
            if (ele.selectAll("." + className)[0].length > 0) {
                cursor = ele.selectAll("." + className).attr({
                    //曲线图，向左平移半格
                    "x": () => {
                        if (bottom == "X") {
                            return (className != "line-hover-cursor" ? scale * i : scale * i + scale / 2) + "%";
                        }
                        return 0;
                    },
                    "y": () => {
                        if (bottom == "X") {
                            return 0;
                        }
                        return (className != "line-hover-cursor" ? scale * i : scale * i + scale / 2) + "%";
                    },
                    visibility: visibility
                });
            } else {
                //绘制标尺
                cursor = ele.append("rect")
                    .attr({
                        "class": className,
                        //曲线图，向左平移半格
                        "x": () => {
                            if (bottom == "X") {
                                return (className != "line-hover-cursor" ? scale * i : scale * i + scale / 2) + "%";
                            }
                            return 0;
                        },
                        "y": () => {
                            if (bottom == "X") {
                                return 0;
                            }
                            return (className != "line-hover-cursor" ? scale * i : scale * i + scale / 2) + "%";
                        },
                        "width": () => {
                            if (bottom == "X") {
                                if (className == "line-hover-cursor") {
                                    return 1;
                                }
                                return scale + "%";
                            }
                            return "100%";
                        },
                        "height": () => {
                            if (bottom == "X") {
                                return "100%";
                            }
                            if (className == "line-hover-cursor") {
                                return 1;
                            }
                            return scale + "%";
                        },
                        "visibility": visibility
                    });
            }
            //绑定图表联动
            if (isBind) {
                for (let item of me.clickCursor.values()) {
                    let yAxis = item.yAxis;
                    let btm = "X";
                    let index = i;
                    for (let axis of yAxis.values()) {
                        if (axis.type == "category") {
                            btm = "Y";
                        }
                    }
                    if (btm != bottom) {
                        index = dataLength - i;
                    }
                    item._makeCursor(scale, index, visibility, className, false, btm);
                }
            }
            return cursor;
        },
        //鼠标悬浮显示数据
        _showHoverText: function (param) {
            let me = this;
            //文字内容
            let text = [];

            if (param instanceof Array) {
                for (let item of param.values()) {
                    text.push(me.hoverText(item));
                }
            } else {
                text = me.hoverText(param);
            }

            //创建或修改文字
            let svgContainer = d3.selectAll(me.element).select(".svg-container");
            let hoverText = svgContainer.selectAll(".hover-text");
            if (hoverText[0].length <= 0) {
                hoverText = svgContainer.append("div")
                    .attr({
                        "class": "hover-text"
                    });
                if (text instanceof Array) {
                    for (let [i, value] of text.entries()) {
                        let p = hoverText.append("p");
                        if (text.length > 1 && param[i].color) {
                            p.append("i").style("background-color", param[i].color);
                        }
                        p.append("span").datum(i).text(value);
                    }
                } else {
                    hoverText.text(text);
                }
            } else {
                if (text instanceof Array) {
                    hoverText.selectAll("p")
                        .selectAll("span")
                        .text((d)=> text[d]);
                } else {
                    hoverText.text(text);
                }
            }
            //控制文字位置
            let x = d3.mouse(svgContainer.node())[0];
            let y = d3.mouse(svgContainer.node())[1];
            let textWidth = hoverText.node().clientWidth;
            let textHeight = hoverText.node().clientHeight;
            let svgContainerWidth = svgContainer.node().clientWidth;
            let svgContainerHeight = svgContainer.node().clientHeight;
            //超过容器则修正位置
            if (textWidth + x + 10 > svgContainerWidth) {
                x = svgContainerWidth - textWidth - 20;
            }
            if (textHeight + y + 5 > svgContainerHeight) {
                y = svgContainerHeight - textHeight - 5;
            }
            hoverText
                .style({
                    visibility: "visible",
                    top: y + 5 + "px",
                    left: x + 10 + "px"
                });
        },
        //鼠标离开隐藏数据
        _hideHoverText: function () {
            let me = this;
            let svgContainer = d3.select(me.element).select(".svg-container");
            let hoverText = svgContainer.selectAll(".hover-text");
            if (hoverText[0].length > 0) {
                hoverText.style({"visibility": "hidden"});
            }
        },
        //注册事件
        _eventRegister: function (ele, config, eleType) {
            let me = this;
            let type = me.config[0].type;
            //注册点击事件
            if (config.onClick) {
                ele.on("click", (d, i) => {
                    config.onClick({
                        value: d,
                        index: i
                    });
                });
            }
            //添加动画
            if (eleType == "circle" && config.pinch) {
                ele.attr("class", ele.attr("class") + " point-pinch");
            }
            //注册鼠标悬浮事件
            if (config.onMouseover || config.pinch) {
                ele.on("mouseover", function (d, i) {
                    //动画效果
                    if (eleType == "circle" && config.pinch) {
                        let orgR = d3.select(this).attr("r");
                        d3.select(this).attr("r", Number.parseFloat(orgR) + 2);
                    }
                    if (config.onMouseover) {
                        config.onMouseover({
                            value: d,
                            index: i
                        });
                    }
                });
            }
            //注册鼠标离开事件
            if (config.onMouseout || config.pinch
                || ((type == "scatter" || type == "map-scatter") && me.hoverText)) {

                ele.on("mouseout", function (d, i) {
                    //动画效果
                    if (eleType == "circle" && config.pinch) {
                        let orgR = d3.select(this).attr("r");
                        d3.select(this).attr("r", Number.parseFloat(orgR) - 2);
                    }

                    //悬浮提示
                    if ((type == "scatter" || type == "map-scatter") && me.hoverText) {
                        me._hideHoverText();
                    }
                    if (config.onMouseout) {
                        config.onMouseout({
                            value: d,
                            index: i
                        });
                    }
                });
            }

            //注册鼠标移动事件
            if (config.onMousemove
                || ((type == "scatter" || type == "map-scatter") && me.hoverText)) {
                ele.on("mousemove", function (d, i) {
                    //悬浮提示
                    if ((type == "scatter" || type == "map-scatter") && me.hoverText) {
                        me._showHoverText(d);
                    }

                    if (config.onMousemove) {
                        config.onMousemove({
                            value: d,
                            index: i
                        });
                    }
                });
            }
        },
        //抛出异常
        _exception: function (content) {
            throw content;
        }
    }
}
