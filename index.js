import { AttributePanesVisionCanvasL } from './src/attribute-panes/index.jsx';
import { VisionCanvasL } from './src/canvas/index.jsx';
import { BaseCanvasLContainer } from './src/canvas/mod/base-canvas-l-container/index.jsx';
import { VisionCanvasLBus, VisionCanvasLComponentDispatchCenterBus, AssignToNew } from './src/component-dispatch-center-bus/index.jsx';
import { ComponentPanesVisionCanvasL } from './src/component-panes/index.jsx';
import { ItemLayer, ComponentNodeDom } from './src/react-dnd/drag-node.jsx';
import { ComponentDropContainer } from './src/react-dnd/drop-container.jsx';
import { DragDropContext } from 'react-dnd'; // react-dnd
import HTML5Backend from 'react-dnd-html5-backend'; // react-dnd的相关方法

export {
    BaseCanvasLContainer,
    VisionCanvasLComponentDispatchCenterBus, // 控制中心构造器
    AssignToNew, // 深拷贝方法
    VisionCanvasLBus, // 控制中心
    VisionCanvasL, // 画布
    ComponentPanesVisionCanvasL, // 组件面板
    AttributePanesVisionCanvasL, // 属性面板
    ItemLayer, // react-dnd 已经配置好的对象，可以自己配置
    ComponentNodeDom, // react-dnd 已经配置好的对象，可以自己配置
    ComponentDropContainer, // react-dnd 已经配置好的对象，可以自己配置
    DragDropContext, // react-dnd
    HTML5Backend, // react-dnd
}
