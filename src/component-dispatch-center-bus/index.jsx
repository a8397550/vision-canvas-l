/**
 * 组件调度中心总线
 * 对画布组件，组件面板，属性面板进行数据管理
 * 
 * 
 */
function VisionCanvasLComponentDispatchCenterBus() {
    // 注册组件列表，画布添加组件时，判断存在不存在
    this.componentPool = [];
    // 组件面板列表
    this.componentPanes = [];

    this.registerComponent = function (component) {
        if (component && typeof component === 'function') {
            const len = this.componentPool.filter((item)=>{
                return item.name === component.name;
            });
            if (len.length === 0) {
                this.componentPool.push({
                    name: component.name,
                    component: component
                });
                this.componentPanes.push({
                    disabled: false, // 值是true的情况下，组件面板，此组件不可拖拽，不允许使用，默认为false
                    visibility: true, // 值是true的情况下，在组件面板中显示，为false不显示，默认为true
                    icon: '', // 提示
                    tooltipTitle: undefined, // 提示
                    width: '100%',
                    height: 40,
                    name: component.name,
                });
            } else {
                throw '组件已经被注册过，无法在次注册!';
            }
        }
    }

    this.setComponentPanesAttr = function (componentName, options) {
        if (componentName) {
            const len = this.componentPanes.filter((item)=>{
                return item.name === componentName;
            });
            if (len.length > 0) {
                Object.assign(len[0], options);
            } else {
                throw '无此组件，不能设置组件面板元素属性';
            }
        }
    }
    
}

export const VisionCanvasLBus = new VisionCanvasLComponentDispatchCenterBus();