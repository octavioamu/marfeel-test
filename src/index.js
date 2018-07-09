// Import stylesheets
import './style.css';
import graphApi from './api.js';

// import d3 from '/node_modules/d3'
var d3 = require('d3');
// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>Test Marfeel JS</h1>`;









function mountData(res) {
console.log(res)
var tmpl = `
  <div class="graph">

    <div class="graph-box"></div>
  
    <div class="graph-info">
      <div class="graph-device tablet">
        <span class="info-title">Tablet</span>
        <span>60%</span> <span>120.000</span>
      </div>
      <div class="graph-device smartphone">
        <span class="info-title">Smartphone</span>
        <span>60%</span> <span>120.000</span>
      </div>
    
    </div>
  </div>

`;
appDiv.innerHTML = tmpl
var data = res
var width = 167,
  height = 167,
  clipId = 'circle-box-' + data.id


var colors = [];
for (let color in data.colors) {
  console.log(data.colors[color])
  colors.push(data.colors[color])
}

var radius = Math.min(width, height) / 2;
var step = 10
var innerRadius = radius - step;

var svg = d3.select(".graph-box")
  .append("svg")
  .attr("width", width)
  .attr("height", height)


svg
  .append("g")
  .attr('class', 'donut')
  .attr('transform', function () {
    return 'translate(' + width / 2 + ', ' + height / 2 + ')';
  });

svg
  .append("g")
  .attr('class', 'chart')
  .attr('transform', function () {
    return 'translate(' + width / 2 + ',  ' + height / 2 + ' )';
  });

svg
  .append("g")
  .attr('class', 'title')


svg.append('clipPath')
  .attr("id", clipId)
  .append('circle')
  .attr("transform", "translate(0,0)")

svg.select('#' + clipId + ' circle')
  .attr('r', innerRadius - 4)

var originX = 0;
var originY = 0;




var es_ES = {
  "decimal": ".",
  "thousands": ".",
  "grouping": [3],
  "currency": ["", "€"],
  "dateTime": "%a %b %e %X %Y",
  "date": "%m/%d/%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
}

var ES = d3.formatLocale(es_ES);
var pieGenerator = d3.pie();
var arcGenerator = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(radius)
// .padAngle(.02)
// .padRadius(100)
// .cornerRadius(4);

var dataRad = [10, 40];
var dataArea = [
  [0, 25], [1, 37], [2, 32], [3, 40], [4, 30], [5, 20],
  [6, 10], [7, 22], [8, 30], [9, 12], [10, 17],
  [11, 16], [12, 31], [13, 45], [14, 10], [15, 15],
  [16, 24], [17, 30], [18, 40], [19, 20], [20, 5]
];
var arcData = pieGenerator(dataRad);



d3.select('g.donut')
  .selectAll('path')
  .data(arcData)
  .enter()
  .append('path')
  .style('fill', function (d, i) {
    return colors[i];
  })
  .attr('d', arcGenerator)


/// text
d3.select('g.title')
  .append("text")
  .style("text-anchor", "middle")
  .attr("startOffset", "50%")
  .text(data.name.toUpperCase())
  .attr("fill", "currentColor")
  .attr("transform", 'translate(' + width / 2 + ', ' + (height - 30) / 2 + ')')

d3.select('g.title')
  .append("text")
  .style("text-anchor", "middle")
  .attr('class', 'total-value')
  .text(`${ES.format(",.0f")(data.totalValue)}${data.postSymbol || ''} `)
  .attr("transform", 'translate(' + width / 2 + ', ' + (height + 30) / 2 + ')')


// AREA CHART




var area = d3.area();


area
  .x(function (d) { return xScale(d[0]); })
  .y0(innerRadius)
  .y1(function (d) { return yScale(d[1]); })
  .curve(d3.curveCardinal);



var xScale = d3.scaleLinear()
  .domain([0, data.valuesWeek.length - 1])
  .range([-innerRadius + step, innerRadius - step]);


var yScale = d3.scaleLinear()
  .domain([0, d3.max(data.valuesWeek.map(function (d) { return d[1]; }))])
  .range([innerRadius - step, 2 * step]);


var colorArea = d3.color(colors[1])
console.log(colorArea)

var timeseries = d3.select("g.chart")
  .selectAll('path.timeseries')
  .data([data.valuesWeek])
  .enter()
  .append('path')
  .attr('clip-path', "url(#" + clipId + ")")
  .attr('stroke', function () {
    colorArea.opacity = 0.3
    return colorArea
  })
  .attr('stroke-width', 2)
  .style("fill", function () {
    colorArea.opacity = 0.1
    return colorArea
  })
  .attr('class', 'timeseries')

timeseries
  .attr('d', area)


}

graphApi.call()
.then((res) => {
  for (var graph of res) {
    mountData(graph)
  }
  
  
})
// .catch(err => console.log(err))