/**
 * Created by jason on 16/7/7.
 */
;
{
    //创建柱状图对象
    let rectGraph = new Graphic();
    //创建曲线图对象
    let lineGraph = new Graphic();
    //创建图形对象
    let lineGraph2 = new Graphic();
    let rectData = {
        "09:00": "12",
        "10:00": "1",
        "11:00": "19",
        "12:00": "30",
        "13:00": "12",
        "14:00": "25",
        "15:00": "16",
        "16:00": "21",
        "17:00": "12",
        "18:00": "12",
        "19:00": "19",
        "20:00": "36",
        "21:00": "21",
        "22:00": "29",
        "23:00": "10",
        "24:00": "21"
    };
    let rectDataU = {
        "09:00": "11",
        "10:00": "12",
        "11:00": "10",
        "12:00": "10",
        "13:00": "22",
        "14:00": "21",
        "15:00": "16",
        "16:00": "31",
        "17:00": "12",
        "18:00": "42",
        "19:00": "19",
        "20:00": "26",
        "21:00": "21",
        "22:00": "29",
        "23:00": "30",
        "24:00": "1"
    };
    let flag = false;
    //绘制柱形图
    rectGraph.showRectGraph("#rect", {
        height: 200,
        data: [rectData],
        hoverCursor: true,
        hoverText: (params)=> params.x + "----" + params.y + "------"+ params.index,
        cursor: [lineGraph2, lineGraph],
        //cursor: true,
        //点击柱形
        onClick: function (params) {
            console.log(JSON.stringify(params));
            let data = rectDataU;
            if (flag) {
                data = rectData;
            }
            flag = !flag;
            //lineGraph.updateLineGraph(data);
            pointGraph.updatePointGraph([getTestPointData()]);
        },
        padding: {
            top: 10
        },
        //bind:[lineGraph2, lineGraph],
        //xAxis:false,
        xDistance: 1
    });

    //绘制曲线图
    lineGraph.showLineGraph("#line", {
        height: 200,
        data: [rectData],
        //点击柱形
        onClick: function (param) {
            console.log(JSON.stringify(param));
        },
        padding: {
            top: 10
        },
        hoverCursor: true,
        hoverText: (params)=> params.x + "----" + params.y,
        cursor: [rectGraph, lineGraph2],
        //bind:[rectGraph, lineGraph2],
        xDistance: 2
    });
    //绘制曲线图
    lineGraph2.showLineGraph("#line2", {
        height: 200,
        data: [rectData, rectDataU],
        dataColor: ["red", "#5282e0"],
        //点击柱形
        onClick: function (param) {
            console.log(JSON.stringify(param));
        },
        hoverText: (params)=> params.x + "----" + params.y,
        padding: {
            top: 10
        },
        //hoverCursor : true,
        //bind:[rectGraph, lineGraph],
        cursor: [rectGraph, lineGraph],
        xDistance: 2
    });
    //模拟数据
    function getTestPointData() {
        //模拟散点数据
        let pointData = {};
        let user = ["user01", "user02", "user03", "user04", "user05", "user06", "user07", "user08"];
        let date = ["06-01", "06-02", "06-03", "06-04", "06-05", "06-06", "06-07", "06-08"];
        for (let i = 0; i < user.length; i++) {
            pointData[user[i]] = [];
            for (let j = 0; j < date.length; j++) {
                pointData[user[i]].push({
                    mark: date[j],
                    value: Math.ceil(Math.random() * 10)
                });
            }
        }
        return pointData;
    }

    //创建图形对象
    let pointGraph = new Graphic();
    //绘制散点图
    pointGraph.showPointGraph("#point", {
        height: 300,
        data: [getTestPointData(), getTestPointData()],
        padding: {
            top: 10,
            left: 50
        },
        hoverText: (params)=> [params.xValue,params.yValue],
        pointColor: ["red", "#5282e0"],
        onMouseover: function(param) {
            //console.log(JSON.stringify(param));
        }
        //pointSize:10,
        //pinch:false
    });

    let map1 = new Graphic();
    map1.showMapGraph("#chinaMap", {
        height: 300,
        mapPath: "map-json/china.geo.json",
        //pointSize: 10,
        //safeLine: 6,
        data: [
            [118, 36, 9],
            [100, 33, 9],
            [108, 30, 7],
            [104, 37, 6],
            [114, 29, 2],
            [101, 25, 5],
            [116.7, 39.53, 5],
            [118, 25, 3]
        ],
        hoverText: (params)=> JSON.stringify(params),
        onClick: function (param) {
            console.log(JSON.stringify(param));
        }
    });
    let map2 = new Graphic();
    map2.showMapGraph("#chinaMap1", {
        height: 300,
        mapPath: "map-json/china.geo.json",
        //pointSize: 10,
        safeLine: 6,
        data: [
            [118, 36, 9],
            [117, 35, 9],
            [100, 33, 3],
            [108, 30, 7],
            [104, 37, 6],
            [114, 29, 2],
            [101, 25, 5],
            [116.7, 39.53, 5],
            [118, 25, 3]
        ]
    });
    let map3 = new Graphic();
    map3.showMapGraph("#chinaMap2", {
        height: 300,
        mapPath: "map-json/china.geo.json",
        //pointSize: 10,
        safeLine: 6,
        data: [
            [118, 36, 9],
            [100, 33, 3],
            [108, 30, 7],
            [104, 37, 6],
            [114, 29, 2],
            [101, 25, 5],
            [116.7, 39.53, 5],
            [118, 25, 3]
        ]
    });
    let map4 = new Graphic();
    map4.showMapGraph("#chinaMap3", {
        height: 300,
        mapPath: "map-json/china.geo.json",
        //pointSize: 10,
        safeLine: 6,
        data: [
            [118, 36, 9],
            [100, 33, 3],
            [108, 30, 7],
            [104, 37, 6],
            [114, 29, 2],
            [101, 25, 5],
            [116.7, 39.53, 5],
            [118, 25, 3]
        ]
    });

}
