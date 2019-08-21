
import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { VisionCanvasL } from './canvas/index.jsx'
import { VisionCanvasLBus } from './component-dispatch-center-bus/index.jsx';
import { ComponentPanesVisionCanvasL } from './component-panes/index.jsx';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import './index.less';

class DemoA extends React.Component {
  render() {
    return (<div>DemoA</div>);
  }
}

class DemoB extends React.Component {
  render() {
    return (<div>DemoB</div>);
  }
}

VisionCanvasLBus.registerComponent(DemoA);
VisionCanvasLBus.registerComponent(DemoB);

// const IndexTemplate = DragDropContext(HTML5Backend)(IndexTemplateContainer);

class IndexTemplateContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.VisionCanvasL = {};
  }

  componentDidMount() {
    this.VisionCanvasL.addNode({
      componentName: 'DemoA',
      options: {}
    });
    this.VisionCanvasL.addNode({
      componentName: 'DemoB',
      options: {}
    });
  }

  render() {
    return (
      <div className="vision-canvas-demo-container"> 
        <div className="vision-canvas-demo">
          <div className="vision-canvas-l-left"></div>
          <div className="vision-canvas-l-conter">
          <VisionCanvasL ref={(refCanvas)=>{
            if (refCanvas) {
              this.VisionCanvasL = refCanvas;
            }
          }} />
          </div>
          <div className="vision-canvas-l-left"></div>
        </div>
      </div>
    )
  }

}

ReactDOM.render(
    <HashRouter>
      <Switch>
        <Route path="/" component={IndexTemplateContainer} />
      </Switch>
    </HashRouter>
  ,
  document.getElementById('container'),
);
