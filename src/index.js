// Import stylesheets
import './style.css';
import graphApi from './api.js';
import MountData from './graph.js';


var d3 = require('d3');
// Write Javascript code!
const appDiv = document.querySelector('.container');
appDiv.innerHTML += `<h1>Test Marfeel JS</h1>`;










// model
// graphApi.call()
// .then((res) => {
//   for (var graph of res) {
//     mountData(graph)
//   }
// })
// .catch(err => console.log(err))

//controller 
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
// view

class GraphView {
	init() {
    console.log("render HTML here");
    this.renderGraphModule()
  }
  renderGraphModule() {
    async function f1() {
      const graphics = await graphApp.getData()
      for (var graph of graphics) {
        new MountData({
          element: "#graph-box-"+ graph.id,
          graph:graph,
          data: graph.valuesWeek,
          size: graph.size
        })
      }
        // mountData(graphics[0])
    }
    f1()
  }
}


// APP

const graphView = new GraphView();
const graphApp = new GraphCtrl(graphView);

graphApp.init();
