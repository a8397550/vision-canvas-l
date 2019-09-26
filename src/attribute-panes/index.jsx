import React from 'react';
import { VisionCanvasLBus } from '../component-dispatch-center-bus/index.jsx';

export class AttributePanesVisionCanvasL extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      options: {},
      id: '',
    }
    this.VisionCanvasLBus = props.VisionCanvasLBus || VisionCanvasLBus;
    this.VisionCanvasLBus.addObserver(this);
  }

  componentWillUnmount() {
    this.VisionCanvasLBus.removeObserver(this);
  }

  update(options) {
    this.setState({
      options: options.options,
      id: options.id
    });
  }

  getValue(key, options) {
    try {
      if (key) {
        const arr = key.split('.');
        let value;
        for (let i = 0; i < arr.length; i += 1) {
          const keyTemp = arr[i];
          if (!value) {
            value = options[keyTemp];
          } else {
            value = value[keyTemp];
          }
          if (typeof value === 'undefine') {
            throw '参数错误'
          }
        }
        return value;
      } else {
        throw '参数错误';
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  render() {
    const { id, options } = this.state;
    const op = this.VisionCanvasLBus.getAttribute(id);
    if (!op) {
      return null;
    }
    return (<div>
      {op.map((item, index) => {
        const value = this.getValue(item.key, options);
        item.value = value !== undefined || value !== null ? value : item.value;
        item.index = index;
        item.onChange = (key, value) => {
          console.log('value:', value)
          const { options: op } = this.state;
          let obj;
          const arr = key.split('.');
          for (let i = 0; i < arr.length; i += 1) {
            const keyTemp = arr[i];
            if (i + 1 === arr.length) {
              if (!obj) {
                op[keyTemp] = value;
              } else {
                obj[keyTemp] = value;
              }
            } else {
              if (!obj) {
                obj = op[keyTemp];
              } else {
                obj = obj[keyTemp];
              }
            }
          }

          this.setState({
            options: op,
          }, () => {
            this.VisionCanvasLBus.notify({
              options: op,
              id: id,
              type: 'attribute',
            });
          })
        }

        if (typeof item.type === 'function') {
          return <div key={index}>{item.type(item)}</div>;
        }
        return null;
      })}
    </div>)
  }
}