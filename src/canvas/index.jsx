import React from 'react';
import { uuid } from '../util/index.js';
import { VisionCanvasLBus } from '../component-dispatch-center-bus/index.jsx';
import './index.less';

const MyContainer = (WrappedComponent, options, index) => <WrappedComponent key={index} {...options} />;

/**
 * @description 画布组件
 */
export class VisionCanvasL extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.nodes = [];
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
            const tempComponent = VisionCanvasLBus.componentPool.filter((item)=>{
                return item.name === node.componentName;
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

    /**
    * @description 画布将节点渲染出来
    */
    draw() {
        return this.nodes.map((item, index) => MyContainer(item.component, item.options, index));
    }

    render() {
        return (<div className="vision-canvas-l" style={{ position: 'relative'}}>
        {this.draw()}
      </div>)
    }

}


