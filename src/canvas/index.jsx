import React from 'react';
import { uuid } from '../util/index.js';
import { VisionCanvasLBus } from '../component-dispatch-center-bus/index.jsx';
import './index.less';

const MyContainer = (WrappedComponent, options, index) => <WrappedComponent key={index} {...options} />;

/**
 * @description 画布组件
 */
export class VisionCanvasL extends React.Component {

  static defaultProps = {
    moveFlag: true, // 默认支持拖动
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.nodes = [];
    window.visionCanvasL = this;
    this.moveObj = null;
  }

  /**
   * @description 向画布中添加节点
   * @param {
   * componentName: string,
   * options: object,
   * } node
   */
  addNode(node) {
    if (node.componentName) {
      const tempComponent = VisionCanvasLBus.componentPool.filter((item) => {
        return item.componentName === node.componentName;
      });
      node.component = tempComponent[0].component;
      node.id = uuid();
      this.nodes.push(node);
      this.setState({});
      return node;
    }
    throw "添加组件异常，没有component"
  }

  /**
   * @description 将画布中的节点删除
   * @param nodeId
   * @return boolean true表示删除成功，false表示删除失败
  */
  removeNode(id) {
    let length = -1;
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].id === id) {
        this.nodes.splice(i, 1);
        this.setState({});
        return true;
      }
    }
    console.log(`没有这个节点${id}，删除失败`);
    return false;
  }

  mouseMove(e, type) {
    e.stopPropagation();
    e.preventDefault();
    const { moveFlag } = this.props;
    if (this.moveObj && moveFlag) {
      let target = e.currentTarget;
      if (type === 'parent') {
        target = this.moveObj.target;
      }
      const event = e.nativeEvent;
      let moveX = event.clientX - this.moveObj.x;
      let moveY = event.clientY - this.moveObj.y;
      if(moveX < 0){
        moveX = 0
      }else if(moveX > target.parentElement.clientWidth - target.offsetWidth){
          moveX = target.parentElement.clientWidth - target.offsetWidth
      }
      if(moveY < 0){
          moveY = 0
      }else if(moveY > target.parentElement.clientHeight - target.offsetHeight){
          moveY =  target.parentElement.clientHeight - target.offsetHeight
      }
      target.style.left = moveX + 'px';
      target.style.top = moveY + 'px';
      const { item } = this.moveObj;
      item.options.dropPos = {
        left: moveX,
        top: moveY,
      };
    }
  }

  /**
  * @description 画布将节点渲染出来
  */
  draw() {
    const { props } = this;
    const { moveFlag } = props;
    return this.nodes.map((item, index) => {
      // console.log(item.options);
      const style = {};
      if (moveFlag && item.options.dropPos) {
        style.left = item.options.dropPos.left;
        style.top = item.options.dropPos.top;
      } else {
        item.options.dropPos = {
          left: 0,
          top: 0
        };
      }
      return (
        <div
          onMouseDown={(e) => {
            const target = e.currentTarget;
            const x = e.clientX - target.offsetLeft;
            const y = e.clientY - target.offsetTop;
            this.moveObj = {
              item: item,
              x, // 元素现在的位置x
              y, // 元素现在的位置y
              target,
            };
          }}
          onMouseMove={(e)=>{
            this.mouseMove(e);
          }}
          onMouseUp={() => {
            this.moveObj = null;
          }}
          style={style}
          key={index}
          className="vision-node-border">{ MyContainer(item.component, item.options, index) }</div>
      )
    });
  }

  getByNodeId(id) {
    const len = this.nodes.filter((item) => {
      return id === item.id;
    })
    if (len.length > 0) {
      return len[0];
    }
    return null;
  }

  render() {
    return (<div className="vision-canvas-l"
      onMouseUp={() => {
        this.moveObj = null;
      }}
      onMouseLeave={()=>{
        this.moveObj = null;
      }}
      onMouseMove={(e) => {
        this.mouseMove(e, 'parent');
      }}
      style={{ position: 'relative' }}>
      {this.draw()}
    </div>)
  }

}


