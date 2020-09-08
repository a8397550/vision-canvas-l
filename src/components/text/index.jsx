import React from 'react';
import { Input } from 'antd';
import { VisionCanvasLBus } from '../../component-dispatch-center-bus/index.jsx';

const { TextArea } = Input;

export default class Text extends React.Component {
  static defaultProps = {
    placeholder: undefined,
    autosize: {
      minRows: 3,
    },
    text: '',
  }
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
    }
    console.log('text 重新绘制')
  }

  render(){
    const { text } = this.state;
    const { props } = this;
    return (<TextArea
      value={text}
      onDoubleClick={(e)=>{
        e.preventDefault();
        e.stopPropagation();
        e.target.focus();
      }}
      onChange={(e)=>{
        this.setState({
          text: e.target.value,
        });
      }}
      onBlur={(e)=>{
        VisionCanvasLBus.notify({
          options: {
            text: e.target.value,
          },
          id: props.id
        });
      }}
      placeholder={props.placeholder}
      autosize={props.autosize}
    />)
  }
}