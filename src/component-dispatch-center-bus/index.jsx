import React from 'react';
import { uuid } from '../util/index.js';

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

    /**
     * @description 在画布中注册组件
     */
    this.registerComponent = function (component, componentName) {
        try {
            if (component && typeof component === 'function' && componentName) {
                const len = this.componentPool.filter((item)=>{
                    return item.componentName === componentName;
                });
                if (len.length === 0) {
                    this.componentPool.push({
                        componentName,
                        component: component
                    });
                    return;
                } else {
                    throw '组件已经被注册过，无法在次注册!';
                }
            } else {
                throw '参数错误';
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @description 批量注册组件库面板零部件
     */
    this.setPanes = function(arr) {
        try {
            if (arr && Array.isArray(arr)) {
                arr.forEach((item) => {
                    this.registerComponentPanes(item);
                });
            } else {
                throw '参数错误'; 
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @description 注册组件库面板零部件
     */
    this.registerComponentPanes = function (options) {
        try {
            if (options && options.componentName) {
                const panesObj = {
                    componentPanesId: `${options.id}-${uuid()}`,
                    groupId: options.groupId || 0,
                    disabled: options.disabled || false, // 值是true的情况下，组件面板，此组件不可拖拽，不允许使用，默认为false
                    visibility: options.visibility || true, // 值是true的情况下，在组件面板中显示，为false不显示，默认为true
                    icon: options.icon || null, // 提示
                    tooltipTitle: options.tooltipTitle, // 提示
                    width: options.width || '100%',
                    height: options.width || 40,
                    componentName: options.componentName,
                    componentParam: options.componentParam || {},
                    ViewNode: options.ViewNode || <div>组件占位符</div>
                };
                this.componentPanes.push(panesObj);
                return panesObj;
            } else {
                throw '参数错误';   
            }
        } catch (error) {
            console.error(error);
        }
    }

    this.getGroupPanes = function(groupId) {
        const arr = [];
        this.componentPanes.forEach((item)=>{
           if (item.groupId === groupId) {
               arr.push(item);
           } 
        });
        return arr;
    }

    /**
     * @description 设置组件库面板零部件属性
     */
    this.setComponentPanesAttr = function (componentPanesId, options) {
        try {
            if (componentPanesId) {
                const len = this.componentPanes.filter((item)=>{
                    return item.componentPanesId === componentPanesId;
                });
                if (len.length > 0) {
                    Object.assign(len[0], options);
                } else {
                    throw '无此组件，不能设置组件面板元素属性';
                }
            } else {
                throw '参数错误';
            }   
        } catch (error) {
            console.error(error);
        }
    }
    
}

export const VisionCanvasLBus = new VisionCanvasLComponentDispatchCenterBus();