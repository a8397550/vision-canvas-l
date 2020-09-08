import React from 'react';
import { Collapse, Icon, Input } from 'antd';
const { Panel } = Collapse;
// 控制中心
import { VisionCanvasLBus } from '../component-dispatch-center-bus/index.jsx';
// 画布组件
import { VisionCanvasL } from '../canvas/index.jsx';
import '../index.less';
import * as Coms from '../components/index.jsx';

export class ViewTemplate extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.VisionCanvasL = {};
    this.VisionCanvasLBus = props.VisionCanvasLBus || VisionCanvasLBus;
  }

  componentDidMount() {
    this.VisionCanvasLBus.pubSub.subscribe('canvas:didmount', () => {
      console.log("canvas:didmount")
    });
    this.VisionCanvasLBus.pubSub.subscribe('canvas:mouseup', () => {
      console.log("canvas:mouseup")
    });
    this.VisionCanvasLBus.pubSub.subscribe('canvas:click', () => {
      console.log("canvas:click")
    });
    this.VisionCanvasLBus.pubSub.subscribe('canvas:mouseleave', () => {
      console.log("canvas:mouseleave")
    });
    this.VisionCanvasLBus.pubSub.subscribe('canvas:mousemove', () => {
      console.log("canvas:mousemove")
    });
    this.VisionCanvasLBus.pubSub.subscribe('canvas:unmount', () => {
      console.log("canvas:unmount")
    });

    this.VisionCanvasLBus.pubSub.subscribe('node:mousedown', () => {
      console.log("node:mousedown")
    });
    this.VisionCanvasLBus.pubSub.subscribe('node:mousemove', () => {
      console.log("node:mousemove")
    });
    this.VisionCanvasLBus.pubSub.subscribe('node:mouseup', () => {
      console.log("node:mouseup")
    });
  }

  getConfig() {
    [
      {
        "componentName": "DemoA",
        "options": {
          "title": "DemeA--",
          "dropPos": {
            "left": 0,
            "top": 0
          },
          "nodeParam": {
            "className": "aaa",
            "style": {
              "color": "red"
            }
          },
          "id": "194113d3-9271-4737-b7b1-8274b6a2f9e6",
          "onClick___event": "{\n  console.log(ctx);\n}"
        },
        "id": "194113d3-9271-4737-b7b1-8274b6a2f9e6"
      },
      {
        "componentName": "DemoB",
        "options": {
          "title": "DemoB--",
          "id": "ad3b9a19-9351-4398-959d-033bd9b57734",
          "dropPos": {
            "left": 0,
            "top": 0
          },
          "nodeParam": {
            "className": "",
            "style": {}
          }
        },
        "id": "ad3b9a19-9351-4398-959d-033bd9b57734"
      }
    ].forEach((node) => {
      this.VisionCanvasL.addNode(node);
    });

    const state = this.VisionCanvasL.stringToFunction(Object.assign(this.VisionCanvasL.state, {
      willMount___event: `{
        console.log('ctx__willMount___event', ctx);
      }`,
      didMount___event: `{
        console.log('ctx__didMount___event', ctx);
        ctx.setState({});
      }`,
      didUpdate___event: `{
        console.log('ctx__didUpdate___event', ctx);
      }`,
      willUnmount___event: `{
        console.log('ctx__willUnmount__event', ctx);
      }`,
    }))

    this.VisionCanvasL.setState(state, () => {
      debugger;
      if (!this.VisionCanvasL.didMountFlag && this.VisionCanvasL.state.didMount) {
        this.VisionCanvasL.didMountFlag = true;
        this.VisionCanvasL.state.didMount(this.VisionCanvasL);
      }
    });
  }
  
  render() {
    return (
      <div className="vision-canvas-demo-container"> 
        <div className="vision-canvas-demo">
          <div className="vision-canvas-conter" style={{ border: '1px solid #ccc' }}>
              <VisionCanvasL
                layout="inline-block"
                ref={(refCanvas) => {
                  if (refCanvas) {
                    this.VisionCanvasL = refCanvas;
                    this.getConfig();
                   }
                }}
              />
          </div>
        </div>
      </div>
    )
  }
}