
import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { Collapse, Icon, Select } from 'antd';
const { Panel } = Collapse;
import { Input, InputNumber } from 'antd';
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
// bizcharts 柱状图
import ColumnarBase from './bizcharts/columnar/index.jsx';

const { Option } = Select;

function viewFn(props) {
  return <div key={props.index}>
    <div>{props.title}</div>
    <div>
      <Input value={props.value} onChange={(e) => {
        props.onChange(props.key, e.target.value);
      }} />
    </div>
  </div>
}

function viewSelectFn(props) {
  const { attributeParam } = props;
  return <div key={props.index}>
    <div>{props.title}</div>
    <div>
      <Select value={props.value} style={{ width: 120 }} onChange={(value)=>{
        props.onChange('selectValue', value);
      }}>
        { 
          attributeParam.options.map((item, index)=>{
            return <Option key={index} value={item.code}>{item.name}</Option>
          })
        }
      </Select>
    </div>
  </div>
}

function viewNumberFn(props) {
  return <div key={props.index}>
    <div>{props.title}</div>
    <div>
      <InputNumber value={props.value} onChange={(value) => {
        props.onChange(props.key, value);
      }} />
    </div>
  </div>
}

class DemoA extends React.Component {
  render() {
    const { title, selectValue } = this.props;
    return (<div>{title}<br/>{selectValue}</div>);
  }
}

class DemoB extends React.Component {
  render() {
    const { title } = this.props;
    return (<div>{title}</div>);
  }
}

// 在画布中注册组件
VisionCanvasLBus.registerComponent(DemoA, 'DemoA');
VisionCanvasLBus.registerComponent(DemoB, 'DemoB');
VisionCanvasLBus.registerComponent(ColumnarBase, 'ColumnarBaseA');
// VisionCanvasLBus.registerComponent(); // 测试 throw抛出异常
VisionCanvasLBus.registerComponentAttribute('DemoA', [{
  type: viewFn,
  title: 'DemoA的标题名',
  key: 'title'
},
{
  type: viewSelectFn,
  title: 'select的演示',
  key: 'selectValue',
  attributeParam: {
    options: [
      { name: 'a1', code: '1' },
      { name: 'a2', code: '2' },
    ]
  }
},
{
  type: viewNumberFn,
  title: 'left',
  key: 'dropPos.left'
},
{
  type: viewNumberFn,
  title: 'top',
  key: 'dropPos.top'
}
]);

VisionCanvasLBus.registerComponentAttribute('DemoB', [{
  type: viewFn,
  title: 'DemoB的标题名',
  key: 'title'
},
{
  type: viewNumberFn,
  title: 'left',
  key: 'dropPos.left'
},
{
  type: viewNumberFn,
  title: 'top',
  key: 'dropPos.top'
}
]);


function ViewNode(_item, index, onFn) {
  return (<div className="viewNode" key={_item.id} style={{ position: 'relative' }}>
    <span className="title" title={_item.title}>
        <span style={{ display: _item.id !== index ? 'inline-block' : 'none' }}>{_item.title}</span>
        <input type="text" 
          className={['input', _item.id === index ? '' : 'none'].join(' ')}
          onBlur={(e) => {
            const dom = e.target;
            onFn(function (self, i, j) {
              const { arr } = self.state;
              if (dom.value.length !== 0) {
                arr[i].children[j].title = dom.value;
              }
              self.setState({
                arr,
                index: '---',
              });
            });
            
          }} 
        /> 
      </span> 
      <i className="icon-edit"
        onClick={(e) => {
        onFn(function (self){
          self.setState({
            index: _item.id
          });
          const com = e.target;
          let pervDom = com;
          while(pervDom.className !== 'icon-edit') {
            pervDom = pervDom.parentElement;
          }
          pervDom = pervDom.previousElementSibling.lastElementChild;
          pervDom.value = _item.title;
          pervDom.focus();
          pervDom.select();
        });
      }} ><Icon type="edit" /></i>

  </div>)
}

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
            id: '0-1',
            title: '子组件1',
            componentName: 'DemoA',
            options: { title: '666' }
          },
          {
            id: '0-2',
            title: '子组件2',
            componentName: 'DemoB',
            options: { title: '666' }
          },
          {
            id: '0-3',
            title: '子组件3',
            componentName: 'DemoA',
            options: { title: '666' }
          },
          {
            id: '0-4',
            title: '子组件4',
            componentName: 'DemoA',
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
            options: { title: '666' }
          }
        ]
      },
      {
        elementId: 1,
        title: '一组零部件',
        children: [
          {
            id: '0-1',
            title: '子组件1',
            componentName: 'DemoA',
            options: { title: '666' }
          },
          {
            id: '0-2',
            title: '子组件2',
            componentName: 'DemoB',
            options: { title: '666' }
          },
          {
            id: '0-3',
            title: '子组件3',
            componentName: 'DemoA',
            options: { title: '666' }
          },
          {
            id: '0-4',
            title: '子组件4',
            componentName: 'DemoA',
            options: { title: '666' },
            disabled: true,
          },
        ]
      }]
    };
    this.VisionCanvasL = {};
    
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
              <VisionCanvasL ref={(refCanvas)=>{
                if (refCanvas) {
                  this.VisionCanvasL = refCanvas;
                  VisionCanvasLBus.removeObserver(refCanvas);
                  VisionCanvasLBus.addObserver(refCanvas);
                }
              }} />
            </ComponentDropContainer>
          </div>
          <div className="vision-canvas-l-left">
            <AttributePanesVisionCanvasL ref={(refAttributePanes)=>{
              if (refAttributePanes) {
                VisionCanvasLBus.removeObserver(refAttributePanes);
                VisionCanvasLBus.addObserver(refAttributePanes);
              }
            }} />
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
