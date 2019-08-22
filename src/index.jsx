
import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { Collapse } from 'antd';
const { Panel } = Collapse;

// 控制中心
import { VisionCanvasLBus } from './component-dispatch-center-bus/index.jsx';
// 画布组件
import { VisionCanvasL } from './canvas/index.jsx';
import { ComponentDropContainer } from './react-dnd/drop-container.jsx';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
// 这两个构成组件面板
import { ComponentPanesVisionCanvasL } from './component-panes/index.jsx';
import { ComponentNodeDom } from './react-dnd/drag-node.jsx';
// 属性面板
import { AttributePanesVisionCanvasL } from './attribute-panes/index.jsx'
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

// 在画布中注册组件
VisionCanvasLBus.registerComponent(DemoA);
VisionCanvasLBus.registerComponent(DemoB);
// VisionCanvasLBus.registerComponent(); // 测试 throw抛出异常

class IndexTemplateContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.VisionCanvasL = {};
    this.arr = [{
      parentId: 0,
      title: '洞察任务1',
      children: [
        {
          id: '0-1',
          title: '子组件1',
          componentName: 'DemoA'
        },
        {
          id: '0-2',
          title: '子组件2',
          componentName: 'DemoB'
        },
        {
          id: '0-3',
          title: '子组件3',
          componentName: 'DemoA'
        },
        {
          id: '0-4',
          title: '子组件4',
          componentName: 'DemoA'
        },
      ]
    },{
      parentId: 1,
      title: '洞察任务2',
      children: [
        {
          id: '0-1',
          title: '子组件1',
          componentName: 'DemoA'
        },
        {
          id: '0-2',
          title: '子组件2',
          componentName: 'DemoB'
        },
        {
          id: '0-3',
          title: '子组件3',
          componentName: 'DemoA'
        },
        {
          id: '0-4',
          title: '子组件4',
          componentName: 'DemoA'
        },
      ]
    }];
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


    // 注册主键面板
    this.arr.forEach((item) => {
      item.children.forEach((_item)=>{
        VisionCanvasLBus.registerComponentPanes({
          componentName: _item.componentName,
          ViewNode: <div key={_item.id} style={{ position: 'relative' }}>{_item.title}</div>,
          groupId: item.parentId,
        });
      });
    });
    this.setState({});

  }



  render() {
    const dom = this.arr.map((item)=>{
      const panesArr = VisionCanvasLBus.getGroupPanes(item.parentId);
      return (<Panel header={item.title} key={item.parentId}>
      {
        panesArr.map((_item) => <ComponentNodeDom key={_item.componentPanesId} options={{
          ViewNode: _item.ViewNode,
          componentName: _item.componentName,
          options: _item.componentParam,
          data: _item
        }}  />)
      }
      </Panel>)
    })
    return (
      <div className="vision-canvas-demo-container"> 
        <div className="vision-canvas-demo">
          <div className="vision-canvas-l-left">
            <ComponentPanesVisionCanvasL>
              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                key="algorithm"
              >
                {dom}
              </Collapse>
            </ComponentPanesVisionCanvasL>
          </div>
          <div className="vision-canvas-l-conter" style={{ border: '1px solid #ccc' }}>
            <ComponentDropContainer addNode={(node)=>{
              this.VisionCanvasL.addNode(node)
            }}>
              <VisionCanvasL ref={(refCanvas)=>{
                if (refCanvas) {
                  this.VisionCanvasL = refCanvas;
                }
              }} />
            </ComponentDropContainer>
          </div>
          <div className="vision-canvas-l-left">
            <AttributePanesVisionCanvasL />
          </div>
        </div>
      </div>
    )
  }
}

const IndexTemplate = DragDropContext(HTML5Backend)(IndexTemplateContainer);

ReactDOM.render(
    <HashRouter>
      <Switch>
        <Route path="/" component={IndexTemplate} />
      </Switch>
    </HashRouter>
  ,
  document.getElementById('container'),
);
