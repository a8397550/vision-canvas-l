import * as React from 'react';
import { MyContainer } from '../../index.jsx';


export function BaseNode({
  mouseDown = () => {},
  mouseMove = () => {},
  mouseUp = () => {},
  id,
  style,
  className,
  item,
  index,
  selectChecked = () => {},
}) {
  let line = item.options.nodeParam.lineType;
  const containerType = item.options.nodeParam.containerType;
  
  const _style = Object.assign({}, style);
  if (containerType) {
    delete _style.overflow;
  }
  

  return (<div
  onMouseDown={(e)=>{
    if (!containerType) {
      mouseDown(e, item);
    }
    selectChecked(e, item);
  }}
  onMouseMove={(e)=>{
    if (!containerType) {
      mouseMove(e, item);
    }
  }}
  onMouseUp={(e)=>{
    if (!containerType) {
      mouseUp(e, item);
    }
  }}
  key={id}
  id={id}
  style={_style}
  className={["vision-node-border", className, containerType ? 'base-canvas-l-container' : '', line ? 'line-canvas-l-container' : ''].join(' ')}>
  <div className="canvas-l-node-border"></div>
  <div onMouseDown={(e)=>{
    if (containerType) {
      mouseDown(e, item);
    }
  }}
  onMouseMove={(e)=>{
    if (containerType) {
      mouseMove(e, item);
    }
  }}
  onMouseUp={(e)=>{
    if (containerType) {
      mouseUp(e, item);
    }
  }}
  className="drag-canvas-l"></div>
  {MyContainer(item.component, item.options, index)}
</div>);
}