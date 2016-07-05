//Steps
//1、地理投影
//2、地理路径生成器
//3、加载GeoJson数据
//4、绘图

//TODO LIST
//1、[]标准样式
//2、[]SVG尺寸自适应
//3、[√]创建地理投影
//4、[√]设置投影中心
//5、[√]设置投影的缩放比例
//6、[√]创建地理路径生成器
//7、[√]加载GeoJson数据
//8、[√]绘图
//9、[]中心点比例尺
//10、[]世界地图背景
//11、[]窗口大小收缩变化
//12、[]国际化
//13、[]错误处理


var container = document.getElementById('map');//[api]SVG容器

var $container = $(container);

var width = $container.width();//TODO:SVG宽度,容器自适应
var height = $container.height();//TODO:SVG高度,容器自适应

var svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

//1、地理投影
var projection = d3.geoMercator();

//2、地理路径生成器
var path = d3.geoPath()
    .projection(projection);

//3、加载GeoJson数据(TODO:修改为Promise)
d3.json("china.json", function (error, root) {
    if (error) {
        return alert('todo');
    }

    var bounds = path.bounds(root);

    //设置投影中心、缩放比例、位移
    projection.center(d3.geoCentroid(root))
        .scale(height / (bounds[1][1] - bounds[0][1]) * 150)
        .translate([width / 2, height / 2]);

    d3.json("world_605kb.json", function (error, root2) {
        svg.append("g").selectAll("path")
            .data(root2.features)
            .enter()
            .append("path")
            .attr("class", "province")
            .style("fill", function (d, i) {
                return '#2D3446';
            })
            .attr("d", path);

        var test = d3.scaleOrdinal()
            .domain([1, 2, 3, 4, 5])
            .range([10, 20, 30, 40, 50]);

        var xxx = ['#F97869', '#22C3F7'];

        svg.append("g").selectAll("path")
            .data(root.features)
            .enter()
            .append("path")
            .style("fill", function (d, i) {
                return '#353D52';
            })
            .attr("d", path)
            .each(function (d) {
                var area = path.area(d);
                var centroid = path.centroid(d);
                var bounds = path.bounds(d);

                svg.append("circle")
                    .attr("class", "centroid")
                    .attr("cx", centroid[0])
                    .attr("cy", centroid[1])
                    .attr("r", Math.random() * 30)
                    .attr("fill", "#22C3F7");
            });
    });
});

//1. 红点、蓝点
//#F97869
//#22C3F7


// d3.xml("southchinasea.svg", function (error, xmlDocument) {
//     svg.html(function (d) {
//         return d3.select(this).html() +
//             xmlDocument.getElementsByTagName("g")[0].outerHTML;
//     });
//     d3.select("#southsea")
//         .attr("transform", "translate(800,600)scale(0.5)")
//         .attr("class", "southsea")
// });