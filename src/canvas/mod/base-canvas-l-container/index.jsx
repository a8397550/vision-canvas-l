import React from 'react';
import { uuid } from '../../../util/index.js';
import { VisionCanvasLBus, AssignToNew } from '../../../component-dispatch-center-bus/index.jsx';
import { MyContainer } from '../../index.jsx';
import './index.less';

export class BaseCanvasLContainer extends React.Component{
    static defaultProps = {
        options: {
            nodes: [],
            nodeParam: {
                className: '',
                style: {
                    width: 200,
                    height: 200,
                }
            }
        },
        VisionCanvasLBus: undefined,
        id: '',
    }

    constructor(props) {
        super(props);
        this.state = {
            nodes: props.options.nodes
        }
        this.VisionCanvasLBus = props.VisionCanvasLBus || VisionCanvasLBus;
        this.VisionCanvasLBus.addObserver(this);
    }

    update(options) {
        console.log(options);
    }

    draw() {
        return this.state.nodes.map((item)=>{
            MyContainer(item.component, item.options, index)
        })
    }

    getClassOrStyle() {
        const { props } = this;
        const { options } = props;
        let style = {};
        if (!options.dropPos) {
            options.dropPos = {};
            options.dropPos.left = 0;
            options.dropPos.top = 0;
            style.left = options.dropPos.left;
            style.right = options.dropPos.right;
        }
        if (!options.nodeParam || typeof options.nodeParam !== 'object') {
            options.nodeParam = {
              className: '',
              style: {
                  width: 200,
                  height: 200,
              },
            }
        }
        if (typeof options.nodeParam === 'object' && typeof options.nodeParam.style === 'object') {
            Object.assign(style, options.nodeParam.style);
        }
        let className = options.nodeParam.className
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