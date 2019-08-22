#vision-canvas-l是什么
vision-canvas-l致力打造一个简单的，可复用的，可视化搭建平台，可以通过vision-canvas-l快速的搭建一个可视化的构建环境
<br>
### vision-canvas-l的优点
1.不对画布中的组件做任何限制，你可以完全自定义你想要的组件，通过react制作组件，之后只需要在控制中心注册即可，注册方法非常简单
```javascript
import { VisionCanvasLBus } from './component-dispatch-center-bus/index.jsx'; // 导入控制中心
VisionCanvasLBus.registerComponent(DemoA);
VisionCanvasLBus.registerComponent(DemoB);
```
2.在控制中心中注册面板组件的零部件，可以快速形成，一个可拖拽的，可添加到画布中的组件，零部件完全采用自定义的方式，控制非常灵活。
```javascript
VisionCanvasLBus.registerComponentPanes({
    componentName: DemoA, // 你注册过的组件的名称
    componentParam: {}, // 可选参数，你组件所需要的参数，如果是{} 可以不写这个
    ViewNode: <div key={_item.id} style={{ position: 'relative' }}>{_item.title}</div>, // 可选参数，展示在组件面板中的样子
    groupId: item.parentId, // 可选参数，编组id，编好组后可以通过VisionCanvasLBus.getGroupPanes(groupId) // 获取到组件面板零部件的数组
});
```
注意：组面面板要配合ComponentPanesVisionCanvasL，ComponentNodeDom结合使用才可以哦
ComponentNodeDom组件下面例子中的参数都是必不可少的哦，data可以没有，通过data{ disabled: true } 可以禁用拖动哦
```javascript
import { ComponentPanesVisionCanvasL } from './component-panes/index.jsx';
import { ComponentNodeDom } from './react-dnd/drag-node.jsx'; // 此组件属于react-dnd的功能封装出来的组件，有相关技术者可以复写此组件
// 这里结合了antd的Collapse，一起使用哦，
const dom = this.arr.map((item)=>{
    const panesArr = VisionCanvasLBus.getGroupPanes(item.parentId);
    return (<Panel header={item.title} key={item.parentId}>
    {
    panesArr.map((_item) => <ComponentNodeDom key={_item.componentPanesId} options={{
        ViewNode: _item.ViewNode,
        componentName: _item.componentName,
        options: _item.componentParam,
        data: _item
    }}  />)
    }
    </Panel>)
})

<ComponentPanesVisionCanvasL>
    <Collapse
    bordered={false}
    defaultActiveKey={['1']}
    key="algorithm"
    >
    {dom}
    </Collapse>
</ComponentPanesVisionCanvasL>
```
3.画布组件的使用
```javascript
// 这四个组合画布
import { VisionCanvasL } from './canvas/index.jsx';
import { ComponentDropContainer } from './react-dnd/drop-container.jsx'; // 此组件属于react-dnd的功能封装出来的组件，有相关技术者可以复写此组件
import { DragDropContext } from 'react-dnd'; // react-dnd
import HTML5Backend from 'react-dnd-html5-backend'; // react-dnd的相关方法

const IndexTemplate = DragDropContext(HTML5Backend)(IndexTemplateContainer);
class IndexTemplateContainer extends React.Component {
    render() {
        return (<div>
            <ComponentDropContainer addNode={(node)=>{
              this.VisionCanvasL.addNode(node)
            }}>
              <VisionCanvasL ref={(refCanvas)=>{
                if (refCanvas) {
                  this.VisionCanvasL = refCanvas;
                }
              }} />
            </ComponentDropContainer>
        </div>)
    }
}
```
4.属性面板的使用
略，因为现在还没有属性面板，哇哈哈哈

### 核心组件
VisionCanvasLBus 控制中心
VisionCanvasL 画布组件
ComponentPanesVisionCanvasL 面板组件
AttributePanesVisionCanvasL 属性面板


#思考

1.使用者，首先在控制中心注册组件 [ComponentA, ComponentB]<br>
2.控制中心注册面板组件<br>
3.<br>

...下列步骤，暂时省略<br>


<br>注意，操作时请谨慎，传错值导致的组件渲染失败的情况非常容易发生<br>

#依赖
组件是基于react开发的所以依赖react<br>
组件库面板的拖动与关联画布的放下操作依赖react-dnd<br>
还使用了ant design，antd的组件<br>

#ision-canvas-l的开发历程
> 控制中心
>> 注册组件
>> 注册组件库面板零部件
>> 画布与组件库面板双向通信
>> 画布与属性面板的双向通信

> 画布组件的开发，想要在画布中添加组件，必须先向画布中注入组件的类型，以及组件的options
>> 移动组件
>> 对齐组件
>> 缩放组件
>> 画布的width属性
>> 画布的height属性
>> 添加组件
>> 删除组件

> 组件库侧边栏的开发
>> 布局组件
>>> 容器
>>> 分栏
>>> 选项卡（tab组件）
>>> 分组
>> 基础组件
>>> label组件
>>> 图片组件
>>> 图标
>>> 按钮
>>> 链接
>> 图表组件

> 属性栏的开发
>> options定义属性的操作方式

