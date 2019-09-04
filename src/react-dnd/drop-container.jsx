import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

class Dropcontainer extends React.Component {
  static propTypes = {
    isOver: PropTypes.bool,
    canDrop: PropTypes.bool,
    connectDropTarget: PropTypes.func,
    activeFlag: PropTypes.bool,
    children: PropTypes.object,
  };

  static defaultProps = {
    isOver: false,
    canDrop: true,
    connectDropTarget: () => {},
    activeFlag: false,
    children: {},
  };

  render() {
    const {
      isOver,
      canDrop,
      connectDropTarget,
      activeFlag,
      children,
    } = this.props;

    return connectDropTarget(
      <div
        style={{ cursor: `${activeFlag ? 'move' : 'default'}` }}
        className={
        ['drop-container', isOver && canDrop ? 'background-green' : ''].join('')
        }
      >
        {children}
      </div>
    );
  }
}

const ComponentDropContainer = DropTarget(
  ['vision-canvas-l', 'vision-canvas-l-list'],
  {
    drop: (props, monitor, component) => {
      const { addNode } = props;

      const container = ReactDOM.findDOMNode (component); // eslint-disable-line
      const containerPos = container.getBoundingClientRect();
      const dropPos = monitor.getSourceClientOffset();

      let left = dropPos.x - containerPos.left;
      let top = dropPos.y - containerPos.top;

      const item = monitor.getItem();
      const itemType = monitor.getItemType();
      if (!item.options) {
        item.options = {};
      }
      item.options.dropPos = {};
      item.options.dropPos.left = left;
      item.options.dropPos.top = top;
      
      if (itemType === 'vision-canvas-l') {
        addNode({
          componentName: item.componentName,
          options: item.options
        });
      } else if (itemType === 'vision-canvas-l-list') {
        item.componentPanes.forEach((__item, i) => {
          addNode({
            componentName: __item.componentName,
            options: __item.options
          });
        });
      }
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  })
)(Dropcontainer);


export { ComponentDropContainer };
