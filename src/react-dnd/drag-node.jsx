import React from 'react';
import { Icon } from 'antd';
import { getEmptyImage } from "react-dnd-html5-backend";
import * as ReactDnd from 'react-dnd';

const layerStyles = { // ItemLayer 给拖动出来的示意组件赋值样式用的
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

const { DragSource, DragLayer } = ReactDnd;

class ComponentNode extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { connectDragPreview } = this.props;
    connectDragPreview(getEmptyImage());
  }

  render() {
    const { connectDragSource, options } = this.props;
    const { ViewNode } = options;
    return connectDragSource(ViewNode);
  }
}

function ItemPreview({ item, isDragging, currentOffset, itemType }) {
  
  if (!isDragging) {
    return null;
  }
  
  const { ViewNode } = item;
  const dom = ViewNode;

  return (
    <div style={layerStyles}>
      <div style={getItemStyles({ currentOffset })}>{dom}</div>
    </div>
  );
}

const cardSource = {
  canDrag(props) { // 此方法返回false 组件库面板就不能被拖出，可以设置组件库组件的禁用
    console.log(props);
    const { options } = props;
    if (options.data && options.data.disabled) {
      return false;
    }
    return true;
  },

  isDragging(props, monitor) {
    const { id } = props;
    return monitor.getItem().id === id;
  },

  beginDrag(props) {
    // 拖动开时，可以在此时做校验
    const { options } = props;
    return options;
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop

    }
  },
};

function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  };
}

function getItemStyles(props) {
  const { currentOffset } = props;
  if (!currentOffset) {
    return {
      display: 'none',
    };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

function dragLayerMonitor(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  };
}

const ComponentNodeDom = DragSource('vision-canvas-l', cardSource, collect)(ComponentNode);
const ItemLayer = DragLayer(dragLayerMonitor)(ItemPreview);

export {
  ComponentNodeDom,
  ItemLayer
};
