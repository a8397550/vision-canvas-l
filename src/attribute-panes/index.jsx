import React from 'react';
import { VisionCanvasLBus } from '../component-dispatch-center-bus/index.jsx';

export class AttributePanesVisionCanvasL extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      options: {},
      id: '',
    }
  }

  update(options) {
    console.log(options.options);
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
    const op = VisionCanvasLBus.getAttribute(id);
    if (!op) {
      return null;
    }
    return (<div>
      {op.map((item, index) => {
        if (item.event) {
          // debugger;
        }
        const value = this.getValue(item.key, options);
        item.value = value;
        item.index = index;
        item.onChange = (key, value) => {
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
            VisionCanvasLBus.notify({
              options: op,
              id: id
            });
          })
        }

        if (typeof item.type === 'function') {
          return item.type(item);
        }
        return null;
      })}
    </div>)
  }
}