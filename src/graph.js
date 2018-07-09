import es_ES from './locale.js';
var d3 = require('d3');
class MountData {

    constructor (opts){
        
      this.data = opts.data;
      this.element = opts.element;
      this.size = opts.size;
      this.graphic = opts.graph;
      this.draw();
    }
    
    // create the chart
    draw(){
        
      
      const ES = d3.formatLocale(es_ES);

      const tmpl = `
        <div class="graph">
  
          <div class="graph-box" id="graph-box-${this.graphic.id}">
          </div>
        
          <div class="graph-info">
            <div class="graph-device tablet">
              <span class="info-title" style="color:${this.graphic.colors.colorTablet};">Tablet</span>
              <span>${this.graphic.totalTablet / this.graphic.totalValue * 100}%</span> <span>${ES.format(",.0f")(this.graphic.totalTablet)}${this.graphic.postSymbol || ''}</span>
            </div>
            <div class="graph-device smartphone">
              <span class="info-title" style="color:${this.graphic.colors.colorSmartphone};">Smartphone</span>
              <span>${this.graphic.totalSmartphone / this.graphic.totalValue * 100}%</span> <span>${ES.format(",.0f")(this.graphic.totalSmartphone)}${this.graphic.postSymbol || ''}</span>
            </div>
          
          </div>
        </div>
      `;
      const appDiv = document.querySelector('.graph-container');
      appDiv.innerHTML += tmpl
      console.log(this.graphic, this.element)
      
      var data = this.graphic
      var width = this.size,
      height = this.size,
      clipId = 'circle-box-' + this.graphic.id
  
  
      var colors = [];
      for (let color in this.graphic.colors) {
        colors.push(this.graphic.colors[color])
      }
  
      var radius = Math.min(width, height) / 2;
      var step = 10
      var innerRadius = radius - step;
  
      const svg = d3.select(this.element)
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
  
      
      var pieGenerator = d3.pie();
      var arcGenerator = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius)
      // .padAngle(.02)
      // .padRadius(100)
      // .cornerRadius(4);
  
      var dataRad = [this.graphic.totalTablet, this.graphic.totalSmartphone];
      var arcData = pieGenerator(dataRad);
  
  
  
      svg.select('g.donut')
        .selectAll('path')
        .data(arcData)
        .enter()
        .append('path')
        .style('fill', function (d, i) {
          return colors[i];
        })
        .attr('d', arcGenerator)
  
  
      /// text
      svg.select('g.title')
        .append("text")
        .style("text-anchor", "middle")
        .attr("startOffset", "50%")
        .text(this.graphic.name.toUpperCase())
        .attr("fill", "currentColor")
        .attr("transform", 'translate(' + width / 2 + ', ' + (height - 30) / 2 + ')')
  
      svg.select('g.title')
        .append("text")
        .style("text-anchor", "middle")
        .attr('class', 'total-value')
        .text(`${ES.format(",.0f")(this.graphic.totalValue)}${this.graphic.postSymbol || ''} `)
        .attr("transform", 'translate(' + width / 2 + ', ' + (height + 30) / 2 + ')')
  
  
      // AREA CHART
  
      var area = d3.area();
  
  
      area
        .x(function (d) { return xScale(d[0]); })
        .y0(innerRadius)
        .y1(function (d) { return yScale(d[1]); })
        .curve(d3.curveCardinal);
  
      var xScale = d3.scaleLinear()
        .domain([0, this.graphic.valuesWeek.length - 1])
        .range([-innerRadius + step, innerRadius - step]);
  
      var yScale = d3.scaleLinear()
        .domain([0, d3.max(this.graphic.valuesWeek.map(function (d) { return d[1]; }))])
        .range([innerRadius - step, 2 * step]);
  
  
      var colorArea = d3.color(colors[0])
  
      var timeseries = svg.select("g.chart")
        .selectAll('path.timeseries')
        .data([this.graphic.valuesWeek])
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
  }
  export default MountData