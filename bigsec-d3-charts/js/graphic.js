'use strict';
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
//绘制图形类
function Graphic() {
    return {
        //资源路径
        resourcePath: "resources/",
        //画布
        svg: undefined,
        //画布属性
        svgProp: {},
        //图表配置
        config: {},
        //画布绘制的位置
        element: "",
        //绘制图形标注
        type: "",
        //图表容器
        graphContainer: "",
        //绘制画布
        _svgInit: function (element, config) {
            let me = this;
            try {
                d3.select(element).select(".svg-container").remove();
            } catch (e) {
            }

            if (me.config.cursor && !config.cursor) {
                config.cursor = me.config.cursor;
            }
            me.config = config;
            me.element = element;
            //绑定元素互绑
            let cursor = config.cursor;
            if (cursor && cursor.length > 0) {
                for (let item of cursor.values()) {
                    if (item.config.cursor && item.config.cursor.length > 0) {
                        if (item.config.cursor.indexOf(me) < 0) {
                            item.config.cursor.push(me);
                        }
                    } else {
                        item.config.cursor = [me];
                    }
                }
            }
            //画布大小
            let contentHeight = config.height ? config.height : 0;

            //添加SVG画布
            me.svg = d3.select(element)
                .append("div")
                .attr("class", "svg-container")
                .append("svg")
                .attr({
                    "class": "svg-view",
                    "width": "100%",
                    "height": contentHeight
                });
            let paddingLeft = 0;
            let paddingRight = 0;
            //自定义画布padding
            if (config.padding) {
                let padding = config.padding;
                if (padding.top !== undefined) {
                    me.svg.style("padding-top", padding.top + "px");
                    contentHeight -= padding.top;
                } else {
                    contentHeight -= 20;
                }
                if (padding.right !== undefined) {
                    me.svg.style("padding-right", padding.right + "px");
                    paddingRight += padding.right;
                } else {
                    paddingRight += 30;
                }
                if (padding.bottom !== undefined) {
                    me.svg.style("padding-bottom", padding.bottom + "px");
                    contentHeight -= padding.bottom;
                } else {
                    contentHeight -= 20;
                }
                if (padding.left !== undefined) {
                    me.svg.style("padding-left", padding.left + "px");
                    paddingLeft += padding.left;
                } else {
                    paddingLeft += 30;
                }
            } else {
                contentHeight -= 40;
            }

            return {contentHeight, paddingLeft, paddingRight};
        },
        //绘制柱形图
        showRectGraph: function (element, config) {
            let me = this;
            //当前对象为柱形图
            me.type = "rect";
            config.xAxisPos = config.xAxisPos ? config.xAxisPos : "bottom";
            config.yAxisPos = config.yAxisPos ? config.yAxisPos : "left";
            //绘制画布
            me.svgProp = me._svgInit(element, config);
            //画布高度
            let height = me.svgProp.contentHeight;
            //图表数据
            let fullData = config.data[0];
            //柱形图数据
            let dataset = [];
            //具体数据集
            let dataAll = [];
            //x轴坐标数据
            let xAxisData = [];
            //重新组装数据
            for (let i in fullData) {
                dataAll.push({
                    x: i,
                    y: fullData[i]
                });
                dataset.push(fullData[i]);
                xAxisData.push(i);
            }
            //y轴的比例尺
            let yScale = d3.scale.linear()
                .domain([0, Math.max(...dataset)])
                .range([height, 0]);
            //处理坐标轴
            me._axisDeal(yScale, config, xAxisData, dataset, height);

            let className = config.className ? config.className : "default-rect";
            let scale = 100 / dataset.length;
            //添加矩形元素
            me.graphContainer = me.svg.append("g")
                .attr("class", "rect-container");
            //标尺事件注册和控制
            me._cursorCtrl(config, scale, dataset);
            //矩形
            let rects = me.graphContainer.selectAll("rect")
                .data(dataAll)
                .enter()
                .append("rect")
                .attr({
                    "class": className,
                    "x": (d, i) => {
                        return scale * i + 0.5 + "%";
                    },
                    "y": d => yScale(d.y),
                    "width": d => {
                        if (config.xAxisPos == "top" || config.xAxisPos == "bottom") {
                            //两边0.25%的间隔
                            let width = scale - 1;
                            return width + "%";
                        } else {
                            return height - yScale(d.y);
                        }
                    },
                    "height": d => {
                        if (config.yAxisPos == "left" || config.yAxisPos == "right") {
                            return height - yScale(d.y);
                        } else {
                            //两边0.25%的间隔
                            let width = scale - 1;
                            return width + "%";
                        }
                    }
                });
            //柱形无缩放事件
            config.pinch = false;
            //注册事件
            me._eventRegister(rects, config, "");

        },
        //更新柱形图
        updateRectGraph: function (data) {
            let me = this;
            if (!data) {
            } else {
                me.config.data = data;
            }
            me.showRectGraph(me.element, me.config);
        },
        //显示曲线图
        showLineGraph: function (element, config) {

            let me = this;
            //类型曲线图
            me.type = "line";
            //绘制画布
            //绘制画布
            me.svgProp = me._svgInit(element, config);
            //画布高度
            let height = me.svgProp.contentHeight;

            //图表数据
            let dataCollection = config.data;
            //曲线图Y轴数据
            let yAxisData = [];
            let yScale = {};
            //x轴坐标数据
            let xAxisData = [];
            for (let item of dataCollection.values()) {
                //重新组装数据
                for (let i in item) {
                    yAxisData.push(item[i]);
                    if (!xAxisData.includes(i)) {
                        xAxisData.push(i);
                    }
                }
            }
            //y轴的比例尺
            yScale = d3.scale.linear()
                .domain([0, Math.max(...yAxisData)])
                .range([height, 0]);
            //绘制坐标轴
            me._axisDeal(yScale, config, xAxisData, yAxisData, height);

            //绘图
            for (let [index, fullData] of dataCollection.entries()) {
                me._makeLine(fullData, yScale, config, index);
            }
            let scale = 100 / xAxisData.length;
            //标尺控制
            me._cursorCtrl(config, scale, xAxisData);
        },
        //更新曲线图
        updateLineGraph: function (data) {
            let me = this;
            if (data) {
                me.config.data = data;
            }
            me.showLineGraph(me.element, me.config);
        },

        //显示散点图
        showPointGraph: function (element, config) {

            let me = this;
            //类型曲线图
            me.type = "point";
            //绘制画布
            me.svgProp = me._svgInit(element, config);
            //画布高度
            let height = me.svgProp.contentHeight;

            //图表数据
            //let dataCollection = config.data;
            ////曲线图Y轴数据
            //let yAxisData = [];
            //let yScale = {};
            ////x轴坐标数据
            //let xAxisData = [];
            //for (let item of dataCollection.values()) {
            //    //重新组装数据
            //    for (let i in item) {
            //        yAxisData.push(item[i]);
            //        if (xAxisData.indexOf(i) < 0) {
            //            xAxisData.push(i);
            //        }
            //    }
            //}
            ////y轴的比例尺
            //yScale = d3.scale.linear()
            //    .domain([0, Math.max(...yAxisData)])
            //    .range([height, 0]);
            ////绘制坐标轴
            //me._axisDeal(yScale, config, xAxisData, yAxisData, height);

            //图表数据
            let fullData = config.data[0];
            //Y轴坐标数据
            let yAxisData = [];
            //x轴坐标数据
            let xAxisData = [];
            //散点数据
            let pointData = [];
            //数据大小集合，用于限制散点大小
            let datas = [];
            //重新组装数据
            let i = 0;
            for (let item in fullData) {
                yAxisData.push(item);
                let partData = fullData[item];
                //拼装xy轴数据与数据数值
                for (let [index, value] of partData.entries()) {
                    if (!xAxisData.includes(value.mark)) {
                        xAxisData.push(value.mark);
                    }
                    pointData.push({
                        x: i,
                        y: index,
                        value: value.value
                    });
                    datas.push(value.value);
                }
                i++;
            }
            for (let item of pointData.values()) {
                item["xValue"] = xAxisData[item.x];
                item["yValue"] = yAxisData[item.y];
            }
            //y轴的比例尺
            let yScale = {};
            //绘制坐标轴
            me._axisDeal(yScale, config, xAxisData, yAxisData, height);
            //散点图大小比例尺
            let pointSize = config.pointSize === undefined ? 15 : config.pointSize;
            let pointScale = d3.scale.linear()
                .domain([0, Math.max(...datas)])
                .range([0, pointSize]);
            //数据容器
            let point = me.svg.append("g")
                .attr("class", "point-container")
                .selectAll(".point-container")
                .data(pointData)
                .enter()
                .append('circle')
                .attr({
                    "class": "point-item",
                    "cx": d => {
                        //一共多少项
                        let count = xAxisData.length;
                        //缩放
                        let scale = 100 / count;
                        return d.x * scale + "%";
                    },
                    "cy": d => {
                        //一共多少项
                        let count = yAxisData.length;
                        //缩放
                        let scale = 100 / count;
                        return (100 - d.y * scale) + "%";
                    },
                    "r": d => pointScale(d.value)
                });

            //默认添加动画
            config.pinch = config.pinch === undefined ? true : config.pinch;
            //注册事件
            me._eventRegister(point, config, "circle");

        },
        //更新散点图
        updatePointGraph: function (data) {
            let me = this;
            if (data) {
                me.config.data = data;
            }
            me.showPointGraph(me.element, me.config);
        },
        //显示地图
        showMapGraph: function (element, config) {
            let me = this;

            //类型曲线图
            me.type = "map";
            config.padding = {top: 0, right: 0, bottom: 0, left: 0};
            //绘制画布
            me._svgInit(element, config);
            let width = me.svg.node().clientWidth;
            let height = config.height;
            let map = me.svg.append("g")
                .attr("class", "map-container");

            //绘制地图
            d3.json(me.resourcePath + config.mapPath, (error, root) => {

                if (error) {
                    return console.error(error);
                }

                //获取经纬度最大最小值
                let lngLat = me._getGeoLngLat(root.features);
                //console.log(lngLat.maxLng + "-----" + lngLat.minLng + "----" + lngLat.maxLat + "-----" + lngLat.minLat);

                let projection = d3.geo.mercator()
                    .center([(lngLat.maxLng - lngLat.minLng) / 2 + lngLat.minLng, (lngLat.maxLat - lngLat.minLat) / 2 + lngLat.minLat])
                    .scale(width)
                    .translate([width / 2, height / 2]);

                let path = d3.geo.path()
                    .projection(projection);

                let initTran = projection.translate();
                let initScale = projection.scale();

                //缩放拖动事件
                let zoom = d3.behavior.zoom()
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
                //注册缩放事件
                map.append("rect")
                    .attr({
                        "class": "map-bg",
                        "x": 0,
                        "y": 0,
                        "height": height
                    })
                    .call(zoom);
                map.selectAll("g")
                    .data(root.features)
                    .enter()
                    .append("path")
                    .attr({
                        "class": "map-province",
                        "d": path
                    })
                    .call(zoom);
                //绘制散点
                me._mapPointDeal(config, projection);
            });
        },
        //更新地图
        updateMapGraph: function (data) {
            let me = this;
            if (data) {
                me.config.data = data;
            }
            me.showMapGraph(me.element, me.config);
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
            let pointSize = config.pointSize === undefined ? 15 : config.pointSize;
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
                        let item = data[i];
                        let proPeking = projection([item[0], item[1]]);
                        return proPeking[0];
                    })
                    .attr("cy", (d, i) => {
                        let item = data[i];
                        let proPeking = projection([item[0], item[1]]);
                        return proPeking[1];
                    });
            } else {
                let circleContainer = me.svg.append("g").attr("class", "map-point");
                //初次绘制散点数据
                for (let value of data.values()) {
                    let proPeking = projection([value[0], value[1]]);
                    //如果有安全值则显示动画
                    if (config.safeLine !== undefined && value[2] > config.safeLine) {
                        me._createCircleAnimate(circleContainer, proPeking, pointScale, value);
                    }
                    //绘制数据圆点
                    circleContainer.append("circle")
                        .datum({
                            lng: value[0],
                            lat: value[1],
                            value: value[2]
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
        //创建圆圈动画
        _createCircleAnimate: function (circleContainer, proPeking, pointScale, item) {
            for (let i = 0; i < 3; i++) {
                //添加动画
                let circle = circleContainer.append("circle")
                    .datum({
                        lng: item[0],
                        lat: item[1],
                        value: item[2]
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
                        "to": pointScale(item[2]) + 9,
                        "begin": i + "s",
                        "dur": "1s",
                        "repeatCount": "indefinite"
                    });
                //渐变消失
                circle.append("animate")
                    .attr({
                        "attributeName": "opacity",
                        "from": 1,
                        "to": 0,
                        "begin": i + "s",
                        "dur": "1s",
                        "repeatCount": "indefinite"
                    });
            }
        },
        //获取地图中心位置，以左上角为中心
        _getGeoLngLat: function (features) {
            //经度最小值
            let minLng = "";
            //经度最大值
            let maxLng = "";
            //纬度最小值
            let minLat = "";
            //纬度最大值
            let maxLat = "";
            for (let value of features.values()) {
                //省份
                let provinceCoord = value.geometry.coordinates[0];
                for (let item of provinceCoord.values()) {
                    //获取经度最小值
                    if (minLng === "" || minLng > item[0]) {
                        minLng = item[0];
                    }
                    //获取经度最大值
                    if (maxLng === "" || maxLng < item[0]) {
                        maxLng = item[0];
                    }
                    //获取纬度最大值
                    if (minLat === "" || minLat > item[1]) {
                        minLat = item[1];
                    }
                    //获取纬度最大值
                    if (maxLat === "" || maxLat < item[1]) {
                        maxLat = item[1];
                    }
                }
            }
            return {minLng, maxLng, minLat, maxLat};
        },
        //绘制曲线图
        _makeLine: function (fullData, yScale, config, index) {
            let me = this;
            //曲线图数据
            let dataset = [];
            //具体数据集
            let dataAll = [];
            //重新组装数据
            for (let i in fullData) {
                dataAll.push({
                    x: i,
                    y: fullData[i],
                    dataIndex: index
                });
                dataset.push(fullData[i]);
            }

            //曲线生成器
            let lineFunction = d3.svg.line()
                .x((d, i) => {
                    let count = dataset.length;
                    let scale = 100 / count;
                    //获取画布容器宽度
                    let width = me.svg.node().clientWidth;
                    return (width - me.svgProp.paddingLeft - me.svgProp.paddingRight) * scale * i / 100;
                })
                .y(d => yScale(d))
                .interpolate("monotone");

            let dataColor = "";
            if (config.dataColor) {
                dataColor = config.dataColor[index] ? config.dataColor[index] : "";
            }
            //把path扔到容器中，并给d赋属性
            me.graphContainer = me.svg.append("g").attr("class", "line-container_" + index);
            me.graphContainer.append("path")
                .style({
                    "stroke": dataColor
                })
                .attr({
                    "class": "data-line line_" + index,
                    "d": lineFunction(dataset)
                });
            let point = me.graphContainer.selectAll('circle')
                .data(dataAll)
                .enter()
                .append('circle')
                .style({
                    "stroke": dataColor
                })
                .attr({
                    "class": "line-circle",
                    "r": 2.5,
                    "cx": (d, i) => {
                        let count = dataset.length;
                        let scale = 100 / count;
                        return scale * i + "%";
                    },
                    "cy": d => yScale(d.y)
                });
            //默认添加动画
            config.pinch = config.pinch === undefined ? true : config.pinch;
            //注册事件
            me._eventRegister(point, config, "circle");
            //窗口变化时重绘曲线
            windowResize.push(() => {
                me.svg.select(".data-line.line_" + index).attr("d", lineFunction(dataset))
            });
        },
        //处理坐标轴
        _axisDeal: function (yScale, config, xAxisData, dataset, height) {
            let me = this;
            //处理x轴
            me._xAxisDeal(config, xAxisData, height);
            //散点图自定义Y轴
            if (me.type == "point") {
                //处理y轴
                me._yAxisDeal(config, dataset);
                //绘制y轴
                me.svg.append("rect")
                    .attr({
                        "class": "y-axis-line"
                    });
            } else {
                //标准Y轴
                me._yAxis(yScale);
            }
            //绘制x轴
            me.svg.append("rect")
                .attr({
                    "class": "x-axis-line",
                    "width": "100%",
                    "transform": "translate(0," + (height - 0.5) + ")"
                });
        },
        //处理X轴
        _xAxisDeal: function (config, xAxisData, height) {
            let me = this;

            let xDistance = config.xDistance >= 1 ? config.xDistance : 1;
            //一共多少项
            let count = xAxisData.length;
            //缩放
            let scale = 100 / count;
            //添加x轴文字和刻度
            let x = me.svg.append("g")
                .attr("class", "x-axis")
                .selectAll("g")
                .data(xAxisData)
                .enter();
            //绘制x轴网格
            x.append('line')
                .attr({
                    "class": "net-line",
                    "x1": (d, i) => scale * i + "%",
                    "y1": 0,
                    "x2": (d, i) => scale * i + "%",
                    "y2": (b, i) => (i % xDistance == 0) ? height : 0
                });
            //是否绘制x轴
            let showXAxis = config.xAxis === undefined ? true : config.xAxis;
            if (showXAxis) {
                //绘制x轴文字
                x.append('text')
                    .attr({
                        "class": "x-axis-text",
                        "x": (d, i) => {
                            let pos = scale * i;
                            return pos + "%";
                        },
                        "y": height + 18 + "px"
                    })
                    .text((b, i) => (i % xDistance == 0) ? b : "");
                //绘制x轴刻度
                x.append('line')
                    .attr({
                        "class": "x-axis-mark",
                        "x1": (d, i) => scale * i + "%",
                        "y1": height,
                        "x2": (d, i) => scale * i + "%",
                        "y2": (b, i) => (i % xDistance == 0) ? height + 6 : height
                    });
            }
        },

        //处理个性化Y轴
        _yAxisDeal: function (config, yAxisData) {
            let me = this;

            let yDistance = config.yDistance >= 1 ? config.yDistance : 1;
            //一共多少项
            let count = yAxisData.length;
            //缩放
            let scale = 100 / count;
            //添加x轴文字和刻度
            let y = me.svg.append("g")
                .attr("class", "y-axis")
                .selectAll("g")
                .data(yAxisData)
                .enter();
            //绘制x轴网格
            y.append('line')
                .attr({
                    "class": "net-line",
                    "x1": 0,
                    "y1": (d, i) => (100 - scale * i) + "%",
                    "x2": (b, i) => (i % yDistance == 0) ? "100%" : 0,
                    "y2": (d, i) => (100 - scale * i) + "%"
                });
            //绘制y轴文字
            y.append('text')
                .attr({
                    "class": "y-axis-text",
                    "x": "-9px",
                    "y": (d, i) => (100 - scale * i) + "%"
                })
                .text((b, i) => (i % yDistance == 0) ? b : "");
            //绘制y轴刻度
            y.append('line')
                .attr({
                    "class": "y-axis-mark",
                    "x1": 0,
                    "y1": (d, i) => (100 - scale * i) + "%",
                    "x2": (d, i) => (i % yDistance == 0) ? "-6px" : 0,
                    "y2": (d, i) => (100 - scale * i) + "%"
                });

        },
        //标准Y轴
        _yAxis: function (yScale) {
            let me = this;
            //定义y轴
            let yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");

            //添加y轴
            me.svg.append("g")
                .attr("class", "axis")
                .call(yAxis);
            //绘制网格
            me.svg.selectAll("g")
                .append('line')
                .attr({
                    "class": "net-line",
                    "x1": 0,
                    "y1": 0,
                    "x2": "100%",
                    "y2": 0
                });

        },
        //创建标尺
        _makeCursor: function (scale, i, display, className, isBind) {

            let me = this;
            let type = me.type;
            let ele = me.graphContainer;
            let config = me.config;

            //画布内容高度
            let height = me.svgProp.contentHeight;

            //标尺对象
            let cursor = {};
            if (ele.selectAll("." + className)[0].length > 0) {
                cursor = ele.selectAll("." + className).attr({
                    //曲线图，向左平移半格
                    "x": () => ((type == "line" && className != "line-hover-cursor") ? scale * i - scale / 2 : scale * i) + "%",
                    display: display
                });
            } else {
                //绘制标尺
                cursor = ele.append("rect")
                    .attr({
                        "class": className,
                        //曲线图，向左平移半格
                        "x": () => ((type == "line" && className != "line-hover-cursor") ? scale * i - scale / 2 : scale * i) + "%",
                        "y": 0,
                        "width": () => scale + "%",
                        "height": d =>  height,
                        "display": display
                    });
            }
            //绑定图表联动
            if (isBind) {
                for (let item of config.cursor.values()) {
                    item._makeCursor(scale, i, display, className, false);
                }
            }
            return cursor;
        },
        //标尺控制
        _cursorCtrl: function (config, scale, dataset) {
            let me = this;
            let type = me.type;
            let svgProp = me.svgProp;
            //图表容器
            let container = me.graphContainer;
            //是否显示鼠标悬浮时的效果
            if (config.hoverCursor || config.hoverText) {
                let index = 0;
                let cursorClass = type == "line" ? "line-hover-cursor" : "hover-cursor";
                me.svg.on("mousemove", ()=> {
                    //获取鼠标位置和容器宽度
                    let pointerConf = me._getPointerConf(container, svgProp, scale);
                    //已移出容器
                    if (pointerConf.x < 0 || pointerConf.x > pointerConf.w) {
                        me._makeCursor(scale, index, "none", cursorClass);
                        if (config.hoverText) {
                            me._hideHoverText();
                        }
                        return;
                    }
                    let pos = pointerConf.x / pointerConf.w * 100;
                    //第几条数据
                    index = Math.trunc(pos / scale);
                    //index数值限制
                    index = index >= dataset.length ? dataset.length - 1 : index;
                    if (config.hoverText) {
                        let params = [];
                        //原始数据
                        let orgData = config.data;
                        for (let item of orgData.values()) {
                            //获取x、y轴数据
                            let key = Object.keys(item)[index];
                            let value = item[key];
                            params.push({
                                x: key,
                                y: value,
                                index: index
                            })
                        }
                        me._showHoverText(params);
                    }

                    me._makeCursor(scale, index, "block", cursorClass);
                });
                me.svg.on("mouseout", ()=> {
                    //获取鼠标位置和容器宽度
                    let pointerConf = me._getPointerConf(container, svgProp, scale);
                    let y = d3.mouse(container.node())[1];
                    let h = svgProp.contentHeight;
                    //已移出容器
                    if (pointerConf.x < 0 || pointerConf.x > pointerConf.w || y < 0 || y > h) {
                        me._makeCursor(scale, index, "none", cursorClass);
                        if (config.hoverText) {
                            me._hideHoverText();
                        }
                    }
                });
            }
            //点击显示标尺
            if (config.cursor) {
                me.svg.on("click", ()=> {
                    //获取鼠标位置和容器宽度
                    let pointerConf = me._getPointerConf(container, svgProp, scale);
                    //已移出容器
                    if (pointerConf.x < 0 || pointerConf.x > pointerConf.w) {
                        return;
                    }
                    let pos = pointerConf.x / pointerConf.w * 100;
                    let index = Math.trunc(pos / scale);
                    //index数值限制
                    index = index >= dataset.length ? dataset.length - 1 : index;
                    let bind = (config.cursor && config.cursor.length > 0) ? config.cursor : false;
                    me._makeCursor(scale, index, "block", "chart-cursor", bind);
                })
            }
        },
        //鼠标悬浮显示数据
        _showHoverText: function (param) {
            let me = this;
            let config = me.config;
            //文字内容
            let text = [];

            if (param instanceof Array) {
                for (let item of param.values()) {
                    text.push(config.hoverText(item));
                }
            } else {
                text = config.hoverText(param);
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
                        if (config.dataColor) {
                            p.append("i").style("background-color", config.dataColor[i]);
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
                        .text(function (d) {
                            return text[d];
                        });
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
                    display: "block",
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
                hoverText.style({"display": "none"});
            }
        },
        //获取鼠标位置和容器宽度
        _getPointerConf: function (container, svgProp, scale) {
            let me = this;
            let type = me.type;
            //获取鼠标相对于container的位置
            let x = d3.mouse(container.node())[0];
            //取container容器宽度
            let w = me.svg.node().clientWidth - svgProp.paddingLeft - svgProp.paddingRight;
            //曲线图触发位置向左平移半格
            if (type == "line") {
                let perW = scale / 100 * w;
                x += perW / 2;
            }
            return {x, w};
        },
        //注册事件
        _eventRegister: function (ele, config, eleType) {
            let me = this;
            let type = me.type;
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
                || ((type == "point" || type == "map") && config.hoverText)) {

                ele.on("mouseout", function (d, i) {
                    //动画效果
                    if (eleType == "circle" && config.pinch) {
                        let orgR = d3.select(this).attr("r");
                        d3.select(this).attr("r", Number.parseFloat(orgR) - 2);
                    }

                    //悬浮提示
                    if ((type == "point" || type == "map") && config.hoverText) {
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
                || ((type == "point" || type == "map") && config.hoverText)) {
                ele.on("mousemove", function (d, i) {
                    //悬浮提示
                    if ((type == "point" || type == "map") && config.hoverText) {
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
        }
    }
}