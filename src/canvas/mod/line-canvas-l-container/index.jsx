import React from 'react';
import {BaseCanvasLContainer} from '../base-canvas-l-container/index.jsx';
import { VisionCanvasLBus, AssignToNew } from '../../../component-dispatch-center-bus/index.jsx';
import { MyContainer, GetClassOrStyle } from '../../index.jsx';
import { BaseNode } from '../base-node/index.jsx';

export class LineCanvasLContainer extends BaseCanvasLContainer {
  componentDidMount(){
    console.log(this.props);
  }
  draw() {
    return this.state.nodes.map((item, index) => {
      debugger;
      const {
        style,
        className,
      } = GetClassOrStyle(item, true, this);
      return BaseNode({
        mouseDown: this.baseNodeMouseDown,
        mouseMove: this.baseNodeMouseMove,
        mouseUp: this.baseNodeMouseUp,
        id: item.id,
        style,
        className,
        item,
        index,
        line: true
      });
    })
  }

  render() {
    debugger;
    const { props } = this;
    return (<div
      onMouseOver={this.rootMouseOver}
      onMouseOut={this.rootMouseOut}
      id={props.id}
      className={[this.state.className].join(' ')}>
      {this.draw()}
    </div>);
  }
}