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
  line = false
}) {
  console.log(line);
  if (line) {
    style.left = 0;
    style.top = 0;
  }
  return (<div
  onMouseDown={mouseDown}
  onMouseMove={mouseMove}
  onMouseUp={mouseUp}
  key={id}
  id={id}
  style={style}
  className={["vision-node-border", className, line ? 'line-canvas-l-container' : ''].join(' ')}>
  {MyContainer(item.component, item.options, index)}
</div>);
}