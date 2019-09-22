import React from 'react';
import { uuid } from '../../../util/index.js';
import { VisionCanvasLBus, AssignToNew } from '../../../component-dispatch-center-bus/index.jsx';
import { MyContainer } from '../../index.jsx';
import './index.less';

export class BaseCanvasLContainer extends React.Component{
    static defaultProps = {
        nodeParam: {
            width: 200, // 实际宽高值
            height: 200, // 实际宽高值
            nodes: [],
            className: '',
            style: {
                width: 200, // 样式宽高值
                height: 200, // 样式宽高值，可能是px单位或百分比单位，或vw等单位
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
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        debugger;
        if (nextProps.nodeParam.nodes !== prevState.nodes) {
            return {
                nodes: nextProps.nodeParam.nodes
            }
        }
        return null;
    }

    update(options) {
        console.log(options);
    }

    draw() {
        debugger
        return this.state.nodes.map((item, index)=>{
            return MyContainer(item.component, item.options, index)
        })
    }

    getClassOrStyle() {
        const { props } = this;
        const { nodeParam, dropPos } = props;
        let style = {};
        if (!dropPos) {
            dropPos = {};
            dropPos.left = 0;
            dropPos.top = 0;
            style.left = dropPos.left;
            style.right = dropPos.right;
        }
        if (!nodeParam || typeof nodeParam !== 'object') {
            nodeParam = {
              className: '',
              style: {
                  width: 200,
                  height: 200,
              },
            }
        }
        if (typeof nodeParam === 'object' && typeof nodeParam.style === 'object') {
            Object.assign(style, nodeParam.style);
        }
        let className = nodeParam.className
        className = typeof className !== 'undefined' ? className : '';
        return { className, style };
    }

    render() {
        const { className, style } = this.getClassOrStyle();
        return(<div style={style} className={["base-canvas-l-container", className].join(' ')}>
            {this.draw()}
        </div>);
    }

}