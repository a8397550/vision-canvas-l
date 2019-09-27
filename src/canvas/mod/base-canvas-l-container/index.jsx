import React from 'react';
import { VisionCanvasLBus, AssignToNew } from '../../../component-dispatch-center-bus/index.jsx';
import { GetClassOrStyle, ParamReplenish } from '../../index.jsx';
import { BaseNode } from '../base-node/index.jsx';
/**
 * @description 是否允许出界的枚举值，只有visible才允许出界
 */
export const OverFlowEnum = ['hidden', 'auto', 'scroll', 'visible'];

export class BaseCanvasLContainer extends React.Component {
  static defaultProps = {
    dropPos: {
      left: 0, // 距离外层容器的位置
      top: 0, // 距离外层容器的位置
    },
    nodeParam: { // 预设属性
      overflow: 0, // 必选参数，会被方法进行参数补全
      nodes: [],
      className: '',
      style: {
        width: 200, //  必选参数，会被方法进行参数补全
        height: 200, // 必选参数，会被方法进行参数补全
        overflow: OverFlowEnum[0], // 必选参数，会被方法进行参数补全
      }
    },
    VisionCanvasLBus: undefined,
    id: '',
  }

  constructor(props) {
    super(props);
    if (props === undefined) {
      return;
    }
    const nodes = props.nodeParam ? props.nodeParam.nodes : [];
    this.state = {
      nodes: nodes || [],
      id: props.id,
      className: 'canvas-l-container-node',
    }
    this.VisionCanvasLBus = props.VisionCanvasLBus || VisionCanvasLBus;
    this.VisionCanvasLBus.addObserver(this);
    this.selectNodes = [];
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
          nodes,
        });
        return true;
      }
    }
    return false;
  }


  componentWillUnmount() {
    this.VisionCanvasLBus.removeObserver(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) { // 相当于执行一次setState(null) setState({...})
    if (nextProps.nodeParam.nodes && nextProps.nodeParam.nodes !== prevState.nodes) {
      return {
        nodes: nextProps.nodeParam.nodes
      }
    }
    return null;
  }

  update(options) {
    // 不处理自己发的，以及画布发的
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

  baseNodeMouseDown = (e, item) => {
    e.stopPropagation();
    this.VisionCanvasLBus.notify({
      options: item.options,
      id: item.id,
      type: 'canvas'
    });
    this.id = item.id;
  }

  baseNodeMouseMove = (e, item) => {
    if (this.id) {
      this.rootMouseOut(e);
      this.removeNode(this.id);
      this.props.selectNodesMove(AssignToNew(item));
      this.id = null;
      e.stopPropagation();
    }
  }

  baseNodeMouseUp = () => {
    this.id = null;
  }

  draw() {
    return this.state.nodes.map((item, index) => {
      const {
        style,
        className,
      } = GetClassOrStyle(item, true, this);
      return BaseNode({
        mouseDown: (e) => { this.baseNodeMouseDown(e, item); },
        mouseMove: (e) => { this.baseNodeMouseMove(e, item); },
        mouseUp: this.baseNodeMouseUp,
        selectChecked: (e) => { this.props.setSelectNodesChecked(e, item) },
        id: item.id,
        style,
        className,
        item,
        index
      });
    })
  }

  rootMouseOver = (e) => {
    // 标记着他被选中
    const flag = this.props.getMoveStatus(this.state.id);
    if (flag) {
      e.currentTarget.style.backgroundColor = this.backgroundColor || 'rgba(255, 0, 0, 0.27)';
      e.stopPropagation();
    }
  }

  rootMouseOut = (e) => {
    let dom = e.currentTarget;
    if (!dom.classList.contains(this.state.className)) {
      dom = dom.parentElement;
    };
    const flag = this.props.getMoveStatus(this.state.id);
    if ((flag === true && typeof flag !== 'object')) {
      dom.style.backgroundColor = this.backgroundNotColor || '';
      e.stopPropagation();
    }
  }

  setHoverBackgroundColor(color, notColor) {
    this.backgroundColor = color;
    this.backgroundNotColor = notColor;
  }

  render() {
    const { props } = this;
    return (<div
      onMouseOver={this.rootMouseOver}
      onMouseOut={this.rootMouseOut}
      id={props.id}
      className={this.state.className}
      style={{overflow: OverFlowEnum[props.nodeParam.overflow]}}
      >
      {this.draw()}
    </div>);
  }

}