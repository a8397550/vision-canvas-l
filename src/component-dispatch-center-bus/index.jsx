import React from 'react';
import { uuid } from '../util/index.js';


// 观察者列表（目标）
class ObserverList {
  constructor() {
    this.observerList = []
  }
  add(observer) {
    return this.observerList.push(observer);
  }
  remove(observer) {
    this.observerList = this.observerList.filter(ob => ob !== observer);
  }
  count() {
    return this.observerList.length;
  }
  get(index) {
    return this.observerList[index];
  }
}

function AssignToNew(a) {
  // 没有副作用的
  function toNew(target, source) {
    const keys = Object.keys(source);
    keys.forEach((key) => {
      if (typeof source[key] === 'object') {
        if (Array.isArray(source[key])) {
          target[key] = [];
          toNew(target[key], source[key]);
        } else if (source[key] === null) {
          target[key] = null;
        } else if (source[key] === undefined) {
          target[key] = undefined;
        } else {
          target[key] = {};
          toNew(target[key], source[key]);
        }
      } else {
        target[key] = source[key]
      }
    });
  }
  let obj;
  if (typeof a === 'object') {
    if (Array.isArray(a)) {
      obj = [];
    } else if (a === null) {
      obj = null;
    } else if (a === undefined) {
      obj = undefined;
    } else {
      obj = {};
    }
    toNew(obj, a)
  } else {
    obj = a;
  }
  return obj;
}

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
  // 注册属性面板
  this.attributePool = [];
  // 属性控制器, 通过id控制
  this.nodeAttribute = {};

  this.observers = new ObserverList();

  this.addObserver = function (observer) {
    this.observers.add(observer);
  }

  this.removeObserver = function (observer) {
    this.observers.remove(observer);
  }

  this.notify = function (options) {
    let obCount = this.observers.count();
    for (let index = 0; index < obCount; index++) {
      this.observers.get(index).update(options);
    }
  }

  this.getAttribute = function (id) {
    return this.nodeAttribute[id];
  }

  this.setAttribute = function (id, options) {
    try {
      if (id && options) {
        this.nodeAttribute[id] = options;
      } else {
        throw '参数错误';
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * @description 基础属性面板注册，设置预设值
   */
  this.registerComponentAttribute = function (componentName, options) {
    try {
      if (componentName && options && Array.isArray(options)) {
        const arr = [];
        options.forEach((temp) => {
          if (temp.attributeParam) {
            temp.attributeParam = AssignToNew(temp.attributeParam);
          }
          arr.push({
            key: temp.key, // 必填，可以是key | key.key.key的形式
            type: temp.type || 'text', // JSX.Element 如果传入text会自动渲染一个<Input type="text" /> 允许传入一个自定义的JSX.Element, 不传默认是 'text'
            title: temp.title || '', // options.title | JSX.Element
            id: temp.id || '',
            parentId: temp.parentId || '',
            icon: temp.icon || '', // options.icon 只支持JSX.Element
            disabled: temp.disabled || false, // 值是true的情况下，禁用表单
            visibility: temp.visibility || true, // 值是true的情况下，在组件面板中显示，为false不显示，默认为true,
            value: undefined,
            attributeParam: temp.attributeParam || {},
          });
        });
        this.attributePool.push({
          componentName: componentName,
          options: arr,
        });
      } else {
        throw '参数错误';
      }
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * @description 获取注册过的属性面板的组件的预设值
   */
  this.getDefaultAttribute = function (componentName) {
    try {
      if (componentName) {
        const len = this.attributePool.filter((item) => {
          return item.componentName === componentName;
        });
        if (len.length > 0) {
          return AssignToNew(len[0]);
        }
        return null;
      } else {
        throw '参数错误';
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * @description 在画布中注册组件
   */
  this.registerComponent = function (component, componentName) {
    try {
      if (component && typeof component === 'function' && componentName) {
        const len = this.componentPool.filter((item) => {
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
  this.setPanes = function (arr) {
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
        if (options.componentParam) {
          options.componentParam = AssignToNew(options.componentParam)
        }
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
          ViewNode: options.ViewNode || <div>组件占位符</div>,
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

  this.getGroupPanes = function (groupId) {
    const arr = [];
    this.componentPanes.forEach((item) => {
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
        const len = this.componentPanes.filter((item) => {
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