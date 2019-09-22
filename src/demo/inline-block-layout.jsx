import React from 'react';
import { Collapse } from 'antd';
const { Panel } = Collapse;
// 控制中心
import { VisionCanvasLBus } from '../component-dispatch-center-bus/index.jsx';
// 画布组件
import { VisionCanvasL } from '../canvas/index.jsx';
import { ComponentDropContainer } from '../react-dnd/drop-container.jsx';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
// 这两个构成组件面板
import { ComponentPanesVisionCanvasL } from '../component-panes/index.jsx';
import { ComponentNodeDom } from '../react-dnd/drag-node.jsx';
// 属性面板
import { AttributePanesVisionCanvasL } from '../attribute-panes/index.jsx'
import '../index.less';
 

import { ViewNode } from './absolute-layout.jsx';


class IndexTemplateContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      index: '---',
      collapseList: [],
      arr: [{
        elementId: 0,
        title: '二组零部件',
        children: [
          {
            id: '0-0',
            title: 'Text',
            componentName: 'Text',
            options: { text: '666' }
          },
          {
            id: '0-1',
            title: 'DemoA',
            componentName: 'DemoA',
            options: { title: '666' }
          },
          {
            id: '0-2',
            title: 'DemoB',
            componentName: 'DemoB',
            options: { title: '666' }
          },
        ]
      },{
        elementId: 3,
        title: 'ColumnarBase',
        children: [
          {
            id: '3-1',
            title: '柱状图-图表',
            componentName: 'ColumnarBaseA',
            options: { 
              title: '666', 
              nodeParam: {
                className: 'aaa',
              }
            }

          }
        ]
      },
      {
        elementId: 1,
        title: '一组零部件',
        children: [
          {
            id: '0-1',
            title: 'DemoA',
            componentName: 'DemoA',
            options: { title: '666' }
          },
          {
            id: '0-2',
            title: 'DemoB',
            componentName: 'DemoB',
            options: { title: '666' }
          },
          {
            id: '0-1',
            title: 'DemoA',
            componentName: 'DemoA',
            options: { title: '666' }
          },
          {
            id: '0-2',
            title: 'DemoB',
            componentName: 'DemoB',
            options: { title: '666' }
          },
        ]
      }]
    };
    this.VisionCanvasL = {};
    
  }

  componentWillUnmount() {
    VisionCanvasLBus.componentPanes = [];
  } 

  componentDidMount() {
    const divA = this.VisionCanvasL.addNode({
      componentName: 'DemoA',
      options: {
        title: 'DemeA--',
        dropPos: {
          left: 10,
          top: 10
        },
        nodeParam: {
          className: 'aaa',
          style: {
            color: 'red',
          }
        }
      }
    });

    const divB = this.VisionCanvasL.addNode({
      componentName: 'DemoB',
      options: {
        title: 'DemoB--',
      }
    });

    const demoAAttribute = VisionCanvasLBus.getDefaultAttribute('DemoA');
    const demoBAttribute = VisionCanvasLBus.getDefaultAttribute('DemoB');

    console.log('divA', divA, demoAAttribute);
    console.log('divB', divB, demoBAttribute);
    VisionCanvasLBus.setAttribute(divA.id, demoAAttribute.options);
    VisionCanvasLBus.setAttribute(divB.id, demoBAttribute.options);
    
    const collapseList = [];
    // 注册主键面板
    const { arr } = this.state;
    arr.forEach((item) => {
      collapseList.push(item.elementId);
      item.children.forEach((_item)=> {
        VisionCanvasLBus.registerComponentPanes({
          componentName: _item.componentName,
          ViewNode: ViewNode,
          groupId: item.elementId,
          disabled: _item.disabled,
          componentParam: _item.options
        });
      });
    });
    this.setState({
      collapseList,
    });

  }
  
  render() {
    const { collapseList, arr, index } = this.state;
    const dom = arr.map((item, i)=>{
      const panesArr = VisionCanvasLBus.getGroupPanes(item.elementId);
      return (<Panel header={item.title} key={item.elementId}>
      {
        panesArr.map((_item, ind) => <ComponentNodeDom key={_item.componentPanesId} options={{
          ViewNode: _item.ViewNode(item.children[ind], index, (fn) => fn(this, i, ind)),
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
                activeKey={collapseList}
                key="componentCollapse"
                onChange={(key)=>{
                  this.setState({
                    collapseList: key,
                  });
                }}
              >
                {dom}
              </Collapse>
            </ComponentPanesVisionCanvasL>
          </div>
          <div className="vision-canvas-l-conter" style={{ border: '1px solid #ccc' }}>
            <ComponentDropContainer addNode={(node)=>{
              const temp = this.VisionCanvasL.addNode(node);
              const attr = VisionCanvasLBus.getDefaultAttribute(temp.componentName);
              if (attr) {
                VisionCanvasLBus.setAttribute(temp.id, attr.options);
              }
              
              console.log('node:', temp);
            }}>
              <VisionCanvasL 
                layout="inline-block"
                ref={(refCanvas)=>{
                  if (refCanvas) {
                    this.VisionCanvasL = refCanvas;
                  }
                }} 
              />
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

export const InlineIndexTemplate = DragDropContext(HTML5Backend)(IndexTemplateContainer);