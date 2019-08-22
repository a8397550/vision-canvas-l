import React from 'react';
import { ItemLayer, ComponentNodeDom } from '../react-dnd/drag-node.jsx';
import { VisionCanvasLBus } from '../component-dispatch-center-bus/index.jsx';

export class ComponentPanesVisionCanvasL extends React.Component {
    render() {
        
        return (<div>
            <ComponentNodeDom options={{
                componentName: 'DemoA',
                options: {},
                ViewNode: <div key={'DemoA'} style={{ position: 'relative' }}>可拖动对象---DemoA</div>
            }} />
            <ComponentNodeDom options={{
                componentName: 'DemoB',
                options: {},
                ViewNode: <div>222</div>
            }} />
            <ItemLayer />
        </div>)
    }
}