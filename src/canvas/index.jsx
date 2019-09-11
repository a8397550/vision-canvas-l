import React from 'react';
import { uuid } from '../util/index.js';
import { VisionCanvasLBus, AssignToNew } from '../component-dispatch-center-bus/index.jsx';
import './index.less';

const MyContainer = (WrappedComponent, options, index) => <WrappedComponent key={index} {...options} />;

/**
 * @description 画布组件
 */
export class VisionCanvasL extends React.Component {

  static defaultProps = {
    moveFlag: true, // 默认支持拖动
    width: '',
    height: '',
    layout: '', // inline-block 行内快布局 , absolute 绝对定位布局
    style: {
      position: 'relative'
    },
    className: '',
    VisionCanvasLBus: undefined,
  }

  constructor(props) {
    super(props);
    this.state = {
      width: '',
      height: '',
      nodes: []
    };
    this.selectNodes = [];
    this.VisionCanvasLBus = props.VisionCanvasLBus || VisionCanvasLBus;
    window.VisionCanvasL = this;
    this.moveObj = null;
    this.layout = props.layout;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.layout !== this.props.layout || 
      nextProps.moveFlag !== this.props.moveFlag ||
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height ||
      nextProps.style !== this.props.style ||
      nextProps.className !== this.props.className ||
      nextProps.VisionCanvasLBus !== this.props.VisionCanvasLBus ||
      nextState.nodes !== this.state.nodes ||
      nextState.width !== this.state.width ||
      nextState.height !== this.state.height
    ) {
        return true;
      }
      return false;
  }

  componentDidMount() {
    this.setCanvas();
    this.VisionCanvasLBus.pubSub.publish('canvas:didmount');
  }

  setCanvas() {
    this.canvas = document.getElementById('vision-canvas-l-canvas');
    const visionCanvasLDom = document.querySelector('.vision-canvas-l');
    this.canvas.width = visionCanvasLDom.clientWidth;
    this.canvas.height = visionCanvasLDom.clientHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#0070CC';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.setLineDash([1, 1]);
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.width !== prevState.width || nextProps.height !== prevState.height) {
      return {
        width: nextProps.width,
        height: nextProps.height,
      }
    }
    return null;
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
      const tempComponent = this.VisionCanvasLBus.componentPool.filter((item) => {
        return item.componentName === node.componentName;
      });
      node.component = tempComponent[0].component;
      node.id = uuid();
      node.options.id = node.id;
      const { nodes } = this.state;
      nodes.push(node);
      this.setState({
        nodes: AssignToNew(nodes),
      });
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
    const { nodes } = this.state;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        nodes.splice(i, 1);
        this.setState({
          nodes: AssignToNew(nodes),
        });
        return true;
      }
    }
    console.log(`没有这个节点${id}，删除失败`);
    return false;
  }

  mouseUp(e) {
    e.stopPropagation();
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    if (this.rect && this.moveObj) {
      const point = this.getRectPoint();
      const vNode = document.getElementsByClassName('vision-node-border');
      if (vNode) {
        const vNodes = Array.prototype.slice.call(vNode)
        for (let i = 0; i < vNodes.length; i += 1) {
          const item = vNodes[i];
          if (item.offsetLeft - point.x > 0 && item.offsetTop - point.y > 0 && 
            point.x + point.w - item.offsetLeft - item.clientWidth >= 0 &&
            point.y + point.h - item.offsetTop - item.clientHeight >= 0) {
            this.selectNodes.push(this.getByNodeId(item.id));
            if (!item.classList.contains('vision-node-active')) {
              item.classList.add('vision-node-active');
            }
          }
        }
      }
    }
    const flag = this.layout === 'inline-block' ? true : false;
    if (flag && this.moveObj) {
      const vNode = document.getElementsByClassName('vision-node-border');
      if (vNode) {
        let vNodes = Array.prototype.slice.call(vNode);
        let moveStatus = false; // 位置有没有发送改变
        let moveChange = false; // 排序位置有没有发送改变
        vNodes = vNodes.sort(function(a,b) {
          let index = 0;
          if (a.offsetTop < b.offsetTop) {
            index = -1;
          } else if (a.offsetTop === b.offsetTop) {
            if (a.offsetLeft < b.offsetLeft) {
              index = -1;
            } else {
              index = 1;
            }
          } else {
            index = 1;
          }
          if (index !== 1) {
            moveChange = true;
          }
          return index;
        });

        for (let i = 0; i < vNodes.length; i += 1) {
          if (!(vNodes[i].style.top === '0px' && vNodes[i].style.left === '0px')) {
            moveStatus = true;
            break;
          }
        }
        if (moveStatus) {
          const arr = [];
          for (let i = 0; i < vNodes.length; i += 1) {
            vNodes[i].style.left = '0px';
            vNodes[i].style.top = '0px';
            const item = this.getByNodeId(vNodes[i].id);
            item.options.dropPos.top = 0;
            item.options.dropPos.left = 0;
            arr.push(item);
          }
          if (moveChange) {
            this.setState({
              nodes: AssignToNew(arr),
            });
          }
        }
      }
    }
    this.moveObj = null;
    this.rect = null;
    
  }

  mouseMove(clientX, clientY) {
    const { moveFlag } = this.props;
    if (this.moveObj && moveFlag) {
      let actives = document.getElementsByClassName('vision-node-active');
      if (actives) {
        actives = Array.prototype.slice.call(actives);
        actives.forEach((target, i) => {
          const flag = this.layout === 'inline-block' ? true : false;
          
          let offsetLeft = 0;
          let offsetTop = 0;
          const position = this.moveObj.move[target.id];    
          if (!flag) {
            offsetLeft = position.offsetLeft;
            offsetTop = position.offsetTop; 
          }

          let moveX = clientX - (position.x - offsetLeft);
          let moveY = clientY - (position.y - offsetTop);

          target.style.left = moveX + 'px';
          target.style.top = moveY + 'px';
          const { item } = this.moveObj;
          item[target.id].options.dropPos = {
            left: moveX,
            top: moveY,
          };
        })
      }
    }
  }

  update(options) {
    if (options && options.type !== 'canvas') {
      const { nodes } = this.state;
      const len = nodes.filter((temp) => {
        return temp.id === options.id;
      });
      if (len.length > 0) {
        Object.assign(len[0].options, options.options);
        this.setState({
          nodes: AssignToNew(nodes),
        });
      }
    }
  }

  /**
  * @description 画布将节点渲染出来
  */
  draw() {
    const { props } = this;
    const { moveFlag } = props;
    const { nodes } = this.state;
    return nodes.map((item, index) => {
      let style = {};
      // 默认属性赋值
      if (moveFlag && item.options.dropPos) {
        const flag = this.layout === 'inline-block' ? true : false;
        if (flag) {
          item.options.dropPos.left = 0;
          item.options.dropPos.top = 0;
        }
        style.left = item.options.dropPos.left;
        style.top = item.options.dropPos.top;
      } else if (moveFlag) {
        item.options.dropPos = {
          left: 0,
          top: 0
        };
        style.left = item.options.dropPos.left;
        style.top = item.options.dropPos.top;
      }
      
      // node节点的className与style的赋值
      if (!item.options.nodeParam || typeof item.options.nodeParam !== 'object') {
        item.options.nodeParam = {
          className: '',
          style: {},
        }
      }
      if (typeof item.options.nodeParam === 'object' && typeof item.options.nodeParam.style === 'object') {
        Object.assign(style, item.options.nodeParam.style);
      }
      let className = item.options.nodeParam.className
      className = typeof className !== 'undefined' ? className : '';
      // 被选中状态赋值
      const lenSelector = this.selectNodes.filter((temp)=>{
        return temp.id === item.id;
      }).length;
      return (
        <div 
          key={item.id}
          id={item.id}
          onMouseDown={(e) => {
            e.stopPropagation();
            this.VisionCanvasLBus.notify({
              options: item.options,
              id: item.id,
              type: 'canvas'
            });
            const len = this.selectNodes.filter((temp)=>{
              return temp.id === item.id;
            });
            if (len.length === 0) {
              this.clearSelectNodes();
              this.selectNodes = [item];
            }
            this.moveObj = {};
            this.moveObj.move = {};
            this.moveObj.item = {};
            this.selectNodes.forEach((temp)=>{
              const dom = document.getElementById(temp.id);
              if (dom) {
                this.moveObj.move[temp.id] = {
                  x: e.clientX,
                  y: e.clientY,
                  offsetLeft: dom.offsetLeft,
                  offsetTop: dom.offsetTop
                }
                this.moveObj.item[temp.id] = temp;
              }
              if (!dom.classList.contains('vision-node-active')) {
                dom.classList.add('vision-node-active');
              }
            })
            this.VisionCanvasLBus.pubSub.publish('node:mousedown', e);
          }}
          onMouseMove={(e)=>{
            this.setSelector(e);
            const event = e.nativeEvent;
            this.mouseMove(event.clientX, event.clientY);
            e.stopPropagation();
            this.VisionCanvasLBus.pubSub.publish('node:mousemove', e);
          }}
          onMouseUp={(e) => {
            this.mouseUp(e);
            this.VisionCanvasLBus.pubSub.publish('node:mouseup', e);
          }}
          style={style}
          className={["vision-node-border", className, lenSelector ? 'vision-node-active' : ''].join(' ')}>{ MyContainer(item.component, item.options, index) }</div>
      )
    });
  }

  /**
   * @description 获取选中元素 
   *  
   */
  getSelectNodes() {
    return this.selectNodes;
  }

  clearSelectNodes() {
    this.selectNodes = [];
    const vActive = document.getElementsByClassName('vision-node-active');
    if (vActive) {
      const vActives = Array.prototype.slice.call(vActive)
      for (let i = 0; i < vActives.length; i += 1) {
        vActives[i].classList.remove('vision-node-active');
      }
    }
  }

  getByNodeId(id) {
    const { nodes } = this.state;
    const len = nodes.filter((item) => {
      return id === item.id;
    })
    if (len.length > 0) {
      return len[0];
    }
    return null;
  }

  setSelector(e, type) {
    if (this.rect) {
      let target = e.currentTarget;
      if (type !== 'parent') {
        target = target.parentElement;
      }
      this.rect.x1 = e.clientX - target.offsetLeft;
      this.rect.y1 = e.clientY - target.offsetTop;
      this.canvasDraw();
    }
  }

  getRectPoint() {
    const w = Math.abs(this.rect.x - this.rect.x1);
    const h = Math.abs(this.rect.y - this.rect.y1);
    const startPoint = this.rect.x < this.rect.x1 ? this.rect.x : this.rect.x1;
    const endPoint = this.rect.y < this.rect.y1 ? this.rect.y : this.rect.y1;
    return {
      x: startPoint,
      y: endPoint,
      w,
      h
    }
  }

  canvasDraw() {
    if (this.rect) {
      this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      const point = this.getRectPoint();
      this.ctx.strokeRect(point.x, point.y, point.w, point.h);
      this.ctx.fillRect(point.x + 1, point.y + 1, point.w - 2, point.h - 2);
    }
  }

  render() {
    const { width, height } = this.state;
    const { className, style } = this.props;
    const _style = {}

    Object.assign(_style, style);

    if (width != '') {
      const w = parseInt(width, 10);
      if (!Number.isNaN(w)) {
        _style.width = w;
      }
    }
    if (height != '') {
      const h = parseInt(height, 10);
      if (!Number.isNaN(h)) {
        _style.width = h;
      }
    }

    return (<div className={["vision-canvas-l", className, this.layout === 'inline-block' ? 'vision-canvas-l-inline-block' : ''].join(' ')}
      style={_style}
      onMouseUp={(e) => {
        this.mouseUp(e);
        this.VisionCanvasLBus.pubSub.publish('canvas:mouseup', e);
      }}
      onMouseDown={(e)=>{
        this.clearSelectNodes();
        const target = e.currentTarget;
        this.rect = {
          x: e.clientX - target.offsetLeft,
          y: e.clientY - target.offsetTop
        }
        this.VisionCanvasLBus.pubSub.publish('canvas:click', e);
      }}
      onMouseLeave={(e)=>{
        // this.mouseUp(e);
        this.VisionCanvasLBus.pubSub.publish('canvas:mouseleave', e);
      }}
      onMouseMove={(e) => {
        this.setSelector(e, 'parent');
        const event = e.nativeEvent;
        this.mouseMove(event.clientX, event.clientY);
        e.stopPropagation();
        this.VisionCanvasLBus.pubSub.publish('canvas:mousemove', e);
      }}
      >
        <canvas id="vision-canvas-l-canvas" />
      {this.draw()}
    </div>)
  }

}


