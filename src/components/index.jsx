import React from 'react';
import { Input, InputNumber, Select } from 'antd';
import DemoA from './demo-a/index.jsx';
import DemoB from './demo-b/index.jsx';
import Text from './text/index.jsx'
import ColumnarBase from '../bizcharts/columnar/index.jsx';
import { VisionCanvasLBus } from '../component-dispatch-center-bus/index.jsx';

VisionCanvasLBus.registerComponent(DemoA, 'DemoA');
VisionCanvasLBus.registerComponent(DemoB, 'DemoB');
VisionCanvasLBus.registerComponent(Text, 'Text');
VisionCanvasLBus.registerComponent(ColumnarBase, 'ColumnarBaseA');

const { Option } = Select;
const { TextArea } = Input;

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
      <Select value={props.value} style={{ width: 120 }} onChange={(value) => {
        props.onChange('selectValue', value);
      }}>
        {
          attributeParam.options.map((item, index) => {
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

// VisionCanvasLBus.registerComponent(); // 测试 throw抛出异常
VisionCanvasLBus.registerComponentAttribute('DemoA', [
  {
    key: 'onClick',
    title: '点击事件',
    event: true,
    type: (props) => {
      return <div key={props.index}>
        <div>{props.title}</div>
        <div>
          <TextArea value={props.value} onChange={(e) => {
            props.onChange(props.key, e.target.value);
          }} />
        </div>
      </div>
    }
  },
  {
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

function setCanvasAttribute(id) {
  VisionCanvasLBus.setAttribute(id, [
    {
      type: function (props) {
        return <div key={props.index}>
        <div>{props.title}</div>
        <div style={{border: '1px solid #000'}}>
          {props.id}
        </div>
      </div>;
    },
    id: id,
    title: 'Name',
    key: 'title'
    },
    {
      type: viewNumberFn,
      title: 'width',
      key: 'width'
    },
    {
      type: viewNumberFn,
      title: 'height',
      key: 'height'
    }
  ]);
}

export default {
  DemoA,
  DemoB,
  ColumnarBase,
  Text,
  setCanvasAttribute
}