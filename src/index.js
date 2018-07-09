import './style.css';
import graphApi from './api.js';

import MountData from './graph.js';

var d3 = require('d3');

const appDiv = document.querySelector('.container');


class GraphCtrl {
	constructor(graphView) {
    this.graphView = graphView;
  }
  
  init() {
    this.graphView.init();
  }

  getData() {
   return graphApi.call()
      .then((res) => {
         return res;
      })
    
  }
        
}

class GraphView {
	init() {
    console.log("render HTML here");
    this.renderGraphModule()
  }
  renderGraphModule() {
    async function waitPopulate() {
      const graphics = await graphApp.getData()
      for (var graph of graphics) {
        new MountData({
          element: "#graph-box-"+ graph.id,
          graph:graph,
          data: graph.valuesWeek,
          size: graph.size
        })
      }
        
    }
    waitPopulate()
  }
}






const graphView = new GraphView();
const graphApp = new GraphCtrl(graphView);
graphApp.init();

