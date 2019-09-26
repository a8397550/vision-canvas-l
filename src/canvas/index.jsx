import React from 'react';
import { uuid } from '../util/index.js';
import { VisionCanvasLBus, AssignToNew } from '../component-dispatch-center-bus/index.jsx';
import './index.less';
import { BaseCanvasLContainer, OverFlowEnum } from './mod/base-canvas-l-container/index.jsx';

export function Verification(_style, _key, item) {
  if (typeof _style[_key] !== 'number') {
    if ((/\D/g).test(_style[_key])) {
      const regExp = /^[0-9]*\.?[0-9]+(p|px|%)?$/
      const bool = regExp.test(_style[_key]);
      if (bool) {
        if (_style[_key].indexOf('%') === -1) {
          _style[_key] = parseInt(_style[_key], 10);
        }
      } else {
        if ((new item.component) instanceof BaseCanvasLContainer ||
          item.component === BaseCanvasLContainer) {
          _style[_key] = _worh;
        } else {
          delete _style[_key];
        }
      }
    } else {
      _style[_key] = Number(_style[_key]);
    }
  }
}

/**
* @description 容器的属性补全
* */
export function ParamReplenish(node, props) {
  let style = {};
  let className = '';
  const _worh = 200;
  if ((new node.component) instanceof BaseCanvasLContainer || node.component === BaseCanvasLContainer) {
    let { nodeParam, dropPos } = props;
    if (!dropPos) {
      props.dropPos = {};
      dropPos = props.dropPos;
      dropPos.left = 0;
      dropPos.top = 0;
      style.left = dropPos.left;
      style.right = dropPos.right;
    }
    if (!nodeParam || typeof nodeParam !== 'object') {
      props.nodeParam = {
        className: '',
        overflow: 0, // OverFlowEnum的取值
        nodes: [],
        style: {
          width: _worh,
          height: _worh,
          overflow: OverFlowEnum[0],
        },
      }
      nodeParam = props.nodeParam;
    }
    if (typeof nodeParam === 'object' && typeof nodeParam.style === 'object') {
      if (!nodeParam.style.width) { nodeParam.style.width = _worh }
      if (!nodeParam.style.height) { nodeParam.style.height = _worh }
      if (!nodeParam.style.overflow) {
        nodeParam.style.overflow = OverFlowEnum[0];
        nodeParam.overflow = 0;
      } else {
        if (OverFlowEnum.indexOf(nodeParam.style.overflow) !== -1) {
          nodeParam.overflow = OverFlowEnum.indexOf(nodeParam.style.overflow);
        } else {
          nodeParam.overflow = 0;
        }
      }
      Object.assign(style, nodeParam.style);
      Verification(style, 'width', node);
      Verification(style, 'height', node);
    }
    if (!nodeParam.overflow) {
      nodeParam.overflow = 0;
    }
    className = nodeParam.className
    className = typeof className !== 'undefined' ? className : '';
  }
  return { className, style };
}

export const MyContainer = (WrappedComponent, options, index) => <WrappedComponent key={index} {...options} />;

export function GetClassOrStyle(item, moveFlag, self) {
  let style = {};
  if (moveFlag && item.options.dropPos) { // 允许拖动，并且定位属性存在
    const flag = self.layout === 'inline-block' ? true : false;
    if (flag) {
      item.options.dropPos.left = 0;
      item.options.dropPos.top = 0;
    }
    style.left = item.options.dropPos.left;
    style.top = item.options.dropPos.top;
  } else if (moveFlag) { // 允许拖动
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
  // 被选中状态赋值，长度大于0表示选中状态
  let lenSelector = self.selectNodes.filter((temp) => {
    return temp.id === item.id;
  }).length;
  Verification(style, 'width', item);
  Verification(style, 'height', item);
  className.concat(lenSelector ? ' vision-node-active' : '')
  return {
    style,
    className,
  }
}

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
    this.VisionCanvasLBus.addObserver(this);
    this._itemPreview = null;
    this.itemPreview = null;
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
      nextState.height !== this.state.height ||
      this.itemPreview !== null ||
      this._itemPreview !== this.itemPreview
    ) {
      if (this._itemPreview !== this.itemPreview) {
        // 解决引用问题相同的情况，
        // 当我触发某个事件时，this._itemPreview === this.itemPreview，当我释放时那个事件时this.itemPreview = null,
        // 此时左右两边不相等，为了让他重回，然后重制this._itemPreview === this.itemPreview的状态
        this._itemPreview = null;
        this.itemPreview = null;
      }
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.setCanvas();
    this.VisionCanvasLBus.pubSub.publish('canvas:didmount');
  }

  componentWillUnmount() {
    this.VisionCanvasLBus.removeObserver(this);
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

  static getDerivedStateFromProps(nextProps, prevState) {
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
      const { nodes } = this.state;
      node = AssignToNew(node);
      const tempComponent = this.VisionCanvasLBus.componentPool.filter((item) => {
        return item.componentName === node.componentName;
      });
      node.component = tempComponent[0].component;
      node.id = uuid();
      node.options.id = node.id;
      // 给容器加入方法
      if ((new node.component) instanceof BaseCanvasLContainer ||
        node.component === BaseCanvasLContainer) {
        node.options.setSelectNodes = this.setSelectNodes;
        node.options.selectNodesMove = this.selectNodesMove;
        node.options.getMoveStatus = this.getMoveStatus;
        node.options.getSelectNodes = this.getSelectNodes;
      }
      // 容器补充参数
      ParamReplenish(node, node.options);
      // 计算加入到那个容器中
      const bool = this.containerAdd(nodes, node, false);
      if (bool) {
        this.setState({
          nodes: AssignToNew(nodes),
        });
        return node;
      }

      nodes.push(node);
      this.setState({
        nodes: AssignToNew(nodes),
      }, () => {
      });

      return node;
    }
    throw "添加组件异常，没有component"
  }

  setXorYvalue(containerBool, node) {
    let nodes;
    if (!containerBool) {
      nodes = this.state.nodes;
    } else {
      nodes = node.options.nodeParam.nodes;
    }
    for (let i = 0; i < nodes.length; i += 1) {
      const item = nodes[i];
      if ((new item.component) instanceof BaseCanvasLContainer ||
        item.component === BaseCanvasLContainer) {
        if (containerBool) {
          item.options.dropPos.x = (node.options.dropPos.x || node.options.dropPos.left) + item.options.dropPos.left;
          item.options.dropPos.y = (node.options.dropPos.y || node.options.dropPos.top) + item.options.dropPos.top;
        }
        this.setXorYvalue(true, item);
      }
      if (containerBool) {
        item.options.dropPos.x = (node.options.dropPos.x || node.options.dropPos.left) + item.options.dropPos.left;
        item.options.dropPos.y = (node.options.dropPos.y || node.options.dropPos.top) + item.options.dropPos.top;
      }
    }
  }

  /**
   * @description 加入的是画布根容器中，返回false，加入的是其他容器中返回true，注意加入到其他容器中，这里是引用类型操作，
   * @param containerBool 如果是true表示要加入到其他容器中
   * @param visibleArea 父元素可视区域 
   */
  containerAdd(nodes, node, containerBool, visibleArea) {
    let flag = false;
    if (!nodes || !Array.isArray(nodes)) {
      return flag;
    }
    for (let i = nodes.length - 1; i >= 0; i -= 1) {
      const item = nodes[i];
      const options = item.options;
      const componentFlag = (new item.component) instanceof BaseCanvasLContainer || item.component === BaseCanvasLContainer
      if (componentFlag) {
        let bool;
        // containerBool 是false的情况下，表明当前是根元素，就不考虑可视区域的问题
        if (!containerBool) {
          visibleArea = { // 父亲元素大小
            x: 0,
            y: 0,
            x1: 0 + document.querySelector('.vision-canvas-l').clientWidth,
            y1: 0 + document.querySelector('.vision-canvas-l').clientHeight,
            overflow: OverFlowEnum[0]
          }
        }
        const dom = document.getElementById(item.id);
        const [x, y, x1, y1] = [
          options.dropPos.x || options.dropPos.left, // 组件的左上角x
          options.dropPos.y || options.dropPos.top, // 组件的左上角y
          (options.dropPos.x || options.dropPos.left) + dom.clientWidth, // 组件的右下角x
          (options.dropPos.y || options.dropPos.top) + dom.clientHeight, // 组件的右下角y
        ];

        bool = this.nodeAddTimeWithinLimits({
          x: node.options.dropPos.left,
          y: node.options.dropPos.top,
          x1: node.options.dropPos.left + 50,
          y1: node.options.dropPos.top + 50,
        }, {
            x, y, x1, y1,
          }, visibleArea, containerBool);
        if (bool) { // 表示命中
          containerBool = true;
          visibleArea = {
            x, y, x1, y1,
            overflow: OverFlowEnum[options.nodeParam.overflow]
          }
          flag = this.containerAdd(options.nodeParam.nodes, node, containerBool, visibleArea);
          if (flag) { // 如果flag返回的是true的话，证明还在它的下级.
            return bool;
          } else { // 命中最终结果了
            if (containerBool) {
              flag = true;
              if (!options.nodeParam.nodes || !Array.isArray(options.nodeParam.nodes)) {
                options.nodeParam.nodes = [];
              }

              node.options.dropPos.x = node.options.dropPos.left;
              node.options.dropPos.y = node.options.dropPos.top;
              node.options.dropPos.left -= (options.dropPos.x || options.dropPos.left);
              node.options.dropPos.top -= (options.dropPos.y || options.dropPos.top);
              options.nodeParam.width = undefined;
              options.nodeParam.height = undefined;
              options.nodeParam.nodes.push(node);

              break;
            }
          }
        }
      }
    }
    return flag;
  }

  setSelectNodes = () => {
    this.clearSelectNodes();
    this.selectNodes = [];
  }

  selectNodesMove = (item) => {
    this.itemPreview = item;
    this._itemPreview = item; // 给shouldComponentUpdate
    this.setState({});
  }

  /**
   * @description 计算元素的范围，是否在区域内, 容器嵌套容器还要考虑是否是可视区域的问题，不可视区域不能纳入计算
   * @param {*} item  元素位置
   * @param {*} point 容器的位置
   * @param {*} visibleArea 父元素的可视区域
   * @param {*} containerBool 是不是根容器运算的情况
   */
  nodeAddTimeWithinLimits(item, point, visibleArea, containerBool) {
    if (!containerBool || (visibleArea && OverFlowEnum[visibleArea.overflow] === OverFlowEnum[3])) {
      return item.x - point.x > 0 && item.y - point.y > 0 &&
        point.x1 - item.x1 > 0 && point.y1 - item.y1 > 0
    }
    if (item.x - visibleArea.x < 0) {
      item.x = visibleArea.x;
    }
    if (item.y - visibleArea.y < 0) {
      item.y = visibleArea.y;
    }
    if (item.x1 - visibleArea.x1 > 0) {
      item.x1 = visibleArea.x1;
    }
    if (item.y1 - visibleArea.y1 > 0) {
      item.y1 = visibleArea.y1;
    }
    return item.x - point.x > 0 && item.y - point.y > 0 &&
      point.x1 - item.x1 > 0 && point.y1 - item.y1 > 0
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
    return false;
  }

  getMoveStatus = (id) => {
    return !this.moveObj || (this.moveObj && this.moveObj.move[id])
  }

  mouseUp = (e) => {
    e.stopPropagation();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.rect) {
      const point = this.getRectPoint();
      const vNode = document.getElementsByClassName('vision-node-border');
      if (vNode) {
        const vNodes = Array.prototype.slice.call(vNode)
        for (let i = 0; i < vNodes.length; i += 1) {
          const item = vNodes[i];
          // 画布框选的业务实现
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
        vNodes = vNodes.sort(function (a, b) {
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
    if (this.moveObj && !this.itemPreview) {
      const len = Object.keys(this.moveObj.item);
      // 判断this.moveObj.item被移动对象是不是一个容器，如果是一个容器的化，需要做重新定位处理
      for (let i = 0; i < len.length; i += 1) {
        const item = this.moveObj.item[len[i]];
        const componentFlag = (new item.component) instanceof BaseCanvasLContainer || item.component === BaseCanvasLContainer;
        if (componentFlag) {
          this.setXorYvalue(false);
          break;
        }
      }
      if (len.length === 1) {
        const { nodes } = this.state;
        const bool = this.containerAdd(nodes, this.moveObj.item[len[0]], false, undefined);
        if (bool) {
          this.removeNode(this.moveObj.item[len[0]].id);
          this.setState({
            nodes: AssignToNew(nodes),
          });
        }
      }
    } else if (this.itemPreview) {
      delete this.itemPreview.options.nodeParam.style.left;
      delete this.itemPreview.options.nodeParam.style.top;
      const temp = this.addNode(this.itemPreview);
      const attr = VisionCanvasLBus.getDefaultAttribute(temp.componentName);
      if (attr) {
        VisionCanvasLBus.setAttribute(temp.id, attr.options);
      }
      this.itemPreview = null;
      this.setState({});
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
          // 通知，属性栏要发送变化了
          this.VisionCanvasLBus.notify({
            options: item[target.id].options,
            id: item[target.id].id,
            type: 'canvas'
          });
        })
      }
    }
  }

  update(options) {
    // 只处理属性面板的推送主题
    if (options && options.type !== 'canvas') {
      const { nodes } = this.state;
      const len = nodes.filter((temp) => {
        return temp.id === options.id;
      });
      if (len.length > 0) {
        Object.assign(len[0].options, options.options);
        this.setXorYvalue();
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
      // 默认属性赋值
      const {
        style,
        className,
      } = GetClassOrStyle(item, moveFlag, this);

      return (
        <div
          key={item.id}
          id={item.id}
          onMouseDown={(e) => {
            e.stopPropagation();
            // 通知，属性栏要发送变化了
            this.VisionCanvasLBus.notify({
              options: item.options,
              id: item.id,
              type: 'canvas'
            });
            // 当前被点击元素，是不是选中元素
            const len = this.selectNodes.filter((temp) => {
              return temp.id === item.id;
            });
            // 如果被点击元素不是选中元素，先清除所有元素在加入元素
            if (len.length === 0) {
              this.clearSelectNodes();
              this.selectNodes = [item];
            }
            this.moveObj = {};
            this.moveObj.move = {};
            this.moveObj.item = {};
            this.selectNodes.forEach((temp) => {
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
          onMouseMove={(e) => {
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
          className={["vision-node-border", className].join(' ')}>{MyContainer(item.component, item.options, index)}</div>
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
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      const point = this.getRectPoint();
      this.ctx.strokeRect(point.x, point.y, point.w, point.h);
      this.ctx.fillRect(point.x + 1, point.y + 1, point.w - 2, point.h - 2);
    }
  }

  canvasLMove = (e) => {
    // 框选的方法
    this.setSelector(e, 'parent');
    // 节点移动的方法
    const event = e.nativeEvent;
    this.mouseMove(event.clientX, event.clientY);
    e.stopPropagation();
    this.VisionCanvasLBus.pubSub.publish('canvas:mousemove', e);
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
      onMouseDown={(e) => {
        this.clearSelectNodes();
        const target = e.currentTarget;
        this.rect = {
          x: e.clientX - target.offsetLeft,
          y: e.clientY - target.offsetTop
        }
        this.VisionCanvasLBus.pubSub.publish('canvas:click', e);
      }}
      onMouseLeave={(e) => {
        // this.mouseUp(e);
        this.VisionCanvasLBus.pubSub.publish('canvas:mouseleave', e);
      }}
      onMouseMove={(e) => { this.canvasLMove(e); }}
    >
      <canvas id="vision-canvas-l-canvas" />

      {this.draw()}

      {this.itemPreview ? <div
        onMouseUp={(e) => {
          this.mouseUp(e);
        }}
        onMouseMove={(e) => {
          this.setSelector(e);
          const event = e.nativeEvent;
          if (this.itemPreview && !this.moveObj) {
            this.moveObj = {};
            this.moveObj.move = {};
            this.moveObj.item = {};
            this.moveObj.move[this.itemPreview.id] = {
              x: e.clientX,
              y: e.clientY,
              offsetLeft: this.itemPreview.options.dropPos.x,
              offsetTop: this.itemPreview.options.dropPos.y
            }
            this.moveObj.item[this.itemPreview.id] = this.itemPreview;
          }
          this.mouseMove(event.clientX, event.clientY);
          e.stopPropagation();
          this.VisionCanvasLBus.pubSub.publish('node:mousemove', e);
        }}
        id={this.itemPreview.id}
        className="vision-node-active vision-canvas-l-item-preview"
        style={Object.assign({}, this.itemPreview.options.nodeParam.style, {
          position: 'absolute',
          left: this.itemPreview.options.dropPos.x,
          top: this.itemPreview.options.dropPos.y,
          zIndex: 99
        })}
      >
        {MyContainer(this.itemPreview.component, this.itemPreview.options, this.itemPreview.id)}
      </div>
        : null}
    </div>)
  }
}


