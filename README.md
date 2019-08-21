#vision-canvas-l是什么

#思考

1.使用者，首先在控制中心注册组件 [ComponentA, ComponentB]

在组件面板中会自动生成一个默认的icon的可拖动组件，提供一个setComponentPanse的方法，可以操作组件版本的属性
{
    disabled: boolean, // 值是true的情况下，组件面板，此组件不可拖拽，不允许使用，默认为false
    visibility: boolean, // 值是true的情况下，在组件面板中显示，为false不显示，默认为true
    icon: string | ReactNode | () => ReactNode, // 提示
    tooltipTitle: string | ReactNode | () => ReactNode, // 提示
    width: number | 100%,
    height: number | 100%,
}

在画布中生成一个组件，用名称去匹配组件名，匹配上了，就可以添加了，addNode方法

属性面板是一个双向数据绑定的组件
[
    {}
]

注意，操作时请谨慎，传错值导致的组件渲染失败的情况非常容易发送

#ision-canvas-l的开发历程
> 控制中心
>> 注册组件
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

