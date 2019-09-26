import React from 'react';
import { VisionCanvasLBus, AssignToNew } from '../../../component-dispatch-center-bus/index.jsx';
import { MyContainer, GetClassOrStyle } from '../../index.jsx';
import './index.less';

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
        this.state = {
            nodes: props.nodeParam.nodes || [],
            id: props.id,
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
    console.log(`没有这个节点${id}，删除失败`);
    return false;
  }


    componentWillUnmount() {
        this.VisionCanvasLBus.removeObserver(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) { // 相当于执行一次setState(null) setState({...})
        if (nextProps.nodeParam.nodes !== prevState.nodes) {
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
            debugger;
            this.setState({
              nodes: AssignToNew(nodes),
            });
          }
        }
      }

    draw() {
        return this.state.nodes.map((item, index) => {
            const {
                style,
                className,
            } = GetClassOrStyle(item, true, this);
            return (
                <div 
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        this.props.setSelectNodes(item);
                        this.VisionCanvasLBus.notify({
                            options: item.options,
                            id: item.id,
                            type: 'canvas'
                        });
                        this.id = item.id;
                    }}
                    onMouseMove={(e)=>{
                        if (this.id) {
                            this.removeNode(this.id);
                            this.props.selectNodesMove(AssignToNew(item));
                            this.id = null;
                            e.stopPropagation();
                        }
                    }}
                    onMouseUp={()=>{
                        this.id = null;
                    }}
                    key={item.id}
                    id={item.id} 
                    style={style} 
                    className={["vision-node-border", className].join(' ')}>
                        {MyContainer(item.component, item.options, index)}
                </div>
            );
        })
    }

    setHoverBackgroundColor(color, notColor) {
        this.backgroundColor = color;
        this.backgroundNotColor = notColor;
    }

    render() {
        const { props } = this;
        return (<div 
            onMouseOver={(e)=>{
                // 标记着他被选中
                const flag = this.props.getMoveStatus(this.state.id);
                if (flag) {
                    e.currentTarget.style.backgroundColor = this.backgroundColor || 'rgba(255, 0, 0, 0.27)';
                    e.stopPropagation();
                }
            }}
            onMouseOut={(e)=>{
                const flag = this.props.getMoveStatus(this.state.id);
                if (flag === true && typeof flag !== 'object') {
                    e.currentTarget.style.backgroundColor = this.backgroundNotColor || '';
                    e.stopPropagation();
                }
            }}
            id={props.id} 
            className={["base-canvas-l-container"].join(' ')}>
            {this.draw()}
        </div>);
    }

}